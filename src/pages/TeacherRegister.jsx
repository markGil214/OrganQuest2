import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TeacherRegister = () => {
  // Extract token from hash URL: #teacher-register/:token
  const token = window.location.hash.split('/')[1];
  
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/verify-token/${token}`);
      const data = await response.json();

      if (data.success) {
        setTeacherInfo(data.data.teacher);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to verify registration token');
      console.error('Token verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/complete-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registrationToken: token,
          username: formData.username,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Registration completed successfully!');
        
        // Auto-login
        const loginResponse = await fetch(`${API_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });

        const loginData = await loginResponse.json();

        if (loginData.success && loginData.data && loginData.data.user) {
          localStorage.setItem('authToken', loginData.data.token);
          localStorage.setItem('userRole', loginData.data.user.role);
          localStorage.setItem('userId', loginData.data.user.id);
          
          toast.success('Registration completed! Logging you in...');
          
          // Navigate to teacher dashboard
          setTimeout(() => {
            window.location.hash = 'admin/dashboard';
            window.location.reload(); // Force reload to update app state
          }, 1000);
        } else {
          // If auto-login fails, redirect to login page
          toast.success('Please login with your new credentials');
          setTimeout(() => {
            window.location.hash = 'login';
          }, 2000);
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Verifying registration link...</div>
      </div>
    );
  }

  if (error && !teacherInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Registration Link</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.hash = 'login'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Complete Your Registration
          </h1>
          <p className="text-gray-600">Welcome to OrganQuest Learning Platform</p>
        </div>

        {/* Teacher Info */}
        {teacherInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">👤</span>
              Your Assignment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-semibold text-gray-800">{teacherInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{teacherInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade & Section</p>
                <p className="font-semibold text-gray-800">
                  {teacherInfo.assignedGrade} - Section {teacherInfo.section}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teacher Code</p>
                <p className="font-mono font-bold text-purple-600">{teacherInfo.teacherCode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Create Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username (min. 3 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              minLength={3}
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used to log in to your account
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Create Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min. 6 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              minLength={6}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Completing Registration...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            After registration, you'll be automatically logged in to your teacher dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
