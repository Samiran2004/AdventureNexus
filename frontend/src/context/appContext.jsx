import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

// Set base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

// Make sure this component is properly exported
function AppProvider({ children }) {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken, isSignedIn, isLoaded } = useAuth();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        console.log("🔄 Auth state changed:", {
            isLoaded,
            isSignedIn,
            userExists: !!user
        });

        if (isLoaded) {
            if (isSignedIn) {
                fetchUser();
            } else {
                setUserData(null);
                setError(null);
            }
        }
    }, [isLoaded, isSignedIn, fetchUser]);

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
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook - make sure it's properly defined
function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

// ✅ Consistent named exports
export { AppProvider, useAppContext };

// ✅ Optional: Add default export if needed
export default AppProvider;
