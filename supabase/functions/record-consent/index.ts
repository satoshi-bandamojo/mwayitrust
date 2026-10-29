import { createClient } from '@supabase/supabase-js'
import type { ConsentEventInsert, Database } from '../_shared/database.types.ts'
import { privacyNotice, termsOfUse } from '../_shared/legalPolicies.ts'

type DenoRuntime = {
  env: {
    get(name: string): string | undefined
  }
  serve(handler: (req: Request) => Response | Promise<Response>): void
}

const deno = (globalThis as typeof globalThis & { Deno: DenoRuntime }).Deno

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = deno.env.get('SUPABASE_URL')
const serviceRoleKey = deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase function environment is missing required credentials.')
}

const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey)

function jsonResponse(body: Record<string, string>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function sha256(value: unknown): Promise<string> {
  const serialized = JSON.stringify(value)
  if (serialized === undefined) {
    throw new Error('Consent document could not be serialized.')
  }

  const bytes = new TextEncoder().encode(serialized)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  let body: unknown
  try {
    const rawBody = await req.text()
    if (new TextEncoder().encode(rawBody).length > 1024) {
      return jsonResponse({ error: 'Request is too large' }, 413)
    }
    body = JSON.parse(rawBody)
  } catch {
    return jsonResponse({ error: 'Invalid JSON request' }, 400)
  }

  if (!body || typeof body !== 'object' || !('visitor_id' in body)) {
    return jsonResponse({ error: 'A visitor ID is required' }, 400)
  }

  const visitorId = (body as { visitor_id: unknown }).visitor_id
  if (
    typeof visitorId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId)
  ) {
    return jsonResponse({ error: 'Invalid visitor ID' }, 400)
  }

  try {
    const documentActions = [
      { document: termsOfUse, action: 'accepted' },
      { document: privacyNotice, action: 'acknowledged' },
    ] as const
    const events: ConsentEventInsert[] = await Promise.all(
      documentActions.map(async ({ document, action }) => ({
        visitor_id: visitorId,
        subscriber_id: null,
        document_type: document.type,
        action,
        document_version: document.version,
        document_sha256: await sha256(document),
        source: 'website',
      })),
    )

    const { error } = await supabaseAdmin
      .from('consent_events')
      .upsert(events, {
        onConflict: 'visitor_id,document_type,document_version,action',
        ignoreDuplicates: true,
      })

    if (error) {
      console.error('Consent ledger write failed:', error)
      return jsonResponse({ error: 'Unable to record agreement' }, 500)
    }

    return jsonResponse({ status: 'recorded' }, 200)
  } catch (error) {
    console.error('Consent processing failed:', error)
    return jsonResponse({ error: 'Unable to record agreement' }, 500)
  }
})
