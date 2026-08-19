import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/db';
import { Leaf } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
       db.register(name, email);
       navigate('/analytics');
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Right: Form Side (Swapped for Signup variety) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white order-2 lg:order-1">
        <div className="max-w-md w-full space-y-8">
          <div className="text-left">
            <Link to="/" className="flex items-center space-x-2 mb-8">
              <Leaf className="h-6 w-6 text-forest-700" />
              <span className="font-bold text-lg tracking-tight">GreenIntellect</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
            <p className="mt-2 text-gray-500">
               Join us to access transparency tools.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition bg-white"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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
                 <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
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
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-forest-900 hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-colors shadow-lg shadow-forest-200"
            >
              Get Started
            </button>
            
            <div className="flex items-center justify-center">
              <span className="text-gray-500 text-sm">Already have an account? </span>
              <Link to="/login" className="ml-2 font-bold text-forest-700 hover:text-forest-900 text-sm">Log in</Link>
            </div>
          </form>
        </div>
      </div>

       {/* Left: Image Side */}
       <div className="hidden lg:block w-1/2 relative overflow-hidden order-1 lg:order-2">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" 
          alt="Green Fields" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-900/30 mix-blend-multiply"></div>
        <div className="absolute bottom-12 right-12 text-white text-right">
          <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-forest-100 max-w-md ml-auto">Be part of a global community dedicated to authentic environmental stewardship.</p>
        </div>
      </div>

    </div>
  );
};