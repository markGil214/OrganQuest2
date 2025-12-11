# 📚 OrganQuest User Manual
### The Interactive Human Anatomy Learning Platform

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [Getting Started](#getting-started)
4. [User Roles & Accounts](#user-roles--accounts)
5. [Student Features](#student-features)
6. [Teacher Features](#teacher-features)
7. [Superuser/Admin Features](#superuser-admin-features)
8. [Language Support](#language-support)
9. [Technical Requirements](#technical-requirements)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Introduction

**OrganQuest** is an interactive educational web application designed to make learning human anatomy fun and engaging for students in grades 4-6. The platform combines augmented reality (AR), interactive 3D models, quizzes, and gamification to create an immersive learning experience.

### Key Features:
- 🔍 **AR Scanner** - Explore 3D organ models in augmented reality
- 🧩 **Interactive Quizzes** - Multiple quiz types with real-time feedback
- 📊 **Progress Tracking** - Monitor learning progress and achievements
- 👥 **Multi-user System** - Students, Teachers, and Administrators
- 🌐 **Bilingual Support** - English and Filipino languages
- 📱 **Mobile Responsive** - Works on desktop, tablet, and mobile devices

---

## 🖥️ System Overview

### Platform Architecture
OrganQuest is built with:
- **Frontend**: React.js with Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **3D Rendering**: Three.js for AR experiences
- **Authentication**: JWT-based secure login

### Available User Roles:
1. **Student** - Learn anatomy through interactive content
2. **Teacher** - Create assignments, monitor student progress
3. **Superuser** - Manage teachers, students, and system settings

---

## 🚀 Getting Started

### For Students

#### 1. Creating an Account

1. Navigate to the OrganQuest homepage
2. Click **"Register"** button
3. Fill in the registration form:
   - **Full Name**: Your complete name
   - **Username**: Choose a unique username (3-30 characters)
   - **Password**: Create a strong password (minimum 6 characters)
   - **Age**: Your current age (1-120)
   - **Grade**: Select your grade level (4th, 5th, or 6th)
   - **Section**: Your class section (A, B, C, etc.)
   - **Avatar**: Choose your profile avatar (1-8)
   - **Language**: English or Filipino

4. Click **"Register"** to create your account
5. You'll be automatically logged in and redirected to the Welcome Page

#### 2. Logging In

1. Click **"Login"** on the homepage
2. Enter your **username** and **password**
3. Click **"Login"**
4. You'll be redirected to the Main Menu

#### 3. First-Time Experience

After logging in, you'll see the **Welcome Page** with:
- A welcome message personalized with your name
- An orientation video explaining how to use the platform
- Language selection options
- A "Continue" button to access the main menu

---

## 👤 User Roles & Accounts

### Student Accounts

**Registration Requirements:**
- Full name (2-100 characters)
- Unique username (3-30 characters)
- Password (minimum 6 characters)
- Age, grade, section
- Avatar selection
- Preferred language

**Account Features:**
- Personal profile management
- Progress tracking
- Quiz history
- Achievement badges
- Customizable settings

### Teacher Accounts

**How Teachers Get Access:**
1. A Superuser creates a teacher account via Admin Dashboard
2. Teacher receives an invitation email with a registration link
3. Teacher clicks the link and completes registration:
   - Choose username
   - Set password
   - Confirm password
4. Account is activated and ready to use

**Teacher Information Includes:**
- Full name
- Email address
- Assigned grade level
- Section
- Unique Teacher Code (e.g., T-ABC123)

### Superuser Accounts

**Created By:** System administrators
**Access Level:** Full system control
**Capabilities:** All teacher features plus user management

---

## 🎓 Student Features

### Main Menu

The Main Menu is your hub for all activities:

#### 1. 🔍 Scan & Explore
- **Purpose**: Explore human organs using AR and 3D models
- **Features**:
  - AR camera scanning
  - 3D interactive organ models
  - Detailed organ information
  - Fun facts and "Did You Know?" sections
  - Audio pronunciation

#### 2. 🧩 Quiz & Puzzles
- **Purpose**: Test your knowledge with various quiz types
- **Quiz Types Available**:
  - Multiple Choice Quiz
  - Memory Matching Game
  - Timed Challenge Quiz
- **Quiz Modes**:
  - **Solo Mode**: Practice freely with unlimited attempts
  - **Teacher Mode**: Take assigned quizzes with grading

#### 3. 📚 Learn More
- **Educational Resources**: Access detailed organ information
- **Study Materials**: Comprehensive anatomy lessons
- **Interactive Content**: Videos and animations

#### 4. 🚪 Exit
- Return to home screen or logout

### Profile Management

Access your profile by clicking the avatar in the top-right corner:

**Available Actions:**
- View personal information
- Change avatar (1-8 options)
- Update language preference
- View account statistics
- Logout

### Scan & Explore Features

#### Organ Library
Explore these human organs:
1. **Heart** ❤️ - Learn about blood circulation
2. **Brain** 🧠 - Discover the control center
3. **Lungs** 🫁 - Understand breathing
4. **Liver** 🟤 - Explore detoxification
5. **Stomach** 🔴 - Learn about digestion
6. **Kidneys** 🟣 - Filter and clean blood
7. **Intestines** 🌀 - Nutrient absorption
8. **And many more...**

#### AR Scanner Mode
1. Click **"AR Scanner"** button
2. Allow camera permissions
3. Point camera at AR marker (if using marker-based AR)
4. Interact with 3D organ model:
   - Rotate: Drag with mouse/finger
   - Zoom: Pinch or scroll
   - Information: Tap hotspots for details

#### 3D Interactive Viewer
1. Select an organ from the menu
2. Choose **"Interactive Viewer"**
3. Explore features:
   - **Slice View**: See internal cross-sections
   - **Hotspots**: Click markers for detailed information
   - **Animations**: Watch how organs function
   - **Labels**: Learn anatomical terms

### Quiz System

#### Taking a Solo Quiz

1. Go to **Quiz & Puzzles** from Main Menu
2. Select quiz type (Multiple Choice, Memory Match, or Timed)
3. Click **"Solo Mode"**
4. Answer questions:
   - Read each question carefully
   - Select your answer
   - Click "Next" to continue
5. Review your results at the end
6. See your score, correct answers, and explanations

#### Taking a Teacher-Assigned Quiz

1. Get the **Quiz Code** from your teacher (e.g., ABC123)
2. Go to **Quiz & Puzzles** from Main Menu
3. Select the quiz type
4. Click **"Teacher Mode"**
5. Enter the quiz code
6. Review quiz details:
   - Teacher name
   - Due date
   - Maximum attempts allowed
   - Time limit
7. Click **"Start Quiz"**
8. Complete the quiz within the time limit
9. Submit your answers
10. Your score is automatically sent to your teacher

#### Quiz Types Explained

##### 1. Multiple Choice Quiz (🧠)
- **Format**: 20 questions about human anatomy
- **Question Types**: Text-based with 4 answer options
- **Scoring**: 1 point per correct answer (max 20 points)
- **Time**: No limit in Solo mode, variable in Teacher mode
- **Topics**: All major organs and body systems

##### 2. Memory Matching Game (🧩)
- **Format**: Match organ images with their names
- **Cards**: 12 pairs (24 cards total)
- **Scoring**: Points for matches, penalties for mismatches
- **Challenge**: Complete with minimum moves
- **Topics**: Visual recognition of organs

##### 3. Timed Challenge Quiz (⚡)
- **Format**: Quick-fire questions
- **Questions**: 15 questions in 5 minutes
- **Pressure**: Beat the clock!
- **Scoring**: Speed + accuracy bonuses
- **Difficulty**: Progressive difficulty levels

### Quiz History

View your past quiz performance:

1. Click **"Quiz History"** in Quiz Menu
2. See all completed quizzes:
   - Quiz type
   - Score and percentage
   - Date taken
   - Time spent
   - Teacher name (for assigned quizzes)
3. Filter by:
   - Quiz type
   - Date range
   - Teacher assignments vs. solo practice

### Progress Tracking

Monitor your learning journey:
- **Total Quizzes Taken**: Count of all attempts
- **Average Score**: Overall performance percentage
- **Explored Organs**: Organs you've studied
- **Achievement Badges**: Unlocked rewards
- **Learning Streaks**: Consecutive days of activity

---

## 👨‍🏫 Teacher Features

### Teacher Dashboard

Access your dashboard after logging in with teacher credentials.

#### Dashboard Overview

**Main Tabs:**
1. **Classes** - View and manage your assigned students
2. **Quiz Assignments** - Create and manage quizzes
3. **Students** - Detailed student analytics

### Managing Students

#### View All Students

1. Navigate to **"Classes"** or **"Students"** tab
2. See student list with:
   - Full name
   - Username
   - Grade and section
   - Quiz attempts
   - Average score
   - Last active date
   - Performance level (🟢 Good, 🟡 Average, 🔴 Needs Help)

#### Filter Students

Use filters to find specific students:
- **By Grade**: 4th, 5th, 6th
- **By Section**: A, B, C, etc.
- **By Performance**: High performers, struggling students
- **By Activity**: Active, inactive
- **Search**: Name or username

#### View Student Details

1. Click on a student's name
2. View detailed information:
   - Personal profile
   - Quiz history (all attempts)
   - Performance trends (graphs)
   - Organ exploration progress
   - Strengths and weaknesses by topic
   - Time spent on platform

#### Reset Quiz Attempts

If a student needs a second chance:
1. Go to student details
2. Find the quiz assignment
3. Click **"Reset Attempts"**
4. Confirm the action
5. Student can retake the quiz

### Creating Quiz Assignments

#### Step-by-Step: Create a Quiz

1. Click **"Quiz Assignments"** tab
2. Click **"Create New Assignment"** button
3. Select **Quiz Type**:
   - Multiple Choice
   - Memory Matching
   - Timed Challenge
4. Fill in assignment details:
   - **Title**: Descriptive name (e.g., "Heart Anatomy Quiz")
   - **Description**: Instructions or context
   - **Assigned Grade**: Target grade level
   - **Due Date**: Deadline for completion
   - **Max Attempts**: How many tries students get (1-10)
   - **Time Limit**: Minutes allowed (optional for some types)
5. Click **"Create Assignment"**
6. System generates a unique **Quiz Code** (e.g., XYZ789)
7. Share the code with your students

#### Managing Quiz Assignments

**View All Assignments:**
- See list of all quizzes you've created
- Status: Active or Inactive
- Number of submissions
- Average class score
- Due date status

**Actions Available:**
- **View Submissions**: See who has taken the quiz
- **Toggle Active/Inactive**: Turn quiz on/off
- **Edit Details**: Update title, due date, etc.
- **Delete Assignment**: Remove quiz (permanent)
- **Download Results**: Export to CSV

#### Viewing Quiz Submissions

1. Click **"View Submissions"** on any assignment
2. See detailed results:
   - Student name
   - Score and percentage
   - Attempt number (1st, 2nd, etc.)
   - Time taken
   - Submission date
   - Individual answers

**Student Performance Analysis:**
- Which questions were most difficult?
- Common misconceptions
- Time spent per question
- Improvement across attempts

### Custom Question Bank (Advanced)

Create your own custom questions:

1. Go to **"Quiz Assignments"**
2. Click **"Custom Questions"**
3. Click **"Create New Question"**
4. Fill in question details:
   - **Question Text**: The question itself
   - **Question Type**: Multiple choice, true/false, etc.
   - **Answer Options**: Provide 2-4 options
   - **Correct Answer**: Mark the right answer
   - **Explanation**: Why this answer is correct
   - **Difficulty**: Easy, Medium, Hard
   - **Topic/Organ**: Category for organization
5. Save question to your bank
6. Use in future quiz assignments

### Class Management

#### Create a New Class Section

1. Click **"Classes"** tab
2. Click **"Create New Class"**
3. Enter class details:
   - Grade level
   - Section name
4. System automatically assigns you as the teacher

#### View Class Statistics

For each class, view:
- Total students enrolled
- Average class performance
- Quiz completion rates
- Most/least explored organs
- Engagement metrics

---

## 🔐 Superuser/Admin Features

Superusers have all teacher capabilities plus administrative controls.

### Access Admin Panel

1. Login with superuser credentials
2. Click **"Admin Dashboard"** from main menu
3. Access the SuperAdmin Panel

### Managing Teachers

#### Create New Teacher Account

1. Go to **"Manage Teachers"** section
2. Click **"Create New Teacher"** or **"Invite Teacher"**
3. **Option A: Direct Creation**
   - Enter full name
   - Username
   - Password
   - Assigned grade
   - System creates account immediately

4. **Option B: Email Invitation** (Recommended)
   - Enter teacher's email address
   - Full name
   - Assigned grade level
   - Section
   - Click **"Send Invitation"**
   - Teacher receives email with registration link
   - Link expires in 7 days
   - Teacher completes registration themselves

#### View All Teachers

- List of all teacher accounts
- Filter by grade assignment
- Search by name or teacher code
- View account status (Active/Pending)

#### Edit Teacher Information

1. Click **"Edit"** next to teacher name
2. Modify:
   - Assigned grade
   - Section
   - Password (if needed)
3. Save changes

#### Delete Teacher Account

1. Select teacher to remove
2. Click **"Delete"**
3. Confirm deletion (irreversible)
4. All their quiz assignments remain but are orphaned

### Managing Students

Superusers can:
- View all students across all grades
- Edit student profiles
- Reset passwords
- Delete student accounts
- View comprehensive analytics

### System Settings

#### Email Configuration

Configure email service for teacher invitations:
- Email provider settings
- SMTP configuration
- Email templates
- Test email functionality

#### User Management Policies

- Password requirements
- Session timeout duration
- Maximum login attempts
- Account lockout rules

### Analytics & Reporting

**System-Wide Reports:**
- Total users by role
- Daily/weekly/monthly active users
- Quiz completion rates
- Average scores by grade
- Most popular organs/quizzes
- Platform usage trends

**Export Options:**
- CSV downloads
- PDF reports
- Scheduled email reports

---

## 🌐 Language Support

OrganQuest supports **English** and **Filipino** languages.

### Changing Language

**During Registration:**
- Select your preferred language in the registration form

**After Login:**
1. Click your avatar/profile icon
2. Select **"Language Settings"** or Language toggle
3. Choose **English** or **Filipino**
4. Interface updates immediately

### What Gets Translated:

✅ **Fully Translated:**
- Navigation menus
- Button labels
- Form fields and validation messages
- Quiz questions and answers
- Instructions and help text
- Error messages and notifications

⚠️ **Not Translated:**
- User-generated content (custom questions)
- Student/teacher names
- System logs and admin notes

---

## 💻 Technical Requirements

### For Students & Teachers

#### Minimum Requirements:
- **Browser**: 
  - Chrome 90+ (Recommended)
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **Internet**: Stable broadband connection (2+ Mbps)
- **Screen**: 1024x768 resolution or higher
- **JavaScript**: Must be enabled
- **Cookies**: Must allow cookies for authentication

#### Recommended for Best Experience:
- **Browser**: Latest Chrome or Firefox
- **Internet**: 5+ Mbps for smooth AR/3D rendering
- **Device**:
  - Desktop/Laptop: 4GB RAM, modern processor
  - Tablet: iPad (6th gen+), Samsung Tab A or equivalent
  - Mobile: Modern smartphone (2018+)

### For AR Features

**Additional Requirements:**
- **Camera**: Device camera (back camera preferred)
- **Camera Permission**: Must allow browser to access camera
- **WebGL**: Browser must support WebGL 2.0
- **HTTPS**: Required for camera access
- **Gyroscope**: For device rotation features (mobile/tablet)

### Browser Permissions Needed

When first using OrganQuest, you'll be asked to allow:
1. **Cookies** - For maintaining login sessions
2. **Local Storage** - For saving preferences
3. **Camera** - For AR scanning features (when used)
4. **Notifications** - For quiz reminders (optional)

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Login Problems

**Issue: "Invalid username or password"**
- ✅ Check username spelling (case-sensitive)
- ✅ Verify password is correct
- ✅ Ensure Caps Lock is OFF
- ✅ Try resetting password (contact teacher/admin)

**Issue: "Session expired"**
- ✅ Your session timed out after inactivity
- ✅ Simply log in again
- ✅ Sessions last 30 days if "Remember Me" is checked

**Issue: Can't access protected pages after logout**
- ✅ This is normal security behavior
- ✅ Use browser's forward button, not back button
- ✅ Log in again to access your content

#### AR Scanner Issues

**Issue: Camera not working**
- ✅ Grant camera permissions in browser settings
- ✅ Check if another app is using the camera
- ✅ Reload the page
- ✅ Try a different browser
- ✅ Ensure you're on HTTPS (secure connection)

**Issue: AR model not appearing**
- ✅ Check internet connection
- ✅ Ensure good lighting conditions
- ✅ Hold device steady
- ✅ Try moving camera slowly around marker
- ✅ Clear browser cache and reload

**Issue: AR model is laggy or slow**
- ✅ Close other browser tabs
- ✅ Close other apps on device
- ✅ Check internet speed
- ✅ Lower graphics quality in settings
- ✅ Try on a more powerful device

#### Quiz Problems

**Issue: Quiz code doesn't work**
- ✅ Verify you entered the code correctly (case-sensitive)
- ✅ Check with teacher if code is still active
- ✅ Ensure quiz type matches (MCQ, Memory, Timed)
- ✅ Check if quiz has expired (due date passed)

**Issue: Quiz won't submit**
- ✅ Check internet connection
- ✅ Ensure all questions are answered
- ✅ Try refreshing the page (progress may be saved)
- ✅ Screenshot your answers and contact teacher

**Issue: Timer not working in timed quiz**
- ✅ Ensure JavaScript is enabled
- ✅ Check if browser tab is active (timer may pause if minimized)
- ✅ Clear cache and try again

#### Teacher-Specific Issues

**Issue: Can't create quiz assignment**
- ✅ Verify all required fields are filled
- ✅ Check date format is correct
- ✅ Ensure max attempts is between 1-10
- ✅ Check your teacher permissions

**Issue: Students not appearing in class list**
- ✅ Verify students are assigned to your grade
- ✅ Check section filter settings
- ✅ Ensure students have registered correctly
- ✅ Refresh the page

**Issue: Email invitations not sending**
- ✅ Verify email address is correct
- ✅ Check spam/junk folder
- ✅ Contact superuser to verify email service is configured
- ✅ Try resending invitation

#### General Technical Issues

**Issue: Page won't load**
- ✅ Check internet connection
- ✅ Clear browser cache and cookies
- ✅ Try different browser
- ✅ Disable browser extensions temporarily
- ✅ Check if server is under maintenance

**Issue: Slow performance**
- ✅ Close unnecessary browser tabs
- ✅ Clear browser cache
- ✅ Check internet speed
- ✅ Update browser to latest version
- ✅ Restart browser

**Issue: Images/models not loading**
- ✅ Wait a moment (large files take time)
- ✅ Check internet connection
- ✅ Disable ad blockers
- ✅ Clear browser cache
- ✅ Try different network

---

## 📞 Getting Help

### For Students:
1. Ask your teacher for assistance
2. Check the "Learn More" section for tutorials
3. Review this manual

### For Teachers:
1. Contact your school's superuser/admin
2. Check the implementation documentation
3. Email technical support (if configured)

### For Technical Administrators:
- Review server logs
- Check database connections
- Verify email service configuration
- Consult `IMPLEMENTATION_SUMMARY.md` and `TEACHER_QUIZ_MODE_IMPLEMENTATION.md`

---

## 📝 Best Practices

### For Students:
- ✅ Use a strong, memorable password
- ✅ Log out when using shared devices
- ✅ Complete quizzes before due dates
- ✅ Explore organs before taking quizzes
- ✅ Use Solo mode to practice
- ✅ Review wrong answers to learn

### For Teachers:
- ✅ Give clear quiz instructions
- ✅ Set reasonable time limits
- ✅ Provide feedback on quiz results
- ✅ Monitor student progress regularly
- ✅ Create varied quiz types for engagement
- ✅ Allow multiple attempts for learning
- ✅ Share quiz codes only with your students
- ✅ Deactivate old quizzes to avoid confusion

### For Administrators:
- ✅ Backup database regularly
- ✅ Monitor system performance
- ✅ Keep software updated
- ✅ Review user reports periodically
- ✅ Configure email service for better teacher onboarding
- ✅ Document any custom configurations

---

## 🎯 Quick Start Guides

### Student Quick Start

1. **Register** → Fill form → Choose avatar
2. **Watch** orientation video
3. **Explore** Scan & Explore menu
4. **Practice** with Solo quizzes
5. **Take** teacher-assigned quizzes with codes
6. **Track** your progress in Quiz History

### Teacher Quick Start

1. **Receive** invitation email from admin
2. **Click** registration link
3. **Choose** username and password
4. **Login** to Teacher Dashboard
5. **Create** quiz assignment
6. **Share** quiz code with students
7. **Monitor** submissions and performance

### Admin Quick Start

1. **Login** with superuser credentials
2. **Navigate** to SuperAdmin Panel
3. **Create/Invite** teachers via email
4. **Monitor** system usage
5. **Generate** reports
6. **Manage** user accounts as needed

---

## 📚 Additional Resources

### Documentation Files:
- `README.md` - Project overview and setup
- `IMPLEMENTATION_SUMMARY.md` - Toast system and testing framework
- `TEACHER_QUIZ_MODE_IMPLEMENTATION.md` - Quiz system technical details
- `TESTING_GUIDE.md` - For developers and testers

### Video Tutorials:
- Platform orientation (shown on Welcome page)
- AR scanner usage
- Quiz taking strategies
- Teacher dashboard walkthrough

---

## 🔄 Version Information

**Current Version:** 2.0
**Last Updated:** December 2025
**Platform Status:** Production

### Recent Updates:
- ✅ Teacher role implementation with email invitations
- ✅ Quiz assignment system with unique codes
- ✅ Bilingual support (English/Filipino)
- ✅ Toast notification system
- ✅ Enhanced AR viewer with interactive hotspots
- ✅ Comprehensive testing framework
- ✅ Teacher quiz mode (Solo vs. Teacher assignments)

---

## 📄 Terms of Use

### Account Security:
- You are responsible for maintaining password confidentiality
- Do not share login credentials
- Report suspicious activity immediately

### Acceptable Use:
- Use platform for educational purposes only
- Respect other users
- Do not attempt to hack or exploit system
- Follow teacher/school guidelines

### Privacy:
- Student data is protected
- Only teachers and admins can view your performance
- Personal information is never shared with third parties

---

## 🏆 Achievements & Gamification

### Unlockable Badges:
- 🌟 **First Explorer** - Complete first organ exploration
- 🧠 **Quiz Master** - Score 100% on any quiz
- 🔥 **7-Day Streak** - Use platform 7 days in a row
- 📚 **Organ Expert** - Explore all organs
- ⚡ **Speed Demon** - Complete timed quiz in under 3 minutes
- 🎯 **Perfect Student** - 100% on 5 quizzes
- 🏅 **Class Leader** - Highest score in your grade

---

## ❓ Frequently Asked Questions (FAQ)

### General Questions

**Q: Is OrganQuest free to use?**
A: Yes, for students and teachers at participating schools.

**Q: Can I use OrganQuest on my phone?**
A: Yes! OrganQuest is fully responsive and works on mobile devices.

**Q: Do I need to install anything?**
A: No, it's a web application. Just use your browser!

**Q: Which browser works best?**
A: Google Chrome is recommended for the best experience.

### Account Questions

**Q: I forgot my password. What do I do?**
A: Contact your teacher or admin to reset it.

**Q: Can I change my username?**
A: No, usernames are permanent. Choose carefully during registration.

**Q: How do I delete my account?**
A: Contact your teacher or admin for account deletion.

**Q: Can I have multiple accounts?**
A: No, one account per student.

### Quiz Questions

**Q: Can I retake a quiz in Solo mode?**
A: Yes, Solo mode allows unlimited attempts.

**Q: How many times can I take a teacher-assigned quiz?**
A: It depends on the teacher's settings (usually 1-3 attempts).

**Q: What happens if I close the browser during a quiz?**
A: Your progress may be lost. Always complete quizzes in one session.

**Q: Can I see which questions I got wrong?**
A: Yes, after submitting, you can review all answers and explanations.

### Teacher Questions

**Q: How long is a quiz code valid?**
A: Until the due date or until you deactivate it.

**Q: Can I edit a quiz after creating it?**
A: You can edit details but not questions. Delete and recreate if needed.

**Q: How do I give students extra attempts?**
A: Use the "Reset Attempts" button in student details.

**Q: Can students see each other's scores?**
A: No, scores are private between student and teacher.

---

## 🎓 Conclusion

OrganQuest is designed to make learning human anatomy an exciting adventure. Whether you're a student exploring the human body for the first time, a teacher creating engaging assignments, or an administrator managing the platform, this manual should guide you through all features and functionalities.

**Happy Learning! 🎉**

---

*For technical support or questions not covered in this manual, please contact your school administrator or IT support team.*

**OrganQuest Development Team**
Version 2.0 - December 2025
