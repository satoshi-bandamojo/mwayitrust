export type ConsentDocumentType = 'terms_of_use' | 'privacy_notice' | 'marketing_email'
export type ConsentAction = 'accepted' | 'acknowledged' | 'withdrawn'

export interface Database {
  public: {
    Tables: {
      consent_events: {
        Row: {
          id: string
          visitor_id: string | null
          subscriber_id: string | null
          document_type: ConsentDocumentType
          action: ConsentAction
          document_version: string
          document_sha256: string
          source: string
          recorded_at: string
        }
        Insert: {
          id?: string
          visitor_id?: string | null
          subscriber_id?: string | null
          document_type: ConsentDocumentType
          action: ConsentAction
          document_version: string
          document_sha256: string
          source?: string
          recorded_at?: string
        }
        Update: {
          id?: string
          visitor_id?: string | null
          subscriber_id?: string | null
          document_type?: ConsentDocumentType
          action?: ConsentAction
          document_version?: string
          document_sha256?: string
          source?: string
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'consent_events_subscriber_fkey'
            columns: ['subscriber_id']
            isOneToOne: false
            referencedRelation: 'subscribers'
            referencedColumns: ['id']
          },
        ]
      }
      subscribers: {
        Row: {
          id: string
          email: string
          subscribed: boolean
          subscribed_at: string
          source: string | null
        }
        Insert: {
          id?: string
          email: string
          subscribed?: boolean
          subscribed_at?: string
          source?: string | null
        }
        Update: {
          id?: string
          email?: string
          subscribed?: boolean
          subscribed_at?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type ConsentEventInsert = Database['public']['Tables']['consent_events']['Insert']
