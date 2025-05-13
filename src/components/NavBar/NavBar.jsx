import React, { useState } from 'react';
import { Menu } from "lucide-react";
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center">
                <Link to={'/'} className="flex items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">AffPilot</span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
                <Link to={'/users'} className="text-gray-600 hover:text-purple-600 transition-colors">Users</Link>
                <Link to={'/login'} className="border border-purple-600 text-purple-600 px-4 py-1 rounded hover:bg-purple-600 hover:text-white transition-colors">
                    Login
                </Link>
                <Link to={'/register'} className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition-colors">
                    Register
                </Link>
            </div>

            {/* Mobile Menu button */}
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 md:hidden flex flex-col space-y-4 animate-fade-in">
                    <Link to={'/users'} className="text-gray-600 hover:text-purple-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Users</Link>
                    <Link to={'/login'} className="w-full border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link to={'/register'} className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
