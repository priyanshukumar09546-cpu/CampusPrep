import React, { useState } from 'react';
import { 
  Code, 
  Users, 
  BarChart2, 
  FileText, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  Award,
  Bot,
  Target,
  Clock,
  CheckCircle2,
  Briefcase,
  Play,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { AVAILABLE_COURSES } from '../data/courseMapping.ts';

export default function MobileInterviewProScreen({ onNavigate, onStartInterview }) {
  const [selectedCourse, setSelectedCourse] = useState('BCA');
  const [selectedRole, setSelectedRole] = useState('Software Developer');

  const assessmentRounds = [
    {
      id: 'aptitude',
      step: '01',
      title: 'Aptitude Round',
      duration: '35 Minutes',
      desc: 'Quantitative, Logical Reasoning, Verbal Ability & Data Interpretation',
      icon: BarChart2,
      color: '#0284C7',
      bg: '#F0F9FF',
      border: '#E0F2FE',
      action: () => onNavigate('interview-aptitude')
    },
    {
      id: 'coding',
      step: '02',
      title: 'Coding Round',
      duration: '60 Minutes',
      desc: 'DSA & algorithmic challenges with automated test case evaluation',
      icon: Code,
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#DBEAFE',
      action: () => onNavigate('interview-coding')
    },
    {
      id: 'technical',
      step: '03',
      title: 'AI Technical Viva',
      duration: '30 Minutes',
      desc: 'Smart adaptive technical questions on Core CS, DBMS, OS & OOPs',
      icon: Bot,
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#EDE9FE',
      action: () => onNavigate('interview-technical')
    },
    {
      id: 'hr',
      step: '04',
      title: 'AI HR / Behavioral',
      duration: '15 Minutes',
      desc: 'Behavioral, situational questions & STAR framework communication analysis',
      icon: Users,
      color: '#EA580C',
      bg: '#FFF7ED',
      border: '#FFEDD5',
      action: () => onNavigate('interview-hr')
    }
  ];

  const popularRoles = [
    'Software Developer',
    'Full Stack Developer',
    'Data Analyst',
    'AI / ML Engineer',
    'Cloud / DevOps Engineer',
    'Product Management'
  ];

  const whyChooseFeatures = [
    {
      title: 'Company-Style Simulation',
      desc: 'Same multi-round pressure: Aptitude + Coding + Technical + HR in one go.',
      icon: Target,
      color: '#059669'
    },
    {
      title: 'Adaptive AI Questions',
      desc: 'Questions evolve dynamically based on your answers and selected tech stack.',
      icon: Sparkles,
      color: '#7C3AED'
    },
    {
      title: 'Instant In-depth Report',
      desc: 'Clear percentile rank, topic-wise strengths, weaknesses and hiring verdict.',
      icon: Award,
      color: '#D97706'
    }
  ];

  return (
    <div 
      className="pv-mobile-interview-pro"
      style={{
        padding: '1rem 1rem 5.5rem',
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      {/* 1. HERO BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1C0A10 0%, #3B121C 55%, #561826 100%)',
        borderRadius: '20px',
        padding: '1.25rem',
        color: '#FFFFFF',
        marginBottom: '1.25rem',
        boxShadow: '0 8px 24px rgba(90, 15, 25, 0.25)',
        border: '1px solid rgba(246, 214, 220, 0.2)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '12px', fontWeight: 800, marginBottom: '0.65rem' }}>
          <Briefcase size={13} color="#FDE047" /> INTERVIEW PRO
        </div>

        <h1 style={{
          margin: '0 0 0.4rem',
          fontSize: '1.35rem',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.25,
          letterSpacing: '-0.02em'
        }}>
          One Test. Real Experience. <br />
          <span style={{ color: '#FCD34D' }}>Placement Ready.</span>
        </h1>

        <p style={{
          margin: '0 0 1rem',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.85)',
          lineHeight: 1.45
        }}>
          Take a complete MNC recruitment simulation with Aptitude, Coding, AI Tech Interview & HR round.
        </p>

        {/* Start Full Assessment Button - Full Width */}
        <button
          type="button"
          onClick={() => onNavigate('interview-confirm')}
          style={{
            width: '100%',
            backgroundColor: '#C88D2D',
            backgroundImage: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            boxSizing: 'border-box'
          }}
        >
          <Play size={16} fill="#FFFFFF" /> Start Complete Assessment (2h 20m)
        </button>
      </div>

      {/* 2. COURSE & TARGET ROLE QUICK SELECTOR */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '1.15rem',
        border: '1.5px solid #E8E2D5',
        marginBottom: '1.25rem',
        boxShadow: '0 2px 8px rgba(35,30,25,0.03)',
        boxSizing: 'border-box'
      }}>
        <h3 style={{ margin: '0 0 0.85rem', fontSize: '14px', fontWeight: 800, color: '#1C1E21', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Target size={16} color="#7A1C28" /> Select Curriculum & Role
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>
              Your Course:
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 2rem 0.6rem 0.75rem',
                  borderRadius: '10px',
                  border: '1.5px solid #E8E2D5',
                  backgroundColor: '#FAF7F2',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#1C1E21',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                {AVAILABLE_COURSES.map(c => (
                  <option key={c.key} value={c.key}>{c.fullName} ({c.name})</option>
                ))}
              </select>
              <ChevronDown size={16} color="#78716C" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>
              Target Job Profile:
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 2rem 0.6rem 0.75rem',
                  borderRadius: '10px',
                  border: '1.5px solid #E8E2D5',
                  backgroundColor: '#FAF7F2',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#1C1E21',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                {popularRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#78716C" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4-ROUND ASSESSMENT STEPS (STACKED VERTICALLY) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h2 style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 800,
            color: '#1C1E21',
            letterSpacing: '-0.01em'
          }}>
            Assessment Stages (4 Rounds)
          </h2>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#7A1C28' }}>
            2h 20m Total
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {assessmentRounds.map((round) => {
            const IconComp = round.icon;
            return (
              <div
                key={round.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '1rem',
                  border: `1.5px solid ${round.border}`,
                  boxShadow: '0 2px 8px rgba(35,30,25,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: round.bg,
                      border: `1.5px solid ${round.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: round.color,
                      flexShrink: 0
                    }}>
                      <IconComp size={18} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#1C1E21' }}>
                        Round {round.step}: {round.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                        <Clock size={12} /> {round.duration}
                      </div>
                    </div>
                  </div>
                </div>

                <p style={{
                  fontSize: '13px',
                  color: '#475569',
                  margin: 0,
                  lineHeight: 1.4
                }}>
                  {round.desc}
                </p>

                {/* Full-width Button */}
                <button
                  type="button"
                  onClick={round.action}
                  style={{
                    width: '100%',
                    backgroundColor: '#FAF7F2',
                    border: `1.5px solid ${round.border}`,
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    color: round.color,
                    fontSize: '14px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <span>Practice {round.title}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. WHY CHOOSE INTERVIEW PRO (STACKED VERTICALLY) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '1.15rem',
        border: '1.5px solid #E8E2D5',
        marginBottom: '1rem',
        boxSizing: 'border-box'
      }}>
        <h3 style={{ margin: '0 0 0.85rem', fontSize: '14px', fontWeight: 800, color: '#1C1E21' }}>
          Why Students Choose Interview Pro
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {whyChooseFeatures.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  flexShrink: 0
                }}>
                  <IconComp size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1C1E21' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.4, marginTop: '0.15rem' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. BOTTOM FIXED ACTION BAR ON MOBILE */}
      <div style={{
        position: 'fixed',
        bottom: '62px',
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E8E2D5',
        padding: '0.6rem 1rem',
        boxShadow: '0 -4px 14px rgba(0,0,0,0.06)',
        boxSizing: 'border-box'
      }}>
        <button
          type="button"
          onClick={() => onNavigate('interview-confirm')}
          style={{
            width: '100%',
            backgroundColor: '#7A1C28',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxSizing: 'border-box',
            boxShadow: '0 4px 12px rgba(122, 28, 40, 0.3)'
          }}
        >
          <span>Start Full 4-Round Assessment</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
