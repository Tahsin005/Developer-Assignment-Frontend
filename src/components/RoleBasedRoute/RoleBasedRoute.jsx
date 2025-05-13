import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const hasRequiredRole = isAuthenticated && user && allowedRoles.includes(user.role);
    return isAuthenticated ? (
        hasRequiredRole ? (
            <Outlet />
        ) : (
            <Navigate to="/unauthorized" replace />
        )
    ) : (
        <Navigate to="/login" replace />
    )
}

export default RoleBasedRoute