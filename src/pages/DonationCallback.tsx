import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, AlertCircle, Loader, ArrowRight } from 'lucide-react'
import { getDonationByReference } from '../services/donations'
import { extractPaymentCallbackParams } from '../services/paychangu'

type CallbackState = 'loading' | 'success' | 'failed' | 'processing'

export default function DonationCallback() {
  const navigate = useNavigate()
  const [state, setState] = useState<CallbackState>('loading')
  const [donation, setDonation] = useState<{ reference: string; amount: number; email: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let attempts = 0
    let timeout: number | undefined
    const params = extractPaymentCallbackParams()

    const txRef = params.tx_ref
    if (!txRef) {
      setError('No payment reference found. Please contact support.')
      setState('failed')
      return
    }

    const checkDonationStatus = async () => {
      if (!active) return

      try {
        const { data: donationData, error: dbError } = await getDonationByReference(txRef)

        if (dbError || !donationData) {
          console.error('Failed to fetch donation:', dbError)
          setError('Donation record not found. Please contact support with your reference.')
          setState('failed')
          return
        }

        setDonation({
          reference: donationData.payment_reference,
          amount: donationData.amount,
          email: donationData.email,
        })

        const status = String(donationData.status).toLowerCase()
        if (status === 'completed') {
          setState('success')
        } else if (status === 'failed' || status === 'cancelled' || status === 'canceled') {
          setError(
            status === 'cancelled' || status === 'canceled'
              ? 'Payment was cancelled. Your donation was not processed.'
              : 'Payment failed. Please try again.',
          )
          setState('failed')
        } else {
          setState('processing')
          if (attempts < 19) {
            attempts += 1
            timeout = window.setTimeout(() => void checkDonationStatus(), 3000)
          }
        }
      } catch (err) {
        console.error('Callback processing error:', err)
        setError('We could not check your payment status. Please contact support with your reference.')
        setState('failed')
      }
    }

    void checkDonationStatus()

    return () => {
      active = false
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [])

  if (state === 'loading') {
    return (
      <div className="callback-container">
        <div className="callback-card callback-card--loading">
          <Loader className="callback-spinner" size={48} />
          <h1>Processing your donation...</h1>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="callback-container">
        <div className="callback-card callback-card--success">
          <BadgeCheck className="callback-icon callback-icon--success" size={64} />
          <h1>Thank you for your generous donation!</h1>
          <p>Your payment has been successfully processed.</p>
          {donation && (
            <div className="callback-details">
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">MK {donation.amount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Reference:</span>
                <span className="detail-value">{donation.reference}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{donation.email}</span>
              </div>
            </div>
          )}
          <p className="callback-message">Your donation has been recorded.</p>
          <div className="callback-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <ArrowRight size={18} />
              Return home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'processing') {
    return (
      <div className="callback-container">
        <div className="callback-card callback-card--loading">
          <Loader className="callback-spinner" size={48} />
          <h1>Payment confirmation is still processing</h1>
          <p>
            Your payment provider has returned you to Mwayi Trust, but confirmation is not yet recorded. We’ll check
            again automatically for about one minute. If it is still processing, contact support with your reference
            before trying another payment.
          </p>
          {donation ? (
            <div className="callback-details">
              <div className="detail-row">
                <span className="detail-label">Reference:</span>
                <span className="detail-value">{donation.reference}</span>
              </div>
            </div>
          ) : null}
          <div className="callback-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/contact')}>
              Contact support
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="callback-container">
      <div className="callback-card callback-card--error">
        <AlertCircle className="callback-icon callback-icon--error" size={64} />
        <h1>Payment could not be processed</h1>
        <p>{error || 'An unexpected error occurred.'}</p>
        {donation && (
          <div className="callback-details">
            <div className="detail-row">
              <span className="detail-label">Reference:</span>
              <span className="detail-value">{donation.reference}</span>
            </div>
          </div>
        )}
        <div className="callback-actions">
          <button className="btn btn-primary" onClick={() => navigate('/donate')}>
            Try again
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/contact')}>
            Contact support
          </button>
        </div>
      </div>
    </div>
  )
}
