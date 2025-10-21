import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LearnMoreModal = ({ isOpen, onClose }) => {
  const { ts, language } = useLanguage();
  const [selectedOrgan, setSelectedOrgan] = useState(null);

  if (!isOpen) return null;

  // Organ data with fun facts
  const organData = {
    heart: {
      icon: '❤️',
      name: language === 'english' ? 'Heart' : 'Puso',
      color: '#e74c3c',
      facts: language === 'english' ? [
        'Your heart beats about 100,000 times per day!',
        'The heart pumps about 2,000 gallons of blood daily',
        'A child\'s heart is about the size of a fist',
        'The heart has its own electrical system',
        'Hearts can beat even outside the body'
      ] : [
        'Ang iyong puso ay tumitibok ng humigit-kumulang 100,000 beses bawat araw!',
        'Ang puso ay pumapasok ng humigit-kumulang 2,000 galon ng dugo araw-araw',
        'Ang puso ng bata ay kasing laki ng kanyang kamao',
        'Ang puso ay may sariling electrical system',
        'Ang puso ay maaaring tumibok kahit wala sa katawan'
      ],
      description: language === 'english' 
        ? 'The heart is a muscular organ that pumps blood throughout your body. It\'s like a super pump that never stops working!'
        : 'Ang puso ay isang muscular organ na pumapasok ng dugo sa buong katawan. Parang super pump na hindi tumitigil sa pagtatrabaho!'
    },
    brain: {
      icon: '🧠',
      name: language === 'english' ? 'Brain' : 'Utak',
      color: '#9b59b6',
      facts: language === 'english' ? [
        'Your brain weighs about 3 pounds',
        'The brain has about 86 billion neurons',
        'Your brain uses 20% of your body\'s energy',
        'The brain can process information super fast',
        'Dreams happen when your brain is still active while you sleep'
      ] : [
        'Ang iyong utak ay tumitimbang ng humigit-kumulang 3 libra',
        'Ang utak ay may humigit-kumulang 86 bilyong neurons',
        'Ang utak ay gumagamit ng 20% ng enerhiya ng iyong katawan',
        'Ang utak ay napakabilis mag-proseso ng impormasyon',
        'Ang mga panaginip ay nangyayari kapag ang utak ay aktibo habang natutulog'
      ],
      description: language === 'english'
        ? 'The brain is the control center of your body. It helps you think, learn, remember, and controls everything you do!'
        : 'Ang utak ay ang control center ng iyong katawan. Tumutulong ito sa iyo na mag-isip, matuto, magtanda, at kontrolin ang lahat ng iyong ginagawa!'
    },
    lungs: {
      icon: '🫁',
      name: language === 'english' ? 'Lungs' : 'Baga',
      color: '#3498db',
      facts: language === 'english' ? [
        'You breathe about 20,000 times per day',
        'Your lungs have tiny air sacs called alveoli',
        'The right lung is slightly larger than the left',
        'You can live with just one lung',
        'Laughing is good exercise for your lungs'
      ] : [
        'Humihinga ka ng humigit-kumulang 20,000 beses bawat araw',
        'Ang iyong baga ay may maliliit na air sacs na tinatawag na alveoli',
        'Ang kanang baga ay bahagyang mas malaki kaysa sa kaliwa',
        'Maaari kang mabuhay kahit isang baga lang',
        'Ang pagtawa ay magandang ehersisyo para sa iyong baga'
      ],
      description: language === 'english'
        ? 'The lungs help you breathe by taking in oxygen and removing carbon dioxide. They work like two big sponges!'
        : 'Ang baga ay tumutulong sa iyo na huminga sa pamamagitan ng pagkuha ng oxygen at pag-alis ng carbon dioxide. Parang dalawang malaking sponge!'
    },
    liver: {
      icon: '🫀',
      name: language === 'english' ? 'Liver' : 'Atay',
      color: '#e67e22',
      facts: language === 'english' ? [
        'The liver is the largest internal organ',
        'It performs over 500 different functions',
        'The liver can regenerate itself',
        'It filters about 1.4 liters of blood per minute',
        'The liver helps digest food and store energy'
      ] : [
        'Ang atay ay ang pinakamalaking internal organ',
        'Gumagawa ito ng mahigit 500 iba\'t ibang gawain',
        'Ang atay ay maaaring mag-regenerate',
        'Sinasala nito ang humigit-kumulang 1.4 litro ng dugo bawat minuto',
        'Ang atay ay tumutulong sa pagtunaw ng pagkain at pag-imbak ng enerhiya'
      ],
      description: language === 'english'
        ? 'The liver is like a super filter and factory! It cleans your blood and helps your body use the food you eat.'
        : 'Ang atay ay parang super filter at pabrika! Nililinis nito ang iyong dugo at tumutulong sa katawan na gamitin ang pagkain na kinakain mo.'
    },
    stomach: {
      icon: '🥘',
      name: language === 'english' ? 'Stomach' : 'Tiyan',
      color: '#f39c12',
      facts: language === 'english' ? [
        'Your stomach can hold about 1.5 liters of food',
        'Stomach acid is strong enough to dissolve metal',
        'A new stomach lining is made every few days',
        'Butterflies in your stomach are real nervous feelings',
        'The stomach growls when it\'s empty or digesting'
      ] : [
        'Ang iyong tiyan ay kayang mag-hold ng humigit-kumulang 1.5 litro ng pagkain',
        'Ang stomach acid ay sapat na malakas upang matunaw ang metal',
        'Isang bagong stomach lining ay ginagawa tuwing ilang araw',
        'Ang butterflies sa tiyan ay tunay na nervous feelings',
        'Ang tiyan ay kumukulog kapag walang laman o nag-di-digest'
      ],
      description: language === 'english'
        ? 'The stomach is like a mixing bowl that breaks down food using special juices. It prepares food for your body to use!'
        : 'Ang tiyan ay parang mixing bowl na tumatunaw ng pagkain gamit ang special juices. Inihahanda nito ang pagkain para magamit ng katawan!'
    },
    kidney: {
      icon: '🫘',
      name: language === 'english' ? 'Kidneys' : 'Bato',
      color: '#c0392b',
      facts: language === 'english' ? [
        'You have two kidneys shaped like beans',
        'They filter about 200 liters of blood each day',
        'Kidneys make urine to remove waste',
        'You can live a healthy life with just one kidney',
        'They help control your blood pressure'
      ] : [
        'Mayroon kang dalawang bato na hugis parang beans',
        'Sinasala nila ang humigit-kumulang 200 litro ng dugo bawat araw',
        'Gumagawa ang bato ng ihi upang alisin ang basura',
        'Maaari kang mabuhay nang malusog kahit isang bato lang',
        'Tumutulong sila kontrolin ang iyong blood pressure'
      ],
      description: language === 'english'
        ? 'Kidneys are like filters that clean your blood and make urine. They keep your body healthy by removing waste!'
        : 'Ang bato ay parang filter na naglilinis ng iyong dugo at gumagawa ng ihi. Pinapanatili nila ang katawan na malusog sa pamamagitan ng pag-alis ng basura!'
    },
    intestine: {
      icon: '🌀',
      name: language === 'english' ? 'Intestines' : 'Bituka',
      color: '#16a085',
      facts: language === 'english' ? [
        'The small intestine is about 20 feet long',
        'The large intestine is about 5 feet long',
        'They absorb nutrients from your food',
        'Millions of tiny helpers live in your intestines',
        'Food takes about 24-72 hours to travel through'
      ] : [
        'Ang small intestine ay humigit-kumulang 20 talampakan ang haba',
        'Ang large intestine ay humigit-kumulang 5 talampakan ang haba',
        'Sinisipsip nila ang nutrients mula sa iyong pagkain',
        'Milyun-milyong maliliit na tumutulong ay naninirahan sa iyong bituka',
        'Tumatagal ng 24-72 oras ang pagkain na dumaan'
      ],
      description: language === 'english'
        ? 'The intestines are long tubes that absorb nutrients from food and help remove waste from your body.'
        : 'Ang bituka ay mahabang tubo na sumisipsip ng nutrients mula sa pagkain at tumutulong alisin ang basura sa katawan.'
    },
    eyes: {
      icon: '👁️',
      name: language === 'english' ? 'Eyes' : 'Mata',
      color: '#2980b9',
      facts: language === 'english' ? [
        'Your eyes can see about 10 million different colors',
        'You blink about 15-20 times per minute',
        'Eyes heal quickly - a scratch can heal in 48 hours',
        'Your eyes stay the same size from birth',
        'You see things upside down - your brain flips them!'
      ] : [
        'Ang iyong mata ay makakakita ng humigit-kumulang 10 milyong iba\'t ibang kulay',
        'Kumukurap ka ng 15-20 beses bawat minuto',
        'Ang mata ay mabilis gumaling - ang gasgas ay maghihilom sa 48 oras',
        'Ang iyong mata ay nananatiling pareho ang laki simula pagsilang',
        'Nakikita mo ang mga bagay na baliktad - binaligtad ng utak mo!'
      ],
      description: language === 'english'
        ? 'Eyes are amazing organs that help you see the world! They work like cameras, capturing light and sending images to your brain.'
        : 'Ang mata ay kahanga-hangang organ na tumutulong sa iyo na makita ang mundo! Gumagana sila tulad ng camera, kumukuha ng liwanag at nagpapadala ng mga imahe sa utak.'
    }
  };

  const organs = Object.keys(organData);

  const handleOrganClick = (organ) => {
    setSelectedOrgan(organ);
  };

  const handleBack = () => {
    setSelectedOrgan(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {selectedOrgan && (
                <button
                  onClick={handleBack}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
                >
                  <span className="text-xl">←</span>
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'english' ? '📚 Learn More' : '📚 Matuto Pa'}
                </h2>
                <p className="text-sm text-white/90">
                  {language === 'english' 
                    ? 'Discover amazing facts about your body!' 
                    : 'Tuklasin ang mga kahanga-hangang katotohanan tungkol sa iyong katawan!'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!selectedOrgan ? (
            /* Organ Grid */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {organs.map((organ) => (
                <button
                  key={organ}
                  onClick={() => handleOrganClick(organ)}
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all group"
                  style={{ borderColor: organData[organ].color + '40' }}
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {organData[organ].icon}
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {organData[organ].name}
                  </h3>
                </button>
              ))}
            </div>
          ) : (
            /* Organ Details */
            <div className="space-y-6 animate-fadeIn">
              {/* Organ Header */}
              <div 
                className="text-center p-8 rounded-xl"
                style={{ backgroundColor: organData[selectedOrgan].color + '20' }}
              >
                <div className="text-7xl mb-4">{organData[selectedOrgan].icon}</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {organData[selectedOrgan].name}
                </h3>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  {organData[selectedOrgan].description}
                </p>
              </div>

              {/* Fun Facts */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✨</span>
                  {language === 'english' ? 'Fun Facts' : 'Mga Kawili-wiling Katotohanan'}
                </h4>
                <div className="space-y-3">
                  {organData[selectedOrgan].facts.map((fact, index) => (
                    <div 
                      key={index}
                      className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <span 
                        className="text-2xl font-bold flex-shrink-0"
                        style={{ color: organData[selectedOrgan].color }}
                      >
                        {index + 1}
                      </span>
                      <p className="text-gray-700">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center pt-4">
                <button
                  onClick={handleBack}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {language === 'english' ? 'Back to Organs' : 'Bumalik sa mga Organ'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnMoreModal;
