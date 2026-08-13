import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const showBackButton = ['/about', '/contact', '/help', '/docs', '/api', '/privacy', '/terms'].includes(location.pathname);

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-highlight selection:text-white overflow-x-hidden relative">
            {showBackButton && (
                <div className="absolute top-6 left-6 z-50 md:top-8 md:left-8">
                    <button 
                        onClick={() => navigate('/')} 
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Back to Home</span>
                    </button>
                </div>
            )}

            {/* Background Effects - Blinking Light Blue */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-blue-500/20"
                />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-highlight/10 rounded-full blur-[128px]" />
            </div>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
