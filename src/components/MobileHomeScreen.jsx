import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  FileText, 
  BookOpen, 
  BarChart2, 
  Calendar, 
  Clock, 
  Users, 
  Code2, 
  GraduationCap, 
  Briefcase, 
  Lightbulb, 
  Link2, 
  CheckSquare, 
  ArrowRight,
  Sparkles,
  Settings,
  X,
  ChevronRight
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterTray, setShowFilterTray] = useState(false);

  const categories = [
    { id: 'All', label: 'All', icon: null },
    { id: 'Academics', label: 'Academics', icon: GraduationCap },
    { id: 'Productivity', label: 'Productivity', icon: Settings },
    { id: 'Career', label: 'Career', icon: Briefcase },
    { id: 'Opportunities', label: 'Opportunities', icon: Sparkles }
  ];

  // The 15 official feature cards matching the single-screen mobile reference design
  const allCards = [
    // Column 1 - Row 1
    {
      id: 'engineering-notes',
      title: 'Engineering Notes',
      desc: 'Verified notes, books & faculty materials',
      icon: FileText,
      iconColor: '#861820',
      iconBg: '#FDF2F2',
      borderColor: '#E9D9CC',
      category: 'Academics',
      route: 'notes',
      isFullWidth: false
    },
    // Column 2 - Row 1
    {
      id: 'aktu-pyqs',
      title: 'AKTU PYQs & Solutions',
      desc: 'Previous year papers with solutions',
      icon: FileText,
      iconColor: '#861820',
      iconBg: '#FDF2F2',
      borderColor: '#E9D9CC',
      category: 'Academics',
      route: 'pyqs',
      isFullWidth: false
    },
    // Column 1 - Row 2
    {
      id: 'curriculum-syllabus',
      title: 'Curriculum & Syllabus',
      desc: 'Official syllabus, units & course structure',
      icon: BookOpen,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      borderColor: '#DCFCE7',
      category: 'Academics',
      route: 'syllabus',
      isFullWidth: false
    },
    // Column 2 - Row 2
    {
      id: 'practice-quizzes',
      title: 'Practice Quizzes',
      desc: 'Subject-wise tests, mock tests & quizzes',
      icon: CheckSquare,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      borderColor: '#DBEAFE',
      category: 'Academics',
      route: 'quizzes',
      isFullWidth: false
    },
    // Column 1 - Row 3
    {
      id: 'result-cgpa',
      title: 'Result & CGPA Analyzer',
      desc: 'AKTU marksheet parser & CGPA analysis',
      icon: BarChart2,
      iconColor: '#861820',
      iconBg: '#FDF2F2',
      borderColor: '#E9D9CC',
      category: 'Productivity',
      route: 'result-cgpa',
      isFullWidth: false
    },
    // Column 2 - Row 3
    {
      id: 'attendance-calculator',
      title: 'Attendance Calculator',
      desc: 'Track attendance & shortage analysis',
      icon: Calendar,
      iconColor: '#D6A13D',
      iconBg: '#FFFDF5',
      borderColor: '#F8EAC9',
      category: 'Productivity',
      route: 'attendance-calculator',
      isFullWidth: false
    },
    // Column 1 - Row 4
    {
      id: 'timetable-schedule',
      title: 'Time Table & Schedule',
      desc: 'Weekly, semester & exam schedule',
      icon: Clock,
      iconColor: '#0284C7',
      iconBg: '#F0F9FF',
      borderColor: '#E0F2FE',
      category: 'Productivity',
      route: 'timetable',
      isFullWidth: false
    },
    // Column 2 - Row 4
    {
      id: 'pdf-maker',
      title: 'PDF Maker & Splitter',
      desc: 'Merge, convert, compress & edit PDFs',
      icon: FileText,
      isPdfBadge: true,
      iconColor: '#DC2626',
      iconBg: '#FEF2F2',
      borderColor: '#FEE2E2',
      category: 'Productivity',
      route: 'pdf-maker',
      isFullWidth: false
    },
    // Column 1 - Row 5
    {
      id: 'resume-maker',
      title: 'ATS Resume Maker',
      desc: 'Build professional resume in minutes',
      icon: FileText,
      iconColor: '#861820',
      iconBg: '#FDF2F2',
      borderColor: '#E9D9CC',
      category: 'Career',
      route: 'resume-maker',
      isFullWidth: false
    },
    // Column 2 - Row 5
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      desc: 'AI interview, aptitude, technical & HR rounds',
      icon: Users,
      iconColor: '#EA580C',
      iconBg: 'transparent',
      borderColor: '#FFEDD5',
      category: 'Career',
      route: 'interview-pro',
      isFullWidth: false
    },
    // Column 1 - Row 6
    {
      id: 'coding-ide',
      title: 'Coding Interview IDE',
      desc: 'Practice coding, DSA & interview questions',
      icon: Code2,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      borderColor: '#D1FAE5',
      category: 'Career',
      route: 'interview-coding',
      isFullWidth: false
    },
    // Column 2 - Row 6
    {
      id: 'scholarships-grants',
      title: 'Scholarships & Grants',
      desc: 'Find scholarships, schemes & eligibility',
      icon: GraduationCap,
      iconColor: '#D6A13D',
      iconBg: '#FFFDF5',
      borderColor: '#F8EAC9',
      category: 'Opportunities',
      route: 'scholarships',
      isFullWidth: false
    },
    // Column 1 - Row 7
    {
      id: 'internships-jobs',
      title: 'Internships & Jobs',
      desc: 'Latest internships, job updates & drives',
      icon: Briefcase,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      borderColor: '#DBEAFE',
      category: 'Career',
      route: 'internships-jobs',
      isFullWidth: false
    },
    // Column 2 - Row 7
    {
      id: 'project-ideas',
      title: 'Project Ideas & Repos',
      desc: 'Mini & major projects with source code',
      icon: Lightbulb,
      iconColor: '#861820',
      iconBg: '#FDF2F2',
      borderColor: '#E9D9CC',
      category: 'Opportunities',
      route: 'project-ideas',
      isFullWidth: false
    },
    // Row 8 - Full Width
    {
      id: 'important-links',
      title: 'Important University Links',
      desc: 'AKTU portal, result, admission, official resources & more',
      icon: Link2,
      iconColor: '#861820',
      iconBg: '#FDF2F2',
      borderColor: '#E9D9CC',
      category: 'Academics',
      route: 'important-links',
      isFullWidth: true
    }
  ];

  // Filter cards by selected category and search query
  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      const matchesCategory = selectedCategory === 'All' || 
        card.category === selectedCategory ||
        (selectedCategory === 'Opportunities' && (card.id === 'internships-jobs' || card.id === 'important-links')) ||
        (selectedCategory === 'Academics' && card.id === 'important-links');

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(q) ||
        card.desc.toLowerCase().includes(q) ||
        card.category.toLowerCase().includes(q)
      );
    });
  }, [allCards, selectedCategory, searchQuery]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setSearchResults(searchLocalIndex(val.trim(), 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleCardClick = (card) => {
    if (card.route) {
      onNavigate(card.route);
    }
  };

  return (
    <div 
      className="pv-single-screen-dashboard"
      style={{
        backgroundColor: '#FFFCF7',
        minHeight: '100%',
        padding: '8px 10px 24px',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflowX: 'clip',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* =========================================================================
          1. COMPACT HERO BANNER
          ========================================================================= */}
      <section
        aria-label="Promotional Announcement"
        style={{
          position: 'relative',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #FFFCF7 0%, #F8EAC9 40%, #FFFFFF 100%)',
          border: '1px solid #E9D9CC',
          padding: '10px 12px',
          boxShadow: '0 3px 12px rgba(134, 24, 32, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          marginBottom: '8px',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box'
        }}
      >
        {/* Left Content */}
        <div style={{ flex: '1 1 0%', minWidth: 0, zIndex: 2, paddingRight: '6px' }}>
          {/* Brand Tag Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3.5px',
            backgroundColor: '#F8EAC9',
            border: '1px solid #D6A13D',
            padding: '2px 7px',
            borderRadius: '9999px',
            fontSize: '9px',
            fontWeight: 800,
            color: '#681016',
            letterSpacing: '0.02em',
            marginBottom: '3px',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#861820', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>PROFESSOR VIRUS</span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: '15px',
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#14243D',
            margin: '0 0 2.5px 0',
            letterSpacing: '-0.02em',
            wordBreak: 'break-word'
          }}>
            Everything You Need,<br />
            <span style={{
              background: 'linear-gradient(90deg, #861820 0%, #D6A13D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              in One Place
            </span>
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: '9.5px',
            color: '#66758B',
            margin: 0,
            lineHeight: 1.25,
            maxWidth: '100%',
            fontWeight: 500,
            wordBreak: 'break-word'
          }}>
            Notes, PYQs, tools, careers &amp; opportunities for your academic journey.
          </p>
        </div>

        {/* Right Artwork: Stylized Stack of Books + Cap + Note */}
        <div style={{ flex: '0 0 auto', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="86" height="66" viewBox="0 0 102 78" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="capGrad" x1="0" y1="0" x2="38" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#861820" />
                <stop offset="1" stopColor="#681016" />
              </linearGradient>
              <linearGradient id="book1" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#861820" />
                <stop offset="1" stopColor="#681016" />
              </linearGradient>
              <linearGradient id="book2" x1="0" y1="0" x2="52" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D6A13D" />
                <stop offset="1" stopColor="#B8860B" />
              </linearGradient>
            </defs>

            {/* Pencil Container */}
            <rect x="8" y="32" width="16" height="24" rx="3" fill="#D6A13D" opacity="0.8" />
            <path d="M12 20L15 32H10L12 20Z" fill="#D6A13D" />
            <path d="M16 23L19 32H14L16 23Z" fill="#861820" />
            <path d="M20 22L22 32H18L20 22Z" fill="#14243D" />

            {/* Stack of Books */}
            <rect x="22" y="44" width="46" height="8" rx="2" fill="url(#book1)" />
            <rect x="20" y="46" width="3" height="4" rx="1" fill="#FFFFFF" />
            <rect x="20" y="36" width="44" height="7" rx="2" fill="url(#book2)" />
            <rect x="18" y="38" width="3" height="3" rx="1" fill="#FFFFFF" />
            <rect x="24" y="29" width="38" height="6" rx="2" fill="#681016" />

            {/* Graduation Cap */}
            <path d="M43 14L22 22L43 30L64 22L43 14Z" fill="url(#capGrad)" />
            <path d="M33 26V32C33 34 53 34 53 32V26" stroke="#14243D" strokeWidth="2" strokeLinecap="round" />
            <path d="M64 22L67 27V34" stroke="#D6A13D" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="67" cy="34" r="1.5" fill="#D6A13D" />

            {/* Sticky Notepad */}
            <g transform="rotate(7 78 40)">
              <rect x="65" y="22" width="32" height="40" rx="3" fill="#FFFCF7" stroke="#E9D9CC" strokeWidth="1" />
              <circle cx="81" cy="24" r="1.5" fill="#861820" />
              <text x="81" y="32" fontSize="5.5" fontWeight="800" fill="#861820" textAnchor="middle">Study</text>
              <text x="81" y="39" fontSize="5.5" fontWeight="800" fill="#681016" textAnchor="middle">Practice</text>
              <text x="81" y="46" fontSize="5.5" fontWeight="800" fill="#D6A13D" textAnchor="middle">Build</text>
              <text x="81" y="53" fontSize="5.5" fontWeight="800" fill="#14243D" textAnchor="middle">Grow</text>
            </g>
            <path d="M96 15L97 18L100 19L97 20L96 23L95 20L92 19L95 18L96 15Z" fill="#D6A13D" opacity="0.9" />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          2. SEARCH INPUT WITH FILTER ICON
          ========================================================================= */}
      <section aria-label="Search" style={{ position: 'relative', marginBottom: '7px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              if (onSearch) onSearch(searchQuery.trim());
              onNavigate('notes');
            }
          }}
          style={{ width: '100%', maxWidth: '100%', minWidth: 0, margin: 0 }}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0B0B0B',
            borderRadius: '12px',
            border: isSearchFocused ? '1.5px solid #861820' : '1.5px solid #E9D9CC',
            boxShadow: isSearchFocused ? '0 0 0 3px rgba(134, 24, 32, 0.12)' : '0 1px 3px rgba(20, 36, 61, 0.03)',
            transition: 'all 0.2s ease',
            padding: '1px 6px 1px 10px',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}>
            <Search size={15} color="#66758B" style={{ flexShrink: 0, marginRight: '6px' }} />
            
            <input
              type="text"
              className="pv-mobile-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search subjects, notes, tools..."
              style={{
                flex: '1 1 0%',
                minWidth: 0,
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                padding: '7px 0',
                fontSize: '12px',
                color: '#14243D',
                fontWeight: 500,
                boxSizing: 'border-box'
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px',
                  color: '#66758B',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0
                }}
              >
                <X size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowFilterTray(prev => !prev)}
              aria-label="Filter Categories"
              style={{
                background: showFilterTray ? '#F8EAC9' : 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '7px',
                marginLeft: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#861820',
                flexShrink: 0
              }}
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </form>

        {/* Real-time search dropdown results */}
        {isSearchFocused && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '5px',
            backgroundColor: '#0B0B0B',
            borderRadius: '12px',
            border: '1px solid #E9D9CC',
            boxShadow: '0 10px 25px rgba(20, 36, 61, 0.12)',
            zIndex: 50,
            overflow: 'hidden'
          }}>
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={() => {
                  if (item.type === 'tool' && item.route) {
                    onNavigate(item.route);
                  } else if (item.data) {
                    if (onOpenSubject) onOpenSubject(item.data);
                    else onNavigate('notes');
                  } else {
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
                  borderBottom: idx !== searchResults.length - 1 ? '1px solid #F8EAC9' : 'none',
                  backgroundColor: '#0B0B0B',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#14243D' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '9px', color: '#66758B' }}>
                    {item.code ? `${item.code} • ` : ''}{item.category || item.type}
                  </div>
                </div>
                <ChevronRight size={13} color="#66758B" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          3. CATEGORY CHIPS (ALL, ACADEMICS, PRODUCTIVITY, CAREER, OPPORTUNITIES)
          ========================================================================= */}
      <section 
        aria-label="Category Selection"
        className="pv-category-chips-scroll"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          overflowY: 'hidden',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '2px 0 6px 0',
          marginBottom: '8px'
        }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const IconComp = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 11px',
                borderRadius: '9999px',
                border: isActive ? '1.5px solid #861820' : '1px solid #E9D9CC',
                backgroundColor: isActive ? '#861820' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#14243D',
                fontSize: '10.5px',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 2px 6px rgba(134, 24, 32, 0.25)' : 'none',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              {IconComp && (
                <IconComp 
                  size={11} 
                  color={isActive ? '#FFFFFF' : '#861820'} 
                />
              )}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </section>

      {/* =========================================================================
          4. 2-COLUMN COMPACT FEATURE CARDS GRID
          ========================================================================= */}
      <section aria-label="Feature Cards" style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
        <div 
          className="pv-tools-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '8px',
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          {filteredCards.map((card) => {
            const IconComp = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(card); }}
                className="pv-tool-card"
                style={{
                  gridColumn: card.isFullWidth ? '1 / -1' : 'auto',
                  backgroundColor: '#0B0B0B',
                  borderRadius: '12px',
                  border: '1px solid #E9D9CC',
                  boxShadow: '0 1px 3px rgba(20, 36, 61, 0.03)',
                  padding: card.isFullWidth ? '10px 12px' : '8px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  cursor: 'pointer',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                  WebkitTapHighlightColor: 'transparent',
                  boxSizing: 'border-box',
                  width: '100%',
                  minWidth: 0,
                  maxWidth: '100%',
                  minHeight: '50px'
                }}
              >
                {/* Card Icon */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: card.iconBg,
                  border: `1px solid ${card.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative'
                }}>
                  {card.isPdfBadge ? (
                    <span style={{
                      fontSize: '7.5px',
                      fontWeight: 900,
                      color: card.iconColor,
                      letterSpacing: '-0.02em'
                    }}>
                      PDF
                    </span>
                  ) : (
                    <IconComp size={13.5} color={card.iconColor} strokeWidth={2.2} />
                  )}
                </div>

                {/* Card Texts */}
                <div style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#14243D',
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {card.title}
                  </div>

                  <div style={{
                    fontSize: '8.5px',
                    color: '#66758B',
                    lineHeight: 1.25,
                    marginTop: '2px',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    fontWeight: 500,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {card.desc}
                  </div>
                </div>

                {/* Small Navigation Arrow Circle */}
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#F8EAC9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ArrowRight size={9} color="#861820" strokeWidth={2.4} />
                </div>
              </div>
            );
          })}
        </div>



        {/* Empty state if search filters out all cards */}
        {filteredCards.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '24px 16px',
            backgroundColor: '#0B0B0B',
            borderRadius: '14px',
            border: '1px dashed #E9D9CC',
            marginTop: '8px'
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#14243D', margin: '0 0 6px' }}>
              No tools or resources found matching "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              style={{
                backgroundColor: '#861820',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
