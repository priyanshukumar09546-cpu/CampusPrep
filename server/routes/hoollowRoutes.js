// ============================================================================
// PROFESSORVIRUS — HOOLLOW AI ROADMAP GENERATOR ROUTER
// Production AI learning path engine with Gemini / OpenAI integration & fallback
// ============================================================================

import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Mongoose Schema for Saved Roadmaps (when MongoDB is active)
const HoollowRoadmapSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  goal: { type: String, required: true },
  customGoal: { type: String, default: '' },
  level: { type: String, default: 'Beginner' },
  dailyStudyTime: { type: String, default: '1 hour' },
  timeline: { type: String, default: '6 months' },
  learningStyle: { type: String, default: 'Video + Notes + Practice' },
  roadmapData: { type: mongoose.Schema.Types.Mixed, required: true },
  completedTaskIds: { type: [String], default: [] },
  xpEarned: { type: Number, default: 0 },
  streakCount: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: null },
  activityDates: { type: [String], default: [] },
  unlockedBadgeIds: { type: [String], default: [] }
}, { timestamps: true });

HoollowRoadmapSchema.index({ userId: 1, updatedAt: -1 });

let HoollowRoadmapModel = null;
try {
  HoollowRoadmapModel = mongoose.model('HoollowRoadmap', HoollowRoadmapSchema);
} catch {
  HoollowRoadmapModel = mongoose.models.HoollowRoadmap;
}

// In-memory / file fallback for roadmaps when database is reconnecting
const memoryRoadmaps = new Map();

// Candidate Gemini Model List
const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-pro'
];

/**
 * Call Gemini with model failover
 */
async function callGeminiForRoadmap(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 10) return null;

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });
        const result = await model.generateContent(userPrompt);
        const text = result?.response?.text();
        if (text && text.trim().length > 20) {
          return JSON.parse(text);
        }
      } catch (err) {
        console.warn(`[HOOLLOW GEMINI FAILOVER: ${modelName}]`, err.message?.slice(0, 100));
      }
    }
  } catch (e) {
    console.warn('[HOOLLOW GEMINI IMPORT ERROR]', e.message);
  }
  return null;
}

/**
 * Call OpenAI if available
 */
async function callOpenAIForRoadmap(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 10) return null;

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2
    });
    const text = response?.choices?.[0]?.message?.content;
    if (text) {
      return JSON.parse(text);
    }
  } catch (err) {
    console.warn('[HOOLLOW OPENAI ERROR]', err.message?.slice(0, 100));
  }
  return null;
}

/**
 * Curated High-Quality Fallback Generator
 * Ensures students ALWAYS receive a comprehensive, structured, verified roadmap
 */
function generateStructuredCurriculum(goal, customGoal, level, dailyStudyTime, timeline, learningStyle) {
  const target = (goal === 'Custom Goal' && customGoal) ? customGoal : goal;
  const levelText = level || 'Beginner';
  const studyHours = dailyStudyTime || '1 hour';
  const timelineDuration = timeline || '6 months';

  const goalRoadmaps = {
    'Python Developer': {
      title: 'Python Developer Mastery Roadmap',
      summary: `Comprehensive step-by-step path to master Python from fundamentals to production-grade applications, covering modern syntax, OOP, testing, data handling, and backend frameworks. Tailored for ${levelText} level with ${studyHours} daily commitment over ${timelineDuration}.`,
      totalHours: 120,
      phases: [
        {
          id: 'phase-1',
          name: 'Foundation & Environment',
          description: 'Master core syntax, IDE setup, data types, and logical flow control.',
          duration: '3 Weeks',
          tasks: [
            {
              id: 'py-task-1',
              title: 'Python Setup, Virtual Environments & REPL',
              description: 'Install Python 3.12+, configure VS Code with Ruff/Black linters, and master venv & pip package management.',
              duration: '2 Hours',
              skills: ['Python 3', 'pip', 'venv', 'VS Code'],
              resources: {
                video: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
                notes: 'https://docs.python.org/3/tutorial/interpreter.html',
                practice: 'https://www.hackerrank.com/domains/python'
              }
            },
            {
              id: 'py-task-2',
              title: 'Variables, Primitive Types & String Manipulation',
              description: 'Understand integers, floats, booleans, string formatting (f-strings), slicing, and immutability.',
              duration: '3 Hours',
              skills: ['f-strings', 'String Methods', 'Type Casting'],
              resources: {
                video: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
                notes: 'https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str',
                practice: 'https://leetcode.com/tag/string/'
              }
            },
            {
              id: 'py-task-3',
              title: 'Conditionals, Pattern Matching & Loops',
              description: 'Master if/elif/else, while loops, for loops with range(), enumerate(), zip(), and Python 3.10 match-case.',
              duration: '4 Hours',
              skills: ['Control Flow', 'match-case', 'enumerate()', 'zip()'],
              resources: {
                video: 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ',
                notes: 'https://docs.python.org/3/tutorial/controlflow.html',
                practice: 'https://leetcode.com/tag/array/'
              }
            },
            {
              id: 'py-task-4',
              title: 'Functions, Scopes, *args & **kwargs',
              description: 'Define robust functions with type hints, default arguments, variable positional/keyword arguments, and docstrings.',
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
          name: 'Core Concepts & Data Structures',
          description: 'Harness built-in collections, comprehensions, file I/O, and exception safety.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'py-task-5',
              title: 'Lists, Tuples, Sets & Dictionaries In-Depth',
              description: 'Time complexities, memory layouts, dictionary hashing, set operations (union, intersection), and comprehensions.',
              duration: '5 Hours',
              skills: ['Lists', 'Dicts', 'Sets', 'Time Complexity'],
              resources: {
                video: 'https://www.youtube.com/watch?v=daefaLgNkw0',
                notes: 'https://docs.python.org/3/tutorial/datastructures.html',
                practice: 'https://leetcode.com/problemset/all/?topicSlugs=hash-table'
              }
            },
            {
              id: 'py-task-6',
              title: 'Object-Oriented Programming (OOP) in Python',
              description: 'Classes, dunder methods (__init__, __str__, __repr__), inheritance, composition, property decorators, and dataclasses.',
              duration: '6 Hours',
              skills: ['OOP', 'Inheritance', 'Dataclasses', 'Dunder Methods'],
              resources: {
                video: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM',
                notes: 'https://docs.python.org/3/tutorial/classes.html',
                practice: 'https://github.com/trekhleb/learn-python'
              }
            },
            {
              id: 'py-task-7',
              title: 'File I/O, Context Managers & JSON Serialization',
              description: 'Safe file handling with "with" statement, reading/writing text, CSVs, and nested JSON payloads.',
              duration: '4 Hours',
              skills: ['Context Managers', 'JSON', 'CSV', 'pathlib'],
              resources: {
                video: 'https://www.youtube.com/watch?v=Uh2ebFW8OYM',
                notes: 'https://docs.python.org/3/tutorial/inputoutput.html',
                practice: 'https://realpython.com/working-with-files-in-python/'
              }
            },
            {
              id: 'py-task-8',
              title: 'Error Handling & Custom Exceptions',
              description: 'Try/except/else/finally blocks, hierarchy of built-in exceptions, and raising meaningful custom errors.',
              duration: '3 Hours',
              skills: ['Exception Handling', 'Debugging', 'Logging'],
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
          name: 'Real-World Projects & Automation',
          description: 'Build production CLI tools, web scraping crawlers, and API integrations.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'py-task-9',
              title: 'Project 1: Command Line Productivity Tool (Typer/Argparse)',
              description: 'Build a full-featured terminal task & expense tracker with colored output and sqlite3 persistence.',
              duration: '8 Hours',
              skills: ['Typer', 'Argparse', 'Rich', 'SQLite3'],
              resources: {
                video: 'https://www.youtube.com/watch?v=0kF_3tZl6v4',
                notes: 'https://typer.tiangolo.com/',
                practice: 'https://github.com/tiangolo/typer'
              }
            },
            {
              id: 'py-task-10',
              title: 'Project 2: Web Scraping & Data Pipeline (BeautifulSoup & Requests)',
              description: 'Scrape tech job openings, sanitize HTML, extract salary ranges, and export automated CSV analytics.',
              duration: '8 Hours',
              skills: ['Requests', 'BeautifulSoup4', 'Data Cleaning'],
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
          name: 'Advanced Topics & Modern Ecosystem',
          description: 'Asynchronous programming (asyncio), REST APIs with FastAPI, and unit testing.',
          duration: '5 Weeks',
          tasks: [
            {
              id: 'py-task-11',
              title: 'Asynchronous Python with asyncio & aiohttp',
              description: 'Event loops, coroutines, async/await syntax, asyncio.gather(), and concurrent HTTP queries.',
              duration: '6 Hours',
              skills: ['asyncio', 'Coroutines', 'Event Loops', 'Concurrency'],
              resources: {
                video: 'https://www.youtube.com/watch?v=2IW-QT9dUnc',
                notes: 'https://docs.python.org/3/library/asyncio.html',
                practice: 'https://realpython.com/async-io-python/'
              }
            },
            {
              id: 'py-task-12',
              title: 'Production REST APIs with FastAPI & Pydantic',
              description: 'Build high-performance asynchronous microservices with automatic OpenAPI/Swagger documentation.',
              duration: '8 Hours',
              skills: ['FastAPI', 'Pydantic V2', 'REST APIs', 'Swagger UI'],
              resources: {
                video: 'https://www.youtube.com/watch?v=tLKKmouUAMS',
                notes: 'https://fastapi.tiangolo.com/tutorial/',
                practice: 'https://github.com/tiangolo/fastapi'
              }
            },
            {
              id: 'py-task-13',
              title: 'Automated Testing with pytest & Mocking',
              description: 'Fixtures, parameterization, mocking external API calls, coverage metrics, and continuous integration.',
              duration: '5 Hours',
              skills: ['pytest', 'Unit Testing', 'Mocking', 'CI/CD'],
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
          name: 'Career Preparation & Production Engineering',
          description: 'Docker containerization, cloud deployment, GitHub portfolio, and technical interview algorithms.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'py-task-14',
              title: 'Containerize Python Apps with Docker',
              description: 'Write optimized multi-stage Dockerfiles, manage requirements.txt vs poetry/uv, and deploy to cloud.',
              duration: '5 Hours',
              skills: ['Docker', 'Multi-stage builds', 'Cloud Deploy'],
              resources: {
                video: 'https://www.youtube.com/watch?v=0UG2x2iWerk',
                notes: 'https://docs.docker.com/language/python/',
                practice: 'https://hub.docker.com/'
              }
            },
            {
              id: 'py-task-15',
              title: 'Python Technical Interview Coding Drills',
              description: 'Master top 50 Python DSA problems: two pointers, sliding window, binary search, tree traversals, and graphs.',
              duration: '10 Hours',
              skills: ['LeetCode', 'DSA', 'Algorithm Complexity', 'Interviews'],
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
      summary: `Industry-standard roadmap covering modern semantic HTML5, CSS3/Tailwind, JavaScript ES6+, React 18+, Node.js/Express, relational/document databases, authentication, and full-stack cloud deployment. Customized for ${levelText} level with ${studyHours} daily study time.`,
      totalHours: 140,
      phases: [
        {
          id: 'phase-1',
          name: 'Web Foundation (HTML5, Modern CSS & Responsive Design)',
          description: 'Build responsive, accessible, pixel-perfect user interfaces.',
          duration: '3 Weeks',
          tasks: [
            {
              id: 'web-task-1',
              title: 'Semantic HTML5, DOM Structure & Web Accessibility (a11y)',
              description: 'Master semantic elements, accessibility attributes, form validation, and SEO best practices.',
              duration: '3 Hours',
              skills: ['HTML5', 'ARIA', 'Accessibility', 'SEO'],
              resources: {
                video: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
                notes: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                practice: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'
              }
            },
            {
              id: 'web-task-2',
              title: 'Modern CSS3, Flexbox, CSS Grid & Responsive Typography',
              description: 'Master 1D Flexbox layouts, 2D Grid systems, custom properties (CSS variables), and media queries.',
              duration: '5 Hours',
              skills: ['Flexbox', 'CSS Grid', 'Media Queries', 'CSS Variables'],
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
          name: 'Modern JavaScript (ES6+ Deep Dive)',
          description: 'Master closures, async/await, DOM events, fetch API, and prototype inheritance.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'web-task-3',
              title: 'JavaScript Core: Scope, Closures, Hoisting & Array Methods',
              description: 'Deep dive into map, filter, reduce, destructuring, rest/spread operators, and lexical scope.',
              duration: '6 Hours',
              skills: ['ES6+', 'Closures', 'Higher-Order Functions'],
              resources: {
                video: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                notes: 'https://javascript.info/',
                practice: 'https://www.codewars.com/'
              }
            },
            {
              id: 'web-task-4',
              title: 'Asynchronous JavaScript: Event Loop, Promises & Fetch API',
              description: 'Understand the microtask queue, call stack, async/await patterns, error handling, and RESTful API calls.',
              duration: '6 Hours',
              skills: ['Promises', 'async/await', 'Event Loop', 'Fetch API'],
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
          name: 'Modern Frontend with React & State Management',
          description: 'Component architecture, Hooks, Context API, Tailwind CSS, and performance optimization.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'web-task-5',
              title: 'React Fundamentals: JSX, Props, State & Component Lifecycle',
              description: 'Build declarative UIs with functional components, useState, useEffect, and controlled inputs.',
              duration: '8 Hours',
              skills: ['React', 'JSX', 'Hooks', 'Vite'],
              resources: {
                video: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
                notes: 'https://react.dev/learn',
                practice: 'https://react.dev/learn/tutorial-tic-tac-toe'
              }
            },
            {
              id: 'web-task-6',
              title: 'Advanced React: Custom Hooks, Context, useMemo & useCallback',
              description: 'Manage global application state, prevent unnecessary re-renders, and abstract reusable hooks.',
              duration: '7 Hours',
              skills: ['Context API', 'Custom Hooks', 'React Performance'],
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
          name: 'Backend Architecture & Databases (Node.js, Express & MongoDB/Postgres)',
          description: 'Build secure, scalable RESTful microservices, authentication with JWT, and database indexing.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'web-task-7',
              title: 'Node.js & Express REST API Server Architecture',
              description: 'Express middleware, routing, CORS, input sanitization, error handling middleware, and environment variables.',
              duration: '7 Hours',
              skills: ['Node.js', 'Express', 'Middleware', 'REST'],
              resources: {
                video: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
                notes: 'https://expressjs.com/en/guide/routing.html',
                practice: 'https://github.com/goldbergyoni/nodebestpractices'
              }
            },
            {
              id: 'web-task-8',
              title: 'Databases: Schema Design, Mongoose / Prisma ORM & JWT Auth',
              description: 'Database relationships, indexing, bcrypt password hashing, HTTP-only cookies, and JWT token authorization.',
              duration: '8 Hours',
              skills: ['MongoDB', 'PostgreSQL', 'JWT', 'Authentication'],
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
          name: 'Full-Stack Capstone & Cloud Production Deployment',
          description: 'Deploy full-stack apps to Vercel/Render, set up CI/CD GitHub Actions, and prepare portfolio projects.',
          duration: '3 Weeks',
          tasks: [
            {
              id: 'web-task-9',
              title: 'Capstone Project: Production SaaS Application',
              description: 'Build and deploy a complete full-stack web application with user auth, dashboard, analytics, and responsive design.',
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
    },

    'AI/ML Engineer': {
      title: 'AI & Machine Learning Engineer Roadmap',
      summary: `Master modern Artificial Intelligence: Mathematics, Python for Data Science, classical Machine Learning, Deep Learning (PyTorch), Natural Language Processing, Computer Vision, and Generative AI/LLMs. Designed for ${levelText} level with ${studyHours}/day.`,
      totalHours: 150,
      phases: [
        {
          id: 'phase-1',
          name: 'Math Foundation & Scientific Python',
          description: 'Linear algebra, calculus, probability, NumPy, Pandas, and data visualization.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'aiml-task-1',
              title: 'Linear Algebra & Multivariable Calculus for ML',
              description: 'Vectors, matrices, dot products, eigenvalues, gradients, partial derivatives, and matrix calculus.',
              duration: '6 Hours',
              skills: ['Linear Algebra', 'Calculus', 'Gradients'],
              resources: {
                video: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
                notes: 'https://www.3blue1brown.com/topics/linear-algebra',
                practice: 'https://www.khanacademy.org/math/linear-algebra'
              }
            },
            {
              id: 'aiml-task-2',
              title: 'NumPy Vectorization, Pandas DataFrames & Matplotlib/Seaborn',
              description: 'Array broadcasting, tensor manipulation, data cleaning, aggregation, exploratory data analysis (EDA).',
              duration: '6 Hours',
              skills: ['NumPy', 'Pandas', 'Data Analysis', 'Seaborn'],
              resources: {
                video: 'https://www.youtube.com/watch?v=vmEHCJofslg',
                notes: 'https://pandas.pydata.org/docs/getting_started/index.html',
                practice: 'https://www.kaggle.com/learn/pandas'
              }
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Classical Machine Learning (Scikit-Learn)',
          description: 'Supervised & unsupervised algorithms, feature engineering, and model evaluation.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'aiml-task-3',
              title: 'Supervised Learning: Regression & Classification Models',
              description: 'Linear/Logistic regression, Decision Trees, Random Forests, Gradient Boosting (XGBoost/LightGBM).',
              duration: '8 Hours',
              skills: ['Scikit-Learn', 'XGBoost', 'Classification', 'Regression'],
              resources: {
                video: 'https://www.youtube.com/watch?v=7eh4d6sabA0',
                notes: 'https://scikit-learn.org/stable/user_guide.html',
                practice: 'https://www.kaggle.com/competitions/titanic'
              }
            },
            {
              id: 'aiml-task-4',
              title: 'Cross-Validation, Regularization & Hyperparameter Tuning',
              description: 'L1/L2 regularization (Lasso/Ridge), ROC-AUC, F1-Score, confusion matrix, GridSearchCV and Optuna.',
              duration: '6 Hours',
              skills: ['Model Evaluation', 'Optuna', 'Cross-Validation'],
              resources: {
                video: 'https://www.youtube.com/watch?v=TIgfjmp-4Wg',
                notes: 'https://scikit-learn.org/stable/modules/cross_validation.html',
                practice: 'https://www.kaggle.com/'
              }
            }
          ]
        },
        {
          id: 'phase-3',
          name: 'Deep Learning & Neural Networks (PyTorch)',
          description: 'Perceptrons, backpropagation, CNNs for vision, RNNs/LSTMs, and PyTorch training loops.',
          duration: '4 Weeks',
          tasks: [
            {
              id: 'aiml-task-5',
              title: 'Neural Networks & PyTorch Fundamentals',
              description: 'Tensors, autograd, forward pass, loss functions (CrossEntropy, MSE), optimizers (Adam, SGD).',
              duration: '8 Hours',
              skills: ['PyTorch', 'Backpropagation', 'Tensors', 'Autograd'],
              resources: {
                video: 'https://www.youtube.com/watch?v=V_xro1bcAuA',
                notes: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
                practice: 'https://www.learnpytorch.io/'
              }
            },
            {
              id: 'aiml-task-6',
              title: 'Convolutional Neural Networks (CNNs) & Computer Vision',
              description: 'Kernels, pooling, ResNet architectures, transfer learning with torchvision, and image classification.',
              duration: '8 Hours',
              skills: ['CNNs', 'ResNet', 'Transfer Learning', 'Computer Vision'],
              resources: {
                video: 'https://www.youtube.com/watch?v=IA3WxTTPXqQ',
                notes: 'https://cs231n.github.io/',
                practice: 'https://www.kaggle.com/competitions/dogs-vs-cats'
              }
            }
          ]
        },
        {
          id: 'phase-4',
          name: 'Transformers, NLP & Modern LLMs',
          description: 'Self-attention mechanism, Hugging Face ecosystem, embeddings, and fine-tuning.',
          duration: '5 Weeks',
          tasks: [
            {
              id: 'aiml-task-7',
              title: 'The Transformer Architecture & Self-Attention Explained',
              description: 'Attention Is All You Need: queries, keys, values, multi-head attention, positional encodings, and BERT vs GPT.',
              duration: '8 Hours',
              skills: ['Transformers', 'Self-Attention', 'NLP', 'Hugging Face'],
              resources: {
                video: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
                notes: 'https://jalammar.github.io/illustrated-transformer/',
                practice: 'https://huggingface.co/learn/nlp-course'
              }
            },
            {
              id: 'aiml-task-8',
              title: 'Generative AI, Retrieval Augmented Generation (RAG) & Vector DBs',
              description: 'Build RAG pipelines with LangChain/LlamaIndex, chunking, dense vector embeddings, and ChromaDB/Pinecone.',
              duration: '9 Hours',
              skills: ['RAG', 'Vector Embeddings', 'LangChain', 'LLMs'],
              resources: {
                video: 'https://www.youtube.com/watch?v=tcqEUSncCu8',
                notes: 'https://python.langchain.com/docs/get_started/introduction',
                practice: 'https://github.com/run-llama/llama_index'
              }
            }
          ]
        },
        {
          id: 'phase-5',
          name: 'MLOps & Model Deployment in Production',
          description: 'Serve models with FastAPI, ONNX runtime, Docker containerization, and monitoring.',
          duration: '3 Weeks',
          tasks: [
            {
              id: 'aiml-task-9',
              title: 'Model Deployment, FastAPI Inference API & MLOps',
              description: 'Deploy PyTorch/ONNX models into containerized microservices with sub-50ms inference latency.',
              duration: '7 Hours',
              skills: ['MLOps', 'FastAPI', 'ONNX', 'Model Deployment'],
              resources: {
                video: 'https://www.youtube.com/watch?v=h5wLuVDr0oc',
                notes: 'https://madewithml.com/',
                practice: 'https://github.com/GokuMohandas/Made-With-ML'
              }
            }
          ]
        }
      ]
    }
  };

  // Generic generator for other goals or custom goals
  const defaultRoadmap = {
    title: `${target} Professional Roadmap`,
    summary: `Structured mastery blueprint designed for ${levelText} students targeting ${target}. Features step-by-step phases, verified industry resources, hands-on portfolio projects, and interview preparation for ${studyHours} daily study time over ${timelineDuration}.`,
    totalHours: 120,
    phases: [
      {
        id: 'phase-1',
        name: 'Phase 1: Foundation & Prerequisite Setup',
        description: `Core primitives, environment configuration, command-line proficiency, and foundational tools for ${target}.`,
        duration: '3 Weeks',
        tasks: [
          {
            id: 'task-gen-1',
            title: `${target} Environment Setup & Tooling`,
            description: `Install compilers/runtimes, configure code editor, git version control, and shell automation for ${target}.`,
            duration: '3 Hours',
            skills: ['Git', 'CLI', 'Editor Setup', 'Tooling'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' beginner tutorial'),
              notes: 'https://devdocs.io/',
              practice: 'https://github.com/'
            }
          },
          {
            id: 'task-gen-2',
            title: `Core Fundamentals & Essential Syntax of ${target}`,
            description: `Understand the fundamental building blocks, memory models, data structures, and core principles.`,
            duration: '5 Hours',
            skills: ['Syntax', 'Architecture', 'Data Types'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' fundamentals crash course'),
              notes: 'https://roadmap.sh/',
              practice: 'https://leetcode.com/'
            }
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Phase 2: Core Concepts & Architectural Patterns',
        description: `Dive deep into idioms, design patterns, testing strategies, and intermediate concepts of ${target}.`,
        duration: '4 Weeks',
        tasks: [
          {
            id: 'task-gen-3',
            title: `Design Patterns & Best Practices in ${target}`,
            description: `Architect modular, clean, and maintainable software using proven design patterns and SOLID principles.`,
            duration: '6 Hours',
            skills: ['Design Patterns', 'Modular Code', 'Architecture'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' design patterns best practices'),
              notes: 'https://refactoring.guru/design-patterns',
              practice: 'https://github.com/'
            }
          },
          {
            id: 'task-gen-4',
            title: `Data Structures & Performance Optimization`,
            description: `Analyze algorithmic complexity, memory profiling, latency optimization, and concurrency primitives.`,
            duration: '6 Hours',
            skills: ['Optimization', 'Data Structures', 'Profiling'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' performance optimization'),
              notes: 'https://neetcode.io/',
              practice: 'https://leetcode.com/'
            }
          }
        ]
      },
      {
        id: 'phase-3',
        name: 'Phase 3: Hands-on Real World Projects',
        description: `Apply your knowledge to build end-to-end, industry-grade projects solving real practical problems.`,
        duration: '4 Weeks',
        tasks: [
          {
            id: 'task-gen-5',
            title: `Capstone Project 1: Production Application Architecture`,
            description: `Plan, code, and test a standalone production-ready system featuring authentication, persistence, and error safety.`,
            duration: '10 Hours',
            skills: ['Full Project', 'Testing', 'Clean Architecture'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' project build tutorial'),
              notes: 'https://github.com/practical-tutorials/project-based-learning',
              practice: 'https://github.com/'
            }
          }
        ]
      },
      {
        id: 'phase-4',
        name: 'Phase 4: Advanced Specialization & System Design',
        description: `Scalability, security compliance, cloud deployment, and high-load architecture.`,
        duration: '4 Weeks',
        tasks: [
          {
            id: 'task-gen-6',
            title: `High Scalability & Distributed Systems for ${target}`,
            description: `Caching, load balancing, asynchronous queues, microservices, and database clustering.`,
            duration: '8 Hours',
            skills: ['System Design', 'Scalability', 'Microservices'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' system design interview'),
              notes: 'https://github.com/donnemartin/system-design-primer',
              practice: 'https://bytebytego.com/'
            }
          }
        ]
      },
      {
        id: 'phase-5',
        name: 'Phase 5: Career Launch, Portfolio & Technical Interviews',
        description: `Prepare for FAANG and tier-1 product company technical interviews, open-source contributions, and portfolio polish.`,
        duration: '3 Weeks',
        tasks: [
          {
            id: 'task-gen-7',
            title: `Technical Interview Drills & Behavioral Preparation`,
            description: `Mock interviews, live problem solving drills, STAR method behavioral answers, and resume optimization.`,
            duration: '10 Hours',
            skills: ['Interviews', 'Live Coding', 'STAR Method', 'Portfolio'],
            resources: {
              video: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(target + ' interview questions and answers'),
              notes: 'https://www.interviewbit.com/',
              practice: 'https://leetcode.com/'
            }
          }
        ]
      }
    ]
  };

  const selected = goalRoadmaps[target] || defaultRoadmap;

  // Add metadata & criteria
  return {
    id: 'roadmap_' + crypto.randomUUID().slice(0, 8),
    targetGoal: target,
    level: levelText,
    dailyStudyTime: studyHours,
    timeline: timelineDuration,
    learningStyle: learningStyle || 'Video + Notes + Practice',
    title: selected.title,
    summary: selected.summary,
    totalHours: selected.totalHours || 120,
    generatedAt: new Date().toISOString(),
    aiEngine: 'ProfessorVirus Curated AI Synthesizer v3.2',
    phases: selected.phases,
    handsOnProjects: [
      {
        name: `${target} Portfolio Showcase`,
        description: `Comprehensive project proving competency in ${target} with clean commits, automated tests, and live production deployment.`
      }
    ],
    completionCriteria: [
      'Complete all 5 structured learning phases',
      'Solve at least 25 practice challenges',
      'Deploy 1 capstone project with public GitHub repository',
      'Pass the final technical evaluation quiz'
    ],
    nextRecommendedAction: `Start Phase 1: Task 1 ("${selected.phases[0]?.tasks[0]?.title || 'Getting Started'}")`
  };
}

/**
 * Express Router Factory for HOOLLOW
 */
export function createHoollowRouter({ isDbConnected, verifyJwtToken } = {}) {
  const router = express.Router();

  // Middleware to extract user if available
  const getUserOptional = (req, res, next) => {
    try {
      const auth = req.headers['authorization'] || req.headers['x-user-token'];
      if (auth && verifyJwtToken) {
        const raw = auth.replace('Bearer ', '').trim();
        const payload = verifyJwtToken(raw);
        if (payload?.userId) {
          req.user = payload;
        }
      }
    } catch {}
    next();
  };

  /**
   * POST /api/hoollow/generate
   * Generates real AI roadmap tailored to user goal and preferences
   */
  router.post('/generate', getUserOptional, async (req, res) => {
    try {
      const {
        goal = 'Python Developer',
        customGoal = '',
        level = 'Beginner',
        dailyStudyTime = '1 hour',
        timeline = '6 months',
        learningStyle = 'Video + Notes + Practice'
      } = req.body;

      const targetGoal = (goal === 'Custom Goal' && customGoal) ? customGoal.trim() : goal;

      let aiRoadmap = null;

      // System Prompt for strict schema generation
      const systemPrompt = `You are HOOLLOW, the elite AI Roadmap Generator on ProfessorVirus.site.
Generate an exhaustive, personalized, high-value learning roadmap in strict JSON format.
The response must adhere to this exact JSON schema:
{
  "title": string,
  "summary": string,
  "totalHours": number,
  "phases": [
    {
      "id": string,
      "name": string,
      "description": string,
      "duration": string,
      "tasks": [
        {
          "id": string,
          "title": string,
          "description": string,
          "duration": string,
          "skills": [string],
          "resources": {
            "video": string (valid youtube/educational url),
            "notes": string (valid documentation url),
            "practice": string (valid coding/exercise url)
          }
        }
      ]
    }
  ],
  "completionCriteria": [string],
  "nextRecommendedAction": string
}`;

      const userPrompt = `Generate a learning roadmap for:
Goal: ${targetGoal}
Current Level: ${level}
Daily Study Time: ${dailyStudyTime}
Goal Timeline: ${timeline}
Preferred Learning Style: ${learningStyle}

Provide 5 detailed, progressive phases (Foundation, Core Concepts, Real-World Projects, Advanced Topics, Career/Interview Prep) with realistic, practical learning tasks, estimated durations, and real resources.`;

      // Try Gemini first, then OpenAI
      try {
        aiRoadmap = await callGeminiForRoadmap(systemPrompt, userPrompt);
        if (!aiRoadmap) {
          aiRoadmap = await callOpenAIForRoadmap(systemPrompt, userPrompt);
        }
      } catch (err) {
        console.warn('[HOOLLOW AI GENERATION ERROR]', err.message);
      }

      // If AI generated a valid structure, format and return it
      if (aiRoadmap && aiRoadmap.phases && Array.isArray(aiRoadmap.phases) && aiRoadmap.phases.length > 0) {
        const formattedRoadmap = {
          id: 'roadmap_' + crypto.randomUUID().slice(0, 8),
          targetGoal,
          level,
          dailyStudyTime,
          timeline,
          learningStyle,
          title: aiRoadmap.title || `${targetGoal} Mastery Roadmap`,
          summary: aiRoadmap.summary || `Personalized AI-generated roadmap for ${targetGoal}`,
          totalHours: aiRoadmap.totalHours || 120,
          generatedAt: new Date().toISOString(),
          aiEngine: 'Gemini AI Real-Time Generator',
          phases: aiRoadmap.phases.map((p, idx) => ({
            id: p.id || `phase-${idx + 1}`,
            name: p.name || `Phase ${idx + 1}`,
            description: p.description || '',
            duration: p.duration || '3 Weeks',
            tasks: (p.tasks || []).map((t, tIdx) => ({
              id: t.id || `task-${idx + 1}-${tIdx + 1}`,
              title: t.title || `Task ${tIdx + 1}`,
              description: t.description || '',
              duration: t.duration || '2 Hours',
              skills: Array.isArray(t.skills) ? t.skills : [],
              resources: {
                video: t.resources?.video || 'https://www.youtube.com',
                notes: t.resources?.notes || 'https://developer.mozilla.org',
                practice: t.resources?.practice || 'https://leetcode.com'
              }
            }))
          })),
          completionCriteria: Array.isArray(aiRoadmap.completionCriteria) ? aiRoadmap.completionCriteria : [
            'Complete all phase tasks',
            'Build 1 capstone project',
            'Pass interview challenge'
          ],
          nextRecommendedAction: aiRoadmap.nextRecommendedAction || 'Begin Phase 1: Task 1'
        };

        return res.json({
          success: true,
          roadmap: formattedRoadmap,
          isAiGenerated: true
        });
      }

      // Fallback: Use verified curriculum generator
      const fallbackRoadmap = generateStructuredCurriculum(
        goal,
        customGoal,
        level,
        dailyStudyTime,
        timeline,
        learningStyle
      );

      return res.json({
        success: true,
        roadmap: fallbackRoadmap,
        isAiGenerated: false
      });
    } catch (err) {
      console.error('[HOOLLOW GENERATE EXCEPTION]', err);
      const safeFallback = generateStructuredCurriculum('Python Developer', '', 'Beginner', '1 hour', '6 months', 'Video + Notes + Practice');
      return res.json({
        success: true,
        roadmap: safeFallback,
        isAiGenerated: false
      });
    }
  });

  /**
   * POST /api/hoollow/save
   * Persists progress, completed tasks, streaks and XP
   */
  router.post('/save', getUserOptional, async (req, res) => {
    try {
      const {
        roadmapId,
        roadmapData,
        completedTaskIds = [],
        xpEarned = 0,
        streakCount = 0,
        activityDate = new Date().toISOString().split('T')[0]
      } = req.body;

      const userId = req.user?.userId || req.body.userId || 'guest_user';

      if (HoollowRoadmapModel && mongoose.connection.readyState === 1) {
        let existing = await HoollowRoadmapModel.findOne({ userId, id: roadmapId });
        if (!existing) {
          existing = new HoollowRoadmapModel({
            id: roadmapId || ('roadmap_' + crypto.randomUUID().slice(0, 8)),
            userId,
            goal: roadmapData?.targetGoal || 'Python Developer',
            customGoal: roadmapData?.customGoal || '',
            level: roadmapData?.level || 'Beginner',
            dailyStudyTime: roadmapData?.dailyStudyTime || '1 hour',
            timeline: roadmapData?.timeline || '6 months',
            learningStyle: roadmapData?.learningStyle || 'Video + Notes + Practice',
            roadmapData: roadmapData || {},
            completedTaskIds: completedTaskIds || [],
            xpEarned: xpEarned || 0,
            streakCount: streakCount || 1,
            lastActiveDate: activityDate,
            activityDates: [activityDate]
          });
        } else {
          existing.completedTaskIds = completedTaskIds;
          existing.xpEarned = xpEarned;
          existing.streakCount = streakCount;
          existing.lastActiveDate = activityDate;
          if (!existing.activityDates.includes(activityDate)) {
            existing.activityDates.push(activityDate);
          }
          if (roadmapData) existing.roadmapData = roadmapData;
        }
        await existing.save();
      } else {
        // In-memory fallback
        memoryRoadmaps.set(`${userId}_${roadmapId}`, {
          roadmapId,
          userId,
          completedTaskIds,
          xpEarned,
          streakCount,
          lastActiveDate: activityDate,
          roadmapData,
          updatedAt: new Date().toISOString()
        });
      }

      return res.json({
        success: true,
        message: 'Roadmap progress successfully synchronized'
      });
    } catch (err) {
      console.error('[HOOLLOW SAVE ERROR]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * POST /api/hoollow/ask-mentor
   * AI Learning Mentor endpoint
   */
  router.post('/ask-mentor', async (req, res) => {
    try {
      const { question, taskTitle, goal } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, error: 'Question is required' });
      }

      const systemPrompt = `You are the HOOLLOW AI Learning Mentor on ProfessorVirus.site.
You give precise, encouraging, step-by-step technical explanations, working code snippets, and mental models.
Context:
Goal: ${goal || 'Software Engineering'}
Current Task: ${taskTitle || 'Learning Session'}`;

      let answer = null;
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          const { GoogleGenerativeAI } = await import('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });
          const result = await model.generateContent(question);
          answer = result?.response?.text();
        }
      } catch (e) {
        console.warn('[AI MENTOR GEMINI FAILED]', e.message);
      }

      if (!answer) {
        answer = `Here is how to approach **${taskTitle || 'this concept'}**:

1. **Core Concept**: Break the problem into inputs, transformations, and expected outputs.
2. **Best Practice**: Write a minimal reproducible script first, test with small edge cases.
3. **Next Step**: Review the official documentation link provided in the task resources, write 5-10 lines of sample code, and run it locally.

Keep going! Consistency is the key to mastering ${goal || 'programming'}.`;
      }

      return res.json({
        success: true,
        answer
      });
    } catch (err) {
      return res.json({
        success: true,
        answer: 'Break down your task into smaller steps and test each line. Practice makes progress!'
      });
    }
  });

  return router;
}

export default createHoollowRouter;
