import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { PRMA_GOODIES } from '../data/prmaGoodies';

export default function PrmaGoodiesPage({ navigateToTab, onNavigate }) {
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const navFn = navigateToTab || onNavigate;

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedProductIndex === null) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextProduct();
      } else if (e.key === 'ArrowLeft') {
        prevProduct();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProductIndex]);

  const openLightbox = (index) => {
    setSelectedProductIndex(index);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedProductIndex(null);
    setZoomLevel(1);
    document.body.style.overflow = 'auto';
  };

  const nextProduct = () => {
    setSelectedProductIndex((prev) => (prev + 1) % PRMA_GOODIES.length);
    setZoomLevel(1);
  };

  const prevProduct = () => {
    setSelectedProductIndex((prev) => (prev - 1 + PRMA_GOODIES.length) % PRMA_GOODIES.length);
    setZoomLevel(1);
  };

  const currentProduct = selectedProductIndex !== null ? PRMA_GOODIES[selectedProductIndex] : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A',
        overflowX: 'hidden'
      }}
    >
      <PrmaNavbar activePage="goodies" navigateToTab={navFn} onNavigate={navFn} />

      {/* =========================================================================
          HERO & LAUREL WREATH TITLE (Matches Reference Image 3)
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F0F6FF 0%, #FFFFFF 100%)',
          padding: '3.5rem 1.5rem 2rem',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* PRMA Tech Logo with Slogan */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0866F5 0%, #EA4335 50%, #34A853 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.35rem'
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: '#0F172A'
                }}
              >
                PRMA <span style={{ color: '#0866F5' }}>Tech</span>
                <span style={{ fontSize: '0.9rem', verticalAlign: 'super', marginLeft: '2px', color: '#64748B' }}>™</span>
              </span>
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#64748B',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '0.2rem'
              }}
            >
              Build • Learn • Innovate • Grow
            </span>
          </div>

          {/* Laurel Wreath Title */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '0.6rem'
            }}
          >
            <span style={{ fontSize: '2rem', color: '#D97706', userSelect: 'none' }}>🌿</span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.85rem)',
                fontWeight: 900,
                color: '#0B2356',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Official Internship Goodies
            </h1>
            <span style={{ fontSize: '2rem', color: '#D97706', userSelect: 'none', transform: 'scaleX(-1)' }}>🌿</span>
          </div>

          {/* Subtitle Pill */}
          <div style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <span
              style={{
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
                padding: '0.45rem 1.35rem',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                fontWeight: 700
              }}
            >
              Exclusive PRMA Tech Merchandise for Our Interns
            </span>
          </div>

          {/* 100% Free Internship Callout Box */}
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              borderRadius: '16px',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              maxWidth: '720px',
              margin: '0 auto',
              textAlign: 'left'
            }}
          >
            <CheckCircle2 size={22} color="#16A34A" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.88rem', color: '#166534', lineHeight: 1.5 }}>
              <strong>100% Free Internship:</strong> Enrollment and joining require zero fees. Goodies are optional merchandise currently in preview mode.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3x3 MERCHANDISE GRID (Strictly Matches Reference Image 3)
          ========================================================================= */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 5rem'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.75rem'
          }}
          className="prma-goodies-3x3-grid"
        >
          {PRMA_GOODIES.map((prod, index) => (
            <div
              key={prod.id}
              onClick={() => openLightbox(index)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E2E8F0',
                padding: '1.65rem',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#93C5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              {/* Image Container with contain fit and white background */}
              <div
                style={{
                  width: '100%',
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  marginBottom: '1.25rem',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.src = '/assets/prma_portal_ref/prma_goodies_showcase_banner.jpg';
                  }}
                />

                {/* Hover inspect hint */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <Maximize2 size={12} />
                  <span>Inspect</span>
                </div>
              </div>

              {/* Product Info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {prod.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#64748B',
                    lineHeight: 1.55,
                    marginBottom: '1.25rem',
                    flex: 1
                  }}
                >
                  {prod.description}
                </p>

                {/* Purple COMING SOON Badge (Strictly Matches Image 3) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 1.15rem',
                      borderRadius: '9999px',
                      backgroundColor: '#7025E8',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      boxShadow: '0 4px 12px rgba(112, 37, 232, 0.25)'
                    }}
                  >
                    <Clock size={14} strokeWidth={2.5} />
                    <span>COMING SOON</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Strip */}
        <div
          style={{
            marginTop: '4rem',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
            borderRadius: '24px',
            padding: '2.5rem 3rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Internship Program
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, marginBottom: '0.35rem' }}>
              Ready to Kickstart Your Tech Journey?
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', maxWidth: '560px' }}>
              100% Free • One Month Duration • Real-World Projects • Verified Certificate & Letter of Recommendation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNav('prma-internships-apply')}
            style={{
              padding: '0.95rem 2.2rem',
              borderRadius: '14px',
              backgroundColor: '#0866F5',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              boxShadow: '0 8px 24px rgba(8, 102, 245, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0052CC';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0866F5';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Apply for Free Internship</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* =========================================================================
          LIGHTBOX / LARGE IMAGE PREVIEW WITH ZOOM & NAVIGATION
          ========================================================================= */}
      {currentProduct && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          {/* Top Control Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              zIndex: 2
            }}
          >
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentProduct.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Product {selectedProductIndex + 1} of {PRMA_GOODIES.length} • Coming Soon
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.7))}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>

              <button
                type="button"
                onClick={closeLightbox}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#EA4335',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Close (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Previous Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevProduct();
            }}
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              transition: 'background-color 0.2s'
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextProduct();
            }}
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              transition: 'background-color 0.2s'
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Main Zoomable Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '85vw',
              maxHeight: '75vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s ease'
            }}
          >
            <img
              src={currentProduct.largeImage || currentProduct.image}
              alt={currentProduct.name}
              style={{
                maxWidth: '100%',
                maxHeight: '65vh',
                objectFit: 'contain',
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s ease'
              }}
            />
          </div>

          {/* Bottom Caption Pill */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: '1.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              padding: '0.45rem 1.25rem',
              color: '#F8FAFC',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <span style={{ color: '#FCD34D' }}>★</span>
            <span>{currentProduct.description}</span>
            <span
              style={{
                backgroundColor: '#7025E8',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}
            >
              COMING SOON
            </span>
          </div>
        </div>
      )}

      <PrmaFooter navigateToTab={navFn} onNavigate={navFn} />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .prma-goodies-3x3-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-goodies-3x3-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
