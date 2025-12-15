import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import QuizAssignmentManager from '../components/QuizAssignmentManager';

const sidebarItems = [
  {
    title: 'Dashboard',
    description: 'Overview of your classes',
  },
  {
    title: 'Classes',
    description: 'Manage your assigned classes',
  },
  {
    title: 'Progress Tracking',
    description: 'Track student progress and analytics',
  },
  {
    title: 'Quiz Management',
    description: 'Create and manage quiz assignments',
  },
];

const InfoCard = ({ title, value }) => (
  <div className="flex flex-col items-center justify-center bg-blue-700 text-white rounded-xl shadow-lg p-8 min-w-[220px] min-h-[160px]">
    <div className="text-5xl font-extrabold mb-4">{value}</div>
    <div className="text-xl font-semibold">{title}</div>
  </div>
);

const TeacherDashboard = ({ onLogout }) => {
  // API Configuration
  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';

  // Sidebar active state
  const [activeSidebar, setActiveSidebar] = useState('Dashboard');

  const handleSidebarClick = (title) => {
    setActiveSidebar(title);
  };

  // Teacher's assigned classes data
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classStudents, setClassStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Student Management state
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Student filters and search state
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');
  const [searchStudentName, setSearchStudentName] = useState('');
  const [studentSortBy, setStudentSortBy] = useState('name');

  // Progress tracking state
  const [progressData, setProgressData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [overallStats, setOverallStats] = useState({
    totalStudents: 0,
    averageQuizScore: 0,
    totalQuizzesTaken: 0
  });
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Dashboard stats
  const stats = [
    { title: 'Classes Assigned', value: classes.length },
    { title: 'Total Students', value: classStudents.length },
    { title: 'Pending Activation', value: classStudents.filter(s => s.status === 'Pending').length },
  ];

  // Fetch teacher's assigned classes
  const fetchTeacherClasses = async () => {
    setLoadingClasses(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/teacher/my-classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes || []);
      } else {
        console.error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Fetch students for a specific class
  const fetchClassStudents = async (classId) => {
    setLoadingStudents(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/teacher/class-students/${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClassStudents(data.students || []);
        setSelectedClass(data.classInfo || null);
      } else {
        console.error('Failed to fetch students');
        setClassStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setClassStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Load classes on mount
  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  // Navigate to student view for a specific class
  const handleViewStudents = (classId) => {
    setSelectedClassId(classId);
    fetchClassStudents(classId);
  };

  // Go back to classes list
  const handleBackToClasses = () => {
    setSelectedClassId(null);
    setSelectedClass(null);
    setClassStudents([]);
    setShowAddStudentForm(false);
    setNewStudent({ name: '', dob: '', gender: '' });
    setStudentError('');
  };

  // Remove student from class
  const handleRemoveStudent = (classId, studentId) => {
    setClasses(classes.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          students: cls.students.filter(s => s.id !== studentId),
        };
      }
      return cls;
    }));
  };

  // Toggle student status
  const handleToggleStudentStatus = (classId, studentId) => {
    setClasses(classes.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          students: cls.students.map(s =>
            s.id === studentId
              ? { ...s, status: s.status === 'Active' ? 'Disabled' : 'Active' }
              : s
          ),
        };
      }
      return cls;
    }));
  };

  // Fetch progress data for all students
  const fetchProgressData = async () => {
    setLoadingProgress(true);
    try {
      // For now, we'll use mock data since we don't have a teacher progress API
      // In a real implementation, this would call an API endpoint
      const mockProgressData = [
        {
          id: '25-0001-stud',
          name: 'Juan Dela Cruz',
          totalQuizzes: 12,
          averageScore: 85,
          lastActivity: '2025-12-10',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 75 },
            { attempt: 2, score: 80 },
            { attempt: 3, score: 82 },
            { attempt: 4, score: 85 },
            { attempt: 5, score: 87 },
            { attempt: 6, score: 88 },
            { attempt: 7, score: 90 },
            { attempt: 8, score: 92 },
            { attempt: 9, score: 85 },
            { attempt: 10, score: 87 },
            { attempt: 11, score: 89 },
            { attempt: 12, score: 91 }
          ]
        },
        {
          id: '25-0002-stud',
          name: 'Maria Santos',

          totalQuizzes: 15,
          averageScore: 92,
          lastActivity: '2025-12-12',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 85 },
            { attempt: 2, score: 87 },
            { attempt: 3, score: 89 },
            { attempt: 4, score: 91 },
            { attempt: 5, score: 93 },
            { attempt: 6, score: 90 },
            { attempt: 7, score: 92 },
            { attempt: 8, score: 94 },
            { attempt: 9, score: 95 },
            { attempt: 10, score: 93 },
            { attempt: 11, score: 91 },
            { attempt: 12, score: 94 },
            { attempt: 13, score: 96 },
            { attempt: 14, score: 92 },
            { attempt: 15, score: 95 }
          ]
        },
        {
          id: '25-0003-stud',
          name: 'Carlos Reyes',

          totalQuizzes: 8,
          averageScore: 78,
          lastActivity: '2025-12-08',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 65 },
            { attempt: 2, score: 70 },
            { attempt: 3, score: 75 },
            { attempt: 4, score: 78 },
            { attempt: 5, score: 80 },
            { attempt: 6, score: 82 },
            { attempt: 7, score: 79 },
            { attempt: 8, score: 81 }
          ]
        },
        {
          id: '25-0004-stud',
          name: 'Rosa Garcia',

          totalQuizzes: 14,
          averageScore: 88,
          lastActivity: '2025-12-11',
          grade: 'Grade 8',
          section: 'B',
          attempts: [
            { attempt: 1, score: 78 },
            { attempt: 2, score: 82 },
            { attempt: 3, score: 85 },
            { attempt: 4, score: 87 },
            { attempt: 5, score: 89 },
            { attempt: 6, score: 86 },
            { attempt: 7, score: 88 },
            { attempt: 8, score: 90 },
            { attempt: 9, score: 92 },
            { attempt: 10, score: 89 },
            { attempt: 11, score: 91 },
            { attempt: 12, score: 93 },
            { attempt: 13, score: 87 },
            { attempt: 14, score: 90 }
          ]
        },
        {
          id: '25-0005-stud',
          name: 'Miguel Torres',

          totalQuizzes: 10,
          averageScore: 82,
          lastActivity: '2025-12-09',
          grade: 'Grade 8',
          section: 'B',
          attempts: [
            { attempt: 1, score: 72 },
            { attempt: 2, score: 75 },
            { attempt: 3, score: 78 },
            { attempt: 4, score: 80 },
            { attempt: 5, score: 82 },
            { attempt: 6, score: 84 },
            { attempt: 7, score: 81 },
            { attempt: 8, score: 83 },
            { attempt: 9, score: 85 },
            { attempt: 10, score: 87 }
          ]
        },
        {
          id: '25-0006-stud',
          name: 'Ana Lopez',

          totalQuizzes: 13,
          averageScore: 89,
          lastActivity: '2025-12-13',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 80 },
            { attempt: 2, score: 83 },
            { attempt: 3, score: 85 },
            { attempt: 4, score: 87 },
            { attempt: 5, score: 89 },
            { attempt: 6, score: 91 },
            { attempt: 7, score: 88 },
            { attempt: 8, score: 90 },
            { attempt: 9, score: 92 },
            { attempt: 10, score: 89 },
            { attempt: 11, score: 91 },
            { attempt: 12, score: 93 },
            { attempt: 13, score: 90 }
          ]
        },
        {
          id: '25-0007-stud',
          name: 'Pedro Martinez',

          totalQuizzes: 11,
          averageScore: 84,
          lastActivity: '2025-12-07',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 75 },
            { attempt: 2, score: 78 },
            { attempt: 3, score: 80 },
            { attempt: 4, score: 82 },
            { attempt: 5, score: 84 },
            { attempt: 6, score: 86 },
            { attempt: 7, score: 83 },
            { attempt: 8, score: 85 },
            { attempt: 9, score: 87 },
            { attempt: 10, score: 84 },
            { attempt: 11, score: 86 }
          ]
        },
        {
          id: '25-0008-stud',
          name: 'Sofia Ramirez',

          totalQuizzes: 16,
          averageScore: 94,
          lastActivity: '2025-12-14',
          grade: 'Grade 8',
          section: 'B',
          attempts: [
            { attempt: 1, score: 88 },
            { attempt: 2, score: 90 },
            { attempt: 3, score: 92 },
            { attempt: 4, score: 94 },
            { attempt: 5, score: 96 },
            { attempt: 6, score: 93 },
            { attempt: 7, score: 95 },
            { attempt: 8, score: 97 },
            { attempt: 9, score: 98 },
            { attempt: 10, score: 95 },
            { attempt: 11, score: 93 },
            { attempt: 12, score: 96 },
            { attempt: 13, score: 98 },
            { attempt: 14, score: 94 },
            { attempt: 15, score: 97 },
            { attempt: 16, score: 99 }
          ]
        },
        {
          id: '25-0009-stud',
          name: 'Diego Fernandez',

          totalQuizzes: 9,
          averageScore: 76,
          lastActivity: '2025-12-06',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 68 },
            { attempt: 2, score: 71 },
            { attempt: 3, score: 74 },
            { attempt: 4, score: 76 },
            { attempt: 5, score: 78 },
            { attempt: 6, score: 75 },
            { attempt: 7, score: 77 },
            { attempt: 8, score: 79 },
            { attempt: 9, score: 81 }
          ]
        },
        {
          id: '25-0010-stud',
          name: 'Isabella Gonzalez',

          totalQuizzes: 17,
          averageScore: 96,
          lastActivity: '2025-12-13',
          grade: 'Grade 8',
          section: 'B',
          attempts: [
            { attempt: 1, score: 88 },
            { attempt: 2, score: 91 },
            { attempt: 3, score: 93 },
            { attempt: 4, score: 95 },
            { attempt: 5, score: 97 },
            { attempt: 6, score: 94 },
            { attempt: 7, score: 96 },
            { attempt: 8, score: 98 },
            { attempt: 9, score: 99 },
            { attempt: 10, score: 96 },
            { attempt: 11, score: 94 },
            { attempt: 12, score: 97 },
            { attempt: 13, score: 99 },
            { attempt: 14, score: 95 },
            { attempt: 15, score: 98 },
            { attempt: 16, score: 100 },
            { attempt: 17, score: 97 }
          ]
        },
        {
          id: '25-0011-stud',
          name: 'Lucas Morales',

          totalQuizzes: 12,
          averageScore: 83,
          lastActivity: '2025-12-11',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 75 },
            { attempt: 2, score: 78 },
            { attempt: 3, score: 80 },
            { attempt: 4, score: 82 },
            { attempt: 5, score: 84 },
            { attempt: 6, score: 81 },
            { attempt: 7, score: 83 },
            { attempt: 8, score: 85 },
            { attempt: 9, score: 87 },
            { attempt: 10, score: 84 },
            { attempt: 11, score: 86 },
            { attempt: 12, score: 88 }
          ]
        },
        {
          id: '25-0012-stud',
          name: 'Valentina Ruiz',

          totalQuizzes: 14,
          averageScore: 87,
          lastActivity: '2025-12-10',
          grade: 'Grade 8',
          section: 'B',
          attempts: [
            { attempt: 1, score: 78 },
            { attempt: 2, score: 81 },
            { attempt: 3, score: 83 },
            { attempt: 4, score: 85 },
            { attempt: 5, score: 87 },
            { attempt: 6, score: 89 },
            { attempt: 7, score: 86 },
            { attempt: 8, score: 88 },
            { attempt: 9, score: 90 },
            { attempt: 10, score: 87 },
            { attempt: 11, score: 89 },
            { attempt: 12, score: 91 },
            { attempt: 13, score: 85 },
            { attempt: 14, score: 88 }
          ]
        },
        {
          id: '25-0013-stud',
          name: 'Mateo Jimenez',

          totalQuizzes: 10,
          averageScore: 81,
          lastActivity: '2025-12-08',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 72 },
            { attempt: 2, score: 75 },
            { attempt: 3, score: 77 },
            { attempt: 4, score: 79 },
            { attempt: 5, score: 81 },
            { attempt: 6, score: 83 },
            { attempt: 7, score: 80 },
            { attempt: 8, score: 82 },
            { attempt: 9, score: 84 },
            { attempt: 10, score: 86 }
          ]
        },
        {
          id: '25-0014-stud',
          name: 'Camila Silva',

          totalQuizzes: 15,
          averageScore: 91,
          lastActivity: '2025-12-12',
          grade: 'Grade 8',
          section: 'B',
          attempts: [
            { attempt: 1, score: 83 },
            { attempt: 2, score: 86 },
            { attempt: 3, score: 88 },
            { attempt: 4, score: 90 },
            { attempt: 5, score: 92 },
            { attempt: 6, score: 89 },
            { attempt: 7, score: 91 },
            { attempt: 8, score: 93 },
            { attempt: 9, score: 95 },
            { attempt: 10, score: 92 },
            { attempt: 11, score: 90 },
            { attempt: 12, score: 93 },
            { attempt: 13, score: 95 },
            { attempt: 14, score: 91 },
            { attempt: 15, score: 94 }
          ]
        },
        {
          id: '25-0015-stud',
          name: 'Sebastian Castro',

          totalQuizzes: 13,
          averageScore: 85,
          lastActivity: '2025-12-09',
          grade: 'Grade 7',
          section: 'A',
          attempts: [
            { attempt: 1, score: 76 },
            { attempt: 2, score: 79 },
            { attempt: 3, score: 81 },
            { attempt: 4, score: 83 },
            { attempt: 5, score: 85 },
            { attempt: 6, score: 87 },
            { attempt: 7, score: 84 },
            { attempt: 8, score: 86 },
            { attempt: 9, score: 88 },
            { attempt: 10, score: 85 },
            { attempt: 11, score: 87 },
            { attempt: 12, score: 89 },
            { attempt: 13, score: 86 }
          ]
        },
        {
          id: '25-0016-stud',
          name: 'Luna Vargas',

          totalQuizzes: 14,
          averageScore: 88,
          lastActivity: '2025-12-11',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0017-stud',
          name: 'Leonardo Mendoza',

          totalQuizzes: 8,
          averageScore: 74,
          lastActivity: '2025-12-05',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0018-stud',
          name: 'Emma Delgado',

          totalQuizzes: 16,
          averageScore: 93,
          lastActivity: '2025-12-14',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0019-stud',
          name: 'Gabriel Ortiz',

          totalQuizzes: 11,
          averageScore: 82,
          lastActivity: '2025-12-07',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0020-stud',
          name: 'Victoria Herrera',

          totalQuizzes: 13,
          averageScore: 86,
          lastActivity: '2025-12-10',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0021-stud',
          name: 'Daniel Aguilar',

          totalQuizzes: 9,
          averageScore: 77,
          lastActivity: '2025-12-06',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0022-stud',
          name: 'Natalia Medina',

          totalQuizzes: 15,
          averageScore: 90,
          lastActivity: '2025-12-12',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0023-stud',
          name: 'Alexander Chavez',

          totalQuizzes: 12,
          averageScore: 84,
          lastActivity: '2025-12-08',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0024-stud',
          name: 'Mia Flores',

          totalQuizzes: 14,
          averageScore: 89,
          lastActivity: '2025-12-11',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0025-stud',
          name: 'Adrian Guerrero',

          totalQuizzes: 10,
          averageScore: 80,
          lastActivity: '2025-12-07',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0026-stud',
          name: 'Zoe Sanchez',

          totalQuizzes: 17,
          averageScore: 95,
          lastActivity: '2025-12-13',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0027-stud',
          name: 'Ethan Rivera',

          totalQuizzes: 11,
          averageScore: 83,
          lastActivity: '2025-12-09',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0028-stud',
          name: 'Samantha Torres',

          totalQuizzes: 13,
          averageScore: 87,
          lastActivity: '2025-12-10',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0029-stud',
          name: 'Noah Castillo',

          totalQuizzes: 9,
          averageScore: 75,
          lastActivity: '2025-12-05',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0030-stud',
          name: 'Ava Morales',

          totalQuizzes: 16,
          averageScore: 92,
          lastActivity: '2025-12-12',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0031-stud',
          name: 'Liam Reyes',

          totalQuizzes: 12,
          averageScore: 85,
          lastActivity: '2025-12-08',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0032-stud',
          name: 'Isabella Diaz',

          totalQuizzes: 14,
          averageScore: 88,
          lastActivity: '2025-12-11',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0033-stud',
          name: 'Mason Alvarez',

          totalQuizzes: 10,
          averageScore: 81,
          lastActivity: '2025-12-06',
          grade: 'Grade 7',
          section: 'A'
        },
        {
          id: '25-0034-stud',
          name: 'Harper Gomez',

          totalQuizzes: 15,
          averageScore: 90,
          lastActivity: '2025-12-13',
          grade: 'Grade 8',
          section: 'B'
        },
        {
          id: '25-0035-stud',
          name: 'Elijah Vasquez',

          totalQuizzes: 11,
          averageScore: 84,
          lastActivity: '2025-12-09',
          grade: 'Grade 7',
          section: 'A'
        }
      ];

      setProgressData(mockProgressData);

      // Calculate overall stats
      const totalStudents = mockProgressData.length;
      const averageQuizScore = Math.round(mockProgressData.reduce((sum, student) => sum + student.averageScore, 0) / totalStudents);
      const totalQuizzesTaken = mockProgressData.reduce((sum, student) => sum + student.totalQuizzes, 0);

      setOverallStats({
        totalStudents,
        averageQuizScore,
        totalQuizzesTaken
      });

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  // Load progress data when Progress Tracking is selected
  useEffect(() => {
    if (activeSidebar === 'Progress Tracking') {
      fetchProgressData();
    }
  }, [activeSidebar]);

  const showClassesView = activeSidebar === 'Classes';
  const showProgressView = activeSidebar === 'Progress Tracking';
  const showQuizView = activeSidebar === 'Quiz Management';

  return (
    <div className="flex min-h-screen" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-6 px-4 min-h-screen">
        <div className="text-2xl font-bold mb-8">Teacher Portal</div>
        <nav className="flex-1">
          <ul>
            {/* Dashboard */}
            <li className="mb-4">
              <button
                className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${activeSidebar === 'Dashboard' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                onClick={() => handleSidebarClick('Dashboard')}
              >
                Dashboard
              </button>
            </li>
            <hr className="border-white mb-4" />
            {/* Classes */}
            <li className="mb-4">
              <button
                className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${activeSidebar === 'Classes' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                onClick={() => handleSidebarClick('Classes')}
              >
                Classes
              </button>
            </li>
            <hr className="border-white mb-4 mt-0" />
            {/* Progress Tracking */}
            <li className="mb-4">
              <button
                className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${activeSidebar === 'Progress Tracking' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                onClick={() => handleSidebarClick('Progress Tracking')}
              >
                Progress Tracking
              </button>
            </li>
            <hr className="border-white mb-4 mt-0" />
            {/* Quiz Management */}
            <li className="mb-4">
              <button
                className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${activeSidebar === 'Quiz Management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                onClick={() => handleSidebarClick('Quiz Management')}
              >
                Quiz Management
              </button>
            </li>
            <hr className="border-white mb-4 mt-0" />
            {/* Logout */}
            <li className="mb-4">
              <button
                className="w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors bg-red-600 hover:bg-red-700 text-white"
                onClick={onLogout}
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white/80 min-h-screen">
        {showProgressView ? (
          // Progress Tracking View
          <div>
            <h1 className="text-3xl font-bold mb-6">Progress Tracking & Analytics</h1>

            {loadingProgress ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Overall Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="text-3xl font-bold mb-2">{overallStats.totalStudents}</div>
                    <div className="text-sm opacity-90">Total Students</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="text-3xl font-bold mb-2">{overallStats.averageQuizScore}%</div>
                    <div className="text-sm opacity-90">Avg Quiz Score</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                    <div className="text-3xl font-bold mb-2">{overallStats.totalQuizzesTaken}</div>
                    <div className="text-sm opacity-90">Total Quizzes Taken</div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-8 mb-8">
                  {/* Student Progress Over Attempts Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        {selectedStudent ? `${selectedStudent.name} - Progress Over Attempts` : 'Student Progress Over Attempts'}
                      </h3>
                      {selectedStudent && (
                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>
                    {selectedStudent ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={selectedStudent.attempts}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="attempt" label={{ value: 'Attempt #', position: 'insideBottom', offset: -5 }} />
                          <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                          <Tooltip
                            formatter={(value, name) => [`${value}%`, 'Score']}
                            labelFormatter={(label) => `Attempt ${label}`}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📈</div>
                          <p className="text-lg">Click on a student in the table below to view their progress over attempts</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Student Progress Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Individual Student Progress</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quizzes</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {progressData.map((student) => (
                          <tr
                            key={student.id}
                            className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                              selectedStudent?.id === student.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{student.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade} - {student.section}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.totalQuizzes}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                student.averageScore >= 90 ? 'bg-green-100 text-green-800' :
                                student.averageScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {student.averageScore}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastActivity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Download Progress Button */}
                <div className="mt-6 text-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors">
                    📊 Download Progress Report
                  </button>
                </div>
              </>
            )}
          </div>
        ) : showClassesView ? (
          selectedClassId ? (
            // Student Management View
            <div>
              {!selectedClass && loadingStudents ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading students...</p>
                </div>
              ) : selectedClass ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <button
                          onClick={handleBackToClasses}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-2"
                        >
                          ← Back to Classes
                        </button>
                        <h1 className="text-3xl font-bold">
                          {selectedClass.grade} - Section {selectedClass.section} ({selectedClass.className || 'Class'})
                        </h1>
                        <p className="text-gray-600 mt-1">Manage students in this class</p>
                      </div>
                    </div>



                    {/* Student Filters */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div>
                        <label className="mr-2 font-medium">Status:</label>
                        <select
                          value={studentStatusFilter}
                          onChange={(e) => setStudentStatusFilter(e.target.value)}
                          className="border px-2 py-1 rounded text-black"
                        >
                          <option value="All">All</option>
                          <option value="Pending">Pending</option>
                          <option value="Active">Active</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>
                      <div>
                        <label className="mr-2 font-medium">Search Name:</label>
                        <input
                          type="text"
                          value={searchStudentName}
                          onChange={(e) => setSearchStudentName(e.target.value)}
                          placeholder="Enter student name"
                          className="border px-2 py-1 rounded text-black"
                        />
                      </div>
                      <div>
                        <label className="mr-2 font-medium">Sort By:</label>
                        <select
                          value={studentSortBy}
                          onChange={(e) => setStudentSortBy(e.target.value)}
                          className="border px-2 py-1 rounded text-black"
                        >
                          <option value="name">Name</option>
                          <option value="id">ID</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                    </div>

                    {/* Students Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded shadow border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 border-b text-left">Student ID</th>
                            <th className="px-4 py-2 border-b text-left">Student Name</th>
                            <th className="px-4 py-2 border-b text-left">Date of Birth</th>
                            <th className="px-4 py-2 border-b text-left">Gender</th>
                            <th className="px-4 py-2 border-b text-left">Status</th>
                            <th className="px-4 py-2 border-b text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingStudents ? (
                            <tr>
                              <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                Loading students...
                              </td>
                            </tr>
                          ) : (() => {
                            const filteredStudents = classStudents
                              .filter(s =>
                                (studentStatusFilter === 'All' || s.status === studentStatusFilter) &&
                                s.fullName.toLowerCase().includes(searchStudentName.toLowerCase())
                              )
                              .sort((a, b) => {
                                if (studentSortBy === 'name') return a.fullName.localeCompare(b.fullName);
                                if (studentSortBy === 'id') return a.studentId.localeCompare(b.studentId);
                                if (studentSortBy === 'status') return a.status.localeCompare(b.status);
                                return 0;
                              });
                            return (
                              <>
                                {filteredStudents.length === 0 ? (
                                  <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                      No students found in this class.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredStudents.map((student) => (
                            <tr key={student._id}>
                              <td className="px-4 py-2 border-b font-mono text-sm">{student.studentId}</td>
                              <td className="px-4 py-2 border-b">{student.fullName}</td>
                              <td className="px-4 py-2 border-b">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                              <td className="px-4 py-2 border-b">{student.gender || 'N/A'}</td>
                              <td className="px-4 py-2 border-b font-semibold">
                                <span className={`px-2 py-1 rounded text-white text-xs ${
                                  student.status === 'Active' ? 'bg-green-600' :
                                  student.status === 'Pending' ? 'bg-yellow-600' :
                                  'bg-red-600'
                                }`}>
                                  {student.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 border-b flex gap-2">
                                <button
                                  className="bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700 opacity-50 cursor-not-allowed"
                                  disabled
                                  title="Status management coming soon"
                                >
                                  {student.status === 'Active' ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 opacity-50 cursor-not-allowed"
                                  disabled
                                  title="Student removal coming soon"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                                  ))
                                )}
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </>
              ) : null}
            </div>
          ) : (
            // Classes List View
            <div>
              <h1 className="text-3xl font-bold mb-6">My Classes</h1>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b text-left">Grade/Year</th>
                      <th className="px-4 py-2 border-b text-left">Section</th>
                      <th className="px-4 py-2 border-b text-left">Subject</th>
                      <th className="px-4 py-2 border-b text-left">Number of Students</th>
                      <th className="px-4 py-2 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingClasses ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          Loading classes...
                        </td>
                      </tr>
                    ) : classes.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No classes assigned to you yet.
                        </td>
                      </tr>
                    ) : (
                      classes.map((cls) => (
                        <tr key={cls._id}>
                          <td className="px-4 py-2 border-b">{cls.grade}</td>
                          <td className="px-4 py-2 border-b">{cls.section}</td>
                          <td className="px-4 py-2 border-b">{cls.className || 'N/A'}</td>
                          <td className="px-4 py-2 border-b">-</td>
                          <td className="px-4 py-2 border-b flex gap-2">
                            <button
                              className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 text-xs"
                              onClick={() => handleViewStudents(cls._id)}
                            >
                              View Students
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : showQuizView ? (
          <QuizAssignmentManager />
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-10">Teacher Dashboard</h1>
            {loadingClasses ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading your classes...</p>
              </div>
            ) : (
              <>
                <div className="flex gap-12 justify-center mb-12">
                  {stats.map((stat) => (
                    <InfoCard key={stat.title} {...stat} />
                  ))}
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
                  <p className="text-gray-700 mb-2">You have <strong>{classes.length}</strong> classes assigned to you.</p>
                  <p className="text-gray-700 mb-2">View your classes from the "Classes" menu to see assigned students.</p>
                </div>
              </>
            )}
          </div>
        )}
      </main>

    </div>
  );
};

export default TeacherDashboard;
