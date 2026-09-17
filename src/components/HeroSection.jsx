import React, { useState } from 'react';
import { Search, ChevronDown, Check, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

export default function HeroSection({ onSearch, onSelectBranch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

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
      padding: '1.5rem 0 2rem 0',
      backgroundColor: '#0c3829',
      backgroundImage: `
        radial-gradient(rgba(255, 255, 255, 0.06) 1.5px, transparent 1.5px),
        radial-gradient(rgba(255, 255, 255, 0.04) 1.5px, transparent 1.5px)
      `,
      backgroundSize: '28px 28px',
      backgroundPosition: '0 0, 14px 14px',
      borderBottom: '4px solid #1a563f',
      boxShadow: '0 12px 30px rgba(12, 56, 41, 0.4)'
    }}>
      {/* Chalkboard Grid Ambient Overlays */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(12,56,41,0.2) 0%, rgba(6,35,25,0.7) 100%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        
        {/* TOP WRAPPER: Main Grid with Virus on Left, Center Hero, Students on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 280px',
          gap: '1.25rem',
          alignItems: 'center'
        }} className="hero-grid">

          {/* LEFT: Virus Teacher Mascot & Speech Bubble */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="hero-left-mascot">
            {/* Quote Bubble */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '0.65rem 0.9rem',
              marginBottom: '0.6rem',
              border: '2px solid #0e4d34',
              boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0f172a',
              fontFamily: "'Kalam', cursive",
              lineHeight: 1.3,
              position: 'relative',
              textAlign: 'center'
            }}>
              “Concept samajh aaya? <br />
              Nahi aaya? Toh padho! <br />
              Simple hai.” <br />
              <span style={{ color: '#059669', fontWeight: 700 }}>— Virus</span>
              
              {/* Bubble Arrow */}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '10px solid #0e4d34'
              }} />
            </div>

            {/* Virus Character Image */}
            <div style={{
              width: '230px',
              height: '260px',
              position: 'relative',
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
            }}>
              <img
                src="/assets/hero_virus.png"
                alt="Virus Teacher Mascot"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
          </div>

          {/* CENTER: Main Hero Text, Logo, Search Bar, Branch Pills */}
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            
            {/* CampusPrep Chalk Logo Header */}
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '3.4rem',
                fontWeight: 900,
                color: '#ffffff',
                textShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 20px rgba(16,185,129,0.3)',
                letterSpacing: '-0.03em',
                lineHeight: 1
              }}>
                <GraduationCap size={44} style={{ color: '#10b981', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
                Campus<span style={{ color: '#34d399' }}>Prep</span>
              </div>
              
              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fde047',
                fontSize: '1.45rem',
                fontWeight: 700,
                marginTop: '0.2rem',
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                Study Smart. Prepare Better.
              </div>
            </div>

            {/* Subtitle & Feature Tags */}
            <div style={{ color: '#e2e8f0', fontSize: '1.05rem', fontWeight: 500, marginTop: '0.2rem' }}>
              All your AKTU study resources in one place.
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 500,
              flexWrap: 'wrap'
            }}>
              <span>Notes</span>
              <span style={{ color: '#34d399' }}>•</span>
              <span>PYQs</span>
              <span style={{ color: '#34d399' }}>•</span>
              <span>Syllabus</span>
              <span style={{ color: '#34d399' }}>•</span>
              <span>Quizzes</span>
              <span style={{ color: '#34d399' }}>•</span>
              <span>AI Study</span>
              <span style={{ color: '#34d399' }}>•</span>
              <span>Community</span>
            </div>

            {/* PROMINENT HERO SEARCH BAR */}
            <form onSubmit={handleSearch} style={{
              width: '100%',
              maxWidth: '560px',
              position: 'relative',
              marginTop: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '9999px',
                padding: '0.35rem 0.4rem 0.35rem 1.25rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3), 0 0 0 3px rgba(16,185,129,0.2)',
                border: '1px solid #cbd5e1'
              }}>
                <Search size={20} style={{ color: '#64748b', marginRight: '0.6rem', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search subjects, topics, PYQs, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.98rem',
                    color: '#0f172a',
                    fontWeight: 500,
                    backgroundColor: 'transparent'
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '0.65rem 1.6rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    boxShadow: '0 4px 12px rgba(13,92,58,0.3)',
                    flexShrink: 0
                  }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* BRANCH FILTER PILLS */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              flexWrap: 'wrap',
              marginTop: '0.5rem'
            }}>
              {branches.map(b => {
                const isSel = selectedBranch === b;
                return (
                  <button
                    key={b}
                    onClick={() => handleBranchClick(b)}
                    style={{
                      padding: '0.35rem 0.95rem',
                      borderRadius: '9999px',
                      border: isSel ? '1.5px solid #34d399' : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: isSel ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.08)',
                      color: isSel ? '#ffffff' : '#cbd5e1',
                      fontWeight: isSel ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    {b}
                  </button>
                );
              })}

              {/* All Branches Pill with Dropdown */}
              <button
                onClick={() => handleBranchClick('All Branches')}
                style={{
                  padding: '0.35rem 0.95rem',
                  borderRadius: '9999px',
                  border: selectedBranch === 'All Branches' ? '1.5px solid #34d399' : '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: selectedBranch === 'All Branches' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.08)',
                  color: selectedBranch === 'All Branches' ? '#ffffff' : '#cbd5e1',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                All Branches <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT: Pinned Sticky Note & Student Group Character */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }} className="hero-right-mascot">
            
            {/* Top Sticky Note */}
            <div className="sticky-note" style={{
              width: '190px',
              padding: '0.75rem 0.85rem',
              borderRadius: '8px',
              marginBottom: '0.75rem',
              fontSize: '0.82rem',
              color: '#1e293b',
              fontWeight: 600,
              lineHeight: 1.4,
              boxShadow: '0 8px 18px rgba(0,0,0,0.25)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#047857' }}>
                  <Check size={14} strokeWidth={3} /> Same Syllabus
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#047857' }}>
                  <Check size={14} strokeWidth={3} /> Better Notes
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#047857' }}>
                  <Check size={14} strokeWidth={3} /> Higher CGPA
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#047857' }}>
                  <Check size={14} strokeWidth={3} /> Brighter Future
                </div>
                <div style={{ 
                  marginTop: '0.3rem', 
                  fontSize: '0.78rem', 
                  color: '#475569', 
                  fontFamily: "'Kalam', cursive",
                  textAlign: 'right',
                  fontWeight: 700 
                }}>
                  — CampusPrep :)
                </div>
              </div>
            </div>

            {/* Student Group Illustration */}
            <div style={{
              width: '240px',
              height: '190px',
              position: 'relative',
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
            }}>
              <img
                src="/assets/hero_students.png"
                alt="AKTU Student Group"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>

            {/* Handwritten Note Above Boombox */}
            <div style={{
              fontFamily: "'Kalam', cursive",
              color: '#fef08a',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginTop: '0.4rem',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)'
            }}>
              Padhai ka Tension? <br />
              Hum hai na CampusPrep! :)
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1100px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            justify-items: center !important;
          }
          .hero-left-mascot, .hero-right-mascot {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
