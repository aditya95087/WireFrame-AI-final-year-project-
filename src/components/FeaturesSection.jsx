import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Layout, Code, Share2 } from 'lucide-react';
import CurvedLoop from './CurvedLoop';

const features = [
    {
        icon: <Zap className="text-yellow-400" />,
        title: "Instant Generation",
        description: "Go from text description to full wireframe in seconds using advanced AI logic."
    },
    {
        icon: <Layout className="text-blue-400" />,
        title: "Interactive Wireframes",
        description: "Visualize your app structure with drag-and-drop editable components."
    },
    {
        icon: <Code className="text-green-400" />,
        title: "Technical Specs",
        description: "Get detailed database schemas, API endpoints, and tech stack recommendations."
    },
    {
        icon: <Share2 className="text-purple-400" />,
        title: "Export & Share",
        description: "Export your designs to code or share them with your team instantly."
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute top-20 left-0 w-full h-[500px] z-0 opacity-100 pointer-events-none">
                <CurvedLoop
                    marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
                    speed={3}
                    curveAmount={100}
                    direction="right"
                    interactive={true}
                    className="text-4xl font-bold text-white/20"
                />
            </div>

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Everything you need to <span className="text-highlight">start building</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Stop wasting time on manual wireframing. Let AI handle the heavy lifting while you focus on the product vision.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
