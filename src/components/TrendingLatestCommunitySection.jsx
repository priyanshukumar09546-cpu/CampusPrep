import React, { useState, useEffect } from 'react';
import { Flame, FileText, Briefcase, ArrowRight, Eye, Sparkles, FileDown, CheckCircle, ChevronRight, Calendar } from 'lucide-react';

export default function TrendingLatestCommunitySection({ 
  onSubjectClick, 
  onNoteClick, 
  onDiscussionClick,
  onViewAll 
}) {
  // Authoritative Trending AKTU B.Tech Core Subjects
  const trendingSubjects = [
    { 
      id: 'kcs-401', 
      name: 'Operating System', 
      code: 'KCS-401', 
      branch: 'CSE', 
      year: '2nd Year', 
      sem: 'Sem 4', 
      course: 'B.Tech' 
    },
    { 
      id: 'kcs-301', 
      name: 'Data Structures', 
      code: 'KCS-301', 
      branch: 'CSE', 
      year: '2nd Year', 
      sem: 'Sem 3', 
      course: 'B.Tech' 
    },
    { 
      id: 'kcs-501', 
      name: 'Database Management Systems', 
      code: 'KCS-501', 
      branch: 'CSE', 
      year: '3rd Year', 
      sem: 'Sem 5', 
      course: 'B.Tech' 
    },
    { 
      id: 'kcs-603', 
      name: 'Computer Networks', 
      code: 'KCS-603', 
      branch: 'CSE', 
      year: '3rd Year', 
      sem: 'Sem 6', 
      course: 'B.Tech' 
    },
    { 
      id: 'kcs-502', 
      name: 'Compiler Design', 
      code: 'KCS-502', 
      branch: 'CSE', 
      year: '3rd Year', 
      sem: 'Sem 5', 
      course: 'B.Tech' 
    },
    { 
      id: 'kcs-503', 
      name: 'Design and Analysis of Algorithms', 
      code: 'KCS-503', 
      branch: 'CSE', 
      year: '3rd Year', 
      sem: 'Sem 5', 
      course: 'B.Tech' 
    }
  ];

  // Live real notes fetched from database
  const [realLatestNotes, setRealLatestNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    fetch('/api/notes?course=B.Tech&branch=CSE&limit=6&_t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (!isSubscribed) return;
        if (data && data.success && Array.isArray(data.notes) && data.notes.length > 0) {
          setRealLatestNotes(data.notes.slice(0, 5));
        } else {
          setRealLatestNotes([]);
        }
      })
      .catch(err => {
        if (isSubscribed) console.error('Error loading latest notes:', err);
      })
      .finally(() => {
        if (isSubscribed) setIsLoadingNotes(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const placementModules = [
    { id: 1, title: 'Aptitude Reasoning Drill', sub: 'Quant, Logical & Verbal • 20 Questions', badge: 'Round 1' },
    { id: 2, title: 'Competitive Coding Challenge', sub: 'MongoDB Problem Bank • Python/C++/Java', badge: 'Round 2' },
    { id: 3, title: 'AI Technical Interviewer', sub: 'Turn-Taking Voice Q&A with Misconception Checks', badge: 'Round 3' },
    { id: 4, title: 'AI HR Behavioral Round', sub: 'STAR Framework Situation Analysis', badge: 'Round 4' },
    { id: 5, title: 'Comprehensive Placement Report', sub: 'Mathematical Score & Question Breakdown', badge: 'Report' },
  ];

  // Helper to format date without fake "2 hours ago"
  const formatNoteDate = (note) => {
    if (note.createdAt) {
      try {
        const d = new Date(note.createdAt);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      } catch (e) {}
    }
    return 'Verified PDF';
  };

  return (
    <section style={{
      backgroundColor: '#FAF7F2',
      padding: '2.5rem 0',
      borderBottom: '1.5px solid #E8E2D5'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }} className="three-col-grid">

          {/* COLUMN 1: Trending Subjects */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.4rem',
            border: '1.5px solid #E8E2D5',
            boxShadow: '0 8px 24px rgba(35,30,25,0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} style={{ color: '#EA580C' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                  Trending Subjects
                </h3>
              </div>
              
              <button 
                onClick={() => onViewAll && onViewAll('notes')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C88D2D',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.76rem', color: '#646E78', marginBottom: '1rem', marginTop: '0.2rem' }}>
              Core curriculum subjects for AKTU B.Tech
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {trendingSubjects.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => onSubjectClick && onSubjectClick(sub)}
                  style={{
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid #E8E2D5',
                    borderRadius: '12px',
                    padding: '0.75rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C88D2D';
                    e.currentTarget.style.backgroundColor = '#FDF6E8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E2D5';
                    e.currentTarget.style.backgroundColor = '#FAF7F2';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1C1E21' }}>
                      {sub.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#646E78', fontWeight: 500, marginTop: '0.1rem' }}>
                      {sub.branch} • {sub.year} • {sub.sem}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.7rem',
                    color: '#7A1C28',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: '#ffffff',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    border: '1px solid #E8D3B0'
                  }}>
                    {sub.code} <ChevronRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Latest Notes */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.4rem',
            border: '1.5px solid #E8E2D5',
            boxShadow: '0 8px 24px rgba(35,30,25,0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} style={{ color: '#C88D2D' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                  Latest Notes
                </h3>
              </div>
              
              <button 
                onClick={() => onViewAll && onViewAll('notes')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C88D2D',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.76rem', color: '#646E78', marginBottom: '1rem', marginTop: '0.2rem' }}>
              Real study materials from verified database
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {isLoadingNotes ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>
                  <Sparkles size={20} style={{ animation: 'spin 2s linear infinite', color: '#C88D2D', marginBottom: '0.4rem' }} />
                  <div>Loading latest notes...</div>
                </div>
              ) : realLatestNotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>
                  No recent notes available.
                </div>
              ) : (
                realLatestNotes.map((note, idx) => {
                  const title = note.title || `${note.subject || note.subjectName} Notes`;
                  const subtext = `${note.branch || 'CSE'} • Unit ${note.unit || note.unitNumber || 1}`;
                  const dateStr = formatNoteDate(note);

                  return (
                    <div
                      key={note.id || idx}
                      onClick={() => onNoteClick && onNoteClick(note)}
                      style={{
                        backgroundColor: '#FAF7F2',
                        border: '1.5px solid #E8E2D5',
                        borderRadius: '12px',
                        padding: '0.75rem 0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C88D2D';
                        e.currentTarget.style.backgroundColor = '#FDF6E8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E8E2D5';
                        e.currentTarget.style.backgroundColor = '#FAF7F2';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#FDF6E8',
                          color: '#C88D2D',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <FileDown size={16} />
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: '#1C1E21',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#646E78', marginTop: '0.15rem' }}>
                            {subtext}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        fontSize: '0.7rem',
                        color: '#64748B',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        flexShrink: 0
                      }}>
                        <Calendar size={11} /> {dateStr}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 3: Placement & Interview Pro */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.4rem',
            border: '1.5px solid #E8E2D5',
            boxShadow: '0 8px 24px rgba(35,30,25,0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={20} style={{ color: '#0284c7' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                  Interview Pro
                </h3>
              </div>
              
              <button 
                onClick={() => onViewAll && onViewAll('interview-pro')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                Launch <ArrowRight size={14} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.76rem', color: '#646E78', marginBottom: '1rem', marginTop: '0.2rem' }}>
              4-Stage AI Placement Training &amp; Assessment
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {placementModules.map(mod => (
                <div
                  key={mod.id}
                  onClick={() => onViewAll && onViewAll('interview-pro')}
                  style={{
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid #E8E2D5',
                    borderRadius: '12px',
                    padding: '0.75rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0284c7';
                    e.currentTarget.style.backgroundColor = '#F0F9FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E2D5';
                    e.currentTarget.style.backgroundColor = '#FAF7F2';
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1C1E21', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {mod.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#646E78', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {mod.sub}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.7rem',
                    color: '#0284c7',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #BAE6FD',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                    {mod.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
