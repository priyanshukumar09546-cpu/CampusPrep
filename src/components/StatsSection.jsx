import React, { useState, useEffect } from 'react';
import { Users, FileText, BookOpen, HelpCircle, ThumbsUp, Database } from 'lucide-react';

export default function StatsSection({ statsData }) {
  const [stats, setStats] = useState([
    { id: 'students', value: '0', label: 'Students Learning', icon: Users, color: '#C88D2D', bgColor: '#FDF6E8' },
    { id: 'pyqs', value: '0', label: 'PYQs Available', icon: FileText, color: '#B45309', bgColor: '#FFFBEB' },
    { id: 'notes', value: '0', label: 'Notes & Resources', icon: BookOpen, color: '#7C3AED', bgColor: '#F5F3FF' },
    { id: 'quizzes', value: '0', label: 'Practice Quizzes', icon: HelpCircle, color: '#EA580C', bgColor: '#FFF7ED' },
    { id: 'feedback', value: '0%', label: 'Positive Feedback', icon: ThumbsUp, color: '#D97706', bgColor: '#FEF3C7' }
  ]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => {
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) {
          throw new Error('Backend not available');
        }
        return res.json();
      })
      .then(data => {
        if (data.success && data.stats) {
          setIsLive(true);
          const iconMap = { Users, FileText, BookOpen, HelpCircle, ThumbsUp };
          const colorMap = {
            students: { color: '#C88D2D', bgColor: '#FDF6E8' },
            pyqs: { color: '#B45309', bgColor: '#FFFBEB' },
            notes: { color: '#7C3AED', bgColor: '#F5F3FF' },
            quizzes: { color: '#EA580C', bgColor: '#FFF7ED' },
            feedback: { color: '#D97706', bgColor: '#FEF3C7' }
          };
          setStats(data.stats.map(s => ({
            ...s,
            icon: iconMap[s.iconName] || Users,
            color: colorMap[s.id]?.color || '#C88D2D',
            bgColor: colorMap[s.id]?.bgColor || '#FDF6E8'
          })));
        }
      })
      .catch(() => {});
  }, []);

  const displayStats = statsData || stats;

  return (
    <section style={{
      backgroundColor: 'transparent',
      padding: '2rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
    }} className="pv-scroll-reveal">
      <div className="container">
        
        {/* Real DB Status Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: '0.6rem'
        }}>
          <span style={{
            fontSize: '0.68rem',
            color: '#A1A1AA',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            backgroundColor: '#0B0B0B',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Database size={12} style={{ color: isLive ? '#FFB800' : '#A1A1AA' }} />
            {isLive ? 'Real Database Metrics' : 'Live DB Syncing...'}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {displayStats.map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                style={{
                  backgroundColor: '#0B0B0B',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.9), 0 0 16px rgba(255, 184, 0, 0.2)';
                  e.currentTarget.style.borderColor = '#FFB800';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 184, 0, 0.12)',
                  color: '#FFB800',
                  border: '1px solid rgba(255, 184, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.1
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#A1A1AA',
                    marginTop: '0.15rem'
                  }}>
                    {s.label}
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
