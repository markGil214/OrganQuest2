import React from 'react';
import { cn } from '../lib/utils';

const AvatarSelector = ({ selectedAvatar, onAvatarSelect }) => {
  // Avatar options with actual image paths
  const avatars = [
    { id: 1, name: 'Boy', src: '/avatars/avatar-1.svg' },
    { id: 2, name: 'Girl', src: '/avatars/avatar-2.svg' },
    { id: 3, name: 'Man', src: '/avatars/avatar-3.svg' },
    { id: 4, name: 'Woman', src: '/avatars/avatar-4.svg' }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {avatars.map(avatar => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onAvatarSelect(avatar.id)}
          title={avatar.name}
          className={cn(
            "relative group rounded-2xl overflow-hidden transition-all duration-300",
            "border-4 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-400",
            selectedAvatar === avatar.id 
              ? "border-purple-500 shadow-2xl shadow-purple-500/50 scale-105" 
              : "border-gray-300 hover:border-purple-300 shadow-lg"
          )}
        >
          <img 
            src={avatar.src} 
            alt={avatar.name}
            className="w-full h-full object-cover"
          />
          {selectedAvatar === avatar.id && (
            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default AvatarSelector;
