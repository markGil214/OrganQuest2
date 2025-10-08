import React from 'react';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';

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
    <Card 
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Scan and explore ${organ.name}`}
      className={cn(
        "cursor-pointer overflow-hidden border-0 transition-all duration-300",
        "hover:scale-105 hover:shadow-2xl active:scale-95",
        "bg-gradient-to-br p-6"
      )}
      style={{ background: `linear-gradient(135deg, ${organ.color}, ${organ.color}dd)` }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl">
          {organ.icon.startsWith('http') || organ.icon.includes('.') ? (
            <img 
              src={organ.icon} 
              alt={`${organ.name} icon`} 
              className="w-16 h-16 object-contain"
            />
          ) : (
            <span className="text-5xl" role="img" aria-label={`${organ.name} icon`}>
              {organ.icon}
            </span>
          )}
        </div>
        
        <div className="text-center text-white space-y-2">
          <h3 className="text-2xl font-bold">{organ.name}</h3>
          <p className="text-sm text-white/90">{organ.description}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 mt-2">
          <span className="text-2xl">📱</span>
          <span className="text-white font-semibold text-sm">Tap to Scan!</span>
        </div>
      </div>
    </Card>
  );
};

export default OrganCard;
