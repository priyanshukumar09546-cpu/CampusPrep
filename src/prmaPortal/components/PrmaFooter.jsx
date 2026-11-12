import React from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Heart,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function PrmaFooter({ navigateToTab, onNavigate }) {
  const navFn = navigateToTab || onNavigate;

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open(
      'https://wa.me/917668016628?text=Hi%20PRMA%20Tech%20Support%2C%20I%20have%20an%20inquiry%20regarding%20PRMA%20Tech.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <footer
      style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '4rem 1.5rem 2rem',
        borderTop: '1px solid #1E293B',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Top Trust Features Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2.5rem',
            marginBottom: '3rem',
            borderBottom: '1px solid #1E293B'
          }}
        >
          {[
            {
              icon: Award,
              color: '#0866F5',
              title: 'Verified Certification',
              desc: 'Tamper-proof verifiable credentials with unique QR validation.'
            },
            {
              icon: Clock,
              color: '#10B981',
              title: 'Flexible Remote Batches',
              desc: 'Bi-weekly starting cohorts tailored for college engineering schedules.'
            },
            {
              icon: ShieldCheck,
              color: '#F59E0B',
              title: 'Industry Standard Mentors',
              desc: '1:1 code reviews from senior engineers working in modern tech.'
            },
            {
              icon: Sparkles,
              color: '#7025E8',
              title: 'Physical Welcome Swag',
              desc: 'Premium branded developer merchandise delivered to your home.'
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    flexShrink: 0
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.55 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Footer Links Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.2fr',
            gap: '2.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid #334155'
          }}
          className="prma-footer-grid"
        >
          {/* Brand Bio */}
          <div>
            <img
              src="/assets/prma_tech_logo.png"
              alt="PRMA Tech"
              style={{
                height: '42px',
                objectFit: 'contain',
                marginBottom: '1rem',
                filter: 'brightness(1.1)'
              }}
              onError={(e) => {
                e.target.src = '/assets/prma_tech_logo.jpg';
              }}
            />
            <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.65, maxWidth: '300px', marginBottom: '1.25rem' }}>
              PRMA Tech™ is a modern technology company and student-centric software incubator building scalable digital products, enterprise services, and industry-ready remote internship experiences.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#34D399', fontWeight: 700 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
              Accepting Applications for Nov &amp; Dec 2026
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.1rem' }}>
              Company
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Home', tab: 'prma-home' },
                { label: 'About Us', tab: 'prma-about' },
                { label: 'Our Services', tab: 'prma-services' },
                { label: 'Case Studies & Projects', tab: 'prma-projects' },
                { label: 'Contact Us', tab: 'prma-contact' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.tab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'color 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FBBF24'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Internship Links */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.1rem' }}>
              Internship Ecosystem
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Internship Program', tab: 'prma-internships-home' },
                { label: '16 Industry Domains', tab: 'prma-internships-domains' },
                { label: 'Apply for Internship (Free)', tab: 'prma-internships-domains' },
                { label: 'Goodies Suite (Coming Soon)', tab: 'prma-internships-goodies' },
                { label: 'Verify Offer Letter', tab: 'prma-verify-offer' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.tab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'color 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FBBF24'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.1rem' }}>
              Technology Services
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                'Website Development',
                'Mobile App Development',
                'AI/ML Custom Models',
                'Cloud & DevOps',
                'Cybersecurity Solutions',
                'Data Science & Analytics',
                'Custom SaaS Development'
              ].map((srv, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleNav('prma-services')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'color 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FBBF24'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  >
                    {srv}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.1rem' }}>
              Contact & Support
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.88rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                <MapPin size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Noida &amp; Greater Noida Tech Corridor, Uttar Pradesh, India</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#FFFFFF' }}>
                <Mail size={17} color="#38BDF8" style={{ flexShrink: 0 }} />
                <a
                  href="mailto:support@prmatech.in"
                  style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FBBF24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                >
                  support@prmatech.in
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#FFFFFF' }}>
                <Phone size={17} color="#38BDF8" style={{ flexShrink: 0 }} />
                <a
                  href="tel:+917668016628"
                  style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FBBF24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                >
                  +91 76680 16628
                </a>
              </div>

              <button
                type="button"
                onClick={openWhatsApp}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.7rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803D';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16A34A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <MessageCircle size={18} />
                WhatsApp Mentor Support
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Ecosystem Ribbon */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.84rem',
            color: '#94A3B8'
          }}
        >
          <div>
            © {new Date().getFullYear()} PRMA Tech™ (A unit of PRMA Technologies India Pvt Ltd). All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              type="button"
              onClick={() => handleNav('home')}
              style={{ background: 'none', border: 'none', color: '#FBBF24', cursor: 'pointer', fontWeight: 700 }}
            >
              ProfessorVirus Ecosystem
            </button>
            <button
              type="button"
              onClick={() => handleNav('internships-jobs')}
              style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', fontWeight: 500 }}
            >
              ProfessorVirus Job Board
            </button>
            <button
              type="button"
              onClick={() => handleNav('prma-admin')}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .prma-footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
