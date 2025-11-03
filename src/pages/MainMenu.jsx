import React, { useState, useEffect } from 'react';
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
  
  // 🎯 LAZY LOADING SETTINGS - Load 2 buttons initially, then more on scroll
  const INITIAL_BUTTONS = 2;  // Show 2 buttons first
  const [visibleButtons, setVisibleButtons] = useState(INITIAL_BUTTONS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  // Load more buttons on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Check if user scrolled near bottom (within 200px)
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - 200;
      
      if (scrollPosition >= bottomPosition && visibleButtons < menuOptions.length && !isLoadingMore) {
        setIsLoadingMore(true);
        // Simulate loading delay
        setTimeout(() => {
          setVisibleButtons(prev => Math.min(prev + 2, menuOptions.length)); // Load 2 more at a time
          setIsLoadingMore(false);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleButtons, menuOptions.length, isLoadingMore]);

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
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 overflow-hidden relative">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
                           radial-gradient(circle at 80% 80%, white 2px, transparent 2px),
                           radial-gradient(circle at 40% 20%, white 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 150px 150px, 80px 80px',
          animation: 'float 20s ease-in-out infinite'
        }} />
      </div>

      {/* Language Toggle Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => changeLanguage(language === 'english' ? 'filipino' : 'english')}
          className="bg-white hover:bg-gray-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-bold text-indigo-600 transition-all hover:scale-105 hover:shadow-xl active:scale-95 border-2 border-indigo-200"
        >
          <span className="text-lg mr-1">{language === 'english' ? '🇵🇭' : '🇬🇧'}</span>
          {language === 'english' ? 'Filipino' : 'English'}
        </button>
      </div>

      {/* Header Section */}
      <header className="flex justify-between items-start p-6 md:p-8 relative z-10">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{menuText.greeting}, {username}! 👋</h2>
          <p className="text-white/95 text-base md:text-lg font-medium drop-shadow">{menuText.subtitle}</p>
        </div>
        
        <button
          onClick={handleProfileClick}
          className="relative group flex-shrink-0"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-yellow-300 group-active:scale-95">
            <img 
              src={userAvatar} 
              alt={`${username}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 border-3 border-white rounded-full animate-pulse" />
        </button>
      </header>

      {/* Logo and Title Section */}
      <div className="flex flex-col items-center gap-3 py-4 md:py-6 relative z-10">
        <div className="flex flex-col items-center">
          <div className="text-6xl md:text-7xl animate-float drop-shadow-lg">🫀</div>
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mt-4 tracking-tight">{menuText.appTitle}</h1>
          <p className="text-white/95 text-lg md:text-xl font-semibold mt-2 drop-shadow">{menuText.tagline}</p>
        </div>
      </div>

      {/* Menu Buttons Grid */}
      <div className="max-w-5xl mx-auto px-6 md:px-8 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {menuOptions.slice(0, visibleButtons).map((option, index) => (
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
          
          {/* Skeleton loaders while loading more */}
          {isLoadingMore && (
            <>
              {[1, 2].map((skeleton) => (
                <div
                  key={`skeleton-${skeleton}`}
                  className="w-full rounded-3xl p-6 md:p-8 bg-white/20 backdrop-blur-sm border-4 border-white/30 animate-pulse"
                >
                  <div className="flex items-center gap-4 md:gap-5">
                    {/* Icon skeleton */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/30" />
                    
                    {/* Text skeleton */}
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-white/30 rounded-lg w-3/4" />
                      <div className="h-4 bg-white/20 rounded-lg w-full" />
                    </div>
                    
                    {/* Arrow skeleton */}
                    <div className="w-8 h-8 bg-white/30 rounded-full" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {/* Scroll down indicator */}
        {visibleButtons < menuOptions.length && !isLoadingMore && (
          <div className="text-center mt-8 animate-bounce">
            <div className="inline-block bg-white/90 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-xl border-2 border-white/50">
              <p className="text-indigo-600 text-lg font-black flex items-center gap-2">
                <span className="text-2xl">👇</span>
                Scroll down to see more options!
                <span className="text-2xl">👇</span>
              </p>
            </div>
          </div>
        )}
        
        {/* All loaded indicator */}
        {visibleButtons >= menuOptions.length && visibleButtons > INITIAL_BUTTONS && (
          <div className="text-center mt-8">
            <div className="inline-block bg-white/90 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-xl border-2 border-white/50">
              <p className="text-indigo-600 text-lg font-black flex items-center gap-2">
                <span className="text-2xl">✨</span>
                All options loaded!
                <span className="text-2xl">✨</span>
              </p>
            </div>
          </div>
        )}
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
        {/* Floating organs */}
        <div className="absolute top-32 left-10 text-4xl animate-float opacity-20 drop-shadow-lg" style={{ animationDelay: '0s' }}>💖</div>
        <div className="absolute top-48 right-20 text-5xl animate-float opacity-20 drop-shadow-lg" style={{ animationDelay: '1s' }}>🧠</div>
        <div className="absolute bottom-48 left-24 text-4xl animate-float opacity-20 drop-shadow-lg" style={{ animationDelay: '2s' }}>🫁</div>
        <div className="absolute top-1/2 right-16 text-3xl animate-float opacity-20 drop-shadow-lg" style={{ animationDelay: '1.5s' }}>🫘</div>
        <div className="absolute bottom-32 right-1/3 text-4xl animate-float opacity-20 drop-shadow-lg" style={{ animationDelay: '0.5s' }}>⭐</div>
        
        {/* Sparkles */}
        <div className="absolute top-24 right-1/4 text-3xl animate-twinkle opacity-30" style={{ animationDelay: '0s' }}>✨</div>
        <div className="absolute bottom-24 left-1/4 text-2xl animate-twinkle opacity-30" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-1/3 left-1/3 text-2xl animate-twinkle opacity-30" style={{ animationDelay: '2s' }}>💫</div>
        
        {/* Circles */}
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
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
