import React, { useState, useEffect } from 'react';
import './ScanExploreMenu.css';

const ScanExploreMenu = () => {
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [exploredOrgans, setExploredOrgans] = useState([]);
  const [showBadge, setShowBadge] = useState(false);

  const organs = [
    {
      id: 'heart',
      name: 'Heart',
      icon: '/organs/heart.png',
      color: '#ff6b6b',
      funFact: 'Your heart beats all day!',
      description: 'The heart is your body\'s amazing pump!',
      didYouKnow: ['It beats 100,000 times a day!', 'It\'s about the size of your fist!'],
      sound: 'thump'
    },
    {
      id: 'brain',
      name: 'Brain',
      icon: '/organs/brain.png',
      color: '#845ec2',
      funFact: 'Your brain controls everything!',
      description: 'The brain is your control center!',
      didYouKnow: ['It never stops working, even when you sleep!', 'It has billions of tiny helpers called neurons!'],
      sound: 'zap'
    },
    {
      id: 'lungs',
      name: 'Lungs',
      icon: '/organs/lungs.png',
      color: '#4ecdc4',
      funFact: 'Your lungs help you breathe!',
      description: 'Lungs give you fresh air to live!',
      didYouKnow: ['You breathe about 20,000 times a day!', 'They\'re like balloons that fill with air!'],
      sound: 'whoosh'
    },
    {
      id: 'liver',
      name: 'Liver',
      icon: '/organs/liver.png',
      color: '#ff9f43',
      funFact: 'Your liver cleans your body!',
      description: 'The liver is your body\'s cleaner!',
      didYouKnow: ['It can fix itself if it gets hurt!', 'It makes bile to help digest food!'],
      sound: 'clean'
    },
    {
      id: 'kidney',
      name: 'Kidneys',
      icon: '/organs/kidney.png',
      color: '#26de81',
      funFact: 'Your kidneys filter your blood!',
      description: 'Kidneys are your body\'s filters!',
      didYouKnow: ['You have two kidneys!', 'They clean 50 gallons of blood every day!'],
      sound: 'filter'
    }
  ];

  useEffect(() => {
    // Start with scan animation
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Check if all organs explored for badge
    if (exploredOrgans.length === organs.length && exploredOrgans.length > 0) {
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 3000);
    }
  }, [exploredOrgans, organs.length]);

  const handleOrganSelect = (organ) => {
    // Add tap feedback and sound effect
    const button = document.querySelector(`[data-organ="${organ.id}"]`);
    if (button) {
      button.classList.add('tap-feedback');
      setTimeout(() => button.classList.remove('tap-feedback'), 300);
    }

    // Play sound effect (simulated)
    console.log(`Playing ${organ.sound} sound for ${organ.name}`);
    
    // Mark as explored
    if (!exploredOrgans.includes(organ.id)) {
      setExploredOrgans([...exploredOrgans, organ.id]);
    }
    
    setSelectedOrgan(organ);
  };

  const handleBack = () => {
    if (selectedOrgan) {
      setSelectedOrgan(null);
    } else {
      window.location.href = '#main-menu';
    }
  };

  const handleCloseOrganDetail = () => {
    setSelectedOrgan(null);
  };

  if (isScanning) {
    return (
      <div className="scan-loading-screen">
        <div className="scan-animation-container">
          <div className="cartoon-body">
            <div className="body-outline">
              <div className="body-head"></div>
              <div className="body-torso">
                <div className="heart-spot"></div>
                <div className="lungs-spot"></div>
                <div className="stomach-spot"></div>
              </div>
              <div className="body-arms">
                <div className="arm-left"></div>
                <div className="arm-right"></div>
              </div>
              <div className="body-legs">
                <div className="leg-left"></div>
                <div className="leg-right"></div>
              </div>
            </div>
            <div className="scan-beam"></div>
          </div>
          <div className="scan-text">
            <h2>🔍 Scanning Your Body...</h2>
            <p>Finding all the amazing organs!</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedOrgan) {
    return (
      <div className="organ-detail-screen">
        <div className="detail-header">
          <button className="back-btn-small" onClick={handleCloseOrganDetail}>
            ← Back
          </button>
          <h2 className="detail-title">Meet Your {selectedOrgan.name}!</h2>
        </div>

        <div className="organ-illustration">
          <div 
            className="large-organ-icon"
            style={{ backgroundColor: selectedOrgan.color }}
          >
            <img src={selectedOrgan.icon} alt={selectedOrgan.name} />
          </div>
        </div>

        <div className="organ-info">
          <p className="organ-description">{selectedOrgan.description}</p>
          
          <div className="did-you-know-box">
            <h3>🤔 Did You Know?</h3>
            {selectedOrgan.didYouKnow.map((fact, index) => (
              <p key={index} className="fact-item">• {fact}</p>
            ))}
          </div>
        </div>

        <button className="big-back-button" onClick={() => window.location.href = `/ar-viewer/organ-viewer.html?organ=${selectedOrgan.id}`}>
          ✨ Explore {selectedOrgan.name} in AR!
        </button>
      </div>
    );
  }

  return (
    <div className="kids-scan-explore">
      {/* Header */}
      <div className="kids-header">
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>
        <div className="progress-indicator">
          <span className="progress-text">
            {exploredOrgans.length}/{organs.length} organs explored!
          </span>
          <div className="progress-stars">
            {Array.from({ length: organs.length }, (_, i) => (
              <span 
                key={i} 
                className={`star ${exploredOrgans.length > i ? 'filled' : ''}`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="kids-title">
        <h1>🌟 Pick an Organ! 🌟</h1>
        <p>Tap to learn about your amazing body!</p>
      </div>

      {/* Organs Grid */}
      <div className="kids-organs-grid">
        {organs.map((organ) => (
          <button
            key={organ.id}
            data-organ={organ.id}
            className={`kid-organ-button ${exploredOrgans.includes(organ.id) ? 'explored' : ''}`}
            onClick={() => handleOrganSelect(organ)}
            style={{ backgroundColor: organ.color }}
          >
            <div className="organ-icon-large">
              <img src={organ.icon} alt={organ.name} />
            </div>
            <div className="organ-content">
              <h3 className="organ-name">{organ.name}</h3>
              <p className="organ-fun-fact">{organ.funFact}</p>
            </div>
            {exploredOrgans.includes(organ.id) && (
              <div className="explored-badge">✅</div>
            )}
            <div className="sparkles">
              <span className="sparkle sparkle-1">✨</span>
              <span className="sparkle sparkle-2">⭐</span>
              <span className="sparkle sparkle-3">💫</span>
            </div>
          </button>
        ))}
      </div>

      {/* Achievement Badge */}
      {showBadge && (
        <div className="achievement-overlay">
          <div className="achievement-badge">
            <div className="badge-icon">🏆</div>
            <h2>Organ Expert!</h2>
            <p>You explored all the organs!</p>
            <div className="celebration-confetti">
              <span>🎉</span>
              <span>🎊</span>
              <span>🌟</span>
              <span>✨</span>
              <span>🎈</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanExploreMenu;
