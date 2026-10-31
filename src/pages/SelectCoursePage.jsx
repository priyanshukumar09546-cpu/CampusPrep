import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Code, 
  Cpu, 
  Layers, 
  Briefcase, 
  Pill,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Building2,
  X,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { AVAILABLE_COURSES, COURSE_CONFIG } from '../data/courseMapping.ts';
import { courseKeyToSlug } from '../utils/academicUrls';

export default function SelectCoursePage({ onNavigate }) {
  const { setSelectedCourse } = useCourse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Engineering',
    'Computer Applications',
    'Management',
    'Pharmacy',
    'Design & Architecture',
    'Hospitality & Vocational'
  ];

  // Helper to categorize each course
  const getCourseCategory = (key) => {
    if (['BTech', 'BTechBiotechnology', 'BTechAgriculture', 'BTechLateral', 'MTech'].includes(key)) return 'Engineering';
    if (['BCA', 'MCA', 'MCAIntegrated', 'MCALateral'].includes(key)) return 'Computer Applications';
    if (['BBA', 'BBA_BMS', 'MBA', 'MBAIntegrated', 'MBALateral'].includes(key)) return 'Management';
    if (['BPharma', 'BPharmLateral', 'PharmD', 'MPharm'].includes(key)) return 'Pharmacy';
    if (['BArch', 'BDes', 'BFAD', 'BFA'].includes(key)) return 'Design & Architecture';
    return 'Hospitality & Vocational';
  };

  const getCourseIcon = (key) => {
    const cat = getCourseCategory(key);
    if (cat === 'Engineering') return Code;
    if (cat === 'Computer Applications') return Cpu;
    if (cat === 'Management') return TrendingUp;
    if (cat === 'Pharmacy') return Pill;
    if (cat === 'Design & Architecture') return Sparkles;
    return Briefcase;
  };

  const fullCoursesList = useMemo(() => {
    return AVAILABLE_COURSES.map((c) => {
      const conf = COURSE_CONFIG[c.key] || {};
      const years = conf.years || [];
      const subCount = Object.values(conf.subjects || {}).reduce((acc, list) => acc + list.length, 0);
      const category = getCourseCategory(c.key);
      const icon = getCourseIcon(c.key);
      const slug = courseKeyToSlug(c.key);

      return {
        id: slug,
        key: c.name,
        rawKey: c.key,
        name: c.name,
        fullName: c.fullName,
        badgeColor: c.badgeColor,
        category,
        icon,
        yearsCount: years.length,
        subjectsCount: subCount,
        slug
      };
    });
  }, []);

  const filteredCourses = useMemo(() => {
    return fullCoursesList.filter((c) => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [fullCoursesList, searchQuery, selectedCategory]);

  const handleSelect = (course) => {
    setSelectedCourse(course.name);
    if (onNavigate) {
      onNavigate('course-detail', { courseKey: course.rawKey, courseSlug: course.slug });
    } else {
      window.location.href = `/courses/${course.slug}/`;
    }
  };

  return (
    <div className="min-h-screen bg-transparent w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 relative overflow-x-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814]">
      
      {/* Corner Leaves Decoration */}
      <div 
        className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none opacity-40 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-bottom.png")' }}
      />

      {/* HEADER & BREADCRUMBS */}
      <div className="pt-2 pb-2 z-10">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => onNavigate ? onNavigate('home') : window.history.back()} 
            className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium"
            aria-label="Back to Homepage"
          >
            <ArrowLeft size={18} />
            <span>Home</span>
          </button>

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
            <span className="hover:text-stone-800 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>Home</span>
            <span>&gt;</span>
            <span className="text-[#7A2327]">Courses Directory</span>
          </nav>
        </div>

        <div className="text-center mt-2 mb-4">
          <h1 className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-tight">
            All 24 University Programmes &amp; Academic Directory
          </h1>
          <p className="text-sm text-stone-600 font-medium max-w-2xl mx-auto mt-1.5">
            Verified AKTU course curriculums, semester subject structures, handwritten unit notes, quantum series, and past examination papers.
          </p>
        </div>
      </div>

      {/* SEARCH AND CATEGORY FILTER TABS */}
      <div className="z-10 mb-6">
        {/* Search Input */}
        <div className="relative flex items-center bg-[#0B0B0B] rounded-2xl border border-stone-200/90 shadow-xs mb-4 max-w-xl mx-auto focus-within:border-[#7A2327] transition-all">
          <div className="pl-4 text-stone-400">
            <Search size={18} />
          </div>
          <input 
            id="course-search-input"
            type="text" 
            placeholder="Search all 24 programmes (B.Tech, MCA, MBA, B.Pharm, BArch, BCA...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-3 pr-9 text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-stone-400 hover:text-stone-600 p-1"
              aria-label="Clear Search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-3xl mx-auto">
          {categories.map((cat) => {
            const count = cat === 'All' 
              ? fullCoursesList.length 
              : fullCoursesList.filter(c => c.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#7A2327] text-white shadow-sm' 
                    : 'bg-[#0B0B0B] text-stone-700 border border-stone-200/80 hover:bg-stone-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 24 COURSE CARDS GRID */}
      <div className="z-10 flex-1 pb-12">
        {filteredCourses.length === 0 ? (
          <div className="bg-[#0B0B0B] rounded-2xl p-8 text-center border border-stone-200/80 shadow-xs max-w-md mx-auto">
            <BookOpen size={36} className="text-stone-300 mx-auto mb-2" />
            <h2 className="font-['Outfit',sans-serif] font-bold text-lg text-stone-800">No matching programmes found</h2>
            <p className="text-xs text-stone-500 mt-1">Try searching by degree name (e.g. BTech, Pharmacy, Design) or reset category filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 px-4 py-1.5 bg-[#7A2327] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#631c20]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCourses.map((c) => {
              const IconComp = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className="bg-[#0B0B0B] rounded-2xl p-4 border border-stone-200/90 shadow-xs hover:border-[#7A2327] hover:shadow-md transition-all flex items-center justify-between cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
                      style={{ 
                        backgroundColor: c.badgeColor + '15', 
                        color: c.badgeColor,
                        border: `1px solid ${c.badgeColor}30`
                      }}
                    >
                      <IconComp size={22} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Outfit',sans-serif] font-extrabold text-base sm:text-lg text-stone-900 group-hover:text-[#7A2327] transition-colors truncate">
                          {c.name}
                        </span>
                        <span 
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: c.badgeColor + '15', color: c.badgeColor }}
                        >
                          {c.yearsCount}Y
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 font-medium truncate mt-0.5">
                        {c.fullName}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-2">
                        <span>{c.subjectsCount} Subjects</span>
                        <span>•</span>
                        <span>{c.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 group-hover:text-[#7A2327] group-hover:bg-rose-50 transition-colors flex-shrink-0">
                    <ChevronRight size={18} strokeWidth={2.4} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EDUCATIONAL DIRECTORY FAQS */}
        <div className="mt-12 bg-[#0B0B0B] rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={20} className="text-[#7A2327]" />
            <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-stone-900">
              Frequently Asked Questions — AKTU Course Directory
            </h2>
          </div>

          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-800">
                Are all 24 programmes based on the official AKTU syllabus?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Yes. Every programme curriculum, subject list, course code, and credit mapping on ProfessorVirus is referenced directly from official university syllabus regulations and curriculum circulars published by Dr. A.P.J. Abdul Kalam Technical University (AKTU/UPTU).
              </p>
            </div>

            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-800">
                How do I find notes and question papers for my semester?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Click on any course above (such as B.Tech, MCA, or MBA) to open the course portal. Select your academic year and semester to access verified unit-wise notes, handwritten revision summaries, and official previous-year question papers (PYQs).
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm text-stone-800">
                Can I request study notes or question papers for missing subjects?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Yes! Every subject detail page includes an academic request button. If study materials or solved question papers for your specific elective or subject code are not yet available, submit a note request and our student academic team will verify and add them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
