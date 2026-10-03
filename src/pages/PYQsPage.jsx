import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Check, 
  FileText,
  X,
  PlusCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import AllIzzWellBanner from '../components/AllIzzWellBanner';
import AcademicResourceBanner from '../components/AcademicResourceBanner';
import CoursePyqsView from '../components/CoursePyqsView';
import MobilePYQsScreen from '../components/MobilePYQsScreen';
import { COURSES } from '../data/coursesCatalog';
import { API_URL } from '../config/api';
import CourseSelectModal from '../components/CourseSelectModal';
import { COURSE_CONFIG, AVAILABLE_COURSES, normalizeCourseKey, normalizeYearStr, getYearsForCourse } from '../data/courseMapping.ts';

export default function PYQsPage({ onNavigate, onOpenAuth, initialCourse = 'BCA', onSelectCourse }) {
  // Course State: 'BCA' | 'BTech' | 'MCA' | 'MBA' | 'BPharma' | 'BBA' | 'MTech'
  const [selectedCourse, setSelectedCourse] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('course');
      if (c) return normalizeCourseKey(c);
      const saved = localStorage.getItem('campusprep_selected_course');
      if (saved) return normalizeCourseKey(saved);
    } catch (e) {}
    return normalizeCourseKey(initialCourse || 'BCA');
  });

  const [activeYear, setActiveYear] = useState('1st Year');
  const [activeBranch, setActiveBranch] = useState('CSE');

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
    if (initialCourse && normalizeCourseKey(initialCourse) !== normalizeCourseKey(selectedCourse)) {
      setSelectedCourse(normalizeCourseKey(initialCourse));
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
    const norm = normalizeCourseKey(courseKey);
    setSelectedCourse(norm);
    try {
      localStorage.setItem('campusprep_selected_course', norm);
    } catch (e) {}
    if (onSelectCourse) onSelectCourse(norm);

    if (norm === 'BTech' || norm === 'B.Tech') {
      setActiveBranch('CSE');
      setActiveYear('1st Year');
      updateUrlParams({ course: 'BTech', branch: 'CSE', year: '1st Year', semester: null, subject: null, academicYear: null, examType: null });
    } else {
      const years = getYearsForCourse(norm);
      const defaultYear = years[0] || '1st Year';
      setActiveYear(defaultYear);
      updateUrlParams({ course: norm, branch: null, year: defaultYear, semester: null, subject: null, academicYear: null, examType: null });
    }
  };

  // Hero Search State
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  // Request PYQ Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestPyqInfo, setRequestPyqInfo] = useState(null);

  // Live Database PYQ Papers State (from Backend API)
  const [dbPyqs, setDbPyqs] = useState([]);

  // Fetch Live Data from Backend API
  const loadLiveData = (courseKey) => {
    const c = courseKey || selectedCourse || 'B.Tech';
    fetch(`${API_URL}/api/pyqs?course=${encodeURIComponent(c)}&_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(res => {
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) {
          throw new Error('Backend server not available');
        }
        return res.json();
      })
      .then(data => {
        console.log("API URL", API_URL, "Response", data);
        if (data.success && Array.isArray(data.pyqs)) {
          setDbPyqs(data.pyqs);
        }
      })
      .catch(err => console.error('Error fetching backend PYQs:', err));
  };

  useEffect(() => {
    loadLiveData(selectedCourse);
  }, [selectedCourse]);

  // Handle Opening PDF
  const handleOpenPdf = (pyqItem) => {
    if (!pyqItem) return;
    const driveUrl = typeof pyqItem === 'string' 
      ? pyqItem 
      : (pyqItem.pdfUrl || pyqItem.fileUrl || pyqItem.driveUrl || pyqItem.resourceUrl || pyqItem.url);

    if (driveUrl) {
      window.open(driveUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('This paper is being processed. Please check back shortly.');
    }
  };

  return (
    <>
      <div className="pv-mobile-pyqs-view">
        <MobilePYQsScreen
          courseKey={selectedCourse}
          selectedYearProp={activeYear}
          selectedBranchProp={activeBranch}
          dbPyqs={dbPyqs}
          onSelectCourse={handleCourseTabChange}
          onSelectYear={(y) => setActiveYear(y)}
          onSelectBranch={(b) => setActiveBranch(b)}
          onOpenPdf={handleOpenPdf}
          onRequestPyq={(subject, year) => {
            setRequestPyqInfo({
              subject: subject?.name || subject?.subject || 'Subject',
              code: subject?.code || '',
              year: year || '1st Year'
            });
            setIsRequestModalOpen(true);
          }}
        />
      </div>

      <div className="pv-desktop-pyqs-view" style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1C1E21' }}>
        
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
            {COURSES.map(c => {
              const isSelected = selectedCourse === c.key;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCourseTabChange(c.key)}
                  style={{
                    padding: '0.42rem 1.15rem',
                    borderRadius: '9999px',
                    border: isSelected ? `2px solid ${c.btnColor}` : '1.5px solid #E8E2D5',
                    backgroundColor: isSelected ? c.btnColor : '#ffffff',
                    color: isSelected ? '#ffffff' : '#3A3530',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isSelected ? `0 4px 12px ${c.badgeColor}30` : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{c.name}</span>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. HERO BANNER */}
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
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '250px 1fr 320px',
            gap: '1.25rem',
            alignItems: 'center'
          }} className="pyqs-hero-grid">

            {/* LEFT MASCOT */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="pyqs-left-mascot">
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '0.6rem 0.85rem', marginBottom: '0.5rem',
                border: '2px solid #C88D2D', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', fontSize: '0.85rem', fontWeight: 700,
                color: '#1C1E21', fontFamily: "'Kalam', cursive", lineHeight: 1.3, textAlign: 'center', position: 'relative'
              }}>
                "AKTU PYQs Available! <br />
                Direct PDF Download" <br />
                <span style={{ color: '#C88D2D' }}>— ProfessorVirus</span>
                <div style={{
                  position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                  width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '10px solid #C88D2D'
                }} />
              </div>

              <div style={{ width: '240px', height: '200px', position: 'relative', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))' }}>
                <img
                  src="/assets/hero_board.png"
                  alt="AKTU Question Paper Bank"
                  loading="eager"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/pyq_hero_students.png';
                  }}
                />
              </div>
            </div>

            {/* CENTER TITLE & SEARCH */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: '3.4rem', fontWeight: 900, color: '#1F2421',
                  lineHeight: 1.1, letterSpacing: '-0.02em'
                }}>
                  Previous Year Exam
                </h1>
                <FileText size={42} style={{ color: '#C88D2D' }} />
              </div>

              <div style={{ fontFamily: "'Kalam', cursive", color: '#7A5835', fontSize: '1.35rem', fontWeight: 700 }}>
                Real AKTU B.Tech Question Papers (2017–2026)
              </div>

              <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, maxWidth: '520px' }}>
                Select Branch → Select B.Tech Year → Select Subject → Academic Session
              </p>

              {/* SEARCH BAR */}
              <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%', maxWidth: '540px', position: 'relative', marginTop: '0.75rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '9999px',
                  padding: '0.35rem 0.4rem 0.35rem 1.25rem', boxShadow: '0 8px 25px rgba(0,0,0,0.08)', border: '1px solid #E8E2D5'
                }}>
                  <Search size={18} style={{ color: '#7A5835', marginRight: '0.6rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search PYQs by subject name or code (e.g. KCS-101)..."
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.92rem', color: '#1C1E21', fontWeight: 500, backgroundColor: 'transparent' }}
                  />
                  {heroSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setHeroSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 0.5rem', display: 'flex', alignItems: 'center' }}
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
            <AllIzzWellBanner title={"Exams Crack Karna Hai?\nReal PYQs Solve Karo! :)"} className="pyqs-right-mascot" />

          </div>
        </div>
      </section>

      {/* 2. MAIN WORKSPACE: UNIFIED MODERN COURSE PYQS VIEW */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem 1.25rem' }}>
        <CoursePyqsView
          courseKey={selectedCourse}
          dbPyqs={dbPyqs}
          onOpenPdf={handleOpenPdf}
          onRequestPyq={(subject, year) => {
            setRequestPyqInfo({
              subject: subject?.name || subject?.subject || 'Subject',
              code: subject?.code || '',
              year: year || '1st Year'
            });
            setIsRequestModalOpen(true);
          }}
          onOpenAuth={onOpenAuth}
          initialSearchQuery={heroSearchQuery}
          onNavigate={onNavigate}
        />
      </div>

      {/* 3. BOTTOM ACADEMIC RESOURCE BANNER */}
      <AcademicResourceBanner onNavigate={onNavigate} />
    </div>

      {/* REQUEST PYQ MODAL */}
      {isRequestModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '2px solid #E8E2D5',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsRequestModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                border: '2px solid #FCD34D',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#92400E',
                marginBottom: '0.75rem'
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.35rem 0' }}>
                Request Question Paper
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                Requesting PYQs for <strong>{requestPyqInfo?.subject || 'Subject'}</strong> ({requestPyqInfo?.code || requestPyqInfo?.year || 'AKTU'})
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                  Target Academic Session / Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2023-2024 or 2024-2025"
                  defaultValue="2023-2024"
                  id="request-session-input"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                  Notes or Details (Optional)
                </label>
                <textarea
                  placeholder="e.g. Need End Semester solved paper..."
                  rows={3}
                  id="request-notes-input"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FAF7F2',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const session = document.getElementById('request-session-input')?.value || 'Recent';
                    alert(`Request received for ${requestPyqInfo?.subject} (${session})! Our contributors will verify and upload it soon.`);
                    setIsRequestModalOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#1F2421',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer'
                  }}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COURSE SELECT MODAL */}
      <CourseSelectModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        targetTab="pyqs"
        onSelectCourse={(c) => {
          handleCourseTabChange(c);
          setIsCourseModalOpen(false);
        }}
      />

    </>
  );
}
