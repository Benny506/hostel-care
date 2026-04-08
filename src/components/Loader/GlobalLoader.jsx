import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'

export default function GlobalLoader() {
    const { loading, title, message } = useSelector((state) => state.ui.globalLoading)

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    style={{
                        background: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        zIndex: 20000,
                        pointerEvents: 'all'
                    }}
                >
                    <div className="position-relative mb-5" style={{ width: '200px', height: '200px' }}>
                        {/* Shimmering Golden Rings */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="position-absolute start-50 top-50 translate-middle border border-gold border-opacity-20 rounded-circle"
                                style={{ width: 100, height: 100 }}
                                animate={{
                                    scale: [1, 2.5],
                                    opacity: [0.3, 0],
                                    rotate: [0, 180]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    delay: i * 1.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}

                        {/* Central Pulsing Vault Core */}
                        <motion.div
                            className="position-absolute start-50 top-50 translate-middle bg-gold-glow rounded-circle shadow-gold"
                            style={{ width: 120, height: 120 }}
                            animate={{
                                scale: [0.95, 1.05, 0.95],
                                opacity: [0.4, 0.6, 0.4]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Rotating Branded Icon */}
                        <motion.div
                            className="position-absolute start-50 top-50 translate-middle bg-black border border-gold border-opacity-10 p-3 rounded-4 shadow-xl"
                            animate={{
                                y: [-4, 4, -4],
                                rotateY: [0, 15, 0, -15, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <img src="/logo.svg" alt="Hostel Care" width="60" height="60" />
                        </motion.div>
                    </div>

                    {/* Administrative Status */}
                    <div className="text-center px-4" style={{ maxWidth: '500px' }}>
                        <motion.h2
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="display-6 fw-black text-white mb-2 tracking-tight"
                        >
                            {title || 'Administrative Protocol'}
                        </motion.h2>

                        <motion.p
                            key={message}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gold smaller uppercase fw-bold tracking-widest-xl opacity-75"
                        >
                            {message || 'Synchronizing with Secure Infrastructure...'}
                        </motion.p>
                    </div>

                    {/* Ground Progress Indicator */}
                    <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden" style={{ height: '2px' }}>
                        <motion.div
                            className="h-100 bg-gold shadow-gold"
                            animate={{
                                x: ['-100%', '100%']
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{ width: '40%' }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
