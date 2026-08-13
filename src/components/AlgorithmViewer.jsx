import React from 'react';
import { Cpu, Activity } from 'lucide-react';

const AlgorithmViewer = ({ algorithms }) => {
    return (
        <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <Cpu size={20} className="text-highlight" />
                <h3 className="text-xl font-bold text-white">Key Algorithms</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {algorithms.map((algo, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{algo.name}</h4>
                            <span className="text-xs font-mono bg-highlight/20 text-highlight px-2 py-1 rounded">
                                {algo.complexity}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {algo.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlgorithmViewer;
