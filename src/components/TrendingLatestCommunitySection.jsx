import React from 'react';
import { Flame, FileText, MessageSquare, ArrowRight, Eye, Clock, MessageCircle, FileDown } from 'lucide-react';

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

  const communityDiscussions = [
    { id: 1, title: 'How to prepare for OS in 15 days?', sub: 'CSE • 12 replies', time: '2 hours ago' },
    { id: 2, title: 'Difference between deadlock and starvation?', sub: 'CSE • 8 replies', time: '5 hours ago' },
    { id: 3, title: 'Can anyone share unit 3 notes of CN?', sub: 'CSE • 14 replies', time: '1 day ago' },
    { id: 4, title: 'Best resources for Maths IV?', sub: 'Common • 10 replies', time: '1 day ago' },
    { id: 5, title: 'Placement preparation with AKTU syllabus?', sub: 'General • 6 replies', time: '2 hours ago' },
  ];

  return (
    <section style={{
      backgroundColor: '#f9f7f1',
      padding: '2.5rem 0',
      borderBottom: '1px solid #eae5d9'
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
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} style={{ color: '#f97316' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Trending Subjects
                </h3>
              </div>
              
              <button 
                onClick={() => onViewAll && onViewAll('trending')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0d5c3a',
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
            
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '1rem' }}>
              Most popular among AKTU students
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {trendingSubjects.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => onSubjectClick && onSubjectClick(sub)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.75rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0d5c3a';
                    e.currentTarget.style.backgroundColor = '#e6f4ed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {sub.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginTop: '0.1rem' }}>
                      {sub.branch} - {sub.sem}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.7rem',
                    color: '#0d5c3a',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: '#ffffff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    border: '1px solid #cbd5e1'
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
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Latest Notes
                </h3>
              </div>
              
              <button 
                onClick={() => onViewAll && onViewAll('notes')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0d5c3a',
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
            
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '1rem' }}>
              Recently uploaded study materials
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {latestNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => onNoteClick && onNoteClick(note)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.75rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.backgroundColor = '#ecfdf5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#fef2f2',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <FileDown size={16} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                        {note.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {note.sub}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={11} /> {note.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: Community Discussions */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.4rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={20} style={{ color: '#0284c7' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Community Discussions
                </h3>
              </div>
              
              <button 
                onClick={() => onViewAll && onViewAll('community')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0d5c3a',
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
            
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '1rem' }}>
              Ask questions & discuss with peers
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {communityDiscussions.map(disc => (
                <div
                  key={disc.id}
                  onClick={() => onDiscussionClick && onDiscussionClick(disc)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
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
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <MessageCircle size={16} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                        {disc.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {disc.sub}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={11} /> {disc.time}
                  </div>
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
