import axios from 'axios';

const api_url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('clerk-db-jwt'); // Or however you retrieve the token
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const communityService = {
    getPosts: async (category = '', search = '') => {
        const response = await axios.get(`${api_url}/api/v1/community/posts`, {
            params: { category, search }
        });
        return response.data;
    },

    getPostById: async (id) => {
        const response = await axios.get(`${api_url}/api/v1/community/posts/${id}`);
        return response.data;
    },

    createPost: async (postData, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/posts`, postData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    toggleLike: async (targetType, targetId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/like`, {
            targetType,
            targetId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    addComment: async (commentData, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/comments`, commentData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getEvents: async () => {
        const response = await axios.get(`${api_url}/api/v1/community/events`);
        return response.data;
    },

    toggleRSVP: async (eventId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/rsvp`, { eventId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getSpotlight: async () => {
        const response = await axios.get(`${api_url}/api/v1/community/spotlight`);
        return response.data;
    },

    getStats: async () => {
        const response = await axios.get(`${api_url}/api/v1/community/stats`);
        return response.data;
    },

    // Social & Stories
    getProfile: async (clerkUserId, token = null) => {
        const config = {};
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`
            };
        }
        const response = await axios.get(`${api_url}/api/v1/community/profile/${clerkUserId}`, config);
        return response.data;
    },

    toggleFollow: async (targetClerkUserId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/follow`, { targetClerkUserId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getStories: async (search = '', location = '') => {
        const response = await axios.get(`${api_url}/api/v1/community/stories`, {
            params: { search, location }
        });
        return response.data;
    },

    createStory: async (storyData, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/stories`, storyData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    toggleLikeStory: async (storyId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/stories/${storyId}/like`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getNotifications: async (token) => {
        const response = await axios.get(`${api_url}/api/v1/community/notifications`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    markNotificationRead: async (notificationId, token) => {
        const response = await axios.patch(`${api_url}/api/v1/community/notifications/${notificationId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getMessageHistory: async (otherClerkUserId, token) => {
        const response = await axios.get(`${api_url}/api/v1/community/messages/${otherClerkUserId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    sendMessage: async (messageData, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/messages`, messageData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
