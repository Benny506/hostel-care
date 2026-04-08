import { useState, useEffect } from 'react'
import { Form, Button, InputGroup, ProgressBar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineArrowRight, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import AuthLayout from '../../components/Auth/AuthLayout'
import authService from '../../services/authService'
import { useDispatch } from 'react-redux'
import { setGlobalLoading, addAlert } from '../../redux/uiSlice'
import { useLocation } from 'react-router-dom'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { email } = location.state || {}

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const calculateStrength = (pwd) => {
    let score = 0
    if (pwd.length > 8) score += 25
    if (/[A-Z]/.test(pwd)) score += 25
    if (/[0-9]/.test(pwd)) score += 25
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25
    return score
  }

  const strength = calculateStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      dispatch(addAlert({ type: 'error', message: "Passwords don't match" }))
      return
    }

    dispatch(setGlobalLoading({
      loading: true,
      title: 'Updating...',
      message: 'Securing your account...'
    }))

    try {
      await authService.resetPassword(email, password)
      
      dispatch(setGlobalLoading({ loading: false }))
      dispatch(addAlert({ type: 'success', message: 'Password updated successfully. Please log in.' }))
      
      navigate('/login')
    } catch (err) {
      dispatch(setGlobalLoading({ loading: false }))
      dispatch(addAlert({ type: 'error', message: err.message || 'Failed to update password.' }))
    }
  }

  return (
    <AuthLayout>
      <div className="text-center text-lg-start mb-5">
        <h2 className="display-6 fw-black text-white mb-2 tracking-tight">Create New Password</h2>
        <p className="text-slate fs-6">Enter a strong new password to secure your hostel account.</p>
      </div>

      <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        <Form.Group controlId="password">
          <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-2 px-1">New Password</Form.Label>
          <InputGroup className="glass-input-group mb-2">
            <InputGroup.Text className="bg-transparent border-0 text-slate pe-0">
              <HiOutlineLockClosed size={20} />
            </InputGroup.Text>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              className="bg-transparent border-0 text-white py-3 ps-3"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="link"
              className="text-slate border-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
            </Button>
          </InputGroup>
          <div className="px-1 mt-2">
            <div className="d-flex justify-content-between mb-2">
                <span className="smaller text-slate fw-bold uppercase tracking-widest opacity-60">Security Strength</span>
                <span className={`smaller fw-black uppercase tracking-widest ${strength === 100 ? 'text-success' : strength > 50 ? 'text-gold' : 'text-danger'}`}>
                    {strength === 100 ? 'Absolute' : strength > 50 ? 'Secure' : 'Vulnerable'}
                </span>
            </div>
            <ProgressBar 
                now={strength} 
                variant={strength === 100 ? 'success' : strength > 50 ? 'warning' : 'danger'} 
                className="bg-white bg-opacity-5"
                style={{ height: '4px' }}
            />
          </div>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-2 px-1">Confirm New Password</Form.Label>
          <InputGroup className="glass-input-group">
            <InputGroup.Text className="bg-transparent border-0 text-slate pe-0">
              <HiOutlineLockClosed size={20} />
            </InputGroup.Text>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              className="bg-transparent border-0 text-white py-3 ps-3"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              variant="link"
              className="text-slate border-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
            </Button>
          </InputGroup>
        </Form.Group>

        <div className="mt-4 pt-2">
          <Button 
            type="submit" 
            disabled={strength < 50 || password !== confirmPassword}
            className="btn-gold w-100 py-3 rounded-pill fw-black fs-5 d-flex align-items-center justify-content-center gap-2"
          >
            Update Password
            <HiOutlineShieldCheck size={24} />
          </Button>
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
          .progress-bar { transition: all 0.5s ease; }
        `}
      </style>
    </AuthLayout>
  )
}
