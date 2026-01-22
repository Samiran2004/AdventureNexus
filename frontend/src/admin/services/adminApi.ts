import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/v1/admin`,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
