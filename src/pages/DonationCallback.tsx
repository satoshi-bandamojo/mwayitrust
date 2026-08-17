import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, AlertCircle, Loader, ArrowRight } from 'lucide-react'
import { getDonationByReference, updateDonationStatus } from '../services/donations'
import { extractPaymentCallbackParams, isPaymentSuccessful } from '../services/paychangu'

type CallbackState = 'loading' | 'success' | 'failed' | 'processing'

export default function DonationCallback() {
  const navigate = useNavigate()
  const [state, setState] = useState<CallbackState>('loading')
  const [donation, setDonation] = useState<{ reference: string; amount: number; email: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract payment data from URL
        const params = extractPaymentCallbackParams()

        if (!params.tx_ref) {
          setError('No payment reference found. Please contact support.')
          setState('failed')
          return
        }

        // Fetch donation from database
        const { data: donationData, error: dbError } = await getDonationByReference(params.tx_ref)

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

        // Check payment status from callback
        if (isPaymentSuccessful(params.status)) {
          setState('processing')

          // Update donation status in database
          const { error: updateError } = await updateDonationStatus(
            params.tx_ref,
            'completed',
            {
              paychangu_status: params.status,
              paychangu_tx_ref: params.tx_ref,
              paychangu_transaction_id: params.transaction_id,
              verified_at: new Date().toISOString(),
            }
          )

          if (updateError) {
            console.error('Failed to update donation status:', updateError)
            setError('Payment was successful, but we encountered an error recording it. Please contact support.')
            setState('failed')
            return
          }

          // Success!
          setState('success')
        } else {
          // Payment was cancelled or failed
          const newStatus = params.status === 'failed' ? 'failed' : 'cancelled'

          // Update donation status
          await updateDonationStatus(params.tx_ref, newStatus, {
            paychangu_status: params.status,
            processed_at: new Date().toISOString(),
          })

          setError(
            newStatus === 'cancelled'
              ? 'Payment was cancelled. Your donation was not processed.'
              : 'Payment failed. Please try again.'
          )
          setState('failed')
        }
      } catch (err) {
        console.error('Callback processing error:', err)
        setError('An unexpected error occurred. Please contact support.')
        setState('failed')
      }
    }

    processCallback()
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
          <p className="callback-message">A confirmation email has been sent to your inbox.</p>
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
