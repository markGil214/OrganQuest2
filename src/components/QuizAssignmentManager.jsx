import React, { useState, useEffect } from 'react';
import '../styles/QuizAssignmentManager.css';

const QuizAssignmentManager = () => {
  const [activeTab, setActiveTab] = useState('assignments'); // assignments, questionBank
  const [creationStep, setCreationStep] = useState(0); // 0=list, 1=assignment info, 2=build quiz, 3=finalize, 4=deployed
  
  // Quiz Assignment State
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({
    quizType: 'multiple-choice',
    title: '',
    description: '',
    assignedGrade: '',
    dueDate: '',
    maxAttempts: 3,
    timeLimit: 600
  });

  // Quiz Building State
  const [quizQuestions, setQuizQuestions] = useState([]); // Questions added to current assignment
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  
  // Custom Question State (Question Bank)
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

  // Submissions View State
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    grade: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Auto-populate teacher's grade on component mount
  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const teacherGrade = userData.assignedGrade || '';
        if (teacherGrade) {
          setQuestionForm(prev => ({ ...prev, grade: teacherGrade }));
          setFilters(prev => ({ ...prev, grade: teacherGrade }));
        }
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);

  // Fetch submissions for an assignment
  const fetchSubmissions = async (assignmentId) => {
    setLoadingSubmissions(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/teacher/quiz/submissions/${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setSubmissions(data.data.submissions || []);
      setViewingSubmissions(data.data.quiz);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Error loading submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Download submissions as CSV
  const downloadCSV = () => {
    if (!submissions || submissions.length === 0) {
      alert('No submissions to download');
      return;
    }

    // Prepare CSV headers
    const headers = [
      'Student Name',
      'Score',
      'Percentage',
      'Time Taken (seconds)',
      'Attempt Number',
      'Submitted At'
    ];

    // Prepare CSV rows
    const rows = submissions.map(submission => [
      submission.studentName || 'Anonymous',
      submission.score,
      submission.percentage?.toFixed(2) || 0,
      submission.timeTaken || 0,
      submission.attemptNumber || 1,
      new Date(submission.submittedAt).toLocaleString()
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${viewingSubmissions.title}_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoadingAssignments(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/teacher/quiz/my-assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized: Please log in as a teacher');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Fetch custom questions
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoadingQuestions(false);
        return;
      }

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

      if (response.status === 401) {
        console.error('Unauthorized: Please log in as a teacher');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Fetch question statistics
  const fetchQuestionStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/teacher/questions/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized: Please log in as a teacher');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setQuestionStats(data);
    } catch (error) {
      console.error('Error fetching question stats:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return; // Don't fetch if not authenticated
    
    if (activeTab === 'assignments' && creationStep === 0) {
      fetchAssignments();
    } else if (activeTab === 'questionBank') {
      fetchQuestions();
      fetchQuestionStats();
    }
  }, [activeTab, filters]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return; // Don't fetch if not authenticated
    
    if (creationStep === 2) {
      fetchQuestions();
    }
  }, [creationStep]);

  // STEP 1: Start creating new assignment
  const startNewAssignment = () => {
    // Get teacher's assigned grade from localStorage
    const userDataStr = localStorage.getItem('userData');
    let teacherGrade = '';
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        teacherGrade = userData.assignedGrade || '';
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }

    setCurrentAssignment({
      quizType: 'multiple-choice',
      title: '',
      description: '',
      assignedGrade: teacherGrade, // Auto-populate with teacher's grade
      dueDate: '',
      maxAttempts: 3,
      timeLimit: 600
    });
    setQuizQuestions([]);
    setSelectedQuestionIds([]);
    setCreationStep(1);
  };

  // STEP 2: Save assignment info and move to quiz builder
  const handleAssignmentInfoSubmit = (e) => {
    e.preventDefault();
    
    if (!currentAssignment.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    
    if (!currentAssignment.assignedGrade) {
      alert('Please select a grade level');
      return;
    }

    setCreationStep(2); // Move to quiz builder
  };

  // STEP 2: Create new question inline
  const handleCreateQuestionInline = async (e) => {
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
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/teacher/questions/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...questionForm,
          grade: currentAssignment.assignedGrade
        })
      });

      if (response.status === 401) {
        alert('Unauthorized. Please log in as a teacher.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create question');
      }
      
      const data = await response.json();
      
      // Add to quiz questions
      setQuizQuestions([...quizQuestions, data.question]);
      setSelectedQuestionIds([...selectedQuestionIds, data.question._id]);
      
      // Reset form
      setQuestionForm({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        category: 'heart',
        difficulty: 'medium',
        grade: ''
      });
      
      // Refresh question bank
      fetchQuestions();
      alert('Question created and added to quiz!');
    } catch (error) {
      console.error('Error creating question:', error);
      alert(`Failed to create question: ${error.message}`);
    }
  };

  // STEP 2: Toggle question selection from bank
  const toggleQuestionSelection = (question) => {
    const isSelected = selectedQuestionIds.includes(question._id);
    
    if (isSelected) {
      setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== question._id));
      setQuizQuestions(quizQuestions.filter(q => q._id !== question._id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, question._id]);
      setQuizQuestions([...quizQuestions, question]);
    }
  };

  // STEP 3: Move to finalize
  const proceedToFinalize = () => {
    if (quizQuestions.length === 0) {
      alert('Please add at least one question to the quiz');
      return;
    }
    setCreationStep(3);
  };

  // STEP 4: Deploy assignment
  const handleDeployAssignment = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/teacher/quiz/assign-quiz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...currentAssignment,
          customQuestions: selectedQuestionIds
        })
      });

      if (!response.ok) throw new Error('Failed to deploy assignment');
      const data = await response.json();
      
      setCreationStep(4); // Show success
      setTimeout(() => {
        setCreationStep(0);
        fetchAssignments();
      }, 3000);
    } catch (error) {
      console.error('Error deploying assignment:', error);
      alert('Failed to deploy quiz assignment');
    }
  };

  // Cancel creation
  const cancelCreation = () => {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      setCreationStep(0);
      setCurrentAssignment({
        quizType: 'multiple-choice',
        title: '',
        description: '',
        assignedGrade: '',
        dueDate: '',
        maxAttempts: 3,
        timeLimit: 600
      });
      setQuizQuestions([]);
      setSelectedQuestionIds([]);
    }
  };

  // Question Bank: Create custom question
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
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

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

      if (response.status === 401) {
        alert('Unauthorized. Please log in as a teacher.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save question');
      }
      
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
      alert(`Failed to save question: ${error.message}`);
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const token = localStorage.getItem('authToken');
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
      const token = localStorage.getItem('authToken');
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
      const token = localStorage.getItem('authToken');
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
      const token = localStorage.getItem('authToken');
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

  const getStepTitle = () => {
    switch(creationStep) {
      case 1: return 'Step 1: Assignment Information';
      case 2: return 'Step 2: Build Quiz';
      case 3: return 'Step 3: Finalize';
      case 4: return 'Assignment Deployed!';
      default: return 'My Assignments';
    }
  };

  return (
    <div className="quiz-assignment-manager">
      {/* Main Tabs */}
      <div className="manager-tabs">
        <button 
          className={activeTab === 'assignments' && creationStep === 0 ? 'active' : ''}
          onClick={() => {
            setActiveTab('assignments');
            setCreationStep(0);
          }}
          disabled={creationStep > 0}
        >
          📋 My Assignments
        </button>
        <button 
          className={activeTab === 'questionBank' ? 'active' : ''}
          onClick={() => setActiveTab('questionBank')}
          disabled={creationStep > 0}
        >
          📚 Question Bank
        </button>
      </div>

      {/* ASSIGNMENTS TAB */}
      {activeTab === 'assignments' && (
        <>
          {/* Step 0: Assignment List */}
          {creationStep === 0 && (
            <div className="tab-content">
              <div className="content-header">
                <h2>My Quiz Assignments</h2>
                <button className="btn-primary" onClick={startNewAssignment}>
                  ✨ Create New Assignment
                </button>
              </div>

              {loadingAssignments ? (
                <p>Loading assignments...</p>
              ) : assignments.length === 0 ? (
                <div className="empty-state">
                  <p>No quiz assignments yet. Create your first assignment!</p>
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
                          className="btn-view"
                          onClick={() => fetchSubmissions(assignment._id)}
                        >
                          📊 View Results
                        </button>
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

          {/* Step 1: Assignment Information */}
          {creationStep === 1 && (
            <div className="tab-content">
              <div className="creation-progress">
                <div className="progress-step active">1. Assignment Info</div>
                <div className="progress-step">2. Build Quiz</div>
                <div className="progress-step">3. Finalize</div>
                <div className="progress-step">4. Deploy</div>
              </div>

              <h2>{getStepTitle()}</h2>
              <form onSubmit={handleAssignmentInfoSubmit} className="assignment-form">
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Quiz Type *</label>
                      <select 
                        value={currentAssignment.quizType}
                        onChange={(e) => setCurrentAssignment({...currentAssignment, quizType: e.target.value})}
                        required
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="timed-challenge">Timed Challenge</option>
                        <option value="memory-matching">Memory Matching</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Grade Level *</label>
                      <select 
                        value={currentAssignment.assignedGrade}
                        onChange={(e) => setCurrentAssignment({...currentAssignment, assignedGrade: e.target.value})}
                        disabled
                        required
                        className="grade-disabled"
                      >
                        <option value="">Select Grade</option>
                        <option value="4th">4th Grade</option>
                        <option value="5th">5th Grade</option>
                        <option value="6th">6th Grade</option>
                      </select>
                      <small className="field-hint">Auto-detected from your teacher profile</small>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Quiz Title *</label>
                    <input 
                      type="text"
                      value={currentAssignment.title}
                      onChange={(e) => setCurrentAssignment({...currentAssignment, title: e.target.value})}
                      placeholder="e.g., Cardiovascular System Quiz"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      value={currentAssignment.description}
                      onChange={(e) => setCurrentAssignment({...currentAssignment, description: e.target.value})}
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
                        value={currentAssignment.dueDate}
                        onChange={(e) => setCurrentAssignment({...currentAssignment, dueDate: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Max Attempts</label>
                      <input 
                        type="number"
                        value={currentAssignment.maxAttempts}
                        onChange={(e) => setCurrentAssignment({...currentAssignment, maxAttempts: parseInt(e.target.value)})}
                        min="1"
                        max="10"
                      />
                    </div>
                    <div className="form-group">
                      <label>Time Limit (seconds)</label>
                      <input 
                        type="number"
                        value={currentAssignment.timeLimit}
                        onChange={(e) => setCurrentAssignment({...currentAssignment, timeLimit: parseInt(e.target.value)})}
                        min="60"
                        step="60"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={cancelCreation}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Next: Build Quiz →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Build Quiz */}
          {creationStep === 2 && (
            <div className="tab-content">
              <div className="creation-progress">
                <div className="progress-step completed">✓ Assignment Info</div>
                <div className="progress-step active">2. Build Quiz</div>
                <div className="progress-step">3. Finalize</div>
                <div className="progress-step">4. Deploy</div>
              </div>

              <h2>{getStepTitle()}</h2>
              <p className="step-description">
                Add questions to your quiz by creating new ones or selecting from your question bank.
              </p>

              <div className="quiz-builder">
                {/* Current Quiz Questions */}
                <div className="current-quiz-section">
                  <h3>Quiz Questions ({quizQuestions.length})</h3>
                  {quizQuestions.length === 0 ? (
                    <p className="empty-message">No questions added yet. Create or select questions below.</p>
                  ) : (
                    <div className="quiz-questions-list">
                      {quizQuestions.map((q, index) => (
                        <div key={q._id} className="quiz-question-item">
                          <span className="question-number">{index + 1}.</span>
                          <span className="question-text">{q.questionText}</span>
                          <button 
                            className="btn-remove"
                            onClick={() => toggleQuestionSelection(q)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Create New Question */}
                <div className="create-question-section">
                  <h3>Create New Question</h3>
                  <form onSubmit={handleCreateQuestionInline} className="inline-question-form">
                    <div className="form-group">
                      <label>Question Text *</label>
                      <input 
                        type="text"
                        value={questionForm.questionText}
                        onChange={(e) => setQuestionForm({...questionForm, questionText: e.target.value})}
                        placeholder="Enter your question..."
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
                            <span className="correct-badge">✓</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="btn-create-question">
                      + Add Question to Quiz
                    </button>
                  </form>
                </div>

                {/* Select from Question Bank */}
                <div className="question-bank-section">
                  <h3>Select from Question Bank</h3>
                  {loadingQuestions ? (
                    <p>Loading questions...</p>
                  ) : questions.length === 0 ? (
                    <p className="empty-message">No questions in your bank yet.</p>
                  ) : (
                    <div className="bank-questions-list">
                      {questions.map(q => {
                        const isSelected = selectedQuestionIds.includes(q._id);
                        return (
                          <div 
                            key={q._id} 
                            className={`bank-question-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleQuestionSelection(q)}
                          >
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                            />
                            <div className="question-preview">
                              <span className="question-text">{q.questionText}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setCreationStep(1)}>
                  ← Back
                </button>
                <button className="btn-primary" onClick={proceedToFinalize}>
                  Next: Review & Finalize →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Finalize */}
          {creationStep === 3 && (
            <div className="tab-content">
              <div className="creation-progress">
                <div className="progress-step completed">✓ Assignment Info</div>
                <div className="progress-step completed">✓ Build Quiz</div>
                <div className="progress-step active">3. Finalize</div>
                <div className="progress-step">4. Deploy</div>
              </div>

              <h2>{getStepTitle()}</h2>
              <p className="step-description">Review your quiz assignment before deploying.</p>

              <div className="finalize-review">
                <div className="review-section">
                  <h3>Assignment Details</h3>
                  <div className="review-grid">
                    <div className="review-item">
                      <span className="review-label">Title:</span>
                      <span className="review-value">{currentAssignment.title}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Type:</span>
                      <span className="review-value">{currentAssignment.quizType}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Grade:</span>
                      <span className="review-value">Grade {currentAssignment.assignedGrade}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Max Attempts:</span>
                      <span className="review-value">{currentAssignment.maxAttempts}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Time Limit:</span>
                      <span className="review-value">{currentAssignment.timeLimit} seconds</span>
                    </div>
                    {currentAssignment.dueDate && (
                      <div className="review-item">
                        <span className="review-label">Due Date:</span>
                        <span className="review-value">
                          {new Date(currentAssignment.dueDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  {currentAssignment.description && (
                    <div className="review-description">
                      <span className="review-label">Description:</span>
                      <p>{currentAssignment.description}</p>
                    </div>
                  )}
                </div>

                <div className="review-section">
                  <h3>Quiz Questions ({quizQuestions.length})</h3>
                  <div className="review-questions">
                    {quizQuestions.map((q, index) => (
                      <div key={q._id} className="review-question">
                        <div className="review-question-header">
                          <span className="question-number">{index + 1}.</span>
                          <span className="question-text">{q.questionText}</span>
                          <span className={`difficulty-badge ${q.difficulty}`}>{q.difficulty}</span>
                        </div>
                        <div className="review-options">
                          {q.options.map((opt, i) => (
                            <div key={i} className={`review-option ${i === q.correctAnswer ? 'correct' : ''}`}>
                              {String.fromCharCode(65 + i)}. {opt}
                              {i === q.correctAnswer && <span className="correct-indicator"> ✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setCreationStep(2)}>
                  ← Back to Edit
                </button>
                <button className="btn-deploy" onClick={handleDeployAssignment}>
                  🚀 Deploy Assignment
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {creationStep === 4 && (
            <div className="tab-content">
              <div className="success-screen">
                <div className="success-icon">✅</div>
                <h2>Assignment Deployed Successfully!</h2>
                <p>Your quiz assignment has been created and is now active.</p>
                <p className="redirect-message">Redirecting to assignments list...</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* QUESTION BANK TAB */}
      {activeTab === 'questionBank' && (
        <div className="tab-content">
          <h2>Question Bank</h2>
          
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

          <div className="question-bank-content">
            {/* Create Question Form */}
            <div className="create-question-panel">
              <h3>{editingQuestion ? 'Edit Question' : 'Create New Question'}</h3>
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
                    <label>Grade Level</label>
                    <select 
                      value={questionForm.grade}
                      onChange={(e) => setQuestionForm({...questionForm, grade: e.target.value})}
                      disabled
                      className="grade-disabled"
                    >
                      <option value="">All Grades</option>
                      <option value="4th">4th Grade</option>
                      <option value="5th">5th Grade</option>
                      <option value="6th">6th Grade</option>
                    </select>
                    <small className="field-hint">Auto-detected from your teacher profile</small>
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

            {/* Question List */}
            <div className="questions-list-panel">
              <h3>All Questions</h3>
              
              <div className="filters-bar">
                <select 
                  value={filters.grade}
                  onChange={(e) => setFilters({...filters, grade: e.target.value})}
                  disabled
                  className="grade-disabled"
                >
                  <option value="">All Grades</option>
                  <option value="4th">4th Grade</option>
                  <option value="5th">5th Grade</option>
                  <option value="6th">6th Grade</option>
                </select>
              </div>

              {loadingQuestions ? (
                <p>Loading questions...</p>
              ) : questions.length === 0 ? (
                <p className="empty-message">No questions found.</p>
              ) : (
                <div className="questions-list">
                  {questions.map(question => (
                    <div key={question._id} className="question-card">
                      <div className="question-header">
                        <div className="question-meta">
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
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {viewingSubmissions && (
        <div className="modal-overlay" onClick={() => setViewingSubmissions(null)}>
          <div className="modal-content submissions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 Quiz Results: {viewingSubmissions.title}</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  className="download-csv-btn"
                  onClick={downloadCSV}
                  disabled={!submissions || submissions.length === 0}
                  style={{
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submissions && submissions.length > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: submissions && submissions.length > 0 ? 1 : 0.5,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (submissions && submissions.length > 0) {
                      e.target.style.background = '#059669';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#10b981';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  📥 Download CSV
                </button>
                <button className="modal-close" onClick={() => setViewingSubmissions(null)}>×</button>
              </div>
            </div>

            <div className="quiz-info-bar">
              <span><strong>Code:</strong> {viewingSubmissions.quizCode}</span>
              <span><strong>Type:</strong> {viewingSubmissions.quizType}</span>
              <span><strong>Grade:</strong> {viewingSubmissions.assignedGrade}</span>
            </div>

            <div className="modal-body">
              {loadingSubmissions ? (
                <div className="loading-state">Loading submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="empty-state">
                  <p>No submissions yet</p>
                  <p className="text-muted">Students haven't taken this quiz yet</p>
                </div>
              ) : (
                <div className="submissions-table-container">
                  <table className="submissions-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Time Taken</th>
                        <th>Attempt</th>
                        <th>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission, index) => (
                        <tr key={submission._id || index}>
                          <td>{index + 1}</td>
                          <td>{submission.studentName || 'Anonymous'}</td>
                          <td className="score-cell">
                            <span className="score-display">{submission.score}/{submission.answers?.length || 0}</span>
                          </td>
                          <td>
                            <div className="percentage-bar-container">
                              <div 
                                className="percentage-bar"
                                style={{
                                  width: `${submission.percentage}%`,
                                  backgroundColor: submission.percentage >= 80 ? '#22c55e' : 
                                                   submission.percentage >= 60 ? '#eab308' : 
                                                   submission.percentage >= 40 ? '#f97316' : '#ef4444'
                                }}
                              ></div>
                              <span className="percentage-text">{submission.percentage?.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td>{submission.timeTaken ? `${Math.floor(submission.timeTaken / 60)}m ${submission.timeTaken % 60}s` : 'N/A'}</td>
                          <td>
                            <span className="attempt-badge">Attempt {submission.attemptNumber || 1}</span>
                          </td>
                          <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary Stats */}
                  <div className="submissions-summary">
                    <div className="summary-card">
                      <span className="summary-label">Total Submissions</span>
                      <span className="summary-value">{submissions.length}</span>
                    </div>
                    <div className="summary-card">
                      <span className="summary-label">Unique Students</span>
                      <span className="summary-value">
                        {new Set(submissions.map(s => s.studentId?.toString())).size}
                      </span>
                    </div>
                    <div className="summary-card">
                      <span className="summary-label">Average Score</span>
                      <span className="summary-value">
                        {(submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / submissions.length).toFixed(1)}%
                      </span>
                    </div>
                    <div className="summary-card">
                      <span className="summary-label">Highest Score</span>
                      <span className="summary-value">
                        {Math.max(...submissions.map(s => s.percentage || 0)).toFixed(0)}%
                      </span>
                    </div>
                    <div className="summary-card">
                      <span className="summary-label">Lowest Score</span>
                      <span className="summary-value">
                        {Math.min(...submissions.map(s => s.percentage || 0)).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAssignmentManager;
