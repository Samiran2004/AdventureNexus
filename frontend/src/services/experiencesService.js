import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

export const experiencesService = {
    // Get feed with optional filters
    getFeed: async (params = {}, token = null) => {
        const config = {};
        if (token) config.headers = { Authorization: `Bearer ${token}` };
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) query.append(key, value);
        });
        const url = `${API_URL}/api/v1/experiences/feed${query.toString() ? `?${query.toString()}` : ''}`;
        const res = await axios.get(url, config);
        return res.data;
    },

    // Get single experience
    getById: async (id, token = null) => {
        const config = {};
        if (token) config.headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_URL}/api/v1/experiences/${id}`, config);
        return res.data;
    },

    // Create experience post
    create: async (formData, token) => {
        const res = await axios.post(`${API_URL}/api/v1/experiences/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    },

    // Toggle like
    toggleLike: async (id, token) => {
        const res = await axios.post(`${API_URL}/api/v1/experiences/like/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // Toggle save
    toggleSave: async (id, token) => {
        const res = await axios.post(`${API_URL}/api/v1/experiences/save/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // Add comment
    addComment: async (payload, token) => {
        const res = await axios.post(`${API_URL}/api/v1/experiences/comments`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // Get comments
    getComments: async (postId) => {
        const res = await axios.get(`${API_URL}/api/v1/experiences/comments/${postId}`);
        return res.data;
    },

    // Delete experience post
    delete: async (id, token) => {
        const res = await axios.delete(`${API_URL}/api/v1/experiences/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};
