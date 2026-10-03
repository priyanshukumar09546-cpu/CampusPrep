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
  Filter
} from 'lucide-react';
import { COURSES, getSubjectsForCourse, getCourseMeta, normalizeCourseKey } from '../data/coursesCatalog';
import { pyqsData as localPyqsData } from '../data/pyqsData';
import { API_URL } from '../config/api';

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
  const isBTech = normKey === 'B.Tech';
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

  // Local state for fetched PYQs (resilient fallback if dbPyqs prop is empty/loading)
  const allFallbackPyqs = useMemo(() => {
    try {
      return Object.values(localPyqsData).flat();
    } catch (e) {
      return [];
    }
  }, []);

  const [localPyqs, setLocalPyqs] = useState(() => {
    if (Array.isArray(dbPyqs) && dbPyqs.length > 0) return dbPyqs;
    try {
      return Object.values(localPyqsData).flat();
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (Array.isArray(dbPyqs) && dbPyqs.length > 0) {
      setLocalPyqs(dbPyqs);
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
          setLocalPyqs(pyqList);
        }
      })
      .catch(err => console.log('Backend not available, keeping local fallback pyqs:', err));
  }, [normKey, dbPyqs, allFallbackPyqs]);

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

  // Normalization & Canonical Code Helpers
  const cleanAlpha = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const getCanonicalCode = (rawCode) => {
    if (!rawCode) return '';
    const clean = cleanAlpha(rawCode);
    const canonicalMap = {
      'bas103': 'KAS-103',
      'kas103': 'KAS-103',
      'bas102': 'KAS-102',
      'kas102': 'KAS-102',
      'bas101': 'KAS-101',
      'kas101': 'KAS-101',
      'bee101': 'KEE-101',
      'kee101': 'KEE-101',
      'bcs101': 'KCS-101',
      'kcs101': 'KCS-101',
      'bec101': 'KEC-101',
      'kec101': 'KEC-101',
      'bme101': 'KME-101',
      'kme101': 'KME-101',
      'bas104': 'BAS-104',
      'kas203': 'KAS-203',
      'bas203': 'KAS-203',
      'knc102': 'KNC-102',
      'bnc102': 'KNC-102',
      'kcs301': 'KCS-301',
      'bcs301': 'KCS-301',
      'kcs302': 'KCS-302',
      'bcs302': 'KCS-302',
      'kcs303': 'KCS-303',
      'bcs303': 'KCS-303',
      'kcs401': 'KCS-401',
      'bcs401': 'KCS-401',
      'kcs402': 'KCS-402',
      'bcs402': 'KCS-402',
      'kcs403': 'KCS-403',
      'bcs403': 'KCS-403'
    };
    return canonicalMap[clean] || rawCode;
  };

  const normSubCanonical = (str) => {
    return String(str || '')
      .toLowerCase()
      .replace(/&[a-z0-9#]+;/gi, '')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/[-_\s]iv\b/g, '4')
      .replace(/[-_\s]iii\b/g, '3')
      .replace(/[-_\s]ii\b/g, '2')
      .replace(/[-_\s]i\b/g, '1')
      .replace(/[^a-z0-9]/g, '');
  };

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

  // Dynamic Subjects from database (with canonical deduplication for all courses)
  const dynamicDbSubjects = useMemo(() => {
    if (!Array.isArray(localPyqs)) return [];
    const subMap = new Map();

    localPyqs.forEach(p => {
      // 1. Course Filter
      const pCourse = cleanAlpha(p.course || 'B.Tech');
      if (isBTech ? pCourse !== 'btech' : pCourse !== cleanAlpha(normKey)) return;

      if (isBTech) {
        const targetYearDigit = String(activeYear).replace(/[^0-9]/g, '');
        const isY1 = targetYearDigit === '1';
        const targetBranch = activeBranch.toUpperCase().trim();

        const pYear = String(p.year || p.btechYear || '').replace(/[^0-9]/g, '');
        if (pYear && pYear !== targetYearDigit) return;

        const pBranch = String(p.branch || p.branchId || '').toUpperCase().trim();
        if (isY1) {
          if (pBranch && pBranch !== 'ALL' && pBranch !== targetBranch) return;
        } else {
          if (pBranch && pBranch !== targetBranch) return;
        }
      } else {
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

  // Compute Available Subjects (Strict Deduplication against Catalog for all courses)
  const availableSubjects = useMemo(() => {
    let catalogSubs = [];
    if (isBTech) {
      catalogSubs = getSubjectsForCourse('B.Tech', activeSemester, null, activeYear, activeBranch);
    } else {
      catalogSubs = getSubjectsForCourse(normKey, activeSemester, activeSpecialization, activeYear);
    }
    const result = [...catalogSubs];

    // Track existing subjects by canonical code and normalized canonical name
    const seenCodes = new Set();
    const seenNames = new Set();

    catalogSubs.forEach(s => {
      const canonCode = getCanonicalCode(s.code);
      if (canonCode) seenCodes.add(cleanAlpha(canonCode));
      const normName = normSubCanonical(s.name);
      if (normName) seenNames.add(normName);
    });

    dynamicDbSubjects.forEach(s => {
      const canonCode = getCanonicalCode(s.code);
      const canonCodeClean = canonCode ? cleanAlpha(canonCode) : '';
      const normName = normSubCanonical(s.name);

      const alreadyExists = (canonCodeClean && seenCodes.has(canonCodeClean)) ||
                            (normName && seenNames.has(normName));

      if (!alreadyExists) {
        if (canonCodeClean) seenCodes.add(canonCodeClean);
        if (normName) seenNames.add(normName);
        result.push(s);
      }
    });

    return result.sort((a, b) => (a.code || a.name).localeCompare(b.code || b.name));
  }, [isBTech, normKey, activeSemester, activeSpecialization, activeYear, activeBranch, dynamicDbSubjects]);

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

  // Subject Paper Counts in DB (for display in subject list)
  const subjectPaperCounts = useMemo(() => {
    const counts = {};
    if (!Array.isArray(localPyqs)) return counts;

    const targetYearDigit = String(activeYear).replace(/[^0-9]/g, '');
    const isY1 = targetYearDigit === '1';
    const targetBranch = activeBranch.toUpperCase().trim();

    availableSubjects.forEach(sub => {
      const sCode = cleanAlpha(sub.code);
      const sCanonCode = cleanAlpha(getCanonicalCode(sub.code));
      const sName = cleanAlpha(sub.name);
      const sCanonName = normSubCanonical(sub.name);

      const count = localPyqs.filter(p => {
        if (isBTech) {
          const pYear = String(p.year || p.btechYear || '').replace(/[^0-9]/g, '');
          if (pYear && pYear !== targetYearDigit) return false;
          const pBranch = String(p.branch || p.branchId || '').toUpperCase().trim();
          if (isY1) {
            if (pBranch && pBranch !== 'ALL' && pBranch !== targetBranch) return false;
          } else {
            if (pBranch && pBranch !== targetBranch) return false;
          }
        }
        const pSub = cleanAlpha(p.subject || p.subjectName || '');
        const pCanonSub = normSubCanonical(p.subject || p.subjectName || '');
        const pCode = cleanAlpha(p.subjectCode || '');
        const pCanonCode = cleanAlpha(getCanonicalCode(p.subjectCode || ''));

        const codeMatches = (sCanonCode && pCanonCode && sCanonCode === pCanonCode) ||
                            (sCode && pCode && (sCode === pCode || sCode.replace(/^[kb]/, '') === pCode.replace(/^[kb]/, ''))) ||
                            (sCode && pSub && pSub.includes(sCode));
        const nameMatches = (sCanonName && pCanonSub && sCanonName === pCanonSub) ||
                            (sName && pSub && (
                              pSub === sName || 
                              pSub.replace(/s$/, '') === sName.replace(/s$/, '') || 
                              pSub.includes(sName) || 
                              sName.includes(pSub)
                            ));
        return codeMatches || nameMatches;
      }).length;

      counts[sub.code || sub.name] = count;
    });

    return counts;
  }, [localPyqs, availableSubjects, isBTech, activeYear, activeBranch]);

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
  const matchedPyqs = useMemo(() => {
    if (!Array.isArray(localPyqs) || !activeSubject) return [];
    const sName = cleanAlpha(activeSubject.name);
    const sCanonName = normSubCanonical(activeSubject.name);
    const sCode = cleanAlpha(activeSubject.code);
    const sCanonCode = cleanAlpha(getCanonicalCode(activeSubject.code));

    const targetYearDigit = String(activeYear).replace(/[^0-9]/g, '');
    const isY1 = targetYearDigit === '1';
    const targetBranch = activeBranch.toUpperCase().trim();

    return localPyqs.filter(p => {
      // 1. Course
      const pCourse = cleanAlpha(p.course || 'B.Tech');
      if (isBTech ? pCourse !== 'btech' : pCourse !== cleanAlpha(normKey)) return false;

      // 2. Branch & Year for B.Tech
      if (isBTech) {
        const pYear = String(p.year || p.btechYear || '').replace(/[^0-9]/g, '');
        if (pYear && pYear !== targetYearDigit) return false;

        const pBranch = String(p.branch || p.branchId || '').toUpperCase().trim();
        if (isY1) {
          if (pBranch && pBranch !== 'ALL' && pBranch !== targetBranch) return false;
        } else {
          if (pBranch && pBranch !== targetBranch) return false;
        }
      }

      // 3. Semester
      if (activeSemester && activeSemester !== 'All Semesters' && activeSemester !== 'All') {
        const semClean = String(activeSemester).replace(/[^0-9]/g, '');
        const pSemClean = String(p.semester || '').replace(/[^0-9]/g, '');
        if (pSemClean && semClean !== pSemClean) return false;
      }

      // 4. Academic Year
      if (selectedAcademicYear !== 'All') {
        const pNorm = normalizeAcademicYear(p.academicYear || p.examYear);
        const selNorm = normalizeAcademicYear(selectedAcademicYear);
        if (pNorm !== selNorm) return false;
      }

      // 5. Exam Type
      if (selectedExamType !== 'All') {
        const pType = String(p.examType || '').toLowerCase();
        const selType = String(selectedExamType).toLowerCase();
        if (!pType.includes(selType) && !selType.includes(pType)) return false;
      }

      // 6. Subject Match (supports Canonical Codes, Historical Codes & Normalized Names)
      const pSub = cleanAlpha(p.subject || p.subjectName || '');
      const pCanonSub = normSubCanonical(p.subject || p.subjectName || '');
      const pCode = cleanAlpha(p.subjectCode || '');
      const pCanonCode = cleanAlpha(getCanonicalCode(p.subjectCode || ''));

      const codeMatches = (sCanonCode && pCanonCode && sCanonCode === pCanonCode) ||
                          (sCode && pCode && (sCode === pCode || sCode.replace(/^[kb]/, '') === pCode.replace(/^[kb]/, ''))) ||
                          (sCode && pSub && pSub.includes(sCode));
      const nameMatches = (sCanonName && pCanonSub && sCanonName === pCanonSub) ||
                          (sName && pSub && (
                            pSub === sName || 
                            pSub.replace(/s$/, '') === sName.replace(/s$/, '') || 
                            pSub.includes(sName) || 
                            sName.includes(pSub)
                          ));

      if (!codeMatches && !nameMatches) return false;

      // 7. Search Query
      if (pyqSearchQuery.trim()) {
        const q = pyqSearchQuery.toLowerCase().trim();
        const pTitle = String(p.title || p.fileName || '').toLowerCase();
        const pSubName = String(p.subjectName || p.subject || '').toLowerCase();
        const pSubCode = String(p.subjectCode || '').toLowerCase();
        const pType = String(p.examType || '').toLowerCase();
        const pYr = String(p.academicYear || p.examYear || '').toLowerCase();
        const matches = pTitle.includes(q) || pSubName.includes(q) || pSubCode.includes(q) || pType.includes(q) || pYr.includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [localPyqs, normKey, isBTech, activeBranch, activeYear, activeSemester, selectedAcademicYear, selectedExamType, activeSubject, pyqSearchQuery]);

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
        
        {/* B.Tech: SELECT BRANCH */}
        {isBTech && (
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Select Branch
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              {BTECH_BRANCHES.map(br => {
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

        {/* SELECT YEAR (B.Tech & BCA) */}
        {(isBTech || (courseMeta.years && courseMeta.years.length > 0)) && (
          <div style={{ borderTop: isBTech ? '1px solid #F1F5F9' : 'none', paddingTop: isBTech ? '1rem' : '0' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Select Year
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(courseMeta.years || BTECH_YEARS).map(yr => {
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

          {/* PAPERS CONTENT: If matched papers exist, display them; otherwise show "No PYQs available yet" */}
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

        </div>

      </div>

    </div>
  );
}
