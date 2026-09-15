
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ThemeContext } from '../ThemeContext.jsx'


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
// SIGNUP
// ==========================================

function Signup() {

  const navigate = useNavigate()

  const {
    darkMode,
    toggleTheme,
  } = useContext(ThemeContext)


  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')


  // ========================================
  // CLEAN VALUES
  // ========================================

  const cleanName =
    name.trim()

  const cleanEmail =
    email.trim().toLowerCase()


  // ========================================
  // NAME VALIDATION
  // ========================================

  const isNameValid =
    /^[A-Za-z ]+$/.test(cleanName) &&
    cleanName.length >= 3


  // ========================================
  // EMAIL VALIDATION
  // ========================================

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
      cleanEmail
    )


  // ========================================
  // PASSWORD RULES
  // ========================================

  const passwordRules = {

    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(password),

    lowercase:
      /[a-z]/.test(password),

    number:
      /[0-9]/.test(password),

    special:
      /[!@#$%^&*(),.?":{}|<>_\-]/.test(password),

  }


  // ========================================
  // PASSWORD STRENGTH
  // ========================================

  const passedRules =
    Object.values(passwordRules)
      .filter(Boolean)
      .length


  const passwordStrength =
    passedRules <= 2
      ? 'Weak'
      : passedRules <= 4
      ? 'Medium'
      : 'Strong'


  // ========================================
  // PASSWORD MATCH
  // ========================================

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword


  // ========================================
  // ALL PASSWORD RULES
  // ========================================

  const allPasswordRulesPassed =
    Object.values(passwordRules)
      .every(Boolean)


  // ========================================
  // CAN SIGNUP
  // ========================================

  const canSignup =
    isNameValid &&
    isEmailValid &&
    allPasswordRulesPassed &&
    passwordsMatch


  // ========================================
  // SIGNUP
  // ========================================

  const handleSignup = (e) => {

    e.preventDefault()

    setError('')
    setSuccess('')


    // ======================================
    // NAME
    // ======================================

    if (!isNameValid) {

      setError(
        'Name must contain at least 3 letters and spaces only.'
      )

      return

    }


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

    if (!allPasswordRulesPassed) {

      setError(
        'Please create a strong password.'
      )

      return

    }


    // ======================================
    // CONFIRM PASSWORD
    // ======================================

    if (!passwordsMatch) {

      setError(
        'Passwords do not match.'
      )

      return

    }


    // ======================================
    // GET EXISTING USERS
    // ======================================

    let existingUsers = []

    try {

      existingUsers =
        JSON.parse(
          localStorage.getItem('users') || '[]'
        )

      if (!Array.isArray(existingUsers)) {
        existingUsers = []
      }

    } catch (error) {

      console.error(
        'Invalid users data:',
        error
      )

      existingUsers = []

    }


    // ======================================
    // CHECK DUPLICATE EMAIL
    // ======================================

    const userAlreadyExists =
      existingUsers.some(
        (user) =>
          user.email?.trim().toLowerCase() ===
          cleanEmail
      )


    if (userAlreadyExists) {

      setError(
        'An account with this email already exists.'
      )

      return

    }


    // ======================================
    // CREATE NEW USER
    // ======================================

    const newUser = {

      name:
        cleanName,

      email:
        cleanEmail,

      password:
        password,

    }


    // ======================================
    // ADD USER TO USERS ARRAY
    // ======================================

    const updatedUsers = [
      ...existingUsers,
      newUser,
    ]


    localStorage.setItem(
      'users',
      JSON.stringify(updatedUsers)
    )


    // ======================================
    // MAKE SURE USER IS NOT LOGGED IN
    // ======================================

    localStorage.removeItem(
      'isLoggedIn'
    )

    sessionStorage.removeItem(
      'isLoggedIn'
    )

    sessionStorage.removeItem(
      'user'
    )


    // ======================================
    // SUCCESS
    // ======================================

    setSuccess(
      'Account created successfully! Redirecting to login...'
    )


    // ======================================
    // REDIRECT
    // ======================================

    setTimeout(() => {

      navigate('/login')

    }, 1200)

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
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >

          {darkMode
            ? '☀️'
            : '🌙'}

        </button>


        {/* HEADER */}

        <div className="auth-header">

          <h1>
            Create Account
          </h1>

          <p className="auth-subtitle">
            Sign up to start managing your tasks.
          </p>

        </div>


        {/* FORM */}

        <form onSubmit={handleSignup}>


          {/* NAME */}

          <div className="auth-field">

            <label htmlFor="signup-name">
              Full Name
            </label>

            <input
              id="signup-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {

                setName(
                  e.target.value
                )

                setError('')

              }}
              autoComplete="name"
            />


            {name && (

              <small
                className={
                  isNameValid
                    ? 'validation-success'
                    : 'validation-hint'
                }
              >

                {isNameValid
                  ? '✓ Valid name'
                  : 'Use at least 3 letters'}

              </small>

            )}

          </div>


          {/* EMAIL */}

          <div className="auth-field">

            <label htmlFor="signup-email">
              Email Address
            </label>

            <input
              id="signup-email"
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

            <label htmlFor="signup-password">
              Password
            </label>


            <div className="password-wrapper">

              <input
                id="signup-password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) => {

                  setPassword(
                    e.target.value
                  )

                  setError('')

                }}
                autoComplete="new-password"
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


          {/* PASSWORD STRENGTH */}

          {password && (

            <div className="password-strength">

              <div className="strength-header">

                <span>
                  Password strength
                </span>

                <strong
                  className={
                    `strength-text ${passwordStrength.toLowerCase()}`
                  }
                >

                  {passwordStrength}

                </strong>

              </div>


              <div className="strength-bar">

                <div
                  className={
                    `strength-progress ${passwordStrength.toLowerCase()}`
                  }
                  style={{
                    width:
                      `${(passedRules / 5) * 100}%`,
                  }}
                />

              </div>


              <div className="password-rules">


                {/* LENGTH */}

                <span
                  className={
                    passwordRules.length
                      ? 'password-rule passed'
                      : 'password-rule'
                  }
                >

                  {passwordRules.length
                    ? '✓'
                    : '○'} 8+

                </span>


                {/* UPPERCASE */}

                <span
                  className={
                    passwordRules.uppercase
                      ? 'password-rule passed'
                      : 'password-rule'
                  }
                >

                  {passwordRules.uppercase
                    ? '✓'
                    : '○'} A-Z

                </span>


                {/* LOWERCASE */}

                <span
                  className={
                    passwordRules.lowercase
                      ? 'password-rule passed'
                      : 'password-rule'
                  }
                >

                  {passwordRules.lowercase
                    ? '✓'
                    : '○'} a-z

                </span>


                {/* NUMBER */}

                <span
                  className={
                    passwordRules.number
                      ? 'password-rule passed'
                      : 'password-rule'
                  }
                >

                  {passwordRules.number
                    ? '✓'
                    : '○'} 0-9

                </span>


                {/* SPECIAL */}

                <span
                  className={
                    passwordRules.special
                      ? 'password-rule passed'
                      : 'password-rule'
                  }
                >

                  {passwordRules.special
                    ? '✓'
                    : '○'} !@#

                </span>

              </div>


              {allPasswordRulesPassed && (

                <div className="password-complete">

                  ✓ Strong password

                </div>

              )}

            </div>

          )}


          {/* CONFIRM PASSWORD */}

          <div className="auth-field">

            <label htmlFor="signup-confirm-password">
              Confirm Password
            </label>


            <div className="password-wrapper">

              <input
                id="signup-confirm-password"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {

                  setConfirmPassword(
                    e.target.value
                  )

                  setError('')

                }}
                autoComplete="new-password"
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >

                {showConfirmPassword ? (
                  <EyeIcon />
                ) : (
                  <EyeOffIcon />
                )}

              </button>

            </div>


            {confirmPassword && (

              <small
                className={
                  passwordsMatch
                    ? 'validation-success'
                    : 'validation-error'
                }
              >

                {passwordsMatch
                  ? '✓ Passwords match'
                  : '✕ Passwords do not match'}

              </small>

            )}

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


          {/* SIGNUP BUTTON */}

          <button
            type="submit"
            className="auth-submit"
            disabled={!canSignup}
          >

            Create Account

          </button>

        </form>


        {/* LOGIN LINK */}

        <p className="auth-footer">

          Already have an account?{' '}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  )

}


export default Signup
