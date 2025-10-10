import React, { useState } from 'react';
import AvatarSelector from '../components/AvatarSelector';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import api from '../lib/api';

const RegisterPage = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    age: '',
    grade: '4th',
    avatar: null,
    language: 'english'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Send registration data to backend
      const response = await api.register({
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password,
        age: parseInt(formData.age),
        grade: formData.grade,
        avatar: formData.avatar,
        language: formData.language
      });

      console.log('Registration successful:', response);
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      // Call the completion callback (handles navigation to welcome page)
      if (onRegistrationComplete) {
        onRegistrationComplete(response.data.user);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
            Create Account
          </h2>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Full Name Input */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              minLength="6"
              required
            />
          </div>

          {/* Age and Grade Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Age Input */}
            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
                Age
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

            {/* Grade Selector */}
            <div className="space-y-2">
              <label htmlFor="grade" className="block text-sm font-semibold text-gray-700">
                Grade
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
                required
              >
                <option value="4th">4th Grade</option>
                <option value="5th">5th Grade</option>
                <option value="6th">6th Grade</option>
              </select>
            </div>
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
            disabled={isLoading || !formData.fullName || !formData.username || !formData.password || !formData.age || !formData.avatar}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
