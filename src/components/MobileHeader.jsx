import React from 'react';
import { ArrowLeft, Bell, Search, GraduationCap, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function MobileHeader({ activeTab, onNavigate, onOpenUpdates, onOpenSearch }) {
  const isHome = activeTab === 'home' || !activeTab;

  const getPageTitle = () => {
    switch (activeTab) {
      case 'notes': return 'Notes';
      case 'pyqs': return 'PYQs';
      case 'syllabus': return 'Syllabus';
      case 'quizzes': return 'Quizzes';
      case 'interview-pro':
      case 'interview-start':
      case 'interview-coding':
      case 'interview-technical':
      case 'interview-hr':
      case 'interview-report':
        return 'Interview Pro';
      case 'resume-maker': return 'Resume Builder';
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
      case 'more': return 'More & Profile';
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
        zIndex: 9997,
        backgroundColor: '#FAF7F2',
        borderBottom: '1px solid #ECE7DF',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        boxSizing: 'border-box'
      }}
    >
      {isHome ? (
        <>
          {/* HOME BRANDING */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EAE3D7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}>
              <img 
                src="/assets/navbar_logo.png" 
                alt="ProfessorVirus" 
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{
                fontSize: '1.05rem',
                fontWeight: 900,
                color: '#1C1E21',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                ProfessorVirus
              </div>
              <div style={{
                fontSize: '0.68rem',
                color: '#7A1C28',
                fontWeight: 700,
                letterSpacing: '0.02em',
                marginTop: '1px'
              }}>
                B.Tech • BCA • M.Tech • MCA
              </div>
            </div>
          </div>

          {/* HOME RIGHT CONTROLS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={onOpenUpdates}
              aria-label="Academic alerts and notifications"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E2D6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1F2421',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
              }}
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#E11D48',
                border: '1.5px solid #FFFFFF'
              }} />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* SUB-PAGE BACK BUTTON & TITLE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              aria-label="Go back to Home"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E2D6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1F2421',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <h1 style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#1C1E21',
              letterSpacing: '-0.015em'
            }}>
              {getPageTitle()}
            </h1>
          </div>

          {/* SUB-PAGE RIGHT ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => onNavigate('notes')}
              aria-label="Search study material"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E2D6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1F2421',
                cursor: 'pointer'
              }}
            >
              <Search size={17} />
            </button>
          </div>
        </>
      )}
    </header>
  );
}
