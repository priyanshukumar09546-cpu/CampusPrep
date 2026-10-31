import React, { useState, useEffect } from 'react';
import { BookOpen, Wrench, GraduationCap, Sparkles } from 'lucide-react';

export default function RealStatsSection() {
  const [stats, setStats] = useState({
    notesPyqs: '6,500+',
    tools: '20+',
    degrees: '8+',
    access: '100%'
  });

  useEffect(() => {
    let isSubscribed = true;
    fetch('/api/health')
      .then(res => res.json())
      .then(() => {})
      .catch(() => {});
    return () => { isSubscribed = false; };
  }, []);

  const statCards = [
    {
      id: 'resources',
      value: stats.notesPyqs,
      title: 'Notes & PYQs',
      desc: 'Curated & Organized across all semesters',
      icon: BookOpen,
      iconBg: 'rgba(255, 184, 0, 0.12)',
      iconColor: '#FFB800',
      border: 'rgba(255, 184, 0, 0.35)'
    },
    {
      id: 'tools',
      value: stats.tools,
      title: 'Academic Tools',
      desc: 'Study, Practice, Analyze & Career prep',
      icon: Wrench,
      iconBg: 'rgba(56, 189, 248, 0.12)',
      iconColor: '#38BDF8',
      border: 'rgba(56, 189, 248, 0.35)'
    },
    {
      id: 'degrees',
      value: stats.degrees,
      title: 'Degree Programs',
      desc: 'B.Tech, BCA, MCA, MBA, Pharmacy & more',
      icon: GraduationCap,
      iconBg: 'rgba(168, 85, 247, 0.12)',
      iconColor: '#C084FC',
      border: 'rgba(168, 85, 247, 0.35)'
    },
    {
      id: 'access',
      value: stats.access,
      title: 'Free & Open Access',
      desc: 'Dedicated to university students across India',
      icon: Sparkles,
      iconBg: 'rgba(16, 185, 129, 0.12)',
      iconColor: '#34D399',
      border: 'rgba(16, 185, 129, 0.35)'
    }
  ];

  return (
    <section 
      className="pv-scroll-reveal"
      style={{
        backgroundColor: 'transparent',
        padding: '2.5rem 0 3rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          style={{ alignItems: 'stretch' }}
        >
          {statCards.map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                style={{
                  backgroundColor: '#0B0B0B',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.65rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = s.iconColor;
                  e.currentTarget.style.boxShadow = `0 12px 28px rgba(0, 0, 0, 0.7), 0 0 20px ${s.iconColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  backgroundColor: s.iconBg,
                  color: s.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `1px solid ${s.border}`
                }}>
                  <Icon size={24} strokeWidth={2.2} />
                </div>

                {/* Number & Text */}
                <div>
                  <div style={{
                    fontSize: 'clamp(1.75rem, 2.2vw, 2.15rem)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-0.02em'
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#FFB800',
                    marginTop: '0.15rem'
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    fontSize: '0.74rem',
                    color: '#A1A1AA',
                    fontWeight: 400,
                    lineHeight: 1.35,
                    marginTop: '0.1rem'
                  }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
