import React, { useState, useEffect } from 'react';
import MenuButton from '../components/MenuButton';
import ProfileModal from '../components/ProfileModal';
import Header from '../components/Header';
import LearnMoreModal from '../components/LearnMoreModal';
import { useLanguage } from '../contexts/LanguageContext';

const MainMenu = ({ username = 'Explorer', userAvatar: initialAvatar = '/avatars/avatar-1.svg', onLogout }) => {
  // Language hook for translations
  const { ts, language, changeLanguage } = useLanguage();
  const menuText = ts('mainMenu');
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState(initialAvatar);

  // Update avatar from localStorage on mount and when modal opens
  useEffect(() => {
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      setUserAvatar(storedAvatar);
    }
  }, [showProfileModal]);

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
      id: 'about',
      icon: 'ℹ️',
      title: menuText.about || 'About',
      subtitle: menuText.aboutSubtitle || 'Learn about OrganQuest',
      route: '#about',
      color: '#e74c3c'
    }
  ];

  // Play click sound
  const playClickSound = () => {
    const audio = new Audio('/sounds/pop.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const handleMenuClick = (route) => {
    playClickSound();
    console.log(`Navigating to: ${route}`);
    
    // Check if it's the about route - show about modal
    if (route === '#about') {
      setShowAboutModal(true);
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
    playClickSound();
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    playClickSound();
    setShowProfileModal(false);
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Header Section with Logo */}
      <Header 
        onProfileClick={handleProfileClick}
        userAvatar={userAvatar}
        username={username}
      />

      {/* Main Content */}
      <div className="relative h-full" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {/* Language Toggle Button - Bottom Right */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => { playClickSound(); changeLanguage(language === 'english' ? 'filipino' : 'english'); }}
            className="bg-white hover:bg-gray-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-bold text-indigo-600 transition-all hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-indigo-200"
          >
            <span className="text-lg mr-1">{language === 'english' ? '🇵🇭' : '🇬🇧'}</span>
            {language === 'english' ? 'Filipino' : 'English'}
          </button>
        </div>

        {/* Greeting Section */}
        <div className="px-6 md:px-8 py-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{menuText.greeting}, {username}!</h2>
          <p className="text-white/95 text-base md:text-lg font-medium drop-shadow">{menuText.subtitle}</p>
        </div>

        {/* Menu Buttons Grid */}
        <div className="max-w-5xl mx-auto px-6 md:px-8 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {menuOptions.map((option, index) => (
              <div
                key={option.id}
                className="animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MenuButton
                  icon={option.icon}
                  title={option.title}
                  subtitle={option.subtitle}
                  color={option.color}
                  onClick={() => handleMenuClick(option.route)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          username={username}
          userAvatar={userAvatar}
          onClose={closeProfileModal}
          onLogout={onLogout}
          playClickSound={playClickSound}
          onAvatarUpdate={(newAvatar) => setUserAvatar(newAvatar)}
        />
      )}

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <LearnMoreModal
          isOpen={showLearnMoreModal}
          onClose={() => { playClickSound(); setShowLearnMoreModal(false); }}
        />
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { playClickSound(); setShowAboutModal(false); }}>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl">🎓</span>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">About Us</h2>
            </div>
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                Welcome to <strong>AR Organs Interactive</strong>, a learning platform designed to make studying the human body fun, engaging, and accessible for children. Our application uses Augmented Reality (AR) to bring human organs to life, allowing kids to explore, rotate, and interact with 3D models as if they were right in front of them.
              </p>
              <p>
                We believe that learning should be exciting, not intimidating. That's why we combined AR technology with an interactive quiz-based learning system that helps children test their knowledge, build confidence, and develop curiosity about how the human body works.
              </p>
              <div className="bg-white/70 rounded-xl p-4">
                <h4 className="font-semibold text-base mb-2">Our goal is simple:</h4>
                <ul className="space-y-1">
                  <li>✔️ Make science enjoyable</li>
                  <li>✔️ Encourage hands-on discovery</li>
                  <li>✔️ Support visual learning through immersive 3D experiences</li>
                  <li>✔️ Provide a safe and kid-friendly educational tool for students and teachers</li>
                </ul>
              </div>
              <p>
                This project is proudly developed by <strong>BSIT students</strong>, created as part of our Capstone Project. Through this app, we aim to contribute to modern learning by offering an innovative tool that blends education and technology in a way children love.
              </p>
              <p className="text-center font-medium text-purple-600 pt-2">
                Thank you for supporting our journey toward building a more interactive, future-ready learning experience for young learners.
              </p>
            </div>
            <button
              onClick={() => { playClickSound(); setShowAboutModal(false); }}
              className="w-full py-2 mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          0% { 
            transform: translateY(20px); 
            opacity: 0; 
          }
          100% { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default MainMenu;

