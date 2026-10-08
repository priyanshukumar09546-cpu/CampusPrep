/**
 * CampusPrep ATS Resume LaTeX Generator (ABES Master Format)
 * Generates exact Overleaf-compatible LaTeX code matching the attached ABES Resume Reference.
 */

// Escapes special characters for LaTeX safely
export function escapeLatex(text) {
  if (text === null || text === undefined) return '';
  if (typeof text === 'object') return '';
  const str = String(text);
  if (!str.trim() || str === 'undefined' || str === 'null' || str === '[object Object]') return '';
  return str
    .replace(/\\/g, '\\textbackslash ')
    .replace(/([&%$#_{}])/g, (m) => '\\' + m)
    .replace(/~/g, '\\textasciitilde ')
    .replace(/\^/g, '\\textasciicircum ');
}

// Normalizes user input URLs to ensure valid clickable hyperlinks
export function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

// Clean URL for professional ATS display
export function cleanDisplayUrl(url) {
  if (!url) return '';
  let str = String(url).trim();
  if (!str) return '';
  str = str.replace(/^https?:\/\//i, '');
  str = str.replace(/^www\./i, '');
  str = str.replace(/\/+$/, '');
  return str;
}

// Normalizes email addresses to mailto: URIs
export function normalizeEmail(email) {
  if (!email) return '';
  const trimmed = String(email).trim();
  if (!trimmed) return '';
  if (/^mailto:/i.test(trimmed)) {
    return trimmed;
  }
  return `mailto:${trimmed}`;
}

// Normalizes phone numbers to tel: URIs preserving digits and leading +
export function normalizePhone(phone) {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  if (!trimmed) return '';
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return `tel:${hasPlus ? '+' : ''}${digits}`;
}

// Formats display phone cleanly
export function formatDisplayPhone(phone) {
  if (!phone) return '';
  const str = String(phone).trim();
  if (!str) return '';
  return str;
}

// Formats CGPA or percentage matching ABES reference: CGPA-7.0 or 76.2%
export function formatEducationScore(raw) {
  if (!raw && raw !== 0) return '';
  const str = String(raw).trim();
  if (!str) return '';
  
  if (/^cgpa/i.test(str)) {
    return str.replace(/^cgpa[:\s-]*/i, 'CGPA-');
  }
  if (str.endsWith('%')) {
    return str;
  }
  const cleanNum = str.replace(/[^\d.]/g, '');
  const num = parseFloat(cleanNum);
  if (!isNaN(num)) {
    if (num <= 10) {
      return `CGPA-${cleanNum}`;
    } else {
      return `${cleanNum}%`;
    }
  }
  return str;
}

// Extracts duration from education entry
export function getEducationDuration(edu) {
  if (!edu) return '';
  let str = '';
  if (edu.duration && String(edu.duration).trim()) {
    str = String(edu.duration).trim();
  } else {
    const start = (edu.startDate || edu.startYear || '').toString().trim();
    const end = (edu.endDate || edu.endYear || '').toString().trim();
    if (start && end) str = `${start} -- ${end}`;
    else if (start || end) str = (start || end);
  }
  if (!str) return '';
  return str.replace(/[–—]/g, '--');
}

// Combines degree, field and board: e.g. B.Tech in ECE (AKTU), Class 12th (CBSE)
export function getEducationDegreeTitle(edu) {
  if (!edu) return 'Degree';
  const degree = (edu.degree || '').trim();
  const field = (edu.fieldOfStudy || edu.field || edu.major || '').trim();
  const board = (edu.board || edu.university || '').trim();
  let title = '';
  if (degree && field) {
    if (degree.toLowerCase().includes(field.toLowerCase())) {
      title = degree;
    } else {
      title = `${degree} in ${field}`;
    }
  } else {
    title = degree || field || 'Degree';
  }
  if (board && !title.toLowerCase().includes(board.toLowerCase())) {
    title = `${title} (${board})`;
  }
  return title;
}

// Generates complete, valid, Overleaf-compilable .tex source from resume data
export function generateLatex(resumeData, options = {}) {
  if (!resumeData) return '';

  const p = resumeData.personalDetails || resumeData.personal || {};
  const summary = (resumeData.summary || p.summary || '').trim();

  // Filter sections to include ONLY non-empty user data
  const rawEducation = Array.isArray(resumeData.education) ? resumeData.education : [];
  const education = rawEducation.filter(e => 
    e && (e.degree?.trim() || e.institution?.trim() || e.fieldOfStudy?.trim() || e.location?.trim() || e.duration?.trim() || e.cgpaOrPercentage?.trim() || e.cgpa?.trim() || e.board?.trim())
  );

  let rawSkills = [];
  if (resumeData.technicalSkills && typeof resumeData.technicalSkills === 'object') {
    const ts = resumeData.technicalSkills;
    if (Array.isArray(ts.programmingLanguages) && ts.programmingLanguages.length > 0) {
      rawSkills.push({ category: 'Programming Languages', items: ts.programmingLanguages });
    }
    if (Array.isArray(ts.frameworks) && ts.frameworks.length > 0) {
      rawSkills.push({ category: 'Frameworks & Libraries', items: ts.frameworks });
    }
    if (Array.isArray(ts.developerTools) && ts.developerTools.length > 0) {
      rawSkills.push({ category: 'Developer Tools & Platforms', items: ts.developerTools });
    }
    if (Array.isArray(ts.databases) && ts.databases.length > 0) {
      rawSkills.push({ category: 'Databases', items: ts.databases });
    }
    if (Array.isArray(ts.coreConcepts) && ts.coreConcepts.length > 0) {
      rawSkills.push({ category: 'Core Concepts', items: ts.coreConcepts });
    }
  }

  if (rawSkills.length === 0) {
    if (Array.isArray(resumeData.skills)) {
      rawSkills = resumeData.skills;
    } else if (resumeData.skills && typeof resumeData.skills === 'object') {
      const s = resumeData.skills;
      if (s.tools?.trim()) rawSkills.push({ category: 'Developer Tools', items: s.tools });
      if (s.languages?.trim()) rawSkills.push({ category: 'Languages', items: s.languages });
      if (s.frameworks?.trim()) rawSkills.push({ category: 'Frameworks', items: s.frameworks });
      if (s.databases?.trim()) rawSkills.push({ category: 'Databases', items: s.databases });
      if (s.coreConcepts?.trim()) rawSkills.push({ category: 'Core CS Concepts', items: s.coreConcepts });
      if (s.skills?.trim()) rawSkills.push({ category: 'Skills', items: s.skills });
      if (s.other?.trim()) rawSkills.push({ category: 'Other Skills', items: s.other });
    }
  }
  const skills = rawSkills.filter(s => {
    if (!s) return false;
    const items = Array.isArray(s.items) ? s.items.join('') : (s.items || '');
    return items.trim().length > 0;
  });

  const rawExperience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const experience = rawExperience.filter(e =>
    e && (e.title?.trim() || e.company?.trim() || e.location?.trim() || (Array.isArray(e.bullets) && e.bullets.some(b => b && b.trim())))
  );

  const rawProjects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const projects = rawProjects.filter(pr =>
    pr && (pr.title?.trim() || pr.techStack?.trim() || pr.githubUrl?.trim() || pr.liveUrl?.trim() || (Array.isArray(pr.bullets) && pr.bullets.some(b => b && b.trim())) || pr.description?.trim())
  );

  const rawAchievements = Array.isArray(resumeData.achievements) ? resumeData.achievements : [];
  const achievements = rawAchievements.filter(a =>
    a && (a.title?.trim() || a.organization?.trim() || a.description?.trim())
  );

  const rawCertifications = Array.isArray(resumeData.certifications) ? resumeData.certifications : [];
  const certifications = rawCertifications.filter(c =>
    c && (c.name?.trim() || c.issuer?.trim() || c.url?.trim())
  );

  const rawExtracurricular = Array.isArray(resumeData.extracurricular) ? resumeData.extracurricular : [];
  const extracurricular = rawExtracurricular.filter(x =>
    x && (x.role?.trim() || x.organization?.trim() || x.description?.trim() || x.activity?.trim())
  );

  const fontSize = options.fontSize || '10pt';
  const margin = options.margin || '0.45in';

  let tex = `%----------------------------------------------------------------------------------------
% ABES Resume Format - LaTeX Master Template
% Matching exact typography, layout, icons, and single-page structure
%----------------------------------------------------------------------------------------

\\documentclass[${fontSize},a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=${margin}]{geometry}
\\usepackage[hidelinks]{hyperref}
\\IfFileExists{fontawesome5.sty}{
  \\usepackage{fontawesome5}
}{
  \\providecommand{\\faPhone}{\\textbf{P:}}
  \\providecommand{\\faEnvelope}{\\textbf{E:}}
  \\providecommand{\\faMapMarker}{\\textbf{L:}}
  \\providecommand{\\faLinkedin}{\\textbf{in:}}
  \\providecommand{\\faGithub}{\\textbf{gh:}}
  \\providecommand{\\faGlobe}{\\textbf{web:}}
}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{tabularx}
\\usepackage{microtype}

% PDF Metadata
\\hypersetup{
    pdftitle={${escapeLatex(p.fullName || 'Resume')}},
    pdfauthor={${escapeLatex(p.fullName || 'CampusPrep Resume')}}
}

% Exact ABES Section formatting: Title Case, large bold, full-width titlerule
\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{6pt}{3pt}

% Exact ABES En-dash Bullet Points
\\setlist[itemize]{noitemsep, topsep=1pt, leftmargin=1.2em, label=--}
\\pagestyle{empty}

\\begin{document}

`;

  //---------- HEADING ----------
  const contactEntries = [];
  if (p.phone && p.phone.trim()) {
    const rawPhone = p.phone.trim();
    contactEntries.push({
      type: 'phone',
      url: normalizePhone(rawPhone),
      label: escapeLatex(formatDisplayPhone(rawPhone)),
      iconMacro: '\\faPhone'
    });
  }
  if (p.email && p.email.trim()) {
    const cleanEmail = p.email.trim();
    contactEntries.push({
      type: 'email',
      url: normalizeEmail(cleanEmail),
      label: 'Email',
      iconMacro: '\\faEnvelope'
    });
  }
  const linkedin = p.linkedinUrl || p.linkedin;
  if (linkedin && linkedin.trim()) {
    const rawLink = linkedin.trim();
    contactEntries.push({
      type: 'linkedin',
      url: normalizeUrl(rawLink),
      label: 'LinkedIn',
      iconMacro: '\\faLinkedin'
    });
  }
  const github = p.githubUrl || p.github;
  if (github && github.trim()) {
    const rawGit = github.trim();
    contactEntries.push({
      type: 'github',
      url: normalizeUrl(rawGit),
      label: 'GitHub',
      iconMacro: '\\faGithub'
    });
  }
  const portfolio = p.portfolioUrl || p.portfolio;
  if (portfolio && portfolio.trim()) {
    const rawPort = portfolio.trim();
    contactEntries.push({
      type: 'portfolio',
      url: normalizeUrl(rawPort),
      label: 'Portfolio',
      iconMacro: '\\faGlobe'
    });
  }

  const line1Contacts = contactEntries.map(c => `\\href{${c.url}}{${c.iconMacro}\\ ${c.label}}`);

  const hasName = !!(p.fullName && p.fullName.trim());
  const location = (p.location || '').trim();

  if (hasName || line1Contacts.length > 0) {
    tex += `%---------- HEADING ----------\n\\begin{center}\n`;
    if (hasName) {
      tex += `    {\\LARGE\\bfseries ${escapeLatex(p.fullName.trim())}} \\\\[2pt]\n`;
    }
    if (location) {
      tex += `    {\\small ${escapeLatex(location)}} \\\\[3pt]\n`;
    }
    if (line1Contacts.length > 0) {
      tex += `    {\\small ${line1Contacts.join(' \\quad ')}}\n`;
    }
    tex += `\\end{center}\n\\vspace{-8pt}\n\n`;
  }

  //---------- PROFESSIONAL SUMMARY (if provided) ----------
  if (summary) {
    tex += `%---------- PROFESSIONAL SUMMARY ----------\n\\section{Professional Summary}\n${escapeLatex(summary)}\n\n`;
  }

  //---------- EDUCATION ----------
  if (education.length > 0) {
    tex += `%---------- EDUCATION ----------\n\\section{Education}\n`;
    education.forEach(edu => {
      const dates = getEducationDuration(edu);
      const degreeTitle = getEducationDegreeTitle(edu);
      const score = formatEducationScore(edu.cgpaOrPercentage || edu.cgpa || edu.percentage || edu.grade || edu.score);
      const institution = (edu.institution || '').trim();

      tex += `\\noindent\\textbf{${escapeLatex(degreeTitle)}}`;
      if (dates) {
        tex += ` \\hfill \\textbf{${escapeLatex(dates)}}`;
      }
      tex += ` \\\\\n`;

      if (institution) {
        tex += `\\textit{${escapeLatex(institution)}}`;
      }
      if (score) {
        tex += ` \\hfill \\textit{${escapeLatex(score)}}`;
      }
      tex += ` \\\\[3pt]\n`;

      if (edu.description && edu.description.trim()) {
        tex += `{\\small ${escapeLatex(edu.description.trim())}} \\\\[2pt]\n`;
      }
    });
    tex += `\n`;
  }

  //---------- TECHNICAL SKILLS ----------
  if (skills.length > 0) {
    tex += `%---------- TECHNICAL SKILLS ----------\n\\section{Technical Skills}\n\\noindent\n`;
    const skillLines = skills.map(sk => {
      const cat = escapeLatex(sk.category || 'Skills');
      const itemsList = escapeLatex(Array.isArray(sk.items) ? sk.items.join(', ') : (sk.items || ''));
      return `\\textbf{${cat}:} ${itemsList}`;
    });
    tex += `${skillLines.join(' \\\\\n')}\n\n`;
  }

  //---------- INTERNSHIPS ----------
  if (experience.length > 0) {
    tex += `%---------- INTERNSHIPS ----------\n\\section{Internships}\n`;
    experience.forEach(exp => {
      const dates = exp.duration || [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' -- ');
      const company = exp.company || 'Company';
      const role = exp.title || exp.role || 'Role';
      const locationOrMode = exp.location || '';

      tex += `\\noindent\\textbf{${escapeLatex(company)}}`;
      if (dates) {
        tex += ` \\hfill \\textbf{${escapeLatex(dates.replace(/[–—]/g, '--'))}}`;
      }
      tex += ` \\\\\n`;

      tex += `\\textit{${escapeLatex(role)}}`;
      if (locationOrMode) {
        tex += ` \\hfill \\textit{${escapeLatex(locationOrMode)}}`;
      }
      tex += `\n`;

      const bullets = Array.isArray(exp.bullets) ? exp.bullets.filter(b => b && b.trim()) : [];
      if (bullets.length > 0) {
        tex += `\\begin{itemize}\n`;
        bullets.forEach(b => {
          tex += `    \\item ${escapeLatex(b.trim())}\n`;
        });
        tex += `\\end{itemize}\n`;
      }
      tex += `\\vspace{2pt}\n`;
    });
    tex += `\n`;
  }

  //---------- PROJECTS ----------
  if (projects.length > 0) {
    tex += `%---------- PROJECTS ----------\n\\section{Projects}\n`;
    projects.forEach(proj => {
      const links = [];
      if (proj.githubUrl && proj.githubUrl.trim()) {
        links.push(`\\href{${normalizeUrl(proj.githubUrl)}}{[GitHub]}`);
      }
      if (proj.liveUrl && proj.liveUrl.trim()) {
        links.push(`\\href{${normalizeUrl(proj.liveUrl)}}{[Live Demo]}`);
      }
      const linkStr = links.length > 0 ? ` ${links.join(' ')}` : '';
      const dates = proj.date || proj.duration || '';

      tex += `\\noindent\\textbf{${escapeLatex(proj.title || 'Project')}}${linkStr}`;
      if (dates) {
        tex += ` \\hfill \\textbf{${escapeLatex(dates.replace(/[–—]/g, '--'))}}`;
      }
      tex += `\n`;

      const bullets = Array.isArray(proj.bullets) ? proj.bullets.filter(b => b && b.trim()) : [];
      if (bullets.length > 0) {
        tex += `\\begin{itemize}\n`;
        bullets.forEach(b => {
          tex += `    \\item ${escapeLatex(b.trim())}\n`;
        });
        tex += `\\end{itemize}\n`;
      } else if (proj.description && proj.description.trim()) {
        tex += `\\begin{itemize}\n    \\item ${escapeLatex(proj.description.trim())}\n\\end{itemize}\n`;
      }
      tex += `\\vspace{2pt}\n`;
    });
    tex += `\n`;
  }

  //---------- ACHIEVEMENT ----------
  if (achievements.length > 0) {
    tex += `%---------- ACHIEVEMENT ----------\n\\section{Achievement}\n`;
    achievements.forEach(ach => {
      const title = escapeLatex(ach.title || '');
      const desc = escapeLatex(ach.description || ach.organization || '');
      const date = (ach.year || ach.date) ? escapeLatex((ach.year || ach.date).replace(/[–—]/g, '--')) : '';

      tex += `\\noindent\\textbf{${title}}`;
      if (date) {
        tex += ` \\hfill \\textbf{${date}}`;
      }
      tex += ` \\\\\n`;
      if (desc) {
        tex += `\\textit{${desc}} \\\\[3pt]\n`;
      }
    });
    tex += `\n`;
  }

  //---------- CERTIFICATES ----------
  if (certifications.length > 0) {
    tex += `%---------- CERTIFICATES ----------\n\\section{Certificates}\n`;
    certifications.forEach(cert => {
      const name = escapeLatex(cert.name || '');
      const issuer = escapeLatex(cert.issuer || '');
      const date = cert.date ? escapeLatex(cert.date.replace(/[–—]/g, '--')) : '';
      const link = cert.url && cert.url.trim() ? ` \\hfill \\href{${normalizeUrl(cert.url)}}{[Verify]}` : '';

      tex += `\\noindent\\textbf{${name}}`;
      if (date) {
        tex += ` \\hfill \\textbf{${date}}`;
      }
      tex += ` \\\\\n`;
      if (issuer) {
        tex += `\\textit{${issuer}}${link} \\\\[3pt]\n`;
      } else if (link) {
        tex += `${link} \\\\[3pt]\n`;
      }
    });
    tex += `\n`;
  }

  //---------- EXTRACURRICULAR ----------
  if (extracurricular.length > 0) {
    tex += `%---------- EXTRACURRICULAR ----------\n\\section{Extracurricular}\n`;
    extracurricular.forEach(ext => {
      const act = escapeLatex(ext.organization || ext.activity || '');
      const role = escapeLatex(ext.role || '');
      const dates = [ext.startDate, ext.endDate].filter(Boolean).join(' -- ') || (ext.duration || '');

      tex += `\\noindent\\textbf{${act}}`;
      if (dates) {
        tex += ` \\hfill \\textbf{${escapeLatex(dates.replace(/[–—]/g, '--'))}}`;
      }
      tex += ` \\\\\n`;
      if (role) {
        tex += `\\textit{${role}}\n`;
      }

      if (ext.description && ext.description.trim()) {
        tex += `\\begin{itemize}\n    \\item ${escapeLatex(ext.description.trim())}\n\\end{itemize}\n`;
      }
      tex += `\\vspace{2pt}\n`;
    });
    tex += `\n`;
  }

  tex += `\\end{document}\n`;
  return tex;
}
