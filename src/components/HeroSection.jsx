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
      style={{
        background: 'linear-gradient(135deg, #FFF8F3 0%, #FFF3F5 25%, #FAF5F0 50%, #FFF4F6 75%, #FAF5EE 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '1.75rem 0 0 0'
      }}
      className="pv-hero-continuous-section"
    >
      {/* Top-Left Authentic Green Tree Foliage (Direct from Reference Image) */}
      <img
        src="/assets/prma_hero_leaves_top_2x.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 'clamp(140px, 16vw, 240px)',
          height: 'auto',
          pointerEvents: 'none',
          zIndex: 1,
          userSelect: 'none'
        }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* ===================================================================
            1. HERO SPLIT: PROFESSORVIRUS (LEFT) + BUILDING & CAT MASCOT (RIGHT)
            (Continuous composition, NO card border, NO card shadow)
            =================================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.35fr)',
            gap: '1.5rem',
            alignItems: 'center',
            marginBottom: '1.75rem'
          }}
          className="pv-hero-split-grid"
        >
          {/* ===============================================================
              LEFT COLUMN: BRAND TYPOGRAPHY, BUTTONS & STATS
              =============================================================== */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              paddingTop: '0.5rem',
              zIndex: 3
            }}
          >
            {/* Pill Badge with Graduation Cap & Star */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '999px',
                padding: '0.35rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1.15rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
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
                fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)',
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
                color: '#475569',
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
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
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
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>
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
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>
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
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>
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
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>
                    Student Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===============================================================
              RIGHT COLUMN: FULL BUILDING, TREES, GARDEN & CAT MASCOT
              (Integrated Continuous Composition — NO Card Border, NO Box)
              =============================================================== */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              overflow: 'visible'
            }}
          >
            <img
              src="/assets/prma_hero_right_seamless_2x.png"
              alt="PRMA Tech Global Campus, Greenery, Trees, and Cat Mascot"
              style={{
                width: '100%',
                maxWidth: '840px',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
              onError={(e) => {
                e.target.src = '/assets/prma_continuous_hero_bg_2x.jpg';
              }}
            />
          </div>
        </div>

        {/* ===================================================================
            2. CENTERED SEARCH BAR (Translucent Glass + Burgundy Button)
            =================================================================== */}
        <div style={{ maxWidth: '800px', margin: '0 auto 1.15rem' }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E8F0',
              borderRadius: '999px',
              padding: '0.4rem 0.5rem 0.4rem 1.4rem',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#881337';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(136, 19, 55, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(15, 23, 42, 0.06)';
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

        {/* ===================================================================
            3. QUICK ACCESS: BRANCH SELECTOR PILLS
            =================================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.55rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}
        >
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#475569', marginRight: '0.45rem' }}>
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

        {/* Golden-Maroon Ribbon Wave Divider (Match Reference Image Exactly) */}
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
            justifyContent: 'center'
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
      </div>

      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* Responsive Breakpoints */}
      <style>{`
        @media (max-width: 1024px) {
          .pv-hero-split-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .pv-hero-split-grid > div:first-child {
            align-items: center !important;
          }
        }
      `}</style>
    </section>
  );
}
