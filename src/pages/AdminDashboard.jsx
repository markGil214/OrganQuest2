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

const AdminDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';

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

  // Dummy data for demonstration
  const stats = [
    { title: 'Students', value: 1200 },
    { title: 'Teachers', value: 45 },
    { title: 'Classes', value: 36 },
  ];

  // Teacher Management State
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    fullName: '',
    username: '',
    password: '',
    assignedGrade: 'all'
  });
  const [teacherError, setTeacherError] = useState('');
  const [submittingTeacher, setSubmittingTeacher] = useState(false);

  // Fetch teachers from API
  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/admins`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }
      
      const data = await response.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeacherError('Failed to load teachers. Please try again.');
    } finally {
      setLoadingTeachers(false);
    }
  };

  // Load teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Redirect to login page or handle logout on frontend
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect even if logout request fails
      window.location.href = '/login';
    }
  };

  // Generate next teacher ID
  const getNextTeacherId = () => {
    if (teachers.length === 0) return '25-0001-dcs';
    const last = teachers[teachers.length - 1].id;
    const num = parseInt(last.split('-')[1], 10) + 1;
    return `25-${num.toString().padStart(4, '0')}-dcs`;
  };

  const handleTeacherInputChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
    setTeacherError('');
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setSubmittingTeacher(true);
    setTeacherError('');

    // Validate required fields
    if (!newTeacher.fullName || !newTeacher.username || !newTeacher.password) {
      setTeacherError('Full name, username, and password are required.');
      setSubmittingTeacher(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/create-admin`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: newTeacher.fullName,
          username: newTeacher.username,
          password: newTeacher.password,
          assignedGrade: newTeacher.assignedGrade
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create teacher');
      }

      const data = await response.json();
      
      // Refresh teachers list
      await fetchTeachers();
      
      // Reset form and close modal
      setShowAddModal(false);
      setNewTeacher({
        fullName: '',
        username: '',
        password: '',
        assignedGrade: 'all'
      });
      
      alert('Teacher created successfully! Activation email has been sent.');
    } catch (error) {
      console.error('Error creating teacher:', error);
      setTeacherError(error.message || 'Failed to create teacher. Please try again.');
    } finally {
      setSubmittingTeacher(false);
    }
  };

  // Status-based actions
  const handleResendActivation = (id) => {
    setTeachers(teachers.map(t =>
      t.id === id
        ? { ...t, log: [...(t.log || []), `[${new Date().toLocaleString()}] Activation email resent.`] }
        : t
    ));
    setTimeout(() => {
      alert('Activation email resent!');
    }, 300);
  };

  const handleDisableAccount = (id) => {
    setTeachers(teachers.map(t =>
      t.id === id
        ? { ...t, status: 'Disabled', log: [...(t.log || []), `[${new Date().toLocaleString()}] Account disabled by admin.`] }
        : t
    ));
  };

  const handleEnableAccount = (id) => {
    setTeachers(teachers.map(t =>
      t.id === id
        ? { ...t, status: 'Active', log: [...(t.log || []), `[${new Date().toLocaleString()}] Account enabled by admin.`] }
        : t
    ));
  };

  const handleActivate = (id) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'Pending' : 'Active' } : t));
  };

  const handleSendActivation = (id) => {
    // Simulate sending activation email
    alert('Activation email sent!');
  };

  const showTeacherManagement = activeSidebar === 'User Management' && activeSubSidebar === 'Teacher Management';
  const showClassSectionManagement = activeSidebar === 'Class & Section Management';

  // Class & Section Management State
  const [classes, setClasses] = useState([
    { id: 1, grade: 'Grade 7', section: 'A', teacher: 'Mr. Smith', subject: 'Math' },
    { id: 2, grade: 'Grade 8', section: 'B', teacher: 'Ms. Lee', subject: 'Science' },
  ]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClass, setNewClass] = useState({
    grade: '',
    section: '',
    teacher: '',
    subject: '',
  });


  // Dummy teacher and subject options for assignment
  const teacherOptions = teachers ? teachers.map(t => t.name) : [];
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
        
        {/* Logout Button */}
        <div className="mt-auto">
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
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
              {/* Username Search */}
              <div>
                <label className="mr-2 font-medium">Username:</label>
                <input
                  type="text"
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  placeholder="Enter username"
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
                    onClick={() => { setShowAddModal(false); setTeacherError(''); }}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">Add Teacher</h2>
                  <form onSubmit={handleAddTeacher} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Teacher ID</label>
                      <input
                        type="text"
                        name="id"
                        value={getNextTeacherId()}
                        readOnly
                        className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={newTeacher.fullName}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={newTeacher.username}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter username"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={newTeacher.password}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Assigned Grade</label>
                      <select
                        name="assignedGrade"
                        value={newTeacher.assignedGrade}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                      >
                        <option value="all">All Grades</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                      </select>
                    </div>

                    {teacherError && <div className="text-red-600 text-sm font-semibold">{teacherError}</div>}
                    <button 
                      type="submit" 
                      disabled={submittingTeacher}
                      className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {submittingTeacher ? 'Creating Teacher...' : 'Add Teacher'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {loadingTeachers ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading teachers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b text-left">Teacher ID</th>
                      <th className="px-4 py-2 border-b text-left">Full Name</th>
                      <th className="px-4 py-2 border-b text-left">Username</th>
                      <th className="px-4 py-2 border-b text-left">Assigned Grade</th>
                      <th className="px-4 py-2 border-b text-left">Status</th>
                      <th className="px-4 py-2 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                <tbody>
                  {teachers
                    .filter((teacher) =>
                      (statusFilter === 'All' || (teacher.status || 'Active') === statusFilter) &&
                      ((teacher.fullName || teacher.name || '').toLowerCase().includes(searchNameID.toLowerCase()) ||
                        (teacher.id || teacher._id || '').toLowerCase().includes(searchNameID.toLowerCase())) &&
                      (teacher.username || '').toLowerCase().includes(searchEmail.toLowerCase())
                    )
                    .sort((a, b) => {
                      const nameA = a.fullName || a.name || '';
                      const nameB = b.fullName || b.name || '';
                      if (sortBy === 'name') return nameA.localeCompare(nameB);
                      if (sortBy === 'id') return (a.id || a._id || '').localeCompare(b.id || b._id || '');
                      if (sortBy === 'status') return (a.status || 'Active').localeCompare(b.status || 'Active');
                      return 0;
                    })
                    .map((teacher) => (
                      <tr key={teacher.id || teacher._id}>
                        <td className="px-4 py-2 border-b">{teacher.id || teacher._id}</td>
                        <td className="px-4 py-2 border-b">{teacher.fullName || teacher.name}</td>
                        <td className="px-4 py-2 border-b">{teacher.username}</td>
                        <td className="px-4 py-2 border-b">{teacher.assignedGrade || 'All Grades'}</td>
                        <td className="px-4 py-2 border-b">{teacher.status || 'Active'}</td>
                        <td className="px-4 py-2 border-b flex gap-2">
                          {(teacher.status === 'Pending' || !teacher.status) && (
                            <button
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                              onClick={() => handleResendActivation(teacher.id || teacher._id)}
                            >Resend Activation Email</button>
                          )}
                          {teacher.status === 'Active' && (
                            <button
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                              onClick={() => handleDisableAccount(teacher.id || teacher._id)}
                            >Disable Account</button>
                          )}
                          {teacher.status === 'Disabled' && (
                            <button
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                              onClick={() => handleEnableAccount(teacher.id || teacher._id)}
                            >Enable Account</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  {teachers
                    .filter((teacher) =>
                      (statusFilter === 'All' || teacher.status === statusFilter) &&
                      (teacher.name.toLowerCase().includes(searchNameID.toLowerCase()) ||
                        teacher.id.toLowerCase().includes(searchNameID.toLowerCase())) &&
                      teacher.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
                      (teacher.phone || '').includes(searchPhone)
                    ).length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-2 border-b text-center text-gray-500">No teachers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
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
                      <label className="block text-sm font-medium mb-1">Grade Level / Year</label>
                      <input
                        type="text"
                        name="grade"
                        value={editClassId !== undefined ? editClass.grade : newClass.grade}
                        onChange={editClassId !== undefined ? handleEditClassInputChange : handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g. Grade 7 or Year 1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Name</label>
                      <input
                        type="text"
                        name="section"
                        value={editClassId !== undefined ? editClass.section : newClass.section}
                        onChange={editClassId !== undefined ? handleEditClassInputChange : handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g. A, B, C"
                        required
                      />
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
                    <th className="px-4 py-2 border-b text-left">Grade/Year</th>
                    <th className="px-4 py-2 border-b text-left">Section</th>
                    <th className="px-4 py-2 border-b text-left">Teacher</th>
                    <th className="px-4 py-2 border-b text-left">Subject</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls.id}>
                      <td className="px-4 py-2 border-b">{cls.grade}</td>
                      <td className="px-4 py-2 border-b">{cls.section}</td>
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