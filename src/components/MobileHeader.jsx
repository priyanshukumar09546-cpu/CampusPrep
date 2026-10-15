import React from 'react';
import { ArrowLeft, Bell, Search, GraduationCap, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function MobileHeader({ activeTab, onNavigate, onOpenUpdates, onOpenSearch, selectedCourse = 'B.Tech' }) {
  const isHome = activeTab === 'home' || activeTab === 'more' || activeTab === 'notes' || activeTab === 'pyqs' || activeTab === 'progress' || activeTab === 'profile' || activeTab === 'result-cgpa' || activeTab === 'pdf-maker' || !activeTab;

  const getPageTitle = () => {
    switch (activeTab) {
      case 'notes': return `${selectedCourse || 'B.Tech'} Notes`;
      case 'pyqs': return `${selectedCourse || 'B.Tech'} PYQs`;
      case 'syllabus': return 'Syllabus';
      case 'quizzes': return 'Quizzes';
      case 'interview-pro':
      case 'interview-start':
      case 'interview-coding':
      case 'interview-technical':
      case 'interview-hr':
      case 'interview-report':
        return 'Interview Pro';
      case 'resume-maker': return 'LaTeX Resume Maker';
      case 'aistudy': return 'Ask Virus';
      case 'attendance-calculator': return 'Attendance Calculator';
      case 'timetable': return 'Timetable';
      case 'scholarships':
      case 'scholarship-detail':
        return 'Scholarships';
      case 'internships-jobs':
      case 'opportunity-detail':
        return 'Internships & Jobs';
      case 'project-ideas':
      case 'project-detail':
        return 'Project Ideas';
      case 'competitive-exams': return 'Competitive Exams';
      case 'important-links': return 'Important Links';
      case 'pdf-maker': return 'PDF Maker';
      case 'result-cgpa': return 'Result & SGPA';
      case 'more': return 'Tools & More';
      case 'login':
      case 'signin':
        return 'Sign In';
      case 'signup': return 'Create Account';
      default: return 'ProfessorVirus';
    }
  };

  return (
    <header
      role="banner"
      className="pv-mobile-header"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '100vw',
        zIndex: 9997,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #F1F5F9',
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        boxSizing: 'border-box'
      }}
    >
      {isHome ? (
        <>
          {/* HOME BRANDING — Real ProfessorVirus Logo & Typography from reference */}
          <div 
            onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}
          >
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #C88D2D',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(200, 141, 45, 0.18)',
                flexShrink: 0
              }}
            >
              <img 
                src="/assets/navbar_logo.png" 
                alt="ProfessorVirus Mascot" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/navbar_logo.jpg';
                }}
              />
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div 
                style={{
                  fontSize: '1rem',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: '0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ color: '#0F172A' }}>PROFESSOR</span>
                <span style={{ color: '#781416' }}>VIRUS</span>
              </div>
              <div 
                style={{
                  fontSize: '0.58rem',
                  color: '#64748B',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                NOTES • PYQ • TOOLS • ALL COURSES
              </div>
            </div>
          </div>

          {/* HOME RIGHT CONTROLS: Notification Bell with Red Badge Dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={onOpenUpdates || (() => onNavigate('interview-pro'))}
              aria-label="Academic alerts and notifications"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E293B',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <Bell size={18} strokeWidth={2.2} />
              <span 
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  border: '1.5px solid #FFFFFF'
                }} 
              />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* SUB-PAGE BACK BUTTON & TITLE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}
              aria-label="Go back to Home"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E293B',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}
            >
              <ArrowLeft size={18} strokeWidth={2.3} />
            </button>
            <h1 
              style={{
                margin: 0,
                fontSize: '1.02rem',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.015em',
                lineHeight: 1.2
              }}
            >
              {getPageTitle()}
            </h1>
          </div>

          {/* SUB-PAGE RIGHT ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('notes') : (window.location.href = '/notes')}
              aria-label="Search study material"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E293B',
                cursor: 'pointer'
              }}
            >
              <Search size={17} strokeWidth={2.2} />
            </button>
          </div>
        </>
      )}
    </header>
  );
}
