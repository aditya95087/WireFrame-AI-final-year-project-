import React from 'react';
import { BookOpen, Server, Map, ShieldCheck, Rocket } from 'lucide-react';

const DocumentationViewer = ({ doc }) => {
    return (
        <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-8 max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="border-b border-white/10 pb-8">
                <div className="flex items-center gap-3 mb-4">
                    <BookOpen size={32} className="text-highlight" />
                    <h1 className="text-3xl font-bold text-white">Project Documentation</h1>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                    {doc.executiveSummary}
                </p>
            </div>

            {/* System Architecture */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Server size={24} className="text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">System Architecture</h2>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-gray-300 leading-relaxed whitespace-pre-line">
                    {doc.systemArchitecture}
                </div>
            </section>

            {/* Development Roadmap */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Map size={24} className="text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Development Roadmap</h2>
                </div>
                <div className="space-y-6">
                    {doc.developmentRoadmap.map((phase, index) => (
                        <div key={index} className="relative pl-8 border-l-2 border-white/10 hover:border-highlight transition-colors">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0F0F12] border-2 border-highlight" />
                            <h3 className="text-xl font-semibold text-white mb-3">{phase.phase}</h3>
                            <ul className="space-y-2">
                                {phase.steps.map((step, i) => (
                                    <li key={i} className="text-gray-400 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testing Strategy */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={24} className="text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Testing Strategy</h2>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-gray-300 leading-relaxed whitespace-pre-line">
                    {doc.testingStrategy}
                </div>
            </section>

            {/* Deployment Guide */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Rocket size={24} className="text-orange-400" />
                    <h2 className="text-2xl font-bold text-white">Deployment & Launch</h2>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-gray-300 leading-relaxed whitespace-pre-line">
                    {doc.deploymentGuide}
                </div>
            </section>
        </div>
    );
};

export default DocumentationViewer;
