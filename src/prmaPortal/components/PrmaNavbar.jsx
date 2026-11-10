import React, { useState } from 'react';
import {
  Menu,
  X,
  User,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Briefcase,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaNavbar({ activePage, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logoutUser } = usePrmaApplication();

  const handleNav = (route) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'landing', label: 'Home', route: 'prma-internships-home' },
    { id: 'domains', label: 'Domains', route: 'prma-internships-domains' },
    { id: 'apply', label: 'Apply', route: 'prma-internships-apply' },
    { id: 'goodies', label: 'Goodies', route: 'prma-internships-goodies' },
    { id: 'dashboard', label: 'Dashboard', route: 'prma-internships-dashboard' }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 10px rgba(16, 28, 80, 0.04)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}
    >
      {/* Top Banner Notice: Partnership with ProfessorVirus */}
      <div
        style={{
          backgroundColor: '#101C50',
          color: '#FFFFFF',
          padding: '0.35rem 1rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#079B45'
          }} />
          <span>Official Industry Internship Portal — Verified by PRMA Tech™ & ProfessorVirus</span>
        </div>
        <button
          type="button"
          onClick={() => handleNav('home')}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFB800',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: 0
          }}
        >
          <ArrowLeft size={12} />
          <span>Back to Main Portal</span>
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0.65rem clamp(1rem, 2.5vw, 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Left: PRMA Tech Official Logo */}
        <div
          onClick={() => handleNav('prma-internships-home')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <img
            src="/assets/prma_tech_logo.png"
            alt="PRMA Tech Official Logo"
            style={{
              height: '34px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem'
          }}
          className="prma-desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activePage === link.id || activePage === link.route;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNav(link.route)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#0866F5' : '#334155',
                  cursor: 'pointer',
                  padding: '0.35rem 0',
                  position: 'relative',
                  transition: 'color 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0866F5'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#334155'; }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      right: 0,
                      height: '2.5px',
                      backgroundColor: '#0866F5',
                      borderRadius: '9999px'
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Login / User & Apply CTA) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
          className="prma-desktop-nav"
        >
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => handleNav('prma-internships-dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#101C50',
                  cursor: 'pointer'
                }}
              >
                <User size={15} color="#0866F5" />
                <span>{currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'My Account'}</span>
              </button>
              <button
                type="button"
                onClick={logoutUser}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.82rem',
                  color: '#64748B',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleNav('prma-internships-login')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#101C50',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0866F5';
                e.currentTarget.style.color = '#0866F5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.color = '#101C50';
              }}
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() => handleNav('prma-internships-apply')}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(8, 102, 245, 0.28)',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(8, 102, 245, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(8, 102, 245, 0.28)';
            }}
          >
            <span>Apply Now</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="prma-mobile-btn"
          style={{
            background: 'none',
            border: 'none',
            color: '#101C50',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
          }}
          className="prma-mobile-drawer"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.route)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.65rem 0.5rem',
                border: 'none',
                background: 'none',
                fontSize: '0.95rem',
                fontWeight: activePage === link.route ? 800 : 600,
                color: activePage === link.route ? '#0866F5' : '#1E293B',
                cursor: 'pointer'
              }}
            >
              {link.label}
            </button>
          ))}

          <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '0.25rem 0' }} />

          <button
            type="button"
            onClick={() => handleNav('prma-internships-apply')}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>Apply for Internship</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={() => handleNav(currentUser ? 'prma-internships-dashboard' : 'prma-internships-login')}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              backgroundColor: '#F1F5F9',
              color: '#101C50',
              border: '1px solid #CBD5E1',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {currentUser ? 'My Dashboard' : 'Student Login / Register'}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .prma-desktop-nav {
            display: none !important;
          }
          .prma-mobile-btn {
            display: block !important;
          }
        }
        @media (min-width: 861px) {
          .prma-mobile-btn {
            display: none !important;
          }
          .prma-mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}