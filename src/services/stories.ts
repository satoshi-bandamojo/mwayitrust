import { supabase } from './supabase.ts'
import type { Story } from '../types/index.ts'

const normalizeStories = (records: Story[] = []) =>
  records.map((story) => ({
    ...story,
    featured: Boolean(story.featured),
    published: story.published !== false,
    cover_image: story.cover_image || story.featured_image || story.image_url || '',
  }))

export const storiesService = {
  async getFeatured() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    const items = normalizeStories((data as Story[]) ?? [])
    return items.sort((a, b) => {
      const da = new Date(a.published_at || a.created_at || '').getTime() || 0
      const db = new Date(b.published_at || b.created_at || '').getTime() || 0
      return db - da
    })
  },

  async getAll() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    const items = normalizeStories((data as Story[]) ?? [])
    return items.sort((a, b) => {
      const da = new Date(a.published_at || a.created_at || '').getTime() || 0
      const db = new Date(b.published_at || b.created_at || '').getTime() || 0
      return db - da
    })
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return normalizeStories([data as Story])[0]
  },
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return normalizeStories([data as Story])[0]
  },
}