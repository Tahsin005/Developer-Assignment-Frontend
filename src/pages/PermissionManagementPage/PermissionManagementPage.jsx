import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedPermission, clearSelectedPermission } from '../../features/permission/permissionSlice';
import toast from 'react-hot-toast';
import { useGetPermissionsQuery } from '../../api/permissionApi';
import { logout } from '../../features/auth/authSlice';

const PermissionManagementPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const selectedPermission = useSelector((state) => state.permission.selectedPermission);

    const { data: permissions, error, isLoading } = useGetPermissionsQuery(undefined, {
        skip: !isAuthenticated,
    });

    useEffect(() => {
        if (error && error.status === 401) {
            dispatch(logout());
            toast.error('Session expired. Please log in again.');
            navigate('/login');
        }
    }, [error, dispatch, navigate]);

    const handlePermissionClick = (permission) => {
        dispatch(setSelectedPermission(permission));
    };

    const handleClearSelection = () => {
        dispatch(clearSelectedPermission());
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-t-purple-600 border-gray-200 rounded-full"></div>
            </div>
        );
    }

    if (error) {
        toast.error(error.data?.error || 'Failed to fetch permissions');
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-600">Error: {error.data?.error || 'Unable to load permissions'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-10">
                    Permission Management
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl p-6 border border-purple-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5">Permissions List</h3>
                        {permissions && permissions.length > 0 ? (
                            <div className="overflow-x-auto rounded-md">
                                <table className="w-full text-left text-sm text-gray-700 border-collapse">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                                        <tr>
                                            <th className="py-3 px-4">Name</th>
                                            <th className="py-3 px-4">Action</th>
                                            <th className="py-3 px-4">Resource</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permissions.map((permission) => (
                                            <tr
                                                key={permission.id}
                                                onClick={() => handlePermissionClick(permission)}
                                                className={`cursor-pointer border-b hover:bg-purple-50 transition ${selectedPermission?.id === permission.id ? 'bg-purple-100' : ''
                                                    }`}
                                            >
                                                <td className="py-3 px-4">{permission.name}</td>
                                                <td className="py-3 px-4">{permission.action || 'N/A'}</td>
                                                <td className="py-3 px-4">{permission.resource || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500">No permissions available.</p>
                        )}
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl p-6 border border-purple-100">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-semibold text-gray-800">Permission Details</h3>
                            {selectedPermission && (
                                <button
                                    onClick={handleClearSelection}
                                    className="text-sm text-purple-600 hover:underline transition"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {selectedPermission ? (
                            <div className="space-y-5 text-gray-700">
                                <div>
                                    <p className="text-sm text-gray-500">ID</p>
                                    <p className="font-medium text-base">{selectedPermission.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium text-base">{selectedPermission.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Action</p>
                                    <p>{selectedPermission.action || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Resource</p>
                                    <p>{selectedPermission.resource || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p>{selectedPermission.description || 'N/A'}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Select a permission to view details.</p>
                        )}
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        to="/users"
                        className="inline-block text-purple-600 hover:text-purple-800 font-medium transition"
                    >
                        Back to Users
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default PermissionManagementPage;