import React from 'react';
import { ExternalLink, ArrowRight, Sparkles, Users, Award, BookOpen } from 'lucide-react';

// Official SVG WhatsApp Icon
const WhatsAppIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.411z"
      fill={color}
    />
  </svg>
);

export default function WhatsAppCommunityCards({ isMobile = false }) {
  const cards = [
    {
      id: 'pv-community',
      title: 'Join ProfessorVirus Community',
      subtitle: 'Follow the AKTU Material Free – By ProfessorVirus 🥇',
      description: 'Get free AKTU study materials, notes, previous-year questions, academic updates and useful learning resources.',
      buttonText: 'JOIN PROFESSORVIRUS',
      url: 'https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G',
      badgeText: 'Official Channel',
      primaryColor: '#861820',
      accentColor: '#25D366',
      btnGradient: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
      btnHoverShadow: '0 8px 20px rgba(22, 101, 52, 0.4)'
    },
    {
      id: 'prma-community',
      title: 'Join PRMA Tech Community',
      subtitle: 'Learn • Build • Innovate • Grow',
      description: 'Connect with the PRMA Tech community to discover technology updates, internships, live projects, career opportunities and professional networking.',
      buttonText: 'JOIN PRMA TECH COMMUNITY',
      url: 'https://chat.whatsapp.com/B8zkpc5tc2TKni9jcWsiba',
      badgeText: 'Tech & Careers',
      primaryColor: '#0F172A',
      accentColor: '#25D366',
      btnGradient: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)',
      btnHoverShadow: '0 8px 20px rgba(18, 140, 126, 0.4)'
    }
  ];

  return (
    <div
      className="pv-whatsapp-community-grid"
      style={{
        width: '100%',
        maxWidth: '690px',
        marginTop: isMobile ? '8px' : '0.75rem',
        marginBottom: isMobile ? '12px' : '0',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        gap: isMobile ? '0.75rem' : '0.65rem',
        boxSizing: 'border-box'
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className="pv-community-card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1.5px solid rgba(37, 211, 102, 0.28)',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(37, 211, 102, 0.06)',
            padding: isMobile ? '1rem 1.1rem' : '0.85rem 0.95rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(37, 211, 102, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(37, 211, 102, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.28)';
          }}
        >
          {/* Subtle decorative top-right green accent */}
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              right: '-24px',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37, 211, 102, 0.18) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div>
            {/* Top row: Icon + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div
                  style={{
                    width: isMobile ? '32px' : '28px',
                    height: isMobile ? '32px' : '28px',
                    borderRadius: '8px',
                    backgroundColor: '#E7F9EE',
                    border: '1px solid rgba(37, 211, 102, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <WhatsAppIcon size={isMobile ? 18 : 16} color="#25D366" />
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#15803D',
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    padding: '2px 7px',
                    borderRadius: '999px'
                  }}
                >
                  {card.badgeText}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', color: '#16A34A', fontWeight: 700 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                <span>Active</span>
              </div>
            </div>

            {/* Title */}
            <h4
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: isMobile ? '1.02rem' : '0.92rem',
                fontWeight: 900,
                color: '#0F172A',
                margin: '0 0 0.15rem 0',
                lineHeight: 1.25,
                letterSpacing: '-0.01em'
              }}
            >
              {card.title}
            </h4>

            {/* Subtitle */}
            <div
              style={{
                fontSize: isMobile ? '0.74rem' : '0.68rem',
                fontWeight: 700,
                color: '#861820',
                lineHeight: 1.25,
                marginBottom: '0.35rem'
              }}
            >
              {card.subtitle}
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: isMobile ? '0.74rem' : '0.68rem',
                color: '#475569',
                lineHeight: 1.4,
                margin: '0 0 0.75rem 0',
                fontWeight: 500
              }}
            >
              {card.description}
            </p>
          </div>

          {/* CTA Button */}
          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              width: '100%',
              padding: isMobile ? '0.52rem 0.95rem' : '0.45rem 0.65rem',
              borderRadius: '999px',
              background: card.btnGradient,
              color: '#FFFFFF',
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: isMobile ? '0.78rem' : '0.71rem',
              fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 14px rgba(21, 128, 61, 0.3)',
              boxSizing: 'border-box',
              transition: 'all 0.15s ease',
              marginTop: 'auto',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = card.btnHoverShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(21, 128, 61, 0.3)';
            }}
          >
            <WhatsAppIcon size={14} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF' }}>{card.buttonText}</span>
            <ArrowRight size={13} strokeWidth={2.5} color="#FFFFFF" />
          </a>
        </div>
      ))}
    </div>
  );
}
