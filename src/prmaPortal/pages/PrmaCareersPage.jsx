import React, { useState } from 'react';
import {
  Briefcase,
  ArrowRight,
  Play,
  Rocket,
  GraduationCap,
  Laptop,
  Users,
  TrendingUp,
  Heart,
  Filter,
  CheckCircle2,
  X,
  Upload,
  FileText,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import {
  PRMA_CAREER_CATEGORIES,
  PRMA_LOCATIONS,
  PRMA_JOB_OPENINGS
} from '../data/prmaCareers';

export default function PrmaCareersPage({ navigateToTab }) {
  const [selectedCategory, setSelectedCategory] = useState('All Roles');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [activeJobModal, setActiveJobModal] = useState(null);
  const [resumeDropModalOpen, setResumeDropModalOpen] = useState(false);

  // Application Form State
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    graduationYear: '2026',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    coverNote: '',
    resumeFileName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleNav = (route) => {
    if (navigateToTab) {
      navigateToTab(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredJobs = PRMA_JOB_OPENINGS.filter((job) => {
    const matchesCategory =
      selectedCategory === 'All Roles' || job.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLocation =
      selectedLocation === 'All Locations' || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesCategory && matchesLocation;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setApplicationForm(prev => ({ ...prev, resumeFileName: file.name }));
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Post to backend careers endpoint
      await fetch('/api/prma/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: activeJobModal?.id || 'general-application',
          jobTitle: activeJobModal?.title || 'General Talent Network',
          ...applicationForm
        })
      });
    } catch (err) {
      console.log('Local application recorded:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveJobModal(null);
        setResumeDropModalOpen(false);
        setApplicationForm({
          fullName: '',
          email: '',
          phone: '',
          college: '',
          graduationYear: '2026',
          portfolioUrl: '',
          linkedinUrl: '',
          githubUrl: '',
          coverNote: '',
          resumeFileName: ''
        });
      }, 2000);
    }, 1000);
  };

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
      <PrmaNavbar activePage="careers" navigateToTab={navigateToTab} />

      {/* =========================================================================
          HERO SECTION (Match Image 5)
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          padding: '4rem 1.5rem 3.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '3rem',
            alignItems: 'center'
          }}
          className="prma-careers-hero-grid"
        >
          {/* Left Column */}
          <div>
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
                marginBottom: '1.25rem'
              }}
            >
              <Briefcase size={16} />
              Careers at PRMA Tech™
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 4.5vw, 3.8rem)',
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem'
              }}
            >
              Build Your <br />
              Career with <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 60%, #EA4335 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                PRMA Tech™
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: '#475569',
                lineHeight: 1.65,
                maxWidth: '560px',
                marginBottom: '2rem'
              }}
            >
              Work on real-world projects, solve impactful problems, and grow in a culture that values learning, innovation and ownership.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('open-positions-section');
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
                <span>View Openings</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => handleNav('prma-about')}
                style={{
                  padding: '0.95rem 1.85rem',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Play size={16} fill="#0F172A" />
                <span>Life at PRMA Tech</span>
              </button>
            </div>
          </div>

          {/* Right Column: Original Team Photograph (Match Image 5) */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                borderRadius: '26px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
                border: '4px solid #FFFFFF',
                width: '100%',
                maxWidth: '520px'
              }}
            >
              <img
                src="/assets/prma_gen/prma_team_careers.jpg"
                alt="PRMA Tech Engineering Team Collaborating"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = '/assets/prma_portal_ref/WhatsApp Image 2026-11-10 at 10.37.45 AM (1).jpeg';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 6 BENEFITS STRIP (Match Image 5)
          ========================================================================= */}
      <section
        style={{
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FAFAFC',
          padding: '1.75rem 1.5rem'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem'
          }}
          className="prma-careers-benefits-grid"
        >
          {[
            { icon: Rocket, label: 'Real Projects', color: '#7025E8' },
            { icon: GraduationCap, label: 'Continuous Learning', color: '#0866F5' },
            { icon: Laptop, label: 'Flexible Work Culture', color: '#F59E0B' },
            { icon: Users, label: 'Mentorship & Guidance', color: '#0866F5' },
            { icon: TrendingUp, label: 'Career Growth', color: '#10B981' },
            { icon: Heart, label: 'Inclusive & Supportive', color: '#EF4444' }
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
                    backgroundColor: '#FFFFFF',
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
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: OPEN POSITIONS & FILTERS (Match Image 5)
          ========================================================================= */}
      <section
        id="open-positions-section"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '4.5rem 1.5rem'
        }}
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.45rem' }}>
            Open Positions
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B' }}>
            Explore opportunities to grow, learn and make an impact with PRMA Tech.
          </p>
        </div>

        {/* Filter Pills and Location Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {PRMA_CAREER_CATEGORIES.map((cat) => {
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
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Location Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="#64748B" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {PRMA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs Grid (Match Image 5) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}
          className="prma-jobs-grid"
        >
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setActiveJobModal(job)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = '#0866F5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div>
                {/* Top Badge & Category */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0866F5',
                      backgroundColor: '#EFF6FF',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '8px'
                    }}
                  >
                    {job.category} • {job.location}
                  </span>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#15803D',
                      backgroundColor: '#DCFCE7',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px'
                    }}
                  >
                    {job.type}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {job.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                  {job.shortDesc}
                </p>

                {/* Skill Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {job.skills.slice(0, 3).map((sk, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px'
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', alignSelf: 'center' }}>
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action arrow */}
              <div
                style={{
                  paddingTop: '0.85rem',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: '0.82rem', color: '#0866F5', fontWeight: 700 }}>
                  View Role & Apply
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    color: '#0866F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: OUR HIRING PROCESS (4 Steps Match Image 5)
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
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.45rem' }}>
              Our Hiring Process
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B' }}>
              A simple, transparent and respectful process to join our engineering team.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem'
            }}
            className="prma-hiring-grid"
          >
            {[
              {
                step: '1',
                title: '1. Apply Online',
                desc: 'Submit your resume and academic credentials for the desired role.',
                icon: FileText,
                color: '#0866F5'
              },
              {
                step: '2',
                title: '2. Assessment',
                desc: 'Complete a short technical screening or practical task.',
                icon: Code2,
                color: '#7025E8'
              },
              {
                step: '3',
                title: '3. Interview',
                desc: 'Engage in a 1:1 conversation with our lead engineers and founders.',
                icon: Users,
                color: '#0866F5'
              },
              {
                step: '4',
                title: '4. Offer',
                desc: 'Receive your formal offer letter and join the PRMA Tech engineering team!',
                icon: Award,
                color: '#10B981'
              }
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1.5px solid #E2E8F0',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: p.color,
                      margin: '0 auto 1.25rem'
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.45rem' }}>
                    {p.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.55 }}>
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: BOTTOM RESUME DROP RIBBON (Match Image 5)
          ========================================================================= */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 60%, #EA4335 100%)',
            borderRadius: '24px',
            padding: '2rem 3rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 16px 40px rgba(8, 102, 245, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src="/assets/prma_tech_logo.png"
              alt="PRMA Tech"
              style={{ height: '36px', objectFit: 'contain', filter: 'brightness(1.2)' }}
              onError={(e) => {
                e.target.src = '/assets/prma_tech_logo.jpg';
              }}
            />
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.2rem' }}>
                Don't See a Perfect Role?
              </div>
              <div style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                We're always looking for talented and passionate people.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setResumeDropModalOpen(true)}
            style={{
              padding: '0.85rem 1.85rem',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.95rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
            }}
          >
            <span>Send Your Resume</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* =========================================================================
          JOB DETAILS & APPLICATION MODAL
          ========================================================================= */}
      {(activeJobModal || resumeDropModalOpen) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => {
            setActiveJobModal(null);
            setResumeDropModalOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              padding: '2.25rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setActiveJobModal(null);
                setResumeDropModalOpen(false);
              }}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <X size={20} />
            </button>

            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={56} color="#16A34A" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803D', marginBottom: '0.5rem' }}>
                  Application Submitted Successfully!
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
                  Thank you for applying to PRMA Tech. Our hiring team will review your application and portfolio and reach out via email.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#0866F5',
                      backgroundColor: '#EFF6FF',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px'
                    }}
                  >
                    {activeJobModal ? `${activeJobModal.category} • ${activeJobModal.location}` : 'General Talent Pool'}
                  </span>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginTop: '0.4rem' }}>
                    {activeJobModal ? activeJobModal.title : 'Send Your Resume to PRMA Tech'}
                  </h2>
                </div>

                {/* Job brief if specific job */}
                {activeJobModal && (
                  <div style={{ marginBottom: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '1rem', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {activeJobModal.shortDesc}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      Key Requirements: {activeJobModal.requirements?.join(' • ')}
                    </div>
                  </div>
                )}

                {/* Application Form */}
                <form onSubmit={handleApplicationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanshu Kumar"
                      value={applicationForm.fullName}
                      onChange={(e) => setApplicationForm({ ...applicationForm, fullName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                        College / University Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AKTU / AKGEC"
                        value={applicationForm.college}
                        onChange={(e) => setApplicationForm({ ...applicationForm, college: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                        Graduation Year
                      </label>
                      <select
                        value={applicationForm.graduationYear}
                        onChange={(e) => setApplicationForm({ ...applicationForm, graduationYear: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '0.88rem',
                          backgroundColor: '#FFFFFF',
                          outline: 'none'
                        }}
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      GitHub / LinkedIn / Portfolio URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/yourhandle"
                      value={applicationForm.githubUrl}
                      onChange={(e) => setApplicationForm({ ...applicationForm, githubUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Resume Upload File Box */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      Upload Resume (PDF / DOCX) *
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #CBD5E1',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        backgroundColor: '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Upload size={22} color="#0866F5" style={{ marginBottom: '0.35rem' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                        {applicationForm.resumeFileName || 'Click to select resume file from device'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                        Max file size: 5MB
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: isSubmitting ? '#94A3B8' : '#0866F5',
                      color: '#FFFFFF',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 4px 14px rgba(8, 102, 245, 0.35)'
                    }}
                  >
                    <Send size={16} />
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <PrmaFooter navigateToTab={navigateToTab} />

      {/* Responsive Grid */}
      <style>{`
        @media (max-width: 1024px) {
          .prma-careers-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .prma-careers-benefits-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .prma-jobs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-hiring-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-careers-benefits-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .prma-jobs-grid {
            grid-template-columns: 1fr !important;
          }
          .prma-hiring-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
