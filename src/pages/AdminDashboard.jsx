import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import QuizAssignmentManager from '../components/QuizAssignmentManager';
import { useToast } from '../contexts/ToastContext';

const AdminDashboard = ({ userData, onLogout }) => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [currentView, setCurrentView] = useState('classes'); // 'classes' or 'class-details'
  const [selectedClassData, setSelectedClassData] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [classFormData, setClassFormData] = useState({
    fullName: '',
    email: '',
    assignedGrade: '4th',
    section: 'A'
  });
  const [createClassLoading, setCreateClassLoading] = useState(false);
  const [createClassError, setCreateClassError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [quizAnalytics, setQuizAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    performanceLevel: '',
    activityLevel: '',
    grade: '',
    section: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentQuizDetails, setStudentQuizDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [activeTab, setActiveTab] = useState('classes'); // classes, analytics, quiz-management
  const [questionPage, setQuestionPage] = useState(1);
  const questionsPerPage = 10;
  
  // Registration URL Modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationModalData, setRegistrationModalData] = useState({
    teacherName: '',
    registrationUrl: '',
    emailSent: false
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';

  // Auto-populate grade filter for teachers on mount
  useEffect(() => {
    if (userData?.role === 'teacher' && userData?.assignedGrade) {
      setFilters(prev => ({ ...prev, grade: userData.assignedGrade }));
    }
  }, [userData]);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchAnalytics();
    fetchQuizAnalytics();
  }, [filters, currentPage]);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success && data.data && Array.isArray(data.data.classes)) {
        setClasses(data.data.classes);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    }
  };

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

  const viewClassDetails = async (classData) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch students for this specific class (grade + section)
      const response = await fetch(`${API_URL}/api/admin/students?grade=${classData.assignedGrade}&section=${classData.section}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedClassData(classData);
        setClassStudents(data.data.students || []);
        setCurrentView('class-details');
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error('Error loading class details');
    }
  };

  const deleteClass = async (classId) => {
    if (!confirm('Are you sure you want to delete this class? This will remove the teacher assignment.')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/classes/${classId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Class deleted successfully');
        fetchClasses();
      } else {
        toast.error(data.message || 'Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Error deleting class');
    }
  };

  const handleClassFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'assignedGrade') {
      // Auto-select first available section when grade changes
      const sections = ['A', 'B', 'C'];
      const occupied = classes.filter(c => c.assignedGrade === value).map(c => c.section);
      const availableSection = sections.find(sec => !occupied.includes(sec));
      
      setClassFormData(prev => ({
        ...prev,
        assignedGrade: value,
        section: availableSection || prev.section
      }));
    } else {
      setClassFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const isCombinationAvailable = (grade, section) => {
    return !classes.some(c => c.assignedGrade === grade && c.section === section);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setCreateClassLoading(true);
    setCreateClassError(null);

    // Check if combination is available
    if (!isCombinationAvailable(classFormData.assignedGrade, classFormData.section)) {
      setCreateClassError(`${classFormData.assignedGrade} Grade Section ${classFormData.section} already has a teacher assigned`);
      setCreateClassLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/create-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(classFormData)
      });

      const data = await response.json();

      if (data.success) {
        if (data.emailSent) {
          toast.success('✅ Class created! Invitation email sent to teacher.');
        } else {
          toast.warning('⚠️ Class created but email failed to send!', { duration: 5000 });
        }
        
        // Always show registration URL
        if (data.registrationUrl) {
          // Copy to clipboard
          navigator.clipboard.writeText(data.registrationUrl);
          
          // Show modal with registration URL
          setRegistrationModalData({
            teacherName: classFormData.fullName,
            registrationUrl: data.registrationUrl,
            emailSent: data.emailSent
          });
          setShowRegistrationModal(true);
        }
        
        setShowCreateClassModal(false);
        setClassFormData({ fullName: '', email: '', assignedGrade: '4th', section: 'A' });
        fetchClasses();
      } else {
        setCreateClassError(data.message || 'Failed to create class');
      }
    } catch (error) {
      setCreateClassError('Error creating class');
      console.error('Error creating class:', error);
    } finally {
      setCreateClassLoading(false);
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
      {/* Class Details View */}
      {currentView === 'class-details' && selectedClassData ? (
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => {
              setCurrentView('classes');
              setSelectedClassData(null);
              setClassStudents([]);
            }}
            variant="outline"
            className="mb-6"
          >
            ← Back to Classes
          </Button>

          {/* Class Header */}
          <Card className="p-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {selectedClassData.assignedGrade} Grade - Section {selectedClassData.section}
            </h1>
            
            {/* Teacher Info */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-purple-800">👨‍🏫 Class Teacher</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="text-lg font-semibold">{selectedClassData.fullName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Username</div>
                  <div className="text-lg font-semibold">@{selectedClassData.username}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-lg font-semibold">{selectedClassData.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Teacher Code</div>
                  <div className="text-lg font-semibold font-mono">{selectedClassData.teacherCode}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Students List */}
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">👥 Students ({classStudents.length})</h3>
            {classStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No students enrolled in this class yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left p-3 font-semibold text-gray-700">Student</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Age</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Quizzes Taken</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Avg Score</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((student) => {
                      const avgScore = student.quizResults.length > 0 
                        ? Math.round(student.quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / student.quizResults.length)
                        : 0;
                      
                      return (
                        <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-gray-900">{student.fullName}</div>
                              <div className="text-sm text-gray-500">@{student.username}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-gray-700">{student.age}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-blue-600">{student.stats.totalQuizzesTaken}</span>
                          </td>
                          <td className="p-3">
                            {student.quizResults.length > 0 ? (
                              <span className={`text-xl font-bold ${avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {avgScore}%
                              </span>
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
            )}
          </Card>
        </div>
      ) : (
        <>
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
            onClick={() => setActiveTab('classes')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'classes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏫 Classes
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

            <select
              name="section"
              value={filters.section || ''}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>

            <Button
              onClick={() => {
                setFilters({ search: '', performanceLevel: '', activityLevel: '', grade: '', section: '' });
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

      {/* Classes Table */}
      {activeTab === 'classes' && (
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              {userData?.role === 'teacher' ? '👨‍🎓 My Students' : '🏫 My Classes'}
            </h3>
            {userData?.role === 'superuser' && (
              <Button
                onClick={() => setShowCreateClassModal(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                ➕ Add Class
              </Button>
            )}
          </div>
          
          {/* Show Students for Teachers */}
          {userData?.role === 'teacher' ? (
            students.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No students found</p>
                <p className="text-sm mt-2">Students from your assigned grade ({userData.assignedGrade}) will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Student Name</th>
                      <th className="px-6 py-4 text-left font-bold">Grade</th>
                      <th className="px-6 py-4 text-left font-bold">Section</th>
                      <th className="px-6 py-4 text-left font-bold">Total Quizzes</th>
                      <th className="px-6 py-4 text-left font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr 
                        key={student._id} 
                        className={`border-b hover:bg-purple-50 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                              {student.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{student.fullName}</div>
                              <div className="text-sm text-gray-500">@{student.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{student.grade}</td>
                        <td className="px-6 py-4 text-gray-700">{student.section || '-'}</td>
                        <td className="px-6 py-4 text-gray-700">{student.stats.totalQuizzesTaken || 0}</td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={() => viewStudentDetails(student._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                          >
                            📊 View Progress
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Show Classes for Superuser */
            classes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No classes found</p>
              <p className="text-sm mt-2">Classes will appear here once assigned</p>
            </div>
          ) : (
            <div className="space-y-4">
              {classes.map((classItem) => (
                <div
                  key={classItem._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl">
                      {classItem.assignedGrade.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        {classItem.assignedGrade} Grade - Section {classItem.section}
                        {classItem.accountStatus === 'pending' ? (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-300">
                            ⏳ Pending Registration
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300">
                            ✓ Active
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Teacher: {classItem.fullName}</div>
                      {classItem.username && (
                        <div className="text-xs text-gray-500">@{classItem.username}</div>
                      )}
                      {classItem.email && (
                        <div className="text-xs text-blue-600 mt-1">
                          📧 {classItem.email}
                        </div>
                      )}
                      {classItem.accountStatus === 'pending' && (
                        <div className="text-xs text-yellow-600 mt-1 font-medium">
                          Waiting for teacher to complete registration
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {classItem.accountStatus === 'active' && (
                      <Button
                        onClick={() => viewClassDetails(classItem)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        👁️ View Class
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteClass(classItem._id)}
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                      🗑 Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
          )}
        </Card>
      </div>
      )}

      {/* Create Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setShowCreateClassModal(false)}>
          <Card className="max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">➕ Add New Class</h2>
            <p className="text-gray-600 mb-6">The teacher will receive an invitation email to complete their registration.</p>
            
            {createClassError && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{createClassError}</p>
              </div>
            )}

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teacher Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={classFormData.fullName}
                    onChange={handleClassFormChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={classFormData.email}
                    onChange={handleClassFormChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                    placeholder="teacher@school.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assigned Grade
                  </label>
                  <select
                    name="assignedGrade"
                    value={classFormData.assignedGrade}
                    onChange={handleClassFormChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                    required
                  >
                    <option value="4th">4th Grade</option>
                    <option value="5th">5th Grade</option>
                    <option value="6th">6th Grade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Section
                  </label>
                  <select
                    name="section"
                    value={classFormData.section}
                    onChange={handleClassFormChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                    required
                  >
                    <option value="A" disabled={!isCombinationAvailable(classFormData.assignedGrade, 'A')}>
                      Section A {!isCombinationAvailable(classFormData.assignedGrade, 'A') && '(Occupied)'}
                    </option>
                    <option value="B" disabled={!isCombinationAvailable(classFormData.assignedGrade, 'B')}>
                      Section B {!isCombinationAvailable(classFormData.assignedGrade, 'B') && '(Occupied)'}
                    </option>
                    <option value="C" disabled={!isCombinationAvailable(classFormData.assignedGrade, 'C')}>
                      Section C {!isCombinationAvailable(classFormData.assignedGrade, 'C') && '(Occupied)'}
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="submit"
                  disabled={createClassLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {createClassLoading ? 'Creating Class...' : 'Add Class'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowCreateClassModal(false);
                    setCreateClassError(null);
                    setClassFormData({ fullName: '', email: '', username: '', password: '', assignedGrade: '4th', section: 'A' });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelectedStudent(null)}>
          <Card className="max-w-6xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Student Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">📊 {selectedStudent.fullName}'s Progress</h2>
              <div className="flex gap-6 text-sm text-gray-600">
                <span>@{selectedStudent.username}</span>
                <span>•</span>
                <span>{selectedStudent.grade} Grade</span>
                <span>•</span>
                <span>Age {selectedStudent.age}</span>
                <span>•</span>
                <span>Joined {new Date(selectedStudent.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{selectedStudent.stats.totalQuizzesTaken || 0}</div>
                <div className="text-sm text-gray-600">Total Quizzes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600">
                  {(() => {
                    // Calculate average from quizResults if stats.averageScore is 0
                    if (selectedStudent.stats.averageScore && selectedStudent.stats.averageScore > 0) {
                      return selectedStudent.stats.averageScore;
                    }
                    if (studentQuizDetails?.quizResults?.length > 0) {
                      const avg = studentQuizDetails.quizResults.reduce((sum, q) => {
                        const pct = (q.percentage && q.percentage > 0) ? q.percentage : 
                          (q.score !== undefined && q.totalQuestions ? Math.round((q.score / q.totalQuestions) * 100) : 0);
                        return sum + pct;
                      }, 0) / studentQuizDetails.quizResults.length;
                      return Math.round(avg);
                    }
                    return 0;
                  })()}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="text-3xl font-bold text-purple-600">
                  {(() => {
                    // Calculate high score from quizResults if stats.highScore looks like raw score
                    if (studentQuizDetails?.quizResults?.length > 0) {
                      const maxPct = Math.max(...studentQuizDetails.quizResults.map(q => {
                        return (q.percentage && q.percentage > 0) ? q.percentage : 
                          (q.score !== undefined && q.totalQuestions ? Math.round((q.score / q.totalQuestions) * 100) : 0);
                      }));
                      return maxPct;
                    }
                    return selectedStudent.stats.highScore || 0;
                  })()}%
                </div>
                <div className="text-sm text-gray-600">High Score</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600">{studentQuizDetails?.badges?.length || 0}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
            </div>

            {/* Performance Chart */}
            {studentQuizDetails && studentQuizDetails.quizResults && studentQuizDetails.quizResults.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📈 Quiz Performance Over Time
                </h3>
                <div className="border-2 border-blue-100 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={(() => {
                      // Sort quiz results by completedAt or use original order
                      const sortedResults = [...studentQuizDetails.quizResults].sort((a, b) => {
                        const dateA = a.completedAt || a.timestamp;
                        const dateB = b.completedAt || b.timestamp;
                        if (dateA && dateB) {
                          return new Date(dateA) - new Date(dateB);
                        }
                        return 0;
                      });
                      
                      return sortedResults.map((result, index) => {
                        // Calculate percentage properly - use stored percentage or calculate from score/totalQuestions
                        let scoreValue = 0;
                        if (result.percentage && result.percentage > 0) {
                          scoreValue = result.percentage;
                        } else if (result.score !== undefined && result.totalQuestions) {
                          scoreValue = Math.round((result.score / result.totalQuestions) * 100);
                        }
                        const resultDate = result.completedAt || result.timestamp;
                        return {
                          attempt: index + 1,
                          score: scoreValue,
                          scoreDisplay: scoreValue,
                          attemptLabel: `Attempt ${index + 1}`,
                          type: result.quizType || 'Quiz',
                          fullDate: resultDate ? new Date(resultDate).toLocaleString() : 'Unknown'
                        };
                      });
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="attemptLabel" 
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                        stroke="#6b7280"
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5 }}
                        name="Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-3 text-sm text-gray-600 text-center">
                    Showing progress across {studentQuizDetails.quizResults.length} quiz attempts
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-8 bg-gray-50 rounded-lg text-center text-gray-500">
                <p className="text-lg">No quiz data available yet</p>
                <p className="text-sm mt-2">Student needs to take quizzes to see performance trends</p>
              </div>
            )}

            {/* Badges */}
            {studentQuizDetails && studentQuizDetails.badges && studentQuizDetails.badges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  🏆 Badges Earned
                </h3>
                <div className="flex flex-wrap gap-2">
                  {studentQuizDetails.badges.map((badge, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg text-sm font-bold shadow-md">
                      {typeof badge === 'string' ? badge : badge.name || badge.badgeId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Quiz Results Table */}
            {studentQuizDetails && studentQuizDetails.quizResults && studentQuizDetails.quizResults.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">📝 Recent Quiz Results</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden border">
                    <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold">#</th>
                        <th className="px-4 py-3 text-left text-sm font-bold">Quiz Type</th>
                        <th className="px-4 py-3 text-left text-sm font-bold">Score</th>
                        <th className="px-4 py-3 text-left text-sm font-bold">Time Taken</th>
                        <th className="px-4 py-3 text-left text-sm font-bold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sort chronologically (oldest first) to match chart, then show most recent 10 */}
                      {[...studentQuizDetails.quizResults]
                        .sort((a, b) => {
                          const dateA = new Date(a.completedAt || a.timestamp || 0);
                          const dateB = new Date(b.completedAt || b.timestamp || 0);
                          return dateA - dateB;
                        })
                        .map((result, index, arr) => (
                        <tr key={index} className={`border-b hover:bg-purple-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-600">#{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium">{result.quizType || 'Unknown'}</td>
                          <td className="px-4 py-3">
                            {(() => {
                              const pct = (result.percentage && result.percentage > 0) 
                                ? result.percentage 
                                : (result.score !== undefined && result.totalQuestions 
                                    ? Math.round((result.score / result.totalQuestions) * 100) 
                                    : 0);
                              return (
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  pct >= 80 ? 'bg-green-100 text-green-700' :
                                  pct >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {pct}%
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {result.timeTaken ? `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s` : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {(result.completedAt || result.timestamp) ? new Date(result.completedAt || result.timestamp).toLocaleDateString() : 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                setSelectedStudent(null);
                setStudentQuizDetails(null);
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
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

      {/* Registration URL Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                ✅ Class Created Successfully!
              </h3>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Email Status */}
              <div className={`p-4 rounded-lg ${registrationModalData.emailSent ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`font-semibold ${registrationModalData.emailSent ? 'text-green-800' : 'text-yellow-800'}`}>
                  {registrationModalData.emailSent ? '✅ Email Sent Successfully!' : '⚠️ Email Failed - Please Share Manually'}
                </p>
                <p className={`text-sm mt-1 ${registrationModalData.emailSent ? 'text-green-600' : 'text-yellow-600'}`}>
                  {registrationModalData.emailSent 
                    ? `An invitation email has been sent to ${registrationModalData.teacherName}.`
                    : 'The email could not be sent. Please share the registration link manually.'}
                </p>
              </div>

              {/* Teacher Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Teacher Name:</p>
                <p className="font-semibold text-gray-800">{registrationModalData.teacherName}</p>
              </div>

              {/* Registration URL */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-2">Registration Link:</p>
                <div className="bg-white p-3 rounded border border-blue-300 break-all text-sm font-mono text-gray-700">
                  {registrationModalData.registrationUrl}
                </div>
                <p className="text-xs text-blue-600 mt-2">✓ Link copied to clipboard</p>
              </div>

              {/* Instructions */}
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <p className="font-semibold text-purple-800 mb-2">📋 Next Steps:</p>
                <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
                  {registrationModalData.emailSent ? (
                    <>
                      <li>The teacher will receive the registration link via email</li>
                      <li>They can click the link to complete registration</li>
                      <li>Backup: Share the link above if they don't receive the email</li>
                    </>
                  ) : (
                    <>
                      <li>Share the registration link above with {registrationModalData.teacherName}</li>
                      <li>The teacher will use this link to create their account</li>
                      <li>Link is valid for 7 days</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(registrationModalData.registrationUrl);
                  toast.success('Link copied to clipboard!');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                📋 Copy Link
              </Button>
              <Button
                onClick={() => setShowRegistrationModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default AdminDashboard;
