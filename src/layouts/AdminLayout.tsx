import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar.tsx'
import AdminTopbar from '../components/admin/AdminTopbar.tsx'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-brand-muted dark:bg-slate-950">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminTopbar />
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}