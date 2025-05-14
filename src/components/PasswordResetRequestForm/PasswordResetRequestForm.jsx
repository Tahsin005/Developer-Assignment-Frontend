import React, { useState } from 'react'
import { useResetPasswordRequestMutation } from '../../api/authApi';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PasswordResetRequestForm = () => {
    const [email, setEmail] = useState('');
    const [resetPasswordRequest, { isLoading, error }] = useResetPasswordRequestMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await resetPasswordRequest({ email }).unwrap();
            toast.success(response.message || 'Password reset link sent successfully!');
            navigate('/password/reset');
        } catch (err) {
            toast.error(err.data?.error || 'Failed to request password reset');
        }
    };
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Request Password Reset</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isLoading ? 'Sending...' : 'Request Reset'}
                </button>
                {error && <p className="text-red-600 text-sm">{error.data?.error}</p>}
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-purple-600 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    )
}

export default PasswordResetRequestForm