import React, { useState, useEffect } from 'react';

const sidebarItems = [
  {
    title: 'Dashboard',
    description: 'Overview of the system',
  },
  {
    title: 'User Management',
    description: 'Manage teachers',
    subItems: [
      { title: 'Teacher Management' },
    ],
  },
  {
    title: 'Class & Section Management',
    description: 'Organize academic structure',
  },
];

const InfoCard = ({ title, value }) => (
  <div className="flex flex-col items-center justify-center bg-blue-700 text-white rounded-xl shadow-lg p-8 min-w-[220px] min-h-[160px]">
    <div className="text-5xl font-extrabold mb-4">{value}</div>
    <div className="text-xl font-semibold">{title}</div>
  </div>
);

const RecentActivity = ({ title, items }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <div className="font-semibold mb-2">{title}</div>
    <ul className="text-sm text-gray-700 list-disc ml-5">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);

const AdminDashboard = ({ onLogout }) => {
  // Teacher Management filters and sort state
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchNameID, setSearchNameID] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [sortBy, setSortBy] = useState('id');
  
  // API Configuration
  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';
  
  // Dummy data for demonstration
  const stats = [
    { title: 'Students', value: 1200 },
    { title: 'Teachers', value: 45 },
    { title: 'Classes', value: 36 },
  ];

  // Sidebar active state
  const [activeSidebar, setActiveSidebar] = useState('Dashboard');
  const [activeSubSidebar, setActiveSubSidebar] = useState(null);

  const handleSidebarClick = (title) => {
    setActiveSidebar(title);
    setActiveSubSidebar(null);
    // Clear class data when switching away from class management
    if (title !== 'Class & Section Management') {
      setClasses([]);
      setClassError('');
      setClassSuccess('');
    }
  };
  const handleSubSidebarClick = (parentTitle, subTitle) => {
    setActiveSidebar(parentTitle);
    setActiveSubSidebar(subTitle);
  };

  // Teacher Management State
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    fullName: '',
    email: '',
    phone: '',
    teacherId: '',
  });
  const [teacherError, setTeacherError] = useState('');
  const [teacherSuccess, setTeacherSuccess] = useState('');

  // Class Management State
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({
    grade: '4th',
    section: 'A',
    className: '',
    description: '',
    capacity: 30,
    assignedTeacher: ''
  });
  const [classError, setClassError] = useState('');
  const [classSuccess, setClassSuccess] = useState('');
  const [classStats, setClassStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    gradeBreakdown: []
  });

  // Check authentication on component mount
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
      console.error('No user data found, redirecting to login');
      window.location.hash = 'login';
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin' && user.role !== 'superuser') {
        console.error('User is not an admin or superuser, redirecting to login');
        window.location.hash = 'login';
        return;
      }
    } catch (error) {
      console.error('Invalid user data, redirecting to login');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.hash = 'login';
      return;
    }
  }, []);

  // Fetch teachers from API
  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/admin/teachers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }

      const data = await response.json();
      if (data.success && data.data && data.data.teachers) {
        setTeachers(data.data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  // Load teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch teachers for dropdown
  const fetchTeachersForDropdown = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/admin/teachers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.teachers) {
          setTeachers(data.data.teachers);
        }
      }
    } catch (error) {
      console.error('Error fetching teachers for dropdown:', error);
    }
  };

  const handleTeacherInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'teacherId' ? value.toUpperCase() : value;
    setNewTeacher({ ...newTeacher, [name]: updatedValue });
    setTeacherError('');
    setTeacherSuccess('');
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newTeacher.fullName || !newTeacher.email) {
      setTeacherError('Full name and email are required.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/admin/send-teacher-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          fullName: newTeacher.fullName,
          email: newTeacher.email,
          phone: newTeacher.phone,
          ...(newTeacher.teacherId && { teacherId: newTeacher.teacherId.toUpperCase() })
        })
      });

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();
      
      console.log('Teacher invitation response:', data);

      if (data.success) {
        setTeacherSuccess('Teacher invitation sent successfully!');
        setNewTeacher({ fullName: '', email: '', phone: '', teacherId: '' });
        setShowAddModal(false);
        // Refresh teachers list
        fetchTeachers();
      } else {
        console.error('Failed to send invitation:', data);
        setTeacherError(data.message || data.errors?.[0]?.msg || 'Failed to send teacher invitation');
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      setTeacherError('Failed to send teacher invitation. Please try again.');
    }
  };

  // Status-based actions
  const handleResendActivation = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/admin/teachers/${id}/resend-activation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setTeacherSuccess('Activation email resent successfully!');
        setTimeout(() => setTeacherSuccess(''), 3000);
      } else {
        setTeacherError(data.message || 'Failed to resend activation email');
      }
    } catch (error) {
      console.error('Error resending activation:', error);
      setTeacherError('Error resending activation email');
    }
  };

  const handleDisableAccount = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/admin/teachers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ accountStatus: 'disabled' })
      });

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setTeacherSuccess('Teacher account disabled successfully!');
        await fetchTeachers();
        setTimeout(() => setTeacherSuccess(''), 3000);
      } else {
        setTeacherError(data.message || 'Failed to disable account');
      }
    } catch (error) {
      console.error('Error disabling account:', error);
      setTeacherError('Error disabling account');
    }
  };

  const handleEnableAccount = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/admin/teachers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ accountStatus: 'active' })
      });

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setTeacherSuccess('Teacher account enabled successfully!');
        await fetchTeachers();
        setTimeout(() => setTeacherSuccess(''), 3000);
      } else {
        setTeacherError(data.message || 'Failed to enable account');
      }
    } catch (error) {
      console.error('Error enabling account:', error);
      setTeacherError('Error enabling account');
    }
  };

  const handleActivate = (id) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'pending' : 'active' } : t));
  };

  const handleSendActivation = (id) => {
    // Simulate sending activation email
    alert('Activation email sent!');
  };

  const showTeacherManagement = activeSidebar === 'User Management' && activeSubSidebar === 'Teacher Management';
  const showClassSectionManagement = activeSidebar === 'Class & Section Management';

  // Class Management Functions
  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const token = localStorage.getItem('authToken');

      console.log('Fetching classes from:', `${API_URL}/api/admin/classes`);
      const response = await fetch(`${API_URL}/api/admin/classes`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();
      console.log('Classes fetch response:', data);

      if (data.success) {
        console.log('Classes received:', data.data.classes.length, 'classes');
        if (data.data.classes.length > 0) {
          console.log('First class sample:', data.data.classes[0]);
        }
        setClasses(data.data.classes);
      } else {
        console.error('Failed to fetch classes:', data);
        setClasses([]); // Clear classes list on error
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]); // Clear classes list on error
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchClassStats = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/api/admin/classes/stats`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClassStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching class stats:', error);
    }
  };

  const handleClassInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({ ...prev, [name]: value }));
    setClassError('');
    setClassSuccess('');
  };

  const handleAddClass = async (e) => {
    e.preventDefault();

    if (!newClass.className.trim()) {
      setClassError('Class name is required');
      return;
    }

    if (!newClass.assignedTeacher) {
      setClassError('Teacher assignment is required');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/api/admin/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(newClass)
      });

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();

      if (data.success) {
        setClassSuccess('Class created successfully!');
        setNewClass({
          grade: '4th',
          section: 'A',
          className: '',
          description: '',
          capacity: 30,
          assignedTeacher: ''
        });
        setShowAddClassModal(false);
        fetchClasses();
        fetchClassStats();
      } else {
        console.error('Failed to create class:', data);
        setClassError(data.message || 'Failed to create class');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      setClassError('Failed to create class. Please try again.');
    }
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setNewClass({
      grade: classItem.grade,
      section: classItem.section,
      className: classItem.className,
      description: classItem.description || '',
      capacity: classItem.capacity,
      assignedTeacher: classItem.assignedTeacher?._id || ''
    });
    setShowAddClassModal(true);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();

    if (!newClass.className.trim()) {
      setClassError('Class name is required');
      return;
    }

    if (!newClass.assignedTeacher) {
      setClassError('Teacher assignment is required');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/api/admin/classes/${editingClass._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(newClass)
      });

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();

      if (data.success) {
        setClassSuccess('Class updated successfully!');
        setNewClass({
          grade: '4th',
          section: 'A',
          className: '',
          description: '',
          capacity: 30,
          assignedTeacher: ''
        });
        setEditingClass(null);
        setShowAddClassModal(false);
        fetchClasses();
        fetchClassStats();
      } else {
        console.error('Failed to update class:', data);
        setClassError(data.message || 'Failed to update class');
      }
    } catch (error) {
      console.error('Error updating class:', error);
      setClassError('Failed to update class. Please try again.');
    }
  };

  const handleDeleteClass = async (classId) => {
    console.log('=== DELETE CLASS FRONTEND ===');
    console.log('Class ID to delete:', classId);
    console.log('Class ID type:', typeof classId);
    console.log('Class ID length:', classId.length);
    
    // Find the class in current list
    const classToDelete = classes.find(c => c._id === classId);
    console.log('Class found in current list:', classToDelete);
    
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const deleteUrl = `${API_URL}/api/admin/classes/${classId}`;
      
      console.log('DELETE URL:', deleteUrl);
      console.log('Making DELETE request...');

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      console.log('DELETE response status:', response.status);
      console.log('DELETE response ok:', response.ok);

      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();
      console.log('DELETE response data:', data);

      if (data.success) {
        setClassSuccess('Class deleted successfully!');
        fetchClasses();
        fetchClassStats();
      } else {
        console.error('Failed to delete class:', data);
        // Show user-friendly error message
        if (data.message && data.message.includes('students assigned')) {
          setClassError(`${data.message}\n\nPlease move students to another class before deleting.`);
        } else {
          setClassError(data.message || 'Failed to delete class');
        }
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      setClassError('Failed to delete class. Please try again.');
    }
  };

  // Load classes when class management is opened
  useEffect(() => {
    if (showClassSectionManagement) {
      setClasses([]); // Clear any stale data
      fetchClasses();
      fetchClassStats();
      fetchTeachersForDropdown();
    }
  }, [showClassSectionManagement]);

  return (
    <div className="flex min-h-screen" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-6 px-4 min-h-screen">
        <div className="text-2xl font-bold mb-8">School Admin</div>
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
            {/* User Management (unclickable) */}
            <li className="mb-0">
              <div className="w-full text-left font-semibold text-lg px-2 py-1 rounded opacity-60 cursor-not-allowed select-none">
                User Management
              </div>
              <ul className="ml-6 mt-2">
                <li className="mb-1">
                  <button
                    className={`w-full text-left text-base px-2 py-1 rounded transition-colors ${activeSidebar === 'User Management' && activeSubSidebar === 'Teacher Management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                    onClick={() => handleSubSidebarClick('User Management', 'Teacher Management')}
                  >
                    Teacher Management
                  </button>
                </li>
              </ul>
            </li>
            <hr className="border-white mb-4 mt-2" />
            {/* Class & Section Management */}
            <li className="mb-4">
              <button
                className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${activeSidebar === 'Class & Section Management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                onClick={() => handleSidebarClick('Class & Section Management')}
              >
                Class & Section Management
              </button>
            </li>
            <hr className="border-white mb-4 mt-0" />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white/80 min-h-screen">
        {showTeacherManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Teacher Management</h1>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Status Filter */}
              <div>
                <label className="mr-2 font-medium">Status:</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="border px-2 py-1 rounded text-black"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              {/* Name / ID Search */}
              <div>
                <label className="mr-2 font-medium">Search Name/ID:</label>
                <input
                  type="text"
                  value={searchNameID}
                  onChange={e => setSearchNameID(e.target.value)}
                  placeholder="Enter name or ID"
                  className="border px-2 py-1 rounded text-black"
                />
              </div>
              {/* Email Search */}
              <div>
                <label className="mr-2 font-medium">Email:</label>
                <input
                  type="text"
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  placeholder="Enter email"
                  className="border px-2 py-1 rounded text-black"
                />
              </div>
              {/* Phone Search */}
              <div>
                <label className="mr-2 font-medium">Phone:</label>
                <input
                  type="text"
                  value={searchPhone}
                  onChange={e => setSearchPhone(e.target.value)}
                  placeholder="Enter phone"
                  className="border px-2 py-1 rounded text-black"
                />
              </div>
              {/* Sort By */}
              <div>
                <label className="mr-2 font-medium">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border px-2 py-1 rounded text-black"
                >
                  <option value="id">ID</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            <button
              className="mb-6 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={() => setShowAddModal(true)}
            >
              Add Teacher
            </button>

            {/* Modal for Add Teacher */}
            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => { setShowAddModal(false); setTeacherError(''); setTeacherSuccess(''); }}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">Add Teacher</h2>
                  <form onSubmit={handleAddTeacher} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={newTeacher.fullName}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter teacher name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={newTeacher.email}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter teacher email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={newTeacher.phone}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Teacher ID</label>
                      <input
                        type="text"
                        name="teacherId"
                        value={newTeacher.teacherId}
                        onChange={handleTeacherInputChange}
                        readOnly
                        className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
                        placeholder="e.g., 25-0001-dcs"
                        required
                      />
                    </div>
                    {teacherError && <div className="text-red-600 text-sm font-semibold">{teacherError}</div>}
                    {teacherSuccess && <div className="text-green-600 text-sm font-semibold">{teacherSuccess}</div>}
                    <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Send Invitation Email</button>
                  </form>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Teacher ID</th>
                    <th className="px-4 py-2 border-b text-left">Full Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Phone Number</th>
                    <th className="px-4 py-2 border-b text-left">Username</th>
                    <th className="px-4 py-2 border-b text-left">Assigned Grade</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers
                    .filter((teacher) => {
                      const displayStatus = teacher.status || teacher.accountStatus || 'active';
                      const displayStatus_formatted = displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
                      return (
                        (statusFilter === 'All' || displayStatus_formatted === statusFilter) &&
                        (teacher.fullName.toLowerCase().includes(searchNameID.toLowerCase()) ||
                          teacher.username.toLowerCase().includes(searchNameID.toLowerCase())) &&
                        teacher.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
                        (teacher.phone || '').includes(searchPhone)
                      );
                    })
                    .sort((a, b) => {
                      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
                      if (sortBy === 'id') return a.username.localeCompare(b.username);
                      if (sortBy === 'status') {
                        const statusA = a.status || a.accountStatus || 'active';
                        const statusB = b.status || b.accountStatus || 'active';
                        return statusA.localeCompare(statusB);
                      }
                      return 0;
                    })
                    .map((teacher) => {
                      const displayStatus = teacher.status || teacher.accountStatus || 'active';
                      const displayStatus_formatted = displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
                      return (
                        <tr key={teacher._id}>
                          <td className="px-4 py-2 border-b">{teacher.teacherId || '-'}</td>
                          <td className="px-4 py-2 border-b">{teacher.fullName}</td>
                          <td className="px-4 py-2 border-b">{teacher.email}</td>
                          <td className="px-4 py-2 border-b">{teacher.phone || '-'}</td>
                          <td className="px-4 py-2 border-b">{teacher.username}</td>
                          <td className="px-4 py-2 border-b">{teacher.assignedGrade || '-'}</td>
                          <td className="px-4 py-2 border-b">{displayStatus_formatted}</td>
                          <td className="px-4 py-2 border-b flex gap-2">
                            {displayStatus === 'pending' && (
                              <button
                                className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                                onClick={() => handleResendActivation(teacher._id)}
                              >Resend Activation</button>
                            )}
                            {displayStatus === 'active' && (
                              <button
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                                onClick={() => handleDisableAccount(teacher._id)}
                              >Disable</button>
                            )}
                            {displayStatus === 'disabled' && (
                              <button
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                onClick={() => handleEnableAccount(teacher._id)}
                              >Enable</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  {teachers
                    .filter((teacher) =>
                      (statusFilter === 'All' || teacher.status === statusFilter) &&
                      (teacher.fullName.toLowerCase().includes(searchNameID.toLowerCase()) ||
                        teacher.username.toLowerCase().includes(searchNameID.toLowerCase())) &&
                      teacher.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
                      (teacher.phone || '').includes(searchPhone)
                    ).length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-2 border-b text-center text-gray-500">No teachers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : showClassSectionManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Class & Section Management</h1>

            {/* Class Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-700 text-white rounded-xl shadow-lg p-6">
                <div className="text-3xl font-extrabold mb-2">{classStats.totalClasses || 0}</div>
                <div className="text-lg font-semibold">Total Classes</div>
              </div>
              <div className="bg-green-700 text-white rounded-xl shadow-lg p-6">
                <div className="text-3xl font-extrabold mb-2">{classStats.activeClasses || 0}</div>
                <div className="text-lg font-semibold">Active Classes</div>
              </div>
              <div className="bg-purple-700 text-white rounded-xl shadow-lg p-6">
                <div className="text-3xl font-extrabold mb-2">{classStats.gradeBreakdown?.length || 0}</div>
                <div className="text-lg font-semibold">Grade Levels</div>
              </div>
            </div>

            <button
              className="mb-6 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={() => {
                setEditingClass(null);
                setNewClass({
                  grade: '4th',
                  section: 'A',
                  className: '',
                  description: '',
                  capacity: 30,
                  status: 'active',
                  assignedTeacher: ''
                });
                setShowAddClassModal(true);
              }}
            >
              Create Class
            </button>

            {/* Success/Error Messages */}
            {classError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{classError}</div>}
            {classSuccess && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{classSuccess}</div>}

            {/* Modal for Add/Edit Class */}
            {showAddClassModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => {
                      setShowAddClassModal(false);
                      setEditingClass(null);
                      setClassError('');
                      setClassSuccess('');
                    }}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">{editingClass ? 'Edit Class' : 'Create Class'}</h2>
                  <form onSubmit={editingClass ? handleUpdateClass : handleAddClass} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Grade Level</label>
                      <select
                        name="grade"
                        value={newClass.grade}
                        onChange={handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                      >
                        <option value="">Select Grade</option>
                        <option value="4th">4th Grade</option>
                        <option value="5th">5th Grade</option>
                        <option value="6th">6th Grade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section</label>
                      <select
                        name="section"
                        value={newClass.section}
                        onChange={handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                      >
                        <option value="">Select Section</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Class Name</label>
                      <input
                        type="text"
                        name="className"
                        value={newClass.className}
                        onChange={handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g., Mathematics 4A"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="description"
                        value={newClass.description}
                        onChange={handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Optional description"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        value={newClass.capacity}
                        onChange={handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Assigned Teacher *</label>
                      <select
                        name="assignedTeacher"
                        value={newClass.assignedTeacher}
                        onChange={handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                      >
                        <option value="">Select Teacher</option>
                        {teachers.filter(t => t.accountStatus === 'active').map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.fullName} ({teacher.teacherId || teacher.username || 'No ID'})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
                      {editingClass ? 'Update Class' : 'Create Class'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Classes Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 border-b text-left font-semibold">Grade</th>
                    <th className="px-4 py-3 border-b text-left font-semibold">Section</th>
                    <th className="px-4 py-3 border-b text-left font-semibold">Class Name</th>
                    <th className="px-4 py-3 border-b text-left font-semibold">Capacity</th>
                    <th className="px-4 py-3 border-b text-left font-semibold">Assigned Teacher</th>
                    <th className="px-4 py-3 border-b text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingClasses ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 border-b text-center text-gray-500">
                        Loading classes...
                      </td>
                    </tr>
                  ) : classes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 border-b text-center text-gray-500">
                        No classes found. Create your first class to get started.
                      </td>
                    </tr>
                  ) : (
                    classes.map((cls) => (
                      <tr key={cls._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b">
                          {cls.grade === '4th' ? '4th Grade' : cls.grade === '5th' ? '5th Grade' : cls.grade === '6th' ? '6th Grade' : cls.grade}
                        </td>
                        <td className="px-4 py-3 border-b">Section {cls.section}</td>
                        <td className="px-4 py-3 border-b font-medium">{cls.className}</td>
                        <td className="px-4 py-3 border-b">{cls.capacity}</td>
                        <td className="px-4 py-3 border-b">
                          {cls.assignedTeacher ? cls.assignedTeacher.fullName : 'Not assigned'}
                        </td>
                        <td className="px-4 py-3 border-b">
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 text-xs"
                              onClick={() => handleEditClass(cls)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 text-xs"
                              onClick={() => handleDeleteClass(cls._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>
            <div className="flex gap-12 justify-center mb-12">
              {stats.map((stat) => (
                <InfoCard key={stat.title} {...stat} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;