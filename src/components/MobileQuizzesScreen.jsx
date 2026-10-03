import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Cpu, 
  Database, 
  Radio, 
  Layers, 
  Code, 
  CheckCircle2, 
  Sparkles, 
  Trophy 
} from 'lucide-react';

export default function MobileQuizzesScreen({ onNavigate, onStartQuiz }) {
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Subject Wise'

  const quizzes = [
    {
      id: 'os',
      name: 'Operating System',
      questions: '25 Questions',
      time: '15 min',
      icon: Cpu,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'dbms',
      name: 'DBMS',
      questions: '30 Questions',
      time: '20 min',
      icon: Database,
      color: 'bg-rose-100 text-rose-600'
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      questions: '25 Questions',
      time: '15 min',
      icon: Radio,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'ds',
      name: 'Data Structures',
      questions: '25 Questions',
      time: '15 min',
      icon: Layers,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 'oops-java',
      name: 'OOPs with Java',
      questions: '25 Questions',
      time: '15 min',
      icon: Code,
      color: 'bg-purple-100 text-purple-600'
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

      {/* HEADER: Title Quizzes + Subtitle + Bell */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between z-10">
        <button 
          onClick={() => onNavigate('home')}
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center flex-1 mx-2">
          <h1 className="font-['Outfit',sans-serif] font-bold text-xl text-stone-900 leading-tight">
            Quizzes
          </h1>
          <p className="text-[11px] text-stone-500 font-medium">
            Test Your Knowledge, Practice, Learn and Improve
          </p>
        </div>

        <button 
          onClick={() => alert('No active quiz notifications')}
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
      </div>

      {/* TROPHY & STATS BADGES CARD (SCREEN 8) */}
      <div className="px-5 mb-4 z-10">
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/90 rounded-2xl p-4 border border-amber-200/60 shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 mb-2 flex items-center justify-center">
            <img 
              src="/assets/quiz_trophy.png" 
              alt="Quiz Trophy" 
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.src = '/assets/logo.png';
              }}
            />
          </div>

          {/* 3 Pills Row */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="bg-white/95 border border-amber-200/80 rounded-full px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-2xs flex items-center gap-1">
              🏆 25+ Subjects
            </span>
            <span className="bg-white/95 border border-amber-200/80 rounded-full px-2.5 py-1 text-[11px] font-bold text-stone-800 shadow-2xs flex items-center gap-1">
              📝 10K+ Questions
            </span>
            <span className="bg-white/95 border border-amber-200/80 rounded-full px-2.5 py-1 text-[11px] font-bold text-stone-800 shadow-2xs flex items-center gap-1">
              ⚡ Instant Feedback
            </span>
          </div>
        </div>
      </div>

      {/* FILTER TABS: [All] [Subject Wise] */}
      <div className="px-5 mb-3 z-10 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('All')}
          className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'All'
              ? 'bg-[#7A2327] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('Subject Wise')}
          className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'Subject Wise'
              ? 'bg-[#7A2327] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          Subject Wise
        </button>
      </div>

      {/* QUIZZES LIST */}
      <div className="px-5 space-y-2.5 z-10 flex-1">
        {quizzes.map((quiz) => {
          const Icon = quiz.icon;
          return (
            <div 
              key={quiz.id}
              className="bg-white rounded-2xl p-3 border border-orange-100/70 shadow-xs flex items-center justify-between hover:border-orange-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${quiz.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900 leading-tight">
                    {quiz.name}
                  </div>
                  <div className="text-[11px] text-stone-400 font-medium mt-0.5">
                    {quiz.questions} • {quiz.time}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onStartQuiz) onStartQuiz(quiz);
                  else alert(`Starting ${quiz.name} Quiz!`);
                }}
                className="bg-[#7A2327] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs hover:bg-[#631c20] transition-colors cursor-pointer"
              >
                Start Quiz
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
