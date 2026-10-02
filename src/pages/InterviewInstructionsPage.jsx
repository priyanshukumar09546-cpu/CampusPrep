import React from 'react';
import {
  Briefcase,
  Check,
  Clock,
  Laptop,
  Camera,
  Volume2,
  AlertTriangle,
  Ban,
  Hourglass,
  CheckCircle2,
  BarChart3,
  Shield,
  Mic,
  Smartphone,
  Share2,
  GraduationCap,
  ShieldCheck,
  XCircle,
  ArrowRight,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { startNewInterviewSession } from '../utils/interviewSessionManager';

export default function InterviewInstructionsPage({ onNavigate, onOpenAuth }) {
  // Load Active Test Configuration from InterviewConfirmPage
  const activeTest = (() => {
    try {
      const raw = sessionStorage.getItem('interview_pro_active_test');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // 8 Instruction Cards Data matching Reference Image
  const instructions = [
    {
      num: 1,
      title: 'Stable Internet Connection',
      desc: 'Ensure you have a stable internet connection throughout the test. Avoid switching networks.',
      icon: Laptop,
      iconColor: '#1E3A8A'
    },
    {
      num: 2,
      title: 'Enable Camera & Microphone',
      desc: 'Your camera and microphone will be used during AI Technical and HR Interview sections.',
      icon: Camera,
      iconColor: '#1E3A8A'
    },
    {
      num: 3,
      title: 'Be in a Quiet Environment',
      desc: 'Sit in a quiet place without any distractions. Avoid background noise.',
      icon: Volume2,
      iconColor: '#781416'
    },
    {
      num: 4,
      title: 'Do Not Refresh or Close',
      desc: 'Do not refresh the page or close the browser during the test. This may end your test.',
      icon: AlertTriangle,
      iconColor: '#781416'
    },
    {
      num: 5,
      title: 'No External Help',
      desc: 'Do not use external help, unauthorized tools, or search engines during the test.',
      icon: Ban,
      iconColor: '#781416'
    },
    {
      num: 6,
      title: 'Time Management',
      desc: 'Each section has a fixed time limit. Manage your time wisely. The timer will not pause.',
      icon: Hourglass,
      iconColor: '#781416'
    },
    {
      num: 7,
      title: 'Automatic Submission',
      desc: 'Your answers will be saved automatically. Each section will be submitted automatically after the time ends.',
      icon: CheckCircle2,
      iconColor: '#781416'
    },
    {
      num: 8,
      title: 'Get Detailed Report',
      desc: 'After completing the test, you will get a detailed performance report with strengths, weak areas and improvement suggestions.',
      icon: BarChart3,
      iconColor: '#781416'
    }
  ];

  // 7 Important Rules matching Reference Image
  const rules = [
    { icon: Camera, color: '#B45309', text: 'Keep your camera on (required)' },
    { icon: Mic, color: '#B45309', text: 'Keep your microphone on (required)' },
    { icon: Smartphone, color: '#781416', text: 'No mobile phones or external devices' },
    { icon: Share2, color: '#781416', text: 'No screen sharing or remote assistance' },
    { icon: GraduationCap, color: '#B45309', text: 'Do not copy or use AI tools' },
    { icon: ShieldCheck, color: '#15803D', text: 'Maintain honesty and integrity' },
    { icon: XCircle, color: '#DC2626', text: 'Violating rules may lead to disqualification' }
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1F1A14', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* =========================================================================
          1. INTERVIEW PRO HERO BANNER (Matches Reference Image)
          ========================================================================= */}
      <section style={{
        backgroundColor: '#FAF5ED',
        backgroundImage: `
          radial-gradient(rgba(180, 140, 80, 0.08) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #FBF8F2 0%, #F5EFE3 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '0.85rem 0',
        borderBottom: '1px solid #E8E0D0'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            {/* Left: Product & Supporting Headline */}
            <div style={{ zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#781416',
                  borderRadius: '10px',
                  padding: '0.45rem 0.55rem',
                  boxShadow: '0 2px 6px rgba(120, 20, 22, 0.2)'
                }}>
                  <Briefcase size={22} color="#FFFFFF" />
                </div>
                <h1 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '2.15rem',
                  fontWeight: 900,
                  color: '#1C1814',
                  margin: 0,
                  lineHeight: 1.1
                }}>
                  Interview Pro
                </h1>
              </div>

              <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#4A4036',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span>One Test. Real Experience.</span>
                <span style={{ color: '#D48816', fontWeight: 800 }}>Placement Ready.</span>
              </div>
            </div>

            {/* Right: ProfessorVirus Hero Illustration with Quote & Notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              maxHeight: '100px',
              overflow: 'hidden',
              borderRadius: '10px'
            }} className="instructions-hero-art-wrapper">
              <img
                src="/assets/interview_instructions_hero_art_2x.png"
                alt="Follow the Rules, Give Your Best, Crack Your Dream Job! — Virus"
                style={{
                  height: '92px',
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/interview_confirm_hero_art_2x.png';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PROGRESS STEPPER (Matches Reference Image)
          1: Select Profile (✓) | 2: Confirm Details (✓) | 3: Test Instructions (ACTIVE 3) | 4: Start Test
          ========================================================================= */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #EDE5D6',
        padding: '0.75rem 0',
        boxShadow: '0 2px 8px rgba(35, 30, 25, 0.02)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Stepper Flow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }} className="progress-stepper-row">

              {/* Step 1: Completed */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814' }}>
                  Select Profile
                </span>
              </div>

              {/* Completed Connector Line */}
              <div style={{ width: '48px', height: '2px', backgroundColor: '#781416' }} className="stepper-line" />

              {/* Step 2: Completed */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814' }}>
                  Confirm Details
                </span>
              </div>

              {/* Active Connector Line */}
              <div style={{ width: '48px', height: '2px', backgroundColor: '#781416' }} className="stepper-line" />

              {/* Step 3: Current / Test Instructions (ACTIVE) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#C88D2D',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  3
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814' }}>
                  Test Instructions
                </span>
              </div>

              {/* Inactive Connector Line */}
              <div style={{ width: '48px', height: '2px', backgroundColor: '#E2DAD0' }} className="stepper-line" />

              {/* Step 4: Inactive / Start Test */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', opacity: 0.65 }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#EAE2D5',
                  color: '#70675D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  4
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#70675D' }}>
                  Start Test
                </span>
              </div>

            </div>

            {/* Stepper Status on Far Right */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1C1814' }}>
                Step 3 of 4
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#70675D' }}>
                Read carefully!
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. MAIN CONTENT: 2-COLUMN LAYOUT
          Left: Test Instructions & Grid | Right: Important Rules, Banner & Quote
          ========================================================================= */}
      <main className="container" style={{ padding: '1.75rem 1.25rem 3rem 1.25rem' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.72fr) minmax(0, 0.88fr)',
          gap: '1.35rem',
          alignItems: 'start'
        }} className="interview-instructions-2col">

          {/* =====================================================================
              LEFT / MAIN CARD: TEST INSTRUCTIONS
              ===================================================================== */}
          <div style={{
            backgroundColor: '#FCFAF6',
            border: '1.5px solid #EBE4D5',
            borderRadius: '16px',
            padding: '1.45rem',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
          }}>

            {/* Top Heading */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginBottom: '1.15rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#781416',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <FileText size={18} />
              </div>
              <div>
                <h2 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#781416',
                  margin: 0,
                  lineHeight: 1.15
                }}>
                  Test Instructions
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#6A6054', margin: '0.2rem 0 0 0', fontWeight: 500 }}>
                  Please read all the instructions carefully before starting the test.
                </p>
              </div>
            </div>

            {/* Dynamic Assessment Profile Banner */}
            {activeTest && (
              <div style={{
                backgroundColor: '#FAF0E6',
                border: '1.5px solid #E8D3BC',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C1814' }}>
                      {activeTest.course} · {activeTest.branch ? activeTest.branch.split(' ')[0] : ''} · {activeTest.year}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#70675D', fontWeight: 600 }}>
                      Target Role: <strong style={{ color: '#781416' }}>{activeTest.targetRole}</strong> · Resume: <strong>{activeTest.resume?.name || 'Attached'}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    backgroundColor: '#E7F5EE',
                    color: '#0E7A4A',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px'
                  }}>
                    ✓ Profile Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('interview-confirm')}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #781416',
                      color: '#781416',
                      borderRadius: '6px',
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Change Details
                  </button>
                </div>
              </div>
            )}

            {/* Introductory Highlighted Card: Complete Test Flow */}
            <div style={{
              backgroundColor: '#FEF9EE',
              border: '1.5px solid #F5E6C8',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '1.35rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#FDEECA',
                color: '#8A5A1B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1C1814' }}>
                  Complete Test Flow
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4A4036', fontWeight: 500, marginTop: '3px', lineHeight: 1.45 }}>
                  This is a full-length interview simulation. All sections will be conducted in a single session with a continuous timer.
                  Make sure you have a stable internet connection and a quiet environment before you start.
                </div>
              </div>
            </div>

            {/* 8 Instruction Cards in a 2-Column Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              marginBottom: '1.75rem'
            }} className="instructions-grid-2col">
              {instructions.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.num}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #EDE5D6',
                      borderRadius: '10px',
                      padding: '0.9rem',
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
                    {/* Circle Number */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#FAF0DE',
                      color: '#8A5A1B',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {item.num}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                        <ItemIcon size={17} color={item.iconColor} />
                        <h4 style={{
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          color: '#1C1814',
                          margin: 0,
                          lineHeight: 1.2
                        }}>
                          {item.title}
                        </h4>
                      </div>
                      <p style={{
                        fontSize: '0.76rem',
                        color: '#6A6054',
                        fontWeight: 500,
                        margin: 0,
                        lineHeight: 1.35
                      }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              paddingTop: '0.5rem',
              borderTop: '1px solid #EFE8DA'
            }}>
              {/* Back to Profile Button */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('interview-confirm');
                  }
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#2C2620',
                  border: '1.5px solid #EDE5D6',
                  borderRadius: '10px',
                  padding: '0.75rem 1.45rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 6px rgba(35,30,25,0.03)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C88D2D';
                  e.currentTarget.style.backgroundColor = '#FAF7F2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#EDE5D6';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <ArrowLeft size={16} />
                <span>Back to Profile</span>
              </button>

              {/* Primary: I Understand, Start Test -> */}
              <button
                type="button"
                onClick={() => {
                  startNewInterviewSession(activeTest || {});
                  if (onNavigate) {
                    onNavigate('interview-start');
                  }
                }}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.8rem 1.75rem',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
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
                <span>I Understand, Start Test</span>
                <ArrowRight size={17} />
              </button>
            </div>

          </div>

          {/* =====================================================================
              RIGHT COLUMN: IMPORTANT RULES, BANNER & QUOTE CARD
              ===================================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

            {/* Important Rules Card */}
            <div style={{
              backgroundColor: '#FCFAF6',
              border: '1.5px solid #EBE4D5',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: '1px solid #EFE8DA' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Shield size={16} />
                </div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.12rem',
                  fontWeight: 900,
                  color: '#781416',
                  margin: 0
                }}>
                  Important Rules
                </h3>
              </div>

              {/* 7 Rules List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {rules.map((rule, idx) => {
                  const RuleIcon = rule.icon;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.79rem', fontWeight: 600, color: '#342D24' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: '#FAF5ED',
                        border: '1px solid #E8DFCF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: rule.color,
                        flexShrink: 0
                      }}>
                        <RuleIcon size={13} />
                      </div>
                      <span style={{ lineHeight: 1.3 }}>{rule.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ProfessorVirus Sidebar Banner (Matches Reference Image) */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1.5px solid #E8DBC6',
              boxShadow: '0 4px 14px rgba(35, 30, 25, 0.05)',
              backgroundColor: '#FAF2DF'
            }}>
              <img
                src="/assets/interview_instructions_sidebar_virus_2x.png"
                alt="You are one step closer to your dream job! — Virus"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/interview_confirm_sidebar_virus_2x.png';
                }}
              />
            </div>

            {/* Bottom Quote Card (Matches Reference Image) */}
            <div style={{
              backgroundColor: '#FAF5ED',
              borderRadius: '12px',
              border: '1.5px solid #E8DFCF',
              padding: '0.9rem 1.15rem',
              boxShadow: '0 2px 6px rgba(35, 30, 25, 0.03)'
            }}>
              <div style={{
                fontSize: '1.65rem',
                lineHeight: 1,
                color: '#C88D2D',
                fontFamily: 'serif',
                fontWeight: 900,
                marginBottom: '0.25rem'
              }}>
                “
              </div>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#4A4036',
                fontStyle: 'italic',
                lineHeight: 1.5
              }}>
                "Read the instructions carefully, prepare your mind, and give your best. Great opportunities wait for the prepared!"
              </div>
              <div style={{
                textAlign: 'right',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#781416',
                marginTop: '0.4rem'
              }}>
                — ProfessorVirus
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Responsive Stacking Overrides */}
      <style>{`
        @media (max-width: 1024px) {
          .interview-instructions-2col {
            grid-template-columns: 1fr !important;
          }
          .instructions-hero-art-wrapper {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .instructions-grid-2col {
            grid-template-columns: 1fr !important;
          }
          .stepper-line {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
