import React from 'react';
import {
  Globe,
  Smartphone,
  Cpu,
  Cloud,
  Shield,
  BarChart3,
  Palette,
  Code2,
  ArrowRight,
  Sparkles,
  CheckCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PrmaServicesSection({ onNavigate }) {
  const { isDark } = useTheme();

  const services = [
    {
      id: 'web-dev',
      title: 'Website Development',
      desc: 'High-performance, search-optimized web applications, responsive corporate portals, and modern dynamic SaaS platforms.',
      tags: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'],
      icon: Globe,
      accent: '#0866F5'
    },
    {
      id: 'app-dev',
      title: 'Mobile App Development',
      desc: 'Native and cross-platform mobile apps for iOS and Android with delightful UX, smooth animations, and offline-first reliability.',
      tags: ['Flutter', 'React Native', 'Swift', 'Kotlin'],
      icon: Smartphone,
      accent: '#EA3323'
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      desc: 'Enterprise LLM solutions, autonomous AI agents, computer vision pipelines, and custom predictive intelligence models.',
      tags: ['OpenAI', 'Gemini', 'PyTorch', 'LangChain'],
      icon: Cpu,
      accent: '#7025E8'
    },
    {
      id: 'cloud-devops',
      title: 'Cloud & DevOps Architecture',
      desc: 'Scalable cloud infrastructure, automated CI/CD deployment pipelines, containerization, and zero-downtime microservices.',
      tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      icon: Cloud,
      accent: '#FFBD12'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & Audits',
      desc: 'Proactive vulnerability assessments, penetration testing, data encryption protocols, and OWASP compliance safeguarding.',
      tags: ['Pen Testing', 'OWASP Top 10', 'SOC2', 'Data Shield'],
      icon: Shield,
      accent: '#EA3323'
    },
    {
      id: 'data-analytics',
      title: 'Data Science & Analytics',
      desc: 'Executive business intelligence dashboards, real-time KPI telemetry, automated reporting, and customer predictive behavior models.',
      tags: ['Power BI', 'SQL Server', 'Python', 'BigQuery'],
      icon: BarChart3,
      accent: '#079B45'
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design & Branding',
      desc: 'User-centric product research, design thinking workshops, high-fidelity interactive Figma prototypes, and complete design systems.',
      tags: ['Figma', 'User Research', 'Design Systems', 'Wireframing'],
      icon: Palette,
      accent: '#7025E8'
    },
    {
      id: 'custom-software',
      title: 'Custom Software Development',
      desc: 'End-to-end bespoke enterprise software, high-throughput REST/GraphQL APIs, distributed architectures, and ERP integrations.',
      tags: ['Microservices', 'PostgreSQL', 'GraphQL', 'FastAPI'],
      icon: Code2,
      accent: '#0866F5'
    }
  ];

  const openWhatsAppInquiry = (serviceName) => {
    const msg = `Hi PRMA Tech Team, I am interested in inquiring about your "${serviceName || 'Technology'}" services for our project.`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/917668016628?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="prma-services-section"
      className="pv-scroll-reveal"
      style={{
        backgroundColor: 'transparent',
        padding: '3.5rem 0 4rem 0',
        position: 'relative'
      }}
    >
      <div
        className="container pv-main-container"
        style={{
          maxWidth: 'min(1560px, 94vw)',
          margin: '0 auto',
          padding: '0 clamp(1rem, 2.5vw, 2.5rem)'
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: isDark ? 'rgba(7, 155, 69, 0.12)' : '#F0FDF4',
              border: isDark ? '1px solid rgba(7, 155, 69, 0.35)' : '1.5px solid #BBF7D0',
              marginBottom: '0.85rem'
            }}
          >
            <Sparkles size={14} color="#079B45" />
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: isDark ? '#4ADE80' : '#15803D',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              Enterprise Engineering Solutions
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2rem, 3.2vw, 2.85rem)',
              fontWeight: 900,
              color: isDark ? '#FFFFFF' : '#1F2421',
              margin: '0 0 0.65rem 0',
              lineHeight: 1.2
            }}
          >
            Technology Solutions by{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0866F5 0%, #EA3323 50%, #FFBD12 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              PRMA Tech
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
              color: isDark ? '#A1A1AA' : '#64748B',
              margin: '0 auto',
              maxWidth: '680px',
              lineHeight: 1.6
            }}
          >
            From innovative startup MVPs to enterprise-grade digital systems. We architect, build,
            and scale high-performance software with modern engineering standards.
          </p>
        </div>

        {/* 8 SERVICES GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.35rem',
            marginBottom: '3rem'
          }}
        >
          {services.map((srv) => {
            const SIcon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => openWhatsAppInquiry(srv.title)}
                style={{
                  backgroundColor: isDark ? '#0B0B0B' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1.5px solid #E8E2D5',
                  borderRadius: '22px',
                  padding: '1.65rem 1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = srv.accent;
                  e.currentTarget.style.boxShadow = `0 12px 32px ${srv.accent}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E8E2D5';
                  e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.03)';
                }}
              >
                <div>
                  {/* Service Icon */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: `${srv.accent}15`,
                      border: `1.5px solid ${srv.accent}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: srv.accent,
                      marginBottom: '1.25rem'
                    }}
                  >
                    <SIcon size={24} strokeWidth={2.2} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: isDark ? '#FFFFFF' : '#1F2421',
                      margin: '0 0 0.6rem 0',
                      lineHeight: 1.3
                    }}
                  >
                    {srv.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.86rem',
                      color: isDark ? '#A1A1AA' : '#64748B',
                      lineHeight: 1.6,
                      margin: '0 0 1.25rem 0'
                    }}
                  >
                    {srv.desc}
                  </p>
                </div>

                <div>
                  {/* Technology Tags */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      marginBottom: '1.15rem'
                    }}
                  >
                    {srv.tags.map((tg, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                          color: isDark ? '#D4D4D8' : '#475569'
                        }}
                      >
                        {tg}
                      </span>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.85rem',
                      borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #F1F5F9'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: srv.accent
                      }}
                    >
                      Inquire for Project
                    </span>
                    <ArrowRight size={15} color={srv.accent} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CONSULTATION CARD */}
        <div
          style={{
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            backgroundImage: isDark
              ? 'radial-gradient(ellipse at 50% 50%, rgba(8, 102, 245, 0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(8, 102, 245, 0.06) 0%, transparent 70%)',
            borderRadius: '24px',
            border: isDark ? '1px solid rgba(8, 102, 245, 0.3)' : '1.5px solid #CBD5E1',
            padding: 'clamp(1.75rem, 3vw, 2.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: isDark ? '0 12px 32px rgba(0, 0, 0, 0.6)' : '0 4px 20px rgba(0, 0, 0, 0.03)'
          }}
        >
          <div>
            <h4
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.35rem, 2vw, 1.7rem)',
                fontWeight: 900,
                color: isDark ? '#FFFFFF' : '#101C50',
                margin: '0 0 0.35rem 0'
              }}
            >
              Have a Project in Mind? Build with PRMA Tech
            </h4>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.92rem',
                color: isDark ? '#A1A1AA' : '#64748B',
                margin: 0
              }}
            >
              Whether you need a full-stack MVP, enterprise cloud migration, or dedicated engineering support.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openWhatsAppInquiry('Custom Software & Project')}
            style={{
              padding: '0.85rem 1.85rem',
              borderRadius: '9999px',
              backgroundColor: '#0866F5',
              color: '#FFFFFF',
              border: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 8px 24px rgba(8, 102, 245, 0.35)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0650C5';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0866F5';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <MessageSquare size={17} />
            <span>Schedule Project Consultation</span>
          </button>
        </div>
      </div>
    </section>
  );
}