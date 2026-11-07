import { useEffect, useState } from 'react'

function EmployeeDashboardPage({
  loggedInUser,
  leaveRequests,
  leaveForm,
  setLeaveForm,
  editingLeaveRequestId,
  pwdForm,
  setPwdForm,
  passwordError,
  employeeProfileMessage,
  handlePasswordChange,
  handleLeaveRequest,
  handleCancelLeaveEdit,
  handleEditLeaveRequest,
  handleDeleteLeaveRequest,
  handleSaveEmployeeProfile,
  handleLogout,
}) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    empName: '',
    dept: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (!loggedInUser) return

    setProfileForm({
      empName: loggedInUser.empName || '',
      dept: loggedInUser.dept || '',
      email: loggedInUser.email || '',
      phone: loggedInUser.phone || '',
      address: loggedInUser.address || '',
    })
  }, [loggedInUser])

  const employeeLeaveRequests = leaveRequests.filter(
    (request) => request.empId === loggedInUser?.id,
  )

  const pendingCount = employeeLeaveRequests.filter((request) => request.status === 'Pending').length
  const approvedCount = employeeLeaveRequests.filter((request) => request.status === 'Accepted').length
  const rejectedCount = employeeLeaveRequests.filter((request) => request.status === 'Rejected').length
  const employeeInitials = (loggedInUser?.empName || 'Employee')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleProfileFieldChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    await handleSaveEmployeeProfile(profileForm)
    setIsEditingProfile(false)
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header dashboard-hero">
        <div>
          <p className="eyebrow">Employee User</p>
          <h2>Employee Dashboard</h2>
        </div>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="summary-strip">
        <div className="summary-card summary-primary">
          <span>Requests</span>
          <strong>{employeeLeaveRequests.length}</strong>
          <small>Total submitted</small>
        </div>
        <div className="summary-card summary-success">
          <span>Approved</span>
          <strong>{approvedCount}</strong>
          <small>Confirmed</small>
        </div>
        <div className="summary-card summary-warning">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
          <small>Awaiting review</small>
        </div>
        <div className="summary-card summary-danger">
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
          <small>Action required</small>
        </div>
      </div>

      {loggedInUser && loggedInUser.isFirstLogin ? (
        <>
          <div className="first-login-banner">
            This is your first login. Please change your password before continuing.
          </div>

          <section className="panel password-panel">
            <div className="password-panel-header">
              <div>
                <p className="eyebrow">Security</p>
                <h3>Change Password</h3>
              </div>
            </div>
            <p>Since this is your first login, please set a new password.</p>
            <form className="inline-form" onSubmit={handlePasswordChange}>
              <input
                type="password"
                placeholder="New password"
                value={pwdForm.newPassword}
                onChange={(event) =>
                  setPwdForm((prev) => ({ ...prev, newPassword: event.target.value }))
                }
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={pwdForm.confirmPassword}
                onChange={(event) =>
                  setPwdForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                }
              />
              {passwordError ? <div className="form-message error">{passwordError}</div> : null}
              <button type="submit" className="primary-btn">Update Password</button>
            </form>
          </section>
        </>
      ) : null}

      <div className="dashboard-grid employee-grid">
        <section className="panel profile-panel">
          <div className="profile-identity">
            <div className="profile-avatar">{employeeInitials}</div>
            <div>
              <p className="eyebrow">Welcome back</p>
              <h3>{loggedInUser?.empName || 'Employee'}</h3>
              <span className="team-badge">{loggedInUser?.dept || 'Department'}</span>
            </div>
          </div>

          <div className="panel-header-row">
            <h3>Personal Info</h3>
            {!isEditingProfile ? (
              <button type="button" className="secondary-btn" onClick={() => setIsEditingProfile(true)}>
                Modify
              </button>
            ) : (
              <div className="form-actions">
                <button type="button" className="primary-btn" onClick={handleSaveProfile}>
                  Save
                </button>
                <button type="button" className="secondary-btn" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          {employeeProfileMessage.text ? (
            <div className={`form-message ${employeeProfileMessage.type}`}>
              {employeeProfileMessage.text}
            </div>
          ) : null}
          <div className="profile-form">
            <div className="field-row">
              <label>Employee ID</label>
              <input value={loggedInUser?.empId || loggedInUser?.id || ''} readOnly />
            </div>
            <div className="field-row">
              <label>Employee Name</label>
              <input
                value={profileForm.empName}
                readOnly={!isEditingProfile}
                onChange={(event) => handleProfileFieldChange('empName', event.target.value)}
              />
            </div>
            <div className="field-row">
              <label>Department</label>
              <input
                value={profileForm.dept}
                readOnly={!isEditingProfile}
                onChange={(event) => handleProfileFieldChange('dept', event.target.value)}
              />
            </div>
            <div className="field-row">
              <label>Email</label>
              <input
                value={profileForm.email}
                readOnly={!isEditingProfile}
                onChange={(event) => handleProfileFieldChange('email', event.target.value)}
              />
            </div>
            <div className="field-row">
              <label>Phone</label>
              <input
                value={profileForm.phone}
                readOnly={!isEditingProfile}
                onChange={(event) => handleProfileFieldChange('phone', event.target.value)}
              />
            </div>
            <div className="field-row">
              <label>Address</label>
              <input
                value={profileForm.address}
                readOnly={!isEditingProfile}
                onChange={(event) => handleProfileFieldChange('address', event.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="panel leave-panel">
          <div className="panel-header-row">
            <h3>Leave Request Form</h3>
          </div>
          <form className="stack-form" onSubmit={handleLeaveRequest}>
            <select
              value={leaveForm.type}
              onChange={(event) =>
                setLeaveForm((prev) => ({ ...prev, type: event.target.value }))
              }
            >
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Paid Leave</option>
            </select>
            <input
              type="date"
              value={leaveForm.startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(event) =>
                setLeaveForm((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <input
              type="date"
              value={leaveForm.endDate}
              min={leaveForm.startDate || new Date().toISOString().split('T')[0]}
              onChange={(event) =>
                setLeaveForm((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
            <textarea
              rows="4"
              placeholder="Reason for leave"
              value={leaveForm.reason}
              onChange={(event) =>
                setLeaveForm((prev) => ({ ...prev, reason: event.target.value }))
              }
            />
            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingLeaveRequestId ? 'Update Leave' : 'Submit Leave'}
              </button>
              {editingLeaveRequestId ? (
                <button type="button" className="secondary-btn" onClick={handleCancelLeaveEdit}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel full-span status-panel">
          <div className="panel-header-row">
            <h3>Leave Status</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeLeaveRequests.length ? (
                  employeeLeaveRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.type}</td>
                      <td>
                        {request.startDate} to {request.endDate}
                      </td>
                      <td>{request.reason}</td>
                      <td>
                        <span className={`status-badge ${request.status.toLowerCase()}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        {request.status === 'Pending' ? (
                          <div className="table-action-buttons">
                            <button
                              type="button"
                              className="table-edit-btn"
                              onClick={() => handleEditLeaveRequest(request)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="table-delete-btn"
                              onClick={() => handleDeleteLeaveRequest(request.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="locked-action-text">Not available</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No leave requests yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export { EmployeeDashboardPage }
