import React, { useState } from 'react';
import MenuButton from '../components/MenuButton';
import ProfileModal from '../components/ProfileModal';
import './MainMenu.css';

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
    <div className="main-menu">
      {/* Header Section */}
      <header className="menu-header">
        <div className="greeting">
          <h2 className="hello-text">Hello, {username}!</h2>
          <p className="welcome-back">Ready to explore?</p>
        </div>
        
        <div className="user-avatar" onClick={handleProfileClick}>
          <img 
            src={userAvatar} 
            alt={`${username}'s avatar`}
            className="avatar-image"
          />
          <div className="avatar-ring"></div>
        </div>
      </header>

      {/* Logo and Title Section */}
      <div className="logo-section">
        <div className="app-logo">
          <div className="logo-icon">🫀</div>
          <h1 className="app-title">OrganQuest</h1>
          <p className="app-subtitle">Learn • Explore • Discover</p>
        </div>
      </div>

      {/* Menu Buttons Grid */}
      <div className="menu-grid">
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
      <div className="floating-decorations">
        <div className="decoration heart">💖</div>
        <div className="decoration brain">🧠</div>
        <div className="decoration lungs">🫁</div>
        <div className="decoration star">⭐</div>
        <div className="decoration sparkle">✨</div>
      </div>
    </div>
  );
};

export default MainMenu;
