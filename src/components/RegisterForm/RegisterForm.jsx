import React, { useState } from 'react';
import { useRegisterUserMutation } from '../../api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { resetAuthState, setSuccess } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    });

    const [registerUser, { isLoading, error }] = useRegisterUserMutation();
    const { success } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        try {
            await registerUser(formData).unwrap();
            dispatch(setSuccess(true));
            toast.success('Registration successful & Check email for verification link...');
        } catch (err) {
            toast.error(error?.data?.error || 'Registration failed');
        }
    };

    if (success) {
        setTimeout(() => {
            dispatch(resetAuthState());
            navigate('/login');
        }, 3000);
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {['username', 'email', 'password', 'first_name', 'last_name'].map((field) => (
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
                    className={`w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:underline font-medium">
                    Log in
                </Link>
            </p>
        </div>
    );
};

export default RegisterForm;
