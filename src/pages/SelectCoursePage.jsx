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
  X 
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export default function SelectCoursePage({ onNavigate }) {
  const { setSelectedCourse, allCourses } = useCourse();
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
    <div className="min-h-screen bg-[#FFF7ED] w-full max-w-[430px] mx-auto md:max-w-md lg:max-w-lg relative overflow-x-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814] shadow-2xl">
      
      {/* Corner Leaves Decoration */}
      <div 
        className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none opacity-40 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-bottom.png")' }}
      />

      {/* TOP STATUS BAR (9:41) */}
      <div className="pt-2 px-6 flex justify-between items-center text-xs font-semibold text-stone-800 z-10 select-none">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0 0 12 4z"/></svg>
          <div className="w-5 h-2.5 border border-stone-800 rounded-sm p-0.5 flex items-center">
            <div className="w-full h-full bg-stone-800 rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between z-10">
        <button 
          onClick={() => onNavigate('home')} 
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="font-['Outfit',sans-serif] font-bold text-lg text-stone-900">
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
      <div className="px-5 pt-1 pb-20 z-10 flex-1">
        <div className="text-center mb-4">
          <p className="text-xs text-stone-500 font-medium">
            Choose your academic program
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative flex items-center bg-white rounded-xl border border-stone-200 shadow-xs mb-4">
          <div className="pl-3 text-stone-400">
            <Search size={16} />
          </div>
          <input 
            id="course-search-input"
            type="text" 
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-2.5 pr-8 text-xs bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
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

        {/* 6 COURSE CARDS */}
        <div className="space-y-3">
          {filteredCourses.map((c) => {
            const IconComp = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => handleSelect(c.key)}
                className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs hover:border-[#7A2327] hover:shadow-md transition-all flex items-center justify-between cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: c.iconBg, color: c.iconColor }}
                  >
                    <IconComp size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="font-['Outfit',sans-serif] font-extrabold text-base text-stone-900 group-hover:text-[#7A2327] transition-colors">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                      {c.fullName}
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 group-hover:text-[#7A2327] group-hover:bg-stone-50 transition-colors">
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
