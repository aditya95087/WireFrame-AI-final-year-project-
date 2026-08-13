import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Squares from './Squares';
import StarBorder from './StarBorder';

// --- SVG Icon Components ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

// --- Custom Popup Message Component ---
const PopupMessage = ({ message, type }) => {
    const isSuccess = type === 'success';

    const bgColor = isSuccess ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400';
    const icon = isSuccess ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <motion.div
            initial={{ y: -50, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: -20, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed top-8 left-1/2 flex items-center px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl z-50 ${bgColor}`}
        >
            {icon}
            <span className="ml-3 font-semibold text-sm">{message}</span>
        </motion.div>
    );
};


export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (popup.show) {
            const timer = setTimeout(() => {
                setPopup({ ...popup, show: false });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [popup]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            
            // Save to Backend Database
            const response = await fetch("http://localhost:8080/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: decoded.email, name: decoded.name || decoded.email.split("@")[0] }),
            });
            
            if (response.ok) {
                const data = await response.json();
                const loggedUser = { ...data.user, picture: decoded.picture };
                
                setPopup({ show: true, message: `Welcome back, ${loggedUser.name}!`, type: 'success' });
                
                setTimeout(() => {
                    if (onLogin) {
                        onLogin({ user: loggedUser, token: credentialResponse.credential });
                    } else {
                        localStorage.setItem("user", JSON.stringify(loggedUser));
                        navigate("/");
                        window.location.reload();
                    }
                }, 1500);
            } else {
                throw new Error("Backend failed to process Google Auth");
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            setPopup({ show: true, message: 'Google Sign-In failed.', type: 'error' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (form.email && form.password) {
                const response = await fetch("http://localhost:8080/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: form.email, password: form.password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const loggedUser = data.user;

                    setPopup({ show: true, message: `Welcome back, ${loggedUser.name}!`, type: 'success' });

                    setTimeout(() => {
                        if (onLogin) {
                            onLogin({ user: loggedUser, token: 'mock-token' });
                        } else {
                            localStorage.setItem("user", JSON.stringify(loggedUser));
                            navigate("/");
                            window.location.reload();
                        }
                    }, 1500);
                } else {
                    const data = await response.json();
                    setPopup({ show: true, message: data.message || 'Invalid credentials.', type: 'error' });
                }
            } else {
                setPopup({ show: true, message: 'Please enter a valid email and password.', type: 'error' });
            }
        } catch (error) {
            console.error("Login error:", error);
            setPopup({ show: true, message: 'Could not log in. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
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

            <AnimatePresence>
                {popup.show && <PopupMessage message={popup.message} type={popup.type} />}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-black/40 border border-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative z-10"
            >
                {/* Header Section */}
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-white mb-2 tracking-tight"
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 text-sm"
                    >
                        Sign in to access your detailed wireframes
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <UserIcon />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            />
                        </div>

                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <LockIcon />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2">
                        <label className="flex items-center text-gray-400 cursor-pointer hover:text-white transition-colors group">
                            <div className="relative flex items-center justify-center mr-2">
                                <input type="checkbox" className="peer appearance-none w-4 h-4 rounded bg-white/10 border border-white/20 checked:bg-blue-500 checked:border-blue-500 transition-all" />
                                <svg className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            Remember me
                        </label>
                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors bg-clip-text hover:underline">Forgot Password?</a>
                    </div>

                    <div className="pt-2">
                        <StarBorder
                            as="button"
                            type="submit"
                            disabled={loading}
                            className="w-full text-center flex items-center justify-center font-semibold text-white group"
                            color="cyan"
                            speed="3s"
                            style={{ height: '52px' }} // Explicit height for button consistency
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </span>
                            ) : "Sign In"}
                        </StarBorder>
                    </div>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="px-4 text-sm text-gray-500">Or continue with</span>
                    <div className="flex-1 border-t border-white/10"></div>
                </div>

                <div className="flex justify-center w-full">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            setPopup({ show: true, message: 'Google Sign-In was unsuccessful.', type: 'error' });
                        }}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                    />
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don’t have an account?{" "}
                    <a href="/register" className="font-semibold text-white hover:text-blue-400 transition-colors">
                        Create one now
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
