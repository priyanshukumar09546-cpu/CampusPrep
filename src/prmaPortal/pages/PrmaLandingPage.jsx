import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Gift,
  Code2,
  Users,
  Award,
  CheckCircle2,
  Clock,
  GraduationCap,
  Laptop,
  Trophy,
  Search,
  Filter,
  Check,
  X,
  Target,
  Eye,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaDomainIcon from '../components/PrmaDomainIcon';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaLandingPage({ navigateToTab, onNavigate }) {
  const { setSelectedDomainId } = usePrmaApplication();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);

  const navFn = navigateToTab || onNavigate;

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplyForDomain = (domain) => {
    try {
      if (typeof setSelectedDomainId === 'function') {
        setSelectedDomainId(domain.id);
      }
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('prma_selected_domain_id', domain.id);
        window.sessionStorage.setItem('prma_selected_domain_title', domain.title);
      }
    } catch (err) {
      console.warn('Domain selection storage warning:', err);
    }
    handleNav('prma-internships-apply');
  };

  // Categories safely extracted from PRMA_DOMAINS
  const categories = useMemo(() => {
    if (!Array.isArray(PRMA_DOMAINS)) return ['All'];
    const cats = new Set(PRMA_DOMAINS.map(d => d.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filtered domains list with defensive null-checks
  const filteredDomains = useMemo(() => {
    if (!Array.isArray(PRMA_DOMAINS)) return [];
    return PRMA_DOMAINS.filter((domain) => {
      if (!domain) return false;
      const q = (searchQuery || '').toLowerCase().trim();
      const matchesSearch =
        !q ||
        (domain.title && domain.title.toLowerCase().includes(q)) ||
        (domain.description && domain.description.toLowerCase().includes(q)) ||
        (Array.isArray(domain.technologies) && domain.technologies.some(t => t && String(t).toLowerCase().includes(q))) ||
        (Array.isArray(domain.skills) && domain.skills.some(s => s && String(s).toLowerCase().includes(q)));

      const matchesCat =
        selectedCategory === 'All' || domain.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Goodies List for the showcase
  const goodiesList = [
    {
      id: 'tshirt',
      name: 'PRMA Tech™ T-Shirt',
      category: 'Apparel',
      image: '/assets/prma_goodies/prma_tshirt_real.jpg',
      description: '100% bio-washed cotton round neck black tee with PRMA Tech™ silicone screen-printed emblem.'
    },
    {
      id: 'mug',
      name: 'Ceramic Coffee Mug',
      category: 'Drinkware',
      image: '/assets/prma_goodies/prma_mug_real.jpg',
      description: '350ml high-gloss ceramic coffee mug with dual-sided full-color PRMA Tech logo.'
    },
    {
      id: 'bottle',
      name: 'Insulated Water Bottle',
      category: 'Drinkware',
      image: '/assets/prma_goodies/prma_bottle_real.jpg',
      description: '750ml double-walled vacuum insulated stainless steel flask with laser-engraved branding.'
    },
    {
      id: 'notebook',
      name: 'Hardcover Tech Notebook',
      category: 'Stationery',
      image: '/assets/prma_goodies/prma_notebook_real.jpg',
      description: 'A5 hardbound 160-page dotted engineering diary with gold foil PRMA Tech logo.'
    },
    {
      id: 'id-card',
      name: 'Intern ID Card & Lanyard',
      category: 'Credentials',
      image: '/assets/prma_goodies/prma_id_card_real.jpg',
      description: 'Official verified intern identification card with QR verification badge and satin blue lanyard.'
    },
    {
      id: 'stickers',
      name: 'Die-Cut Tech Stickers Pack',
      category: 'Merchandise',
      image: '/assets/prma_goodies/prma_stickers_real.jpg',
      description: 'Set of 6 high-durability vinyl waterproof laptop stickers featuring PRMA Tech icons.'
    },
    {
      id: 'cap',
      name: 'Embroidered Tech Cap',
      category: 'Apparel',
      image: '/assets/prma_goodies/prma_cap_real.jpg',
      description: 'Structured 6-panel breathable black cotton baseball cap with multi-color PRMA 3D embroidery.'
    },
    {
      id: 'box',
      name: 'Official Welcome Box',
      category: 'Packaging',
      image: '/assets/prma_goodies/prma_welcome_box_real.jpg',
      description: 'Custom magnetic-closure matte black presentation box with embossed PRMA Tech branding.'
    }
  ];

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
      <PrmaNavbar activePage="internships" navigateToTab={navigateToTab} onNavigate={onNavigate} />

      {/* =========================================================================
          HERO SECTION (Match Image 2)
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          padding: '3.5rem 1.5rem 2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '3rem',
            alignItems: 'center'
          }}
          className="prma-internships-hero-grid"
        >
          {/* Left Hero Column */}
          <div>
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#F3E8FF',
                border: '1px solid #E9D5FF',
                color: '#7025E8',
                borderRadius: '999px',
                padding: '0.4rem 1.15rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.5rem'
              }}
            >
              <GraduationCap size={16} />
              PRMA Tech Internship Program
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem'
              }}
            >
              Choose Your <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #0866F5 0%, #2563EB 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                Internship Domain
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: '#475569',
                lineHeight: 1.65,
                maxWidth: '560px',
                marginBottom: '2rem'
              }}
            >
              Explore a wide range of industry-relevant internship domains and pick the one that matches your interest, skills, and career goals.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.5rem'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('select-domain-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '0.95rem 2rem',
                  borderRadius: '14px',
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 8px 24px rgba(8, 102, 245, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Select Domain</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => handleNav('prma-internships-apply')}
                style={{
                  padding: '0.95rem 1.85rem',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Apply for Internship
              </button>
            </div>
          </div>

          {/* Right Hero Visual (Match Image 2 Merchandise Showcase) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Colorful Organic Glow Behind Image */}
            <div
              style={{
                position: 'absolute',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #0866F5 0%, #EA4335 45%, #FFBD12 70%, #079B45 100%)',
                filter: 'blur(70px)',
                opacity: 0.22,
                zIndex: 0
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '520px',
                borderRadius: '26px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.16)',
                border: '4px solid #FFFFFF'
              }}
            >
              <img
                src="/assets/prma_gen/prma_welcome_kit_hero.jpg"
                alt="PRMA Tech Official Welcome Kit Showcase"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>

        {/* 6-Item Value Indicators Ribbon (Exact Match Image 2) */}
        <div
          style={{
            maxWidth: '1360px',
            margin: '2.5rem auto 0',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '20px',
            padding: '1.15rem 1.75rem',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem',
            alignItems: 'center'
          }}
          className="prma-value-ribbon-grid"
        >
          {[
            { icon: Laptop, text: '100% Remote Internship', color: '#0866F5' },
            { icon: Code2, text: 'Real-World Projects', color: '#7025E8' },
            { icon: Users, text: 'Expert Mentorship', color: '#0866F5' },
            { icon: Award, text: 'Internship Certificate', color: '#F59E0B' },
            { icon: Gift, text: 'Custom Goodies', color: '#EA4335' },
            { icon: Trophy, text: 'Top 20% Stipend', color: '#10B981' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    flexShrink: 0
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    lineHeight: 1.25
                  }}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          ANNOUNCEMENT: LEARNING OPPORTUNITIES WITHOUT FINANCIAL BARRIERS
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '24px',
            padding: '2.5rem',
            color: '#FFFFFF',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                border: '1.5px solid #10B981',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 900,
                flexShrink: 0
              }}
            >
              ₹0
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#34D399',
                  marginBottom: '0.4rem'
                }}
              >
                <CheckCircle2 size={15} />
                ZERO FINANCIAL BARRIER &bull; STARTUP INITIATIVE
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                  fontWeight: 900,
                  marginBottom: '0.65rem'
                }}
              >
                Learning Opportunities Without Financial Barriers
              </h2>

              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#CBD5E1',
                  lineHeight: 1.6,
                  maxWidth: '920px',
                  marginBottom: '1.25rem'
                }}
              >
                PRMA Tech is an emerging technology startup committed to democratizing practical software engineering. All our 1-month remote internship tracks are completely free of charge. No application fee, no enrollment charge, and zero hidden costs.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem'
                }}
              >
                {[
                  '100% Free Application (₹0 Fee)',
                  'Fixed 1-Month Project Roadmap',
                  'Live Codebase & Mentorship',
                  'Verifiable Credential & LOR'
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#E2E8F0'
                    }}
                  >
                    <Check size={16} color="#34D399" strokeWidth={3} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: SELECT YOUR INTERNSHIP DOMAIN (Exact 4-Column Grid Match Image 2)
          ========================================================================= */}
      <section
        id="select-domain-section"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '1rem 1.5rem 4.5rem'
        }}
      >
        {/* Section Header with Target/Bullseye Icon & Yellow Underline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7025E8'
                }}
              >
                <Target size={22} strokeWidth={2.5} />
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                  fontWeight: 900,
                  color: '#0F172A',
                  margin: 0
                }}
              >
                Select Your{' '}
                <span
                  style={{
                    borderBottom: '4px solid #FFBD12',
                    paddingBottom: '2px',
                    color: '#0866F5'
                  }}
                >
                  Internship Domain
                </span>
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '680px' }}>
              Choose from 20+ in-demand domains across Tech, Data, Design, Cloud, Mechanical, Civil, and Emerging Technologies.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search domains or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit',
                backgroundColor: '#FAFAFC',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            />
          </div>
        </div>

        {/* Filter Category Chips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '1.75rem'
          }}
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: active ? '1.5px solid #0866F5' : '1.5px solid #E2E8F0',
                  backgroundColor: active ? '#0866F5' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#475569',
                  boxShadow: active ? '0 4px 12px rgba(8, 102, 245, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Domain Cards Grid (4 Columns Match Image 2) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem'
          }}
          className="prma-domains-4col-grid"
        >
          {filteredDomains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => handleApplyForDomain(domain)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '1.4rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#0866F5';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(8, 102, 245, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
              }}
            >
              <div>
                {/* Top Row: Icon + Arrow Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}
                >
                  <PrmaDomainIcon iconType={domain.iconType} className="w-12 h-12" color={domain.color} />

                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0866F5',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Domain Title */}
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.35,
                    marginBottom: '0.65rem',
                    minHeight: '2.7rem'
                  }}
                >
                  {domain.title}
                </h3>

                {/* Description Preview */}
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748B',
                    lineHeight: 1.45,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {domain.description}
                </p>
              </div>

              {/* Bottom Tag & Quick Apply */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid #F1F5F9'
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#15803D',
                    backgroundColor: '#DCFCE7',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px'
                  }}
                >
                  1 Month &bull; ₹0
                </span>

                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#0866F5',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  Apply <ArrowRight size={14} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION: INTERNSHIP DURATION OPTIONS (Fixed 1 Month Structure)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem 4.5rem' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E2E8F0',
            padding: '2rem 2.5rem',
            boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
          className="prma-duration-banner"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0866F5',
                flexShrink: 0
              }}
            >
              <Clock size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.2rem' }}>
                Internship Duration & Program Structure
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                Structured 1-month program designed for high-impact practical learning.
              </p>
            </div>
          </div>

          {/* 4 Pillars of the 1-Month Program */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.25rem',
              flex: 1,
              maxWidth: '780px'
            }}
            className="prma-duration-pillars-grid"
          >
            {[
              { label: 'Duration', val: '1 Month (Fixed)', sub: 'Structured Roadmap' },
              { label: 'Format', val: '100% Remote', sub: 'Flexible Milestones' },
              { label: 'Program Fee', val: '₹0 (Free)', sub: 'Zero Application Fee' },
              { label: 'Outcome', val: 'Certificate + LOR', sub: 'Verifiable Credential' }
            ].map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '0.85rem 1rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  {pillar.label}
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0866F5', margin: '0.2rem 0' }}>
                  {pillar.val}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {pillar.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: OFFICIAL GOODIES SHOWCASE (COMING SOON + LIGHTBOX)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          padding: '4.5rem 1.5rem'
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                color: '#B45309',
                borderRadius: '999px',
                padding: '0.4rem 1.15rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '0.85rem'
              }}
            >
              <Gift size={16} />
              COMING SOON &bull; OFFICIAL PRMA TECH MERCHANDISE
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                color: '#0F172A',
                marginBottom: '0.5rem'
              }}
            >
              PRMA Tech Official Welcome Kit & Goodies
            </h2>

            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
              High-quality branded internship merchandise currently in production. No charges during internship application.
            </p>
          </div>

          {/* 8 Goodies Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem'
            }}
            className="prma-goodies-grid"
          >
            {goodiesList.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.02)';
                }}
              >
                <div>
                  {/* Image Container with Coming Soon Badge */}
                  <div
                    style={{
                      position: 'relative',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      height: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      overflow: 'hidden'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FDE68A',
                        color: '#92400E',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        zIndex: 2
                      }}
                    >
                      COMING SOON
                    </span>

                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        maxHeight: '130px',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                      loading="lazy"
                    />
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                    {item.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {item.description}
                  </p>
                </div>

                {/* Preview Lightbox Button */}
                <button
                  type="button"
                  onClick={() => setLightboxItem(item)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0866F5';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#0866F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.color = '#0F172A';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  <Eye size={16} />
                  <span>Preview Image</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIGHTBOX MODAL FOR GOODIES PREVIEW
          ========================================================================= */}
      {lightboxItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setLightboxItem(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                border: 'none',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Image */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '280px',
                marginBottom: '1.5rem'
              }}
            >
              <img
                src={lightboxItem.image}
                alt={lightboxItem.name}
                style={{
                  maxHeight: '220px',
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                marginBottom: '0.65rem'
              }}
            >
              COMING SOON &bull; NO CHARGES
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.45rem' }}>
              {lightboxItem.name}
            </h3>

            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {lightboxItem.description}
            </p>

            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #DBEAFE',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                fontSize: '0.82rem',
                color: '#1E40AF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Info size={18} style={{ flexShrink: 0 }} />
              <span>Official PRMA Tech merchandise is currently in production and will be available to verified interns. All internship programs remain 100% free with zero charges.</span>
            </div>
          </div>
        </div>
      )}

      <PrmaFooter navigateToTab={navigateToTab} />

      {/* Responsive Breakpoints */}
      <style>{`
        @media (max-width: 1024px) {
          .prma-internships-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .prma-internships-hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .prma-value-ribbon-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .prma-domains-4col-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-duration-pillars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-goodies-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-value-ribbon-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-domains-4col-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-duration-pillars-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-goodies-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
