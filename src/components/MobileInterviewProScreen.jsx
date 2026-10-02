import React from 'react';
import { 
  Code, 
  Users, 
  BarChart2, 
  FileText, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  Award
} from 'lucide-react';

export default function MobileInterviewProScreen({ onNavigate, onStartInterview }) {
  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      desc: '50+ questions',
      icon: Code,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      action: () => onNavigate('interview-technical')
    },
    {
      id: 'hr',
      title: 'HR Interview',
      desc: 'Common HR questions',
      icon: Users,
      iconColor: '#9333EA',
      iconBg: '#FAF5FF',
      iconBorder: '#F3E8FF',
      action: () => onNavigate('interview-hr')
    },
    {
      id: 'aptitude',
      title: 'Aptitude',
      desc: 'Quantitative & Logical',
      icon: BarChart2,
      iconColor: '#0284C7',
      iconBg: '#F0F9FF',
      iconBorder: '#E0F2FE',
      action: () => onNavigate('interview-aptitude')
    },
    {
      id: 'resume-review',
      title: 'Resume Review',
      desc: 'Get AI feedback',
      icon: FileText,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      iconBorder: '#DCFCE7',
      action: () => onNavigate('resume-maker')
    }
  ];

  return (
    <div 
      className="pv-mobile-interview-pro"
      style={{
        padding: '1rem 1rem 5.5rem',
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. HERO BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1C0A10 0%, #3B121C 55%, #561826 100%)',
        borderRadius: '22px',
        padding: '1.25rem',
        color: '#FFFFFF',
        marginBottom: '1.45rem',
        boxShadow: '0 10px 28px rgba(90, 15, 25, 0.28)',
        border: '1px solid rgba(246, 214, 220, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              margin: '0 0 0.35rem',
              fontSize: '1.2rem',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.25,
              letterSpacing: '-0.02em'
            }}>
              Get Job Ready with AI-Powered Mock Interviews
            </h2>

            <p style={{
              margin: '0 0 0.85rem',
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.82)',
              lineHeight: 1.35
            }}>
              Practice real interview questions and get instant feedback from AI.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('interview-confirm')}
              style={{
                backgroundColor: '#7A1C28',
                backgroundImage: 'linear-gradient(135deg, #9B2838 0%, #7A1C28 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '999px',
                padding: '0.5rem 1.15rem',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
              }}
            >
              Start Interview <ArrowRight size={14} />
            </button>
          </div>

          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img 
              src="/assets/interview_pro_hero_illustration.png" 
              alt="Interview Avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.src = '/assets/user_avatar_priyanshu.png';
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. CHOOSE INTERVIEW TYPE SECTION */}
      <h3 style={{
        margin: '0 0 0.75rem',
        fontSize: '1rem',
        fontWeight: 800,
        color: '#1C1E21',
        letterSpacing: '-0.01em'
      }}>
        Choose Interview Type
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {interviewTypes.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') item.action(); }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '0.95rem 1.15rem',
                border: '1px solid #ECE7E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.18s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '13px',
                  backgroundColor: item.iconBg,
                  border: `1.5px solid ${item.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.iconColor,
                  flexShrink: 0
                }}>
                  <IconComp size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C1E21' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#71717A', marginTop: '0.15rem' }}>
                    {item.desc}
                  </div>
                </div>
              </div>

              <ChevronRight size={16} color="#A1A1AA" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
