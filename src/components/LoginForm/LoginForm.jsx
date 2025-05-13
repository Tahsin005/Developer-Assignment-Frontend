import React, { useState } from 'react';
import { useLoginUserMutation } from '../../api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { resetAuthState, setSuccess } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [loginUser, { isLoading, error }] = useLoginUserMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData).unwrap();
            console.log(response)
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
            localStorage.setItem('username', response.username);
            localStorage.setItem('id', response.id);
            toast.success('Login successful!');
            navigate('/');
        } catch (err) {
            toast.error(error?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {['username', 'password'].map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                            {field.replace('_', ' ')}
                        </label>
                        <input
                            type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isLoading ? 'Loging...' : 'Login'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-purple-600 hover:underline font-medium">
                    Register
                </Link>
            </p>
        </div>
    );
};

export default LoginForm;
