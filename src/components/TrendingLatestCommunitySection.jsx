import React from 'react';
import { Flame, FileText, Briefcase, ArrowRight, Eye, Clock, Sparkles, FileDown, CheckCircle } from 'lucide-react';

export default function TrendingLatestCommunitySection({ 
  onSubjectClick, 
  onNoteClick, 
  onDiscussionClick,
  onViewAll 
}) {
  const trendingSubjects = [
    { id: 1, name: 'Operating System', branch: 'CSE', sem: 'Sem 4', views: '12.4K views' },
    { id: 2, name: 'Data Structures', branch: 'CSE', sem: 'Sem 3', views: '10.8K views' },
    { id: 3, name: 'DBMS', branch: 'CSE', sem: 'Sem 5', views: '9.6K views' },
    { id: 4, name: 'Computer Networks', branch: 'CSE', sem: 'Sem 5', views: '9.1K views' },
    { id: 5, name: 'OOPs with Java', branch: 'CSE', sem: 'Sem 4', views: '8.7K views' },
    { id: 6, name: 'Discrete Structures', branch: 'CSE', sem: 'Sem 3', views: '8.2K views' },
  ];

  const latestNotes = [
    { id: 1, title: 'Operating System – Unit 1 Notes', sub: 'CSE - Sem 4 • PDF', time: '2 hours ago' },
    { id: 2, title: 'DBMS – Unit 3 Notes', sub: 'CSE - Sem 5 • PDF', time: '5 hours ago' },
    { id: 3, title: 'Computer Networks – Imp Questions', sub: 'CSE - Sem 5 • PDF', time: '1 day ago' },
    { id: 4, title: 'Maths IV – Short Notes', sub: 'Common • PDF', time: '2 days ago' },
    { id: 5, title: 'TAFL – Unit 2 Notes', sub: 'CSE - Sem 4 • PDF', time: '2 days ago' },
  ];

  const placementModules = [
    { id: 1, title: 'Aptitude Reasoning Drill', sub: 'Quant, Logical & Verbal • 20 Questions', badge: 'Round 1' },
    { id: 2, title: 'Competitive Coding Challenge', sub: 'MongoDB Problem Bank • Python/C++/Java', badge: 'Round 2' },
    { id: 3, title: 'AI Technical Interviewer', sub: 'Turn-Taking Voice Q&A with Misconception Checks', badge: 'Round 3' },
    { id: 4, title: 'AI HR Behavioral Round', sub: 'STAR Framework Situation Analysis', badge: 'Round 4' },
    { id: 5, title: 'Comprehensive Placement Report', sub: 'Mathematical Score & Question Breakdown', badge: 'Report' },
  ];

  return (
    <section style={{
      backgroundColor: '#FAF7F2',
      padding: '2.5rem 0',
      borderBottom: '1.5px solid #E8E2D5'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
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
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21' }}>
                  Trending Subjects
                </h3>
              </div>
              
              <button 
                onClick={() => onViewAll && onViewAll('trending')}
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
            
            <p style={{ fontSize: '0.76rem', color: '#646E78', marginBottom: '1rem' }}>
              Most popular among AKTU students
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
                      {sub.branch} - {sub.sem}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.7rem',
                    color: '#C88D2D',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: '#ffffff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    border: '1px solid #E8D3B0'
                  }}>
                    <Eye size={12} /> {sub.views}
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
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21' }}>
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
            
            <p style={{ fontSize: '0.76rem', color: '#646E78', marginBottom: '1rem' }}>
              Recently uploaded study materials
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {latestNotes.map(note => (
                <div
                  key={note.id}
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#FDF6E8',
                      color: '#C88D2D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <FileDown size={16} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1C1E21', lineHeight: 1.3 }}>
                        {note.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#646E78', marginTop: '0.15rem' }}>
                        {note.sub}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#909AA4', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={11} /> {note.time}
                  </div>
                </div>
              ))}
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
                <Briefcase size={20} style={{ color: '#781416' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21' }}>
                  Interview Pro Drills
                </h3>
              </div>
              
              <button 
                onClick={() => onViewAll && onViewAll('interview-pro')}
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
                Launch <ArrowRight size={14} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '1rem' }}>
              4-Stage assessment with voice AI & live coding
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {placementModules.map(item => (
                <div
                  key={item.id}
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
                    e.currentTarget.style.borderColor = '#781416';
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E2D5';
                    e.currentTarget.style.backgroundColor = '#FAF7F2';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#FEF2F2',
                      color: '#781416',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Sparkles size={16} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1C1E21', lineHeight: 1.3 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: '#FDF6E8',
                    color: '#8A5D00',
                    border: '1px solid #E8D3B0',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .three-col-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
