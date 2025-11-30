import React from 'react';
import { cn } from '../lib/utils';
import soundManager from '../lib/soundManager';

const MenuButton = ({ 
  icon, 
  title, 
  subtitle, 
  color = '#e67e22', 
  onClick,
  disabled = false 
}) => {
  // Convert hex color to Tailwind-friendly gradient with vibrant kid-friendly colors
  const getGradientClasses = (hexColor) => {
    const colorMap = {
      '#e67e22': 'from-orange-400 via-orange-500 to-orange-600',
      '#9b59b6': 'from-purple-400 via-purple-500 to-purple-600',
      '#3498db': 'from-blue-400 via-blue-500 to-blue-600',
      '#e74c3c': 'from-red-400 via-rose-500 to-red-600',
    };
    return colorMap[hexColor] || 'from-orange-400 via-orange-500 to-orange-600';
  };

  const handleClick = (e) => {
    soundManager.playClick();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative group w-full overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-300",
        "bg-gradient-to-br shadow-xl hover:shadow-2xl",
        "transform hover:scale-[1.05] active:scale-95 hover:-translate-y-1",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0",
        getGradientClasses(color),
        "border-4 border-white/30 hover:border-white/50"
      )}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" 
           style={{ transition: 'transform 0.6s ease-in-out' }} />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-4 md:gap-5">
        {/* Icon with bounce effect */}
        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
          <span className="text-4xl md:text-5xl filter drop-shadow-lg">
            {icon}
          </span>
        </div>
        
        {/* Text Content */}
        <div className="text-left flex-1">
          <h3 className="text-xl md:text-2xl font-black text-white mb-1 drop-shadow-lg group-hover:drop-shadow-xl transition-all">
            {title}
          </h3>
          <p className="text-sm md:text-base text-white/95 font-medium drop-shadow">
            {subtitle}
          </p>
        </div>
        
        {/* Arrow indicator */}
        <div className="flex-shrink-0 text-white text-3xl transform group-hover:translate-x-2 transition-transform duration-300 opacity-90 group-hover:opacity-100">
          →
        </div>
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 bg-white/0 group-active:bg-white/20 transition-colors duration-150 rounded-3xl" />
      
      {/* Bottom highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 rounded-b-3xl" />
    </button>
  );
};

export default MenuButton;
