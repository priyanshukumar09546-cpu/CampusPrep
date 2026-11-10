import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Eye,
  Rocket,
  Users,
  ShieldCheck,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';

export default function PrmaAboutPage({ navigateToTab }) {
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
      <PrmaNavbar activePage="about" navigateToTab={navigateToTab} />

      {/* =========================================================================
          HERO SECTION (Match Image 4)
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
            gridTemplateColumns: '1.15fr 1fr',
            gap: '3.5rem',
            alignItems: 'center'
          }}
          className="prma-about-hero-grid"
        >
          {/* Left Column */}
          <div>
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
                marginBottom: '1.25rem'
              }}
            >
              <Sparkles size={16} />
              About PRMA Tech™
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
              Building <br />
              <span style={{ color: '#0866F5' }}>Real-World Tech</span> <br />
              Opportunities for Students
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
              PRMA Tech is a student-focused technology company that builds innovative digital products, provides industry-ready services, and creates real-world internship opportunities to help students learn, build and grow in their tech career.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => handleNav('prma-projects')}
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
                <span>Our Projects</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => handleNav('prma-internships-apply')}
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
                Join Internship
              </button>
            </div>
          </div>

          {/* Right Column: Office Building Visual (Match Image 4) */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                borderRadius: '26px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
                border: '4px solid #FFFFFF',
                width: '100%',
                maxWidth: '520px'
              }}
            >
              <img
                src="/assets/prma_gen/prma_office_building.jpg"
                alt="PRMA Tech Corporate Office Headquarters"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = '/assets/prma_building_merch_scene.png';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: STATS STRIP (Match Image 4)
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
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.5rem'
          }}
          className="prma-about-stats-grid"
        >
          {[
            { val: '5,000+', label: 'Students Trained', color: '#0866F5' },
            { val: '50+', label: 'Projects Built', color: '#7025E8' },
            { val: '12+', label: 'Tech Services', color: '#0866F5' },
            { val: '8+', label: 'Domains', color: '#7025E8' },
            { val: '100%', label: 'Student Focused', color: '#F59E0B' }
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                {stat.val}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '0.25rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: OUR STORY (Left Image + Right Story Match Image 4)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: '3.5rem',
            alignItems: 'center'
          }}
          className="prma-story-grid"
        >
          {/* Left: Office Interior Image */}
          <div
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
              border: '2px solid #E2E8F0'
            }}
          >
            <img
              src="/assets/prma_gen/prma_office_interior.jpg"
              alt="PRMA Tech Modern Office Interior and Reception"
              style={{
                width: '100%',
                height: '380px',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = '/assets/prma_portal_ref/WhatsApp Image 2026-11-10 at 10.37.45 AM.jpeg';
              }}
            />
          </div>

          {/* Right: Our Story Narrative */}
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '1rem' }}>
              Our Story
            </h2>

            <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
              PRMA Tech was founded with a simple vision — to bridge the gap between academic learning and industry requirements by providing hands-on experience, practical projects and real exposure to modern technologies.
            </p>

            {/* 3 Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1.15rem', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0866F5', marginBottom: '0.35rem' }}>
                  <Calendar size={18} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Founded In</span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>2026</div>
              </div>

              <div style={{ padding: '1.15rem', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7025E8', marginBottom: '0.35rem' }}>
                  <MapPin size={18} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Based In</span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>India</div>
              </div>

              <div style={{ padding: '1.15rem', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0866F5', marginBottom: '0.35rem' }}>
                  <Building2 size={18} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Company Type</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>EdTech & IT Services</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: MISSION & VISION CARDS (Match Image 4)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="prma-mission-vision-grid">
          {/* Mission Card */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '24px',
              border: '1.5px solid #BFDBFE',
              padding: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0866F5' }}>
                Our Mission
              </h3>
            </div>
            <p style={{ fontSize: '1.05rem', color: '#1E3A8A', lineHeight: 1.65 }}>
              To empower students with real-world skills, mentorship and opportunities through innovative technology solutions.
            </p>
          </div>

          {/* Vision Card */}
          <div
            style={{
              backgroundColor: '#F5F3FF',
              borderRadius: '24px',
              border: '1.5px solid #DDD6FE',
              padding: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#7025E8',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Eye size={24} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#7025E8' }}>
                Our Vision
              </h3>
            </div>
            <p style={{ fontSize: '1.05rem', color: '#4C1D95', lineHeight: 1.65 }}>
              To become a leading student-centric technology company that builds impactful products, creates career opportunities and drives innovation for a better future.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: OUR CORE VALUES (5 Cards Match Image 4)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          padding: '5rem 1.5rem'
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
              Our <span style={{ color: '#0866F5' }}>Core Values</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B' }}>
              The non-negotiable principles guiding every line of code we write and every student we mentor.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1.25rem'
            }}
            className="prma-values-grid"
          >
            {[
              {
                icon: Rocket,
                color: '#7025E8',
                title: 'Innovation',
                desc: 'Build, experiment and create impact.'
              },
              {
                icon: Users,
                color: '#0866F5',
                title: 'Student First',
                desc: 'Every decision keeps students in mind.'
              },
              {
                icon: ShieldCheck,
                color: '#0866F5',
                title: 'Integrity',
                desc: 'Work with honesty and transparency.'
              },
              {
                icon: TrendingUp,
                color: '#10B981',
                title: 'Growth',
                desc: 'Learn, improve and scale together.'
              },
              {
                icon: Award,
                color: '#F59E0B',
                title: 'Impact',
                desc: 'Create real value for students and society.'
              }
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1.5px solid #E2E8F0',
                    padding: '1.75rem 1.25rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: v.color,
                      margin: '0 auto 1.25rem'
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
                    {v.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: BOTTOM RIBBON (Match Image 4 Bottom)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 60%, #EA4335 100%)',
            borderRadius: '24px',
            padding: '2rem 3rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 16px 40px rgba(8, 102, 245, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src="/assets/prma_portal_ref/prma_tech_logo.jpg"
              alt="PRMA Tech"
              style={{ height: '36px', objectFit: 'contain', filter: 'brightness(1.2)' }}
              onError={(e) => {
                e.target.src = '/assets/prma_tech_logo.png';
              }}
            />
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.2rem' }}>
                Be a Part of Our Journey
              </div>
              <div style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                Let's build, learn and grow together.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNav('prma-careers')}
            style={{
              padding: '0.85rem 1.85rem',
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
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
            }}
          >
            <span>Join Our Team</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      <PrmaFooter navigateToTab={navigateToTab} />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .prma-about-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .prma-about-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .prma-story-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-mission-vision-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-values-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-about-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-values-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
