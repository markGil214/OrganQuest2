import React from 'react';
import './Organ.css';

const Organ = ({ src, name, style, className = '' }) => {
  return (
    <div 
      className={`organ ${className}`} 
      style={style}
      title={name}
    >
      <img 
        src={src} 
        alt={name}
        className="organ-image"
      />
    </div>
  );
};

export default Organ;
