import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import api from '../lib/api';

const ProfileModal = ({ username, userAvatar, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'info', 'progress', 'about'
  const [stats, setStats] = useState({
    quizzesTaken: 0,
    averageScore: 0,
    highScore: 0
  });
  const [quizAnalytics, setQuizAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    username: '',
    age: '',
    grade: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    username: '',
    age: '',
    grade: ''
  });
  const [saving, setSaving] = useState(false);

  // Fetch user stats and info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await api.getStats(token);
        if (response.success) {
          const data = response.data;
          setStats({
            quizzesTaken: data.stats.quizzesTaken || 0,
            averageScore: data.stats.averageScore || 0,
            highScore: data.stats.highScore || 0
          });
          const info = {
            fullName: data.fullName || '',
            username: data.username || username,
            age: data.age || '',
            grade: data.grade || ''
          };
          setUserInfo(info);
          setEditForm(info);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  // Fetch quiz analytics for progress view
  const fetchQuizAnalytics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/my-progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setQuizAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleEditSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully!');
        setUserInfo(editForm);
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    onClose();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '#home';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50 border-0">
        <DialogHeader>
          <DialogTitle className="sr-only">Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img src={userAvatar} alt={`${username}'s avatar`} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-pulse" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-800">{userInfo.fullName || username}</h2>
              <p className="text-xs text-purple-600 font-medium">@{userInfo.username}</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 px-4 border-b border-purple-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                activeTab === 'profile' 
                  ? "text-purple-600 border-b-2 border-purple-600" 
                  : "text-gray-600 hover:text-purple-600"
              )}
            >
              📊 Stats
            </button>
            <button
              onClick={() => {
                setActiveTab('info');
                setIsEditing(false);
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                activeTab === 'info' 
                  ? "text-purple-600 border-b-2 border-purple-600" 
                  : "text-gray-600 hover:text-purple-600"
              )}
            >
              👤 My Info
            </button>
            <button
              onClick={() => {
                setActiveTab('progress');
                fetchQuizAnalytics();
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                activeTab === 'progress' 
                  ? "text-purple-600 border-b-2 border-purple-600" 
                  : "text-gray-600 hover:text-purple-600"
              )}
            >
              📈 Progress
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                activeTab === 'about' 
                  ? "text-purple-600 border-b-2 border-purple-600" 
                  : "text-gray-600 hover:text-purple-600"
              )}
            >
              ℹ️ About
            </button>
          </div>

          {/* Tab Content */}
          <div className="px-4 min-h-[200px]">
            {/* Stats Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-3">
                <div className="p-4 bg-white/70 rounded-xl shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quizzes Taken</span>
                    <span className="text-2xl font-bold text-purple-600">{stats.quizzesTaken}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/70 rounded-xl shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="text-2xl font-bold text-purple-600">{stats.averageScore}%</span>
                  </div>
                </div>
                <div className="p-4 bg-white/70 rounded-xl shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">High Score</span>
                    <span className="text-2xl font-bold text-purple-600">{stats.highScore}</span>
                  </div>
                </div>
              </div>
            )}

            {/* My Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="p-4 bg-white/70 rounded-xl shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg">Personal Information</h3>
                        <Button
                          onClick={() => setIsEditing(true)}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          ✏️ Edit
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Full Name</label>
                          <p className="text-base font-semibold text-gray-800">{userInfo.fullName || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Username</label>
                          <p className="text-base font-semibold text-gray-800">@{userInfo.username}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Age</label>
                            <p className="text-base font-semibold text-gray-800">{userInfo.age || 'Not set'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Grade Level</label>
                            <p className="text-base font-semibold text-gray-800">{userInfo.grade || 'Not set'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-white/70 rounded-xl shadow-md space-y-4">
                      <h3 className="font-bold text-lg">Edit Information</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                          <input
                            type="number"
                            value={editForm.age}
                            onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                          <select
                            value={editForm.grade}
                            onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select grade</option>
                            <option value="4th">4th Grade</option>
                            <option value="5th">5th Grade</option>
                            <option value="6th">6th Grade</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleEditSubmit}
                          disabled={saving}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          {saving ? 'Saving...' : '💾 Save Changes'}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm(userInfo);
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-4">
                {!quizAnalytics ? (
                  <p className="text-center text-gray-500">Loading analytics...</p>
                ) : (
                  <>
                    <h3 className="font-bold text-lg">Your Quiz Performance</h3>
                    {Object.entries(quizAnalytics.quizTypeStats || {}).map(([quizType, data]) => (
                      <div key={quizType} className="p-4 bg-white/70 rounded-xl shadow-md">
                        <h4 className="font-semibold capitalize mb-2">{quizType}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Average: </span>
                            <span className="font-bold text-purple-600">{data.averageScore?.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Best: </span>
                            <span className="font-bold text-green-600">{data.highestScore}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Attempts: </span>
                            <span className="font-bold">{data.totalAttempts}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Completion: </span>
                            <span className="font-bold">{data.completionRate?.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className="p-4 bg-white/70 rounded-xl shadow-md">
                  <h3 className="font-bold text-lg mb-2">🎓 OrganQuest</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    An interactive anatomy learning platform designed to make studying human organs fun and engaging.
                  </p>
                  <h4 className="font-semibold text-sm mb-1">Created by:</h4>
                  <p className="text-sm text-purple-600 font-medium">OrganQuest Development Team</p>
                  <p className="text-xs text-gray-500 mt-2">Version 2.0 © 2025</p>
                </div>
                <div className="p-4 bg-white/70 rounded-xl shadow-md">
                  <h4 className="font-semibold text-sm mb-2">Features:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Interactive 3D organ models</li>
                    <li>✓ AR scanning & exploration</li>
                    <li>✓ Multiple quiz modes</li>
                    <li>✓ Progress tracking</li>
                    <li>✓ Educational games</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="px-4 pt-2">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full text-sm font-semibold gap-2"
            >
              <span className="text-lg">🚪</span>
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
