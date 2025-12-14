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
    { id: 1, name: 'Mr. Smith', email: 'smith@example.com', status: 'Pending' },
    { id: 2, name: 'Ms. Lee', email: 'lee@example.com', status: 'Active' },
  ]);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '' });

  const handleInputChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email) return;
    setTeachers([
      ...teachers,
      { id: Date.now(), name: newTeacher.name, email: newTeacher.email, status: 'Pending' },
    ]);
    setNewTeacher({ name: '', email: '' });
  };

  const handleActivate = (id) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'Pending' : 'Active' } : t));
  };

  const handleSendActivation = (id) => {
    // Simulate sending activation email
    alert('Activation email sent!');
  };

  const showTeacherManagement = activeSidebar === 'User Management' && activeSubSidebar === 'Teacher Management';

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
            <form onSubmit={handleAddTeacher} className="mb-8 flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newTeacher.name}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 w-48"
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
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 w-64"
                  placeholder="Enter teacher email"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Add Teacher</button>
            </form>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Name</th>
                    <th className="px-4 py-2 border-b text-left">Email</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-4 py-2 border-b">{teacher.name}</td>
                      <td className="px-4 py-2 border-b">{teacher.email}</td>
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
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;