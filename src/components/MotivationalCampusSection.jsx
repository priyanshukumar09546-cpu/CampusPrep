import React from 'react';
import { ArrowRight, Users, Sparkles } from 'lucide-react';

export default function MotivationalCampusSection({ onJoinCommunity }) {
  return (
    <section style={{
      position: 'relative',
      backgroundColor: '#f5f0e3',
      backgroundImage: `
        radial-gradient(rgba(14, 77, 52, 0.08) 1.5px, transparent 1.5px),
        linear-gradient(180deg, #f9f7f1 0%, #f4eee0 100%)
      `,
      backgroundSize: '24px 24px, 100% 100%',
      padding: '2.5rem 0 3.5rem 0',
      borderBottom: '2px solid #e5dfd3',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        
        {/* TOP QUOTE BANNER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* Left Quote */}
          <div style={{
            fontFamily: "'Kalam', cursive",
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#0e4d34',
            backgroundColor: '#ffffff',
            padding: '0.6rem 1.25rem',
            borderRadius: '16px',
            border: '2px dashed #0d5c3a',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            lineHeight: 1.3
          }}>
            “Padhoge toh nikloge... <br />
            Nahi toh yahin atke rah jaoge!” <br />
            <span style={{ color: '#059669', fontSize: '0.92rem' }}>— Virus</span>
          </div>

          {/* Right Quote */}
          <div style={{
            fontFamily: "'Kalam', cursive",
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#1e293b',
            textShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            Friends + Right Resources = <span style={{ color: '#059669' }}>Higher CGPA :)</span>
          </div>
        </div>

        {/* MAIN COMPOSITION WRAPPER */}
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          backgroundColor: '#ffffff',
          border: '2px solid #e2e8f0',
          boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
          padding: '1.5rem 1.5rem 2rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: '200px 1fr 220px',
          gap: '1.25rem',
          alignItems: 'end',
          overflow: 'hidden'
        }} className="motivational-grid">

          {/* Campus Background Architectural Watermark */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.06,
            pointerEvents: 'none'
          }} />

          {/* LEFT: Virus Drinking Tea */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Small Cup Label */}
            <div style={{
              backgroundColor: '#fff7ed',
              border: '1px solid #fdba74',
              borderRadius: '9999px',
              padding: '0.2rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#c2410c',
              marginBottom: '0.4rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              CHAI + CONCEPTS ☕
            </div>

            <div style={{
              width: '180px',
              height: '160px',
              position: 'relative',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
            }}>
              <img
                src="/assets/bottom_virus.png"
                alt="Virus Drinking Tea"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_virus.png';
                }}
              />
            </div>
          </div>

          {/* CENTER: Wall Doodles, Student Leaning Group, and Main CTA */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            position: 'relative',
            zIndex: 2,
            gap: '1rem'
          }}>
            {/* Wall Doodle */}
            <div style={{
              fontFamily: "'Kalam', cursive",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#334155',
              letterSpacing: '0.02em',
              textAlign: 'center'
            }}>
              ENGINEERING BHI HO JAYEGI! :)
            </div>

            {/* Leaning Students Image */}
            <div style={{
              width: '260px',
              height: '135px',
              position: 'relative',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
            }}>
              <img
                src="/assets/bottom_students.png"
                alt="Students Leaning on Wall"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_students.png';
                }}
              />
            </div>

            {/* Wall Text Doodles */}
            <div style={{
              fontFamily: "'Kalam', cursive",
              fontSize: '0.85rem',
              color: '#64748b',
              fontWeight: 700
            }}>
              Padho • Plan karo • Grow karo
            </div>

            {/* PROMINENT CTA BUTTON */}
            <button
              onClick={onJoinCommunity}
              className="btn-primary"
              style={{
                fontSize: '1.05rem',
                padding: '0.85rem 2.2rem',
                backgroundColor: '#0e4d34',
                boxShadow: '0 8px 24px rgba(14, 77, 52, 0.35)',
                gap: '0.6rem'
              }}
            >
              Join the CampusPrep Community <ArrowRight size={20} />
            </button>
          </div>

          {/* RIGHT: Stack of Books & Sticky Note */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Sticky Note */}
            <div className="sticky-note" style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              marginBottom: '0.6rem',
              fontSize: '0.82rem',
              fontFamily: "'Kalam', cursive",
              fontWeight: 700,
              color: '#0f172a',
              textAlign: 'center',
              boxShadow: '0 6px 14px rgba(0,0,0,0.12)'
            }}>
              Better Students <br />
              Brighter Tomorrow! <br />
              <span style={{ color: '#059669' }}>:)</span>
            </div>

            {/* Stack of Books */}
            <div style={{
              width: '140px',
              height: '170px',
              position: 'relative',
              filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.2))'
            }}>
              <img
                src="/assets/bottom_books.png"
                alt="Stack of Books: Notes, Ideas, Progress, Success"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 992px) {
          .motivational-grid {
            grid-template-columns: 1fr !important;
            justify-items: center !important;
          }
        }
      `}</style>
    </section>
  );
}
