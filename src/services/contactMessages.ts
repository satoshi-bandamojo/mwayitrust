import { supabase } from './supabase'

export interface ContactMessagePayload {
  name: string
  email: string
  message: string
}

export async function createContactMessage(payload: ContactMessagePayload) {
  const insert = {
    name: payload.name,
    email: payload.email,
    message: payload.message,
  }

  const { data, error } = await supabase.from('contact_messages').insert([insert]).select().single()
  return { data, error }
}

export async function listContactMessages() {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
  return { data, error }
}
