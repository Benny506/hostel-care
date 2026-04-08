import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Otp from './pages/Auth/Otp'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import AccountSetup from './pages/Auth/AccountSetup'
import GlobalAlerts from './components/Alert/GlobalAlerts'
import GlobalLoader from './components/Loader/GlobalLoader'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from './services/authService'
import { loginSuccess, setInitChecked } from './redux/authSlice'

// Student Dashboard Components
import StudentLayout from './layouts/StudentLayout'
import StudentOverview from './pages/Student/StudentOverview'
import MyComplaints from './pages/Student/MyComplaints'
import FileComplaint from './pages/Student/FileComplaint'
import AnnouncementFeed from './pages/Student/AnnouncementFeed'

// Warden Dashboard Components
import WardenLayout from './layouts/WardenLayout'
import WardenOverview from './pages/Warden/WardenOverview'
import WardenComplaints from './pages/Warden/WardenComplaints'
import WardenAnnouncements from './pages/Warden/WardenAnnouncements'
import WardenStudents from './pages/Warden/WardenStudents'

// Protection Guards
import DashboardGuard from './components/Auth/DashboardGuard'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const initialize = async () => {
        try {
            console.log('Authenticating session...')
            const { user, profile } = await authService.initializeAuth()
            
            if (user && profile) {
                console.log('User verified.')
                dispatch(loginSuccess({ user, role: profile.role }))
            } else {
                dispatch(setInitChecked(true))
                console.log('Unauthenticated visit.')
            }
        } catch (error) {
            console.error('Initialization Error:', error)
            dispatch(setInitChecked(true))
        }
    }
    initialize()
  }, [dispatch])

  return (
    <Router>
      <GlobalAlerts />
      <GlobalLoader />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Authentication Suite */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account-setup" element={<AccountSetup />} />
        
        {/* Student Dashboard (Authenticated & Guarded) */}
        <Route path="/student-dashboard" element={<DashboardGuard allowedRole="student" />}>
          <Route element={<StudentLayout />}>
            <Route index element={<StudentOverview />} />
            <Route path="my-complaints" element={<MyComplaints />} />
            <Route path="new-complaint" element={<FileComplaint />} />
            <Route path="announcements" element={<AnnouncementFeed />} />
          </Route>
        </Route>
        
        {/* Warden Dashboard (Authenticated & Guarded) */}
        <Route path="/warden-dashboard" element={<DashboardGuard allowedRole="warden" />}>
          <Route element={<WardenLayout />}>
            <Route index element={<WardenOverview />} />
            <Route path="tickets" element={<WardenComplaints />} />
            <Route path="announcements" element={<WardenAnnouncements />} />
            <Route path="residents" element={<WardenStudents />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
