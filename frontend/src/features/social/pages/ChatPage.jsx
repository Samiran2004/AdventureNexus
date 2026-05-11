import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, Image as ImageIcon, Paperclip, Smile, Search, 
    MoreVertical, Phone, Video, Info, User, Users,
    Check, CheckCheck, Clock, Shield, Award, Zap
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSocket } from '@/context/appContext'; // Assuming useSocket is available or I'll add it
import axios from 'axios';

const ChatPage = () => {
    const { user } = useUser();
    const { socket } = useSocket();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation._id);
        }
    }, [activeConversation]);

    useEffect(() => {
        if (!socket) return;

        socket.on('chat:message', (data) => {
            if (activeConversation && data.conversationId === activeConversation._id) {
                setMessages(prev => [...prev, data.message]);
                scrollToBottom();
            } else {
                // Update conversation preview in sidebar
                setConversations(prev => prev.map(conv => 
                    conv._id === data.conversationId 
                    ? { ...conv, lastMessage: data.message } 
                    : conv
                ));
            }
        });

        return () => socket.off('chat:message');
    }, [socket, activeConversation]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get('/api/v1/messaging/conversations');
            if (res.data.success) {
                setConversations(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching conversations", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (convId) => {
        try {
            const res = await axios.get(`/api/v1/messaging/messages/${convId}`);
            if (res.data.success) {
                setMessages(res.data.data);
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        try {
            const res = await axios.post('/api/v1/messaging/message', {
                conversationId: activeConversation._id,
                content: newMessage,
                type: 'text'
            });

            if (res.data.success) {
                setMessages(prev => [...prev, res.data.data]);
                setNewMessage("");
                scrollToBottom();
                
                // Update sidebar preview
                setConversations(prev => prev.map(conv => 
                    conv._id === activeConversation._id 
                    ? { ...conv, lastMessage: res.data.data } 
                    : conv
                ));
            }
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-black overflow-hidden font-inter">
            {/* Sidebar */}
            <div className="w-full md:w-96 border-r border-white/5 flex flex-col bg-[#050505]">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-black text-white tracking-tighter">MESSAGES</h1>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                            <Users size={20} className="text-white/60" />
                        </Button>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <Input 
                            placeholder="Search chats..." 
                            className="pl-12 bg-white/5 border-white/5 rounded-2xl h-12 focus-visible:ring-blue-500/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv._id}
                                onClick={() => setActiveConversation(conv)}
                                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeConversation?._id === conv._id ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 overflow-hidden">
                                        {conv.isGroup ? (
                                            <Users size={24} className="text-white/40" />
                                        ) : (
                                            <User size={24} className="text-white/40" />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#050505]"></div>
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-white truncate">
                                            {conv.isGroup ? conv.groupName : (conv.participants.find(p => p !== user?.id) || "Chat")}
                                        </h3>
                                        <span className="text-[10px] text-white/20 font-medium">12:30 PM</span>
                                    </div>
                                    <p className="text-sm text-white/40 truncate">
                                        {conv.lastMessage?.content || "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-black relative">
                {activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <User size={20} className="text-white/60" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white tracking-tight">
                                        {activeConversation.isGroup ? activeConversation.groupName : "Chat"}
                                    </h2>
                                    <p className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5"><Phone size={20} className="text-white/60" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5"><Video size={20} className="text-white/60" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5"><Info size={20} className="text-white/60" /></Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)]">
                            {messages.map((msg, i) => {
                                const isMe = msg.senderClerkUserId === user?.id;
                                return (
                                    <motion.div
                                        key={msg._id || i}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] group`}>
                                            <div className={`p-4 rounded-3xl ${isMe ? 'bg-white text-black rounded-tr-none' : 'bg-white/5 text-white border border-white/5 rounded-tl-none'}`}>
                                                <p className="text-[15px] leading-relaxed">{msg.content}</p>
                                            </div>
                                            <div className={`mt-2 flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <span>12:45 PM</span>
                                                {isMe && <CheckCheck size={12} className="text-blue-500" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-black border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4 max-w-5xl mx-auto">
                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="ghost" size="icon" className="rounded-full hover:bg-white/5"><ImageIcon size={20} className="text-white/40" /></Button>
                                    <Button type="button" variant="ghost" size="icon" className="rounded-full hover:bg-white/5"><Paperclip size={20} className="text-white/40" /></Button>
                                </div>
                                <div className="flex-1 relative">
                                    <Input 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..." 
                                        className="bg-white/5 border-white/5 rounded-2xl h-14 pl-6 pr-12 focus-visible:ring-blue-500/50 text-white"
                                    />
                                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-white/5">
                                        <Smile size={20} className="text-white/40" />
                                    </Button>
                                </div>
                                <Button type="submit" className="h-14 w-14 rounded-2xl bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    <Send size={20} />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center px-8">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center animate-bounce">
                            <Zap size={48} className="text-blue-500 fill-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-white tracking-tighter">SELECT A CONVERSATION</h2>
                            <p className="text-white/40 max-w-xs mx-auto">Choose a friend from the left sidebar to start chatting in real-time.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
