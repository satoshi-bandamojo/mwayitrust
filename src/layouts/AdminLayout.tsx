import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar.tsx'
import AdminTopbar from '../components/admin/AdminTopbar.tsx'

export default function AdminLayout() {
  return (
    <div className="admin-layout-shell min-h-screen bg-brand-muted dark:bg-slate-950">
      <div className="admin-layout-content">
        <AdminSidebar />
        <div className="admin-main-panel">
          <AdminTopbar />
          <div className="admin-main-panel__body p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}