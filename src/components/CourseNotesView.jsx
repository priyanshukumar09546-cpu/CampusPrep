import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  FileText, 
  Download, 
  Eye, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Search
} from 'lucide-react';
import { COURSES, getSubjectsForCourse, getCourseMeta, normalizeCourseKey } from '../data/coursesCatalog';
import { BCA_NOTES_CATALOG } from '../data/bcaNotesData';

export default function CourseNotesView({ 
  courseKey = 'B.Tech', 
  dbNotes = [], 
  onOpenViewer, 
  onRequestNotes,
  onOpenAuth,
  onNavigate
}) {
  const normKey = normalizeCourseKey(courseKey);
  const isBTech = normKey === 'B.Tech';
  const courseMeta = getCourseMeta(normKey) || COURSES[0];

  // Read URL query params on initial load
  const getInitialParam = (key, fallback) => {
    try {
      const p = new URLSearchParams(window.location.search);
      const val = p.get(key);
      if (val !== null && val !== undefined && val !== '') return val;
    } catch (e) {}
    return fallback;
  };

  // Helper to normalize year string for B.Tech
  const normalizeYearStr = (raw) => {
    if (!raw) return '1st Year';
    const s = String(raw).toLowerCase().trim();
    if (s === '1' || s.includes('1')) return '1st Year';
    if (s === '2' || s.includes('2')) return '2nd Year';
    if (s === '3' || s.includes('3')) return '3rd Year';
    if (s === '4' || s.includes('4')) return '4th Year';
    return '1st Year';
  };

  const normYearNum = (raw) => {
    const s = String(raw || '').toLowerCase();
    if (s.includes('1')) return '1';
    if (s.includes('2')) return '2';
    if (s.includes('3')) return '3';
    if (s.includes('4')) return '4';
    return '1';
  };

  // B.Tech Navigation States
  const [activeYear, setActiveYear] = useState(() => normalizeYearStr(getInitialParam('year', '1st Year')));
  const [activeBranch, setActiveBranch] = useState(() => getInitialParam('branch', 'CSE'));

  // Semester State
  const initialSem = getInitialParam('semester', isBTech ? 'All Semesters' : (courseMeta.semesters ? courseMeta.semesters[0] : 'Semester 1'));
  const [activeSemester, setActiveSemester] = useState(initialSem);

  // MBA Specialization
  const [activeSpecialization, setActiveSpecialization] = useState(() => 
    getInitialParam('specialization', courseMeta.specializations ? courseMeta.specializations[0] : null)
  );

  // B.Pharm Resource Category
  const [activeResourceType, setActiveResourceType] = useState(() => 
    getInitialParam('resourceType', courseMeta.resourceTypes ? courseMeta.resourceTypes[0] : 'Notes')
  );

  // Unit State: 'All' | 1 | 2 | 3 | 4 | 5
  const initialUnit = getInitialParam('unit', 'All');
  const [activeUnit, setActiveUnit] = useState(initialUnit === 'All' ? 'All' : (Number(initialUnit) || 'All'));

  // Subject State
  const [activeSubject, setActiveSubject] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState('');

  // Local live notes for B.Tech fetched per branch & year to guarantee complete data
  const [localBTechNotes, setLocalBTechNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const notesCacheRef = useRef(new Map());

  // Canonical subject and code normalization
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

  const normCodeCanonical = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  const isSubjectStrictMatch = useCallback((target, note) => {
    if (!target || !note) return false;
    const tName = normSubCanonical(target.name || target.subject);
    const nName = normSubCanonical(note.subject || note.subjectName);

    // 1. Exact normalized name match or singular/plural variation
    if (tName && nName && tName === nName) return true;
    if (tName && nName && tName.replace(/s$/, '') === nName.replace(/s$/, '')) return true;

    const tCode = normCodeCanonical(target.code);
    const nCode = normCodeCanonical(note.subjectCode);

    // 2. Exact code match (if not generic like 'KOE' or 'AKTU')
    if (tCode && nCode && tCode.length >= 4 && nCode.length >= 4 && !['KOE', 'AKTU', 'NOTES'].includes(tCode) && !['KOE', 'AKTU', 'NOTES'].includes(nCode)) {
      if (tCode === nCode) return true;
      // AKTU K/B prefix equivalence (e.g. KAS103 vs BAS103, KCS301 vs BCS301)
      const tEquiv = tCode.replace(/^[KB]/, '');
      const nEquiv = nCode.replace(/^[KB]/, '');
      if (tEquiv === nEquiv && tEquiv.length >= 4) return true;
    }

    // 3. Substring containment for full subject names
    if (tName && nName && (tName.includes(nName) || nName.includes(tName)) && (tName.length >= 6 && nName.length >= 6)) {
      return true;
    }

    return false;
  }, []);

  // URL Sync helper preserving full hierarchy
  const updateUrl = useCallback((newParams = {}) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('course', normKey);

      if (normKey === 'B.Tech') {
        const yearVal = newParams.year !== undefined ? newParams.year : activeYear;
        const branchVal = newParams.branch !== undefined ? newParams.branch : activeBranch;
        const semVal = newParams.semester !== undefined ? newParams.semester : activeSemester;
        const subVal = newParams.subject !== undefined ? newParams.subject : (activeSubject ? (activeSubject.name || activeSubject.code) : null);
        const unitVal = newParams.unit !== undefined ? newParams.unit : activeUnit;

        if (yearVal) searchParams.set('year', yearVal);
        else searchParams.delete('year');

        if (branchVal) searchParams.set('branch', branchVal);
        else searchParams.delete('branch');

        if (semVal && semVal !== 'All Semesters' && semVal !== 'All') searchParams.set('semester', semVal);
        else searchParams.delete('semester');

        if (subVal) searchParams.set('subject', subVal);
        else searchParams.delete('subject');

        if (unitVal && unitVal !== 'All') searchParams.set('unit', String(unitVal));
        else searchParams.delete('unit');
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
  }, [normKey, activeYear, activeBranch, activeSemester, activeSubject, activeUnit]);

  // Handle browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (isBTech) {
          const y = params.get('year');
          if (y) setActiveYear(normalizeYearStr(y));
          const b = params.get('branch');
          if (b) setActiveBranch(b);
          const s = params.get('semester');
          setActiveSemester(s || 'All Semesters');
        } else {
          const s = params.get('semester');
          if (s) setActiveSemester(s);
          const sp = params.get('specialization');
          if (sp) setActiveSpecialization(sp);
          const rt = params.get('resourceType');
          if (rt) setActiveResourceType(rt);
        }
        const u = params.get('unit');
        setActiveUnit(u === 'All' || !u ? 'All' : (Number(u) || 'All'));
      } catch (e) {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isBTech]);

  // Semesters available for current course
  const availableSemesters = useMemo(() => {
    if (isBTech) {
      if (courseMeta.semestersByYear && courseMeta.semestersByYear[activeYear]) {
        return ['All Semesters', ...courseMeta.semestersByYear[activeYear].filter(s => s !== 'All Semesters')];
      }
      if (activeYear === '1st Year') return ['All Semesters', 'Semester 1', 'Semester 2'];
      if (activeYear === '2nd Year') return ['All Semesters', 'Semester 3', 'Semester 4'];
      if (activeYear === '3rd Year') return ['All Semesters', 'Semester 5', 'Semester 6'];
      return ['All Semesters', 'Semester 7', 'Semester 8'];
    }
    if (normKey === 'BCA') {
      return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];
    }
    return courseMeta.semesters || ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'];
  }, [isBTech, normKey, courseMeta, activeYear]);

  // Compute Subjects for current course, semester, year, and branch
  const availableSubjects = useMemo(() => {
    if (isBTech) {
      return getSubjectsForCourse('B.Tech', activeSemester, null, activeYear, activeBranch);
    }
    return getSubjectsForCourse(normKey, activeSemester, activeSpecialization, activeYear);
  }, [isBTech, normKey, activeSemester, activeSpecialization, activeYear, activeBranch]);

  // Filter subjects by search input with acronym support
  const filteredSubjects = useMemo(() => {
    if (!subjectSearch.trim()) return availableSubjects;
    const q = subjectSearch.toLowerCase().trim();

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
      'physics': ['physics', 'kas-101', 'bas-101'],
      'chemistry': ['chemistry', 'kas-102', 'bas-102'],
      'evs': ['environment', 'ecology', 'bas-104'],
      'electronics': ['electronics', 'kec-101', 'bec-101', 'kec-201'],
      'mechanical': ['mechanical', 'kme-101', 'kme-201']
    };

    const targetKeywords = aliases[q] || [q];

    return availableSubjects.filter(s => {
      const name = (s.name || '').toLowerCase();
      const code = (s.code || '').toLowerCase();
      const directMatch = targetKeywords.some(kw => name.includes(kw) || code.includes(kw) || q.includes(code) || name.includes(q));
      if (directMatch) return true;

      if (normKey === 'BCA') {
        const hasMatchingNote = BCA_NOTES_CATALOG.some(n => 
          isSubjectStrictMatch(s, n) && (
            (n.title && n.title.toLowerCase().includes(q)) ||
            (n.fileName && n.fileName.toLowerCase().includes(q)) ||
            (n.subjectName && n.subjectName.toLowerCase().includes(q))
          )
        );
        if (hasMatchingNote) return true;
      }
      return false;
    });
  }, [availableSubjects, subjectSearch, normKey, isSubjectStrictMatch]);

  // Sync activeSubject when availableSubjects changes or on initial load
  useEffect(() => {
    if (availableSubjects.length > 0) {
      const urlSub = getInitialParam('subject', null);
      if (urlSub) {
        const found = availableSubjects.find(s => 
          s.code.toLowerCase() === urlSub.toLowerCase() || 
          s.name.toLowerCase() === urlSub.toLowerCase() ||
          s.name.toLowerCase().includes(urlSub.toLowerCase())
        );
        if (found) {
          setActiveSubject(found);
          return;
        }
      }

      if (!activeSubject || !availableSubjects.some(s => s.code === activeSubject.code)) {
        setActiveSubject(availableSubjects[0]);
      }
    } else {
      setActiveSubject(null);
    }
  }, [availableSubjects]);

  // Ensure full URL hierarchy is preserved once activeSubject is determined
  useEffect(() => {
    if (isBTech && activeSubject) {
      updateUrl({});
    }
  }, [isBTech, activeSubject]);

  // Fetch B.Tech notes when branch, year, semester, or activeSubject changes
  useEffect(() => {
    if (!isBTech) return;
    if (!activeSubject) {
      setLocalBTechNotes([]);
      return;
    }

    const yNum = normYearNum(activeYear);
    const subCode = activeSubject.code || '';
    const subName = activeSubject.name || '';
    const semParam = activeSemester && activeSemester !== 'All Semesters' ? activeSemester : '';
    const cacheKey = `${activeBranch}_${yNum}_${semParam}_${subCode || subName}`;

    if (notesCacheRef.current.has(cacheKey)) {
      setLocalBTechNotes(notesCacheRef.current.get(cacheKey));
      return;
    }

    let isSubscribed = true;
    setIsLoadingNotes(true);
    setLocalBTechNotes([]); // Immediately clear stale resources

    let apiUrl = `/api/notes?course=B.Tech&branch=${encodeURIComponent(activeBranch)}&year=${encodeURIComponent(activeYear)}&subject=${encodeURIComponent(subName)}&subjectCode=${encodeURIComponent(subCode)}`;
    if (semParam) {
      apiUrl += `&semester=${encodeURIComponent(semParam)}`;
    }

    fetch(apiUrl, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (!isSubscribed) return;
        if (data && Array.isArray(data.notes)) {
          notesCacheRef.current.set(cacheKey, data.notes);
          setLocalBTechNotes(data.notes);
        } else {
          setLocalBTechNotes([]);
        }
      })
      .catch(err => {
        if (!isSubscribed) return;
        console.error('Error fetching B.Tech notes:', err);
        setLocalBTechNotes([]);
      })
      .finally(() => {
        if (isSubscribed) setIsLoadingNotes(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [isBTech, activeBranch, activeYear, activeSemester, activeSubject]);

  // Clean educational provider name helper
  const getCleanProvider = (note) => {
    let raw = note.provider || note.source || 'Faculty Lecture Notes';
    if (String(raw).toLowerCase().includes('notesgallery')) {
      const t = String(note.title || '').toLowerCase();
      if (t.includes('quantum')) return 'Quantum Notes';
      if (t.includes('gateway')) return 'Gateway Classes';
      if (t.includes('handwritten')) return 'Handwritten Notes';
      if (t.includes('edushine')) return 'EduShine';
      if (t.includes('bitwise')) return 'Bitwise Learning';
      if (t.includes('multi atom')) return 'Multi Atoms';
      if (t.includes('engineering being')) return 'Engineering Being';
      if (t.includes('solved') || t.includes('paper')) return 'AKTU Solved Papers';
      return 'Faculty Lecture Notes';
    }
    return raw;
  };

  // Available units dynamic based on notes for active subject
  const availableUnitsForActiveSubject = useMemo(() => {
    if (!activeSubject) return ['All', 1, 2, 3, 4, 5];
    const sourceNotes = isBTech 
      ? (Array.isArray(localBTechNotes) ? localBTechNotes : [])
      : (normKey === 'BCA' 
          ? ((Array.isArray(dbNotes) && dbNotes.length > 0) ? dbNotes : BCA_NOTES_CATALOG)
          : (Array.isArray(dbNotes) ? dbNotes : []));

    const notesForSubject = sourceNotes.filter(n => isSubjectStrictMatch(activeSubject, n));
    if (notesForSubject.length === 0) return ['All', 1, 2, 3, 4, 5];

    const unitSet = new Set();
    let hasExtra = false;
    notesForSubject.forEach(n => {
      const uNum = Number(n.unit !== undefined ? n.unit : n.unitNumber);
      if (uNum >= 1 && uNum <= 5) {
        unitSet.add(uNum);
      } else if (n.resourceCategory === 'extra' || String(n.unit).toLowerCase() === 'extra') {
        hasExtra = true;
      }
    });

    const sortedUnits = Array.from(unitSet).sort((a, b) => a - b);
    const result = ['All', ...sortedUnits];
    if (hasExtra) result.push('Extra');
    return result;
  }, [activeSubject, isBTech, localBTechNotes, dbNotes, normKey, isSubjectStrictMatch]);

  // Filter notes for active subject and active unit with strict isolation
  const matchedNotes = useMemo(() => {
    const sourceNotes = isBTech 
      ? (Array.isArray(localBTechNotes) ? localBTechNotes : [])
      : (normKey === 'BCA' 
          ? ((Array.isArray(dbNotes) && dbNotes.length > 0) ? dbNotes : BCA_NOTES_CATALOG)
          : (Array.isArray(dbNotes) ? dbNotes : []));

    if (!Array.isArray(sourceNotes) || !activeSubject) return [];

    return sourceNotes.filter(n => {
      // 1. Strict Subject Isolation
      if (!isSubjectStrictMatch(activeSubject, n)) return false;

      // 2. Course-specific Year & Semester isolation
      if (isBTech) {
        const yNum = normYearNum(activeYear);
        const nYearNum = normYearNum(n.year);
        if (nYearNum && nYearNum !== yNum) return false;

        const bUpper = activeBranch.toUpperCase().trim();
        const nb = String(n.branch || n.branchId || '').toUpperCase().trim();
        const isCommon = nb === 'ALL' || nb === 'COMMON' || activeYear === '1st Year';
        if (!isCommon && nb && nb !== bUpper) {
          const matchAi = (bUpper.includes('AI') && nb.includes('AI'));
          const matchDs = (bUpper.includes('DS') && (nb.includes('DS') || nb.includes('DATA')));
          if (!matchAi && !matchDs) return false;
        }

        if (activeSemester && activeSemester !== 'All Semesters' && activeSemester !== 'All') {
          const semClean = String(activeSemester).replace(/[^0-9]/g, '');
          const nSemClean = String(n.semester || '').replace(/[^0-9]/g, '');
          if (nSemClean && semClean !== nSemClean) return false;
        }
      } else if (normKey === 'BCA') {
        // BCA Year isolation
        if (activeYear && activeYear !== 'All Years') {
          const yNum = normYearNum(activeYear);
          const nYearNum = normYearNum(n.year);
          if (nYearNum && nYearNum !== yNum) return false;
        }

        // BCA Semester isolation
        if (activeSemester && activeSemester !== 'All Semesters' && activeSemester !== 'All') {
          const semClean = String(activeSemester).replace(/[^0-9]/g, '');
          const nSemClean = String(n.semester || '').replace(/[^0-9]/g, '');
          if (nSemClean && semClean !== nSemClean) return false;
        }
      } else {
        if (n.semester && activeSemester) {
          const semClean = String(activeSemester).replace(/[^0-9]/g, '');
          const nSemClean = String(n.semester).replace(/[^0-9]/g, '');
          if (semClean && nSemClean && semClean !== nSemClean) return false;
        }
      }

      // 3. Search query filtering
      if (subjectSearch.trim()) {
        const q = subjectSearch.toLowerCase().trim();
        const matchesTitle = (n.title || '').toLowerCase().includes(q);
        const matchesSub = (n.subject || n.subjectName || '').toLowerCase().includes(q);
        const matchesCode = (n.subjectCode || '').toLowerCase().includes(q);
        const activeSubMatch = (activeSubject.name || '').toLowerCase().includes(q) || (activeSubject.code || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesSub && !matchesCode && !activeSubMatch) return false;
      }

      // 4. Unit Filter (Strict Canonical Partitioning & Extra Resources support)
      const nUnitNum = Number(n.unit !== undefined ? n.unit : n.unitNumber);
      const isExtra = n.resourceCategory === 'extra' || n.unit === null || n.unit === undefined || String(n.unit).toLowerCase() === 'extra' || nUnitNum === 0 || !([1, 2, 3, 4, 5].includes(nUnitNum));

      if (activeUnit === 'All') {
        return true;
      } else if (String(activeUnit).toLowerCase() === 'extra') {
        return isExtra;
      } else {
        return !isExtra && nUnitNum === Number(activeUnit);
      }
    });
  }, [isBTech, localBTechNotes, dbNotes, activeSubject, activeYear, activeBranch, activeSemester, activeUnit, normKey, subjectSearch, isSubjectStrictMatch]);

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
                {courseMeta.fullName} Notes &amp; Quantum
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
                AKTU Curriculum
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.88rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>
              {isBTech 
                ? 'AKTU verified unit notes, Quantum series, and handwritten materials for all engineering branches.'
                : courseMeta.description}
            </p>
          </div>
        </div>

        {/* Course Tagline Badge */}
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
        {/* SELECT YEAR (B.Tech & BCA) */}
        {(isBTech || (courseMeta.years && courseMeta.years.length > 0)) && (
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Select Year
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(courseMeta.years || ['1st Year', '2nd Year', '3rd Year', '4th Year']).map(yr => {
                const isSel = activeYear === yr;
                return (
                  <button
                    key={yr}
                    onClick={() => {
                      setActiveYear(yr);
                      let nextSem = 'All Semesters';
                      if (normKey === 'BCA') {
                        nextSem = yr === '1st Year' ? 'Semester 1' : yr === '2nd Year' ? 'Semester 3' : 'Semester 5';
                      }
                      setActiveSemester(nextSem);
                      setActiveUnit('All');
                      updateUrl({ year: yr, branch: isBTech ? activeBranch : null, semester: nextSem === 'All Semesters' ? null : nextSem, unit: 'All', subject: null });
                    }}
                    style={{
                      padding: '0.45rem 1.15rem',
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

        {/* B.Tech: SELECT BRANCH */}
        {isBTech && (
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Select Branch
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              {['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'AI & ML', 'DS'].map(br => {
                const isSel = activeBranch === br;
                return (
                  <button
                    key={br}
                    onClick={() => {
                      setActiveBranch(br);
                      setActiveUnit('All');
                      updateUrl({ branch: br, subject: null, unit: 'All' });
                    }}
                    style={{
                      padding: '0.38rem 1rem',
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
                    {br}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SEMESTER SELECTION (Common to B.Tech, BCA, MCA, MBA, B.Pharm) */}
        <div style={isBTech ? { borderTop: '1px solid #F1F5F9', paddingTop: '1rem' } : {}}>
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
                    let syncedYear = activeYear;
                    if (normKey === 'BCA') {
                      if (sem === 'Semester 1' || sem === 'Semester 2') syncedYear = '1st Year';
                      else if (sem === 'Semester 3' || sem === 'Semester 4') syncedYear = '2nd Year';
                      else if (sem === 'Semester 5' || sem === 'Semester 6') syncedYear = '3rd Year';
                      setActiveYear(syncedYear);
                    }
                    setActiveUnit('All');
                    updateUrl({ year: normKey === 'BCA' ? syncedYear : (isBTech ? activeYear : null), semester: sem === 'All Semesters' ? null : sem, unit: 'All', subject: null });
                  }}
                  style={{
                    padding: '0.45rem 1.15rem',
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

        {/* MBA: Specialization Track */}
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
                      setActiveUnit('All');
                      updateUrl({ specialization: spec, unit: null, subject: null });
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

        {/* B.Pharm: Resource Category */}
        {courseMeta.resourceTypes && !isBTech && (
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Resource Category
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              {courseMeta.resourceTypes.map(rt => {
                const isSel = activeResourceType === rt;
                return (
                  <button
                    key={rt}
                    onClick={() => {
                      setActiveResourceType(rt);
                      updateUrl({ resourceType: rt });
                    }}
                    style={{
                      padding: '0.38rem 1rem',
                      borderRadius: '9999px',
                      border: isSel ? `1.5px solid ${courseMeta.btnColor}` : '1px solid #E2E8F0',
                      backgroundColor: isSel ? courseMeta.btnColor : '#ffffff',
                      color: isSel ? '#ffffff' : '#475569',
                      fontWeight: isSel ? 800 : 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {rt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. MAIN SUBJECTS & UNITS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }} className="course-notes-split">

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
              {isBTech ? `${activeBranch} • ${activeYear}` : activeSemester}
            </span>
          </div>

          {/* Quick search inside subjects and notes list */}
          {(availableSubjects.length > 0) && (
            <div style={{ marginBottom: '0.85rem', position: 'relative' }}>
              <input
                type="text"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                placeholder={normKey === 'BCA' ? "Search BCA subjects, codes or notes..." : "Search subject or code..."}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  fontSize: '0.8rem',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FAF7F2',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map(sub => {
                const isSel = activeSubject && activeSubject.code === sub.code;
                return (
                  <div
                    key={sub.code}
                    onClick={() => {
                      setActiveSubject(sub);
                      setActiveUnit('All');
                      updateUrl({ subject: sub.name, unit: 'All' });
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
                        {sub.code}
                      </span>
                      {isSel && <ChevronRight size={15} style={{ color: courseMeta.btnColor }} />}
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
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>
                No subjects found.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Subject Header + Units Selector + Notes Display */}
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
              gap: '1rem'
            }}>
              <div>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: courseMeta.badgeColor,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase'
                }}>
                  {activeSubject.code} • {isBTech ? `${activeBranch} • ${activeYear}` : activeSemester}
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

              {/* UNIT PILLS: Dynamic based on active subject */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                {availableUnitsForActiveSubject.map(u => {
                  const isUnitSel = String(activeUnit).toLowerCase() === String(u).toLowerCase();
                  return (
                    <button
                      key={u}
                      onClick={() => {
                        setActiveUnit(u);
                        updateUrl({ unit: u });
                      }}
                      style={{
                        padding: (u === 'All' || u === 'Extra') ? '0.35rem 0.85rem' : '0',
                        width: (u === 'All' || u === 'Extra') ? 'auto' : '38px',
                        height: '38px',
                        borderRadius: (u === 'All' || u === 'Extra') ? '9999px' : '50%',
                        border: isUnitSel ? `2px solid ${courseMeta.btnColor}` : '1.5px solid #E2E8F0',
                        backgroundColor: isUnitSel ? courseMeta.btnColor : '#FAF7F2',
                        color: isUnitSel ? '#ffffff' : '#334155',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        boxShadow: isUnitSel ? `0 4px 12px ${courseMeta.badgeColor}35` : 'none',
                        transition: 'all 0.2s ease'
                      }}
                      title={u === 'All' ? 'All Units' : u === 'Extra' ? 'Extra Resources' : `Unit ${u}`}
                    >
                      {u === 'All' ? 'All Units' : u === 'Extra' ? 'Extra Resources' : `U${u}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoadingNotes && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.88rem', fontWeight: 600 }}>
              Loading study resources...
            </div>
          )}

          {/* NOTES CONTENT: If matched notes exist, display them; otherwise show clean Empty State */}
          {!isLoadingNotes && matchedNotes.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {matchedNotes.map((note, idx) => {
                const noteUrl = note.pdfUrl || note.driveUrl || note.fileUrl || note.resourceUrl || note.url || note.verifiedUrl || (note.sourceInfo && (note.sourceInfo.resolvedSourceUrl || note.sourceInfo.notesGalleryUrl));
                const unitLabel = (note.resourceCategory === 'extra' || note.unit === null || note.unit === 'extra' || note.unit === 'Extra' || !note.unit)
                  ? 'Extra Resource'
                  : (note.unit && note.unit >= 1 && note.unit <= 5) ? `Unit ${note.unit}` : 'Complete Subject';
                const providerName = getCleanProvider(note);

                return (
                  <div
                    key={note.id || idx}
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: courseMeta.badgeColor,
                          backgroundColor: courseMeta.badgeColor + '12',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          {unitLabel}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                          {providerName}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1F2421', lineHeight: 1.3 }}>
                        {note.title || `${activeSubject?.name} Notes`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {noteUrl && (
                        <button
                          onClick={() => {
                            if (onOpenViewer) {
                              onOpenViewer({
                                note: { ...note, url: noteUrl },
                                subject: activeSubject,
                                unit: note.unit || (activeUnit !== 'All' ? activeUnit : null)
                              });
                            } else {
                              window.open(noteUrl, '_blank');
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
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Eye size={14} /> View Note
                        </button>
                      )}

                      {noteUrl && (
                        <a
                          href={noteUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            border: '1.5px solid #E2E8F0',
                            backgroundColor: '#ffffff',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          title="Open Resource"
                        >
                          <Download size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isLoadingNotes && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(35,30,25,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}>
              <BookOpen size={36} style={{ color: courseMeta.badgeColor, opacity: 0.8 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                No Notes available for this subject/unit yet.
              </h4>
              <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: '380px', margin: 0 }}>
                {String(activeUnit).toLowerCase() === 'extra'
                  ? `There are no standalone extra resources (formula sheets, complete sets) uploaded for ${activeSubject?.name} yet. You can view individual unit notes above.`
                  : activeUnit !== 'All' 
                    ? `There are no specific Unit ${activeUnit} notes verified yet for ${activeSubject?.name}. You can switch to "All Units" to view complete subject notes.`
                    : normKey === 'BCA'
                      ? 'No verified BCA resources available for this semester yet.'
                      : `Our team is currently verifying and digitizing curriculum resources for ${activeSubject?.name}.`}
              </p>
              {onRequestNotes && (
                <button
                  onClick={() => onRequestNotes(activeSubject, activeUnit !== 'All' ? activeUnit : 1)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: courseMeta.btnColor,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: `0 4px 12px ${courseMeta.badgeColor}35`
                  }}
                >
                  <PlusCircle size={15} /> Request Notes for this Subject
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
