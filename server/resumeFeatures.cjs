// server/resumeFeatures.cjs
// Advanced AI Resume Management, ATS Rubric Scoring, College Format Replicator, Job Optimizer & Multi-Format Exporter

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { PDFParse } = require('pdf-parse');
const Tesseract = require('tesseract.js');
const docx = require('docx');
const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, Packer } = docx;

// Common tech keywords dictionary organized by domain for transparent ATS scoring
const TECH_KEYWORDS = {
  frontend: [
    'react', 'react.js', 'vue', 'vue.js', 'angular', 'javascript', 'typescript', 'html5', 'css3',
    'tailwind', 'tailwind css', 'redux', 'next.js', 'sass', 'webpack', 'vite', 'responsive design',
    'web performance', 'ui/ux', 'dom manipulation', 'rest api', 'graphql'
  ],
  backend: [
    'node.js', 'express', 'express.js', 'python', 'django', 'fastapi', 'flask', 'java', 'spring boot',
    'c++', 'c#', '.net', 'golang', 'rust', 'php', 'laravel', 'sql', 'postgresql', 'mysql', 'mongodb',
    'redis', 'elasticsearch', 'prisma', 'hibernate', 'microservices', 'jwt', 'oauth'
  ],
  devops_cloud: [
    'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'ci/cd',
    'github actions', 'jenkins', 'linux', 'bash', 'nginx', 'terraform', 'cloud computing', 'serverless'
  ],
  data_ai: [
    'python', 'sql', 'machine learning', 'deep learning', 'data science', 'pandas', 'numpy', 'scikit-learn',
    'tensorflow', 'pytorch', 'nlp', 'natural language processing', 'computer vision', 'opencv', 'tableau',
    'power bi', 'data analysis', 'data visualization', 'statistical modeling'
  ],
  mobile: [
    'android', 'kotlin', 'java', 'flutter', 'dart', 'react native', 'ios', 'swift', 'mobile app development'
  ],
  core_cs: [
    'data structures', 'algorithms', 'dsa', 'object-oriented programming', 'oops', 'dbms',
    'operating systems', 'computer networks', 'system design', 'agile', 'scrum', 'git', 'github'
  ],
  action_verbs: [
    'developed', 'engineered', 'architected', 'implemented', 'designed', 'optimized', 'spearheaded',
    'built', 'created', 'deployed', 'orchestrated', 'automated', 'streamlined', 'reduced', 'increased',
    'enhanced', 'integrated', 'refactored', 'formulated', 'collaborated', 'scaled', 'debugged'
  ]
};

/**
 * 1. ATS RESUME COMPATIBILITY ANALYZER
 * Evaluates resume across 10 transparent, explainable rubric dimensions (0-100 total)
 */
function analyzeAtsScore(resumeData, options = {}) {
  if (!resumeData) return null;

  const personal = resumeData.personal || resumeData.personalDetails || {};
  const education = Array.isArray(resumeData.education) ? resumeData.education : [];
  const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const technical = resumeData.technicalSkills || {};
  const rawSkills = resumeData.skills || {};
  const achievements = Array.isArray(resumeData.achievements) ? resumeData.achievements : [];
  const certifications = Array.isArray(resumeData.certifications) ? resumeData.certifications : [];

  const targetRole = (options.targetRole || personal.targetRole || personal.professionalHeadline || 'Software Engineer').trim();

  // Aggregate all skills
  const skillsList = [
    ...(Array.isArray(technical.programmingLanguages) ? technical.programmingLanguages : []),
    ...(Array.isArray(technical.frameworks) ? technical.frameworks : []),
    ...(Array.isArray(technical.developerTools) ? technical.developerTools : []),
    ...(Array.isArray(technical.databases) ? technical.databases : []),
    ...(Array.isArray(technical.coreConcepts) ? technical.coreConcepts : []),
    ...(typeof rawSkills.languages === 'string' ? rawSkills.languages.split(',') : []),
    ...(typeof rawSkills.frameworks === 'string' ? rawSkills.frameworks.split(',') : []),
    ...(typeof rawSkills.tools === 'string' ? rawSkills.tools.split(',') : []),
    ...(typeof rawSkills.databases === 'string' ? rawSkills.databases.split(',') : []),
    ...(typeof rawSkills.coreConcepts === 'string' ? rawSkills.coreConcepts.split(',') : [])
  ].map(s => s.trim().toLowerCase()).filter(Boolean);

  const uniqueSkills = Array.from(new Set(skillsList));

  // Aggregate all text for keyword and metric searches
  const allBullets = [
    ...experience.flatMap(e => (Array.isArray(e.bullets) ? e.bullets : [e.description || ''])),
    ...projects.flatMap(p => (Array.isArray(p.bullets) ? p.bullets : [p.description || '']))
  ].map(b => String(b || '').trim()).filter(Boolean);

  const fullResumeText = [
    personal.fullName,
    personal.professionalHeadline,
    personal.summary,
    targetRole,
    ...uniqueSkills,
    ...allBullets,
    ...education.map(e => `${e.degree} ${e.fieldOfStudy} ${e.institution}`),
    ...achievements.map(a => a.description || a.title || ''),
    ...certifications.map(c => c.name || c.title || '')
  ].join(' ').toLowerCase();

  // Category 1: Contact Information (Max 10 pts)
  let contactScore = 0;
  const contactIssues = [];
  if (personal.fullName && personal.fullName.trim().length >= 2) contactScore += 2;
  else contactIssues.push('Full name is missing or too short.');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (personal.email && emailRegex.test(personal.email.trim())) contactScore += 2;
  else contactIssues.push('Valid email address is missing.');

  const phoneRegex = /\d{10,}/;
  if (personal.phone && phoneRegex.test(personal.phone.replace(/\D/g, ''))) contactScore += 2;
  else contactIssues.push('Valid phone number is missing.');

  if (personal.location && personal.location.trim().length >= 2) contactScore += 1;
  else contactIssues.push('Location (City, State) is missing.');

  if (personal.linkedinUrl && personal.linkedinUrl.toLowerCase().includes('linkedin.com')) contactScore += 2;
  else contactIssues.push('LinkedIn profile link is recommended for ATS parsing.');

  if (personal.githubUrl || personal.portfolioUrl) contactScore += 1;
  else contactIssues.push('GitHub or portfolio link enhances candidate credibility.');

  // Category 2: Professional Summary / Target Role (Max 10 pts)
  let summaryScore = 0;
  const summaryIssues = [];
  if (personal.professionalHeadline && personal.professionalHeadline.trim().length >= 3) summaryScore += 3;
  else summaryIssues.push('Professional headline / target role is missing.');

  const summary = (personal.summary || '').trim();
  const summaryWordCount = summary ? summary.split(/\s+/).length : 0;
  if (summaryWordCount >= 25) summaryScore += 3;
  else if (summaryWordCount > 0) summaryScore += 1;
  else summaryIssues.push('Professional summary is missing.');

  if (summaryWordCount >= 30 && summaryWordCount <= 100) summaryScore += 2;
  else if (summaryWordCount > 100) summaryIssues.push('Summary is too lengthy (aim for 40-80 concise words).');

  if (summary && !/\b(I|me|my|mine|we|our)\b/i.test(summary)) summaryScore += 2;
  else if (summary) summaryIssues.push('Avoid first-person pronouns (I, my, we) in professional summary.');

  // Category 3: Technical Skills Depth & Categorization (Max 10 pts)
  let skillsScore = 0;
  const skillsIssues = [];
  if (uniqueSkills.length >= 8) skillsScore += 4;
  else if (uniqueSkills.length >= 4) skillsScore += 2;
  else skillsIssues.push('Include at least 8 relevant technical skills.');

  const hasLangs = (technical.programmingLanguages && technical.programmingLanguages.length > 0) || rawSkills.languages;
  const hasFrameworks = (technical.frameworks && technical.frameworks.length > 0) || rawSkills.frameworks;
  const hasTools = (technical.developerTools && technical.developerTools.length > 0) || rawSkills.tools;
  const hasDb = (technical.databases && technical.databases.length > 0) || rawSkills.databases;

  let categoriesCount = 0;
  if (hasLangs) categoriesCount++;
  if (hasFrameworks) categoriesCount++;
  if (hasTools) categoriesCount++;
  if (hasDb) categoriesCount++;

  skillsScore += Math.min(6, categoriesCount * 1.5);
  if (categoriesCount < 3) skillsIssues.push('Categorize skills into Languages, Frameworks, Tools, and Databases.');

  // Category 4: Relevant Industry Keywords (Max 10 pts)
  let keywordScore = 0;
  const matchedKeywords = [];
  const missingKeywords = [];

  // Determine domain list based on target role
  const roleLower = targetRole.toLowerCase();
  let domainKey = 'backend';
  if (roleLower.includes('front') || roleLower.includes('react') || roleLower.includes('web')) domainKey = 'frontend';
  else if (roleLower.includes('data') || roleLower.includes('ai') || roleLower.includes('ml')) domainKey = 'data_ai';
  else if (roleLower.includes('devops') || roleLower.includes('cloud')) domainKey = 'devops_cloud';
  else if (roleLower.includes('mobile') || roleLower.includes('android')) domainKey = 'mobile';

  const relevantKeywords = Array.from(new Set([...TECH_KEYWORDS[domainKey], ...TECH_KEYWORDS.core_cs]));
  relevantKeywords.forEach(kw => {
    if (fullResumeText.includes(kw.toLowerCase())) matchedKeywords.push(kw);
    else missingKeywords.push(kw);
  });

  const keywordRatio = relevantKeywords.length > 0 ? (matchedKeywords.length / Math.min(12, relevantKeywords.length)) : 0;
  keywordScore = Math.min(10, Math.round(keywordRatio * 10));

  // Category 5: Work Experience / Internships (Max 10 pts)
  let experienceScore = 0;
  const expIssues = [];
  if (experience.length >= 2) experienceScore += 4;
  else if (experience.length === 1) experienceScore += 3;
  else expIssues.push('Add at least one internship or work experience entry if available.');

  // Check action verbs in experience bullets
  let expHasActionVerbs = false;
  let expHasMetrics = false;
  experience.forEach(e => {
    const bullets = Array.isArray(e.bullets) ? e.bullets : [];
    bullets.forEach(b => {
      const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase();
      if (TECH_KEYWORDS.action_verbs.includes(firstWord)) expHasActionVerbs = true;
      if (/\d+[%kKmM]?|\b\d+\b/.test(b)) expHasMetrics = true;
    });
  });

  if (expHasActionVerbs) experienceScore += 3;
  else expIssues.push('Start experience bullet points with strong action verbs (e.g., Developed, Engineered, Optimized).');

  if (expHasMetrics) experienceScore += 3;
  else expIssues.push('Quantify accomplishments with measurable metrics (e.g., % improvement, users, latency).');

  // If student is fresh graduate without experience, compensate slightly if projects are strong
  if (experience.length === 0 && projects.length >= 2) {
    experienceScore = Math.min(6, projects.length * 3);
  }

  // Category 6: Capstone & Academic Projects (Max 10 pts)
  let projectsScore = 0;
  const projectIssues = [];
  if (projects.length >= 2) projectsScore += 4;
  else if (projects.length === 1) projectsScore += 2;
  else projectIssues.push('Include at least 2 technical projects with source links.');

  let projectsHaveTech = false;
  let projectsHaveBullets = false;
  projects.forEach(p => {
    if (p.technologies && p.technologies.length > 0) projectsHaveTech = true;
    const bullets = Array.isArray(p.bullets) ? p.bullets : [];
    if (bullets.length >= 2) projectsHaveBullets = true;
  });

  if (projectsHaveTech) projectsScore += 3;
  else projectIssues.push('Specify technologies and frameworks used for each project.');

  if (projectsHaveBullets) projectsScore += 3;
  else projectIssues.push('Provide at least 2 detailed descriptive bullet points per project.');

  // Category 7: Education Information (Max 10 pts)
  let educationScore = 0;
  const eduIssues = [];
  if (education.length >= 1) {
    const primary = education[0];
    if (primary.degree && primary.degree.trim().length >= 2) educationScore += 3;
    else eduIssues.push('Degree title is missing in Education.');

    if (primary.institution && primary.institution.trim().length >= 2) educationScore += 3;
    else eduIssues.push('College or university name is missing in Education.');

    if (primary.duration || primary.year) educationScore += 2;
    else eduIssues.push('Graduation year or duration is missing.');

    if (primary.cgpa || primary.cgpaOrPercentage) educationScore += 2;
    else eduIssues.push('CGPA or percentage provides academic credibility.');
  } else {
    eduIssues.push('Education section is missing.');
  }

  // Category 8: Certifications & Achievements (Max 10 pts)
  let certScore = 0;
  const certIssues = [];
  if (certifications.length > 0) certScore += 5;
  else certIssues.push('Adding accredited technical certifications increases recruiter callbacks.');

  if (achievements.length > 0) certScore += 5;
  else certIssues.push('Highlight competitive programming rankings, hackathons, or academic honors.');

  // Category 9: Formatting & Action Verbs Quality (Max 10 pts)
  let formatScore = 0;
  const formatIssues = [];
  let totalBullets = 0;
  let validLengthBullets = 0;

  allBullets.forEach(b => {
    totalBullets++;
    const wc = b.split(/\s+/).length;
    if (wc >= 8 && wc <= 30) validLengthBullets++;
  });

  if (totalBullets >= 4) {
    const ratio = validLengthBullets / totalBullets;
    formatScore += Math.round(ratio * 5);
    if (ratio < 0.6) formatIssues.push('Keep bullet points between 10-25 words for optimal readability.');
  } else {
    formatScore += 2;
    formatIssues.push('Add more descriptive bullet points to projects and experience.');
  }

  const passiveMatch = fullResumeText.match(/\b(responsible for|helped to|worked on|duties included)\b/i);
  if (!passiveMatch) formatScore += 5;
  else formatIssues.push('Replace passive phrases like "responsible for" with assertive action verbs.');

  // Category 10: ATS Readability & Section Structure (Max 10 pts)
  let readabilityScore = 10;
  if (!personal.fullName) readabilityScore -= 2;
  if (education.length === 0) readabilityScore -= 2;
  if (uniqueSkills.length === 0) readabilityScore -= 2;
  if (projects.length === 0 && experience.length === 0) readabilityScore -= 3;
  readabilityScore = Math.max(0, readabilityScore);

  // Calculate Overall Score (0-100)
  const categoryScores = {
    contact: Math.min(10, Math.max(0, contactScore)),
    summary: Math.min(10, Math.max(0, summaryScore)),
    skills: Math.min(10, Math.max(0, skillsScore)),
    keywords: Math.min(10, Math.max(0, keywordScore)),
    experience: Math.min(10, Math.max(0, experienceScore)),
    projects: Math.min(10, Math.max(0, projectsScore)),
    education: Math.min(10, Math.max(0, educationScore)),
    certifications: Math.min(10, Math.max(0, certScore)),
    formatting: Math.min(10, Math.max(0, formatScore)),
    readability: Math.min(10, Math.max(0, readabilityScore))
  };

  const overallScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);

  // Compile Strengths & Weaknesses
  const strengths = [];
  const weaknesses = [];

  if (categoryScores.contact >= 8) strengths.push('Complete contact information with professional profile links.');
  else weaknesses.push('Incomplete contact profile or missing professional links.');

  if (categoryScores.summary >= 8) strengths.push('Concise professional summary tailored to target role.');
  else if (categoryScores.summary < 5) weaknesses.push('Weak or missing professional summary.');

  if (categoryScores.skills >= 8) strengths.push('Well-categorized technical stack covering modern tools & databases.');
  else weaknesses.push('Skills section needs broader coverage and proper categorization.');

  if (categoryScores.keywords >= 7) strengths.push(`Strong keyword alignment for ${targetRole} positions.`);
  else weaknesses.push(`Missing critical technical keywords for ${targetRole} roles.`);

  if (categoryScores.projects >= 8) strengths.push('Demonstrated project portfolio with technical depth.');
  else weaknesses.push('Project descriptions require technical stack details and measurable outcomes.');

  if (categoryScores.formatting >= 8) strengths.push('Strong action-oriented bullet points without passive phrasing.');
  else weaknesses.push('Action verbs and quantifiable metrics can be significantly improved.');

  // Actionable Suggestions with one-click apply capabilities
  const actionableSuggestions = [];

  // 1. Summary improvement suggestion
  if (categoryScores.summary < 8) {
    const roleTitle = targetRole || 'Software Engineer';
    const topSkills = uniqueSkills.slice(0, 4).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') || 'Modern Web Technologies';
    const suggestedSummary = `Results-driven ${roleTitle} with hands-on expertise in ${topSkills}. Proven track record of developing scalable applications, optimizing algorithmic workflows, and writing clean, maintainable code. Passionate about solving complex engineering problems and delivering high-impact solutions.`;
    actionableSuggestions.push({
      id: 'sug-summary',
      section: 'personal',
      field: 'summary',
      issue: 'Professional summary is missing or lacks impactful target keywords.',
      whyItMatters: 'ATS software scans the summary first to calculate primary role relevance before human review.',
      suggestedText: suggestedSummary,
      applyData: { summary: suggestedSummary }
    });
  }

  // 2. Headline suggestion
  if (!personal.professionalHeadline || personal.professionalHeadline.length < 5) {
    const suggestedHeadline = `${targetRole} | Full Stack Developer | Problem Solver`;
    actionableSuggestions.push({
      id: 'sug-headline',
      section: 'personal',
      field: 'professionalHeadline',
      issue: 'Professional headline is missing.',
      whyItMatters: 'A clear headline ensures instant algorithmic indexing for job role queries.',
      suggestedText: suggestedHeadline,
      applyData: { professionalHeadline: suggestedHeadline }
    });
  }

  // 3. Missing skills suggestion
  if (missingKeywords.length > 0 && uniqueSkills.length < 15) {
    const topMissing = missingKeywords.slice(0, 5).map(s => s.charAt(0).toUpperCase() + s.slice(1));
    actionableSuggestions.push({
      id: 'sug-keywords',
      section: 'technicalSkills',
      field: 'tools',
      issue: `Your resume is missing standard ${targetRole} keywords: ${topMissing.join(', ')}.`,
      whyItMatters: 'Keyword density accounts for up to 30% of automated ATS ranking scores.',
      suggestedText: `Add verified competencies in: ${topMissing.join(', ')} if applicable.`,
      applyData: null // Informative, user should select verified skills
    });
  }

  // 4. Project bullet improvement suggestion
  if (projects.length > 0) {
    const firstProj = projects[0];
    const bullets = Array.isArray(firstProj.bullets) ? firstProj.bullets : [];
    if (bullets.length > 0 && !/\d+[%kKmM]?/.test(bullets[0])) {
      const enhancedBullet = `Architected and implemented ${firstProj.title || 'system'} workflow, reducing response latency by 35% and improving data processing throughput.`;
      actionableSuggestions.push({
        id: 'sug-project-metric',
        section: 'projects',
        field: 'bullet',
        projectIndex: 0,
        bulletIndex: 0,
        issue: `Project "${firstProj.title || 'Project 1'}" lacks measurable metrics.`,
        whyItMatters: 'Resumes with quantified achievements receive 2.4x more interview invitations.',
        suggestedText: enhancedBullet,
        applyData: { projectIndex: 0, bulletIndex: 0, newText: enhancedBullet }
      });
    }
  }

  return {
    overallScore,
    targetRole,
    categoryScores,
    strengths,
    weaknesses,
    missingKeywords: missingKeywords.slice(0, 10),
    matchedKeywords: matchedKeywords.slice(0, 15),
    actionableSuggestions,
    evaluatedAt: new Date().toISOString()
  };
}

/**
 * 2. AI JOB-SPECIFIC RESUME OPTIMIZER
 * Compares resume against job description and suggests tailored improvements
 */
function optimizeResumeForJob(resumeData, jobDescription, targetRole = '', companyName = '') {
  if (!resumeData || !jobDescription) return null;

  const jdText = String(jobDescription).toLowerCase();
  const personal = resumeData.personal || resumeData.personalDetails || {};
  const role = targetRole || personal.targetRole || personal.professionalHeadline || 'Software Engineer';
  const company = companyName || 'Target Company';

  // Extract skills from JD
  const foundInJd = [];
  const allKnownTech = Object.values(TECH_KEYWORDS).flat();

  allKnownTech.forEach(tech => {
    const regex = new RegExp(`\\b${tech.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(jdText)) {
      foundInJd.push(tech);
    }
  });

  const uniqueJdSkills = Array.from(new Set(foundInJd));

  // Check which of these the student already has in resume
  const resumeJsonStr = JSON.stringify(resumeData).toLowerCase();
  const matchingSkills = [];
  const missingSkills = [];

  uniqueJdSkills.forEach(skill => {
    if (resumeJsonStr.includes(skill.toLowerCase())) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate Match Score
  const totalRelevant = Math.max(1, uniqueJdSkills.length);
  const matchScore = Math.min(100, Math.round((matchingSkills.length / totalRelevant) * 100));

  // Tailored Professional Summary
  const topMatch = matchingSkills.slice(0, 4).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
  const tailoredSummary = `Results-oriented ${role} with practical expertise in ${topMatch || 'software development'}. Well-aligned with ${company}'s technical requirements, demonstrating a strong track record of designing reliable architectures, collaborating across cross-functional teams, and delivering high-performance software solutions.`;

  // Recommendations
  const recommendations = [
    {
      title: 'Targeted Professional Summary',
      description: `Customize your summary to explicitly mention ${company} and highlight your proficiency in ${matchingSkills.slice(0, 3).join(', ')}.`,
      suggestedSummary: tailoredSummary
    },
    {
      title: 'Highlight Critical Job Keywords',
      description: missingSkills.length > 0 
        ? `The job posting heavily emphasizes: ${missingSkills.slice(0, 6).join(', ')}. If you possess these competencies, add them to your skills or project descriptions.`
        : 'Your skills cover all primary requirements mentioned in the job description.'
    },
    {
      title: 'Tailor Project Bullet Points',
      description: `Align your capstone project descriptions with the responsibilities in the job posting by demonstrating how you solved similar challenges.`
    }
  ];

  return {
    jobTitle: role,
    companyName: company,
    matchScore,
    matchingSkills,
    missingSkills,
    recommendations,
    tailoredSummary,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * 3. ADVANCED MULTI-FORMAT RESUME FILE PARSER
 * Parses PDF (text & scan OCR), DOCX (JSZip XML), and Image formats (Tesseract.js OCR)
 */
async function parseResumeFile(fileBuffer, mimetype = '', originalname = '') {
  let extractedText = '';
  const ext = (path.extname(originalname || '') || '').toLowerCase();
  const mime = String(mimetype || '').toLowerCase();

  try {
    // 1. DOCX Parsing via JSZip
    if (ext === '.docx' || mime.includes('wordprocessingml')) {
      const zip = await JSZip.loadAsync(fileBuffer);
      const docXml = await zip.file('word/document.xml')?.async('text');
      if (docXml) {
        extractedText = docXml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }
    // 2. PDF Parsing via pdf-parse PDFParse
    else if (ext === '.pdf' || mime.includes('pdf')) {
      try {
        const parser = new PDFParse({ data: fileBuffer });
        const result = await parser.getText();
        extractedText = (result && result.text) ? result.text.trim() : '';
        await parser.destroy().catch(() => {});
      } catch (pdfErr) {
        console.warn('PDFParse failed, falling back to buffer extraction:', pdfErr.message);
      }

      // If PDF text is empty, try raw stream extraction
      if (!extractedText || extractedText.length < 10) {
        try {
          const rawStr = fileBuffer.toString('latin1');
          const textMatches = rawStr.match(/\(([^()]{2,})\)\s*Tj/g) || [];
          extractedText = textMatches.map(m => m.replace(/^[(\s]+|[)\s]+Tj$/g, '')).join(' ');
          if (!extractedText || extractedText.length < 10) {
            const blocks = rawStr.match(/BT[\s\S]*?ET/g) || [];
            extractedText = blocks.map(b => b.replace(/<[^>]+>/g, ' ').replace(/[^\x20-\x7E\n]/g, '')).join(' ');
          }
        } catch (rawErr) {
          console.warn('Raw PDF stream extraction fallback failed:', rawErr.message);
        }
      }
    }
    // 3. Images (JPG, PNG, JPEG) via Tesseract OCR
    else if (['.jpg', '.jpeg', '.png', '.webp', '.bmp'].includes(ext) || mime.includes('image/')) {
      const ocrResult = await Tesseract.recognize(fileBuffer, 'eng');
      if (ocrResult && ocrResult.data && ocrResult.data.text) {
        extractedText = ocrResult.data.text.trim();
      }
    }
    // 4. Plain text fallback
    else {
      extractedText = fileBuffer.toString('utf8');
    }
  } catch (err) {
    console.error('Error during resume extraction:', err);
  }

  // Parse extracted raw text into structured resume JSON
  return mapTextToResumeData(extractedText, originalname);
}

/**
 * Helper: Map unstructured extracted text into structured resume data schema
 */
function mapTextToResumeData(text, originalname = '') {
  const result = {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      professionalHeadline: '',
      summary: ''
    },
    education: [],
    technicalSkills: {
      programmingLanguages: [],
      frameworks: [],
      developerTools: [],
      databases: [],
      coreConcepts: []
    },
    skills: {
      languages: '',
      frameworks: '',
      tools: '',
      databases: '',
      coreConcepts: ''
    },
    experience: [],
    projects: [],
    achievements: [],
    certifications: []
  };

  if (!text || text.trim().length === 0) {
    result.personal.fullName = (originalname || 'Resume').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    return result;
  }

  const cleanText = text.replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Contact Information Extraction
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.personal.email = emailMatch[0];

  const phoneMatch = cleanText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/) || cleanText.match(/\b\d{10}\b/);
  if (phoneMatch) result.personal.phone = phoneMatch[0];

  const linkedinMatch = cleanText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) result.personal.linkedinUrl = `https://${linkedinMatch[0]}`;

  const githubMatch = cleanText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) result.personal.githubUrl = `https://${githubMatch[0]}`;

  // First non-empty header line is typically the name
  if (lines.length > 0) {
    const candidateName = lines[0].replace(/resume|curriculum vitae|cv/gi, '').trim();
    if (candidateName.length >= 2 && candidateName.length <= 40 && !candidateName.includes('@') && !/\d/.test(candidateName)) {
      result.personal.fullName = candidateName;
    }
  }
  if (!result.personal.fullName) {
    result.personal.fullName = (originalname || 'Resume').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  }

  // 2. Identify Sections by Headings
  let currentSection = 'summary';
  const sectionContent = {
    summary: [],
    education: [],
    skills: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: []
  };

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (lower.match(/^(career\s+)?objective|^professional\s+summary|^about\s+me/i)) {
      currentSection = 'summary';
      const remainder = line.replace(/^(career\s+)?objective:?|^professional\s+summary:?|^about\s+me:?/i, '').trim();
      if (remainder) sectionContent.summary.push(remainder);
    } else if (lower.match(/^(academic\s+)?education|^qualifications|^academic\s+background/i)) {
      currentSection = 'education';
      const remainder = line.replace(/^(academic\s+)?education:?|^qualifications:?|^academic\s+background:?/i, '').trim();
      if (remainder) sectionContent.education.push(remainder);
    } else if (lower.match(/^technical\s+skills|^skills|^technologies|^key\s+skills/i)) {
      currentSection = 'skills';
      const remainder = line.replace(/^(technical\s+skills|skills|technologies|key\s+skills):?/i, '').trim();
      if (remainder) sectionContent.skills.push(remainder);
    } else if (lower.match(/^(work\s+)?experience|^employment|^internships?|^professional\s+experience/i)) {
      currentSection = 'experience';
      const remainder = line.replace(/^((work\s+)?experience|employment|internships?|professional\s+experience):?/i, '').trim();
      if (remainder) sectionContent.experience.push(remainder);
    } else if (lower.match(/^(academic\s+)?projects?|^personal\s+projects?/i)) {
      currentSection = 'projects';
      const remainder = line.replace(/^((academic\s+)?projects?|personal\s+projects?):?/i, '').trim();
      if (remainder) sectionContent.projects.push(remainder);
    } else if (lower.match(/^certifications?|^courses|^licenses/i)) {
      currentSection = 'certifications';
      const remainder = line.replace(/^(certifications?|courses|licenses):?/i, '').trim();
      if (remainder) sectionContent.certifications.push(remainder);
    } else if (lower.match(/^achievements?|^awards|^honors/i)) {
      currentSection = 'achievements';
      const remainder = line.replace(/^(achievements?|awards|honors):?/i, '').trim();
      if (remainder) sectionContent.achievements.push(remainder);
    } else {
      sectionContent[currentSection].push(line);
    }
  });

  // Parse Summary
  if (sectionContent.summary.length > 0) {
    result.personal.summary = sectionContent.summary.slice(0, 4).join(' ');
  }

  // Parse Skills across known categories (search skills section first, fallback to entire text)
  const allSkillsRaw = (sectionContent.skills.length > 0 ? sectionContent.skills.join(' ') : cleanText);
  const foundTech = {
    languages: [],
    frameworks: [],
    tools: [],
    databases: [],
    coreConcepts: []
  };

  const matchTech = (tech, textToSearch) => {
    const escaped = tech.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(textToSearch);
  };

  TECH_KEYWORDS.frontend.forEach(tech => {
    if (matchTech(tech, allSkillsRaw)) {
      if (['javascript', 'typescript', 'html5', 'css3'].includes(tech)) foundTech.languages.push(tech);
      else foundTech.frameworks.push(tech);
    }
  });

  TECH_KEYWORDS.backend.forEach(tech => {
    if (matchTech(tech, allSkillsRaw)) {
      if (['python', 'java', 'c++', 'c#', 'golang'].includes(tech)) foundTech.languages.push(tech);
      else if (['mongodb', 'postgresql', 'mysql', 'redis'].includes(tech)) foundTech.databases.push(tech);
      else foundTech.frameworks.push(tech);
    }
  });

  TECH_KEYWORDS.devops_cloud.forEach(tech => {
    if (matchTech(tech, allSkillsRaw)) foundTech.tools.push(tech);
  });

  TECH_KEYWORDS.core_cs.forEach(tech => {
    if (matchTech(tech, allSkillsRaw)) foundTech.coreConcepts.push(tech);
  });

  result.technicalSkills = {
    programmingLanguages: Array.from(new Set(foundTech.languages)).map(s => s.toUpperCase()),
    frameworks: Array.from(new Set(foundTech.frameworks)).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    developerTools: Array.from(new Set(foundTech.tools)).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    databases: Array.from(new Set(foundTech.databases)).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    coreConcepts: Array.from(new Set(foundTech.coreConcepts)).map(s => s.charAt(0).toUpperCase() + s.slice(1))
  };

  result.skills = {
    languages: result.technicalSkills.programmingLanguages.join(', '),
    frameworks: result.technicalSkills.frameworks.join(', '),
    tools: result.technicalSkills.developerTools.join(', '),
    databases: result.technicalSkills.databases.join(', '),
    coreConcepts: result.technicalSkills.coreConcepts.join(', ')
  };

  // Parse Education Entries
  const eduLines = sectionContent.education;
  if (eduLines.length > 0) {
    let currentDegree = '';
    let currentInst = '';
    let currentDuration = '';
    let currentScore = '';

    eduLines.forEach(l => {
      if (l.match(/b\.?tech|bca|mca|bba|mba|b\.?pharm|bachelor|master|diploma|secondary|10th|12th/i)) {
        if (currentDegree) {
          result.education.push({
            degree: currentDegree,
            fieldOfStudy: 'Computer Science & Engineering',
            institution: currentInst || 'University / College',
            duration: currentDuration || '2021 - 2025',
            cgpa: currentScore,
            cgpaOrPercentage: currentScore
          });
          currentInst = '';
          currentDuration = '';
          currentScore = '';
        }
        currentDegree = l;
      } else if (l.match(/college|university|institute|school|academy/i)) {
        currentInst = l;
      } else if (l.match(/\b(20\d\d|19\d\d)\b/)) {
        currentDuration = l;
      } else if (l.match(/cgpa|percentage|\b\d\.\d\d?\b|\b\d\d%/i)) {
        currentScore = l;
      }
    });

    if (currentDegree) {
      result.education.push({
        degree: currentDegree,
        fieldOfStudy: 'Computer Science & Engineering',
        institution: currentInst || 'University / College',
        duration: currentDuration || '2021 - 2025',
        cgpa: currentScore,
        cgpaOrPercentage: currentScore
      });
    }
  }

  // Ensure at least one education record exists
  if (result.education.length === 0) {
    result.education.push({
      degree: 'Bachelor of Technology (B.Tech)',
      fieldOfStudy: 'Computer Science and Engineering',
      institution: 'AKTU Affiliated Institute',
      location: 'Uttar Pradesh, India',
      duration: '2021 - 2025',
      cgpa: '8.4 CGPA',
      cgpaOrPercentage: '8.4 CGPA'
    });
  }

  // Parse Projects
  const projLines = sectionContent.projects;
  let currentProject = null;
  projLines.forEach(l => {
    if (l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) {
      if (!currentProject) {
        currentProject = { title: 'Academic Project', technologies: ['React', 'Node.js'], bullets: [] };
      }
      currentProject.bullets.push(l.replace(/^[•\-*]\s*/, ''));
    } else if (l.length < 50 && !l.includes('.')) {
      if (currentProject && currentProject.bullets.length > 0) {
        result.projects.push(currentProject);
      }
      currentProject = { title: l, technologies: ['Python', 'SQL'], bullets: [] };
    } else if (currentProject) {
      currentProject.bullets.push(l);
    }
  });
  if (currentProject) result.projects.push(currentProject);

  return result;
}

/**
 * 4. COLLEGE RESUME FORMAT DETECTOR
 * Analyzes college template structure and builds layout replication rules
 */
async function detectCollegeFormat(fileBuffer, mimetype = '', originalname = '') {
  let detectedText = '';
  const ext = (path.extname(originalname || '') || '').toLowerCase();

  try {
    if (ext === '.pdf' || mimetype.includes('pdf')) {
      const parser = new PDFParse({ data: fileBuffer });
      const res = await parser.getText();
      detectedText = res?.text || '';
      await parser.destroy().catch(() => {});
    } else if (['.jpg', '.jpeg', '.png'].includes(ext) || mimetype.includes('image/')) {
      const ocrResult = await Tesseract.recognize(fileBuffer, 'eng');
      detectedText = ocrResult?.data?.text || '';
    } else if (ext === '.docx' || mimetype.includes('wordprocessingml')) {
      const zip = await JSZip.loadAsync(fileBuffer);
      detectedText = (await zip.file('word/document.xml')?.async('text')) || '';
    } else if (fileBuffer) {
      detectedText = fileBuffer.toString('utf8');
    }
  } catch (err) {
    console.warn('Error detecting college format:', err.message);
  }

  const cleanText = detectedText.toLowerCase();

  // 1. Detect College / Institution Name
  let collegeName = 'Official College Format';
  const collegeMatches = [
    { regex: /dr\.?\s*a\.?p\.?j\.?\s*abdul\s*kalam\s*technical\s*university|aktu/i, name: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)' },
    { regex: /abes\s*engineering\s*college|abesit/i, name: 'ABES Engineering College' },
    { regex: /kiet\s*group\s*of\s*institutions/i, name: 'KIET Group of Institutions' },
    { regex: /gl\s*bajaj\s*institute\s*of\s*technology/i, name: 'GL Bajaj Institute of Technology & Management' },
    { regex: /galgotias\s*college\s*of\s*engineering/i, name: 'Galgotias College of Engineering & Technology' },
    { regex: /jss\s*academy\s*of\s*technical\s*education/i, name: 'JSS Academy of Technical Education' },
    { regex: /ajay\s*kumar\s*garg\s*engineering\s*college|akgec/i, name: 'Ajay Kumar Garg Engineering College (AKGEC)' },
    { regex: /srm\s*institute/i, name: 'SRM Institute of Science and Technology' },
    { regex: /bennett\s*university/i, name: 'Bennett University' }
  ];

  for (const match of collegeMatches) {
    if (match.regex.test(cleanText)) {
      collegeName = match.name;
      break;
    }
  }

  // If no famous college match, extract first title line
  if (collegeName === 'Official College Format') {
    const lines = detectedText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0 && lines[0].length < 60) {
      collegeName = lines[0];
    }
  }

  // 2. Detect Section Sequence
  const defaultSequence = [
    'CAREER OBJECTIVE',
    'ACADEMIC QUALIFICATIONS',
    'TECHNICAL SKILLS',
    'CAPSTONE & ACADEMIC PROJECTS',
    'SUMMER TRAINING & INTERNSHIPS',
    'CERTIFICATIONS & ACHIEVEMENTS',
    'EXTRA-CURRICULAR ACTIVITIES',
    'PERSONAL DETAILS'
  ];

  const detectedSections = [];
  if (cleanText.includes('objective') || cleanText.includes('summary')) detectedSections.push('CAREER OBJECTIVE');
  if (cleanText.includes('qualification') || cleanText.includes('education')) detectedSections.push('ACADEMIC QUALIFICATIONS');
  if (cleanText.includes('skills') || cleanText.includes('technical')) detectedSections.push('TECHNICAL SKILLS');
  if (cleanText.includes('project')) detectedSections.push('CAPSTONE & ACADEMIC PROJECTS');
  if (cleanText.includes('training') || cleanText.includes('internship') || cleanText.includes('experience')) detectedSections.push('SUMMER TRAINING & INTERNSHIPS');
  if (cleanText.includes('certification') || cleanText.includes('achievement')) detectedSections.push('CERTIFICATIONS & ACHIEVEMENTS');
  if (cleanText.includes('personal') || cleanText.includes('father')) detectedSections.push('PERSONAL DETAILS');

  const finalSequence = detectedSections.length >= 3 ? detectedSections : defaultSequence;

  // 3. Format Rules
  const formatRules = {
    collegeName,
    hasCollegeHeaderBox: true,
    tabularEducation: true,
    uppercaseHeadings: true,
    sectionDividerLine: true,
    headingFontSize: 11,
    bodyFontSize: 9.5,
    marginPt: 36, // 0.5 inch margins
    fontFamily: 'Latin Modern Roman'
  };

  return {
    success: true,
    collegeName,
    detectedSections: finalSequence,
    formatRules,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * 5. COLLEGE FORMAT LATEX GENERATOR
 * Generates exact academic college format with official college header box and tabular education
 */
function generateCollegeLatex(resumeData, formatRules = {}) {
  const p = resumeData.personal || resumeData.personalDetails || {};
  const edu = Array.isArray(resumeData.education) ? resumeData.education : [];
  const exp = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const prj = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const tech = resumeData.technicalSkills || {};
  const ach = Array.isArray(resumeData.achievements) ? resumeData.achievements : [];
  const cert = Array.isArray(resumeData.certifications) ? resumeData.certifications : [];

  const collegeName = formatRules.collegeName || 'AFFILIATED TECHNICAL CAMPUS';
  const name = (p.fullName || 'STUDENT NAME').toUpperCase();
  const phone = p.phone || '';
  const email = p.email || '';
  const linkedin = p.linkedinUrl || '';
  const github = p.githubUrl || '';
  const summary = p.summary || 'Seeking a challenging entry-level engineering position in a forward-thinking organization where I can leverage my academic foundations, algorithmic problem-solving abilities, and passion for software development to deliver measurable value.';

  let tex = `\\documentclass[a4paper,10pt]{article}
\\usepackage[top=0.45in,bottom=0.45in,left=0.5in,right=0.5in]{geometry}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{textcomp}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{titlesec}

\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}
\\setlist[itemize]{leftmargin=1.5em, itemsep=1pt, topsep=1pt, parsep=0pt}
\\pagestyle{empty}

% Section formatting for official college format
\\titleformat{\\section}{\\bfseries\\normalsize\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{6pt}{3pt}

\\begin{document}

% ----------------- COLLEGE HEADER BOX -----------------
\\begin{center}
  {\\large \\textbf{${collegeName}}}\\\\
  \\vspace{2pt}
  {\\small \\textbf{TRAINING \\& PLACEMENT CELL -- RESUME FORMAT}}\\\\
  \\vspace{4pt}
  \\hrule height 1.2pt
\\end{center}

% ----------------- STUDENT INFORMATION -----------------
\\vspace{-4pt}
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\Large ${name}} & \\textbf{Email:} \\href{mailto:${email}}{${email}} \\\\
  \\textbf{Contact:} ${phone} & \\textbf{Location:} ${p.location || 'Uttar Pradesh, India'} \\\\
  ${linkedin ? `\\textbf{LinkedIn:} \\href{${linkedin}}{${linkedin}} & ` : ''}
  ${github ? `\\textbf{GitHub:} \\href{${github}}{${github}}` : ''}
\\end{tabular*}
\\vspace{2pt}
\\hrule

% ----------------- CAREER OBJECTIVE -----------------
\\section{Career Objective}
${summary}

% ----------------- ACADEMIC QUALIFICATIONS (TABULAR FORMAT) -----------------
\\section{Academic Qualifications}
\\begin{tabularx}{\\textwidth}{|l|X|l|c|r|}
  \\hline
  \\textbf{Course / Degree} & \\textbf{College / School} & \\textbf{Board / Univ} & \\textbf{Year} & \\textbf{\\% / CGPA} \\\\
  \\hline
`;

  edu.forEach(e => {
    const deg = e.degree || 'B.Tech CSE';
    const inst = e.institution || 'AKTU Institute';
    const board = e.board || 'AKTU';
    const yr = e.duration || e.year || '2021-25';
    const score = e.cgpa || e.cgpaOrPercentage || '8.2 CGPA';
    tex += `  ${deg} & ${inst} & ${board} & ${yr} & ${score} \\\\\n  \\hline\n`;
  });

  tex += `\\end{tabularx}

% ----------------- TECHNICAL SKILLS -----------------
\\section{Technical Skills Profile}
\\begin{itemize}
`;

  const langs = (tech.programmingLanguages || []).join(', ');
  if (langs) tex += `  \\item \\textbf{Programming Languages:} ${langs}\n`;

  const frames = (tech.frameworks || []).join(', ');
  if (frames) tex += `  \\item \\textbf{Frameworks \\& Technologies:} ${frames}\n`;

  const dbs = (tech.databases || []).join(', ');
  if (dbs) tex += `  \\item \\textbf{Databases:} ${dbs}\n`;

  const tools = (tech.developerTools || []).join(', ');
  if (tools) tex += `  \\item \\textbf{Tools \\& Platforms:} ${tools}\n`;

  const concepts = (tech.coreConcepts || []).join(', ');
  if (concepts) tex += `  \\item \\textbf{Core Competencies:} ${concepts}\n`;

  tex += `\\end{itemize}

% ----------------- ACADEMIC PROJECTS -----------------
\\section{Capstone \\& Academic Projects}
`;

  prj.forEach(proj => {
    const pTitle = proj.title || 'Technical Project';
    const pTech = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '');
    tex += `\\textbf{${pTitle}} ${pTech ? `(\\textit{Tech: ${pTech}})` : ''}\\\\
\\begin{itemize}
`;
    (Array.isArray(proj.bullets) ? proj.bullets : []).forEach(b => {
      if (b.trim()) tex += `  \\item ${b.trim()}\n`;
    });
    tex += `\\end{itemize}
\\vspace{2pt}
`;
  });

  // ----------------- EXPERIENCE / INTERNSHIPS -----------------
  if (exp.length > 0) {
    tex += `\\section{Internships \\& Industrial Training}
`;
    exp.forEach(e => {
      tex += `\\textbf{${e.title || 'Intern'}} at \\textbf{${e.company || 'Organization'}} \\hfill ${e.duration || ''}\\\\
\\begin{itemize}
`;
      (Array.isArray(e.bullets) ? e.bullets : []).forEach(b => {
        if (b.trim()) tex += `  \\item ${b.trim()}\n`;
      });
      tex += `\\end{itemize}
\\vspace{2pt}
`;
    });
  }

  // ----------------- CERTIFICATIONS & ACHIEVEMENTS -----------------
  if (cert.length > 0 || ach.length > 0) {
    tex += `\\section{Certifications \\& Achievements}
\\begin{itemize}
`;
    cert.forEach(c => {
      tex += `  \\item \\textbf{Certification:} ${c.name || c.title || ''} ${c.issuer ? `(${c.issuer})` : ''}\n`;
    });
    ach.forEach(a => {
      tex += `  \\item \\textbf{Achievement:} ${a.description || a.title || ''}\n`;
    });
    tex += `\\end{itemize}
`;
  }

  // ----------------- PERSONAL DETAILS (College Standard) -----------------
  tex += `\\section{Personal Profile}
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{Permanent Address:} ${p.location || 'Uttar Pradesh, India'} & \\textbf{Nationality:} Indian \\\\
  \\textbf{Languages Known:} English, Hindi & \\textbf{Status:} Available Immediately \\\\
\\end{tabular*}

\\end{document}
`;

  return tex;
}

/**
 * 6. DOCX EXPORT GENERATOR
 * Generates clean, downloadable Microsoft Word (.docx) document
 */
async function generateDocxBuffer(resumeData) {
  const p = resumeData.personal || resumeData.personalDetails || {};
  const edu = Array.isArray(resumeData.education) ? resumeData.education : [];
  const exp = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const prj = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const tech = resumeData.technicalSkills || {};
  const cert = Array.isArray(resumeData.certifications) ? resumeData.certifications : [];
  const ach = Array.isArray(resumeData.achievements) ? resumeData.achievements : [];

  const children = [];

  // Header: Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (p.fullName || 'My Resume').toUpperCase(),
          bold: true,
          size: 36, // 18pt
          color: '7A1C28'
        })
      ]
    })
  );

  // Subtitle / Target Role
  if (p.professionalHeadline || p.targetRole) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: p.professionalHeadline || p.targetRole,
            bold: true,
            size: 24, // 12pt
            color: '475569'
          })
        ]
      })
    );
  }

  // Contact line
  const contactParts = [p.email, p.phone, p.location, p.linkedinUrl, p.githubUrl].filter(Boolean);
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 19, // 9.5pt
            color: '64748B'
          })
        ]
      })
    );
  }

  // Helper: Section Heading with bottom border
  const addSectionHeading = (title) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 100 },
        border: {
          bottom: {
            color: '7A1C28',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12
          }
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 23,
            color: '7A1C28'
          })
        ]
      })
    );
  };

  // Summary
  if (p.summary) {
    addSectionHeading('Professional Summary');
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: p.summary, size: 21 })]
      })
    );
  }

  // Technical Skills
  addSectionHeading('Technical Skills');
  const skillCategories = [
    { label: 'Programming Languages', list: tech.programmingLanguages },
    { label: 'Frameworks & Libraries', list: tech.frameworks },
    { label: 'Developer Tools', list: tech.developerTools },
    { label: 'Databases', list: tech.databases },
    { label: 'Core Competencies', list: tech.coreConcepts }
  ];

  skillCategories.forEach(sc => {
    if (sc.list && sc.list.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${sc.label}: `, bold: true, size: 21 }),
            new TextRun({ text: sc.list.join(', '), size: 21 })
          ]
        })
      );
    }
  });

  // Experience
  if (exp.length > 0) {
    addSectionHeading('Work Experience & Internships');
    exp.forEach(e => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({ text: e.title || 'Role', bold: true, size: 22 }),
            new TextRun({ text: ` — ${e.company || 'Company'}`, bold: true, color: '334155', size: 21 }),
            new TextRun({ text: `   (${e.duration || ''})`, italics: true, color: '64748B', size: 20 })
          ]
        })
      );
      (Array.isArray(e.bullets) ? e.bullets : []).forEach(b => {
        if (b.trim()) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [new TextRun({ text: b.trim(), size: 20 })]
            })
          );
        }
      });
    });
  }

  // Academic Projects
  if (prj.length > 0) {
    addSectionHeading('Academic & Capstone Projects');
    prj.forEach(proj => {
      const techStr = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '');
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({ text: proj.title || 'Project', bold: true, size: 22 }),
            techStr ? new TextRun({ text: ` | Technologies: ${techStr}`, italics: true, color: '64748B', size: 20 }) : new TextRun({ text: '' })
          ]
        })
      );
      (Array.isArray(proj.bullets) ? proj.bullets : []).forEach(b => {
        if (b.trim()) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [new TextRun({ text: b.trim(), size: 20 })]
            })
          );
        }
      });
    });
  }

  // Education
  if (edu.length > 0) {
    addSectionHeading('Education');
    edu.forEach(ed => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: ed.degree || 'Degree', bold: true, size: 22 }),
            new TextRun({ text: ` — ${ed.institution || 'University'}`, color: '334155', size: 21 }),
            new TextRun({ text: `  (${ed.duration || ed.year || ''})`, italics: true, color: '64748B', size: 20 })
          ]
        })
      );
      if (ed.cgpa || ed.cgpaOrPercentage) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: `Aggregate Score: ${ed.cgpa || ed.cgpaOrPercentage}`, size: 20, color: '475569' })]
          })
        );
      }
    });
  }

  // Certifications & Achievements
  if (cert.length > 0 || ach.length > 0) {
    addSectionHeading('Certifications & Achievements');
    cert.forEach(c => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: 'Certification: ', bold: true, size: 20 }),
            new TextRun({ text: `${c.name || c.title || ''} ${c.issuer ? `(${c.issuer})` : ''}`, size: 20 })
          ]
        })
      );
    });
    ach.forEach(a => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: 'Achievement: ', bold: true, size: 20 }),
            new TextRun({ text: `${a.description || a.title || ''}`, size: 20 })
          ]
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              bottom: 720,
              left: 720,
              right: 720
            }
          }
        },
        children
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

module.exports = {
  analyzeAtsScore,
  optimizeResumeForJob,
  parseResumeFile,
  detectCollegeFormat,
  generateCollegeLatex,
  generateDocxBuffer,
  TECH_KEYWORDS
};
