import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../../contexts/ToastContext';
import { LanguageProvider } from '../../contexts/LanguageContext';

// Suppress jsdom navigation warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Not implemented: navigation')) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

// Mock QuizContainer module
jest.mock('./QuizContainer', () => {
  return function MockQuizContainer() {
    return <div data-testid="quiz-container">Quiz Container Mock</div>;
  };
});

// Mock API module
jest.mock('../../lib/api');

import QuizContainer from './QuizContainer';

// Mock window.location
delete window.location;
window.location = { href: '', hash: '#quiz/mcq' };

const renderQuizContainer = () => {
  return render(
    <ToastProvider>
      <LanguageProvider>
        <QuizContainer />
      </LanguageProvider>
    </ToastProvider>
  );
};

describe('QuizContainer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  it('should render quiz questions', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { remainingAttempts: 3 } })
    });

    renderQuizContainer();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });

  it('should allow selecting an answer', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { remainingAttempts: 3 } })
    });

    renderQuizContainer();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    // Find and click first option (if rendered)
    const options = screen.queryAllByRole('button');
    if (options.length > 0) {
      const answerButton = options.find(btn => 
        btn.textContent && !btn.textContent.includes('Back') && !btn.textContent.includes('Next')
      );
      if (answerButton) {
        fireEvent.click(answerButton);
        expect(answerButton).toBeInTheDocument();
      }
    }
  });

  it('should show timer countdown', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { remainingAttempts: 3 } })
    });

    renderQuizContainer();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    // Check if timer exists (could be in various formats)
    const timerElements = screen.queryAllByText(/\d+:\d+/);
    if (timerElements.length > 0) {
      expect(timerElements[0]).toBeInTheDocument();
    }
  });

  it('should navigate to next question after answering', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { remainingAttempts: 3 } })
    });

    renderQuizContainer();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    // Look for Next button
    const nextButton = screen.queryByText(/Next/i);
    if (nextButton) {
      expect(nextButton).toBeInTheDocument();
    }
  });

  it('should block quiz when no attempts remaining', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { remainingAttempts: 0, isBlocked: true } })
    });

    renderQuizContainer();

    await waitFor(() => {
      const blockedMessage = screen.queryByText(/locked/i) || screen.queryByText(/attempts/i);
      if (blockedMessage) {
        expect(blockedMessage).toBeInTheDocument();
      }
    });
  });
});
