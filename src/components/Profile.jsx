import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, ArrowLeft, LogOut, Shield, Award, Zap, Camera, Layout, FileText, Activity, ExternalLink, Settings, Bell, ChevronRight, Sparkles, Clock, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalWorkspaces: 0,
        totalDiagrams: 0,
        productivity: '0%',
        latestProject: null
    });
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);

    useEffect(() => {
        if (!isLogOpen || !user || !user._id) return;
        const fetchLogs = async () => {
            setLogsLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/api/activity/${user._id}`);
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data);
                }
            } catch (e) {
                console.error("Failed to fetch logs", e);
            } finally {
                setLogsLoading(false);
            }
        };
        fetchLogs();
    }, [isLogOpen, user]);

    useEffect(() => {
        if (!user) return;
        try {
            const rawHistory = localStorage.getItem('workspace_history');
            const history = Array.isArray(JSON.parse(rawHistory || '[]')) ? JSON.parse(rawHistory || '[]') : [];
            
            // Calculate total diagrams (ER + Wireframe Datasets)
            const totalDiagrams = history.reduce((acc, curr) => {
                if (!curr) return acc;
                let count = 0;
                if (curr.erDiagramString) count++;
                if (curr.wireframeData && Array.isArray(curr.wireframeData)) count += curr.wireframeData.length;
                if (curr.milestones) count++; 
                return acc + count;
            }, 0);

            setStats({
                totalWorkspaces: history.length,
                totalDiagrams: totalDiagrams,
                productivity: history.length > 0 ? `${Math.min(history.length * 25, 100)}%` : '0%',
                latestProject: history[0] || null
            });
        } catch (e) {
            console.error("Failed to load profile insights", e);
            setStats({
                totalWorkspaces: 0,
                totalDiagrams: 0,
                productivity: '0%',
                latestProject: null
            });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-400">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 border-4 border-highlight border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xl font-bold text-white tracking-tight">Access Restricted</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all shadow-xl shadow-white/5"
                    >
                        Return to Authentication
                    </button>
                </div>
            </div>
        );
    }

    const userDisplay = {
        name: user.username || user.name || 'User',
        email: user.email || 'No email provided',
        joined: user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'April 2024',
        picture: user.picture || null
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans tracking-wide selection:bg-highlight/30">
            {/* Top Navigation Bar - Professional Dashboard Style */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05] z-50 px-8 flex items-center justify-between">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="uppercase tracking-[0.2em] text-[11px]">Back to Workspace</span>
                </button>

                <div className="flex items-center gap-6">
                    <button className="text-gray-500 hover:text-white transition-colors"><Bell size={18} /></button>
                    <button className="text-gray-500 hover:text-white transition-colors"><Settings size={18} /></button>
                    <div className="h-8 w-[1px] bg-white/[0.05]" />
                    <button 
                        onClick={onLogout}
                        className="flex items-center gap-2 text-red-500/80 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-12 gap-8"
                >
                    {/* Left Column: Profile Card */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <motion.div variants={itemVariants} className="bg-[#0A0A0C] border border-white/[0.05] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                               <ExternalLink size={16} className="text-highlight" />
                           </div>
                           
                           <div className="flex flex-col items-center text-center space-y-6">
                                <div className="relative group">
                                    <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-tr from-highlight to-blue-500 p-1 shadow-2xl shadow-highlight/20">
                                        <div className="w-full h-full rounded-[2rem] bg-[#0A0A0C] flex items-center justify-center overflow-hidden">
                                            {userDisplay.picture ? (
                                                <img src={userDisplay.picture} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-highlight to-blue-400">
                                                    {userDisplay.name[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl">
                                        <Camera size={18} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-3xl font-black tracking-tight text-white">{userDisplay.name}</h1>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="px-3 py-1 bg-highlight/10 text-highlight text-[10px] font-black uppercase tracking-widest rounded-full border border-highlight/20">
                                            Verified Hub
                                        </span>
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                                            Beta Tier
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium pt-2">{userDisplay.email}</p>
                                </div>

                                <div className="w-full pt-4 space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-[#151518] rounded-2xl border border-white/[0.03]">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Award size={18} className="text-highlight" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Level 12 Architect</span>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-700" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-[#151518] rounded-2xl border border-white/[0.03]">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Shield size={18} className="text-green-500" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Pro Security Active</span>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-700" />
                                    </div>
                                </div>
                           </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Stats and Info */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Stats Cluster */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Active Projects', value: stats.totalWorkspaces, icon: <Layout size={20} className="text-blue-400" /> },
                                { label: 'Generated Assets', value: stats.totalDiagrams, icon: <Sparkles size={20} className="text-highlight" /> },
                                { label: 'System PWA Rank', value: stats.productivity, icon: <Zap size={20} className="text-yellow-400" /> }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    variants={itemVariants}
                                    className="bg-[#0A0A0C] border border-white/[0.05] rounded-3xl p-6 relative overflow-hidden"
                                >
                                    <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.05] w-fit mb-6">
                                        {stat.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">{stat.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Professional Dashboard Content */}
                        <motion.div variants={itemVariants} className="bg-[#0A0A0C] border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-8 md:p-10">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <Activity size={20} className="text-highlight" /> Operational History
                                    </h2>
                                    <button onClick={() => setIsLogOpen(true)} className="text-xs font-bold text-highlight hover:underline tracking-widest uppercase">View Full Log</button>
                                </div>

                                {stats.latestProject ? (
                                    <div className="space-y-6">
                                        <div className="p-6 bg-[#151518] border border-white/[0.05] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-highlight/30 transition-all cursor-pointer">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-highlight/10 flex items-center justify-center text-highlight">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white">{stats.latestProject.concept?.title || 'Untitled System'}</h4>
                                                    <p className="text-xs text-gray-500 font-medium">{stats.latestProject.concept?.description || 'No description available.'}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate('/workspace')}
                                                className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                                            >
                                                Open Workspace
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center border-2 border-dashed border-white/[0.05] rounded-3xl space-y-4">
                                        <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto text-gray-700">
                                            <Clock size={20} />
                                        </div>
                                        <p className="text-gray-600 font-medium">No recent projects detected in this terminal.</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-10 border-t border-white/[0.05]">
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 pl-1">Infrastructure</h3>
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Platform Sync</span>
                                                <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                                                    <div className="h-full bg-highlight w-[85%] rounded-full shadow-[0_0_10px_#8A2BE2]" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">AI Synthesis</span>
                                                <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 w-[62%] rounded-full shadow-[0_0_10px_#3b82f6]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 pl-1">Current Session</h3>
                                        <div className="flex items-start gap-4 p-4 bg-[#151518] rounded-2xl">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                <Shield size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-white uppercase tracking-tight">Security Check: Optimal</p>
                                                <p className="text-[10px] text-gray-500 font-medium pt-1">Encryption protocol v4.2 active.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            {/* Logs Modal */}
            <AnimatePresence>
                {isLogOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setIsLogOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-4xl max-h-[85vh] bg-[#0A0A0C] border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-[#0A0A0C] z-10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center text-highlight">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">Full Search Logs</h3>
                                        <p className="text-xs text-gray-500 font-medium">All queries generated through this account</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsLogOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#050505]">
                                {logsLoading ? (
                                    <div className="flex flex-col items-center justify-center h-40 space-y-4">
                                        <div className="w-8 h-8 border-2 border-highlight border-t-transparent rounded-full animate-spin" />
                                        <p className="text-gray-500 text-sm font-medium">Fetching secure logs...</p>
                                    </div>
                                ) : logs.length > 0 ? (
                                    <div className="space-y-4">
                                        {logs.map((log, idx) => (
                                            <div key={idx} className="p-5 bg-[#0A0A0C] border border-white/[0.05] rounded-2xl hover:border-highlight/30 transition-all flex items-start gap-4 shadow-lg group">
                                                <div className="mt-1">
                                                    {log.activityType === 'web_design' ? (
                                                        <Layout size={18} className="text-highlight group-hover:scale-110 transition-transform" />
                                                    ) : (
                                                        <FileText size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white mb-2 leading-relaxed">{log.prompt}</p>
                                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                                        <span className={log.activityType === 'web_design' ? 'text-highlight' : 'text-blue-400'}>
                                                            {log.activityType === 'web_design' ? 'Web Design' : 'Code Generator'}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-60 space-y-4 text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center text-gray-700 mb-2">
                                            <Search size={24} />
                                        </div>
                                        <h3 className="text-lg font-black text-white">No Search History</h3>
                                        <p className="text-gray-500 text-sm max-w-sm">You haven't made any code or design generations yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
