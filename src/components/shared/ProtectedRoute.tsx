import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentAdminProfile } from '../../services/admin.ts'
import { recordSecurityEvent } from '../../services/securityEvents.ts'
import { supabase } from '../../services/supabase.ts'
import LoadingState from '../ui/LoadingState.tsx'

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const syncAuthState = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const profile = session ? await getCurrentAdminProfile() : null

      if (session && !profile) {
        void recordSecurityEvent('unauthorized_admin_access')
      }

      if (!isMounted) return

      setIsAuthenticated(Boolean(profile))
      setLoading(false)
    }

    void syncAuthState()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const profile = session ? await getCurrentAdminProfile() : null

      if (session && !profile) {
        void recordSecurityEvent('unauthorized_admin_access')
      }

      if (!isMounted) return

      setIsAuthenticated(Boolean(profile))
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <LoadingState label="Verifying admin access" />
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
