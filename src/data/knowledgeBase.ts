import type { Category, DeadlineItem, DepartmentContact } from '../types/chat.ts';

export interface FAQItem {
  id: string;
  category: Category;
  title: string;
  keywords: string[];
  questionVariations: string[];
  summary: string;
  detailedAnswer: string;
  policyCode: string;
  sources: { title: string; section: string; code?: string }[];
  suggestedFollowUps: string[];
  widgetType?: 'deadline-timer' | 'certificate-stepper' | 'internship-checklist' | 'course-prereq' | 'appointment-booking';
  widgetData?: any;
}

export const DEPARTMENT_DIRECTORY: DepartmentContact[] = [
  {
    id: 'dept-registrar',
    department: 'Office of the University Registrar',
    officer: 'Dr. Eleanor Vance, University Registrar',
    title: 'Transcripts, Add/Drop Records, Grade Verification',
    room: 'Administration Hall, Room 101',
    phone: '+1 (555) 019-4821',
    email: 'registrar@metrostate.edu',
    officeHours: 'Mon - Fri: 8:30 AM - 4:30 PM'
  },
  {
    id: 'dept-tnp',
    department: 'Career & Industry Placement Cell (T&P)',
    officer: 'Prof. Marcus Brody, Director of Corporate Relations',
    title: 'Internship NOC, Capstone Credits, Employer Clearance',
    room: 'Technology Tower B, Suite 305',
    phone: '+1 (555) 019-4845',
    email: 'placements@metrostate.edu',
    officeHours: 'Mon - Fri: 9:00 AM - 5:00 PM'
  },
  {
    id: 'dept-advising',
    department: 'Undergraduate Academic Advising Center',
    officer: 'Dean Arthur Pendelton, Dean of Academic Services',
    title: 'Prerequisite Overrides, Credit Overloads, Degree Audits',
    room: 'Student Union, 2nd Floor East',
    phone: '+1 (555) 019-4870',
    email: 'academic.advising@metrostate.edu',
    officeHours: 'Mon - Thu: 9:00 AM - 6:00 PM; Fri: 9:00 AM - 2:00 PM'
  },
  {
    id: 'dept-bursar',
    department: 'Office of Student Accounts & Bursar',
    officer: 'Mrs. Cynthia Sterling, Bursar',
    title: 'Tuition Assessment, Payment Plans, Late Fee Waivers',
    room: 'Finance Pavilion, Counter 4',
    phone: '+1 (555) 019-4899',
    email: 'bursar@metrostate.edu',
    officeHours: 'Mon - Fri: 8:00 AM - 4:00 PM'
  }
];

export const DEADLINES: DeadlineItem[] = [
  {
    id: 'dl-add-drop',
    title: 'Fall Semester Course Adjustment (Add/Drop) Deadline',
    category: 'academic',
    dueDate: '2026-10-24T23:59:59',
    timestamp: new Date('2026-10-24T23:59:59').getTime(),
    description: 'Final date to add or drop lecture/laboratory sections with 100% tuition adjustment and zero transcript record.',
    urgency: 'high',
    bylawCode: 'REG-BYLAW-4.14'
  },
  {
    id: 'dl-fee-payment',
    title: 'Semester Tuition & Institutional Fee Settlement',
    category: 'financial',
    dueDate: '2026-11-05T23:59:59',
    timestamp: new Date('2026-11-05T23:59:59').getTime(),
    description: 'Final day to settle semester charges without late assessment. A non-negotiable $50.00 weekly surcharge takes effect thereafter.',
    urgency: 'high',
    bylawCode: 'FIN-REG-2.08'
  },
  {
    id: 'dl-midterm',
    title: 'Fall Term Mid-Semester Examination Convocation',
    category: 'academic',
    dueDate: '2026-11-10T09:00:00',
    timestamp: new Date('2026-11-10T09:00:00').getTime(),
    description: 'Centralized proctored mid-term examination session begins across departments through Nov 18.',
    urgency: 'medium',
    bylawCode: 'EXAM-CODE-102'
  },
  {
    id: 'dl-noc-internship',
    title: 'Spring Industrial Internship NOC Filing Deadline',
    category: 'internship',
    dueDate: '2026-11-20T17:00:00',
    timestamp: new Date('2026-11-20T17:00:00').getTime(),
    description: 'Last day to submit corporate offer letters for departmental vetting and HOD endorsement for Spring semester placements.',
    urgency: 'medium',
    bylawCode: 'TNP-DIRECTIVE-2026-08'
  },
  {
    id: 'dl-withdrawal',
    title: 'Official Course Withdrawal Period (Grade "W") Closes',
    category: 'academic',
    dueDate: '2026-11-28T23:59:59',
    timestamp: new Date('2026-11-28T23:59:59').getTime(),
    description: 'Last opportunity to withdraw with transcript notation "W" (GPA neutral). Subsequent exits receive standard letter grading (A through F).',
    urgency: 'normal',
    bylawCode: 'REG-BYLAW-4.22'
  },
  {
    id: 'dl-thesis',
    title: 'Undergraduate Capstone & Masters Thesis Archival Filing',
    category: 'academic',
    dueDate: '2026-12-15T18:00:00',
    timestamp: new Date('2026-12-15T18:00:00').getTime(),
    description: 'Repository upload deadline for faculty-signed dissertation PDFs and institutional Turnitin plagiarism clearance certificates.',
    urgency: 'normal',
    bylawCode: 'GRAD-SENATE-14'
  },
  {
    id: 'dl-graduation',
    title: 'Interdepartmental No-Dues Clearance for Convocation',
    category: 'graduation',
    dueDate: '2026-12-20T17:00:00',
    timestamp: new Date('2026-12-20T17:00:00').getTime(),
    description: 'Mandatory closure of Library, Laboratory, Housing, and Accounts ledgers required for Provisional Degree Conferral.',
    urgency: 'normal',
    bylawCode: 'COMMENCE-STATUTE-1.04'
  }
];

export const KNOWLEDGE_BASE: FAQItem[] = [
  // --- COURSES ---
  {
    id: 'faq-course-add-drop',
    category: 'courses',
    title: 'Course Add/Drop Period, Late Withdrawal, and Financial Adjustments',
    keywords: ['add', 'drop', 'registration', 'course change', 'enrollment', 'deadline', 'credits', 'refund', 'w grade', 'withdrawal'],
    questionVariations: [
      'When is the deadline to add or drop a course?',
      'How do I drop a course without affecting my GPA?',
      'Will I receive a tuition refund if I drop a class in November?',
      'What is the difference between dropping a course and withdrawing?'
    ],
    summary: 'The official Add/Drop window closes on October 24, 2026 (11:59 PM) with 100% fee adjustment and no transcript mark. Drops from Oct 25 to Nov 28 receive a Grade W (no refund, zero GPA impact).',
    detailedAnswer: `### Office of the Registrar: Course Enrollment Regulations

**Governing Regulation: University Senate Bylaw § 4.14**

1. **Regular Add/Drop Deadline**: **October 24, 2026 at 11:59 PM EST**.
   - **Academic Record**: Courses dropped prior to or on this date are expunged completely from your academic dossier and do not appear on official transcripts.
   - **Financial Refund**: 100% tuition liability adjustment is processed automatically through the Bursar's Office.
   - **Self-Service Execution**: Submit via **Student Portal > Academics > Enrollment Management > Drop Course**.

2. **Late Withdrawal Period (Grade "W")**: **October 25 – November 28, 2026**.
   - **Transcript Notation**: Course remains recorded with permanent notation **"W" (Withdrawn)**.
   - **GPA Neutrality**: The "W" grade carries no quality points and is not computed in your Semester or Cumulative GPA.
   - **Financial Policy**: In accordance with Finance Directive § 2.08, zero tuition refund is provided for withdrawals initiated after October 24.

3. **Semester Load Limitations**:
   - **Full-Time Mandate**: Minimum **12.0 credit hours** (critical for international F-1 visa compliance and NCAA eligibility).
   - **Maximum Standard Cap**: **18.0 credit hours**. Overloads up to **21.0 credit hours** require a Dean's Petition with minimum CGPA $\\ge 3.50$.`,
    policyCode: 'REG-BYLAW-4.14',
    sources: [
      { title: 'University Undergraduate Academic Catalog 2026-2027', section: 'Chapter 4: Academic Regulations', code: 'REG-BYLAW-4.14' },
      { title: 'Office of the Bursar Institutional Tuition Policy', section: 'Section 2.08: Refund Schedules', code: 'FIN-REG-2.08' }
    ],
    suggestedFollowUps: [
      'What are the prerequisites for AI and Machine Learning (CS350)?',
      'What is the maximum credit overload permitted per semester?',
      'How do I file a petition for a prerequisite waiver?'
    ],
    widgetType: 'deadline-timer',
    widgetData: {
      targetDate: '2026-10-24T23:59:59',
      title: 'Course Adjustment Period Closes In'
    }
  },
  {
    id: 'faq-course-prereq',
    category: 'courses',
    title: 'Course Prerequisite Chains, Syllabi Verification, and Academic Waivers',
    keywords: ['prerequisite', 'prereq', 'cs350', 'cs201', 'machine learning', 'math220', 'waiver', 'syllabus', 'grade requirement'],
    questionVariations: [
      'What are the prerequisites for AI & Machine Learning (CS350)?',
      'Can I enroll in an advanced course if I took an equivalent course elsewhere?',
      'How do I submit a Prerequisite Waiver Petition?',
      'What minimum grade is required in prerequisite subjects?'
    ],
    summary: 'CS350 (AI & Machine Learning) requires CS201 (Data Structures) and MATH220 (Linear Algebra) with minimum Grade C. Prerequisite waivers require Department Chair endorsement.',
    detailedAnswer: `### Department of Computer Science: Course Sequence Architecture

**Governing Directive: Academic Curriculum Handbook § 3.02**

- **CS350: Foundations of Artificial Intelligence & Machine Learning (4.0 Credits)**:
  - **Prerequisite 1**: **CS201 Data Structures & Algorithms** (Completed with Grade **C (2.0)** or higher).
  - **Prerequisite 2**: **MATH220 Linear Algebra & Matrix Analysis** (Completed with Grade **C (2.0)** or higher).
  - **Recommended Corequisite**: **MATH310 Applied Probability & Statistics**.

- **CS201: Data Structures & Algorithms (4.0 Credits)**:
  - **Prerequisite**: **CS101 Introduction to Object-Oriented Programming** (Grade C or higher).

**Prerequisite Waiver Petition Procedure**:
Students possessing transferable AP credits, verified industry certifications, or equivalent coursework completed at accredited institutions may file an **Academic Prerequisite Waiver Petition**:
1. Download Form **ACAD-WVR-2026** from the Registrar Document Depository.
2. Attach official syllabus documentation and transcript proving equivalent mastery.
3. Secure the written endorsement of the course instructor and submit to the Department Chair (Room 305) no later than **October 22, 2026**.`,
    policyCode: 'ACAD-CURR-3.02',
    sources: [
      { title: 'Faculty of Computing & Information Sciences Curriculum Guide', section: 'Course Pathways', code: 'CS-DEPT-2026' }
    ],
    suggestedFollowUps: [
      'How to request an advisor appointment for registration overrides?',
      'When is the course add/drop deadline?',
      'Can I take 21 credits in one semester?'
    ],
    widgetType: 'course-prereq',
    widgetData: {
      courseCode: 'CS350',
      courseName: 'Artificial Intelligence & Machine Learning',
      prerequisites: ['CS201 Data Structures (Min Grade C)', 'MATH220 Linear Algebra (Min Grade C)']
    }
  },
  {
    id: 'faq-credit-overload',
    category: 'courses',
    title: 'Semester Credit Allocation, Underload Approvals, and Dean Overloads',
    keywords: ['credits', 'overload', 'underload', '21 credits', 'gpa requirement', 'minimum credits'],
    questionVariations: [
      'How many credits can an undergraduate student take in a single term?',
      'What GPA is needed to register for 21 credits?',
      'Can graduating seniors take fewer than 12 credits?'
    ],
    summary: 'Standard full-time enrollment is 12 to 18 credits. Registering for 19–21 credits requires Dean approval with CGPA >= 3.50. Underloads (<12 credits) are only permitted in the graduating semester.',
    detailedAnswer: `### Dean of Academic Services: Credit Threshold Regulations

**Bylaw Reference: Institutional Statute § 2.19**

1. **Full-Time Resident Status**:
   - Must be enrolled in a minimum of **12.0 semester credit hours**.
   - *International Students (F-1)*: Must preserve 12+ on-campus credits continuously to safeguard SEVIS visa standing.

2. **Standard Term Ceiling**:
   - Capped at **18.0 semester credit hours** without institutional surcharge.

3. **Credit Overload Petition (19.0 to 21.0 Credits)**:
   - Permitted strictly for matriculated students with a **Cumulative GPA $\\ge 3.50$** and no historical course failures.
   - Requires formal sign-off from your Academic Faculty Advisor and Dean of Undergraduate Studies.

4. **Senior Underload Exemption**:
   - Graduating seniors needing fewer than 12 credits to satisfy all degree requirements may file a **Senior Reduced Course Load Petition** before the semester Census Date.`,
    policyCode: 'ACAD-LOAD-2.19',
    sources: [
      { title: 'Undergraduate Academic Policy Handbook', section: 'Statute 2.19: Term Workloads', code: 'ACAD-LOAD-2.19' }
    ],
    suggestedFollowUps: [
      'When is the course Add/Drop deadline?',
      'How do I schedule an appointment with an Academic Advisor?'
    ]
  },

  // --- INTERNSHIPS ---
  {
    id: 'faq-internship-noc',
    category: 'internships',
    title: 'Off-Campus Internship No Objection Certificate (NOC) Protocol & Verification',
    keywords: ['noc', 'no objection certificate', 'internship', 't&p cell', 'offer letter', 'cgpa requirement', 'placement', 'training'],
    questionVariations: [
      'What is the procedure to receive an Internship NOC?',
      'What is the minimum CGPA required for internship clearance?',
      'Can I accept an internship if I have an active backlog?',
      'How long does the Training & Placement Cell take to issue an NOC?'
    ],
    summary: 'Apply via the T&P Portal with a formal offer letter detailing stipend, working hours, and duration. Requires junior/senior standing, minimum 6.50 CGPA, and zero active backlogs. Turnaround is 3 business days.',
    detailedAnswer: `### Career & Industry Placement Cell: Industrial Internship Directive

**Institutional Mandate: T&P Directive 2026/08**

An official University **No Objection Certificate (NOC)** is mandatory for all off-campus internships, corporate apprenticeships, and government research fellowships.

#### Mandatory Institutional Eligibility Thresholds:
1. **Academic Class Standing**: Must be currently enrolled in **Year 3 (Junior) or Year 4 (Senior)**.
2. **Academic Merit**: Cumulative Grade Point Average (**CGPA**) must be **6.50 or higher** on a 10.0 point scale (or 2.60 on a 4.0 scale).
3. **Standing Clearances**: Zero un-cleared course backlogs and zero disciplinary or academic integrity sanctions on file.

#### Formal Application Workflow:
1. **Document Verification**: Secure an official corporate offer letter printed on company letterhead containing:
   - Exact start date and concluding date.
   - Designated supervisor contact details, corporate registration ID, and physical/remote work format.
   - Formal monthly stipend amount (University baseline expectation: $\\ge \\$500/month or equivalent).
2. **Portal Submission**:
   - Navigate to **T&P Portal > Student Services > Industrial Training > Request Formal NOC**.
   - Upload the offer letter PDF alongside your latest unofficial transcript.
3. **Multi-Tier Endorsement Flow**:
   - Faculty Internship Mentor performs preliminary review (24 hours).
   - Department Head (HOD) executes electronic authorization.
   - The verified, cryptographically sealed NOC PDF bearing the University Registrar seal is released to your student portal within **3 business days**.`,
    policyCode: 'TNP-DIRECTIVE-2026-08',
    sources: [
      { title: 'Training & Placement Manual of Policies and Protocols', section: 'Directive 2026/08', code: 'TNP-DIRECTIVE-2026-08' }
    ],
    suggestedFollowUps: [
      'How many academic credits do I earn for an internship?',
      'What are the regulations governing remote internships during the semester?',
      'When is the submission deadline for Spring internship NOCs?'
    ],
    widgetType: 'internship-checklist',
    widgetData: {
      steps: [
        { label: 'CGPA Validation (>= 6.50)', completed: true },
        { label: 'Corporate Offer Letter with Duration & Stipend', completed: false },
        { label: 'T&P Portal Filing', completed: false },
        { label: 'Department Head (HOD) Seal', completed: false }
      ]
    }
  },
  {
    id: 'faq-internship-credits',
    category: 'internships',
    title: 'Internship Academic Credit Transfer, Defense Panels, and Grading Scales',
    keywords: ['credits', 'evaluation', 'defense', 'viva', 'capstone', '8th semester', 'grading'],
    questionVariations: [
      'How many degree credits does an internship substitute for?',
      'How is an internship evaluated and graded?',
      'What documentation must I submit upon completing my internship?'
    ],
    summary: 'Summer internships (8 weeks) earn 4.0 academic credits. Full 8th-semester capstone internships earn 12.0 credits upon submission of a bi-weekly journal, supervisor evaluation, and oral defense.',
    detailedAnswer: `### Faculty Academic Board: Experiential Learning Credit Guidelines

**Curriculum Bylaw Reference: § 6.11 (Experiential Learning)**

1. **Summer Internship Module (Minimum 8 Consecutive Weeks)**:
   - **Academic Value**: **4.0 Degree Credits**.
   - **Deliverables**: Bi-weekly technical activity logs approved by employer, mid-point supervisor rating form, and a comprehensive 20-page technical monograph.
   - **Defense**: Oral viva presented before the departmental faculty panel during Week 2 of the subsequent Fall semester.

2. **Final Semester Capstone Industrial Practicum (6 Months)**:
   - **Academic Value**: **12.0 Degree Credits** (substitutes for departmental electives and senior capstone thesis).
   - **Eligibility**: Reserved strictly for 8th-semester graduating candidates.
   - **Evaluation**: Graded on standard letter grades (A through F) computed into your final graduation Cumulative GPA.`,
    policyCode: 'ACAD-EXP-6.11',
    sources: [
      { title: 'University Curriculum Board Handbook', section: 'Article 6: Practicum Modules', code: 'ACAD-EXP-6.11' }
    ],
    suggestedFollowUps: [
      'How do I file for an internship NOC?',
      'Can I work full-time in my 8th semester?'
    ]
  },
  {
    id: 'faq-internship-remote',
    category: 'internships',
    title: 'Remote Internship Mandates, Class Attendance Compliance, and Hourly Limits',
    keywords: ['remote', 'work from home', 'attendance', 'hours', '20 hours', '75 percent'],
    questionVariations: [
      'Are students permitted to work remote internships during teaching weeks?',
      'What is the maximum allowed hours for an internship during the term?',
      'Does an internship excuse class absences?'
    ],
    summary: 'In-semester remote internships are strictly limited to 20 hours per week. Attendance in lecture and lab classes must remain above 75.0%. Work commitments do not constitute valid absence excuses.',
    detailedAnswer: `### Academic Senate Resolution: Concurrent Employment Framework

**Governing Policy: Academic Senate Directive § 11.04**

1. **Weekly Workload Ceiling**:
   - Undergraduate students enrolled in full-time term coursework may engage in part-time or remote internships up to a strict maximum of **20.0 hours per week**.

2. **Mandatory Attendance Clause**:
   - You are required by institutional statute to maintain a minimum of **75.0% physical classroom and laboratory attendance** across all enrolled subjects.
   - *Notice*: Employer meetings, project deadlines, or corporate sprint deliverables do not qualify as excused absences under University regulations.

3. **Employer Memorandum of Understanding**:
   - Sponsoring organizations must submit a signed statement confirming awareness of the student's academic timetable and affirming that no work obligations shall conflict with scheduled examinations or lectures.`,
    policyCode: 'SENATE-DIR-11.04',
    sources: [
      { title: 'Dean of Students Student Conduct & Employment Framework', section: 'Directive 11.04', code: 'SENATE-DIR-11.04' }
    ],
    suggestedFollowUps: [
      'What is the procedure to receive an Internship NOC?',
      'When is the Spring internship NOC deadline?'
    ]
  },

  // --- DEADLINES ---
  {
    id: 'faq-deadlines-calendar',
    category: 'deadlines',
    title: 'Official Academic Calendar, Examination Schedules, and Statutory Deadlines',
    keywords: ['deadlines', 'academic calendar', 'dates', 'tuition due', 'exam dates', 'thesis', 'graduation'],
    questionVariations: [
      'What are the key upcoming dates for this semester?',
      'When are final exams and mid-terms scheduled?',
      'When is the last day to submit the capstone thesis?'
    ],
    summary: 'Key dates: Course Add/Drop closes Oct 24, Tuition Fee without late fee due Nov 5, Mid-term exams start Nov 10, Thesis submission Dec 15.',
    detailedAnswer: `### Office of Academic Records: 2026-2027 Official Calendar

| Institutional Milestone | Statutory Due Date | Administrative Consequence / Penalty |
|---|---|---|
| **Course Add/Drop Period** | **Oct 24, 2026 (11:59 PM)** | Roster locked; 100% refund window closes |
| **Tuition & Institutional Fees** | **Nov 5, 2026 (11:59 PM)** | Surcharge of $50.00/week assessed starting Nov 6 |
| **Mid-Semester Examination Block** | **Nov 10 – Nov 18, 2026** | Mandatory proctored attendance |
| **Spring Internship NOC Filing** | **Nov 20, 2026 (5:00 PM)** | Late submissions excluded from department review |
| **Course Withdrawal (Grade "W")** | **Nov 28, 2026 (11:59 PM)** | Course permanently locked with letter grade thereafter |
| **Senior Capstone / Thesis Filing** | **Dec 15, 2026 (6:00 PM)** | Late submission defers degree conferral to Spring |
| **Convocation No-Dues Clearance** | **Dec 20, 2026 (5:00 PM)** | Clearance required for degree scroll and regalia |

Students can synchronize official term deadlines with Outlook or Google Calendar through the ERP portal integration.`,
    policyCode: 'REG-CAL-2026',
    sources: [
      { title: 'University Gazette 2026-2027 Academic Schedule', section: 'Term Almanac', code: 'REG-CAL-2026' }
    ],
    suggestedFollowUps: [
      'When is the course Add/Drop deadline?',
      'What is the late fee charge for tuition?',
      'How to request an official transcript?'
    ],
    widgetType: 'deadline-timer',
    widgetData: {
      targetDate: '2026-11-05T23:59:59',
      title: 'Tuition Settlement Closes In'
    }
  },
  {
    id: 'faq-deadlines-fees',
    category: 'deadlines',
    title: 'Tuition Fee Payment Schedules, Installment Plans, and Late Assessment Surcharges',
    keywords: ['tuition', 'fee', 'fine', 'late fee', 'payment', 'installment', 'bursar', 'scholarship receipt'],
    questionVariations: [
      'When is tuition fee payment due?',
      'What late fee is charged if I pay my tuition late?',
      'How can I set up an installment payment plan?'
    ],
    summary: 'Fall term tuition is due by November 5, 2026. A $50.00/week late penalty applies starting Nov 6. Installment plans can be set up via the Bursar before Oct 25.',
    detailedAnswer: `### Office of the Bursar: Tuition Collection & Fiscal Schedules

**Policy Code: FIN-REG-2.08**

- **Regular Due Date**: **November 5, 2026 at 11:59 PM EST**.
- **Late Penalty Structure**:
  - **Nov 6 – Nov 12**: **$50.00 assessment**.
  - **Nov 13 – Nov 19**: **$100.00 cumulative assessment**.
  - **Nov 20 onward**: Formal academic hold placed on account (library borrowing, transcript generation, and subsequent term pre-registration suspended).
- **Hardship Installment Arrangements**:
  Students facing unforeseen financial hardship may request a **Deferred 3-Tier Installment Agreement** via the Bursar's Office before October 25, 2026.`,
    policyCode: 'FIN-REG-2.08',
    sources: [
      { title: 'University Financial Code', section: 'Title 2: Tuition & Fees', code: 'FIN-REG-2.08' }
    ],
    suggestedFollowUps: [
      'What are the other upcoming semester deadlines?',
      'How do I obtain an official tax fee receipt?'
    ]
  },

  // --- CERTIFICATES ---
  {
    id: 'faq-cert-bonafide',
    category: 'certificates',
    title: 'Bonafide Student Certificate Issuance, QR Verification, and Physical Endorsements',
    keywords: ['bonafide', 'student proof', 'certificate', 'passport', 'visa', 'bank account', 'verification', 'qr code'],
    questionVariations: [
      'How can I obtain a Bonafide Student Certificate?',
      'Is the digital Bonafide Certificate accepted by banks and embassies?',
      'Where do I collect a physical stamped Bonafide Certificate?',
      'How long does Bonafide issuance take?'
    ],
    summary: 'Download an instant, cryptographically verified Bonafide Certificate PDF via the Student Portal under Student Services > Certificates. Hard copies are ready in 24 hours at Registrar Room 101.',
    detailedAnswer: `### Office of the Registrar: Institutional Certification Procedures

**Document Code: REG-DOC-101**

A **Bonafide Student Certificate** is the official university affirmation of active enrollment, matriculation date, and anticipated graduation term, accepted by banks, government visa agencies, transit authorities, and scholarship foundations.

#### Issuance Modalities:
1. **Instant Digital Issuance (Recommended)**:
   - Access **Student Portal > Student Services > Document Depository > Request Bonafide**.
   - Designate certification objective (e.g., "Bank Account Opening", "Schengen/US Visa Application", "Family Insurance").
   - System synthesizes a high-security PDF carrying the Registrar's digital seal and a verifiable **SHA-256 Cryptographic QR Code**.
   - **Processing Time**: **Instantaneous (under 30 seconds)**.
   - **Fee**: **Complimentary ($0.00)** for first 5 issuances per calendar year.

2. **Physical Ink-Stamped Hard Copy**:
   - In instances where a physical embossed seal is strictly required by foreign consulates, select "Physical In-Person Collection".
   - Collect document at **Administration Hall, Counter 2 (Registrar Desk)** after **24 business hours**.`,
    policyCode: 'REG-DOC-101',
    sources: [
      { title: 'Office of the Registrar Document Issuance Protocols', section: 'Section 1.01: Enrollment Letters', code: 'REG-DOC-101' }
    ],
    suggestedFollowUps: [
      'How do I order official sealed academic transcripts?',
      'How do I request a Provisional Degree Certificate?',
      'What are the degree clearance requirements?'
    ],
    widgetType: 'certificate-stepper',
    widgetData: {
      certificateType: 'Bonafide Student Certificate',
      processingTime: 'Instant (Digital) / 24h (Physical Stamp)',
      fee: '$0.00 (Complimentary)',
      status: 'Ready for Instant Download'
    }
  },
  {
    id: 'faq-cert-transcripts',
    category: 'certificates',
    title: 'Official Academic Transcripts, Sealed Registrar Packets, and WES/LSAC Dispatch',
    keywords: ['transcripts', 'official transcript', 'gradesheet', 'wes', 'higher studies', 'sealed envelope', 'parchment'],
    questionVariations: [
      'How do I order official university transcripts?',
      'Can the university transmit transcripts directly to WES or foreign universities?',
      'What is the processing time and fee for official transcripts?',
      'Are electronic transcripts official?'
    ],
    summary: 'Order official transcripts through Registrar Online Services. Electronic delivery to WES/institutions takes 48 hours; physical stamped envelopes take 3 to 5 business days ($10 per set).',
    detailedAnswer: `### Office of the University Registrar: Academic Records Protocol

**Statutory Code: REG-TRN-304**

Official Transcripts reflect your complete permanent academic record, cumulative grade point averages, semester breakdown, and conferred credentials.

#### Ordering & Transmission Options:
1. **Certified Electronic PDF (eTranscript via Parchment)**:
   - Fully attested by the University Registrar with an embedded security certificate preventing tampering.
   - **Delivery Speed**: **Within 48 hours**.
   - **Direct WES / LSAC / CAS Transmission**: Provide your institution reference number during checkout; direct upload occurs through our secured API.
2. **Physical Sealed & Stamped Envelope Packets**:
   - Issued in tamper-evident Registrar envelopes bearing ink seals over the flap.
   - **Processing Period**: **3 to 5 working days**.
   - **Tariff Structure**: **$10.00** for initial packet; **$5.00** for each duplicate packet ordered concurrently. International express courier incurs standard postal freight fees.`,
    policyCode: 'REG-TRN-304',
    sources: [
      { title: 'Academic Records & Transcript Regulations', section: 'Policy 304', code: 'REG-TRN-304' }
    ],
    suggestedFollowUps: [
      'How do I get a Bonafide Certificate?',
      'What is the procedure for degree No-Dues clearance?'
    ],
    widgetType: 'certificate-stepper',
    widgetData: {
      certificateType: 'Official Academic Transcripts',
      processingTime: '48h (Electronic) / 3-5 Days (Physical)',
      fee: '$10.00 per set',
      status: 'Online Application'
    }
  },
  {
    id: 'faq-cert-provisional',
    category: 'certificates',
    title: 'Provisional Degree Certificate, No-Dues Workflow, and Convocation Scroll',
    keywords: ['provisional degree', 'degree certificate', 'no dues', 'library clearance', 'convocation', 'graduation'],
    questionVariations: [
      'How do I receive my Provisional Degree Certificate?',
      'What departments must sign off on my No-Dues clearance?',
      'When is the degree certificate issued?'
    ],
    summary: 'Provisional Degree Certificates are issued within 7 business days following final semester grade release and completion of the automated No-Dues clearance across Library, Labs, Housing, and Accounts.',
    detailedAnswer: `### Office of Degrees & Commencements: Graduation Clearance

**Commencement Statute: COMMENCE-STATUTE-1.04**

The **Provisional Degree Certificate** serves as legitimate legal proof of degree conferral until the formal ceremonial parchment scroll is conferred during the Annual Convocation.

#### Interdepartmental No-Dues Clearance Protocol:
To unlock certification, students must secure electronic clearances:
1. **University Libraries**: Return of all circulating materials, inter-library loan books, and clearance of overdue fines.
2. **Departmental Laboratories**: Surrender of lab lockers, equipment kits, and project hardware sign-offs.
3. **Campus Housing & Residential Life**: Room inventory check and damage fee settlement.
4. **Bursar & Accounts**: Complete settlement of tuition and graduation audit fees.

**Timeline**: Upon completion of all 4 department clearances, the Registrar issues the Provisional Degree Certificate within **7 business days**.`,
    policyCode: 'COMMENCE-STATUTE-1.04',
    sources: [
      { title: 'University Commencement Regulations', section: 'Statute 1.04', code: 'COMMENCE-STATUTE-1.04' }
    ],
    suggestedFollowUps: [
      'When is the convocation and degree clearance deadline?',
      'How do I order official academic transcripts?'
    ]
  }
];

export const TEST_BENCH_QUESTIONS: {
  id: string;
  question: string;
  expectedCategory: Category;
  expectedKeywords: string[];
  description: string;
  isEdgeCase?: boolean;
}[] = [
  {
    id: 'tb-1',
    question: 'When is the last day to drop a course without penalty?',
    expectedCategory: 'courses',
    expectedKeywords: ['October 24, 2026', 'Add/Drop', 'transcript'],
    description: 'Verify exact date, policy, and transcript impact for course add/drop.'
  },
  {
    id: 'tb-2',
    question: 'What are the prerequisites for AI and Machine Learning (CS350)?',
    expectedCategory: 'courses',
    expectedKeywords: ['CS201', 'Data Structures', 'MATH220'],
    description: 'Verify prerequisite mapping for specialized computer science courses.'
  },
  {
    id: 'tb-3',
    question: 'How do I apply for an NOC for my summer internship?',
    expectedCategory: 'internships',
    expectedKeywords: ['NOC', 'T&P', 'offer letter', '6.5'],
    description: 'Verify internship approval steps, CGPA criteria, and portal routing.'
  },
  {
    id: 'tb-4',
    question: 'Can I do a remote internship during regular classes?',
    expectedCategory: 'internships',
    expectedKeywords: ['20 hours', '75%', 'attendance', 'remote'],
    description: 'Verify remote internship hour limitations and mandatory attendance constraints.'
  },
  {
    id: 'tb-5',
    question: 'When is the deadline to pay semester tuition fees?',
    expectedCategory: 'deadlines',
    expectedKeywords: ['November 5, 2026', 'late', '$50'],
    description: 'Verify financial deadline dates and late fee penalty amounts.'
  },
  {
    id: 'tb-6',
    question: 'Give me a list of all upcoming major academic deadlines for Fall 2026.',
    expectedCategory: 'deadlines',
    expectedKeywords: ['Add/Drop', 'Fee', 'Mid-Term', 'Thesis'],
    description: 'Verify multi-item deadline calendar synthesis across academic, financial, and internship areas.'
  },
  {
    id: 'tb-7',
    question: 'How do I get a bonafide student certificate for my bank account?',
    expectedCategory: 'certificates',
    expectedKeywords: ['Bonafide', 'Student Portal', 'instant', 'QR code'],
    description: 'Verify instant digital bonafide issuance procedure and turnaround time.'
  },
  {
    id: 'tb-8',
    question: 'How do I order official sealed transcripts for WES or foreign university admissions?',
    expectedCategory: 'certificates',
    expectedKeywords: ['Transcripts', 'Registrar', 'WES', 'sealed'],
    description: 'Verify official transcript fee, turnaround time, and direct WES electronic dispatch.'
  },
  {
    id: 'tb-9',
    question: 'Can I do an off-campus internship if my CGPA is 6.2 and I have one backlog?',
    expectedCategory: 'internships',
    expectedKeywords: ['6.5', 'backlog'],
    description: 'Edge case: boundary test on internship CGPA minimum eligibility (6.5 required) and backlog prohibition.',
    isEdgeCase: true
  },
  {
    id: 'tb-10',
    question: 'If I drop a course on November 15, will I get a refund and does it affect my GPA?',
    expectedCategory: 'courses',
    expectedKeywords: ['W', 'refund', 'GPA'],
    description: 'Edge case: distinguishing between early add/drop (refund/no record) vs late withdrawal (Grade W, no refund, no GPA hit).',
    isEdgeCase: true
  },
  {
    id: 'tb-11',
    question: 'What is the procedure for degree No Dues clearance before convocation?',
    expectedCategory: 'certificates',
    expectedKeywords: ['No Dues', 'Library', 'Hostel', 'clearance'],
    description: 'Verify interdepartmental graduation clearance workflow.',
    isEdgeCase: true
  },
  {
    id: 'tb-12',
    question: 'What happens if I miss the course add/drop deadline completely?',
    expectedCategory: 'courses',
    expectedKeywords: ['withdrawal', 'W', 'advisor'],
    description: 'Edge case: consequences of missed registration window and recourse options.',
    isEdgeCase: true
  }
];
