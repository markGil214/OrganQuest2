import React from 'react';

const MemoryMatchingGame = () => {
  const handleBackClick = () => {
    window.location.href = '#quiz';
  };

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <button 
        onClick={handleBackClick}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '25px',
          padding: '0.75rem 1.5rem',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        ← Back to Quiz Menu
      </button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧩</div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Memory Matching Game</h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>Coming Soon!</p>
        <p style={{ fontSize: '1rem', marginTop: '2rem', maxWidth: '600px' }}>
          Challenge your memory by matching organ pairs! Flip cards to find matching anatomy parts 
          and improve your recall skills. This exciting memory game will be available soon!
        </p>
      </div>
    </div>
  );
};

export default MemoryMatchingGame;
