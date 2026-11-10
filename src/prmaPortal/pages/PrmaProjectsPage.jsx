import React, { useState } from 'react';
import {
  Code2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Globe,
  Users
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { PRMA_PROJECT_CATEGORIES, PRMA_PROJECTS } from '../data/prmaProjects';

export default function PrmaProjectsPage({ navigateToTab }) {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');

  const handleNav = (route) => {
    if (navigateToTab) {
      navigateToTab(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredProjects = PRMA_PROJECTS.filter((proj) => {
    return selectedCategory === 'All Projects' || proj.category === selectedCategory;
  });

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
      <PrmaNavbar activePage="projects" navigateToTab={navigateToTab} />

      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          padding: '4rem 1.5rem 3rem',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#0866F5',
              borderRadius: '999px',
              padding: '0.4rem 1.15rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={16} />
            Case Studies & Portfolio
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1rem'
            }}
          >
            Our Work & Real-World Projects
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto'
            }}
          >
            Discover high-impact applications, cloud architectures, and machine learning pipelines engineered by PRMA Tech and our student engineering cohorts.
          </p>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
        >
          {PRMA_PROJECT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '999px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #0866F5' : '1.5px solid #E2E8F0',
                  backgroundColor: isActive ? '#0866F5' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  boxShadow: isActive ? '0 4px 12px rgba(8, 102, 245, 0.25)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '1rem 1.5rem 5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem'
          }}
          className="prma-projects-grid"
        >
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E2E8F0',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Header tags */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#0866F5',
                      backgroundColor: '#EFF6FF',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '8px'
                    }}
                  >
                    {proj.category} • {proj.client}
                  </span>

                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#15803D',
                      backgroundColor: '#DCFCE7',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '8px'
                    }}
                  >
                    {proj.impact}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                  {proj.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {proj.fullDesc}
                </p>

                {/* Metrics Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '14px',
                    padding: '1rem',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  {proj.metrics.map((m, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0866F5' }}>{m.value}</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Key Engineering Highlights:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {proj.highlights.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#334155' }}>
                        <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0 }} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
                  {proj.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: '#F1F5F9',
                        color: '#0F172A',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
                  Sprint Cycle: {proj.duration}
                </div>

                {proj.liveUrl !== '#' ? (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '10px',
                      backgroundColor: '#0866F5',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <span>View Live Product</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNav('prma-contact')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '10px',
                      backgroundColor: '#F1F5F9',
                      color: '#0F172A',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      border: '1px solid #CBD5E1',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Request Case Study Deck</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #172554 100%)',
            borderRadius: '24px',
            padding: '3rem',
            color: '#FFFFFF',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            Have a Technical Product or Software Project in Mind?
          </h2>
          <p style={{ fontSize: '1rem', color: '#93C5FD', maxWidth: '640px', margin: '0 auto 2rem' }}>
            Partner with PRMA Tech to architect, build, and deploy production-ready web, mobile, and AI solutions with guaranteed milestones.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleNav('prma-services')}
              style={{
                padding: '0.9rem 2rem',
                borderRadius: '12px',
                backgroundColor: '#0866F5',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <span>Explore All 12 Services</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleNav('prma-contact')}
              style={{
                padding: '0.9rem 1.85rem',
                borderRadius: '12px',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer'
              }}
            >
              Contact Our Engineers
            </button>
          </div>
        </div>
      </section>

      <PrmaFooter navigateToTab={navigateToTab} />

      <style>{`
        @media (max-width: 900px) {
          .prma-projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
