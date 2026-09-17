import React from 'react';
import { Youtube, Instagram, Linkedin, Twitter, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const footerLinks = [
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
    { name: 'Contributors', id: 'contributors' },
    { name: 'Privacy Policy', id: 'privacy' },
    { name: 'Terms', id: 'terms' },
    { name: 'Help', id: 'help' }
  ];

  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #eae5d9',
      padding: '2.5rem 0 2rem 0',
      color: '#475569'
    }}>
      <div className="container">
        
        {/* TOP ROW: Brand, Nav links, Social Icons, Credits */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #f1f5f9'
        }}>

          {/* LEFT: Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #0e4d34',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/assets/navbar_logo.png"
                alt="CampusPrep Mascot"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                }}
              />
            </div>

            <div>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1.3rem',
                color: '#0e4d34',
                lineHeight: 1.1
              }}>
                Campus<span style={{ color: '#059669' }}>Prep</span>
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748b' }}>
                Study Smart. Prepare Better.
              </div>
            </div>
          </div>

          {/* CENTER: Quick Nav Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap'
          }}>
            {footerLinks.map(l => (
              <button
                key={l.id}
                onClick={() => onNavigate && onNavigate(l.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#0e4d34'}
                onMouseLeave={(e) => e.target.style.color = '#475569'}
              >
                {l.name}
              </button>
            ))}
          </div>

          {/* RIGHT: Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <a href="#youtube" title="YouTube" style={socialIconStyle}>
              <Youtube size={17} />
            </a>
            <a href="#instagram" title="Instagram" style={socialIconStyle}>
              <Instagram size={17} />
            </a>
            <a href="#linkedin" title="LinkedIn" style={socialIconStyle}>
              <Linkedin size={17} />
            </a>
            <a href="#twitter" title="Twitter / X" style={socialIconStyle}>
              <Twitter size={17} />
            </a>
          </div>

        </div>

        {/* BOTTOM ROW: Disclaimer & Credit Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.25rem',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} CampusPrep. Independent Student Academic Platform for AKTU B.Tech.
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontWeight: 600,
            color: '#334155'
          }}>
            Made for AKTU Students • By Students, For a Better Tomorrow. <Heart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} />
          </div>
        </div>

      </div>
    </footer>
  );
}

const socialIconStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  backgroundColor: '#f1f5f9',
  color: '#334155',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  transition: 'all 0.2s ease'
};
