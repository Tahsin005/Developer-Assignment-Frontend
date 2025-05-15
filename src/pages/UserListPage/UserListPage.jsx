import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../../api/userApi';
import { Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectIsAdminOrHigher, selectUserId } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const UserListPage = () => {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

    const isSystemAdminOrAdmin = useSelector(selectIsAdminOrHigher);
    console.log("Are mama, access ase naki? ", isSystemAdminOrAdmin);
    const { data, error, isLoading } = useGetUsersQuery();
    const users = data?.users || [];

    const loggedInUserId = useSelector(selectUserId);

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredUsers = users.filter(
        (user) => user.username.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()) || user.first_name.toLowerCase().includes(search.toLowerCase()) || user.last_name.toLowerCase().includes(search.toLowerCase())
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'created_at' || sortField === 'updated_at') {
            return order * (new Date(a[sortField]) - new Date(b[sortField]));
        }
        return order * a[sortField].localeCompare(b[sortField]);
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-t-purple-600 border-gray-300 rounded-full"></div>
            </div>
        );
    }

    if (error) {
        toast.error(error.data?.error || 'Failed to fetch users');
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-600 font-semibold text-lg">
                    Error: {error.data?.error || 'Unable to load users'}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-purple-700 mb-8">User Directory</h2>

                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by username, email, or name..."
                        className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                </div>

                {sortedUsers.length > 0 ? (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <div className="bg-purple-100 text-purple-800 flex items-center gap-x-3 px-4 py-2 text-sm font-medium">
                            <Info className="w-5 h-5" />
                            Click on the column header to sort
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-purple-600 text-white">
                                <tr>
                                    {[
                                        ['id', 'ID'],
                                        ['username', 'Username'],
                                        ['email', 'Email'],
                                        ['first_name', 'First Name'],
                                        ['last_name', 'Last Name'],
                                        ['user_type', 'Role'],
                                        ['created_at', 'Created At'],
                                    ].map(([field, label]) => (
                                        <th
                                            key={field}
                                            className="px-4 py-3 text-left text-sm font-semibold tracking-wider cursor-pointer"
                                            onClick={() => handleSort(field)}
                                        >
                                            {label}{' '}
                                            {sortField === field && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                                {sortedUsers.map((user) => (
                                    <tr key={user.id} className={`border-b hover:bg-gray-50 ${!user.active ? 'bg-red-50' : ''} ${user.deletion_requested ? 'bg-red-400' : ''
                                        }`}>
                                        <td className="px-4 py-3">{user.id}</td>
                                        <td className="px-4 py-3">{user.username}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">{user.first_name}</td>
                                        <td className="px-4 py-3">{user.last_name}</td>
                                        <td className="px-4 py-3">{user.user_type}</td>
                                        <td className="px-4 py-3">
                                            {new Date(user.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 space-y-1">
                                            <Link
                                                to={`/users/${user.id}`}
                                                className="text-purple-600 hover:underline block"
                                            >
                                                View
                                            </Link>
                                            {isSystemAdminOrAdmin && (
                                                <>
                                                    {!(loggedInUserId === user.id) && (
                                                        <Link
                                                        to={`/users/${user.id}/delete`}
                                                        className="text-red-600 hover:underline block"
                                                    >
                                                        Delete
                                                    </Link>
                                                    )}
                                                    <Link
                                                        to={`/users/${user.id}/role`}
                                                        className="text-blue-600 hover:underline block"
                                                    >
                                                        Change Role
                                                    </Link>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg mt-10">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default UserListPage;
