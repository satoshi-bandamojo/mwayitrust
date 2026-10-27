import { ArrowRight, HeartHandshake, Landmark, ShieldCheck, Smartphone } from 'lucide-react'
import { useMemo, useState } from 'react'
import { createDonation } from '../services/donations'

type DonationTierType = 'learning_materials' | 'student_term' | 'student_year' | 'community_champion'
type SelectedTierValue = DonationTierType | 'custom' | ''

interface DonationTier {
  type: DonationTierType
  amount: number
  label: string
  description: string
  emoji: string
}

interface PaymentMethodOption {
  name: string
  description: string
  icon: 'smartphone' | 'landmark'
}

const donationTiers: DonationTier[] = [
  {
    type: 'learning_materials',
    amount: 30000,
    label: 'Learning materials',
    description: 'Provide books, stationery, and learning tools for students.',
    emoji: '📚',
  },
  {
    type: 'student_term',
    amount: 60000,
    label: 'Support one term',
    description: 'Keep one student in school for a full term.',
    emoji: '🎓',
  },
  {
    type: 'student_year',
    amount: 180000,
    label: 'Support one year',
    description: 'Sponsor a student through an entire academic year.',
    emoji: '🌟',
  },
  {
    type: 'community_champion',
    amount: 500000,
    label: 'Change a community',
    description: 'Strengthen local learning hubs and long-term opportunity.',
    emoji: '🌍',
  },
]

const paymentMethods: PaymentMethodOption[] = [
  { name: 'Airtel Money', description: 'Mobile money', icon: 'smartphone' },
  { name: 'TNM Mpamba', description: 'Mobile money', icon: 'smartphone' },
  { name: 'Bank transfer', description: 'Bank payment', icon: 'landmark' },
]

const minCustomAmount = 500

const initialForm = {
  donor_name: '',
  email: '',
  phone: '',
}

export default function Donate() {
  const [selectedTier, setSelectedTier] = useState<SelectedTierValue>('')
  const [customAmount, setCustomAmount] = useState('')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({
    amount: '',
    donor_name: '',
    email: '',
    phone: '',
  })
  const [submitMessage, setSubmitMessage] = useState('')

  const finalAmount = useMemo(() => {
    if (selectedTier === 'custom') {
      const parsed = Number(customAmount)
      return Number.isFinite(parsed) && parsed >= minCustomAmount ? parsed : 0
    }

    const tier = donationTiers.find((option) => option.type === selectedTier)
    return tier?.amount ?? 0
  }, [customAmount, selectedTier])

  const clearErrors = () => {
    setErrors({ amount: '', donor_name: '', email: '', phone: '' })
  }

  const validate = () => {
    const nextErrors = {
      amount: '',
      donor_name: '',
      email: '',
      phone: '',
    }

    let valid = true

    if (!selectedTier) {
      nextErrors.amount = 'Please choose a giving level before continuing.'
      valid = false
    }

    if (selectedTier === 'custom') {
      const parsed = Number(customAmount)
      if (!customAmount || !Number.isFinite(parsed) || parsed < minCustomAmount) {
        nextErrors.amount = `Please enter an amount of at least MK ${minCustomAmount.toLocaleString()}.`
        valid = false
      }
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required.'
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.'
      valid = false
    }

    setErrors(nextErrors)
    return valid
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      setSubmitMessage('')
      return
    }

    ;(async () => {
      setSubmitMessage('Saving donation...')

      const payload = {
        donor_name: form.donor_name || null,
        email: form.email,
        phone: form.phone || null,
        amount: finalAmount,
        currency: 'MWK',
        purpose: selectedTier === 'custom' ? 'custom' : selectedTier || null,
        donation_type: selectedTier === 'custom' ? 'custom' : selectedTier || null,
      }

      try {
        setSubmitMessage('Creating donation and preparing payment...')

        const { data, error } = await createDonation(payload)
        if (error) {
          console.error('Failed to create donation', error)
          setSubmitMessage('Failed to create donation. Please try again.')
          return
        }

        if (!data?.checkout_url) {
          setSubmitMessage('Payment link was not returned. Please try again.')
          return
        }

        window.location.href = data.checkout_url
      } catch (err) {
        console.error('Failed to create donation session', err)
        setSubmitMessage(`Error: ${err instanceof Error ? err.message : 'Failed to create donation session. Please try again.'}`)
      }
    })()
  }

  return (
    <div className="donate-shell">
      <section className="donate-hero welcome-hero">
        <div className="donate-hero-content welcome-hero__content">
          <p className="section-kicker">Make a lasting impact</p>
          <h1>Give today and help students thrive.</h1>
          <p>
            Your support funds books, school essentials, mentorship, and community programs that offer lasting opportunity.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#donation-form">
              <HeartHandshake size={18} />
              Donate now
            </a>
            <a className="btn btn-secondary" href="/about">
              <ArrowRight size={18} />
              Learn about our mission
            </a>
          </div>
        </div>
      </section>

      <div className="donate-grid">
        <form id="donation-form" className="donate-form-card" onSubmit={handleSubmit}>
          <section className="step-card">
            <h2 className="step-title">
              <span className="step-number">1</span>
              Choose your impact
            </h2>

            <div className="impact-grid">
              {donationTiers.map((tier) => (
                <button
                  key={tier.type}
                  type="button"
                  className={`impact-card${selectedTier === tier.type ? ' impact-card--active' : ''}`}
                  onClick={() => {
                    setSelectedTier(tier.type)
                    clearErrors()
                    setCustomAmount('')
                  }}
                >
                  <div className="impact-card__emoji">{tier.emoji}</div>
                  <div className="impact-card__body">
                    <span className="impact-card__amount">MK {tier.amount.toLocaleString()}</span>
                    <span className="impact-card__label">{tier.label}</span>
                    <span className="impact-card__description">{tier.description}</span>
                  </div>
                  <span className="impact-card__badge">{selectedTier === tier.type ? 'Selected' : 'Select'}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`donate-toggle${selectedTier === 'custom' ? ' donate-toggle--active' : ''}`}
              onClick={() => {
                setSelectedTier('custom')
                clearErrors()
              }}
            >
              <span className="donate-toggle__emoji">✍️</span>
              <span>Prefer a custom amount?</span>
            </button>

            {selectedTier === 'custom' ? (
              <div className="donate-custom-field">
                <label className="form-label" htmlFor="custom-amount">
                  Enter your custom amount
                </label>
                <input
                  id="custom-amount"
                  className={`form-input ${errors.amount ? 'form-input--error' : ''}`}
                  min={minCustomAmount}
                  onChange={(event) => {
                    setCustomAmount(event.target.value)
                    setErrors((current) => ({ ...current, amount: '' }))
                  }}
                  placeholder="e.g. 1000"
                  type="number"
                  value={customAmount}
                />
              </div>
            ) : null}

            {errors.amount ? <p className="form-error-inline">{errors.amount}</p> : null}
          </section>

          <section className="step-card">
              <h2 className="step-title">
                <span className="step-number">2</span>
                Your details
              </h2>
              <div className="form-grid">
                <label className="form-field">
                  <span className="form-label">Full name</span>
                  <input
                    className={`form-input ${errors.donor_name ? 'form-input--error' : ''}`}
                    onChange={(event) => setForm((current) => ({ ...current, donor_name: event.target.value }))}
                    placeholder="Your full name"
                    type="text"
                    value={form.donor_name}
                  />
                  {errors.donor_name ? <small className="form-hint">{errors.donor_name}</small> : null}
                </label>
                <label className="form-field">
                  <span className="form-label">Email address</span>
                  <input
                    className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                  />
                  {errors.email ? <small className="form-hint">{errors.email}</small> : null}
                </label>
                <label className="form-field form-field--full">
                  <span className="form-label">
                    Phone number <span className="form-hint">optional; PayChangu may request it for mobile money</span>
                  </span>
                  <input
                    className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="e.g. 0991234567"
                    type="tel"
                    value={form.phone}
                  />
                  {errors.phone ? <small className="form-hint">{errors.phone}</small> : null}
                </label>
              </div>
          </section>

          <section className="step-card">
            <h2 className="step-title">
              <span className="step-number">3</span>
              Payment methods
            </h2>
            <p className="payment-methods-note">Choose your payment method securely on the PayChangu checkout page.</p>
            <div className="payment-methods" aria-label="Payment methods available at checkout">
              {paymentMethods.map((method) => (
                <div key={method.name} className="payment-option">
                  <div className="payment-option__icon">
                    {method.icon === 'smartphone' ? <Smartphone size={18} /> : null}
                    {method.icon === 'landmark' ? <Landmark size={18} /> : null}
                  </div>
                  <div className="payment-option__body">
                    <span className="payment-option__name">{method.name}</span>
                    <span className="payment-option__desc">{method.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">Donation amount</span>
              <strong className="summary-value">MK {finalAmount.toLocaleString()}</strong>
            </div>
          </div>

          {submitMessage ? <div className="donation-success">{submitMessage}</div> : null}

          <button className="submit-button" type="submit">
            <HeartHandshake size={18} />
            Donate now
          </button>

          <div className="donation-note">
            <ShieldCheck size={16} />
            Your payment information is secure and encrypted.
          </div>
        </form>

      </div>
    </div>
  )
}
