import api from './api';

export const planService = {
    // GET AI recommendations for logged-in user
    async getRecommendations(token: string) {
        const res = await api.get('/plans/recommendations', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // POST search with AI
    async searchDestination(token: string, payload: {
        to: string;
        from: string;
        date: string;
        travelers: number;
        budget: number;
        budget_range: string;
        duration: number;
    }) {
        const res = await api.post('/plans/search/destination', payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // GET a public plan by ID
    async getPublicPlan(id: string) {
        const res = await api.get(`/plans/public/${id}`);
        return res.data;
    },

    // GET images for a destination
    async getDestinationImages(token: string, destinationName: string) {
        const res = await api.post('/plans/search/destination-images', {
            query: destinationName,
            count: 12
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // POST save an AI-generated plan to user's personal list
    async savePlan(token: string, planId: string) {
        const res = await api.post(`/plans/${planId}/save`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // DELETE unsave an AI-generated plan from user's personal list
    async unsavePlan(token: string, planId: string) {
        const res = await api.delete(`/plans/${planId}/save`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export const likedPlansService = {
    // GET all liked plans
    async getLikedPlans(token: string) {
        const res = await api.get('/liked-plans', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // POST like a plan
    async likePlan(token: string, planId: string) {
        const res = await api.post(`/liked-plans/${planId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // DELETE unlike a plan
    async unlikePlan(token: string, planId: string) {
        const res = await api.delete(`/liked-plans/${planId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export const reviewService = {
    // GET all reviews with filters
    async getReviews(params?: {
        page?: number;
        limit?: number;
        category?: string;
        rating?: number;
        sortBy?: string;
        search?: string;
    }) {
        const res = await api.get('/reviews', { params });
        return res.data;
    },

    // POST create a review
    async createReview(token: string, review: {
        rating: number;
        comment: string;
        location: string;
        tripType: 'solo' | 'family' | 'couple' | 'adventure' | 'cultural' | 'business' | 'nature';
        userName: string;
        userAvatar: string;
        userId: string;
        clerkUserId: string;
        tripDuration: string;
        travelers: string;
        images?: string[];
    }) {
        const res = await api.post('/reviews', review, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // PUT like a review
    async likeReview(token: string, id: string) {
        const res = await api.put(`/reviews/${id}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export const userService = {
    // GET user profile
    async getProfile(token: string) {
        const res = await api.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export const communityService = {
    // GET user profile by clerk ID
    async getUserProfile(token: string, clerkUserId: string) {
        const res = await api.get(`/community/profile/${clerkUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    // POST toggle follow
    async toggleFollow(token: string, clerkUserId: string) {
        const res = await api.post(`/community/follow/${clerkUserId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },

    async updateProfile(token: string, profileData: any) {
        const res = await api.patch('/users/profile', profileData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },
};
