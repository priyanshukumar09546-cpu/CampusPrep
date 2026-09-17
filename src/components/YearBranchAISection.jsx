import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Lightbulb, 
  ArrowRight, 
  Cpu, 
  Radio, 
  Wrench, 
  Building2, 
  Code, 
  Zap 
} from 'lucide-react';

export default function YearBranchAISection({ onSelectYear, onSelectBranch, onOpenAI }) {
  const years = [
    { id: '1st', name: '1st Year', sem: 'Sem 1 & 2', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    { id: '2nd', name: '2nd Year', sem: 'Sem 3 & 4', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    { id: '3rd', name: '3rd Year', sem: 'Sem 5 & 6', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    { id: '4th', name: '4th Year', sem: 'Sem 7 & 8', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  ];

  const popularBranches = [
    { code: 'CSE', icon: Code },
    { code: 'ECE', icon: Radio },
    { code: 'ME', icon: Wrench },
    { code: 'CE', icon: Building2 },
    { code: 'IT', icon: Cpu },
    { code: 'EE', icon: Zap },
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
          gap: '1.25rem',
          alignItems: 'stretch'
        }} className="yb-grid">

          {/* LEFT CARD: Choose Your Year */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#e6f4ed',
                  color: '#0d5c3a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GraduationCap size={18} />
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Choose Your Year
                </h2>
              </div>
              
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.2rem', fontWeight: 500 }}>
                Your journey, our support — pick your year.
              </p>

              {/* 4 Year Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                {years.map(y => (
                  <div
                    key={y.id}
                    onClick={() => onSelectYear && onSelectYear(y.id)}
                    style={{
                      backgroundColor: y.bg,
                      border: `1.5px solid ${y.border}`,
                      borderRadius: '14px',
                      padding: '1rem 0.75rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: y.color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.4rem'
                    }}>
                      <GraduationCap size={16} />
                    </div>
                    
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>
                      {y.name}
                    </div>
                    
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '0.1rem' }}>
                      {y.sem}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER CARD: Popular Branches */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#e6f4ed',
                    color: '#0d5c3a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin size={18} />
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    Popular Branches
                  </h2>
                </div>

                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#0d5c3a',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}>
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {/* 6 Branch Grid Tiles */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.75rem',
                marginTop: '1.2rem'
              }}>
                {popularBranches.map(b => {
                  const BIcon = b.icon;
                  return (
                    <div
                      key={b.code}
                      onClick={() => onSelectBranch && onSelectBranch(b.code)}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '1.1rem 0.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
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
                      <BIcon size={20} style={{ color: '#0d5c3a', marginBottom: '0.4rem' }} />
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                        {b.code}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Ask Virus (AI Study Buddy) */}
          <div style={{
            backgroundColor: '#0c3829',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '2px solid #1a563f',
            boxShadow: '0 8px 24px rgba(12,56,41,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fde047', marginBottom: '0.5rem' }}>
                <Lightbulb size={20} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                  Ask Virus <span style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 500 }}>(AI Study Buddy)</span>
                </h2>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4, marginTop: '0.4rem' }}>
                No doubt is foolish! Ask anything about AKTU subjects, get clear explanations, notes, solved examples and more.
              </p>
            </div>

            {/* Bottom Row inside AI Card: Virus Image + Button + Sticky note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              position: 'relative'
            }}>
              {/* Mascot Thumbnail */}
              <div style={{
                width: '65px',
                height: '75px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1.5px solid #34d399',
                backgroundColor: '#1e293b',
                flexShrink: 0
              }}>
                <img
                  src="/assets/ai_virus.png"
                  alt="Virus Mascot"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/navbar_logo.png';
                  }}
                />
              </div>

              {/* Ask Now Button */}
              <button
                onClick={onOpenAI}
                className="btn-primary"
                style={{
                  backgroundColor: '#059669',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(5,150,105,0.4)'
                }}
              >
                Ask Now <ArrowRight size={16} />
              </button>
            </div>

            {/* Yellow Sticky Note Doodle on Right */}
            <div className="sticky-note" style={{
              position: 'absolute',
              bottom: '10px',
              right: '-10px',
              transform: 'rotate(5deg)',
              padding: '0.35rem 0.6rem',
              fontSize: '0.68rem',
              fontFamily: "'Kalam', cursive",
              fontWeight: 700,
              color: '#1e293b',
              borderRadius: '4px',
              pointerEvents: 'none'
            }}>
              Doubts? <br />
              Yahin puch lo! <br />
              <span style={{ color: '#047857' }}>— Virus</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .yb-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
