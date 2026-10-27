import { ArrowRight, CheckCircle2, HeartHandshake, Landmark, ShieldCheck, Smartphone } from 'lucide-react'
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

const donationTiers: DonationTier[] = [
  {
    type: 'learning_materials',
    amount: 30000,
    label: 'Learning Materials',
    description: 'Exercise books, pens, school bag & geometry set for 1 pupil.',
    emoji: '📚',
  },
  {
    type: 'student_term',
    amount: 60000,
    label: 'Support One Term',
    description: 'School fees & tutoring for a vulnerable secondary school learner.',
    emoji: '🎓',
  },
  {
    type: 'student_year',
    amount: 180000,
    label: 'Support One Full Year',
    description: 'Complete academic sponsorship, uniform & mentoring for a full year.',
    emoji: '🌟',
  },
  {
    type: 'community_champion',
    amount: 500000,
    label: 'Vocational Trainee Sponsor',
    description: 'Full course kit & trade tuition in carpentry, tailoring, or cookery.',
    emoji: '🌍',
  },
]

const paymentMethods = [
  {
    name: 'Airtel Money',
    description: 'Instant mobile money via Airtel Malawi',
    badge: 'Popular in Malawi',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: 'smartphone',
  },
  {
    name: 'TNM Mpamba',
    description: 'Instant mobile payment via TNM Malawi',
    badge: 'Popular in Malawi',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: 'smartphone',
  },
  {
    name: 'Bank Transfer / Card',
    description: 'National Bank, Standard Bank, Visa / Mastercard',
    badge: 'National & Diaspora',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: 'landmark',
  },
]

const minCustomAmount = 500

const initialForm = {
  donor_name: '',
  email: '',
  phone: '',
}

export default function Donate() {
  const [selectedTier, setSelectedTier] = useState<SelectedTierValue>('student_term')
  const [customAmount, setCustomAmount] = useState('')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({
    amount: '',
    donor_name: '',
    email: '',
    phone: '',
  })
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      nextErrors.email = 'Email address is required for confirmation receipt.'
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.'
      valid = false
    }

    setErrors(nextErrors)
    return valid
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      setSubmitMessage('')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('Preparing secure PayChangu checkout...')

    const payload = {
      donor_name: form.donor_name || null,
      email: form.email,
      phone: form.phone || null,
      amount: finalAmount,
      currency: 'MWK',
      purpose: selectedTier === 'custom' ? 'Custom donation' : selectedTier || null,
      donation_type: selectedTier === 'custom' ? 'custom' : selectedTier || null,
    }

    try {
      const { data, error } = await createDonation(payload)
      if (error) {
        console.error('Failed to create donation', error)
        setSubmitMessage('Failed to create donation session. Please try again.')
        setIsSubmitting(false)
        return
      }

      if (!data?.checkout_url) {
        setSubmitMessage('Payment link was not returned. Please try again.')
        setIsSubmitting(false)
        return
      }

      setSubmitMessage('Redirecting to secure payment checkout...')
      window.location.href = data.checkout_url
    } catch (err) {
      console.error('Failed to create donation session', err)
      setSubmitMessage(`Error: ${err instanceof Error ? err.message : 'Please check your connection.'}`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="donate-shell">
      <section className="donate-hero welcome-hero">
        <div className="donate-hero-content welcome-hero__content">
          <p className="section-kicker">Giving from Malawi & Abroad</p>
          <h1>Every Kwacha opens a classroom door.</h1>
          <p>
            Your contribution directly funds tuition, vocational training kits, and daily meals for children and youth in Mbvundula Village, Chileka.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#donation-form">
              <HeartHandshake size={18} />
              Choose Giving Level
            </a>
            <a className="btn btn-secondary" href="/programs">
              <ArrowRight size={18} />
              See Our Programs
            </a>
          </div>
        </div>
      </section>

      <div className="donate-grid">
        <form id="donation-form" className="donate-form-card" onSubmit={handleSubmit} noValidate>
          {/* Step 1: Tier Selection */}
          <section className="step-card">
            <h2 className="step-title">
              <span className="step-number">1</span>
              <span>Select your gift (Malawi Kwacha)</span>
            </h2>

            <div className="impact-grid">
              {donationTiers.map((tier) => {
                const isSelected = selectedTier === tier.type
                return (
                  <button
                    key={tier.type}
                    type="button"
                    className={`impact-card ${isSelected ? 'impact-card--active' : ''}`}
                    onClick={() => {
                      setSelectedTier(tier.type)
                      clearErrors()
                      setCustomAmount('')
                    }}
                  >
                    <div className="impact-card-top-row">
                      <span className="impact-card__emoji">{tier.emoji}</span>
                      {isSelected ? (
                        <span className="impact-card-check">
                          <CheckCircle2 size={18} />
                        </span>
                      ) : null}
                    </div>
                    <div className="impact-card__body">
                      <span className="impact-card__amount">MK {tier.amount.toLocaleString()}</span>
                      <span className="impact-card__label">{tier.label}</span>
                      <span className="impact-card__description">{tier.description}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Custom Amount Button */}
            <button
              type="button"
              className={`donate-toggle ${selectedTier === 'custom' ? 'donate-toggle--active' : ''}`}
              onClick={() => {
                setSelectedTier('custom')
                clearErrors()
              }}
            >
              <span className="donate-toggle__emoji">✍️</span>
              <span className="font-semibold">Enter a custom amount in MWK</span>
            </button>

            {selectedTier === 'custom' ? (
              <div className="donate-custom-field">
                <label className="form-label" htmlFor="custom-amount">
                  Custom Donation Amount (MWK)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">MK</span>
                  <input
                    id="custom-amount"
                    className={`form-input pl-12 ${errors.amount ? 'form-input--error' : ''}`}
                    min={minCustomAmount}
                    inputMode="numeric"
                    placeholder="e.g. 50000"
                    type="number"
                    value={customAmount}
                    onChange={(event) => {
                      setCustomAmount(event.target.value)
                      setErrors((current) => ({ ...current, amount: '' }))
                    }}
                  />
                </div>
                <div className="quick-amount-chips">
                  {[10000, 25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className="quick-chip-btn"
                      onClick={() => setCustomAmount(String(amt))}
                    >
                      +MK {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {errors.amount ? <p className="form-error-inline">{errors.amount}</p> : null}
          </section>

          {/* Step 2: Donor Info */}
          <section className="step-card">
            <h2 className="step-title">
              <span className="step-number">2</span>
              <span>Your details</span>
            </h2>
            <div className="form-grid">
              <label className="form-field">
                <span className="form-label">Full Name (optional)</span>
                <input
                  className="form-input"
                  autoComplete="name"
                  placeholder="e.g. Mary Banda"
                  type="text"
                  value={form.donor_name}
                  onChange={(event) => setForm((current) => ({ ...current, donor_name: event.target.value }))}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Email Address *</span>
                <input
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@example.com"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
                {errors.email ? <small className="form-hint text-red-600">{errors.email}</small> : null}
              </label>

              <label className="form-field form-field--full">
                <span className="form-label">
                  Mobile Number (for Airtel Money / Mpamba)
                </span>
                <input
                  className="form-input"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="e.g. 0991234567 or 0881234567"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                />
                <small className="form-hint">Used by PayChangu to trigger your mobile money prompt.</small>
              </label>
            </div>
          </section>

          {/* Step 3: Payment Methods available in Malawi */}
          <section className="step-card">
            <h2 className="step-title">
              <span className="step-number">3</span>
              <span>Supported payment methods</span>
            </h2>
            <p className="payment-methods-note text-sm text-slate-600 mb-3">
              You will select your preferred method on the secure PayChangu checkout:
            </p>
            <div className="payment-methods" aria-label="Payment methods available at checkout">
              {paymentMethods.map((method) => (
                <div key={method.name} className="payment-option">
                  <div className="payment-option__icon">
                    {method.icon === 'smartphone' ? <Smartphone size={20} /> : <Landmark size={20} />}
                  </div>
                  <div className="payment-option__body">
                    <div className="flex items-center justify-between">
                      <span className="payment-option__name">{method.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {method.badge}
                      </span>
                    </div>
                    <span className="payment-option__desc">{method.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Total Summary */}
          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">Total to Give:</span>
              <strong className="summary-value text-xl font-bold text-[#034694]">
                MK {finalAmount.toLocaleString()}
              </strong>
            </div>
          </div>

          {submitMessage ? (
            <div className={`donation-status-box ${isSubmitting ? 'donation-status-box--loading' : ''}`}>
              {submitMessage}
            </div>
          ) : null}

          <button
            className="submit-button min-h-[52px] w-full text-base font-bold shadow-lg"
            type="submit"
            disabled={isSubmitting || finalAmount < minCustomAmount}
          >
            <HeartHandshake size={20} />
            <span>{isSubmitting ? 'Preparing Payment…' : `Donate MK ${finalAmount.toLocaleString()} Now`}</span>
          </button>

          <div className="donation-note">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span>Encrypted and secured by PayChangu. Supports Airtel Money, TNM Mpamba, and cards.</span>
          </div>
        </form>

        {/* Side Trust & Impact Card */}
        <aside className="donate-side-card hidden lg:block">
          <h3 className="text-lg font-bold text-slate-900 mb-3">How Your Gift Is Spent</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>85%</strong> goes directly to student school fees, learning materials, and vocational workshops.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>10%</strong> supports community garden operations and daily student nutrition.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>5%</strong> for local administrative coordination in Mbvundula Village.</span>
            </li>
          </ul>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Need assistance with payment?</h4>
            <p className="text-xs text-slate-500 mb-3">
              If you encounter any mobile network delay with Airtel or TNM, contact our office directly:
            </p>
            <a href="tel:+265881452554" className="text-xs font-bold text-[#034694] hover:underline flex items-center gap-1">
              Call +265 881 45 25 54
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
