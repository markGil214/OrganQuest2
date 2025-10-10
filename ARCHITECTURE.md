# 🏗️ OrganQuest System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite)                    │
│                        http://localhost:5173                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Home.jsx   │  │RegisterPage  │  │ MainMenu.jsx │              │
│  │              │→ │    .jsx      │→ │              │              │
│  │ Landing Page │  │              │  │ Main Hub     │              │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘              │
│                            │                 │                       │
│                            │                 ↓                       │
│                            │    ┌────────────────────┐              │
│                            │    │  ProfileModal.jsx  │              │
│                            │    │  (User Stats)      │              │
│                            │    └────────────────────┘              │
│                            │                                         │
│                            ↓                                         │
│                   ┌─────────────────┐                               │
│                   │  API Helper     │                               │
│                   │  (src/lib/api.js)                               │
│                   └────────┬────────┘                               │
│                            │ Fetch API Calls                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             │ HTTP Requests (JWT Token in Headers)
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                            ↓                                         │
│                   ┌─────────────────┐                               │
│                   │  Express Server │                               │
│                   │  (server.js)    │                               │
│                   └────────┬────────┘                               │
│                            │                                         │
│      ┌─────────────────────┼─────────────────────┐                 │
│      │                     │                     │                  │
│      ↓                     ↓                     ↓                  │
│ ┌─────────┐         ┌─────────┐          ┌─────────┐              │
│ │  User   │         │  Quiz   │          │Progress │              │
│ │ Routes  │         │ Routes  │          │ Routes  │              │
│ └────┬────┘         └────┬────┘          └────┬────┘              │
│      │                   │                     │                   │
│      │ Uses Auth         │ Uses Auth           │ Uses Auth         │
│      ↓ Middleware        ↓ Middleware          ↓ Middleware        │
│ ┌─────────────────────────────────────────────────────┐            │
│ │          Authentication Middleware (JWT)            │            │
│ │          Validates tokens on protected routes       │            │
│ └─────────────────────────────────────────────────────┘            │
│                            │                                         │
│                            ↓                                         │
│                   ┌─────────────────┐                               │
│                   │  Mongoose ODM   │                               │
│                   │  (User Model)   │                               │
│                   └────────┬────────┘                               │
│                            │                                         │
│                   BACKEND (Node.js)                                 │
│                   http://localhost:5000                             │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             │ Database Queries
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                            ↓                                         │
│                   ┌─────────────────┐                               │
│                   │    MongoDB      │                               │
│                   │   Database      │                               │
│                   │                 │                               │
│                   │  ┌───────────┐  │                               │
│                   │  │   Users   │  │                               │
│                   │  │Collection │  │                               │
│                   │  └───────────┘  │                               │
│                   │                 │                               │
│                   │  Documents:     │                               │
│                   │  - username     │                               │
│                   │  - age          │                               │
│                   │  - avatar       │                               │
│                   │  - language     │                               │
│                   │  - stats        │                               │
│                   │  - organProgress│                               │
│                   │  - quizResults  │                               │
│                   └─────────────────┘                               │
│                                                                       │
│                   DATABASE (MongoDB)                                │
│                   mongodb://localhost:27017/organquest              │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Examples

### 1. User Registration Flow
```
User fills form on RegisterPage
         ↓
RegisterPage.jsx → api.register()
         ↓
POST /api/users/register
         ↓
userRoutes.js validates input
         ↓
User.create() saves to MongoDB
         ↓
JWT token generated
         ↓
Response: { user: {...}, token: "..." }
         ↓
Token stored in localStorage
         ↓
User redirected to WelcomePage
```

### 2. Quiz Submission Flow
```
User completes quiz
         ↓
QuizPage.jsx → api.submitQuiz(token, data)
         ↓
POST /api/quiz/submit + Authorization: Bearer token
         ↓
authMiddleware verifies token
         ↓
quizRoutes.js updates user stats
         ↓
User.findByIdAndUpdate()
         ↓
Response: { currentScore, highScore, totalQuizzes }
         ↓
UI updates with new stats
```

### 3. Profile View Flow
```
User clicks profile icon
         ↓
ProfileModal.jsx → api.getProfile(token)
         ↓
GET /api/users/profile + Authorization: Bearer token
         ↓
authMiddleware verifies token
         ↓
userRoutes.js fetches user data
         ↓
User.findById()
         ↓
Response: { username, stats, organProgress, quizResults }
         ↓
ProfileModal displays data
```

## 📡 API Endpoints Map

```
BASE URL: http://localhost:5000/api

PUBLIC ENDPOINTS (No Authentication Required)
├── GET  /health                    → Server health check
└── GET  /quiz/leaderboard         → Top players list

PROTECTED ENDPOINTS (JWT Token Required)
├── USERS
│   ├── POST /users/register       → Register new user
│   ├── GET  /users/profile        → Get user profile
│   ├── PUT  /users/profile        → Update profile
│   └── GET  /users/stats          → Get user statistics
│
├── QUIZ
│   ├── POST /quiz/submit          → Submit quiz result
│   └── GET  /quiz/history         → Get quiz history
│
└── PROGRESS
    ├── POST /progress/organ       → Mark organ explored
    ├── GET  /progress/organs      → Get organ progress
    └── GET  /progress/summary     → Get progress summary
```

## 🔐 Authentication Flow

```
1. REGISTRATION
   RegisterPage → POST /api/users/register
                ↓
   Server generates JWT token with payload:
   {
     userId: user._id,
     exp: 30 days from now
   }
                ↓
   Token stored in localStorage: "authToken"

2. AUTHENTICATED REQUESTS
   Component → api.someMethod(token, data)
             ↓
   Request headers include:
   Authorization: Bearer <token>
             ↓
   authMiddleware.js verifies token
             ↓
   If valid: req.userId = decoded.userId → Continue
   If invalid: 401 Unauthorized → Stop

3. TOKEN USAGE IN FRONTEND
   const token = localStorage.getItem('authToken');
   
   // Use in API calls
   api.getProfile(token)
   api.submitQuiz(token, { score: 85, ... })
   api.markOrganExplored(token, 'heart')
```

## 💾 Data Storage

### LocalStorage (Frontend)
```javascript
localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1...')
localStorage.setItem('userData', JSON.stringify({
  id: '...',
  username: 'john_doe',
  avatar: 1,
  ...
}))
```

### MongoDB (Backend)
```javascript
// Users Collection
{
  _id: ObjectId("67067d7e1234567890abcdef"),
  username: "john_doe",
  age: 25,
  avatar: 1,
  language: "english",
  stats: {
    totalQuizzesTaken: 15,
    totalScore: 1250,
    highScore: 95,
    organsExplored: 8
  },
  organProgress: [...],
  quizResults: [...],
  createdAt: ISODate("2025-10-09T10:00:00Z"),
  updatedAt: ISODate("2025-10-09T12:00:00Z")
}
```

## 🚀 Development Workflow

```
1. START SERVICES
   ├── MongoDB    : net start MongoDB
   └── Dev Server : npm run dev:all
                    ├── Frontend (Vite) : Port 5173
                    └── Backend (Express) : Port 5000

2. MAKE CHANGES
   ├── Frontend code → Auto-reload via Vite HMR
   └── Backend code  → Auto-reload via Nodemon

3. TEST
   ├── Browser → http://localhost:5173
   ├── API     → http://localhost:5000/api/health
   └── MongoDB → Use MongoDB Compass or mongosh

4. DEBUG
   ├── Frontend → Browser DevTools Console/Network
   └── Backend  → Terminal logs + MongoDB logs
```

## 📦 Project Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "UI framework",
    "@radix-ui/*": "Accessible UI primitives",
    "class-variance-authority": "Component variants",
    "clsx": "Class name utility",
    "tailwind-merge": "Merge Tailwind classes"
  },
  "devDependencies": {
    "vite": "Build tool",
    "tailwindcss": "CSS framework",
    "concurrently": "Run multiple commands"
  }
}
```

### Backend (server/package.json)
```json
{
  "dependencies": {
    "express": "Web framework",
    "cors": "CORS middleware",
    "mongoose": "MongoDB ODM",
    "jsonwebtoken": "JWT authentication",
    "bcryptjs": "Password hashing",
    "express-validator": "Input validation",
    "dotenv": "Environment variables"
  },
  "devDependencies": {
    "nodemon": "Auto-reload server"
  }
}
```

## 🎯 Key Features Implemented

✅ User registration with form validation
✅ JWT token-based authentication
✅ Secure API endpoints
✅ MongoDB data persistence
✅ Real-time stats tracking
✅ Quiz result submission
✅ Organ exploration tracking
✅ Leaderboard system
✅ Profile management
✅ Error handling
✅ CORS protection
✅ Environment configuration
✅ Development scripts

## 🔜 Future Enhancements

- [ ] Email/password login
- [ ] Password reset flow
- [ ] Social authentication (Google, Facebook)
- [ ] Real-time leaderboard updates (WebSocket)
- [ ] File upload for custom avatars
- [ ] Achievements and badges system
- [ ] Friends and social features
- [ ] Multiplayer quiz rooms
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Rate limiting
- [ ] Redis caching
- [ ] Production deployment

---

**This architecture provides a solid foundation for a scalable, secure, and maintainable full-stack application!**
