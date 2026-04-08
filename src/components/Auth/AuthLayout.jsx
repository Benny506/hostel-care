import { Container, Row, Col } from 'react-bootstrap'
import { motion } from 'motion/react'
import AuthTips from './AuthTips'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout min-vh-100 bg-black d-flex align-items-center justify-content-center overflow-hidden py-4">
      <Container className="my-auto">
        <Row className="g-0 glass-card mx-auto shadow-gold overflow-hidden"
          style={{ borderRadius: '40px', maxWidth: '1100px', minHeight: '650px' }}>

          {/* Left Side: AuthTips Carousel (Desktop Only) */}
          <Col lg={6} className="d-none d-lg-block bg-gold-glow position-relative overflow-hidden border-end border-white border-opacity-5">
            <div className="h-100 w-100 d-flex flex-column p-5">
              <Link to="/" className="d-flex align-items-center gap-2 mb-auto text-decoration-none hover-gold transition-all">
                <div className="p-1 bg-black rounded-3 border border-gold border-opacity-20 shadow-sm overflow-hidden">
                  <img src="/logo.svg" alt="Logo" width="28" height="28" />
                </div>
                <span className="fs-5 fw-bold text-white tracking-widest-xl fw-black uppercase smaller">Hostel Care</span>
              </Link>

              <div className="flex-grow-1">
                <AuthTips />
              </div>

              <div className="mt-auto">
                <p className="smaller text-slate uppercase tracking-widest fw-bold opacity-50 mb-0">
                  Secure Administrative Protocol v1.0
                </p>
              </div>
            </div>

            {/* Background Decorative Element */}
            <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-gold-glow-radial" style={{ zIndex: -1 }}></div>
          </Col>

          {/* Right Side: Auth Form */}
          <Col lg={6} className="bg-black bg-opacity-80 d-flex align-items-center p-4 p-md-5 position-relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-100 px-lg-4"
              style={{ zIndex: 2 }}
            >
              {/* Logo for Mobile */}
              <div className="d-lg-none mb-5 text-center">
                <Link to="/" className="d-inline-flex flex-column align-items-center gap-2 text-decoration-none">
                  <div className="p-2 bg-gold-glow rounded-4 border border-gold border-opacity-20 shadow-sm overflow-hidden">
                    <img src="/logo.svg" alt="Logo" width="32" height="32" />
                  </div>
                  <span className="text-white tracking-widest fw-black uppercase smaller">Hostel Care</span>
                </Link>
              </div>

              {children}

              {/* Footer for Mobile */}
              <div className="d-lg-none mt-5 text-center opacity-50">
                <p className="smaller text-slate uppercase tracking-widest fw-bold mb-0">
                  Secure Administrative Protocol
                </p>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style>
        {`
          .blur-3xl { filter: blur(120px); }
          .transition-all { transition: all 0.3s ease; }
          .hover-gold:hover { transform: scale(1.02); }
          .hover-gold:hover span { color: var(--primary-gold) !important; }
          
          /* Refined Background Glow */
          .bg-gold-glow-radial {
            background: radial-gradient(circle at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
          }
        `}
      </style>
    </div>
  )
}
