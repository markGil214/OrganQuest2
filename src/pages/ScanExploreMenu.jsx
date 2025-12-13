import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const ScanExploreMenu = () => {
  // Language hook for translations
  const { ts } = useLanguage();
  const scanText = ts('scanExplore');
  const commonText = ts('common');
  const organText = ts('organs');
  
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [exploredOrgans, setExploredOrgans] = useState([]);
  const [showBadge, setShowBadge] = useState(false);

  const organs = [
    {
      id: 'heart',
      name: organText.heart,
      icon: '/organs/heart.png',
      color: '#ff6b6b',
      funFact: 'Your heart beats all day!',
      description: 'The heart is your body\'s amazing pump!',
      didYouKnow: ['It beats 100,000 times a day!', 'It\'s about the size of your fist!'],
      sound: 'thump',
      hasCrossSection: true
    },
    {
      id: 'brain',
      name: organText.brain,
      icon: '/organs/brain.png',
      color: '#845ec2',
      funFact: 'Your brain controls everything!',
      description: 'The brain is your control center!',
      didYouKnow: ['It never stops working, even when you sleep!', 'It has billions of tiny helpers called neurons!'],
      sound: 'zap',
      hasCrossSection: true
    },
    {
      id: 'lungs',
      name: organText.lungs,
      icon: '/organs/lungs.png',
      color: '#4ecdc4',
      funFact: 'Your lungs help you breathe!',
      description: 'Lungs give you fresh air to live!',
      didYouKnow: ['You breathe about 20,000 times a day!', 'They\'re like balloons that fill with air!'],
      sound: 'whoosh',
      hasCrossSection: true
    },
    {
      id: 'liver',
      name: organText.liver,
      icon: '/organs/liver.png',
      color: '#ff9f43',
      funFact: 'Your liver cleans your body!',
      description: 'The liver is your body\'s cleaner!',
      didYouKnow: ['It can fix itself if it gets hurt!', 'It makes bile to help digest food!'],
      sound: 'clean',
      hasCrossSection: true
    },
    {
      id: 'kidney',
      name: organText.kidney,
      icon: '/organs/kidney.png',
      color: '#26de81',
      funFact: 'Your kidneys filter your blood!',
      description: 'Kidneys are your body\'s filters!',
      didYouKnow: ['You have two kidneys!', 'They clean 50 gallons of blood every day!'],
      sound: 'filter',
      hasCrossSection: true
    },
    {
      id: 'stomach',
      name: organText.stomach,
      icon: '/organs/stomach.png',
      color: '#ffd93d',
      funFact: 'Your stomach digests food!',
      description: 'The stomach breaks down your food!',
      didYouKnow: ['It makes special juice to digest food!', 'It can stretch when you eat!'],
      sound: 'gurgle',
      hasCrossSection: false
    },
    {
      id: 'intestine',
      name: organText.intestine,
      icon: '/organs/intestine.png',
      color: '#a8e6cf',
      funFact: 'Your intestines absorb nutrients!',
      description: 'Intestines help digest and absorb food!',
      didYouKnow: ['They\'re very long - about 25 feet!', 'They absorb all the good stuff from food!'],
      sound: 'digest',
      hasCrossSection: false
    },
    {
      id: 'bladder',
      name: organText.bladder,
      icon: '/organs/bladder.png',
      color: '#95e1d3',
      funFact: 'Your bladder stores urine!',
      description: 'The bladder is like a storage tank!',
      didYouKnow: ['It can hold about 2 cups of liquid!', 'It tells your brain when it\'s time to go!'],
      sound: 'drop',
      hasCrossSection: false
    },
    {
      id: 'pancreas',
      name: organText.pancreas,
      icon: '/organs/pancreas.png',
      color: '#ffd670',
      funFact: 'Your pancreas makes insulin!',
      description: 'The pancreas helps control sugar!',
      didYouKnow: ['It makes insulin to control blood sugar!', 'It helps you digest food too!'],
      sound: 'produce',
      hasCrossSection: false
    },
    {
      id: 'spleen',
      name: organText.spleen,
      icon: '/organs/spleen.png',
      color: '#b19cd9',
      funFact: 'Your spleen fights germs!',
      description: 'The spleen helps fight infections!',
      didYouKnow: ['It filters your blood!', 'It helps your immune system!'],
      sound: 'protect',
      hasCrossSection: false
    },
    {
      id: 'thyroid',
      name: organText.thyroid,
      icon: '/organs/thyroid-gland.png',
      color: '#ff6f91',
      funFact: 'Your thyroid controls energy!',
      description: 'The thyroid gland controls metabolism!',
      didYouKnow: ['It\'s shaped like a butterfly!', 'It helps control how fast you grow!'],
      sound: 'energy',
      hasCrossSection: false
    },
    {
      id: 'tongue',
      name: organText.tongue,
      icon: '/organs/tongue.png',
      color: '#ff8b94',
      funFact: 'Your tongue helps you taste!',
      description: 'The tongue helps you taste and talk!',
      didYouKnow: ['It has thousands of taste buds!', 'It\'s the strongest muscle in your body!'],
      sound: 'taste',
      hasCrossSection: false
    },
    {
      id: 'eyes',
      name: organText.eyes,
      icon: '/organs/eyes.png',
      color: '#87ceeb',
      funFact: 'Your eyes help you see!',
      description: 'Eyes let you see the world!',
      didYouKnow: ['They can see millions of colors!', 'They blink about 15-20 times per minute!'],
      sound: 'blink',
      hasCrossSection: false
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
      <div className="h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="text-center space-y-8 animate-fade-in relative z-10">
          <div className="relative">
            <div className="text-9xl animate-pulse drop-shadow-2xl">🔍</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 border-4 border-white/60 rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-5xl font-black text-white drop-shadow-lg">{scanText.scanningBody}</h2>
            <p className="text-2xl text-white/95 font-semibold drop-shadow">{scanText.findingOrgans} ✨</p>
          </div>
          <div className="flex justify-center gap-3 text-5xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🫀</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🧠</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🫁</span>
          </div>
        </div>
      </div>
    );
  }

  if (selectedOrgan) {
    return (
      <div className="h-screen p-6 relative overflow-y-auto" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <Button
            onClick={handleCloseOrganDetail}
            className="bg-white hover:bg-gray-50 text-gray-800 font-bold border-2 border-white/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 rounded-2xl"
          >
            <span className="mr-2 text-xl">←</span> {commonText.back}
          </Button>

          <Card className="bg-white/95 backdrop-blur-lg border-4 border-white/50 shadow-2xl rounded-3xl p-8 space-y-6">
            {/* Organ icon with fun animation */}
            <div className="flex justify-center">
              <div 
                className="w-52 h-52 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 hover:rotate-3 transition-all duration-300 border-4 border-white/40"
                style={{ backgroundColor: selectedOrgan.color }}
              >
                <img 
                  src={selectedOrgan.icon} 
                  alt={selectedOrgan.name} 
                  className="w-40 h-40 object-contain drop-shadow-lg animate-float" 
                />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              {scanText.meetYour} {selectedOrgan.name}! 🎉
            </h2>

            <p className="text-xl text-gray-800 text-center font-bold leading-relaxed">
              {selectedOrgan.description}
            </p>

            <div className="bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-100 rounded-3xl p-6 border-4 border-yellow-300 shadow-lg">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">🤔</span> {scanText.didYouKnow}
              </h3>
              <div className="space-y-3">
                {selectedOrgan.didYouKnow.map((fact, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="text-2xl flex-shrink-0">✨</span>
                    <p className="text-gray-800 text-base md:text-lg font-medium leading-relaxed">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => window.location.href = `/ar-viewer/organ-viewer.html?organ=${selectedOrgan.id}`}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-black text-lg md:text-xl py-7 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 border-2 border-white/30"
              size="lg"
            >
              <span className="mr-2 text-2xl">✨</span>
              {scanText.exploreInAR} {selectedOrgan.name} in AR!
            </Button>

            {selectedOrgan.hasCrossSection && (
              <Button
                onClick={() => window.location.hash = `interactive/${selectedOrgan.id}`}
                className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-black text-lg md:text-xl py-7 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 border-2 border-white/30"
                size="lg"
              >
                <span className="mr-2 text-2xl">🔬</span>
                {scanText.exploreCrossSection}
              </Button>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-6 relative overflow-y-auto" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6 relative z-10">
        <Button
          onClick={handleBack}
          className="bg-white hover:bg-gray-50 text-gray-800 font-bold border-2 border-white/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 rounded-2xl"
        >
          <span className="mr-2 text-xl">←</span> {scanText.backToMenu}
        </Button>
      </div>

      {/* Title */}
      <div className="text-center mb-6 space-y-2 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">
          🌟 {scanText.chooseOrgan} 🌟
        </h1>
        <p className="text-xl md:text-2xl text-white/95 font-bold drop-shadow-lg">
          {scanText.tapDiscover}
        </p>
      </div>

      {/* Organs List - Card Style */}
      <div className="max-w-3xl mx-auto space-y-4 pb-20 relative z-10">
        {organs.map((organ, index) => (
          <button
            key={organ.id}
            data-organ={organ.id}
            onClick={() => handleOrganSelect(organ)}
            className={cn(
              "w-full rounded-3xl p-5 md:p-6 shadow-xl transform transition-all duration-300",
              "hover:scale-[1.03] hover:shadow-2xl active:scale-[0.97]",
              "flex items-center gap-4 md:gap-5 group relative overflow-hidden",
              "border-4 border-white/40 hover:border-white/60",
              "animate-slide-in"
            )}
            style={{ 
              backgroundColor: organ.color,
              animationDelay: `${index * 0.05}s`
            }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" 
                 style={{ transition: 'transform 0.8s ease-in-out' }} />
            
            {/* Icon Container */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg border-2 border-white/40">
              <img 
                src={organ.icon} 
                alt={organ.name} 
                className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-left relative z-10">
              <h3 className="text-xl md:text-2xl font-black text-white mb-1 drop-shadow-lg">
                {organ.name}
              </h3>
              <p className="text-sm md:text-base text-white/95 font-semibold drop-shadow line-clamp-1">
                {organ.funFact}
              </p>
            </div>

            {/* Arrow & Checkmark */}
            <div className="flex items-center gap-3 flex-shrink-0 relative z-10">
              {exploredOrgans.includes(organ.id) && (
                <div className="bg-white rounded-full p-2 shadow-xl animate-scale-in border-2 border-white/50">
                  <span className="text-xl md:text-2xl">✅</span>
                </div>
              )}
              <div className="text-white text-3xl md:text-4xl font-bold group-hover:translate-x-2 transition-transform duration-300 drop-shadow-lg">
                →
              </div>
            </div>

            {/* Bottom highlight */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 rounded-b-3xl" />
          </button>
        ))}
      </div>

      {/* Achievement Badge */}
      {showBadge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-6">
          <Card className="bg-white border-0 rounded-3xl p-12 text-center space-y-6 animate-scale-in max-w-md mx-4 shadow-2xl">
            <div className="text-9xl animate-bounce">🏆</div>
            <h2 className="text-5xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
              {scanText.organExpert}
            </h2>
            <p className="text-3xl text-gray-800 font-black leading-relaxed">
              {scanText.exploredAll}
            </p>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-4 border-yellow-400">
              <p className="text-xl font-bold text-gray-800">
                🌟 {scanText.achievementUnlocked} 🌟
              </p>
            </div>
            <div className="flex justify-center gap-4 text-6xl">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🎊</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌟</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>✨</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎈</span>
            </div>
          </Card>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes slide-in {
          0% { 
            transform: translateX(-20px); 
            opacity: 0; 
          }
          100% { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .tap-feedback {
          animation: tap 0.3s ease-out;
        }

        @keyframes tap {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ScanExploreMenu;

