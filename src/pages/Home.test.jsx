import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ToastProvider } from '../contexts/ToastContext';
import Home from './Home';

describe('Home Component', () => {
  const renderHome = () => {
    return render(
      <ToastProvider>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </ToastProvider>
    );
  };

  it('should render the home page with title', () => {
    renderHome();
    expect(screen.getByText(/OrganQuest/i)).toBeInTheDocument();
  });

  it('should have a Get Started button', () => {
    renderHome();
    const getStartedButton = screen.getByText(/Get Started/i);
    expect(getStartedButton).toBeInTheDocument();
  });

  it('should display the app title and description', () => {
    renderHome();
    const homeElement = screen.getByText(/OrganQuest/i);
    expect(homeElement).toBeInTheDocument();
  });
});

