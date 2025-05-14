import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full">
                <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Unauthorized Access</h1>
                <p className="text-gray-600 mb-6">
                    You don’t have permission to view this page.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
