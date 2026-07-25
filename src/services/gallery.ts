import { supabase } from './supabase.ts'
import type { GalleryImage } from '../types/index.ts'

export const galleryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as GalleryImage[]
  },
}
