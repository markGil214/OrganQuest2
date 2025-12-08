import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import QuizAssignmentManager from '../components/QuizAssignmentManager';
import { useToast } from '../contexts/ToastContext';

const AdminDashboard = ({ userData, onLogout }) => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [quizAnalytics, setQuizAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    performanceLevel: '',
    activityLevel: '',
    grade: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentQuizDetails, setStudentQuizDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [activeTab, setActiveTab] = useState('students'); // students, analytics, quiz-management
  const [questionPage, setQuestionPage] = useState(1);
  const questionsPerPage = 10;

  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';

  // Auto-populate grade filter for teachers on mount
  useEffect(() => {
    if (userData?.role === 'teacher' && userData?.assignedGrade) {
      setFilters(prev => ({ ...prev, grade: userData.assignedGrade }));
    }
  }, [userData]);

  useEffect(() => {
    fetchStudents();
    fetchAnalytics();
    fetchQuizAnalytics();
  }, [filters, currentPage]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`${API_URL}/api/admin/students?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStudents(data.data.students);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchQuizAnalytics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/quiz-analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Quiz Analytics Response:', data);
      
      if (data.success && data.data) {
        // Keep quizTypeStats as the original object structure from backend
        const transformed = {
          ...data.data,
          performanceTrends: data.data.performanceTrends || {},
          quizTypeStats: data.data.quizTypeStats || {}, // Keep as object, don't transform to array
          questionDifficulty: data.data.questionDifficulty?.hardestQuestions || [],
          attemptStats: {
            studentsWithLockedQuizzes: data.data.attemptStats?.lockedStudents || 0
          },
          badgeStats: {
            mostEarned: data.data.badgeStats && data.data.badgeStats.length > 0 
              ? data.data.badgeStats[0].name 
              : 'None',
            leastEarned: data.data.badgeStats && data.data.badgeStats.length > 0 
              ? data.data.badgeStats[data.data.badgeStats.length - 1].name 
              : 'None'
          }
        };
        console.log('Transformed Quiz Analytics:', transformed);
        console.log('Quiz Type Stats:', transformed.quizTypeStats);
        setQuizAnalytics(transformed);
      } else {
        console.error('Failed to fetch analytics:', data.message);
        // Set empty state to stop loading
        setQuizAnalytics({
          quizTypeStats: {},
          performanceTrends: {},
          questionDifficulty: [],
          attemptStats: { studentsWithLockedQuizzes: 0 },
          badgeStats: { mostEarned: 'None', leastEarned: 'None' }
        });
      }
    } catch (error) {
      console.error('Error fetching quiz analytics:', error);
      // Set empty state to stop loading
      setQuizAnalytics({
        quizTypeStats: {},
        performanceTrends: {},
        questionDifficulty: [],
        attemptStats: { studentsWithLockedQuizzes: 0 },
        badgeStats: { mostEarned: 'None', leastEarned: 'None' }
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const viewStudentDetails = async (studentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const [studentResponse, quizResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/students/${studentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/admin/students/${studentId}/quiz-details`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const studentData = await studentResponse.json();
      const quizData = await quizResponse.json();
      
      console.log('Student Data:', studentData);
      console.log('Quiz Details Data:', quizData);
      
      if (studentData.success) {
        setSelectedStudent(studentData.data.student);
      }
      if (quizData.success) {
        setStudentQuizDetails(quizData.data);
        console.log('Quiz attempts:', quizData.data.quizAttempts);
      } else {
        console.error('Failed to fetch quiz details:', quizData.message);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const resetQuizAttempts = async (studentId, quizType = 'all') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/students/${studentId}/reset-quiz-attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quizType })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        // Refresh student details
        viewStudentDetails(studentId);
        fetchStudents(); // Refresh list
      } else {
        toast.error(data.message || 'Failed to reset attempts');
      }
    } catch (error) {
      console.error('Error resetting quiz attempts:', error);
      toast.error('Error resetting quiz attempts');
    }
  };

  if (loading && !students.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome, {userData?.fullName} 
              {userData?.role === 'superuser' && ' (Superuser)'}
              {userData?.role === 'teacher' && ` - ${userData.assignedGrade} Grade`}
            </p>
          </div>
          <div className="flex gap-3">
            {userData?.role === 'superuser' && (
              <Button
                onClick={() => window.location.hash = '#admin/manage'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                👥 Manage Admins
              </Button>
            )}
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 bg-white rounded-lg p-2 shadow-md">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'students'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👥 Students
          </button>
          <button
            onClick={() => {
              setActiveTab('analytics');
              if (!quizAnalytics) fetchQuizAnalytics();
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📈 Quiz Analytics
          </button>
          {userData?.role !== 'superuser' && (
            <button
              onClick={() => setActiveTab('quiz-management')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'quiz-management'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎯 Quiz Management
            </button>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      {activeTab === 'students' && analytics && (
        <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold">{analytics.totalStudents}</div>
            <div className="text-sm opacity-90">Total Students</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold">{analytics.activeStudents}</div>
            <div className="text-sm opacity-90">Active Students</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-3xl font-bold">{analytics.totalQuizzes}</div>
            <div className="text-sm opacity-90">Total Quizzes Taken</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-3xl font-bold">{analytics.overallAverageScore}%</div>
            <div className="text-sm opacity-90">Average Score</div>
          </Card>
        </div>
      )}

      {/* Quiz Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <div className="max-w-7xl mx-auto">
          {!quizAnalytics ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading analytics...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quiz Performance Graphs */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">📈 Quiz Performance Over Time</h3>
                {!quizAnalytics.performanceTrends || Object.values(quizAnalytics.performanceTrends).every(arr => arr.length === 0) ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No performance data available yet</p>
                    <p className="text-sm mt-2">Students need to take quizzes to see performance trends</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Multiple Choice Graph */}
                    {quizAnalytics.performanceTrends['multiple-choice']?.length > 0 && (
                      <div className="border-2 border-blue-100 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          Multiple Choice Quiz Performance
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={quizAnalytics.performanceTrends['multiple-choice']}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              stroke="#6b7280"
                            />
                            <YAxis 
                              domain={[0, 100]} 
                              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                              stroke="#6b7280"
                            />
                            <Tooltip 
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                              formatter={(value, name) => [
                                name === 'avgScore' ? `${value}%` : `${value}s`,
                                name === 'avgScore' ? 'Avg Score' : 'Avg Time'
                              ]}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="avgScore" 
                              stroke="#3b82f6" 
                              strokeWidth={3}
                              dot={{ fill: '#3b82f6', r: 4 }}
                              name="Average Score"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-3 text-sm text-gray-600 flex justify-between items-center px-2">
                          <span>📊 Total Attempts: {quizAnalytics.quizTypeStats['multiple-choice']?.total || 0}</span>
                          <span>⭐ Overall Avg: {quizAnalytics.quizTypeStats['multiple-choice']?.avgScore || 0}%</span>
                        </div>
                      </div>
                    )}

                    {/* Memory Matching Graph */}
                    {quizAnalytics.performanceTrends['memory-matching']?.length > 0 && (
                      <div className="border-2 border-purple-100 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                          Memory Matching Quiz Performance
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={quizAnalytics.performanceTrends['memory-matching']}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              stroke="#6b7280"
                            />
                            <YAxis 
                              domain={[0, 100]} 
                              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                              stroke="#6b7280"
                            />
                            <Tooltip 
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                              formatter={(value, name) => [
                                name === 'avgScore' ? `${value}%` : `${value}s`,
                                name === 'avgScore' ? 'Avg Score' : 'Avg Time'
                              ]}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="avgScore" 
                              stroke="#a855f7" 
                              strokeWidth={3}
                              dot={{ fill: '#a855f7', r: 4 }}
                              name="Average Score"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-3 text-sm text-gray-600 flex justify-between items-center px-2">
                          <span>📊 Total Attempts: {quizAnalytics.quizTypeStats['memory-matching']?.total || 0}</span>
                          <span>⭐ Overall Avg: {quizAnalytics.quizTypeStats['memory-matching']?.avgScore || 0}%</span>
                        </div>
                      </div>
                    )}

                    {/* Timed Challenge Graph */}
                    {quizAnalytics.performanceTrends['timed-challenge']?.length > 0 && (
                      <div className="border-2 border-green-100 rounded-lg p-4 bg-gradient-to-br from-green-50 to-white">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          Timed Challenge Quiz Performance
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={quizAnalytics.performanceTrends['timed-challenge']}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              stroke="#6b7280"
                            />
                            <YAxis 
                              domain={[0, 100]} 
                              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                              stroke="#6b7280"
                            />
                            <Tooltip 
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                              formatter={(value, name) => [
                                name === 'avgScore' ? `${value}%` : `${value}s`,
                                name === 'avgScore' ? 'Avg Score' : 'Avg Time'
                              ]}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="avgScore" 
                              stroke="#22c55e" 
                              strokeWidth={3}
                              dot={{ fill: '#22c55e', r: 4 }}
                              name="Average Score"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-3 text-sm text-gray-600 flex justify-between items-center px-2">
                          <span>📊 Total Attempts: {quizAnalytics.quizTypeStats['timed-challenge']?.total || 0}</span>
                          <span>⭐ Overall Avg: {quizAnalytics.quizTypeStats['timed-challenge']?.avgScore || 0}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Question Difficulty Analysis */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">🎯 Question Difficulty Analysis</h3>
                  <div className="text-sm text-gray-600">
                    Sorted by lowest success rate (min. 3 attempts)
                  </div>
                </div>
                {!quizAnalytics.questionDifficulty || quizAnalytics.questionDifficulty.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No question data available yet</p>
                    <p className="text-sm mt-2">Question difficulty analysis will appear after students complete quizzes</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left p-3 font-semibold text-gray-700">#</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Question</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Success Rate</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Attempts</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Difficulty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizAnalytics.questionDifficulty
                            .slice((questionPage - 1) * questionsPerPage, questionPage * questionsPerPage)
                            .map((q, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="p-3 text-gray-500 font-medium">
                              {(questionPage - 1) * questionsPerPage + index + 1}
                            </td>
                            <td className="p-3 max-w-md">{q.question}</td>
                            <td className="p-3">
                              <span className={`font-semibold ${
                                q.successRate >= 70 ? 'text-green-600' :
                                q.successRate >= 40 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {q.successRate}%
                              </span>
                            </td>
                            <td className="p-3">{q.totalAttempts}</td>
                            <td className="p-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                q.successRate >= 70 ? 'bg-green-100 text-green-700' :
                                q.successRate >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {q.successRate >= 70 ? 'Easy' : q.successRate >= 40 ? 'Medium' : 'Hard'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    {quizAnalytics.questionDifficulty && quizAnalytics.questionDifficulty.length > questionsPerPage && (
                      <div className="flex justify-center gap-2 mt-6">
                        <Button
                          onClick={() => setQuestionPage(p => Math.max(1, p - 1))}
                          disabled={questionPage === 1}
                          variant="outline"
                          size="sm"
                        >
                          Previous
                        </Button>
                        <span className="px-4 py-2 text-gray-700">
                          Page {questionPage} of {Math.ceil(quizAnalytics.questionDifficulty.length / questionsPerPage)}
                        </span>
                        <Button
                          onClick={() => setQuestionPage(p => Math.min(Math.ceil(quizAnalytics.questionDifficulty.length / questionsPerPage), p + 1))}
                          disabled={questionPage === Math.ceil(quizAnalytics.questionDifficulty.length / questionsPerPage)}
                          variant="outline"
                          size="sm"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Learning Progress Overview */}
      {activeTab === 'students' && analytics && (
        <div className="max-w-7xl mx-auto mb-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Learning Progress Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Quiz Completion Rate */}
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-100">
                <div className="text-3xl font-bold text-blue-600">
                  {analytics.quizCompletionRate || 0}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Quiz Completion</div>
                <div className="text-xs text-gray-500 mt-1">Average across all students</div>
              </div>
              
              {/* Average Improvement */}
              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-100">
                <div className="text-3xl font-bold text-green-600">
                  {analytics.averageImprovement >= 0 ? '+' : ''}{analytics.averageImprovement || 0}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Avg Improvement</div>
                <div className="text-xs text-gray-500 mt-1">First vs last attempt</div>
              </div>
              
              {/* Active Learners */}
              <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-100">
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.activeLearners || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Active This Week</div>
                <div className="text-xs text-gray-500 mt-1">Students with activity</div>
              </div>
              
              {/* At-Risk Students */}
              <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-100">
                <div className="text-3xl font-bold text-red-600">
                  {analytics.atRiskStudents || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Need Attention</div>
                <div className="text-xs text-gray-500 mt-1">Low scores or inactive</div>
              </div>
            </div>
            
            {/* Topic Mastery Distribution */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">📚 Topic Mastery Levels</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Mastered (&gt;80%)</span>
                    <span className="text-lg font-bold text-green-600">{analytics.masteredTopics || 0}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Students excelling</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Learning (50-80%)</span>
                    <span className="text-lg font-bold text-yellow-600">{analytics.learningTopics || 0}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Making progress</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Struggling (&lt;50%)</span>
                    <span className="text-lg font-bold text-orange-600">{analytics.strugglingTopics || 0}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Need support</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      {activeTab === 'students' && (
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name or username..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
            />

            <select
              name="grade"
              value={filters.grade || ''}
              onChange={handleFilterChange}
              disabled={userData?.role === 'teacher'}
              className={`px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none ${
                userData?.role === 'teacher' ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''
              }`}
            >
              <option value="">All Grades</option>
              <option value="4th">4th Grade</option>
              <option value="5th">5th Grade</option>
              <option value="6th">6th Grade</option>
            </select>

            <Button
              onClick={() => {
                setFilters({ search: '', performanceLevel: '', activityLevel: '', grade: '' });
                setCurrentPage(1);
              }}
              variant="outline"
              className="border-gray-300"
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>
      )}

      {/* Students Table */}
      {activeTab === 'students' && (
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Student Learning Progress</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700">Student</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Grade Level</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Quiz Progress</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Avg Score</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const avgScore = student.quizResults.length > 0 
                    ? Math.round(student.quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / student.quizResults.length)
                    : 0;
                  
                  const improvement = student.quizResults.length >= 2
                    ? Math.round((student.quizResults[student.quizResults.length - 1].score / student.quizResults[student.quizResults.length - 1].totalQuestions * 100) - (student.quizResults[0].score / student.quizResults[0].totalQuestions * 100))
                    : 0;
                  
                  const lastActive = student.stats?.lastActive ? new Date(student.stats.lastActive) : null;
                  const daysInactive = lastActive ? Math.floor((Date.now() - lastActive) / (1000 * 60 * 60 * 24)) : 999;
                  const isActive = daysInactive <= 7;
                  const isAtRisk = avgScore < 40 || daysInactive > 14;
                  
                  return (
                  <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900">{student.fullName}</div>
                        <div className="text-sm text-gray-500">@{student.username}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {student.grade === '4th' ? '4th Grade' : student.grade === '5th' ? '5th Grade' : student.grade === '6th' ? '6th Grade' : student.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min((student.stats.totalQuizzesTaken / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{student.stats.totalQuizzesTaken}/10</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Quizzes completed</div>
                    </td>
                    <td className="p-3">
                      {student.quizResults.length > 0 ? (
                        <div>
                          <span className={`text-2xl font-bold ${avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {avgScore}%
                          </span>
                          <div className="text-xs text-gray-500">{student.quizResults.length} attempts</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No data</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        onClick={() => viewStudentDetails(student._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        📊 Details
                      </Button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelectedStudent(null)}>
          <Card className="max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{selectedStudent.fullName}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-600">Username</div>
                <div className="text-lg font-semibold">{selectedStudent.username}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Age</div>
                <div className="text-lg font-semibold">{selectedStudent.age}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Grade</div>
                <div className="text-lg font-semibold">{selectedStudent.grade}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Registered</div>
                <div className="text-lg font-semibold">
                  {new Date(selectedStudent.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedStudent.stats.totalQuizzesTaken}</div>
                  <div className="text-sm text-gray-600">Quizzes Taken</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedStudent.stats.highScore}</div>
                  <div className="text-sm text-gray-600">High Score</div>
                </div>
              </div>
            </div>

            {/* Quiz Attempt Status */}
            {studentQuizDetails && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold">Quiz Attempt Status</h3>
                  <Button
                    onClick={() => {
                      if (confirm('Reset ALL quiz attempts for this student?')) {
                        resetQuizAttempts(selectedStudent._id, 'all');
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm"
                  >
                    Reset All Attempts
                  </Button>
                </div>
                <div className="space-y-2">
                  {studentQuizDetails.quizAttempts.map((attempt) => (
                    <div key={attempt.quizType} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold">{attempt.quizType}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {attempt.attemptCount}/{attempt.maxAttempts} attempts
                        </span>
                        {attempt.isLocked && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          if (confirm(`Reset ${attempt.quizType} attempts?`)) {
                            resetQuizAttempts(selectedStudent._id, attempt.quizType);
                          }
                        }}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        disabled={!attempt.isLocked && attempt.attemptCount === 0}
                      >
                        Reset
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {studentQuizDetails && studentQuizDetails.badges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Badges Earned</h3>
                <div className="flex flex-wrap gap-2">
                  {studentQuizDetails.badges.map((badge, index) => (
                    <span key={index} className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
                      {typeof badge === 'string' ? badge : badge.name || badge.badgeId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz History */}
            {studentQuizDetails && studentQuizDetails.quizResults.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Recent Quiz Results</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {studentQuizDetails.quizResults.slice(0, 10).map((result, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold">{result.quizType}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          Attempt {result.attemptNumber}
                        </span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className={`font-bold ${
                          (result.percentage || 0) >= 80 ? 'text-green-600' :
                          (result.percentage || 0) >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {(result.percentage || 0).toFixed(0)}%
                        </span>
                        <span className="text-sm text-gray-600">
                          {result.timeTaken ? `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">First Day Activity</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Quizzes on First Day:</span>
                  <span className="font-bold text-blue-600">{selectedStudent.firstDayProgress.quizzesTaken}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setSelectedStudent(null);
                setStudentQuizDetails(null);
              }}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              Close
            </Button>
          </Card>
        </div>
      )}

      {/* Quiz Management Tab Content */}
      {activeTab === 'quiz-management' && (
        <div className="max-w-7xl mx-auto">
          <QuizAssignmentManager userData={userData} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
