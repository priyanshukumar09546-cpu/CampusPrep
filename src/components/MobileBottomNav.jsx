import React from 'react';
import { Home, BookOpen, FileText, Wrench, User } from 'lucide-react';

export default function MobileBottomNav({ activeTab, onNavigate, onOpenAuth }) {
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
      label: 'PYQ',
      icon: FileText
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Wrench
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User
    }
  ];

  // Map active sub-routes to parent bottom nav tab
  const getActiveNavId = () => {
    if (!activeTab || activeTab === 'home') return 'home';
    if (activeTab === 'notes' || activeTab === 'select-course' || activeTab === 'select-year' || activeTab === 'select-subject' || activeTab === 'subject' || activeTab === 'syllabus') return 'notes';
    if (activeTab === 'pyqs') return 'pyqs';
    if (['more', 'resume-maker', 'pdf-maker', 'result-cgpa', 'attendance-calculator', 'timetable', 'scholarships', 'internships-jobs', 'project-ideas', 'competitive-exams', 'interview-pro', 'quizzes', 'plagiarism'].includes(activeTab)) return 'tools';
    if (['signin', 'signup', 'login', 'progress'].includes(activeTab)) return 'profile';
    return 'home';
  };

  const currentNav = getActiveNavId();

  const handleTabClick = (tabId) => {
    if (tabId === 'home') {
      onNavigate('home');
    } else if (tabId === 'notes') {
      onNavigate('notes');
    } else if (tabId === 'pyqs') {
      onNavigate('pyqs');
    } else if (tabId === 'tools') {
      onNavigate('more');
    } else if (tabId === 'profile') {
      onNavigate('progress');
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className="pv-mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '100vw',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #E2E8F0',
        zIndex: 9998,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '60px',
        padding: '0 4px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentNav === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            aria-label={`Navigate to ${tab.label}`}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              maxWidth: '20%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              position: 'relative',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? '#6366F1' : '#64748B',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.15s ease, color 0.15s ease'
              }}
            >
              <IconComponent 
                size={21} 
                strokeWidth={isActive ? 2.6 : 2}
                fill={isActive && (tab.id === 'home' || tab.id === 'profile') ? '#6366F1' : 'none'}
              />
            </div>
            
            <span 
              style={{
                fontSize: '10px',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#6366F1' : '#64748B',
                marginTop: '2px',
                lineHeight: 1.1,
                letterSpacing: '-0.01em'
              }}
            >
              {tab.label}
            </span>

            {/* Active Indicator Bar */}
            {isActive && (
              <span 
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  width: '24px',
                  height: '2.5px',
                  borderRadius: '9999px',
                  backgroundColor: '#6366F1'
                }} 
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
