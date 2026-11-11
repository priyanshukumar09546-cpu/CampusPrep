import React, { useState } from 'react';
import {
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
  ArrowRight,
  CheckCircle2,
  X,
  MessageCircle,
  Clock,
  Layers,
  Send,
  HelpCircle,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { PRMA_SERVICES } from '../data/prmaServices';

const ICON_MAP = {
  Monitor: Monitor,
  Smartphone: Smartphone,
  Cpu: Cpu,
  Cloud: Cloud,
  ShieldCheck: ShieldCheck,
  BarChart3: BarChart3,
  Palette: Palette,
  Code2: Code2,
  Megaphone: Megaphone,
  Compass: Compass,
  GraduationCap: GraduationCap
};

export default function PrmaServicesPage({ navigateToTab }) {
  const [selectedService, setSelectedService] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectScope: '',
    budget: '₹25,000 – ₹50,000'
  });
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const handleNav = (route) => {
    if (navigateToTab) {
      navigateToTab(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryModalOpen(false);
      setSelectedService(null);
    }, 2000);
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
      <PrmaNavbar activePage="services" navigateToTab={navigateToTab} />

      {/* Header Section (Match Image 3) */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          padding: '4rem 1.5rem 3rem',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <img
            src="/assets/prma_portal_ref/prma_tech_logo.jpg"
            alt="PRMA Tech"
            style={{ height: '42px', objectFit: 'contain', margin: '0 auto 1.25rem', display: 'block' }}
            onError={(e) => {
              e.target.src = '/assets/prma_tech_logo.png';
            }}
          />

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1rem'
            }}
          >
            Our Services
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
            Complete technology solutions to build, launch and grow your digital presence.
          </p>
        </div>
      </section>

      {/* 12 Services Grid (Exact 12 Cards from Image 3) */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '1rem 1.5rem 5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}
          className="prma-services-grid"
        >
          {PRMA_SERVICES.map((srv) => {
            const Icon = ICON_MAP[srv.icon] || Code2;
            return (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #E2E8F0',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = srv.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  {/* Icon Box */}
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      backgroundColor: srv.bgLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: srv.color,
                      marginBottom: '1.25rem'
                    }}
                  >
                    <Icon size={26} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      marginBottom: '0.5rem',
                      lineHeight: 1.3
                    }}
                  >
                    {srv.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#64748B',
                      lineHeight: 1.55,
                      marginBottom: '1.5rem'
                    }}
                  >
                    {srv.shortDesc}
                  </p>
                </div>

                {/* Arrow Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: srv.bgLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: srv.color
                    }}
                  >
                    <ArrowRight size={17} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Corporate Trust Ribbon (Match Bottom of Image 3) */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #172554 100%)',
            borderRadius: '24px',
            padding: '2rem 3rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.2)'
          }}
        >
          {/* Logo on Ribbon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/assets/prma_portal_ref/prma_tech_logo.jpg"
              alt="PRMA Tech"
              style={{ height: '36px', objectFit: 'contain', filter: 'brightness(1.15)' }}
              onError={(e) => {
                e.target.src = '/assets/prma_tech_logo.png';
              }}
            />
          </div>

          {/* 5 Value Pillars */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2.5rem'
            }}
          >
            {[
              { icon: Rocket, label: 'End-to-End Solutions' },
              { icon: Shield, label: 'Secure & Reliable' },
              { icon: Zap, label: 'Scalable & Flexible' },
              { icon: Users, label: 'Expert Team' },
              { icon: Clock, label: '24/7 Support' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#93C5FD'
                    }}
                  >
                    <Icon size={17} />
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#E2E8F0' }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {selectedService && (
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
          onClick={() => setSelectedService(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              padding: '2.25rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: selectedService.bgLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedService.color
                }}
              >
                <Code2 size={26} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: selectedService.color
                  }}
                >
                  PRMA Tech Enterprise Solution
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginTop: '0.1rem' }}>
                  {selectedService.title}
                </h2>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedService.fullDesc}
            </p>

            {/* Key Capabilities */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                Key Capabilities & Features:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {selectedService.capabilities.map((cap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                Technology Stack:
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedService.technologies.map((tech, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      backgroundColor: '#F1F5F9',
                      color: '#0F172A',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverables & Timeline */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                padding: '1.15rem',
                border: '1px solid #E2E8F0',
                marginBottom: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>TYPICAL DELIVERY TIMELINE</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0866F5', marginTop: '0.2rem' }}>
                  {selectedService.typicalTimeline}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>WARRANTY / SLA</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#16A34A', marginTop: '0.2rem' }}>
                  30-Day Free Post-Launch Support
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(8, 102, 245, 0.35)'
                }}
              >
                <span>Request Project Proposal</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    `https://wa.me/917668016628?text=Hi%20PRMA%20Tech%2C%20I%20am%20interested%20in%20your%20${encodeURIComponent(selectedService.title)}%20services.`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
                style={{
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  border: '1.5px solid #BBF7D0',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <MessageCircle size={17} />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Proposal Inquiry Modal Form */}
      {inquiryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 2500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setInquiryModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '540px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInquiryModalOpen(false)}
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

            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.35rem' }}>
              Project Scope Inquiry
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Service: <strong>{selectedService?.title || 'Technology Solutions'}</strong>
            </p>

            {inquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} color="#16A34A" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803D', marginBottom: '0.4rem' }}>
                  Inquiry Received!
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569' }}>
                  Our technical lead will review your project brief and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
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
                      placeholder="name@company.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Project Brief / Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what you're building..."
                    value={inquiryForm.projectScope}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, projectScope: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.88rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    backgroundColor: '#0866F5',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <Send size={16} /> Submit Project Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <PrmaFooter navigateToTab={navigateToTab} />

      {/* Responsive Grid */}
      <style>{`
        @media (max-width: 1024px) {
          .prma-services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prma-services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
