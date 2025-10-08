import React from 'react';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';

const QuizTypeCard = ({ icon, title, description, color, onClick }) => {
  const getGradientClasses = (hexColor) => {
    const colorMap = {
      '#3498db': 'from-blue-500 to-blue-600',
      '#e74c3c': 'from-red-500 to-red-600',
      '#f39c12': 'from-amber-500 to-orange-500',
      '#9b59b6': 'from-purple-500 to-purple-600',
    };
    return colorMap[hexColor] || 'from-blue-500 to-blue-600';
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer overflow-hidden border-0 transition-all duration-300",
        "bg-gradient-to-br shadow-2xl hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)]",
        "transform hover:scale-105 hover:-translate-y-2 active:scale-95",
        getGradientClasses(color),
        "before:absolute before:inset-0 before:bg-white/10 before:opacity-0",
        "hover:before:opacity-100 before:transition-opacity before:duration-300"
      )}
    >
      <div className="relative z-10 p-8 flex flex-col items-center text-center gap-4">
        <div className="text-7xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          {icon}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">
            {title}
          </h3>
          <p className="text-sm text-white/90 leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="mt-4 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/30 transition-colors duration-200">
          <span>Play Now</span>
        </div>
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 bg-white/0 group-active:bg-white/20 transition-colors duration-150 rounded-2xl" />
    </Card>
  );
};

export default QuizTypeCard;
