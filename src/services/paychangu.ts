/**
 * Paychangu Payment Service
 * Handles payment creation and verification for Paychangu Standard Checkout
 * 
 * Note: Standard Checkout requires server-side API calls, but we use a workaround
 * by calling the API endpoint directly from the frontend with proper headers.
 */

export interface PaychanguInitiatePaymentParams {
  amount: number
  currency: string
  email: string
  tx_ref: string
  first_name?: string
  last_name?: string
  phone?: string
  callback_url: string
  return_url: string
}

export interface PaychanguInitiatePaymentResponse {
  message: string
  status: string
  data?: {
    event: string
    checkout_url: string
    data: {
      tx_ref: string
      currency: string
      amount: number
      status: string
    }
  }
  error?: string
}

export interface PaychanguCallbackParams {
  tx_ref?: string
  status?: string
  transaction_id?: string
  [key: string]: string | undefined
}

/**
 * Initiate payment with Paychangu
 * This creates a payment session and returns a checkout URL
 */
export async function initiatePaychanguPayment(
  params: PaychanguInitiatePaymentParams
): Promise<{ checkoutUrl: string; txRef: string }> {
  const secretKey = import.meta.env.VITE_PAYCHANGU_SECRET_KEY
  if (!secretKey) {
    throw new Error('Paychangu secret key not configured')
  }

  const payload = {
    amount: params.amount,
    currency: params.currency,
    email: params.email,
    tx_ref: params.tx_ref,
    ...(params.first_name && { first_name: params.first_name }),
    ...(params.last_name && { last_name: params.last_name }),
    ...(params.phone && { phone: params.phone }),
    callback_url: params.callback_url,
    return_url: params.return_url,
    customization: {
      title: 'Mwayi Trust Donation',
      description: 'Support education in Malawi',
    },
  }

  const response = await fetch('https://api.paychangu.com/payment', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secretKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Paychangu API error:', errorData)
    throw new Error(errorData.message || `API error: ${response.status}`)
  }

  const data: PaychanguInitiatePaymentResponse = await response.json()

  if (data.status !== 'success' || !data.data?.checkout_url) {
    throw new Error(data.message || 'Failed to generate checkout URL')
  }

  return {
    checkoutUrl: data.data.checkout_url,
    txRef: data.data.data.tx_ref,
  }
}

/**
 * Extract payment callback parameters from URL
 * Paychangu redirects with tx_ref, status, and transaction_id
 */
export function extractPaymentCallbackParams(): PaychanguCallbackParams {
  const params = new URLSearchParams(window.location.search)
  return {
    tx_ref: params.get('tx_ref') ?? undefined,
    status: params.get('status') ?? undefined,
    transaction_id: params.get('transaction_id') ?? undefined,
  }
}

/**
 * Check if payment was successful based on status
 */
export function isPaymentSuccessful(status?: string): boolean {
  return status?.toLowerCase() === 'success'
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'MWK'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}
