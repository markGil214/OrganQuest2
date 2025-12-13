import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from './Header';
import '../styles/QuizModeSelector.css';

const QuizModeSelector = ({ quizType, onModeSelect, onBack }) => {
  const { ts } = useLanguage();
  const [teacherCode, setTeacherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username') || 'Explorer';
  const userAvatar = localStorage.getItem('userAvatar') || '/avatars/avatar-1.svg';

  // Map frontend quiz type to backend quiz type
  const quizTypeMap = {
    'mcq': 'multiple-choice',
    'memory': 'memory-matching',
    'timed': 'timed-challenge'
  };

  const handleSoloMode = () => {
    onModeSelect('solo', null);
  };

  const handleTeacherMode = async () => {
    if (!teacherCode.trim()) {
      setError('Please enter a quiz code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      console.log('Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        setError('Please log in to take this quiz');
        setLoading(false);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_API_URL}/api/teacher/quiz/by-code/${teacherCode.trim()}`;
      console.log('Fetching quiz from:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log out and log in again.');
        }
        throw new Error(data.message || 'Invalid quiz code');
      }

      // Check if quiz type matches
      const expectedType = quizTypeMap[quizType] || quizType;
      console.log('Expected type:', expectedType, 'Actual type:', data.data.quizType);
      
      if (data.data.quizType !== expectedType) {
        const quizTypeNames = {
          'multiple-choice': 'Multiple Choice',
          'memory-matching': 'Memory Matching',
          'timed-challenge': 'Timed Challenge'
        };
        const currentQuizName = quizTypeNames[data.data.quizType] || data.data.quizType;
        const expectedQuizName = quizTypeNames[expectedType] || expectedType;
        throw new Error(`This code is for ${currentQuizName} quiz. Please select ${currentQuizName} from the quiz menu.`);
      }

      console.log('Calling onModeSelect with:', data.data);
      onModeSelect('teacher', data.data);
    } catch (err) {
      console.error('Error in handleTeacherMode:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-mode-selector" style={{
      backgroundImage: 'url(/school/bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header onProfileClick={() => {}} userAvatar={userAvatar} username={username} />
      <div className="mode-selector-container">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <h2 className="mode-title">Choose Quiz Mode</h2>
        <p className="mode-subtitle">How would you like to take this quiz?</p>

        <div className="mode-cards">
          {/* Solo Mode Card */}
          <div className="mode-card solo-mode" onClick={handleSoloMode}>
            <div className="mode-icon">🎯</div>
            <h3>Solo Mode</h3>
            <p>Practice on your own</p>
            <ul className="mode-features">
              <li>✓ Self-paced learning</li>
              <li>✓ Unlimited attempts</li>
              <li>✓ Track your progress</li>
              <li>✓ Earn badges</li>
            </ul>
            <button className="mode-btn solo-btn">
              Start Solo Quiz
            </button>
          </div>

          {/* Teacher Mode Card */}
          <div className="mode-card teacher-mode">
            <div className="mode-icon">👩‍🏫</div>
            <h3>Teacher Mode</h3>
            <p>Complete an assigned quiz</p>
            
            <div className="code-input-section">
              <label htmlFor="quizCode">Enter Quiz Code</label>
              <input
                id="quizCode"
                type="text"
                className="quiz-code-input"
                placeholder="ABC123"
                value={teacherCode}
                onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                maxLength={6}
                disabled={loading}
              />
              
              {error && (
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}
            </div>

            <ul className="mode-features">
              <li>✓ Quiz assigned by teacher</li>
              <li>✓ Due date tracking</li>
              <li>✓ Limited attempts</li>
              <li>✓ Results sent to teacher</li>
            </ul>

            <button 
              className="mode-btn teacher-btn"
              onClick={handleTeacherMode}
              disabled={loading || !teacherCode.trim()}
            >
              {loading ? 'Checking Code...' : 'Start Teacher Quiz'}
            </button>
          </div>
        </div>

        <div className="mode-info">
          <p>
            <strong>Tip:</strong> Solo mode is great for practice! Teacher mode is for graded assignments from your teacher.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizModeSelector;
