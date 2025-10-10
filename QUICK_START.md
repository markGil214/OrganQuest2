# 🚀 Quick Start - Backend Setup

## Prerequisites
- Node.js installed (v18 or higher)
- MongoDB installed and running

## Step 1: Install MongoDB

### Windows
```powershell
# Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb
```

### Start MongoDB
```powershell
# Start as a service
net start MongoDB

# Or run manually
mongod --dbpath="C:\data\db"
```

## Step 2: Install Dependencies

```powershell
# Install root dependencies (includes concurrently)
npm install

# Install server dependencies
cd server
npm install
cd ..
```

## Step 3: Configure Environment

```powershell
# Create .env file in server directory
Copy-Item server\.env.example server\.env

# Edit the server\.env file with your settings
```

**Important:** Change the `JWT_SECRET` in `server\.env` to a random string!

## Step 4: Run the Application

### Option 1: Run Everything Together (Recommended)
```powershell
npm run dev:all
```
This runs both frontend (port 5173) and backend (port 5000) simultaneously.

### Option 2: Run Separately
```powershell
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
npm run dev:server
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🧪 Test the Backend

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get

# Test registration
$body = @{
  username = "testuser"
  age = 25
  avatar = 1
  language = "english"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/users/register" -Method Post -ContentType "application/json" -Body $body
```

## 📚 Documentation

See `BACKEND_GUIDE.md` for comprehensive API documentation and integration examples.

## ⚠️ Troubleshooting

### MongoDB Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB with `net start MongoDB`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in `server\.env` or kill the process

### CORS Error
**Solution:** Make sure `CLIENT_URL` in `server\.env` is set to `http://localhost:5173`

## 🎉 You're Ready!

The backend is now integrated with your RegisterPage. When users register, their data will be saved to MongoDB and they'll receive a JWT token for authentication.
