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
  Shield,
  Cloud,
  Layers,
  Award,
  Zap
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaStepProgress from '../components/PrmaStepProgress';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

// Map icon string names to Lucide icons
const ICON_MAP = {
  Cpu: Cpu,
  BarChart3: Database,
  Cloud: Cloud,
  Code2: Code2,
  Globe: Globe,
  Terminal: Code2,
  Smartphone: Smartphone,
  Layers: Layers,
  Shield: Shield,
  Database: Database,
  Bot: Cpu,
  Search: Search,
  Zap: Zap
};

export default function PrmaDomainsPage({ navigateToTab }) {
  const { selectedDomainId, setSelectedDomainId } = usePrmaApplication();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories list
  const categories = [
    'All',
    'AI & Data',
    'Software & Web',
    'Cloud & Systems',
    'Mobile',
    'Cybersecurity',
    'Core Engineering'
  ];

  // Filtered domains
  const filteredDomains = useMemo(() => {
    return PRMA_DOMAINS.filter(domain => {
      const matchesCategory =
        selectedCategory === 'All' ||
        domain.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Core Engineering' && (domain.category === 'Core Engineering' || domain.category === 'Hardware'));

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        domain.title.toLowerCase().includes(q) ||
        domain.description.toLowerCase().includes(q) ||
        domain.skills.some(s => s.toLowerCase().includes(q)) ||
        domain.technologies.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectDomain = (domainId) => {
    setSelectedDomainId(domainId);
    if (navigateToTab) {
      navigateToTab('prma-internships-apply');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A'
      }}
    >
      <PrmaNavbar navigateToTab={navigateToTab} />
      <PrmaStepProgress currentStep={1} onNavigate={navigateToTab} />

      {/* Hero Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F0F6FF 0%, #FAFAFC 100%)',
          padding: '3rem 1.5rem 2rem',
          textAlign: 'center',
          borderBottom: '1px solid #E2E8F0'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '999px',
              padding: '0.35rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0866F5',
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={16} />
            27 Industry-Recognized Internship Tracks
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              marginBottom: '1rem'
            }}
          >
            Select Your PRMA Tech Internship Domain
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 2rem'
            }}
          >
            Work on production architectures, gain 1:1 mentorship from senior software engineers, build high-impact portfolio projects, and receive an authentic verifiable certificate.
          </p>

          {/* Search bar */}
          <div
            style={{
              maxWidth: '560px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            <Search
              size={18}
              color="#64748B"
              style={{
                position: 'absolute',
                left: '1.1rem',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type="text"
              placeholder="Search by domain, tech stack (e.g. MERN, Python, AWS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem 0.9rem 3rem',
                fontSize: '0.95rem',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                outline: 'none',
                color: '#0F172A'
              }}
            />
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 0.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            scrollbarWidth: 'none'
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#64748B',
              marginRight: '0.5rem'
            }}
          >
            <Filter size={15} /> Tracks:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #0866F5' : '1.5px solid #E2E8F0',
                  backgroundColor: isActive ? '#0866F5' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  boxShadow: isActive ? '0 2px 8px rgba(8, 102, 245, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.5rem' }}>
          Showing <strong>{filteredDomains.length}</strong> of {PRMA_DOMAINS.length} available domains
        </div>
      </section>

      {/* Domains Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredDomains.map((domain) => {
            const isSelected = selectedDomainId === domain.id;
            const IconComponent = ICON_MAP[domain.icon] || Code2;

            return (
              <div
                key={domain.id}
                onClick={() => handleSelectDomain(domain.id)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: isSelected ? '2px solid #0866F5' : '1.5px solid #E2E8F0',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '0 8px 24px rgba(8, 102, 245, 0.12)'
                    : '0 2px 10px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
              >
                {/* Top Badge & Category */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #DBEAFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0866F5'
                      }}
                    >
                      <IconComponent size={24} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px'
                        }}
                      >
                        {domain.category}
                      </span>
                      {domain.badge && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: domain.badge === 'Trending' ? '#FEF3C7' : '#DCFCE7',
                            color: domain.badge === 'Trending' ? '#B45309' : '#15803D',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px'
                          }}
                        >
                          {domain.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Code */}
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      marginBottom: '0.4rem',
                      lineHeight: 1.3
                    }}
                  >
                    {domain.title}
                  </h3>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748B',
                      fontWeight: 600,
                      marginBottom: '0.85rem'
                    }}
                  >
                    CODE: {domain.code} • Popularity: {domain.popularity}
                  </div>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#475569',
                      lineHeight: 1.55,
                      marginBottom: '1.25rem'
                    }}
                  >
                    {domain.description}
                  </p>

                  {/* Tech stack chips */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#64748B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem'
                      }}
                    >
                      Technologies Covered
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {domain.technologies.map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            backgroundColor: '#F8FAFC',
                            color: '#334155',
                            border: '1px solid #E2E8F0',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={15} /> All 8 Durations Available
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDomain(domain.id);
                    }}
                    style={{
                      padding: '0.6rem 1.15rem',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: isSelected ? '#0866F5' : '#0F172A',
                      color: '#FFFFFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    {isSelected ? 'Selected' : 'Apply Now'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Not finding domain banner */}
        <div
          style={{
            marginTop: '3.5rem',
            backgroundColor: '#0F172A',
            borderRadius: '20px',
            padding: '2.5rem',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Award size={36} color="#FBBF24" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.6rem' }}>
            All Domains Include the Official PRMA Tech Internship Package
          </h2>
          <p style={{ maxWidth: '680px', color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Every domain features 1:1 mentor code reviews, production-ready portfolio repositories, verified tamper-proof certificates with QR validation, and optional customized physical welcome kits delivered right to your home.
          </p>
          <button
            onClick={() => handleSelectDomain(PRMA_DOMAINS[0].id)}
            style={{
              padding: '0.85rem 1.75rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              backgroundColor: '#0866F5',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(8, 102, 245, 0.4)'
            }}
          >
            Start with Most Popular Track (AI / ML)
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <PrmaFooter navigateToTab={navigateToTab} />
    </div>
  );
}
