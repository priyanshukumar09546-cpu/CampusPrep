import React, { useState } from 'react';
import {
  Briefcase,
  Target,
  Bot,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Code,
  Users,
  FileText,
  Trophy,
  ArrowRight,
  Sparkles,
  Brain,
  Cloud,
  Layers,
  RefreshCw,
  Sliders,
  X,
  Play,
  Check,
  GraduationCap,
  Monitor,
  Pill,
  Star,
  ChevronRight,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export default function InterviewProPage({ onNavigate, onOpenAuth }) {
  // Interactive Modals State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [sampleActiveTab, setSampleActiveTab] = useState('aptitude');
  const [selectedRoundDetail, setSelectedRoundDetail] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState('B.Tech');
  const [selectedRole, setSelectedRole] = useState('Software Developer');
  const [testStarted, setTestStarted] = useState(false);
  const [currentTestSection, setCurrentTestSection] = useState(0);

  // 4 Assessment Steps
  const assessmentSteps = [
    {
      step: '01',
      num: 1,
      title: 'Aptitude',
      duration: '35 Minutes',
      badgeColor: '#781416',
      icon: FileText,
      iconBg: '#FEE2E2',
      iconColor: '#B91C1C',
      bullets: [
        'Quantitative Aptitude',
        'Logical Reasoning',
        'Verbal Ability',
        'Data Interpretation'
      ],
      description: 'Tests analytical speed, problem-solving ability, and linguistic precision expected in Day-1 MNC recruitment exams.'
    },
    {
      step: '02',
      num: 2,
      title: 'Coding',
      duration: '60 Minutes',
      badgeColor: '#1E60D0',
      icon: Code,
      iconBg: '#DBEAFE',
      iconColor: '#1D4ED8',
      bullets: [
        'DSA & Problem Solving',
        'Multiple Languages',
        'Real-time Code Editor',
        'Automatic Evaluation'
      ],
      description: 'Hands-on programming challenges with real-time test cases (hidden edge cases, memory limits, and runtime limits).'
    },
    {
      step: '03',
      num: 3,
      title: 'AI Technical Interview',
      duration: '30 Minutes',
      badgeColor: '#6C2EBD',
      icon: Bot,
      iconBg: '#EDE9FE',
      iconColor: '#6D28D9',
      bullets: [
        'Subject-wise Smart Questions',
        'Follow-up Questions',
        'Role-specific Interview',
        'Real-time AI Interviewer'
      ],
      description: 'Live interactive viva simulating senior engineer grilling on Core CS, DBMS, OOPs, OS, and chosen specialization.'
    },
    {
      step: '04',
      num: 4,
      title: 'AI HR / Behavioral',
      duration: '15 Minutes',
      badgeColor: '#E05625',
      icon: Users,
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      bullets: [
        'Personal & Behavioral Questions',
        'Communication Assessment',
        'Situational Questions',
        'AI Feedback & Suggestions'
      ],
      description: 'Evaluates culture-fit, adaptability, clarity of thought, and behavioral responses using the proven STAR framework.'
    }
  ];

  // Why Choose Items
  const whyChooseItems = [
    {
      icon: Target,
      iconBg: '#FFE4E6',
      iconColor: '#E11D48',
      title: 'All-in-One Assessment',
      desc: 'Aptitude + Coding + Technical + HR in one go.'
    },
    {
      icon: Bot,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      title: 'AI-Powered Interviewer',
      desc: 'Get real-time, adaptive questions.'
    },
    {
      icon: FileText,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      title: 'Real Exam Experience',
      desc: 'Same pattern, same pressure, better preparation.'
    },
    {
      icon: BarChart3,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      title: 'Detailed Performance Report',
      desc: 'Know your strengths, weak areas and improvement plan.'
    }
  ];

  // Who is it for items
  const courseAudience = [
    {
      name: 'B.Tech',
      sub: 'All Branches',
      icon: GraduationCap,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0'
    },
    {
      name: 'MCA',
      sub: 'MCA Curriculum',
      icon: Monitor,
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE'
    },
    {
      name: 'MBA',
      sub: 'All Specializations',
      icon: BarChart3,
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A'
    },
    {
      name: 'B.Pharm',
      sub: 'B.Pharm Curriculum',
      icon: Pill,
      color: '#E11D48',
      bg: '#FFF1F2',
      border: '#FECDD3'
    }
  ];

  // Popular Job Roles
  const jobRoles = [
    { name: 'Software Developer', icon: Code, color: '#0D9488', bg: '#F0FDFA' },
    { name: 'Data Analyst', icon: BarChart3, color: '#D97706', bg: '#FFFBEB' },
    { name: 'Cyber Security Analyst', icon: ShieldCheck, color: '#2563EB', bg: '#EFF6FF' },
    { name: 'Cloud Engineer', icon: Cloud, color: '#0284C7', bg: '#F0F9FF' },
    { name: 'AI/ML Engineer', icon: Brain, color: '#059669', bg: '#ECFDF5' },
    { name: 'Full Stack Developer', icon: Layers, color: '#7C3AED', bg: '#F5F3FF' },
    { name: 'DevOps Engineer', icon: RefreshCw, color: '#0D9488', bg: '#F0FDFA' },
    { name: 'Product Manager', icon: Sliders, color: '#3B82F6', bg: '#EFF6FF' }
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1F1A14', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section style={{
        position: 'relative',
        backgroundColor: '#FAF6EE',
        backgroundImage: `
          radial-gradient(rgba(180, 140, 80, 0.08) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #FBF8F2 0%, #F5EFE3 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '2.5rem 0 2rem 0',
        borderBottom: '1px solid #EBE4D5',
        overflow: 'hidden'
      }}>
        <div className="container">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
            gap: '2rem',
            alignItems: 'center'
          }} className="interview-pro-hero-grid">

            {/* LEFT COLUMN: Headlines, Badges, Features, CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 2 }}>
              
              {/* Product Badge Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#FAF0DE',
                  border: '1.5px solid #E5CE9F',
                  borderRadius: '12px',
                  padding: '0.45rem 0.65rem',
                  boxShadow: '0 2px 6px rgba(180, 130, 40, 0.08)'
                }}>
                  <Briefcase size={22} color="#8A5A1B" />
                </div>

                <h1 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '2.75rem',
                  fontWeight: 900,
                  color: '#1C1814',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  margin: 0
                }}>
                  Interview Pro
                </h1>

                <span style={{
                  backgroundColor: '#DCA23A',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.22rem 0.65rem',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 6px rgba(220, 162, 58, 0.35)',
                  alignSelf: 'center'
                }}>
                  Beta
                </span>
              </div>

              {/* Supporting Headline */}
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.55rem',
                fontWeight: 800,
                color: '#241D17',
                lineHeight: 1.25,
                letterSpacing: '-0.015em'
              }}>
                One Test. Real Experience.{' '}
                <span style={{ color: '#D48816' }}>Placement Ready.</span>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.92rem',
                lineHeight: 1.62,
                color: '#554C42',
                margin: 0,
                maxWidth: '560px',
                fontWeight: 500
              }}>
                Take a complete company-style assessment with Aptitude, Coding, AI Technical Interview and HR Round – all in one session. Experience the real placement environment before the actual drive.
              </p>

              {/* Feature Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.15rem',
                padding: '0.6rem 0',
                borderTop: '1px dashed #E5DCCB',
                borderBottom: '1px dashed #E5DCCB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#383129' }}>
                  <Target size={15} color="#B45309" />
                  <span>Real Exam Pattern</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#383129' }}>
                  <Bot size={15} color="#2563EB" />
                  <span>AI-Powered Interviewer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#383129' }}>
                  <BarChart3 size={15} color="#059669" />
                  <span>Detailed Performance Report</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#383129' }}>
                  <ShieldCheck size={15} color="#7C2D12" />
                  <span>For B.Tech, MCA, MBA, B.Pharm</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', paddingTop: '0.35rem' }}>
                <button
                  onClick={() => onNavigate ? onNavigate('interview-confirm') : setIsTestModalOpen(true)}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.78rem 1.65rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 6px 18px rgba(120, 20, 22, 0.32)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#631012';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#781416';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Start Full Interview Test</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => setIsSampleModalOpen(true)}
                  style={{
                    backgroundColor: '#FFF9EF',
                    color: '#4A3525',
                    border: '1.5px solid #C4A47C',
                    borderRadius: '10px',
                    padding: '0.76rem 1.45rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 8px rgba(74, 53, 37, 0.06)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5EBD9';
                    e.currentTarget.style.borderColor = '#B38F64';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF9EF';
                    e.currentTarget.style.borderColor = '#C4A47C';
                  }}
                >
                  <Lightbulb size={16} color="#8A5A1B" />
                  <span>View Sample Questions</span>
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: Professor Illustration Matching Reference */}
            <div style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }} className="interview-pro-hero-visual">
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 36px rgba(35, 30, 25, 0.12)',
                border: '2px solid #EBE1D0',
                backgroundColor: '#FFFDF9',
                width: '100%',
                maxHeight: '380px'
              }}>
                <img
                  src="/assets/interview_pro_hero_illustration_2x.png"
                  alt="Professor Virus Interview Pro Classroom"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/ask_virus_character.png';
                  }}
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: WHAT'S INCLUDED IN THE FULL INTERVIEW TEST?
          ========================================================================= */}
      <section className="container" style={{ padding: '2.5rem 0' }}>
        
        {/* Outer Framed Box */}
        <div style={{
          backgroundColor: '#FCFAF6',
          border: '1.5px solid #EBE4D5',
          borderRadius: '20px',
          padding: '1.75rem',
          boxShadow: '0 6px 24px rgba(35, 30, 25, 0.04)'
        }}>

          {/* Section Header Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid #EFE8DA'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FAF0DE',
                border: '1px solid #E5CE9F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B45309'
              }}>
                <Users size={19} />
              </div>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#1C1814',
                margin: 0
              }}>
                What's Included in the Full Interview Test?
              </h2>
            </div>

            {/* Handwritten script slogan */}
            <div style={{
              fontFamily: "'Kalam', 'Patrick Hand', cursive",
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#B47318',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span>Complete Placement Preparation in One Go!</span>
            </div>
          </div>

          {/* Assessment Flow Grid: 4 Steps + Connectors + 1 Total Duration Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) minmax(180px, 200px)',
            gap: '0.85rem',
            alignItems: 'stretch'
          }} className="interview-flow-grid">
            
            {assessmentSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  onClick={() => setSelectedRoundDetail(step)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #EDE5D6',
                    borderRadius: '14px',
                    padding: '1.15rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(35, 30, 25, 0.03)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C88D2D';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(35, 30, 25, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#EDE5D6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(35, 30, 25, 0.03)';
                  }}
                >
                  {/* Top Row: Number Badge, Title, Duration, Right Icon */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: step.badgeColor,
                          color: '#FFFFFF',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {step.num}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.98rem',
                            fontWeight: 800,
                            color: '#1C1814',
                            lineHeight: 1.15
                          }}>
                            {step.title}
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#70675D',
                            marginTop: '2px'
                          }}>
                            <Clock size={11} />
                            <span>{step.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: step.iconBg,
                        color: step.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <StepIcon size={17} />
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0.75rem 0 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem'
                    }}>
                      {step.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} style={{
                          fontSize: '0.79rem',
                          color: '#4A4238',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: step.badgeColor,
                            flexShrink: 0
                          }} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Flow Arrow (only shown on desktop between steps) */}
                  {idx < 3 && (
                    <div style={{
                      position: 'absolute',
                      right: '-16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#FCFAF6',
                      border: '1.5px solid #E5DCCB',
                      color: '#A09485',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }} className="flow-step-arrow">
                      <ChevronRight size={13} />
                    </div>
                  )}

                  <div style={{
                    marginTop: '0.85rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px dashed #F0E8D9',
                    fontSize: '0.72rem',
                    color: '#8A5A1B',
                    fontWeight: 700,
                    textAlign: 'right'
                  }}>
                    View Round Details →
                  </div>
                </div>
              );
            })}

            {/* Total Duration Summary Card */}
            <div style={{
              backgroundColor: '#FFFDF9',
              border: '1.5px solid #EDE5D6',
              borderRadius: '14px',
              padding: '1.25rem 0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(35, 30, 25, 0.03)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#FAF0DE',
                border: '1px solid #E5CE9F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B45309',
                marginBottom: '0.65rem'
              }}>
                <Trophy size={24} />
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7A6F62', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Duration
              </div>

              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.45rem',
                fontWeight: 900,
                color: '#1C1814',
                lineHeight: 1.1,
                marginTop: '0.25rem'
              }}>
                140 Minutes
              </div>

              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#8C8275', marginBottom: '0.85rem' }}>
                (2 Hours 20 Minutes)
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#EDF7ED',
                color: '#276749',
                border: '1px solid #C6E7C6',
                borderRadius: '9999px',
                padding: '0.3rem 0.55rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                lineHeight: 1.2
              }}>
                <CheckCircle2 size={12} color="#2E7D32" />
                <span>Same as Real Company Assessments</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 5, 6, 7: THREE-COLUMN MIDDLE SECTION
          Column 1: Why Choose Interview Pro?
          Column 2: Who is it for? + Motivational Banner
          Column 3: Popular Job Roles You Can Prepare For
          ========================================================================= */}
      <section className="container" style={{ paddingBottom: '2.5rem' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 1.1fr)',
          gap: '1.25rem',
          alignItems: 'stretch'
        }} className="interview-pro-three-columns">

          {/* COLUMN 1: Why Choose Interview Pro? */}
          <div style={{
            backgroundColor: '#FCFAF6',
            border: '1.5px solid #EBE4D5',
            borderRadius: '18px',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.15rem' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FAF0DE',
                border: '1px solid #E5CE9F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B45309'
              }}>
                <Star size={16} />
              </div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.08rem',
                fontWeight: 800,
                color: '#1C1814',
                margin: 0
              }}>
                Why Choose Interview Pro?
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
              {whyChooseItems.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #EDE5D6',
                      borderRadius: '12px',
                      padding: '0.75rem 0.85rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C88D2D';
                      e.currentTarget.style.backgroundColor = '#FFFDF9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#EDE5D6';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: item.iconBg,
                      color: item.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ItemIcon size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1C1814', lineHeight: 1.2 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#665C50', fontWeight: 500, marginTop: '2px', lineHeight: 1.35 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: Who is it for? + Virus Motivational Card */}
          <div style={{
            backgroundColor: '#FCFAF6',
            border: '1.5px solid #EBE4D5',
            borderRadius: '18px',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.15rem' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#FAF0DE',
                  border: '1px solid #E5CE9F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B45309'
                }}>
                  <Users size={16} />
                </div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  color: '#1C1814',
                  margin: 0
                }}>
                  Who is it for?
                </h3>
              </div>

              {/* 4 Course Audience Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.55rem',
                marginBottom: '1rem'
              }}>
                {courseAudience.map((c) => {
                  const CIcon = c.icon;
                  const isSelected = selectedDegree === c.name;
                  return (
                    <div
                      key={c.name}
                      onClick={() => setSelectedDegree(c.name)}
                      style={{
                        backgroundColor: isSelected ? '#FAF2DE' : '#FFFFFF',
                        border: isSelected ? '2px solid #C88D2D' : '1.5px solid #EDE5D6',
                        borderRadius: '10px',
                        padding: '0.75rem 0.35rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#C88D2D';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#EDE5D6';
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: c.bg,
                        color: c.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.4rem auto'
                      }}>
                        <CIcon size={16} />
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1C1814', lineHeight: 1.1 }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: '0.67rem', color: '#7A6F62', fontWeight: 600, marginTop: '2px' }}>
                        {c.sub}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ProfessorVirus Motivational Banner: Thumbs Up + Handwritten Quote */}
            <div style={{
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1.5px solid #E8DBC6',
              boxShadow: '0 4px 12px rgba(35, 30, 25, 0.05)',
              backgroundColor: '#FAF2DF',
              marginTop: '0.5rem'
            }}>
              <img
                src="/assets/interview_pro_virus_quote_card_2x.png"
                alt="Better Preparation. Brighter Placements! — Virus"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/interview_pro_virus_thumbsup.png';
                }}
              />
            </div>
          </div>

          {/* COLUMN 3: Popular Job Roles You Can Prepare For */}
          <div style={{
            backgroundColor: '#FCFAF6',
            border: '1.5px solid #EBE4D5',
            borderRadius: '18px',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.15rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#FAF0DE',
                  border: '1px solid #E5CE9F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B45309'
                }}>
                  <Briefcase size={16} />
                </div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#1C1814',
                  margin: 0
                }}>
                  Popular Job Roles You Can Prepare For
                </h3>
              </div>

              <button
                onClick={() => onNavigate ? onNavigate('interview-confirm') : setIsTestModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#92400E',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                View All →
              </button>
            </div>

            {/* 4x2 Grid of 8 Roles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'repeat(2, auto)',
              gap: '0.55rem',
              flex: 1
            }}>
              {jobRoles.map((role) => {
                const RoleIcon = role.icon;
                const isSelected = selectedRole === role.name;
                return (
                  <div
                    key={role.name}
                    onClick={() => {
                      setSelectedRole(role.name);
                      // Save role to sessionStorage so InterviewConfirmPage picks it up
                      try {
                        sessionStorage.setItem('interview_pro_assessment_draft', JSON.stringify({
                          targetRole: role.name
                        }));
                      } catch(e) {}
                      // Navigate to the proper interview configuration page
                      if (onNavigate) {
                        onNavigate('interview-confirm');
                      }
                    }}
                    style={{
                      backgroundColor: isSelected ? '#FAF2DE' : '#FFFFFF',
                      border: isSelected ? '1.5px solid #C88D2D' : '1.5px solid #EDE5D6',
                      borderRadius: '10px',
                      padding: '0.65rem 0.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C88D2D';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(35, 30, 25, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#EDE5D6';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      color: role.color,
                      marginBottom: '0.35rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <RoleIcon size={20} />
                    </div>
                    <div style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#1C1814',
                      lineHeight: 1.2
                    }}>
                      {role.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 8: FINAL CTA BANNER
          ========================================================================= */}
      <section className="container" style={{ paddingBottom: '3rem' }}>
        
        <div style={{
          backgroundColor: '#FAF5EC',
          border: '1.5px solid #EADBCE',
          borderRadius: '16px',
          padding: '1.15rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 6px 20px rgba(35, 30, 25, 0.04)'
        }}>

          {/* Left: Icon + Heading + Description */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FAF0DE',
              border: '1.5px solid #E5CE9F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B45309',
              flexShrink: 0
            }}>
              <Target size={20} />
            </div>

            <div>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.12rem',
                fontWeight: 800,
                color: '#1C1814',
                lineHeight: 1.2
              }}>
                Your Dream Job is Closer Than You Think!
              </div>
              <div style={{
                fontSize: '0.82rem',
                color: '#695F53',
                fontWeight: 500,
                marginTop: '2px'
              }}>
                Start your Interview Pro journey today and join 1,00,000+ ProfessorVirus students who are already placement ready.
              </div>
            </div>
          </div>

          {/* Right: CTA Button */}
          <div>
            <button
              onClick={() => onNavigate ? onNavigate('interview-confirm') : setIsTestModalOpen(true)}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 1.45rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(120, 20, 22, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#631012';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#781416';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Start Full Interview Test</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </section>

      {/* =========================================================================
          INTERACTIVE MODAL 1: START FULL INTERVIEW TEST SIMULATION
          ========================================================================= */}
      {isTestModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(20, 16, 12, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FCFAF6',
            borderRadius: '20px',
            border: '2px solid #E8E0D0',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => {
                setIsTestModalOpen(false);
                setTestStarted(false);
              }}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                backgroundColor: '#EDE5D6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#554C42'
              }}
            >
              <X size={18} />
            </button>

            {!testStarted ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Play size={18} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#1C1814',
                    margin: 0
                  }}>
                    Setup Your Placement Simulation
                  </h3>
                </div>

                <p style={{ fontSize: '0.86rem', color: '#6A6054', margin: '0 0 1.5rem 0', fontWeight: 500 }}>
                  Select your target role and academic background to personalize question sets for Aptitude, Coding, Technical viva, and HR round.
                </p>

                {/* Course Selection */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#241D17', marginBottom: '0.45rem' }}>
                    1. Select Your Degree / Course:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {['B.Tech', 'MCA', 'MBA', 'B.Pharm'].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setSelectedDegree(deg)}
                        style={{
                          padding: '0.65rem 0.5rem',
                          borderRadius: '10px',
                          border: selectedDegree === deg ? '2px solid #781416' : '1.5px solid #E5DCCB',
                          backgroundColor: selectedDegree === deg ? '#FEE2E2' : '#FFFFFF',
                          color: selectedDegree === deg ? '#781416' : '#332C24',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          cursor: 'pointer'
                        }}
                      >
                        {deg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Selection */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#241D17', marginBottom: '0.45rem' }}>
                    2. Select Target Job Role:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    {jobRoles.map((role) => (
                      <button
                        key={role.name}
                        type="button"
                        onClick={() => setSelectedRole(role.name)}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: '10px',
                          border: selectedRole === role.name ? '2px solid #781416' : '1.5px solid #E5DCCB',
                          backgroundColor: selectedRole === role.name ? '#FEE2E2' : '#FFFFFF',
                          color: selectedRole === role.name ? '#781416' : '#332C24',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          textAlign: 'left'
                        }}
                      >
                        <role.icon size={15} />
                        <span>{role.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Rounds Summary */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1.5px solid #EDE5D6',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814', marginBottom: '0.5rem' }}>
                    Simulation Assessment Structure (140 Mins Total):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                    <div style={{ padding: '0.4rem', backgroundColor: '#FAF7F2', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#781416' }}>ROUND 1</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Aptitude</div>
                      <div style={{ fontSize: '0.7rem', color: '#7A6F62' }}>35 Mins</div>
                    </div>
                    <div style={{ padding: '0.4rem', backgroundColor: '#FAF7F2', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1E60D0' }}>ROUND 2</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Coding</div>
                      <div style={{ fontSize: '0.7rem', color: '#7A6F62' }}>60 Mins</div>
                    </div>
                    <div style={{ padding: '0.4rem', backgroundColor: '#FAF7F2', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6C2EBD' }}>ROUND 3</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>AI Tech Viva</div>
                      <div style={{ fontSize: '0.7rem', color: '#7A6F62' }}>30 Mins</div>
                    </div>
                    <div style={{ padding: '0.4rem', backgroundColor: '#FAF7F2', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E05625' }}>ROUND 4</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>AI HR Round</div>
                      <div style={{ fontSize: '0.7rem', color: '#7A6F62' }}>15 Mins</div>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={() => {
                    setTestStarted(true);
                    setCurrentTestSection(0);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 6px 18px rgba(120, 20, 22, 0.35)'
                  }}
                >
                  <Play size={18} />
                  <span>Begin Full Assessment ({selectedDegree} • {selectedRole})</span>
                </button>
              </div>
            ) : (
              /* Live Test Simulation View */
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid #EDE5D6',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <span style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      LIVE SIMULATION
                    </span>
                    <h3 style={{ margin: '0.35rem 0 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
                      Round {currentTestSection + 1}: {assessmentSteps[currentTestSection].title}
                    </h3>
                  </div>

                  <div style={{
                    backgroundColor: '#FEE2E2',
                    color: '#781416',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Clock size={16} />
                    <span>{assessmentSteps[currentTestSection].duration} remaining</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #EDE5D6',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A5A1B', marginBottom: '0.4rem' }}>
                    Candidate: Priyanshu | Target: {selectedRole} ({selectedDegree})
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1C1814', lineHeight: 1.5 }}>
                    {currentTestSection === 0 && (
                      <>
                        <strong>Question 1 of 30:</strong> Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. The ratio of their speeds is:
                        <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {['A) 1 : 3', 'B) 3 : 2', 'C) 3 : 4', 'D) None of these'].map((opt, oIdx) => (
                            <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', padding: '0.35rem', borderRadius: '6px', backgroundColor: '#FAF7F2' }}>
                              <input type="radio" name="apt_q1" />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                    {currentTestSection === 1 && (
                      <>
                        <strong>Problem 1 of 2: Longest Substring Without Repeating Characters</strong>
                        <p style={{ fontSize: '0.84rem', color: '#554C42', marginTop: '0.4rem' }}>
                          Given a string <code>s</code>, find the length of the longest substring without repeating characters.
                        </p>
                        <div style={{ backgroundColor: '#1E1E1E', color: '#D4D4D4', padding: '0.75rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                          {"// Input: s = \"abcabcbb\"\n// Output: 3\n// Explanation: The answer is \"abc\", with length 3."}
                        </div>
                      </>
                    )}
                    {currentTestSection === 2 && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6C2EBD', fontWeight: 800, marginBottom: '0.4rem' }}>
                          <Bot size={18} />
                          <span>AI Technical Interviewer (Voice / Text Viva):</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#1C1814', fontStyle: 'italic', backgroundColor: '#F5F3FF', padding: '0.85rem', borderRadius: '8px' }}>
                          "Welcome Priyanshu! Let's start with Operating Systems. Can you explain the difference between a process and a thread, and how the operating system handles context switching between them?"
                        </p>
                        <textarea
                          placeholder="Type or speak your answer here..."
                          rows={3}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #EDE5D6', marginTop: '0.65rem', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </>
                    )}
                    {currentTestSection === 3 && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E05625', fontWeight: 800, marginBottom: '0.4rem' }}>
                          <Users size={18} />
                          <span>AI HR & Behavioral Evaluation:</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#1C1814', fontStyle: 'italic', backgroundColor: '#FFF7ED', padding: '0.85rem', borderRadius: '8px' }}>
                          "Tell me about a challenging academic or team project where you had a disagreement with a team member. How did you resolve it?"
                        </p>
                        <textarea
                          placeholder="Structure your answer using Situation, Task, Action, Result (STAR)..."
                          rows={3}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #EDE5D6', marginTop: '0.65rem', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    disabled={currentTestSection === 0}
                    onClick={() => setCurrentTestSection(prev => Math.max(0, prev - 1))}
                    style={{
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      border: '1.5px solid #EDE5D6',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: currentTestSection === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentTestSection === 0 ? 0.5 : 1
                    }}
                  >
                    ← Previous Round
                  </button>

                  {currentTestSection < 3 ? (
                    <button
                      onClick={() => setCurrentTestSection(prev => Math.min(3, prev + 1))}
                      style={{
                        padding: '0.55rem 1.35rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Next: {assessmentSteps[currentTestSection + 1].title} →
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        alert("Assessment Submitted Successfully! Performance Report generated for Priyanshu.");
                        setTestStarted(false);
                        setIsTestModalOpen(false);
                      }}
                      style={{
                        padding: '0.55rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Submit Full Assessment & View Report ✓
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 2: VIEW SAMPLE QUESTIONS
          ========================================================================= */}
      {isSampleModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(20, 16, 12, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FCFAF6',
            borderRadius: '20px',
            border: '2px solid #E8E0D0',
            width: '100%',
            maxWidth: '720px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)'
          }}>
            <button
              onClick={() => setIsSampleModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                backgroundColor: '#EDE5D6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#554C42'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FAF0DE',
                border: '1.5px solid #E5CE9F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B45309'
              }}>
                <Lightbulb size={20} />
              </div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#1C1814',
                margin: 0
              }}>
                Sample Assessment Questions
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#6A6054', margin: '0 0 1.25rem 0' }}>
              Preview real question styles asked across the 4 assessment stages in company placement drives.
            </p>

            {/* 4 Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem', marginBottom: '1.25rem' }}>
              {[
                { id: 'aptitude', name: '01 Aptitude', color: '#781416' },
                { id: 'coding', name: '02 Coding', color: '#1E60D0' },
                { id: 'tech', name: '03 AI Tech Viva', color: '#6C2EBD' },
                { id: 'hr', name: '04 AI HR Round', color: '#E05625' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSampleActiveTab(tab.id)}
                  style={{
                    padding: '0.55rem 0.4rem',
                    borderRadius: '8px',
                    border: sampleActiveTab === tab.id ? `2px solid ${tab.color}` : '1.5px solid #E5DCCB',
                    backgroundColor: sampleActiveTab === tab.id ? '#FFFFFF' : '#F6F0E6',
                    color: sampleActiveTab === tab.id ? tab.color : '#554C42',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #EDE5D6', borderRadius: '12px', padding: '1.25rem' }}>
              {sampleActiveTab === 'aptitude' && (
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.98rem', fontWeight: 800, color: '#781416' }}>
                    Sample Quantitative & Logical Question
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#241D17', lineHeight: 1.5 }}>
                    <strong>Q:</strong> A car travels from City A to City B at a speed of 60 km/h and returns at a speed of 90 km/h. What is the average speed of the car for the entire journey?
                  </p>
                  <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', margin: '0.75rem 0' }}>
                    <strong>Options:</strong> A) 75 km/h &nbsp;|&nbsp; <strong>B) 72 km/h (Correct)</strong> &nbsp;|&nbsp; C) 70 km/h &nbsp;|&nbsp; D) 80 km/h
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                    💡 <strong>Virus Tip:</strong> Average speed for equal distance = <code>2xy / (x + y)</code> = (2 × 60 × 90) / 150 = 72 km/h. Never take simple arithmetic mean!
                  </div>
                </div>
              )}

              {sampleActiveTab === 'coding' && (
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.98rem', fontWeight: 800, color: '#1E60D0' }}>
                    Sample DSA Problem: Two Sum II (Sorted Array)
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: '#241D17', lineHeight: 1.5 }}>
                    Given a 1-indexed array of integers <code>numbers</code> sorted in non-decreasing order, find two numbers such that they add up to a specific <code>target</code>.
                  </p>
                  <div style={{ backgroundColor: '#1E1E1E', color: '#D4D4D4', padding: '0.75rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {"// Optimal: Two Pointer Approach -> O(N) Time, O(1) Space\nint left = 0, right = n - 1;\nwhile(left < right) {\n  int sum = arr[left] + arr[right];\n  if (sum == target) return {left + 1, right + 1};\n  else if (sum < target) left++;\n  else right--;\n}"}
                  </div>
                </div>
              )}

              {sampleActiveTab === 'tech' && (
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.98rem', fontWeight: 800, color: '#6C2EBD' }}>
                    Sample AI Technical Viva Grilling
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: '#241D17', lineHeight: 1.5 }}>
                    <strong>Interviewer:</strong> "What are ACID properties in DBMS? If a system experiences a sudden power failure during a banking transaction, which component ensures Atomicity and Durability?"
                  </p>
                  <div style={{ backgroundColor: '#FAF5FF', borderLeft: '4px solid #6C2EBD', padding: '0.75rem', borderRadius: '0 8px 8px 0', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                    <strong>Expected Key Points:</strong> Atomicity (WAL - Write Ahead Logging / Undo log), Consistency, Isolation (Locking / MVCC), Durability (Redo log / Checkpoints).
                  </div>
                </div>
              )}

              {sampleActiveTab === 'hr' && (
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.98rem', fontWeight: 800, color: '#E05625' }}>
                    Sample Behavioral / Situational Scenario
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: '#241D17', lineHeight: 1.5 }}>
                    <strong>HR Question:</strong> "Where do you see yourself in 3 years, and why do you want to start your career with our engineering team?"
                  </p>
                  <div style={{ backgroundColor: '#FFF7ED', borderLeft: '4px solid #E05625', padding: '0.75rem', borderRadius: '0 8px 8px 0', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                    <strong>Virus STAR Tip:</strong> Focus on skill acquisition, delivering impact on real client products, mentorship, and alignment with the company's core technology stack!
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
              <button
                onClick={() => {
                  setIsSampleModalOpen(false);
                  setIsTestModalOpen(true);
                }}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Ready? Start Full Test Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 3: ROUND DETAILS BREAKDOWN
          ========================================================================= */}
      {selectedRoundDetail && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(20, 16, 12, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FCFAF6',
            borderRadius: '20px',
            border: '2px solid #E8E0D0',
            width: '100%',
            maxWidth: '560px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)'
          }}>
            <button
              onClick={() => setSelectedRoundDetail(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                backgroundColor: '#EDE5D6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#554C42'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: selectedRoundDetail.badgeColor,
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedRoundDetail.num}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  {selectedRoundDetail.title} Round
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#7A6F62', fontWeight: 600 }}>
                  Standard Duration: {selectedRoundDetail.duration}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#4A4238', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
              {selectedRoundDetail.description}
            </p>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #EDE5D6', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814', marginBottom: '0.5rem' }}>
                Key Syllabus & Topics Covered:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#443C32', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {selectedRoundDetail.bullets.map((b, i) => (
                  <li key={i}><strong>{b}</strong></li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setSelectedRoundDetail(null);
                setIsTestModalOpen(true);
              }}
              style={{
                width: '100%',
                backgroundColor: selectedRoundDetail.badgeColor,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Start Full Interview Assessment →
            </button>
          </div>
        </div>
      )}

      {/* Responsive Style Overrides */}
      <style>{`
        @media (max-width: 1024px) {
          .interview-pro-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .interview-flow-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .flow-step-arrow {
            display: none !important;
          }
          .interview-pro-three-columns {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .interview-flow-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
