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

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
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

    // Dynamic styling based on message type
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

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({ show: false, message: '', type: '' });

    // --- THIS IS THE NEW CODE ---
    // This hook ensures the page scrolls to the top every time
    // this component is rendered (mounts).
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // The empty array [] means this effect runs only once when the component mounts.
    // -----------------------------

    // Effect to automatically hide the popup after 3 seconds
    useEffect(() => {
        if (popup.show) {
            const timer = setTimeout(() => setPopup({ ...popup, show: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [popup, setPopup]); // Added setPopup to dependency array for correctness

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
                
                setPopup({ show: true, message: `Registration successful! Welcome, ${loggedUser.name}`, type: 'success' });
                
                setTimeout(() => {
                    localStorage.setItem("user", JSON.stringify(loggedUser));
                    navigate("/");
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error("Backend failed to process Google Auth");
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            setPopup({ show: true, message: 'Google Sign-Up failed.', type: 'error' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            setPopup({ show: true, message: 'Please fill in all fields.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            // Actual API Call to register
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });

            if (response.ok) {
                setPopup({ show: true, message: 'Registration successful! Redirecting...', type: 'success' });

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                const data = await response.json();
                setPopup({ show: true, message: data.message || 'Registration failed. Please try again.', type: 'error' });
            }

        } catch (error) {
            console.error("Registration error:", error);
            setPopup({ show: true, message: 'Server error. Please try again.', type: 'error' });
        } finally {
            // Ensure loading is set to false in case of error or success
            // Note: In the success case, we redirect, so this mainly helps for errors.
            // We'll let the redirect handle the component unmount.
            // But if the redirect fails or we stay on page, we must stop loading.
            if (!popup.show || popup.type === 'error') {
                setLoading(false);
            }
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
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-gray-400 text-sm">Join our community of creators today!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <UserIcon />
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                            />
                        </div>

                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <EmailIcon />
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

                    <div className="pt-2">
                        <StarBorder
                            as="button"
                            type="submit"
                            disabled={loading}
                            className="w-full text-center flex items-center justify-center font-semibold text-white group"
                            color="cyan"
                            speed="3s"
                            style={{ height: '52px' }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : "Create Account"}
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
                            setPopup({ show: true, message: 'Google Sign-Up was unsuccessful.', type: 'error' });
                        }}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        text="signup_with"
                    />
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <a href="/login" className="font-semibold text-white hover:text-blue-400 transition-colors">
                        Sign In
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
