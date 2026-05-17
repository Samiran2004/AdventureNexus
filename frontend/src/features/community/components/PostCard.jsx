import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Bookmark, Share2, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const PostCard = memo(({ 
  discussion, 
  clerkUserId, 
  onLike, 
  onSave,
  onShare,
  onOpenDetail,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const isAuthor = clerkUserId && discussion.userId?.clerkUserId === clerkUserId;
  const isLiked = clerkUserId && discussion.likes?.includes(clerkUserId);

  return (
    <Card className="bg-[#0f0f13]/80 border-white/5 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 group">
      <CardContent className="p-4 sm:p-8">
        <div className="flex items-start gap-3 sm:gap-6">
          {/* Avatar Column */}
          <div 
            className="w-10 h-10 sm:w-16 sm:h-16 rounded-[1.25rem] sm:rounded-3xl bg-gradient-to-tr from-primary/20 to-indigo-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform border border-white/5 shadow-inner"
            onClick={(e) => { e.stopPropagation(); navigate(`/user/profile/${discussion.userId?.clerkUserId}`); }}
          >
            {discussion.userId?.profilepicture ? (
              <img src={discussion.userId.profilepicture} alt={discussion.userId.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base sm:text-xl font-black text-primary uppercase">
                {discussion.userId?.username?.charAt(0) || 'U'}
              </span>
            )}
          </div>

          {/* Content Column */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-2">
              <span 
                className="font-black text-xs sm:text-sm uppercase tracking-widest text-foreground/90 hover:text-primary cursor-pointer transition-colors truncate max-w-[80px] sm:max-w-none"
                onClick={(e) => { e.stopPropagation(); navigate(`/user/profile/${discussion.userId?.clerkUserId}`); }}
              >
                {discussion.userId?.username || 'Traveler'}
              </span>
              <span className="text-xs font-bold text-muted-foreground">•</span>
              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {new Date(discussion.createdAt).toLocaleDateString()}
              </span>
              <Badge variant="outline" className="ml-auto bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-widest text-[8px] sm:text-[10px] font-black shrink-0">
                {discussion.category}
              </Badge>
              {isAuthor && (
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  {onEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(discussion); }}
                      className="text-muted-foreground hover:text-primary transition-all p-1 rounded-md hover:bg-white/5 hover:scale-105"
                      title="Edit Post"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(discussion._id); }}
                      className="text-muted-foreground hover:text-pink-500 transition-all p-1 rounded-md hover:bg-white/5 hover:scale-105"
                      title="Delete Post"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <h3 
              className="text-lg sm:text-2xl font-black mb-3 cursor-pointer group-hover:text-primary transition-colors leading-tight truncate"
              onClick={() => onOpenDetail(discussion)}
            >
              {discussion.title}
            </h3>

            {discussion.destinationTags && discussion.destinationTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {discussion.destinationTags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] sm:text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-muted-foreground line-clamp-3 mb-6 text-xs sm:text-sm leading-relaxed font-medium">
              {discussion.content}
            </p>

            {/* Images Array */}
            {discussion.images && discussion.images.length > 0 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {discussion.images.map((img, i) => (
                        <img key={i} src={img} alt="attachment" className="h-24 sm:h-32 w-auto object-cover rounded-2xl border border-white/10 shadow-lg" />
                    ))}
                </div>
            )}

            {/* Shared Trip Card Preview */}
            {discussion.tripId && (
                <div 
                  className="mb-6 p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors shadow-inner" 
                  onClick={() => navigate(`/plan/${discussion.tripId._id}`)}
                >
                    <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-primary font-black mb-1">Shared Trip</span>
                        <span className="font-black text-sm sm:text-lg text-foreground/90 truncate">{discussion.tripId.title || 'Adventure Trip'}</span>
                        <span className="text-[10px] sm:text-sm font-bold text-muted-foreground mt-1 truncate">
                            {discussion.tripId.destinations?.length || 0} Destinations • {discussion.tripId.budget?.currency || '$'} {discussion.tripId.budget?.amount || '0'}
                        </span>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <ArrowRight className="text-primary" size={14} />
                    </div>
                </div>
            )}

            {/* Interactions */}
            <div className="flex items-center gap-4 sm:gap-8 text-[11px] sm:text-sm font-black uppercase tracking-widest">
              <span
                className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => onOpenDetail(discussion)}
              >
                <MessageSquare size={16} className="text-indigo-400" /> {discussion.repliesCount} <span className="hidden sm:inline">Replies</span>
              </span>
              
              <span
                className={`flex items-center gap-1.5 cursor-pointer transition-all ${isLiked ? 'text-pink-500 scale-105' : 'text-muted-foreground hover:text-pink-500'}`}
                onClick={() => onLike(discussion._id)}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /> {discussion.likes?.length || 0} <span className="hidden sm:inline">Likes</span>
              </span>
              
              <span
                className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors ml-auto"
                onClick={(e) => { e.stopPropagation(); onSave(discussion._id); }}
              >
                <Bookmark size={16} />
              </span>
              
              <span
                className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-indigo-400 transition-colors"
                onClick={(e) => { e.stopPropagation(); onShare(discussion._id, discussion.title, discussion.content); }}
              >
                <Share2 size={16} />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PostCard.displayName = 'PostCard';
