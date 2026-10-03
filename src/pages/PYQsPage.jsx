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
import { pyqsData as localPyqsData, pyqsData } from '../data/pyqsData';
import { notesData } from '../data/notesData';
import { allCourses } from '../data/subjectsData';
import { trackPYQOpened } from '../utils/progressTracker';

// NORMALIZE FOR ALL 7 COURSES
export const normalizeCourse = (param) => {
  if (!param) return 'BTech';
  const p = String(param).toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
  const map = {
    'btech': 'BTech',
    'bca': 'BCA',
    'mtech': 'MTech',
    'mca': 'MCA',
    'mba': 'MBA',
    'bba': 'BBA',
    'bpharm': 'BPharm',
    'bpharma': 'BPharm',
    'bpharmacy': 'BPharm'
  };
  return map[p] || 'BTech';
};

export default function PYQsPage({ onNavigate, onOpenAuth, initialCourse = 'BTech', onSelectCourse }) {
  const getCourseParam = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('course');
      if (c) return c;
      const saved = localStorage.getItem('campusprep_selected_course');
      if (saved) return saved;
    } catch (e) {}
    return initialCourse || 'BTech';
  };

  let courseParam = getCourseParam();
  const normalizedCourse = normalizeCourse(courseParam);
  const courses = allCourses || {};
  const selectedCourseData = courses[normalizedCourse];

  // Course State for backward compatibility with child components
  const [selectedCourse, setSelectedCourse] = useState(normalizedCourse);

  // SAFE RENDERING FOR ALL
  const branches = Object.keys(selectedCourseData || {});
  const [activeBranch, setActiveBranch] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const b = params.get('branch');
      if (b && branches.includes(b)) return b;
    } catch (e) {}
    return branches[0] || 'CSE' || 'General';
  });

  useEffect(() => {
    if (!branches.includes(activeBranch)) {
      setActiveBranch(branches[0] || 'CSE' || 'General');
    }
  }, [normalizedCourse]);

  const yearsData = (selectedCourseData && selectedCourseData[activeBranch])
    ? selectedCourseData[activeBranch]
    : (branches[0] && selectedCourseData ? selectedCourseData[branches[0]] : {});
  const yearKeys = Object.keys(yearsData || {});
  const [activeYear, setActiveYear] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const y = params.get('year');
      if (y && yearKeys.includes(y)) return y;
    } catch (e) {}
    return yearKeys[0] || '1st Year';
  });

  useEffect(() => {
    if (!yearKeys.includes(activeYear)) {
      setActiveYear(yearKeys[0] || '1st Year');
    }
  }, [activeBranch, normalizedCourse]);

  const subjects = (yearsData && yearsData[activeYear]) ? yearsData[activeYear] : [];

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
    if (initialCourse && normalizeCourse(initialCourse) !== normalizeCourse(selectedCourse)) {
      setSelectedCourse(normalizeCourse(initialCourse));
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
    const norm = normalizeCourse(courseKey);
    setSelectedCourse(norm);
    try {
      localStorage.setItem('campusprep_selected_course', norm);
    } catch (e) {}
    if (onSelectCourse) onSelectCourse(norm);
    window.location.href = `/pyqs?course=${norm}`;
  };

  // Hero Search State
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  // Request PYQ Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestPyqInfo, setRequestPyqInfo] = useState(null);

  // Live Database PYQ Papers State with Local Fallback First
  const [dbPyqs, setDbPyqs] = useState(() => {
    try {
      const allLocal = Object.values(pyqsData).flat();
      return allLocal;
    } catch (e) {
      return [];
    }
  });

  // Fetch Live Data from Backend API with Local Fallback
  const loadLiveData = (courseKey) => {
    const c = courseKey || normalizedCourse || 'BTech';
    
    // STEP 1: ALWAYS load local first
    try {
      const localMatches = Object.values(pyqsData).flat();
      if (localMatches.length > 0) {
        setDbPyqs(localMatches);
      }
    } catch (e) {}

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
        const pyqList = Array.isArray(data) ? data : (data?.pyqs || []);
        if (pyqList.length > 0) {
          setDbPyqs(pyqList);
        }
      })
      .catch(err => console.log('Backend not available, keeping local fallback pyqs:', err));
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
      trackPYQOpened({
        pyqId: typeof pyqItem === 'object' ? (pyqItem.id || pyqItem._id || pyqItem.subjectName) : pyqItem,
        pyqName: typeof pyqItem === 'object' ? `${pyqItem.subjectName || pyqItem.subject || 'Paper'} (${pyqItem.academicYear || pyqItem.examYear || ''})` : 'Question Paper',
        subject: typeof pyqItem === 'object' ? (pyqItem.subjectName || pyqItem.subject || '') : '',
        course: selectedCourse || 'B.Tech',
        year: typeof pyqItem === 'object' ? (pyqItem.academicYear || pyqItem.examYear || '') : ''
      });
      window.open(driveUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('This paper is being processed. Please check back shortly.');
    }
  };

  if (!selectedCourseData) {
    const validCourses = Object.keys(courses).filter(c => !c.includes('.'));
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] bg-[#FAF7F2]">
        <h2 className="text-2xl font-black text-[#1F2421] mb-2">Course "{courseParam}" not found</h2>
        <p className="text-stone-600 mb-6">Available: {validCourses.join(', ')}</p>
        <div className="flex gap-2 justify-center flex-wrap max-w-lg">
          {validCourses.map(c => (
            <button key={c} onClick={() => window.location.href = `/pyqs?course=${c}`} className="px-5 py-2.5 bg-[#7A2327] hover:bg-[#5C1A1D] text-white rounded-xl font-bold shadow-md transition-all">{c}</button>
          ))}
        </div>
      </div>
    );
  }

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
            {['BTech', 'MTech', 'BCA', 'MCA', 'BBA', 'MBA', 'BPharm'].map(courseName => {
              const isSelected = normalizedCourse === courseName;
              return (
                <button
                  key={courseName}
                  onClick={() => handleCourseTabChange(courseName)}
                  style={{
                    padding: '0.45rem 1.25rem',
                    borderRadius: '9999px',
                    border: isSelected ? '2px solid #7A2327' : '1.5px solid #E8E2D5',
                    backgroundColor: isSelected ? '#7A2327' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#3A3530',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isSelected ? '0 4px 12px rgba(122,35,39,0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{courseName === 'BTech' ? 'B.Tech' : courseName === 'MTech' ? 'M.Tech' : courseName === 'BPharm' ? 'B.Pharm' : courseName}</span>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT: UNIFIED COURSE PYQS VIEW (Question Papers) */}
      <div className="container" style={{ padding: '1.25rem 1.25rem 3rem 1.25rem' }}>

        {/* Detailed PYQ workspace */}
        <CoursePyqsView
          courseKey={normalizedCourse}
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
