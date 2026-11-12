import React from 'react';
import {
  BookOpen,
  Code2,
  Briefcase,
  Award,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Check,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function TwoBrandsJourneySection({ onNavigate }) {
  const { isDark } = useTheme();

  const steps = [
    {
      num: '01',
      title: 'Learn',
      brand: 'ProfessorVirus',
      brandColor: '#FFB800',
      desc: 'Master fundamentals with unit-wise engineering notes, syllabus breakdowns, and curated study materials.',
      icon: BookOpen
    },
    {
      num: '02',
      title: 'Practice',
      brand: 'ProfessorVirus',
      brandColor: '#FF8C00',
      desc: 'Sharpen your exam readiness and coding speed with AKTU PYQs, interactive quizzes, and AI mock interviews.',
      icon: Zap
    },
    {
      num: '03',
      title: 'Build',
      brand: 'PRMA Tech',
      brandColor: '#0866F5',
      desc: 'Transform conceptual knowledge into production-ready software using modern frameworks and clean architecture.',
      icon: Code2
    },
    {
      num: '04',
      title: 'Intern',
      brand: 'PRMA Tech',
      brandColor: '#7025E8',
      desc: 'Gain real workplace experience in 100% remote internships with 1-on-1 guidance from active tech mentors.',
      icon: Briefcase
    },
    {
      num: '05',
      title: 'Grow',
      brand: 'Ecosystem',
      brandColor: '#079B45',
      desc: 'Earn authentic verified credentials, build a stellar project portfolio, and secure top placement offers.',
      icon: Award
    }
  ];

  const handleStudyClick = () => {
    if (onNavigate) {
      onNavigate('notes');
    } else {
      window.location.href = '/notes';
    }
  };

  const handleInternshipClick = () => {
    if (onNavigate) {
      onNavigate('prma-home');
    } else {
      window.location.href = '/prma-tech';
    }
  };

  return (
    <section
      id="two-brands-journey"
      className="pv-scroll-reveal"
      style={{
        backgroundColor: 'transparent',
        padding: '3.5rem 0 4.5rem 0',
        position: 'relative'
      }}
    >
      <div
        className="container pv-main-container"
        style={{
          maxWidth: 'min(1560px, 94vw)',
          margin: '0 auto',
          padding: '0 clamp(1rem, 2.5vw, 2.5rem)'
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: isDark ? 'rgba(255, 184, 0, 0.1)' : '#FFF9EE',
              border: isDark ? '1px solid rgba(255, 184, 0, 0.3)' : '1.5px solid #FDE68A',
              marginBottom: '0.85rem'
            }}
          >
            <Sparkles size={14} color="#FFB800" />
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: isDark ? '#FFB800' : '#B45309',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              The Unified Student Ecosystem
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2rem, 3.2vw, 2.85rem)',
              fontWeight: 900,
              color: isDark ? '#FFFFFF' : '#1F2421',
              margin: '0 0 0.65rem 0',
              lineHeight: 1.2
            }}
          >
            From Learning to Building.{' '}
            <span
              style={{
                color: isDark ? '#FFB800' : '#E59500',
                textShadow: isDark ? '0 0 20px rgba(255, 184, 0, 0.35)' : 'none'
              }}
            >
              From Skills to Career.
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
              color: isDark ? '#A1A1AA' : '#64748B',
              margin: '0 auto',
              maxWidth: '720px',
              lineHeight: 1.6
            }}
          >
            How ProfessorVirus and PRMA Tech collaborate seamlessly to support every milestone of your
            engineering journey — from college semester exams to your first high-paying industry job.
          </p>
        </div>

        {/* 5-STEP ROADMAP TIMELINE */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            marginBottom: '3.75rem',
            position: 'relative'
          }}
          className="two-brands-roadmap-grid"
        >
          {steps.map((st, idx) => {
            const SIcon = st.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: isDark ? '#0B0B0B' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1.5px solid #E8E2D5',
                  borderRadius: '22px',
                  padding: '1.45rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = st.brandColor;
                  e.currentTarget.style.boxShadow = `0 12px 28px ${st.brandColor}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E8E2D5';
                  e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.03)';
                }}
              >
                <div>
                  {/* Step Number & Icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        color: st.brandColor,
                        opacity: 0.85
                      }}
                    >
                      {st.num}
                    </span>

                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: `${st.brandColor}15`,
                        border: `1.5px solid ${st.brandColor}35`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: st.brandColor
                      }}
                    >
                      <SIcon size={18} strokeWidth={2.4} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: isDark ? '#FFFFFF' : '#1F2421',
                      margin: '0 0 0.25rem 0'
                    }}
                  >
                    {st.title}
                  </h3>

                  {/* Brand Tag */}
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: st.brandColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {st.brand}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8rem',
                      color: isDark ? '#A1A1AA' : '#64748B',
                      lineHeight: 1.55,
                      margin: 0
                    }}
                  >
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* DUAL SYNERGY CARDS (PROFESSORVIRUS × PRMA TECH) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {/* CARD 1: PROFESSORVIRUS */}
          <div
            style={{
              backgroundColor: isDark ? '#0F0D07' : '#FFFFFF',
              backgroundImage: isDark
                ? 'radial-gradient(circle at 10% 15%, rgba(255, 184, 0, 0.08) 0%, transparent 50%)'
                : 'radial-gradient(circle at 10% 15%, rgba(255, 184, 0, 0.04) 0%, transparent 50%)',
              border: isDark ? '1.5px solid rgba(255, 184, 0, 0.4)' : '1.5px solid #FDE68A',
              borderRadius: '26px',
              padding: 'clamp(1.75rem, 2.5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isDark
                ? '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 184, 0, 0.08)'
                : '0 8px 30px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#861820',
                    border: '2px solid #FFB800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB800',
                    fontWeight: 900,
                    fontSize: '1rem',
                    fontFamily: "'Outfit', sans-serif"
                  }}
                >
                  PV
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: isDark ? '#FFFFFF' : '#1F2421'
                    }}
                  >
                    Professor<span style={{ color: '#FFB800' }}>Virus</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#FFB800'
                    }}
                  >
                    Study Smart. Prepare Better.
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.92rem',
                  color: isDark ? '#D4D4D8' : '#475569',
                  lineHeight: 1.6,
                  margin: '0 0 1.5rem 0'
                }}
              >
                The complete academic engine built specifically for college students. Comprehensive
                curriculum materials, past examination patterns, and deterministic performance analytics.
              </p>

              {/* Highlights List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '2rem'
                }}
              >
                {[
                  '50,000+ Subject Notes & Unit-Wise Curated Study Material',
                  '10+ Years of AKTU Previous Year Question Papers (PYQs)',
                  'Deterministic Result & SGPA / CGPA Analyzer with Backlog Audit',
                  'Official Branch & Semester Syllabi with Verified PDF Links',
                  'HOOLLOW AI Roadmap & AI-Powered Mock Interview Pro'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 184, 0, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFB800',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.86rem',
                        color: isDark ? '#F4F4F5' : '#334155',
                        lineHeight: 1.5
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStudyClick}
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: isDark ? '#FFB800' : '#861820',
                color: isDark ? '#0B0B0B' : '#FFFFFF',
                border: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.92';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Explore Academic Resources</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* CARD 2: PRMA TECH */}
          <div
            style={{
              backgroundColor: isDark ? '#080C1A' : '#FFFFFF',
              backgroundImage: isDark
                ? 'radial-gradient(circle at 10% 15%, rgba(112, 37, 232, 0.12) 0%, transparent 50%)'
                : 'radial-gradient(circle at 10% 15%, rgba(8, 102, 245, 0.04) 0%, transparent 50%)',
              border: isDark ? '1.5px solid rgba(112, 37, 232, 0.45)' : '1.5px solid #DDD6FE',
              borderRadius: '26px',
              padding: 'clamp(1.75rem, 2.5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isDark
                ? '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 25px rgba(112, 37, 232, 0.12)'
                : '0 8px 30px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                <img
                  src="/assets/prma_tech_logo.png"
                  alt="PRMA Tech Official Logo"
                  style={{
                    height: '32px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: isDark ? '#FFFFFF' : '#101C50'
                    }}
                  >
                    PRMA Tech™
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#7025E8'
                    }}
                  >
                    Build. Learn. Intern. Grow.
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.92rem',
                  color: isDark ? '#D4D4D8' : '#475569',
                  lineHeight: 1.6,
                  margin: '0 0 1.5rem 0'
                }}
              >
                Industry technology and workforce incubator. Real-world project simulation, remote internships,
                custom software architecture, and practical engineering mentorship.
              </p>

              {/* Highlights List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '2rem'
                }}
              >
                {[
                  '12 In-Demand Remote Internship Domains (AI/ML, Web, DevOps, Cloud)',
                  'Physical Welcome Kit (Custom T-Shirt, Water Bottle, Notebook, ID Card)',
                  'Direct 1-on-1 Code Reviews & Mentorship from Senior Engineers',
                  'Globally Verified Internship Certificates & Performance Stipends',
                  'Client-Ready Full-Stack Software Development & Custom IT Services'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(8, 102, 245, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0866F5',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.86rem',
                        color: isDark ? '#F4F4F5' : '#334155',
                        lineHeight: 1.5
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleInternshipClick}
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                boxShadow: '0 8px 24px rgba(8, 102, 245, 0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.92';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Explore PRMA Tech Internships</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .two-brands-roadmap-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .two-brands-roadmap-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}