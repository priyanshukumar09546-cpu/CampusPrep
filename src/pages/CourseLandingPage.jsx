import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Layers, 
  Download, 
  CheckCircle2, 
  GraduationCap, 
  Calendar, 
  Sparkles,
  HelpCircle,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { COURSE_CONFIG, AVAILABLE_COURSES, normalizeCourseKey, normalizeYearStr } from '../data/courseMapping.ts';
import { 
  courseKeyToSlug, 
  yearToSlug, 
  semToSlug, 
  getCourseUrl, 
  getYearUrl, 
  getSemesterUrl, 
  getSubjectCodeUrl 
} from '../utils/academicUrls';

export default function CourseLandingPage({ 
  courseKey = 'BTech',
  yearParam = null, 
  semParam = null,
  onNavigate,
  onSelectSubject
}) {
  const normKey = normalizeCourseKey(courseKey) || 'BTech';
  const courseMeta = AVAILABLE_COURSES.find(c => c.key === normKey) || {
    key: normKey,
    name: normKey,
    fullName: normKey,
    badgeColor: '#7A2327'
  };

  const courseConfig = COURSE_CONFIG[normKey] || COURSE_CONFIG['BTech'] || {};
  const years = courseConfig.years || ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const branches = courseConfig.branches || (normKey === 'BTech' ? ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'AI&DS'] : ['General']);

  // Active view states
  const [selectedBranch, setSelectedBranch] = useState(branches[0] || 'General');
  const [activeYear, setActiveYear] = useState(() => {
    if (yearParam) return normalizeYearStr(yearParam);
    return years[0] || '1st Year';
  });

  const [activeSem, setActiveSem] = useState(() => {
    if (semParam) {
      const digit = String(semParam).replace(/[^0-9]/g, '');
      return digit ? `Sem ${digit}` : null;
    }
    return null;
  });

  const [subjectSearch, setSubjectSearch] = useState('');

  // Sems for the active year
  const activeYearSems = useMemo(() => {
    const sems = courseConfig.sems?.[activeYear] || [1, 2];
    return sems.map(s => `Sem ${s}`);
  }, [courseConfig, activeYear]);

  // Determine current hierarchy level
  const isSemesterView = Boolean(activeSem);
  const isYearView = Boolean(yearParam) && !isSemesterView;
  const isCourseHomeView = !yearParam && !semParam;

  // Compute subjects to display
  const displayedSemesters = useMemo(() => {
    if (activeSem) {
      const sNum = Number(String(activeSem).replace(/[^0-9]/g, ''));
      return [sNum];
    }
    return courseConfig.sems?.[activeYear] || [1, 2];
  }, [courseConfig, activeYear, activeSem]);

  const handleOpenSubjectDetail = (subObj) => {
    if (onSelectSubject) {
      onSelectSubject(subObj);
    }
    if (onNavigate) {
      onNavigate('subject', { subject: subObj });
    } else {
      window.location.href = `/subject?subject=${encodeURIComponent(subObj.name)}&code=${encodeURIComponent(subObj.code)}&course=${encodeURIComponent(courseMeta.name)}`;
    }
  };

  // SEO Page Title and Heading Generation
  const pageHeading = useMemo(() => {
    if (isSemesterView) {
      return `AKTU ${courseMeta.name} ${activeYear} (${activeSem}) — Syllabus, Subjects & Notes`;
    }
    if (isYearView) {
      return `AKTU ${courseMeta.name} ${activeYear} — Subjects, Notes & Previous Papers`;
    }
    return `AKTU ${courseMeta.fullName} (${courseMeta.name}) — Curriculum, Notes & PYQs`;
  }, [isSemesterView, isYearView, courseMeta, activeYear, activeSem]);

  const courseSlug = courseKeyToSlug(normKey);

  return (
    <div className="min-h-screen bg-[#FFF7ED] w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 relative overflow-x-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814]">
      
      {/* Corner Leaves Decoration */}
      <div 
        className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none opacity-40 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-bottom.png")' }}
      />

      {/* TOP BAR / BREADCRUMBS */}
      <div className="pt-2 pb-2 z-10">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <button 
            onClick={() => {
              if (activeSem) setActiveSem(null);
              else if (onNavigate) onNavigate('courses');
              else window.history.back();
            }} 
            className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
            <span>{activeSem ? `Back to ${activeYear}` : 'Courses Directory'}</span>
          </button>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 flex-wrap">
            <span className="hover:text-stone-800 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>Home</span>
            <span>&gt;</span>
            <span className="hover:text-stone-800 cursor-pointer" onClick={() => onNavigate && onNavigate('courses')}>Courses</span>
            <span>&gt;</span>
            <span 
              className={`cursor-pointer ${isCourseHomeView ? 'text-[#7A2327]' : 'hover:text-stone-800'}`}
              onClick={() => { setActiveSem(null); }}
            >
              {courseMeta.name}
            </span>
            {activeYear && (
              <>
                <span>&gt;</span>
                <span className={!activeSem ? 'text-[#7A2327]' : 'hover:text-stone-800 cursor-pointer'} onClick={() => setActiveSem(null)}>
                  {activeYear}
                </span>
              </>
            )}
            {activeSem && (
              <>
                <span>&gt;</span>
                <span className="text-[#7A2327]">{activeSem}</span>
              </>
            )}
          </nav>
        </div>

        {/* HERO TITLE & OVERVIEW */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs text-xl font-black"
                style={{ 
                  backgroundColor: courseMeta.badgeColor + '15', 
                  color: courseMeta.badgeColor,
                  border: `1.5px solid ${courseMeta.badgeColor}30`
                }}
              >
                <GraduationCap size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span 
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: courseMeta.badgeColor + '15', color: courseMeta.badgeColor }}
                  >
                    AKTU / UPTU Curriculum
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {years.length} Years • {years.length * 2} Semesters
                  </span>
                </div>
                <h1 className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl text-stone-900 leading-tight">
                  {pageHeading}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
                  Verified Dr. A.P.J. Abdul Kalam Technical University academic portal. Access official syllabus, branch curriculum, unit-wise handwritten notes, quantum revision series, and solved examination papers.
                </p>
              </div>
            </div>

            {/* QUICK RESOURCE ACCESS BUTTONS */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => onNavigate && onNavigate('notes', courseMeta.name)}
                className="px-4 py-2 bg-[#7A2327] text-white rounded-xl text-xs font-bold hover:bg-[#631c20] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <BookOpen size={15} />
                <span>Browse {courseMeta.name} Notes</span>
              </button>
              <button
                onClick={() => onNavigate && onNavigate('pyqs', courseMeta.name)}
                className="px-4 py-2 bg-stone-100 text-stone-800 border border-stone-200/90 rounded-xl text-xs font-bold hover:bg-stone-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText size={15} />
                <span>{courseMeta.name} Solved PYQs</span>
              </button>
              <button
                onClick={() => onNavigate && onNavigate('syllabus')}
                className="px-4 py-2 bg-white text-stone-700 border border-stone-200/90 rounded-xl text-xs font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink size={15} />
                <span>Official Syllabus</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* YEAR SELECTION TABS */}
      <div className="z-10 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
            Academic Years ({years.length})
          </span>
          {branches.length > 1 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-stone-400 font-semibold">Branch:</span>
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-white border border-stone-200/90 rounded-lg px-2 py-1 text-xs font-bold text-stone-800 outline-none"
              >
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {years.map((y) => {
            const isSelected = activeYear === y;
            return (
              <button
                key={y}
                onClick={() => {
                  setActiveYear(y);
                  setActiveSem(null);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#7A2327] text-white border-[#7A2327] shadow-sm' 
                    : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <div className="font-['Outfit',sans-serif] font-bold text-sm sm:text-base">
                  {y}
                </div>
                <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-rose-100' : 'text-stone-500'}`}>
                  {courseConfig.sems?.[y] ? `Sem ${courseConfig.sems[y].join(' & Sem ')}` : 'Full Year'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEMESTER PILLS FOR ACTIVE YEAR */}
      <div className="z-10 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500">Semesters:</span>
          <button
            onClick={() => setActiveSem(null)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSem === null 
                ? 'bg-stone-900 text-white' 
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All {activeYear} Semesters
          </button>
          {activeYearSems.map(s => {
            const isSelected = activeSem === s;
            return (
              <button
                key={s}
                onClick={() => setActiveSem(s)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#7A2327] text-white shadow-xs' 
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBJECTS DIRECTORY LISTING */}
      <div className="z-10 flex-1 pb-12">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="font-['Outfit',sans-serif] font-black text-xl text-stone-900">
              Curriculum Subjects &amp; Study Resources
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Click any subject to open notes, syllabus outline and solved previous question papers.
            </p>
          </div>

          {/* Subject search input */}
          <div className="relative flex items-center bg-white rounded-xl border border-stone-200/90 shadow-xs focus-within:border-[#7A2327]">
            <Search size={15} className="ml-3 text-stone-400" />
            <input 
              type="text"
              placeholder="Filter subjects..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              className="py-1.5 pl-2.5 pr-4 text-xs bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
            />
          </div>
        </div>

        {displayedSemesters.map((semNum) => {
          const rawList = courseConfig.subjects?.[semNum] || [];
          const filteredList = rawList.filter(item => {
            const name = typeof item === 'object' && item.name ? item.name : String(item);
            const code = typeof item === 'object' && item.code ? item.code : '';
            return name.toLowerCase().includes(subjectSearch.toLowerCase()) || code.toLowerCase().includes(subjectSearch.toLowerCase());
          });

          if (filteredList.length === 0 && subjectSearch) return null;

          return (
            <div key={semNum} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#7A2327] text-white font-black text-xs px-2.5 py-1 rounded-lg">
                  Semester {semNum}
                </span>
                <span className="text-xs font-bold text-stone-500">
                  ({filteredList.length} Subjects Mapped)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredList.map((item, idx) => {
                  const name = typeof item === 'object' && item.name ? item.name : String(item);
                  const code = typeof item === 'object' && item.code ? item.code : `${courseMeta.name}-${semNum}0${idx + 1}`;

                  const subObj = {
                    id: `${courseSlug}_${code.toLowerCase()}`,
                    name,
                    code,
                    semester: `Sem ${semNum}`,
                    year: activeYear,
                    course: courseMeta.name,
                    branch: selectedBranch
                  };

                  return (
                    <div
                      key={code + idx}
                      onClick={() => handleOpenSubjectDetail(subObj)}
                      className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs hover:border-[#7A2327] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="bg-stone-100 text-stone-700 font-bold text-[11px] px-2 py-0.5 rounded-md group-hover:bg-rose-100 group-hover:text-[#7A2327] transition-colors">
                            {code}
                          </span>
                          <span className="text-[11px] font-semibold text-stone-400">
                            Sem {semNum}
                          </span>
                        </div>
                        <div className="font-['Outfit',sans-serif] font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#7A2327] transition-colors line-clamp-2">
                          {name}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
                        <span>Notes • PYQs • Syllabus</span>
                        <ChevronRight size={15} className="text-stone-300 group-hover:text-[#7A2327] transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* COURSE SPECIFIC FAQS */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={20} className="text-[#7A2327]" />
            <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-stone-900">
              AKTU {courseMeta.fullName} — Academic FAQs
            </h2>
          </div>

          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-800">
                What is the evaluation scheme and passing criteria for AKTU {courseMeta.name}?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                AKTU follows a 10-point grading system where students must secure at least 30% to 35% in university end-semester theory examinations and 40% in aggregate (internal sessionals + external exam) to successfully pass each credit subject.
              </p>
            </div>

            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-800">
                Where can I download handwritten notes and quantum series for {courseMeta.name}?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                All subjects listed above provide verified lecture notes, handwritten unit PDF summaries, and university question paper links. Click on any subject card to view available unit files.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm text-stone-800">
                How is CGPA calculated from SGPA in AKTU?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Cumulative Grade Point Average (CGPA) is calculated as the credit-weighted sum of each semester's SGPA divided by the total credits earned: CGPA = Σ(SGPA × Semester Credits) / Σ(Total Semester Credits). You can use our free Result &amp; CGPA Analyzer tool for instant calculation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
