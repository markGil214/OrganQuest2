import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getPerformanceMessage, formatTime, getBadgeInfo } from '../lib/quizUtils';

const QuizResultsPage = ({ 
  score, 
  totalQuestions, 
  percentage, 
  timeTaken, 
  answers = [], 
  attemptNumber,
  remainingAttempts,
  newBadges = [],
  isTeacherMode = false,
  teacherName,
  onRetry, 
  onBack 
}) => {
  const performanceMsg = getPerformanceMessage(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <Card className="p-8 mb-6 text-center bg-white/95 backdrop-blur-sm">
          <div className="text-6xl mb-4">{performanceMsg.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className={`text-2xl font-semibold mb-6 ${performanceMsg.color}`}>
            {performanceMsg.message}
          </p>

          {/* Teacher Mode Notification */}
          {isTeacherMode && (
            <div className="bg-blue-50 p-4 rounded-xl mb-6 border-2 border-blue-200">
              <div className="text-lg font-semibold text-blue-800">
                ✅ Score submitted to {teacherName || 'your teacher'}
              </div>
              <div className="text-sm text-blue-600 mt-1">
                Your teacher can now see your results
              </div>
            </div>
          )}
          
          {/* Score Display */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Score</div>
              <div className="text-3xl font-bold text-blue-600">{score}/{totalQuestions}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Percentage</div>
              <div className="text-3xl font-bold text-green-600">{percentage}%</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Time</div>
              <div className="text-3xl font-bold text-purple-600">
                {timeTaken ? formatTime(timeTaken) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Attempt Info */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="text-sm text-gray-600">
              Attempt {attemptNumber} of 3 • {remainingAttempts} attempts remaining
            </div>
            {remainingAttempts === 0 && (
              <div className="text-red-600 font-semibold mt-2">
                ⚠️ Maximum attempts reached. Contact your teacher to reset.
              </div>
            )}
          </div>

          {/* New Badges */}
          {newBadges.length > 0 && (
            <div className="bg-yellow-50 p-6 rounded-xl mb-6 border-2 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎉 New Badges Earned!</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {newBadges.map((badge, index) => {
                  const badgeInfo = getBadgeInfo(badge.badgeId);
                  return (
                    <div key={index} className={`${badgeInfo.color} text-white px-4 py-2 rounded-lg flex items-center gap-2`}>
                      <span className="text-2xl">{badgeInfo.icon}</span>
                      <span className="font-semibold">{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Detailed Answers */}
        {answers.length > 0 && (
          <Card className="p-6 mb-6 bg-white/95 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Review Your Answers</h2>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    answer.isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {answer.isCorrect ? '✅' : '❌'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-2">
                        {index + 1}. {answer.question}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                          <span className="font-medium">Your answer:</span> {answer.selectedAnswer}
                        </div>
                        {!answer.isCorrect && (
                          <div className="text-green-700">
                            <span className="font-medium">Correct answer:</span> {answer.correctAnswer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {remainingAttempts > 0 && (
            <Button
              onClick={onRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
            >
              🔄 Try Again ({remainingAttempts} left)
            </Button>
          )}
          <Button
            onClick={onBack}
            variant="outline"
            className="px-8 py-3 text-lg border-2 border-white text-white hover:bg-white hover:text-purple-600"
          >
            ← Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;
