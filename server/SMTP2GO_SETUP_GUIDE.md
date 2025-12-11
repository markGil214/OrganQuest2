# SMTP2GO Email Setup Guide

This guide will help you configure SMTP2GO for sending teacher invitation emails.

## Step 1: Create SMTP2GO Account

1. Go to [https://www.smtp2go.com/](https://www.smtp2go.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Get API Key

1. Log in to your SMTP2GO dashboard
2. Go to **Settings** → **API Keys**
3. Click "Create API Key"
4. Give it a name (e.g., "OrganQuest")
5. Copy the API key (it will only be shown once!)

## Step 3: Verify Sender Email

1. In SMTP2GO dashboard, go to **Settings** → **Sender Domains**
2. Add your domain or use SMTP2GO's default sender
3. For testing, you can use: `noreply@yourdomain.com`
4. Verify the email/domain if required

## Step 4: Configure Environment Variables

### Local Development (.env file)

```env
SMTP2GO_API_KEY=your-api-key-here
SMTP2GO_USER=your-smtp2go-username
SMTP2GO_SENDER=noreply@yourdomain.com
CLIENT_URL=http://localhost:5173
```

### Production (Render)

1. Go to your Render service dashboard
2. Click on **Environment** tab
3. Add these environment variables:
   - `SMTP2GO_API_KEY`: Your API key from Step 2
   - `SMTP2GO_USER`: Your SMTP2GO username
   - `SMTP2GO_SENDER`: Your verified sender email
   - `CLIENT_URL`: `https://organ-quest2.vercel.app`

## Step 5: Test the Configuration

1. Deploy your updated code
2. Log in as superuser
3. Go to Admin Dashboard
4. Click "Test Email" button
5. Check if the test email is received

## SMTP2GO Free Tier Limits

- **1,000 emails per month** (free)
- Unlimited recipients
- No credit card required for free tier

## Troubleshooting

### "Invalid credentials" error
- Verify API key is correct (no extra spaces)
- Check if SMTP2GO account is active
- Ensure sender email is verified

### Emails not arriving
- Check spam folder
- Verify sender email in SMTP2GO
- Check SMTP2GO dashboard for delivery status

### Connection errors
- Check internet connection on Render server
- Verify SMTP2GO service status
- Try different SMTP port (2525, 587, 8025)

## SMTP Ports

SMTP2GO supports multiple ports:
- **2525** (recommended, currently used)
- **587** (TLS/STARTTLS)
- **8025** (alternative)
- **25** (standard SMTP)
- **80** (HTTP fallback)

If one port doesn't work, try another in `emailService.js`.
