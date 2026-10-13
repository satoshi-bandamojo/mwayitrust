// @ts-ignore Deno resolves npm: imports; the frontend TypeScript service does not.
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase function environment is missing required credentials.')
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function markSessionFailed(txRef: string, reason: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('donations')
    .update({
      status: 'failed',
      payment_metadata: { session_error: reason, failed_at: new Date().toISOString() },
    })
    .eq('payment_reference', txRef)
    .eq('status', 'pending')

  if (error) {
    console.error('Unable to record payment-session failure:', error.message)
    throw new Error('Unable to update donation status.')
  }
}

const getProviderMessage = (response: unknown): string => {
  if (!response || typeof response !== 'object') return 'Unknown provider error'

  const payload = response as Record<string, unknown>
  const nestedData = payload.data && typeof payload.data === 'object' ? payload.data as Record<string, unknown> : null
  const message = payload.message ?? payload.error ?? nestedData?.message ?? nestedData?.error

  return typeof message === 'string' ? message : 'Unknown provider error'
}

Deno.serve(async (req) => {
  // Handle browser CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const contentLength = Number(req.headers.get('content-length') ?? 0)
    if (contentLength > 16 * 1024) {
      return jsonResponse({ error: 'Request body is too large' }, 413)
    }

    let body: unknown
    try {
      const rawBody = await req.text()
      if (new TextEncoder().encode(rawBody).length > 16 * 1024) {
        return jsonResponse({ error: 'Request body is too large' }, 413)
      }
      body = JSON.parse(rawBody)
    } catch {
      return jsonResponse({ error: 'Invalid JSON request' }, 400)
    }

    if (!isRecord(body)) {
      return jsonResponse({ error: 'Invalid donation details' }, 400)
    }

    const donorName = typeof body.donor_name === 'string' ? body.donor_name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const amount = body.amount
    const currency = typeof body.currency === 'string' ? body.currency.toUpperCase() : 'MWK'
    const purpose = typeof body.purpose === 'string' ? body.purpose.trim() : ''
    const donationType = typeof body.donation_type === 'string' ? body.donation_type.trim() : ''

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) || email.length > 254) {
      return jsonResponse({ error: 'Valid email is required' }, 400)
    }

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return jsonResponse({ error: 'Invalid donation amount' }, 400)
    }

    if (!['MWK', 'USD'].includes(currency)) {
      return jsonResponse({ error: 'Unsupported currency' }, 400)
    }

    if (donorName.length > 160 || phone.length > 40 || purpose.length > 120 || donationType.length > 120) {
      return jsonResponse({ error: 'One or more donation fields are too long' }, 400)
    }

    const paychanguSecret = Deno.env.get('PAYCHANGU_SECRET_KEY')
    if (!paychanguSecret) {
      console.error('PAYCHANGU_SECRET_KEY is not configured.')
      return jsonResponse({ error: 'Payment configuration is missing' }, 500)
    }

    const configuredAppUrl = Deno.env.get('APP_URL')
    let appUrl: URL
    try {
      appUrl = new URL(configuredAppUrl ?? '')
    } catch {
      return jsonResponse({ error: 'Application URL is not configured correctly' }, 500)
    }

    if (appUrl.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(appUrl.hostname)) {
      return jsonResponse({ error: 'Application URL must use HTTPS' }, 500)
    }

    appUrl.pathname = appUrl.pathname.replace(/\/+$/, '')
    appUrl.search = ''
    appUrl.hash = ''

    // -------------------------
    // 2. Generate transaction reference
    // -------------------------

    const txRef = `MT-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`

    // -------------------------
    // 3. Create pending donation
    // -------------------------

    const { error: donationError } = await supabaseAdmin
      .from('donations')
      .insert({
        donor_name: donorName || null,
        email,
        phone: phone || null,
        amount,
        currency,
        payment_reference: txRef,
        purpose: purpose || null,
        donation_type: donationType || null,
        status: 'pending',
      })

    if (donationError) {
      console.error('Donation insert failed:', donationError)

      return new Response(
        JSON.stringify({
          error: 'Unable to create donation',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // -------------------------
    // 5. Call PayChangu
    // -------------------------
    const callbackUrl = new URL('donation-callback', `${appUrl.toString().replace(/\/+$/, '')}/`).toString()
    const returnUrl = new URL('donate', `${appUrl.toString().replace(/\/+$/, '')}/`).toString()

    const paychanguResponse = await fetch(
      'https://api.paychangu.com/payment',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paychanguSecret}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          email,
          first_name: donorName ? donorName.split(/\s+/)[0] : 'Donor',
          last_name: donorName ? donorName.split(/\s+/).slice(1).join(' ') : '',
          callback_url: callbackUrl,
          return_url: returnUrl,
          tx_ref: txRef,

          customization: {
            title: 'Mwayi Trust Donation',
            description: 'Supporting education and opportunity in Malawi',
          },

          meta: {
            donation_reference: txRef,
          },
        }),
      },
    )

    let paychanguData: unknown
    try {
      paychanguData = await paychanguResponse.json()
    } catch {
      if (!paychanguResponse.ok) {
        await markSessionFailed(txRef, `PayChangu HTTP ${paychanguResponse.status} returned an invalid response.`)
        return jsonResponse({ error: 'Unable to create payment session' }, 502)
      }
      await markSessionFailed(txRef, 'PayChangu returned an invalid response.')
      return jsonResponse({ error: 'Payment gateway returned an invalid response' }, 502)
    }

    if (!paychanguResponse.ok) {
      console.error('PayChangu returned HTTP status:', paychanguResponse.status)
      await markSessionFailed(txRef, `PayChangu payment session request failed with HTTP ${paychanguResponse.status}.`)
      return jsonResponse({
        error: 'Unable to create payment session',
        provider_status: paychanguResponse.status,
        provider_message: getProviderMessage(paychanguData),
      }, 502)
    }

    const checkoutUrlValue =
      isRecord(paychanguData) && isRecord(paychanguData.data) ? paychanguData.data.checkout_url : null
    let checkoutUrl: URL
    try {
      checkoutUrl = new URL(typeof checkoutUrlValue === 'string' ? checkoutUrlValue : '')
    } catch {
      await markSessionFailed(txRef, 'PayChangu did not return a valid checkout URL.')
      return jsonResponse({ error: 'Payment gateway did not return a valid checkout URL' }, 502)
    }

    if (checkoutUrl.protocol !== 'https:') {
      await markSessionFailed(txRef, 'PayChangu returned an insecure checkout URL.')
      return jsonResponse({ error: 'Payment gateway returned an invalid checkout URL' }, 502)
    }

    // -------------------------
    // 6. Save PayChangu response
    // -------------------------

    const { error: metadataError } = await supabaseAdmin
      .from('donations')
      .update({
        payment_metadata: {
          checkout_url: checkoutUrl.toString(),
          paychangu: paychanguData,
        },
      })
      .eq('payment_reference', txRef)
      .eq('status', 'pending')

    if (metadataError) {
      console.error('Unable to save PayChangu checkout metadata:', metadataError.message)
      return jsonResponse({ error: 'Unable to save payment session details' }, 500)
    }

    // -------------------------
    // 7. Safe response to frontend
    // -------------------------

    return new Response(
      JSON.stringify({
        success: true,
        checkout_url: checkoutUrl.toString(),
        tx_ref: txRef,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('create-donation error:', error)

    return new Response(
      JSON.stringify({
        error: 'Unexpected server error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
