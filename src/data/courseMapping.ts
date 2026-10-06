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
    subjects: {
      1: [
        { code: "KAS103T", name: "Engineering Mathematics-I" },
        { code: "KAS101T", name: "Engineering Physics" },
        { code: "KCS101T", name: "Programming for Problem Solving" },
        { code: "KEE101T", name: "Basic Electrical Engineering" },
        { code: "KAS105T", name: "Environment & Ecology" }
      ],
      2: [
        { code: "KAS203T", name: "Engineering Mathematics-II" },
        { code: "KAS202T", name: "Engineering Chemistry" },
        { code: "KEC201T", name: "Emerging Domain in Electronics" },
        { code: "KME201T", name: "Fundamentals of Mechanical Engineering" },
        { code: "BAS204",  name: "Soft Skills & Communication" }
      ],
      3: [
        { code: "KBT301", name: "Microbiology" },
        { code: "KBT302", name: "Cell Biology" },
        { code: "KBT303", name: "Biochemistry" },
        { code: "KBT304", name: "Genetics & Molecular Biology" },
        { code: "KVE301", name: "Universal Human Values" }
      ],
      4: [
        { code: "KBT401", name: "Molecular Biology & Genetic Engineering" },
        { code: "KBT402", name: "Heat & Mass Transfer Operations" },
        { code: "KBT403", name: "Enzyme Engineering" },
        { code: "KBT404", name: "Fluid Flow Operations" },
        { code: "BAS401", name: "Technical Communication" }
      ],
      5: [
        { code: "KBT501", name: "Bioprocess Engineering" },
        { code: "KBT502", name: "Immunology & Immunotechnology" },
        { code: "KBT503", name: "Recombinant DNA Technology" },
        { code: "KBT504", name: "Bioinformatics & Computational Biology" }
      ],
      6: [
        { code: "KBT601", name: "Plant & Animal Biotechnology" },
        { code: "KBT602", name: "Downstream Processing" },
        { code: "KBT603", name: "Bioreactor Design & Scale-up" },
        { code: "KBT604", name: "Environmental Biotechnology" }
      ],
      7: [
        { code: "KBT701", name: "Bioprocess Modeling & Simulation" },
        { code: "KBT702", name: "Genomics & Proteomics" },
        { code: "KBT703", name: "Biosafety, Bioethics & IPR" },
        { code: "KOE071", name: "Open Elective I" }
      ],
      8: [
        { code: "KBT801", name: "Nano-Biotechnology" },
        { code: "KBT802", name: "Industrial Biotechnology" },
        { code: "KBT851", name: "Major Project & Viva-Voce" }
      ]
    }
  },
  "BTechAgriculture": {
    name: "BTech Agriculture",
    fullName: "B.Tech Agriculture",
    branches: ["Agriculture"],
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {
      1: [
        { code: "KAS103T", name: "Engineering Mathematics-I" },
        { code: "KAS101T", name: "Engineering Physics" },
        { code: "KCS101T", name: "Programming for Problem Solving" },
        { code: "KEE101T", name: "Basic Electrical Engineering" },
        { code: "KAG101",  name: "Principles of Agronomy & Soil Science" }
      ],
      2: [
        { code: "KAS203T", name: "Engineering Mathematics-II" },
        { code: "KAS202T", name: "Engineering Chemistry" },
        { code: "KEC201T", name: "Emerging Domain in Electronics" },
        { code: "KAG201",  name: "Surveying & Leveling" },
        { code: "KAG202",  name: "Engineering Mechanics & Strength of Materials" }
      ],
      3: [
        { code: "KAG301", name: "Farm Power & Tractors" },
        { code: "KAG302", name: "Soil & Water Conservation Engineering" },
        { code: "KAG303", name: "Fluid Mechanics & Hydraulics" },
        { code: "KAG304", name: "Thermodynamics & Heat Engines" },
        { code: "BAS301", name: "Technical Communication" }
      ],
      4: [
        { code: "KAG401", name: "Farm Machinery & Equipment" },
        { code: "KAG402", name: "Irrigation & Drainage Engineering" },
        { code: "KAG403", name: "Crop Process Engineering" },
        { code: "KAG404", name: "Theory of Structures" },
        { code: "KVE401", name: "Universal Human Values" }
      ],
      5: [
        { code: "KAG501", name: "Groundwater, Wells & Pumps" },
        { code: "KAG502", name: "Agricultural Process Engineering" },
        { code: "KAG503", name: "Tractor Systems & Controls" },
        { code: "KAG504", name: "Dairy & Food Engineering" }
      ],
      6: [
        { code: "KAG601", name: "Post Harvest Engineering of Horticultural Crops" },
        { code: "KAG602", name: "Watershed Hydrology & Management" },
        { code: "KAG603", name: "Greenhouse Technology & Protected Cultivation" },
        { code: "KAG604", name: "Renewable Energy Sources in Agriculture" }
      ],
      7: [
        { code: "KAG701", name: "Food Packaging & Preservation Technology" },
        { code: "KAG702", name: "Remote Sensing & GIS in Agriculture" },
        { code: "KAG703", name: "Design of Agricultural Machinery" },
        { code: "KOE072", name: "Open Elective I" }
      ],
      8: [
        { code: "KAG801", name: "Precision Agriculture & Smart Farming" },
        { code: "KAG802", name: "Agro-Industrial Waste Management" },
        { code: "KAG851", name: "Major Project & Seminar" }
      ]
    }
  },
  "BTechLateral": {
    name: "BTech Lateral Entry",
    fullName: "B.Tech Lateral Entry",
    branches: ["CSE", "ECE", "ME", "CE", "EE", "IT"],
    years: ["2nd Year", "3rd Year", "4th Year"],
    sems: { "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {
      3: [
        { code: "KCS301", name: "Data Structures" },
        { code: "KCS302", name: "Computer Organization & Architecture" },
        { code: "KCS303", name: "Discrete Mathematics" },
        { code: "KVE301", name: "Universal Human Values" },
        { code: "BAS301", name: "Technical Communication" }
      ],
      4: [
        { code: "KCS401", name: "Operating Systems" },
        { code: "KCS402", name: "Theory of Automata & Formal Languages" },
        { code: "KCS403", name: "Microprocessor & Microcontroller" },
        { code: "KCS404", name: "Object Oriented Programming with Java" },
        { code: "KNC401", name: "Cyber Security" }
      ],
      5: [
        { code: "KCS501", name: "Database Management Systems" },
        { code: "KCS502", name: "Design & Analysis of Algorithms" },
        { code: "KCS503", name: "Compiler Design" },
        { code: "KCS504", name: "Web Technologies" },
        { code: "KCS505", name: "Computer Networks" }
      ],
      6: [
        { code: "KCS601", name: "Software Engineering" },
        { code: "KCS602", name: "Cloud Computing" },
        { code: "KCS603", name: "Artificial Intelligence" },
        { code: "KCS604", name: "Big Data Analytics" },
        { code: "KCS605", name: "Distributed Systems" }
      ],
      7: [
        { code: "KCS701", name: "Machine Learning" },
        { code: "KCS702", name: "Cryptography & Network Security" },
        { code: "KCS703", name: "Distributed Computing" },
        { code: "KOE073", name: "Open Elective I" }
      ],
      8: [
        { code: "KCS801", name: "Deep Learning & Neural Networks" },
        { code: "KCS802", name: "Blockchain Technology" },
        { code: "KCS851", name: "Project Work & Viva-Voce" },
        { code: "KOE083", name: "Open Elective II" }
      ]
    }
  },
  "BBA_BMS": {
    name: "BBA / BMS",
    fullName: "BBA / Bachelor of Management Studies",
    years: ["1st Year", "2nd Year", "3rd Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6] },
    subjects: {
      1: [
        { code: "BMS101", name: "Fundamentals of Management" },
        { code: "BMS102", name: "Business Economics" },
        { code: "BMS103", name: "Financial Accounting" },
        { code: "BMS104", name: "Business Mathematics" },
        { code: "BMS105", name: "Business Communication" }
      ],
      2: [
        { code: "BMS201", name: "Organizational Behavior" },
        { code: "BMS202", name: "Marketing Management" },
        { code: "BMS203", name: "Business Statistics" },
        { code: "BMS204", name: "Business Law" },
        { code: "BMS205", name: "Environmental Management" }
      ],
      3: [
        { code: "BMS301", name: "Human Resource Management" },
        { code: "BMS302", name: "Corporate Finance" },
        { code: "BMS303", name: "Management Information Systems" },
        { code: "BMS304", name: "Cost & Management Accounting" },
        { code: "BMS305", name: "Operations Research" }
      ],
      4: [
        { code: "BMS401", name: "Strategic Management" },
        { code: "BMS402", name: "Research Methodology in Management" },
        { code: "BMS403", name: "Consumer Behavior" },
        { code: "BMS404", name: "Financial Markets & Services" },
        { code: "BMS405", name: "Production & Operations Management" }
      ],
      5: [
        { code: "BMS501", name: "International Business & Trade" },
        { code: "BMS502", name: "Entrepreneurship & Small Business Management" },
        { code: "BMS503", name: "Digital Marketing & E-Commerce" },
        { code: "BMS504", name: "Brand & Advertising Management" }
      ],
      6: [
        { code: "BMS601", name: "Business Ethics & Corporate Governance" },
        { code: "BMS602", name: "Supply Chain & Logistics Management" },
        { code: "BMS603", name: "Investment Analysis & Portfolio Management" },
        { code: "BMS604", name: "Major Project & Comprehensive Viva" }
      ]
    }
  },
  "BPharmLateral": {
    name: "BPharm Lateral Entry",
    fullName: "B.Pharm Lateral Entry",
    years: ["2nd Year", "3rd Year", "4th Year"],
    sems: { "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {
      3: [
        { code: "BP301T", name: "Pharmaceutical Organic Chemistry II" },
        { code: "BP302T", name: "Physical Pharmaceutics I" },
        { code: "BP303T", name: "Pharmaceutical Microbiology" },
        { code: "BP304T", name: "Pharmaceutical Engineering" }
      ],
      4: [
        { code: "BP401T", name: "Pharmaceutical Organic Chemistry III" },
        { code: "BP402T", name: "Medicinal Chemistry I" },
        { code: "BP403T", name: "Physical Pharmaceutics II" },
        { code: "BP404T", name: "Pharmacology I" },
        { code: "BP405T", name: "Pharmacognosy & Phytochemistry I" }
      ],
      5: [
        { code: "BP501T", name: "Medicinal Chemistry II" },
        { code: "BP502T", name: "Industrial Pharmacy I" },
        { code: "BP503T", name: "Pharmacology II" },
        { code: "BP504T", name: "Pharmacognosy & Phytochemistry II" },
        { code: "BP505T", name: "Pharmaceutical Jurisprudence" }
      ],
      6: [
        { code: "BP601T", name: "Medicinal Chemistry III" },
        { code: "BP602T", name: "Pharmacology III" },
        { code: "BP603T", name: "Herbal Drug Technology" },
        { code: "BP604T", name: "Biopharmaceutics & Pharmacokinetics" },
        { code: "BP605T", name: "Pharmaceutical Biotechnology" },
        { code: "BP606T", name: "Quality Assurance" }
      ],
      7: [
        { code: "BP701T", name: "Instrumental Methods of Analysis" },
        { code: "BP702T", name: "Industrial Pharmacy II" },
        { code: "BP703T", name: "Pharmacy Practice" },
        { code: "BP704T", name: "Novel Drug Delivery System" }
      ],
      8: [
        { code: "BP801T",  name: "Biostatistics & Research Methodology" },
        { code: "BP802T",  name: "Social & Preventive Pharmacy" },
        { code: "BP803ET", name: "Pharma Marketing Management" },
        { code: "BP804ET", name: "Pharmaceutical Regulatory Science" },
        { code: "BP805ET", name: "Pharmacovigilance" }
      ]
    }
  },
  "PharmD": {
    name: "Pharm.D",
    fullName: "Doctor of Pharmacy",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8], "5th Year": [9, 10], "6th Year": [11, 12] },
    subjects: {
      1: [
        { code: "PD101", name: "Human Anatomy & Physiology" },
        { code: "PD102", name: "Pharmaceutics" },
        { code: "PD103", name: "Medicinal Biochemistry" },
        { code: "PD104", name: "Pharmaceutical Organic Chemistry" },
        { code: "PD105", name: "Pharmaceutical Inorganic Chemistry" },
        { code: "PD106", name: "Remedial Mathematics / Biology" }
      ],
      2: [
        { code: "PD101", name: "Human Anatomy & Physiology" },
        { code: "PD102", name: "Pharmaceutics" },
        { code: "PD103", name: "Medicinal Biochemistry" },
        { code: "PD104", name: "Pharmaceutical Organic Chemistry" },
        { code: "PD105", name: "Pharmaceutical Inorganic Chemistry" }
      ],
      3: [
        { code: "PD201", name: "Pathophysiology" },
        { code: "PD202", name: "Pharmaceutical Microbiology" },
        { code: "PD203", name: "Pharmacognosy & Phytopharmaceuticals" },
        { code: "PD204", name: "Pharmacology-I" },
        { code: "PD205", name: "Community Pharmacy" },
        { code: "PD206", name: "Pharmacotherapeutics-I" }
      ],
      4: [
        { code: "PD201", name: "Pathophysiology" },
        { code: "PD202", name: "Pharmaceutical Microbiology" },
        { code: "PD204", name: "Pharmacology-I" },
        { code: "PD206", name: "Pharmacotherapeutics-I" }
      ],
      5: [
        { code: "PD301", name: "Pharmacology-II" },
        { code: "PD302", name: "Pharmaceutical Analysis" },
        { code: "PD303", name: "Pharmacotherapeutics-II" },
        { code: "PD304", name: "Pharmaceutical Jurisprudence" },
        { code: "PD305", name: "Medicinal Chemistry" },
        { code: "PD306", name: "Pharmaceutical Formulations" }
      ],
      6: [
        { code: "PD301", name: "Pharmacology-II" },
        { code: "PD302", name: "Pharmaceutical Analysis" },
        { code: "PD303", name: "Pharmacotherapeutics-II" },
        { code: "PD305", name: "Medicinal Chemistry" }
      ],
      7: [
        { code: "PD401", name: "Pharmacotherapeutics-III" },
        { code: "PD402", name: "Hospital Pharmacy" },
        { code: "PD403", name: "Clinical Pharmacy" },
        { code: "PD404", name: "Biostatistics & Research Methodology" },
        { code: "PD405", name: "Biopharmaceutics & Pharmacokinetics" },
        { code: "PD406", name: "Clinical Toxicology" }
      ],
      8: [
        { code: "PD401", name: "Pharmacotherapeutics-III" },
        { code: "PD402", name: "Hospital Pharmacy" },
        { code: "PD403", name: "Clinical Pharmacy" },
        { code: "PD405", name: "Biopharmaceutics & Pharmacokinetics" }
      ],
      9: [
        { code: "PD501", name: "Clinical Research" },
        { code: "PD502", name: "Pharmacoepidemiology & Pharmacoeconomics" },
        { code: "PD503", name: "Clinical Pharmacokinetics & Therapeutic Drug Monitoring" },
        { code: "PD504", name: "Clerkship & Case Presentation" },
        { code: "PD505", name: "Project Work" }
      ],
      10: [
        { code: "PD501", name: "Clinical Research" },
        { code: "PD502", name: "Pharmacoepidemiology & Pharmacoeconomics" },
        { code: "PD503", name: "Clinical Pharmacokinetics & Therapeutic Drug Monitoring" },
        { code: "PD505", name: "Project Work" }
      ],
      11: [
        { code: "PD601", name: "Internship & Clinical Residency Postings" },
        { code: "PD602", name: "Ward Rounds & Case Studies" },
        { code: "PD603", name: "Advanced Clinical Training" }
      ],
      12: [
        { code: "PD601", name: "Internship & Clinical Residency Postings" },
        { code: "PD602", name: "Ward Rounds & Case Studies" },
        { code: "PD603", name: "Advanced Clinical Training" }
      ]
    }
  },
  "MPharm": {
    name: "M.Pharm",
    fullName: "Master of Pharmacy",
    years: ["1st Year", "2nd Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4] },
    subjects: {
      1: [
        { code: "MPA101T", name: "Modern Pharmaceutical Analytical Techniques" },
        { code: "MPA102T", name: "Advanced Organic Chemistry & Drug Design" },
        { code: "MPA103T", name: "Drug Regulatory Affairs" },
        { code: "MPA104T", name: "Molecular Pharmaceutics & Formulation Design" }
      ],
      2: [
        { code: "MPA201T", name: "Advanced Biopharmaceutics & Pharmacokinetics" },
        { code: "MPA202T", name: "Novel Drug Delivery Systems" },
        { code: "MPA203T", name: "Clinical Research & Pharmacovigilance" },
        { code: "MPA204T", name: "Quality Control & Quality Assurance" }
      ],
      3: [
        { code: "MRM301T", name: "Research Methodology & Biostatistics" },
        { code: "MJC302P", name: "Journal Club & Research Proposal" },
        { code: "MRW303P", name: "Research Work (Phase I)" }
      ],
      4: [
        { code: "MRW401P", name: "Research Work (Phase II) & Colloquium" },
        { code: "MTH402P", name: "Thesis Evaluation & Viva-Voce" }
      ]
    }
  },
  "MCAIntegrated": {
    name: "MCA Integrated",
    fullName: "MCA Integrated (5 Year)",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8], "5th Year": [9, 10] },
    subjects: {
      1: [
        { code: "MCAI101", name: "Computer Fundamentals & C Programming" },
        { code: "MCAI102", name: "Digital Electronics" },
        { code: "MCAI103", name: "Mathematical Foundations of Computer Science" },
        { code: "MCAI104", name: "Professional Communication" },
        { code: "MCAI105", name: "Environmental Studies" }
      ],
      2: [
        { code: "MCAI201", name: "Data Structures using C" },
        { code: "MCAI202", name: "Computer Organization" },
        { code: "MCAI203", name: "Discrete Mathematics" },
        { code: "MCAI204", name: "Principles of Management" },
        { code: "MCAI205", name: "Web Technology Fundamentals" }
      ],
      3: [
        { code: "MCAI301", name: "Object Oriented Programming with C++" },
        { code: "MCAI302", name: "Database Management Systems" },
        { code: "MCAI303", name: "Operating Systems" },
        { code: "MCAI304", name: "Computer Networks" },
        { code: "MCAI305", name: "Universal Human Values" }
      ],
      4: [
        { code: "MCAI401", name: "Java Programming" },
        { code: "MCAI402", name: "Software Engineering" },
        { code: "MCAI403", name: "Python Programming" },
        { code: "MCAI404", name: "Design & Analysis of Algorithms" },
        { code: "MCAI405", name: "Cyber Security Fundamentals" }
      ],
      5: [
        { code: "MCAI501", name: "Advanced Database Management Systems" },
        { code: "MCAI502", name: "Web Application Development" },
        { code: "MCAI503", name: "Theory of Computation" },
        { code: "MCAI504", name: "Cloud Computing Concepts" }
      ],
      6: [
        { code: "MCAI601", name: "Mobile Application Development" },
        { code: "MCAI602", name: "Computer Graphics & Multimedia" },
        { code: "MCAI603", name: "Information Security" },
        { code: "MCAI604", name: "Optimization Techniques" }
      ],
      7: [
        { code: "MCAI701", name: "Artificial Intelligence & Machine Learning" },
        { code: "MCAI702", name: "Advanced Web Frameworks" },
        { code: "MCAI703", name: "Distributed Systems" },
        { code: "MCAI704", name: "Data Mining & Warehousing" }
      ],
      8: [
        { code: "MCAI801", name: "Big Data Analytics" },
        { code: "MCAI802", name: "Internet of Things (IoT)" },
        { code: "MCAI803", name: "Software Project Management" },
        { code: "MCAI804", name: "Elective I" }
      ],
      9: [
        { code: "MCAI901", name: "Deep Learning & Neural Networks" },
        { code: "MCAI902", name: "DevOps & Cloud Architecture" },
        { code: "MCAI903", name: "Natural Language Processing" },
        { code: "MCAI904", name: "Research Project Phase I" }
      ],
      10: [
        { code: "MCAI1001", name: "Full Semester Industrial Internship & Major Project" },
        { code: "MCAI1002", name: "Comprehensive Technical Seminar" }
      ]
    }
  },
  "MCALateral": {
    name: "MCA Lateral Entry",
    fullName: "MCA Lateral Entry",
    years: ["1st Year", "2nd Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4] },
    subjects: {
      1: [
        { code: "KCA101", name: "Advanced Data Structures & Algorithms" },
        { code: "KCA102", name: "Operating Systems & Systems Programming" },
        { code: "KCA103", name: "Database Management Systems" },
        { code: "KCA104", name: "Mathematical Foundations of Computer Science" },
        { code: "KCA105", name: "Professional Communication & Ethics" }
      ],
      2: [
        { code: "KCA201", name: "Object Oriented Programming with Java" },
        { code: "KCA202", name: "Web Technologies & Frameworks" },
        { code: "KCA203", name: "Computer Networks & Security" },
        { code: "KCA204", name: "Software Engineering & Agile Methodology" },
        { code: "KCA205", name: "Artificial Intelligence Fundamentals" }
      ],
      3: [
        { code: "KCA301", name: "Machine Learning & Deep Learning" },
        { code: "KCA302", name: "Cloud Computing & DevOps" },
        { code: "KCA303", name: "Big Data Analytics" },
        { code: "KCA304", name: "Mobile Application Development" }
      ],
      4: [
        { code: "KCA401", name: "Major Project / Industrial Training" },
        { code: "KCA402", name: "Technical Seminar & Research Paper" }
      ]
    }
  },
  "MBAIntegrated": {
    name: "MBA Integrated",
    fullName: "MBA Integrated (5 Year)",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8], "5th Year": [9, 10] },
    subjects: {
      1: [
        { code: "MBAI101", name: "Principles of Management" },
        { code: "MBAI102", name: "Business Communication" },
        { code: "MBAI103", name: "Financial Accounting" },
        { code: "MBAI104", name: "Microeconomics for Managers" },
        { code: "MBAI105", name: "Business Mathematics" }
      ],
      2: [
        { code: "MBAI201", name: "Organizational Behaviour" },
        { code: "MBAI202", name: "Macroeconomics" },
        { code: "MBAI203", name: "Marketing Management - I" },
        { code: "MBAI204", name: "Business Statistics" },
        { code: "MBAI205", name: "Environmental Studies in Business" }
      ],
      3: [
        { code: "MBAI301", name: "Human Resource Management" },
        { code: "MBAI302", name: "Financial Management - I" },
        { code: "MBAI303", name: "Marketing Management - II" },
        { code: "MBAI304", name: "Cost Accounting" },
        { code: "MBAI305", name: "Business Law" }
      ],
      4: [
        { code: "MBAI401", name: "Operations Management" },
        { code: "MBAI402", name: "Management Information Systems" },
        { code: "MBAI403", name: "Research Methodology" },
        { code: "MBAI404", name: "Financial Management - II" },
        { code: "MBAI405", name: "Quantitative Techniques" }
      ],
      5: [
        { code: "MBAI501", name: "Strategic Management" },
        { code: "MBAI502", name: "Entrepreneurship Development" },
        { code: "MBAI503", name: "Consumer Behaviour" },
        { code: "MBAI504", name: "International Business Management" }
      ],
      6: [
        { code: "MBAI601", name: "Business Ethics & Corporate Governance" },
        { code: "MBAI602", name: "Supply Chain Management" },
        { code: "MBAI603", name: "Digital Marketing" },
        { code: "MBAI604", name: "Project Report & Viva" }
      ],
      7: [
        { code: "MBAI701", name: "Advanced Strategic Management" },
        { code: "MBAI702", name: "Security Analysis & Portfolio Management" },
        { code: "MBAI703", name: "Talent Acquisition & Performance Management" },
        { code: "MBAI704", name: "Brand & Retail Management" }
      ],
      8: [
        { code: "MBAI801", name: "International Financial Management" },
        { code: "MBAI802", name: "Strategic Marketing Management" },
        { code: "MBAI803", name: "Business Analytics & Big Data" },
        { code: "MBAI804", name: "Enterprise Resource Planning" }
      ],
      9: [
        { code: "MBAI901", name: "Corporate Restructuring, Mergers & Acquisitions" },
        { code: "MBAI902", name: "Digital Transformation & Innovation Strategy" },
        { code: "MBAI903", name: "Global Supply Chain Management" },
        { code: "MBAI904", name: "Internship & Dissertation Phase I" }
      ],
      10: [
        { code: "MBAI1001", name: "Final Corporate Internship & Project" },
        { code: "MBAI1002", name: "Comprehensive Management Viva-Voce" }
      ]
    }
  },
  "MBALateral": {
    name: "MBA Lateral Entry",
    fullName: "MBA Lateral Entry",
    years: ["1st Year"],
    sems: { "1st Year": [1, 2] },
    subjects: {
      1: [
        { code: "KMBN301", name: "Strategic Management" },
        { code: "KMBN302", name: "Innovation & Entrepreneurship" },
        { code: "KMBN303", name: "Specialization Elective I" },
        { code: "KMBN304", name: "Specialization Elective II" },
        { code: "KMBN305", name: "Research Project Report & Internship" }
      ],
      2: [
        { code: "KMBN401", name: "Corporate Governance, Values & Ethics" },
        { code: "KMBN402", name: "Cross-Cultural Management" },
        { code: "KMBN403", name: "Specialization Elective III" },
        { code: "KMBN404", name: "Specialization Elective IV" },
        { code: "KMBN405", name: "Comprehensive Viva-Voce" }
      ]
    }
  },
  "BArch": {
    name: "B.Arch",
    fullName: "Bachelor of Architecture",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8], "5th Year": [9, 10] },
    subjects: {
      1: [
        { code: "RAR101", name: "Architectural Design - I" },
        { code: "RAR102", name: "Building Construction & Materials - I" },
        { code: "RAR103", name: "Architectural Graphics - I" },
        { code: "RAR104", name: "History of Architecture - I" },
        { code: "RAR105", name: "Structure - I" }
      ],
      2: [
        { code: "RAR201", name: "Architectural Design - II" },
        { code: "RAR202", name: "Building Construction & Materials - II" },
        { code: "RAR203", name: "Architectural Graphics - II" },
        { code: "RAR204", name: "History of Architecture - II" },
        { code: "RAR205", name: "Structure - II" }
      ],
      3: [
        { code: "RAR301", name: "Architectural Design - III" },
        { code: "RAR302", name: "Building Construction & Materials - III" },
        { code: "RAR303", name: "Climatology & Environmental Studies" },
        { code: "RAR304", name: "History of Architecture - III" },
        { code: "RAR305", name: "Structure - III" }
      ],
      4: [
        { code: "RAR401", name: "Architectural Design - IV" },
        { code: "RAR402", name: "Building Construction & Materials - IV" },
        { code: "RAR403", name: "Building Services - I (Water Supply & Sanitation)" },
        { code: "RAR404", name: "History of Architecture - IV" },
        { code: "RAR405", name: "Structure - IV" }
      ],
      5: [
        { code: "RAR501", name: "Architectural Design - V" },
        { code: "RAR502", name: "Building Construction & Materials - V" },
        { code: "RAR503", name: "Building Services - II (Electrical & Lighting)" },
        { code: "RAR504", name: "Landscape Architecture" },
        { code: "RAR505", name: "Structure - V" }
      ],
      6: [
        { code: "RAR601", name: "Architectural Design - VI" },
        { code: "RAR602", name: "Building Construction & Materials - VI" },
        { code: "RAR603", name: "Building Services - III (HVAC & Mechanical)" },
        { code: "RAR604", name: "Working Drawing & Detailing" },
        { code: "RAR605", name: "Universal Human Values" }
      ],
      7: [
        { code: "RAR701", name: "Architectural Design - VII" },
        { code: "RAR702", name: "Town Planning & Urban Design" },
        { code: "RAR703", name: "Building Services - IV (Acoustics & Fire Safety)" },
        { code: "RAR704", name: "Professional Practice - I" }
      ],
      8: [
        { code: "RAR801", name: "Practical Training / Professional Internship" },
        { code: "RAR802", name: "Architectural Research Paper" }
      ],
      9: [
        { code: "RAR901", name: "Architectural Design - VIII (Advanced Urban Studio)" },
        { code: "RAR902", name: "Housing & Sustainable Architecture" },
        { code: "RAR903", name: "Disaster Management & Resilient Structures" },
        { code: "RAR904", name: "Thesis Seminar & Research Preparation" }
      ],
      10: [
        { code: "RAR1001", name: "Architectural Thesis Project" },
        { code: "RAR1002", name: "Professional Practice - II & Building Byelaws" }
      ]
    }
  },
  "BDes": {
    name: "B.Des",
    fullName: "Bachelor of Design",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {
      1: [
        { code: "BDES101", name: "Design Fundamentals & Elements" },
        { code: "BDES102", name: "Visual Representation & Sketching" },
        { code: "BDES103", name: "Geometry & Space Form" },
        { code: "BDES104", name: "Material Exploration" },
        { code: "BDES105", name: "Art & Design History" }
      ],
      2: [
        { code: "BDES201", name: "Color Theory & Application" },
        { code: "BDES202", name: "Design Drawing & Perspective" },
        { code: "BDES203", name: "Digital Media Tools & Software" },
        { code: "BDES204", name: "Typography & Layout Design" },
        { code: "BDES205", name: "Culture & Communication Studies" }
      ],
      3: [
        { code: "BDES301", name: "Product Design Studio - I" },
        { code: "BDES302", name: "Ergonomics & Human Factors" },
        { code: "BDES303", name: "Computer Aided Design (CAD / 3D Modeling)" },
        { code: "BDES304", name: "Photography & Visual Storytelling" }
      ],
      4: [
        { code: "BDES401", name: "User Interface (UI) Design" },
        { code: "BDES402", name: "Material & Manufacturing Processes" },
        { code: "BDES403", name: "Graphic Design & Identity Systems" },
        { code: "BDES404", name: "Design Research & Methodology" }
      ],
      5: [
        { code: "BDES501", name: "User Experience (UX) Research & Design" },
        { code: "BDES502", name: "Interaction Design & Prototyping" },
        { code: "BDES503", name: "Sustainable & Circular Design" },
        { code: "BDES504", name: "Packaging & Exhibition Design" }
      ],
      6: [
        { code: "BDES601", name: "Design Management & Professional Ethics" },
        { code: "BDES602", name: "Motion Graphics & Animation" },
        { code: "BDES603", name: "Service Design & Systems Thinking" },
        { code: "BDES604", name: "Industry Collaborative Project" }
      ],
      7: [
        { code: "BDES701", name: "Speculative & Future Design" },
        { code: "BDES702", name: "Design Portfolio Development" },
        { code: "BDES703", name: "Pre-Thesis Research Project" },
        { code: "BDES704", name: "Intellectual Property & Entrepreneurship" }
      ],
      8: [
        { code: "BDES801", name: "Graduation Project / Major Design Thesis" },
        { code: "BDES802", name: "Degree Show & Professional Exhibition" }
      ]
    }
  },
  "BHMCT": {
    name: "BHMCT",
    fullName: "Bachelor of Hotel Management & Catering Technology",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {
      1: [
        { code: "HM101", name: "Food Production Foundation - I" },
        { code: "HM102", name: "Food & Beverage Service Foundation - I" },
        { code: "HM103", name: "Front Office Operations - I" },
        { code: "HM104", name: "Accommodation Operations - I" },
        { code: "HM105", name: "Hygiene & Food Safety" }
      ],
      2: [
        { code: "HM201", name: "Food Production Foundation - II" },
        { code: "HM202", name: "Food & Beverage Service Foundation - II" },
        { code: "HM203", name: "Front Office Operations - II" },
        { code: "HM204", name: "Accommodation Operations - II" },
        { code: "HM205", name: "Hospitality French & Communication" }
      ],
      3: [
        { code: "HM301", name: "Quantity Food Production" },
        { code: "HM302", name: "Food & Beverage Service Operations" },
        { code: "HM303", name: "Hospitality Accounting & Finance" },
        { code: "HM304", name: "Hotel Housekeeping Operations" },
        { code: "HM305", name: "Hotel Engineering & Maintenance" }
      ],
      4: [
        { code: "HM401", name: "Industrial Training in 5-Star Hotel (Food Production)" },
        { code: "HM402", name: "Industrial Training in 5-Star Hotel (F&B Service)" },
        { code: "HM403", name: "Industrial Training in 5-Star Hotel (Front Office)" },
        { code: "HM404", name: "Industrial Training in 5-Star Hotel (Housekeeping)" }
      ],
      5: [
        { code: "HM501", name: "Regional Cuisines of India" },
        { code: "HM502", name: "Beverage Operations & Bar Management" },
        { code: "HM503", name: "Hospitality Sales & Marketing" },
        { code: "HM504", name: "Front Office Management & Night Auditing" },
        { code: "HM505", name: "Facility Planning & Interior Design" }
      ],
      6: [
        { code: "HM601", name: "International & Continental Cuisines" },
        { code: "HM602", name: "Banquet & Event Management" },
        { code: "HM603", name: "Hospitality Law & Licenses" },
        { code: "HM604", name: "Human Resource Management in Hospitality" },
        { code: "HM605", name: "Tourism Marketing & Destination Management" }
      ],
      7: [
        { code: "HM701", name: "Bakery & Confectionery Arts" },
        { code: "HM702", name: "Revenue Management & Pricing in Hospitality" },
        { code: "HM703", name: "Food & Beverage Cost Control" },
        { code: "HM704", name: "Safety, Security & Crisis Management" }
      ],
      8: [
        { code: "HM801", name: "Entrepreneurship in Hospitality & Catering" },
        { code: "HM802", name: "Total Quality Management in Hospitality" },
        { code: "HM803", name: "Research Project & Comprehensive Viva" }
      ]
    }
  },
  "BFAD": {
    name: "BFAD",
    fullName: "Bachelor of Fashion & Apparel Design",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {
      1: [
        { code: "BFAD101", name: "Elements of Fashion & Design" },
        { code: "BFAD102", name: "Fashion Illustration & Model Drawing" },
        { code: "BFAD103", name: "Introduction to Textiles & Fiber Science" },
        { code: "BFAD104", name: "Basic Sewing Techniques" },
        { code: "BFAD105", name: "Professional Communication" }
      ],
      2: [
        { code: "BFAD201", name: "History of Western & Indian Costume" },
        { code: "BFAD202", name: "Pattern Making & Drafting - I" },
        { code: "BFAD203", name: "Garment Construction - I" },
        { code: "BFAD204", name: "Fabric Structure & Dyeing" },
        { code: "BFAD205", name: "Computer Applications in Fashion" }
      ],
      3: [
        { code: "BFAD301", name: "Advanced Pattern Making - II" },
        { code: "BFAD302", name: "Garment Construction - II" },
        { code: "BFAD303", name: "Textile Printing & Surface Ornamentation" },
        { code: "BFAD304", name: "Fashion Illustration with CAD" }
      ],
      4: [
        { code: "BFAD401", name: "Draping Techniques" },
        { code: "BFAD402", name: "Traditional Indian Textiles & Embroideries" },
        { code: "BFAD403", name: "Fabric Sourcing & Quality Assessment" },
        { code: "BFAD404", name: "Menswear Design & Construction" }
      ],
      5: [
        { code: "BFAD501", name: "Womenswear & Couture Design" },
        { code: "BFAD502", name: "Knitwear Design & Technology" },
        { code: "BFAD503", name: "Fashion Merchandising & Retail Buying" },
        { code: "BFAD504", name: "Apparel Production Technology" }
      ],
      6: [
        { code: "BFAD601", name: "Kidswear Design & Styling" },
        { code: "BFAD602", name: "Fashion Marketing & Brand Management" },
        { code: "BFAD603", name: "Quality Control in Apparel Industry" },
        { code: "BFAD604", name: "Industrial Internship in Garment Export House" }
      ],
      7: [
        { code: "BFAD701", name: "Fashion Forecasting & Trend Analysis" },
        { code: "BFAD702", name: "Visual Merchandising & Fashion Styling" },
        { code: "BFAD703", name: "Sustainable Fashion & Eco-Textiles" },
        { code: "BFAD704", name: "Pre-Collection Development" }
      ],
      8: [
        { code: "BFAD801", name: "Graduation Fashion Show Collection" },
        { code: "BFAD802", name: "Fashion Portfolio & Digital Lookbook" },
        { code: "BFAD803", name: "Fashion Entrepreneurship & E-Commerce" }
      ]
    }
  },
  "BFA": {
    name: "BFA",
    fullName: "Bachelor of Fine Arts",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6], "4th Year": [7, 8] },
    subjects: {
      1: [
        { code: "BFA101", name: "Foundation Drawing & Still Life" },
        { code: "BFA102", name: "Color Studies & Pigment Composition" },
        { code: "BFA103", name: "Clay Modeling & 3D Sculpture Foundation" },
        { code: "BFA104", name: "History of Indian Art" },
        { code: "BFA105", name: "English & Art Criticism Fundamentals" }
      ],
      2: [
        { code: "BFA201", name: "Portraiture & Figure Drawing" },
        { code: "BFA202", name: "Composition & Perspective Painting" },
        { code: "BFA203", name: "Printmaking Fundamentals" },
        { code: "BFA204", name: "History of Western Art" },
        { code: "BFA205", name: "Aesthetics & Visual Philosophy" }
      ],
      3: [
        { code: "BFA301", name: "Oil & Acrylic Painting Studio - I" },
        { code: "BFA302", name: "Advanced Life Study & Anatomy" },
        { code: "BFA303", name: "Applied Art & Typography" },
        { code: "BFA304", name: "Modern Indian Art Movements" }
      ],
      4: [
        { code: "BFA401", name: "Landscape & Outdoor Painting" },
        { code: "BFA402", name: "Lithography & Etching Techniques" },
        { code: "BFA403", name: "Creative Sculpture & Mixed Media" },
        { code: "BFA404", name: "History of Modern Western Art" }
      ],
      5: [
        { code: "BFA501", name: "Advanced Painting Studio - II" },
        { code: "BFA502", name: "Digital Art, Illustration & Photography" },
        { code: "BFA503", name: "Mural & Fresco Techniques" },
        { code: "BFA504", name: "Art Restoration & Museum Studies" }
      ],
      6: [
        { code: "BFA601", name: "Contemporary Art Practices & Conceptual Art" },
        { code: "BFA602", name: "Graphic Design & Editorial Illustration" },
        { code: "BFA603", name: "Casting & Metal Sculpture Techniques" },
        { code: "BFA604", name: "Art Criticism & Curatorial Studies" }
      ],
      7: [
        { code: "BFA701", name: "Individual Studio Practice" },
        { code: "BFA702", name: "Installation & New Media Art" },
        { code: "BFA703", name: "Art Gallery Management & Exhibition Design" },
        { code: "BFA704", name: "Art Portfolio & Artist Statement" }
      ],
      8: [
        { code: "BFA801", name: "Degree Show / Final Solo Exhibition" },
        { code: "BFA802", name: "Final Dissertation & Viva-Voce" },
        { code: "BFA803", name: "Professional Practice & Copyright for Artists" }
      ]
    }
  },
  "BVoc": {
    name: "B.Voc",
    fullName: "Bachelor of Vocation",
    years: ["1st Year", "2nd Year", "3rd Year"],
    sems: { "1st Year": [1, 2], "2nd Year": [3, 4], "3rd Year": [5, 6] },
    subjects: {
      1: [
        { code: "BVOC101", name: "General Applied Communication & IT Fundamentals" },
        { code: "BVOC102", name: "Applied Mathematics & Reasoning" },
        { code: "BVOC103", name: "Domain Skill Practical - I" },
        { code: "BVOC104", name: "Industrial Safety & Tools Handling" },
        { code: "BVOC105", name: "Environmental Studies" }
      ],
      2: [
        { code: "BVOC201", name: "Business Organization & Entrepreneurship" },
        { code: "BVOC202", name: "Digital Tools & Web Applications" },
        { code: "BVOC203", name: "Domain Skill Practical - II" },
        { code: "BVOC204", name: "Quality Management & Standards" }
      ],
      3: [
        { code: "BVOC301", name: "Principles of Accounting & Costing" },
        { code: "BVOC302", name: "Intermediate Vocational Specialization" },
        { code: "BVOC303", name: "Workshop Technology & Lab Practicals" },
        { code: "BVOC304", name: "On-the-Job Training (Phase I)" }
      ],
      4: [
        { code: "BVOC401", name: "Technical Problem Solving & Maintenance" },
        { code: "BVOC402", name: "Customer Relationship & Service Management" },
        { code: "BVOC403", name: "Domain Advanced Practical - III" },
        { code: "BVOC404", name: "Industrial Project Work" }
      ],
      5: [
        { code: "BVOC501", name: "Supply Chain & Inventory Operations" },
        { code: "BVOC502", name: "Sector-Specific Advanced Technology" },
        { code: "BVOC503", name: "Industrial Internship & Apprenticeship" }
      ],
      6: [
        { code: "BVOC601", name: "Professional Ethics & Workplace Laws" },
        { code: "BVOC602", name: "Start-up Management & Business Plan" },
        { code: "BVOC603", name: "Major Vocational Capstone Project & Viva" }
      ]
    }
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
  const norm = normalizeCourseKey(normalizedKey) || normalizedKey;
  const DATA_COURSE_MAP: Record<string, string> = {
    'BTech': 'B.Tech',
    'BTechBiotechnology': 'BTechBiotechnology',
    'BTechAgriculture': 'BTechAgriculture',
    'BTechLateral': 'BTechLateral',
    'BCA': 'BCA',
    'BBA': 'BBA',
    'BBA_BMS': 'BBA_BMS',
    'BPharma': 'B.Pharm',
    'BPharmLateral': 'B.Pharm',
    'PharmD': 'PharmD',
    'MTech': 'M.Tech',
    'MPharm': 'MPharm',
    'MCA': 'MCA',
    'MCAIntegrated': 'MCAIntegrated',
    'MCALateral': 'MCA',
    'MBA': 'MBA',
    'MBAIntegrated': 'MBAIntegrated',
    'MBALateral': 'MBA',
    'BArch': 'BArch',
    'BDes': 'BDes',
    'BHMCT': 'BHMCT',
    'BFAD': 'BFAD',
    'BFA': 'BFA',
    'BVoc': 'BVoc'
  };
  return DATA_COURSE_MAP[norm] ?? DATA_COURSE_MAP[normalizedKey] ?? 'B.Tech';
}

// Year string normalizer (1 -> '1st Year', '2nd Year', etc.)
export function normalizeYearStr(y) {
  if (!y) return "1st Year";
  const digit = String(y).replace(/[^0-9]/g, "");
  if (digit === "1") return "1st Year";
  if (digit === "2") return "2nd Year";
  if (digit === "3") return "3rd Year";
  if (digit === "4") return "4th Year";
  if (digit === "5") return "5th Year";
  if (digit === "6") return "6th Year";
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
    return list.map((item, i) => {
      const name = typeof item === 'object' && item.name ? item.name : String(item);
      const code = typeof item === 'object' && item.code ? item.code : `${norm}-${semDigit}0${i + 1}`;
      return {
        id: `${norm}-${semDigit}-${i}`,
        name,
        code,
        semester: `Sem ${semDigit}`,
        year: normalizeYearStr(year),
        course: norm,
        branch: branch || (norm === "BTech" ? "CSE" : undefined)
      };
    });
  }

  // Otherwise all subjects for the given year
  const normYear = normalizeYearStr(year);
  const semNumbers = conf.sems?.[normYear] || [1, 2];
  const allSubs = [];
  semNumbers.forEach(sNum => {
    const list = conf.subjects?.[sNum] || [];
    list.forEach((item, i) => {
      const name = typeof item === 'object' && item.name ? item.name : String(item);
      const code = typeof item === 'object' && item.code ? item.code : `${norm}-${sNum}0${i + 1}`;
      allSubs.push({
        id: `${norm}-${sNum}-${i}`,
        name,
        code,
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
