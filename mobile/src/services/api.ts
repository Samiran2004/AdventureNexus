import axios from 'axios';
import { Platform } from 'react-native';

// For local development, change this to your machine's local IP address
// if testing on a physical device.
// For physical device over USB, we use adb reverse to map localhost:8000 to the backend
const BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
