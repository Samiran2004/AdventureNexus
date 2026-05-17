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
        try {
            const token = await getToken();
            if (!token) return;
            const res = await axios.patch(`/api/v1/social/notifications/read/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = await getToken();
            if (!token) return;
            const res = await axios.patch('/api/v1/social/notifications/read-all', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error("Error marking all notifications as read", error);
        }
    };

    const getNotificationContent = (n) => {
        const actorName = n.sender?.fullname || n.sender?.username || 'Someone';
        switch (n.type) {
            case 'like_post':
                return {
                    title: 'Liked your post',
                    body: `${actorName} liked your discussion post.`,
                };
            case 'comment_post':
                return {
                    title: 'Commented on your post',
                    body: `${actorName} shared a thought on your discussion post.`,
                };
            case 'friend_request':
                return {
                    title: 'New Friend Request',
                    body: `${actorName} sent you a friend request.`,
                };
            case 'friend_accepted':
                return {
                    title: 'Friend Request Accepted',
                    body: `${actorName} accepted your friend request.`,
                };
            case 'group_invite':
                return {
                    title: 'New Group Activity',
                    body: `${actorName} recently joined your group.`,
                };
            default:
                return {
                    title: 'New Notification',
                    body: `${actorName} performed an action.`,
                };
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'like_post': return <Heart size={10} className="text-pink-500 fill-pink-500" />;
            case 'comment_post': return <MessageSquare size={10} className="text-blue-500 fill-blue-500" />;
            case 'friend_request':
            case 'friend_accepted': return <UserPlus size={10} className="text-emerald-500" />;
            case 'group_invite': return <Bell size={10} className="text-purple-500 fill-purple-500" />;
            default: return <Bell size={10} className="text-white/40" />;
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
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={markAllAsRead}
                                    className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest"
                                >
                                    Mark all as read
                                </Button>
                            </div>

                            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => {
                                        const content = getNotificationContent(n);
                                        return (
                                            <div 
                                                key={n._id} 
                                                onClick={() => !n.isRead && markAsRead(n._id)}
                                                className={`p-6 flex gap-4 transition-colors hover:bg-white/[0.02] border-b border-white/5 last:border-0 cursor-pointer ${!n.isRead ? 'bg-white/[0.02]' : ''}`}
                                            >
                                                <div className="relative flex-shrink-0">
                                                    {n.sender?.profilepicture ? (
                                                        <img 
                                                            src={n.sender.profilepicture} 
                                                            alt="Avatar" 
                                                            className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                                            {getIcon(n.type)}
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border border-white/10">
                                                        {getIcon(n.type)}
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs font-black text-white/40 uppercase tracking-widest">{content.title}</p>
                                                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-red-500" />}
                                                    </div>
                                                    <p className="text-sm text-white/80 leading-relaxed font-medium">
                                                        {content.body}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest pt-1">
                                                        <Clock size={10} /> {new Date(n.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
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
