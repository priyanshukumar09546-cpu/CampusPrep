import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  Users,
  FileText,
  Briefcase,
  Star,
  Rocket,
  GraduationCap,
  Award,
  Laptop,
  Linkedin,
  ExternalLink
} from 'lucide-react';
import DemoVideoModal from './DemoVideoModal';

export default function HeroSection({ onNavigate }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

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
          1. HERO BACKGROUND: Full-Width Original Image 1 (100% Intact)
          Starts at top: 0 to float behind the liquid-glass navbar!
          NO white backgrounds, NO white panels, NO white gradient overlays!
          =================================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        <img
          src="/assets/prma_tech_original_hero_bg_2x.jpg"
          alt="PRMA Tech Global Campus, Sunset Sky, Trees, Building, Cat Mascot and Internship Signboard"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center right',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          onError={(e) => {
            e.currentTarget.src = '/assets/prma_tech_original_hero_bg.jpg';
          }}
        />

        {/* ===============================================================
            CAT SIGNBOARD — FUNCTIONAL CLICKABLE INTERNSHIP LINK OVERLAY
            Accurately positioned over "Apply for Internship at PRMA TECH"
            Navigates to PRMA Tech Homepage as per Required Flow
            =============================================================== */}
        <a
          href="/prma-tech/internships"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) {
              onNavigate('prma-internships-home');
            } else {
              window.location.href = '/prma-tech/internships';
            }
          }}
          title="Apply for Internship at PRMA Tech"
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
          2. HERO CONTENT WRAPPER: Typography, Buttons, Stats & Search
          paddingTop: 62px ensures content starts cleanly below the floating navbar
          =================================================================== */}
      <div
        className="pv-hero-scene-wrap"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1920px',
          margin: '0 auto',
          paddingTop: '68px',
          minHeight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
        {/* ===================================================================
            HERO UPPER: Left-Side Typography, Buttons & Verified Stats
            =================================================================== */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            padding: '1.25rem 1.5rem 1.85rem',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              maxWidth: '720px',
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
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                border: '1.5px solid #E2E8F0',
                borderRadius: '999px',
                padding: '0.35rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1.15rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <GraduationCap size={16} color="#881337" />
              <span>Trusted by 50,000+ Engineering Students</span>
              <span style={{ color: '#F59E0B', fontSize: '0.9rem' }}>⭐</span>
            </div>

            {/* Main Brand Title: ProfessorVirus (Solid Deep Burgundy matching reference image) */}
            <h1
              style={{
                fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                fontSize: 'clamp(2.3rem, 4.4vw, 3.9rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.03em',
                color: '#881337',
                textShadow: '0 1px 3px rgba(255, 255, 255, 0.6)'
              }}
            >
              <span>ProfessorVirus</span>
            </h1>

            {/* Slogan with Golden Brush Curve: Study Smart. Prepare Better. */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.15rem' }}>
              <h2
                style={{
                  fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                  fontSize: 'clamp(1.4rem, 2.7vw, 2.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  textShadow: '0 1px 3px rgba(255, 255, 255, 0.6)'
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
                fontSize: 'clamp(0.94rem, 1.4vw, 1.05rem)',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#1E293B',
                margin: '0 0 1.65rem 0',
                maxWidth: '520px',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
              }}
            >
              An advanced educational platform providing study resources, notes, previous-year question papers (PYQs), syllabus, quizzes, academic tools and career preparation for students.
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
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
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
                gap: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                flexWrap: 'wrap'
              }}
            >
              {/* Stat 1: Students */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF1F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#881337'
                  }}
                >
                  <Users size={15} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.94rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    50K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#475569' }}>
                    Students
                  </div>
                </div>
              </div>

              {/* Stat 2: Notes Views */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFBEB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706'
                  }}
                >
                  <FileText size={15} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.94rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    1M+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#475569' }}>
                    Notes Views
                  </div>
                </div>
              </div>

              {/* Stat 3: Interviews Taken */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF7ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EA580C'
                  }}
                >
                  <Briefcase size={15} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.94rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    10K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#475569' }}>
                    Interviews Taken
                  </div>
                </div>
              </div>

              {/* Stat 4: Student Rating */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F59E0B'
                  }}
                >
                  <Star size={15} fill="#F59E0B" color="#F59E0B" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.94rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    4.9/5
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#475569' }}>
                    Student Rating
                  </div>
                </div>
              </div>
            </div>

            {/* ===============================================================
                3. MSME APPROVAL PROMOTION SECTION & INTERNSHIP CTA (Matching Reference Design)
                =============================================================== */}
            <div style={{ marginTop: '1.25rem', width: '100%', maxWidth: '690px' }} className="pv-scroll-reveal">
              {/* Top CTA Pill — Navigates to PRMA Tech Homepage */}
              <div style={{ marginBottom: '0.65rem' }}>
                <a
                  href="/prma-tech/internships"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('prma-internships-home');
                    else window.location.href = '/prma-tech/internships';
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 1.35rem',
                    borderRadius: '999px',
                    backgroundColor: '#881337',
                    color: '#FFFFFF',
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 6px 20px rgba(136, 19, 55, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="pv-hero-msme-cta-pill pv-btn-burgundy"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(136, 19, 55, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(136, 19, 55, 0.35)';
                  }}
                >
                  <Rocket size={16} color="#FFFFFF" strokeWidth={2.4} />
                  <span style={{ color: '#FFFFFF' }}>Apply Now for Internship at PRMA Tech</span>
                  <ArrowRight size={16} strokeWidth={2.5} color="#FFFFFF" />
                </a>
              </div>

              {/* MSME Registered Card — Exact Reference Composition */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  border: '1.5px solid rgba(136, 19, 55, 0.16)',
                  boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(136, 19, 55, 0.04)',
                  padding: '1.15rem 1.45rem',
                  boxSizing: 'border-box'
                }}
                className="pv-msme-card"
              >
                {/* Upper: Official Emblem & Headings & Description */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flexWrap: 'wrap' }}>
                  {/* Official MSME / Udyam Emblem & Titles */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '44px',
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src="/assets/msme_emblem_clean.png"
                        alt="Official MSME Registered Udyam Approved Enterprise Emblem"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/assets/emblem_of_india.svg';
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div
                        style={{
                          fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                          fontSize: '1.16rem',
                          fontWeight: 900,
                          color: '#0F172A',
                          lineHeight: 1.15,
                          letterSpacing: '-0.02em',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        MSME Registered
                      </div>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#475569',
                          marginTop: '0.15rem',
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Udyam Approved Enterprise
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div
                    style={{
                      width: '1px',
                      height: '44px',
                      backgroundColor: '#E2E8F0',
                      margin: '0 0.2rem'
                    }}
                    className="hidden sm:block"
                  />

                  {/* Description */}
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <p style={{ margin: 0, fontSize: '0.81rem', lineHeight: 1.45, color: '#334155', fontWeight: 600 }}>
                      Kickstart your career with a <strong style={{ color: '#0F172A', fontWeight: 800 }}>real industry internship</strong> at{' '}
                      <strong style={{ color: '#881337', fontWeight: 800 }}>PRMA Tech, an MSME Udyam Approved Enterprise</strong>.
                    </p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.73rem', color: '#64748B', fontWeight: 500 }}>
                      Gain hands-on experience, work on live projects and build industry-ready skills.
                    </p>
                  </div>
                </div>

                {/* Lower: Supporting Highlights & Action Buttons */}
                <div
                  style={{
                    marginTop: '0.9rem',
                    paddingTop: '0.8rem',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.65rem',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Highlights Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.32rem',
                        padding: '0.26rem 0.68rem',
                        borderRadius: '999px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        color: '#334155'
                      }}
                    >
                      <Briefcase size={12} color="#881337" />
                      <span>Industry Internship</span>
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.32rem',
                        padding: '0.26rem 0.68rem',
                        borderRadius: '999px',
                        backgroundColor: '#FFF1F2',
                        border: '1px solid #FECDD3',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        color: '#881337'
                      }}
                    >
                      <Award size={12} color="#881337" />
                      <span>Govt. Recognized (MSME)</span>
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.32rem',
                        padding: '0.26rem 0.68rem',
                        borderRadius: '999px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        color: '#334155'
                      }}
                    >
                      <Laptop size={12} color="#881337" />
                      <span>Live Projects</span>
                    </span>
                  </div>

                  {/* Actions: Apply Now & Follow on LinkedIn */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigate) onNavigate('prma-internships-home');
                        else window.location.href = '/prma-tech/internships';
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.42rem 1.05rem',
                        borderRadius: '999px',
                        backgroundColor: '#881337',
                        color: '#FFFFFF',
                        fontSize: '0.77rem',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 3px 12px rgba(136, 19, 55, 0.35)',
                        transition: 'all 0.15s ease'
                      }}
                      className="pv-msme-btn-apply pv-btn-burgundy"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#70102B';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#881337';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ color: '#FFFFFF' }}>Apply Now</span>
                      <ArrowRight size={13} strokeWidth={2.5} color="#FFFFFF" />
                    </button>

                    <a
                      href="https://www.linkedin.com/company/prmatech/about/?viewAsMember=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.95rem',
                        borderRadius: '999px',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #0A66C2',
                        color: '#0A66C2',
                        fontSize: '0.77rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      className="pv-msme-btn-linkedin"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#EFF6FF';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Linkedin size={13} color="#0A66C2" fill="#0A66C2" />
                      <span style={{ color: '#0A66C2' }}>Follow on LinkedIn</span>
                      <ExternalLink size={11} color="#0A66C2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          4. GOLDEN-MAROON RIBBON WAVE TRANSITION DIVIDER (Matching IMAGE 2)
          Flows smoothly between the hero scene and the feature cards below
          =================================================================== */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0,
          zIndex: 4,
          marginTop: '-1px'
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            display: 'block',
            width: '100%',
            height: 'clamp(48px, 6vw, 84px)'
          }}
        >
          <defs>
            <linearGradient id="maroonRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#70102B" />
              <stop offset="35%" stopColor="#881337" />
              <stop offset="70%" stopColor="#9F1239" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
            <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="75%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <filter id="ribbonShadow" x="-10%" y="-20%" width="120%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#70102B" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Golden Under-Ribbon Swoosh */}
          <path
            d="M0,45 C280,12 560,78 920,40 C1140,16 1320,52 1440,32 L1440,96 L0,96 Z"
            fill="url(#goldRibbonGrad)"
            opacity="0.95"
          />

          {/* Deep Maroon Main Ribbon Wave */}
          <path
            d="M0,32 C320,68 640,8 1000,54 C1200,80 1340,38 1440,48 L1440,96 L0,96 Z"
            fill="url(#maroonRibbonGrad)"
            filter="url(#ribbonShadow)"
          />

          {/* Seamless White Bottom Fill matching the Quick Access section background */}
          <path
            d="M0,62 C340,82 720,42 1100,72 C1260,84 1380,68 1440,64 L1440,96 L0,96 Z"
            fill="#FFFFFF"
          />
        </svg>
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
        }
      `}</style>
    </section>
  );
}
