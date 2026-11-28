import { supabase } from './supabase'

export interface CreateDonationPayload {
  donor_name?: string | null
  email: string
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

export async function confirmDonation(reference: string) {
  const { data, error } = await supabase.functions.invoke<{ success: boolean; status: string }>('confirm-donation', {
    body: { tx_ref: reference },
  })
  return { data, error }
}
