import { supabase } from './supabase'

export interface CreateDonationPayload {
  donor_name?: string | null
  email: string
  phone?: string | null
  amount: number
  currency?: string
  payment_reference?: string
  purpose?: string | null
  donation_type?: string | null
}

export interface CreateDonationResponse {
  success: boolean
  checkout_url: string
  tx_ref: string
}

export async function createDonation(payload: CreateDonationPayload) {
  const { data, error } = await supabase.functions.invoke<CreateDonationResponse>('create-donation', {
    body: {
      donor_name: payload.donor_name ?? null,
      email: payload.email,
      phone: payload.phone ?? null,
      amount: payload.amount,
      currency: payload.currency ?? 'MWK',
      payment_reference: payload.payment_reference ?? null,
      purpose: payload.purpose ?? null,
      donation_type: payload.donation_type ?? null,
    },
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getDonationByReference(reference: string) {
  const { data, error } = await supabase.from('donations').select('*').eq('payment_reference', reference).maybeSingle()
  return { data, error }
}
