import React from 'react'
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import {
    HiOutlineUser,
    HiOutlineMail,
    HiOutlineShieldCheck,
    HiOutlineIdentification,
    HiOutlineLightBulb,
    HiOutlineLockClosed,
    HiOutlineInformationCircle
} from 'react-icons/hi'

const Profile = () => {
    const { user, role } = useSelector(state => state.auth)

    const tips = {
        student: [
            { title: 'Rapid Reporting', text: 'Found a leak? Report issues immediately to prevent structural degradation.' },
            { title: 'Broadcasting Hub', text: 'Check the Updates feed daily for maintenance windows and hostel policies.' },
            { title: 'Identity Sync', text: 'Keep your Resident ID handy for quick verification by the Warden staff.' },
            { title: 'Status Tracking', text: 'Monitor your "My Requests" tab to see real-time progress on your tickets.' }
        ],
        warden: [
            { title: 'Live Command', text: 'Monitor active tickets hourly to ensure resident satisfaction and safety.' },
            { title: 'Policy Broadcast', text: 'Use the Announcements Hub to keep all students informed of critical changes.' },
            { title: 'Resident Audit', text: 'Regularly review the Resident Directory to maintain accurate facility records.' },
            { title: 'Ticket Triage', text: 'Prioritize emergency tickets (Plumbing/Electrical) for maximum efficiency.' }
        ]
    }

    const currentTips = tips[role] || []

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-5"
        >
            <div className="mb-5">
                <h2 className="fw-black text-dark tracking-tight mb-2">Identity Hub</h2>
                <p className="text-muted lead mb-0">Synchronized residency telemetry and operational insights.</p>
            </div>

            <Row className="gy-4">
                {/* Identity Card */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div className="bg-gold-glow p-5 text-center position-relative">
                            <div className="avatar-huge mx-auto mb-4 bg-white shadow-lg d-flex align-items-center justify-content-center text-gold fs-1 fw-bold">
                                {user?.full_name?.substring(0, 2).toUpperCase() || '??'}
                            </div>
                            <h4 className="fw-black mb-1">{user?.full_name || 'Hostel User'}</h4>
                            <Badge className="bg-dark text-white p-2 px-3 rounded-pill uppercase tracking-widest smaller">
                                {role === 'student' ? 'Resident Student' : 'Hostel Warden'}
                            </Badge>
                            <div className="position-absolute top-0 end-0 p-3">
                                <HiOutlineLockClosed size={24} className="text-dark opacity-20" />
                            </div>
                        </div>
                        <Card.Body className="p-4 bg-white">
                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light rounded-3 text-gold">
                                        <HiOutlineMail size={20} />
                                    </div>
                                    <div>
                                        <small className="text-muted d-block uppercase tracking-widest" style={{ fontSize: '10px' }}>Synchronized Email</small>
                                        <span className="fw-bold text-dark">{user?.email || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light rounded-3 text-gold">
                                        <HiOutlineIdentification size={20} />
                                    </div>
                                    <div>
                                        <small className="text-muted d-block uppercase tracking-widest" style={{ fontSize: '10px' }}>Institutional ID</small>
                                        <span className="fw-bold text-dark">{user?.institutional_id || 'UHC-2026-####'}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light rounded-3 text-gold">
                                        <HiOutlineShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <small className="text-muted d-block uppercase tracking-widest" style={{ fontSize: '10px' }}>Access Level</small>
                                        <span className="fw-bold text-dark uppercase">{role}</span>
                                    </div>
                                </div>
                            </div>

                            <Alert variant="warning" className="mt-5 border-0 bg-gold bg-opacity-10 d-flex gap-3 align-items-center rounded-4">
                                <HiOutlineLockClosed size={24} className="text-gold flex-shrink-0" />
                                <div className="smaller text-dark">
                                    <strong className="d-block mb-1">READ-ONLY PROFILE</strong>
                                    This data is synchronized from the central hostel database. Edits must be authorized via the Administration block.
                                </div>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Performance HUD & Tips */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
                        <div className="d-flex align-items-center gap-3 mb-5 p-3 bg-light rounded-4">
                            <div className="bg-gold p-2 rounded-3 text-white">
                                <HiOutlineLightBulb size={24} />
                            </div>
                            <div>
                                <h5 className="mb-0 fw-black tracking-tight text-black">Synchronized Strategy</h5>
                                <p className="mb-0 smaller text-muted">Operational insights for active {role}s.</p>
                            </div>
                        </div>

                        <Row className="gy-4">
                            {currentTips.map((tip, index) => (
                                <Col md={6} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="p-4 border border-light rounded-5 h-100 transition-all hover-shadow"
                                        style={{ background: 'rgba(212, 175, 55, 0.02)' }}
                                    >
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <Badge className="bg-gold-glow text-gold p-1 border-0">TIP #{index + 1}</Badge>
                                            <h6 className="mb-0 fw-bold uppercase tracking-widest smaller">{tip.title}</h6>
                                        </div>
                                        <p className="text-muted smaller mb-0 leading-relaxed text-white">
                                            {tip.text}
                                        </p>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>

            <style>
                {`
                    .avatar-huge {
                        width: 80px;
                        height: 80px;
                        border-radius: 24px;
                        letter-spacing: -1px;
                    }
                    .shadow-gold-heavy {
                        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
                    }
                    .bg-gold-glow {
                        background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
                    }
                    .hover-shadow:hover {
                        box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                        border-color: rgba(212, 175, 55, 0.2) !important;
                    }
                    .shadow-gold-sm {
                        box-shadow: 0 5px 15px rgba(212, 175, 55, 0.1);
                    }
                `}
            </style>
        </motion.div>
    )
}

export default Profile
