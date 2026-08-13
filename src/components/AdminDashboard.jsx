import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Users, Trash2, Search, Activity, X, LogOut, ShieldAlert, Layout, FileText } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userActivities, setUserActivities] = useState([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Check Auth
        const adminData = localStorage.getItem('admin-data');
        if (!adminData) {
            navigate('/admin');
            return;
        }
        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (e) {
            console.error("Failed to fetch users", e);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This will erase all their saved data.")) return;
        
        try {
            const res = await fetch(`http://localhost:8080/api/admin/users/${userId}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== userId));
                if (selectedUser?._id === userId) setSelectedUser(null);
            }
        } catch (e) {
            console.error("Failed to delete user", e);
        }
    };

    const handleViewActivity = async (user) => {
        setSelectedUser(user);
        setIsLoadingActivities(true);
        setUserActivities([]);
        try {
            const res = await fetch(`http://localhost:8080/api/activity/${user._id}`);
            if (res.ok) {
                const data = await res.json();
                setUserActivities(data);
            }
        } catch (e) {
            console.error("Failed to fetch user activities", e);
        } finally {
            setIsLoadingActivities(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin-data');
        navigate('/admin');
    };

    const filteredUsers = users.filter(u => 
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

    const chartData = [...users]
        .sort((a, b) => (b.activityCount || 0) - (a.activityCount || 0))
        .slice(0, 6)
        .map(u => ({
            name: (u.name || u.email.split('@')[0]).substring(0, 10),
            generations: u.activityCount || 0
        }));

    return (
        <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans tracking-wide selection:bg-highlight/30 relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-0 w-80 h-80 bg-highlight/10 blur-[120px] -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none" />
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
            </div>

            {/* Admin Navbar */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05] z-40 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center text-highlight shadow-[0_0_15px_rgba(138,43,226,0.15)]">
                        <ShieldAlert size={20} />
                    </div>
                    <span className="font-black tracking-tight text-white text-xl">Admin<span className="text-highlight">Dashboard</span></span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500/80 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                >
                    <LogOut size={16} /> Sign Out
                </button>
            </nav>

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Dashboard Header & Stats */}
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight mb-2">User Management</h1>
                            <p className="text-gray-500 font-medium">Monitor activity, track generations, and manage platform safety.</p>
                        </div>
                        <div className="bg-[#0A0A0C] border border-white/[0.05] rounded-3xl px-8 py-5 flex items-center gap-6 shadow-2xl">
                            <div className="bg-highlight/10 p-4 rounded-2xl text-highlight shadow-inner">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Total Users</p>
                                <p className="text-3xl font-black text-white leading-none">{users.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Analytics Section */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-[#0A0A0C] border border-white/[0.05] rounded-[2.5rem] p-8 shadow-2xl">
                            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                                <Activity size={20} className="text-highlight" /> Top User Activity
                            </h2>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                            contentStyle={{ backgroundColor: '#151518', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                            itemStyle={{ color: '#8A2BE2', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="generations" fill="#8A2BE2" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0C] border border-white/[0.05] rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
                            <h2 className="text-xl font-black text-white mb-2 text-center relative z-10">System Health</h2>
                            <div className="flex-1 flex flex-col items-center justify-center space-y-6 relative z-10 mt-4">
                                <div className="w-36 h-36 rounded-full border-4 border-highlight border-t-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(138,43,226,0.15)] relative">
                                    <div className="absolute inset-0 bg-highlight/5 rounded-full animate-pulse" />
                                    <div className="text-center z-10">
                                        <p className="text-4xl font-black text-white leading-none">
                                            {users.reduce((acc, u) => acc + (u.activityCount || 0), 0)}
                                        </p>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-2">Total Output</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-green-400 font-bold tracking-wide">Operational • Stable</p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Database connectivity optimal.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Users Table Card */}
                    <motion.div variants={itemVariants} className="bg-[#0A0A0C] border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <Activity size={20} className="text-highlight" /> Platform Members
                            </h2>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-highlight transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name or email..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-[#151518] border border-white/[0.05] rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-highlight/50 focus:ring-1 focus:ring-highlight/50 transition-all w-full sm:w-80 text-white placeholder-gray-600"
                                />
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto p-4 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">User Profile</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Email Address</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Generations</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Administrative Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredUsers.length === 0 ? (
                                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <td colSpan="4" className="p-12 text-center text-gray-500 font-medium">
                                                    No members match your search criteria.
                                                </td>
                                            </motion.tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <motion.tr 
                                                    key={user._id} 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="hover:bg-[#151518] transition-colors group border-b border-white/[0.02] last:border-0"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-highlight to-blue-500 p-[1px]">
                                                                <div className="w-full h-full bg-[#0A0A0C] rounded-[11px] flex items-center justify-center font-black text-white">
                                                                    {(user.name || 'A')[0].toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <span className="font-bold text-white">{user.name || 'Anonymous User'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400 font-medium">{user.email || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-3 bg-highlight/10 text-highlight text-xs font-black rounded-lg border border-highlight/20 shadow-[0_0_10px_rgba(138,43,226,0.1)]">
                                                            {user.activityCount || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button 
                                                                onClick={() => handleViewActivity(user)}
                                                                className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                                                            >
                                                                <Activity size={14} /> Full Log
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                                title="Terminate Account"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </motion.div>
            </main>

            {/* Full Screen Activity Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setSelectedUser(null)}
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
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">User Activity Logs</h3>
                                        <p className="text-xs text-gray-500 font-medium">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#050505]">
                                {isLoadingActivities ? (
                                    <div className="flex flex-col items-center justify-center h-40 space-y-4">
                                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-gray-500 text-sm font-medium">Fetching secure logs...</p>
                                    </div>
                                ) : userActivities.length > 0 ? (
                                    <div className="space-y-4">
                                        {userActivities.map((act) => (
                                            <div key={act._id} className="p-5 bg-[#0A0A0C] border border-white/[0.05] rounded-2xl hover:border-purple-500/30 transition-all flex items-start gap-4 shadow-lg group">
                                                <div className="mt-1">
                                                    {act.activityType === 'web_design' ? (
                                                        <Layout size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                                    ) : (
                                                        <FileText size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white mb-2 leading-relaxed">{act.prompt}</p>
                                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                                        <span className={act.activityType === 'web_design' ? 'text-purple-400' : 'text-blue-400'}>
                                                            {act.activityType === 'web_design' ? 'Web Design' : 'Code Generator'}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                        <span>{new Date(act.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-60 space-y-4 text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center text-gray-700 mb-2">
                                            <Activity size={24} />
                                        </div>
                                        <h3 className="text-lg font-black text-white">No Search History</h3>
                                        <p className="text-gray-500 text-sm max-w-sm">This user hasn't made any generations yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}} />
        </div>
    );
};

export default AdminDashboard;
