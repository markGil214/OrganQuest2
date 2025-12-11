# cPanel Email SMTP Setup Guide

This guide will help you configure your cPanel email account for sending teacher invitation emails.

## Email Configuration Details

Based on your cPanel email settings:

- **Host**: `hari.fr.planethoster.net`
- **SMTP Port**: `465` (SSL/TLS - Recommended)
- **Username**: `marco@nusa22.piscines-design.fr`
- **Password**: Your email account password

## Step 1: Verify Email Account

1. Log in to your cPanel
2. Go to **Email Accounts**
3. Verify that `marco@nusa22.piscines-design.fr` exists and is active
4. Make sure you know the password for this email account

## Step 2: Configure Environment Variables

### Local Development (.env file)

```env
SMTP_USER=marco@nusa22.piscines-design.fr
SMTP_PASSWORD=your-email-password-here
CLIENT_URL=http://localhost:5173
```

### Production (Render)

1. Go to your Render service dashboard
2. Click on **Environment** tab
3. Add/Update these environment variables:
   - `SMTP_USER`: `marco@nusa22.piscines-design.fr`
   - `SMTP_PASSWORD`: Your email account password
   - `CLIENT_URL`: `https://organ-quest2.vercel.app`

## Step 3: SMTP Configuration

The application is configured to use:
- **Server**: hari.fr.planethoster.net
- **Port**: 465 (SSL)
- **Secure**: Yes (SSL/TLS encryption)
- **Authentication**: Required

## Step 4: Test the Configuration

1. Deploy your code
2. Log in as superuser/admin
3. Create a test teacher account
4. Check if the invitation email is sent

## Alternative Ports

If port 465 doesn't work, you can try:
- **Port 587** (STARTTLS) - Edit `emailService.js` to use port 587 with `secure: false`
- **Port 993** (IMAP - for receiving only, not for sending)

## Troubleshooting

### "Authentication failed" error
- Verify email password is correct
- Check if email account is not suspended
- Ensure email account has SMTP access enabled in cPanel

### "Connection refused" error
- Check if your server's firewall allows outbound connections on port 465
- Try port 587 instead
- Verify the hostname is correct: `hari.fr.planethoster.net`

### Emails not arriving
- Check recipient's spam/junk folder
- Verify sender email is not blacklisted
- Check cPanel email quota - make sure it's not full
- Review email logs in cPanel

## Security Notes

- Never commit `.env` files to Git
- Keep email passwords secure
- Use strong passwords for email accounts
- Consider enabling two-factor authentication in cPanel
- Regularly update email account passwords

## Email Sending Limits

Check with your hosting provider (PlanetHoster) for:
- Maximum emails per hour
- Maximum emails per day
- Maximum recipients per email

Typical limits for shared hosting:
- ~100-300 emails per hour
- ~500-1000 emails per day
