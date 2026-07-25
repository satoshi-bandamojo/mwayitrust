import { supabase } from './supabase.ts'
import type { Story } from '../types/index.ts'

export const storiesService = {
  async getFeatured() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Story[]
  },

  async getAll() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Story[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Story
  },
}