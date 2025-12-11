import React, { useState, useEffect } from 'react';
import { baseQuizQuestions } from '../../data/quizQuestions';
import api from '../../lib/api';
import { randomizeQuiz, formatTime, calculatePercentage } from '../../lib/quizUtils';
import QuizResultsPage from '../QuizResultsPage';

// Add Montserrat font
const addMontserratFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const QuizContainer = () => {
  // Add font on component mount
  useEffect(() => {
    addMontserratFont();
  }, []);

  // Get assignment ID from URL if in teacher mode
  const getAssignmentId = () => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    return params.get('assignment');
  };

  const [assignmentId, setAssignmentId] = useState(getAssignmentId());
  const [assignmentData, setAssignmentData] = useState(null);

  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle answer options while keeping track of correct answer
  const shuffleOptions = (question) => {
    const optionsWithIndex = question.options.map((option, index) => ({
      option,
      originalIndex: index
    }));
    
    const shuffledOptions = shuffleArray(optionsWithIndex);
    
    return {
      ...question,
      options: shuffledOptions.map(item => item.option),
      correct: shuffledOptions.findIndex(item => item.originalIndex === question.correct)
    };
  };

  // Create shuffled questions with shuffled options (20 questions per session)
  const [quizQuestions, setQuizQuestions] = useState(() => {
    const shuffledQuestions = shuffleArray(baseQuizQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, 20); // Take 20 questions
    return selectedQuestions.map(question => shuffleOptions(question));
  });

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes = 600 seconds
  const [startTime, setStartTime] = useState(Date.now());
  const [attemptInfo, setAttemptInfo] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  // Check attempts on mount
  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentData();
    } else {
      checkAttempts();
    }
  }, [assignmentId]);

  // Fetch assignment data if in teacher mode
  const fetchAssignmentData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/quiz/${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setAssignmentData(data.data);
        
        // Check if student has exceeded attempt limit
        if (data.data.attemptsMade >= data.data.maxAttempts) {
          setIsBlocked(true);
          setIsLoading(false);
          return;
        }
        
        // Set custom questions if available
        if (data.data.customQuestions && data.data.customQuestions.length > 0) {
          const formattedQuestions = data.data.customQuestions.map(q => ({
            question: q.questionText,
            options: q.options,
            correct: q.correctAnswer,
            explanation: q.explanation || 'No explanation provided'
          }));
          setQuizQuestions(formattedQuestions.map(q => shuffleOptions(q)));
        }
        setTimeRemaining(data.data.timeLimit || 600);
        setIsLoading(false);
      } else {
        alert(data.message || 'Failed to load assignment');
        window.location.href = '#quiz';
      }
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
      alert('Failed to load quiz assignment');
      window.location.href = '#quiz';
    }
  };

  // Timer countdown
  useEffect(() => {
    if (quizCompleted || showResults || isLoading) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizCompleted, showResults, isLoading]);

  const checkAttempts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found, skipping attempt check');
        setIsLoading(false);
        return;
      }

      console.log('Checking quiz attempts...');
      const response = await api.getQuizAttempts(token, 'multiple-choice');
      console.log('Attempt check response:', response);
      
      if (response.success) {
        setAttemptInfo(response.data);
        // No longer blocking based on attempts
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to check attempts:', error);
      // Allow quiz to continue even if attempt check fails
      setIsLoading(false);
    }
  };

  const handleTimeExpired = () => {
    setQuizCompleted(true);
    submitQuizToBackend();
  };

  const handleBackClick = () => {
    window.location.href = '#quiz';
  };

  const handleAnswerClick = (optionIndex) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    
    // Check if correct
    const isCorrect = optionIndex === quizQuestions[currentQuestion].correct;
    
    // Store answer
    const answerData = {
      questionIndex: currentQuestion,
      question: quizQuestions[currentQuestion].question,
      selectedAnswer: quizQuestions[currentQuestion].options[optionIndex],
      correctAnswer: quizQuestions[currentQuestion].options[quizQuestions[currentQuestion].correct],
      isCorrect
    };
    setUserAnswers([...userAnswers, answerData]);
    
    if (isCorrect) {
      setScore(score + 1);
      setAnimationClass('correct-answer');
    } else {
      setAnimationClass('wrong-answer');
    }
    
    // Show explanation after a short delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsAnswered(false);
      setAnimationClass('');
    } else {
      setQuizCompleted(true);
      // Submit quiz results to backend
      submitQuizToBackend();
    }
  };

  // Submit quiz results to backend
  const submitQuizToBackend = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found, skipping quiz submission');
        setShowResults(true);
        return;
      }

      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const percentage = calculatePercentage(score, quizQuestions.length);

      // Determine quiz type: use 'custom-quiz' if assignment has custom questions
      const quizType = assignmentData?.customQuestions?.length > 0 ? 'custom-quiz' : 'multiple-choice';

      const quizData = {
        quizType: quizType,
        score: score,
        totalQuestions: quizQuestions.length,
        percentage,
        timeTaken,
        answers: userAnswers
      };

      // Check if this is teacher mode (has assignment ID)
      if (assignmentId) {
        // Submit to teacher quiz assignment
        const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';
        const response = await fetch(`${API_URL}/api/teacher/quiz/submit/${assignmentId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            score: score,
            totalQuestions: quizQuestions.length,
            percentage,
            timeTaken,
            answers: userAnswers
          })
        });

        const data = await response.json();
        if (data.success) {
          setQuizResults({ ...data.data, isTeacherMode: true });
          setShowResults(true);
        } else {
          alert(data.message || 'Failed to submit quiz to teacher');
        }
      } else {
        // Solo mode - submit to regular endpoint
        const response = await api.submitQuiz(token, quizData);
        console.log('Quiz submitted successfully:', response);
        
        if (response.success) {
          setQuizResults({ ...response.data, isTeacherMode: false });
          setShowResults(true);
        }
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert(error.message || 'Failed to submit quiz');
    }
  };

  const restartQuiz = () => {
    // Reshuffle questions and options for a new game (20 questions per session)
    const shuffledQuestions = shuffleArray(baseQuizQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, 20); // Take 20 questions
    const newQuizQuestions = selectedQuestions.map(question => shuffleOptions(question));
    setQuizQuestions(newQuizQuestions);
    
    // Reset all state
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowExplanation(false);
    setQuizCompleted(false);
    setIsAnswered(false);
    setAnimationClass('');
    setUserAnswers([]);
    setTimeRemaining(600);
    setStartTime(Date.now());
    setShowResults(false);
    setQuizResults(null);
    
    // Recheck attempts
    checkAttempts();
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return { emoji: "🌟", message: "Amazing! You're an anatomy superstar!", color: "#FFD700" };
    if (percentage >= 70) return { emoji: "🎉", message: "Great job! You know your body well!", color: "#32CD32" };
    if (percentage >= 50) return { emoji: "👍", message: "Good work! Keep learning!", color: "#FF6347" };
    return { emoji: "💪", message: "Nice try! Practice makes perfect!", color: "#FF69B4" };
  };

  function getOptionBackground(index) {
    if (!isAnswered) {
      return 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
    }
    if (index === quizQuestions[currentQuestion].correct) {
      return 'linear-gradient(135deg, #32CD32, #228B22)';
    }
    if (index === selectedAnswer && selectedAnswer !== quizQuestions[currentQuestion].correct) {
      return 'linear-gradient(135deg, #FF6B6B, #DC143C)';
    }
    return 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
  }

  function getOptionBorder(index) {
    if (!isAnswered) {
      return '2px solid rgba(255, 255, 255, 0.3)';
    }
    if (index === quizQuestions[currentQuestion].correct) {
      return '3px solid #32CD32';
    }
    if (index === selectedAnswer && selectedAnswer !== quizQuestions[currentQuestion].correct) {
      return '3px solid #FF6B6B';
    }
    return '2px solid rgba(255, 255, 255, 0.2)';
  }

  // Show loading while checking attempts
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '1.125rem' }}>Checking quiz availability...</p>
        </div>
      </div>
    );
  }

  // Show blocked message if attempt limit reached
  if (isBlocked) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          color: 'white'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Quiz Locked</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', opacity: 0.9 }}>
            You have reached the maximum number of attempts ({assignmentData?.maxAttempts || 0}) for this quiz.
          </p>
          <p style={{ fontSize: '1rem', marginBottom: '2rem', opacity: 0.8 }}>
            Attempts made: {assignmentData?.attemptsMade || 0} / {assignmentData?.maxAttempts || 0}
          </p>
          <button
            onClick={() => window.location.href = '#quiz'}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s',
              fontFamily: '"Montserrat", sans-serif'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Back to Quiz Menu
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const scoreInfo = getScoreMessage();
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        padding: '2rem',
        fontFamily: '"Montserrat", sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          animation: 'celebrationPulse 2s infinite alternate'
        }}>
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '0.8rem', animation: 'bounce 1s infinite' }}>
            {scoreInfo.emoji}
          </div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', marginBottom: '0.8rem', color: scoreInfo.color }}>
            Quiz Complete!
          </h1>
          <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', margin: '0.8rem 0', fontWeight: 'bold' }}>
            {score}/{quizQuestions.length}
          </div>
          <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', marginBottom: '1.5rem', opacity: 0.9 }}>
            {scoreInfo.message}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={restartQuiz}
              style={{
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                border: 'none',
                borderRadius: '20px',
                padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem)',
                color: 'white',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                fontWeight: 'bold',
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
                padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem)',
                color: 'white',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                fontWeight: 'bold',
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
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  // Show results page if quiz is completed
  if (showResults && quizResults) {
    return (
      <QuizResultsPage
        score={score}
        totalQuestions={quizQuestions.length}
        percentage={quizResults.percentage || calculatePercentage(score, quizQuestions.length)}
        timeTaken={Math.floor((Date.now() - startTime) / 1000)}
        answers={userAnswers}
        attemptNumber={quizResults.attemptNumber || 1}
        remainingAttempts={quizResults.remainingAttempts || 0}
        newBadges={quizResults.newBadges || []}
        isTeacherMode={quizResults.isTeacherMode || false}
        teacherName={quizResults.teacherName}
        onRetry={restartQuiz}
        onBack={handleBackClick}
      />
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', 
      flexDirection: 'column',
      color: 'white',
      fontFamily: '"Montserrat", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        fontSize: '3rem',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }}>🧠</div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        fontSize: '2.5rem',
        opacity: 0.1,
        animation: 'float 4s ease-in-out infinite reverse'
      }}>❤️</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '20%',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 5s ease-in-out infinite'
      }}>💪</div>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <button 
          onClick={handleBackClick}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '25px',
            padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
            color: 'white',
            cursor: 'pointer',
            fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Back to Quiz Menu
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(2rem, 5vw, 2.2rem)', marginBottom: '0.5rem' }}>🎯</div>
          <div style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: '600' }}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
        </div>
        
        <div style={{ 
          textAlign: 'center',
          background: timeRemaining < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.2)',
          borderRadius: '15px',
          padding: '0.75rem 1.5rem'
        }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.25rem' }}>Time Left</div>
          <div style={{ 
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
            fontWeight: '700',
            color: timeRemaining < 60 ? '#FCA5A5' : 'white'
          }}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '25px',
          padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          fontWeight: '600'
        }}>
          Score: {score}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        margin: '0 2rem',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
          width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
          transition: 'width 0.5s ease',
          borderRadius: '4px'
        }} />
      </div>

      {/* Main Quiz Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Question Card */}
        <div className={animationClass} style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '25px',
          padding: '2rem',
          textAlign: 'center',
          width: '100%',
          maxWidth: '700px',
          boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          minHeight: 'auto'
        }}>
          <div style={{ fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', marginBottom: '1.2rem', animation: 'pulse 2s infinite' }}>
            {currentQ.emoji}
          </div>
          <h2 style={{ 
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', 
            marginBottom: '1.8rem', 
            lineHeight: '1.4',
            fontWeight: '600'
          }}>
            {currentQ.question}
          </h2>

          {/* Answer Options - 2x2 Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            minHeight: '200px'
          }}>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnswered}
                style={{
                  background: getOptionBackground(index),
                  border: getOptionBorder(index),
                  borderRadius: '15px',
                  padding: 'clamp(0.8rem, 2.5vw, 1.2rem)',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                  fontWeight: '600',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                  transform: selectedAnswer === index ? 'scale(1.05)' : 'scale(1)',
                  opacity: isAnswered && selectedAnswer !== index ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  minHeight: '80px'
                }}
                onMouseOver={(e) => {
                  if (!isAnswered) {
                    e.target.style.transform = 'scale(1.05) translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isAnswered) {
                    e.target.style.transform = 'scale(1) translateY(0)';
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Feedback and Next Button */}
      {showExplanation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out',
          padding: '1rem'
        }}>
          <div style={{
            background: selectedAnswer === currentQ.correct 
              ? 'linear-gradient(135deg, #4ECDC4, #44A08D)' 
              : 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            animation: 'modalSlideIn 0.5s ease-out',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            {/* Feedback Icon and Message */}
            <div style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
              marginBottom: '1rem',
              animation: selectedAnswer === currentQ.correct ? 'bounce 1s infinite' : 'shake 0.5s ease-out'
            }}>
              {selectedAnswer === currentQ.correct ? '🎉' : '😔'}
            </div>
            
            <h3 style={{ 
              fontSize: 'clamp(1.3rem, 4vw, 2rem)', 
              marginBottom: '1.2rem',
              color: 'white',
              fontWeight: '700'
            }}>
              {selectedAnswer === currentQ.correct ? 'Correct!' : 'Oops!'}
            </h3>
            
            {/* Explanation */}
            <p style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
              lineHeight: '1.5', 
              marginBottom: '2rem',
              color: 'white',
              opacity: 0.95,
              fontWeight: '400'
            }}>
              {currentQ.explanation}
            </p>
            
            {/* Next Button */}
            <button
              onClick={handleNextQuestion}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '25px',
                padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                color: 'white',
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                animation: 'bounceIn 0.8s ease-out',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {currentQuestion < quizQuestions.length - 1 ? '➡️ Next Question' : '🎉 Finish Quiz'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalSlideIn {
          0% { 
            opacity: 0; 
            transform: scale(0.7) translateY(-50px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        @keyframes bounce {
          0%, 20%, 60%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          80% { transform: translateY(-15px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .correct-answer {
          animation: correctShake 0.6s ease-out;
          border-color: #32CD32 !important;
          box-shadow: 0 0 30px rgba(50, 205, 50, 0.5) !important;
        }
        .wrong-answer {
          animation: wrongShake 0.6s ease-out;
          border-color: #FF6B6B !important;
          box-shadow: 0 0 30px rgba(255, 107, 107, 0.5) !important;
        }
        @keyframes correctShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes wrongShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default QuizContainer;