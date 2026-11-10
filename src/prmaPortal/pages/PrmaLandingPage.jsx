import React from 'react';
import {
  ArrowRight,
  Package,
  Code,
  Users,
  Award,
  FileCheck2,
  Briefcase,
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  Globe,
  Star,
  Shield,
  HelpCircle
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';

export default function PrmaLandingPage({ onNavigate }) {
  const handleNav = (route) => {
    if (onNavigate) {
      onNavigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      id: 'welcome-kit',
      title: 'Physical Welcome Kit',
      desc: 'T-shirt, ID card, notebook, stationery and more for every intern.',
      icon: Package,
      color: '#0866F5'
    },
    {
      id: 'real-projects',
      title: 'Real-World Projects',
      desc: 'Work on practical and live industry-relevant production projects.',
      icon: Code,
      color: '#EA3323'
    },
    {
      id: 'mentorship',
      title: 'Industry Mentorship',
      desc: 'Weekly mentor sessions, code reviews and expert architectural guidance.',
      icon: Users,
      color: '#7025E8'
    },
    {
      id: 'stipend',
      title: 'Performance Stipend',
      desc: 'Top 20% performers will receive a performance stipend (₹1,000 - ₹10,000).',
      icon: Trophy,
      color: '#FFBD12'
    },
    {
      id: 'certificate',
      title: 'Verified Certificate',
      desc: 'Get a verifiable internship completion certificate with unique QR code.',
      icon: Award,
      color: '#079B45'
    },
    {
      id: 'lor',
      title: 'Letter of Recommendation',
      desc: 'Outstanding performers will receive an authentic LOR from PRMA Tech.',
      icon: FileCheck2,
      color: '#0866F5'
    },
    {
      id: 'career-support',
      title: 'Career Support',
      desc: 'Resume review, LinkedIn profile optimization and mock technical interviews.',
      icon: Briefcase,
      color: '#7025E8'
    },
    {
      id: 'awards',
      title: 'PRMA Tech Awards',
      desc: 'Best Intern, Top Performer and Special Engineering Recognition.',
      icon: Star,
      color: '#EA3323'
    }
  ];

  const processSteps = [
    { num: '01', title: 'Apply Online', desc: 'Select domain, choose batch & duration, submit your application.' },
    { num: '02', title: 'Shortlisting & Selection', desc: 'Immediate application verification and seat allocation.' },
    { num: '03', title: 'Onboarding & Kit Delivery', desc: 'Welcome email, portal credentials & physical kit dispatched.' },
    { num: '04', title: 'Work on Projects', desc: 'Sprint-based engineering tasks with 1-on-1 mentor guidance.' },
    { num: '05', title: 'Evaluation & Rewards', desc: 'Code reviews, project evaluation & stipend disbursement.' },
    { num: '06', title: 'Get Certificate', desc: 'Globally verifiable credentials, LOR & career recommendation.' }
  ];

  const welcomeKitItems = [
    { name: 'PRMA Tech T-Shirt', desc: 'Premium Combed Cotton, Branded' },
    { name: 'Intern ID Card', desc: 'Personalized Card & Satin Lanyard' },
    { name: 'Notebook', desc: 'A5 Premium Hardcover Journal' },
    { name: 'Engraved Pen', desc: 'Smooth Ink Writing Pen' },
    { name: 'Water Bottle', desc: '750 ml Stainless Steel Flask' },
    { name: 'Tech Stickers', desc: '5-8 Waterproof Laptop Decals' },
    { name: 'Welcome Gift Box', desc: 'Special Luxury Packaging' }
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <PrmaNavbar activePage="landing" onNavigate={onNavigate} />

      {/* =========================================================================
          HERO SECTION (Matching Reference Screenshot WhatsApp Image 10.37.44 AM)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) 1rem 3rem',
          background: 'radial-gradient(ellipse at 85% 20%, rgba(112, 37, 232, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 15% 80%, rgba(8, 102, 245, 0.06) 0%, transparent 60%)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center'
          }}
        >
          {/* Left Hero Content */}
          <div>
            {/* Pill Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(8, 102, 245, 0.1)',
                border: '1px solid rgba(8, 102, 245, 0.25)',
                color: '#0866F5',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              <Sparkles size={14} />
              <span>PRMA Tech Internship Program</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2.2rem, 3.8vw, 3.5rem)',
                fontWeight: 900,
                color: '#101C50',
                lineHeight: 1.15,
                margin: '0 0 1.25rem 0',
                letterSpacing: '-0.02em'
              }}
            >
              Industry-Ready{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 50%, #EA3323 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                Remote Internship
              </span>{' '}
              at PRMA Tech
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                color: '#475569',
                lineHeight: 1.65,
                margin: '0 0 2rem 0',
                maxWidth: '580px'
              }}
            >
              Work on real-world projects, get expert mentorship, build your portfolio, and kickstart
              your tech career with a recognised internship from PRMA Tech.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '2.5rem' }}>
              <button
                type="button"
                onClick={() => handleNav('prma-internships-apply')}
                style={{
                  padding: '0.9rem 2rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  boxShadow: '0 8px 24px rgba(8, 102, 245, 0.35)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(8, 102, 245, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(8, 102, 245, 0.35)';
                }}
              >
                <span>Apply Now</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('benefits-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '0.9rem 1.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  color: '#101C50',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0866F5';
                  e.currentTarget.style.color = '#0866F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.color = '#101C50';
                }}
              >
                <span>View Details</span>
              </button>
            </div>

            {/* Quick Trust Highlights */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} color="#079B45" />
                <span>100% Online & Flexible</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} color="#079B45" />
                <span>Physical Goodies Kit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} color="#079B45" />
                <span>Top 20% Performance Stipend</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual with Floating Welcome Kit Badge */}
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div
              style={{
                borderRadius: '26px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 16px 48px rgba(16, 28, 80, 0.1)',
                position: 'relative'
              }}
            >
              <img
                src="/assets/prma_portal_hero_bundle.png"
                alt="PRMA Tech Official Welcome Kit (T-Shirt, Bottle, Notebook, ID Card, Stickers, Welcome Box)"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/prma_merchandise_kit.png';
                }}
              />

              {/* Floating Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#079B45',
                  color: '#FFFFFF',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(7, 155, 69, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Package size={13} />
                <span>Physical Welcome Kit for Every Intern</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERNSHIP BENEFITS SECTION (8 Grid Cards matching reference)
          ========================================================================= */}
      <section
        id="benefits-section"
        style={{
          padding: '4rem 1rem',
          maxWidth: '1360px',
          margin: '0 auto'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#7025E8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.4rem'
            }}
          >
            Why Join PRMA Tech?
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)',
              fontWeight: 900,
              color: '#101C50',
              margin: '0 0 0.5rem 0'
            }}
          >
            Internship Benefits
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            Everything you receive as part of your comprehensive internship experience.
          </p>
        </div>

        {/* 8 Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {benefits.map((b) => {
            const BIcon = b.icon;
            return (
              <div
                key={b.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.6rem 1.35rem',
                  boxShadow: '0 4px 16px rgba(16, 28, 80, 0.04)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = b.color;
                  e.currentTarget.style.boxShadow = `0 12px 28px ${b.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 28, 80, 0.04)';
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: `${b.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: b.color,
                    marginBottom: '1rem'
                  }}
                >
                  <BIcon size={22} strokeWidth={2.2} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#101C50',
                    margin: '0 0 0.45rem 0'
                  }}
                >
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          OPERATING MODEL & WELCOME KIT SECTION
          ========================================================================= */}
      <section
        style={{
          padding: '3.5rem 1rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}
        >
          {/* Left: Your Internship Welcome Kit */}
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#0866F5',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.4rem'
              }}
            >
              Tangible Goodies
            </div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                fontWeight: 900,
                color: '#101C50',
                margin: '0 0 1rem 0'
              }}
            >
              Your Internship Welcome Kit
            </h2>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Delivered straight to your doorstep before your internship begins. Wear your intern
              identity with pride.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {welcomeKitItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem'
                  }}
                >
                  <CheckCircle2 size={16} color="#079B45" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#101C50' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleNav('prma-internships-goodies')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: '1.5px solid #0866F5',
                backgroundColor: '#EFF6FF',
                color: '#0866F5',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <span>Customize Your Goodies Kit</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Right: Operating Model Card */}
          <div
            style={{
              backgroundColor: '#0A0F24',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              boxShadow: '0 12px 36px rgba(16, 28, 80, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.35rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                Operating Model
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: '#079B45', color: '#FFFFFF' }}>
                Finalized
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Mode', value: 'Remote Only (100% Online from anywhere)' },
                { label: 'Duration', value: '2 Weeks to 36 Weeks (Flexible duration tiers)' },
                { label: 'Eligibility', value: 'College Students (B.Tech, BCA, MCA, Diploma & Graduates)' },
                { label: 'Domains', value: '27 In-Demand Engineering & Tech Domains' },
                { label: 'Evaluation', value: 'Live Projects + Weekly Sprint Tasks + Code Reviews' },
                { label: 'Stipend', value: 'Top 20% Performers Receive ₹1,000 to ₹10,000' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    gap: '1rem',
                    fontSize: '0.88rem'
                  }}
                >
                  <span style={{ color: '#94A3B8', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 700, textAlign: 'right' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleNav('prma-internships-domains')}
              style={{
                width: '100%',
                marginTop: '1.75rem',
                padding: '0.85rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>Choose Your Domain & Apply</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERNSHIP PROCESS (6-Step Pipeline)
          ========================================================================= */}
      <section
        style={{
          padding: '4rem 1rem',
          maxWidth: '1360px',
          margin: '0 auto'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#079B45',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.4rem'
            }}
          >
            How It Works
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)',
              fontWeight: 900,
              color: '#101C50',
              margin: '0 0 0.5rem 0'
            }}
          >
            Internship Process
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            A transparent, professional path from application to verifiable credentials.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {processSteps.map((st, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #E2E8F0',
                padding: '1.5rem 1.25rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: '#0866F5',
                  opacity: 0.85,
                  marginBottom: '0.75rem'
                }}
              >
                {st.num}
              </div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.05rem', fontWeight: 800, color: '#101C50', margin: '0 0 0.35rem 0' }}>
                {st.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION BANNER (Matching Reference Screenshot)
          ========================================================================= */}
      <section
        style={{
          padding: '2rem 1rem 4rem',
          maxWidth: '1360px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #101C50 0%, #0A0F24 100%)',
            color: '#FFFFFF',
            borderRadius: '26px',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 16px 48px rgba(16, 28, 80, 0.2)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFBD12', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Finalized Internship Model
            </div>
            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.75rem, 2.8vw, 2.4rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: '0 0 0.85rem 0'
              }}
            >
              Learn • Build • Get Mentored • Earn Rewards
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.92rem', color: '#CBD5E1' }}>
              <div>✓ Physical Welcome Kit for Every Intern</div>
              <div>✓ Performance Stipend for Top 20% Performers</div>
              <div>✓ 100% Online & Remote (Self-Paced Execution)</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNav('prma-internships-apply')}
            style={{
              padding: '1rem 2.25rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: '0 8px 28px rgba(8, 102, 245, 0.4)'
            }}
          >
            <span>Apply for Internship Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <PrmaFooter onNavigate={onNavigate} />
    </div>
  );
}