import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Notes', id: 'notes' },
    { name: 'PYQs', id: 'pyqs' },
    { name: 'Syllabus', id: 'syllabus' },
    { name: 'Quizzes', id: 'quizzes' },
    { name: 'Interview Pro', id: 'interview-pro' },
    { name: 'SGPA Analyzer', id: 'result-cgpa' },
    { name: 'Attendance Planner', id: 'attendance-calculator' },
    { name: 'Important Links', id: 'important-links' }
  ];

  return (
    <footer style={{
      backgroundColor: '#FAF7F2',
      borderTop: '1.5px solid #E8E2D5',
      padding: '3rem 0 2rem 0',
      color: '#475569',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div className="container">
        
        {/* TOP SECTION: BRAND & NAVIGATION */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid #E8E2D5'
        }} className="footer-top-row">

          {/* LEFT: Logo, Title, and Brand Tagline */}
          <div style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
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
                  alt="ProfessorVirus Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.35rem',
                  color: '#1F2421',
                  letterSpacing: '-0.01em'
                }}>
                  Professor<span style={{ color: '#781416' }}>Virus</span>
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '0.85rem',
              color: '#64748B',
              lineHeight: 1.55,
              margin: 0
            }}>
              Independent student academic ecosystem for AKTU B.Tech & professional degree students. Verified notes, university question papers, smart academic tools, and placement preparation.
            </p>
          </div>

          {/* RIGHT: Curated Quick Navigation Links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.85rem',
            maxWidth: '560px'
          }} className="footer-links-col">
            <div style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#781416'
            }}>
              Academic & Placement Resources
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem 1.25rem'
            }}>
              {quickLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => onNavigate && onNavigate(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#475569',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '0.2rem 0',
                    transition: 'color 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#781416'}
                  onMouseLeave={(e) => e.target.style.color = '#475569'}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Academic Notice */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          fontSize: '0.78rem',
          color: '#64748B'
        }} className="footer-bottom-row">
          <div>
            © {new Date().getFullYear()} ProfessorVirus. Made by students, for students.
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontWeight: 600,
            color: '#334155'
          }}>
            Study Smart. Prepare Better. <Sparkles size={13} style={{ color: '#C88D2D' }} />
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-top-row {
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          .footer-links-col {
            max-width: 100% !important;
          }
          .footer-bottom-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
