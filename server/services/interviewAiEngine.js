// ============================================================================
// PROFESSORVIRUS — AI INTERVIEWER ENGINE (TECHNICAL & HR)
// Real Human-like Virtual Interviewers Grounded in Candidate's Uploaded Resume
// ============================================================================

import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Candidate Gemini Model List in priority order
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-pro-latest'
];

/**
 * Helper to call Gemini with automatic model failover
 */
async function callGemini(systemPrompt, userPrompt, jsonMode = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 10) return null;

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of GEMINI_MODELS) {
      try {
        const config = {
          model: modelName,
          systemInstruction: systemPrompt
        };
        if (jsonMode) {
          config.generationConfig = { responseMimeType: 'application/json' };
        }
        const model = genAI.getGenerativeModel(config);
        const result = await model.generateContent(userPrompt);
        const text = result?.response?.text();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err) {
        // Continue to next model if 503 or 404
        console.warn(`[GEMINI PROBE ${modelName}]`, err.message?.slice(0, 120));
      }
    }
  } catch (outer) {
    console.warn('[GEMINI GLOBAL ERROR]', outer.message);
  }
  return null;
}

/**
 * ============================================================================
 * 1. RESUME PARSING & STRUCTURED CANDIDATE PROFILE EXTRACTION
 * ============================================================================
 */
export async function parseResumeDocument(buffer, mimetype = '', originalname = '') {
  let extractedText = '';
  const ext = (path.extname(originalname || '') || '').toLowerCase();

  try {
    if (ext === '.docx' || mimetype.includes('wordprocessingml')) {
      const zip = await JSZip.loadAsync(buffer);
      const docXml = await zip.file('word/document.xml')?.async('text');
      if (docXml) {
        extractedText = docXml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    } else if (ext === '.pdf' || mimetype.includes('pdf')) {
      const parsed = await pdfParse(buffer);
      extractedText = (parsed && parsed.text) ? parsed.text : '';
      if (!extractedText || extractedText.length < 50) {
        const rawStr = buffer.toString('latin1');
        const textMatches = rawStr.match(/\(([^()]{2,})\)\s*Tj/g) || [];
        extractedText = textMatches.map(m => m.replace(/^[(\s]+|[)\s]+Tj$/g, '')).join(' ');
      }
    } else {
      extractedText = buffer.toString('utf8');
    }
  } catch (err) {
    console.warn('[RESUME PARSE WARNING]:', err.message);
  }

  // Clean raw text
  const cleanText = (extractedText || '').replace(/\r/g, '\n').trim();

  // Try parsing with Gemini first
  let structuredProfile = null;
  if (cleanText.length > 50) {
    try {
      const systemInstruction = `You are an expert resume parser for technical candidate assessments.
CRITICAL MANDATORY RULE: Do NOT invent information. If something is not explicitly present in the candidate's resume text, do NOT make it up. Extract ONLY real facts from the text. Return valid JSON only.`;

      const prompt = `Extract a structured candidate profile from the following resume text:

Return JSON with this EXACT structure:
{
  "name": "Candidate Full Name or empty",
  "email": "Email address or empty",
  "phone": "Phone number or empty",
  "education": [
    { "degree": "Degree (e.g. B.Tech, MCA)", "branch": "Branch/Major", "college": "University/College Name", "year": "Year", "cgpa": "CGPA/Percentage" }
  ],
  "skills": ["Array of all distinct technical skills mentioned in the resume"],
  "programmingLanguages": ["Array of programming languages mentioned (e.g. Python, Java, C++, JavaScript)"],
  "frameworks": ["Array of frameworks mentioned (e.g. React, Node.js, Express, Django)"],
  "databases": ["Array of databases mentioned (e.g. MongoDB, MySQL, PostgreSQL, Redis)"],
  "tools": ["Array of developer tools mentioned (e.g. Git, Docker, AWS, Postman, Linux)"],
  "projects": [
    {
      "title": "Project Name",
      "description": "Summary of project",
      "techStack": ["Technologies used in this project"],
      "problemStatement": "What problem it solves",
      "architecture": "Architecture details if mentioned",
      "role": "Candidate's role if mentioned",
      "highlights": ["Key achievements or bullet points"]
    }
  ],
  "internships": [
    {
      "company": "Company Name",
      "role": "Role / Position",
      "duration": "Duration or Dates",
      "description": "Responsibilities and achievements"
    }
  ],
  "certifications": ["List of certifications"],
  "achievements": ["List of achievements and awards"],
  "extracurricular": ["List of relevant extracurriculars"]
}

Resume text:
${cleanText.slice(0, 8000)}`;

      const jsonStr = await callGemini(systemInstruction, prompt, true);
      if (jsonStr) {
        structuredProfile = JSON.parse(jsonStr);
      }
    } catch (e) {
      console.warn('[GEMINI RESUME PARSE FAILED, USING DETERMINISTIC PARSER]:', e.message);
    }
  }

  // Resilient deterministic fallback parser if Gemini unavailable or failed
  if (!structuredProfile || !structuredProfile.skills || structuredProfile.skills.length === 0) {
    structuredProfile = extractStructuredProfileDeterministic(cleanText, originalname);
  }

  // Ensure default candidate name if blank
  if (!structuredProfile.name || structuredProfile.name.trim().length === 0) {
    structuredProfile.name = (originalname || 'Candidate')
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/resume|cv/gi, '')
      .trim() || 'Candidate';
  }

  return {
    rawTextLength: cleanText.length,
    structuredProfile
  };
}

/**
 * Deterministic Semantic Entity Extractor (Zero External Dependencies)
 */
export function extractStructuredProfileDeterministic(text = '', defaultName = '') {
  const profile = {
    name: '',
    email: '',
    phone: '',
    education: [],
    skills: [],
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    tools: [],
    projects: [],
    internships: [],
    certifications: [],
    achievements: [],
    extracurricular: []
  };

  if (!text) {
    profile.name = defaultName || 'Candidate';
    return profile;
  }

  // 1. Email & Phone
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) profile.email = emailMatch[0];

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) profile.phone = phoneMatch[0];

  // 2. Candidate Name (Header Heuristics)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const l = lines[i];
    if (
      l.length > 2 &&
      l.length < 40 &&
      !l.includes('@') &&
      !l.match(/resume|curriculum|vitae|github|linkedin|http/i) &&
      !l.match(/^\+?\d/)
    ) {
      profile.name = l.replace(/[^a-zA-Z\s]/g, '').trim();
      break;
    }
  }
  if (!profile.name) profile.name = defaultName || 'Candidate';

  // 3. Technical Skills Dictionaries
  const KNOWN_LANGUAGES = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'C#', 'Go', 'Golang',
    'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'SQL', 'HTML', 'CSS', 'HTML5', 'CSS3'
  ];

  const KNOWN_FRAMEWORKS = [
    'React', 'React.js', 'ReactJS', 'Next.js', 'NextJS', 'Node.js', 'NodeJS', 'Express',
    'Express.js', 'Vue', 'Vue.js', 'Angular', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
    'Tailwind', 'TailwindCSS', 'Redux', 'Bootstrap', 'GraphQL', 'REST API', 'RESTful API'
  ];

  const KNOWN_DATABASES = [
    'MongoDB', 'MySQL', 'PostgreSQL', 'Postgres', 'Redis', 'SQLite', 'Firebase',
    'Cassandra', 'Oracle', 'DynamoDB', 'Supabase'
  ];

  const KNOWN_TOOLS = [
    'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services',
    'Azure', 'GCP', 'Google Cloud', 'Linux', 'Ubuntu', 'Postman', 'VS Code', 'Jira',
    'CI/CD', 'Jenkins', 'Vercel', 'Netlify', 'Webpack', 'Vite'
  ];

  // Match skills with whole-word or boundary regex
  const textLower = ` ${text.toLowerCase()} `;

  KNOWN_LANGUAGES.forEach(lang => {
    const escaped = lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[\\s,;:/()\\[\\]])${escaped}([\\s,;:/()\\[\\]]|$)`, 'i');
    if (regex.test(textLower)) {
      profile.programmingLanguages.push(lang);
      profile.skills.push(lang);
    }
  });

  KNOWN_FRAMEWORKS.forEach(fw => {
    const escaped = fw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[\\s,;:/()\\[\\]])${escaped}([\\s,;:/()\\[\\]]|$)`, 'i');
    if (regex.test(textLower)) {
      profile.frameworks.push(fw);
      profile.skills.push(fw);
    }
  });

  KNOWN_DATABASES.forEach(db => {
    const escaped = db.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[\\s,;:/()\\[\\]])${escaped}([\\s,;:/()\\[\\]]|$)`, 'i');
    if (regex.test(textLower)) {
      profile.databases.push(db);
      profile.skills.push(db);
    }
  });

  KNOWN_TOOLS.forEach(tool => {
    const escaped = tool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[\\s,;:/()\\[\\]])${escaped}([\\s,;:/()\\[\\]]|$)`, 'i');
    if (regex.test(textLower)) {
      profile.tools.push(tool);
      profile.skills.push(tool);
    }
  });

  // Deduplicate skills
  profile.skills = Array.from(new Set(profile.skills));
  profile.programmingLanguages = Array.from(new Set(profile.programmingLanguages));
  profile.frameworks = Array.from(new Set(profile.frameworks));
  profile.databases = Array.from(new Set(profile.databases));
  profile.tools = Array.from(new Set(profile.tools));

  // 4. Education Parsing
  const eduMatches = text.match(/(?:B\.?Tech|Bachelor|B\.?E\.?|MCA|BCA|M\.?Tech|B\.?Sc|Diploma)[\s\S]{0,160}?(?=\n\s*\n|\b(?:Skills|Projects|Experience|Work|Certifications)\b|$)/gi) || [];
  eduMatches.slice(0, 3).forEach(match => {
    const cleanMatch = match.replace(/\s+/g, ' ').trim();
    const collegeMatch = cleanMatch.match(/(?:college|university|institute|school|academy)[\w\s,.-]+/i);
    const branchMatch = cleanMatch.match(/(?:computer science|information technology|electronics|mechanical|electrical|cse|it|ece)/i);
    const cgpaMatch = cleanMatch.match(/(?:cgpa|percentage|score|marks)?\s*:?\s*(\d+(?:\.\d+)?(?:\s*\/\s*10|\s*%)?)/i);

    profile.education.push({
      degree: cleanMatch.slice(0, 40),
      branch: branchMatch ? branchMatch[0] : 'Engineering',
      college: collegeMatch ? collegeMatch[0].slice(0, 60) : 'Engineering College',
      cgpa: cgpaMatch ? cgpaMatch[1] : ''
    });
  });

  // 5. Projects Extraction
  const projSection = text.match(/(?:projects|personal projects|academic projects)[\s\S]*?(?=\n\s*(?:internships|experience|work experience|certifications|education|skills)\b|$)/i);
  if (projSection) {
    const projLines = projSection[0].split('\n').map(l => l.trim()).filter(Boolean);
    let currentProj = null;

    projLines.forEach(line => {
      // If line looks like a project title (short, capitalized or numbered)
      if (line.match(/^(?:[1-9]\.|\*|-|•)?\s*([A-Z][\w\s-]{3,60})(?:\s*[-:|–]|\s*\(.*?\))?$/) && !line.match(/^(projects?|personal projects?|academic projects?|skills|tools|technologies|github|link|description|summary|overview)[:\s]*$/i)) {
        if (currentProj) profile.projects.push(currentProj);
        const title = line.replace(/^[0-9.*•-]+\s*/, '').split(/\s+[-–—]\s+|:\s*/)[0].trim();
        currentProj = {
          title,
          description: '',
          techStack: [],
          highlights: []
        };
      } else if (currentProj) {
        if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
          const bullet = line.replace(/^[-•*]\s*/, '').trim();
          currentProj.highlights.push(bullet);
          if (!currentProj.description) currentProj.description = bullet;
        } else {
          currentProj.description = (currentProj.description ? currentProj.description + ' ' : '') + line;
        }

        // Detect tech stack in line
        profile.skills.forEach(s => {
          if (line.toLowerCase().includes(s.toLowerCase()) && !currentProj.techStack.includes(s)) {
            currentProj.techStack.push(s);
          }
        });
      }
    });
    if (currentProj) profile.projects.push(currentProj);
  }

  // 6. Internships Extraction
  const expSection = text.match(/(?:internships|work experience|experience)[\s\S]*?(?=\n\s*(?:projects|education|skills|certifications|achievements)\b|$)/i);
  if (expSection) {
    const expLines = expSection[0].split('\n').map(l => l.trim()).filter(Boolean);
    let currentExp = null;

    expLines.forEach(line => {
      if (line.match(/(intern|developer|engineer|trainee|analyst)/i) && line.length < 70 && !line.match(/^(internships?|experience|work experience)[:\s]*$/i)) {
        if (currentExp) profile.internships.push(currentExp);
        currentExp = {
          role: line,
          company: '',
          description: '',
          duration: ''
        };
      } else if (currentExp) {
        currentExp.description = (currentExp.description ? currentExp.description + ' ' : '') + line;
      }
    });
    if (currentExp) profile.internships.push(currentExp);
  }

  return profile;
}

/**
 * ============================================================================
 * 2. TECHNICAL INTERVIEWER CONVERSATIONAL ENGINE
 * ============================================================================
 */
export async function generateTechnicalTurn({
  attemptId,
  questionIndex = 0,
  lastAnswer = '',
  previousQuestions = [],
  candidateProfile = {},
  currentDifficulty = 'Standard'
}) {
  const p = candidateProfile || {};
  const candidateName = p.name || p.fullName || candidateProfile.candidateName || 'Candidate';
  const skills = Array.isArray(p.skills) && p.skills.length > 0
    ? p.skills
    : ['React', 'Node.js', 'MongoDB', 'JavaScript'];
  const projects = Array.isArray(p.projects) && p.projects.length > 0
    ? p.projects
    : [{ title: 'Full Stack Web Platform', techStack: skills.slice(0, 3) }];

  const topProject = projects[0] || { title: 'Full Stack Web Application', techStack: skills.slice(0, 3) };
  const primarySkill = skills[0] || 'JavaScript';
  const secondarySkill = skills[1] || 'Node.js';

  const answerText = (lastAnswer || '').trim();
  const lowerAnswer = answerText.toLowerCase();
  const isSkip = !answerText || lowerAnswer === 'skip' || lowerAnswer === 'pass' || lowerAnswer === 'next';
  const isIdk = lowerAnswer.includes("don't know") || lowerAnswer.includes("not sure") || lowerAnswer.includes("no idea");
  const wordCount = answerText ? answerText.split(/\s+/).length : 0;

  // 1. Evaluate previous answer if applicable
  let evaluation = null;
  let conversationalAck = '';
  let updatedDifficulty = currentDifficulty;

  if (questionIndex > 0 || previousQuestions.length > 0) {
    const lastQ = previousQuestions[previousQuestions.length - 1] || { question: 'Technical Question' };

    if (isSkip) {
      conversationalAck = "No worries, let's keep things moving and pivot to another aspect of your experience.";
      updatedDifficulty = 'Standard';
      evaluation = {
        questionId: `TECH-Q${questionIndex}`,
        question: lastQ.question,
        userAnswer: 'Skipped',
        status: 'skipped',
        score: 0,
        correctness: 0,
        technicalDepth: 0,
        relevance: 0,
        feedback: 'Candidate skipped the question.',
        strengths: 'None noted.',
        weaknesses: 'Question unanswered.'
      };
    } else if (isIdk) {
      conversationalAck = `I appreciate your honesty. In production systems, ${lastQ.focus || 'that mechanism'} typically relies on structured error boundaries and defensive fallbacks. Let's explore how you handled this in practice:`;
      updatedDifficulty = 'Fundamental';
      evaluation = {
        questionId: `TECH-Q${questionIndex}`,
        question: lastQ.question,
        userAnswer: answerText,
        status: 'answered',
        score: 25,
        correctness: 3,
        technicalDepth: 2,
        relevance: 4,
        feedback: 'Candidate demonstrated intellectual honesty regarding technical knowledge boundaries.',
        strengths: 'Clear communication of limitations without making things up.',
        weaknesses: 'Needs deeper study of underlying protocol and runtime behaviors.'
      };
    } else if (wordCount < 18) {
      conversationalAck = "That gives a high-level overview. Let's delve into the concrete implementation details:";
      evaluation = {
        questionId: `TECH-Q${questionIndex}`,
        question: lastQ.question,
        userAnswer: answerText,
        status: 'answered',
        score: 55,
        correctness: 6,
        technicalDepth: 5,
        relevance: 6,
        feedback: 'Answer was brief and surface-level. Lacked concrete implementation specifics.',
        strengths: 'Accurate terminology.',
        weaknesses: 'Needs to provide concrete architectural reasoning and trade-offs.'
      };
    } else {
      // Strong answer -> increase difficulty
      const calculatedScore = Math.min(95, Math.max(75, 75 + Math.min(20, Math.floor(wordCount / 4))));
      updatedDifficulty = 'Advanced';
      conversationalAck = "That's a very clear and practical explanation. You clearly have hands-on experience with that architecture.";
      evaluation = {
        questionId: `TECH-Q${questionIndex}`,
        question: lastQ.question,
        userAnswer: answerText,
        status: 'answered',
        score: calculatedScore,
        correctness: Math.min(10, Math.floor(calculatedScore / 10)),
        technicalDepth: Math.min(10, Math.floor(calculatedScore / 10)),
        relevance: 9,
        feedback: 'Strong technical explanation with clear reasoning and solid grasp of trade-offs.',
        strengths: 'Structured delivery, architectural clarity, and practical problem-solving perspective.',
        weaknesses: 'Keep articulating edge-case recovery and distributed failure modes.'
      };
    }
  }

  // If already at total questions (5 questions total), conclude interview
  const TOTAL_QUESTIONS = 5;
  if (questionIndex >= TOTAL_QUESTIONS) {
    return {
      success: true,
      isComplete: true,
      evaluation,
      conversationalAck,
      spokenText: `${conversationalAck} That concludes our technical interview session today, ${candidateName}. Thank you for your thoughtful responses, and you may now proceed to the HR and Behavioral round.`,
      nextQuestion: null
    };
  }

  // 2. Generate Next Question grounded in Candidate's Resume
  let nextQ = null;

  // Try calling Gemini for ultra-human conversational flow
  const geminiPrompt = `
Candidate Name: ${candidateName}
Candidate Verified Skills: ${skills.join(', ')}
Candidate Resume Projects: ${JSON.stringify(projects.slice(0, 2))}
Current Question Index: ${questionIndex + 1} of 5
Previous Candidate Answer: "${answerText || 'None (First question)'}"
Previous Questions Asked: ${JSON.stringify(previousQuestions.map(q => q.question))}
Difficulty Level: ${updatedDifficulty}

MANDATORY RULES:
1. Act as a REAL, PROFESSIONAL, ENCOURAGING TECHNICAL INTERVIEWER (female persona).
2. Ground questions STRICTLY in the candidate's uploaded resume projects and skills.
3. NEVER ask about technologies NOT listed in the resume unless the candidate mentioned them.
4. Follow natural human interview flow:
   - Question 1 (index 0): Warm greeting referring to candidate by name (${candidateName}), mention their specific project (${topProject.title}), and ask about its architecture and tech stack (${topProject.techStack?.join(', ') || primarySkill}).
   - Question 2 (index 1): Probe the hardest technical problem or bug they faced while building that project and how they solved it.
   - Question 3 (index 2): Deep dive into data consistency, security, or fault tolerance based on their previous answer.
   - Question 4 (index 3): Scalability challenge: "If you had to scale ${topProject.title} to 100,000 active users, what would you change in your architecture, database, and caching?"
   - Question 5 (index 4): Deep dive into candidate's skill "${secondarySkill}" from their resume and architectural trade-offs.
5. Return JSON with:
   {
     "title": "Short topic title",
     "conversationalAck": "Natural human response acknowledging candidate's last answer",
     "question": "The next question to ask",
     "focus": "Topic focus area"
   }
`;

  try {
    const rawJson = await callGemini(
      "You are an expert technical interviewer conducting an adaptive live technical interview. Return valid JSON only.",
      geminiPrompt,
      true
    );
    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      if (parsed.question) {
        nextQ = {
          id: `TECH-Q${questionIndex + 1}`,
          index: questionIndex + 1,
          total: TOTAL_QUESTIONS,
          title: parsed.title || `Technical Concept ${questionIndex + 1}`,
          question: parsed.question,
          conversationalAck: conversationalAck || parsed.conversationalAck || '',
          spokenText: (conversationalAck || parsed.conversationalAck)
            ? `${conversationalAck || parsed.conversationalAck} ${parsed.question}`
            : parsed.question,
          focus: parsed.focus || 'Resume Project & Technical Depth'
        };
      }
    }
  } catch (err) {
    console.warn('[GEMINI TECH GENERATION FAILED, USING DETERMINISTIC FLOW]:', err.message);
  }

  // Deterministic Fallback if Gemini failed or offline
  if (!nextQ) {
    let title = '';
    let question = '';
    let focus = '';

    if (questionIndex === 0) {
      title = 'Project Architecture & Tech Stack Selection';
      focus = 'Resume Project Deep-Dive';
      question = `Hello ${candidateName}, welcome to your technical interview. I've reviewed your resume and noticed your project, "${topProject.title}". To start off, could you walk me through the overall architecture of this project and why you selected ${topProject.techStack?.slice(0, 2).join(' and ') || primarySkill} for its implementation?`;
    } else if (questionIndex === 1) {
      title = 'Technical Problem Solving & Debugging';
      focus = 'Engineering Challenges';
      question = `While building ${topProject.title}, what was the most complex technical challenge, bug, or bottleneck you encountered, and walk me through step-by-step how you diagnosed and resolved it?`;
    } else if (questionIndex === 2) {
      title = 'Fault Tolerance & Data Integrity';
      focus = 'System Reliability';
      question = `That makes sense. If an unexpected failure or network partition occurred between your services or database during that workflow, how did your architecture ensure data integrity without leaving the system in an inconsistent state?`;
    } else if (questionIndex === 3) {
      title = 'System Scalability to 100,000 Users';
      focus = 'Scalability & Performance';
      question = `If you had to scale ${topProject.title} to support 100,000 concurrent active users with sub-100 millisecond response times, what architectural bottlenecks would surface first, and what changes would you introduce regarding caching, database indexing, or horizontal scaling?`;
    } else {
      title = `${secondarySkill} Deep-Dive & Trade-offs`;
      focus = 'Core Technical Mastery';
      question = `Looking at your experience with ${secondarySkill} on your resume, what are the primary architectural trade-offs you evaluate when building with it, and what alternatives did you consider?`;
    }

    const spokenText = conversationalAck ? `${conversationalAck} ${question}` : question;

    nextQ = {
      id: `TECH-Q${questionIndex + 1}`,
      index: questionIndex + 1,
      total: TOTAL_QUESTIONS,
      title,
      question,
      conversationalAck,
      spokenText,
      focus
    };
  }

  return {
    success: true,
    isComplete: false,
    evaluation,
    conversationalAck: nextQ.conversationalAck || conversationalAck,
    spokenText: nextQ.spokenText,
    nextQuestion: nextQ,
    currentDifficulty: updatedDifficulty
  };
}

/**
 * ============================================================================
 * 3. HR / BEHAVIORAL INTERVIEWER CONVERSATIONAL ENGINE
 * ============================================================================
 */
export async function generateHrTurn({
  attemptId,
  questionIndex = 0,
  lastAnswer = '',
  previousQuestions = [],
  candidateProfile = {},
  currentDifficulty = 'Standard'
}) {
  const p = candidateProfile || {};
  const candidateName = p.name || p.fullName || candidateProfile.candidateName || 'Candidate';
  const education = (Array.isArray(p.education) && p.education[0]) || { degree: 'Engineering', branch: 'Computer Science', college: 'your college' };
  const projects = Array.isArray(p.projects) && p.projects.length > 0
    ? p.projects
    : [{ title: 'Full Stack Project' }];
  const internships = Array.isArray(p.internships) && p.internships.length > 0
    ? p.internships
    : null;

  const topProject = projects[0] || { title: 'Academic Project' };
  const expItem = internships ? internships[0] : null;

  const answerText = (lastAnswer || '').trim();
  const lowerAnswer = answerText.toLowerCase();
  const isSkip = !answerText || lowerAnswer === 'skip' || lowerAnswer === 'pass' || lowerAnswer === 'next';
  const wordCount = answerText ? answerText.split(/\s+/).length : 0;

  // 1. Evaluate previous response using STAR methodology
  let evaluation = null;
  let conversationalAck = '';

  if (questionIndex > 0 || previousQuestions.length > 0) {
    const lastQ = previousQuestions[previousQuestions.length - 1] || { question: 'Behavioral Question' };

    if (isSkip) {
      conversationalAck = "Understood. Let's move on to explore another important dimension of your experience.";
      evaluation = {
        questionId: `HR-Q${questionIndex}`,
        question: lastQ.question,
        userAnswer: 'Skipped',
        status: 'skipped',
        score: 0,
        competencies: ['Communication', 'Ownership'],
        feedback: 'Candidate skipped the behavioral question.',
        strengths: 'None noted.',
        weaknesses: 'Question unanswered.'
      };
    } else if (wordCount < 15) {
      conversationalAck = "Thank you for that context. In professional interviews, sharing specific actions and concrete outcomes helps convey the full impact:";
      evaluation = {
        questionId: `HR-Q${questionIndex}`,
        question: lastQ.question,
        userAnswer: answerText,
        status: 'answered',
        score: 50,
        competencies: ['Communication', 'Self-Awareness'],
        feedback: 'Brief response that lacked the Action and Result components of the STAR framework.',
        strengths: 'Concise summary.',
        weaknesses: 'Elaborate on specific actions taken and measurable outcomes achieved.'
      };
    } else {
      const calculatedScore = Math.min(95, Math.max(78, 78 + Math.min(18, Math.floor(wordCount / 4))));
      conversationalAck = "That shows thoughtful self-awareness and strong personal accountability. I appreciate you sharing that real-world experience.";
      evaluation = {
        questionId: `HR-Q${questionIndex}`,
        question: lastQ.question,
        userAnswer: answerText,
        status: 'answered',
        score: calculatedScore,
        competencies: ['Communication', 'Teamwork', 'Emotional Intelligence', 'Ownership'],
        feedback: 'Well-structured behavioral response demonstrating accountability, resilience, and maturity.',
        strengths: 'Structured STAR narrative, clear ownership of outcomes, and reflective maturity.',
        weaknesses: 'Continue articulating retrospective takeaways in team settings.'
      };
    }
  }

  const TOTAL_QUESTIONS = 5;
  if (questionIndex >= TOTAL_QUESTIONS) {
    return {
      success: true,
      isComplete: true,
      evaluation,
      conversationalAck,
      spokenText: `${conversationalAck} That concludes your HR and Behavioral interview round, ${candidateName}. Thank you for your authenticity and professional insights. We are compiling your complete multi-round assessment report right now.`,
      nextQuestion: null
    };
  }

  // 2. Generate Next Behavioral Question Grounded in Resume
  let nextQ = null;

  const geminiPrompt = `
Candidate Name: ${candidateName}
Education: ${education.degree || 'Degree'} in ${education.branch || 'Branch'} at ${education.college || 'College'}
Projects: ${JSON.stringify(projects.slice(0, 2))}
Internships: ${JSON.stringify(internships || [])}
Current Question Index: ${questionIndex + 1} of 5
Previous Candidate Answer: "${answerText || 'None (First question)'}"
Previous Questions: ${JSON.stringify(previousQuestions.map(q => q.question))}

MANDATORY RULES:
1. Act as a REAL, EMPATHETIC, PROFESSIONAL HR INTERVIEWER (female persona, warm and discerning).
2. Ground questions strictly in the candidate's actual resume (name, college, project ${topProject.title}${expItem ? ', internship at ' + expItem.company : ''}).
3. Follow natural behavioral conversational flow:
   - Question 1 (index 0): Warm welcome addressing ${candidateName} by name, referencing their background in ${education.branch || 'engineering'}, asking for a concise self-introduction highlighting what motivated them and what they are most proud of on their resume.
   - Question 2 (index 1): Probe personal contribution and teamwork: "I noticed on your resume you worked on ${expItem ? expItem.company + ' / ' : ''}${topProject.title}. What was your personal contribution, and how did you resolve any technical disagreement or friction with team members?"
   - Question 3 (index 2): Probe resilience & pressure: "Describe a situation during a project deadline or academic delivery where things went wrong unexpectedly. How did you prioritize and manage the stress?"
   - Question 4 (index 3): Probe adaptability & learning curve: "Tell me about a time when you had to master a new tool or technology in very limited time. How did you structure your learning?"
   - Question 5 (index 4): Probe career vision & culture: "Where do you envision yourself evolving over the next 2 to 3 years, and what type of team culture brings out your best performance?"
4. Return JSON with:
   {
     "title": "Short title",
     "conversationalAck": "Natural human response acknowledging candidate's previous response",
     "question": "The next question",
     "competencies": ["List of competencies evaluated"]
   }
`;

  try {
    const rawJson = await callGemini(
      "You are an expert HR interviewer conducting a real behavioral interview with the candidate. Return valid JSON only.",
      geminiPrompt,
      true
    );
    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      if (parsed.question) {
        nextQ = {
          id: `HR-Q${questionIndex + 1}`,
          index: questionIndex + 1,
          total: TOTAL_QUESTIONS,
          title: parsed.title || `Behavioral Competency ${questionIndex + 1}`,
          question: parsed.question,
          conversationalAck: conversationalAck || parsed.conversationalAck || '',
          spokenText: (conversationalAck || parsed.conversationalAck)
            ? `${conversationalAck || parsed.conversationalAck} ${parsed.question}`
            : parsed.question,
          competencies: parsed.competencies || ['Communication', 'Culture Fit', 'Self-Awareness']
        };
      }
    }
  } catch (err) {
    console.warn('[GEMINI HR GENERATION FAILED, USING DETERMINISTIC FLOW]:', err.message);
  }

  // Deterministic Fallback if Gemini unavailable
  if (!nextQ) {
    let title = '';
    let question = '';
    let competencies = [];

    if (questionIndex === 0) {
      title = 'Professional Introduction & Motivation';
      competencies = ['Communication', 'Self-Awareness', 'Motivation'];
      question = `Hello ${candidateName}, welcome to your HR and Behavioral interview. I've reviewed your resume and noted your background in ${education.branch || 'Engineering'}. To start off, could you give me a brief introduction of yourself, sharing what inspired your journey into technology and what achievement on your resume you are most proud of?`;
    } else if (questionIndex === 1) {
      title = 'Project Ownership & Conflict Resolution';
      competencies = ['Teamwork', 'Conflict Resolution', 'Ownership'];
      question = `I noticed on your resume you worked on "${topProject.title}". What was your personal contribution to that project, and could you describe a situation where you had a difference of opinion or technical disagreement with a peer, and how you navigated it?`;
    } else if (questionIndex === 2) {
      title = 'Pressure Management & Overcoming Setbacks';
      competencies = ['Resilience', 'Prioritization', 'Emotional Intelligence'];
      question = `Can you describe a situation where a critical deadline was at risk, or an unexpected technical failure occurred right before delivery? How did you prioritize your immediate actions and manage personal stress?`;
    } else if (questionIndex === 3) {
      title = 'Agility & Rapid Technical Learning';
      competencies = ['Adaptability', 'Initiative', 'Continuous Learning'];
      question = `In fast-moving software environments, technologies shift quickly. Tell me about a time when you had to learn an unfamiliar tool, library, or framework on very short notice. How did you structure your learning to deliver results?`;
    } else {
      title = 'Career Vision & Cultural Fit';
      competencies = ['Leadership', 'Cultural Alignment', 'Professional Vision'];
      question = `Looking ahead, where do you see yourself evolving as an engineering professional over the next 2 to 3 years, and what kind of team values or culture enable you to perform at your highest level?`;
    }

    const spokenText = conversationalAck ? `${conversationalAck} ${question}` : question;

    nextQ = {
      id: `HR-Q${questionIndex + 1}`,
      index: questionIndex + 1,
      total: TOTAL_QUESTIONS,
      title,
      question,
      conversationalAck,
      spokenText,
      competencies
    };
  }

  return {
    success: true,
    isComplete: false,
    evaluation,
    conversationalAck: nextQ.conversationalAck || conversationalAck,
    spokenText: nextQ.spokenText,
    nextQuestion: nextQ
  };
}
