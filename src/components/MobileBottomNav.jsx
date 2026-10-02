import React from 'react';
import { Home, BookOpen, FileText, Award, Menu, Sparkles } from 'lucide-react';

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

  // Map sub-routes to active parent tab if applicable
  const getActiveNavId = () => {
    if (activeTab === 'home' || !activeTab) return 'home';
    if (activeTab === 'notes' || activeTab.startsWith('notes')) return 'notes';
    if (activeTab === 'pyqs' || activeTab.startsWith('pyqs')) return 'pyqs';
    if (activeTab === 'quizzes' || activeTab.startsWith('quiz')) return 'quizzes';
    return 'more';
  };

  const currentNav = getActiveNavId();

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
        zIndex: 9998,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #ECE7E1',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: '0.45rem',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.5rem)',
        height: '62px'
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentNav === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            aria-label={`Navigate to ${tab.label}`}
            aria-current={isActive ? 'page' : undefined}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.15rem',
              flex: 1,
              padding: '0.2rem 0',
              cursor: 'pointer',
              color: isActive ? '#7A1C28' : '#71717A',
              transition: 'all 0.18s ease',
              position: 'relative'
            }}
          >
            <div style={{
              width: '28px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <IconComponent 
                size={21} 
                strokeWidth={isActive ? 2.5 : 1.9}
                color={isActive ? '#7A1C28' : '#71717A'} 
              />
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  width: '14px',
                  height: '2.5px',
                  backgroundColor: '#7A1C28',
                  borderRadius: '999px'
                }} />
              )}
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: isActive ? 800 : 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.1
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
