import React from 'react';
import Organ from '../components/Organ';
import { Button } from '../components/ui/Button';

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
    window.location.href = '#main-menu';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 overflow-hidden">
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
        <div className="animate-scale-in space-y-8">
          {/* Success Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl animate-scale-in">
                <div className="text-6xl text-green-500 font-bold animate-fade-in">✓</div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-50"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white drop-shadow-2xl">
            Welcome, {username}!
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Your account has been created successfully.<br />
            Ready to explore the amazing world of human anatomy?
          </p>
          
          <Button
            onClick={handleContinue}
            size="xl"
            className="bg-white text-teal-600 hover:bg-gray-100 font-bold text-xl px-12 py-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)] transform hover:scale-110 transition-all duration-300 mt-8"
          >
            Continue to Explorer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
