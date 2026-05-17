import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export const useCommunitySocket = ({ setPosts, setSelectedPost, setStories }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Connect Once
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL || 'https://adventure-nexus-backend.onrender.com');

    // 2. Listener: Like Update (Sync across clients)
    socketRef.current.on('community:like', (data) => {
      setPosts(prev => prev.map(post => 
        post._id === data.targetId ? { ...post, likes: data.likes } : post
      ));
      setSelectedPost(prev => {
        if (prev && prev._id === data.targetId) {
          return { ...prev, likes: data.likes };
        }
        return prev;
      });
    });

    // 3. Listener: New Comment (Deduplicate sender's own optimistic update)
    socketRef.current.on('community:comment', (data) => {
      setPosts(prev => prev.map(post => 
        post._id === data.postId ? { ...post, repliesCount: post.repliesCount + 1 } : post
      ));
      setSelectedPost(prev => {
        if (prev && prev._id === data.postId) {
          const commentsList = prev.comments || [];
          if (commentsList.some(c => c._id === data.comment._id)) return prev; // Ignore duplicate
          return { 
            ...prev, 
            comments: [...commentsList, data.comment], 
            repliesCount: prev.repliesCount + 1 
          };
        }
        return prev;
      });
    });

    // 4. Listener: New Story
    socketRef.current.on('community:story', (data) => {
      setStories(prev => {
        const alreadyExists = prev.some(s => s._id === data.story._id);
        if (alreadyExists) return prev;
        return [data.story, ...prev];
      });
      toast.success(`New travel story from ${data.clerkUserId}!`, { icon: '📖' });
    });

    // 5. Listener: New Post
    socketRef.current.on('community:post', (data) => {
      setPosts(prev => {
        const alreadyExists = prev.some(p => p._id === data.post._id);
        if (alreadyExists) return prev;
        return [data.post, ...prev];
      });
      toast.success('New discussion started!', { icon: '💬' });
    });

    // Cleanup exactly on unmount
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [setPosts, setSelectedPost, setStories]);

  return socketRef.current;
};
