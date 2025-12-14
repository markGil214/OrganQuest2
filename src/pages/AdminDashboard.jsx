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
      {
        title: 'Teacher Management',
      },
      {
        title: 'Student Management',
      },
    ],
  },
  {
    title: 'Class & Section Management',
    description: 'Organize academic structure',
  },
  {
    title: 'Subject Management',
    description: 'Manage academic subjects',
  },
  {
    title: 'Enrollment Management',
    description: 'Control who belongs to which class',
  },
];

const InfoCard = ({ title, value }) => (
  <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-4 min-w-[160px]">
    <div className="text-2xl font-bold mb-2">{value}</div>
    <div className="text-gray-600 text-sm">{title}</div>
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
  // Dummy data for demonstration
  const stats = [
    { title: 'Students', value: 1200 },
    { title: 'Teachers', value: 45 },
    { title: 'Classes', value: 36 },
  ];
  const recentClasses = ['Grade 7 - Section A', 'Grade 8 - Section B'];
  const pendingTeachers = ['Mr. Smith (Pending Activation)', 'Ms. Lee (Pending Activation)'];
  const notifications = ['System update scheduled for Dec 20', 'New subject added: Robotics'];

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

  const [teachers, setTeachers] = useState([
    { id: '25-0001-dcs', name: 'Mr. Smith', age: 35, sex: 'Male', email: 'smith@example.com', phone: '09171234567', status: 'Pending' },
    { id: '25-0002-dcs', name: 'Ms. Lee', age: 29, sex: 'Female', email: 'lee@example.com', phone: '09179876543', status: 'Active' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    id: '',
    name: '',
    age: '',
    sex: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.id || !newTeacher.name || !newTeacher.age || !newTeacher.sex || !newTeacher.email || !newTeacher.phone) return;
    setTeachers([
      ...teachers,
      { ...newTeacher, status: 'Pending' },
    ]);
    setNewTeacher({ id: '', name: '', age: '', sex: '', email: '', phone: '' });
    setShowAddModal(false);
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

  // Enrollment Management State
  const [selectedClassId, setSelectedClassId] = useState(classes.length > 0 ? classes[0].id : '');
  // For demo, assume students and classes already exist

  // Get students enrolled in selected class
  const getEnrolledStudents = () => {
    if (!selectedClassId) return [];
    // For demo, add a property to students: enrolledClassId
    return students.filter(s => s.enrolledClassId === selectedClassId);
  };

  // Get students not enrolled in selected class
  const getAvailableStudents = () => {
    return students.filter(s => !s.enrolledClassId || s.enrolledClassId !== selectedClassId);
  };

  const handleEnrollStudent = (studentId) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, enrolledClassId: selectedClassId } : s));
  };

  const handleRemoveStudent = (studentId) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, enrolledClassId: undefined } : s));
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

  // Student Management State
  const [students, setStudents] = useState([
    { id: '25-0001-stud', name: 'Juan Dela Cruz', age: 13, sex: 'Male', section: 'Grade 7 - A', status: 'Active' },
    { id: '25-0002-stud', name: 'Maria Santos', age: 14, sex: 'Female', section: 'Grade 8 - B', status: 'Inactive' },
  ]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    age: '',
    sex: '',
    section: '',
  });

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
    if (!newStudent.name || !newStudent.age || !newStudent.sex || !newStudent.section) return;
    setStudents([
      ...students,
      { ...newStudent, id: getNextStudentId(), status: 'Active' },
    ]);
    setNewStudent({ id: '', name: '', age: '', sex: '', section: '' });
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
            {sidebarItems.map((item, idx) => (
              <li key={item.title} className="mb-4">
                <button
                  className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${activeSidebar === item.title && !activeSubSidebar ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                  onClick={() => handleSidebarClick(item.title)}
                >
                  {item.title}
                </button>
                {item.subItems && (
                  <ul className="ml-6 mt-2">
                    {item.subItems.map((sub, subIdx) => (
                      <li key={sub.title} className="mb-1">
                        <button
                          className={`w-full text-left text-base px-2 py-1 rounded transition-colors ${activeSidebar === item.title && activeSubSidebar === sub.title ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                          onClick={() => handleSubSidebarClick(item.title, sub.title)}
                        >
                          {sub.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white/80 min-h-screen">
        {showTeacherManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Teacher Management</h1>
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
                    onClick={() => setShowAddModal(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">Add Teacher</h2>
                  <form onSubmit={handleAddTeacher} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">ID <span className="text-xs text-gray-500">(e.g. 25-0001-dcs)</span></label>
                      <input
                        type="text"
                        name="id"
                        value={newTeacher.id}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="25-0001-dcs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newTeacher.name}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Enter teacher name"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={newTeacher.age}
                          onChange={handleInputChange}
                          className="border rounded px-3 py-2 w-full"
                          placeholder="Age"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Sex</label>
                        <select
                          name="sex"
                          value={newTeacher.sex}
                          onChange={handleInputChange}
                          className="border rounded px-3 py-2 w-full"
                          required
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={newTeacher.email}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="09xxxxxxxxx"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Add Teacher</button>
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
                    <th className="px-4 py-2 border-b text-left">Age</th>
                    <th className="px-4 py-2 border-b text-left">Sex</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Phone</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-4 py-2 border-b">{teacher.id}</td>
                      <td className="px-4 py-2 border-b">{teacher.name}</td>
                      <td className="px-4 py-2 border-b">{teacher.age}</td>
                      <td className="px-4 py-2 border-b">{teacher.sex}</td>
                      <td className="px-4 py-2 border-b">{teacher.email}</td>
                      <td className="px-4 py-2 border-b">{teacher.phone}</td>
                      <td className="px-4 py-2 border-b">{teacher.status}</td>
                      <td className="px-4 py-2 border-b flex gap-2">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                          onClick={() => handleSendActivation(teacher.id)}
                        >
                          Send Activation Email
                        </button>
                        <button
                          className={`px-2 py-1 rounded text-xs text-white ${teacher.status === 'Active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                          onClick={() => handleActivate(teacher.id)}
                        >
                          {teacher.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : showStudentManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Student Management</h1>
            <button
              className="mb-6 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={() => {
                setNewStudent({ id: getNextStudentId(), name: '', age: '', sex: '', section: '' });
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
                      <label className="block text-sm font-medium mb-1">ID <span className="text-xs text-gray-500">(auto-generated)</span></label>
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
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={newStudent.age}
                          onChange={handleStudentInputChange}
                          className="border rounded px-3 py-2 w-full"
                          placeholder="Age"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Sex</label>
                        <select
                          name="sex"
                          value={newStudent.sex}
                          onChange={handleStudentInputChange}
                          className="border rounded px-3 py-2 w-full"
                          required
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section</label>
                      <input
                        type="text"
                        name="section"
                        value={newStudent.section}
                        onChange={handleStudentInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g. Grade 7 - A"
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
                    <th className="px-4 py-2 border-b text-left">Age</th>
                    <th className="px-4 py-2 border-b text-left">Sex</th>
                    <th className="px-4 py-2 border-b text-left">Section</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-2 border-b">{student.id}</td>
                      <td className="px-4 py-2 border-b">{student.name}</td>
                      <td className="px-4 py-2 border-b">{student.age}</td>
                      <td className="px-4 py-2 border-b">{student.sex}</td>
                      <td className="px-4 py-2 border-b">{student.section}</td>
                      <td className="px-4 py-2 border-b">{student.status}</td>
                      <td className="px-4 py-2 border-b flex gap-2">
                        <button
                          className={`px-2 py-1 rounded text-xs text-white ${student.status === 'Active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                          onClick={() => handleStudentActivate(student.id)}
                        >
                          {student.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
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
              Create Class / Section
            </button>

            {/* Modal for Add Class/Section */}
            {showAddClassModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => setShowAddClassModal(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">Create Class / Section</h2>
                  <form onSubmit={handleAddClass} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Grade Level / Year</label>
                      <input
                        type="text"
                        name="grade"
                        value={newClass.grade}
                        onChange={handleClassInputChange}
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
                        value={newClass.section}
                        onChange={handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="e.g. A, B, C"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Assign Teacher</label>
                      <select
                        name="teacher"
                        value={newClass.teacher}
                        onChange={handleClassInputChange}
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
                        value={newClass.subject}
                        onChange={handleClassInputChange}
                        className="border rounded px-3 py-2 w-full"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjectOptions.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Create</button>
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
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls.id}>
                      <td className="px-4 py-2 border-b">{cls.grade}</td>
                      <td className="px-4 py-2 border-b">{cls.section}</td>
                      <td className="px-4 py-2 border-b">{cls.teacher}</td>
                      <td className="px-4 py-2 border-b">{cls.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : showEnrollmentManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Enrollment Management</h1>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Select Class</label>
              <select
                className="border rounded px-3 py-2 w-full max-w-xs"
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.grade} - {cls.section} ({cls.subject})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Enrolled Students */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Enrolled Students</h2>
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b text-left">ID</th>
                      <th className="px-4 py-2 border-b text-left">Name</th>
                      <th className="px-4 py-2 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getEnrolledStudents().length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-2 text-center">No students enrolled.</td></tr>
                    ) : getEnrolledStudents().map(student => (
                      <tr key={student.id}>
                        <td className="px-4 py-2 border-b">{student.id}</td>
                        <td className="px-4 py-2 border-b">{student.name}</td>
                        <td className="px-4 py-2 border-b">
                          <button
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            onClick={() => handleRemoveStudent(student.id)}
                          >Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Available Students */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Available Students</h2>
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b text-left">ID</th>
                      <th className="px-4 py-2 border-b text-left">Name</th>
                      <th className="px-4 py-2 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAvailableStudents().length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-2 text-center">No available students.</td></tr>
                    ) : getAvailableStudents().map(student => (
                      <tr key={student.id}>
                        <td className="px-4 py-2 border-b">{student.id}</td>
                        <td className="px-4 py-2 border-b">{student.name}</td>
                        <td className="px-4 py-2 border-b">
                          <button
                            className="bg-blue-700 text-white px-2 py-1 rounded text-xs hover:bg-blue-800"
                            onClick={() => handleEnrollStudent(student.id)}
                          >Enroll</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            {/* Info Cards */}
            <div className="flex gap-6 mb-8">
              {stats.map((stat) => (
                <InfoCard key={stat.title} {...stat} />
              ))}
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <RecentActivity title="Newly Created Classes" items={recentClasses} />
              <RecentActivity title="Pending Teacher Activations" items={pendingTeachers} />
              <RecentActivity title="System Notifications" items={notifications} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;