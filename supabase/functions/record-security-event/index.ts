import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const allowedOrigins = new Set(
  (Deno.env.get('SECURITY_EVENT_ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((origin) => {
      try {
        const parsed = new URL(origin.trim())
        return parsed.protocol === 'https:' ||
          (parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname))
          ? parsed.origin
          : ''
      } catch {
        return ''
      }
    })
    .filter(Boolean),
)

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase function environment is missing required credentials.')
}

if (allowedOrigins.size === 0) {
  throw new Error('SECURITY_EVENT_ALLOWED_ORIGINS must contain at least one website origin.')
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
const maximumBodyBytes = 1024
const rateWindowMinutes = 15
const maximumEventsPerIp = 20

const eventConfig = {
  admin_login_failed: {
    route: '/admin/login',
    description: 'Client-reported administrator sign-in failure.',
    severity: 'low',
    highSeverityThreshold: 4,
  },
  unauthorized_admin_access: {
    route: '/admin',
    description: 'Authenticated non-administrator attempted to access the admin portal.',
    severity: 'medium',
    highSeverityThreshold: 2,
  },
} as const

type EventType = keyof typeof eventConfig

function jsonResponse(body: Record<string, string>, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json',
      Vary: 'Origin',
    },
  })
}

function getSourceIp(req: Request): string | null {
  const forwardedIp =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]
  const candidate = forwardedIp?.trim()

  if (!candidate || candidate.length > 45 || !/^[0-9a-f:.]+$/i.test(candidate)) {
    return null
  }

  try {
    const parsed = candidate.includes(':') ? new URL(`http://[${candidate}]`) : new URL(`http://${candidate}`)
    return parsed.hostname ? candidate : null
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

Deno.serve(async (req: Request) => {
  const requestOrigin = req.headers.get('origin') ?? ''
  let origin: string
  try {
    origin = new URL(requestOrigin).origin
  } catch {
    return new Response('Forbidden', { status: 403 })
  }

  if (!allowedOrigins.has(origin)) {
    return new Response('Forbidden', { status: 403 })
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        Vary: 'Origin',
      },
    })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, origin)
  }

  let body: unknown
  try {
    const rawBody = await req.text()
    if (new TextEncoder().encode(rawBody).length > maximumBodyBytes) {
      return jsonResponse({ error: 'Request body is too large' }, 413, origin)
    }
    body = JSON.parse(rawBody)
  } catch {
    return jsonResponse({ error: 'Invalid request' }, 400, origin)
  }

  const eventType = isRecord(body) ? body.event_type : null
  if (typeof eventType !== 'string' || !Object.hasOwn(eventConfig, eventType)) {
    return jsonResponse({ error: 'Unsupported event' }, 400, origin)
  }

  const sourceIp = getSourceIp(req)
  if (!sourceIp) {
    console.warn('Security event was not recorded because the request IP was unavailable.')
    return jsonResponse({ status: 'accepted' }, 202, origin)
  }

  const config = eventConfig[eventType as EventType]
  const bearerToken = req.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  let userId: string | null = null

  if (bearerToken) {
    const { data, error } = await supabaseAdmin.auth.getUser(bearerToken)
    if (!error) {
      userId = data.user?.id ?? null
    }
  }

  if (eventType === 'unauthorized_admin_access') {
    if (!userId) {
      return jsonResponse({ error: 'Authentication required' }, 401, origin)
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Unable to verify security event user:', error.message)
      return jsonResponse({ error: 'Unable to record event' }, 503, origin)
    }

    if (String(profile?.role ?? '').toLowerCase() === 'admin') {
      return jsonResponse({ status: 'ignored' }, 202, origin)
    }
  }

  const windowStart = new Date(Date.now() - rateWindowMinutes * 60 * 1000).toISOString()
  const { count, error: countError } = await supabaseAdmin
    .from('security_events')
    .select('id', { count: 'exact', head: true })
    .eq('event_type', eventType)
    .eq('source_ip', sourceIp)
    .gte('created_at', windowStart)

  if (countError) {
    console.error('Unable to check security event frequency:', countError.message)
    return jsonResponse({ error: 'Unable to record event' }, 503, origin)
  }

  const recentCount = count ?? 0
  if (recentCount >= maximumEventsPerIp) {
    return jsonResponse({ status: 'accepted' }, 202, origin)
  }

  const { error: insertError } = await supabaseAdmin.from('security_events').insert({
    event_type: eventType,
    severity: recentCount >= config.highSeverityThreshold ? 'high' : config.severity,
    source_ip: sourceIp,
    user_id: userId,
    route: config.route,
    description: config.description,
    user_agent: req.headers.get('user-agent')?.slice(0, 512) ?? null,
    metadata: {
      reporter: 'website-client',
      observations_in_window: recentCount + 1,
      window_minutes: rateWindowMinutes,
    },
  })

  if (insertError) {
    console.error('Security event write failed:', insertError.message)
    return jsonResponse({ error: 'Unable to record event' }, 503, origin)
  }

  return jsonResponse({ status: 'recorded' }, 202, origin)
})
