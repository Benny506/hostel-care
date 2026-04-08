import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowRight } from 'react-icons/hi'
import AuthLayout from '../../components/Auth/AuthLayout'
import authService from '../../services/authService'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/authSlice'
import { setGlobalLoading, addAlert } from '../../redux/uiSlice'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Form, Button, InputGroup } from 'react-bootstrap'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()

    dispatch(setGlobalLoading({
      loading: true,
      title: 'Signing In...',
      message: 'Verifying your account...'
    }))

    try {
      console.log('Signing into hostel account...', formData.email)

      // 1. Authenticate with Supabase
      const authData = await authService.login(formData.email, formData.password)
      const user = authData.user

      // 2. Check Profile Integrity
      const profile = await authService.getUserProfile(user.id)

      dispatch(setGlobalLoading({ loading: false }))

      if (!profile) {
        console.log('Profile Incomplete. Redirecting to account setup.')
        dispatch(addAlert({ type: 'info', message: 'Account verified. Profile setup required.' }))
        navigate('/account-setup')
        return;
      }

      // 3. Complete Login if Profile exists
      dispatch(loginSuccess({ user: { id: user.id, email: user.email }, role: profile.role }))
      dispatch(addAlert({ type: 'success', message: `Welcome back, ${profile.full_name || 'Resident'}` }))
      navigate(profile.role === 'warden' ? '/warden-dashboard' : '/student-dashboard')

    } catch (error) {
      dispatch(setGlobalLoading({ loading: false }))
      dispatch(addAlert({ type: 'error', message: error.message || 'Access Denied: Something went wrong.' }))
    }
  }

  return (
    <AuthLayout>
      <div className="text-center text-lg-start mb-5">
        <h2 className="display-6 fw-black text-white mb-2 tracking-tight">Resident Login</h2>
        <p className="text-slate fs-6">Enter your email and password to access the hostel dashboard.</p>
      </div>

      <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        <Form.Group controlId="email">
          <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-2 px-1">Email Address</Form.Label>
          <InputGroup className="glass-input-group">
            <InputGroup.Text className="bg-transparent border-0 text-slate pe-0">
              <HiOutlineMail size={20} />
            </InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="e.g. warden@hostel.edu"
              required
              className="bg-transparent border-0 text-white py-3 ps-3"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="password">
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-0">Password</Form.Label>
            <Link to="/forgot-password" size="sm" className="smaller text-slate text-decoration-none hover-gold">
              Forgot Password?
            </Link>
          </div>
          <InputGroup className="glass-input-group">
            <InputGroup.Text className="bg-transparent border-0 text-slate pe-0">
              <HiOutlineLockClosed size={20} />
            </InputGroup.Text>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              className="bg-transparent border-0 text-white py-3 ps-3"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
              variant="link"
              className="text-slate border-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
            </Button>
          </InputGroup>
        </Form.Group>

        <div className="mt-2 d-flex flex-column gap-3">
          <Button type="submit" className="btn-gold w-100 py-3 rounded-pill fw-black fs-5 d-flex align-items-center justify-content-center gap-2">
            Sign In
            <HiOutlineArrowRight size={20} />
          </Button>

          <div className="text-center pt-3 border-top border-white border-opacity-5">
            <span className="text-slate smaller fw-bold uppercase tracking-widest">New Resident?</span>
            <Link to="/register" className="ms-2 text-gold fw-black text-decoration-none smaller uppercase tracking-widest hover-underline">
              Join Hostel
            </Link>
          </div>
        </div>
      </Form>

      <style>
        {`
          .glass-input-group {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.25rem;
            transition: all 0.3s ease;
          }
          .glass-input-group:focus-within {
            border-color: var(--primary-gold);
            background: rgba(212, 175, 55, 0.05);
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
          }
          .hover-underline:hover {
            text-decoration: underline !important;
          }
        `}
      </style>
    </AuthLayout>
  )
}
