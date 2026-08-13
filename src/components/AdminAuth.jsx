import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, Key, LogIn, UserPlus } from 'lucide-react';
import Squares from './Squares';
import StarBorder from './StarBorder';

const AdminAuth = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
    const [formData, setFormData] = useState({ email: '', password: '', newPassword: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            let endpoint = '';
            let body = {};

            if (view === 'login') {
                endpoint = '/api/admin/login';
                body = { email: formData.email, password: formData.password };
            } else if (view === 'register') {
                endpoint = '/api/admin/register';
                body = { email: formData.email, password: formData.password };
            } else if (view === 'forgot') {
                endpoint = '/api/admin/forgot-password';
                body = { email: formData.email, newPassword: formData.newPassword };
            }

            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                if (view === 'login') {
                    localStorage.setItem('admin-data', JSON.stringify(data.admin));
                    navigate('/admin/dashboard');
                } else if (view === 'register') {
                    setMessage('Admin created successfully. Please login.');
                    setView('login');
                } else if (view === 'forgot') {
                    setMessage('Password updated successfully. Please login.');
                    setView('login');
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error. Please make sure the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] font-sans p-4 relative overflow-hidden">
            {/* Squares Background */}
            <div className="absolute inset-0 z-0 opacity-50">
                <Squares
                    direction="diagonal"
                    speed={0.3}
                    borderColor="#222"
                    squareSize={50}
                    hoverFillColor="#1a1a1a"
                />
            </div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-black/40 border border-white/5 backdrop-blur-2xl rounded-3xl p-8 relative z-10 shadow-2xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                        <ShieldAlert className="text-purple-400 w-8 h-8" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Admin Portal</h2>
                <p className="text-gray-400 text-center mb-8 text-sm">
                    {view === 'login' && 'Secure access to WireframeAI management'}
                    {view === 'register' && 'Register a new admin account'}
                    {view === 'forgot' && 'Reset your admin password'}
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium shadow-sm">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium shadow-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <Mail className="text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Admin Email"
                                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                            />
                        </div>
                    </div>

                    {(view === 'login' || view === 'register') && (
                        <div>
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <Lock className="text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Password"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                />
                            </div>
                        </div>
                    )}

                    {view === 'forgot' && (
                        <div>
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <Key className="text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                    placeholder="New Password"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <StarBorder
                            as="button"
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-center flex items-center justify-center font-semibold text-white group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            color="#a855f7" // Tailwind purple-500 equivalent
                            speed="3s"
                            style={{ height: '52px' }}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {view === 'login' && <><LogIn size={18} /> Login</>}
                                    {view === 'register' && <><UserPlus size={18} /> Register Admin</>}
                                    {view === 'forgot' && <><Key size={18} /> Reset Password</>}
                                </span>
                            )}
                        </StarBorder>
                    </div>
                </form>

                <div className="mt-8 flex flex-col gap-3 text-center text-sm">
                    {view === 'login' ? (
                        <>
                            <button onClick={() => setView('forgot')} className="text-gray-400 hover:text-white transition-colors">Forgot Password?</button>
                            <button onClick={() => setView('register')} className="text-gray-400 hover:text-white transition-colors">Create Admin Account</button>
                        </>
                    ) : (
                        <button onClick={() => setView('login')} className="text-gray-400 hover:text-white transition-colors">Back to Login</button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminAuth;
