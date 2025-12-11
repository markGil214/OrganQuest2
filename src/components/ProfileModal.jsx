import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import api from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const ProfileModal = ({ username, userAvatar, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'progress', 'about'
  const [quizResults, setQuizResults] = useState([]);
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

  // Fetch user info and quiz results
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
          const info = {
            fullName: data.fullName || '',
            username: data.username || username,
            age: data.age || '',
            grade: data.grade || ''
          };
          setUserInfo(info);
          setEditForm(info);
        }

        // Fetch quiz history
        const historyResponse = await api.getQuizHistory(token);
        if (historyResponse.success) {
          setQuizResults(historyResponse.data.quizResults || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const handleEditSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update-profile`, {
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
              onClick={() => setActiveTab('progress')}
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
                {quizResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No quiz data available yet</p>
                    <p className="text-sm mt-2">Take some quizzes to see your performance!</p>
                  </div>
                ) : (
                  <>
                    {/* Non-Timed Challenge Chart (Multiple Choice & Memory Matching) */}
                    {(() => {
                      const nonTimedResults = quizResults.filter(r => 
                        r.quizType !== 'timed-challenge'
                      );
                      if (nonTimedResults.length === 0) return null;
                      
                      return (
                        <div className="bg-white/70 rounded-xl p-4 shadow-md">
                          <h3 className="font-bold text-lg mb-4">📈 Quiz Performance Over Time</h3>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={(() => {
                              const sortedResults = [...nonTimedResults].sort((a, b) => {
                                const dateA = new Date(a.completedAt || a.timestamp || 0);
                                const dateB = new Date(b.completedAt || b.timestamp || 0);
                                return dateA - dateB;
                              });
                              
                              return sortedResults.map((result, index) => {
                                let scoreValue = 0;
                                if (result.percentage && result.percentage > 0) {
                                  scoreValue = result.percentage;
                                } else if (result.score !== undefined && result.totalQuestions) {
                                  scoreValue = Math.round((result.score / result.totalQuestions) * 100);
                                }
                                
                                return {
                                  attempt: index + 1,
                                  score: scoreValue,
                                  attemptLabel: `Attempt ${index + 1}`
                                };
                              });
                            })()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="attemptLabel" 
                                stroke="#6b7280"
                                tick={{ fontSize: 11 }}
                              />
                              <YAxis 
                                domain={[0, 100]} 
                                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                                stroke="#6b7280"
                                tick={{ fontSize: 11 }}
                              />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#9333ea" 
                                strokeWidth={3}
                                dot={{ fill: '#9333ea', r: 4 }}
                                name="Score"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                          <div className="mt-3 text-xs text-gray-600 text-center">
                            Showing {nonTimedResults.length} quiz attempts
                          </div>
                        </div>
                      );
                    })()}

                    {/* Timed Challenge Chart */}
                    {(() => {
                      const timedResults = quizResults.filter(r => 
                        r.quizType === 'timed-challenge'
                      );
                      if (timedResults.length === 0) return null;
                      
                      return (
                        <div className="bg-white/70 rounded-xl p-4 shadow-md">
                          <h3 className="font-bold text-lg mb-4">⏱️ Timed Challenge Performance</h3>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={(() => {
                              const sortedResults = [...timedResults].sort((a, b) => {
                                const dateA = new Date(a.completedAt || a.timestamp || 0);
                                const dateB = new Date(b.completedAt || b.timestamp || 0);
                                return dateA - dateB;
                              });
                              
                              return sortedResults.map((result, index) => {
                                let scoreValue = 0;
                                if (result.percentage && result.percentage > 0) {
                                  scoreValue = result.percentage;
                                } else if (result.score !== undefined && result.totalQuestions) {
                                  scoreValue = Math.round((result.score / result.totalQuestions) * 100);
                                }
                                const timeInSeconds = result.timeTaken || 0;
                                return {
                                  attempt: index + 1,
                                  score: scoreValue,
                                  time: timeInSeconds,
                                  attemptLabel: `Attempt ${index + 1}`
                                };
                              });
                            })()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="attemptLabel" 
                                stroke="#6b7280"
                                tick={{ fontSize: 11 }}
                              />
                              <YAxis 
                                yAxisId="left"
                                domain={[0, 100]} 
                                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                                stroke="#f97316"
                                tick={{ fontSize: 11 }}
                              />
                              <YAxis 
                                yAxisId="right"
                                orientation="right"
                                label={{ value: 'Time (s)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                                stroke="#8b5cf6"
                                tick={{ fontSize: 11 }}
                              />
                              <Legend />
                              <Line 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="score" 
                                stroke="#f97316" 
                                strokeWidth={3}
                                dot={{ fill: '#f97316', r: 4 }}
                                name="Score %"
                              />
                              <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="time" 
                                stroke="#8b5cf6" 
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6', r: 4 }}
                                name="Time (s)"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                          <div className="mt-3 text-xs text-gray-600 text-center">
                            Showing {timedResults.length} quiz attempts
                          </div>
                        </div>
                      );
                    })()}
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
