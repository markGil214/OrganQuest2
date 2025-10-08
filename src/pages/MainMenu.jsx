import React, { useState } from 'react';
import MenuButton from '../components/MenuButton';
import ProfileModal from '../components/ProfileModal';

const MainMenu = ({ username = 'Explorer', userAvatar = '/avatars/avatar-1.svg', onLogout }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const menuOptions = [
    {
      id: 'scan',
      icon: '🔍',
      title: 'Scan & Explore',
      subtitle: 'Discover amazing organs!',
      route: '#scan-explore',
      color: '#e67e22'
    },
    {
      id: 'quiz',
      icon: '🧩',
      title: 'Quiz & Puzzles',
      subtitle: 'Test your knowledge!',
      route: '#quiz',
      color: '#9b59b6'
    },
    {
      id: 'learn',
      icon: '📚',
      title: 'Learn More',
      subtitle: 'Fun facts & stories!',
      route: '#learn-more',
      color: '#3498db'
    },
    {
      id: 'exit',
      icon: '🚪',
      title: 'Exit',
      subtitle: 'See you next time!',
      route: '#home',
      color: '#e74c3c'
    }
  ];

  const handleMenuClick = (route) => {
    console.log(`Navigating to: ${route}`);
    window.location.href = route;
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 overflow-hidden relative">
      {/* Header Section */}
      <header className="flex justify-between items-start p-6 relative z-10">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Hello, {username}!</h2>
          <p className="text-white/90 text-lg">Ready to explore?</p>
        </div>
        
        <button
          onClick={handleProfileClick}
          className="relative group"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-110">
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
      <div className="flex flex-col items-center gap-3 py-8 relative z-10">
        <div className="flex flex-col items-center">
          <div className="text-7xl animate-float">🫀</div>
          <h1 className="text-5xl font-bold text-white drop-shadow-2xl mt-4">OrganQuest</h1>
          <p className="text-white/90 text-lg mt-2">Learn • Explore • Discover</p>
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

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-30" style={{ animationDelay: '0s' }}>💖</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🧠</div>
        <div className="absolute bottom-40 left-20 text-4xl animate-float opacity-30" style={{ animationDelay: '2s' }}>🫁</div>
        <div className="absolute top-1/2 right-10 text-3xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>⭐</div>
        <div className="absolute bottom-20 right-1/3 text-4xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>
    </div>
  );
};

export default MainMenu;
