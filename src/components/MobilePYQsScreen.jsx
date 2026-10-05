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
  RefreshCw
} from 'lucide-react';
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

export default function MobilePYQsScreen({ 
  courseKey = 'BTech', 
  selectedYearProp = '1st Year',
  selectedBranchProp = 'CSE',
  dbPyqs = [], 
  onSelectCourse,
  onSelectYear,
  onSelectBranch,
  onOpenPdf, 
  onRequestPyq 
}) {
  const normKey = normalizeCourseKey(courseKey);

  // Navigation states: Course -> Branch -> Year -> Semester -> Subject -> PYQs
  const [selectedCourse, setSelectedCourse] = useState(normKey || 'BTech');
  const [selectedBranch, setSelectedBranch] = useState(selectedBranchProp || 'CSE');
  const [selectedYear, setSelectedYear] = useState(normalizeYearStr(selectedYearProp) || '1st Year');
  const [selectedSem, setSelectedSem] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected subject for viewing PYQs list
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectPyqs, setSubjectPyqs] = useState([]);
  const [isLoadingPyqs, setIsLoadingPyqs] = useState(false);

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

  // Year options for selected course from COURSE_CONFIG
  const yearOptions = useMemo(() => {
    return getYearsForCourse(selectedCourse);
  }, [selectedCourse]);

  // Dynamic Semester options based on selected Course & Year
  const semesterOptions = useMemo(() => {
    const sems = getSemestersForCourseYear(selectedCourse, selectedYear);
    return ['All', ...sems];
  }, [selectedCourse, selectedYear]);

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
    setSelectedSem('All');
    setSelectedSubject(null);

    if (onSelectCourse) onSelectCourse(norm);
    if (onSelectYear) onSelectYear(defaultYear);
  };

  const handleYearChange = (newYear) => {
    const normYear = normalizeYearStr(newYear);
    setSelectedYear(normYear);
    setSelectedSem('All');
    setSelectedSubject(null);
    if (onSelectYear) onSelectYear(normYear);
  };

  const handleBranchChange = (newBranch) => {
    setSelectedBranch(newBranch);
    setSelectedSubject(null);
    if (onSelectBranch) onSelectBranch(newBranch);
  };

  const btechBranches = COURSE_CONFIG["BTech"]?.branches || ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI&DS'];
  const isBTech = normalizeCourseKey(selectedCourse) === 'BTech';

  // Compute subjects list for Course + Branch + Year + Semester
  const subjectsList = useMemo(() => {
    const semParam = selectedSem !== 'All' ? selectedSem : null;
    const branchParam = isBTech ? selectedBranch : null;
    const rawSubs = getSubjectsForCourseMapping(selectedCourse, selectedYear, semParam, branchParam);

    let list = (rawSubs || []).map(s => ({
      code: s.code || '',
      name: s.name,
      semester: s.semester || '',
      year: selectedYear,
      branch: branchParam
    }));

    // Also include any subjects with available PYQs from dbPyqs
    if (Array.isArray(dbPyqs) && dbPyqs.length > 0) {
      const normSelCourse = normalizeCourseKey(selectedCourse);
      const normSelYear = normalizeYearStr(selectedYear);

      dbPyqs.forEach(p => {
        const pCourse = normalizeCourseKey(p.course || 'BTech');
        const pYear = normalizeYearStr(p.year);
        if (pCourse === normSelCourse && pYear === normSelYear) {
          const subName = p.subject || p.subjectName || '';
          const subCode = p.subjectCode || '';
          if (subName && !list.some(s => s.name.toLowerCase() === subName.toLowerCase() || (subCode && s.code.toLowerCase() === subCode.toLowerCase()))) {
            list.push({
              code: subCode,
              name: subName,
              semester: p.semester || (selectedSem !== 'All' ? selectedSem : ''),
              year: selectedYear,
              branch: branchParam
            });
          }
        }
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
  }, [selectedCourse, selectedBranch, selectedYear, selectedSem, searchQuery, isBTech, dbPyqs]);

  // Fetch real PYQs when a subject is clicked
  useEffect(() => {
    if (!selectedSubject) return;

    let isSubscribed = true;
    setIsLoadingPyqs(true);

    const subName = selectedSubject.name;
    const subCode = selectedSubject.code;

    const queryParams = new URLSearchParams({
      course: selectedCourse,
      branch: isBTech ? selectedBranch : '',
      subject: subName
    });
    if (subCode) queryParams.set('subjectCode', subCode);

    fetch(`${API_URL}/api/pyqs?${queryParams.toString()}&_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (!isSubscribed) return;
        console.log("API URL", API_URL, "Response", data);
        if (data && data.success && Array.isArray(data.pyqs)) {
          const matched = data.pyqs.filter(p => {
            const pCourse = normalizeCourseKey(p.course || 'BTech');
            if (pCourse !== normalizeCourseKey(selectedCourse)) return false;

            const pSub = String(p.subjectName || p.subject || '').toLowerCase();
            const pCode = String(p.subjectCode || '').toLowerCase();
            const targetSub = subName.toLowerCase();
            const targetCode = subCode.toLowerCase();
            return (
              (targetCode && pCode === targetCode) ||
              pSub.includes(targetSub) ||
              targetSub.includes(pSub) ||
              targetSub.replace(/s$/, '') === pSub.replace(/s$/, '')
            );
          });

          let finalPyqs = matched.length > 0 ? matched : data.pyqs;
          if ((!finalPyqs || finalPyqs.length === 0) && subCode) {
            const clean = String(subCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
            const hyphen = clean.replace(/^([A-Z]+)(\d+)$/, '$1-$2');
            const candidates = [subCode, clean, hyphen, subCode?.toUpperCase(), subCode?.toLowerCase()];
            for (const k of candidates) {
              if (k && localPyqsData[k] && localPyqsData[k].length > 0) {
                finalPyqs = localPyqsData[k];
                break;
              }
            }
          }
          setSubjectPyqs(finalPyqs || []);
        } else {
          let fallbackPyqs = [];
          if (subCode) {
            const clean = String(subCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
            const hyphen = clean.replace(/^([A-Z]+)(\d+)$/, '$1-$2');
            const candidates = [subCode, clean, hyphen, subCode?.toUpperCase(), subCode?.toLowerCase()];
            for (const k of candidates) {
              if (k && localPyqsData[k] && localPyqsData[k].length > 0) {
                fallbackPyqs = localPyqsData[k];
                break;
              }
            }
          }
          setSubjectPyqs(fallbackPyqs);
        }
        setIsLoadingPyqs(false);
      })
      .catch(err => {
        if (!isSubscribed) return;
        console.error('Error fetching subject PYQs:', err);
        let fallbackPyqs = [];
        if (subCode) {
          const clean = String(subCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
          const hyphen = clean.replace(/^([A-Z]+)(\d+)$/, '$1-$2');
          const candidates = [subCode, clean, hyphen, subCode?.toUpperCase(), subCode?.toLowerCase()];
          for (const k of candidates) {
            if (k && localPyqsData[k] && localPyqsData[k].length > 0) {
              fallbackPyqs = localPyqsData[k];
              break;
            }
          }
        }
        setSubjectPyqs(fallbackPyqs);
        setIsLoadingPyqs(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [selectedSubject, selectedCourse, selectedBranch, isBTech]);

  // Count PYQs strictly matching course
  const getSubjectPyqCount = (sub) => {
    if (!Array.isArray(dbPyqs) || dbPyqs.length === 0) return null;
    const normSubCourse = normalizeCourseKey(selectedCourse);
    const targetName = (sub.name || '').toLowerCase().replace(/s$/, '').trim();
    const targetCode = (sub.code || '').toLowerCase().trim();

    const count = dbPyqs.filter(p => {
      const pCourse = normalizeCourseKey(p.course || 'BTech');
      if (pCourse !== normSubCourse) return false;

      const pSub = String(p.subject || p.subjectName || '').toLowerCase().replace(/s$/, '').trim();
      const pCode = String(p.subjectCode || '').toLowerCase().trim();
      return (targetCode && pCode === targetCode) || pSub.includes(targetName) || targetName.includes(pSub);
    }).length;

    return count > 0 ? count : null;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onSelectCourse) onSelectCourse(selectedCourse);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div 
      className="pv-mobile-pyqs-screen"
      style={{
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        paddingBottom: '5rem',
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      {/* 0. STICKY TOP DROPDOWNS BAR (COURSE + YEAR + BRANCH) */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #E8E2D5',
        padding: '0.65rem 1rem',
        boxShadow: '0 2px 10px rgba(35,30,25,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxSizing: 'border-box'
      }}>
        {/* Course Dropdown */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#C88D2D', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
            Course:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 1.5rem 0.45rem 0.6rem',
                borderRadius: '10px',
                border: '1.5px solid #E8E2D5',
                backgroundColor: '#FAF7F2',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#1C1E21',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            >
              {AVAILABLE_COURSES.map(c => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} color="#78716C" style={{ position: 'absolute', right: '0.45rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Year Dropdown */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#C88D2D', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
            Year:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 1.5rem 0.45rem 0.6rem',
                borderRadius: '10px',
                border: '1.5px solid #E8E2D5',
                backgroundColor: '#FAF7F2',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#1C1E21',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown size={14} color="#78716C" style={{ position: 'absolute', right: '0.45rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Branch Dropdown (if BTech) */}
        {isBTech && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
              Branch:
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedBranch}
                onChange={(e) => handleBranchChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 1.5rem 0.45rem 0.6rem',
                  borderRadius: '10px',
                  border: '1.5px solid #BAE6FD',
                  backgroundColor: '#F0F9FF',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#0369A1',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer'
                }}
              >
                {btechBranches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#0369A1" style={{ position: 'absolute', right: '0.45rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        )}
      </div>

      {/* 1. SEARCH BAR */}
      <div style={{ padding: '0.75rem 1rem 0.4rem 1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          padding: '0.65rem 0.85rem',
          border: '1.5px solid #E8E2D5',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <Search size={18} style={{ color: '#A8A29E', marginRight: '0.5rem', flexShrink: 0 }} />
          <input
            type="text"
            placeholder={`Search ${selectedCourse} question papers...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.9rem',
              color: '#1C1E21',
              fontWeight: 500
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer', padding: 0 }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. HORIZONTALLY SCROLLABLE SEMESTER CHIPS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0.35rem 1rem 0.65rem 1rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        flexWrap: 'nowrap'
      }}>
        {semesterOptions.map(sem => {
          const isSelected = selectedSem === sem;
          return (
            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                border: isSelected ? '1.5px solid #C88D2D' : '1px solid #E8E2D5',
                backgroundColor: isSelected ? '#C88D2D' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#44403C',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 8px rgba(200,141,45,0.25)' : 'none'
              }}
            >
              {sem === 'All' ? 'All Semesters' : sem}
            </button>
          );
        })}
      </div>

      {/* 3. Section Header & Refresh indicator */}
      <div style={{
        padding: '0.2rem 1rem 0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
            {selectedCourse} Question Papers
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
            {selectedYear} {isBTech ? `• ${selectedBranch}` : ''} {selectedSem !== 'All' ? `• ${selectedSem}` : ''} ({subjectsList.length} Subjects)
          </span>
        </div>

        <button
          onClick={handleRefresh}
          title="Refresh Question Papers"
          style={{
            background: 'none',
            border: 'none',
            color: '#C88D2D',
            cursor: 'pointer',
            padding: '0.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.75rem',
            fontWeight: 700
          }}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 4. SUBJECTS LIST (FULL WIDTH CARDS WITH TEXT TRUNCATION & CHEVRON) */}
      <div style={{
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        {subjectsList.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px dashed #CBD5E1',
            padding: '2.5rem 1rem',
            textAlign: 'center',
            color: '#64748B'
          }}>
            <FileText size={36} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem' }}>
              No Question Papers Found
            </h4>
            <p style={{ fontSize: '0.78rem', margin: 0 }}>
              No papers found for {selectedCourse} {isBTech ? selectedBranch : ''} {selectedYear} ({selectedSem}).
            </p>
          </div>
        ) : (
          subjectsList.map((subject, idx) => {
            const pyqCount = getSubjectPyqCount(subject);

            return (
              <div
                key={subject.code || idx}
                onClick={() => setSelectedSubject(subject)}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '0.95rem 1rem',
                  border: '1.5px solid #E8E2D5',
                  boxShadow: '0 2px 8px rgba(35,30,25,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#FDF6E8',
                    border: '1.5px solid #E8D3B0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C88D2D',
                    flexShrink: 0
                  }}>
                    <FileText size={20} strokeWidth={2.2} />
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                      {subject.code && (
                        <span style={{
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px'
                        }}>
                          {subject.code}
                        </span>
                      )}
                      <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>
                        {selectedYear} {subject.semester ? `• ${subject.semester}` : ''}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: '#1C1E21',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {subject.name}
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  {pyqCount !== null && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#92400E',
                      backgroundColor: '#FEF3C7',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px'
                    }}>
                      {pyqCount} {pyqCount === 1 ? 'Paper' : 'Papers'}
                    </span>
                  )}
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. SUBJECT PAPERS MODAL OVERLAY */}
      {selectedSubject && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#FAF7F2',
          zIndex: 1000,
          overflowY: 'auto',
          paddingBottom: '80px',
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#FAF7F2',
            borderBottom: '1.5px solid #E8E2D5',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(35,30,25,0.03)'
          }}>
            <button
              onClick={() => setSelectedSubject(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: 'none',
                color: '#C88D2D',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={18} /> Back to Question Papers
            </button>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
              {selectedCourse} • {selectedSubject.code || selectedYear}
            </span>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1.5px solid #E8E2D5',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(35,30,25,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <span style={{ backgroundColor: '#FDF6E8', color: '#92400E', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                  {selectedSubject.code || selectedCourse}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  {selectedYear} {selectedSubject.semester ? `• ${selectedSubject.semester}` : ''}
                </span>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                {selectedSubject.name}
              </h2>
            </div>

            {isLoadingPyqs ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
                <Sparkles size={28} style={{ animation: 'spin 2s linear infinite', color: '#C88D2D', marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.84rem', fontWeight: 600 }}>Loading verified question papers...</p>
              </div>
            ) : subjectPyqs.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                border: '1.5px dashed #CBD5E1',
                color: '#64748B'
              }}>
                <FileText size={36} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem' }}>
                  No Papers Uploaded Yet
                </h4>
                <p style={{ fontSize: '0.78rem', margin: '0 0 1rem 0' }}>
                  Papers for {selectedSubject.name} are being sourced and digitized.
                </p>
                {onRequestPyq && (
                  <button
                    onClick={() => {
                      onRequestPyq(selectedSubject, selectedYear);
                      setSelectedSubject(null);
                    }}
                    style={{
                      backgroundColor: '#1F2421',
                      color: '#FFFFFF',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Request Question Paper
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {subjectPyqs.map((pyq, idx) => {
                  const academicYear = pyq.academicYear || pyq.examYear || 'Recent Paper';
                  return (
                    <div
                      key={pyq.id || idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        padding: '1rem',
                        border: '1.5px solid #E8E2D5',
                        boxShadow: '0 2px 8px rgba(35,30,25,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                          Session {academicYear}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                          {pyq.examType || 'End Semester'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.75rem', lineHeight: 1.35 }}>
                        {selectedSubject.name} — Question Paper {academicYear}
                      </h4>

                      <button
                        onClick={() => onOpenPdf(pyq)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          backgroundColor: '#C88D2D',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.55rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={15} /> Open Question Paper PDF
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
