/**
 * Central Master Skills Dataset for CampusPrep / ProfessorVirus ATS Resume Maker
 * Categories:
 * 1. Programming Languages
 * 2. Frameworks & Libraries
 * 3. Developer Tools & Platforms
 * 4. Databases
 * 5. Core Concepts
 */

export const SKILLS_MASTER_DATA = {
  programmingLanguages: {
    id: 'programmingLanguages',
    label: 'Programming Languages',
    placeholder: 'Search programming languages...',
    skills: [
      'C',
      'C++',
      'C#',
      'Java',
      'Python',
      'JavaScript',
      'TypeScript',
      'Go',
      'Rust',
      'Kotlin',
      'Swift',
      'PHP',
      'SQL'
    ]
  },
  frameworks: {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    placeholder: 'Search frameworks & libraries...',
    skills: [
      'React',
      'Next.js',
      'Node.js',
      'Express.js',
      'Django',
      'Flask',
      'FastAPI',
      'Tailwind CSS',
      'Bootstrap',
      'TensorFlow',
      'PyTorch',
      'Keras',
      'OpenCV'
    ]
  },
  developerTools: {
    id: 'developerTools',
    label: 'Developer Tools & Platforms',
    placeholder: 'Search developer tools & platforms...',
    skills: [
      'Git',
      'GitHub',
      'Docker',
      'VS Code',
      'Linux',
      'AWS',
      'Azure',
      'Vercel',
      'Postman',
      'Firebase'
    ]
  },
  databases: {
    id: 'databases',
    label: 'Databases',
    placeholder: 'Search databases...',
    skills: [
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'SQLite',
      'Redis',
      'Firebase',
      'Oracle'
    ]
  },
  coreConcepts: {
    id: 'coreConcepts',
    label: 'Core Concepts',
    placeholder: 'Search core concepts...',
    skills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
      'Cybersecurity',
      'Computer Architecture',
      'Software Engineering'
    ]
  }
};

export const SKILL_CATEGORIES = Object.keys(SKILLS_MASTER_DATA);
