import React from 'react';
import Organ from '../components/Organ';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

// Import organ images
import heartImg from '../assets/images/heart.svg';
import lungsImg from '../assets/images/lungs.svg';
import brainImg from '../assets/images/brain.svg';
import liverImg from '../assets/images/liver.svg';
import kidneyImg from '../assets/images/kidney.svg';

const WelcomePage = ({ username = 'User' }) => {
  // Language hook for translations
  const { ts } = useLanguage();
  const welcomeText = ts('welcome');
  
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
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundImage: 'url(/school/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
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
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl animate-scale-in">
                <div className="text-4xl text-green-500 font-bold animate-fade-in">✓</div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-50"></div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-2xl">
            {welcomeText.greeting}, {username}!
          </h1>
          <p className="text-base md:text-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            {welcomeText.successMessage}<br />
            {welcomeText.readyMessage}
          </p>
          
          <Button
            onClick={handleContinue}
            size="xl"
            className="bg-white text-teal-600 hover:bg-gray-100 font-bold text-base px-8 py-6 shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)] transform hover:scale-110 transition-all duration-300 mt-6"
          >
            {welcomeText.continueButton}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
