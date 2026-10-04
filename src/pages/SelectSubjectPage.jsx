import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Layers, 
  Database, 
  Cpu, 
  Radio, 
  Code, 
  BookOpen, 
  Sparkles,
  X 
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { getSubjectsByHierarchy } from '../data/subjectsData';

export default function SelectSubjectPage({ onNavigate, onSelectSubject }) {
  const { selectedCourse, selectedYear, selectedBranch } = useCourse();
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = useMemo(() => {
    return getSubjectsByHierarchy(selectedCourse, selectedYear, selectedBranch);
  }, [selectedCourse, selectedYear, selectedBranch]);

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubjectIconComp = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('operating system') || n.includes('os')) return Cpu;
    if (n.includes('database') || n.includes('dbms')) return Database;
    if (n.includes('network')) return Radio;
    if (n.includes('algorithm') || n.includes('daa') || n.includes('structure')) return Layers;
    if (n.includes('computation') || n.includes('automata')) return Code;
    if (n.includes('organization') || n.includes('coa')) return Sparkles;
    return BookOpen;
  };

  const handleOpenSubject = (subject) => {
    if (onSelectSubject) onSelectSubject(subject);
    onNavigate('subject-detail', { subjectCode: subject.code, subject });
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 relative overflow-x-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814]">
      
      {/* Corner Leaves Decoration */}
      <div 
        className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none opacity-40 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-bottom.png")' }}
      />

      {/* HEADER */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between z-10">
        <button 
          onClick={() => onNavigate('select-year')} 
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="font-['Outfit',sans-serif] font-bold text-lg text-stone-900">
          Select Your Subject
        </h1>

        <button 
          onClick={() => {
            const el = document.getElementById('subject-search-input');
            if (el) el.focus();
          }} 
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search size={19} />
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-5 pt-1 pb-20 z-10 flex-1">
        
        {/* BREADCRUMB */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-500 bg-white/70 px-3 py-1 rounded-full border border-stone-200/60 shadow-2xs">
            <span>{selectedCourse}</span>
            <span>›</span>
            {selectedCourse.includes('Tech') && (
              <>
                <span>{selectedBranch || 'CSE'}</span>
                <span>›</span>
              </>
            )}
            <span className="text-[#7A2327]">{selectedYear}</span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative flex items-center bg-white rounded-xl border border-stone-200 shadow-xs mb-4">
          <div className="pl-3 text-stone-400">
            <Search size={16} />
          </div>
          <input 
            id="subject-search-input"
            type="text" 
            placeholder="Search subjects..."
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

        {/* SUBJECTS LIST */}
        <div className="space-y-3">
          {filteredSubjects.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-300 text-stone-500">
              <BookOpen size={32} className="mx-auto text-stone-400 mb-2" />
              <div className="font-bold text-sm text-stone-800">No subjects found</div>
              <div className="text-xs text-stone-400 mt-1">Try a different search keyword</div>
            </div>
          ) : (
            filteredSubjects.map((sub) => {
              const IconComp = getSubjectIconComp(sub.name);
              return (
                <div
                  key={sub.id}
                  onClick={() => handleOpenSubject(sub)}
                  className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs hover:border-[#7A2327] hover:shadow-md transition-all flex items-center justify-between cursor-pointer group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: sub.iconBg, color: sub.iconColor }}
                    >
                      <IconComp size={22} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-['Outfit',sans-serif] font-extrabold text-sm text-stone-900 group-hover:text-[#7A2327] transition-colors truncate">
                        {sub.name}
                      </div>
                      <div className="text-[11px] text-stone-400 font-medium mt-0.5">
                        ({sub.code})
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 group-hover:text-[#7A2327] group-hover:bg-stone-50 transition-colors flex-shrink-0">
                    <ChevronRight size={18} strokeWidth={2.4} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
