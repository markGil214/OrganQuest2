// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com/api';

// API helper functions
export const api = {
  // User endpoints
  async register(userData) {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  },

  async getProfile(token) {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    
    return data;
  },

  async updateProfile(token, updates) {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    
    return data;
  },

  async getStats(token) {
    const response = await fetch(`${API_URL}/users/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stats');
    }
    
    return data;
  },

  // Quiz endpoints
  async submitQuiz(token, quizData) {
    const response = await fetch(`${API_URL}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(quizData),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit quiz');
    }
    
    return data;
  },

  async getQuizHistory(token) {
    const response = await fetch(`${API_URL}/quiz/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch quiz history');
    }
    
    return data;
  },

  async getLeaderboard(limit = 10) {
    const response = await fetch(`${API_URL}/quiz/leaderboard?limit=${limit}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch leaderboard');
    }
    
    return data;
  },

  // Progress endpoints
  async markOrganExplored(token, organName) {
    const response = await fetch(`${API_URL}/progress/organ`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ organName }),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark organ as explored');
    }
    
    return data;
  },

  async getOrganProgress(token) {
    const response = await fetch(`${API_URL}/progress/organs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch organ progress');
    }
    
    return data;
  },

  async getProgressSummary(token) {
    const response = await fetch(`${API_URL}/progress/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch progress summary');
    }
    
    return data;
  },

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  },
};

export default api;
