import React from 'react';

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

  return (
    <div className="flex min-h-screen" style={{ backgroundImage: 'url(/school/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-6 px-4 min-h-screen">
        <div className="text-2xl font-bold mb-8">School Admin</div>
        <nav className="flex-1">
          <ul>
            {sidebarItems.map((item, idx) => (
              <li key={item.title} className="mb-4">
                <div className="font-semibold text-lg">{item.title}</div>
                {item.subItems && (
                  <ul className="ml-6 mt-2">
                    {item.subItems.map((sub, subIdx) => (
                      <li key={sub.title} className="text-base mb-1">{sub.title}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Panel note removed */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white/80 min-h-screen">
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

        {/* Panel note removed */}
      </main>
    </div>
  );
};

export default AdminDashboard;