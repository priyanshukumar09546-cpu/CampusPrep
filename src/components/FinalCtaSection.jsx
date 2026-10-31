import React from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Target, 
  Users, 
  ShieldCheck, 
  Zap, 
  GraduationCap,
  Wrench,
  BookOpen
} from 'lucide-react';

export default function FinalCtaSection({ onNavigate }) {
  const WHATSAPP_URL = "https://wa.me/917668016628?text=Hi%20ProfessorVirus%20Team%2C%20I%20have%20a%20question%20regarding%20academic%20resources%20and%20tools.";

  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  };

  const handleExploreMore = () => {
    if (onNavigate) {
      onNavigate('more');
    } else {
      window.location.href = '/more';
    }
  };

  const values = [
    {
      id: 'mission',
      title: 'Our Mission',
      desc: 'Make quality academic resources accessible to every student.',
      icon: Target,
      iconColor: '#FFB800',
      iconBg: 'rgba(255, 184, 0, 0.1)',
      border: 'rgba(255, 184, 0, 0.3)'
    },
    {
      id: 'student-first',
      title: 'Student First',
      desc: 'Built by students, for students. Always free, always growing.',
      icon: Users,
      iconColor: '#FF8C00',
      iconBg: 'rgba(255, 140, 0, 0.1)',
      border: 'rgba(255, 140, 0, 0.3)'
    },
    {
      id: 'trusted',
      title: 'Trusted Content',
      desc: 'Verified, updated & curated academic materials.',
      icon: ShieldCheck,
      iconColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)'
    },
    {
      id: 'growth',
      title: 'Continuous Growth',
      desc: 'New tools, subjects and features regularly added.',
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
        padding: '3.5rem 0 3.5rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* 1. FINAL CTA BANNER */}
        <div style={{
          backgroundColor: '#0B0B0B',
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(255, 184, 0, 0.08) 0%, transparent 40%),
            linear-gradient(135deg, #0F0F0F 0%, #080808 100%)
          `,
          border: '1px solid rgba(255, 184, 0, 0.35)',
          borderRadius: '28px',
          padding: 'clamp(2rem, 3.5vw, 3rem)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 184, 0, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              {/* Heading */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 'clamp(1.75rem, 2.6vw, 2.45rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
                lineHeight: 1.2
              }}>
                <span>🎓</span>
                <h2>Ready to Boost Your <span style={{ color: '#FFB800', textShadow: '0 0 15px rgba(255, 184, 0, 0.35)' }}>Academic Success?</span></h2>
              </div>

              {/* Subtitle */}
              <p style={{
                fontSize: '0.96rem',
                color: '#A1A1AA',
                lineHeight: 1.6,
                margin: '0 0 1.5rem 0',
                maxWidth: '560px'
              }}>
                Join students across engineering, pharmacy & management who are learning, practicing and growing with ProfessorVirus.
              </p>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}>
                <button
                  type="button"
                  onClick={handleExploreMore}
                  className="pv-glow-btn"
                  style={{
                    backgroundColor: '#0B0B0B',
                    color: '#FFB800',
                    border: '1.5px solid rgba(255, 184, 0, 0.5)',
                    borderRadius: '9999px',
                    padding: '0.8rem 1.6rem',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    boxShadow: '0 0 20px rgba(255, 184, 0, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FFB800';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 184, 0, 0.45)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 184, 0, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 184, 0, 0.2)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span className="pv-bulb"></span>
                  <span>Explore All Tools</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  style={{
                    backgroundColor: '#0B0B0B',
                    color: '#22C55E',
                    border: '1.5px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '9999px',
                    padding: '0.8rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                    e.currentTarget.style.borderColor = '#22C55E';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B0B0B';
                    e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  <MessageCircle size={17} style={{ color: '#22C55E' }} />
                  <span>Contact on WhatsApp 7668016628</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Value Badges & Study Visual */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              alignItems: 'flex-start',
              justifyContent: 'center'
            }}>
              {[
                { label: 'Trusted by Students Across India', icon: GraduationCap, color: '#FFB800', bg: 'rgba(255, 184, 0, 0.1)' },
                { label: '20+ Academic & Career Tools', icon: Wrench, color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.1)' },
                { label: 'Verified & Updated Curriculum Resources', icon: BookOpen, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' }
              ].map((badge, bidx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={bidx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      backgroundColor: '#111111',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '0.85rem 1.25rem',
                      width: '100%',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={18} strokeWidth={2.2} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. FOUR CORE VALUES STRIP */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          style={{ alignItems: 'stretch' }}
        >
          {values.map(v => {
            const Icon = v.icon;
            return (
              <div
                key={v.id}
                style={{
                  backgroundColor: '#0B0B0B',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = v.iconColor;
                  e.currentTarget.style.boxShadow = `0 10px 24px rgba(0, 0, 0, 0.7), 0 0 15px ${v.iconColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: v.iconBg,
                  color: v.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  border: `1px solid ${v.border}`
                }}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 0.35rem 0'
                }}>
                  {v.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.82rem',
                  color: '#A1A1AA',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
