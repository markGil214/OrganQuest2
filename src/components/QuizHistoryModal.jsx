import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import api from '../lib/api';
import { formatTime, getBadgeInfo } from '../lib/quizUtils';

const QuizHistoryModal = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuizType, setSelectedQuizType] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await api.getQuizHistory(token);
      if (response.success) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getQuizTypeDisplay = (type) => {
    const types = {
      'multiple-choice': { name: 'Multiple Choice', icon: '📝', color: 'bg-blue-500' },
      'timed-challenge': { name: 'Timed Challenge', icon: '⏱️', color: 'bg-red-500' },
      'memory-matching': { name: 'Memory Match', icon: '🧩', color: 'bg-purple-500' }
    };
    return types[type] || { name: type, icon: '❓', color: 'bg-gray-500' };
  };

  const filteredResults = history?.quizResults.filter(result =>
    selectedQuizType === 'all' || result.quizType === selectedQuizType
  ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-800">📊 Quiz History</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <div className="text-gray-600">Loading your quiz history...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-blue-600">{history?.stats.totalQuizzesTaken || 0}</div>
                <div className="text-sm text-gray-600">Total Quizzes</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-yellow-600">{history?.stats.highScore || 0}</div>
                <div className="text-sm text-gray-600">High Score</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-purple-600">{history?.badges?.length || 0}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
            </div>

            {/* Badges */}
            {history?.badges && history.badges.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🎖️ Your Badges</h3>
                <div className="flex flex-wrap gap-3">
                  {history.badges.map((badge, index) => {
                    const badgeInfo = getBadgeInfo(badge.badgeId);
                    return (
                      <div
                        key={index}
                        className={`${badgeInfo.color} text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md`}
                      >
                        <span className="text-2xl">{badgeInfo.icon}</span>
                        <div>
                          <div className="font-bold text-sm">{badge.name}</div>
                          <div className="text-xs opacity-90">
                            {new Date(badge.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedQuizType('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedQuizType === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                All Quizzes
              </button>
              {['multiple-choice', 'timed-challenge', 'memory-matching'].map(type => {
                const typeInfo = getQuizTypeDisplay(type);
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedQuizType(type)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedQuizType === type
                        ? `${typeInfo.color} text-white`
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {typeInfo.icon} {typeInfo.name}
                  </button>
                );
              })}
            </div>

            {/* Quiz Performance Over Time */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Quiz Performance Over Time</h3>
              <div className="grid grid-cols-3 gap-4">
                {['multiple-choice', 'timed-challenge', 'memory-matching'].map(type => {
                  const typeInfo = getQuizTypeDisplay(type);
                  const quizzesOfType = history?.quizResults?.filter(q => q.quizType === type) || [];
                  const totalAttempts = quizzesOfType.length;
                  const avgScore = totalAttempts > 0
                    ? (quizzesOfType.reduce((sum, q) => sum + (q.percentage || 0), 0) / totalAttempts).toFixed(1)
                    : 0;
                  
                  return (
                    <div key={type} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`${typeInfo.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-lg`}>
                          {typeInfo.icon}
                        </span>
                        <span className="font-bold text-gray-800 text-sm">{typeInfo.name}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">📊 Total Attempts:</span>
                          <span className="font-bold text-gray-800">{totalAttempts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">⭐ Overall Avg:</span>
                          <span className="font-bold text-purple-600">{avgScore}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz Results List */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">Recent Attempts</h3>
              {filteredResults.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl">
                  <div className="text-4xl mb-2">📭</div>
                  <div className="text-gray-600">No quiz history found</div>
                </div>
              ) : (
                filteredResults.map((result, index) => {
                  const typeInfo = getQuizTypeDisplay(result.quizType);
                  const percentage = result.percentage || Math.round((result.score / result.totalQuestions) * 100);
                  
                  return (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`${typeInfo.color} text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                            {typeInfo.icon}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{typeInfo.name}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(result.completedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Score</div>
                            <div className="text-xl font-bold text-gray-800">
                              {result.score}/{result.totalQuestions}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Percentage</div>
                            <div className={`text-xl font-bold ${
                              percentage >= 80 ? 'text-green-600' :
                              percentage >= 60 ? 'text-blue-600' :
                              percentage >= 40 ? 'text-orange-600' :
                              'text-red-600'
                            }`}>
                              {percentage}%
                            </div>
                          </div>
                          {result.timeTaken && (
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Time</div>
                              <div className="text-lg font-semibold text-purple-600">
                                {formatTime(result.timeTaken)}
                              </div>
                            </div>
                          )}
                          {result.attemptNumber && (
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Attempt</div>
                              <div className="text-lg font-semibold text-indigo-600">
                                #{result.attemptNumber}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Attempt Info */}
            {history?.attempts && history.attempts.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">⚠️ Remaining Attempts</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['multiple-choice', 'timed-challenge', 'memory-matching'].map(type => {
                    const attemptInfo = history.attempts.find(a => a.quizType === type);
                    const typeInfo = getQuizTypeDisplay(type);
                    const remaining = attemptInfo 
                      ? attemptInfo.maxAttempts - attemptInfo.attemptCount 
                      : 3;
                    
                    return (
                      <div key={type} className="bg-white p-3 rounded-lg text-center">
                        <div className="text-xl mb-1">{typeInfo.icon}</div>
                        <div className="text-sm text-gray-600 mb-1">{typeInfo.name}</div>
                        <div className={`text-lg font-bold ${
                          remaining === 0 ? 'text-red-600' : 
                          remaining === 1 ? 'text-orange-600' : 
                          'text-green-600'
                        }`}>
                          {remaining}/3
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 text-lg"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizHistoryModal;
