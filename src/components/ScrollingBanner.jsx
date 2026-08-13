import React from 'react';
import { motion } from 'framer-motion';

const ScrollingBanner = () => {
    const items = [
        "Wireframing", "AI Synthesis", "Deep Research", "Tech Specs", 
        "UI Design", "User Flows", "Prototypes", "System Architecture",
        "Code Generation", "Visual Mockups", "Project Planning"
    ];

    // Double the items for seamless loop
    const doubledItems = [...items, ...items];

    return (
        <div className="py-8 bg-[#0a0a0c] border-y border-white/5 overflow-hidden whitespace-nowrap relative select-none">
            <motion.div 
                className="inline-flex items-center gap-12"
                animate={{ x: ['0%', '-50%'] }} 
                transition={{ 
                    duration: 30, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
            >
                {doubledItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-12">
                        <span className="text-2xl md:text-3xl font-heading font-medium text-gray-500 hover:text-white transition-colors duration-300 tracking-tighter">
                            {item}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-highlight/40" />
                    </div>
                ))}
            </motion.div>
            
            {/* Fade effect on edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#07070A] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#07070A] to-transparent z-10" />
        </div>
    );
};

export default ScrollingBanner;
