import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MicroCodeWindow from './MicroCodeWindow';
import Squares from './Squares';
import StarBorder from './StarBorder'; // Added import for StarBorder

const HeroSection = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.4,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const rightPanelVariants = {
        hidden: { opacity: 0, x: 50, scale: 0.95 },
        visible: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }
        }
    };

    return (
        <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-between gap-12 py-12 relative overflow-hidden"
        >

            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <Squares
                    direction="diagonal"
                    speed={0.5}
                    borderColor="#333"
                    squareSize={40}
                    hoverFillColor="#222"
                />
            </div>

            {/* Top Left Logo */}
            <motion.div variants={itemVariants} className="absolute top-0 left-0 p-1 z-50">
                <div className="flex items-center gap-3">
                    <img src="/icon.png" alt="IdeafyLab Logo" className="w-10 h-10 object-contain rounded-lg shadow-lg shadow-purple-500/20" />
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        WireFrame<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">AI</span>
                    </h1>
                </div>
            </motion.div>

            {/* Top Navigation */}
            <motion.div variants={itemVariants} className="absolute top-0 right-0 p-2 z-50">
                {user ? (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors cursor-pointer"
                        >
                            {user.picture ? (
                                <img src={user.picture} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-highlight flex items-center justify-center text-xs text-white font-bold">
                                    {(user.username || user.name)?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-200 pr-1">{user.username || user.name}</span>
                        </button>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg border border-white/10 transition-colors backdrop-blur-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <StarBorder
                        as="button"
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-highlight hover:bg-highlight/90 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-highlight/20"
                        color="cyan"
                        speed="3s"
                    >
                        Login
                    </StarBorder>
                )}
            </motion.div>

            {/* Left Content */}
            <div className="flex-1 space-y-8 max-w-2xl relative z-10">
                <motion.div variants={itemVariants}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6 font-medium">
                        <span>AI-Powered Wireframing</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                        Turn Ideas into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            Full Product
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 mt-6 max-w-lg leading-relaxed">
                        Transform your product concepts into interactive wireframes, user flows, and technical specs in seconds.
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    {user ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={() => navigate('/form')}
                                    className="group relative px-6 py-3 bg-highlight text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 min-w-[220px]"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative flex items-center gap-2">
                                        Describe your idea <ArrowRight size={18} />
                                    </span>
                                </button>
                                <button
                                    onClick={() => navigate('/diagram-maker')}
                                    className="px-6 py-3 bg-white/5 border border-white/13 text-white font-semibold rounded-lg hover:bg-white/13 transition-colors"
                                >
                                    Make Diagram
                                </button>
                            </div>
                            <button
                                onClick={() => navigate('/code-generator')}
                                className="px-6 py-3 bg-white/5 border border-white/13 text-white font-semibold rounded-lg hover:bg-white/13 transition-all flex items-center justify-center gap-2 group min-w-[220px] w-fit"
                            >
                                <Code2 size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                Code Generator
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={() => navigate('/form')}
                                    className="group relative px-6 py-3 bg-highlight text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 min-w-[220px]"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative flex items-center gap-2">
                                        Get Started <ArrowRight size={18} />
                                    </span>
                                </button>
                                <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                                    View Demo
                                </button>
                            </div>
                            <button
                                onClick={() => navigate('/code-generator')}
                                className="px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 group min-w-[220px] w-fit"
                            >
                                <Code2 size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                Code Generator
                            </button>
                        </div>
                    )}
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center gap-8 pt-8 border-t border-white/5">
                    <div>
                        <div className="text-2xl font-bold text-white">10k+</div>
                        <div className="text-sm text-gray-500">Generated</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">0s</div>
                        <div className="text-sm text-gray-500">Wait Time</div>
                    </div>
                </motion.div>
            </div>

            {/* Right Content - Micro Code Window & Showcase */}
            <motion.div 
                variants={rightPanelVariants}
                className="flex-1 w-full flex flex-col items-center lg:items-end gap-8 perspective-1000 relative z-10"
            >
                <MicroCodeWindow />

                {/* Showcase Slides */}
                <div className="w-full max-w-[420px] grid grid-cols-2 gap-4">
                    {[
                        { title: 'Idea to Wireframe', desc: 'Instant visualization', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
                        { title: 'User Flows', desc: 'Auto-generated paths', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
                        { title: 'Tech Specs', desc: 'Full stack details', color: 'bg-green-500/10 border-green-500/20 text-green-400' },
                        { title: 'Export Ready', desc: 'Code & Images', color: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                            className={`p-4 rounded-lg border ${item.color} backdrop-blur-sm hover:scale-105 transition-transform cursor-default`}
                        >
                            <div className="font-bold text-sm mb-1">{item.title}</div>
                            <div className="text-xs opacity-70">{item.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.section>
    );
};

export default HeroSection;
