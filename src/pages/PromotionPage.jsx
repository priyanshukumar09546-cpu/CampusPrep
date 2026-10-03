import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Check, 
  Sparkles, 
  Layout, 
  FileText, 
  Send, 
  Star, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

export default function PromotionPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Advertising & Promotion Plans — ProfessorVirus';
  }, []);

  const WHATSAPP_URL = "https://wa.me/917668016628?text=Hi%20ProfessorVirus%20Team%2C%20I%20am%20interested%20in%20booking%20an%20advertising%20plan%20on%20ProfessorVirus.";

  const openWhatsApp = (planName = '') => {
    const text = planName 
      ? `Hi ProfessorVirus Team, I would like to book the ${planName} advertising plan on ProfessorVirus.`
      : `Hi ProfessorVirus Team, I want to learn more about promotion options on ProfessorVirus.`;
    window.open(`https://wa.me/917668016628?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '₹1,019',
      period: '/week',
      tagline: 'Ideal for trial campaigns & event alerts',
      badge: 'Weekly Trial',
      popular: false,
      features: [
        '1 Prime Website Banner Slot',
        'Placement on Homepage or Subject Directory',
        'Direct Student Audience Reach',
        'Standard Image/GIF creative support',
        'Weekly impressions summary report',
        'Live campaign activation within 24 hours'
      ]
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      price: '₹3,019',
      period: '/month',
      tagline: 'Most effective for edtech apps & brand discovery',
      badge: '★ Most Popular',
      popular: true,
      features: [
        'Prime Homepage & Academic Page Banner Slots',
        '1 Dedicated Sponsored Review Article / Post',
        'High-authority academic do-follow backlink',
        '1 Promotional Broadcast on Telegram Community',
        'Monthly click-through & engagement report',
        'Dedicated account manager support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '₹6,019',
      period: '/month',
      tagline: 'Maximum visibility & multi-channel domination',
      badge: 'High Impact',
      popular: false,
      features: [
        'Multiple Sticky Header & Sidebar Banner Slots',
        'Sponsored Review Article with top-spot indexing',
        'Dual Broadcast: Telegram Channel + WhatsApp Communities',
        'In-article contextual recommendation links',
        'Bi-weekly performance tracking',
        'Priority placement across high-traffic exam seasons'
      ]
    },
    {
      id: 'custom',
      name: 'Custom Enterprise Plan',
      price: "Let's Talk",
      period: '',
      tagline: 'Tailored partnerships for universities & enterprises',
      badge: 'Tailored',
      popular: false,
      features: [
        'Tailored 360° Academic Campus Partnership',
        'Multi-month campaign discount structure',
        'Exclusive category sponsorship (Zero competitor ads)',
        'Custom student contest, hackathon or giveaway hosting',
        'Direct student survey & research access',
        'Dedicated senior growth manager'
      ]
    }
  ];

  const adSpecs = [
    { format: 'Desktop Leaderboard Banner', size: '728 × 90 px', placement: 'Above study content and below navbar', formats: 'PNG, JPG, WEBP (< 250KB)' },
    { format: 'Sticky Sidebar Banner', size: '300 × 250 px', placement: 'Sidebar across Notes, PYQs and Syllabus pages', formats: 'PNG, JPG, WEBP (< 150KB)' },
    { format: 'Mobile App / Sticky Footer', size: '320 × 50 px', placement: 'Fixed bottom strip on smartphone browsers', formats: 'PNG, JPG (< 100KB)' },
    { format: 'Sponsored Review Article', size: '800 - 1500 words', placement: 'Permanent article index with 2 DoFollow links', formats: 'Markdown, HTML, Word' }
  ];

  return (
    <div style={{
      backgroundColor: '#FAF7F2',
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '2.5rem 0 5rem 0'
    }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        
        {/* Back Button */}
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('home') : window.history.back()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2D9C8',
            borderRadius: '9999px',
            padding: '0.5rem 1.15rem',
            color: '#1C1E21',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(35,30,25,0.04)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#781416';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = '#781416';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.color = '#1C1E21';
            e.currentTarget.style.borderColor = '#E2D9C8';
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* HERO HEADER */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E8E2D5',
          borderRadius: '28px',
          padding: 'clamp(2rem, 4vw, 3.5rem)',
          boxShadow: '0 12px 36px rgba(35,30,25,0.05)',
          marginBottom: '3rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '9999px',
            padding: '0.35rem 0.95rem',
            fontSize: '0.76rem',
            fontWeight: 800,
            color: '#C88D2D',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} />
            <span>ADVERTISE ON PROFESSORVIRUS</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
            fontWeight: 900,
            color: '#1C1E21',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            margin: '0 auto 1.25rem auto',
            maxWidth: '820px'
          }}>
            Promote Your Brand, App & Courses to <br />
            <span style={{ color: '#781416' }}>Engineering & College Students</span>
          </h1>

          <p style={{
            fontSize: '1rem',
            color: '#64748B',
            lineHeight: 1.65,
            maxWidth: '720px',
            margin: '0 auto 2rem auto'
          }}>
            Connect directly with ambitious students actively studying, preparing for exams, and looking for placement resources, tools, certifications, and technical jobs across India.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => openWhatsApp('General Inquiry')}
              style={{
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.85rem 1.85rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1EBE5D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
            >
              <MessageCircle size={18} />
              <span>Contact on WhatsApp 7668016628</span>
            </button>
          </div>
        </div>

        {/* PRICING PLANS GRID */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
              fontWeight: 800,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em',
              margin: '0 0 0.45rem 0'
            }}>
              Transparent, High-ROI Advertising Plans
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748B', margin: 0 }}>
              Fixed pricing with guaranteed visibility. Select a plan and connect with our growth team on WhatsApp for instant onboarding.
            </p>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            style={{ alignItems: 'stretch' }}
          >
            {plans.map(p => (
              <div
                key={p.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: p.popular ? '2px solid #C88D2D' : '1.5px solid #E8E2D5',
                  borderRadius: '24px',
                  padding: '2.25rem 1.6rem 2rem 1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: p.popular ? '0 16px 40px rgba(200, 141, 45, 0.16)' : '0 6px 20px rgba(35,30,25,0.04)',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: p.popular ? '#C88D2D' : '#FAF7F2',
                  color: p.popular ? '#FFFFFF' : '#64748B',
                  border: p.popular ? 'none' : '1px solid #E2D9C8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.25rem 0.85rem',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  {p.badge}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem 0' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 1.25rem 0' }}>
                  {p.tagline}
                </p>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  <span style={{
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    color: p.popular ? '#C88D2D' : '#1C1E21',
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                    {p.price}
                  </span>
                  {p.period && (
                    <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 600 }}>
                      {p.period}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', flexGrow: 1 }}>
                  {p.features.map((feat, fidx) => (
                    <div key={fidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.84rem', color: '#475569' }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span style={{ lineHeight: 1.45 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => openWhatsApp(p.name)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: p.popular ? '#C88D2D' : '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: p.popular ? '0 4px 14px rgba(200, 141, 45, 0.25)' : '0 4px 14px rgba(120, 20, 22, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.92';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Book via WhatsApp</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BANNER SPECIFICATIONS TABLE */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E8E2D5',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 4px 20px rgba(35,30,25,0.04)',
          marginBottom: '3.5rem'
        }}>
          <h3 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#1C1E21',
            fontFamily: "'Outfit', sans-serif",
            margin: '0 0 1.25rem 0'
          }}>
            Creative Specifications & Dimensions
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E2D5', color: '#1C1E21', fontWeight: 800 }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Ad Format</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Dimensions</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Placement Area</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Accepted Files</th>
                </tr>
              </thead>
              <tbody>
                {adSpecs.map((spec, sidx) => (
                  <tr key={sidx} style={{ borderBottom: '1px solid #F1ECE1', color: '#475569' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#1C1E21' }}>{spec.format}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 700, color: '#781416' }}>{spec.size}</td>
                    <td style={{ padding: '1rem' }}>{spec.placement}</td>
                    <td style={{ padding: '1rem', color: '#64748B' }}>{spec.formats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GUIDELINES & ETHICS */}
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <ShieldCheck size={28} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400E', margin: '0 0 0.35rem 0' }}>
              Student-Safe Advertising Guidelines
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#78350F', lineHeight: 1.55, margin: 0 }}>
              ProfessorVirus maintains strict ethical standards. We strictly accept promotions relevant to students (educational software, student hackathons, coding courses, career tools, gadgets and university opportunities). We do NOT accept gambling, misleading schemes, or unverified services.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
