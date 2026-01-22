import React, { useEffect, useState } from 'react';
import api from '../services/adminApi';
import { Trash2, Search, User as UserIcon, Shield, Mail, Calendar, MapPin, Activity, Clock, Eye, Trash, CheckCircle2, ChevronRight, Ban, Activity as ActivityIcon } from 'lucide-react';
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

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('WARNING: Irreversibly delete this user?')) return;
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

    if (loading) return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse"></div>
                <div className="h-12 w-64 bg-white/5 rounded-2xl animate-pulse"></div>
            </div>
            <div className="bg-gray-900/40 rounded-[2.5rem] border border-white/5 h-[500px] overflow-hidden">
                <div className="p-8 space-y-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl animate-pulse"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse"></div>
                                <div className="h-3 w-24 bg-white/5 rounded-lg animate-pulse"></div>
                            </div>
                            <div className="h-8 w-24 bg-white/5 rounded-full animate-pulse"></div>
                            <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white tracking-tight">Community</h1>
                    <p className="text-gray-500 font-medium">Synchronized user database monitoring.</p>
                </div>

                <div className="flex items-center gap-4 bg-gray-800/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-lg group focus-within:border-indigo-500/50 transition-all duration-300">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify user..."
                            className="bg-transparent text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none w-64 placeholder-gray-600 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/60 border-b border-white/5">
                            <tr>
                                <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Operator</th>
                                <th className="px-6 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Contact & Role</th>
                                <th className="px-6 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Live Status</th>
                                <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            <AnimatePresence>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onClick={() => setSelectedUser(user)}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={user.profilepicture || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`}
                                                        alt={user.username}
                                                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white/5 group-hover:border-indigo-500/50 transition-colors"
                                                    />
                                                    {onlineUserIds.has(user.clerkUserId) && (
                                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#0A0A0A] rounded-full animate-pulse shadow-lg shadow-emerald-500/20"></span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-gray-100 font-bold tracking-tight">{user.fullname || user.username}</div>
                                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm text-gray-300 flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                                                    {user.email}
                                                </div>
                                                <div className={`text-[10px] font-black px-2 py-0.5 rounded-md w-fit uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                                    {user.role}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {onlineUserIds.has(user.clerkUserId) ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Now</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Persistent</span>
                                                    <span className="text-[10px] text-gray-600 font-medium">Seen {getRelativeTime(user.lastActive || user.updatedAt)}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                                                    className="p-2.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(user._id, e)}
                                                    className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                    title="Deep Delete"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {!filteredUsers.length && (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 text-gray-500">
                            <div className="w-20 h-20 bg-gray-800/30 rounded-full flex items-center justify-center border border-white/5">
                                <Search className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="font-bold tracking-tight">No operators found matching identifying parameters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* User Detail Panel */}
            <DetailPanel
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title="User Profile"
                description={`Identifying system record for @${selectedUser?.username}`}
            >
                {selectedUser && (
                    <div className="space-y-10">
                        {/* Profile Header */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <img
                                    src={selectedUser.profilepicture || `https://ui-avatars.com/api/?name=${selectedUser.username}&background=111&color=fff&size=128`}
                                    alt={selectedUser.username}
                                    className="relative w-32 h-32 rounded-[2.5rem] object-cover border-4 border-gray-900 shadow-2xl"
                                />
                                {onlineUserIds.has(selectedUser.clerkUserId) && (
                                    <span className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-gray-900 rounded-full shadow-lg shadow-emerald-500/20"></span>
                                )}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-white tracking-tight">{selectedUser.fullname || selectedUser.username}</h3>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-indigo-400 font-bold tracking-wider uppercase text-xs">@{selectedUser.username}</span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${selectedUser.role === 'admin' ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-1">
                                <Activity className="w-5 h-5 text-indigo-400 mb-2" />
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Network Status</p>
                                <p className="text-white font-bold">{onlineUserIds.has(selectedUser.clerkUserId) ? 'ONLINE' : 'OFFLINE'}</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-1">
                                <Clock className="w-5 h-5 text-emerald-400 mb-2" />
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Last Activity</p>
                                <p className="text-white font-bold">{getRelativeTime(selectedUser.lastActive || selectedUser.updatedAt)}</p>
                            </div>
                        </div>

                        {/* Metadata Sections */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1">System Metadata</h4>
                                <div className="bg-gray-900/50 border border-white/5 rounded-[2rem] overflow-hidden">
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-gray-800">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Primary Contact</p>
                                                <p className="text-sm font-medium text-gray-200">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-gray-800">
                                                <Shield className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Clerk Identity</p>
                                                <code className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">{selectedUser.clerkUserId}</code>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-gray-800">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Created</p>
                                                <p className="text-sm font-medium text-gray-200">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6">
                            <button
                                onClick={(e) => handleDelete(selectedUser._id, e)}
                                className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-red-500/20"
                            >
                                Danger Zone: Decommission Account
                            </button>
                        </div>
                    </div>
                )}
            </DetailPanel>
        </motion.div>
    );
};

export default UsersPage;
