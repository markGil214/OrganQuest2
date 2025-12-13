import React, { useState, useEffect } from 'react';
import QuizTypeCard from '../components/QuizTypeCard';
import { Button } from '../components/ui/Button';
import QuizModeSelector from '../components/QuizModeSelector';
import { useLanguage } from '../contexts/LanguageContext';
import ProfileModal from '../components/ProfileModal';
import Header from '../components/Header';

const QuizMenu = () => {
  // Language hook for translations
  const { ts } = useLanguage();
  const quizText = ts('quizMenu');
  const commonText = ts('common');
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const username = localStorage.getItem('username') || 'Explorer';
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar') || '/avatars/avatar-1.svg');

  // Update avatar from localStorage when profile modal opens
  useEffect(() => {
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      setUserAvatar(storedAvatar);
    }
  }, [showProfileModal]);

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userAvatar');
    window.location.href = '/';
  };
  
  const quizTypes = [
    {
      id: 'mcq',
      icon: '🧠',
      title: quizText.multipleChoice,
      description: quizText.multipleChoiceDesc,
      route: 'quiz/mcq',
      color: '#3498db'
    },
    {
      id: 'memory',
      icon: '🧩',
      title: quizText.memoryMatching,
      description: quizText.memoryMatchingDesc,
      route: 'quiz/memory',
      color: '#e74c3c'
    },
    {
      id: 'timed',
      icon: '⚡',
      title: quizText.timedChallenge,
      description: quizText.timedChallengeDesc,
      route: 'quiz/timed',
      color: '#f39c12'
    }
  ];

  const handleCardClick = (quizType) => {
    // Memory matching always goes to solo mode directly
    if (quizType.id === 'memory') {
      window.location.href = `#${quizType.route}`;
      return;
    }
    
    // Other quiz types show mode selector
    setSelectedQuizType(quizType);
    setShowModeSelector(true);
  };

  const handleModeSelect = (mode, quizData) => {
    if (mode === 'solo') {
      // Solo mode - go directly to quiz
      window.location.href = `#${selectedQuizType.route}`;
    } else {
      // Teacher mode - include assignment ID in URL
      window.location.href = `#${selectedQuizType.route}?assignment=${quizData._id}`;
    }
  };

  const handleBackClick = () => {
    window.location.href = '#main-menu';
  };

  // Show mode selector if quiz type is selected
  if (showModeSelector && selectedQuizType) {
    return (
      <QuizModeSelector
        quizType={selectedQuizType.id}
        onModeSelect={handleModeSelect}
        onBack={() => setShowModeSelector(false)}
      />
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <Header 
        onProfileClick={handleProfileClick}
        userAvatar={userAvatar}
        username={username}
      />

      {/* Main Content */}
      <div
        className="flex-1 relative overflow-y-auto"
        style={{
          backgroundImage: 'url(/school/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="pt-8 pb-6 px-6">
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="mb-4 bg-white/90 hover:bg-white border-0 text-gray-800 shadow-lg text-sm"
          >
            <span className="text-lg mr-2">←</span>
            {commonText.back}
          </Button>
          
          <div className="text-center space-y-2 mb-8">
            <div className="text-4xl">🎮</div>
            <h1 className="text-3xl font-bold text-white drop-shadow-2xl">{quizText.title}</h1>
            <p className="text-base text-white/90">{quizText.subtitle}</p>
          </div>
        </div>

        {/* Quiz Cards Grid */}
        <div className="max-w-6xl mx-auto px-6 pb-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizTypes.map((quiz) => (
              <QuizTypeCard
                key={quiz.id}
                icon={quiz.icon}
                title={quiz.title}
                description={quiz.description}
                color={quiz.color}
                onClick={() => handleCardClick(quiz)}
              />
            ))}
          </div>
        </div>

        {/* Floating Decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-24 left-10 text-3xl animate-float opacity-20" style={{ animationDelay: '0s' }}>❓</div>
          <div className="absolute top-1/3 right-16 text-4xl animate-float opacity-20" style={{ animationDelay: '1s' }}>💡</div>
          <div className="absolute bottom-32 left-1/4 text-3xl animate-float opacity-20" style={{ animationDelay: '2s' }}>🏆</div>
          <div className="absolute top-1/2 left-20 text-2xl animate-float opacity-20" style={{ animationDelay: '1.5s' }}>⭐</div>
          <div className="absolute bottom-40 right-1/4 text-3xl animate-float opacity-20" style={{ animationDelay: '0.5s' }}>🧠</div>
        </div>
      </div>

      {showProfileModal && (
        <ProfileModal
          username={username}
          userAvatar={userAvatar}
          onClose={closeProfileModal}
          onLogout={handleLogout}
          onAvatarUpdate={(newAvatar) => setUserAvatar(newAvatar)}
        />
      )}
    </div>
  );
};

export default QuizMenu;

