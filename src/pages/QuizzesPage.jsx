import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Check, 
  Home as HomeIcon, 
  Grid, 
  List, 
  ArrowRight,
  BookOpen,
  FileText,
  Lightbulb,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Radio,
  Wrench,
  Building2,
  Code,
  Zap,
  ExternalLink,
  Calendar,
  Award,
  Globe,
  HelpCircle,
  X,
  Flame,
  TrendingUp,
  BarChart2,
  Sigma,
  Folder,
  Play
} from 'lucide-react';

export default function QuizzesPage({ onNavigate, onOpenAI }) {
  // Navigation & Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterBranches, setFilterBranches] = useState([]);
  const [filterYear, setFilterYear] = useState(null);
  const [filterSubjects, setFilterSubjects] = useState([]);
  const [filterQuizType, setFilterQuizType] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');

  // Categories Strip Data
  const categories = [
    { id: 'All', name: 'All Quizzes', sub: 'Complete Collection', icon: Grid, bgColor: '#e6f4ed', iconBg: '#0d5c3a' },
    { id: 'CSE', name: 'CSE', sub: 'Computer Science', icon: Code, bgColor: '#e0f2fe', iconBg: '#0284c7' },
    { id: 'ECE', name: 'ECE', sub: 'Electronics', icon: Cpu, bgColor: '#fce7f3', iconBg: '#db2777' },
    { id: 'ME', name: 'ME', sub: 'Mechanical', icon: Wrench, bgColor: '#ffedd5', iconBg: '#ea580c' },
    { id: 'CE', name: 'CE', sub: 'Civil', icon: Building2, bgColor: '#ccfbf1', iconBg: '#0d9488' },
    { id: 'IT', name: 'IT', sub: 'Information Tech', icon: Radio, bgColor: '#f3e8ff', iconBg: '#9333ea' },
    { id: 'EE', name: 'EE', sub: 'Electrical', icon: Zap, bgColor: '#e0e7ff', iconBg: '#4f46e5' },
    { id: 'Maths', name: 'Maths', sub: 'Applied Sciences', icon: Sigma, bgColor: '#ffe4e6', iconBg: '#e11d48' },
    { id: 'Aptitude', name: 'Aptitude', sub: 'Reasoning & Verbal', icon: BarChart2, bgColor: '#f3e8ff', iconBg: '#8b5cf6' },
    { id: 'Other', name: 'Other', sub: 'Miscellaneous', icon: Folder, bgColor: '#f3f4f6', iconBg: '#4b5563' },
  ];

  // REAL VERIFIED EXTERNAL QUIZ DIRECTORY (Strict Real URLs only, No fake links!)
  const realQuizDatabase = [
    {
      id: 'dsa-gfg',
      subject: 'Data Structures',
      topic: 'Top MCQs on Array Data Structure with Answers',
      branch: 'CSE',
      sem: 'Sem 3',
      source: 'GeeksforGeeks',
      sourceUrl: 'https://www.geeksforgeeks.org/quizzes/top-mcqs-on-array-data-structure-with-answers/',
      icon: Code,
      bgColor: '#f3e8ff',
      iconColor: '#8b5cf6',
      questionsCount: 'Array MCQs',
      duration: 'Self-Paced'
    },
    {
      id: 'os-gfg',
      subject: 'Operating System',
      topic: '50 Operating System MCQs with Answers',
      branch: 'CSE',
      sem: 'Sem 4',
      source: 'GeeksforGeeks',
      sourceUrl: 'https://www.geeksforgeeks.org/quizzes/50-operating-system-mcqs-with-answers/',
      icon: Wrench,
      bgColor: '#fef3c7',
      iconColor: '#d97706',
      questionsCount: '50 MCQs',
      duration: 'Self-Paced'
    },
    {
      id: 'dbms-gfg',
      subject: 'DBMS',
      topic: 'Database Management System Basics Quiz',
      branch: 'CSE',
      sem: 'Sem 5',
      source: 'GeeksforGeeks',
      sourceUrl: 'https://www.geeksforgeeks.org/quizzes/database-management-system-basics/',
      icon: Layers,
      bgColor: '#e6f4ed',
      iconColor: '#059669',
      questionsCount: 'Basics MCQs',
      duration: 'Self-Paced'
    },
    {
      id: 'cn-gfg',
      subject: 'Computer Networks',
      topic: 'Computer Networks Quiz & Practice MCQs',
      branch: 'CSE',
      sem: 'Sem 5',
      source: 'GeeksforGeeks',
      sourceUrl: 'https://www.geeksforgeeks.org/quizzes/computer-networks-gq/',
      icon: Radio,
      bgColor: '#e0f2fe',
      iconColor: '#0284c7',
      questionsCount: 'Network MCQs',
      duration: 'Self-Paced'
    },
    {
      id: 'java-gfg',
      subject: 'OOPs with Java',
      topic: 'Java Programming Practice Quiz',
      branch: 'CSE',
      sem: 'Sem 4',
      source: 'GeeksforGeeks',
      sourceUrl: 'https://www.geeksforgeeks.org/quizzes/java-gq/',
      icon: Code,
      bgColor: '#fce7f3',
      iconColor: '#db2777',
      questionsCount: 'Java MCQs',
      duration: 'Self-Paced'
    },
    {
      id: 'python-gfg',
      subject: 'Python Programming',
      topic: 'Python Language MCQs & Practice Quiz',
      branch: 'CSE',
      sem: 'Sem 3',
      source: 'GeeksforGeeks',
      sourceUrl: 'https://www.geeksforgeeks.org/quizzes/python-gq/',
      icon: Code,
      bgColor: '#e0f2fe',
      iconColor: '#0284c7',
      questionsCount: 'Python MCQs',
      duration: 'Self-Paced'
    },
    {
      id: 'cpp-gfg',
      subject: 'C++ Programming',
      topic: 'C++ Language & OOP Quiz',
      branch: 'CSE',
      sem: 'Sem 3',
      source: 'GeeksforGeeks',
      sourceUrl: 'https://www.geeksforgeeks.org/quizzes/cpp-gq/',
      icon: Code,
      bgColor: '#fef3c7',
      iconColor: '#b45309',
      questionsCount: 'C++ MCQs',
      duration: 'Self-Paced'
    },
    {
      id: 'digital-gfg',
      subject: 'Digital Electronics',
      topic: 'Digital Logic & Circuit Design Quiz',
      branch: 'ECE',
      sem: 'Sem 3',
      source: 'GeeksforGeeks',
      sourceUrl: 'https://www.geeksforgeeks.org/quizzes/digital-electronics-gq/',
      icon: Cpu,
      bgColor: '#fce7f3',
      iconColor: '#db2777',
      questionsCount: 'Digital MCQs',
      duration: 'Self-Paced'
    },
    {
      id: 'dbms-w3',
      subject: 'DBMS SQL',
      topic: 'SQL Queries & Relational Algebra Quiz',
      branch: 'CSE',
      sem: 'Sem 5',
      source: 'W3Schools',
      sourceUrl: 'https://www.w3schools.com/quiztest/quiztest.asp?qtest=SQL',
      icon: Layers,
      bgColor: '#e6f4ed',
      iconColor: '#059669',
      questionsCount: '25 Questions',
      duration: 'Official Quiz'
    },
    {
      id: 'html-w3',
      subject: 'Web Technologies',
      topic: 'HTML5 & CSS3 Frontend Quiz',
      branch: 'CSE',
      sem: 'Sem 6',
      source: 'W3Schools',
      sourceUrl: 'https://www.w3schools.com/quiztest/quiztest.asp?qtest=HTML',
      icon: Globe,
      bgColor: '#dbeafe',
      iconColor: '#2563eb',
      questionsCount: '40 Questions',
      duration: 'Official Quiz'
    },
    {
      id: 'js-w3',
      subject: 'JavaScript',
      topic: 'ES6, DOM & Async JS Quiz',
      branch: 'CSE',
      sem: 'Sem 6',
      source: 'W3Schools',
      sourceUrl: 'https://www.w3schools.com/quiztest/quiztest.asp?qtest=JS',
      icon: Code,
      bgColor: '#fef3c7',
      iconColor: '#d97706',
      questionsCount: '25 Questions',
      duration: 'Official Quiz'
    }
  ];

  // Verified External Quiz Resolver function
  const handleAttemptQuiz = (quiz) => {
    const targetUrl = quiz?.sourceUrl || quiz?.url;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Quiz link is currently being updated from official source.');
    }
  };

  // Helper Filter Logic
  const filteredQuizzes = useMemo(() => {
    return realQuizDatabase.filter(q => {
      if (selectedCategory !== 'All' && q.branch !== selectedCategory) return false;
      if (filterBranches.length > 0 && !filterBranches.includes(q.branch)) return false;
      if (filterSubjects.length > 0 && !filterSubjects.includes(q.subject)) return false;
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        const matchSub = q.subject.toLowerCase().includes(term);
        const matchTopic = q.topic.toLowerCase().includes(term);
        if (!matchSub && !matchTopic) return false;
      }
      return true;
    });
  }, [realQuizDatabase, selectedCategory, filterBranches, filterSubjects, searchQuery]);

  const toggleBranch = (b) => {
    setFilterBranches(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const toggleSubject = (s) => {
    setFilterSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setFilterBranches([]);
    setFilterYear(null);
    setFilterSubjects([]);
    setFilterQuizType([]);
    setSearchQuery('');
    setSubjectSearchQuery('');
  };

  return (
    <div style={{ backgroundColor: '#f9f7f1', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 1. LARGE ILLUSTRATED QUIZZES HERO BANNER */}
      <section style={{
        position: 'relative',
        backgroundColor: '#0c3829',
        backgroundImage: `
          radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #07271c 0%, #0c3829 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '1.75rem 0 2rem 0',
        borderBottom: '4px solid #1a563f',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(12, 56, 41, 0.35)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(52, 211, 153, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr 340px',
            gap: '1.25rem',
            alignItems: 'center'
          }} className="quizzes-hero-grid">

            {/* LEFT: Virus Teacher Mascot & Speech Bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="quizzes-left-mascot">
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '0.6rem 0.85rem',
                marginBottom: '0.5rem',
                border: '2px solid #0e4d34',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0f172a',
                fontFamily: "'Kalam', cursive",
                lineHeight: 1.3,
                textAlign: 'center',
                position: 'relative'
              }}>
                “Practice aaj <br />
                Quiz kal Topper <br />
                hoga tu pakka!” <br />
                <span style={{ color: '#059669' }}>— Virus</span>

                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '10px solid #0e4d34'
                }} />
              </div>

              <div style={{
                width: '230px',
                height: '250px',
                position: 'relative',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
              }}>
                <img
                  src="/assets/quizzes_hero_virus.png"
                  alt="Virus Teacher Mascot"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_virus.png';
                  }}
                />
              </div>
            </div>

            {/* CENTER: Main Title, Subtitle, Search Bar */}
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '3.4rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 24px rgba(52,211,153,0.3)'
                }}>
                  Quizzes
                </h1>
                <Lightbulb size={40} style={{ color: '#fde047', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
              </div>

              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fde047',
                fontSize: '1.35rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                “Practice. Analyze. Improve.”
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 500, maxWidth: '520px' }}>
                Topic-wise quizzes to strengthen your concepts, <br />
                track your progress and boost your preparation.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={(e) => e.preventDefault()}
                style={{
                  width: '100%',
                  maxWidth: '540px',
                  position: 'relative',
                  marginTop: '0.75rem'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.4rem 0.35rem 1.25rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.35), 0 0 0 3px rgba(52,211,153,0.25)',
                  border: '1px solid #cbd5e1'
                }}>
                  <Search size={18} style={{ color: '#64748b', marginRight: '0.6rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search quizzes by subject, topic, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      backgroundColor: 'transparent'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: '0.6rem 1.5rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      backgroundColor: '#0d5c3a',
                      borderRadius: '9999px',
                      flexShrink: 0
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT: Students + Sticky Note + Boombox */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="quizzes-right-mascot">
              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fef08a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '0.3rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}>
                Quiz karo Darr nahi, <br />
                Concept pakka! :)
              </div>

              <div style={{
                width: '310px',
                height: '190px',
                position: 'relative',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
              }}>
                <img
                  src="/assets/quizzes_hero_students.png"
                  alt="AKTU Student Group"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_students.png';
                  }}
                />
              </div>

              {/* Sticky Note */}
              <div className="sticky-note" style={{
                position: 'absolute',
                top: '10px',
                left: '-15px',
                width: '145px',
                padding: '0.55rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1e293b',
                lineHeight: 1.3,
                boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
                transform: 'rotate(-4deg)'
              }}>
                <div>✓ Practice Daily</div>
                <div>✓ Find Weak Topics</div>
                <div>✓ Improve Faster</div>
                <div>✓ Score Higher</div>
                <div style={{ color: '#047857', fontFamily: "'Kalam', cursive", textAlign: 'right', marginTop: '0.2rem' }}>
                  — CampusPrep :)
                </div>
              </div>
            </div>

          </div>

        </div>

        <style>{`
          @media (max-width: 1100px) {
            .quizzes-hero-grid { grid-template-columns: 1fr !important; justify-items: center !important; }
            .quizzes-left-mascot, .quizzes-right-mascot { display: none !important; }
          }
        `}</style>
      </section>

      {/* 2. HORIZONTAL CATEGORY STRIP */}
      <section style={{ backgroundColor: '#ffffff', padding: '1.25rem 0', borderBottom: '1px solid #eae5d9' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
            gap: '0.75rem'
          }}>
            {categories.map(cat => {
              const CIcon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    backgroundColor: isActive ? '#0d5c3a' : cat.bgColor,
                    color: isActive ? '#ffffff' : '#1e293b',
                    borderRadius: '16px',
                    padding: '0.85rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 6px 16px rgba(13,92,58,0.25)' : '0 2px 8px rgba(0,0,0,0.02)',
                    border: isActive ? '2px solid #0d5c3a' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.transform = 'translateY(0px)';
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : cat.iconBg,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.45rem'
                  }}>
                    <CIcon size={18} />
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.2 }}>
                    {cat.name}
                  </div>

                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    color: isActive ? '#a7f3d0' : '#64748b',
                    marginTop: '0.1rem'
                  }}>
                    {cat.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN THREE-COLUMN CONTENT LAYOUT */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr 280px',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="quizzes-main-layout">

          {/* LEFT COLUMN: FILTERS SIDEBAR */}
          <aside style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: '85px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                <Filter size={16} style={{ color: '#0d5c3a' }} /> Filters
              </div>
              <button
                onClick={handleResetFilters}
                style={{ background: 'none', border: 'none', color: '#0d5c3a', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>

            {/* SELECT BRANCH */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT BRANCH</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'].map(b => (
                  <label key={b} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={filterBranches.includes(b)}
                      onChange={() => toggleBranch(b)}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SELECT YEAR */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT YEAR</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                  <div
                    key={y}
                    onClick={() => setFilterYear(filterYear === y ? null : y)}
                    style={{
                      backgroundColor: filterYear === y ? '#0d5c3a' : '#f8fafc',
                      color: filterYear === y ? '#ffffff' : '#334155',
                      borderRadius: '8px',
                      padding: '0.45rem 0.3rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                  >
                    {y}
                  </div>
                ))}
              </div>
            </div>

            {/* SELECT SUBJECT */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT SUBJECT</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                marginBottom: '0.6rem'
              }}>
                <Search size={13} style={{ color: '#94a3b8', marginRight: '0.4rem' }} />
                <input
                  type="text"
                  placeholder="Search subject..."
                  value={subjectSearchQuery}
                  onChange={(e) => setSubjectSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.78rem', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                {[
                  'Operating System',
                  'Data Structures',
                  'DBMS',
                  'Computer Networks',
                  'OOPs with Java',
                  'Digital Electronics',
                  'Engineering Maths',
                  'Discrete Structures'
                ].map(s => (
                  <label key={s} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={filterSubjects.includes(s)}
                      onChange={() => toggleSubject(s)}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SELECT QUIZ TYPE */}
            <div>
              <div style={filterTitleStyle}>SELECT QUIZ TYPE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['Topic-wise', 'Unit-wise', 'Full Syllabus', 'Previous Year Based'].map(t => (
                  <label key={t} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={filterQuizType.includes(t)}
                      onChange={() => {
                        setFilterQuizType(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
                      }}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: FEATURED QUIZZES & SUBJECT QUIZ CATEGORIES */}
          <main>
            {/* SECTION 1: FEATURED QUIZZES */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                    Featured Quizzes
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.1rem' }}>
                    Handpicked quizzes to help you practice better and score higher.
                  </p>
                </div>

                <button style={{ background: 'none', border: 'none', color: '#0d5c3a', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {/* 4 FEATURED QUIZ CARDS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }} className="featured-quizzes-grid">
                {filteredQuizzes.slice(0, 4).map(quiz => {
                  const QIcon = quiz.icon;
                  return (
                    <div
                      key={quiz.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '18px',
                        border: '1.5px solid #e2e8f0',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = '#0d5c3a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '38px', height: '38px', borderRadius: '10px',
                              backgroundColor: quiz.bgColor, color: quiz.iconColor,
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <QIcon size={20} />
                            </div>

                            <div>
                              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                                {quiz.subject}
                              </h3>
                              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                {quiz.topic}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Source Tag Badge */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          backgroundColor: '#e6f4ed',
                          color: '#0d5c3a',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          marginBottom: '0.85rem'
                        }}>
                          <ExternalLink size={12} /> External Quiz • {quiz.source}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '0.75rem',
                        fontSize: '0.76rem',
                        color: '#64748b'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span>{quiz.questionsCount}</span>
                          <span>•</span>
                          <span>{quiz.duration}</span>
                        </div>

                        <button
                          onClick={() => handleAttemptQuiz(quiz)}
                          className="btn-primary"
                          style={{
                            padding: '0.45rem 1rem',
                            fontSize: '0.8rem',
                            backgroundColor: '#0d5c3a',
                            fontWeight: 700,
                            gap: '0.3rem'
                          }}
                        >
                          Attempt Now <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: QUIZ CATEGORIES BY SUBJECT */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                    Quiz Categories by Subject
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.1rem' }}>
                    Explore topic-wise quizzes and strengthen your preparation.
                  </p>
                </div>

                <button style={{ background: 'none', border: 'none', color: '#0d5c3a', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {/* SUBJECT TILES GRID */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem'
              }} className="subject-tiles-grid">
                {realQuizDatabase.map(quiz => {
                  const SIcon = quiz.icon;
                  return (
                    <div
                      key={quiz.id}
                      onClick={() => handleAttemptQuiz(quiz)}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        border: '1.5px solid #e2e8f0',
                        padding: '0.9rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0d5c3a';
                        e.currentTarget.style.backgroundColor = '#e6f4ed';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          backgroundColor: quiz.bgColor, color: quiz.iconColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <SIcon size={18} />
                        </div>

                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                            {quiz.subject}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {quiz.source} Quiz Hub
                          </div>
                        </div>
                      </div>

                      <ArrowRight size={16} style={{ color: '#0d5c3a' }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. LARGE BOTTOM ILLUSTRATED PROMOTIONAL BANNER */}
            <div style={{
              marginTop: '2.5rem',
              borderRadius: '24px',
              backgroundColor: '#f4eee0',
              backgroundImage: `linear-gradient(135deg, #f9f6ed 0%, #efe7d4 100%)`,
              border: '2px solid #e5dfd3',
              boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
              padding: '1.25rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: '240px 1fr 200px',
              gap: '1.25rem',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }} className="quizzes-bottom-banner">

              {/* Left: Virus with sign PRACTICE = PROGRESS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '95px',
                  height: '95px',
                  position: 'relative',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                  flexShrink: 0
                }}>
                  <img
                    src="/assets/quizzes_bottom_full.png"
                    alt="Virus Character holding Practice = Progress sign"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/hero_virus.png';
                    }}
                  />
                </div>

                <div style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.2
                }}>
                  Small Quizzes <br />
                  <span style={{ color: '#059669', fontSize: '1.25rem' }}>Big Results!</span>
                </div>
              </div>

              {/* Center: Students Artwork */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '180px',
                  height: '100px',
                  position: 'relative',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
                }}>
                  <img
                    src="/assets/notes_bottom_students.png"
                    alt="AKTU Students"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/hero_students.png';
                    }}
                  />
                </div>
              </div>

              {/* Right: Sticky Note */}
              <div className="sticky-note" style={{
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontFamily: "'Kalam', cursive",
                fontWeight: 700,
                color: '#1e293b',
                textAlign: 'center',
                boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
                transform: 'rotate(-3deg)'
              }}>
                Same Effort <br />
                Higher CGPA! <br />
                <span style={{ color: '#059669' }}>— CampusPrep :)</span>
              </div>

            </div>

          </main>

          {/* RIGHT COLUMN: YOUR PROGRESS + DAILY QUIZ + STUDY TIP */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* CARD 1: YOUR PROGRESS (Strict Real User Data ONLY) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <TrendingUp size={18} style={{ color: '#0d5c3a' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Your Progress
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                Keep going! You're doing great.
              </p>

              {/* Progress State */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                  No quiz attempts yet
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Attempt your first external quiz to track your progress & accuracy here!
                </p>
              </div>

              <button
                onClick={() => handleAttemptQuiz(realQuizDatabase[0])}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  fontSize: '0.85rem',
                  backgroundColor: '#0d5c3a',
                  gap: '0.4rem'
                }}
              >
                View Detailed Progress <ArrowRight size={15} />
              </button>
            </div>

            {/* CARD 2: DAILY QUIZ CHALLENGE */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Flame size={18} style={{ color: '#ea580c' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Daily Quiz Challenge
                  </h3>
                </div>
                <Calendar size={18} style={{ color: '#ef4444' }} />
              </div>

              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                New quiz every day. Stay consistent!
              </p>

              <button
                onClick={() => handleAttemptQuiz(realQuizDatabase[0])}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  fontSize: '0.85rem',
                  backgroundColor: '#059669',
                  gap: '0.4rem'
                }}
              >
                Attempt Today's Quiz <ArrowRight size={15} />
              </button>
            </div>

            {/* CARD 3: STUDY TIP BY VIRUS */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', marginBottom: '0.75rem' }}>
                <Lightbulb size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Study Tip by Virus
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Virus Face Avatar */}
                <div style={{
                  width: '65px',
                  height: '75px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1.5px solid #0d5c3a',
                  flexShrink: 0
                }}>
                  <img
                    src="/assets/quizzes_tips_virus.png"
                    alt="Virus Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/navbar_logo.png';
                    }}
                  />
                </div>

                {/* Sticky Note Text */}
                <div className="sticky-note" style={{
                  padding: '0.55rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontFamily: "'Kalam', cursive",
                  fontWeight: 700,
                  color: '#1e293b',
                  lineHeight: 1.3
                }}>
                  “Practice se hi <br />
                  confidence aata hai, <br />
                  aur confidence se result!” <br />
                  <span style={{ color: '#047857' }}>— Virus :)</span>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .quizzes-main-layout { grid-template-columns: 1fr !important; }
          .featured-quizzes-grid, .subject-tiles-grid { grid-template-columns: 1fr !important; }
          .quizzes-bottom-banner { grid-template-columns: 1fr !important; text-align: center !important; }
        }
      `}</style>

    </div>
  );
}

// Styling Helper Constants
const filterTitleStyle = {
  fontSize: '0.75rem',
  fontWeight: 800,
  color: '#64748b',
  letterSpacing: '0.05em',
  marginBottom: '0.6rem'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  cursor: 'pointer'
};

const checkboxInputStyle = {
  accentColor: '#0d5c3a',
  width: '15px',
  height: '15px',
  cursor: 'pointer'
};

// Verified External Quiz Resolver function
export function resolveExternalQuiz(subject, topic) {
  const verifiedQuizzes = [
    {
      subject: 'Data Structures',
      topic: 'Top MCQs on Array Data Structure with Answers',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/quizzes/top-mcqs-on-array-data-structure-with-answers/'
    },
    {
      subject: 'Operating System',
      topic: '50 Operating System MCQs with Answers',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/quizzes/50-operating-system-mcqs-with-answers/'
    },
    {
      subject: 'DBMS',
      topic: 'Database Management System Basics Quiz',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/quizzes/database-management-system-basics/'
    },
    {
      subject: 'Computer Networks',
      topic: 'Computer Networks Quiz & Practice MCQs',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/quizzes/computer-networks-gq/'
    },
    {
      subject: 'OOPs with Java',
      topic: 'Java Programming Practice Quiz',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/quizzes/java-gq/'
    },
    {
      subject: 'Python Programming',
      topic: 'Python Language MCQs & Practice Quiz',
      source: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/quizzes/python-gq/'
    }
  ];

  const match = verifiedQuizzes.find(q => 
    (subject && q.subject.toLowerCase().includes(subject.toLowerCase())) ||
    (topic && q.topic.toLowerCase().includes(topic.toLowerCase()))
  );

  if (match) {
    return {
      title: match.subject,
      topic: match.topic,
      source: match.source,
      url: match.url,
      isExternal: true
    };
  }

  return {
    title: subject || 'Technical Quiz',
    topic: topic || 'Topic-wise Practice',
    source: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/quizzes/50-operating-system-mcqs-with-answers/',
    isExternal: true
  };
}
