import React from 'react';
import { motion } from 'framer-motion';

const ProcessSection = () => {
    const processes = [
        {
            id: '01',
            title: 'Deep Research',
            description: 'We dive deep into your product vision, analyzing market trends and user behavior to ensure every feature serves a purpose.',
            tag: 'Discovery'
        },
        {
            id: '02',
            title: 'Proper Planning',
            description: 'Architecture is our obsession. We build robust structural foundations that scale with your ambitions, from day one.',
            tag: 'Strategy'
        },
        {
            id: '03',
            title: 'Diagram Making',
            description: 'Visualizing logic is key. We generate intuitive flows and system diagrams that make complex processes crystal clear.',
            tag: 'Logic'
        },
        {
            id: '04',
            title: 'Smart Programming',
            description: 'We don\'t just write code; we craft it. Optimized, clean, and documentation-first programming for modern systems.',
            tag: 'Engineering'
        },
        {
            id: '05',
            title: 'Modern Web Design',
            description: 'Aesthetics matter. We design premium, state-of-the-art interfaces that wow your users and elevate your brand.',
            tag: 'UI/UX'
        },
        {
            id: '06',
            title: 'AI Image-Generation',
            description: 'The final piece of the puzzle. We integrate cutting-edge AI to refine, polish, and synthesize your entire project.',
            tag: 'Refining'
        }
    ];

    return (
        <section className="py-24 bg-[#07070A] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-heading font-bold text-white mb-4 tracking-tight"
                    >
                         Things we <span className=" text-transparent bg-clip-text bg-gradient-to-r from-highlight to-blue-500">Provide.</span>
                    </motion.h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                    {processes.map((process, index) => (
                        <motion.div 
                            key={process.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="group"
                        >
                            <div className="w-full h-[1px] bg-white/10 mb-8 overflow-hidden">
                                <motion.div 
                                    initial={{ x: '-100%' }}
                                    whileInView={{ x: '0%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                    className="w-full h-full bg-highlight"
                                />
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-highlight shadow-[0_0_8px_#8A2BE2]" />
                                    <span className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">{process.id}</span>
                                </div>
                                <span className="text-[10px] font-mono text-gray-700 tracking-[0.2em] uppercase">{process.tag}</span>
                            </div>

                            <h3 className="text-3xl font-heading font-bold text-white mb-4 group-hover:text-highlight transition-colors duration-300">
                                {process.title}
                            </h3>
                            
                            <p className="text-gray-400 leading-relaxed max-w-md">
                                {process.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-highlight/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
};

export default ProcessSection;
