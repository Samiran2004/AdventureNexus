import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Set base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken, isSignedIn } = useAuth();

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    // Create axios instance with interceptors
    const apiClient = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        timeout: 10000,
    });

    // Setup axios interceptor to automatically add auth token
    useEffect(() => {
        const requestInterceptor = apiClient.interceptors.request.use(
            async (config) => {
                try {
                    if (isSignedIn && getToken) {
                        const token = await getToken();
                        if (token) {
                            config.headers.Authorization = `Bearer ${token}`;
                        }
                    }
                } catch (error) {
                    console.error('Error getting auth token:', error);
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for handling auth errors
        const responseInterceptor = apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.log('Authentication failed - redirecting to login');
                    // Optional: redirect to login or handle auth failure
                    // navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            apiClient.interceptors.request.eject(requestInterceptor);
            apiClient.interceptors.response.eject(responseInterceptor);
        };
    }, [isSignedIn, getToken, navigate]);

    // Fetch user profile data
    const fetchUser = async () => {
        if (!isSignedIn) {
            console.log('User not signed in');
            return null;
        }

        setLoading(true);
        try {
            const response = await apiClient.get('/api/v1/users/profile');

            console.log('User profile fetched:', response.data);
            setUserData(response.data.userData);
            return response.data;

        } catch (error) {
            console.error('Error fetching user profile:', error);

            // Handle specific error cases
            if (error.response?.status === 404) {
                console.log('User profile not found in database');
            } else if (error.response?.status === 401) {
                console.log('Authentication failed');
            }

            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateUser = async (updateData) => {
        if (!isSignedIn) {
            throw new Error('User not authenticated');
        }

        setLoading(true);
        try {
            const response = await apiClient.put('/api/v1/users/profile', updateData);
            setUserData(response.data.userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Generic API call method
    const makeAuthenticatedRequest = async (method, url, data = null) => {
        if (!isSignedIn) {
            throw new Error('User not authenticated');
        }

        try {
            const config = {
                method,
                url,
                ...(data && { data })
            };

            const response = await apiClient(config);
            return response.data;
        } catch (error) {
            console.error(`Error making ${method.toUpperCase()} request to ${url}:`, error);
            throw error;
        }
    };

    const value = {
        // Basic info
        currency,
        navigate,
        user,
        isSignedIn,

        // API clients
        axios: apiClient, // Authenticated axios instance
        getToken,

        // User data management
        userData,
        setUserData,
        loading,

        // API methods
        fetchUser,
        updateUser,
        makeAuthenticatedRequest,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
