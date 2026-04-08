import { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi'
import AuthLayout from '../../components/Auth/AuthLayout'
import authService from '../../services/authService'
import { useDispatch } from 'react-redux'
import { setGlobalLoading, addAlert } from '../../redux/uiSlice'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    dispatch(setGlobalLoading({
        loading: true,
        title: 'Verifying...',
        message: 'Checking for your account...'
    }))

    try {
        const emailExists = await authService.checkEmailAvailability(email)
        
        if (!emailExists) {
            dispatch(setGlobalLoading({ loading: false }))
            dispatch(addAlert({ type: 'error', message: 'Email address not found in our records.' }))
            return
        }

        const otp = generateOtp()
        dispatch(setGlobalLoading({ loading: false }))
        dispatch(addAlert({ type: 'success', message: 'Reset code sent to your email.' }))

        navigate('/otp', { 
            state: { 
                email, 
                generatedOtp: otp,
                isResetPassword: true
            } 
        })
    } catch (err) {
        dispatch(setGlobalLoading({ loading: false }))
        dispatch(addAlert({ type: 'error', message: err.message || 'Something went wrong.' }))
    }
  }

  return (
    <AuthLayout>
      <div className="text-center text-lg-start mb-5">
        <h2 className="display-6 fw-black text-white mb-2 tracking-tight">Reset Password</h2>
        <p className="text-slate fs-6">Enter your email to receive a recovery code for your account.</p>
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <div className="mt-2 d-flex flex-row flex-wrap gap-3">
            <Button type="submit" className="btn-gold flex-grow-1 py-3 rounded-pill fw-black fs-5 d-flex align-items-center justify-content-center gap-2 shadow-gold">
              Send Reset Code
              <HiOutlineArrowRight size={20} />
            </Button>
            
            <Link to="/login" className="w-100 text-center text-decoration-none pt-4 border-top border-white border-opacity-5">
              <Button variant="link" className="text-slate smaller fw-bold uppercase tracking-widest d-flex align-items-center justify-content-center gap-2 mx-auto hover-gold p-0">
                <HiOutlineArrowLeft size={18} />
                Back to Login
              </Button>
            </Link>
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
          .hover-gold:hover {
            color: var(--primary-gold) !important;
            transform: translateX(-4px);
          }
        `}
      </style>
    </AuthLayout>
  )
}
