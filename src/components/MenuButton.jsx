import React from 'react';
import './MenuButton.css';

const MenuButton = ({ 
  icon, 
  title, 
  subtitle, 
  color = '#e67e22', 
  onClick,
  disabled = false 
}) => {
  return (
    <button 
      className={`menu-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{ '--button-color': color }}
    >
      <div className="button-content">
        <div className="button-icon">{icon}</div>
        <div className="button-text">
          <h3 className="button-title">{title}</h3>
          <p className="button-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="button-shine"></div>
      <div className="button-ripple"></div>
    </button>
  );
};

export default MenuButton;
