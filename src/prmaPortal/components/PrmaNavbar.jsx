import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  User,
  ArrowRight,
  ChevronDown,
  Monitor,
  Smartphone,
  Cpu,
  Cloud,
  ShieldCheck,
  BarChart3,
  Palette,
  Code2,
  Megaphone,
  Compass,
  GraduationCap,
  Sparkles,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { usePrmaApplication } from '../context/PrmaApplicationContext';
import { PRMA_SERVICES } from '../data/prmaServices';

export default function PrmaNavbar({ activePage = 'home', navigateToTab, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const { currentUser, logoutUser } = usePrmaApplication();

  const handleNav = (tab) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setSearchModalOpen(false);
    const navFn = navigateToTab || onNavigate;
    if (navFn) {
      navFn(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', route: 'prma-home' },
    { id: 'internships', label: 'Internships', route: 'prma-internships-home' },
    { id: 'services', label: 'Services', route: 'prma-services', hasDropdown: true },
    { id: 'projects', label: 'Projects', route: 'prma-projects' },
    { id: 'about', label: 'About', route: 'prma-about' }
  ];

  return (
    <>
      <header
        className="prma-desktop-header-wrap"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 2px 12px rgba(16, 28, 80, 0.04)',
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        }}
      >
        {/* Top Partnership Banner with ProfessorVirus - High Contrast Bright Visible Pure White Text */}
        <div
          style={{
            backgroundColor: '#070D1E',
            color: '#FFFFFF',
            padding: '0.5rem 1.25rem',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            boxSizing: 'border-box'
          }}
          className="prma-top-announcement-strip"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', margin: '0 auto', color: '#FFFFFF' }}>
            <span
              style={{
                display: 'inline-block',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 10px #10B981',
                flexShrink: 0
              }}
              title="Official Active Status"
            />
            <span style={{ color: '#FFFFFF', letterSpacing: '0.01em', lineHeight: 1.45, fontWeight: 700 }}>
              <strong style={{ color: '#FFFFFF', fontWeight: 900 }}>PRMA Tech™</strong> in Official Partnership with <strong style={{ color: '#FFFFFF', fontWeight: 900 }}>ProfessorVirus</strong> — Practical Technology &amp; Engineering Career Platform
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleNav('home')}
            style={{
              background: 'rgba(251, 191, 36, 0.22)',
              border: '1.5px solid #FBBF24',
              borderRadius: '999px',
              color: '#FDE047',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.85rem',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.35)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.22)';
              e.currentTarget.style.color = '#FDE047';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>←</span>
            <span>Return to ProfessorVirus.site</span>
          </button>
        </div>

        {/* Main Navigation Bar */}
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          {/* Logo */}
          <div
            onClick={() => handleNav('prma-home')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <img
              src="/assets/prma_tech_logo.png"
              alt="PRMA Tech"
              style={{ height: '38px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = '/assets/prma_portal_ref/prma_tech_logo.jpg';
              }}
            />
          </div>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            className="prma-desktop-nav"
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;

              if (item.hasDropdown) {
                return (
                  <div key={item.id} style={{ position: 'relative' }} ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                      style={{
                        padding: '0.55rem 0.95rem',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? '#0866F5' : '#334155',
                        backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        style={{
                          transform: servicesDropdownOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </button>

                    {/* Services Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '-100px',
                          marginTop: '0.5rem',
                          width: '560px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '18px',
                          border: '1.5px solid #E2E8F0',
                          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.12)',
                          padding: '1.25rem',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.65rem',
                          zIndex: 1001
                        }}
                      >
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Technology Services ({PRMA_SERVICES.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleNav('prma-services')}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: '#0866F5',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem'
                            }}
                          >
                            View All Services <ArrowRight size={13} />
                          </button>
                        </div>

                        {PRMA_SERVICES.slice(0, 8).map((srv) => (
                          <div
                            key={srv.id}
                            onClick={() => handleNav('prma-services')}
                            style={{
                              padding: '0.65rem',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#F8FAFC';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: srv.bgLight,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: srv.color,
                                flexShrink: 0
                              }}
                            >
                              <Code2 size={16} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                                {srv.title}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.2 }}>
                                {srv.shortDesc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.route)}
                  style={{
                    position: 'relative',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#0866F5' : '#334155',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#0866F5';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#334155';
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '24px',
                        height: '2.5px',
                        borderRadius: '999px',
                        backgroundColor: '#0866F5'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            className="prma-desktop-actions"
          >
            {/* Quick Search */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              title="Search PRMA Tech"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Search size={18} />
            </button>

            {/* User Chip / Sign Out (No Student Dashboard) */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: '#F1F5F9',
                    color: '#0F172A',
                    border: '1px solid #CBD5E1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <User size={15} color="#0866F5" />
                  {currentUser.name || 'Student'}
                </div>

                <button
                  type="button"
                  onClick={logoutUser}
                  title="Sign Out"
                  style={{
                    padding: '0.55rem',
                    borderRadius: '10px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    color: '#EF4444',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : null}

            {/* Login Button (matches Image 1) */}
            {!currentUser && (
              <button
                type="button"
                onClick={() => handleNav('prma-internships-login')}
                style={{
                  padding: '0.52rem 1.25rem',
                  borderRadius: '999px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0866F5';
                  e.currentTarget.style.color = '#0866F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.color = '#0F172A';
                }}
              >
                Login
              </button>
            )}

            {/* Apply for Internship Primary Button (pill shape matching Image 1) */}
            <button
              type="button"
              onClick={() => handleNav('prma-internships-apply')}
              style={{
                padding: '0.58rem 1.35rem',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: 800,
                backgroundColor: '#0866F5',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(8, 102, 245, 0.35)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0052CC';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0866F5';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>Apply for Internship</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>

            {/* Hamburger button for mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="prma-mobile-hamburger"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.route)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: activePage === item.id ? 800 : 600,
                  color: activePage === item.id ? '#0866F5' : '#1E293B',
                  backgroundColor: activePage === item.id ? '#EFF6FF' : '#F8FAFC',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleNav('prma-internships-login')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleNav('prma-internships-apply')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Apply Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '4rem 1.5rem 1.5rem'
          }}
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <Search size={22} color="#0866F5" />
              <input
                type="text"
                autoFocus
                placeholder="Search PRMA Tech domains, services, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  fontSize: '1.05rem',
                  border: 'none',
                  outline: 'none',
                  color: '#0F172A'
                }}
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '320px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Quick Jump:
              </div>
              {[
                { title: '27 Internship Domains', sub: 'Explore tracks in AI, Full Stack, Cloud...', route: 'prma-internships-domains' },
                { title: '12 Technology Services', sub: 'Web, Mobile, AI/ML, DevOps, Security...', route: 'prma-services' },
                { title: 'Case Studies & Projects', sub: 'Real engineering projects and solutions', route: 'prma-projects' },
                { title: 'Student Welcome Kit & Swag', sub: 'T-Shirts, Smart ID Card, Bottles...', route: 'prma-internships-goodies' }
              ].map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleNav(res.route)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#F8FAFC'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{res.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{res.sub}</div>
                  </div>
                  <ArrowRight size={15} color="#0866F5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles: On mobile viewports (< 1024px), PRMA Tech uses the unified ProfessorVirus MobileHeader & MobileBottomNav */}
      <style>{`
        @media (max-width: 1023px) {
          .prma-desktop-header-wrap {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .prma-desktop-nav {
            display: none !important;
          }
          .prma-desktop-actions > button:not(.prma-mobile-hamburger) {
            display: none !important;
          }
          .prma-mobile-hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
