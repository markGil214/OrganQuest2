import React from 'react';
import { cn } from '../lib/utils';

const MenuButton = ({ 
  icon, 
  title, 
  subtitle, 
  color = '#e67e22', 
  onClick,
  disabled = false 
}) => {
  // Convert hex color to Tailwind-friendly gradient
  const getGradientClasses = (hexColor) => {
    const colorMap = {
      '#e67e22': 'from-orange-500 to-orange-600',
      '#9b59b6': 'from-purple-500 to-purple-600',
      '#3498db': 'from-blue-500 to-blue-600',
      '#e74c3c': 'from-red-500 to-red-600',
    };
    return colorMap[hexColor] || 'from-orange-500 to-orange-600';
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative group w-full overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "bg-gradient-to-br shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
        "transform hover:scale-105 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        getGradientClasses(color),
        "before:absolute before:inset-0 before:bg-white/10 before:opacity-0",
        "hover:before:opacity-100 before:transition-opacity before:duration-300"
      )}
    >
      <div className="relative z-10 flex items-center gap-4">
        <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="text-left flex-1">
          <h3 className="text-xl font-bold text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-white/90">
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 bg-white/0 group-active:bg-white/20 transition-colors duration-150 rounded-2xl" />
    </button>
  );
};

export default MenuButton;
