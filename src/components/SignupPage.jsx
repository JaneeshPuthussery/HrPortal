import { Link, useNavigate } from 'react-router-dom'

function SignupPage({
  signupForm,
  setSignupForm,
  signupError,
  signupSuccess,
  handleSignup,
}) {
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    const isSignedUp = await handleSignup(event)

    if (isSignedUp) {
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up as employee or HR team member</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="input-group">
            <label htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              type="text"
              value={signupForm.name}
              onChange={(event) =>
                setSignupForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              value={signupForm.email}
              onChange={(event) =>
                setSignupForm((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="Enter email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              value={signupForm.password}
              onChange={(event) =>
                setSignupForm((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="Enter password"
              required
            />
          </div>

          <div className="role-selector" role="radiogroup" aria-label="Select signup role">
            <label className={`role-option ${signupForm.role === 'Employee' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="signup-role"
                checked={signupForm.role === 'Employee'}
                onChange={() => setSignupForm((prev) => ({ ...prev, role: 'Employee' }))}
              />
              <span>Employee</span>
            </label>

            <label className={`role-option ${signupForm.role === 'Hr' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="signup-role"
                checked={signupForm.role === 'Hr'}
                onChange={() => setSignupForm((prev) => ({ ...prev, role: 'Hr' }))}
              />
              <span>HR team</span>
            </label>
          </div>

          {signupForm.role === 'Employee' ? (
            <>
              <div className="input-group">
                <label htmlFor="signup-empid">Employee ID</label>
                <input
                  id="signup-empid"
                  type="text"
                  value={signupForm.empId}
                  onChange={(event) =>
                    setSignupForm((prev) => ({ ...prev, empId: event.target.value }))
                  }
                  placeholder="Enter employee ID"
                />
              </div>

              <div className="input-group">
                <label htmlFor="signup-dept">Department</label>
                <input
                  id="signup-dept"
                  type="text"
                  value={signupForm.dept}
                  onChange={(event) =>
                    setSignupForm((prev) => ({ ...prev, dept: event.target.value }))
                  }
                  placeholder="Enter department"
                />
              </div>

              <div className="input-group">
                <label htmlFor="signup-phone">Phone</label>
                <input
                  id="signup-phone"
                  type="tel"
                  value={signupForm.phone}
                  onChange={(event) =>
                    setSignupForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div className="input-group">
                <label htmlFor="signup-address">Address</label>
                <input
                  id="signup-address"
                  type="text"
                  value={signupForm.address}
                  onChange={(event) =>
                    setSignupForm((prev) => ({ ...prev, address: event.target.value }))
                  }
                  placeholder="Enter address"
                />
              </div>
            </>
          ) : null}

          {signupError ? <div className="form-message error">{signupError}</div> : null}
          {signupSuccess ? <div className="form-message success">{signupSuccess}</div> : null}

          <button type="submit" className="login-btn">Sign Up</button>
          <Link to="/" className="secondary-link">Back to Login</Link>
        </form>
      </div>
    </div>
  )
}

export { SignupPage }
