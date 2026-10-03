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
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { COURSES, getSubjectsForCourse, normalizeCourseKey } from '../data/coursesCatalog';
import { getAktuSyllabusForSubject } from '../data/aktuSyllabusData';

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
  courseKey = 'B.Tech', 
  dbNotes = [], 
  onOpenViewer, 
  onRequestNotes,
  onNavigate 
}) {
  const normKey = normalizeCourseKey(courseKey);

  // 1. Navigation Flow States: Course -> Branch -> Year -> Semester -> Subject
  const [selectedCourse, setSelectedCourse] = useState(normKey || 'B.Tech');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedYear, setSelectedYear] = useState('1st Year');
  const [selectedSem, setSelectedSem] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Year options for the selected course
  const yearOptions = useMemo(() => {
    if (selectedCourse === 'B.Tech') {
      return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    }
    if (selectedCourse === 'BCA') {
      return ['1st Year', '2nd Year', '3rd Year'];
    }
    if (selectedCourse === 'MCA' || selectedCourse === 'MBA') {
      return ['1st Year', '2nd Year'];
    }
    if (selectedCourse === 'B.Pharm') {
      return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    }
    return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  }, [selectedCourse]);

  // Dynamic Semester options based on the selected Year
  const semesterOptions = useMemo(() => {
    if (selectedCourse === 'B.Tech' || selectedCourse === 'BCA') {
      if (selectedYear === '1st Year') return ['All', 'Sem 1', 'Sem 2'];
      if (selectedYear === '2nd Year') return ['All', 'Sem 3', 'Sem 4'];
      if (selectedYear === '3rd Year') return ['All', 'Sem 5', 'Sem 6'];
      if (selectedYear === '4th Year') return ['All', 'Sem 7', 'Sem 8'];
    }
    return ['All', 'Sem 1', 'Sem 2'];
  }, [selectedCourse, selectedYear]);

  // Reset semester to 'All' when year changes
  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    setSelectedSem('All');
  };

  // Branch options for B.Tech
  const btechBranches = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'];

  // Subjects belonging strictly to Course + Branch + Year + Semester
  const subjectsList = useMemo(() => {
    const semParam = selectedSem !== 'All' ? selectedSem.replace('Sem ', 'Semester ') : null;
    const branchParam = selectedCourse === 'B.Tech' ? selectedBranch : null;
    const rawSubs = getSubjectsForCourse(selectedCourse, semParam, null, selectedYear, branchParam);

    let list = (rawSubs || []).map(sub => {
      const iconMeta = getSubjectIcon(sub.name, sub.code);
      return {
        id: sub.code || sub.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        code: sub.code || '',
        name: sub.name,
        semester: sub.semester || '',
        course: selectedCourse,
        branch: selectedBranch,
        year: selectedYear,
        icon: iconMeta.icon,
        iconBg: iconMeta.bg,
        cardBadge: iconMeta.badge
      };
    });

    // Filter by search query if any
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCourse, selectedBranch, selectedYear, selectedSem, searchQuery]);

  // Fetch real notes and PYQs when a subject is opened
  useEffect(() => {
    if (!activeSubjectDetail) return;

    let isSubscribed = true;
    setIsLoadingDetail(true);

    const subName = activeSubjectDetail.name;
    const subCode = activeSubjectDetail.code;

    const notesUrl = `/api/notes?course=${encodeURIComponent(selectedCourse)}&branch=${encodeURIComponent(selectedBranch)}&subject=${encodeURIComponent(subName)}&subjectCode=${encodeURIComponent(subCode)}`;
    const pyqsUrl = `/api/pyqs?course=${encodeURIComponent(selectedCourse)}&branch=${encodeURIComponent(selectedBranch)}&subject=${encodeURIComponent(subName)}&subjectCode=${encodeURIComponent(subCode)}`;

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

  // Count notes for a subject from dbNotes prop
  const getSubjectNoteCount = (sub) => {
    if (!Array.isArray(dbNotes) || dbNotes.length === 0) return null;
    const targetName = sub.name.toLowerCase().replace(/s$/, '');
    const targetCode = sub.code.toLowerCase();
    const count = dbNotes.filter(n => {
      const nSub = String(n.subject || n.subjectName || '').toLowerCase().replace(/s$/, '');
      const nCode = String(n.subjectCode || '').toLowerCase();
      return (targetCode && nCode === targetCode) || nSub.includes(targetName) || targetName.includes(nSub);
    }).length;
    return count > 0 ? count : null;
  };

  return (
    <div 
      className="pv-mobile-notes-screen"
      style={{
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        paddingBottom: '5rem'
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
          paddingBottom: '80px'
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
              {activeSubjectDetail.code || activeSubjectDetail.branch}
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
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
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
                    {selectedYear} • {activeSubjectDetail.semester || selectedSem}
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
                <ShieldCheck size={14} /> Syllabus
              </button>
            </div>

            {/* TAB CONTENT 1: NOTES */}
            {activeDetailTab === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {isLoadingDetail ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
                    <Sparkles size={28} style={{ animation: 'spin 2s linear infinite', color: '#C88D2D', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Loading notes from database...</p>
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
                      No Notes Uploaded Yet
                    </h4>
                    <p style={{ fontSize: '0.78rem', margin: '0 0 1rem' }}>
                      Verified notes for this subject have not been uploaded to the database yet.
                    </p>
                    {onRequestNotes && (
                      <button
                        onClick={() => onRequestNotes(activeSubjectDetail, 1)}
                        style={{
                          backgroundColor: '#7A1C28',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Request Notes
                      </button>
                    )}
                  </div>
                ) : (
                  subjectLiveNotes.map((note, idx) => {
                    const rawUrl = note.driveUrl || note.pdfUrl || note.fileUrl || note.resourceUrl || note.url;
                    const unitNo = note.unit !== undefined ? note.unit : note.unitNumber;
                    const provider = note.provider || note.source || 'Faculty Lecture Notes';

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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            backgroundColor: '#FDF6E8',
                            color: '#92400E',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px'
                          }}>
                            {unitNo ? `Unit ${unitNo}` : 'Complete'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.35rem', lineHeight: 1.35 }}>
                          {note.title || `${activeSubjectDetail.name} — Unit ${unitNo || idx + 1}`}
                        </h4>

                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 0.75rem' }}>
                          Provider: <strong>{provider}</strong>
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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

            {/* TAB CONTENT 3: SYLLABUS */}
            {activeDetailTab === 'syllabus' && (() => {
              const aktuSub = getAktuSyllabusForSubject(activeSubjectDetail.code, activeSubjectDetail.name);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Official Metadata Card */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '1.15rem',
                    border: '1.5px solid #E8E2D5',
                    boxShadow: '0 2px 8px rgba(35,30,25,0.03)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                      <ShieldCheck size={20} style={{ color: '#059669' }} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                        Official AKTU Curriculum
                      </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>University:</span>
                        <strong style={{ color: '#1C1E21' }}>AKTU</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>Course &amp; Branch:</span>
                        <strong style={{ color: '#1C1E21' }}>{selectedCourse} - {selectedBranch}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>Year:</span>
                        <strong style={{ color: '#1C1E21' }}>{selectedYear}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>Subject Code:</span>
                        <strong style={{ color: '#1C1E21' }}>{activeSubjectDetail.code || 'AKTU'}</strong>
                      </div>
                    </div>

                    {/* Official Units Outline */}
                    {aktuSub && Array.isArray(aktuSub.units) && aktuSub.units.length > 0 && (
                      <div style={{ marginTop: '0.75rem', borderTop: '1px solid #F1ECE1', paddingTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          Curriculum Units:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {aktuSub.units.map(u => (
                            <div key={u.unitNo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#1C1E21' }}>
                              <span style={{ backgroundColor: '#7A1C28', color: '#FFF', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                                {u.unitNo}
                              </span>
                              <span>{u.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PDF action or truthful unavailable state */}
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1ECE1' }}>
                      {aktuSub && aktuSub.isPdfAvailable && aktuSub.pdfUrl ? (
                        <a
                          href={aktuSub.pdfUrl}
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
                          <Eye size={15} /> View Official Syllabus PDF
                        </a>
                      ) : (
                        <div style={{
                          backgroundColor: '#FFFBEB',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #FDE68A'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400E', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                            <AlertCircle size={14} /> Official AKTU syllabus PDF currently unavailable.
                          </div>
                          <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', color: '#B45309', lineHeight: 1.35 }}>
                            Authoritative syllabus is maintained directly on the official AKTU portal.
                          </p>
                          <a
                            href="https://aktu.ac.in/syllabus.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              backgroundColor: '#D97706',
                              color: '#FFFFFF',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textDecoration: 'none'
                            }}
                          >
                            Open AKTU Syllabus Hub <ExternalLink size={13} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN B: MAIN MOBILE NOTES WORKSPACE */}
      {/* ========================================================================= */}

      {/* 1. Search Bar */}
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
            placeholder="Search subjects or codes (e.g. OS, KCS-401)..."
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

      {/* 2. Course Selection Pills: B.Tech | MCA | MBA | B.Pharm | BCA */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        overflowX: 'auto',
        padding: '0.35rem 1rem 0.6rem 1rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {COURSES.map(c => {
          const isSelected = selectedCourse === c.key;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCourse(c.key);
                setSelectedYear('1st Year');
                setSelectedSem('All');
              }}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                border: isSelected ? '1.5px solid #7A1C28' : '1px solid #E8E2D5',
                backgroundColor: isSelected ? '#7A1C28' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#44403C',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 8px rgba(122,28,40,0.18)' : 'none',
                flexShrink: 0
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* 3. Branch Selection (When B.Tech is selected) */}
      {selectedCourse === 'B.Tech' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          overflowX: 'auto',
          padding: '0 1rem 0.65rem 1rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', marginRight: '0.2rem', flexShrink: 0 }}>
            Branch:
          </span>
          {btechBranches.map(b => {
            const isSelected = selectedBranch === b;
            return (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                style={{
                  padding: '0.25rem 0.7rem',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid #0284C7' : '1px solid #E8E2D5',
                  backgroundColor: isSelected ? '#E0F2FE' : '#FFFFFF',
                  color: isSelected ? '#0369A1' : '#475569',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 800 : 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {b}
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SELECT YEAR CONTROLS (MANDATORY REQUIREMENT) */}
      {/* ========================================================================= */}
      <div style={{ padding: '0 1rem 0.85rem 1rem' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '0.85rem 1rem',
          border: '1.5px solid #E8E2D5',
          boxShadow: '0 2px 10px rgba(35,30,25,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.65rem'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#7A1C28',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Calendar size={13} /> Select Academic Year
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
              {selectedYear}
            </span>
          </div>

          {/* 4 Clean Premium Buttons: Year 1 | Year 2 | Year 3 | Year 4 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${yearOptions.length}, 1fr)`,
            gap: '0.45rem'
          }}>
            {yearOptions.map(y => {
              const isSelected = selectedYear === y;
              const shortLabel = y.replace('st Year', '').replace('nd Year', '').replace('rd Year', '').replace('th Year', '');
              return (
                <button
                  key={y}
                  onClick={() => handleYearChange(y)}
                  style={{
                    padding: '0.55rem 0.2rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #7A1C28' : '1.5px solid #E8E2D5',
                    backgroundColor: isSelected ? '#7A1C28' : '#FAF7F2',
                    color: isSelected ? '#FFFFFF' : '#1C1E21',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 3px 8px rgba(122,28,40,0.22)' : 'none'
                  }}
                >
                  Year {shortLabel}
                </button>
              );
            })}
          </div>

          {/* 5. Semester Chips within the Selected Year */}
          {semesterOptions.length > 1 && (
            <div style={{
              marginTop: '0.75rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid #F1ECE1',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#78716C', marginRight: '0.2rem' }}>
                Semester:
              </span>
              {semesterOptions.map(sem => {
                const isSelected = selectedSem === sem;
                return (
                  <button
                    key={sem}
                    onClick={() => setSelectedSem(sem)}
                    style={{
                      padding: '0.22rem 0.65rem',
                      borderRadius: '999px',
                      border: isSelected ? '1.5px solid #C88D2D' : '1px solid #E8E2D5',
                      backgroundColor: isSelected ? '#FDF6E8' : '#FFFFFF',
                      color: isSelected ? '#92400E' : '#64748B',
                      fontSize: '0.74rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {sem}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 6. Section Header */}
      <div style={{
        padding: '0 1rem 0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
            {selectedCourse} Subjects
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
            {selectedYear} {selectedSem !== 'All' ? `• ${selectedSem}` : ''} ({subjectsList.length} Available)
          </span>
        </div>
      </div>

      {/* 7. SUBJECTS LIST (ONLY Belonging to Selected Year/Semester) */}
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
              No subjects mapped for {selectedCourse} {selectedBranch} {selectedYear} ({selectedSem}).
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
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '0.9rem 1rem',
                  border: '1.5px solid #E8E2D5',
                  boxShadow: '0 2px 8px rgba(35,30,25,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                      {subject.semester && (
                        <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>
                          {subject.semester}
                        </span>
                      )}
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

                    <div style={{
                      fontSize: '0.72rem',
                      color: '#059669',
                      fontWeight: 600,
                      marginTop: '0.15rem'
                    }}>
                      {noteCount ? `${noteCount} Notes Available` : 'Notes & PYQs'}
                    </div>
                  </div>
                </div>

                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7A1C28',
                  flexShrink: 0,
                  marginLeft: '0.5rem'
                }}>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
