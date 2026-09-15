
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../features/auth/authActions'

// ==========================================
// EYE ICON
// ==========================================

function EyeIcon() {

  return (

    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >

      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

      <circle
        cx="12"
        cy="12"
        r="3"
      />

    </svg>

  )

}


// ==========================================
// EYE OFF ICON
// ==========================================

function EyeOffIcon() {

  return (

    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >

      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

      <circle
        cx="12"
        cy="12"
        r="3"
      />

      <line
        x1="4"
        y1="4"
        x2="20"
        y2="20"
      />

    </svg>

  )

}


// ==========================================
// LOGIN
// ==========================================

function Login() {

  const navigate = useNavigate()
  const dispatch = useDispatch()


  // ========================================
  // TEMPORARY THEME
  // ========================================
  // Theme will be migrated to Redux in the
  // next step.

  const darkMode =
    localStorage.getItem('darkMode') === 'true'

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')


  // ========================================
  // EMAIL VALIDATION
  // ========================================

  const cleanEmail =
    email.trim().toLowerCase()

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
      cleanEmail
    )


  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = (e) => {

    e.preventDefault()

    setError('')
    setSuccess('')


    // ======================================
    // EMAIL
    // ======================================

    if (!isEmailValid) {

      setError(
        'Please enter a valid email address.'
      )

      return

    }


    // ======================================
    // PASSWORD
    // ======================================

    if (!password) {

      setError(
        'Please enter your password.'
      )

      return

    }


    // ======================================
    // GET USERS
    // ======================================

    let users = []

    try {

      users =
        JSON.parse(
          localStorage.getItem('users') || '[]'
        )

      if (!Array.isArray(users)) {

        users = []

      }

    } catch (error) {

      console.error(
        'Invalid users data:',
        error
      )

      users = []

    }


    // ======================================
    // FIND USER
    // ======================================

    const user =
      users.find(
        (item) =>
          item.email?.trim().toLowerCase() ===
            cleanEmail &&
          item.password === password
      )


    // ======================================
    // USER NOT FOUND
    // ======================================

    if (!user) {

      setError(
        'Incorrect email or password.'
      )

      return

    }


    // ======================================
    // REDUX LOGIN
    // ======================================

    dispatch(login())


    // ======================================
    // SAVE CURRENT LOGGED-IN USER
    // ======================================

    sessionStorage.setItem(
      'user',
      JSON.stringify(user)
    )


    sessionStorage.setItem(
      'isLoggedIn',
      'true'
    )


    // ======================================
    // KEEP LOGIN STATUS
    // ======================================

    localStorage.setItem(
      'isLoggedIn',
      'true'
    )


    // ======================================
    // SUCCESS
    // ======================================

    setSuccess(
      'Login successful! Redirecting...'
    )


    // ======================================
    // REDIRECT
    // ======================================

    setTimeout(() => {

      navigate('/todo')

    }, 800)

  }


  // ========================================
  // UI
  // ========================================

  return (

    <div
      className={
        `auth-page ${darkMode ? 'dark' : ''}`
      }
    >

      <div className="auth-card">


        {/* THEME */}

        <button
          type="button"
          className="auth-theme-toggle"
          onClick={() => {

            const newMode = !darkMode

            localStorage.setItem(
              'darkMode',
              newMode
            )

            window.location.reload()

          }}
          aria-label="Toggle theme"
        >

          {darkMode
            ? '☀️'
            : '🌙'}

        </button>


        {/* HEADER */}

        <div className="auth-header">

          <h1>
            Welcome Back
          </h1>

          <p className="auth-subtitle">
            Login to manage your tasks.
          </p>

        </div>


        {/* FORM */}

        <form onSubmit={handleLogin}>


          {/* EMAIL */}

          <div className="auth-field">

            <label htmlFor="login-email">
              Email Address
            </label>


            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {

                setEmail(
                  e.target.value
                )

                setError('')

              }}
              autoComplete="email"
            />


            {email && (

              <small
                className={
                  isEmailValid
                    ? 'validation-success'
                    : 'validation-hint'
                }
              >

                {isEmailValid
                  ? '✓ Valid email'
                  : 'Please enter a valid email'}

              </small>

            )}

          </div>


          {/* PASSWORD */}

          <div className="auth-field">

            <label htmlFor="login-password">
              Password
            </label>


            <div className="password-wrapper">

              <input
                id="login-password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {

                  setPassword(
                    e.target.value
                  )

                  setError('')

                }}
                autoComplete="current-password"
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >

                {showPassword ? (
                  <EyeIcon />
                ) : (
                  <EyeOffIcon />
                )}

              </button>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="auth-message auth-error">

              ⚠️ {error}

            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="auth-message auth-success">

              ✓ {success}

            </div>

          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-submit"
            disabled={!isEmailValid || !password}
          >

            Login

          </button>

        </form>


        {/* SIGNUP LINK */}

        <p className="auth-footer">

          Don't have an account?{' '}

          <Link to="/signup">
            Create Account
          </Link>

        </p>

      </div>

    </div>

  )

}


export default Login
