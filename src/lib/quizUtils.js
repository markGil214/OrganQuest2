// Quiz utility functions

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Randomize quiz questions
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Randomized questions
 */
export const randomizeQuestions = (questions) => {
  return shuffleArray(questions);
};

/**
 * Randomize answer choices for a question
 * @param {Object} question - Question object with choices array
 * @returns {Object} - Question with randomized choices
 */
export const randomizeAnswers = (question) => {
  if (!question.choices || !Array.isArray(question.choices)) {
    return question;
  }
  
  return {
    ...question,
    choices: shuffleArray(question.choices)
  };
};

/**
 * Randomize all questions and their answer choices
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Fully randomized questions
 */
export const randomizeQuiz = (questions) => {
  const shuffledQuestions = randomizeQuestions(questions);
  return shuffledQuestions.map(q => randomizeAnswers(q));
};

/**
 * Format time in seconds to MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate quiz percentage
 * @param {number} score - Correct answers
 * @param {number} total - Total questions
 * @returns {number} - Percentage score
 */
export const calculatePercentage = (score, total) => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};

/**
 * Get badge icon and color
 * @param {string} badgeId - Badge identifier
 * @returns {Object} - Icon and color for badge
 */
export const getBadgeInfo = (badgeId) => {
  const badges = {
    'first-quiz': { icon: '🎯', color: 'bg-blue-500', name: 'First Steps' },
    'perfect-score': { icon: '⭐', color: 'bg-yellow-500', name: 'Perfect Score' },
    'quiz-master': { icon: '👑', color: 'bg-purple-500', name: 'Quiz Master' },
    'speed-demon': { icon: '⚡', color: 'bg-red-500', name: 'Speed Demon' },
    'all-types': { icon: '🏆', color: 'bg-green-500', name: 'Well Rounded' }
  };
  
  return badges[badgeId] || { icon: '🎖️', color: 'bg-gray-500', name: 'Achievement' };
};

/**
 * Get performance message based on score percentage
 * @param {number} percentage - Score percentage
 * @returns {Object} - Message and emoji
 */
export const getPerformanceMessage = (percentage) => {
  if (percentage === 100) {
    return { message: 'Perfect! You are a master!', emoji: '🏆', color: 'text-yellow-600' };
  } else if (percentage >= 80) {
    return { message: 'Excellent work!', emoji: '⭐', color: 'text-green-600' };
  } else if (percentage >= 60) {
    return { message: 'Good job!', emoji: '👍', color: 'text-blue-600' };
  } else if (percentage >= 40) {
    return { message: 'Keep practicing!', emoji: '💪', color: 'text-orange-600' };
  } else {
    return { message: 'Try again! You can do it!', emoji: '📚', color: 'text-red-600' };
  }
};

/**
 * Generate quiz difficulty based on grade level
 * @param {string} grade - Student grade (4th, 5th, 6th)
 * @param {Array} questions - All available questions
 * @returns {Array} - Filtered questions by difficulty
 */
export const filterQuestionsByGrade = (grade, questions) => {
  if (!questions || questions.length === 0) return questions;
  
  // If questions don't have grade level, return all
  if (!questions[0].gradeLevel) return questions;
  
  return questions.filter(q => 
    !q.gradeLevel || 
    q.gradeLevel.includes(grade) || 
    q.gradeLevel.includes('all')
  );
};
