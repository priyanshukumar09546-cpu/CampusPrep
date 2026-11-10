import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  Award,
  Zap,
  Users,
  Briefcase
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaStepProgress from '../components/PrmaStepProgress';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { PRMA_BATCHES, PRMA_DURATIONS } from '../data/prmaBatches';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaApplyWizardPage({ navigateToTab }) {
  const {
    selectedDomain,
    selectedDomainId,
    setSelectedDomainId,
    selectedBatch,
    selectedBatchId,
    setSelectedBatchId,
    selectedDuration,
    selectedDurationId,
    setSelectedDurationId
  } = usePrmaApplication();

  const [domainSearch, setDomainSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Filtered domains in sidebar
  const filteredSidebarDomains = PRMA_DOMAINS.filter(d =>
    d.title.toLowerCase().includes(domainSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(domainSearch.toLowerCase())
  );

  // Filter batches by month if selected
  const months = ['All', 'Nov', 'Dec', 'Jan'];
  const filteredBatches = PRMA_BATCHES.filter(b =>
    selectedMonth === 'All' ? true : b.month === selectedMonth
  );

  // Split durations into Tier 1 and Tier 2
  const tier1Durations = PRMA_DURATIONS.filter(d => d.weeks <= 8);
  const tier2Durations = PRMA_DURATIONS.filter(d => d.weeks > 8);

  const handleContinue = () => {
    if (navigateToTab) {
      navigateToTab('prma-internships-goodies');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A'
      }}
    >
      <PrmaNavbar navigateToTab={navigateToTab} />
      <PrmaStepProgress currentStep={2} onNavigate={navigateToTab} />

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '2rem 1.5rem 5rem'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}
          className="prma-wizard-grid"
        >
          {/* Left Sidebar: Domains switcher */}
          <aside
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1.5px solid #E2E8F0',
              padding: '1.25rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              position: 'sticky',
              top: '90px',
              maxHeight: 'calc(100vh - 120px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Selected Domain
              </div>
              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#0866F5',
                  marginTop: '0.2rem'
                }}
              >
                {selectedDomain?.title || 'Choose Domain'}
              </div>
            </div>

            {/* Quick Search */}
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <Search
                size={15}
                color="#94A3B8"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <input
                type="text"
                placeholder="Switch domain..."
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  outline: 'none',
                  backgroundColor: '#F8FAFC'
                }}
              />
            </div>

            {/* Scrollable list */}
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                paddingRight: '0.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              {filteredSidebarDomains.map((d) => {
                const isActive = d.id === selectedDomainId;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDomainId(d.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF',
                      color: isActive ? '#0866F5' : '#334155',
                      border: isActive ? '1.5px solid #BFDBFE' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.title}
                    </span>
                    {isActive && <Check size={14} color="#0866F5" style={{ flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Main Content */}
          <main>
            {/* Domain Banner Header */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '1.75rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                marginBottom: '2rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: '#EFF6FF',
                        color: '#0866F5',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px'
                      }}
                    >
                      {selectedDomain.category}
                    </span>
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
                      CODE: {selectedDomain.code}
                    </span>
                  </div>

                  <h1
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: 800,
                      color: '#0F172A',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {selectedDomain.title}
                  </h1>

                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '780px' }}>
                    {selectedDomain.description}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    textAlign: 'right'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309' }}>
                    GUARANTEED PERKS
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#78350F' }}>
                    Certificate + 1:1 Mentorship
                  </div>
                </div>
              </div>

              {/* Badges Bar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #F1F5F9'
                }}
              >
                {[
                  { icon: Briefcase, text: 'Real-World Projects' },
                  { icon: Users, text: '1:1 Mentorship' },
                  { icon: Award, text: 'Verified Certificate' },
                  { icon: Sparkles, text: 'Welcome Kit Eligible' },
                  { icon: Zap, text: 'Performance Stipend' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        backgroundColor: '#F8FAFC',
                        color: '#334155',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <Icon size={14} color="#0866F5" />
                      {item.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Section 1: Choose Batch Date */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '1.75rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                marginBottom: '2rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#0866F5',
                      marginBottom: '0.25rem'
                    }}
                  >
                    <Calendar size={17} />
                    STEP 2.1 — AVAILABLE BATCHES
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                    Select Your Starting Batch Date
                  </h2>
                </div>

                {/* Month filter tabs */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {months.map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: selectedMonth === m ? '1.5px solid #0866F5' : '1px solid #CBD5E1',
                        backgroundColor: selectedMonth === m ? '#EFF6FF' : '#FFFFFF',
                        color: selectedMonth === m ? '#0866F5' : '#475569'
                      }}
                    >
                      {m === 'All' ? 'All Months' : `${m} 2026/27`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Batches Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '0.85rem'
                }}
              >
                {filteredBatches.map(batch => {
                  const isSelected = batch.id === selectedBatchId;
                  return (
                    <div
                      key={batch.id}
                      onClick={() => setSelectedBatchId(batch.id)}
                      style={{
                        padding: '0.9rem 0.75rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #0866F5' : '1.5px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        boxShadow: isSelected ? '0 4px 12px rgba(8, 102, 245, 0.15)' : 'none',
                        transition: 'all 0.15s ease',
                        position: 'relative'
                      }}
                    >
                      {batch.isPopular && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#16A34A',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.5rem',
                            borderRadius: '999px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          FAST FILLING
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: isSelected ? '#0866F5' : '#0F172A',
                          marginBottom: '0.2rem'
                        }}
                      >
                        {batch.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                        {batch.month === 'Jan' ? 'January 2027' : `${batch.month} 2026`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Section 2: Choose Duration */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '1.75rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                marginBottom: '2rem'
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#0866F5',
                    marginBottom: '0.25rem'
                  }}
                >
                  <Clock size={17} />
                  STEP 2.2 — PROGRAM DURATION & INVESTMENT
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                  Select Internship Duration Tier
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.25rem' }}>
                  All durations include full curriculum, personal code reviews, and verifiable credential.
                </p>
              </div>

              {/* Tier 1 Header */}
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.75rem'
                }}
              >
                Foundation & Short Programs (2 - 8 Weeks)
              </div>

              {/* Tier 1 Durations Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}
              >
                {tier1Durations.map((dur) => {
                  const isSelected = dur.id === selectedDurationId;
                  return (
                    <div
                      key={dur.id}
                      onClick={() => setSelectedDurationId(dur.id)}
                      style={{
                        borderRadius: '16px',
                        border: isSelected ? '2px solid #0866F5' : '1.5px solid #E2E8F0',
                        backgroundColor: isSelected ? '#F0F7FF' : '#FFFFFF',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 6px 18px rgba(8, 102, 245, 0.12)' : 'none',
                        transition: 'all 0.15s ease',
                        position: 'relative'
                      }}
                    >
                      {dur.badge && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            backgroundColor: dur.badgeColor || '#0866F5',
                            color: '#FFFFFF',
                            display: 'inline-block',
                            marginBottom: '0.5rem'
                          }}
                        >
                          {dur.badge}
                        </span>
                      )}

                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                            {dur.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                            {dur.subText}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0866F5' }}>
                            ₹{dur.price}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                            ₹{dur.originalPrice}
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #E2E8F0' }}>
                        {dur.features.map((feat, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.78rem',
                              color: '#475569',
                              marginBottom: '0.25rem'
                            }}
                          >
                            <CheckCircle2 size={13} color="#16A34A" />
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tier 2 Header */}
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.75rem'
                }}
              >
                Comprehensive & Semester Programs (12 - 36 Weeks)
              </div>

              {/* Tier 2 Durations Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1rem'
                }}
              >
                {tier2Durations.map((dur) => {
                  const isSelected = dur.id === selectedDurationId;
                  return (
                    <div
                      key={dur.id}
                      onClick={() => setSelectedDurationId(dur.id)}
                      style={{
                        borderRadius: '16px',
                        border: isSelected ? '2px solid #0866F5' : '1.5px solid #E2E8F0',
                        backgroundColor: isSelected ? '#F0F7FF' : '#FFFFFF',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 6px 18px rgba(8, 102, 245, 0.12)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {dur.badge && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            backgroundColor: dur.badgeColor || '#0866F5',
                            color: '#FFFFFF',
                            display: 'inline-block',
                            marginBottom: '0.5rem'
                          }}
                        >
                          {dur.badge}
                        </span>
                      )}

                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                            {dur.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                            {dur.subText}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0866F5' }}>
                            ₹{dur.price}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                            ₹{dur.originalPrice}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #E2E8F0' }}>
                        {dur.features.map((feat, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.78rem',
                              color: '#475569',
                              marginBottom: '0.25rem'
                            }}
                          >
                            <CheckCircle2 size={13} color="#16A34A" />
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div
              style={{
                backgroundColor: '#0F172A',
                borderRadius: '18px',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                color: '#FFFFFF',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.25)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                  CURRENT SELECTION
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  {selectedDomain.title} • {selectedDuration.name} ({selectedBatch.date})
                </div>
                <div style={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: 600, marginTop: '0.2rem' }}>
                  Base Program Fee: ₹{selectedDuration.price} (No hidden charges)
                </div>
              </div>

              <button
                onClick={handleContinue}
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
                Continue to Add Goodies (Step 3)
                <ArrowRight size={17} />
              </button>
            </div>
          </main>
        </div>
      </div>

      <PrmaFooter navigateToTab={navigateToTab} />
    </div>
  );
}
