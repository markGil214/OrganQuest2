import { useState, useEffect, lazy, Suspense } from 'react'
import Home from './pages/Home'
import RegisterPage from './pages/RegisterPage'
import WelcomePage from './pages/WelcomePage'
import MainMenu from './pages/MainMenu'
import QuizMenu from './pages/QuizMenu'
import ScanExploreMenu from './pages/ScanExploreMenu'
import ARScanner from './pages/ARScanner'
import './App.css'

// Lazy load individual quiz pages
const MultipleChoiceQuiz = lazy(() => import('./pages/MultipleChoiceQuiz'));
const MemoryMatchingGame = lazy(() => import('./pages/MemoryMatchingGame'));
const TimedChallengeQuiz = lazy(() => import('./pages/TimedChallengeQuiz'));

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);

  // Simple hash-based routing for now
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'register') {
        setCurrentPage('register');
      } else if (hash === 'welcome') {
        setCurrentPage('welcome');
      } else if (hash === 'main-menu') {
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
      } else {
        setCurrentPage('home');
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
    window.location.href = '#welcome';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return <RegisterPage onRegistrationComplete={handleRegistrationComplete} />;
      case 'welcome':
        return <WelcomePage username={userData?.username || 'User'} />;
      case 'main-menu':
        return <MainMenu 
          username={userData?.username || 'Explorer'} 
          userAvatar={userData?.avatar ? `/avatars/avatar-${userData.avatar}.svg` : '/avatars/avatar-1.svg'} 
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
      case 'home':
      default:
        return <Home />;
    }
  };

  return renderPage();
}

export default App
