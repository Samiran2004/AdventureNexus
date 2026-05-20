import React, { useEffect, useRef } from 'react';
import { User, FileText, Sparkles, MessageSquare, Heart, Users2, Activity, Terminal } from 'lucide-react';
import { ActivityEvent } from '../hooks/useRealtimeEvents';

interface LiveActivityFeedProps {
    events: ActivityEvent[];
    loading: boolean;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ events, loading }) => {
    const feedRef = useRef<HTMLDivElement>(null);

    // Scroll to top on new event for terminal dashboard styling
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = 0;
        }
    }, [events]);

    const getEventDetails = (type: string) => {
        switch (type) {
            case 'user:joined':
                return {
                    icon: User,
                    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                    label: 'USER JOINED',
                    glow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                };
            case 'post:created':
                return {
                    icon: FileText,
                    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                    label: 'POST CREATED',
                    glow: 'shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                };
            case 'comment:created':
                return {
                    icon: MessageSquare,
                    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                    label: 'COMMENT ADDED',
                    glow: 'shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                };
            case 'like:added':
                return {
                    icon: Heart,
                    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                    label: 'LIKE ADDED',
                    glow: 'shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                };
            case 'group:joined':
                return {
                    icon: Users2,
                    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    label: 'GROUP JOINED',
                    glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                };
            default:
                return {
                    icon: Activity,
                    color: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
                    label: 'EVENT RECORDED',
                    glow: 'shadow-[0_0_10px_rgba(156,163,175,0.3)]'
                };
        }
    };

    return (
        <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col h-[520px] relative overflow-hidden">
            {/* Top Indicator bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>

            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <Terminal className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white tracking-widest uppercase">Live Activity Stream</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">REAL-TIME ACTIVITY SIGNAL LOGS</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest font-mono">100% SYNCED</span>
                </div>
            </div>

            {/* Scrollable Log Container */}
            <div
                ref={feedRef}
                className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent scroll-smooth font-mono text-xs"
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                        <span className="w-6 h-6 border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Establishing Pipeline...</span>
                    </div>
                ) : events.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        NO LOGS CAPTURED YET
                    </div>
                ) : (
                    events.map((evt) => {
                        const details = getEventDetails(evt.activityType);
                        const Icon = details.icon;
                        return (
                            <div
                                key={evt._id}
                                className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200"
                            >
                                <div className={`p-2 rounded-xl border ${details.color} ${details.glow} flex-shrink-0`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/5 text-gray-400">
                                            {details.label}
                                        </span>
                                        <span className="text-[9px] text-gray-600 font-bold">
                                            {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="text-white text-xs font-bold leading-relaxed break-words">
                                        <span className="text-purple-400 hover:underline cursor-pointer">@{evt.username}</span>{' '}
                                        <span className="text-gray-300 font-medium">{evt.details}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default LiveActivityFeed;
