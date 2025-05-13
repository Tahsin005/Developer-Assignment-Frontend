import React from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            <div className="hidden lg:flex items-center justify-center w-1/2 bg-gradient-to-br from-purple-500 to-purple-700 text-white p-10">
                <div className="max-w-md text-center">
                    <h2 className="text-4xl font-bold mb-4">Welcome to AffPilot</h2>
                    <p className="text-lg opacity-90">
                        Join us and start automating your affiliate blogs with the power of AI.
                        <br />
                        Create, publish, and scale — all on autopilot.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center w-full lg:w-1/2 px-4 py-10">
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
