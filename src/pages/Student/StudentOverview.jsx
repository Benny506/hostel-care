import { useEffect, useState } from 'react'
import { Row, Col, Card, Badge } from 'react-bootstrap'
import {
    HiOutlineClipboardList,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamation,
    HiOutlinePlus,
    HiOutlineChevronRight,
    HiOutlineSpeakerphone
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

export default function StudentOverview() {
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 })
    const [recentComplaints, setRecentComplaints] = useState([])
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statData, complaintsData, announceData] = await Promise.all([
                    complaintService.getStudentStats(),
                    complaintService.getMyComplaints(),
                    complaintService.getAnnouncements(3)
                ])
                setStats(statData)
                setRecentComplaints(complaintsData.slice(0, 4))
                setAnnouncements(announceData)
            } catch (err) {
                console.error('Error fetching dashboard data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    return (
        <div className="animate-in pb-5">
            <header className="mb-4 d-flex align-items-center justify-content-between">
                <div>
                    <Badge className="bg-gold-glow text-gold p-1 px-3 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10 shadow-gold-sm">Resident Overview</Badge>
                    <p className="text-muted mb-0 smaller fw-medium">View the current status of your maintenance requests.</p>
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
                            <span style={{ fontSize: '10px' }}>Updating details...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Statistics Section */}
            <Row className="g-3 mb-5">
                <Col lg={3} sm={6}>
                    <StatCard title="Total Tickets" count={stats.total} icon={<HiOutlineClipboardList size={22} />} color="info" />
                </Col>
                <Col lg={3} sm={6}>
                    <StatCard title="Pending Review" count={stats.pending} icon={<HiOutlineClock size={22} />} color="gold" />
                </Col>
                <Col lg={3} sm={6}>
                    <StatCard title="In Progress" count={stats.inProgress} icon={<HiOutlineExclamation size={22} />} color="gold" />
                </Col>
                <Col lg={3} sm={6}>
                    <StatCard title="Resolved Cases" count={stats.resolved} icon={<HiOutlineCheckCircle size={22} />} color="info" />
                </Col>
            </Row>

            <Row className="g-5">
                {/* Recent Complaints */}
                <Col lg={12} className='mb-5'>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h4 className="text-dark m-0 tracking-tight smaller opacity-75">Recent Requests</h4>
                        <Link to="/student-dashboard/my-complaints" className="text-gold text-decoration-none smaller tracking-widest d-flex align-items-center gap-2 hover-underline">
                            View Catalog <HiOutlineChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {recentComplaints.length > 0 ? (
                            recentComplaints.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="bg-white p-3 rounded-4 border border-black border-opacity-5 d-flex align-items-center gap-4 transition-all shadow-sm"
                                >
                                    <div className="flex-grow-1">
                                        <h6 className="text-dark fw-bold mb-1 tracking-tight" style={{ fontSize: '0.95rem' }}>{item.title}</h6>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-muted smaller fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>{item.category}</span>
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

                        <Link to="/student-dashboard/new-complaint" className="bg-white p-4 rounded-4 border border-gold border-opacity-20 d-flex align-items-center justify-content-center gap-3 text-gold text-decoration-none shadow-sm mt-2 hover-bg-light transition-all">
                            <HiOutlinePlus size={22} />
                            <span className="fw-bold tracking-widest smaller">Report a New Problem</span>
                        </Link>
                    </div>
                </Col>

                {/* Announcements Sidebar */}
                <Col lg={12}>
                    <h4 className="text-dark mb-4 tracking-tight smaller opacity-75">Institutional Feed</h4>

                    <div className="d-flex flex-column gap-3">
                        {announcements.map((item) => (
                            <motion.div
                                key={item.id}
                                className="bg-white p-3 rounded-4 border border-black border-opacity-5 shadow-sm"
                            >
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <div className={`p-1 rounded-2 ${item.is_critical ? 'text-danger' : 'text-info'}`}>
                                        <HiOutlineSpeakerphone size={14} />
                                    </div>
                                    <span className={`smaller fw-bold uppercase tracking-widest ${item.is_critical ? 'text-danger' : 'text-info'}`} style={{ fontSize: '9px' }}>
                                        {item.is_critical ? 'Critical' : 'Alert'}
                                    </span>
                                </div>
                                <h6 className="text-dark fw-bold mb-1 tracking-tight" style={{ fontSize: '0.9rem' }}>{item.title}</h6>
                                <p className="text-muted smaller mb-0 opacity-80 leading-normal" style={{ fontSize: '11px' }}>{item.content.substring(0, 80)}...</p>
                            </motion.div>
                        ))}

                        <Link to="/student-dashboard/announcements" className="text-center text-slate text-decoration-none smaller fw-bold tracking-widest hover-gold transition-all pt-2">
                            Access Full Archives
                        </Link>
                    </div>
                </Col>
            </Row>

            <style>
                {`
                    .w-fit { width: fit-content; }
                    .tracking-widest-xl { letter-spacing: 0.25em; }
                    .animate-in {
                        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    )
}
