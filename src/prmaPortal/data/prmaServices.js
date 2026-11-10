// 12 Official PRMA Tech Services configured from Image 3 ("Our Services")

export const PRMA_SERVICES = [
  {
    id: 'web-development',
    title: 'Website Development',
    shortDesc: 'Modern, responsive and high-performance websites.',
    fullDesc: 'We architect modern web applications with cutting-edge frontends, scalable APIs, and search engine optimization. Built for blazing speed, mobile ergonomics, and seamless user conversion.',
    icon: 'Monitor',
    color: '#0866F5',
    bgLight: '#EFF6FF',
    badge: 'Popular',
    technologies: ['React.js', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Vercel / AWS'],
    capabilities: [
      'Full-stack responsive web apps',
      'E-commerce & payment gateway integration',
      'Server-side rendering & technical SEO',
      'Interactive dashboards & administration portals',
      'API design & microservices orchestration'
    ],
    deliverables: [
      'Production-ready deployed web app',
      'Fully documented GitHub codebase',
      'Automated CI/CD pipelines',
      'SEO audit report & 90+ Lighthouse score',
      '30-day post-launch maintenance & warranty'
    ],
    typicalTimeline: '2 - 6 Weeks'
  },
  {
    id: 'app-development',
    title: 'App Development',
    shortDesc: 'Android, iOS and cross-platform mobile apps.',
    fullDesc: 'Native and hybrid mobile applications designed to delight users on iOS and Android. From intuitive UI interactions to offline-first local databases and background sync.',
    icon: 'Smartphone',
    color: '#7025E8',
    bgLight: '#F5F3FF',
    badge: 'Core Track',
    technologies: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Firebase', 'Supabase'],
    capabilities: [
      'Cross-platform iOS & Android mobile development',
      'Real-time push notifications & background sync',
      'Offline data caching & encryption',
      'Biometric authentication & hardware access',
      'Play Store & App Store deployment compliance'
    ],
    deliverables: [
      'Production signed APK & iOS builds',
      'Full source code repository',
      'App Store & Play Store publishing support',
      'Crashlytics & analytics integration',
      'Comprehensive QA test matrix report'
    ],
    typicalTimeline: '4 - 8 Weeks'
  },
  {
    id: 'ai-ml',
    title: 'AI/ML Solutions',
    shortDesc: 'Custom AI models, automation and intelligent applications.',
    fullDesc: 'Harness the power of machine learning, natural language processing, computer vision, and generative AI to automate workflows and discover intelligent patterns.',
    icon: 'Cpu',
    color: '#F59E0B',
    bgLight: '#FFFBEB',
    badge: 'High Demand',
    technologies: ['Python', 'PyTorch', 'TensorFlow', 'OpenAI / Anthropic APIs', 'HuggingFace', 'FastAPI'],
    capabilities: [
      'Fine-tuned LLM assistants & autonomous agents',
      'Retrieval-Augmented Generation (RAG) knowledge bases',
      'Computer vision & object detection models',
      'Predictive analytics & recommendation engines',
      'High-throughput model serving & quantization'
    ],
    deliverables: [
      'Trained model weights & evaluation reports',
      'Containerized REST/gRPC inference endpoint',
      'RAG pipeline with vector database indexing',
      'Benchmarking & latency optimization report',
      'API client SDKs in Python & JavaScript'
    ],
    typicalTimeline: '3 - 8 Weeks'
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    shortDesc: 'Scalable, secure and cost-efficient cloud solutions.',
    fullDesc: 'Modernize infrastructure with automated CI/CD pipelines, container orchestration, Kubernetes, infrastructure-as-code, and cloud security compliance.',
    icon: 'Cloud',
    color: '#0866F5',
    bgLight: '#EFF6FF',
    badge: 'Enterprise',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus'],
    capabilities: [
      'Zero-downtime CI/CD deployment pipelines',
      'Kubernetes cluster setup & load balancing',
      'Terraform Infrastructure as Code (IaC)',
      'Automated disaster recovery & daily backups',
      'Cloud cost audit & resource optimization'
    ],
    deliverables: [
      'Terraform IaC scripts & templates',
      'Configured GitHub Actions CI/CD workflows',
      'Grafana / Prometheus monitoring dashboards',
      'Cloud security hardening audit certificate',
      'Architecture diagrams & handover documentation'
    ],
    typicalTimeline: '2 - 4 Weeks'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Solutions',
    shortDesc: 'Security, vulnerability testing and threat protection.',
    fullDesc: 'Protect your enterprise assets with penetration testing, OWASP compliance audits, secure authentication architecture, and 24/7 security monitoring.',
    icon: 'ShieldCheck',
    color: '#EF4444',
    bgLight: '#FEF2F2',
    badge: 'Security',
    technologies: ['Burp Suite', 'OWASP ZAP', 'Wireshark', 'Metasploit', 'Snort', 'Vault'],
    capabilities: [
      'Web application & API vulnerability assessment',
      'Network penetration testing & threat simulation',
      'OWASP Top 10 compliance & code review',
      'SSL/TLS certificate automation & secrets management',
      'Security incident response planning'
    ],
    deliverables: [
      'Comprehensive vulnerability assessment report',
      'Executive summary & severity matrix (CVSS)',
      'Remediation guide & developer code patches',
      'Re-testing verification sign-off',
      'Security clearance certificate'
    ],
    typicalTimeline: '2 - 5 Weeks'
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    shortDesc: 'Data analysis, visualization and building data-driven solutions.',
    fullDesc: 'Transform unstructured business data into executive dashboards, statistical models, customer segmentations, and predictive revenue forecasts.',
    icon: 'BarChart3',
    color: '#079B45',
    bgLight: '#F0FDF4',
    badge: 'Analytics',
    technologies: ['Power BI', 'SQL', 'Python (Pandas, Scikit)', 'Tableau', 'BigQuery', 'Apache Spark'],
    capabilities: [
      'ETL data pipelines & warehouse modeling',
      'Interactive executive dashboards (Power BI / Tableau)',
      'Customer churn & lifetime value prediction',
      'A/B testing analysis & statistical modeling',
      'Automated weekly email summary reports'
    ],
    deliverables: [
      'Live interactive analytics dashboard',
      'Automated daily ETL data sync pipelines',
      'Predictive model notebooks & code',
      'Executive insight presentation deck',
      'Data dictionary & schema documentation'
    ],
    typicalTimeline: '2 - 6 Weeks'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    shortDesc: 'User-centered, modern and engaging product designs.',
    fullDesc: 'Craft intuitive user interfaces, cohesive design systems, and wireframes that captivate users and streamline complex technical workflows.',
    icon: 'Palette',
    color: '#7025E8',
    bgLight: '#F5F3FF',
    badge: 'Creative',
    technologies: ['Figma', 'FigJam', 'Adobe Creative Suite', 'Principle', 'Design Tokens'],
    capabilities: [
      'User research, personas & user journey mapping',
      'Wireframing & interactive clickable prototypes',
      'Complete component design system in Figma',
      'Mobile app (iOS / Android) UI screen design',
      'Accessibility (WCAG 2.1) audit & compliance'
    ],
    deliverables: [
      'Full Figma project with auto-layout components',
      'Interactive clickable mobile & web prototypes',
      'Design token export (CSS/Tailwind ready)',
      'Asset export package (SVG, PNG, Icons)',
      'Developer handoff documentation'
    ],
    typicalTimeline: '2 - 4 Weeks'
  },
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    shortDesc: 'Tailored software solutions for your unique business needs.',
    fullDesc: 'Bespoke software built from the ground up for your specific business requirements. ERP systems, CRM integrations, and automated back-office utilities.',
    icon: 'Code2',
    color: '#0866F5',
    bgLight: '#EFF6FF',
    badge: 'Tailored',
    technologies: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
    capabilities: [
      'Custom ERP & CRM workflow automation',
      'Legacy software migration & API modernization',
      'Multi-tenant SaaS architecture design',
      'Third-party software integration & webhooks',
      'High-concurrency database architecture'
    ],
    deliverables: [
      'Modular custom software application',
      'Complete backend API documentation (Swagger)',
      'Database migration scripts & seeders',
      'User role-based access control (RBAC)',
      'Admin guide & video training walkthrough'
    ],
    typicalTimeline: '4 - 12 Weeks'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    shortDesc: 'SEO, social media, ads and performance marketing.',
    fullDesc: 'Accelerate digital growth with data-driven performance marketing, conversion rate optimization (CRO), search engine rankings, and high-ROI ad campaigns.',
    icon: 'Megaphone',
    color: '#EF4444',
    bgLight: '#FEF2F2',
    badge: 'Growth',
    technologies: ['Google Ads', 'Meta Ads', 'Google Analytics 4', 'Ahrefs', 'Semrush', 'Search Console'],
    capabilities: [
      'Technical on-page & off-page SEO optimization',
      'High-conversion Google & Meta ad campaigns',
      'Landing page A/B testing & funnel optimization',
      'Social media brand positioning & content strategy',
      'Email marketing automation & drip campaigns'
    ],
    deliverables: [
      'Ranked keyword target strategy',
      'Configured ad accounts with high-converting creatives',
      'Google Analytics 4 conversion tracking setup',
      'Weekly performance metrics & ROI dashboard',
      'Competitor growth benchmark report'
    ],
    typicalTimeline: 'Ongoing / 4 Weeks+'
  },
  {
    id: 'it-consulting',
    title: 'IT Consulting & Strategy',
    shortDesc: 'Technology guidance, solution architecture and digital transformation.',
    fullDesc: 'Strategic advisory for technical leaders, founders, and enterprises navigating technology choices, system scalability, and software modernization.',
    icon: 'Compass',
    color: '#7025E8',
    bgLight: '#F5F3FF',
    badge: 'Advisory',
    technologies: ['System Architecture', 'Cloud Governance', 'Security Strategy', 'Tech Due Diligence'],
    capabilities: [
      'Architecture reviews & scalability roadmaps',
      'Technology stack evaluation & selection',
      'Digital transformation & paperless automation',
      'Technical due diligence for investments',
      'Vendor & SaaS contract evaluation'
    ],
    deliverables: [
      'Comprehensive technical roadmap document',
      'System architecture blueprints & diagrams',
      'Technology risk assessment report',
      'Budget estimation & resource planning matrix',
      'Bi-weekly advisory sync sessions'
    ],
    typicalTimeline: '2 - 6 Weeks'
  },
  {
    id: 'edtech-solutions',
    title: 'EdTech Solutions',
    shortDesc: 'Learning platforms, LMS, quiz systems and academic tools.',
    fullDesc: 'Empower universities, schools, and coaching institutions with interactive Learning Management Systems, online proctored examinations, and AI-driven study tools.',
    icon: 'GraduationCap',
    color: '#0866F5',
    bgLight: '#EFF6FF',
    badge: 'Specialized',
    technologies: ['React', 'WebRTC', 'Video Streaming (HLS)', 'AI Proctoring', 'PostgreSQL', 'Redis'],
    capabilities: [
      'Full-featured custom Learning Management Systems (LMS)',
      'AI-based online exam proctoring & anti-cheat systems',
      'Interactive quiz modules with instant grading',
      'Student academic progress dashboards & reports',
      'Automated verifiable digital certificate issuance'
    ],
    deliverables: [
      'Turnkey institution-branded EdTech portal',
      'Live student lecture & quiz modules',
      'Admin portal for teachers and professors',
      'SMS & WhatsApp student notification integration',
      'Complete cloud hosting deployment'
    ],
    typicalTimeline: '4 - 10 Weeks'
  },
  {
    id: 'iot-solutions',
    title: 'IoT Solutions',
    shortDesc: 'Smart, connected and real-time IoT applications.',
    fullDesc: 'Bridge hardware and software with real-time IoT sensor telemetry, edge computing, MQTT protocols, microcontroller firmware, and live industrial dashboards.',
    icon: 'Cpu',
    color: '#079B45',
    bgLight: '#F0FDF4',
    badge: 'Hardware & IoT',
    technologies: ['ESP32', 'Raspberry Pi', 'MQTT', 'InfluxDB', 'Grafana', 'Node-RED', 'C++ / MicroPython'],
    capabilities: [
      'Microcontroller firmware development (ESP32/STM32)',
      'MQTT / HTTP telemetry ingestion pipelines',
      'Real-time industrial sensor monitoring dashboards',
      'Over-the-Air (OTA) firmware update architecture',
      'Hardware prototype design & PCB guidance'
    ],
    deliverables: [
      'Tested microcontroller firmware code',
      'Real-time web monitoring dashboard',
      'Cloud telemetry backend & database',
      'Hardware schematics & wiring diagrams',
      'Hardware integration test report'
    ],
    typicalTimeline: '4 - 12 Weeks'
  }
];
