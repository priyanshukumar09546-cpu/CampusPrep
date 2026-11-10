import React from 'react';
import {
  ArrowRight,
  MessageCircle,
  Target,
  Users,
  ShieldCheck,
  Zap,
  GraduationCap,
  Briefcase,
  Sparkles,
  Award,
  Package
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function FinalCtaSection({ onNavigate }) {
  const { isDark } = useTheme();

  const WHATSAPP_PV_URL =
    'https://wa.me/917668016628?text=Hi%20ProfessorVirus%20Team%2C%20I%20have%20a%20question%20regarding%20academic%20resources%20and%20tools.';
  const WHATSAPP_PRMA_URL =
    'https://wa.me/917668016628?text=Hi%20PRMA%20Tech%20Team%2C%20I%20am%20interested%20in%20the%20Remote%20Internship%20Program.';

  const handleStudyClick = () => {
    if (onNavigate) {
      onNavigate('more');
    } else {
      window.location.href = '/more';
    }
  };

  const handleInternshipClick = () => {
    if (onNavigate) {
      onNavigate('internships-jobs');
    } else {
      window.location.href = '/internships-jobs';
    }
  };

  const values = [
    {
      id: 'mission',
      title: 'Our Mission',
      desc: 'Make quality academic resources & tech internships accessible to every college student.',
      icon: Target,
      iconColor: '#FFB800',
      iconBg: 'rgba(255, 184, 0, 0.1)',
      border: 'rgba(255, 184, 0, 0.3)'
    },
    {
      id: 'student-first',
      title: 'Student First',
      desc: 'Built by students, for students. Authentic curriculum materials & verified credentials.',
      icon: Users,
      iconColor: '#FF8C00',
      iconBg: 'rgba(255, 140, 0, 0.1)',
      border: 'rgba(255, 140, 0, 0.3)'
    },
    {
      id: 'trusted',
      title: 'Trusted Content',
      desc: 'Verified, updated syllabus, past papers, and genuine industry-led mentorship.',
      icon: ShieldCheck,
      iconColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)'
    },
    {
      id: 'growth',
      title: 'Career Readiness',
      desc: 'Bridging the gap between university grades and practical full-stack tech capabilities.',
      icon: Zap,
      iconColor: '#A855F7',
      iconBg: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.3)'
    }
  ];

  return (
    <section
      className="pv-scroll-reveal"
      style={{
        backgroundColor: 'transparent',
        padding: '3.5rem 0 4rem 0',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E8E2D5'
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
        {/* DUAL SPLIT CTA BANNER */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* LEFT: PROFESSORVIRUS CTA */}
          <div
            style={{
              backgroundColor: isDark ? '#0B0B0B' : '#FFFFFF',
              backgroundImage: isDark
                ? 'radial-gradient(circle at 10% 20%, rgba(255, 184, 0, 0.08) 0%, transparent 50%), linear-gradient(135deg, #0F0F0F 0%, #080808 100%)'
                : 'radial-gradient(circle at 10% 20%, rgba(255, 184, 0, 0.05) 0%, transparent 50%)',
              border: isDark ? '1.5px solid rgba(255, 184, 0, 0.35)' : '1.5px solid #FDE68A',
              borderRadius: '26px',
              padding: 'clamp(1.75rem, 3vw, 2.75rem)',
              boxShadow: isDark
                ? '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 184, 0, 0.06)'
                : '0 8px 30px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 184, 0, 0.12)',
                  border: '1px solid rgba(255, 184, 0, 0.35)',
                  color: isDark ? '#FFB800' : '#B45309',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase'
                }}
              >
                <GraduationCap size={14} />
                <span>Academic Success</span>
              </div>

              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
                  fontWeight: 900,
                  color: isDark ? '#FFFFFF' : '#1F2421',
                  lineHeight: 1.25,
                  margin: '0 0 0.85rem 0'
                }}
              >
                Ready to Study <span style={{ color: '#FFB800' }}>Smarter?</span>
              </h3>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.94rem',
                  color: isDark ? '#A1A1AA' : '#64748B',
                  lineHeight: 1.6,
                  margin: '0 0 1.75rem 0'
                }}
              >
                Access 50,000+ unit-wise notes, previous year question papers, interactive quizzes,
                and the Result & CGPA Analyzer completely free on ProfessorVirus.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={handleStudyClick}
                style={{
                  padding: '0.8rem 1.6rem',
                  borderRadius: '9999px',
                  backgroundColor: isDark ? '#FFB800' : '#861820',
                  color: isDark ? '#0B0B0B' : '#FFFFFF',
                  border: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 6px 20px rgba(255, 184, 0, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Explore Learning Tools</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => window.open(WHATSAPP_PV_URL, '_blank', 'noopener,noreferrer')}
                style={{
                  padding: '0.8rem 1.4rem',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  color: isDark ? '#E4E4E7' : '#1F2421',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFB800';
                  e.currentTarget.style.color = '#FFB800';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1';
                  e.currentTarget.style.color = isDark ? '#E4E4E7' : '#1F2421';
                }}
              >
                <MessageCircle size={16} color="#22C55E" />
                <span>Academic Support</span>
              </button>
            </div>
          </div>

          {/* RIGHT: PRMA TECH CTA */}
          <div
            style={{
              backgroundColor: isDark ? '#080C1A' : '#FFFFFF',
              backgroundImage: isDark
                ? 'radial-gradient(circle at 85% 20%, rgba(112, 37, 232, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0A0F22 0%, #060914 100%)'
                : 'radial-gradient(circle at 85% 20%, rgba(112, 37, 232, 0.05) 0%, transparent 50%)',
              border: isDark ? '1.5px solid rgba(112, 37, 232, 0.45)' : '1.5px solid #DDD6FE',
              borderRadius: '26px',
              padding: 'clamp(1.75rem, 3vw, 2.75rem)',
              boxShadow: isDark
                ? '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(112, 37, 232, 0.1)'
                : '0 8px 30px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(8, 102, 245, 0.12)',
                  border: '1px solid rgba(8, 102, 245, 0.35)',
                  color: isDark ? '#60A5FA' : '#1D4ED8',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase'
                }}
              >
                <Briefcase size={14} />
                <span>Career & Internships</span>
              </div>

              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
                  fontWeight: 900,
                  color: isDark ? '#FFFFFF' : '#101C50',
                  lineHeight: 1.25,
                  margin: '0 0 0.85rem 0'
                }}
              >
                Ready to Build Your{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Tech Career?
                </span>
              </h3>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.94rem',
                  color: isDark ? '#A1A1AA' : '#64748B',
                  lineHeight: 1.6,
                  margin: '0 0 1.75rem 0'
                }}
              >
                Join 100% remote internship programs with PRMA Tech. Receive physical merchandise kit,
                build live client projects, and get 1-on-1 engineering mentorship.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={handleInternshipClick}
                style={{
                  padding: '0.8rem 1.6rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 6px 20px rgba(8, 102, 245, 0.35)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Explore Remote Internships</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => window.open(WHATSAPP_PRMA_URL, '_blank', 'noopener,noreferrer')}
                style={{
                  padding: '0.8rem 1.4rem',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  color: isDark ? '#E4E4E7' : '#101C50',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7025E8';
                  e.currentTarget.style.color = '#7025E8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1';
                  e.currentTarget.style.color = isDark ? '#E4E4E7' : '#101C50';
                }}
              >
                <MessageCircle size={16} color="#0866F5" />
                <span>Internship Inquiry</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 CORE VALUE PILLARS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {values.map((val) => {
            const VIcon = val.icon;
            return (
              <div
                key={val.id}
                style={{
                  backgroundColor: isDark ? '#0B0B0B' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1.5px solid #E8E2D5',
                  borderRadius: '18px',
                  padding: '1.4rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 2px 10px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: val.iconBg,
                    border: `1px solid ${val.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: val.iconColor
                  }}
                >
                  <VIcon size={18} strokeWidth={2.4} />
                </div>

                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: isDark ? '#FFFFFF' : '#1F2421'
                  }}
                >
                  {val.title}
                </div>

                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.82rem',
                    color: isDark ? '#A1A1AA' : '#64748B',
                    lineHeight: 1.55,
                    margin: 0
                  }}
                >
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}