import React from 'react';
import './ScanExploreMenu.css';

const ScanExploreMenu = () => {
  const organs = [
    {
      id: 'heart',
      name: 'Heart',
      description: 'The amazing pump that keeps you alive!',
      icon: '❤️',
      color: '#e74c3c'
    },
    {
      id: 'brain',
      name: 'Brain',
      description: 'The control center of your body!',
      icon: '🧠',
      color: '#9b59b6'
    },
    {
      id: 'lungs',
      name: 'Lungs',
      description: 'Help you breathe and get oxygen!',
      icon: '🫁',
      color: '#3498db'
    },
    {
      id: 'liver',
      name: 'Liver',
      description: 'Your body\'s amazing cleaning factory!',
      icon: '🟤',
      color: '#e67e22'
    },
    {
      id: 'kidney',
      name: 'Kidneys',
      description: 'Filter waste and keep you healthy!',
      icon: '🫘',
      color: '#27ae60'
    },
    {
      id: 'stomach',
      name: 'Stomach',
      description: 'Breaks down food for energy!',
      icon: '🫄',
      color: '#f39c12'
    }
  ];

  const handleOrganSelect = (organId) => {
    console.log(`Selected organ: ${organId}`);
    window.location.href = `#ar-scanner/${organId}`;
  };

  const handleBack = () => {
    window.location.href = '#main-menu';
  };

  return (
    <div className="scan-explore-menu">
      {/* Header Section */}
      <header className="scan-menu-header">
        <div className="scan-greeting">
          <h2 className="scan-hello-text">Scan & Explore</h2>
          <p className="scan-welcome-back">Choose an organ to discover!</p>
        </div>
        
        <button 
          className="scan-back-button"
          onClick={handleBack}
        >
          ← Back
        </button>
      </header>

      {/* Logo and Title Section */}
      <div className="scan-logo-section">
        <div className="scan-app-logo">
          <div className="scan-logo-icon">🔍</div>
          <h1 className="scan-app-title">AR Scanner</h1>
          <p className="scan-app-subtitle">Point • Scan • Learn</p>
        </div>
      </div>

      {/* Menu Buttons Grid */}
      <div className="scan-menu-grid">
        {organs.map((organ) => (
          <div
            key={organ.id}
            className="scan-organ-card"
            onClick={() => handleOrganSelect(organ.id)}
          >
            <div className="scan-organ-icon">{organ.icon}</div>
            <h3 className="scan-organ-name">{organ.name}</h3>
            <p className="scan-organ-description">{organ.description}</p>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="scan-floating-decorations">
        <div className="scan-decoration scan-heart">💖</div>
        <div className="scan-decoration scan-brain">🧠</div>
        <div className="scan-decoration scan-lungs">🫁</div>
        <div className="scan-decoration scan-star">⭐</div>
        <div className="scan-decoration scan-sparkle">✨</div>
      </div>
    </div>
  );
};

export default ScanExploreMenu;
