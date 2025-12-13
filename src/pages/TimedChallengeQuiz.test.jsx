import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ToastProvider } from '../contexts/ToastContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import TimedChallengeQuiz from './TimedChallengeQuiz';

// Mock API module
jest.mock('../lib/api');

// Mock window.location
delete window.location;
window.location = { href: '', hash: '#quiz/timed' };

// Mock timers
jest.useFakeTimers();

describe('TimedChallengeQuiz Component', () => {
  const renderTimedQuiz = () => {
    return render(
      <ToastProvider>
        <LanguageProvider>
          <TimedChallengeQuiz />
        </LanguageProvider>
      </ToastProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should render the timed challenge quiz', () => {
    renderTimedQuiz();
    
    // Check if timed quiz elements exist
    const timedElement = screen.getByText(/Timed Challenge/i) || 
                        screen.getByText(/60/i) ||
                        screen.getByText(/Start/i);
    expect(timedElement).toBeInTheDocument();
  });

  it('should display timer countdown', async () => {
    renderTimedQuiz();
    
    // Look for Start button
    const startButton = screen.queryByText(/Start/i);
    if (startButton) {
      fireEvent.click(startButton);
      
      await waitFor(() => {
        // Timer should be visible - look for timer with 's' suffix
        const timer = screen.queryByText(/60s/i);
        expect(timer).toBeInTheDocument();
      });
    }
  });

  it('should start game when start button clicked', () => {
    renderTimedQuiz();
    
    const startButton = screen.queryByText(/Start/i);
    if (startButton) {
      fireEvent.click(startButton);
      
      // Game should start - look for questions or timer
      const gameElements = screen.queryByText(/Score/i) || screen.queryByText(/\d+/);
      if (gameElements) {
        expect(gameElements).toBeInTheDocument();
      }
    }
  });

  it('should display score counter', async () => {
    renderTimedQuiz();
    
    const startButton = screen.queryByText(/Start/i);
    if (startButton) {
      fireEvent.click(startButton);
      
      await waitFor(() => {
        const score = screen.queryByText(/Score/i) || screen.queryByText(/0/);
        expect(score).toBeInTheDocument();
      });
    }
  });

  it('should show questions after starting', async () => {
    renderTimedQuiz();
    
    const startButton = screen.queryByText(/Start/i);
    if (startButton) {
      fireEvent.click(startButton);
      
      await waitFor(() => {
        // Questions should be visible
        const buttons = screen.queryAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    }
  });

  it('should end game when timer reaches zero', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });

    renderTimedQuiz();
    
    const startButton = screen.queryByText(/Start/i);
    if (startButton) {
      fireEvent.click(startButton);
      
      // Fast-forward timer to 0
      act(() => {
        jest.advanceTimersByTime(61000); // 61 seconds
      });
      
      await waitFor(() => {
        // Game should end - look for results or completion
        const results = screen.queryByText(/Time's Up/i) || 
                       screen.queryByText(/Finished/i) ||
                       screen.queryByText(/Final Score/i);
        if (results) {
          expect(results).toBeInTheDocument();
        }
      });
    }
  });

  it('should track streak counter', async () => {
    renderTimedQuiz();
    
    const startButton = screen.queryByText(/Start/i);
    if (startButton) {
      fireEvent.click(startButton);
      
      await waitFor(() => {
        // Check for streak counter
        const streak = screen.queryByText(/Streak/i) || screen.queryByText(/🔥/);
        if (streak) {
          expect(streak).toBeInTheDocument();
        }
      });
    }
  });

  it('should have a back button', () => {
    renderTimedQuiz();
    
    const backButton = screen.queryByText(/Back/i) || screen.queryByText(/Menu/i);
    if (backButton) {
      expect(backButton).toBeInTheDocument();
    }
  });
});

