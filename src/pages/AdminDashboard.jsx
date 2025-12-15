import React, { useState } from 'react';

// Sidebar items (static)
const sidebarItems = [
  { title: 'Dashboard', description: 'Overview of the system' },
  {
    title: 'User Management',
    description: 'Manage all system users',
    subItems: [
      { title: 'Teacher Management' },
      { title: 'Student Management' },
    ],
  },
  { title: 'Class & Section Management', description: 'Organize academic structure' },
  { title: 'Enrollment Management', description: 'Control who belongs to which class' },
];

// Small reusable card for stats
const InfoCard = ({ title, value }) => (
  <div className="flex flex-col items-center justify-center bg-blue-700 text-white rounded-xl shadow-lg p-8 min-w-[220px] min-h-[160px]">
    <div className="text-5xl font-extrabold mb-4">{value}</div>
    <div className="text-xl font-semibold">{title}</div>
  </div>
);

const AdminDashboard = () => {
  /** Sidebar state **/
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

  /** Dashboard stats **/
  const stats = [
    { title: 'Students', value: 1200 },
    { title: 'Teachers', value: 45 },
    { title: 'Classes', value: 36 },
  ];

  /** Teacher Management State **/
  const [teachers, setTeachers] = useState([
    { id: '25-0001-dcs', name: 'Mr. Smith', email: 'smith@example.com', phone: '09171234567', status: 'Pending', log: [] },
    { id: '25-0002-dcs', name: 'Ms. Lee', email: 'lee@example.com', phone: '09179876543', status: 'Active', log: [] },
  ]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchNameID, setSearchNameID] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ id: '', name: '', email: '', phone: '' });
  const [teacherError, setTeacherError] = useState('');

  const getNextTeacherId = () => {
    if (teachers.length === 0) return '25-0001-dcs';
    const lastNum = parseInt(teachers[teachers.length - 1].id.split('-')[1], 10) + 1;
    return `25-${lastNum.toString().padStart(4, '0')}-dcs`;
  };

  const handleTeacherInputChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
    setTeacherError('');
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email) {
      setTeacherError('Full name and email are required.');
      return;
    }
    if (teachers.some(t => t.email.toLowerCase() === newTeacher.email.toLowerCase())) {
      setTeacherError('Email already exists.');
      return;
    }
    const id = getNextTeacherId();
    setTeachers([...teachers, { ...newTeacher, id, status: 'Pending', log: [`[${new Date().toLocaleString()}] Teacher added.`] }]);
    setNewTeacher({ id: '', name: '', email: '', phone: '' });
    setShowAddModal(false);
    setTeacherError('');
    setTimeout(() => alert('Activation email sent!'), 300);
  };

  const handleResendActivation = (id) => {
    setTeachers(teachers.map(t =>
      t.id === id ? { ...t, log: [...(t.log || []), `[${new Date().toLocaleString()}] Activation email resent.`] } : t
    ));
    setTimeout(() => alert('Activation email resent!'), 300);
  };

  const handleDisableAccount = (id) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, status: 'Disabled', log: [...(t.log || []), `[${new Date().toLocaleString()}] Account disabled.`] } : t));
  };

  const handleEnableAccount = (id) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, status: 'Active', log: [...(t.log || []), `[${new Date().toLocaleString()}] Account enabled.`] } : t));
  };

  /** Class & Section Management **/
  const [classes, setClasses] = useState([
    { id: 1, grade: 'Grade 7', section: 'A', teacher: 'Mr. Smith', subject: 'Math' },
    { id: 2, grade: 'Grade 8', section: 'B', teacher: 'Ms. Lee', subject: 'Science' },
  ]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClass, setNewClass] = useState({ grade: '', section: '', teacher: '', subject: '' });
  const [editClassId, setEditClassId] = useState();
  const [editClass, setEditClass] = useState({ grade: '', section: '', teacher: '', subject: '' });

  const teacherOptions = teachers.map(t => t.name);
  const subjectOptions = ['Math', 'Science', 'English', 'Filipino', 'AP'];

  const handleClassInputChange = (e) => setNewClass({ ...newClass, [e.target.name]: e.target.value });
  const handleEditClassInputChange = (e) => setEditClass({ ...editClass, [e.target.name]: e.target.value });

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClass.grade || !newClass.section || !newClass.teacher || !newClass.subject) return;
    setClasses([...classes, { id: Date.now(), ...newClass }]);
    setNewClass({ grade: '', section: '', teacher: '', subject: '' });
    setShowAddClassModal(false);
  };

  const handleEditClassOpen = (id) => {
    const cls = classes.find(c => c.id === id);
    setEditClassId(id);
    setEditClass({ ...cls });
  };

  const handleEditClass = (e) => {
    e.preventDefault();
    setClasses(classes.map(c => c.id === editClassId ? { ...c, ...editClass } : c));
    setEditClassId(undefined);
  };

  /** Student Management **/
  const [students, setStudents] = useState([
    { id: '2025-0001', name: 'Juan Dela Cruz', dob: '2010-05-15', gender: 'Male', email: 'juan@example.com', phone: '09171234567', status: 'Active', enrolled: ['Grade 7 - A - Math'] },
    { id: '2025-0002', name: 'Maria Santos', dob: '2010-08-20', gender: 'Female', email: 'maria@example.com', phone: '09179876543', status: 'Pending', enrolled: [] },
  ]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ id: '25-0000-stud', name: '', dob: '', gender: '', phone: '', status: 'Pending', enrolled: [] });
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');
  const [searchStudentNameID, setSearchStudentNameID] = useState('');
  const [searchStudentEmail, setSearchStudentEmail] = useState('');
  const [searchStudentPhone, setSearchStudentPhone] = useState('');
  const [studentSortBy, setStudentSortBy] = useState('id');

  const getNextStudentId = () => {
    if (students.length === 0) return '25-0001-stud';
    const lastNum = parseInt(students[students.length - 1].id.split('-')[1], 10) + 1;
    return `25-${lastNum.toString().padStart(4, '0')}-stud`;
  };

  const handleStudentInputChange = (e) => setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.dob || !newStudent.gender || !newStudent.phone) return;
    setStudents([...students, { ...newStudent, id: getNextStudentId(), status: 'Active', enrolled: [] }]);
    setNewStudent({ id: '25-0000-stud', name: '', dob: '', gender: '', phone: '', status: 'Pending', enrolled: [] });
    setShowAddStudentModal(false);
  };

  /** Helper to check if student is enrolled **/
  const isStudentEnrolled = (student, cls) => student.section === `${cls.grade} - ${cls.section}`;

  /** Enrollment Management **/
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const handleOpenEnrollModal = (clsId) => {
    setSelectedClassId(clsId);
    setShowEnrollModal(true);
  };
  const handleAddStudentToClass = (studentId, cls) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, section: `${cls.grade} - ${cls.section}` } : s));
  };
  const handleRemoveStudentFromClass = (studentId) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, section: '' } : s));
  };

  /** Conditional render flags **/
  const showTeacherManagement = activeSidebar === 'User Management' && activeSubSidebar === 'Teacher Management';
  const showStudentManagement = activeSidebar === 'User Management' && activeSubSidebar === 'Student Management';
  const showClassSectionManagement = activeSidebar === 'Class & Section Management';
  const showEnrollmentManagement = activeSidebar === 'Enrollment Management';

  return (
    <div className="flex min-h-screen" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-6 px-4 min-h-screen">
        <div className="text-2xl font-bold mb-8">School Admin</div>
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <button className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${activeSidebar === 'Dashboard' ? 'bg-blue-700' : 'hover:bg-blue-800'}`} onClick={() => handleSidebarClick('Dashboard')}>Dashboard</button>
            </li>
            <hr className="border-white mb-4" />
            <li className="mb-0">
              <div className="w-full text-left font-semibold text-lg px-2 py-1 rounded opacity-60 cursor-not-allowed select-none">User Management</div>
              <ul className="ml-6 mt-2">
                <li className="mb-1">
                  <button className={`w-full text-left text-base px-2 py-1 rounded transition-colors ${activeSidebar === 'User Management' && activeSubSidebar === 'Teacher Management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`} onClick={() => handleSubSidebarClick('User Management', 'Teacher Management')}>Teacher Management</button>
                </li>
                <li className="mb-1">
                  <button className={`w-full text-left text-base px-2 py-1 rounded transition-colors ${activeSidebar === 'User Management' && activeSubSidebar === 'Student Management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`} onClick={() => handleSubSidebarClick('User Management', 'Student Management')}>Student Management</button>
                </li>
              </ul>
            </li>
            <hr className="border-white mb-4 mt-2" />
            <li className="mb-4">
              <button className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${showClassSectionManagement ? 'bg-blue-700' : 'hover:bg-blue-800'}`} onClick={() => handleSidebarClick('Class & Section Management')}>Class & Section Management</button>
            </li>
            <hr className="border-white mb-4 mt-0" />
            <li className="mb-4">
              <button className={`w-full text-left font-semibold text-lg px-2 py-1 rounded transition-colors ${showEnrollmentManagement ? 'bg-blue-700' : 'hover:bg-blue-800'}`} onClick={() => handleSidebarClick('Enrollment Management')}>Enrollment Management</button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white/80 min-h-screen">
        {showTeacherManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Teacher Management</h1>
            {/* Filters + Table + Modal... replicate your previous structure */}
            {/* ... */}
          </div>
        ) : showStudentManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Student Management</h1>
            {/* Filters + Table + Modal */}
            {/* ... */}
          </div>
        ) : showClassSectionManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Class & Section Management</h1>
            {/* Table + Add/Edit Modal */}
            {/* ... */}
          </div>
        ) : showEnrollmentManagement ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Enrollment Management</h1>
            {/* Table + Enrollment Modal */}
            {/* ... */}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>
            <div className="flex gap-12 justify-center mb-12">
              {stats.map(stat => <InfoCard key={stat.title} {...stat} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
