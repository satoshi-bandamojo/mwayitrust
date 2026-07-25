import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      from() {
        return {
          select() {
            return {
              eq() {
                return {
                  order: async () => ({ data: [], error: null }),
                  single: async () => ({ data: null, error: null }),
                }
              },
              order: async () => ({ data: [], error: null }),
            }
          },
        }
      },
    } as unknown as ReturnType<typeof createClient>)