import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { experiencesService } from '../services/experiencesService';

export const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const fetchComments = useCallback(async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const res = await experiencesService.getComments(postId);
            if (res.success) setComments(res.data || []);
        } catch (err) {
            console.error('fetchComments error:', err);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    const addComment = async (content, parentId = null) => {
        try {
            const token = await getToken();
            const res = await experiencesService.addComment({ postId, content, parentId }, token);
            if (res.success) {
                // Insert new comment at the top
                setComments(prev => [res.data, ...prev]);
            }
            return res;
        } catch (err) {
            console.error('addComment error:', err);
        }
    };

    return { comments, loading, fetchComments, addComment };
};

export default useComments;
