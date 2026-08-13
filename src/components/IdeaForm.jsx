import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Clock, Trash2, ArrowRight, Zap, Sparkles, MessageSquare, Layout, Mic } from 'lucide-react';

const IdeaForm = ({ onGenerate, onBack, onReopen }) => {
    const [formData, setFormData] = useState({
        idea: '',
        persona: '',
        platform: 'web',
        constraints: ''
    });
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        try {
            const history = JSON.parse(localStorage.getItem('workspace_history') || '[]');
            setRecentSearches(history);
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.idea.trim()) return;
        onGenerate(formData);
    };

    const handleDeleteProject = (idx, e) => {
        e.stopPropagation();
        try {
            const history = JSON.parse(localStorage.getItem('workspace_history') || '[]');
            const updatedHistory = history.filter((_, i) => i !== idx);
            localStorage.setItem('workspace_history', JSON.stringify(updatedHistory));
            setRecentSearches(updatedHistory);
        } catch (err) {
            console.error("Failed to delete project", err);
        }
    };

    const handleNewWorkspace = () => {
        setFormData({
            idea: '',
            persona: '',
            platform: 'web',
            constraints: ''
        });
    };

    return (
        <div className="w-screen h-screen bg-[#050505] text-white flex overflow-hidden font-['Outfit'] tracking-wide">
            {/* Sidebar - ChatGPT Inspired */}
            <aside className="w-[280px] shrink-0 bg-[#0A0A0C] border-r border-white/10 flex flex-col z-20 relative">
                {/* Header / New Chat */}
                <div className="p-4 pt-6">
                    <button 
                        onClick={handleNewWorkspace}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold group"
                    >
                        <div className="w-6 h-6 rounded-lg bg-highlight/10 flex items-center justify-center text-highlight group-hover:scale-110 transition-transform">
                            <Plus size={16} />
                        </div>
                        <span className="text-gray-300">New Workspace</span>
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    <div className="px-4 py-2 text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] mb-1">Archive</div>
                    
                    <AnimatePresence initial={false}>
                        {recentSearches.map((project, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative"
                            >
                                <button
                                    onClick={() => onReopen(project)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-gray-200 hover:bg-white/5 rounded-xl transition-all text-left truncate group-hover:pr-10"
                                >
                                    <MessageSquare size={16} className="shrink-0 text-gray-700 group-hover:text-highlight transition-colors" />
                                    <span className="truncate font-medium">{project.concept?.title || 'Unknown Project'}</span>
                                </button>
                                <button
                                    onClick={(e) => handleDeleteProject(idx, e)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/10 space-y-3">
                    <button 
                        onClick={onBack}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Exit Studio
                    </button>
                    <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-gray-700">
                        <span>v2.1 Stable</span>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live</div>
                    </div>
                </div>
            </aside>

            {/* Main Area - Edge-to-Edge Workspace */}
            <main className="flex-1 relative bg-[#0D0D10] h-full flex flex-col items-stretch justify-start p-0 overflow-hidden">
                <div className="w-full h-full relative z-10 flex flex-col p-6 md:p-12 overflow-y-auto no-scrollbar">
                    
                    {/* Centered Hero Area */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight drop-shadow-2xl">
                                𝐖𝐢𝐫𝐞𝐅𝐫𝐚𝐦𝐞𝐀𝐈 𝐒𝐭𝐮𝐝𝐢𝐨<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight via-purple-400 to-blue-500">From Idea to Full Product</span>
                            </h1>
                            <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                                Where should we begin? Input your vision below.
                            </p>
                        </motion.div>
                    </div>

                    {/* Pill-Shaped Chat Input Bar */}
                    <div className="w-full max-w-4xl mx-auto mt-auto pb-6">
                        <form onSubmit={handleSubmit} className="relative group">
                            {/* The Pill Bar */}
                            <div className="bg-[#151518] border border-white/10 rounded-[2.5rem] p-4 flex items-end gap-3 shadow-2xl focus-within:border-highlight/50 transition-all">
                                {/* Left Icon: Plus */}
                                <button
                                    type="button"
                                    className="p-2.5 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                                >
                                    <Plus size={20} />
                                </button>

                                {/* Input Area */}
                                <textarea
                                    value={formData.idea}
                                    onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit(e))}
                                    placeholder="Message WireFrameAI..."
                                    rows={1}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-200 text-lg resize-none py-2 placeholder-gray-600 no-scrollbar max-h-48"
                                    required
                                />

                                {/* Right Icons */}
                                <div className="flex items-center gap-2 mb-0.5">
                                    <button
                                        type="button"
                                        className="p-2.5 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <Mic size={20} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!formData.idea.trim()}
                                        className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                                            formData.idea.trim() 
                                            ? 'bg-white text-black hover:bg-gray-200 shadow-lg' 
                                            : 'bg-white/5 text-gray-700'
                                        }`}
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Privacy / Hint Text */}
                            <p className="mt-3 text-center text-[10px] text-gray-700 font-medium tracking-wider uppercase">
                                WireFrameAI can make mistakes. Verify important info.
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default IdeaForm;
