import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../contexts/ToastContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';

// Mock QuizContainer since it's already tested
jest.mock('../components/quiz-container/QuizContainer', () => {
  return function MockQuizContainer() {
    return <div data-testid="quiz-container">Mock Quiz Container</div>;
  };
});

describe('MultipleChoiceQuiz Component', () => {
  const renderMultipleChoiceQuiz = () => {
    return render(
      <ToastProvider>
        <LanguageProvider>
          <MultipleChoiceQuiz />
        </LanguageProvider>
      </ToastProvider>
    );
  };

  it('should render the quiz container', () => {
    renderMultipleChoiceQuiz();
    expect(screen.getByTestId('quiz-container')).toBeInTheDocument();
  });

  it('should render without errors', () => {
    const { container } = renderMultipleChoiceQuiz();
    expect(container).toBeInTheDocument();
  });
});

