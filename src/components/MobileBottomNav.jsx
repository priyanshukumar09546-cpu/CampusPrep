import React from 'react';
import { Home, BookOpen, FileText, Wrench, User, LayoutGrid, FileCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MobileBottomNav({ activeTab, onNavigate, onOpenAuth }) {
  const { isDark } = useTheme();
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
    if (
      activeTab.startsWith('prma') ||
      [
        'more', 'resume-maker', 'pdf-maker', 'result-cgpa', 'attendance-calculator',
        'timetable', 'scholarships', 'scholarship-detail', 'internships-jobs', 'opportunity-detail',
        'project-ideas', 'project-detail', 'competitive-exams', 'important-links',
        'interview-pro', 'interview-confirm', 'interview-instructions', 'interview-start',
        'interview-aptitude', 'interview-coding', 'interview-technical', 'interview-hr',
        'interview-report', 'aistudy', 'quizzes', 'plagiarism', 'promotion', 'hoollow', 'hoolow'
      ].includes(activeTab)
    ) return 'tools';
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
        backgroundColor: isDark ? 'rgba(5, 5, 5, 0.94)' : 'rgba(250, 247, 242, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E8E2D5',
        zIndex: 9998,
        boxShadow: isDark ? '0 -4px 20px rgba(0, 0, 0, 0.7)' : '0 -2px 12px rgba(0, 0, 0, 0.06)',
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
        const activeColor = isDark ? '#FFB800' : '#861820';
        const inactiveColor = isDark ? '#A1A1AA' : '#64748B';

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
                padding: isToolsActive ? '3px 14px' : (isActive ? '3px 10px' : '3px 6px'),
                borderRadius: '10px',
                backgroundColor: isToolsActive 
                  ? (isDark ? 'rgba(255, 184, 0, 0.15)' : '#FFF1F2') 
                  : (isActive ? (isDark ? 'rgba(255, 184, 0, 0.08)' : 'rgba(134, 24, 32, 0.08)') : 'transparent'),
                border: isToolsActive 
                  ? (isDark ? '1px solid rgba(255, 184, 0, 0.35)' : '1px solid rgba(134, 24, 32, 0.25)') 
                  : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? activeColor : inactiveColor,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.15s ease, color 0.15s ease'
                }}
              >
                <IconComponent 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 1.9}
                  fill={isActive && (tab.id === 'home' || tab.id === 'profile') ? activeColor : 'none'}
                />
              </div>
              
              <span 
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? activeColor : inactiveColor,
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
                  width: '20px',
                  height: '2.5px',
                  borderRadius: '9999px',
                  backgroundColor: isDark ? '#FFB800' : '#861820',
                  boxShadow: isDark ? '0 0 8px rgba(255, 184, 0, 0.6)' : '0 2px 6px rgba(134, 24, 32, 0.4)'
                }} 
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
