/**
 * ProfessorVirus ATS Resume LaTeX Generator
 * Generates clean, standard Overleaf-compatible ATS-friendly LaTeX code.
 */

// Escapes special characters for LaTeX
export function escapeLatex(text) {
  if (!text) return '';
  return String(text)
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
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
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

// Generates complete, valid, Overleaf-compilable .tex source from resume data
export function generateLatex(resumeData, options = {}) {
  if (!resumeData) return '';

  const p = resumeData.personalDetails || resumeData.personal || {};
  const summary = (resumeData.summary || p.summary || '').trim();

  // Filter sections to include ONLY non-empty user data
  const rawEducation = Array.isArray(resumeData.education) ? resumeData.education : [];
  const education = rawEducation.filter(e => 
    e && (e.degree?.trim() || e.institution?.trim() || e.fieldOfStudy?.trim() || e.location?.trim() || e.cgpaOrPercentage?.trim())
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
  const template = options.template || 'classic-tech';

  let tex = `%----------------------------------------------------------------------------------------
% ProfessorVirus ATS One-Page Resume Template
% Overleaf Standard Compatible (Single-page, text-based, machine readable)
%----------------------------------------------------------------------------------------

\\documentclass[${fontSize},a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=${margin}]{geometry}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{tabularx}
\\usepackage{microtype}

% PDF Metadata & Clickable Hyperlinks Configuration
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    filecolor=black,
    urlcolor=[rgb]{0.05, 0.35, 0.75},
    pdftitle={${escapeLatex(p.fullName || 'Resume')}},
    pdfauthor={${escapeLatex(p.fullName || 'ProfessorVirus Resume')}}
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
    contactItems.push(escapeLatex(p.phone.trim()));
  }
  if (p.email && p.email.trim()) {
    const cleanEmail = p.email.trim();
    contactItems.push(`\\href{${normalizeEmail(cleanEmail)}}{${escapeLatex(cleanEmail)}}`);
  }
  if (p.location && p.location.trim()) {
    contactItems.push(escapeLatex(p.location.trim()));
  }
  const linkedin = p.linkedinUrl || p.linkedin;
  if (linkedin && linkedin.trim()) {
    contactItems.push(`\\href{${normalizeUrl(linkedin)}}{LinkedIn}`);
  }
  const github = p.githubUrl || p.github;
  if (github && github.trim()) {
    contactItems.push(`\\href{${normalizeUrl(github)}}{GitHub}`);
  }
  const portfolio = p.portfolioUrl || p.portfolio;
  if (portfolio && portfolio.trim()) {
    contactItems.push(`\\href{${normalizeUrl(portfolio)}}{Portfolio}`);
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
      const dates = edu.duration || [edu.startYear, edu.endYear].filter(Boolean).join(' -- ');
      const field = edu.fieldOfStudy || edu.field;
      const score = edu.cgpaOrPercentage || edu.cgpa;
      
      const degreeTitle = `${edu.degree || 'Degree'}${field ? ' in ' + field : ''}`;
      tex += `\\noindent\\textbf{${escapeLatex(degreeTitle)}}`;
      if (dates) {
        tex += ` \\hfill ${escapeLatex(dates)}`;
      }
      tex += ` \\\\\n`;

      const subParts = [];
      if (edu.institution) subParts.push(`\\textit{${escapeLatex(edu.institution)}}`);
      if (edu.board) subParts.push(`(${escapeLatex(edu.board)})`);
      if (edu.location) subParts.push(escapeLatex(edu.location));

      if (subParts.length > 0) {
        tex += `${subParts.join(' $|$ ')}`;
      }
      if (score) {
        tex += ` \\hfill \\textbf{Score: ${escapeLatex(score)}}`;
      }
      tex += ` \\\\\n`;

      if (edu.description) {
        tex += `\\small ${escapeLatex(edu.description)} \\\\\n`;
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
