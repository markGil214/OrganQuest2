import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const AdminDashboard = ({ userData, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [quizAnalytics, setQuizAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    age: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentQuizDetails, setStudentQuizDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [activeTab, setActiveTab] = useState('students'); // students, analytics

  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';

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
      if (data.success) {
        // Transform the data to match UI expectations
        const transformed = {
          ...data.data,
          quizTypeStats: Object.entries(data.data.quizTypeStats || {}).map(([type, stats]) => ({
            type: type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            totalAttempts: stats.total || 0,
            avgScore: stats.avgScore || 0,
            avgTime: stats.avgTime || 0
          })),
          questionDifficulty: data.data.questionDifficulty?.hardestQuestions || [],
          attemptStats: {
            studentsWithLockedQuizzes: data.data.attemptStats?.lockedStudents || 0
          },
          badgeStats: {
            mostEarned: data.data.badgeStats?.[0]?.name || 'None',
            leastEarned: data.data.badgeStats?.[data.data.badgeStats.length - 1]?.name || 'None'
          }
        };
        setQuizAnalytics(transformed);
      } else {
        console.error('Failed to fetch analytics:', data.message);
        // Set empty state to stop loading
        setQuizAnalytics({
          quizTypeStats: [],
          questionDifficulty: [],
          attemptStats: { studentsWithLockedQuizzes: 0 },
          badgeStats: { mostEarned: 'None', leastEarned: 'None' }
        });
      }
    } catch (error) {
      console.error('Error fetching quiz analytics:', error);
      // Set empty state to stop loading
      setQuizAnalytics({
        quizTypeStats: [],
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
      
      if (studentData.success) {
        setSelectedStudent(studentData.data.student);
      }
      if (quizData.success) {
        setStudentQuizDetails(quizData.data);
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
        alert(data.message);
        // Refresh student details
        viewStudentDetails(studentId);
        fetchStudents(); // Refresh list
      } else {
        alert(data.message || 'Failed to reset attempts');
      }
    } catch (error) {
      console.error('Error resetting quiz attempts:', error);
      alert('Error resetting quiz attempts');
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
              {userData?.role === 'admin' && ` - ${userData.assignedGrade} Grade`}
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
              {/* Quiz Type Performance */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 Quiz Type Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quizAnalytics.quizTypeStats.map((stat) => (
                    <div key={stat.type} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                      <div className="font-semibold text-lg text-gray-800 mb-2">{stat.type}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Attempts:</span>
                          <span className="font-semibold">{stat.totalAttempts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Score:</span>
                          <span className="font-semibold text-green-600">{stat.avgScore.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Time:</span>
                          <span className="font-semibold">{stat.avgTime.toFixed(0)}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Question Difficulty Analysis */}
              <Card className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Hardest Questions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold text-gray-700">Question</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Success Rate</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Attempts</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizAnalytics.questionDifficulty.slice(0, 10).map((q, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-3 max-w-md truncate">{q.question}</td>
                          <td className="p-3">
                            <span className={`font-semibold ${
                              q.successRate >= 70 ? 'text-green-600' :
                              q.successRate >= 40 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {q.successRate.toFixed(1)}%
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
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attempt Statistics */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🔒 Attempt Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700">Students with Locked Quizzes:</span>
                      <span className="text-2xl font-bold text-red-600">
                        {quizAnalytics.attemptStats.studentsWithLockedQuizzes}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Badge Distribution */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Badge Distribution</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Most Earned:</span>
                        <span className="font-semibold">{quizAnalytics.badgeStats.mostEarned}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Least Earned:</span>
                        <span className="font-semibold">{quizAnalytics.badgeStats.leastEarned}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grade Distribution */}
      {activeTab === 'students' && analytics && (
        <div className="max-w-7xl mx-auto mb-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Grade Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.gradeDistribution['4th']}</div>
                <div className="text-sm text-gray-600">4th Grade</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analytics.gradeDistribution['5th']}</div>
                <div className="text-sm text-gray-600">5th Grade</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">{analytics.gradeDistribution['6th']}</div>
                <div className="text-sm text-gray-600">6th Grade</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      {activeTab === 'students' && (
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              value={filters.grade}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
            >
              <option value="">All Grades</option>
              <option value="4th">4th Grade</option>
              <option value="5th">5th Grade</option>
              <option value="6th">6th Grade</option>
            </select>

            <input
              type="number"
              name="age"
              placeholder="Filter by age..."
              value={filters.age}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
              min="1"
              max="120"
            />

            <Button
              onClick={() => {
                setFilters({ search: '', grade: '', age: '' });
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
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Students</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Full Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Username</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Age</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Grade</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Quizzes</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Avg Score</th>
                  <th className="text-left p-3 font-semibold text-gray-700">1st Day</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">{student.fullName}</td>
                    <td className="p-3 text-gray-600">{student.username}</td>
                    <td className="p-3">{student.age}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {student.grade}
                      </span>
                    </td>
                    <td className="p-3">{student.stats.totalQuizzesTaken}</td>
                    <td className="p-3">
                      {student.quizResults.length > 0 ? (
                        <span className="font-semibold text-green-600">
                          {Math.round(
                            student.quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / 
                            student.quizResults.length
                          )}%
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-3">
                      {student.firstDayProgress.hasActivity ? (
                        <span className="text-green-600 font-semibold">
                          ✓ Active
                        </span>
                      ) : (
                        <span className="text-gray-400">No activity</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        onClick={() => viewStudentDetails(student._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
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
                      {badge}
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
                          result.percentage >= 80 ? 'text-green-600' :
                          result.percentage >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {result.percentage.toFixed(0)}%
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
    </div>
  );
};

export default AdminDashboard;
