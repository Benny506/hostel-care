import { useEffect, useState } from 'react'
import { Modal, Button, Badge, Form, Card } from 'react-bootstrap'
import {
    HiOutlineSpeakerphone,
    HiOutlinePlus,
    HiOutlineExclamationCircle,
    HiOutlineClock,
    HiOutlineTrash
} from 'react-icons/hi'
import { motion } from 'motion/react'
import complaintService from '../../services/complaintService'
import { useDispatch } from 'react-redux'
import { addAlert, setGlobalLoading } from '../../redux/uiSlice'

export default function WardenAnnouncements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [showPostModal, setShowPostModal] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        is_critical: false
    })
    const dispatch = useDispatch()

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const data = await complaintService.getAnnouncements(20)
            setAnnouncements(data)
        } catch (err) {
            console.error('Error verifying email:', err)
            throw new Error('Verification failed: Database unreachable.')
        } finally {
            setLoading(false)
        }
    }

    const handlePostAnnouncement = async (e) => {
        e.preventDefault()
        try {
            dispatch(setGlobalLoading({ loading: true, title: 'Posting Notice...', message: 'Sending update to all residents...' }))
            await complaintService.createAnnouncement(formData)
            dispatch(addAlert({ type: 'success', message: 'Announcement posted successfully.' }))
            fetchHistory()
            setShowPostModal(false)
            setFormData({ title: '', content: '', is_critical: false })
        } catch (err) {
            dispatch(addAlert({ type: 'error', message: err.message }))
        } finally {
            dispatch(setGlobalLoading({ loading: false }))
        }
    }

    return (
        <div className="animate-in pb-5">
            <header className="mb-5">
                <Badge className="bg-gold-glow text-black p-1 px-3 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10 shadow-gold-sm">Notice Board</Badge>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-dark fw-black mb-0 tracking-tight">Announcements</h2>
                        <p className="text-muted mb-0 smaller fw-medium">Direct management of hostel updates and news.</p>
                    </div>
                    <Button
                        onClick={() => setShowPostModal(true)}
                        className="btn btn-gold px-4 py-2 rounded-pill fw-bold smaller tracking-widest d-flex align-items-center gap-2 shadow-gold-sm"
                    >
                        <HiOutlinePlus size={18} />
                        Post Announcement
                    </Button>
                </div>
            </header>

            {/* Previous Broadcasts */}
            <div className="d-flex flex-column gap-3">
                {loading ? (
                    <div className="p-5 text-center bg-white rounded-4 border border-black border-opacity-5">
                        <div className="spinner-border text-gold" role="status"></div>
                        <p className="mt-3 text-muted smaller fw-bold tracking-widest uppercase mb-0">Loading Announcements...</p>
                    </div>
                ) : announcements.length > 0 ? (
                    announcements.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 rounded-4 border border-black border-opacity-5 shadow-sm"
                        >
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div className={`p-1 px-2 rounded-3 smaller fw-bold uppercase tracking-widest d-flex align-items-center gap-2 ${item.is_critical ? 'bg-danger text-white' : 'bg-gold bg-opacity-10 text-gold'}`} style={{ fontSize: '9px' }}>
                                        {item.is_critical ? <HiOutlineExclamationCircle size={14} /> : <HiOutlineSpeakerphone size={14} />}
                                        {item.is_critical ? 'Important Notice' : 'Notice'}
                                    </div>
                                    <span className="text-muted smaller fw-medium" style={{ fontSize: '9px' }}>{new Date(item.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                            <h5 className="text-dark fw-bold mb-2 tracking-tight">{item.title}</h5>
                            <p className="text-muted lead fs-6 opacity-80" style={{ lineHeight: '1.6' }}>{item.content}</p>

                            <div className="mt-3 pt-3 border-top border-black border-opacity-5 d-flex align-items-center gap-3">
                                <span className="text-muted smaller fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>Posted By: {item.warden?.full_name || 'Hostel Administrator'}</span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-5 text-center bg-white rounded-4 border border-black border-opacity-5 border-dashed">
                        <p className="text-slate mb-0 smaller fw-bold tracking-widest opacity-50">No previous announcements found.</p>
                    </div>
                )}
            </div>

            {/* Notice Creation Modal */}
            <Modal
                show={showPostModal}
                onHide={() => setShowPostModal(false)}
                centered
                size="lg"
                className="institution-modal"
            >
                <div className="bg-white rounded-4 overflow-hidden border border-gold border-opacity-10 shadow-gold-sm">
                    <div className="p-4 p-md-5 bg-gold bg-opacity-5 border-bottom border-black border-opacity-5">
                        <Badge className="bg-gold-glow text-white p-1 px-3 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10 shadow-gold-sm">Post Announcement</Badge>
                        <h4 className="fw-black text-dark tracking-tight mb-2">Create New Notice</h4>
                        <p className="text-muted mb-0 smaller fw-medium">Every resident will see this update immediately.</p>
                    </div>

                    <Form onSubmit={handlePostAnnouncement} className="p-4 p-md-5">
                        <Form.Group className="mb-4">
                            <Form.Label className="smaller text-muted fw-bold uppercase tracking-widest mb-2" style={{ fontSize: '10px' }}>Notice Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Scheduled Maintenance: Block A Water Facility"
                                required
                                className="bg-light border-0 py-3 px-4 rounded-4 smaller fw-medium"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="smaller text-muted fw-bold uppercase tracking-widest mb-2" style={{ fontSize: '10px' }}>Notice Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Summarize the update for the hostel community..."
                                required
                                className="bg-light border-0 py-3 px-4 rounded-4 smaller fw-medium"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4 d-flex align-items-center gap-3">
                            <div className="form-check form-switch p-0 d-flex align-items-center gap-3">
                                <label className="smaller text-muted fw-bold uppercase tracking-widest mt-1" style={{ fontSize: '10px' }}>Mark as Important</label>
                                <Form.Check
                                    type="switch"
                                    id="is-critical"
                                    checked={formData.is_critical}
                                    onChange={(e) => setFormData({ ...formData, is_critical: e.target.checked })}
                                    className="custom-switch"
                                />
                            </div>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-3 pt-3">
                            <Button
                                variant="link"
                                onClick={() => setShowPostModal(false)}
                                className="text-muted text-decoration-none smaller fw-bold tracking-widest uppercase"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="btn-gold px-5 py-2 rounded-pill fw-bold shadow-gold-sm smaller tracking-widest uppercase"
                            >
                                Post Now
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>

            <style>
                {`
                    .custom-switch .form-check-input {
                        background-color: rgba(0,0,0,0.05);
                        border-color: rgba(0,0,0,0.1);
                        cursor: pointer;
                    }
                    .custom-switch .form-check-input:checked {
                        background-color: var(--primary-gold);
                        border-color: var(--primary-gold);
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
