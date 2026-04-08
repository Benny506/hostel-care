import { useEffect, useState } from 'react'
import { Modal, Button, Badge, Row, Col, Form } from 'react-bootstrap'
import {
    HiOutlineViewGrid,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamation,
    HiOutlineFilter,
    HiOutlineSearch,
    HiOutlineDotsVertical
} from 'react-icons/hi'
import { motion, AnimatePresence } from 'motion/react'
import complaintService from '../../services/complaintService'
import { useDispatch } from 'react-redux'
import { addAlert, setGlobalLoading } from '../../redux/uiSlice'

export default function WardenComplaints() {
    const [complaints, setComplaints] = useState([])
    const [filteredComplaints, setFilteredComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [activeComplaint, setActiveComplaint] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        fetchComplaints()
    }, [])

    useEffect(() => {
        let result = complaints
        if (filter !== 'all') {
            result = result.filter(c => c.status === filter)
        }
        if (searchTerm) {
            result = result.filter(c =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.student?.room_number?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        setFilteredComplaints(result)
    }, [filter, searchTerm, complaints])

    const fetchComplaints = async () => {
        try {
            setLoading(true)
            const data = await complaintService.getAllComplaints()
            setComplaints(data)
        } catch (err) {
            console.error('Error fetching student requests:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id, status) => {
        try {
            dispatch(setGlobalLoading({ loading: true, title: 'Updating...', message: 'Updating request status...' }))
            await complaintService.updateComplaintStatus(id, status)
            dispatch(addAlert({ type: 'success', message: 'Status updated successfully.' }))
            fetchComplaints()
            setShowDetailModal(false)
        } catch (err) {
            dispatch(addAlert({ type: 'error', message: err.message }))
        } finally {
            dispatch(setGlobalLoading({ loading: false }))
        }
    }

    const StatusBadge = ({ status }) => {
        const configs = {
            pending: { bg: 'bg-gold', text: 'text-black', icon: <HiOutlineClock size={12} /> },
            'in-progress': { bg: 'bg-info', text: 'text-white', icon: <HiOutlineExclamation size={12} /> },
            resolved: { bg: 'bg-success', text: 'text-white', icon: <HiOutlineCheckCircle size={12} /> }
        }
        const config = configs[status] || configs.pending
        return (
            <Badge className={`${config.bg} ${config.text} p-1 px-3 rounded-pill smaller fw-bold uppercase tracking-widest d-inline-flex align-items-center gap-2`}>
                {config.icon}
                {status}
            </Badge>
        )
    }

    return (
        <div className="animate-in pb-5">
            <header className="mb-5">
                <Badge className="bg-gold-glow text-gold p-1 px-3 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10 shadow-gold-sm">Maintenance Catalog</Badge>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                    <h2 className="text-dark fw-black mb-0 tracking-tight">Student Requests</h2>

                    {/* Filters & Search */}
                    <div className="d-flex align-items-center gap-3 flex-grow-1 justify-content-md-end">
                        <div className="position-relative flex-grow-1" style={{ maxWidth: '300px' }}>
                            <HiOutlineSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                            <Form.Control
                                type="text"
                                placeholder="Search by name, room, or title..."
                                className="ps-5 py-2 rounded-pill bg-white border border-black border-opacity-5 shadow-sm smaller"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <Row className="g-4 mb-4">
                {['all', 'pending', 'in-progress', 'resolved'].map((s) => (
                    <Col key={s} xs={6} md={3}>
                        <button
                            onClick={() => setFilter(s)}
                            style={{
                                fontSize: '13px'
                            }}
                            className={`w-100 p-2 rounded-pill border transition-all smaller fw-bold uppercase tracking-widest ${filter === s ? 'bg-gold text-black border-gold shadow-gold-sm' : 'bg-white text-muted border-black border-opacity-5'}`}
                        >
                            {s}
                        </button>
                    </Col>
                ))}
            </Row>

            {/* Complaint List */}
            <div className="d-flex flex-column gap-3">
                {loading ? (
                    <div className="p-5 text-center">
                        <div className="spinner-border text-gold" role="status"></div>
                        <p className="mt-3 text-muted smaller fw-bold tracking-widest uppercase">Loading All Requests...</p>
                    </div>
                ) : filteredComplaints.length > 0 ? (
                    filteredComplaints.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 rounded-4 border border-black border-opacity-5 shadow-sm d-flex align-items-center flex-wrap gap-4 hover-border-gold transition-all"
                            onClick={() => {
                                setActiveComplaint(item)
                                setShowDetailModal(true)
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <Badge className="bg-light text-muted p-1 px-3 border border-black border-opacity-5 uppercase fw-bold" style={{ fontSize: '9px' }}>
                                        #{item.id.slice(0, 8)}
                                    </Badge>
                                    <span className="text-muted smaller">•</span>
                                    <span className="text-muted smaller fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>{item.category}</span>
                                </div>
                                <h5 className="text-dark fw-bold mb-1 tracking-tight">{item.title}</h5>
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-muted smaller fw-bold" style={{ fontSize: '10px' }}>Resident: {item.student?.full_name} ({item.student?.room_number})</span>
                                    <span className="text-muted smaller">•</span>
                                    <span className="text-muted smaller fw-medium" style={{ fontSize: '10px' }}>Initiated: {new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-end gap-2">
                                <StatusBadge status={item.status} />
                                <div className={`smaller fw-bold uppercase tracking-widest ${item.priority === 'urgent' ? 'text-danger' : 'text-muted'}`} style={{ fontSize: '8px' }}>
                                    {item.priority} priority
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-5 text-center bg-white rounded-4 border border-black border-opacity-5 border-dashed">
                        <p className="text-muted mb-0 smaller fw-bold tracking-widest uppercase opacity-50">No maintenance reports found in this category.</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Modal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                centered
                size="lg"
                className="institution-modal"
            >
                {activeComplaint && (
                    <div className="bg-white rounded-4 overflow-hidden shadow-gold-sm border border-gold border-opacity-10">
                        <div className="p-4 p-md-5 bg-gold bg-opacity-5 border-bottom border-black border-opacity-5">
                            <Badge className="bg-gold-glow text-gold p-1 px-3 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10 shadow-gold-sm">Review Request</Badge>
                            <h4 className="fw-black text-dark tracking-tight mb-2">{activeComplaint.title}</h4>
                            <div className="d-flex align-items-center gap-3 mt-3">
                                <span className="text-muted smaller fw-bold uppercase tracking-widest" style={{ fontSize: '10px' }}>Ref: #{activeComplaint.id.slice(0, 12)}</span>
                                <span className="text-muted smaller">•</span>
                                <span className="text-muted smaller fw-bold uppercase tracking-widest" style={{ fontSize: '10px' }}>Student: {activeComplaint.student?.full_name} ({activeComplaint.student?.room_number})</span>
                            </div>
                        </div>

                        <div className="p-4 p-md-5">
                            <Row className="g-4">
                                <Col md={8}>
                                    <h6 className="smaller text-muted fw-bold uppercase tracking-widest mb-3" style={{ fontSize: '10px' }}>Student's Description</h6>
                                    <p className="text-dark lead fs-6 opacity-80" style={{ lineHeight: '1.7' }}>
                                        {activeComplaint.description}
                                    </p>
                                </Col>
                                <Col md={4} className="border-start border-black border-opacity-5 ps-md-4">
                                    <h6 className="smaller text-muted fw-bold uppercase tracking-widest mb-3" style={{ fontSize: '10px' }}>Update Status</h6>
                                    <div className="d-flex flex-column gap-3">
                                        <button
                                            onClick={() => handleUpdateStatus(activeComplaint.id, 'pending')}
                                            className={`w-100 p-2 rounded-pill smaller fw-bold uppercase tracking-widest transition-all ${activeComplaint.status === 'pending' ? 'bg-gold text-black border-gold shadow-gold-sm' : 'bg-light text-muted border-0'}`}
                                        >
                                            Mark Pending
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(activeComplaint.id, 'in-progress')}
                                            className={`w-100 p-2 rounded-pill smaller fw-bold uppercase tracking-widest transition-all ${activeComplaint.status === 'in-progress' ? 'bg-info text-white shadow-sm' : 'bg-light text-muted border-0'}`}
                                        >
                                            Mark In-Progress
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(activeComplaint.id, 'resolved')}
                                            className={`w-100 p-2 rounded-pill smaller fw-bold uppercase tracking-widest transition-all ${activeComplaint.status === 'resolved' ? 'bg-success text-white shadow-sm' : 'bg-light text-muted border-0'}`}
                                        >
                                            Mark Resolved
                                        </button>
                                    </div>
                                </Col>
                            </Row>

                            <hr className="my-5 opacity-5" />

                            <div className="discussion-section">
                                <h6 className="smaller text-muted fw-bold uppercase tracking-widest mb-4" style={{ fontSize: '10px' }}>Maintenance Discussion</h6>

                                <div className="p-4 bg-light rounded-4 border border-black border-opacity-5 mb-4">
                                    <div className="d-flex flex-column gap-3">
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="avatar-circle flex-shrink-0 bg-gold text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '10px', fontSize: '12px' }}>W</div>
                                            <div className="bg-white p-3 rounded-4 border border-black border-opacity-5 shadow-sm">
                                                <p className="mb-1 smaller fw-bold text-dark">Warden Office</p>
                                                <p className="mb-0 smaller text-muted">We have acknowledged your request. A plumber will be dispatched by 2 PM.</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-start gap-3 flex-row-reverse text-end">
                                            <div className="avatar-circle flex-shrink-0 bg-dark text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '10px', fontSize: '12px' }}>S</div>
                                            <div className="bg-gold-glow p-3 rounded-4 border border-gold border-opacity-20 shadow-sm text-start">
                                                <p className="mb-1 smaller fw-bold text-dark">{activeComplaint.student?.full_name}</p>
                                                <p className="mb-0 smaller text-dark opacity-80">Thank you, sir. I will be available in the room.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Form className="d-flex gap-2">
                                    <Form.Control
                                        placeholder="Type a message to the resident..."
                                        className="bg-light border-0 py-2 px-4 rounded-pill smaller fw-medium"
                                    />
                                    <Button className="btn-gold rounded-pill px-4 fw-bold smaller tracking-widest uppercase">Send</Button>
                                </Form>
                            </div>
                        </div>

                        <div className="p-4 bg-light d-flex justify-content-end">
                            <Button
                                onClick={() => setShowDetailModal(false)}
                                className="btn-gold px-5 py-2 rounded-pill fw-bold shadow-gold-sm"
                            >
                                Save & Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <style>
                {`
                    .institution-modal .modal-content {
                        background: transparent;
                        border: none;
                    }
                    .hover-border-gold:hover {
                        border-color: var(--primary-gold) !important;
                    }
                    .animate-in {
                        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .shadow-gold-sm { box-shadow: 0 4px 20px rgba(212, 175, 55, 0.1); }
                `}
            </style>
        </div>
    )
}
