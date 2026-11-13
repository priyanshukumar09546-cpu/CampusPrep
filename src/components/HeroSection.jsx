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
  Layers,
  BookOpen,
  Wrench,
  Bot
} from 'lucide-react';
import DemoVideoModal from './DemoVideoModal';

// Official SVG WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.411z"
      fill={color}
    />
  </svg>
);

export default function HeroSection({ onNavigate }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <section
      className="pv-hero-original-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1920px',
        margin: '0 auto',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 45%, #FAF6EE 100%)',
        boxSizing: 'border-box'
      }}
    >
      {/* ===================================================================
          1. PURE CSS & SVG AMBIENT BACKGROUND: White & Gold Theme
          - Pure white (#FFFFFF) & Soft ivory (#FFFDF8)
          - Delicate golden aura lighting
          - Curved CSS waves on top corners
          - Absolutely NO pink, NO heavy maroon, NO full-page background photos
          =================================================================== */}
      <div
        className="pv-hero-css-bg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0
        }}
        aria-hidden="true"
      >
        {/* Soft Golden Ambient Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '5%',
            width: '650px',
            height: '650px',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, rgba(255, 243, 204, 0.03) 45%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '-5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(255, 223, 105, 0.06) 0%, transparent 65%)',
            borderRadius: '50%',
            filter: 'blur(50px)'
          }}
        />

        {/* Elegant Golden Curved Wave Accent (Top-Left) */}
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '280px',
            opacity: 0.45,
            pointerEvents: 'none'
          }}
        >
          <path
            d="M-40 0C180 80 420 120 720 70C1020 20 1260 90 1480 30V0H-40Z"
            fill="url(#goldGradientWave)"
          />
          <path
            d="M-40 40C220 130 500 110 820 60C1140 10 1320 80 1480 45"
            stroke="url(#goldStroke)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="goldGradientWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFF2D6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#FFD700" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ===================================================================
          2. HERO CONTENT WRAPPER: Two Column Layout + Horizontal Bar + Feature Stripe
          paddingTop: 80px clears the floating liquid-glass navbar
          =================================================================== */}
      <div
        className="pv-hero-scene-wrap"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: '80px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* ===================================================================
            HERO UPPER: Two Column Layout
            Left Side: ProfessorVirus Brand, Slogan, Desc, Buttons, Stats
            Right Side: Genuine Gold-Framed PRMA Tech Internship Certificate
            =================================================================== */}
        <div
          className="pv-hero-upper-inner"
          style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            padding: '1.25rem 2rem 0.5rem',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2.5rem'
          }}
        >
          {/* LEFT SIDE — Typography, Buttons & Verified Stats */}
          <div
            className="pv-hero-upper-text-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              maxWidth: '620px',
              width: '100%',
              flex: '1'
            }}
          >
            {/* Trust badge */}
            <div
              className="pv-hero-trust-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid #F1E5D1',
                borderRadius: '999px',
                padding: '0.35rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1rem',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.08)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <GraduationCap size={16} color="#881337" />
              <span>Trusted by 50,000+ Engineering Students</span>
              <span style={{ color: '#F59E0B', fontSize: '0.9rem' }}>⭐</span>
            </div>

            {/* Main Brand Title: ProfessorVirus (Solid Deep Burgundy) */}
            <h1
              className="pv-hero-main-title"
              style={{
                fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                fontSize: 'clamp(2.5rem, 4.4vw, 3.85rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.03em',
                color: '#881337',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
              }}
            >
              <span>ProfessorVirus</span>
            </h1>

            {/* Slogan with Golden Brush Curve: Study Smart. Prepare Better. */}
            <div className="pv-hero-slogan-wrap" style={{ position: 'relative', display: 'inline-block', marginBottom: '1.15rem' }}>
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
              className="pv-hero-desc"
              style={{
                fontSize: 'clamp(0.92rem, 1.35vw, 1.02rem)',
                fontWeight: 500,
                lineHeight: 1.55,
                color: '#334155',
                margin: '0 0 1.5rem 0',
                maxWidth: '520px'
              }}
            >
              A complete academic and career preparation platform for AKTU students with notes, PYQs, syllabi, quizzes, resume tools and real industry opportunities.
            </p>

            {/* Action Buttons: Get Started Free & Watch Demo */}
            <div
              className="pv-hero-btn-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '1.65rem'
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
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  backgroundColor: '#881337',
                  color: '#FFFFFF',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(136, 19, 55, 0.3)'
                }}
                className="pv-btn-burgundy"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(136, 19, 55, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(136, 19, 55, 0.3)';
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
              className="pv-hero-stats-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.65rem, 1.2vw, 1rem)',
                flexWrap: 'wrap'
              }}
            >
              {/* Stat 1: Students */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#FFFFFF',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    50K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B' }}>
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
                  backgroundColor: '#FFFFFF',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    1M+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B' }}>
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
                  backgroundColor: '#FFFFFF',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    10K+
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B' }}>
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
                  backgroundColor: '#FFFFFF',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.96rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    4.9/5
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B' }}>
                    Student Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — AUTHENTIC GOLD-FRAMED PRMA TECH INTERNSHIP CERTIFICATE */}
          <div
            className="pv-hero-cert-container"
            style={{
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              maxWidth: '560px',
              width: '100%'
            }}
          >
            {/* Glowing Golden Aura Backlight */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                background: 'radial-gradient(circle at 50% 45%, rgba(255, 215, 0, 0.22) 0%, rgba(212, 175, 55, 0.1) 40%, transparent 70%)',
                filter: 'blur(30px)',
                zIndex: 0,
                pointerEvents: 'none'
              }}
            />

            {/* Certificate 3D Animated Card Frame */}
            <div
              className="pv-hero-cert-wrapper"
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '510px'
              }}
            >
              <a
                href="/prma-tech/verify"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('prma-verify-offer');
                  }
                }}
                className="pv-hero-cert-card"
                title="Verify PRMA Tech Official Internship Certificate"
                style={{
                  display: 'block',
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                {/* The Genuine Cropped Certificate Image (WebP + Fallback PNG) */}
                <picture>
                  <source srcSet="/assets/prma_internship_certificate.webp" type="image/webp" />
                  <img
                    src="/assets/prma_internship_certificate.png"
                    alt="PRMA Tech Official Internship Certificate with MSME Registration and Govt Approval"
                    className="pv-hero-cert-img"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      userSelect: 'none'
                    }}
                  />
                </picture>

                {/* Shimmer Light Sweep Overlay */}
                <div className="pv-cert-shimmer-sweep" />
              </a>

              {/* Realistic Floor Reflection Gradient */}
              <div
                className="pv-hero-cert-reflection"
                style={{
                  position: 'absolute',
                  bottom: '-32px',
                  left: '8%',
                  right: '8%',
                  height: '32px',
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.3) 0%, rgba(15, 23, 42, 0.08) 45%, transparent 75%)',
                  filter: 'blur(7px)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. MSME + WHATSAPP COMMUNITY SECTION (One Single Horizontal Row on Desktop)
            Layout:
            [ Section 1: MSME Registered + PRMA Tech Internship + Apply Now ]
            | [ Section 2: Join ProfessorVirus Community ]
            | [ Section 3: Join PRMA Tech Community ]
            =================================================================== */}
        <div
          className="pv-hero-unified-wrapper"
          style={{
            position: 'relative',
            zIndex: 4,
            width: '100%',
            margin: '1.5rem auto 0.85rem',
            padding: '0 2rem',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="pv-hero-unified-bar"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #F1E5D1',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(212, 175, 55, 0.06)',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              boxSizing: 'border-box'
            }}
          >
            {/* SECTION 1 — MSME + PRMA TECH INTERNSHIP + APPLY NOW */}
            <div
              className="pv-unified-seg-msme-complete"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.1rem',
                flex: '1.6',
                minWidth: 0
              }}
            >
              {/* MSME Emblem & Badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <img
                    src="/assets/msme_lion_crop.png"
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
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.15,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    MSME Registered
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#64748B',
                      marginTop: '0.12rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Udyam Approved Enterprise
                  </div>
                </div>
              </div>

              {/* Sub-divider */}
              <div
                style={{
                  width: '1px',
                  height: '36px',
                  backgroundColor: '#E2E8F0',
                  flexShrink: 0
                }}
                className="hidden xl:block"
              />

              {/* Description & Apply Now */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  flex: 1,
                  minWidth: 0
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.82rem',
                      lineHeight: 1.38,
                      color: '#334155',
                      fontWeight: 600
                    }}
                  >
                    Kickstart your career with a{' '}
                    <strong style={{ color: '#0F172A', fontWeight: 800 }}>real industry internship</strong> at{' '}
                    <strong style={{ color: '#881337', fontWeight: 800 }}>PRMA Tech, an MSME Udyam Approved Enterprise</strong>.
                  </p>
                </div>

                <a
                  href="/prma-tech/internships/apply"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('prma-internships-apply');
                    else window.location.href = '/prma-tech/internships/apply';
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.52rem 1.25rem',
                    borderRadius: '999px',
                    backgroundColor: '#881337',
                    color: '#FFFFFF',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px rgba(136, 19, 55, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    flexShrink: 0
                  }}
                  className="pv-btn-burgundy"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(136, 19, 55, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(136, 19, 55, 0.3)';
                  }}
                >
                  <span>Apply Now</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </a>
              </div>
            </div>

            {/* VERTICAL DIVIDER 1 */}
            <div className="pv-unified-divider" />

            {/* SECTION 2 — PROFESSORVIRUS COMMUNITY */}
            <a
              href="https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G"
              target="_blank"
              rel="noopener noreferrer"
              className="pv-unified-seg-community pv-community-pv"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '14px',
                textDecoration: 'none',
                flex: '1',
                minWidth: '220px',
                transition: 'all 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0FDF4';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* WhatsApp Green Icon Badge */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)'
                }}
              >
                <WhatsAppIcon size={20} color="#FFFFFF" />
              </div>

              {/* Title & Subtitle */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span>Join <strong style={{ color: '#881337' }}>ProfessorVirus</strong> Community</span>
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#64748B',
                    marginTop: '0.12rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Follow the AKTU Material free – By ProfessorVirus 🥇
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: '#881337', display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: '0.25rem' }}>
                <ArrowRight size={16} strokeWidth={2.4} />
              </div>
            </a>

            {/* VERTICAL DIVIDER 2 */}
            <div className="pv-unified-divider" />

            {/* SECTION 3 — PRMA TECH COMMUNITY */}
            <a
              href="https://chat.whatsapp.com/B8zkpc5tc2TKni9jcWsiba"
              target="_blank"
              rel="noopener noreferrer"
              className="pv-unified-seg-community pv-community-prma"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '14px',
                textDecoration: 'none',
                flex: '1',
                minWidth: '220px',
                transition: 'all 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* WhatsApp Green Icon Badge */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)'
                }}
              >
                <WhatsAppIcon size={20} color="#FFFFFF" />
              </div>

              {/* Title & Subtitle */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span>Join <strong style={{ color: '#0284C7' }}>PRMA Tech</strong> Community</span>
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#64748B',
                    marginTop: '0.12rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Learn &bull; Build &bull; Innovate &bull; Grow
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: '#0284C7', display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: '0.25rem' }}>
                <ArrowRight size={16} strokeWidth={2.4} />
              </div>
            </a>
          </div>
        </div>

        {/* ===================================================================
            5. BOTTOM FEATURE BAR (Maroon & Gold Theme)
            Preserves exact authentic statistics and categories:
            - 24+ University Programmes
            - 25,000+ Study Notes
            - 8 Years PYQs (2017-2026)
            - Free Academic Tools
            - AI-Powered Interview Prep
            =================================================================== */}
        <div
          className="pv-hero-trust-stripe-wrap"
          style={{
            position: 'relative',
            zIndex: 4,
            width: '100%',
            margin: '0 auto 1.5rem',
            padding: '0 2rem',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="pv-hero-trust-stripe"
            style={{
              background: 'linear-gradient(90deg, #70102B 0%, #881337 50%, #70102B 100%)',
              borderRadius: '999px',
              padding: '0.68rem 1.6rem',
              border: '1px solid rgba(255, 184, 0, 0.35)',
              boxShadow: '0 8px 24px rgba(112, 16, 43, 0.32), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              gap: '1rem',
              boxSizing: 'border-box',
              color: '#FFFFFF'
            }}
          >
            {/* Item 1 */}
            <div
              className="pv-trust-item"
              onClick={() => onNavigate && onNavigate('notes')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }}
            >
              <Layers size={19} color="#FFBD12" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.86rem', color: '#FFFFFF' }}>
                  24+ University
                </span>
                <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '0.3rem' }}>
                  Programmes
                </span>
              </div>
            </div>

            <div className="pv-trust-divider" />

            {/* Item 2 */}
            <div
              className="pv-trust-item"
              onClick={() => onNavigate && onNavigate('notes')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }}
            >
              <BookOpen size={19} color="#FFBD12" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.86rem', color: '#FFFFFF' }}>
                  25,000+
                </span>
                <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '0.3rem' }}>
                  Study Notes
                </span>
              </div>
            </div>

            <div className="pv-trust-divider" />

            {/* Item 3 */}
            <div
              className="pv-trust-item"
              onClick={() => onNavigate && onNavigate('pyqs')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }}
            >
              <FileText size={19} color="#FFBD12" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.86rem', color: '#FFFFFF' }}>
                  8 Years
                </span>
                <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '0.3rem' }}>
                  PYQs (2017–2026)
                </span>
              </div>
            </div>

            <div className="pv-trust-divider" />

            {/* Item 4 */}
            <div
              className="pv-trust-item"
              onClick={() => onNavigate && onNavigate('tools')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }}
            >
              <Wrench size={19} color="#FFBD12" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.86rem', color: '#FFFFFF' }}>
                  Free
                </span>
                <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '0.3rem' }}>
                  Academic Tools
                </span>
              </div>
            </div>

            <div className="pv-trust-divider" />

            {/* Item 5 */}
            <div
              className="pv-trust-item"
              onClick={() => onNavigate && onNavigate('interview-pro')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }}
            >
              <Bot size={19} color="#FFBD12" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.86rem', color: '#FFFFFF' }}>
                  AI-Powered
                </span>
                <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '0.3rem' }}>
                  Interview Prep
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          DEMO VIDEO MODAL
          =================================================================== */}
      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* ===================================================================
          DYNAMIC CSS KEYFRAMES & RESPONSIVE STYLES
          =================================================================== */}
      <style>{`
        .pv-hero-original-container {
          min-height: 700px;
        }

        /* Certificate Animation Pipeline */
        .pv-hero-cert-wrapper {
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        .pv-hero-cert-card {
          box-shadow: 
            0 24px 48px -12px rgba(15, 23, 42, 0.18),
            0 12px 24px -8px rgba(180, 130, 20, 0.16),
            0 0 0 1px rgba(212, 175, 55, 0.25);
          animation: certEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                     certFloat 6s ease-in-out infinite 0.85s;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pv-hero-cert-card:hover {
          transform: translateY(-5px) scale(1.025);
          box-shadow: 
            0 32px 64px -16px rgba(15, 23, 42, 0.25),
            0 18px 32px -10px rgba(180, 130, 20, 0.25),
            0 0 0 1.5px rgba(212, 175, 55, 0.45);
        }

        /* Shimmer sweep across gold frame */
        .pv-cert-shimmer-sweep {
          position: absolute;
          top: -50%;
          left: -120%;
          width: 60%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 215, 0, 0.25) 50%,
            rgba(255, 255, 255, 0.15) 60%,
            transparent 100%
          );
          transform: rotate(30deg);
          pointer-events: none;
          animation: certShimmer 7.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .pv-unified-divider {
          width: 1px;
          height: 38px;
          background-color: #E2E8F0;
          flex-shrink: 0;
        }

        .pv-trust-divider {
          width: 1px;
          height: 24px;
          background-color: rgba(255, 255, 255, 0.22);
          flex-shrink: 0;
        }

        /* Keyframe Animations */
        @keyframes certEntrance {
          0% {
            opacity: 0;
            transform: translateX(45px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes certFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes certShimmer {
          0%, 70% {
            left: -120%;
          }
          100% {
            left: 220%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pv-hero-cert-card {
            animation: none !important;
            transition: none !important;
          }
          .pv-cert-shimmer-sweep {
            display: none !important;
          }
        }

        /* ------------------ RESPONSIVE BREAKPOINTS ------------------ */
        @media (max-width: 1200px) {
          .pv-hero-upper-inner {
            padding: 1rem 1.5rem 0.5rem !important;
            gap: 1.5rem !important;
          }
          .pv-hero-upper-text-col {
            max-width: 480px !important;
          }
          .pv-hero-main-title {
            font-size: 2.3rem !important;
          }
          .pv-hero-slogan-wrap h2 {
            font-size: 1.5rem !important;
          }
          .pv-hero-desc {
            font-size: 0.88rem !important;
            margin-bottom: 1.25rem !important;
          }
          .pv-hero-unified-wrapper,
          .pv-hero-trust-stripe-wrap {
            padding: 0 1.25rem !important;
          }
          .pv-hero-unified-bar {
            padding: 0.65rem 0.95rem !important;
            gap: 0.65rem !important;
          }
          .pv-unified-seg-community {
            min-width: 180px !important;
          }
        }

        @media (max-width: 1024px) {
          .pv-hero-upper-inner {
            flex-direction: column !important;
            align-items: center !important;
            text-align: left;
            gap: 2rem !important;
          }
          .pv-hero-upper-text-col {
            max-width: 100% !important;
            align-items: flex-start !important;
          }
          .pv-hero-cert-container {
            max-width: 480px !important;
          }
          .pv-hero-unified-bar {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.85rem !important;
            border-radius: 16px !important;
            padding: 1rem !important;
          }
          .pv-unified-seg-msme-complete {
            grid-column: span 2 !important;
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 0.75rem;
          }
          .pv-unified-divider {
            display: none !important;
          }
          .pv-hero-trust-stripe {
            flex-wrap: wrap !important;
            border-radius: 20px !important;
            padding: 0.75rem 1rem !important;
            justify-content: center !important;
            gap: 0.75rem 1.25rem !important;
          }
          .pv-trust-divider {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .pv-hero-scene-wrap {
            padding-top: 65px !important;
          }
          .pv-hero-upper-inner {
            padding: 0.75rem 1rem !important;
          }
          .pv-hero-main-title {
            font-size: 1.95rem !important;
          }
          .pv-hero-slogan-wrap h2 {
            font-size: 1.25rem !important;
          }
          .pv-hero-desc {
            font-size: 0.84rem !important;
            line-height: 1.45 !important;
          }
          .pv-hero-stats-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            width: 100% !important;
          }
          .pv-hero-unified-wrapper,
          .pv-hero-trust-stripe-wrap {
            padding: 0 0.85rem !important;
          }
          .pv-hero-unified-bar {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .pv-unified-seg-msme-complete {
            grid-column: span 1 !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          .pv-unified-seg-msme-complete > div:last-child {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .pv-trust-item {
            width: 45% !important;
          }
        }
      `}</style>
    </section>
  );
}
