import { Briefcase, Globe2, Mail, MessageCircle, MessageSquare, Phone, PlayCircle, HeartHandshake } from 'lucide-react'
import { useState } from 'react'

const locations = [
  {
    name: 'Vocational College Campus',
    address: 'Mbvundula Village, Blantyre, Malawi.',
    hours: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 10:00 AM - 2:00 PM', 'Sunday: Closed'],
  },
]

const contactMethods = [
  {
    icon: <Phone size={18} />,
    label: 'Contact',
    value: 'Sandra Trevethan',
    detail: '+265 (0) 881452554',
    note: 'Available 9 AM - 5 PM (Weekdays)',
    href: 'tel:+2650881452554',
  },
  {
    icon: <Mail size={18} />,
    label: 'Email',
    value: 'sandy.mwayi@gmail.com',
    detail: 'sandy.mwayi@gmail.com',
    note: 'Response within 24-48 hours',
    href: 'mailto:sandy.mwayi@gmail.com',
  },
  {
    icon: <MessageCircle size={18} />,
    label: 'WhatsApp',
    value: '+265 1 234 56789',
    detail: '+265 1 234 56789',
    note: 'Quick messages welcome',
    href: 'https://wa.me/265123456789',
  },
  {
    icon: <HeartHandshake size={18} />,
    label: 'Partnerships',
    value: 'sandy.mwayi@gmail.com',
    detail: 'sandy.mwayi@gmail.com',
    note: 'Corporate & sponsorship inquiries',
    href: 'sandy.mwayi@gmail.com',
  },
]

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/mwayitrust', icon: <Globe2 size={20} /> },
  { label: 'Twitter', href: 'https://twitter.com/mwayitrust', icon: <MessageSquare size={20} /> },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/mwayitrust', icon: <Briefcase size={20} /> },
  { label: 'YouTube', href: 'https://youtube.com/@mwayitrust', icon: <PlayCircle size={20} /> },
]

const responseTimes = [
  { type: 'General inquiries', duration: '24-48 hours' },
  { type: 'Partnership requests', duration: '2-5 business days' },
  { type: 'Phone calls', duration: 'Same day (during hours)' },
  { type: 'Emergency / urgent', duration: 'Within 4 hours' },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = { name: '', email: '', message: '' }
    let valid = true

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required'
      valid = false
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters'
      valid = false
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email'
      valid = false
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Message is required'
      valid = false
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = 'Message must be at least 10 characters'
      valid = false
    } else if (formData.message.length > 1000) {
      nextErrors.message = 'Message must be 1000 characters or fewer'
      valid = false
    }

    setErrors(nextErrors)
    return valid
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) {
      setStatus('error')
      setErrorMessage('Please correct the highlighted fields.')
      return
    }

    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 800))
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-shell">
      <section className="contact-hero">
        <div>
          <p className="section-kicker">Contact us</p>
          <h1>We’d love to hear from you.</h1>
          <p>Reach out for partnerships, volunteering, donations, or a simple hello.</p>
        </div>
      </section>

      <section className="contact-grid">
        <div className="contact-card">
          <h2>Our locations</h2>
          <div className="location-list">
            {locations.map((location) => (
              <div key={location.name} className="location-card">
                <h3>{location.name}</h3>
                <p>{location.address}</p>
                <ul>
                  {location.hours.map((hour) => (
                    <li key={hour}>{hour}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-card">
          <h2>Contact details</h2>
          <div className="detail-grid">
            {contactMethods.map((method) => (
              <a key={method.label} href={method.href} className="detail-item">
                <div className="detail-icon">{method.icon}</div>
                <div>
                  <strong>{method.label}</strong>
                  <p>{method.value}</p>
                  <span>{method.note}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-grid">
        <div className="contact-card">
          <h2>Follow us</h2>
          <div className="social-grid">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="social-link">
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="contact-card">
          <h2>Response times</h2>
          <div className="response-list">
            {responseTimes.map((item) => (
              <div key={item.type} className="response-item">
                <span>{item.type}</span>
                <strong>{item.duration}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-form-card">
        <div className="contact-form-header">
          <p className="section-kicker">Contact form</p>
          <h2>Send us a message</h2>
          <p>We usually reply within 24-48 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            <span>Name</span>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            {errors.name ? <small>{errors.name}</small> : null}
          </label>

          <label>
            <span>Email</span>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            {errors.email ? <small>{errors.email}</small> : null}
          </label>

          <label>
            <span>Message</span>
            <textarea rows={7} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
            <div className="char-counter">{formData.message.length} / 1000</div>
            {errors.message ? <small>{errors.message}</small> : null}
          </label>

          {status === 'success' ? <div className="form-success">Message sent. We will get back to you soon.</div> : null}
          {status === 'error' ? <div className="form-error">{errorMessage}</div> : null}

          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send message'}</button>
        </form>
      </section>
    </div>
  )
}
