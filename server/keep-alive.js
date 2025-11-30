import fetch from 'node-fetch';

// Keep-alive script to prevent Render free tier from sleeping
// This pings the server every 14 minutes (Render free tier sleeps after 15 min of inactivity)

const SERVER_URL = process.env.SERVER_URL || 'https://organquest2.onrender.com/api/health';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

async function pingServer() {
  try {
    console.log(`[${new Date().toISOString()}] Pinging server...`);
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Server response:`, data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Ping failed:`, error.message);
  }
}

// Initial ping
pingServer();

// Set up interval
setInterval(pingServer, PING_INTERVAL);

console.log(`Keep-alive script started. Pinging ${SERVER_URL} every 14 minutes.`);
