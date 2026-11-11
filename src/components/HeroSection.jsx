import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Play,
  Users,
  FileText,
  Briefcase,
  Star,
  Rocket,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import DemoVideoModal from './DemoVideoModal';

export default function HeroSection({ onSearch, onSelectBranch, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE', 'All Branches'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim(), selectedBranch === 'All Branches' ? 'All' : selectedBranch);
    }
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    if (onSelectBranch) {
      onSelectBranch(branch === 'All Branches' ? 'All' : branch);
    }
  };

  return (
    <section
      className="pv-hero-original-container"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#FAF5F2'
      }}
    >
      {/* ===================================================================
          HERO SCENE WRAPPER: Exact Image 1 as Background + Left Content
          =================================================================== */}
      <div
        className="pv-hero-scene-wrap"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1920px',
          margin: '0 auto',
          minHeight: 'clamp(480px, 48vw, 720px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* The Exact Image 1 as the Complete, Uncut, Unsplit Background Asset */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden'
          }}
        >
          <img
            src="/assets/prma_hero_original_2x.jpg"
            alt="PRMA Tech Global Center with Trees, Sunset, Garden, Cat Mascot and Internship Signboard"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center right',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />

          {/* Gentle atmospheric scrim on the left side to keep text 100% legible without obscuring the building or cat */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.78) 32%, rgba(255, 255, 255, 0.35) 52%, rgba(255, 255, 255, 0) 70%)',
              pointerEvents: 'none'
            }}
            className="pv-hero-legibility-scrim"
          />

          {/* ===============================================================
              7. CAT SIGNBOARD — FUNCTIONAL INTERNSHIP LINK OVERLAY
              Accurately positioned over "Apply for Internship at PRMA TECH"
              =============================================================== */}
          <a
            href="/prma-tech"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate('prma-internships-home');
              } else {
                window.location.href = '/prma-tech';
              }
            }}
            title="Click to Apply for Internship at PRMA Tech"
            aria-label="Apply for Internship at PRMA Tech"
            style={{
              position: 'absolute',
              left: '81.05%',
              top: '42.53%',
              width: '13.67%',
              height: '18.23%',
              cursor: 'pointer',
              zIndex: 15,
              borderRadius: '8px',
              display: 'block'
            }}
            className="pv-cat-signboard-link"
          >
            <span className="sr-only">Apply for Internship at PRMA Tech</span>
          </a>
        </div>

        {/* ===================================================================
            HERO CONTENT: Typography & Statistics (From IMAGE 2)
            =================================================================== */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            padding: '2.5rem 1.5rem 1rem',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            {/* Trust badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: '1.5px solid #E2E8F0',
                borderRadius: '999px',
                padding: '0.35rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1.15rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <GraduationCap size={16} color="#881337" />
              <span>Trusted by 50,000+ Engineering Students</span>
              <span style={{ color: '#F59E0B', fontSize: '0.9rem' }}>⭐</span>
            </div>

            {/* Main Brand Title */}
            <h1
              style={{
                fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                fontSize: 'clamp(2.3rem, 4.2vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.03em',
                color: '#0F172A'
              }}
            >
              <span>Professor</span>
              <span style={{ color: '#881337' }}>Virus</span>
            </h1>

            {/* Slogan with Golden Brush Curve */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.15rem' }}>
              <h2
                style={{
                  fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                  fontSize: 'clamp(1.4rem, 2.6vw, 2.4rem)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}
              >
                Study Smart. Prepare Better.
              </h2>
              {/* Golden Curved Accent Line */}
              <svg
                viewBox="0 0 280 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '70px',
                  width: '210px',
                  height: '14px',
                  pointerEvents: 'none'
                }}
              >
                <path
                  d="M4 12C60 4 180 3 276 11C230 15 110 16 4 12Z"
                  fill="#FFBD12"
                />
              </svg>
            </div>

            {/* Body Description */}
            <p
              style={{
                fontSize: 'clamp(0.92rem, 1.4vw, 1.02rem)',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#334155',
                margin: '0 0 1.65rem 0',
                maxWidth: '520px'
              }}
            >
              An advanced educational platform providing study resources, notes, PYQs, syllabus, quizzes and career preparation for students.
            </p>

            {/* Action Buttons: Get Started Free & Watch Demo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '1.75rem'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('notes');
                }}
                style={{
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  padding: '0.82rem 1.85rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#881337',
                  color: '#FFFFFF',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(136, 19, 55, 0.35)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(136, 19, 55, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(136, 19, 55, 0.35)';
                }}
              >
                <Rocket size={17} color="#FFFFFF" />
                <span>Get Started Free</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  padding: '0.82rem 1.65rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#0F172A',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                  backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#881337';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#FFF1F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#881337'
                  }}
                >
                  <Play size={12} fill="#881337" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 4 Verified Statistics Counters */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.85rem, 1.8vw, 1.85rem)',
                flexWrap: 'wrap'
              }}
            >
              {/* Stat 1: Students */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF1F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#881337'
                  }}
                >
                  <Users size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    50K+
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>
                    Students
                  </div>
                </div>
              </div>

              {/* Stat 2: Notes Views */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFBEB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706'
                  }}
                >
                  <FileText size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    1M+
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>
                    Notes Views
                  </div>
                </div>
              </div>

              {/* Stat 3: Interviews Taken */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF7ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EA580C'
                  }}
                >
                  <Briefcase size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    10K+
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>
                    Interviews Taken
                  </div>
                </div>
              </div>

              {/* Stat 4: Student Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F59E0B'
                  }}
                >
                  <Star size={16} fill="#F59E0B" color="#F59E0B" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    4.9/5
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>
                    Student Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            HERO LOWER: SEARCH BAR & BRANCH SELECTOR (Matching IMAGE 2)
            =================================================================== */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            padding: '1rem 1.5rem 1.75rem',
            boxSizing: 'border-box'
          }}
        >
          {/* Centered Floating Search Bar */}
          <div style={{ maxWidth: '780px', margin: '0 auto 1.15rem' }}>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                border: '2px solid #E2E8F0',
                borderRadius: '999px',
                padding: '0.4rem 0.5rem 0.4rem 1.4rem',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#881337';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(136, 19, 55, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(15, 23, 42, 0.08)';
              }}
            >
              <Search size={19} color="#94A3B8" style={{ flexShrink: 0, marginRight: '0.85rem' }} />
              <input
                type="text"
                placeholder="Search subjects, topics, PYQs, notes, internships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.98rem',
                  fontWeight: 500,
                  color: '#0F172A',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#881337',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.78rem 2.1rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 14px rgba(136, 19, 55, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#70102B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#881337'}
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Access Branch Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#334155', marginRight: '0.45rem' }}>
              Quick Access:
            </span>

            {branches.map((b) => {
              const isSelected = selectedBranch === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBranchClick(b)}
                  style={{
                    padding: '0.45rem 1.15rem',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isSelected ? 'none' : '1.5px solid #E2E8F0',
                    backgroundColor: isSelected ? '#881337' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    boxShadow: isSelected ? '0 4px 14px rgba(136, 19, 55, 0.25)' : '0 1px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span>{b}</span>
                  {b === 'All Branches' && <ChevronDown size={14} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================================================================
          GOLDEN-MAROON RIBBON WAVE TRANSITION DIVIDER
          =================================================================== */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto -4px',
          height: '24px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4
        }}
      >
        <div
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #7A1326 0%, #A81B34 30%, #E89A3C 60%, #F59E0B 85%, #E5B842 100%)',
            boxShadow: '0 4px 12px rgba(122, 19, 38, 0.18)'
          }}
        />
      </div>

      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <style>{`
        .pv-cat-signboard-link:hover {
          outline: 3px dashed rgba(234, 88, 12, 0.85);
          outline-offset: 4px;
          background-color: rgba(234, 88, 12, 0.1);
          box-shadow: 0 0 24px rgba(234, 88, 12, 0.5);
        }
        @media (max-width: 900px) {
          .pv-hero-scene-wrap {
            min-height: 580px !important;
          }
          .pv-hero-legibility-scrim {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.90) 65%, rgba(255, 255, 255, 0.45) 100%) !important;
          }
        }
      `}</style>
    </section>
  );
}
