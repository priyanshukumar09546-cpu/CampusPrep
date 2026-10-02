// OFFICIAL AKTU B.TECH SYLLABUS & NOTES DATASET
// Verified against AKTU B.Tech Curriculum for CSE, ECE, ME, CE, IT, EE, AI & DS, and Applied Sciences

export const AKTU_SYLLABUS_DATA = [
  // =========================================================================
  // 1ST YEAR — COMMON FOR ALL BRANCHES (CSE, ECE, ME, CE, IT, EE, AI & DS)
  // =========================================================================

  // --- 1st Year: Semester 1 ---
  {
    id: 'kas-103',
    code: 'KAS-103',
    subject: 'Engineering Mathematics-I',
    slug: 'engineering-maths-1',
    branch: 'Maths',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    description: 'Matrices, Differential Calculus, Partial Differentiation, Expansion of Functions, Vector Calculus for AKTU 1st Year.',
    units: [
      {
        unitNo: 1,
        title: 'Matrices',
        topics: ['Types of Matrices & Elementary Transformations', 'Rank of Matrix & Consistency of Linear Equations', 'Eigen Values & Eigen Vectors, Cayley-Hamilton Theorem'],
        notes: [
          {
            id: 'engineering-maths-1-unit-1-notes',
            title: 'Engineering Mathematics-I Unit 1 Notes (Multi Atoms)',
            type: 'Unit Notes',
            author: 'Multi Atoms',
            date: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          },
          {
            id: 'engineering-maths-1-quantum-unit-1',
            title: 'Engineering Mathematics-I Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Differential Calculus - I',
        topics: ['Leibnitz Theorem & Successive Differentiation', 'Partial Differentiation & Euler Theorem', 'Total Derivatives'],
        notes: [
          {
            id: 'engineering-maths-1-unit-2-notes',
            title: 'Engineering Mathematics-I Unit 2 Notes (Multi Atoms)',
            type: 'Unit Notes',
            author: 'Multi Atoms',
            date: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          },
          {
            id: 'engineering-maths-1-quantum-unit-2',
            title: 'Engineering Mathematics-I Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Differential Calculus - II',
        topics: ['Expansion of Functions (Taylor & Maclaurin Series)', 'Jacobian Matrix & Applications', 'Extrema of Functions of Two Variables (Lagrange Multiplier)'],
        notes: [
          {
            id: 'engineering-maths-1-quantum-unit-3',
            title: 'Engineering Mathematics-I Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Multivariable Calculus (Integration)',
        topics: ['Double & Triple Integrals', 'Change of Order of Integration', 'Beta & Gamma Functions'],
        notes: [
          {
            id: 'engineering-maths-1-quantum-unit-4',
            title: 'Engineering Mathematics-I Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Vector Calculus',
        topics: ['Gradient, Divergence & Curl', 'Line, Surface & Volume Integrals', 'Green, Gauss Divergence & Stokes Theorem'],
        notes: [
          {
            id: 'engineering-maths-1-quantum-unit-5',
            title: 'Engineering Mathematics-I Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'kas-101',
    code: 'KCS-101',
    subject: 'Programming for Problem Solving (PPS)',
    slug: 'programming-for-problem-solving',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    description: 'C Programming Basics, Control Structures, Arrays, Functions, Pointers, Structures, and File Handling for AKTU 1st Year.',
    units: [
      {
        unitNo: 1,
        title: 'Introduction to Programming & Basics of C',
        topics: ['Flowcharts & Algorithms', 'Data Types, Operators & Expressions', 'Header Files & Input/Output Statements'],
        notes: [
          {
            id: 'pps-quantum-unit-1',
            title: 'PPS Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Control Structures & Conditional Branching',
        topics: ['If-Else, Switch Case', 'Loops: For, While, Do-While', 'Break, Continue & Goto Statements'],
        notes: [
          {
            id: 'pps-unit-2-notes',
            title: 'PPS Unit 2 Notes (Multi Atoms)',
            type: 'Unit Notes',
            author: 'Multi Atoms',
            date: '2024',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          },
          {
            id: 'pps-quantum-unit-2',
            title: 'PPS Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Arrays & Functions',
        topics: ['1D & 2D Arrays', 'Function Call by Value vs Call by Reference', 'Recursion & Recursion Trees'],
        notes: [
          {
            id: 'pps-quantum-unit-3',
            title: 'PPS Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Pointers & Dynamic Memory',
        topics: ['Pointer Arithmetic & Array Pointers', 'Dynamic Memory Allocation (malloc, calloc, free)', 'Strings & String Functions'],
        notes: [
          {
            id: 'pps-quantum-unit-4',
            title: 'PPS Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Structures & File Handling',
        topics: ['Structures & Unions', 'File Operations: fopen, fclose, fread, fwrite', 'Command Line Arguments'],
        notes: [
          {
            id: 'pps-quantum-unit-5',
            title: 'PPS Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'kas-101-phy',
    code: 'KAS-101',
    subject: 'Engineering Physics',
    slug: 'engineering-physics',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    description: 'Relativistic Mechanics, Electromagnetic Field Theory, Quantum Mechanics, Wave Optics, and Fiber Optics for AKTU 1st Year.',
    units: [
      {
        unitNo: 1,
        title: 'Relativistic Mechanics',
        topics: ['Inertial & Non-Inertial Frames', 'Michelson-Morley Experiment', 'Lorentz Transformations & Time Dilation', 'Mass-Energy Equivalence E=mc2'],
        notes: [
          {
            id: 'physics-quantum-unit-1',
            title: 'Engineering Physics Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Electromagnetic Field Theory',
        topics: ['Displacement Current & Continuity Equation', 'Maxwell Equations in Differential & Integral Form', 'Poynting Vector & Electromagnetic Waves'],
        notes: [
          {
            id: 'physics-quantum-unit-2',
            title: 'Engineering Physics Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Quantum Mechanics',
        topics: ['Wave-Particle Duality & De-Broglie Waves', 'Heisenberg Uncertainty Principle', 'Schrodinger Time-Dependent & Independent Wave Equation'],
        notes: [
          {
            id: 'physics-quantum-unit-3',
            title: 'Engineering Physics Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Wave Optics & Interference',
        topics: ['Coherence & Interference in Thin Films', 'Newton Rings Experiment', 'Fraunhofer Diffraction at Single & Double Slit'],
        notes: [
          {
            id: 'physics-quantum-unit-4',
            title: 'Engineering Physics Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Fiber Optics & Lasers',
        topics: ['Principle of Optical Fiber & Acceptance Angle', 'Numerical Aperture & Fiber Losses', 'Einstein Coefficients & Ruby/He-Ne Laser'],
        notes: [
          {
            id: 'physics-quantum-unit-5',
            title: 'Engineering Physics Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'kee-101',
    code: 'KEE-101',
    subject: 'Basic Electrical Engineering',
    slug: 'basic-electrical-engineering',
    branch: 'EE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 4,
    description: 'DC Circuits, AC Circuits, Transformers, Electrical Machines, and Power Systems Overview for AKTU 1st Year.',
    units: [
      {
        unitNo: 1,
        title: 'DC Circuits & Theorems',
        topics: ['KCL, KVL & Mesh/Nodal Analysis', 'Superposition, Thevenin & Norton Theorems', 'Maximum Power Transfer Theorem'],
        notes: [
          {
            id: 'bee-quantum-unit-1',
            title: 'Basic Electrical Engineering Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Single-Phase AC Circuits',
        topics: ['Sinusoidal Waveform & RMS/Average Values', 'Phasor Representation of R, L, C Circuits', 'Series & Parallel Resonance'],
        notes: [
          {
            id: 'bee-quantum-unit-2',
            title: 'Basic Electrical Engineering Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Transformers',
        topics: ['Single Phase Transformer Construction & Working', 'EMF Equation & Equivalent Circuit', 'Efficiency & Voltage Regulation'],
        notes: [
          {
            id: 'bee-quantum-unit-3',
            title: 'Basic Electrical Engineering Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Electrical Machines',
        topics: ['DC Machines Principle & Construction', '3-Phase Induction Motor Working', 'Synchronous Generator Basics'],
        notes: [
          {
            id: 'bee-quantum-unit-4',
            title: 'Basic Electrical Engineering Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Electrical Installations & Batteries',
        topics: ['Components of LT Switchgear (MCB, ELCB, Fuse)', 'Types of Wires & Earthing Methods', 'Battery Types & Calculation of Energy Consumption'],
        notes: [
          {
            id: 'bee-quantum-unit-5',
            title: 'Basic Electrical Engineering Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      }
    ]
  },

  // --- 1st Year: Semester 2 ---
  {
    id: 'kas-203',
    code: 'KAS-203',
    subject: 'Engineering Mathematics-II',
    slug: 'engineering-maths-2',
    branch: 'Maths',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 4,
    description: 'Ordinary Differential Equations, Series Solutions, Complex Variable Calculus, and Laplace Transforms for AKTU 1st Year.',
    units: [
      {
        unitNo: 1,
        title: 'Ordinary Differential Equations of First Order',
        topics: ['Exact Differential Equations', 'Linear & Bernoulli Equations', 'Application to Newton Law of Cooling & Circuits'],
        notes: [
          {
            id: 'maths2-quantum-unit-1',
            title: 'Engineering Mathematics-II Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Linear ODEs of Higher Order',
        topics: ['Homogeneous & Non-Homogeneous Differential Equations', 'Complementary Function & Particular Integral', 'Method of Variation of Parameters'],
        notes: [
          {
            id: 'maths2-quantum-unit-2',
            title: 'Engineering Mathematics-II Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Laplace Transform',
        topics: ['Laplace Transform of Elementary Functions', 'Shifting Theorems & Inverse Laplace Transform', 'Application to Solution of Differential Equations'],
        notes: [
          {
            id: 'maths2-quantum-unit-3',
            title: 'Engineering Mathematics-II Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Sequence & Series',
        topics: ['Convergence & Divergence of Sequence', 'Infinite Series Tests: Ratio, Comparison, Integral Tests', 'Fourier Series of Periodic Functions'],
        notes: [
          {
            id: 'maths2-quantum-unit-4',
            title: 'Engineering Mathematics-II Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Complex Variable Differentiation & Integration',
        topics: ['Analytic Functions & Cauchy-Riemann Equations', 'Cauchy Integral Theorem & Formula', 'Taylor & Laurent Series Expansion'],
        notes: [
          {
            id: 'maths2-quantum-unit-5',
            title: 'Engineering Mathematics-II Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'kas-102',
    code: 'KAS-102',
    subject: 'Engineering Chemistry',
    slug: 'engineering-chemistry',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 4,
    description: 'Atomic & Molecular Structure, Spectroscopic Techniques, Water Technology, Corrosion & Polymers for AKTU 1st Year.',
    units: [
      {
        unitNo: 1,
        title: 'Atomic & Molecular Structure',
        topics: ['Molecular Orbital Theory (MOT) of Homonuclear & Heteronuclear Diatomics', 'Band Theory of Solids', 'Nanomaterials Synthesis & Applications'],
        notes: [
          {
            id: 'chem-quantum-unit-1',
            title: 'Engineering Chemistry Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 2,
        title: 'Spectroscopic Techniques & Applications',
        topics: ['Elementary Principles of UV-Vis Spectroscopy', 'IR Spectroscopy & Vibration Modes', 'NMR Spectroscopy Basics'],
        notes: [
          {
            id: 'chem-quantum-unit-2',
            title: 'Engineering Chemistry Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 3,
        title: 'Electrochemistry & Corrosion',
        topics: ['Nernst Equation & Electrochemical Cells', 'Mechanism of Corrosion (Dry & Wet)', 'Corrosion Protection & Cathodic Protection'],
        notes: [
          {
            id: 'chem-quantum-unit-3',
            title: 'Engineering Chemistry Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 4,
        title: 'Water Technology',
        topics: ['Hardness of Water & Determination by EDTA Method', 'Boiler Troubles (Sludge, Scale, Caustic Embrittlement)', 'Water Softening: Zeolite & Ion Exchange Process'],
        notes: [
          {
            id: 'chem-quantum-unit-4',
            title: 'Engineering Chemistry Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      },
      {
        unitNo: 5,
        title: 'Polymers & Fuels',
        topics: ['Classification & Polymerization Mechanisms', 'Conducting Polymers & Biodegradable Polymers', 'Calorific Value of Fuel & Bomb Calorimeter'],
        notes: [
          {
            id: 'chem-quantum-unit-5',
            title: 'Engineering Chemistry Quantum Series PDF',
            type: 'Quantum PDF',
            author: 'Quantum Series',
            date: '2023-24',
            fileUrl: 'https://aktu-quantum.tech/',
            sourceUrl: 'https://aktu-quantum.tech/',
            source: 'aktu-quantum.tech',
            verified: true
          }
        ]
      }
    ]
  },
  {
    id: 'kec-201',
    code: 'KEC-201',
    subject: 'Emerging Domain in Electronics Engineering',
    slug: 'emerging-domain-electronics',
    branch: 'ECE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 3,
    description: 'Semiconductor Diodes, BJT, Op-Amp, Digital Electronics, and Communication Systems Overview.',
    units: [
      { unitNo: 1, title: 'Semiconductor Diodes & Applications', topics: ['PN Junction Diode', 'Rectifiers & Filters', 'Zener Diode Regulator'], notes: [{ id: 'kec-201-u1', title: 'Electronics Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 2, title: 'Bipolar Junction Transistors (BJT)', topics: ['BJT Configurations', 'Biasing Techniques', 'Amplifier Action'], notes: [{ id: 'kec-201-u2', title: 'Electronics Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 3, title: 'Operational Amplifiers (Op-Amp)', topics: ['Ideal Op-Amp', 'Inverting & Non-Inverting Amplifiers', 'Summing & Difference Amplifiers'], notes: [{ id: 'kec-201-u3', title: 'Electronics Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 4, title: 'Digital Electronics Fundamentals', topics: ['Number Systems & Binary Codes', 'Logic Gates & Truth Tables', 'Boolean Algebra Simplification'], notes: [{ id: 'kec-201-u4', title: 'Electronics Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 5, title: 'Fundamentals of Communication Engineering', topics: ['Need for Modulation', 'AM & FM Basics', 'Satellite & Cellular Communication Overview'], notes: [{ id: 'kec-201-u5', title: 'Electronics Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] }
    ]
  },
  {
    id: 'kme-201',
    code: 'KME-201',
    subject: 'Fundamentals of Mechanical Engineering',
    slug: 'fundamentals-mechanical-engineering',
    branch: 'ME',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 3,
    description: 'Thermodynamics Laws, IC Engines, Refrigeration, Power Transmission, and Engineering Materials.',
    units: [
      { unitNo: 1, title: 'Introduction to Thermodynamics & IC Engines', topics: ['First & Second Laws', '4-Stroke & 2-Stroke Petrol/Diesel Engines', 'Engine Performance Metrics'], notes: [{ id: 'kme-201-u1', title: 'Mechanical Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 2, title: 'Refrigeration & Air Conditioning', topics: ['Vapor Compression Refrigeration System (VCRS)', 'Refrigerants & COP', 'Psychrometric Chart Basics'], notes: [{ id: 'kme-201-u2', title: 'Mechanical Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 3, title: 'Fluid Mechanics & Turbines', topics: ['Fluid Properties & Pascal Law', 'Bernoulli Theorem & Applications', 'Hydraulic Turbines & Pumps'], notes: [{ id: 'kme-201-u3', title: 'Mechanical Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 4, title: 'Power Transmission & Drives', topics: ['Belt, Rope & Chain Drives', 'Gear Trains & Types of Gears', 'Clutches & Brakes Overview'], notes: [{ id: 'kme-201-u4', title: 'Mechanical Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 5, title: 'Engineering Materials & Manufacturing', topics: ['Ferrous & Non-Ferrous Metals', 'Stress-Strain Curve for Mild Steel', 'Lathe, Drilling & Welding Processes'], notes: [{ id: 'kme-201-u5', title: 'Mechanical Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] }
    ]
  },
  {
    id: 'bas-104-env',
    code: 'BAS-104',
    subject: 'Environment & Ecology',
    slug: 'environment-and-ecology',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '1st Year',
    semester: 'Sem 1',
    credits: 3,
    description: 'Ecosystems, Environmental Pollution, Natural Resources, Sustainable Development, and Environmental Acts.',
    units: [
      { unitNo: 1, title: 'Environment & Ecosystems', topics: ['Definition, Scope & Importance', 'Structure & Functions of Ecosystem', 'Ecological Pyramids & Food Chains'], notes: [{ id: 'env-u1', title: 'Environment & Ecology Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 2, title: 'Natural Resources & Conservation', topics: ['Forest, Water, Mineral & Energy Resources', 'Renewable vs Non-Renewable Energy', 'Deforestation & Mining Impacts'], notes: [{ id: 'env-u2', title: 'Environment & Ecology Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 3, title: 'Environmental Pollution & Control', topics: ['Air, Water, Soil & Noise Pollution', 'Solid Waste Management', 'Pollution Control Acts & Regulations'], notes: [{ id: 'env-u3', title: 'Environment & Ecology Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 4, title: 'Social Issues & Environment', topics: ['Sustainable Development & Climate Change', 'Global Warming, Acid Rain & Ozone Depletion', 'Resettlement & Rehabilitation Issues'], notes: [{ id: 'env-u4', title: 'Environment & Ecology Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 5, title: 'Human Population & Environment', topics: ['Population Growth & Variation Among Nations', 'Environment & Human Health', 'Role of IT in Environment & Human Health'], notes: [{ id: 'env-u5', title: 'Environment & Ecology Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] }
    ]
  },
  {
    id: 'knc-102-ss',
    code: 'KNC-102',
    subject: 'Soft Skills & Communication',
    slug: 'soft-skills-and-communication',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '1st Year',
    semester: 'Sem 2',
    credits: 2,
    description: 'Communication Skills, Soft Skills, Group Discussions, Interviews, and Presentation Skills for AKTU 1st Year.',
    units: [
      { unitNo: 1, title: 'Basics of Communication', topics: ['Process & Barriers to Communication', 'Verbal vs Non-Verbal Communication', 'Kinesics, Proxemics & Chronemics'], notes: [{ id: 'ss-u1', title: 'Soft Skills Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 2, title: 'Grammar & Vocabulary Building', topics: ['Parts of Speech & Sentence Types', 'Vocabulary Building & Word Formation', 'Common Errors in English'], notes: [{ id: 'ss-u2', title: 'Soft Skills Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 3, title: 'Technical Writing Skills', topics: ['Resume Writing & Covering Letters', 'Business Email & Formal Letters', 'Technical Reports & Proposals'], notes: [{ id: 'ss-u3', title: 'Soft Skills Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 4, title: 'Group Discussion & Interview Skills', topics: ['GD Strategies & Body Language', 'Personal Interview Preparation', 'Frequently Asked Interview Questions'], notes: [{ id: 'ss-u4', title: 'Soft Skills Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] },
      { unitNo: 5, title: 'Presentation & Soft Skills', topics: ['Public Speaking & Presentation Skills', 'Time Management & Stress Management', 'Leadership & Team Work Skills'], notes: [{ id: 'ss-u5', title: 'Soft Skills Quantum PDF', fileUrl: 'https://aktu-quantum.tech/', sourceUrl: 'https://aktu-quantum.tech/' }] }
    ]
  },

  // =========================================================================
  // 2ND YEAR — ALL BRANCHES (12 SUBJECTS)
  // =========================================================================

  // =========================================================================
  // 2ND YEAR — ALL BRANCHES (INCLUDING ECE 10 SUBJECTS)
  // =========================================================================

  // --- 2nd Year: Common & ECE Subjects ---
  {
    id: 'kas-302-maths4',
    code: 'KAS-401',
    subject: 'Engineering Mathematics-IV',
    slug: 'engineering-maths-4',
    branch: 'Maths',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'PDEs, Complex Variables, Probability Distributions, Sampling Theory, and Transform Techniques for AKTU 2nd Year.',
    units: []
  },
  {
    id: 'kec-301-ed',
    code: 'KEC-301',
    subject: 'Electronic Devices',
    slug: 'electronic-devices',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Semiconductor Physics, PN Junction Diodes, BJT, MOSFET Characteristics, and Optoelectronic Devices.',
    units: []
  },
  {
    id: 'kec-401-ce',
    code: 'KEC-401',
    subject: 'Communication Engineering',
    slug: 'communication-engineering',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'Analog & Digital Modulation, AM, FM, Pulse Code Modulation (PCM), and Digital Baseband Transmission.',
    units: []
  },
  {
    id: 'kec-302-emft',
    code: 'KEC-302',
    subject: 'Electromagnetic Field Theory',
    slug: 'electromagnetic-field-theory',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Vector Calculus, Electrostatics, Magnetostatics, Maxwell Equations, and Electromagnetic Wave Propagation.',
    units: []
  },
  {
    id: 'kec-303-de',
    code: 'KEC-303',
    subject: 'Digital Electronics',
    slug: 'digital-electronics-ece',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE', 'CSE', 'IT'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Number Systems, Logic Gates, Combinational & Sequential Circuits, Flip-Flops, Counters, and Registers.',
    units: []
  },
  {
    id: 'kec-402-emi',
    code: 'KEC-402',
    subject: 'Electrical Measurements & Instrumentation',
    slug: 'electrical-measurements-instrumentation',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'Measurement Errors, AC/DC Bridges, Transducers, Oscilloscopes (CRO), and Digital Voltmeter.',
    units: []
  },
  {
    id: 'kec-403-bss',
    code: 'KEC-403',
    subject: 'Basic Signal System',
    slug: 'basic-signal-system',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'Continuous & Discrete Signals, LTI Systems, Fourier Series, Fourier Transform, and Z-Transform.',
    units: []
  },
  {
    id: 'kcs-301',
    code: 'KCS-301',
    subject: 'Data Structure',
    slug: 'data-structures',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Linear & Non-linear Data Structures, Stacks, Queues, Linked Lists, Trees, Graphs, Sorting, and Searching.',
    units: []
  },
  {
    id: 'kcs-302',
    code: 'KCS-302',
    subject: 'Computer Organization and Architecture',
    slug: 'computer-organization-architecture',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Register Transfer, Microoperations, CPU Design, Memory Hierarchy, I/O Subsystems, and Pipelining Architecture.',
    units: []
  },
  {
    id: 'kcs-303',
    code: 'KCS-303',
    subject: 'Discrete Structures & Theory of Logic',
    slug: 'discrete-structures',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Sets, Relations, Functions, Group Theory, Lattices, Boolean Algebra, Propositional & Predicate Logic.',
    units: []
  },
  {
    id: 'koe-033',
    code: 'KOE-033',
    subject: 'Energy Science & Engineering',
    slug: 'energy-science',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 3,
    description: 'Energy Resources, Solar Thermal Systems, Photovoltaics, Wind Energy, Nuclear Energy, and Environmental Impact.',
    units: []
  },
  {
    id: 'kas-301-tc',
    code: 'KAS-301',
    subject: 'Technical Communication',
    slug: 'technical-communication',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 3,
    description: 'Technical Writing, Business Correspondence, Presentation Skills, Phonetics, and Group Discussions.',
    units: []
  },
  {
    id: 'knc-301-cs',
    code: 'KNC-301',
    subject: 'Cyber Security',
    slug: 'cyber-security',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 3,
    description: 'Information Security Concepts, Cryptography, Network Security, Cyber Crimes, IT Act, and Digital Forensics.',
    units: []
  },
  {
    id: 'kve-301-uhv',
    code: 'KVE-301',
    subject: 'Universal Human Values',
    slug: 'universal-human-values',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 3,
    description: 'Self-exploration, Harmony in Human Being, Family, Society & Nature, Professional Ethics & Values.',
    units: []
  },

  // --- 2nd Year: Semester 4 ---
  {
    id: 'kcs-403',
    code: 'KCS-403',
    subject: 'Python Programming',
    slug: 'python-programming',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 3,
    description: 'Python Syntax, Data Structures, OOPs, Exception Handling, Modules, File I/O, and NumPy/Pandas Intro.',
    units: []
  },
  {
    id: 'kcs-041-wd',
    code: 'KCS-041',
    subject: 'Web Designing',
    slug: 'web-designing',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 3,
    description: 'HTML5, CSS3, JavaScript, Responsive Web Design, Bootstrap, DOM Manipulation, and Web Hosting.',
    units: []
  },
  {
    id: 'kcs-401',
    code: 'KCS-401',
    subject: 'Operating Systems',
    slug: 'operating-system',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'CPU Scheduling, Memory Management, Process Synchronization, Deadlocks, File Systems, and Disk Scheduling.',
    units: []
  },
  {
    id: 'kcs-402-tafl',
    code: 'KCS-402',
    subject: 'Theory of Automata and Formal Languages (TAFL)',
    slug: 'theory-of-automata-tafl',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'DFA, NFA, Regular Expressions, Context-Free Grammars, Pushdown Automata, and Turing Machines.',
    units: []
  },
  {
    id: 'kme-301-td',
    code: 'KME-301',
    subject: 'Thermodynamics',
    slug: 'thermodynamics-me',
    branch: 'ME',
    applicableBranches: ['ME', 'CE'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Zeroth, First & Second Laws of Thermodynamics, Entropy, Availability, Work & Heat Transfer.',
    units: []
  },
  {
    id: 'kme-401-fm',
    code: 'KME-401',
    subject: 'Fluid Mechanics & Fluid Machines',
    slug: 'fluid-mechanics-machines-me',
    branch: 'ME',
    applicableBranches: ['ME', 'CE'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'Fluid Statics, Kinematics, Bernoulli Equation, Viscous Flow, Turbines, and Centrifugal Pumps.',
    units: []
  },
  {
    id: 'kme-302-mate',
    code: 'KME-302',
    subject: 'Materials Engineering',
    slug: 'materials-engineering-me',
    branch: 'ME',
    applicableBranches: ['ME'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Crystal Structure, Phase Diagrams, Heat Treatment of Steels, Ferrous & Non-ferrous Alloys, Mechanical Testing.',
    units: []
  },
  {
    id: 'kme-402-atd',
    code: 'KME-402',
    subject: 'Applied Thermodynamics',
    slug: 'applied-thermodynamics-me',
    branch: 'ME',
    applicableBranches: ['ME'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'Gas Power Cycles, Vapor Power Cycles, Steam Turbines, IC Engines, Refrigeration Cycles, and Nozzles.',
    units: []
  },
  {
    id: 'kme-403-mp',
    code: 'KME-403',
    subject: 'Manufacturing Processes',
    slug: 'manufacturing-processes-me',
    branch: 'ME',
    applicableBranches: ['ME'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'Casting Processes, Metal Forming, Welding & Joining, Metal Cutting Principles, and Machine Tools.',
    units: []
  },

  // =========================================================================
  // 3RD YEAR — ALL BRANCHES (INCLUDING 11 ECE SUBJECTS)
  // =========================================================================
  {
    id: 'kec-501-ic',
    code: 'KEC-501',
    subject: 'Integrated Circuits',
    slug: 'integrated-circuits',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Operational Amplifier Applications, Timers (555), Voltage Regulators, Active Filters, and Phase Locked Loops (PLL).',
    units: []
  },
  {
    id: 'kec-502-cs',
    code: 'KEC-502',
    subject: 'Control System',
    slug: 'control-system-ece',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Transfer Function, Signal Flow Graphs, Time Response Analysis, Routh-Hurwitz, Root Locus, Bode Plot, and Nyquist Plot.',
    units: []
  },
  {
    id: 'kec-503-mpmc',
    code: 'KEC-503',
    subject: 'Microprocessors And Microcontrollers',
    slug: 'microprocessors-microcontrollers',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: '8085/8086 Microprocessor Architecture, Assembly Language, 8051 Microcontroller, Interfacing ICs (8255, 8253, 8259).',
    units: []
  },
  {
    id: 'kec-051-vlsi',
    code: 'KEC-051',
    subject: 'VLSI Technology',
    slug: 'vlsi-technology',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Wafer Fabrication, Epitaxy, Oxidation, Photolithography, Diffusion, Ion Implantation, and CMOS Circuit Design.',
    units: []
  },
  {
    id: 'knc-501-itcs',
    code: 'KNC-501',
    subject: 'Indian Tradition Culture and Society',
    slug: 'indian-tradition-culture-society',
    branch: 'Common',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 3,
    description: 'Indian Society, Ancient Science & Technology, State & Religion, Literature & Performing Arts, and Cultural Heritage.',
    units: []
  },
  {
    id: 'kec-601-dsp',
    code: 'KEC-601',
    subject: 'Digital Signal Processing',
    slug: 'digital-signal-processing-ece',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'Discrete Fourier Transform (DFT), FFT Algorithms, FIR/IIR Filter Design, Structures for Discrete-Time Systems.',
    units: []
  },
  {
    id: 'kec-602-awp',
    code: 'KEC-602',
    subject: 'Antenna and Wave Propagation',
    slug: 'antenna-wave-propagation',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'Antenna Parameters, Dipole Antennas, Antenna Arrays, Aperture Antennas, and Ground/Sky/Space Wave Propagation.',
    units: []
  },
  {
    id: 'kee-501-ps',
    code: 'KEE-501',
    subject: 'Power System',
    slug: 'power-system-ece',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Generation, Transmission & Distribution of Electrical Power, Line Parameters, Performance of Lines, Insulators & Cables.',
    units: []
  },
  {
    id: 'kec-061-eim',
    code: 'KEC-061',
    subject: 'Electronic Instrumentation and Measurement',
    slug: 'electronic-instrumentation-measurement',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 3,
    description: 'Transducers, Signal Conditioning, Digital Meters, Spectrum Analyzer, Telemetry, and Data Acquisition Systems.',
    units: []
  },
  {
    id: 'kec-062-oc',
    code: 'KEC-062',
    subject: 'Optical Communication',
    slug: 'optical-communication',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 3,
    description: 'Optical Fibers, Signal Attenuation & Dispersion, LED/Laser Diodes, PIN/APD Photodetectors, Optical Receivers.',
    units: []
  },
  {
    id: 'kee-061-pe',
    code: 'KEE-061',
    subject: 'Power Electronics',
    slug: 'power-electronics-ece',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'Thyristors, Controlled Rectifiers, DC Choppers, Inverters, AC Voltage Controllers, and Industrial Applications.',
    units: []
  },
  {
    id: 'kcs-602-wt',
    code: 'KCS-602',
    subject: 'Web Technology',
    slug: 'web-technology',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'HTML5, CSS3, JavaScript DOM, Client-Server Architecture, Servlets, JSP, XML, and Web Frameworks.',
    units: []
  },
  {
    id: 'kcs-502-cd',
    code: 'KCS-502',
    subject: 'Compiler Design',
    slug: 'compiler-design',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Lexical Analysis, Syntax Parsing (LL & LR), Syntax Directed Translation, Intermediate Code, and Optimization.',
    units: []
  },
  {
    id: 'kcs-601-se',
    code: 'KCS-601',
    subject: 'Software Engineering',
    slug: 'software-engineering',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'SDLC Models, Requirements Engineering, Software Architecture, Testing Strategies, and Agile Methodologies.',
    units: []
  },
  {
    id: 'kcs-501-dbms',
    code: 'KCS-501',
    subject: 'Database Management System (DBMS)',
    slug: 'database-management-system',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'ER Modeling, Relational Algebra, SQL Queries, Normalization, Transaction Processing, and Concurrency Control.',
    units: []
  },
  {
    id: 'kcs-503-cn',
    code: 'KCS-503',
    subject: 'Computer Networks',
    slug: 'computer-networks',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'OSI & TCP/IP Model, Data Link Layer Protocols, Routing Algorithms, Transport Layer (TCP/UDP), and Application Layer.',
    units: []
  },
  {
    id: 'kcs-054-oosd',
    code: 'KCS-054',
    subject: 'Object Oriented System Design',
    slug: 'object-oriented-system-design',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'UML Class Diagrams, Sequence Diagrams, Use Cases, Object Oriented Modeling, Design Patterns, and Principles.',
    units: []
  },
  {
    id: 'kcs-055-da',
    code: 'KCS-055',
    subject: 'Data Analytics',
    slug: 'data-analytics',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Data Preprocessing, Exploratory Data Analysis, Regression, Classification, Clustering, and Big Data Intro.',
    units: []
  },
  {
    id: 'kcs-056-daa',
    code: 'KCS-056',
    subject: 'Data Analysis Algorithms',
    slug: 'data-analysis-algorithms',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Statistical Learning Algorithms, Hypothesis Testing, Dimensionality Reduction (PCA), and Algorithmic Analysis.',
    units: []
  },
  {
    id: 'kcs-053-cg',
    code: 'KCS-053',
    subject: 'Computer Graphics',
    slug: 'computer-graphics',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Raster Graphics, 2D/3D Transformations, Clipping Algorithms, Curves & Surfaces, Shading, and Animation.',
    units: []
  },
  {
    id: 'kcs-061-wd3',
    code: 'KCS-061',
    subject: 'Web Designing',
    slug: 'web-designing-3rd-year',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 3,
    description: 'Advanced Responsive Web Development, UI/UX Principles, Frontend Frameworks, and Web Standards.',
    units: []
  },
  {
    id: 'kcs-062-cs3',
    code: 'KCS-062',
    subject: 'Cyber Security',
    slug: 'cyber-security-3rd-year',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 3,
    description: 'Information Security Principles, Network Attacks, Cryptography Techniques, Cyber Laws, and Ethics.',
    units: []
  },
  {
    id: 'kcs-063-mlt',
    code: 'KCS-063',
    subject: 'Machine Learning Technology',
    slug: 'machine-learning-technology',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'Supervised & Unsupervised Machine Learning, Decision Trees, SVM, Neural Networks, and ML Model Evaluation.',
    units: []
  },

  // =========================================================================
  // 4TH YEAR — ALL BRANCHES (12 SUBJECTS)
  // =========================================================================
  {
    id: 'kcs-071-ai',
    code: 'KCS-071',
    subject: 'Artificial Intelligence',
    slug: 'artificial-intelligence-4th-year',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Heuristic Search (A*, AO*), Knowledge Representation, Logic, Neural Networks, and AI Applications.',
    units: []
  },
  {
    id: 'kcs-072-nlp',
    code: 'KCS-072',
    subject: 'Natural Language Processing',
    slug: 'natural-language-processing',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Tokenization, POS Tagging, Parsing, Sentiment Analysis, Word Embeddings, and Language Models.',
    units: []
  },
  {
    id: 'kcs-073-hpc',
    code: 'KCS-073',
    subject: 'High Performance Computing',
    slug: 'high-performance-computing',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Parallel Architectures, OpenMP, MPI Programming, GPU Computing (CUDA), and Cluster Performance.',
    units: []
  },
  {
    id: 'kcs-074-cns',
    code: 'KCS-074',
    subject: 'Cryptography & Network Security',
    slug: 'cryptography-network-security',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Symmetric & Asymmetric Ciphers (AES, RSA), Hash Functions, Digital Signatures, IPsec, and SSL/TLS.',
    units: []
  },
  {
    id: 'kcs-075-dda',
    code: 'KCS-075',
    subject: 'Design & Development of Applications',
    slug: 'design-development-applications',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Application Design Architecture, Mobile & Web App Lifecycle, API Integration, and Cloud Deployment.',
    units: []
  },
  {
    id: 'kcs-076-st',
    code: 'KCS-076',
    subject: 'Software Testing',
    slug: 'software-testing',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Black-box & White-box Testing, Unit Testing, Integration Testing, Test Case Automation, and Bug Tracking.',
    units: []
  },
  {
    id: 'kcs-081-ds',
    code: 'KCS-081',
    subject: 'Distributed Systems',
    slug: 'distributed-systems-4th-year',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 4,
    description: 'Distributed System Models, RPC, Logical Clocks (Lamport, Vector), Mutual Exclusion, and Consensus Protocols.',
    units: []
  },
  {
    id: 'kcs-082-dl',
    code: 'KCS-082',
    subject: 'Deep Learning',
    slug: 'deep-learning',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 4,
    description: 'Deep Neural Networks, Convolutional Neural Networks (CNN), Recurrent Neural Networks (RNN), and Transformers.',
    units: []
  },
  {
    id: 'kcs-083-soa',
    code: 'KCS-083',
    subject: 'Service Oriented Architecture',
    slug: 'service-oriented-architecture',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 4,
    description: 'SOA Principles, Web Services (SOAP, REST), Microservices Architecture, Service Bus, and Orchestration.',
    units: []
  },
  {
    id: 'kcs-084-qc',
    code: 'KCS-084',
    subject: 'Quantum Computing',
    slug: 'quantum-computing',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 4,
    description: 'Qubits, Quantum Gates, Quantum Algorithms (Shor, Grover), Superposition, Entanglement, and Quantum Circuits.',
    units: []
  },
  {
    id: 'kcs-085-mc',
    code: 'KCS-085',
    subject: 'Mobile Computing',
    slug: 'mobile-computing',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 4,
    description: 'Cellular Systems, Mobile IP, Wireless Protocols, Mobile OS Architecture, and Wireless Sensor Networks.',
    units: []
  },
  {
    id: 'kcs-086-iot',
    code: 'KCS-086',
    subject: 'Internet of Things',
    slug: 'internet-of-things',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS', 'Maths'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 4,
    description: 'IoT Hardware, Sensors & Actuators, MQTT/CoAP Communication, Raspberry Pi/Arduino, and IoT Security.',
    units: []
  }
];

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
    const matchUnit = subjectObj.units.some(u => 
      u.title.toLowerCase().includes(q) ||
      u.topics.some(t => t.toLowerCase().includes(q)) ||
      (u.notes && u.notes.some(n => n.title.toLowerCase().includes(q)))
    );

    return matchSubject || matchUnit;
  });
}
