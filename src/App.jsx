import { useState, useEffect, lazy, Suspense } from 'react'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import WelcomePage from './pages/WelcomePage'
import MainMenu from './pages/MainMenu'
import QuizMenu from './pages/QuizMenu'
import ScanExploreMenu from './pages/ScanExploreMenu'
import ARScanner from './pages/ARScanner'
import AdminDashboard from './pages/AdminDashboard'
import SuperAdminPanel from './pages/SuperAdminPanel'
import './App.css'

// Lazy load individual quiz pages
const MultipleChoiceQuiz = lazy(() => import('./pages/MultipleChoiceQuiz'));
const MemoryMatchingGame = lazy(() => import('./pages/MemoryMatchingGame'));
const TimedChallengeQuiz = lazy(() => import('./pages/TimedChallengeQuiz'));

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Cookie helper functions
  const setCookie = (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        try {
          return JSON.parse(c.substring(nameEQ.length, c.length));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  // Check for existing user data on app load
  useEffect(() => {
    const existingUserData = getCookie('organquest_user');
    if (existingUserData) {
      setUserData(existingUserData);
      // Auto-redirect to main menu if user exists and no specific hash is present
      if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#home' || window.location.hash === '#login') {
        window.location.hash = 'main-menu';
      }
    } else {
      // If no user data, redirect to login
      if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#home') {
        window.location.hash = 'login';
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // Simple hash-based routing for now
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'login') {
        setCurrentPage('login');
      } else if (hash === 'register') {
        setCurrentPage('register');
      } else if (hash === 'welcome') {
        setCurrentPage('welcome');
      } else if (hash === 'main-menu' || hash === 'menu') {
        setCurrentPage('main-menu');
      } else if (hash === 'quiz') {
        setCurrentPage('quiz');
      } else if (hash === 'quiz/mcq') {
        setCurrentPage('quiz-mcq');
      } else if (hash === 'quiz/memory') {
        setCurrentPage('quiz-memory');
      } else if (hash === 'quiz/timed') {
        setCurrentPage('quiz-timed');
      } else if (hash === 'scan-explore') {
        setCurrentPage('scan-explore');
      } else if (hash.startsWith('ar-scanner/')) {
        setCurrentPage('ar-scanner');
      } else if (hash === 'admin/dashboard') {
        setCurrentPage('admin-dashboard');
      } else if (hash === 'admin/manage') {
        setCurrentPage('admin-manage');
      } else {
        setCurrentPage('login');
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleRegistrationComplete = (formData) => {
    setUserData(formData);
    // Save user data to cookies for persistent login
    setCookie('organquest_user', formData);
    window.location.href = '#welcome';
  };

  const handleLoginSuccess = (userData) => {
    setUserData(userData);
    // Save user data to cookies for persistent login
    setCookie('organquest_user', userData);
    
    // Redirect based on role
    if (userData.role === 'admin' || userData.role === 'superuser') {
      window.location.href = '#admin/dashboard';
    } else {
      window.location.href = '#main-menu';
    }
  };

  const handleLogout = () => {
    // Clear user data and cookies
    setUserData(null);
    document.cookie = 'organquest_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '#home';
  };

  const renderPage = () => {
    // Show loading while checking authentication
    if (isCheckingAuth) {
      return (
        <div className="loading-screen" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.2rem',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Loading OrganQuest...
        </div>
      );
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <RegisterPage onRegistrationComplete={handleRegistrationComplete} />;
      case 'welcome':
        return <WelcomePage username={userData?.username || 'User'} />;
      case 'main-menu':
        return <MainMenu 
          username={userData?.username || 'Explorer'} 
          userAvatar={userData?.avatar ? `/avatars/avatar-${userData.avatar}.svg` : '/avatars/avatar-1.svg'}
          onLogout={handleLogout}
        />;
      case 'quiz':
        return <QuizMenu />;
      case 'scan-explore':
        return <ScanExploreMenu />;
      case 'ar-scanner':
        return <ARScanner />;
      case 'quiz-mcq':
        return (
          <Suspense fallback={<div className="loading-screen">Loading Multiple Choice Quiz...</div>}>
            <MultipleChoiceQuiz />
          </Suspense>
        );
      case 'quiz-memory':
        return (
          <Suspense fallback={<div className="loading-screen">Loading Memory Game...</div>}>
            <MemoryMatchingGame />
          </Suspense>
        );
      case 'quiz-timed':
        return (
          <Suspense fallback={<div className="loading-screen">Loading Timed Challenge...</div>}>
            <TimedChallengeQuiz />
          </Suspense>
        );
      case 'admin-dashboard':
        return <AdminDashboard userData={userData} onLogout={handleLogout} />;
      case 'admin-manage':
        return <SuperAdminPanel onBack={() => window.location.hash = '#admin/dashboard'} />;
      case 'home':
      case 'login':
      default:
        return <Home />;
    }
  };

  return renderPage();
}

export default App
