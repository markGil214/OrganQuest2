import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

// Create MailerSend client
let mailerSend = null;

if (process.env.MAILERSEND_API_KEY) {
  try {
    mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });
    console.log('✅ Email service initialized with MailerSend');
    console.log('   API Key:', process.env.MAILERSEND_API_KEY ? '***configured***' : 'NOT SET');
  } catch (error) {
    console.error('❌ Failed to initialize MailerSend:', error.message);
  }
} else {
  console.warn('⚠️  MailerSend not configured.');
  console.warn('   MAILERSEND_API_KEY:', process.env.MAILERSEND_API_KEY ? 'SET' : 'NOT SET');
}

export const sendTeacherInvitationEmail = async (teacherData) => {
  try {
    // Check if email service is configured
    if (!mailerSend) {
      const error = 'Email service not configured. Check MAILERSEND_API_KEY environment variable.';
      console.warn('⚠️ ', error);
      return { success: false, error };
    }

    const { email, fullName, teacherCode, assignedGrade, section, registrationToken } = teacherData;

    // Generate registration URL (use environment variable or default)
    const baseUrl = process.env.CLIENT_URL || 'https://organ-quest2.vercel.app';
    const registrationUrl = `${baseUrl}/#teacher-register/${registrationToken}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
          .credential { margin: 10px 0; }
          .label { font-weight: bold; color: #667eea; }
          .value { font-family: monospace; background: #e8e8e8; padding: 5px 10px; border-radius: 3px; display: inline-block; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏫 Welcome to OrganQuest!</h1>
          </div>
          <div class="content">
            <h2>Hello ${fullName},</h2>
            <p>You've been assigned as a teacher for <strong>${assignedGrade} Grade - Section ${section}</strong> in the OrganQuest Learning Platform!</p>
            
            <div class="info-box">
              <h3>📋 Your Class Assignment</h3>
              <div class="credential">
                <span class="label">Grade:</span> <span class="value">${assignedGrade}</span>
              </div>
              <div class="credential">
                <span class="label">Section:</span> <span class="value">${section}</span>
              </div>
              <div class="credential">
                <span class="label">Teacher Code:</span> <span class="value">${teacherCode}</span>
              </div>
            </div>

            <div class="info-box">
              <h3>🎯 Complete Your Registration</h3>
              <p>To access your teacher dashboard, you need to complete your account registration by creating a username and password.</p>
              <p style="text-align: center;">
                <a href="${registrationUrl}" class="button">Complete Registration</a>
              </p>
              <p style="font-size: 12px; color: #666;">Or copy this link: ${registrationUrl}</p>
            </div>

            <div class="warning">
              <strong>⏰ Important:</strong> This registration link will expire in 7 days. Please complete your registration as soon as possible.
            </div>

            <div class="info-box">
              <h3>📚 What's Next?</h3>
              <ol>
                <li>Click the registration button above</li>
                <li>Create your unique username and secure password</li>
                <li>Access your teacher dashboard</li>
                <li>Share your <strong>Teacher Code</strong> with your students</li>
                <li>Manage quizzes, track progress, and view analytics</li>
              </ol>
            </div>
            
            <div class="footer">
              <p>This is an automated message from OrganQuest Learning Platform</p>
              <p>If you didn't expect this email, please contact your administrator</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via MailerSend
    const sentFrom = new Sender(
      process.env.MAILERSEND_FROM_EMAIL || 'MS_D578ie@test-nrw7gymez1kg2k8e.mlsender.net',
      'OrganQuest'
    );

    const recipients = [new Recipient(email, fullName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(`Complete Your Teacher Registration - ${assignedGrade} Grade Section ${section}`)
      .setHtml(emailHtml)
      .setText(`Hello ${fullName}, Please complete your teacher registration at: ${registrationUrl}`);

    console.log('📤 Sending email via MailerSend...');
    console.log('   From:', process.env.MAILERSEND_FROM_EMAIL || 'MS_D578ie@test-nrw7gymez1kg2k8e.mlsender.net');
    console.log('   To:', email);
    console.log('   Subject:', emailParams.subject);

    const response = await mailerSend.email.send(emailParams);
    
    console.log('✅ Invitation email sent successfully!');
    console.log('   Recipient:', email);
    console.log('   Response:', response);
    
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Error sending invitation email:', error);
    console.error('   Error type:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Command:', error.command);
    
    // Provide specific error messages
    let userMessage = error.message;
    if (error.statusCode === 401 || error.statusCode === 403) {
      userMessage = 'MailerSend authentication failed. Check if MAILERSEND_API_KEY is correct.';
      console.error('⚠️  Authentication failed. Verify:');
      console.error('   1. API key is correct');
      console.error('   2. API key has not expired');
      console.error('   3. MailerSend account is active');
    } else if (error.statusCode === 422) {
      userMessage = 'Invalid email parameters. Check sender and recipient email addresses.';
      console.error('⚠️  Validation error. Verify:');
      console.error('   1. Sender email is verified in MailerSend');
      console.error('   2. Recipient email is valid');
    }
    
    return { success: false, error: userMessage };
  }
};
