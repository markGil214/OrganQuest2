import React from 'react';
import Organ from '../components/Organ';
import './Home.css';

// Import organ images
import heartImg from '../assets/images/heart.svg';
import lungsImg from '../assets/images/lungs.svg';
import brainImg from '../assets/images/brain.svg';
import liverImg from '../assets/images/liver.svg';
import kidneyImg from '../assets/images/kidney.svg';

const Home = () => {
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

  const handleGetStarted = () => {
    console.log('Get Started clicked - navigating to registration');
    // TODO: Replace with proper routing when React Router is implemented
    window.location.href = '#register';
  };

  return (
    <div className="home-container">
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
      <div className="main-content">
        <h1 className="title">OrganQuest</h1>
        <p className="subtitle">The Human Anatomy Explorer</p>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
