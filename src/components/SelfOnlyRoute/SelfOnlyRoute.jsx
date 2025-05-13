import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsModeratorOrHigher, selectUserId } from '../../features/auth/authSlice';
import { Navigate, Outlet, useParams } from 'react-router-dom';

const SelfOnlyRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const userId = useSelector(selectUserId);
    const isModeratorOrHigher = useSelector(selectIsModeratorOrHigher);
    const { user_id } = useParams();

    const isSelf = isAuthenticated && userId === user_id;
    const hasRequiredRole = isAuthenticated && isModeratorOrHigher;

    return isAuthenticated ? (
        isSelf || hasRequiredRole ? (
            <Outlet />
        ) : (
            <Navigate to="/unauthorized" replace />
        )
    ) : (
        <Navigate to="/login" replace />
    );
}

export default SelfOnlyRoute