import React from 'react'
import { useSelector } from 'react-redux';
import { selectIsSystemAdmin } from '../../features/auth/authSlice';
import { Navigate, Outlet } from 'react-router-dom';

const SystemAdminOnlyRoute = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isSystemAdmin = useSelector(selectIsSystemAdmin);

    return isAuthenticated ? (
        isSystemAdmin ? (
            <Outlet />
        ) : (
            <Navigate to="/unauthorized" replace />
        )
    ) : (
        <Navigate to="/login" replace />
    );
}

export default SystemAdminOnlyRoute