import { btechCatalogData } from './btechCatalogData.js';
import { normalizeCourseKey as mapNormalizeCourseKey, AVAILABLE_COURSES, COURSE_CONFIG, normalizeYearStr } from './courseMapping.ts';

// Comprehensive Course Catalog & Architecture Definition for ProfessorVirus
// Covers B.Tech, MCA, MBA, and B.Pharm with unified metadata, navigation flows, and curriculum

export const COURSES = [{
    id: 'btech',
    key: 'B.Tech',
    name: 'B.Tech',
    fullName: 'Bachelor of Technology',
    tagline: 'Build Innovate Create !',
    description: 'For future engineers, innovators and problem solvers.',
    badgeColor: '#0F766E',
    btnColor: '#0D9488',
    btnHover: '#0F766E',
    bgGradient: 'linear-gradient(180deg, #F0FDFA 0%, #FFFFFF 100%)',
    borderColor: '#99F6E4',
    filterType: 'branch_year',
    branches: [
      { id: 'CSE', name: 'Computer Science & Engineering', short: 'CSE' },
      { id: 'ECE', name: 'Electronics & Communication', short: 'ECE' },
      { id: 'ME', name: 'Mechanical Engineering', short: 'ME' },
      { id: 'CE', name: 'Civil Engineering', short: 'CE' },
      { id: 'IT', name: 'Information Technology', short: 'IT' },
      { id: 'EE', name: 'Electrical Engineering', short: 'EE' },
      { id: 'AI & ML', name: 'Artificial Intelligence & ML', short: 'AI & ML' },
      { id: 'DS', name: 'Data Science', short: 'DS' }
    ],
    years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    semestersByYear: {
      '1st Year': ['All Semesters', 'Semester 1', 'Semester 2'],
      '2nd Year': ['All Semesters', 'Semester 3', 'Semester 4'],
      '3rd Year': ['All Semesters', 'Semester 5', 'Semester 6'],
      '4th Year': ['All Semesters', 'Semester 7', 'Semester 8']
    },
    units: [1, 2, 3, 4, 5]
  },
{
    id: 'mtech',
    key: 'MTech',
    name: 'MTech',
    fullName: 'Master of Technology',
    tagline: 'Research Innovate Specialize !',
    description: 'Advanced engineering research, specialized technical topics, and publications.',
    badgeColor: '#DC2626',
    btnColor: '#DC2626',
    btnHover: '#B91C1C',
    bgGradient: 'linear-gradient(180deg, #FEF2F2 0%, #FFFFFF 100%)',
    borderColor: '#FECACA',
    filterType: 'branch_year',
    branches: [
      { id: 'CSE', name: 'Computer Science & Engineering', short: 'CSE' },
      { id: 'VLSI', name: 'VLSI Design', short: 'VLSI' },
      { id: 'ECE', name: 'Electronics & Communication', short: 'ECE' }
    ],
    years: ['1st Year', '2nd Year'],
    semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'],
    units: [1, 2, 3, 4, 5],
    subjectsBySemester: {
      'Semester 1': [
        { code: 'MTCS101', name: 'Advanced Algorithms & Complexity' },
        { code: 'MTCS102', name: 'Advanced Computer Architecture' },
        { code: 'MTCS103', name: 'Machine Learning & Pattern Recognition' },
        { code: 'MTCS104', name: 'Research Methodology & IPR' }
      ],
      'Semester 2': [
        { code: 'MTCS201', name: 'Advanced Distributed Systems' },
        { code: 'MTCS202', name: 'Deep Learning & Neural Networks' },
        { code: 'MTCS203', name: 'Cloud Computing Architecture' },
        { code: 'MTCS204', name: 'Elective: High Performance Computing' }
      ],
      'Semester 3': [
        { code: 'MTCS301', name: 'Dissertation Phase - I' },
        { code: 'MTCS302', name: 'Specialized Technical Seminar' }
      ],
      'Semester 4': [
        { code: 'MTCS401', name: 'Dissertation Phase - II & Final Defense' }
      ]
    }
  },
{
    id: 'bca',
    key: 'BCA',
    name: 'BCA',
    fullName: 'Bachelor of Computer Applications',
    tagline: 'Code Create Connect !',
    description: 'Build robust fundamentals in software, web technologies, and computing applications.',
    badgeColor: '#0284C7',
    btnColor: '#0284C7',
    btnHover: '#0369A1',
    bgGradient: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
    borderColor: '#BAE6FD',
    filterType: 'semester',
    years: ['1st Year', '2nd Year', '3rd Year'],
    semestersByYear: {
      '1st Year': ['Semester 1', 'Semester 2'],
      '2nd Year': ['Semester 3', 'Semester 4'],
      '3rd Year': ['Semester 5', 'Semester 6']
    },
    semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'],
    units: [1, 2, 3, 4, 5],
    subjectsBySemester: {
      'Semester 1': [
        { code: 'BCA-101', name: 'Mathematics - I' },
        { code: 'BCA-102', name: 'Programming Principle & Algorithm' },
        { code: 'BCA-103', name: 'Computer Fundamentals & Office Automation' },
        { code: 'BCA-104', name: 'Principle of Management' },
        { code: 'BCA-105', name: 'Business Communication' }
      ],
      'Semester 2': [
        { code: 'BCA-201', name: 'Mathematics - II' },
        { code: 'BCA-202', name: 'Data Structure Using C' },
        { code: 'BCA-203', name: 'Digital Electronics & Computer Architecture' },
        { code: 'BCA-204', name: 'Financial Accounting & Management' },
        { code: 'BCA-205', name: 'Environmental Studies' }
      ],
      'Semester 3': [
        { code: 'BCA-301', name: 'Object Oriented Programming Using C++' },
        { code: 'BCA-302', name: 'Database Management System (DBMS)' },
        { code: 'BCA-303', name: 'Operating System' },
        { code: 'BCA-304', name: 'Data Communication & Computer Networks' },
        { code: 'BCA-305', name: 'Indian Constitution & Human Values' }
      ],
      'Semester 4': [
        { code: 'BCA-401', name: 'Web Designing & Internet Technologies' },
        { code: 'BCA-402', name: 'Software Engineering' },
        { code: 'BCA-403', name: 'Computer Graphics & Multimedia' },
        { code: 'BCA-404', name: 'Optimization Techniques' },
        { code: 'BCA-405', name: 'Python Programming' }
      ],
      'Semester 5': [
        { code: 'BCA-501', name: 'Java Programming & J2EE' },
        { code: 'BCA-502', name: 'Network Security & Cryptography' },
        { code: 'BCA-503', name: 'Cloud Computing Technologies' },
        { code: 'BCA-504', name: 'Numerical Analysis & Statistical Techniques' },
        { code: 'BCA-505', name: 'Web Application Development with PHP/Node' }
      ],
      'Semester 6': [
        { code: 'BCA-601', name: 'Information Security & Cyber Laws' },
        { code: 'BCA-602', name: 'Mobile Application Development (Android)' },
        { code: 'BCA-603', name: 'E-Commerce & Digital Governance' },
        { code: 'BCA-604', name: 'Major Project & Viva-Voce' }
      ]
    }
  },
{
    id: 'mca',
    key: 'MCA',
    name: 'MCA',
    fullName: 'Master of Computer Applications',
    tagline: 'Code Learn Lead !',
    description: 'Build your career in software, applications and beyond.',
    badgeColor: '#1E40AF',
    btnColor: '#2563EB',
    btnHover: '#1D4ED8',
    bgGradient: 'linear-gradient(180deg, #F0F5FF 0%, #FFFFFF 100%)',
    borderColor: '#BFDBFE',
    filterType: 'semester',
    semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'],
    units: [1, 2, 3, 4, 5],
    subjectsBySemester: {
      'Semester 1': [
        { code: 'BMC101', name: 'Fundamental of Computers & Emerging Technologies' },
        { code: 'BMC102', name: 'Problem Solving using C' },
        { code: 'BMC103', name: 'Principles of Management & Communication' },
        { code: 'BMC104', name: 'Discrete Mathematics' },
        { code: 'BMC105', name: 'Computer Organization & Architecture' },
        { code: 'KCA-CS', name: 'Cyber Security' }
      ],
      'Semester 2': [
        { code: 'KCA201', name: 'Object Oriented Programming' },
        { code: 'KCA202', name: 'Operating Systems' },
        { code: 'KCA203', name: 'Database Management Systems' },
        { code: 'KCA204', name: 'Web Technologies' },
        { code: 'KCA205', name: 'Software Engineering' },
        { code: 'KCA-DSA', name: 'Data Structures & Analysis of Algorithms' }
      ],
      'Semester 3': [
        { code: 'KCA301', name: 'Artificial Intelligence & Machine Learning' },
        { code: 'KCA302', name: 'Computer Networks' },
        { code: 'KCA303', name: 'Cloud Computing' },
        { code: 'KCA304', name: 'Design and Analysis of Algorithms' },
        { code: 'KCA305', name: 'Data Analytics' }
      ],
      'Semester 4': [
        { code: 'KCA401', name: 'Major Project & Seminar' },
        { code: 'KCA402', name: 'DevOps & Agile Methodology' },
        { code: 'KCA403', name: 'Advanced Web Development' },
        { code: 'KCA404', name: 'Information & Cyber Security' }
      ]
    }
  },
{
    id: 'bba',
    key: 'BBA',
    name: 'BBA',
    fullName: 'Bachelor of Business Administration',
    tagline: 'Lead Strategize Grow !',
    description: 'Management fundamentals, business principles, and leadership skills.',
    badgeColor: '#7C3AED',
    btnColor: '#7C3AED',
    btnHover: '#6D28D9',
    bgGradient: 'linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)',
    borderColor: '#DDD6FE',
    filterType: 'semester',
    years: ['1st Year', '2nd Year', '3rd Year'],
    semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'],
    units: [1, 2, 3, 4, 5],
    subjectsBySemester: {
      'Semester 1': [
        { code: 'BBA101', name: 'Principles of Management' },
        { code: 'BBA102', name: 'Business Economics' },
        { code: 'BBA103', name: 'Basic Accounting' },
        { code: 'BBA104', name: 'Business Communication' },
        { code: 'BBA105', name: 'Computer Fundamentals' }
      ],
      'Semester 2': [
        { code: 'BBA201', name: 'Organizational Behavior' },
        { code: 'BBA202', name: 'Business Statistics' },
        { code: 'BBA203', name: 'Financial Management' },
        { code: 'BBA204', name: 'Marketing Management' },
        { code: 'BBA205', name: 'Business Law' }
      ],
      'Semester 3': [
        { code: 'BBA301', name: 'Human Resource Management' },
        { code: 'BBA302', name: 'Cost Accounting' },
        { code: 'BBA303', name: 'Operations Research' },
        { code: 'BBA304', name: 'Management Information Systems' },
        { code: 'BBA305', name: 'Environmental Studies' }
      ],
      'Semester 4': [
        { code: 'BBA401', name: 'Research Methodology' },
        { code: 'BBA402', name: 'Financial Markets & Institutions' },
        { code: 'BBA403', name: 'Advertising & Sales Promotion' },
        { code: 'BBA404', name: 'Consumer Behaviour' },
        { code: 'BBA405', name: 'Income Tax Law' }
      ],
      'Semester 5': [
        { code: 'BBA501', name: 'Strategic Management' },
        { code: 'BBA502', name: 'Entrepreneurship Development' },
        { code: 'BBA503', name: 'International Business' },
        { code: 'BBA504', name: 'Project Management' },
        { code: 'BBA505', name: 'Digital Marketing' }
      ],
      'Semester 6': [
        { code: 'BBA601', name: 'Business Policy' },
        { code: 'BBA602', name: 'Corporate Governance & Ethics' },
        { code: 'BBA603', name: 'Retail Management' },
        { code: 'BBA604', name: 'Major Project & Comprehensive Viva' }
      ]
    }
  },
{
    id: 'mba',
    key: 'MBA',
    name: 'MBA',
    fullName: 'Master of Business Administration',
    tagline: 'Think Plan Lead !',
    description: 'Learn to lead, manage and create impact.',
    badgeColor: '#92400E',
    btnColor: '#B45309',
    btnHover: '#92400E',
    bgGradient: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)',
    borderColor: '#FDE68A',
    filterType: 'semester_specialization',
    semesters: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'],
    specializations: [
      'Core Management',
      'Marketing',
      'Finance',
      'Human Resources',
      'Operations & Supply Chain',
      'Information Technology',
      'International Business',
      'Co-Operative Management'
    ],
    units: [1, 2, 3, 4, 5],
    subjectsBySemester: {
      'Semester 1': [
        { code: 'BMB101', name: 'Management Concepts & Organisational Behaviour', spec: 'Core Management' },
        { code: 'BMB102', name: 'Managerial Economics', spec: 'Core Management' },
        { code: 'BMB103', name: 'Financial Accounting & Analysis', spec: 'Core Management' },
        { code: 'BMB104', name: 'Business Statistics & Analytics', spec: 'Core Management' },
        { code: 'BMB105', name: 'Marketing Management', spec: 'Core Management' },
        { code: 'BMB106', name: 'Creativity, Innovation and Entrepreneurship', spec: 'Core Management' },
        { code: 'BMB107', name: 'Business Communication', spec: 'Core Management' },
        { code: 'BMB151', name: 'IT Skills – I', spec: 'Core Management' }
      ],
      'Semester 2': [
        { code: 'BMB201', name: 'Business Environment & Legal Aspects of Business', spec: 'Core Management' },
        { code: 'BMB202', name: 'Human Resource Management', spec: 'Core Management' },
        { code: 'BMB203', name: 'Corporate Financial Management', spec: 'Core Management' },
        { code: 'BMB204', name: 'Operations Management', spec: 'Core Management' },
        { code: 'BMB205', name: 'Quantitative Techniques for Managers', spec: 'Core Management' },
        { code: 'BMB206', name: 'Business Research Methods', spec: 'Core Management' }
      ],
      'Semester 3': [
        // Core
        { code: 'BMB301', name: 'Strategic Management', spec: 'Core Management' },
        // Marketing
        { code: 'BMBMK01', name: 'Consumer Behaviour and Neuro Marketing', spec: 'Marketing' },
        { code: 'BMBMK02', name: 'Marketing & Web Analytics', spec: 'Marketing' },
        { code: 'BMBMK03', name: 'Sales and Distribution Management', spec: 'Marketing' },
        // Finance
        { code: 'BMBFM01', name: 'Investment and Portfolio Management', spec: 'Finance' },
        { code: 'BMBFM02', name: 'Tax Planning and Management', spec: 'Finance' },
        { code: 'BMBFM03', name: 'Financial and Credit Risk Analysis', spec: 'Finance' },
        // HR
        { code: 'BMBHR01', name: 'Talent Acquisition Management', spec: 'Human Resources' },
        { code: 'BMBHR02', name: 'Employee Relations and Labour Laws', spec: 'Human Resources' },
        { code: 'BMBHR03', name: 'Performance and Reward Management', spec: 'Human Resources' },
        // Operations & Supply Chain
        { code: 'BMBOM01', name: 'Supply Chain and Logistics Management', spec: 'Operations & Supply Chain' },
        { code: 'BMBOM02', name: 'Business Process Reengineering', spec: 'Operations & Supply Chain' },
        { code: 'BMBOM03', name: 'Quality Management', spec: 'Operations & Supply Chain' },
        // IT
        { code: 'BMBIT01', name: 'Software Engineering and Management', spec: 'Information Technology' },
        { code: 'BMBIT02', name: 'Emerging Technologies for Business', spec: 'Information Technology' },
        { code: 'BMBIT03', name: 'Database Management System', spec: 'Information Technology' },
        // IB
        { code: 'BMBIB01', name: 'International Business Management', spec: 'International Business' },
        { code: 'BMBIB02', name: 'Export Import Documentation', spec: 'International Business' },
        { code: 'BMBIB03', name: 'Geo-Politics and Trade', spec: 'International Business' },
        // Co-Operative Management
        { code: 'BMBCM01', name: 'Principles and Practices of Co-Operation', spec: 'Co-Operative Management' },
        { code: 'BMBCM02', name: 'Co-Operative Legislation', spec: 'Co-Operative Management' },
        { code: 'BMBCM03', name: 'Credit Co-Operatives', spec: 'Co-Operative Management' }
      ],
      'Semester 4': [
        // Marketing
        { code: 'BMBMK04', name: 'Sales & Distribution Management', spec: 'Marketing' },
        { code: 'BMBMK05', name: 'Strategic Brand Management', spec: 'Marketing' },
        // Finance
        { code: 'BMBFM04', name: 'International Financial Management', spec: 'Finance' },
        { code: 'BMBFM05', name: 'Financial Derivatives & Risk Management', spec: 'Finance' },
        // HR
        { code: 'BMBHR04', name: 'Strategic Human Resource Management', spec: 'Human Resources' },
        { code: 'BMBHR05', name: 'Organizational Change & Cross-Cultural HRM', spec: 'Human Resources' },
        // Operations
        { code: 'BMBOM04', name: 'Operations Planning & Inventory Control', spec: 'Operations & Supply Chain' },
        { code: 'BMBOM05', name: 'World Class Manufacturing', spec: 'Operations & Supply Chain' },
        // IT
        { code: 'BMBIT04', name: 'Cloud Computing & Cyber Security for Business', spec: 'Information Technology' },
        { code: 'BMBIT05', name: 'IT Strategy & Project Governance', spec: 'Information Technology' },
        // IB
        { code: 'BMBIB04', name: 'Global Logistics & Supply Chain', spec: 'International Business' },
        { code: 'BMBIB05', name: 'International Financial Markets', spec: 'International Business' }
      ]
    }
  },
{
    id: 'bpharm',
    key: 'B.Pharm',
    name: 'B.Pharm',
    fullName: 'Bachelor of Pharmacy',
    tagline: 'Research Heal Serve !',
    description: 'For a healthier tomorrow through knowledge and care.',
    badgeColor: '#9D174D',
    btnColor: '#BE185D',
    btnHover: '#9D174D',
    bgGradient: 'linear-gradient(180deg, #FDF2F8 0%, #FFFFFF 100%)',
    borderColor: '#FBCFE8',
    filterType: 'semester_resource',
    semesters: [
      'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
      'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
    ],
    resourceTypes: [
      'Notes',
      'Practical/Lab Manuals',
      'Quantum',
      'Syllabus',
      'Extra Resources'
    ],
    units: [1, 2, 3, 4, 5],
    subjectsBySemester: {
      'Semester 1': [
        { code: 'BP101T', name: 'Human Anatomy and Physiology I' },
        { code: 'BP102T', name: 'Pharmaceutical Analysis I' },
        { code: 'BP103T', name: 'Pharmaceutics I' },
        { code: 'BP104T', name: 'Pharmaceutical Inorganic Chemistry' },
        { code: 'BP105T', name: 'Communication Skills' },
        { code: 'BP106RBT', name: 'Remedial Biology' },
        { code: 'BP106RMT', name: 'Remedial Mathematics' }
      ],
      'Semester 2': [
        { code: 'BP201T', name: 'Human Anatomy and Physiology II' },
        { code: 'BP202T', name: 'Pharmaceutical Organic Chemistry I' },
        { code: 'BP203T', name: 'Biochemistry' },
        { code: 'BP204T', name: 'Pathophysiology' },
        { code: 'BP205T', name: 'Computer Applications in Pharmacy' },
        { code: 'BP206T', name: 'Environmental Sciences' }
      ],
      'Semester 3': [
        { code: 'BP301T', name: 'Pharmaceutical Organic Chemistry II' },
        { code: 'BP302T', name: 'Physical Pharmaceutics I' },
        { code: 'BP303T', name: 'Pharmaceutical Microbiology' },
        { code: 'BP304T', name: 'Pharmaceutical Engineering' },
        { code: 'KVE301', name: 'Universal Human Values and Professional Ethics' }
      ],
      'Semester 4': [
        { code: 'BP401T', name: 'Pharmaceutical Organic Chemistry III' },
        { code: 'BP402T', name: 'Medicinal Chemistry I' },
        { code: 'BP403T', name: 'Physical Pharmaceutics II' },
        { code: 'BP404T', name: 'Pharmacology I' },
        { code: 'BP405T', name: 'Pharmacognosy & Phytochemistry I' }
      ],
      'Semester 5': [
        { code: 'BP501T', name: 'Medicinal Chemistry II' },
        { code: 'BP502T', name: 'Industrial Pharmacy I' },
        { code: 'BP503T', name: 'Pharmacology II' },
        { code: 'BP504T', name: 'Pharmacognosy and Phytochemistry II' },
        { code: 'BP505T', name: 'Pharmaceutical Jurisprudence' }
      ],
      'Semester 6': [
        { code: 'BP601T', name: 'Medicinal Chemistry III' },
        { code: 'BP602T', name: 'Pharmacology III' },
        { code: 'BP603T', name: 'Herbal Drug Technology' },
        { code: 'BP604T', name: 'Biopharmaceutics and Pharmacokinetics' },
        { code: 'BP605T', name: 'Pharmaceutical Biotechnology' },
        { code: 'BP606T', name: 'Quality Assurance' }
      ],
      'Semester 7': [
        { code: 'BP701T', name: 'Instrumental Methods of Analysis' },
        { code: 'BP702T', name: 'Industrial Pharmacy II' },
        { code: 'BP703T', name: 'Pharmacy Practice' },
        { code: 'BP704T', name: 'Novel Drug Delivery System' }
      ],
      'Semester 8': [
        { code: 'BP801T', name: 'Biostatistics and Research Methodology' },
        { code: 'BP802T', name: 'Social and Preventive Pharmacy' },
        { code: 'BP803ET', name: 'Pharma Marketing Management' },
        { code: 'BP804ET', name: 'Pharmaceutical Regulatory Science' },
        { code: 'BP805ET', name: 'Pharmacovigilance' },
        { code: 'BP806ET', name: 'Quality Control and Standardization of Herbal Drugs' },
        { code: 'BP807ET', name: 'Computer Aided Drug Design' },
        { code: 'BP808ET', name: 'Cell and Molecular Biology' },
        { code: 'BP809ET', name: 'Cosmetic Science' },
        { code: 'BP810ET', name: 'Pharmacological Screening Methods' },
        { code: 'BP811ET', name: 'Advanced Instrumentation Techniques' },
        { code: 'BP812ET', name: 'Dietary Supplements and Nutraceuticals' },
        { code: 'BP813ET', name: 'Pharmaceutical Product Development' }
      ]
    }
  }
];

export function getCourseById(courseId) {
  if (!courseId) return COURSES[0];
  const norm = String(courseId).toLowerCase().replace(/[^a-z0-9]/g, '');
  const existing = COURSES.find(c => c.id === norm || c.key.toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
  if (existing) return existing;

  // Support all 24 AKTU programmes via central courseMapping
  const normKey = mapNormalizeCourseKey(courseId);
  const avail = AVAILABLE_COURSES.find(ac => ac.key === normKey || ac.name.toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
  const cfg = (normKey && COURSE_CONFIG[normKey]) || (avail && COURSE_CONFIG[avail.key]) || null;

  if (avail || cfg) {
    const name = (avail && avail.name) || (cfg && cfg.name) || courseId;
    const fullName = (avail && avail.fullName) || (cfg && cfg.fullName) || name;
    const badgeColor = (avail && avail.badgeColor) || '#0F766E';
    const years = (cfg && cfg.years) || ['1st Year', '2nd Year'];

    let sems = [];
    let subjectsBySemester = {};
    let semestersByYear = {};
    if (cfg && cfg.sems) {
      Object.entries(cfg.sems).forEach(([yr, semNums]) => {
        semestersByYear[yr] = ['All Semesters', ...((semNums || []).map(sn => `Semester ${sn}`))];
        (semNums || []).forEach(sn => {
          const semKey = `Semester ${sn}`;
          if (!sems.includes(semKey)) sems.push(semKey);
          const rawSubs = (cfg.subjects && cfg.subjects[sn]) || [];
          subjectsBySemester[semKey] = rawSubs.map((sub, idx) => {
            if (typeof sub === 'string') {
              const codePrefix = name.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'SUB';
              return { code: `${codePrefix}-${sn}0${idx + 1}`, name: sub };
            }
            return sub;
          });
        });
      });
    }
    if (sems.length === 0) {
      sems = ['Semester 1', 'Semester 2'];
    }

    return {
      id: (avail && avail.key.toLowerCase()) || norm,
      key: (avail && avail.key) || normKey || courseId,
      name,
      fullName,
      tagline: 'AKTU Verified Curriculum',
      description: `Official AKTU syllabus, notes, and academic resources for ${fullName}.`,
      badgeColor,
      btnColor: badgeColor,
      btnHover: badgeColor,
      bgGradient: 'linear-gradient(180deg, #FAF7F2 0%, #FFFFFF 100%)',
      borderColor: '#E8E2D5',
      filterType: 'semester',
      years,
      semesters: sems,
      semestersByYear,
      units: [1, 2, 3, 4, 5],
      subjectsBySemester
    };
  }

  return COURSES[0];
}

export function getCourseMeta(courseKey) {
  return getCourseById(courseKey);
}

export function getSubjectsForCourse(courseKey, semester, specialization = null, year = null, branch = null) {
  const normKey = normalizeCourseKey(courseKey);
  if (normKey === 'B.Tech') {
    let y = year;
    if (!y && semester && semester !== 'All Semesters' && semester !== 'All') {
      const sNum = Number(String(semester).replace(/[^0-9]/g, ''));
      if (sNum === 1 || sNum === 2) y = '1st Year';
      else if (sNum === 3 || sNum === 4) y = '2nd Year';
      else if (sNum === 5 || sNum === 6) y = '3rd Year';
      else if (sNum === 7 || sNum === 8) y = '4th Year';
    }
    if (!y) y = '1st Year';
    const b = branch || 'CSE';
    const yearData = btechCatalogData[y] || btechCatalogData['1st Year'];
    let subjects = (yearData && yearData[b]) ? yearData[b] : [];
    if (semester && semester !== 'All Semesters' && semester !== 'All') {
      const semClean = String(semester).toLowerCase().replace(/[^0-9]/g, '');
      subjects = subjects.filter(s => {
        if (!s.semester) return true;
        const sSemClean = String(s.semester).toLowerCase().replace(/[^0-9]/g, '');
        return sSemClean === semClean;
      });
    }
    return subjects;
  }

  const course = getCourseById(courseKey);
  if (!course || !course.subjectsBySemester) return [];

  if (semester && semester !== 'All Semesters' && semester !== 'All') {
    let semSubjects = course.subjectsBySemester[semester];
    if (!semSubjects) {
      const semDigit = String(semester).replace(/[^0-9]/g, '');
      semSubjects = course.subjectsBySemester[`Semester ${semDigit}`] || course.subjectsBySemester[`Sem ${semDigit}`] || [];
    }
    if (specialization && specialization !== 'All' && specialization !== 'Core Management') {
      return semSubjects.filter(s => !s.spec || s.spec === specialization || s.spec === 'Core Management');
    }
    return semSubjects;
  }

  // If year is specified (e.g. BCA 1st Year, 2nd Year, 3rd Year, Pharm.D 5th Year, etc.)
  if (year) {
    const normYr = normalizeYearStr(year);
    const yearSems = (course.semestersByYear && (course.semestersByYear[year] || course.semestersByYear[normYr])) || [];
    if (yearSems && yearSems.length > 0) {
      let res = [];
      yearSems.forEach(s => {
        if (s !== 'All Semesters' && course.subjectsBySemester[s]) {
          res.push(...course.subjectsBySemester[s]);
        }
      });
      if (res.length > 0) return res;
    }
  }

  // Fallback: return all subjects for this course
  let allSubs = [];
  Object.values(course.subjectsBySemester).forEach(arr => {
    allSubs.push(...arr);
  });
  return allSubs;
}

export function normalizeCourseKey(courseStr) {
  if (!courseStr) return 'B.Tech';
  const norm = mapNormalizeCourseKey(courseStr);
  if (norm === 'BTech') return 'B.Tech';
  if (norm === 'BPharma') return 'B.Pharm';
  if (norm === 'MTech') return 'M.Tech';
  return norm || 'B.Tech';
}
