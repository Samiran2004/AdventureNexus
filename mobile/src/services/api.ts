import axios from 'axios';

const api = axios.create({
    baseURL: 'https://adventurenexus.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Helper to set auth token for requests
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
