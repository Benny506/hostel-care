import { Row, Col, Badge, Form, Modal, Button, ListGroup } from 'react-bootstrap'
import {
    HiOutlineUserGroup,
    HiOutlineSearch,
    HiOutlineMail,
    HiOutlineHome,
    HiOutlineIdentification,
    HiOutlineChevronRight
} from 'react-icons/hi'
import { motion, AnimatePresence } from 'motion/react'
import complaintService from '../../services/complaintService'
import { useEffect, useState } from 'react'

const StudentCard = ({ student, onClick }) => (
    <motion.div
        layout
        onClick={() => onClick(student)}
        style={{ cursor: 'pointer' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white p-4 rounded-4 border border-black border-opacity-5 shadow-sm h-100 d-flex flex-column gap-3 hover-border-gold transition-all"
    >
        <div className="d-flex align-items-center gap-3">
            <div className="avatar-circle d-flex align-items-center justify-content-center bg-gold bg-opacity-10 border border-gold border-opacity-20 text-white fw-bold shadow-sm" style={{ width: '48px', height: '48px', borderRadius: '14px', fontSize: '1.2rem' }}>
                {student.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <h5 className="text-dark fw-bold mb-0 tracking-tight text-truncate">{student.full_name}</h5>
                <Badge className="bg-light text-muted p-1 px-2 border border-black border-opacity-5 uppercase fw-bold mt-1" style={{ fontSize: '8px' }}>
                    Resident ID: #{student.id.slice(0, 8)}
                </Badge>
            </div>
        </div>

        <div className="d-flex flex-column gap-2 mt-2">
            <div className="d-flex align-items-center gap-2 text-muted">
                <HiOutlineHome size={16} className="text-gold" />
                <span className="smaller fw-medium">{student.room_number || 'No Room Assigned'}</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-muted">
                <HiOutlineMail size={16} className="text-gold" />
                <span className="smaller fw-medium text-truncate">{student.email}</span>
            </div>
        </div>

        <div className="mt-auto pt-3 border-top border-black border-opacity-5 d-flex justify-content-between align-items-center">
            <span className="smaller text-muted fw-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>Active Resident</span>
            <div className="text-gold cursor-pointer smaller fw-bold uppercase tracking-widest d-flex align-items-center gap-1 hover-underline">
                Profile <HiOutlineChevronRight size={14} />
            </div>
        </div>
    </motion.div>
)

export default function WardenStudents() {
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [studentHistory, setStudentHistory] = useState([])
    const [loadingHistory, setLoadingHistory] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await complaintService.getAllStudents()
                setStudents(data)
                setFilteredStudents(data)
            } catch (err) {
                console.error('Error fetching students:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchStudents()
    }, [])

    useEffect(() => {
        const results = students.filter(s =>
            s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredStudents(results)
    }, [searchTerm, students])

    const handleViewProfile = async (student) => {
        setSelectedStudent(student)
        setShowDetailModal(true)
        setLoadingHistory(true)
        try {
            const history = await complaintService.getStudentComplaints(student.id)
            setStudentHistory(history)
        } catch (err) {
            console.error('Error fetching student history:', err)
        } finally {
            setLoadingHistory(false)
        }
    }

    return (
        <div className="animate-in pb-5">
            <header className="mb-5">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                    <div>
                        <Badge className="bg-gold-glow text-gold p-1 px-3 mb-3 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10 shadow-gold-sm">Student Directory</Badge>
                        <h2 className="text-dark fw-black mb-0 tracking-tight">Resident List</h2>
                        <p className="text-muted mb-0 smaller fw-medium">Overview of all students currently registered in the hostel.</p>
                    </div>

                    <div className="position-relative flex-grow-1 flex-md-grow-0" style={{ minWidth: '300px' }}>
                        <HiOutlineSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                        <Form.Control
                            type="text"
                            placeholder="Search by name, room, or email..."
                            className="ps-5 py-2 rounded-pill bg-white border border-black border-opacity-5 shadow-sm smaller fw-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="p-5 text-center">
                    <div className="spinner-border text-gold" role="status"></div>
                    <p className="mt-3 text-muted smaller fw-bold tracking-widest uppercase">Loading Student Database...</p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <Row className="g-4">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <Col key={student.id} xs={12} md={6} lg={4}>
                                    <StudentCard student={student} onClick={handleViewProfile} />
                                </Col>
                            ))
                        ) : (
                            <Col xs={12}>
                                <div className="p-5 text-center bg-white rounded-4 border border-black border-opacity-5 border-dashed">
                                    <HiOutlineIdentification size={48} className="text-muted opacity-20 mb-3" />
                                    <p className="text-muted mb-0 smaller fw-bold tracking-widest uppercase opacity-50">No students found matching your criteria.</p>
                                </div>
                            </Col>
                        )}
                    </Row>
                </AnimatePresence>
            )}

            {/* Student Detail Modal */}
            <Modal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                centered
                size="lg"
                className="hostel-modal"
            >
                {selectedStudent && (
                    <div className="bg-white rounded-4 overflow-hidden shadow-gold-sm border border-gold border-opacity-10">
                        <div className="p-4 p-md-5 bg-gold bg-opacity-5 border-bottom border-black border-opacity-5">
                            <div className="d-flex align-items-center gap-4">
                                <div className="avatar-circle d-flex align-items-center justify-content-center bg-gold text-white fw-bold shadow-sm" style={{ width: '64px', height: '64px', borderRadius: '18px', fontSize: '1.5rem' }}>
                                    {selectedStudent.full_name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="fw-black text-dark tracking-tight mb-1">{selectedStudent.full_name}</h4>
                                    <p className="text-muted mb-0 smaller fw-medium">{selectedStudent.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 p-md-5">
                            <Row className="g-4">
                                <Col md={4}>
                                    <h6 className="smaller text-muted fw-bold uppercase tracking-widest mb-3" style={{ fontSize: '10px' }}>Resident Details</h6>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="p-3 bg-light rounded-4 border border-black border-opacity-5">
                                            <span className="text-muted smaller fw-bold uppercase tracking-widest d-block mb-1" style={{ fontSize: '8px' }}>Room Assignment</span>
                                            <span className="text-dark fw-bold">{selectedStudent.room_number || 'Unassigned'}</span>
                                        </div>
                                        <div className="p-3 bg-light rounded-4 border border-black border-opacity-5">
                                            <span className="text-muted smaller fw-bold uppercase tracking-widest d-block mb-1" style={{ fontSize: '8px' }}>Member Since</span>
                                            <span className="text-dark fw-bold">{new Date(selectedStudent.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={8} className="border-start border-black border-opacity-5 ps-md-4">
                                    <h6 className="smaller text-muted fw-bold uppercase tracking-widest mb-3" style={{ fontSize: '10px' }}>Maintenance History</h6>

                                    <div className="history-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {loadingHistory ? (
                                            <div className="text-center p-4">
                                                <div className="spinner-border spinner-border-sm text-gold" role="status"></div>
                                            </div>
                                        ) : studentHistory.length > 0 ? (
                                            <div className="d-flex flex-column gap-2">
                                                {studentHistory.map(ticket => (
                                                    <div key={ticket.id} className="p-3 rounded-4 border border-black border-opacity-5 d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <span className="text-dark fw-bold smaller d-block">{ticket.title}</span>
                                                            <span className="text-muted smaller" style={{ fontSize: '10px' }}>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <Badge className={`p-1 px-2 rounded-pill smaller fw-bold uppercase ${ticket.status === 'resolved' ? 'bg-success text-white' : 'bg-gold text-black'}`} style={{ fontSize: '8px' }}>
                                                            {ticket.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center p-4 bg-light rounded-4 border border-black border-opacity-5 border-dashed">
                                                <p className="text-muted mb-0 smaller fw-bold tracking-widest uppercase opacity-50">No requests filed yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className="p-4 bg-light d-flex justify-content-end">
                            <Button
                                onClick={() => setShowDetailModal(false)}
                                className="btn-gold px-5 py-2 rounded-pill fw-bold shadow-gold-sm"
                            >
                                Close Profile
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <style>
                {`
                    .hover-border-gold:hover {
                        border-color: var(--primary-gold) !important;
                        transform: translateY(-2px);
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
