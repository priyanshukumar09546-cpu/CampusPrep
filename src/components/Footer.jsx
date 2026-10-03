import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  ChevronRight, 
  ShieldCheck, 
  Mail, 
  Check, 
  Sparkles,
  Phone,
  ExternalLink
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  const handleNav = (tab) => {
    if (onNavigate) {
      onNavigate(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/917668016628?text=Hi%20ProfessorVirus%20Team%2C%20I%20have%20an%20inquiry.", '_blank', 'noopener,noreferrer');
  };

  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'PYQs', id: 'pyqs' },
    { name: 'Notes', id: 'notes' },
    { name: 'Syllabus', id: 'syllabus' },
    { name: 'Quizzes', id: 'quizzes' },
    { name: 'More Tools', id: 'more' },
    { name: 'Promotion & Sponsorship', id: 'promotion' },
    { name: 'Contact Us', action: openWhatsApp },
    { name: 'About Us', id: 'important-links' }
  ];

  const popularTools = [
    { name: 'PYQs', id: 'pyqs' },
    { name: 'Notes', id: 'notes' },
    { name: 'Syllabus', id: 'syllabus' },
    { name: 'Internships & Jobs', id: 'internships-jobs' },
    { name: 'Interview Pro', id: 'interview-pro' },
    { name: 'PDF Maker & Splitter', id: 'pdf-maker' },
    { name: 'Result & CGPA', id: 'result-cgpa' },
    { name: 'Scholarships & Grants', id: 'scholarships' },
    { name: 'All Tools', id: 'more' }
  ];

  return (
    <footer style={{
      backgroundColor: '#FAF7F2',
      borderTop: '1.5px solid #E8E2D5',
      padding: '4rem 0 2rem 0',
      color: '#475569',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div className="container">
        
        {/* MAIN 4-COLUMN FOOTER GRID */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          style={{ paddingBottom: '3.5rem', borderBottom: '1px solid #E8E2D5' }}
        >
          
          {/* COLUMN 1: Brand, Description & Socials */}
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #C88D2D',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img
                  src="/assets/navbar_logo.png"
                  alt="ProfessorVirus"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/logo-icon-192.png';
                  }}
                />
              </div>

              <div>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.45rem',
                  color: '#1F2421',
                  letterSpacing: '-0.01em'
                }}>
                  Professor<span style={{ color: '#781416' }}>Virus</span>
                </span>
                <div style={{
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#B37D28',
                  fontFamily: "'Kalam', cursive"
                }}>
                  Study Smart. Prepare Better.
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.86rem',
              color: '#64748B',
              lineHeight: 1.6,
              margin: '0 0 1.25rem 0'
            }}>
              All-in-one academic platform for engineering, pharmacy, and management students. Access notes, PYQs, syllabus, quizzes, internships, interview prep, results tools, and more — completely free.
            </p>

            {/* Social Icons Strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {[
                { name: 'YouTube', color: '#EF4444', url: 'https://youtube.com' },
                { name: 'Telegram', color: '#0284C7', url: 'https://t.me' },
                { name: 'Instagram', color: '#E11D48', url: 'https://instagram.com' },
                { name: 'LinkedIn', color: '#0A66C2', url: 'https://linkedin.com' },
                { name: 'WhatsApp', color: '#25D366', url: 'https://wa.me/917668016628' }
              ].map((s, sidx) => (
                <a
                  key={sidx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E2D5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.color,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(35,30,25,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = s.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#E8E2D5';
                  }}
                >
                  {s.name[0]}
                </a>
              ))}
            </div>

            {/* Community Highlight */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E2D5',
              borderRadius: '9999px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#781416'
            }}>
              <span>❤️</span>
              <span>Join Students Across India</span>
            </div>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div>
            <h3 style={{
              fontSize: '0.96rem',
              fontWeight: 800,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.01em',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <span>🔗</span>
              <span>Quick Links</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {quickLinks.map((link, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => link.action ? link.action() : handleNav(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '0.15rem 0',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#781416';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#64748B';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>{link.name}</span>
                  <ChevronRight size={14} style={{ opacity: 0.6 }} />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 3: Popular Tools */}
          <div>
            <h3 style={{
              fontSize: '0.96rem',
              fontWeight: 800,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.01em',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <span>🛠️</span>
              <span>Popular Tools</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {popularTools.map((tool, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleNav(tool.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '0.15rem 0',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#781416';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#64748B';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>{tool.name}</span>
                  <ChevronRight size={14} style={{ opacity: 0.6 }} />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 4: Stay Updated & App Badges */}
          <div>
            <h3 style={{
              fontSize: '0.96rem',
              fontWeight: 800,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.01em',
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <span>✉️</span>
              <span>Stay Updated</span>
            </h3>

            <p style={{
              fontSize: '0.84rem',
              color: '#64748B',
              lineHeight: 1.55,
              margin: '0 0 1rem 0'
            }}>
              Get the latest notes, tools, new features and important updates directly in your inbox.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} style={{ marginBottom: '0.65rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2D9C8',
                borderRadius: '12px',
                padding: '0.25rem 0.35rem 0.25rem 0.85rem',
                boxShadow: '0 2px 8px rgba(35,30,25,0.03)'
              }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribed}
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.84rem',
                    color: '#1C1E21',
                    width: '100%'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: subscribed ? '#059669' : '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 0.95rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {subscribed ? 'Subscribed!' : 'Subscribe'}
                </button>
              </div>
            </form>

            <div style={{
              fontSize: '0.74rem',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '1.75rem'
            }}>
              <ShieldCheck size={14} style={{ color: '#059669' }} />
              <span>No spam. Only important updates.</span>
            </div>

            {/* Get the App Coming Soon */}
            <div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#1C1E21',
                marginBottom: '0.65rem'
              }}>
                📱 Get the App (Coming Soon)
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <div style={{
                  backgroundColor: '#1E140F',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '0.45rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  opacity: 0.9
                }}>
                  <span>▶</span>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: '#9CA3AF' }}>GET IT ON</div>
                    <div>Google Play</div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#1E140F',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '0.45rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  opacity: 0.9
                }}>
                  <span></span>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: '#9CA3AF' }}>Download on the</div>
                    <div>App Store</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM SUB-FOOTER BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          paddingTop: '2rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} ProfessorVirus. All rights reserved. Made with ❤️ for students across India.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('important-links')}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('important-links')}>Terms of Service</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleNav('important-links')}>Disclaimer</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={openWhatsApp}>Contact Us</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E2D5',
              borderRadius: '6px',
              padding: '0.2rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#059669'
            }}>
              <ShieldCheck size={13} />
              <span>Secure & Safe</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E2D5',
              borderRadius: '6px',
              padding: '0.2rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#475569'
            }}>
              <span>UPI / RuPay / Cards</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
