import { useEffect, useState } from 'react'; // Hooks for state and side effects
import { Toaster } from 'react-hot-toast'; // Component for toast notifications
import { Route, Routes } from 'react-router-dom'; // Components for defining routes
import CircularText from './components/CircularText'; // Loading spinner component
import ProtectedRoute from './components/ProtectedRoute'; // Component to protect private routes
import { AppProvider, useAppContext } from './context/appContext.jsx'; // Context for accessing global state
import HowItWorks from './pages/HowItWorksPage'; // Page components
import AdventureNexusLanding from './pages/LandingPage';
import PageNotFound from './pages/PageNotFound';
import AdventureNexusReviews from './pages/ReviewPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import DestinationsPage from './pages/DestinationPage';
import IndividualDestinationPage from './pages/IndividualDestinationPage';
import TripInspirationPage from './pages/TripInspirationPage';
import TripBuilderPage from './pages/TripBuilderPage';
import AccommodationsPage from './pages/HotelPage';
import MyTripsPage from './pages/MyTripPage';
import FlightsPage from './pages/FlightsPage';
import ChatAssistant from './components/ChatAssistant'; // Floating chat assistant
import { ChatProvider } from './context/ChatContext'; // Chat context provider

// App content component that uses the context
const AppContent = () => {
  // Local state to handle the initial loading screen
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user } = useAppContext(); // Access user auth state from context

  // Effect to simulate a loading delay on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Show loading spinner if still loading
  if (loading) {
    return (
      <div className='h-screen flex justify-center items-center border-8 bg-white'>
        <CircularText text='AdventureNexus' />
      </div>
    );
  }

  return (
    <>
      {/* Toast notification container */}
      <Toaster
        position='top-right'
      />

      {/* <NavBar/> - Navigation bar is part of the layout in individual pages */}

      {/* Define all application routes */}
      <Routes>
        {/* --- Public Routes (Accessible by everyone) --- */}
        <Route path='/works' element={<HowItWorks />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/inspiration" element={<TripInspirationPage />} />
        <Route path="/build-trip" element={<TripBuilderPage />} />
        <Route path='/hotels' element={<AccommodationsPage />} />
        <Route path='/flights' element={<FlightsPage />} />
        <Route path='/my-trips' element={<MyTripsPage />} />

        {/* --- Dynamic Routes (Routes with parameters) --- */}
        <Route path="/destination/:country/:city" element={<IndividualDestinationPage />} />

        {/* --- Protected Routes (Accessible only when logged in) --- */}
        <Route path='/search' element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path='/review-page' element={
          <ProtectedRoute>
            <AdventureNexusReviews />
          </ProtectedRoute>
        } />

        {/* --- Landing Page (Root URL) --- */}
        <Route path='/' element={<AdventureNexusLanding />} />

        {/* --- 404 Not Found Page (Catches all unknown routes) --- */}
        <Route path='*' element={<PageNotFound />} />
      </Routes>

      {/* Floating Chat Assistant - Available on all pages */}
      <ChatAssistant />
    </>
  );
};

// Main App component wrapping the content with the AppProvider
function App() {
  return (
    <AppProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AppProvider>
  );
}

export default App;
