import { supabase } from './supabase.ts'

export const subscribersService = {
  async subscribe(email: string): Promise<void> {
    const payload = {
      email,
      subscribed: true,
      source: 'website',
    }

    const { error } = await supabase.from('subscribers').insert(payload)

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
  },
}
