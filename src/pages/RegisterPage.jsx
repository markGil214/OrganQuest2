import React, { useState } from 'react';
import AvatarSelector from '../components/AvatarSelector';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const RegisterPage = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    avatar: null,
    language: 'english'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (avatarId) => {
    setFormData(prev => ({
      ...prev,
      avatar: avatarId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Registration Data:', formData);
    
    if (onRegistrationComplete) {
      onRegistrationComplete(formData);
    } else {
      alert(`Welcome, ${formData.username}! Registration data logged to console.`);
    }
  };

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'filipino', label: 'Filipino' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'mandarin', label: 'Mandarin' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-2xl overflow-hidden">
                {formData.avatar ? (
                  <img 
                    src={`/avatars/avatar-${formData.avatar}.svg`} 
                    alt="Selected avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl text-white">👤</div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-300 animate-ping opacity-30"></div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome!
          </h2>

          {/* Username Input */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Enter your username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          {/* Age Input */}
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
              Enter your age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Age"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              min="1"
              max="120"
              required
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Select your avatar:
            </label>
            <AvatarSelector
              selectedAvatar={formData.avatar}
              onAvatarSelect={handleAvatarSelect}
            />
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label htmlFor="language" className="block text-sm font-semibold text-gray-700">
              Select language:
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
              required
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Register Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 shadow-2xl"
            size="lg"
          >
            Register
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
