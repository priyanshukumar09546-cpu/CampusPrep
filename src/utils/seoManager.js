// ============================================================================
// PROFESSORVIRUS — TECHNICAL SEO ARCHITECTURE & METADATA MANAGER
// Provides crawlable, unique title, description, canonical, OG, & schema data
// ============================================================================

const BASE_DOMAIN = 'https://professorvirus.com';

export const SEO_PAGE_CONFIG = {
  home: {
    title: 'ProfessorVirus — Independent Student Academic Platform for AKTU B.Tech',
    description: 'Study smart and prepare better. Access verified handwritten notes, solved AKTU previous year question papers (PYQs), marksheet SGPA analyzer, and AI Interview Pro.',
    path: '/',
    schemaType: 'EducationalOrganization'
  },
  notes: {
    title: 'Verified Handwritten Notes & Quantum Series | ProfessorVirus',
    description: 'Browse 5,000+ unit-wise notes, Quantum summaries, and faculty lecture materials for AKTU B.Tech, BCA, MCA, MBA & B.Pharm curricula.',
    path: '/notes',
    schemaType: 'CollectionPage'
  },
  pyqs: {
    title: 'AKTU Previous Year Question Papers (PYQs) with Solutions | ProfessorVirus',
    description: 'Download and practice official AKTU semester question papers from past years with verified solutions and marking scheme insights.',
    path: '/pyqs',
    schemaType: 'CollectionPage'
  },
  syllabus: {
    title: 'Official AKTU Syllabus & Credit Scheme | ProfessorVirus',
    description: 'Access the latest official university syllabus, subject units, and credit structure across B.Tech, MCA, MBA, and pharmacy branches.',
    path: '/syllabus',
    schemaType: 'ItemPage'
  },
  quizzes: {
    title: 'Interactive Subject Quizzes & Semester Practice Tests | ProfessorVirus',
    description: 'Test your engineering and academic concepts with topic-wise objective quizzes, timed drills, and instant answer explanations.',
    path: '/quizzes',
    schemaType: 'Quiz'
  },
  'interview-pro': {
    title: 'Interview Pro — AI Placement Assessment & Mock Interviews | ProfessorVirus',
    description: 'Practice real placement interviews with timed aptitude reasoning, browser-based coding challenges, voice AI technical rounds, and STAR behavioral assessments.',
    path: '/interview-pro',
    schemaType: 'WebApplication'
  },
  'interview-start': {
    title: 'Round 1: Aptitude Reasoning Assessment | Interview Pro',
    description: 'Take the 35-minute timed aptitude test covering Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Data Interpretation.',
    path: '/interview-start',
    schemaType: 'Quiz'
  },
  'interview-coding': {
    title: 'Round 2: Technical Coding Challenge | Interview Pro',
    description: 'Solve real algorithmic problems with live execution, test case validation, and multiple competitive programming languages.',
    path: '/interview-coding',
    schemaType: 'WebApplication'
  },
  'interview-technical': {
    title: 'Round 3: AI Technical Interviewer | Interview Pro',
    description: 'Engage in a live voice conversation with our AI Technical Interviewer probing system design, data structures, and resume projects.',
    path: '/interview-technical',
    schemaType: 'WebApplication'
  },
  'interview-hr': {
    title: 'Round 4: AI HR Behavioral Interview | Interview Pro',
    description: 'Behavioral and situational interview evaluating ownership, conflict resolution, leadership, and professional communication.',
    path: '/interview-hr',
    schemaType: 'WebApplication'
  },
  'interview-report': {
    title: 'Performance Assessment Report | Interview Pro',
    description: 'Comprehensive placement test report featuring mathematical composite scoring, question-level reviews, and complete conversation transcripts.',
    path: '/interview-report',
    schemaType: 'ItemPage'
  },
  'result-cgpa': {
    title: 'AKTU Result & SGPA Marksheet Analyzer | ProfessorVirus',
    description: 'Parse official AKTU marksheets, calculate exact semester SGPA and cumulative CGPA, and track backlog status automatically.',
    path: '/result-cgpa',
    schemaType: 'WebApplication'
  },
  'attendance-calculator': {
    title: '75% Attendance Calculator & Bunk Planner | ProfessorVirus',
    description: 'Calculate class requirements to hit 75% college attendance rules safely and plan leaves without getting debarred.',
    path: '/attendance-calculator',
    schemaType: 'WebApplication'
  },
  'resume-maker': {
    title: '1-Page ATS College Tech Resume Maker | ProfessorVirus',
    description: 'Build single-page, ATS-compliant tech resumes for software development, internships, and on-campus placement drives.',
    path: '/resume-maker',
    schemaType: 'WebApplication'
  },
  'pdf-maker': {
    title: 'Student PDF Maker & Document Studio | ProfessorVirus',
    description: 'Merge, split, convert, watermark, and organize assignment sheets and study notes securely right in your browser.',
    path: '/pdf-maker',
    schemaType: 'WebApplication'
  },
  timetable: {
    title: 'Weekly Timetable & Schedule Routine | ProfessorVirus',
    description: 'Interactive weekly routine planner with class reminders, schedule tracking, and semester calendar management.',
    path: '/timetable',
    schemaType: 'WebApplication'
  },
  progress: {
    title: 'Student Progress & Analytics Dashboard | ProfessorVirus',
    description: 'Track your study time, streaks, subjects, PYQs, quizzes and overall academic progress with real-time analytics.',
    path: '/progress',
    schemaType: 'WebApplication'
  },
  'competitive-exams': {
    title: 'Career Paths & Competitive Exams Guidance | ProfessorVirus',
    description: 'Detailed roadmaps for GATE, CAT, UPSC, ESE, and public sector engineering opportunities after B.Tech.',
    path: '/competitive-exams',
    schemaType: 'Article'
  },
  'project-ideas': {
    title: 'Engineering Project Ideas with Real GitHub Repos | ProfessorVirus',
    description: 'Discover curated capstone, minor, and major project concepts complete with real source code, system architectures, and documentation.',
    path: '/project-ideas',
    schemaType: 'CollectionPage'
  },
  'internships-jobs': {
    title: 'Verified Student Internships & Off-Campus Hiring | ProfessorVirus',
    description: 'Find verified technology internships, fresher graduate roles, and off-campus recruitment drives for college students.',
    path: '/internships-jobs',
    schemaType: 'JobPosting'
  },
  scholarships: {
    title: 'Student Scholarships & Financial Aid Directory | ProfessorVirus',
    description: 'Explore state government, national, and corporate scholarship opportunities with eligibility criteria and application deadlines.',
    path: '/scholarships',
    schemaType: 'CollectionPage'
  },
  'important-links': {
    title: 'Official AKTU Portals, ERP & Circulars | ProfessorVirus',
    description: 'Direct verified links to AKTU ERP login, university circulars, examination result servers, and official academic resources.',
    path: '/important-links',
    schemaType: 'ItemPage'
  },
  more: {
    title: 'More Academic Tools & Student Utilities | ProfessorVirus',
    description: 'Discover all academic resources, student productivity tools, and career guidance utilities on ProfessorVirus.',
    path: '/more',
    schemaType: 'CollectionPage'
  }
};

/**
 * Dynamically updates document metadata, canonical links, Open Graph, Twitter cards, and JSON-LD schema
 */
export function updateSEOForRoute(tabName, course = null) {
  const config = SEO_PAGE_CONFIG[tabName] || SEO_PAGE_CONFIG.home;
  let pageTitle = config.title;
  let pageDesc = config.description;

  if (course && (tabName === 'notes' || tabName === 'pyqs')) {
    pageTitle = `${course} ${tabName.toUpperCase()} & Study Materials | ProfessorVirus`;
    pageDesc = `Access verified ${course} semester notes, syllabus units, and university previous year question papers on ProfessorVirus.`;
  }

  // 1. Update Title
  document.title = pageTitle;

  // 2. Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', pageDesc);

  // 3. Update Canonical Link
  const canonicalUrl = `${BASE_DOMAIN}${config.path}${course ? `?course=${encodeURIComponent(course)}` : ''}`;
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 4. Update Open Graph Tags
  const ogTags = {
    'og:title': pageTitle,
    'og:description': pageDesc,
    'og:url': canonicalUrl,
    'og:type': tabName === 'home' ? 'website' : 'article',
    'og:site_name': 'ProfessorVirus',
    'og:image': `${BASE_DOMAIN}/assets/navbar_logo.png`
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // 5. Update Twitter Card Tags
  const twitterTags = {
    'twitter:card': 'summary',
    'twitter:title': pageTitle,
    'twitter:description': pageDesc,
    'twitter:image': `${BASE_DOMAIN}/assets/navbar_logo.png`
  };

  Object.entries(twitterTags).forEach(([name, content]) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // 6. Inject Schema.org JSON-LD Structured Data
  let schemaScript = document.getElementById('pv-structured-data');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'pv-structured-data';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': config.schemaType || 'WebPage',
    name: pageTitle,
    description: pageDesc,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'ProfessorVirus',
      url: BASE_DOMAIN,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_DOMAIN}/notes?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  };

  schemaScript.textContent = JSON.stringify(structuredData);
}
