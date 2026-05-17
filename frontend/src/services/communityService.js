import axios from 'axios';

const api_url = import.meta.env.VITE_BACKEND_URL || 'https://adventure-nexus-backend.onrender.com';

const getAuthHeaders = () => {
    const token = localStorage.getItem('clerk-db-jwt'); // Or however you retrieve the token
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const communityService = {
    getPosts: async (category = '', search = '', clerkUserId = '', groupId = '', communityId = '') => {
        const response = await axios.get(`${api_url}/api/v1/community/posts`, {
            params: { category, search, clerkUserId, groupId, communityId }
        });
        return response.data;
    },

    getPostById: async (id) => {
        const response = await axios.get(`${api_url}/api/v1/community/posts/${id}`);
        return response.data;
    },

    createPost: async (postData, token) => {
        const isFormData = postData instanceof FormData;
        const headers = { Authorization: `Bearer ${token}` };
        if (isFormData) {
            headers['Content-Type'] = 'multipart/form-data';
        }
        
        const response = await axios.post(`${api_url}/api/v1/community/posts`, postData, { headers });
        return response.data;
    },

    updatePost: async (postId, postData, token) => {
        const response = await axios.put(`${api_url}/api/v1/community/posts/${postId}`, postData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deletePost: async (postId, token) => {
        const response = await axios.delete(`${api_url}/api/v1/community/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    toggleSavePost: async (postId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/posts/${postId}/save`, {}, {
            headers: { Authorization: `Bearer ${token}` }
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
    },

    // --- V3 Architecture APIs ---

    getCommunities: async () => {
        const response = await axios.get(`${api_url}/api/v1/community/communities`);
        return response.data;
    },

    joinCommunity: async (communityId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/communities/join/${communityId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getMyGroups: async (token) => {
        const response = await axios.get(`${api_url}/api/v1/community/groups/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    createGroup: async (groupData, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/groups/create`, groupData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    joinGroup: async (groupId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/groups/join/${groupId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    leaveGroup: async (groupId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/groups/leave/${groupId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getGroups: async (token) => {
        const response = await axios.get(`${api_url}/api/v1/community/groups`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getGroupById: async (groupId, token) => {
        const response = await axios.get(`${api_url}/api/v1/community/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    addMemberToGroup: async (groupId, username, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/groups/add-member`, { groupId, username }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    makeUserAdmin: async (groupId, targetUserId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/groups/make-admin`, { groupId, targetUserId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    removeUserAdmin: async (groupId, targetUserId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/groups/remove-admin`, { groupId, targetUserId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    removeMemberFromGroup: async (groupId, targetUserId, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/groups/remove-member`, { groupId, targetUserId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateGroup: async (groupId, groupData, token) => {
        const response = await axios.put(`${api_url}/api/v1/community/groups/${groupId}`, groupData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getGroupMessages: async (groupId, token) => {
        const response = await axios.get(`${api_url}/api/v1/community/groups/${groupId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    sendGroupMessage: async (groupId, content, token) => {
        const response = await axios.post(`${api_url}/api/v1/community/groups/${groupId}/messages`, { content }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    searchUsers: async (query, token) => {
        const response = await axios.get(`${api_url}/api/v1/social/search`, {
            params: { q: query },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getGroupPosts: async (groupId, token) => {
        const response = await axios.get(`${api_url}/api/v1/community/posts/group/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getCommunityPosts: async (communityId) => {
        const response = await axios.get(`${api_url}/api/v1/community/posts/community/${communityId}`);
        return response.data;
    }
};
