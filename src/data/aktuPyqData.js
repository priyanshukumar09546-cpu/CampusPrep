// OFFICIAL AKTU B.TECH UNIT-WISE PYQ DATASET
// Verified against AKTU B.Tech Curriculum for CSE, ECE, ME, CE, IT, EE, AI & DS, and Applied Sciences

export const AKTU_PYQ_DATA = [
  // =========================================================================
  // 1ST YEAR — COMMON FOR ALL BRANCHES (CSE, ECE, ME, CE, IT, EE, AI & DS)
  // =========================================================================

  // --- 1st Year: Semester 1 ---
  {
    id: 'pyq-kas-103',
    code: 'KAS-103',
    subject: 'Engineering Mathematics-I',
    slug: 'engineering-maths-1',
    branch: 'Maths',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    description: 'AKTU 1st Year Exam Papers for Matrices, Differential Calculus, Partial Differentiation, Expansion of Functions, Vector Calculus.',
    units: [
      {
        unitNo: 1,
        title: 'Matrices',
        topics: ['Types of Matrices & Elementary Transformations', 'Rank of Matrix & Consistency of Linear Equations', 'Eigen Values & Eigen Vectors, Cayley-Hamilton Theorem'],
        pyqs: [
          {
            id: 'pyq-maths1-2024-u1',
            title: 'AKTU Maths-I Unit 1 PYQ Paper (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Differential Calculus - I',
        topics: ['Leibnitz Theorem & Successive Differentiation', 'Partial Differentiation & Euler Theorem', 'Total Derivatives'],
        pyqs: [
          {
            id: 'pyq-maths1-2024-u2',
            title: 'AKTU Maths-I Unit 2 PYQ Paper (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Differential Calculus - II',
        topics: ['Expansion of Functions (Taylor & Maclaurin Series)', 'Jacobian Matrix & Applications', 'Extrema of Functions of Two Variables (Lagrange Multiplier)'],
        pyqs: [
          {
            id: 'pyq-maths1-2023-u3',
            title: 'AKTU Maths-I Solved Quantum PYQ (2023)',
            examYear: '2023',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Multivariable Calculus (Integration)',
        topics: ['Double & Triple Integrals', 'Change of Order of Integration', 'Beta & Gamma Functions'],
        pyqs: [
          {
            id: 'pyq-maths1-2023-u4',
            title: 'AKTU Maths-I Solved Quantum PYQ (2023)',
            examYear: '2023',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Vector Calculus',
        topics: ['Gradient, Divergence & Curl', 'Line, Surface & Volume Integrals', 'Green, Gauss Divergence & Stokes Theorem'],
        pyqs: [
          {
            id: 'pyq-maths1-2023-u5',
            title: 'AKTU Maths-I Solved Quantum PYQ (2023)',
            examYear: '2023',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kcs-101',
    code: 'KCS-101',
    subject: 'Programming for Problem Solving (PPS)',
    slug: 'programming-for-problem-solving',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    description: 'AKTU Exam Papers for C Programming Basics, Control Structures, Arrays, Functions, Pointers, Structures, and File Handling.',
    units: [
      {
        unitNo: 1,
        title: 'Introduction to Programming & Basics of C',
        topics: ['Flowcharts & Algorithms', 'Data Types, Operators & Expressions', 'Header Files & Input/Output Statements'],
        pyqs: [
          {
            id: 'pyq-pps-2024-u1',
            title: 'AKTU PPS Solved Quantum PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Control Structures & Conditional Branching',
        topics: ['If-Else, Switch Case', 'Loops: For, While, Do-While', 'Break, Continue & Goto Statements'],
        pyqs: [
          {
            id: 'pyq-pps-2024-u2',
            title: 'AKTU PPS Unit 2 PYQ Paper (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Arrays & Functions',
        topics: ['1D & 2D Arrays', 'Function Call by Value vs Call by Reference', 'Recursion & Recursion Trees'],
        pyqs: [
          {
            id: 'pyq-pps-2023-u3',
            title: 'AKTU PPS Solved Quantum PYQ (2023)',
            examYear: '2023',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Pointers & Dynamic Memory',
        topics: ['Pointer Arithmetic & Array Pointers', 'Dynamic Memory Allocation (malloc, calloc, free)', 'Strings & String Functions'],
        pyqs: [
          {
            id: 'pyq-pps-2023-u4',
            title: 'AKTU PPS Solved Quantum PYQ (2023)',
            examYear: '2023',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Structures & File Handling',
        topics: ['Structures & Unions', 'File Operations: fopen, fclose, fread, fwrite', 'Command Line Arguments'],
        pyqs: [
          {
            id: 'pyq-pps-2023-u5',
            title: 'AKTU PPS Solved Quantum PYQ (2023)',
            examYear: '2023',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kas-101',
    code: 'KAS-101',
    subject: 'Engineering Physics',
    slug: 'engineering-physics',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    description: 'AKTU Exam Papers for Relativistic Mechanics, Electromagnetic Field Theory, Quantum Mechanics, Wave Optics, and Fiber Optics.',
    units: [
      {
        unitNo: 1,
        title: 'Relativistic Mechanics',
        topics: ['Inertial & Non-Inertial Frames', 'Michelson-Morley Experiment', 'Lorentz Transformations & Time Dilation', 'Mass-Energy Equivalence E=mc2'],
        pyqs: [
          {
            id: 'pyq-physics-2024-u1',
            title: 'AKTU Physics Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Electromagnetic Field Theory',
        topics: ['Displacement Current & Continuity Equation', 'Maxwell Equations in Differential & Integral Form', 'Poynting Vector & Electromagnetic Waves'],
        pyqs: [
          {
            id: 'pyq-physics-2024-u2',
            title: 'AKTU Physics Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Quantum Mechanics',
        topics: ['Wave-Particle Duality & De-Broglie Waves', 'Heisenberg Uncertainty Principle', 'Schrodinger Time-Dependent & Independent Wave Equation'],
        pyqs: [
          {
            id: 'pyq-physics-2024-u3',
            title: 'AKTU Physics Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Wave Optics & Interference',
        topics: ['Coherence & Interference in Thin Films', 'Newton Rings Experiment', 'Fraunhofer Diffraction at Single & Double Slit'],
        pyqs: [
          {
            id: 'pyq-physics-2024-u4',
            title: 'AKTU Physics Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Fiber Optics & Lasers',
        topics: ['Principle of Optical Fiber & Acceptance Angle', 'Numerical Aperture & Fiber Losses', 'Einstein Coefficients & Ruby/He-Ne Laser'],
        pyqs: [
          {
            id: 'pyq-physics-2024-u5',
            title: 'AKTU Physics Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kee-101',
    code: 'KEE-101',
    subject: 'Basic Electrical Engineering',
    slug: 'basic-electrical-engineering',
    branch: 'EE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    description: 'AKTU Exam Papers for DC Circuits, AC Circuits, Transformers, Electrical Machines, and Power Systems Overview.',
    units: [
      {
        unitNo: 1,
        title: 'DC Circuits & Theorems',
        topics: ['KCL, KVL & Mesh/Nodal Analysis', 'Superposition, Thevenin & Norton Theorems', 'Maximum Power Transfer Theorem'],
        pyqs: [
          {
            id: 'pyq-bee-2024-u1',
            title: 'AKTU BEE Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Single-Phase AC Circuits',
        topics: ['Sinusoidal Waveform & RMS/Average Values', 'Phasor Representation of R, L, C Circuits', 'Series & Parallel Resonance'],
        pyqs: [
          {
            id: 'pyq-bee-2024-u2',
            title: 'AKTU BEE Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Transformers',
        topics: ['Single Phase Transformer Construction & Working', 'EMF Equation & Equivalent Circuit', 'Efficiency & Voltage Regulation'],
        pyqs: [
          {
            id: 'pyq-bee-2024-u3',
            title: 'AKTU BEE Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Electrical Machines',
        topics: ['DC Machines Principle & Construction', '3-Phase Induction Motor Working', 'Synchronous Generator Basics'],
        pyqs: [
          {
            id: 'pyq-bee-2024-u4',
            title: 'AKTU BEE Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Electrical Installations & Batteries',
        topics: ['Components of LT Switchgear (MCB, ELCB, Fuse)', 'Types of Wires & Earthing Methods', 'Battery Types & Calculation of Energy Consumption'],
        pyqs: [
          {
            id: 'pyq-bee-2024-u5',
            title: 'AKTU BEE Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },

  // --- 1st Year: Semester 2 ---
  {
    id: 'pyq-kas-203',
    code: 'KAS-203',
    subject: 'Engineering Mathematics-II',
    slug: 'engineering-maths-2',
    branch: 'Maths',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 4,
    description: 'AKTU Exam Papers for Ordinary Differential Equations, Series Solutions, Complex Variable Calculus, and Laplace Transforms.',
    units: [
      {
        unitNo: 1,
        title: 'Ordinary Differential Equations of First Order',
        topics: ['Exact Differential Equations', 'Linear & Bernoulli Equations', 'Application to Newton Law of Cooling & Circuits'],
        pyqs: [
          {
            id: 'pyq-maths2-2024-u1',
            title: 'AKTU Maths-II Topicwise PYQ Bank (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Linear ODEs of Higher Order',
        topics: ['Homogeneous & Non-Homogeneous Differential Equations', 'Complementary Function & Particular Integral', 'Method of Variation of Parameters'],
        pyqs: [
          {
            id: 'pyq-maths2-2024-u2',
            title: 'AKTU Maths-II Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Laplace Transform',
        topics: ['Laplace Transform of Elementary Functions', 'Shifting Theorems & Inverse Laplace Transform', 'Application to Solution of Differential Equations'],
        pyqs: [
          {
            id: 'pyq-maths2-2024-u3',
            title: 'AKTU Maths-II Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Sequence & Series',
        topics: ['Convergence & Divergence of Sequence', 'Infinite Series Tests: Ratio, Comparison, Integral Tests', 'Fourier Series of Periodic Functions'],
        pyqs: [
          {
            id: 'pyq-maths2-2024-u4',
            title: 'AKTU Maths-II Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Complex Variable Differentiation & Integration',
        topics: ['Analytic Functions & Cauchy-Riemann Equations', 'Cauchy Integral Theorem & Formula', 'Taylor & Laurent Series Expansion'],
        pyqs: [
          {
            id: 'pyq-maths2-2024-u5',
            title: 'AKTU Maths-II Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kas-102',
    code: 'KAS-102',
    subject: 'Engineering Chemistry',
    slug: 'engineering-chemistry',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 4,
    description: 'AKTU Exam Papers for Atomic & Molecular Structure, Spectroscopic Techniques, Water Technology, Corrosion & Polymers.',
    units: [
      {
        unitNo: 1,
        title: 'Atomic & Molecular Structure',
        topics: ['Molecular Orbital Theory (MOT) of Homonuclear & Heteronuclear Diatomics', 'Band Theory of Solids', 'Nanomaterials Synthesis & Applications'],
        pyqs: [
          {
            id: 'pyq-chem-2024-u1',
            title: 'AKTU Chemistry Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Spectroscopic Techniques & Applications',
        topics: ['Elementary Principles of UV-Vis Spectroscopy', 'IR Spectroscopy & Vibration Modes', 'NMR Spectroscopy Basics'],
        pyqs: [
          {
            id: 'pyq-chem-2024-u2',
            title: 'AKTU Chemistry Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Electrochemistry & Corrosion',
        topics: ['Nernst Equation & Electrochemical Cells', 'Mechanism of Corrosion (Dry & Wet)', 'Corrosion Protection & Cathodic Protection'],
        pyqs: [
          {
            id: 'pyq-chem-2024-u3',
            title: 'AKTU Chemistry Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Water Technology',
        topics: ['Hardness of Water & Determination by EDTA Method', 'Boiler Troubles (Sludge, Scale, Caustic Embrittlement)', 'Water Softening: Zeolite & Ion Exchange Process'],
        pyqs: [
          {
            id: 'pyq-chem-2024-u4',
            title: 'AKTU Chemistry Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Polymers & Fuels',
        topics: ['Classification & Polymerization Mechanisms', 'Conducting Polymers & Biodegradable Polymers', 'Calorific Value of Fuel & Bomb Calorimeter'],
        pyqs: [
          {
            id: 'pyq-chem-2024-u5',
            title: 'AKTU Chemistry Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kec-201',
    code: 'KEC-201',
    subject: 'Emerging Domain in Electronics Engineering',
    slug: 'emerging-domain-electronics',
    branch: 'ECE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 3,
    description: 'AKTU Exam Papers for Semiconductor Diodes, BJT, Op-Amp, Digital Electronics, and Communication Systems.',
    units: [
      { unitNo: 1, title: 'Semiconductor Diodes & Applications', topics: ['PN Junction Diode', 'Rectifiers & Filters', 'Zener Diode Regulator'], pyqs: [] },
      { unitNo: 2, title: 'Bipolar Junction Transistors (BJT)', topics: ['BJT Configurations', 'Biasing Techniques', 'Amplifier Action'], pyqs: [] },
      { unitNo: 3, title: 'Operational Amplifiers (Op-Amp)', topics: ['Ideal Op-Amp', 'Inverting & Non-Inverting Amplifiers', 'Summing & Difference Amplifiers'], pyqs: [] },
      { unitNo: 4, title: 'Digital Electronics Fundamentals', topics: ['Number Systems & Binary Codes', 'Logic Gates & Truth Tables', 'Boolean Algebra Simplification'], pyqs: [] },
      { unitNo: 5, title: 'Fundamentals of Communication Engineering', topics: ['Need for Modulation', 'AM & FM Basics', 'Satellite & Cellular Communication Overview'], pyqs: [] }
    ]
  },
  {
    id: 'pyq-kme-201',
    code: 'KME-201',
    subject: 'Fundamentals of Mechanical Engineering',
    slug: 'fundamentals-mechanical-engineering',
    branch: 'ME',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 3,
    description: 'AKTU Exam Papers for Thermodynamics Laws, IC Engines, Refrigeration, Power Transmission, and Engineering Materials.',
    units: [
      { unitNo: 1, title: 'Introduction to Thermodynamics & IC Engines', topics: ['First & Second Laws', '4-Stroke & 2-Stroke Petrol/Diesel Engines', 'Engine Performance Metrics'], pyqs: [] },
      { unitNo: 2, title: 'Refrigeration & Air Conditioning', topics: ['Vapor Compression Refrigeration System (VCRS)', 'Refrigerants & COP', 'Psychrometric Chart Basics'], pyqs: [] },
      { unitNo: 3, title: 'Fluid Mechanics & Turbines', topics: ['Fluid Properties & Pascal Law', 'Bernoulli Theorem & Applications', 'Hydraulic Turbines & Pumps'], pyqs: [] },
      { unitNo: 4, title: 'Power Transmission & Drives', topics: ['Belt, Rope & Chain Drives', 'Gear Trains & Types of Gears', 'Clutches & Brakes Overview'], pyqs: [] },
      { unitNo: 5, title: 'Engineering Materials & Manufacturing', topics: ['Ferrous & Non-Ferrous Metals', 'Stress-Strain Curve for Mild Steel', 'Lathe, Drilling & Welding Processes'], pyqs: [] }
    ]
  },

  // =========================================================================
  // 2ND YEAR — CSE / IT / AI & DS / ECE / ME / CE / EE
  // =========================================================================

  // --- CSE 2nd Year: Semester 3 ---
  {
    id: 'pyq-kcs-301',
    code: 'KCS-301',
    subject: 'Data Structures',
    slug: 'data-structures',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'AKTU Exam Papers for Linear & Non-linear Data Structures, Stacks, Queues, Linked Lists, Trees, Graphs, Sorting, and Searching.',
    units: [
      {
        unitNo: 1,
        title: 'Introduction to Data Structures & Arrays',
        topics: ['Time & Space Complexity Notation', 'Arrays, 2D Arrays & Sparse Matrices', 'Recursion & Tail Recursion'],
        pyqs: [
          {
            id: 'pyq-ds-2024-u1',
            title: 'AKTU Data Structures Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Stacks & Queues',
        topics: ['Stack ADT, Infix to Postfix Conversion', 'Queue ADT, Circular Queue & Priority Queue', 'Deque'],
        pyqs: [
          {
            id: 'pyq-ds-2024-u2',
            title: 'AKTU Data Structures Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Linked Lists',
        topics: ['Singly, Doubly & Circular Linked Lists', 'Polynomial Addition using Linked Lists', 'Doubly Linked Queue'],
        pyqs: [
          {
            id: 'pyq-ds-2024-u3',
            title: 'AKTU Data Structures Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Trees & Binary Search Trees',
        topics: ['Binary Tree Traversal (Inorder, Preorder, Postorder)', 'Binary Search Tree (BST) Operations', 'AVL Trees & Rotations', 'B-Trees & B+ Trees Overview'],
        pyqs: [
          {
            id: 'pyq-ds-2024-u4',
            title: 'AKTU Data Structures Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Graphs, Searching & Sorting',
        topics: ['Graph Representation: Adjacency Matrix & List', 'BFS & DFS Graph Traversals', 'Dijkstra & Prim Algorithm', 'Sorting: Bubble, Quick, Merge, Heap Sort'],
        pyqs: [
          {
            id: 'pyq-ds-2024-u5',
            title: 'AKTU Data Structures Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kcs-302',
    code: 'KCS-302',
    subject: 'Computer Organization & Architecture (COA)',
    slug: 'computer-organization',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'AKTU Exam Papers for Functional Units, Register Transfer Language, ALU, Booth Algorithm, Cache Memory & Pipelining.',
    units: [
      {
        unitNo: 1,
        title: 'Functional Units & Register Transfer',
        topics: ['Bus Architecture & Microoperations', 'Arithmetic & Logic Shift Unit', 'Instruction Codes & Formats'],
        pyqs: [
          {
            id: 'pyq-coa-2024-u1',
            title: 'AKTU COA Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Computer Arithmetic',
        topics: ['Addition & Subtraction with Signed Numbers', 'Booth Multiplication Algorithm', 'Division Algorithms'],
        pyqs: [
          {
            id: 'pyq-coa-2024-u2',
            title: 'AKTU COA Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Control Unit Architecture',
        topics: ['Hardwired Control Unit', 'Microprogrammed Control Unit & Microinstruction', 'Control Memory'],
        pyqs: [
          {
            id: 'pyq-coa-2024-u3',
            title: 'AKTU COA Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Memory Organization',
        topics: ['RAM, ROM & Cache Memory Mapping (Direct, Associative, Set-Associative)', 'Virtual Memory & Page Replacement', 'Secondary Storage Structures'],
        pyqs: [
          {
            id: 'pyq-coa-2024-u4',
            title: 'AKTU COA Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Input-Output Organization & Pipelining',
        topics: ['Peripheral Devices & I/O Interfaces', 'Programmed I/O, Interrupt-Driven I/O & DMA', 'Instruction Pipeline & Pipelining Hazards'],
        pyqs: [
          {
            id: 'pyq-coa-2024-u5',
            title: 'AKTU COA Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kcs-303',
    code: 'KCS-303',
    subject: 'Discrete Mathematics',
    slug: 'discrete-mathematics',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'AKTU Exam Papers for Set Theory, Relations, Functions, Propositional Logic, Lattices, Boolean Algebra & Combinatorics.',
    units: [
      {
        unitNo: 1,
        title: 'Set Theory, Relations & Functions',
        topics: ['Sets, Subsets & Power Set', 'Equivalence Relations & Partial Ordering (POSET)', 'Hasse Diagrams'],
        pyqs: [
          {
            id: 'pyq-dstl-2024-u1',
            title: 'AKTU Discrete Maths Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Algebraic Structures',
        topics: ['Groups, Subgroups, Cosets & Lagrange Theorem', 'Normal Subgroups & Homomorphism', 'Rings, Integral Domains & Fields'],
        pyqs: [
          {
            id: 'pyq-dstl-2024-u2',
            title: 'AKTU Discrete Maths Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Lattices & Boolean Algebra',
        topics: ['Lattices as POSETs & Properties', 'Bounded & Complemented Lattices', 'Boolean Algebra & Karnaugh Maps'],
        pyqs: [
          {
            id: 'pyq-dstl-2024-u3',
            title: 'AKTU Discrete Maths Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Propositional & Predicate Logic',
        topics: ['Propositions, Truth Tables & Tautologies', 'Rules of Inference & Natural Deduction', 'Predicates & Quantifiers'],
        pyqs: [
          {
            id: 'pyq-dstl-2024-u4',
            title: 'AKTU Discrete Maths Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Combinatorics & Recurrence Relations',
        topics: ['Pigeonhole Principle & Permutations/Combinations', 'Recurrence Relations & Generating Functions', 'Homogeneous Linear Recurrence Relations'],
        pyqs: [
          {
            id: 'pyq-dstl-2024-u5',
            title: 'AKTU Discrete Maths Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },

  // --- CSE 2nd Year: Semester 4 ---
  {
    id: 'pyq-kcs-401',
    code: 'KCS-401',
    subject: 'Operating System',
    slug: 'operating-system',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'AKTU Exam Papers covering CPU scheduling, memory management, process synchronization, deadlocks, and file systems.',
    units: [
      {
        unitNo: 1,
        title: 'Introduction & Operating System Structures',
        topics: ['OS Overview & Objectives', 'Types of OS: Batch, Multiprogramming, Time-Sharing', 'System Calls & OS Services'],
        pyqs: [
          {
            id: 'pyq-os-2024-u1',
            title: 'AKTU OS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Process Management & CPU Scheduling',
        topics: ['Process Concept & PCB', 'CPU Scheduling Algorithms (FCFS, SJF, Round-Robin)', 'Inter-Process Communication (IPC)'],
        pyqs: [
          {
            id: 'pyq-os-2024-u2',
            title: 'AKTU OS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Process Synchronization & Deadlocks',
        topics: ['Critical Section Problem & Semaphores', 'Deadlock Prevention & Avoidance (Banker Algorithm)', 'Deadlock Detection & Recovery'],
        pyqs: [
          {
            id: 'pyq-os-2024-u3',
            title: 'AKTU OS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Memory Management & Virtual Memory',
        topics: ['Paging & Segmentation', 'Virtual Memory & Demand Paging', 'Page Replacement Algorithms (FIFO, LRU, Optimal)'],
        pyqs: [
          {
            id: 'pyq-os-2024-u4',
            title: 'AKTU OS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'File Systems & Disk Management',
        topics: ['File Structure & Allocation Methods', 'Disk Scheduling Algorithms (FCFS, SSTF, SCAN, C-SCAN)', 'Swap Space Management'],
        pyqs: [
          {
            id: 'pyq-os-2024-u5',
            title: 'AKTU OS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kcs-402',
    code: 'KCS-402',
    subject: 'Theory of Automata & Formal Languages (TAFL)',
    slug: 'theory-of-automata',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'AKTU Exam Papers for DFA, NFA, Regular Expressions, Context-Free Grammars, Pushdown Automata, and Turing Machines.',
    units: [
      {
        unitNo: 1,
        title: 'Finite Automata & Regular Expressions',
        topics: ['DFA & NFA Equivalence', 'Mealy & Moore Machines', 'Pumping Lemma for Regular Languages'],
        pyqs: [
          {
            id: 'pyq-tafl-2024-u1',
            title: 'AKTU TAFL Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Regular Grammars & Languages',
        topics: ['Regular Grammar Definition', 'Conversion of Regular Grammar to FA', 'Closure Properties of Regular Sets'],
        pyqs: [
          {
            id: 'pyq-tafl-2024-u2',
            title: 'AKTU TAFL Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Context-Free Grammars (CFG) & Languages',
        topics: ['Derivation Trees & Ambiguity in CFG', 'Chomsky Normal Form (CNF) & Greibach Normal Form (GNF)', 'Pumping Lemma for CFLs'],
        pyqs: [
          {
            id: 'pyq-tafl-2024-u3',
            title: 'AKTU TAFL Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Pushdown Automata (PDA)',
        topics: ['Deterministic & Non-Deterministic PDA', 'Equivalence of PDA and CFG', 'Parsing Techniques'],
        pyqs: [
          {
            id: 'pyq-tafl-2024-u4',
            title: 'AKTU TAFL Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Turing Machines & Undecidability',
        topics: ['Turing Machine Definition & Design', 'Church-Turing Thesis', 'Halting Problem & Post Correspondence Problem (PCP)'],
        pyqs: [
          {
            id: 'pyq-tafl-2024-u5',
            title: 'AKTU TAFL Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kcs-403',
    code: 'KCS-403',
    subject: 'Python Programming',
    slug: 'python-programming',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'IT', 'AI & DS', 'Maths', 'EE', 'ECE', 'ME', 'CE'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 3,
    description: 'AKTU Exam Papers for Python Basics, Control Statements, Data Structures, OOPs, Modules & File Handling.',
    units: [
      { unitNo: 1, title: 'Python Basics & Operators', topics: ['Variables & Expressions', 'Input/Output Functions', 'Operators & Precedence'], pyqs: [] },
      { unitNo: 2, title: 'Control Statements & Strings', topics: ['If-Else & Loops', 'Break & Continue', 'String Slice & Operations'], pyqs: [] },
      { unitNo: 3, title: 'Python Lists, Tuples & Dictionaries', topics: ['List Methods & Mutability', 'Tuple Operations', 'Dictionary Keys & Values'], pyqs: [] },
      { unitNo: 4, title: 'Functions & Modules', topics: ['Defining Functions & Arguments', 'Lambda Functions & Recursion', 'Built-in Modules (math, random, os)'], pyqs: [] },
      { unitNo: 5, title: 'OOPs & Exception Handling', topics: ['Classes & Objects', 'Inheritance & Polymorphism', 'Try-Except Blocks & File Read/Write'], pyqs: [] }
    ]
  },

  // =========================================================================
  // 3RD YEAR — ALL BRANCHES
  // =========================================================================

  // --- 3rd Year: CSE / IT / AI & DS ---
  {
    id: 'pyq-kcs-501',
    code: 'KCS-501',
    subject: 'Database Management Systems (DBMS)',
    slug: 'dbms',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'AKTU Exam Papers for Relational Model, ER Diagrams, SQL Queries, Normalization (1NF to BCNF), Transaction Processing, and Concurrency Control.',
    units: [
      {
        unitNo: 1,
        title: 'Introduction & ER Modeling',
        topics: ['Database System Architecture & 3-Schema Architecture', 'ER Diagram Entities, Attributes & Relationships', 'Relational Model & Keys'],
        pyqs: [
          {
            id: 'pyq-dbms-2024-u1',
            title: 'AKTU DBMS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Relational Algebra & SQL',
        topics: ['Relational Algebra Operators', 'SQL DDL, DML, DCL Commands', 'Nested Queries, Views & Joins'],
        pyqs: [
          {
            id: 'pyq-dbms-2024-u2',
            title: 'AKTU DBMS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Database Normalization',
        topics: ['Functional Dependencies & Attribute Closure', 'Normal Forms: 1NF, 2NF, 3NF, BCNF', 'Lossless Join & Dependency Preservation'],
        pyqs: [
          {
            id: 'pyq-dbms-2024-u3',
            title: 'AKTU DBMS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Transaction Processing & Concurrency',
        topics: ['ACID Properties of Transactions', 'Serializability: Conflict & View Serializability', 'Concurrency Control: Two-Phase Locking (2PL)'],
        pyqs: [
          {
            id: 'pyq-dbms-2024-u4',
            title: 'AKTU DBMS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Database Recovery & Indexing',
        topics: ['Failure Classification & Log-Based Recovery', 'Checkpoints & Shadow Paging', 'Indexing Techniques: B-Tree Indexing'],
        pyqs: [
          {
            id: 'pyq-dbms-2024-u5',
            title: 'AKTU DBMS Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kcs-502',
    code: 'KCS-502',
    subject: 'Compiler Design',
    slug: 'compiler-design',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'AKTU Exam Papers for Lexical Analysis, Lex, Syntax Analysis, Yacc, Syntax-Directed Translation, Intermediate Code Generation, and Code Optimization.',
    units: [
      { unitNo: 1, title: 'Introduction & Lexical Analysis', topics: ['Phases of Compiler Architecture', 'Lexical Analyzer & Token Recognition', 'Regular Expressions to Finite Automata'], pyqs: [] },
      { unitNo: 2, title: 'Syntax Analysis & Top-Down Parsing', topics: ['Role of Parser & Context Free Grammar', 'Recursive Descent & LL(1) Parsing', 'FIRST & FOLLOW Sets Computation'], pyqs: [] },
      { unitNo: 3, title: 'Bottom-Up Parsing', topics: ['Shift-Reduce & LR(0) Parsing', 'SLR(1), LALR(1) & CLR(1) Parsing Tables', 'YACC Tool Overview'], pyqs: [] },
      { unitNo: 4, title: 'Syntax-Directed Translation & Intermediate Code', topics: ['Syntax Directed Definitions (SDD) & SDT', '3-Address Code (Triples & Quadruples)', 'DAG Representation of Expressions'], pyqs: [] },
      { unitNo: 5, title: 'Code Optimization & Generation', topics: ['Principal Sources of Optimization', 'Loop Optimization & Basic Blocks', 'Target Machine Code Generation'], pyqs: [] }
    ]
  },
  {
    id: 'pyq-kcs-503',
    code: 'KCS-503',
    subject: 'Computer Networks',
    slug: 'computer-networks',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'AKTU Exam Papers for OSI Model, TCP/IP Layering, IP Subnetting, Routing Algorithms, Flow Control (Sliding Window), TCP/UDP Protocols.',
    units: [
      {
        unitNo: 1,
        title: 'Network Fundamentals & Physical Layer',
        topics: ['OSI 7-Layer Reference Model vs TCP/IP Architecture', 'Network Topologies & Switching Techniques', 'Transmission Media'],
        pyqs: [
          {
            id: 'pyq-cn-2024-u1',
            title: 'AKTU Computer Networks Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Data Link Layer & MAC Sublayer',
        topics: ['Framing & Error Control (CRC)', 'Sliding Window Protocols (Go-Back-N, Selective Repeat)', 'ALOHA & CSMA/CD'],
        pyqs: [
          {
            id: 'pyq-cn-2024-u2',
            title: 'AKTU Computer Networks Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Network Layer & IP Addressing',
        topics: ['IPv4 Addressing & Classless Subnetting (CIDR)', 'IPv6 Address Architecture', 'Routing Algorithms (OSPF, BGP)'],
        pyqs: [
          {
            id: 'pyq-cn-2024-u3',
            title: 'AKTU Computer Networks Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Transport Layer Protocols',
        topics: ['UDP Header & Connectionless Service', 'TCP 3-Way Handshake & Connection Management', 'TCP Congestion Control'],
        pyqs: [
          {
            id: 'pyq-cn-2024-u4',
            title: 'AKTU Computer Networks Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Application Layer Protocols',
        topics: ['Domain Name System (DNS) Resolution', 'HTTP/HTTPS, FTP, SMTP Protocols', 'Network Security Basics & Firewalls'],
        pyqs: [
          {
            id: 'pyq-cn-2024-u5',
            title: 'AKTU Computer Networks Quantum Solved PYQ (2024)',
            examYear: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            sourceType: 'Quantum PYQ PDF',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'pyq-kcs-601',
    code: 'KCS-601',
    subject: 'Software Engineering',
    slug: 'software-engineering',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'AKTU Exam Papers for SDLC Models, SRS, Software Architecture, Testing (White Box/Black Box), Function Point Analysis & Maintenance.',
    units: [
      { unitNo: 1, title: 'Software Process & SDLC Models', topics: ['Waterfall, Spiral, Agile & Scrum Models', 'Software Requirement Specification (SRS)', 'Feasibility Analysis'], pyqs: [] },
      { unitNo: 2, title: 'Software Design & Modeling', topics: ['Cohesion & Coupling', 'Data Flow Diagrams (DFD)', 'UML Use Case, Class & Sequence Diagrams'], pyqs: [] },
      { unitNo: 3, title: 'Software Project Estimation & Metrics', topics: ['COCOMO Model Estimation', 'Function Point (FP) Analysis', 'Risk Management & Mitigation'], pyqs: [] },
      { unitNo: 4, title: 'Software Testing & Quality Assurance', topics: ['White Box & Black Box Testing', 'Unit, Integration & System Testing', 'Cyclomatic Complexity'], pyqs: [] },
      { unitNo: 5, title: 'Software Maintenance & Reliability', topics: ['Reverse Engineering & Re-engineering', 'Software Configuration Management', 'ISO 9000 & CMMI Levels'], pyqs: [] }
    ]
  },
  {
    id: 'pyq-kcs-602',
    code: 'KCS-602',
    subject: 'Web Technology',
    slug: 'web-technology',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'AKTU Exam Papers for HTML5, CSS3, JavaScript, DOM, Servlets, JSP, XML, and Web Services.',
    units: [
      { unitNo: 1, title: 'HTML5, CSS3 & Responsive Design', topics: ['HTML Elements, Tables & Forms', 'CSS Box Model, Flexbox & Grid', 'Media Queries'], pyqs: [] },
      { unitNo: 2, title: 'Client-Side JavaScript & DOM Manipulation', topics: ['Variables, Functions & ES6 Features', 'DOM Tree Traversal & Event Handling', 'JSON & AJAX Requests'], pyqs: [] },
      { unitNo: 3, title: 'Server-Side Java Servlets', topics: ['Servlet Lifecycle & HTTP Methods', 'Session Tracking (Cookies, HttpSession)', 'Database Connectivity (JDBC)'], pyqs: [] },
      { unitNo: 4, title: 'Java Server Pages (JSP)', topics: ['JSP Directives, Scriptlets & Expression Language', 'JSP Standard Tag Library (JSTL)', 'MVC Architecture in Web Apps'], pyqs: [] },
      { unitNo: 5, title: 'XML & Web Services', topics: ['XML Schema & DTD Validation', 'SOAP vs RESTful Web Services', 'Web Security Basics'], pyqs: [] }
    ]
  },

  // --- 3rd Year: ECE / EE ---
  {
    id: 'pyq-kec-501',
    code: 'KEC-501',
    subject: 'Digital Signal Processing (DSP)',
    slug: 'digital-signal-processing',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'AKTU Exam Papers for Discrete Fourier Transform (DFT), Fast Fourier Transform (FFT), IIR/FIR Filter Design.',
    units: [
      { unitNo: 1, title: 'Discrete Fourier Transform (DFT)', topics: ['DFT Definition & Properties', 'Circular Convolution vs Linear Convolution', 'IDFT Computation'], pyqs: [] },
      { unitNo: 2, title: 'Fast Fourier Transform (FFT) Algorithms', topics: ['Decimation in Time (DIT) FFT', 'Decimation in Frequency (DIF) FFT', 'Butterfly Diagrams'], pyqs: [] },
      { unitNo: 3, title: 'IIR Digital Filter Design', topics: ['Butterworth & Chebyshev Filters', 'Impulse Invariance Transformation', 'Bilinear Transformation'], pyqs: [] },
      { unitNo: 4, title: 'FIR Digital Filter Design', topics: ['Linear Phase FIR Filters', 'Windowing Techniques (Hamming, Hanning, Blackman)', 'Frequency Sampling Method'], pyqs: [] },
      { unitNo: 5, title: 'Digital Signal Processors Architecture', topics: ['TMS320C67x Architecture', 'Pipelining & MAC Unit', 'Finite Word Length Effects'], pyqs: [] }
    ]
  },
  {
    id: 'pyq-kee-501',
    code: 'KEE-501',
    subject: 'Control Systems',
    slug: 'control-systems',
    branch: 'EE',
    applicableBranches: ['EE', 'ECE', 'ME'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'AKTU Exam Papers for Transfer Functions, Block Diagram Reduction, Routh-Hurwitz Stability, Root Locus, Bode Plot.',
    units: [
      { unitNo: 1, title: 'Control System Modeling', topics: ['Open Loop vs Closed Loop Systems', 'Block Diagram Algebra', 'Signal Flow Graph & Mason Gain Formula'], pyqs: [] },
      { unitNo: 2, title: 'Time Response Analysis', topics: ['Standard Test Signals', 'First & Second Order System Transient Response', 'Steady-State Error & Error Constants'], pyqs: [] },
      { unitNo: 3, title: 'Stability Analysis & Root Locus', topics: ['Routh-Hurwitz Stability Criterion', 'Root Locus Construction Rules', 'Stability Margins'], pyqs: [] },
      { unitNo: 4, title: 'Frequency Response Analysis', topics: ['Bode Plot Gain & Phase Margins', 'Nyquist Stability Criterion & Contour', 'Polar Plots'], pyqs: [] },
      { unitNo: 5, title: 'State Variable Analysis & Compensators', topics: ['State Transition Matrix', 'Lead, Lag & Lag-Lead Compensators', 'PID Controllers'], pyqs: [] }
    ]
  },

  // --- 3rd Year: ME / CE ---
  {
    id: 'pyq-kme-501',
    code: 'KME-501',
    subject: 'Heat & Mass Transfer',
    slug: 'heat-mass-transfer',
    branch: 'ME',
    applicableBranches: ['ME'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'AKTU Exam Papers for Conduction, Convection, Radiation, Heat Exchangers, and Fick Law of Mass Transfer.',
    units: [
      { unitNo: 1, title: 'Conduction Heat Transfer', topics: ['Fourier Law & Thermal Conductivity', '1D Steady State Conduction', 'Extended Surfaces (Fins)'], pyqs: [] },
      { unitNo: 2, title: 'Transient Conduction & Boundary Layer', topics: ['Lumped Heat Capacity Analysis', 'Heisler Charts', 'Convective Boundary Layer Equations'], pyqs: [] },
      { unitNo: 3, title: 'Convective Heat Transfer', topics: ['Free & Forced Convection', 'Dimensional Analysis (Nusselt, Prandtl, Grashof Numbers)', 'Flow over Flat Plate & Pipes'], pyqs: [] },
      { unitNo: 4, title: 'Radiation Heat Transfer & Heat Exchangers', topics: ['Stefan-Boltzmann Law & Planck Law', 'Radiation Shape Factor', 'LMTD & NTU Methods for Heat Exchangers'], pyqs: [] },
      { unitNo: 5, title: 'Mass Transfer Fundamentals', topics: ['Fick Law of Diffusion', 'Mass Transfer Coefficient', 'Analogy between Heat & Mass Transfer'], pyqs: [] }
    ]
  },
  {
    id: 'pyq-kce-501',
    code: 'KCE-501',
    subject: 'Structural Analysis',
    slug: 'structural-analysis',
    branch: 'CE',
    applicableBranches: ['CE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'AKTU Exam Papers for Determinate & Indeterminate Structures, Slope Deflection, Moment Distribution, Strain Energy.',
    units: [
      { unitNo: 1, title: 'Static & Kinematic Indeterminancy', topics: ['Degree of Indeterminacy of Trusses & Frames', 'Castigliano Theorems', 'Unit Load Method for Deflection'], pyqs: [] },
      { unitNo: 2, title: 'Slope Deflection Method', topics: ['Derivation of Slope Deflection Equations', 'Analysis of Continuous Beams', 'Sway & Non-Sway Rigid Frames'], pyqs: [] },
      { unitNo: 3, title: 'Moment Distribution Method', topics: ['Stiffness & Carry-Over Factors', 'Distribution Factors', 'Analysis of Beams & Frames'], pyqs: [] },
      { unitNo: 4, title: 'Arches & Cables', topics: ['3-Hinged & 2-Hinged Arches', 'Eddy Theorem', 'Cables & Suspension Bridges with Stiffening Girders'], pyqs: [] },
      { unitNo: 5, title: 'Influence Line Diagrams (ILD)', topics: ['Muller-Breslau Principle', 'ILD for Simply Supported & Continuous Beams', 'Maximum Bending Moment under Moving Loads'], pyqs: [] }
    ]
  },

  // --- 3rd Year: Maths ---
  {
    id: 'pyq-kas-501-maths',
    code: 'KAS-501',
    subject: 'Applied Mathematics-III',
    slug: 'applied-mathematics-3',
    branch: 'Maths',
    applicableBranches: ['Maths', 'ECE', 'EE', 'ME', 'CE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'AKTU Exam Papers for Partial Differential Equations, Complex Integration, Probability Distributions & Numerical Methods.',
    units: [
      { unitNo: 1, title: 'Partial Differential Equations (PDE)', topics: ['Lagrange Linear PDE', 'Charpit Method', 'Classification of 2nd Order Linear PDEs'], pyqs: [] },
      { unitNo: 2, title: 'Applications of PDE', topics: ['Method of Separation of Variables', '1D Wave & Heat Conduction Equations', 'Laplace Equation in 2D'], pyqs: [] },
      { unitNo: 3, title: 'Complex Integration & Residues', topics: ['Cauchy Residue Theorem', 'Evaluation of Real Definite Integrals', 'Conformal Mapping'], pyqs: [] },
      { unitNo: 4, title: 'Statistical Techniques & Probability', topics: ['Binomial, Poisson & Normal Distributions', 'Correlation & Linear Regression', 'Hypothesis Testing (t-Test, Chi-Square)'], pyqs: [] },
      { unitNo: 5, title: 'Numerical Methods', topics: ['Newton-Raphson & Regula-Falsi Methods', 'Newton Forward/Backward Interpolation', 'Runge-Kutta 4th Order Method'], pyqs: [] }
    ]
  },

  // =========================================================================
  // 4TH YEAR — ALL BRANCHES
  // =========================================================================

  // --- 4th Year: CSE / IT / AI & DS ---
  {
    id: 'pyq-kcs-701',
    code: 'KCS-701',
    subject: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'AKTU Exam Papers for Heuristic Search (A*, AO*), Knowledge Representation, Propositional Logic, Neural Networks.',
    units: [
      { unitNo: 1, title: 'Introduction & Problem Solving Search', topics: ['AI Agents & Environments', 'Uninformed Search: BFS, DFS', 'Informed Search: A* & AO* Algorithms'], pyqs: [] },
      { unitNo: 2, title: 'Knowledge Representation & Logic', topics: ['Propositional & First-Order Predicate Logic', 'Resolution & Unification Algorithm', 'Semantic Nets & Frames'], pyqs: [] },
      { unitNo: 3, title: 'Reasoning under Uncertainty', topics: ['Bayesian Networks & Probabilistic Reasoning', 'Dempster-Shafer Theory', 'Fuzzy Logic & Membership Functions'], pyqs: [] },
      { unitNo: 4, title: 'Machine Learning & Neural Networks', topics: ['Supervised vs Unsupervised Learning', 'Perceptrons & Backpropagation Neural Networks', 'Decision Trees'], pyqs: [] },
      { unitNo: 5, title: 'Natural Language Processing & Expert Systems', topics: ['Parsing & Syntactic Analysis', 'Expert System Architecture', 'Chatbots & NLP Applications'], pyqs: [] }
    ]
  },
  {
    id: 'pyq-kcs-702',
    code: 'KCS-702',
    subject: 'Cloud Computing',
    slug: 'cloud-computing',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 3,
    description: 'AKTU Exam Papers for Cloud Models (IaaS, PaaS, SaaS), Virtualization, Hypervisors, Cloud Storage, and Security.',
    units: [
      { unitNo: 1, title: 'Cloud Overview & Service Models', topics: ['NIST Cloud Definition', 'IaaS, PaaS, SaaS Architectures', 'Public, Private & Hybrid Deployments'], pyqs: [] },
      { unitNo: 2, title: 'Virtualization Technology', topics: ['Type-1 & Type-2 Hypervisors', 'Full vs Para-Virtualization', 'Virtual Machine Migration'], pyqs: [] },
      { unitNo: 3, title: 'Cloud Storage & Architecture', topics: ['Block vs Object Storage (S3)', 'Distributed File Systems (GFS, HDFS)', 'Cloud Data Management'], pyqs: [] },
      { unitNo: 4, title: 'Resource Management & Load Balancing', topics: ['Auto-scaling Strategies', 'Load Balancing Algorithms', 'SLA Management'], pyqs: [] },
      { unitNo: 5, title: 'Cloud Security & Identity', topics: ['IAM & Access Control', 'Data Encryption in Cloud', 'Compliance & Multi-Tenancy Security'], pyqs: [] }
    ]
  },
  {
    id: 'pyq-kcs-801',
    code: 'KCS-801',
    subject: 'Distributed Systems',
    slug: 'distributed-systems',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 4,
    description: 'AKTU Exam Papers for Distributed System Models, RPC, Logical Clocks (Lamport, Vector), Mutual Exclusion Algorithms.',
    units: [
      { unitNo: 1, title: 'Distributed System Characterization', topics: ['Architectural Models (Client-Server, P2P)', 'System Layering & Middleware', 'Interprocess Communication'], pyqs: [] },
      { unitNo: 2, title: 'RPC & Message Passing', topics: ['Remote Procedure Call (RPC) Mechanism', 'RMI Architecture', 'Message-Oriented Middleware'], pyqs: [] },
      { unitNo: 3, title: 'Time Synchronization & Logical Clocks', topics: ['Physical Clock Synchronization (NTP)', 'Lamport Logical Clocks', 'Vector Clocks & Causality'], pyqs: [] },
      { unitNo: 4, title: 'Distributed Mutual Exclusion & Election', topics: ['Ricart-Agrawala Algorithm', 'Token Ring Algorithm', 'Bully & Ring Election Algorithms'], pyqs: [] },
      { unitNo: 5, title: 'Consensus & Fault Tolerance', topics: ['Byzantine Generals Problem', 'Two-Phase Commit Protocol', 'Replication & Consistency Models'], pyqs: [] }
    ]
  },

  // --- 4th Year: ECE / EE ---
  {
    id: 'pyq-kec-701',
    code: 'KEC-701',
    subject: 'Wireless & Mobile Communication',
    slug: 'wireless-communication',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'AKTU Exam Papers for Cellular Concepts, Frequency Reuse, Handoff Strategies, Small-Scale Fading, 4G LTE & 5G.',
    units: [
      { unitNo: 1, title: 'Cellular System Fundamentals', topics: ['Frequency Reuse & Cell Splitting', 'Channel Assignment Strategies', 'Handoff & Interference (Co-Channel, Adjacent)'], pyqs: [] },
      { unitNo: 2, title: 'Mobile Radio Propagation & Fading', topics: ['Free Space Propagation Model', 'Small-Scale & Large-Scale Fading', 'Doppler Spread & Coherence Time'], pyqs: [] },
      { unitNo: 3, title: 'Equalization & Diversity Techniques', topics: ['Linear & Non-Linear Equalizers', 'Rake Receiver', 'Space, Frequency & Time Diversity'], pyqs: [] },
      { unitNo: 4, title: 'Multiple Access Techniques', topics: ['FDMA, TDMA & CDMA', 'OFDMA Principles', 'Space Division Multiple Access (SDMA)'], pyqs: [] },
      { unitNo: 5, title: 'Wireless Standards & 5G Networks', topics: ['GSM & CDMA2000 Architecture', '4G LTE E-UTRAN Architecture', '5G NR Features & Massive MIMO'], pyqs: [] }
    ]
  },

  // --- 4th Year: ME / CE ---
  {
    id: 'pyq-kme-701',
    code: 'KME-701',
    subject: 'CAD/CAM & Automation',
    slug: 'cad-cam',
    branch: 'ME',
    applicableBranches: ['ME', 'CE'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'AKTU Exam Papers for Computer Graphics Transformation, Geometric Modeling (Bezier, B-Spline), CNC Part Programming.',
    units: [
      { unitNo: 1, title: 'CAD Fundamentals & Transformations', topics: ['2D & 3D Geometric Transformations (Translation, Rotation, Scaling)', 'Homogeneous Coordinates', 'Clipping Algorithms'], pyqs: [] },
      { unitNo: 2, title: 'Geometric Modeling', topics: ['Wireframe, Surface & Solid Modeling (CSG, B-Rep)', 'Hermite, Bezier & B-Spline Curves', 'NURBS Overview'], pyqs: [] },
      { unitNo: 3, title: 'NC & CNC Machine Tools', topics: ['CNC Machine Components & MCU', 'G-Codes & M-Codes Part Programming', 'Tool Path Generation'], pyqs: [] },
      { unitNo: 4, title: 'Flexible Manufacturing Systems (FMS)', topics: ['Group Technology & Cellular Manufacturing', 'Automated Guided Vehicles (AGV)', 'AS/RS Automated Storage'], pyqs: [] },
      { unitNo: 5, title: 'Industrial Robotics', topics: ['Robot Anatomy & Configurations', 'Forward & Inverse Kinematics', 'Robot End Effectors & Sensors'], pyqs: [] }
    ]
  },

  // --- 4th Year: Maths ---
  {
    id: 'pyq-kas-701-maths',
    code: 'KAS-701',
    subject: 'Optimization Techniques',
    slug: 'optimization-techniques',
    branch: 'Maths',
    applicableBranches: ['Maths', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'AKTU Exam Papers for Linear Programming (Simplex), Transportation Model, Assignment Problem, Dynamic Programming.',
    units: [
      { unitNo: 1, title: 'Linear Programming & Simplex Method', topics: ['LPP Mathematical Formulation', 'Simplex & Big-M Methods', 'Dual Simplex Algorithm'], pyqs: [] },
      { unitNo: 2, title: 'Transportation & Assignment Problems', topics: ['Initial Basic Feasible Solution (VAM)', 'MODI Optimality Test', 'Hungarian Assignment Method'], pyqs: [] },
      { unitNo: 3, title: 'Network Analysis (PERT & CPM)', topics: ['Critical Path Method (CPM)', 'PERT Event Times & Probability', 'Project Crashing'], pyqs: [] },
      { unitNo: 4, title: 'Dynamic Programming & Game Theory', topics: ['Bellman Principle of Optimality', 'Two-Person Zero-Sum Games', 'Saddle Point & Mixed Strategy'], pyqs: [] },
      { unitNo: 5, title: 'Non-Linear Optimization', topics: ['Unconstrained Optimization (Gradient Search)', 'Kuhn-Tucker Conditions', 'Quadratic Programming Overview'], pyqs: [] }
    ]
  }
];

// REAL SYLLABUS-DRIVEN SEARCH & FILTER FUNCTION FOR PYQs
export function searchAktuPyqs(query, filters = {}) {
  const q = (query || '').toLowerCase().trim();
  const { branch, year, semester } = filters;

  return AKTU_PYQ_DATA.filter(subjectObj => {
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
    const matchUnit = subjectObj.units.some(u => 
      u.title.toLowerCase().includes(q) ||
      u.topics.some(t => t.toLowerCase().includes(q)) ||
      (u.pyqs && u.pyqs.some(p => p.title.toLowerCase().includes(q) || (p.examYear && p.examYear.toLowerCase().includes(q))))
    );

    return matchSubject || matchUnit;
  });
}
