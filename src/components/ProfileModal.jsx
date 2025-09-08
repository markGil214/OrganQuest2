import React from 'react';
import './ProfileModal.css';

const ProfileModal = ({ username, userAvatar, onClose, onLogout }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSettingsClick = (setting) => {
    console.log(`Settings clicked: ${setting}`);
    // TODO: Implement settings functionality
  };

  const handleLogout = () => {
    console.log('Logging out...');
    onClose(); // Close modal first
    if (onLogout) {
      onLogout(); // Call the logout function from App.jsx
    } else {
      // Fallback if no logout function provided
      window.location.href = '#home';
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={handleOverlayClick}>
      <div className="profile-modal">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={userAvatar} alt={`${username}'s avatar`} />
          </div>
          <h2 className="profile-name">{username}</h2>
          <p className="profile-title">Anatomy Explorer</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <span className="stat-number">12</span>
              <span className="stat-label">Organs Learned</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-number">8</span>
              <span className="stat-label">Quizzes Completed</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <span className="stat-number">85%</span>
              <span className="stat-label">Average Score</span>
            </div>
          </div>
        </div>

        <div className="profile-menu">
          <button 
            className="profile-menu-item"
            onClick={() => handleSettingsClick('avatar')}
          >
            <span className="menu-icon">👤</span>
            <span className="menu-text">Change Avatar</span>
          </button>
          
          <button 
            className="profile-menu-item"
            onClick={() => handleSettingsClick('language')}
          >
            <span className="menu-icon">🌐</span>
            <span className="menu-text">Language</span>
          </button>
          
          <button 
            className="profile-menu-item"
            onClick={() => handleSettingsClick('sound')}
          >
            <span className="menu-icon">🔊</span>
            <span className="menu-text">Sound Settings</span>
          </button>
          
          <button 
            className="profile-menu-item"
            onClick={() => handleSettingsClick('progress')}
          >
            <span className="menu-icon">📊</span>
            <span className="menu-text">View Progress</span>
          </button>
        </div>

        <div className="profile-actions">
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
