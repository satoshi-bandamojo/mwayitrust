import { Menu, HeartHandshake } from 'lucide-react'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Stories', href: '/stories' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  return (
    <header className="navbar-shell">
      <div className="navbar-inner">
        <a className="brand" href="/">
          <HeartHandshake size={20} />
          <span>Mwayi Trust</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <button className="nav-mobile" type="button" aria-label="Open navigation">
          <Menu size={20} />
        </button>
      </div>
    </header>
  )
}
