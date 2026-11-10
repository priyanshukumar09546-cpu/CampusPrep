import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Gift,
  Code2,
  Users,
  Award,
  FileCheck2,
  FileText,
  TrendingUp,
  Trophy,
  CheckCircle2,
  Calendar,
  Clock,
  GraduationCap,
  Briefcase,
  Zap,
  Globe,
  Monitor,
  ShieldCheck,
  Package,
  BookOpen
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaStepProgress from '../components/PrmaStepProgress';

export default function PrmaLandingPage({ navigateToTab }) {
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
      <PrmaNavbar activePage="internships" navigateToTab={navigateToTab} />
      <PrmaStepProgress currentStep={1} onNavigate={navigateToTab} />

      {/* =========================================================================
          HERO SECTION (Match Image 2)
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          padding: '3.5rem 1.5rem 4rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '3rem',
            alignItems: 'center'
          }}
          className="prma-internships-hero-grid"
        >
          {/* Left Column */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#0866F5',
                borderRadius: '999px',
                padding: '0.4rem 1.15rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.25rem'
              }}
            >
              <GraduationCap size={16} />
              PRMA Tech Internship Program
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 4.5vw, 3.8rem)',
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem'
              }}
            >
              Industry-Ready <br />
              <span style={{ color: '#0866F5' }}>Remote Internship</span> <br />
              at <span
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

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: '#475569',
                lineHeight: 1.65,
                maxWidth: '560px',
                marginBottom: '2rem'
              }}
            >
              Work on real-world projects, get expert mentorship, build your portfolio, and kickstart your tech career with a recognised internship from PRMA Tech.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <button
                type="button"
                onClick={() => handleNav('prma-internships-apply')}
                style={{
                  padding: '0.95rem 2.2rem',
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
                <span>Apply Now</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('benefits-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
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
                View Details
              </button>
            </div>
          </div>

          {/* Right Column: Complete Welcome Kit Showcase (Match Image 2) */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Top pill badge: Physical Welcome Kit for Every Intern */}
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                right: '10px',
                backgroundColor: '#FFFFFF',
                borderRadius: '999px',
                padding: '0.45rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                border: '1.5px solid #E2E8F0',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0F172A',
                zIndex: 2
              }}
            >
              <Gift size={16} color="#EA4335" />
              <span>Physical Welcome Kit for Every Intern</span>
              <CheckCircle2 size={16} color="#16A34A" />
            </div>

            {/* Welcome kit image */}
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                border: '3px solid #FFFFFF',
                width: '100%',
                maxWidth: '520px'
              }}
            >
              <img
                src="/assets/prma_gen/prma_welcome_kit_hero.jpg"
                alt="Official PRMA Tech Internship Welcome Kit"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = '/assets/prma_portal_ref/WhatsApp Image 2026-11-10 at 10.37.44 AM.jpeg';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: INTERNSHIP BENEFITS (8 Cards Match Image 2)
          ========================================================================= */}
      <section
        id="benefits-section"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '4.5rem 1.5rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#0866F5',
              marginBottom: '0.5rem'
            }}
          >
            <Sparkles size={20} />
            <span>Internship Benefits</span>
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A' }}>
            Everything You Need to Succeed
          </h2>
        </div>

        {/* 8 Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}
          className="prma-benefits-grid"
        >
          {[
            {
              icon: Gift,
              color: '#EA4335',
              bgLight: '#FEF2F2',
              title: 'Physical Welcome Kit',
              desc: 'T-shirt, ID card, notebook, stationery and more for every intern.'
            },
            {
              icon: Code2,
              color: '#0866F5',
              bgLight: '#EFF6FF',
              title: 'Real-World Projects',
              desc: 'Work on practical and live industry-relevant projects.'
            },
            {
              icon: Users,
              color: '#7025E8',
              bgLight: '#F5F3FF',
              title: 'Industry Mentorship',
              desc: 'Weekly mentor sessions, code reviews and guidance.'
            },
            {
              icon: Zap,
              color: '#F59E0B',
              bgLight: '#FFFBEB',
              title: 'Performance Stipend',
              desc: 'Top 20% performers will receive a stipend (₹1,000 - ₹10,000).'
            },
            {
              icon: Award,
              color: '#0866F5',
              bgLight: '#EFF6FF',
              title: 'Verified Certificate',
              desc: 'Get a verifiable internship completion certificate.'
            },
            {
              icon: FileText,
              color: '#F59E0B',
              bgLight: '#FFFBEB',
              title: 'Letter of Recommendation',
              desc: 'Outstanding performers will receive an LOR from PRMA Tech.'
            },
            {
              icon: TrendingUp,
              color: '#079B45',
              bgLight: '#F0FDF4',
              title: 'Career Support',
              desc: 'Resume review, LinkedIn optimization and mock interviews.'
            },
            {
              icon: Trophy,
              color: '#F59E0B',
              bgLight: '#FFFBEB',
              title: 'PRMA Tech Awards',
              desc: 'Best Intern, Top Performer and Special Recognition.'
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
                  boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: card.bgLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                    marginBottom: '1.25rem'
                  }}
                >
                  <Icon size={24} />
                </div>

                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.45rem' }}>
                  {card.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.55 }}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: YOUR INTERNSHIP WELCOME KIT (7 Separate Products Match Image 2)
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
              Your Internship Welcome Kit 📦
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B' }}>
              Every product is crafted with premium materials and delivered directly to your home address.
            </p>
          </div>

          {/* 7 Products Row (Match Image 2) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '1.25rem'
            }}
            className="prma-goodies-showcase-grid"
          >
            {[
              { name: 'PRMA Tech T-Shirt', img: '/assets/prma_goodies/prma_tshirt.png' },
              { name: 'Intern ID Card', img: '/assets/prma_goodies/prma_id_card.png' },
              { name: 'Notebook', img: '/assets/prma_goodies/prma_notebook.png' },
              { name: 'Pen', img: '/assets/prma_gen/prma_pen.jpg' },
              { name: 'Water Bottle', img: '/assets/prma_goodies/prma_bottle.png' },
              { name: 'Stickers', img: '/assets/prma_goodies/prma_stickers.png' },
              { name: 'Welcome Box', img: '/assets/prma_goodies/prma_welcome_box.png' }
            ].map((prod, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.25rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.85rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '0.5rem'
                  }}
                >
                  <img
                    src={prod.img}
                    alt={prod.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.src = '/assets/prma_portal_ref/WhatsApp Image 2026-11-10 at 10.37.44 AM (1).jpeg';
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                  {prod.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: OPERATING MODEL & INTERNSHIP PROCESS (Match Image 2)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '4.5rem 1.5rem' }}>
        {/* Operating Model Box */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E2E8F0',
            padding: '2.5rem',
            boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
            marginBottom: '4rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Zap size={24} color="#0866F5" />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>
                Operating Model
              </h2>
            </div>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px'
              }}
            >
              FINALIZED MODEL
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.75rem'
            }}
            className="prma-operating-grid"
          >
            {[
              { label: 'Mode', val: 'Remote Only (100% Online Flexibility)', icon: Laptop },
              { label: 'Duration', val: '6 – 8 Weeks (Modular Tiers Available)', icon: Clock },
              { label: 'Eligibility', val: 'Engineering & Tech Students (Class 9 - UG / PG)', icon: GraduationCap },
              { label: 'Domains', val: 'Web, App, AI/ML, Data Science, Cyber, Cloud, DevOps...', icon: Code2 },
              { label: 'Evaluation', val: 'Project Work + Weekly Assignments + Mentor Review', icon: TrendingUp },
              { label: 'Stipend', val: 'Top 20% Performers (₹1,000 – ₹10,000 per published policy)', icon: Trophy }
            ].map((op, idx) => {
              const Icon = op.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Icon size={16} color="#0866F5" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      {op.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>
                    {op.val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Internship Process (6 Steps Match Image 2) */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
              Internship Process
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B' }}>
              Clear milestones from application to verified credential.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '1rem'
            }}
            className="prma-process-grid"
          >
            {[
              { num: '1', title: 'Apply Online', desc: 'Fill application form', icon: FileText, color: '#0866F5' },
              { num: '2', title: 'Shortlisting & Selection', desc: 'Cohort allotment', icon: Users, color: '#7025E8' },
              { num: '3', title: 'Onboarding & Kit Delivery', desc: 'Welcome swag sent', icon: Package, color: '#0866F5' },
              { num: '4', title: 'Work on Projects', desc: 'Weekly code reviews', icon: Code2, color: '#7025E8' },
              { num: '5', title: 'Evaluation', desc: 'Performance rubrics', icon: CheckCircle2, color: '#10B981' },
              { num: '6', title: 'Get Certificate & Rewards', desc: 'Verified credential', icon: Trophy, color: '#F59E0B' }
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: p.color,
                      margin: '0 auto 0.85rem'
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {p.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: FINAL CTA BANNER (Match Image 2 Bottom Ribbon)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0A0F24 0%, #172554 100%)',
            borderRadius: '24px',
            padding: '2.5rem 3rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 16px 40px rgba(10, 15, 36, 0.2)'
          }}
        >
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.35rem' }}>
              PRMA Tech Internship Program
            </div>
            <div style={{ fontSize: '0.95rem', color: '#93C5FD', marginBottom: '0.85rem' }}>
              Learn • Build • Get Mentored • Earn Rewards • Grow Your Career
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: '#E2E8F0' }}>
              <span>✓ Physical Welcome Kit for Everyone</span>
              <span>✓ Stipend for Top 20% Performers</span>
              <span>✓ Remote Only (100% Online)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNav('prma-internships-apply')}
            style={{
              padding: '0.95rem 2.2rem',
              borderRadius: '14px',
              backgroundColor: '#0866F5',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 20px rgba(8, 102, 245, 0.4)'
            }}
          >
            <span>Apply for Remote Internship</span>
            <ArrowRight size={17} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      <PrmaFooter navigateToTab={navigateToTab} />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .prma-internships-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .prma-benefits-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-goodies-showcase-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .prma-operating-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-process-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-benefits-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-goodies-showcase-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
