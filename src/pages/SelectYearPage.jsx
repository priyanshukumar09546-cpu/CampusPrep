import React from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  BarChart2, 
  GraduationCap 
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { YEARS_CONFIG } from '../data/subjectsData';

export default function SelectYearPage({ onNavigate }) {
  const { selectedCourse, setSelectedYear } = useCourse();

  const yearsList = YEARS_CONFIG[selectedCourse] || YEARS_CONFIG['default'];

  const getYearIcon = (yearStr) => {
    if (yearStr.includes('1')) return { icon: BookOpen, bg: '#FEE2E2', color: '#DC2626' };
    if (yearStr.includes('2')) return { icon: Layers, bg: '#FFEDD5', color: '#EA580C' };
    if (yearStr.includes('3')) return { icon: BarChart2, bg: '#FEE2E2', color: '#E11D48' };
    return { icon: GraduationCap, bg: '#EDE9FE', color: '#7C3AED' };
  };

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    onNavigate('select-subject');
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] w-full max-w-[430px] mx-auto md:max-w-md lg:max-w-lg relative overflow-x-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814] shadow-2xl">
      
      {/* Corner Leaves Decoration */}
      <div 
        className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none opacity-40 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-bottom.png")' }}
      />

      {/* HEADER */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between z-10">
        <button 
          onClick={() => onNavigate('select-course')} 
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="font-['Outfit',sans-serif] font-bold text-lg text-stone-900">
          Select Your Year
        </h1>

        <button 
          onClick={() => onNavigate('select-subject')} 
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search size={19} />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-5 pt-1 pb-20 z-10 flex-1">
        <div className="text-center mb-5">
          <p className="text-xs text-stone-500 font-medium">
            Choose your current academic year for <span className="font-bold text-[#7A2327]">{selectedCourse}</span>
          </p>
        </div>

        {/* YEAR CARDS LIST */}
        <div className="space-y-3.5">
          {yearsList.map((y) => {
            const iconMeta = getYearIcon(y.year);
            const IconComp = iconMeta.icon;

            return (
              <div
                key={y.year}
                onClick={() => handleSelectYear(y.year)}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-[#7A2327] hover:shadow-md transition-all flex items-center justify-between cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: iconMeta.bg, color: iconMeta.color }}
                  >
                    <IconComp size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="font-['Outfit',sans-serif] font-extrabold text-base text-stone-900 group-hover:text-[#7A2327] transition-colors">
                      {y.title}
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                      {y.subtitle}
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
