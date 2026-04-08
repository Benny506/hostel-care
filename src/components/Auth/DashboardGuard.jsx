import { useSelector, useDispatch } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { setGlobalLoading } from '../../redux/uiSlice'
import AccessDenied from './AccessDenied'

export default function DashboardGuard({ allowedRole }) {
    const { isAuthenticated, initChecked, role, user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        // Show GlobalLoader while verifying institutional credentials
        if (!initChecked) {
            dispatch(setGlobalLoading({
                loading: true,
                title: 'Verifying Presidential Clearance...',
                message: 'Verifying Vault Access Rights and Institutional Identity Sequence...'
            }))
        } else {
            dispatch(setGlobalLoading({ loading: false }))
        }
    }, [initChecked, dispatch])

    // Wait for initialization to complete
    if (!initChecked) return null

    // Verification Logic:
    // 1. Session must exist
    // 2. Profile must exist (isAuthenticated is true only if both exist in our atomic fetch)
    // 3. User must have the correct role for this dashboard
    if (!isAuthenticated || !user) {
        return <AccessDenied />
    }

    // Role-based verification
    if (allowedRole && role !== allowedRole) {
        return <AccessDenied />
    }

    return <Outlet />
}
