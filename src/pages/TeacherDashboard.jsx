import React, { useState } from 'react';

const sidebarItems = [
  {
    title: 'Dashboard',
    description: 'Overview of your classes',
  },
  {
    title: 'Classes',
    description: 'Manage your assigned classes',
  },
];

const InfoCard = ({ title, value }) => (
  <div className="flex flex-col items-center justify-center bg-blue-700 text-white rounded-xl shadow-lg p-8 min-w-[220px] min-h-[160px]">
    <div className="text-5xl font-extrabold mb-4">{value}</div>
    <div className="text-xl font-semibold">{title}</div>
  </div>
);

const TeacherDashboard = () => {
  // Sidebar active state
  const [activeSidebar, setActiveSidebar] = useState('Dashboard');

  const handleSidebarClick = (title) => {
    setActiveSidebar(title);
  };

  // Teacher's assigned classes data
  const [classes, setClasses] = useState([
    {
      id: 1,
      grade: 'Grade 7',
      section: 'A',
      subject: 'Math',
      students: [
        { id: '25-0001-stud', name: 'Juan Dela Cruz', dob: '2010-05-15', gender: 'Male', status: 'Active' },
        { id: '25-0002-stud', name: 'Maria Santos', dob: '2010-08-20', gender: 'Female', status: 'Active' },
        { id: '25-0003-stud', name: 'Carlos Reyes', dob: '2009-11-02', gender: 'Male', status: 'Pending' },
      ],
    },
    {
      id: 2,
      grade: 'Grade 8',
      section: 'B',
      subject: 'Science',
      students: [
        { id: '25-0004-stud', name: 'Rosa Garcia', dob: '2009-03-10', gender: 'Female', status: 'Active' },
        { id: '25-0005-stud', name: 'Miguel Torres', dob: '2009-07-25', gender: 'Male', status: 'Active' },
      ],
    },
  ]);

  // Student Management state
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Student filters and search state
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');
  const [searchStudentName, setSearchStudentName] = useState('');
  const [studentSortBy, setStudentSortBy] = useState('name');

  // Dashboard stats
  const stats = [
    { title: 'Classes Assigned', value: classes.length },
    { title: 'Total Students', value: classes.reduce((sum, cls) => sum + cls.students.length, 0) },
    { title: 'Pending Activation', value: classes.reduce((sum, cls) => sum + cls.students.filter(s => s.status === 'Pending').length, 0) },
  ];

  // Navigate to student view for a specific class
  const handleViewStudents = (classId) => {
    setSelectedClassId(classId);
  };

  // Go back to classes list
  const handleBackToClasses = () => {
    setSelectedClassId(null);
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

  const showClassesView = activeSidebar === 'Classes';

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
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white/80 min-h-screen">
        {showClassesView ? (
          selectedClassId ? (
            // Student Management View
            <div>
              {(() => {
                const currentClass = classes.find(c => c.id === selectedClassId);
                if (!currentClass) return null;

                return (
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
                          {currentClass.grade} - Section {currentClass.section} ({currentClass.subject})
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
                          {(() => {
                            const filteredStudents = currentClass.students
                              .filter(s =>
                                (studentStatusFilter === 'All' || s.status === studentStatusFilter) &&
                                s.name.toLowerCase().includes(searchStudentName.toLowerCase())
                              )
                              .sort((a, b) => {
                                if (studentSortBy === 'name') return a.name.localeCompare(b.name);
                                if (studentSortBy === 'id') return a.id.localeCompare(b.id);
                                if (studentSortBy === 'status') return a.status.localeCompare(b.status);
                                return 0;
                              });
                            return (
                              <>
                                {filteredStudents.map((student) => (
                            <tr key={student.id}>
                              <td className="px-4 py-2 border-b font-mono text-sm">{student.id}</td>
                              <td className="px-4 py-2 border-b">{student.name}</td>
                              <td className="px-4 py-2 border-b">{student.dob}</td>
                              <td className="px-4 py-2 border-b">{student.gender}</td>
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
                                  className="bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700"
                                  onClick={() => handleToggleStudentStatus(currentClass.id, student.id)}
                                >
                                  {student.status === 'Active' ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                                  onClick={() => handleRemoveStudent(currentClass.id, student.id)}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                                {filteredStudents.length === 0 && (
                                  <tr>
                                    <td colSpan="7" className="px-4 py-2 border-b text-center text-gray-500">
                                      No students found
                                    </td>
                                  </tr>
                                )}
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
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
                    {classes.map((cls) => (
                      <tr key={cls.id}>
                        <td className="px-4 py-2 border-b">{cls.grade}</td>
                        <td className="px-4 py-2 border-b">{cls.section}</td>
                        <td className="px-4 py-2 border-b">{cls.subject}</td>
                        <td className="px-4 py-2 border-b">{cls.students.length}</td>
                        <td className="px-4 py-2 border-b flex gap-2">
                          <button
                            className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 text-xs"
                            onClick={() => handleViewStudents(cls.id)}
                          >
                            View Students / Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-10">Teacher Dashboard</h1>
            <div className="flex gap-12 justify-center mb-12">
              {stats.map((stat) => (
                <InfoCard key={stat.title} {...stat} />
              ))}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
              <p className="text-gray-700 mb-2">You have <strong>{classes.length}</strong> classes assigned to you.</p>
              <p className="text-gray-700 mb-2">Total of <strong>{classes.reduce((sum, cls) => sum + cls.students.length, 0)}</strong> students across all your classes.</p>
              <p className="text-gray-700">
                <strong>{classes.reduce((sum, cls) => sum + cls.students.filter(s => s.status === 'Pending').length, 0)}</strong> students are pending activation.
              </p>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};

export default TeacherDashboard;
