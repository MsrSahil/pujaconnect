import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b border-orange-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-orange-600 flex-shrink-0">
            PujaConnect
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-gray-600 hover:text-orange-600 font-medium transition">Admin</Link>
                )}
                {user?.role === 'pandit' && (
                  <Link to="/pandit/dashboard" className="text-gray-600 hover:text-orange-600 font-medium transition">Dashboard</Link>
                )}
                {user?.role === 'user' && (
                  <Link to="/bookings" className="text-gray-600 hover:text-orange-600 font-medium transition">My Bookings</Link>
                )}
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-500 font-medium">Hi, {user?.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-orange-600 font-medium transition">Login</Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 font-medium transition shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-orange-600 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-orange-200 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b border-gray-100 mb-2">
                  Signed in as {user?.name}
                </div>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Admin</Link>
                )}
                {user?.role === 'pandit' && (
                  <Link to="/pandit/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">Dashboard</Link>
                )}
                {user?.role === 'user' && (
                  <Link to="/bookings" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50">My Bookings</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-orange-700 hover:bg-orange-100 mt-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link to="/login" onClick={closeMenu} className="block w-full text-center px-4 py-2 text-base font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md">Login</Link>
                <Link to="/register" onClick={closeMenu} className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
