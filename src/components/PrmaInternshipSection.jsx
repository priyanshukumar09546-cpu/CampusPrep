import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code,
  Cpu,
  Database,
  Globe,
  Layers,
  Smartphone,
  Cloud,
  Shield,
  Palette,
  Server,
  BarChart3,
  Terminal,
  Award,
  Package,
  Users,
  Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PrmaInternshipSection({ onNavigate }) {
  const { isDark } = useTheme();

  const internshipDomains = [
    {
      id: 'ai-ml',
      title: 'Artificial Intelligence & ML',
      shortTitle: 'AI / ML',
      desc: 'Build real-world neural networks, fine-tune LLMs, computer vision, and deploy intelligent AI agents.',
      tags: ['Python', 'PyTorch', 'LLMs', 'OpenCV'],
      icon: Cpu,
      accentColor: '#0866F5',
      badge: 'High Demand'
    },
    {
      id: 'data-science',
      title: 'Data Science & Big Data',
      shortTitle: 'Data Science',
      desc: 'Extract actionable insights, statistical modeling, feature engineering, and predictive algorithms.',
      tags: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn'],
      icon: Database,
      accentColor: '#EA3323',
      badge: 'Popular'
    },
    {
      id: 'data-analytics',
      title: 'Data Analytics & BI',
      shortTitle: 'Data Analytics',
      desc: 'Transform raw data into executive business intelligence dashboards, metrics, and KPI trackers.',
      tags: ['Power BI', 'SQL', 'Tableau', 'Excel'],
      icon: BarChart3,
      accentColor: '#FFBD12',
      badge: 'In Demand'
    },
    {
      id: 'python-fullstack',
      title: 'Python Full-Stack & Automation',
      shortTitle: 'Python Dev',
      desc: 'Develop end-to-end Python web applications, REST APIs, and automated bot workflows.',
      tags: ['Django', 'FastAPI', 'PostgreSQL', 'Celery'],
      icon: Terminal,
      accentColor: '#079B45',
      badge: 'Featured'
    },
    {
      id: 'web-dev',
      title: 'Web Development (Frontend & Full-Stack)',
      shortTitle: 'Web Dev',
      desc: 'Craft ultra-fast, responsive web applications with interactive modern UI and state management.',
      tags: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
      icon: Globe,
      accentColor: '#0866F5',
      badge: 'Most Popular'
    },
    {
      id: 'mern-stack',
      title: 'MERN Stack Development',
      shortTitle: 'MERN Stack',
      desc: 'Architect full-cycle production applications using MongoDB, Express, React, and Node.js.',
      tags: ['MongoDB', 'Express', 'React', 'Node.js'],
      icon: Layers,
      accentColor: '#7025E8',
      badge: 'Industry Standard'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App Development',
      shortTitle: 'App Dev',
      desc: 'Build cross-platform iOS & Android mobile applications with native device capabilities.',
      tags: ['Flutter', 'React Native', 'Firebase', 'Dart'],
      icon: Smartphone,
      accentColor: '#EA3323',
      badge: 'Trending'
    },
    {
      id: 'cloud-computing',
      title: 'Cloud Computing & Infrastructure',
      shortTitle: 'Cloud (AWS/GCP)',
      desc: 'Deploy resilient cloud architectures, serverless functions, IAM policies, and cloud storage.',
      tags: ['AWS', 'GCP', 'Azure', 'Serverless'],
      icon: Cloud,
      accentColor: '#FFBD12',
      badge: 'High Value'
    },
    {
      id: 'devops-ci-cd',
      title: 'DevOps & CI/CD Engineering',
      shortTitle: 'DevOps',
      desc: 'Automate build-test-deploy pipelines with containerization, monitoring, and infrastructure as code.',
      tags: ['Docker', 'Kubernetes', 'GitHub Actions', 'Terraform'],
      icon: Server,
      accentColor: '#079B45',
      badge: 'Fast Growing'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & Ethical Hacking',
      shortTitle: 'Cybersecurity',
      desc: 'Learn vulnerability analysis, network defense, penetration testing, and security compliance.',
      tags: ['Kali Linux', 'Burp Suite', 'OWASP', 'Wireshark'],
      icon: Shield,
      accentColor: '#EA3323',
      badge: 'Crucial'
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design & Product Experience',
      shortTitle: 'UI/UX Design',
      desc: 'Design beautiful, user-centered digital interfaces, design systems, wireframes, and prototypes.',
      tags: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
      icon: Palette,
      accentColor: '#7025E8',
      badge: 'Creative'
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering & Pipelines',
      shortTitle: 'Data Eng',
      desc: 'Build scalable ETL pipelines, data warehouses, streaming systems, and optimized database schemas.',
      tags: ['Apache Spark', 'Kafka', 'Airflow', 'Snowflake'],
      icon: Code,
      accentColor: '#0866F5',
      badge: 'Advanced'
    }
  ];

  const benefits = [
    { text: '100% Remote & Self-Paced Schedule', icon: Clock },
    { text: 'Real-World Production Projects', icon: Code },
    { text: '1-on-1 Mentorship from Senior Engineers', icon: Users },
    { text: 'Physical Welcome & Swag Kit Delivered to Your Door', icon: Package },
    { text: 'Globally Verified Certificate & Performance Stipend', icon: Award }
  ];

  const handleApplyClick = () => {
    if (onNavigate) {
      onNavigate('prma-internships-home');
    } else {
      window.location.href = '/prma-tech/internships';
    }
  };

  return (
    <section
      id="prma-internships-section"
      className="pv-scroll-reveal"
      style={{
        backgroundColor: 'transparent',
        padding: '3rem 0 4rem 0',
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
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: isDark ? 'rgba(8, 102, 245, 0.12)' : '#EFF6FF',
              border: isDark ? '1px solid rgba(8, 102, 245, 0.35)' : '1.5px solid #BFDBFE',
              marginBottom: '0.85rem'
            }}
          >
            <Sparkles size={14} color="#0866F5" />
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: isDark ? '#60A5FA' : '#1D4ED8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              PRMA Tech × ProfessorVirus Remote Internships
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
            Turn Your Learning Into{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 50%, #EA3323 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Real-World Experience
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
            Move beyond classroom theory. Build production-grade projects, learn from active
            software architects, and develop job-ready engineering proof of work with PRMA Tech.
          </p>
        </div>

        {/* HERO PROMOTIONAL BANNER WITH MERCHANDISE KIT SHOWCASE */}
        <div
          style={{
            backgroundColor: isDark ? '#0B0F1E' : '#FFFFFF',
            backgroundImage: isDark
              ? 'radial-gradient(ellipse at 85% 20%, rgba(112, 37, 232, 0.18) 0%, transparent 60%), radial-gradient(ellipse at 15% 80%, rgba(8, 102, 245, 0.15) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at 85% 20%, rgba(112, 37, 232, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 15% 80%, rgba(8, 102, 245, 0.05) 0%, transparent 60%)',
            borderRadius: '28px',
            border: isDark ? '1.5px solid rgba(112, 37, 232, 0.35)' : '1.5px solid #E2DDF5',
            boxShadow: isDark
              ? '0 16px 48px rgba(0, 0, 0, 0.7), 0 0 35px rgba(112, 37, 232, 0.15)'
              : '0 12px 36px rgba(16, 28, 80, 0.08)',
            padding: 'clamp(1.75rem, 3.2vw, 3rem)',
            marginBottom: '3.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(1.75rem, 3vw, 3rem)',
              alignItems: 'center'
            }}
          >
            {/* Left Content */}
            <div>
              {/* Partner Brand Identity Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  marginBottom: '1.25rem'
                }}
              >
                <img
                  src="/assets/prma_tech_logo.png"
                  alt="PRMA Tech Official Logo"
                  style={{
                    height: '38px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: isDark ? '#A1A1AA' : '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Official Technology & Career Partner
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
                  fontWeight: 900,
                  color: isDark ? '#FFFFFF' : '#101C50',
                  lineHeight: 1.25,
                  margin: '0 0 1rem 0'
                }}
              >
                Industry-Ready Remote Internship Program
              </h3>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.98rem',
                  color: isDark ? '#D4D4D8' : '#475569',
                  lineHeight: 1.65,
                  margin: '0 0 1.5rem 0'
                }}
              >
                A high-impact virtual internship crafted for ambitious college students. Solve real
                problems, contribute to production repositories, receive weekly code reviews, and
                earn authentic credentials that recruiters respect.
              </p>

              {/* 5 Key Highlights Checklist */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '2rem'
                }}
              >
                {benefits.map((b, idx) => {
                  const BIcon = b.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: isDark ? 'rgba(7, 155, 69, 0.18)' : '#DCFCE7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#079B45'
                        }}
                      >
                        <CheckCircle2 size={16} strokeWidth={2.5} />
                      </div>
                      <span
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: isDark ? '#F4F4F5' : '#1E293B'
                        }}
                      >
                        {b.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <button
                  type="button"
                  onClick={handleApplyClick}
                  style={{
                    padding: '0.85rem 1.85rem',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #0866F5 0%, #7025E8 100%)',
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
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(8, 102, 245, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(8, 102, 245, 0.35)';
                  }}
                >
                  <span>Explore Internship Programs</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      'https://wa.me/917668016628?text=Hi%20PRMA%20Tech%20%26%20ProfessorVirus%20Team%2C%20I%20am%20interested%20in%20the%20Remote%20Internship%20Program.',
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                  style={{
                    padding: '0.85rem 1.6rem',
                    borderRadius: '9999px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                    color: isDark ? '#E4E4E7' : '#1E293B',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0866F5';
                    e.currentTarget.style.color = '#0866F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark
                      ? 'rgba(255, 255, 255, 0.15)'
                      : '#CBD5E1';
                    e.currentTarget.style.color = isDark ? '#E4E4E7' : '#1E293B';
                  }}
                >
                  <span>Inquire on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right Visual: Welcome Kit Showcase */}
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div
                style={{
                  borderRadius: '22px',
                  overflow: 'hidden',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  boxShadow: isDark
                    ? '0 12px 36px rgba(0, 0, 0, 0.7)'
                    : '0 8px 28px rgba(0, 0, 0, 0.08)',
                  backgroundColor: isDark ? '#060A14' : '#F8FAFC',
                  position: 'relative'
                }}
              >
                <img
                  src="/assets/prma_merchandise_kit.png"
                  alt="Official PRMA Tech Welcome & Merchandise Kit (T-Shirt, Water Bottle, Notebook, ID Card, Certificate, Gift Box)"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    // Fallback to building merch scene if single kit crop fails
                    e.currentTarget.src = '/assets/prma_building_merch_scene.png';
                  }}
                />

                {/* Badge Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    backgroundColor: isDark ? 'rgba(11, 15, 30, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    padding: '0.65rem 1rem',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: isDark ? '#FFFFFF' : '#101C50'
                      }}
                    >
                      Physical Welcome Kit Delivered
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: isDark ? '#A1A1AA' : '#64748B'
                      }}
                    >
                      Custom T-Shirt, Notebook, Water Bottle, ID Card & Verified Certificate
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      backgroundColor: '#079B45',
                      color: '#FFFFFF',
                      flexShrink: 0
                    }}
                  >
                    Included Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 12 INTERNSHIP DOMAINS PREVIEW GRID */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#7025E8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.25rem'
                }}
              >
                Choose Your Track
              </div>
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                  fontWeight: 900,
                  color: isDark ? '#FFFFFF' : '#1F2421',
                  margin: 0
                }}
              >
                12 In-Demand Internship Domains
              </h3>
            </div>

            <button
              type="button"
              onClick={handleApplyClick}
              style={{
                padding: '0.55rem 1.35rem',
                borderRadius: '9999px',
                border: isDark ? '1px solid rgba(112, 37, 232, 0.4)' : '1.5px solid #DDD6FE',
                backgroundColor: isDark ? 'rgba(112, 37, 232, 0.1)' : '#F5F3FF',
                color: isDark ? '#C084FC' : '#7025E8',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7025E8';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(112, 37, 232, 0.1)' : '#F5F3FF';
                e.currentTarget.style.color = isDark ? '#C084FC' : '#7025E8';
              }}
            >
              <span>Explore All 12 Domains</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Grid of 12 Domains */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {internshipDomains.map((domain) => {
              const DIcon = domain.icon;
              return (
                <div
                  key={domain.id}
                  onClick={handleApplyClick}
                  style={{
                    backgroundColor: isDark ? '#0B0B0B' : '#FFFFFF',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1.5px solid #E8E2D5',
                    borderRadius: '20px',
                    padding: '1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = domain.accentColor;
                    e.currentTarget.style.boxShadow = `0 12px 30px ${domain.accentColor}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E8E2D5';
                    e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  <div>
                    {/* Top Row: Icon & Badge */}
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
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: `${domain.accentColor}18`,
                          border: `1.5px solid ${domain.accentColor}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: domain.accentColor
                        }}
                      >
                        <DIcon size={20} strokeWidth={2.2} />
                      </div>

                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '0.18rem 0.55rem',
                          borderRadius: '9999px',
                          backgroundColor: `${domain.accentColor}15`,
                          color: domain.accentColor,
                          border: `1px solid ${domain.accentColor}30`,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {domain.badge}
                      </span>
                    </div>

                    {/* Domain Title */}
                    <h4
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: isDark ? '#FFFFFF' : '#1F2421',
                        margin: '0 0 0.45rem 0',
                        lineHeight: 1.3
                      }}
                    >
                      {domain.title}
                    </h4>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.82rem',
                        color: isDark ? '#A1A1AA' : '#64748B',
                        lineHeight: 1.55,
                        margin: '0 0 1rem 0'
                      }}
                    >
                      {domain.desc}
                    </p>
                  </div>

                  <div>
                    {/* Tech Tags */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.35rem',
                        marginBottom: '1rem'
                      }}
                    >
                      {domain.tags.map((t, tidx) => (
                        <span
                          key={tidx}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px',
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                            color: isDark ? '#D4D4D8' : '#475569'
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Bottom CTA Link */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.75rem',
                        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #F1F5F9'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: domain.accentColor
                        }}
                      >
                        Apply for Track
                      </span>
                      <ArrowRight size={14} color={domain.accentColor} />
                    </div>
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