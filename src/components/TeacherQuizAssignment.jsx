import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const TeacherQuizAssignment = ({ userData }) => {
  const [assignments, setAssignments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quizType: 'multiple-choice',
    title: '',
    description: '',
    assignedGrade: userData?.assignedGrade || '4th',
    assignedSection: 'all',
    dueDate: '',
    maxAttempts: 3,
    timeLimit: null
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/teacher/quiz/my-assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || '' : value
    }));
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/teacher/quiz/assign-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Quiz created successfully!\n\nQuiz Code: ${data.data.quizCode}\n\nShare this code with your students.`);
        setShowCreateForm(false);
        setFormData({
          quizType: 'multiple-choice',
          title: '',
          description: '',
          assignedGrade: userData?.assignedGrade || '4th',
          assignedSection: 'all',
          dueDate: '',
          maxAttempts: 3,
          timeLimit: null
        });
        fetchAssignments();
      } else {
        alert(data.message || 'Failed to create quiz assignment');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating quiz assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (assignmentId, currentStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/teacher/quiz/toggle-active/${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchAssignments();
      }
    } catch (error) {
      console.error('Error toggling assignment:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this quiz assignment?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/teacher/quiz/delete/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchAssignments();
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Error deleting quiz assignment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">📝 Quiz Assignments</h2>
          <p className="text-gray-600 mt-1">Create and manage quiz assignments for students</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
        >
          {showCreateForm ? '✕ Cancel' : '+ Create Assignment'}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Quiz Assignment</h3>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quiz Type *
                </label>
                <select
                  name="quizType"
                  value={formData.quizType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="timed-challenge">Timed Challenge</option>
                  <option value="memory-matching">Memory Matching</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assigned Grade *
                </label>
                <select
                  name="assignedGrade"
                  value={formData.assignedGrade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={userData?.assignedGrade && userData.assignedGrade !== 'all'}
                >
                  <option value="4th">4th Grade</option>
                  <option value="5th">5th Grade</option>
                  <option value="6th">6th Grade</option>
                  {userData?.assignedGrade === 'all' && <option value="all">All Grades</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assigned Section *
                </label>
                <select
                  name="assignedSection"
                  value={formData.assignedSection}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="all">All Sections</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Heart Anatomy Quiz"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Quiz description..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Attempts *
                </label>
                <input
                  type="number"
                  name="maxAttempts"
                  value={formData.maxAttempts}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit || ''}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="No limit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? 'Creating...' : '✅ Create Assignment'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowCreateForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Assignments List */}
      <div className="grid grid-cols-1 gap-4">
        {assignments.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Quiz Assignments Yet</h3>
            <p className="text-gray-600 mb-4">Create your first quiz assignment to get started</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              + Create Assignment
            </Button>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment._id} className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      assignment.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {assignment.isActive ? '✓ Active' : '✕ Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Quiz Code</div>
                      <div className="text-lg font-mono font-bold text-purple-600">{assignment.quizCode}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Type</div>
                      <div className="font-semibold">{assignment.quizType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Grade / Section</div>
                      <div className="font-semibold">
                        {assignment.assignedGrade === 'all' ? 'All Grades' : `${assignment.assignedGrade} Grade`}
                        {' / '}
                        {assignment.assignedSection === 'all' ? 'All' : assignment.assignedSection}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Submissions</div>
                      <div className="font-semibold">{assignment.stats?.totalSubmissions || 0} ({assignment.stats?.uniqueStudents || 0} students)</div>
                    </div>
                  </div>

                  {assignment.description && (
                    <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📅 Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}</span>
                    <span>🔄 Max Attempts: {assignment.maxAttempts}</span>
                    {assignment.timeLimit && <span>⏱️ Time Limit: {assignment.timeLimit} min</span>}
                    {assignment.stats && <span>📊 Avg Score: {assignment.stats.averageScore}%</span>}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleToggleActive(assignment._id, assignment.isActive)}
                    variant="outline"
                    size="sm"
                    className={assignment.isActive ? 'border-red-500 text-red-600' : 'border-green-500 text-green-600'}
                  >
                    {assignment.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    variant="outline"
                    size="sm"
                    className="border-gray-500 text-gray-600"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherQuizAssignment;
