import { Container, Button, Badge } from 'react-bootstrap'
import { HiOutlineLockClosed, HiOutlineArrowRight, HiOutlineShieldExclamation } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

export default function AccessDenied() {
    const navigate = useNavigate()

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-75 animate-in">
            <Container className="text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-5 rounded-5 border border-white border-opacity-5 max-w-md mx-auto shadow-gold-lg"
                >
                    <div className="mb-4 d-flex justify-content-center">
                        <div className="p-4 bg-gold bg-opacity-10 rounded-pill border border-gold border-opacity-20 text-gold shadow-gold-sm">
                            <HiOutlineLockClosed size={64} />
                        </div>
                    </div>

                    <Badge className="bg-gold-glow text-gold px-3 py-2 rounded-pill mb-3 border border-gold border-opacity-20 uppercase smaller tracking-widest fw-bold">
                        Institutional Protocol 403
                    </Badge>
                    
                    <h2 className="display-6 fw-black text-white mb-3 tracking-tight">Vault Access Restricted</h2>
                    <p className="text-slate fs-5 mb-5 opacity-75">Your current identity sequence has not been verified for this administrative sector. Please authenticate to continue.</p>

                    <div className="d-flex flex-column gap-3">
                        <Button 
                            onClick={() => navigate('/login')}
                            className="btn-gold py-3 rounded-pill fw-black fs-5 d-flex align-items-center justify-content-center gap-2 shadow-gold"
                        >
                            Enter Secure Vault
                            <HiOutlineArrowRight size={22} />
                        </Button>
                        
                        <Button 
                            variant="link"
                            onClick={() => navigate('/')}
                            className="text-slate text-decoration-none fw-bold uppercase smaller tracking-widest hover-gold transition-all"
                        >
                            Return to Perimeter
                        </Button>
                    </div>

                    <div className="mt-5 pt-4 border-top border-white border-opacity-5">
                        <div className="d-flex align-items-center justify-content-center gap-2 text-danger smaller fw-bold uppercase tracking-widest opacity-75">
                            <HiOutlineShieldExclamation size={18} />
                            Unauthorized Access Logged
                        </div>
                    </div>
                </motion.div>
            </Container>

            <style>
                {`
                    .min-vh-75 { min-height: 75vh; }
                    .max-w-md { max-width: 500px; }
                    .shadow-gold-lg {
                        box-shadow: 0 30px 60px -12px rgba(212, 175, 55, 0.15);
                    }
                    .animate-in {
                        animation: scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    @keyframes scaleUp {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}
            </style>
        </div>
    )
}
