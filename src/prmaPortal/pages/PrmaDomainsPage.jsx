import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Filter,
  Code2,
  Cpu,
  Globe,
  Database,
  Smartphone,
  ShieldCheck,
  Cloud,
  Layers,
  Award,
  Zap,
  Layout,
  Server,
  Terminal,
  Coffee,
  Palette,
  TrendingUp,
  Megaphone,
  Laptop,
  Check,
  X,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { PRMA_DOMAINS, PRMA_CATEGORIES } from '../data/prmaDomains';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

const ICON_MAP = {
  Cpu: Cpu,
  BarChart3: TrendingUp,
  Globe: Globe,
  Layers: Layers,
  Layout: Layout,
  Server: Server,
  Terminal: Terminal,
  Coffee: Coffee,
  Code2: Code2,
  Smartphone: Smartphone,
  Palette: Palette,
  ShieldCheck: ShieldCheck,
  Cloud: Cloud,
  TrendingUp: TrendingUp,
  Database: Database,
  Laptop: Laptop,
  Megaphone: Megaphone
};

export default function PrmaDomainsPage({ navigateToTab, onNavigate }) {
  const { setSelectedDomainId } = usePrmaApplication();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Domains');
  const [detailModalDomain, setDetailModalDomain] = useState(null);

  const navFn = navigateToTab || onNavigate;

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplyForDomain = (domainId) => {
    setSelectedDomainId(domainId);
    handleNav('prma-internships-apply');
  };

  // Filtered domains
  const filteredDomains = useMemo(() => {
    return PRMA_DOMAINS.filter((domain) => {
      const matchesSearch =
        domain.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        domain.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All Domains' || domain.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A',
        overflowX: 'hidden'
      }}
    >
      <PrmaNavbar activePage="domains" navigateToTab={navFn} onNavigate={navFn} />

      {/* =========================================================================
          HERO BANNER (Promoting 100% Free 1-Month Program)
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F0F6FF 0%, #F8FAFC 100%)',
          padding: '3.5rem 1.5rem 2.5rem',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#DCFCE7',
              border: '1.5px solid #BBF7D0',
              color: '#15803D',
              borderRadius: '9999px',
              padding: '0.45rem 1.35rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              marginBottom: '1.25rem',
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.1)'
            }}
          >
            <CheckCircle2 size={18} strokeWidth={2.5} />
            <span>100% FREE INTERNSHIP PROGRAM &bull; ZERO APPLICATION FEE</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 3.25rem)',
              fontWeight: 900,
              color: '#0B2356',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1rem'
            }}
          >
            Explore 18 Industry-Ready Internship Domains
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: '#475569',
              lineHeight: 1.65,
              maxWidth: '720px',
              margin: '0 auto 2.5rem'
            }}
          >
            Every track lasts exactly <strong>One Month</strong> in remote mode. Work on real-world projects, receive expert mentorship, and earn an official verifiable certificate with Letter of Recommendation.
          </p>

          {/* Search Bar */}
          <div
            style={{
              maxWidth: '640px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            <Search
              size={20}
              color="#64748B"
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type="text"
              placeholder="Search by domain, skill (Python, React, AI), or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3.25rem',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          CATEGORY TABS & DOMAIN CARDS GRID
          ========================================================================= */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 1.5rem 5rem'
        }}
      >
        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginBottom: '2.5rem'
          }}
        >
          {PRMA_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '9999px',
                  border: isActive ? 'none' : '1.5px solid #CBD5E1',
                  backgroundColor: isActive ? '#0866F5' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(8, 102, 245, 0.25)' : 'none'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 18 Individual Professional Domain Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.75rem'
          }}
          className="prma-domains-3col-grid"
        >
          {filteredDomains.map((dom) => {
            const IconComponent = ICON_MAP[dom.icon] || Code2;

            return (
              <div
                key={dom.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1.5px solid #E2E8F0',
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
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
                {/* Top Badge: 100% Free & Category */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0866F5'
                    }}
                  >
                    <IconComponent size={26} strokeWidth={2.2} />
                  </div>

                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em'
                    }}
                  >
                    100% FREE &bull; 1 MONTH
                  </span>
                </div>

                {/* Domain Title */}
                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    color: '#0F172A',
                    marginBottom: '0.55rem',
                    lineHeight: 1.3
                  }}
                >
                  {dom.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#64748B',
                    lineHeight: 1.6,
                    marginBottom: '1.25rem',
                    flex: 1
                  }}
                >
                  {dom.description}
                </p>

                {/* Practical Project Badge */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0866F5', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Practical Capstone Project
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>
                    {dom.project}
                  </div>
                </div>

                {/* Skills Chips */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                    Skills Covered
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {dom.skills.slice(0, 4).map((sk, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: '#F1F5F9',
                          color: '#334155',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: View Details & Apply Now */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setDetailModalDomain(dom)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyForDomain(dom.id)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#0866F5',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 4px 14px rgba(8, 102, 245, 0.25)'
                    }}
                  >
                    <span>Apply Free</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          DOMAIN DETAIL MODAL
          ========================================================================= */}
      {detailModalDomain && (
        <div
          onClick={() => setDetailModalDomain(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setDetailModalDomain(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            <span
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}
            >
              100% FREE &bull; 1 MONTH DURATION
            </span>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0B2356', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              {detailModalDomain.title}
            </h2>

            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {detailModalDomain.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0866F5', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Real-World Practical Project
                </strong>
                <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 700 }}>
                  {detailModalDomain.project}
                </span>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Core Technologies & Tools
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {detailModalDomain.technologies.map((t, i) => (
                    <span key={i} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Key Learning Outcomes
                </strong>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {detailModalDomain.outcomes.map((out, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{out}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDetailModalDomain(null)}
                style={{
                  padding: '0.85rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setDetailModalDomain(null);
                  handleApplyForDomain(detailModalDomain.id);
                }}
                style={{
                  padding: '0.85rem 1.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(8, 102, 245, 0.3)'
                }}
              >
                <span>Apply for this Track (Free)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <PrmaFooter navigateToTab={navFn} onNavigate={navFn} />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .prma-domains-3col-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-domains-3col-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
