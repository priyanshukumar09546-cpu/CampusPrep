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
  Star,
  BookOpen,
  ChevronRight,
  Globe,
  BarChart2
} from 'lucide-react';
import DemoVideoModal from './DemoVideoModal';
import { GiftPromotion } from './MentorNearby';

export default function HeroSection({ onSearch, onSelectBranch, onNavigate }) {
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

  return (
    <section style={{
      backgroundColor: 'transparent',
      padding: '2.5rem 0 2rem 0',
      position: 'relative',
      overflow: 'hidden'
    }} className="pv-scroll-reveal">
      {/* Background Subtle Space Nebula Ambient Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 184, 0, 0.035) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255, 140, 0, 0.025) 0%, transparent 50%)
        `,
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

            {/* Top Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#111111',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              borderRadius: '9999px',
              padding: '0.35rem 0.95rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#FFB800',
              marginBottom: '1.15rem',
              boxShadow: '0 0 14px rgba(255, 184, 0, 0.15)'
            }}>
              <span>🎓</span>
              <span>Trusted by 50,000+ Engineering Students</span>
            </div>

            {/* Brand Title: ProfessorVirus */}
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.75rem, 4.4vw, 3.85rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              margin: '0 0 0.45rem 0',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}>
              <span>Professor</span><span style={{ color: '#FFB800' }}>Virus</span>
            </h1>

            {/* Sub-headline in Warm Electric Gold */}
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.75rem, 2.7vw, 2.35rem)',
              fontWeight: 900,
              lineHeight: 1.18,
              color: '#FFB800',
              margin: '0 0 1rem 0',
              letterSpacing: '-0.015em',
              textShadow: '0 0 20px rgba(255, 184, 0, 0.25)'
            }}>
              Study Smart. Prepare Better.
            </h2>

            {/* Body Description */}
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.96rem',
              fontWeight: 600,
              lineHeight: 1.6,
              color: '#A1A1AA',
              margin: '0 0 1.5rem 0',
              maxWidth: '470px'
            }}>
              An educational platform providing study resources, notes, previous-year question papers (PYQs), syllabus, quizzes, academic tools and career preparation for students.
            </p>

            {/* CTA Action Buttons with Glowing Bulb Interaction */}
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
                className="pv-glow-btn"
                style={{
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  padding: '0.78rem 1.75rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.25s ease'
                }}
              >
                <span className="pv-bulb" style={{ fontSize: '1rem' }}>💡</span>
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                aria-label="Watch Platform Demo Video"
                className="pv-secondary-btn"
                style={{
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  padding: '0.76rem 1.6rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Play size={14} fill="#FFB800" color="#FFB800" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Real Stats Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(1rem, 2.2vw, 1.85rem)',
              flexWrap: 'wrap',
              paddingBottom: '1.35rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              width: '100%',
              maxWidth: '560px',
              marginBottom: '1.25rem'
            }}>
              {/* Stat 1: Students */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ color: '#FFB800' }}>
                  <Users size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                    50K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#A1A1AA', marginTop: '0.15rem' }}>
                    Students
                  </div>
                </div>
              </div>

              {/* Stat 2: Notes Views */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ color: '#FFB800' }}>
                  <FileText size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                    1M+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#A1A1AA', marginTop: '0.15rem' }}>
                    Notes Views
                  </div>
                </div>
              </div>

              {/* Stat 3: Interviews Taken */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ color: '#FFB800' }}>
                  <Briefcase size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                    10K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#A1A1AA', marginTop: '0.15rem' }}>
                    Interviews Taken
                  </div>
                </div>
              </div>

              {/* Stat 4: Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{ color: '#FFB800' }}>
                  <Star size={18} fill="#FFB800" color="#FFB800" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                    4.9/5
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#A1A1AA', marginTop: '0.15rem' }}>
                    Student Rating
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ===================================================================
              RIGHT COLUMN: COMPLETE UNCROPPED FEMALE STUDENT WITH REAL FLOATING CARDS
              =================================================================== */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '620px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible'
          }} className="hero-right-showcase-container">
            
            {/* Main Relative Canvas for Uncropped Student & Floating Badges */}
            <div style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible'
            }}>
              {/* Uncropped, High-Quality Photorealistic Female College Student */}
              <img
                src="/assets/hero_student_girl_uncropped.png"
                alt="Confident South Asian female engineering student holding textbooks at ProfessorVirus"
                className="hero-student-girl-img"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '520px',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '24px',
                  filter: 'drop-shadow(0 16px 36px rgba(120, 20, 22, 0.10))',
                  userSelect: 'none'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_student_girl_uncropped.jpg';
                }}
              />

              {/* =============================================================
                  LEFT FLANKING CARDS
                  ============================================================= */}
              {/* CARD 1: Study Notes */}
              <div
                onClick={() => onNavigate && onNavigate('notes')}
                className="hero-floating-card hero-card-notes"
                title="Explore Verified Study Notes"
              >
                <span className="hero-card-doodle doodle-left">
                  Study Smarter ➔
                </span>
                <div className="hero-card-icon" style={{ backgroundColor: '#FCE7F3', color: '#BE185D' }}>
                  <BookOpen size={16} strokeWidth={2.4} />
                </div>
                <div className="hero-card-text">
                  <div className="hero-card-title">Study Notes</div>
                  <div className="hero-card-sub">Unit-wise notes for all branches</div>
                </div>
                <ChevronRight size={14} className="hero-card-arrow" />
              </div>

              {/* CARD 2: AKTU PYQs */}
              <div
                onClick={() => onNavigate && onNavigate('pyqs')}
                className="hero-floating-card hero-card-pyqs"
                title="Browse Solved AKTU PYQs"
              >
                <div className="hero-card-icon" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                  <FileText size={16} strokeWidth={2.4} />
                </div>
                <div className="hero-card-text">
                  <div className="hero-card-title">AKTU PYQs</div>
                  <div className="hero-card-sub">Previous year question papers</div>
                </div>
                <ChevronRight size={14} className="hero-card-arrow" />
              </div>

              {/* CARD 3: Resume Maker */}
              <div
                onClick={() => onNavigate && onNavigate('resume-maker')}
                className="hero-floating-card hero-card-resume"
                title="Create ATS-Ready Resume"
              >
                <div className="hero-card-icon" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                  <Briefcase size={16} strokeWidth={2.4} />
                </div>
                <div className="hero-card-text">
                  <div className="hero-card-title">Resume Maker</div>
                  <div className="hero-card-sub">Create ATS-ready resume in minutes</div>
                </div>
                <ChevronRight size={14} className="hero-card-arrow" />
              </div>

              {/* =============================================================
                  RIGHT FLANKING CARDS
                  ============================================================= */}
              {/* CARD 4: Quizzes */}
              <div
                onClick={() => onNavigate && onNavigate('quizzes')}
                className="hero-floating-card hero-card-quizzes"
                title="Practice Topic-wise Quizzes"
              >
                <span className="hero-card-doodle doodle-right">
                  Prepare Better ➔
                </span>
                <div className="hero-card-icon" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                  <Sparkles size={16} strokeWidth={2.4} />
                </div>
                <div className="hero-card-text">
                  <div className="hero-card-title">Quizzes</div>
                  <div className="hero-card-sub">Practice &amp; improve your concepts</div>
                </div>
                <ChevronRight size={14} className="hero-card-arrow" />
              </div>

              {/* CARD 5: Interview Pro */}
              <div
                onClick={() => onNavigate && onNavigate('interview-pro')}
                className="hero-floating-card hero-card-interview"
                title="Start AI Mock Interview"
              >
                <div className="hero-card-icon" style={{ backgroundColor: '#F3E8FF', color: '#9333EA' }}>
                  <Play size={14} fill="#9333EA" strokeWidth={2.4} />
                </div>
                <div className="hero-card-text">
                  <div className="hero-card-title">
                    <span>Interview Pro</span>
                    <span className="hero-card-badge">AI</span>
                  </div>
                  <div className="hero-card-sub">AI mock interviews &amp; coding practice</div>
                </div>
                <ChevronRight size={14} className="hero-card-arrow" />
              </div>

              {/* CARD 6: Result & CGPA */}
              <div
                onClick={() => onNavigate && onNavigate('result-cgpa')}
                className="hero-floating-card hero-card-result"
                title="Analyze Result & SGPA/CGPA"
              >
                <div className="hero-card-icon" style={{ backgroundColor: '#CCFBF1', color: '#0D9488' }}>
                  <BarChart2 size={16} strokeWidth={2.4} />
                </div>
                <div className="hero-card-text">
                  <div className="hero-card-title">Result &amp; CGPA</div>
                  <div className="hero-card-sub">Analyze your result and track progress</div>
                </div>
                <ChevronRight size={14} className="hero-card-arrow" />
              </div>

              {/* CARD 7: Language Skills (Explicitly Required by User) */}
              <div
                onClick={() => {
                  const target = document.getElementById('explore-tools') || document.getElementById('quick-access-section');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else if (onNavigate) {
                    onNavigate('more');
                  }
                }}
                className="hero-floating-card hero-card-language"
                title="Improve Communication & Fluency"
              >
                <span className="hero-card-doodle doodle-future">
                  Build Your Future ➔
                </span>
                <div className="hero-card-icon" style={{ backgroundColor: '#E0E7FF', color: '#4F46E5' }}>
                  <Globe size={16} strokeWidth={2.4} />
                </div>
                <div className="hero-card-text">
                  <div className="hero-card-title">Language Skills</div>
                  <div className="hero-card-sub">Improve communication &amp; fluency</div>
                </div>
                <ChevronRight size={14} className="hero-card-arrow" />
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================================
            PREMIUM 3D GIFT PROMOTION (Matches Reference Image 1)
            Positioned in the visual focal zone between left text & right student
            =================================================================== */}
        <div className="hero-gift-placement">
          <GiftPromotion />
        </div>

        {/* ===================================================================
            CENTERED SEARCH BAR & BRANCH FILTERS (Matches Reference Image 1)
            =================================================================== */}
        <div style={{
          width: '100%',
          maxWidth: '820px',
          margin: '2.5rem auto 0 auto',
          position: 'relative',
          zIndex: 5
        }} className="hero-search-centered-section">
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', marginBottom: '0.85rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0B0B0B',
              borderRadius: '9999px',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              padding: '0.42rem 0.45rem 0.42rem 1.35rem',
              boxShadow: '0 4px 25px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 184, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}>
              <Search size={18} style={{ color: '#FFB800', marginRight: '0.75rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search subjects, topics, PYQs, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backgroundColor: 'transparent',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.62rem 1.65rem',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  borderRadius: '9999px',
                  backgroundColor: '#0B0B0B',
                  border: '1.5px solid rgba(255, 184, 0, 0.5)',
                  color: '#FFB800',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 0 16px rgba(255, 184, 0, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#161616';
                  e.currentTarget.style.borderColor = '#FFB800';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(255, 184, 0, 0.45)';
                  e.currentTarget.style.color = '#FFA000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0B0B0B';
                  e.currentTarget.style.borderColor = 'rgba(255, 184, 0, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 184, 0, 0.25)';
                  e.currentTarget.style.color = '#FFB800';
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
            justifyContent: 'center',
            gap: '0.45rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A1A1AA', marginRight: '0.25rem' }}>
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
                    padding: '0.28rem 0.85rem',
                    borderRadius: '9999px',
                    border: isSel ? '1.5px solid #FFB800' : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: isSel ? '#FFB800' : '#0B0B0B',
                    color: isSel ? '#030303' : '#A1A1AA',
                    fontWeight: isSel ? 800 : 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    boxShadow: isSel ? '0 0 12px rgba(255, 184, 0, 0.4)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSel) {
                      e.currentTarget.style.borderColor = 'rgba(255, 184, 0, 0.4)';
                      e.currentTarget.style.backgroundColor = '#161616';
                      e.currentTarget.style.color = '#FFB800';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSel) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.backgroundColor = '#0B0B0B';
                      e.currentTarget.style.color = '#A1A1AA';
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

      {/* Hero Showcase Styling & Responsive Rules */}
      <style>{`
        .hero-gift-placement {
          position: absolute;
          top: 65px;
          left: 49%;
          transform: translateX(-50%);
          z-index: 15;
        }

        @media (max-width: 1240px) {
          .hero-gift-placement {
            left: 49%;
            top: 55px;
            transform: translateX(-50%) scale(0.92);
          }
        }

        @media (max-width: 1024px) {
          .hero-gift-placement {
            position: relative;
            top: 0;
            left: 0;
            transform: none;
            margin: 1.5rem auto 1rem;
            display: flex;
            justify-content: center;
          }
        }

        .hero-floating-card {
          position: absolute;
          z-index: 5;
          background-color: #0B0B0B;
          border-radius: 14px;
          padding: 0.48rem 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(12px);
          width: max-content;
          max-width: 228px;
          white-space: nowrap;
        }

        .hero-floating-card:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 184, 0, 0.25);
          border-color: #FFB800;
        }

        .hero-card-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-card-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
          text-align: left;
        }

        .hero-card-title {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.15;
        }

        .hero-card-badge {
          font-size: 0.58rem;
          font-weight: 800;
          padding: 0.08rem 0.35rem;
          border-radius: 9999px;
          background-color: rgba(255, 184, 0, 0.15);
          color: #FFB800;
          border: 1px solid rgba(255, 184, 0, 0.35);
        }

        .hero-card-sub {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.66rem;
          font-weight: 600;
          color: #A1A1AA;
          line-height: 1.25;
          margin-top: 0.1rem;
        }

        .hero-card-arrow {
          color: #71717A;
          margin-left: auto;
          flex-shrink: 0;
          transition: transform 0.18s ease;
        }

        .hero-floating-card:hover .hero-card-arrow {
          transform: translateX(2px);
          color: #FFB800;
        }

        .hero-card-doodle {
          position: absolute;
          font-family: 'Kalam', 'Patrick Hand', cursive;
          font-size: 0.8rem;
          font-weight: 700;
          color: #FFB800;
          pointer-events: none;
          white-space: nowrap;
          text-shadow: 0 0 10px rgba(255, 184, 0, 0.3);
        }

        .doodle-left {
          top: -1.35rem;
          left: 0.4rem;
        }

        .doodle-right {
          top: -1.35rem;
          right: 0.4rem;
        }

        .doodle-future {
          bottom: -1.35rem;
          right: 0.4rem;
        }

        /* Desktop Card Coordinates */
        .hero-card-notes {
          top: 3%;
          left: -4%;
        }

        .hero-card-pyqs {
          top: 33%;
          left: -8%;
        }

        .hero-card-resume {
          top: 63%;
          left: -4%;
        }

        .hero-card-quizzes {
          top: 3%;
          right: -4%;
        }

        .hero-card-interview {
          top: 31%;
          right: -8%;
        }

        .hero-card-result {
          top: 57%;
          right: -5%;
        }

        .hero-card-language {
          top: 83%;
          right: -2%;
        }

        /* Tablet & Compact Desktop Sizing */
        @media (max-width: 1240px) {
          .hero-floating-card {
            padding: 0.4rem 0.68rem;
            max-width: 205px;
            gap: 0.45rem;
          }
          .hero-card-title {
            font-size: 0.76rem;
          }
          .hero-card-sub {
            font-size: 0.62rem;
          }
          .hero-card-icon {
            width: 28px;
            height: 28px;
          }
          .hero-card-notes { left: 0%; top: 2%; }
          .hero-card-pyqs { left: -3%; top: 32%; }
          .hero-card-resume { left: 0%; top: 62%; }
          .hero-card-quizzes { right: 0%; top: 2%; }
          .hero-card-interview { right: -3%; top: 30%; }
          .hero-card-result { right: -2%; top: 56%; }
          .hero-card-language { right: 0%; top: 82%; }
        }

        @media (max-width: 960px) {
          .hero-2col-layout {
            grid-template-columns: 1fr !important;
            gap: 2.25rem !important;
          }
          .hero-right-showcase-container {
            max-width: 500px !important;
          }
          .hero-card-notes { left: 2%; top: 2%; }
          .hero-card-pyqs { left: -1%; top: 32%; }
          .hero-card-resume { left: 2%; top: 62%; }
          .hero-card-quizzes { right: 2%; top: 2%; }
          .hero-card-interview { right: -1%; top: 30%; }
          .hero-card-result { right: 0%; top: 56%; }
          .hero-card-language { right: 2%; top: 82%; }
        }

        @media (max-width: 600px) {
          .hero-floating-card {
            padding: 0.35rem 0.55rem;
            max-width: 175px;
            gap: 0.35rem;
          }
          .hero-card-title {
            font-size: 0.72rem;
          }
          .hero-card-sub {
            font-size: 0.58rem;
          }
          .hero-card-icon {
            width: 24px;
            height: 24px;
          }
          .hero-card-doodle {
            display: none !important;
          }
        }
      `}</style>

      {/* 60-Second Walkthrough Demo Video Modal */}
      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        videoSrc="/videos/professorvirus-demo.mp4"
        videoTitle="Discover ProfessorVirus — Complete Platform Tour"
      />
    </section>
  );
}
