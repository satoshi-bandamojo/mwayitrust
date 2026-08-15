import { supabase } from './supabase.ts'
import type { EventItem } from '../types/index.ts'

const normalizeEvents = (records: EventItem[] = []) =>
  records.map((event) => ({
    ...event,
    image: event.image || event.image_url || event.cover_image || '',
  }))

export const eventsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) throw error
    return normalizeEvents((data as EventItem[]) ?? [])
  },
}
