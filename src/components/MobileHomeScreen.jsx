import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  BookOpen, 
  FileText, 
  Wrench, 
  GraduationCap, 
  Cpu, 
  Laptop, 
  ArrowRight, 
  Database, 
  Code2, 
  Layers, 
  Briefcase, 
  Sparkles, 
  BarChart2, 
  FlaskConical, 
  Leaf, 
  Sprout, 
  Pill, 
  Monitor, 
  Share2, 
  Users, 
  Compass, 
  Palette, 
  Utensils, 
  Feather, 
  Image as ImageIcon, 
  X,
  FileCheck2
} from 'lucide-react';
import { searchLocalIndex } from '../data/searchIndex';

export default function MobileHomeScreen({ 
  onNavigate, 
  onSearch, 
  onSelectCourse, 
  onOpenSubject, 
  onOpenAI 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeCourseShortcut, setActiveCourseShortcut] = useState('B.Tech');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setSearchResults(searchLocalIndex(val.trim(), 6));
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) onSearch(searchQuery.trim());
      onNavigate('notes');
    }
  };

  const handleCoursePillClick = (courseKey) => {
    if (onSelectCourse) {
      onSelectCourse(courseKey, courseKey);
    }
    onNavigate('notes', courseKey);
  };

  const handleCourseShortcutClick = (courseKey) => {
    setActiveCourseShortcut(courseKey);
    if (onSelectCourse) {
      onSelectCourse(courseKey, courseKey);
    }
  };

  // 22 Courses displayed in the Promotional Banner Grid
  const bannerCourses = [
    { title: 'B.Tech', sub: '(All Branches)', key: 'BTech', icon: GraduationCap, bg: '#F5F3FF', color: '#7C3AED', border: '#EDE9FE' },
    { title: 'B.Tech', sub: 'Biotechnology', key: 'BTechBiotechnology', icon: FlaskConical, bg: '#ECFDF5', color: '#059669', border: '#D1FAE5' },
    { title: 'B.Tech', sub: 'Agriculture', key: 'BTechAgriculture', icon: Leaf, bg: '#F0FDF4', color: '#16A34A', border: '#DCFCE7' },
    { title: 'B.Tech', sub: 'Lateral Entry', key: 'BTechLateral', icon: FileText, bg: '#F0F9FF', color: '#0284C7', border: '#E0F2FE' },
    { title: 'BCA', sub: '', key: 'BCA', icon: Monitor, bg: '#EEF2FF', color: '#4F46E5', border: '#E0E7FF' },
    { title: 'BBA / BMS', sub: '', key: 'BBA_BMS', icon: BarChart2, bg: '#FFF1F2', color: '#E11D48', border: '#FFE4E6' },
    { title: 'B.Pharm', sub: '', key: 'BPharm', icon: Pill, bg: '#FDF2F8', color: '#DB2777', border: '#FCE7F3' },
    { title: 'B.Pharm', sub: 'Lateral Entry', key: 'BPharmLateral', icon: FileText, bg: '#EFF6FF', color: '#2563EB', border: '#DBEAFE' },
    { title: 'Pharm.D', sub: '', key: 'PharmD', icon: FlaskConical, bg: '#FAF5FF', color: '#9333EA', border: '#F3E8FF' },
    { title: 'M.Tech', sub: '', key: 'MTech', icon: Cpu, bg: '#FFFBEB', color: '#D97706', border: '#FEF3C7' },
    { title: 'M.Pharm', sub: '', key: 'MPharm', icon: Pill, bg: '#FFF1F2', color: '#BE185D', border: '#FFE4E6' },
    { title: 'MCA', sub: '', key: 'MCA', icon: Monitor, bg: '#EFF6FF', color: '#2563EB', border: '#DBEAFE' },
    { title: 'MCA', sub: 'Integrated', key: 'MCAIntegrated', icon: Share2, bg: '#F0FDFA', color: '#0D9488', border: '#CCFBF1' },
    { title: 'MCA', sub: 'Lateral Entry', key: 'MCALateral', icon: FileText, bg: '#F0F9FF', color: '#0284C7', border: '#E0F2FE' },
    { title: 'MBA', sub: '', key: 'MBA', icon: BarChart2, bg: '#FFFBEB', color: '#B45309', border: '#FEF3C7' },
    { title: 'MBA', sub: 'Integrated', key: 'MBAIntegrated', icon: Users, bg: '#FDF2F8', color: '#C026D3', border: '#FCE7F3' },
    { title: 'B.Arch', sub: '', key: 'BArch', icon: Compass, bg: '#F5F3FF', color: '#7C3AED', border: '#EDE9FE' },
    { title: 'B.Des', sub: '', key: 'BDes', icon: Palette, bg: '#FFF7ED', color: '#EA580C', border: '#FFEDD5' },
    { title: 'BHMCT', sub: '', key: 'BHMCT', icon: Utensils, bg: '#FEF2F2', color: '#DC2626', border: '#FEE2E2' },
    { title: 'BFAD', sub: '', key: 'BFAD', icon: Feather, bg: '#EFF6FF', color: '#1D4ED8', border: '#DBEAFE' },
    { title: 'BFA', sub: '', key: 'BFA', icon: ImageIcon, bg: '#FAF5FF', color: '#7E22CE', border: '#F3E8FF' },
    { title: 'B.Voc', sub: '', key: 'BVoc', icon: Sprout, bg: '#F0FDF4', color: '#15803D', border: '#DCFCE7' }
  ];

  // Course shortcut pills
  const courseShortcuts = [
    { label: 'B.Tech', key: 'B.Tech', icon: GraduationCap },
    { label: 'M.Tech', key: 'M.Tech', icon: Cpu },
    { label: 'BCA', key: 'BCA', icon: Laptop },
    { label: 'MCA', key: 'MCA', icon: Monitor },
    { label: 'B.Pharm', key: 'B.Pharm', icon: Pill },
    { label: 'MBA', key: 'MBA', icon: BarChart2 }
  ];

  // Popular Subjects (Real data connected to working routes)
  const popularSubjects = [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      code: 'KCS-301',
      course: 'B.Tech - CSE',
      notesCount: 152,
      pyqCount: 28,
      bg: '#FFF1F2',
      border: '#FFE4E6',
      iconColor: '#E11D48',
      icon: Code2,
      subjectData: { name: 'Data Structures', code: 'KCS-301', course: 'B.Tech', branch: 'CSE', year: '2nd Year', sem: 'Sem 3' }
    },
    {
      id: 'os',
      name: 'Operating System',
      code: 'KCS-401',
      course: 'B.Tech - CSE',
      notesCount: 118,
      pyqCount: 24,
      bg: '#EFF6FF',
      border: '#DBEAFE',
      iconColor: '#2563EB',
      icon: Cpu,
      subjectData: { name: 'Operating System', code: 'KCS-401', course: 'B.Tech', branch: 'CSE', year: '2nd Year', sem: 'Sem 4' }
    },
    {
      id: 'dbms',
      name: 'DBMS',
      code: 'KCS-501',
      course: 'B.Tech - CSE',
      notesCount: 145,
      pyqCount: 26,
      bg: '#ECFDF5',
      border: '#D1FAE5',
      iconColor: '#059669',
      icon: Database,
      subjectData: { name: 'Database Management Systems', code: 'KCS-501', course: 'B.Tech', branch: 'CSE', year: '3rd Year', sem: 'Sem 5' }
    },
    {
      id: 'coa',
      name: 'Computer Org. & Architecture',
      code: 'KCS-302',
      course: 'B.Tech - CSE',
      notesCount: 96,
      pyqCount: 18,
      bg: '#FAF5FF',
      border: '#F3E8FF',
      iconColor: '#7C3AED',
      icon: Layers,
      subjectData: { name: 'Computer Organization & Architecture', code: 'KCS-302', course: 'B.Tech', branch: 'CSE', year: '2nd Year', sem: 'Sem 3' }
    }
  ];

  // Most Used Tools (Real implemented tools)
  const mostUsedTools = [
    {
      id: 'resume-maker',
      name: 'LaTeX Resume in 2 Minutes',
      desc: 'Create a professional resume in seconds',
      bg: '#F5F3FF',
      border: '#EDE9FE',
      iconBg: '#EDE9FE',
      iconColor: '#6366F1',
      badgeText: 'LaTeX',
      route: 'resume-maker'
    },
    {
      id: 'pdf-maker',
      name: 'All Types PDF Maker',
      desc: 'Merge, Convert, Compress, Edit PDF',
      bg: '#FEF2F2',
      border: '#FEE2E2',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      badgeText: 'PDF',
      route: 'pdf-maker'
    },
    {
      id: 'internships-jobs',
      name: 'Internship & Job',
      desc: 'Find internships & job opportunities',
      bg: '#FFF7ED',
      border: '#FFEDD5',
      iconBg: '#FFEDD5',
      iconColor: '#EA580C',
      icon: Briefcase,
      route: 'internships-jobs'
    },
    {
      id: 'scholarships',
      name: 'Scholarship & Job',
      desc: 'Find scholarships, fellowships & jobs',
      bg: '#F0FDF4',
      border: '#DCFCE7',
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      icon: GraduationCap,
      route: 'scholarships'
    },
    {
      id: 'result-cgpa',
      name: 'Result & SGPA',
      desc: 'Analyze marksheet & calculate SGPA',
      bg: '#FFFBEB',
      border: '#FEF3C7',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      icon: BarChart2,
      route: 'result-cgpa'
    },
    {
      id: 'interview-pro',
      name: 'AI Interview Pro',
      desc: 'Practice technical & HR mock interviews',
      bg: '#EEF2FF',
      border: '#E0E7FF',
      iconBg: '#E0E7FF',
      iconColor: '#4F46E5',
      icon: Sparkles,
      route: 'interview-pro'
    }
  ];

  return (
    <div 
      className="pv-mobile-home-view" 
      style={{ 
        backgroundColor: '#FAF9F6', 
        minHeight: '100vh', 
        width: '100%', 
        maxWidth: '100vw', 
        boxSizing: 'border-box', 
        padding: '10px 12px 76px 12px', 
        fontFamily: "'Plus Jakarta Sans', sans-serif", 
        color: '#0F172A',
        overflowX: 'hidden'
      }}
    >
      
      {/* 1. PROMOTIONAL HERO BANNER ("All Course Notes & PYQ Cover") */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #FAF7FF 0%, #FFFFFF 55%, #F4F0FF 100%)',
          borderRadius: '18px',
          border: '1.5px solid #E9D5FF',
          boxShadow: '0 4px 18px rgba(99, 102, 241, 0.07)',
          padding: '14px 12px 12px 12px',
          marginBottom: '14px',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        {/* Soft Background Radial Glow */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Top Header Row of Banner */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Small Brand Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 7px', borderRadius: '9999px', backgroundColor: '#F3E8FF', color: '#6366F1', fontSize: '8.5px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '5px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6366F1' }} />
              PROFESSOR VIRUS
            </div>

            {/* Headline */}
            <h2 style={{ fontSize: '16px', fontWeight: 900, lineHeight: 1.2, color: '#0F172A', margin: '0 0 7px 0', letterSpacing: '-0.02em' }}>
              All Course <span style={{ color: '#6366F1' }}>Notes &amp; PYQ</span> Cover
            </h2>

            {/* 4 Feature Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {[
                { text: 'Subject-wise Notes', icon: '📄' },
                { text: 'Previous Year Questions', icon: '📝' },
                { text: 'Updated Syllabus', icon: '📖' },
                { text: 'All In One Place', icon: '☁️' }
              ].map((badge, idx) => (
                <span 
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '8.5px',
                    fontWeight: 700,
                    color: '#475569',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    padding: '2px 5px',
                    borderRadius: '5px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ fontSize: '9px' }}>{badge.icon}</span>
                  {badge.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right Banner Artwork: Stacked Books, Graduation Cap & Laptop */}
          <div style={{ width: '80px', height: '80px', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 160 140" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E1B4B" />
                  <stop offset="100%" stopColor="#312E81" />
                </linearGradient>
                <linearGradient id="book1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
                <linearGradient id="book2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient id="book3Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EEF2FF" />
                  <stop offset="100%" stopColor="#E0E7FF" />
                </linearGradient>
              </defs>

              {/* Laptop Display in background */}
              <rect x="75" y="30" width="80" height="52" rx="5" fill="#1E293B" />
              <rect x="78" y="33" width="74" height="46" rx="3" fill="url(#screenGrad)" />
              {/* Laptop Screen Content */}
              <text x="82" y="47" fontSize="7" fontWeight="bold" fill="#4338CA">Study Smarter</text>
              <text x="82" y="56" fontSize="6.5" fontWeight="bold" fill="#6366F1">Score Higher</text>
              <rect x="82" y="62" width="22" height="6" rx="2" fill="#C7D2FE" />
              <text x="84" y="67" fontSize="4.5" fontWeight="bold" fill="#312E81">PYQ</text>
              <rect x="108" y="62" width="26" height="6" rx="2" fill="#E0E7FF" />
              <text x="110" y="67" fontSize="4.5" fontWeight="bold" fill="#4338CA">Notes</text>
              {/* Laptop base */}
              <path d="M 68 82 L 158 82 L 152 86 L 74 86 Z" fill="#94A3B8" />

              {/* Book Stack */}
              <rect x="15" y="90" width="65" height="13" rx="2" fill="url(#book3Grad)" />
              <rect x="18" y="92" width="59" height="9" rx="1" fill="#FFFFFF" opacity="0.95" />
              <text x="26" y="99" fontSize="6" fontWeight="bold" fill="#065F46">Syllabus</text>

              <rect x="18" y="76" width="62" height="13" rx="2" fill="url(#book2Grad)" />
              <rect x="21" y="78" width="56" height="9" rx="1" fill="#FFFFFF" opacity="0.95" />
              <text x="34" y="85" fontSize="6.5" fontWeight="bold" fill="#92400E">PYQ</text>

              <rect x="22" y="62" width="58" height="13" rx="2" fill="url(#book1Grad)" />
              <rect x="25" y="64" width="52" height="9" rx="1" fill="#FFFFFF" opacity="0.95" />
              <text x="36" y="71" fontSize="6.5" fontWeight="bold" fill="#5B21B6">Notes</text>

              {/* Graduation Cap */}
              <polygon points="45,35 15,48 45,60 75,48" fill="url(#capGrad)" />
              <polygon points="45,36 18,48 45,58 72,48" fill="#4338CA" opacity="0.4" />
              <ellipse cx="45" cy="56" rx="14" ry="4" fill="#1E1B4B" />
              <circle cx="45" cy="46" r="2.5" fill="#F59E0B" />
              <path d="M 45 47 Q 56 50 60 62" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
              <rect x="58" y="62" width="4" height="7" rx="1" fill="#D97706" />
            </svg>
          </div>
        </div>

        {/* 22 Official Courses Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '5px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {bannerCourses.map((c, i) => {
            const Icon = c.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleCoursePillClick(c.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 7px',
                  borderRadius: '9px',
                  backgroundColor: c.bg,
                  border: `1px solid ${c.border}`,
                  textAlign: 'left',
                  cursor: 'pointer',
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <div 
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: c.color,
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}
                >
                  <Icon size={12} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.title}
                  </div>
                  {c.sub && (
                    <div style={{ fontSize: '8px', fontWeight: 600, color: '#64748B', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.sub}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. HORIZONTALLY SCROLLABLE COURSE SHORTCUTS */}
      <section style={{ marginBottom: '14px', width: '100%', boxSizing: 'border-box' }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '2px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            width: '100%'
          }}
        >
          {courseShortcuts.map((c) => {
            const isSelected = activeCourseShortcut === c.key;
            const Icon = c.icon;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => handleCourseShortcutClick(c.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  backgroundColor: isSelected ? '#6366F1' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  border: isSelected ? '1.5px solid #6366F1' : '1.5px solid #E2E8F0',
                  boxShadow: isSelected ? '0 3px 10px rgba(99, 102, 241, 0.22)' : '0 1px 3px rgba(0,0,0,0.02)',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={13} strokeWidth={2.4} style={{ color: isSelected ? '#FFFFFF' : '#64748B' }} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. PROMINENT SEARCH BAR */}
      <section style={{ marginBottom: '16px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
        <form 
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '13px',
            border: isSearchFocused ? '1.5px solid #6366F1' : '1.5px solid #E2E8F0',
            boxShadow: isSearchFocused ? '0 4px 16px rgba(99, 102, 241, 0.12)' : '0 1px 4px rgba(0,0,0,0.03)',
            padding: '9px 11px',
            boxSizing: 'border-box',
            width: '100%',
            transition: 'all 0.2s ease'
          }}
        >
          <Search size={17} style={{ color: isSearchFocused ? '#6366F1' : '#94A3B8', marginRight: '8px', flexShrink: 0 }} />
          <input 
            type="text"
            className="pv-mobile-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
            placeholder="Search subject, notes, pyq, tools..."
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#0F172A',
              padding: 0
            }}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              style={{ background: 'none', border: 'none', color: '#94A3B8', padding: '2px', cursor: 'pointer', marginRight: '4px', flexShrink: 0 }}
            >
              <X size={15} />
            </button>
          ) : null}
          <div style={{ width: '1px', height: '16px', backgroundColor: '#E2E8F0', margin: '0 6px', flexShrink: 0 }} />
          <button
            type="button"
            onClick={() => onNavigate('notes')}
            title="Filter Subjects"
            style={{
              background: 'none',
              border: 'none',
              color: '#6366F1',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <SlidersHorizontal size={17} strokeWidth={2.3} />
          </button>
        </form>

        {/* Real-time search suggestions dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div 
            style={{
              position: 'absolute',
              top: 'calc(100% + 5px)',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '13px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              zIndex: 100,
              padding: '5px 0',
              maxHeight: '240px',
              overflowY: 'auto'
            }}
          >
            {searchResults.map((res, i) => (
              <div 
                key={i}
                onClick={() => {
                  if (res.type === 'subject' && onOpenSubject) {
                    onOpenSubject(res);
                  } else {
                    onNavigate('notes');
                  }
                }}
                style={{
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderBottom: i === searchResults.length - 1 ? 'none' : '1px solid #F1F5F9'
                }}
              >
                <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.name || res.title}</div>
                  <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>{res.code ? `${res.code} • ` : ''}{res.course || 'B.Tech'}</div>
                </div>
                <ArrowRight size={12} style={{ color: '#6366F1', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. MAIN ACTION CARDS (3-COLUMN GRID: Notes, PYQ, Tools) */}
      <section style={{ marginBottom: '18px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '7px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Notes Card */}
          <div 
            onClick={() => onNavigate('notes')}
            style={{
              backgroundColor: '#F7F4FE',
              borderRadius: '15px',
              border: '1.5px solid #EDE9FE',
              padding: '11px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 7px rgba(124, 58, 237, 0.04)',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            <div>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', marginBottom: '7px' }}>
                <BookOpen size={17} strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', marginBottom: '2px', lineHeight: 1.15 }}>Notes</div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, lineHeight: 1.2 }}>Subject-wise notes for all years</div>
            </div>
            <div style={{ marginTop: '8px', alignSelf: 'flex-end', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={12} strokeWidth={2.5} />
            </div>
          </div>

          {/* PYQ Card */}
          <div 
            onClick={() => onNavigate('pyqs')}
            style={{
              backgroundColor: '#FFFDF5',
              borderRadius: '15px',
              border: '1.5px solid #FEF3C7',
              padding: '11px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 7px rgba(217, 119, 6, 0.04)',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            <div>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', marginBottom: '7px' }}>
                <FileText size={17} strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', marginBottom: '2px', lineHeight: 1.15 }}>PYQ</div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, lineHeight: 1.2 }}>Previous year question papers</div>
            </div>
            <div style={{ marginTop: '8px', alignSelf: 'flex-end', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={12} strokeWidth={2.5} />
            </div>
          </div>

          {/* Tools Card */}
          <div 
            onClick={() => onNavigate('more')}
            style={{
              backgroundColor: '#F5F6FF',
              borderRadius: '15px',
              border: '1.5px solid #E0E7FF',
              padding: '11px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 7px rgba(79, 70, 229, 0.04)',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            <div>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', marginBottom: '7px' }}>
                <Wrench size={17} strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', marginBottom: '2px', lineHeight: 1.15 }}>Tools</div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, lineHeight: 1.2 }}>Useful tools for students</div>
            </div>
            <div style={{ marginTop: '8px', alignSelf: 'flex-end', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={12} strokeWidth={2.5} />
            </div>
          </div>

        </div>
      </section>

      {/* 5. POPULAR SUBJECTS SECTION */}
      <section style={{ marginBottom: '18px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
            Popular Subjects
          </h3>
          <button 
            type="button"
            onClick={() => onNavigate('notes')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', color: '#6366F1', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
          >
            View All <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Subject Cards */}
        <div 
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            width: '100%'
          }}
        >
          {popularSubjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.id}
                onClick={() => {
                  if (onOpenSubject) {
                    onOpenSubject(sub.subjectData);
                  } else {
                    onNavigate('notes');
                  }
                }}
                style={{
                  minWidth: '180px',
                  maxWidth: '200px',
                  backgroundColor: sub.bg,
                  borderRadius: '15px',
                  border: `1.5px solid ${sub.border}`,
                  padding: '11px 10px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub.iconColor, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                    <Icon size={15} strokeWidth={2.4} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sub.name}
                    </div>
                    <div style={{ fontSize: '9.5px', fontWeight: 600, color: '#64748B' }}>
                      {sub.course}
                    </div>
                  </div>
                </div>

                {/* Counts Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '9.5px', fontWeight: 700, color: '#334155', backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '5px', border: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>
                    <FileText size={10} style={{ color: '#64748B' }} /> Notes {sub.notesCount}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '9.5px', fontWeight: 700, color: '#334155', backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '5px', border: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>
                    <FileCheck2 size={10} style={{ color: '#64748B' }} /> PYQ {sub.pyqCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. MOST USED TOOLS SECTION */}
      <section style={{ marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
            Most Used Tools
          </h3>
          <button 
            type="button"
            onClick={() => onNavigate('more')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', color: '#6366F1', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
          >
            View All <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Tool Cards */}
        <div 
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            width: '100%'
          }}
        >
          {mostUsedTools.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => onNavigate(t.route)}
                style={{
                  minWidth: '140px',
                  maxWidth: '155px',
                  backgroundColor: t.bg,
                  borderRadius: '15px',
                  border: `1.5px solid ${t.border}`,
                  padding: '11px 9px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  boxSizing: 'border-box'
                }}
              >
                <div>
                  <div style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: t.iconBg, color: t.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '7px' }}>
                    {t.badgeText ? (
                      <span style={{ fontSize: '9.5px', fontWeight: 900, letterSpacing: '-0.02em' }}>{t.badgeText}</span>
                    ) : Icon ? (
                      <Icon size={15} strokeWidth={2.4} />
                    ) : null}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#0F172A', lineHeight: 1.2, marginBottom: '3px' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600, lineHeight: 1.25 }}>
                    {t.desc}
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: t.iconColor,
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    Open <ArrowRight size={11} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
