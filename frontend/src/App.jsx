import { useEffect, useState } from 'react'; // Hooks for state and side effects
import { Toaster } from 'react-hot-toast'; // Component for toast notifications
import { Route, Routes } from 'react-router-dom'; // Components for defining routes
import CircularText from './components/CircularText'; // Loading spinner component
import ProtectedRoute from './components/ProtectedRoute'; // Component to protect private routes
import { AppProvider, useAppContext } from './context/appContext.jsx'; // Context for accessing global state
import HowItWorks from './features/marketing/pages/HowItWorksPage'; // Page components
import AdventureNexusLanding from './features/marketing/pages/LandingPage';
import PageNotFound from './features/shared/pages/PageNotFound';
import AdventureNexusReviews from './features/reviews/pages/ReviewPage';
import SearchPage from './features/planning/pages/SearchPage';
import AboutPage from './features/marketing/pages/AboutPage';
import ProfilePage from './features/user/pages/ProfilePage';
import DestinationsPage from './features/planning/pages/DestinationPage';
import IndividualDestinationPage from './features/planning/pages/IndividualDestinationPage';
import TripInspirationPage from './features/planning/pages/TripInspirationPage';
import SharedPlanPage from './features/planning/pages/SharedPlanPage';
import TripBuilderPage from './features/planning/pages/TripBuilderPage';
import AccommodationsPage from './features/planning/pages/HotelPage';
import MyTripsPage from './features/user/pages/MyTripPage';
import FlightsPage from './features/planning/pages/FlightsPage';
import ExperiencesPage from './features/planning/pages/ExperiencesPage';
import ToursPage from './features/planning/pages/ToursPage';
import PressPage from './features/marketing/pages/PressPage';
import PartnersPage from './features/marketing/pages/PartnersPage';
import HelpPage from './features/support/pages/HelpPage';
import SafetyPage from './features/legal/pages/SafetyPage';
import CommunityPage from './features/marketing/pages/CommunityPage';
import TermsPage from './features/legal/pages/TermsPage';
import PrivacyPage from './features/legal/pages/PrivacyPage';
import CookiesPage from './features/legal/pages/CookiesPage';
import AccessibilityPage from './features/legal/pages/AccessibilityPage';
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
        <Route path='/experiences' element={<ExperiencesPage />} />
        <Route path='/tours' element={<ToursPage />} />
        <Route path='/press' element={<PressPage />} />
        <Route path='/partners' element={<PartnersPage />} />
        <Route path='/help' element={<HelpPage />} />
        <Route path='/safety' element={<SafetyPage />} />
        <Route path='/community' element={<CommunityPage />} />
        <Route path='/terms' element={<TermsPage />} />
        <Route path='/privacy' element={<PrivacyPage />} />
        <Route path='/cookies' element={<CookiesPage />} />
        <Route path='/accessibility' element={<AccessibilityPage />} />
        <Route path='/shared-plan/:id' element={<SharedPlanPage />} />

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
