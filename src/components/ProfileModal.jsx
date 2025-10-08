import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const ProfileModal = ({ username, userAvatar, onClose, onLogout }) => {
  const handleSettingsClick = (setting) => {
    console.log(`Settings clicked: ${setting}`);
    // TODO: Implement settings functionality
  };

  const handleLogout = () => {
    console.log('Logging out...');
    onClose();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '#home';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-purple-50 to-pink-50 border-0">
        <DialogHeader>
          <DialogTitle className="sr-only">Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img src={userAvatar} alt={`${username}'s avatar`} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-pulse" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{username}</h2>
              <p className="text-sm text-purple-600 font-medium">Anatomy Explorer</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full px-4">
            <div className="flex flex-col items-center gap-1 bg-white/70 rounded-xl p-3 shadow-md">
              <div className="text-2xl">🏆</div>
              <div className="text-xl font-bold text-gray-800">12</div>
              <div className="text-xs text-gray-600 text-center">Organs Learned</div>
            </div>
            <div className="flex flex-col items-center gap-1 bg-white/70 rounded-xl p-3 shadow-md">
              <div className="text-2xl">⭐</div>
              <div className="text-xl font-bold text-gray-800">8</div>
              <div className="text-xs text-gray-600 text-center">Quizzes Done</div>
            </div>
            <div className="flex flex-col items-center gap-1 bg-white/70 rounded-xl p-3 shadow-md">
              <div className="text-2xl">🎯</div>
              <div className="text-xl font-bold text-gray-800">85%</div>
              <div className="text-xs text-gray-600 text-center">Avg Score</div>
            </div>
          </div>

          {/* Menu */}
          <div className="flex flex-col gap-2 w-full px-4">
            <button
              onClick={() => handleSettingsClick('avatar')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="text-2xl">👤</span>
              <span className="font-medium text-gray-800">Change Avatar</span>
            </button>
            
            <button
              onClick={() => handleSettingsClick('language')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="text-2xl">🌐</span>
              <span className="font-medium text-gray-800">Language</span>
            </button>
            
            <button
              onClick={() => handleSettingsClick('sound')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="text-2xl">🔊</span>
              <span className="font-medium text-gray-800">Sound Settings</span>
            </button>
            
            <button
              onClick={() => handleSettingsClick('progress')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="text-2xl">📊</span>
              <span className="font-medium text-gray-800">View Progress</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="w-full px-4 pt-2">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full text-base font-semibold gap-2"
            >
              <span className="text-xl">🚪</span>
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
