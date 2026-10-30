import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronRight,
  ShieldCheck,
  Eye,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import AllIzzWellBanner from '../components/AllIzzWellBanner';
import AcademicResourceBanner from '../components/AcademicResourceBanner';
import SyllabusPdfViewerModal from '../components/SyllabusPdfViewerModal';
import { SYLLABUS_CATALOG } from '../data/syllabusCatalog';

export default function SyllabusPage({ onNavigate, onOpenAI }) {
  // Master syllabus dataset (seeded from authoritative catalog and augmented from API)
  const [syllabusList, setSyllabusList] = useState(SYLLABUS_CATALOG);

  // Dynamic Hierarchical Filter States (in specified order: Course -> Branch -> Session/Year -> Semester -> Subject)
  const [selectedCourse, setSelectedCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSession, setSelectedSession] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('Semester 3');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Modals state
  const [activePdfModal, setActivePdfModal] = useState(null); // stores syllabus record for PDF viewer
  const [activeUnitModal, setActiveUnitModal] = useState(null); // stores syllabus record for Unit Topics viewer

  // Fetch updated records from backend API in background
  useEffect(() => {
    let isMounted = true;
    fetch('/api/syllabus')
      .then(res => res.json())
      .then(json => {
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Merge API data with bundled catalog
          const existingMap = new Map();
          SYLLABUS_CATALOG.forEach(item => existingMap.set(item.id || item.officialPdfUrl, item));
          json.data.forEach(item => existingMap.set(item.id || item.officialPdfUrl, item));
          setSyllabusList(Array.from(existingMap.values()));
        }
      })
      .catch(err => {
        // Fallback gracefully to bundled catalog without disruption
        console.info('[SYLLABUS PAGE] Using bundled verified catalog:', err.message);
      });
    return () => { isMounted = false; };
  }, []);

  // 1. Available Courses
  const availableCourses = useMemo(() => {
    const list = Array.from(new Set(syllabusList.map(s => s.course).filter(Boolean)));
    const priority = ['B.Tech', 'BCA', 'MCA', 'MBA', 'B.Pharm', 'M.Tech'];
    return [
      ...priority.filter(c => list.includes(c)),
      ...list.filter(c => !priority.includes(c))
    ];
  }, [syllabusList]);

  // 2. Available Branches for Selected Course
  const availableBranches = useMemo(() => {
    const forCourse = syllabusList.filter(s => s.course === selectedCourse);
    const set = new Set(forCourse.map(s => s.branch).filter(Boolean));
    const arr = Array.from(set);

    if (selectedCourse === 'B.Tech') {
      const btechPriority = [
        'Common (All Branches)',
        'CSE',
        'IT',
        'AI & ML',
        'Data Science',
        'Cyber Security',
        'Computer Science & Design',
        'ECE',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Biotechnology',
        'Chemical Engineering',
        'Agriculture Engineering',
        'Automobile Engineering'
      ];
      return [
        ...btechPriority.filter(b => set.has(b)),
        ...arr.filter(b => !btechPriority.includes(b))
      ];
    }
    return arr;
  }, [syllabusList, selectedCourse]);

  // Synchronize Branch when Course changes
  useEffect(() => {
    if (availableBranches.length > 0 && !availableBranches.includes(selectedBranch)) {
      setSelectedBranch(availableBranches[0]);
    }
  }, [availableBranches, selectedBranch]);

  // 3. Available Academic Sessions for Selected Course & Branch
  const availableSessions = useMemo(() => {
    const matched = syllabusList.filter(s => 
      s.course === selectedCourse && 
      (selectedBranch === 'All' || s.branch === selectedBranch || s.branch === 'Common (All Branches)')
    );
    const sessions = Array.from(new Set(matched.map(s => s.academicSession).filter(Boolean))).sort().reverse();
    return ['All', ...sessions];
  }, [syllabusList, selectedCourse, selectedBranch]);

  // 4. Available Semesters for Selected Course, Branch, and Session
  const availableSemesters = useMemo(() => {
    if (selectedCourse === 'B.Tech') {
      if (selectedBranch === 'Common (All Branches)') {
        return ['Semester 1', 'Semester 2'];
      }
      return [
        'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
        'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
      ];
    }
    if (selectedCourse === 'MCA' || selectedCourse === 'MBA' || selectedCourse === 'M.Tech') {
      return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'];
    }
    if (selectedCourse === 'BCA') {
      return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];
    }
    if (selectedCourse === 'B.Pharm') {
      return [
        'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
        'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
      ];
    }
    return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'];
  }, [selectedCourse, selectedBranch]);

  // Synchronize Semester when Course or Branch changes
  useEffect(() => {
    if (availableSemesters.length > 0 && !availableSemesters.includes(selectedSemester)) {
      setSelectedSemester(availableSemesters[0]);
    }
  }, [availableSemesters, selectedSemester]);

  // Filtered Syllabus Records
  const filteredRecords = useMemo(() => {
    return syllabusList.filter(item => {
      // Course Match
      if (item.course !== selectedCourse) return false;

      // Branch Match (Common 1st year matches all B.Tech branches in Sem 1 & 2)
      if (selectedBranch && selectedBranch !== 'All') {
        const isFirstYearSem = selectedSemester === 'Semester 1' || selectedSemester === 'Semester 2';
        const isCommonBranch = item.branch === 'Common (All Branches)';
        const matchesBranch = item.branch === selectedBranch || (selectedCourse === 'B.Tech' && isFirstYearSem && isCommonBranch);
        if (!matchesBranch) return false;
      }

      // Academic Session Match
      if (selectedSession !== 'All' && item.academicSession !== selectedSession) {
        return false;
      }

      // Semester & Year Match
      if (selectedSemester && selectedSemester !== 'All') {
        const semNorm = selectedSemester.toLowerCase().replace('semester ', 'sem ');
        const itemSem = (item.semester || '').toLowerCase().replace('semester ', 'sem ');
        const inApplicable = Array.isArray(item.applicableSemesters) && 
          item.applicableSemesters.some(s => s.toLowerCase().replace('semester ', 'sem ') === semNorm);
        
        let matches = (itemSem === semNorm || inApplicable);

        if (!matches && item.isComprehensive && item.year) {
          const semNum = parseInt(selectedSemester.replace(/\D/g, ''), 10);
          const expectedYear = semNum ? (
            semNum <= 2 ? '1st' :
            semNum <= 4 ? '2nd' :
            semNum <= 6 ? '3rd' :
            '4th'
          ) : '';
          if (expectedYear && item.year.toLowerCase().includes(expectedYear)) {
            matches = true;
          }
        }

        if (!matches) {
          return false;
        }
      }

      // Search Query Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.subjectName && item.subjectName.toLowerCase().includes(q);
        const matchCode = item.subjectCode && item.subjectCode.toLowerCase().includes(q);
        const matchBranch = item.branch && item.branch.toLowerCase().includes(q);
        const matchUnits = Array.isArray(item.units) && item.units.some(u => 
          (u.title && u.title.toLowerCase().includes(q)) ||
          (u.topics && u.topics.toLowerCase().includes(q))
        );
        if (!matchName && !matchCode && !matchBranch && !matchUnits) {
          return false;
        }
      }

      return true;
    });
  }, [syllabusList, selectedCourse, selectedBranch, selectedSession, selectedSemester, searchQuery]);

  // Separate Comprehensive Document vs Individual Subjects
  const comprehensiveDoc = useMemo(() => {
    return filteredRecords.find(r => r.isComprehensive && r.officialPdfUrl) || 
      syllabusList.find(r => r.course === selectedCourse && (r.branch === selectedBranch || r.branch === 'Common (All Branches)') && r.isComprehensive);
  }, [filteredRecords, syllabusList, selectedCourse, selectedBranch]);

  const subjectRecords = useMemo(() => {
    return filteredRecords.filter(r => !r.isComprehensive);
  }, [filteredRecords]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCourse('B.Tech');
    setSelectedBranch('CSE');
    setSelectedSession('All');
    setSelectedSemester('Semester 3');
    setSearchQuery('');
  };

  return (
    <div style={{ backgroundColor: '#f9f7f1', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 1. LARGE ILLUSTRATED SYLLABUS HERO BANNER */}
      <section style={{
        position: 'relative',
        backgroundColor: '#FAF7F2',
        backgroundImage: `
          radial-gradient(rgba(200, 141, 45, 0.08) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #FAF7F2 0%, #EFE8DA 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '1.75rem 0 2rem 0',
        borderBottom: '2px solid #E8E2D5',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(200, 141, 45, 0.08), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr 340px',
            gap: '1.25rem',
            alignItems: 'center'
          }} className="syllabus-hero-grid">

            {/* LEFT: Virus Teacher Mascot & Speech Bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="syllabus-left-mascot">
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '0.6rem 0.85rem',
                marginBottom: '0.5rem',
                border: '2px solid #C88D2D',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1C1E21',
                fontFamily: "'Kalam', cursive",
                lineHeight: 1.3,
                textAlign: 'center',
                position: 'relative'
              }}>
                “Syllabus samajh liya? <br />
                Toh half battle jeet li!” <br />
                <span style={{ color: '#C88D2D' }}>— Virus</span>

                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '10px solid #C88D2D'
                }} />
              </div>

              <div style={{
                width: '240px',
                height: '200px',
                position: 'relative',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))'
              }}>
                <img
                  src="/assets/hero_board.png"
                  alt="AKTU Study Board"
                  loading="eager"
                  fetchpriority="high"
                  width={240}
                  height={200}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/syllabus_hero_students.png';
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
                  color: '#1F2421',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}>
                  Syllabus
                </h1>
                <BookOpen size={40} style={{ color: '#C88D2D' }} />
              </div>

              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#7A5835',
                fontSize: '1.35rem',
                fontWeight: 700,
                letterSpacing: '0.02em'
              }}>
                “Know What to Study. Plan Better.”
              </div>

              <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, maxWidth: '520px' }}>
                Official and verified AKTU curriculum PDFs, evaluation schemes, <br />
                branch-wise and semester-wise, all in one place.
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
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  border: '1px solid #E8E2D5'
                }}>
                  <Search size={18} style={{ color: '#7A5835', marginRight: '0.6rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search subject or code (e.g. Data Structures, BCS-301, Compiler...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#1C1E21',
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
                      backgroundColor: '#1F2421',
                      borderRadius: '9999px',
                      flexShrink: 0
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT: Shared All Izz Well Banner */}
            <AllIzzWellBanner title={"Padhai ka Tension?\nHum hai na ProfessorVirus! :)"} className="syllabus-right-mascot" />

          </div>

        </div>

        <style>{`
          @media (max-width: 1100px) {
            .syllabus-hero-grid { grid-template-columns: 1fr !important; justify-items: center !important; }
            .syllabus-left-mascot, .syllabus-right-mascot { display: none !important; }
          }
        `}</style>
      </section>

      {/* 2. BREADCRUMB */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5dfd3', padding: '0.65rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b' }}>
          <button onClick={() => onNavigate && onNavigate('home')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <HomeIcon size={14} /> Home
          </button>
          <span>&gt;</span>
          <span style={{ fontWeight: 700, color: '#1F2421' }}>Syllabus</span>
          <span>&gt;</span>
          <span style={{ fontWeight: 700, color: '#781416' }}>{selectedCourse}</span>
          <span>&gt;</span>
          <span style={{ fontWeight: 700, color: '#C88D2D' }}>{selectedBranch}</span>
          <span>&gt;</span>
          <span style={{ color: '#475569' }}>{selectedSemester}</span>
        </div>
      </div>

      {/* 3. MAIN THREE-COLUMN CONTENT LAYOUT */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 280px',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="syllabus-main-layout">

          {/* LEFT COLUMN: 5-LEVEL DYNAMIC FILTERS SIDEBAR */}
          <aside style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #E8E2D5',
            padding: '1.25rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.1rem',
              borderBottom: '2px solid #E8D3B0',
              paddingBottom: '0.65rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Filter size={18} style={{ color: '#781416' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                  Curriculum Filters
                </h3>
              </div>
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C88D2D',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Reset All
              </button>
            </div>

            {/* FILTER 1: COURSE SELECTION */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>1. SELECT COURSE / DEGREE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {availableCourses.map((cName) => {
                  const isSel = selectedCourse === cName;
                  return (
                    <button
                      key={cName}
                      onClick={() => setSelectedCourse(cName)}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '10px',
                        border: isSel ? '1.5px solid #781416' : '1px solid #E8E2D5',
                        backgroundColor: isSel ? '#FEF2F2' : '#FAF7F2',
                        color: isSel ? '#781416' : '#1F2421',
                        fontSize: '0.82rem',
                        fontWeight: isSel ? 800 : 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{cName}</span>
                      {isSel && <Check size={14} color="#781416" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FILTER 2: BRANCH / SPECIALIZATION */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>2. BRANCH / SPECIALIZATION</div>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: '1.5px solid #E8E2D5',
                  backgroundColor: '#FAF7F2',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#1F2421',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {availableBranches.map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
            </div>

            {/* FILTER 3: ACADEMIC YEAR / SESSION */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>3. ACADEMIC SESSION / YEAR</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.35rem' }}>
                {availableSessions.map((sess) => {
                  const isSel = selectedSession === sess;
                  return (
                    <button
                      key={sess}
                      onClick={() => setSelectedSession(sess)}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.7rem',
                        borderRadius: '8px',
                        border: isSel ? '1.5px solid #C88D2D' : '1px solid #E8E2D5',
                        backgroundColor: isSel ? '#FEF9EE' : '#FFFFFF',
                        color: isSel ? '#8A5D00' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: isSel ? 800 : 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{sess === 'All' ? 'All Sessions (Latest First)' : sess}</span>
                      {isSel && <Check size={13} color="#8A5D00" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FILTER 4: SEMESTER SELECTION */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>4. SEMESTER</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {availableSemesters.map((sem) => {
                  const isSemActive = selectedSemester === sem;
                  return (
                    <button
                      key={sem}
                      onClick={() => setSelectedSemester(sem)}
                      style={{
                        padding: '0.45rem 0.4rem',
                        borderRadius: '8px',
                        border: isSemActive ? '1.5px solid #781416' : '1px solid #E8E2D5',
                        backgroundColor: isSemActive ? '#781416' : '#FAF7F2',
                        color: isSemActive ? '#FFFFFF' : '#1F2421',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sem.replace('Semester ', 'Sem ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OFFICIAL PORTAL LINK */}
            <div style={{
              backgroundColor: '#FEF9EE',
              border: '1px solid #E8D3B0',
              borderRadius: '12px',
              padding: '0.85rem',
              marginTop: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8A5D00', fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} />
                <span>AKTU Official Portal</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
                Authoritative syllabi from Dr. A.P.J. Abdul Kalam Technical University (Lucknow).
              </p>
              <a
                href="https://aktu.ac.in/syllabus.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#781416',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>Visit aktu.ac.in/syllabus</span>
                <ExternalLink size={12} />
              </a>
            </div>

          </aside>

          {/* CENTER COLUMN: COMPREHENSIVE CURRICULUM + SUBJECTS CARDS */}
          <main>
            {/* Degree Course Top Pills */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              marginBottom: '1.25rem',
              paddingBottom: '0.2rem'
            }}>
              {availableCourses.map((cName) => {
                const isSel = selectedCourse === cName;
                return (
                  <button
                    key={cName}
                    onClick={() => {
                      setSelectedCourse(cName);
                    }}
                    style={{
                      padding: '0.45rem 1.05rem',
                      borderRadius: '9999px',
                      border: isSel ? '1.5px solid #781416' : '1px solid #E8E2D5',
                      backgroundColor: isSel ? '#781416' : '#FFFFFF',
                      color: isSel ? '#FFFFFF' : '#1F2421',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isSel ? '0 2px 8px rgba(120,20,22,0.22)' : 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    {cName}
                  </button>
                );
              })}
            </div>

            {/* CURRICULUM HEADER BANNER */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E8E2D5',
              padding: '1.25rem 1.4rem',
              marginBottom: '1.25rem',
              boxShadow: '0 2px 8px rgba(35,30,25,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    padding: '0.15rem 0.6rem',
                    borderRadius: '9999px'
                  }}>
                    {selectedCourse} • {selectedBranch}
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    backgroundColor: '#FEF9EE',
                    color: '#8A5D00',
                    border: '1px solid #E8D3B0',
                    padding: '0.15rem 0.6rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <ShieldCheck size={13} />
                    Verified Official Curriculum
                  </span>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                  {selectedCourse} {selectedBranch} — {selectedSemester}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                  Open genuine AKTU syllabus PDFs directly using “View Syllabus” or explore unit breakdowns.
                </p>
              </div>

              {/* View Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FAF7F2',
                border: '1px solid #E8E2D5',
                borderRadius: '8px',
                padding: '0.2rem'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? '#1F2421' : 'transparent',
                    color: viewMode === 'grid' ? '#FFFFFF' : '#64748B',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Grid size={13} /> Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'list' ? '#1F2421' : 'transparent',
                    color: viewMode === 'list' ? '#FFFFFF' : '#64748B',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <List size={13} /> List
                </button>
              </div>
            </div>

            {/* COMPREHENSIVE SEMESTER/BRANCH OFFICIAL CURRICULUM DOCUMENT CARD */}
            {comprehensiveDoc && (
              <div style={{
                backgroundColor: '#FEFBF6',
                border: '2px solid #E8D3B0',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 14px rgba(200, 141, 45, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: '1 1 320px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    border: '1.5px solid #FECACA',
                    color: '#781416',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <BookOpen size={24} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        backgroundColor: '#8A5D00',
                        color: '#FFFFFF',
                        padding: '0.1rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        COMPLETE CURRICULUM
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                        Session: {comprehensiveDoc.academicSession}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1F2421', margin: 0, lineHeight: 1.3 }}>
                      {comprehensiveDoc.subjectName}
                    </h3>

                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                      Complete official AKTU syllabus document containing evaluation schemes, credit matrix, and all subjects.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActivePdfModal(comprehensiveDoc)}
                    style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 6px rgba(120,20,22,0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <FileText size={15} />
                    <span>View Full Syllabus PDF</span>
                  </button>

                  <a
                    href={comprehensiveDoc.officialPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      backgroundColor: '#FEF9EE',
                      border: '1.5px solid #E8D3B0',
                      color: '#8A5D00',
                      padding: '0.55rem 0.95rem',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Download size={15} />
                    <span>Download</span>
                  </a>

                  <a
                    href={comprehensiveDoc.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E2D5',
                      color: '#475569',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>AKTU Source</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}

            {/* SUBJECTS SECTION HEADING */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                Subjects for {selectedSemester} ({subjectRecords.length} found)
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                Source: Official AKTU (aktu.ac.in)
              </span>
            </div>

            {/* SUBJECT-WISE CARDS GRID / LIST */}
            {subjectRecords.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(290px, 1fr))' : '1fr',
                gap: '1rem'
              }}>
                {subjectRecords.map((sub, sIdx) => {
                  const hasPdf = Boolean(sub.officialPdfUrl);
                  const hasUnits = Array.isArray(sub.units) && sub.units.length > 0;

                  return (
                    <div
                      key={sub.id || sIdx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #E8E2D5',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        boxShadow: '0 3px 12px rgba(35,30,25,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.85rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C88D2D';
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(200, 141, 45, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E8E2D5';
                        e.currentTarget.style.boxShadow = '0 3px 12px rgba(35,30,25,0.03)';
                      }}
                    >
                      {/* Top Badges */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: '#781416',
                            backgroundColor: '#FEF2F2',
                            padding: '0.12rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #FECACA'
                          }}>
                            {sub.subjectCode || `${sub.course} ${sub.semester}`}
                          </span>

                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#8A5D00',
                            backgroundColor: '#FEF9EE',
                            padding: '0.12rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #E8D3B0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <ShieldCheck size={12} />
                            Official AKTU
                          </span>
                        </div>

                        {/* Subject Title */}
                        <h4 style={{
                          fontSize: '1.02rem',
                          fontWeight: 800,
                          color: '#1F2421',
                          margin: '0.2rem 0 0.4rem 0',
                          lineHeight: 1.3
                        }}>
                          {sub.subjectName}
                        </h4>

                        {/* Credits & Scheme Metadata */}
                        <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>
                          <span>{sub.credits || 4} Credits</span>
                          <span style={{ margin: '0 0.35rem', color: '#CBD5E1' }}>•</span>
                          <span>Scheme: {sub.evalScheme || '30-70 Marks'}</span>
                          <span style={{ margin: '0 0.35rem', color: '#CBD5E1' }}>•</span>
                          <span style={{ color: '#C88D2D', fontWeight: 700 }}>{sub.academicSession}</span>
                        </div>
                      </div>

                      {/* Units Summary Chips (if available) */}
                      {hasUnits && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.2rem 0' }}>
                          {sub.units.slice(0, 3).map((u, uIdx) => (
                            <span
                              key={uIdx}
                              style={{
                                fontSize: '0.7rem',
                                color: '#475569',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D5',
                                borderRadius: '6px',
                                padding: '0.15rem 0.45rem'
                              }}
                            >
                              Unit {u.unitNo || uIdx + 1}: {u.title.replace(/^Unit\s*[I|V|X\d]+:\s*/i, '').slice(0, 18)}...
                            </span>
                          ))}
                          {sub.units.length > 3 && (
                            <span style={{ fontSize: '0.7rem', color: '#781416', fontWeight: 700, padding: '0.15rem 0.3rem' }}>
                              +{sub.units.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* ACTIONS ROW */}
                      <div style={{
                        borderTop: '1px solid #F1ECE1',
                        paddingTop: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.45rem'
                      }}>
                        {/* Primary View Syllabus Button */}
                        {hasPdf ? (
                          <button
                            onClick={() => setActivePdfModal(sub)}
                            style={{
                              backgroundColor: '#781416',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '0.42rem 0.9rem',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              boxShadow: '0 2px 6px rgba(120,20,22,0.22)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <FileText size={14} />
                            <span>View Syllabus</span>
                          </button>
                        ) : (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#94A3B8',
                            backgroundColor: '#F8FAFC',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <AlertCircle size={12} />
                            Official syllabus PDF not available yet
                          </span>
                        )}

                        {/* Secondary Actions: Download, Unit Topics, Official Source */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {hasPdf && (
                            <a
                              href={sub.officialPdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              title="Download PDF"
                              style={{
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D5',
                                color: '#1F2421',
                                padding: '0.4rem 0.55rem',
                                borderRadius: '7px',
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none'
                              }}
                            >
                              <Download size={14} />
                            </a>
                          )}

                          {hasUnits && (
                            <button
                              onClick={() => setActiveUnitModal(sub)}
                              title="View Unit Topics Breakdown"
                              style={{
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D5',
                                color: '#781416',
                                padding: '0.4rem 0.65rem',
                                borderRadius: '7px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <BookOpen size={13} />
                              <span>Units</span>
                            </button>
                          )}

                          <a
                            href={sub.officialSourceUrl || sub.officialPdfUrl || 'https://aktu.ac.in/syllabus.html'}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open Official University Source"
                            style={{
                              backgroundColor: '#FAF7F2',
                              border: '1px solid #E8E2D5',
                              color: '#64748B',
                              padding: '0.4rem 0.55rem',
                              borderRadius: '7px',
                              display: 'flex',
                              alignItems: 'center',
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px dashed #E8E2D5'
              }}>
                <BookOpen size={42} color="#94A3B8" style={{ marginBottom: '0.85rem' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.4rem 0' }}>
                  No subject records found for this combination
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
                  {comprehensiveDoc 
                    ? `You can view the complete official AKTU curriculum PDF for ${selectedCourse} ${selectedBranch} using the banner above.`
                    : 'Official university curriculum updates are monitored and verified as soon as AKTU releases new syllabus revisions.'}
                </p>
                {comprehensiveDoc && (
                  <button
                    onClick={() => setActivePdfModal(comprehensiveDoc)}
                    style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '9999px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <FileText size={15} />
                    <span>Open {comprehensiveDoc.subjectName}</span>
                  </button>
                )}
              </div>
            )}
          </main>

          {/* RIGHT COLUMN: AI STUDY BUDDY + USEFUL RESOURCES */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* CARD 1: ASK VIRUS STUDY BUDDY */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #E8D3B0',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  backgroundColor: '#FEF9EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #E8D3B0', overflow: 'hidden'
                }}>
                  <img
                    src="/assets/virus_avatar.png"
                    alt="Virus AI"
                    width={38}
                    height={38}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/ai_virus.png';
                    }}
                  />
                </div>

                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1F2421', lineHeight: 1.2 }}>
                    Ask Virus <span style={{ fontSize: '0.74rem', color: '#C88D2D' }}>(AI Study Buddy)</span>
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, marginBottom: '1rem' }}>
                Get unit-wise explanations, important syllabus topics, and exam-oriented guidance from AI.
              </p>

              <button
                onClick={onOpenAI}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  fontSize: '0.88rem',
                  backgroundColor: '#1F2421',
                  gap: '0.4rem',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Ask Now <ArrowRight size={16} />
              </button>
            </div>

            {/* CARD 2: USEFUL RESOURCES */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #E8E2D5',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Filter size={16} style={{ color: '#C88D2D' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2421' }}>
                  Useful Resources
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { name: 'AKTU Official Website', url: 'https://aktu.ac.in', icon: Globe },
                  { name: 'Official Syllabus Archive', url: 'https://aktu.ac.in/syllabus.html', icon: ShieldCheck },
                  { name: 'Previous Year Papers (PYQs)', action: () => onNavigate && onNavigate('pyqs'), icon: FileText },
                  { name: 'Verified Study Notes', action: () => onNavigate && onNavigate('notes'), icon: BookOpen },
                  { name: 'ATS Resume Maker', action: () => onNavigate && onNavigate('resume-maker'), icon: FileText }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.action) item.action();
                      else if (item.url) window.open(item.url, '_blank');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1px solid #E8E2D5',
                      backgroundColor: '#FAF7F2',
                      color: '#334155',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FDF6E8';
                      e.currentTarget.style.borderColor = '#C88D2D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FAF7F2';
                      e.currentTarget.style.borderColor = '#E8E2D5';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <item.icon size={14} style={{ color: '#C88D2D' }} />
                      <span>{item.name}</span>
                    </div>
                    <ArrowRight size={14} style={{ color: '#94a3b8' }} />
                  </button>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* MODAL 1: ACTUAL OFFICIAL AKTU PDF VIEWER MODAL */}
      {activePdfModal && (
        <SyllabusPdfViewerModal
          syllabus={activePdfModal}
          onClose={() => setActivePdfModal(null)}
        />
      )}

      {/* MODAL 2: SUPPLEMENTARY UNIT TOPICS MODAL */}
      {activeUnitModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '640px', width: '100%',
            padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', maxHeight: '85vh', overflowY: 'auto'
          }}>
            <button onClick={() => setActiveUnitModal(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={22} />
            </button>

            <div style={{ borderBottom: '2px solid #E8D3B0', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#781416', backgroundColor: '#FEF2F2', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                  {activeUnitModal.subjectCode}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A5D00' }}>
                  • {activeUnitModal.credits || 4} Credits • Scheme: {activeUnitModal.evalScheme}
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                {activeUnitModal.subjectName} — Unit Topics
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                Supplementary unit breakdown corresponding to verified AKTU syllabus.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activeUnitModal.units && activeUnitModal.units.length > 0 ? (
                activeUnitModal.units.map((u, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '14px', padding: '1rem'
                  }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                      {u.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.35rem', lineHeight: 1.4 }}>
                      <strong>Topics:</strong> {u.topics}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                  Unit topics details not individually listed for this record. Please view the full official PDF.
                </div>
              )}
            </div>

            {/* Modal Bottom Action: View Official PDF directly */}
            {activeUnitModal.officialPdfUrl && (
              <div style={{ borderTop: '1px solid #E8E2D5', marginTop: '1.25rem', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  onClick={() => {
                    const doc = activeUnitModal;
                    setActiveUnitModal(null);
                    setActivePdfModal(doc);
                  }}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <FileText size={15} />
                  <span>View Official PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM ACADEMIC RESOURCE BANNER */}
      <AcademicResourceBanner onNavigate={onNavigate} />

      <style>{`
        @media (max-width: 1024px) {
          .syllabus-main-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
}

// Helper Styles
const filterTitleStyle = {
  fontSize: '0.72rem',
  fontWeight: 800,
  color: '#64748b',
  letterSpacing: '0.04em',
  marginBottom: '0.45rem'
};
