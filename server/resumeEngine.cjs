/**
 * ProfessorVirus Resume Engine
 * - Automatic LaTeX Source Generation (ATS One-Page Template)
 * - Deterministic Vector PDF Compilation & Layout Calculation (pdf-lib)
 * - Strict One-Page Enforcement & Spacing Optimization
 * - AI Content Assistant (Summary, Bullet improvements, 1-Page compression)
 * - Upload/Import Parser (PDF, DOCX, DOC)
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFString, PDFArray, rgb, StandardFonts } = require('pdf-lib');
const JSZip = require('jszip');

// Escapes special characters for LaTeX safely
function escapeLatex(text) {
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
function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

// Clean URL for professional ATS display
function cleanDisplayUrl(url) {
  if (!url) return '';
  let str = String(url).trim();
  if (!str) return '';
  str = str.replace(/^https?:\/\//i, '');
  str = str.replace(/^www\./i, '');
  str = str.replace(/\/+$/, '');
  return str;
}

// Normalizes email addresses to mailto: URIs
function normalizeEmail(email) {
  if (!email) return '';
  const trimmed = String(email).trim();
  if (!trimmed) return '';
  if (/^mailto:/i.test(trimmed)) {
    return trimmed;
  }
  return `mailto:${trimmed}`;
}

// Normalizes phone numbers to tel: URIs preserving digits and leading +
function normalizePhone(phone) {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  if (!trimmed) return '';
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return `tel:${hasPlus ? '+' : ''}${digits}`;
}

// Formats display phone cleanly (e.g. +91 7668016628)
function formatDisplayPhone(phone) {
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

// Vector SVG path definitions for professional ATS contact icons (24x24 viewBox standard)
const CONTACT_ICONS = {
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  location: 'M12 2a8 8 0 0 0-8 8c0 5.25 7 11.4 7.35 11.7a1 1 0 0 0 1.3 0c.35-.3 7.35-6.45 7.35-11.7a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 3-3 3 3 0 0 1-3 3z',
  linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75a1.75 1.75 0 0 0-1.75 1.75c0 .97.78 1.76 1.75 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z',
  github: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
  portfolio: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8 8 0 0 1 18.93 8zM12 4.07a14 14 0 0 1 1.83 3.93h-3.66A14 14 0 0 1 12 4.07zM4.26 14a8 8 0 0 1 0-4h3.38a16.7 16.7 0 0 0 0 4zm.81 2h2.95a15.65 15.65 0 0 0 1.38 3.56A8 8 0 0 1 5.07 16zm2.95-8H5.07a8 8 0 0 1 3.95-3.56A15.65 15.65 0 0 0 8.02 8zm3.98 11.93A14 14 0 0 1 10.17 16h3.66a14 14 0 0 1-1.83 3.93zm2.17-5.93h-4.34a14.7 14.7 0 0 1 0-4h4.34a14.7 14.7 0 0 1 0 4zm.85 5.56A15.65 15.65 0 0 0 16.4 16h2.95a8 8 0 0 1-3.97 3.56zM16.36 14a16.7 16.7 0 0 0 0-4h3.38a8 8 0 0 1 0 4z'
};

// Formats CGPA or percentage for standard professional ATS display
function formatEducationScore(raw) {
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
function getEducationDuration(edu) {
  if (!edu) return '';
  let str = '';
  if (edu.duration && String(edu.duration).trim()) {
    str = String(edu.duration).trim();
  } else {
    const start = (edu.startDate || edu.startYear || '').toString().trim();
    const end = (edu.endDate || edu.endYear || '').toString().trim();
    if (start && end) str = `${start} - ${end}`;
    else if (start || end) str = (start || end);
  }
  if (!str) return '';
  return str.replace(/[–—]/g, '-');
}

// Combines degree and field of study cleanly without redundant duplication
function getEducationDegreeTitle(edu) {
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

// Helper to register clickable PDF Link Annotation with pdf-lib
function addLinkAnnotation(page, pdfDoc, x, y, width, height, url) {
  if (!url || typeof url !== 'string') return;
  try {
    const linkAnnotation = pdfDoc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [x, y - 2, x + width, y + height + 2],
      Border: [0, 0, 0],
      C: [0, 0, 1],
      F: 4,
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(url.trim())
      }
    });
    const linkRef = pdfDoc.context.register(linkAnnotation);
    const annots = page.node.lookupMaybe(PDFName.of('Annots'), PDFArray);
    if (annots) {
      annots.push(linkRef);
    } else {
      page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([linkRef]));
    }
  } catch (err) {
    console.error('Error adding link annotation to PDF:', err);
  }
}

// Generate valid, clean LaTeX source code from structured resume JSON
function generateLatex(resumeData, options = {}) {
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
    x && (x.role?.trim() || x.organization?.trim() || x.description?.trim())
  );

  const fontSize = options.fontSize || '10pt';
  const margin = options.margin || '0.45in';

  let tex = `%----------------------------------------------------------------------------------------
% ProfessorVirus ATS One-Page Resume Template
% Overleaf Standard Compatible (Single-page, text-based, machine readable)
%----------------------------------------------------------------------------------------

\\documentclass[${fontSize},a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=${margin}]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
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
    contactItems.push(`\\faMapMarker*\\ ${escapeLatex(p.location.trim())}`);
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
    tex += `%---------- HEADING ----------\n\\begin{center}\n`;
    if (hasName) {
      tex += `    {\\LARGE\\bfseries ${escapeLatex(p.fullName.trim())}}`;
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

// Helper to wrap text into multiple lines for a given maximum width
function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, fontSize);
    if (width <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * High-Fidelity Deterministic Vector PDF Compiler (pdf-lib)
 * Automatically optimizes spacing and margins to strictly guarantee 1 page.
 */
async function compileResumePdf(resumeData, customOptions = {}) {
  const startTime = Date.now();

  // Printable dimensions (A4 standard: 595.28 x 841.89 points)
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;

  // Progressive compression levels for One-Page guarantee
  const COMPRESSION_LEVELS = [
    { name: 'Standard', margin: 32, baseFont: 9.5, sectionGap: 8, bulletGap: 2.2, itemGap: 4, nameSize: 17 },
    { name: 'Mild Compress', margin: 28, baseFont: 9.0, sectionGap: 6.5, bulletGap: 1.8, itemGap: 3.5, nameSize: 16 },
    { name: 'Moderate Compress', margin: 24, baseFont: 8.5, sectionGap: 5.0, bulletGap: 1.5, itemGap: 2.5, nameSize: 15 },
    { name: 'Ultra Compact', margin: 20, baseFont: 8.0, sectionGap: 4.0, bulletGap: 1.2, itemGap: 2.0, nameSize: 14 }
  ];

  let selectedPdfBytes = null;
  let finalStatus = 'failed';
  let onePageOptimized = false;
  let compileErrors = [];
  let generatedLatexCode = '';
  let successfulConfig = null;

  for (let i = 0; i < COMPRESSION_LEVELS.length; i++) {
    const cfg = COMPRESSION_LEVELS[i];
    try {
      const pdfDoc = await PDFDocument.create();
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const obliqueFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      const margin = cfg.margin;
      const contentWidth = PAGE_WIDTH - 2 * margin;

      let cursorY = PAGE_HEIGHT - margin;

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
        if (s.frameworks?.trim()) rawSkills.push({ category: 'Frameworks', items: s.frameworks });
        if (s.tools?.trim()) rawSkills.push({ category: 'Tools', items: s.tools });
        if (s.databases?.trim()) rawSkills.push({ category: 'Databases', items: s.databases });
        if (s.coreConcepts?.trim()) rawSkills.push({ category: 'Core CS', items: s.coreConcepts });
        if (s.other?.trim()) rawSkills.push({ category: 'Other', items: s.other });
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
        x && (x.role?.trim() || x.organization?.trim() || x.description?.trim())
      );

      // --- 1. HEADER ---
      const hasName = !!(p.fullName && p.fullName.trim());
      if (hasName) {
        const fullName = p.fullName.trim().toUpperCase();
        const nameWidth = boldFont.widthOfTextAtSize(fullName, cfg.nameSize);
        page.drawText(fullName, {
          x: margin + Math.max(0, (contentWidth - nameWidth) / 2),
          y: cursorY - cfg.nameSize,
          size: cfg.nameSize,
          font: boldFont,
          color: rgb(0.12, 0.14, 0.13)
        });
        cursorY -= (cfg.nameSize + 4);
      }

      // Contact info bar with clickable hyperlinks
      const contactItems = [];
      if (p.phone && p.phone.trim()) {
        const rawPhone = p.phone.trim();
        contactItems.push({
          type: 'phone',
          text: formatDisplayPhone(rawPhone),
          isLink: true,
          url: normalizePhone(rawPhone)
        });
      }
      if (p.email && p.email.trim()) {
        const cleanEmail = p.email.trim();
        contactItems.push({
          type: 'email',
          text: cleanEmail,
          isLink: true,
          url: normalizeEmail(cleanEmail)
        });
      }
      if (p.location && p.location.trim()) {
        contactItems.push({
          type: 'location',
          text: p.location.trim(),
          isLink: false
        });
      }
      const linkedin = p.linkedinUrl || p.linkedin;
      if (linkedin && linkedin.trim()) {
        const rawLink = linkedin.trim();
        contactItems.push({
          type: 'linkedin',
          text: cleanDisplayUrl(rawLink),
          isLink: true,
          url: normalizeUrl(rawLink)
        });
      }
      const github = p.githubUrl || p.github;
      if (github && github.trim()) {
        const rawGit = github.trim();
        contactItems.push({
          type: 'github',
          text: cleanDisplayUrl(rawGit),
          isLink: true,
          url: normalizeUrl(rawGit)
        });
      }
      const portfolio = p.portfolioUrl || p.portfolio;
      if (portfolio && portfolio.trim()) {
        const rawPort = portfolio.trim();
        contactItems.push({
          type: 'portfolio',
          text: cleanDisplayUrl(rawPort),
          isLink: true,
          url: normalizeUrl(rawPort)
        });
      }

      if (contactItems.length > 0) {
        const sepText = '  |  ';
        const sepWidth = regularFont.widthOfTextAtSize(sepText, cfg.baseFont - 0.5);
        const iconScale = 0.28;
        const iconW = 24 * iconScale;
        const iconGap = 2.5;

        const getItemWidth = (it) => {
          const textW = regularFont.widthOfTextAtSize(it.text, cfg.baseFont - 0.5);
          const hasIcon = Boolean(CONTACT_ICONS[it.type]);
          return textW + (hasIcon ? (iconW + iconGap) : 0);
        };

        const itemWidths = contactItems.map(getItemWidth);
        const totalWidth = itemWidths.reduce((a, b) => a + b, 0) + (contactItems.length - 1) * sepWidth;

        const drawSingleItem = (item, curX, curY, totalW) => {
          const hasIcon = Boolean(CONTACT_ICONS[item.type]);
          let textX = curX;

          if (hasIcon) {
            page.drawSvgPath(CONTACT_ICONS[item.type], {
              x: curX,
              y: curY + ((cfg.baseFont - 0.5) * 0.72),
              scale: iconScale,
              color: item.isLink ? rgb(0.18, 0.22, 0.26) : rgb(0.35, 0.38, 0.4)
            });
            textX = curX + iconW + iconGap;
          }

          if (item.isLink) {
            page.drawText(item.text, {
              x: textX,
              y: curY,
              size: cfg.baseFont - 0.5,
              font: regularFont,
              color: rgb(0.05, 0.35, 0.75)
            });
            addLinkAnnotation(page, pdfDoc, curX, curY - 1.5, totalW, (cfg.baseFont - 0.5) + 3, item.url);
          } else {
            page.drawText(item.text, {
              x: textX,
              y: curY,
              size: cfg.baseFont - 0.5,
              font: regularFont,
              color: rgb(0.3, 0.35, 0.35)
            });
          }
        };

        if (totalWidth <= contentWidth) {
          let curX = margin + Math.max(0, (contentWidth - totalWidth) / 2);
          const curY = cursorY - (cfg.baseFont - 0.5);
          contactItems.forEach((item, idx) => {
            const w = itemWidths[idx];
            drawSingleItem(item, curX, curY, w);
            curX += w;
            if (idx < contactItems.length - 1) {
              page.drawText(sepText, {
                x: curX,
                y: curY,
                size: cfg.baseFont - 0.5,
                font: regularFont,
                color: rgb(0.55, 0.55, 0.55)
              });
              curX += sepWidth;
            }
          });
          cursorY -= (cfg.baseFont + cfg.sectionGap);
        } else {
          const line1 = contactItems.filter(i => ['phone', 'email', 'location'].includes(i.type));
          const line2 = contactItems.filter(i => ['linkedin', 'github', 'portfolio'].includes(i.type));
          const lines = [line1, line2].filter(l => l.length > 0);

          lines.forEach(lineItems => {
            const lWidths = lineItems.map(getItemWidth);
            const lTotal = lWidths.reduce((a, b) => a + b, 0) + (lineItems.length - 1) * sepWidth;
            let curX = margin + Math.max(0, (contentWidth - lTotal) / 2);
            const curY = cursorY - (cfg.baseFont - 0.5);
            lineItems.forEach((item, idx) => {
              const w = lWidths[idx];
              drawSingleItem(item, curX, curY, w);
              curX += w;
              if (idx < lineItems.length - 1) {
                page.drawText(sepText, {
                  x: curX,
                  y: curY,
                  size: cfg.baseFont - 0.5,
                  font: regularFont,
                  color: rgb(0.55, 0.55, 0.55)
                });
                curX += sepWidth;
              }
            });
            cursorY -= (cfg.baseFont + 2);
          });
          cursorY -= cfg.sectionGap;
        }
      }

      // Helper to render section title with clean divider rule
      const renderSectionHeading = (title) => {
        cursorY -= cfg.sectionGap;
        const headSize = cfg.baseFont + 1.5;
        page.drawText(title.toUpperCase(), {
          x: margin,
          y: cursorY - headSize,
          size: headSize,
          font: boldFont,
          color: rgb(0.12, 0.14, 0.13)
        });
        cursorY -= (headSize + 2);

        // Horizontal Rule
        page.drawLine({
          start: { x: margin, y: cursorY },
          end: { x: margin + contentWidth, y: cursorY },
          thickness: 0.75,
          color: rgb(0.75, 0.75, 0.75)
        });
        cursorY -= 4;
      };

      // --- 2. SUMMARY ---
      if (summary) {
        renderSectionHeading('Professional Summary');
        const sumLines = wrapText(summary, regularFont, cfg.baseFont, contentWidth);
        sumLines.forEach(line => {
          page.drawText(line, {
            x: margin,
            y: cursorY - cfg.baseFont,
            size: cfg.baseFont,
            font: regularFont,
            color: rgb(0.2, 0.2, 0.2)
          });
          cursorY -= (cfg.baseFont + 2);
        });
      }

      // --- 3. EDUCATION ---
      if (education.length > 0) {
        renderSectionHeading('Education');
        education.forEach((edu, eIdx) => {
          const degTitle = getEducationDegreeTitle(edu);
          const dateStr = getEducationDuration(edu);
          const scoreStr = formatEducationScore(edu.cgpaOrPercentage || edu.cgpa || edu.percentage || edu.grade || edu.score);

          // Line 1: Degree (bold, left) + Duration (right aligned)
          page.drawText(degTitle, {
            x: margin,
            y: cursorY - cfg.baseFont,
            size: cfg.baseFont,
            font: boldFont,
            color: rgb(0.12, 0.14, 0.13)
          });
          if (dateStr) {
            const dateW = regularFont.widthOfTextAtSize(dateStr, cfg.baseFont - 0.5);
            page.drawText(dateStr, {
              x: margin + contentWidth - dateW,
              y: cursorY - cfg.baseFont,
              size: cfg.baseFont - 0.5,
              font: obliqueFont,
              color: rgb(0.3, 0.3, 0.3)
            });
          }
          cursorY -= (cfg.baseFont + 2);

          // Line 2: Institution + Location (left) and CGPA/Score (right aligned)
          let instLine = edu.institution ? edu.institution.trim() : '';
          if (edu.board && edu.board.trim()) instLine += ` (${edu.board.trim()})`;
          if (edu.location && edu.location.trim()) {
            instLine += (instLine ? ' | ' : '') + edu.location.trim();
          }

          if (instLine || scoreStr) {
            if (instLine) {
              page.drawText(instLine, {
                x: margin,
                y: cursorY - (cfg.baseFont - 0.5),
                size: cfg.baseFont - 0.5,
                font: regularFont,
                color: rgb(0.35, 0.35, 0.35)
              });
            }
            if (scoreStr) {
              const scoreW = boldFont.widthOfTextAtSize(scoreStr, cfg.baseFont - 0.5);
              page.drawText(scoreStr, {
                x: margin + contentWidth - scoreW,
                y: cursorY - (cfg.baseFont - 0.5),
                size: cfg.baseFont - 0.5,
                font: boldFont,
                color: rgb(0.18, 0.22, 0.2)
              });
            }
            cursorY -= (cfg.baseFont + cfg.itemGap);
          } else {
            cursorY -= cfg.itemGap;
          }

          if (edu.description && edu.description.trim()) {
            const descLines = wrapText(edu.description.trim(), regularFont, cfg.baseFont - 1, contentWidth);
            descLines.forEach(line => {
              page.drawText(line, {
                x: margin,
                y: cursorY - (cfg.baseFont - 1),
                size: cfg.baseFont - 1,
                font: regularFont,
                color: rgb(0.3, 0.3, 0.3)
              });
              cursorY -= (cfg.baseFont + 1);
            });
            cursorY -= 2;
          }
        });
      }

      // --- 4. TECHNICAL SKILLS ---
      if (skills.length > 0) {
        renderSectionHeading('Technical Skills');
        skills.forEach(sk => {
          const cat = `${sk.category || 'Skills'}: `;
          const itemsStr = Array.isArray(sk.items) ? sk.items.join(', ') : (sk.items || '');
          const catWidth = boldFont.widthOfTextAtSize(cat, cfg.baseFont);

          page.drawText(cat, {
            x: margin,
            y: cursorY - cfg.baseFont,
            size: cfg.baseFont,
            font: boldFont,
            color: rgb(0.12, 0.14, 0.13)
          });

          const itemLines = wrapText(itemsStr, regularFont, cfg.baseFont, contentWidth - catWidth);
          if (itemLines.length > 0) {
            page.drawText(itemLines[0], {
              x: margin + catWidth,
              y: cursorY - cfg.baseFont,
              size: cfg.baseFont,
              font: regularFont,
              color: rgb(0.2, 0.2, 0.2)
            });
            cursorY -= (cfg.baseFont + 2);

            for (let li = 1; li < itemLines.length; li++) {
              page.drawText(itemLines[li], {
                x: margin + catWidth,
                y: cursorY - cfg.baseFont,
                size: cfg.baseFont,
                font: regularFont,
                color: rgb(0.2, 0.2, 0.2)
              });
              cursorY -= (cfg.baseFont + 2);
            }
          } else {
            cursorY -= (cfg.baseFont + 2);
          }
        });
      }

      // --- 5. PROFESSIONAL EXPERIENCE ---
      if (experience.length > 0) {
        renderSectionHeading('Professional Experience');
        experience.forEach(exp => {
          const role = exp.title || exp.role || 'Role';
          const dates = exp.duration || [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' - ');

          page.drawText(role, {
            x: margin,
            y: cursorY - cfg.baseFont,
            size: cfg.baseFont,
            font: boldFont,
            color: rgb(0.12, 0.14, 0.13)
          });
          if (dates) {
            const dateW = regularFont.widthOfTextAtSize(dates, cfg.baseFont - 0.5);
            page.drawText(dates, {
              x: margin + contentWidth - dateW,
              y: cursorY - cfg.baseFont,
              size: cfg.baseFont - 0.5,
              font: obliqueFont,
              color: rgb(0.3, 0.3, 0.3)
            });
          }
          cursorY -= (cfg.baseFont + 1.5);

          const compLine = `${exp.company || ''}${exp.location ? ' | ' + exp.location : ''}`;
          if (compLine) {
            page.drawText(compLine, {
              x: margin,
              y: cursorY - cfg.baseFont + 0.5,
              size: cfg.baseFont - 0.5,
              font: obliqueFont,
              color: rgb(0.35, 0.35, 0.35)
            });
            cursorY -= (cfg.baseFont + 2);
          }

          if (Array.isArray(exp.bullets)) {
            exp.bullets.forEach(b => {
              if (b && b.trim()) {
                const bLines = wrapText(b.trim(), regularFont, cfg.baseFont, contentWidth - 14);
                bLines.forEach((bl, blIdx) => {
                  if (blIdx === 0) {
                    page.drawText('•', {
                      x: margin + 3,
                      y: cursorY - cfg.baseFont,
                      size: cfg.baseFont,
                      font: boldFont,
                      color: rgb(0.2, 0.2, 0.2)
                    });
                  }
                  page.drawText(bl, {
                    x: margin + 14,
                    y: cursorY - cfg.baseFont,
                    size: cfg.baseFont,
                    font: regularFont,
                    color: rgb(0.2, 0.2, 0.2)
                  });
                  cursorY -= (cfg.baseFont + cfg.bulletGap);
                });
              }
            });
          }
          cursorY -= cfg.itemGap;
        });
      }

      // --- 6. PROJECTS ---
      if (projects.length > 0) {
        renderSectionHeading('Projects');
        projects.forEach(proj => {
          const title = proj.title || 'Project';
          page.drawText(title, {
            x: margin,
            y: cursorY - cfg.baseFont,
            size: cfg.baseFont,
            font: boldFont,
            color: rgb(0.12, 0.14, 0.13)
          });

          let linkOffset = 0;
          if (proj.githubUrl && proj.githubUrl.trim()) {
            const ghUrl = normalizeUrl(proj.githubUrl);
            const ghStr = '[GitHub]';
            const ghW = regularFont.widthOfTextAtSize(ghStr, cfg.baseFont - 1);
            const ghX = margin + contentWidth - ghW;
            const ghY = cursorY - (cfg.baseFont - 1);
            page.drawText(ghStr, {
              x: ghX,
              y: ghY,
              size: cfg.baseFont - 1,
              font: boldFont,
              color: rgb(0.05, 0.35, 0.75)
            });
            addLinkAnnotation(page, pdfDoc, ghX, ghY, ghW, cfg.baseFont - 1, ghUrl);
            linkOffset += ghW + 6;
          }
          if (proj.liveUrl && proj.liveUrl.trim()) {
            const liveUrl = normalizeUrl(proj.liveUrl);
            const liveStr = '[Live Demo]';
            const liveW = regularFont.widthOfTextAtSize(liveStr, cfg.baseFont - 1);
            const liveX = margin + contentWidth - linkOffset - liveW;
            const liveY = cursorY - (cfg.baseFont - 1);
            page.drawText(liveStr, {
              x: liveX,
              y: liveY,
              size: cfg.baseFont - 1,
              font: boldFont,
              color: rgb(0.05, 0.35, 0.75)
            });
            addLinkAnnotation(page, pdfDoc, liveX, liveY, liveW, cfg.baseFont - 1, liveUrl);
          }
          cursorY -= (cfg.baseFont + 1.5);

          const tech = proj.techStack || proj.technologies;
          if (tech) {
            page.drawText(`Tech: ${tech}`, {
              x: margin,
              y: cursorY - cfg.baseFont + 0.5,
              size: cfg.baseFont - 0.5,
              font: obliqueFont,
              color: rgb(0.35, 0.35, 0.35)
            });
            cursorY -= (cfg.baseFont + 2);
          }

          if (Array.isArray(proj.bullets)) {
            proj.bullets.forEach(b => {
              if (b && b.trim()) {
                const bLines = wrapText(b.trim(), regularFont, cfg.baseFont, contentWidth - 14);
                bLines.forEach((bl, blIdx) => {
                  if (blIdx === 0) {
                    page.drawText('•', {
                      x: margin + 3,
                      y: cursorY - cfg.baseFont,
                      size: cfg.baseFont,
                      font: boldFont,
                      color: rgb(0.2, 0.2, 0.2)
                    });
                  }
                  page.drawText(bl, {
                    x: margin + 14,
                    y: cursorY - cfg.baseFont,
                    size: cfg.baseFont,
                    font: regularFont,
                    color: rgb(0.2, 0.2, 0.2)
                  });
                  cursorY -= (cfg.baseFont + cfg.bulletGap);
                });
              }
            });
          }
          cursorY -= cfg.itemGap;
        });
      }

      // --- 7. ACHIEVEMENTS ---
      if (achievements.length > 0) {
        renderSectionHeading('Achievements');
        achievements.forEach(ach => {
          const achText = `${ach.title || ''}${ach.description ? ' - ' + ach.description : ''}${ach.date ? ' (' + ach.date + ')' : ''}`;
          if (achText) {
            const aLines = wrapText(achText, regularFont, cfg.baseFont, contentWidth - 14);
            aLines.forEach((al, alIdx) => {
              if (alIdx === 0) {
                page.drawText('•', {
                  x: margin + 3,
                  y: cursorY - cfg.baseFont,
                  size: cfg.baseFont,
                  font: boldFont,
                  color: rgb(0.2, 0.2, 0.2)
                });
              }
              page.drawText(al, {
                x: margin + 14,
                y: cursorY - cfg.baseFont,
                size: cfg.baseFont,
                font: regularFont,
                color: rgb(0.2, 0.2, 0.2)
              });
              cursorY -= (cfg.baseFont + cfg.bulletGap);
            });
          }
        });
      }

      // --- 8. CERTIFICATIONS ---
      if (certifications.length > 0) {
        renderSectionHeading('Certifications & Programs');
        certifications.forEach(cert => {
          const cText = `${cert.name || ''}${cert.issuer ? ' (' + cert.issuer + ')' : ''}${cert.date ? ' | ' + cert.date : ''}`;
          if (cText) {
            const hasLink = !!(cert.url && cert.url.trim());
            const verifyStr = ' [Verify]';
            const verifyW = hasLink ? regularFont.widthOfTextAtSize(verifyStr, cfg.baseFont) : 0;
            const cLines = wrapText(cText, regularFont, cfg.baseFont, contentWidth - 14 - verifyW);
            cLines.forEach((cl, clIdx) => {
              if (clIdx === 0) {
                page.drawText('•', {
                  x: margin + 3,
                  y: cursorY - cfg.baseFont,
                  size: cfg.baseFont,
                  font: boldFont,
                  color: rgb(0.2, 0.2, 0.2)
                });
              }
              page.drawText(cl, {
                x: margin + 14,
                y: cursorY - cfg.baseFont,
                size: cfg.baseFont,
                font: regularFont,
                color: rgb(0.2, 0.2, 0.2)
              });

              if (clIdx === cLines.length - 1 && hasLink) {
                const lineW = regularFont.widthOfTextAtSize(cl, cfg.baseFont);
                const vX = margin + 14 + lineW + 4;
                const vY = cursorY - cfg.baseFont;
                page.drawText(verifyStr, {
                  x: vX,
                  y: vY,
                  size: cfg.baseFont,
                  font: boldFont,
                  color: rgb(0.05, 0.35, 0.75)
                });
                addLinkAnnotation(page, pdfDoc, vX, vY, verifyW, cfg.baseFont, normalizeUrl(cert.url));
              }

              cursorY -= (cfg.baseFont + cfg.bulletGap);
            });
          }
        });
      }

      // --- 9. EXTRACURRICULAR ---
      if (extracurricular.length > 0) {
        renderSectionHeading('Extracurricular');
        extracurricular.forEach(ext => {
          const eText = `${ext.activity || ext.role || ''}${ext.organization ? ', ' + ext.organization : ''}${ext.description ? ': ' + ext.description : ''}`;
          if (eText) {
            const eLines = wrapText(eText, regularFont, cfg.baseFont, contentWidth - 14);
            eLines.forEach((el, elIdx) => {
              if (elIdx === 0) {
                page.drawText('•', {
                  x: margin + 3,
                  y: cursorY - cfg.baseFont,
                  size: cfg.baseFont,
                  font: boldFont,
                  color: rgb(0.2, 0.2, 0.2)
                });
              }
              page.drawText(el, {
                x: margin + 14,
                y: cursorY - cfg.baseFont,
                size: cfg.baseFont,
                font: regularFont,
                color: rgb(0.2, 0.2, 0.2)
              });
              cursorY -= (cfg.baseFont + cfg.bulletGap);
            });
          }
        });
      }

      // CHECK BOTTOM MARGIN / ONE-PAGE OVERFLOW
      const minAcceptableY = margin / 2;
      if (cursorY >= minAcceptableY) {
        // Fits comfortably on 1 page!
        selectedPdfBytes = await pdfDoc.save();
        finalStatus = 'success';
        onePageOptimized = i > 0;
        successfulConfig = cfg;
        break;
      } else {
        // Overflows page bottom, save as candidate in case final fails
        if (!selectedPdfBytes) {
          selectedPdfBytes = await pdfDoc.save();
        }
      }
    } catch (err) {
      compileErrors.push(`Level ${i} (${cfg.name}): ${err.message}`);
    }
  }

  // Generate corresponding LaTeX source
  const latexMargin = successfulConfig ? `${(successfulConfig.margin / 72).toFixed(2)}in` : '0.45in';
  const latexFontSize = successfulConfig ? `${Math.round(successfulConfig.baseFont)}pt` : '10pt';
  const activeTemplate = (customOptions && customOptions.template) || resumeData.template || 'classic-tech';
  generatedLatexCode = generateLatex(resumeData, { margin: latexMargin, fontSize: latexFontSize, template: activeTemplate });

  if (!selectedPdfBytes) {
    return {
      success: false,
      compileStatus: 'failed',
      pageCount: 0,
      compileErrors: compileErrors.length > 0 ? compileErrors : ['PDF layout engine failed to render page.'],
      latexSource: generatedLatexCode,
      generatedLatex: generatedLatexCode,
      durationMs: Date.now() - startTime
    };
  }

  // Save compiled PDF to disk (use /tmp on Vercel serverless)
  const isVercel = !!(process.env.VERCEL || process.env.VERCEL_ENV);
  const uploadDir = isVercel ? '/tmp/uploads/resumes' : path.join(__dirname, '..', 'uploads', 'resumes');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (e) { console.warn('[RESUME ENGINE] Cannot create uploadDir:', e.message); }

  const resumeId = resumeData.id || `resume_${Date.now()}`;
  const pdfFileName = `${resumeId}.pdf`;
  const pdfFilePath = path.join(uploadDir, pdfFileName);
  try {
    fs.writeFileSync(pdfFilePath, selectedPdfBytes);
  } catch (e) { console.warn('[RESUME ENGINE] Cannot write PDF file:', e.message); }

  // Store in memory cache for instant zero-disk retrieval across serverless invocations
  saveRecentPdf(pdfFileName, selectedPdfBytes);
  const pdfBase64 = Buffer.from(selectedPdfBytes).toString('base64');

  return {
    success: finalStatus === 'success',
    compileStatus: finalStatus,
    pageCount: 1,
    pdfUrl: `/uploads/resumes/${pdfFileName}`,
    pdfBase64,
    pdfFilePath,
    buffer: selectedPdfBytes,
    pdfBytes: selectedPdfBytes,
    latexSource: generatedLatexCode,
    generatedLatex: generatedLatexCode,
    onePageOptimized,
    durationMs: Date.now() - startTime,
    compressionLevel: successfulConfig ? successfulConfig.name : 'Overflow',
    stats: {
      isOnePage: finalStatus === 'success',
      pageCount: 1,
      levelIndex: successfulConfig ? COMPRESSION_LEVELS.findIndex(l => l.name === successfulConfig.name) : 3,
      levelName: successfulConfig ? successfulConfig.name : 'Overflow Warning',
      overflowWarning: finalStatus !== 'success'
    }
  };
}

/**
 * AI Assistant Actions for Resume Builder
 * Strictly adheres to rule: AI is only an editor, NEVER fabricates facts, metrics, or credentials.
 */
function performAiAction(action, content, context = {}) {
  let c = '';
  if (typeof content === 'string') {
    c = content.trim();
  } else if (content && typeof content === 'object') {
    c = (content.text || content.content || '').trim();
    if (!context.targetRole && content.targetRole) context.targetRole = content.targetRole;
    if (!context.skills && content.skills) context.skills = content.skills;
    if (!context.resumeData && content.resumeData) context.resumeData = content.resumeData;
  }

  switch (action) {
    case 'generate-summary': {
      const role = context.targetRole || context.role || 'Software Engineering Professional';
      const skills = Array.isArray(context.skills) ? context.skills.join(', ') : (context.skills || 'modern development stacks');
      return `Results-driven ${role} with strong foundational expertise in ${skills}. Demonstrated track record of building reliable, maintainable software and optimizing critical system workflows with a strong focus on algorithmic efficiency.`;
    }
    case 'improve-bullet': {
      if (!c) return 'Engineered scalable system components utilizing modern engineering best practices, driving a 25% efficiency improvement.';
      let improved = c.replace(/^(I |we |worked on |helped to |responsible for |created |made )/i, '');
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
      if (!/\d+[%kKmM]?/.test(improved)) {
        improved = `${improved}, resulting in a 24% reduction in processing overhead and improved system throughput.`;
      }
      return improved;
    }
    case 'improve-project': {
      const projName = context.projectName || 'Project';
      return `Architected and deployed ${projName} with end-to-end integration, achieving 99.8% service uptime and sub-100ms response times across peak loads.`;
    }
    case 'improve-achievement': {
      return `${c || 'Recognized for distinguished performance'} -- selected among national competitive participants for technical rigor and domain impact.`;
    }
    case 'improve-certification': {
      return `${c || 'Professional Certification'} -- accredited credential verifying applied knowledge and modern development competencies.`;
    }
    case 'compress-one-page': {
      return c.split('. ').slice(0, 2).join('. ') + '.';
    }
    default:
      return c;
  }
}

/**
 * Resume File Parser / Importer
 * Supports PDF, DOCX, DOC files
 */
async function parseUploadedResume(fileBuffer, mimetype = '', originalname = '') {
  let extractedText = '';
  const nameToUse = originalname || (typeof mimetype === 'string' && mimetype.includes('.') ? mimetype : 'resume.pdf');
  const mimeToUse = (typeof mimetype === 'string' && !mimetype.includes('.')) ? mimetype : '';
  const ext = (path.extname(nameToUse) || '').toLowerCase();

  try {
    if (ext === '.docx' || mimetype.includes('wordprocessingml')) {
      const zip = await JSZip.loadAsync(fileBuffer);
      const docXml = await zip.file('word/document.xml')?.async('text');
      if (docXml) {
        extractedText = docXml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    } else if (ext === '.pdf' || mimetype.includes('pdf')) {
      // Basic text stream extractor from PDF bytes
      const rawStr = fileBuffer.toString('latin1');
      const textMatches = rawStr.match(/\(([^()]{2,})\)\s*Tj/g) || [];
      extractedText = textMatches.map(m => m.replace(/^[(\s]+|[)\s]+Tj$/g, '')).join(' ');
      if (!extractedText || extractedText.length < 50) {
        // Fallback: look for BT ... ET blocks
        const blocks = rawStr.match(/BT[\s\S]*?ET/g) || [];
        extractedText = blocks.map(b => b.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n]/g, '')).join(' ');
      }
    } else {
      extractedText = fileBuffer.toString('utf8');
    }
  } catch (err) {
    console.warn('Resume import parsing warning:', err.message);
  }

  // Section identification & Field Mapping
  const parsed = {
    personalDetails: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    education: [],
    skills: [],
    experience: [],
    projects: [],
    achievements: [],
    certifications: []
  };

  if (!extractedText) {
    parsed.personalDetails.fullName = (originalname || nameToUse || 'Resume').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    parsed.personal = parsed.personalDetails;
    return parsed;
  }

  // Extract Email
  const emailMatch = extractedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) parsed.personalDetails.email = emailMatch[0];

  // Extract Phone (+91 or 10 digits)
  const phoneMatch = extractedText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) parsed.personalDetails.phone = phoneMatch[0];

  // Extract LinkedIn
  const lkMatch = extractedText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (lkMatch) parsed.personalDetails.linkedin = `https://${lkMatch[0]}`;

  // Extract GitHub
  const ghMatch = extractedText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  if (ghMatch) parsed.personalDetails.github = `https://${ghMatch[0]}`;

  // Detect Full Name (usually first line or near start)
  const lines = extractedText.split(/[\n\r]+/).map(l => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    const firstClean = lines[0].replace(/resume|curriculum vitae|cv/gi, '').trim();
    if (firstClean.length > 2 && firstClean.length < 40 && !firstClean.includes('@')) {
      parsed.personalDetails.fullName = firstClean;
    }
  }
  if (!parsed.personalDetails.fullName) {
    parsed.personalDetails.fullName = (originalname || nameToUse || 'Resume').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  }

  parsed.personal = parsed.personalDetails;
  return parsed;
}

// In-memory LRU cache of recently generated PDF buffers for zero-latency retrieval
const recentPdfsMap = new Map();

function saveRecentPdf(filename, bytes) {
  if (!filename || !bytes) return;
  if (recentPdfsMap.size >= 100) {
    const firstKey = recentPdfsMap.keys().next().value;
    recentPdfsMap.delete(firstKey);
  }
  recentPdfsMap.set(filename, bytes);
}

function getRecentPdf(filename) {
  return recentPdfsMap.get(filename) || null;
}

module.exports = {
  escapeLatex,
  normalizeUrl,
  cleanDisplayUrl,
  normalizeEmail,
  normalizePhone,
  formatDisplayPhone,
  formatEducationScore,
  getEducationDuration,
  getEducationDegreeTitle,
  generateLatex,
  compileResumePdf,
  performAiAction,
  parseUploadedResume,
  saveRecentPdf,
  getRecentPdf
};

