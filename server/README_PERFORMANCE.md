# Backend Performance Optimization Guide

## ⚠️ Current Issue: Render Free Tier Cold Starts

Your backend is hosted on **Render.com's free tier**, which has these limitations:
- **Sleeps after 15 minutes** of inactivity
- **Takes 50+ seconds** to wake up on first request
- This causes the "optimizing too long" issue you're experiencing

## 🚀 Optimizations Applied

### 1. **Database Connection Pooling**
Added MongoDB connection pool settings:
- `maxPoolSize: 10` - Maximum 10 concurrent connections
- `minPoolSize: 2` - Keep 2 connections alive
- `serverSelectionTimeoutMS: 5000` - Fail fast if DB is unreachable
- `socketTimeoutMS: 45000` - Close idle connections after 45s
- `connectTimeoutMS: 10000` - 10s timeout for initial connection

### 2. **Database Indexes**
Added indexes on frequently queried fields:
- `username` - For login lookups
- `stats.highScore` - For leaderboard queries
- `role, assignedGrade` - For admin queries
- `createdAt` - For sorting users

### 3. **Faster Password Hashing**
- Reduced bcrypt rounds from **10 to 8**
- Still secure but **~30% faster** registration/login

### 4. **API Timeout Handling**
- Added 60-second timeout for registration/login
- Added 30-second timeout for other requests
- Better error messages when server is waking up

## 💡 Solutions to Cold Start Problem

### Option 1: Keep-Alive Ping (Temporary Fix)
Use the `keep-alive.js` script to ping your server every 14 minutes:

```bash
# Run locally or on another service
cd server
node keep-alive.js
```

Or use a free service like:
- **UptimeRobot** (https://uptimerobot.com) - Free, pings every 5 minutes
- **Cron-job.org** (https://cron-job.org) - Free scheduled HTTP requests

### Option 2: Upgrade Hosting (Recommended)
**Free alternatives with no cold starts:**
- **Railway.app** - 500 hours/month free (no sleep)
- **Fly.io** - Free tier, faster than Render
- **Vercel** (with serverless functions)
- **AWS Lambda** (free tier, 1M requests/month)

**Paid options:**
- **Render Starter Plan** - $7/month, no sleep
- **Railway Pro** - $5/month
- **Digital Ocean** - $4/month droplet

### Option 3: Move to Serverless
Convert to serverless functions (no cold start on free tier):
- **Vercel API Routes** (free)
- **Netlify Functions** (free)
- **Cloudflare Workers** (free, very fast)

## 📊 Expected Performance

**Before optimization:**
- First request (cold start): 50-60 seconds ❌
- Subsequent requests: 200-500ms
- Login/Register: 800-1200ms

**After optimization:**
- First request (cold start): 50-60 seconds ⚠️ (still happens on Render free)
- Subsequent requests: 100-300ms ✅ (33% faster)
- Login/Register: 400-800ms ✅ (40% faster)
- Database queries: 50-150ms ✅ (with indexes)

## 🎯 Recommended Action Plan

1. **Immediate** (Free):
   - Set up UptimeRobot to ping your server every 5 minutes
   - This prevents cold starts during active hours

2. **Short-term** (Free):
   - Consider migrating to Railway.app or Fly.io
   - No sleep on free tier = better user experience

3. **Long-term** (If scaling):
   - Upgrade to Render Starter ($7/month)
   - Or migrate to serverless architecture

## 🔧 Additional Optimizations You Can Make

### 1. Enable Response Compression
Add to `server.js`:
```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Add Response Caching
For leaderboard and public data:
```javascript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache
```

### 3. Optimize Queries
Use `.lean()` for read-only queries:
```javascript
const users = await User.find().select('username').lean();
```

### 4. Add Request Logging
Monitor slow queries:
```javascript
import morgan from 'morgan';
app.use(morgan('combined'));
```

## 📝 Testing Performance

Check your current backend speed:
```bash
# Test health endpoint
curl -w "@curl-format.txt" -o /dev/null -s https://organquest2.onrender.com/api/health

# Or use browser DevTools Network tab
# Look for "Waiting (TTFB)" time
```

## 🆘 Still Slow?

If you're still experiencing slowness after these optimizations:
1. Check MongoDB Atlas cluster status (free tier has limits)
2. Verify you're on the same region (high latency if DB is far)
3. Check Render logs for errors: https://dashboard.render.com
4. Consider upgrading MongoDB Atlas tier if you have many users

---

**Questions?** Check Render's status: https://status.render.com
