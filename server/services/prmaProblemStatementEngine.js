/**
 * PRMA Tech - Official Internship Problem Statement & Weekly Tasks PDF Engine
 * Generates personalized 10-page official problem statement documents from the
 * user's authentic PRMA Tech Problem Statement template.
 *
 * Populates:
 * - Page 1: Student Name, Offer ID, Internship Domain, Duration, Supervisor, Issue Date
 * - Pages 2-9: 4 Weekly Tasks (Task 1 to Task 4) with dates, domain problem statements,
 *   and personalized student submission portal URLs (DELIVERABLE 3 link)
 * - Page 10: Final Checklist and Student Intern Acknowledgement
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

/**
 * Domain-specific 4 weekly tasks library matching PRMA Tech technical tracks
 */
export const DEFAULT_DOMAIN_TASKS = {
  'ai-ml': [
    {
      weekNumber: 1,
      title: 'Python Data Pipeline, Exploratory Analysis & Feature Engineering',
      problemStatement: 'Design an end-to-end data ingestion and EDA pipeline for high-dimensional technical datasets.',
      effort: '6-8 hours',
      prerequisites: 'Python 3.10+, NumPy, Pandas, Scikit-learn'
    },
    {
      weekNumber: 2,
      title: 'Supervised & Unsupervised Machine Learning Model Architecture',
      problemStatement: 'Develop, benchmark, and cross-validate regression and classification pipelines with hyperparameter tuning.',
      effort: '8-10 hours',
      prerequisites: 'Scikit-learn, XGBoost, Matplotlib/Seaborn'
    },
    {
      weekNumber: 3,
      title: 'Deep Learning / Neural Network Implementation & Metric Evaluation',
      problemStatement: 'Construct a multi-layer PyTorch or TensorFlow neural network, evaluate loss convergence, and optimize weights.',
      effort: '8-10 hours',
      prerequisites: 'PyTorch or TensorFlow, GPU acceleration'
    },
    {
      weekNumber: 4,
      title: 'Model Packaging, Fast-API Deployment & Comprehensive Project Report',
      problemStatement: 'Package the trained model into a production REST API with Docker containerization, Swagger docs, and complete README.',
      effort: '6-8 hours',
      prerequisites: 'FastAPI, Uvicorn, Docker, Postman'
    }
  ],
  'fullstack-web-dev': [
    {
      weekNumber: 1,
      title: 'Project Architecture, UI/UX Wireframing & Component Hierarchy',
      problemStatement: 'Set up Vite + React/Next.js repository, configure Tailwind CSS design system, and implement responsive navigation.',
      effort: '6-8 hours',
      prerequisites: 'Node.js, React, Tailwind CSS, Git'
    },
    {
      weekNumber: 2,
      title: 'RESTful API Integration, State Management & Dynamic Data Views',
      problemStatement: 'Integrate backend endpoints, state store (Redux/Zustand), form validation, and responsive dashboard widgets.',
      effort: '8-10 hours',
      prerequisites: 'REST APIs, Axios/Fetch, Context API / Zustand'
    },
    {
      weekNumber: 3,
      title: 'Authentication, Protected Routes, Security & Error Boundaries',
      problemStatement: 'Implement JWT/Session auth guards, secure token handling, error boundary fallbacks, and performance optimization.',
      effort: '8-10 hours',
      prerequisites: 'JWT, LocalStorage security, Error boundaries'
    },
    {
      weekNumber: 4,
      title: 'Production Deployment, CI/CD Pipeline & Technical Documentation',
      problemStatement: 'Deploy full-stack web application to production cloud (Vercel/Render), configure SSL, and write technical docs.',
      effort: '6-8 hours',
      prerequisites: 'Vercel, Git CI/CD, Markdown documentation'
    }
  ],
  'default': [
    {
      weekNumber: 1,
      title: 'Technical Foundation, Tooling Setup & Problem Analysis',
      problemStatement: 'Set up development environment, analyze domain architecture specifications, and create initial modular prototype.',
      effort: '6-8 hours',
      prerequisites: 'Core programming language, Git repository setup'
    },
    {
      weekNumber: 2,
      title: 'Core Feature Engineering & Functional Module Development',
      problemStatement: 'Implement core technical requirements, modular service functions, and unit validation suites.',
      effort: '8-10 hours',
      prerequisites: 'Domain libraries, data structures, algorithm design'
    },
    {
      weekNumber: 3,
      title: 'System Integration, Edge-case Testing & Quality Assurance',
      problemStatement: 'Integrate external services, perform automated test coverage, and benchmark runtime efficiency.',
      effort: '8-10 hours',
      prerequisites: 'Integration testing tools, debugging utilities'
    },
    {
      weekNumber: 4,
      title: 'Final Project Polish, Cloud Deployment & Comprehensive Submission',
      problemStatement: 'Prepare production release, generate verification report, record walkthrough demo, and submit deliverables.',
      effort: '6-8 hours',
      prerequisites: 'Production build tools, deployment hosting, documentation'
    }
  ]
};

export async function generatePrmaProblemStatementPdf({
  studentName = 'Candidate',
  offerId = 'PRMA-AIML-2026-001',
  domainTitle = 'Artificial Intelligence & Machine Learning (AI/ML)',
  domainId = 'ai-ml',
  joiningDate = '',
  completionDate = '',
  submissionToken = '',
  submissionUrl = ''
}) {
  const templatePath = path.resolve(process.cwd(), 'server/data/templates/prma_problem_statement_template.pdf');
  if (!fs.existsSync(templatePath)) {
    throw new Error('Problem statement template PDF not found at ' + templatePath);
  }

  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const white = rgb(1, 1, 1);
  const textDark = rgb(0.06, 0.09, 0.16);
  const linkBlue = rgb(0.03, 0.4, 0.96);

  // Dates
  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedIssueDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const formattedJoiningDate = joiningDate || `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  let formattedCompDate = completionDate;
  if (!formattedCompDate) {
    const nextMonth = new Date(now.getTime() + 30 * 86400000);
    formattedCompDate = `${nextMonth.getDate()} ${months[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`;
  }

  const finalSubmissionUrl =
    submissionUrl ||
    `https://professorvirus.site/prma-tech/submit/${submissionToken || 'portal'}`;

  const domainTasks = DEFAULT_DOMAIN_TASKS[domainId] || DEFAULT_DOMAIN_TASKS['default'];

  // ==========================================
  // PAGE 1: COVER & DOCUMENT DETAILS
  // ==========================================
  const page1 = pdfDoc.getPages()[0];

  // 1. Intern Name
  page1.drawRectangle({ x: 222, y: 485, width: 290, height: 18, color: white });
  page1.drawText(studentName, { x: 226, y: 489, size: 9.5, font: fontBold, color: textDark });

  // 2. Offer / Application ID
  page1.drawRectangle({ x: 222, y: 458, width: 290, height: 18, color: white });
  page1.drawText(offerId, { x: 226, y: 462, size: 9.5, font: fontBold, color: textDark });

  // 3. Internship Domain
  page1.drawRectangle({ x: 222, y: 431, width: 290, height: 18, color: white });
  page1.drawText(domainTitle, { x: 226, y: 435, size: 9, font: fontBold, color: textDark });

  // 4. Internship Duration
  page1.drawRectangle({ x: 222, y: 404, width: 290, height: 18, color: white });
  page1.drawText(`${formattedJoiningDate} to ${formattedCompDate} (1 Month)`, { x: 226, y: 408, size: 8.5, font: fontRegular, color: textDark });

  // 5. Mentor / Supervisor
  page1.drawRectangle({ x: 222, y: 377, width: 290, height: 18, color: white });
  page1.drawText('Technical Mentorship Board, PRMA Tech', { x: 226, y: 381, size: 8.5, font: fontRegular, color: textDark });

  // 6. Document Version
  page1.drawRectangle({ x: 222, y: 350, width: 290, height: 18, color: white });
  page1.drawText(`v2.4 - Approved & Issued ${formattedIssueDate}`, { x: 226, y: 354, size: 8.5, font: fontRegular, color: textDark });

  // ==========================================
  // PAGES 2 - 9: 4 WEEKS TASKS & SUBMISSION PORTAL LINKS
  // ==========================================
  // Schedule dates calculation for 4 weeks:
  const startDateObj = new Date();
  const weekDates = [
    {
      release: formattedJoiningDate,
      deadline: formatRelativeDate(startDateObj, 7)
    },
    {
      release: formatRelativeDate(startDateObj, 7),
      deadline: formatRelativeDate(startDateObj, 14)
    },
    {
      release: formatRelativeDate(startDateObj, 14),
      deadline: formatRelativeDate(startDateObj, 21)
    },
    {
      release: formatRelativeDate(startDateObj, 21),
      deadline: formatRelativeDate(startDateObj, 28)
    }
  ];

  const weekPagePairs = [
    { taskPage: 1, reviewPage: 2, weekIdx: 0 },
    { taskPage: 3, reviewPage: 4, weekIdx: 1 },
    { taskPage: 5, reviewPage: 6, weekIdx: 2 },
    { taskPage: 7, reviewPage: 8, weekIdx: 3 }
  ];

  for (const pair of weekPagePairs) {
    const tPage = pdfDoc.getPages()[pair.taskPage];
    const rPage = pdfDoc.getPages()[pair.reviewPage];
    const tInfo = domainTasks[pair.weekIdx] || domainTasks[0];
    const dInfo = weekDates[pair.weekIdx];

    // On Task Page: Fill Task Title, Release Date, Submission Deadline, Estimated Effort
    // 1. Task Title
    tPage.drawRectangle({ x: 222, y: 691, width: 290, height: 16, color: white });
    tPage.drawText(tInfo.title.slice(0, 52), { x: 226, y: 694, size: 8.5, font: fontBold, color: textDark });

    // 2. Release Date
    tPage.drawRectangle({ x: 222, y: 665, width: 290, height: 16, color: white });
    tPage.drawText(dInfo.release, { x: 226, y: 668, size: 8.5, font: fontRegular, color: textDark });

    // 3. Submission Deadline
    tPage.drawRectangle({ x: 222, y: 639, width: 290, height: 16, color: white });
    tPage.drawText(`${dInfo.deadline}, 23:59 IST`, { x: 226, y: 642, size: 8.5, font: fontBold, color: textDark });

    // 4. Estimated Effort
    tPage.drawRectangle({ x: 222, y: 613, width: 290, height: 16, color: white });
    tPage.drawText(tInfo.effort || '6-8 hours', { x: 226, y: 616, size: 8.5, font: fontRegular, color: textDark });

    // 5. Prerequisites
    tPage.drawRectangle({ x: 222, y: 587, width: 290, height: 16, color: white });
    tPage.drawText((tInfo.prerequisites || 'Git, Dev Environment').slice(0, 55), { x: 226, y: 590, size: 8.5, font: fontRegular, color: textDark });

    // On Review Page: Fill Submission Portal URL
    // Table at top of review page has Submission Portal in row 1
    rPage.drawRectangle({ x: 222, y: 745, width: 290, height: 18, color: white });
    rPage.drawText(finalSubmissionUrl, {
      x: 226,
      y: 749,
      size: 8,
      font: fontBold,
      color: linkBlue
    });
  }

  // ==========================================
  // PAGE 10: CHECKLIST & AUTHORIZATION
  // ==========================================
  const page10 = pdfDoc.getPages()[9];
  page10.drawRectangle({ x: 310, y: 348, width: 210, height: 18, color: white });
  page10.drawText(`${studentName} • ${formattedJoiningDate}`, {
    x: 312,
    y: 352,
    size: 8.5,
    font: fontBold,
    color: textDark
  });

  const finalPdfBytes = await pdfDoc.save();
  return Buffer.from(finalPdfBytes);
}

function formatRelativeDate(baseDate, addDays) {
  const d = new Date(baseDate.getTime() + addDays * 86400000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
