import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Download, 
  Eye, 
  FileText, 
  ChevronDown, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  GraduationCap, 
  Sparkles, 
  BookOpen,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { 
  AVAILABLE_COURSES, 
  COURSE_CONFIG, 
  normalizeCourseKey, 
  normalizeYearStr 
} from '../data/courseMapping.ts';
import { pyqsData as localPyqsData } from '../data/pyqsData';
import { API_URL } from '../config/api';
import { trackPYQOpened } from '../utils/progressTracker';
import NoteViewerModal from './NoteViewerModal';
import AcademicResourceBanner from './AcademicResourceBanner';
import { deduplicatePyqs } from '../utils/pyqUtils';
import ComingSoonBadge from './ComingSoonBadge';

// Standard fallback branches for engineering courses
const BTECH_BRANCH_OPTIONS = [
  { id: 'ALL', name: 'All Branches' },
  { id: 'CSE', name: 'CSE - Computer Science & Engineering' },
  { id: 'ECE', name: 'ECE - Electronics & Communication' },
  { id: 'ME', name: 'ME - Mechanical Engineering' },
  { id: 'CE', name: 'CE - Civil Engineering' },
  { id: 'IT', name: 'IT - Information Technology' },
  { id: 'AIML', name: 'AIML - Artificial Intelligence & ML' },
  { id: 'Data Science', name: 'Data Science' },
  { id: 'EEE', name: 'EEE - Electrical & Electronics' }
];

export default function PYQFilterPortal({ 
  initialCourse = 'BTech',
  onSelectCourse,
  onNavigate,
  onOpenAuth
}) {
  // Read initial query params from URL
  const getParam = (key, fallback = 'ALL') => {
    try {
      const p = new URLSearchParams(window.location.search);
      const val = p.get(key);
      if (val !== null && val !== undefined && val.trim() !== '') return val.trim();
    } catch (e) {}
    return fallback;
  };

  // 1. Primary Filter States
  const [selectedCourse, setSelectedCourse] = useState(() => {
    const raw = getParam('course', initialCourse || 'BTech');
    return normalizeCourseKey(raw) || 'BTech';
  });

  const [selectedBranch, setSelectedBranch] = useState(() => getParam('branch', 'ALL'));
  const [selectedYear, setSelectedYear] = useState(() => {
    const raw = getParam('year', 'ALL');
    return raw === 'ALL' ? 'ALL' : normalizeYearStr(raw);
  });
  const [selectedSemester, setSelectedSemester] = useState(() => getParam('semester', 'ALL'));
  const [selectedSubject, setSelectedSubject] = useState(() => getParam('subject', 'ALL'));
  const [selectedExamYear, setSelectedExamYear] = useState(() => getParam('examYear', 'ALL'));
  const [selectedExamType, setSelectedExamType] = useState(() => getParam('examType', 'ALL'));
  const [searchQuery, setSearchQuery] = useState(() => getParam('search', ''));

  // Viewer Modal State
  const [activePyqPaper, setActivePyqPaper] = useState(null);

  // Loading & Data States
  const [isLoading, setIsLoading] = useState(true);
  const [papers, setPapers] = useState([]);
  const [serverFilters, setServerFilters] = useState(null);

  // Sync initialCourse prop if changed externally
  useEffect(() => {
    if (initialCourse) {
      const norm = normalizeCourseKey(initialCourse);
      if (norm && norm !== selectedCourse) {
        setSelectedCourse(norm);
      }
    }
  }, [initialCourse]);

  // Update browser URL query string without reloading page
  const updateUrlParams = useCallback((params) => {
    try {
      const current = new URLSearchParams(window.location.search);
      Object.entries(params).forEach(([k, v]) => {
        if (!v || v === 'ALL' || v === 'All' || v === 'All Branches' || v === 'All Years' || v === 'All Semesters' || v === 'All Subjects' || v === 'All Exam Years' || v === 'All Exam Types') {
          current.delete(k);
        } else {
          current.set(k, v);
        }
      });
      // Always retain course in URL
      if (!current.get('course') && selectedCourse) {
        current.set('course', selectedCourse);
      }
      const newUrl = `${window.location.pathname}?${current.toString()}`;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {}
  }, [selectedCourse]);

  // Load all local fallback records for guaranteed offline / cold-start safety
  const allFallbackPyqs = useMemo(() => {
    try {
      return Object.values(localPyqsData).flat();
    } catch (e) {
      return [];
    }
  }, []);

  // Filter local papers matching current course
  const courseLocalPyqs = useMemo(() => {
    const targetNorm = (selectedCourse || 'BTech').toLowerCase().replace(/[^a-z0-9]/g, '');
    return allFallbackPyqs.filter(p => {
      const pNorm = (p.course || 'B.Tech').toLowerCase().replace(/[^a-z0-9]/g, '');
      return pNorm === targetNorm;
    });
  }, [allFallbackPyqs, selectedCourse]);

  // Fetch verified papers and dynamic filters from API with local fallback
  const fetchPapersAndFilters = useCallback(async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams();
    if (selectedCourse) queryParams.set('course', selectedCourse);
    if (selectedBranch && selectedBranch !== 'ALL') queryParams.set('branch', selectedBranch);
    if (selectedYear && selectedYear !== 'ALL') queryParams.set('year', selectedYear);
    if (selectedSemester && selectedSemester !== 'ALL') queryParams.set('semester', selectedSemester);
    if (selectedSubject && selectedSubject !== 'ALL') queryParams.set('subject', selectedSubject);
    if (selectedExamYear && selectedExamYear !== 'ALL') queryParams.set('examYear', selectedExamYear);
    if (selectedExamType && selectedExamType !== 'ALL') queryParams.set('examType', selectedExamType);
    if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
    queryParams.set('_t', String(Date.now()));

    try {
      // 1. Fetch filtered papers
      const papersPromise = fetch(`${API_URL}/api/pyqs?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
      }).then(r => r.ok ? r.json() : null).catch(() => null);

      // 2. Fetch server dynamic filter options
      const filtersPromise = fetch(`${API_URL}/api/pyqs/filters?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
      }).then(r => r.ok ? r.json() : null).catch(() => null);

      const [papersData, filtersData] = await Promise.all([papersPromise, filtersPromise]);

      if (papersData && Array.isArray(papersData.pyqs)) {
        setPapers(deduplicatePyqs(papersData.pyqs));
      } else {
        // Local fallback filtering
        let localFiltered = courseLocalPyqs;
        if (selectedBranch && selectedBranch !== 'ALL' && selectedCourse === 'BTech') {
          localFiltered = localFiltered.filter(p => {
            const pb = String(p.branchId || p.branch || '').toUpperCase().trim();
            return !pb || pb === 'ALL' || pb === selectedBranch.toUpperCase().trim();
          });
        }
        if (selectedYear && selectedYear !== 'ALL') {
          const reqDigit = selectedYear.replace(/[^0-9]/g, '');
          localFiltered = localFiltered.filter(p => {
            const pDigit = String(p.year || p.btechYear || '').replace(/[^0-9]/g, '');
            return reqDigit ? pDigit === reqDigit : true;
          });
        }
        if (selectedSemester && selectedSemester !== 'ALL') {
          const semDigit = selectedSemester.replace(/[^0-9]/g, '');
          localFiltered = localFiltered.filter(p => {
            const pSemDigit = String(p.semester || '').replace(/[^0-9]/g, '');
            return semDigit && pSemDigit ? semDigit === pSemDigit : true;
          });
        }
        if (selectedSubject && selectedSubject !== 'ALL') {
          const sTerm = selectedSubject.toLowerCase().trim();
          localFiltered = localFiltered.filter(p => {
            const code = String(p.subjectCode || '').toLowerCase().trim();
            const name = String(p.subjectName || p.subject || '').toLowerCase().trim();
            return code === sTerm || name === sTerm || (code + ' - ' + name).toLowerCase() === sTerm;
          });
        }
        if (selectedExamYear && selectedExamYear !== 'ALL') {
          localFiltered = localFiltered.filter(p => {
            const yr = String(p.academicYear || p.examYear || '').trim();
            return yr === selectedExamYear.trim();
          });
        }
        if (selectedExamType && selectedExamType !== 'ALL') {
          const exTerm = selectedExamType.toLowerCase().trim();
          localFiltered = localFiltered.filter(p => {
            const pType = String(p.examType || p.paperType || '').toLowerCase().trim();
            return pType === exTerm || pType.includes(exTerm);
          });
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          localFiltered = localFiltered.filter(p => {
            const title = String(p.title || '').toLowerCase();
            const sName = String(p.subjectName || p.subject || '').toLowerCase();
            const sCode = String(p.subjectCode || p.code || '').toLowerCase();
            const yr = String(p.academicYear || p.examYear || '').toLowerCase();
            return title.includes(q) || sName.includes(q) || sCode.includes(q) || yr.includes(q);
          });
        }
        setPapers(deduplicatePyqs(localFiltered));
      }

      if (filtersData && filtersData.filters) {
        setServerFilters(filtersData.filters);
      }
    } catch (e) {
      // In case of error, local fallback papers
      setPapers(deduplicatePyqs(courseLocalPyqs));
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedCourse, 
    selectedBranch, 
    selectedYear, 
    selectedSemester, 
    selectedSubject, 
    selectedExamYear, 
    selectedExamType, 
    searchQuery, 
    courseLocalPyqs
  ]);

  useEffect(() => {
    fetchPapersAndFilters();
  }, [fetchPapersAndFilters]);

  // =========================================================================
  // DYNAMIC FILTER OPTIONS CALCULATION (Calculated strictly from real records)
  // =========================================================================

  // 1. Available Courses
  const availableCourses = useMemo(() => {
    return AVAILABLE_COURSES.map(c => ({
      key: c.key,
      name: c.name,
      fullName: c.fullName
    }));
  }, []);

  // 2. Available Branches for Selected Course
  const availableBranches = useMemo(() => {
    if (selectedCourse === 'BTech') {
      if (serverFilters?.availableBranches?.length > 0) {
        return serverFilters.availableBranches;
      }
      return BTECH_BRANCH_OPTIONS;
    }
    return [{ id: 'ALL', name: 'General / Core' }];
  }, [selectedCourse, serverFilters]);

  // 3. Available Academic Years of Study
  const availableYears = useMemo(() => {
    if (serverFilters?.availableYears?.length > 0) {
      return [{ id: 'ALL', name: 'All Years' }, ...serverFilters.availableYears.map(y => ({ id: y, name: y }))];
    }
    // Curriculum structure lookup
    const config = COURSE_CONFIG[selectedCourse];
    if (config?.years?.length > 0) {
      return [{ id: 'ALL', name: 'All Years' }, ...config.years.map(y => ({ id: y, name: y }))];
    }
    return [
      { id: 'ALL', name: 'All Years' },
      { id: '1st Year', name: '1st Year' },
      { id: '2nd Year', name: '2nd Year' },
      { id: '3rd Year', name: '3rd Year' },
      { id: '4th Year', name: '4th Year' }
    ];
  }, [selectedCourse, serverFilters]);

  // 4. Available Semesters for Selected Year
  const availableSemesters = useMemo(() => {
    if (serverFilters?.availableSemesters?.length > 0) {
      return [{ id: 'ALL', name: 'All Semesters' }, ...serverFilters.availableSemesters.map(s => ({ id: s, name: s }))];
    }
    // Dynamic mapping from year
    if (selectedYear === '1st Year') {
      return [{ id: 'ALL', name: 'All Semesters' }, { id: 'Semester 1', name: 'Semester 1' }, { id: 'Semester 2', name: 'Semester 2' }];
    }
    if (selectedYear === '2nd Year') {
      return [{ id: 'ALL', name: 'All Semesters' }, { id: 'Semester 3', name: 'Semester 3' }, { id: 'Semester 4', name: 'Semester 4' }];
    }
    if (selectedYear === '3rd Year') {
      return [{ id: 'ALL', name: 'All Semesters' }, { id: 'Semester 5', name: 'Semester 5' }, { id: 'Semester 6', name: 'Semester 6' }];
    }
    if (selectedYear === '4th Year') {
      return [{ id: 'ALL', name: 'All Semesters' }, { id: 'Semester 7', name: 'Semester 7' }, { id: 'Semester 8', name: 'Semester 8' }];
    }
    return [
      { id: 'ALL', name: 'All Semesters' },
      { id: 'Semester 1', name: 'Semester 1' },
      { id: 'Semester 2', name: 'Semester 2' },
      { id: 'Semester 3', name: 'Semester 3' },
      { id: 'Semester 4', name: 'Semester 4' },
      { id: 'Semester 5', name: 'Semester 5' },
      { id: 'Semester 6', name: 'Semester 6' },
      { id: 'Semester 7', name: 'Semester 7' },
      { id: 'Semester 8', name: 'Semester 8' }
    ];
  }, [selectedYear, serverFilters]);

  // 5. Available Subjects (derived from matching verified papers)
  const availableSubjects = useMemo(() => {
    if (serverFilters?.availableSubjects?.length > 0) {
      return [
        { id: 'ALL', name: 'All Subjects' },
        ...serverFilters.availableSubjects.map(s => ({
          id: s.code ? `${s.code} - ${s.name}` : s.name,
          code: s.code,
          name: s.name,
          label: s.code ? `${s.code} - ${s.name} (${s.count} papers)` : `${s.name} (${s.count} papers)`
        }))
      ];
    }
    // Calculate from course local papers matching branch, year, semester
    let set = courseLocalPyqs;
    if (selectedBranch && selectedBranch !== 'ALL' && selectedCourse === 'BTech') {
      set = set.filter(p => {
        const pb = String(p.branchId || p.branch || '').toUpperCase().trim();
        return !pb || pb === 'ALL' || pb === selectedBranch.toUpperCase().trim();
      });
    }
    if (selectedYear && selectedYear !== 'ALL') {
      const reqDigit = selectedYear.replace(/[^0-9]/g, '');
      set = set.filter(p => {
        const pDigit = String(p.year || p.btechYear || '').replace(/[^0-9]/g, '');
        return reqDigit ? pDigit === reqDigit : true;
      });
    }
    if (selectedSemester && selectedSemester !== 'ALL') {
      const semDigit = selectedSemester.replace(/[^0-9]/g, '');
      set = set.filter(p => {
        const pSemDigit = String(p.semester || '').replace(/[^0-9]/g, '');
        return semDigit && pSemDigit ? semDigit === pSemDigit : true;
      });
    }

    const subMap = new Map();
    set.forEach(p => {
      const code = String(p.subjectCode || '').trim();
      const name = String(p.subjectName || p.subject || 'Subject').trim();
      const idKey = code ? `${code} - ${name}` : name;
      if (!subMap.has(idKey)) {
        subMap.set(idKey, { id: idKey, code, name, count: 0 });
      }
      subMap.get(idKey).count++;
    });

    const list = Array.from(subMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    return [
      { id: 'ALL', name: 'All Subjects', label: 'All Subjects' },
      ...list.map(s => ({
        ...s,
        label: s.code ? `${s.code} - ${s.name} (${s.count} papers)` : `${s.name} (${s.count} papers)`
      }))
    ];
  }, [serverFilters, courseLocalPyqs, selectedBranch, selectedYear, selectedSemester, selectedCourse]);

  // 6. Available Examination Years
  const availableExamYears = useMemo(() => {
    if (serverFilters?.availableExamYears?.length > 0) {
      return ['ALL', ...serverFilters.availableExamYears];
    }
    // Calculate from matching papers
    const yrs = new Set();
    papers.forEach(p => {
      const y = String(p.academicYear || p.examYear || '').trim();
      if (y) yrs.add(y);
    });
    return ['ALL', ...Array.from(yrs).sort().reverse()];
  }, [serverFilters, papers]);

  // 7. Available Examination Types
  const availableExamTypes = useMemo(() => {
    if (serverFilters?.availableExamTypes?.length > 0) {
      return ['ALL', ...serverFilters.availableExamTypes];
    }
    const types = new Set();
    papers.forEach(p => {
      const t = String(p.examType || p.paperType || '').trim();
      if (t) types.add(t);
    });
    return ['ALL', ...Array.from(types)];
  }, [serverFilters, papers]);

  // =========================================================================
  // DEPENDENCY HANDLERS (Upstream change resets downstream invalid options)
  // =========================================================================

  const handleCourseChange = (newCourse) => {
    const norm = normalizeCourseKey(newCourse) || newCourse;
    setSelectedCourse(norm);
    setSelectedBranch('ALL');
    setSelectedYear('ALL');
    setSelectedSemester('ALL');
    setSelectedSubject('ALL');
    setSelectedExamYear('ALL');
    setSelectedExamType('ALL');
    setSearchQuery('');
    if (onSelectCourse) onSelectCourse(norm);
    updateUrlParams({ course: norm, branch: null, year: null, semester: null, subject: null, examYear: null, examType: null, search: null });
  };

  const handleBranchChange = (newBranch) => {
    setSelectedBranch(newBranch);
    setSelectedSubject('ALL');
    setSelectedExamYear('ALL');
    setSelectedExamType('ALL');
    updateUrlParams({ branch: newBranch, subject: null, examYear: null, examType: null });
  };

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    setSelectedSemester('ALL');
    setSelectedSubject('ALL');
    setSelectedExamYear('ALL');
    setSelectedExamType('ALL');
    updateUrlParams({ year: newYear, semester: null, subject: null, examYear: null, examType: null });
  };

  const handleSemesterChange = (newSem) => {
    setSelectedSemester(newSem);
    setSelectedSubject('ALL');
    setSelectedExamYear('ALL');
    setSelectedExamType('ALL');
    updateUrlParams({ semester: newSem, subject: null, examYear: null, examType: null });
  };

  const handleSubjectChange = (newSub) => {
    setSelectedSubject(newSub);
    setSelectedExamYear('ALL');
    setSelectedExamType('ALL');
    updateUrlParams({ subject: newSub, examYear: null, examType: null });
  };

  const handleExamYearChange = (newYear) => {
    setSelectedExamYear(newYear);
    setSelectedExamType('ALL');
    updateUrlParams({ examYear: newYear, examType: null });
  };

  const handleExamTypeChange = (newType) => {
    setSelectedExamType(newType);
    updateUrlParams({ examType: newType });
  };

  const handleClearFilters = () => {
    setSelectedBranch('ALL');
    setSelectedYear('ALL');
    setSelectedSemester('ALL');
    setSelectedSubject('ALL');
    setSelectedExamYear('ALL');
    setSelectedExamType('ALL');
    setSearchQuery('');
    updateUrlParams({ branch: null, year: null, semester: null, subject: null, examYear: null, examType: null, search: null });
  };

  // Open PDF viewer with progress tracking
  const handleViewPaper = (paper) => {
    const fileUrl = paper.pdfUrl || paper.fileUrl || paper.driveUrl || paper.url;
    if (!fileUrl) {
      alert('This paper document is currently being verified. Please check back shortly.');
      return;
    }

    trackPYQOpened({
      pyqId: paper.id || paper._id || paper.subjectName,
      pyqName: paper.title || `${paper.subjectName || paper.subject} (${paper.academicYear || paper.examYear || ''})`,
      subject: paper.subjectName || paper.subject || '',
      course: paper.course || selectedCourse || 'B.Tech',
      year: paper.academicYear || paper.examYear || ''
    });

    setActivePyqPaper({
      id: paper.id || paper._id || 'pyq-paper',
      title: paper.title || `${paper.subjectName || paper.subject} (${paper.academicYear || paper.examYear || ''})`,
      name: paper.subjectName || paper.subject || 'Question Paper',
      subjectName: paper.subjectName || paper.subject,
      subjectCode: paper.subjectCode || paper.code || '',
      course: paper.course || selectedCourse || 'B.Tech',
      branch: paper.branch || paper.branchId || selectedBranch || 'CSE',
      semester: paper.semester || '',
      examYear: paper.academicYear || paper.examYear || '',
      examType: paper.examType || 'Examination',
      fileUrl: fileUrl,
      pdfUrl: fileUrl,
      verifiedUrl: fileUrl,
      driveFileId: paper.driveFileId,
      available: true
    });
  };

  // Check if any filter is non-default
  const isAnyFilterActive = 
    selectedBranch !== 'ALL' || 
    selectedYear !== 'ALL' || 
    selectedSemester !== 'ALL' || 
    selectedSubject !== 'ALL' || 
    selectedExamYear !== 'ALL' || 
    selectedExamType !== 'ALL' || 
    searchQuery.trim() !== '';

  return (
    <div style={{ backgroundColor: 'transparent', minHeight: '100vh', padding: '1.25rem 0 3.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem' }}>

        {/* 1. HERO BRANDING & PORTAL HEADER */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #E8E2D5',
          padding: '1.75rem 2rem',
          boxShadow: '0 4px 20px rgba(35, 30, 25, 0.03)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: '#7A2327',
                color: '#ffffff',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                ProfessorVirus Academic Archive
              </span>
              <span style={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #FCD34D',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px'
              }}>
                100% Verified Papers
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: 900,
              color: '#1F2421',
              margin: '0 0 0.35rem 0',
              lineHeight: 1.2
            }}>
              {dynamicPyqHeading}
            </h1>
            <p style={{
              color: '#64748B',
              fontSize: '0.92rem',
              margin: 0,
              maxWidth: '680px',
              lineHeight: 1.45
            }}>
              Dynamic database-driven archive. Filter semester examination papers by course, branch, academic year, semester, subject, and examination year.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div style={{
            backgroundColor: 'transparent',
            border: '1.5px solid #E8E2D5',
            borderRadius: '16px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#7A2327',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1F2421', lineHeight: 1.1 }}>
                {papers.length}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Matching Papers
              </div>
            </div>
          </div>
        </div>

        {/* 2. DYNAMIC FILTERS PANEL (RESPONSIVE DROPDOWNS) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #E8E2D5',
          padding: '1.5rem',
          boxShadow: '0 4px 18px rgba(35, 30, 25, 0.03)',
          marginBottom: '1.75rem'
        }}>
          {/* Filter Header & Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #E8E2D5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7A2327'
              }}>
                <Filter size={16} />
              </div>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#1F2421',
                margin: 0
              }}>
                Filter Question Papers
              </h2>
            </div>

            {/* Clear Filters Action */}
            {isAnyFilterActive && (
              <button
                onClick={handleClearFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #FECACA',
                  backgroundColor: '#FEF2F2',
                  color: '#EF4444',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <RotateCcw size={13} />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* 7 Responsive Filter Dropdowns in a Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>

            {/* 1. COURSE FILTER */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                1. Course
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedCourse}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 2rem 0.55rem 0.85rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: 'transparent',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {availableCourses.map(c => (
                    <option key={c.key} value={c.key}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

            {/* 2. BRANCH FILTER */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                2. Branch
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 2rem 0.55rem 0.85rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: 'transparent',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {availableBranches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

            {/* 3. ACADEMIC YEAR OF STUDY FILTER */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                3. Year of Study
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 2rem 0.55rem 0.85rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: 'transparent',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {availableYears.map(y => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

            {/* 4. SEMESTER FILTER */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                4. Semester
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedSemester}
                  onChange={(e) => handleSemesterChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 2rem 0.55rem 0.85rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: 'transparent',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {availableSemesters.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

            {/* 5. SUBJECT FILTER */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                5. Subject
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 2rem 0.55rem 0.85rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: 'transparent',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {availableSubjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.label || sub.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

            {/* 6. EXAM YEAR FILTER */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                6. Examination Year
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedExamYear}
                  onChange={(e) => handleExamYearChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 2rem 0.55rem 0.85rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: 'transparent',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {availableExamYears.map(yr => (
                    <option key={yr} value={yr}>
                      {yr === 'ALL' ? 'All Exam Years' : yr}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

            {/* 7. EXAM TYPE FILTER */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem', display: 'block' }}>
                7. Exam Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedExamType}
                  onChange={(e) => handleExamTypeChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 2rem 0.55rem 0.85rem',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: 'transparent',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {availableExamTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'ALL' ? 'All Exam Types' : type}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

          </div>

          {/* Quick Search Toolbar within Filter Panel */}
          <div style={{
            position: 'relative',
            marginTop: '0.5rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid #F1F5F9'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: 'calc(50% + 4px)', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Instant search by paper name, code (e.g. BCS301), session, or exam type..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateUrlParams({ search: e.target.value });
              }}
              style={{
                width: '100%',
                padding: '0.55rem 2.2rem 0.55rem 2.2rem',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: 'transparent',
                fontSize: '0.86rem',
                color: '#1F2421',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7A2327'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  updateUrlParams({ search: null });
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: 'calc(50% + 4px)',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* 3. ACTIVE FILTERS SUMMARY & COUNT STRIP */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>
              Available Question Papers
            </span>
            {papers.length === 0 ? (
              <ComingSoonBadge variant="chip" />
            ) : (
              <span style={{
                backgroundColor: '#7A2327',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.15rem 0.6rem',
                borderRadius: '9999px'
              }}>
                {papers.length} {papers.length === 1 ? 'paper' : 'papers'}
              </span>
            )}
          </div>

          {/* Active Filter Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {selectedCourse && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'transparent', border: '1px solid #E8E2D5', padding: '0.15rem 0.5rem', borderRadius: '6px', color: '#475569' }}>
                Course: {selectedCourse}
              </span>
            )}
            {selectedBranch !== 'ALL' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'transparent', border: '1px solid #E8E2D5', padding: '0.15rem 0.5rem', borderRadius: '6px', color: '#475569' }}>
                Branch: {selectedBranch}
              </span>
            )}
            {selectedYear !== 'ALL' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'transparent', border: '1px solid #E8E2D5', padding: '0.15rem 0.5rem', borderRadius: '6px', color: '#475569' }}>
                Year: {selectedYear}
              </span>
            )}
            {selectedSemester !== 'ALL' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'transparent', border: '1px solid #E8E2D5', padding: '0.15rem 0.5rem', borderRadius: '6px', color: '#475569' }}>
                {selectedSemester}
              </span>
            )}
            {selectedSubject !== 'ALL' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'transparent', border: '1px solid #E8E2D5', padding: '0.15rem 0.5rem', borderRadius: '6px', color: '#475569' }}>
                Subject: {selectedSubject}
              </span>
            )}
            {selectedExamYear !== 'ALL' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', padding: '0.15rem 0.5rem', borderRadius: '6px', color: '#92400E' }}>
                Exam: {selectedExamYear}
              </span>
            )}
            {selectedExamType !== 'ALL' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'transparent', border: '1px solid #E8E2D5', padding: '0.15rem 0.5rem', borderRadius: '6px', color: '#475569' }}>
                Type: {selectedExamType}
              </span>
            )}
          </div>
        </div>

        {/* 4. RESULTS SECTION: ACTUAL VERIFIED QUESTION PAPERS */}
        {isLoading ? (
          /* Loading State */
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #E8E2D5',
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #E2E8F0',
              borderTopColor: '#7A2327',
              animation: 'spin 0.8s linear infinite'
            }} />
            <div style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>
              Fetching verified question papers from database...
            </div>
          </div>
        ) : papers.length === 0 ? (
          /* Empty State with Coming Soon Badge */
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1.5px dashed #FCD34D',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.15rem',
            boxShadow: '0 4px 16px rgba(122, 35, 39, 0.03)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              border: '2px solid #FCD34D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7A2327'
            }}>
              <Calendar size={30} />
            </div>

            <ComingSoonBadge 
              variant="badge" 
              style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }} 
            />

            <div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#1F2421',
                margin: '0 0 0.35rem 0'
              }}>
                {selectedSubject !== 'ALL'
                  ? `Previous Year Papers for ${selectedSubject}`
                  : selectedSemester !== 'ALL'
                  ? `${selectedSemester} Previous Year Papers`
                  : `Previous Year Papers for ${selectedCourse}`}
              </h3>
              <p style={{
                color: '#64748B',
                fontSize: '0.88rem',
                margin: '0 auto',
                maxWidth: '480px',
                lineHeight: 1.55
              }}>
                Verified university examination question papers for this specific selection are being synchronized and audited. They will be available in the portal before the semester examination.
              </p>
            </div>

            {isAnyFilterActive && (
              <button
                onClick={handleClearFilters}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#1F2421',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '0.25rem'
                }}
              >
                <RotateCcw size={14} /> Clear All Filters
              </button>
            )}
          </div>
        ) : (
          /* Cards Grid of Matching Genuine Papers */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '1rem'
          }}>
            {papers.map((paper, idx) => {
              const docUrl = paper.pdfUrl || paper.fileUrl || paper.driveUrl || paper.url;
              const subName = paper.subjectName || paper.subject || 'Previous Year Paper';
              const examYr = paper.academicYear || paper.examYear || '';
              const examType = paper.examType || paper.paperType || '';
              const subCode = paper.subjectCode || paper.code || '';
              const branchName = paper.branch || paper.branchId || 'ALL';
              const semesterName = paper.semester || '';

              return (
                <div
                  key={paper.id || paper._id || idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #E8E2D5',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    boxShadow: '0 3px 12px rgba(35, 30, 25, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.95rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    {/* Top Meta Badges */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.35rem',
                      marginBottom: '0.65rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {examYr && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: '#92400E',
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FCD34D',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px'
                          }}>
                            {examYr}
                          </span>
                        )}
                        {examType && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#0369A1',
                            backgroundColor: '#E0F2FE',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px'
                          }}>
                            {examType}
                          </span>
                        )}
                      </div>

                      {/* Course / Branch Tag */}
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#64748B',
                        backgroundColor: 'transparent',
                        border: '1px solid #E2E8F0',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px'
                      }}>
                        {branchName === 'ALL' ? 'All Branches' : branchName} {semesterName ? `• ${semesterName}` : ''}
                      </span>
                    </div>

                    {/* Subject Code & Name */}
                    {subCode && (
                      <div style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        color: '#7A2327',
                        textTransform: 'uppercase',
                        marginBottom: '0.2rem'
                      }}>
                        {subCode}
                      </div>
                    )}
                    <h3 style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: '#1F2421',
                      margin: '0 0 0.35rem 0',
                      lineHeight: 1.35
                    }}>
                      {subName}
                    </h3>

                    {/* Paper Title or Session */}
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>
                      {paper.title || `${subName} ${examYr ? `(${examYr})` : ''}`}
                    </div>
                  </div>

                  {/* Actions: In-Site View & Verified Download */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid #F1F5F9'
                  }}>
                    <button
                      onClick={() => handleViewPaper(paper)}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.85rem',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#1F2421',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7A2327'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1F2421'}
                    >
                      <Eye size={15} />
                      <span>View Paper</span>
                    </button>

                    {docUrl ? (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        title="Direct Download PDF"
                        style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          backgroundColor: 'transparent',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = '#7A2327';
                          e.currentTarget.style.color = '#7A2327';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = '#CBD5E1';
                          e.currentTarget.style.color = '#334155';
                        }}
                      >
                        <Download size={15} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontStyle: 'italic' }}>
                        Processing
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* BOTTOM ACADEMIC RESOURCE BANNER */}
      <div style={{ marginTop: '2.5rem' }}>
        <AcademicResourceBanner onNavigate={onNavigate} />
      </div>

      {/* INTEGRATED IN-SITE PDF VIEWER */}
      {activePyqPaper && (
        <NoteViewerModal
          note={activePyqPaper}
          subject={{
            name: activePyqPaper.subjectName,
            code: activePyqPaper.subjectCode,
            course: activePyqPaper.course,
            branch: activePyqPaper.branch,
            semester: activePyqPaper.semester
          }}
          unit={activePyqPaper.examYear ? `Exam Year: ${activePyqPaper.examYear} (${activePyqPaper.examType || 'Examination'})` : 'Previous Year Paper'}
          onClose={() => setActivePyqPaper(null)}
        />
      )}
    </div>
  );
}
