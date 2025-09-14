import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CircularText from './components/CircularText';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider, useAppContext } from './context/appContext.jsx';
import StudentSignup from './pages/auth/SignupStudent';
import TeacherSignup from './pages/auth/SignupTeacher';
import AdventureNexusLanding from './pages/LandingPage';
import LoginPage from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import SearchPage from './pages/SearchPage';
import { Toaster } from 'react-hot-toast';
import NavBar from './components/NavBar';
import HowItWorks from './pages/HowItWorksPage';

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

    <NavBar/>

      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup/student' element={<StudentSignup />} />
        <Route path='/signup/teacher' element={<TeacherSignup />} />
        <Route path='/works' element={<HowItWorks/>}/>

        {/* Protected Routes */}
        <Route path='/search' element={
          <ProtectedRoute>
            <SearchPage />
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
