import React, { useState } from 'react';
import { Search, ChevronDown, Check, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

/* 
  ===================================================================
  HOMEPAGE PERMANENT ASSET RULE (PROTECTED DESIGN ASSET)
  ===================================================================
  - Hero Left Poster (/assets/professor_virus_poster.png)
  - Hero Right Poster (/assets/hero_right_poster.png - 3-Idiots Chalkboard)
  These posters are APPROVED PERMANENT DESIGN ASSETS.
  DO NOT REMOVE, REPLACE, OR CROP THESE POSTERS IN FUTURE REFACTORS.
  ===================================================================
*/

export default function HeroSection({ onSearch, onSelectBranch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');

  const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery, selectedBranch);
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    if (onSelectBranch) onSelectBranch(branch);
  };

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '2.25rem 0 2.75rem 0',
      backgroundColor: '#FAF7F2',
      backgroundImage: `
        radial-gradient(rgba(200, 141, 45, 0.08) 1.5px, transparent 1.5px),
        radial-gradient(rgba(35, 30, 25, 0.03) 1.5px, transparent 1.5px),
        linear-gradient(180deg, #FCFAF6 0%, #F6F1E6 60%, #EFE8DA 100%)
      `,
      backgroundSize: '32px 32px, 16px 16px, 100% 100%',
      borderBottom: '1.5px solid #E2D9C8',
      boxShadow: '0 10px 28px rgba(35, 30, 25, 0.05)',
      perspective: '1200px'
    }}>
      {/* Warm Ambient Sunlight Glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '80%',
        background: 'radial-gradient(ellipse at center, rgba(200, 141, 45, 0.12) 0%, rgba(250, 247, 242, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        
        {/* ONE CONTINUOUS PANORAMIC HERO BANNER CARD */}
        <div style={{
          backgroundColor: 'rgba(252, 250, 246, 0.96)',
          border: '1.5px solid #E2D9C8',
          borderRadius: '28px',
          boxShadow: '0 16px 42px rgba(35, 30, 25, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
          padding: '2.75rem clamp(2.25rem, 4vw, 4.25rem)',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }} className="hero-panoramic-container">

          {/* Subtle Background Architectural Campus / Light Texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#E8D3B0 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px',
            opacity: 0.35,
            pointerEvents: 'none'
          }} />

          {/* Main Grid: Left Mascot | Center Search & Brand | Right Poster & Sticky Note */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(210px, 240px) minmax(380px, 1fr) minmax(210px, 260px)',
            gap: 'clamp(2rem, 3.2vw, 3.75rem)',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
            zIndex: 2
          }} className="hero-grid">

            {/* LEFT: ProfessorVirus Mascot (PERMANENT APPROVED ASSET) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              perspective: '1000px',
              padding: '0 0.25rem',
              maxWidth: '240px',
              margin: '0 auto'
            }} className="hero-left-mascot">
              
              {/* Quote Bubble */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '16px',
                padding: '0.6rem 0.9rem',
                marginBottom: '0.6rem',
                border: '1.5px solid #E8D3B0',
                boxShadow: '0 6px 20px rgba(35, 30, 25, 0.08), inset 0 1px 0 rgba(255,255,255,1)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#1C1E21',
                fontFamily: "'Kalam', cursive",
                lineHeight: 1.3,
                position: 'relative',
                textAlign: 'center'
              }}>
                “Concept samajh aaya? <br />
                Nahi aaya? Toh padho! <br />
                Simple haii.” <br />
                <span style={{ color: '#C88D2D', fontWeight: 700 }}>— ProfessorVirus</span>
                
                {/* Bubble Arrow */}
                <div style={{
                  position: 'absolute',
                  bottom: '-9px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '9px solid #E8D3B0'
                }} />
              </div>

              {/* ProfessorVirus Poster Image Asset (STRICT OBJECT-FIT: CONTAIN) */}
              <div style={{
                width: '100%',
                maxWidth: '235px',
                aspectRatio: '1 / 1',
                position: 'relative',
                filter: 'drop-shadow(0 12px 24px rgba(35,30,25,0.15))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease, filter 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.filter = 'drop-shadow(0 18px 30px rgba(35,30,25,0.22))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.filter = 'drop-shadow(0 12px 24px rgba(35,30,25,0.15))';
              }}
              >
                <img
                  src="/assets/professor_virus_poster.png"
                  alt="ProfessorVirus - Study Smart. Prepare Better."
                  loading="eager"
                  fetchpriority="high"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '16px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_virus.png';
                  }}
                />
              </div>
            </div>

            {/* CENTER: Main Hero Text, Logo, 3D Search Bar, Branch Pills */}
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem',
              maxWidth: '640px',
              margin: '0 auto',
              width: '100%'
            }}>
              
              {/* Top Pill Badge matching Page 1 Reference */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '9999px',
                padding: '0.35rem 1rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#C88D2D',
                marginBottom: '0.25rem',
                boxShadow: '0 2px 8px rgba(200, 141, 45, 0.08)'
              }}>
                <span role="img" aria-label="grad-cap">🎓</span>
                <span>All Your Academic Tools in One Place</span>
              </div>

              {/* ProfessorVirus Logo Header */}
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(2.35rem, 3.6vw, 3.3rem)',
                  fontWeight: 900,
                  color: '#1C1E21',
                  textShadow: '0 2px 8px rgba(35,30,25,0.06)',
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 'clamp(0.85rem, 1.2vw, 1.15rem)',
                    flexShrink: 0,
                    transform: 'translateY(-2px)'
                  }}>
                    <GraduationCap 
                      size={42} 
                      style={{ 
                        color: '#C88D2D', 
                        filter: 'drop-shadow(0 2px 6px rgba(200,141,45,0.3))' 
                      }} 
                    />
                  </span>
                  <span style={{ letterSpacing: '0.015em' }}>Professor</span>
                  <span style={{ 
                    display: 'inline-block', 
                    width: 'clamp(0.85rem, 1.3vw, 1.25rem)' 
                  }} aria-hidden="true" />
                  <span style={{ color: '#C88D2D', letterSpacing: '0.015em' }}>Virus</span>
                </div>
                
                <div style={{
                  fontFamily: "'Kalam', cursive",
                  color: '#B37D28',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  marginTop: '0.25rem',
                  letterSpacing: '0.02em'
                }}>
                  Study Smart. Prepare Better.
                </div>
              </div>

              {/* Subtext matching Page 1 */}
              <p style={{
                fontSize: '0.92rem',
                color: '#64748B',
                lineHeight: 1.5,
                margin: '0.15rem 0 0.45rem 0',
                maxWidth: '560px'
              }}>
                Notes, PYQs, syllabus, quizzes, internships, interview prep, results, PDF tools and more — everything you need for your academic journey.
              </p>

              {/* PROMINENT 3D FLOATING HERO SEARCH BAR */}
              <form onSubmit={handleSearch} style={{
                width: '100%',
                maxWidth: '540px',
                position: 'relative',
                marginTop: '0.35rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.4rem 0.35rem 1.25rem',
                  boxShadow: '0 8px 24px rgba(35,30,25,0.08), 0 0 0 3px rgba(200,141,45,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
                  border: '1.5px solid #E2D9C8',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(35,30,25,0.12), 0 0 0 3px rgba(200,141,45,0.28)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(35,30,25,0.08), 0 0 0 3px rgba(200,141,45,0.18)';
                }}
                >
                  <Search size={18} style={{ color: '#909AA4', marginRight: '0.65rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search subjects, topics, PYQs, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.94rem',
                      color: '#1C1E21',
                      fontWeight: 600,
                      backgroundColor: 'transparent'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.6rem 1.5rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      backgroundColor: '#1F2421',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(31,36,33,0.25)',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#C88D2D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1F2421';
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* BRANCH FILTER PILLS (3D FLOATING CHIPS) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                flexWrap: 'wrap',
                marginTop: '0.35rem'
              }}>
                {branches.map(b => {
                  const isSel = selectedBranch === b;
                  return (
                    <button
                      key={b}
                      onClick={() => handleBranchClick(b)}
                      style={{
                        padding: '0.32rem 0.85rem',
                        borderRadius: '9999px',
                        border: isSel ? '1.5px solid #B37D28' : '1.5px solid #DDCFBC',
                        backgroundColor: isSel ? '#C88D2D' : 'rgba(255,255,255,0.85)',
                        color: isSel ? '#FFFFFF' : '#3A3530',
                        fontWeight: isSel ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        backdropFilter: 'blur(6px)',
                        boxShadow: isSel ? '0 4px 14px rgba(200,141,45,0.3)' : '0 2px 6px rgba(35,30,25,0.04)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#C88D2D';
                          e.currentTarget.style.color = '#C88D2D';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.85)';
                          e.currentTarget.style.borderColor = '#DDCFBC';
                          e.currentTarget.style.color = '#3A3530';
                        }
                      }}
                    >
                      {b}
                    </button>
                  );
                })}

                {/* All Branches Pill */}
                <button
                  onClick={() => handleBranchClick('All Branches')}
                  style={{
                    padding: '0.32rem 0.85rem',
                    borderRadius: '9999px',
                    border: '1.5px solid #5A4228',
                    backgroundColor: '#6E5334',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    boxShadow: '0 4px 12px rgba(110,83,52,0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5A4228';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6E5334';
                  }}
                >
                  All Branches <ChevronDown size={13} />
                </button>
              </div>
            </div>

            {/* RIGHT: Reference Poster + Yellow Sticky Note Badge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
              perspective: '1000px'
            }} className="hero-right-mascot">
              
              {/* Sticky Note Badge */}
              <div style={{
                backgroundColor: '#FEF08A',
                border: '1.5px solid #FACC15',
                borderRadius: '12px',
                padding: '0.5rem 0.85rem',
                marginBottom: '0.6rem',
                boxShadow: '0 6px 16px rgba(161, 98, 7, 0.15)',
                fontFamily: "'Kalam', cursive",
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#713F12',
                textAlign: 'center',
                lineHeight: 1.3,
                transform: 'rotate(2deg)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '28px',
                  height: '8px',
                  backgroundColor: 'rgba(254, 240, 138, 0.9)',
                  border: '1px solid #CA8A04',
                  borderRadius: '2px'
                }} />
                Study Plan • Practice • Improve • Grow !
              </div>

              {/* 3-Idiots Reference Poster (STRICT OBJECT-FIT: CONTAIN) */}
              <div style={{
                width: '100%',
                maxWidth: '260px',
                height: '320px',
                position: 'relative',
                filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.45))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.35s ease, filter 0.35s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.filter = 'drop-shadow(0 20px 36px rgba(0,0,0,0.55))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.filter = 'drop-shadow(0 14px 28px rgba(0,0,0,0.45))';
              }}
              >
                <img
                  src="/assets/hero_right_poster.png"
                  alt="Kabil Bano, Kamyabi Jhak Maar Ke Piche Bhagegi - All Izz Well"
                  loading="eager"
                  fetchpriority="high"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '16px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_right_poster.jpg';
                  }}
                />
              </div>

            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (min-width: 1441px) {
          .hero-panoramic-container {
            padding: 3rem clamp(2.75rem, 5vw, 5rem) !important;
          }
          .hero-grid {
            gap: clamp(2.5rem, 4vw, 4.5rem) !important;
          }
        }
        @media (max-width: 1240px) and (min-width: 961px) {
          .hero-grid {
            grid-template-columns: 210px 1fr 220px !important;
            gap: 2rem !important;
          }
          .hero-panoramic-container {
            padding: 2.25rem 2rem !important;
          }
        }
        @media (max-width: 960px) {
          .hero-panoramic-container {
            padding: 2rem 1.25rem !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            justify-items: center !important;
            gap: 2rem !important;
          }
          .hero-left-mascot {
            display: none !important;
          }
          .hero-right-mascot {
            display: flex !important;
            width: 100% !important;
            max-width: 320px !important;
            height: auto !important;
            margin-top: 0.5rem !important;
          }
          .hero-right-mascot > div {
            max-width: 100% !important;
            height: 320px !important;
          }
        }
        @media (max-width: 480px) {
          .hero-panoramic-container {
            padding: 1.5rem 0.85rem !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
