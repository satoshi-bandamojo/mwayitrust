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
const maximumBodyBytes = 16 * 1024

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function mapPaymentStatus(value: unknown): PaymentStatus | null {
  if (typeof value !== 'string') return null

  switch (value.toLowerCase()) {
    case 'success':
    case 'completed':
      return 'completed'
    case 'failed':
      return 'failed'
    case 'cancelled':
    case 'canceled':
      return 'cancelled'
    case 'pending':
    case 'processing':
      return 'pending'
    default:
      return null
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > maximumBodyBytes) {
    return jsonResponse({ error: 'Request body is too large' }, 413)
  }

  let body: unknown
  try {
    const rawBody = await req.text()
    if (new TextEncoder().encode(rawBody).length > maximumBodyBytes) {
      return jsonResponse({ error: 'Request body is too large' }, 413)
    }
    body = JSON.parse(rawBody)
  } catch {
    return jsonResponse({ error: 'Invalid JSON request' }, 400)
  }

  if (!isRecord(body) || typeof body.tx_ref !== 'string' || !body.tx_ref.trim() || body.tx_ref.length > 100) {
    return jsonResponse({ error: 'Invalid transaction reference' }, 400)
  }

  const txRef = body.tx_ref.trim()
  const paychanguSecret = Deno.env.get('PAYCHANGU_SECRET_KEY')
  if (!paychanguSecret) {
    console.error('PAYCHANGU_SECRET_KEY is not configured.')
    return jsonResponse({ error: 'Payment verification is not configured' }, 500)
  }

  try {
    const { data: donation, error: fetchError } = await supabaseAdmin
      .from('donations')
      .select('id, amount, currency, status, payment_metadata')
      .eq('payment_reference', txRef)
      .maybeSingle()

    if (fetchError) {
      console.error('Unable to load donation for confirmation:', fetchError.message)
      return jsonResponse({ error: 'Unable to load donation' }, 500)
    }
    if (!donation) {
      return jsonResponse({ error: 'Donation not found' }, 404)
    }

    if (String(donation.status).toLowerCase() === 'completed') {
      return jsonResponse({ success: true, status: 'completed', tx_ref: txRef }, 200)
    }

    const response = await fetch(`https://api.paychangu.com/verify-payment/${encodeURIComponent(txRef)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${paychanguSecret}`,
      },
      signal: AbortSignal.timeout(10_000),
    })

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      console.error('PayChangu returned an invalid verification response.')
      return jsonResponse({ error: 'Unable to verify payment with PayChangu' }, 502)
    }

    if (!response.ok) {
      console.error('PayChangu transaction verification failed with HTTP status:', response.status)
      return jsonResponse({ error: 'Unable to verify payment with PayChangu' }, 502)
    }

    if (!isRecord(payload) || !isRecord(payload.data)) {
      console.error('PayChangu returned an incomplete verification response.')
      return jsonResponse({ error: 'Unable to verify payment with PayChangu' }, 502)
    }

    const transaction = payload.data
    if (transaction.tx_ref !== txRef) {
      console.error('PayChangu verification reference did not match the donation reference.')
      return jsonResponse({ error: 'Transaction reference mismatch' }, 400)
    }

    const verifiedStatus = mapPaymentStatus(transaction.status)
    if (!verifiedStatus) {
      console.error('PayChangu verification returned an unsupported transaction status.')
      return jsonResponse({ error: 'Unsupported verified payment status' }, 502)
    }

    const verifiedAmount = Number(transaction.amount)
    const expectedAmount = Number(donation.amount)
    const verifiedCurrency = typeof transaction.currency === 'string' ? transaction.currency.toUpperCase() : ''
    const expectedCurrency = typeof donation.currency === 'string' ? donation.currency.toUpperCase() : ''

    if (!Number.isFinite(verifiedAmount) || verifiedAmount !== expectedAmount || verifiedCurrency !== expectedCurrency) {
      console.error('PayChangu verification amount or currency did not match the donation record.')
      return jsonResponse({ error: 'Payment amount or currency mismatch' }, 400)
    }

    const oldMetadata = isRecord(donation.payment_metadata) ? donation.payment_metadata : {}
    const paymentMetadata = {
      ...oldMetadata,
      verified_status: transaction.status,
      verified_at: new Date().toISOString(),
      provider_reference: typeof transaction.reference === 'string' ? transaction.reference : null,
    }

    let updateQuery = supabaseAdmin
      .from('donations')
      .update({ status: verifiedStatus, payment_metadata: paymentMetadata })
      .eq('payment_reference', txRef)

    if (verifiedStatus === 'completed') {
      updateQuery = updateQuery.in('status', ['pending', 'failed', 'cancelled'])
    } else {
      updateQuery = updateQuery.eq('status', 'pending')
    }

    const { data: updatedDonation, error: updateError } = await updateQuery
      .select('status')
      .maybeSingle()

    if (updateError) {
      console.error('Failed to update donation status:', updateError.message)
      return jsonResponse({ error: 'Failed to update donation status' }, 500)
    }

    if (updatedDonation) {
      return jsonResponse({ success: true, status: updatedDonation.status, tx_ref: txRef }, 200)
    }

    const { data: currentDonation, error: currentError } = await supabaseAdmin
      .from('donations')
      .select('status')
      .eq('payment_reference', txRef)
      .maybeSingle()

    if (currentError) {
      console.error('Unable to confirm current donation status:', currentError.message)
      return jsonResponse({ error: 'Unable to confirm donation status' }, 500)
    }
    if (!currentDonation) {
      return jsonResponse({ error: 'Donation not found' }, 404)
    }

    return jsonResponse({ success: true, status: currentDonation.status, tx_ref: txRef }, 200)
  } catch (error) {
    console.error('Donation confirmation failed:', error instanceof Error ? error.message : 'Unknown error')
    return jsonResponse({ error: 'Unable to confirm donation' }, 500)
  }
})
