import React, { useState } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  ArrowRight, 
  Cpu, 
  Radio, 
  Wrench, 
  Building2, 
  Code, 
  Zap,
  Bot,
  Sparkles
} from 'lucide-react';

/* 
  ===================================================================
  HOMEPAGE PERMANENT ASSET RULE (PROTECTED DESIGN ASSET)
  ===================================================================
  - Provided Virus character artwork (/assets/ask_virus_character.png)
    is a PERMANENT APPROVED DESIGN ASSET.
  - DO NOT REMOVE, REPLACE, OR CROP THIS ARTWORK IN FUTURE REFACTORS.
  ===================================================================
*/

export default function YearBranchAISection({ onSelectYear, onSelectBranch, onOpenAI }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    // Only apply desktop mouse parallax if user hasn't set reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const card = e.currentTarget.getBoundingClientRect();
    const cardCenterX = card.left + card.width / 2;
    const cardCenterY = card.top + card.height / 2;
    
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;
    
    // Calculate tilt angles (max ~12deg)
    const rotateX = -(mouseY / (card.height / 2)) * 12;
    const rotateY = (mouseX / (card.width / 2)) * 12;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const years = [
    { id: '1st', name: '1st Year', sem: 'Sem 1 & 2', color: '#C88D2D', bg: '#FFFBEB', border: '#FDE68A' },
    { id: '2nd', name: '2nd Year', sem: 'Sem 3 & 4', color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
    { id: '3rd', name: '3rd Year', sem: 'Sem 5 & 6', color: '#B45309', bg: '#FDF2F8', border: '#FBCFE8' },
    { id: '4th', name: '4th Year', sem: 'Sem 7 & 8', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
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
      backgroundColor: '#FAF7F2',
      padding: '2.5rem 0',
      borderBottom: '1.5px solid #E8E2D5'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1.1fr',
          gap: '1.25rem',
          alignItems: 'stretch'
        }} className="yb-grid">

          {/* LEFT CARD: Choose Your Year (3D Tile System) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '1.5rem',
            border: '1.5px solid #E8E2D5',
            boxShadow: '0 8px 24px rgba(35,30,25,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            perspective: '1000px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#FDF6E8',
                  color: '#C88D2D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 8px rgba(200,141,45,0.18)'
                }}>
                  <GraduationCap size={18} />
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21' }}>
                  Choose Your Year
                </h2>
              </div>
              
              <p style={{ fontSize: '0.8rem', color: '#646E78', marginBottom: '1.2rem', fontWeight: 500 }}>
                Your journey, our support — pick your year.
              </p>

              {/* 4 Year Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                {years.map(y => (
                  <button
                    key={y.id}
                    type="button"
                    onClick={() => onSelectYear && onSelectYear(y.id)}
                    aria-label={`Select ${y.name} - ${y.sem}`}
                    style={{
                      backgroundColor: y.bg,
                      border: `1.5px solid ${y.border}`,
                      borderRadius: '16px',
                      padding: '1rem 0.75rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transformStyle: 'preserve-3d',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) translateZ(8px) rotateX(2deg)';
                      e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) translateZ(0) rotateX(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'translateY(1px) scale(0.97)';
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: y.color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.45rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      transform: 'translateZ(10px)'
                    }}>
                      <GraduationCap size={16} />
                    </div>
                    
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e293b' }}>
                      {y.name}
                    </div>
                    
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '0.1rem' }}>
                      {y.sem}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER CARD: Popular Branches (3D Tile System) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '1.5rem',
            border: '1.5px solid #E8E2D5',
            boxShadow: '0 8px 24px rgba(35,30,25,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            perspective: '1000px'
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
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: '#FDF6E8',
                    color: '#C88D2D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 8px rgba(200,141,45,0.18)'
                  }}>
                    <MapPin size={18} />
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21' }}>
                    Popular Branches
                  </h2>
                </div>

                <button 
                  onClick={() => onSelectBranch && onSelectBranch('CSE')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#C88D2D',
                    fontSize: '0.82rem',
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
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => onSelectBranch && onSelectBranch(b.code)}
                      aria-label={`Select branch ${b.code}`}
                      style={{
                        backgroundColor: '#FAF7F2',
                        border: '1.5px solid #E8E2D5',
                        borderRadius: '16px',
                        padding: '1.1rem 0.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transformStyle: 'preserve-3d',
                        boxShadow: '0 4px 12px rgba(35,30,25,0.02)',
                        outline: 'none',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C88D2D';
                        e.currentTarget.style.backgroundColor = '#FDF6E8';
                        e.currentTarget.style.transform = 'translateY(-4px) translateZ(8px)';
                        e.currentTarget.style.boxShadow = '0 10px 22px rgba(200,141,45,0.18)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E8E2D5';
                        e.currentTarget.style.backgroundColor = '#FAF7F2';
                        e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(35,30,25,0.02)';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translateY(1px) scale(0.97)';
                      }}
                    >
                      <BIcon size={22} style={{ color: '#C88D2D', marginBottom: '0.45rem', transform: 'translateZ(10px)' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C1E21' }}>
                        {b.code}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT CARD: PREMIUM 3D ASK VIRUS AI ASSISTANT CARD */}
          <div style={{ perspective: '1200px', display: 'flex' }}>
            <div
              className="ask-virus-3d-card"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                width: '100%',
                backgroundColor: '#1F2421',
                backgroundImage: `
                  radial-gradient(rgba(200, 141, 45, 0.15) 1.5px, transparent 1.5px),
                  linear-gradient(135deg, #181C1A 0%, #1F2421 55%, #29302B 100%)
                `,
                backgroundSize: '22px 22px, 100% 100%',
                borderRadius: '24px',
                border: '1.5px solid rgba(200, 141, 45, 0.45)',
                boxShadow: isHovered
                  ? '0 20px 45px rgba(31, 36, 33, 0.5), 0 0 30px rgba(200, 141, 45, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  : '0 10px 30px rgba(31, 36, 33, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.3s ease' : 'transform 0.5s ease-out, box-shadow 0.3s ease'
              }}
            >
              {/* Subtle 3D Glass Layer Overlays */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
                pointerEvents: 'none',
                borderRadius: '24px'
              }} />

              {/* TOP HEADER */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem',
                transform: 'translateZ(20px)',
                position: 'relative',
                zIndex: 5
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(200, 141, 45, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(200, 141, 45, 0.5)'
                  }}>
                    <Bot size={18} style={{ color: '#FBBF24' }} />
                  </div>
                  <h2 style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}>
                    ASK VIRUS
                  </h2>
                </div>

                <span style={{
                  backgroundColor: 'rgba(200, 141, 45, 0.2)',
                  color: '#FBBF24',
                  border: '1px solid rgba(200, 141, 45, 0.4)',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '0.22rem 0.65rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  AI ASSISTANT
                </span>
              </div>

              {/* CENTER CONTENT: 3D CHARACTER DISPLAY + TEXT */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flex: 1,
                position: 'relative',
                zIndex: 5
              }} className="ask-virus-content-row">
                
                {/* COMPLETE VIRUS CHARACTER CONTAINER (OBJECT-FIT CONTAIN, 100% UNCROPPED) */}
                <div style={{
                  width: '42%',
                  height: '150px',
                  maxHeight: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '18px',
                  padding: '0.45rem',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  flexShrink: 0,
                  transform: 'translateZ(30px)',
                  transition: 'transform 0.3s ease'
                }} className="ask-virus-img-container">
                  <img
                    src="/assets/ask_virus_character.png"
                    alt="Professor Virus AI Assistant"
                    loading="eager"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/professor_virus_standing.png';
                    }}
                  />
                </div>

                {/* TEXT & ACTION BUTTON */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  transform: 'translateZ(25px)'
                }}>
                  <div style={{
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    color: '#FBBF24',
                    lineHeight: 1.25,
                    fontFamily: "'Outfit', sans-serif",
                    textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                  }}>
                    "Doubt hai? <br />
                    Virus se poochho!"
                  </div>

                  <p style={{
                    fontSize: '0.78rem',
                    color: '#E2E8F0',
                    lineHeight: 1.35,
                    margin: 0,
                    fontWeight: 500
                  }}>
                    Notes, PYQs, concepts — sab pucho.
                  </p>

                  <button
                    type="button"
                    onClick={onOpenAI}
                    aria-label="Ask Virus AI Assistant"
                    style={{
                      marginTop: '0.3rem',
                      backgroundColor: '#C88D2D',
                      backgroundImage: 'linear-gradient(135deg, #C88D2D 0%, #B37D28 100%)',
                      color: '#ffffff',
                      border: '1px solid #E8D3B0',
                      borderRadius: '12px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.84rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 6px 18px rgba(200, 141, 45, 0.4)',
                      transform: 'translateZ(35px)',
                      transition: 'all 0.25s ease',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateZ(45px) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(200, 141, 45, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateZ(35px)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(200, 141, 45, 0.4)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'translateZ(20px) scale(0.96)';
                    }}
                  >
                    <Sparkles size={14} /> ASK VIRUS <ArrowRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .yb-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 480px) {
          .ask-virus-img-container {
            width: 110px !important;
            height: 125px !important;
          }
        }
      `}</style>
    </section>
  );
}
