import React, { useState } from 'react';
import AvatarSelector from '../components/AvatarSelector';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import api from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

const RegisterPage = ({ onRegistrationComplete }) => {
  // Language hook for translations
  const { ts, language, changeLanguage } = useLanguage();
  const registerText = ts('register');
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    age: '',
    grade: '4th',
    section: 'A',
    avatar: null,
    language: language // Use current language from context
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync formData.language with context language
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      language: language
    }));
  }, [language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If language is changed in the dropdown, update the context as well
    if (name === 'language') {
      changeLanguage(value);
      console.log('Language changed from dropdown:', value);
    }
    
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
      // Ensure language is set from context (most up-to-date)
      const registrationData = {
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password,
        age: parseInt(formData.age),
        grade: formData.grade,
        section: formData.section,
        avatar: formData.avatar,
        language: language // Use language from context
      };

      console.log('Registering with language:', language);

      // Send registration data to backend
      const response = await api.register(registrationData);

      console.log('Registration successful:', response);
      
      // Store user data in localStorage (but not the token since it's now handled by cookies)
      // Ensure user data has the correct language
      const userData = {
        ...response.data.user,
        language: language
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('User data saved with language:', language);
      
      // Sync avatar from backend
      const avatar = response.data.user.avatar;
      if (avatar) {
        const avatarToUse = typeof avatar === 'string' ? avatar : `/avatars/avatar-${avatar}.svg`;
        localStorage.setItem('userAvatar', avatarToUse);
      }

      // Call the completion callback (handles navigation to welcome page)
      if (onRegistrationComplete) {
        onRegistrationComplete(response.data.user);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || registerText.registrationFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'filipino', label: 'Filipino' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Language Toggle Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => changeLanguage(language === 'english' ? 'filipino' : 'english')}
          className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-purple-600 transition-all hover:scale-105"
        >
          {language === 'english' ? 'Filipino' : 'English'}
        </button>
      </div>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/school/dcslogo.jpg"
                alt="DCS Logo"
                className="w-24 h-24 rounded-full object-cover shadow-2xl"
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {registerText.title}
            </h2>
            <p className="text-gray-600 text-xs">Create your account to start your anatomy adventure</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Avatar Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 text-center">
              {registerText.selectAvatar}
            </label>
            <div className="flex justify-center">
              <AvatarSelector
                selectedAvatar={formData.avatar}
                onAvatarSelect={handleAvatarSelect}
              />
            </div>
          </div>

          {/* Full Name Input */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
              {registerText.fullName}
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder={registerText.fullNamePlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              {registerText.username}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={registerText.usernamePlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              {registerText.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={registerText.passwordPlaceholder}
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
                {registerText.age}
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder={registerText.agePlaceholder}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                min="1"
                max="120"
                required
              />
            </div>

            {/* Grade Selector */}
            <div className="space-y-2">
              <label htmlFor="grade" className="block text-sm font-semibold text-gray-700">
                {registerText.grade}
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
                required
              >
                <option value="4th">{registerText.grades['4th']}</option>
                <option value="5th">{registerText.grades['5th']}</option>
                <option value="6th">{registerText.grades['6th']}</option>
              </select>
            </div>

            {/* Section Selector */}
            <div className="space-y-2">
              <label htmlFor="section" className="block text-sm font-semibold text-gray-700">
                Section
              </label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
                required
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label htmlFor="language" className="block text-sm font-semibold text-gray-700">
              {registerText.selectLanguage}
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base py-5 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
            disabled={isLoading || !formData.fullName || !formData.username || !formData.password || !formData.age || !formData.avatar}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {registerText.registering}
              </span>
            ) : (
              registerText.registerButton
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;

