import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { Trash2, Search, User as UserIcon, Mail, Calendar, Activity, Clock, Eye, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { useSocket } from '../context/AdminSocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import DetailPanel from '../components/DetailPanel';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const { socket } = useSocket();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();

        if (socket) {
            socket.emit('get-online-users');
            socket.on('online-users-list', (ids: string[]) => setOnlineUserIds(new Set(ids)));
            socket.on('user:online', (id: string) => setOnlineUserIds(prev => new Set(prev).add(id)));
            socket.on('user:offline', (id: string) => setOnlineUserIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            }));
            socket.on('user:created', () => fetchUsers());
            socket.on('user:deleted', (clerkId: string) => {
                setUsers(prev => prev.filter(u => u.clerkUserId !== clerkId));
            });

            return () => {
                socket.off('online-users-list');
                socket.off('user:online');
                socket.off('user:offline');
                socket.off('user:created');
                socket.off('user:deleted');
            };
        }
    }, [socket]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('WARNING: Irreversibly delete this user? All their comments, posts, likes, and group memberships will be permanently deleted from MongoDB and Cloudinary.')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            if (selectedUser?._id === id) setSelectedUser(null);
        } catch (error) {
            alert('Operation failed');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.fullname?.toLowerCase().includes(search.toLowerCase())
    );

    const getRelativeTime = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        if (!date) return 'Unknown';
        const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return past.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-white gap-3">
                <span className="w-8 h-8 border-2 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Synchronizing Operators Logs...</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pb-20 select-none font-sans"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-b-white/5 pb-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-emerald-400" />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase font-mono">
                            Ecosystem Operators <span className="text-emerald-400 font-sans">Database</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">
                        Active community user node directories and online status triggers
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchUsers}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 rounded-full text-[10px] font-bold text-gray-400 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all uppercase tracking-widest font-mono"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Sync Operators
                    </button>
                </div>
            </div>

            {/* Filter controls */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
                <Search className="w-4 h-4 text-gray-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search by full name, registered username, or contact email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent text-sm text-gray-200 focus:outline-none w-full placeholder:text-gray-700 font-mono"
                />
            </div>

            {/* Users grid list */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono">
                        <thead className="bg-white/[0.02] border-b border-white/10">
                            <tr>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Operator Identity</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Contact Information</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Live Status</th>
                                <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Inspect</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[11px]">
                            {filteredUsers.map((user) => {
                                const isOnline = onlineUserIds.has(user.clerkUserId);
                                return (
                                    <tr
                                        key={user._id}
                                        onClick={() => setSelectedUser(user)}
                                        className="hover:bg-white/[0.01] transition-colors group cursor-pointer"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={user.profilepicture || `https://ui-avatars.com/api/?name=${user.username}&background=10b981&color=fff`}
                                                        alt={user.username}
                                                        className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:border-emerald-500/50 transition-all"
                                                    />
                                                    {isOnline && (
                                                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-4 border-[#0c0c0c] rounded-full animate-pulse shadow-lg shadow-emerald-500/30"></span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-gray-200 font-bold tracking-tight">{user.fullname || user.username}</div>
                                                    <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mt-0.5">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-gray-300 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span>{user.email}</span>
                                                </div>
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded w-fit uppercase tracking-widest mt-1 border ${
                                                    user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-gray-400 border-white/5'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isOnline ? (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit text-emerald-400 font-bold uppercase tracking-widest text-[9px]">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                                    <span>ACTIVE</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">PERSISTENT NODE</span>
                                                    <span className="text-[9px] text-gray-600 font-medium mt-0.5">Seen {getRelativeTime(user.lastActive || user.updatedAt)}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                                                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/20 text-gray-500 hover:text-white bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(user._id, e)}
                                                    className="p-1.5 rounded-lg border border-white/5 hover:border-rose-500/20 text-gray-500 hover:text-rose-500 bg-white/[0.01] hover:bg-rose-500/5 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center flex flex-col items-center justify-center gap-3">
                                        <UserIcon className="w-10 h-10 text-gray-800 animate-pulse" />
                                        <p className="text-gray-600 text-xs font-black uppercase tracking-widest">No operators directories matched your query</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User detail dossier */}
            <DetailPanel
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title="Operator Dossier"
                description={`Verification statistics for community node @${selectedUser?.username}`}
            >
                {selectedUser && (
                    <div className="space-y-6 select-none font-mono">
                        {/* Avatar block */}
                        <div className="flex items-center gap-5 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                            <div className="relative">
                                <img
                                    src={selectedUser.profilepicture || `https://ui-avatars.com/api/?name=${selectedUser.username}&background=10b981&color=fff`}
                                    alt={selectedUser.username}
                                    className="w-16 h-16 rounded-xl object-cover border border-white/10"
                                />
                                {onlineUserIds.has(selectedUser.clerkUserId) && (
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#0c0c0c] rounded-full animate-pulse"></span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">{selectedUser.fullname || selectedUser.username}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">@{selectedUser.username}</span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${
                                        selectedUser.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-gray-400 border-white/5'
                                    }`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status split */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest block mt-1">CONNECTION LINE</span>
                                <span className="text-white font-black text-[10px] uppercase">
                                    {onlineUserIds.has(selectedUser.clerkUserId) ? 'ACTIVE TELEMETRY' : 'PERSISTENT DISCONNECTED'}
                                </span>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest block mt-1">LAST SEEN SIGNALS</span>
                                <span className="text-white font-black text-[10px] uppercase">{getRelativeTime(selectedUser.lastActive || selectedUser.updatedAt)}</span>
                            </div>
                        </div>

                        {/* Telemetry specs */}
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Operator Registry Specifications</span>
                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-3.5 text-xs text-gray-300">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Ecosystem Mail</span>
                                    <span className="text-gray-200 font-bold">{selectedUser.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Clerk Node ID</span>
                                    <code className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">{selectedUser.clerkUserId}</code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Account Created</span>
                                    <span className="text-gray-200 font-bold">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Danger zone actions */}
                        <div className="bg-rose-500/[0.02] border border-rose-500/10 p-5 rounded-2xl space-y-3.5">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 animate-pulse" />
                                <div>
                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Danger Zone Clearance Enforced</span>
                                    <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">
                                        Account de-registrations automatically expunge matching itinerary datasets, community posts, commented traces, and likeness values across Mongo and Cloudinary stores.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDelete(selectedUser._id, e)}
                                className="w-full py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:shadow-rose-500/20"
                            >
                                Expunge Operator Account
                            </button>
                        </div>
                    </div>
                )}
            </DetailPanel>
        </motion.div>
    );
};

export default UsersPage;
