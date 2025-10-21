import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTranslation, getSectionTranslations } from '../data/translations';

// Create the Language Context
const LanguageContext = createContext();

// Cookie helper functions
const setCookie = (name, value, days = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  // Initialize language from multiple sources (priority order: cookie > localStorage > user data > default)
  const [language, setLanguage] = useState(() => {
    // First check cookie
    const cookieLanguage = getCookie('organquest_language');
    if (cookieLanguage) {
      console.log('Language loaded from cookie:', cookieLanguage);
      return cookieLanguage;
    }

    // Then check localStorage
    const storedLanguage = localStorage.getItem('appLanguage');
    if (storedLanguage) {
      console.log('Language loaded from localStorage:', storedLanguage);
      return storedLanguage;
    }

    // Then check if user is logged in and has language preference
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.language) {
          console.log('Language loaded from user data:', user.language);
          return user.language;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Default to English
    console.log('Using default language: english');
    return 'english';
  });

  // Update localStorage and cookie when language changes
  useEffect(() => {
    console.log('Language changed to:', language);
    
    // 1. Save to cookie (primary storage, persists across sessions)
    setCookie('organquest_language', language, 365);
    console.log('Language saved to cookie');
    
    // 2. Save to localStorage (backup storage)
    localStorage.setItem('appLanguage', language);
    console.log('Language saved to localStorage');
    
    // 3. Update user data if user is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        user.language = language;
        localStorage.setItem('userData', JSON.stringify(user));
        console.log('Language saved to user data');
      } catch (error) {
        console.error('Error updating user language:', error);
      }
    }

    // 4. Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  }, [language]);

  // Function to change language
  const changeLanguage = (newLanguage) => {
    if (newLanguage === 'english' || newLanguage === 'filipino') {
      console.log('Changing language to:', newLanguage);
      setLanguage(newLanguage);
      
      // Force immediate save to all storage locations
      setCookie('organquest_language', newLanguage, 365);
      localStorage.setItem('appLanguage', newLanguage);
      
      // Show confirmation
      console.log(`✅ Language changed to ${newLanguage === 'filipino' ? 'Filipino' : 'English'}`);
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
