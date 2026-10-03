import React, { useState } from 'react';
import { 
  Bookmark, 
  Download, 
  BarChart2, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Crown, 
  ChevronRight, 
  ArrowRight, 
  FileText, 
  Briefcase, 
  FileCheck, 
  Code, 
  Layers, 
  Trophy, 
  BookOpen, 
  Calculator, 
  Calendar 
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export default function MobileMoreScreen({ onNavigate, onOpenAuth }) {
  const { selectedCourse, selectedBranch } = useCourse();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('campusprep_auth_user') || localStorage.getItem('professorvirus_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const displayName = user?.name || 'Priyanshu Kumar';
  const displayCourse = `${selectedCourse || 'B.Tech'} ${selectedBranch || 'CSE'}`;

  const allTools = [
    {
      id: 'notes',
      name: 'Notes',
      sub: 'Study Material',
      icon: FileText,
      color: 'text-rose-600 bg-rose-50',
      action: () => onNavigate('select-subject')
    },
    {
      id: 'pyqs',
      name: 'PYQs',
      sub: 'Previous Year Papers',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      action: () => onNavigate('pyqs')
    },
    {
      id: 'syllabus',
      name: 'Syllabus',
      sub: 'Complete Curriculum',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50',
      action: () => onNavigate('syllabus')
    },
    {
      id: 'quizzes',
      name: 'Quizzes',
      sub: 'Test Yourself',
      icon: Trophy,
      color: 'text-orange-600 bg-orange-50',
      action: () => onNavigate('quizzes')
    },
    {
      id: 'interview-pro',
      name: 'Interview Pro',
      sub: 'AI Mock Interviews',
      icon: Briefcase,
      color: 'text-purple-600 bg-purple-50',
      action: () => onNavigate('interview-pro')
    },
    {
      id: 'resume-builder',
      name: 'Resume Builder',
      sub: 'ATS Resume',
      icon: FileCheck,
      color: 'text-emerald-600 bg-emerald-50',
      action: () => onNavigate('resume-maker')
    },
    {
      id: 'latex-resume',
      name: 'LaTeX Resume',
      sub: 'Vector PDF',
      icon: Code,
      color: 'text-amber-600 bg-amber-50',
      action: () => onNavigate('resume-maker')
    },
    {
      id: 'pdf-maker',
      name: 'PDF Maker',
      sub: 'Merge & Convert',
      icon: Layers,
      color: 'text-sky-600 bg-sky-50',
      action: () => onNavigate('pdf-maker')
    },
    {
      id: 'result-cgpa',
      name: 'CGPA Calculator',
      sub: 'SGPA to Percentage',
      icon: Calculator,
      color: 'text-teal-600 bg-teal-50',
      action: () => onNavigate('result-cgpa')
    },
    {
      id: 'attendance',
      name: 'Attendance',
      sub: '75% Criteria Tracker',
      icon: Calendar,
      color: 'text-pink-600 bg-pink-50',
      action: () => onNavigate('attendance-calculator')
    }
  ];

  const menuItems = [
    {
      id: 'bookmarks',
      title: 'My Bookmarks',
      icon: Bookmark,
      action: () => alert('Opening My Bookmarks...')
    },
    {
      id: 'downloads',
      title: 'My Downloads',
      icon: Download,
      action: () => alert('Opening My Downloads...')
    },
    {
      id: 'study-progress',
      title: 'Study Progress',
      icon: BarChart2,
      action: () => alert('Opening Study Progress...')
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      action: () => alert('Opening Settings...')
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      action: () => alert('CampusPrep Helpdesk: support@campusprep.edu')
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: LogOut,
      isDanger: true,
      action: () => {
        if (confirm('Are you sure you want to log out?')) {
          localStorage.removeItem('campusprep_auth_user');
          localStorage.removeItem('professorvirus_user');
          onNavigate('signin');
        }
      }
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

      {/* 1. USER PROFILE CARD (SCREEN 10) */}
      <div className="px-5 pt-3 pb-2 z-10">
        <div className="bg-white rounded-2xl p-3.5 border border-orange-100/70 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-100 bg-stone-100 flex-shrink-0">
              <img 
                src="/assets/user_avatar_priyanshu.png" 
                alt="User Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/assets/logo.png';
                }}
              />
            </div>
            <div>
              <div className="font-['Outfit',sans-serif] font-bold text-base text-stone-900 leading-tight">
                {displayName}
              </div>
              <div className="text-xs text-stone-500 font-medium mt-0.5">
                {displayCourse}
              </div>
            </div>
          </div>

          <button 
            onClick={() => alert(`Profile for ${displayName}`)}
            className="text-xs font-bold text-[#7A2327] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Profile</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 2. STATS ROW (12 Notes Saved, 8 Quizzes Taken, 4 Interviews) */}
      <div className="px-5 mb-3 z-10">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-2xl py-3 px-2 border border-orange-100/70 shadow-xs flex flex-col items-center text-center">
            <span className="font-['Outfit',sans-serif] font-black text-xl text-[#7A2327]">
              12
            </span>
            <span className="text-[10px] text-stone-500 font-semibold mt-0.5">
              Notes Saved
            </span>
          </div>

          <div className="bg-white rounded-2xl py-3 px-2 border border-orange-100/70 shadow-xs flex flex-col items-center text-center">
            <span className="font-['Outfit',sans-serif] font-black text-xl text-[#7A2327]">
              8
            </span>
            <span className="text-[10px] text-stone-500 font-semibold mt-0.5">
              Quizzes Taken
            </span>
          </div>

          <div className="bg-white rounded-2xl py-3 px-2 border border-orange-100/70 shadow-xs flex flex-col items-center text-center">
            <span className="font-['Outfit',sans-serif] font-black text-xl text-[#7A2327]">
              4
            </span>
            <span className="text-[10px] text-stone-500 font-semibold mt-0.5">
              Interviews
            </span>
          </div>
        </div>
      </div>

      {/* 3. UPGRADE TO PREMIUM CARD */}
      <div className="px-5 mb-4 z-10">
        <div 
          onClick={() => alert('ProfessorVirus Premium: Unlimited Notes, AI Interview Prep & LaTeX Resume Generation.')}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3.5 border border-amber-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Crown size={22} className="fill-amber-500 text-amber-600" />
            </div>
            <div>
              <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900 leading-tight">
                Upgrade to Premium
              </div>
              <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                Unlock advanced features and more
              </div>
            </div>
          </div>

          <ChevronRight size={18} className="text-stone-400" />
        </div>
      </div>

      {/* 4. ALL STUDENT TOOLS GRID (2 COLUMNS - CRITICAL MOBILE FIX) */}
      <div className="px-5 mb-4 z-10">
        <div className="font-['Outfit',sans-serif] font-bold text-xs text-stone-700 uppercase tracking-wider mb-2.5">
          All Student Tools
        </div>
        <div className="grid grid-cols-2 gap-2">
          {allTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={tool.action}
                className="bg-white rounded-xl p-2.5 border border-orange-100/70 shadow-2xs flex items-center gap-2.5 hover:border-orange-200 transition-all text-left cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tool.color}`}>
                  <Icon size={16} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <div className="font-['Outfit',sans-serif] font-bold text-xs text-stone-900 truncate group-hover:text-[#7A2327]">
                    {tool.name}
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    {tool.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. MENU LIST (SCREEN 10) */}
      <div className="px-5 z-10">
        <div className="bg-white rounded-2xl border border-orange-100/70 shadow-xs divide-y divide-stone-100 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer hover:bg-stone-50/60 ${
                  item.isDanger ? 'text-red-600' : 'text-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={item.isDanger ? 'text-red-600' : 'text-stone-500'} />
                  <span className="font-['Outfit',sans-serif] font-medium text-xs">
                    {item.title}
                  </span>
                </div>
                {!item.isDanger && (
                  <ChevronRight size={16} className="text-stone-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
