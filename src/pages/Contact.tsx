import { Briefcase, Globe2, HeartHandshake, Mail, MessageCircle, MessageSquare, Phone, PlayCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { createContactMessage } from '../services/contactMessages'

const locations = [
  {
    name: 'Mwayi Trust Centre & Campus',
    address: 'Mbvundula Village, TA Kunthembwe, Chileka, Blantyre, Malawi.',
    hours: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 9:00 AM - 1:00 PM', 'Sunday: Closed'],
  },
]

const contactMethods = [
  {
    icon: <Phone size={20} />,
    label: 'Call Us (Malawi)',
    value: 'Sandra Trevethan',
    detail: '+265 881 45 25 54',
    note: 'Available 8 AM - 5 PM (Mon - Fri)',
    href: 'tel:+265881452554',
    primary: true,
  },
  {
    icon: <MessageCircle size={20} />,
    label: 'WhatsApp',
    value: 'Quick Chat',
    detail: '+265 881 45 25 54',
    note: 'Fastest response on mobile',
    href: 'https://wa.me/265881452554?text=Hello%20Mwayi%20Trust,%20I%20would%20like%20to%20learn%20more%20about%20your%20programs.',
    highlight: true,
  },
  {
    icon: <Mail size={20} />,
    label: 'Email Inquiries',
    value: 'sandy.mwayi@gmail.com',
    detail: 'sandy.mwayi@gmail.com',
    note: 'Replies within 24-48 hours',
    href: 'mailto:sandy.mwayi@gmail.com',
  },
  {
    icon: <HeartHandshake size={20} />,
    label: 'Partnerships & Volunteering',
    value: 'Community Desk',
    detail: 'sandy.mwayi@gmail.com',
    note: 'Corporate, church & diaspora sponsorships',
    href: 'mailto:sandy.mwayi@gmail.com?subject=Partnership%20Inquiry%20-%20Mwayi%20Trust',
  },
]

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/mwayitrust', icon: <Globe2 size={20} /> },
  { label: 'Twitter / X', href: 'https://twitter.com/mwayitrust', icon: <MessageSquare size={20} /> },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/mwayitrust', icon: <Briefcase size={20} /> },
  { label: 'YouTube', href: 'https://youtube.com/@mwayitrust', icon: <PlayCircle size={20} /> },
]

const responseTimes = [
  { type: 'Phone calls (Malawi)', duration: 'Instant during hours' },
  { type: 'WhatsApp messages', duration: 'Under 2 hours' },
  { type: 'General inquiries', duration: 'Within 24 hours' },
  { type: 'Partnership proposals', duration: '1-3 business days' },
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
      nextErrors.email = 'Please enter a valid email address'
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
      setErrorMessage('Please check the form fields above.')
      return
    }

    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const { error } = await createContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      })
      if (error) throw error
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try calling or WhatsApping us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-shell">
      <section className="contact-hero welcome-hero">
        <div className="welcome-hero__content">
          <p className="section-kicker">Get in touch</p>
          <h1>We’d love to connect with you.</h1>
          <p>
            Whether you want to sponsor a student, volunteer, or enroll in our vocational training centre in Chileka, our doors and lines are open.
          </p>
        </div>
      </section>

      {/* Quick Mobile Action Bar */}
      <section className="mobile-quick-actions-bar" aria-label="Direct mobile contact options">
        <a href="tel:+265881452554" className="mobile-action-pill mobile-action-pill--call">
          <Phone size={18} />
          <span>Call Us Now</span>
        </a>
        <a
          href="https://wa.me/265881452554?text=Hello%20Mwayi%20Trust,%20I%20would%20like%20to%20learn%20more%20about%20your%20programs."
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-action-pill mobile-action-pill--whatsapp"
        >
          <MessageCircle size={18} />
          <span>WhatsApp Chat</span>
        </a>
      </section>

      <section className="contact-grid">
        <div className="contact-card">
          <h2>Direct contact channels</h2>
          <div className="detail-grid">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className={`detail-item ${method.highlight ? 'detail-item--highlight' : ''}`}
              >
                <div className={`detail-icon ${method.highlight ? 'detail-icon--wa' : ''}`}>
                  {method.icon}
                </div>
                <div className="detail-item-content">
                  <div className="flex items-center justify-between">
                    <strong>{method.label}</strong>
                    {method.highlight && <span className="mobile-fast-badge">Popular</span>}
                  </div>
                  <p className="detail-value-line">{method.detail}</p>
                  <span className="detail-note-line">{method.note}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="contact-card">
          <h2>Our campus & location</h2>
          <div className="location-list">
            {locations.map((location) => (
              <div key={location.name} className="location-card">
                <h3>{location.name}</h3>
                <p className="location-address">{location.address}</p>
                <div className="location-hours-box">
                  <span className="location-hours-title">Working Hours</span>
                  <ul>
                    {location.hours.map((hour) => (
                      <li key={hour}>{hour}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-base font-semibold text-slate-800 mb-2">Response times</h3>
            <div className="response-list">
              {responseTimes.map((item) => (
                <div key={item.type} className="response-item">
                  <span>{item.type}</span>
                  <strong>{item.duration}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-card">
        <div className="contact-form-header">
          <p className="section-kicker">Send an online message</p>
          <h2>Leave us a note</h2>
          <p>Fill out this short form and our team in Blantyre will respond promptly.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <label>
            <span>Your Name</span>
            <input
              type="text"
              autoComplete="name"
              placeholder="e.g. Chimwemwe Banda"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            {errors.name ? <small>{errors.name}</small> : null}
          </label>

          <label>
            <span>Email Address</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="e.g. chimwemwe@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {errors.email ? <small>{errors.email}</small> : null}
          </label>

          <label>
            <span>Your Message</span>
            <textarea
              rows={5}
              placeholder="How can we assist you or collaborate?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <div className="char-counter">{formData.message.length} / 1000 characters</div>
            {errors.message ? <small>{errors.message}</small> : null}
          </label>

          {status === 'success' ? (
            <div className="form-success">
              Zikomo! Your message was sent successfully. We will get back to you soon.
            </div>
          ) : null}
          {status === 'error' ? <div className="form-error">{errorMessage}</div> : null}

          <button type="submit" className="btn btn-primary w-full justify-center min-h-[48px]" disabled={isSubmitting}>
            <Send size={18} />
            <span>{isSubmitting ? 'Sending your message…' : 'Send Message'}</span>
          </button>
        </form>
      </section>

      <section className="contact-social-section">
        <h3 className="text-center font-semibold text-slate-800 mb-3">Connect on social media</h3>
        <div className="social-grid">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="social-link">
              {link.icon}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
