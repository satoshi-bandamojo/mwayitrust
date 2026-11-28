import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, AlertCircle, Loader, ArrowRight } from 'lucide-react'
import { confirmDonation } from '../services/donations'
import { extractPaymentCallbackParams } from '../services/paychangu'

type CallbackState = 'loading' | 'success' | 'failed' | 'processing'

export default function DonationCallback() {
  const navigate = useNavigate()
  const [state, setState] = useState<CallbackState>('loading')
  const [reference, setReference] = useState('')
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
        if (attempts === 0 || attempts % 5 === 0) {
          let confirmedStatus: string | null = null
          try {
            const { data, error: confirmationError } = await confirmDonation(txRef)
            if (confirmationError) {
              console.warn('Server-side payment confirmation is unavailable:', confirmationError.message)
            } else if (data) {
              confirmedStatus = String(data.status).toLowerCase()
            }
          } catch (confirmationError) {
            console.warn('Server-side payment confirmation failed:', confirmationError)
          }

          if (confirmedStatus) {
            setReference(txRef)

            if (confirmedStatus === 'completed') {
              setState('success')
              return
            }

            if (confirmedStatus === 'failed' || confirmedStatus === 'cancelled' || confirmedStatus === 'canceled') {
              setError(
                confirmedStatus === 'cancelled' || confirmedStatus === 'canceled'
                  ? 'Payment was cancelled. Your donation was not processed.'
                  : 'Payment failed. Please try again.',
              )
              setState('failed')
              return
            }
          }
        }

        setReference(txRef)
        if (attempts < 19) {
          setState('processing')
          attempts += 1
          timeout = window.setTimeout(() => void checkDonationStatus(), 3000)
        } else {
          setError('Payment confirmation is taking longer than expected. Please contact support with your reference.')
          setState('failed')
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
          {reference && (
            <div className="callback-details">
              <div className="detail-row">
                <span className="detail-label">Reference:</span>
                <span className="detail-value">{reference}</span>
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
          {reference ? (
            <div className="callback-details">
              <div className="detail-row">
                <span className="detail-label">Reference:</span>
                <span className="detail-value">{reference}</span>
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
        {reference && (
          <div className="callback-details">
            <div className="detail-row">
              <span className="detail-label">Reference:</span>
              <span className="detail-value">{reference}</span>
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
