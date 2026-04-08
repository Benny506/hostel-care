import { useState } from 'react'
import { Container, Row, Col, Card, Button, Badge, Nav, Offcanvas } from 'react-bootstrap'
import {
    HiOutlineShieldCheck,
    HiOutlineBell,
    HiOutlineDocumentReport,
    HiOutlineUserGroup,
    HiOutlineSupport,
    HiOutlineArrowRight,
    HiOutlineLightningBolt,
    HiOutlineChatAlt2,
    HiOutlineKey,
    HiOutlineGlobe,
    HiOutlineEye,
    HiOutlineDatabase,
    HiOutlineStatusOnline,
    HiOutlineAcademicCap,
    HiMenuAlt3
} from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const LandingPage = () => {
    const { isAuthenticated, role } = useSelector(state => state.auth)
    const dashboardLink = role === 'warden' ? '/warden-dashboard' : '/student-dashboard'

    const [showMenu, setShowMenu] = useState(false)

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        setShowMenu(false)
    };

    return (
        <div className="landing-page bg-black min-vh-100 overflow-hidden">
            {/* Minimalist Navbar */}
            <Nav className="justify-content-between align-items-center p-4 container position-fixed top-0 start-50 translate-middle-x bg-black bg-opacity-80 backdrop-blur" style={{ zIndex: 1000, width: '100%' }}>
                <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="p-1 bg-gold-glow rounded-3 border border-gold border-opacity-10 shadow-sm overflow-hidden">
                        <img src="/logo.svg" alt="Hostel Care Logo" width="32" height="32" />
                    </div>
                    <span className="fs-5 fw-bold text-white tracking-widest-xl fw-black uppercase smaller d-none d-sm-block">Hostel Care</span>
                </div>
                <div className="d-flex gap-2 gap-md-4 align-items-center">
                    <Nav.Link onClick={() => scrollToSection('about')} className="text-slate smaller fw-bold text-uppercase d-none d-md-block hover-gold">About</Nav.Link>
                    <Nav.Link onClick={() => scrollToSection('features')} className="text-slate smaller fw-bold text-uppercase d-none d-md-block hover-gold">Features</Nav.Link>
                    <Link to={isAuthenticated ? dashboardLink : "/login"} className="text-decoration-none d-none d-md-block">
                        <Button className="btn-gold px-4 py-2 rounded-pill smaller shadow-sm fw-bold">
                            {isAuthenticated ? 'My Dashboard' : 'Staff Login'}
                        </Button>
                    </Link>
                    <Button
                        variant="link"
                        className="text-gold d-md-none p-0"
                        onClick={() => setShowMenu(true)}
                    >
                        <HiMenuAlt3 size={30} />
                    </Button>
                </div>
            </Nav>

            {/* Mobile Nav Offcanvas */}
            <Offcanvas
                show={showMenu}
                onHide={() => setShowMenu(false)}
                placement="end"
                className="bg-black text-white border-start border-gold border-opacity-10"
            >
                <Offcanvas.Header closeButton closeVariant="white" className="p-4 border-bottom border-white border-opacity-5">
                    <Offcanvas.Title className="text-gold tracking-widest fw-black uppercase smaller">Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-4 d-flex flex-column gap-4">
                    <Nav.Link onClick={() => scrollToSection('about')} className="fs-4 fw-black text-white hover-gold">How it Works</Nav.Link>
                    <Nav.Link onClick={() => scrollToSection('features')} className="fs-4 fw-black text-white hover-gold">Features</Nav.Link>
                    <hr className="border-white border-opacity-10 my-2" />
                    <Link to={isAuthenticated ? dashboardLink : "/login"} className="text-decoration-none">
                        <Button className="btn-gold w-100 py-3 rounded-pill fw-extrabold fs-5">
                            {isAuthenticated ? 'Enter Dashboard' : 'Login to Dashboard'}
                        </Button>
                    </Link>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Hero Section */}
            <Container className="pt-5 pb-5 mt-5 mt-lg-0 min-vh-100 d-flex align-items-center">
                <Row className="align-items-center g-5 w-100">
                    <Col lg={7}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className="bg-gold-glow text-gold px-3 py-2 rounded-pill mb-4 border border-gold border-opacity-20 animate-pulse tracking-widest fw-bold smaller uppercase">
                                Hostel Management Simplified
                            </Badge>
                            <h1 className="display-2 fw-black text-white mb-4 lh-sm">
                                Elevate Your Hostel. <br />
                                <span className="text-gradient-gold">Perfect Your Service.</span>
                            </h1>
                            <p className="fs-5 text-slate mb-5 leading-relaxed pe-lg-5">
                                Hostel Care is a friendly management platform designed to bridge the gap between residents and maintenance teams. Report, track, and manage hostel operations with ease.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link to={isAuthenticated ? dashboardLink : "/login"}>
                                    <Button className="btn-gold d-flex align-items-center gap-2 px-5 py-3 fs-5 fw-bold shadow-gold">
                                        {isAuthenticated ? 'My Dashboard' : 'Enter Dashboard'}
                                        <HiOutlineArrowRight />
                                    </Button>
                                </Link>
                                <Button onClick={() => scrollToSection('about')} className="btn-outline-gold d-flex align-items-center gap-2 px-4 py-3 fs-6">
                                    Learn More
                                </Button>
                            </div>
                        </motion.div>
                    </Col>

                    <Col lg={5} className="d-none d-lg-block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="position-relative"
                        >
                            <div className="glass-card p-4 border-gold border-opacity-10 shadow-gold" style={{ borderRadius: '40px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0 fw-bold tracking-widest smaller uppercase text-gold">Live Status</h5>
                                    <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-2 py-1 smaller">Active</Badge>
                                </div>
                                <div className="d-flex flex-column gap-3">
                                    {[
                                        { l: 'Open Requests', v: '12', c: 'text-gold' },
                                        { l: 'Avg Response Time', v: '45m', c: 'text-white' },
                                        { l: 'Active Support', v: '100%', c: 'text-gold' }
                                    ].map((s, i) => (
                                        <div key={i} className="p-3 bg-white bg-opacity-5 rounded-4 d-flex justify-content-between align-items-center border border-white border-opacity-5">
                                            <span className="smaller text-slate fw-bold uppercase px-2">{s.l}</span>
                                            <span className={`fw-extrabold fs-5 ${s.c}`}>{s.v}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-top border-white border-opacity-5 d-flex align-items-center justify-content-center gap-2">
                                    <HiOutlineKey className="text-gold" />
                                    <small className="text-slate italic smaller">Authorized Access Only</small>
                                </div>
                            </div>
                            <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-gold opacity-10 blur-3xl rounded-circle" style={{ zIndex: -1 }}></div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>

            {/* About Section: Mission & Vision */}
            <div id="about" className="py-5 mt-5">
                <Container className="py-5">
                    <Row className="mb-5 justify-content-center">
                        <Col lg={8} className="text-center">
                            <Badge className="bg-gold-glow text-gold px-3 py-2 rounded-pill mb-4 border border-gold border-opacity-20 uppercase smaller tracking-widest fw-bold">Our Core</Badge>
                            <h2 className="display-4 fw-black text-white mb-4">The Care Philosophy</h2>
                            <p className="text-slate fs-5 leading-relaxed">
                                Hostel Care isn't just a management tool; it's a commitment to resident well-being and operational transparency. We believe every report is an opportunity to improve the hostel community.
                            </p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col lg={6}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="glass-card p-5 h-100 border-gold border-opacity-10 position-relative overflow-hidden"
                                style={{ borderRadius: '32px' }}
                            >
                                <div className="mb-4 d-inline-block p-3 bg-gold-glow rounded-4">
                                    <HiOutlineGlobe size={40} className="text-gold" />
                                </div>
                                <h3 className="fw-black text-white mb-3">Our Mission</h3>
                                <p className="text-slate fs-6 leading-relaxed mb-0">
                                    To empower students through absolute transparency in facility management, ensuring every voice is heard and every issue is addressed with complete care.
                                </p>
                                <div className="position-absolute top-0 end-0 p-4 opacity-5 rotate-12">
                                    <HiOutlineAcademicCap size={150} />
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={6}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="glass-card p-5 h-100 border-white border-opacity-10 position-relative overflow-hidden"
                                style={{ borderRadius: '32px' }}
                            >
                                <div className="mb-4 d-inline-block p-3 bg-white bg-opacity-5 rounded-4">
                                    <HiOutlineEye size={40} className="text-black" />
                                </div>
                                <h3 className="fw-black text-white mb-3">Our Vision</h3>
                                <p className="text-slate fs-6 leading-relaxed mb-0">
                                    To establish Hostel Care as the gold standard for hostel management technology, where clear communication leads to fast maintenance and support.
                                </p>
                                <div className="position-absolute top-0 end-0 p-4 opacity-5 -rotate-12">
                                    <HiOutlineShieldCheck size={150} />
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Advanced Features Section: Thinking Outside the Box */}
            <div id="features" className="bg-white bg-opacity-5 py-5 mt-5 border-top border-white border-opacity-5">
                <Container className="py-5">
                    <div className="text-center mb-5 pb-4">
                        <Badge className="bg-gold-glow text-gold px-3 py-2 rounded-pill mb-4 border border-gold border-opacity-20 uppercase smaller tracking-widest fw-bold">Core Features</Badge>
                        <h2 className="display-4 fw-black text-black mb-3 tracking-tight">Simple Management</h2>
                        <p className="text-slate mx-auto fs-5 opacity-75" style={{ maxWidth: '700px' }}>
                            Go beyond basic reporting. Experience a centralized management hub designed for accountability.
                        </p>
                    </div>

                    <Row className="g-4">
                        {[
                            {
                                icon: <HiOutlineLightningBolt size={36} />,
                                title: 'Smart Priority',
                                desc: 'Automated urgency detection monitors safety-critical reports (Electrical/Safety) and escalates them to the right team instantly.',
                                color: 'text-gold'
                            },
                            {
                                icon: <HiOutlineDatabase size={36} />,
                                title: 'Complete History',
                                desc: 'Every status update, warden comment, and resolution timestamp is securely recorded, providing a clear history for maintenance audits.',
                                color: 'text-white'
                            },
                            {
                                icon: <HiOutlineStatusOnline size={36} />,
                                title: 'Active Areas',
                                desc: 'Smart analytics identify high-maintenance wings of the hostel, allowing wardens to optimize cleaning and maintenance proactively.',
                                color: 'text-gold'
                            },
                            {
                                icon: <HiOutlineSupport size={36} />,
                                title: 'Easy Communication',
                                desc: 'Integrated communication threads bridge the student-staff gap, removing the friction of manual follow-ups and ensuring constant clarity.',
                                color: 'text-white'
                            }
                        ].map((f, i) => (
                            <Col lg={3} md={6} key={i}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card p-5 h-100 border-white border-opacity-5 hover-glow border-gold-hover d-flex flex-column"
                                    style={{ borderRadius: '24px' }}
                                >
                                    <div className={`mb-4 ${f.color}`}>{f.icon}</div>
                                    <h5 className="fw-bold text-white mb-3 tracking-widest smaller uppercase">{f.title}</h5>
                                    <p className="text-slate smaller leading-relaxed mb-0 opacity-80 flex-grow-1">{f.desc}</p>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* Final Informative CTA */}
            <Container className="py-10 text-center mt-5 mb-5">
                <div className="p-5 glass-card border-gold border-opacity-10 rounded-5 mb-5 overflow-hidden position-relative shadow-gold">
                    <h2 className="fw-black text-white mb-4 display-4">A Better Way to Manage Your Hostel</h2>
                    <p className="text-slate mb-5 mx-auto fs-5 opacity-90" style={{ maxWidth: '800px' }}>
                        Join the next generation of hostel wardens using Hostel Care to maintain facilities, protect residents, and ensure 100% operational transparency.
                    </p>
                    <Link to={isAuthenticated ? dashboardLink : "/login"}>
                        <Button className="btn-gold px-5 py-3 rounded-pill fw-extrabold shadow-lg fs-5">
                            {isAuthenticated ? 'Go to My Dashboard' : 'Get Started Now'}
                        </Button>
                    </Link>
                    <div className="position-absolute bottom-0 start-50 translate-middle-x w-50 h-25 bg-gold opacity-10 blur-3xl rounded-circle" style={{ zIndex: -1 }}></div>
                </div>
                <div className="pt-4 border-top border-white border-opacity-5 opacity-50">
                    <p className="smaller text-slate uppercase tracking-widest-xl fw-black mb-0">
                        © 2026 Hostel Care • Hostel Management v1.0
                    </p>
                    <p className="smaller text-slate opacity-75 mt-2 italic">A Premium Management Experience</p>
                </div>
            </Container>

            <style>
                {`
                    .fw-black { font-weight: 900; }
                    .lh-sm { line-height: 1.1; }
                    .blur-3xl { filter: blur(80px); }
                    .rotate-12 { transform: rotate(12deg); }
                    .-rotate-12 { transform: rotate(-12deg); }
                    .tracking-tight { letter-spacing: -0.02em; }
                    .backdrop-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
                    .hover-gold:hover { color: var(--primary-gold) !important; }
                    .border-gold-hover:hover { border-color: rgba(212, 175, 55, 0.4) !important; }
                    .py-10 { padding-top: 6rem; padding-bottom: 6rem; }
                `}
            </style>
        </div>
    )
}

export default LandingPage
