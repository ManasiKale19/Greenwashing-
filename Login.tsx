import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/db';
import { Leaf, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
       db.login(email);
       if (email.includes('admin')) {
         navigate('/admin');
       } else {
         navigate('/analytics');
       }
    }
  };

  const handleAdminDemo = () => {
    db.login('admin@green.com');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left: Image Side */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80" 
          alt="Nature Mist" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-900/20"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-5xl font-serif font-bold mb-4">Nature's Harmony</h2>
          <p className="text-forest-100 max-w-md text-lg">Preserving Ecosystem Balance for the Future.</p>
        </div>
      </div>

      {/* Right: Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-left">
            <Link to="/" className="flex items-center space-x-2 mb-8 group">
               <div className="p-2 bg-forest-50 rounded-full group-hover:bg-forest-100 transition">
                  <Leaf className="h-6 w-6 text-forest-700" />
               </div>
              <span className="font-bold text-2xl tracking-tight text-forest-900">GreenIntellect</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-500">
               Please enter your details to access the platform.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-forest-900 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition bg-white"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                 <label className="block text-sm font-bold text-forest-900 mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-forest-800 hover:bg-forest-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-colors shadow-lg shadow-forest-200"
            >
              Sign in
            </button>
            
            <div className="flex items-center justify-center">
              <span className="text-gray-500 text-sm">Don't have an account? </span>
              <Link to="/signup" className="ml-2 font-bold text-forest-700 hover:text-forest-900 text-sm">Sign up for free</Link>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <button 
              onClick={handleAdminDemo}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest rounded-lg text-gray-500 bg-gray-50 hover:bg-gray-100 transition"
            >
              <Lock className="h-3 w-3 mr-2" />
              Demo Admin Access
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};