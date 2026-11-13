import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  X,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  FileText
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaDomainIcon from '../components/PrmaDomainIcon';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { usePrmaApplication } from '../context/PrmaApplicationContext';
import '../styles/prmaInternship.css';

export default function PrmaDomainsPage({ navigateToTab, onNavigate }) {
  const { setSelectedDomainId } = usePrmaApplication();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tracks');
  const [detailModalDomain, setDetailModalDomain] = useState(null);

  const navFn = navigateToTab || onNavigate;

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplyForDomain = (domain) => {
    setSelectedDomainId(domain.id);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('prma_selected_domain_id', domain.id);
      window.sessionStorage.setItem('prma_selected_domain_title', domain.title);
    }
    handleNav('prma-internships-apply');
  };

  const categories = useMemo(() => {
    const cats = new Set(PRMA_DOMAINS.map(d => d.category));
    return ['All Tracks', ...Array.from(cats)];
  }, []);

  // Filtered domains
  const filteredDomains = useMemo(() => {
    return PRMA_DOMAINS.filter((domain) => {
      const matchesSearch =
        domain.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        domain.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All Tracks' || domain.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="prma-portal-wrap">
      <PrmaNavbar activeTab="internships" onNavigate={navFn} navigateToTab={navFn} />

      {/* TOP HERO ANNOUNCEMENT BANNER */}
      <section className="prma-hero-banner">
        <div className="prma-hero-inner">
          <div className="prma-brand-pill">
            <Sparkles size={14} color="#FBBF24" />
            <span>PRMA Tech™ Official Internship Initiative</span>
          </div>

          <h1 className="prma-hero-title">
            Industry-Ready Remote Internship Program
          </h1>

          <p className="prma-hero-subtitle">
            PRMA Tech is committed to empowering college students with production-grade practical skills, weekly mentor code reviews, and authentic credentials recognized by hiring teams.
          </p>

          {/* 4 Feature Highlights */}
          <div className="prma-highlights-row">
            <div className="prma-highlight-chip featured">
              <div className="prma-chip-icon">₹0</div>
              <div>
                <div className="prma-chip-title">Zero Application Fee</div>
                <div className="prma-chip-sub">100% Free Program</div>
              </div>
            </div>

            <div className="prma-highlight-chip">
              <div className="prma-chip-icon">
                <FileText size={16} />
              </div>
              <div>
                <div className="prma-chip-title">Official Joining Letter</div>
                <div className="prma-chip-sub">Issued Upon Selection</div>
              </div>
            </div>

            <div className="prma-highlight-chip">
              <div className="prma-chip-icon">
                <Clock size={16} />
              </div>
              <div>
                <div className="prma-chip-title">1 Month &bull; Remote</div>
                <div className="prma-chip-sub">Self-Paced Flexible</div>
              </div>
            </div>

            <div className="prma-highlight-chip">
              <div className="prma-chip-icon">
                <Award size={16} />
              </div>
              <div>
                <div className="prma-chip-title">Verified Certificate</div>
                <div className="prma-chip-sub">MSME Registered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG CONTAINER */}
      <main className="prma-catalog-container">
        {/* Controls: Search & Category Filter */}
        <div className="prma-catalog-controls">
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#881337', display: 'block', marginBottom: '2px' }}>
              Step 1 of 2 &bull; Choose Domain
            </span>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              27 Industry Internship Tracks ({filteredDomains.length} Available)
            </h2>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search domains, skills, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="prma-input"
              style={{ paddingLeft: '36px', paddingRight: searchQuery ? '36px' : '14px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="prma-category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`prma-category-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 27 Domains Grid */}
        <div className="prma-catalog-grid">
          {filteredDomains.map((domain) => (
            <div
              key={domain.id}
              className="prma-catalog-card"
            >
              <div>
                {/* Top Row: Icon + Badges */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${domain.color || '#881337'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PrmaDomainIcon iconType={domain.iconType} className="w-8 h-8" color={domain.color} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className="prma-card-badge-free">100% Free</span>
                    <span className="prma-card-badge-mode">Remote &bull; 1 Mo</span>
                  </div>
                </div>

                {/* Title & Category */}
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem', lineHeight: 1.3 }}>
                  {domain.title}
                </h3>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#881337', marginBottom: '0.5rem' }}>
                  {domain.category}
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.55, margin: '0 0 0.85rem' }}>
                  {domain.description}
                </p>

                {/* Technologies Covered */}
                <div className="prma-tech-tags-wrap">
                  {domain.technologies.slice(0, 5).map((tech, idx) => (
                    <span key={idx} className="prma-tech-tag">
                      {tech}
                    </span>
                  ))}
                  {domain.technologies.length > 5 && (
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', alignSelf: 'center', fontWeight: 600 }}>
                      +{domain.technologies.length - 5}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="prma-card-actions">
                <button
                  type="button"
                  onClick={() => setDetailModalDomain(domain)}
                  className="prma-btn-syllabus"
                  aria-label={`View syllabus for ${domain.title}`}
                >
                  <BookOpen size={14} />
                  <span>Syllabus</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyForDomain(domain)}
                  className="prma-btn-apply-card"
                >
                  <span>Apply for Track</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* DETAIL SYLLABUS MODAL */}
      {detailModalDomain && (
        <div className="prma-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setDetailModalDomain(null); }}>
          <div className="prma-modal-window">
            <div className="prma-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${detailModalDomain.color || '#881337'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PrmaDomainIcon iconType={detailModalDomain.iconType} className="w-6 h-6" color={detailModalDomain.color} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{detailModalDomain.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>1 Month &bull; Remote &bull; Zero Application Fee</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalDomain(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '6px' }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="prma-modal-body">
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {detailModalDomain.description}
              </p>

              {/* Technologies */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', display: 'block', marginBottom: '0.45rem' }}>
                  Technologies &amp; Frameworks
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {detailModalDomain.technologies.map((t, i) => (
                    <span key={i} style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', background: '#F1F5F9', border: '1px solid #E2E8F0', fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capstone Project */}
              <div style={{ background: '#FFF1F2', border: '1.5px solid #FECDD3', borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#881337', display: 'block', marginBottom: '0.25rem' }}>
                  Capstone Practical Project
                </span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#70102B', fontWeight: 600, lineHeight: 1.45 }}>
                  {detailModalDomain.project}
                </p>
              </div>

              {/* Learning Outcomes */}
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', display: 'block', marginBottom: '0.45rem' }}>
                  Key Skills You Will Master
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {detailModalDomain.skills.map((skill, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0 }} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.35rem', borderTop: '1.5px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: '#F8FAFC' }}>
              <button
                type="button"
                onClick={() => setDetailModalDomain(null)}
                style={{ padding: '0.55rem 1.15rem', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = detailModalDomain;
                  setDetailModalDomain(null);
                  handleApplyForDomain(d);
                }}
                className="prma-btn-apply-card"
                style={{ flex: 'initial', padding: '0.55rem 1.35rem' }}
              >
                <span>Select &amp; Apply for Free</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      <PrmaFooter />
    </div>
  );
}
