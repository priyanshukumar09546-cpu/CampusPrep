const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://professorvirus.site';
const TODAY = new Date().toISOString().split('T')[0];

function escapeXml(unsafe) {
  return String(unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

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

function generateSitemap() {
  const urls = [];
  const addedUrls = new Set();

  const addUrl = (loc, freq = 'weekly', priority = '0.80') => {
    // Normalize trailing slash for directories, keep clean
    const cleanLoc = loc.replace(/\/+$/, '') || `${BASE_URL}`;
    const finalLoc = cleanLoc === BASE_URL ? `${BASE_URL}/` : `${cleanLoc}/`;
    if (!addedUrls.has(finalLoc)) {
      addedUrls.add(finalLoc);
      urls.push({
        loc: finalLoc,
        lastmod: TODAY,
        changefreq: freq,
        priority: String(priority)
      });
    }
  };

  // 1. Homepage (Highest Priority)
  addUrl(`${BASE_URL}/`, 'daily', '1.0');

  // 2. All Public Student Tools & Core Hubs
  const coreHubs = [
    { path: '/courses', freq: 'daily', prio: '0.95' },
    { path: '/notes', freq: 'daily', prio: '0.95' },
    { path: '/pyqs', freq: 'daily', prio: '0.95' },
    { path: '/syllabus', freq: 'weekly', prio: '0.90' },
    { path: '/quizzes', freq: 'weekly', prio: '0.85' },
    { path: '/hoollow', freq: 'daily', prio: '0.90' },
    { path: '/interview-pro', freq: 'daily', prio: '0.90' },
    { path: '/result-cgpa', freq: 'monthly', prio: '0.85' },
    { path: '/resume-maker', freq: 'monthly', prio: '0.85' },
    { path: '/attendance-calculator', freq: 'monthly', prio: '0.80' },
    { path: '/pdf-maker', freq: 'monthly', prio: '0.75' },
    { path: '/timetable', freq: 'monthly', prio: '0.75' },
    { path: '/plagiarism', freq: 'monthly', prio: '0.80' },
    { path: '/project-ideas', freq: 'weekly', prio: '0.85' },
    { path: '/internships-jobs', freq: 'daily', prio: '0.90' },
    { path: '/scholarships', freq: 'weekly', prio: '0.85' },
    { path: '/competitive-exams', freq: 'weekly', prio: '0.80' },
    { path: '/important-links', freq: 'monthly', prio: '0.75' },
    { path: '/more', freq: 'weekly', prio: '0.80' }
  ];

  coreHubs.forEach(h => {
    addUrl(`${BASE_URL}${h.path}`, h.freq, h.prio);
  });

  // 3. All 24 University Programmes, Years & Semesters
  const { AVAILABLE_COURSES, COURSE_CONFIG } = loadCourseMapping();

  const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  AVAILABLE_COURSES.forEach(c => {
    const cSlug = slugify(c.key);
    // Course landing page
    addUrl(`${BASE_URL}/courses/${cSlug}`, 'weekly', '0.90');

    const conf = COURSE_CONFIG[c.key] || {};
    const years = conf.years || [];

    years.forEach(y => {
      const yDigit = String(y).replace(/[^0-9]/g, '');
      const ySlug = `year-${yDigit || 1}`;
      // Year landing page
      addUrl(`${BASE_URL}/courses/${cSlug}/${ySlug}`, 'weekly', '0.85');

      const sems = conf.sems?.[y] || [];
      sems.forEach(s => {
        const sSlug = `semester-${s}`;
        // Semester landing page
        addUrl(`${BASE_URL}/courses/${cSlug}/${ySlug}/${sSlug}`, 'weekly', '0.80');
      });
    });
  });

  // 4. Genuine Aggregated Subjects from real content
  const dataDir = path.join(__dirname, 'data');
  const subjectsMap = new Map();

  const collectSubject = (code, name, course) => {
    const cClean = String(code || '').trim().toLowerCase();
    const nClean = String(name || '').trim();
    if (cClean && !subjectsMap.has(cClean)) {
      subjectsMap.set(cClean, {
        code: cClean,
        name: nClean,
        course: course || 'BTech'
      });
    }
  };

  // From subjects.json
  const subjectsPath = path.join(dataDir, 'subjects.json');
  if (fs.existsSync(subjectsPath)) {
    try {
      const subs = JSON.parse(fs.readFileSync(subjectsPath, 'utf8'));
      subs.forEach(s => collectSubject(s.code, s.name, 'BTech'));
    } catch (e) {}
  }

  // From notes.json
  const notesPath = path.join(dataDir, 'notes.json');
  if (fs.existsSync(notesPath)) {
    try {
      const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
      notes.forEach(n => collectSubject(n.subjectCode || n.code, n.subject || n.subjectName, n.course));
    } catch (e) {}
  }

  // From pyqs.json
  const pyqsPath = path.join(dataDir, 'pyqs.json');
  if (fs.existsSync(pyqsPath)) {
    try {
      const pyqs = JSON.parse(fs.readFileSync(pyqsPath, 'utf8'));
      pyqs.forEach(p => collectSubject(p.subjectCode || p.code, p.subject || p.subjectName, p.course));
    } catch (e) {}
  }

  // Add all verified subject URLs
  subjectsMap.forEach(sub => {
    addUrl(`${BASE_URL}/subject/${encodeURIComponent(sub.code)}`, 'weekly', '0.75');
  });

  // 5. Verified Projects
  const projectsPath = path.join(dataDir, 'projects.json');
  if (fs.existsSync(projectsPath)) {
    try {
      const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      projects.forEach(p => {
        if (p.slug) {
          addUrl(`${BASE_URL}/project-ideas/${p.slug}`, 'monthly', '0.70');
        }
      });
    } catch (e) {}
  }

  // 6. Verified Opportunities
  const oppsPath = path.join(dataDir, 'opportunities.json');
  if (fs.existsSync(oppsPath)) {
    try {
      const opps = JSON.parse(fs.readFileSync(oppsPath, 'utf8'));
      opps.forEach(o => {
        if (o.slug) {
          addUrl(`${BASE_URL}/internships-jobs/${o.slug}`, 'weekly', '0.75');
        }
      });
    } catch (e) {}
  }

  // 7. Verified Scholarships
  const schPath = path.join(dataDir, 'scholarships.json');
  if (fs.existsSync(schPath)) {
    try {
      const schs = JSON.parse(fs.readFileSync(schPath, 'utf8'));
      schs.forEach(s => {
        if (s.slug) {
          addUrl(`${BASE_URL}/scholarships/${s.slug}`, 'monthly', '0.70');
        }
      });
    } catch (e) {}
  }

  // Build XML String
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(u => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(u.loc)}</loc>\n`;
    xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  const outPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');

  console.log(`Generated public/sitemap.xml successfully! Total Clean Canonical URLs: ${urls.length}`);
}

generateSitemap();
