// @ts-ignore Deno resolves npm: imports; the frontend TypeScript service does not.
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase function environment is missing required credentials.')
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
const jsonHeaders = { 'Content-Type': 'application/json' }
const maximumBodyBytes = 16 * 1024

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function signaturesMatch(expected: string, received: string): boolean {
  if (!/^[0-9a-f]{64}$/i.test(received)) return false

  let difference = 0
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ received.toLowerCase().charCodeAt(index)
  }
  return difference === 0
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

async function verifySignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody))
  const expected = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return signaturesMatch(expected, signature.trim())
}

async function readBody(req: Request): Promise<string | null> {
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > maximumBodyBytes) return null

  const rawBody = await req.text()
  if (new TextEncoder().encode(rawBody).length > maximumBodyBytes) return null
  return rawBody
}

async function verifyTransaction(txRef: string, secret: string): Promise<Record<string, unknown>> {
  const response = await fetch(`https://api.paychangu.com/verify-payment/${encodeURIComponent(txRef)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    signal: AbortSignal.timeout(10_000),
  })

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new Error('PayChangu returned an invalid verification response.')
  }

  if (!response.ok) {
    console.error('PayChangu transaction verification failed with HTTP status:', response.status)
    throw new Error('PayChangu could not verify the transaction.')
  }

  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new Error('PayChangu returned an incomplete verification response.')
  }

  return payload.data
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const signature = req.headers.get('Signature') ?? req.headers.get('X-Paychangu-Signature')
  const webSecret = Deno.env.get('PAYCHANGU_WEB_SECRET')
  const paychanguSecret = Deno.env.get('PAYCHANGU_SECRET_KEY')

  if (!webSecret || !paychanguSecret) {
    console.error('PayChangu webhook or API secret is not configured.')
    return jsonResponse({ error: 'Webhook is not configured' }, 500)
  }

  if (!signature) {
    return jsonResponse({ error: 'Missing signature header' }, 401)
  }

  try {
    const rawBody = await readBody(req)
    if (rawBody === null) {
      return jsonResponse({ error: 'Request body is too large' }, 413)
    }

    if (!(await verifySignature(rawBody, signature, webSecret))) {
      return jsonResponse({ error: 'Invalid signature' }, 401)
    }

    let payload: unknown
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload' }, 400)
    }

    if (!isRecord(payload) || typeof payload.tx_ref !== 'string' || payload.tx_ref.length > 100) {
      return jsonResponse({ error: 'Invalid transaction reference' }, 400)
    }

    const webhookStatus = mapPaymentStatus(payload.status)
    if (!webhookStatus) {
      return jsonResponse({ error: 'Unsupported payment status' }, 400)
    }

    const { data: donation, error: fetchError } = await supabaseAdmin
      .from('donations')
      .select('id, amount, currency, status, payment_metadata')
      .eq('payment_reference', payload.tx_ref)
      .maybeSingle()

    if (fetchError) {
      console.error('Unable to load donation for verified webhook:', fetchError.message)
      return jsonResponse({ error: 'Unable to load donation' }, 500)
    }

    if (!donation) {
      return jsonResponse({ error: 'Donation not found' }, 404)
    }

    const verifiedTransaction = await verifyTransaction(payload.tx_ref, paychanguSecret)
    if (verifiedTransaction.tx_ref !== payload.tx_ref) {
      console.error('PayChangu verification reference did not match the webhook reference.')
      return jsonResponse({ error: 'Transaction reference mismatch' }, 400)
    }

    const verifiedStatus = mapPaymentStatus(verifiedTransaction.status)
    if (!verifiedStatus) {
      console.error('PayChangu verification returned an unsupported transaction status.')
      return jsonResponse({ error: 'Unsupported verified payment status' }, 502)
    }

    const verifiedAmount = Number(verifiedTransaction.amount)
    const expectedAmount = Number(donation.amount)
    const verifiedCurrency =
      typeof verifiedTransaction.currency === 'string' ? verifiedTransaction.currency.toUpperCase() : ''
    const expectedCurrency = typeof donation.currency === 'string' ? donation.currency.toUpperCase() : ''

    if (!Number.isFinite(verifiedAmount) || verifiedAmount !== expectedAmount || verifiedCurrency !== expectedCurrency) {
      console.error('PayChangu verification amount or currency did not match the donation record.')
      return jsonResponse({ error: 'Payment amount or currency mismatch' }, 400)
    }

    const nextStatus = verifiedStatus
    if (webhookStatus !== verifiedStatus) {
      console.warn('Webhook status differed from the verified PayChangu transaction status; using verified status.')
    }

    const oldMetadata = isRecord(donation.payment_metadata) ? donation.payment_metadata : {}
    const paymentMetadata = {
      ...oldMetadata,
      webhook_status: payload.status,
      verified_status: verifiedTransaction.status,
      webhook_received_at: new Date().toISOString(),
      verified_at: new Date().toISOString(),
      provider_reference: typeof verifiedTransaction.reference === 'string' ? verifiedTransaction.reference : null,
    }

    let updateQuery = supabaseAdmin
      .from('donations')
      .update({ status: nextStatus, payment_metadata: paymentMetadata })
      .eq('payment_reference', payload.tx_ref)

    if (nextStatus === 'completed') {
      updateQuery = updateQuery.in('status', ['pending', 'failed', 'cancelled'])
    } else {
      updateQuery = updateQuery.eq('status', 'pending')
    }

    const { data: updatedDonation, error: updateError } = await updateQuery
      .select('id, status')
      .maybeSingle()

    if (updateError) {
      console.error('Failed to update donation status:', updateError.message)
      return jsonResponse({ error: 'Failed to update donation status' }, 500)
    }

    if (!updatedDonation) {
      const { data: currentDonation, error: currentError } = await supabaseAdmin
        .from('donations')
        .select('status')
        .eq('payment_reference', payload.tx_ref)
        .maybeSingle()

      if (currentError) {
        console.error('Unable to confirm current donation status:', currentError.message)
        return jsonResponse({ error: 'Unable to confirm donation status' }, 500)
      }

      if (!currentDonation) {
        return jsonResponse({ error: 'Donation not found' }, 404)
      }

      if (String(currentDonation.status).toLowerCase() !== 'pending') {
        return jsonResponse({
          success: true,
          message: 'Donation already has a terminal status',
          tx_ref: payload.tx_ref,
          status: currentDonation.status,
        }, 200)
      }

      return jsonResponse({ error: 'Donation status was not updated' }, 500)
    }

    return jsonResponse({
      success: true,
      message: 'Webhook processed successfully',
      tx_ref: payload.tx_ref,
      status: nextStatus,
    }, 200)
  } catch (error) {
    console.error('Webhook processing failed:', error instanceof Error ? error.message : 'Unknown error')
    return jsonResponse({ error: 'Unable to process webhook' }, 500)
  }
})
