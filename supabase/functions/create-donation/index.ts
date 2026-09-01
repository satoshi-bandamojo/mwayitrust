import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
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

    const body = await req.json()

    const {
      donor_name,
      email,
      phone,
      amount,
      currency = 'MWK',
      purpose,
      donation_type,
    } = body

    // -------------------------
    // 1. Validate input
    // -------------------------

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid donation amount' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    if (!['MWK', 'USD'].includes(currency)) {
      return new Response(
        JSON.stringify({ error: 'Unsupported currency' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

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
        donor_name: donor_name || null,
        email,
        phone: phone || null,
        amount,
        currency,
        payment_reference: txRef,
        purpose: purpose || null,
        donation_type: donation_type || null,
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
    // 4. Get PayChangu secret
    // -------------------------

    const paychanguSecret = Deno.env.get('PAYCHANGU_SECRET_KEY')

    if (!paychanguSecret) {
      return new Response(
        JSON.stringify({
          error: 'Payment configuration is missing',
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

    const appUrl = Deno.env.get('APP_URL')

    if (!appUrl) {
      return new Response(
        JSON.stringify({
          error: 'Application URL is not configured',
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

    const callbackUrl = `${appUrl}/donation-callback`
    const returnUrl = `${appUrl}/donate`

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
          first_name: donor_name ? donor_name.split(' ')[0] : 'Donor',
          last_name: donor_name ? donor_name.split(' ').slice(1).join(' ') : '',
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
      }
    )

    const paychanguData = await paychanguResponse.json()

    if (!paychanguResponse.ok) {
      console.error('PayChangu error:', paychanguData)

      // Payment session wasn't created.
      await supabaseAdmin
        .from('donations')
        .update({
          status: 'failed',
          payment_metadata: {
            paychangu_error: paychanguData,
          },
        })
        .eq('payment_reference', txRef)

      return new Response(
        JSON.stringify({
          error: 'Unable to create payment session',
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const checkoutUrl = paychanguData?.data?.checkout_url

    if (!checkoutUrl) {
      console.error('No checkout URL:', paychanguData)

      return new Response(
        JSON.stringify({
          error: 'Payment gateway did not return a checkout URL',
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // -------------------------
    // 6. Save PayChangu response
    // -------------------------

    await supabaseAdmin
      .from('donations')
      .update({
        payment_metadata: {
          checkout_url: checkoutUrl,
          paychangu: paychanguData,
        },
      })
      .eq('payment_reference', txRef)

    // -------------------------
    // 7. Safe response to frontend
    // -------------------------

    return new Response(
      JSON.stringify({
        success: true,
        checkout_url: checkoutUrl,
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
