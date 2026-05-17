import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

// Set base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

// AppProvider component to manage global state and authentication
function AppProvider({ children }) {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken, isSignedIn, isLoaded } = useAuth();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    const fetchUser = useCallback(async () => {
        if (!isSignedIn || !isLoaded) {
            console.log("🚫 Cannot fetch: isSignedIn =", isSignedIn, "isLoaded =", isLoaded);
            return;
        }

        setLoading(true);
        setError(null);
        console.log("🚀 Fetching user data...");

        try {
            const token = await getToken();

            if (!token) {
                throw new Error("No authentication token available");
            }

            console.log("📡 Making authenticated request...");
            const response = await axios.get('/api/v1/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("📊 Response received:", response.data);

            if (response.data.status === 'Success') {
                toast.success("User fetched...");
                setUserData(response.data);
                console.log("✅ User data updated successfully");
            } else {
                throw new Error(`API returned: ${response.data.status}`);
            }

        } catch (err) {
            toast.error(err.message);
            console.error("💥 Fetch user error:", err);
            setError(err.message);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, isLoaded, getToken]);

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            // Initialize Socket
            if (!socketRef.current) {
                const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'https://adventure-nexus-backend.onrender.com');
                socketRef.current = newSocket;
                setSocket(newSocket);

                newSocket.on('connect', () => {
                    console.log('✅ Socket connected:', newSocket.id);
                    newSocket.emit('identity', user.id);
                });

                newSocket.on('notification:new', (data) => {
                    toast.success("New activity in your Nexus!", { icon: '🔔' });
                });
            }
        } else if (isLoaded && !isSignedIn) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        }

        if (isLoaded) {
            if (isSignedIn) {
                fetchUser();
            } else {
                setUserData(null);
                setError(null);
            }
        }

        return () => {
            // Optional: don't disconnect on every render, only on unmount or signout
        };
    }, [isLoaded, isSignedIn, user, fetchUser]);

    useEffect(() => {
        console.log("📊 UserData state changed:", {
            hasData: !!userData,
            loading,
            error,
            data: userData
        });
    }, [userData, loading, error]);

    const value = {
        currency,
        navigate,
        user,
        isSignedIn,
        isLoaded,
        axios,
        getToken,
        userData,
        setUserData,
        loading,
        error,
        fetchUser,
        socket,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook to access the AppContext
function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

// Custom hook to access the Socket
function useSocket() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useSocket must be used within an AppProvider');
    }
    return { socket: context.socket };
}

// ✅ Consistent named exports
// eslint-disable-next-line react-refresh/only-export-components
export { AppProvider, useAppContext, useSocket };

// ✅ Optional: Add default export if needed
export default AppProvider;
