import React, { useState } from 'react';
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
  File
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

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
  const subjectName = subjectData?.name || subjectData?.title || 'Operating System';
  const subjectCode = subjectData?.code || 'BCS202';
  const courseName = subjectData?.course || selectedCourse || 'B.Tech';
  const branchName = subjectData?.branch || selectedBranch || 'CSE';
  const yearName = subjectData?.year || selectedYear || '2nd Year';

  const notesList = [
    {
      unit: 1,
      title: 'Unit 1',
      desc: 'Introduction to OS',
      size: '2.4 MB',
      color: 'bg-red-50 text-red-600 border-red-200',
      iconBg: 'bg-rose-100 text-rose-600',
      topics: [
        'Introduction, Evolution of Operating System',
        'Operating System Structure & Operations',
        'Process Management, Memory Management',
        'Storage Management, Protection & Security',
        'Computing Environments, Open Source OS'
      ]
    },
    {
      unit: 2,
      title: 'Unit 2',
      desc: 'Process Management',
      size: '3.1 MB',
      color: 'bg-red-50 text-red-600 border-red-200',
      iconBg: 'bg-rose-100 text-rose-600',
      topics: [
        'Process Concept, Process Scheduling, Operations',
        'Interprocess Communication (IPC)',
        'Overview of Threads, Multicore Programming',
        'Multithreading Models & Thread Libraries'
      ]
    },
    {
      unit: 3,
      title: 'Unit 3',
      desc: 'CPU Scheduling',
      size: '2.8 MB',
      color: 'bg-red-50 text-red-600 border-red-200',
      iconBg: 'bg-rose-100 text-rose-600',
      topics: [
        'Basic Concepts, Scheduling Criteria',
        'FCFS, SJF, Priority Scheduling, Round Robin',
        'Multilevel Queue & Feedback Queue Scheduling',
        'Thread Scheduling & Multi-Processor Scheduling'
      ]
    },
    {
      unit: 4,
      title: 'Unit 4',
      desc: 'Memory Management',
      size: '2.6 MB',
      color: 'bg-red-50 text-red-600 border-red-200',
      iconBg: 'bg-rose-100 text-rose-600',
      topics: [
        'Swapping, Contiguous Memory Allocation',
        'Segmentation and Paging Architectures',
        'Virtual Memory, Demand Paging, Copy-on-Write',
        'Page Replacement Algorithms (FIFO, LRU, Optimal)',
        'Allocation of Frames, Thrashing'
      ]
    },
    {
      unit: 5,
      title: 'Unit 5',
      desc: 'File System',
      size: '3.0 MB',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      topics: [
        'File Concept, Access Methods, Directory Structure',
        'File-System Mounting, File Sharing & Protection',
        'Allocation Methods (Contiguous, Chained, Indexed)',
        'Free-Space Management & Disk Scheduling (SCAN, C-SCAN)'
      ]
    }
  ];

  const pyqList = [
    {
      year: 'AKTU 2024',
      size: '1.4 MB',
      questions: '32 Questions',
      color: 'bg-rose-100 text-rose-600'
    },
    {
      year: 'AKTU 2023',
      size: '1.2 MB',
      questions: '28 Questions',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      year: 'AKTU 2022',
      size: '1.3 MB',
      questions: '30 Questions',
      color: 'bg-amber-100 text-amber-700'
    },
    {
      year: 'AKTU 2021',
      size: '1.1 MB',
      questions: '26 Questions',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      year: 'AKTU 2020',
      size: '1.6 MB',
      questions: '32 Questions',
      color: 'bg-sky-100 text-sky-600'
    }
  ];

  const toggleUnit = (unit) => {
    setExpandedUnits(prev => ({ ...prev, [unit]: !prev[unit] }));
  };

  const handleDownload = (item) => {
    setDownloadSuccess(item);
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
    <div className="min-h-screen bg-[#FFF7ED] w-full max-w-[430px] mx-auto md:max-w-md lg:max-w-lg relative overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814] shadow-2xl flex flex-col pb-24">
      
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
        <div className="px-5 pt-3 pb-2 z-10">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={onBack || (() => onNavigate('select-subject'))} 
              className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="p-1 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Share"
              >
                <Share2 size={19} />
              </button>
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1 transition-colors cursor-pointer ${bookmarked ? 'text-[#7A2327] fill-current' : 'text-stone-700 hover:text-stone-900'}`}
                aria-label="Bookmark"
              >
                <Bookmark size={19} className={bookmarked ? 'fill-[#7A2327]' : ''} />
              </button>
            </div>
          </div>

          {/* Title & Hierarchy Breadcrumb */}
          <div className="mb-3">
            <h1 className="font-['Outfit',sans-serif] font-bold text-2xl text-stone-900 leading-tight">
              {subjectName}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mt-1">
              <GraduationCap size={15} className="text-[#7A2327]" />
              <span>{courseName} &gt; {branchName} &gt; {yearName}</span>
            </div>
          </div>

          {/* Screen 5 Hero Banner Illustration */}
          <div className="w-full h-36 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100/60 shadow-sm flex items-center justify-center p-2 mb-2">
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
        <div className="px-5 pt-3 pb-3 z-10">
          <div className="flex items-center justify-between mb-1">
            <button 
              onClick={onBack || (() => onNavigate('select-subject'))} 
              className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="text-center flex-1 mx-2">
              <h1 className="font-['Outfit',sans-serif] font-bold text-xl text-stone-900 leading-tight">
                {subjectName}
              </h1>
              <span className="text-[11px] text-stone-500 font-medium">
                {subjectCode} • {courseName} {branchName} • {yearName}
              </span>
            </div>

            <button 
              onClick={() => alert(`Search within ${subjectName}`)} 
              className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 3 TABS PILL TOGGLE (Notes / PYQs / Syllabus) */}
      <div className="px-5 mb-4 z-10">
        <div className="bg-[#EFEAE2] p-1 rounded-full flex items-center shadow-inner">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all text-center cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#7A2327] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('pyqs')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all text-center cursor-pointer ${
              activeTab === 'pyqs'
                ? 'bg-[#7A2327] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            PYQs
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
      <div className="px-5 flex-1 z-10">

        {/* ===================== TAB 1: NOTES (SCREEN 5) ===================== */}
        {activeTab === 'notes' && (
          <div>
            {/* Header: Unit-wise Notes (5) + Download All */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900">
                Unit-wise Notes ({notesList.length})
              </span>
              <button 
                onClick={() => handleDownload('All Unit Notes ZIP')}
                className="text-xs font-bold text-[#7A2327] hover:underline cursor-pointer flex items-center gap-1"
              >
                Download All
              </button>
            </div>

            {/* List of 5 Unit Cards */}
            <div className="space-y-2.5">
              {notesList.map((item) => (
                <div 
                  key={item.unit}
                  className="bg-white rounded-2xl p-3 border border-orange-100/70 shadow-xs flex items-center justify-between hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* PDF Icon Badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${item.iconBg}`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        {item.title}
                      </div>
                      <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900">
                        {item.desc}
                      </div>
                      <div className="text-[11px] text-stone-400 font-medium">
                        PDF • {item.size}
                      </div>
                    </div>
                  </div>

                  {/* Download Action */}
                  <button 
                    onClick={() => handleDownload(item.desc)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A2327] hover:bg-rose-50 transition-colors cursor-pointer"
                    aria-label={`Download ${item.title}`}
                  >
                    <Download size={18} strokeWidth={2.2} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: PYQS (SCREEN 6) ===================== */}
        {activeTab === 'pyqs' && (
          <div>
            {/* Header: Previous Year Questions (18) + Filter */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900">
                Previous Year Questions (18)
              </span>
              <button 
                onClick={() => alert('Filter PYQs: 2024 to 2018 End-Sem & Mid-Sem')}
                className="bg-white border border-stone-200/90 rounded-full px-2.5 py-1 flex items-center gap-1 text-[11px] font-semibold text-stone-700 shadow-xs hover:bg-stone-50 cursor-pointer"
              >
                <Filter size={12} />
                <span>Filter</span>
              </button>
            </div>

            {/* List of PYQ Cards */}
            <div className="space-y-2.5">
              {pyqList.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-3 border border-orange-100/70 shadow-xs flex items-center justify-between hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${item.color}`}>
                      <File size={20} />
                    </div>
                    <div>
                      <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900">
                        {item.year}
                      </div>
                      <div className="text-[11px] text-stone-400 font-medium">
                        PDF • {item.size} • {item.questions}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDownload(item.year)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A2327] hover:bg-rose-50 transition-colors cursor-pointer"
                    aria-label={`Download ${item.year}`}
                  >
                    <Download size={18} strokeWidth={2.2} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: SYLLABUS (SCREEN 7) ===================== */}
        {activeTab === 'syllabus' && (
          <div>
            {/* 1. Official Syllabus Card */}
            <div className="mb-4">
              <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900 mb-2">
                Official Syllabus
              </div>
              <div className="bg-white rounded-2xl p-3 border border-orange-100/70 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-rose-100 text-rose-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900">
                      AKTU Syllabus 2024
                    </div>
                    <div className="text-[11px] text-stone-400 font-medium">
                      PDF • 0.9 MB
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleDownload('Official Syllabus 2024')}
                  className="bg-[#7A2327] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs hover:bg-[#631c20] transition-colors cursor-pointer"
                >
                  Download
                </button>
              </div>
            </div>

            {/* 2. Syllabus Topics Accordion */}
            <div>
              <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900 mb-2">
                Syllabus Topics
              </div>
              <div className="space-y-2">
                {notesList.map((item) => {
                  const isExpanded = !!expandedUnits[item.unit];
                  return (
                    <div 
                      key={item.unit}
                      className="bg-white rounded-2xl border border-orange-100/70 shadow-xs overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleUnit(item.unit)}
                        className="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-stone-50/50"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText size={16} className="text-stone-400" />
                          <span className="font-['Outfit',sans-serif] font-bold text-xs text-stone-800">
                            Unit {item.unit}: {item.desc}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-stone-400" />
                        ) : (
                          <ChevronDown size={16} className="text-stone-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-3 pt-1 border-t border-stone-100 bg-[#FDFBF9] text-xs text-stone-600 space-y-1.5">
                          {item.topics.map((t, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
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
          <span>Downloading {downloadSuccess}...</span>
        </div>
      )}

    </div>
  );
}
