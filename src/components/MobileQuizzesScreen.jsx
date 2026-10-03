import React, { useState, useMemo } from 'react';
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
  Trophy,
  BookOpen
} from 'lucide-react';
import { INITIAL_QUIZZES } from '../data/quizQuestionBank';

export default function MobileQuizzesScreen({ onNavigate, onStartQuiz }) {
  const [activeCourse, setActiveCourse] = useState('All');

  const courses = ['All', 'B.Tech', 'BCA', 'MBA', 'MCA', 'B.Pharm', 'BBA'];

  const displayedQuizzes = useMemo(() => {
    return INITIAL_QUIZZES.filter(q => {
      if (activeCourse !== 'All' && q.course && q.course.toLowerCase() !== activeCourse.toLowerCase()) return false;
      return true;
    });
  }, [activeCourse]);

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
          onClick={() => onNavigate && onNavigate('home')}
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center flex-1 mx-2">
          <h1 className="font-['Outfit',sans-serif] font-bold text-xl text-stone-900 leading-tight">
            Quizzes & Tests
          </h1>
          <p className="text-[11px] text-stone-500 font-medium">
            First-Party Academic Exam Platform
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

      {/* STATS BADGES CARD */}
      <div className="px-5 mb-4 z-10">
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/90 rounded-2xl p-4 border border-amber-200/60 shadow-xs flex flex-col items-center">
          <div className="w-14 h-14 mb-2 flex items-center justify-center">
            <img 
              src="/assets/quiz_trophy.png" 
              alt="Quiz Trophy" 
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.src = '/assets/logo.png';
              }}
            />
          </div>

          {/* 3 Pills Row with Real Honest Numbers */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="bg-white/95 border border-amber-200/80 rounded-full px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-2xs flex items-center gap-1">
              🏆 Verified Syllabus
            </span>
            <span className="bg-white/95 border border-amber-200/80 rounded-full px-2.5 py-1 text-[11px] font-bold text-stone-800 shadow-2xs flex items-center gap-1">
              📝 Real University PYQs
            </span>
            <span className="bg-white/95 border border-amber-200/80 rounded-full px-2.5 py-1 text-[11px] font-bold text-stone-800 shadow-2xs flex items-center gap-1">
              ⚡ Instant Review
            </span>
          </div>
        </div>
      </div>

      {/* COURSE FILTER HORIZONTAL SCROLL */}
      <div className="px-5 mb-3 z-10 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {courses.map(course => (
          <button
            key={course}
            onClick={() => setActiveCourse(course)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCourse === course
                ? 'bg-[#7A2327] text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {course}
          </button>
        ))}
      </div>

      {/* QUIZZES LIST */}
      <div className="px-5 space-y-2.5 z-10 flex-1">
        {displayedQuizzes.map((quiz) => (
          <div 
            key={quiz.id}
            className="bg-white rounded-2xl p-3.5 border border-orange-100/70 shadow-xs flex items-center justify-between hover:border-orange-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center font-bold text-xs">
                {quiz.course}
              </div>
              <div>
                <div className="font-['Outfit',sans-serif] font-bold text-sm text-stone-900 leading-tight">
                  {quiz.title}
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                  {quiz.subject} • {quiz.questions?.length || 0} Questions • {quiz.durationMinutes || 15}m
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (onStartQuiz) onStartQuiz(quiz);
                else if (onNavigate) onNavigate('quizzes');
              }}
              className="bg-[#7A2327] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs hover:bg-[#631c20] transition-colors cursor-pointer"
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
