import React from 'react';
import { Button } from '../components/ui/Button';

const Home = () => {
  const handleGetStarted = () => {
    console.log('Get Started clicked - navigating to registration');
    window.location.href = '#register';
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
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

