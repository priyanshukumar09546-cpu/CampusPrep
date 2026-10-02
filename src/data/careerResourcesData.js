// src/data/careerResourcesData.js

export const careerResourcesData = [
  {
    id: 'resume-building-guide',
    title: 'Resume Building Guide',
    subtitle: 'Step-by-step framework to create a 1-page ATS-compliant engineering resume',
    readTime: '6 min read',
    icon: 'FileText',
    category: 'Documentation',
    summary: 'Master the exact anatomy of a high-converting engineering fresher resume that beats ATS parsers and catches recruiters attention in under 7 seconds.',
    sections: [
      {
        title: '1. The Golden 1-Page Rule for Undergraduates',
        content: `Never exceed 1 single page if you have less than 3 years of full-time industry experience. Campus recruiters and automated ATS screeners spend an average of 6-8 seconds on initial scans. A multi-page resume indicates inability to prioritize impactful accomplishments.
        
Key structural order:
• Header: Full Name, Clean Email, Phone Number, City/State, LinkedIn URL, GitHub URL, and Portfolio (No full address, photo, or marital status).
• Education: Degree (e.g. B.Tech in CSE), University/College, Graduation Year, CGPA (Include if > 7.0; otherwise state aggregate %).
• Technical Skills: Categorized into Languages, Frameworks/Libraries, Developer Tools, Databases, and Core CS Concepts.
• Projects (Crucial): 2-3 substantial projects with live demo and GitHub repository links.
• Experience / Internships: If any; otherwise replace with Open Source contributions or Hackathons.
• Achievements & Certifications: Competitive programming ratings (LeetCode, Codeforces), hackathon wins, published papers.`
      },
      {
        title: '2. The XYZ Impact Bullet Formula',
        content: `Every project and experience bullet point must follow Googles formula:
"Accomplished [X], as measured by [Y], by doing [Z]"

Weak bullet:
"Worked on a face recognition attendance app using Python."

Strong ATS bullet:
"Architected an automated face recognition attendance system using OpenCV and Python, achieving 98.4% detection accuracy across 120+ student test frames and reducing daily roll-call latency by 85%."

Always include:
• Action verbs (Architected, Engineered, Optimized, Implemented, Deployed)
• Concrete metrics (Percentage improvements, latency drop, requests/sec, user count)
• Exact tools & frameworks utilized in context`
      },
      {
        title: '3. Technical Skills Section Formatting',
        content: `Avoid arbitrary skill progress bars (e.g., "Python: 80%"). Recruiters find percentage bars meaningless. Group skills cleanly:

• Languages: C++, Python, JavaScript (ES6+), SQL, Java
• Web Technologies: React.js, Node.js, Express, Tailwind CSS, REST APIs
• Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Docker
• Developer Tools: Git, GitHub Actions, Postman, Linux (Ubuntu/Debian)
• Core Concepts: Data Structures & Algorithms, Object-Oriented Design, Operating Systems, DBMS`
      }
    ],
    checklist: [
      'Exported strictly as a searchable text PDF (not an image scan)',
      'Standard 0.5 to 0.75-inch margins and clean single-column layout',
      'Consistent date formats (e.g., "Aug 2024 – Present")',
      'Zero spelling errors in technical keywords (e.g., "JavaScript", "PostgreSQL")',
      'All hyperlinks (GitHub, LinkedIn, live demo) are clickable and verified'
    ]
  },

  {
    id: 'interview-prep-tips',
    title: 'Interview Preparation Tips',
    subtitle: 'Proven roadmap for cracking Technical & HR interview rounds',
    readTime: '7 min read',
    icon: 'Users',
    category: 'Interview Strategy',
    summary: 'A structured blueprint for acing technical coding rounds, live system discussions, and behavioral HR questions with confidence.',
    sections: [
      {
        title: '1. The 4-Step Technical Problem-Solving Protocol',
        content: `When presented with a coding problem in a live technical interview:

Step 1 — Clarify Requirements (2-3 mins):
Never start writing code immediately. Ask about edge cases:
• "Can input array contain negative numbers or duplicates?"
• "What are the constraints on N (10^4 or 10^9)?"
• "How should null or empty inputs be handled?"

Step 2 — Propose Brute-Force & Analyze Complexity (3-4 mins):
Explain the naive approach first: "A naive nested loop takes O(N^2) time and O(1) space." This guarantees you have a baseline solution before exploring optimizations.

Step 3 — Optimize using Data Structures (5 mins):
"We can trade space for time using a Hash Map to reduce lookup from O(N) to O(1), achieving O(N) overall time complexity."

Step 4 — Clean Implementation & Dry Run (15-20 mins):
Write modular, syntactically clean code with descriptive variable names. Manually trace the code with a small sample input before telling the interviewer you are done.`
      },
      {
        title: '2. The STAR Framework for Behavioral & HR Rounds',
        content: `For questions like "Tell me about a time you faced a technical conflict or failure":

• Situation: Set the context briefly (project name, team size, deadline).
• Task: Identify the specific obstacle or objective you had to solve.
• Action: Explain the concrete steps YOU took (not just the team). Detail tools, debugging strategies, and communication.
• Result: Quantifiable outcome, lesson learned, and how it improved the final deliverable.

Example: "During our 36-hour hackathon, our database connection crashed at 3 AM due to connection pool saturation. I profiled the query logs, identified unindexed queries, added compound indexing, and reduced connection pool wait times by 70%, allowing us to demo smoothly to the jury."`
      },
      {
        title: '3. Reverse-Engineering "Do You Have Any Questions for Us?"',
        content: `Never say "No, I am good." Use this moment to demonstrate genuine curiosity and culture fit:
• "What does the typical deployment pipeline and engineering review cycle look like for an entry-level engineer on your team?"
• "What is one technical challenge your engineering team recently solved that you are most proud of?"
• "How does the engineering department support continuous upskilling and certification?"`
      }
    ],
    checklist: [
      'Mastered top 100 Blind 75 / NeetCode DSA patterns',
      'Prepared 3 concise STAR stories for behavioral questions',
      'Have working microphone, stable internet, and clean quiet background',
      'Can clearly articulate your role and architectural decisions in every project on your resume'
    ]
  },

  {
    id: 'how-to-find-internships',
    title: 'How to Find Internships',
    subtitle: 'Tactical guide to landing high-quality off-campus tech internships',
    readTime: '5 min read',
    icon: 'Search',
    category: 'Job Search',
    summary: 'Stop blindly applying on generic job boards. Learn cold outreach, referral networking, open-source programs, and company talent pools.',
    sections: [
      {
        title: '1. The 3 Most Effective Application Channels',
        content: `1. Direct Employee Referrals:
Applying through a current employee referral yields 10x higher interview callback rates compared to public career page cold applications. Connect with college alumni on LinkedIn who graduated 1-3 years ago.

2. Open Source & Hackathons:
Programs like Google Summer of Code (GSoC), LFX Mentorship, Major League Hacking (MLH), and national hackathons (Smart India Hackathon) provide direct pipelines to paid internships and full-time hiring.

3. Government & Verified Portals:
AICTE Internship Portal, National Career Service (NCS), and official early-career portals of major Indian IT companies (TCS NextStep, Infosys Springboard, Wipro Elite) regularly recruit off-campus freshers.`
      },
      {
        title: '2. Crafting High-Response LinkedIn Outreach',
        content: `When reaching out to alumni or tech leads for referrals, avoid sending just "Hi sir, please refer me."

Template:
"Hi [Name],
I noticed your engineering journey from [College/Region] to [Company] — inspiring work on [Specific Team/Product]!

I am a final-year B.Tech CSE student proficient in React, Node.js, and PostgreSQL. I recently built [Project Name with live link], which handles [1-line impact metric].

I noticed an active opening for [Job Title / Job ID: XXXX] at [Company]. Given my background in [Skill], I would be deeply grateful if you could consider reviewing my 1-page resume for a referral.

Resume link: [Clean Google Drive link with public view permission]
Thank you for your time!
[Your Name]"`
      }
    ],
    checklist: [
      'LinkedIn profile updated with customized URL, banner, and featured project links',
      'Active GitHub profile showing regular green commit history and documented READMEs',
      'List of 20 target companies with direct links to their official career portals bookmarked',
      'Reached out to 5-10 alumni per week with customized notes'
    ]
  },

  {
    id: 'placement-prep-guide',
    title: 'How to Prepare for Placements',
    subtitle: 'Complete 6-month timeline for college campus recruitment drives',
    readTime: '8 min read',
    icon: 'Award',
    category: 'Campus Placements',
    summary: 'A chronological timeline and syllabus covering Aptitude, Core CS Subjects, Data Structures, and Mock Interviews for AKTU and engineering colleges.',
    sections: [
      {
        title: '1. Month 1-2: Aptitude & Core Foundation',
        content: `Most companies (TCS, Infosys, Wipro, Cognizant, Accenture, Capgemini) use an initial aptitude and reasoning test as an elimination round.

Key topics to master:
• Quantitative Aptitude: Time & Work, Speed Time Distance, Percentages, Profit & Loss, Ratio & Proportion, Permutations & Combinations, Probability.
• Logical Reasoning: Blood Relations, Coding-Decoding, Syllogisms, Seating Arrangements, Data Sufficiency.
• Verbal Ability: Reading Comprehension, Sentence Correction, Synonyms/Antonyms, Para Jumbles.

Dedicate 1 hour daily to practice timed aptitude tests on platforms like IndiaBIX or GeeksforGeeks.`
      },
      {
        title: '2. Month 3-4: Core Computer Science Fundamentals',
        content: `Technical rounds heavily test theoretical concepts. Prepare crisp 2-minute explanations for:

• DBMS: Normalization (1NF to BCNF), ACID properties, SQL Joins vs Subqueries, Indexing (B-Trees), Transactions and Deadlocks.
• Operating Systems: Process vs Thread, Process Scheduling algorithms, Virtual Memory and Paging, Semaphore vs Mutex, Deadlock conditions.
• Computer Networks: OSI vs TCP/IP layers, Three-way handshake, DNS resolution process, HTTP vs HTTPS (SSL/TLS), TCP vs UDP.
• Object-Oriented Programming (OOP): Encapsulation, Abstraction, Polymorphism (Compile-time vs Run-time), Inheritance, SOLID principles.`
      },
      {
        title: '3. Month 5-6: Data Structures & Live Mocks',
        content: `Focus on problem-solving patterns rather than memorizing individual questions:
• Arrays & Strings: Two Pointers, Sliding Window, Prefix Sums
• Linked Lists: Fast & Slow Pointers, Reversal, Cycle Detection
• Trees & Graphs: BFS, DFS, Binary Search Tree properties, Dijkstra
• Dynamic Programming: 0/1 Knapsack, Longest Common Subsequence, Climbing Stairs

Conduct mock peer interviews once a week to practice verbalizing your thought process under time pressure.`
      }
    ],
    checklist: [
      'Achieved consistent 80%+ scores on timed aptitude mock tests',
      'Compiled personal revision notes for DBMS, OS, CN, and OOP',
      'Solved at least 150-200 curated DSA problems across common patterns',
      'Participated in at least 3 live mock interviews with constructive feedback'
    ]
  },

  {
    id: 'career-growth-roadmap',
    title: 'Career Growth Roadmap',
    subtitle: 'From Junior Engineer to Senior Tech Specialist in 3-5 years',
    readTime: '6 min read',
    icon: 'TrendingUp',
    category: 'Career Progression',
    summary: 'Understand the industry expectations at each engineering level and how to accelerate your transition from fresher to tech lead.',
    sections: [
      {
        title: '1. Junior Engineer / Fresher (Years 0-2)',
        content: `Focus: Execution, Code Quality, and Speed.
• Learn the team code style, Git workflow, and continuous integration pipeline.
• Deliver assigned tasks on time with comprehensive unit tests and zero preventable bugs.
• Seek feedback actively during code reviews and learn from senior engineers critique.
• Become self-sufficient in local environment setup and basic debugging.`
      },
      {
        title: '2. Mid-Level Software Engineer (Years 2-4)',
        content: `Focus: Ownership, System Architecture, and Cross-Team Collaboration.
• Own features end-to-end from technical design document to production rollout and telemetry monitoring.
• Design scalable database schemas and write resilient API contracts.
• Mentor junior engineers and conduct constructive peer code reviews.
• Proactively identify technical debt and suggest performance optimizations.`
      },
      {
        title: '3. Senior Engineer / Tech Lead (Years 4+)',
        content: `Focus: High-Level Architecture, Mentorship, and Business Impact.
• Make major architectural technology choices (microservices, event-driven streaming, database selection).
• Anticipate scalability bottlenecks 12-18 months in advance.
• Align engineering roadmaps with business revenue and customer retention goals.
• Foster a culture of engineering excellence, security compliance, and continuous innovation.`
      }
    ],
    checklist: [
      'Read seminal engineering books ("Clean Code", "Designing Data-Intensive Applications")',
      'Actively track system metrics and production logs for features you deploy',
      'Contribute to technical design discussions and architecture RFCs',
      'Maintain an active learning habit in cloud infrastructure and distributed systems'
    ]
  },

  {
    id: 'top-companies-for-freshers',
    title: 'Top Companies for Freshers',
    subtitle: 'Comprehensive breakdown of eligibility, hiring tracks, and compensation bands',
    readTime: '7 min read',
    icon: 'Briefcase',
    category: 'Industry Guide',
    summary: 'A clear overview of service-based vs product-based hiring patterns in India, eligibility requirements, and recruitment seasons.',
    sections: [
      {
        title: '1. Tier-1 Product Companies (FAANG / Big Tech)',
        content: `Companies: Google, Microsoft, Amazon, Adobe, Oracle, Cisco, Atlassian, Salesforce.
• Hiring Model: Off-campus career portals, competitive coding hackathons (GSoC, Flipkart GRiD, Code360), employee referrals.
• Eligibility: B.Tech / MCA with high problem-solving proficiency; no strict percentage cutoff once referral is secured.
• Compensation: ₹14 - ₹45+ LPA CTC (including base, stock grants, and joining bonuses).
• Evaluation: 3-4 Rounds of Data Structures & Algorithms, System Design fundamentals, and Cultural Alignment.`
      },
      {
        title: '2. Premium IT & Digital Engineering Firms',
        content: `Companies: TCS Digital/Prime, Infosys Specialist Programmer (SP/DSE), Wipro Turbo, Cognizant GenC Next, Persistent Systems, L&T Technology Services.
• Hiring Model: National level exams (TCS NQT, Infosys HackWithInfy / InfyTQ, Wipro Elite NTH).
• Eligibility: B.Tech / MCA with minimum 60% or 6.5 CGPA throughout 10th, 12th, and college.
• Compensation: ₹6.5 - ₹12 LPA.
• Evaluation: Advanced DSA coding round, OOP design, and project architectural deep-dive.`
      },
      {
        title: '3. Mass Campus Recruitment & Foundation IT Tracks',
        content: `Companies: TCS Ninja, Infosys System Engineer, Wipro Elite, Cognizant GenC, Accenture ASE, HCLTech First Careers.
• Hiring Model: Large-scale on-campus drives and centralized national qualifier exams.
• Eligibility: All engineering branches (CSE, IT, ECE, EE, ME, CE), minimum 60% with up to 1 active backlog permitted in select drives.
• Compensation: ₹3.36 - ₹4.5 LPA.
• Evaluation: Online Aptitude + Verbal + Reasoning test followed by basic Technical & HR interview.`
      }
    ],
    checklist: [
      'Identified top 5 dream product companies and top 5 reliable core companies',
      'Registered on official career portals (TCS NextStep, Infosys Springboard, Amazon Jobs)',
      'Verified academic transcript marks meet the standard 60% baseline across 10th, 12th, and college',
      'Prepared tailored resumes highlighting role-specific strengths for each category'
    ]
  }
];
