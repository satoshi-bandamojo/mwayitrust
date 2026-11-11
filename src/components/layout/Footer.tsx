import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import logoBlue from '../../assets/logo_blue.png'

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Stories', href: '/stories' },
  { label: 'Events', href: '/events' },
  { label: 'Administration', href: '/admin' },
]

const legalLinks = [
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
]

export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={logoBlue} alt="Mwayi Trust logo" />
          <p>Joining hands. Opening doors.</p>
        </div>
        <div>
          <h4>Quick links</h4>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="contact-list">
            <li><Mail size={16} /><a href="mailto:sandy.mwayi@gmail.com">sandy.mwayi@gmail.com</a></li>
            <li><Phone size={16} /><a href="tel:+265881452554">+265 881 45 25 54</a></li>
            <li className="footer-location"><MapPin size={16} /> Mbvundula Village, Chileka.</li>
          </ul>
        </div>
        <div>
          <h4>Follow us</h4>
          <div className="social-links">
            <a
              href="https://web.facebook.com/profile.php?id=100025107360897"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H7v3.2h2.8V21h3.7Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-back-to-top-row">
        <button
          className="footer-back-to-top"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={16} aria-hidden="true" />
          Back to top
        </button>
      </div>
      <div className="footer-legal-bar">
        <nav aria-label="Legal links">
          {legalLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
