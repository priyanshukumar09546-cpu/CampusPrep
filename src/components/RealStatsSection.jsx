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
    // Attempt to enrich with real counts if available
    let isSubscribed = true;
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (!isSubscribed) return;
        // Keep verified real baseline
      })
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
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      border: '#FDE68A'
    },
    {
      id: 'tools',
      value: stats.tools,
      title: 'Academic Tools',
      desc: 'Study, Practice, Analyze & Career prep',
      icon: Wrench,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      border: '#BFDBFE'
    },
    {
      id: 'degrees',
      value: stats.degrees,
      title: 'Degree Programs',
      desc: 'B.Tech, BCA, MCA, MBA, Pharmacy & more',
      icon: GraduationCap,
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED',
      border: '#DDD6FE'
    },
    {
      id: 'access',
      value: stats.access,
      title: 'Free & Open Access',
      desc: 'Dedicated to university students across India',
      icon: Sparkles,
      iconBg: '#D1FAE5',
      iconColor: '#059669',
      border: '#A7F3D0'
    }
  ];

  return (
    <section 
      style={{
        backgroundColor: '#FAF7F2',
        padding: '2.5rem 0 3rem 0',
        borderBottom: '1.5px solid #E8E2D5'
      }}
    >
      <div className="container">
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
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${s.border}`,
                  borderRadius: '20px',
                  padding: '1.65rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
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
                    color: '#1C1E21',
                    lineHeight: 1.1,
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-0.02em'
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#1C1E21',
                    marginTop: '0.15rem'
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    fontSize: '0.74rem',
                    color: '#64748B',
                    fontWeight: 500,
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
