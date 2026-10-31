// ============================================================================
// PROFESSORVIRUS — PRODUCTION SSG & PRE-RENDERING ENGINE
// Generates crawler-accessible pre-rendered HTML for all public canonical routes
// ============================================================================

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://professorvirus.site';
const BRAND_NAME = 'ProfessorVirus';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/navbar_logo.png`;

function loadCourseMapping() {
  const ts = fs.readFileSync(path.join(__dirname, '../src/data/courseMapping.ts'), 'utf8');
  const cleaned = ts
    .replace(/export default COURSE_CONFIG;/g, '')
    .replace(/export /g, '')
    .replace(/: string \| null/g, '')
    .replace(/: string/g, '')
    .replace(/: Record<string, string>/g, '')
    .replace(/import .*/g, '');

  const sandbox = {};
  const fn = new Function('sandbox', cleaned + '\nsandbox.COURSE_CONFIG = COURSE_CONFIG; sandbox.AVAILABLE_COURSES = AVAILABLE_COURSES;');
  fn(sandbox);
  return sandbox;
}

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function prerender() {
  const distDir = path.join(__dirname, '../dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('[SSG PRE-RENDER] Error: dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf8');
  const { AVAILABLE_COURSES, COURSE_CONFIG } = loadCourseMapping();

  let generatedCount = 0;

  function renderPage({ routePath, title, description, canonical, schema, bodyHtml }) {
    let html = baseTemplate;

    // 1. Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

    // 2. Replace Description
    if (html.includes('<meta name="description"')) {
      html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`);
    } else {
      html = html.replace('</head>', `  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />\n</head>`);
    }

    // 3. Inject Canonical Link
    html = html.replace(/<link rel="canonical"[^>]*>/gi, '');
    html = html.replace('</head>', `  <link rel="canonical" href="${canonical}" />\n</head>`);

    // 4. Update OpenGraph Tags
    const ogTags = `
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
  <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
  <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`;

    html = html.replace('</head>', `${ogTags}\n</head>`);

    // 5. Inject JSON-LD Schema
    if (schema) {
      const schemaScript = `\n  <script type="application/ld+json" id="pv-dynamic-page-schema">\n${JSON.stringify(schema, null, 2)}\n  </script>`;
      html = html.replace('</head>', `${schemaScript}\n</head>`);
    }

    // 6. Inject Pre-rendered Semantic Body into #root
    if (bodyHtml) {
      html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
    }

    // 7. Write to dist folder
    const cleanRoute = routePath.replace(/^\/|\/$/g, '');
    let targetDir = distDir;
    if (cleanRoute) {
      targetDir = path.join(distDir, cleanRoute);
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');
    generatedCount++;
  }

  // ==========================================
  // A. HOMEPAGE
  // ==========================================
  renderPage({
    routePath: '/',
    title: `${BRAND_NAME} - Study Smart. Prepare Better. | AKTU Notes, PYQs & Student Tools`,
    description: 'An educational platform providing study resources, verified notes, previous-year question papers (PYQs), syllabus, quizzes, academic tools and career preparation for students.',
    canonical: `${BASE_URL}/`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': BRAND_NAME,
      'url': BASE_URL,
      'description': 'Verified academic resources, AKTU notes, PYQs, and engineering career preparation.'
    },
    bodyHtml: `
      <div style="font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem;">
        <header>
          <h1>Professor Virus — Study Smart. Prepare Better.</h1>
          <p>An educational platform providing study resources, notes, previous-year question papers (PYQs), syllabus, quizzes, academic tools and career preparation for AKTU students.</p>
        </header>
        <section>
          <h2>Explore Core Academic Tools</h2>
          <ul>
            <li><a href="/courses/">All 24 University Programmes Directory</a></li>
            <li><a href="/notes/">Verified Study Notes & Quantum Series</a></li>
            <li><a href="/pyqs/">AKTU Solved Previous Year Papers</a></li>
            <li><a href="/syllabus/">Official University Syllabus & Curriculum</a></li>
            <li><a href="/result-cgpa/">Result & SGPA/CGPA Analyzer</a></li>
            <li><a href="/resume-maker/">Free ATS Resume Maker</a></li>
            <li><a href="/attendance-calculator/">75% Attendance Calculator & Bunk Planner</a></li>
            <li><a href="/hoollow/">HOOLLOW AI Study Companion</a></li>
            <li><a href="/interview-pro/">Interview Pro AI Mock Interviews</a></li>
          </ul>
        </section>
      </div>`
  });

  // ==========================================
  // B. ALL 24 COURSES DIRECTORY (/courses/)
  // ==========================================
  renderPage({
    routePath: '/courses/',
    title: `All 24 AKTU Programmes & Academic Directory | ${BRAND_NAME}`,
    description: 'Browse all 24 AKTU university programmes including B.Tech, BCA, BBA, B.Pharm, MCA, MBA, M.Tech, and B.Arch. Access verified lecture notes, syllabus, and solved PYQs.',
    canonical: `${BASE_URL}/courses/`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'All 24 University Programmes Directory',
      'url': `${BASE_URL}/courses/`,
      'description': 'Complete academic directory of 24 university programmes.'
    },
    bodyHtml: `
      <div style="font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem;">
        <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <span>Courses</span></nav>
        <h1>All 24 University Programmes & Academic Directory</h1>
        <p>Explore verified curriculum syllabi, semester subject outlines, handwritten unit notes, quantum series, and previous examination papers across all Dr. A.P.J. Abdul Kalam Technical University degrees.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${AVAILABLE_COURSES.map(c => `
            <div style="border: 1px solid #ddd; padding: 1rem; border-radius: 12px;">
              <h3><a href="/courses/${slugify(c.key)}/">${c.name}</a></h3>
              <p>${c.fullName}</p>
            </div>
          `).join('')}
        </div>
      </div>`
  });

  // ==========================================
  // C. DEDICATED COURSE, YEAR & SEMESTER PAGES
  // ==========================================
  AVAILABLE_COURSES.forEach(c => {
    const cSlug = slugify(c.key);
    const conf = COURSE_CONFIG[c.key] || {};
    const years = conf.years || [];
    const subjectsCount = Object.values(conf.subjects || {}).reduce((acc, l) => acc + l.length, 0);

    // 1. Course Landing Page (/courses/:cSlug/)
    renderPage({
      routePath: `/courses/${cSlug}/`,
      title: `AKTU ${c.fullName} (${c.name}) Syllabus, Notes & PYQs | ${BRAND_NAME}`,
      description: `Official AKTU ${c.fullName} (${c.name}) curriculum, semester subjects, unit-wise notes, and solved question papers across all years on ${BRAND_NAME}.`,
      canonical: `${BASE_URL}/courses/${cSlug}/`,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': `AKTU ${c.fullName} (${c.name})`,
        'description': `Complete ${c.fullName} curriculum and academic resources.`,
        'provider': { '@type': 'Organization', 'name': BRAND_NAME, 'url': BASE_URL }
      },
      bodyHtml: `
        <div style="font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/courses/">Courses</a> &gt; <span>${c.name}</span></nav>
          <h1>AKTU ${c.fullName} (${c.name}) — Curriculum, Notes & PYQs</h1>
          <p>Verified Dr. A.P.J. Abdul Kalam Technical University academic portal for ${c.fullName}. Access official syllabus, branch curriculum, unit-wise notes, and past examination papers.</p>
          <h2>Academic Years (${years.length})</h2>
          <ul>
            ${years.map(y => {
              const yDigit = String(y).replace(/[^0-9]/g, '') || '1';
              return `<li><a href="/courses/${cSlug}/year-${yDigit}/">${c.name} ${y}</a></li>`;
            }).join('')}
          </ul>
          <h2>Quick Academic Links</h2>
          <ul>
            <li><a href="/notes?course=${encodeURIComponent(c.name)}">${c.name} Verified Notes & Quantum</a></li>
            <li><a href="/pyqs?course=${encodeURIComponent(c.name)}">${c.name} Solved Previous Year Papers</a></li>
            <li><a href="/syllabus/">Official University Syllabus</a></li>
          </ul>
        </div>`
    });

    // 2. Year Landing Pages (/courses/:cSlug/year-:y/)
    years.forEach(y => {
      const yDigit = String(y).replace(/[^0-9]/g, '') || '1';
      const ySlug = `year-${yDigit}`;
      const sems = conf.sems?.[y] || [];

      renderPage({
        routePath: `/courses/${cSlug}/${ySlug}/`,
        title: `AKTU ${c.name} ${y} — Subjects, Notes & Previous Papers | ${BRAND_NAME}`,
        description: `Explore AKTU ${c.name} ${y} semester subjects, verified handwritten notes, quantum series, and previous year examination papers on ${BRAND_NAME}.`,
        canonical: `${BASE_URL}/courses/${cSlug}/${ySlug}/`,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': `AKTU ${c.name} ${y}`,
          'url': `${BASE_URL}/courses/${cSlug}/${ySlug}/`,
          'description': `Academic subjects and materials for ${c.name} ${y}.`
        },
        bodyHtml: `
          <div style="font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem;">
            <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/courses/">Courses</a> &gt; <a href="/courses/${cSlug}/">${c.name}</a> &gt; <span>${y}</span></nav>
            <h1>AKTU ${c.name} ${y} — Subjects, Notes & Previous Papers</h1>
            <p>Complete curriculum breakdown for ${c.name} ${y} students. Access semester subjects, syllabus guidelines, and study materials.</p>
            <h2>Available Semesters</h2>
            <ul>
              ${sems.map(s => `<li><a href="/courses/${cSlug}/${ySlug}/semester-${s}/">${c.name} ${y} Semester ${s}</a></li>`).join('')}
            </ul>
          </div>`
      });

      // 3. Semester Landing Pages (/courses/:cSlug/year-:y/semester-:s/)
      sems.forEach(s => {
        const sSlug = `semester-${s}`;
        const rawSubs = conf.subjects?.[s] || [];

        renderPage({
          routePath: `/courses/${cSlug}/${ySlug}/${sSlug}/`,
          title: `AKTU ${c.name} ${y} Semester ${s} Subjects & Study Material | ${BRAND_NAME}`,
          description: `Complete AKTU ${c.name} Semester ${s} syllabus, subject lists, unit-wise PDF notes, and solved question papers on ${BRAND_NAME}.`,
          canonical: `${BASE_URL}/courses/${cSlug}/${ySlug}/${sSlug}/`,
          schema: {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': `AKTU ${c.name} Semester ${s}`,
            'url': `${BASE_URL}/courses/${cSlug}/${ySlug}/${sSlug}/`,
            'description': `Curriculum and notes for ${c.name} Semester ${s}.`
          },
          bodyHtml: `
            <div style="font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem;">
              <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/courses/">Courses</a> &gt; <a href="/courses/${cSlug}/">${c.name}</a> &gt; <a href="/courses/${cSlug}/${ySlug}/">${y}</a> &gt; <span>Semester ${s}</span></nav>
              <h1>AKTU ${c.name} ${y} Semester ${s} — Subjects & Study Material</h1>
              <p>Official subjects, unit notes and previous examination papers for ${c.name} Semester ${s}.</p>
              <h2>Semester ${s} Subjects (${rawSubs.length})</h2>
              <ul>
                ${rawSubs.map(item => {
                  const name = typeof item === 'object' && item.name ? item.name : String(item);
                  const code = typeof item === 'object' && item.code ? item.code : '';
                  return `<li><strong>${name}</strong> ${code ? `(${code})` : ''} — <a href="/subject?subject=${encodeURIComponent(name)}&code=${encodeURIComponent(code)}&course=${encodeURIComponent(c.name)}">View Notes & PYQs</a></li>`;
                }).join('')}
              </ul>
            </div>`
        });
      });
    });
  });

  // ==========================================
  // D. CORE ACADEMIC TOOLS PAGES
  // ==========================================
  const toolsList = [
    {
      path: '/notes/',
      title: `AKTU Notes, Lecture Notes & Quantum Series | ${BRAND_NAME}`,
      desc: 'Download verified handwritten notes, unit-wise PDFs, and quantum series for B.Tech, BCA, BBA, B.Pharm, MCA, MBA, and other university programmes.',
      h1: 'AKTU Notes & Free Study Materials'
    },
    {
      path: '/pyqs/',
      title: `AKTU Previous Year Question Papers (PYQs) | ${BRAND_NAME}`,
      desc: 'Download official AKTU previous year question papers (PYQs) with solutions and marking trends across all semesters and engineering branches.',
      h1: 'AKTU Previous Year Question Papers (PYQs)'
    },
    {
      path: '/syllabus/',
      title: `Official AKTU Syllabus & Course Structure | ${BRAND_NAME}`,
      desc: 'Access the latest official university syllabus, subject credit scheme, and unit breakdown across B.Tech, MCA, MBA, and pharmacy branches.',
      h1: 'Official AKTU Syllabus & Course Structure'
    },
    {
      path: '/quizzes/',
      title: `Academic Quizzes & Semester Mock Tests | ${BRAND_NAME}`,
      desc: 'Test your academic knowledge with subject-wise interactive quizzes, MCQ practice drills, and timed semester mock tests.',
      h1: 'Practice Quizzes & Semester Mock Tests'
    },
    {
      path: '/project-ideas/',
      title: `Student Project Ideas, Source Code & GitHub Repos | ${BRAND_NAME}`,
      desc: 'Discover curated capstone, minor, and major engineering project ideas complete with verified source code, architecture, and documentation.',
      h1: 'Student Project Ideas & Open Source Repositories'
    },
    {
      path: '/internships-jobs/',
      title: `Verified Student Internships & Off-Campus Hiring | ${BRAND_NAME}`,
      desc: 'Find verified software engineering internships, graduate roles, and off-campus recruitment opportunities for college students.',
      h1: 'Internships & Entry-Level Job Opportunities'
    },
    {
      path: '/scholarships/',
      title: `National & State Scholarships Directory for Students | ${BRAND_NAME}`,
      desc: 'Explore UP government scholarships, national scholarship portal (NSP) schemes, and private grants with eligibility criteria and deadlines.',
      h1: 'National & State Scholarships Directory'
    },
    {
      path: '/result-cgpa/',
      title: `AKTU Result & SGPA Marksheet Analyzer | ${BRAND_NAME}`,
      desc: 'Parse official AKTU marksheets, calculate exact semester SGPA and cumulative CGPA, and track backlog status accurately with ProfessorVirus.',
      h1: 'AKTU Result & SGPA Marksheet Analyzer'
    },
    {
      path: '/resume-maker/',
      title: `ATS Resume Maker for Students & Tech Placements | ${BRAND_NAME}`,
      desc: 'Build professional, ATS-friendly resumes tailored for college placements, off-campus drives, and internships with ProfessorVirus Resume Maker.',
      h1: 'Free ATS Resume Maker for Students & Freshers'
    },
    {
      path: '/attendance-calculator/',
      title: `75% Attendance Calculator & Bunk Planner | ${BRAND_NAME}`,
      desc: 'Calculate how many lectures you can safely bunk or need to attend to maintain 75% college attendance rules without being debarred.',
      h1: '75% Attendance Calculator & Bunk Planner'
    },
    {
      path: '/hoollow/',
      title: `HOOLLOW by ${BRAND_NAME} | AI Study Companion & Academic Intelligence`,
      desc: 'Experience HOOLLOW, the AI study companion on ProfessorVirus. Get real-time answers, concept explanations, and instant academic assistance.',
      h1: 'HOOLLOW — AI Study Companion & Academic Roadmap'
    },
    {
      path: '/interview-pro/',
      title: `Interview Pro - AI Placement Simulator & Mock Interviews | ${BRAND_NAME}`,
      desc: 'Practice campus placement interviews with timed aptitude tests, technical coding challenges, AI technical voice rounds, and HR behavioral assessments.',
      h1: 'Interview Pro — AI Technical & HR Mock Placement Simulator'
    },
    {
      path: '/timetable/',
      title: `Student Timetable & Daily Study Planner | ${BRAND_NAME}`,
      desc: 'Organize your college classes, lecture schedule, and exam preparation with the interactive timetable planner on ProfessorVirus.',
      h1: 'College Timetable & Daily Study Planner'
    },
    {
      path: '/pdf-maker/',
      title: `PDF Maker & Studio | Merge, Split & Compress PDFs - ${BRAND_NAME}`,
      desc: 'Free student PDF utility to merge notes, extract pages, split files, and convert images into clean PDF documents directly in your browser.',
      h1: 'Student PDF Maker & Notes Organizer'
    },
    {
      path: '/plagiarism/',
      title: `Academic Plagiarism Checker & Originality Scanner | ${BRAND_NAME}`,
      desc: 'Check assignments, project reports, and essays for originality, citation integrity, and academic honesty on ProfessorVirus.',
      h1: 'Academic Plagiarism Checker & Originality Scanner'
    },
    {
      path: '/competitive-exams/',
      title: `GATE, CAT & Competitive Exams Prep | ${BRAND_NAME}`,
      desc: 'Comprehensive preparation roadmaps, syllabus guides, and study materials for GATE, CAT, and national competitive exams.',
      h1: 'GATE & National Competitive Exams Preparation'
    },
    {
      path: '/important-links/',
      title: `Important University Portals & ERP Links | ${BRAND_NAME}`,
      desc: 'Direct verified links to official AKTU ERP login, one-view result servers, circulars, exam schedules, and student services.',
      h1: 'Official AKTU ERP & University Portals Directory'
    },
    {
      path: '/more/',
      title: `All Student Tools & Academic Resources | ${BRAND_NAME}`,
      desc: 'Explore the complete suite of student productivity tools, AI study assistants, calculators, and career preparation resources on ProfessorVirus.',
      h1: 'All Student Productivity & Academic Preparation Tools'
    }
  ];

  toolsList.forEach(t => {
    renderPage({
      routePath: t.path,
      title: t.title,
      description: t.desc,
      canonical: `${BASE_URL}${t.path}`,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': t.h1,
        'url': `${BASE_URL}${t.path}`,
        'description': t.desc
      },
      bodyHtml: `
        <div style="font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem;">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <span>${t.h1}</span></nav>
          <h1>${t.h1}</h1>
          <p>${t.desc}</p>
        </div>`
    });
  });

  console.log(`[SSG PRE-RENDER] Successfully generated ${generatedCount} crawler-accessible HTML pages in dist/!`);
}

prerender();
