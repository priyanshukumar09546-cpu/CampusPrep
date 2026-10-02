import React from 'react';
import { 
  User, 
  GraduationCap, 
  Zap, 
  Briefcase, 
  FileText, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  Download
} from 'lucide-react';

export default function MobileResumeBuilderScreen({ onStartBuilder }) {
  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      desc: 'Basic details about you',
      icon: User,
      iconColor: '#E11D48',
      iconBg: '#FFF1F2',
      iconBorder: '#FFE4E6'
    },
    {
      id: 'education',
      title: 'Education',
      desc: 'Your academic background',
      icon: GraduationCap,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE'
    },
    {
      id: 'skills',
      title: 'Skills',
      desc: 'Add your technical skills',
      icon: Zap,
      iconColor: '#7C3AED',
      iconBg: '#F5F3FF',
      iconBorder: '#EDE9FE'
    },
    {
      id: 'projects',
      title: 'Projects',
      desc: 'Showcase your projects',
      icon: Briefcase,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A'
    },
    {
      id: 'preview',
      title: 'Preview & Download',
      desc: 'Generate your resume',
      icon: FileText,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      iconBorder: '#D1FAE5'
    }
  ];

  return (
    <div 
      className="pv-mobile-resume-builder"
      style={{
        padding: '1rem 1rem 5.5rem',
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. HERO CARD */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '22px',
        padding: '1.25rem',
        border: '1px solid #ECE7E0',
        marginBottom: '1.35rem',
        boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{
            margin: '0 0 0.35rem',
            fontSize: '1.15rem',
            fontWeight: 900,
            color: '#1C1E21',
            lineHeight: 1.25,
            letterSpacing: '-0.02em'
          }}>
            Create a <span style={{ color: '#7A1C28' }}>Professional</span> Resume with AI
          </h2>

          <p style={{
            margin: 0,
            fontSize: '0.78rem',
            color: '#555555',
            lineHeight: 1.35
          }}>
            Build a job-winning, ATS-optimized resume in minutes.
          </p>
        </div>

        {/* Mini Resume Mockup Tile */}
        <div style={{
          width: '64px',
          height: '80px',
          backgroundColor: '#FAF8F5',
          borderRadius: '10px',
          border: '1.5px solid #E2D9CC',
          padding: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexShrink: 0
        }}>
          <div style={{ width: '40%', height: '5px', backgroundColor: '#7A1C28', borderRadius: '2px' }} />
          <div style={{ width: '80%', height: '3px', backgroundColor: '#CBD5E1', borderRadius: '1px' }} />
          <div style={{ width: '95%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '1px' }} />
          <div style={{ width: '70%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '1px' }} />
          <div style={{ width: '50%', height: '4px', backgroundColor: '#C88D2D', borderRadius: '2px', marginTop: '3px' }} />
          <div style={{ width: '90%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '1px' }} />
          <div style={{ width: '75%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '1px' }} />
        </div>
      </div>

      {/* 2. STEPS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
        {steps.map((s) => {
          const IconComp = s.icon;
          return (
            <div
              key={s.id}
              onClick={onStartBuilder}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onStartBuilder(); }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '0.95rem 1.15rem',
                border: '1px solid #ECE7E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.18s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '13px',
                  backgroundColor: s.iconBg,
                  border: `1.5px solid ${s.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: s.iconColor,
                  flexShrink: 0
                }}>
                  <IconComp size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1C1E21' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#71717A', marginTop: '0.15rem' }}>
                    {s.desc}
                  </div>
                </div>
              </div>

              <ChevronRight size={16} color="#A1A1AA" />
            </div>
          );
        })}
      </div>

      {/* 3. CTA BUTTON */}
      <button
        type="button"
        onClick={onStartBuilder}
        style={{
          width: '100%',
          backgroundColor: '#7A1C28',
          backgroundImage: 'linear-gradient(135deg, #85182A 0%, #63121F 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '999px',
          padding: '0.95rem',
          fontSize: '0.92rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          boxShadow: '0 6px 18px rgba(122, 28, 40, 0.35)',
          transition: 'all 0.2s ease'
        }}
      >
        <span>Create My Resume</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
