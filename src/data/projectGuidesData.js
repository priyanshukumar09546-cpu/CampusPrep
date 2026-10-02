// src/data/projectGuidesData.js
// 6 Comprehensive, Real Guides for Engineering Final Year & Mini Projects

export const PROJECT_GUIDES = [
  {
    id: 'how-to-choose-project',
    slug: 'how-to-choose-a-final-year-project',
    title: 'How to Choose a Final Year Project',
    subtitle: 'Strategic guide to selecting an impressive, feasible, and placement-worthy engineering project.',
    readTime: '5 min read',
    icon: 'Compass',
    category: 'Planning & Strategy',
    summary: 'A step-by-step roadmap for choosing a project that balances academic rigor, placement interview impact, and technical feasibility.',
    sections: [
      {
        heading: '1. The 3-Pillar Framework',
        content: `When choosing your final year project, evaluate every idea across three crucial pillars:
1. **Placement Relevance**: Will this project impress interviewers at product companies (TCS Digital, Cognizant GenC Elevate, Infosys SP, Amazon, startups)? Interviewers love projects with clear architecture, API design, database schemas, and problem-solving.
2. **Technical Feasibility**: Can your team realistically finish this in 4-6 months with your current skills plus achievable learning? Avoid ideas requiring \$5,000 GPU clusters or custom silicon fabrication.
3. **University/AKTU Evaluation Criteria**: Does your department require a hardware component, research novel algorithm, or working web/mobile prototype? Always align with your department project coordinator's rubrics.`
      },
      {
        heading: '2. Domains with Highest Industry Demand (2025-2026)',
        content: `* **AI & Machine Learning / NLP**: LLM fine-tuning, RAG (Retrieval-Augmented Generation), specialized domain classifiers, and speech processing.
* **Computer Vision**: Automated inspection, biometric safety, edge video analytics with YOLOv8/v5.
* **Full-Stack Web (MERN / Next.js)**: Multi-tenant platforms, payment gateways, role-based workflows, microservices.
* **IoT & Embedded Systems**: ESP32, MQTT telemetry, sensor-cloud pipelines, smart energy/agriculture.
* **Cyber Security & Forensics**: Network packet analyzers, vulnerability auditing, automated threat triage.
* **Blockchain & Web3**: Supply chain authenticity, tamper-proof credential verification.`
      },
      {
        heading: '3. Red Flags to Avoid',
        content: `* **Generic Clones without Differentiation**: Pure copies of Netflix or Spotify without unique features fail to impress evaluators. Always add an original domain twist (e.g., student peer streaming with decentralized bandwidth optimization).
* **Pure Hardware without Software Integration**: Hardware projects lacking a cloud dashboard or API layer miss software engineering criteria.
* **Ideas without Public Datasets**: If your ML idea needs proprietary medical hospital scans you cannot legally access, choose a benchmark dataset (like PlantVillage or PhysioNet) instead.`
      },
      {
        heading: '4. Forming the Right Team',
        content: `Ideal team size for AKTU/B.Tech final year projects is 3 to 4 members:
* **Member 1 (Backend & Database)**: Architecture, APIs, security, database modeling.
* **Member 2 (Frontend / Mobile UI)**: User experience, state management, client performance.
* **Member 3 (Core Logic / AI / Hardware)**: Machine learning models, sensors, algorithm implementation.
* **Member 4 (Documentation & Testing)**: Synopsis, SRS, LaTeX report, test cases, and PPT presentation.`
      }
    ]
  },
  {
    id: 'how-to-write-synopsis',
    slug: 'how-to-write-a-project-synopsis',
    title: 'How to Write a Project Synopsis (AKTU Format)',
    subtitle: 'Standard university project proposal template with approval checklists and sample sections.',
    readTime: '7 min read',
    icon: 'FileText',
    category: 'Documentation',
    summary: 'Master the art of writing a clear 4-8 page project synopsis that gets instant approval from college departmental review committees.',
    sections: [
      {
        heading: '1. What is a Project Synopsis?',
        content: `A Project Synopsis is the formal proposal submitted at the start of the 7th or 8th semester to obtain official approval from the Departmental Project Committee. It demonstrates that the problem is well-defined, the methodology is sound, and the required resources are within reach.`
      },
      {
        heading: '2. Standard AKTU Synopsis Structure',
        content: `Your synopsis should be 4 to 8 pages typed in Times New Roman (12pt, 1.5 line spacing):
1. **Title Page**: Project title, student names, roll numbers, guide name, department, college logo, and academic year.
2. **Introduction & Motivation**: Brief context of the domain and why this problem matters today.
3. **Problem Statement**: Explicit definition of the gap or bottleneck your system solves.
4. **Literature Survey / Existing Systems**: Review of 3-5 existing research papers or products and their limitations.
5. **Proposed Methodology & Architecture**: High-level block diagram and technical approach.
6. **Hardware & Software Requirements**: Minimum OS, RAM, language versions, frameworks, and hardware modules.
7. **Expected Outcomes & Deliverables**: Working software, test metrics, and university documentation.
8. **Work Plan & Gantt Chart**: Month-by-month timeline across 8 semesters.
9. **References**: IEEE style citations.`
      },
      {
        heading: '3. Golden Rules for Instant Guide Approval',
        content: `* Make your Problem Statement specific: Instead of "A website for hospitals", write "An automated triage and outpatient appointment queuing system with real-time SMS token notifications".
* Include a neat System Architecture Diagram: A clear visual diagram speaks louder than 5 paragraphs of prose.
* Quantify your objectives: Specify target metrics (e.g., "Achieve >95% face recognition accuracy with latency under 200ms").`
      }
    ]
  },
  {
    id: 'how-to-prepare-viva',
    slug: 'how-to-prepare-for-project-viva-and-presentation',
    title: 'How to Prepare for Project Viva & Presentation',
    subtitle: 'Ace external university viva voce examinations with confidence and high scores.',
    readTime: '6 min read',
    icon: 'Award',
    category: 'Viva & Evaluation',
    summary: 'Key strategies, expected external examiner questions, and presentation techniques to score top marks in final year viva voce.',
    sections: [
      {
        heading: '1. What External Examiners Look For',
        content: `University external examiners evaluate projects on 4 core criteria:
1. **Individual Contribution**: Do you personally understand the code you wrote, or did only one team member do the work?
2. **System Understanding**: Can you trace data flow from the frontend user click down to database persistence?
3. **Handling Corner Cases**: What happens if the database connection drops or invalid input is supplied?
4. **Live Demonstration**: Does your project run reliably without crashing during the 5-minute live demo?`
      },
      {
        heading: '2. Top 10 Universal Viva Questions',
        content: `1. **Why did you choose this technology stack over alternatives?** (e.g., Why MongoDB instead of PostgreSQL? Why FastAPI instead of Flask?)
2. **What is the biggest technical limitation or bottleneck in your architecture?**
3. **How does your project handle security and authentication?** (JWT, Bcrypt, SQL injection mitigation)
4. **What algorithm did you implement from scratch? Explain its time and space complexity.**
5. **If 10,000 concurrent students access your project right now, where will it fail first?**
6. **Explain your database schema and normalization level (1NF, 2NF, 3NF).**
7. **What is the accuracy or performance metric of your model, and how was it validated?**
8. **What was the hardest bug you encountered and how did you resolve it?**
9. **How would you monetize or deploy this in a commercial production environment?**
10. **What are your planned future enhancements?**`
      },
      {
        heading: '3. The Perfect 10-Minute Presentation Structure',
        content: `* **Slide 1-2 (2 mins)**: Problem Statement & Real-World Motivation.
* **Slide 3-4 (2 mins)**: Existing Systems vs Your Proposed Solution.
* **Slide 5-6 (2 mins)**: System Architecture & Data Flow Diagram.
* **Slide 7-8 (3 mins)**: LIVE DEMO (Pre-seed test data and keep fallback demo video ready!).
* **Slide 9-10 (1 min)**: Performance Results, Conclusion & Future Scope.`
      }
    ]
  },
  {
    id: 'github-team-setup',
    slug: 'setting-up-github-and-git-for-team-projects',
    title: 'Setting Up GitHub & Git for Team Projects',
    subtitle: 'Professional branch workflows, merge conflict resolution, and pull request hygiene for engineering teams.',
    readTime: '8 min read',
    icon: 'GitBranch',
    category: 'Development Tools',
    summary: 'Best practices for organizing collaborative Git repositories, branch protection rules, and writing clean commit histories.',
    sections: [
      {
        heading: '1. Why Git Cleanliness Matters in College',
        content: `Examiners and recruiters immediately inspect your GitHub commit graph. A repo with 1 commit saying "final code upload" looks copied. A repo with 50+ meaningful pull requests and commits from all team members across 4 months proves authentic collaborative engineering.`
      },
      {
        heading: '2. The Git Feature-Branch Workflow',
        content: `Never commit directly to the \`main\` branch. Follow this standard workflow:
1. \`main\`: Always contains stable, production-ready, demo-tested code.
2. \`develop\`: Staging branch where features are integrated.
3. \`feature/feature-name\`: Individual branches created for each task (e.g., \`feature/user-auth\`, \`feature/yolo-detector\`).

Commands:
\`\`\`bash
git checkout -b feature/attendance-api
# Make your code changes
git add .
git commit -m "feat(api): add attendance CSV export endpoint"
git push origin feature/attendance-api
\`\`\`
Then open a Pull Request (PR) on GitHub and have a teammate review it before merging.`
      },
      {
        heading: '3. Essential .gitignore File',
        content: `Always commit a proper \`.gitignore\` to prevent cluttering your repository with secrets and temporary files:
* \`node_modules/\` (never commit dependencies)
* \`venv/\`, \`__pycache__/\`, \`*.pyc\`
* \`.env\`, \`config.secrets.json\` (never commit API keys or passwords!)
* \`*.dat\`, \`*.h5\` model files exceeding 100MB (use Git LFS or external cloud links instead).`
      }
    ]
  },
  {
    id: 'free-project-deployment',
    slug: 'how-to-deploy-your-project-for-free',
    title: 'How to Deploy Your Project for Free',
    subtitle: 'Host your full-stack web, AI, and mobile APIs for zero cost using Vercel, Render, and MongoDB Atlas.',
    readTime: '6 min read',
    icon: 'Cloud',
    category: 'Cloud & Hosting',
    summary: 'Comprehensive guide to deploying web applications and APIs for free so external examiners can test your project on their own smartphones.',
    sections: [
      {
        heading: '1. The Free Cloud Hosting Stack (2025-2026)',
        content: `You do not need an expensive AWS credit card to deploy your college project. Use this verified 100% free stack:
* **Frontend (React / Next.js / Vue)**: **Vercel** or **Netlify** (Free custom domain, SSL, instant Git deployments).
* **Backend (Node.js / Express / Python / Flask / FastAPI)**: **Render.com** (Free Web Services tier) or **Railway** / **Koyeb**.
* **Database (MongoDB)**: **MongoDB Atlas M0 Free Tier** (512MB free forever storage with replica set reliability).
* **Database (PostgreSQL / MySQL)**: **Neon.tech** or **Supabase** (Free cloud PostgreSQL instances).
* **Static Asset & PDF Storage**: **Cloudinary** or **Supabase Storage** (Free generous file hosting).`
      },
      {
        heading: '2. Step-by-Step Backend Deployment on Render',
        content: `1. Push your backend code to GitHub.
2. Sign in to [Render.com](https://render.com) using your GitHub account.
3. Click **New +** -> **Web Service** and select your repository.
4. Set Build Command: \`npm install\` (or \`pip install -r requirements.txt\`).
5. Set Start Command: \`node server.js\` (or \`uvicorn main:app --host 0.0.0.0 --port 10000\`).
6. Add Environment Variables: Enter \`MONGODB_URI\`, \`JWT_SECRET\`, and \`PORT=10000\`.
7. Click **Deploy Web Service**. You receive a live HTTPS URL in under 2 minutes!`
      },
      {
        heading: '3. Generating a Mobile QR Code for Evaluators',
        content: `Generate a neat QR code of your live deployed URL (e.g., using qr-code-generator.com) and paste it on Slide 1 of your PPT and the cover page of your report. Inviting examiners to scan the QR code and test the app on their phone creates an immediate 10/10 impression.`
      }
    ]
  },
  {
    id: 'software-engineering-docs',
    slug: 'software-engineering-documentation-srs-uml-dfd',
    title: 'Software Engineering Documentation (SRS, UML, DFD)',
    subtitle: 'Complete guide to IEEE-830 Software Requirement Specifications, Class Diagrams, and Data Flow Diagrams.',
    readTime: '10 min read',
    icon: 'Layers',
    category: 'Documentation',
    summary: 'Produce professional UML diagrams, Data Flow Diagrams (Level 0, 1, 2), and IEEE-compliant SRS reports for high viva scores.',
    sections: [
      {
        heading: '1. The IEEE-830 SRS Standard Format',
        content: `Your Software Requirement Specification (SRS) is the formal engineering contract describing what your system does:
1. **Section 1: Introduction**: Purpose, Scope, Definitions, References.
2. **Section 2: Overall Description**: Product Perspective, User Classes, Operating Environment, Design Constraints.
3. **Section 3: System Features & Functional Requirements**: Explicit requirements labeled (FR-1, FR-2, etc.).
4. **Section 4: Non-Functional Requirements**: Performance, Security, Reliability, Availability, Maintainability.
5. **Section 5: External Interface Requirements**: User Interfaces, Hardware Interfaces, Software Interfaces, Communication Protocols.`
      },
      {
        heading: '2. Mandatory UML Diagrams for Engineering Students',
        content: `* **Use Case Diagram**: Depicts primary actors (Student, Faculty, Admin, Payment Gateway) and interactions.
* **Class Diagram**: Shows object-oriented classes, attributes, methods, and relationships (inheritance, aggregation, association).
* **Sequence Diagram**: Captures chronological order of messages exchanged between objects during key workflows (e.g., User Login, Checkout, Attendance Scan).
* **Activity Diagram**: Represents operational step-by-step workflow with decision branches (similar to an advanced flowchart).`
      },
      {
        heading: '3. Data Flow Diagrams (DFD) Explained',
        content: `* **DFD Level 0 (Context Level)**: Single bubble representing the entire system with external entities sending inputs and receiving outputs.
* **DFD Level 1**: Decomposes the single bubble into major sub-processes (e.g., Authentication, Detection, Report Generation, Database Storage).
* **DFD Level 2**: Drills down into complex sub-processes with detailed data stores and intermediate data flows.
* *Recommended Free Diagramming Tools*: Draw.io (diagrams.net), PlantUML, Mermaid.js.`
      }
    ]
  }
];
