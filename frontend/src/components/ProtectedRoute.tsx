import React, { useEffect } from 'react';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { useAppContext } from '../context/appContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth();
    const { fetchUser, userData } = useAppContext();

    // Fetch user data when authenticated
    useEffect(() => {
        if (isSignedIn && !userData) {
            fetchUser().catch(error => {
                console.error('Failed to fetch user data:', error);
            });
        }
    }, [isSignedIn, userData, fetchUser]);

    // Show loading while auth state is being determined
    

    // Redirect to Clerk sign-in if not authenticated
    if (!isSignedIn) {
        return <RedirectToSignIn redirectUrl="/" />;
    }

    // Render protected content if authenticated
    return <>{children}</>;
};

export default ProtectedRoute;
