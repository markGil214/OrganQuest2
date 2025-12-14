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
  });
  const [teacherError, setTeacherError] = useState('');
  const [teacherSuccess, setTeacherSuccess] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      console.error('No authentication found, redirecting to login');
      window.location.hash = 'login';
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        console.error('User is not an admin or superadmin, redirecting to login');
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
      
      if (!token) {
        console.error('No auth token found');
        setTeachers([]);
        return;
      }
      
      const response = await fetch(`${API_URL}/api/admin/teachers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Token is invalid or expired');
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        // Redirect to login
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

  const handleTeacherInputChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
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
      
      if (!token) {
        console.error('No auth token found');
        setTeacherError('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/admin/send-teacher-invitation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: newTeacher.fullName,
          email: newTeacher.email,
          phone: newTeacher.phone
        })
      });

      if (response.status === 401) {
        console.error('Token is invalid or expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.hash = 'login';
        return;
      }

      const data = await response.json();

      if (data.success) {
        setTeacherSuccess('Teacher invitation sent successfully!');
        setNewTeacher({ fullName: '', email: '', phone: '' });
        setShowAddTeacherModal(false);
        // Refresh teachers list
        fetchTeachers();
      } else {
        setTeacherError(data.message || 'Failed to send teacher invitation');
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
      
      if (!token) {
        console.error('No auth token found');
        setTeacherError('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/admin/teachers/${id}/resend-activation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Token is invalid or expired');
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
      
      if (!token) {
        console.error('No auth token found');
        setTeacherError('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/admin/teachers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountStatus: 'disabled' })
      });

      if (response.status === 401) {
        console.error('Token is invalid or expired');
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
      
      if (!token) {
        console.error('No auth token found');
        setTeacherError('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/admin/teachers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountStatus: 'active' })
      });

      if (response.status === 401) {
        console.error('Token is invalid or expired');
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

  // Class & Section Management State
  const [classes, setClasses] = useState([
    { id: 1, grade: '4th', section: 'A', teacher: 'Mr. Smith', subject: 'Math' },
    { id: 2, grade: '5th', section: 'B', teacher: 'Ms. Lee', subject: 'Science' },
    { id: 3, grade: '6th', section: 'C', teacher: 'Mrs. Johnson', subject: 'English' },
  ]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClass, setNewClass] = useState({
    grade: '',
    section: '',
    teacher: '',
    subject: '',
  });


  // Dummy teacher and subject options for assignment
  const teacherOptions = teachers ? teachers.map(t => t.fullName) : [];
  const subjectOptions = ['Math', 'Science', 'English', 'Filipino', 'Araling Panlipunan'];

  const handleClassInputChange = (e) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClass.grade || !newClass.section || !newClass.teacher || !newClass.subject) return;
    setClasses([
      ...classes,
      { id: Date.now(), ...newClass },
    ]);
    setNewClass({ grade: '', section: '', teacher: '', subject: '' });
    setShowAddClassModal(false);
  };

  // Edit class state and handlers (moved to top level)
  const [editClassId, setEditClassId] = useState();
  const [editClass, setEditClass] = useState({ grade: '', section: '', teacher: '', subject: '' });

  const handleEditClassOpen = (id) => {
    const cls = classes.find(c => c.id === id);
    setEditClassId(id);
    setEditClass({ grade: cls.grade, section: cls.section, teacher: cls.teacher, subject: cls.subject });
  };

  const handleEditClassInputChange = (e) => {
    setEditClass({ ...editClass, [e.target.name]: e.target.value });
  };

  const handleEditClass = (e) => {
    e.preventDefault();
    setClasses(classes.map(c =>
      c.id === editClassId ? { ...c, ...editClass } : c
    ));
    setEditClassId(undefined);
    setEditClass({ grade: '', section: '', teacher: '', subject: '' });
    setShowAddClassModal(false);
  };

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
            <button
              className="mb-6 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={() => setShowAddClassModal(true)}
            >
              Create Class
            </button>

            {/* Modal for Add/Edit Class/Section */}
            {(showAddClassModal || editClassId !== undefined) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => { setShowAddClassModal(false); setEditClassId(undefined); }}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">{editClassId !== undefined ? 'Edit Class' : 'Create Class'}</h2>
                  <form onSubmit={editClassId !== undefined ? handleEditClass : handleAddClass} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Grade Level</label>
                      <select
                        name="grade"
                        value={editClassId !== undefined ? editClass.grade : newClass.grade}
                        onChange={editClassId !== undefined ? handleEditClassInputChange : handleClassInputChange}
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
                        value={editClassId !== undefined ? editClass.section : newClass.section}
                        onChange={editClassId !== undefined ? handleEditClassInputChange : handleClassInputChange}
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
                      <label className="block text-sm font-medium mb-1">Assign Teacher</label>
                      <select
                        name="teacher"
                        value={editClassId !== undefined ? editClass.teacher : newClass.teacher}
                        onChange={editClassId !== undefined ? handleEditClassInputChange : handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                      >
                        <option value="">Select Teacher</option>
                        {teacherOptions.map((t, idx) => (
                          <option key={idx} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Assign Subject</label>
                      <select
                        name="subject"
                        value={editClassId !== undefined ? editClass.subject : newClass.subject}
                        onChange={editClassId !== undefined ? handleEditClassInputChange : handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjectOptions.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">{editClassId !== undefined ? 'Save Changes' : 'Create'}</button>
                  </form>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Grade</th>
                    <th className="px-4 py-2 border-b text-left">Section</th>
                    <th className="px-4 py-2 border-b text-left">Teacher</th>
                    <th className="px-4 py-2 border-b text-left">Subject</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls.id}>
                      <td className="px-4 py-2 border-b">{cls.grade === '4th' ? '4th Grade' : cls.grade === '5th' ? '5th Grade' : cls.grade === '6th' ? '6th Grade' : cls.grade}</td>
                      <td className="px-4 py-2 border-b">Section {cls.section}</td>
                      <td className="px-4 py-2 border-b">{cls.teacher}</td>
                      <td className="px-4 py-2 border-b">{cls.subject}</td>
                      <td className="px-4 py-2 border-b">
                        <button
                          className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 text-xs"
                          onClick={() => handleEditClassOpen(cls.id)}
                        >View / Edit</button>
                      </td>
                    </tr>
                  ))}
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