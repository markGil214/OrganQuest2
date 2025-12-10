# Email Service Setup Guide

## Gmail Setup (Recommended - Free & Easy)

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Under "How you sign in to Google", click **2-Step Verification**
3. Follow the steps to enable it

### Step 2: Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. You might need to verify your password again
3. In "Select app" dropdown, choose **Mail**
4. In "Select device" dropdown, choose **Other (Custom name)**
5. Type "OrganQuest" and click **Generate**
6. Google will show a 16-character password like: `abcd efgh ijkl mnop`

### Step 3: Update .env File
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```
**Important:** Remove spaces from the app password!

### Step 4: Update Environment Variables in Render
1. Go to your Render dashboard
2. Select your server
3. Go to **Environment** tab
4. Add these variables:
   - `GMAIL_USER`: your-email@gmail.com
   - `GMAIL_APP_PASSWORD`: your-16-char-password
5. Click **Save Changes**
6. Your server will automatically redeploy

## Testing
After setup, when you create a class:
1. Check server logs for `✅ Email service initialized with Gmail`
2. Check for `✅ Invitation email sent successfully`
3. Teacher should receive email within seconds

## Troubleshooting

### "Invalid login" error
- Make sure 2-Step Verification is enabled
- Verify the app password is correct (no spaces)
- Try generating a new app password

### "Service unavailable" error
- Check your internet connection
- Gmail might be temporarily down

### Still not working?
- Check Render logs for detailed error messages
- Verify environment variables are set correctly
- Make sure you're using the Gmail account that created the app password
