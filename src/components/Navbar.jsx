import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  MessageSquare,
  User,
  Bell,
  Briefcase,
  FileText,
  Code2,
  BarChart2,
  Compass,
  Link2,
  Clock,
  CheckCircle2,
  Layers,
  Award,
  ArrowRight,
  LogOut,
  Calendar,
  FileText as FileTextIcon,
  Zap
} from 'lucide-react';
import { searchLocalIndex } from '../data/searchIndex';

export default function Navbar({ onSearch, onOpenAuth, activeTab, setActiveTab }) {
  const [theme, setTheme] = useState('light');
  const [menuPanelOpen, setMenuPanelOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [panelSearchQuery, setPanelSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedSearchIdx, setSelectedSearchIdx] = useState(-1);

  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);

  // Authenticated Student State (Loaded from localStorage / sessionStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('professorvirus_user') || sessionStorage.getItem('professorvirus_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('professorvirus_user') || sessionStorage.getItem('professorvirus_user');
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth_state_changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth_state_changed', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('professorvirus_token');
    localStorage.removeItem('professorvirus_user');
    sessionStorage.removeItem('professorvirus_token');
    sessionStorage.removeItem('professorvirus_user');
    setCurrentUser(null);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event('auth_state_changed'));
    if (setActiveTab) setActiveTab('home');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    document.body.classList.toggle('dark-mode');
  };

  // Click outside & Escape key listeners + body scroll lock for mobile drawer
  useEffect(() => {
    if (menuPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuPanelOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuPanelOpen]);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'PYQs', id: 'pyqs' },
    { name: 'Notes', id: 'notes' },
    { name: 'Syllabus', id: 'syllabus' },
    { name: 'Quizzes', id: 'quizzes' },
    { name: 'Interview Pro', id: 'interview-pro' },
    { name: 'More', id: 'more' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedSearchIdx >= 0 && searchResults[selectedSearchIdx]) {
      const item = searchResults[selectedSearchIdx];
      handleNavigate(item.route);
      setSearchQuery('');
      setSearchResults([]);
      setSearchFocused(false);
    } else if (searchQuery.trim()) {
      if (onSearch) onSearch(searchQuery);
      setSearchResults([]);
      setSearchFocused(false);
    }
  };

  // Debounced search on query change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedSearchIdx(-1);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (val.trim().length >= 2) {
        const results = searchLocalIndex(val, 8);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 150);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIdx(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIdx(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedSearchIdx >= 0 && searchResults[selectedSearchIdx]) {
        e.preventDefault();
        handleSearchResultClick(searchResults[selectedSearchIdx]);
      }
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (item) => {
    if ((item.type === 'Subject' || item.type === 'Branch') && onSearch) {
      onSearch(item.title);
    } else {
      handleNavigate(item.route);
    }
    setSearchQuery('');
    setSearchResults([]);
    setSearchFocused(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedSearchIdx(-1);
  };

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutsideSearch = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideSearch);
    return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
  }, []);

  const handlePanelSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && panelSearchQuery.trim()) {
      onSearch(panelSearchQuery.trim());
      setMenuPanelOpen(false);
    }
  };

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    setMenuPanelOpen(false);
    setUserMenuOpen(false);
  };

  // EXACTLY 3 LOGICAL SECTIONS FOR MENU PANEL
  const menuSections = [
    {
      title: 'Core Academics',
      description: 'Course curriculum, previous exams, verified notes & assessments',
      badge: 'Academics',
      items: [
        {
          id: 'pyqs',
          title: 'Question Papers (PYQs)',
          desc: 'AKTU, BCA, MCA past papers & solutions',
          icon: <FileText size={18} color="#781416" />,
          tag: 'AKTU',
          tagColor: '#781416',
          tagBg: '#FEF2F2'
        },
        {
          id: 'notes',
          title: 'Notes & Study Materials',
          desc: 'Verified handwritten, faculty notes & Quantum',
          icon: <BookOpen size={18} color="#C88D2D" />,
          tag: '5K+ Docs',
          tagColor: '#8A5D00',
          tagBg: '#FEF9EE'
        },
        {
          id: 'syllabus',
          title: 'Syllabus & Units',
          desc: 'Official curriculum, course units & credit scheme',
          icon: <Layers size={18} color="#0D9488" />,
          tag: 'Updated',
          tagColor: '#0F766E',
          tagBg: '#F0FDFA'
        },
        {
          id: 'quizzes',
          title: 'Practice Quizzes',
          desc: 'Interactive subject quizzes & mock tests',
          icon: <Sparkles size={18} color="#2563EB" />,
          tag: 'Interactive',
          tagColor: '#1D4ED8',
          tagBg: '#EFF6FF'
        },
        {
          id: 'home',
          title: 'Choose Your Course Hub',
          desc: 'B.Tech, BCA, MCA, MBA & B.Pharm curricula',
          icon: <GraduationCap size={18} color="#7C3AED" />,
          tag: '5 Degrees',
          tagColor: '#6D28D9',
          tagBg: '#F5F3FF'
        }
      ]
    },
    {
      title: 'Student Productivity & Utilities',
      description: 'Calculators, routine planners, PDF converters & academic engines',
      badge: 'Productivity',
      items: [
        {
          id: 'result-cgpa',
          title: 'Result & CGPA Analyzer',
          desc: 'AKTU marksheet parser, SGPA engine & active backlog tracker',
          icon: <Award size={18} color="#DC2626" />,
          tag: 'Smart Engine',
          tagColor: '#B91C1C',
          tagBg: '#FEF2F2'
        },
        {
          id: 'attendance-calculator',
          title: 'Attendance Calculator',
          desc: '75% target requirement, bunk planner & live tracking',
          icon: <BarChart2 size={18} color="#D97706" />,
          tag: 'Bunk Planner',
          tagColor: '#B45309',
          tagBg: '#FFFBEB'
        },
        {
          id: 'timetable',
          title: 'Time Table & Schedule',
          desc: 'Weekly routine, PDF extraction, live next class & .ics export',
          icon: <Clock size={18} color="#0284C7" />,
          tag: 'Adaptive',
          tagColor: '#0369A1',
          tagBg: '#F0F9FF'
        },
        {
          id: 'pdf-maker',
          title: 'PDF Maker & Studio',
          desc: 'Merge 100+ pages, convert JPG/PNG, split, watermark & sign',
          icon: <FileText size={18} color="#EA580C" />,
          tag: '100+ Pgs',
          tagColor: '#C2410C',
          tagBg: '#FFF7ED'
        },
        {
          id: 'resume-maker',
          title: '1-Page Resume Maker',
          desc: 'Clean ATS-friendly single page college resume builder',
          icon: <FileText size={18} color="#16A34A" />,
          tag: 'ATS Format',
          tagColor: '#15803D',
          tagBg: '#F0FDF4'
        },
        {
          id: 'progress',
          title: 'Progress & Goal Tracker',
          desc: 'Track semester milestones, target CGPA & subject attendance',
          icon: <CheckCircle2 size={18} color="#4F46E5" />,
          tag: 'Tracker',
          tagColor: '#4338CA',
          tagBg: '#EEF2FF'
        }
      ]
    },
    {
      title: 'Career & Opportunities',
      description: 'Interviews, placement training, guidance, grants & real code',
      badge: 'Opportunities',
      items: [
        {
          id: 'interview-pro',
          title: 'Interview Pro',
          desc: 'AI mock interviews, company technical coding & HR practice',
          icon: <Briefcase size={18} color="#781416" />,
          tag: 'Beta',
          tagColor: '#FFFFFF',
          tagBg: '#D48816'
        },
        {
          id: 'competitive-exams',
          title: 'Competitive Exams & Careers',
          desc: 'What can I do after my course? Guidance for 14+ degrees',
          icon: <Compass size={18} color="#781416" />,
          tag: '14+ Degrees',
          tagColor: '#781416',
          tagBg: '#FEF2F2'
        },
        {
          id: 'internships-jobs',
          title: 'Internships & Jobs',
          desc: 'Verified student internships, off-campus drives & tech roles',
          icon: <Briefcase size={18} color="#0D9488" />,
          tag: 'Verified',
          tagColor: '#0F766E',
          tagBg: '#F0FDFA'
        },
        {
          id: 'scholarships',
          title: 'Scholarships & Grants',
          desc: 'Govt & corporate grants with verified official portal links',
          icon: <GraduationCap size={18} color="#C88D2D" />,
          tag: 'Grants',
          tagColor: '#8A5D00',
          tagBg: '#FEF9EE'
        },
        {
          id: 'project-ideas',
          title: 'Project Ideas & Repos',
          desc: 'Curated capstone & mini projects with real GitHub source code',
          icon: <Code2 size={18} color="#2563EB" />,
          tag: 'Real Code',
          tagColor: '#1D4ED8',
          tagBg: '#EFF6FF'
        },
        {
          id: 'important-links',
          title: 'Important University Links',
          desc: 'Official AKTU ERP, circulars, exam portals & university resources',
          icon: <Link2 size={18} color="#475569" />,
          tag: 'Portals',
          tagColor: '#334155',
          tagBg: '#F1F5F9'
        }
      ]
    }
  ];

  return (
    <header
      className="pv-desktop-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(251, 249, 243, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid rgba(234, 229, 217, 0.9)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}
      >
        {/* LEFT WRAPPER: Menu, Complete ProfessorVirus Brand, and Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => setMenuPanelOpen(true)}
            title="Open Complete Academic & Tools Menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.42rem 0.85rem',
              borderRadius: '9999px',
              border: '1.5px solid #E8E2D5',
              backgroundColor: '#FFFFFF',
              color: '#1F2421',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(35,30,25,0.04)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C88D2D';
              e.currentTarget.style.color = '#C88D2D';
              e.currentTarget.style.backgroundColor = '#FEF9EE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E8E2D5';
              e.currentTarget.style.color = '#1F2421';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <Menu size={16} />
            <span style={{ whiteSpace: 'nowrap' }}>Menu</span>
          </button>

          <div
            style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', cursor: 'pointer', flexShrink: 0, marginLeft: '1.25rem' }}
            onClick={() => handleNavigate('home')}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #C88D2D',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(200, 141, 45, 0.2)',
                transition: 'transform 0.2s ease',
                flexShrink: 0
              }}
            >
              <img
                src="/assets/navbar_logo.png"
                alt="ProfessorVirus Mascot"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: '1.45rem',
                  color: '#1F2421',
                  lineHeight: 1.1,
                  letterSpacing: '0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>Professor</span><span style={{ color: '#C88D2D' }}>Virus</span>
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#7A6F62',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap'
                }}
              >
                Study Smart. Prepare Better.
              </div>
            </div>
          </div>

          {/* CENTER: Navigation Links (Desktop — Strict Single-Line / No Wrap) — 24px Gap from Brand */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '24px',
              gap: '0.3rem',
              flexWrap: 'nowrap',
              flexShrink: 0
            }}
            className="desktop-nav"
          >
          {navItems.map((item) => {
            const isActive =
              activeTab === item.id ||
              (item.id === 'interview-pro' &&
                (activeTab === 'aistudy' ||
                  activeTab === 'interview-confirm' ||
                  activeTab === 'interview-instructions' ||
                  activeTab === 'interview-start'));



            if (item.id === 'interview-pro') {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate('interview-pro')}
                  style={{
                    backgroundColor: isActive ? '#781416' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#2D3238',
                    padding: isActive ? '0.42rem 1.05rem' : '0.42rem 0.85rem',
                    borderRadius: '9999px',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 14px rgba(120, 20, 22, 0.32)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#781416';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#2D3238';
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Interview Pro</span>
                  <span
                    style={{
                      backgroundColor: '#D48816',
                      color: '#FFFFFF',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '0.1rem 0.42rem',
                      borderRadius: '9999px',
                      lineHeight: 1.15,
                      letterSpacing: '0.02em',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    Beta
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`nav-link-item ${isActive ? 'active' : ''}`}
                style={{
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 3px 10px rgba(200,141,45,0.28)' : 'none'
                }}
              >
                {item.name}
              </button>
            );
          })}
          </nav>
        </div>

        {/* RIGHT: Search, Theme, Notifications, User Profile & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0, marginLeft: 'auto' }}>
          {/* Quick Search Field with Real-Time Dropdown */}
          <div
            ref={searchRef}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            className="desktop-search"
          >
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
              <Search
                size={15}
                style={{ position: 'absolute', left: '12px', color: searchFocused ? '#C88D2D' : '#909AA4', transition: 'color 0.2s ease', zIndex: 2 }}
                className="search-icon"
              />
              <input
                type="text"
                placeholder="Search subjects, topics, PYQs..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => { setSearchFocused(true); if (searchQuery.trim().length >= 2) { setSearchResults(searchLocalIndex(searchQuery, 8)); } }}
                onKeyDown={handleSearchKeyDown}
                className="navbar-search-input"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  padding: '0.48rem 2.2rem 0.48rem 2.2rem',
                  borderRadius: '9999px',
                  border: searchFocused ? '1.5px solid #C88D2D' : '1.5px solid #E8E2D5',
                  backgroundColor: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#1C1E21',
                  width: '260px',
                  outline: 'none',
                  boxShadow: searchFocused ? '0 4px 16px rgba(200,141,45,0.12)' : '0 2px 8px rgba(35,30,25,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
                  transition: 'all 0.2s ease'
                }}
              />
              {/* Clear (X) button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; e.currentTarget.style.color = '#1F2421'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}
                >
                  <X size={13} />
                </button>
              )}
            </form>

            {/* SEARCH RESULTS DROPDOWN */}
            {searchFocused && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '340px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E8E2D5',
                borderRadius: '16px',
                boxShadow: '0 20px 48px rgba(35, 30, 25, 0.16)',
                zIndex: 1000,
                overflow: 'hidden',
                maxHeight: '420px',
                overflowY: 'auto'
              }}>
                <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #F1F5F9' }}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </div>
                {searchResults.map((item, idx) => {
                  const isSelected = idx === selectedSearchIdx;
                  const typeColorMap = { Page: '#781416', Tool: '#C88D2D', Subject: '#047857', Career: '#2563EB', Branch: '#7C3AED', Interview: '#EA580C' };
                  const typeColor = typeColorMap[item.type] || '#64748B';
                  return (
                    <div
                      key={`${item.route}-${idx}`}
                      onClick={() => handleSearchResultClick(item)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#FEF9EE' : 'transparent',
                        borderLeft: isSelected ? '3px solid #C88D2D' : '3px solid transparent',
                        transition: 'all 0.12s ease'
                      }}
                      onMouseEnter={(e) => {
                        setSelectedSearchIdx(idx);
                        e.currentTarget.style.backgroundColor = '#FEF9EE';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected ? '#FEF9EE' : 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1F2421', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: typeColor,
                        backgroundColor: `${typeColor}12`,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        flexShrink: 0,
                        marginLeft: '0.5rem'
                      }}>
                        {item.type}
                      </span>
                    </div>
                  );
                })}
                {searchQuery.trim().length >= 2 && (
                  <div
                    onClick={() => { if (onSearch) onSearch(searchQuery); setSearchFocused(false); setSearchResults([]); }}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderTop: '1px solid #F1F5F9',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#C88D2D',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF9EE'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Search all notes for "{searchQuery}" →
                  </div>
                )}
              </div>
            )}

            {/* No results state */}
            {searchFocused && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '300px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E8E2D5',
                borderRadius: '16px',
                boxShadow: '0 20px 48px rgba(35, 30, 25, 0.16)',
                zIndex: 1000,
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748B', marginBottom: '0.3rem' }}>No matches found</div>
                <div
                  onClick={() => { if (onSearch) onSearch(searchQuery); setSearchFocused(false); }}
                  style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C88D2D', cursor: 'pointer' }}
                >
                  Search in Notes database →
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid #E8E2D5',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1C1E21',
              boxShadow: '0 2px 6px rgba(35,30,25,0.05)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notification Bell with Badge 1 */}
          <button
            onClick={() => handleNavigate('interview-pro')}
            title="1 New Placement Notification"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid #E8E2D5',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1C1E21',
              boxShadow: '0 2px 6px rgba(35,30,25,0.05)',
              position: 'relative',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 5px rgba(220, 38, 38, 0.4)'
              }}
            >
              1
            </span>
          </button>

          {/* User Profile / Auth Action Area */}
          {currentUser ? (
            <div style={{ position: 'relative' }} ref={userMenuRef} className="desktop-user-profile">
              <div
                onClick={() => setUserMenuOpen((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.24rem 0.65rem 0.24rem 0.25rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #E8E2D5',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(35,30,25,0.04)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C88D2D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E8E2D5';
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: '1.5px solid #C88D2D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    flexShrink: 0
                  }}
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}</span>
                  )}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814', whiteSpace: 'nowrap' }}>
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'Student'}
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#7A6F62', whiteSpace: 'nowrap' }}>
                    {currentUser.course || 'B.Tech'} {currentUser.branch || 'CSE'}
                  </div>
                </div>
                <ChevronDown size={14} color="#7A6F62" />
              </div>

              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #E8E2D5',
                    borderRadius: '14px',
                    boxShadow: '0 16px 36px rgba(35,30,25,0.12)',
                    minWidth: '230px',
                    padding: '0.55rem',
                    zIndex: 120,
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  <div style={{ padding: '0.45rem 0.75rem', borderBottom: '1px solid #F0E8D9', marginBottom: '0.35rem' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1C1814' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#7A6F62' }}>{currentUser.email || `${currentUser.course || 'B.Tech'} Student`}</div>
                  </div>
                  <button
                    style={dropdownBtnStyle}
                    onClick={() => {
                      handleNavigate('interview-pro');
                    }}
                  >
                    <Briefcase size={14} style={{ color: '#0284C7' }} /> Interview Pro Dashboard
                  </button>
                  <button
                    style={dropdownBtnStyle}
                    onClick={() => {
                      handleNavigate('notes');
                    }}
                  >
                    <BookOpen size={14} style={{ color: '#C88D2D' }} /> My Notes &amp; Saved PYQs
                  </button>
                  <button
                    style={dropdownBtnStyle}
                    onClick={() => {
                      if (onOpenAuth) onOpenAuth('login');
                      setUserMenuOpen(false);
                    }}
                  >
                    <User size={14} style={{ color: '#7C3AED' }} /> Switch Account
                  </button>
                  <div style={{ borderTop: '1px solid #F0E8D9', marginTop: '0.3rem', paddingTop: '0.3rem' }}>
                    <button
                      style={{ ...dropdownBtnStyle, color: '#DC2626' }}
                      onClick={handleLogout}
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="btn-outline"
                style={{
                  fontSize: '0.82rem',
                  padding: '0.38rem 0.95rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="btn-primary"
                style={{
                  fontSize: '0.82rem',
                  padding: '0.38rem 1.05rem',
                  borderRadius: '9999px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMenuPanelOpen(true)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1F2421',
              padding: '0.4rem'
            }}
            className="mobile-menu-toggle"
            title="Open Menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ANIMATED MENU PANEL — EXACTLY 3 LOGICAL SECTIONS WITH BACKDROP BLUR      */}
      {/* ========================================================================= */}
      {menuPanelOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(28, 30, 33, 0.58)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'flex-start',
            animation: 'fadeInDrawer 0.22s ease-out'
          }}
          onClick={() => setMenuPanelOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '490px',
              height: '100vh',
              backgroundColor: '#FAF7F2',
              boxShadow: '12px 0 45px rgba(28, 30, 33, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1.5px solid #E8E2D5',
              overflow: 'hidden',
              animation: 'slideInLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* PANEL HEADER */}
            <div
              style={{
                padding: '1.25rem 1.4rem',
                borderBottom: '1.5px solid #E8E2D5',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #C88D2D',
                    backgroundColor: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(200, 141, 45, 0.15)',
                    flexShrink: 0
                  }}
                >
                  <img
                    src="/assets/navbar_logo.png"
                    alt="ProfessorVirus Mascot"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 900,
                      fontSize: '1.3rem',
                      color: '#1F2421',
                      lineHeight: 1.1,
                      letterSpacing: '0.01em',
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>Professor</span><span style={{ color: '#C88D2D' }}>Virus</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7A6F62' }}>
                    Student Platform • 3 Main Portals
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMenuPanelOpen(false)}
                title="Close Menu (Esc)"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1.5px solid #E8E2D5',
                  backgroundColor: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#1F2421',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F2421';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF7F2';
                  e.currentTarget.style.color = '#1F2421';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* SEARCH BAR WITHIN PANEL */}
            <div style={{ padding: '0.9rem 1.4rem', borderBottom: '1px solid #E8E2D5', backgroundColor: '#FFFFFF', flexShrink: 0 }}>
              <form onSubmit={handlePanelSearchSubmit} style={{ position: 'relative' }}>
                <Search
                  size={15}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#909AA4' }}
                />
                <input
                  type="text"
                  placeholder="Quick search any feature, subject or tool..."
                  value={panelSearchQuery}
                  onChange={(e) => setPanelSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                    borderRadius: '12px',
                    border: '1.5px solid #E8E2D5',
                    backgroundColor: '#FAF7F2',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#1C1E21',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </form>
            </div>

            {/* SCROLLABLE 3 LOGICAL SECTIONS CONTAINER */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem 1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.4rem'
              }}
            >
              {menuSections.map((section, sIdx) => (
                <div
                  key={section.title}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E8E2D5',
                    padding: '1.15rem 1.1rem',
                    boxShadow: '0 2px 10px rgba(35,30,25,0.03)'
                  }}
                >
                  {/* Section Title & Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          backgroundColor: '#781416',
                          color: '#FFFFFF',
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {sIdx + 1}
                      </span>
                      <h3
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '0.98rem',
                          fontWeight: 800,
                          color: '#1F2421',
                          margin: 0,
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {section.title}
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        backgroundColor: '#F3EFE6',
                        color: '#6B6155',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '9999px'
                      }}
                    >
                      {section.badge}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.74rem', color: '#7A6F62', lineHeight: 1.35 }}>
                    {section.description}
                  </p>

                  {/* Section Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {section.items.map((item) => {
                      const isItemActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.55rem 0.7rem',
                            borderRadius: '11px',
                            border: isItemActive ? '1.5px solid #C88D2D' : '1px solid #F0ECE1',
                            backgroundColor: isItemActive ? '#FEF9EE' : '#FAF8F4',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.16s ease',
                            width: '100%'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#C88D2D';
                            e.currentTarget.style.transform = 'translateX(3px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isItemActive ? '#FEF9EE' : '#FAF8F4';
                            e.currentTarget.style.borderColor = isItemActive ? '#C88D2D' : '#F0ECE1';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E8E2D5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {item.icon}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: '0.84rem',
                                  fontWeight: 700,
                                  color: isItemActive ? '#781416' : '#1F2421',
                                  lineHeight: 1.2
                                }}
                              >
                                {item.title}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#7A6F62', lineHeight: 1.2 }}>
                                {item.desc}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                            <span
                              style={{
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                padding: '0.12rem 0.45rem',
                                borderRadius: '9999px',
                                backgroundColor: item.tagBg,
                                color: item.tagColor,
                                border: `1px solid ${item.tagColor}30`,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.tag}
                            </span>
                            <ArrowRight size={13} color="#94A3B8" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* PANEL FOOTER */}
            <div
              style={{
                padding: '0.9rem 1.4rem',
                borderTop: '1.5px solid #E8E2D5',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#7A6F62', fontWeight: 600 }}>
                Press <kbd style={{ padding: '0.1rem 0.35rem', backgroundColor: '#F3EFE6', borderRadius: '4px', border: '1px solid #E8E2D5' }}>Esc</kbd> or click outside to close
              </div>
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('login');
                  setMenuPanelOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#781416',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>Student Login</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES FOR ANIMATIONS & RESPONSIVE RULES */}
      <style>{`
        @keyframes fadeInDrawer {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .desktop-nav {
          display: flex;
        }
        .mobile-menu-toggle {
          display: none;
        }
        @media (max-width: 1080px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: inline-flex !important;
          }
          .desktop-search {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .desktop-user-profile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

const dropdownBtnStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#334155',
  fontSize: '0.82rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'backgroundColor 0.15s ease'
};

const compactDropdownItemStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '0.45rem 0.65rem',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  transition: 'background-color 0.15s ease',
  textDecoration: 'none'
};
