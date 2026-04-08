import { useEffect, useState } from 'react'
import { Table, Badge, Form, InputGroup, Row, Col, Button, Modal } from 'react-bootstrap'
import {
    HiSearch,
    HiFilter,
    HiOutlinePlus,
    HiOutlineClipboardList,
    HiOutlineChatAlt2,
    HiOutlineChevronRight,
    HiOutlineRefresh
} from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import complaintService from '../../services/complaintService'

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [activeComplaint, setActiveComplaint] = useState(null)

    const fetchComplaints = async () => {
        setLoading(true)
        try {
            const data = await complaintService.getMyComplaints()
            setComplaints(data)
        } catch (err) {
            console.error('Error fetching complaints:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComplaints()
    }, [])

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.category.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus.toLowerCase()
        return matchesSearch && matchesStatus
    })

    const getStatusVariant = (status) => {
        switch (status) {
            case 'resolved': return 'success'
            case 'pending': return 'gold'
            case 'in-progress': return 'gold'
            case 'declined': return 'danger'
            default: return 'slate'
        }
    }

    return (
        <div className="animate-in pb-5">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-5">
                <div className="d-flex align-items-center justify-content-between w-100 mb-2">
                    <p className="text-muted mb-0 smaller fw-medium">View and track the status of all your maintenance requests.</p>
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="d-flex align-items-center gap-2 text-gold smaller fw-bold uppercase tracking-widest"
                            >
                                <div className="spinner-border spinner-border-sm" role="status" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></div>
                                <span style={{ fontSize: '10px' }}>Updating list...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="link"
                        onClick={fetchComplaints}
                        className="p-2 bg-black bg-opacity-5 rounded-3 text-gold border border-black border-opacity-10 transition-all text-decoration-none"
                    >
                        <HiOutlineRefresh size={20} className={loading ? 'animate-spin' : ''} />
                    </Button>
                    <Link to="/student-dashboard/new-complaint" className="btn-gold d-flex align-items-center gap-2 px-3 py-2 rounded-pill text-decoration-none shadow-gold" style={{ fontSize: '13px' }}>
                        <HiOutlinePlus size={18} />
                        New Request
                    </Link>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-3 rounded-4 border border-black border-opacity-5 mb-5 shadow-sm">
                <div className="flex-grow-1 mb-3">
                    <InputGroup className="bg-light border border-black border-opacity-5 rounded-pill px-3">
                        <InputGroup.Text className="bg-transparent border-0 text-muted">
                            <HiSearch size={20} />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Search your requests..."
                            className="bg-transparent border-0 text-dark py-3 ps-2 smaller"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    {['All', 'Pending', 'In-Progress', 'Resolved'].map(status => (
                        <Button
                            key={status}
                            variant="link"
                            onClick={() => setFilterStatus(status)}
                            style={{
                                fontSize: '14px'
                            }}
                            className={`px-4 py-1 rounded-pill text-decoration-none smaller fw-black tracking-widest transition-all ${filterStatus === status ? 'bg-gold-glow text-gold border border-gold border-opacity-20' : 'text-slate hover-gold shadow-sm'}`}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Table Catalog */}
            <div className="bg-white rounded-4 border border-black border-opacity-5 overflow-hidden shadow-sm">
                <Table responsive borderless className="mb-0 text-dark institutional-table">
                    <thead className="bg-light border-bottom border-black border-opacity-5">
                        <tr>
                            <th className="px-4 py-3 smaller text-muted fw-bold uppercase tracking-widest" style={{ fontSize: '10px' }}>Request ID</th>
                            <th className="px-4 py-3 smaller text-muted fw-bold uppercase tracking-widest" style={{ fontSize: '10px' }}>Description</th>
                            <th className="px-4 py-3 smaller text-muted fw-bold uppercase tracking-widest" style={{ fontSize: '10px' }}>Status</th>
                            <th className="px-4 py-3 smaller text-muted fw-bold uppercase tracking-widest text-end" style={{ fontSize: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map(item => (
                                <tr key={item.id} className="border-bottom border-white border-opacity-5 hover-bg-light transition-all align-middle">
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="p-2 bg-white bg-opacity-5 rounded-2 text-muted">
                                                <HiOutlineClipboardList size={18} />
                                            </div>
                                            <div className="fw-bold text-muted uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>#{item.id.slice(0, 8)}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <h6 className="mb-0 text-dark fw-bold tracking-tight" style={{ fontSize: '0.9rem' }}>{item.title}</h6>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className="text-muted smaller fw-bold uppercase" style={{ fontSize: '9px' }}>{item.category}</span>
                                            <span className="text-muted smaller opacity-25">•</span>
                                            <span className="text-muted smaller" style={{ fontSize: '9px' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="d-flex flex-column align-items-start">
                                            <Badge className={`p-1 px-3 rounded-pill smaller fw-bold uppercase tracking-widest ${item.status === 'resolved' ? 'bg-success text-white' : item.status === 'declined' ? 'bg-danger text-white' : 'bg-gold text-dark'}`} style={{ fontSize: '9px' }}>
                                                {item.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setActiveComplaint(item)
                                                    setShowDetailModal(true)
                                                }}
                                                className="p-2 bg-light rounded-3 text-dark hover-gold transition-all text-decoration-none shadow-sm border border-black border-opacity-5"
                                            >
                                                <HiOutlineChevronRight size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-5 text-center">
                                    <p className="text-slate mb-0 smaller fw-bold uppercase tracking-widest opacity-50">No requests found matching your current filter.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Institutional Detail Modal */}
            <Modal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                centered
                size="lg"
                contentClassName="bg-white border-0 rounded-4 shadow-lg overflow-hidden"
            >
                <Modal.Body className="p-0">
                    {activeComplaint && (
                        <div>
                            {/* Modal Header (Institutional) */}
                            <div className="p-4 p-md-5 bg-gold bg-opacity-5 border-bottom border-black border-opacity-5">
                                <Badge className="bg-gold-glow text-gold p-1 px-3 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10 shadow-gold-sm">My Requests</Badge>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                                    <h2 className="text-dark fw-black mb-0 tracking-tight">Maintenance History</h2>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="text-muted smaller fw-bold uppercase tracking-widest" style={{ fontSize: '10px' }}>ID: #{activeComplaint.id.slice(0, 12)}</span>
                                        <span className="text-muted opacity-25">|</span>
                                        <span className="text-muted smaller fw-medium">{new Date(activeComplaint.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-4 p-md-5">
                                <Row className="g-4 mb-5">
                                    <Col md={4}>
                                        <div className="bg-light p-3 rounded-4 border border-black border-opacity-5 h-100">
                                            <p className="text-muted uppercase tracking-widest mb-1" style={{ fontSize: '9px', fontWeight: '800' }}>Sector</p>
                                            <h6 className="text-dark fw-bold mb-0">{activeComplaint.category}</h6>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="bg-light p-3 rounded-4 border border-black border-opacity-5 h-100">
                                            <p className="text-muted uppercase tracking-widest mb-1" style={{ fontSize: '9px', fontWeight: '800' }}>Current Status</p>
                                            <Badge className={`p-1 px-3 rounded-pill smaller fw-bold uppercase tracking-widest ${activeComplaint.status === 'resolved' ? 'bg-success text-white' : activeComplaint.status === 'declined' ? 'bg-danger text-white' : 'bg-gold text-dark'}`} style={{ fontSize: '9px' }}>
                                                {activeComplaint.status}
                                            </Badge>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="bg-light p-3 rounded-4 border border-black border-opacity-5 h-100">
                                            <p className="text-muted uppercase tracking-widest mb-1" style={{ fontSize: '9px', fontWeight: '800' }}>Priority Level</p>
                                            <h6 className="text-dark fw-bold mb-0">{activeComplaint.priority || 'Standard'}</h6>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="mb-5">
                                    <h5 className="text-dark fw-bold mb-3 tracking-tight text-uppercase smaller opacity-75">Your Description</h5>
                                    <div className="bg-light p-4 rounded-4 border border-black border-opacity-5">
                                        <p className="text-dark opacity-90 lh-base mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                            {activeComplaint.description}
                                        </p>
                                    </div>
                                </div>

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
                                                    <p className="mb-1 smaller fw-bold text-dark">You</p>
                                                    <p className="mb-0 smaller text-dark opacity-80">Thank you, sir. I will be available in the room.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Form className="d-flex gap-2">
                                        <Form.Control 
                                            placeholder="Type a message to the warden..."
                                            className="bg-light border-0 py-2 px-4 rounded-pill smaller fw-medium"
                                        />
                                        <Button className="btn-gold rounded-pill px-4 fw-bold smaller tracking-widest uppercase">Send</Button>
                                    </Form>
                                </div>

                                <div className="d-flex justify-content-end pt-4">
                                    <Button
                                        onClick={() => setShowDetailModal(false)}
                                        className="btn-gold px-5 py-2 rounded-pill fw-bold shadow-gold"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <style>
                {`
                    .institutional-table th { border: none !important; }
                    .institutional-table td { border: none !important; }
                    .hover-bg-light:hover { background: rgba(0, 0, 0, 0.02); }
                    .shadow-gold-sm { box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15); }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    )
}
