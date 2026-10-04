// ============================================================================
// CAMPUSPREP / PROFESSORVIRUS — CENTRAL COURSE & YEAR MAPPING
// Authoritative curriculum, years, semesters, and subjects mapping
// ============================================================================

export const COURSE_CONFIG = {
  "BCA": {
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    years: ["1st Year", "2nd Year", "3rd Year"],
    sems: {
      "1st Year": [1, 2],
      "2nd Year": [3, 4],
      "3rd Year": [5, 6]
    },
    subjects: {
      1: [
        "Mathematics - I",
        "Programming Principle & Algorithm",
        "Computer Fundamentals & Office Automation",
        "Principle of Management",
        "Business Communication"
      ],
      2: [
        "Mathematics - II",
        "Data Structure Using C",
        "Digital Electronics & Computer Architecture",
        "Financial Accounting & Management",
        "Environmental Studies"
      ],
      3: [
        "Object Oriented Programming Using C++",
        "Database Management System (DBMS)",
        "Operating System",
        "Data Communication & Computer Networks",
        "Indian Constitution & Human Values"
      ],
      4: [
        "Web Designing & Internet Technologies",
        "Software Engineering",
        "Computer Graphics & Multimedia",
        "Optimization Techniques",
        "Python Programming"
      ],
      5: [
        "Java Programming & J2EE",
        "Network Security & Cryptography",
        "Cloud Computing Technologies",
        "Numerical Analysis & Statistical Techniques",
        "Web Application Development with PHP/Node"
      ],
      6: [
        "Information Security & Cyber Laws",
        "Mobile Application Development (Android)",
        "E-Commerce & Digital Governance",
        "Major Project & Viva-Voce"
      ]
    }
  },
  "BTech": {
    name: "BTech",
    fullName: "Bachelor of Technology",
    branches: ["CSE", "ECE", "ME", "CE", "EE", "IT", "AI&DS"],
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: {
      "1st Year": [1, 2],
      "2nd Year": [3, 4],
      "3rd Year": [5, 6],
      "4th Year": [7, 8]
    },
    subjects: {
      1: [
        "Engineering Mathematics-I",
        "Programming for Problem Solving (PPS)",
        "Engineering Physics",
        "Basic Electrical Engineering",
        "Environment & Ecology",
        "Fundamentals of Electronics Engineering"
      ],
      2: [
        "Engineering Mathematics-II",
        "Engineering Chemistry",
        "Emerging Domain in Electronics Engineering",
        "Fundamentals of Mechanical Engineering",
        "Soft Skills & Communication"
      ],
      3: [
        "Data Structures",
        "Computer Organization & Architecture",
        "Discrete Mathematics",
        "Universal Human Values",
        "Technical Communication"
      ],
      4: [
        "Operating Systems",
        "Theory of Automata & Formal Languages (TAFL)",
        "Object Oriented Programming with Java",
        "Cyber Security",
        "Python Programming"
      ],
      5: [
        "Database Management Systems (DBMS)",
        "Design & Analysis of Algorithms (DAA)",
        "Web Technologies",
        "Compiler Design",
        "Computer Networks"
      ],
      6: [
        "Software Engineering",
        "Computer Networks",
        "Cloud Computing",
        "Big Data Analytics",
        "Artificial Intelligence"
      ],
      7: [
        "Machine Learning",
        "Cryptographic & Network Security",
        "Distributed Systems",
        "Open Elective I"
      ],
      8: [
        "Deep Learning",
        "Blockchain Technology",
        "Project Work & Viva-Voce",
        "Open Elective II"
      ]
    }
  },
  "MCA": {
    name: "MCA",
    fullName: "Master of Computer Applications",
    years: ["1st Year", "2nd Year"],
    sems: {
      "1st Year": [1, 2],
      "2nd Year": [3, 4]
    },
    subjects: {
      1: [
        "Problem Solving using Python",
        "Computer Organization & Architecture",
        "Discrete Mathematics",
        "Data Structures",
        "Principles of Management & Communication"
      ],
      2: [
        "Object Oriented Programming using Java",
        "Operating Systems",
        "Database Management Systems",
        "Web Technologies",
        "Software Engineering"
      ],
      3: [
        "Artificial Intelligence & Machine Learning",
        "Computer Networks",
        "Cloud Computing",
        "Design and Analysis of Algorithms",
        "Data Analytics"
      ],
      4: [
        "Major Project & Seminar",
        "DevOps & Agile Methodology",
        "Advanced Web Development",
        "Information & Cyber Security"
      ]
    }
  },
  "MBA": {
    name: "MBA",
    fullName: "Master of Business Administration",
    years: ["1st Year", "2nd Year"],
    sems: {
      "1st Year": [1, 2],
      "2nd Year": [3, 4]
    },
    subjects: {
      1: [
        "Management Concepts & Organisational Behaviour",
        "Managerial Economics",
        "Financial Accounting & Analysis",
        "Business Statistics & Analytics",
        "Marketing Management",
        "Design Thinking & Business Communication"
      ],
      2: [
        "Business Environment & Legal Aspects of Business",
        "Human Resource Management",
        "Corporate Financial Management",
        "Operations Management",
        "Quantitative Techniques for Managers",
        "Business Research Methods"
      ],
      3: [
        "Consumer Behaviour",
        "Security Analysis & Portfolio Management",
        "Talent Management & Acquisition",
        "Supply Chain & Logistics Management",
        "Enterprise Resource Planning (ERP)"
      ],
      4: [
        "Sales & Distribution Management",
        "International Financial Management",
        "Strategic Human Resource Management",
        "Operations Planning & Inventory Control",
        "IT Strategy & Project Governance"
      ]
    }
  },
  "BPharma": {
    name: "BPharma",
    fullName: "Bachelor of Pharmacy",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: {
      "1st Year": [1, 2],
      "2nd Year": [3, 4],
      "3rd Year": [5, 6],
      "4th Year": [7, 8]
    },
    subjects: {
      1: [
        "Human Anatomy & Physiology I",
        "Pharmaceutical Analysis I",
        "Pharmaceutics I",
        "Pharmaceutical Inorganic Chemistry",
        "Communication Skills"
      ],
      2: [
        "Human Anatomy & Physiology II",
        "Pharmaceutical Organic Chemistry I",
        "Biochemistry",
        "Pathophysiology",
        "Computer Applications in Pharmacy"
      ],
      3: [
        "Pharmaceutical Organic Chemistry II",
        "Physical Pharmaceutics I",
        "Pharmaceutical Microbiology",
        "Pharmaceutical Engineering"
      ],
      4: [
        "Pharmaceutical Organic Chemistry III",
        "Medicinal Chemistry I",
        "Physical Pharmaceutics II",
        "Pharmacology I",
        "Pharmacognosy & Phytochemistry I"
      ],
      5: [
        "Medicinal Chemistry II",
        "Industrial Pharmacy I",
        "Pharmacology II",
        "Pharmacognosy & Phytochemistry II",
        "Pharmaceutical Jurisprudence"
      ],
      6: [
        "Medicinal Chemistry III",
        "Pharmacology III",
        "Herbal Drug Technology",
        "Biopharmaceutics & Pharmacokinetics",
        "Pharmaceutical Biotechnology"
      ],
      7: [
        "Instrumental Methods of Analysis",
        "Industrial Pharmacy II",
        "Pharmacy Practice",
        "Novel Drug Delivery System"
      ],
      8: [
        "Biostatistics & Research Methodology",
        "Social & Preventive Pharmacy",
        "Pharma Marketing Management",
        "Pharmaceutical Regulatory Science"
      ]
    }
  },
  "BBA": {
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    years: ["1st Year", "2nd Year", "3rd Year"],
    sems: {
      "1st Year": [1, 2],
      "2nd Year": [3, 4],
      "3rd Year": [5, 6]
    },
    subjects: {
      1: ["Principles of Management", "Business Economics", "Financial Accounting", "Business Mathematics", "Business Communication"],
      2: ["Organizational Behavior", "Marketing Management", "Human Resource Management", "Business Law", "Management Information Systems"],
      3: ["Strategic Management", "Financial Management", "Operations Research", "Entrepreneurship Development", "International Business"],
      4: ["Consumer Behavior", "Advertising & Brand Management", "Retail Management", "Digital Marketing", "Research Methodology"],
      5: ["Investment Analysis", "Supply Chain Management", "Taxation Laws", "Business Ethics", "Corporate Governance"],
      6: ["Major Project", "Comprehensive Viva", "E-Commerce", "Services Marketing"]
    }
  },
  "MTech": {
    name: "MTech",
    fullName: "Master of Technology",
    years: ["1st Year", "2nd Year"],
    sems: {
      "1st Year": [1, 2],
      "2nd Year": [3, 4]
    },
    subjects: {
      1: ["Advanced Data Structures & Algorithms", "Advanced Computer Architecture", "Advanced Operating Systems", "Distributed Systems"],
      2: ["Machine Learning & Deep Neural Systems", "Cloud Infrastructure & High Scalability", "Advanced Cryptography & Network Security", "High Performance Computing"],
      3: ["Dissertation Phase-I", "Seminar & Technical Writing", "Special Elective I"],
      4: ["Dissertation Phase-II", "Comprehensive Viva", "Research Publication"]
    }
  },
  // ---- 17 additional AKTU programmes (unique keys) ----
  "BTechBiotechnology": {
    name: "BTech Biotechnology",
    fullName: "B.Tech Biotechnology",
    branches: ["Biotechnology"],
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {}
  },
  "BTechAgriculture": {
    name: "BTech Agriculture",
    fullName: "B.Tech Agriculture",
    branches: ["Agriculture"],
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {}
  },
  "BTechLateral": {
    name: "BTech Lateral Entry",
    fullName: "B.Tech Lateral Entry",
    branches: ["CSE", "ECE", "ME", "CE", "EE", "IT"],
    years: ["2nd Year", "3rd Year", "4th Year"],
    sems: { "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {}
  },
  "BBA_BMS": {
    name: "BBA / BMS",
    fullName: "BBA / Bachelor of Management Studies",
    years: ["1st Year", "2nd Year", "3rd Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6] },
    subjects: {}
  },
  "BPharmLateral": {
    name: "BPharm Lateral Entry",
    fullName: "B.Pharm Lateral Entry",
    years: ["2nd Year", "3rd Year", "4th Year"],
    sems: { "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {}
  },
  "PharmD": {
    name: "Pharm.D",
    fullName: "Doctor of Pharmacy",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8], "5th Year": [9, 10], "6th Year": [11, 12] },
    subjects: {}
  },
  "MPharm": {
    name: "M.Pharm",
    fullName: "Master of Pharmacy",
    years: ["1st Year", "2nd Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4] },
    subjects: {}
  },
  "MCAIntegrated": {
    name: "MCA Integrated",
    fullName: "MCA Integrated (5 Year)",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8], "5th Year": [9, 10] },
    subjects: {}
  },
  "MCALateral": {
    name: "MCA Lateral Entry",
    fullName: "MCA Lateral Entry",
    years: ["1st Year", "2nd Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4] },
    subjects: {}
  },
  "MBAIntegrated": {
    name: "MBA Integrated",
    fullName: "MBA Integrated (5 Year)",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8], "5th Year": [9, 10] },
    subjects: {}
  },
  "MBALateral": {
    name: "MBA Lateral Entry",
    fullName: "MBA Lateral Entry",
    years: ["1st Year"],
    sems: { "1st Year": [1, 2] },
    subjects: {}
  },
  "BArch": {
    name: "B.Arch",
    fullName: "Bachelor of Architecture",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8], "5th Year": [9, 10] },
    subjects: {}
  },
  "BDes": {
    name: "B.Des",
    fullName: "Bachelor of Design",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {}
  },
  "BHMCT": {
    name: "BHMCT",
    fullName: "Bachelor of Hotel Management & Catering Technology",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {}
  },
  "BFAD": {
    name: "BFAD",
    fullName: "Bachelor of Fashion & Apparel Design",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {}
  },
  "BFA": {
    name: "BFA",
    fullName: "Bachelor of Fine Arts",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {}
  },
  "BVoc": {
    name: "B.Voc",
    fullName: "Bachelor of Vocation",
    years: ["1st Year", "2nd Year", "3rd Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6] },
    subjects: {}
  }
};

// Also support dot-notated aliases seamlessly:
COURSE_CONFIG["B.Tech"] = COURSE_CONFIG["BTech"];
COURSE_CONFIG["B.Pharm"] = COURSE_CONFIG["BPharma"];
COURSE_CONFIG["M.Tech"] = COURSE_CONFIG["MTech"];

// ============================================================================
// MASTER COURSE DIRECTORY — All 24 AKTU programmes with stable unique keys
// This is the SINGLE SOURCE OF TRUTH for course identity across the entire app.
// ============================================================================
export const AVAILABLE_COURSES = [
  { key: "BTech",            name: "B.Tech",                fullName: "Bachelor of Technology",                      badgeColor: "#DC2626" },
  { key: "BTechBiotechnology", name: "B.Tech Biotechnology", fullName: "B.Tech Biotechnology",                      badgeColor: "#16A34A" },
  { key: "BTechAgriculture", name: "B.Tech Agriculture",    fullName: "B.Tech Agriculture",                          badgeColor: "#65A30D" },
  { key: "BTechLateral",     name: "B.Tech Lateral Entry",  fullName: "B.Tech Lateral Entry",                        badgeColor: "#EA580C" },
  { key: "BCA",              name: "BCA",                   fullName: "Bachelor of Computer Applications",            badgeColor: "#2563EB" },
  { key: "BBA",              name: "BBA",                   fullName: "Bachelor of Business Administration",          badgeColor: "#7C3AED" },
  { key: "BBA_BMS",          name: "BBA / BMS",             fullName: "BBA / Bachelor of Management Studies",         badgeColor: "#8B5CF6" },
  { key: "BPharma",          name: "B.Pharm",               fullName: "Bachelor of Pharmacy",                         badgeColor: "#059669" },
  { key: "BPharmLateral",    name: "B.Pharm Lateral Entry", fullName: "B.Pharm Lateral Entry",                       badgeColor: "#15803D" },
  { key: "PharmD",           name: "Pharm.D",               fullName: "Doctor of Pharmacy",                           badgeColor: "#047857" },
  { key: "MTech",            name: "M.Tech",                fullName: "Master of Technology",                          badgeColor: "#4F46E5" },
  { key: "MPharm",           name: "M.Pharm",               fullName: "Master of Pharmacy",                            badgeColor: "#9D174D" },
  { key: "MCA",              name: "MCA",                   fullName: "Master of Computer Applications",               badgeColor: "#0284C7" },
  { key: "MCAIntegrated",    name: "MCA Integrated",        fullName: "MCA Integrated (5 Year)",                       badgeColor: "#0D9488" },
  { key: "MCALateral",       name: "MCA Lateral Entry",     fullName: "MCA Lateral Entry",                             badgeColor: "#0891B2" },
  { key: "MBA",              name: "MBA",                   fullName: "Master of Business Administration",             badgeColor: "#E11D48" },
  { key: "MBAIntegrated",    name: "MBA Integrated",        fullName: "MBA Integrated (5 Year)",                       badgeColor: "#DB2777" },
  { key: "MBALateral",       name: "MBA Lateral Entry",     fullName: "MBA Lateral Entry",                             badgeColor: "#D97706" },
  { key: "BArch",            name: "B.Arch",                fullName: "Bachelor of Architecture",                      badgeColor: "#CA8A04" },
  { key: "BDes",             name: "B.Des",                 fullName: "Bachelor of Design",                            badgeColor: "#9333EA" },
  { key: "BHMCT",            name: "BHMCT",                 fullName: "Bachelor of Hotel Management & Catering Tech.", badgeColor: "#C2410C" },
  { key: "BFAD",             name: "BFAD",                  fullName: "Bachelor of Fashion & Apparel Design",          badgeColor: "#A21CAF" },
  { key: "BFA",              name: "BFA",                   fullName: "Bachelor of Fine Arts",                         badgeColor: "#6B21A8" },
  { key: "BVoc",             name: "B.Voc",                 fullName: "Bachelor of Vocation",                          badgeColor: "#475569" }
];

// ============================================================================
// normalizeCourseKey — maps ANY incoming course string to its unique stable key.
// This handles URL params, display names, card IDs, and legacy values.
// NEVER silently falls back to an unrelated course.
// ============================================================================
export function normalizeCourseKey(c) {
  if (!c) return null;
  // Strip whitespace, dots, slashes, dashes and lowercase for matching
  const raw = String(c).trim();
  const s = raw.toLowerCase().replace(/[\s.\/\-_]+/g, '');

  // Exact key match first (case-insensitive comparison against AVAILABLE_COURSES keys)
  const exactMatch = AVAILABLE_COURSES.find(ac => ac.key.toLowerCase() === s || ac.key.toLowerCase().replace(/[_]/g, '') === s);
  if (exactMatch) return exactMatch.key;

  // Explicit mapping of all known aliases/slugs to unique keys
  const ALIAS_MAP: Record<string, string> = {
    // B.Tech variants
    'btech': 'BTech', 'btechnology': 'BTech',
    'btechbiotechnology': 'BTechBiotechnology', 'btechbiotech': 'BTechBiotechnology',
    'btechagriculture': 'BTechAgriculture', 'btechagri': 'BTechAgriculture',
    'btechlateralentry': 'BTechLateral', 'btechlateral': 'BTechLateral',
    // BCA
    'bca': 'BCA',
    // BBA variants
    'bba': 'BBA',
    'bbabms': 'BBA_BMS', 'bms': 'BBA_BMS',
    // B.Pharm variants
    'bpharm': 'BPharma', 'bpharma': 'BPharma', 'bpharmacy': 'BPharma',
    'bpharmlateralentry': 'BPharmLateral', 'bpharmlateral': 'BPharmLateral',
    // Pharm.D
    'pharmd': 'PharmD', 'doctorofpharmacy': 'PharmD',
    // M.Tech
    'mtech': 'MTech', 'mtechnology': 'MTech',
    // M.Pharm
    'mpharm': 'MPharm', 'mpharma': 'MPharm', 'mpharmacy': 'MPharm',
    // MCA variants
    'mca': 'MCA',
    'mcaintegrated': 'MCAIntegrated',
    'mcalateralentry': 'MCALateral', 'mcalateral': 'MCALateral',
    // MBA variants
    'mba': 'MBA',
    'mbaintegrated': 'MBAIntegrated',
    'mbalateralentry': 'MBALateral', 'mbalateral': 'MBALateral',
    // Design, Arts, Hotel, Vocation
    'barch': 'BArch', 'architecture': 'BArch',
    'bdes': 'BDes', 'bdesign': 'BDes',
    'bhmct': 'BHMCT',
    'bfad': 'BFAD',
    'bfa': 'BFA',
    'bvoc': 'BVoc'
  };

  if (ALIAS_MAP[s]) return ALIAS_MAP[s];

  // Legacy allCourses keys (BTech, BPharm, etc.)
  if (s === 'btechcse' || s === 'btechece' || s === 'btechme' || s === 'btechce' || s === 'btechee' || s === 'btechit') return 'BTech';

  // No match — return null (caller decides what to do)
  return null;
}

// ============================================================================
// getDataCourseValue — maps a normalized course key to the actual value used
// in notes.json / pyqs.json `course` field for data filtering.
// Returns null if no data exists for this course yet.
// ============================================================================
export function getDataCourseValue(normalizedKey: string): string | null {
  const DATA_COURSE_MAP: Record<string, string> = {
    'BTech': 'B.Tech',
    'BTechBiotechnology': 'B.Tech',   // shares B.Tech data pool
    'BTechAgriculture': 'B.Tech',     // shares B.Tech data pool
    'BTechLateral': 'B.Tech',         // shares B.Tech data pool
    'BCA': 'BCA',
    'BBA': null,       // no data yet
    'BBA_BMS': null,   // no data yet
    'BPharma': 'B.Pharm',
    'BPharmLateral': 'B.Pharm',       // shares B.Pharm data pool
    'PharmD': null,    // no data yet
    'MTech': null,     // no data yet
    'MPharm': null,    // no data yet
    'MCA': 'MCA',
    'MCAIntegrated': 'MCA',           // shares MCA data pool
    'MCALateral': 'MCA',             // shares MCA data pool
    'MBA': 'MBA',
    'MBAIntegrated': 'MBA',           // shares MBA data pool
    'MBALateral': 'MBA',             // shares MBA data pool
    'BArch': null,     // no data yet
    'BDes': null,      // no data yet
    'BHMCT': null,     // no data yet
    'BFAD': null,      // no data yet
    'BFA': null,       // no data yet
    'BVoc': null       // no data yet
  };
  return DATA_COURSE_MAP[normalizedKey] ?? null;
}

// Year string normalizer (1 -> '1st Year', '2nd Year', etc.)
export function normalizeYearStr(y) {
  if (!y) return "1st Year";
  const digit = String(y).replace(/[^0-9]/g, "");
  if (digit === "1") return "1st Year";
  if (digit === "2") return "2nd Year";
  if (digit === "3") return "3rd Year";
  if (digit === "4") return "4th Year";
  return String(y);
}

// Get years for a course
export function getYearsForCourse(course) {
  const norm = normalizeCourseKey(course);
  return COURSE_CONFIG[norm]?.years || ["1st Year", "2nd Year", "3rd Year"];
}

// Get semesters for a course and year
export function getSemestersForCourseYear(course, year) {
  const norm = normalizeCourseKey(course);
  const normYear = normalizeYearStr(year);
  const sems = COURSE_CONFIG[norm]?.sems?.[normYear] || [1, 2];
  return sems.map(s => `Sem ${s}`);
}

// Get subjects list for a course, year, semester
export function getSubjectsForCourseMapping(course, year, sem = null, branch = null) {
  const norm = normalizeCourseKey(course);
  const conf = COURSE_CONFIG[norm];
  if (!conf) return [];

  if (sem && sem !== "All") {
    const semDigit = Number(String(sem).replace(/[^0-9]/g, ""));
    const list = conf.subjects?.[semDigit] || [];
    return list.map((name, i) => ({
      id: `${norm}-${semDigit}-${i}`,
      name,
      code: `${norm}-${semDigit}0${i + 1}`,
      semester: `Sem ${semDigit}`,
      year: normalizeYearStr(year),
      course: norm,
      branch: branch || (norm === "BTech" ? "CSE" : undefined)
    }));
  }

  // Otherwise all subjects for the given year
  const normYear = normalizeYearStr(year);
  const semNumbers = conf.sems?.[normYear] || [1, 2];
  const allSubs = [];
  semNumbers.forEach(sNum => {
    const list = conf.subjects?.[sNum] || [];
    list.forEach((name, i) => {
      allSubs.push({
        id: `${norm}-${sNum}-${i}`,
        name,
        code: `${norm}-${sNum}0${i + 1}`,
        semester: `Sem ${sNum}`,
        year: normYear,
        course: norm,
        branch: branch || (norm === "BTech" ? "CSE" : undefined)
      });
    });
  });
  return allSubs;
}

export default COURSE_CONFIG;
