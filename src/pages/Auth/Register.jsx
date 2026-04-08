import { useState } from 'react'
import { Form, Button, InputGroup, Row, Col, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineEyeOff
} from 'react-icons/hi'
import AuthLayout from '../../components/Auth/AuthLayout'
import authService from '../../services/authService'
import { useDispatch } from 'react-redux'
import { setGlobalLoading, addAlert } from '../../redux/uiSlice'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      dispatch(addAlert({ type: 'error', message: 'Passwords do not match.' }))
      return
    }

    dispatch(setGlobalLoading({
      loading: true,
      title: 'Joining...',
      message: 'Setting up your profile...'
    }))

    try {
      const emailExists = await authService.checkEmailAvailability(formData.email)

      if (emailExists) {
        dispatch(setGlobalLoading({ loading: false }))
        dispatch(addAlert({ type: 'error', message: 'Email already registered.' }))
        return
      }

      const otp = generateOtp()

      dispatch(setGlobalLoading({ loading: false }))
      dispatch(addAlert({ type: 'success', message: 'Verification code sent!' }))

      navigate('/otp', {
        state: {
          email: formData.email,
          password: formData.password,
          generatedOtp: otp
        }
      })
    } catch (err) {
      dispatch(setGlobalLoading({ loading: false }))
      dispatch(addAlert({ type: 'error', message: err.message || 'Something went wrong.' }))
    }
  }

  return (
    <AuthLayout>
      <div className="text-center text-lg-start mb-4">
        <Badge className="bg-gold-glow text-gold px-3 py-2 rounded-pill mb-3 border border-gold border-opacity-20 uppercase smaller tracking-widest fw-bold">Join Our Community</Badge>
        <h1 className="fw-black text-white display-5 mb-3 tracking-tight">Create Account</h1>
        <p className="text-slate fs-6">Sign up to manage your hostel maintenance requests easily.</p>
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
              placeholder="name@example.com"
              required
              className="bg-transparent border-0 text-white py-3 ps-3"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-2 px-1">Password</Form.Label>
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

        <Form.Group controlId="confirmPassword">
          <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-2 px-1">Confirm Password</Form.Label>
          <InputGroup className="glass-input-group">
            <InputGroup.Text className="bg-transparent border-0 text-slate pe-0">
              <HiOutlineLockClosed size={20} />
            </InputGroup.Text>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              className="bg-transparent border-0 text-white py-3 ps-3"
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

        <div className="mt-2 d-flex flex-column gap-3">
          <Button type="submit" className="btn-gold w-100 py-3 rounded-pill fw-bold uppercase tracking-widest-xl shadow-gold-heavy border-0 d-flex align-items-center justify-content-center gap-2">
            Sign Up
            <HiOutlineArrowRight size={20} />
          </Button>

          <div className="text-center pt-3 border-top border-white border-opacity-5">
            <span className="text-slate smaller fw-bold uppercase tracking-widest">Already have an account?</span>
            <Link to="/login" className="ms-2 text-gold fw-black text-decoration-none smaller uppercase tracking-widest hover-underline">
              Log In
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
