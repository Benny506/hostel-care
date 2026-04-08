import { useEffect, useState } from 'react'
import { Badge, Row, Col } from 'react-bootstrap'
import { 
    HiOutlineSpeakerphone, 
    HiOutlineCalendar, 
    HiOutlineUserCircle,
    HiOutlineShieldCheck,
    HiOutlineArrowNarrowRight
} from 'react-icons/hi'
import { motion } from 'motion/react'
import complaintService from '../../services/complaintService'

export default function AnnouncementFeed() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await complaintService.getAnnouncements(20)
                setAnnouncements(data)
            } catch (err) {
                console.error('Error fetching announcements:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchAnnouncements()
    }, [])

    return (
        <div className="animate-in pb-5 max-w-lg mx-auto">
            <header className="mb-5 text-center position-relative">
                <Badge className="bg-gold-glow text-gold p-1 px-4 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-20 shadow-sm">Notice Board</Badge>
                
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="position-absolute top-100 start-50 translate-middle-x mt-2"
                    >
                        <div className="d-flex align-items-center gap-2 px-3 py-1 bg-white bg-opacity-5 rounded-pill border border-gold border-opacity-10 shadow-sm">
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="bg-gold rounded-circle" 
                                style={{ width: '6px', height: '6px' }}
                            />
                            <span className="smaller text-gold fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>Refreshing Notice Board...</span>
                        </div>
                    </motion.div>
                )}

                <h3 className="fw-black text-dark tracking-tight mb-2 mt-2">Announcements</h3>
                <p className="text-muted smaller fw-medium opacity-75">Stay updated with the latest news and alerts from the hostel staff.</p>
            </header>

            <div className="d-flex flex-column gap-5">
                {announcements.length > 0 ? (
                    announcements.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-4 rounded-4 border border-black border-opacity-5 position-relative overflow-hidden shadow-sm"
                        >
                            {item.is_critical && (
                                <div className="position-absolute top-0 end-0 p-2">
                                    <Badge className="bg-danger text-white rounded-pill p-1 px-2 smaller fw-bold uppercase tracking-widest d-flex align-items-center gap-1" style={{ fontSize: '9px' }}>
                                        <HiOutlineShieldCheck size={12} /> Critical
                                    </Badge>
                                </div>
                            )}

                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className={`p-2 rounded-3 ${item.is_critical ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10' : 'bg-info bg-opacity-10 text-info border border-info border-opacity-10'}`}>
                                    <HiOutlineSpeakerphone size={24} />
                                </div>
                                <div>
                                    <h5 className="text-dark fw-bold mb-1 tracking-tight" style={{ fontSize: '1rem' }}>{item.title}</h5>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center gap-1 smaller text-muted fw-medium" style={{ fontSize: '10px' }}>
                                            <HiOutlineCalendar size={14} className="text-gold" />
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1 smaller text-muted fw-medium" style={{ fontSize: '10px' }}>
                                            <HiOutlineUserCircle size={14} className="text-gold" />
                                            <span>Hostel Warden</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-light p-3 rounded-3 border border-black border-opacity-5 mb-0">
                                <p className="text-muted smaller leading-relaxed mb-0 opacity-90 lh-base" style={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}>
                                    {item.content}
                                </p>
                            </div>

                            <div className="mt-3 pt-3 border-top border-black border-opacity-5 d-flex justify-content-between align-items-center">
                                <span className="text-gold smaller fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>Post #{item.id.slice(0, 5)}</span>
                                    Read More <HiOutlineArrowNarrowRight size={12} />
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-5 text-center bg-white bg-opacity-5 border border-white border-opacity-5 rounded-4 border-dashed">
                         <HiOutlineSpeakerphone size={48} className="text-slate opacity-25 mb-3" />
                         <p className="text-slate mb-0 smaller fw-bold uppercase tracking-widest opacity-50">No announcements found at this time.</p>
                    </div>
                )}
            </div>

            <style>
                {`
                    .max-w-lg { max-width: 900px; }
                    .lh-base { line-height: 1.65 !important; }
                    .tracking-widest-xl { letter-spacing: 0.25em; }
                `}
            </style>
        </div>
    )
}
