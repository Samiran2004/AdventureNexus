import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

// Recursive individual comment component
const CommentItem = ({ comment, depth, i, selectedPost, getTimeAgo, setReplyingTo, navigate }) => {
  const isReply = depth > 0;
  
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        className={`flex gap-5 group relative ${isReply ? 'ml-6 md:ml-12' : ''}`}
      >
        {isReply && (
          <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent pointer-events-none -left-6 md:-left-12" />
        )}
        <div
          className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 border-2 border-border/50 shadow-lg group-hover:border-primary/50 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/profile/${comment.clerkUserId}`);
          }}
        >
          {comment.userId?.profilepicture ? (
            <img src={comment.userId.profilepicture} alt={comment.userId.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-black bg-secondary/30">{comment.userId?.username?.charAt(0)}</div>
          )}
        </div>
        <div className="flex-1 bg-muted/40 p-5 rounded-[1.5rem] rounded-tl-none group-hover:bg-muted/60 transition-all shadow-sm border border-transparent group-hover:border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span
              className="font-black text-sm tracking-tight cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/user/profile/${comment.clerkUserId}`);
              }}
            >
              {comment.userId?.fullname || comment.userId?.username || 'Traveler'}
              {selectedPost && comment.clerkUserId === selectedPost.clerkUserId && (
                <Badge className="bg-primary/20 text-primary border-none shadow-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Author</Badge>
              )}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{getTimeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80 font-medium">{comment.content}</p>
          <div className="mt-3 flex items-center gap-4">
            <button 
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              onClick={() => setReplyingTo(comment._id)}
            >
              <MessageSquare size={12} /> Reply
            </button>
          </div>
        </div>
      </motion.div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4 pl-4 border-l border-white/5">
          {comment.replies.map((reply, index) => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              depth={depth + 1} 
              i={index} 
              selectedPost={selectedPost} 
              getTimeAgo={getTimeAgo} 
              setReplyingTo={setReplyingTo} 
              navigate={navigate} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentTree = ({ comments, selectedPost, getTimeAgo, setReplyingTo }) => {
  const navigate = useNavigate();

  // Memoize the tree building to prevent lag when typing new comments
  const builtTree = useMemo(() => {
    if (!Array.isArray(comments)) return [];
    const map = {};
    const roots = [];
    
    comments.forEach(comment => {
      if (comment && comment._id) {
        map[comment._id] = { ...comment, replies: [] };
      }
    });
    
    comments.forEach(comment => {
      if (comment && comment._id) {
        const mapped = map[comment._id];
        if (comment.parentId && map[comment.parentId]) {
          map[comment.parentId].replies.push(mapped);
        } else {
          roots.push(mapped);
        }
      }
    });
    
    return roots;
  }, [comments]);

  if (!builtTree || builtTree.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground italic bg-muted/10 rounded-[2rem] border border-dashed border-border/50">
        No replies yet. Be the first to start the conversation!
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {builtTree.map((comment, i) => (
        <CommentItem 
          key={comment._id} 
          comment={comment} 
          depth={0} 
          i={i} 
          selectedPost={selectedPost} 
          getTimeAgo={getTimeAgo} 
          setReplyingTo={setReplyingTo} 
          navigate={navigate} 
        />
      ))}
    </div>
  );
};
