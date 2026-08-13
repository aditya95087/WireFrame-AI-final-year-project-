import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, RefreshCcw } from 'lucide-react';
import { generateChatStreamingResponse } from '../services/gemini';

const ChatAssistant = () => {
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: "Hello! I'm your WireFrameAI Assistant. How can I help you navigate the platform or build your project today?" 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        const currentMessages = [...messages, userMessage];
        
        setMessages(currentMessages);
        setInput('');
        setIsLoading(true);

        // Add an empty assistant message to be filled by the stream
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        try {
            await generateChatStreamingResponse(currentMessages, (fullText) => {
                setMessages(prev => {
                    const updated = [...prev];
                    if (updated.length > 0) {
                        updated[updated.length - 1].content = fullText;
                    }
                    return updated;
                });
            });
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => {
                const updated = [...prev];
                if (updated.length > 0) {
                    updated[updated.length - 1].content = "I'm having a bit of trouble connecting right now. Please try again or check your API key.";
                }
                return updated;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetChat = () => {
        setMessages([{ 
            role: 'assistant', 
            content: "Hello! I'm your WireFrameAI Assistant. How can I help you navigate the platform or build your project today?" 
        }]);
    };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-[#0F0F12]/80 backdrop-blur-xl shadow-2xl flex flex-col h-[600px]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Bot size={22} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            WireFrameAI Support
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        </h3>
                        <p className="text-xs text-gray-400">Powered by Gemini AI • Always Online</p>
                    </div>
                </div>
                <button 
                    onClick={resetChat}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    title="Reset Chat"
                >
                    <RefreshCcw size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide scroll-smooth"
            >
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                msg.role === 'user' 
                                ? 'bg-purple-500/20 text-purple-400' 
                                : 'bg-blue-500/20 shadow-lg shadow-blue-500/10'
                            }`}>
                                {msg.role === 'user' ? <User size={16} /> : <img src="/icon.png" alt="AI" className="w-5 h-5 object-contain" />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user'
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-lg'
                                : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    </motion.div>
                ))}
                
                {/* Typing Indicator */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-3 max-w-[80%] items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">
                                    <img src="/icon.png" alt="AI" className="w-4 h-4 object-contain" />
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <form 
                onSubmit={handleSend}
                className="p-6 border-t border-white/5 bg-white/[0.02]"
            >
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about WireFrameAI..."
                        disabled={isLoading}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-3 text-center uppercase tracking-widest font-bold">
                    System Response Time: ~1.2s • AI can make mistakes
                </p>
            </form>
        </div>
    );
};

export default ChatAssistant;
