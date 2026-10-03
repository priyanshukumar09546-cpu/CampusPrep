// Centralized Subject Data Catalog for CampusPrep / ProfessorVirus
// Covers B.Tech, BCA, M.Tech, MCA, MBA, and B.Pharm across all years and semesters

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  course: string;
  branch?: string;
  year: string;
  semester: string;
  description?: string;
  iconBg: string;
  iconColor: string;
  unitsCount?: number;
  pyqsCount?: number;
}

export const ALL_COURSES = [
  {
    id: 'btech',
    key: 'B.Tech',
    name: 'B.Tech',
    fullName: 'Bachelor of Technology',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    branches: ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & ML']
  },
  {
    id: 'bca',
    key: 'BCA',
    name: 'BCA',
    fullName: 'Bachelor of Computer Applications',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    years: ['1st Year', '2nd Year', '3rd Year'],
    branches: ['General']
  },
  {
    id: 'mtech',
    key: 'M.Tech',
    name: 'M.Tech',
    fullName: 'Master of Technology',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    years: ['1st Year', '2nd Year'],
    branches: ['CSE', 'VLSI', 'Mechanical']
  },
  {
    id: 'mca',
    key: 'MCA',
    name: 'MCA',
    fullName: 'Master of Computer Applications',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    years: ['1st Year', '2nd Year'],
    branches: ['General']
  },
  {
    id: 'mba',
    key: 'MBA',
    name: 'MBA',
    fullName: 'Master of Business Administration',
    iconBg: '#FFEDD5',
    iconColor: '#C2410C',
    years: ['1st Year', '2nd Year'],
    branches: ['Marketing', 'Finance', 'HR', 'Operations']
  },
  {
    id: 'bpharm',
    key: 'B.Pharm',
    name: 'B.Pharm',
    fullName: 'Bachelor of Pharmacy',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    branches: ['Pharmacy']
  },
  {
    id: 'bba',
    key: 'BBA',
    name: 'BBA',
    fullName: 'Bachelor of Business Administration',
    iconBg: '#FEF3C7',
    iconColor: '#B45309',
    years: ['1st Year', '2nd Year', '3rd Year'],
    branches: ['General']
  }
];

export const YEARS_CONFIG: Record<string, { year: string; title: string; subtitle: string; iconBg: string; iconColor: string }[]> = {
  'default': [
    { year: '1st Year', title: '1st Year', subtitle: 'Foundation & core subjects', iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { year: '2nd Year', title: '2nd Year', subtitle: 'Core concepts & fundamentals', iconBg: '#FFEDD5', iconColor: '#EA580C' },
    { year: '3rd Year', title: '3rd Year', subtitle: 'Advanced subjects & specializations', iconBg: '#FEE2E2', iconColor: '#E11D48' },
    { year: '4th Year', title: '4th Year', subtitle: 'Projects, electives & placement prep', iconBg: '#EDE9FE', iconColor: '#7C3AED' }
  ],
  'BCA': [
    { year: '1st Year', title: '1st Year', subtitle: 'Foundation & core programming', iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { year: '2nd Year', title: '2nd Year', subtitle: 'Data structures & web fundamentals', iconBg: '#FFEDD5', iconColor: '#EA580C' },
    { year: '3rd Year', title: '3rd Year', subtitle: 'Advanced software & final projects', iconBg: '#FEE2E2', iconColor: '#E11D48' }
  ],
  'MCA': [
    { year: '1st Year', title: '1st Year', subtitle: 'Core computing & algorithmic systems', iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { year: '2nd Year', title: '2nd Year', subtitle: 'Cloud, AI & enterprise architecture', iconBg: '#FFEDD5', iconColor: '#EA580C' }
  ],
  'MBA': [
    { year: '1st Year', title: '1st Year', subtitle: 'General management & organizational principles', iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { year: '2nd Year', title: '2nd Year', subtitle: 'Specializations (Finance, Marketing, HR)', iconBg: '#FFEDD5', iconColor: '#EA580C' }
  ],
  'M.Tech': [
    { year: '1st Year', title: '1st Year', subtitle: 'Advanced algorithms & specialized theory', iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { year: '2nd Year', title: '2nd Year', subtitle: 'Thesis, research & defense', iconBg: '#FFEDD5', iconColor: '#EA580C' }
  ],
  'BBA': [
    { year: '1st Year', title: '1st Year', subtitle: 'Management principles & business economics', iconBg: '#FEE2E2', iconColor: '#DC2626' },
    { year: '2nd Year', title: '2nd Year', subtitle: 'Marketing, HR & corporate financial systems', iconBg: '#FFEDD5', iconColor: '#EA580C' },
    { year: '3rd Year', title: '3rd Year', subtitle: 'Strategic management & entrepreneurship', iconBg: '#FEF3C7', iconColor: '#B45309' }
  ]
};

// Subject mapping by course and year
export const SUBJECTS_CATALOG: SubjectItem[] = [
  // ================= B.TECH 2ND YEAR CSE (AS IN REFERENCE IMAGE) =================
  {
    id: 'bcs202',
    code: 'BCS202',
    name: 'Operating System',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Sem 4',
    description: 'Process management, CPU scheduling, deadlocks, memory virtualization, and file systems.',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    unitsCount: 5,
    pyqsCount: 18
  },
  {
    id: 'bcs203',
    code: 'BCS203',
    name: 'Database Management System',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Sem 3',
    description: 'Relational data models, ER diagrams, SQL, normalization, concurrency control, and transactions.',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    unitsCount: 5,
    pyqsCount: 16
  },
  {
    id: 'bcs204',
    code: 'BCS204',
    name: 'Computer Networks',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Sem 4',
    description: 'OSI and TCP/IP stack, routing protocols, flow control, socket programming, and network security.',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    unitsCount: 5,
    pyqsCount: 14
  },
  {
    id: 'bcs205',
    code: 'BCS205',
    name: 'Design & Analysis of Algorithms',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Sem 4',
    description: 'Divide-and-conquer, greedy techniques, dynamic programming, graph algorithms, and NP-completeness.',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    unitsCount: 5,
    pyqsCount: 15
  },
  {
    id: 'bcs206',
    code: 'BCS206',
    name: 'Theory of Computation',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Sem 4',
    description: 'DFA, NFA, regular expressions, context-free grammars, pushdown automata, and Turing machines.',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    unitsCount: 5,
    pyqsCount: 12
  },
  {
    id: 'bcs207',
    code: 'BCS207',
    name: 'Computer Organization',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Sem 3',
    description: 'Instruction sets, ALU design, memory hierarchy, pipelining, and cache coherence.',
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
    unitsCount: 5,
    pyqsCount: 17
  },

  // ================= B.TECH 1ST YEAR (COMMON) =================
  {
    id: 'kas101',
    code: 'KAS101T',
    name: 'Engineering Physics',
    course: 'B.Tech',
    branch: 'CSE',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    unitsCount: 5,
    pyqsCount: 20
  },
  {
    id: 'kas103',
    code: 'KAS103T',
    name: 'Engineering Mathematics - I',
    course: 'B.Tech',
    branch: 'CSE',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    unitsCount: 5,
    pyqsCount: 22
  },
  {
    id: 'kcs101',
    code: 'KCS101T',
    name: 'Programming for Problem Solving (PPS)',
    course: 'B.Tech',
    branch: 'CSE',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    unitsCount: 5,
    pyqsCount: 19
  },
  {
    id: 'kee101',
    code: 'KEE101T',
    name: 'Basic Electrical Engineering',
    course: 'B.Tech',
    branch: 'CSE',
    year: '1st Year',
    semester: 'Sem 2',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    unitsCount: 5,
    pyqsCount: 18
  },

  // ================= B.TECH 3RD YEAR =================
  {
    id: 'kcs501',
    code: 'KCS501',
    name: 'Software Engineering',
    course: 'B.Tech',
    branch: 'CSE',
    year: '3rd Year',
    semester: 'Sem 5',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    unitsCount: 5,
    pyqsCount: 15
  },
  {
    id: 'kcs502',
    code: 'KCS502',
    name: 'Compiler Design',
    course: 'B.Tech',
    branch: 'CSE',
    year: '3rd Year',
    semester: 'Sem 5',
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
    unitsCount: 5,
    pyqsCount: 14
  },
  {
    id: 'kcs503',
    code: 'KCS503',
    name: 'Web Technology',
    course: 'B.Tech',
    branch: 'CSE',
    year: '3rd Year',
    semester: 'Sem 6',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    unitsCount: 5,
    pyqsCount: 16
  },

  // ================= B.TECH 4TH YEAR =================
  {
    id: 'kcs701',
    code: 'KCS701',
    name: 'Artificial Intelligence',
    course: 'B.Tech',
    branch: 'CSE',
    year: '4th Year',
    semester: 'Sem 7',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    unitsCount: 5,
    pyqsCount: 12
  },
  {
    id: 'kcs702',
    code: 'KCS702',
    name: 'Cloud Computing',
    course: 'B.Tech',
    branch: 'CSE',
    year: '4th Year',
    semester: 'Sem 7',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    unitsCount: 5,
    pyqsCount: 11
  },

  // ================= BCA SUBJECTS =================
  {
    id: 'bca101',
    code: 'BCA-101',
    name: 'Mathematics - I',
    course: 'BCA',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    unitsCount: 5,
    pyqsCount: 12
  },
  {
    id: 'bca102',
    code: 'BCA-102',
    name: 'Programming Principle & Algorithm (C)',
    course: 'BCA',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    unitsCount: 5,
    pyqsCount: 14
  },
  {
    id: 'bca201',
    code: 'BCA-201',
    name: 'Data Structures Using C',
    course: 'BCA',
    year: '2nd Year',
    semester: 'Sem 3',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    unitsCount: 5,
    pyqsCount: 15
  },
  {
    id: 'bca202',
    code: 'BCA-202',
    name: 'Object Oriented Programming with C++',
    course: 'BCA',
    year: '2nd Year',
    semester: 'Sem 3',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    unitsCount: 5,
    pyqsCount: 13
  },
  {
    id: 'bca301',
    code: 'BCA-301',
    name: 'Java Programming & J2EE',
    course: 'BCA',
    year: '3rd Year',
    semester: 'Sem 5',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    unitsCount: 5,
    pyqsCount: 14
  },
  {
    id: 'bca302',
    code: 'BCA-302',
    name: 'Network Security & Cryptography',
    course: 'BCA',
    year: '3rd Year',
    semester: 'Sem 5',
    iconBg: '#FEE2E2',
    iconColor: '#E11D48',
    unitsCount: 5,
    pyqsCount: 11
  },

  // ================= MCA SUBJECTS =================
  {
    id: 'mca101',
    code: 'KCA101',
    name: 'Problem Solving Using Python',
    course: 'MCA',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    unitsCount: 5,
    pyqsCount: 10
  },
  {
    id: 'mca102',
    code: 'KCA102',
    name: 'Computer Organization & Architecture',
    course: 'MCA',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
    unitsCount: 5,
    pyqsCount: 12
  },
  {
    id: 'mca201',
    code: 'KCA301',
    name: 'Artificial Intelligence & Machine Learning',
    course: 'MCA',
    year: '2nd Year',
    semester: 'Sem 3',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    unitsCount: 5,
    pyqsCount: 9
  },

  // ================= MBA SUBJECTS =================
  {
    id: 'mba101',
    code: 'KMBN101',
    name: 'Management Concepts & Organizational Behaviour',
    course: 'MBA',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#FFEDD5',
    iconColor: '#C2410C',
    unitsCount: 5,
    pyqsCount: 10
  },
  {
    id: 'mba102',
    code: 'KMBN102',
    name: 'Managerial Economics',
    course: 'MBA',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    unitsCount: 5,
    pyqsCount: 11
  },
  {
    id: 'mba201',
    code: 'KMBN201',
    name: 'Business Environment & Legal Aspects',
    course: 'MBA',
    year: '2nd Year',
    semester: 'Sem 3',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    unitsCount: 5,
    pyqsCount: 9
  },

  // ================= B.PHARM SUBJECTS =================
  {
    id: 'bp101',
    code: 'BP101T',
    name: 'Human Anatomy & Physiology I',
    course: 'B.Pharm',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    unitsCount: 5,
    pyqsCount: 12
  },
  {
    id: 'bp201',
    code: 'BP201T',
    name: 'Pharmaceutical Chemistry',
    course: 'B.Pharm',
    year: '2nd Year',
    semester: 'Sem 3',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    unitsCount: 5,
    pyqsCount: 14
  },

  // ================= BBA SUBJECTS =================
  {
    id: 'bba101',
    code: 'BBA-101',
    name: 'Principles of Management',
    course: 'BBA',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#FEF3C7',
    iconColor: '#B45309',
    unitsCount: 5,
    pyqsCount: 10
  },
  {
    id: 'bba102',
    code: 'BBA-102',
    name: 'Business Economics',
    course: 'BBA',
    year: '1st Year',
    semester: 'Sem 1',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    unitsCount: 5,
    pyqsCount: 8
  },
  {
    id: 'bba201',
    code: 'BBA-201',
    name: 'Marketing Management',
    course: 'BBA',
    year: '2nd Year',
    semester: 'Sem 3',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    unitsCount: 5,
    pyqsCount: 12
  },
  {
    id: 'bba301',
    code: 'BBA-301',
    name: 'Strategic Management',
    course: 'BBA',
    year: '3rd Year',
    semester: 'Sem 5',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    unitsCount: 5,
    pyqsCount: 11
  }
];

// Helper to filter subjects strictly by course, year, and branch
export function getSubjectsByHierarchy(course: string, year: string, branch?: string): SubjectItem[] {
  const normCourse = course.toLowerCase().replace(/[^a-z]/g, '');
  const normYear = year.toLowerCase().replace(/[^0-9]/g, '');

  return SUBJECTS_CATALOG.filter(sub => {
    const subCourse = sub.course.toLowerCase().replace(/[^a-z]/g, '');
    const subYear = sub.year.toLowerCase().replace(/[^0-9]/g, '');

    const courseMatch = subCourse === normCourse || (normCourse.includes('tech') && subCourse.includes('tech'));
    const yearMatch = !normYear || subYear === normYear;

    if (!courseMatch || !yearMatch) return false;

    if (normCourse.includes('tech') && branch) {
      if (!sub.branch || sub.branch === 'ALL') return true;
      return sub.branch.toUpperCase() === branch.toUpperCase();
    }

    return true;
  });
}
