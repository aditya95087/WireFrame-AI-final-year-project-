import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Book, Settings, CreditCard, Shield } from 'lucide-react';
import ChatAssistant from './ChatAssistant';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        { id: 'all', name: 'All Topics', icon: null },
        { id: 'getting-started', name: 'Getting Started', icon: <Book className="w-5 h-5" /> },
        { id: 'account', name: 'Account', icon: <Settings className="w-5 h-5" /> },
        { id: 'billing', name: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
        { id: 'security', name: 'Security', icon: <Shield className="w-5 h-5" /> }
    ];

    const faqs = [
        {
            id: 1,
            category: 'getting-started',
            question: "How does the AI wireframe generation work?",
            answer: "Our AI analyzes your project description and requirements to generate a comprehensive wireframe structure, including component layouts, user flows, and technical specifications. It uses patterns from thousands of successful applications to suggest the best architecture for your needs."
        },
        {
            id: 2,
            category: 'account',
            question: "Can I collaborate with my team?",
            answer: "Yes! Team collaboration is available on our Pro and Enterprise plans. You can invite team members, share projects, and leave comments on wireframes in real-time."
        },
        {
            id: 3,
            category: 'billing',
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and wire transfers for Enterprise accounts."
        },
        {
            id: 4,
            category: 'getting-started',
            question: "Can I export my wireframes?",
            answer: "Absolutely. You can export your wireframes as PNG images, PDF documents, or even as React code snippets to jumpstart your development process."
        },
        {
            id: 5,
            category: 'security',
            question: "Is my data secure?",
            answer: "Security is our top priority. We use industry-standard encryption for all data in transit and at rest. Your project ideas are private and are never used to train our public AI models without your explicit permission."
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-white mb-6">
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">help?</span>
                    </h1>

                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* FAQs */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredFaqs.map((faq) => (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-semibold text-white">{faq.question}</span>
                                    {openFaq === faq.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openFaq === faq.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No results found for "{searchQuery}"
                        </div>
                    )}
                </div>

                {/* AI Assistant Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-24 space-y-12"
                >
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-2 shadow-lg shadow-blue-500/5">
                            <div className="h-4 object-contain" />
                            <span>Assistant</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">Still have questions?</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Our intelligent assistant is trained on everything WireFrameAI. 
                            Ask it about technical specs, diagram types, or project management.
                        </p>
                    </div>

                    <ChatAssistant />
                </motion.div>
            </div>
        </div>
    );
};

export default HelpCenter;
