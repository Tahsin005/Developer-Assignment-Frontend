import React from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetUserByIdQuery } from '../../api/userApi';
import { useSelector } from 'react-redux';
import { selectIsAdminOrHigher, selectUserId } from '../../features/auth/authSlice';

const UserDetailsPage = () => {
    const { user_id } = useParams();
    const { data, error, isLoading } = useGetUserByIdQuery(user_id);

    const isSystemAdminOrAdmin = useSelector(selectIsAdminOrHigher);
    const loggedInUserId = useSelector(selectUserId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-t-purple-600 border-gray-200 rounded-full"></div>
            </div>
        );
    }

    if (error) {
        toast.error('Failed to fetch user details');
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-600">Error: {error.data?.error || 'Unable to load user details'}</p>
            </div>
        );
    }

    const user = data?.user;
    const isViewingOwnProfile = loggedInUserId === user.id;

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-10">
                    User Details
                </h2>

                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            ['ID', user.id],
                            ['Username', user.username],
                            ['Email', user.email],
                            ['First Name', user.first_name],
                            ['Last Name', user.last_name],
                            ['Role', user.user_type],
                            ['Email Verified', user.email_verified ? 'Yes' : 'No'],
                            ['Active', user.active ? 'Yes' : 'No'],
                            ['User Deletion Request', user.deletion_requested ? 'Yes' : 'No'],
                            ['Created At', new Date(user.created_at).toLocaleString()],
                            ['Updated At', new Date(user.updated_at).toLocaleString()],
                        ].map(([label, value]) => (
                            <div key={label}>
                                <p className="text-sm text-gray-500">{label}</p>
                                <p className="text-lg font-semibold text-gray-800 break-words">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4 justify-end">
                        {(isViewingOwnProfile || isSystemAdminOrAdmin) && (
                            <Link
                                to={`/users/${user.id}/update`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Edit
                            </Link>
                        )}

                        {!isViewingOwnProfile && (
                            (isSystemAdminOrAdmin || user.deletion_requested) && (
                                <Link
                                    to={`/users/${user.id}/delete`}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                >
                                    Delete
                                </Link>
                            )
                        )}

                        <Link
                            to="/users"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsPage;
