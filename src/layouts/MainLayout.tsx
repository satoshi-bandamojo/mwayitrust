import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.tsx'
import Footer from '../components/layout/Footer.tsx'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-brand-text dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}