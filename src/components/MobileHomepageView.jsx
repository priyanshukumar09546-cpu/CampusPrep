import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  BookOpen, 
  FileText, 
  Wrench, 
  GraduationCap, 
  FlaskConical, 
  Leaf, 
  Monitor, 
  BarChart2, 
  Pill, 
  Settings, 
  Layers, 
  Users, 
  Compass, 
  Palette, 
  ChefHat, 
  PenTool, 
  Image, 
  Sprout, 
  Cpu, 
  Code2, 
  Database, 
  Briefcase, 
  ArrowRight,
  ChevronRight,
  X
} from 'lucide-react';
import MobileHeader from './MobileHeader';
import { searchLocalIndex } from '../data/searchIndex';
import { GiftPromotion } from './MentorNearby';

export default function MobileHomepageView({
  onSearch,
  onSelectCourse,
  onSelectBranch,
  onNavigate,
  onOpenSubject,
  onOpenAI
}) {
  const [selectedCourseTab, setSelectedCourseTab] = useState('B.Tech');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 24 Official AKTU Programmes in 5 columns with clean labels
  const allCourses = [
    { id: 'btech', label: 'B.Tech', subLabel: '(All Branches)', icon: GraduationCap, iconBg: '#FDF2F2', iconColor: '#861820', courseKey: 'BTech' },
    { id: 'btech-biotech', label: 'B.Tech', subLabel: 'Biotechnology', icon: FlaskConical, iconBg: '#F0FDF4', iconColor: '#16A34A', courseKey: 'BTechBiotechnology' },
    { id: 'btech-agri', label: 'B.Tech', subLabel: 'Agriculture', icon: Leaf, iconBg: '#F0FDF4', iconColor: '#15803D', courseKey: 'BTechAgriculture' },
    { id: 'btech-lateral', label: 'B.Tech', subLabel: 'Lateral Entry', icon: FileText, iconBg: '#EFF6FF', iconColor: '#2563EB', courseKey: 'BTechLateral' },
    { id: 'bca', label: 'BCA', subLabel: '', icon: Monitor, iconBg: '#F5F3FF', iconColor: '#7C3AED', courseKey: 'BCA' },

    { id: 'bba', label: 'BBA', subLabel: 'Business Admin', icon: BarChart2, iconBg: '#FFF1F2', iconColor: '#E11D48', courseKey: 'BBA' },
    { id: 'bms', label: 'BMS', subLabel: 'Management Studies', icon: Briefcase, iconBg: '#FAF5FF', iconColor: '#8B5CF6', courseKey: 'BBA_BMS' },
    { id: 'bpharm', label: 'B.Pharm', subLabel: '', icon: Pill, iconBg: '#FFF1F2', iconColor: '#DC2626', courseKey: 'BPharm' },
    { id: 'bpharm-lateral', label: 'B.Pharm', subLabel: 'Lateral Entry', icon: FileText, iconBg: '#EFF6FF', iconColor: '#2563EB', courseKey: 'BPharmLateral' },
    { id: 'pharmd', label: 'Pharm.D', subLabel: 'Doctor of Pharmacy', icon: FlaskConical, iconBg: '#F5F3FF', iconColor: '#9333EA', courseKey: 'PharmD' },

    { id: 'mtech', label: 'M.Tech', subLabel: '', icon: Settings, iconBg: '#FFFBEB', iconColor: '#D97706', courseKey: 'MTech' },
    { id: 'mpharm', label: 'M.Pharm', subLabel: '', icon: Pill, iconBg: '#FFF1F2', iconColor: '#E11D48', courseKey: 'MPharm' },
    { id: 'mca', label: 'MCA', subLabel: '', icon: Monitor, iconBg: '#F5F3FF', iconColor: '#6366F1', courseKey: 'MCA' },
    { id: 'mca-int', label: 'MCA', subLabel: 'Integrated', icon: Layers, iconBg: '#F0FDF4', iconColor: '#16A34A', courseKey: 'MCAIntegrated' },
    { id: 'mca-lateral', label: 'MCA', subLabel: 'Lateral Entry', icon: FileText, iconBg: '#EFF6FF', iconColor: '#2563EB', courseKey: 'MCALateral' },

    { id: 'mba', label: 'MBA', subLabel: '', icon: BarChart2, iconBg: '#FFFBEB', iconColor: '#D97706', courseKey: 'MBA' },
    { id: 'mba-int', label: 'MBA', subLabel: 'Integrated', icon: Users, iconBg: '#FFF1F2', iconColor: '#E11D48', courseKey: 'MBAIntegrated' },
    { id: 'mba-lateral', label: 'MBA', subLabel: 'Lateral Entry', icon: FileText, iconBg: '#EFF6FF', iconColor: '#2563EB', courseKey: 'MBALateral' },
    { id: 'barch', label: 'B.Arch', subLabel: '', icon: Compass, iconBg: '#F5F3FF', iconColor: '#7C3AED', courseKey: 'BArch' },
    { id: 'bdes', label: 'B.Des', subLabel: '', icon: Palette, iconBg: '#FFFBEB', iconColor: '#D97706', courseKey: 'BDes' },

    { id: 'bhmct', label: 'BHMCT', subLabel: '', icon: ChefHat, iconBg: '#FFF1F2', iconColor: '#E11D48', courseKey: 'BHMCT' },
    { id: 'bfad', label: 'BFAD', subLabel: '', icon: PenTool, iconBg: '#EFF6FF', iconColor: '#2563EB', courseKey: 'BFAD' },
    { id: 'bfa', label: 'BFA', subLabel: '', icon: Image, iconBg: '#F5F3FF', iconColor: '#7C3AED', courseKey: 'BFA' },
    { id: 'bvoc', label: 'B.Voc', subLabel: '', icon: Sprout, iconBg: '#F0FDF4', iconColor: '#16A34A', courseKey: 'BVoc' }
  ];

  // Course Selector Tabs
  const courseTabs = [
    { id: 'B.Tech', label: 'B.Tech', icon: GraduationCap, key: 'BTech' },
    { id: 'M.Tech', label: 'M.Tech', icon: Cpu, key: 'MTech' },
    { id: 'BCA', label: 'BCA', icon: Monitor, key: 'BCA' },
    { id: 'MCA', label: 'MCA', icon: FileText, key: 'MCA' },
    { id: 'B.Pharm', label: 'B.Pharm', icon: Pill, key: 'BPharm' }
  ];

  // 3 Featured Sections Cards
  const featurePillars = [
    {
      id: 'notes',
      title: 'Notes',
      desc: 'Subject-wise notes for all years',
      icon: BookOpen,
      iconColor: '#861820',
      iconBg: '#F8EAC9',
      bg: '#FFFFFF',
      borderColor: '#E9D9CC',
      route: 'notes'
    },
    {
      id: 'pyq',
      title: 'PYQ',
      desc: 'Previous year question papers',
      icon: FileText,
      iconColor: '#D6A13D',
      iconBg: '#F8EAC9',
      bg: '#FFFFFF',
      borderColor: '#E9D9CC',
      route: 'pyqs'
    },
    {
      id: 'tools',
      title: 'Tools',
      desc: 'Useful tools for students',
      icon: Wrench,
      iconColor: '#681016',
      iconBg: '#F8EAC9',
      bg: '#FFFFFF',
      borderColor: '#E9D9CC',
      route: 'more'
    }
  ];

  // Popular Subjects matching reference
  const popularSubjects = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      branch: 'B.Tech - CSE',
      notesCount: 152,
      pyqCount: 28,
      icon: Code2,
      iconColor: '#861820',
      iconBg: '#F8EAC9',
      subjectData: {
        name: 'Data Structures',
        code: 'KCS-301',
        course: 'B.Tech',
        branch: 'CSE',
        year: '2nd Year',
        sem: 'Sem 3'
      }
    },
    {
      id: 'os',
      title: 'Operating System',
      branch: 'B.Tech - CSE',
      notesCount: 118,
      pyqCount: 24,
      icon: Settings,
      iconColor: '#681016',
      iconBg: '#F8EAC9',
      subjectData: {
        name: 'Operating System',
        code: 'KCS-401',
        course: 'B.Tech',
        branch: 'CSE',
        year: '2nd Year',
        sem: 'Sem 4'
      }
    },
    {
      id: 'dbms',
      title: 'DBMS',
      branch: 'B.Tech - CSE',
      notesCount: 145,
      pyqCount: 26,
      icon: Database,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      subjectData: {
        name: 'Database Management System',
        code: 'KCS-501',
        course: 'B.Tech',
        branch: 'CSE',
        year: '3rd Year',
        sem: 'Sem 5'
      }
    }
  ];

  // Most Used Tools matching reference
  const mostUsedTools = [
    {
      id: 'resume',
      title: 'LaTeX Resume in 2 Minutes',
      desc: 'Create a professional resume in seconds',
      badge: 'LaTeX',
      badgeBg: '#F8EAC9',
      badgeColor: '#681016',
      bg: '#FFFFFF',
      borderColor: '#E9D9CC',
      route: 'resume-maker'
    },
    {
      id: 'pdf',
      title: 'All Types PDF Maker',
      desc: 'Merge, Convert, Compress, Edit PDF',
      badge: 'PDF',
      badgeBg: 'rgba(134, 24, 32, 0.08)',
      badgeColor: '#861820',
      bg: '#FFFFFF',
      borderColor: '#E9D9CC',
      route: 'pdf-maker'
    },
    {
      id: 'internship',
      title: 'Internship & Job',
      desc: 'Find internships & job opportunities',
      icon: Briefcase,
      iconColor: '#861820',
      iconBg: '#F8EAC9',
      bg: '#FFFFFF',
      borderColor: '#E9D9CC',
      route: 'internships-jobs'
    },
    {
      id: 'scholarship',
      title: 'Scholarship & Job',
      desc: 'Find scholarships, fellowships & jobs',
      icon: GraduationCap,
      iconColor: '#16A34A',
      iconBg: '#DCFCE7',
      bg: '#F0FDF4',
      borderColor: '#BBF7D0',
      route: 'scholarships'
    }
  ];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setSearchResults(searchLocalIndex(val.trim(), 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleCourseClick = (course) => {
    if (onSelectCourse) {
      onSelectCourse(course.courseKey, course.courseKey);
    } else if (onNavigate) {
      onNavigate('notes');
    }
  };

  const handleSubjectClick = (subj) => {
    if (onOpenSubject && subj.subjectData) {
      onOpenSubject(subj.subjectData);
    } else if (onNavigate) {
      onNavigate('notes');
    }
  };

  return (
    <div 
      className="pv-mobile-homepage-root"
      style={{
        backgroundColor: 'transparent',
        minHeight: '100%',
        paddingBottom: '24px',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* =========================================================================
          SECTION A — COMPACT HEADER
          ========================================================================= */}
      <MobileHeader
        activeTab="home"
        onNavigate={onNavigate}
        onOpenUpdates={() => {
          const modal = document.querySelector('[data-student-updates-modal]');
          if (modal) modal.style.display = 'block';
          else if (onNavigate) onNavigate('interview-pro');
        }}
        onOpenSearch={() => {
          const searchInput = document.querySelector('.pv-mobile-home-search-input');
          if (searchInput) searchInput.focus();
        }}
      />

      <div style={{ padding: '8px 10px 0' }}>
        {/* =========================================================================
            SECTIONS B & C — HERO BANNER & ALL COURSES GRID CONTAINER
            ========================================================================= */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #111111 0%, #0B0B0B 100%)',
            border: '1px solid rgba(255, 184, 0, 0.35)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.1)',
            padding: '11px 9px 12px',
            marginBottom: '10px',
            overflow: 'hidden'
          }}
        >
          {/* Subtle bottom wave/swoosh decoration */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #861820 0%, #D6A13D 100%)',
              opacity: 0.95
            }} 
          />

          {/* SECTION B: HERO BANNER TOP AREA */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '8px' }}>
            {/* Left Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Brand Tag Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3.5px',
                backgroundColor: '#F8EAC9',
                border: '1px solid #D6A13D',
                padding: '2px 7px',
                borderRadius: '9999px',
                fontSize: '8.5px',
                fontWeight: 800,
                color: '#FFB800',
                letterSpacing: '0.02em',
                marginBottom: '3px'
              }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#861820' }} />
                PROFESSOR VIRUS
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: '16.5px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
                margin: '0 0 5px 0',
                letterSpacing: '-0.02em'
              }}>
                All Course{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #861820 0%, #D6A13D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Notes &amp; PYQ
                </span>{' '}
                Cover
              </h1>

              {/* 4 Feature Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 4px' }}>
                <span style={heroPillStyle}>
                  <FileText size={8.5} color="#861820" /> Subject-wise Notes
                </span>
                <span style={heroPillStyle}>
                  <FileText size={8.5} color="#D6A13D" /> Previous Year Questions
                </span>
                <span style={heroPillStyle}>
                  <BookOpen size={8.5} color="#681016" /> Updated Syllabus
                </span>
                <span style={heroPillStyle}>
                  <Layers size={8.5} color="#861820" /> All in One Place
                </span>
              </div>
            </div>

            {/* Right Educational Artwork (SVG with cap, books, notes, screen) */}
            <div style={{ flex: '0 0 auto', width: '92px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="92" height="68" viewBox="0 0 102 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="capGradHome" x1="0" y1="0" x2="38" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14243D" />
                    <stop offset="1" stopColor="#0F172A" />
                  </linearGradient>
                  <linearGradient id="bookNotes" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#861820" />
                    <stop offset="1" stopColor="#681016" />
                  </linearGradient>
                  <linearGradient id="bookPyq" x1="0" y1="0" x2="52" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D6A13D" />
                    <stop offset="1" stopColor="#B38025" />
                  </linearGradient>
                </defs>

                {/* Pencil Container */}
                <rect x="6" y="32" width="14" height="24" rx="3" fill="#D6A13D" />
                <path d="M10 20L13 32H8L10 20Z" fill="#F8EAC9" />
                <path d="M14 23L17 32H12L14 23Z" fill="#861820" />
                <path d="M18 22L20 32H16L18 22Z" fill="#14243D" />

                {/* Stack of Books with Labels */}
                <rect x="22" y="44" width="46" height="8" rx="2" fill="url(#bookNotes)" />
                <rect x="20" y="46" width="3" height="4" rx="1" fill="#FFFFFF" />
                <text x="44" y="50" fontSize="4.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle">Syllabus</text>

                <rect x="20" y="35" width="48" height="8" rx="2" fill="#D6A13D" />
                <rect x="18" y="37" width="3" height="4" rx="1" fill="#FFFFFF" />
                <text x="44" y="41" fontSize="4.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle">PYQ</text>

                <rect x="24" y="26" width="42" height="8" rx="2" fill="url(#bookPyq)" />
                <text x="44" y="32" fontSize="4.5" fontWeight="800" fill="#FFFFFF" textAnchor="middle">Notes</text>

                {/* Graduation Cap */}
                <path d="M44 12L22 20L44 28L66 20L44 12Z" fill="url(#capGradHome)" />
                <path d="M34 24V30C34 32 54 32 54 30V24" stroke="#14243D" strokeWidth="2" strokeLinecap="round" />
                <path d="M66 20L69 25V32" stroke="#D6A13D" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="69" cy="32" r="1.5" fill="#D6A13D" />

                {/* Angled Whiteboard: Study Smarter Score Higher */}
                <g transform="rotate(7 78 40)">
                  <rect x="65" y="20" width="33" height="42" rx="3" fill="#FFFFFF" stroke="#E9D9CC" strokeWidth="1" />
                  <rect x="67" y="22" width="29" height="38" rx="2" fill="#FFFCF7" />
                  <text x="81.5" y="31" fontSize="4.5" fontWeight="800" fill="#861820" textAnchor="middle">Study</text>
                  <text x="81.5" y="38" fontSize="4.5" fontWeight="800" fill="#D6A13D" textAnchor="middle">Smarter</text>
                  <text x="81.5" y="45" fontSize="4.5" fontWeight="800" fill="#14243D" textAnchor="middle">Score</text>
                  <text x="81.5" y="52" fontSize="4.5" fontWeight="800" fill="#681016" textAnchor="middle">Higher</text>
                </g>
              </svg>
            </div>
          </div>

          {/* SECTION C: ALL COURSES GRID (5 Columns) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: '5px 3px',
            marginTop: '4px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {allCourses.map((c) => {
              const IconComponent = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => handleCourseClick(c)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCourseClick(c); }}
                  style={{
                    backgroundColor: '#0B0B0B',
                    border: '1px solid #F1F5F9',
                    borderRadius: '9px',
                    padding: '4px 1px 5px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
                    transition: 'transform 0.12s ease',
                    minHeight: '44px',
                    minWidth: 0,
                    width: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                  }}
                  aria-label={`${c.label}${c.subLabel ? ' ' + c.subLabel : ''}`}
                  data-course-name={c.label}
                >
                  <div style={{
                    width: '21px',
                    height: '21px',
                    borderRadius: '6px',
                    backgroundColor: c.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2px',
                    flexShrink: 0
                  }}>
                    <IconComponent size={11.5} color={c.iconColor} strokeWidth={2.2} aria-hidden="true" focusable="false" />
                  </div>
                  <span style={{
                    fontSize: '7.5px',
                    fontWeight: 800,
                    color: '#1E293B',
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}>
                    {c.label}
                  </span>
                  {c.subLabel && (
                    <span style={{
                      fontSize: '6px',
                      color: '#A1A1AA',
                      lineHeight: 1,
                      marginTop: '1px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      fontWeight: 600
                    }}>
                      {c.subLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            SECTION B.5 — MOBILE GIFT PROMOTION (Matches Reference Image 1 & 2)
            ========================================================================= */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '4px 0 10px 0',
          padding: '6px 4px',
          backgroundColor: '#0B0B0B',
          borderRadius: '16px',
          border: '1.2px solid #E9D9CC',
          boxShadow: '0 2px 10px rgba(134, 24, 32, 0.04)'
        }}>
          <GiftPromotion isMobile={true} />
        </div>

        {/* =========================================================================
            SECTION D — COURSE TABS (B.Tech | M.Tech | BCA | MCA | B.Pharm)
            ========================================================================= */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '3px',
          marginBottom: '9px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {courseTabs.map((tab) => {
            const isActive = selectedCourseTab === tab.id;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedCourseTab(tab.id);
                  if (onSelectCourse) onSelectCourse(tab.key, tab.key);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 14px',
                  borderRadius: '11px',
                  border: isActive ? 'none' : '1px solid #E9D9CC',
                  background: isActive ? 'linear-gradient(90deg, #861820 0%, #681016 100%)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#14243D',
                  fontSize: '11px',
                  fontWeight: isActive ? 800 : 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 2px 8px rgba(134, 24, 32, 0.25)' : '0 1px 2px rgba(20, 36, 61, 0.03)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <TabIcon size={12.5} color={isActive ? '#FFFFFF' : '#861820'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            SECTION E — SEARCH BAR
            ========================================================================= */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              if (onSearch) onSearch(searchQuery.trim());
              if (onNavigate) onNavigate('notes');
            }
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0B0B0B',
              borderRadius: '12px',
              border: isSearchFocused ? '1.5px solid #861820' : '1.5px solid #E9D9CC',
              boxShadow: isSearchFocused ? '0 0 0 3px rgba(134, 24, 32, 0.12)' : '0 1px 3px rgba(20, 36, 61, 0.03)',
              transition: 'all 0.2s ease',
              padding: '2px 8px 2px 10px'
            }}>
              <Search size={15} color="#94A3B8" style={{ flexShrink: 0, marginRight: '6px' }} />
              
              <input
                type="text"
                className="pv-mobile-home-search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Search subject, notes, pyq, tools..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backgroundColor: 'transparent',
                  padding: '7px 0',
                  minWidth: 0,
                  fontFamily: 'inherit'
                }}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '3px',
                    marginRight: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={13} />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('more');
                }}
                title="Filter resources"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: '#F8EAC9',
                  color: '#861820',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <SlidersHorizontal size={13} strokeWidth={2.2} />
              </button>
            </div>
          </form>

          {/* Search Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              backgroundColor: '#0B0B0B',
              borderRadius: '12px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={() => {
                    if (item.type === 'tool' && item.route) {
                      if (onNavigate) onNavigate(item.route);
                    } else if (item.data) {
                      if (onOpenSubject) onOpenSubject(item.data);
                      else if (onNavigate) onNavigate('notes');
                    } else if (onNavigate) {
                      onNavigate('notes');
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 11px',
                    border: 'none',
                    borderBottom: idx !== searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                    backgroundColor: '#0B0B0B',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '9px', color: '#A1A1AA' }}>
                      {item.code ? `${item.code} • ` : ''}{item.category || item.type}
                    </div>
                  </div>
                  <ChevronRight size={13} color="#94A3B8" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION F — THREE FEATURE CARDS (NOTES | PYQ | TOOLS)
            ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '7px',
          marginBottom: '14px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {featurePillars.map((pillar) => {
            const PillarIcon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => {
                  if (onNavigate) onNavigate(pillar.route);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' && onNavigate) onNavigate(pillar.route); }}
                style={{
                  backgroundColor: pillar.bg,
                  border: `1px solid ${pillar.borderColor}`,
                  borderRadius: '14px',
                  padding: '9px 8px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  minHeight: '88px',
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                  transition: 'transform 0.12s ease'
                }}
              >
                {/* Large Icon Box */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: pillar.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px'
                }}>
                  <PillarIcon size={16} color={pillar.iconColor} strokeWidth={2.3} />
                </div>

                {/* Title */}
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', lineHeight: 1.15, marginBottom: '2px' }}>
                  {pillar.title}
                </div>

                {/* Subtitle */}
                <div style={{ fontSize: '8.5px', color: '#A1A1AA', lineHeight: 1.25, fontWeight: 500, paddingRight: '14px' }}>
                  {pillar.desc}
                </div>

                {/* Bottom Right Arrow Pill */}
                <div style={{
                  position: 'absolute',
                  bottom: '7px',
                  right: '7px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: pillar.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={10} color={pillar.iconColor} strokeWidth={2.4} />
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            SECTION G — POPULAR SUBJECTS
            ========================================================================= */}
        <div style={{ marginBottom: '14px' }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '7px',
            padding: '0 2px'
          }}>
            <h2 style={{ fontSize: '14.5px', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              Popular Subjects
            </h2>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('notes')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#861820',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <span>View All</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* 3 Subject Cards in a 3-column grid / scrollable */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '6px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {popularSubjects.map((sub) => {
              const SubIcon = sub.icon;
              return (
                <div
                  key={sub.id}
                  onClick={() => handleSubjectClick(sub)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubjectClick(sub); }}
                  style={{
                    backgroundColor: '#0B0B0B',
                    border: '1px solid #F1F5F9',
                    borderRadius: '12px',
                    padding: '8px 7px 7px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                    minHeight: '84px',
                    minWidth: 0,
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div>
                    {/* Top Icon */}
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      backgroundColor: sub.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '4px'
                    }}>
                      <SubIcon size={13} color={sub.iconColor} strokeWidth={2.2} />
                    </div>

                    {/* Subject Title */}
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.2,
                      marginBottom: '1px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {sub.title}
                    </div>

                    {/* Branch */}
                    <div style={{ fontSize: '8px', color: '#A1A1AA', fontWeight: 600, marginBottom: '4px' }}>
                      {sub.branch}
                    </div>
                  </div>

                  {/* Footer Counts Pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '4px',
                    borderTop: '1px solid #F8FAFC',
                    fontSize: '7.5px',
                    fontWeight: 700,
                    color: '#A1A1AA'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <FileText size={8} color="#94A3B8" /> {sub.notesCount}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <FileText size={8} color="#94A3B8" /> {sub.pyqCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            SECTION H — MOST USED TOOLS
            ========================================================================= */}
        <div>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '7px',
            padding: '0 2px'
          }}>
            <h2 style={{ fontSize: '14.5px', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              Most Used Tools
            </h2>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('more')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#861820',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <span>View All</span>
              <ArrowRight size={11} />
            </button>
          </div>

          {/* 4 Tool Cards in a 4-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '6px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {mostUsedTools.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <div
                  key={tool.id}
                  style={{
                    backgroundColor: tool.bg || '#FFFFFF',
                    border: `1px solid ${tool.borderColor || '#E9D9CC'}`,
                    borderRadius: '12px',
                    padding: '8px 4px 7px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(20, 36, 61, 0.02)',
                    minHeight: '116px',
                    minWidth: 0,
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Tool Icon / Badge */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: tool.badgeBg || tool.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '4px'
                    }}>
                      {tool.badge ? (
                        <span style={{
                          fontSize: '8px',
                          fontWeight: 900,
                          color: tool.badgeColor,
                          letterSpacing: '-0.02em'
                        }}>
                          {tool.badge}
                        </span>
                      ) : (
                        <ToolIcon size={14} color={tool.iconColor} strokeWidth={2.2} />
                      )}
                    </div>

                    {/* Tool Title */}
                    <div style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      lineHeight: 1.15,
                      marginBottom: '2px'
                    }}>
                      {tool.title}
                    </div>

                    {/* Tool Desc */}
                    <div style={{
                      fontSize: '7px',
                      color: '#66758B',
                      lineHeight: 1.2,
                      fontWeight: 500,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {tool.desc}
                    </div>
                  </div>

                  {/* Open Button */}
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate(tool.route)}
                    style={{
                      width: '100%',
                      padding: '4px 0',
                      borderRadius: '7px',
                      border: '1px solid rgba(134, 24, 32, 0.25)',
                      backgroundColor: '#0B0B0B',
                      color: '#861820',
                      fontSize: '8.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      marginTop: '4px'
                    }}
                  >
                    <span>Open</span>
                    <ArrowRight size={8} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const heroPillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  backgroundColor: '#0B0B0B',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '9999px',
  padding: '2px 6px',
  fontSize: '8px',
  fontWeight: 700,
  color: '#FFFFFF'
};
