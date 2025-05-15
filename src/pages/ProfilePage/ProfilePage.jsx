import React, { useEffect } from 'react';
import { useGetMePermissionsQuery, useGetMeQuery } from '../../api/userApi';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userToken = useSelector((state) => state.auth.user?.token);

    const {
        data: userData,
        error: userError,
        isLoading: userLoading,
        refetch: refetchUser,
    } = useGetMeQuery(undefined, {
        skip: !isAuthenticated,
    });
    const {
        data: permissionsData,
        error: permissionsError,
        isLoading: permissionsLoading,
        refetch: refetchPermissions,
    } = useGetMePermissionsQuery(undefined, {
        skip: !isAuthenticated,
    });

    if (!userLoading && userData) console.log('User Data:', userData);
    if (!permissionsLoading && permissionsData) console.log('Permissions Data:', permissionsData);

    useEffect(() => {
        if (isAuthenticated) {
            refetchUser();
            refetchPermissions();
        }
    }, [isAuthenticated, userToken, refetchUser, refetchPermissions]);

    useEffect(() => {
        if ((userError || permissionsError) && (userError?.status === 401 || permissionsError?.status === 401)) {
            dispatch(logout());
            toast.error('Session expired. Please log in again.');
            navigate('/login');
        }
    }, [userError, permissionsError, dispatch, navigate]);

    if (userLoading || permissionsLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-t-purple-600 border-gray-200 rounded-full"></div>
            </div>
        );
    }

    if (userError || permissionsError) {
        toast.error((userError?.data?.error || permissionsError?.data?.error) || 'Failed to fetch profile or permissions');
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-600">
                    Error: {userError?.data?.error || permissionsError?.data?.error || 'Unable to load profile or permissions'}
                </p>
            </div>
        );
    }

    const user = userData?.me;
    const permissions = permissionsData?.permissions || [];
    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-32 relative">
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-purple-700">
                                {user.first_name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-gray-500">{user.username} • {user.email}</p>
                            <span className="mt-2 inline-block text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                                {user.user_type}
                            </span>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                            {[
                                ['ID', user.id],
                                ['Email Verified', user.email_verified ? 'Yes' : 'No'],
                                ['Active', user.active ? 'Yes' : 'No'],
                                ['Created At', new Date(user.created_at).toLocaleString()],
                                ['Updated At', new Date(user.updated_at).toLocaleString()],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-sm text-gray-500">{label}</p>
                                    <p
                                        className={`text-base font-medium ${label === 'Email Verified'
                                            ? user.email_verified
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            : label === 'Active'
                                                ? user.active
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                : 'text-gray-800'
                                            }`}
                                    >
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Permissions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {permissions.length > 0 ? (
                                    permissions.map((permission, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full capitalize"
                                        >
                                            {permission}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No permissions assigned.</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-4 justify-center">
                            <Link
                                to={`/users/${user.id}/update`}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;