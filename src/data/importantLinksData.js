// ============================================================================
// PROFESSORVIRUS — IMPORTANT & OFFICIAL LINKS DIRECTORY DATA
// Real, verified official links matching Reference Image 2
// Categorized into 8 domains with verified URLs and official tags
// ============================================================================

export const LINK_CATEGORIES = [
  { id: 'all', name: 'All Links', icon: 'Layers' },
  { id: 'aktu', name: 'AKTU & University', icon: 'GraduationCap' },
  { id: 'govt-jobs', name: 'Government Job Portals', icon: 'Building2' },
  { id: 'competitive-exams', name: 'Competitive Exams', icon: 'Award' },
  { id: 'higher-studies', name: 'Higher Studies', icon: 'BookOpen' },
  { id: 'career-skills', name: 'Career & Skills', icon: 'Briefcase' },
  { id: 'scholarships', name: 'Scholarships', icon: 'IndianRupee' },
  { id: 'official-services', name: 'Official Services', icon: 'ShieldCheck' },
  { id: 'tools-utilities', name: 'Tools & Utilities', icon: 'LayoutGrid' }
];

export const IMPORTANT_LINKS_DATA = [
  // ==========================================================================
  // 1. AKTU & UNIVERSITY PORTALS
  // ==========================================================================
  {
    category: 'aktu',
    categoryName: 'AKTU & University',
    categoryDesc: 'Official university portals and student resources',
    categoryIcon: 'GraduationCap',
    title: 'AKTU Official Website',
    desc: 'Main official portal for circulars, notices, and university affiliations',
    domain: 'aktu.ac.in',
    url: 'https://aktu.ac.in',
    official: true,
    tag: 'Official Portal'
  },
  {
    category: 'aktu',
    categoryName: 'AKTU & University',
    categoryDesc: 'Official university portals and student resources',
    categoryIcon: 'GraduationCap',
    title: 'AKTU One View Result',
    desc: 'Check live semester marks, grades, SGPA, CGPA & academic record',
    domain: 'erp.aktu.ac.in',
    url: 'https://erp.aktu.ac.in/WebPages/OneView/OneView.aspx',
    official: true,
    tag: 'One View Result'
  },
  {
    category: 'aktu',
    categoryName: 'AKTU & University',
    categoryDesc: 'Official university portals and student resources',
    categoryIcon: 'GraduationCap',
    title: 'AKTU ERP Login',
    desc: 'Student dashboard, exam form submission, admit card and attendance tracking',
    domain: 'erp.aktu.ac.in',
    url: 'https://erp.aktu.ac.in',
    official: true,
    tag: 'Student Login'
  },
  {
    category: 'aktu',
    categoryName: 'AKTU & University',
    categoryDesc: 'Official university portals and student resources',
    categoryIcon: 'GraduationCap',
    title: 'AKTU Syllabus / Scheme',
    desc: 'Curriculum, course evaluation schemes, and subject credits for all branches',
    domain: 'aktu.ac.in/syllabus.html',
    url: 'https://aktu.ac.in/syllabus.html',
    official: true,
    tag: 'Curriculum'
  },
  {
    category: 'aktu',
    categoryName: 'AKTU & University',
    categoryDesc: 'Official university portals and student resources',
    categoryIcon: 'GraduationCap',
    title: 'AKTU Exam Portal',
    desc: 'Even and Odd semester examination schedules, center lists, and guidelines',
    domain: 'erp.aktu.ac.in',
    url: 'https://erp.aktu.ac.in',
    official: true,
    tag: 'Examinations'
  },
  {
    category: 'aktu',
    categoryName: 'AKTU & University',
    categoryDesc: 'Official university portals and student resources',
    categoryIcon: 'GraduationCap',
    title: 'AKTU Academic Calendar',
    desc: 'Official session schedules, semester commencement dates, and holiday circulars',
    domain: 'aktu.ac.in/circular.html',
    url: 'https://aktu.ac.in/circular.html',
    official: true,
    tag: 'Circulars'
  },

  // ==========================================================================
  // 2. GOVERNMENT JOB PORTALS
  // ==========================================================================
  {
    category: 'govt-jobs',
    categoryName: 'Government Job Portals',
    categoryDesc: 'Official government job recruitment and exam portals',
    categoryIcon: 'Building2',
    title: 'UPSC Official Website',
    desc: 'Civil Services, Engineering Services (IES), NDA, CDS, and central notifications',
    domain: 'upsc.gov.in',
    url: 'https://upsc.gov.in',
    official: true,
    tag: 'Union Public Service'
  },
  {
    category: 'govt-jobs',
    categoryName: 'Government Job Portals',
    categoryDesc: 'Official government job recruitment and exam portals',
    categoryIcon: 'Building2',
    title: 'SSC Official Website',
    desc: 'CGL, CHSL, Junior Engineer (JE), MTS, and central ministry appointments',
    domain: 'ssc.gov.in',
    url: 'https://ssc.gov.in',
    official: true,
    tag: 'Staff Selection'
  },
  {
    category: 'govt-jobs',
    categoryName: 'Government Job Portals',
    categoryDesc: 'Official government job recruitment and exam portals',
    categoryIcon: 'Building2',
    title: 'IBPS Official Website',
    desc: 'Public sector bank recruitment for PO, Clerk, Specialist Officer (SO), and RRB',
    domain: 'ibps.in',
    url: 'https://www.ibps.in',
    official: true,
    tag: 'Banking Personnel'
  },
  {
    category: 'govt-jobs',
    categoryName: 'Government Job Portals',
    categoryDesc: 'Official government job recruitment and exam portals',
    categoryIcon: 'Building2',
    title: 'RRB Official Website',
    desc: 'Railway Recruitment Board for ALP, Technician, Junior Engineer (JE), NTPC',
    domain: 'indianrailways.gov.in',
    url: 'https://www.indianrailways.gov.in',
    official: true,
    tag: 'Indian Railways'
  },
  {
    category: 'govt-jobs',
    categoryName: 'Government Job Portals',
    categoryDesc: 'Official government job recruitment and exam portals',
    categoryIcon: 'Building2',
    title: 'SBI Careers',
    desc: 'State Bank of India Probationary Officer (PO), Clerk, and Specialist Cadre jobs',
    domain: 'sbi.co.in/careers',
    url: 'https://sbi.co.in/web/careers',
    official: true,
    tag: 'State Bank of India'
  },
  {
    category: 'govt-jobs',
    categoryName: 'Government Job Portals',
    categoryDesc: 'Official government job recruitment and exam portals',
    categoryIcon: 'Building2',
    title: 'State PSC Portals (UPPSC)',
    desc: 'Uttar Pradesh Public Service Commission for Combined State Civil Services',
    domain: 'uppsc.up.nic.in',
    url: 'https://uppsc.up.nic.in',
    official: true,
    tag: 'State Commission'
  },

  // ==========================================================================
  // 3. COMPETITIVE EXAMS
  // ==========================================================================
  {
    category: 'competitive-exams',
    categoryName: 'Competitive Exams',
    categoryDesc: 'Major national competitive examination authorities',
    categoryIcon: 'Award',
    title: 'UPSC (Civil Services)',
    desc: 'Registration, syllabus, notifications, and results for IAS, IPS, and IFS',
    domain: 'upsc.gov.in',
    url: 'https://upsc.gov.in',
    official: true,
    tag: 'Civil Services'
  },
  {
    category: 'competitive-exams',
    categoryName: 'Competitive Exams',
    categoryDesc: 'Major national competitive examination authorities',
    categoryIcon: 'Award',
    title: 'SSC (CGL, CHSL, MTS, etc.)',
    desc: 'Combined Graduate Level examination syllabus, answer keys, and cutoff lists',
    domain: 'ssc.gov.in',
    url: 'https://ssc.gov.in',
    official: true,
    tag: 'Combined Graduate'
  },
  {
    category: 'competitive-exams',
    categoryName: 'Competitive Exams',
    categoryDesc: 'Major national competitive examination authorities',
    categoryIcon: 'Award',
    title: 'IBPS (PO, Clerk, RRB)',
    desc: 'Nationalized bank examination calendars, mock tests, and call letters',
    domain: 'ibps.in',
    url: 'https://www.ibps.in',
    official: true,
    tag: 'Bank PO / Clerk'
  },
  {
    category: 'competitive-exams',
    categoryName: 'Competitive Exams',
    categoryDesc: 'Major national competitive examination authorities',
    categoryIcon: 'Award',
    title: 'GATE (IITs)',
    desc: 'Graduate Aptitude Test in Engineering for M.Tech admissions and PSU hiring',
    domain: 'gate2025.iitr.ac.in',
    url: 'https://gate2025.iitr.ac.in',
    official: true,
    tag: 'M.Tech & PSUs'
  },
  {
    category: 'competitive-exams',
    categoryName: 'Competitive Exams',
    categoryDesc: 'Major national competitive examination authorities',
    categoryIcon: 'Award',
    title: 'NDA (DEFENCE)',
    desc: 'National Defence Academy entrance conducted by UPSC for Army, Navy & Air Force',
    domain: 'upsc.gov.in',
    url: 'https://upsc.gov.in',
    official: true,
    tag: 'Defence Forces'
  },
  {
    category: 'competitive-exams',
    categoryName: 'Competitive Exams',
    categoryDesc: 'Major national competitive examination authorities',
    categoryIcon: 'Award',
    title: 'CDS (Combined Defence)',
    desc: 'Indian Military Academy (IMA), Naval Academy (INA), Air Force Academy (AFA)',
    domain: 'upsc.gov.in',
    url: 'https://upsc.gov.in',
    official: true,
    tag: 'Defence Cadre'
  },

  // ==========================================================================
  // 4. HIGHER STUDIES
  // ==========================================================================
  {
    category: 'higher-studies',
    categoryName: 'Higher Studies',
    categoryDesc: 'M.Tech, MS, MBA, PhD, and premier university admissions',
    categoryIcon: 'BookOpen',
    title: 'GATE Official Website',
    desc: 'Eligibility, question papers, and scorecard downloads for master admissions',
    domain: 'gate2025.iitr.ac.in',
    url: 'https://gate2025.iitr.ac.in',
    official: true,
    tag: 'Postgraduate Tech'
  },
  {
    category: 'higher-studies',
    categoryName: 'Higher Studies',
    categoryDesc: 'M.Tech, MS, MBA, PhD, and premier university admissions',
    categoryIcon: 'BookOpen',
    title: 'NTA (JEE / CUET / Others)',
    desc: 'National Testing Agency for CUET-PG, UGC NET, CSIR NET, and entrance tests',
    domain: 'nta.ac.in',
    url: 'https://nta.ac.in',
    official: true,
    tag: 'National Testing'
  },
  {
    category: 'higher-studies',
    categoryName: 'Higher Studies',
    categoryDesc: 'M.Tech, MS, MBA, PhD, and premier university admissions',
    categoryIcon: 'BookOpen',
    title: 'Study in IITs',
    desc: 'Council of Indian Institutes of Technology portal for M.Tech & Ph.D research programs',
    domain: 'iitsystem.ac.in',
    url: 'https://www.iitsystem.ac.in',
    official: true,
    tag: 'Premier IITs'
  },
  {
    category: 'higher-studies',
    categoryName: 'Higher Studies',
    categoryDesc: 'M.Tech, MS, MBA, PhD, and premier university admissions',
    categoryIcon: 'BookOpen',
    title: 'Study in NITs (CCMT / CSAB)',
    desc: 'Centralized counseling portal for M.Tech/M.Arch/M.Plan across all NITs',
    domain: 'ccmt.admissions.nic.in',
    url: 'https://ccmt.admissions.nic.in',
    official: true,
    tag: 'Premier NITs'
  },
  {
    category: 'higher-studies',
    categoryName: 'Higher Studies',
    categoryDesc: 'M.Tech, MS, MBA, PhD, and premier university admissions',
    categoryIcon: 'BookOpen',
    title: 'UGC Official Website',
    desc: 'University Grants Commission recognition lists, autonomous college status, regulations',
    domain: 'ugc.gov.in',
    url: 'https://www.ugc.gov.in',
    official: true,
    tag: 'University Grants'
  },
  {
    category: 'higher-studies',
    categoryName: 'Higher Studies',
    categoryDesc: 'M.Tech, MS, MBA, PhD, and premier university admissions',
    categoryIcon: 'BookOpen',
    title: 'Study Abroad (EducationUSA)',
    desc: 'Official government-sponsored guidance on international universities and visas',
    domain: 'educationusa.state.gov',
    url: 'https://educationusa.state.gov',
    official: true,
    tag: 'Global Admissions'
  },

  // ==========================================================================
  // 5. CAREER & SKILL DEVELOPMENT
  // ==========================================================================
  {
    category: 'career-skills',
    categoryName: 'Career & Skill Development',
    categoryDesc: 'Jobs, internships, coding, and professional skill platforms',
    categoryIcon: 'Briefcase',
    title: 'LinkedIn',
    desc: 'Professional networking, tech job openings, internship search, and profile building',
    domain: 'linkedin.com',
    url: 'https://www.linkedin.com',
    official: true,
    tag: 'Professional Network'
  },
  {
    category: 'career-skills',
    categoryName: 'Career & Skill Development',
    categoryDesc: 'Jobs, internships, coding, and professional skill platforms',
    categoryIcon: 'Briefcase',
    title: 'Naukri.com',
    desc: 'India’s largest job search portal for fresher engineering, IT, and corporate roles',
    domain: 'naukri.com',
    url: 'https://www.naukri.com',
    official: true,
    tag: 'Job Portal'
  },
  {
    category: 'career-skills',
    categoryName: 'Career & Skill Development',
    categoryDesc: 'Jobs, internships, coding, and professional skill platforms',
    categoryIcon: 'Briefcase',
    title: 'Internshala',
    desc: 'Verified student internships with stipends across software, web, and business',
    domain: 'internshala.com',
    url: 'https://internshala.com',
    official: true,
    tag: 'Student Internships'
  },
  {
    category: 'career-skills',
    categoryName: 'Career & Skill Development',
    categoryDesc: 'Jobs, internships, coding, and professional skill platforms',
    categoryIcon: 'Briefcase',
    title: 'GeeksforGeeks',
    desc: 'Computer science subjects, data structures, algorithms, and interview prep tutorials',
    domain: 'geeksforgeeks.org',
    url: 'https://www.geeksforgeeks.org',
    official: true,
    tag: 'DSA & Tech Prep'
  },
  {
    category: 'career-skills',
    categoryName: 'Career & Skill Development',
    categoryDesc: 'Jobs, internships, coding, and professional skill platforms',
    categoryIcon: 'Briefcase',
    title: 'HackerRank',
    desc: 'Solve coding challenges, prepare for technical recruitment tests and earn certificates',
    domain: 'hackerrank.com',
    url: 'https://www.hackerrank.com',
    official: true,
    tag: 'Coding Practice'
  },
  {
    category: 'career-skills',
    categoryName: 'Career & Skill Development',
    categoryDesc: 'Jobs, internships, coding, and professional skill platforms',
    categoryIcon: 'Briefcase',
    title: 'Coursera',
    desc: 'Global online courses and professional certificates from Google, IBM, and Stanford',
    domain: 'coursera.org',
    url: 'https://www.coursera.org',
    official: true,
    tag: 'Online Certifications'
  },

  // ==========================================================================
  // 6. SCHOLARSHIPS & EDUCATION
  // ==========================================================================
  {
    category: 'scholarships',
    categoryName: 'Scholarships & Education',
    categoryDesc: 'Scholarships, fee waivers, and financial support portals',
    categoryIcon: 'IndianRupee',
    title: 'National Scholarship Portal',
    desc: 'Central government scholarships for pre-matric, post-matric, and higher education',
    domain: 'scholarships.gov.in',
    url: 'https://scholarships.gov.in',
    official: true,
    tag: 'National NSP'
  },
  {
    category: 'scholarships',
    categoryName: 'Scholarships & Education',
    categoryDesc: 'Scholarships, fee waivers, and financial support portals',
    categoryIcon: 'IndianRupee',
    title: 'AICTE Scholarship Schemes',
    desc: 'Pragati Scholarship for Girls, Saksham for differently-abled, and Swanath Scheme',
    domain: 'aicte-india.org',
    url: 'https://www.aicte-india.org',
    official: true,
    tag: 'AICTE Official'
  },
  {
    category: 'scholarships',
    categoryName: 'Scholarships & Education',
    categoryDesc: 'Scholarships, fee waivers, and financial support portals',
    categoryIcon: 'IndianRupee',
    title: 'State Scholarship Portals (UP)',
    desc: 'Uttar Pradesh government post-matric fee reimbursement and general scholarship',
    domain: 'scholarship.up.gov.in',
    url: 'https://scholarship.up.gov.in',
    official: true,
    tag: 'UP Scholarship'
  },
  {
    category: 'scholarships',
    categoryName: 'Scholarships & Education',
    categoryDesc: 'Scholarships, fee waivers, and financial support portals',
    categoryIcon: 'IndianRupee',
    title: 'Vidya Lakshmi Portal',
    desc: 'Single window portal for government-subsidized student education loans',
    domain: 'vidyalakshmi.co.in',
    url: 'https://www.vidyalakshmi.co.in',
    official: true,
    tag: 'Education Loans'
  },
  {
    category: 'scholarships',
    categoryName: 'Scholarships & Education',
    categoryDesc: 'Scholarships, fee waivers, and financial support portals',
    categoryIcon: 'IndianRupee',
    title: 'PM Scholarship Schemes (PMSS)',
    desc: 'Prime Minister’s Scholarship Scheme for wards of ex-servicemen and police forces',
    domain: 'desw.gov.in',
    url: 'https://www.desw.gov.in',
    official: true,
    tag: 'PMSS Scheme'
  },
  {
    category: 'scholarships',
    categoryName: 'Scholarships & Education',
    categoryDesc: 'Scholarships, fee waivers, and financial support portals',
    categoryIcon: 'IndianRupee',
    title: 'Buddy4Study',
    desc: 'Leading scholarship discovery and matching platform for corporate CSR grants',
    domain: 'buddy4study.com',
    url: 'https://www.buddy4study.com',
    official: true,
    tag: 'CSR Grants'
  },

  // ==========================================================================
  // 7. OFFICIAL SERVICE PORTALS
  // ==========================================================================
  {
    category: 'official-services',
    categoryName: 'Official Service Portals',
    categoryDesc: 'Important government identification, identity, and civic portals',
    categoryIcon: 'ShieldCheck',
    title: 'DigiLocker',
    desc: 'Access verified digital Aadhaar, driving license, marksheet, and degree certificates',
    domain: 'digilocker.gov.in',
    url: 'https://www.digilocker.gov.in',
    official: true,
    tag: 'Digital Documents'
  },
  {
    category: 'official-services',
    categoryName: 'Official Service Portals',
    categoryDesc: 'Important government identification, identity, and civic portals',
    categoryIcon: 'ShieldCheck',
    title: 'Aadhaar Portal (myAadhaar)',
    desc: 'Unique Identification Authority of India (UIDAI) for update, PVC card & verification',
    domain: 'myaadhaar.uidai.gov.in',
    url: 'https://myaadhaar.uidai.gov.in',
    official: true,
    tag: 'UIDAI Official'
  },
  {
    category: 'official-services',
    categoryName: 'Official Service Portals',
    categoryDesc: 'Important government identification, identity, and civic portals',
    categoryIcon: 'ShieldCheck',
    title: 'PAN Card Portal (Income Tax)',
    desc: 'Apply for Instant e-PAN, link Aadhaar with PAN, and check verification status',
    domain: 'incometax.gov.in',
    url: 'https://www.incometax.gov.in',
    official: true,
    tag: 'Income Tax Dept'
  },
  {
    category: 'official-services',
    categoryName: 'Official Service Portals',
    categoryDesc: 'Important government identification, identity, and civic portals',
    categoryIcon: 'ShieldCheck',
    title: 'Passport Seva Portal',
    desc: 'Official Ministry of External Affairs portal for fresh passport and renewal appointment',
    domain: 'passportindia.gov.in',
    url: 'https://www.passportindia.gov.in',
    official: true,
    tag: 'Passport Seva'
  },
  {
    category: 'official-services',
    categoryName: 'Official Service Portals',
    categoryDesc: 'Important government identification, identity, and civic portals',
    categoryIcon: 'ShieldCheck',
    title: 'Voter Services Portal (ECI)',
    desc: 'Election Commission of India portal to register new voter card and download e-EPIC',
    domain: 'voters.eci.gov.in',
    url: 'https://voters.eci.gov.in',
    official: true,
    tag: 'Election Commission'
  },
  {
    category: 'official-services',
    categoryName: 'Official Service Portals',
    categoryDesc: 'Important government identification, identity, and civic portals',
    categoryIcon: 'ShieldCheck',
    title: 'RTI Online',
    desc: 'File Right to Information requests and first appeals online to Central Ministries',
    domain: 'rtionline.gov.in',
    url: 'https://rtionline.gov.in',
    official: true,
    tag: 'RTI Portal'
  },

  // ==========================================================================
  // 8. TOOLS & UTILITIES
  // ==========================================================================
  {
    category: 'tools-utilities',
    categoryName: 'Tools & Utilities',
    categoryDesc: 'Useful online productivity, research, and documentation tools',
    categoryIcon: 'LayoutGrid',
    title: 'Google Drive',
    desc: 'Secure cloud storage for academic projects, PDF notes, certificates, and backups',
    domain: 'drive.google.com',
    url: 'https://drive.google.com',
    official: true,
    tag: 'Cloud Storage'
  },
  {
    category: 'tools-utilities',
    categoryName: 'Tools & Utilities',
    categoryDesc: 'Useful online productivity, research, and documentation tools',
    categoryIcon: 'LayoutGrid',
    title: 'Google Forms',
    desc: 'Create event registrations, college surveys, quiz polls, and project feedback forms',
    domain: 'forms.google.com',
    url: 'https://forms.google.com',
    official: true,
    tag: 'Surveys & Forms'
  },
  {
    category: 'tools-utilities',
    categoryName: 'Tools & Utilities',
    categoryDesc: 'Useful online productivity, research, and documentation tools',
    categoryIcon: 'LayoutGrid',
    title: 'Google Sheets',
    desc: 'Online spreadsheets for study tracking, attendance calculation, and data analytics',
    domain: 'sheets.google.com',
    url: 'https://sheets.google.com',
    official: true,
    tag: 'Spreadsheets'
  },
  {
    category: 'tools-utilities',
    categoryName: 'Tools & Utilities',
    categoryDesc: 'Useful online productivity, research, and documentation tools',
    categoryIcon: 'LayoutGrid',
    title: 'Google Scholar',
    desc: 'Search peer-reviewed papers, academic research citations, thesis, and patents',
    domain: 'scholar.google.com',
    url: 'https://scholar.google.com',
    official: true,
    tag: 'Academic Research'
  },
  {
    category: 'tools-utilities',
    categoryName: 'Tools & Utilities',
    categoryDesc: 'Useful online productivity, research, and documentation tools',
    categoryIcon: 'LayoutGrid',
    title: 'Canva',
    desc: 'Design presentation decks, project posters, academic infographics, and banners',
    domain: 'canva.com',
    url: 'https://www.canva.com',
    official: true,
    tag: 'Design & Decks'
  },
  {
    category: 'tools-utilities',
    categoryName: 'Tools & Utilities',
    categoryDesc: 'Useful online productivity, research, and documentation tools',
    categoryIcon: 'LayoutGrid',
    title: 'Overleaf (LaTeX)',
    desc: 'Collaborative cloud LaTeX editor for IEEE project reports, thesis, and research papers',
    domain: 'overleaf.com',
    url: 'https://www.overleaf.com',
    official: true,
    tag: 'LaTeX Reports'
  }
];
