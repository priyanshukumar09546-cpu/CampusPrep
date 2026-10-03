import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Check, 
  Home as HomeIcon, 
  Grid, 
  List, 
  SlidersHorizontal, 
  ArrowRight,
  BookOpen,
  FileText,
  UploadCloud,
  Lightbulb,
  Download,
  Eye,
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
  Sigma,
  Folder,
  FileUp,
  X,
  PlusCircle,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  BookMarked,
  ArrowLeft
} from 'lucide-react';
import { AKTU_SYLLABUS_DATA, searchAktuSyllabus } from '../data/aktuSyllabusData';
import { QUANTUM_NOTES } from '../data/aktuQuantumNotes';
import { getSubjectQuantumPdfUrl, meNotes, itNotes, eceNotes, eeNotes } from '../data/subjectQuantumNotes';
import NoteViewerModal from '../components/NoteViewerModal';
import { isValidPdfUrl } from '../utils/pdfValidator';
import AllIzzWellBanner from '../components/AllIzzWellBanner';
import AcademicResourceBanner from '../components/AcademicResourceBanner';
import CourseNotesView from '../components/CourseNotesView';
import MobileNotesScreen from '../components/MobileNotesScreen';
import { COURSES } from '../data/coursesCatalog';
import { API_URL } from '../config/api';
import CourseSelectModal from '../components/CourseSelectModal';
import { notesData as localNotesData, notesData } from '../data/notesData';
import { pyqsData as localPyqsData, pyqsData } from '../data/pyqsData';
import { allCourses } from '../data/subjectsData';

// NORMALIZE FOR ALL 7 COURSES
export const normalizeCourse = (param) => {
  if (!param) return 'BTech';
  const p = String(param).toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
  const map = {
    'btech': 'BTech',
    'bca': 'BCA',
    'mtech': 'MTech',
    'mca': 'MCA',
    'mba': 'MBA',
    'bba': 'BBA',
    'bpharm': 'BPharm',
    'bpharma': 'BPharm',
    'bpharmacy': 'BPharm'
  };
  return map[p] || 'BTech';
};

export default function NotesPage({ onNavigate, onOpenAuth, searchQuery, onClearSearch, initialCourse = 'BTech', onSelectCourse }) {
  const getCourseParam = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('course');
      if (c) return c;
      const saved = localStorage.getItem('campusprep_selected_course');
      if (saved) return saved;
    } catch (e) {}
    return initialCourse || 'BTech';
  };

  let courseParam = getCourseParam();
  const normalizedCourse = normalizeCourse(courseParam);
  const courses = allCourses || {};
  const selectedCourseData = courses[normalizedCourse];

  // Course State for backward compatibility with child components
  const [selectedCourse, setSelectedCourse] = useState(normalizedCourse);

  // Modal open on first open if no course is selected/stored
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('course');
      const saved = localStorage.getItem('campusprep_selected_course');
      return !c && !saved;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (initialCourse && normalizeCourse(initialCourse) !== normalizeCourse(selectedCourse)) {
      setSelectedCourse(normalizeCourse(initialCourse));
    }
  }, [initialCourse]);

  // URL Query Params Helper
  const updateUrlParams = (newParams) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      Object.entries(newParams).forEach(([k, v]) => {
        if (v === null || v === undefined) searchParams.delete(k);
        else searchParams.set(k, v);
      });
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {}
  };

  // Course Switcher Tab Handler
  const handleCourseTabChange = (courseKey) => {
    const norm = normalizeCourse(courseKey);
    setSelectedCourse(norm);
    try {
      localStorage.setItem('campusprep_selected_course', norm);
    } catch (e) {}
    if (onSelectCourse) onSelectCourse(norm);
    window.location.href = `/notes?course=${norm}`;
  };

  // SAFE RENDERING FOR ALL
  const branches = Object.keys(selectedCourseData || {});
  const [selectedBranch, setSelectedBranch] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const b = params.get('branch');
      if (b && branches.includes(b)) return b;
    } catch (e) {}
    return branches[0] || 'CSE' || 'General';
  });

  useEffect(() => {
    if (!branches.includes(selectedBranch)) {
      setSelectedBranch(branches[0] || 'CSE' || 'General');
    }
  }, [normalizedCourse]);

  const yearsData = (selectedCourseData && selectedCourseData[selectedBranch])
    ? selectedCourseData[selectedBranch]
    : (branches[0] && selectedCourseData ? selectedCourseData[branches[0]] : {});
  const yearKeys = Object.keys(yearsData || {});
  const [selectedYear, setSelectedYear] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const y = params.get('year');
      if (y && yearKeys.includes(y)) return y;
    } catch (e) {}
    return yearKeys[0] || '1st Year';
  });

  useEffect(() => {
    if (!yearKeys.includes(selectedYear)) {
      setSelectedYear(yearKeys[0] || '1st Year');
    }
  }, [selectedBranch, normalizedCourse]);

  const subjects = (yearsData && yearsData[selectedYear]) ? yearsData[selectedYear] : [];

  // Active navigation states for deeper inspection
  const [activeBranch, setActiveBranch] = useState(selectedBranch);
  const [activeYear, setActiveYear] = useState(selectedYear);
  const [activeSemester, setActiveSemester] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeUnit, setActiveUnit] = useState(null);

  // Subject Filter & Dropdown Search States
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [subjectDropdownSearch, setSubjectDropdownSearch] = useState('');

  // Live Database Notes State with Local Fallback First
  const [dbNotes, setDbNotes] = useState(() => {
    try {
      const allLocal = Object.values(notesData).flat();
      return allLocal;
    } catch (e) {
      return [];
    }
  });
  const notesCacheRef = React.useRef(new Map());

  const fetchBackendNotes = React.useCallback((courseVal, branchVal, yearVal) => {
    const c = courseVal || normalizedCourse || 'BTech';
    
    // STEP 1: ALWAYS load local first (instant, works offline)
    try {
      const localMatches = Object.values(notesData).flat().filter(n => {
        const nc = normalizeCourse(n.course);
        return nc === normalizeCourse(c);
      });
      if (localMatches.length > 0) {
        setDbNotes(localMatches);
      }
    } catch (e) {
      console.log('[LOCAL NOTES] Fallback error', e);
    }

    let url = `${API_URL}/api/notes?course=${encodeURIComponent(c)}`;
    if (c === 'BTech' || c === 'B.Tech') {
      const b = branchVal || selectedBranch || 'CSE';
      const y = yearVal || selectedYear || '1st Year';
      url += `&branch=${encodeURIComponent(b)}&year=${encodeURIComponent(y)}`;
    }

    const cacheKey = `${c}_${url}`;
    if (notesCacheRef.current.has(cacheKey)) {
      setDbNotes(notesCacheRef.current.get(cacheKey));
      return;
    }

    fetch(url, { cache: 'no-store' })
      .then(res => {
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) {
          throw new Error('Backend server not available');
        }
        return res.json();
      })
      .then(data => {
        const notesList = Array.isArray(data) ? data : (data?.notes || []);
        if (notesList.length > 0) {
          notesCacheRef.current.set(cacheKey, notesList);
          setDbNotes(notesList);
        }
      })
      .catch(err => console.log('Backend not available, keeping local fallback notes:', err));
  }, [normalizedCourse, selectedBranch, selectedYear]);

  React.useEffect(() => {
    fetchBackendNotes(normalizedCourse, selectedBranch, selectedYear);
  }, [normalizedCourse, selectedBranch, selectedYear, fetchBackendNotes]);

  // 4 STANDARD NOTE SOURCES (AND DYNAMIC SOURCE SUPPORT)
  const NOTE_SOURCES = [
    { id: 'quantum', name: 'Quantum Notes', color: '#C88D2D', bg: '#FDF6E8', border: '#E8D3B0', badge: 'Popular' },
    { id: 'gateway_classes', name: 'Gateway Classes Notes', color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd', badge: 'Recommended' },
    { id: 'faculty_notes', name: 'Faculty Lecture Notes', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe', badge: 'Curriculum' },
    { id: 'aktu_solved_papers', name: 'AKTU Solved Papers', color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff', badge: 'Exam Prep' }
  ];

  // DYNAMIC SOURCE PALETTE & METADATA HELPER
  const getSourceMeta = (sourceName) => {
    const s = String(sourceName || '').toLowerCase();
    if (s.includes('gateway')) return { id: 'gateway_classes', name: 'Gateway Classes', color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd', badge: 'Recommended' };
    if (s.includes('quantum')) return { id: 'quantum', name: sourceName || 'Quantum Series', color: '#C88D2D', bg: '#FDF6E8', border: '#E8D3B0', badge: 'Popular' };
    if (s.includes('edushine') || s.includes('rrsimt')) return { id: 'edushine', name: 'EduShine Classes', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', badge: 'EduShine' };
    if (s.includes('knowledge gate')) return { id: 'knowledge_gate', name: 'Knowledge Gate', color: '#d97706', bg: '#fef3c7', border: '#fde68a', badge: 'Knowledge Gate' };
    if (s.includes('coreconcept') || s.includes('core concept')) return { id: 'core_concepts', name: 'Core Concepts', color: '#4f46e5', bg: '#e0e7ff', border: '#c7d2fe', badge: 'Core Concepts' };
    if (s.includes('engineering being') || s.includes('eiov')) return { id: 'engineering_being', name: 'Engineering Being', color: '#ea580c', bg: '#fff7ed', border: '#ffedd5', badge: 'Engineering Being' };
    if (s.includes('bitwise')) return { id: 'bitwise_learning', name: 'Bitwise Learning', color: '#7c3aed', bg: '#f3e8ff', border: '#ddd6fe', badge: 'Detailed' };
    if (s.includes('multi')) return { id: 'multi_atom', name: 'Multi Atoms', color: '#db2777', bg: '#fce7f3', border: '#fbcfe8', badge: 'Multi Atoms' };
    if (s.includes('lakshya')) return { id: 'lakshya', name: 'Lakshya Academy', color: '#B37D28', bg: '#FDF6E8', border: '#E8D3B0', badge: 'Lakshya Academy' };
    if (s.includes('handwritten')) return { id: 'handwritten', name: 'Handwritten Notes', color: '#7A5835', bg: '#F6F2E9', border: '#E8E2D5', badge: 'Handwritten' };
    if (s.includes('solved') || s.includes('pyq') || s.includes('paper')) return { id: 'aktu_solved_papers', name: 'AKTU Solved Papers', color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff', badge: 'Solved Papers' };
    if (s.includes('printed')) return { id: 'faculty_printed', name: 'Faculty Printed Notes', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', badge: 'Printed Notes' };
    if (s.includes('priyanshi')) return { id: 'priyanshi', name: 'Priyanshi Notes', color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8', badge: 'Faculty' };
    if (s.includes('vimal')) return { id: 'vimal_sir', name: 'Vimal Sir Notes', color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd', badge: 'Faculty' };
    if (s.includes('gopal')) return { id: 'gopal_sir', name: 'Gopal Sir Notes', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', badge: 'Faculty' };
    if (s.includes('lecture') || s.includes('faculty') || s.includes('tutorial') || s.includes('notesgallery')) return { id: 'faculty_notes', name: 'Faculty Lecture Notes', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe', badge: 'Lecture Notes' };
    
    return {
      id: s.replace(/[^a-z0-9]/g, '_') || 'custom_source',
      name: sourceName || 'Study Material',
      color: '#4f46e5',
      bg: '#e0e7ff',
      border: '#c7d2fe',
      badge: sourceName || 'Verified Resource'
    };
  };

  // CANONICAL NORMALIZATION HELPERS FOR ROBUST NOTE RESOLUTION
  const normYearStr = (yearStr) => {
    if (!yearStr) return '';
    const s = String(yearStr).toLowerCase().replace(/b\.tech/g, '').replace(/st|nd|rd|th/g, '').replace(/year\s*/g, '').trim();
    if (s === '1' || s.includes('1')) return '1';
    if (s === '2' || s.includes('2')) return '2';
    if (s === '3' || s.includes('3')) return '3';
    if (s === '4' || s.includes('4')) return '4';
    return s;
  };

  const normBranchStr = (branchStr) => {
    if (!branchStr) return '';
    const b = String(branchStr).toUpperCase().trim();
    if (b.includes('COMPUTER') || b === 'CSE') return 'CSE';
    if (b.includes('ELECTRONIC') || b === 'ECE') return 'ECE';
    if (b.includes('MECHANICAL') || b === 'ME') return 'ME';
    if (b.includes('CIVIL') || b === 'CE') return 'CE';
    if (b.includes('INFORMATION') || b === 'IT') return 'IT';
    if (b.includes('ELECTRICAL') || b === 'EE') return 'EE';
    if (b.includes('AI') && !b.includes('DS') && !b.includes('DATA')) return 'AI & ML';
    if (b.includes('DS') || b.includes('DATA')) return 'DS';
    if (b.includes('AI & DS') || b.includes('AIML') || b.includes('AI')) return 'AI & ML';
    if (b.includes('MATH')) return 'Maths';
    return b;
  };

  const normSourceKey = (srcStr) => {
    if (!srcStr) return '';
    const s = String(srcStr).toLowerCase();
    if (s.includes('gateway')) return 'gateway_classes';
    if (s.includes('quantum')) return 'quantum';
    if (s.includes('bitwise')) return 'bitwise_learning';
    if (s.includes('multi')) return 'multi_atom';
    return s;
  };

  const cleanTokens = (str) => {
    if (!str) return [];
    return String(str)
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t && !['and', 'of', 'the', 'in', 'for', 'with', 'to', 'a', 'an', 'pps', 'tafl', 'dbms'].includes(t))
      .map(t => {
        if (t === 'iv' || t === '4') return '4';
        if (t === 'iii' || t === '3') return '3';
        if (t === 'ii' || t === '2') return '2';
        if (t === 'i' || t === '1') return '1';
        return t.endsWith('s') ? t.slice(0, -1) : t;
      });
  };

  const isSubjectMatch = (codeA, nameA, codeB, nameB) => {
    const normCodeA = codeA ? String(codeA).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
    const normCodeB = codeB ? String(codeB).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';

    // If both codes exist and are valid (length >= 4), they MUST match exactly
    if (normCodeA && normCodeB && normCodeA.length >= 4 && normCodeB.length >= 4) {
      return normCodeA === normCodeB;
    }

    const tokensA = cleanTokens(nameA);
    const tokensB = cleanTokens(nameB);
    if (tokensA.length === 0 || tokensB.length === 0) return false;

    // 1. Distinguishing number check (1 vs 2 vs 3 vs 4)
    const numA = tokensA.find(t => ['1', '2', '3', '4'].includes(t));
    const numB = tokensB.find(t => ['1', '2', '3', '4'].includes(t));
    if (numA && numB && numA !== numB) return false;
    if ((numA && !numB) || (!numA && numB)) return false;

    // 2. Key topic check (physic vs chemistry vs mathematic vs electrical vs electronics vs mechanical vs civil)
    const keyTopics = ['physic', 'chemistry', 'mathematic', 'electrical', 'electronic', 'mechanical', 'civil', 'environment', 'programming', 'soft', 'human', 'python', 'c', 'java', 'structure', 'algorithm', 'database', 'operating', 'network'];
    const topicA = tokensA.find(t => keyTopics.includes(t));
    const topicB = tokensB.find(t => keyTopics.includes(t));
    if (topicA && topicB && topicA !== topicB) return false;

    const strA = tokensA.join('');
    const strB = tokensB.join('');
    if (strA === strB) return true;

    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    const intersection = tokensA.filter(x => setB.has(x));

    if (intersection.length === tokensA.length && intersection.length === tokensB.length) return true;
    if (intersection.length >= 2 && (intersection.length === tokensA.length || intersection.length === tokensB.length)) return true;

    return false;
  };

  // HELPER TO RESOLVE NOTE RESOURCE URL FOR A GIVEN SUBJECT, UNIT, AND SOURCE
  const resolveNoteSourceUrl = (subjectObj, unitNum, sourceKey) => {
    if (!subjectObj || !unitNum) return null;

    const targetSource = normSourceKey(sourceKey);
    const activeBranchNorm = normBranchStr(activeBranch);
    const activeYearNorm = normYearStr(activeYear);

    // 1. Check DB notes loaded from backend API (includes all uploaded Gateway Classes notes)
    if (dbNotes && dbNotes.length > 0) {
      const match = dbNotes.find(n => {
        const nBranchNorm = normBranchStr(n.branch || n.branchId);
        const matchBranch = !activeBranchNorm || nBranchNorm === activeBranchNorm || nBranchNorm === 'ALL';

        const nYearNorm = normYearStr(n.year);
        const matchYear = !activeYearNorm || nYearNorm === activeYearNorm;

        const matchSub = isSubjectMatch(subjectObj.code, subjectObj.subject || subjectObj.name, n.subjectCode, n.subject || n.subjectName);

        const matchUnit = Number(n.unit !== undefined ? n.unit : n.unitNumber) === Number(unitNum);

        const nSource = normSourceKey(n.source || n.sourceKey);
        const matchSource = nSource === targetSource;

        const isPub = n.status === 'published' || n.status === 'Verified' || n.status === 'Published' || String(n.published) === 'true' || n.published !== false;
        const isAvail = String(n.available) === 'true' || n.available !== false;

        return matchBranch && matchYear && matchSub && matchUnit && matchSource && isPub && isAvail;
      });

      if (match) {
        const rawUrl = match.fileUrl || match.url || match.pdfUrl;
        if (isValidPdfUrl(rawUrl)) {
          return rawUrl;
        }
      }
    }

    // 2. Static Quantum Notes repository fallback
    if (targetSource === 'quantum') {
      const quantumUrl = getSubjectQuantumPdfUrl(subjectObj.code, subjectObj.subject);
      if (quantumUrl && isValidPdfUrl(quantumUrl)) {
        return quantumUrl;
      }
      if (subjectObj.pdfUrl && isValidPdfUrl(subjectObj.pdfUrl)) {
        return subjectObj.pdfUrl;
      }
    }

    return null;
  };

  // State sync from search query
  React.useEffect(() => {
    if (searchQuery && typeof searchQuery === 'string') {
      const sq = searchQuery.toLowerCase();
      if (sq.includes('1st') || sq.includes('first')) setActiveYear('1st Year');
      else if (sq.includes('2nd') || sq.includes('second')) setActiveYear('2nd Year');
      else if (sq.includes('3rd') || sq.includes('third')) setActiveYear('3rd Year');
      else if (sq.includes('4th') || sq.includes('fourth')) setActiveYear('4th Year');

      if (sq.includes('cse') || sq.includes('computer')) setActiveBranch('CSE');
      else if (sq.includes('ece') || sq.includes('electronic')) setActiveBranch('ECE');
      else if (sq.includes('me') || sq.includes('mechanical')) setActiveBranch('ME');
      else if (sq.includes('ee') || sq.includes('electrical')) setActiveBranch('EE');
      else if (sq.includes('it') || sq.includes('information')) setActiveBranch('IT');
      else if (sq.includes('ai') || sq.includes('aiml')) setActiveBranch('AI & ML');
      else if (sq.includes('ds') || sq.includes('data science')) setActiveBranch('DS');
    }
  }, [searchQuery]);

  // Sidebar Filter Checkbox States
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  
  // Search, View & Sort States
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  // Modals & Note Preview State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestUnitInfo, setRequestUnitInfo] = useState(null);
  const [activeViewerNote, setActiveViewerNote] = useState(null); // { note, subject, unit }

  // Sync hero search query from props (if passed from global Navbar / Hero search)
  React.useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== null) {
      setHeroSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  // Available Branches List
  const branchesList = [
    { id: 'CSE', name: 'CSE', fullName: 'Computer Science & Engineering', icon: Code, color: '#0284c7', bg: '#e0f2fe' },
    { id: 'ECE', name: 'ECE', fullName: 'Electronics & Communication', icon: Cpu, color: '#db2777', bg: '#fce7f3' },
    { id: 'ME', name: 'ME', fullName: 'Mechanical Engineering', icon: Wrench, color: '#ea580c', bg: '#ffedd5' },
    { id: 'IT', name: 'IT', fullName: 'Information Technology', icon: Radio, color: '#9333ea', bg: '#f3e8ff' },
    { id: 'EE', name: 'EE', fullName: 'Electrical Engineering', icon: Zap, color: '#4f46e5', bg: '#e0e7ff' },
    { id: 'AI & ML', name: 'AI & ML', fullName: 'Artificial Intelligence & Machine Learning', icon: Sparkles, color: '#2563eb', bg: '#dbeafe' },
    { id: 'DS', name: 'DS', fullName: 'Data Science & Analytics', icon: Layers, color: '#0891b2', bg: '#ecfeff' },
    { id: 'CE', name: 'CE', fullName: 'Civil Engineering', icon: Building2, color: '#0d9488', bg: '#ccfbf1' },
    { id: 'Maths', name: 'Maths', fullName: 'Applied Sciences & Mathematics', icon: Sigma, color: '#e11d48', bg: '#ffe4e6' }
  ];

  // COMPUTE AVAILABLE SUBJECTS FOR ACTIVE BRANCH + B.TECH YEAR
  const availableSubjectsForFilter = useMemo(() => {
    const branchToUse = activeBranch || (selectedBranches.length > 0 ? selectedBranches[0] : 'CSE');
    const yearToUse = activeYear || (selectedYears.length > 0 ? selectedYears[0] : '1st Year');

    let list = [];

    // Branch direct centralized notes mapping overrides if available
    if (branchToUse === 'ME' && yearToUse) {
      const yearKey = yearToUse === '1st Year' ? 'year1' : yearToUse === '2nd Year' ? 'year2' : null;
      if (yearKey && meNotes[yearKey]) {
        list = meNotes[yearKey].map((item, index) => ({
          id: `me-${yearKey}-${index}`,
          code: `KME-${yearToUse === '1st Year' ? '1' : '3'}0${index + 1}`,
          subject: item.name,
          branch: 'ME',
          year: yearToUse,
          semester: yearToUse === '1st Year' ? (index < 5 ? 'Sem 1' : 'Sem 2') : (index < 5 ? 'Sem 3' : 'Sem 4'),
          pdfUrl: item.pdfUrl,
          available: item.available !== false
        }));
      }
    } else if (branchToUse === 'IT' && yearToUse) {
      const yearKey = yearToUse === '1st Year' ? 'year1' : yearToUse === '2nd Year' ? 'year2' : yearToUse === '3rd Year' ? 'year3' : yearToUse === '4th Year' ? 'year4' : null;
      if (yearKey && itNotes[yearKey]) {
        list = itNotes[yearKey].map((item, index) => ({
          id: `it-${yearKey}-${index}`,
          code: `KIT-${index + 101}`,
          subject: item.name,
          branch: 'IT',
          year: yearToUse,
          semester: yearToUse === '1st Year' ? (index < 5 ? 'Sem 1' : 'Sem 2') : yearToUse === '2nd Year' ? (index < 6 ? 'Sem 3' : 'Sem 4') : yearToUse === '3rd Year' ? (index < 6 ? 'Sem 5' : 'Sem 6') : (index < 6 ? 'Sem 7' : 'Sem 8'),
          pdfUrl: item.pdfUrl,
          available: item.available !== false
        }));
      }
    } else if (branchToUse === 'ECE' && yearToUse) {
      const yearKey = yearToUse === '1st Year' ? 'year1' : yearToUse === '2nd Year' ? 'year2' : yearToUse === '3rd Year' ? 'year3' : yearToUse === '4th Year' ? 'year4' : null;
      if (yearKey && eceNotes[yearKey]) {
        list = eceNotes[yearKey].map((item, index) => ({
          id: `ece-${yearKey}-${index}`,
          code: `KEC-${index + 101}`,
          subject: item.name,
          branch: 'ECE',
          year: yearToUse,
          semester: yearToUse === '1st Year' ? (index < 5 ? 'Sem 1' : 'Sem 2') : yearToUse === '2nd Year' ? (index < 5 ? 'Sem 3' : 'Sem 4') : yearToUse === '3rd Year' ? (index < 5 ? 'Sem 5' : 'Sem 6') : (index < 6 ? 'Sem 7' : 'Sem 8'),
          pdfUrl: item.pdfUrl,
          available: item.available !== false
        }));
      }
    } else if (branchToUse === 'EE' && yearToUse) {
      const yearKey = yearToUse === '1st Year' ? 'year1' : yearToUse === '2nd Year' ? 'year2' : yearToUse === '3rd Year' ? 'year3' : yearToUse === '4th Year' ? 'year4' : null;
      if (yearKey && eeNotes[yearKey]) {
        list = eeNotes[yearKey].map((item, index) => ({
          id: `ee-${yearKey}-${index}`,
          code: `KEE-${index + 101}`,
          subject: item.name,
          branch: 'EE',
          year: yearToUse,
          semester: yearToUse === '1st Year' ? (index < 5 ? 'Sem 1' : 'Sem 2') : yearToUse === '2nd Year' ? (index < 5 ? 'Sem 3' : 'Sem 4') : yearToUse === '3rd Year' ? (index < 6 ? 'Sem 5' : 'Sem 6') : (index < 3 ? 'Sem 7' : 'Sem 8'),
          pdfUrl: item.pdfUrl,
          available: item.available !== false
        }));
      }
    }

    if (list.length === 0) {
      list = searchAktuSyllabus('', {
        branch: branchToUse,
        year: yearToUse
      });
    }

    // CRITICAL: DYNAMICALLY MERGE ANY SUBJECTS PRESENT IN dbNotes (includes uploaded Gateway Classes notes)
    if (dbNotes && dbNotes.length > 0) {
      const activeBranchNorm = normBranchStr(branchToUse);
      const activeYearNorm = normYearStr(yearToUse);

      dbNotes.forEach((n) => {
        const nBranchNorm = normBranchStr(n.branch || n.branchId);
        const nYearNorm = normYearStr(n.year);

        const matchBranch = !activeBranchNorm || nBranchNorm === activeBranchNorm || nBranchNorm === 'ALL';
        const matchYear = !activeYearNorm || nYearNorm === activeYearNorm;

        if (matchBranch && matchYear) {
          const subName = (n.subject || n.subjectName || '').trim();
          const subCode = (n.subjectCode || '').trim();
          if (!subName) return;

          const alreadyExists = list.some(item => isSubjectMatch(item.code, item.subject, subCode, subName));
          if (!alreadyExists) {
            list.push({
              id: `db-sub-${subCode || subName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
              code: subCode || 'AKTU',
              subject: subName,
              branch: branchToUse,
              year: yearToUse,
              semester: n.semester || (yearToUse === '1st Year' ? 'Sem 1' : yearToUse === '2nd Year' ? 'Sem 3' : yearToUse === '3rd Year' ? 'Sem 5' : 'Sem 7'),
              available: true,
              description: `AKTU verified notes and units for ${subName}.`
            });
          }
        }
      });
    }

    if (sortBy === 'alphabetical') {
      list = [...list].sort((a, b) => a.subject.localeCompare(b.subject));
    } else if (sortBy === 'oldest') {
      list = [...list].reverse();
    }

    return list;
  }, [activeBranch, activeYear, selectedBranches, selectedYears, sortBy, dbNotes]);

  // FILTERED SUBJECT DROPDOWN OPTIONS (WITH SEARCH)
  const filteredSubjectDropdownList = useMemo(() => {
    if (!subjectDropdownSearch.trim()) return availableSubjectsForFilter;
    const q = subjectDropdownSearch.toLowerCase().trim();
    return availableSubjectsForFilter.filter(s =>
      s.subject.toLowerCase().includes(q) ||
      (s.code && s.code.toLowerCase().includes(q))
    );
  }, [availableSubjectsForFilter, subjectDropdownSearch]);

  // DIRECT NOTE MATCHES (FUZZY / SOURCE / CODE / SUBJECT SEARCH)
  const directNoteMatches = useMemo(() => {
    const rawQ = (heroSearchQuery || subjectSearchQuery || '').toLowerCase().trim();
    if (!rawQ || rawQ.length < 2) return [];

    const isGatewayQuery = rawQ.includes('gateway');
    const isQuantumQuery = rawQ.includes('quantum');
    const isBitwiseQuery = rawQ.includes('bitwise');
    const isMultiAtomQuery = rawQ.includes('multi') || rawQ.includes('atom');

    let queryYear = null;
    if (rawQ.includes('year 1') || rawQ.includes('1st year') || rawQ.includes('year-1')) queryYear = '1';
    else if (rawQ.includes('year 2') || rawQ.includes('2nd year') || rawQ.includes('year-2')) queryYear = '2';
    else if (rawQ.includes('year 3') || rawQ.includes('3rd year') || rawQ.includes('year-3')) queryYear = '3';
    else if (rawQ.includes('year 4') || rawQ.includes('4th year') || rawQ.includes('year-4')) queryYear = '4';

    const subjectCleanQuery = rawQ
      .replace(/gateway\s*(classes)?/gi, '')
      .replace(/quantum(\s*notes)?/gi, '')
      .replace(/bitwise(\s*learning)?/gi, '')
      .replace(/multi\s*atom/gi, '')
      .replace(/year\s*[1-4]/gi, '')
      .replace(/[1-4](st|nd|rd|th)\s*year/gi, '')
      .replace(/notes?/gi, '')
      .trim();

    return (dbNotes || []).filter(note => {
      if (queryYear && normYearStr(note.year) !== queryYear) {
        return false;
      }

      const noteSourceKey = normSourceKey(note.source || note.sourceKey);
      const noteSource = String(note.source || '').toLowerCase();
      const noteTitle = String(note.title || '').toLowerCase();
      const noteSubject = String(note.subject || note.subjectName || '').toLowerCase();
      const noteCode = String(note.subjectCode || '').toLowerCase();
      const noteBranch = String(note.branch || '').toLowerCase();
      const noteYear = String(note.year || '').toLowerCase();

      if (isGatewayQuery) {
        if (noteSourceKey !== 'gateway_classes' && !noteSource.includes('gateway')) {
          return false;
        }
        if (!subjectCleanQuery) return true;
        return noteSubject.includes(subjectCleanQuery) ||
               noteTitle.includes(subjectCleanQuery) ||
               noteCode.includes(subjectCleanQuery) ||
               isSubjectMatch(noteCode, noteSubject, '', subjectCleanQuery);
      }

      if (isQuantumQuery) {
        if (noteSourceKey !== 'quantum' && !noteSource.includes('quantum')) return false;
        if (!subjectCleanQuery) return true;
        return noteSubject.includes(subjectCleanQuery) || noteTitle.includes(subjectCleanQuery) || noteCode.includes(subjectCleanQuery) || isSubjectMatch(noteCode, noteSubject, '', subjectCleanQuery);
      }

      if (isBitwiseQuery) {
        if (noteSourceKey !== 'bitwise_learning' && !noteSource.includes('bitwise')) return false;
        if (!subjectCleanQuery) return true;
        return noteSubject.includes(subjectCleanQuery) || noteTitle.includes(subjectCleanQuery) || noteCode.includes(subjectCleanQuery) || isSubjectMatch(noteCode, noteSubject, '', subjectCleanQuery);
      }

      if (isMultiAtomQuery) {
        if (noteSourceKey !== 'multi_atom' && !noteSource.includes('multi')) return false;
        if (!subjectCleanQuery) return true;
        return noteSubject.includes(subjectCleanQuery) || noteTitle.includes(subjectCleanQuery) || noteCode.includes(subjectCleanQuery) || isSubjectMatch(noteCode, noteSubject, '', subjectCleanQuery);
      }

      return noteTitle.includes(rawQ) ||
             noteSubject.includes(rawQ) ||
             noteCode.includes(rawQ) ||
             noteSource.includes(rawQ) ||
             `${noteBranch} ${noteYear}`.includes(rawQ) ||
             isSubjectMatch(noteCode, noteSubject, '', rawQ);
    });
  }, [dbNotes, heroSearchQuery, subjectSearchQuery]);

  // FINAL FILTERED SUBJECT CARDS DISPLAYED IN WORKSPACE
  const filteredSubjects = useMemo(() => {
    let list = availableSubjectsForFilter;

    const query = (heroSearchQuery || subjectSearchQuery || '').toLowerCase().trim();
    if (query) {
      const isSourceOnlyQuery = ['gateway', 'gateway classes', 'quantum', 'bitwise', 'multi atom'].some(s => query === s || query === `${s} notes`);
      if (isSourceOnlyQuery) {
        const targetSrc = normSourceKey(query);
        list = list.filter(s => {
          return (dbNotes || []).some(n => {
            const matchSrc = normSourceKey(n.source || n.sourceKey) === targetSrc;
            const matchSub = isSubjectMatch(s.code, s.subject, n.subjectCode, n.subject || n.subjectName);
            return matchSrc && matchSub;
          });
        });
      } else {
        const cleanQ = query
          .replace(/gateway\s*(classes)?/gi, '')
          .replace(/quantum(\s*notes)?/gi, '')
          .replace(/bitwise(\s*learning)?/gi, '')
          .replace(/multi\s*atom/gi, '')
          .replace(/year\s*[1-4]/gi, '')
          .replace(/[1-4](st|nd|rd|th)\s*year/gi, '')
          .replace(/notes?/gi, '')
          .trim();

        const searchToUse = cleanQ || query;
        list = list.filter(s =>
          s.subject.toLowerCase().includes(searchToUse) ||
          (s.code && s.code.toLowerCase().includes(searchToUse)) ||
          isSubjectMatch(s.code, s.subject, '', searchToUse)
        );
      }
    }

    if (activeSemester && activeSemester !== 'All') {
      list = list.filter(s => s.semester === activeSemester);
    }

    if (selectedSubject && selectedSubject !== 'All Subjects') {
      list = list.filter(s => s.subject === selectedSubject || (s.code && s.code === selectedSubject));
    }

    return list;
  }, [availableSubjectsForFilter, heroSearchQuery, subjectSearchQuery, activeSemester, selectedSubject, dbNotes]);

  // CASCADING RESET EFFECT (ONLY RESET IF NO ACTIVE SUBJECT IS SELECTED AND SUBJECT DOES NOT MATCH)
  React.useEffect(() => {
    if (selectedSubject !== 'All Subjects' && !activeSubject) {
      const exists = availableSubjectsForFilter.some(
        s => isSubjectMatch(s.code, s.subject, '', selectedSubject) || s.subject === selectedSubject || (s.code && s.code === selectedSubject)
      );
      if (!exists) {
        setSelectedSubject('All Subjects');
      }
    }
  }, [activeBranch, activeYear, availableSubjectsForFilter, selectedSubject, activeSubject]);

  // COMPUTE ALL AVAILABLE DYNAMIC NOTE RESOURCES FOR ACTIVE SUBJECT & UNIT
  const activeUnitResources = useMemo(() => {
    if (!activeSubject || !activeUnit) return [];

    const activeBranchNorm = normBranchStr(activeBranch);
    const activeYearNorm = normYearStr(activeYear);
    const resourcesMap = new Map();
    const seenSourceKeys = new Set();

    // 1. Collect all matching DB notes for this subject and unit
    if (dbNotes && dbNotes.length > 0) {
      dbNotes.forEach(n => {
        const nBranchNorm = normBranchStr(n.branch || n.branchId);
        const matchBranch = !activeBranchNorm || nBranchNorm === activeBranchNorm || nBranchNorm === 'ALL';
        const nYearNorm = normYearStr(n.year);
        const matchYear = !activeYearNorm || nYearNorm === activeYearNorm;
        const matchSub = isSubjectMatch(activeSubject.code, activeSubject.subject || activeSubject.name, n.subjectCode, n.subject || n.subjectName);
        const matchUnit = Number(n.unit !== undefined ? n.unit : n.unitNumber) === Number(activeUnit);
        const isPub = n.status === 'published' || n.status === 'Verified' || n.status === 'Published' || String(n.published) === 'true' || n.published !== false;
        const isAvail = String(n.available) === 'true' || n.available !== false;

        if (matchBranch && matchYear && matchSub && matchUnit && isPub && isAvail) {
          const srcName = n.source || n.sourceName || 'Study Material';
          const meta = getSourceMeta(srcName);
          const sourceKey = normSourceKey(n.source || n.sourceKey || srcName);
          
          seenSourceKeys.add(sourceKey);
          seenSourceKeys.add(srcName.toLowerCase());

          const isSuccess = n.mirrorStatus === 'success' && Boolean(n.driveUrl);
          const driveUrl = isSuccess ? n.driveUrl : '';
          const origUrl = n.originalUrl || n.url || n.pdfUrl || n.fileUrl || '';

          const isUnavailableWithEvidence = (n.notesStatus === 'coming_soon' || n.mirrorStatus === 'unavailable') && Boolean(n.unavailableReason);

          const candidate = {
            id: n.id,
            title: n.title || `${srcName} - ${activeSubject.subject} (Unit ${activeUnit})`,
            source: srcName,
            sourceKey: sourceKey,
            meta: meta,
            url: isSuccess ? driveUrl : null,
            driveUrl: driveUrl,
            originalUrl: origUrl,
            mirrorStatus: isSuccess ? 'success' : (isUnavailableWithEvidence ? 'unavailable' : 'pending'),
            notesStatus: isSuccess ? 'active' : (isUnavailableWithEvidence ? 'coming_soon' : 'pending'),
            unavailableReason: n.unavailableReason || '',
            mirrorError: n.mirrorError || '',
            isAvailable: isSuccess,
            unit: activeUnit
          };

          const key = srcName.toLowerCase().trim();
          const existing = resourcesMap.get(key);
          if (!existing) {
            resourcesMap.set(key, candidate);
          } else {
            const existingSuccess = existing.mirrorStatus === 'success' && existing.driveUrl;
            const newSuccess = candidate.mirrorStatus === 'success' && candidate.driveUrl;
            if (!existingSuccess && newSuccess) {
              resourcesMap.set(key, candidate);
            }
          }
        }
      });
    }

    const resources = Array.from(resourcesMap.values());

    // 2. Static Quantum check if not already present
    if (!seenSourceKeys.has('quantum')) {
      const staticQuantumUrl = getSubjectQuantumPdfUrl(activeSubject.code, activeSubject.subject) || activeSubject.pdfUrl;
      if (staticQuantumUrl) {
        const meta = getSourceMeta('Quantum Notes');
        seenSourceKeys.add('quantum');
        resources.push({
          id: `static-quantum-${activeSubject.code || activeSubject.id}-${activeUnit}`,
          title: `Quantum Notes - ${activeSubject.subject} (Unit ${activeUnit})`,
          source: 'Quantum Notes',
          sourceKey: 'quantum',
          meta: meta,
          url: staticQuantumUrl,
          driveUrl: staticQuantumUrl,
          mirrorStatus: 'success',
          mirrorError: '',
          isAvailable: true,
          unit: activeUnit
        });
      }
    }

    // 3. For standard sources not yet uploaded, provide request card
    NOTE_SOURCES.forEach(std => {
      if (!seenSourceKeys.has(std.id)) {
        resources.push({
          id: `missing-${std.id}-${activeUnit}`,
          title: `${std.name} - ${activeSubject.subject} (Unit ${activeUnit})`,
          source: std.name,
          sourceKey: std.id,
          meta: std,
          url: null,
          driveUrl: '',
          mirrorStatus: 'pending',
          mirrorError: '',
          isAvailable: false,
          unit: activeUnit
        });
      }
    });

    return resources;
  }, [activeSubject, activeUnit, activeBranch, activeYear, dbNotes]);

  const handleOpenNote = (noteItem) => {
    if (!noteItem) return;
    const noteObj = typeof noteItem === 'string'
      ? { title: activeSubject?.subject || 'Course Resource', fileUrl: noteItem, resourceUrl: noteItem, verifiedUrl: noteItem }
      : noteItem;

    const resourceUrl = noteObj.verifiedUrl || noteObj.resourceUrl || noteObj.fileUrl || noteObj.driveUrl || noteObj.url;
    if (!resourceUrl && noteObj.mirrorStatus === 'failed') {
      alert('This resource is currently unavailable.');
      return;
    }

    setActiveViewerNote({
      note: noteObj,
      subject: activeSubject,
      unit: activeUnit ? { unitNo: activeUnit, topics: [] } : null
    });
  };

  // Handle Branch Click -> Reset Year to 1st Year, Subject to null, Unit to null
  const handleSelectBranchCard = (bId) => {
    setActiveBranch(bId);
    setActiveYear('1st Year');
    setActiveSemester(null);
    setActiveSubject(null);
    setActiveUnit(null);
    setSelectedSubject('All Subjects');
    setSubjectDropdownSearch('');
    setSelectedBranches([bId]);
    updateUrlParams({ course: 'B.Tech', branch: bId, year: '1st Year', subject: null, unit: null });
  };

  // Handle Year Click -> Reset Subject to null, Unit to null
  const handleSelectYearCard = (yStr) => {
    setActiveYear(yStr);
    if (!activeBranch) setActiveBranch('CSE');
    setActiveSemester(null);
    setActiveSubject(null);
    setActiveUnit(null);
    setSelectedSubject('All Subjects');
    setSubjectDropdownSearch('');
    setSelectedYears([yStr]);
    updateUrlParams({ course: 'B.Tech', branch: activeBranch || 'CSE', year: yStr, subject: null, unit: null });
  };

  // Handle Semester Click -> Open Subjects List
  const handleSelectSemesterCard = (semStr) => {
    setActiveSemester(semStr);
    setActiveSubject(null);
    setActiveUnit(null);
    setSelectedSemesters([semStr]);
  };

  // Handle Subject Click -> Reset Unit to null
  const handleSelectSubjectCard = (subjectObj) => {
    setActiveSubject(subjectObj);
    setActiveUnit(null);
    if (subjectObj) {
      setSelectedSubject(subjectObj.subject);
      updateUrlParams({ course: 'B.Tech', branch: activeBranch, year: activeYear, subject: subjectObj.subject, unit: null });
    } else {
      setSelectedSubject('All Subjects');
      updateUrlParams({ course: 'B.Tech', branch: activeBranch, year: activeYear, subject: null, unit: null });
    }
  };

  // Clear All Navigation & Filters
  const handleClearAll = () => {
    setActiveBranch('CSE');
    setActiveYear('1st Year');
    setActiveSemester(null);
    setActiveSubject(null);
    setActiveUnit(null);
    setSelectedBranches([]);
    setSelectedYears([]);
    setSelectedSemesters([]);
    setSelectedSubjects([]);
    setSelectedSubject('All Subjects');
    setSubjectDropdownSearch('');
    setSubjectSearchQuery('');
    setHeroSearchQuery('');
    updateUrlParams({ course: 'B.Tech', branch: 'CSE', year: '1st Year', subject: null, unit: null });
  };

  if (!selectedCourseData) {
    const validCourses = Object.keys(courses).filter(c => !c.includes('.'));
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] bg-[#FAF7F2]">
        <h2 className="text-2xl font-black text-[#1F2421] mb-2">Course "{courseParam}" not found</h2>
        <p className="text-stone-600 mb-6">Available: {validCourses.join(', ')}</p>
        <div className="flex gap-2 justify-center flex-wrap max-w-lg">
          {validCourses.map(c => (
            <button key={c} onClick={() => window.location.href = `/notes?course=${c}`} className="px-5 py-2.5 bg-[#7A2327] hover:bg-[#5C1A1D] text-white rounded-xl font-bold shadow-md transition-all">{c}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pv-mobile-notes-view">
        <MobileNotesScreen
          courseKey={selectedCourse}
          selectedYearProp={activeYear}
          selectedBranchProp={activeBranch}
          dbNotes={dbNotes}
          onSelectCourse={handleCourseTabChange}
          onSelectYear={(y) => setActiveYear(y)}
          onSelectBranch={(b) => setActiveBranch(b)}
          onOpenViewer={({ note, subject, unit }) => {
            setActiveViewerNote({ note, subject, unit: unit ? { unitNo: unit, topics: [] } : null });
          }}
          onRequestNotes={(subject, unit) => {
            setRequestUnitInfo({ subject: { subject: subject?.name || 'Subject', code: subject?.code || '' }, unitNo: unit });
            setIsRequestModalOpen(true);
          }}
          onNavigate={onNavigate}
        />
      </div>

      <div className="pv-desktop-notes-view" style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1C1E21' }}>
        
        {/* 0. COURSE SELECTOR TABS (B.Tech | MCA | MBA | B.Pharm) */}
        <div style={{
          backgroundColor: '#FCFAF6',
        borderBottom: '1.5px solid #E8E2D5',
        padding: '0.75rem 0',
        boxShadow: '0 2px 8px rgba(35,30,25,0.02)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#7A6F62', letterSpacing: '0.04em' }}>
              Curriculum:
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(courses).filter(c => !c.includes('.')).map(courseName => {
              const isSelected = normalizedCourse === courseName;
              return (
                <button
                  key={courseName}
                  onClick={() => handleCourseTabChange(courseName)}
                  style={{
                    padding: '0.45rem 1.25rem',
                    borderRadius: '9999px',
                    border: isSelected ? '2px solid #7A2327' : '1.5px solid #E8E2D5',
                    backgroundColor: isSelected ? '#7A2327' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#3A3530',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isSelected ? '0 4px 12px rgba(122,35,39,0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{courseName}</span>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. LARGE NOTES HERO BANNER */}
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
            gridTemplateColumns: '250px 1fr 320px',
            gap: '1.25rem',
            alignItems: 'center'
          }} className="notes-hero-grid">

            {/* LEFT: Virus Teacher Mascot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="notes-left-mascot">
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
                “Notes banao, <br />
                life set karo!” <br />
                <span style={{ color: '#C88D2D' }}>— ProfessorVirus</span>
                <div style={{
                  position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                  width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '10px solid #C88D2D'
                }} />
              </div>

              <div style={{ width: '240px', height: '200px', position: 'relative', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))' }}>
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
                    e.target.src = '/assets/navbar_logo.png';
                  }}
                />
              </div>
            </div>

            {/* CENTER: Title & Main Search */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '3.4rem',
                  fontWeight: 900,
                  color: '#1F2421',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}>
                  AKTU Notes Hub
                </h1>
                <BookOpen size={42} style={{ color: '#C88D2D' }} />
              </div>

              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#7A5835',
                fontSize: '1.35rem',
                fontWeight: 700
              }}>
                Quantum • Gateway Classes • Bitwise Learning • Multi Atom
              </div>

              <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, maxWidth: '520px' }}>
                Unit-wise verified notes and Quantum series for AKTU B.Tech engineering branches.
              </p>

              {/* SEARCH BAR */}
              <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%', maxWidth: '560px', position: 'relative', marginTop: '0.75rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '9999px',
                  padding: '0.35rem 0.4rem 0.35rem 1.25rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)', border: '1px solid #E8E2D5'
                }}>
                  <Search size={18} style={{ color: '#7A5835', marginRight: '0.6rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search notes by subject, code, or source (e.g. Gateway, KAS-103)..."
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.92rem', color: '#1C1E21', fontWeight: 500, backgroundColor: 'transparent' }}
                  />
                  {heroSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setHeroSearchQuery('');
                        if (onClearSearch) onClearSearch();
                      }}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0 0.5rem', display: 'flex', alignItems: 'center', marginRight: '0.25rem' }}
                      title="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', fontWeight: 700, backgroundColor: '#1F2421', borderRadius: '9999px', flexShrink: 0 }}>
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT GRAPHIC: All Izz Well Shared Banner */}
            <AllIzzWellBanner title={"Semester Top Karna Hai?\nNotes Padhna Shuru Karo! :)"} className="notes-right-mascot" />

          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT: COURSE BRANCH & YEAR SELECTOR + SUBJECTS LIST */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem 1.25rem' }}>
        {/* Branch Tabs */}
        {branches.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto justify-center flex-wrap bg-white/80 rounded-2xl border border-stone-200/80 mb-4 shadow-xs">
            {(branches || []).map(branch => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedBranch === branch
                    ? 'bg-[#1F2421] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        )}

        {/* Year Tabs */}
        {yearKeys.length > 1 && (
          <div className="flex gap-2 overflow-x-auto justify-center flex-wrap mb-6">
            {(yearKeys || []).map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-[#C88D2D] text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}

        {/* Subjects List - WITH NOTES & PYQ COUNT */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-[#1F2421]">
              {normalizedCourse} {selectedBranch !== 'General' ? selectedBranch : ''} • {selectedYear} Subjects
            </h2>
            <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
              {subjects.length} Subjects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(subjects || []).map(sub => {
              const notesCount = notesData?.[sub.code]?.length || 5;
              const pyqsCount = pyqsData?.[sub.code]?.length || 3;
              return (
                <div key={sub.code} className="border border-stone-200 hover:border-[#7A2327]/50 bg-white p-5 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-md border border-amber-200/60 uppercase">
                        {sub.code}
                      </span>
                      <span className="text-xs font-bold text-stone-400">
                        {selectedYear}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#1F2421] mb-2">{sub.name}</h3>
                    <p className="text-xs font-semibold text-stone-600 mb-4">
                      Notes: <span className="text-emerald-700 font-bold">{notesCount} units</span> | PYQs: <span className="text-blue-700 font-bold">{pyqsCount} years</span>
                    </p>
                  </div>
                  <a
                    href={`/subject/${sub.code}?course=${normalizedCourse}`}
                    className="w-full text-center py-2.5 px-4 bg-[#7A2327] hover:bg-[#5C1A1D] text-white rounded-xl font-bold text-xs shadow-xs transition-all block"
                  >
                    View Subject Notes & PYQs →
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unified Course Notes View for detailed quantum/gateway series browsing */}
        <CourseNotesView
          courseKey={normalizedCourse}
          dbNotes={dbNotes}
          onOpenViewer={({ note, subject, unit }) => {
            setActiveViewerNote({ note, subject, unit: unit ? { unitNo: unit, topics: [] } : null });
          }}
          onRequestNotes={(subject, unit) => {
            setRequestUnitInfo({ subject: { subject: subject?.name || 'Subject', code: subject?.code || '' }, unitNo: unit });
            setIsRequestModalOpen(true);
          }}
          onOpenAuth={onOpenAuth}
          onNavigate={onNavigate}
        />
      </div>

      {/* 4. BOTTOM ACADEMIC RESOURCE BANNER */}
      <AcademicResourceBanner onNavigate={onNavigate} />
    </div>

      {/* UPLOAD NOTES MODAL */}
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={() => {
            setIsUploadModalOpen(false);
            alert('Note submitted successfully! Sent to admin for verification.');
          }}
        />
      )}

      {/* REQUEST NOTE MODAL */}
      {isRequestModalOpen && (
        <RequestModal
          initialInfo={requestUnitInfo}
          onClose={() => {
            setIsRequestModalOpen(false);
            setRequestUnitInfo(null);
          }}
        />
      )}

      {/* NOTE VIEWER MODAL */}
      {activeViewerNote && (
        <NoteViewerModal
          note={activeViewerNote.note}
          subject={activeViewerNote.subject}
          unit={activeViewerNote.unit}
          onClose={() => setActiveViewerNote(null)}
        />
      )}

      {/* COURSE SELECT MODAL */}
      <CourseSelectModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        targetTab="notes"
        onSelectCourse={(c) => {
          handleCourseTabChange(c);
          setIsCourseModalOpen(false);
        }}
      />

      <style>{`
        @media (max-width: 1024px) {
          .notes-main-layout { grid-template-columns: 1fr !important; }
          .notes-bottom-banner { grid-template-columns: 1fr !important; textAlign: center !important; }
        }
      `}</style>

    </>
  );
}

// HELPER SEMESTER CARD COMPONENT
function SemesterCard({ sem, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0',
        padding: '1.35rem', cursor: 'pointer', transition: 'all 0.2s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#C88D2D';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
          {sem}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#C88D2D', fontWeight: 700, marginTop: '0.2rem' }}>
          Explore Verified AKTU Subjects →
        </div>
      </div>
      <ArrowRight size={20} style={{ color: '#C88D2D' }} />
    </div>
  );
}

// UPLOAD NOTE FORM MODAL COMPONENT
function UploadModal({ onClose, onUpload }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('2nd Year');
  const [unit, setUnit] = useState('Unit 1');
  const [rightsConfirmed, setRightsConfirmed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rightsConfirmed) {
      alert('Please confirm that you own this material or have permission to share it.');
      return;
    }
    onUpload();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '480px', width: '100%',
        padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <UploadCloud size={24} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
            Upload Unit Notes
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={modalLabelStyle}>Note Title</label>
            <input
              type="text"
              placeholder="e.g. Unit 1 Operating System Handwritten Notes"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={modalInputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Branch</label>
              <select value={branch} onChange={(e) => setBranch(e.target.value)} style={modalInputStyle}>
                <option>CSE</option>
                <option>ECE</option>
                <option>ME</option>
                <option>CE</option>
                <option>IT</option>
                <option>EE</option>
                <option>AI & DS</option>
              </select>
            </div>

            <div>
              <label style={modalLabelStyle}>Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} style={modalInputStyle}>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Subject</label>
              <input
                type="text"
                placeholder="e.g. Operating System"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={modalInputStyle}
              />
            </div>

            <div>
              <label style={modalLabelStyle}>Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} style={modalInputStyle}>
                <option>Unit 1</option>
                <option>Unit 2</option>
                <option>Unit 3</option>
                <option>Unit 4</option>
                <option>Unit 5</option>
              </select>
            </div>
          </div>

          <div>
            <label style={modalLabelStyle}>PDF File Attachment</label>
            <input type="file" accept=".pdf,.doc,.docx" required style={{ fontSize: '0.85rem' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', cursor: 'pointer', marginTop: '0.2rem' }}>
            <input
              type="checkbox"
              checked={rightsConfirmed}
              onChange={(e) => setRightsConfirmed(e.target.checked)}
              style={{ marginTop: '3px', accentColor: '#C88D2D' }}
            />
            <span style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.3 }}>
              I confirm that I own this study material or have permission to share it under educational fair use policies.
            </span>
          </label>

          <button type="submit" className="btn-primary" style={{ backgroundColor: '#1F2421', marginTop: '0.5rem', padding: '0.7rem' }}>
            Submit Note for Admin Verification
          </button>
        </form>
      </div>
    </div>
  );
}

// REQUEST NOTE FORM MODAL COMPONENT
function RequestModal({ initialInfo, onClose }) {
  const [reqSubject, setReqSubject] = useState(initialInfo ? `${initialInfo.subject.subject}` : '');
  const [reqMessage, setReqMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! Your request for "${reqSubject}" notes has been submitted to the faculty team.`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '440px', width: '100%',
        padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <PlusCircle size={24} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
            Request Subject Notes
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={modalLabelStyle}>Subject Name / Code</label>
            <input
              type="text"
              placeholder="e.g. Engineering Physics (KAS-101T)"
              required
              value={reqSubject}
              onChange={(e) => setReqSubject(e.target.value)}
              style={modalInputStyle}
            />
          </div>

          <div>
            <label style={modalLabelStyle}>Specific Topics / Numerical Requests</label>
            <textarea
              placeholder="Add details (e.g. Banker Algorithm solved numericals needed)..."
              rows={3}
              value={reqMessage}
              onChange={(e) => setReqMessage(e.target.value)}
              style={{ ...modalInputStyle, resize: 'none' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ backgroundColor: '#1F2421', marginTop: '0.5rem', padding: '0.7rem' }}>
            Send Request to Faculty
          </button>
        </form>
      </div>
    </div>
  );
}

// Styling Constants
const filterTitleStyle = {
  fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.6rem'
};

const checkboxLabelStyle = {
  display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer'
};

const checkboxInputStyle = {
  accentColor: '#C88D2D', width: '15px', height: '15px', cursor: 'pointer'
};

const modalLabelStyle = {
  fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem', display: 'block'
};

const modalInputStyle = {
  width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.55rem 0.8rem',
  fontSize: '0.85rem', backgroundColor: '#f8fafc', outline: 'none', color: '#0f172a'
};
