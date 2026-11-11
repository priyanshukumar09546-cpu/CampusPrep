import React, { useState } from 'react';
import {
  Search,
  Sparkles,
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
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        padding: '2.5rem 0 1rem 0'
      }}
    >
      {/* Decorative Tree Branches on Left (Match Reference Image) */}
      <img
        src="/assets/leaves-top.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-15px',
          left: '-15px',
          width: '160px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.85
        }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      <img
        src="/assets/leaves-bottom.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '-20px',
          width: '150px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.85
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
            1. HERO SPLIT: PROFESSORVIRUS (LEFT) × BUILDING & CAT (RIGHT)
            =================================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.2fr)',
            gap: '2.5rem',
            alignItems: 'center',
            marginBottom: '2.5rem'
          }}
          className="pv-hero-split-grid"
        >
          {/* ===============================================================
              LEFT COLUMN: BRAND TYPOGRAPHY, BUTTONS & STATS
              =============================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
                marginBottom: '1.25rem',
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
                fontSize: 'clamp(2.1rem, 4.4vw, 4.1rem)',
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
                  fontSize: 'clamp(1.4rem, 2.7vw, 2.5rem)',
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
                fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#475569',
                margin: '0 0 1.75rem 0',
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
                marginBottom: '2rem'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('notes');
                }}
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  padding: '0.85rem 1.85rem',
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
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  padding: '0.85rem 1.65rem',
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
                gap: 'clamp(1rem, 2vw, 2rem)',
                flexWrap: 'wrap'
              }}
            >
              {/* Stat 1: Students */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                  <Users size={17} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    50K+
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>
                    Students
                  </div>
                </div>
              </div>

              {/* Stat 2: Notes Views */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                  <FileText size={17} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    1M+
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>
                    Notes Views
                  </div>
                </div>
              </div>

              {/* Stat 3: Interviews Taken */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                  <Briefcase size={17} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    10K+
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>
                    Interviews Taken
                  </div>
                </div>
              </div>

              {/* Stat 4: Student Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                  <Star size={17} fill="#F59E0B" color="#F59E0B" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    4.9/5
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>
                    Student Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===============================================================
              RIGHT COLUMN: FULL BUILDING, TREES, GARDEN & CAT MASCOT
              (Never cropped, unscaled, exactly as in Reference Image 2)
              =============================================================== */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {/* The Full Building Visual with Surrounding Environment & Cat */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                border: '3px solid #FFFFFF'
              }}
            >
              <img
                src="/assets/prma_building_cat_scene_2x.jpg"
                alt="PRMA Tech Global Technology Center with surrounding trees, flowers and Cat Mascot holding internship sign"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '654 / 296',
                  objectFit: 'contain',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = '/assets/prma_gen/prma_office_building.jpg';
                }}
              />
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. CENTERED SEARCH BAR (Translucent Glass + Burgundy Button)
            =================================================================== */}
        <div style={{ maxWidth: '820px', margin: '0 auto 1.25rem' }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E8F0',
              borderRadius: '999px',
              padding: '0.45rem 0.55rem 0.45rem 1.5rem',
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
            <Search size={20} color="#94A3B8" style={{ flexShrink: 0, marginRight: '0.85rem' }} />
            <input
              type="text"
              placeholder="Search subjects, topics, PYQs, notes, internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
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
                padding: '0.85rem 2.2rem',
                fontSize: '0.98rem',
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
            marginBottom: '2.5rem'
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

        {/* Flowing Velvet Wavy Ribbon Transition (Match Reference Image 2) */}
        <div
          style={{
            height: '14px',
            width: '100%',
            maxWidth: '1360px',
            margin: '0 auto -6px',
            background: 'linear-gradient(90deg, #881337 0%, #B91C1C 40%, #E5B842 75%, #F59E0B 100%)',
            borderRadius: '999px',
            opacity: 0.92,
            boxShadow: '0 4px 12px rgba(136, 19, 55, 0.15)'
          }}
        />
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
