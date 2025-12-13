import React from 'react';
import { Card } from './Card';

const AdminSidebar = ({ analytics, classes = [], students = [], notifications = [] }) => {
  const totalStudents = analytics?.totalStudents ?? students.length ?? 0;
  const totalTeachers = classes.length;
  const totalClasses = classes.length;

  const recentClasses = [...classes]
    .sort((a, b) => new Date(b.createdAt || b.createdAt) - new Date(a.createdAt || a.createdAt))
    .slice(0, 5);

  const pendingTeachers = classes.filter(c => c.accountStatus === 'pending').slice(0, 5);

  return (
    <aside className="hidden md:block w-64 fixed left-6 top-24 z-40">
      <div className="space-y-4">
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-3">Admin Overview</h4>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Students</div>
                <div className="text-2xl font-bold">{totalStudents}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Teachers</div>
                <div className="text-2xl font-bold">{totalTeachers}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Classes</div>
                <div className="text-2xl font-bold">{totalClasses}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-3">Recent Activities</h4>
          <div className="text-sm text-gray-600 mb-2">Newly created classes</div>
          <ul className="space-y-2 mb-3">
            {recentClasses.length === 0 ? (
              <li className="text-xs text-gray-400">No recent classes</li>
            ) : (
              recentClasses.map(rc => (
                <li key={rc._id} className="text-sm">
                  <div className="font-medium">{rc.fullName || 'Teacher'}</div>
                  <div className="text-xs text-gray-500">{rc.assignedGrade} Grade · Section {rc.assignedSection || '-'}</div>
                </li>
              ))
            )}
          </ul>

          <div className="text-sm text-gray-600 mb-2">Pending teacher activations</div>
          <ul className="space-y-2">
            {pendingTeachers.length === 0 ? (
              <li className="text-xs text-gray-400">No pending activations</li>
            ) : (
              pendingTeachers.map(p => (
                <li key={p._id} className="text-sm">
                  <div className="font-medium">{p.fullName}</div>
                  <div className="text-xs text-gray-500">{p.assignedGrade} · {p.assignedSection || '-'}</div>
                </li>
              ))
            )}
          </ul>
        </Card>

        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-3">System Notifications</h4>
          {notifications && notifications.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {notifications.map((n, idx) => (
                <li key={idx} className="text-sm">{n}</li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-gray-400">No notifications</div>
          )}
        </Card>
      </div>
    </aside>
  );
};

export default AdminSidebar;
