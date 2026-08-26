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
  // ...existing getFeatured, getAll, getById, getBySlug...

  async getFeatured() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('featured', true)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return normalizeStories((data as Story[]) ?? [])
  },

  async getAll() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return normalizeStories((data as Story[]) ?? [])
  },

  async create(story: Partial<Story>) {
    const { data, error } = await supabase
      .from('stories')
      .insert([story])
      .select()
      .single()

    if (error) throw error
    return normalizeStories([data as Story])[0]
  },

  async update(id: string, updates: Partial<Story>) {
    const { data, error } = await supabase
      .from('stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return normalizeStories([data as Story])[0]
  },

  async remove(id: string) {
    const { error } = await supabase.from('stories').delete().eq('id', id)
    if (error) throw error
  },
}