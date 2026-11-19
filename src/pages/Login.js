import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.login({ email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        window.location.href = '/lab-website/#/admin';

      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-drone-dark flex items-center justify-center py-20">
      <div className="max-w-md w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-drone-gray p-8 rounded-2xl border border-white/10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-drone-blue to-drone-cyan rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-white text-2xl"></i>
            </div>
            <h1 className="font-orbitron text-2xl font-bold text-white mb-2">
              Admin <span className="text-gradient">Login</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access the control panel
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-drone-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-drone-blue focus:outline-none transition-colors"
                  placeholder="admin@dronelab.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <div className="relative">
                <i className="fas fa-key absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-drone-dark border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-drone-blue focus:outline-none transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-drone-blue to-drone-cyan text-white font-semibold rounded-lg shadow-lg shadow-drone-blue/50 hover:shadow-drone-blue/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </span>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-drone-blue transition-colors text-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;