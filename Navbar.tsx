import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { db } from '../services/db';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = db.getCurrentUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    db.logout();
    navigate('/');
    window.location.reload();
  };

  // Navbar style adapts based on scroll and page
  const isHome = location.pathname === '/';
  const navClass = isHome && !scrolled
    ? 'bg-transparent text-forest-900'
    : 'bg-white/90 backdrop-blur-md shadow-sm text-forest-900';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">

          {/* Brand */}
          <Link to="/" className="flex items-center space-x-3 group relative z-50">
            <div className={`p-2 rounded-full transition-colors ${isHome && !scrolled ? 'bg-forest-100/50' : 'bg-forest-50'}`}>
              <Leaf className="h-5 w-5 text-forest-600" />
            </div>
            <span className="text-2xl font-bold font-sans tracking-tight">GreenIntellect</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center text-sm font-semibold tracking-wide">
            <Link to="/" className="hover:text-forest-600 transition">Home</Link>
            <Link to="/analytics" className="hover:text-forest-600 transition">Analytics</Link>
            <Link to="/documentation" className="hover:text-forest-600 transition">Documentation</Link>

            {user ? (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-forest-100">
                {user.role === 'ADMIN' ? (
                  <Link to="/admin" className="text-forest-600 font-bold hover:text-forest-800 transition">
                    Admin
                  </Link>
                ) : (
                  <span className="font-medium text-forest-900">{user.name}</span>
                )}
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 ml-2">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-6 ml-6 pl-6 border-l border-forest-100">
                <Link to="/login" className="hover:text-forest-600 transition">Login</Link>
                <Link to="/signup" className="px-6 py-2.5 bg-forest-800 text-white rounded-full hover:bg-forest-700 transition shadow-lg shadow-forest-800/20">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center relative z-50">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none p-2 text-forest-900">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Menu Content */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full pt-24 pb-6 px-6 space-y-6">
          <Link to="/" className="text-xl font-bold text-forest-900 border-b border-gray-100 pb-4" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/analytics" className="text-xl font-bold text-forest-900 border-b border-gray-100 pb-4" onClick={() => setIsOpen(false)}>Analytics</Link>
          <Link to="/documentation" className="text-xl font-bold text-forest-900 border-b border-gray-100 pb-4" onClick={() => setIsOpen(false)}>Documentation</Link>

          {user ? (
            <div className="space-y-4 pt-4">
              <div className="font-medium text-gray-500">Signed in as {user.name}</div>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="block text-forest-600 font-bold" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
              )}
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left text-red-500 font-bold">Logout</button>
            </div>
          ) : (
            <div className="mt-auto space-y-4">
              <Link to="/login" className="block w-full text-center py-3 border border-forest-200 rounded-lg font-bold text-forest-900 hover:bg-forest-50" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" className="block w-full text-center py-3 bg-forest-800 text-white rounded-lg font-bold hover:bg-forest-700" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};