import React from 'react';
import { cn } from '../lib/utils';

const Organ = ({ src, name, style, className = '' }) => {
  return (
    <div 
      className={cn("absolute opacity-70 pointer-events-none", className)} 
      style={style}
      title={name}
    >
      <img 
        src={src} 
        alt={name}
        className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl animate-float"
      />
    </div>
  );
};

export default Organ;
