import React from 'react';
import './QuizTypeCard.css';

const QuizTypeCard = ({ icon, title, description, color, onClick }) => {
  return (
    <button 
      className="quiz-type-card"
      onClick={onClick}
      style={{ '--card-color': color }}
    >
      <div className="card-content">
        <div className="card-icon">{icon}</div>
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <div className="play-button">
            <span className="play-text">Play Now</span>
          </div>
        </div>
      </div>
      <div className="card-shine"></div>
      <div className="card-ripple"></div>
    </button>
  );
};

export default QuizTypeCard;
