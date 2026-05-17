import React, { useState, useEffect } from 'react';
import { Bell, Heart, UserPlus, MessageSquare, Check, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/appContext';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { socket } = useSocket();
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn) {
            fetchNotifications();
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (!socket) return;
        socket.on('notification:new', (notification) => {
            setNotifications(prev => [notification, ...prev]);
        });
        return () => socket.off('notification:new');
    }, [socket]);

    const fetchNotifications = async () => {
        try {
            const token = await getToken();
            if (!token) return;
            const res = await axios.get('/api/v1/social/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const markAsRead = async (id) => {
        // Logic to mark as read
    };

    const getIcon = (type) => {
        switch (type) {
            case 'like_post': return <Heart size={16} className="text-pink-500" />;
            case 'friend_request': return <UserPlus size={16} className="text-blue-500" />;
            case 'message': return <MessageSquare size={16} className="text-emerald-500" />;
            default: return <Bell size={16} className="text-white/40" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative">
            <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-full hover:bg-white/5"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} className="text-white/60" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center border-2 border-black">
                        {unreadCount}
                    </span>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-96 bg-[#0A0A0A] border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden backdrop-blur-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-black text-white tracking-tight">NOTIFICATIONS</h3>
                                <Button variant="ghost" size="sm" className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest">Mark all as read</Button>
                            </div>

                            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div 
                                            key={n._id} 
                                            className={`p-6 flex gap-4 transition-colors hover:bg-white/[0.02] border-b border-white/5 last:border-0 ${!n.isRead ? 'bg-blue-500/5' : ''}`}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm text-white/80 leading-relaxed font-medium">
                                                    <span className="text-white font-bold">New Friend Request</span> from @samiransamanta
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                                    <Clock size={10} /> 2m ago
                                                </div>
                                                {n.type === 'friend_request' && (
                                                    <div className="flex gap-2 pt-2">
                                                        <Button size="sm" className="h-9 rounded-xl bg-white text-black font-bold text-xs px-4">Accept</Button>
                                                        <Button size="sm" variant="outline" className="h-9 rounded-xl border-white/10 text-white font-bold text-xs px-4">Ignore</Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-20">
                                            <Bell size={32} />
                                        </div>
                                        <p className="text-white/20 font-bold text-sm tracking-widest uppercase">No notifications</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white/[0.02] text-center border-t border-white/5">
                                <Button variant="ghost" className="w-full text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest">View all activity</Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
