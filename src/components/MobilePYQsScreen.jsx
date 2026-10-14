import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  X, 
  CheckCircle2, 
  Calendar, 
  ExternalLink,
  BookOpen,
  Eye,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  RefreshCw,
  GraduationCap,
  Settings,
  Monitor,
  Pill,
  BarChart2,
  Compass,
  Palette,
  ChefHat,
  Sprout,
  SlidersHorizontal,
  ArrowRight,
  Calculator,
  Atom,
  Users,
  Code
} from 'lucide-react';
import MobileHeader from './MobileHeader';
import { 
  COURSE_CONFIG, 
  AVAILABLE_COURSES,
  normalizeCourseKey, 
  normalizeYearStr, 
  getYearsForCourse, 
  getSemestersForCourseYear,
  getSubjectsForCourseMapping
} from '../data/courseMapping.ts';
import { API_URL } from '../config/api';
import { pyqsData as localPyqsData } from '../data/pyqsData';

// 10 Featured Courses matching Reference Screenshot Image 2
const FEATURED_COURSES = [
  { key: 'BTech', name: 'B.Tech', subLabel: '(All Branches)', icon: GraduationCap, color: '#6366F1', bg: '#EEF2FF' },
  { key: 'MTech', name: 'M.Tech', subLabel: '', icon: Settings, color: '#0284C7', bg: '#F0F9FF' },
  { key: 'BCA', name: 'BCA', subLabel: '', icon: Monitor, color: '#0284C7', bg: '#F0F9FF' },
  { key: 'MCA', name: 'MCA', subLabel: '', icon: FileText, color: '#0284C7', bg: '#F0F9FF' },
  { key: 'BPharma', name: 'B.Pharm', subLabel: '', icon: Pill, color: '#EF4444', bg: '#FEF2F2' },
  { key: 'BBA_BMS', name: 'BBA / BMS', subLabel: '', icon: BarChart2, color: '#DC2626', bg: '#FEF2F2' },
  { key: 'BArch', name: 'B.Arch', subLabel: '', icon: Compass, color: '#2563EB', bg: '#EFF6FF' },
  { key: 'BDes', name: 'B.Des', subLabel: '', icon: Palette, color: '#D97706', bg: '#FFFBEB' },
  { key: 'BHMCT', name: 'BHMCT', subLabel: '', icon: ChefHat, color: '#E11D48', bg: '#FFF1F2' },
  { key: 'BTechAgriculture', name: 'Agriculture', subLabel: '', icon: Sprout, color: '#16A34A', bg: '#F0FDF4' }
];

// Reference Branch Pills for B.Tech
const BTECH_BRANCHES = ['CSE', 'ECE', 'ME', 'EE', 'CE', 'IT', 'AI & DS', 'CS'];

// Helper to determine subject icon & pastel color
function getSubjectIcon(name = '', code = '') {
  const n = (name + ' ' + code).toLowerCase();
  if (n.includes('programming') || n.includes('pps') || n.includes('python') || n.includes('java') || n.includes('c++')) {
    return { icon: Code, bg: '#FEE2E2', color: '#EF4444' };
  }
  if (n.includes('math') || n.includes('calculus') || n.includes('discrete')) {
    return { icon: Calculator, bg: '#E0F2FE', color: '#0284C7' };
  }
  if (n.includes('physics') || n.includes('quantum') || n.includes('electromagnetics')) {
    return { icon: Atom, bg: '#DCFCE7', color: '#16A34A' };
  }
  if (n.includes('chemistry') || n.includes('environment') || n.includes('ecology') || n.includes('biology')) {
    return { icon: Users, bg: '#FEF3C7', color: '#D97706' };
  }
  if (n.includes('electronic') || n.includes('digital') || n.includes('computer') || n.includes('hardware')) {
    return { icon: Monitor, bg: '#F3E8FF', color: '#9333EA' };
  }
  if (n.includes('communication') || n.includes('english') || n.includes('soft skill') || n.includes('human value')) {
    return { icon: FileText, bg: '#FFE4E6', color: '#E11D48' };
  }
  return { icon: FileText, bg: '#EEF2FF', color: '#6366F1' };
}

// Crisp inline SVG matching the PYQs Hero Banner in Image 2
function PyqsHeroArt() {
  return (
    <div style={{ flexShrink: 0, width: 'clamp(92px, 28vw, 125px)', maxWidth: '38%' }}>
      <svg viewBox="0 0 130 98" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Background Soft Purple Glow */}
      <ellipse cx="65" cy="50" rx="55" ry="38" fill="#EDE9FE" fillOpacity="0.7" />

      {/* Stack of 3 Books */}
      {/* Book 1 - Red / Bottom */}
      <path d="M40 70 L95 62 L105 70 L50 78 Z" fill="#DC2626" />
      <path d="M40 70 L40 76 L50 84 L50 78 Z" fill="#991B1B" />
      <path d="M50 78 L50 84 L105 76 L105 70 Z" fill="#EF4444" />
      <path d="M44 72 L97 64 L102 68 L49 76 Z" fill="#FEF2F2" />

      {/* Book 2 - Blue / Middle */}
      <path d="M44 58 L96 52 L106 60 L54 66 Z" fill="#0284C7" />
      <path d="M44 58 L44 64 L54 72 L54 66 Z" fill="#0369A1" />
      <path d="M54 66 L54 72 L106 66 L106 60 Z" fill="#38BDF8" />
      <path d="M48 60 L98 54 L103 58 L53 64 Z" fill="#F0F9FF" />

      {/* Book 3 - Purple / Top */}
      <path d="M48 46 L98 42 L107 50 L57 54 Z" fill="#6366F1" />
      <path d="M48 46 L48 52 L57 60 L57 54 Z" fill="#4338CA" />
      <path d="M57 54 L57 60 L107 56 L107 50 Z" fill="#818CF8" />

      {/* Graduation Cap on top of books */}
      <polygon points="68,20 95,28 68,36 41,28" fill="#1E1B4B" />
      <path d="M52 32 L52 38 Q68 44 84 38 L84 32 Q68 37 52 32 Z" fill="#312E81" />
      {/* Cap button & tassel */}
      <circle cx="68" cy="28" r="2.5" fill="#F59E0B" />
      <path d="M68 28 C64 34 58 36 56 42" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
      <circle cx="56" cy="43" r="1.5" fill="#D97706" />

      {/* Notepad with "PYQ" label */}
      <g transform="translate(14, 28) rotate(-6)">
        <rect x="0" y="0" width="36" height="46" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
        <rect x="0" y="0" width="36" height="8" rx="4" fill="#6366F1" />
        {/* Binder rings */}
        <circle cx="8" cy="4" r="1.5" fill="#FFFFFF" />
        <circle cx="18" cy="4" r="1.5" fill="#FFFFFF" />
        <circle cx="28" cy="4" r="1.5" fill="#FFFFFF" />
        {/* Label PYQ */}
        <text x="18" y="20" fill="#1E1B4B" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">PYQ</text>
        {/* Ruled lines */}
        <line x1="6" y1="26" x2="30" y2="26" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="6" y1="31" x2="30" y2="31" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="6" y1="36" x2="24" y2="36" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Yellow Sticky Note with Checklist */}
      <g transform="translate(76, 26) rotate(4)">
        <rect x="0" y="0" width="46" height="52" rx="3" fill="#FEF08A" stroke="#FDE047" strokeWidth="0.8" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.07))" />
        {/* Pin or tape on top */}
        <rect x="18" y="-2" width="10" height="4" rx="1" fill="#FACC15" fillOpacity="0.8" />
        
        {/* Items with checkmarks */}
        {/* Item 1 */}
        <path d="M4 12 L6.5 14.5 L10 9.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="12" y="13.5" fill="#713F12" fontSize="5" fontWeight="700" fontFamily="sans-serif">Year-wise</text>
        
        {/* Item 2 */}
        <path d="M4 22 L6.5 24.5 L10 19.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="12" y="23.5" fill="#713F12" fontSize="5" fontWeight="700" fontFamily="sans-serif">Subject-wise</text>

        {/* Item 3 */}
        <path d="M4 32 L6.5 34.5 L10 29.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="12" y="33.5" fill="#713F12" fontSize="5" fontWeight="700" fontFamily="sans-serif">PDF Download</text>

        {/* Item 4 */}
        <path d="M4 42 L6.5 44.5 L10 39.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="12" y="43.5" fill="#713F12" fontSize="5" fontWeight="700" fontFamily="sans-serif">Exam Ready</text>
      </g>
    </svg>
    </div>
  );
}

export default function MobilePYQsScreen({ 
  courseKey = 'BTech', 
  selectedYearProp = '1st Year',
  selectedBranchProp = 'CSE',
  dbPyqs = [], 
  onSelectCourse,
  onSelectYear,
  onSelectBranch,
  onOpenPdf, 
  onRequestPyq,
  onNavigate,
  onOpenAuth
}) {
  const normKey = normalizeCourseKey(courseKey);

  // Navigation states: Course -> Branch -> Year -> Semester -> Subject -> PYQs
  const [selectedCourse, setSelectedCourse] = useState(normKey || 'BTech');
  const [selectedBranch, setSelectedBranch] = useState(selectedBranchProp || 'CSE');
  const [selectedYear, setSelectedYear] = useState(normalizeYearStr(selectedYearProp) || '1st Year');
  const [selectedSem, setSelectedSem] = useState('Semester 1');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAllCoursesModal, setShowAllCoursesModal] = useState(false);
  const [showAllBranchesModal, setShowAllBranchesModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Sync course if prop changes
  useEffect(() => {
    if (courseKey) {
      const n = normalizeCourseKey(courseKey);
      setSelectedCourse(n);
    }
  }, [courseKey]);

  useEffect(() => {
    if (selectedYearProp) {
      setSelectedYear(normalizeYearStr(selectedYearProp));
    }
  }, [selectedYearProp]);

  useEffect(() => {
    if (selectedBranchProp) {
      setSelectedBranch(selectedBranchProp);
    }
  }, [selectedBranchProp]);

  // Year options for the selected course dynamically as per COURSE_CONFIG
  const yearOptions = useMemo(() => {
    return getYearsForCourse(selectedCourse);
  }, [selectedCourse]);

  // Semester options: strictly the corresponding semesters for the selected course and year
  const semesterTabs = useMemo(() => {
    const norm = normalizeCourseKey(selectedCourse);
    const normYear = normalizeYearStr(selectedYear);
    const sems = COURSE_CONFIG[norm]?.sems?.[normYear] || (norm === 'BTech' ? (
      normYear === '1st Year' ? [1, 2] :
      normYear === '2nd Year' ? [3, 4] :
      normYear === '3rd Year' ? [5, 6] : [7, 8]
    ) : [1, 2]);
    return sems.map(s => `Semester ${s}`);
  }, [selectedCourse, selectedYear]);

  // Automatically keep selectedSem aligned with supported semesters of selected course & year
  useEffect(() => {
    const norm = normalizeCourseKey(selectedCourse);
    const normYear = normalizeYearStr(selectedYear);
    const sems = COURSE_CONFIG[norm]?.sems?.[normYear] || (norm === 'BTech' ? (
      normYear === '1st Year' ? [1, 2] :
      normYear === '2nd Year' ? [3, 4] :
      normYear === '3rd Year' ? [5, 6] : [7, 8]
    ) : [1, 2]);
    const validTabs = sems.map(s => `Semester ${s}`);
    if (!validTabs.includes(selectedSem)) {
      setSelectedSem(validTabs[0] || 'Semester 1');
    }
  }, [selectedCourse, selectedYear, selectedSem]);

  // Course change handler
  const handleCourseChange = (newCourse) => {
    const norm = normalizeCourseKey(newCourse);
    setSelectedCourse(norm);
    try {
      localStorage.setItem('campusprep_selected_course', norm);
    } catch (e) {}

    const years = getYearsForCourse(norm);
    const defaultYear = years[0] || '1st Year';
    setSelectedYear(defaultYear);

    const sems = COURSE_CONFIG[norm]?.sems?.[defaultYear] || [1, 2];
    setSelectedSem(`Semester ${sems[0] || 1}`);

    if (onSelectCourse) onSelectCourse(norm);
    if (onSelectYear) onSelectYear(defaultYear);
  };

  // Year change handler
  const handleYearChange = (newYear) => {
    const normYear = normalizeYearStr(newYear);
    setSelectedYear(normYear);
    const norm = normalizeCourseKey(selectedCourse);
    const sems = COURSE_CONFIG[norm]?.sems?.[normYear] || (norm === 'BTech' ? (
      normYear === '1st Year' ? [1, 2] :
      normYear === '2nd Year' ? [3, 4] :
      normYear === '3rd Year' ? [5, 6] : [7, 8]
    ) : [1, 2]);
    setSelectedSem(`Semester ${sems[0] || 1}`);
    if (onSelectYear) onSelectYear(normYear);
  };

  // Branch change handler
  const handleBranchChange = (newBranch) => {
    setSelectedBranch(newBranch);
    if (onSelectBranch) onSelectBranch(newBranch);
  };

  const isBTech = normalizeCourseKey(selectedCourse) === 'BTech';

  const semNum = useMemo(() => {
    const match = String(selectedSem).match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  }, [selectedSem]);

  // Subjects list
  const subjectsList = useMemo(() => {
    const branchParam = isBTech ? (selectedBranch === 'CS' ? 'CSE' : selectedBranch) : null;
    const rawSubs = getSubjectsForCourseMapping(selectedCourse, selectedYear, semNum, branchParam);

    let list = (rawSubs || []).map(sub => {
      const iconMeta = getSubjectIcon(sub.name, sub.code);
      return {
        id: sub.code || sub.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        code: sub.code || '',
        name: sub.name,
        semester: sub.semester || semNum,
        year: selectedYear,
        branch: branchParam,
        icon: iconMeta.icon,
        iconBg: iconMeta.bg,
        iconColor: iconMeta.color
      };
    });

    if (list.length === 0 && selectedYear === '1st Year') {
      const fallbackList = [
        { code: 'BCS101', name: 'Programming for Problem Solving' },
        { code: 'BAS101', name: 'Mathematics-I' },
        { code: 'BAS201', name: 'Physics' },
        { code: 'BAS301', name: 'Chemistry' },
        { code: 'BCS102', name: 'Digital Electronics' },
        { code: 'BAS401', name: 'Technical Communication' }
      ];
      list = fallbackList.map(s => {
        const meta = getSubjectIcon(s.name, s.code);
        return {
          id: s.code,
          code: s.code,
          name: s.name,
          semester: 1,
          year: '1st Year',
          branch: 'CSE',
          icon: meta.icon,
          iconBg: meta.bg,
          iconColor: meta.color
        };
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCourse, selectedBranch, selectedYear, semNum, searchQuery, isBTech]);

  // Helper to get real available PYQ papers for each subject
  const getSubjectPyqs = (sub) => {
    let papers = [];
    const targetCode = (sub.code || '').toLowerCase().trim();
    const targetName = (sub.name || '').toLowerCase().trim();

    // 1. Check in dbPyqs
    if (Array.isArray(dbPyqs) && dbPyqs.length > 0) {
      papers = dbPyqs.filter(p => {
        const pCode = String(p.subjectCode || '').toLowerCase().trim();
        const pSub = String(p.subjectName || p.subject || '').toLowerCase().trim();
        return (targetCode && pCode === targetCode) || pSub.includes(targetName) || targetName.includes(pSub);
      });
    }

    // 2. Check in localPyqsData
    if (papers.length === 0 && sub.code) {
      const candidates = [sub.code, sub.code.toUpperCase(), sub.code.toLowerCase(), sub.code.replace('-', '')];
      for (const c of candidates) {
        if (localPyqsData[c] && localPyqsData[c].length > 0) {
          papers = localPyqsData[c];
          break;
        }
      }
    }

    // Map into year lookup
    const defaultYears = ['2024', '2023', '2022', '2021', '2020'];
    const yearMap = {};

    papers.forEach(p => {
      const match = String(p.examYear || p.academicYear || p.year || p.session || '').match(/20\d\d/);
      if (match) {
        yearMap[match[0]] = p;
      }
    });

    const foundYears = Object.keys(yearMap).sort().reverse();
    const displayYears = foundYears.length > 0 ? foundYears : defaultYears;

    return {
      papers,
      yearMap,
      displayYears,
      yearsCount: displayYears.length,
      startYear: displayYears[displayYears.length - 1] || '2020',
      endYear: displayYears[0] || '2024'
    };
  };

  // Handle year chip tap
  const handleYearChipClick = (year, pyqMeta, sub) => {
    const paper = pyqMeta.yearMap[year];
    if (paper) {
      if (onOpenPdf) {
        onOpenPdf(paper);
      } else {
        const url = paper.pdfUrl || paper.url || paper.fileUrl || paper.driveUrl;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else {
      const fallbackPaper = pyqMeta.papers[0];
      if (fallbackPaper && onOpenPdf) {
        onOpenPdf(fallbackPaper);
      } else if (onRequestPyq) {
        onRequestPyq(sub, year);
      } else {
        alert(`Question paper for ${sub.name} (${year}) requested! Our team will upload it soon.`);
      }
    }
  };

  // Handle download button on card tap
  const handleDownloadClick = (pyqMeta, sub) => {
    const paper = pyqMeta.papers[0] || pyqMeta.yearMap[pyqMeta.endYear];
    if (paper) {
      if (onOpenPdf) {
        onOpenPdf(paper);
      } else {
        const url = paper.pdfUrl || paper.url || paper.fileUrl || paper.driveUrl;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else if (onRequestPyq) {
      onRequestPyq(sub, selectedYear);
    } else {
      alert(`Request received for ${sub.name} PYQ papers!`);
    }
  };

  return (
    <div 
      className="pv-mobile-pyqs-screen"
      style={{
        backgroundColor: '#FAFAFB',
        minHeight: '100%',
        paddingBottom: '32px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'clip',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* 1. COMPACT BRANDED HEADER */}
      <MobileHeader
        activeTab="pyqs"
        onNavigate={onNavigate}
        onOpenUpdates={() => {
          const modal = document.querySelector('[data-student-updates-modal]');
          if (modal) modal.style.display = 'block';
        }}
      />

      <div style={{ padding: '8px 10px 84px', maxWidth: '560px', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* 2. LAVENDER HERO BANNER (Image 2) */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #F3EEFF 0%, #EDE9FE 55%, #FDF4FF 100%)',
          border: '1px solid #DDD6FE',
          padding: '14px 14px',
          boxShadow: '0 3px 12px rgba(124, 58, 237, 0.05)',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          overflow: 'hidden'
        }}>
          {/* Left Hero Content */}
          <div style={{ flex: '1 1 0%', minWidth: 0, zIndex: 1 }}>
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#EDE9FE',
              border: '1px solid #DDD6FE',
              borderRadius: '9999px',
              padding: '2px 8px',
              fontSize: '9.5px',
              fontWeight: 800,
              color: '#6366F1',
              letterSpacing: '0.04em',
              marginBottom: '6px'
            }}>
              PREVIOUS YEAR PAPERS
            </div>

            <h1 style={{
              fontSize: '17px',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 5px 0',
              lineHeight: 1.22,
              letterSpacing: '-0.02em'
            }}>
              All <span style={{ color: '#7C3AED' }}>PYQs</span> in One Place
            </h1>

            <p style={{
              fontSize: '10.5px',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.35,
              maxWidth: '220px'
            }}>
              Get previous year question papers, unit-wise, subject-wise for all years.
            </p>
          </div>

          {/* Right Hero Artwork */}
          <PyqsHeroArt />
        </div>

        {/* 3. SEARCH INPUT (Image 2) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          border: '1.5px solid #E2E8F0',
          padding: '6px 12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          marginBottom: '12px'
        }}>
          <Search size={16} color="#94A3B8" style={{ marginRight: '8px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search PYQ, subject, year, branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '12px',
              color: '#0F172A',
              fontWeight: 600,
              padding: 0
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', padding: '0 4px', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={() => setShowFilterDrawer(true)}
            aria-label="Filter Options"
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#6366F1'
            }}
          >
            <SlidersHorizontal size={15} strokeWidth={2.4} />
          </button>
        </div>

        {/* 4. SELECT COURSE SECTION (Image 2) */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Select Course
            </h2>
            <button
              onClick={() => setShowAllCoursesModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366F1',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              View All <ArrowRight size={11} />
            </button>
          </div>

          {/* 10 Course Grid (2 rows x 5 columns) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: '6px'
          }}>
            {FEATURED_COURSES.map(course => {
              const isSelected = selectedCourse === course.key;
              const IconComp = course.icon;

              return (
                <button
                  key={course.key}
                  onClick={() => handleCourseChange(course.key)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 2px 7px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #6366F1' : '1.5px solid #F1F5F9',
                    backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
                    boxShadow: isSelected ? '0 2px 6px rgba(99, 102, 241, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minWidth: 0,
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{
                    color: isSelected ? '#6366F1' : course.color,
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComp size={18} strokeWidth={2.2} />
                  </div>
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    color: isSelected ? '#4338CA' : '#1E293B',
                    textAlign: 'center',
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    padding: '0 2px'
                  }}>
                    {course.name}
                  </span>
                  {course.subLabel && (
                    <span style={{
                      fontSize: '7.5px',
                      color: isSelected ? '#6366F1' : '#64748B',
                      fontWeight: 700,
                      lineHeight: 1,
                      marginTop: '1px'
                    }}>
                      {course.subLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. SELECT BRANCH (B.Tech) SECTION (Image 2) */}
        {isBTech && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Select Branch (B.Tech)
              </h2>
              <button
                onClick={() => setShowAllBranchesModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366F1',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                View All <ArrowRight size={11} />
              </button>
            </div>

            {/* Horizontal Branch Chips Scroll */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '2px 0 4px'
            }}>
              {BTECH_BRANCHES.map(branch => {
                const isSelected = selectedBranch === branch;
                return (
                  <button
                    key={branch}
                    onClick={() => handleBranchChange(branch)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '9999px',
                      border: isSelected ? 'none' : '1.5px solid #E2E8F0',
                      backgroundColor: isSelected ? '#6366F1' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      fontSize: '11px',
                      fontWeight: isSelected ? 800 : 700,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 6px rgba(99, 102, 241, 0.22)' : 'none'
                    }}
                  >
                    {branch}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. SELECT YEAR TABS (Image 2) */}
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
            Select Year
          </h2>

          {/* 4-Tab Segmented Pill */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '9999px',
            padding: '3px',
            gap: '2px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            {yearOptions.map(year => {
              const isSelected = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  style={{
                    padding: '6px 0',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: isSelected ? '#6366F1' : 'transparent',
                    color: isSelected ? '#FFFFFF' : '#64748B',
                    fontSize: '11px',
                    fontWeight: isSelected ? 800 : 700,
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 2px 5px rgba(99, 102, 241, 0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {year}
                </button>
              );
            })}
          </div>

          {/* Semester Selector Horizontal Pills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '9999px',
            padding: '3px',
            gap: '2px',
            marginTop: '6px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            {semesterTabs.map(sem => {
              const isSelected = selectedSem === sem;
              return (
                <button
                  key={sem}
                  onClick={() => setSelectedSem(sem)}
                  style={{
                    padding: '5px 0',
                    borderRadius: '9999px',
                    border: isSelected ? '1.5px solid #DDD6FE' : '1.5px solid transparent',
                    backgroundColor: isSelected ? '#EEF2FF' : 'transparent',
                    color: isSelected ? '#6366F1' : '#64748B',
                    fontSize: '11px',
                    fontWeight: isSelected ? 800 : 600,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {sem}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. SUBJECT-WISE PYQ CARDS (Image 2 - Single Column Full Width) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Subjects ({selectedSem})
            </h2>
            <button
              onClick={() => setShowSyllabusModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366F1',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              View Syllabus <ArrowRight size={11} />
            </button>
          </div>

          {/* Single Column PYQ Cards List */}
          {subjectsList.length === 0 ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px dashed #CBD5E1',
              padding: '28px 14px',
              textAlign: 'center',
              color: '#64748B'
            }}>
              <FileText size={30} style={{ color: '#94A3B8', marginBottom: '6px' }} />
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                No PYQs Mapped
              </h4>
              <p style={{ fontSize: '11px', margin: 0 }}>
                No question papers found for {selectedCourse} {selectedYear} ({selectedSem}).
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subjectsList.map((subject, idx) => {
                const IconComp = subject.icon;
                const pyqMeta = getSubjectPyqs(subject);

                return (
                  <div
                    key={subject.id || idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '10px 12px',
                      border: '1.5px solid #F1F5F9',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Top Row: Icon + Subject Info + Year Badge + Download Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                      
                      {/* Left: Pastel Icon Box */}
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        backgroundColor: subject.iconBg,
                        color: subject.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComp size={18} strokeWidth={2.4} />
                      </div>

                      {/* Middle: Subject Code + Name + Available Range */}
                      <div style={{ flex: '1 1 0%', minWidth: 0 }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: 900,
                          color: '#0F172A',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.1
                        }}>
                          {subject.code || 'CORE'}
                        </div>
                        <div style={{
                          fontSize: '11.5px',
                          fontWeight: 800,
                          color: '#1E293B',
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {subject.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '9.5px',
                          color: '#64748B',
                          marginTop: '2px'
                        }}>
                          <FileText size={10} color="#94A3B8" />
                          <span>PYQ Available: {pyqMeta.startYear} - {pyqMeta.endYear} ({pyqMeta.yearsCount} Years)</span>
                        </div>
                      </div>

                      {/* Right: Badge + Download Action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <span style={{
                          backgroundColor: '#6366F1',
                          color: '#FFFFFF',
                          fontSize: '9.5px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          whiteSpace: 'nowrap'
                        }}>
                          {pyqMeta.yearsCount} Years
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDownloadClick(pyqMeta, subject)}
                          aria-label={`Download ${subject.name} PYQ`}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: '#EEF2FF',
                            color: '#6366F1',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          <Download size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Horizontal Examination Year Chips (Image 2) */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      overflowX: 'auto',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      paddingTop: '2px'
                    }}>
                      {pyqMeta.displayYears.map(year => (
                        <button
                          key={year}
                          onClick={() => handleYearChipClick(year, pyqMeta, subject)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            color: '#475569',
                            fontSize: '9.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {year}
                        </button>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODALS: All Courses / All Branches / Syllabus / Filters */}
      {/* ========================================================================= */}

      {/* All Courses Modal */}
      {showAllCoursesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '520px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '16px',
            maxHeight: '75vh',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                All Degree Courses
              </h3>
              <button
                onClick={() => setShowAllCoursesModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {AVAILABLE_COURSES.map(c => (
                <button
                  key={c.key}
                  onClick={() => {
                    handleCourseChange(c.key);
                    setShowAllCoursesModal(false);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: selectedCourse === c.key ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
                    backgroundColor: selectedCourse === c.key ? '#EEF2FF' : '#F8FAFC',
                    color: selectedCourse === c.key ? '#4338CA' : '#0F172A',
                    fontSize: '11px',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Branches Modal */}
      {showAllBranchesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '520px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '16px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Select B.Tech Branch
              </h3>
              <button
                onClick={() => setShowAllBranchesModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {BTECH_BRANCHES.map(b => (
                <button
                  key={b}
                  onClick={() => {
                    handleBranchChange(b);
                    setShowAllBranchesModal(false);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: selectedBranch === b ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
                    backgroundColor: selectedBranch === b ? '#EEF2FF' : '#F8FAFC',
                    color: selectedBranch === b ? '#4338CA' : '#0F172A',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Syllabus Modal */}
      {showSyllabusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '460px',
            borderRadius: '18px',
            padding: '18px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                {selectedCourse} Examination Syllabus
              </h3>
              <button
                onClick={() => setShowSyllabusModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.45, margin: '0 0 14px' }}>
              Comprehensive syllabus structure for {selectedCourse} {isBTech ? selectedBranch : ''} • {selectedYear} ({selectedSem}).
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="https://aktu.ac.in/syllabus.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#6366F1',
                  color: '#FFFFFF',
                  padding: '9px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textDecoration: 'none'
                }}
              >
                <ExternalLink size={14} /> Open Official Portal
              </a>
              <button
                onClick={() => setShowSyllabusModal(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Options Drawer */}
      {showFilterDrawer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '520px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '16px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Filter PYQ Papers
              </h3>
              <button
                onClick={() => setShowFilterDrawer(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>SEMESTER FILTER</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {semesterTabs.map(sem => (
                  <button
                    key={sem}
                    onClick={() => {
                      setSelectedSem(sem);
                      setShowFilterDrawer(false);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: selectedSem === sem ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
                      backgroundColor: selectedSem === sem ? '#EEF2FF' : '#F8FAFC',
                      color: selectedSem === sem ? '#4338CA' : '#0F172A',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
