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
import InteractiveViewer from './pages/InteractiveViewer'
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
    const localStorageUserData = localStorage.getItem('userData');
    const authToken = localStorage.getItem('authToken');
    const currentHash = window.location.hash.slice(1); // Remove the # symbol
    
    // Check if user is authenticated via cookie OR localStorage
    const isAuthenticated = existingUserData || (localStorageUserData && authToken);
    const userData = existingUserData || (localStorageUserData ? JSON.parse(localStorageUserData) : null);
    
    if (isAuthenticated && userData) {
      setUserData(userData);
      // Sync cookie if missing but localStorage has data
      if (!existingUserData && localStorageUserData) {
        setCookie('organquest_user', userData);
      }
      // Auto-redirect to main menu if user exists and no specific hash is present
      if (!currentHash || currentHash === 'home' || currentHash === 'login') {
        window.location.hash = 'main-menu';
      }
    } else {
      // If no user data, redirect to login (but allow register page and interactive viewer)
      const allowedWithoutAuth = currentHash === 'register' || currentHash.startsWith('interactive/');
      
      if (!allowedWithoutAuth && (!currentHash || currentHash === 'home')) {
        window.location.hash = 'login';
      } else if (!allowedWithoutAuth && currentHash && currentHash !== 'login' && currentHash !== 'register') {
        // Store the intended destination and redirect to login
        sessionStorage.setItem('redirectAfterLogin', currentHash);
        window.location.hash = 'login';
      }
      // Allow register route and interactive viewer to work without authentication
    }
    setIsCheckingAuth(false);
    
    // Handle browser back/forward button to prevent accessing protected pages after logout
    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      const protectedRoutes = ['main-menu', 'menu', 'quiz', 'scan-explore', 'admin/dashboard', 'admin/manage', 'welcome'];
      const isProtectedRoute = protectedRoutes.some(route => hash === route || hash.startsWith(route + '/'));
      
      // If user is logged out and trying to access protected route via back button
      if (isProtectedRoute && !getCookie('organquest_user')) {
        window.history.replaceState(null, '', '#login');
        window.location.hash = 'login';
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Simple hash-based routing for now
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      
      // Protected routes that require authentication
      const protectedRoutes = ['main-menu', 'menu', 'quiz', 'quiz/mcq', 'quiz/memory', 'quiz/timed', 'scan-explore', 'admin/dashboard', 'admin/manage'];
      const isProtectedRoute = protectedRoutes.some(route => hash === route || hash.startsWith(route + '/'));
      
      // Check authentication from both cookie and localStorage
      const hasAuth = userData || getCookie('organquest_user') || (localStorage.getItem('authToken') && localStorage.getItem('userData'));
      
      // If trying to access protected route without auth, redirect to login
      if (isProtectedRoute && !hasAuth) {
        window.history.replaceState(null, '', '#login');
        setCurrentPage('login');
        return;
      }
      
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
      } else if (hash === 'quiz/mcq' || hash.startsWith('quiz/mcq?')) {
        setCurrentPage('quiz-mcq');
      } else if (hash === 'quiz/memory' || hash.startsWith('quiz/memory?')) {
        setCurrentPage('quiz-memory');
      } else if (hash === 'quiz/timed' || hash.startsWith('quiz/timed?')) {
        setCurrentPage('quiz-timed');
      } else if (hash === 'scan-explore') {
        setCurrentPage('scan-explore');
      } else if (hash.startsWith('interactive/')) {
        setCurrentPage('interactive-viewer');
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
  }, [userData]); // Add userData as dependency to recheck auth on user changes

  const handleRegistrationComplete = (formData) => {
    setUserData(formData);
    // Save user data to cookies for persistent login
    setCookie('organquest_user', formData);
    
    // Replace history to prevent back navigation to register page
    window.history.replaceState(null, '', '#welcome');
    window.location.hash = 'welcome';
  };

  const handleLoginSuccess = (userData) => {
    setUserData(userData);
    // Save user data to cookies for persistent login
    setCookie('organquest_user', userData);
    
    // Check if there's a stored redirect URL
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    
    let targetHash;
    if (redirectUrl) {
      // Use the stored redirect URL
      targetHash = `#${redirectUrl}`;
    } else {
      // Redirect based on role and replace history to prevent back navigation
      targetHash = (userData.role === 'teacher' || userData.role === 'superuser') 
        ? '#admin/dashboard' 
        : '#main-menu';
    }
    
    window.history.replaceState(null, '', targetHash);
    window.location.hash = targetHash.slice(1);
  };

  const handleLogout = () => {
    // Clear user data and cookies
    setUserData(null);
    document.cookie = 'organquest_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Replace current history entry to prevent back button navigation
    window.history.replaceState(null, '', '#login');
    window.location.hash = 'login';
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
      case 'interactive-viewer':
        return <InteractiveViewer />;
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
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-background-animated">
      {renderPage()}
    </div>
  );
}

export default App
