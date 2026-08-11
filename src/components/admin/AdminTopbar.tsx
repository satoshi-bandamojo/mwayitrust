import { useNavigate } from 'react-router-dom'
import { signOutAdmin } from '../../services/admin.ts'

export default function AdminTopbar() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOutAdmin()
      navigate('/admin/login', { replace: true })
    } catch {
      navigate('/admin/login', { replace: true })
    }
  }

  return (
    <header className="admin-topbar">
      <h2>Administration workspace</h2>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <a href="/">Back to site</a>
        <button type="button" className="btn btn-secondary" onClick={() => void handleSignOut()}>
          Sign out
        </button>
      </div>
    </header>
  )
}
