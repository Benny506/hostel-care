import { useState, useEffect, useRef } from 'react'
import { Form, Button, Badge } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { HiOutlineShieldCheck, HiOutlineRefresh, HiOutlineExclamationCircle } from 'react-icons/hi'
import AuthLayout from '../../components/Auth/AuthLayout'
import authService from '../../services/authService'
import { useDispatch } from 'react-redux'
import { setGlobalLoading, addAlert } from '../../redux/uiSlice'

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(59)
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Retrieve state data from navigation
  const { email, password, generatedOtp, isResetPassword } = location.state || {}

  useEffect(() => {
    if (!generatedOtp) {
      navigate(isResetPassword ? '/forgot-password' : '/register')
    }
  }, [generatedOtp, navigate, isResetPassword])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleInputChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const enteredOtp = otp.join('')

    if (enteredOtp !== generatedOtp) {
      dispatch(addAlert({ type: 'error', message: 'Verification Code invalid. Access Denied.' }))
      return
    }

    if (isResetPassword) {
        dispatch(addAlert({ type: 'success', message: 'Identity verified. You can now reset your password.' }))
        navigate('/reset-password', { state: { email } })
        return
    }

    dispatch(setGlobalLoading({
      loading: true,
      title: 'Verifying...',
      message: 'Processing your request...'
    }))

    try {
      console.log('Initiating User Provisioning Protocol...')
      await authService.createOnlyUser(email, password)

      dispatch(setGlobalLoading({ loading: false }))
      dispatch(addAlert({ type: 'success', message: 'Account verified. Welcome!' }))

      navigate('/login')
    } catch (error) {
      dispatch(setGlobalLoading({ loading: false }))
      dispatch(addAlert({ type: 'error', message: error.message || 'Provisioning Protocol Failed.' }))
    }
  }

  return (
    <AuthLayout>
      <div className="text-center text-lg-start mb-4">
        <h2 className="display-6 fw-black text-white mb-2 tracking-tight">Identity Verification</h2>
        <p className="text-slate fs-6 mb-3">Enter the 6-digit code sent to your email to continue.</p>

        {/* Demo Verification Badge */}
        <Badge className="bg-gold-glow text-gold border border-gold border-opacity-20 px-3 py-2 rounded-4 fw-black smaller uppercase tracking-widest-xl shadow-sm d-inline-flex align-items-center gap-2">
          <HiOutlineExclamationCircle size={18} />
          Verification Code: {generatedOtp}
        </Badge>
      </div>

      <Form onSubmit={handleVerify} className="d-flex flex-column gap-4">
        <div className="d-flex justify-content-center gap-2 mb-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="otp-input text-center fw-black text-black bg-white bg-opacity-5 border border-white border-opacity-10 rounded-4 focus-gold transition-all"
              style={{ width: '45px', height: '55px', fontSize: '1.25rem' }}
            />
          ))}
        </div>

        <div className="d-flex flex-column gap-3">
          <div className="mt-4">
            <Button type="submit" className="btn-gold w-100 py-3 rounded-pill fw-black fs-5 d-flex align-items-center justify-content-center gap-2 shadow-gold">
              Verify Code
              <HiOutlineShieldCheck size={24} />
            </Button>
          </div>

          <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white border-opacity-5">
            <Button
              variant="link"
              disabled={timeLeft > 0}
              className="text-gold text-decoration-none smaller fw-black uppercase tracking-widest p-0 d-flex align-items-center gap-2"
              onClick={() => setTimeLeft(59)}
            >
              <HiOutlineRefresh size={18} />
              Resend Code
            </Button>
          </div>
        </div>
      </Form>

      <style>
        {`
          .otp-input:focus {
            outline: none;
            border-color: var(--primary-gold) !important;
            background: rgba(212, 175, 55, 0.05);
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
            transform: translateY(-2px);
          }
          .tabular-nums { font-variant-numeric: tabular-nums; }
          .transition-all { transition: all 0.3s ease; }
        `}
      </style>
    </AuthLayout>
  )
}
