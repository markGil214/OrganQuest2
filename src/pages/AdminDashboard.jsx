import React, { useState } from 'react';

const sidebarItems = [
  {
    title: 'Dashboard',
    description: 'Overview of the system',
  },
  {
    title: 'User Management',
    description: 'Manage all system users',
    subItems: [
      { title: 'Teacher Management' },
      { title: 'Student Management' },
    ],
  },
  {
    title: 'Class & Section Management',
    description: 'Organize academic structure',
  },
  {
    title: 'Enrollment Management',
    description: 'Control who belongs to which class',
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
  // Teacher Management filters and sort state
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchNameID, setSearchNameID] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [sortBy, setSortBy] = useState('id');
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

  // Dummy teacher data for demonstration


  // Teacher Management State
  const [teachers, setTeachers] = useState([
    { id: '25-0001-dcs', name: 'Mr. Smith', email: 'smith@example.com', phone: '09171234567', status: 'Pending', log: [] },
    { id: '25-0002-dcs', name: 'Ms. Lee', email: 'lee@example.com', phone: '09179876543', status: 'Active', log: [] },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    grade: '',
    section: '',
    subject: '',
  });
  const [teacherError, setTeacherError] = useState('');

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

  const handleAddTeacher = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!newTeacher.name || !newTeacher.email || !newTeacher.grade || !newTeacher.section || !newTeacher.subject) {
      setTeacherError('All fields are required.');
      return;
    }
    // Validate unique email
    if (teachers.some(t => t.email.toLowerCase() === newTeacher.email.toLowerCase())) {
      setTeacherError('Email already exists.');
      return;
    }
    // Add teacher
    const newId = getNextTeacherId();
    setTeachers([
      ...teachers,
      { ...newTeacher, id: newId, status: 'Pending', log: [`[${new Date().toLocaleString()}] Teacher added. Activation email sent.`] },
    ]);
    setShowAddModal(false);
    setNewTeacher({ id: '', name: '', email: '', phone: '', grade: '', section: '', subject: '' });
    setTeacherError('');
    setTimeout(() => {
      alert('Activation email sent!');
    }, 300);
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
  const showStudentManagement = activeSidebar === 'User Management' && activeSubSidebar === 'Student Management';
  const showClassSectionManagement = activeSidebar === 'Class & Section Management';
  const showEnrollmentManagement = activeSidebar === 'Enrollment Management';
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Helper to check if student is enrolled in a class
  const isStudentEnrolled = (student, cls) => student.section === `${cls.grade} - ${cls.section}`;

  const handleOpenEnrollModal = (clsId) => {
    setSelectedClassId(clsId);
    setShowEnrollModal(true);
  };

  const handleAddStudentToClass = (studentId, cls) => {
    setStudents(students.map(s =>
      s.id === studentId ? { ...s, section: `${cls.grade} - ${cls.section}` } : s
    ));
  };

  const handleRemoveStudentFromClass = (studentId) => {
    setStudents(students.map(s =>
      s.id === studentId ? { ...s, section: '' } : s
    ));
  };

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

  // Student Management State
  const [students, setStudents] = useState([
    { id: '2025-0001', name: 'Juan Dela Cruz', dob: '2010-05-15', gender: 'Male', email: 'juan@example.com', phone: '09171234567', status: 'Active', enrolled: ['Grade 7 - A - Math'] },
    { id: '2025-0002', name: 'Maria Santos', dob: '2010-08-20', gender: 'Female', email: 'maria@example.com', phone: '09179876543', status: 'Pending', enrolled: [] },
    { id: '2025-0003', name: 'Carlos Reyes', dob: '2009-11-02', gender: 'Male', email: 'carlos@example.com', phone: '09170001122', status: 'Disabled', enrolled: ['Grade 8 - B - Science'] },
  ]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    id: '25-0000-stud',
    name: '',
    dob: '',
    gender: '',
    phone: '',
    status: 'Pending',
    enrolled: [],
  });
  // Student Management filters and sort state
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');
  const [searchStudentNameID, setSearchStudentNameID] = useState('');
  const [searchStudentEmail, setSearchStudentEmail] = useState('');
  const [searchStudentPhone, setSearchStudentPhone] = useState('');
  const [studentSortBy, setStudentSortBy] = useState('id');

  // Generate next student ID
  const getNextStudentId = () => {
    if (students.length === 0) return '25-0001-stud';
    const last = students[students.length - 1].id;
    const num = parseInt(last.split('-')[1], 10) + 1;
    return `25-${num.toString().padStart(4, '0')}-stud`;
  };

  const handleStudentInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    // Validate required fields for new structure
    if (!newStudent.name || !newStudent.dob || !newStudent.gender || !newStudent.phone) return;
    setStudents([
      ...students,
      { ...newStudent, id: getNextStudentId(), status: 'Active', enrolled: [] },
    ]);
    setNewStudent({ id: '25-0000-stud', name: '', dob: '', gender: '', phone: '', status: 'Pending', enrolled: [] });
    setShowAddStudentModal(false);
  };

  const handleStudentActivate = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
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
                <li className="mb-1">
                  <button
                    className={`w-full text-left text-base px-2 py-1 rounded transition-colors ${activeSidebar === 'User Management' && activeSubSidebar === 'Student Management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                    onClick={() => handleSubSidebarClick('User Management', 'Student Management')}
                  >
                    Student Management
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
            {/* Enrollment Management */}
            <li className="mb-4">
              <button
                className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${activeSidebar === 'Enrollment Management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                onClick={() => handleSidebarClick('Enrollment Management')}
              >
                Enrollment Management
              </button>
            </li>
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
                        name="name"
                        value={newTeacher.name}
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
                      <label className="block text-sm font-medium mb-1">Grade / Year</label>
                      <input
                        type="text"
                        name="grade"
                        value={newTeacher.grade}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g., Grade 7"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section</label>
                      <input
                        type="text"
                        name="section"
                        value={newTeacher.section}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g., A, B"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={newTeacher.subject}
                        onChange={handleTeacherInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g., Math, Science"
                        required
                      />
                    </div>
                    {teacherError && <div className="text-red-600 text-sm font-semibold">{teacherError}</div>}
                    <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Add Teacher</button>
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
                    <th className="px-4 py-2 border-b text-left">Grade / Year</th>
                    <th className="px-4 py-2 border-b text-left">Section</th>
                    <th className="px-4 py-2 border-b text-left">Subject</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers
                    .filter((teacher) =>
                      (statusFilter === 'All' || teacher.status === statusFilter) &&
                      (teacher.name.toLowerCase().includes(searchNameID.toLowerCase()) ||
                        teacher.id.toLowerCase().includes(searchNameID.toLowerCase())) &&
                      teacher.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
                      (teacher.phone || '').includes(searchPhone)
                    )
                    .sort((a, b) => {
                      if (sortBy === 'name') return a.name.localeCompare(b.name);
                      if (sortBy === 'id') return a.id.localeCompare(b.id);
                      if (sortBy === 'status') return a.status.localeCompare(b.status);
                      return 0;
                    })
                    .map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-4 py-2 border-b">{teacher.id}</td>
                        <td className="px-4 py-2 border-b">{teacher.name}</td>
                        <td className="px-4 py-2 border-b">{teacher.email}</td>
                        <td className="px-4 py-2 border-b">{teacher.phone || '-'}</td>
                        <td className="px-4 py-2 border-b">{teacher.grade}</td>
                        <td className="px-4 py-2 border-b">{teacher.section}</td>
                        <td className="px-4 py-2 border-b">{teacher.subject}</td>
                        <td className="px-4 py-2 border-b">{teacher.status}</td>
                        <td className="px-4 py-2 border-b flex gap-2">
                          {teacher.status === 'Pending' && (
                            <button
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                              onClick={() => handleResendActivation(teacher.id)}
                            >Resend Activation Email</button>
                          )}
                          {teacher.status === 'Active' && (
                            <button
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                              onClick={() => handleDisableAccount(teacher.id)}
                            >Disable Account</button>
                          )}
                          {teacher.status === 'Disabled' && (
                            <button
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                              onClick={() => handleEnableAccount(teacher.id)}
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
          </div>
        // ...existing code...
        ) : showStudentManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Student Management</h1>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="mr-2 font-medium">Status:</label>
                <select
                  value={studentStatusFilter}
                  onChange={e => setStudentStatusFilter(e.target.value)}
                  className="border px-2 py-1 rounded text-black"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label className="mr-2 font-medium">Search Name/ID:</label>
                <input
                  type="text"
                  value={searchStudentNameID}
                  onChange={e => setSearchStudentNameID(e.target.value)}
                  placeholder="Enter name or ID"
                  className="border px-2 py-1 rounded text-black"
                />
              </div>
              <div>
                <label className="mr-2 font-medium">Email:</label>
                <input
                  type="text"
                  value={searchStudentEmail}
                  onChange={e => setSearchStudentEmail(e.target.value)}
                  placeholder="Enter email"
                  className="border px-2 py-1 rounded text-black"
                />
              </div>
              <div>
                <label className="mr-2 font-medium">Phone:</label>
                <input
                  type="text"
                  value={searchStudentPhone}
                  onChange={e => setSearchStudentPhone(e.target.value)}
                  placeholder="Enter phone"
                  className="border px-2 py-1 rounded text-black"
                />
              </div>
              <div>
                <label className="mr-2 font-medium">Sort By:</label>
                <select
                  value={studentSortBy}
                  onChange={e => setStudentSortBy(e.target.value)}
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
              onClick={() => {
                setNewStudent({ id: '', name: '', email: '', phone: '', status: 'Pending', enrolled: [] });
                setShowAddStudentModal(true);
              }}
            >
              Add Student
            </button>

            {/* Modal for Add Student */}
            {showAddStudentModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => setShowAddStudentModal(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">Add Student</h2>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">ID</label>
                      <input
                        type="text"
                        name="id"
                        value={newStudent.id}
                        readOnly
                        className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newStudent.name}
                        onChange={handleStudentInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter student name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={newStudent.dob}
                        onChange={handleStudentInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <select
                        name="gender"
                        value={newStudent.gender}
                        onChange={handleStudentInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {/* Email field removed as per new requirements */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={newStudent.phone}
                        onChange={handleStudentInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Add Student</button>
                  </form>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">ID</th>
                    <th className="px-4 py-2 border-b text-left">Full Name</th>
                    <th className="px-4 py-2 border-b text-left">DOB</th>
                    <th className="px-4 py-2 border-b text-left">Gender</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Phone</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Enrollment</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((student) =>
                      (studentStatusFilter === 'All' || student.status === studentStatusFilter) &&
                      (student.name.toLowerCase().includes(searchStudentNameID.toLowerCase()) ||
                        student.id.toLowerCase().includes(searchStudentNameID.toLowerCase())) &&
                      student.email.toLowerCase().includes(searchStudentEmail.toLowerCase()) &&
                      (student.phone || '').includes(searchStudentPhone)
                    )
                    .sort((a, b) => {
                      if (studentSortBy === 'name') return a.name.localeCompare(b.name);
                      if (studentSortBy === 'id') return a.id.localeCompare(b.id);
                      if (studentSortBy === 'status') return a.status.localeCompare(b.status);
                      return 0;
                    })
                    .map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-2 border-b">{student.id}</td>
                        <td className="px-4 py-2 border-b">{student.name}</td>
                        <td className="px-4 py-2 border-b">{student.dob}</td>
                        <td className="px-4 py-2 border-b">{student.gender}</td>
                        <td className="px-4 py-2 border-b">{student.email}</td>
                        <td className="px-4 py-2 border-b">{student.phone}</td>
                        <td className="px-4 py-2 border-b">{student.status}</td>
                        <td className="px-4 py-2 border-b">{student.enrolled && student.enrolled.length > 0 ? student.enrolled.join(', ') : <span className="text-gray-400">Not enrolled</span>}</td>
                      </tr>
                    ))}
                  {students
                    .filter((student) =>
                      (studentStatusFilter === 'All' || student.status === studentStatusFilter) &&
                      (student.name.toLowerCase().includes(searchStudentNameID.toLowerCase()) ||
                        student.id.toLowerCase().includes(searchStudentNameID.toLowerCase())) &&
                      student.email.toLowerCase().includes(searchStudentEmail.toLowerCase()) &&
                      (student.phone || '').includes(searchStudentPhone)
                    ).length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-4 py-2 border-b text-center text-gray-500">No students found</td>
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
        ) : showEnrollmentManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Enrollment Management</h1>
            <h2 className="text-xl font-semibold mb-4">Select Class</h2>
            <div className="overflow-x-auto mb-6">
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
                          onClick={() => handleOpenEnrollModal(cls.id)}
                        >
                          Enroll Students
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Enroll Students Modal */}
            {showEnrollModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => setShowEnrollModal(false)}
                  >
                    &times;
                  </button>
                  {(() => {
                    const cls = classes.find(c => c.id === selectedClassId);
                    if (!cls) return null;
                    return (
                      <>
                        <h2 className="text-xl font-bold mb-4">Enroll Students</h2>
                        <div className="mb-2 text-sm text-gray-700 font-semibold">
                          Selected Class: {cls.grade} – Section {cls.section} – {cls.subject}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          <table className="min-w-full bg-white rounded shadow">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 border-b text-left">Student Name</th>
                                <th className="px-4 py-2 border-b text-left">Status</th>
                                <th className="px-4 py-2 border-b text-left">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((s) => {
                                const enrolled = isStudentEnrolled(s, cls);
                                return (
                                  <tr key={s.id}>
                                    <td className="px-4 py-2 border-b">{s.name}</td>
                                    <td className="px-4 py-2 border-b">{enrolled ? 'Enrolled' : 'Not Enrolled'}</td>
                                    <td className="px-4 py-2 border-b">
                                      {enrolled ? (
                                        <button
                                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                                          onClick={() => handleRemoveStudentFromClass(s.id)}
                                        >Remove</button>
                                      ) : (
                                        <button
                                          className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 text-xs"
                                          onClick={() => handleAddStudentToClass(s.id, cls)}
                                        >Add</button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
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