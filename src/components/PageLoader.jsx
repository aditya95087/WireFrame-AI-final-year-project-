import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageLoader = () => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Precise synchronization: 25ms * 100 = 2500ms (matches WFA animation end)
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Wait exactly 1 second after completion before showing "System Ready"
                    setTimeout(() => setIsComplete(true), 1000);
                    return 100;
                }
                return prev + 1;
            });
        }, 25);

        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        exit: {
            y: '-100%',
            transition: {
                duration: 1.2,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2
            }
        }
    };

    const boxVariants = {
        initial: { opacity: 0, y: 40 },
        animate: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.5 + (i * 0.1),
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    const textVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 0.03,
            transition: { duration: 2, delay: 1 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            exit="exit"
            className="fixed inset-0 z-[100] bg-[#07070A] text-white overflow-hidden flex flex-col font-sans"
        >
            {/* Background Text - Large corners */}
            <motion.div variants={textVariants} initial="initial" animate="animate" className="absolute top-12 left-12 text-8xl font-heading font-bold italic select-none pointer-events-none">RESEARCH</motion.div>
            <motion.div variants={textVariants} initial="initial" animate="animate" className="absolute top-12 right-12 text-8xl font-heading font-bold italic select-none pointer-events-none">DESIGN</motion.div>
            <motion.div variants={textVariants} initial="initial" animate="animate" className="absolute bottom-12 left-12 text-8xl font-heading font-bold italic select-none pointer-events-none">WIREFRAME</motion.div>
            <motion.div variants={textVariants} initial="initial" animate="animate" className="absolute bottom-12 right-12 text-8xl font-heading font-bold italic select-none pointer-events-none">CODE</motion.div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Header info */}
            <div className="p-8 flex justify-between items-start z-10">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] tracking-[0.3em] text-highlight font-bold uppercase font-heading">Wireframe AI</span>
                        <span className="text-[8px] tracking-[0.2em] text-gray-500 uppercase mt-1 font-sans">Intelligence Platform</span>
                    </div>
                </div>
                <div className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-sans">
                    Est. 2026 — v2.5
                </div>
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
                {/* Geometric Circle in Background */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none"
                />

                <div className="flex gap-6 mb-12">
                    {['W', 'F', 'A'].map((letter, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={boxVariants}
                            initial="initial"
                            animate="animate"
                            className={`w-32 h-32 md:w-40 md:h-40 flex items-center justify-center relative group overflow-hidden border border-white/10 ${i === 1 ? 'bg-highlight' : 'bg-[#0F0F12]'}`}
                        >
                            <span className={`text-5xl md:text-6xl font-heading font-bold italic ${i === 1 ? 'text-white' : 'text-gray-300'}`}>
                                {letter}
                            </span>

                            {/* Accent line */}
                            <div className="absolute top-0 right-0 w-8 h-[1px] bg-white/20 rotate-45 translate-x-3 -translate-y-1" />

                            {/* Small Label */}
                            <div className="absolute bottom-3 left-3 flex flex-col">
                                <span className="text-[6px] tracking-widest text-white/40 uppercase font-sans">
                                    {i === 0 ? 'SYSTEM' : i === 1 ? 'CORE' : 'INTERFACE'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center"
                >
                    <div className="text-[10px] tracking-[0.5em] text-gray-400 uppercase mb-2 font-sans">Wireframe • Research • Synthesis</div>
                    <div className="text-[8px] tracking-[0.3em] text-gray-600 uppercase font-sans">Premium AI Architect — Global Access</div>
                </motion.div>
            </div>

            {/* Footer Status */}
            <div className="p-8 flex justify-between items-end z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-highlight animate-pulse'}`} />
                    <span className="text-[10px] tracking-[0.2em] font-mono text-gray-400 uppercase font-sans">
                        {isComplete ? 'System Ready' : progress < 50 ? 'Loading Modules...' : 'Syncing Data...'}
                    </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="text-[10px] font-mono text-highlight tracking-tighter">
                        {progress.toString().padStart(3, '0')}%
                    </div>
                    <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-highlight origin-left"
                            style={{ scaleX: progress / 100 }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PageLoader;
