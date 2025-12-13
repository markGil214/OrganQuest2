import React from 'react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

const WelcomePage = ({ username = 'User' }) => {
  // Language hook for translations
  const { ts } = useLanguage();
  const welcomeText = ts('welcome');
  
  const handleContinue = () => {
    console.log('Continue clicked - navigating to main menu');
    window.location.href = '#main-menu';
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="animate-scale-in space-y-8">
          {/* Success Animation */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl animate-scale-in">
                <div className="text-4xl text-white font-bold animate-fade-in">✓</div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping opacity-50"></div>
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

