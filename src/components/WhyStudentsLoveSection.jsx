import React from 'react';
import { BookOpen, Target, TrendingUp, UserCheck } from 'lucide-react';

export default function WhyStudentsLoveSection() {
  const features = [
    {
      id: 'verified',
      title: 'Verified & Updated Content',
      desc: 'Unit-wise notes, PYQs and syllabus as per latest university curriculum.',
      icon: BookOpen,
      iconColor: '#BE123C',
      iconBg: '#FFE4E6',
      border: '#FECDD3'
    },
    {
      id: 'practice',
      title: 'Practice & Improve',
      desc: 'Quizzes, mock tests and topic-wise practice for better preparation.',
      icon: Target,
      iconColor: '#EA580C',
      iconBg: '#FFEDD5',
      border: '#FED7AA'
    },
    {
      id: 'career',
      title: 'Career Ready',
      desc: 'Interview prep, internships, jobs and engineering project resources.',
      icon: TrendingUp,
      iconColor: '#7C3AED',
      iconBg: '#EDE9FE',
      border: '#DDD6FE'
    },
    {
      id: 'progress',
      title: 'Track Your Progress',
      desc: 'Plan your study, track your learning, streaks and stay consistent.',
      icon: UserCheck,
      iconColor: '#059669',
      iconBg: '#D1FAE5',
      border: '#A7F3D0'
    }
  ];

  return (
    <section 
      style={{
        backgroundColor: '#FAF7F2',
        padding: '3.5rem 0 2.5rem 0',
        borderBottom: '1.5px solid #E8E2D5'
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
            fontWeight: 800,
            color: '#1C1E21',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em',
            marginBottom: '0.45rem'
          }}>
            <span role="img" aria-label="lightbulb">💡</span>
            <h2>Why Students Love ProfessorVirus?</h2>
          </div>
          <p style={{
            fontSize: '0.95rem',
            color: '#64748B',
            fontWeight: 500,
            margin: 0
          }}>
            Everything you need to study, practice and grow — in one place.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          style={{ alignItems: 'stretch' }}
        >
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${f.border}`,
                  borderRadius: '20px',
                  padding: '1.75rem 1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 16px rgba(35,30,25,0.04)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(35,30,25,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(35,30,25,0.04)';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: f.iconBg,
                  color: f.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: `1px solid ${f.border}`
                }}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#1C1E21',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.3
                }}>
                  {f.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.84rem',
                  color: '#64748B',
                  lineHeight: 1.55,
                  margin: 0
                }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
