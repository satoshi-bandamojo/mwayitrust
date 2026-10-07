import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.tsx'
import Footer from '../components/layout/Footer.tsx'

const consentStorageKey = 'mwayi-terms-consent'
const termsVersion = '2026-10-07'

interface StoredConsent {
  termsVersion: string
  acceptedAt: string
}

function readConsent() {
  try {
    const storedConsent = localStorage.getItem(consentStorageKey)
    if (!storedConsent) return { required: true, error: '' }

    const consent = JSON.parse(storedConsent) as StoredConsent
    return { required: consent.termsVersion !== termsVersion, error: '' }
  } catch {
    return {
      required: true,
      error: 'Your browser could not read the saved agreement. Please try again or enable site storage.',
    }
  }
}

export default function MainLayout() {
  const location = useLocation()
  const [consent, setConsent] = useState(readConsent)
  const [isChecked, setIsChecked] = useState(false)
  const isPolicyPage = ['/terms-of-use', '/privacy-policy'].includes(location.pathname)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (consent.required && !isPolicyPage && dialog && !dialog.open) dialog.showModal()
  }, [consent.required, isPolicyPage])

  const acceptTerms = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      localStorage.setItem(
        consentStorageKey,
        JSON.stringify({ termsVersion, acceptedAt: new Date().toISOString() } satisfies StoredConsent),
      )
      setConsent({ required: false, error: '' })
    } catch {
      setConsent({
        required: true,
        error: 'We could not save your agreement. Please enable site storage and try again.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-white text-brand-text dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      {consent.required && !isPolicyPage ? (
        <dialog
          ref={dialogRef}
          className="consent-dialog"
          aria-labelledby="consent-title"
          onCancel={(event) => event.preventDefault()}
        >
          <p className="section-kicker">Before you continue</p>
          <h2 id="consent-title">Welcome to Mwayi Trust</h2>
          <p>
            Please review our website terms and privacy notice. You can open either document now and return here to
            continue.
          </p>
          <form onSubmit={acceptTerms}>
            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(event) => setIsChecked(event.target.checked)}
                required
              />
              <span>
                I agree to the <Link to="/terms-of-use">Terms of Use</Link> and acknowledge the{' '}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </span>
            </label>
            {consent.error ? (
              <p className="consent-error" role="alert">
                {consent.error}
              </p>
            ) : null}
            <button className="btn btn-primary consent-submit" type="submit">
              Agree and continue
            </button>
          </form>
        </dialog>
      ) : null}
    </div>
  )
}