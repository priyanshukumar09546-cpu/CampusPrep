import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FileText, 
  ChevronRight, 
  Sparkles, 
  Download, 
  Eye, 
  Clock, 
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  PlusCircle,
  Search,
  X,
  RotateCcw,
  Filter,
  BookOpen,
  Layers,
  CheckCircle,
  Tag
} from 'lucide-react';
import { COURSES, getSubjectsForCourse, getCourseMeta, normalizeCourseKey } from '../data/coursesCatalog';
import { pyqsData as localPyqsData } from '../data/pyqsData';
import { pyqQuestionsData } from '../data/pyqQuestionsData';
import { AKTU_SYLLABUS_DATA } from '../data/aktuSyllabusData';
import { API_URL } from '../config/api';
import {
  cleanCode,
  getCanonicalCode,
  normalizeSubjectTitle,
  areSubjectsMatching,
  deduplicatePyqs,
  filterPyqs
} from '../utils/pyqUtils';

// Strict Real Database Branches ONLY — zero fake branches
const BTECH_BRANCHES = [
  { id: 'CSE', name: 'CSE', fullName: 'Computer Science & Engineering' },
  { id: 'ECE', name: 'ECE', fullName: 'Electronics & Communication' },
  { id: 'ME', name: 'ME', fullName: 'Mechanical Engineering' },
  { id: 'CE', name: 'CE', fullName: 'Civil Engineering' },
  { id: 'IT', name: 'IT', fullName: 'Information Technology' },
  { id: 'EE', name: 'EE', fullName: 'Electrical Engineering' }
];

const BTECH_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const ACADEMIC_YEARS = [
  'All',
  '2024-2025',
  '2023-2024',
  '2022-2023',
  '2021-2022',
  '2020-2021',
  '2019-2020',
  '2018-2019'
];

const EXAM_TYPES = ['All', 'Odd Semester', 'Even Semester', 'End Semester'];

// Helper to reliably derive course for any PYQ item (even when p.course is undefined)
export const getPyqCourse = (p) => {
  if (!p) return 'B.Tech';
  if (p.course) {
    const norm = normalizeCourseKey(p.course);
    return norm || p.course;
  }
  const code = String(p.subjectCode || p.code || '').toUpperCase().trim();
  const sub = String(p.subject || p.subjectName || '').toLowerCase().trim();

  if (code.startsWith('BBA') || sub.includes('bba')) return 'BBA';
  if (code.startsWith('BCA') || code.startsWith('RCA') || sub.includes('bca')) return 'BCA';
  if (code.startsWith('KMBN') || code.startsWith('MBA') || code.startsWith('RMB') || sub.includes('mba')) return 'MBA';
  if (code.startsWith('KCA') || code.startsWith('MCA') || sub.includes('mca')) return 'MCA';
  if (code.startsWith('BP') || code.startsWith('BPH') || sub.includes('pharm')) return 'B.Pharm';
  if (code.startsWith('MTCS') || code.startsWith('MCS') || code.startsWith('MEC') || code.startsWith('MT') || sub.includes('m.tech') || sub.includes('mtech')) return 'M.Tech';

  return 'B.Tech';
};

// Safe deduplicating merge helper with universal drive ID & exam identity deduplication
const mergePyqLists = (primary, fallback) => {
  return deduplicatePyqs([...(primary || []), ...(fallback || [])]);
};

// Normalization & Canonical Code Helpers (declared at module level to prevent TDZ)
const cleanAlpha = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const normSubCanonical = normalizeSubjectTitle;

const normalizeAcademicYear = (raw) => {
  if (!raw) return '';
  let s = String(raw).trim().replace(/^0+/, '');
  const mCorrupt = s.match(/^(20\d{2})2013(\d{2})$/);
  if (mCorrupt) {
    const y1 = parseInt(mCorrupt[1], 10);
    let y2 = parseInt(mCorrupt[2], 10) + 2000;
    return `${y1}-${y2}`;
  }
  const m = s.match(/(\d{4})\s*[-–/]\s*(\d{2,4})/);
  if (m) {
    const y1 = parseInt(m[1], 10);
    let y2 = parseInt(m[2], 10);
    if (y2 < 100) y2 += 2000;
    return `${y1}-${y2}`;
  }
  const mSingle = s.match(/\b(20\d{2})\b/);
  if (mSingle) {
    const yEnd = parseInt(mSingle[1], 10);
    return `${yEnd - 1}-${yEnd}`;
  }
  return s;
};

export default function CoursePyqsView({ 
  courseKey = 'B.Tech', 
  dbPyqs = [], 
  onOpenPdf,
  onRequestPyq,
  onOpenAuth,
  initialSearchQuery = '',
  onNavigate
}) {
  const normKey = normalizeCourseKey(courseKey);
  const isBTech = normKey === 'B.Tech' || normKey === 'BTech';
  const courseMeta = getCourseMeta(normKey) || COURSES[0];

  // Helper to read URL query params on initial mount
  const getInitialParam = (key, fallback) => {
    try {
      const p = new URLSearchParams(window.location.search);
      const val = p.get(key);
      if (val !== null && val !== undefined && val !== '') return val;
    } catch (e) {}
    return fallback;
  };

  const normalizeYearStr = (raw) => {
    if (!raw) return '1st Year';
    const s = String(raw).toLowerCase().trim();
    if (s.includes('1')) return '1st Year';
    if (s.includes('2')) return '2nd Year';
    if (s.includes('3')) return '3rd Year';
    if (s.includes('4')) return '4th Year';
    return '1st Year';
  };

  // State: Branch, Year, Semester
  const [activeBranch, setActiveBranch] = useState(() => getInitialParam('branch', 'CSE'));
  const [activeYear, setActiveYear] = useState(() => normalizeYearStr(getInitialParam('year', '1st Year')));
  const [activeSemester, setActiveSemester] = useState(() => {
    const fallback = isBTech ? 'All Semesters' : (courseMeta.semesters ? courseMeta.semesters[0] : 'Semester 1');
    return getInitialParam('semester', fallback);
  });

  // Specialization for MBA
  const [activeSpecialization, setActiveSpecialization] = useState(() =>
    getInitialParam('specialization', courseMeta.specializations ? courseMeta.specializations[0] : null)
  );

  // Filter States: Academic Year, Exam Type, Search
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(() => getInitialParam('academicYear', 'All'));
  const [selectedExamType, setSelectedExamType] = useState(() => getInitialParam('examType', 'All'));
  const [subjectSearch, setSubjectSearch] = useState('');
  const [pyqSearchQuery, setPyqSearchQuery] = useState(initialSearchQuery || '');

  // Subject Selection
  const [activeSubject, setActiveSubject] = useState(null);

  // Chapter-Wise & Unit Filtering States
  const [pyqViewMode, setPyqViewMode] = useState('papers'); // 'papers' | 'chapters'
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('all'); // 'all' | 1 | 2 | 3 | 4 | 5 | 'unclassified'
  const [questionSearch, setQuestionSearch] = useState('');

  // Local state for fetched PYQs (resilient fallback if dbPyqs prop is empty/loading)
  const allFallbackPyqs = useMemo(() => {
    try {
      return Object.values(localPyqsData).flat();
    } catch (e) {
      return [];
    }
  }, []);

  const [localPyqs, setLocalPyqs] = useState(() => {
    try {
      const fallback = Object.values(localPyqsData).flat();
      if (Array.isArray(dbPyqs) && dbPyqs.length > 0) {
        return mergePyqLists(dbPyqs, fallback);
      }
      return fallback;
    } catch (e) {
      return Array.isArray(dbPyqs) ? dbPyqs : [];
    }
  });

  useEffect(() => {
    if (Array.isArray(dbPyqs) && dbPyqs.length > 0) {
      setLocalPyqs(mergePyqLists(dbPyqs, allFallbackPyqs));
      return;
    }
    
    // STEP 1: ALWAYS load local first (instant, works offline)
    if (allFallbackPyqs.length > 0) {
      setLocalPyqs(allFallbackPyqs);
    }

    // STEP 2: Background API fetch
    fetch(`${API_URL}/api/pyqs?course=${encodeURIComponent(normKey)}&_t=${Date.now()}`)
      .then(res => {
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) {
          throw new Error('Backend not available');
        }
        return res.json();
      })
      .then(data => {
        const pyqList = Array.isArray(data) ? data : (data?.pyqs || []);
        if (pyqList.length > 0) {
          setLocalPyqs(mergePyqLists(pyqList, allFallbackPyqs));
        }
      })
      .catch(err => console.log('Backend not available, keeping local fallback pyqs:', err));
  }, [normKey, dbPyqs, allFallbackPyqs]);

  // Filter all loaded local/db PYQs for current course
  const currentCoursePyqs = useMemo(() => {
    if (!Array.isArray(localPyqs)) return [];
    return localPyqs.filter(p => {
      const pCourse = cleanAlpha(getPyqCourse(p));
      return isBTech ? pCourse === 'btech' : pCourse === cleanAlpha(normKey);
    });
  }, [localPyqs, isBTech, normKey]);

  const hasCoursePyqs = currentCoursePyqs.length > 0;

  // Dynamically derive branches backed by actual uploaded documents
  const dynamicBranches = useMemo(() => {
    if (!hasCoursePyqs) return [];
    const set = new Set();
    currentCoursePyqs.forEach(p => {
      const b = String(p.branch || p.branchId || '').trim().toUpperCase();
      if (b && b !== 'ALL' && b !== 'COMMON') set.add(b);
    });
    return Array.from(set).map(b => ({
      id: b,
      name: b,
      fullName: b
    }));
  }, [currentCoursePyqs, hasCoursePyqs]);

  // Dynamically derive years backed by actual uploaded documents
  const dynamicYears = useMemo(() => {
    if (!hasCoursePyqs) return [];
    const set = new Set();
    currentCoursePyqs.forEach(p => {
      const y = String(p.year || p.btechYear || '').trim();
      if (y) set.add(y);
    });
    return Array.from(set);
  }, [currentCoursePyqs, hasCoursePyqs]);

  // URL Sync Helper
  const updateUrl = useCallback((newParams = {}) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('course', normKey);

      if (isBTech) {
        const brVal = newParams.branch !== undefined ? newParams.branch : activeBranch;
        const yrVal = newParams.year !== undefined ? newParams.year : activeYear;
        const semVal = newParams.semester !== undefined ? newParams.semester : activeSemester;
        const ayVal = newParams.academicYear !== undefined ? newParams.academicYear : selectedAcademicYear;
        const etVal = newParams.examType !== undefined ? newParams.examType : selectedExamType;
        const subVal = newParams.subject !== undefined ? newParams.subject : (activeSubject ? (activeSubject.code || activeSubject.name) : null);

        if (brVal) searchParams.set('branch', brVal);
        else searchParams.delete('branch');

        if (yrVal) searchParams.set('year', yrVal);
        else searchParams.delete('year');

        if (semVal && semVal !== 'All Semesters' && semVal !== 'All') searchParams.set('semester', semVal);
        else searchParams.delete('semester');

        if (ayVal && ayVal !== 'All') searchParams.set('academicYear', ayVal);
        else searchParams.delete('academicYear');

        if (etVal && etVal !== 'All') searchParams.set('examType', etVal);
        else searchParams.delete('examType');

        if (subVal) searchParams.set('subject', subVal);
        else searchParams.delete('subject');
      } else {
        Object.entries(newParams).forEach(([k, v]) => {
          if (v === null || v === undefined || v === 'All' || v === 'All Semesters') {
            searchParams.delete(k);
          } else {
            searchParams.set(k, v);
          }
        });
      }

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {}
  }, [normKey, isBTech, activeBranch, activeYear, activeSemester, selectedAcademicYear, selectedExamType, activeSubject]);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (isBTech) {
          const br = params.get('branch');
          if (br) setActiveBranch(br);
          const y = params.get('year');
          if (y) setActiveYear(normalizeYearStr(y));
          const s = params.get('semester');
          setActiveSemester(s || 'All Semesters');
        } else {
          const s = params.get('semester');
          if (s) setActiveSemester(s);
          const sp = params.get('specialization');
          if (sp) setActiveSpecialization(sp);
        }
        const ay = params.get('academicYear');
        if (ay) setSelectedAcademicYear(ay);
        const et = params.get('examType');
        if (et) setSelectedExamType(et);
      } catch (e) {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isBTech]);

  // Strict Hierarchy: Reset child selections when parent course changes
  useEffect(() => {
    if (isBTech) {
      setActiveBranch('CSE');
      setActiveYear('1st Year');
      setActiveSemester('All Semesters');
    } else {
      setActiveBranch('ALL');
      const firstYear = courseMeta.years ? courseMeta.years[0] : '1st Year';
      setActiveYear(firstYear);
      const firstSem = (courseMeta.semestersByYear && courseMeta.semestersByYear[firstYear])
        ? courseMeta.semestersByYear[firstYear][0]
        : (courseMeta.semesters ? courseMeta.semesters[0] : 'Semester 1');
      setActiveSemester(firstSem);
      if (courseMeta.specializations && courseMeta.specializations.length > 0) {
        setActiveSpecialization(courseMeta.specializations[0]);
      }
    }
    setSelectedAcademicYear('All');
    setSelectedExamType('All');
    setSubjectSearch('');
    setPyqSearchQuery('');
    setActiveSubject(null);
  }, [normKey]);

  // Strict Cascading Reset: when Branch changes, reset child subject selection
  useEffect(() => {
    setActiveSubject(null);
  }, [activeBranch]);

  // Strict Cascading Reset: when Year changes, reset child semester and subject
  useEffect(() => {
    if (isBTech) {
      setActiveSemester('All Semesters');
    } else {
      const sems = (courseMeta.semestersByYear && courseMeta.semestersByYear[activeYear]) || courseMeta.semesters || [];
      setActiveSemester(sems[0] || 'All Semesters');
    }
    setActiveSubject(null);
  }, [activeYear, isBTech, courseMeta]);

  // Strict Cascading Reset: when Semester changes, reset child subject
  useEffect(() => {
    setActiveSubject(null);
  }, [activeSemester]);

  // Dynamic Semesters for selected Year (Progressive Hierarchy)
  const availableSemesters = useMemo(() => {
    if (isBTech || normKey === 'BCA') {
      if (courseMeta.semestersByYear && courseMeta.semestersByYear[activeYear]) {
        return ['All Semesters', ...courseMeta.semestersByYear[activeYear].filter(s => s !== 'All Semesters')];
      }
      if (activeYear === '1st Year' || activeYear === 'Year 1') return ['All Semesters', 'Semester 1', 'Semester 2'];
      if (activeYear === '2nd Year' || activeYear === 'Year 2') return ['All Semesters', 'Semester 3', 'Semester 4'];
      if (activeYear === '3rd Year' || activeYear === 'Year 3') return ['All Semesters', 'Semester 5', 'Semester 6'];
      return ['All Semesters', 'Semester 7', 'Semester 8'];
    }
    return courseMeta.semesters || ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'];
  }, [isBTech, normKey, activeYear, courseMeta]);


  // Dynamic Subjects from database (with canonical deduplication for all courses)
  const dynamicDbSubjects = useMemo(() => {
    if (!Array.isArray(localPyqs)) return [];
    const subMap = new Map();

    localPyqs.forEach(p => {
      // 1. Course Filter
      const pCourse = cleanAlpha(getPyqCourse(p));
      if (isBTech ? pCourse !== 'btech' : pCourse !== cleanAlpha(normKey)) return;

      if (isBTech) {
        const targetYearDigit = String(activeYear).replace(/[^0-9]/g, '');
        const isY1 = targetYearDigit === '1';
        const targetBranch = activeBranch.toUpperCase().trim();

        const pYear = String(p.year || p.btechYear || '').replace(/[^0-9]/g, '');
        if (!pYear || pYear !== targetYearDigit) return;

        const pBranch = String(p.branch || p.branchId || '').toUpperCase().trim();
        if (isY1) {
          if (pBranch && pBranch !== 'ALL' && pBranch !== 'COMMON' && pBranch !== targetBranch) return;
        } else {
          if (!pBranch || (pBranch !== targetBranch && pBranch !== 'ALL')) return;
        }

        // Subject code sanity check: e.g. BCS301 cannot appear in Year 1
        const rawCode = (p.subjectCode || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const codeDigitMatch = rawCode.match(/^[A-Z]{2,4}(\d)/);
        if (codeDigitMatch) {
          const semOrYearDigit = codeDigitMatch[1];
          if (targetYearDigit === '1' && ['3', '4', '5', '6', '7', '8'].includes(semOrYearDigit)) return;
          if (targetYearDigit === '2' && ['1', '2', '5', '6', '7', '8'].includes(semOrYearDigit)) return;
          if (targetYearDigit === '3' && ['1', '2', '3', '4', '7', '8'].includes(semOrYearDigit)) return;
          if (targetYearDigit === '4' && ['1', '2', '3', '4', '5', '6'].includes(semOrYearDigit)) return;
        }
      } else {
        const targetYearDigit = String(activeYear).replace(/[^0-9]/g, '');
        if (targetYearDigit) {
          const pYear = String(p.year || '').replace(/[^0-9]/g, '');
          if (pYear && pYear !== targetYearDigit) return;
        }
        if (activeSemester && activeSemester !== 'All' && activeSemester !== 'All Semesters') {
          const semClean = String(activeSemester).replace(/[^0-9]/g, '');
          const pSemClean = String(p.semester || '').replace(/[^0-9]/g, '');
          if (pSemClean && semClean !== pSemClean) return;
        }
        if (normKey === 'MBA' && activeSpecialization && activeSpecialization !== 'All' && activeSpecialization !== 'Core Management') {
          const pSpec = String(p.specialization || '').toLowerCase().trim();
          if (pSpec && !pSpec.includes(activeSpecialization.toLowerCase().trim())) return;
        }
      }

      const rawCode = (p.subjectCode || '').trim();
      const rawName = (p.subjectName || p.subject || '').trim();
      if (!rawName && !rawCode) return;

      const canonCode = getCanonicalCode(rawCode);
      const canonNameNorm = normSubCanonical(rawName);
      const dedupKey = canonCode ? cleanAlpha(canonCode) : canonNameNorm;

      if (!subMap.has(dedupKey)) {
        subMap.set(dedupKey, { 
          code: canonCode || rawCode, 
          name: rawName || rawCode, 
          semester: p.semester || activeSemester 
        });
      }
    });

    return Array.from(subMap.values());
  }, [isBTech, normKey, localPyqs, activeYear, activeBranch, activeSemester, activeSpecialization]);

  // Compute Available Subjects strictly from real uploaded PYQ documents (dynamicDbSubjects)
  const availableSubjects = useMemo(() => {
    return (dynamicDbSubjects || []).sort((a, b) => (a.code || a.name).localeCompare(b.code || b.name));
  }, [dynamicDbSubjects]);

  // Cascading Auto-Select of Subject (Checks initial URL query parameter first)
  useEffect(() => {
    if (availableSubjects.length > 0) {
      const urlSubParam = getInitialParam('subject', null);
      if (urlSubParam && !activeSubject) {
        const decodedParam = decodeURIComponent(urlSubParam).replace(/\+/g, ' ');
        const urlClean = cleanAlpha(decodedParam);
        const urlCanon = cleanAlpha(getCanonicalCode(decodedParam));
        const urlNormName = normSubCanonical(decodedParam);

        const matchFromUrl = availableSubjects.find(s => {
          const sCanon = cleanAlpha(getCanonicalCode(s.code));
          const sCode = cleanAlpha(s.code);
          const sName = normSubCanonical(s.name);
          return (urlCanon && sCanon === urlCanon) ||
                 (urlClean && (sCode === urlClean || sCanon.includes(urlClean) || sCode.includes(urlClean))) ||
                 (urlNormName && (sName === urlNormName || sName.includes(urlNormName) || urlNormName.includes(sName)));
        });

        if (matchFromUrl) {
          setActiveSubject(matchFromUrl);
          return;
        }
      }

      const currentCode = activeSubject?.code;
      const currentCanonCode = currentCode ? cleanAlpha(getCanonicalCode(currentCode)) : '';
      const currentName = normSubCanonical(activeSubject?.name);
      const exists = availableSubjects.find(s => {
        const sCanonCode = cleanAlpha(getCanonicalCode(s.code));
        return (currentCanonCode && sCanonCode === currentCanonCode) ||
               (currentCode && s.code === currentCode) ||
               (currentName && normSubCanonical(s.name) === currentName);
      });
      if (!exists) {
        setActiveSubject(availableSubjects[0]);
      }
    } else {
      setActiveSubject(null);
    }
  }, [availableSubjects]);

  // Subject Paper Counts in DB (Strictly Synchronized with Filtered Unique Papers)
  const subjectPaperCounts = useMemo(() => {
    const counts = {};
    if (!Array.isArray(localPyqs)) return counts;

    availableSubjects.forEach(sub => {
      const papers = filterPyqs(localPyqs, sub, {
        normKey,
        isBTech,
        activeBranch,
        activeYear,
        activeSemester,
        selectedAcademicYear,
        selectedExamType,
        pyqSearchQuery
      });
      counts[sub.code || sub.name] = papers.length;
    });

    return counts;
  }, [localPyqs, availableSubjects, normKey, isBTech, activeBranch, activeYear, activeSemester, selectedAcademicYear, selectedExamType, pyqSearchQuery]);

  // Acronym, Alternate Code & Keyword Search for Subject List
  const filteredSubjects = useMemo(() => {
    if (!subjectSearch.trim()) return availableSubjects;
    const q = subjectSearch.toLowerCase().trim();
    const qClean = cleanAlpha(q);
    const qCanonClean = cleanAlpha(getCanonicalCode(q));

    const aliases = {
      'dsa': ['data structure', 'kcs-301', 'bcs-301'],
      'ds': ['data structure', 'kcs-301', 'bcs-301'],
      'coa': ['computer organization', 'kcs-302', 'bcs-302'],
      'dstl': ['discrete structure', 'kcs-303', 'bcs-303'],
      'oop': ['object oriented', 'kcs-305', 'bcs-304'],
      'tafl': ['theory of automata', 'automata', 'kcs-402'],
      'automata': ['theory of automata', 'tafl', 'kcs-402'],
      'os': ['operating system', 'kcs-401', 'bcs-401'],
      'uhv': ['universal human values', 'kve-301', 'bve-301'],
      'tc': ['technical communication', 'kas-301', 'bas-301'],
      'pps': ['programming for problem solving', 'kcs-101', 'bcs-101'],
      'bee': ['basic electrical engineering', 'kee-101', 'bee-101'],
      'maths': ['mathematics', 'math-1', 'math-2', 'math-4'],
      'math': ['mathematics', 'math-1', 'math-2', 'math-4'],
      'physics': ['physics', 'kas-101', 'bas-101', 'bas101'],
      'chemistry': ['chemistry', 'kas-102', 'bas-102', 'bas102'],
      'evs': ['environment', 'ecology', 'bas-104'],
      'electronics': ['electronics', 'kec-101', 'bec-101', 'kec-201'],
      'electrical': ['electrical', 'kee-101', 'bee-101', 'bee101', 'kee101'],
      'mechanical': ['mechanical', 'kme-101', 'kme-201']
    };

    const targetKeywords = aliases[q] || [q];

    return availableSubjects.filter(s => {
      const sName = (s.name || '').toLowerCase();
      const sCode = (s.code || '').toLowerCase();
      const sCanonClean = cleanAlpha(getCanonicalCode(s.code));

      // Direct match on canonical code
      if (qCanonClean && sCanonClean === qCanonClean) return true;
      if (qClean && (sCanonClean.includes(qClean) || cleanAlpha(sCode).includes(qClean))) return true;

      return targetKeywords.some(kw => sName.includes(kw) || sCode.includes(kw));
    });
  }, [availableSubjects, subjectSearch]);

  // Strict Matched PYQs calculation
  // Matched PYQs for Currently Selected Subject (Strict Deduplication & Accurate Counting)
  const matchedPyqs = useMemo(() => {
    if (!activeSubject || !Array.isArray(localPyqs)) return [];
    return filterPyqs(localPyqs, activeSubject, {
      normKey,
      isBTech,
      activeBranch,
      activeYear,
      activeSemester,
      selectedAcademicYear,
      selectedExamType,
      pyqSearchQuery
    });
  }, [localPyqs, activeSubject, normKey, isBTech, activeBranch, activeYear, activeSemester, selectedAcademicYear, selectedExamType, pyqSearchQuery]);

  // Verified Syllabus Matching for Currently Active Subject
  const currentSubjectSyllabus = useMemo(() => {
    if (!activeSubject) return null;
    const codeClean = cleanAlpha(getCanonicalCode(activeSubject.code || ''));
    const nameClean = cleanAlpha(activeSubject.name || '');
    return AKTU_SYLLABUS_DATA.find(s => {
      const sCode = cleanAlpha(getCanonicalCode(s.code || ''));
      const sName = cleanAlpha(s.subject || '');
      if (codeClean && sCode && (codeClean === sCode || codeClean.includes(sCode) || sCode.includes(codeClean))) return true;
      if (nameClean && sName && (nameClean.includes(sName) || sName.includes(nameClean))) return true;
      return false;
    });
  }, [activeSubject]);

  // Questions for Active Subject (from pyqQuestionsData)
  const allSubjectQuestions = useMemo(() => {
    if (!activeSubject) return [];
    const codeClean = cleanAlpha(getCanonicalCode(activeSubject.code || ''));
    const nameClean = cleanAlpha(activeSubject.name || '');
    return (pyqQuestionsData || []).filter(q => {
      const qCode = cleanAlpha(getCanonicalCode(q.subjectCode || ''));
      const qName = cleanAlpha(q.subjectName || '');
      if (codeClean && qCode && (codeClean === qCode || codeClean.includes(qCode) || qCode.includes(codeClean))) return true;
      if (nameClean && qName && (nameClean.includes(qName) || qName.includes(nameClean))) return true;
      return false;
    });
  }, [activeSubject]);

  // Filtered Chapter/Unit Questions based on Selected Unit & Question Search
  const filteredChapterQuestions = useMemo(() => {
    let list = allSubjectQuestions;
    if (selectedUnitFilter !== 'all') {
      if (selectedUnitFilter === 'unclassified') {
        list = list.filter(q => q.unitNo === 0 || q.isUnclassified);
      } else {
        const uInt = parseInt(selectedUnitFilter, 10);
        list = list.filter(q => q.unitNo === uInt);
      }
    }
    if (questionSearch.trim()) {
      const q = questionSearch.toLowerCase().trim();
      list = list.filter(item => 
        (item.questionText || '').toLowerCase().includes(q) ||
        (item.questionNo || '').toLowerCase().includes(q) ||
        (item.unitTitle || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allSubjectQuestions, selectedUnitFilter, questionSearch]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setActiveBranch('CSE');
    setActiveYear('1st Year');
    setActiveSemester(isBTech ? 'All Semesters' : (courseMeta.semesters ? courseMeta.semesters[0] : 'Semester 1'));
    setSelectedAcademicYear('All');
    setSelectedExamType('All');
    setSubjectSearch('');
    setPyqSearchQuery('');
    updateUrl({ branch: 'CSE', year: '1st Year', semester: null, academicYear: null, examType: null, subject: null });
  };

  const isFilterActive = isBTech 
    ? (activeBranch !== 'CSE' || activeYear !== '1st Year' || (activeSemester !== 'All Semesters' && activeSemester !== 'All') || selectedAcademicYear !== 'All' || selectedExamType !== 'All' || pyqSearchQuery !== '')
    : (activeSemester !== (courseMeta.semesters ? courseMeta.semesters[0] : 'Semester 1') || selectedAcademicYear !== 'All' || selectedExamType !== 'All' || pyqSearchQuery !== '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. TOP CURRICULUM HEADER CARD */}
      <div style={{
        backgroundColor: '#ffffff',
        border: `1.5px solid ${courseMeta.borderColor}`,
        borderRadius: '24px',
        padding: '1.75rem',
        boxShadow: '0 6px 24px rgba(35,30,25,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: courseMeta.badgeColor + '15',
            color: courseMeta.badgeColor,
            border: `1.5px solid ${courseMeta.badgeColor}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 900
          }}>
            {courseMeta.name}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.65rem',
                fontWeight: 900,
                color: '#1F2421',
                margin: 0
              }}>
                {courseMeta.fullName} Previous Year Papers
              </h2>
              <span style={{
                backgroundColor: courseMeta.badgeColor + '15',
                color: courseMeta.badgeColor,
                border: `1px solid ${courseMeta.badgeColor}35`,
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 800
              }}>
                AKTU Solved &amp; Unsolved
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.88rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>
              {isBTech 
                ? 'Semester-wise examination question papers for AKTU B.Tech engineering branches.'
                : `Semester-wise examination question papers for AKTU ${courseMeta.name} curriculum.`}
            </p>
          </div>
        </div>

        {/* Course Slogan Badge */}
        <div style={{
          backgroundColor: '#FAF7F2',
          border: '1px solid #E8E2D5',
          borderRadius: '14px',
          padding: '0.6rem 1.15rem',
          fontFamily: "'Kalam', cursive",
          fontSize: '0.98rem',
          fontWeight: 700,
          color: '#B37D28',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <span>✨</span>
          <span>{courseMeta.tagline}</span>
        </div>
      </div>

      {/* CLEAN EMPTY STATE WHEN NO VALID PYQ DOCUMENTS EXIST */}
      {!hasCoursePyqs ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #E8E2D5',
          borderRadius: '24px',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 6px 24px rgba(35,30,25,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          margin: '0.5rem 0 2rem 0'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            border: '2px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#92400E'
          }}>
            <FileText size={34} />
          </div>

          <div>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#1F2421',
              margin: '0 0 0.5rem 0'
            }}>
              PYQs will be available soon
            </h3>
            <p style={{
              color: '#64748B',
              fontSize: '1.02rem',
              maxWidth: '520px',
              lineHeight: 1.55,
              margin: '0 auto',
              fontWeight: 500
            }}>
              Subject listings will appear after verified question papers are uploaded.
            </p>
          </div>

          <div style={{
            backgroundColor: '#FAF7F2',
            border: '1px solid #E8E2D5',
            borderRadius: '9999px',
            padding: '0.45rem 1.25rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#B37D28',
            fontFamily: "'Kalam', cursive",
            marginTop: '0.5rem'
          }}>
            “Verified AKTU question papers uploaded directly by faculty &amp; rankers”
          </div>
        </div>
      ) : (
        <>
          {/* 2. NAVIGATION FILTERS BAR */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #E8E2D5',
            borderRadius: '20px',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(35,30,25,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            
            {/* B.Tech: SELECT BRANCH (DERIVED FROM UPLOADED PAPERS ONLY) */}
            {isBTech && dynamicBranches.length > 0 && (
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Select Branch
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {dynamicBranches.map(br => {
                    const isSel = activeBranch === br.id;
                    return (
                      <button
                        key={br.id}
                        onClick={() => {
                          setActiveBranch(br.id);
                          updateUrl({ branch: br.id, subject: null });
                        }}
                        title={br.fullName}
                        style={{
                          padding: '0.42rem 1.15rem',
                          borderRadius: '9999px',
                          border: isSel ? `2px solid ${courseMeta.btnColor}` : '1.5px solid #E2E8F0',
                          backgroundColor: isSel ? courseMeta.btnColor : '#FAF7F2',
                          color: isSel ? '#ffffff' : '#334155',
                          fontWeight: isSel ? 800 : 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: isSel ? `0 4px 12px ${courseMeta.badgeColor}35` : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {br.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SELECT YEAR (DERIVED FROM UPLOADED PAPERS ONLY) */}
            {dynamicYears.length > 0 && (
              <div style={{ borderTop: isBTech && dynamicBranches.length > 0 ? '1px solid #F1F5F9' : 'none', paddingTop: isBTech && dynamicBranches.length > 0 ? '1rem' : '0' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Select Year
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {dynamicYears.map(yr => {
                    const isSel = activeYear === yr;
                    return (
                      <button
                        key={yr}
                        onClick={() => {
                          setActiveYear(yr);
                          setActiveSemester('All Semesters');
                          updateUrl({ year: yr, semester: null, subject: null });
                        }}
                        style={{
                          padding: '0.42rem 1.15rem',
                          borderRadius: '9999px',
                          border: isSel ? `2px solid ${courseMeta.btnColor}` : '1.5px solid #E2E8F0',
                          backgroundColor: isSel ? courseMeta.btnColor : '#FAF7F2',
                          color: isSel ? '#ffffff' : '#334155',
                          fontWeight: isSel ? 800 : 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: isSel ? `0 4px 12px ${courseMeta.badgeColor}35` : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

        {/* SELECT SEMESTER (Dynamic based on selected year for B.Tech, or static for other courses) */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Select Semester
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {availableSemesters.map(sem => {
              const isSel = activeSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => {
                    setActiveSemester(sem);
                    updateUrl({ semester: sem === 'All Semesters' ? null : sem, subject: null });
                  }}
                  style={{
                    padding: '0.42rem 1.15rem',
                    borderRadius: '9999px',
                    border: isSel ? `2px solid ${courseMeta.btnColor}` : '1.5px solid #E2E8F0',
                    backgroundColor: isSel ? courseMeta.btnColor : '#FAF7F2',
                    color: isSel ? '#ffffff' : '#334155',
                    fontWeight: isSel ? 800 : 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: isSel ? `0 4px 12px ${courseMeta.badgeColor}35` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {sem}
                </button>
              );
            })}
          </div>
        </div>

        {/* Specialization Selection for MBA */}
        {courseMeta.specializations && !isBTech && (
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Specialization Track
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              {courseMeta.specializations.map(spec => {
                const isSel = activeSpecialization === spec;
                return (
                  <button
                    key={spec}
                    onClick={() => {
                      setActiveSpecialization(spec);
                      updateUrl({ specialization: spec, subject: null });
                    }}
                    style={{
                      padding: '0.35rem 0.95rem',
                      borderRadius: '9999px',
                      border: isSel ? `1.5px solid ${courseMeta.badgeColor}` : '1px solid #E2E8F0',
                      backgroundColor: isSel ? courseMeta.badgeColor + '15' : '#ffffff',
                      color: isSel ? courseMeta.badgeColor : '#475569',
                      fontWeight: isSel ? 800 : 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Exam Type Selection Pills */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Exam Type
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {EXAM_TYPES.map(type => {
              const isSel = selectedExamType === type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedExamType(type);
                    updateUrl({ examType: type === 'All' ? null : type });
                  }}
                  style={{
                    padding: '0.32rem 0.85rem',
                    borderRadius: '9999px',
                    border: isSel ? `1.5px solid ${courseMeta.btnColor}` : '1px solid #E2E8F0',
                    backgroundColor: isSel ? courseMeta.btnColor : '#FAF7F2',
                    color: isSel ? '#ffffff' : '#334155',
                    fontWeight: isSel ? 800 : 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Academic Year Selection Pills */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Exam Academic Year
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {ACADEMIC_YEARS.map(yr => {
              const isSel = selectedAcademicYear === yr;
              return (
                <button
                  key={yr}
                  onClick={() => {
                    setSelectedAcademicYear(yr);
                    updateUrl({ academicYear: yr === 'All' ? null : yr });
                  }}
                  style={{
                    padding: '0.32rem 0.85rem',
                    borderRadius: '9999px',
                    border: isSel ? `1.5px solid ${courseMeta.btnColor}` : '1px solid #E2E8F0',
                    backgroundColor: isSel ? courseMeta.btnColor : '#FAF7F2',
                    color: isSel ? '#ffffff' : '#334155',
                    fontWeight: isSel ? 800 : 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Reset Toolbar */}
        <div style={{
          borderTop: '1px solid #F1F5F9',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {/* Quick Paper Search Bar */}
          <div style={{
            position: 'relative',
            flex: '1 1 300px',
            maxWidth: '520px'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search PYQs by subject name, code, paper title, or exam type..."
              value={pyqSearchQuery}
              onChange={(e) => setPyqSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 2rem 0.45rem 2.2rem',
                borderRadius: '9999px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FAF7F2',
                fontSize: '0.84rem',
                color: '#1F2421',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = courseMeta.btnColor}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
            {pyqSearchQuery && (
              <button
                onClick={() => setPyqSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Reset Filters Button */}
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.42rem 0.95rem',
                borderRadius: '9999px',
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                color: '#EF4444',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* 3. MAIN SUBJECTS & PAPERS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }} className="course-pyqs-split">

        {/* LEFT COLUMN: Subjects List */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #E8E2D5',
          borderRadius: '20px',
          padding: '1.25rem',
          boxShadow: '0 4px 16px rgba(35,30,25,0.03)'
        }}>
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#1F2421',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Subjects ({filteredSubjects.length})</span>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
              {isBTech ? `${activeBranch} • ${activeSemester}` : activeSemester}
            </span>
          </div>

          {/* In-Column Subject Search Input with Acronym Support */}
          <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search subject (e.g. DSA, COA)..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.38rem 1.8rem 0.38rem 1.9rem',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FAF7F2',
                fontSize: '0.8rem',
                color: '#1F2421',
                outline: 'none'
              }}
            />
            {subjectSearch && (
              <button
                onClick={() => setSubjectSearch('')}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Subjects List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '680px', overflowY: 'auto' }}>
            {filteredSubjects.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>
                No subjects matching "{subjectSearch}"
              </div>
            ) : (
              filteredSubjects.map(sub => {
                const isSel = activeSubject && (
                  (activeSubject.code && sub.code && activeSubject.code === sub.code) ||
                  normSubCanonical(activeSubject.name) === normSubCanonical(sub.name)
                );
                const count = subjectPaperCounts[sub.code || sub.name] || 0;

                return (
                  <div
                    key={sub.code || sub.name}
                    onClick={() => {
                      setActiveSubject(sub);
                      updateUrl({ subject: sub.code || sub.name });
                    }}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '14px',
                      border: isSel ? `1.5px solid ${courseMeta.btnColor}` : '1px solid #E2E8F0',
                      backgroundColor: isSel ? (courseMeta.btnColor + '0D') : '#FAF7F2',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: isSel ? courseMeta.btnColor : '#64748B',
                        fontFamily: 'monospace'
                      }}>
                        {sub.code || 'AKTU'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {count > 0 && (
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            backgroundColor: isSel ? courseMeta.btnColor : '#E2E8F0',
                            color: isSel ? '#ffffff' : '#475569',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '9999px'
                          }}>
                            {count} {count === 1 ? 'paper' : 'papers'}
                          </span>
                        )}
                        {isSel && <ChevronRight size={15} style={{ color: courseMeta.btnColor }} />}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: isSel ? 800 : 600,
                      color: isSel ? '#1F2421' : '#334155',
                      lineHeight: 1.3
                    }}>
                      {sub.name}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Subject Header + Papers Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Active Subject Banner */}
          {activeSubject && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 16px rgba(35,30,25,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: courseMeta.badgeColor,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase'
                }}>
                  {activeSubject.code} • {isBTech ? `${activeBranch} • ${activeSemester}` : activeSemester}
                </span>
                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#1F2421',
                  margin: '0.15rem 0 0.35rem 0'
                }}>
                  {activeSubject.name}
                </h3>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('subject', {
                      name: activeSubject.name,
                      code: activeSubject.code,
                      branch: activeBranch,
                      year: activeYear,
                      sem: activeSemester,
                      course: normKey
                    })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '999px',
                      backgroundColor: '#FDF6E8',
                      border: '1.5px solid #C88D2D',
                      color: '#1C1E21',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FAF0D7'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FDF6E8'; }}
                  >
                    <Sparkles size={13} style={{ color: '#C88D2D' }} />
                    <span>Open Subject Hub (Notes, PYQs & Syllabus)</span>
                    <ArrowRight size={13} style={{ color: '#C88D2D' }} />
                  </button>
                )}
              </div>
              <div style={{
                backgroundColor: courseMeta.badgeColor + '12',
                color: courseMeta.badgeColor,
                border: `1px solid ${courseMeta.badgeColor}30`,
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800
              }}>
                {matchedPyqs.length} {matchedPyqs.length === 1 ? 'Paper Available' : 'Papers Available'}
              </div>
            </div>
          )}

          {/* VIEW MODE TOGGLE TABS (QUESTION PAPERS vs CHAPTER-WISE QUESTIONS) */}
          {activeSubject && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FAF7F2',
              padding: '0.35rem',
              borderRadius: '14px',
              border: '1.5px solid #E8E2D5',
              width: 'fit-content'
            }}>
              <button
                onClick={() => setPyqViewMode('papers')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: pyqViewMode === 'papers' ? '#ffffff' : 'transparent',
                  color: pyqViewMode === 'papers' ? '#1F2421' : '#64748B',
                  fontWeight: pyqViewMode === 'papers' ? 800 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: pyqViewMode === 'papers' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <FileText size={15} style={{ color: pyqViewMode === 'papers' ? courseMeta.btnColor : '#94A3B8' }} />
                <span>Question Papers</span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: pyqViewMode === 'papers' ? courseMeta.btnColor : '#E2E8F0',
                  color: pyqViewMode === 'papers' ? '#ffffff' : '#64748B',
                  padding: '0.05rem 0.4rem',
                  borderRadius: '999px'
                }}>
                  {matchedPyqs.length}
                </span>
              </button>

              <button
                onClick={() => setPyqViewMode('chapters')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: pyqViewMode === 'chapters' ? '#ffffff' : 'transparent',
                  color: pyqViewMode === 'chapters' ? '#1F2421' : '#64748B',
                  fontWeight: pyqViewMode === 'chapters' ? 800 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: pyqViewMode === 'chapters' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Layers size={15} style={{ color: pyqViewMode === 'chapters' ? courseMeta.btnColor : '#94A3B8' }} />
                <span>Chapter-wise Questions</span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: pyqViewMode === 'chapters' ? courseMeta.btnColor : '#E2E8F0',
                  color: pyqViewMode === 'chapters' ? '#ffffff' : '#64748B',
                  padding: '0.05rem 0.4rem',
                  borderRadius: '999px'
                }}>
                  {allSubjectQuestions.length}
                </span>
              </button>
            </div>
          )}

          {/* VIEW 1: FULL QUESTION PAPERS CONTENT */}
          {pyqViewMode === 'papers' && (
            <>
              {matchedPyqs.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem'
                }}>
              {matchedPyqs.map((pyq, idx) => {
                const paperUrl = pyq.pdfUrl || pyq.fileUrl || pyq.driveUrl || pyq.resourceUrl || pyq.url || pyq.verifiedUrl;
                return (
                  <div
                    key={pyq.id || pyq._id || idx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 14px rgba(35,30,25,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.85rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: courseMeta.badgeColor,
                          backgroundColor: courseMeta.badgeColor + '12',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          {pyq.academicYear || pyq.examYear || 'AKTU Paper'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                          {pyq.examType || 'End Semester'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1F2421', lineHeight: 1.3 }}>
                        {pyq.title || `${pyq.subjectName || activeSubject?.name} (${pyq.academicYear || pyq.examYear || 'PYQ'})`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {paperUrl ? (
                        <>
                          <button
                            onClick={() => {
                              if (onOpenPdf) {
                                onOpenPdf(pyq);
                              } else {
                                window.open(paperUrl, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#1F2421',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={14} /> View Paper
                          </button>

                          <a
                            href={paperUrl}
                            target="_blank"
                            rel="noreferrer"
                            download
                            title="Download Paper"
                            style={{
                              padding: '0.5rem 0.65rem',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FAF7F2',
                              color: '#334155',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Download size={14} />
                          </a>
                        </>
                      ) : (
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>
                          Link being processed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* NO PYQS YET EMPTY STATE (WARM & ACADEMIC) */
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px dashed #DDCFBC',
              borderRadius: '24px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(35,30,25,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {/* ProfessorVirus Mascot Avatar */}
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid #C88D2D',
                backgroundColor: '#FFF8EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(200, 141, 45, 0.2)'
              }}>
                <img
                  src="/assets/navbar_logo.png"
                  alt="ProfessorVirus"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_virus.png';
                  }}
                />
              </div>

              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  color: '#92400E',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  marginBottom: '0.5rem'
                }}>
                  <Clock size={13} /> {normKey === 'BCA' ? 'No verified BCA resources available yet' : 'No PYQs available yet'}
                </div>

                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: '#1F2421',
                  margin: '0 0 0.35rem 0'
                }}>
                  {activeSubject ? activeSubject.name : 'Subject'} Question Papers
                </h3>

                <p style={{
                  color: '#64748B',
                  fontSize: '0.92rem',
                  maxWidth: '460px',
                  lineHeight: 1.5,
                  margin: '0 auto'
                }}>
                  {normKey === 'BCA'
                    ? 'No verified BCA resources available for this semester yet.'
                    : `AKTU Previous Year Question Papers for ${courseMeta.name} (${activeSubject?.code}) are currently being gathered, watermarked, and uploaded by our community contributors.`}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    if (onRequestPyq) {
                      onRequestPyq(activeSubject, activeYear);
                    } else {
                      alert(`Thank you! A request for ${courseMeta.name} ${activeSubject?.name} PYQs has been submitted.`);
                    }
                  }}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '9999px',
                    backgroundColor: '#1F2421',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(31,36,33,0.2)'
                  }}
                >
                  Request PYQs For This Subject
                </button>

                <div style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: '0.94rem',
                  color: '#C88D2D',
                  fontWeight: 700
                }}>
                  “Concept clear, marks secure!”
                </div>
              </div>
            </div>
          )}
          </>
          )}

          {/* VIEW 2: CHAPTER-WISE & UNIT QUESTIONS */}
          {pyqViewMode === 'chapters' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {allSubjectQuestions.length === 0 ? (
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px dashed #DDCFBC',
                  borderRadius: '24px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(35,30,25,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#FFF8EB',
                    border: '2px solid #C88D2D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C88D2D'
                  }}>
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.35rem 0' }}>
                      Full Examination Papers Available
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#64748B', maxWidth: '480px', lineHeight: 1.5, margin: '0 auto' }}>
                      All complete previous-year examination PDFs for <b>{activeSubject?.name}</b> are ready to view and download under the <b>Question Papers</b> tab above. Automated question-level chapter mapping for this subject is currently scheduled.
                    </p>
                  </div>
                  <button
                    onClick={() => setPyqViewMode('papers')}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '999px',
                      backgroundColor: '#1F2421',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View Examination Papers ({matchedPyqs.length})
                  </button>
                </div>
              ) : (
                <>
                  {/* Unit Selector Pills Bar */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #E8E2D5',
                    borderRadius: '18px',
                    padding: '1rem',
                    boxShadow: '0 4px 14px rgba(35,30,25,0.03)'
                  }}>
                    <div style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.65rem'
                    }}>
                      Filter Questions by Syllabus Unit
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      {/* All Units Option */}
                      <button
                        onClick={() => setSelectedUnitFilter('all')}
                        style={{
                          padding: '0.38rem 0.95rem',
                          borderRadius: '999px',
                          border: selectedUnitFilter === 'all' ? `2px solid ${courseMeta.btnColor}` : '1.5px solid #E2E8F0',
                          backgroundColor: selectedUnitFilter === 'all' ? courseMeta.btnColor : '#FAF7F2',
                          color: selectedUnitFilter === 'all' ? '#ffffff' : '#334155',
                          fontSize: '0.8rem',
                          fontWeight: selectedUnitFilter === 'all' ? 800 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        All Units ({allSubjectQuestions.length})
                      </button>

                      {/* Units 1 through 5 from Verified Syllabus */}
                      {(currentSubjectSyllabus?.units || [
                        { unitNo: 1, title: 'Unit 1' },
                        { unitNo: 2, title: 'Unit 2' },
                        { unitNo: 3, title: 'Unit 3' },
                        { unitNo: 4, title: 'Unit 4' },
                        { unitNo: 5, title: 'Unit 5' }
                      ]).map(u => {
                        const count = allSubjectQuestions.filter(q => q.unitNo === u.unitNo).length;
                        const isSel = selectedUnitFilter === u.unitNo;
                        return (
                          <button
                            key={u.unitNo}
                            onClick={() => setSelectedUnitFilter(u.unitNo)}
                            title={u.title}
                            style={{
                              padding: '0.38rem 0.95rem',
                              borderRadius: '999px',
                              border: isSel ? `2px solid ${courseMeta.btnColor}` : '1.5px solid #E2E8F0',
                              backgroundColor: isSel ? courseMeta.btnColor : '#FAF7F2',
                              color: isSel ? '#ffffff' : '#334155',
                              fontSize: '0.8rem',
                              fontWeight: isSel ? 800 : 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>Unit {u.unitNo}: {u.title.length > 25 ? u.title.slice(0, 25) + '...' : u.title}</span>
                            <span style={{
                              fontSize: '0.68rem',
                              backgroundColor: isSel ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                              color: isSel ? '#ffffff' : '#64748B',
                              padding: '0.05rem 0.35rem',
                              borderRadius: '999px'
                            }}>
                              {count}
                            </span>
                          </button>
                        );
                      })}

                      {/* Unclassified Filter (if any) */}
                      {allSubjectQuestions.some(q => q.unitNo === 0 || q.isUnclassified) && (
                        <button
                          onClick={() => setSelectedUnitFilter('unclassified')}
                          style={{
                            padding: '0.38rem 0.95rem',
                            borderRadius: '999px',
                            border: selectedUnitFilter === 'unclassified' ? '2px solid #F59E0B' : '1.5px solid #FDE68A',
                            backgroundColor: selectedUnitFilter === 'unclassified' ? '#F59E0B' : '#FEF3C7',
                            color: selectedUnitFilter === 'unclassified' ? '#ffffff' : '#92400E',
                            fontSize: '0.8rem',
                            fontWeight: selectedUnitFilter === 'unclassified' ? 800 : 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>Unclassified</span>
                          <span style={{
                            fontSize: '0.68rem',
                            backgroundColor: selectedUnitFilter === 'unclassified' ? 'rgba(255,255,255,0.25)' : '#FDE68A',
                            color: selectedUnitFilter === 'unclassified' ? '#ffffff' : '#92400E',
                            padding: '0.05rem 0.35rem',
                            borderRadius: '999px'
                          }}>
                            {allSubjectQuestions.filter(q => q.unitNo === 0 || q.isUnclassified).length}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Question Search Input */}
                    <div style={{ position: 'relative', marginTop: '0.85rem' }}>
                      <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                      <input
                        type="text"
                        placeholder={`Search questions in ${activeSubject?.name}...`}
                        value={questionSearch}
                        onChange={(e) => setQuestionSearch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem 2rem 0.45rem 2.1rem',
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FAF7F2',
                          fontSize: '0.84rem',
                          color: '#1F2421',
                          outline: 'none'
                        }}
                      />
                      {questionSearch && (
                        <button
                          onClick={() => setQuestionSearch('')}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Questions Grid List */}
                  {filteredChapterQuestions.length === 0 ? (
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1.5px dashed #E2E8F0',
                      borderRadius: '18px',
                      padding: '2.5rem',
                      textAlign: 'center',
                      color: '#64748B',
                      fontSize: '0.85rem'
                    }}>
                      No questions found matching your filter.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {filteredChapterQuestions.map((qItem) => (
                        <div
                          key={qItem.id}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1.5px solid #E8E2D5',
                            borderRadius: '16px',
                            padding: '1.15rem 1.35rem',
                            boxShadow: '0 2px 10px rgba(35,30,25,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.65rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {/* Top Badges Row */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.45rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                color: '#1F2421',
                                backgroundColor: '#F1F5F9',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '6px',
                                fontFamily: 'monospace'
                              }}>
                                {qItem.questionNo}
                              </span>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: '#0369A1',
                                backgroundColor: '#E0F2FE',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '6px'
                              }}>
                                {qItem.marks} Marks
                              </span>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                color: '#475569',
                                backgroundColor: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '6px'
                              }}>
                                AKTU {qItem.examYear} ({qItem.examType})
                              </span>
                            </div>

                            {/* Syllabus Unit Pill */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: qItem.unitNo > 0 ? '#15803D' : '#B45309',
                                backgroundColor: qItem.unitNo > 0 ? '#DCFCE7' : '#FEF3C7',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                {qItem.unitNo > 0 && <CheckCircle size={11} />}
                                {qItem.unitNo > 0 ? `Unit ${qItem.unitNo}: ${qItem.unitTitle}` : 'Unclassified'}
                              </span>
                            </div>
                          </div>

                          {/* Question Text */}
                          <div style={{
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: '#1E293B',
                            lineHeight: 1.5,
                            padding: '0.2rem 0'
                          }}>
                            {qItem.questionText}
                          </div>

                          {/* Action Footer */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.6rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                              Source: {qItem.paperTitle}
                            </span>
                            {qItem.sourceUrl && (
                              <button
                                onClick={() => window.open(qItem.sourceUrl, '_blank', 'noopener,noreferrer')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: '6px',
                                  border: '1px solid #E2E8F0',
                                  backgroundColor: '#FAF7F2',
                                  color: '#334155',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                <Eye size={12} />
                                <span>View in Paper</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

      </div>
        </div>

        </>
      )}

    </div>
  );
}
