/**
 * CampusPrep ATS Resume LaTeX Generator
 * Generates clean, standard Overleaf-compatible ATS-friendly LaTeX code.
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

// Formats display phone cleanly (e.g. +91 7668016628)
export function formatDisplayPhone(phone) {
  if (!phone) return '';
  const str = String(phone).trim();
  if (!str) return '';
  if (/[ ()\-]/.test(str)) return str;
  const match = str.match(/^(\+\d{1,3})(\d{10})$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return str;
}

// Formats CGPA or percentage for standard professional ATS display
export function formatEducationScore(raw) {
  if (!raw && raw !== 0) return '';
  const str = String(raw).trim();
  if (!str) return '';
  if (/^(cgpa|percentage|percent|grade|score|gpa|cpi)/i.test(str)) {
    return str;
  }
  if (str.endsWith('%')) {
    return `Percentage: ${str}`;
  }
  const cleanNum = str.replace(/[^\d.]/g, '');
  const num = parseFloat(cleanNum);
  if (!isNaN(num)) {
    if (num <= 10) {
      return `CGPA: ${str}`;
    } else {
      return `Percentage: ${str}${str.includes('%') ? '' : '%'}`;
    }
  }
  return str;
}

// Extracts duration from education entry supporting duration, start/end dates and years
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

// Combines degree and field of study cleanly without redundant duplication
export function getEducationDegreeTitle(edu) {
  if (!edu) return 'Degree';
  const degree = (edu.degree || '').trim();
  const field = (edu.fieldOfStudy || edu.field || edu.major || '').trim();
  if (degree && field) {
    if (degree.toLowerCase().includes(field.toLowerCase())) {
      return degree;
    }
    return `${degree} in ${field}`;
  }
  return degree || field || 'Degree';
}

// Generates complete, valid, Overleaf-compilable .tex source from resume data
export function generateLatex(resumeData, options = {}) {
  if (!resumeData) return '';

  const p = resumeData.personalDetails || resumeData.personal || {};
  const summary = (resumeData.summary || p.summary || '').trim();

  // Filter sections to include ONLY non-empty user data
  const rawEducation = Array.isArray(resumeData.education) ? resumeData.education : [];
  const education = rawEducation.filter(e => 
    e && (e.degree?.trim() || e.institution?.trim() || e.fieldOfStudy?.trim() || e.location?.trim() || e.duration?.trim() || e.cgpaOrPercentage?.trim() || e.cgpa?.trim())
  );

  let rawSkills = [];
  if (Array.isArray(resumeData.skills)) {
    rawSkills = resumeData.skills;
  } else if (resumeData.skills && typeof resumeData.skills === 'object') {
    const s = resumeData.skills;
    if (s.languages?.trim()) rawSkills.push({ category: 'Languages', items: s.languages });
    if (s.frameworks?.trim()) rawSkills.push({ category: 'Frameworks & Libraries', items: s.frameworks });
    if (s.tools?.trim()) rawSkills.push({ category: 'Developer Tools', items: s.tools });
    if (s.databases?.trim()) rawSkills.push({ category: 'Databases', items: s.databases });
    if (s.coreConcepts?.trim()) rawSkills.push({ category: 'Core CS Concepts', items: s.coreConcepts });
    if (s.other?.trim()) rawSkills.push({ category: 'Other Skills', items: s.other });
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
  const template = options.template || resumeData.template || 'classic-tech';

  let tex = `%----------------------------------------------------------------------------------------
% CampusPrep ATS One-Page Resume Template (${template})
% Overleaf Standard Compatible (Single-page, text-based, machine readable)
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

% Clean ATS Section formatting
\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{5pt}{3pt}

\\setlist[itemize]{noitemsep, topsep=1pt, leftmargin=1.2em}
\\pagestyle{empty}

\\begin{document}

`;

  //---------- HEADING ----------
  const contactItems = [];
  if (p.phone && p.phone.trim()) {
    const rawPhone = p.phone.trim();
    contactItems.push(`\\faPhone\\ \\href{${normalizePhone(rawPhone)}}{${escapeLatex(formatDisplayPhone(rawPhone))}}`);
  }
  if (p.email && p.email.trim()) {
    const cleanEmail = p.email.trim();
    contactItems.push(`\\faEnvelope\\ \\href{${normalizeEmail(cleanEmail)}}{${escapeLatex(cleanEmail)}}`);
  }
  if (p.location && p.location.trim()) {
    contactItems.push(`\\faMapMarker\\ ${escapeLatex(p.location.trim())}`);
  }
  const linkedin = p.linkedinUrl || p.linkedin;
  if (linkedin && linkedin.trim()) {
    const rawLink = linkedin.trim();
    contactItems.push(`\\faLinkedin\\ \\href{${normalizeUrl(rawLink)}}{${escapeLatex(cleanDisplayUrl(rawLink))}}`);
  }
  const github = p.githubUrl || p.github;
  if (github && github.trim()) {
    const rawGit = github.trim();
    contactItems.push(`\\faGithub\\ \\href{${normalizeUrl(rawGit)}}{${escapeLatex(cleanDisplayUrl(rawGit))}}`);
  }
  const portfolio = p.portfolioUrl || p.portfolio;
  if (portfolio && portfolio.trim()) {
    const rawPort = portfolio.trim();
    contactItems.push(`\\faGlobe\\ \\href{${normalizeUrl(rawPort)}}{${escapeLatex(cleanDisplayUrl(rawPort))}}`);
  }

  const hasName = !!(p.fullName && p.fullName.trim());
  const hasContact = contactItems.length > 0;

  if (hasName || hasContact) {
    const isCenter = template !== 'modern-clean';
    if (isCenter) {
      tex += `%---------- HEADING ----------\n\\begin{center}\n`;
      if (hasName) {
        tex += `    {\\LARGE\\bfseries ${escapeLatex(p.fullName.trim())}}`;
        const roleTitle = (p.targetRole || p.professionalHeadline || p.role || '').trim();
        if (roleTitle) {
          tex += ` \\\\[2pt]\n    {\\normalsize\\itshape ${escapeLatex(roleTitle)}}`;
        }
        if (hasContact) {
          tex += ` \\\\[3pt]\n`;
        } else {
          tex += `\n`;
        }
      }
      if (hasContact) {
        tex += `    \\small\n    ${contactItems.join(' $|$ ')}\n`;
      }
      tex += `\\end{center}\n\\vspace{-6pt}\n\n`;
    } else {
      tex += `%---------- HEADING ----------\n\\noindent\n`;
      if (hasName) {
        tex += `{\\LARGE\\bfseries ${escapeLatex(p.fullName.trim())}}`;
        const roleTitle = (p.targetRole || p.professionalHeadline || p.role || '').trim();
        if (roleTitle) {
          tex += ` \\hfill {\\normalsize\\itshape ${escapeLatex(roleTitle)}}`;
        }
        tex += ` \\\\[3pt]\n`;
      }
      if (hasContact) {
        tex += `{\\small ${contactItems.join(' $|$ ')}}\n`;
      }
      tex += `\\vspace{4pt}\n\\hrule\n\\vspace{6pt}\n\n`;
    }
  }

  //---------- PROFESSIONAL SUMMARY ----------
  if (summary) {
    tex += `%---------- PROFESSIONAL SUMMARY ----------\n\\section{PROFESSIONAL SUMMARY}\n${escapeLatex(summary)}\n\n`;
  }

  //---------- EDUCATION ----------
  if (education.length > 0) {
    tex += `%---------- EDUCATION ----------\n\\section{EDUCATION}\n`;
    education.forEach(edu => {
      const dates = getEducationDuration(edu);
      const degreeTitle = getEducationDegreeTitle(edu);
      const score = formatEducationScore(edu.cgpaOrPercentage || edu.cgpa || edu.percentage || edu.grade || edu.score);

      tex += `\\noindent\\textbf{${escapeLatex(degreeTitle)}}`;
      if (dates) {
        tex += ` \\hfill ${escapeLatex(dates)}`;
      }
      tex += ` \\\\\n`;

      const subParts = [];
      if (edu.institution && edu.institution.trim()) subParts.push(`\\textit{${escapeLatex(edu.institution.trim())}}`);
      if (edu.board && edu.board.trim()) subParts.push(`(${escapeLatex(edu.board.trim())})`);
      if (edu.location && edu.location.trim()) subParts.push(escapeLatex(edu.location.trim()));

      if (subParts.length > 0) {
        tex += `${subParts.join(' $|$ ')}`;
      }
      if (score) {
        tex += ` \\hfill \\textbf{${escapeLatex(score)}}`;
      }
      tex += ` \\\\\n`;

      if (edu.description && edu.description.trim()) {
        tex += `\\small ${escapeLatex(edu.description.trim())} \\\\\n`;
      }
      tex += `\\vspace{2pt}\n`;
    });
    tex += `\n`;
  }

  //---------- TECHNICAL SKILLS ----------
  if (skills.length > 0) {
    tex += `%---------- TECHNICAL SKILLS ----------\n\\section{TECHNICAL SKILLS}\n\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    skills.forEach(sk => {
      const cat = escapeLatex(sk.category || 'Skills');
      const itemsList = Array.isArray(sk.items) ? sk.items.join(', ') : (sk.items || '');
      tex += `    \\item \\textbf{${cat}:} ${escapeLatex(itemsList)}\n`;
    });
    tex += `\\end{itemize}\n\n`;
  }

  //---------- PROFESSIONAL EXPERIENCE ----------
  if (experience.length > 0) {
    tex += `%---------- PROFESSIONAL EXPERIENCE ----------\n\\section{PROFESSIONAL EXPERIENCE}\n`;
    experience.forEach(exp => {
      const dates = exp.duration || [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' -- ');
      const role = exp.title || exp.role || 'Role';

      tex += `\\noindent\\textbf{${escapeLatex(role)}}`;
      if (dates) {
        tex += ` \\hfill ${escapeLatex(dates)}`;
      }
      tex += ` \\\\\n`;

      const companyLine = [];
      if (exp.company) companyLine.push(`\\textit{${escapeLatex(exp.company)}}`);
      if (exp.location) companyLine.push(escapeLatex(exp.location));

      if (companyLine.length > 0) {
        tex += `${companyLine.join(' $|$ ')} \\\\\n`;
      }

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
    tex += `%---------- PROJECTS ----------\n\\section{PROJECTS}\n`;
    projects.forEach(proj => {
      const links = [];
      if (proj.githubUrl && proj.githubUrl.trim()) {
        links.push(`\\href{${normalizeUrl(proj.githubUrl)}}{[GitHub]}`);
      }
      if (proj.liveUrl && proj.liveUrl.trim()) {
        links.push(`\\href{${normalizeUrl(proj.liveUrl)}}{[Live Demo]}`);
      }
      const linkStr = links.length > 0 ? ` \\hfill ${links.join(' ')}` : '';
      const tech = proj.techStack || proj.technologies;

      tex += `\\noindent\\textbf{${escapeLatex(proj.title || 'Project')}}`;
      if (tech) {
        tex += ` $|$ \\textit{\\small ${escapeLatex(tech)}}`;
      }
      tex += `${linkStr} \\\\\n`;

      if (proj.description && proj.description.trim()) {
        tex += `{\\small ${escapeLatex(proj.description.trim())}} \\\\\n`;
      }

      const bullets = Array.isArray(proj.bullets) ? proj.bullets.filter(b => b && b.trim()) : [];
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

  //---------- ACHIEVEMENTS ----------
  if (achievements.length > 0) {
    tex += `%---------- ACHIEVEMENTS ----------\n\\section{ACHIEVEMENTS}\n\\begin{itemize}\n`;
    achievements.forEach(ach => {
      const title = escapeLatex(ach.title || '');
      const desc = ach.description ? ' -- ' + escapeLatex(ach.description) : '';
      const date = (ach.year || ach.date) ? ` \\hfill \\textit{${escapeLatex(ach.year || ach.date)}}` : '';
      tex += `    \\item \\textbf{${title}}${desc}${date}\n`;
    });
    tex += `\\end{itemize}\n\n`;
  }

  //---------- CERTIFICATIONS & PROGRAMS ----------
  if (certifications.length > 0) {
    tex += `%---------- CERTIFICATIONS \\& PROGRAMS ----------\n\\section{CERTIFICATIONS \\& PROGRAMS}\n\\begin{itemize}\n`;
    certifications.forEach(cert => {
      const name = escapeLatex(cert.name || '');
      const issuer = cert.issuer ? ` (${escapeLatex(cert.issuer)})` : '';
      const date = cert.date ? ` \\hfill \\textit{${escapeLatex(cert.date)}}` : '';
      const link = cert.url && cert.url.trim() ? ` \\href{${normalizeUrl(cert.url)}}{[Verify]}` : '';
      tex += `    \\item \\textbf{${name}}${issuer}${link}${date}\n`;
    });
    tex += `\\end{itemize}\n\n`;
  }

  //---------- EXTRACURRICULAR ----------
  if (extracurricular.length > 0) {
    tex += `%---------- EXTRACURRICULAR ----------\n\\section{EXTRACURRICULAR ACTIVITIES}\n\\begin{itemize}\n`;
    extracurricular.forEach(ext => {
      const act = escapeLatex(ext.activity || ext.role || 'Activity');
      const org = ext.organization ? `, ${escapeLatex(ext.organization)}` : '';
      const desc = ext.description ? `: ${escapeLatex(ext.description)}` : '';
      const dates = [ext.startDate, ext.endDate].filter(Boolean).join(' -- ');
      const dateStr = dates ? ` \\hfill \\textit{${escapeLatex(dates)}}` : '';
      tex += `    \\item \\textbf{${act}}${org}${desc}${dateStr}\n`;
    });
    tex += `\\end{itemize}\n\n`;
  }

  tex += `\\end{document}\n`;
  return tex;
}
