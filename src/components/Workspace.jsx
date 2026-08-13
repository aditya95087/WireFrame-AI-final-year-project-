import React, { useState, useEffect } from 'react';
import { LayoutTemplate, GitGraph, FileText, Download, RefreshCw, Database, Cpu, ClipboardList, BookOpen, Home, ArrowLeft, Search, ListChecks, Code2, X, CheckCircle2, AlertCircle, Lightbulb, Image as ImageIcon, Loader2 } from 'lucide-react';
import WireframeCanvas from './WireframeCanvas';
import TechSpec from './TechSpec';
import AlgorithmViewer from './AlgorithmViewer';
import ProjectPhases from './ProjectPhases';
import DocumentationViewer from './DocumentationViewer';
import { downloadPDF, downloadWord, downloadMarkdown } from '../utils/exportUtils';


const Workspace = ({ data, onRegenerate, onHome }) => {
    const [activeTab, setActiveTab] = useState('research'); // Default to research
    const [components, setComponents] = useState(data.wireframeData);

    const getTabIcon = (id) => {
        const icons = {
            'research': <Search size={20} />,
            'wireframe': <LayoutTemplate size={20} />,
            'er': <Database size={20} />,
            'flow': <GitGraph size={20} />,
            'algo': <Cpu size={20} />,
            'phases': <ListChecks size={20} />,
            'spec': <Code2 size={20} />,
            'docs': <FileText size={20} />
        };
        return icons[id] || <FileText size={20} />;
    };

    const allTabs = [
        { id: 'research', label: 'Research' },
        { id: 'wireframe', label: 'Wireframe' },
        { id: 'algo', label: 'Algorithms' },
        { id: 'phases', label: '7 Phases' },
        { id: 'spec', label: 'Tech Spec' },
        { id: 'docs', label: 'Guide' }
    ];

    const tabs = data.relevantTabs 
        ? allTabs.filter(t => data.relevantTabs.includes(t.id))
        : allTabs;

    useEffect(() => {
        console.log("Workspace Received Data:", Object.keys(data));
    }, [data]);

    return (
        <div className="min-h-screen bg-black/95 p-6 md:p-12 font-sans text-gray-300 selection:bg-highlight/30">
            <button
                onClick={onHome}
                className="fixed top-8 left-8 z-50 p-3 bg-[#0F0F12] border border-white/10 rounded-full hover:bg-white/5 transition-all text-gray-400 hover:text-white"
                title="Back to Home"
            >
                <ArrowLeft size={24} />
            </button>

            <div className="w-full space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0F0F12] border border-white/5 rounded-2xl p-8">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">{data.concept.title}</h1>
                        <p className="text-gray-400 mb-2">{data.concept.description}</p>
                    </div>
                    {/* Export Options */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mr-2">Export:</span>
                        <button
                            onClick={() => downloadPDF(data)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-all shadow-sm"
                            title="Export as PDF"
                        >
                            <Download size={16} /> PDF
                        </button>
                        <button
                            onClick={() => downloadWord(data)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium transition-all shadow-sm"
                            title="Export as Word Document"
                        >
                            <Download size={16} /> DOC
                        </button>
                        <button
                            onClick={() => downloadMarkdown(data)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-sm font-medium transition-all shadow-sm"
                            title="Export as Markdown"
                        >
                            <FileText size={16} /> MD
                        </button>
                    </div>
                </header>

                {/* Mock Data Warning */}


                {/* Tabs Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide sticky top-0 z-40 bg-black/95 py-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                                ${activeTab === tab.id
                                    ? 'bg-highlight text-white shadow-lg shadow-highlight/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {getTabIcon(tab.id)}
                            <span className="capitalize">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[600px]">
                    {activeTab === 'research' && data.workshop && (
                        <div className="space-y-6">
                            {/* Workshop Header */}
                            <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                        <Search size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Research Workshop Report</h2>
                                </div>

                                <div className="prose prose-invert max-w-none space-y-8">
                                    {/* 1. Idea Overview */}
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                                        <h3 className="text-lg font-semibold text-white mb-2">1. Idea Overview</h3>
                                        <p className="text-gray-300 leading-relaxed">{data.workshop.ideaOverview || data.workshop.overview}</p>
                                    </div>

                                    {/* 2. Research Summary */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-400 mb-2">2. Internet Research Summary</h3>
                                        <p className="text-gray-300 leading-relaxed">{data.workshop.researchSummary}</p>
                                    </div>

                                    {/* 3. Existing Solutions */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">3. Existing Solutions & Approaches</h3>
                                        <ul className="space-y-2">
                                            {data.workshop.existingSolutions?.map((item, i) => (
                                                <li key={i} className="flex gap-2 text-sm text-gray-300 bg-black/20 p-2 rounded">
                                                    <span className="text-gray-500">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* 4. Pros & Cons */}
                                        <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                            <h3 className="text-lg font-semibold text-highlight mb-4 flex items-center gap-2">
                                                <CheckCircle2 size={18} /> Pros & Cons
                                            </h3>
                                            <ul className="space-y-3">
                                                {data.workshop.prosAndCons?.map((item, i) => (
                                                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                                                        <span className={item.toLowerCase().includes('pro:') ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                                                            {item.toLowerCase().includes('pro:') ? '+' : '-'}
                                                        </span>
                                                        {item.replace(/pro:|con:/i, '').trim()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* 5. Gaps & Opportunities */}
                                        <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                                                <AlertCircle size={18} /> Gaps & Opportunities
                                            </h3>
                                            <ul className="space-y-3">
                                                {data.workshop.gapsAndOpportunities?.map((item, i) => (
                                                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                                                        <span className="text-amber-500">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* 6. Best Practices */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">6. Best Practices</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {data.workshop.bestPractices?.map((item, i) => (
                                                <div key={i} className="flex gap-2 text-sm text-gray-300 border border-white/5 p-3 rounded bg-white/5">
                                                    <span className="text-green-400">✓</span>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 7. Action Plan */}
                                    <div className="mt-6 bg-green-500/5 rounded-xl p-5 border border-green-500/20">
                                        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                            <Lightbulb size={18} /> 7. Final Action Plan
                                        </h3>
                                        <div className="space-y-3">
                                            {data.workshop.actionPlan?.map((step, i) => (
                                                <div key={i} className="flex gap-3 text-sm text-gray-300">
                                                    <span className="font-bold text-green-500/50 text-lg">{i + 1}</span>
                                                    <p className="pt-1">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-green-500/20">
                                            <h4 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">Strategic Recommendation</h4>
                                            <p className="text-gray-300 text-sm leading-relaxed italic">"{data.workshop.finalRecommendation}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Real Website Samples Section (Moved to Research Tab) */}
                            {data.realWorldSamples && data.realWorldSamples.length > 0 && (
                                <div className="mt-8 lg:col-span-3 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-white/10 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                            <BookOpen size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Real-world Competitors & Samples</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {data.realWorldSamples.map((sample, idx) => (
                                            <a
                                                key={idx}
                                                href={sample.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-4 rounded-lg bg-black/40 border border-white/5 hover:border-blue-500/30 hover:bg-white/5 transition-all group shadow-sm"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">{sample.name}</h4>
                                                    <span className="text-gray-500 text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                                                </div>
                                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{sample.description}</p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'wireframe' && (
                        <WireframeCanvas components={components} setComponents={setComponents} />
                    )}
                    {activeTab === 'algo' && (
                        <AlgorithmViewer algorithms={data.algorithms} />
                    )}
                    {activeTab === 'phases' && (
                        <ProjectPhases phases={data.projectPhases} />
                    )}
                    {activeTab === 'spec' && (
                        <TechSpec spec={data.techSpec} milestones={data.milestones} />
                    )}
                    {activeTab === 'docs' && (
                        <DocumentationViewer doc={data.documentation} />
                    )}
                </div>


            </div>
        </div>
    );
};

export default Workspace;
