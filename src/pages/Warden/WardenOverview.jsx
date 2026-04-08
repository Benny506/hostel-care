import { useEffect, useState } from 'react'
import { Row, Col, Badge, Card } from 'react-bootstrap'
import {
    HiOutlineClipboardList,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamation,
    HiOutlineChevronRight,
    HiOutlineSpeakerphone,
    HiOutlineSupport
} from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import complaintService from '../../services/complaintService'

const StatCard = ({ title, count, icon, color }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="bg-white h-100 p-3 border border-black border-opacity-5 rounded-4 d-flex align-items-center gap-3 shadow-sm"
    >
        <div className={`p-2 rounded-3 bg-opacity-10 w-fit ${color === 'gold' ? 'bg-gold text-gold' : 'bg-info text-info'}`}>
            {icon}
        </div>
        <div>
            <p className="text-muted uppercase tracking-widest mb-0" style={{ fontSize: '10px', fontWeight: '800' }}>{title}</p>
            <h3 className="text-dark fw-bold mb-0 mt-1">{count}</h3>
        </div>
    </motion.div>
)

export default function WardenOverview() {
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 })
    const [recentTickets, setRecentTickets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWardenData = async () => {
            try {
                const [statData, ticketsData] = await Promise.all([
                    complaintService.getWardenStats(),
                    complaintService.getAllComplaints()
                ])
                setStats(statData)
                setRecentTickets(ticketsData.slice(0, 5))
            } catch (err) {
                console.error('Error fetching student requests:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchWardenData()
    }, [])

    return (
        <div className="animate-in pb-5">
            <header className="mb-4 d-flex align-items-center justify-content-between">
                <div>
                    <Badge className="bg-gold-glow text-gold p-1 px-3 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10 shadow-gold-sm">Warden Overview</Badge>
                    <p className="text-muted mb-0 smaller fw-medium">Manage hostel maintenance and student reports.</p>
                </div>
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="d-flex align-items-center gap-2 text-gold smaller fw-bold uppercase tracking-widest"
                        >
                            <div className="spinner-border spinner-border-sm" role="status" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></div>
                            <span style={{ fontSize: '10px' }}>Refreshing...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Global Statistics */}
            <Row className="g-3 mb-5">
                <Col lg={3} sm={6}>
                    <StatCard title="Total Tickets" count={stats.total} icon={<HiOutlineClipboardList size={22} />} color="info" />
                </Col>
                <Col lg={3} sm={6}>
                    <StatCard title="Immediate Attention" count={stats.pending} icon={<HiOutlineClock size={22} />} color="secondary" />
                </Col>
                <Col lg={3} sm={6}>
                    <StatCard title="In Progress" count={stats.inProgress} icon={<HiOutlineExclamation size={22} />} color="secondary" />
                </Col>
                <Col lg={3} sm={6}>
                    <StatCard title="Resolved Cases" count={stats.resolved} icon={<HiOutlineCheckCircle size={22} />} color="info" />
                </Col>
            </Row>

            <Row className="g-5">
                {/* Priority Audit Deck */}
                <Col lg={12}>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center gap-2">
                            <HiOutlineSupport className="text-gold" size={20} />
                            <h4 className="text-dark m-0 tracking-tight smaller opacity-75">Action Needed</h4>
                        </div>
                        <Link to="/warden-dashboard/tickets" className="text-gold text-decoration-none smaller tracking-widest d-flex align-items-center gap-2 hover-underline">
                            Support Tickets <HiOutlineChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {recentTickets.length > 0 ? (
                            recentTickets.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="bg-white p-3 rounded-4 border border-black border-opacity-5 d-flex align-items-center gap-4 shadow-sm"
                                >
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <h6 className="text-dark fw-bold mb-0 tracking-tight" style={{ fontSize: '0.95rem' }}>{item.title}</h6>
                                            <Badge className="bg-light text-muted p-1 px-2 border border-black border-opacity-5 uppercase fw-bold" style={{ fontSize: '8px' }}>
                                                {item.student?.room_number || 'N/A'}
                                            </Badge>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-muted smaller fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>{item.student?.full_name || 'Anonymous Student'}</span>
                                            <span className="text-muted smaller">•</span>
                                            <span className="text-muted smaller fw-medium" style={{ fontSize: '9px' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <Badge className={`p-1 px-3 rounded-pill smaller fw-bold uppercase tracking-widest ${item.status === 'resolved' ? 'bg-success text-white' : 'bg-gold text-black'}`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-5 text-center bg-white bg-opacity-5 border border-white border-opacity-5 rounded-4 border-dashed">
                                <p className="text-slate mb-0 smaller fw-bold tracking-widest opacity-50">No pending maintenance tickets found.</p>
                            </div>
                        )}
                    </div>
                </Col>

                {/* Quick Broadcast Section */}
                <Col lg={12}>
                    <Card className="bg-white border-gold border-opacity-20 rounded-4 shadow-sm overflow-hidden p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="p-2 rounded-3 bg-gold bg-opacity-10 text-white">
                                <HiOutlineSpeakerphone size={24} />
                            </div>
                            <div>
                                <h5 className="mb-0 text-white fw-bold tracking-tight">Hostel Announcements</h5>
                                <p className="mb-0 text-white smaller">Direct communication with all residents.</p>
                            </div>
                        </div>
                        <Link to="/warden-dashboard/announcements" className="btn btn-gold w-100 rounded-pill py-2 fw-bold tracking-widest smaller uppercase shadow-gold-sm">
                            Post a New Announcement
                        </Link>
                    </Card>
                </Col>
            </Row>

            <style>
                {`
                    .w-fit { width: fit-content; }
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
