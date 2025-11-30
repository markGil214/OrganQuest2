// API configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'https://organquest2.onrender.com';
const API_URL = `${BASE_URL}/api`;
const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

// Helper function to add timeout to fetch requests
const fetchWithTimeout = async (url, options = {}, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server may be waking up. Please try again in a moment.');
    }
    throw error;
  }
};

// API helper functions
export const api = {
  // User endpoints
  async register(userData) {
    console.log('Sending registration data:', userData);
    const response = await fetchWithTimeout(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }, 60000); // 60 seconds for registration (includes cold start)
    const data = await response.json();
    console.log('Registration response:', data);
    
    if (!response.ok) {
      // Check for validation errors
      if (data.errors && data.errors.length > 0) {
        const errorMessages = data.errors.map(err => err.msg).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  },

  async login(credentials) {
    console.log('Attempting login for:', credentials.username);
    const response = await fetchWithTimeout(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }, 60000); // 60 seconds for login (includes cold start)
    const data = await response.json();
    console.log('Login response:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
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
    const response = await fetchWithTimeout(`${API_URL}/quiz/submit`, {
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

  async getQuizAttempts(token, quizType) {
    const response = await fetchWithTimeout(`${API_URL}/quiz/attempts/${quizType}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch quiz attempts');
    }
    
    return data;
  },

  async getQuizHistory(token) {
    const response = await fetchWithTimeout(`${API_URL}/quiz/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  },
};

export default api;
