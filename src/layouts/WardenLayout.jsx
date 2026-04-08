import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
    HiOutlineHome,
    HiOutlineViewGrid,
    HiOutlineSpeakerphone,
    HiOutlineLogout,
    HiMenuAlt2,
    HiOutlineUsers,
    HiOutlineReply
} from 'react-icons/hi'
import { Offcanvas, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import authService from '../services/authService'
import { logout } from '../redux/authSlice'
import { addAlert, setGlobalLoading } from '../redux/uiSlice'

const navItems = [
    { name: 'Overview', icon: <HiOutlineHome size={22} />, path: '/warden-dashboard' },
    { name: 'All Requests', icon: <HiOutlineViewGrid size={22} />, path: '/warden-dashboard/tickets' },
    { name: 'Notice Board', icon: <HiOutlineSpeakerphone size={22} />, path: '/warden-dashboard/announcements' },
    { name: 'Students', icon: <HiOutlineUsers size={22} />, path: '/warden-dashboard/residents' },
]

export default function WardenLayout() {
    const [showMobileNav, setShowMobileNav] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userProfile = useSelector(state => state.auth.user)

    const getInitials = (name) => {
        if (!name) return '??'
        const words = name.trim().split(/\s+/)
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase()
        }
        const word = words[0]
        if (word.length >= 2) {
            return word.substring(0, 2).toUpperCase()
        }
        return (word[0] + word[0]).toUpperCase()
    }

    const userName = userProfile?.full_name || userProfile?.email?.split('@')[0] || 'Admin'
    const userInitials = getInitials(userName)

    const handleLogout = async () => {
        dispatch(setGlobalLoading({ loading: true, title: 'Logging out...', message: 'Ending your session safely...' }))
        await authService.logout()
        dispatch(logout())
        dispatch(setGlobalLoading({ loading: false }))
        dispatch(addAlert({ type: 'success', message: 'You have been logged out.' }))
        navigate('/login')
    }

    const NavContent = () => (
        <div className="d-flex flex-column h-100 p-4 pt-5">
            <div className="mb-5 d-flex align-items-center gap-3 px-2">
                <div className="p-2 rounded-3 bg-gold shadow-gold-sm">
                    <HiOutlineHome size={24} className="text-black" />
                </div>
                <div>
                    <h5 className="mb-0 fw-black text-white tracking-tight">Hostel Care</h5>
                    <Badge className="bg-gold-glow text-gold p-1 px-2 smaller fw-bold uppercase tracking-widest border border-gold border-opacity-10">Administrator</Badge>
                </div>
            </div>

            <nav className="flex-grow-1 d-flex flex-column gap-2 mt-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setShowMobileNav(false)}
                            className={`nav-link-premium d-flex align-items-center gap-3 p-3 rounded-4 transition-all text-decoration-none ${isActive ? 'active-gold shadow-gold-sm border border-gold border-opacity-20' : 'text-slate'}`}
                        >
                            <span className={isActive ? 'text-gold' : ''}>{item.icon}</span>
                            <span className={`tracking-widest smaller ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto pt-4 border-top border-white border-opacity-5 d-flex flex-column gap-2">
                <Link
                    to="/"
                    className="nav-link-premium d-flex align-items-center gap-3 p-3 rounded-4 w-100 bg-transparent border-0 text-slate hover-gold transition-all text-decoration-none"
                >
                    <HiOutlineReply size={22} />
                    <span className="fw-black uppercase tracking-widest smaller">Back to Home</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="nav-link-premium d-flex align-items-center gap-3 p-3 rounded-4 w-100 bg-transparent border-0 text-slate hover-danger transition-all text-decoration-none"
                >
                    <HiOutlineLogout size={22} />
                    <span className="fw-black uppercase tracking-widest smaller">Logout</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-vh-100 bg-black d-flex overflow-hidden">
            {/* Desktop Sidebar (Fixed) */}
            <aside
                className="d-none d-lg-block border-end border-white border-opacity-5 position-fixed top-0 start-0 bottom-0 overflow-y-auto"
                style={{ width: '280px', background: 'var(--bg-sidebar)', zIndex: 1100 }}
            >
                <NavContent />
            </aside>

            {/* Main Wrapper */}
            <div
                className="flex-grow-1 d-flex flex-column h-100vh transition-all overflow-hidden"
                style={{ marginLeft: 'var(--sidebar-width, 0px)', background: 'var(--bg-workspace)' }}
            >
                {/* Unified Sticky Header (Light Inversion) */}
                <header
                    className="d-flex align-items-center justify-content-between mt-0 px-4 py-lg-0 py-md-3 py-3"
                    style={{
                        height: '70px',
                        background: 'var(--bg-header)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid var(--border-light)',
                        zIndex: 1000
                    }}
                >
                    <div className="d-flex align-items-center gap-3">
                        <div className='d-lg-none d-md-block d-block'>
                            <HiMenuAlt2 onClick={() => setShowMobileNav(true)} size={24} color='#000' />
                        </div>
                        <h6 className="mb-0 fw-bold text-dark text-uppercase tracking-widest smaller opacity-75 flex-shrink-1 text-truncate">
                            {location.pathname.split('/').pop().replace('-', ' ') || 'Overview'}
                        </h6>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <div className="d-none d-md-flex flex-column align-items-end me-2">
                            <span className="text-dark smaller fw-bold leading-none">{userName}</span>
                            <span className="text-black smaller opacity-50 fw-bold uppercase tracking-widest-xl" style={{ fontSize: '10px' }}>
                                Hostel Staff
                            </span>
                        </div>
                        <div className="avatar-circle d-flex align-items-center justify-content-center bg-gold bg-opacity-10 border border-gold border-opacity-20 text-gold fw-bold shadow-sm" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                            <span style={{ fontSize: '14px', letterSpacing: '0.05em', color: 'black' }}>{userInitials}</span>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-grow-1 overflow-y-auto custom-scrollbar p-4 p-md-5">
                    <div className="mx-auto" style={{ maxWidth: '1400px' }}>
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Offcanvas */}
            <Offcanvas
                show={showMobileNav}
                onHide={() => setShowMobileNav(false)}
                className="bg-black text-white"
                style={{ width: '280px', borderRight: '1px solid var(--glass-border)' }}
            >
                <div style={{ background: 'var(--bg-sidebar)', height: '100%' }}>
                    <NavContent />
                </div>
            </Offcanvas>

            <style>
                {`
                    :root {
                        --sidebar-width: 280px;
                    }
                    @media (max-width: 991.98px) {
                        :root { --sidebar-width: 0px; }
                    }
                    .h-100vh { height: 100vh; }
                    .nav-link-premium {
                        transition: all 0.2s ease;
                        opacity: 0.7;
                    }
                    .nav-link-premium:hover {
                        background: rgba(255, 255, 255, 0.03);
                        opacity: 1;
                        color: white !important;
                    }
                    .active-gold {
                        background: var(--gold-glow) !important;
                        opacity: 1;
                        border-left: 3px solid var(--primary-gold) !important;
                        border-radius: 0 12px 12px 0 !important;
                    }
                    .hover-danger:hover {
                        background: rgba(220, 53, 69, 0.05) !important;
                        color: #dc3545 !important;
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                    }
                `}
            </style>
        </div>
    )
}
