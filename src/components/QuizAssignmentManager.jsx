import React, { useState, useEffect } from 'react';
import '../styles/QuizAssignmentManager.css';

const QuizAssignmentManager = () => {
  const [activeTab, setActiveTab] = useState('createQuiz'); // createQuiz, createQuestions, myAssignments, myQuestions
  
  // Quiz Assignment State
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [quizForm, setQuizForm] = useState({
    quizType: 'multiple-choice',
    title: '',
    description: '',
    assignedGrade: '',
    dueDate: '',
    maxAttempts: 3,
    timeLimit: 600,
    useCustomQuestions: false,
    selectedQuestions: []
  });

  // Custom Question State
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: 'heart',
    difficulty: 'medium',
    grade: ''
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionStats, setQuestionStats] = useState(null);

  // Filter State
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    grade: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch assignments
  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/teacher/quiz/my-assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      alert('Failed to load quiz assignments');
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Fetch custom questions
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.difficulty !== 'all') queryParams.append('difficulty', filters.difficulty);
      if (filters.grade) queryParams.append('grade', filters.grade);

      const response = await fetch(`${API_BASE_URL}/api/teacher/questions/my-questions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load custom questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Fetch question statistics
  const fetchQuestionStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/teacher/questions/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setQuestionStats(data);
    } catch (error) {
      console.error('Error fetching question stats:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'myAssignments') {
      fetchAssignments();
    } else if (activeTab === 'myQuestions' || activeTab === 'createQuiz') {
      fetchQuestions();
      fetchQuestionStats();
    }
  }, [activeTab, filters]);

  // Create quiz assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    
    if (!quizForm.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/teacher/quiz/assign-quiz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...quizForm,
          customQuestions: quizForm.useCustomQuestions ? quizForm.selectedQuestions : []
        })
      });

      if (!response.ok) throw new Error('Failed to create assignment');
      const data = await response.json();
      
      alert(`Quiz assigned successfully! Quiz Code: ${data.assignment.quizCode}`);
      setQuizForm({
        quizType: 'multiple-choice',
        title: '',
        description: '',
        assignedGrade: '',
        dueDate: '',
        maxAttempts: 3,
        timeLimit: 600,
        useCustomQuestions: false,
        selectedQuestions: []
      });
      
      setActiveTab('myAssignments');
      fetchAssignments();
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create quiz assignment');
    }
  };

  // Create custom question
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    
    if (!questionForm.questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (questionForm.options.some(opt => !opt.trim())) {
      alert('Please fill in all options');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingQuestion 
        ? `${API_BASE_URL}/api/teacher/questions/${editingQuestion._id}`
        : `${API_BASE_URL}/api/teacher/questions/create`;
      
      const method = editingQuestion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionForm)
      });

      if (!response.ok) throw new Error('Failed to save question');
      
      alert(editingQuestion ? 'Question updated successfully!' : 'Question created successfully!');
      
      setQuestionForm({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        category: 'heart',
        difficulty: 'medium',
        grade: ''
      });
      setEditingQuestion(null);
      fetchQuestions();
      fetchQuestionStats();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question');
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/teacher/quiz/delete/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete assignment');
      alert('Assignment deleted successfully');
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

  // Toggle assignment active status
  const handleToggleAssignment = async (assignmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/teacher/quiz/toggle-active/${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle assignment');
      fetchAssignments();
    } catch (error) {
      console.error('Error toggling assignment:', error);
      alert('Failed to update assignment status');
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/teacher/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete question');
      alert('Question deleted successfully');
      fetchQuestions();
      fetchQuestionStats();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  // Toggle question active status
  const handleToggleQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/teacher/questions/toggle-active/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to toggle question');
      fetchQuestions();
      fetchQuestionStats();
    } catch (error) {
      console.error('Error toggling question:', error);
      alert('Failed to update question status');
    }
  };

  // Edit question
  const handleEditQuestion = (question) => {
    setQuestionForm({
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      category: question.category,
      difficulty: question.difficulty,
      grade: question.grade
    });
    setEditingQuestion(question);
    setActiveTab('createQuestions');
  };

  // Toggle question selection for quiz
  const toggleQuestionSelection = (questionId) => {
    setQuizForm(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.includes(questionId)
        ? prev.selectedQuestions.filter(id => id !== questionId)
        : [...prev.selectedQuestions, questionId]
    }));
  };

  const categories = [
    { value: 'heart', label: '❤️ Heart', icon: '❤️' },
    { value: 'brain', label: '🧠 Brain', icon: '🧠' },
    { value: 'lungs', label: '🫁 Lungs', icon: '🫁' },
    { value: 'liver', label: '🫀 Liver', icon: '🫀' },
    { value: 'kidney', label: '🫘 Kidney', icon: '🫘' },
    { value: 'stomach', label: '🫃 Stomach', icon: '🫃' },
    { value: 'intestine', label: '🌀 Intestine', icon: '🌀' },
    { value: 'general', label: '📚 General', icon: '📚' }
  ];

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '📚';
  };

  return (
    <div className="quiz-assignment-manager">
      <div className="manager-tabs">
        <button 
          className={activeTab === 'createQuiz' ? 'active' : ''}
          onClick={() => setActiveTab('createQuiz')}
        >
          📝 Create Quiz Assignment
        </button>
        <button 
          className={activeTab === 'createQuestions' ? 'active' : ''}
          onClick={() => setActiveTab('createQuestions')}
        >
          ✏️ Create Questions
        </button>
        <button 
          className={activeTab === 'myAssignments' ? 'active' : ''}
          onClick={() => setActiveTab('myAssignments')}
        >
          📋 My Assignments
        </button>
        <button 
          className={activeTab === 'myQuestions' ? 'active' : ''}
          onClick={() => setActiveTab('myQuestions')}
        >
          📚 Question Bank
        </button>
      </div>

      {/* CREATE QUIZ ASSIGNMENT TAB */}
      {activeTab === 'createQuiz' && (
        <div className="tab-content">
          <h2>Create Quiz Assignment</h2>
          <form onSubmit={handleCreateAssignment} className="quiz-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Quiz Type *</label>
                  <select 
                    value={quizForm.quizType}
                    onChange={(e) => setQuizForm({...quizForm, quizType: e.target.value})}
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="timed-challenge">Timed Challenge</option>
                    <option value="memory-matching">Memory Matching</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Grade Level *</label>
                  <select 
                    value={quizForm.assignedGrade}
                    onChange={(e) => setQuizForm({...quizForm, assignedGrade: e.target.value})}
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="7">Grade 7</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Quiz Title *</label>
                <input 
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                  placeholder="e.g., Cardiovascular System Quiz"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                  placeholder="Brief description of the quiz topic..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Quiz Settings</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="datetime-local"
                    value={quizForm.dueDate}
                    onChange={(e) => setQuizForm({...quizForm, dueDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Attempts</label>
                  <input 
                    type="number"
                    value={quizForm.maxAttempts}
                    onChange={(e) => setQuizForm({...quizForm, maxAttempts: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                  />
                </div>
                <div className="form-group">
                  <label>Time Limit (seconds)</label>
                  <input 
                    type="number"
                    value={quizForm.timeLimit}
                    onChange={(e) => setQuizForm({...quizForm, timeLimit: parseInt(e.target.value)})}
                    min="60"
                    step="60"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Custom Questions</h3>
              <div className="custom-questions-toggle">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={quizForm.useCustomQuestions}
                    onChange={(e) => setQuizForm({...quizForm, useCustomQuestions: e.target.checked})}
                  />
                  Use custom questions from my question bank
                </label>
              </div>

              {quizForm.useCustomQuestions && (
                <div className="question-selector">
                  {loadingQuestions ? (
                    <p>Loading questions...</p>
                  ) : questions.length === 0 ? (
                    <p className="no-questions">
                      No questions available. Create some questions first in the "Create Questions" tab.
                    </p>
                  ) : (
                    <>
                      <p className="selection-info">
                        Selected: {quizForm.selectedQuestions.length} / {questions.length} questions
                      </p>
                      <div className="question-list-compact">
                        {questions.map(q => (
                          <div 
                            key={q._id} 
                            className={`question-item-compact ${quizForm.selectedQuestions.includes(q._id) ? 'selected' : ''}`}
                            onClick={() => toggleQuestionSelection(q._id)}
                          >
                            <input 
                              type="checkbox"
                              checked={quizForm.selectedQuestions.includes(q._id)}
                              readOnly
                            />
                            <div className="question-preview">
                              <span className="category-icon">{getCategoryIcon(q.category)}</span>
                              <span className="question-text">{q.questionText}</span>
                              <span className={`difficulty-badge ${q.difficulty}`}>{q.difficulty}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                🎯 Create Quiz Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE QUESTIONS TAB */}
      {activeTab === 'createQuestions' && (
        <div className="tab-content">
          <h2>{editingQuestion ? 'Edit Question' : 'Create Custom Question'}</h2>
          
          {questionStats && (
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-label">Total Questions:</span>
                <span className="stat-value">{questionStats.totalQuestions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active:</span>
                <span className="stat-value">{questionStats.activeQuestions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Used in Quizzes:</span>
                <span className="stat-value">{questionStats.totalUsage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateQuestion} className="question-form">
            <div className="form-group">
              <label>Question Text *</label>
              <textarea 
                value={questionForm.questionText}
                onChange={(e) => setQuestionForm({...questionForm, questionText: e.target.value})}
                placeholder="Enter your question here..."
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Options *</label>
              {questionForm.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input 
                    type="radio"
                    name="correctAnswer"
                    checked={questionForm.correctAnswer === index}
                    onChange={() => setQuestionForm({...questionForm, correctAnswer: index})}
                  />
                  <input 
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...questionForm.options];
                      newOptions[index] = e.target.value;
                      setQuestionForm({...questionForm, options: newOptions});
                    }}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {questionForm.correctAnswer === index && (
                    <span className="correct-badge">✓ Correct</span>
                  )}
                </div>
              ))}
              <p className="hint">Click the radio button to select the correct answer</p>
            </div>

            <div className="form-group">
              <label>Explanation (Optional)</label>
              <textarea 
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm({...questionForm, explanation: e.target.value})}
                placeholder="Explain why this is the correct answer..."
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select 
                  value={questionForm.category}
                  onChange={(e) => setQuestionForm({...questionForm, category: e.target.value})}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty *</label>
                <select 
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value})}
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label>Grade Level</label>
                <select 
                  value={questionForm.grade}
                  onChange={(e) => setQuestionForm({...questionForm, grade: e.target.value})}
                >
                  <option value="">All Grades</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingQuestion ? '💾 Update Question' : '✨ Create Question'}
              </button>
              {editingQuestion && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setEditingQuestion(null);
                    setQuestionForm({
                      questionText: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0,
                      explanation: '',
                      category: 'heart',
                      difficulty: 'medium',
                      grade: ''
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* MY ASSIGNMENTS TAB */}
      {activeTab === 'myAssignments' && (
        <div className="tab-content">
          <h2>My Quiz Assignments</h2>
          {loadingAssignments ? (
            <p>Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <div className="empty-state">
              <p>No quiz assignments yet. Create your first assignment!</p>
              <button 
                className="btn-primary"
                onClick={() => setActiveTab('createQuiz')}
              >
                Create Assignment
              </button>
            </div>
          ) : (
            <div className="assignments-grid">
              {assignments.map(assignment => (
                <div key={assignment._id} className="assignment-card">
                  <div className="assignment-header">
                    <h3>{assignment.title}</h3>
                    <span className={`status-badge ${assignment.isActive ? 'active' : 'inactive'}`}>
                      {assignment.isActive ? '✓ Active' : '✕ Inactive'}
                    </span>
                  </div>
                  
                  <div className="assignment-info">
                    <div className="info-row">
                      <span className="label">Quiz Code:</span>
                      <span className="code-display">{assignment.quizCode}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Type:</span>
                      <span>{assignment.quizType}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Grade:</span>
                      <span>Grade {assignment.assignedGrade}</span>
                    </div>
                    {assignment.dueDate && (
                      <div className="info-row">
                        <span className="label">Due:</span>
                        <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="assignment-stats">
                    <div className="stat">
                      <span className="stat-number">{assignment.submissions || 0}</span>
                      <span className="stat-label">Submissions</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{assignment.uniqueStudents || 0}</span>
                      <span className="stat-label">Students</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">
                        {assignment.averageScore ? `${assignment.averageScore.toFixed(0)}%` : 'N/A'}
                      </span>
                      <span className="stat-label">Avg Score</span>
                    </div>
                  </div>

                  <div className="assignment-actions">
                    <button 
                      className="btn-toggle"
                      onClick={() => handleToggleAssignment(assignment._id)}
                    >
                      {assignment.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteAssignment(assignment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY QUESTIONS TAB */}
      {activeTab === 'myQuestions' && (
        <div className="tab-content">
          <h2>Question Bank</h2>
          
          <div className="filters-bar">
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select 
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select 
              value={filters.grade}
              onChange={(e) => setFilters({...filters, grade: e.target.value})}
            >
              <option value="">All Grades</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
            </select>
          </div>

          {loadingQuestions ? (
            <p>Loading questions...</p>
          ) : questions.length === 0 ? (
            <div className="empty-state">
              <p>No questions yet. Create your first custom question!</p>
              <button 
                className="btn-primary"
                onClick={() => setActiveTab('createQuestions')}
              >
                Create Question
              </button>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map(question => (
                <div key={question._id} className="question-card">
                  <div className="question-header">
                    <div className="question-meta">
                      <span className="category-icon">{getCategoryIcon(question.category)}</span>
                      <span className={`difficulty-badge ${question.difficulty}`}>
                        {question.difficulty}
                      </span>
                      {question.grade && (
                        <span className="grade-badge">Grade {question.grade}</span>
                      )}
                      <span className={`status-badge ${question.isActive ? 'active' : 'inactive'}`}>
                        {question.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="question-actions">
                      <button onClick={() => handleEditQuestion(question)}>✏️ Edit</button>
                      <button onClick={() => handleToggleQuestion(question._id)}>
                        {question.isActive ? '🔒 Disable' : '🔓 Enable'}
                      </button>
                      <button onClick={() => handleDeleteQuestion(question._id)}>🗑️ Delete</button>
                    </div>
                  </div>
                  
                  <div className="question-content">
                    <p className="question-text">{question.questionText}</p>
                    <div className="options-list">
                      {question.options.map((option, index) => (
                        <div 
                          key={index} 
                          className={`option ${index === question.correctAnswer ? 'correct' : ''}`}
                        >
                          <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                          <span className="option-text">{option}</span>
                          {index === question.correctAnswer && (
                            <span className="correct-indicator">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="explanation">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                    <div className="question-stats-mini">
                      <span>Used {question.usageCount || 0} times</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizAssignmentManager;
