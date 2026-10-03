import { btechCatalogData } from './btechCatalogData.js';

// Comprehensive Course Catalog & Architecture Definition for ProfessorVirus
// Covers B.Tech, MCA, MBA, and B.Pharm with unified metadata, navigation flows, and curriculum

export const COURSES = [
  {
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
        { code: 'KCA101', name: 'Problem Solving using Python' },
        { code: 'KCA102', name: 'Computer Organization & Architecture' },
        { code: 'KCA103', name: 'Discrete Mathematics' },
        { code: 'KCA104', name: 'Data Structures' },
        { code: 'KCA105', name: 'Principles of Management & Communication' },
        { code: 'KCA-CS', name: 'Cyber Security' },
        { code: 'KCA-FCET', name: 'Fundamental of Computers & Emerging Technologies' }
      ],
      'Semester 2': [
        { code: 'KCA201', name: 'Object Oriented Programming using Java' },
        { code: 'KCA202', name: 'Operating Systems' },
        { code: 'KCA203', name: 'Database Management Systems' },
        { code: 'KCA204', name: 'Web Technologies' },
        { code: 'KCA205', name: 'Software Engineering' }
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
      'International Business'
    ],
    units: [1, 2, 3, 4, 5],
    subjectsBySemester: {
      'Semester 1': [
        { code: 'KMBN101', name: 'Management Concepts & Organisational Behaviour', spec: 'Core Management' },
        { code: 'KMBN102', name: 'Managerial Economics', spec: 'Core Management' },
        { code: 'KMBN103', name: 'Financial Accounting & Analysis', spec: 'Core Management' },
        { code: 'KMBN104', name: 'Business Statistics & Analytics', spec: 'Core Management' },
        { code: 'KMBN105', name: 'Marketing Management', spec: 'Core Management' },
        { code: 'KMBN106', name: 'Design Thinking & Business Communication', spec: 'Core Management' },
        { code: 'KMBN107', name: 'Creativity, Innovation & Entrepreneurship', spec: 'Core Management' }
      ],
      'Semester 2': [
        { code: 'KMBN201', name: 'Business Environment & Legal Aspects of Business', spec: 'Core Management' },
        { code: 'KMBN202', name: 'Human Resource Management', spec: 'Core Management' },
        { code: 'KMBN203', name: 'Corporate Financial Management', spec: 'Core Management' },
        { code: 'KMBN204', name: 'Operations Management', spec: 'Core Management' },
        { code: 'KMBN205', name: 'Quantitative Techniques for Managers', spec: 'Core Management' },
        { code: 'KMBN206', name: 'Business Research Methods', spec: 'Core Management' }
      ],
      'Semester 3': [
        // Marketing
        { code: 'KMBNMK01', name: 'Consumer Behaviour', spec: 'Marketing' },
        { code: 'KMBNMK02', name: 'Marketing Communication & Advertising', spec: 'Marketing' },
        { code: 'KMBNMK03', name: 'Digital & Social Media Marketing', spec: 'Marketing' },
        // Finance
        { code: 'KMBNFM01', name: 'Security Analysis & Portfolio Management', spec: 'Finance' },
        { code: 'KMBNFM02', name: 'Financial Markets & Commercial Banking', spec: 'Finance' },
        { code: 'KMBNFM03', name: 'Corporate Tax Planning & Management', spec: 'Finance' },
        // HR
        { code: 'KMBNHR01', name: 'Talent Management & Acquisition', spec: 'Human Resources' },
        { code: 'KMBNHR02', name: 'Performance Management Systems', spec: 'Human Resources' },
        { code: 'KMBNHR03', name: 'Industrial Relations & Labour Enactments', spec: 'Human Resources' },
        // Operations
        { code: 'KMBNOM01', name: 'Supply Chain & Logistics Management', spec: 'Operations & Supply Chain' },
        { code: 'KMBNOM02', name: 'Total Quality Management & Six Sigma', spec: 'Operations & Supply Chain' },
        { code: 'KMBNOM03', name: 'Project Management', spec: 'Operations & Supply Chain' },
        // IT
        { code: 'KMBNIT01', name: 'Enterprise Resource Planning (ERP)', spec: 'Information Technology' },
        { code: 'KMBNIT02', name: 'Business Intelligence & Data Mining', spec: 'Information Technology' },
        { code: 'KMBNIT03', name: 'E-Commerce & Digital Business Strategy', spec: 'Information Technology' },
        // IB
        { code: 'KMBNIB01', name: 'International Business Management', spec: 'International Business' },
        { code: 'KMBNIB02', name: 'Export-Import Procedures & Documentation', spec: 'International Business' },
        { code: 'KMBNIB03', name: 'International Trade Laws', spec: 'International Business' }
      ],
      'Semester 4': [
        // Marketing
        { code: 'KMBNMK04', name: 'Sales & Distribution Management', spec: 'Marketing' },
        { code: 'KMBNMK05', name: 'Strategic Brand Management', spec: 'Marketing' },
        // Finance
        { code: 'KMBNFM04', name: 'International Financial Management', spec: 'Finance' },
        { code: 'KMBNFM05', name: 'Financial Derivatives & Risk Management', spec: 'Finance' },
        // HR
        { code: 'KMBNHR04', name: 'Strategic Human Resource Management', spec: 'Human Resources' },
        { code: 'KMBNHR05', name: 'Organizational Change & Cross-Cultural HRM', spec: 'Human Resources' },
        // Operations
        { code: 'KMBNOM04', name: 'Operations Planning & Inventory Control', spec: 'Operations & Supply Chain' },
        { code: 'KMBNOM05', name: 'World Class Manufacturing', spec: 'Operations & Supply Chain' },
        // IT
        { code: 'KMBNIT04', name: 'Cloud Computing & Cyber Security for Business', spec: 'Information Technology' },
        { code: 'KMBNIT05', name: 'IT Strategy & Project Governance', spec: 'Information Technology' },
        // IB
        { code: 'KMBNIB04', name: 'Global Logistics & Supply Chain', spec: 'International Business' },
        { code: 'KMBNIB05', name: 'International Financial Markets', spec: 'International Business' }
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
        { code: 'BP101T', name: 'Human Anatomy & Physiology I' },
        { code: 'BP102T', name: 'Pharmaceutical Analysis I' },
        { code: 'BP103T', name: 'Pharmaceutics I' },
        { code: 'BP104T', name: 'Pharmaceutical Inorganic Chemistry' }
      ],
      'Semester 2': [
        { code: 'BP201T', name: 'Human Anatomy & Physiology II' },
        { code: 'BP202T', name: 'Pharmaceutical Organic Chemistry I' },
        { code: 'BP203T', name: 'Biochemistry' },
        { code: 'BP204T', name: 'Pathophysiology' }
      ],
      'Semester 3': [
        { code: 'BP301T', name: 'Pharmaceutical Organic Chemistry II' },
        { code: 'BP302T', name: 'Physical Pharmaceutics I' },
        { code: 'BP303T', name: 'Pharmaceutical Microbiology' },
        { code: 'BP304T', name: 'Pharmaceutical Engineering' }
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
        { code: 'BP504T', name: 'Pharmacognosy & Phytochemistry II' },
        { code: 'BP505T', name: 'Pharmaceutical Jurisprudence' }
      ],
      'Semester 6': [
        { code: 'BP601T', name: 'Medicinal Chemistry III' },
        { code: 'BP602T', name: 'Pharmacology III' },
        { code: 'BP603T', name: 'Herbal Drug Technology' },
        { code: 'BP604T', name: 'Biopharmaceutics & Pharmacokinetics' },
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
        { code: 'BP801T', name: 'Biostatistics & Research Methodology' },
        { code: 'BP802T', name: 'Social & Preventive Pharmacy' },
        { code: 'BP803ET', name: 'Pharma Marketing Management' },
        { code: 'BP804ET', name: 'Pharmaceutical Regulatory Science' },
        { code: 'BP805ET', name: 'Pharmacovigilance' }
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
  }
];

export function getCourseById(courseId) {
  if (!courseId) return COURSES[0];
  const norm = String(courseId).toLowerCase().replace(/[^a-z]/g, '');
  return COURSES.find(c => c.id === norm || c.key.toLowerCase().replace(/[^a-z]/g, '') === norm) || COURSES[0];
}

export function getCourseMeta(courseKey) {
  return getCourseById(courseKey);
}

export function getSubjectsForCourse(courseKey, semester, specialization = null, year = null, branch = null) {
  const normKey = normalizeCourseKey(courseKey);
  if (normKey === 'B.Tech') {
    const y = year || '1st Year';
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
    const semSubjects = course.subjectsBySemester[semester] || [];
    if (specialization && specialization !== 'All' && specialization !== 'Core Management') {
      return semSubjects.filter(s => !s.spec || s.spec === specialization || s.spec === 'Core Management');
    }
    return semSubjects;
  }

  // If year is specified (e.g. BCA 1st Year, 2nd Year, 3rd Year)
  if (year && course.semestersByYear && course.semestersByYear[year]) {
    const yearSems = course.semestersByYear[year];
    let res = [];
    yearSems.forEach(s => {
      if (course.subjectsBySemester[s]) res.push(...course.subjectsBySemester[s]);
    });
    return res;
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
  const s = String(courseStr).toLowerCase().replace(/[^a-z]/g, '');
  if (s === 'bca') return 'BCA';
  if (s === 'mca') return 'MCA';
  if (s === 'mba') return 'MBA';
  if (s === 'bpharm' || s.includes('pharm')) return 'B.Pharm';
  return 'B.Tech';
}
