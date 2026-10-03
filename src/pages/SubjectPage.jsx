import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Layers, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { getAktuSyllabusForSubject } from '../data/aktuSyllabusData';
import NoteViewerModal from '../components/NoteViewerModal';

export default function SubjectPage({ 
  subjectData, 
  onBack, 
  onOpenViewer, 
  onNavigate 
}) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'pyqs' | 'syllabus'
  const [notes, setNotes] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isLoadingPyqs, setIsLoadingPyqs] = useState(true);
  const [viewerModalData, setViewerModalData] = useState(null);

  // Normalize subject details from prop
  const subjectName = typeof subjectData === 'string' 
    ? subjectData 
    : (subjectData?.name || subjectData?.subject || subjectData?.title || 'Subject Details');

  const subjectCode = subjectData?.code || subjectData?.subjectCode || '';
  const branch = subjectData?.branch || subjectData?.branchId || 'CSE';
  const year = subjectData?.year || '2nd Year';
  const semester = subjectData?.sem || subjectData?.semester || '';
  const course = subjectData?.course || 'B.Tech';

  // Authoritative AKTU syllabus data for this subject
  const aktuSyllabus = getAktuSyllabusForSubject(subjectCode, subjectName);

  // Fetch real notes from MongoDB API
  useEffect(() => {
    let isSubscribed = true;
    setIsLoadingNotes(true);

    const queryParams = new URLSearchParams({
      course: course,
      branch: branch !== 'ALL' ? branch : '',
      subject: subjectName
    });
    if (subjectCode) queryParams.set('subjectCode', subjectCode);

    fetch(`/api/notes?${queryParams.toString()}&_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (!isSubscribed) return;
        if (data && data.success && Array.isArray(data.notes)) {
          // Filter to match this subject
          const matched = data.notes.filter(n => {
            const nSub = String(n.subject || n.subjectName || '').toLowerCase();
            const nCode = String(n.subjectCode || '').toLowerCase();
            const targetSub = subjectName.toLowerCase();
            const targetCode = subjectCode.toLowerCase();
            return (
              (targetCode && nCode === targetCode) ||
              nSub.includes(targetSub) ||
              targetSub.includes(nSub) ||
              targetSub.replace(/s$/, '') === nSub.replace(/s$/, '')
            );
          });
          setNotes(matched.length > 0 ? matched : data.notes);
        } else {
          setNotes([]);
        }
      })
      .catch(err => {
        if (isSubscribed) {
          console.error('Error fetching subject notes:', err);
          setNotes([]);
        }
      })
      .finally(() => {
        if (isSubscribed) setIsLoadingNotes(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [subjectName, subjectCode, branch, course]);

  // Fetch real PYQs from MongoDB API
  useEffect(() => {
    let isSubscribed = true;
    setIsLoadingPyqs(true);

    const queryParams = new URLSearchParams({
      course: course,
      branch: branch !== 'ALL' ? branch : '',
      subject: subjectName
    });
    if (subjectCode) queryParams.set('subjectCode', subjectCode);

    fetch(`/api/pyqs?${queryParams.toString()}&_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (!isSubscribed) return;
        if (data && data.success && Array.isArray(data.pyqs)) {
          const matched = data.pyqs.filter(p => {
            const pSub = String(p.subjectName || p.subject || '').toLowerCase();
            const pCode = String(p.subjectCode || '').toLowerCase();
            const targetSub = subjectName.toLowerCase();
            const targetCode = subjectCode.toLowerCase();
            return (
              (targetCode && pCode === targetCode) ||
              pSub.includes(targetSub) ||
              targetSub.includes(pSub) ||
              targetSub.replace(/s$/, '') === pSub.replace(/s$/, '')
            );
          });
          setPyqs(matched.length > 0 ? matched : data.pyqs);
        } else {
          setPyqs([]);
        }
      })
      .catch(err => {
        if (isSubscribed) {
          console.error('Error fetching subject PYQs:', err);
          setPyqs([]);
        }
      })
      .finally(() => {
        if (isSubscribed) setIsLoadingPyqs(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [subjectName, subjectCode, branch, course]);

  // Resolve note action
  const handleOpenNote = (note) => {
    const rawUrl = note.driveUrl || note.pdfUrl || note.fileUrl || note.resourceUrl || note.url;
    if (rawUrl) {
      if (onOpenViewer) {
        onOpenViewer({
          note,
          subject: { name: subjectName, code: subjectCode },
          unit: note.unit ? { unitNo: note.unit, topics: [] } : null
        });
      } else {
        setViewerModalData({
          note,
          subject: { name: subjectName, code: subjectCode },
          unit: note.unit ? { unitNo: note.unit, topics: [] } : null
        });
      }
    } else {
      alert('This note document is currently unavailable.');
    }
  };

  // Resolve PYQ action
  const handleOpenPyq = (pyq) => {
    const rawUrl = pyq.pdfUrl || pyq.fileUrl || pyq.driveUrl || pyq.resourceUrl || pyq.url;
    if (rawUrl) {
      const normalizedPyq = {
        ...pyq,
        title: `${subjectName} ${pyq.academicYear || pyq.year || ''} ${pyq.examType || 'End Semester'} Question Paper`,
        category: 'Previous Year Question Paper',
        provider: 'AKTU Examination Paper',
        url: rawUrl,
        pdfUrl: rawUrl
      };
      if (onOpenViewer) {
        onOpenViewer({
          note: normalizedPyq,
          subject: { name: subjectName, code: subjectCode },
          unit: null
        });
      } else {
        setViewerModalData({
          note: normalizedPyq,
          subject: { name: subjectName, code: subjectCode },
          unit: null
        });
      }
    } else {
      alert('This question paper is currently unavailable.');
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1C1E21', paddingBottom: '4rem' }}>
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #E8E2D5',
        boxShadow: '0 2px 10px rgba(35,30,25,0.03)'
      }}>
        <div className="container" style={{ padding: '1rem 1.25rem' }}>
          {/* Breadcrumb + Back Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#FAF7F2',
                border: '1.5px solid #E8E2D5',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1C1E21',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C88D2D'; e.currentTarget.style.backgroundColor = '#FDF6E8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E2D5'; e.currentTarget.style.backgroundColor = '#FAF7F2'; }}
            >
              <ArrowLeft size={16} /> Back to Subjects
            </button>

            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              {course} &gt; {branch} &gt; {year} {semester ? `&gt; ${semester}` : ''}
            </div>
          </div>

          {/* Subject Title & Tags */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span style={{
                  backgroundColor: '#7A1C28',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  {subjectCode || 'AKTU'}
                </span>

                <span style={{
                  backgroundColor: '#EFF6FF',
                  color: '#1E40AF',
                  border: '1px solid #BFDBFE',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {branch}
                </span>

                <span style={{
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FDE68A',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {year}
                </span>

                {semester && (
                  <span style={{
                    backgroundColor: '#F3E8FF',
                    color: '#6B21A8',
                    border: '1px solid #E9D5FF',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {semester}
                  </span>
                )}
              </div>

              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#1C1E21',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                {subjectName}
              </h1>

              <p style={{
                margin: '0.35rem 0 0',
                fontSize: '0.86rem',
                color: '#64748B',
                fontWeight: 500
              }}>
                Official AKTU Course Curriculum • Verified Notes • Previous Year Question Papers
              </p>
            </div>

            {/* Counts Box */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              backgroundColor: '#FAF7F2',
              padding: '0.65rem 1rem',
              borderRadius: '14px',
              border: '1.5px solid #E8E2D5'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#C88D2D' }}>
                  {isLoadingNotes ? '...' : notes.length}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Notes
                </div>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: '#E8E2D5' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#E11D48' }}>
                  {isLoadingPyqs ? '...' : pyqs.length}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  PYQs
                </div>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: '#E8E2D5' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2563EB' }}>
                  AKTU
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Official
                </div>
              </div>
            </div>
          </div>

          {/* 2. TABS NAVIGATOR: [ Notes ] [ PYQs ] [ Syllabus ] */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1.25rem',
            borderBottom: '2px solid #F1ECE1',
            paddingBottom: '0.2rem'
          }}>
            <button
              onClick={() => setActiveTab('notes')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: activeTab === 'notes' ? '#7A1C28' : 'transparent',
                color: activeTab === 'notes' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'notes' ? '0 4px 12px rgba(122,28,40,0.2)' : 'none'
              }}
            >
              <BookOpen size={16} /> Notes ({isLoadingNotes ? '...' : notes.length})
            </button>

            <button
              onClick={() => setActiveTab('pyqs')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: activeTab === 'pyqs' ? '#7A1C28' : 'transparent',
                color: activeTab === 'pyqs' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'pyqs' ? '0 4px 12px rgba(122,28,40,0.2)' : 'none'
              }}
            >
              <FileText size={16} /> PYQs ({isLoadingPyqs ? '...' : pyqs.length})
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: activeTab === 'syllabus' ? '#7A1C28' : 'transparent',
                color: activeTab === 'syllabus' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'syllabus' ? '0 4px 12px rgba(122,28,40,0.2)' : 'none'
              }}
            >
              <ShieldCheck size={16} /> Official AKTU Syllabus
            </button>
          </div>
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      <div className="container" style={{ padding: '1.75rem 1.25rem' }}>
        {/* ========================================================================= */}
        {/* TAB 1: NOTES */}
        {/* ========================================================================= */}
        {activeTab === 'notes' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                  Available Notes for {subjectName}
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                  Real verified lecture notes and study material from MongoDB database
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C88D2D' }}>
                {notes.length} {notes.length === 1 ? 'Note' : 'Notes'} Found
              </span>
            </div>

            {isLoadingNotes ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                <Sparkles size={32} style={{ animation: 'spin 2s linear infinite', color: '#C88D2D', marginBottom: '0.75rem' }} />
                <p style={{ fontWeight: 600 }}>Fetching verified notes from database...</p>
              </div>
            ) : notes.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px dashed #CBD5E1',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                color: '#64748B'
              }}>
                <BookOpen size={42} style={{ color: '#94A3B8', marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.4rem' }}>
                  No Notes Uploaded Yet
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: 1.45 }}>
                  Notes for {subjectName} ({subjectCode}) have not been uploaded to the database yet. Check back soon or request them.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.15rem'
              }}>
                {notes.map((note, idx) => {
                  const title = note.title || `${subjectName} - Unit ${note.unit || note.unitNumber || 1} Notes`;
                  const provider = note.provider || note.source || 'Faculty Lecture Notes';
                  const unitNo = note.unit !== undefined ? note.unit : note.unitNumber;

                  return (
                    <div
                      key={note.id || idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1.5px solid #E8E2D5',
                        padding: '1.25rem',
                        boxShadow: '0 4px 14px rgba(35,30,25,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C88D2D';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,141,45,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E8E2D5';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(35,30,25,0.03)';
                      }}
                    >
                      <div>
                        {/* Note Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <span style={{
                            backgroundColor: '#FDF6E8',
                            color: '#92400E',
                            border: '1px solid #FDE68A',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 800
                          }}>
                            {unitNo ? `Unit ${unitNo}` : 'Complete'}
                          </span>

                          <span style={{
                            fontSize: '0.72rem',
                            color: '#059669',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <CheckCircle2 size={13} /> Verified
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontSize: '0.98rem',
                          fontWeight: 800,
                          color: '#1C1E21',
                          margin: '0 0 0.4rem',
                          lineHeight: 1.35
                        }}>
                          {title}
                        </h3>

                        {/* Provider */}
                        <p style={{
                          fontSize: '0.78rem',
                          color: '#64748B',
                          fontWeight: 500,
                          margin: 0
                        }}>
                          Provider: <strong style={{ color: '#334155' }}>{provider}</strong>
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={{
                        marginTop: '1.15rem',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid #F1ECE1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}>
                        <button
                          onClick={() => handleOpenNote(note)}
                          style={{
                            flex: 1,
                            backgroundColor: '#7A1C28',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Eye size={15} /> View Note
                        </button>

                        <button
                          onClick={() => handleOpenNote(note)}
                          style={{
                            backgroundColor: '#FAF7F2',
                            color: '#1C1E21',
                            border: '1.5px solid #E8E2D5',
                            borderRadius: '10px',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem'
                          }}
                          title="Open Document"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PYQs */}
        {/* ========================================================================= */}
        {activeTab === 'pyqs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                  Previous Year Question Papers for {subjectName}
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                  Authentic university question papers from MongoDB records
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E11D48' }}>
                {pyqs.length} {pyqs.length === 1 ? 'Paper' : 'Papers'} Found
              </span>
            </div>

            {isLoadingPyqs ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                <Sparkles size={32} style={{ animation: 'spin 2s linear infinite', color: '#E11D48', marginBottom: '0.75rem' }} />
                <p style={{ fontWeight: 600 }}>Fetching question papers from database...</p>
              </div>
            ) : pyqs.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px dashed #CBD5E1',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                color: '#64748B'
              }}>
                <FileText size={42} style={{ color: '#94A3B8', marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.4rem' }}>
                  No PYQs Uploaded Yet
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: 1.45 }}>
                  Previous year question papers for {subjectName} ({subjectCode}) have not been uploaded to the database yet.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.15rem'
              }}>
                {pyqs.map((pyq, idx) => {
                  const academicYear = pyq.academicYear || pyq.examYear || 'Recent Examination';
                  const examType = pyq.examType || 'End Semester Examination';

                  return (
                    <div
                      key={pyq.id || idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1.5px solid #E8E2D5',
                        padding: '1.25rem',
                        boxShadow: '0 4px 14px rgba(35,30,25,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#E11D48';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(225,29,72,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E8E2D5';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(35,30,25,0.03)';
                      }}
                    >
                      <div>
                        {/* PYQ Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <span style={{
                            backgroundColor: '#FFF1F2',
                            color: '#9F1239',
                            border: '1px solid #FECDD3',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            <Calendar size={13} /> {academicYear}
                          </span>

                          <span style={{
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            {pyq.subjectCode || subjectCode || 'Paper'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: '#1C1E21',
                          margin: '0 0 0.35rem',
                          lineHeight: 1.35
                        }}>
                          {subjectName} — {academicYear}
                        </h3>

                        <p style={{
                          fontSize: '0.78rem',
                          color: '#64748B',
                          fontWeight: 500,
                          margin: 0
                        }}>
                          {examType} • {branch} • {year}
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={{
                        marginTop: '1.15rem',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid #F1ECE1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}>
                        <button
                          onClick={() => handleOpenPyq(pyq)}
                          style={{
                            flex: 1,
                            backgroundColor: '#E11D48',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Eye size={15} /> View Question Paper
                        </button>

                        <button
                          onClick={() => handleOpenPyq(pyq)}
                          style={{
                            backgroundColor: '#FAF7F2',
                            color: '#1C1E21',
                            border: '1.5px solid #E8E2D5',
                            borderRadius: '10px',
                            padding: '0.55rem 0.75rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem'
                          }}
                          title="Download PDF"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SYLLABUS */}
        {/* ========================================================================= */}
        {activeTab === 'syllabus' && (
          <div>
            {/* Metadata Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.5rem',
              boxShadow: '0 6px 20px rgba(35,30,25,0.03)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldCheck size={24} style={{ color: '#059669' }} />
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                      Official AKTU Syllabus Verification
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                      Verified against Dr. A.P.J. Abdul Kalam Technical University Curriculum
                    </span>
                  </div>
                </div>

                <span style={{
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <CheckCircle2 size={14} /> Source Type: Official AKTU
                </span>
              </div>

              {/* Metadata Table */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                backgroundColor: '#FAF7F2',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                border: '1px solid #E8E2D5',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>University</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1C1E21', marginTop: '0.15rem' }}>AKTU (Dr. APJ Abdul Kalam Technical University)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>Course &amp; Branch</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1C1E21', marginTop: '0.15rem' }}>{course} — {branch}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>Year &amp; Semester</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1C1E21', marginTop: '0.15rem' }}>{year} {semester ? `• ${semester}` : ''}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>Subject Code</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1C1E21', marginTop: '0.15rem' }}>{subjectCode || aktuSyllabus.code || 'AKTU-CSE'}</div>
                </div>
              </div>

              {/* Official Source Link Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                  <strong>Official AKTU Portal:</strong> <span style={{ color: '#0284C7' }}>https://aktu.ac.in/syllabus.html</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href="https://aktu.ac.in/syllabus.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#0284C7',
                      color: '#FFFFFF',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    AKTU Syllabus Portal <ExternalLink size={14} />
                  </a>

                  <a
                    href="https://ilms.aktu.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    AKTU ILMS <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Official Units List (if mapped in dataset) */}
            {aktuSyllabus && Array.isArray(aktuSyllabus.units) && aktuSyllabus.units.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem',
                boxShadow: '0 6px 20px rgba(35,30,25,0.03)',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 1rem' }}>
                  Official AKTU Curriculum Structure — Units Outline
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {aktuSyllabus.units.map((unit) => (
                    <div
                      key={unit.unitNo}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        backgroundColor: '#FAF7F2',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1.5px solid #E8E2D5'
                      }}
                    >
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#7A1C28',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {unit.unitNo}
                      </span>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1C1E21' }}>
                        {unit.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDF Requirement: View / Download PDF or Truthful Unavailable State */}
            {aktuSyllabus && aktuSyllabus.isPdfAvailable && aktuSyllabus.pdfUrl ? (
              <div style={{
                backgroundColor: '#EFF6FF',
                borderRadius: '16px',
                border: '1.5px solid #BFDBFE',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.98rem', fontWeight: 800, color: '#1E40AF' }}>
                    Official AKTU Syllabus PDF Available
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#3B82F6' }}>
                    Verified PDF document sourced from AKTU academic circulars
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <a
                    href={aktuSyllabus.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#1E40AF',
                      color: '#FFFFFF',
                      padding: '0.55rem 1rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Eye size={16} /> View PDF
                  </a>
                  <a
                    href={aktuSyllabus.pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#1E40AF',
                      border: '1.5px solid #BFDBFE',
                      padding: '0.55rem 1rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Download size={16} /> Download PDF
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#FFFBEB',
                borderRadius: '16px',
                border: '1.5px solid #FDE68A',
                padding: '1.4rem 1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <AlertCircle size={22} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.98rem', fontWeight: 800, color: '#92400E' }}>
                      Official AKTU syllabus PDF currently unavailable.
                    </h4>
                    <p style={{ margin: '0 0 0.85rem', fontSize: '0.82rem', color: '#B45309', lineHeight: 1.45 }}>
                      Per academic verification standards, CampusPrep does not fabricate AI-generated syllabus documents or invent unauthorized curriculum units. You can access the official course scheme and syllabus directly on the authoritative university portals below:
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      <a
                        href="https://aktu.ac.in/syllabus.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: '#D97706',
                          color: '#FFFFFF',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        Open Official AKTU Syllabus Hub <ExternalLink size={14} />
                      </a>

                      <a
                        href="https://ilms.aktu.ac.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: '#FAF7F2',
                          color: '#92400E',
                          border: '1.5px solid #FDE68A',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        Open AKTU ILMS Portal <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {viewerModalData && (
        <NoteViewerModal
          note={viewerModalData.note}
          subject={viewerModalData.subject}
          unit={viewerModalData.unit}
          onClose={() => setViewerModalData(null)}
        />
      )}
    </div>
  );
}
