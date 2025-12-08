import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

// Test component to access language context
const TestComponent = () => {
  const { language, changeLanguage, t } = useLanguage();
  
  return (
    <div>
      <p>Current Language: {language}</p>
      <button onClick={() => changeLanguage('filipino')}>
        Switch to Filipino
      </button>
      <button onClick={() => changeLanguage('english')}>
        Switch to English
      </button>
      <p>{t('welcome', 'title')}</p>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should default to English language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByText(/Current Language: english/i)).toBeInTheDocument();
  });

  it('should change language to Filipino', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const filipinoButton = screen.getByText('Switch to Filipino');
    fireEvent.click(filipinoButton);

    expect(screen.getByText(/Current Language: filipino/i)).toBeInTheDocument();
  });

  it('should change language to English', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // First switch to Filipino
    const filipinoButton = screen.getByText('Switch to Filipino');
    fireEvent.click(filipinoButton);
    
    // Then switch back to English
    const englishButton = screen.getByText('Switch to English');
    fireEvent.click(englishButton);

    expect(screen.getByText(/Current Language: english/i)).toBeInTheDocument();
  });

  it('should save language preference to localStorage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const filipinoButton = screen.getByText('Switch to Filipino');
    fireEvent.click(filipinoButton);

    // Check that setItem was called with the language preference
    expect(setItemSpy).toHaveBeenCalled();
    const calls = setItemSpy.mock.calls;
    const languageCalls = calls.filter(call => call[0] === 'appLanguage' && call[1] === 'filipino');
    expect(languageCalls.length).toBeGreaterThan(0);
    
    setItemSpy.mockRestore();
  });
});
