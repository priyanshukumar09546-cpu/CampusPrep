import React from 'react';
import { Sparkles, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export default function AllIzzWellBanner({ 
  title = "Exams Crack Karna Hai?\nReal PYQs & Notes Solve Karo! :)", 
  className = '' 
}) {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: '300px'
      }} 
      className={`all-izz-well-banner ${className}`}
    >
      {title && (
        <div style={{
          fontFamily: "'Kalam', cursive",
          color: '#fef08a',
          fontSize: '0.88rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '0.5rem',
          whiteSpace: 'pre-line',
          textShadow: '0 2px 4px rgba(0,0,0,0.35)'
        }}>
          {title}
        </div>
      )}

      {/* Premium Academic Mascot & Study Card (No three-boys image) */}
      <div style={{
        width: '100%',
        maxWidth: '300px',
        minHeight: '170px',
        position: 'relative',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(255,255,255,0.18)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
        padding: '1.15rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        {/* Animated ProfessorVirus Avatar Badge */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          border: '2.5px solid #C88D2D',
          boxShadow: '0 6px 16px rgba(200, 141, 45, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '0.75rem'
        }}>
          <img
            src="/assets/navbar_logo.png"
            alt="ProfessorVirus Academic Badge"
            style={{ width: '85%', height: '85%', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>

        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.95rem',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '0.01em',
          marginBottom: '0.2rem'
        }}>
          Professor<span style={{ color: '#FDE047' }}>Virus</span>
        </div>

        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#E2E8F0',
          letterSpacing: '0.02em',
          marginBottom: '0.65rem'
        }}>
          Study Smart • Prepare Better
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#FEF08A'
        }}>
          <Sparkles size={12} />
          <span>AKTU Verified Content</span>
        </div>
      </div>
    </div>
  );
}
