import { Resend } from 'resend';

// Only initialize Resend if API key exists
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendTeacherInvitationEmail = async (teacherData) => {
  try {
    // Check if Resend is configured
    if (!resend) {
      console.warn('Resend API key not configured. Email will not be sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const { email, fullName, teacherCode, assignedGrade, section, registrationToken } = teacherData;

    // Generate registration URL (update domain for production)
    const registrationUrl = `http://localhost:5173/teacher-register/${registrationToken}`;

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

    const data = await resend.emails.send({
      from: 'OrganQuest <onboarding@resend.dev>',
      to: email,
      subject: `Complete Your Teacher Registration - ${assignedGrade} Grade Section ${section}`,
      html: emailHtml,
    });

    console.log('Invitation email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return { success: false, error: error.message };
  }
};
