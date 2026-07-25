import { supabase } from './supabase.ts'
import type { EventItem } from '../types/index.ts'

export const eventsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) throw error
    return data as EventItem[]
  },
}
