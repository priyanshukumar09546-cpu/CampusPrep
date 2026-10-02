// ============================================================================
// PROFESSORVIRUS — CAREER & COMPETITIVE EXAM GUIDANCE DATA ARCHITECTURE
// Comprehensive data for 15+ degree courses & multiple B.Tech branches
// Provides: Careers, Competitive Exams, Higher Studies, Skills, Salaries & Tips
// ============================================================================

export const COURSES_LIST = [
  { id: 'btech', name: 'B.Tech (All Branches)', shortName: 'B.Tech', icon: 'Cpu', hasBranches: true },
  { id: 'bca', name: 'BCA', shortName: 'BCA', icon: 'Monitor', hasBranches: false },
  { id: 'bsc', name: 'B.Sc', shortName: 'B.Sc', icon: 'FlaskConical', hasBranches: false },
  { id: 'bcom', name: 'B.Com', shortName: 'B.Com', icon: 'TrendingUp', hasBranches: false },
  { id: 'ba', name: 'BA', shortName: 'BA', icon: 'BookOpen', hasBranches: false },
  { id: 'bba', name: 'BBA', shortName: 'BBA', icon: 'Briefcase', hasBranches: false },
  { id: 'barch', name: 'B.Arch', shortName: 'B.Arch', icon: 'Compass', hasBranches: false },
  { id: 'diploma', name: 'Diploma', shortName: 'Diploma', icon: 'Wrench', hasBranches: false },
  { id: 'iti', name: 'ITI', shortName: 'ITI', icon: 'Settings', hasBranches: false },
  { id: 'mtech', name: 'M.Tech', shortName: 'M.Tech', icon: 'GraduationCap', hasBranches: false },
  { id: 'mca', name: 'MCA', shortName: 'MCA', icon: 'Code', hasBranches: false },
  { id: 'msc', name: 'M.Sc', shortName: 'M.Sc', icon: 'Atom', hasBranches: false },
  { id: 'llb', name: 'Law (LLB)', shortName: 'LLB', icon: 'Scale', hasBranches: false },
  { id: 'mbbs', name: 'MBBS', shortName: 'MBBS', icon: 'Stethoscope', hasBranches: false },
  { id: 'other', name: 'Other Courses', shortName: 'Other', icon: 'MoreHorizontal', hasBranches: false }
];

export const BTECH_BRANCHES = [
  { id: 'cse', name: 'Computer Science & Engineering (CSE)' },
  { id: 'it', name: 'Information Technology (IT)' },
  { id: 'ece', name: 'Electronics & Communication (ECE)' },
  { id: 'eee', name: 'Electrical & Electronics Engineering (EEE)' },
  { id: 'me', name: 'Mechanical Engineering (ME)' },
  { id: 'ce', name: 'Civil Engineering (CE)' },
  { id: 'che', name: 'Chemical Engineering' },
  { id: 'bt', name: 'Biotechnology' },
  { id: 'aero', name: 'Aerospace Engineering' }
];

export const COMPETITIVE_EXAMS_DATA = {
  // ==========================================================================
  // B.TECH BRANCHES
  // ==========================================================================
  'btech:cse': {
    courseTitle: 'B.Tech After Graduation',
    subtitle: 'Explore career options, higher studies and competitive exams you can prepare after B.Tech in Computer Science & Engineering (CSE).',
    careerOpportunities: [
      { role: 'Software Developer / Engineer', desc: 'Design, code, test, and maintain enterprise software, consumer applications, and APIs.', icon: 'Code' },
      { role: 'Data Scientist / Analyst', desc: 'Extract insights from large datasets using statistical modeling, Python, and SQL.', icon: 'BarChart2' },
      { role: 'Cyber Security Analyst', desc: 'Protect networks, cloud infrastructure, and sensitive data from cyber threats and breaches.', icon: 'Shield' },
      { role: 'Cloud Engineer', desc: 'Design and deploy scalable architecture on AWS, Microsoft Azure, or Google Cloud Platform.', icon: 'Cloud' },
      { role: 'AI / ML Engineer', desc: 'Build and train deep learning models, generative AI pipelines, and computer vision systems.', icon: 'Bot' },
      { role: 'Full Stack Developer', desc: 'Build end-to-end web applications combining React/Next.js frontends with robust backend APIs.', icon: 'Layers' },
      { role: 'DevOps Engineer', desc: 'Automate CI/CD pipelines, container orchestration with Kubernetes, and infrastructure as code.', icon: 'Cpu' },
      { role: 'Product Manager (with experience)', desc: 'Bridge business strategy, UX design, and engineering teams to launch tech products.', icon: 'Users' },
      { role: 'Research & Development', desc: 'Conduct cutting-edge research in algorithms, distributed systems, and quantum computing.', icon: 'Lightbulb' },
      { role: 'Entrepreneur / Startup Founder', desc: 'Build and launch tech startups addressing consumer, SaaS, fintech, or edtech markets.', icon: 'Rocket' }
    ],
    competitiveExams: [
      { name: 'UPSC (Civil Services)', desc: 'IAS, IPS, IFS officer roles; technical graduates have high analytical advantage.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'SSC (CGL, CHSL, MTS, etc.)', desc: 'Central government posts like Assistant Section Officer, IT Inspector, and Auditor.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'GATE (For M.Tech / PSUs)', desc: 'Entry to IITs/NITs for M.Tech and PSU recruitment (IOCL, NTPC, ONGC, BARC).', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'ISRO (Scientist/Engineer)', desc: 'Central research and satellite software systems development roles for CSE engineers.', authority: 'ISRO', url: 'https://www.isro.gov.in/Careers.html' },
      { name: 'DRDO (Scientist/Engineer)', desc: 'Defence research labs focusing on cyber warfare, robotics, AI, and cryptographic systems.', authority: 'DRDO', url: 'https://www.drdo.gov.in' },
      { name: 'SBI PO / Clerk & IBPS IT Officer', desc: 'Probationary Officer & Specialist IT Officer overseeing core banking software.', authority: 'IBPS / SBI', url: 'https://www.ibps.in' },
      { name: 'RRB (JE, ALP, NTPC, etc.)', desc: 'Indian Railways software, signaling, and IT infrastructure administration.', authority: 'RRB', url: 'https://www.indianrailways.gov.in' },
      { name: 'UPPSC (State Civil Services)', desc: 'State administrative positions (SDM, DSP, Commercial Tax Officer).', authority: 'UPPSC', url: 'https://uppsc.up.nic.in' },
      { name: 'Defence Exams (CDS, AFCAT, etc.)', desc: 'Permanent Commission & Short Service Commission in Army, Air Force, and Navy.', authority: 'Indian Armed Forces', url: 'https://joinindianarmy.nic.in' }
    ],
    higherStudies: [
      { title: 'M.Tech (CSE / AI / Data Science / etc.)', desc: '2-year master’s degree at premier institutes (IITs, NITs, IIITs) via GATE qualification.', icon: 'GraduationCap' },
      { title: 'MS (Abroad)', desc: 'Master of Science in USA, Germany, Canada, or UK; requires GRE/IELTS/TOEFL scores.', icon: 'Globe' },
      { title: 'MBA (Tech / General / Product)', desc: 'IIMs, XLRI, FMS via CAT/XAT for leadership, finance, consulting, and tech product management.', icon: 'Briefcase' },
      { title: 'M.Sc (Data Science / Computer Science)', desc: 'Specialized interdisciplinary post-graduate programs at CMI, ISI, or central universities.', icon: 'Atom' },
      { title: 'PG Diploma (AI, Cyber Security, etc.)', desc: 'Industry-recognized post-graduate diplomas from CDAC, IIITs, or top universities.', icon: 'Award' },
      { title: 'Ph.D (Research Track)', desc: 'Doctoral research at IISc, IITs, or international universities for academic/R&D career.', icon: 'Lightbulb' },
      { title: 'MCA (Alternative to M.Tech)', desc: 'Advanced computer applications postgraduate degree for non-core or cross-discipline entrants.', icon: 'Terminal' },
      { title: 'MS + Ph.D (Dual Degree Research Track)', desc: 'Direct PhD programs at IITs or US/European universities immediately after B.Tech.', icon: 'FileText' }
    ],
    skills: [
      'Programming (C++, Python, Java)',
      'Data Structures & Algorithms',
      'Web Development (React, Node.js)',
      'Cloud Computing (AWS, GCP)',
      'AI / Machine Learning',
      'Cyber Security & Networking',
      'Communication & Soft Skills',
      'Problem Solving & System Design',
      'Project Building & Git / GitHub',
      'Internships & Real-world Products'
    ],
    salaryRanges: [
      { role: 'Software Developer (Fresher)', range: '4 - 8 LPA' },
      { role: 'Data Scientist (Fresher)', range: '6 - 12 LPA' },
      { role: 'Cyber Security Analyst', range: '5 - 10 LPA' },
      { role: 'Cloud Engineer', range: '6 - 12 LPA' },
      { role: 'AI/ML Engineer', range: '7 - 15 LPA' },
      { role: 'Product Manager (2-4 yrs)', range: '15 - 30 LPA+' }
    ],
    usefulTips: [
      'Build strong fundamentals in Data Structures, Algorithms, and Core CS subjects (OS, DBMS, CN).',
      'Do real projects and secure at least 1-2 internships before final year.',
      'Prepare for at least one competitive exam (GATE / CAT / UPSC / Banking) concurrently.',
      'Develop strong communication, problem solving, and interview presentation skills.',
      'Keep multiple options open: balance off-campus/on-campus tech placements with higher study plans.',
      'Stay updated with rapid industry trends like Generative AI, Cloud Native, and Security.',
      'Actively network on LinkedIn and maintain a clean, active GitHub repository showcase.'
    ]
  },

  'btech:it': {
    courseTitle: 'B.Tech IT After Graduation',
    subtitle: 'Explore career options, higher studies and competitive exams you can prepare after B.Tech in Information Technology.',
    careerOpportunities: [
      { role: 'Enterprise Software Engineer', desc: 'Develop robust, high-performance IT solutions for global corporate infrastructures.', icon: 'Code' },
      { role: 'Cloud & Infrastructure Engineer', desc: 'Deploy, automate, and manage enterprise systems across cloud service providers.', icon: 'Cloud' },
      { role: 'Information Security Specialist', desc: 'Assess security vulnerabilities, compliance audits, and enterprise firewalls.', icon: 'Shield' },
      { role: 'Database Administrator (DBA)', desc: 'Optimize query performance, replication, and disaster recovery for enterprise data.', icon: 'Database' },
      { role: 'IT Business Analyst', desc: 'Translate client enterprise business requirements into technical system specifications.', icon: 'BarChart2' },
      { role: 'DevOps & Site Reliability Engineer', desc: 'Maintain uptime, continuous integration, telemetry, and automated deployment pipelines.', icon: 'Cpu' },
      { role: 'Network Architect', desc: 'Design large-scale enterprise network topologies, VPNs, and data center connectivity.', icon: 'Layers' },
      { role: 'ERP Consultant (SAP / Oracle)', desc: 'Configure and optimize enterprise resource planning implementations.', icon: 'Briefcase' }
    ],
    competitiveExams: [
      { name: 'GATE (Information Technology / CS)', desc: 'Admission into M.Tech at IITs/NITs and technical officer roles at PSUs.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'UPSC (Civil Services)', desc: 'Premier all-India administrative services (IAS, IPS, IRS).', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'SSC CGL / CHSL', desc: 'Officer positions in Central Government ministries and audit departments.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'IBPS Specialist IT Officer', desc: 'Dedicated IT officer posts in Public Sector Banks managing core banking architectures.', authority: 'IBPS', url: 'https://www.ibps.in' },
      { name: 'ISRO / DRDO Recruitment', desc: 'Scientific officer posts for software and system architecture engineering.', authority: 'Govt of India', url: 'https://www.isro.gov.in' },
      { name: 'State PSC & State Electricity IT Jobs', desc: 'Assistant Engineer (IT) and informatics officer posts in state departments.', authority: 'State PSC', url: 'https://uppsc.up.nic.in' }
    ],
    higherStudies: [
      { title: 'M.Tech (Information Technology / CSE / AI)', desc: 'Specialized 2-year postgraduate engineering degree via GATE.', icon: 'GraduationCap' },
      { title: 'MS in Information Systems / CS (Abroad)', desc: 'Top tech management and software engineering master programs worldwide.', icon: 'Globe' },
      { title: 'MBA (Information Technology / Operations)', desc: 'Master in Business Administration to head enterprise tech teams and operations.', icon: 'Briefcase' },
      { title: 'Ph.D in Computer Science / IT', desc: 'Academic and advanced research careers in distributed networks and analytics.', icon: 'Lightbulb' }
    ],
    skills: [
      'Full Stack Web Architecture',
      'Database Management (SQL & NoSQL)',
      'Cloud Architecture (AWS, Azure)',
      'Enterprise Networking & Protocols',
      'Data Structures & Algorithms',
      'Cybersecurity & Ethical Hacking',
      'DevOps, Docker & Kubernetes'
    ],
    salaryRanges: [
      { role: 'Software Engineer (Fresher)', range: '4 - 8 LPA' },
      { role: 'Cloud Engineer', range: '5.5 - 11 LPA' },
      { role: 'IT Business Analyst', range: '5 - 9 LPA' },
      { role: 'DevOps / SRE Engineer', range: '6 - 14 LPA' }
    ],
    usefulTips: [
      'Focus on cloud certifications (AWS Solutions Architect, Azure Fundamentals) to stand out.',
      'Build expertise in enterprise backend technologies like Java Spring Boot or Go.',
      'Contribute to open source and build deployable web apps with CI/CD automation.'
    ]
  },

  'btech:ece': {
    courseTitle: 'B.Tech ECE After Graduation',
    subtitle: 'Explore core hardware, telecom, embedded systems, and tech career options after B.Tech in Electronics & Communication.',
    careerOpportunities: [
      { role: 'VLSI Design / Verification Engineer', desc: 'Design microchips, ASICs, and FPGA architectures for semiconductor giants.', icon: 'Cpu' },
      { role: 'Embedded Systems Engineer', desc: 'Program microcontrollers, RTOS, and firmware for IoT and automotive systems.', icon: 'Terminal' },
      { role: 'Telecom & 5G Network Engineer', desc: 'Develop, optimize, and maintain cellular, optical fiber, and satellite networks.', icon: 'Radio' },
      { role: 'Robotics & Automation Engineer', desc: 'Design robotic arms, industrial sensors, actuators, and drone navigation electronics.', icon: 'Bot' },
      { role: 'Software Developer (Tech Track)', desc: 'Leverage strong coding and analytical skills for IT and tech product companies.', icon: 'Code' },
      { role: 'RF / Microwave Engineer', desc: 'Design high-frequency radio frequency antennas, radar, and wireless communication links.', icon: 'Wifi' }
    ],
    competitiveExams: [
      { name: 'GATE (ECE)', desc: 'Top tier route to PSUs (BEL, BHEL, BSNL, NTPC, ONGC) and M.Tech at IITs.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'UPSC ESE / IES (Engineering Services)', desc: 'Class-1 gazetted officer positions in Indian Telecommunications Service & Railways.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'ISRO (Scientist/Engineer SC - ECE)', desc: 'Satellite payload communication, telemetry, and tracking engineering.', authority: 'ISRO', url: 'https://www.isro.gov.in' },
      { name: 'DRDO (Scientist B - Electronics)', desc: 'Radar design, electronic warfare systems, missile telemetry, and defense communications.', authority: 'DRDO', url: 'https://www.drdo.gov.in' },
      { name: 'BARC (Scientific Officer)', desc: 'Instrumentation and nuclear reactor control electronics engineering.', authority: 'BARC', url: 'https://www.barc.gov.in' }
    ],
    higherStudies: [
      { title: 'M.Tech (VLSI Design / Embedded Systems / Microelectronics)', desc: 'Premier specialization in chip design and FPGA prototyping at IITs/NITs.', icon: 'Cpu' },
      { title: 'MS in Electrical & Computer Engineering (Abroad)', desc: 'Advanced semiconductor research at top global universities (USA, Taiwan, Germany).', icon: 'Globe' },
      { title: 'MBA (Operations / Supply Chain / Tech)', desc: 'Management leadership roles in manufacturing, automotive, or electronics multinationals.', icon: 'Briefcase' }
    ],
    skills: [
      'Verilog / VHDL / SystemVerilog',
      'Embedded C / C++ & Linux Kernel',
      'MATLAB / Simulink & LabVIEW',
      'PCB Design (Altium, Eagle)',
      'Digital Signal Processing (DSP)',
      'Microcontrollers (ARM, ESP32, STM32)'
    ],
    salaryRanges: [
      { role: 'VLSI Design Engineer (Fresher)', range: '6 - 15 LPA' },
      { role: 'Embedded Systems Engineer', range: '4.5 - 9 LPA' },
      { role: 'Telecom Network Engineer', range: '4 - 7.5 LPA' },
      { role: 'Software Developer (IT Roles)', range: '4 - 8 LPA' }
    ],
    usefulTips: [
      'Learn Verilog and Embedded C thoroughly; semiconductor and IoT demand is booming.',
      'Take advantage of both core electronics exams (GATE, ESE, ISRO) and software placement tracks.',
      'Complete hands-on hardware projects using microcontrollers and prototype boards.'
    ]
  },

  'btech:eee': {
    courseTitle: 'B.Tech EEE After Graduation',
    subtitle: 'Explore power systems, electric vehicles, renewable energy, and PSU careers after B.Tech in Electrical & Electronics.',
    careerOpportunities: [
      { role: 'Electric Vehicle (EV) Powertrain Engineer', desc: 'Design battery management systems (BMS), motor drives, and EV charging stations.', icon: 'Zap' },
      { role: 'Power Systems & Grid Engineer', desc: 'Manage high-voltage transmission, smart grid synchronization, and substation automation.', icon: 'Cpu' },
      { role: 'Renewable Energy Specialist (Solar / Wind)', desc: 'Design solar microgrids, inverters, and wind farm generation architectures.', icon: 'Sun' },
      { role: 'Control & Instrumentation Engineer', desc: 'Program PLCs, SCADA, and DCS systems for industrial automation and refineries.', icon: 'Settings' },
      { role: 'Electrical Design Consultant', desc: 'Plan industrial and commercial electrical infrastructure, transformers, and switchgears.', icon: 'Layers' }
    ],
    competitiveExams: [
      { name: 'GATE (Electrical Engineering)', desc: 'Recruitment in Power Grid (PGCIL), NTPC, BHEL, NHPC, IOCL, and M.Tech admissions.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'UPSC ESE / IES (Electrical)', desc: 'Indian Railway Service of Electrical Engineers (IRSEE), CPWD, and Central Power Engineering.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'State Electricity Boards (UPPCL / State Transco)', desc: 'Assistant Engineer (AE) electrical recruitment in state transmission companies.', authority: 'State Govts', url: 'https://www.uppcl.org' },
      { name: 'DMRC / Metro Rail Corporations', desc: 'Traction power, third-rail electrical systems, and rolling stock maintenance.', authority: 'Metro Rail', url: 'https://www.delhimetrorail.com' }
    ],
    higherStudies: [
      { title: 'M.Tech (Power Electronics / EV Technology / Smart Grids)', desc: 'Cutting-edge specialization in electric mobility, power converters, and green grids.', icon: 'GraduationCap' },
      { title: 'MS in Energy Engineering / Electrical (Abroad)', desc: 'International research in sustainable energy, hydrogen fuel cells, and microgrids.', icon: 'Globe' },
      { title: 'MBA in Energy & Infrastructure Management', desc: 'Executive leadership in renewable energy financing, infrastructure, and utilities.', icon: 'Briefcase' }
    ],
    skills: [
      'Power Electronics & Converter Design',
      'Battery Management Systems (BMS)',
      'MATLAB / Simulink & PSCAD',
      'PLC & SCADA Programming',
      'AutoCAD Electrical',
      'Substation & Protection Relays'
    ],
    salaryRanges: [
      { role: 'EV Systems Engineer', range: '5 - 12 LPA' },
      { role: 'Power Grid Engineer (PSU)', range: '12 - 18 LPA (CTC)' },
      { role: 'Automation / Control Engineer', range: '4 - 8 LPA' },
      { role: 'Renewable Energy Engineer', range: '4.5 - 9 LPA' }
    ],
    usefulTips: [
      'Electric Vehicle (EV) and battery technology are high-growth sectors for EEE graduates.',
      'GATE preparation covers 85% of state electricity and PSU exam syllabus.',
      'Master MATLAB Simulink for motor drives and power electronic converters.'
    ]
  },

  'btech:me': {
    courseTitle: 'B.Tech ME After Graduation',
    subtitle: 'Explore automotive, robotics, aerospace, thermal, and manufacturing careers after B.Tech in Mechanical Engineering.',
    careerOpportunities: [
      { role: 'Automotive Design Engineer', desc: 'Design vehicle chassis, suspension, powertrain, and crashworthiness systems.', icon: 'Truck' },
      { role: 'CAD / CAE Simulation Engineer', desc: 'Perform FEA stress analysis and CFD airflow simulations on mechanical components.', icon: 'Layers' },
      { role: 'Robotics & Mechatronics Engineer', desc: 'Integrate mechanical kinematics with sensors, actuators, and automated controllers.', icon: 'Bot' },
      { role: 'HVAC & Thermal Systems Engineer', desc: 'Design refrigeration, cleanroom ventilation, and commercial building cooling grids.', icon: 'Wind' },
      { role: 'Supply Chain & Manufacturing Manager', desc: 'Optimize lean manufacturing, CNC machining, Six Sigma, and production lines.', icon: 'Factory' }
    ],
    competitiveExams: [
      { name: 'GATE (Mechanical Engineering)', desc: 'PSU recruitment (IOCL, ONGC, HPCL, BPCL, BHEL, GAIL, BARC) and M.Tech at IITs.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'UPSC ESE / IES (Mechanical)', desc: 'Prestigious engineering cadre in Indian Railways, Ordnance Factories, and CPWD.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'ISRO / DRDO Mechanical Recruitment', desc: 'Propulsion, rocket motor casing, heat shields, and military vehicle engineering.', authority: 'Govt of India', url: 'https://www.isro.gov.in' },
      { name: 'SSC JE & State AE Exams', desc: 'Junior Engineer and Assistant Engineer posts in irrigation, PWD, and water works.', authority: 'SSC / State PSC', url: 'https://ssc.gov.in' }
    ],
    higherStudies: [
      { title: 'M.Tech (Thermal / Design / Manufacturing / Robotics)', desc: 'Deep technical specialization in CAD/CAM, finite element analysis, or mechatronics.', icon: 'GraduationCap' },
      { title: 'MS in Mechanical / Automotive Engineering (Germany / USA)', desc: 'World-renowned automotive and precision engineering hubs worldwide.', icon: 'Globe' },
      { title: 'MBA (Operations & Supply Chain Management)', desc: 'NITIE (IIM Mumbai), IIMs for manufacturing and supply chain leadership.', icon: 'Briefcase' }
    ],
    skills: [
      'SolidWorks, CATIA & AutoCAD 3D',
      'ANSYS (FEA & Fluent CFD)',
      'GD&T (Geometric Dimensioning)',
      'Thermodynamics & Fluid Mechanics',
      'Robotics, Arduino & Mechatronics',
      'Lean Manufacturing & Six Sigma'
    ],
    salaryRanges: [
      { role: 'Design Engineer (CAD/CAE)', range: '4 - 8 LPA' },
      { role: 'PSU Executive Officer (IOCL / ONGC)', range: '14 - 20 LPA (CTC)' },
      { role: 'Automotive / EV Engineer', range: '5 - 10 LPA' },
      { role: 'Robotics / Automation Engineer', range: '5.5 - 11 LPA' }
    ],
    usefulTips: [
      'Combine core mechanical knowledge with coding (Python/C++) and CAD simulation tools.',
      'Germany offers tuition-free MS in Mechanical and Automotive Engineering for high CGPA holders.',
      'GATE Mechanical is the most popular gateway for top PSUs and core government roles.'
    ]
  },

  'btech:ce': {
    courseTitle: 'B.Tech Civil After Graduation',
    subtitle: 'Explore structural, infrastructure, highway, and government engineering careers after B.Tech in Civil Engineering.',
    careerOpportunities: [
      { role: 'Structural Design Engineer', desc: 'Calculate loads, seismic resilience, and reinforcement for skyscrapers and bridges.', icon: 'Building' },
      { role: 'Project Manager (Construction)', desc: 'Oversee mega infrastructure sites, timelines, budgets, and contractor operations.', icon: 'Briefcase' },
      { role: 'Geotechnical & Foundation Engineer', desc: 'Analyze soil mechanics, piling, tunnel stability, and slope reinforcement.', icon: 'Layers' },
      { role: 'Transportation & Highway Engineer', desc: 'Design expressways, metro rail corridors, and intelligent traffic management systems.', icon: 'Navigation' },
      { role: 'BIM (Building Information Modeling) Specialist', desc: 'Create coordinated 3D/4D digital building representations using Revit and Navisworks.', icon: 'Compass' }
    ],
    competitiveExams: [
      { name: 'UPSC ESE / IES (Civil)', desc: 'Highest government engineering posts in CPWD, MES, Border Roads (BRO), and Railways.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'GATE (Civil Engineering)', desc: 'PSU recruitment in NHAI, DMRC, RITES, NTPC, IOCL, and M.Tech at IITs/NITs.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'SSC JE (Civil)', desc: 'Junior Engineer posts in Central Public Works Department (CPWD) and MES.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'State PWD / Irrigation Assistant Engineer', desc: 'Class-1/2 gazetted engineers overseeing state highway and municipal projects.', authority: 'State PSC', url: 'https://uppsc.up.nic.in' }
    ],
    higherStudies: [
      { title: 'M.Tech (Structural Engineering / Geotechnical / Transportation)', desc: 'Specialized postgraduate degree for high-rise structural design and research.', icon: 'GraduationCap' },
      { title: 'NICMAR (Construction Project Management)', desc: 'Premier institution for real estate and infrastructure project management careers.', icon: 'Building' },
      { title: 'MS in Civil / Environmental Engineering (Abroad)', desc: 'Sustainable cities, water resource management, and earthquake engineering worldwide.', icon: 'Globe' }
    ],
    skills: [
      'AutoCAD & Revit BIM Modeling',
      'STAAD.Pro & ETABS Structural Analysis',
      'Primavera P6 & MS Project Scheduling',
      'Surveying & Total Station / GIS',
      'IS Code Standards (IS 456, IS 800, IS 1893)'
    ],
    salaryRanges: [
      { role: 'Site Engineer (Fresher)', range: '3.5 - 6 LPA' },
      { role: 'Structural BIM Modeler', range: '4.5 - 8.5 LPA' },
      { role: 'Government Assistant Engineer (AE)', range: '7 - 12 LPA (CTC)' },
      { role: 'Infrastructure Project Manager', range: '12 - 25 LPA+' }
    ],
    usefulTips: [
      'Civil engineers have the highest number of vacancies in UPSC ESE, SSC JE, and State PSCs.',
      'Mastering BIM software (Revit + Navisworks) opens lucrative international corporate consultancy roles.',
      'Site experience in the first 2-3 years establishes a strong foundation for project management.'
    ]
  },

  'btech:che': {
    courseTitle: 'B.Tech Chemical After Graduation',
    subtitle: 'Explore petrochemical, pharmaceutical, energy, and process engineering careers after B.Tech in Chemical Engineering.',
    careerOpportunities: [
      { role: 'Process Design Engineer', desc: 'Design continuous distillation columns, reactors, and heat exchanger networks.', icon: 'FlaskConical' },
      { role: 'Refinery & Petrochemical Engineer', desc: 'Manage crude oil processing, catalytic cracking, and polymer synthesis.', icon: 'Factory' },
      { role: 'Pharmaceutical Process Engineer', desc: 'Scale up drug formulations, bioreactors, and cleanroom manufacturing units.', icon: 'Pill' },
      { role: 'Safety & Environmental (HSE) Officer', desc: 'Ensure hazard mitigation, HAZOP studies, effluent treatment, and zero-emission goals.', icon: 'Shield' }
    ],
    competitiveExams: [
      { name: 'GATE (Chemical Engineering)', desc: 'Recruitment in IOCL, ONGC, HPCL, BPCL, GAIL, BARC, and M.Tech admissions.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'BARC (Scientific Officer - Chemical)', desc: 'Nuclear fuel fabrication, heavy water plants, and radiochemical reprocessing.', authority: 'BARC', url: 'https://www.barc.gov.in' },
      { name: 'UPSC Civil Services / State PSC', desc: 'Administrative and regulatory oversight in pollution control boards and ministries.', authority: 'Govt of India', url: 'https://upsc.gov.in' }
    ],
    higherStudies: [
      { title: 'M.Tech (Chemical Engineering / Petroleum / Nanotechnology)', desc: 'Advanced process control, biochemical engineering, and catalyst design at IITs.', icon: 'GraduationCap' },
      { title: 'MS in Chemical & Biomolecular Engineering (Abroad)', desc: 'Research in green hydrogen, carbon capture, and battery materials.', icon: 'Globe' }
    ],
    skills: ['Aspen Plus & HYSYS Simulation', 'MATLAB & Process Control', 'HAZOP & Plant Safety', 'Thermodynamics & Mass Transfer'],
    salaryRanges: [
      { role: 'Process Engineer (Private)', range: '4.5 - 9 LPA' },
      { role: 'PSU Chemical Engineer (ONGC / IOCL)', range: '15 - 20 LPA (CTC)' }
    ],
    usefulTips: ['Aspen Plus and Aspen HYSYS proficiency are essential for EPC design consultancy jobs.']
  },

  'btech:bt': {
    courseTitle: 'B.Tech Biotechnology After Graduation',
    subtitle: 'Explore biopharma, clinical research, bioinformatics, and genetic engineering careers after B.Tech in Biotechnology.',
    careerOpportunities: [
      { role: 'Bioinformatics Analyst', desc: 'Process genomic sequencing data and protein structures using Python, R, and BLAST.', icon: 'Dna' },
      { role: 'Bioprocess & Fermentation Engineer', desc: 'Manage cell culture scale-up, monoclonal antibody production, and bioreactors.', icon: 'FlaskConical' },
      { role: 'Clinical Data Manager', desc: 'Oversee clinical trials, patient safety data verification, and regulatory submissions.', icon: 'FileText' },
      { role: 'Quality Assurance (QA/QC) Chemist', desc: 'Validate vaccine batches, sterile protocols, and GMP standards.', icon: 'Shield' }
    ],
    competitiveExams: [
      { name: 'GATE (Biotechnology)', desc: 'M.Tech admissions at IITs and research fellow positions at national laboratories.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'CSIR / UGC NET (Life Sciences)', desc: 'Junior Research Fellowship (JRF) and eligibility for Assistant Professor.', authority: 'NTA', url: 'https://csirnet.nta.ac.in' },
      { name: 'DBT-JRF (Biotechnology Eligibility Test)', desc: 'Fellowship to pursue doctoral research at top DBT and CSIR biotechnology labs.', authority: 'DBT', url: 'https://dbtindia.gov.in' }
    ],
    higherStudies: [
      { title: 'M.Tech / M.Sc in Biotechnology / Computational Biology', desc: 'Advanced degree in drug discovery, genomics, and industrial bioprocesses.', icon: 'GraduationCap' },
      { title: 'MS in Biomedical Sciences (USA / Germany / UK)', desc: 'Global research in mRNA therapies, cancer biology, and CRISPR gene editing.', icon: 'Globe' }
    ],
    skills: ['Bioinformatics & Python', 'PCR & Cell Culture Techniques', 'R Programming & Statistics', 'HPLC & Chromatography'],
    salaryRanges: [
      { role: 'Bioinformatics Associate', range: '4.5 - 8 LPA' },
      { role: 'Bioprocess Scientist (Fresh)', range: '4 - 7 LPA' }
    ],
    usefulTips: ['Combining biology with computer science (Bioinformatics) significantly increases job opportunities.']
  },

  'btech:aero': {
    courseTitle: 'B.Tech Aerospace After Graduation',
    subtitle: 'Explore avionics, aircraft structures, rocketry, defense, and space systems after B.Tech in Aerospace Engineering.',
    careerOpportunities: [
      { role: 'Aerodynamics & CFD Analyst', desc: 'Simulate supersonic airflow, drag reduction, and missile aerodynamic stability.', icon: 'Wind' },
      { role: 'Flight Control & Avionics Engineer', desc: 'Design fly-by-wire autopilots, inertial navigation, and telemetry firmware.', icon: 'Compass' },
      { role: 'Propulsion Systems Engineer', desc: 'Design gas turbine jet engines, solid rocket boosters, and cryogenic rocket stages.', icon: 'Rocket' },
      { role: 'Aircraft Structural Design Engineer', desc: 'Analyze composite materials, fatigue life, and fuselage load distribution.', icon: 'Layers' }
    ],
    competitiveExams: [
      { name: 'GATE (Aerospace Engineering)', desc: 'Recruitment at DRDO, ISRO, HAL, NAL, and M.Tech admissions at IIT Bombay/Madras/Kanpur.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'ISRO Centralized Recruitment Board (ICRB)', desc: 'Scientist / Engineer SC roles in rocket, satellite, and launch vehicle design.', authority: 'ISRO', url: 'https://www.isro.gov.in' },
      { name: 'Air Force / Defence Technical Branch (AFCAT / CDS)', desc: 'Aeronautical Engineering Branch in Indian Air Force and Naval Aviation.', authority: 'IAF', url: 'https://afcat.cdac.in' }
    ],
    higherStudies: [
      { title: 'M.Tech in Aerospace / Avionics / Space Engineering', desc: 'Specialized rocket propulsion and spacecraft flight dynamics at IITs & IIST.', icon: 'GraduationCap' },
      { title: 'MS in Aerospace Engineering (USA / France / Germany)', desc: 'Study at renowned aerospace centers (Toulouse, Stuttgart, Purdue, Georgia Tech).', icon: 'Globe' }
    ],
    skills: ['ANSYS Fluent & OpenFOAM', 'CATIA & MATLAB / Simulink', 'Propulsion & Aerodynamics Analysis', 'Orbital Mechanics'],
    salaryRanges: [
      { role: 'Avionics Engineer', range: '5 - 10 LPA' },
      { role: 'Scientist / Engineer (ISRO / DRDO)', range: '12 - 18 LPA (CTC)' }
    ],
    usefulTips: ['GATE Aerospace is the direct path for admission to IIST, IITs, and recruitment at DRDO.']
  },

  // ==========================================================================
  // BCA (BACHELOR OF COMPUTER APPLICATIONS)
  // ==========================================================================
  'bca': {
    courseTitle: 'BCA After Graduation',
    subtitle: 'Explore software engineering, web development, IT administration, competitive exams, and higher studies after BCA.',
    careerOpportunities: [
      { role: 'Software Developer / Engineer', desc: 'Build web, mobile, and desktop applications using Java, Python, C++, or JavaScript.', icon: 'Code' },
      { role: 'Full Stack Web Developer', desc: 'Build frontends with React/Vue and backends with Node.js, Express, or Django.', icon: 'Layers' },
      { role: 'System & Network Administrator', desc: 'Configure company servers, firewalls, user permissions, and network stability.', icon: 'Cpu' },
      { role: 'Cloud Support Associate', desc: 'Provide infrastructure management on AWS, Microsoft Azure, and Google Cloud.', icon: 'Cloud' },
      { role: 'Database Administrator (DBA)', desc: 'Manage SQL queries, database indexing, backups, and security policies.', icon: 'Database' },
      { role: 'QA & Automation Tester', desc: 'Write test cases, perform regression testing, and build Selenium automation scripts.', icon: 'Shield' },
      { role: 'Data Analyst', desc: 'Transform business data into actionable dashboards using SQL, Excel, and Power BI.', icon: 'BarChart2' },
      { role: 'Technical Support Specialist', desc: 'Diagnose IT system issues, configure enterprise hardware, and support client operations.', icon: 'Terminal' }
    ],
    competitiveExams: [
      { name: 'NIMCET (For Top MCA Admissions)', desc: 'National level entrance for MCA admission across NITs (top choice for BCA graduates).', authority: 'NITs', url: 'https://www.nimcet.in' },
      { name: 'CUET-PG (MCA at Central Universities)', desc: 'MCA admission in JNU, DU, BHU, and central universities.', authority: 'NTA', url: 'https://pgcuet.samarth.ac.in' },
      { name: 'SSC CGL / CHSL', desc: 'Inspector, Assistant Section Officer, and Auditor posts in Central Ministries.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'IBPS PO / Clerk & SBI PO', desc: 'Probationary Officer and clerk positions in Public Sector Banks.', authority: 'IBPS / SBI', url: 'https://www.ibps.in' },
      { name: 'UPSC (Civil Services)', desc: 'All-India administrative services (IAS, IPS, IRS). Any recognized graduate is eligible.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'RRB NTPC (Railway Recruitment)', desc: 'Station Master, Goods Guard, and Commercial Apprentice in Indian Railways.', authority: 'RRB', url: 'https://www.indianrailways.gov.in' },
      { name: 'Defence Exams (CDS / AFCAT)', desc: 'Commissioned Officer in Indian Army, Air Force, and Navy.', authority: 'Indian Armed Forces', url: 'https://joinindianarmy.nic.in' }
    ],
    higherStudies: [
      { title: 'MCA (Master of Computer Applications)', desc: '2-year post-graduation that puts you on equal footing with B.Tech CSE graduates.', icon: 'GraduationCap' },
      { title: 'M.Sc in Computer Science / Data Science', desc: 'Specialized 2-year masters focusing on theoretical CS, statistics, and machine learning.', icon: 'Atom' },
      { title: 'MBA (IT / Systems / General Management)', desc: 'Management degree via CAT/XAT for tech leadership and product management roles.', icon: 'Briefcase' },
      { title: 'MS in Computer Science (Abroad)', desc: 'Pursue master’s in USA, Germany, or UK (requires evaluation of 3-year vs 4-year degree requirements).', icon: 'Globe' },
      { title: 'PG Diploma in AI, Cloud or Cyber Security', desc: 'Specialized industry-oriented diploma programs from CDAC or IIITs.', icon: 'Award' }
    ],
    skills: [
      'Core Programming (Java, Python, C++)',
      'Data Structures & Algorithms',
      'Web Stack (HTML, CSS, JavaScript, React)',
      'Relational Databases (MySQL, PostgreSQL)',
      'Git, GitHub & Version Control',
      'Operating Systems & Computer Networks',
      'API Development & Postman'
    ],
    salaryRanges: [
      { role: 'Web / App Developer (Fresher)', range: '3.5 - 6.5 LPA' },
      { role: 'QA Automation Tester', range: '3 - 5.5 LPA' },
      { role: 'Cloud Support Associate', range: '4 - 7 LPA' },
      { role: 'Software Engineer (After MCA)', range: '6 - 14 LPA' }
    ],
    usefulTips: [
      'Pursuing an MCA from a top NIT via NIMCET immediately bridges the gap with B.Tech CSE graduates.',
      'Build 3-4 full stack portfolio projects and deploy them live to showcase during interviews.',
      'Practice DSA consistently on LeetCode/GeeksforGeeks to clear coding rounds at tech product companies.'
    ]
  },

  // ==========================================================================
  // B.SC (BACHELOR OF SCIENCE)
  // ==========================================================================
  'bsc': {
    courseTitle: 'B.Sc After Graduation',
    subtitle: 'Explore scientific research, analytics, government civil services, education, and master’s programs after B.Sc.',
    careerOpportunities: [
      { role: 'Data Analyst / Statistician', desc: 'Analyze patterns and build predictive analytics models for business decisions.', icon: 'BarChart2' },
      { role: 'Research Assistant / Lab Technician', desc: 'Conduct experiments, prepare chemical assays, or assist lead scientists in R&D.', icon: 'FlaskConical' },
      { role: 'Quality Control (QC) Chemist / Analyst', desc: 'Inspect pharmaceuticals, food, materials, and consumer products for regulatory compliance.', icon: 'Shield' },
      { role: 'Junior Software Engineer (for B.Sc CS/IT/Maths)', desc: 'Join IT service and tech consulting companies through graduate trainee drives.', icon: 'Code' },
      { role: 'School / College Educator', desc: 'Teach science and mathematics at secondary schools or coaching institutions.', icon: 'BookOpen' },
      { role: 'Scientific Officer / Technical Assistant', desc: 'Work in national scientific bodies (ISRO, DRDO, CSIR, ICMR labs).', icon: 'Atom' }
    ],
    competitiveExams: [
      { name: 'IIT JAM (Joint Admission Test for M.Sc)', desc: 'National gateway to M.Sc, Joint M.Sc-Ph.D at IITs, IISc, and NITs.', authority: 'IITs', url: 'https://jam2025.iitd.ac.in' },
      { name: 'UPSC (Civil Services)', desc: 'Prestigious IAS, IPS, IFS cadre; B.Sc graduates often excel with science optionals.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'SSC CGL / CHSL', desc: 'Central government audit, inspector, and administrative posts.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'Banking Exams (IBPS PO, SBI PO, Clerk)', desc: 'High percentage of B.Sc grads qualify bank examinations due to strong quantitative aptitude.', authority: 'IBPS', url: 'https://www.ibps.in' },
      { name: 'DRDO / ISRO Technical Assistant', desc: 'Scientific technical assistant positions across national laboratories.', authority: 'Govt of India', url: 'https://www.drdo.gov.in' },
      { name: 'State Forest Service / State PSC', desc: 'Forest range officer and civil services in state governments.', authority: 'State PSC', url: 'https://uppsc.up.nic.in' }
    ],
    higherStudies: [
      { title: 'M.Sc at IITs / Central Universities', desc: '2-year master of science degree via IIT JAM or CUET-PG.', icon: 'GraduationCap' },
      { title: 'Integrated Ph.D at IISc / IISERs / TIFR', desc: 'Direct research track with fellowship for high-achieving science graduates.', icon: 'Lightbulb' },
      { title: 'MCA (for B.Sc with Maths)', desc: 'Excellent switch into software engineering if you studied Mathematics in graduation.', icon: 'Terminal' },
      { title: 'MBA (Finance / Operations / General)', desc: 'Business management degree via CAT/XAT/CMAT.', icon: 'Briefcase' },
      { title: 'B.Ed (Bachelor of Education)', desc: '2-year degree required for government and private school teaching posts.', icon: 'BookOpen' }
    ],
    skills: ['Data Analysis & Statistical Tools', 'Laboratory Techniques & Safety Protocols', 'Python / R for Data Science', 'Mathematical Problem Solving', 'Scientific Report Writing'],
    salaryRanges: [
      { role: 'QC Chemist / Analyst', range: '3 - 5.5 LPA' },
      { role: 'Data Analyst (Fresher)', range: '4 - 7.5 LPA' },
      { role: 'Research Assistant (JRF)', range: '3.7 - 4.5 LPA (Fellowship)' },
      { role: 'Government Officer (CGL / Bank)', range: '6 - 10 LPA' }
    ],
    usefulTips: [
      'If you have Mathematics in B.Sc, you are eligible for NIMCET/MCA, opening full tech industry careers.',
      'Target IIT JAM early in 2nd year to secure M.Sc seats at top IITs and IISc.',
      'B.Sc students have a proven track record in clearing Bank PO and SSC CGL due to strong quantitative aptitude.'
    ]
  },

  // ==========================================================================
  // B.COM (BACHELOR OF COMMERCE)
  // ==========================================================================
  'bcom': {
    courseTitle: 'B.Com After Graduation',
    subtitle: 'Explore banking, finance, auditing, taxation, corporate accounting, and professional certifications after B.Com.',
    careerOpportunities: [
      { role: 'Accountant / Tax Consultant', desc: 'Manage balance sheets, GST filing, TDS reconciliation, and audit reporting for firms.', icon: 'FileText' },
      { role: 'Financial Analyst', desc: 'Evaluate financial statements, build cash flow projections, and assess investment opportunities.', icon: 'TrendingUp' },
      { role: 'Banking Associate / Relationship Manager', desc: 'Handle credit operations, customer portfolios, and retail/commercial banking services.', icon: 'Landmark' },
      { role: 'Statutory / Internal Auditor', desc: 'Verify company transactions, audit trails, and ensure regulatory compliance.', icon: 'Shield' },
      { role: 'Investment Banking Operations Analyst', desc: 'Assist in trade settlements, equity research support, and wealth management portfolios.', icon: 'Briefcase' },
      { role: 'Corporate Finance Executive', desc: 'Manage accounts payable, working capital cycles, and treasury disbursements.', icon: 'Layers' }
    ],
    competitiveExams: [
      { name: 'IBPS PO / Clerk & SBI PO', desc: 'Premier public sector bank officer recruitments; commerce graduates have core subject advantage.', authority: 'IBPS / SBI', url: 'https://www.ibps.in' },
      { name: 'SSC CGL (Assistant Audit Officer / AAO)', desc: 'Class-2 Gazetted post in CAG; specifically requires accounting & commerce knowledge.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'RBI Grade B & SEBI Grade A', desc: 'High-prestige regulatory positions in Reserve Bank of India and Securities Exchange Board.', authority: 'RBI / SEBI', url: 'https://www.rbi.org.in' },
      { name: 'UPSC (Civil Services)', desc: 'IAS, IPS, and Indian Revenue Service (IRS - Income Tax & Customs).', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'State Commercial Tax Officer (State PSC)', desc: 'State revenue collection and sales tax administration posts.', authority: 'State PSC', url: 'https://uppsc.up.nic.in' }
    ],
    higherStudies: [
      { title: 'Chartered Accountancy (CA - ICAI)', desc: 'Premier accounting qualification in India; can register via Direct Entry route after B.Com with 55%+ marks.', icon: 'Award' },
      { title: 'MBA (Finance / Corporate Strategy)', desc: 'IIMs, XLRI, SPJIMR via CAT for investment banking, corporate finance, and consulting.', icon: 'Briefcase' },
      { title: 'CMA (Cost and Management Accounting)', desc: 'Strategic cost auditing and industrial financial planning certification by ICMAI.', icon: 'FileText' },
      { title: 'CS (Company Secretary - ICSI)', desc: 'Corporate governance, board secretarial practices, and corporate law compliance.', icon: 'Scale' },
      { title: 'CFA (Chartered Financial Analyst - USA)', desc: 'Global gold-standard certification in portfolio management and equity investment.', icon: 'Globe' },
      { title: 'M.Com (Master of Commerce)', desc: '2-year postgraduate degree for teaching, research, and government commerce lecturer posts.', icon: 'GraduationCap' }
    ],
    skills: [
      'Advanced MS Excel (VLOOKUP, Macros, Modeling)',
      'Financial Accounting & IFRS / Ind AS',
      'GST & Direct Income Tax Computation',
      'TallyPrime & ERP Accounting Systems',
      'Financial Modeling & Valuation',
      'Corporate Law & Auditing Protocols'
    ],
    salaryRanges: [
      { role: 'Accountant / Tax Assistant', range: '3 - 5.5 LPA' },
      { role: 'Financial Analyst (Fresher)', range: '4 - 7.5 LPA' },
      { role: 'Bank PO (Public Sector)', range: '7.5 - 9.5 LPA (CTC)' },
      { role: 'Chartered Accountant (Fresher)', range: '9 - 18 LPA+' }
    ],
    usefulTips: [
      'B.Com graduates with 55%+ marks can bypass CA Foundation and enter CA Intermediate directly via Direct Entry.',
      'The SSC CGL AAO (Assistant Audit Officer) post is one of the only gazetted officer posts in SSC, ideally suited for B.Com.',
      'Master Advanced Excel and financial modeling to break into corporate analyst and MNC finance roles.'
    ]
  },

  // ==========================================================================
  // BA (BACHELOR OF ARTS)
  // ==========================================================================
  'ba': {
    courseTitle: 'BA After Graduation',
    subtitle: 'Explore civil services, public administration, law, journalism, policy analysis, and higher studies after BA.',
    careerOpportunities: [
      { role: 'Civil Servant / Administrative Officer', desc: 'Lead governance, administrative policy, and public district management.', icon: 'Award' },
      { role: 'Content Strategist / Technical Writer', desc: 'Create impactful brand narratives, technical documentation, and digital media content.', icon: 'FileText' },
      { role: 'Public Relations (PR) Specialist', desc: 'Manage corporate communications, media relations, and brand reputation campaigns.', icon: 'Users' },
      { role: 'Policy Analyst / NGO Program Manager', desc: 'Evaluate social sector policies, sustainable development goals, and non-profit initiatives.', icon: 'Globe' },
      { role: 'Journalist / Media Correspondent', desc: 'Investigate, write, and broadcast news across print, TV, and digital media channels.', icon: 'Radio' },
      { role: 'Corporate HR Executive', desc: 'Manage employee talent acquisition, organizational culture, and internal communications.', icon: 'Briefcase' }
    ],
    competitiveExams: [
      { name: 'UPSC (Civil Services Examination)', desc: 'IAS, IPS, IFS, IRS; BA syllabus in History, Polity, Geography directly overlaps with GS papers.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'State Public Service Commission (State PSC)', desc: 'SDM, DSP, Nayab Tehsildar, and block development officers in state civil services.', authority: 'State PSC', url: 'https://uppsc.up.nic.in' },
      { name: 'SSC CGL / CHSL', desc: 'Assistant Section Officer in Central Secretariat, Intelligence Bureau, and Ministry of External Affairs.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'Banking Examinations (IBPS / SBI PO)', desc: 'Open to graduates of all streams; focuses on Reasoning, English, and General Awareness.', authority: 'IBPS', url: 'https://www.ibps.in' },
      { name: 'UGC NET (after MA)', desc: 'National Eligibility Test for Assistant Professor and Junior Research Fellowship (JRF).', authority: 'NTA', url: 'https://ugcnet.nta.ac.in' },
      { name: 'Defence Exams (CDS / AFCAT)', desc: 'Commissioned Officer entry in the Indian Army, Air Force, and Navy.', authority: 'Indian Armed Forces', url: 'https://joinindianarmy.nic.in' }
    ],
    higherStudies: [
      { title: 'MA in History / Political Science / Economics', desc: 'Specialized 2-year masters via CUET-PG for academic and think-tank careers.', icon: 'GraduationCap' },
      { title: 'LLB (3-Year Law Degree)', desc: 'Enter legal practice, litigation, corporate counsel, or judiciary after graduation.', icon: 'Scale' },
      { title: 'Master of Public Policy (MPP)', desc: 'National Law School (NLSIU), IITs, and top universities for public policy roles.', icon: 'Globe' },
      { title: 'MBA (HR / Marketing / General Management)', desc: 'High-impact corporate switch through CAT/XAT/CMAT.', icon: 'Briefcase' },
      { title: 'Master in Mass Communication & Journalism', desc: 'IIMC, Jamia Millia, and central universities for media careers.', icon: 'Radio' },
      { title: 'B.Ed (Bachelor of Education)', desc: 'Mandatory teaching certification for TGT/PGT school teacher appointments.', icon: 'BookOpen' }
    ],
    skills: ['Critical Thinking & Analytical Writing', 'Public Speaking & Debate', 'Research Methodologies & Documentation', 'Digital Content Creation & SEO', 'Public Relations & Networking'],
    salaryRanges: [
      { role: 'Content Writer / Strategist', range: '3.5 - 6.5 LPA' },
      { role: 'PR / Media Associate', range: '3.5 - 6 LPA' },
      { role: 'Civil Servant (UPSC / State)', range: '8 - 14 LPA (CTC)' },
      { role: 'Corporate HR Executive', range: '4 - 7 LPA' }
    ],
    usefulTips: [
      'BA students have the highest syllabus overlap with UPSC Prelims and Mains General Studies papers.',
      '3-Year LLB is a prominent path for BA graduates leading to judiciary or corporate legal advisory.',
      'Develop strong digital skills (content strategy, SEO, copywriting) for corporate media careers.'
    ]
  },

  // ==========================================================================
  // BBA (BACHELOR OF BUSINESS ADMINISTRATION)
  // ==========================================================================
  'bba': {
    courseTitle: 'BBA After Graduation',
    subtitle: 'Explore corporate management, marketing, sales, banking, entrepreneurship, and top MBA programs after BBA.',
    careerOpportunities: [
      { role: 'Business Development Executive', desc: 'Drive enterprise sales, B2B partnerships, and client revenue growth.', icon: 'TrendingUp' },
      { role: 'Digital Marketing Specialist', desc: 'Run performance marketing, search engine optimization, and brand campaigns.', icon: 'Globe' },
      { role: 'HR & Talent Acquisition Specialist', desc: 'Recruit top talent, conduct onboarding, and administer organizational development.', icon: 'Users' },
      { role: 'Financial Operations Associate', desc: 'Assist in cash flow tracking, financial reconciliation, and budget audits.', icon: 'FileText' },
      { role: 'Operations & Supply Chain Coordinator', desc: 'Coordinate inventory replenishment, logistics vendors, and fulfillment metrics.', icon: 'Truck' },
      { role: 'Management Consultant (Associate)', desc: 'Assist advisory firms in streamlining business processes and market entry strategies.', icon: 'Briefcase' }
    ],
    competitiveExams: [
      { name: 'CAT / XAT / CMAT (Premier MBA)', desc: 'Entrance to IIMs, XLRI, SPJIMR, FMS; the primary career accelerator for BBA graduates.', authority: 'IIMs', url: 'https://iimcat.ac.in' },
      { name: 'UPSC (Civil Services)', desc: 'Management graduates bring strong organizational planning skills to civil administration.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'Bank PO (IBPS / SBI / Private)', desc: 'Probationary Officer in public and private commercial banks.', authority: 'IBPS', url: 'https://www.ibps.in' },
      { name: 'SSC CGL', desc: 'Inspector and Officer posts in Central Ministries and government bodies.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'GMAT (Global Master in Management / MBA)', desc: 'Admission into top business schools worldwide (INSEAD, LBS, Harvard).', authority: 'GMAC', url: 'https://www.mba.com' }
    ],
    higherStudies: [
      { title: 'MBA (Marketing / Finance / HR / Business Analytics)', desc: 'The gold standard 2-year post-graduation to break into senior corporate leadership.', icon: 'GraduationCap' },
      { title: 'PGDM from Premier B-Schools', desc: 'Post Graduate Diploma in Management from top AICTE-approved institutions.', icon: 'Award' },
      { title: 'MIM (Master in Management Abroad)', desc: 'Top choice in Europe and UK specifically designed for fresh business graduates.', icon: 'Globe' },
      { title: 'LLB (3-Year Corporate Law)', desc: 'Combine business management with corporate law for advisory roles.', icon: 'Scale' }
    ],
    skills: ['Business Analytics & Excel Modeling', 'Digital Marketing & Meta/Google Ads', 'Presentation & Negotiation Skills', 'Financial Accounting Basics', 'Project Management & Team Leadership'],
    salaryRanges: [
      { role: 'Business Development Associate', range: '3.5 - 6.5 LPA' },
      { role: 'Digital Marketing Associate', range: '3.5 - 6 LPA' },
      { role: 'Management Trainee (Post-MBA)', range: '12 - 28 LPA+' },
      { role: 'Bank PO (PSU)', range: '7.5 - 9.5 LPA (CTC)' }
    ],
    usefulTips: [
      'Gaining 1-2 years of corporate work experience before MBA boosts admission points at top IIMs and global business schools.',
      'Certifications in Google Analytics, HubSpot, and Advanced Excel give an immediate edge in placements.'
    ]
  },

  // ==========================================================================
  // B.ARCH (BACHELOR OF ARCHITECTURE)
  // ==========================================================================
  'barch': {
    courseTitle: 'B.Arch After Graduation',
    subtitle: 'Explore architectural design, urban planning, BIM technology, sustainability, and government architect roles.',
    careerOpportunities: [
      { role: 'Architectural Designer', desc: 'Design residential, commercial, and institutional building concepts and construction drawings.', icon: 'Compass' },
      { role: 'Urban Planner / Designer', desc: 'Plan smart city zones, public transportation nodes, and municipal infrastructure.', icon: 'Building' },
      { role: 'BIM & Computational Architect', desc: 'Coordinate multi-discipline 3D BIM models, parametric scripts, and clash detection.', icon: 'Layers' },
      { role: 'Interior Architect', desc: 'Plan interior layouts, lighting design, acoustics, and high-end retail ergonomics.', icon: 'Home' },
      { role: 'Landscape Architect', desc: 'Design public parks, eco-resorts, botanical gardens, and sustainable drainage landscapes.', icon: 'Sun' },
      { role: 'Historic Conservation Specialist', desc: 'Restore heritage monuments, colonial structures, and archaeological precincts.', icon: 'Award' }
    ],
    competitiveExams: [
      { name: 'GATE (Architecture & Planning - AR)', desc: 'M.Arch/M.Plan admission at IIT Roorkee, IIT Kharagpur, SPA, and government recruitment.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'UPSC CPWD Assistant Architect', desc: 'Gazetted architectural officer posts designing government buildings across India.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'State Public Works Department (PWD Architect)', desc: 'Architectural officer appointments in State Housing and Urban Development Boards.', authority: 'State PSC', url: 'https://uppsc.up.nic.in' },
      { name: 'CEED (Common Entrance Exam for Design)', desc: 'Master of Design (M.Des) admissions at IIT Bombay, IIT Delhi, and IISc.', authority: 'IIT Bombay', url: 'https://ceed.iitb.ac.in' }
    ],
    higherStudies: [
      { title: 'M.Arch (Urban Design / Landscape / Sustainability)', desc: 'Specialized 2-year architectural master at School of Planning & Architecture (SPA).', icon: 'GraduationCap' },
      { title: 'M.Plan (Master of Urban & Regional Planning)', desc: 'City planning and smart infrastructure governance master programs.', icon: 'Building' },
      { title: 'M.Des (Industrial Design / Interaction Design)', desc: 'Pivot into consumer product design and UX/UI design via CEED.', icon: 'Compass' },
      { title: 'MS in Architecture / Sustainable Design (Abroad)', desc: 'Advanced design studios in Netherlands (TU Delft), UK (AA/Bartlett), USA.', icon: 'Globe' }
    ],
    skills: ['Autodesk Revit & BIM Coordination', 'AutoCAD 2D & Rhino / Grasshopper', 'SketchUp & V-Ray / Lumion 3D', 'Building Bye-laws & NBC Standards', 'Sustainable Design & LEED/GRIHA'],
    salaryRanges: [
      { role: 'Junior Architect (Fresher)', range: '3 - 5.5 LPA' },
      { role: 'BIM Architect / Coordinator', range: '5 - 9 LPA' },
      { role: 'CPWD Government Architect', range: '9 - 14 LPA (CTC)' },
      { role: 'Principal Architect (Partner)', range: '15 - 35 LPA+' }
    ],
    usefulTips: [
      'Register with the Council of Architecture (COA) immediately after graduation to legally practice as an architect.',
      'Proficiency in BIM (Revit) is required by international firms in Dubai, Singapore, and Europe.'
    ]
  },

  // ==========================================================================
  // DIPLOMA
  // ==========================================================================
  'diploma': {
    courseTitle: 'Diploma After Graduation',
    subtitle: 'Explore lateral entry into B.Tech, Junior Engineer (JE) government exams, and core technical industrial jobs.',
    careerOpportunities: [
      { role: 'Junior Engineer (JE)', desc: 'Supervise site operations, maintenance, quality testing, and field execution.', icon: 'Wrench' },
      { role: 'CAD / CAM Drafting Technician', desc: 'Create 2D manufacturing drawings, wiring schematics, and mechanical assemblies.', icon: 'Compass' },
      { role: 'Plant Maintenance Technician', desc: 'Inspect industrial boilers, pumps, electrical switchgear, and hydraulic circuits.', icon: 'Settings' },
      { role: 'Quality Control (QC) Inspector', desc: 'Verify incoming materials and fabricated products using precision gauges and CMM.', icon: 'Shield' },
      { role: 'Technical Sales & Service Executive', desc: 'Support industrial clients with equipment installation and routine servicing.', icon: 'Briefcase' }
    ],
    competitiveExams: [
      { name: 'SSC JE (Junior Engineer)', desc: 'Largest government examination for Diploma holders; recruitment in CPWD, MES, CWC.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'RRB JE (Railway Recruitment Board)', desc: 'Junior Engineer appointments in Indian Railways across mechanical, civil, and electrical wings.', authority: 'RRB', url: 'https://www.indianrailways.gov.in' },
      { name: 'State Electricity Boards (UPPCL JE / State Discoms)', desc: 'Junior Engineer positions in state electricity transmission and distribution.', authority: 'State Govts', url: 'https://www.uppcl.org' },
      { name: 'DRDO CEPTAM & ISRO Technical Assistant', desc: 'Premier research lab technical appointments with central pay scales.', authority: 'Govt of India', url: 'https://www.drdo.gov.in' },
      { name: 'DMRC / State Metro Junior Engineer', desc: 'Traction, signaling, track, and rolling stock maintenance engineers.', authority: 'Metro Rail', url: 'https://www.delhimetrorail.com' }
    ],
    higherStudies: [
      { title: 'B.Tech Lateral Entry (Direct 2nd Year)', desc: 'Join regular B.Tech in 3rd semester via state lateral entry exams (CUET/UPCET/JELET).', icon: 'GraduationCap' },
      { title: 'AMIE (Associate Member of Institution of Engineers)', desc: 'Equivalent to a B.Tech degree recognized for government exams and promotions.', icon: 'Award' },
      { title: 'Advanced Post-Diploma Specializations', desc: 'Specialized 1-year diplomas in Tool Design (CITD), Automation, or Renewable Energy.', icon: 'Settings' }
    ],
    skills: ['Technical Drawing & AutoCAD', 'Hands-on Machine Tool Operation', 'Electrical Testing & Multimeters', 'Preventive Maintenance & Safety', 'PLC Basics & Sensor Wiring'],
    salaryRanges: [
      { role: 'Industrial Trainee (DET)', range: '2.5 - 4 LPA' },
      { role: 'Junior Engineer (Private Core)', range: '3.5 - 6 LPA' },
      { role: 'SSC JE / RRB JE (Govt)', range: '6.5 - 9 LPA (CTC)' }
    ],
    usefulTips: [
      'B.Tech Lateral Entry allows you to complete an engineering degree in just 3 years after diploma.',
      'SSC JE and RRB JE offer permanent central government appointments with promotional ladders to Assistant Engineer.'
    ]
  },

  // ==========================================================================
  // ITI (INDUSTRIAL TRAINING INSTITUTE)
  // ==========================================================================
  'iti': {
    courseTitle: 'ITI After Graduation',
    subtitle: 'Explore technician roles, apprenticeship opportunities, railway exams, and polytechnic lateral entry.',
    careerOpportunities: [
      { role: 'Electrician / Wireman', desc: 'Install, maintain, and repair residential and industrial electrical systems.', icon: 'Zap' },
      { role: 'Machinist / CNC Operator', desc: 'Operate lathes, milling machines, and computer-numerical control fabrication tools.', icon: 'Settings' },
      { role: 'Fitter / Assembly Technician', desc: 'Assemble precision mechanical machinery, bearings, and heavy structural parts.', icon: 'Wrench' },
      { role: 'Welder / Fabricator', desc: 'Perform TIG, MIG, and ARC welding on pipelines, structural steel, and pressure vessels.', icon: 'Flame' },
      { role: 'Automobile Mechanic', desc: 'Diagnose and overhaul automotive engines, transmissions, and braking systems.', icon: 'Truck' }
    ],
    competitiveExams: [
      { name: 'RRB ALP & Technician (Indian Railways)', desc: 'Assistant Loco Pilot and Technician posts; the largest recruiter of ITI certificate holders.', authority: 'RRB', url: 'https://www.indianrailways.gov.in' },
      { name: 'Trade Apprentice (BHEL, IOCL, ONGC, NTPC)', desc: '1-2 year national apprenticeship with stipends leading to regular PSU appointments.', authority: 'Apprenticeship India', url: 'https://www.apprenticeshipindia.gov.in' },
      { name: 'DRDO CEPTAM (Technician-A)', desc: 'Technical workshop and fabrication roles in defense laboratories.', authority: 'DRDO', url: 'https://www.drdo.gov.in' },
      { name: 'ISRO Technician-B', desc: 'Precision satellite component assembly and testing workshops.', authority: 'ISRO', url: 'https://www.isro.gov.in' },
      { name: 'Indian Navy Tradesman Mate', desc: 'Civilian technical posts in naval dockyards and repair centers.', authority: 'Indian Navy', url: 'https://joinindiannavy.gov.in' }
    ],
    higherStudies: [
      { title: 'Polytechnic Diploma Lateral Entry', desc: 'Direct admission into 2nd year of 3-year Polytechnic Diploma in relevant engineering trade.', icon: 'GraduationCap' },
      { title: 'CITS (Craft Instructor Training Scheme)', desc: 'Training at NSTI to become an Instructor / Teacher at government ITIs.', icon: 'BookOpen' }
    ],
    skills: ['Blueprint & Drawing Reading', 'Precision Measurement (Vernier, Micrometer)', 'Safety Protocols & Workshop SOPs', 'Machine Operation & Tooling'],
    salaryRanges: [
      { role: 'Apprentice (Stipend)', range: '1.2 - 2 LPA' },
      { role: 'Technician (Private Sector)', range: '2.4 - 4 LPA' },
      { role: 'Railway Technician / ALP (Govt)', range: '4.5 - 7 LPA (CTC)' }
    ],
    usefulTips: [
      'Complete a 1-year National Apprenticeship Certificate (NAC); it is mandatory for many central government PSU posts.',
      'Lateral entry into a Polytechnic Diploma elevates you to Junior Engineer eligibility.'
    ]
  },

  // ==========================================================================
  // M.TECH (MASTER OF TECHNOLOGY)
  // ==========================================================================
  'mtech': {
    courseTitle: 'M.Tech After Graduation',
    subtitle: 'Explore senior engineering R&D, principal architecture, university professorships, and Ph.D research.',
    careerOpportunities: [
      { role: 'Senior R&D Engineer', desc: 'Lead deep-tech industrial research, patent filings, and algorithmic innovations.', icon: 'Lightbulb' },
      { role: 'Principal Architect / Specialist', desc: 'Architect large-scale chipsets, distributed software, or complex mechanical systems.', icon: 'Cpu' },
      { role: 'Assistant Professor / Lecturer', desc: 'Teach undergraduate engineering students and guide academic research projects.', icon: 'BookOpen' },
      { role: 'Data Science / AI Specialist', desc: 'Build enterprise machine learning models and proprietary intelligence systems.', icon: 'Bot' }
    ],
    competitiveExams: [
      { name: 'UGC NET / CSIR NET', desc: 'Eligibility for Assistant Professor and Junior Research Fellowship (JRF).', authority: 'NTA', url: 'https://ugcnet.nta.ac.in' },
      { name: 'ISRO Scientist/Engineer SC & DRDO Scientist B', desc: 'Direct senior scientist appointment in national space and defense laboratories.', authority: 'Govt of India', url: 'https://www.isro.gov.in' },
      { name: 'BARC Scientific Officer', desc: 'Nuclear research and engineering scientist appointments.', authority: 'BARC', url: 'https://www.barc.gov.in' },
      { name: 'UPSC Civil Services / State PSC', desc: 'High-level administration and technical advisory in government ministries.', authority: 'UPSC', url: 'https://upsc.gov.in' }
    ],
    higherStudies: [
      { title: 'Ph.D at IITs, IISc, or Premier Global Universities', desc: 'Doctoral research with lucrative PMRF (Prime Minister’s Research Fellowship) up to ₹80,000/month.', icon: 'GraduationCap' },
      { title: 'Post-Doctoral Fellowships', desc: 'Advanced global academic research opportunities in USA, Germany, Japan.', icon: 'Globe' }
    ],
    skills: ['Advanced Domain Engineering', 'Academic Research & Paper Publication', 'Simulation & Modeling Tools', 'Project Leadership & Mentorship'],
    salaryRanges: [
      { role: 'Senior Software / R&D Engineer', range: '10 - 25 LPA' },
      { role: 'Assistant Professor (College)', range: '6 - 12 LPA' },
      { role: 'Scientist B (DRDO / ISRO)', range: '14 - 20 LPA (CTC)' }
    ],
    usefulTips: ['Apply for the Prime Minister’s Research Fellowship (PMRF) for direct PhD entry with prestigious monthly stipends.']
  },

  // ==========================================================================
  // MCA (MASTER OF COMPUTER APPLICATIONS)
  // ==========================================================================
  'mca': {
    courseTitle: 'MCA After Graduation',
    subtitle: 'Explore senior software engineering, enterprise cloud architecture, government IT officer roles, and PhD in CS.',
    careerOpportunities: [
      { role: 'Senior Software Developer / Lead', desc: 'Lead sprint teams, design microservice architectures, and write production code.', icon: 'Code' },
      { role: 'Full Stack Web / Mobile Architect', desc: 'Deliver scalable web apps with Next.js, Node, React Native, and cloud databases.', icon: 'Layers' },
      { role: 'Cloud & Infrastructure Engineer', desc: 'Manage enterprise infrastructure on AWS, Azure, and Google Cloud with Kubernetes.', icon: 'Cloud' },
      { role: 'Cyber Security Consultant', desc: 'Perform penetration testing, vulnerability assessments, and cloud security audits.', icon: 'Shield' }
    ],
    competitiveExams: [
      { name: 'UGC NET (Computer Science & Applications)', desc: 'National qualification for Assistant Professor in universities and MCA colleges.', authority: 'NTA', url: 'https://ugcnet.nta.ac.in' },
      { name: 'NIC (National Informatics Centre) Scientist B', desc: 'Prestigious central government technical scientist post designing national e-governance.', authority: 'NIC / NIELIT', url: 'https://www.nic.in' },
      { name: 'IBPS IT Specialist Officer (Scale I / II)', desc: 'Lead IT officer managing data centers and security in Public Sector Banks.', authority: 'IBPS', url: 'https://www.ibps.in' },
      { name: 'ISRO / DRDO Scientist B (Computer Science)', desc: 'Satellite software, cyber defense, and aerospace computational systems.', authority: 'Govt of India', url: 'https://www.isro.gov.in' }
    ],
    higherStudies: [
      { title: 'Ph.D in Computer Science / AI', desc: 'Doctoral research at IITs, NITs, or central universities for research and academic roles.', icon: 'GraduationCap' },
      { title: 'Executive MBA in Tech Management', desc: 'Accelerate toward CTO, VP of Engineering, or Chief Information Security Officer (CISO).', icon: 'Briefcase' }
    ],
    skills: ['Advanced System Design & Scalability', 'Data Structures & Algorithms', 'Microservices & Containerization', 'Cloud Architecture (AWS / Azure)'],
    salaryRanges: [
      { role: 'Software Engineer (Fresher MCA)', range: '5 - 12 LPA' },
      { role: 'Senior Software Engineer (3+ yrs)', range: '14 - 28 LPA+' },
      { role: 'Government IT Officer (NIC / Bank)', range: '9 - 14 LPA (CTC)' }
    ],
    usefulTips: ['MCA graduates are eligible for UGC NET Computer Science to secure assistant professorships.']
  },

  // ==========================================================================
  // M.SC (MASTER OF SCIENCE)
  // ==========================================================================
  'msc': {
    courseTitle: 'M.Sc After Graduation',
    subtitle: 'Explore doctoral research, scientific officer appointments, analytics, academic professorships, and industry labs.',
    careerOpportunities: [
      { role: 'Research Scientist', desc: 'Develop novel compounds, mathematical models, or biological discoveries in industrial R&D.', icon: 'FlaskConical' },
      { role: 'Data Scientist / Quantitative Analyst', desc: 'Apply mathematical and statistical models to finance, tech, and big data problems.', icon: 'BarChart2' },
      { role: 'Assistant Professor / College Lecturer', desc: 'Teach undergraduate and postgraduate science cohorts in colleges and universities.', icon: 'BookOpen' }
    ],
    competitiveExams: [
      { name: 'CSIR UGC NET (JRF & Lectureship)', desc: 'Mandatory national benchmark for university teaching and research fellowships in sciences.', authority: 'NTA / CSIR', url: 'https://csirnet.nta.ac.in' },
      { name: 'GATE (For Sciences)', desc: 'GATE in Physics, Chemistry, Mathematics opens PhD admissions at IITs and scientist posts at BARC/ONGC.', authority: 'IITs', url: 'https://gate2025.iitr.ac.in' },
      { name: 'BARC OCES / DGFS (Scientific Officer)', desc: 'Premier atomic research scientist training and permanent absorption.', authority: 'BARC', url: 'https://www.barc.gov.in' }
    ],
    higherStudies: [
      { title: 'Ph.D (India & Abroad)', desc: '5-year doctoral research with JRF/SRF stipend (₹37,000 to ₹42,000/month).', icon: 'GraduationCap' },
      { title: 'Post-Doctoral Fellowships in Europe / USA', desc: 'International research appointments at world-leading laboratories.', icon: 'Globe' }
    ],
    skills: ['Advanced Scientific Research', 'Statistical Computing (R, Python)', 'Laboratory Instrumentation', 'Scientific Paper Publishing'],
    salaryRanges: [
      { role: 'Research Chemist / Biologist', range: '4 - 7.5 LPA' },
      { role: 'Data Scientist (Maths/Stats background)', range: '7 - 15 LPA' },
      { role: 'Assistant Professor (UGC Scale)', range: '8 - 14 LPA (CTC)' }
    ],
    usefulTips: ['Clearing CSIR NET with JRF provides a guaranteed monthly fellowship during your PhD.']
  },

  // ==========================================================================
  // LAW (LLB)
  // ==========================================================================
  'llb': {
    courseTitle: 'Law (LLB) After Graduation',
    subtitle: 'Explore litigation, judiciary, corporate law, legal compliance, and civil services after LLB.',
    careerOpportunities: [
      { role: 'Corporate Legal Counsel', desc: 'Draft commercial contracts, M&A agreements, and advise on corporate governance.', icon: 'Briefcase' },
      { role: 'Litigation Advocate', desc: 'Represent clients in District Courts, High Courts, and the Supreme Court of India.', icon: 'Scale' },
      { role: 'Judicial Magistrate / Civil Judge', desc: 'Preside over court proceedings, legal dispute adjudication, and judicial decisions.', icon: 'Award' },
      { role: 'Legal & Regulatory Compliance Officer', desc: 'Ensure company policies comply with SEBI, RBI, labor laws, and data protection rules.', icon: 'Shield' }
    ],
    competitiveExams: [
      { name: 'State Judicial Services Exam (PCS-J)', desc: 'Civil Judge Junior Division / Judicial Magistrate post in state high court judiciary.', authority: 'State High Courts', url: 'https://uppsc.up.nic.in' },
      { name: 'UPSC Civil Services', desc: 'IAS, IPS, and administrative roles; law is one of the highest-scoring optional subjects.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'SEBI Grade A (Legal)', desc: 'Legal officer in India’s capital markets regulator managing enforcement and securities law.', authority: 'SEBI', url: 'https://www.sebi.gov.in' },
      { name: 'IBPS Law Officer (Scale I / II)', desc: 'Specialist Law Officer in Public Sector Commercial Banks.', authority: 'IBPS', url: 'https://www.ibps.in' },
      { name: 'Army JAG (Judge Advocate General)', desc: 'Commissioned legal officer branch in the Indian Armed Forces.', authority: 'Indian Army', url: 'https://joinindianarmy.nic.in' }
    ],
    higherStudies: [
      { title: 'LLM (Master of Laws in India / Abroad)', desc: 'Specialized 1-year or 2-year postgraduate degree via CLAT PG.', icon: 'GraduationCap' },
      { title: 'Ph.D in Law', desc: 'Academic professorships and constitutional law research.', icon: 'BookOpen' }
    ],
    skills: ['Legal Drafting & Conveyancing', 'Case Precedent Research & Analysis', 'Oral Argumentation & Moot Court', 'Corporate Contract Negotiation'],
    salaryRanges: [
      { role: 'Junior Associate (Law Firm)', range: '4 - 9 LPA' },
      { role: 'Corporate Legal Counsel', range: '8 - 20 LPA+' },
      { role: 'Civil Judge (PCS-J)', range: '9 - 15 LPA (CTC)' }
    ],
    usefulTips: [
      'Enroll with the State Bar Council and clear the All India Bar Examination (AIBE) to obtain your Certificate of Practice.',
      'Judicial Services (PCS-J) allows direct entry into judicial magistrate bench positions without prior litigation tenure requirements in most states.'
    ]
  },

  // ==========================================================================
  // MBBS
  // ==========================================================================
  'mbbs': {
    courseTitle: 'MBBS After Graduation',
    subtitle: 'Explore clinical specialization, medical officer posts, hospital administration, and global licensing exams.',
    careerOpportunities: [
      { role: 'Medical Officer (Primary Healthcare)', desc: 'Diagnose illnesses, prescribe treatments, and manage primary community clinics.', icon: 'Stethoscope' },
      { role: 'Clinical Specialist (MD / MS)', desc: 'Specialized diagnosis in internal medicine, surgery, pediatrics, or cardiology.', icon: 'Heart' },
      { role: 'Hospital & Healthcare Administrator', desc: 'Direct medical operations, clinical governance, and emergency response infrastructure.', icon: 'Building' }
    ],
    competitiveExams: [
      { name: 'NEET PG / NExT Examination', desc: 'Mandatory national exam for admission into MD, MS, and DNB postgraduate clinical seats.', authority: 'NBE', url: 'https://natboard.edu.in' },
      { name: 'INI-CET (AIIMS, PGI, JIPMER, NIMHANS)', desc: 'Premier institutional exam for post-graduate clinical seats at institutes of national importance.', authority: 'AIIMS', url: 'https://www.aiimsexams.ac.in' },
      { name: 'UPSC Combined Medical Services (CMS)', desc: 'Central Health Service (CHS), Railways, and municipal medical officer positions.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'USMLE (United States Medical Licensing Exam)', desc: 'Licensing steps to pursue medical residency and practice in the United States.', authority: 'FSMB & NBME', url: 'https://www.usmle.org' },
      { name: 'PLAB / UKMLA (United Kingdom)', desc: 'Licensing pathway to practice with the National Health Service (NHS) in the UK.', authority: 'GMC', url: 'https://www.gmc-uk.org' }
    ],
    higherStudies: [
      { title: 'MD (Doctor of Medicine) / MS (Master of Surgery)', desc: '3-year core clinical specialization in internal medicine, surgery, pediatrics, or obstetrics.', icon: 'GraduationCap' },
      { title: 'Master of Public Health (MPH)', desc: 'Global health policy, epidemiology, and disease surveillance programs worldwide.', icon: 'Globe' },
      { title: 'MBA in Hospital & Healthcare Management', desc: 'Lead multispecialty corporate hospitals and healthcare conglomerates.', icon: 'Briefcase' }
    ],
    skills: ['Clinical Diagnosis & Patient Care', 'Pharmacology & Prescription Safety', 'Emergency Life Support (BLS / ACLS)', 'Medical Ethics & Documentation'],
    salaryRanges: [
      { role: 'Junior Resident (MBBS Fresher)', range: '6 - 10 LPA' },
      { role: 'UPSC Medical Officer (CMS)', range: '10 - 15 LPA (CTC)' },
      { role: 'MD / MS Specialist Doctor', range: '15 - 35 LPA+' }
    ],
    usefulTips: ['Prepare early for NEET PG / NExT during your internship year to secure preferred clinical seats.']
  },

  // ==========================================================================
  // OTHER COURSES
  // ==========================================================================
  'other': {
    courseTitle: 'General Graduate Career Guidance',
    subtitle: 'Explore competitive government exams, digital skills, professional diplomas, and career paths open to any recognized graduate degree.',
    careerOpportunities: [
      { role: 'Government Civil Servant / Officer', desc: 'Join administrative, municipal, or revenue wings through open competitive exams.', icon: 'Award' },
      { role: 'Corporate Operations Executive', desc: 'Coordinate day-to-day business operations, customer success, and vendor logistics.', icon: 'Briefcase' },
      { role: 'Digital Marketing & Content Creator', desc: 'Build brand presence through SEO, social media, copywriting, and performance marketing.', icon: 'Globe' },
      { role: 'Data Entry & Business Support Specialist', desc: 'Process enterprise data pipelines, records management, and CRM documentation.', icon: 'FileText' }
    ],
    competitiveExams: [
      { name: 'UPSC Civil Services (IAS, IPS, IRS)', desc: 'Open to ANY graduate degree from a recognized university.', authority: 'UPSC', url: 'https://upsc.gov.in' },
      { name: 'SSC CGL (Combined Graduate Level)', desc: 'Thousands of central government inspector, auditor, and assistant posts every year.', authority: 'SSC', url: 'https://ssc.gov.in' },
      { name: 'IBPS Bank PO / Clerk', desc: 'Open to graduates of all disciplines with aptitude in reasoning and quantitative math.', authority: 'IBPS', url: 'https://www.ibps.in' },
      { name: 'State Public Service Commission (State PSC)', desc: 'Administrative posts across state revenue, police, and development departments.', authority: 'State PSC', url: 'https://uppsc.up.nic.in' },
      { name: 'Combined Defence Services (CDS / AFCAT)', desc: 'Commissioned Officer in the Indian Army, Navy, or Air Force.', authority: 'Indian Armed Forces', url: 'https://joinindianarmy.nic.in' }
    ],
    higherStudies: [
      { title: 'MBA via CAT / XAT / CMAT', desc: 'Open to graduates of any discipline; premier launchpad into corporate leadership.', icon: 'Briefcase' },
      { title: '3-Year LLB (Bachelor of Laws)', desc: 'Open to all graduates; enter legal practice or corporate law advisory.', icon: 'Scale' },
      { title: 'Post-Graduate Diplomas (Digital Marketing, HR, Analytics)', desc: '1-year specialized job-oriented diplomas.', icon: 'Award' }
    ],
    skills: ['Communication & English Proficiency', 'Digital Literacy & MS Office Suite', 'Quantitative Aptitude & Logical Reasoning', 'General Awareness & Current Affairs'],
    salaryRanges: [
      { role: 'Operations Associate (Fresher)', range: '3 - 5 LPA' },
      { role: 'Bank PO (Public Sector)', range: '7.5 - 9.5 LPA' },
      { role: 'SSC CGL Officer', range: '7 - 12 LPA (CTC)' }
    ],
    usefulTips: [
      'Over 70% of prestigious government examinations (UPSC, SSC CGL, Banking, State PSC, CDS) require ANY recognized graduate degree.',
      'Developing strong quantitative aptitude, reasoning, and English grammar makes you competitive for thousands of annual vacancies.'
    ]
  }
};

/**
 * Helper to fetch guidance data based on selected course and branch
 */
export function getGuidanceData(courseId, branchId = 'cse') {
  if (courseId === 'btech') {
    const key = `btech:${branchId}`;
    return COMPETITIVE_EXAMS_DATA[key] || COMPETITIVE_EXAMS_DATA['btech:cse'];
  }
  return COMPETITIVE_EXAMS_DATA[courseId] || COMPETITIVE_EXAMS_DATA['other'];
}
