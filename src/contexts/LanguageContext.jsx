import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTranslation, getSectionTranslations } from '../data/translations';

// Create the Language Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or user data, default to 'english'
  const [language, setLanguage] = useState(() => {
    // First check if user is logged in and has language preference
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.language || 'english';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Fallback to stored language preference or default
    return localStorage.getItem('appLanguage') || 'english';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    
    // Also update user data if user is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        user.language = language;
        localStorage.setItem('userData', JSON.stringify(user));
      } catch (error) {
        console.error('Error updating user language:', error);
      }
    }
  }, [language]);

  // Function to change language
  const changeLanguage = (newLanguage) => {
    if (newLanguage === 'english' || newLanguage === 'filipino') {
      setLanguage(newLanguage);
    } else {
      console.warn(`Invalid language: ${newLanguage}. Using 'english' as default.`);
      setLanguage('english');
    }
  };

  // Function to get translation
  const t = (section, key) => {
    return getTranslation(section, key, language);
  };

  // Function to get all translations for a section
  const ts = (section) => {
    return getSectionTranslations(section, language);
  };

  const value = {
    language,
    changeLanguage,
    t,
    ts,
    isEnglish: language === 'english',
    isFilipino: language === 'filipino'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the Language Context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
