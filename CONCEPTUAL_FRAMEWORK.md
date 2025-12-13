# OrganQuest Conceptual Framework

## Development Methodology: **AGILE (Scrum)**

---

## Conceptual Framework Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           AGILE DEVELOPMENT PROCESS FLOW                                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌─────────────────────┐         ┌────────────┐         ┌─────────────────────┐
    │          │         │                     │         │            │         │                     │
    │   USER   │────────>│  DATA GATHERING     │────────>│ DEVELOPER  │────────>│ AGILE METHODOLOGY   │
    │          │         │  (On Users)         │         │            │         │                     │
    └──────────┘         └─────────────────────┘         └────────────┘         └─────────────────────┘
        ▲                  • Interviews                     • Planning              • 2-week Sprints
        │                  • Observations                   • Design                • Daily Standups
        │                  • Surveys (n=74)                 • Development           • Sprint Reviews
        │                  • Teacher Feedback               • Testing               • Retrospectives
        │                  • Student Testing                • Deployment            • Continuous Integration
        │                                                                                      │
        │                                                                                      │
        │                                                                                      ▼
        │                ┌─────────────────────────────────────────────────────────────────────────────────┐
        │                │                                  OUTPUT                                          │
        │                │                                                                                  │
        │                │    ╔═══════════════════════════════════════════════════════════════════════╗    │
        │                │    ║                                                                       ║    │
        │                │    ║              OrganQuest: AR-Powered Interactive                       ║    │
        │                │    ║           Human Anatomy Learning Platform for                         ║    │
        │                │    ║                    Grade 4-6 Learners                                 ║    │
        │                │    ║                                                                       ║    │
        │                │    ╚═══════════════════════════════════════════════════════════════════════╝    │
        │                │                                                                                  │
        │                │    Features:                                                                     │
        │                │    ✓ 15 Interactive 3D Organs (5 with cross-sections)                           │
        │                │    ✓ AR Scanner with marker-based tracking                                      │
        │                │    ✓ 3 Quiz Types (Multiple Choice, Memory Match, Timed Challenge)             │
        │                │    ✓ Teacher Dashboard with Analytics                                           │
        │                │    ✓ Bilingual Support (English/Filipino - 457 translations)                    │
        │                │    ✓ Progress Tracking & Gamification                                           │
        │                │    ✓ Custom Quiz Creator for Teachers                                           │
        │                │    ✓ Student Performance Reports                                                │
        │                └─────────────────────────────────────────────────────────────────────────────────┘
        │                                                    │
        │                                                    │
        │                ┌───────────────────────────────────┘
        │                │
        │                ▼
        │         ┌─────────────────────┐
        │         │                     │
        └─────────│     FEEDBACK        │
                  │                     │
                  └─────────────────────┘
                    • User Testing
                    • Teacher Evaluation
                    • Student Usability
                    • Performance Metrics
                    • Iterative Improvements
```

---

## Detailed Process Flow

### 1. **USER** (Stakeholders)
- **Primary Users:** Grade 4-6 Students (ages 9-12)
- **Secondary Users:** Teachers (Science educators)
- **Tertiary Users:** School Administrators

### 2. **DATA GATHERING (On Users)**
**Methods Used:**
- Semi-structured interviews with teachers (n=5)
- Classroom observations
- Needs assessment surveys
- Problem identification sessions
- User requirements analysis

**Findings:**
- Students struggle with abstract anatomy concepts
- Textbooks are too technical and boring
- Need for visual and interactive learning
- Language barrier (English-only materials)
- Teachers need tools to track student progress

### 3. **DEVELOPER** (Development Team)
**Activities:**
- Requirements documentation
- System architecture design
- Technology stack selection:
  - Frontend: React 18.2 + Vite
  - Backend: Node.js + Express
  - Database: MongoDB
  - AR: AR.js + Three.js
- UI/UX design (child-friendly interface)
- Modular component development
- API integration

### 4. **AGILE METHODOLOGY** (Development Framework)

#### **Why Agile?**
✓ Flexible to changing requirements  
✓ Continuous user feedback integration  
✓ Incremental feature delivery  
✓ Rapid prototyping and testing  
✓ Risk mitigation through iterations  

#### **Sprint Breakdown (8 Sprints × 2 Weeks = 16 Weeks)**

**Sprint 1-2: Foundation**
- User authentication system
- Basic React structure
- MongoDB database setup
- Student registration flow
- 5 basic organ components

**Sprint 3-4: Core Features**
- AR Scanner implementation
- 15 organ 3D models
- Quiz system (Multiple Choice)
- Progress tracking
- Avatar customization

**Sprint 5-6: Enhanced Learning**
- Memory Matching game
- Timed Challenge quiz
- Interactive 3D viewer
- Sound effects and animations
- Cross-sectional organ models

**Sprint 7-8: Teacher Tools**
- Teacher role implementation
- Admin dashboard
- Quiz assignment system
- Student analytics
- Performance reports
- Email invitation system

**Sprint 9-10: Polish & Localization**
- Bilingual support (English/Filipino)
- Toast notification system
- Testing framework (Jest)
- Responsive mobile design
- Performance optimization

#### **Agile Practices Applied:**
- **Daily Standups:** Team coordination
- **Sprint Planning:** Feature prioritization
- **Sprint Reviews:** Demo to stakeholders
- **Retrospectives:** Process improvement
- **Continuous Integration:** Automated testing
- **User Stories:** Feature documentation
- **Burndown Charts:** Progress tracking

### 5. **FEEDBACK** (Continuous Evaluation)

**Feedback Loops:**
1. **Teacher Feedback (Weekly)**
   - Feature usability
   - Content accuracy
   - Classroom applicability

2. **Student Testing (Per Sprint)**
   - UI/UX testing
   - Quiz difficulty assessment
   - AR scanner usability

3. **Pilot Testing (3 Sessions)**
   - Classroom deployment
   - Real-world usage
   - Bug identification

4. **Usability Study (n=74 participants)**
   - System Usability Scale (SUS)
   - Performance metrics
   - User satisfaction surveys

**Improvements Made from Feedback:**
- Simplified quiz interface for younger students
- Added Filipino language after teacher request
- Reduced AR marker complexity
- Implemented color-coding for organ systems
- Added tutorial videos
- Increased font sizes for readability

### 6. **OUTPUT** - OrganQuest System

**Final Deliverables:**

**Technical Output:**
- Fully functional web application
- 15 interactive 3D organ models
- Responsive design (desktop, tablet, mobile)
- RESTful API backend
- MongoDB database with user management
- JWT authentication system
- 22 automated tests (Jest)

**Educational Content:**
- 3 quiz types with 100+ questions
- 457 bilingual translations
- Interactive hotspots on organs
- Educational explanations
- Cross-sectional anatomy views

**Teacher Tools:**
- Student analytics dashboard
- Custom quiz creator
- Assignment management
- Performance tracking
- Class management

**Documentation:**
- User Manual (943 lines)
- Testing Guide
- Implementation Summary
- API Documentation
- Deployment Guide

---

## Agile Principles Demonstrated

| Agile Principle | Implementation in OrganQuest |
|-----------------|------------------------------|
| **Working Software** | Deployable system after each sprint |
| **Customer Collaboration** | Weekly teacher meetings, 3 pilot sessions |
| **Responding to Change** | Added teacher role mid-development, bilingual support |
| **Iterative Delivery** | 8 two-week sprints with incremental features |
| **Continuous Improvement** | Toast system, testing framework added post-MVP |
| **Self-Organizing Team** | Cross-functional development (full-stack) |
| **Face-to-Face Communication** | Teacher interviews, student testing sessions |
| **Sustainable Development** | Maintained code quality with testing framework |
| **Technical Excellence** | Component-based architecture, clean code practices |
| **Simplicity** | User-friendly UI focused on core learning objectives |

---

## Comparison with Other Methodologies

| Aspect | Waterfall | RAD | **Agile (Used)** | Spiral |
|--------|-----------|-----|------------------|--------|
| **Flexibility** | Low | Medium | ✓ High | Medium |
| **User Feedback** | End only | Limited | ✓ Continuous | Per cycle |
| **Time to Market** | Long | Fast | ✓ Incremental | Long |
| **Risk Management** | High risk | Medium | ✓ Low risk | Low risk |
| **Documentation** | Heavy | Light | ✓ Balanced | Heavy |
| **Best for** | Fixed requirements | Prototypes | ✓ Educational software | Critical systems |

---

## Conclusion

The **Agile methodology** was chosen for OrganQuest because:

1. **Educational software requires continuous feedback** from teachers and students
2. **Requirements evolved** as we learned more about user needs
3. **Iterative testing** caught usability issues early
4. **Feature prioritization** ensured most important tools were built first
5. **Rapid adaptation** to classroom feedback improved educational outcomes

**Result:** A successful system that meets real classroom needs, validated by 74 users, with continuous improvement based on actual usage data.

---

*Framework validated through 8 two-week sprints, 3 pilot sessions, and usability testing with 74 participants.*
