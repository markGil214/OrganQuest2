import React from 'react';
import './OrganCard.css';

const OrganCard = ({ organ, onSelect }) => {
  const handleClick = () => {
    onSelect(organ);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(organ);
    }
  };

  return (
    <div 
      className="organ-card"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Scan and explore ${organ.name}`}
      style={{ '--organ-color': organ.color }}
    >
      <div className="organ-icon">
        {organ.icon.startsWith('http') || organ.icon.includes('.') ? (
          <img 
            src={organ.icon} 
            alt={`${organ.name} icon`} 
            className="organ-image"
          />
        ) : (
          <span className="organ-emoji" role="img" aria-label={`${organ.name} icon`}>
            {organ.icon}
          </span>
        )}
      </div>
      <div className="organ-info">
        <h3 className="organ-name">{organ.name}</h3>
        <p className="organ-description">{organ.description}</p>
      </div>
      <div className="scan-indicator">
        <span className="scan-icon">📱</span>
        <span className="scan-text">Tap to Scan!</span>
      </div>
    </div>
  );
};

export default OrganCard;
