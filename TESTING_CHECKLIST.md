# ✅ Backend Testing Checklist

## Prerequisites Setup
- [ ] MongoDB installed and running
- [ ] Node.js v18+ installed
- [ ] All dependencies installed (`npm install` in root and `cd server && npm install`)
- [ ] `.env` file created in server folder (copied from `.env.example`)
- [ ] JWT_SECRET changed to a random string in `server\.env`

## Start Services
- [ ] MongoDB service started (`net start MongoDB`)
- [ ] Backend server running (`npm run dev:server` or `npm run dev:all`)
- [ ] Frontend dev server running (`npm run dev` or `npm run dev:all`)
- [ ] No errors in terminal

## Test 1: Server Health Check
- [ ] Open http://localhost:5000/api/health in browser
- [ ] Expected response:
  ```json
  {
    "status": "OK",
    "message": "OrganQuest API is running",
    "timestamp": "2025-10-09T..."
  }
  ```

## Test 2: User Registration (Happy Path)
### Via Browser
- [ ] Open http://localhost:5173
- [ ] Navigate to RegisterPage
- [ ] Fill in form:
  - Username: `testuser1` (or any unique name)
  - Age: `25`
  - Avatar: Select any avatar
  - Language: `English`
- [ ] Click "Register" button
- [ ] Button shows "Registering..." spinner
- [ ] No error messages appear
- [ ] Redirected to WelcomePage
- [ ] Check browser console:
  - [ ] See "Registration successful" log
  - [ ] Response contains `token` and `user` data

### Check LocalStorage
- [ ] Open DevTools → Application → LocalStorage → http://localhost:5173
- [ ] Verify `authToken` exists and is a long string (JWT)
- [ ] Verify `userData` exists and contains user info

### Check Database
- [ ] Open MongoDB Compass or use mongosh
- [ ] Connect to `mongodb://localhost:27017`
- [ ] Select `organquest` database
- [ ] Open `users` collection
- [ ] Verify new user document exists with your test data

## Test 3: User Registration (Error Cases)
### Duplicate Username
- [ ] Try to register again with same username
- [ ] Expected: Error message "Username already taken"
- [ ] No redirect to WelcomePage

### Invalid Age
- [ ] Try age < 1 or > 120
- [ ] Expected: Form validation error

### Missing Fields
- [ ] Try to submit without username
- [ ] Expected: HTML5 validation prevents submission
- [ ] Try to submit without avatar selected
- [ ] Expected: Register button disabled

## Test 4: API Endpoints via PowerShell

### Test Registration Endpoint
```powershell
$body = @{
  username = "apitest1"
  age = 30
  avatar = 2
  language = "filipino"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/users/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

$response
```
- [ ] Command executes without errors
- [ ] Response contains `success: true`
- [ ] Response contains `token`
- [ ] Response contains `user` object

### Test Get Profile (Protected Endpoint)
```powershell
# Use token from previous response
$token = $response.data.token

$profile = Invoke-RestMethod -Uri "http://localhost:5000/api/users/profile" `
  -Method Get `
  -Headers @{ Authorization = "Bearer $token" }

$profile
```
- [ ] Command executes without errors
- [ ] Returns user profile data
- [ ] Matches registration data

### Test Without Token (Should Fail)
```powershell
try {
  Invoke-RestMethod -Uri "http://localhost:5000/api/users/profile" -Method Get
} catch {
  Write-Host "Expected error: $($_.Exception.Message)"
}
```
- [ ] Request fails with 401 Unauthorized
- [ ] Error message: "No authentication token, access denied"

## Test 5: Quiz Submission

### Via API
```powershell
# Use token from registration
$quizBody = @{
  quizType = "multiple-choice"
  score = 85
  totalQuestions = 10
} | ConvertTo-Json

$quizResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/quiz/submit" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $quizBody

$quizResponse
```
- [ ] Command executes without errors
- [ ] Response shows updated stats
- [ ] `totalQuizzesTaken` incremented
- [ ] `highScore` updated if applicable

### Check Database
- [ ] Open MongoDB Compass
- [ ] Find your user document
- [ ] Verify `quizResults` array has new entry
- [ ] Verify `stats.totalQuizzesTaken` = 1
- [ ] Verify `stats.totalScore` = 85
- [ ] Verify `stats.highScore` = 85

## Test 6: Organ Progress

### Mark Organ as Explored
```powershell
$organBody = @{
  organName = "heart"
} | ConvertTo-Json

$organResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/progress/organ" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $organBody

$organResponse
```
- [ ] Command executes without errors
- [ ] Response shows `totalExplored` = 1
- [ ] Response shows `progressPercentage`

### Get All Organ Progress
```powershell
$progress = Invoke-RestMethod -Uri "http://localhost:5000/api/progress/organs" `
  -Method Get `
  -Headers @{ Authorization = "Bearer $token" }

$progress.data.organs | Format-Table
```
- [ ] Command executes without errors
- [ ] Returns list of all 15 organs
- [ ] "heart" shows `explored: true`
- [ ] Other organs show `explored: false`

## Test 7: Leaderboard (Public Endpoint)

```powershell
# Create a few more test users with different scores first
# Then get leaderboard
$leaderboard = Invoke-RestMethod -Uri "http://localhost:5000/api/quiz/leaderboard?limit=10" -Method Get

$leaderboard.data | Format-Table
```
- [ ] Command executes without errors
- [ ] Returns array of top players
- [ ] Sorted by `highScore` descending
- [ ] Shows rank, username, avatar, scores

## Test 8: Frontend Integration

### RegisterPage Connection
- [ ] Register a new user via browser
- [ ] Open Network tab in DevTools
- [ ] Find POST request to `/api/users/register`
- [ ] Verify request payload matches form data
- [ ] Verify response status 201
- [ ] Verify response contains token and user

### Error Handling
- [ ] Turn off backend server (`Ctrl+C` in server terminal)
- [ ] Try to register new user
- [ ] Expected: Error message appears in UI
- [ ] Error: "Failed to fetch" or connection error
- [ ] User stays on RegisterPage

## Test 9: Multiple Users

### Create 3 Different Users
- [ ] User 1: username="player1", age=20, avatar=1
- [ ] User 2: username="player2", age=25, avatar=2
- [ ] User 3: username="player3", age=30, avatar=3
- [ ] All users created successfully
- [ ] Each has unique JWT token

### Submit Different Quiz Scores
- [ ] Player1: score=50
- [ ] Player2: score=100 (highest)
- [ ] Player3: score=75
- [ ] All scores recorded

### Check Leaderboard
- [ ] Get leaderboard
- [ ] Player2 is rank 1 (score=100)
- [ ] Player3 is rank 2 (score=75)
- [ ] Player1 is rank 3 (score=50)

## Test 10: Data Persistence

### Stop and Restart Server
- [ ] Stop backend server (`Ctrl+C`)
- [ ] Stop MongoDB (if running as process)
- [ ] Restart MongoDB (`net start MongoDB` or `mongod`)
- [ ] Restart backend (`npm run dev:server`)

### Verify Data Still Exists
- [ ] Check MongoDB for user documents
- [ ] All users still exist
- [ ] All quiz results preserved
- [ ] All organ progress intact
- [ ] Get profile via API still works

## Test 11: Token Validation

### Valid Token
- [ ] Register user, get token
- [ ] Use token to access protected endpoint
- [ ] Success

### Invalid Token
```powershell
try {
  Invoke-RestMethod -Uri "http://localhost:5000/api/users/profile" `
    -Method Get `
    -Headers @{ Authorization = "Bearer invalid_token_here" }
} catch {
  Write-Host "Expected error: $($_.Exception.Message)"
}
```
- [ ] Request fails with 401
- [ ] Error: "Token is invalid or expired"

### No Token
```powershell
try {
  Invoke-RestMethod -Uri "http://localhost:5000/api/users/profile" -Method Get
} catch {
  Write-Host "Expected error: $($_.Exception.Message)"
}
```
- [ ] Request fails with 401
- [ ] Error: "No authentication token"

## Test 12: CORS

### From Different Origin (Should Fail)
- [ ] Try to call API from a different origin (not http://localhost:5173)
- [ ] Expected: CORS error
- [ ] Verifies CORS protection is working

### From Configured Origin (Should Work)
- [ ] API calls from http://localhost:5173 work
- [ ] No CORS errors in browser console

## Common Issues and Solutions

### ❌ MongoDB Connection Error
**Error:** `MongoNetworkError: connect ECONNREFUSED`
**Solution:** 
```powershell
net start MongoDB
# or
mongod --dbpath="C:\data\db"
```

### ❌ Port 5000 Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
# Or change PORT in server\.env
```

### ❌ Missing Dependencies
**Error:** `Cannot find module 'express'`
**Solution:**
```powershell
cd server
npm install
```

### ❌ JWT Secret Not Set
**Error:** JWT errors or server crashes
**Solution:**
```powershell
# Edit server\.env
# Set JWT_SECRET to a random string
notepad server\.env
```

### ❌ CORS Error
**Error:** `blocked by CORS policy`
**Solution:**
```powershell
# Verify CLIENT_URL in server\.env matches frontend URL
# Default: http://localhost:5173
```

### ❌ Frontend Can't Connect to Backend
**Error:** `Failed to fetch` or `net::ERR_CONNECTION_REFUSED`
**Solution:**
- Verify backend is running on port 5000
- Check `.env` in root has `VITE_API_URL=http://localhost:5000/api`
- Restart frontend dev server

## ✅ Success Criteria

All tests pass when:
- [ ] Users can register successfully
- [ ] User data is stored in MongoDB
- [ ] JWT tokens are generated and validated
- [ ] Protected endpoints require authentication
- [ ] Quiz scores are tracked correctly
- [ ] Organ progress is recorded
- [ ] Leaderboard shows correct rankings
- [ ] Error messages are displayed appropriately
- [ ] Data persists across server restarts
- [ ] CORS protection is working
- [ ] No console errors (except expected ones)

## 📊 Test Results Summary

**Date:** _________________

**Tester:** _________________

**Results:**
- Tests Passed: ____ / 60
- Tests Failed: ____
- Tests Skipped: ____

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**Congratulations!** If all tests pass, your backend is fully functional and ready for integration with the rest of your OrganQuest application! 🎉
