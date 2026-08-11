import { supabase } from './supabase.ts'

export type AdminProfile = {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
}

export type ContactMessageRecord = {
  id: number | string
  name: string
  email: string
  message: string
  created_at: string
}

export type DonationRecord = {
  id: number | string
  name: string
  email: string
  amount: number
  date: string
  status: 'Pending' | 'Verified'
}

const isMissingTableError = (error: { code?: string; message?: string }) => {
  return ['42P01', 'PGRST205', '42703'].includes(error.code ?? '')
}

const normalizeContactMessage = (record: Record<string, unknown>): ContactMessageRecord => ({
  id: Number(record.id ?? 0) || String(record.id ?? 'unknown'),
  name: String(record.name ?? record.full_name ?? 'Unknown sender'),
  email: String(record.email ?? ''),
  message: String(record.message ?? record.content ?? ''),
  created_at: String(record.created_at ?? record.createdAt ?? new Date().toISOString()),
})

const normalizeDonation = (record: Record<string, unknown>): DonationRecord => ({
  id: Number(record.id ?? 0) || String(record.id ?? 'unknown'),
  name: String(record.name ?? record.donor_name ?? 'Anonymous donor'),
  email: String(record.email ?? ''),
  amount: Number(record.amount ?? record.total ?? 0),
  date: String(record.date ?? record.created_at ?? new Date().toISOString()),
  status: String(record.status ?? '').toLowerCase() === 'verified' ? 'Verified' : 'Pending',
})

export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  const { data, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    if ('code' in profileError && profileError.code === 'PGRST116') {
      return null
    }

    throw profileError
  }

  if (!data || String(data.role ?? '').toLowerCase() !== 'admin') {
    return null
  }

  return data as AdminProfile
}

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw error
  }

  const profile = await getCurrentAdminProfile()

  if (!profile) {
    await supabase.auth.signOut()
    throw new Error('This account is not registered as an admin in the profiles table.')
  }

  return data
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getContactMessages(): Promise<ContactMessageRecord[]> {
  const tableNames = ['contact_messages', 'messages', 'contacts']

  for (const tableName of tableNames) {
    const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false })

    if (!error) {
      return (data ?? []).map((record) => normalizeContactMessage(record as Record<string, unknown>))
    }

    if (!isMissingTableError(error)) {
      throw error
    }
  }

  return []
}

export async function deleteContactMessage(id: number | string) {
  const tableNames = ['contact_messages', 'messages', 'contacts']

  for (const tableName of tableNames) {
    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (!error) {
      return
    }

    if (!isMissingTableError(error)) {
      throw error
    }
  }
}

export async function getDonations(): Promise<DonationRecord[]> {
  const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false })

  if (error) {
    if (isMissingTableError(error)) {
      return []
    }

    throw error
  }

  return (data ?? []).map((record) => normalizeDonation(record as Record<string, unknown>))
}

export async function updateDonationStatus(id: number | string, status: 'Verified' | 'Pending') {
  const { error } = await supabase.from('donations').update({ status }).eq('id', id)

  if (error) {
    if (isMissingTableError(error)) {
      return
    }

    throw error
  }
}

export async function deleteDonation(id: number | string) {
  const { error } = await supabase.from('donations').delete().eq('id', id)

  if (error) {
    if (isMissingTableError(error)) {
      return
    }

    throw error
  }
}

export async function getDashboardSummary() {
  const names = ['stories', 'events', 'gallery', 'subscribers']
  const counts: Record<string, number> = {}

  for (const name of names) {
    const { data, error } = await supabase.from(name).select('id', { count: 'exact' })

    if (error) {
      if (isMissingTableError(error)) {
        counts[name] = 0
        continue
      }

      throw error
    }

    counts[name] = Array.isArray(data) ? data.length : 0
  }

  const { data: messageData, error: messagesError } = await supabase.from('contact_messages').select('id', { count: 'exact' })

  if (messagesError && !isMissingTableError(messagesError)) {
    throw messagesError
  }

  counts.messages = Array.isArray(messageData) ? messageData.length : 0

  return {
    stories: counts.stories ?? 0,
    events: counts.events ?? 0,
    gallery: counts.gallery ?? 0,
    subscribers: counts.subscribers ?? 0,
    messages: counts.messages ?? 0,
  }
}
