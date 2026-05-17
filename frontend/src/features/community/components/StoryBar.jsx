import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

export const StoryBar = ({ stories, isStoriesLoading }) => {
  const navigate = useNavigate();

  // Memoize grouped stories logic
  const groupedStories = useMemo(() => {
    if (!stories) return [];
    
    const reduced = stories.reduce((acc, story) => {
      const uId = story.userId?._id || story.clerkUserId;
      if (!uId) return acc;
      
      if (!acc[uId]) {
        acc[uId] = { ...story, groupedCount: 1 };
      } else {
        acc[uId].groupedCount += 1;
      }
      return acc;
    }, {});
    
    return Object.values(reduced);
  }, [stories]);

  return (
    <div className="overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-4">
        {/* Add Story Button */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
          onClick={() => navigate('/stories')}
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-dashed border-primary/50 group-hover:bg-primary/30 transition-all">
            <PlusCircle size={24} className="text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Add Story</span>
        </motion.div>

        {/* Loading Skeletons */}
        {isStoriesLoading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-16 h-16 rounded-full bg-muted animate-pulse shrink-0" />
          ))
        ) : (
          /* Grouped Stories Render */
          groupedStories.map((groupedStory) => (
            <motion.div 
              key={groupedStory.userId?._id || groupedStory.clerkUserId}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 cursor-pointer relative shrink-0"
              onClick={() => navigate(`/stories?user=${groupedStory.userId?._id || groupedStory.clerkUserId}`)}
            >
              <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-0.5 shadow-lg shadow-pink-500/20 relative">
                <img 
                  src={groupedStory.userId?.profilepicture || 'https://via.placeholder.com/150'} 
                  className="w-full h-full rounded-full object-cover"
                  alt={groupedStory.userId?.username}
                />
                {groupedStory.groupedCount > 1 && (
                  <div className="absolute -top-1 -right-1 bg-primary text-[10px] text-white font-black px-1.5 py-0.5 rounded-full border-2 border-background shadow-md">
                    {groupedStory.groupedCount}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter truncate w-16 text-center">
                {groupedStory.userId?.username || 'Traveler'}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
