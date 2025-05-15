import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetMeQuery, useRequestUserDeletionMutation } from '../../api/userApi';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const RequestDeletionPage = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { data: userData, error: userError, isLoading: userLoading } = useGetMeQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [requestUserDeletion, { isLoading: isRequesting }] = useRequestUserDeletionMutation();

    useEffect(() => {
        if (userError && userError.status === 401) {
            dispatch(logout());
            toast.error('Session expired. Please log in again.');
            navigate('/login');
        } else if (userData?.me?.id !== user_id) {
            toast.error('You can only request deletion for your own account.');
            navigate('/me');
        }
    }, [userError, userData, user_id, dispatch, navigate]);

    const handleRequestDeletion = async () => {
        try {
            await requestUserDeletion(user_id).unwrap();
            toast.success('Deletion request submitted successfully.');
        } catch (err) {
            console.log(err)
            toast.error(err.data?.error || 'Failed to request deletion');
        }
    };

    if (userLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-t-purple-600 border-gray-200 rounded-full"></div>
            </div>
        );
    }

    if (userError) {
        toast.error(userError.data?.error || 'Failed to fetch user details');
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-600">Error: {userError.data?.error || 'Unable to load user details'}</p>
            </div>
        );
    }

    const user = userData?.me;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Request Account Deletion
                    </h2>

                    <div className="text-center mb-6">
                        <p className="text-gray-700">
                            Are you sure you want to request deletion for your account{' '}
                            <span className="font-semibold">{user?.username}</span> ({user?.first_name} {user?.last_name})?
                        </p>
                        <p className="text-red-600 mt-2 text-sm">
                            This will initiate a deletion process and your account will be scheduled for removal.
                        </p>
                    </div>

                    <div className="flex space-x-4 justify-center">
                        <button
                            onClick={handleRequestDeletion}
                            disabled={isRequesting}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isRequesting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isRequesting ? (
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
                                    Requesting...
                                </>
                            ) : (
                                'Request Deletion'
                            )}
                        </button>
                        <Link
                            to="/me"
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

export default RequestDeletionPage;