import React, { useEffect } from 'react'; // React hooks
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react'; // Clerk auth hooks and components
import { useAppContext } from '../context/appContext'; // Global app context

// Define props for the ProtectedRoute component
interface ProtectedRouteProps {
    children: React.ReactNode; // Child components to render if authenticated
}

// Component to protect routes that require authentication
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth(); // Check authentication status from Clerk
    const { fetchUser, userData } = useAppContext(); // Access user data functions from context

    // Effect to fetch user data from the backend when the user is authenticated
    useEffect(() => {
        // Only fetch if signed in and user data isn't already loaded
        if (isSignedIn && !userData) {
            fetchUser().catch(error => {
                console.error('Failed to fetch user data:', error);
            });
        }
    }, [isSignedIn, userData, fetchUser]); // Dependencies array

    // Show loading state while authentication status is being determined
    // (Note: Currently empty, could add a spinner here)


    // If the user is not signed in, redirect them to the Clerk sign-in page
    if (!isSignedIn) {
        return <RedirectToSignIn redirectUrl="/" />;
    }

    // If authenticated, render the protected content (children)
    return <>{children}</>;
};

export default ProtectedRoute;
