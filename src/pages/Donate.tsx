import { ArrowRight, BadgeCheck, Banknote, CreditCard, HeartHandshake, Landmark, ShieldCheck, Smartphone, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { createDonation } from '../services/donations'

type DonationTierType = 'learning_materials' | 'student_term' | 'student_year' | 'community_champion'
type PaymentMethodId = 'airtel' | 'tnm' | 'bank' | 'paypal'
type SelectedTierValue = DonationTierType | 'custom' | ''

interface DonationTier {
  type: DonationTierType
  amount: number
  label: string
  description: string
  emoji: string
}

interface PaymentMethodOption {
  id: PaymentMethodId
  name: string
  description: string
  icon: string
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
  { id: 'airtel', name: 'Airtel Money', description: 'Fast mobile payments', icon: 'smartphone' },
  { id: 'tnm', name: 'TNM Mpamba', description: 'Mobile money for Malawi', icon: 'smartphone' },
  { id: 'bank', name: 'Bank transfer', description: 'Direct transfer for larger gifts', icon: 'landmark' },
  { id: 'paypal', name: 'PayPal', description: 'International support', icon: 'credit-card' },
]

const minCustomAmount = 500

const initialForm = {
  donor_name: '',
  email: '',
  phone: '',
}

export default function Donate() {
  const [selectedTier, setSelectedTier] = useState<SelectedTierValue>('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | ''>('')
  const [customAmount, setCustomAmount] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({
    amount: '',
    donor_name: '',
    email: '',
    phone: '',
    method: '',
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

  const methodLabel = useMemo(() => {
    const method = paymentMethods.find((option) => option.id === selectedMethod)
    return method?.name ?? ''
  }, [selectedMethod])

  const clearErrors = () => {
    setErrors({ amount: '', donor_name: '', email: '', phone: '', method: '' })
  }

  const validate = () => {
    const nextErrors = {
      amount: '',
      donor_name: '',
      email: '',
      phone: '',
      method: '',
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

    if (!isAnonymous && !form.email.trim()) {
      nextErrors.email = 'Email address is required.'
      valid = false
    } else if (!isAnonymous && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.'
      valid = false
    }

    if (!isAnonymous && ['airtel', 'tnm'].includes(selectedMethod as PaymentMethodId) && !form.phone.trim()) {
      nextErrors.phone = 'Phone number is required for mobile money payments.'
      valid = false
    }

    if (!selectedMethod) {
      nextErrors.method = 'Please select a payment method.'
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

    const reference = `MT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    ;(async () => {
      setSubmitMessage('Saving donation...')

      const payload = {
        donor_name: isAnonymous ? null : form.donor_name || null,
        email: isAnonymous ? '' : form.email,
        phone: form.phone || null,
        amount: finalAmount,
        currency: 'MWK',
        payment_reference: reference,
        purpose: selectedTier === 'custom' ? 'custom' : selectedTier || null,
        donation_type: selectedTier === 'custom' ? 'custom' : selectedTier || null,
      }

      const { error } = await createDonation(payload)
      if (error) {
        console.error('Failed to create donation', error)
        setSubmitMessage('Failed to save donation. Please try again.')
        return
      }

      // If PayChangu checkout URL is configured, redirect there with query params.
      const checkoutBase = import.meta.env.VITE_PAYCHANGU_CHECKOUT_URL
      if (checkoutBase) {
        const params = new URLSearchParams({
          amount: String(finalAmount),
          currency: 'MWK',
          reference,
          email: form.email || '',
          phone: form.phone || '',
          name: form.donor_name || '',
          callback: `${window.location.origin}/donation-callback`,
        })
        const url = `${checkoutBase.replace(/\/$/, '')}?${params.toString()}`
        setSubmitMessage('Redirecting to payment gateway...')
        window.location.href = url
        return
      }

      // No checkout configured — show the donation reference so a backend can complete payment.
      setSubmitMessage(`Thank you for your generosity. Your donation reference is ${reference}.`)
    })()
  }

  return (
    <div className="donate-shell">
      <section className="donate-hero">
        <div className="donate-hero-content">
          <p className="section-kicker">Make a lasting impact</p>
          <h1>Give today and help students thrive in Malawi.</h1>
          <p>
            Your support funds books, school essentials, mentorship, and community programs that turn opportunity into a
            brighter future.
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

            <label className="donate-anonymous-toggle">
              <input checked={isAnonymous} onChange={() => setIsAnonymous((value) => !value)} type="checkbox" />
              <span>Donate anonymously</span>
            </label>

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

          {!isAnonymous ? (
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
                    Phone number
                    <span className="form-hint">required for Airtel / TNM</span>
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
          ) : null}

          <section className="step-card">
            <h2 className="step-title">
              <span className="step-number">3</span>
              Payment method
            </h2>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`payment-option${selectedMethod === method.id ? ' payment-option--active' : ''}`}
                  onClick={() => {
                    setSelectedMethod(method.id)
                    setErrors((current) => ({ ...current, method: '' }))
                  }}
                >
                  <div className="payment-option__icon">
                    {method.icon === 'smartphone' ? <Smartphone size={18} /> : null}
                    {method.icon === 'landmark' ? <Landmark size={18} /> : null}
                    {method.icon === 'credit-card' ? <CreditCard size={18} /> : null}
                  </div>
                  <div className="payment-option__body">
                    <span className="payment-option__name">{method.name}</span>
                    <span className="payment-option__desc">{method.description}</span>
                  </div>
                  {selectedMethod === method.id ? <BadgeCheck className="payment-option__check" size={20} /> : null}
                </button>
              ))}
            </div>
            {errors.method ? <p className="form-error-inline">{errors.method}</p> : null}
          </section>

          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">Donation amount</span>
              <strong className="summary-value">MK {finalAmount.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span className="summary-label">Payment method</span>
              <strong className="summary-value">{methodLabel || 'Select payment method'}</strong>
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

        <aside className="donate-side-card">
          <div className="side-card__top">
            <p className="section-kicker">Why give</p>
            <h2>Every gift creates a ripple of opportunity.</h2>
            <p>
              Support from partners and donors helps us expand literacy, mentorship, and practical learning initiatives in
              the communities we serve.
            </p>
          </div>

          <div className="impact-list">
            <div className="impact-item">
              <div className="impact-item__icon">
                <Sparkles size={18} />
              </div>
              <div>
                <strong>Immediate support</strong>
                <p>Fast-moving resources reach students and families where they need them most.</p>
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-item__icon">
                <Banknote size={18} />
              </div>
              <div>
                <strong>Flexible giving</strong>
                <p>Choose a preset amount or tailor your contribution to your budget.</p>
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-item__icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong>Transparent impact</strong>
                <p>We share stories and outcomes so you can see the change your gift makes.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
