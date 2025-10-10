# Node.js Backend Implementation Guide for OrganQuest

## 📋 Overview
This guide explains the Node.js backend implementation for OrganQuest, based on the RegisterPage.jsx data structure.

## 🏗️ Backend Architecture

### Tech Stack
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user data
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing (for future authentication)
- **express-validator**: Input validation middleware

## 📁 Project Structure

```
server/
├── server.js              # Main server entry point
├── package.json           # Server dependencies
├── .env                   # Environment variables (create from .env.example)
├── .env.example          # Environment template
├── models/
│   └── User.js           # User data model
├── routes/
│   ├── userRoutes.js     # User-related endpoints
│   ├── quizRoutes.js     # Quiz-related endpoints
│   └── progressRoutes.js # Progress tracking endpoints
└── middleware/
    └── auth.js           # Authentication middleware
```

## 📊 Database Schema

### User Model
Based on RegisterPage.jsx form data:
```javascript
{
  username: String (unique, required, 3-30 chars)
  age: Number (required, 1-120)
  avatar: Number (required, 1-4)
  language: String (enum: ['english', 'filipino', 'spanish', 'mandarin'])
  stats: {
    totalQuizzesTaken: Number
    totalScore: Number
    highScore: Number
    organsExplored: Number
  }
  organProgress: [{
    organName: String
    explored: Boolean
    exploredAt: Date
  }]
  quizResults: [{
    quizType: String
    score: Number
    totalQuestions: Number
    completedAt: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Setup Instructions

### 1. Install MongoDB
**Windows:**
```powershell
# Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb
```

**Start MongoDB:**
```powershell
# Start MongoDB service
net start MongoDB

# Or run manually:
mongod --dbpath="C:\data\db"
```

### 2. Install Server Dependencies
```powershell
cd server
npm install
```

### 3. Configure Environment
```powershell
# Copy the example env file
Copy-Item .env.example .env

# Edit .env with your configuration
notepad .env
```

**Update these values in .env:**
- `JWT_SECRET`: Generate a strong random string
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 5000)
- `CLIENT_URL`: Frontend URL (default: http://localhost:5173)

### 4. Start the Server
```powershell
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 🔌 API Endpoints

### User Endpoints

#### 1. Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "age": 25,
  "avatar": 1,
  "language": "english"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### 2. Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { user_data }
}
```

#### 3. Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "avatar": 2
}
```

#### 4. Get User Stats
```http
GET /api/users/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "stats": { ... },
    "totalQuizResults": 10,
    "exploredOrgans": 5
  }
}
```

### Quiz Endpoints

#### 1. Submit Quiz Result
```http
POST /api/quiz/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizType": "multiple-choice",
  "score": 85,
  "totalQuestions": 10
}

Response:
{
  "success": true,
  "message": "Quiz result submitted successfully",
  "data": {
    "currentScore": 85,
    "highScore": 95,
    "totalQuizzesTaken": 15
  }
}
```

#### 2. Get Quiz History
```http
GET /api/quiz/history
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "quizResults": [...],
    "stats": { ... }
  }
}
```

#### 3. Get Leaderboard
```http
GET /api/quiz/leaderboard?limit=10

Response:
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "username": "player1",
      "avatar": 1,
      "highScore": 150,
      "totalQuizzes": 20
    },
    ...
  ]
}
```

### Progress Endpoints

#### 1. Mark Organ as Explored
```http
POST /api/progress/organ
Authorization: Bearer <token>
Content-Type: application/json

{
  "organName": "heart"
}

Response:
{
  "success": true,
  "message": "Organ marked as explored",
  "data": {
    "organName": "heart",
    "totalExplored": 5,
    "totalOrgans": 15,
    "progressPercentage": 33
  }
}
```

#### 2. Get Organ Progress
```http
GET /api/progress/organs
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "organs": [...],
    "totalExplored": 5,
    "totalOrgans": 15,
    "progressPercentage": 33
  }
}
```

#### 3. Get Progress Summary
```http
GET /api/progress/summary
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "stats": { ... },
    "organProgress": { ... },
    "recentQuizzes": [...]
  }
}
```

## 🔐 Authentication

### How It Works
1. User registers → Server generates JWT token
2. Frontend stores token in `localStorage`
3. All protected endpoints require `Authorization: Bearer <token>` header
4. Token expires after 30 days

### Frontend Integration
```javascript
// Store token after registration
localStorage.setItem('authToken', token);

// Use token in API calls
const token = localStorage.getItem('authToken');
fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🔄 Frontend Integration

### Using the API Helper
```javascript
import api from '../lib/api';

// Register user
try {
  const response = await api.register({
    username: 'john_doe',
    age: 25,
    avatar: 1,
    language: 'english'
  });
  
  // Store token
  localStorage.setItem('authToken', response.data.token);
  localStorage.setItem('userData', JSON.stringify(response.data.user));
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Submit quiz
const token = localStorage.getItem('authToken');
await api.submitQuiz(token, {
  quizType: 'multiple-choice',
  score: 85,
  totalQuestions: 10
});

// Mark organ as explored
await api.markOrganExplored(token, 'heart');
```

## 🧪 Testing the API

### Using PowerShell
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get

# Register user
$body = @{
  username = "testuser"
  age = 25
  avatar = 1
  language = "english"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/users/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Using Postman
1. Import the API endpoints
2. Create a collection for OrganQuest
3. Test each endpoint with sample data

## 🏃‍♂️ Running Frontend + Backend Together

### Option 1: Two Terminals
```powershell
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server
npm run dev
```

### Option 2: Concurrently (Recommended)
Update root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev\" \"cd server && npm run dev\"",
    "dev:frontend": "vite",
    "dev:backend": "cd server && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Install and run:
```powershell
npm install concurrently --save-dev
npm run dev
```

## 🐛 Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```powershell
net start MongoDB
# or
mongod --dbpath="C:\data\db"
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill the process
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Error
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:** Check `CLIENT_URL` in server `.env` matches your frontend URL

## 📝 Next Steps

1. **Add Password Authentication**: Implement login/logout functionality
2. **Add Password Reset**: Email-based password reset
3. **Rate Limiting**: Prevent API abuse
4. **Data Validation**: Add more robust validation
5. **File Uploads**: Allow custom avatar uploads
6. **Real-time Features**: Add WebSocket for live leaderboard updates
7. **Caching**: Implement Redis for faster responses
8. **Deployment**: Deploy to Heroku, Railway, or DigitalOcean

## 🔗 Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [JWT.io](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Need Help?** Check the server logs for detailed error messages. Most issues are related to MongoDB connection or environment configuration.
