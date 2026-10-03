import React from 'react';
import { 
  Megaphone, 
  ExternalLink, 
  MessageCircle, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Layout, 
  FileText, 
  Send, 
  Star,
  Users,
  Eye,
  Building2,
  TrendingUp,
  Layers,
  Search,
  Headphones
} from 'lucide-react';

export default function PromotionSection({ onNavigate }) {
  const WHATSAPP_URL = "https://wa.me/917668016628?text=Hi%20ProfessorVirus%20Team%2C%20I%20am%20interested%20in%20Advertising%20and%20Promotion%20plans%20on%20ProfessorVirus.";

  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  };

  const handleViewPlans = () => {
    if (onNavigate) {
      onNavigate('promotion');
    } else {
      window.location.href = '/promotion';
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '₹1,019',
      period: '/week',
      popular: false,
      features: [
        '1 Website Banner',
        'Basic Placement',
        'Direct Student Reach'
      ],
      ctaText: 'View Details',
      action: handleViewPlans
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      price: '₹3,019',
      period: '/month',
      popular: true,
      features: [
        'Homepage Banner',
        'Sponsored Article',
        'Telegram Promotion'
      ],
      ctaText: 'View Details',
      action: handleViewPlans
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '₹6,019',
      period: '/month',
      popular: false,
      features: [
        'Multiple Banner Slots',
        'Article + Sidebar',
        'Telegram + WhatsApp'
      ],
      ctaText: 'View Details',
      action: handleViewPlans
    },
    {
      id: 'custom',
      name: 'Custom Plan',
      price: "Let's Talk",
      period: '',
      popular: false,
      features: [
        'Tailored for Brands',
        'Long-term Collaboration',
        'Best Visibility & Support'
      ],
      ctaText: 'Contact Now',
      action: openWhatsApp
    }
  ];

  const whyAdvertise = [
    {
      icon: Users,
      title: 'Massive Student Audience',
      desc: 'Active students learning and preparing across India',
      color: '#DC2626',
      bg: '#FEF2F2'
    },
    {
      icon: TargetIcon,
      title: 'Highly Targeted Reach',
      desc: 'Tech, engineering, career and study focused',
      color: '#EA580C',
      bg: '#FFEDD5'
    },
    {
      icon: Star,
      title: 'Trusted Academic Platform',
      desc: 'High student engagement and recurring daily sessions',
      color: '#D97706',
      bg: '#FFFBEB'
    },
    {
      icon: Layout,
      title: 'Brand Visibility',
      desc: 'Homepage, study notes, articles and sidebar',
      color: '#059669',
      bg: '#ECFDF5'
    },
    {
      icon: Layers,
      title: 'Multiple Promotion Options',
      desc: 'Choose from flexible weekly and monthly plans',
      color: '#2563EB',
      bg: '#EFF6FF'
    },
    {
      icon: Send,
      title: 'Telegram & WhatsApp Reach',
      desc: 'Direct outreach to university study groups',
      color: '#0284C7',
      bg: '#F0F9FF'
    },
    {
      icon: Search,
      title: 'SEO Friendly Articles',
      desc: 'High authority backlink with instant indexing',
      color: '#7C3AED',
      bg: '#F5F3FF'
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      desc: 'Fast campaign activation and custom solutions',
      color: '#E11D48',
      bg: '#FFF1F2'
    }
  ];

  return (
    <section 
      style={{
        backgroundColor: '#FAF7F2',
        padding: '3.5rem 0 3.5rem 0',
        borderBottom: '1.5px solid #E8E2D5'
      }}
    >
      <div className="container">
        
        {/* 1. TOP PROMOTION HERO BANNER */}
        <div style={{
          backgroundColor: '#1E140F',
          backgroundImage: `
            radial-gradient(ellipse at 80% 20%, rgba(200, 141, 45, 0.15) 0%, transparent 60%),
            linear-gradient(135deg, #1A120C 0%, #281B13 100%)
          `,
          borderRadius: '28px',
          border: '1.5px solid #3D2C20',
          padding: 'clamp(2rem, 3.5vw, 3.25rem)',
          boxShadow: '0 20px 48px rgba(26, 18, 12, 0.28)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2.5rem'
        }}>
          {/* Subtle grid texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(200, 141, 45, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.4,
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(200, 141, 45, 0.2)',
                border: '1px solid rgba(200, 141, 45, 0.4)',
                borderRadius: '9999px',
                padding: '0.35rem 0.95rem',
                color: '#FBBF24',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                marginBottom: '1rem'
              }}>
                <Sparkles size={13} />
                <span>REACH STUDENTS ACROSS COLLEGES</span>
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: 'clamp(1.85rem, 2.8vw, 2.65rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.18,
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '-0.02em',
                margin: '0 0 1rem 0'
              }}>
                Promote Your Brand & App <br />
                <span style={{ color: '#F59E0B' }}>Directly to College Students</span>
              </h2>

              {/* Description */}
              <p style={{
                fontSize: '0.94rem',
                color: '#D1C7BD',
                lineHeight: 1.6,
                margin: '0 0 1.5rem 0'
              }}>
                ProfessorVirus is the academic platform for engineering & college students. Showcase your product, service, or opportunity through homepage banners, sponsored posts, and direct Telegram & WhatsApp promotions.
              </p>

              {/* Checkmarks */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem 1.25rem',
                marginBottom: '1.75rem'
              }}>
                {['Homepage & Sidebar Banners', 'Sponsored Articles', 'Direct Student Outreach'].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    color: '#FAF7F2',
                    fontSize: '0.84rem',
                    fontWeight: 600
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid #F59E0B',
                      color: '#F59E0B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}>
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}>
                <button
                  type="button"
                  onClick={handleViewPlans}
                  style={{
                    backgroundColor: '#F59E0B',
                    color: '#1E140F',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.8rem 1.6rem',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D97706';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F59E0B';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>View Promotion Plans & Pricing</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FAF7F2',
                    border: '1.5px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    padding: '0.8rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#25D366';
                    e.currentTarget.style.borderColor = '#25D366';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = '#FAF7F2';
                  }}
                >
                  <MessageCircle size={17} />
                  <span>Contact on WhatsApp 7668016628</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right: 3 Promo Format Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              {[
                {
                  icon: Layout,
                  title: 'Website Banners',
                  desc: 'Prime homepage, in-article & sticky sidebar placements.',
                  badge: 'High Visibility'
                },
                {
                  icon: FileText,
                  title: 'Sponsored Posts',
                  desc: 'High DA academic articles with instant indexing.',
                  badge: 'SEO Permanent'
                },
                {
                  icon: Send,
                  title: 'Telegram & WhatsApp Promotions',
                  desc: 'Direct reach to active engineering & degree students.',
                  badge: 'Instant Reach'
                }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    onClick={handleViewPlans}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1.5px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '18px',
                      padding: '1.15rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#F59E0B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.95rem' }}>
                          {card.title}
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                          {card.desc}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#F59E0B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. ADVERTISING PLANS SECTION */}
        <div style={{ marginTop: '3.5rem', marginBottom: '3.5rem' }}>
          
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#C88D2D',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '0.35rem'
              }}>
                <Sparkles size={13} />
                <span>PROMOTION PLANS</span>
              </div>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                fontWeight: 800,
                color: '#1C1E21',
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '-0.02em',
                margin: '0 0 0.45rem 0'
              }}>
                Simple & Affordable Plans for Maximum Student Reach
              </h2>
              <p style={{
                fontSize: '0.92rem',
                color: '#64748B',
                fontWeight: 500,
                margin: 0,
                maxWidth: '620px'
              }}>
                Choose a plan that fits your goal. Get visibility across homepage, articles, Telegram, WhatsApp and more.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleViewPlans}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '9999px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(120, 20, 22, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F1239'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#781416'}
              >
                <span>View All Plans</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={openWhatsApp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFFFF',
                  color: '#1E140F',
                  border: '1.5px solid #25D366',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#25D366';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#1E140F';
                }}
              >
                <MessageCircle size={15} style={{ color: '#25D366' }} />
                <span>Contact on WhatsApp 7668016628</span>
              </button>
            </div>
          </div>

          {/* 4 Plans Grid */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            style={{ alignItems: 'stretch' }}
          >
            {plans.map(p => (
              <div
                key={p.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: p.popular ? '2px solid #C88D2D' : '1.5px solid #E8E2D5',
                  borderRadius: '24px',
                  padding: '2rem 1.45rem 1.75rem 1.45rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: p.popular ? '0 12px 32px rgba(200, 141, 45, 0.15)' : '0 4px 16px rgba(35,30,25,0.04)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = p.popular ? '0 16px 36px rgba(200, 141, 45, 0.2)' : '0 12px 28px rgba(35,30,25,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = p.popular ? '0 12px 32px rgba(200, 141, 45, 0.15)' : '0 4px 16px rgba(35,30,25,0.04)';
                }}
              >
                {/* Popular Pill */}
                {p.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#C88D2D',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.85rem',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 10px rgba(200, 141, 45, 0.3)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    ★ Most Popular
                  </div>
                )}

                {/* Plan Name */}
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#1C1E21',
                  margin: '0 0 0.5rem 0'
                }}>
                  {p.name}
                </h3>

                {/* Price */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.25rem',
                  margin: '0.5rem 0 1.5rem 0'
                }}>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: p.popular ? '#C88D2D' : '#1C1E21',
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                    {p.price}
                  </span>
                  {p.period && (
                    <span style={{
                      fontSize: '0.85rem',
                      color: '#64748B',
                      fontWeight: 600
                    }}>
                      {p.period}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '2rem',
                  flexGrow: 1
                }}>
                  {p.features.map((feat, fidx) => (
                    <div key={fidx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.86rem',
                      color: '#475569',
                      fontWeight: 500
                    }}>
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
                        flexShrink: 0
                      }}>
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Card Button */}
                <button
                  type="button"
                  onClick={p.action}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: p.popular ? '#C88D2D' : '#FAF7F2',
                    color: p.popular ? '#FFFFFF' : '#1C1E21',
                    border: p.popular ? 'none' : '1.5px solid #E2D9C8',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.2s ease',
                    boxShadow: p.popular ? '0 4px 14px rgba(200, 141, 45, 0.25)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (p.popular) {
                      e.currentTarget.style.backgroundColor = '#B37D28';
                    } else {
                      e.currentTarget.style.backgroundColor = '#781416';
                      e.currentTarget.style.borderColor = '#781416';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (p.popular) {
                      e.currentTarget.style.backgroundColor = '#C88D2D';
                    } else {
                      e.currentTarget.style.backgroundColor = '#FAF7F2';
                      e.currentTarget.style.borderColor = '#E2D9C8';
                      e.currentTarget.style.color = '#1C1E21';
                    }
                  }}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. WHY ADVERTISE WITH PROFESSORVIRUS */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E8E2D5',
          borderRadius: '24px',
          padding: '2.5rem clamp(1.5rem, 3vw, 2.5rem)',
          boxShadow: '0 4px 18px rgba(35,30,25,0.04)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: 'clamp(1.4rem, 2vw, 1.85rem)',
              fontWeight: 800,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif"
            }}>
              <span role="img" aria-label="bulb">💡</span>
              <h3>Why Advertise With ProfessorVirus?</h3>
            </div>

            <button
              type="button"
              onClick={handleViewPlans}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#781416',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <span>View All Promotion Options</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 8 Feature Sub-Cards */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            style={{ alignItems: 'stretch' }}
          >
            {whyAdvertise.map((w, widx) => {
              const Icon = w.icon;
              return (
                <div
                  key={widx}
                  style={{
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #E8E2D5',
                    borderRadius: '16px',
                    padding: '1.25rem 1.15rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: w.bg,
                    color: w.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#1C1E21',
                      margin: '0 0 0.2rem 0'
                    }}>
                      {w.title}
                    </h4>
                    <p style={{
                      fontSize: '0.78rem',
                      color: '#64748B',
                      margin: 0,
                      lineHeight: 1.4
                    }}>
                      {w.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

// Fallback Icon helper
function TargetIcon(props) {
  return <Sparkles {...props} />;
}
