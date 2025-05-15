import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetRolesQuery,
    useAddRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} from '../../api/roleApi';
import { setSelectedRole, clearSelectedRole, updateFormData } from '../../features/role/roleSlice';
import toast from 'react-hot-toast';
import { logout } from '../../features/auth/authSlice';

const RoleManagementPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { selectedRole, formData } = useSelector((state) => state.role);

    const { data: roles, error, isLoading } = useGetRolesQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [addRole] = useAddRoleMutation();
    const [updateRole] = useUpdateRoleMutation();
    const [deleteRole] = useDeleteRoleMutation();

    useEffect(() => {
        if (error && error.status === 401) {
            dispatch(logout());
            toast.error('Session expired. Please log in again.');
            navigate('/login');
        }
    }, [error, dispatch, navigate]);

    const handleRoleClick = (role) => {
        dispatch(setSelectedRole(role));
    };

    const handleClearSelection = () => {
        dispatch(clearSelectedRole());
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateFormData({ [name]: value }));
    };

    const handleAddOrUpdateRole = async (e) => {
        e.preventDefault();
        const roleData = { name: formData.name, description: formData.description };
        try {
            if (formData.id) {
                await updateRole({ id: formData.id, updatedRole: roleData }).unwrap();
                toast.success('Role updated successfully!');
            } else {
                await addRole(roleData).unwrap();
                toast.success('Role added successfully!');
            }
            dispatch(clearSelectedRole());
        } catch (err) {
            toast.error(err.data?.error || 'Failed to save role');
        }
    };

    const handleDeleteRole = async () => {
        if (!selectedRole?.id) return;

        const result = await Swal.fire({
            title: `Delete role "${selectedRole.name}"?`,
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await deleteRole(selectedRole.id).unwrap();
                toast.success('Role deleted successfully!');
                dispatch(clearSelectedRole());
            } catch (err) {
                toast.error(err.data?.error || 'Failed to delete role');
            }
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
        toast.error(error.data?.error || 'Failed to fetch roles');
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-600">Error: {error.data?.error || 'Unable to load roles'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br pt-10 from-purple-50 to-white py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-10">
                    Role Management
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl p-6 border border-purple-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5">Roles List</h3>
                        {roles && roles.length > 0 ? (
                            <div className="overflow-x-auto rounded-md">
                                <table className="w-full text-left text-sm text-gray-700 border-collapse">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                                        <tr>
                                            <th className="py-3 px-4">Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map((role) => (
                                            <tr
                                                key={role.id}
                                                onClick={() => handleRoleClick(role)}
                                                className={`cursor-pointer border-b hover:bg-purple-50 transition ${selectedRole?.id === role.id ? 'bg-purple-100' : ''
                                                    }`}
                                            >
                                                <td className="py-3 px-4">{role.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500">No roles available.</p>
                        )}
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl p-6 border border-purple-100">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {selectedRole ? 'Role Details' : 'Add New Role'}
                            </h3>
                            {selectedRole && (
                                <button
                                    onClick={handleClearSelection}
                                    className="text-sm text-purple-600 hover:underline transition"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {selectedRole && (
                            <div className="space-y-5 mb-6 text-gray-700">
                                <div>
                                    <p className="text-sm text-gray-500">ID</p>
                                    <p className="font-medium text-base">{selectedRole.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium text-base">{selectedRole.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p>{selectedRole.description || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={handleDeleteRole}
                                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete Role
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleAddOrUpdateRole} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
                            >
                                {formData.id ? 'Update Role' : 'Add Role'}
                            </button>
                        </form>
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

export default RoleManagementPage;