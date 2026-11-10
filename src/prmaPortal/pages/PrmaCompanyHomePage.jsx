import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Code2,
  Award,
  Star,
  Monitor,
  Smartphone,
  Layers,
  Rocket,
  Gift,
  Laptop,
  Check,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { PRMA_SERVICES } from '../data/prmaServices';

export default function PrmaCompanyHomePage({ navigateToTab }) {
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('All');

  const handleNav = (route) => {
    if (navigateToTab) {
      navigateToTab(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A',
        overflowX: 'hidden'
      }}
    >
      <PrmaNavbar activePage="home" navigateToTab={navigateToTab} />

      {/* =========================================================================
          SECTION 1: HERO SECTION (Match Image 1)
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          padding: '4rem 1.5rem 3.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '3rem',
            alignItems: 'center'
          }}
          className="prma-hero-grid"
        >
          {/* Left Hero Column */}
          <div>
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#F3E8FF',
                border: '1px solid #E9D5FF',
                color: '#7025E8',
                borderRadius: '999px',
                padding: '0.4rem 1.15rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.5rem'
              }}
            >
              <Sparkles size={16} />
              Tech • Internship • Projects • Career
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem'
              }}
            >
              Build Your <br />
              Tech Career with <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 60%, #EA4335 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                PRMA Tech™
              </span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.18rem)',
                color: '#475569',
                lineHeight: 1.65,
                maxWidth: '560px',
                marginBottom: '2rem'
              }}
            >
              A technology company that helps students gain real-world experience through industry-ready internships, live projects and expert mentorship.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.5rem'
              }}
            >
              <button
                type="button"
                onClick={() => handleNav('prma-internships-apply')}
                style={{
                  padding: '0.95rem 2rem',
                  borderRadius: '14px',
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 8px 24px rgba(8, 102, 245, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Apply for Internship</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => handleNav('prma-services')}
                style={{
                  padding: '0.95rem 1.85rem',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Explore Services
              </button>
            </div>

            {/* 3 Checkmark Benefits */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #E2E8F0'
              }}
            >
              {[
                'Real Projects',
                'Industry Mentorship',
                'Career Support'
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#0F172A'
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#DCFCE7',
                      color: '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Check size={13} strokeWidth={3} />
                  </div>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Visual with Floating Glass Cards (Match Image 1) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Colorful PRMA Brand Organic Backdrop Shapes */}
            <div
              style={{
                position: 'absolute',
                width: '480px',
                height: '480px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #0866F5 0%, #079B45 40%, #FFBD12 70%, #EA4335 100%)',
                filter: 'blur(60px)',
                opacity: 0.28,
                zIndex: 0
              }}
            />

            {/* Hero Student Portrait */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '480px',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
                border: '4px solid #FFFFFF'
              }}
            >
              <img
                src="/assets/prma_gen/prma_hero_student.jpg"
                alt="Student Tech Intern at PRMA Tech"
                style={{
                  width: '100%',
                  height: '520px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = '/assets/prma_portal_ref/WhatsApp Image 2026-11-10 at 10.37.44 AM.jpeg';
                }}
              />
            </div>

            {/* Floating Glassmorphism Cards (Exact 4 Cards from Image 1) */}
            {/* Card 1: Top Left */}
            <div
              style={{
                position: 'absolute',
                top: '25px',
                left: '-25px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '0.75rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.08)',
                border: '1.5px solid #FFFFFF',
                zIndex: 2
              }}
              className="prma-floating-card-1"
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0866F5'
                }}
              >
                <Monitor size={19} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                Industry-Ready Internships
              </span>
            </div>

            {/* Card 2: Top Right */}
            <div
              style={{
                position: 'absolute',
                top: '90px',
                right: '-30px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '0.75rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.08)',
                border: '1.5px solid #FFFFFF',
                zIndex: 2
              }}
              className="prma-floating-card-2"
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0866F5'
                }}
              >
                <Code2 size={19} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                Real-World Projects
              </span>
            </div>

            {/* Card 3: Bottom Left */}
            <div
              style={{
                position: 'absolute',
                bottom: '100px',
                left: '-35px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '0.75rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.08)',
                border: '1.5px solid #FFFFFF',
                zIndex: 2
              }}
              className="prma-floating-card-3"
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0866F5'
                }}
              >
                <Users size={19} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                Expert Mentorship
              </span>
            </div>

            {/* Card 4: Bottom Right */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '-20px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '0.75rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.08)',
                border: '1.5px solid #FFFFFF',
                zIndex: 2
              }}
              className="prma-floating-card-4"
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706'
                }}
              >
                <Award size={19} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                Verified Certificate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: STATISTICS COUNTER STRIP (Match Image 1)
          ========================================================================= */}
      <section
        style={{
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FAFAFC',
          padding: '2rem 1.5rem'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}
          className="prma-stats-grid"
        >
          {[
            { icon: Users, color: '#0866F5', number: '5,000+', label: 'Students Trained' },
            { icon: Code2, color: '#7025E8', number: '150+', label: 'Real Projects' },
            { icon: Layers, color: '#0866F5', number: '27+', label: 'Internship Domains' },
            { icon: Star, color: '#F59E0B', number: '4.9/5', label: 'Student Satisfaction' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                    flexShrink: 0
                  }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: OUR SERVICES (Match Image 1 & 4 Services Preview)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '4.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
            Our Services
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            End-to-end technology solutions for students, startups and businesses.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}
          className="prma-services-grid"
        >
          {[
            {
              id: 'web-development',
              title: 'Website Development',
              desc: 'Modern, responsive and high-performance websites.',
              icon: Monitor,
              color: '#0866F5',
              bgLight: '#EFF6FF'
            },
            {
              id: 'app-development',
              title: 'App Development',
              desc: 'Android, iOS and cross-platform mobile applications.',
              icon: Smartphone,
              color: '#7025E8',
              bgLight: '#F5F3FF'
            },
            {
              id: 'custom-software',
              title: 'Custom Software',
              desc: 'Tailored software solutions for your business needs.',
              icon: Layers,
              color: '#0866F5',
              bgLight: '#EFF6FF'
            },
            {
              id: 'product-development',
              title: 'Product Development',
              desc: 'From idea to launch, we build scalable digital products.',
              icon: Rocket,
              color: '#EA4335',
              bgLight: '#FEF2F2'
            }
          ].map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => handleNav('prma-services')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)';
                  e.currentTarget.style.borderColor = srv.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '14px',
                      backgroundColor: srv.bgLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: srv.color,
                      marginBottom: '1.25rem'
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.45rem' }}>
                    {srv.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                    {srv.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: srv.bgLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: srv.color
                    }}
                  >
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: INTERNSHIP PROMOTIONAL BANNER (Match Image 1 Dark Banner)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem 4.5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #172554 100%)',
            borderRadius: '28px',
            padding: '3rem',
            color: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '3rem',
            alignItems: 'center',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="prma-banner-grid"
        >
          {/* Left Column of Banner */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '999px',
                padding: '0.35rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#93C5FD',
                marginBottom: '1rem'
              }}
            >
              <GraduationCap size={16} />
              PRMA Tech Internship Program
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: '1rem'
              }}
            >
              A structured, project-based remote internship program to help you gain real industry experience.
            </h2>

            {/* 4 Feature Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
                marginBottom: '2rem'
              }}
            >
              {[
                { icon: Gift, text: 'Physical Welcome Kit (for every intern)' },
                { icon: Laptop, text: 'Remote Only (100% Online)' },
                { icon: Zap, text: 'Performance Stipend (Top 20% Interns)' },
                { icon: Award, text: 'Verified Certificate (On Completion)' }
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#E2E8F0'
                    }}
                  >
                    <Icon size={18} color="#FBBF24" style={{ flexShrink: 0 }} />
                    <span>{feat.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={() => handleNav('prma-internships-apply')}
                style={{
                  padding: '0.9rem 1.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                }}
              >
                <span>Apply for Internship</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => handleNav('prma-internships-home')}
                style={{
                  padding: '0.9rem 1.6rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
            </div>
          </div>

          {/* Right Column of Banner: Complete Welcome Kit Showcase */}
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <img
              src="/assets/prma_gen/prma_welcome_kit_hero.jpg"
              alt="PRMA Tech Official Welcome Kit Bundle"
              style={{
                width: '100%',
                height: '360px',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = '/assets/prma_portal_ref/WhatsApp Image 2026-11-10 at 10.37.44 AM.jpeg';
              }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HOW THE INTERNSHIP WORKS (6 Steps Match Image 1)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '1rem 1.5rem 4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
            How the Internship Works?
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B' }}>
            A smooth, transparent, student-centric six-step journey from application to certified accomplishment.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem',
            position: 'relative'
          }}
          className="prma-process-grid"
        >
          {[
            { step: '1', title: 'Apply Online', icon: BookOpen, color: '#0866F5', desc: 'Select domain, batch & submit details' },
            { step: '2', title: 'Selection & Onboarding', icon: Users, color: '#7025E8', desc: 'Instant credentials & community invite' },
            { step: '3', title: 'Receive Welcome Kit', icon: Gift, color: '#0866F5', desc: 'Doorstep dispatch of branded swag' },
            { step: '4', title: 'Work on Real Projects', icon: Code2, color: '#7025E8', desc: '1:1 mentorship & weekly code reviews' },
            { step: '5', title: 'Performance Evaluation', icon: TrendingUp, color: '#10B981', desc: 'Milestone rubrics & feedback' },
            { step: '6', title: 'Get Certificate & Stipend', icon: Award, color: '#F59E0B', desc: 'Tamper-proof verifiable credential' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    marginBottom: '1rem'
                  }}
                >
                  <Icon size={22} />
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                  {item.title}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: WHY CHOOSE PRMA TECH? (Match Image 1)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          padding: '4.5rem 1.5rem'
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
              Why Choose PRMA Tech?
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B' }}>
              Designed by software engineers to bridge academia and industry standard engineering.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem'
            }}
            className="prma-why-grid"
          >
            {[
              {
                icon: Zap,
                color: '#F59E0B',
                title: 'Practical Learning',
                desc: 'Work on real industry problems with production architectures.'
              },
              {
                icon: Users,
                color: '#0866F5',
                title: 'Industry Mentors',
                desc: 'Learn directly from experienced senior software engineers.'
              },
              {
                icon: TrendingUp,
                color: '#10B981',
                title: 'Career Growth',
                desc: 'Build a strong and job-ready portfolio that attracts recruiters.'
              },
              {
                icon: ShieldCheck,
                color: '#7025E8',
                title: 'Trusted & Verified',
                desc: 'Transparent, reliable, verifiable credentials, and student-first.'
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1.5px solid #E2E8F0',
                    padding: '1.75rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                      marginBottom: '1rem'
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
                    {card.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.55 }}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CHOOSE YOUR INTERNSHIP DOMAIN (Match Image 1 Bottom Ribbon)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 60%, #EA4335 100%)',
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 12px 36px rgba(8, 102, 245, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Code2 size={26} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.2rem' }}>
                Choose Your Internship Domain
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                Work on real projects in your area of interest across 27 industry tracks.
              </p>
            </div>
          </div>

          {/* Quick Domain Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            {[
              'Web Dev',
              'App Dev',
              'AI/ML',
              'Data Science',
              'Cybersecurity',
              'Cloud & DevOps',
              'Python',
              'UI/UX Design'
            ].map((p, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {p}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleNav('prma-internships-domains')}
            style={{
              padding: '0.85rem 1.75rem',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.95rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Explore All Domains</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      <PrmaFooter navigateToTab={navigateToTab} />

      {/* Responsive Breakpoints */}
      <style>{`
        @media (max-width: 1024px) {
          .prma-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .prma-hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .prma-services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-banner-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-process-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .prma-why-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-services-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-why-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-floating-card-1,
          .prma-floating-card-2,
          .prma-floating-card-3,
          .prma-floating-card-4 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
