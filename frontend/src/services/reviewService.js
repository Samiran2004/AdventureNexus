import axios from 'axios';

// Use environment variable for backend URL in production, or relative path (proxy) in development
const API_URL = import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/reviews`
    : '/api/v1/reviews';

const getReviews = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.category && filters.category !== 'all') params.append('category', filters.category);
        if (filters.rating && filters.rating !== 'all') params.append('rating', filters.rating);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        const response = await axios.get(`${API_URL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createReview = async (reviewData, token) => {
    try {
        const config = token ? {
            headers: { Authorization: `Bearer ${token}` }
        } : {};

        const response = await axios.post(API_URL, reviewData, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const likeReview = async (id, token) => {
    try {
        const config = token ? {
            headers: { Authorization: `Bearer ${token}` }
        } : {};
        const response = await axios.put(`${API_URL}/${id}/like`, {}, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getReviews,
    createReview,
    likeReview
};
