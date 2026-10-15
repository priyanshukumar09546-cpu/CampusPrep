import React from 'react';
import { Home, BookOpen, FileText, Wrench, User, LayoutGrid, FileCheck } from 'lucide-react';

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
      label: 'PYQs',
      icon: FileCheck
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: LayoutGrid
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
    if (activeTab === 'notes' || activeTab === 'select-course' || activeTab === 'select-year' || activeTab === 'select-subject' || activeTab === 'subject' || activeTab === 'subject-detail' || activeTab === 'syllabus') return 'notes';
    if (activeTab === 'pyqs') return 'pyqs';
    if ([
      'more', 'resume-maker', 'pdf-maker', 'result-cgpa', 'attendance-calculator',
      'timetable', 'scholarships', 'scholarship-detail', 'internships-jobs', 'opportunity-detail',
      'project-ideas', 'project-detail', 'competitive-exams', 'important-links',
      'interview-pro', 'interview-confirm', 'interview-instructions', 'interview-start',
      'interview-aptitude', 'interview-coding', 'interview-technical', 'interview-hr',
      'interview-report', 'aistudy', 'quizzes', 'plagiarism', 'promotion'
    ].includes(activeTab)) return 'tools';
    if (['signin', 'signup', 'login', 'progress', 'profile'].includes(activeTab)) return 'profile';
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
        const activeColor = (tab.id === 'tools') ? '#781416' : '#6366F1';

        const isToolsActive = isActive && tab.id === 'tools';

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
              padding: '2px 0',
              position: 'relative',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isToolsActive ? '3px 14px' : '3px 6px',
                borderRadius: isToolsActive ? '10px' : '0px',
                backgroundColor: isToolsActive ? '#FEE2E2' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? activeColor : '#64748B',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.15s ease, color 0.15s ease'
                }}
              >
                <IconComponent 
                  size={20} 
                  strokeWidth={isActive ? 2.4 : 1.9}
                  fill={isActive && (tab.id === 'home' || tab.id === 'profile') ? activeColor : 'none'}
                />
              </div>
              
              <span 
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? activeColor : '#64748B',
                  marginTop: '1px',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em'
                }}
              >
                {tab.label}
              </span>
            </div>

            {/* Active Indicator Bar for non-tools tabs */}
            {isActive && !isToolsActive && (
              <span 
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  width: '24px',
                  height: '2.5px',
                  borderRadius: '9999px',
                  backgroundColor: activeColor
                }} 
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
