import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetUserByIdQuery, useDeleteUserMutation } from '../../api/userApi';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const DeleteUserPage = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const { data, error, isLoading } = useGetUserByIdQuery(user_id, {
        skip: !isAuthenticated,
    });

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    // Handle 401 errors
    useEffect(() => {
        if (error && error.status === 401) {
            dispatch(logout());
            toast.error('Session expired. Please log in again.');
            navigate('/login');
        }
    }, [error, dispatch, navigate]);

    const handleDelete = async () => {
        try {
            await deleteUser(user_id).unwrap();
            toast.success('User deleted successfully!');
            navigate('/users'); // Redirect to user list
        } catch (err) {
            toast.error(err.data?.error || 'Failed to delete user');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-t-purple-600 border-gray-200 rounded-full"></div>
            </div>
        );
    }

    if (error) {
        toast.error(error.data?.error || 'Failed to fetch user details');
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-600">Error: {error.data?.error || 'Unable to load user details'}</p>
            </div>
        );
    }

    const user = data?.user;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Delete User
                    </h2>

                    <div className="text-center mb-6">
                        <p className="text-gray-700">
                            Are you sure you want to delete the user{' '}
                            <span className="font-semibold">{user?.username}</span> ({user?.first_name} {user?.last_name})?
                        </p>
                        <p className="text-red-600 mt-2 text-sm">
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex space-x-4 justify-center">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isDeleting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        ></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                'Delete User'
                            )}
                        </button>
                        <Link
                            to={`/users/${user_id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 hover:underline"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserPage;