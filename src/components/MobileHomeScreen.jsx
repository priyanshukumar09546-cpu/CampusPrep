import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Mic, 
  GraduationCap, 
  FileText, 
  Briefcase, 
  FileCheck, 
  Code, 
  Layers, 
  Trophy, 
  BookOpen, 
  Grid, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export default function MobileHomeScreen({ 
  onNavigate, 
  onOpenAI, 
  onSearch, 
  onSelectSubject 
}) {
  const { selectedCourse } = useCourse();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) onSearch(searchQuery.trim());
      onNavigate('select-subject');
    }
  };

  const gridTools = [
    {
      id: 'notes',
      name: 'Notes',
      sub: 'Study Material',
      icon: FileText,
      iconColor: '#E11D48',
      iconBg: 'bg-rose-50',
      action: () => onNavigate('select-subject')
    },
    {
      id: 'pyqs',
      name: 'PYQs',
      sub: 'Previous Year',
      icon: FileText,
      iconColor: '#2563EB',
      iconBg: 'bg-blue-50',
      action: () => onNavigate('pyqs')
    },
    {
      id: 'interview-pro',
      name: 'Interview Pro',
      sub: 'Mock Interviews',
      icon: Briefcase,
      iconColor: '#7C3AED',
      iconBg: 'bg-purple-50',
      action: () => onNavigate('interview-pro')
    },
    {
      id: 'resume-builder',
      name: 'Resume Builder',
      sub: 'ATS Resume',
      icon: FileCheck,
      iconColor: '#059669',
      iconBg: 'bg-emerald-50',
      action: () => onNavigate('resume-maker')
    },
    {
      id: 'latex-resume',
      name: 'LaTeX Resume',
      sub: 'in 2 Minutes',
      icon: Code,
      iconColor: '#D97706',
      iconBg: 'bg-amber-50',
      action: () => onNavigate('resume-maker')
    },
    {
      id: 'pdf-maker',
      name: 'PDF Maker',
      sub: 'Merge, Split, Convert',
      icon: Layers,
      iconColor: '#0284C7',
      iconBg: 'bg-sky-50',
      action: () => onNavigate('pdf-maker')
    },
    {
      id: 'quizzes',
      name: 'Quizzes',
      sub: 'Test Yourself',
      icon: Trophy,
      iconColor: '#EA580C',
      iconBg: 'bg-orange-50',
      action: () => onNavigate('quizzes')
    },
    {
      id: 'syllabus',
      name: 'Syllabus',
      sub: 'Complete Curriculum',
      icon: BookOpen,
      iconColor: '#4F46E5',
      iconBg: 'bg-indigo-50',
      action: () => onNavigate('syllabus')
    },
    {
      id: 'more',
      name: 'More Tools',
      sub: 'All in One Place',
      icon: Grid,
      iconColor: '#6366F1',
      iconBg: 'bg-violet-50',
      action: () => onNavigate('more')
    }
  ];

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

      {/* HEADER: ProfessorVirus Logo + Subtitle + Bell */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between z-10">
        <div 
          onClick={() => onNavigate('select-course')}
          className="flex flex-col cursor-pointer group"
        >
          <img 
            src="/assets/logo-header.png" 
            alt="ProfessorVirus" 
            className="h-8 md:h-10 object-contain drop-shadow-2xs group-hover:opacity-95 transition-opacity self-start" 
            onError={(e) => {
              e.currentTarget.src = '/assets/logo.png';
            }}
          />
          <span className="text-[10px] font-semibold text-stone-500 tracking-wider mt-0.5">
            BTech • BCA • MTech • MCA • MBA • BPharm
          </span>
        </div>

        <button 
          onClick={() => alert('No new notifications')}
          className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7A2327]"></span>
        </button>
      </div>

      {/* HERO SECTION: "Study Smart. Prepare Better." with Mascot */}
      <div className="px-5 pt-2 pb-3 z-10 flex items-center justify-between">
        <div className="flex-1 pr-2">
          <h1 className="font-['Outfit',sans-serif] font-extrabold text-2xl text-stone-900 tracking-tight leading-tight">
            Study Smart.
          </h1>
          <h2 className="font-['Outfit',sans-serif] font-extrabold text-2xl text-[#7A2327] tracking-tight leading-tight">
            Prepare Better.
          </h2>
          <p className="text-xs text-stone-600 mt-1.5 leading-snug font-medium">
            Notes, PYQs, Quizzes, Syllabus, <br/>
            Interview Prep, Resume Builder &amp; More — All in One.
          </p>
        </div>

        {/* Mascot Character Illustration */}
        <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <img 
            src="/assets/home_hero_banner.png" 
            alt="ProfessorVirus Mascot" 
            className="w-full h-full object-contain drop-shadow-md"
            onError={(e) => {
              e.currentTarget.src = '/assets/logo.png';
            }}
          />
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="px-5 mb-4 z-10">
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl border border-stone-200/90 shadow-sm px-3.5 py-2.5 flex items-center gap-2.5"
        >
          <Search size={18} className="text-stone-400 flex-shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, PYQs, subjects, tools..." 
            className="flex-1 text-xs bg-transparent border-none outline-none text-stone-800 placeholder:text-stone-400 font-medium"
          />
          <button 
            type="button" 
            onClick={() => alert('Voice search activated...')}
            className="text-[#7A2327] hover:opacity-80 transition-opacity p-0.5 cursor-pointer"
            aria-label="Voice Search"
          >
            <Mic size={18} />
          </button>
        </form>
      </div>

      {/* 3x3 GRID OF TOOLS (SCREEN 1) */}
      <div className="px-5 mb-4 z-10">
        <div className="grid grid-cols-3 gap-2.5">
          {gridTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={tool.action}
                className="bg-white rounded-2xl p-2.5 border border-orange-100/70 shadow-xs flex flex-col items-center text-center hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div 
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 ${tool.iconBg}`}
                  style={{ color: tool.iconColor }}
                >
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <span className="font-['Outfit',sans-serif] font-bold text-xs text-stone-900 group-hover:text-[#7A2327] transition-colors leading-tight">
                  {tool.name}
                </span>
                <span className="text-[10px] text-stone-400 font-medium leading-tight mt-0.5">
                  {tool.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* "ASK VIRUS" CARD */}
      <div className="px-5 z-10">
        <div 
          onClick={onOpenAI || (() => onNavigate('interview-pro'))}
          className="w-full bg-gradient-to-r from-[#21090C] via-[#3E1117] to-[#5C1922] rounded-2xl p-4 text-white shadow-lg relative overflow-hidden cursor-pointer group hover:scale-[1.01] transition-transform"
        >
          {/* Subtle star particle accents */}
          <div className="absolute top-2 right-16 w-1 h-1 bg-amber-300 rounded-full opacity-60"></div>
          <div className="absolute bottom-3 left-32 w-1.5 h-1.5 bg-rose-200 rounded-full opacity-40"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-['Outfit',sans-serif] font-black text-lg text-white">
                  Ask Virus
                </span>
                <Sparkles size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
              </div>
              <div className="text-xs font-semibold text-rose-200 mb-1">
                Your AI Study Assistant
              </div>
              <p className="text-[11px] text-stone-300 leading-snug max-w-[210px] mb-2.5">
                Get instant, accurate answers to your academic doubts.
              </p>
            </div>

            {/* AI Mascot & Circle Arrow */}
            <div className="relative flex flex-col items-center justify-center flex-shrink-0">
              <img 
                src="/assets/ask_virus_banner.png" 
                alt="Ask Virus Robot" 
                className="w-16 h-16 object-contain drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.src = '/assets/logo.png';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white text-[#7A2327] flex items-center justify-center shadow-md group-hover:translate-x-0.5 transition-transform">
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
