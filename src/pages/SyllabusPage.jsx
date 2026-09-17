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
  ChevronRight
} from 'lucide-react';

export default function SyllabusPage({ onNavigate, onOpenAI }) {
  // Navigation & Filter States
  const [selectedBranch, setSelectedBranch] = useState(null); // If selected, shows branch detail view
  const [filterBranch, setFilterBranch] = useState([]);
  const [filterYear, setFilterYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState(null);

  // 6 Primary Branches
  const branches = [
    {
      id: 'cse',
      code: 'CSE',
      name: 'Computer Science Engineering (CSE)',
      semestersCount: 8,
      status: 'Latest Syllabus',
      icon: Code,
      bgColor: '#e6f4ed',
      iconColor: '#0d5c3a',
      borderColor: '#a7f3d0'
    },
    {
      id: 'ece',
      code: 'ECE',
      name: 'Electronics & Communication (ECE)',
      semestersCount: 8,
      status: 'Latest Syllabus',
      icon: Cpu,
      bgColor: '#fef3c7',
      iconColor: '#d97706',
      borderColor: '#fde68a'
    },
    {
      id: 'me',
      code: 'ME',
      name: 'Mechanical Engineering (ME)',
      semestersCount: 8,
      status: 'Latest Syllabus',
      icon: Wrench,
      bgColor: '#fce7f3',
      iconColor: '#db2777',
      borderColor: '#fbcfe8'
    },
    {
      id: 'ce',
      code: 'CE',
      name: 'Civil Engineering (CE)',
      semestersCount: 8,
      status: 'Latest Syllabus',
      icon: Building2,
      bgColor: '#e0f2fe',
      iconColor: '#0284c7',
      borderColor: '#bae6fd'
    },
    {
      id: 'it',
      code: 'IT',
      name: 'Information Technology (IT)',
      semestersCount: 8,
      status: 'Latest Syllabus',
      icon: Radio,
      bgColor: '#f3e8ff',
      iconColor: '#9333ea',
      borderColor: '#e9d5ff'
    },
    {
      id: 'ee',
      code: 'EE',
      name: 'Electrical Engineering (EE)',
      semestersCount: 8,
      status: 'Latest Syllabus',
      icon: Zap,
      bgColor: '#e0e7ff',
      iconColor: '#4f46e5',
      borderColor: '#c7d2fe'
    }
  ];

  // Official AKTU B.Tech Verified Syllabus Dataset (Structured according to AKTU Curriculum)
  const aktuSyllabusData = {
    cse: [
      {
        sem: 'Sem 3',
        year: '2nd Year',
        subjects: [
          {
            code: 'KCS-301 / BCS-301',
            name: 'Data Structures',
            credits: 4,
            evalScheme: '30-70 Marks',
            units: [
              { title: 'Unit I: Introduction & Stacks', topics: 'Arrays, Sparse Matrices, Stacks, Recursion, Evaluation of Expressions' },
              { title: 'Unit II: Queues & Linked Lists', topics: 'Singly, Doubly, Circular Linked Lists, Priority Queues, Deque' },
              { title: 'Unit III: Trees & Binary Search Trees', topics: 'Trees Traversal, BST Operations, AVL Trees, Threaded Trees' },
              { title: 'Unit IV: Graphs & Hashing', topics: 'Graph Representation, BFS, DFS, Shortest Paths, Hash Functions, Collision Resolution' },
              { title: 'Unit V: Sorting & Searching', topics: 'Insertion, Selection, Bubble, Quick, Merge, Heap Sort, File Structures' }
            ]
          },
          {
            code: 'KCS-302 / BCS-302',
            name: 'Computer Organization & Architecture',
            credits: 4,
            evalScheme: '30-70 Marks',
            units: [
              { title: 'Unit I: Functional Units', topics: 'Register Transfer, Bus Architecture, Arithmetic Logic Unit' },
              { title: 'Unit II: Control Unit Architecture', topics: 'Hardwired vs Microprogrammed Control Unit, Instruction Formats' },
              { title: 'Unit III: Memory Hierarchy', topics: 'RAM, ROM, Cache Memory Mapping, Virtual Memory' },
              { title: 'Unit IV: Input-Output Organization', topics: 'Peripheral Devices, DMA Controller, Interrupts, I/O Processors' },
              { title: 'Unit V: Pipeline & Multiprocessors', topics: 'Pipelining, Hazards, Vector Processing, RISC vs CISC' }
            ]
          },
          {
            code: 'KCS-303 / BCS-303',
            name: 'Discrete Structures & Theory of Logic',
            credits: 4,
            evalScheme: '30-70 Marks',
            units: [
              { title: 'Unit I: Set Theory & Relations', topics: 'Sets, Relations, Equivalence, Partial Order, Lattice' },
              { title: 'Unit II: Algebraic Structures', topics: 'Groups, Subgroups, Cyclic Groups, Rings, Fields' },
              { title: 'Unit III: Propositional & Predicate Logic', topics: 'Tautology, Inference Rules, Proof Techniques' },
              { title: 'Unit IV: Combinatorics & Recurrence', topics: 'Pigeonhole Principle, Permutations, Generating Functions' },
              { title: 'Unit V: Graph Theory', topics: 'Isomorphism, Eulerian & Hamiltonian Graphs, Planar Graphs' }
            ]
          }
        ]
      },
      {
        sem: 'Sem 4',
        year: '2nd Year',
        subjects: [
          {
            code: 'KCS-401 / BCS-401',
            name: 'Operating Systems',
            credits: 4,
            evalScheme: '30-70 Marks',
            units: [
              { title: 'Unit I: Introduction & OS Structure', topics: 'System Calls, OS Structure, Processes, Process Control Block' },
              { title: 'Unit II: CPU Scheduling & Synchronization', topics: 'FCFS, SJF, Round Robin, Semaphores, Monitors, Classical Problems' },
              { title: 'Unit III: Deadlocks', topics: 'Characterization, Banker\'s Algorithm, Prevention, Detection, Recovery' },
              { title: 'Unit IV: Memory Management', topics: 'Paging, Segmentation, Virtual Memory, Page Replacement (FIFO, LRU, Optimal)' },
              { title: 'Unit V: File & I/O Systems', topics: 'Disk Scheduling (SSTF, SCAN, C-SCAN), Directory Structure, Security' }
            ]
          },
          {
            code: 'KCS-402 / BCS-402',
            name: 'Theory of Automata & Formal Languages (TAFL)',
            credits: 4,
            evalScheme: '30-70 Marks',
            units: [
              { title: 'Unit I: Finite Automata', topics: 'DFA, NFA, NFA to DFA conversion, Mealy & Moore Machines' },
              { title: 'Unit II: Regular Expressions & Languages', topics: 'Pumping Lemma, Regular Grammars, Closure Properties' },
              { title: 'Unit III: Context-Free Grammars', topics: 'Derivation Trees, Ambiguity, Chomsky & Greibach Normal Forms' },
              { title: 'Unit IV: Pushdown Automata (PDA)', topics: 'Deterministic & Non-deterministic PDA, Equivalence with CFG' },
              { title: 'Unit V: Turing Machines & Computability', topics: 'Halting Problem, Undecidability, Post Correspondence Problem' }
            ]
          }
        ]
      }
    ]
  };

  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      if (filterBranch.length > 0 && !filterBranch.includes(b.code)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = b.code.toLowerCase().includes(q);
        const matchName = b.name.toLowerCase().includes(q);
        if (!matchCode && !matchName) return false;
      }
      return true;
    });
  }, [branches, filterBranch, searchQuery]);

  const handleResetFilters = () => {
    setFilterBranch([]);
    setFilterYear(null);
    setSearchQuery('');
    setSelectedBranch(null);
  };

  return (
    <div style={{ backgroundColor: '#f9f7f1', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 1. LARGE ILLUSTRATED SYLLABUS HERO BANNER */}
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
          }} className="syllabus-hero-grid">

            {/* LEFT: Virus Teacher Mascot & Speech Bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="syllabus-left-mascot">
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
                “Syllabus samajh liya? <br />
                Toh half battle jeet li!” <br />
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
                  src="/assets/syllabus_hero_virus.png"
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
                  Syllabus
                </h1>
                <BookOpen size={40} style={{ color: '#34d399', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
              </div>

              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fde047',
                fontSize: '1.35rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                “Know What to Study. Plan Better.”
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 500, maxWidth: '520px' }}>
                Get the latest and official AKTU B.Tech syllabus, <br />
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
                  boxShadow: '0 8px 25px rgba(0,0,0,0.35), 0 0 0 3px rgba(52,211,153,0.25)',
                  border: '1px solid #cbd5e1'
                }}>
                  <Search size={18} style={{ color: '#64748b', marginRight: '0.6rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search syllabus (e.g. CSE Sem 3, DBMS, Operating System...)"
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="syllabus-right-mascot">
              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fef08a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '0.3rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}>
                Padhai ka Tension? <br />
                Hum hai na CampusPrep! :)
              </div>

              <div style={{
                width: '310px',
                height: '190px',
                position: 'relative',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
              }}>
                <img
                  src="/assets/syllabus_hero_students.png"
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
                width: '150px',
                padding: '0.55rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1e293b',
                lineHeight: 1.3,
                boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
                transform: 'rotate(-5deg)'
              }}>
                <div>✓ Official Syllabus</div>
                <div>✓ Unit-wise Topics</div>
                <div>✓ Latest Updates</div>
                <div>✓ Exam Pattern</div>
                <div>✓ Plan Your Preparation</div>
                <div style={{ color: '#047857', fontFamily: "'Kalam', cursive", textAlign: 'right', marginTop: '0.2rem' }}>
                  — CampusPrep :)
                </div>
              </div>
            </div>

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
          <span style={{ fontWeight: 700, color: '#0e4d34' }}>Syllabus</span>
          {selectedBranch && (
            <>
              <span>&gt;</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>{selectedBranch.code}</span>
            </>
          )}
        </div>
      </div>

      {/* 3. MAIN THREE-COLUMN CONTENT LAYOUT */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr 280px',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="syllabus-main-layout">

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
                      checked={filterBranch.includes(b)}
                      onChange={() => {
                        setFilterBranch(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
                      }}
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
                {[
                  { name: '1st Year', sem: 'Sem 1 & 2', color: '#e6f4ed', text: '#0d5c3a' },
                  { name: '2nd Year', sem: 'Sem 3 & 4', color: '#fffbeb', text: '#d97706' },
                  { name: '3rd Year', sem: 'Sem 5 & 6', color: '#fef2f2', text: '#dc2626' },
                  { name: '4th Year', sem: 'Sem 7 & 8', color: '#f5f3ff', text: '#7c3aed' }
                ].map(y => (
                  <div
                    key={y.name}
                    onClick={() => setFilterYear(filterYear === y.name ? null : y.name)}
                    style={{
                      backgroundColor: filterYear === y.name ? '#0d5c3a' : y.color,
                      color: filterYear === y.name ? '#ffffff' : y.text,
                      borderRadius: '10px',
                      padding: '0.6rem 0.4rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{y.name}</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.8 }}>{y.sem}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>QUICK LINKS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { name: 'Official AKTU Syllabus', url: 'https://aktu.ac.in/syllabus.html' },
                  { name: 'Exam Scheme', url: 'https://aktu.ac.in/circulars.html' },
                  { name: 'Credit System', url: 'https://aktu.ac.in' },
                  { name: 'Download All (Branch-wise)', url: '#' }
                ].map((l, idx) => (
                  <a
                    key={idx}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: '#334155',
                      fontWeight: 600,
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{l.name}</span>
                    <ArrowRight size={13} style={{ color: '#0d5c3a' }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quote Box at bottom of sidebar */}
            <div style={{
              backgroundColor: '#e6f4ed',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '0.75rem',
              fontFamily: "'Kalam', cursive",
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#0e4d34',
              textAlign: 'center'
            }}>
              “Syllabus is not just a list, <br />
              it's your roadmap to success.” <br />
              <span style={{ color: '#059669' }}>— Virus :)</span>
            </div>
          </aside>

          {/* CENTER COLUMN: BROWSE SYLLABUS BY BRANCH OR BRANCH DETAIL VIEW */}
          <main>
            {!selectedBranch ? (
              <>
                {/* Header Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                      Browse Syllabus by Branch
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.1rem' }}>
                      Select your branch to explore semester-wise syllabus, subjects, and detailed topics.
                    </p>
                  </div>

                  {/* Grid/List Toggle */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.2rem'
                  }}>
                    <button
                      onClick={() => setViewMode('grid')}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: viewMode === 'grid' ? '#0d5c3a' : 'transparent',
                        color: viewMode === 'grid' ? '#ffffff' : '#64748b',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Grid size={13} /> Grid View
                    </button>

                    <button
                      onClick={() => setViewMode('list')}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: viewMode === 'list' ? '#0d5c3a' : 'transparent',
                        color: viewMode === 'list' ? '#ffffff' : '#64748b',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <List size={13} /> List View
                    </button>
                  </div>
                </div>

                {/* 6 BRANCH CARDS GRID */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid' ? '1fr 1fr' : '1fr',
                  gap: '1rem'
                }}>
                  {filteredBranches.map(b => {
                    const BIcon = b.icon;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBranch(b)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '18px',
                          padding: '1.35rem 1.15rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.borderColor = '#0d5c3a';
                          e.currentTarget.style.boxShadow = '0 8px 22px rgba(13,92,58,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0px)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.02)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                          <div style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '14px',
                            backgroundColor: b.bgColor,
                            color: b.iconColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <BIcon size={24} />
                          </div>

                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                              {b.name}
                            </h3>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid #f1f5f9',
                          paddingTop: '0.75rem',
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: 600
                        }}>
                          <div>
                            <span>{b.semestersCount} Semesters</span>
                            <span style={{ margin: '0 0.4rem', color: '#cbd5e1' }}>|</span>
                            <span style={{ color: '#059669', fontWeight: 700 }}>{b.status}</span>
                          </div>

                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#f1f5f9',
                            color: '#0d5c3a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* DETAILED BRANCH SYLLABUS VIEW FOR SELECTED BRANCH */
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  backgroundColor: '#ffffff',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      backgroundColor: selectedBranch.bgColor, color: selectedBranch.iconColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <selectedBranch.icon size={22} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        {selectedBranch.name} Syllabus
                      </h2>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        AKTU B.Tech Curriculum • Verified Official Data Source
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBranch(null)}
                    className="btn-outline"
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
                  >
                    ← Back to All Branches
                  </button>
                </div>

                {/* Display Semesters & Verified AKTU Syllabus Subjects */}
                {aktuSyllabusData.cse.map((semData, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1.5px solid #e2e8f0',
                    padding: '1.25rem',
                    marginBottom: '1.25rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '2px solid #e6f4ed',
                      paddingBottom: '0.65rem',
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0d5c3a' }}>
                        {semData.sem} ({semData.year})
                      </h3>
                      <span style={{ fontSize: '0.78rem', backgroundColor: '#e6f4ed', color: '#0d5c3a', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                        {semData.subjects.length} Subjects
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {semData.subjects.map((sub, sIdx) => (
                        <div key={sIdx} style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '14px',
                          padding: '1rem 1.15rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>
                                Code: {sub.code} • {sub.credits} Credits • Scheme: {sub.evalScheme}
                              </div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '0.1rem' }}>
                                {sub.name}
                              </h4>
                            </div>

                            <button
                              onClick={() => setSelectedSubjectDetail(sub)}
                              className="btn-primary"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem', backgroundColor: '#0d5c3a' }}
                            >
                              View Unit Details
                            </button>
                          </div>

                          {/* Unit Summary List */}
                          <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                            {sub.units.map((u, uIdx) => (
                              <div key={uIdx} style={{ fontSize: '0.75rem', color: '#475569', backgroundColor: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                <strong>{u.title.split(':')[0]}:</strong> {u.title.split(':')[1]}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. LARGE BOTTOM ILLUSTRATED BANNER */}
            <div style={{
              marginTop: '2.5rem',
              borderRadius: '24px',
              backgroundColor: '#f4eee0',
              backgroundImage: `linear-gradient(135deg, #f9f6ed 0%, #efe7d4 100%)`,
              border: '2px solid #e5dfd3',
              boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
              padding: '1.25rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: '260px 1fr 200px',
              gap: '1.25rem',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }} className="syllabus-bottom-banner">

              {/* Left: Virus drinking tea */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '95px',
                  height: '95px',
                  position: 'relative',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                  flexShrink: 0
                }}>
                  <img
                    src="/assets/syllabus_bottom_full.png"
                    alt="Virus Character"
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
                  Sahi Syllabus <br />
                  Sahi Strategy <br />
                  <span style={{ color: '#059669', fontSize: '1.2rem' }}>Higher CGPA!</span>
                </div>
              </div>

              {/* Center: Campus Students Artwork */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '190px',
                  height: '100px',
                  position: 'relative',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
                }}>
                  <img
                    src="/assets/notes_bottom_students.png"
                    alt="AKTU Campus Students"
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
                Padho <br />
                Plan karo <br />
                Grow karo <br />
                <span style={{ color: '#059669' }}>— CampusPrep :)</span>
              </div>

            </div>

          </main>

          {/* RIGHT COLUMN: AI STUDY BUDDY + USEFUL RESOURCES */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* CARD 1: NEED HELP UNDERSTANDING? ASK VIRUS */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, marginBottom: '0.4rem' }}>
                Need Help Understanding?
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  overflow: 'hidden', border: '2px solid #0d5c3a', flexShrink: 0
                }}>
                  <img
                    src="/assets/syllabus_ai_virus.png"
                    alt="Virus AI"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/ai_virus.png';
                    }}
                  />
                </div>

                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    Ask Virus <span style={{ fontSize: '0.74rem', color: '#059669' }}>(AI Study Buddy)</span>
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, marginBottom: '1rem' }}>
                Get unit-wise explanations, important topics, and exam-oriented guidance from AI.
              </p>

              <button
                onClick={onOpenAI}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  fontSize: '0.88rem',
                  backgroundColor: '#0d5c3a',
                  gap: '0.4rem'
                }}
              >
                Ask Now <ArrowRight size={16} />
              </button>
            </div>

            {/* CARD 2: USEFUL RESOURCES */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Filter size={16} style={{ color: '#0d5c3a' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Useful Resources
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { name: 'AKTU Official Website', url: 'https://aktu.ac.in', icon: Globe },
                  { name: 'Previous Year Papers', action: () => onNavigate && onNavigate('pyqs'), icon: FileText },
                  { name: 'Subject-wise Notes', action: () => onNavigate && onNavigate('notes'), icon: BookOpen },
                  { name: 'Exam Preparation Tips', action: () => alert('Exam Preparation Tips coming soon!'), icon: Lightbulb },
                  { name: 'Academic Calendar', action: () => alert('Official AKTU Academic Calendar'), icon: Calendar }
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
                      border: '1px solid #f1f5f9',
                      backgroundColor: '#f8fafc',
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
                      e.currentTarget.style.backgroundColor = '#e6f4ed';
                      e.currentTarget.style.borderColor = '#a7f3d0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#f1f5f9';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <item.icon size={14} style={{ color: '#0d5c3a' }} />
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

      {/* UNIT DETAILS MODAL WHEN VIEWING SUBJECT UNITS */}
      {selectedSubjectDetail && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '640px', width: '100%',
            padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', maxHeight: '85vh', overflowY: 'auto'
          }}>
            <button onClick={() => setSelectedSubjectDetail(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={22} />
            </button>

            <div style={{ borderBottom: '2px solid #e6f4ed', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669' }}>
                AKTU Code: {selectedSubjectDetail.code} • {selectedSubjectDetail.credits} Credits
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {selectedSubjectDetail.name} Syllabus Units
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {selectedSubjectDetail.units.map((u, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1rem'
                }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0d5c3a' }}>
                    {u.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.35rem', lineHeight: 1.4 }}>
                    <strong>Official Topics:</strong> {u.topics}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .syllabus-main-layout { grid-template-columns: 1fr !important; }
          .syllabus-bottom-banner { grid-template-columns: 1fr !important; text-align: center !important; }
        }
      `}</style>

    </div>
  );
}

// Helper Styles
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
