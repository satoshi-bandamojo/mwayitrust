import { supabase } from './supabase.ts'
import type { Subscriber } from '../types/index.ts'

export const subscribersService = {
  async subscribe(email: string): Promise<Subscriber> {
    const payload = {
      email,
      subscribed: true,
      source: 'website',
    }

    const { data, error } = await supabase.from('subscribers').insert(payload).select().single()

    if (error) {
      const message = (error.message ?? '').toLowerCase()
      const isUniqueError =
        error.code === '23505' ||
        message.includes('duplicate') ||
        message.includes('already exists')

      if (isUniqueError) {
        throw new Error("You're already subscribed.")
      }

      throw error
    }

    return data as unknown as Subscriber
  },
}
