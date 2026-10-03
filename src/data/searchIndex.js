/**
 * ProfessorVirus — Global Search Index
 * 
 * Static searchable items for instant client-side search across:
 * Subjects, Pages, Tools, Interview Pro, Branches, etc.
 * 
 * API-backed results (Notes, PYQs) are fetched dynamically via /api/notes/search
 */

export const SEARCH_INDEX = [
  // ─── Core Pages ────────────────────────────
  { title: 'Home', type: 'Page', route: 'home', keywords: 'home landing main dashboard' },
  { title: 'Notes', type: 'Page', route: 'notes', keywords: 'notes handwritten quantum pdf study material' },
  { title: 'Previous Year Papers (PYQs)', type: 'Page', route: 'pyqs', keywords: 'pyq pyqs question papers previous year solved papers exam' },
  { title: 'Syllabus', type: 'Page', route: 'syllabus', keywords: 'syllabus curriculum scheme units credits' },
  { title: 'Quizzes', type: 'Page', route: 'quizzes', keywords: 'quizzes quiz test mcq assessment practice' },
  { title: 'Interview Pro', type: 'Page', route: 'interview-pro', keywords: 'interview pro placement mock aptitude coding technical hr' },
  { title: 'More Tools', type: 'Page', route: 'more', keywords: 'more tools utilities extra features' },

  // ─── Tools ─────────────────────────────────
  { title: 'AKTU Result & SGPA Calculator', type: 'Tool', route: 'result-cgpa', keywords: 'result sgpa cgpa calculator marksheet aktu marks grade' },
  { title: 'Attendance & Bunk Calculator', type: 'Tool', route: 'attendance-calculator', keywords: 'attendance bunk calculator 75% criteria classes absent present' },
  { title: 'Resume Maker (ATS)', type: 'Tool', route: 'resume-maker', keywords: 'resume maker ats cv curriculum vitae job application' },
  { title: 'PDF Tools', type: 'Tool', route: 'pdf-maker', keywords: 'pdf merger converter compress split tools' },
  { title: 'Timetable Planner', type: 'Tool', route: 'timetable', keywords: 'timetable schedule planner classes weekly daily' },
  { title: 'Student Progress & Analytics', type: 'Tool', route: 'progress', keywords: 'progress study progress analytics streak study time performance tracker dashboard' },

  // ─── Career & Opportunities ────────────────
  { title: 'Competitive Exams & Careers', type: 'Career', route: 'competitive-exams', keywords: 'gate cat mat upsc ssc competitive exam career guidance' },
  { title: 'Important University Links', type: 'Career', route: 'important-links', keywords: 'aktu erp portal circulars university links official' },
  { title: 'Internships & Jobs', type: 'Career', route: 'internships-jobs', keywords: 'internship job placement off-campus drive hiring' },
  { title: 'Scholarships & Grants', type: 'Career', route: 'scholarships', keywords: 'scholarship grant financial aid government corporate' },
  { title: 'Project Ideas & Repos', type: 'Career', route: 'project-ideas', keywords: 'project ideas github repo capstone mini project source code' },

  // ─── CSE / IT Subjects ─────────────────────
  { title: 'Operating System', type: 'Subject', route: 'notes', keywords: 'operating system os process scheduling deadlock memory management paging' },
  { title: 'Data Structures', type: 'Subject', route: 'notes', keywords: 'data structures ds array linked list stack queue tree graph sorting' },
  { title: 'DBMS', type: 'Subject', route: 'notes', keywords: 'database management system dbms sql normalization er model relational' },
  { title: 'Computer Networks', type: 'Subject', route: 'notes', keywords: 'computer networks cn osi tcp ip routing networking protocols' },
  { title: 'OOPs with Java', type: 'Subject', route: 'notes', keywords: 'oops java object oriented programming inheritance polymorphism encapsulation' },
  { title: 'Discrete Structures', type: 'Subject', route: 'notes', keywords: 'discrete structures mathematics logic sets relations functions graphs combinatorics' },
  { title: 'Design & Analysis of Algorithms', type: 'Subject', route: 'notes', keywords: 'daa algorithms divide conquer dynamic programming greedy complexity' },
  { title: 'Theory of Computation', type: 'Subject', route: 'notes', keywords: 'toc automata theory formal languages turing machine regular grammar' },
  { title: 'Compiler Design', type: 'Subject', route: 'notes', keywords: 'compiler design lexical analysis parsing syntax semantic code generation' },
  { title: 'Software Engineering', type: 'Subject', route: 'notes', keywords: 'software engineering sdlc agile waterfall testing maintenance requirements' },
  { title: 'Artificial Intelligence', type: 'Subject', route: 'notes', keywords: 'artificial intelligence ai machine learning neural network search heuristic' },
  { title: 'Machine Learning', type: 'Subject', route: 'notes', keywords: 'machine learning ml regression classification clustering neural network deep learning' },
  { title: 'Web Technology', type: 'Subject', route: 'notes', keywords: 'web technology html css javascript php mysql web development' },
  { title: 'Cloud Computing', type: 'Subject', route: 'notes', keywords: 'cloud computing aws azure virtualization saas paas iaas' },
  { title: 'Cyber Security', type: 'Subject', route: 'notes', keywords: 'cyber security cryptography encryption firewall network security ethical hacking' },
  { title: 'Computer Architecture', type: 'Subject', route: 'notes', keywords: 'computer architecture organization coa pipeline cache memory cpu instruction set' },
  { title: 'Microprocessor', type: 'Subject', route: 'notes', keywords: 'microprocessor 8085 8086 assembly language interfacing' },

  // ─── Common / Mathematics ──────────────────
  { title: 'Mathematics I', type: 'Subject', route: 'notes', keywords: 'mathematics 1 maths calculus differential equations matrices' },
  { title: 'Mathematics II', type: 'Subject', route: 'notes', keywords: 'mathematics 2 maths integral laplace transform fourier series' },
  { title: 'Mathematics III', type: 'Subject', route: 'notes', keywords: 'mathematics 3 maths probability statistics numerical methods' },
  { title: 'Mathematics IV', type: 'Subject', route: 'notes', keywords: 'mathematics 4 maths complex analysis partial differential equations' },
  { title: 'Engineering Physics', type: 'Subject', route: 'notes', keywords: 'engineering physics optics quantum mechanics solid state laser' },
  { title: 'Engineering Chemistry', type: 'Subject', route: 'notes', keywords: 'engineering chemistry polymer corrosion water treatment spectroscopy' },
  { title: 'English / Communication Skills', type: 'Subject', route: 'notes', keywords: 'english communication skills grammar vocabulary writing technical' },
  { title: 'Universal Human Values', type: 'Subject', route: 'notes', keywords: 'uhv universal human values ethics harmony society trust' },
  { title: 'Environment & Ecology', type: 'Subject', route: 'notes', keywords: 'environment ecology evs pollution ecosystem biodiversity' },
  { title: 'Engineering Graphics', type: 'Subject', route: 'notes', keywords: 'engineering graphics drawing projection isometric orthographic' },

  // ─── ECE / EE Subjects ─────────────────────
  { title: 'Signals & Systems', type: 'Subject', route: 'notes', keywords: 'signals systems fourier laplace z-transform convolution frequency response' },
  { title: 'Digital Electronics', type: 'Subject', route: 'notes', keywords: 'digital electronics logic gates boolean algebra flip flop counter' },
  { title: 'Analog Electronics', type: 'Subject', route: 'notes', keywords: 'analog electronics transistor amplifier operational amplifier circuit' },
  { title: 'Control Systems', type: 'Subject', route: 'notes', keywords: 'control systems feedback transfer function root locus bode plot nyquist' },
  { title: 'Communication Systems', type: 'Subject', route: 'notes', keywords: 'communication systems am fm modulation demodulation antenna' },
  { title: 'Electromagnetic Theory', type: 'Subject', route: 'notes', keywords: 'electromagnetic theory emf maxwell equations wave propagation' },
  { title: 'Power Systems', type: 'Subject', route: 'notes', keywords: 'power systems generation transmission distribution protection switchgear' },
  { title: 'Electrical Machines', type: 'Subject', route: 'notes', keywords: 'electrical machines motor generator transformer induction synchronous' },

  // ─── Branches ──────────────────────────────
  { title: 'CSE (Computer Science & Engineering)', type: 'Branch', route: 'notes', keywords: 'cse computer science engineering branch' },
  { title: 'IT (Information Technology)', type: 'Branch', route: 'notes', keywords: 'it information technology branch' },
  { title: 'ECE (Electronics & Communication)', type: 'Branch', route: 'notes', keywords: 'ece electronics communication engineering branch' },
  { title: 'EE (Electrical Engineering)', type: 'Branch', route: 'notes', keywords: 'ee electrical engineering branch' },
  { title: 'ME (Mechanical Engineering)', type: 'Branch', route: 'notes', keywords: 'me mechanical engineering branch' },
  { title: 'CE (Civil Engineering)', type: 'Branch', route: 'notes', keywords: 'ce civil engineering branch' },
  { title: 'BCA', type: 'Branch', route: 'notes', keywords: 'bca bachelor computer application' },
  { title: 'MCA', type: 'Branch', route: 'notes', keywords: 'mca master computer application' },
  { title: 'MBA', type: 'Branch', route: 'notes', keywords: 'mba master business administration' },

  // ─── Interview Pro Rounds ──────────────────
  { title: 'Aptitude Round (Interview Pro)', type: 'Interview', route: 'interview-pro', keywords: 'aptitude reasoning quantitative logical verbal interview placement' },
  { title: 'Coding Round (Interview Pro)', type: 'Interview', route: 'interview-pro', keywords: 'coding round programming dsa python java c++ interview' },
  { title: 'AI Technical Interview', type: 'Interview', route: 'interview-pro', keywords: 'ai technical interview voice mock practice' },
  { title: 'AI HR Behavioral Interview', type: 'Interview', route: 'interview-pro', keywords: 'hr behavioral interview star method situational questions' },
];

/**
 * Search function: match query against title and keywords
 * Returns top N results sorted by relevance
 */
export function searchLocalIndex(query, maxResults = 8) {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = SEARCH_INDEX.map(item => {
    const titleLower = item.title.toLowerCase();
    const keywordsLower = item.keywords.toLowerCase();
    const combined = `${titleLower} ${keywordsLower}`;

    let score = 0;

    // Exact title match (highest priority)
    if (titleLower === q) score += 100;
    // Title starts with query
    else if (titleLower.startsWith(q)) score += 60;
    // Title contains query
    else if (titleLower.includes(q)) score += 40;

    // Token matching in combined text
    for (const token of tokens) {
      if (titleLower.includes(token)) score += 15;
      if (keywordsLower.includes(token)) score += 8;
      // Abbreviation matching (e.g. "os" → "operating system")
      if (token.length >= 2 && token.length <= 4) {
        const initials = item.title.split(/\s+/).map(w => w[0]).join('').toLowerCase();
        if (initials.includes(token)) score += 20;
      }
    }

    return { ...item, score };
  }).filter(item => item.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults);
}
