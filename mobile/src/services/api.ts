import axios from 'axios';

// Use your local machine IP if testing on physical device, or 'localhost' for emulator
// Run 'hostname -I' on Linux/Mac to find your IP
const LOCAL_IP = '10.221.215.107'; // Updated to match current machine IP
const LOCAL_URL = `http://${LOCAL_IP}:8000/api/v1`;
const PROD_URL = 'https://adventurenexus.onrender.com/api/v1';

const api = axios.create({
    baseURL: PROD_URL, // Pointing to production Render URL per user request
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
