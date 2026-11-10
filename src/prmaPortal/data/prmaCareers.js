// Official PRMA Tech Careers & Open Positions Data

export const PRMA_CAREER_CATEGORIES = [
  'All Roles',
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Operations'
];

export const PRMA_LOCATIONS = ['All Locations', 'Remote', 'Hybrid', 'On-site'];

export const PRMA_JOB_OPENINGS = [
  {
    id: 'prma-job-swe-intern',
    title: 'Software Developer Intern',
    category: 'Engineering',
    type: 'Internship',
    location: 'Remote',
    experience: 'Fresher / Student (UG / PG)',
    stipend: 'Performance-based + Certificate',
    duration: '3 - 6 Months',
    shortDesc: 'Build and ship real-world features for our consumer and enterprise SaaS products alongside senior engineers.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Git'],
    responsibilities: [
      'Develop modern responsive frontend interfaces in React and Next.js',
      'Build performant REST and WebSocket APIs in Node.js / Express',
      'Write clean, maintainable, and modular code with unit tests',
      'Collaborate with UI/UX designers and participate in daily standups'
    ],
    requirements: [
      'Solid understanding of JavaScript / TypeScript fundamentals',
      'Familiarity with React components, state management, and hooks',
      'Basic knowledge of databases (MongoDB or PostgreSQL)',
      'Hunger to learn and solve real-world technical problems'
    ],
    postedAt: 'Active Opening'
  },
  {
    id: 'prma-job-uiux-intern',
    title: 'UI/UX Design Intern',
    category: 'Design',
    type: 'Internship',
    location: 'Remote',
    experience: 'Fresher / Student',
    stipend: 'Performance-based + Certificate',
    duration: '3 - 6 Months',
    shortDesc: 'Design intuitive, modern and user-friendly web and mobile experiences for our platforms and client ecosystems.',
    skills: ['Figma', 'UI Design', 'Prototyping', 'User Research', 'Design Systems'],
    responsibilities: [
      'Create high-fidelity wireframes, mockups, and clickable prototypes in Figma',
      'Conduct user research and translate feedback into UX enhancements',
      'Maintain and expand PRMA Tech brand design system tokens',
      'Coordinate closely with frontend developers during handoff'
    ],
    requirements: [
      'Proficiency in Figma (Auto-layout, Components, Variants)',
      'Eye for modern SaaS aesthetics, typography, and color harmony',
      'Portfolio showcasing at least 2 web or mobile UI/UX projects',
      'Understanding of responsive design principles'
    ],
    postedAt: 'Active Opening'
  },
  {
    id: 'prma-job-aiml-intern',
    title: 'AI/ML Intern',
    category: 'Engineering',
    type: 'Internship',
    location: 'Remote',
    experience: 'Fresher / Student',
    stipend: 'Performance-based + Certificate',
    duration: '3 - 6 Months',
    shortDesc: 'Work on machine learning models, natural language processing, vector retrieval, and real-world AI applications.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'FastAPI', 'LLMs'],
    responsibilities: [
      'Cleanse, preprocess, and engineer features on tabular and image datasets',
      'Fine-tune open-source LLMs and implement RAG semantic search pipelines',
      'Evaluate model performance, loss metrics, and latency trade-offs',
      'Deploy inference microservices using FastAPI and Docker'
    ],
    requirements: [
      'Strong grasp of Python and scientific libraries (NumPy, Pandas, Scikit-Learn)',
      'Hands-on experience with PyTorch or TensorFlow',
      'Understanding of neural network architectures and transformer models',
      'Excitement for generative AI and LLM agents'
    ],
    postedAt: 'Active Opening'
  },
  {
    id: 'prma-job-cloud-devops',
    title: 'Cloud & DevOps Intern',
    category: 'Engineering',
    type: 'Internship',
    location: 'Remote',
    experience: 'Fresher / Student',
    stipend: 'Performance-based + Certificate',
    duration: '3 - 6 Months',
    shortDesc: 'Automate build pipelines, containerize microservices, monitor cloud infrastructure, and maintain zero-downtime uptime.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Linux', 'Terraform'],
    responsibilities: [
      'Create and maintain automated GitHub Actions CI/CD workflows',
      'Containerize backend services using Docker & multi-stage builds',
      'Set up monitoring dashboards with Prometheus, Grafana, and CloudWatch',
      'Assist in cloud resource provisioning and security hardening'
    ],
    requirements: [
      'Comfortable with Linux command line and shell scripting',
      'Understanding of Docker containers and networking fundamentals',
      'Basic familiarity with AWS services (EC2, S3, RDS, CloudFront)',
      'Passion for infrastructure automation'
    ],
    postedAt: 'Active Opening'
  },
  {
    id: 'prma-job-product-mgmt',
    title: 'Product Management Associate',
    category: 'Product',
    type: 'Full-time / Internship',
    location: 'Hybrid (Noida / Remote)',
    experience: '0 - 1 Years',
    stipend: 'Competitive + Equity Incentives',
    duration: 'Full-time',
    shortDesc: 'Drive product roadmaps from ideation to launch, define user stories, analyze student engagement metrics, and shape features.',
    skills: ['Product Strategy', 'Agile / Scrum', 'Jira', 'Data Analytics', 'User Stories'],
    responsibilities: [
      'Define product specifications, user stories, and acceptance criteria',
      'Analyze student telemetry and cohort metrics to inform priorities',
      'Coordinate sprint execution between engineering and design teams',
      'Conduct competitive analysis and user interviews'
    ],
    requirements: [
      'Strong analytical mindset and ability to communicate clearly',
      'Demonstrated interest in EdTech and developer tooling',
      'Experience managing student projects or hackathon products',
      'Data-driven decision making approach'
    ],
    postedAt: 'Active Opening'
  },
  {
    id: 'prma-job-marketing-lead',
    title: 'Developer Relations & Growth Lead',
    category: 'Marketing',
    type: 'Full-time / Internship',
    location: 'Remote',
    experience: '0 - 2 Years',
    stipend: 'Competitive + Performance Bonuses',
    duration: 'Full-time',
    shortDesc: 'Lead our campus ambassador chapters, organize college hackathons, author developer content, and grow our student developer community.',
    skills: ['Community Building', 'Technical Writing', 'Discord', 'Social Growth', 'Campus Outreach'],
    responsibilities: [
      'Scale PRMA Tech student campus ambassador network across universities',
      'Host tech webinars, AMAs, and coding hackathons on Discord & YouTube',
      'Author engaging technical blogs, guides, and project highlights',
      'Analyze growth funnels and student acquisition channels'
    ],
    requirements: [
      'Outstanding interpersonal and communication skills',
      'Active presence in student tech communities or university clubs',
      'Experience hosting online events or creating tech content',
      'Creative problem-solving enthusiasm'
    ],
    postedAt: 'Active Opening'
  }
];
