import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentAdminProfile } from '../../services/admin.ts'
import { supabase } from '../../services/supabase.ts'

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

      if (!isMounted) return

      setIsAuthenticated(Boolean(profile))
      setLoading(false)
    }

    void syncAuthState()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const profile = session ? await getCurrentAdminProfile() : null

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
      <div className="page-shell">
        <div className="page-block">
          <p className="section-kicker">Checking access</p>
          <h1>Verifying admin access…</h1>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
