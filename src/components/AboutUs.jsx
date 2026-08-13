import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Shield } from 'lucide-react';

const AboutUs = () => {
    const features = [
        {
            icon: <Target className="w-8 h-8 text-blue-400" />,
            title: "Our Mission",
            description: "To democratize software design by making professional wireframing accessible to everyone through the power of AI."
        },
        {
            icon: <Users className="w-8 h-8 text-purple-400" />,
            title: "Who We Are",
            description: "A passionate team of developers, designers, and AI researchers dedicated to transforming how digital products are built."
        },
        {
            icon: <Shield className="w-8 h-8 text-green-400" />,
            title: "Our Values",
            description: "We believe in innovation, transparency, and user-centric design. Your creativity is our priority."
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">WireframeAI</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        We're building the future of product design, where ideas transform into reality in seconds.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors"
                        >
                            <div className="bg-white/5 rounded-xl p-4 w-fit mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 p-12 text-center"
                >
                    <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-6">Join Our Journey</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                            We're just getting started. Be part of the revolution in AI-assisted design and help us shape the future of software development.
                        </p>
                        <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                            View Careers
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutUs;
