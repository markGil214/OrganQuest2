import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const QuizMaker = ({ userData }) => {
  const [questions, setQuestions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: 'general',
    difficulty: 'medium',
    grade: userData?.assignedGrade || '4th'
  });

  const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://organquest2.onrender.com');

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/teacher/questions/my-questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/teacher/questions/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all options are filled
    if (formData.options.some(opt => !opt.trim())) {
      alert('Please fill in all 4 answer options');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const url = editingQuestion 
        ? `${API_URL}/api/teacher/questions/${editingQuestion._id}`
        : `${API_URL}/api/teacher/questions/create`;
      
      const response = await fetch(url, {
        method: editingQuestion ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Question ${editingQuestion ? 'updated' : 'created'} successfully!`);
        setShowCreateForm(false);
        setEditingQuestion(null);
        resetForm();
        fetchQuestions();
        fetchStats();
      } else {
        alert(data.message || 'Failed to save question');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      category: question.category,
      difficulty: question.difficulty,
      grade: question.grade
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/teacher/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchQuestions();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error deleting question');
    }
  };

  const handleToggleActive = async (questionId, currentStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/teacher/questions/toggle-active/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error toggling question:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      category: 'general',
      difficulty: 'medium',
      grade: userData?.assignedGrade || '4th'
    });
  };

  const categoryOptions = [
    { value: 'heart', label: '❤️ Heart', icon: '❤️' },
    { value: 'brain', label: '🧠 Brain', icon: '🧠' },
    { value: 'lungs', label: '🫁 Lungs', icon: '🫁' },
    { value: 'liver', label: '🫘 Liver', icon: '🫘' },
    { value: 'kidney', label: '🫘 Kidney', icon: '🫘' },
    { value: 'digestive', label: '🍔 Digestive', icon: '🍔' },
    { value: 'general', label: '📚 General', icon: '📚' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">🧩 Quiz Maker</h2>
          <p className="text-gray-600 mt-1">Create and manage custom quiz questions</p>
          
          {stats && (
            <div className="flex gap-4 mt-3">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                📝 {stats.totalQuestions} Questions
              </span>
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                ✓ {stats.activeQuestions} Active
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingQuestion(null);
            resetForm();
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        >
          {showCreateForm ? '✕ Cancel' : '+ Create Question'}
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingQuestion ? '✏️ Edit Question' : '➕ Create New Question'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question Text *
              </label>
              <textarea
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                placeholder="What is the primary function of the heart?"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.options.map((option, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Option {String.fromCharCode(65 + index)} * 
                    {formData.correctAnswer === index && (
                      <span className="ml-2 text-green-600">✓ Correct Answer</span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <Button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                      className={formData.correctAnswer === index 
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
                    >
                      {formData.correctAnswer === index ? '✓' : '○'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleInputChange}
                placeholder="Explain why this is the correct answer..."
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Grade *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={userData?.assignedGrade && userData.assignedGrade !== 'all'}
                >
                  <option value="4th">4th Grade</option>
                  <option value="5th">5th Grade</option>
                  <option value="6th">6th Grade</option>
                  {userData?.assignedGrade === 'all' && <option value="all">All Grades</option>}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Saving...' : editingQuestion ? '💾 Update Question' : '✅ Create Question'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingQuestion(null);
                  resetForm();
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Questions List */}
      <div className="grid grid-cols-1 gap-4">
        {questions.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Questions Yet</h3>
            <p className="text-gray-600 mb-4">Create your first quiz question to get started</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              + Create Question
            </Button>
          </Card>
        ) : (
          questions.map((question, index) => {
            const categoryInfo = categoryOptions.find(c => c.value === question.category);
            return (
              <Card key={question._id} className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <h3 className="text-lg font-semibold text-gray-800">{question.questionText}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        question.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {question.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded-lg text-sm ${
                            question.correctAnswer === optIndex
                              ? 'bg-green-50 border-2 border-green-500 font-semibold text-green-700'
                              : 'bg-gray-50 border border-gray-200 text-gray-700'
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                          {option}
                          {question.correctAnswer === optIndex && <span className="ml-2">✓</span>}
                        </div>
                      ))}
                    </div>

                    {question.explanation && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <span className="text-sm font-semibold text-blue-700">💡 Explanation:</span>
                        <p className="text-sm text-gray-700 mt-1">{question.explanation}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                        {categoryInfo?.icon} {categoryInfo?.label.split(' ')[1]}
                      </span>
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-semibold">
                        {question.grade === 'all' ? 'All Grades' : `${question.grade} Grade`}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        Used {question.usageCount} times
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(question)}
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleActive(question._id, question.isActive)}
                      variant="outline"
                      size="sm"
                      className={question.isActive ? 'border-red-500 text-red-600' : 'border-green-500 text-green-600'}
                    >
                      {question.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      onClick={() => handleDelete(question._id)}
                      variant="outline"
                      size="sm"
                      className="border-gray-500 text-gray-600 hover:bg-gray-50"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QuizMaker;
