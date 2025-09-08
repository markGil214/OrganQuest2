import React, { useState, useEffect } from 'react';
import heartImg from '../assets/images/heart.svg';
import brainImg from '../assets/images/brain.svg';
import lungsImg from '../assets/images/lungs.svg';
import kidneyImg from '../assets/images/kidney.svg';
import liverImg from '../assets/images/liver.svg';

const MemoryMatchingGame = () => {
  // Add Montserrat font
  const addMontserratFont = () => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  useEffect(() => {
    addMontserratFont();
  }, []);

  // Memory card pairs - organs with SVG image and text
  const organs = [
    { key: 'heart', label: 'Heart', icon: '❤️' },
    { key: 'brain', label: 'Brain', icon: '🧠' },
    { key: 'lungs', label: 'Lungs', icon: '🫁' },
    { key: 'liver', label: 'Liver', icon: '🫀' },
    { key: 'kidney', label: 'Kidneys', icon: '🫘' }
  ];

  // Build card pairs: one emoji card, one text card for each organ
  const cardPairs = organs.flatMap((org, i) => [
    {
      id: i * 2 + 1,
      type: 'emoji',
      icon: org.icon,
      matchId: org.key
    },
    {
      id: i * 2 + 2,
      type: 'text',
      text: org.label,
      matchId: org.key
    }
  ]);

  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Game state
  const [cards, setCards] = useState(() => shuffleArray(cardPairs));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleBackClick = () => {
    window.location.href = '#quiz';
  };

  const handleCardClick = (cardId) => {
    // Prevent clicking if checking, already flipped, or matched
    if (isChecking || flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId))) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // If two cards are flipped, check for match
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const card1 = cards.find(card => card.id === newFlippedCards[0]);
      const card2 = cards.find(card => card.id === newFlippedCards[1]);

      if (card1.matchId === card2.matchId) {
        // Match found!
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, newFlippedCards]);
          setFlippedCards([]);
          setIsChecking(false);

          // Check if game is completed
          if (matchedPairs.length + 1 === cardPairs.length / 2) {
            setGameCompleted(true);
          }
        }, 1000);
      } else {
        // No match, flip back
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1500);
      }
    }
  };

  const resetGame = () => {
    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameCompleted(false);
    setIsChecking(false);
  };

  const isCardFlipped = (cardId) => {
    return flippedCards.includes(cardId) || matchedPairs.some(pair => pair.includes(cardId));
  };

  const isCardMatched = (cardId) => {
    return matchedPairs.some(pair => pair.includes(cardId));
  };

  if (gameCompleted) {
    return (
      <div style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: '"Montserrat", sans-serif',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          animation: 'celebrationPulse 2s infinite alternate'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>
            🎉
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>
            Congratulations!
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            You completed the Memory Game!
          </p>
          <div style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '600' }}>
            Total Moves: {moves}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={resetGame}
              style={{
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                border: 'none',
                borderRadius: '20px',
                padding: '1rem 1.5rem',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 6px 15px rgba(255, 107, 107, 0.3)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🔄 Play Again
            </button>
            <button
              onClick={handleBackClick}
              style={{
                background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                border: 'none',
                borderRadius: '20px',
                padding: '1rem 1.5rem',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 6px 15px rgba(78, 205, 196, 0.3)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes celebrationPulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
          }
          @keyframes bounce {
            0%, 20%, 60%, 100% { transform: translateY(0); }
            40% { transform: translateY(-30px); }
            80% { transform: translateY(-15px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      fontFamily: '"Montserrat", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        fontSize: '3rem',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }}>🧩</div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        fontSize: '2.5rem',
        opacity: 0.1,
        animation: 'float 4s ease-in-out infinite reverse'
      }}>🎮</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '20%',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 5s ease-in-out infinite'
      }}>💭</div>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <button
          onClick={handleBackClick}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '25px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Back to Quiz Menu
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🧩</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>
            Memory Matching
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '25px',
          padding: '0.75rem 1.5rem',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          Moves: {moves}
        </div>
      </div>

      {/* Game Board */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          maxWidth: '320px',
          width: '100%',
          margin: '0 auto',
          paddingTop: '1rem',
          paddingBottom: '1rem'
        }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                background: isCardFlipped(card.id)
                  ? (isCardMatched(card.id)
                    ? 'linear-gradient(135deg, #4ECDC4, #44A08D)'
                    : card.type === 'emoji'
                    ? 'linear-gradient(135deg, #FF6B6B, #FF8E53)'
                    : 'linear-gradient(135deg, #667eea, #764ba2)')
                  : 'linear-gradient(135deg, #34495e, #2c3e50)',
                borderRadius: '14px',
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isCardFlipped(card.id) ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                border: isCardMatched(card.id) ? '2px solid #FFD700' : '1.5px solid rgba(255, 255, 255, 0.2)',
                transform: isCardFlipped(card.id) ? 'scale(1.04)' : 'scale(1)',
                minHeight: '90px',
                maxWidth: '90px',
                fontSize: '1.5rem'
              }}
              onMouseOver={(e) => {
                if (!isCardFlipped(card.id)) {
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                if (!isCardFlipped(card.id)) {
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {isCardFlipped(card.id) ? (
                <>
                  {card.type === 'emoji' ? (
                    <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} role="img" aria-label={card.matchId}>
                      {card.icon}
                    </span>
                  ) : (
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      lineHeight: '1.2',
                      marginBottom: '0.5rem'
                    }}>
                      {card.text}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: '3rem', opacity: 0.7 }}>
                  ❓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div style={{
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          <span>Matched: {matchedPairs.length}/{cardPairs.length / 2}</span>
          <div style={{
            width: '200px',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #4ECDC4, #44A08D)',
              width: `${(matchedPairs.length / (cardPairs.length / 2)) * 100}%`,
              transition: 'width 0.5s ease',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes celebrationPulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 20%, 60%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          80% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default MemoryMatchingGame;
