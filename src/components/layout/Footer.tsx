import { Globe, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
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
            <a href="#" aria-label="Website"><Globe size={18} /></a>
            <a href="#" aria-label="Messages"><MessageSquare size={18} /></a>
            <a href="#" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
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
