import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';

const SuperAdminPanel = ({ onBack }) => {
  const toast = useToast();
  const [classes, setClasses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    assignedGrade: '4th',
    section: 'A'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';

  // Get occupied grade-section combinations
  const getOccupiedCombinations = () => {
    return classes.map(cls => `${cls.assignedGrade}-${cls.section}`);
  };

  // Check if a grade-section combination is available
  const isCombinationAvailable = (grade, section) => {
    const occupied = getOccupiedCombinations();
    return !occupied.includes(`${grade}-${section}`);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success && data.data && Array.isArray(data.data.classes)) {
        setClasses(data.data.classes);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'assignedGrade') {
      // Auto-select first available section when grade changes
      const sections = ['A', 'B', 'C'];
      const availableSection = sections.find(sec => isCombinationAvailable(value, sec));
      
      setFormData(prev => ({
        ...prev,
        assignedGrade: value,
        section: availableSection || prev.section
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if combination is available
    if (!isCombinationAvailable(formData.assignedGrade, formData.section)) {
      setError(`${formData.assignedGrade} Grade Section ${formData.section} already has a teacher assigned`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/create-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Class created successfully!');
        setShowCreateForm(false);
        setFormData({ fullName: '', email: '', username: '', password: '', assignedGrade: '4th', section: 'A' });
        fetchClasses();
      } else {
        setError(data.message || 'Failed to create class');
      }
    } catch (error) {
      setError('Error creating class');
      console.error('Error creating class:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!confirm('Are you sure you want to delete this class? This will remove the teacher assignment.')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/classes/${classId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Class deleted successfully');
        fetchClasses();
      } else {
        toast.error(data.message || 'Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Error deleting class');
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundImage: 'url(/school/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Class Management</h1>
            <p className="text-gray-600 mt-2">Manage classes and assign teachers</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              ➕ Add Class
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Add Class Form */}
        {showCreateForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Class</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teacher Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                    placeholder="teacher@school.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="teacher_username"
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
                    placeholder="Min. 6 characters"
                    minLength="6"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                    required
                  >
                    <option value="A" disabled={!isCombinationAvailable(formData.assignedGrade, 'A')}>
                      Section A {!isCombinationAvailable(formData.assignedGrade, 'A') && '(Occupied)'}
                    </option>
                    <option value="B" disabled={!isCombinationAvailable(formData.assignedGrade, 'B')}>
                      Section B {!isCombinationAvailable(formData.assignedGrade, 'B') && '(Occupied)'}
                    </option>
                    <option value="C" disabled={!isCombinationAvailable(formData.assignedGrade, 'C')}>
                      Section C {!isCombinationAvailable(formData.assignedGrade, 'C') && '(Occupied)'}
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? 'Creating Class...' : 'Add Class'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError(null);
                    setFormData({ fullName: '', email: '', username: '', password: '', assignedGrade: '4th', section: 'A' });
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

        {/* Classes List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Classes</h2>
          <div className="space-y-4">
            {!classes || classes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No classes found</p>
                <p className="text-sm mt-2">Add a new class to get started</p>
              </div>
            ) : (
              classes.map((classItem) => (
              <div
                key={classItem._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                    {classItem.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{classItem.fullName}</div>
                    <div className="text-sm text-gray-600">@{classItem.username}</div>
                    {classItem.email && (
                      <div className="text-xs text-blue-600 mt-1">
                        📧 {classItem.email}
                      </div>
                    )}
                    {classItem.teacherCode && (
                      <div className="text-xs text-purple-600 font-mono mt-1">
                        Code: {classItem.teacherCode}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {classItem.assignedGrade} Grade
                  </span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Section {classItem.section}
                  </span>
                  <Button
                    onClick={() => handleDeleteClass(classItem._id)}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    🗑 Delete
                  </Button>
                </div>
              </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminPanel;
