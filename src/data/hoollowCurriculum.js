// ============================================================================
// PROFESSORVIRUS — HOOLLOW CURATED CURRICULUM DATABASE
// Production-grade structured learning paths with verified educational resources
// ============================================================================

export const HOOLLOW_GOALS = [
  {
    id: 'python-developer',
    title: 'Python Developer',
    desc: 'Learn Python from basics to advanced and build real projects.',
    category: 'Programming',
    iconType: 'python',
    bgLight: '#FFF5F3',
    borderColor: '#8B101D'
  },
  {
    id: 'web-development',
    title: 'Web Development',
    desc: 'Learn HTML, CSS, JavaScript and modern frameworks with real projects.',
    category: 'Full Stack',
    iconType: 'globe',
    bgLight: '#F0F7FF',
    borderColor: '#2563EB'
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    desc: 'Machine Learning, Deep Learning and AI with hands-on projects.',
    category: 'Artificial Intelligence',
    iconType: 'brain',
    bgLight: '#FAF5FF',
    borderColor: '#9333EA'
  },
  {
    id: 'data-science',
    title: 'Data Science',
    desc: 'Learn data analysis, visualization and build industry-ready projects.',
    category: 'Analytics',
    iconType: 'barchart',
    bgLight: '#FFFBEB',
    borderColor: '#D97706'
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    desc: 'Learn ethical hacking, network security and real-world tools.',
    category: 'Security',
    iconType: 'shield',
    bgLight: '#FFF7ED',
    borderColor: '#EA580C'
  },
  {
    id: 'app-development',
    title: 'App Development',
    desc: 'Build Android/iOS apps using modern tools and frameworks.',
    category: 'Mobile',
    iconType: 'smartphone',
    bgLight: '#F0FDFA',
    borderColor: '#0D9488'
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    desc: 'Learn AWS, Docker, Kubernetes and cloud deployment.',
    category: 'Cloud',
    iconType: 'cloud',
    bgLight: '#EEF2FF',
    borderColor: '#4F46E5'
  },
  {
    id: 'dsa-problem-solving',
    title: 'DSA & Problem Solving',
    desc: 'Improve problem solving skills for placements and interviews.',
    category: 'Algorithms',
    iconType: 'code',
    bgLight: '#FFF1F2',
    borderColor: '#E11D48'
  },
  {
    id: 'devops',
    title: 'DevOps',
    desc: 'Learn CI/CD, Linux, Docker and deployment workflows.',
    category: 'Infrastructure',
    iconType: 'settings',
    bgLight: '#EFF6FF',
    borderColor: '#1D4ED8'
  },
  {
    id: 'custom-goal',
    title: 'Custom Goal',
    desc: 'Tell us your goal and get a customized roadmap.',
    category: 'Personalized',
    iconType: 'target',
    bgLight: '#FEF2F2',
    borderColor: '#DC2626'
  }
];

export const HOOLLOW_PRESETS = {
  'Python Developer': {
    title: 'Python Developer Mastery Roadmap',
    summary: 'Master modern Python 3.12+, Object-Oriented Programming, automation scripting, unit testing, and scalable backend web APIs with FastAPI & Django.',
    totalHours: 120,
    phases: [
      {
        id: 'phase-1',
        name: 'Phase 1: Foundation & Python Primitives',
        description: 'Environment setup, clean virtual environments, data types, logic operators, and control flow.',
        duration: '3 Weeks',
        tasks: [
          {
            id: 'py-1',
            title: 'Python Environment, Virtual Envs & VS Code Setup',
            description: 'Configure Python 3.12+, set up isolated virtual environments using venv, configure formatting with Ruff & Black.',
            duration: '2 Hours',
            skills: ['Python 3', 'venv', 'pip', 'VS Code'],
            resources: {
              video: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
              notes: 'https://docs.python.org/3/tutorial/interpreter.html',
              practice: 'https://www.hackerrank.com/domains/python'
            }
          },
          {
            id: 'py-2',
            title: 'Variables, Type Casting & String Formatting',
            description: 'Deep dive into f-strings, string slicing, escape sequences, integer/float arithmetic, and type coercion.',
            duration: '3 Hours',
            skills: ['f-strings', 'String Slicing', 'Type Casting'],
            resources: {
              video: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
              notes: 'https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str',
              practice: 'https://leetcode.com/tag/string/'
            }
          },
          {
            id: 'py-3',
            title: 'Conditionals, Match-Case & Loop Constructs',
            description: 'Master if/elif/else conditions, for/while loops, enumerate(), zip(), break/continue, and pattern matching.',
            duration: '4 Hours',
            skills: ['Control Flow', 'Pattern Matching', 'enumerate()', 'zip()'],
            resources: {
              video: 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ',
              notes: 'https://docs.python.org/3/tutorial/controlflow.html',
              practice: 'https://leetcode.com/tag/array/'
            }
          },
          {
            id: 'py-4',
            title: 'Functions, Type Hints, *args & **kwargs',
            description: 'Define clean modular functions, type hints with typing module, default params, variable positional & keyword arguments.',
            duration: '4 Hours',
            skills: ['Functions', 'Type Annotations', '*args', '**kwargs'],
            resources: {
              video: 'https://www.youtube.com/watch?v=9Os0o3wzS_I',
              notes: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
              practice: 'https://exercism.org/tracks/python'
            }
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Phase 2: Core Concepts & Data Structures',
        description: 'Data collections, memory behaviors, list/dict comprehensions, file I/O, and OOP architecture.',
        duration: '4 Weeks',
        tasks: [
          {
            id: 'py-5',
            title: 'Lists, Tuples, Dictionaries & Sets In-Depth',
            description: 'Internal hashing mechanisms of dictionaries, set mathematical unions/intersections, tuples immutability, and nested comprehensions.',
            duration: '5 Hours',
            skills: ['Hash Maps', 'Sets', 'List Comprehensions'],
            resources: {
              video: 'https://www.youtube.com/watch?v=daefaLgNkw0',
              notes: 'https://docs.python.org/3/tutorial/datastructures.html',
              practice: 'https://leetcode.com/problemset/all/?topicSlugs=hash-table'
            }
          },
          {
            id: 'py-6',
            title: 'Object-Oriented Programming (OOP) & Dunder Methods',
            description: 'Classes, encapsulation, inheritance, polymorphism, @property, @classmethod, @staticmethod, and __repr__/__str__.',
            duration: '6 Hours',
            skills: ['OOP', 'Encapsulation', 'Dunder Methods', 'Dataclasses'],
            resources: {
              video: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM',
              notes: 'https://docs.python.org/3/tutorial/classes.html',
              practice: 'https://github.com/trekhleb/learn-python'
            }
          },
          {
            id: 'py-7',
            title: 'Robust File I/O, Context Managers & JSON Handling',
            description: 'Pathlib module, reading/writing files with "with" statements, CSV manipulation, and complex JSON parsing.',
            duration: '4 Hours',
            skills: ['Context Managers', 'Pathlib', 'JSON Serialization'],
            resources: {
              video: 'https://www.youtube.com/watch?v=Uh2ebFW8OYM',
              notes: 'https://docs.python.org/3/tutorial/inputoutput.html',
              practice: 'https://realpython.com/working-with-files-in-python/'
            }
          },
          {
            id: 'py-8',
            title: 'Exception Handling & Custom Error Hierarchies',
            description: 'Try/except/else/finally paradigms, raising built-in exceptions, creating custom domain exceptions, and logging module.',
            duration: '3 Hours',
            skills: ['Exceptions', 'Logging', 'Debugging'],
            resources: {
              video: 'https://www.youtube.com/watch?v=NIWwJbo-9_8',
              notes: 'https://docs.python.org/3/tutorial/errors.html',
              practice: 'https://docs.python.org/3/library/logging.html'
            }
          }
        ]
      },
      {
        id: 'phase-3',
        name: 'Phase 3: Real-World Projects & Automation',
        description: 'Build production CLI tools, web scraping crawlers, and API client pipelines.',
        duration: '4 Weeks',
        tasks: [
          {
            id: 'py-9',
            title: 'Project 1: Command Line Productivity Tool (Typer & SQLite)',
            description: 'Design and deploy a full-featured terminal task & expense manager with colored output and sqlite3 database.',
            duration: '8 Hours',
            skills: ['Typer', 'Argparse', 'SQLite3', 'Rich'],
            resources: {
              video: 'https://www.youtube.com/watch?v=0kF_3tZl6v4',
              notes: 'https://typer.tiangolo.com/',
              practice: 'https://github.com/tiangolo/typer'
            }
          },
          {
            id: 'py-10',
            title: 'Project 2: Web Scraping & Data Pipeline (BeautifulSoup & Requests)',
            description: 'Automate job listings extraction, HTML sanitization, rate-limiting, and automated CSV/Excel reporting.',
            duration: '8 Hours',
            skills: ['BeautifulSoup4', 'Requests', 'Data Pipelines'],
            resources: {
              video: 'https://www.youtube.com/watch?v=XVv6mJpFOb0',
              notes: 'https://beautiful-soup-4.readthedocs.io/en/latest/',
              practice: 'https://quotes.toscrape.com/'
            }
          }
        ]
      },
      {
        id: 'phase-4',
        name: 'Phase 4: Advanced Topics & Asynchronous Architecture',
        description: 'Asynchronous event loops, REST API services with FastAPI, Pydantic data validation, and automated pytest suites.',
        duration: '5 Weeks',
        tasks: [
          {
            id: 'py-11',
            title: 'Asynchronous Programming with asyncio & aiohttp',
            description: 'Event loop concurrency, coroutines, async/await syntax, asyncio.gather(), and non-blocking I/O.',
            duration: '6 Hours',
            skills: ['asyncio', 'Coroutines', 'Concurrency'],
            resources: {
              video: 'https://www.youtube.com/watch?v=2IW-QT9dUnc',
              notes: 'https://docs.python.org/3/library/asyncio.html',
              practice: 'https://realpython.com/async-io-python/'
            }
          },
          {
            id: 'py-12',
            title: 'High-Performance REST APIs with FastAPI & Pydantic',
            description: 'Build asynchronous microservices, dependency injection, Swagger documentation, and token-based authentication.',
            duration: '8 Hours',
            skills: ['FastAPI', 'Pydantic V2', 'REST APIs', 'JWT'],
            resources: {
              video: 'https://www.youtube.com/watch?v=tLKKmouUAMS',
              notes: 'https://fastapi.tiangolo.com/tutorial/',
              practice: 'https://github.com/tiangolo/fastapi'
            }
          },
          {
            id: 'py-13',
            title: 'Automated Unit & Integration Testing with pytest',
            description: 'Fixtures, parameterized test suites, monkeypatching, coverage reporting, and CI integration.',
            duration: '5 Hours',
            skills: ['pytest', 'Test Coverage', 'Mocking'],
            resources: {
              video: 'https://www.youtube.com/watch?v=byaxg00Gf9I',
              notes: 'https://docs.pytest.org/en/7.4.x/',
              practice: 'https://docs.pytest.org/en/stable/getting-started.html'
            }
          }
        ]
      },
      {
        id: 'phase-5',
        name: 'Phase 5: Career Preparation & Technical Interviews',
        description: 'Docker containerization, cloud deployment, GitHub open source portfolio, and algorithmic coding challenges.',
        duration: '4 Weeks',
        tasks: [
          {
            id: 'py-14',
            title: 'Containerize Python Apps with Docker & Docker Compose',
            description: 'Write lean multi-stage Dockerfiles, manage dependencies with pyproject.toml, and deploy to cloud platforms.',
            duration: '5 Hours',
            skills: ['Docker', 'Multi-stage builds', 'Cloud Deploy'],
            resources: {
              video: 'https://www.youtube.com/watch?v=0UG2x2iWerk',
              notes: 'https://docs.docker.com/language/python/',
              practice: 'https://hub.docker.com/'
            }
          },
          {
            id: 'py-15',
            title: 'Python Algorithmic Coding Interview Drills',
            description: 'Solve top Python data structure and algorithm patterns: two pointers, sliding window, binary search, tree traversals, and graphs.',
            duration: '10 Hours',
            skills: ['LeetCode', 'DSA', 'Time Complexity', 'Interviews'],
            resources: {
              video: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
              notes: 'https://neetcode.io/roadmap',
              practice: 'https://leetcode.com/studyplan/top-interview-150/'
            }
          }
        ]
      }
    ]
  },

  'Web Development': {
    title: 'Modern Full-Stack Web Development Roadmap',
    summary: 'From semantic HTML5 & responsive modern CSS to ES6+ JavaScript, React 18, Node.js, Express, databases, and production cloud deployment.',
    totalHours: 140,
    phases: [
      {
        id: 'phase-1',
        name: 'Phase 1: Web Foundations & Responsive UI',
        description: 'Semantic HTML5, CSS Flexbox & Grid, mobile-first design, accessibility, and modern CSS tokens.',
        duration: '3 Weeks',
        tasks: [
          {
            id: 'web-1',
            title: 'Semantic HTML5 & Accessibility Best Practices',
            description: 'Master semantic landmark tags, form elements, validation attributes, and screen-reader ARIA accessibility.',
            duration: '4 Hours',
            skills: ['HTML5', 'ARIA', 'Accessibility', 'SEO'],
            resources: {
              video: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
              notes: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
              practice: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'
            }
          },
          {
            id: 'web-2',
            title: 'CSS3 Flexbox, CSS Grid & Responsive Layouts',
            description: 'Master 1D Flexbox, 2D CSS Grid systems, CSS variables, clamp() fluid typography, and mobile-first media queries.',
            duration: '6 Hours',
            skills: ['Flexbox', 'CSS Grid', 'Media Queries', 'Responsive Design'],
            resources: {
              video: 'https://www.youtube.com/watch?v=1PnVor36_40',
              notes: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
              practice: 'https://flexboxfroggy.com/'
            }
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Phase 2: Modern JavaScript (ES6+ Deep Dive)',
        description: 'Closures, scope chain, event loop, asynchronous promises, fetch API, and prototype inheritance.',
        duration: '4 Weeks',
        tasks: [
          {
            id: 'web-3',
            title: 'Core JavaScript: Scope, Closures & Functional Methods',
            description: 'Deep dive into let/const lexical scoping, closures, map/filter/reduce, destructuring, and spread/rest operators.',
            duration: '6 Hours',
            skills: ['ES6+', 'Closures', 'Array Methods', 'Functional Programming'],
            resources: {
              video: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
              notes: 'https://javascript.info/',
              practice: 'https://www.codewars.com/'
            }
          },
          {
            id: 'web-4',
            title: 'Asynchronous JavaScript: Event Loop, Promises & Fetch',
            description: 'Understand the browser call stack, microtask queue, async/await syntax, error handling, and making HTTP requests.',
            duration: '6 Hours',
            skills: ['Event Loop', 'Promises', 'async/await', 'Fetch API'],
            resources: {
              video: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
              notes: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous',
              practice: 'https://jsonplaceholder.typicode.com/'
            }
          }
        ]
      },
      {
        id: 'phase-3',
        name: 'Phase 3: Frontend Architecture with React',
        description: 'Component lifecycles, Hooks, Context API, state management, Vite build tooling, and performance optimization.',
        duration: '4 Weeks',
        tasks: [
          {
            id: 'web-5',
            title: 'React Fundamentals: JSX, Props, State & Hooks',
            description: 'Build interactive user interfaces with functional components, useState, useEffect, and controlled forms.',
            duration: '8 Hours',
            skills: ['React', 'JSX', 'Hooks', 'Vite'],
            resources: {
              video: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
              notes: 'https://react.dev/learn',
              practice: 'https://react.dev/learn/tutorial-tic-tac-toe'
            }
          },
          {
            id: 'web-6',
            title: 'Advanced React: Custom Hooks, Context API & Performance',
            description: 'Manage application-level state, abstract reusable custom hooks, prevent unnecessary renders with useMemo & useCallback.',
            duration: '7 Hours',
            skills: ['Context API', 'Custom Hooks', 'useMemo', 'useCallback'],
            resources: {
              video: 'https://www.youtube.com/watch?v=TNhaISAUy68',
              notes: 'https://react.dev/reference/react',
              practice: 'https://github.com/alan2207/bulletproof-react'
            }
          }
        ]
      },
      {
        id: 'phase-4',
        name: 'Phase 4: Backend Microservices & Databases',
        description: 'Node.js, Express REST APIs, MongoDB Mongoose schema design, JWT authentication, and secure cookies.',
        duration: '4 Weeks',
        tasks: [
          {
            id: 'web-7',
            title: 'Node.js & Express RESTful API Engineering',
            description: 'Server routing, middleware chains, input sanitization, error handlers, and file uploads.',
            duration: '8 Hours',
            skills: ['Node.js', 'Express', 'Middleware', 'REST'],
            resources: {
              video: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
              notes: 'https://expressjs.com/en/guide/routing.html',
              practice: 'https://github.com/goldbergyoni/nodebestpractices'
            }
          },
          {
            id: 'web-8',
            title: 'Databases: MongoDB Atlas, Mongoose & JWT Security',
            description: 'NoSQL document modeling, indexing, relations, bcrypt password hashing, and token authorization.',
            duration: '8 Hours',
            skills: ['MongoDB', 'Mongoose', 'JWT', 'Security'],
            resources: {
              video: 'https://www.youtube.com/watch?v=2ZUXPNq4m0g',
              notes: 'https://mongoosejs.com/docs/guide.html',
              practice: 'https://jwt.io/introduction'
            }
          }
        ]
      },
      {
        id: 'phase-5',
        name: 'Phase 5: Full-Stack Capstone & Production Deployment',
        description: 'Deploy full-stack apps to Vercel/Render, CI/CD automation, SEO optimization, and frontend engineering interviews.',
        duration: '3 Weeks',
        tasks: [
          {
            id: 'web-9',
            title: 'Capstone: Production SaaS Platform with Authentication',
            description: 'Build and deploy a complete full-stack web application with responsive UI, dashboard, analytics, and CI/CD pipelines.',
            duration: '14 Hours',
            skills: ['Full Stack', 'Vercel', 'Render', 'CI/CD'],
            resources: {
              video: 'https://www.youtube.com/watch?v=cT_UZYj_yvU',
              notes: 'https://vercel.com/docs',
              practice: 'https://github.com/'
            }
          }
        ]
      }
    ]
  }
};

/**
 * Get roadmap by goal name or generate default
 */
export function getRoadmapForGoal(goalName, customGoal, level, dailyStudyTime, timeline, learningStyle) {
  const target = (goalName === 'Custom Goal' && customGoal) ? customGoal : goalName;
  if (HOOLLOW_PRESETS[target]) {
    const preset = JSON.parse(JSON.stringify(HOOLLOW_PRESETS[target]));
    preset.targetGoal = target;
    preset.level = level || 'Beginner';
    preset.dailyStudyTime = dailyStudyTime || '1 hour';
    preset.timeline = timeline || '6 months';
    preset.learningStyle = learningStyle || 'Video + Notes + Practice';
    preset.completionCriteria = [
      'Complete all 5 structured phases',
      'Solve at least 25 practice coding exercises',
      'Deploy 1 capstone project with public GitHub repository',
      'Pass technical mock interview evaluation'
    ];
    preset.nextRecommendedAction = `Start Phase 1: Task 1 ("${preset.phases[0]?.tasks[0]?.title || 'Getting Started'}")`;
    return preset;
  }

  // Generic structured roadmap for other goals
  return {
    title: `${target} Professional Mastery Roadmap`,
    targetGoal: target,
    level: level || 'Beginner',
    dailyStudyTime: dailyStudyTime || '1 hour',
    timeline: timeline || '6 months',
    learningStyle: learningStyle || 'Video + Notes + Practice',
    summary: `Personalized industry blueprint for ${target}, tailored for ${level || 'Beginner'} with ${dailyStudyTime || '1 hour'} daily study time.`,
    totalHours: 120,
    phases: [
      {
        id: 'phase-1',
        name: 'Phase 1: Foundations & Core Tooling',
        description: `Essential prerequisites, installation, environment setup, and command-line mastery for ${target}.`,
        duration: '3 Weeks',
        tasks: [
          {
            id: 'task-1',
            title: `${target} Environment Setup & Tooling`,
            description: `Set up the latest compilers, runtimes, package managers, and editors optimized for ${target}.`,
            duration: '3 Hours',
            skills: ['Tooling', 'CLI', 'Editor Setup'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' beginner tutorial'),
              notes: 'https://devdocs.io/',
              practice: 'https://github.com/'
            }
          },
          {
            id: 'task-2',
            title: `Fundamental Concepts & Primitives of ${target}`,
            description: `Master fundamental syntax, memory models, primitives, and logical structure.`,
            duration: '5 Hours',
            skills: ['Fundamentals', 'Syntax', 'Architecture'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' crash course'),
              notes: 'https://roadmap.sh/',
              practice: 'https://leetcode.com/'
            }
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Phase 2: Core Architecture & Patterns',
        description: `Intermediate abstractions, object modeling, data pipelines, and design patterns.`,
        duration: '4 Weeks',
        tasks: [
          {
            id: 'task-3',
            title: `Architectural Design Patterns & Clean Code`,
            description: `Learn industry standard design patterns, modularity, and error resilience.`,
            duration: '6 Hours',
            skills: ['Design Patterns', 'Architecture', 'Clean Code'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' architecture best practices'),
              notes: 'https://refactoring.guru/',
              practice: 'https://github.com/'
            }
          }
        ]
      },
      {
        id: 'phase-3',
        name: 'Phase 3: Real-World Hands-on Projects',
        description: `Apply theoretical knowledge into functional, standalone applications with persistence.`,
        duration: '4 Weeks',
        tasks: [
          {
            id: 'task-4',
            title: `Capstone Project: Production Application`,
            description: `Build and document an end-to-end practical solution solving real user problems in ${target}.`,
            duration: '10 Hours',
            skills: ['Portfolio Project', 'Testing', 'Clean Code'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' project tutorial'),
              notes: 'https://github.com/practical-tutorials/project-based-learning',
              practice: 'https://github.com/'
            }
          }
        ]
      },
      {
        id: 'phase-4',
        name: 'Phase 4: Advanced Specialization & Optimization',
        description: `Performance tuning, security compliance, scalability, and asynchronous systems.`,
        duration: '4 Weeks',
        tasks: [
          {
            id: 'task-5',
            title: `Performance Profiling & Scalability`,
            description: `Benchmark latency, analyze memory usage, and optimize critical system paths.`,
            duration: '8 Hours',
            skills: ['Optimization', 'Scalability', 'Benchmarking'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' advanced topics'),
              notes: 'https://github.com/donnemartin/system-design-primer',
              practice: 'https://leetcode.com/'
            }
          }
        ]
      },
      {
        id: 'phase-5',
        name: 'Phase 5: Career Launch & Interview Mastery',
        description: `Interview problem solving drills, open source contributions, and portfolio polish.`,
        duration: '3 Weeks',
        tasks: [
          {
            id: 'task-6',
            title: `Technical Interview Drills & Behavioral Preparation`,
            description: `Practice mock technical questions, system design walkthroughs, and portfolio showcase.`,
            duration: '10 Hours',
            skills: ['Interviews', 'Live Coding', 'Portfolio'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' interview questions'),
              notes: 'https://www.interviewbit.com/',
              practice: 'https://leetcode.com/'
            }
          }
        ]
      }
    ],
    completionCriteria: [
      'Complete all 5 structured phases',
      'Build 1 portfolio project',
      'Pass placement interview preparation drills'
    ],
    nextRecommendedAction: `Start Phase 1: Task 1 ("${target} Environment Setup & Tooling")`
  };
}
