import React from 'react';
import { Home, BookOpen, FileText, Award, Menu } from 'lucide-react';

export default function MobileBottomNav({ activeTab, onNavigate }) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: BookOpen
    },
    {
      id: 'pyqs',
      label: 'PYQs',
      icon: FileText
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      icon: Award
    },
    {
      id: 'more',
      label: 'More',
      icon: Menu
    }
  ];

  // Map sub-routes to active parent tab
  const getActiveNavId = () => {
    if (!activeTab || activeTab === 'home') return 'home';
    if (activeTab === 'notes' || activeTab === 'select-course' || activeTab === 'select-year' || activeTab === 'select-subject' || activeTab === 'subject') return 'notes';
    if (activeTab === 'pyqs') return 'pyqs';
    if (activeTab === 'quizzes') return 'quizzes';
    return 'more';
  };

  const currentNav = getActiveNavId();

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200/90 z-50 shadow-lg flex items-center justify-around h-16 px-1 select-none font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {tabs.map((tab) => {
        const isActive = currentNav === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === 'notes') {
                onNavigate('select-subject');
              } else {
                onNavigate(tab.id);
              }
            }}
            aria-label={`Navigate to ${tab.label}`}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1 cursor-pointer transition-all relative group"
          >
            <div className={`p-1 rounded-full transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              <IconComponent 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={isActive ? 'text-[#7A2327]' : 'text-stone-400 group-hover:text-stone-600'} 
              />
            </div>
            
            <span className={`text-[10px] tracking-tight leading-none ${
              isActive ? 'font-bold text-[#7A2327]' : 'font-medium text-stone-500 group-hover:text-stone-700'
            }`}>
              {tab.label}
            </span>

            {/* Active Bottom Indicator Dot */}
            {isActive && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#7A2327]"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
