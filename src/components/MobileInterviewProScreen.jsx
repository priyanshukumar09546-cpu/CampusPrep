import React from 'react';
import { 
  ArrowLeft, 
  Search, 
  ArrowRight, 
  HeartHandshake, 
  Users, 
  Compass, 
  FileCheck, 
  Sparkles 
} from 'lucide-react';

export default function MobileInterviewProScreen({ onNavigate, onStartInterview }) {
  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      sub: '50+ questions',
      icon: HeartHandshake,
      color: 'text-purple-600 bg-purple-100',
      action: () => onNavigate('interview-technical')
    },
    {
      id: 'hr',
      title: 'HR Interview',
      sub: 'Common HR questions',
      icon: Users,
      color: 'text-rose-600 bg-rose-100',
      action: () => onNavigate('interview-hr')
    },
    {
      id: 'aptitude',
      title: 'Aptitude',
      sub: 'Quantitative & Logical',
      icon: Compass,
      color: 'text-sky-600 bg-sky-100',
      action: () => onNavigate('interview-aptitude')
    },
    {
      id: 'resume-review',
      title: 'Resume Review',
      sub: 'Get AI feedback',
      icon: FileCheck,
      color: 'text-emerald-600 bg-emerald-100',
      action: () => onNavigate('resume-maker')
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

      {/* TOP STATUS BAR (9:41) */}
      <div className="pt-2 px-6 flex justify-between items-center text-xs font-semibold text-stone-800 z-10 select-none">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/>
          </svg>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0 0 12 4z"/>
          </svg>
          <div className="w-5 h-2.5 border border-stone-800 rounded-sm p-0.5 flex items-center">
            <div className="w-full h-full bg-stone-800 rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* HEADER: Back Arrow + Title + Search */}
      <div className="px-5 pt-3 pb-3 flex items-center justify-between z-10">
        <button 
          onClick={() => onNavigate('home')}
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="font-['Outfit',sans-serif] font-bold text-xl text-stone-900 leading-tight">
          Interview Pro
        </h1>

        <button 
          onClick={() => alert('Search interview questions...')}
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>

      {/* HERO BANNER CARD (SCREEN 9) */}
      <div className="px-5 mb-5 z-10">
        <div className="w-full bg-gradient-to-r from-[#21090C] via-[#3E1117] to-[#5C1922] rounded-3xl p-4 text-white shadow-xl relative overflow-hidden">
          {/* Subtle star particle accents */}
          <div className="absolute top-2 right-12 w-1 h-1 bg-amber-300 rounded-full opacity-60"></div>
          <div className="absolute bottom-12 left-28 w-1 h-1 bg-rose-200 rounded-full opacity-40"></div>

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex-1 pr-2">
              <h2 className="font-['Outfit',sans-serif] font-black text-lg text-white leading-tight mb-1.5">
                Get Job Ready with AI-Powered Mock Interviews
              </h2>
              <p className="text-[11px] text-stone-300 leading-snug">
                Practice real interview questions and get instant feedback from AI.
              </p>
            </div>

            {/* Boy Mascot in hoodie */}
            <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <img 
                src="/assets/interview_card_hero.png" 
                alt="Interview Mascot" 
                className="w-full h-full object-contain drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.src = '/assets/home_hero_banner.png';
                }}
              />
            </div>
          </div>

          {/* Full-width "Start Interview ->" button inside card */}
          <button 
            onClick={() => {
              if (onStartInterview) onStartInterview('technical');
              else onNavigate('interview-confirm');
            }}
            className="w-full bg-[#7A2327] hover:bg-[#661b1f] text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-400/20"
          >
            <span>Start Interview</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* CHOOSE INTERVIEW TYPE SECTION */}
      <div className="px-5 z-10 flex-1">
        <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900 mb-3">
          Choose Interview Type
        </div>

        {/* 2x2 Grid of cards */}
        <div className="grid grid-cols-2 gap-3">
          {interviewTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={type.action}
                className="bg-white rounded-2xl p-3 border border-orange-100/70 shadow-xs flex flex-col items-start hover:border-orange-200 transition-all text-left cursor-pointer group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${type.color}`}>
                  <Icon size={19} />
                </div>
                <div className="font-['Outfit',sans-serif] font-bold text-xs text-stone-900 group-hover:text-[#7A2327] transition-colors leading-tight">
                  {type.title}
                </div>
                <div className="text-[10px] text-stone-400 font-medium mt-0.5">
                  {type.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
