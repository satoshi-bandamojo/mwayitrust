import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const nextErrors = { email: '', password: '' }
    let valid = true

    if (!credentials.email.trim()) {
      nextErrors.email = 'Email address is required.'
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      nextErrors.email = 'Please enter a valid email address.'
      valid = false
    }

    if (!credentials.password) {
      nextErrors.password = 'Password is required.'
      valid = false
    } else if (credentials.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
      valid = false
    }

    setErrors(nextErrors)
    return valid
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    if (!validate()) {
      setSubmitError('Please fix the highlighted fields to continue.')
      return
    }

    setSubmitError('')
    // Placeholder: form submission and auth handling go here.
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-logo">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2>Mwayi Trust</h2>
            <p>Admin Portal</p>
          </div>
        </div>

        <div className="admin-login-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage content, events, stories, and messages.</p>
        </div>

        {submitError ? (
          <div className="admin-login-error">
            <span>{submitError}</span>
          </div>
        ) : null}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="form-group">
            <span>Email Address</span>
            <input
              type="email"
              value={credentials.email}
              onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
              placeholder="admin@mwayitrust.org"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email ? <span className="form-error">{errors.email}</span> : null}
          </label>

          <label className="form-group">
            <span>Password</span>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password ? <span className="form-error">{errors.password}</span> : null}
          </label>

          <button type="submit" className="btn btn-primary admin-login-submit">
            Sign in
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/"> <ArrowLeft size={16} /> Back to Website</a>
        </div>
      </div>
    </div>
  )
}
