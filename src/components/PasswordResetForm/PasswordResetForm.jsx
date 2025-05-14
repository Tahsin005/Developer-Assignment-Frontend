import React, { useState } from 'react'
import { useResetPasswordMutation } from '../../api/authApi'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PasswordResetForm = () => {
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState('');
    const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await resetPassword({ token, new_password: newPassword }).unwrap();
            toast.success(response.message || 'Password reset successfully!');
            navigate('/login');
        } catch (err) {
            toast.error(err.data?.error || 'Failed to reset password');
        }
    };
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Token</label>
                    <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
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

export default PasswordResetForm