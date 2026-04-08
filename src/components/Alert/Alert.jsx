import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'motion/react'
import { 
    HiCheckCircle, 
    HiExclamationCircle, 
    HiInformationCircle, 
    HiX 
} from 'react-icons/hi'
import { removeAlert } from '../../redux/uiSlice'

const alertConfig = {
  success: {
    icon: <HiCheckCircle className="text-gold" size={24} />,
    borderColor: 'border-gold',
    bgGlow: 'bg-gold-glow-radial',
    textColor: 'text-white'
  },
  error: {
    icon: <HiExclamationCircle className="text-danger" size={24} />,
    borderColor: 'border-danger',
    bgGlow: 'bg-danger-glow',
    textColor: 'text-white'
  },
  info: {
    icon: <HiInformationCircle className="text-info" size={24} />,
    borderColor: 'border-info',
    bgGlow: 'bg-info-glow',
    textColor: 'text-white'
  }
}

export default function Alert({ alert }) {
  const dispatch = useDispatch()
  const { id, type = 'info', message } = alert
  const config = alertConfig[type] || alertConfig.info

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeAlert(id))
    }, 5000)
    return () => clearTimeout(timer)
  }, [id, dispatch])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`glass-card mb-3 p-3 d-flex align-items-center gap-3 border-start border-4 ${config.borderColor} shadow-gold-sm overflow-hidden`}
      style={{ minWidth: '320px', maxWidth: '450px', borderRadius: '16px', pointerEvents: 'auto' }}
    >
      <div className="p-2 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10">
        {config.icon}
      </div>
      
      <div className="flex-grow-1">
        <p className={`mb-0 smaller fw-bold tracking-wide uppercase ${config.textColor}`}>
          {message}
        </p>
      </div>

      <button 
        onClick={() => dispatch(removeAlert(id))}
        className="ms-auto p-1 bg-transparent border-0 text-slate hover-gold transition-all"
      >
        <HiX size={18} />
      </button>

      <style>
        {`
          .shadow-gold-sm { box-shadow: 0 4px 20px rgba(212, 175, 55, 0.1); }
          .bg-danger-glow { background: radial-gradient(circle at center, rgba(220, 53, 69, 0.1) 0%, transparent 70%); }
          .bg-info-glow { background: radial-gradient(circle at center, rgba(0, 123, 255, 0.1) 0%, transparent 70%); }
        `}
      </style>
    </motion.div>
  )
}
