# ProfessorVirus (CampusPrep) — Comprehensive Academic & Career Platform

<p align="center">
  <strong>Curated Academic Archives, Verified AKTU PYQs, HOOLLOW AI Roadmap Generator, Resume Studio, and Interview Pro Simulation Suite</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AI%20Engine-Gemini%20%26%20OpenAI-4285F4?style=for-the-badge&logo=google" alt="AI Engine" />
  <img src="https://img.shields.io/badge/Production%20URL-professorvirus.site-8B101D?style=for-the-badge" alt="Live Website" />
</p>

---

## Overview

**ProfessorVirus** (repository: `CampusPrep`) is a full-featured, production-ready educational platform designed primarily for undergraduate engineering and professional degree students (AKTU B.Tech, BCA, MCA, MBA, and M.Pharm). 

The platform bridges university curriculum learning with career placement preparation by providing verified lecture notes, 10-year previous year question papers (PYQs), interactive quizzes, marksheet CGPA analyzers, ATS resume generation, a comprehensive AI recruitment interview simulator, and **HOOLLOW — an AI-Powered Learning Roadmap Generator**.

- **Live Production Website**: [https://www.professorvirus.site](https://www.professorvirus.site/)
- **GitHub Repository**: [https://github.com/priyanshukumar09546-cpu/CampusPrep](https://github.com/priyanshukumar09546-cpu/CampusPrep)

---

## Core Features & Academic Tools

### 1. HOOLLOW — AI Roadmap Generator
A dedicated, AI-driven learning roadmap engine designed to convert students' engineering and technology career goals into step-by-step master plans:
- **10 Core Goal Tracks & Custom Goals**:
  - Python Developer
  - Modern Full-Stack Web Development
  - AI/ML Engineer
  - Data Science & Analytics
  - Cyber Security & Ethical Hacking
  - App Development (Android/iOS)
  - Cloud Computing (AWS/Docker/K8s)
  - Data Structures & Algorithms (Placement Problem Solving)
  - DevOps & CI/CD
  - Custom Goal input for specialized tracks (e.g., Rust, Web3, Systems Engineering).
- **Personalized Pace Configuration**:
  - Current Experience Level: *Beginner*, *Intermediate*, *Advanced*.
  - Daily Study Commitment: *30 minutes*, *1 hour*, *2 hours*, *3+ hours*.
  - Timeline: *3 months*, *6 months*, *1 year*, *Flexible*.
  - Learning Style: *Video + Notes + Practice*, *Video Focused*, *Reading & Docs*, *Hands-on Projects*.
- **5-Phase Structured Learning Path**:
  - Phase 1: Foundation & Prerequisite Tooling
  - Phase 2: Core Concepts & Architectural Patterns
  - Phase 3: Real-World Hands-on Projects
  - Phase 4: Advanced Specialization & Optimization
  - Phase 5: Career Launch & Technical Interview Drills
- **Task-Level Curated Resources**:
  - Verified video lessons from top educators.
  - Official documentation, cheat-sheets, and syntax guides.
  - Interactive coding challenges (LeetCode, HackerRank, GitHub projects).
- **Interactive 60-Second Demo**:
  - Step-by-step visual demonstration with live 60-second countdown, play/pause controls, step stepper, and sample tour.
- **Gamification & Habit Building**:
  - Date-based daily learning streaks with flame indicators.
  - XP Points accumulation (+50 XP per completed task, anti-duplication safeguards).
  - Milestone achievement badges (*First Step*, *Consistent Coder*, *Phase Crusher*).
- **HOOLLOW AI Learning Mentor**:
  - Side-drawer Q&A mentor powered by Gemini and OpenAI providing real-time code examples, explanations, and interview tips.

### 2. AKTU 10-Year Previous Year Question Papers (PYQs)
- Complete, verified catalog of 5,508+ past university exam papers (2015–2025).
- Course streams: B.Tech (CSE, IT, ECE, EE, ME, Civil, Chemical, Biotech), BCA, MCA, MBA, and M.Pharm.
- In-site high-performance PDF viewer supporting full-screen reading, bookmarks, and direct downloads.
- Filterable by Course, Branch, Academic Year, and Semester.

### 3. Verified Handwritten Notes & Quantum Series
- Thousands of unit-wise lecture notes, Quantum reference booklets, and faculty-recommended study guides.
- Categorized by year, semester, and individual subject codes (e.g., BCS202, KCS301).
- Integrated search indexing with keyword suggestion pills.

### 4. Interview Pro — Campus Placement Simulation
An end-to-end multi-round interview simulator:
1. **Round 1: Aptitude Reasoning**: 35-minute timed quantitative aptitude, verbal ability, and logical reasoning assessment.
2. **Round 2: Technical Coding Challenge**: Live browser-based IDE powered by Monaco Editor with multi-language execution and test case verification.
3. **Round 3: AI Technical Interviewer**: Interactive voice-enabled technical interviewer evaluating core computer science fundamentals, projects, and architecture.
4. **Round 4: AI HR Behavioral Interview**: Situational, leadership, and STAR-method behavioral viva.
5. **Round 5: Comprehensive Performance Report**: Mathematical composite score, transcripts, strengths, weaknesses, and hiring recommendations.

### 5. ATS 1-Page LaTeX Resume Maker
- Real-time LaTeX compilation engine generating clean, single-page, ATS-compliant technical resumes.
- Tailored section builders: Education, Technical Skills, Projects, Experience, and Certifications.
- Live PDF preview and direct export.

### 6. Academic Productivity Suite
- **AKTU Result & SGPA Analyzer**: Automated marksheet parser calculating exact semester SGPA, cumulative CGPA, and tracking backlogs.
- **75% Attendance Calculator & Bunk Planner**: Computes mandatory class hours needed to meet 75% university eligibility criteria safely.
- **Weekly Timetable & Schedule Planner**: Dynamic college schedule organizer with class alerts.
- **Scholarships & Internships Portal**: Verified repository of government scholarships, hackathons, and corporate internships.
- **In-Browser PDF Studio**: Merge, split, convert, watermark, and organize assignments and lecture slides.
- **AI Plagiarism Checker**: Scans technical text and assignments for similarity and AI-generated phrasing.

---

## Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18.2 | Functional components, Hooks, Context API |
| **Build Tool** | Vite 5.4 | Ultra-fast HMR and Rollup production bundling |
| **Styling** | Vanilla CSS + Tailwind | Custom design tokens, glassmorphism, responsive grid |
| **Icons** | Lucide React | Clean, scalable SVG icons across desktop and mobile |
| **Editor** | Monaco Editor | VS Code-style browser code editor |
| **PDF Processing** | PDF-Lib & PDF-Parse | In-browser and server-side PDF manipulation |
| **Backend** | Node.js (v18+) & Express 5.2 | RESTful API routes, rate-limiting, secure headers |
| **Database** | MongoDB Atlas & Mongoose 9.10 | Cloud NoSQL persistence with disk-based offline fallback |
| **AI Integration** | Google Gemini & OpenAI | `@google/generative-ai` & `openai` with model failover |
| **Cloud Storage** | Google Drive API & CDN | Google Drive OAuth 2.0 integration for academic PDFs |

---

## Project Architecture

```
CampusPrep/
├── api/                              # Vercel serverless entrypoint
│   └── index.js                      # Serverless proxy to Express app
├── docs/                             # Documentation and screenshots
├── public/                           # Static assets, logos, and illustrations
│   └── assets/                       # Mascot images, logos, and icons
├── reports/                          # Audit matrix & migration verification reports
│   ├── AKTU_PYQ_10_YEAR_COVERAGE_MATRIX.csv
│   └── pyq_10_year_coverage_matrix.json
├── server/                           # Node.js Express backend application
│   ├── data/                         # Local JSON data stores & caches
│   ├── routes/                       # Express API routers
│   │   ├── attendanceRoutes.js       # Attendance calculation endpoints
│   │   ├── hoollowRoutes.js          # HOOLLOW AI Roadmap & Mentor router
│   │   ├── interviewRoutes.js        # Interview Pro simulation routes
│   │   ├── pdfRoutes.js              # PDF manipulation & OCR endpoints
│   │   ├── progressRoutes.js         # Student analytics & streak tracker
│   │   ├── quizRoutes.js             # Quiz engine endpoints
│   │   ├── resultRoutes.js           # Marksheet parsing endpoints
│   │   └── timetableRoutes.js        # Timetable schedule endpoints
│   ├── services/                     # AI interviewer & report engines
│   └── index.js                      # Main Express server configuration & mount point
├── src/                              # React frontend source code
│   ├── assets/                       # Local component graphic assets
│   ├── components/                   # Reusable UI components & modals
│   │   ├── HoollowDemoModal.jsx      # Interactive 60-second tour modal
│   │   ├── HoollowMentorDrawer.jsx   # AI Learning Mentor drawer
│   │   ├── HoollowTaskModal.jsx      # Task learning & completion modal
│   │   ├── Navbar.jsx                # Responsive header with HOOLLOW active pill
│   │   ├── MobileHeader.jsx          # Mobile view header
│   │   └── MobileBottomNav.jsx       # Bottom tab bar for smartphones
│   ├── config/                       # Centralized API endpoint configuration
│   ├── data/                         # Offline curriculum & syllabus catalog
│   │   ├── courseMapping.ts          # Course key normalization
│   │   └── hoollowCurriculum.js      # Curated 10-track roadmap presets
│   ├── pages/                        # Primary route pages
│   │   ├── HoollowPage.jsx           # HOOLLOW master landing & dashboard
│   │   ├── Home.jsx                  # Main academic landing page
│   │   ├── NotesPage.jsx             # Notes browsing and viewer
│   │   ├── PYQsPage.jsx              # AKTU 10-year PYQ browser
│   │   ├── InterviewProPage.jsx      # Interview simulation portal
│   │   ├── ResumeMakerPage.jsx       # ATS resume builder
│   │   ├── ResultCgpaPage.jsx        # Marksheet SGPA analyzer
│   │   └── MorePage.jsx              # All tools directory
│   ├── utils/                        # SEO manager & PWA helpers
│   ├── App.jsx                       # Master client-side routing & state
│   ├── index.css                     # Global theme tokens & animations
│   └── main.jsx                      # React application DOM root
├── package.json                      # Project dependencies & scripts
├── render.yaml                       # Render.com backend deployment configuration
├── vercel.json                       # Vercel serverless & SPA rewrite routing
└── vite.config.js                    # Vite bundler configuration
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **MongoDB Atlas** cluster URI (or runs in local disk fallback mode)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/priyanshukumar09546-cpu/CampusPrep.git
   cd CampusPrep
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root (reference `.env.example`):
   ```env
   # SERVER PORT & SECURITY
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:5173

   # MONGODB ATLAS CONNECTION URI
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ProfessorVirus

   # AI ENGINE CREDENTIALS (SERVER-SIDE ONLY)
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here

   # GOOGLE DRIVE OAUTH (OPTIONAL)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/google-drive/callback
   GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id
   ```

4. **Run in Development Mode**:
   Starts both the Node.js backend server and the Vite client simultaneously:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## Deployment Configuration

The repository is configured for modern continuous deployment:

- **Frontend & Edge Routing**: Hosted on **Vercel** connected to the `main` branch.
  - Rewrites all web traffic `/(.*)` to `index.html` for single-page client routing.
  - Rewrites `/api/(.*)` to `api/index.js` for serverless backend API execution.
  - Production Domain: [https://www.professorvirus.site](https://www.professorvirus.site)
- **Backend Services**: Can run serverless on Vercel or continuously on **Render** via `render.yaml`.
- **Database**: Cloud MongoDB Atlas with replica sets, SRV DNS resolution, and automatic connection retries.

---

## Security Practices

- **Zero Client-Side Secrets**: All API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `MONGODB_URI`, `JWT_SECRET`) reside strictly in server environment variables and are never bundled into the client build.
- **CORS Protection**: Access to API routes is constrained to authorized frontend domains.
- **Git Hygiene**: Environment files (`.env`, `.env.local`), database credentials, and build caches are excluded via `.gitignore`.

---

## License

This project is licensed under the MIT License. Developed with care for the engineering student community.
