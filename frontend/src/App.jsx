import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loader from './components/Loader';
import StudentSignup from './pages/auth/SignupStudent';
import TeacherSignup from './pages/auth/SignupTeacher';
import LoginPage from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import SchoolSyncLanding from './pages/LandingPage';

function App() {
  const [loading, setLoading] = useState(true);

  useState(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className='h-screen flex justify-center items-center border-8'>
        {/* <LoginPage/> */}
        <Loader />
        {/* <CircularText/> */}
      </div>
    );
  }

  return (
    // <div className="relative h-screen">

    //   {/* LoginPage as foreground content */}
    //   <div className="relative z-10">
    //     {/* <LoginPage /> */}
    //     {/* <StudentSignup/> */}
    //     <PageNotFound />
    //   </div>
    // </div>

    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup/student' element={<StudentSignup />} />
      <Route path='/signup/teacher' element={<TeacherSignup />} />

      {/* Protected Routes */}
      {/* <Route path='/student/homepage',/> */}

      {/* Default Route:- Redirect to Login page */}
      {/* <Route path='/' element={<Navigate to="/login" replace />} /> */}

      {/* Landing Page:- Redirect to landing page */}
      <Route path='/' element={<SchoolSyncLanding/>}/>

      {/* 404 Not Found Page */}
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}

export default App;
