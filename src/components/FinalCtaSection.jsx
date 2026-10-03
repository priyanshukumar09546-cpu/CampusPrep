import React from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
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
      iconColor: '#BE123C',
      iconBg: '#FFE4E6',
      border: '#FECDD3'
    },
    {
      id: 'student-first',
      title: 'Student First',
      desc: 'Built by students, for students. Always free, always growing.',
      icon: Users,
      iconColor: '#EA580C',
      iconBg: '#FFEDD5',
      border: '#FED7AA'
    },
    {
      id: 'trusted',
      title: 'Trusted Content',
      desc: 'Verified, updated & curated academic materials.',
      icon: ShieldCheck,
      iconColor: '#781416',
      iconBg: '#FEE2E2',
      border: '#FECACA'
    },
    {
      id: 'growth',
      title: 'Continuous Growth',
      desc: 'New tools, subjects and features regularly added.',
      icon: Zap,
      iconColor: '#7C3AED',
      iconBg: '#EDE9FE',
      border: '#DDD6FE'
    }
  ];

  return (
    <section 
      style={{
        backgroundColor: '#FAF7F2',
        padding: '3.5rem 0 3.5rem 0',
        borderBottom: '1.5px solid #E8E2D5'
      }}
    >
      <div className="container">
        
        {/* 1. FINAL CTA BANNER */}
        <div style={{
          backgroundColor: '#FFFBEB',
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(200, 141, 45, 0.12) 0%, transparent 40%),
            linear-gradient(135deg, #FFFDF7 0%, #FEF9EE 100%)
          `,
          border: '1.5px solid #FDE68A',
          borderRadius: '28px',
          padding: 'clamp(2rem, 3.5vw, 3rem)',
          boxShadow: '0 12px 36px rgba(200, 141, 45, 0.09)',
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
                color: '#1C1E21',
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
                lineHeight: 1.2
              }}>
                <span role="img" aria-label="mortarboard">🎓</span>
                <h2>Ready to Boost Your Academic Success?</h2>
              </div>

              {/* Subtitle */}
              <p style={{
                fontSize: '0.96rem',
                color: '#64748B',
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
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.8rem 1.6rem',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 8px 20px rgba(120, 20, 22, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#9F1239';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#781416';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>Explore All Tools</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#1E140F',
                    border: '1.5px solid #25D366',
                    borderRadius: '9999px',
                    padding: '0.8rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.15)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#25D366';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#1E140F';
                  }}
                >
                  <MessageCircle size={17} style={{ color: '#25D366' }} />
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
                { label: 'Trusted by Students Across India', icon: GraduationCap, color: '#D97706', bg: '#FEF3C7' },
                { label: '20+ Academic & Career Tools', icon: Wrench, color: '#2563EB', bg: '#EFF6FF' },
                { label: 'Verified & Updated Curriculum Resources', icon: BookOpen, color: '#059669', bg: '#ECFDF5' }
              ].map((badge, bidx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={bidx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E2D5',
                      borderRadius: '16px',
                      padding: '0.85rem 1.25rem',
                      width: '100%',
                      boxShadow: '0 2px 8px rgba(35,30,25,0.03)'
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
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C1E21' }}>
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
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${v.border}`,
                  borderRadius: '20px',
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 14px rgba(35,30,25,0.04)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 22px rgba(35,30,25,0.07)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(35,30,25,0.04)';
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
                  color: '#1C1E21',
                  margin: '0 0 0.35rem 0'
                }}>
                  {v.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.82rem',
                  color: '#64748B',
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
