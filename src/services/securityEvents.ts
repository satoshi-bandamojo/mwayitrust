import { hasSupabaseConfig, supabase } from './supabase'

export type ClientSecurityEvent = 'admin_login_failed' | 'unauthorized_admin_access'

export async function recordSecurityEvent(eventType: ClientSecurityEvent): Promise<void> {
  if (!hasSupabaseConfig) return

  try {
    const { error } = await supabase.functions.invoke('record-security-event', {
      body: { event_type: eventType },
    })

    if (error) {
      console.warn('Security event reporting failed:', error.message)
    }
  } catch (error) {
    console.warn(
      'Security event reporting failed:',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}
