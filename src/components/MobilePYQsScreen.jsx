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
  Sparkles
} from 'lucide-react';
import { COURSES, getSubjectsForCourse, normalizeCourseKey } from '../data/coursesCatalog';

export default function MobilePYQsScreen({ 
  courseKey = 'B.Tech', 
  dbPyqs = [], 
  onOpenPdf, 
  onRequestPyq 
}) {
  const normKey = normalizeCourseKey(courseKey);

  // Navigation states: Course -> Branch -> Year -> Semester -> Subject -> PYQs
  const [selectedCourse, setSelectedCourse] = useState(normKey || 'B.Tech');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedYear, setSelectedYear] = useState('1st Year');
  const [selectedSem, setSelectedSem] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Year options for selected course
  const yearOptions = useMemo(() => {
    if (selectedCourse === 'B.Tech') return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    if (selectedCourse === 'BCA') return ['1st Year', '2nd Year', '3rd Year'];
    if (selectedCourse === 'MCA' || selectedCourse === 'MBA') return ['1st Year', '2nd Year'];
    return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  }, [selectedCourse]);

  // Dynamic Semester options
  const semesterOptions = useMemo(() => {
    if (selectedCourse === 'B.Tech' || selectedCourse === 'BCA') {
      if (selectedYear === '1st Year') return ['All', 'Sem 1', 'Sem 2'];
      if (selectedYear === '2nd Year') return ['All', 'Sem 3', 'Sem 4'];
      if (selectedYear === '3rd Year') return ['All', 'Sem 5', 'Sem 6'];
      if (selectedYear === '4th Year') return ['All', 'Sem 7', 'Sem 8'];
    }
    return ['All', 'Sem 1', 'Sem 2'];
  }, [selectedCourse, selectedYear]);

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    setSelectedSem('All');
    setSelectedSubject(null);
  };

  const btechBranches = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'];

  // Compute subjects list for Course + Branch + Year + Semester
  const subjectsList = useMemo(() => {
    const semParam = selectedSem !== 'All' ? selectedSem.replace('Sem ', 'Semester ') : null;
    const branchParam = selectedCourse === 'B.Tech' ? selectedBranch : null;
    const rawSubs = getSubjectsForCourse(selectedCourse, semParam, null, selectedYear, branchParam);

    let list = (rawSubs || []).map(s => ({
      code: s.code || '',
      name: s.name,
      semester: s.semester || '',
      year: selectedYear,
      branch: selectedBranch
    }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCourse, selectedBranch, selectedYear, selectedSem, searchQuery]);

  // Fetch real PYQs when a subject is clicked
  useEffect(() => {
    if (!selectedSubject) return;

    let isSubscribed = true;
    setIsLoadingPyqs(true);

    const subName = selectedSubject.name;
    const subCode = selectedSubject.code;

    const queryParams = new URLSearchParams({
      course: selectedCourse,
      branch: selectedCourse === 'B.Tech' ? selectedBranch : '',
      subject: subName
    });
    if (subCode) queryParams.set('subjectCode', subCode);

    fetch(`/api/pyqs?${queryParams.toString()}&_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (!isSubscribed) return;
        if (data && data.success && Array.isArray(data.pyqs)) {
          const matched = data.pyqs.filter(p => {
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
          setSubjectPyqs(matched.length > 0 ? matched : data.pyqs);
        } else {
          setSubjectPyqs([]);
        }
      })
      .catch(err => {
        if (isSubscribed) {
          console.error('Error fetching subject PYQs:', err);
          setSubjectPyqs([]);
        }
      })
      .finally(() => {
        if (isSubscribed) setIsLoadingPyqs(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [selectedSubject, selectedCourse, selectedBranch]);

  const handleOpenPaper = (pyq) => {
    const rawUrl = pyq.pdfUrl || pyq.fileUrl || pyq.driveUrl || pyq.resourceUrl || pyq.url;
    if (rawUrl) {
      if (onOpenPdf) {
        onOpenPdf(pyq);
      } else {
        window.open(rawUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      alert('This question paper is currently unavailable.');
    }
  };

  return (
    <div
      className="pv-mobile-pyqs-screen"
      style={{
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        paddingBottom: '5rem'
      }}
    >
      {/* ========================================================================= */}
      {/* SCREEN A: SUBJECT PYQ PAPERS LIST */}
      {/* ========================================================================= */}
      {selectedSubject && (
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
            justifyContent: 'space-between'
          }}>
            <button
              onClick={() => setSelectedSubject(null)}
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
              {selectedSubject.code || selectedSubject.branch}
            </span>
          </div>

          <div style={{ padding: '1rem' }}>
            {/* Subject Banner */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.15rem',
              border: '1.5px solid #E8E2D5',
              boxShadow: '0 4px 14px rgba(35,30,25,0.03)',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                {selectedSubject.code && (
                  <span style={{
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px'
                  }}>
                    {selectedSubject.code}
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  {selectedYear} • {selectedSubject.semester || selectedSem}
                </span>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                {selectedSubject.name}
              </h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                Previous Year Question Papers from MongoDB
              </p>
            </div>

            {/* PYQ Papers List */}
            {isLoadingPyqs ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                <Sparkles size={28} style={{ animation: 'spin 2s linear infinite', color: '#E11D48', marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Loading question papers...</p>
              </div>
            ) : subjectPyqs.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                border: '1.5px dashed #CBD5E1',
                color: '#64748B'
              }}>
                <FileText size={36} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem' }}>
                  No Question Papers Uploaded Yet
                </h4>
                <p style={{ fontSize: '0.78rem', margin: 0 }}>
                  Question papers for this subject have not been uploaded to the database yet.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {subjectPyqs.map((pyq, idx) => {
                  const academicYear = pyq.academicYear || pyq.examYear || 'Recent Year';
                  const rawUrl = pyq.pdfUrl || pyq.fileUrl || pyq.driveUrl || pyq.resourceUrl || pyq.url;

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
                          backgroundColor: '#FFF1F2',
                          color: '#9F1239',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <Calendar size={12} /> {academicYear}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                          {pyq.examType || 'End Semester'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.75rem', lineHeight: 1.35 }}>
                        {selectedSubject.name} — Paper {academicYear}
                      </h4>

                      <button
                        onClick={() => handleOpenPaper(pyq)}
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
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN B: MAIN PYQs WORKSPACE */}
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
            placeholder="Search PYQs by subject or code..."
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

      {/* 2. Course Selection Pills */}
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
                setSelectedSubject(null);
              }}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                border: isSelected ? '1.5px solid #E11D48' : '1px solid #E8E2D5',
                backgroundColor: isSelected ? '#E11D48' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#44403C',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 8px rgba(225,29,72,0.18)' : 'none',
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
                onClick={() => {
                  setSelectedBranch(b);
                  setSelectedSubject(null);
                }}
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

      {/* 4. Select Year Controls */}
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
              color: '#E11D48',
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
                    border: isSelected ? '2px solid #E11D48' : '1.5px solid #E8E2D5',
                    backgroundColor: isSelected ? '#E11D48' : '#FAF7F2',
                    color: isSelected ? '#FFFFFF' : '#1C1E21',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 3px 8px rgba(225,29,72,0.22)' : 'none'
                  }}
                >
                  Year {shortLabel}
                </button>
              );
            })}
          </div>

          {/* Semester Chips */}
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
                      border: isSelected ? '1.5px solid #E11D48' : '1px solid #E8E2D5',
                      backgroundColor: isSelected ? '#FFF1F2' : '#FFFFFF',
                      color: isSelected ? '#9F1239' : '#64748B',
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

      {/* 5. Section Header */}
      <div style={{
        padding: '0 1rem 0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
          Select Subject for PYQs
        </h2>
        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
          {selectedYear} ({subjectsList.length} Subjects)
        </span>
      </div>

      {/* 6. Subjects List */}
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
              No Subjects Found
            </h4>
            <p style={{ fontSize: '0.78rem', margin: 0 }}>
              No subjects mapped for {selectedCourse} {selectedBranch} {selectedYear}.
            </p>
          </div>
        ) : (
          subjectsList.map((subject, idx) => (
            <div
              key={subject.code || idx}
              onClick={() => setSelectedSubject(subject)}
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                  {subject.code && (
                    <span style={{
                      backgroundColor: '#FFF1F2',
                      color: '#9F1239',
                      fontSize: '0.68rem',
                      fontWeight: 800,
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
              </div>

              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E11D48',
                flexShrink: 0,
                marginLeft: '0.5rem'
              }}>
                <ChevronRight size={16} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
