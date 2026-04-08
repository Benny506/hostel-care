import { Badge, Carousel } from 'react-bootstrap'
import {
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineDocumentReport,
  HiOutlineChatAlt2,
  HiOutlineLightningBolt,
  HiOutlineKey,
  HiOutlineEmojiHappy
} from 'react-icons/hi'
import { motion } from 'motion/react'

function MissionSlide() {
  return (
    <div className="auth-slide p-4 h-100 d-flex flex-column justify-content-center">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 bg-gold-glow rounded-4 border border-gold border-opacity-10 shadow-sm text-gold">
          <HiOutlineShieldCheck size={32} />
        </div>
        <div>
          <div className="text-slate smaller fw-bold uppercase tracking-widest mb-1">Our Mission</div>
          <h3 className="fw-black text-white mb-0 tracking-tight">Zero-Latency Resolution</h3>
        </div>
      </div>
      <p className="text-slate fs-5 leading-relaxed mb-4 opacity-90">
        To empower every resident through absolute transparency in facility management and technical precision.
      </p>
      <div className="d-flex flex-wrap gap-2">
        <Badge className="bg-gold-glow text-gold border border-gold border-opacity-10 px-3 py-2 rounded-pill smaller fw-bold">Live Tracking</Badge>
        <Badge className="bg-gold bg-opacity-5 text-white border border-white border-opacity-10 px-3 py-2 rounded-pill smaller fw-bold">Warden Direct</Badge>
      </div>
    </div>
  )
}

function SecuritySlide() {
  return (
    <div className="auth-slide p-4 h-100 d-flex flex-column justify-content-center">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 bg-gold-glow rounded-4 border border-gold border-opacity-10 shadow-sm text-gold">
          <HiOutlineKey size={32} />
        </div>
        <div>
          <div className="text-slate smaller fw-bold uppercase tracking-widest mb-1">Governance</div>
          <h3 className="fw-black text-white mb-0 tracking-tight">Immutable Audit Trails</h3>
        </div>
      </div>
      <div className="d-flex flex-column gap-3 mb-4">
        {[
          { icon: HiOutlineLightningBolt, label: 'Instant Priority Detection' },
          { icon: HiOutlineDocumentReport, label: 'Cryptographic Resolution Logs' },
          { icon: HiOutlineBell, label: 'Global System Alerts' }
        ].map((item, i) => (
          <div key={i} className="d-flex align-items-center gap-3 p-3 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-5">
            <item.icon className="text-gold" size={20} />
            <span className="text-black fw-bold smaller tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CommunitySlide() {
  return (
    <div className="auth-slide p-4 h-100 d-flex flex-column justify-content-center">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 bg-gold-glow rounded-4 border border-gold border-opacity-10 shadow-sm text-gold">
          <HiOutlineChatAlt2 size={32} />
        </div>
        <div>
          <div className="text-slate smaller fw-bold uppercase tracking-widest mb-1">Community</div>
          <h3 className="fw-black text-white mb-0 tracking-tight">Real-time Dialogs</h3>
        </div>
      </div>
      <p className="text-slate fs-5 leading-relaxed mb-4 opacity-90">
        Hostel Care bridges the communication gap. Chat directly with wardens on your specific tickets to ensure clarity.
      </p>
      <div className="d-flex align-items-center gap-2">
        <HiOutlineEmojiHappy className="text-gold" size={40} />
        <span className="text-white fw-black fs-4 italic">100% Transparency</span>
      </div>
    </div>
  )
}

export default function AuthTips() {
  return (
    <div className="auth-tips h-100 position-relative overflow-hidden">
      <Carousel
        className="h-100 auth-carousel"
        controls={false}
        indicators={true}
        interval={5000}
        pause={false}
      >
        <Carousel.Item className="h-100">
          <MissionSlide />
        </Carousel.Item>
        <Carousel.Item className="h-100">
          <SecuritySlide />
        </Carousel.Item>
        <Carousel.Item className="h-100">
          <CommunitySlide />
        </Carousel.Item>
      </Carousel>

      <style>
        {`
          .auth-carousel .carousel-inner, 
          .auth-carousel .carousel-item {
            height: 100%;
          }
          .auth-carousel .carousel-indicators {
            justify-content: flex-start;
            margin-left: 2.5rem;
            margin-bottom: 2rem;
          }
          .auth-carousel .carousel-indicators [data-bs-target] {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--primary-gold);
            opacity: 0.3;
            border: none;
            margin: 0 4px;
          }
          .auth-carousel .carousel-indicators .active {
            opacity: 1;
            width: 24px;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  )
}
