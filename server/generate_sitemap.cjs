const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://professorvirus.site';
const TODAY = new Date().toISOString().split('T')[0];

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function generateSitemap() {
  const urls = [];

  // 1. Homepage (Highest Priority)
  urls.push({
    loc: `${BASE_URL}/`,
    lastmod: TODAY,
    changefreq: 'daily',
    priority: '1.0'
  });

  // 2. All 20 Student Tools & Core Hubs
  const tools = [
    { path: '/notes', freq: 'daily', prio: '0.95' },
    { path: '/pyqs', freq: 'daily', prio: '0.95' },
    { path: '/syllabus', freq: 'weekly', prio: '0.85' },
    { path: '/quizzes', freq: 'weekly', prio: '0.85' },
    { path: '/hoollow', freq: 'daily', prio: '0.90' },
    { path: '/interview-pro', freq: 'daily', prio: '0.90' },
    { path: '/result-cgpa', freq: 'monthly', prio: '0.80' },
    { path: '/resume-maker', freq: 'monthly', prio: '0.85' },
    { path: '/pdf-maker', freq: 'monthly', prio: '0.75' },
    { path: '/attendance-calculator', freq: 'monthly', prio: '0.80' },
    { path: '/timetable', freq: 'monthly', prio: '0.75' },
    { path: '/progress', freq: 'daily', prio: '0.85' },
    { path: '/plagiarism', freq: 'monthly', prio: '0.80' },
    { path: '/project-ideas', freq: 'weekly', prio: '0.85' },
    { path: '/internships-jobs', freq: 'daily', prio: '0.90' },
    { path: '/scholarships', freq: 'weekly', prio: '0.85' },
    { path: '/competitive-exams', freq: 'weekly', prio: '0.80' },
    { path: '/important-links', freq: 'monthly', prio: '0.75' },
    { path: '/select-course', freq: 'weekly', prio: '0.85' },
    { path: '/more', freq: 'weekly', prio: '0.80' }
  ];

  tools.forEach(t => {
    urls.push({
      loc: `${BASE_URL}${t.path}`,
      lastmod: TODAY,
      changefreq: t.freq,
      priority: t.prio
    });
  });

  // 3. All 24 University Programmes (Notes & PYQs Hubs)
  const official24Courses = [
    'B.Tech',
    'B.Tech Biotechnology',
    'B.Tech Agriculture',
    'B.Tech Lateral Entry',
    'BCA',
    'BBA',
    'BBA / BMS',
    'B.Pharm',
    'B.Pharm Lateral Entry',
    'Pharm.D',
    'M.Tech',
    'M.Pharm',
    'MCA',
    'MCA Integrated',
    'MCA Lateral Entry',
    'MBA',
    'MBA Integrated',
    'MBA Lateral Entry',
    'B.Arch',
    'B.Des',
    'BHMCT',
    'BFAD',
    'BFA',
    'B.Voc'
  ];

  official24Courses.forEach(c => {
    urls.push({
      loc: `${BASE_URL}/notes?course=${encodeURIComponent(c)}`,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: '0.85'
    });
    urls.push({
      loc: `${BASE_URL}/pyqs?course=${encodeURIComponent(c)}`,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: '0.80'
    });
  });

  // 4. Genuine Aggregated Subjects from real content
  const dataDir = path.join(__dirname, 'data');
  const subjectsMap = new Map();

  // Load subjects.json
  const subjectsPath = path.join(dataDir, 'subjects.json');
  if (fs.existsSync(subjectsPath)) {
    try {
      const subs = JSON.parse(fs.readFileSync(subjectsPath, 'utf8'));
      subs.forEach(s => {
        const name = (s.name || '').trim();
        if (name) {
          const key = name.toLowerCase();
          subjectsMap.set(key, {
            name,
            code: s.code || '',
            course: 'B.Tech'
          });
        }
      });
    } catch (e) {}
  }

  // Load notes.json
  const notesPath = path.join(dataDir, 'notes.json');
  if (fs.existsSync(notesPath)) {
    try {
      const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
      notes.forEach(n => {
        const name = (n.subject || n.subjectName || '').trim();
        if (name) {
          const key = name.toLowerCase();
          if (!subjectsMap.has(key)) {
            subjectsMap.set(key, {
              name,
              code: n.subjectCode || n.code || '',
              course: n.course || 'B.Tech'
            });
          } else {
            const cur = subjectsMap.get(key);
            if (!cur.code && (n.subjectCode || n.code)) cur.code = n.subjectCode || n.code;
            if (!cur.course && n.course) cur.course = n.course;
          }
        }
      });
    } catch (e) {}
  }

  // Load pyqs.json
  const pyqsPath = path.join(dataDir, 'pyqs.json');
  if (fs.existsSync(pyqsPath)) {
    try {
      const pyqs = JSON.parse(fs.readFileSync(pyqsPath, 'utf8'));
      pyqs.forEach(p => {
        const name = (p.subject || p.subjectName || '').trim();
        if (name) {
          const key = name.toLowerCase();
          if (!subjectsMap.has(key)) {
            subjectsMap.set(key, {
              name,
              code: p.subjectCode || p.code || '',
              course: p.course || 'B.Tech'
            });
          } else {
            const cur = subjectsMap.get(key);
            if (!cur.code && (p.subjectCode || p.code)) cur.code = p.subjectCode || p.code;
          }
        }
      });
    } catch (e) {}
  }

  // Add all verified subjects to sitemap
  subjectsMap.forEach(sub => {
    let subUrl = `${BASE_URL}/subject?subject=${encodeURIComponent(sub.name)}`;
    if (sub.code) subUrl += `&code=${encodeURIComponent(sub.code)}`;
    if (sub.course) subUrl += `&course=${encodeURIComponent(sub.course)}`;

    urls.push({
      loc: subUrl,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: '0.70'
    });
  });

  // 5. Verified Projects
  const projectsPath = path.join(dataDir, 'projects.json');
  if (fs.existsSync(projectsPath)) {
    try {
      const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      projects.forEach(p => {
        if (p.slug) {
          urls.push({
            loc: `${BASE_URL}/project-ideas/${p.slug}`,
            lastmod: TODAY,
            changefreq: 'monthly',
            priority: '0.65'
          });
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
          urls.push({
            loc: `${BASE_URL}/internships-jobs/${o.slug}`,
            lastmod: TODAY,
            changefreq: 'weekly',
            priority: '0.70'
          });
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
          urls.push({
            loc: `${BASE_URL}/scholarships/${s.slug}`,
            lastmod: TODAY,
            changefreq: 'monthly',
            priority: '0.65'
          });
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

  console.log(`Generated public/sitemap.xml successfully! Total URLs: ${urls.length}`);
}

generateSitemap();
