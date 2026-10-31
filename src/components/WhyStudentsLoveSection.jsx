import React from 'react';
import { BookOpen, Target, TrendingUp, UserCheck } from 'lucide-react';

export default function WhyStudentsLoveSection() {
  const features = [
    {
      id: 'verified',
      title: 'Verified & Updated Content',
      desc: 'Unit-wise notes, PYQs and syllabus as per latest university curriculum.',
      icon: BookOpen,
      iconColor: '#FFB800',
      iconBg: 'rgba(255, 184, 0, 0.1)',
      border: 'rgba(255, 184, 0, 0.3)'
    },
    {
      id: 'practice',
      title: 'Practice & Improve',
      desc: 'Quizzes, mock tests and topic-wise practice for better preparation.',
      icon: Target,
      iconColor: '#FF8C00',
      iconBg: 'rgba(255, 140, 0, 0.1)',
      border: 'rgba(255, 140, 0, 0.3)'
    },
    {
      id: 'career',
      title: 'Career Ready',
      desc: 'Interview prep, internships, jobs and engineering project resources.',
      icon: TrendingUp,
      iconColor: '#A855F7',
      iconBg: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.3)'
    },
    {
      id: 'progress',
      title: 'Track Your Progress',
      desc: 'Plan your study, track your learning, streaks and stay consistent.',
      icon: UserCheck,
      iconColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)'
    }
  ];

  return (
    <section 
      className="pv-scroll-reveal"
      style={{
        backgroundColor: 'transparent',
        padding: '3.5rem 0 2.5rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em',
            marginBottom: '0.45rem'
          }}>
            <span>💡</span>
            <h2>Why Students Love <span style={{ color: '#FFB800' }}>ProfessorVirus</span>?</h2>
          </div>
          <p style={{
            fontSize: '0.95rem',
            color: '#A1A1AA',
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
                  backgroundColor: '#0B0B0B',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.75rem 1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = f.iconColor;
                  e.currentTarget.style.boxShadow = `0 12px 28px rgba(0, 0, 0, 0.7), 0 0 20px ${f.iconColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
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
                  color: '#FFFFFF',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.3
                }}>
                  {f.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.84rem',
                  color: '#A1A1AA',
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
