import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../api/userApi';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectIsModeratorOrHigher, setUser } from '../../features/auth/authSlice';

const UpdateUserPage = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userNameState = useSelector((state) => state.auth.user?.username);
    const isModeratorOrHigher = useSelector(selectIsModeratorOrHigher);

    const { data, error, isLoading, refetch } = useGetUserByIdQuery(user_id, {
        skip: !isAuthenticated,
    });

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
    });

    useEffect(() => {
        if (data) {
            setFormData({
                username: data?.user.username || '',
                first_name: data?.user.first_name || '',
                last_name: data?.user.last_name || '',
            });
        }
    }, [data]);

    useEffect(() => {
        if (error && error.status === 401) {
            dispatch(logout());
            toast.error('Session expired. Please log in again.');
            navigate('/login');
        }
    }, [error, dispatch, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ user_id, userData: formData }).unwrap();
            toast.success('User updated successfully!');
            localStorage.setItem('username', formData.username)
            const userData = {
                id: localStorage.getItem('id'),
                username: localStorage.getItem('username'),
                role: localStorage.getItem('role'),
                token: localStorage.getItem('token'),
            };

            dispatch(setUser(userData));
            if (isModeratorOrHigher) {
                navigate(`/users/${user_id}`);
            } else {
                navigate('/me');
            }
        } catch (err) {
            toast.error(err.data?.error || 'Failed to update user');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
            <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-2xl p-10 border border-purple-100">
                    <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
                        Update User
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {[
                            { label: 'Username', name: 'username' },
                            { label: 'First Name', name: 'first_name' },
                            { label: 'Last Name', name: 'last_name' },
                        ].map(({ label, name }) => (
                            <div key={name} className="relative">
                                <input
                                    type="text"
                                    id={name}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required
                                    className="peer h-12 w-full border border-gray-300 text-gray-900 rounded-md px-3 pt-5 pb-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-transparent"
                                    placeholder={label}
                                />
                                <label
                                    htmlFor={name}
                                    className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600"
                                >
                                    {label}
                                </label>
                            </div>
                        ))}

                        <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className={`w-full sm:w-auto inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isUpdating ? 'Updating...' : 'Update User'}
                            </button>
                            <Link
                                to={isModeratorOrHigher ? `/users/${user_id}` : '/me'}
                                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline transition"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default UpdateUserPage;