import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
    Bell,
    MessageCircle,
    X,
    Check,
    User,
    Heart,
    MessageSquare,
    UserPlus,
    Loader2,
    Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { communityService } from '@/services/communityService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SocialHub = () => {
    const { userId: clerkUserId, isSignedIn, getToken } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' or 'messages'
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch initial notifications
    useEffect(() => {
        if (isSignedIn) {
            fetchNotifications();
        }
    }, [isSignedIn]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            const res = await communityService.getNotifications(token);
            if (res.success) {
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Socket listeners for real-time updates
    useEffect(() => {
        if (!isSignedIn) return;

        let socket;
        import('socket.io-client').then(({ io }) => {
            socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000');

            socket.on('connect', () => {
                socket.emit('identity', clerkUserId);
            });

            socket.on('notification', (newNotif) => {
                setNotifications(prev => [newNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
                toast.success('New notification received!', { icon: '🔔' });
            });

            socket.on('message:direct', (newMessage) => {
                toast.success(`New message: ${newMessage.content.substring(0, 20)}...`, { icon: '💬' });
                // If on messages tab, we could refresh or update list
            });
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, [isSignedIn, clerkUserId]);

    const markRead = async (id) => {
        try {
            const token = await getToken();
            const res = await communityService.markNotificationRead(id, token);
            if (res.success) {
                setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Read error:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'like_post':
            case 'like_story': return <Heart size={14} className="text-red-500 fill-red-500" />;
            case 'comment_post':
            case 'comment_story': return <MessageSquare size={14} className="text-blue-500" />;
            case 'follow': return <UserPlus size={14} className="text-emerald-500" />;
            case 'message': return <MessageCircle size={14} className="text-orange-500" />;
            default: return <Bell size={14} />;
        }
    };

    if (!isSignedIn) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[380px] h-[550px] bg-card/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'notifications' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Alerts {unreadCount > 0 && <span className="ml-1 text-primary">●</span>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('messages')}
                                    className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Messages
                                </button>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full h-8 w-8 hover:bg-white/10">
                                <X size={16} />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {activeTab === 'notifications' ? (
                                <div className="space-y-3">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center h-40 gap-2">
                                            <Loader2 className="animate-spin text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Syncing Nexus...</span>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="text-center py-20 opacity-30 italic font-medium">No new alerts.</div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif._id}
                                                onClick={() => {
                                                    markRead(notif._id);
                                                    if (notif.type === 'follow') navigate(`/user/profile/${notif.senderClerkUserId}`);
                                                    else if (notif.type.includes('story')) navigate('/stories');
                                                    else navigate('/community');
                                                }}
                                                className={`p-4 rounded-3xl transition-all cursor-pointer border border-transparent ${notif.isRead ? 'opacity-60 grayscale' : 'bg-muted/40 border-primary/10 shadow-lg hover:border-primary/30'}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                                                        {getIcon(notif.type)}
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <p className="text-xs font-bold leading-relaxed">
                                                            <span className="text-primary">User</span> {notif.type.replace(/_/g, ' ')} your activity.
                                                        </p>
                                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-1">
                                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                                    <MessageCircle size={48} className="text-primary opacity-20" />
                                    <h3 className="text-xl font-black italic tracking-tight">Direct Messages</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Messaging is active! Start a conversation by visiting a traveler's profile.</p>
                                    <Button onClick={() => navigate('/community')} className="rounded-2xl font-black uppercase tracking-widest text-[10px]">Find Travelers</Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications();
                }}
                className="relative w-16 h-16 rounded-[2rem] bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(255,123,49,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}><X size={28} /></motion.div>
                    ) : (
                        <motion.div key="bell" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} className="relative">
                            <Bell size={28} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-primary shadow-lg animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
};

export default SocialHub;
