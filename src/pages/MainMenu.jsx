import React, { useState } from 'react';
import MenuButton from '../components/MenuButton';
import ProfileModal from '../components/ProfileModal';
import LearnMoreModal from '../components/LearnMoreModal';
import { useLanguage } from '../contexts/LanguageContext';

const MainMenu = ({ username = 'Explorer', userAvatar = '/avatars/avatar-1.svg', onLogout }) => {
  // Language hook for translations
  const { ts, language, changeLanguage } = useLanguage();
  const menuText = ts('mainMenu');
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  const menuOptions = [
    {
      id: 'scan',
      icon: '🔍',
      title: menuText.scanExplore,
      subtitle: menuText.scanExploreSubtitle,
      route: '#scan-explore',
      color: '#e67e22'
    },
    {
      id: 'quiz',
      icon: '🧩',
      title: menuText.quizPuzzles,
      subtitle: menuText.quizPuzzlesSubtitle,
      route: '#quiz',
      color: '#9b59b6'
    },
    {
      id: 'learn',
      icon: '📚',
      title: menuText.learnMore,
      subtitle: menuText.learnMoreSubtitle,
      route: '#learn-more',
      color: '#3498db'
    },
    {
      id: 'exit',
      icon: '🚪',
      title: menuText.exit,
      subtitle: menuText.exitSubtitle,
      route: '#home',
      color: '#e74c3c'
    }
  ];

  const handleMenuClick = (route) => {
    console.log(`Navigating to: ${route}`);
    
    // Check if it's the exit route - do nothing (disabled for now)
    if (route === '#home' || route === '#exit') {
      console.log('Exit button clicked - navigation disabled');
      return;
    }
    
    // Check if it's the learn-more route
    if (route === '#learn-more') {
      setShowLearnMoreModal(true);
    } else {
      window.location.href = route;
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 overflow-hidden relative">
      {/* Language Toggle Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => changeLanguage(language === 'english' ? 'filipino' : 'english')}
          className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-purple-600 transition-all hover:scale-105"
        >
          {language === 'english' ? '🇵🇭 Filipino' : '🇬🇧 English'}
        </button>
      </div>

      {/* Header Section */}
      <header className="flex justify-between items-start p-6 relative z-10">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white drop-shadow-lg">{menuText.greeting}, {username}!</h2>
          <p className="text-white/90 text-sm">{menuText.subtitle}</p>
        </div>
        
        <button
          onClick={handleProfileClick}
          className="relative group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-110">
            <img 
              src={userAvatar} 
              alt={`${username}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping opacity-75" />
        </button>
      </header>

      {/* Logo and Title Section */}
      <div className="flex flex-col items-center gap-2 py-6 relative z-10">
        <div className="flex flex-col items-center">
          <div className="text-5xl animate-float">🫀</div>
          <h1 className="text-3xl font-bold text-white drop-shadow-2xl mt-3">{menuText.appTitle}</h1>
          <p className="text-white/90 text-sm mt-1">{menuText.tagline}</p>
        </div>
      </div>

      {/* Menu Buttons Grid */}
      <div className="max-w-4xl mx-auto px-6 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuOptions.map((option) => (
            <MenuButton
              key={option.id}
              icon={option.icon}
              title={option.title}
              subtitle={option.subtitle}
              color={option.color}
              onClick={() => handleMenuClick(option.route)}
            />
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          username={username}
          userAvatar={userAvatar}
          onClose={closeProfileModal}
          onLogout={onLogout}
        />
      )}

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <LearnMoreModal
          isOpen={showLearnMoreModal}
          onClose={() => setShowLearnMoreModal(false)}
        />
      )}

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-2xl animate-float opacity-30" style={{ animationDelay: '0s' }}>💖</div>
        <div className="absolute top-40 right-20 text-3xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🧠</div>
        <div className="absolute bottom-40 left-20 text-2xl animate-float opacity-30" style={{ animationDelay: '2s' }}>🫁</div>
        <div className="absolute top-1/2 right-10 text-xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>⭐</div>
        <div className="absolute bottom-20 right-1/3 text-2xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>
    </div>
  );
};

export default MainMenu;
