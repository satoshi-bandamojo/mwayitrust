import { supabase } from './supabase'

export interface CreateDonationPayload {
  donor_name?: string | null
  email: string
  phone?: string | null
  amount: number
  currency?: string
  payment_reference: string
  purpose?: string | null
  donation_type?: string | null
  payment_metadata?: Record<string, unknown> | null
}

export async function createDonation(payload: CreateDonationPayload) {
  const insert = {
    donor_name: payload.donor_name ?? null,
    email: payload.email,
    phone: payload.phone ?? null,
    amount: payload.amount,
    currency: payload.currency ?? 'MWK',
    payment_reference: payload.payment_reference,
    purpose: payload.purpose ?? null,
    donation_type: payload.donation_type ?? null,
    payment_metadata: payload.payment_metadata ?? null,
  }

  const { data, error } = await supabase.from('donations').insert([insert]).select().single()
  return { data, error }
}

export async function getDonationByReference(reference: string) {
  const { data, error } = await supabase.from('donations').select('*').eq('payment_reference', reference).maybeSingle()
  return { data, error }
}

export async function updateDonationStatus(reference: string, status: string, metadata?: Record<string, unknown>) {
  const update: { status: string; payment_metadata?: Record<string, unknown> } = { status }
  if (metadata) update.payment_metadata = metadata
  const { data, error } = await supabase
    .from('donations')
    .update(update)
    .eq('payment_reference', reference)
    .select()
    .single()
  return { data, error }
}
