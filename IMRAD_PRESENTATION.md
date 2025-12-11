# OrganQuest: AR-Powered Anatomy Education for Grade 4-6 Learners
## IMRAD Research Presentation

---

## I. INTRODUCTION

Domanpot Community School teaches anatomy using traditional methods: textbooks, chalkboard drawings, and 2D diagrams. This creates five key problems:

1. **Low engagement** - students find lectures boring
2. **Visualization difficulty** - hard to imagine 3D organs from 2D pictures
3. **Poor retention** - students forget anatomical terms quickly
4. **No resources** - no anatomical models or digital tools
5. **Comprehension gaps** - medical terms too complex for younger students

### Research Objectives
Develop OrganQuest: an AR-powered educational app for Grade 4-6 students

**Specific Goals:**
1. Document current teaching methods
2. Identify teaching problems
3. Define system requirements
4. Implement using Agile methodology
5. Evaluate system usability

### Theoretical Basis
- **Constructivist Learning Theory** - students learn by active exploration
- **Multimedia Learning Theory** - combining visuals + text improves learning
- **Game-Based Learning Theory** - gamification increases engagement
- **Cognitive Load Theory** - simplify content to avoid overwhelming students

---

## II. METHODS

### Research Design
Descriptive research + Agile Software Development (8 two-week sprints, March-October 2024)

### Participants
**74 respondents** from Domanpot Community School:
- 70 Students (Grade 4-6)
- 3 Science Teachers
- 1 Principal

### Data Collection

1. **Interviews** - teachers and principal about current teaching methods
2. **Document Analysis** - DepEd curriculum guides for Grade 4-6 science
3. **Usability Questionnaire** - 8 questions, 5-point Likert scale
4. **Classroom Observations** - 3 pilot sessions with field notes
5. **Functional Testing** - all features tested on multiple devices

### Development Process

**Technology Stack:**
- Frontend: React 18.2 + Vite
- AR: AR.js + Three.js
- Backend: Node.js + Express
- Database: MongoDB
- Styling: Tailwind CSS

**Agile Phases:**
1. **Planning** - interviews identified 5 key problems
2. **Design** - wireframes with child-friendly UI
3. **Development** - built 15 organ models, 3 quiz types, bilingual content
4. **Testing** - 3 classroom pilots with students
5. **Improvement** - refined based on feedback

### Key Features Implemented

**For Students:**
- 15 interactive 3D organs (5 with cross-sections)
- 3 quiz types: Multiple Choice, Memory Match, Timed Challenge
- Bilingual support (English/Filipino with 457 translations)
- Avatar customization
- Progress tracking

**For Teachers:**
- Student analytics dashboard
- Custom quiz creator
- Class management
- Performance reports

**Technical:**
- JWT authentication
- Offline quiz mode
- Touch controls (rotate, zoom, pan)
- Responsive design (desktop, tablet, mobile)

---

## III. RESULTS

### 1. Current Teaching Process

Teachers use traditional methods:
- Textbook lessons with 2D diagrams
- Chalkboard drawings
- Verbal explanations
- Written tests for assessment

### 2. Problems Identified

| Problem | Impact |
|---------|--------|
| **Low Engagement** | Students find lectures boring, high distraction |
| **Visualization Difficulty** | Can't imagine 3D organs from 2D pictures |
| **Poor Retention** | Forget anatomical terms within days |
| **No Resources** | No models, no digital tools, limited budget |
| **Comprehension Gaps** | Medical terms too complex for younger students |

### 3. System Successfully Delivered

**Organs:** 15 interactive 3D models (heart, brain, lungs, liver, kidney, eyes, stomach, intestine, pancreas, spleen, diaphragm, bladder, thyroid, tongue, pelvis-femur)

**Quizzes:** 3 modes with 669 questions total
- Multiple Choice (untimed, immediate feedback)
- Memory Matching (pair-matching game)
- Timed Challenge (30-second countdown)

**Languages:** Complete English/Filipino translation (457 strings)

**Users:** Students, Teachers, Superusers with role-based access

### 4. Usability Evaluation (n=74)

| Question | Mean | Rating |
|----------|------|--------|
| Easy to use | 4.47 | Strongly Agree |
| Found features easily | 4.46 | Strongly Agree |
| **Activities were fun** | **4.77** | **Strongly Agree** |
| AR organs were clear | 4.56 | Strongly Agree |
| Helped me learn | 4.76 | Strongly Agree |
| Design looked nice | 4.70 | Strongly Agree |
| Quiz was understandable | 4.41 | Strongly Agree |
| Want to use again | 4.59 | Strongly Agree |

**Overall Score: 4.59** (Strongly Agree)

**Key Findings:**
- 100% scored above 4.0 (positive experience)
- Highest: "Activities were fun" (4.77)
- Lowest: "Quiz understandable" (4.41) - still strong agreement
- 68% of students chose Timed Challenge mode first
- 57% preferred Filipino language
- 22% needed AR scanning demonstration initially

---

## IV. DISCUSSION

### Student Engagement Success

The highest score (4.77) for "Activities were fun" proves gamification works for elementary anatomy education. Key factors:
- **3 quiz modes** appeal to different learning styles
- **Timed Challenge** created exciting competition (68% chose it first)
- **Immediate feedback** kept students motivated
- Students asked to skip recess to keep playing

This validates **Game-Based Learning Theory** - making learning fun increases participation and retention.

### AR Solved Visualization Problem

Score 4.56 for AR clarity shows the technology successfully addressed the main teaching problem. Students could:
- Rotate organs to see all angles
- Zoom into details
- View cross-sections of 5 major organs
- Explore at their own pace

This confirms **Multimedia Learning Theory** - combining 3D visuals with text helps students understand better than 2D diagrams alone.

### Easy to Use Despite New Technology

Elementary students adapted quickly (4.47 ease of use) because:
- Large buttons sized for small fingers (44x44px minimum)
- Simple vocabulary at Grade 4-6 reading level
- Bright colors and fun avatars
- Features introduced gradually

This applies **Cognitive Load Theory** - keeping the interface simple prevents overwhelming young learners.

### Educational Value Confirmed

Strong agreement (4.76) that OrganQuest "helped me learn" shows students perceived real educational benefit. Supporting evidence:
- Teachers reported higher engagement than textbook lessons
- Students naturally helped each other (peer teaching)
- Progress tracking motivated self-improvement
- 57% chose Filipino showing native language support matters

### Comparison with Existing Apps

| Feature | Medical Apps* | OrganQuest |
|---------|--------------|------------|
| Target Audience | Medical students | Grade 4-6 |
| Content Level | Professional | Age-appropriate |
| Language | English only | English + Filipino |
| Quizzes | Limited/None | 3 game modes |
| Teacher Tools | No | Yes (dashboard, assignments) |
| Cost | Subscription | Free |

*Human Anatomy Atlas, BioDigital Human

OrganQuest is the only AR anatomy app specifically designed for Philippine elementary education with curriculum-aligned content and bilingual support.

### Agile Methodology Worked Well

8 two-week sprints with teacher feedback ensured the system met real classroom needs:
- Early prototypes caught usability issues
- Teachers prioritized which features to build first
- 3 pilot sessions revealed problems before full deployment
- Iterative improvements made UI more child-friendly

Traditional waterfall development would have missed these insights.

### Study Limitations

1. **No learning outcome measurement** - studied usability, not actual knowledge gains. Need pretest-posttest comparison in future.

2. **Single school sample** - results from Domanpot may not apply to urban schools with different resources.

3. **Short evaluation** - 3 weeks may show novelty effect. Need year-long study for sustained impact.

4. **Device requirements** - needs Android 7.0+ with ARCore. Not all schools can afford tablets.

5. **Self-reported data** - students may give positive answers to please teachers. Need objective measures like quiz scores.

### Key Insights

**What Worked:**
- AR visualization solved 3D understanding problem
- Gamification made anatomy fun
- Bilingual support increased accessibility
- Teacher dashboard enabled progress monitoring

**Unexpected Findings:**
- Students preferred timed mode (originally designed as "advanced")
- 57% chose Filipino despite English instruction
- Peer teaching emerged naturally
- Students experienced "time distortion" (flow state)

**What Needs Improvement:**
- 22% needed AR scanning help initially → add tutorial video
- Quiz vocabulary too complex for some Grade 4 students → simplify wording
- Device sharing reduced practice time → need more tablets

### Design Principles Validated

For successful educational AR:
1. Match interface to student age (large buttons, simple words)
2. Offer multiple learning paths (different quiz types)
3. Provide immediate feedback (real-time quiz responses)
4. Include native language options (cultural relevance)
5. Empower teachers with tools (not just student features)

---

**Pangasinan State University - Asingan Campus**  
**Bachelor of Science in Information Technology**  
**December 2025**
