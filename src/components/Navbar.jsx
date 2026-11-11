import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
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
  Zap,
  Download,
  Home as HomeIcon,
  HelpCircle,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import { searchLocalIndex } from '../data/searchIndex';
import { openInstallModal } from '../utils/pwaManager';

export default function Navbar({ onSearch, onOpenAuth, activeTab, setActiveTab, isHome = false }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [notesDropdownOpen, setNotesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedSearchIdx, setSelectedSearchIdx] = useState(-1);

  const userMenuRef = useRef(null);
  const moreMenuRef = useRef(null);
  const notesMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);

  // Scroll state for sticky Liquid Glass blur & elevation
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Authenticated Student State
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    localStorage.removeItem('professorvirus_token');
    localStorage.removeItem('professorvirus_user');
    sessionStorage.removeItem('professorvirus_token');
    sessionStorage.removeItem('professorvirus_user');
    localStorage.removeItem('campusprep_auth_user');
    setCurrentUser(null);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event('auth_state_changed'));
    if (setActiveTab) setActiveTab('home');
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
      if (notesMenuRef.current && !notesMenuRef.current.contains(e.target)) {
        setNotesDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setMoreDropdownOpen(false);
        setNotesDropdownOpen(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (tabId) => {
    if (setActiveTab) setActiveTab(tabId);
    setUserMenuOpen(false);
    setMoreDropdownOpen(false);
    setNotesDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search Logic
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

  return (
    <>
      <header
        style={{
          width: 'calc(100% - 2.5rem)',
          maxWidth: '1360px',
          margin: scrolled ? '8px auto 0 auto' : '14px auto 0 auto',
          borderRadius: '9999px',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.86)' : 'rgba(255, 255, 255, 0.68)',
          backdropFilter: 'blur(20px) saturate(185%)',
          WebkitBackdropFilter: 'blur(20px) saturate(185%)',
          border: '1.5px solid rgba(255, 255, 255, 0.72)',
          boxShadow: scrolled
            ? '0 12px 36px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)'
            : '0 8px 30px rgba(15, 23, 42, 0.08)',
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'auto',
          boxSizing: 'border-box'
        }}
        className="pv-liquid-glass-navbar"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px',
            padding: '0 1.25rem',
            boxSizing: 'border-box'
          }}
        >
          {/* ===================================================================
              1. LEFT: OFFICIAL PROFESSORVIRUS BRAND LOGO & TYPOGRAPHY
              =================================================================== */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
              aria-label="ProfessorVirus Home"
            >
              <img
                src="/assets/pv_official_logo.png"
                alt="ProfessorVirus Logo"
                style={{
                  width: '34px',
                  height: '34px',
                  objectFit: 'contain',
                  flexShrink: 0
                }}
                onError={(e) => {
                  e.target.src = '/assets/logo.png';
                }}
              />
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: '#0F172A',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>Professor</span>
                <span style={{ color: '#881337' }}>Virus</span>
              </div>
            </a>
          </div>

          {/* ===================================================================
              2. CENTER: NAVIGATION ITEMS (Match Reference Image 1 & 2)
              =================================================================== */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              margin: '0 0.4rem',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap'
            }}
            className="pv-desktop-nav-items"
          >
            {/* Home Link (Active Pill in Burgundy or Indicator) */}
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="pv-nav-pill-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: activeTab === 'home' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'home' ? '#881337' : 'transparent',
                color: activeTab === 'home' ? '#FFFFFF' : '#334155',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'home' ? 800 : 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'home') e.currentTarget.style.color = '#881337';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'home') e.currentTarget.style.color = '#334155';
              }}
            >
              <HomeIcon size={14} strokeWidth={2.4} />
              <span>Home</span>
            </button>

            {/* HOOLLOW AI Link */}
            <button
              type="button"
              onClick={() => handleNavigate('hoollow')}
              className="pv-nav-pill-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: activeTab === 'hoollow' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'hoollow' ? '#881337' : 'transparent',
                color: activeTab === 'hoollow' ? '#FFFFFF' : '#334155',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'hoollow' ? 800 : 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'hoollow') e.currentTarget.style.color = '#881337';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'hoollow') e.currentTarget.style.color = '#334155';
              }}
            >
              <Sparkles size={14} color={activeTab === 'hoollow' ? '#FFFFFF' : '#881337'} />
              <span>HOOLLOW</span>
            </button>

            {/* PYQs Link */}
            <button
              type="button"
              onClick={() => handleNavigate('pyqs')}
              className="pv-nav-pill-btn"
              style={{
                padding: activeTab === 'pyqs' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'pyqs' ? '#881337' : 'transparent',
                color: activeTab === 'pyqs' ? '#FFFFFF' : '#334155',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'pyqs' ? 800 : 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'pyqs') e.currentTarget.style.color = '#881337';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'pyqs') e.currentTarget.style.color = '#334155';
              }}
            >
              PYQs
            </button>

            {/* Notes with Dropdown */}
            <div style={{ position: 'relative' }} ref={notesMenuRef}>
              <button
                type="button"
                onClick={() => handleNavigate('notes')}
                className="pv-nav-pill-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: activeTab === 'notes' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: activeTab === 'notes' ? '#881337' : 'transparent',
                  color: activeTab === 'notes' ? '#FFFFFF' : '#334155',
                  fontSize: '0.84rem',
                  fontWeight: activeTab === 'notes' ? 800 : 600,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'notes') e.currentTarget.style.color = '#881337';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'notes') e.currentTarget.style.color = '#334155';
                }}
              >
                <span>Notes</span>
                <ChevronDown size={13} />
              </button>
            </div>

            {/* Syllabus */}
            <button
              type="button"
              onClick={() => handleNavigate('syllabus')}
              className="pv-nav-pill-btn"
              style={{
                padding: activeTab === 'syllabus' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'syllabus' ? '#881337' : 'transparent',
                color: activeTab === 'syllabus' ? '#FFFFFF' : '#334155',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'syllabus' ? 800 : 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'syllabus') e.currentTarget.style.color = '#881337';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'syllabus') e.currentTarget.style.color = '#334155';
              }}
            >
              Syllabus
            </button>

            {/* Quizzes */}
            <button
              type="button"
              onClick={() => handleNavigate('quizzes')}
              className="pv-nav-pill-btn"
              style={{
                padding: activeTab === 'quizzes' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'quizzes' ? '#881337' : 'transparent',
                color: activeTab === 'quizzes' ? '#FFFFFF' : '#334155',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'quizzes' ? 800 : 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'quizzes') e.currentTarget.style.color = '#881337';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'quizzes') e.currentTarget.style.color = '#334155';
              }}
            >
              Quizzes
            </button>

            {/* Resume Maker */}
            <button
              type="button"
              onClick={() => handleNavigate('resume-maker')}
              className="pv-nav-pill-btn"
              style={{
                padding: activeTab === 'resume-maker' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'resume-maker' ? '#881337' : 'transparent',
                color: activeTab === 'resume-maker' ? '#FFFFFF' : '#334155',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'resume-maker' ? 800 : 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'resume-maker') e.currentTarget.style.color = '#881337';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'resume-maker') e.currentTarget.style.color = '#334155';
              }}
            >
              Resume Maker
            </button>

            {/* Interview Pro with Beta Pill */}
            <button
              type="button"
              onClick={() => handleNavigate('interview-pro')}
              className="pv-nav-pill-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: activeTab === 'interview-pro' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'interview-pro' ? '#881337' : 'transparent',
                color: activeTab === 'interview-pro' ? '#FFFFFF' : '#334155',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'interview-pro' ? 800 : 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'interview-pro') e.currentTarget.style.color = '#881337';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'interview-pro') e.currentTarget.style.color = '#334155';
              }}
            >
              <span>Interview Pro</span>
              <span
                style={{
                  backgroundColor: '#EA580C',
                  color: '#FFFFFF',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '999px'
                }}
              >
                Beta
              </span>
            </button>

            {/* Result & CGPA */}
            <button
              type="button"
              onClick={() => handleNavigate('result-cgpa')}
              className="pv-nav-pill-btn"
              style={{
                padding: activeTab === 'result-cgpa' ? '0.42rem 0.95rem' : '0.42rem 0.75rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: activeTab === 'result-cgpa' ? '#881337' : 'transparent',
                color: activeTab === 'result-cgpa' ? '#FFFFFF' : '#334155',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'result-cgpa' ? 800 : 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'result-cgpa') e.currentTarget.style.color = '#881337';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'result-cgpa') e.currentTarget.style.color = '#334155';
              }}
            >
              Result & CGPA
            </button>

            {/* More Menu Dropdown */}
            <div style={{ position: 'relative' }} ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(prev => !prev)}
                className="pv-nav-pill-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.42rem 0.75rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: moreDropdownOpen ? '#F1F5F9' : 'transparent',
                  color: '#334155',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <span>More</span>
                <ChevronDown size={13} />
              </button>

              {moreDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '16px',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
                    padding: '0.5rem',
                    zIndex: 1000
                  }}
                >
                  {[
                    { label: 'PRMA Tech Internships', id: 'prma-internships-home', icon: Rocket, badge: 'New' },
                    { label: 'Attendance Calculator', id: 'attendance-calculator', icon: Calendar },
                    { label: 'PDF Maker & Tools', id: 'pdf-maker', icon: FileText },
                    { label: 'Timetable Planner', id: 'timetable', icon: Clock },
                    { label: 'Competitive Exams', id: 'competitive-exams', icon: Award },
                    { label: 'Scholarships Directory', id: 'scholarships', icon: GraduationCap },
                    { label: 'Important Portals', id: 'important-links', icon: Link2 },
                    { label: 'Install App (PWA)', id: 'install-pwa', action: () => openInstallModal('navbar_more'), icon: Download }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (item.action) {
                            item.action();
                            setMoreDropdownOpen(false);
                          } else {
                            handleNavigate(item.id);
                          }
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#0F172A',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon size={16} color="#881337" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.1rem 0.4rem', borderRadius: '999px' }}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ===================================================================
              3. RIGHT: NOTIFICATIONS & LOGIN/PROFILE (Matching Reference Design)
              =================================================================== */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {/* Notification Bell Icon with Badge "2" */}
            <button
              type="button"
              onClick={() => handleNavigate('interview-pro')}
              title="2 New Updates"
              className="pv-nav-action-btn"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}
              >
                2
              </span>
            </button>

            {/* Login / User Profile Pill (Match Reference Image 1 & 2) */}
            {currentUser ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(prev => !prev)}
                  className="pv-nav-action-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.25rem 0.75rem 0.25rem 0.35rem',
                    borderRadius: '999px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0F172A',
                      fontWeight: 900,
                      fontSize: '0.82rem'
                    }}
                  >
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                      {currentUser.name ? currentUser.name.split(' ')[0] : 'Priyanshu'}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 600 }}>
                      B.Tech CSE
                    </div>
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '200px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '16px',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.1)',
                      padding: '0.5rem',
                      zIndex: 1000
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                        {currentUser.name || 'Priyanshu'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {currentUser.email || 'student@aktu.ac.in'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigate('progress')}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 0.75rem',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Profile & Progress
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 0.75rem',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#DC2626',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth ? onOpenAuth() : handleNavigate('signin')}
                className="pv-nav-action-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: '999px',
                  backgroundColor: '#881337',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(136, 19, 55, 0.25)'
                }}
              >
                <User size={14} />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                cursor: 'pointer'
              }}
              className="pv-mobile-nav-toggle pv-nav-action-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              padding: '1rem 1.5rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
            className="pv-mobile-dropdown-pane"
          >
            {[
              { name: 'Home', id: 'home', icon: HomeIcon },
              { name: 'HOOLLOW AI Study', id: 'hoollow', icon: Sparkles },
              { name: 'AKTU PYQs', id: 'pyqs', icon: FileText },
              { name: 'Subject Notes', id: 'notes', icon: BookOpen },
              { name: 'Branch Syllabus', id: 'syllabus', icon: Layers },
              { name: 'Quizzes & Practice', id: 'quizzes', icon: Zap },
              { name: 'ATS Resume Maker', id: 'resume-maker', icon: FileText },
              { name: 'Interview Pro AI', id: 'interview-pro', icon: Briefcase },
              { name: 'Result & CGPA', id: 'result-cgpa', icon: BarChart2 },
              { name: 'PRMA Tech Internships', id: 'prma-internships-home', icon: Rocket }
            ].map((link, i) => {
              const Icon = link.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleNavigate(link.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: activeTab === link.id ? '#FFF1F2' : '#F8FAFC',
                    color: activeTab === link.id ? '#881337' : '#0F172A',
                    fontSize: '0.92rem',
                    fontWeight: activeTab === link.id ? 800 : 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={18} color={activeTab === link.id ? '#881337' : '#64748B'} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Navigation Micro-Interactions & Responsive Breakpoints CSS */}
      <style>{`
        .pv-nav-pill-btn {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
          user-select: none;
        }
        .pv-nav-pill-btn:hover {
          transform: translateY(-1px);
        }
        .pv-nav-pill-btn:active {
          transform: scale(0.95) !important;
        }
        .pv-nav-action-btn {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
          user-select: none;
        }
        .pv-nav-action-btn:hover {
          transform: translateY(-1px);
        }
        .pv-nav-action-btn:active {
          transform: scale(0.93) !important;
        }
        @media (max-width: 1180px) {
          .pv-desktop-nav-items {
            display: none !important;
          }
          .pv-mobile-nav-toggle {
            display: flex !important;
          }
          .pv-liquid-glass-navbar {
            width: calc(100% - 1.5rem) !important;
            margin: 8px auto 0 !important;
          }
        }
        @media (max-width: 640px) {
          .pv-liquid-glass-navbar {
            width: calc(100% - 1rem) !important;
            margin: 6px auto 0 !important;
            border-radius: 999px !important;
          }
          .pv-install-btn {
            display: none !important;
          }
          .pv-navbar-subtitle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
