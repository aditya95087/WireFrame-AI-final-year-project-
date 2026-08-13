import React from 'react';
import { FileCode, CheckSquare, Server, Database, Shield, Layout, ArrowRight, FolderTree, Terminal } from 'lucide-react';

const TechSpec = ({ spec, milestones }) => {
    const RenderStackItem = ({ data }) => {
        if (!data) return <span className="text-gray-500 italic">--</span>;
        
        if (typeof data === 'string') {
            return <span className="text-blue-100 font-mono text-sm bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20 shadow-sm w-full break-words whitespace-pre-wrap block">{data}</span>;
        }
        
        if (Array.isArray(data)) {
            return (
                <div className="flex flex-col gap-3 w-full mt-1">
                    {data.map((item, idx) => (
                        <div key={idx} className="flex flex-col bg-black/40 p-4 rounded-lg border border-white/5 shadow-inner">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="text-blue-100 font-mono text-sm font-bold break-words">{item.name}</span>
                                {item.isBest && (
                                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-widest font-bold shadow-sm">
                                        ✨ Best Choice
                                    </span>
                                )}
                            </div>
                            {item.reason && <p className="text-gray-400 text-xs leading-relaxed font-medium break-words">{item.reason}</p>}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const RenderDataModel = ({ model }) => {
        if (!model) return null;
        if (typeof model === 'string') {
             return <div className="relative bg-[#0d0d12] p-5 rounded-xl text-sm text-purple-200/90 font-mono border border-white/10 shadow-lg leading-relaxed whitespace-pre-wrap break-words selection:bg-purple-500/30">{model}</div>;
        }
        if (Array.isArray(model)) {
             return (
                 <div className="flex flex-col gap-3 relative bg-[#0d0d12] p-5 rounded-xl border border-white/10 shadow-lg selection:bg-purple-500/30">
                     {model.map((m, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0 gap-3 w-full overflow-hidden">
                              <span className="text-purple-300 font-bold font-mono text-sm bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 sm:w-1/3 shrink-0 break-words">{m.entity}</span>
                              <span className="text-purple-200/70 font-mono text-xs sm:text-right break-words mt-1 leading-relaxed flex-1 min-w-0">{m.attributes}</span>
                          </div>
                     ))}
                 </div>
             );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
            {/* Technical Specification */}
            <div className="bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/10 hover:border-highlight/30 transition-all duration-300 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                    <div className="p-2.5 bg-highlight/10 rounded-xl text-highlight">
                         <FileCode size={24} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight">Technical Spec</h3>
                </div>

                <div className="space-y-8">
                    {/* Stack Recommendation */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Server size={14} className="text-blue-400" /> Stack Recommendation
                        </h4>
                        <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-2 shadow-inner w-full overflow-hidden">
                            {['Frontend', 'Backend', 'Database'].map((layer) => (
                                <div key={layer} className="flex flex-col gap-2 p-3 hover:bg-white/5 rounded-xl transition-colors border-b border-white/5 last:border-0 w-full overflow-hidden">
                                    <span className="text-gray-400 text-xs font-bold flex items-center gap-2 uppercase tracking-widest shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                        {layer}
                                    </span>
                                    <div className="w-full min-w-0">
                                         <RenderStackItem data={spec[layer.toLowerCase()]} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security & Auth */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Shield size={14} className="text-emerald-400" /> Security & Auth
                        </h4>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5">
                            {typeof spec.auth === 'string' ? (
                                <p className="text-emerald-100/80 text-sm leading-relaxed font-medium">
                                    {spec.auth}
                                </p>
                            ) : (
                                <RenderStackItem data={spec.auth} />
                            )}
                        </div>
                    </div>

                    {/* Database Design */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Database size={14} className="text-purple-400" /> Database Design & Models
                        </h4>
                        <div className="relative group mt-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-xl opacity-30 transition-opacity group-hover:opacity-60"></div>
                            <RenderDataModel model={spec.dataModel} />
                        </div>
                    </div>

                    {/* File Structure */}
                    {spec.fileStructure && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FolderTree size={14} className="text-amber-400" /> Project Structure
                            </h4>
                            <div className="bg-[#0b0b10] rounded-xl pt-0 p-5 border border-white/10 shadow-inner overflow-hidden relative">
                                <div className="flex items-center gap-2 bg-[#1a1a24] border-b border-white/10 p-3 mb-4 rounded-t-xl -mx-5">
                                    <Terminal size={14} className="text-gray-400 ml-2" />
                                    <span className="text-xs font-mono text-gray-400 font-bold uppercase tracking-widest">Bash</span>
                                </div>
                                <pre className="text-[13px] text-emerald-400/90 font-mono overflow-auto scrollbar-hide whitespace-pre leading-relaxed pl-2 bg-transparent border-none focus:outline-none">
                                    <code>{spec.fileStructure}</code>
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Milestones / Build Plan */}
            <div className="bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/10 hover:border-highlight/30 transition-all duration-300 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                     <div className="p-2.5 bg-highlight/10 rounded-xl text-highlight">
                         <CheckSquare size={24} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight">Build Plan</h3>
                </div>

                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[1.35rem] before:w-0.5 before:bg-white/5">
                    {milestones.map((milestone, index) => (
                        <div key={index} className="relative flex gap-6 p-5 bg-black/20 rounded-xl border border-white/5 hover:border-highlight/30 hover:bg-white/[0.02] transition-all duration-300 group shadow-md z-10">
                            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#1a1a24] border border-white/10 flex items-center justify-center text-highlight font-bold text-lg shadow-sm group-hover:scale-105 group-hover:bg-highlight group-hover:text-white transition-all">
                                {index + 1}
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h4 className="text-gray-100 font-semibold mb-1 text-lg tracking-tight group-hover:text-white transition-colors">{milestone.title}</h4>
                                <p className="text-sm text-gray-400 leading-relaxed mb-3">{milestone.description}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-auto">
                                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1 font-medium shadow-sm">
                                        ⏱ {milestone.duration}
                                    </span>
                                    <span className={`text-xs px-3 py-1 rounded-full border shadow-sm font-medium tracking-wide ${milestone.complexity === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                        milestone.complexity === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        }`}>
                                        ⚡ {milestone.complexity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Learning Path */}
            {spec.learningPath && (
                <div className="col-span-1 lg:col-span-2 bg-gradient-to-b from-[#12121A] to-[#0A0A0F] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 rounded-2xl p-8 shadow-xl mt-4">
                    <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                             <Layout size={24} />
                        </div>
                        <h3 className="text-2xl font-semibold text-white tracking-tight">Development Roadmap & Resources</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['beginner', 'intermediate', 'advanced'].map((level) => {
                            const data = spec.learningPath[level];
                            const colorScheme = level === 'beginner' ? {text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', gradient: 'from-emerald-500/5 to-transparent'} :
                                level === 'intermediate' ? {text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20', gradient: 'from-amber-500/5 to-transparent'} :
                                    {text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/5', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20', gradient: 'from-rose-500/5 to-transparent'};

                            return (
                                <div key={level} className={`relative flex flex-col rounded-2xl border ${colorScheme.border} bg-gradient-to-b ${colorScheme.gradient} p-6 shadow-sm hover:shadow-md transition-shadow group overflow-hidden`}>
                                    {/* Decorative subtle background circle */}
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${colorScheme.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full">
                                        <h4 className={`text-xl font-bold mb-3 capitalize tracking-tight flex items-center gap-2 ${colorScheme.text}`}>
                                            {data.level === 'Beginner' ? '🌱' : data.level === 'Intermediate' ? '🚀' : '🏆'} {data.level}
                                        </h4>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-6 min-h-[3rem] font-medium">{data.description}</p>

                                        <div className="space-y-6 flex-1 flex flex-col">
                                            {/* Tools */}
                                            <div>
                                                <h5 className="text-[10px] font-bold text-gray-400/80 uppercase tracking-widest mb-3">Recommended Tools</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.tools.map((tool, i) => (
                                                        <span key={i} className={`text-xs px-2.5 py-1 rounded-md border text-center font-medium shadow-sm transition-transform hover:-translate-y-0.5 ${colorScheme.badge}`}>
                                                            {tool}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Resources */}
                                            <div className="flex-1">
                                                <h5 className="text-[10px] font-bold text-gray-400/80 uppercase tracking-widest mb-3">Key Resources</h5>
                                                <ul className="text-sm text-gray-300 space-y-2">
                                                    {data.resources.map((res, i) => (
                                                        <li key={i} className="flex items-start gap-2 group/item">
                                                            <ArrowRight size={14} className={`mt-0.5 shrink-0 opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all ${colorScheme.text}`} />
                                                            <span className="group-hover/item:text-white transition-colors cursor-default">{res}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Hints */}
                                            <div className="pt-5 mt-auto border-t border-white/5 relative">
                                                <div className={`absolute left-0 top-0 w-16 h-px bg-gradient-to-r ${colorScheme.text.replace('text', 'from')} to-transparent opacity-50`}></div>
                                                <p className="text-xs text-gray-400 bg-black/20 p-3 rounded-xl border border-white/5 inline-flex items-start gap-2 w-full font-medium shadow-inner">
                                                    <span className="text-base leading-none -mt-0.5">💡</span>
                                                    <span className="leading-relaxed opacity-90">{data.hints}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechSpec;
