import React, { useState } from 'react';
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
  X 
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export default function SelectCoursePage({ onNavigate }) {
  const { setSelectedCourse } = useCourse();
  const [searchQuery, setSearchQuery] = useState('');

  const coursesList = [
    {
      id: 'btech',
      key: 'B.Tech',
      name: 'B.Tech',
      fullName: 'Bachelor of Technology',
      icon: Code,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      borderColor: '#FECACA'
    },
    {
      id: 'bca',
      key: 'BCA',
      name: 'BCA',
      fullName: 'Bachelor of Computer Applications',
      icon: Cpu,
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      borderColor: '#BFDBFE'
    },
    {
      id: 'mtech',
      key: 'M.Tech',
      name: 'M.Tech',
      fullName: 'Master of Technology',
      icon: Layers,
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
      borderColor: '#E9D5FF'
    },
    {
      id: 'mca',
      key: 'MCA',
      name: 'MCA',
      fullName: 'Master of Computer Applications',
      icon: BookOpen,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      borderColor: '#FDE68A'
    },
    {
      id: 'mba',
      key: 'MBA',
      name: 'MBA',
      fullName: 'Master of Business Administration',
      icon: Briefcase,
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      borderColor: '#FED7AA'
    },
    {
      id: 'bpharm',
      key: 'B.Pharm',
      name: 'B.Pharm',
      fullName: 'Bachelor of Pharmacy',
      icon: Pill,
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      borderColor: '#BBF7D0'
    },
    {
      id: 'bba',
      key: 'BBA',
      name: 'BBA',
      fullName: 'Bachelor of Business Administration',
      icon: TrendingUp,
      iconBg: '#FEF3C7',
      iconColor: '#B45309',
      borderColor: '#FDE68A'
    }
  ];

  const filteredCourses = coursesList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (courseKey) => {
    setSelectedCourse(courseKey);
    onNavigate('select-year');
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 relative overflow-x-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814]">
      
      {/* Corner Leaves Decoration */}
      <div 
        className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none opacity-40 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-bottom.png")' }}
      />

      {/* HEADER */}
      <div className="pt-2 pb-2 flex items-center justify-between z-10 mb-2">
        <button 
          onClick={() => onNavigate ? onNavigate('home') : window.history.back()} 
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium"
          aria-label="Go Back"
        >
          <ArrowLeft size={20} />
          <span>Home</span>
        </button>

        <h1 className="font-['Outfit',sans-serif] font-bold text-xl md:text-2xl text-stone-900">
          Select Your Course
        </h1>

        <button 
          onClick={() => {
            const input = document.getElementById('course-search-input');
            if (input) input.focus();
          }} 
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search size={19} />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-1 pb-20 z-10 flex-1">
        <div className="text-center mb-5">
          <p className="text-sm text-stone-500 font-medium">
            Choose your academic program to explore unit notes and past question papers
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative flex items-center bg-white rounded-xl border border-stone-200 shadow-xs mb-5 max-w-md mx-auto">
          <div className="pl-3.5 text-stone-400">
            <Search size={17} />
          </div>
          <input 
            id="course-search-input"
            type="text" 
            placeholder="Search programs (BTech, BCA, MBA, BBA...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-2.5 pr-8 text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-stone-400 hover:text-stone-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* 7 COURSE CARDS IN RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCourses.map((c) => {
            const IconComp = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => handleSelect(c.key)}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-[#7A2327] hover:shadow-md transition-all flex items-center justify-between cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
                    style={{ backgroundColor: c.iconBg, color: c.iconColor }}
                  >
                    <IconComp size={24} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="font-['Outfit',sans-serif] font-extrabold text-base sm:text-lg text-stone-900 group-hover:text-[#7A2327] transition-colors">
                      {c.name}
                    </div>
                    <div className="text-xs text-stone-500 font-medium mt-0.5">
                      {c.fullName}
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 group-hover:text-[#7A2327] group-hover:bg-rose-50 transition-colors">
                  <ChevronRight size={18} strokeWidth={2.4} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
