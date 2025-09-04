import React from 'react';
import Organ from '../components/Organ';
import './WelcomePage.css';

// Import organ images
import heartImg from '../assets/images/heart.svg';
import lungsImg from '../assets/images/lungs.svg';
import brainImg from '../assets/images/brain.svg';
import liverImg from '../assets/images/liver.svg';
import kidneyImg from '../assets/images/kidney.svg';

const WelcomePage = ({ username = 'User' }) => {
  const organs = [
    {
      src: heartImg,
      name: 'Heart',
      style: { top: '15%', right: '20%' },
      className: 'float-1'
    },
    {
      src: lungsImg,
      name: 'Lungs',
      style: { top: '10%', left: '15%' },
      className: 'float-2'
    },
    {
      src: brainImg,
      name: 'Brain',
      style: { bottom: '25%', right: '15%' },
      className: 'float-3'
    },
    {
      src: liverImg,
      name: 'Liver',
      style: { bottom: '20%', left: '20%' },
      className: 'float-4'
    },
    {
      src: kidneyImg,
      name: 'Kidney',
      style: { top: '50%', right: '10%' },
      className: 'float-5'
    }
  ];

  const handleContinue = () => {
    console.log('Continue clicked - navigating to main menu');
    // TODO: Replace with proper routing when React Router is implemented
    window.location.href = '#main-menu';
  };

  return (
    <div className="welcome-container">
      {/* Floating organ images */}
      {organs.map((organ, index) => (
        <Organ
          key={index}
          src={organ.src}
          name={organ.name}
          style={organ.style}
          className={organ.className}
        />
      ))}

      {/* Main content */}
      <div className="welcome-content">
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark">✓</div>
          </div>
        </div>
        
        <h1 className="welcome-title">Welcome, {username}!</h1>
        <p className="welcome-message">
          Your account has been created successfully.<br />
          Ready to explore the amazing world of human anatomy?
        </p>
        
        <button className="continue-btn" onClick={handleContinue}>
          Continue to Explorer
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
