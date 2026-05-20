import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { experiencesService } from '../services/experiencesService';

export const useExperiences = (initialParams = {}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const { getToken } = useAuth();

    const fetchFeed = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await experiencesService.getFeed({ ...initialParams, ...params }, token);
            if (res.success) {
                setPosts(res.data || []);
                if (res.pagination) setPagination(res.pagination);
            }
        } catch (err) {
            console.error('useExperiences error:', err);
        } finally {
            setLoading(false);
        }
    }, [getToken, JSON.stringify(initialParams)]);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    const toggleLike = async (postId) => {
        try {
            const token = await getToken();
            // Optimistic UI update
            setPosts(prev => prev.map(p => {
                if ((p._id || p.id) !== postId) return p;
                const userId = ''; // Will be replaced by actual clerk ID check
                const isLiked = p.likes?.includes(userId);
                return {
                    ...p,
                    likes: isLiked
                        ? p.likes.filter(l => l !== userId)
                        : [...(p.likes || []), userId],
                };
            }));
            const res = await experiencesService.toggleLike(postId, token);
            // Re-fetch to get accurate state
            fetchFeed();
            return res;
        } catch (err) {
            console.error('toggleLike error:', err);
            fetchFeed(); // Revert on error
        }
    };

    const toggleSave = async (postId) => {
        try {
            const token = await getToken();
            const res = await experiencesService.toggleSave(postId, token);
            fetchFeed();
            return res;
        } catch (err) {
            console.error('toggleSave error:', err);
        }
    };

    const deletePost = async (postId) => {
        try {
            const token = await getToken();
            const res = await experiencesService.delete(postId, token);
            fetchFeed();
            return res;
        } catch (err) {
            console.error('deletePost error:', err);
        }
    };

    return { posts, loading, pagination, fetchFeed, toggleLike, toggleSave, deletePost, refetch: fetchFeed };
};

export default useExperiences;
