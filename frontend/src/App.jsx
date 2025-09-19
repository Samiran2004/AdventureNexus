import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import CircularText from './components/CircularText';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider, useAppContext } from './context/appContext.jsx';
import HowItWorks from './pages/HowItWorksPage';
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

// App content component that uses the context
const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user } = useAppContext(); // Now we can use the context

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className='h-screen flex justify-center items-center border-8 bg-white'>
        <CircularText text='AdventureNexus' />
      </div>
    );
  }

  return (
    <>

      <Toaster
        position='top-right'
      />

      {/* <NavBar/> */}

      <Routes>
        {/* Public Routes */}
        <Route path='/works' element={<HowItWorks />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/inspiration" element={<TripInspirationPage />} />
        <Route path="/build-trip" element={<TripBuilderPage />} />
        <Route path='/hotels' element={<AccommodationsPage />} />
        <Route path='/my-trips' element={<MyTripsPage/>}/>

        {/* Other routes */}
        <Route path="/destination/:country/:city" element={<IndividualDestinationPage />} />

        {/* Protected Routes */}
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

        {/* Landing Page */}
        <Route path='/' element={<AdventureNexusLanding />} />

        {/* 404 Not Found Page */}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  );
};

// Main App component with provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
