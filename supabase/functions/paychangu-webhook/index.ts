import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
// @ts-ignore Deno resolves npm: imports; the frontend TypeScript service does not.
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

/**
 * PayChangu Webhook Handler
 * 
 * Receives payment notifications from PayChangu and verifies them using HMAC-SHA256.
 * Only updates donation status if signature is valid and payment details match.
 */
serve(async (req) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // -------------------------
    // 1. Get signature from header
    // -------------------------
    const signature = req.headers.get('Signature') || req.headers.get('X-Paychangu-Signature')

    if (!signature) {
      console.error('Missing Signature header')
      return new Response(
        JSON.stringify({ error: 'Missing signature header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // -------------------------
    // 2. Get raw body for verification
    // -------------------------
    const rawBody = await req.text()

    // -------------------------
    // 3. Verify HMAC signature
    // -------------------------
    const webSecret = Deno.env.get('PAYCHANGU_WEB_SECRET')

    if (!webSecret) {
      console.error('PAYCHANGU_WEB_SECRET not configured')
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify HMAC-SHA256
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // Compare signatures (case-insensitive for hex comparison)
    if (computedSignature.toLowerCase() !== signature.toLowerCase()) {
      console.error('Invalid signature:', { received: signature, computed: computedSignature })
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // -------------------------
    // 4. Parse payload
    // -------------------------
    let payload
    try {
      payload = JSON.parse(rawBody)
    } catch (e) {
      console.error('Invalid JSON payload:', e)
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { tx_ref, amount, currency, status: rawWebhookStatus } = payload
    const webhookStatus = typeof rawWebhookStatus === 'string' ? rawWebhookStatus.toLowerCase() : ''

    if (!tx_ref) {
      console.error('Missing tx_ref in payload')
      return new Response(
        JSON.stringify({ error: 'Missing transaction reference' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!['success', 'failed', 'cancelled'].includes(webhookStatus)) {
      console.error('Unsupported webhook status:', rawWebhookStatus)
      return new Response(
        JSON.stringify({ error: 'Unsupported payment status' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Webhook received for tx_ref:', tx_ref, 'status:', webhookStatus)

    // -------------------------
    // 5. Find donation by tx_ref
    // -------------------------
    const { data: donation, error: fetchError } = await supabaseAdmin
      .from('donations')
      .select('*')
      .eq('payment_reference', tx_ref)
      .single()

    if (fetchError || !donation) {
      console.error('Donation not found for tx_ref:', tx_ref, fetchError)
      return new Response(
        JSON.stringify({ error: 'Donation not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // -------------------------
    // 6. Verify amount and currency
    // -------------------------
    if (Number(donation.amount) !== Number(amount)) {
      console.error('Amount mismatch:', { expected: donation.amount, received: amount })
      return new Response(
        JSON.stringify({ error: 'Amount mismatch' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (donation.currency !== currency) {
      console.error('Currency mismatch:', { expected: donation.currency, received: currency })
      return new Response(
        JSON.stringify({ error: 'Currency mismatch' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // -------------------------
    // 7. Map webhook status to donation status
    // -------------------------
    const donationStatus = webhookStatus === 'success' ? 'completed' : webhookStatus

    // A later provider retry must not undo a confirmed payment.
    if (donation.status === 'completed' && donationStatus !== 'completed') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Donation was already completed',
          tx_ref,
          status: donation.status,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // -------------------------
    // 8. Update donation status
    // -------------------------
    const { error: updateError } = await supabaseAdmin
      .from('donations')
      .update({
        status: donationStatus,
        payment_metadata: {
          ...donation.payment_metadata,
          webhook_status: webhookStatus,
          webhook_received_at: new Date().toISOString(),
          verified: true,
        },
      })
      .eq('payment_reference', tx_ref)

    if (updateError) {
      console.error('Failed to update donation:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update donation' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Donation updated:', tx_ref, '→', donationStatus)

    // -------------------------
    // 9. Return success response
    // -------------------------
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        tx_ref,
        status: donationStatus,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
