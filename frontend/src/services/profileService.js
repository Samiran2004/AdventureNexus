import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

export const profileService = {
    // 1. Get profile & dynamic stats
    getProfile: async (clerkUserId, token) => {
        const res = await axios.get(`${API_URL}/api/v1/users/${clerkUserId}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },

    // 2. Get user posts
    getPosts: async (clerkUserId, token) => {
        const res = await axios.get(`${API_URL}/api/v1/users/${clerkUserId}/posts`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },

    // 3. Get user experiences
    getExperiences: async (clerkUserId, token) => {
        const res = await axios.get(`${API_URL}/api/v1/users/${clerkUserId}/experiences`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },

    // 4. Get user comments
    getComments: async (clerkUserId, token) => {
        const res = await axios.get(`${API_URL}/api/v1/users/${clerkUserId}/comments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },

    // 5. Get user liked posts
    getLikes: async (clerkUserId, token) => {
        const res = await axios.get(`${API_URL}/api/v1/users/${clerkUserId}/likes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },

    // 6. Get user groups
    getGroups: async (clerkUserId, token) => {
        const res = await axios.get(`${API_URL}/api/v1/users/${clerkUserId}/groups`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },

    // 7. Update profile details (Form data with optional profile image)
    updateProfile: async (formData, token) => {
        const res = await axios.put(`${API_URL}/api/v1/users/update`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    // 8. Delete post
    deletePost: async (postId, token) => {
        const res = await axios.delete(`${API_URL}/api/v1/community/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },

    // 9. Delete comment
    deleteComment: async (commentId, token) => {
        const res = await axios.delete(`${API_URL}/api/v1/community/comments/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
};
