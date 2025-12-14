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
    { id: '25-0001-dcs', name: 'Mr. Smith', email: 'smith@example.com', phone: '09171234567', status: 'Pending' },
    { id: '25-0002-dcs', name: 'Ms. Lee', email: 'lee@example.com', phone: '09179876543', status: 'Active' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
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
    if (!newTeacher.name || !newTeacher.email) {
      setTeacherError('Full name and email are required.');
      return;
    }
    // Validate unique email
    if (teachers.some(t => t.email.toLowerCase() === newTeacher.email.toLowerCase())) {
      setTeacherError('Email already exists.');
      return;
    }
    // Add teacher
    setTeachers([
      ...teachers,
      { ...newTeacher, id: getNextTeacherId(), status: 'Pending' },
    ]);
    setShowAddModal(false);
    setNewTeacher({ id: '', name: '', email: '', phone: '' });
    setTeacherError('');
    setTimeout(() => {
      alert('Activation email sent!');
    }, 300);
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
                    onClick={() => { setShowAddModal(false); setTeacherError(''); }}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">Add Teacher</h2>
                  <form onSubmit={handleAddTeacher} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Teacher ID <span className="text-xs text-gray-500">(auto-generated)</span></label>
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
                      <label className="block text-sm font-medium mb-1">Phone Number <span className="text-xs text-gray-500">(optional)</span></label>
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
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-4 py-2 border-b">{teacher.id}</td>
                      <td className="px-4 py-2 border-b">{teacher.name}</td>
                      <td className="px-4 py-2 border-b">{teacher.email}</td>
                      <td className="px-4 py-2 border-b">{teacher.phone || '-'}</td>
                      <td className="px-4 py-2 border-b">{teacher.status}</td>
                      <td className="px-4 py-2 border-b flex gap-2">
                        {/* Actions will be implemented in the next step */}
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