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
  Code2,
  Award,
  Trophy,
  Rocket,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';
import DemoVideoModal from './DemoVideoModal';
import { useTheme } from '../context/ThemeContext';

export default function HeroSection({ onSearch, onSelectBranch, onNavigate }) {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

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

  const handlePrmaInternshipClick = () => {
    if (onNavigate) {
      onNavigate('prma-internships-home');
    }
  };

  return (
    <section
      style={{
        backgroundColor: 'transparent',
        padding: '1.75rem 0 2rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="pv-scroll-reveal"
    >
      {/* Background Subtle Space & Cream Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? `
              radial-gradient(circle at 15% 25%, rgba(255, 185, 0, 0.06) 0%, transparent 45%),
              radial-gradient(circle at 85% 30%, rgba(8, 102, 245, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 50% 85%, rgba(112, 37, 232, 0.05) 0%, transparent 50%)
            `
            : `
              radial-gradient(circle at 10% 20%, rgba(255, 185, 0, 0.12) 0%, transparent 40%),
              radial-gradient(circle at 90% 25%, rgba(8, 102, 245, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 95% 85%, rgba(255, 189, 18, 0.1) 0%, transparent 40%)
            `,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div
        className="container pv-main-container"
        style={{
          maxWidth: 'min(1560px, 94vw)',
          margin: '0 auto',
          padding: '0 clamp(1rem, 2vw, 2.25rem)',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* ===================================================================
            1. TWO-BRAND HERO SECTION: PROFESSORVIRUS (LEFT) × PRMA TECH (RIGHT)
            =================================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.15fr)',
            gap: 'clamp(1.5rem, 3vw, 2.75rem)',
            alignItems: 'center',
            marginBottom: '2rem'
          }}
          className="hero-2col-layout"
        >
          {/* ===============================================================
              LEFT COLUMN: PROFESSORVIRUS BRAND & VALUE PROPOSITION
              =============================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {/* Top Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: isDark ? 'rgba(255, 185, 0, 0.1)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 185, 0, 0.35)' : '1px solid #F1E2CE',
                borderRadius: '9999px',
                padding: '0.35rem 0.95rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: isDark ? '#FFB800' : '#8A5D00',
                marginBottom: '1.1rem',
                boxShadow: isDark ? '0 0 16px rgba(255, 184, 0, 0.15)' : '0 2px 8px rgba(138, 93, 0, 0.06)'
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>🎓</span>
              <span>Trusted by 50,000+ Engineering Students</span>
            </div>

            {/* Main Brand Title */}
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2.75rem, 4.3vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.025em',
                color: isDark ? '#FFFFFF' : '#1A1D1F'
              }}
            >
              <span>Professor</span>
              <span style={{ color: '#FFB900' }}>Virus</span>
            </h1>

            {/* Slogan */}
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.65rem, 2.6vw, 2.35rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#F59E0B',
                margin: '0 0 0.95rem 0',
                letterSpacing: '-0.015em'
              }}
            >
              Study Smart. Prepare Better.
            </h2>

            {/* Body Description */}
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.96rem',
                fontWeight: 500,
                lineHeight: 1.6,
                color: isDark ? '#A1A1AA' : '#57534E',
                margin: '0 0 1.5rem 0',
                maxWidth: '520px'
              }}
            >
              An educational platform providing study resources, notes, previous-year question papers (PYQs), syllabus, quizzes, academic tools and career preparation for students.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
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
                  padding: '0.78rem 1.65rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#161616',
                  color: '#FFFFFF',
                  border: '1.5px solid #2B2B2B',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.borderColor = '#FFB900';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#161616';
                  e.currentTarget.style.borderColor = '#2B2B2B';
                }}
              >
                <span style={{ fontSize: '1rem', color: '#FFB900' }}>💡</span>
                <span>Get Started Free</span>
                <ArrowRight size={16} color="#FFB900" />
              </button>

              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  padding: '0.78rem 1.45rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#1F2421',
                  border: isDark ? '1.5px solid rgba(255, 255, 255, 0.14)' : '1.5px solid #E8E2D5',
                  boxShadow: isDark ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#F59E0B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.14)' : '#E8E2D5';
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706'
                  }}
                >
                  <Play size={12} fill="#D97706" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Verified Statistics Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.85rem, 1.8vw, 1.6rem)',
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: '560px'
              }}
            >
              {/* Stat 1: Students */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ color: '#D97706' }}>
                  <Users size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.98rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1F2421', lineHeight: 1.1 }}>
                    50K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: isDark ? '#A1A1AA' : '#78716C', marginTop: '0.1rem' }}>
                    Students
                  </div>
                </div>
              </div>

              {/* Stat 2: Notes Views */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ color: '#D97706' }}>
                  <FileText size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.98rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1F2421', lineHeight: 1.1 }}>
                    1M+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: isDark ? '#A1A1AA' : '#78716C', marginTop: '0.1rem' }}>
                    Notes Views
                  </div>
                </div>
              </div>

              {/* Stat 3: Interviews Taken */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ color: '#D97706' }}>
                  <Briefcase size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.98rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1F2421', lineHeight: 1.1 }}>
                    10K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: isDark ? '#A1A1AA' : '#78716C', marginTop: '0.1rem' }}>
                    Interviews Taken
                  </div>
                </div>
              </div>

              {/* Stat 4: Student Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ color: '#F59E0B' }}>
                  <Star size={18} fill="#F59E0B" color="#F59E0B" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.98rem', fontWeight: 900, color: isDark ? '#FFFFFF' : '#1F2421', lineHeight: 1.1 }}>
                    4.9/5
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: isDark ? '#A1A1AA' : '#78716C', marginTop: '0.1rem' }}>
                    Student Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===============================================================
              RIGHT COLUMN: PRMA TECH PARTNERSHIP PANEL & 3D SHOWCASE
              =============================================================== */}
          <div
            style={{
              position: 'relative',
              backgroundColor: isDark ? '#10141D' : '#FFFFFF',
              borderRadius: '28px',
              border: isDark ? '1.5px solid rgba(8, 102, 245, 0.35)' : '1.5px solid #E8EAF2',
              boxShadow: isDark
                ? '0 16px 48px rgba(0, 0, 0, 0.7), 0 0 32px rgba(8, 102, 245, 0.15)'
                : '0 12px 40px rgba(16, 28, 80, 0.08), 0 2px 10px rgba(8, 102, 245, 0.04)',
              overflow: 'hidden',
              padding: 'clamp(1.25rem, 2.2vw, 2rem)'
            }}
            className="prma-partnership-hero-card"
          >
            {/* Top Tag: In Partnership with */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: isDark ? 'rgba(112, 37, 232, 0.2)' : '#F3E8FF',
                color: isDark ? '#C084FC' : '#7025E8',
                borderRadius: '9999px',
                padding: '0.3rem 0.85rem',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                marginBottom: '0.9rem'
              }}
            >
              <Rocket size={13} color={isDark ? '#C084FC' : '#7025E8'} />
              <span>In Partnership with</span>
            </div>

            {/* Grid Split: Info Left + Visual Scene Right */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
                gap: '1.25rem',
                alignItems: 'center'
              }}
              className="prma-card-grid"
            >
              {/* Left Details inside Card */}
              <div>
                {/* Official PRMA Tech Logo */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <img
                    src="/assets/prma_tech_logo.png"
                    alt="PRMA Tech Official Logo"
                    style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/prma_tech_logo.png';
                    }}
                  />
                </div>

                {/* Main Heading */}
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 'clamp(1.35rem, 2vw, 1.7rem)',
                    fontWeight: 900,
                    lineHeight: 1.2,
                    color: isDark ? '#FFFFFF' : '#101C50',
                    margin: '0 0 0.5rem 0',
                    letterSpacing: '-0.015em'
                  }}
                >
                  Industry-Ready Remote Internship Programs
                </h3>

                {/* Subtitle */}
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: isDark ? '#94A3B8' : '#475569',
                    lineHeight: 1.5,
                    margin: '0 0 1rem 0',
                    fontWeight: 500
                  }}
                >
                  Work on real-world projects, get expert mentorship and build a job-ready tech career with PRMA Tech.
                </p>

                {/* 4 Feature Pills in 2x2 Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '0.55rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  {[
                    { icon: Code2, label: 'Real Projects', color: '#0866F5', bg: 'rgba(8, 102, 245, 0.08)' },
                    { icon: Users, label: 'Expert Mentorship', color: '#079B45', bg: 'rgba(7, 155, 69, 0.08)' },
                    { icon: Award, label: 'Verified Certificate', color: '#7025E8', bg: 'rgba(112, 37, 232, 0.08)' },
                    { icon: Trophy, label: 'Performance Stipend', color: '#EA3323', bg: 'rgba(234, 51, 35, 0.08)' }
                  ].map((feat, idx) => {
                    const FIcon = feat.icon;
                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : feat.bg,
                          borderRadius: '10px',
                          padding: '0.45rem 0.65rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.03)'
                        }}
                      >
                        <FIcon size={14} color={feat.color} strokeWidth={2.5} />
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isDark ? '#E2E8F0' : '#1E293B', whiteSpace: 'nowrap' }}>
                          {feat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handlePrmaInternshipClick}
                    style={{
                      background: 'linear-gradient(135deg, #0866F5 0%, #0052CC 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.7rem 1.35rem',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 6px 18px rgba(8, 102, 245, 0.35)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(8, 102, 245, 0.45)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(8, 102, 245, 0.35)';
                    }}
                  >
                    <span>Get Internship at PRMA Tech</span>
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </button>

                  <button
                    type="button"
                    onClick={handlePrmaInternshipClick}
                    style={{
                      backgroundColor: 'transparent',
                      color: isDark ? '#E2E8F0' : '#334155',
                      border: isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1',
                      borderRadius: '9999px',
                      padding: '0.68rem 1.15rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0866F5';
                      e.currentTarget.style.color = '#0866F5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1';
                      e.currentTarget.style.color = isDark ? '#E2E8F0' : '#334155';
                    }}
                  >
                    <span>Know More</span>
                  </button>
                </div>
              </div>

              {/* Right 3D Office Building & Merchandise Kit Scene */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <img
                    src="/assets/prma_building_merch_scene.png"
                    alt="PRMA Tech Modern Office Building & Official Welcome Kit"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '275px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/prma_hero_showcase_ref.jpg';
                    }}
                  />
                  {/* Subtle Badge Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(16, 28, 80, 0.88)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFBD12',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      letterSpacing: '0.02em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <span>✨ Official Kit & Certificate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. ACADEMIC SEARCH SECTION (FLOATING BELOW HERO WITH BRANCH CHIPS)
            =================================================================== */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Main Floating Search Bar Card */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              backgroundColor: isDark ? '#14171F' : '#FFFFFF',
              borderRadius: '9999px',
              border: isDark ? '1.5px solid rgba(255, 185, 0, 0.3)' : '1.5px solid #F1E2CE',
              boxShadow: isDark
                ? '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 185, 0, 0.08)'
                : '0 8px 30px rgba(138, 93, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.03)',
              padding: '0.45rem 0.55rem 0.45rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.2s ease',
              marginBottom: '0.95rem'
            }}
          >
            <Search size={20} color="#F59E0B" strokeWidth={2.4} style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, topics, PYQs, notes, internships..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.94rem',
                fontWeight: 600,
                color: isDark ? '#FFFFFF' : '#1F2421',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#161616',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.65rem 1.45rem',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000000'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#161616'; }}
            >
              Search
            </button>
          </form>

          {/* Branch Filter Chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: isDark ? '#A1A1AA' : '#78716C',
                marginRight: '0.2rem'
              }}
            >
              Branch:
            </span>
            {branches.map((b) => {
              const isSelected = selectedBranch === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBranchClick(b)}
                  style={{
                    backgroundColor: isSelected
                      ? '#FFB900'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : '#FFFFFF',
                    color: isSelected ? '#161616' : isDark ? '#CBD5E1' : '#44403C',
                    border: isSelected
                      ? '1px solid #FFB900'
                      : isDark
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid #E8E2D5',
                    borderRadius: '9999px',
                    padding: '0.28rem 0.8rem',
                    fontSize: '0.76rem',
                    fontWeight: isSelected ? 800 : 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected
                      ? '0 2px 10px rgba(255, 185, 0, 0.3)'
                      : '0 1px 4px rgba(0, 0, 0, 0.02)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#FFB900';
                      e.currentTarget.style.color = '#FFB900';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#E8E2D5';
                      e.currentTarget.style.color = isDark ? '#CBD5E1' : '#44403C';
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

      {/* Demo Video Modal */}
      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <style>{`
        @media (max-width: 1023px) {
          .hero-2col-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .prma-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
