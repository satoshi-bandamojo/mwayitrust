export interface PaychanguCallbackParams {
  tx_ref?: string
  status?: string
  [key: string]: string | undefined
}

/**
 * Extract payment callback parameters from URL
 * Paychangu redirects with tx_ref and status
 */
export function extractPaymentCallbackParams(): PaychanguCallbackParams {
  const params = new URLSearchParams(window.location.search)
  return {
    tx_ref: params.get('tx_ref') ?? undefined,
    status: params.get('status') ?? undefined,
  }
}

