import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectIsSystemAdmin,
    selectIsAdminOrHigher,
    selectIsModeratorOrHigher,
    selectUserId,
    resetAuthState,
} from '../../features/auth/authSlice';
import { logout } from '../../features/auth/authSlice';
import { useLogoutUserMutation } from '../../api/authApi';
import toast from 'react-hot-toast';
import { userApi } from '../../api/userApi';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoutUser, { isLoading }] = useLogoutUserMutation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const isSystemAdmin = useSelector(selectIsSystemAdmin);
    const isAdminOrHigher = useSelector(selectIsAdminOrHigher);
    const isModeratorOrHigher = useSelector(selectIsModeratorOrHigher);
    const userId = useSelector(selectUserId);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        dispatch(logout());
        await logoutUser().unwrap();
        dispatch(resetAuthState());
        navigate('/login');
        toast.success("Logout Successful")
        setIsMenuOpen(false);
    };

    const linkClass = 'text-gray-600 hover:text-purple-600 transition-colors';
    const buttonClass =
        'border border-purple-600 text-purple-600 px-4 py-1 rounded hover:bg-purple-600 hover:text-white transition-colors';
    const primaryButtonClass =
        'bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition-colors';

    return (
        <nav className="bg-white py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center">
                <Link to="/" className="flex items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        AffPilot
                    </span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
                {isAuthenticated ? (
                    <>
                        {user?.username && (
                            <span className="text-gray-600">Hello, {user.username}</span>
                        )}
                        <Link to="/me" className={linkClass}>
                            Profile
                        </Link>
                        {isModeratorOrHigher && (
                            <Link to="/users" className={linkClass}>
                                Manage Users
                            </Link>
                        )}
                        {isAdminOrHigher && (
                            <>
                                <Link to="/roles" className={linkClass}>
                                    Roles
                                </Link>
                                <Link to="/permissions" className={linkClass}>
                                    Permissions
                                </Link>
                            </>
                        )}
                        <button onClick={handleLogout} className={buttonClass}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/resend-verification" className={linkClass}>
                            Resend Verification
                        </Link>
                        <Link to="/password/reset-request" className={linkClass}>
                            Reset Password
                        </Link>
                        <Link to="/login" className={buttonClass}>
                            Login
                        </Link>
                        <Link to="/register" className={primaryButtonClass}>
                            Register
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu className="h-6 w-6 text-gray-600" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 md:hidden flex flex-col space-y-4 animate-fade-in">
                    {isAuthenticated ? (
                        <>
                            {user?.username && (
                                <span className="text-gray-600">Hello, {user.username}</span>
                            )}
                            <Link
                                to="/me"
                                className={linkClass}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            {isModeratorOrHigher && (
                                <Link
                                    to="/users"
                                    className={linkClass}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Manage Users
                                </Link>
                            )}
                            {isAdminOrHigher && (
                                <>
                                    <Link
                                        to="/roles"
                                        className={linkClass}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Roles
                                    </Link>
                                    <Link
                                        to="/permissions"
                                        className={linkClass}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Permissions
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left text-gray-600 hover:text-purple-600 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/resend-verification"
                                className={linkClass}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Resend Verification
                            </Link>
                            <Link
                                to="/password/reset-request"
                                className={linkClass}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Reset Password
                            </Link>
                            <Link
                                to="/login"
                                className="w-full border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavBar;