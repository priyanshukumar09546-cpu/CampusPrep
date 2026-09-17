import React, { useState, useEffect } from 'react';
import { Users, FileText, BookOpen, HelpCircle, ThumbsUp, Database } from 'lucide-react';

export default function StatsSection({ statsData }) {
  const [stats, setStats] = useState([
    { id: 'students', value: '0', label: 'Students Learning', icon: Users, color: '#10b981', bgColor: '#e6f4ed' },
    { id: 'pyqs', value: '0', label: 'PYQs Available', icon: FileText, color: '#059669', bgColor: '#d1fae5' },
    { id: 'notes', value: '0', label: 'Notes & Resources', icon: BookOpen, color: '#8b5cf6', bgColor: '#f3e8ff' },
    { id: 'quizzes', value: '0', label: 'Practice Quizzes', icon: HelpCircle, color: '#f97316', bgColor: '#ffedd5' },
    { id: 'feedback', value: '0%', label: 'Positive Feedback', icon: ThumbsUp, color: '#eab308', bgColor: '#fef9c3' }
  ]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setIsLive(true);
          const iconMap = { Users, FileText, BookOpen, HelpCircle, ThumbsUp };
          const colorMap = {
            students: { color: '#10b981', bgColor: '#e6f4ed' },
            pyqs: { color: '#059669', bgColor: '#d1fae5' },
            notes: { color: '#8b5cf6', bgColor: '#f3e8ff' },
            quizzes: { color: '#f97316', bgColor: '#ffedd5' },
            feedback: { color: '#eab308', bgColor: '#fef9c3' }
          };
          setStats(data.stats.map(s => ({
            ...s,
            icon: iconMap[s.iconName] || Users,
            color: colorMap[s.id]?.color || '#10b981',
            bgColor: colorMap[s.id]?.bgColor || '#e6f4ed'
          })));
        }
      })
      .catch(() => {});
  }, []);

  const displayStats = statsData || stats;

  return (
    <section style={{
      backgroundColor: '#ffffff',
      padding: '1.75rem 0',
      borderBottom: '1px solid #eae5d9',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
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
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            backgroundColor: '#f8fafc',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0'
          }}>
            <Database size={12} style={{ color: isLive ? '#10b981' : '#64748b' }} />
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
                  backgroundColor: '#fbf9f3',
                  border: '1px solid #eee8db',
                  borderRadius: '16px',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: s.bgColor,
                  color: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={22} />
                </div>
                
                <div>
                  <div style={{
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    color: '#0f172a',
                    lineHeight: 1.1
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#64748b',
                    marginTop: '0.1rem'
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
