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
  }
};

// Also support dot-notated aliases seamlessly:
COURSE_CONFIG["B.Tech"] = COURSE_CONFIG["BTech"];
COURSE_CONFIG["B.Pharm"] = COURSE_CONFIG["BPharma"];

// Available courses for modal and selector
export const AVAILABLE_COURSES = [
  { key: "BCA", name: "BCA", fullName: "Bachelor of Computer Applications", badgeColor: "#0284C7" },
  { key: "BTech", name: "BTech", fullName: "Bachelor of Technology", badgeColor: "#0D9488" },
  { key: "MCA", name: "MCA", fullName: "Master of Computer Applications", badgeColor: "#2563EB" },
  { key: "MBA", name: "MBA", fullName: "Master of Business Administration", badgeColor: "#B45309" },
  { key: "BPharma", name: "BPharma", fullName: "Bachelor of Pharmacy", badgeColor: "#BE185D" },
  { key: "BBA", name: "BBA", fullName: "Bachelor of Business Administration", badgeColor: "#7C3AED" },
  { key: "MTech", name: "MTech", fullName: "Master of Technology", badgeColor: "#DC2626" }
];

// Robust Normalizer for Course Keys
export function normalizeCourseKey(c) {
  if (!c) return "BCA";
  const s = String(c).toLowerCase().replace(/[^a-z]/g, "");
  if (s === "bca") return "BCA";
  if (s.includes("tech") || s === "btech") return "BTech";
  if (s === "mca") return "MCA";
  if (s === "mba") return "MBA";
  if (s.includes("pharm") || s.includes("pharma")) return "BPharma";
  if (s === "bba") return "BBA";
  if (s === "mtech") return "MTech";
  return "BCA";
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
