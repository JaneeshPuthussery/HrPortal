import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { EmployeeDashboardPage } from './components/EmployeeDashboardPage'
import { HRDashboardPage } from './components/HRDashboardPage'
import { LoginPage } from './components/LoginPage'
import { SignupPage } from './components/SignupPage'

const hrUser = {
  id: 'HR-001',
  name: 'HR Admin',
  email: 'hr@portal.com',
  password: 'admin123',
  role: 'HR',
}

const API_URL = 'http://localhost:5000'

async function fetchJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

function App() {
  const [employees, setEmployees] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [users, setUsers] = useState([])
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    empId: '',
    dept: '',
    phone: '',
    address: '',
  })
  const [selectedRole, setSelectedRole] = useState('')
  const [loginError, setLoginError] = useState('')
  const [signupError, setSignupError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState('')
  const [newEmployee, setNewEmployee] = useState({
    empId: '',
    empName: '',
    dept: '',
    email: '',
    password: 'Welcome@123',
  })
  const [employeeActionMessage, setEmployeeActionMessage] = useState({ type: '', text: '' })
  const [employeeModalError, setEmployeeModalError] = useState('')
  const [employeeProfileMessage, setEmployeeProfileMessage] = useState({ type: '', text: '' })
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [employeeSort, setEmployeeSort] = useState('name-asc')
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [editingEmployeeId, setEditingEmployeeId] = useState(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [deleteEmployeeTarget, setDeleteEmployeeTarget] = useState(null)
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  })
  const [editingLeaveRequestId, setEditingLeaveRequestId] = useState(null)
  const [pwdForm, setPwdForm] = useState({ newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeeData, leaveData, userData] = await Promise.all([
          fetchJson(`${API_URL}/employees`),
          fetchJson(`${API_URL}/leaveRequests`),
          fetchJson(`${API_URL}/users`),
        ])

        setEmployees(employeeData)
        setLeaveRequests(leaveData)
        setUsers(userData)
      } catch (error) {
        console.error('Failed to load JSON server data:', error)
      }
    }

    loadData()
  }, [])

  const currentEmployee = useMemo(
    () => employees.find((emp) => emp.id === loggedInUser?.id) || null,
    [employees, loggedInUser],
  )

  const refreshEmployeeList = async () => {
    const employeeData = await fetchJson(`${API_URL}/employees`)
    setEmployees(employeeData)
  }

  const refreshLeaveList = async () => {
    const leaveData = await fetchJson(`${API_URL}/leaveRequests`)
    setLeaveRequests(leaveData)
  }

  const filteredEmployees = useMemo(() => {
    const searchText = employeeSearch.trim().toLowerCase()

    const filtered = employees.filter((employee) => {
      if (!searchText) {
        return true
      }

      const searchableText = [
        employee.empId || employee.id,
        employee.empName,
        employee.dept,
        employee.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(searchText)
    })

    const sorted = [...filtered]

    sorted.sort((a, b) => {
      const valueA = (a[employeeSort.split('-')[0]] || a.empName || a.email || '').toString().toLowerCase()
      const valueB = (b[employeeSort.split('-')[0]] || b.empName || b.email || '').toString().toLowerCase()

      if (valueA < valueB) return employeeSort.includes('asc') ? -1 : 1
      if (valueA > valueB) return employeeSort.includes('asc') ? 1 : -1
      return 0
    })

    return sorted
  }, [employees, employeeSearch, employeeSort])

  const handleLogin = (event) => {
    event.preventDefault()

    if (!selectedRole) {
      setLoginError('Please select a role before login.')
      return
    }

    const email = loginForm.email.trim().toLowerCase()
    const password = loginForm.password

    if (selectedRole === 'Hr') {
      const matchedUser = users.find(
        (user) => user.role === 'HR' && user.email.toLowerCase() === email && user.password === password,
      )

      if (matchedUser || (email === hrUser.email && password === hrUser.password)) {
        setLoggedInUser({ ...(matchedUser || hrUser), role: 'HR' })
        setLoginError('')
        return
      }

      setLoginError('Invalid HR credentials. Please try again.')
      return
    }

    if (selectedRole === 'Employee') {
      const matchedUser = users.find(
        (user) => user.role === 'EMP' && user.email.toLowerCase() === email && user.password === password,
      )

      const matchedEmployee = employees.find(
        (emp) => emp.email.toLowerCase() === email && emp.password === password,
      )

      if (matchedUser || matchedEmployee) {
        setLoggedInUser({
          ...(matchedEmployee || matchedUser),
          ...(matchedUser || {}),
          role: 'EMP',
        })
        setLoginError('')
        return
      }

      setLoginError('Invalid employee credentials. Please try again.')
      return
    }

    setLoginError('Please select a valid role.')
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    setSelectedRole('')
    setLoginForm({ email: '', password: '' })
    setLoginError('')
    setSignupError('')
    setSignupSuccess('')
    setPasswordError('')
    setLeaveForm({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' })
    setEditingLeaveRequestId(null)
    setPwdForm({ newPassword: '', confirmPassword: '' })
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    const name = signupForm.name.trim()
    const email = signupForm.email.trim().toLowerCase()
    const password = signupForm.password
    const role = signupForm.role === 'Hr' ? 'HR' : 'EMP'
    const empId = signupForm.empId.trim()
    const dept = signupForm.dept.trim()
    const phone = signupForm.phone.trim()
    const address = signupForm.address.trim()

    if (!name || !email || !password) {
      setSignupError('Please fill in all fields to create an account.')
      return false
    }

    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters long.')
      return false
    }

    if (role === 'EMP' && (!empId || !dept)) {
      setSignupError('Please enter an employee ID and department.')
      return false
    }

    const userExists = users.some((user) => user.email.toLowerCase() === email)

    if (userExists) {
      setSignupError('This email is already registered.')
      return false
    }

    if (role === 'EMP' && employees.some((emp) => emp.empId?.toLowerCase() === empId.toLowerCase() || emp.email.toLowerCase() === email)) {
      setSignupError('An employee with this ID or email already exists.')
      return false
    }

    try {
      const userId = `USER-${Date.now()}`
      const newUser = {
        id: userId,
        name,
        email,
        password,
        role,
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        throw new Error('Signup failed')
      }

      if (role === 'EMP') {
        const newEmployee = {
          id: userId,
          empId,
          empName: name,
          dept,
          email,
          password,
          isFirstLogin: true,
          phone,
          address,
        }

        const employeeResponse = await fetch(`${API_URL}/employees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee),
        })

        if (!employeeResponse.ok) {
          throw new Error('Employee creation failed')
        }

        setEmployees((prev) => [...prev, newEmployee])
      }

      setUsers((prev) => [...prev, newUser])
      setSignupForm({
        name: '',
        email: '',
        password: '',
        role: 'Employee',
        empId: '',
        dept: '',
        phone: '',
        address: '',
      })
      setSelectedRole(signupForm.role === 'Hr' ? 'Hr' : 'Employee')
      setSignupError('')
      setSignupSuccess('Account created successfully. Please login.')
      return true
    } catch (error) {
      setSignupError('Unable to create account. Please try again.')
      return false
    }
  }

  const handleUpdateEmployeeProfile = async (field, value) => {
    if (!loggedInUser || loggedInUser.role !== 'EMP' || !currentEmployee) return

    const updatedEmployee = { ...currentEmployee, [field]: value }

    await fetch(`${API_URL}/employees/${loggedInUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    })

    setLoggedInUser((prev) => ({ ...prev, ...updatedEmployee, role: 'EMP' }))
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === loggedInUser.id ? updatedEmployee : emp)),
    )
  }

  const handleSaveEmployeeProfile = async (updatedProfile) => {
    if (!loggedInUser || loggedInUser.role !== 'EMP' || !currentEmployee) return

    const updatedEmployee = { ...currentEmployee, ...updatedProfile }

    await fetch(`${API_URL}/employees/${loggedInUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    })

    setLoggedInUser((prev) => ({ ...prev, ...updatedEmployee, role: 'EMP' }))
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === loggedInUser.id ? updatedEmployee : emp)),
    )
    setEmployeeProfileMessage({ type: 'success', text: 'Profile updated successfully.' })
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()

    if (!loggedInUser || loggedInUser.role !== 'EMP' || !currentEmployee) return

    const { newPassword, confirmPassword } = pwdForm

    if (!newPassword || !confirmPassword) {
      setPasswordError('Both password fields are required.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    const updatedEmployee = {
      ...currentEmployee,
      password: newPassword,
      isFirstLogin: false,
    }

    await fetch(`${API_URL}/employees/${loggedInUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    })

    setLoggedInUser((prev) => ({ ...prev, ...updatedEmployee, role: 'EMP' }))
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === loggedInUser.id ? updatedEmployee : emp)),
    )
    setPasswordError('')
    setPwdForm({ newPassword: '', confirmPassword: '' })
  }

  const resetEmployeeForm = () => {
    setNewEmployee({
      empId: '',
      empName: '',
      dept: '',
      email: '',
      password: 'Welcome@123',
    })
    setIsEditingEmployee(false)
    setEditingEmployeeId(null)
    setShowEmployeeModal(false)
    setEmployeeModalError('')
    setDeleteEmployeeTarget(null)
  }

  const handleEditEmployee = (employee) => {
    setNewEmployee({
      empId: employee.empId || employee.id,
      empName: employee.empName,
      dept: employee.dept,
      email: employee.email,
      password: employee.password || 'Welcome@123',
    })
    setIsEditingEmployee(true)
    setEditingEmployeeId(employee.id)
    setShowEmployeeModal(true)
    setEmployeeModalError('')
    setEmployeeActionMessage({ type: '', text: '' })
  }

  const handleDeleteEmployee = (employee) => {
    setDeleteEmployeeTarget(employee)
  }

  const confirmDeleteEmployee = async () => {
    if (!deleteEmployeeTarget) return

    try {
      await fetch(`${API_URL}/employees/${deleteEmployeeTarget.id}`, {
        method: 'DELETE',
      })

      await refreshEmployeeList()

      if (editingEmployeeId === deleteEmployeeTarget.id) {
        resetEmployeeForm()
      }

      setDeleteEmployeeTarget(null)
      setEmployeeActionMessage({
        type: 'success',
        text: 'Employee deleted successfully.',
      })
    } catch (error) {
      setDeleteEmployeeTarget(null)
      setEmployeeActionMessage({
        type: 'error',
        text: 'Unable to delete employee. Please try again.',
      })
    }
  }

  const handleAddEmployee = async (event) => {
    event.preventDefault()

    const empId = newEmployee.empId.trim()
    const empName = newEmployee.empName.trim()
    const dept = newEmployee.dept.trim()
    const email = newEmployee.email.trim()

    if (!empId || !empName || !dept || !email) {
      const message = 'Please fill in all employee details before adding.'
      setEmployeeModalError(message)
      setEmployeeActionMessage({ type: 'error', text: message })
      return
    }

    const employeeExists = employees.some((emp) => {
      if (isEditingEmployee && editingEmployeeId && emp.id === editingEmployeeId) {
        return false
      }

      const existingEmpId = (emp.empId || emp.id || '').toLowerCase()
      const existingEmail = (emp.email || '').toLowerCase()

      return existingEmpId === empId.toLowerCase() || existingEmail === email.toLowerCase()
    })

    if (employeeExists) {
      const message = 'An employee with this ID or email already exists.'
      setEmployeeModalError(message)
      setEmployeeActionMessage({ type: 'error', text: message })
      return
    }

    const newEmp = {
      empId,
      empName,
      dept,
      email,
      password: newEmployee.password || 'Welcome@123',
      isFirstLogin: true,
      phone: '',
      address: '',
    }

    try {
      if (isEditingEmployee && editingEmployeeId) {
        await fetch(`${API_URL}/employees/${editingEmployeeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newEmp, id: editingEmployeeId }),
        })

        setEmployeeActionMessage({
          type: 'success',
          text: 'Employee updated successfully.',
        })
      } else {
        await fetch(`${API_URL}/employees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmp),
        })

        setEmployeeActionMessage({
          type: 'success',
          text: 'Employee added successfully.',
        })
      }

      await refreshEmployeeList()
      resetEmployeeForm()
      setEmployeeModalError('')
    } catch (error) {
      const message = isEditingEmployee
        ? 'Unable to update employee. Please try again.'
        : 'Unable to add employee. Please try again.'
      setEmployeeModalError(message)
      setEmployeeActionMessage({ type: 'error', text: message })
    }
  }

  const handleLeaveRequest = async (event) => {
    event.preventDefault()

    if (!loggedInUser || loggedInUser.role !== 'EMP') return

    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      return
    }

    if (new Date(leaveForm.endDate) < new Date(leaveForm.startDate)) {
      return
    }

    const leaveRequestPayload = {
      empId: loggedInUser.id,
      empName: loggedInUser.empName || loggedInUser.name,
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reason: leaveForm.reason,
      status: 'Pending',
    }

    if (editingLeaveRequestId) {
      await fetch(`${API_URL}/leaveRequests/${editingLeaveRequestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leaveRequestPayload, id: editingLeaveRequestId }),
      })
    } else {
      await fetch(`${API_URL}/leaveRequests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveRequestPayload),
      })
    }

    await refreshLeaveList()
    setLeaveForm({
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    })
    setEditingLeaveRequestId(null)
  }

  const handleEditLeaveRequest = (request) => {
    setEditingLeaveRequestId(request.id)
    setLeaveForm({
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
    })
  }

  const handleCancelLeaveEdit = () => {
    setEditingLeaveRequestId(null)
    setLeaveForm({
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    })
  }

  const handleDeleteLeaveRequest = async (requestId) => {
    const targetRequest = leaveRequests.find((request) => request.id === requestId)

    if (!targetRequest || targetRequest.status !== 'Pending') {
      return
    }

    await fetch(`${API_URL}/leaveRequests/${requestId}`, {
      method: 'DELETE',
    })

    if (editingLeaveRequestId === requestId) {
      handleCancelLeaveEdit()
    }

    await refreshLeaveList()
  }

  const handleLeaveStatus = async (requestId, status) => {
    await fetch(`${API_URL}/leaveRequests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    setLeaveRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status } : request,
      ),
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            loggedInUser ? (
              loggedInUser.role === 'HR' ? (
                <Navigate to="/hr-dashboard" replace />
              ) : (
                <Navigate to="/employee-dashboard" replace />
              )
            ) : (
              <LoginPage
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                loginError={loginError}
                handleLogin={handleLogin}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                signupForm={signupForm}
                setSignupForm={setSignupForm}
                signupSuccess={signupSuccess}
                signupError={signupError}
                setSignupError={setSignupError}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            loggedInUser ? (
              loggedInUser.role === 'HR' ? (
                <Navigate to="/hr-dashboard" replace />
              ) : (
                <Navigate to="/employee-dashboard" replace />
              )
            ) : (
              <SignupPage
                signupForm={signupForm}
                setSignupForm={setSignupForm}
                signupError={signupError}
                signupSuccess={signupSuccess}
                handleSignup={handleSignup}
              />
            )
          }
        />

        <Route
          path="/hr-dashboard"
          element={
            loggedInUser?.role === 'HR' ? (
              <HRDashboardPage
                employees={filteredEmployees}
                leaveRequests={leaveRequests}
                newEmployee={newEmployee}
                setNewEmployee={setNewEmployee}
                employeeActionMessage={employeeActionMessage}
                employeeModalError={employeeModalError}
                employeeSearch={employeeSearch}
                setEmployeeSearch={setEmployeeSearch}
                employeeSort={employeeSort}
                setEmployeeSort={setEmployeeSort}
                isEditingEmployee={isEditingEmployee}
                showEmployeeModal={showEmployeeModal}
                deleteEmployeeTarget={deleteEmployeeTarget}
                handleAddEmployee={handleAddEmployee}
                handleEditEmployee={handleEditEmployee}
                handleDeleteEmployee={handleDeleteEmployee}
                confirmDeleteEmployee={confirmDeleteEmployee}
                cancelDeleteEmployee={() => setDeleteEmployeeTarget(null)}
                handleLeaveStatus={handleLeaveStatus}
                handleLogout={handleLogout}
                resetEmployeeForm={resetEmployeeForm}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            loggedInUser?.role === 'EMP' ? (
              <EmployeeDashboardPage
                loggedInUser={loggedInUser}
                leaveRequests={leaveRequests}
                leaveForm={leaveForm}
                setLeaveForm={setLeaveForm}
                editingLeaveRequestId={editingLeaveRequestId}
                pwdForm={pwdForm}
                setPwdForm={setPwdForm}
                passwordError={passwordError}
                employeeProfileMessage={employeeProfileMessage}
                handlePasswordChange={handlePasswordChange}
                handleLeaveRequest={handleLeaveRequest}
                handleCancelLeaveEdit={handleCancelLeaveEdit}
                handleEditLeaveRequest={handleEditLeaveRequest}
                handleDeleteLeaveRequest={handleDeleteLeaveRequest}
                handleUpdateEmployeeProfile={handleUpdateEmployeeProfile}
                handleSaveEmployeeProfile={handleSaveEmployeeProfile}
                handleLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
