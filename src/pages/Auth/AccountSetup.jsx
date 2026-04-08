import { useState } from 'react'
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
    HiOutlineUser,
    HiOutlineHome,
    HiOutlineBriefcase,
    HiOutlineKey,
    HiOutlineArrowRight,
    HiOutlineShieldCheck
} from 'react-icons/hi'
import AuthLayout from '../../components/Auth/AuthLayout'
import authService from '../../services/authService'
import { useDispatch } from 'react-redux'
import { setGlobalLoading, addAlert } from '../../redux/uiSlice'
import { loginSuccess } from '../../redux/authSlice'
import { Badge } from 'react-bootstrap'

export default function AccountSetup() {
    const [role, setRole] = useState('student')
    const [formData, setFormData] = useState({
        name: '',
        room: '',
        adminCode: ''
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()

        dispatch(setGlobalLoading({
            loading: true,
            title: 'Setting up...',
            message: 'Saving your profile details...'
        }))

        try {
            const profileData = {
                full_name: formData.name,
                role: role,
                room_number: role === 'student' ? formData.room : null,
                department_id: role === 'warden' ? formData.room : null
            }

            console.log('Finalizing Account Setup Protocol...', profileData)
            const { user, profile } = await authService.completeProfile(profileData)

            // Synchronize Redux State immediately to satisfy DashboardGuard
            dispatch(loginSuccess({ user, role: profile.role }))

            dispatch(setGlobalLoading({ loading: false }))
            dispatch(addAlert({ type: 'success', message: 'Profile saved successfully. Welcome!' }))

            // Navigate based on role
            navigate(role === 'warden' ? '/warden-dashboard' : '/student-dashboard')
        } catch (error) {
            dispatch(setGlobalLoading({ loading: false }))
            dispatch(addAlert({ type: 'error', message: error.message || 'Failed to finalize profile provisioning.' }))
        }
    }

    return (
        <AuthLayout>
            <div className="text-center text-lg-start mb-4">
                <Badge className="bg-gold-glow text-gold px-3 py-2 rounded-pill mb-3 border border-gold border-opacity-20 uppercase smaller tracking-widest fw-bold">Step 2: Setting up your account</Badge>
                <h1 className="fw-black text-white display-5 mb-3 tracking-tight">Complete Profile</h1>
                <p className="text-slate fs-6">Tell us a bit more about yourself to finish your registration.</p>
            </div>

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                {/* Role Selection */}
                <div className="d-flex gap-2 p-2 bg-white bg-opacity-5 rounded-4 mb-3 border border-white border-opacity-5">
                    <Button
                        variant="link"
                        className={`flex-grow-1 py-2 rounded-3 text-decoration-none transition-all ${role === 'student' ? 'bg-gold-glow text-gold border-gold border-opacity-20 shadow-sm' : 'text-slate'}`}
                        onClick={() => setRole('student')}
                    >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            <HiOutlineHome size={18} />
                            <span className="smaller fw-black uppercase tracking-widest">Resident</span>
                        </div>
                    </Button>
                    <Button
                        variant="link"
                        className={`flex-grow-1 py-2 rounded-3 text-decoration-none transition-all ${role === 'warden' ? 'bg-gold-glow text-gold border-gold border-opacity-20 shadow-sm' : 'text-slate'}`}
                        onClick={() => setRole('warden')}
                    >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            <HiOutlineBriefcase size={18} />
                            <span className="smaller fw-black uppercase tracking-widest">Administrator</span>
                        </div>
                    </Button>
                </div>

                <Row className="g-3">
                    <Col md={12}>
                        <Form.Group controlId="name">
                            <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-2 px-1">Full Name</Form.Label>
                            <InputGroup className="glass-input-group">
                                <InputGroup.Text className="bg-transparent border-0 text-slate pe-0">
                                    <HiOutlineUser size={20} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="John Doe"
                                    required
                                    className="bg-transparent border-0 text-white py-3 ps-3"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col md={role === 'warden' ? 12 : 12}>
                        <Form.Group controlId="room">
                            <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-2 px-1">
                                {role === 'warden' ? 'Department ID' : 'Hostel Room Number'}
                            </Form.Label>
                            <InputGroup className="glass-input-group">
                                <InputGroup.Text className="bg-transparent border-0 text-slate pe-0">
                                    <HiOutlineHome size={20} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder={role === 'warden' ? 'HC-ADMIN' : 'Block A, 101'}
                                    required
                                    className="bg-transparent border-0 text-white py-3 ps-3"
                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    {role === 'warden' && (
                        <Col md={12}>
                            <Form.Group controlId="adminCode">
                                <Form.Label className="smaller text-gold fw-bold uppercase tracking-widest mb-2 px-1">Admin Verification</Form.Label>
                                <InputGroup className="glass-input-group">
                                    <InputGroup.Text className="bg-transparent border-0 text-slate pe-0">
                                        <HiOutlineKey size={20} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter Admin Code"
                                        required
                                        className="bg-transparent border-0 text-white py-3 ps-3"
                                        onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    )}
                </Row>

                <div className="mt-4">
                    <Button type="submit" className="btn-gold w-100 py-3 rounded-pill fw-bold uppercase tracking-widest-xl shadow-gold-heavy border-0">
                        Save Profile
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
        `}
            </style>
        </AuthLayout>
    )
}
