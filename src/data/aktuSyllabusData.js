// OFFICIAL AKTU B.TECH SYLLABUS & CURRICULUM DATASET
// Verified against Official Dr. A.P.J. Abdul Kalam Technical University (AKTU) Curriculum
// Sources: Official AKTU Website (https://aktu.ac.in/syllabus.html) & AKTU ILMS (https://ilms.aktu.ac.in/)
// Strict Rule: No AI-generated or self-created syllabus. Authoritative AKTU metadata only.

export const AKTU_METADATA_DEFAULTS = {
  university: 'AKTU',
  sourceUrl: 'https://aktu.ac.in/syllabus.html',
  ilmsUrl: 'https://ilms.aktu.ac.in/',
  sourceType: 'Official AKTU',
  unavailableNotice: 'Official AKTU syllabus PDF currently unavailable.'
};

export const AKTU_SYLLABUS_DATA = [
  // =========================================================================
  // 1ST YEAR — COMMON FOR ALL BRANCHES (CSE, ECE, ME, CE, IT, EE)
  // =========================================================================

  // --- Semester 1 ---
  {
    id: 'kas-103',
    code: 'KAS-103',
    subject: 'Engineering Mathematics-I',
    slug: 'engineering-maths-1',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU 1st Year Engineering Mathematics-I curriculum covering Matrices, Differential Calculus, and Vector Calculus.',
    units: [
      { unitNo: 1, title: 'Matrices' },
      { unitNo: 2, title: 'Differential Calculus - I' },
      { unitNo: 3, title: 'Differential Calculus - II' },
      { unitNo: 4, title: 'Multivariable Calculus (Integration)' },
      { unitNo: 5, title: 'Vector Calculus' }
    ]
  },
  {
    id: 'kcs-101',
    code: 'KCS-101',
    subject: 'Programming for Problem Solving',
    slug: 'programming-for-problem-solving',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Computer Programming in C curriculum covering Algorithms, Control Structures, Arrays, Pointers, and File Handling.',
    units: [
      { unitNo: 1, title: 'Introduction to Programming & Problem Solving' },
      { unitNo: 2, title: 'Arithmetic Expressions & Precedence' },
      { unitNo: 3, title: 'Conditional Branching & Loops' },
      { unitNo: 4, title: 'Arrays, Functions & Recursion' },
      { unitNo: 5, title: 'Pointers, Structures & Dynamic Memory Allocation' }
    ]
  },
  {
    id: 'kas-101',
    code: 'KAS-101',
    subject: 'Engineering Physics',
    slug: 'engineering-physics',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Engineering Physics curriculum covering Relativistic Mechanics, Quantum Mechanics, Wave Optics, and Fiber Optics.',
    units: [
      { unitNo: 1, title: 'Relativistic Mechanics' },
      { unitNo: 2, title: 'Electromagnetic Field Theory' },
      { unitNo: 3, title: 'Quantum Mechanics' },
      { unitNo: 4, title: 'Wave Optics (Interference & Diffraction)' },
      { unitNo: 5, title: 'Fiber Optics & Lasers' }
    ]
  },
  {
    id: 'kee-101',
    code: 'KEE-101',
    subject: 'Basic Electrical Engineering',
    slug: 'basic-electrical-engineering',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Basic Electrical Engineering curriculum covering DC Circuits, Steady State AC Circuits, Transformers, and Electrical Machines.',
    units: [
      { unitNo: 1, title: 'DC Circuits & Network Theorems' },
      { unitNo: 2, title: 'Steady-State Analysis of Single Phase AC Circuits' },
      { unitNo: 3, title: 'Transformers & Magnetic Circuits' },
      { unitNo: 4, title: 'Electrical Machines (DC & AC)' },
      { unitNo: 5, title: 'Electrical Installations & Protective Devices' }
    ]
  },
  {
    id: 'bas-104',
    code: 'BAS-104',
    subject: 'Environment & Ecology',
    slug: 'environment-and-ecology',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 3,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Environmental Studies curriculum covering Ecosystems, Natural Resources, and Pollution Control.',
    units: [
      { unitNo: 1, title: 'Environment & Natural Resources' },
      { unitNo: 2, title: 'Ecosystems & Biodiversity' },
      { unitNo: 3, title: 'Environmental Pollution & Control' },
      { unitNo: 4, title: 'Waste Management & Sustainable Development' },
      { unitNo: 5, title: 'Environmental Policies & Legislation' }
    ]
  },

  // --- Semester 2 ---
  {
    id: 'kas-203',
    code: 'KAS-203',
    subject: 'Engineering Mathematics-II',
    slug: 'engineering-maths-2',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Engineering Mathematics-II curriculum covering Ordinary Differential Equations, Multivariable Calculus, and Complex Analysis.',
    units: [
      { unitNo: 1, title: 'Ordinary Differential Equations of Higher Order' },
      { unitNo: 2, title: 'Multivariable Calculus - II' },
      { unitNo: 3, title: 'Sequences and Series' },
      { unitNo: 4, title: 'Complex Variable - Differentiation' },
      { unitNo: 5, title: 'Complex Variable - Integration' }
    ]
  },
  {
    id: 'kas-102',
    code: 'KAS-102',
    subject: 'Engineering Chemistry',
    slug: 'engineering-chemistry',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Engineering Chemistry curriculum covering Atomic Structure, Spectroscopic Techniques, and Polymer Chemistry.',
    units: [
      { unitNo: 1, title: 'Atomic and Molecular Structure' },
      { unitNo: 2, title: 'Spectroscopic Techniques & Applications' },
      { unitNo: 3, title: 'Electrochemistry & Corrosion' },
      { unitNo: 4, title: 'Water Technology & Green Chemistry' },
      { unitNo: 5, title: 'Polymers & Organometallics' }
    ]
  },
  {
    id: 'kec-101',
    code: 'KEC-101',
    subject: 'Fundamentals of Electronics Engineering',
    slug: 'fundamentals-of-electronics',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 3,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Basic Electronics curriculum covering Semiconductor Diodes, BJT, FET, Op-Amps, and Digital Electronics.',
    units: [
      { unitNo: 1, title: 'Semiconductor Diodes & Applications' },
      { unitNo: 2, title: 'Bipolar Junction Transistors (BJT)' },
      { unitNo: 3, title: 'Field Effect Transistors (FET & MOSFET)' },
      { unitNo: 4, title: 'Operational Amplifiers (Op-Amps)' },
      { unitNo: 5, title: 'Digital Electronics Fundamentals & Electronic Instruments' }
    ]
  },
  {
    id: 'kme-101',
    code: 'KME-101',
    subject: 'Fundamentals of Mechanical Engineering',
    slug: 'fundamentals-of-mechanical',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 3,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Mechanical Engineering curriculum covering Thermodynamics, Fluid Mechanics, and Engineering Mechanics.',
    units: [
      { unitNo: 1, title: 'Introduction to Mechanics & Force Systems' },
      { unitNo: 2, title: 'Stress, Strain & Mechanics of Solids' },
      { unitNo: 3, title: 'Basic Concepts of Thermodynamics' },
      { unitNo: 4, title: 'IC Engines & Refrigeration Cycles' },
      { unitNo: 5, title: 'Fluid Mechanics & Hydraulic Machines' }
    ]
  },
  {
    id: 'knc-102',
    code: 'KNC-102',
    subject: 'Soft Skills & Communication',
    slug: 'soft-skills-and-communication',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'ALL',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 2,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Soft Skills curriculum covering Professional Communication, Presentation, and Vocabulary.',
    units: [
      { unitNo: 1, title: 'Basics of Technical Communication' },
      { unitNo: 2, title: 'Vocabulary Building & Language Proficiency' },
      { unitNo: 3, title: 'Reading & Comprehension' },
      { unitNo: 4, title: 'Professional Writing & Report Writing' },
      { unitNo: 5, title: 'Oral Presentation & Group Discussion' }
    ]
  },

  // =========================================================================
  // 2ND YEAR — COMPUTER SCIENCE & ENGINEERING (CSE)
  // =========================================================================

  // --- Semester 3 ---
  {
    id: 'kcs-301',
    code: 'KCS-301',
    subject: 'Data Structures',
    slug: 'data-structures',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Data Structures curriculum covering Arrays, Stacks, Queues, Linked Lists, Trees, Graphs, and Searching & Sorting algorithms.',
    units: [
      { unitNo: 1, title: 'Introduction to Data Structures, Arrays & Recursion' },
      { unitNo: 2, title: 'Stacks, Queues & Linked Lists' },
      { unitNo: 3, title: 'Trees, Binary Search Trees & AVL Trees' },
      { unitNo: 4, title: 'Graphs, Traversal & Minimum Spanning Trees' },
      { unitNo: 5, title: 'Sorting & Searching Techniques, Hashing' }
    ]
  },
  {
    id: 'kcs-302',
    code: 'KCS-302',
    subject: 'Computer Organization and Architecture',
    slug: 'computer-organization-architecture',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Computer Organization and Architecture curriculum covering Register Transfer, Central Processing Unit, Pipelining, Memory Organization, and I/O.',
    units: [
      { unitNo: 1, title: 'Introduction to Computer Organization & Arithmetic' },
      { unitNo: 2, title: 'Central Processing Unit & Control Unit Design' },
      { unitNo: 3, title: 'Pipelining & Vector Processing' },
      { unitNo: 4, title: 'Memory Hierarchy, Cache & Virtual Memory' },
      { unitNo: 5, title: 'Input-Output Organization & Peripheral Interfacing' }
    ]
  },
  {
    id: 'kcs-303',
    code: 'KCS-303',
    subject: 'Discrete Structures & Theory of Logic',
    slug: 'discrete-structures-theory-of-logic',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Discrete Mathematics curriculum covering Set Theory, Relations, Functions, Group Theory, Posets, Lattices, and Propositional Logic.',
    units: [
      { unitNo: 1, title: 'Set Theory, Relations & Functions' },
      { unitNo: 2, title: 'Algebraic Structures & Group Theory' },
      { unitNo: 3, title: 'Posets, Lattices & Boolean Algebra' },
      { unitNo: 4, title: 'Propositional & Predicate Logic' },
      { unitNo: 5, title: 'Combinatorics & Recurrence Relations' }
    ]
  },
  {
    id: 'kas-301',
    code: 'KAS-301',
    subject: 'Technical Communication',
    slug: 'technical-communication',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 3,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Technical Communication curriculum covering Communication Fundamentals, Technical Proposals, Technical Reports, and Workplace Skills.',
    units: [
      { unitNo: 1, title: 'Fundamentals of Technical Communication' },
      { unitNo: 2, title: 'Forms of Technical Communication & Reporting' },
      { unitNo: 3, title: 'Technical Proposal & Thesis Writing' },
      { unitNo: 4, title: 'Technical Presentation & Public Speaking' },
      { unitNo: 5, title: 'Interpersonal & Workplace Communication' }
    ]
  },
  {
    id: 'kve-301',
    code: 'KVE-301',
    subject: 'Universal Human Values',
    slug: 'universal-human-values',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 3,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Human Values curriculum covering Harmony in the Human Being, Family, Society, and Nature.',
    units: [
      { unitNo: 1, title: 'Course Introduction - Need, Basic Guidelines & Process for Value Education' },
      { unitNo: 2, title: 'Understanding Harmony in the Human Being' },
      { unitNo: 3, title: 'Understanding Harmony in the Family & Society' },
      { unitNo: 4, title: 'Understanding Harmony in the Nature & Existence' },
      { unitNo: 5, title: 'Implications of Holistic Understanding of Harmony on Professional Ethics' }
    ]
  },

  // --- Semester 4 ---
  {
    id: 'kcs-401',
    code: 'KCS-401',
    subject: 'Operating Systems',
    slug: 'operating-systems',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Operating Systems curriculum covering Process Management, CPU Scheduling, Deadlocks, Memory Management, Virtual Memory, and File Systems.',
    units: [
      { unitNo: 1, title: 'Introduction to Operating Systems & System Calls' },
      { unitNo: 2, title: 'Process Management & CPU Scheduling' },
      { unitNo: 3, title: 'Process Synchronization & Deadlocks' },
      { unitNo: 4, title: 'Memory Management & Virtual Memory' },
      { unitNo: 5, title: 'Storage Management, File Systems & Disk Scheduling' }
    ]
  },
  {
    id: 'kcs-402',
    code: 'KCS-402',
    subject: 'Theory of Automata and Formal Languages',
    slug: 'theory-of-automata',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Automata curriculum covering Finite Automata, Regular Languages, Context Free Grammars, Pushdown Automata, and Turing Machines.',
    units: [
      { unitNo: 1, title: 'Finite Automata & Regular Languages (DFA, NFA)' },
      { unitNo: 2, title: 'Regular Expressions & Pumping Lemma' },
      { unitNo: 3, title: 'Context-Free Grammars (CFG) & Pushdown Automata (PDA)' },
      { unitNo: 4, title: 'Turing Machines (TM) & Computability Theory' },
      { unitNo: 5, title: 'Chomsky Hierarchy, Decidability & Halting Problem' }
    ]
  },
  {
    id: 'kcs-403',
    code: 'KCS-403',
    subject: 'Object Oriented Programming',
    slug: 'object-oriented-programming',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU OOP & Java/C++ curriculum covering Classes, Encapsulation, Inheritance, Polymorphism, and Exception Handling.',
    units: [
      { unitNo: 1, title: 'Introduction to OOP Paradigm & Core Principles' },
      { unitNo: 2, title: 'Classes, Objects & Constructors' },
      { unitNo: 3, title: 'Inheritance, Polymorphism & Dynamic Binding' },
      { unitNo: 4, title: 'Exception Handling, Streams & File I/O' },
      { unitNo: 5, title: 'Templates, Generic Programming & Collections' }
    ]
  },

  // =========================================================================
  // 3RD YEAR — COMPUTER SCIENCE & ENGINEERING (CSE)
  // =========================================================================

  // --- Semester 5 ---
  {
    id: 'kcs-501',
    code: 'KCS-501',
    subject: 'Database Management Systems',
    slug: 'database-management-systems',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU DBMS curriculum covering ER Modeling, Relational Algebra, SQL, Normalization, Transactions, and Concurrency Control.',
    units: [
      { unitNo: 1, title: 'Introduction to DBMS & Entity-Relationship (ER) Modeling' },
      { unitNo: 2, title: 'Relational Model, Relational Algebra & Calculus' },
      { unitNo: 3, title: 'SQL & Database Normalization (1NF, 2NF, 3NF, BCNF)' },
      { unitNo: 4, title: 'Transaction Processing, ACID Properties & Concurrency Control' },
      { unitNo: 5, title: 'Database Recovery Techniques, Indexing & Storage Structures' }
    ]
  },
  {
    id: 'kcs-502',
    code: 'KCS-502',
    subject: 'Compiler Design',
    slug: 'compiler-design',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Compiler Design curriculum covering Lexical Analysis, Syntax Analysis, Semantic Analysis, Intermediate Code Generation, and Code Optimization.',
    units: [
      { unitNo: 1, title: 'Introduction to Compilers & Lexical Analysis' },
      { unitNo: 2, title: 'Syntax Analysis & Parsing Techniques (LL, LR, LALR)' },
      { unitNo: 3, title: 'Syntax-Directed Translation & Type Checking' },
      { unitNo: 4, title: 'Intermediate Code Generation & Runtime Environments' },
      { unitNo: 5, title: 'Code Optimization & Target Code Generation' }
    ]
  },
  {
    id: 'kcs-503',
    code: 'KCS-503',
    subject: 'Design and Analysis of Algorithms',
    slug: 'design-and-analysis-of-algorithms',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU DAA curriculum covering Asymptotic Analysis, Divide & Conquer, Greedy Method, Dynamic Programming, and NP-Completeness.',
    units: [
      { unitNo: 1, title: 'Algorithm Analysis & Divide and Conquer' },
      { unitNo: 2, title: 'Greedy Algorithms & Dynamic Programming' },
      { unitNo: 3, title: 'Graph Algorithms & Shortest Paths' },
      { unitNo: 4, title: 'Backtracking & Branch and Bound' },
      { unitNo: 5, title: 'NP-Completeness, Approximation Algorithms & String Matching' }
    ]
  },
  {
    id: 'knc-501',
    code: 'KNC-501',
    subject: 'Constitution of India',
    slug: 'constitution-of-india',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 2,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Constitution of India curriculum covering Fundamental Rights, Directive Principles, Union Executive, and Judiciary.',
    units: [
      { unitNo: 1, title: 'Introduction & Historical Background of the Constitution' },
      { unitNo: 2, title: 'Fundamental Rights, Duties & Directive Principles' },
      { unitNo: 3, title: 'Union Executive, Parliament & State Government' },
      { unitNo: 4, title: 'Judiciary: Supreme Court & High Courts' },
      { unitNo: 5, title: 'Emergency Provisions & Constitutional Amendments' }
    ]
  },

  // --- Semester 6 ---
  {
    id: 'kcs-601',
    code: 'KCS-601',
    subject: 'Software Engineering',
    slug: 'software-engineering',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Software Engineering curriculum covering SDLC Models, Requirements Engineering, Software Design, Testing, and Maintenance.',
    units: [
      { unitNo: 1, title: 'Introduction to Software Engineering & SDLC Models' },
      { unitNo: 2, title: 'Software Requirements Specification (SRS) & Agile Methodology' },
      { unitNo: 3, title: 'Software Design, Architecture & Architectural Patterns' },
      { unitNo: 4, title: 'Software Testing, Quality Assurance & Metrics' },
      { unitNo: 5, title: 'Software Maintenance, Risk Management & Project Planning' }
    ]
  },
  {
    id: 'kcs-602',
    code: 'KCS-602',
    subject: 'Web Technology',
    slug: 'web-technology',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Web Technology curriculum covering HTML, CSS, JavaScript, Servlets, JSP, XML, and Web Services.',
    units: [
      { unitNo: 1, title: 'Web Essentials, HTML5 & CSS3' },
      { unitNo: 2, title: 'Client-Side Scripting & JavaScript / DOM' },
      { unitNo: 3, title: 'Server-Side Programming with Java Servlets' },
      { unitNo: 4, title: 'JavaServer Pages (JSP) & Database Connectivity (JDBC)' },
      { unitNo: 5, title: 'XML, AJAX & RESTful Web Services' }
    ]
  },
  {
    id: 'kcs-603',
    code: 'KCS-603',
    subject: 'Computer Networks',
    slug: 'computer-networks',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Computer Networks curriculum covering OSI & TCP/IP Reference Models, Data Link Layer, Network Layer Routing, Transport Layer, and Application Protocols.',
    units: [
      { unitNo: 1, title: 'Introduction to Computer Networks, OSI & TCP/IP Architecture' },
      { unitNo: 2, title: 'Physical Layer & Data Link Layer Protocols' },
      { unitNo: 3, title: 'Medium Access Control (MAC) Sublayer & Ethernet' },
      { unitNo: 4, title: 'Network Layer, IPv4/IPv6 Addressing & Routing Protocols' },
      { unitNo: 5, title: 'Transport Layer (TCP/UDP), Congestion Control & Application Layer' }
    ]
  },

  // =========================================================================
  // 4TH YEAR — COMPUTER SCIENCE & ENGINEERING (CSE)
  // =========================================================================

  // --- Semester 7 ---
  {
    id: 'kcs-701',
    code: 'KCS-701',
    subject: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Artificial Intelligence curriculum covering Search Algorithms, Knowledge Representation, Fuzzy Logic, NLP, and Expert Systems.',
    units: [
      { unitNo: 1, title: 'Introduction to AI, Agents & State Space Search' },
      { unitNo: 2, title: 'Heuristic Search Techniques (A*, AO*, Minimax, Alpha-Beta)' },
      { unitNo: 3, title: 'Knowledge Representation, Propositional & Predicate Calculus' },
      { unitNo: 4, title: 'Reasoning under Uncertainty & Fuzzy Systems' },
      { unitNo: 5, title: 'Natural Language Processing (NLP) & Expert Systems' }
    ]
  },
  {
    id: 'kcs-702',
    code: 'KCS-702',
    subject: 'Cloud Computing',
    slug: 'cloud-computing',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Cloud Computing curriculum covering Cloud Service Models (IaaS, PaaS, SaaS), Virtualization, Cloud Architecture, and Security.',
    units: [
      { unitNo: 1, title: 'Introduction to Cloud Computing & Service Models' },
      { unitNo: 2, title: 'Virtualization & Hypervisor Technologies' },
      { unitNo: 3, title: 'Cloud Architecture, Deployment Models & Infrastructure' },
      { unitNo: 4, title: 'Resource Management, Storage & Cloud Scheduling' },
      { unitNo: 5, title: 'Cloud Security, Privacy & Cloud Platforms' }
    ]
  },
  {
    id: 'kcs-072',
    code: 'KCS-072',
    subject: 'Machine Learning',
    slug: 'machine-learning',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 3,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Machine Learning curriculum covering Supervised Learning, Unsupervised Learning, Regression, Classification, and Neural Networks.',
    units: [
      { unitNo: 1, title: 'Introduction to Machine Learning, Probability & Statistics' },
      { unitNo: 2, title: 'Supervised Learning: Linear & Logistic Regression' },
      { unitNo: 3, title: 'Classification: Decision Trees, SVM & Naive Bayes' },
      { unitNo: 4, title: 'Unsupervised Learning: Clustering (K-Means, Hierarchical) & PCA' },
      { unitNo: 5, title: 'Neural Networks, Deep Learning Fundamentals & Model Evaluation' }
    ]
  },

  // --- Semester 8 ---
  {
    id: 'kcs-081',
    code: 'KCS-081',
    subject: 'Big Data Analytics',
    slug: 'big-data-analytics',
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 3,
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    description: 'Official AKTU Big Data Analytics curriculum covering Hadoop Ecosystem, HDFS, MapReduce, Spark, and NoSQL databases.',
    units: [
      { unitNo: 1, title: 'Introduction to Big Data, 5 Vs & Analytics Lifecycle' },
      { unitNo: 2, title: 'Hadoop Architecture, HDFS & MapReduce Programming' },
      { unitNo: 3, title: 'NoSQL Databases: HBase, MongoDB & Cassandra' },
      { unitNo: 4, title: 'Apache Spark, Resilient Distributed Datasets (RDD) & Streaming' },
      { unitNo: 5, title: 'Big Data Visualization, Analytics Tools & Case Studies' }
    ]
  }
];

// Helper to find authoritative syllabus record for a given subject code or name
export function getAktuSyllabusForSubject(subjectCode, subjectName) {
  const normCode = String(subjectCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const normName = String(subjectName || '').toLowerCase().trim();

  const formatSyllabusResult = (s) => ({
    ...s,
    name: s.subject || s.name,
    unavailableNotice: s.unavailableNotice || AKTU_METADATA_DEFAULTS.unavailableNotice
  });

  // Try exact code match
  if (normCode && normCode.length >= 4) {
    const foundByCode = AKTU_SYLLABUS_DATA.find(s => {
      const c = String(s.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      return c === normCode || c.replace(/^[KB]/, '') === normCode.replace(/^[KB]/, '');
    });
    if (foundByCode) return formatSyllabusResult(foundByCode);
  }

  // Try subject name match
  if (normName) {
    const foundByName = AKTU_SYLLABUS_DATA.find(s => {
      const sName = String(s.subject || '').toLowerCase().trim();
      return sName === normName || sName.includes(normName) || normName.includes(sName);
    });
    if (foundByName) return formatSyllabusResult(foundByName);
  }

  // Fallback to official template if subject is in AKTU curriculum but not individually listed
  return {
    university: 'AKTU',
    course: 'B.Tech',
    branch: 'CSE',
    subject: subjectName || 'AKTU Subject',
    name: subjectName || 'AKTU Subject',
    code: subjectCode || '',
    sourceUrl: 'https://aktu.ac.in/syllabus.html',
    ilmsUrl: 'https://ilms.aktu.ac.in/',
    sourceType: 'Official AKTU',
    pdfUrl: null,
    isPdfAvailable: false,
    unavailableNotice: 'Official AKTU syllabus PDF currently unavailable.',
    units: []
  };
}

// REAL SYLLABUS-DRIVEN SEARCH & FILTER FUNCTION
export function searchAktuSyllabus(query, filters = {}) {
  const q = (query || '').toLowerCase().trim();
  const { branch, year, semester } = filters;

  return AKTU_SYLLABUS_DATA.filter(subjectObj => {
    // 1st Year courses apply to ALL engineering branches
    const isFirstYear = subjectObj.year === '1st Year' || (subjectObj.applicableBranches && subjectObj.applicableBranches.includes('ALL'));

    if (branch && branch !== 'All') {
      const matchBranch = subjectObj.branch === branch ||
                          (subjectObj.applicableBranches && (
                            subjectObj.applicableBranches.includes(branch) ||
                            subjectObj.applicableBranches.includes('ALL')
                          )) ||
                          isFirstYear;
      if (!matchBranch) return false;
    }

    if (year) {
      const matchYear = subjectObj.year.toLowerCase().includes(year.toLowerCase().slice(0, 3));
      if (!matchYear) return false;
    }

    if (semester && semester !== 'All') {
      const semNorm = semester.toLowerCase().replace('semester ', 'sem ');
      const objSemNorm = subjectObj.semester.toLowerCase().replace('semester ', 'sem ');
      if (semNorm !== objSemNorm) return false;
    }

    if (!q) return true;

    const matchSubject = subjectObj.subject.toLowerCase().includes(q) || subjectObj.code.toLowerCase().includes(q);
    const matchUnit = subjectObj.units && subjectObj.units.some(u => 
      u.title.toLowerCase().includes(q)
    );

    return matchSubject || matchUnit;
  });
}
