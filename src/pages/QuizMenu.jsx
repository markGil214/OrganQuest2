import React from 'react';
import QuizTypeCard from '../components/QuizTypeCard';
import './QuizMenu.css';

const QuizMenu = () => {
  const quizTypes = [
    {
      id: 'mcq',
      icon: '🧠',
      title: 'Multiple Choice',
      description: 'Test your knowledge with fun questions about human anatomy!',
      route: 'quiz/mcq',
      color: '#3498db'
    },
    {
      id: 'memory',
      icon: '🧩',
      title: 'Memory Matching',
      description: 'Match organ pairs and boost your memory skills!',
      route: 'quiz/memory',
      color: '#e74c3c'
    },
    {
      id: 'timed',
      icon: '⚡',
      title: 'Timed Challenge',
      description: 'Race against time to answer as many questions as possible!',
      route: 'quiz/timed',
      color: '#f39c12'
    }
  ];

  const handleCardClick = (route) => {
    window.location.href = `#${route}`;
  };

  const handleBackClick = () => {
    window.location.href = '#main-menu';
  };

  return (
    <div className="quiz-menu">
      {/* Header */}
      <div className="quiz-header">
        <button className="back-button" onClick={handleBackClick}>
          <span className="back-icon">←</span>
          Back
        </button>
        <div className="quiz-title-section">
          <div className="quiz-icon">🎮</div>
          <h1 className="quiz-title">Quiz & Puzzles</h1>
          <p className="quiz-subtitle">Choose your favorite game mode!</p>
        </div>
      </div>

      {/* Quiz Cards Grid */}
      <div className="quiz-cards-container">
        <div className="quiz-cards-grid">
          {quizTypes.map((quiz) => (
            <QuizTypeCard
              key={quiz.id}
              icon={quiz.icon}
              title={quiz.title}
              description={quiz.description}
              color={quiz.color}
              onClick={() => handleCardClick(quiz.route)}
            />
          ))}
        </div>
      </div>

      {/* Floating Decorations */}
      <div className="floating-decorations">
        <div className="decoration question-mark">❓</div>
        <div className="decoration lightbulb">💡</div>
        <div className="decoration trophy">🏆</div>
        <div className="decoration star">⭐</div>
        <div className="decoration brain">🧠</div>
      </div>
    </div>
  );
};

export default QuizMenu;
