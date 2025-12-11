import nodemailer from 'nodemailer';

// Create cPanel SMTP transporter
let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
  try {
    transporter = nodemailer.createTransport({
      host: 'hari.fr.planethoster.net',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.SMTP_USER, // marco@nusa22.piscines-design.fr
        pass: process.env.SMTP_PASSWORD
      }
    });
    console.log('✅ Email service initialized with cPanel SMTP');
    console.log('   SMTP Host: hari.fr.planethoster.net');
    console.log('   SMTP Port: 465 (SSL)');
    console.log('   SMTP User:', process.env.SMTP_USER);
  } catch (error) {
    console.error('❌ Failed to initialize SMTP transporter:', error.message);
  }
} else {
  console.warn('⚠️  SMTP not configured.');
  console.warn('   SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
  console.warn('   SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'SET' : 'NOT SET');
}

export const sendTeacherInvitationEmail = async (teacherData) => {
  try {
    // Check if email service is configured
    if (!transporter) {
      const error = 'Email service not configured. Check SMTP_USER and SMTP_PASSWORD environment variables.';
      console.warn('⚠️ ', error);
      return { success: false, error };
    }

    const { email, fullName, teacherCode, assignedGrade, section, registrationToken } = teacherData;

    // Verify transporter connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');

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

    // Send email via cPanel SMTP
    const mailOptions = {
      from: `"OrganQuest" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Complete Your Teacher Registration - ${assignedGrade} Grade Section ${section}`,
      html: emailHtml,
    };

    console.log('📤 Sending email...');
    console.log('   From:', process.env.SMTP_USER);
    console.log('   To:', email);
    console.log('   Subject:', mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invitation email sent successfully!');
    console.log('   Recipient:', email);
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);
    
    if (info.rejected && info.rejected.length > 0) {
      console.warn('⚠️  Some recipients were rejected:', info.rejected);
    }
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return { success: true, data: info };
  } catch (error) {
    console.error('❌ Error sending invitation email:', error);
    console.error('   Error type:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Command:', error.command);
    
    // Provide specific error messages
    let userMessage = error.message;
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      userMessage = 'SMTP authentication failed. Check if SMTP_USER and SMTP_PASSWORD are correct.';
      console.error('⚠️  Authentication failed. Verify:');
      console.error('   1. Email account exists in cPanel');
      console.error('   2. Password is correct');
      console.error('   3. Email account is active');
    } else if (error.code === 'ECONNECTION') {
      userMessage = 'Cannot connect to SMTP server. Check internet connection.';
    }
    
    return { success: false, error: userMessage };
  }
};
