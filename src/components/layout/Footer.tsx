import { Globe, Mail, MessageSquare, Phone, Send } from 'lucide-react'

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Stories', href: '/stories' },
  { label: 'Events', href: '/events' },
  { label: 'Administration', href: '/admin' },
]

export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-grid">
        <div>
          <h3>Mwayi Trust</h3>
          <p>Joining Hands Opening Doors.</p>
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
            <li><Mail size={16} /> sandy.mwayi@gmail.com</li>
            <li><Phone size={16} /> +265 881 45 25 54</li>
            <li><Send size={16} /> Mbvundula Village, Blantyre.</li>
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
    </footer>
  )
}
