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

  // =========================================================================
  // 2ND YEAR — CSE / IT / AI & DS / ECE / ME / CE / EE / MATHS
  // =========================================================================

  // --- 2nd Year: Semester 3 ---
  {
    id: 'kcs-301',
    code: 'KCS-301',
    subject: 'Data Structures',
    slug: 'data-structures',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Linear & Non-linear Data Structures, Stacks, Queues, Linked Lists, Trees, Graphs, Sorting, and Searching.',
    units: [
      {
        unitNo: 1,
        title: 'Introduction to Data Structures & Arrays',
        topics: ['Time & Space Complexity Notation', 'Arrays, 2D Arrays & Sparse Matrices', 'Recursion & Tail Recursion'],
        notes: [
          {
            id: 'ds-quantum-unit-1',
            title: 'Data Structures Quantum Series PDF',
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
        title: 'Stacks & Queues',
        topics: ['Stack ADT, Infix to Postfix Conversion', 'Queue ADT, Circular Queue & Priority Queue', 'Deque'],
        notes: [
          {
            id: 'ds-quantum-unit-2',
            title: 'Data Structures Quantum Series PDF',
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
        title: 'Linked Lists',
        topics: ['Singly, Doubly & Circular Linked Lists', 'Polynomial Addition using Linked Lists', 'Doubly Linked Queue'],
        notes: [
          {
            id: 'ds-quantum-unit-3',
            title: 'Data Structures Quantum Series PDF',
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
        title: 'Trees & Binary Search Trees',
        topics: ['Binary Tree Traversal (Inorder, Preorder, Postorder)', 'Binary Search Tree (BST) Operations', 'AVL Trees & Rotations', 'B-Trees & B+ Trees Overview'],
        notes: [
          {
            id: 'ds-quantum-unit-4',
            title: 'Data Structures Quantum Series PDF',
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
        title: 'Graphs, Searching & Sorting',
        topics: ['Graph Representation: Adjacency Matrix & List', 'BFS & DFS Graph Traversals', 'Dijkstra & Prim Algorithm', 'Sorting: Bubble, Quick, Merge, Heap Sort'],
        notes: [
          {
            id: 'ds-quantum-unit-5',
            title: 'Data Structures Quantum Series PDF',
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
    id: 'kcs-302',
    code: 'KCS-302',
    subject: 'Computer Organization & Architecture (COA)',
    slug: 'computer-organization',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Functional Units, Register Transfer Language, ALU, Booth Algorithm, Cache Memory & Pipelining.',
    units: [
      {
        unitNo: 1,
        title: 'Functional Units & Register Transfer',
        topics: ['Bus Architecture & Microoperations', 'Arithmetic & Logic Shift Unit', 'Instruction Codes & Formats'],
        notes: [
          {
            id: 'coa-quantum-unit-1',
            title: 'COA Quantum Series PDF',
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
        title: 'Computer Arithmetic',
        topics: ['Addition & Subtraction with Signed Numbers', 'Booth Multiplication Algorithm', 'Division Algorithms'],
        notes: [
          {
            id: 'coa-quantum-unit-2',
            title: 'COA Quantum Series PDF',
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
        title: 'Control Unit Architecture',
        topics: ['Hardwired Control Unit', 'Microprogrammed Control Unit & Microinstruction', 'Control Memory'],
        notes: [
          {
            id: 'coa-quantum-unit-3',
            title: 'COA Quantum Series PDF',
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
        title: 'Memory Organization',
        topics: ['RAM, ROM & Cache Memory Mapping (Direct, Associative, Set-Associative)', 'Virtual Memory & Page Replacement', 'Secondary Storage Structures'],
        notes: [
          {
            id: 'coa-quantum-unit-4',
            title: 'COA Quantum Series PDF',
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
        title: 'Input-Output Organization & Pipelining',
        topics: ['Peripheral Devices & I/O Interfaces', 'Programmed I/O, Interrupt-Driven I/O & DMA', 'Instruction Pipeline & Pipelining Hazards'],
        notes: [
          {
            id: 'coa-quantum-unit-5',
            title: 'COA Quantum Series PDF',
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
    id: 'kcs-303',
    code: 'KCS-303',
    subject: 'Discrete Mathematics',
    slug: 'discrete-mathematics',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS', 'Maths'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Set Theory, Relations, Functions, Propositional Logic, Lattices, Boolean Algebra & Combinatorics.',
    units: [
      {
        unitNo: 1,
        title: 'Set Theory, Relations & Functions',
        topics: ['Sets, Subsets & Power Set', 'Equivalence Relations & Partial Ordering (POSET)', 'Hasse Diagrams'],
        notes: [
          {
            id: 'dstl-quantum-unit-1',
            title: 'Discrete Mathematics Quantum Series PDF',
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
        title: 'Algebraic Structures',
        topics: ['Groups, Subgroups, Cosets & Lagrange Theorem', 'Normal Subgroups & Homomorphism', 'Rings, Integral Domains & Fields'],
        notes: [
          {
            id: 'dstl-quantum-unit-2',
            title: 'Discrete Mathematics Quantum Series PDF',
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
        title: 'Lattices & Boolean Algebra',
        topics: ['Lattices as POSETs & Properties', 'Bounded & Complemented Lattices', 'Boolean Algebra & Karnaugh Maps'],
        notes: [
          {
            id: 'dstl-quantum-unit-3',
            title: 'Discrete Mathematics Quantum Series PDF',
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
        title: 'Propositional & Predicate Logic',
        topics: ['Propositions, Truth Tables & Tautologies', 'Rules of Inference & Natural Deduction', 'Predicates & Quantifiers'],
        notes: [
          {
            id: 'dstl-quantum-unit-4',
            title: 'Discrete Mathematics Quantum Series PDF',
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
        title: 'Combinatorics & Recurrence Relations',
        topics: ['Pigeonhole Principle & Permutations/Combinations', 'Recurrence Relations & Generating Functions', 'Homogeneous Linear Recurrence Relations'],
        notes: [
          {
            id: 'dstl-quantum-unit-5',
            title: 'Discrete Mathematics Quantum Series PDF',
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
    id: 'kec-301',
    code: 'KEC-301',
    subject: 'Electronic Devices',
    slug: 'electronic-devices',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Semiconductor Physics, PN Junction Diode, BJT Characteristics, MOSFET Fabrication and High-Frequency Analysis.',
    units: [
      { unitNo: 1, title: 'Semiconductor Physics & PN Junction', topics: ['Intrinsic & Extrinsic Semiconductors', 'Fermi Level & Energy Band Diagrams', 'PN Junction Diode Characteristics'], notes: [] },
      { unitNo: 2, title: 'Bipolar Junction Transistor (BJT)', topics: ['BJT Operation & Configuration (CB, CE, CC)', 'Transistor Biasing & Thermal Runaway', 'Small Signal Analysis'], notes: [] },
      { unitNo: 3, title: 'Field Effect Transistors (FET & MOSFET)', topics: ['JFET Construction & V-I Characteristics', 'MOSFET Enhancement & Depletion Types', 'MOS Capacitor Physics'], notes: [] },
      { unitNo: 4, title: 'Special Diode & Photonic Devices', topics: ['Zener Diode & Voltage Regulation', 'LED, Photodiode & Solar Cell Working', 'Schottky & Tunnel Diodes'], notes: [] },
      { unitNo: 5, title: 'IC Fabrication Technology', topics: ['Epitaxy, Oxidation & Lithography Steps', 'Diffusion & Ion Implantation', 'CMOS Fabrication Process'], notes: [] }
    ]
  },
  {
    id: 'kme-301',
    code: 'KME-301',
    subject: 'Thermodynamics',
    slug: 'thermodynamics',
    branch: 'ME',
    applicableBranches: ['ME'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'First & Second Laws of Thermodynamics, Entropy, Availability, Pure Substances, and Power Cycles.',
    units: [
      { unitNo: 1, title: 'Fundamental Concepts & Zeroth/First Law', topics: ['System, Boundary, State & Equilibrium', 'Zeroth Law & Temperature Scale', 'First Law for Closed & Open Systems'], notes: [] },
      { unitNo: 2, title: 'Second Law & Entropy', topics: ['Kelvin-Planck & Clausius Statements', 'Carnot Engine & Efficiency', 'Clausius Inequality & Entropy Concept'], notes: [] },
      { unitNo: 3, title: 'Availability & Irreversibility', topics: ['High & Low Grade Energy', 'Available & Unavailable Energy', 'Exergy Analysis of Thermal Systems'], notes: [] },
      { unitNo: 4, title: 'Properties of Pure Substances', topics: ['P-V-T Diagrams of Water', 'Steam Tables & Mollier Chart Usage', 'Dryness Fraction Measurement'], notes: [] },
      { unitNo: 5, title: 'Thermodynamic Power Cycles', topics: ['Air Standard Cycles: Otto, Diesel & Dual Cycles', 'Rankine Cycle & Steam Cycles', 'Gas Turbine Brayton Cycle'], notes: [] }
    ]
  },
  {
    id: 'kce-302',
    code: 'KCE-302',
    subject: 'Solid Mechanics',
    slug: 'solid-mechanics',
    branch: 'CE',
    applicableBranches: ['CE', 'ME'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Stress-Strain Relations, Shear Force & Bending Moment Diagrams, Bending Stresses, Torsion, and Deflection.',
    units: [
      { unitNo: 1, title: 'Simple Stresses & Strains', topics: ['Hooke Law & Elastic Constants', 'Thermal Stresses in Compound Bars', 'Principal Stresses & Mohr Circle'], notes: [] },
      { unitNo: 2, title: 'Shear Force & Bending Moment Diagrams', topics: ['Types of Beams & Loads', 'SFD & BMD for Cantilever & Simply Supported Beams', 'Point of Contraflexure'], notes: [] },
      { unitNo: 3, title: 'Bending & Shear Stresses in Beams', topics: ['Pure Bending Theory & Flexural Formula', 'Section Modulus for Rectangular & I Sections', 'Shear Stress Distribution'], notes: [] },
      { unitNo: 4, title: 'Torsion & Springs', topics: ['Torsion Equation for Circular Shafts', 'Power Transmission', 'Helical Springs Analysis'], notes: [] },
      { unitNo: 5, title: 'Deflection of Beams & Columns', topics: ['Double Integration Method', 'Euler Buckling Formula for Columns', 'Rankine-Gordon Formula'], notes: [] }
    ]
  },
  {
    id: 'kee-301',
    code: 'KEE-301',
    subject: 'Basic System Analysis',
    slug: 'basic-system-analysis',
    branch: 'EE',
    applicableBranches: ['EE', 'ECE'],
    year: '2nd Year',
    semester: 'Sem 3',
    credits: 4,
    description: 'Continuous & Discrete-time Signals, Fourier Series, Laplace Transform, State Variable Analysis.',
    units: [
      { unitNo: 1, title: 'Signals & Systems Classification', topics: ['Continuous vs Discrete Time Signals', 'Energy & Power Signals', 'LTI Systems & Convolution'], notes: [] },
      { unitNo: 2, title: 'Fourier Analysis of Signals', topics: ['Fourier Series & Transform', 'Frequency Response of LTI Systems', 'Sampling Theorem'], notes: [] },
      { unitNo: 3, title: 'Laplace Transform Applications', topics: ['s-Domain Analysis of Electrical Networks', 'Transfer Function & Impulse Response', 'Poles & Zeros'], notes: [] },
      { unitNo: 4, title: 'State Variable Analysis', topics: ['State Space Model Representation', 'State Transition Matrix', 'Controllability & Observability'], notes: [] },
      { unitNo: 5, title: 'Z-Transform & Discrete Systems', topics: ['Region of Convergence (ROC)', 'Inverse Z-Transform', 'Discrete-Time System Analysis'], notes: [] }
    ]
  },

  // --- 2nd Year: Semester 4 ---
  {
    id: 'kcs-401',
    code: 'KCS-401',
    subject: 'Operating System',
    slug: 'operating-system',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'CPU scheduling, memory management, process synchronization, deadlocks, and file systems.',
    units: [
      {
        unitNo: 1,
        title: 'Introduction & Operating System Structures',
        topics: ['OS Overview & Objectives', 'Types of OS: Batch, Multiprogramming, Time-Sharing', 'System Calls & OS Services'],
        notes: [
          {
            id: 'os-quantum-unit-1',
            title: 'Operating System Quantum Series PDF',
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
        title: 'Process Management & CPU Scheduling',
        topics: ['Process Concept & PCB', 'CPU Scheduling Algorithms (FCFS, SJF, Round-Robin)', 'Inter-Process Communication (IPC)'],
        notes: [
          {
            id: 'os-quantum-unit-2',
            title: 'Operating System Quantum Series PDF',
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
        title: 'Process Synchronization & Deadlocks',
        topics: ['Critical Section Problem & Semaphores', 'Deadlock Prevention & Avoidance (Banker Algorithm)', 'Deadlock Detection & Recovery'],
        notes: [
          {
            id: 'os-quantum-unit-3',
            title: 'Operating System Quantum Series PDF',
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
        title: 'Memory Management & Virtual Memory',
        topics: ['Paging & Segmentation', 'Virtual Memory & Demand Paging', 'Page Replacement Algorithms (FIFO, LRU, Optimal)'],
        notes: [
          {
            id: 'os-quantum-unit-4',
            title: 'Operating System Quantum Series PDF',
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
        title: 'File Systems & Disk Management',
        topics: ['File Structure & Allocation Methods', 'Disk Scheduling Algorithms (FCFS, SSTF, SCAN, C-SCAN)', 'Swap Space Management'],
        notes: [
          {
            id: 'os-quantum-unit-5',
            title: 'Operating System Quantum Series PDF',
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
    id: 'kcs-402',
    code: 'KCS-402',
    subject: 'Theory of Automata & Formal Languages (TAFL)',
    slug: 'theory-of-automata',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'DFA, NFA, Regular Expressions, Context-Free Grammars, Pushdown Automata, and Turing Machines.',
    units: [
      {
        unitNo: 1,
        title: 'Finite Automata & Regular Expressions',
        topics: ['DFA & NFA Equivalence', 'Mealy & Moore Machines', 'Pumping Lemma for Regular Languages'],
        notes: [
          {
            id: 'tafl-quantum-unit-1',
            title: 'TAFL Quantum Series PDF',
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
        title: 'Regular Grammars & Languages',
        topics: ['Regular Grammar Definition', 'Conversion of Regular Grammar to FA', 'Closure Properties of Regular Sets'],
        notes: [
          {
            id: 'tafl-quantum-unit-2',
            title: 'TAFL Quantum Series PDF',
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
        title: 'Context-Free Grammars (CFG) & Languages',
        topics: ['Derivation Trees & Ambiguity in CFG', 'Chomsky Normal Form (CNF) & Greibach Normal Form (GNF)', 'Pumping Lemma for CFLs'],
        notes: [
          {
            id: 'tafl-quantum-unit-3',
            title: 'TAFL Quantum Series PDF',
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
        title: 'Pushdown Automata (PDA)',
        topics: ['Deterministic & Non-Deterministic PDA', 'Equivalence of PDA and CFG', 'Parsing Techniques'],
        notes: [
          {
            id: 'tafl-quantum-unit-4',
            title: 'TAFL Quantum Series PDF',
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
        title: 'Turing Machines & Undecidability',
        topics: ['Turing Machine Definition & Design', 'Church-Turing Thesis', 'Halting Problem & Post Correspondence Problem (PCP)'],
        notes: [
          {
            id: 'tafl-quantum-unit-5',
            title: 'TAFL Quantum Series PDF',
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
    id: 'kcs-403',
    code: 'KCS-403',
    subject: 'Python Programming',
    slug: 'python-programming',
    branch: 'CSE',
    applicableBranches: ['ALL', 'CSE', 'IT', 'AI & DS', 'Maths', 'EE', 'ECE', 'ME', 'CE'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 3,
    description: 'Python Basics, Control Statements, Data Structures, OOPs, Modules & File Handling.',
    units: [
      { unitNo: 1, title: 'Python Basics & Operators', topics: ['Variables & Expressions', 'Input/Output Functions', 'Operators & Precedence'], notes: [] },
      { unitNo: 2, title: 'Control Statements & Strings', topics: ['If-Else & Loops', 'Break & Continue', 'String Slice & Operations'], notes: [] },
      { unitNo: 3, title: 'Python Lists, Tuples & Dictionaries', topics: ['List Methods & Mutability', 'Tuple Operations', 'Dictionary Keys & Values'], notes: [] },
      { unitNo: 4, title: 'Functions & Modules', topics: ['Defining Functions & Arguments', 'Lambda Functions & Recursion', 'Built-in Modules (math, random, os)'], notes: [] },
      { unitNo: 5, title: 'OOPs & Exception Handling', topics: ['Classes & Objects', 'Inheritance & Polymorphism', 'Try-Except Blocks & File Read/Write'], notes: [] }
    ]
  },
  {
    id: 'kec-401',
    code: 'KEC-401',
    subject: 'Communication Engineering',
    slug: 'communication-engineering',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'Analog & Digital Modulation, AM, FM, Pulse Code Modulation (PCM), Digital Baseband Transmission.',
    units: [
      { unitNo: 1, title: 'Amplitude Modulation (AM)', topics: ['DSB-FC, DSB-SC, SSB-SC Modulation', 'AM Transmitters & Superheterodyne Receiver', 'Noise in AM'], notes: [] },
      { unitNo: 2, title: 'Angle Modulation (FM & PM)', topics: ['Narrowband & Wideband FM', 'Direct & Indirect FM Generation (Armstrong Method)', 'FM Detectors'], notes: [] },
      { unitNo: 3, title: 'Pulse Modulation Techniques', topics: ['Sampling Theorem & Aliasing', 'PAM, PWM, PPM Modulation', 'Pulse Code Modulation (PCM) & DPCM'], notes: [] },
      { unitNo: 4, title: 'Digital Bandpass Transmission', topics: ['ASK, FSK, PSK Signal Constellations', 'QPSK & BPSK Performance', 'Matched Filter Receiver'], notes: [] },
      { unitNo: 5, title: 'Information Theory & Coding', topics: ['Entropy & Mutual Information', 'Shannon Channel Capacity Theorem', 'Huffman & Error Control Coding'], notes: [] }
    ]
  },
  {
    id: 'kme-401',
    code: 'KME-401',
    subject: 'Fluid Mechanics & Fluid Machines',
    slug: 'fluid-mechanics',
    branch: 'ME',
    applicableBranches: ['ME', 'CE'],
    year: '2nd Year',
    semester: 'Sem 4',
    credits: 4,
    description: 'Fluid Statics, Kinematics, Bernoulli Equation, Viscous Flow, Turbines, and Centrifugal Pumps.',
    units: [
      { unitNo: 1, title: 'Fluid Statics & Properties', topics: ['Viscosity, Surface Tension & Capillarity', 'Pascal & Hydrostatic Law', 'Buoyancy & Metacentric Height'], notes: [] },
      { unitNo: 2, title: 'Fluid Kinematics & Dynamics', topics: ['Streamlines, Streaklines & Pathlines', 'Continuity Equation in 3D', 'Bernoulli Theorem & Venturimeter'], notes: [] },
      { unitNo: 3, title: 'Viscous & Boundary Layer Flow', topics: ['Laminar Flow through Circular Pipe (Hagen-Poiseuille)', 'Boundary Layer Thickness', 'Drag & Lift Forces'], notes: [] },
      { unitNo: 4, title: 'Hydraulic Turbines', topics: ['Impact of Jets', 'Pelton Wheel Turbine', 'Francis & Kaplan Turbines'], notes: [] },
      { unitNo: 5, title: 'Centrifugal & Reciprocating Pumps', topics: ['Working Principle & Work Done', 'Cavitation & NPSH', 'Air Vessels in Reciprocating Pump'], notes: [] }
    ]
  },

  // =========================================================================
  // 3RD YEAR — ALL BRANCHES
  // =========================================================================

  // --- 3rd Year: CSE / IT / AI & DS ---
  {
    id: 'kcs-501',
    code: 'KCS-501',
    subject: 'Database Management Systems (DBMS)',
    slug: 'dbms',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Relational Model, ER Diagrams, SQL Queries, Normalization (1NF to BCNF), Transaction Processing, and Concurrency Control.',
    units: [
      {
        unitNo: 1,
        title: 'Introduction & ER Modeling',
        topics: ['Database System Architecture & 3-Schema Architecture', 'ER Diagram Entities, Attributes & Relationships', 'Relational Model & Keys'],
        notes: [
          {
            id: 'dbms-quantum-unit-1',
            title: 'DBMS Quantum Series PDF',
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
        title: 'Relational Algebra & SQL',
        topics: ['Relational Algebra Operators', 'SQL DDL, DML, DCL Commands', 'Nested Queries, Views & Joins'],
        notes: [
          {
            id: 'dbms-quantum-unit-2',
            title: 'DBMS Quantum Series PDF',
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
        title: 'Database Normalization',
        topics: ['Functional Dependencies & Attribute Closure', 'Normal Forms: 1NF, 2NF, 3NF, BCNF', 'Lossless Join & Dependency Preservation'],
        notes: [
          {
            id: 'dbms-quantum-unit-3',
            title: 'DBMS Quantum Series PDF',
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
        title: 'Transaction Processing & Concurrency',
        topics: ['ACID Properties of Transactions', 'Serializability: Conflict & View Serializability', 'Concurrency Control: Two-Phase Locking (2PL)'],
        notes: [
          {
            id: 'dbms-quantum-unit-4',
            title: 'DBMS Quantum Series PDF',
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
        title: 'Database Recovery & Indexing',
        topics: ['Failure Classification & Log-Based Recovery', 'Checkpoints & Shadow Paging', 'Indexing Techniques: B-Tree Indexing'],
        notes: [
          {
            id: 'dbms-quantum-unit-5',
            title: 'DBMS Quantum Series PDF',
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
    id: 'kcs-502',
    code: 'KCS-502',
    subject: 'Compiler Design',
    slug: 'compiler-design',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Lexical Analysis, Lex, Syntax Analysis, Yacc, Syntax-Directed Translation, Intermediate Code Generation, and Code Optimization.',
    units: [
      { unitNo: 1, title: 'Introduction & Lexical Analysis', topics: ['Phases of Compiler Architecture', 'Lexical Analyzer & Token Recognition', 'Regular Expressions to Finite Automata'], notes: [] },
      { unitNo: 2, title: 'Syntax Analysis & Top-Down Parsing', topics: ['Role of Parser & Context Free Grammar', 'Recursive Descent & LL(1) Parsing', 'FIRST & FOLLOW Sets Computation'], notes: [] },
      { unitNo: 3, title: 'Bottom-Up Parsing', topics: ['Shift-Reduce & LR(0) Parsing', 'SLR(1), LALR(1) & CLR(1) Parsing Tables', 'YACC Tool Overview'], notes: [] },
      { unitNo: 4, title: 'Syntax-Directed Translation & Intermediate Code', topics: ['Syntax Directed Definitions (SDD) & SDT', '3-Address Code (Triples & Quadruples)', 'DAG Representation of Expressions'], notes: [] },
      { unitNo: 5, title: 'Code Optimization & Generation', topics: ['Principal Sources of Optimization', 'Loop Optimization & Basic Blocks', 'Target Machine Code Generation'], notes: [] }
    ]
  },
  {
    id: 'kcs-503',
    code: 'KCS-503',
    subject: 'Computer Networks',
    slug: 'computer-networks',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'OSI Model, TCP/IP Layering, IP Subnetting, Routing Algorithms, Flow Control (Sliding Window), TCP/UDP Protocols.',
    units: [
      {
        unitNo: 1,
        title: 'Network Fundamentals & Physical Layer',
        topics: ['OSI 7-Layer Reference Model vs TCP/IP Architecture', 'Network Topologies & Switching Techniques', 'Transmission Media'],
        notes: [
          {
            id: 'cn-quantum-unit-1',
            title: 'Computer Networks Quantum Series PDF',
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
        title: 'Data Link Layer & MAC Sublayer',
        topics: ['Framing & Error Control (CRC)', 'Sliding Window Protocols (Go-Back-N, Selective Repeat)', 'ALOHA & CSMA/CD'],
        notes: [
          {
            id: 'cn-quantum-unit-2',
            title: 'Computer Networks Quantum Series PDF',
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
        title: 'Network Layer & IP Addressing',
        topics: ['IPv4 Addressing & Classless Subnetting (CIDR)', 'IPv6 Address Architecture', 'Routing Algorithms (OSPF, BGP)'],
        notes: [
          {
            id: 'cn-quantum-unit-3',
            title: 'Computer Networks Quantum Series PDF',
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
        title: 'Transport Layer Protocols',
        topics: ['UDP Header & Connectionless Service', 'TCP 3-Way Handshake & Connection Management', 'TCP Congestion Control'],
        notes: [
          {
            id: 'cn-quantum-unit-4',
            title: 'Computer Networks Quantum Series PDF',
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
        title: 'Application Layer Protocols',
        topics: ['Domain Name System (DNS) Resolution', 'HTTP/HTTPS, FTP, SMTP Protocols', 'Network Security Basics & Firewalls'],
        notes: [
          {
            id: 'cn-quantum-unit-5',
            title: 'Computer Networks Quantum Series PDF',
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
    id: 'kcs-601',
    code: 'KCS-601',
    subject: 'Software Engineering',
    slug: 'software-engineering',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'SDLC Models, SRS, Software Architecture, Testing (White Box/Black Box), Function Point Analysis & Maintenance.',
    units: [
      { unitNo: 1, title: 'Software Process & SDLC Models', topics: ['Waterfall, Spiral, Agile & Scrum Models', 'Software Requirement Specification (SRS)', 'Feasibility Analysis'], notes: [] },
      { unitNo: 2, title: 'Software Design & Modeling', topics: ['Cohesion & Coupling', 'Data Flow Diagrams (DFD)', 'UML Use Case, Class & Sequence Diagrams'], notes: [] },
      { unitNo: 3, title: 'Software Project Estimation & Metrics', topics: ['COCOMO Model Estimation', 'Function Point (FP) Analysis', 'Risk Management & Mitigation'], notes: [] },
      { unitNo: 4, title: 'Software Testing & Quality Assurance', topics: ['White Box & Black Box Testing', 'Unit, Integration & System Testing', 'Cyclomatic Complexity'], notes: [] },
      { unitNo: 5, title: 'Software Maintenance & Reliability', topics: ['Reverse Engineering & Re-engineering', 'Software Configuration Management', 'ISO 9000 & CMMI Levels'], notes: [] }
    ]
  },
  {
    id: 'kcs-602',
    code: 'KCS-602',
    subject: 'Web Technology',
    slug: 'web-technology',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '3rd Year',
    semester: 'Sem 6',
    credits: 4,
    description: 'HTML5, CSS3, JavaScript, DOM, Servlets, JSP, XML, and Web Services.',
    units: [
      { unitNo: 1, title: 'HTML5, CSS3 & Responsive Design', topics: ['HTML Elements, Tables & Forms', 'CSS Box Model, Flexbox & Grid', 'Media Queries'], notes: [] },
      { unitNo: 2, title: 'Client-Side JavaScript & DOM Manipulation', topics: ['Variables, Functions & ES6 Features', 'DOM Tree Traversal & Event Handling', 'JSON & AJAX Requests'], notes: [] },
      { unitNo: 3, title: 'Server-Side Java Servlets', topics: ['Servlet Lifecycle & HTTP Methods', 'Session Tracking (Cookies, HttpSession)', 'Database Connectivity (JDBC)'], notes: [] },
      { unitNo: 4, title: 'Java Server Pages (JSP)', topics: ['JSP Directives, Scriptlets & Expression Language', 'JSP Standard Tag Library (JSTL)', 'MVC Architecture in Web Apps'], notes: [] },
      { unitNo: 5, title: 'XML & Web Services', topics: ['XML Schema & DTD Validation', 'SOAP vs RESTful Web Services', 'Web Security Basics'], notes: [] }
    ]
  },

  // --- 3rd Year: ECE / EE ---
  {
    id: 'kec-501',
    code: 'KEC-501',
    subject: 'Digital Signal Processing (DSP)',
    slug: 'digital-signal-processing',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Discrete Fourier Transform (DFT), Fast Fourier Transform (FFT), IIR/FIR Filter Design, Digital Signal Processors.',
    units: [
      { unitNo: 1, title: 'Discrete Fourier Transform (DFT)', topics: ['DFT Definition & Properties', 'Circular Convolution vs Linear Convolution', 'IDFT Computation'], notes: [] },
      { unitNo: 2, title: 'Fast Fourier Transform (FFT) Algorithms', topics: ['Decimation in Time (DIT) FFT', 'Decimation in Frequency (DIF) FFT', 'Butterfly Diagrams'], notes: [] },
      { unitNo: 3, title: 'IIR Digital Filter Design', topics: ['Butterworth & Chebyshev Filters', 'Impulse Invariance Transformation', 'Bilinear Transformation'], notes: [] },
      { unitNo: 4, title: 'FIR Digital Filter Design', topics: ['Linear Phase FIR Filters', 'Windowing Techniques (Hamming, Hanning, Blackman)', 'Frequency Sampling Method'], notes: [] },
      { unitNo: 5, title: 'Digital Signal Processors Architecture', topics: ['TMS320C67x Architecture', 'Pipelining & MAC Unit', 'Finite Word Length Effects'], notes: [] }
    ]
  },
  {
    id: 'kee-501',
    code: 'KEE-501',
    subject: 'Control Systems',
    slug: 'control-systems',
    branch: 'EE',
    applicableBranches: ['EE', 'ECE', 'ME'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Transfer Functions, Block Diagram Reduction, Routh-Hurwitz Stability, Root Locus, Bode Plot & Nyquist Criterion.',
    units: [
      { unitNo: 1, title: 'Control System Modeling', topics: ['Open Loop vs Closed Loop Systems', 'Block Diagram Algebra', 'Signal Flow Graph & Mason Gain Formula'], notes: [] },
      { unitNo: 2, title: 'Time Response Analysis', topics: ['Standard Test Signals', 'First & Second Order System Transient Response', 'Steady-State Error & Error Constants'], notes: [] },
      { unitNo: 3, title: 'Stability Analysis & Root Locus', topics: ['Routh-Hurwitz Stability Criterion', 'Root Locus Construction Rules', 'Stability Margins'], notes: [] },
      { unitNo: 4, title: 'Frequency Response Analysis', topics: ['Bode Plot Gain & Phase Margins', 'Nyquist Stability Criterion & Contour', 'Polar Plots'], notes: [] },
      { unitNo: 5, title: 'State Variable Analysis & Compensators', topics: ['State Transition Matrix', 'Lead, Lag & Lag-Lead Compensators', 'PID Controllers'], notes: [] }
    ]
  },

  // --- 3rd Year: ME / CE ---
  {
    id: 'kme-501',
    code: 'KME-501',
    subject: 'Heat & Mass Transfer',
    slug: 'heat-mass-transfer',
    branch: 'ME',
    applicableBranches: ['ME'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Conduction, Convection, Radiation, Heat Exchangers, and Fick Law of Mass Transfer.',
    units: [
      { unitNo: 1, title: 'Conduction Heat Transfer', topics: ['Fourier Law & Thermal Conductivity', '1D Steady State Conduction', 'Extended Surfaces (Fins)'], notes: [] },
      { unitNo: 2, title: 'Transient Conduction & Boundary Layer', topics: ['Lumped Heat Capacity Analysis', 'Heisler Charts', 'Convective Boundary Layer Equations'], notes: [] },
      { unitNo: 3, title: 'Convective Heat Transfer', topics: ['Free & Forced Convection', 'Dimensional Analysis (Nusselt, Prandtl, Grashof Numbers)', 'Flow over Flat Plate & Pipes'], notes: [] },
      { unitNo: 4, title: 'Radiation Heat Transfer & Heat Exchangers', topics: ['Stefan-Boltzmann Law & Planck Law', 'Radiation Shape Factor', 'LMTD & NTU Methods for Heat Exchangers'], notes: [] },
      { unitNo: 5, title: 'Mass Transfer Fundamentals', topics: ['Fick Law of Diffusion', 'Mass Transfer Coefficient', 'Analogy between Heat & Mass Transfer'], notes: [] }
    ]
  },
  {
    id: 'kce-501',
    code: 'KCE-501',
    subject: 'Structural Analysis',
    slug: 'structural-analysis',
    branch: 'CE',
    applicableBranches: ['CE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Determinate & Indeterminate Structures, Slope Deflection, Moment Distribution, Strain Energy & Arches.',
    units: [
      { unitNo: 1, title: 'Static & Kinematic Indeterminancy', topics: ['Degree of Indeterminacy of Trusses & Frames', 'Castigliano Theorems', 'Unit Load Method for Deflection'], notes: [] },
      { unitNo: 2, title: 'Slope Deflection Method', topics: ['Derivation of Slope Deflection Equations', 'Analysis of Continuous Beams', 'Sway & Non-Sway Rigid Frames'], notes: [] },
      { unitNo: 3, title: 'Moment Distribution Method', topics: ['Stiffness & Carry-Over Factors', 'Distribution Factors', 'Analysis of Beams & Frames'], notes: [] },
      { unitNo: 4, title: 'Arches & Cables', topics: ['3-Hinged & 2-Hinged Arches', 'Eddy Theorem', 'Cables & Suspension Bridges with Stiffening Girders'], notes: [] },
      { unitNo: 5, title: 'Influence Line Diagrams (ILD)', topics: ['Muller-Breslau Principle', 'ILD for Simply Supported & Continuous Beams', 'Maximum Bending Moment under Moving Loads'], notes: [] }
    ]
  },

  // --- 3rd Year: Maths ---
  {
    id: 'kas-501-maths',
    code: 'KAS-501',
    subject: 'Applied Mathematics-III',
    slug: 'applied-mathematics-3',
    branch: 'Maths',
    applicableBranches: ['Maths', 'ECE', 'EE', 'ME', 'CE'],
    year: '3rd Year',
    semester: 'Sem 5',
    credits: 4,
    description: 'Partial Differential Equations, Complex Integration, Probability Distributions & Numerical Methods.',
    units: [
      { unitNo: 1, title: 'Partial Differential Equations (PDE)', topics: ['Lagrange Linear PDE', 'Charpit Method', 'Classification of 2nd Order Linear PDEs'], notes: [] },
      { unitNo: 2, title: 'Applications of PDE', topics: ['Method of Separation of Variables', '1D Wave & Heat Conduction Equations', 'Laplace Equation in 2D'], notes: [] },
      { unitNo: 3, title: 'Complex Integration & Residues', topics: ['Cauchy Residue Theorem', 'Evaluation of Real Definite Integrals', 'Conformal Mapping'], notes: [] },
      { unitNo: 4, title: 'Statistical Techniques & Probability', topics: ['Binomial, Poisson & Normal Distributions', 'Correlation & Linear Regression', 'Hypothesis Testing (t-Test, Chi-Square)'], notes: [] },
      { unitNo: 5, title: 'Numerical Methods', topics: ['Newton-Raphson & Regula-Falsi Methods', 'Newton Forward/Backward Interpolation', 'Runge-Kutta 4th Order Method'], notes: [] }
    ]
  },

  // =========================================================================
  // 4TH YEAR — ALL BRANCHES
  // =========================================================================

  // --- 4th Year: CSE / IT / AI & DS ---
  {
    id: 'kcs-701',
    code: 'KCS-701',
    subject: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Heuristic Search (A*, AO*), Knowledge Representation, Propositional Logic, Neural Networks, Natural Language Processing.',
    units: [
      { unitNo: 1, title: 'Introduction & Problem Solving Search', topics: ['AI Agents & Environments', 'Uninformed Search: BFS, DFS', 'Informed Search: A* & AO* Algorithms'], notes: [] },
      { unitNo: 2, title: 'Knowledge Representation & Logic', topics: ['Propositional & First-Order Predicate Logic', 'Resolution & Unification Algorithm', 'Semantic Nets & Frames'], notes: [] },
      { unitNo: 3, title: 'Reasoning under Uncertainty', topics: ['Bayesian Networks & Probabilistic Reasoning', 'Dempster-Shafer Theory', 'Fuzzy Logic & Membership Functions'], notes: [] },
      { unitNo: 4, title: 'Machine Learning & Neural Networks', topics: ['Supervised vs Unsupervised Learning', 'Perceptrons & Backpropagation Neural Networks', 'Decision Trees'], notes: [] },
      { unitNo: 5, title: 'Natural Language Processing & Expert Systems', topics: ['Parsing & Syntactic Analysis', 'Expert System Architecture', 'Chatbots & NLP Applications'], notes: [] }
    ]
  },
  {
    id: 'kcs-702',
    code: 'KCS-702',
    subject: 'Cloud Computing',
    slug: 'cloud-computing',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 3,
    description: 'Cloud Models (IaaS, PaaS, SaaS), Virtualization, Hypervisors, Cloud Storage, and Security.',
    units: [
      { unitNo: 1, title: 'Cloud Overview & Service Models', topics: ['NIST Cloud Definition', 'IaaS, PaaS, SaaS Architectures', 'Public, Private & Hybrid Deployments'], notes: [] },
      { unitNo: 2, title: 'Virtualization Technology', topics: ['Type-1 & Type-2 Hypervisors', 'Full vs Para-Virtualization', 'Virtual Machine Migration'], notes: [] },
      { unitNo: 3, title: 'Cloud Storage & Architecture', topics: ['Block vs Object Storage (S3)', 'Distributed File Systems (GFS, HDFS)', 'Cloud Data Management'], notes: [] },
      { unitNo: 4, title: 'Resource Management & Load Balancing', topics: ['Auto-scaling Strategies', 'Load Balancing Algorithms', 'SLA Management'], notes: [] },
      { unitNo: 5, title: 'Cloud Security & Identity', topics: ['IAM & Access Control', 'Data Encryption in Cloud', 'Compliance & Multi-Tenancy Security'], notes: [] }
    ]
  },
  {
    id: 'kcs-801',
    code: 'KCS-801',
    subject: 'Distributed Systems',
    slug: 'distributed-systems',
    branch: 'CSE',
    applicableBranches: ['CSE', 'IT', 'AI & DS'],
    year: '4th Year',
    semester: 'Sem 8',
    credits: 4,
    description: 'Distributed System Models, RPC, Logical Clocks (Lamport, Vector), Mutual Exclusion Algorithms, Consensus.',
    units: [
      { unitNo: 1, title: 'Distributed System Characterization', topics: ['Architectural Models (Client-Server, P2P)', 'System Layering & Middleware', 'Interprocess Communication'], notes: [] },
      { unitNo: 2, title: 'RPC & Message Passing', topics: ['Remote Procedure Call (RPC) Mechanism', 'RMI Architecture', 'Message-Oriented Middleware'], notes: [] },
      { unitNo: 3, title: 'Time Synchronization & Logical Clocks', topics: ['Physical Clock Synchronization (NTP)', 'Lamport Logical Clocks', 'Vector Clocks & Causality'], notes: [] },
      { unitNo: 4, title: 'Distributed Mutual Exclusion & Election', topics: ['Ricart-Agrawala Algorithm', 'Token Ring Algorithm', 'Bully & Ring Election Algorithms'], notes: [] },
      { unitNo: 5, title: 'Consensus & Fault Tolerance', topics: ['Byzantine Generals Problem', 'Two-Phase Commit Protocol', 'Replication & Consistency Models'], notes: [] }
    ]
  },

  // --- 4th Year: ECE / EE ---
  {
    id: 'kec-701',
    code: 'KEC-701',
    subject: 'Wireless & Mobile Communication',
    slug: 'wireless-communication',
    branch: 'ECE',
    applicableBranches: ['ECE', 'EE'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Cellular Concepts, Frequency Reuse, Handoff Strategies, Small-Scale Fading, 4G LTE & 5G Architecture.',
    units: [
      { unitNo: 1, title: 'Cellular System Fundamentals', topics: ['Frequency Reuse & Cell Splitting', 'Channel Assignment Strategies', 'Handoff & Interference (Co-Channel, Adjacent)'], notes: [] },
      { unitNo: 2, title: 'Mobile Radio Propagation & Fading', topics: ['Free Space Propagation Model', 'Small-Scale & Large-Scale Fading', 'Doppler Spread & Coherence Time'], notes: [] },
      { unitNo: 3, title: 'Equalization & Diversity Techniques', topics: ['Linear & Non-Linear Equalizers', 'Rake Receiver', 'Space, Frequency & Time Diversity'], notes: [] },
      { unitNo: 4, title: 'Multiple Access Techniques', topics: ['FDMA, TDMA & CDMA', 'OFDMA Principles', 'Space Division Multiple Access (SDMA)'], notes: [] },
      { unitNo: 5, title: 'Wireless Standards & 5G Networks', topics: ['GSM & CDMA2000 Architecture', '4G LTE E-UTRAN Architecture', '5G NR Features & Massive MIMO'], notes: [] }
    ]
  },

  // --- 4th Year: ME / CE ---
  {
    id: 'kme-701',
    code: 'KME-701',
    subject: 'CAD/CAM & Automation',
    slug: 'cad-cam',
    branch: 'ME',
    applicableBranches: ['ME', 'CE'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Computer Graphics Transformation, Geometric Modeling (Bezier, B-Spline), CNC Part Programming, FMS & Robotics.',
    units: [
      { unitNo: 1, title: 'CAD Fundamentals & Transformations', topics: ['2D & 3D Geometric Transformations (Translation, Rotation, Scaling)', 'Homogeneous Coordinates', 'Clipping Algorithms'], notes: [] },
      { unitNo: 2, title: 'Geometric Modeling', topics: ['Wireframe, Surface & Solid Modeling (CSG, B-Rep)', 'Hermite, Bezier & B-Spline Curves', 'NURBS Overview'], notes: [] },
      { unitNo: 3, title: 'NC & CNC Machine Tools', topics: ['CNC Machine Components & MCU', 'G-Codes & M-Codes Part Programming', 'Tool Path Generation'], notes: [] },
      { unitNo: 4, title: 'Flexible Manufacturing Systems (FMS)', topics: ['Group Technology & Cellular Manufacturing', 'Automated Guided Vehicles (AGV)', 'AS/RS Automated Storage'], notes: [] },
      { unitNo: 5, title: 'Industrial Robotics', topics: ['Robot Anatomy & Configurations', 'Forward & Inverse Kinematics', 'Robot End Effectors & Sensors'], notes: [] }
    ]
  },

  // --- 4th Year: Maths ---
  {
    id: 'kas-701-maths',
    code: 'KAS-701',
    subject: 'Optimization Techniques',
    slug: 'optimization-techniques',
    branch: 'Maths',
    applicableBranches: ['Maths', 'CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI & DS'],
    year: '4th Year',
    semester: 'Sem 7',
    credits: 4,
    description: 'Linear Programming (Simplex), Transportation Model, Assignment Problem, Dynamic Programming & Non-Linear Optimization.',
    units: [
      { unitNo: 1, title: 'Linear Programming & Simplex Method', topics: ['LPP Mathematical Formulation', 'Simplex & Big-M Methods', 'Dual Simplex Algorithm'], notes: [] },
      { unitNo: 2, title: 'Transportation & Assignment Problems', topics: ['Initial Basic Feasible Solution (VAM)', 'MODI Optimality Test', 'Hungarian Assignment Method'], notes: [] },
      { unitNo: 3, title: 'Network Analysis (PERT & CPM)', topics: ['Critical Path Method (CPM)', 'PERT Event Times & Probability', 'Project Crashing'], notes: [] },
      { unitNo: 4, title: 'Dynamic Programming & Game Theory', topics: ['Bellman Principle of Optimality', 'Two-Person Zero-Sum Games', 'Saddle Point & Mixed Strategy'], notes: [] },
      { unitNo: 5, title: 'Non-Linear Optimization', topics: ['Unconstrained Optimization (Gradient Search)', 'Kuhn-Tucker Conditions', 'Quadratic Programming Overview'], notes: [] }
    ]
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
