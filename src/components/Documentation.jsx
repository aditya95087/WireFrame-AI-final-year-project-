import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Layers, Zap, Search, LayoutTemplate, Database, GitGraph, Cpu, ListChecks, FileText, Download, Sparkles, Globe, Terminal, Shield, Zap as ZapIcon, Target, Rocket, ChevronRight } from 'lucide-react';

const Documentation = () => {
    const sections = [
        {
            id: "all-in-one",
            title: "The All-in-One Philosophy",
            icon: <Globe className="w-5 h-5 text-highlight" />,
            intro: "WireframeAI solves the 'Tool Fragmentation' problem. Instead of jumping between Figma, Miro, ChatGPT, and Midjourney, we provide a unified ecosystem for product inception.",
            content: [
                {
                    subtitle: "Real-World Problem Solving",
                    text: "Building a digital product usually takes weeks of fragmented planning. WireframeAI reduces this to minutes by merging deep internet research, technical architecture, and visual wireframing into a single, cohesive workflow."
                }
            ]
        },
        {
            id: "deepsearch",
            title: "Research Workshop (DeepSearch)",
            icon: <Search className="w-5 h-5 text-blue-400" />,
            intro: "Our DeepSearch engine doesn't just search; it analyzes the current market landscape to give you a strategic advantage.",
            content: [
                {
                    subtitle: "Market Gaps & Opportunities",
                    text: "Identify exactly where existing competitors are failing. Our AI-driven workshop reports highlight underserved niches and specific technical gaps you can exploit."
                },
                {
                    subtitle: "Real-World Competitor Samples",
                    text: "Every project includes a curated list of live websites and apps that align with your vision. This provides instant benchmarking for your UI/UX decisions."
                }
            ]
        },
        {
            id: "wireframing",
            title: "Intelligent Wireframing",
            icon: <LayoutTemplate className="w-5 h-5 text-purple-400" />,
            intro: "Transform vague thoughts into structured UI components instantly.",
            content: [
                {
                    subtitle: "Interactive Canvas",
                    text: "Move beyond static images. Our wireframes are interactive, component-based structures that you can manipulate, rename, and refactor in real-time."
                },
                {
                    subtitle: "AI Component Reasoning",
                    text: "The AI doesn't just place buttons; it reasons through the user journey to suggest the most efficient layouts for your specific platform (Mobile vs. Desktop)."
                }
            ]
        },
        {
            id: "diagramming",
            title: "Architecture & Diagrams",
            icon: <Database className="w-5 h-5 text-green-400" />,
            intro: "Visualizing complex logic with industry-standard Mermaid syntax.",
            content: [
                {
                    subtitle: "ER Diagrams (Database)",
                    text: "Automatically generate relational data models. Understand your data relationships, primary keys, and foreign keys before you write a single line of SQL."
                },
                {
                    subtitle: "User Flow Mapping",
                    text: "Visualize how a user navigates through your app. Our flowcharts map out the entire decision tree, from login screens to deep-feature interactions."
                }
            ]
        },
        {
            id: "export",
            title: "Fastest Export Engine",
            icon: <Download className="w-5 h-5 text-red-400" />,
            intro: "Universal compatibility for your documentation needs.",
            content: [
                {
                    subtitle: "Unified PDF/Word/Markdown",
                    text: "Export your entire workspace — including all diagrams, tech specs, and research — into professional documents in under 2 seconds. Perfect for client handovers or internal alignment."
                }
            ]
        },
        {
            id: "roadmap",
            title: "Future Scope & Roadmap",
            icon: <Rocket className="w-5 h-5 text-orange-400" />,
            intro: "We are building the future of AI-assisted software engineering.",
            content: [
                {
                    subtitle: "Q3 2026: Multi-Stage Collaboration",
                    text: "Real-time multiplayer editing for teams, allowing stakeholders to brainstorm and build together in a shared studio environment."
                },
                {
                    subtitle: "Q4 2026: One-Click Code Generation",
                    text: "Direct export to production-ready React (Next.js) and Tailwind CSS codebases, including full database schema migrations."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-highlight/30 pt-10 pb-24 overflow-x-hidden ">
            <div className="max-w-[1400px] mx-auto px-0 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Sidebar: Navigation */}
                    <aside className="lg:w-80 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-32 space-y-10">
                            <div>
                                <h3 className="text-xs font-black text-gray-700 uppercase tracking-[0.3em] mb-6">
                                    Product Documentation
                                </h3>
                                <ul className="space-y-4">
                                    {sections.map((section) => (
                                        <li key={section.id}>
                                            <a
                                                href={`#${section.id}`}
                                                className="group flex items-center gap-3 text-sm font-bold text-gray-500 hover:text-white transition-all"
                                            >
                                                <span className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-highlight/30 transition-all text-gray-600 group-hover:text-highlight">
                                                    {section.icon}
                                                </span>
                                                <span className="tracking-tight">{section.title}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Pro Badge Card */}
                            <div className="p-6 bg-highlight/5 border border-highlight/10 rounded-3xl space-y-3">
                                <div className="flex items-center gap-2 text-highlight text-xs font-black uppercase tracking-widest">
                                    <ZapIcon size={14} /> Power User Tips
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                    Use the "DeepSearch" tab in your workspace to find real websites similar to your current project concept.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 max-w-4xl">
                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 mb-20"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-highlight/10 rounded-full border border-highlight/20 text-highlight text-[10px] font-black uppercase tracking-[0.2em]">
                                <Sparkles size={12} /> The Future of Prototyping
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                                Built for Founders,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">Optimized for Speed</span>
                            </h1>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl">
                                WireframeAI is an intelligent prototyping platform that transforms text into technical repositories, wireframes, and business logic in seconds.
                            </p>
                        </motion.div>

                        {/* Content Sections */}
                        <div className="space-y-24">
                            {sections.map((section, index) => (
                                <motion.section
                                    key={section.id}
                                    id={section.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="scroll-mt-32 space-y-8"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-highlight shadow-2xl">
                                                {section.icon}
                                            </span>
                                            <h2 className="text-2xl font-black text-white tracking-tight">{section.title}</h2>
                                        </div>
                                        <p className="text-gray-400 font-medium text-lg leading-relaxed">{section.intro}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.content.map((item, i) => (
                                            <div key={i} className="group p-8 bg-[#0A0A0C] border border-white/[0.05] rounded-[2.5rem] hover:border-highlight/30 transition-all shadow-xl shadow-black/40 h-full flex flex-col">
                                                <div className="flex items-start justify-between mb-6">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-highlight transition-colors">{item.subtitle}</h3>
                                                    <ChevronRight size={18} className="text-gray-800 group-hover:text-highlight group-hover:translate-x-1 transition-all" />
                                                </div>
                                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                                    {item.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {index !== sections.length - 1 && (
                                        <div className="pt-16 border-b border-white/[0.03]" />
                                    )}
                                </motion.section>
                            ))}
                        </div>

                        {/* Footer Help Card */}
                        <div className="mt-32 p-12 bg-gradient-to-br from-[#0A0A0C] to-black border border-white/[0.05] rounded-[3rem] text-center space-y-6 shadow-[0_0_50px_-10px_rgba(138,43,226,0.1)]">
                            <h2 className="text-3xl font-black text-white">Need technical help?</h2>
                            <p className="text-gray-500 font-medium max-w-lg mx-auto">
                                Our support team is available 24/7 for Enterprise users. Integration guides and API SDKs are available in the portal.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-200 transition-all shadow-xl shadow-white/5">
                                    Contact Support
                                </button>
                                <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all">
                                    View API Docs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentation;
