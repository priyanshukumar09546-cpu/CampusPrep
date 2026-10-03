import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Download, 
  Eye, 
  Code, 
  Layers, 
  Cpu, 
  Radio, 
  Globe, 
  Database,
  ArrowLeft, 
  X, 
  Sparkles, 
  Calendar, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
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
import { getAktuSyllabusForSubject } from '../data/aktuSyllabusData';
import { API_URL } from '../config/api';

// Icons mapping helper for subjects
function getSubjectIcon(name = '', code = '') {
  const n = (name + ' ' + code).toLowerCase();
  if (n.includes('data structure') || n.includes('algorithm') || n.includes('dsa')) return { icon: Layers, bg: '#0D9488', badge: 'DSA' };
  if (n.includes('database') || n.includes('dbms') || n.includes('sql')) return { icon: Database, bg: '#EF4444', badge: 'DBMS' };
  if (n.includes('operating system') || n.includes('os') || n.includes('linux')) return { icon: Cpu, bg: '#8B5CF6', badge: 'OS' };
  if (n.includes('network') || n.includes('cn') || n.includes('communication')) return { icon: Radio, bg: '#EC4899', badge: 'CN' };
  if (n.includes('web') || n.includes('html') || n.includes('internet')) return { icon: Globe, bg: '#F59E0B', badge: 'WEB' };
  if (n.includes('math') || n.includes('calculus')) return { icon: Code, bg: '#2563EB', badge: 'MATH' };
  if (n.includes('compiler') || n.includes('automata') || n.includes('tafl')) return { icon: Code, bg: '#7C3AED', badge: 'THEORY' };
  if (n.includes('ai') || n.includes('intelligence') || n.includes('machine learning')) return { icon: Sparkles, bg: '#059669', badge: 'AI' };
  return { icon: BookOpen, bg: '#7A1C28', badge: 'CORE' };
}

export default function MobileNotesScreen({ 
  courseKey = 'BCA', 
  selectedYearProp = '1st Year',
  selectedBranchProp = 'CSE',
  dbNotes = [], 
  onSelectCourse,
  onSelectYear,
  onSelectBranch,
  onOpenViewer, 
  onRequestNotes,
  onNavigate 
}) {
  const normKey = normalizeCourseKey(courseKey);

  // 1. Navigation Flow States: Course -> Branch -> Year -> Semester -> Subject
  const [selectedCourse, setSelectedCourse] = useState(normKey || 'BCA');
  const [selectedBranch, setSelectedBranch] = useState(selectedBranchProp || 'CSE');
  const [selectedYear, setSelectedYear] = useState(normalizeYearStr(selectedYearProp) || '1st Year');
  const [selectedSem, setSelectedSem] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 2. Active Subject Detail Screen
  const [activeSubjectDetail, setActiveSubjectDetail] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('notes'); // 'notes' | 'pyqs' | 'syllabus'

  // Live subject data fetched from database API
  const [subjectLiveNotes, setSubjectLiveNotes] = useState([]);
  const [subjectLivePyqs, setSubjectLivePyqs] = useState([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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

  // Year options for the selected course as per COURSE_CONFIG
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
    setActiveSubjectDetail(null);

    if (onSelectCourse) onSelectCourse(norm);
    if (onSelectYear) onSelectYear(defaultYear);
  };

  // Year change handler
  const handleYearChange = (newYear) => {
    const normYear = normalizeYearStr(newYear);
    setSelectedYear(normYear);
    setSelectedSem('All');
    setActiveSubjectDetail(null);
    if (onSelectYear) onSelectYear(normYear);
  };

  // Branch change handler
  const handleBranchChange = (newBranch) => {
    setSelectedBranch(newBranch);
    setActiveSubjectDetail(null);
    if (onSelectBranch) onSelectBranch(newBranch);
  };

  // Branch options for B.Tech
  const btechBranches = COURSE_CONFIG["BTech"]?.branches || ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'AI&DS'];
  const isBTech = normalizeCourseKey(selectedCourse) === 'BTech';

  // Subjects belonging strictly to Course + Branch + Year + Semester from central course mapping
  const subjectsList = useMemo(() => {
    const semParam = selectedSem !== 'All' ? selectedSem : null;
    const branchParam = isBTech ? selectedBranch : null;
    const rawSubs = getSubjectsForCourseMapping(selectedCourse, selectedYear, semParam, branchParam);

    let list = (rawSubs || []).map(sub => {
      const iconMeta = getSubjectIcon(sub.name, sub.code);
      return {
        id: sub.code || sub.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        code: sub.code || '',
        name: sub.name,
        semester: sub.semester || '',
        course: selectedCourse,
        branch: branchParam,
        year: selectedYear,
        icon: iconMeta.icon,
        iconBg: iconMeta.bg,
        cardBadge: iconMeta.badge
      };
    });

    // Also merge any subject that exists in dbNotes for this course & year if not already present
    if (Array.isArray(dbNotes) && dbNotes.length > 0) {
      const normSelCourse = normalizeCourseKey(selectedCourse);
      const normSelYear = normalizeYearStr(selectedYear);

      dbNotes.forEach(n => {
        const nCourse = normalizeCourseKey(n.course || 'BTech');
        const nYear = normalizeYearStr(n.year);
        if (nCourse === normSelCourse && nYear === normSelYear) {
          const subName = n.subject || n.subjectName || '';
          const subCode = n.subjectCode || '';
          if (subName && !list.some(s => s.name.toLowerCase() === subName.toLowerCase() || (subCode && s.code.toLowerCase() === subCode.toLowerCase()))) {
            const iconMeta = getSubjectIcon(subName, subCode);
            list.push({
              id: subCode || subName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              code: subCode,
              name: subName,
              semester: n.semester || (selectedSem !== 'All' ? selectedSem : ''),
              course: selectedCourse,
              branch: branchParam,
              year: selectedYear,
              icon: iconMeta.icon,
              iconBg: iconMeta.bg,
              cardBadge: iconMeta.badge
            });
          }
        }
      });
    }

    // Filter by search query if any
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCourse, selectedBranch, selectedYear, selectedSem, searchQuery, isBTech, dbNotes]);

  // Fetch real notes and PYQs when a subject is opened
  useEffect(() => {
    if (!activeSubjectDetail) return;

    let isSubscribed = true;
    setIsLoadingDetail(true);

    const subName = activeSubjectDetail.name;
    const subCode = activeSubjectDetail.code;

    const notesUrl = `${API_URL}/api/notes?course=${encodeURIComponent(selectedCourse)}&branch=${encodeURIComponent(selectedBranch || '')}&subject=${encodeURIComponent(subName)}&subjectCode=${encodeURIComponent(subCode || '')}`;
    const pyqsUrl = `${API_URL}/api/pyqs?course=${encodeURIComponent(selectedCourse)}&branch=${encodeURIComponent(selectedBranch || '')}&subject=${encodeURIComponent(subName)}&subjectCode=${encodeURIComponent(subCode || '')}`;

    Promise.all([
      fetch(notesUrl, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ notes: [] })),
      fetch(pyqsUrl, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ pyqs: [] }))
    ]).then(([notesData, pyqsData]) => {
      if (!isSubscribed) return;
      setSubjectLiveNotes(Array.isArray(notesData.notes) ? notesData.notes : []);
      setSubjectLivePyqs(Array.isArray(pyqsData.pyqs) ? pyqsData.pyqs : []);
      setIsLoadingDetail(false);
    });

    return () => {
      isSubscribed = false;
    };
  }, [activeSubjectDetail, selectedCourse, selectedBranch]);

  // Count notes for a subject strictly scoped to the same course & year
  const getSubjectNoteCount = (sub) => {
    if (!Array.isArray(dbNotes) || dbNotes.length === 0) return null;
    const normSubCourse = normalizeCourseKey(selectedCourse);
    const targetName = (sub.name || '').toLowerCase().replace(/s$/, '').trim();
    const targetCode = (sub.code || '').toLowerCase().trim();

    const count = dbNotes.filter(n => {
      // Must strictly match course!
      const nCourse = normalizeCourseKey(n.course || 'BTech');
      if (nCourse !== normSubCourse) return false;

      const nSub = String(n.subject || n.subjectName || '').toLowerCase().replace(/s$/, '').trim();
      const nCode = String(n.subjectCode || '').toLowerCase().trim();
      return (targetCode && nCode === targetCode) || nSub.includes(targetName) || targetName.includes(nSub);
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
      className="pv-mobile-notes-screen"
      style={{
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        paddingBottom: '5rem',
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      {/* ========================================================================= */}
      {/* SCREEN A: SUBJECT DETAILS OVERLAY (When a subject is clicked) */}
      {/* ========================================================================= */}
      {activeSubjectDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
              onClick={() => setActiveSubjectDetail(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: 'none',
                color: '#7A1C28',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                padding: '0.3rem 0'
              }}
            >
              <ArrowLeft size={18} /> Back to Subjects
            </button>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
              {selectedCourse} • {activeSubjectDetail.code || activeSubjectDetail.branch || selectedYear}
            </span>
          </div>

          <div style={{ padding: '1rem' }}>
            {/* Subject Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              backgroundColor: '#FFFFFF',
              padding: '1.15rem',
              borderRadius: '16px',
              border: '1.5px solid #E8E2D5',
              boxShadow: '0 4px 14px rgba(35,30,25,0.03)',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: activeSubjectDetail.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                flexShrink: 0
              }}>
                {React.createElement(activeSubjectDetail.icon, { size: 24, strokeWidth: 2.2 })}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  {activeSubjectDetail.code && (
                    <span style={{
                      backgroundColor: '#7A1C28',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px'
                    }}>
                      {activeSubjectDetail.code}
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    {selectedCourse} • {selectedYear} • {activeSubjectDetail.semester || selectedSem}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21', margin: 0, lineHeight: 1.25 }}>
                  {activeSubjectDetail.name}
                </h2>
              </div>
            </div>

            {/* Three Tabs: [ Notes ] [ PYQs ] [ Syllabus ] */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '0.25rem',
              border: '1.5px solid #E8E2D5',
              marginBottom: '1rem'
            }}>
              <button
                onClick={() => setActiveDetailTab('notes')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeDetailTab === 'notes' ? '#7A1C28' : 'transparent',
                  color: activeDetailTab === 'notes' ? '#FFFFFF' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <BookOpen size={14} /> Notes ({isLoadingDetail ? '...' : subjectLiveNotes.length})
              </button>

              <button
                onClick={() => setActiveDetailTab('pyqs')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeDetailTab === 'pyqs' ? '#7A1C28' : 'transparent',
                  color: activeDetailTab === 'pyqs' ? '#FFFFFF' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <FileText size={14} /> PYQs ({isLoadingDetail ? '...' : subjectLivePyqs.length})
              </button>

              <button
                onClick={() => setActiveDetailTab('syllabus')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeDetailTab === 'syllabus' ? '#7A1C28' : 'transparent',
                  color: activeDetailTab === 'syllabus' ? '#FFFFFF' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <Layers size={14} /> Syllabus
              </button>
            </div>

            {/* TAB CONTENT 1: Notes */}
            {activeDetailTab === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {isLoadingDetail ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
                    <Sparkles size={28} style={{ animation: 'spin 2s linear infinite', color: '#7A1C28', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Loading verified notes from server...</p>
                  </div>
                ) : subjectLiveNotes.length === 0 ? (
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    border: '1.5px dashed #CBD5E1',
                    color: '#64748B'
                  }}>
                    <BookOpen size={36} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem' }}>
                      No Live Notes Found
                    </h4>
                    <p style={{ fontSize: '0.78rem', margin: '0 0 0.85rem 0' }}>
                      Materials for {activeSubjectDetail.name} are being digitized and uploaded.
                    </p>
                    {onRequestNotes && (
                      <button
                        onClick={() => onRequestNotes(activeSubjectDetail, 1)}
                        style={{
                          backgroundColor: '#7A1C28',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Request Notes Upload
                      </button>
                    )}
                  </div>
                ) : (
                  subjectLiveNotes.map((note, idx) => {
                    const rawUrl = note.driveUrl || note.fileUrl || note.pdfUrl || note.url || note.resourceUrl;
                    const unitNo = note.unit || note.unitNumber || (idx + 1);
                    const provider = note.source || note.sourceName || 'Study Material';

                    return (
                      <div
                        key={note.id || idx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '14px',
                          padding: '1rem',
                          border: '1.5px solid #E8E2D5',
                          boxShadow: '0 2px 8px rgba(35,30,25,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            backgroundColor: '#FDF6E8',
                            color: '#92400E',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px'
                          }}>
                            Unit {unitNo}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                            {provider}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.35rem', lineHeight: 1.35 }}>
                          {note.title || `${activeSubjectDetail.name} — Unit ${unitNo}`}
                        </h4>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <button
                            onClick={() => {
                              if (onOpenViewer) {
                                onOpenViewer({
                                  note,
                                  subject: { name: activeSubjectDetail.name, code: activeSubjectDetail.code },
                                  unit: unitNo || 1
                                });
                              } else if (rawUrl) {
                                window.open(rawUrl, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                              backgroundColor: '#7A1C28',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.55rem',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={15} /> Read Note
                          </button>

                          {rawUrl && (
                            <a
                              href={rawUrl}
                              download
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0.55rem 0.85rem',
                                backgroundColor: '#FAF7F2',
                                color: '#1C1E21',
                                border: '1.5px solid #E8E2D5',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '0.82rem',
                                fontWeight: 600
                              }}
                            >
                              <Download size={15} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB CONTENT 2: PYQs */}
            {activeDetailTab === 'pyqs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {isLoadingDetail ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
                    <Sparkles size={28} style={{ animation: 'spin 2s linear infinite', color: '#E11D48', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Loading question papers...</p>
                  </div>
                ) : subjectLivePyqs.length === 0 ? (
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    border: '1.5px dashed #CBD5E1',
                    color: '#64748B'
                  }}>
                    <FileText size={36} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem' }}>
                      No PYQs Uploaded Yet
                    </h4>
                    <p style={{ fontSize: '0.78rem', margin: 0 }}>
                      Previous year question papers for this subject have not been uploaded yet.
                    </p>
                  </div>
                ) : (
                  subjectLivePyqs.map((pyq, idx) => {
                    const rawUrl = pyq.pdfUrl || pyq.fileUrl || pyq.driveUrl || pyq.resourceUrl || pyq.url;
                    const academicYear = pyq.academicYear || pyq.examYear || 'Recent Year';

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
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            backgroundColor: '#FFF1F2',
                            color: '#9F1239',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px'
                          }}>
                            {academicYear}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                            {pyq.examType || 'End Semester'}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.75rem', lineHeight: 1.35 }}>
                          {activeSubjectDetail.name} — Question Paper {academicYear}
                        </h4>

                        <button
                          onClick={() => {
                            if (rawUrl) window.open(rawUrl, '_blank', 'noopener,noreferrer');
                            else alert('Question paper is currently unavailable.');
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            backgroundColor: '#E11D48',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.55rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={15} /> View Question Paper
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB CONTENT 3: Syllabus */}
            {activeDetailTab === 'syllabus' && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E8E2D5', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {activeSubjectDetail.name} Syllabus
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  Official university curriculum structure covering units 1 through 5.
                </p>
                <a
                  href="https://aktu.ac.in/syllabus.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={15} /> Open Official Syllabus Portal
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN B: MAIN MOBILE NOTES WORKSPACE */}
      {/* ========================================================================= */}

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
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#7A1C28', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
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
          <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#7A1C28', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
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
            placeholder={`Search ${selectedCourse} subjects or codes...`}
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
              style={{
                background: 'none',
                border: 'none',
                color: '#A8A29E',
                cursor: 'pointer',
                padding: '0 0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}
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
                border: isSelected ? '1.5px solid #7A1C28' : '1px solid #E8E2D5',
                backgroundColor: isSelected ? '#7A1C28' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#44403C',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 8px rgba(122,28,40,0.2)' : 'none'
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
            {selectedCourse} Subjects
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
            {selectedYear} {isBTech ? `• ${selectedBranch}` : ''} {selectedSem !== 'All' ? `• ${selectedSem}` : ''} ({subjectsList.length} Available)
          </span>
        </div>

        <button
          onClick={handleRefresh}
          title="Refresh Subjects & Cache"
          style={{
            background: 'none',
            border: 'none',
            color: '#7A1C28',
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
            <BookOpen size={36} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem' }}>
              No Subjects Found
            </h4>
            <p style={{ fontSize: '0.78rem', margin: 0 }}>
              No subjects mapped for {selectedCourse} {isBTech ? selectedBranch : ''} {selectedYear} ({selectedSem}).
            </p>
          </div>
        ) : (
          subjectsList.map((subject) => {
            const IconComp = subject.icon;
            const noteCount = getSubjectNoteCount(subject);

            return (
              <div
                key={subject.id}
                onClick={() => {
                  setActiveSubjectDetail(subject);
                  setActiveDetailTab('notes');
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '0.9rem 1rem',
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
                    backgroundColor: subject.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}>
                    <IconComp size={20} strokeWidth={2.2} />
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
                  {noteCount !== null && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#7A1C28',
                      backgroundColor: '#FDF2F4',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px'
                    }}>
                      {noteCount} {noteCount === 1 ? 'Note' : 'Notes'}
                    </span>
                  )}
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
