// ============================================================================
// PROFESSORVIRUS — COMPLETE BRAND SEO & TECHNICAL METADATA MANAGER
// Canonical URL: https://professorvirus.site/
// Brand Name: ProfessorVirus
// Tagline: Study Smart. Prepare Better.
// Description: An educational platform providing study resources, notes,
// previous-year question papers, syllabus, quizzes, academic tools and career preparation for students.
// ============================================================================

export const BASE_DOMAIN = 'https://professorvirus.site';
export const BRAND_NAME = 'ProfessorVirus';
export const BRAND_TAGLINE = 'Study Smart. Prepare Better.';
export const BRAND_DESCRIPTION = 'An educational platform providing study resources, notes, previous-year question papers, syllabus, quizzes, academic tools and career preparation for students.';
export const DEFAULT_OG_IMAGE = `${BASE_DOMAIN}/assets/navbar_logo.png`;

export const SEO_PAGE_CONFIG = {
  home: {
    title: `${BRAND_NAME} - ${BRAND_TAGLINE} | Notes, PYQs, Syllabus & Student Tools`,
    description: BRAND_DESCRIPTION,
    path: '/',
    schemaType: 'WebSite'
  },
  notes: {
    title: `AKTU Notes, Lecture Notes & Quantum Series | ${BRAND_NAME}`,
    description: 'Download verified handwritten notes, unit-wise PDFs, and quantum series for B.Tech, BCA, BBA, B.Pharm, MCA, MBA, and other university programmes.',
    path: '/notes',
    schemaType: 'CollectionPage'
  },
  pyqs: {
    title: `AKTU Previous Year Question Papers (PYQs) | ${BRAND_NAME}`,
    description: 'Download official AKTU previous year question papers (PYQs) with solutions and marking trends across all semesters and engineering branches.',
    path: '/pyqs',
    schemaType: 'CollectionPage'
  },
  syllabus: {
    title: `Official AKTU Syllabus & Course Structure | ${BRAND_NAME}`,
    description: 'Access the latest official university syllabus, subject credit scheme, and unit breakdown across B.Tech, MCA, MBA, and pharmacy branches.',
    path: '/syllabus',
    schemaType: 'ItemPage'
  },
  quizzes: {
    title: `Academic Quizzes & Semester Practice Tests | ${BRAND_NAME}`,
    description: 'Test your academic knowledge with subject-wise interactive quizzes, MCQ practice drills, and instant answer evaluations.',
    path: '/quizzes',
    schemaType: 'Quiz'
  },
  hoollow: {
    title: `HOOLLOW by ${BRAND_NAME} | AI Study Companion & Academic Roadmap`,
    description: 'Turn your academic and engineering goals into personalized learning roadmaps with step-by-step guidance, curated resources, and progress tracking.',
    path: '/hoollow',
    schemaType: 'WebApplication'
  },
  'interview-pro': {
    title: `Interview Pro - AI Placement Simulator & Mock Interviews | ${BRAND_NAME}`,
    description: 'Practice campus placement interviews with timed aptitude tests, technical coding challenges, AI technical voice rounds, and HR behavioral assessments.',
    path: '/interview-pro',
    schemaType: 'WebApplication'
  },
  'interview-start': {
    title: `Aptitude Assessment Test - Round 1 | Interview Pro - ${BRAND_NAME}`,
    description: 'Take the 35-minute timed aptitude test covering Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Data Interpretation.',
    path: '/interview-start',
    schemaType: 'Quiz'
  },
  'interview-coding': {
    title: `Technical Coding Challenge - Round 2 | Interview Pro - ${BRAND_NAME}`,
    description: 'Solve real algorithmic problems with browser-based code execution, test case validation, and multiple programming languages.',
    path: '/interview-coding',
    schemaType: 'WebApplication'
  },
  'interview-technical': {
    title: `AI Technical Interviewer - Round 3 | Interview Pro - ${BRAND_NAME}`,
    description: 'Interactive AI technical interview evaluating data structures, algorithms, system design, and project implementation.',
    path: '/interview-technical',
    schemaType: 'WebApplication'
  },
  'interview-hr': {
    title: `AI HR Behavioral Interview - Round 4 | Interview Pro - ${BRAND_NAME}`,
    description: 'Behavioral and situational HR interview evaluating leadership, communication, problem-solving, and culture fit.',
    path: '/interview-hr',
    schemaType: 'WebApplication'
  },
  'interview-report': {
    title: `Placement Performance Report | Interview Pro - ${BRAND_NAME}`,
    description: 'Comprehensive placement test report featuring mathematical composite scoring, detailed feedback, and conversation transcripts.',
    path: '/interview-report',
    schemaType: 'ItemPage'
  },
  'result-cgpa': {
    title: `AKTU Result & SGPA Marksheet Analyzer | ${BRAND_NAME}`,
    description: 'Parse official AKTU marksheets, calculate exact semester SGPA and cumulative CGPA, and track backlog status accurately.',
    path: '/result-cgpa',
    schemaType: 'WebApplication'
  },
  'attendance-calculator': {
    title: `75% Attendance Calculator & Bunk Planner | ${BRAND_NAME}`,
    description: 'Calculate how many lectures you can safely bunk or need to attend to maintain 75% college attendance rules without being debarred.',
    path: '/attendance-calculator',
    schemaType: 'WebApplication'
  },
  'resume-maker': {
    title: `ATS Resume Maker for Students & Tech Placements | ${BRAND_NAME}`,
    description: 'Build single-page, ATS-compliant technical resumes formatted specifically for campus placements, internships, and off-campus drives.',
    path: '/resume-maker',
    schemaType: 'WebApplication'
  },
  'pdf-maker': {
    title: `Student PDF Maker & Document Studio | ${BRAND_NAME}`,
    description: 'Merge, split, convert, watermark, and organize assignment sheets and study notes securely directly in your browser.',
    path: '/pdf-maker',
    schemaType: 'WebApplication'
  },
  timetable: {
    title: `Student Timetable & Daily Study Planner | ${BRAND_NAME}`,
    description: 'Interactive weekly routine planner with class reminders, schedule tracking, and semester calendar organization.',
    path: '/timetable',
    schemaType: 'WebApplication'
  },
  progress: {
    title: `Student Progress Tracker & Learning Analytics | ${BRAND_NAME}`,
    description: 'Track your study hours, subject syllabus completion, PYQs solved, and exam preparation milestones with real-time analytics.',
    path: '/progress',
    schemaType: 'WebApplication'
  },
  plagiarism: {
    title: `Academic Plagiarism Checker & Originality Scanner | ${BRAND_NAME}`,
    description: 'Check assignments, project reports, and essays for originality, citation integrity, and academic honesty.',
    path: '/plagiarism',
    schemaType: 'WebApplication'
  },
  'competitive-exams': {
    title: `GATE, CAT & Competitive Exams Prep | ${BRAND_NAME}`,
    description: 'Comprehensive preparation roadmaps, syllabus guides, and study materials for GATE, CAT, and national competitive exams.',
    path: '/competitive-exams',
    schemaType: 'Article'
  },
  'project-ideas': {
    title: `Student Project Ideas with Source Code & GitHub Repos | ${BRAND_NAME}`,
    description: 'Discover curated capstone, minor, and major engineering project ideas complete with verified source code, architecture, and documentation.',
    path: '/project-ideas',
    schemaType: 'CollectionPage'
  },
  'internships-jobs': {
    title: `Verified Student Internships & Off-Campus Hiring | ${BRAND_NAME}`,
    description: 'Find verified software engineering internships, graduate roles, and off-campus recruitment opportunities for students.',
    path: '/internships-jobs',
    schemaType: 'JobPosting'
  },
  'prma-home': {
    title: 'PRMA Tech™ — Build. Learn. Intern. | Modern Tech Solutions & Industry Internships',
    description: 'A technology company that helps students gain real-world experience through industry-ready internships, live projects, custom software development, and expert mentorship.',
    path: '/prma-tech',
    schemaType: 'Organization'
  },
  'prma-services': {
    title: 'Our Technology Services — PRMA Tech™ | Web, App, AI & Custom Software',
    description: 'End-to-end technology solutions: modern websites, iOS/Android apps, AI/ML integrations, cloud architecture, and custom enterprise software.',
    path: '/prma-tech/services',
    schemaType: 'Service'
  },
  'prma-about': {
    title: 'About Us — PRMA Tech™ | Building Real-World Tech Opportunities',
    description: 'Learn about PRMA Tech mission, leadership, core values, and our journey empowering students with practical engineering skills and career mentorship.',
    path: '/prma-tech/about',
    schemaType: 'AboutPage'
  },
  'prma-careers': {
    title: 'Careers & Hiring — PRMA Tech™ | Work on Impactful Technology',
    description: 'Join the PRMA Tech engineering, design, and product team. Flexible remote work culture, live mentoring, and career growth.',
    path: '/prma-tech/careers',
    schemaType: 'JobPosting'
  },
  'prma-projects': {
    title: 'Featured Projects & Case Studies — PRMA Tech™',
    description: 'Explore live software products, student intelligence platforms, and scalable digital solutions engineered by PRMA Tech.',
    path: '/prma-tech/projects',
    schemaType: 'CollectionPage'
  },
  'prma-contact': {
    title: 'Contact Us & Project Consultation — PRMA Tech™',
    description: 'Get in touch with PRMA Tech for software development inquiries, corporate partnerships, or internship admissions support.',
    path: '/prma-tech/contact',
    schemaType: 'ContactPage'
  },
  'prma-admin': {
    title: 'Admin & Operations Console — PRMA Tech™',
    description: 'Operations management portal for PRMA Tech student admissions, applications, and support.',
    path: '/prma-tech/admin',
    schemaType: 'AdminPage'
  },
  'prma-internships-home': {
    title: `PRMA Tech Remote Internships — Real-World Projects & Mentorship | ${BRAND_NAME}`,
    description: 'Join industry-ready remote internships by PRMA Tech. 27 domains, 1:1 mentorship, live code reviews, verified certificates, and customized physical welcome kit.',
    path: '/prma-tech/internships',
    schemaType: 'EducationalOccupationalProgram'
  },
  'prma-internships-domains': {
    title: `PRMA Tech 27 Internship Tracks & Domains | ${BRAND_NAME}`,
    description: 'Explore 27 industry-recognized PRMA Tech internship tracks in AI/ML, Full Stack, Cloud, DevOps, Data Science, and Cybersecurity.',
    path: '/prma-tech/internships/domains',
    schemaType: 'CollectionPage'
  },
  'prma-internships-apply': {
    title: `Select Batch & Duration — PRMA Tech Internship Portal | ${BRAND_NAME}`,
    description: 'Choose your upcoming internship batch date and program duration tier (2 to 36 weeks) with verified certification.',
    path: '/prma-tech/internships/apply',
    schemaType: 'ItemPage'
  },
  'prma-internships-goodies': {
    title: `PRMA Tech Welcome Swag & Goodies Kit | ${BRAND_NAME}`,
    description: 'Customize your official PRMA Tech physical welcome kit: branded t-shirt, matte insulated bottle, notebook, and smart NFC intern ID card.',
    path: '/prma-tech/internships/goodies',
    schemaType: 'OfferCatalog'
  },
  'prma-internships-review': {
    title: `Review & Student Application — PRMA Tech | ${BRAND_NAME}`,
    description: 'Submit your authentic academic details for official certificate generation and welcome kit delivery.',
    path: '/prma-tech/internships/review',
    schemaType: 'ItemPage'
  },
  'prma-internships-payment': {
    title: `Enrollment Payment & Confirmation — PRMA Tech | ${BRAND_NAME}`,
    description: 'Complete your registration payment via Razorpay or UPI QR code for instant confirmation.',
    path: '/prma-tech/internships/payment',
    schemaType: 'CheckoutPage'
  },
  'prma-internships-dashboard': {
    title: `Student Intern Dashboard — PRMA Tech | ${BRAND_NAME}`,
    description: 'Access your live milestones, project submissions, weekly mentor calls, goodies tracking, and verified certificates.',
    path: '/prma-tech/internships/dashboard',
    schemaType: 'ProfilePage'
  },
  scholarships: {
    title: `National & State Scholarships Directory for Students | ${BRAND_NAME}`,
    description: 'Explore UP government scholarships, national scholarship portal (NSP) schemes, and private grants with eligibility criteria and deadlines.',
    path: '/scholarships',
    schemaType: 'CollectionPage'
  },
  'important-links': {
    title: `Important University Portals & ERP Links | ${BRAND_NAME}`,
    description: 'Direct verified links to official AKTU ERP login, one-view result servers, circulars, exam schedules, and student services.',
    path: '/important-links',
    schemaType: 'ItemPage'
  },
  'select-course': {
    title: `All 24 University Programmes & Academic Directory | ${BRAND_NAME}`,
    description: 'Explore verified study resources, notes, PYQs, and syllabus across 24 university programmes including B.Tech, BCA, BBA, B.Pharm, MCA, MBA, and more.',
    path: '/select-course',
    schemaType: 'CollectionPage'
  },
  courses: {
    title: `All 24 University Programmes & Academic Directory | ${BRAND_NAME}`,
    description: 'Explore verified study resources, notes, PYQs, and syllabus across 24 university programmes including B.Tech, BCA, BBA, B.Pharm, MCA, MBA, and more.',
    path: '/courses/',
    schemaType: 'CollectionPage'
  },
  more: {
    title: `All Student Tools & Academic Resources | ${BRAND_NAME}`,
    description: 'Explore the complete suite of student productivity tools, AI study assistants, calculators, and career preparation resources on ProfessorVirus.',
    path: '/more',
    schemaType: 'CollectionPage'
  }
};

/**
 * Dynamically updates document metadata, canonical links, Open Graph, Twitter cards, and JSON-LD schema
 */
export function updateSEOForRoute(tabName, course = null, extraData = null) {
  const config = SEO_PAGE_CONFIG[tabName] || SEO_PAGE_CONFIG.home;
  let pageTitle = config.title;
  let pageDesc = config.description;
  let canonicalUrl = `${BASE_DOMAIN}${config.path}`;

  // Handle course-specific notes / pyqs
  if (course && (tabName === 'notes' || tabName === 'pyqs')) {
    const formattedCourse = course.replace('BTech', 'B.Tech');
    if (tabName === 'notes') {
      pageTitle = `${formattedCourse} Notes, Question Banks & Quantum Series | ${BRAND_NAME}`;
      pageDesc = `Download verified ${formattedCourse} semester notes, unit-wise handwritten summaries, quantum series, and syllabus on ${BRAND_NAME}.`;
    } else {
      pageTitle = `${formattedCourse} Previous Year Question Papers (PYQs) | ${BRAND_NAME}`;
      pageDesc = `Download official ${formattedCourse} previous year question papers (PYQs) with solutions across all semesters on ${BRAND_NAME}.`;
    }
    canonicalUrl = `${BASE_DOMAIN}/${tabName}?course=${encodeURIComponent(formattedCourse)}`;
  }

  // Handle subject-specific detail view
  if ((tabName === 'subject' || tabName === 'subject-detail') && extraData && extraData.name) {
    const subName = extraData.name;
    const subCode = extraData.code ? ` (${extraData.code})` : '';
    const subCourse = extraData.course || (course ? course.replace('BTech', 'B.Tech') : 'B.Tech');
    pageTitle = `${subName}${subCode} Notes & PYQs | ${subCourse} - ${BRAND_NAME}`;
    pageDesc = `Free verified lecture notes, unit-wise question banks, previous year question papers, and syllabus for ${subName}${subCode} on ${BRAND_NAME}.`;
    canonicalUrl = `${BASE_DOMAIN}/subject?subject=${encodeURIComponent(subName)}${extraData.code ? `&code=${encodeURIComponent(extraData.code)}` : ''}&course=${encodeURIComponent(subCourse)}`;
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
    'og:site_name': BRAND_NAME,
    'og:image': DEFAULT_OG_IMAGE
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
    'twitter:card': 'summary_large_image',
    'twitter:title': pageTitle,
    'twitter:description': pageDesc,
    'twitter:image': DEFAULT_OG_IMAGE
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
  let schemaScript = document.getElementById('pv-dynamic-page-schema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'pv-dynamic-page-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  let structuredData;
  if (tabName === 'home') {
    // Rich homepage schema with WebSite + Organization
    structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${BASE_DOMAIN}/#website`,
          'name': BRAND_NAME,
          'alternateName': ['Professor Virus', 'ProfessorVirus.site'],
          'url': BASE_DOMAIN,
          'description': BRAND_DESCRIPTION,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': {
              '@type': 'EntryPoint',
              'urlTemplate': `${BASE_DOMAIN}/notes?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'Organization',
          '@id': `${BASE_DOMAIN}/#organization`,
          'name': BRAND_NAME,
          'url': BASE_DOMAIN,
          'logo': {
            '@type': 'ImageObject',
            'url': DEFAULT_OG_IMAGE,
            'caption': `${BRAND_NAME} Official Logo`
          },
          'sameAs': [
            'https://wa.me/917668016628',
            'https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G',
            'https://github.com/priyanshukumar09546-cpu/CampusPrep'
          ]
        }
      ]
    };
  } else {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': config.schemaType || 'WebPage',
      'name': pageTitle,
      'description': pageDesc,
      'url': canonicalUrl,
      'isPartOf': {
        '@type': 'WebSite',
        'name': BRAND_NAME,
        'url': BASE_DOMAIN
      }
    };
  }

  schemaScript.textContent = JSON.stringify(structuredData);
}
