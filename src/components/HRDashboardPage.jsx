function HRDashboardPage({
  employees,
  leaveRequests,
  newEmployee,
  setNewEmployee,
  employeeActionMessage,
  employeeModalError,
  employeeSearch,
  setEmployeeSearch,
  employeeSort,
  setEmployeeSort,
  isEditingEmployee,
  showEmployeeModal,
  deleteEmployeeTarget,
  handleAddEmployee,
  handleEditEmployee,
  handleDeleteEmployee,
  confirmDeleteEmployee,
  cancelDeleteEmployee,
  handleLeaveStatus,
  handleLogout,
  resetEmployeeForm,
}) {
  const pendingLeaveCount = leaveRequests.filter((request) => request.status === 'Pending').length
  const acceptedLeaveCount = leaveRequests.filter((request) => request.status === 'Accepted').length
  const rejectedLeaveCount = leaveRequests.filter((request) => request.status === 'Rejected').length

  return (
    <div className="dashboard-page">
      {showEmployeeModal ? (
        <div className="employee-modal-backdrop" onClick={resetEmployeeForm}>
          <div className="employee-modal animate-in" onClick={(event) => event.stopPropagation()}>
            <div className="employee-modal-header">
              <h3>Edit Employee</h3>
              <button type="button" className="close-modal-btn" onClick={resetEmployeeForm} aria-label="Close edit modal">
                ×
              </button>
            </div>

            {employeeModalError ? <div className="form-message error">{employeeModalError}</div> : null}

            <form className="stack-form" onSubmit={handleAddEmployee}>
              <input
                type="text"
                placeholder="Employee ID"
                value={newEmployee.empId}
                onChange={(event) =>
                  setNewEmployee((prev) => ({ ...prev, empId: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Employee Name"
                value={newEmployee.empName}
                onChange={(event) =>
                  setNewEmployee((prev) => ({ ...prev, empName: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Department"
                value={newEmployee.dept}
                onChange={(event) =>
                  setNewEmployee((prev) => ({ ...prev, dept: event.target.value }))
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(event) =>
                  setNewEmployee((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Password"
                value={newEmployee.password}
                onChange={(event) =>
                  setNewEmployee((prev) => ({ ...prev, password: event.target.value }))
                }
              />

              <div className="form-actions">
                <button type="submit" className="primary-btn">Save Changes</button>
                <button type="button" className="secondary-btn" onClick={resetEmployeeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteEmployeeTarget ? (
        <div className="employee-modal-backdrop" onClick={cancelDeleteEmployee}>
          <div className="employee-modal delete-modal animate-in" onClick={(event) => event.stopPropagation()}>
            <div className="employee-modal-header">
              <h3>Delete Employee</h3>
              <button type="button" className="close-modal-btn" onClick={cancelDeleteEmployee} aria-label="Close delete modal">
                ×
              </button>
            </div>
            <p className="delete-confirmation-text">
              Are you sure you want to delete <strong>{deleteEmployeeTarget.empName || deleteEmployeeTarget.email}</strong>?
            </p>
            <div className="form-actions delete-actions">
              <button type="button" className="table-delete-btn delete-confirm-btn" onClick={confirmDeleteEmployee}>
                Delete
              </button>
              <button type="button" className="secondary-btn" onClick={cancelDeleteEmployee}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <header className="dashboard-header dashboard-hero">
        <div>
          <p className="eyebrow">HR User</p>
          <h2>HR Dashboard</h2>
        </div>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="summary-strip">
        <div className="summary-card summary-primary">
          <span>Employees</span>
          <strong>{employees.length}</strong>
          <small>Registered</small>
        </div>
        <div className="summary-card summary-warning">
          <span>Pending</span>
          <strong>{pendingLeaveCount}</strong>
          <small>Awaiting review</small>
        </div>
        <div className="summary-card summary-success">
          <span>Approved</span>
          <strong>{acceptedLeaveCount}</strong>
          <small>Approved leaves</small>
        </div>
        <div className="summary-card summary-danger">
          <span>Rejected</span>
          <strong>{rejectedLeaveCount}</strong>
          <small>Declined cases</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel hr-form-panel">
          <h3>Add New Employee</h3>
          {employeeActionMessage.text ? (
            <div className={`form-message ${employeeActionMessage.type}`}>
              {employeeActionMessage.text}
            </div>
          ) : null}
          <form className="stack-form" onSubmit={handleAddEmployee}>
            <input
              type="text"
              placeholder="Employee ID"
              value={newEmployee.empId}
              onChange={(event) =>
                setNewEmployee((prev) => ({ ...prev, empId: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmployee.empName}
              onChange={(event) =>
                setNewEmployee((prev) => ({ ...prev, empName: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Department"
              value={newEmployee.dept}
              onChange={(event) =>
                setNewEmployee((prev) => ({ ...prev, dept: event.target.value }))
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(event) =>
                setNewEmployee((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Password"
              value={newEmployee.password}
              onChange={(event) =>
                setNewEmployee((prev) => ({ ...prev, password: event.target.value }))
              }
            />
            <button type="submit" className="primary-btn">Add Employee</button>
          </form>
        </section>

        <section className="panel">
          <div className="employee-table-header">
            <h3>All Employee Information</h3>
            <div className="employee-toolbar">
              <input
                type="text"
                className="employee-search"
                placeholder="Search employee"
                value={employeeSearch}
                onChange={(event) => setEmployeeSearch(event.target.value)}
              />
              <select
                className="employee-sort"
                value={employeeSort}
                onChange={(event) => setEmployeeSort(event.target.value)}
              >
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="name-desc">Sort: Name Z-A</option>
                <option value="dept-asc">Sort: Dept A-Z</option>
                <option value="dept-desc">Sort: Dept Z-A</option>
              </select>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Dept</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length ? (
                  employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.empId || employee.id}</td>
                      <td>{employee.empName}</td>
                      <td>{employee.dept}</td>
                      <td>{employee.email}</td>
                      <td>
                        <div className="table-action-buttons">
                          <button
                            type="button"
                            className="table-edit-btn"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="table-delete-btn"
                            onClick={() => handleDeleteEmployee(employee)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table-message">
                      No employees match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel full-span">
          <h3>Leave Requests</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.empName}</td>
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
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="accept-btn"
                            onClick={() => handleLeaveStatus(request.id, 'Accepted')}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="reject-btn"
                            onClick={() => handleLeaveStatus(request.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span>{request.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export { HRDashboardPage }
