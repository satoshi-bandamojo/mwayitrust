import { BookOpen, CalendarDays, HeartHandshake, Image as ImageIcon, Info, Mail, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { label: 'About', href: '/about', icon: Info },
  { label: 'Programs', href: '/programs', icon: BookOpen },
  { label: 'Stories', href: '/stories', icon: BookOpen },
  { label: 'Events', href: '/events', icon: CalendarDays },
  { label: 'Gallery', href: '/gallery', icon: ImageIcon },
  { label: 'Contact', href: '/contact', icon: Mail },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)



  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className="navbar-shell">
        <div className="navbar-inner">
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
            <div className="brand-badge-dot" />
            <span className="brand-name">Mwayi Trust</span>
            <span className="brand-subtext hidden sm:inline">Chileka, Malawi</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav-links" aria-label="Primary navigation">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Zone */}
          <div className="navbar-actions">
            <Link to="/donate" className="navbar-donate-btn">
              <HeartHandshake size={16} />
              <span>Donate</span>
            </Link>

            {/* Mobile Menu Trigger Button */}
            <button
              className="mobile-menu-trigger md:hidden"
              type="button"
              aria-label={menuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {menuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <aside
        className={`mobile-nav-drawer ${menuOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation drawer"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <span className="brand-name">Mwayi Trust</span>
            <span className="text-xs text-slate-500">Mbvundula Village, Chileka</span>
          </div>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="mobile-drawer-link-text">Home Overview</span>
          </NavLink>
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="mobile-drawer-link-icon">
                  <Icon size={18} />
                </div>
                <span className="mobile-drawer-link-text">{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Quick Contact & Action Card for Mobile (Malawi Context) */}
        <div className="mobile-drawer-footer">
          <Link
            to="/donate"
            className="btn btn-primary w-full justify-center mb-3"
            onClick={() => setMenuOpen(false)}
          >
            <HeartHandshake size={18} />
            Support Our Mission
          </Link>

          <div className="mobile-quick-connect">
            <p className="mobile-quick-connect-title">Direct Contact in Malawi</p>
            <a href="tel:+265881452554" className="mobile-quick-connect-item">
              <Phone size={16} />
              <span>+265 881 45 25 54</span>
            </a>
            <a
              href="https://wa.me/265881452554?text=Hello%20Mwayi%20Trust,%20I%20would%20like%20to%20learn%20more%20about%20your%20programs."
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-quick-connect-item mobile-quick-connect-item--wa"
            >
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
