import React from 'react';
import './AvatarSelector.css';

const AvatarSelector = ({ selectedAvatar, onAvatarSelect }) => {
  // Avatar options with actual image paths
  const avatars = [
    { id: 1, name: 'Boy', src: '/avatars/avatar-1.svg' },
    { id: 2, name: 'Girl', src: '/avatars/avatar-2.svg' },
    { id: 3, name: 'Man', src: '/avatars/avatar-3.svg' },
    { id: 4, name: 'Woman', src: '/avatars/avatar-4.svg' }
  ];

  return (
    <div className="avatar-selector">
      {avatars.map(avatar => (
        <button
          key={avatar.id}
          type="button"
          className={`avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''}`}
          onClick={() => onAvatarSelect(avatar.id)}
          title={avatar.name}
        >
          <img 
            src={avatar.src} 
            alt={avatar.name}
            className="avatar-image"
          />
        </button>
      ))}
    </div>
  );
};

export default AvatarSelector;
