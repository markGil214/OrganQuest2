import React, { useState, useEffect } from 'react';
import { timedChallengeQuestions } from '../data/timedChallengeQuestions';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import api from '../lib/api';

const TimedChallengeQuiz = () => {

  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Use imported timed challenge questions

  // Game state
  const [gameState, setGameState] = useState('waiting'); // 'waiting', 'playing', 'finished'
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const handleBackClick = () => {
    window.location.href = '#quiz';
  };

  // Initialize shuffled questions
  useEffect(() => {
    setQuestions(shuffleArray(timedChallengeQuestions));
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
      // Submit quiz results when time runs out
      submitTimedQuizToBackend();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  // Submit timed quiz results to backend
  const submitTimedQuizToBackend = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found, skipping quiz submission');
        return;
      }

      const totalQuestionsAnswered = currentQuestion + 1;
      const correctAnswers = Math.floor(score / 10); // Approximate based on scoring
      const percentage = totalQuestionsAnswered > 0 ? Math.round((correctAnswers / totalQuestionsAnswered) * 100) : 0;

      const quizData = {
        quizType: 'timed-challenge',
        score: score,
        totalQuestions: totalQuestionsAnswered,
        correctAnswers: correctAnswers,
        wrongAnswers: totalQuestionsAnswered - correctAnswers,
        percentage: percentage,
        timeTaken: 60 - timeLeft,
        bestStreak: bestStreak,
        answers: [] // Timed quiz doesn't need detailed answers
      };

      const response = await api.submitQuiz(token, quizData);
      console.log('Timed quiz submitted successfully:', response);
    } catch (error) {
      console.error('Failed to submit timed quiz:', error);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setStreak(0);
    setBestStreak(0);
    setQuestions(shuffleArray(timedChallengeQuestions));
  };

  const handleAnswerClick = (answerIndex) => {
    if (isAnswered || gameState !== 'playing') return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const currentQ = questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correct;

    if (isCorrect) {
      const timeBonus = Math.max(1, Math.floor(timeLeft / 10)); // Bonus points for speed
      setScore(score + 10 + timeBonus);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
    } else {
      setStreak(0);
    }

    // Move to next question after short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        // Reset to beginning of questions for continuous play
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setQuestions(shuffleArray(timedChallengeQuestions));
      }
    }, 800);
  };

  const getTimerColor = () => {
    if (timeLeft > 30) return '#4ECDC4';
    if (timeLeft > 10) return '#F39C12';
    return '#E74C3C';
  };

  const getScoreRating = () => {
    if (score >= 200) return { emoji: '🏆', message: 'AMAZING!', color: '#FFD700' };
    if (score >= 150) return { emoji: '🌟', message: 'EXCELLENT!', color: '#4ECDC4' };
    if (score >= 100) return { emoji: '🎉', message: 'GREAT JOB!', color: '#9B59B6' };
    if (score >= 50) return { emoji: '👍', message: 'GOOD WORK!', color: '#3498DB' };
    return { emoji: '💪', message: 'KEEP TRYING!', color: '#E67E22' };
  };

  if (gameState === 'waiting') {
    return (
      <div style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: '"Montserrat", sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          fontSize: '3rem',
          opacity: 0.1,
          animation: 'bounce 2s infinite'
        }}>⚡</div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          fontSize: '2.5rem',
          opacity: 0.1,
          animation: 'bounce 2s infinite reverse'
        }}>⏰</div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          fontSize: '2rem',
          opacity: 0.1,
          animation: 'bounce 3s infinite'
        }}>🏃‍♂️</div>

        <button
          onClick={handleBackClick}
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '25px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Back to Quiz Menu
        </button>

        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '3rem',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>⚡</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>Timed Challenge</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem', lineHeight: '1.5' }}>
            Race against the clock! Answer as many anatomy questions as possible in 60 seconds. 
            Fast answers get bonus points!
          </p>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: '600' }}>🎯 How to Play:</h3>
            <div style={{ textAlign: 'left', fontSize: '1rem', lineHeight: '1.6' }}>
              <p>• Answer questions as fast as possible</p>
              <p>• Correct answers = 10 points + time bonus</p>
              <p>• Build streaks for extra excitement</p>
              <p>• Beat your high score!</p>
            </div>
          </div>

          <button
            onClick={startGame}
            style={{
              background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
              border: 'none',
              borderRadius: '25px',
              padding: '1.2rem 2.5rem',
              color: 'white',
              fontSize: '1.4rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(231, 76, 60, 0.4)',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit',
              animation: 'glow 2s infinite alternate'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🚀 START CHALLENGE
          </button>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes glow {
            0% { box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4); }
            100% { box-shadow: 0 8px 30px rgba(231, 76, 60, 0.8); }
          }
        `}</style>
      </div>
    );
  }

  if (gameState === 'finished') {
    const rating = getScoreRating();
    return (
      <div style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: '"Montserrat", sans-serif',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          animation: 'celebrationPulse 2s infinite alternate'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>
            {rating.emoji}
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700', color: rating.color }}>
            {rating.message}
          </h1>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '700' }}>
            {score} POINTS
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Best Streak: {bestStreak} 🔥
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>
              Questions Answered in 60 seconds!
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                border: 'none',
                borderRadius: '20px',
                padding: '1rem 1.5rem',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 6px 15px rgba(255, 107, 107, 0.3)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🔄 Play Again
            </button>
            <button
              onClick={handleBackClick}
              style={{
                background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                border: 'none',
                borderRadius: '20px',
                padding: '1rem 1.5rem',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 6px 15px rgba(78, 205, 196, 0.3)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes celebrationPulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
          }
          @keyframes bounce {
            0%, 20%, 60%, 100% { transform: translateY(0); }
            40% { transform: translateY(-30px); }
            80% { transform: translateY(-15px); }
          }
        `}</style>
      </div>
    );
  }

  // Playing state
  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      fontFamily: '"Montserrat", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 3s ease-in-out infinite'
      }}>⚡</div>
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '15%',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 4s ease-in-out infinite reverse'
      }}>🏃‍♂️</div>

      {/* Header with Timer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '0.5rem 1rem',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          Score: {score}
        </div>

        <div style={{
          background: getTimerColor(),
          borderRadius: '20px',
          padding: '0.5rem 1rem',
          fontSize: '1.3rem',
          fontWeight: '700',
          animation: timeLeft <= 10 ? 'urgentFlash 0.5s infinite' : 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          ⏰ {timeLeft}s
        </div>

        {streak > 1 && (
          <div style={{
            background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
            borderRadius: '20px',
            padding: '0.5rem 1rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            animation: 'streakGlow 1s infinite alternate'
          }}>
            🔥 {streak} Streak!
          </div>
        )}
      </div>

      {/* Timer Progress Bar */}
      <div style={{
        height: '6px',
        background: 'rgba(255, 255, 255, 0.2)',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: getTimerColor(),
          width: `${(timeLeft / 60) * 100}%`,
          transition: 'width 1s linear',
          boxShadow: timeLeft <= 10 ? '0 0 10px currentColor' : 'none'
        }} />
      </div>

      {/* Question Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '25px',
          padding: '2rem',
          textAlign: 'center',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          animation: isAnswered ? (selectedAnswer === currentQ.correct ? 'correctPulse 0.6s' : 'wrongShake 0.6s') : 'none'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>
            {currentQ.emoji}
          </div>
          
          <h2 style={{ 
            fontSize: '1.6rem', 
            marginBottom: '1.5rem', 
            lineHeight: '1.4',
            fontWeight: '600'
          }}>
            {currentQ.question}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnswered}
                style={{
                  background: isAnswered 
                    ? (index === currentQ.correct 
                      ? 'linear-gradient(135deg, #27AE60, #2ECC71)' 
                      : index === selectedAnswer 
                      ? 'linear-gradient(135deg, #E74C3C, #C0392B)' 
                      : 'linear-gradient(135deg, #7F8C8D, #95A5A6)')
                    : 'linear-gradient(135deg, #3498DB, #2980B9)',
                  border: 'none',
                  borderRadius: '15px',
                  padding: '1rem 1.5rem',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  opacity: isAnswered && index !== currentQ.correct && index !== selectedAnswer ? 0.5 : 1
                }}
                onMouseOver={(e) => {
                  if (!isAnswered) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isAnswered) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.2)';
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes urgentFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes streakGlow {
          0% { box-shadow: 0 0 10px rgba(231, 76, 60, 0.5); }
          100% { box-shadow: 0 0 20px rgba(231, 76, 60, 0.8); }
        }
        @keyframes correctPulse {
          0% { transform: scale(1); background: rgba(39, 174, 96, 0.3); }
          50% { transform: scale(1.05); background: rgba(39, 174, 96, 0.5); }
          100% { transform: scale(1); background: rgba(255, 255, 255, 0.1); }
        }
        @keyframes wrongShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default TimedChallengeQuiz;
