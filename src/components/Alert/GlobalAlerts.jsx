import { useSelector } from 'react-redux'
import { AnimatePresence } from 'motion/react'
import Alert from './Alert'

export default function GlobalAlerts() {
    const alerts = useSelector((state) => state.ui.alerts)

    return (
        <div className="global-alerts-container position-fixed top-0 end-0 p-4" style={{ zIndex: 10000, pointerEvents: 'none' }}>
            <div className="d-flex flex-column align-items-end">
                <AnimatePresence mode="popLayout">
                    {alerts.map((alert) => (
                        <Alert key={alert.id} alert={alert} />
                    ))}
                </AnimatePresence>
            </div>
            
            <style>
                {`
                    @media (max-width: 768px) {
                        .global-alerts-container {
                            width: 100%;
                            left: 0;
                            right: 0;
                            display: flex;
                            justify-content: center;
                        }
                        .global-alerts-container .d-flex {
                            align-items: center !important;
                            width: 100%;
                            padding-bottom: 2rem;
                        }
                        .glass-card {
                            max-width: 320px;
                        }
                    }
                `}
            </style>
        </div>
    )
}
