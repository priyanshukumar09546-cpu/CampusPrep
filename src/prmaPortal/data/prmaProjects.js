// Official PRMA Tech Projects & Case Studies Showcase

export const PRMA_PROJECT_CATEGORIES = [
  'All Projects',
  'EdTech & AI',
  'Web & SaaS',
  'Mobile Apps',
  'Cloud & DevOps',
  'Machine Learning'
];

export const PRMA_PROJECTS = [
  {
    id: 'project-professorvirus',
    title: 'ProfessorVirus Academic Intelligence Platform',
    category: 'EdTech & AI',
    client: 'ProfessorVirus Education Ecosystem',
    duration: '6 Months',
    impact: '50,000+ Active Engineering Students',
    shortDesc: 'A university preparation platform featuring AI-powered marksheet analysis, deterministic CGPA audit, automated PYQ distribution, and interactive subject notes.',
    fullDesc: 'Engineered a high-performance web platform serving tens of thousands of engineering students across AKTU. Features include deterministic marksheet parsing, PDF syllabus proxy with byte-range caching, AI syllabus roadmaps (HOOLLOW AI), and unified college curriculum management.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Vite', 'Tailwind CSS'],
    liveUrl: 'https://professorvirus.site',
    metrics: [
      { label: 'Students Empowered', value: '50K+' },
      { label: 'Notes Views', value: '1M+' },
      { label: 'Uptime', value: '99.95%' }
    ],
    highlights: [
      'Multi-signal PDF parsing engine for AKTU university marksheets',
      'Automated syllabus delivery proxy protecting upstream servers from SSRF',
      'Unified search indexed across 200+ engineering subjects',
      'PWA offline caching for instant notes accessibility'
    ]
  },
  {
    id: 'project-interview-pro',
    title: 'CampusPrep AI Voice & Code Interview Pro',
    category: 'EdTech & AI',
    client: 'Internal Product Division',
    duration: '4 Months',
    impact: '10,000+ Mock Interviews Conducted',
    shortDesc: 'AI-driven mock interview simulator assessing technical, coding, and behavioral competence with real-time feedback reports.',
    fullDesc: 'A multi-stage technical interview simulator featuring realistic voice synthesis, browser-based proctoring, live in-browser Monaco code editor, and instant AI performance scorecards with detailed improvement rubrics.',
    tags: ['React', 'Web Speech API', 'Monaco Editor', 'OpenAI API', 'Node.js'],
    liveUrl: 'https://professorvirus.site/interview-pro',
    metrics: [
      { label: 'Interviews Taken', value: '10K+' },
      { label: 'Average Rating', value: '4.9/5' },
      { label: 'Question Bank', value: '500+' }
    ],
    highlights: [
      'Dynamic multi-round interview paths (Aptitude, Coding, Technical, HR)',
      'Real-time webcam anti-cheat proctoring & attention tracking',
      'Instant AI evaluation with radar chart competency analysis',
      'Downloadable PDF performance assessment reports'
    ]
  },
  {
    id: 'project-cloudmatrix-cicd',
    title: 'CloudMatrix Zero-Downtime Deployment Mesh',
    category: 'Cloud & DevOps',
    client: 'Enterprise Cloud Client',
    duration: '3 Months',
    impact: '4x Faster Deployment Velocity',
    shortDesc: 'Automated containerized deployment pipeline reducing build cycles from 45 minutes to 4 minutes with canary rollouts.',
    fullDesc: 'Designed and deployed an automated cloud pipeline using GitHub Actions, Docker multi-stage builds, and AWS ECS. Implemented blue/green zero-downtime releases and automated rollback triggers on error rate spikes.',
    tags: ['AWS ECS', 'Docker', 'Terraform', 'GitHub Actions', 'Prometheus'],
    liveUrl: '#',
    metrics: [
      { label: 'Deployment Time', value: '4 Min' },
      { label: 'Deployment Frequency', value: '15/Day' },
      { label: 'Downtime', value: '0.00%' }
    ],
    highlights: [
      'Infrastructure as Code (IaC) written entirely in Terraform',
      'Automated secret management with AWS KMS and Secrets Manager',
      'Centralized log aggregation with ElasticSearch and Kibana',
      'Slack bot webhooks reporting deployment health'
    ]
  },
  {
    id: 'project-visionguard',
    title: 'VisionGuard Industrial Anomaly Detection',
    category: 'Machine Learning',
    client: 'Manufacturing Partner',
    duration: '4 Months',
    impact: '98.4% Defect Detection Accuracy',
    shortDesc: 'Edge-computing computer vision pipeline for automated defect detection on factory assembly conveyor belts.',
    fullDesc: 'Trained and deployed lightweight YOLOv8 models on edge devices (NVIDIA Jetson) to classify surface scratches, solder voids, and component misalignment in real time with sub-30ms latency.',
    tags: ['Python', 'YOLOv8', 'PyTorch', 'OpenCV', 'CUDA', 'FastAPI'],
    liveUrl: '#',
    metrics: [
      { label: 'Inference Latency', value: '<28ms' },
      { label: 'Detection Accuracy', value: '98.4%' },
      { label: 'Inspection Speed', value: '60 FPS' }
    ],
    highlights: [
      'Custom dataset annotation of 12,000+ manufacturing defect samples',
      'TensorRT model quantization for 3x speedup on edge hardware',
      'Automated pneumatic reject-arm trigger via GPIO serial protocol',
      'Cloud telemetry dashboard syncing daily defect heatmaps'
    ]
  },
  {
    id: 'project-fintrack-saas',
    title: 'FinTrack Multi-Tenant Billing & Invoicing Engine',
    category: 'Web & SaaS',
    client: 'FinTech Startup',
    duration: '5 Months',
    impact: '₹1.5Cr+ Monthly Processed Volume',
    shortDesc: 'Multi-tenant subscription billing and automated GST invoicing system with Razorpay and Stripe dual-gateway failover.',
    fullDesc: 'A high-concurrency billing engine supporting subscription tiers, prorated upgrades, automated GST invoice PDF generation, and automatic retry webhooks for failed credit card charges.',
    tags: ['Next.js', 'PostgreSQL', 'Prisma', 'Razorpay API', 'Stripe', 'Redis'],
    liveUrl: '#',
    metrics: [
      { label: 'Monthly Volume', value: '₹1.5Cr+' },
      { label: 'Invoice Gen Speed', value: '<400ms' },
      { label: 'Failed Charge Recovery', value: '68%' }
    ],
    highlights: [
      'Role-based multi-tenant organization tenancy schema',
      'Automatic Indian GST tax calculation by state and HSN/SAC code',
      'Dynamic Razorpay & Stripe smart routing fallback',
      'Scheduled cron worker sending WhatsApp & email payment reminders'
    ]
  },
  {
    id: 'project-neuropulse',
    title: 'NeuroPulse Campus Retention & Attendance Predictor',
    category: 'EdTech & AI',
    client: 'Academic Consortia',
    duration: '3 Months',
    impact: '87% Risk Identification Rate',
    shortDesc: 'Machine learning classification engine identifying student academic distress and attendance drops 4 weeks before exams.',
    fullDesc: 'Analyzed historical attendance logs, internal sessional marks, and library portal usage patterns to identify at-risk students and prompt targeted mentor intervention and remedial sessions.',
    tags: ['Python', 'Scikit-Learn', 'FastAPI', 'Pandas', 'Plotly', 'PostgreSQL'],
    liveUrl: '#',
    metrics: [
      { label: 'Early Detection', value: '4 Wks Ahead' },
      { label: 'Retention Lift', value: '+14%' },
      { label: 'Precision', value: '91.2%' }
    ],
    highlights: [
      'Gradient Boosting classifier trained on 25,000+ student semester records',
      'SHAP value feature explainability explaining reasons for risk classification',
      'Automated alerts delivered to faculty proctors and academic deans',
      'Privacy-preserving anonymized student data handling'
    ]
  }
];
