// Example: LoginPage with translation support
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import api from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPageTranslated = ({ onLoginSuccess }) => {
  const { t, ts, language, changeLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await api.login({
        username: formData.username,
        password: formData.password
      });

      console.log('Login successful:', response);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      if (onLoginSuccess) {
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || t('login', 'loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    window.location.hash = '#register';
  };

  // Get all login translations
  const loginText = ts('login');
  const commonText = ts('common');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => changeLanguage(language === 'english' ? 'filipino' : 'english')}
          className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-purple-600 transition-all"
        >
          {language === 'english' ? '🇵🇭 Filipino' : '🇬🇧 English'}
        </button>
      </div>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-2xl">
                <div className="text-4xl">🔬</div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-300 animate-ping opacity-30"></div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {loginText.title}
            </h2>
            <p className="text-gray-600 text-xs">{loginText.subtitle}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              {loginText.username}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={loginText.usernamePlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              {loginText.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={loginText.passwordPlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base py-5 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
            disabled={isLoading || !formData.username || !formData.password}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {loginText.loggingIn}
              </span>
            ) : (
              loginText.loginButton
            )}
          </Button>

          {/* Register Link */}
          <div className="text-center pt-4 border-t-2 border-gray-200">
            <p className="text-gray-600 text-xs mb-2">{loginText.noAccount}</p>
            <Button
              type="button"
              onClick={handleRegisterClick}
              variant="outline"
              className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold text-sm"
            >
              {loginText.createAccount}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPageTranslated;
