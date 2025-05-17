import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserByIdQuery, useChangeUserRoleMutation, usePromoteToAdminMutation, usePromoteToModeratorMutation, useDemoteUserMutation } from '../../api/userApi';
import { setSelectedUserId } from '../../features/user/userSlice';
import { selectIsSystemAdmin, selectIsAdminOrHigher, selectUserId, logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const ChangeRolePage = () => {
    const { user_id } = useParams();
    const location = useLocation();
    const { currentUserRole } = location.state || {};
    const [currentSelectedRole, setCurrentSelectedRole] = useState('user');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const currentUserId = useSelector(selectUserId);
    const isSystemAdmin = useSelector(selectIsSystemAdmin);
    const isAdminOrHigher = useSelector(selectIsAdminOrHigher);

    const { data: userData, error, isLoading } = useGetUserByIdQuery(user_id, {
        skip: !isAuthenticated,
    });
    const [changeUserRole] = useChangeUserRoleMutation();
    const [promoteToAdmin] = usePromoteToAdminMutation();
    const [promoteToModerator] = usePromoteToModeratorMutation();
    const [demoteUser] = useDemoteUserMutation();

    useEffect(() => {
        if (error && error.status === 401) {
            dispatch(logout());
            toast.error('Session expired. Please log in again.');
            navigate('/login');
        } else if (user_id === currentUserId) {
            toast.error('You cannot change your own role.');
            navigate('/users');
        }
    }, [error, user_id, currentUserId, dispatch, navigate]);

    const handleRoleChange = async (e) => {
        e.preventDefault();
        try {
            await changeUserRole({ user_id, role: currentSelectedRole }).unwrap();
            toast.success(`Role changed to ${currentSelectedRole} successfully!`);
            navigate('/users');
        } catch (err) {
            toast.error(err.data?.error || 'Failed to change role');
        }
    };

    const handlePromoteToAdmin = async () => {
        if (!isSystemAdmin) return;
        try {
            await promoteToAdmin(user_id).unwrap();
            toast.success('User promoted to admin successfully!');
            navigate('/users');
        } catch (err) {
            toast.error(err.data?.error || 'Failed to promote to admin');
        }
    };

    const handlePromoteToModerator = async () => {
        if (!isAdminOrHigher) return;
        try {
            await promoteToModerator(user_id).unwrap();
            toast.success('User promoted to moderator successfully!');
            navigate('/users');
        } catch (err) {
            toast.error(err.data?.error || 'Failed to promote to moderator');
        }
    };

    const handleDemoteUser = async (e) => {
        if (!isAdminOrHigher) return;
        e.preventDefault();
        try {
            await demoteUser({ user_id, role: currentSelectedRole }).unwrap();
            toast.success(`User demoted to ${currentSelectedRole} successfully!`);
            navigate('/users');
        } catch (err) {
            console.log(err)
            toast.error(err.data?.error || 'Failed to demote user');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-12 h-12 border-4 border-t-purple-600 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        toast.error(error.data?.error || 'Failed to fetch user');
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg text-red-600">Error: {error.data?.error || 'Unable to load user'}</p>
            </div>
        );
    }

    const user = userData?.user;

    return (
        <div className="min-h-screen bg-gradient-to-tr from-gray-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Change Role for <span className="text-purple-600">{user?.username}</span>
                </h2>

                <h2 className="text-sm italic text-center text-red-600 mb-8">
                    <p>Current role: {user?.user_type}</p>
                </h2>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Select New Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="mt-1 block w-full py-2 border-gray-300 focus:ring-purple-500 focus:border-purple-500 rounded-md shadow-sm"
                            defaultValue={user?.user_type || ''}
                            onChange={e => setCurrentSelectedRole(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                            {isSystemAdmin && <option value="system_admin">System Admin</option>}
                        </select>
                    </div>
                </form>

                <button
                    disabled={!isAdminOrHigher}
                    onClick={handleRoleChange}
                    className="mt-8 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-all duration-150 disabled:opacity-50"
                >
                    Change Role
                </button>
                <div className="mt-8 space-y-4">
                    {isSystemAdmin && (
                        <button
                            onClick={handlePromoteToAdmin}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-150"
                        >
                            Promote to Admin
                        </button>
                    )}
                    {isAdminOrHigher && (
                        <>
                            <button
                                onClick={handlePromoteToModerator}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-150"
                            >
                                Promote to Moderator
                            </button>
                            <button
                                onClick={handleDemoteUser}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-150"
                            >
                                Demote User
                            </button>
                        </>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <Link to="/users" className="text-purple-600 hover:underline font-medium">
                        Back to Users
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ChangeRolePage;
