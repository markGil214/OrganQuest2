# MailerSend Email Setup Guide

This guide will help you configure MailerSend for sending teacher invitation emails.

## Why MailerSend?

- **Generous Free Tier**: 12,000 emails/month for free
- **Easy Setup**: No complex SMTP configuration
- **Trial Domain**: Instant email sending with trial domain
- **Professional**: Email tracking, analytics, and delivery reports
- **Reliable**: High deliverability rate

## Step 1: Create MailerSend Account

1. Go to [https://www.mailersend.com/](https://www.mailersend.com/)
2. Click "Start Free" and sign up
3. Verify your email address
4. Log in to your dashboard

## Step 2: Get API Token

1. In MailerSend dashboard, go to **Settings** → **API Tokens**
2. Click "Generate new token"
3. Give it a name (e.g., "OrganQuest")
4. Select **Full access** or at minimum **Email send** permission
5. Click "Create token"
6. **IMPORTANT**: Copy the API token immediately (it will only be shown once!)

## Step 3: Sender Email Configuration

### Option A: Use Trial Domain (Instant, for Testing)

For testing/development, MailerSend provides a trial domain:
- Format: `noreply@trial-xxxxx.mlsender.net`
- Find your trial domain in: **Settings** → **Domains**
- Copy the email address shown
- Ready to use immediately, no verification needed

### Option B: Use Your Own Domain (Production)

For production use with your own domain:
1. Go to **Domains** → "Add domain"
2. Enter your domain (e.g., `organquest.com`)
3. Add DNS records (TXT, DKIM, CNAME) to your domain
4. Wait for verification (usually 5-30 minutes)
5. Once verified, use emails like `noreply@organquest.com`

## Step 4: Configure Environment Variables

### Local Development (.env file)

```env
MAILERSEND_API_KEY=mlsn.1234567890abcdef...
MAILERSEND_FROM_EMAIL=noreply@trial-xxxxx.mlsender.net
CLIENT_URL=http://localhost:5173
```

### Production (Render)

1. Go to your Render service dashboard
2. Click on **Environment** tab
3. Add/Update these environment variables:
   - `MAILERSEND_API_KEY`: Your API token from Step 2
   - `MAILERSEND_FROM_EMAIL`: Your trial domain email or verified domain email
   - `CLIENT_URL`: `https://organ-quest2.vercel.app`

## Step 5: Test the Configuration

1. Deploy your code to Render
2. Log in as superuser/admin
3. Create a test teacher account
4. Check if the invitation email arrives
5. Monitor in MailerSend dashboard: **Activity** → **Emails**

## Email Limits

### Free Tier
- **12,000 emails per month**
- **3,000 emails per domain**
- Email tracking included
- No credit card required

### Trial Domain Limitations
- Emails may go to spam more often
- "Sent via MailerSend" footer added
- For production, use verified domain

## Monitoring & Analytics

MailerSend provides detailed analytics:
1. Go to **Activity** → **Emails**
2. See real-time email status:
   - Sent
   - Delivered
   - Opened
   - Clicked
   - Bounced
   - Spam complaints

## Troubleshooting

### "Invalid API key" error
- Verify API key is correct (no extra spaces)
- Check if API key has not expired
- Ensure API key has email sending permission

### "Sender not verified" error
- Using trial domain: Use the exact email from MailerSend dashboard
- Using custom domain: Verify DNS records are correct and verified

### Emails going to spam
- Trial domain emails may go to spam
- Solution: Verify your own domain for production
- Add SPF, DKIM, DMARC records to your domain

### Emails not arriving
- Check MailerSend Activity dashboard for delivery status
- Check recipient's spam folder
- Verify sender email is correctly configured
- Check email quota (12,000/month limit)

## Best Practices

1. **Use Trial Domain for Development**: Quick testing without domain setup
2. **Verify Your Domain for Production**: Better deliverability
3. **Monitor Activity Dashboard**: Track email delivery and issues
4. **Set Up Webhooks**: Get real-time notifications on email events
5. **Use Templates**: Create branded email templates in MailerSend
6. **Test Spam Score**: Use MailerSend's spam checker before sending

## Security Notes

- Never commit API keys to Git
- Keep API keys in environment variables only
- Rotate API keys periodically
- Use minimal permissions for API tokens
- Monitor unusual activity in MailerSend dashboard

## Upgrading to Paid Plan

If you need more emails:
- **Essential**: 50,000 emails/month - $25/month
- **Professional**: 100,000 emails/month - $50/month
- **Enterprise**: Custom pricing

## Additional Features

- **Email Templates**: Create reusable HTML templates
- **Webhooks**: Real-time email event notifications
- **Scheduled Sending**: Send emails at specific times
- **A/B Testing**: Test different email versions
- **Suppression Lists**: Manage unsubscribes and bounces
