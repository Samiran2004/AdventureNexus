import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, Image as ImageIcon, Paperclip, Smile, Search, 
    Phone, Video, Info, User, Users, CheckCheck, Check,
    Zap, ArrowLeft, MoreVertical, ShieldAlert, Loader2, MapPin
} from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/context/appContext';
import { communityService } from '@/services/communityService';
import toast from 'react-hot-toast';
import NavBar from '@/components/NavBar';

const ChatPage = () => {
    const { userId: clerkUserId, getToken } = useAuth();
    const { user } = useUser();
    const { socket } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileSidebar, setShowMobileSidebar] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [onlineUserIds, setOnlineUserIds] = useState(new Set());

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 1. Initial Load and pre-selected conversation navigation support
    useEffect(() => {
        const loadInitialConversations = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const res = await communityService.getUserConversations(token);
                if (res.success) {
                    setConversations(res.data);
                    
                    // Handle transition from "Message" button
                    const preSelectedConvId = location.state?.activeConversationId;
                    if (preSelectedConvId) {
                        const matchedConv = res.data.find(c => c._id === preSelectedConvId);
                        if (matchedConv) {
                            setActiveConversation(matchedConv);
                            setShowMobileSidebar(false);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading chats:", error);
                toast.error("Failed to load your chats.");
            } finally {
                setLoading(false);
            }
        };

        if (clerkUserId) {
            loadInitialConversations();
        }
    }, [clerkUserId, location.state]);

    // 2. Fetch Messages when Active Conversation changes
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!activeConversation) return;
            try {
                const token = await getToken();
                // Mark messages as read early
                await communityService.markChatMessageAsRead(activeConversation._id, token);
                
                const res = await communityService.getChatMessages(activeConversation._id, token);
                if (res.success) {
                    setMessages(res.data);
                    setTimeout(scrollToBottom, 100);
                }
            } catch (error) {
                console.error("Error fetching message history:", error);
            }
        };

        fetchChatHistory();
    }, [activeConversation]);

    // 3. Setup Socket Event Receivers
    useEffect(() => {
        if (!socket) return;

        socket.on('chat:message', (data) => {
            // Handle seen status update
            if (data && data.type === 'messages:seen') {
                if (activeConversation && data.conversationId === activeConversation._id) {
                    setMessages(prev => prev.map(m => 
                        m && m.senderClerkUserId === clerkUserId ? { ...m, status: 'seen' } : m
                    ).filter(Boolean));
                }
                return;
            }

            // Handle incoming message
            if (activeConversation && data && data.conversationId === activeConversation._id) {
                if (!data.message) return;
                setMessages(prev => {
                    const cleanPrev = prev.filter(Boolean);
                    const isDuplicate = cleanPrev.some(m => m && m._id === data.message._id);
                    if (isDuplicate) return cleanPrev;
                    return [...cleanPrev, data.message];
                });
                
                // If we are currently looking at this active conversation, mark this incoming message as read!
                getToken().then(token => {
                    communityService.markChatMessageAsRead(activeConversation._id, token);
                });
                
                setTimeout(scrollToBottom, 50);
            }

            // Dynamically refresh sidebar previews
            if (data && data.message) {
                setConversations(prev => {
                    const matched = prev.find(c => c._id === data.conversationId);
                    if (matched) {
                        return prev.map(conv => 
                            conv._id === data.conversationId 
                            ? { ...conv, lastMessage: data.message } 
                            : conv
                        );
                    } else {
                        // Trigger dynamic reload of conversations to append new active partner in real time
                        getToken().then(token => {
                            communityService.getUserConversations(token).then(res => {
                                if (res.success) setConversations(res.data);
                            });
                        });
                        return prev;
                    }
                });
            }
        });

        return () => {
            socket.off('chat:message');
        };
    }, [socket, activeConversation]);

    // 3b. Setup Socket Online Status Receivers
    useEffect(() => {
        if (!socket) return;

        socket.emit('get-online-users');

        socket.on('online-users-list', (userIds) => {
            setOnlineUserIds(new Set(userIds));
        });

        socket.on('user:online', (userId) => {
            setOnlineUserIds(prev => {
                const next = new Set(prev);
                next.add(userId);
                return next;
            });
        });

        socket.on('user:offline', (userId) => {
            setOnlineUserIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        });

        return () => {
            socket.off('online-users-list');
            socket.off('user:online');
            socket.off('user:offline');
        };
    }, [socket]);

    // 4. Send Message Handler
    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const originalText = newMessage;
        setNewMessage(""); // Clear early for snappy visual feedback
        setIsSending(true);

        try {
            const token = await getToken();
            const res = await communityService.sendChatMessage(activeConversation._id, originalText, token);
            if (res.success) {
                setMessages(prev => {
                    const isDuplicate = prev.some(m => m._id === res.data._id);
                    if (isDuplicate) return prev;
                    return [...prev, res.data];
                });
                setTimeout(scrollToBottom, 50);

                // Update sidebar preview
                setConversations(prev => prev.map(conv => 
                    conv._id === activeConversation._id 
                    ? { ...conv, lastMessage: res.data } 
                    : conv
                ));
            }
        } catch (error) {
            toast.error("Failed to transmit signal");
            setNewMessage(originalText); // Rollback text if it fails
        } finally {
            setIsSending(false);
        }
    };

    // Helper: extract the recipient traveler profile
    const getRecipientProfile = (conv) => {
        if (!conv || conv.isGroup) return null;
        return conv.participantDetails?.find(p => p.clerkUserId !== clerkUserId) || null;
    };

    const formatMessageTime = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredConversations = conversations.filter(conv => {
        if (conv.isGroup) {
            return conv.groupName?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        const profile = getRecipientProfile(conv);
        return profile?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) || 
               profile?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="h-screen bg-black flex flex-col overflow-hidden">
            <NavBar />
            <div className="flex-1 flex bg-black overflow-hidden font-inter border-t border-white/5 pt-[80px]">
            {/* Sidebar List panel */}
            <div className={`w-full md:w-[400px] border-r border-white/5 flex flex-col bg-[#07090e] transition-all duration-300 ${showMobileSidebar ? 'flex' : 'hidden md:flex'}`}>
                {/* Header */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                                W
                            </div>
                            <h1 className="text-2xl font-black text-white tracking-tighter italic">NEXUS CHAT</h1>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-black" title="Encrypted Connection Live" />
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <Input 
                            placeholder="Filter travelers..." 
                            className="pl-12 bg-white/[0.02] border-white/5 rounded-2xl h-12 focus-visible:ring-primary/40 focus-visible:ring-2 placeholder-white/20 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Traveler Chat List */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                        ))
                    ) : filteredConversations.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto text-white/20">
                                <Users size={20} />
                            </div>
                            <p className="text-xs text-white/30 font-bold uppercase tracking-wider">No connections found</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const recipient = getRecipientProfile(conv);
                            const isOnline = recipient && onlineUserIds.has(recipient.clerkUserId);
                            const isActive = activeConversation?._id === conv._id;
                            const avatarUrl = recipient?.profilepicture;

                            return (
                                <button
                                    key={conv._id}
                                    onClick={() => {
                                        setActiveConversation(conv);
                                        setShowMobileSidebar(false);
                                    }}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border ${isActive ? 'bg-primary/10 border-primary/20 shadow-lg shadow-primary/5' : 'hover:bg-white/[0.02] border-transparent hover:border-white/5'}`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden flex items-center justify-center font-bold text-white shadow-md">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt={recipient?.fullname} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{recipient?.fullname?.charAt(0).toUpperCase() || 'T'}</span>
                                            )}
                                        </div>
                                        {isOnline && (
                                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#07090e]" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-white truncate text-sm">
                                                {recipient?.fullname || 'Traveler'}
                                            </h3>
                                            <span className="text-[10px] text-white/20 font-bold">
                                                {formatMessageTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/40 truncate font-medium">
                                            {conv.lastMessage?.content || "Tap to open Travel Line"}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Frame */}
            <div className={`flex-1 flex flex-col bg-[#05060a] relative ${!showMobileSidebar ? 'flex' : 'hidden md:flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Bar Header */}
                        {(() => {
                            const recipient = getRecipientProfile(activeConversation);
                            const isOnline = recipient && onlineUserIds.has(recipient.clerkUserId);

                            return (
                                <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-[#07090e]/80 backdrop-blur-xl z-10">
                                    <div className="flex items-center gap-4">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="md:hidden rounded-full hover:bg-white/5 text-white/60"
                                            onClick={() => setShowMobileSidebar(true)}
                                        >
                                            <ArrowLeft size={20} />
                                        </Button>
 
                                        <div 
                                            className="cursor-pointer flex items-center gap-4"
                                            onClick={() => navigate(`/user/profile/${recipient?.clerkUserId}`)}
                                        >
                                            <div className="relative">
                                                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center font-bold text-white shadow-md">
                                                    {recipient?.profilepicture ? (
                                                        <img src={recipient.profilepicture} alt={recipient.fullname} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{recipient?.fullname?.charAt(0).toUpperCase() || 'T'}</span>
                                                    )}
                                                </div>
                                                {isOnline && (
                                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                                                )}
                                            </div>
 
                                            <div>
                                                <h2 className="font-black text-white tracking-tight text-sm flex items-center gap-2 hover:text-primary transition-colors">
                                                    {recipient?.fullname || 'Traveler'}
                                                </h2>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[9px] uppercase tracking-widest font-black ${isOnline ? 'text-emerald-500 animate-pulse' : 'text-white/30'}`}>
                                                        {isOnline ? 'Active Online Line' : 'Traveler offline'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action items */}
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="rounded-full hover:bg-white/5 text-white/40 hover:text-white"
                                            onClick={() => navigate(`/user/profile/${recipient?.clerkUserId}`)}
                                        >
                                            <User size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-white/40"><MoreVertical size={18} /></Button>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* WhatsApp-like Message scroll workspace */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.02),transparent_50%)]">
                            {messages.map((msg, i) => {
                                const isMe = msg.senderClerkUserId === clerkUserId;
                                return (
                                    <motion.div
                                        key={msg._id || i}
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className="max-w-[70%] space-y-1">
                                            <div className={`p-4 rounded-3xl text-sm leading-relaxed ${isMe ? 'bg-gradient-to-r from-emerald-600/30 to-teal-500/20 text-emerald-100 border border-emerald-500/20 rounded-tr-none shadow-[0_4px_20px_rgba(16,185,129,0.05)]' : 'bg-white/[0.02] text-white border border-white/5 rounded-tl-none'}`}>
                                                <p>{msg.content}</p>
                                            </div>
                                            <div className={`flex items-center gap-1.5 text-[9px] text-white/20 font-black uppercase tracking-widest ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <span>{formatMessageTime(msg.createdAt)}</span>
                                                {isMe && (
                                                    msg.status === 'seen' ? (
                                                        <CheckCheck size={12} className="text-emerald-400" title="Seen" />
                                                    ) : msg.status === 'delivered' ? (
                                                        <CheckCheck size={12} className="text-white/30" title="Delivered" />
                                                    ) : (
                                                        <Check size={12} className="text-white/30" title="Sent" />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* WhatsApp Message text input */}
                        <div className="p-4 bg-[#07090e] border-t border-white/5">
                            <form onSubmit={handleSend} className="flex items-center gap-3 max-w-5xl mx-auto">
                                <div className="flex-1 relative">
                                    <Input 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Secure message terminal..." 
                                        className="bg-white/[0.01] border-white/5 rounded-2xl h-14 pl-6 pr-12 focus-visible:ring-primary/40 focus-visible:ring-2 text-white placeholder-white/20 text-sm font-medium"
                                        disabled={isSending}
                                    />
                                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-white/20 hover:text-white/60 hover:bg-transparent">
                                        <Smile size={20} />
                                    </Button>
                                </div>
                                <Button 
                                    type="submit" 
                                    className="h-14 w-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/10 flex items-center justify-center"
                                    disabled={isSending || !newMessage.trim()}
                                >
                                    {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center px-8 bg-[#040508]">
                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-indigo-600/20 border border-primary/20 flex items-center justify-center animate-bounce shadow-xl shadow-primary/5">
                            <Zap size={36} className="text-primary fill-primary/30" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white tracking-tighter italic">NEXUS SECURE TERMINAL</h2>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-wider max-w-xs mx-auto">Select a traveler connection to initiate end-to-end encrypted messaging.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
};

export default ChatPage;
