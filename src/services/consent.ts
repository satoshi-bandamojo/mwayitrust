import { privacyNotice, termsOfUse } from '../../supabase/functions/_shared/legalPolicies.ts'

export const termsVersion = termsOfUse.version
export const privacyVersion = privacyNotice.version

export const consentService = {
  async recordWebsiteAcceptance(visitorId: string): Promise<void> {
    const { supabase } = await import('./supabase.ts')
    const { error } = await supabase.functions.invoke('record-consent', {
      body: { visitor_id: visitorId },
    })

    if (error) throw error
  },
}
