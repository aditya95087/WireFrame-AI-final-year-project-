import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Minimize, Maximize, X } from 'lucide-react';

const CODE_SNIPPET = `// Generated Component
const Hero = () => {
  return (
    <div className="hero">
      <h1>Turn Ideas into Reality</h1>
      <button>Get Started</button>
    </div>
  );
};`;

const MicroCodeWindow = () => {
    const [displayedCode, setDisplayedCode] = useState('');

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedCode(CODE_SNIPPET.substring(0, i));
            i++;
            if (i > CODE_SNIPPET.length) {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[420px] bg-[#0F0F12] border border-white/10 rounded-lg shadow-2xl overflow-hidden"
        >
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Terminal size={12} />
                    <span>Animation.jsx</span>
                </div>
            </div>

            {/* Code Area */}
            <div className="p-4 font-mono text-sm h-[200px] overflow-hidden relative">
                <pre className="text-gray-300">
                    <code dangerouslySetInnerHTML={{
                        __html: displayedCode.replace(/const|return|function/g, '<span class="text-highlight">$&</span>')
                            .replace(/className|div|h1|button/g, '<span class="text-blue-400">$&</span>')
                    }} />
                    <span className="animate-pulse inline-block w-2 h-4 bg-highlight ml-1 align-middle"></span>
                </pre>
            </div>

            {/* Micro Preview */}
            <div className="border-t border-white/10 p-4 bg-black/20">
                <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider font-semibold">Live Preview</div>
                <div className="bg-background border border-white/5 rounded p-4 flex flex-col items-center justify-center gap-3 min-h-[120px]">
                    <div className="h-2 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-8 w-32 bg-highlight rounded flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(138,43,226,0.3)]">
                        Get Started
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MicroCodeWindow;
