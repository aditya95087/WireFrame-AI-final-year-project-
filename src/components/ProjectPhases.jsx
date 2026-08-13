import React from 'react';
import { ClipboardList, CheckCircle2 } from 'lucide-react';

const ProjectPhases = ({ phases }) => {
    return (
        <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-8">
                <ClipboardList size={20} className="text-highlight" />
                <h3 className="text-xl font-bold text-white">Project Development Phases</h3>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {Object.entries(phases).map(([phaseNum, phase], index) => (
                    <div key={phaseNum} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0F0F12] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-gray-400 group-hover:text-highlight group-hover:border-highlight transition-colors">
                            <span className="font-mono font-bold text-sm">{phaseNum}</span>
                        </div>

                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-4 rounded-xl shadow hover:bg-white/10 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white">{phase.title}</h4>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">
                                {phase.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/20 p-2 rounded">
                                <CheckCircle2 size={12} className="text-green-500" />
                                <span className="font-medium">Deliverables:</span> {phase.deliverables}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectPhases;
