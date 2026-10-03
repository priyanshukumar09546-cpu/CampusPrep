import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Search, 
  GraduationCap, 
  Download, 
  FileText, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  File,
  ExternalLink
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { notesData as localNotesData } from '@/data/notesData';
import { pyqsData as localPyqsData } from '@/data/pyqsData';
import { API_URL } from '@/config/api';

export default function SubjectDetailPage({ 
  subjectData, 
  initialTab = 'notes',
  onBack, 
  onNavigate 
}) {
  const { selectedCourse, selectedYear, selectedBranch } = useCourse();
  const [activeTab, setActiveTab] = useState(initialTab); // 'notes' | 'pyqs' | 'syllabus'
  const [bookmarked, setBookmarked] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState({ 1: true });
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // Subject details fallback
  const getSubjectCode = () => {
    if (subjectData?.code) return subjectData.code;
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('code');
      if (q) return q;
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      if (path.startsWith('subject/')) {
        const seg = path.split('/')[1];
        if (seg) return decodeURIComponent(seg);
      }
    } catch (e) {}
    return 'BCS301';
  };

  const code = getSubjectCode();
  const subjectName = subjectData?.name || subjectData?.title || (code === 'BCS301' ? 'Data Structure' : `${code} - Subject Notes`);
  const courseName = subjectData?.course || selectedCourse || 'B.Tech';
  const branchName = subjectData?.branch || selectedBranch || 'CSE';
  const yearName = subjectData?.year || selectedYear || '2nd Year';

  // Local-first resilient state initialization
  const [notes, setNotes] = useState(() => {
    const local = localNotesData[code] || localNotesData[code?.toUpperCase()] || localNotesData[code?.toLowerCase()] || [];
    return local;
  });

  const [pyqs, setPyqs] = useState(() => {
    const local = localPyqsData[code] || localPyqsData[code?.toUpperCase()] || localPyqsData[code?.toLowerCase()] || [];
    return local;
  });

  // STEP 1: FORCE LOCAL FALLBACK ON PRODUCTION (Most Important)
  useEffect(() => {
    const loadData = async () => {
      // STEP 1: ALWAYS load local first (instant, works offline)
      const localNotes = localNotesData[code] || localNotesData[code?.toUpperCase()] || localNotesData[code?.toLowerCase()] || [];
      const localPyqs = localPyqsData[code] || localPyqsData[code?.toUpperCase()] || localPyqsData[code?.toLowerCase()] || [];

      console.log(`[LOCAL] Subject ${code}: ${localNotes.length} notes, ${localPyqs.length} pyqs`);

      if (localNotes.length > 0) {
        setNotes(localNotes);
        setPyqs(localPyqs);
        // Still try API in background to update, but don't blank if API fails
        try {
          const res = await fetch(`${API_URL}/api/notes?subject=${code}`);
          const apiData = await res.json();
          const apiNotes = Array.isArray(apiData) ? apiData : (apiData?.notes || []);
          if (apiNotes && apiNotes.length > 0) {
            console.log(`[API] Got ${apiNotes.length} notes, merging`);
            setNotes(apiNotes); // Update if API has newer
          }
        } catch (e) {
          console.log("[API] Failed, keeping local data", e);
        }
        return;
      }

      // STEP 2: If no local, try API
      try {
        const res = await fetch(`${API_URL}/api/notes?subject=${code}`);
        const apiData = await res.json();
        const apiNotes = Array.isArray(apiData) ? apiData : (apiData?.notes || []);
        if (apiNotes && apiNotes.length > 0) {
          setNotes(apiNotes);
        } else {
          setNotes([]); // Show empty state
        }
      } catch (e) {
        console.error("Both local and API failed for", code);
        setNotes([]);
      }
    };
    loadData();
  }, [code]);

  const toggleUnit = (unit) => {
    setExpandedUnits(prev => ({ ...prev, [unit]: !prev[unit] }));
  };

  const handleOpenResource = (item) => {
    const url = item?.pdfUrl || item?.driveUrl || item?.url || item?.fileUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    setDownloadSuccess(item?.title || item?.year || 'Resource');
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${subjectName} - ProfessorVirus Notes & PYQs`,
        text: `Check out ${subjectName} unit notes, PYQs, and syllabus on ProfessorVirus!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 relative overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814] flex flex-col pb-24">
      
      {/* Corner Leaves Decoration */}
      <div 
        className="absolute top-0 left-0 w-24 h-24 pointer-events-none opacity-40 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-top.png")' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-40 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-bottom.png")' }}
      />

      {/* HEADER SECTION - Conditional based on Tab */}
      {activeTab === 'notes' ? (
        /* SCREEN 5 HEADER: With Share & Bookmark Icons */
        <div className="pt-2 pb-2 z-10">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={onBack || (() => onNavigate ? onNavigate('notes') : window.history.back())} 
              className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5 font-medium text-sm"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Share"
              >
                <Share2 size={19} />
              </button>
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1.5 transition-colors cursor-pointer ${bookmarked ? 'text-[#7A2327] fill-current' : 'text-stone-700 hover:text-stone-900'}`}
                aria-label="Bookmark"
              >
                <Bookmark size={19} className={bookmarked ? 'fill-[#7A2327]' : ''} />
              </button>
            </div>
          </div>

          {/* Title & Hierarchy Breadcrumb */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#7A2327]/10 text-[#7A2327] font-bold text-xs px-2.5 py-0.5 rounded-full">
                {code}
              </span>
              <span className="text-xs text-stone-500 font-medium">Official Curriculum</span>
            </div>
            <h1 className="font-['Outfit',sans-serif] font-bold text-2xl md:text-3xl text-stone-900 leading-tight mt-1">
              {subjectName}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mt-1">
              <GraduationCap size={15} className="text-[#7A2327]" />
              <span>{courseName} &gt; {branchName} &gt; {yearName}</span>
            </div>
          </div>

          {/* Screen 5 Hero Banner Illustration */}
          <div className="w-full h-36 md:h-44 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100/60 shadow-sm flex items-center justify-center p-3 mb-2">
            <img 
              src="/assets/os_header_illustration.png" 
              alt={`${subjectName} visual hero`}
              className="h-full w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.src = '/assets/home_hero_banner.png';
              }}
            />
          </div>
        </div>
      ) : (
        /* SCREEN 6 & SCREEN 7 HEADER: With Search Icon & Compact Subtitle */
        <div className="pt-2 pb-3 z-10">
          <div className="flex items-center justify-between mb-1">
            <button 
              onClick={onBack || (() => onNavigate ? onNavigate('notes') : window.history.back())} 
              className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="text-center flex-1 mx-2">
              <h1 className="font-['Outfit',sans-serif] font-bold text-xl md:text-2xl text-stone-900 leading-tight">
                {subjectName}
              </h1>
              <span className="text-xs text-stone-500 font-medium">
                {code} • {courseName} {branchName} • {yearName}
              </span>
            </div>

            <button 
              onClick={() => alert(`Search active for ${subjectName}`)} 
              className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 3 TABS PILL TOGGLE (Notes / PYQs / Syllabus) */}
      <div className="mb-4 z-10">
        <div className="bg-[#EFEAE2] p-1 rounded-full flex items-center shadow-inner max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all text-center cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#7A2327] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('pyqs')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all text-center cursor-pointer ${
              activeTab === 'pyqs'
                ? 'bg-[#7A2327] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            PYQs ({pyqs.length})
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all text-center cursor-pointer ${
              activeTab === 'syllabus'
                ? 'bg-[#7A2327] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Syllabus
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 z-10">

        {/* ===================== TAB 1: NOTES (SCREEN 5) ===================== */}
        {activeTab === 'notes' && (
          <div>
            {/* Header: Unit-wise Notes + Download All */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-['Outfit',sans-serif] font-bold text-sm md:text-base text-stone-900">
                Unit-wise Notes ({notes.length} Units Available)
              </span>
              <button 
                onClick={() => handleOpenResource(notes[0])}
                className="text-xs font-bold text-[#7A2327] hover:underline cursor-pointer flex items-center gap-1"
              >
                Download Top Note
              </button>
            </div>

            {/* List of Unit Cards */}
            {notes.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-orange-100 text-center">
                <FileText size={36} className="mx-auto text-stone-400 mb-2" />
                <p className="font-bold text-stone-700">Loading notes for {code}...</p>
                <p className="text-xs text-stone-500 mt-1">If empty, check back shortly or explore PYQs.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((item, idx) => (
                  <div 
                    key={item.id || item.unit || idx}
                    className="bg-white rounded-2xl p-4 border border-orange-100/70 shadow-xs flex items-center justify-between hover:border-orange-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      {/* PDF Icon Badge */}
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs bg-rose-100 text-rose-600 flex-shrink-0">
                        <FileText size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#7A2327] uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded">
                            Unit {item.unit || (idx + 1)}
                          </span>
                          <span className="text-[11px] text-stone-400 font-medium">
                            PDF • {item.size || '2.8 MB'}
                          </span>
                        </div>
                        <div className="font-['Outfit',sans-serif] font-bold text-sm sm:text-base text-stone-900 mt-0.5 group-hover:text-[#7A2327] transition-colors">
                          {item.title}
                        </div>
                        {item.desc && (
                          <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                            {item.desc}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Download / Open Action */}
                    <button 
                      onClick={() => handleOpenResource(item)}
                      className="px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-white bg-[#7A2327] hover:bg-[#631c20] transition-colors cursor-pointer flex-shrink-0 shadow-sm ml-2"
                      aria-label={`Open ${item.title}`}
                    >
                      <Download size={14} strokeWidth={2.4} />
                      <span className="hidden sm:inline">View PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: PYQS (SCREEN 6) ===================== */}
        {activeTab === 'pyqs' && (
          <div>
            {/* Header: Previous Year Questions + Filter */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-['Outfit',sans-serif] font-bold text-sm md:text-base text-stone-900">
                Previous Year Papers ({pyqs.length} Papers)
              </span>
              <button 
                onClick={() => alert(`Showing all available papers for ${code}`)}
                className="bg-white border border-stone-200/90 rounded-full px-3 py-1 flex items-center gap-1 text-xs font-semibold text-stone-700 shadow-xs hover:bg-stone-50 cursor-pointer"
              >
                <Filter size={12} />
                <span>AKTU Papers</span>
              </button>
            </div>

            {/* List of PYQ Cards */}
            {pyqs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-orange-100 text-center">
                <File size={36} className="mx-auto text-stone-400 mb-2" />
                <p className="font-bold text-stone-700">No PYQs recorded for {code}</p>
                <p className="text-xs text-stone-500 mt-1">Check back shortly as new session papers are synchronized.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pyqs.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="bg-white rounded-2xl p-4 border border-orange-100/70 shadow-xs flex items-center justify-between hover:border-orange-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs ${item.color || 'bg-blue-100 text-blue-600'} flex-shrink-0`}>
                        <File size={22} />
                      </div>
                      <div>
                        <div className="font-['Outfit',sans-serif] font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#7A2327] transition-colors">
                          {item.year || `AKTU ${item.examYear || 'Paper'}`}
                        </div>
                        <div className="text-xs text-stone-500 font-medium">
                          {item.session ? `${item.session} • ` : ''}PDF • {item.size || '1.3 MB'} • {item.questions || 'Solved Paper'}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenResource(item)}
                      className="px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-white bg-[#7A2327] hover:bg-[#631c20] transition-colors cursor-pointer flex-shrink-0 shadow-sm ml-2"
                      aria-label={`Open ${item.year}`}
                    >
                      <Download size={14} strokeWidth={2.4} />
                      <span className="hidden sm:inline">Open Paper</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: SYLLABUS (SCREEN 7) ===================== */}
        {activeTab === 'syllabus' && (
          <div>
            {/* 1. Official Syllabus Card */}
            <div className="mb-4">
              <div className="font-['Outfit',sans-serif] font-bold text-sm md:text-base text-stone-900 mb-2">
                Official Syllabus
              </div>
              <div className="bg-white rounded-2xl p-4 border border-orange-100/70 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs bg-rose-100 text-rose-600 flex-shrink-0">
                    <FileText size={22} />
                  </div>
                  <div>
                    <div className="font-['Outfit',sans-serif] font-bold text-sm sm:text-base text-stone-900">
                      {subjectName} — Syllabus
                    </div>
                    <div className="text-xs text-stone-500 font-medium">
                      Code: {code} • 5 Units Full Outline
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleOpenResource(notes[0])}
                  className="bg-[#7A2327] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs hover:bg-[#631c20] transition-colors cursor-pointer"
                >
                  View Outline
                </button>
              </div>
            </div>

            {/* 2. Syllabus Topics Accordion */}
            <div>
              <div className="font-['Outfit',sans-serif] font-bold text-sm md:text-base text-stone-900 mb-2">
                Unit Breakdown & Topics
              </div>
              <div className="space-y-2.5">
                {(notes.length > 0 ? notes : [1, 2, 3, 4, 5].map(u => ({ unit: u, title: `Unit ${u}`, desc: `Topics for Unit ${u}`, topics: ['Fundamental concepts & theory', 'Applied models & algorithms'] }))).map((item, idx) => {
                  const unitNum = item.unit || (idx + 1);
                  const isExpanded = !!expandedUnits[unitNum];
                  const topicsList = item.topics && item.topics.length > 0 ? item.topics : [
                    'Theoretical Foundations & Mathematical Formulations',
                    'Architectural Principles & Modular Design',
                    'Algorithmic Complexity & Execution Steps',
                    'Empirical Analysis & Previous Year Examination Problems'
                  ];

                  return (
                    <div 
                      key={unitNum}
                      className="bg-white rounded-2xl border border-orange-100/70 shadow-xs overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleUnit(unitNum)}
                        className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-stone-50/50"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText size={17} className="text-[#7A2327]" />
                          <span className="font-['Outfit',sans-serif] font-bold text-xs sm:text-sm text-stone-800">
                            Unit {unitNum}: {item.title || item.desc}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-stone-400" />
                        ) : (
                          <ChevronDown size={16} className="text-stone-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-3.5 pt-1 border-t border-stone-100 bg-[#FDFBF9] text-xs text-stone-600 space-y-2">
                          {topicsList.map((t, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-2">
                              <span className="text-[#7A2327] font-bold">•</span>
                              <span className="leading-snug">{t}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Toast for Downloads */}
      {downloadSuccess && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <Check size={14} className="text-emerald-400" />
          <span>Opening {downloadSuccess}...</span>
        </div>
      )}

    </div>
  );
}
