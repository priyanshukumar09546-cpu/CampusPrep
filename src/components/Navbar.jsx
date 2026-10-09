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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Click outside & Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'PYQs', id: 'pyqs' },
    { name: 'Notes', id: 'notes' },
    { name: 'Syllabus', id: 'syllabus' },
    { name: 'Quizzes', id: 'quizzes' },
    { name: 'Resume Maker', id: 'resume-maker' },
    { name: 'Interview Pro', id: 'interview-pro', isBeta: true },
    { name: 'Result & CGPA', id: 'result-cgpa' },
    { name: 'More +', id: 'more' },
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

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    setUserMenuOpen(false);
  };

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
        className="container pv-main-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '66px',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* LEFT WRAPPER: Complete ProfessorVirus Brand and Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, minWidth: 0 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => handleNavigate('home')}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #C88D2D',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(200, 141, 45, 0.18)',
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
                  fontSize: '1.25rem',
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
                className="pv-logo-subtitle"
                style={{
                  fontSize: '0.62rem',
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

          {/* CENTER: Navigation Links (Desktop — Strict Single-Line / No Wrap) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '0.65rem',
              gap: '0.14rem',
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

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="nav-link-item"
                style={{
                  position: 'relative',
                  backgroundColor: 'transparent',
                  color: isActive ? '#781416' : '#2D3238',
                  padding: '0.3rem 0.38rem',
                  borderRadius: '6px',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.78rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
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
                <span>{item.name}</span>
                {item.isBeta && (
                  <span
                    style={{
                      backgroundColor: '#D48816',
                      color: '#FFFFFF',
                      fontSize: '0.52rem',
                      fontWeight: 800,
                      padding: '0.05rem 0.28rem',
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
                )}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '18px',
                      height: '2.5px',
                      borderRadius: '9999px',
                      backgroundColor: '#781416'
                    }}
                  />
                )}
              </button>
            );
          })}
          </nav>
        </div>

        {/* RIGHT: Search, Theme, Notifications, User Profile & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.32rem', flexShrink: 0, marginLeft: 'auto' }}>
          {/* Quick Search Field with Real-Time Dropdown */}
          <div
            ref={searchRef}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            className="desktop-search"
          >
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
              <Search
                size={13}
                style={{ position: 'absolute', left: '9px', color: searchFocused ? '#C88D2D' : '#909AA4', transition: 'color 0.2s ease', zIndex: 2, pointerEvents: 'none' }}
                className="search-icon"
              />
              <input
                type="text"
                placeholder={searchFocused ? 'Search subjects...' : 'Search...'}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => { setSearchFocused(true); if (searchQuery.trim().length >= 2) { setSearchResults(searchLocalIndex(searchQuery, 8)); } }}
                onKeyDown={handleSearchKeyDown}
                className="navbar-search-input"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  padding: '0.34rem 1.4rem 0.34rem 1.65rem',
                  borderRadius: '9999px',
                  border: searchFocused ? '1.5px solid #C88D2D' : '1.5px solid #E8E2D5',
                  backgroundColor: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#1C1E21',
                  width: searchFocused ? '155px' : '105px',
                  maxWidth: '160px',
                  outline: 'none',
                  boxShadow: searchFocused ? '0 4px 16px rgba(200,141,45,0.12)' : '0 2px 6px rgba(35,30,25,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
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
                    right: '7px',
                    width: '16px',
                    height: '16px',
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
                  <X size={10} />
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
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1.5px solid #E8E2D5',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1C1E21',
              boxShadow: '0 2px 6px rgba(35,30,25,0.04)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Notification Bell with Badge 1 */}
          <button
            onClick={() => handleNavigate('interview-pro')}
            title="1 New Placement Notification"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1.5px solid #E8E2D5',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1C1E21',
              boxShadow: '0 2px 6px rgba(35,30,25,0.04)',
              position: 'relative',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '0.6rem',
                fontWeight: 800,
                width: '15px',
                height: '15px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="btn-outline"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.36rem 0.75rem',
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
                  fontSize: '0.8rem',
                  padding: '0.36rem 0.85rem',
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
            onClick={() => handleNavigate('more')}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1F2421',
              padding: '0.4rem'
            }}
            className="mobile-menu-toggle"
            title="All Tools & Resources"
            aria-label="Open More Resources"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* STYLES FOR ANIMATIONS & RESPONSIVE RULES */}
      <style>{`
        .desktop-nav {
          display: flex;
        }
        .mobile-menu-toggle {
          display: none;
        }
        .desktop-menu-pill {
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
          .desktop-menu-pill {
            display: none !important;
          }
        }
        .pv-logo-subtitle {
          display: none !important;
        }
        @media (min-width: 1680px) {
          .pv-logo-subtitle {
            display: block !important;
          }
        }
        .nav-link-item {
          padding: 0.28rem 0.35rem !important;
          font-size: 0.77rem !important;
        }
        .navbar-search-input {
          width: 105px !important;
        }
        .navbar-search-input:focus {
          width: 155px !important;
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
