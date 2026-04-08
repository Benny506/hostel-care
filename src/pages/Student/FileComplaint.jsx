import { useState } from 'react'
import { Form, Button, Row, Col, InputGroup, Card, Badge } from 'react-bootstrap'
import {
    HiOutlinePlusCircle,
    HiOutlineClipboardList,
    HiOutlineLightningBolt,
    HiOutlineArrowRight,
    HiOutlinePaperClip,
    HiOutlineShieldCheck
} from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'motion/react'
import { setGlobalLoading, addAlert } from '../../redux/uiSlice'
import complaintService from '../../services/complaintService'

const categories = ['Electrical', 'Plumbing', 'Carpentry', 'Safety', 'Facility', 'Other']
const priorities = [
    { name: 'low', label: 'Low Urgency', color: 'slate' },
    { name: 'normal', label: 'Standard Protocol', color: 'gold' },
    { name: 'high', label: 'High Priority', color: 'gold' },
    { name: 'emergency', label: 'Critical Alert', color: 'danger' }
]

export default function FileComplaint() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'normal'
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.category) {
            dispatch(addAlert({ type: 'info', message: 'Category selection is required for institutional tracking.' }))
            return
        }

        dispatch(setGlobalLoading({
            loading: true,
            title: 'Initiating Maintenance Protocol...',
            message: 'Securing administrative credentials and provisioning ticket...'
        }))

        try {
            console.log('Filing Complaint Protocol...', formData)
            await complaintService.createComplaint(formData)

            dispatch(setGlobalLoading({ loading: false }))
            dispatch(addAlert({ type: 'success', message: 'Institutional Request Filed Successfully. Tracking Initiated.' }))

            navigate('/student-dashboard/my-complaints')
        } catch (error) {
            dispatch(setGlobalLoading({ loading: false }))
            dispatch(addAlert({ type: 'error', message: error.message || 'Administrative protocol failed.' }))
        }
    }

    return (
        <div className="animate-in pb-5 max-w-lg mx-auto">
            <header className="text-center mb-4">
                <Badge className="bg-gold-glow text-gold p-1 px-4 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-20 shadow-sm">Protocol Submission</Badge>
                <h3 className="fw-black text-dark tracking-tight mb-2">New Maintenance Request</h3>
                <p className="text-muted smaller fw-medium opacity-75">Detail your residential concern for administrative resolution.</p>
            </header>

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">

                <div className="bg-white p-4 p-md-5 rounded-4 border border-black border-opacity-5 shadow-sm">
                    <Row className="g-4">
                        <Col md={12}>
                            <Form.Group controlId="title">
                                <Form.Label className="smaller text-dark fw-bold uppercase tracking-widest mb-2 px-1" style={{ fontSize: '10px' }}>Request Title</Form.Label>
                                <InputGroup className="bg-light border border-black border-opacity-10 rounded-4 px-3 focus-within-gold">
                                    <Form.Control
                                        placeholder="Broken Light, Faucet Leak, etc."
                                        required
                                        className="bg-transparent border-0 text-dark py-2 ps-2 smaller"
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        style={{ height: '50px' }}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group controlId="category">
                                <Form.Label className="smaller text-dark fw-bold uppercase tracking-widest mb-2 px-1" style={{ fontSize: '10px' }}>Institutional Category</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <Button
                                            key={cat}
                                            variant="link"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`p-1 px-3 py-2 border rounded-pill transition-all text-decoration-none smaller fw-bold uppercase tracking-widest ${formData.category === cat ? 'bg-gold text-dark border-gold shadow-sm' : 'bg-light text-muted border-black border-opacity-5 hover-gold-soft'}`}
                                            style={{ fontSize: '10px' }}
                                        >
                                            {cat}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group controlId="priority">
                                <Form.Label className="smaller text-dark fw-bold uppercase tracking-widest mb-2 px-1" style={{ fontSize: '10px' }}>Urgency Level</Form.Label>
                                <div className="d-flex flex-wrap gap-2 bg-light rounded-pill p-1 border border-black border-opacity-5" style={{ maxWidth: '500px' }}>
                                    {priorities.map((item) => (
                                        <Button
                                            key={item.name}
                                            variant="link"
                                            onClick={() => setFormData({ ...formData, priority: item.name })}
                                            className={`flex-grow-1 py-2 rounded-pill text-decoration-none transition-all ${formData.priority === item.name ? 'bg-white text-gold border border-gold border-opacity-20 shadow-sm' : 'text-muted'}`}
                                        >
                                            <span className="smaller fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>{item.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group controlId="description">
                                <Form.Label className="smaller text-dark fw-bold uppercase tracking-widest mb-2 px-1" style={{ fontSize: '10px' }}>Description</Form.Label>
                                <div className="bg-light border border-black border-opacity-10 rounded-4 px-3 py-2">
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Describe the nature of the institutional concern in detail..."
                                        required
                                        className="bg-transparent border-0 text-dark ps-1 smaller"
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="mt-5">
                        <Button
                            type="submit"
                            className="btn-gold w-100 py-2 rounded-pill fw-bold fs-6 d-flex align-items-center justify-content-center gap-2 shadow-gold"
                            style={{ height: '54px' }}
                        >
                            Execute Institutional Request
                            <HiOutlineShieldCheck size={22} />
                        </Button>
                        <p className="text-center text-muted smaller mt-3 opacity-50 fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>Institutional Clearance: Resident Sector 4</p>
                    </div>
                </div>
            </Form>

            <style>
                {`
                    .hover-gold-soft:hover {
                        background: rgba(212, 175, 55, 0.05) !important;
                        color: #D4AF37 !important;
                        border-color: rgba(212, 175, 55, 0.2) !important;
                    }
                    .shadow-gold-xl { 
                        box-shadow: 0 20px 40px -12px rgba(212, 175, 55, 0.3);
                    }
                    .max-w-lg { max-width: 800px; }
                    .bg-gold-glow-radial {
                        background: radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 60%);
                    }
                `}
            </style>
        </div>
    )
}
