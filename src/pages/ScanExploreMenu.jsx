import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

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
    },
    {
      id: 'eyes',
      name: 'Eyes',
      icon: '/organs/eyes.png', // Using brain icon as closest match
      color: '#3742fa',
      funFact: 'Your eyes see millions of colors!',
      description: 'Eyes are your windows to the world!',
      didYouKnow: ['You can see 10 million different colors!', 'Your eyes move 50 times per second when reading!'],
      sound: 'blink'
    },
    {
      id: 'stomach',
      name: 'Stomach',
      icon: '/organs/stomach.png',
      color: '#ff6348',
      funFact: 'Your stomach churns food like a mixer!',
      description: 'The stomach breaks down your food!',
      didYouKnow: ['It can hold up to 4 liters of food!', 'Stomach acid is super strong - it could dissolve metal!'],
      sound: 'gurgle'
    },
    {
      id: 'intestine',
      name: 'Intestines',
      icon: '/organs/intestine.png',
      color: '#f39c12',
      funFact: 'Your intestines are 20 feet long!',
      description: 'Intestines absorb nutrients from food!',
      didYouKnow: ['Your small intestine is like a long winding road!', 'It has millions of tiny helpers called villi!'],
      sound: 'process'
    },
    {
      id: 'pancreas',
      name: 'Pancreas',
      icon: '/organs/pancreas.png',
      color: '#e17055',
      funFact: 'Your pancreas makes insulin!',
      description: 'The pancreas helps control your blood sugar!',
      didYouKnow: ['It\'s both an organ AND a gland!', 'It makes special juice to help digest food!'],
      sound: 'bubble'
    },
    {
      id: 'spleen',
      name: 'Spleen',
      icon: '/organs/spleen.png',
      color: '#6c5ce7',
      funFact: 'Your spleen filters blood!',
      description: 'The spleen helps fight germs!',
      didYouKnow: ['It stores red blood cells for emergencies!', 'It filters blood like a coffee filter!'],
      sound: 'filter'
    },
    {
      id: 'diaphragm',
      name: 'Diaphragm',
      icon: '/organs/diaphragm.png',
      color: '#00b894',
      funFact: 'Your main breathing muscle!',
      description: 'The diaphragm helps you breathe!',
      didYouKnow: ['It moves up and down 20,000 times a day!', 'It\'s controlled by nerves from your neck!'],
      sound: 'breathe'
    },
    {
      id: 'bladder',
      name: 'Bladder',
      icon: '/organs/bladder.png',
      color: '#f39c12',
      funFact: 'Your body\'s storage tank!',
      description: 'The bladder stores urine until you\'re ready to go!',
      didYouKnow: ['It can hold up to 2 cups of liquid!', 'It\'s made of stretchy muscle like a balloon!'],
      sound: 'drop'
    },
    {
      id: 'thyroid',
      name: 'Thyroid',
      icon: '/organs/thyroid-gland.png',
      color: '#ff6b9d',
      funFact: 'Your butterfly-shaped energy controller!',
      description: 'The thyroid controls how fast your body works!',
      didYouKnow: ['It\'s shaped like a butterfly in your neck!', 'It helps you grow and gives you energy!'],
      sound: 'flutter'
    },
    {
      id: 'tongue',
      name: 'Tongue',
      icon: '/organs/tongue.png',
      color: '#fd79a8',
      funFact: 'Your amazing taste detector!',
      description: 'The tongue helps you taste, eat, and talk!',
      didYouKnow: ['It has 10,000 tiny taste buds!', 'It\'s one of your strongest muscles!'],
      sound: 'lick'
    },
    {
      id: 'pelvis',
      name: 'Pelvis & Femur',
      icon: '/organs/pelvis-femur.png',
      color: '#a29bfe',
      funFact: 'Your body\'s strong foundation!',
      description: 'These bones support your whole body!',
      didYouKnow: ['Your femur is the longest bone in your body!', 'They help you walk, run, and jump!'],
      sound: 'bone'
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-6">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="text-9xl animate-pulse">🔍</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-white rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">Scanning Your Body...</h2>
            <p className="text-xl text-white/90">Finding all the amazing organs!</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedOrgan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button
            onClick={handleCloseOrganDetail}
            variant="outline"
            className="mb-4 bg-white/90 hover:bg-white border-0"
          >
            <span className="mr-2">←</span> Back
          </Button>

          <Card className="bg-white/95 backdrop-blur-sm border-0 p-8 space-y-6">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Meet Your {selectedOrgan.name}!
            </h2>

            <div className="flex justify-center">
              <div 
                className="w-48 h-48 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform"
                style={{ backgroundColor: selectedOrgan.color }}
              >
                <img src={selectedOrgan.icon} alt={selectedOrgan.name} className="w-32 h-32 object-contain" />
              </div>
            </div>

            <p className="text-lg text-gray-700 text-center font-medium">
              {selectedOrgan.description}
            </p>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🤔</span> Did You Know?
              </h3>
              <div className="space-y-2">
                {selectedOrgan.didYouKnow.map((fact, index) => (
                  <p key={index} className="text-gray-700 text-base leading-relaxed">
                    • {fact}
                  </p>
                ))}
              </div>
            </div>

            <Button
              onClick={() => window.location.href = `/ar-viewer/organ-viewer.html?organ=${selectedOrgan.id}`}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg py-6"
              size="lg"
            >
              <span className="mr-2">✨</span>
              Explore {selectedOrgan.name} in AR!
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-6 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-white/90 hover:bg-white border-0"
        >
          <span className="mr-2">←</span> Back
        </Button>

        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <span className="text-lg font-bold text-gray-800">
            {exploredOrgans.length}/{organs.length} organs explored!
          </span>
          <div className="flex justify-center gap-1 mt-2">
            {Array.from({ length: organs.length }, (_, i) => (
              <span 
                key={i} 
                className={cn(
                  "text-2xl transition-all",
                  exploredOrgans.length > i ? "opacity-100 scale-110" : "opacity-30 scale-90"
                )}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
          🌟 Pick an Organ! 🌟
        </h1>
        <p className="text-2xl text-white/90 font-medium drop-shadow-lg">
          Tap to learn about your amazing body!
        </p>
      </div>

      {/* Organs Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
        {organs.map((organ) => (
          <button
            key={organ.id}
            data-organ={organ.id}
            onClick={() => handleOrganSelect(organ)}
            className={cn(
              "relative rounded-3xl p-6 shadow-2xl transform transition-all duration-300",
              "hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95",
              "overflow-hidden group"
            )}
            style={{ backgroundColor: organ.color }}
          >
            <div className="relative z-10 space-y-3">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <img src={organ.icon} alt={organ.name} className="w-16 h-16 object-contain" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">{organ.name}</h3>
                <p className="text-sm text-white/90">{organ.funFact}</p>
              </div>
            </div>
            
            {exploredOrgans.includes(organ.id) && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg animate-scale-in">
                <span className="text-2xl">✅</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Achievement Badge */}
      {showBadge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="bg-white border-0 p-12 text-center space-y-6 animate-scale-in max-w-md mx-4">
            <div className="text-8xl">🏆</div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Organ Expert!
            </h2>
            <p className="text-2xl text-gray-700 font-medium">
              You explored all the organs!
            </p>
            <div className="flex justify-center gap-4 text-5xl animate-float">
              <span>🎉</span>
              <span>🎊</span>
              <span>🌟</span>
              <span>✨</span>
              <span>🎈</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ScanExploreMenu;
