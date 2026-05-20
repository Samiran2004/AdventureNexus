import React from 'react';
import { Users, UserCheck, FileText, Sparkles, MessageSquare, Heart, Users2 } from 'lucide-react';
import { ObservabilityMetrics } from '../hooks/useAdminMetrics';

interface MetricsGridProps {
    metrics: ObservabilityMetrics;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
    const cards = [
        {
            title: 'TOTAL ADVENTURERS',
            value: metrics.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-blue-400',
            glow: 'rgba(59, 130, 246, 0.15)',
            border: 'border-blue-500/20'
        },
        {
            title: 'ACTIVE PLAYERS (24H)',
            value: metrics.activeUsers.toLocaleString(),
            icon: UserCheck,
            color: 'text-emerald-400',
            glow: 'rgba(16, 185, 129, 0.15)',
            border: 'border-emerald-500/20'
        },
        {
            title: 'COMMUNITY POSTS (TODAY)',
            value: metrics.postsCreatedToday.toLocaleString(),
            icon: FileText,
            color: 'text-purple-400',
            glow: 'rgba(139, 92, 246, 0.15)',
            border: 'border-purple-500/20'
        },
        {
            title: 'EXPERIENCES (TODAY)',
            value: metrics.experiencesCreatedToday.toLocaleString(),
            icon: Sparkles,
            color: 'text-pink-400',
            glow: 'rgba(236, 72, 153, 0.15)',
            border: 'border-pink-500/20'
        },
        {
            title: 'TOTAL ENGAGEMENT (COMMENTS)',
            value: metrics.commentsCount.toLocaleString(),
            icon: MessageSquare,
            color: 'text-cyan-400',
            glow: 'rgba(6, 182, 212, 0.15)',
            border: 'border-cyan-500/20'
        },
        {
            title: 'TOTAL LIKES RECORDED',
            value: metrics.likesCount.toLocaleString(),
            icon: Heart,
            color: 'text-rose-400',
            glow: 'rgba(244, 63, 94, 0.15)',
            border: 'border-rose-500/20'
        },
        {
            title: 'GROUP MEMBERSHIPS',
            value: metrics.groupJoins.toLocaleString(),
            icon: Users2,
            color: 'text-amber-400',
            glow: 'rgba(245, 158, 11, 0.15)',
            border: 'border-amber-500/20'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className={`bg-[#0c0c0c]/80 backdrop-blur-md border ${card.border} rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_transparent] hover:shadow-[0_0_20px_${card.glow}]`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black tracking-widest text-gray-500 uppercase">{card.title}</span>
                        <card.icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl lg:text-2xl font-black text-white font-mono tracking-tight">
                            {card.value}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">LIVE DATA FEED</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MetricsGrid;
