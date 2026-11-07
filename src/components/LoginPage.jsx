import { Link } from 'react-router-dom'

function LoginPage({
  loginForm,
  setLoginForm,
  loginError,
  handleLogin,
  selectedRole,
  setSelectedRole,
  signupForm,
  setSignupForm,
  signupSuccess,
  signupError,
  setSignupError,
}) {
  return (
    <div className="login-page">
      <header className="topbar">
        <div className="brand" aria-label="HR Portal brand">
          <span className="brand-badge">HR</span>
          <span className="brand-name">Portal</span>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#" className="nav-link active">Login</a>

          <div className="info-hover-wrap">
            <a href="#" className="nav-link info-link">HR Policy</a>
            <div className="info-hover-panel">
              <h2>HR Policy</h2>
              <p>Fair hiring and respectful workplace.</p>
              <p>Clear rules, compliance, and support.</p>
            </div>
          </div>

          <div className="info-hover-wrap">
            <a href="#" className="nav-link info-link">Employee Policy</a>
            <div className="info-hover-panel">
              <h2>Employee Policy</h2>
              <p>Professional behavior and timely work.</p>
              <p>Attendance, safety, and respect matter.</p>
            </div>
          </div>

          <div className="info-hover-wrap">
            <a href="#about" className="nav-link info-link">About</a>
            <div className="info-hover-panel" id="about">
              <h2>About HR Portal</h2>
              <p>Manage employees and leave requests.</p>
              <p>Easy access to HR and employee services.</p>
            </div>
          </div>
        </nav>

        <div className="topbar-help">
          <span>Need help?</span>
          <span className="help-dot" aria-hidden="true" />
        </div>
      </header>

      <main className="login-area">
        <div className="login-content">
          <form className="login-card" onSubmit={handleLogin}>
            <div className="form-header">
              <p className="eyebrow accent">WELCOME BACK</p>
              <h2>Sign in to Portal</h2>
              <p className="subtitle">Choose your workspace and continue.</p>
            </div>

            <div className="role-selector" role="radiogroup" aria-label="Select login role">
              <label className={`role-option ${selectedRole === 'Employee' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="login-role"
                  checked={selectedRole === 'Employee'}
                  onChange={() => {
                    setSelectedRole('Employee')
                    setSignupError('')
                  }}
                />
                <span>Employee</span>
              </label>

              <label className={`role-option ${selectedRole === 'Hr' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="login-role"
                  checked={selectedRole === 'Hr'}
                  onChange={() => {
                    setSelectedRole('Hr')
                    setSignupError('')
                  }}
                />
                <span>HR team</span>
              </label>
            </div>

            <div className="input-group">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-row">
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Keep me signed in</span>
              </label>

              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            {loginError ? <div className="form-message error">{loginError}</div> : null}
            {signupError ? <div className="form-message error auth-warning">{signupError}</div> : null}
            {signupSuccess ? <div className="form-message success">{signupSuccess}</div> : null}

            <div className="auth-action-row">
              <button type="submit" className="login-btn">Sign in securely</button>

              <div className="signup-stack">
                <span className="signup-label">New to the portal?</span>
                <Link
                  to={selectedRole ? '/signup' : '#'}
                  className="signup-link"
                  onClick={(event) => {
                    if (!selectedRole) {
                      event.preventDefault()
                      setSignupError('Please select a role before creating an account.')
                      return
                    }

                    setSignupForm((prev) => ({
                      ...prev,
                      role: selectedRole === 'Hr' ? 'Hr' : 'Employee',
                    }))
                  }}
                >
                  Create your account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export { LoginPage }
