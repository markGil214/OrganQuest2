import React from 'react';
import Organ from '../components/Organ';
import { Button } from '../components/ui/Button';

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
    window.location.href = '#register';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 overflow-hidden">
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="animate-scale-in">
          <h1 className="text-7xl md:text-8xl font-bold text-white drop-shadow-2xl mb-4">
            OrganQuest
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-medium mb-12 drop-shadow-lg">
            The Human Anatomy Explorer
          </p>
          <Button
            onClick={handleGetStarted}
            size="xl"
            className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-xl px-12 py-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)] transform hover:scale-110 transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
