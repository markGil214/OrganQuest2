import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const SuperAdminPanel = ({ onBack }) => {
  const [admins, setAdmins] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    assignedGrade: '4th'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAdmins(data.data.admins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowCreateForm(false);
        setFormData({ fullName: '', username: '', password: '', assignedGrade: '4th' });
        fetchAdmins();
      } else {
        setError(data.message || 'Failed to create admin');
      }
    } catch (error) {
      setError('Error creating admin');
      console.error('Error creating admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchAdmins();
      } else {
        alert(data.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Error deleting admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Admin Management</h1>
            <p className="text-gray-600 mt-2">Manage admin accounts and permissions</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              ➕ Create New Admin
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Create Admin Form */}
        {showCreateForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Admin</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                  minLength="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                  minLength="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assigned Grade
                </label>
                <select
                  name="assignedGrade"
                  value={formData.assignedGrade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                  required
                >
                  <option value="4th">4th Grade</option>
                  <option value="5th">5th Grade</option>
                  <option value="6th">6th Grade</option>
                  <option value="all">All Grades</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? 'Creating...' : 'Create Admin'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError(null);
                    setFormData({ fullName: '', username: '', password: '', assignedGrade: '4th' });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Admins List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Accounts</h2>
          <div className="space-y-4">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                    {admin.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{admin.fullName}</div>
                    <div className="text-sm text-gray-600">@{admin.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {admin.role === 'superuser' ? (
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-bold">
                      ⭐ Superuser
                    </span>
                  ) : (
                    <>
                      <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {admin.assignedGrade === 'all' ? 'All Grades' : `${admin.assignedGrade} Grade`}
                      </span>
                      <Button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        🗑 Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No admin accounts found
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminPanel;
