import React from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Heart
} from 'lucide-react';

export default function PrmaFooter({ onNavigate }) {
  const handleNav = (route) => {
    if (onNavigate) {
      onNavigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/917668016628?text=Hi%20PRMA%20Tech%20Support%2C%20I%20have%20an%20inquiry%20regarding%20the%20Internship%20Program.', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer
      style={{
        backgroundColor: '#0A0F24',
        color: '#FFFFFF',
        padding: '3.5rem 1rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto'
        }}
      >
        {/* Top Trust Features Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2.5rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {[
            {
              icon: Award,
              color: '#0866F5',
              title: 'Verified Certification',
              desc: 'Globally verifiable credentials with authentic serial numbers.'
            },
            {
              icon: Clock,
              color: '#079B45',
              title: '100% Remote & Self-Paced',
              desc: 'Learn and build on flexible schedules around your college exams.'
            },
            {
              icon: ShieldCheck,
              color: '#FFBD12',
              title: 'Physical Welcome Kit',
              desc: 'Premium merchandise delivered straight to your home address.'
            },
            {
              icon: MessageCircle,
              color: '#7025E8',
              title: '1-on-1 Mentorship',
              desc: 'Direct code reviews and project guidance from active engineers.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: `${item.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Footer Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Column 1: PRMA Tech Brand */}
          <div>
            <img
              src="/assets/prma_tech_logo.png"
              alt="PRMA Tech"
              style={{ height: '32px', objectFit: 'contain', marginBottom: '1rem' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              PRMA Tech™ is an industry-focused technology and workforce incubator providing hands-on
              virtual internships, live production projects, and modern software engineering solutions.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              In Academic Partnership with <span style={{ color: '#FFB800', fontWeight: 700 }}>ProfessorVirus</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Internship Portal
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Internship Overview', route: 'prma-internships-home' },
                { label: 'Explore 27 Domains', route: 'prma-internships-domains' },
                { label: 'Apply for Batch', route: 'prma-internships-apply' },
                { label: 'Customize Goodies Kit', route: 'prma-internships-goodies' },
                { label: 'Student Dashboard', route: 'prma-internships-dashboard' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.route)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0866F5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Tracks */}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Popular Tracks
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'Artificial Intelligence & ML',
                'Data Science & Analytics',
                'Full Stack Web Development',
                'Cloud Computing & DevOps',
                'Cybersecurity & Ethical Hacking',
                'Mobile App Development'
              ].map((domainName, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleNav('prma-internships-domains')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0866F5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                  >
                    {domainName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support & WhatsApp */}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student Support
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
              Have questions regarding batch selection, goodie delivery, or verified certificates? Chat directly with the internship coordinator.
            </p>
            <button
              type="button"
              onClick={openWhatsApp}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(7, 155, 69, 0.15)',
                color: '#22C55E',
                border: '1px solid rgba(7, 155, 69, 0.4)',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Coordinator</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('prma-internships-home')}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#E2E8F0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Verify Certificate
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#64748B'
          }}
        >
          <div>
            © {new Date().getFullYear()} PRMA Tech™. All rights reserved. Technology Partner of ProfessorVirus.
          </div>
          <div>
            Build. Learn. Intern. Grow. Made with <Heart size={12} color="#EF4444" style={{ display: 'inline', verticalAlign: 'middle' }} /> for engineering students across India.
          </div>
        </div>
      </div>
    </footer>
  );
}