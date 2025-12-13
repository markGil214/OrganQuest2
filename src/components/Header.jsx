import React from 'react';

const Header = ({ onProfileClick, userAvatar, username }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 shadow-lg relative z-10">
      <div className="flex items-center gap-4">
        <img 
          src="/school/dcslogo.jpg" 
          alt="DCS Logo" 
          className="w-12 h-12 object-contain"
        />
        <h1 className="text-2xl font-black text-white">OrganQuest</h1>
      </div>
      
      <button
        onClick={onProfileClick}
        className="relative group flex-shrink-0"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-2xl transition-all duration-300 group-hover:scale-110">
          <img 
            src={userAvatar} 
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse" />
      </button>
    </header>
  );
};

export default Header;
