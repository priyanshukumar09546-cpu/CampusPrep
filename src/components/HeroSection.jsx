import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Play,
  Users,
  FileText,
  Briefcase,
  Star
} from 'lucide-react';

export default function HeroSection({ onSearch, onSelectBranch, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');

  const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'All Branches'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim(), selectedBranch);
    }
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    if (onSelectBranch) {
      onSelectBranch(branch === 'All Branches' ? 'All' : branch);
    }
  };

  return (
    <section style={{
      backgroundColor: '#FAF5ED',
      padding: '2.5rem 0 2rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Doodles and Subtle Dot Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(rgba(180, 140, 80, 0.08) 1.5px, transparent 1.5px),
          radial-gradient(rgba(120, 20, 22, 0.03) 1.5px, transparent 1.5px)
        `,
        backgroundSize: '28px 28px, 14px 14px',
        opacity: 0.85,
        pointerEvents: 'none'
      }} />

      <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 2 }}>
        
        {/* Main 2-Column Hero Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          alignItems: 'center'
        }} className="hero-2col-layout">

          {/* ===================================================================
              LEFT COLUMN: BADGE, HEADINGS, DESCRIPTION, CTA, STATS, SEARCH
              =================================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

            {/* Top Pill Badge (Matches Reference Image) */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FDF2E9',
              border: '1.2px solid #F5D0B5',
              borderRadius: '9999px',
              padding: '0.35rem 0.95rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#881337',
              marginBottom: '1.15rem',
              boxShadow: '0 2px 8px rgba(120, 20, 22, 0.04)'
            }}>
              <span>🎓</span>
              <span>Trusted by 50,000+ Engineering Students</span>
            </div>

            {/* Brand Title: ProfessorVirus (Matches Reference Image) */}
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.75rem, 4.4vw, 3.85rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              margin: '0 0 0.45rem 0',
              letterSpacing: '-0.02em',
              color: '#1C1917'
            }}>
              <span>Professor</span><span style={{ color: '#D97706' }}>Virus</span>
            </h1>

            {/* Sub-headline in Rich Dark Maroon (Matches Reference Image) */}
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.75rem, 2.7vw, 2.35rem)',
              fontWeight: 900,
              lineHeight: 1.18,
              color: '#781416',
              margin: '0 0 1rem 0',
              letterSpacing: '-0.015em'
            }}>
              Your Complete Learning &amp; Career Preparation Platform
            </h2>

            {/* Body Description (Matches Reference Image) */}
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.96rem',
              fontWeight: 600,
              lineHeight: 1.6,
              color: '#57534E',
              margin: '0 0 1.5rem 0',
              maxWidth: '560px'
            }}>
              Get notes, PYQs, syllabus, quizzes, resume maker, AI-powered interview practice, coding preparation, result &amp; CGPA tools — all in one place. Built for B.Tech and engineering students to study smart and prepare better.
            </p>

            {/* CTA Action Buttons (Matches Reference Image) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap',
              marginBottom: '1.65rem'
            }}>
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('notes');
                }}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  padding: '0.78rem 1.65rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 6px 18px rgba(120, 20, 22, 0.32)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#631012';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#781416';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById('quick-access-section') || document.querySelector('.quick-access-grid');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else if (onNavigate) {
                    onNavigate('interview-pro');
                  }
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#1C1917',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  padding: '0.76rem 1.55rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #E5DFD3',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 8px rgba(35, 30, 25, 0.04)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C88D2D';
                  e.currentTarget.style.backgroundColor = '#FAF7F2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5DFD3';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <Play size={14} fill="#781416" color="#781416" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Real Stats Strip (Matches Reference Image) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(1rem, 2.2vw, 1.85rem)',
              flexWrap: 'wrap',
              paddingBottom: '1.35rem',
              borderBottom: '1px solid #EAE2D2',
              width: '100%',
              maxWidth: '560px',
              marginBottom: '1.25rem'
            }}>
              {/* Stat 1: Students */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ color: '#781416' }}>
                  <Users size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                    50K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#78716C', marginTop: '0.15rem' }}>
                    Students
                  </div>
                </div>
              </div>

              {/* Stat 2: Notes Views */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ color: '#781416' }}>
                  <FileText size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                    1M+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#78716C', marginTop: '0.15rem' }}>
                    Notes Views
                  </div>
                </div>
              </div>

              {/* Stat 3: Interviews Taken */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ color: '#781416' }}>
                  <Briefcase size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                    10K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#78716C', marginTop: '0.15rem' }}>
                    Interviews Taken
                  </div>
                </div>
              </div>

              {/* Stat 4: Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ color: '#D97706' }}>
                  <Star size={18} fill="#D97706" color="#D97706" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                    4.9/5
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#78716C', marginTop: '0.15rem' }}>
                    Student Rating
                  </div>
                </div>
              </div>
            </div>

            {/* Functional Search Bar with Branch Filters */}
            <div style={{ width: '100%', maxWidth: '560px' }}>
              <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', marginBottom: '0.65rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                  border: '1.5px solid #E2D9C8',
                  padding: '0.35rem 0.4rem 0.35rem 1.15rem',
                  boxShadow: '0 4px 16px rgba(35, 30, 25, 0.05), 0 0 0 3px rgba(200, 141, 45, 0.1)',
                  transition: 'all 0.2s ease'
                }}>
                  <Search size={17} style={{ color: '#78716C', marginRight: '0.65rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search subjects, topics, PYQs, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#1C1917',
                      backgroundColor: 'transparent',
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(120, 20, 22, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#631012';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#781416';
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Branch Quick Filter Chips */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', marginRight: '0.2rem' }}>
                  Branch:
                </span>
                {branches.map(b => {
                  const isSel = selectedBranch === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleBranchClick(b)}
                      style={{
                        padding: '0.24rem 0.72rem',
                        borderRadius: '9999px',
                        border: isSel ? '1.5px solid #781416' : '1px solid #E2D9C8',
                        backgroundColor: isSel ? '#781416' : '#FFFFFF',
                        color: isSel ? '#FFFFFF' : '#44403C',
                        fontWeight: isSel ? 800 : 600,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        boxShadow: isSel ? '0 2px 8px rgba(120,20,22,0.2)' : '0 1px 3px rgba(35,30,25,0.03)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.borderColor = '#C88D2D';
                          e.currentTarget.style.backgroundColor = '#FAF7F2';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.borderColor = '#E2D9C8';
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }
                      }}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ===================================================================
              RIGHT COLUMN: STUDENT SHOWCASE ARTWORK WITH INTERACTIVE BADGES
              =================================================================== */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '560px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} className="hero-right-showcase-container">
            
            {/* The Reference Student Artwork with Artistic Doodles & Cards */}
            <div style={{
              position: 'relative',
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(35, 30, 25, 0.08)'
            }}>
              <img
                src="/assets/hero_right_student_showcase.png"
                alt="Student exploring ProfessorVirus learning and career tools"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '24px'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/homepage_reference_design.jpg';
                }}
              />

              {/* Interactive Invisible / Hover Hotspots over the Cards */}
              {/* Hotspot 1: AI Resume Maker (Top Left) */}
              <div
                title="Open AI Resume Maker"
                onClick={() => onNavigate && onNavigate('resume-maker')}
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '4%',
                  width: '26%',
                  height: '22%',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              />

              {/* Hotspot 2: Interview Pro (Mid Left) */}
              <div
                title="Start Interview Pro Mock"
                onClick={() => onNavigate && onNavigate('interview-pro')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '4%',
                  width: '26%',
                  height: '24%',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              />

              {/* Hotspot 3: PYQs (Top Right) */}
              <div
                title="Browse AKTU PYQs"
                onClick={() => onNavigate && onNavigate('pyqs')}
                style={{
                  position: 'absolute',
                  top: '12%',
                  right: '4%',
                  width: '26%',
                  height: '22%',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              />

              {/* Hotspot 4: Result & CGPA (Mid Right) */}
              <div
                title="Check Result & CGPA"
                onClick={() => onNavigate && onNavigate('result-cgpa')}
                style={{
                  position: 'absolute',
                  top: '46%',
                  right: '4%',
                  width: '26%',
                  height: '22%',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              />
            </div>

          </div>

        </div>

      </div>

      {/* Responsive Stacking Overrides */}
      <style>{`
        @media (max-width: 960px) {
          .hero-2col-layout {
            grid-template-columns: 1fr !important;
            gap: 2.25rem !important;
          }
          .hero-right-showcase-container {
            max-width: 480px !important;
          }
        }
      `}</style>
    </section>
  );
}
