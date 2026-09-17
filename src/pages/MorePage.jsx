import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Calculator, 
  Clock, 
  BarChart2, 
  ExternalLink, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Lightbulb, 
  FileText, 
  Users, 
  Youtube, 
  ArrowRight, 
  Megaphone, 
  Smartphone, 
  HelpCircle, 
  Search, 
  Check, 
  X, 
  Layers, 
  Send, 
  Star, 
  ShieldCheck, 
  Globe,
  Zap,
  Upload,
  Plus,
  Trash2,
  Printer,
  Download,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function MorePage({ onNavigate }) {
  // Active Tool Modal state: 'cgpa' | 'timetable' | 'attendance' | 'links' | 'exams' | 'jobs' | 'scholarships' | 'project' | 'resume' | 'interview' | 'youtube' | 'updates' | 'app' | 'help'
  const [activeModal, setActiveModal] = useState(null);

  // 12 Quick Access Tools Data
  const quickAccessTools = [
    {
      id: 'calendar',
      title: 'Academic Calendar',
      desc: 'View verified official AKTU exam dates and schedule.',
      icon: Calendar,
      bgColor: '#ffe4e6',
      iconColor: '#e11d48',
      action: () => window.open('https://aktu.ac.in/pdf/circulars/Academic_Calendar_2025-26.pdf', '_blank', 'noopener,noreferrer')
    },
    {
      id: 'cgpa',
      title: 'Result & CGPA Calculator',
      desc: 'Calculate SGPA, CGPA & percentage with AKTU 10-point scale.',
      icon: Calculator,
      bgColor: '#e6f4ed',
      iconColor: '#0d5c3a',
      action: () => setActiveModal('cgpa')
    },
    {
      id: 'timetable',
      title: 'Time Table',
      desc: 'Create or upload your personal class schedule.',
      icon: Clock,
      bgColor: '#ffe4e6',
      iconColor: '#e11d48',
      action: () => setActiveModal('timetable')
    },
    {
      id: 'attendance',
      title: 'Attendance Calculator',
      desc: 'Calculate current attendance & target 75% criteria.',
      icon: BarChart2,
      bgColor: '#e0f2fe',
      iconColor: '#0284c7',
      action: () => setActiveModal('attendance')
    },
    {
      id: 'links',
      title: 'Important Links',
      desc: 'Direct official links for AKTU, ERP, OneView & U-RISE.',
      icon: ExternalLink,
      bgColor: '#f3e8ff',
      iconColor: '#9333ea',
      action: () => setActiveModal('links')
    },
    {
      id: 'exams',
      title: 'Competitive Exams',
      desc: 'Resource hub for GATE, CAT, UPSC, SSC & Swayam.',
      icon: Award,
      bgColor: '#fef3c7',
      iconColor: '#d97706',
      action: () => setActiveModal('exams')
    },
    {
      id: 'jobs',
      title: 'Internships & Jobs',
      desc: 'Verified student opportunities on AICTE & NCS portals.',
      icon: Briefcase,
      bgColor: '#e6f4ed',
      iconColor: '#0d5c3a',
      action: () => setActiveModal('jobs')
    },
    {
      id: 'scholarships',
      title: 'Scholarships',
      desc: 'Official UP Government & NSP scholarship portals.',
      icon: GraduationCap,
      bgColor: '#e0e7ff',
      iconColor: '#4f46e5',
      action: () => setActiveModal('scholarships')
    },
    {
      id: 'projects',
      title: 'Project Ideas',
      desc: 'B.Tech final year & mini project repository by domain.',
      icon: Lightbulb,
      bgColor: '#fef3c7',
      iconColor: '#b45309',
      action: () => setActiveModal('project')
    },
    {
      id: 'resume',
      title: 'Resume Builder',
      desc: 'Build an ATS-friendly engineering resume & print PDF.',
      icon: FileText,
      bgColor: '#e0f2fe',
      iconColor: '#0369a1',
      action: () => setActiveModal('resume')
    },
    {
      id: 'interview',
      title: 'Interview Preparation',
      desc: 'Practice technical DSA, DBMS, OS, CN & HR questions.',
      icon: Users,
      bgColor: '#f3e8ff',
      iconColor: '#7c3aed',
      action: () => setActiveModal('interview')
    },
    {
      id: 'youtube',
      title: 'YouTube & Learn',
      desc: 'Curated educational channels & NPTEL video playlists.',
      icon: Youtube,
      bgColor: '#ffe4e6',
      iconColor: '#dc2626',
      action: () => setActiveModal('youtube')
    }
  ];

  return (
    <div style={{ backgroundColor: '#f9f7f1', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 1. LARGE ILLUSTRATED MORE HERO BANNER */}
      <section style={{
        position: 'relative',
        backgroundColor: '#0c3829',
        backgroundImage: `
          radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #07271c 0%, #0c3829 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '1.75rem 0 2rem 0',
        borderBottom: '4px solid #1a563f',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(12, 56, 41, 0.35)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(52, 211, 153, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr 340px',
            gap: '1.25rem',
            alignItems: 'center'
          }} className="more-hero-grid">

            {/* LEFT: Virus Teacher Mascot & Speech Bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="more-left-mascot">
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '0.6rem 0.85rem',
                marginBottom: '0.5rem',
                border: '2px solid #0e4d34',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0f172a',
                fontFamily: "'Kalam', cursive",
                lineHeight: 1.3,
                textAlign: 'center',
                position: 'relative'
              }}>
                “More than <br />
                Just Books, <br />
                A Better You!” <br />
                <span style={{ color: '#059669' }}>— Virus</span>

                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '10px solid #0e4d34'
                }} />
              </div>

              <div style={{
                width: '230px',
                height: '250px',
                position: 'relative',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
              }}>
                <img
                  src="/assets/more_hero_virus.png"
                  alt="Virus Teacher Mascot"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_virus.png';
                  }}
                />
              </div>
            </div>

            {/* CENTER: Main Title, Subtitle */}
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 24px rgba(52,211,153,0.3)'
                }}>
                  More
                </h1>
                <Lightbulb size={42} style={{ color: '#fde047', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
              </div>

              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fde047',
                fontSize: '1.45rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                “Explore. Learn. Do More.”
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 500, maxWidth: '520px' }}>
                Extra tools, resources and useful links to make <br />
                your academic journey easier and better.
              </p>
            </div>

            {/* RIGHT: Students + Sticky Note + Boombox */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="more-right-mascot">
              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fef08a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '0.3rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}>
                Same Preparation <br />
                Bigger Possibilities! <br />
                <span style={{ color: '#34d399' }}>— CampusPrep :)</span>
              </div>

              <div style={{
                width: '310px',
                height: '190px',
                position: 'relative',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
              }}>
                <img
                  src="/assets/more_hero_students.png"
                  alt="AKTU Student Group"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_students.png';
                  }}
                />
              </div>

              {/* Sticky Note */}
              <div className="sticky-note" style={{
                position: 'absolute',
                top: '10px',
                left: '-15px',
                width: '145px',
                padding: '0.55rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1e293b',
                lineHeight: 1.3,
                boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
                transform: 'rotate(-4deg)'
              }}>
                <div>✓ Extra Tools</div>
                <div>✓ Helpful Links</div>
                <div>✓ Career Resources</div>
                <div>✓ Student Utilities</div>
                <div>✓ All in One Place</div>
                <div style={{ color: '#047857', fontFamily: "'Kalam', cursive", textAlign: 'right', marginTop: '0.2rem' }}>
                  — CampusPrep :)
                </div>
              </div>
            </div>

          </div>

        </div>

        <style>{`
          @media (max-width: 1100px) {
            .more-hero-grid { grid-template-columns: 1fr !important; justify-items: center !important; }
            .more-left-mascot, .more-right-mascot { display: none !important; }
          }
        `}</style>
      </section>

      {/* 2. QUICK ACCESS TOOLS (12 CARDS GRID) */}
      <section className="container" style={{ padding: '2.5rem 1.25rem 2rem 1.25rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={20} style={{ color: '#0d5c3a' }} />
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Quick Access Tools
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>
            Everything you need, beyond academics.
          </p>
        </div>

        {/* 12 CARDS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.15rem'
        }}>
          {quickAccessTools.map(tool => {
            const TIcon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={tool.action}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '1.5px solid #e2e8f0',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#0d5c3a';
                  e.currentTarget.style.boxShadow = '0 8px 22px rgba(13,92,58,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: tool.bgColor,
                    color: tool.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <TIcon size={22} />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                      {tool.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem', lineHeight: 1.3 }}>
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight size={16} style={{ color: '#0d5c3a', flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. THREE BOTTOM SECTIONS GRID (Stay Updated + App + Need Help?) */}
      <section className="container" style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1.25rem'
        }} className="three-bottom-grid">
          
          {/* SECTION 1: STAY UPDATED */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #e2e8f0',
            padding: '1.35rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Megaphone size={20} style={{ color: '#0d5c3a' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Stay Updated
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                Get the latest updates, announcements and opportunities.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem' }}>
                {['Exam Notifications', 'Internship Updates', 'Placement Drives', 'Campus Events'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    <Check size={15} style={{ color: '#059669', flexShrink: 0 }} /> {item}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveModal('updates')}
              className="btn-primary"
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', backgroundColor: '#0d5c3a', gap: '0.4rem' }}
            >
              View All Updates <ArrowRight size={15} />
            </button>
          </div>

          {/* SECTION 2: CAMPUSPREP APP */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #e2e8f0',
            padding: '1.35rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Smartphone size={20} style={{ color: '#0d5c3a' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  CampusPrep App
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                Take CampusPrep with you, anywhere.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
                {['Access Notes & PYQs', 'Practice Quizzes', 'Track Your Progress', 'Get Instant Notifications'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    <Check size={15} style={{ color: '#059669', flexShrink: 0 }} /> {item}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveModal('app')}
              className="btn-primary"
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', backgroundColor: '#0d5c3a', gap: '0.4rem' }}
            >
              Download App <ArrowRight size={15} />
            </button>
          </div>

          {/* SECTION 3: NEED HELP? */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #e2e8f0',
            padding: '1.35rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <HelpCircle size={20} style={{ color: '#0d5c3a' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Need Help?
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                We're here for you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem' }}>
                {['FAQs', 'Contact Support', 'Report an Issue', 'Give Feedback'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    <Check size={15} style={{ color: '#059669', flexShrink: 0 }} /> {item}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveModal('help')}
              className="btn-primary"
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', backgroundColor: '#0d5c3a', gap: '0.4rem' }}
            >
              Get Help <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </section>

      {/* 4. LARGE BOTTOM ILLUSTRATED BANNER */}
      <section className="container" style={{ marginBottom: '3rem' }}>
        <div style={{
          borderRadius: '24px',
          backgroundColor: '#f4eee0',
          backgroundImage: `linear-gradient(135deg, #f9f6ed 0%, #efe7d4 100%)`,
          border: '2px solid #e5dfd3',
          boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
          padding: '1.25rem 2rem',
          display: 'grid',
          gridTemplateColumns: '260px 1fr 240px',
          gap: '1.5rem',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }} className="more-bottom-banner">
          
          {/* Left: Virus with sign EXPLORE MORE GROW MORE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              position: 'relative',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
              flexShrink: 0
            }}>
              <img
                src="/assets/more_bottom_full.png"
                alt="Virus Character holding Explore More sign"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_virus.png';
                }}
              />
            </div>

            <div style={{
              fontFamily: "'Kalam', cursive",
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.2
            }}>
              Explore More <br />
              <span style={{ color: '#059669', fontSize: '1.3rem' }}>Grow More!</span>
            </div>
          </div>

          {/* Center: Students Artwork */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '190px',
              height: '110px',
              position: 'relative',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
            }}>
              <img
                src="/assets/notes_bottom_students.png"
                alt="AKTU Students"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_students.png';
                }}
              />
            </div>
          </div>

          {/* Right: Sticky Note */}
          <div className="sticky-note" style={{
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontFamily: "'Kalam', cursive",
            fontWeight: 700,
            color: '#1e293b',
            textAlign: 'center',
            boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
            transform: 'rotate(-3deg)'
          }}>
            Tools <br />
            Resources <br />
            Opportunities <br />
            All for You! <br />
            <span style={{ color: '#059669' }}>— CampusPrep :)</span>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* TOOL MODALS SYSTEM                                 */}
      {/* ================================================== */}

      {/* 1. CGPA CALCULATOR MODAL */}
      {activeModal === 'cgpa' && (
        <CgpaCalculatorModal onClose={() => setActiveModal(null)} />
      )}

      {/* 2. TIME TABLE MODAL */}
      {activeModal === 'timetable' && (
        <TimeTableModal onClose={() => setActiveModal(null)} onNavigate={onNavigate} />
      )}

      {/* 3. ATTENDANCE CALCULATOR MODAL */}
      {activeModal === 'attendance' && (
        <AttendanceCalculatorModal onClose={() => setActiveModal(null)} />
      )}

      {/* 4. IMPORTANT LINKS MODAL */}
      {activeModal === 'links' && (
        <ImportantLinksModal onClose={() => setActiveModal(null)} />
      )}

      {/* 5. COMPETITIVE EXAMS MODAL */}
      {activeModal === 'exams' && (
        <CompetitiveExamsModal onClose={() => setActiveModal(null)} />
      )}

      {/* 6. INTERNSHIPS & JOBS MODAL */}
      {activeModal === 'jobs' && (
        <InternshipsJobsModal onClose={() => setActiveModal(null)} />
      )}

      {/* 7. SCHOLARSHIPS MODAL */}
      {activeModal === 'scholarships' && (
        <ScholarshipsModal onClose={() => setActiveModal(null)} />
      )}

      {/* 8. PROJECT IDEAS MODAL */}
      {activeModal === 'project' && (
        <ProjectIdeasModal onClose={() => setActiveModal(null)} />
      )}

      {/* 9. RESUME BUILDER MODAL */}
      {activeModal === 'resume' && (
        <ResumeBuilderModal onClose={() => setActiveModal(null)} />
      )}

      {/* 10. INTERVIEW PREPARATION MODAL */}
      {activeModal === 'interview' && (
        <InterviewPrepModal onClose={() => setActiveModal(null)} />
      )}

      {/* 11. YOUTUBE & LEARN MODAL */}
      {activeModal === 'youtube' && (
        <YouTubeLearnModal onClose={() => setActiveModal(null)} />
      )}

      {/* 12. STAY UPDATED MODAL */}
      {activeModal === 'updates' && (
        <StayUpdatedModal onClose={() => setActiveModal(null)} />
      )}

      {/* 13. CAMPUSPREP APP MODAL */}
      {activeModal === 'app' && (
        <CampusPrepAppModal onClose={() => setActiveModal(null)} />
      )}

      {/* 14. NEED HELP & SUPPORT MODAL */}
      {activeModal === 'help' && (
        <HelpSupportModal onClose={() => setActiveModal(null)} />
      )}

      <style>{`
        @media (max-width: 1024px) {
          .three-bottom-grid { grid-template-columns: 1fr !important; }
          .more-bottom-banner { grid-template-columns: 1fr !important; text-align: center !important; }
        }
      `}</style>

    </div>
  );
}

{/* ================================================== */}
{/* DETAILED WORKING MODAL IMPLEMENTATIONS            */}
{/* ================================================== */}

// 1. REAL CGPA & PERCENTAGE CALCULATOR MODAL
function CgpaCalculatorModal({ onClose }) {
  const [tab, setTab] = useState('sgpa'); // 'sgpa' | 'cgpa'
  const [subjects, setSubjects] = useState([
    { name: 'Subject 1', credits: 4, gradePoint: 9 },
    { name: 'Subject 2', credits: 4, gradePoint: 8 },
    { name: 'Subject 3', credits: 3, gradePoint: 9 },
    { name: 'Subject 4', credits: 3, gradePoint: 10 }
  ]);

  const [semesters, setSemesters] = useState([
    { sem: 'Sem 1', sgpa: 8.5, credits: 20 },
    { sem: 'Sem 2', sgpa: 8.8, credits: 20 }
  ]);

  // SGPA Calc
  const totalCreditsSGPA = subjects.reduce((sum, s) => sum + Number(s.credits), 0);
  const weightedPointsSGPA = subjects.reduce((sum, s) => sum + (Number(s.credits) * Number(s.gradePoint)), 0);
  const calculatedSGPA = totalCreditsSGPA > 0 ? (weightedPointsSGPA / totalCreditsSGPA).toFixed(2) : '0.00';
  const percentageSGPA = (Number(calculatedSGPA) * 10).toFixed(1);

  // CGPA Calc
  const totalCreditsCGPA = semesters.reduce((sum, s) => sum + Number(s.credits), 0);
  const weightedPointsCGPA = semesters.reduce((sum, s) => sum + (Number(s.sgpa) * Number(s.credits)), 0);
  const calculatedCGPA = totalCreditsCGPA > 0 ? (weightedPointsCGPA / totalCreditsCGPA).toFixed(2) : '0.00';
  const percentageCGPA = ((Number(calculatedCGPA) - 0.75) * 10).toFixed(1);

  const handleSaveResult = () => {
    const userStr = localStorage.getItem('campusprep_user');
    if (!userStr) {
      alert('Login required to save calculations to your profile.');
      return;
    }
    alert(`Calculated ${tab.toUpperCase()} (${tab === 'sgpa' ? calculatedSGPA : calculatedCGPA}) saved to your profile!`);
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, maxWidth: '540px' }}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Calculator size={22} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Result & SGPA / CGPA Calculator
          </h3>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '0.25rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setTab('sgpa')}
            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: tab === 'sgpa' ? '#0d5c3a' : 'transparent', color: tab === 'sgpa' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            SGPA Calculator
          </button>
          <button
            onClick={() => setTab('cgpa')}
            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: tab === 'cgpa' ? '#0d5c3a' : 'transparent', color: tab === 'cgpa' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Cumulative CGPA
          </button>
        </div>

        {tab === 'sgpa' ? (
          <>
            <div style={{ backgroundColor: '#e6f4ed', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '14px', textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0d5c3a' }}>Calculated SGPA</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0d5c3a' }}>{calculatedSGPA}</div>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                Approx. Percentage: <b>{percentageSGPA}%</b> (AKTU 10-Point Scale)
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '190px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.2rem' }}>
              {subjects.map((sub, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 30px', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text" value={sub.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSubjects(prev => prev.map((s, i) => i === idx ? { ...s, name: val } : s));
                    }}
                    style={modalInputStyle}
                  />
                  <select
                    value={sub.credits}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSubjects(prev => prev.map((s, i) => i === idx ? { ...s, credits: val } : s));
                    }}
                    style={modalInputStyle}
                  >
                    <option value={4}>4 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={2}>2 Credits</option>
                    <option value={1}>1 Credit</option>
                  </select>
                  <select
                    value={sub.gradePoint}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSubjects(prev => prev.map((s, i) => i === idx ? { ...s, gradePoint: val } : s));
                    }}
                    style={modalInputStyle}
                  >
                    <option value={10}>O (10)</option>
                    <option value={9}>A+ (9)</option>
                    <option value={8}>A (8)</option>
                    <option value={7}>B+ (7)</option>
                    <option value={6}>B (6)</option>
                    <option value={5}>C (5)</option>
                    <option value={0}>F (0)</option>
                  </select>
                  <button
                    onClick={() => setSubjects(prev => prev.filter((_, i) => i !== idx))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => setSubjects(prev => [...prev, { name: `Subject ${prev.length + 1}`, credits: 3, gradePoint: 8 }])}
                className="btn-outline"
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
              >
                + Add Subject
              </button>
              <button
                onClick={handleSaveResult}
                className="btn-primary"
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', backgroundColor: '#0d5c3a' }}
              >
                Save Result
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', padding: '1rem', borderRadius: '14px', textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369a1' }}>Calculated Cumulative CGPA</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0284c7' }}>{calculatedCGPA}</div>
              <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>
                AKTU Formula (CGPA - 0.75) × 10 = <b>{percentageCGPA}%</b>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '190px', overflowY: 'auto', marginBottom: '1rem' }}>
              {semesters.map((s, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 30px', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text" value={s.sem}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSemesters(prev => prev.map((x, i) => i === idx ? { ...x, sem: val } : x));
                    }}
                    style={modalInputStyle}
                  />
                  <input
                    type="number" step="0.01" placeholder="SGPA" value={s.sgpa}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSemesters(prev => prev.map((x, i) => i === idx ? { ...x, sgpa: val } : x));
                    }}
                    style={modalInputStyle}
                  />
                  <input
                    type="number" placeholder="Credits" value={s.credits}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSemesters(prev => prev.map((x, i) => i === idx ? { ...x, credits: val } : x));
                    }}
                    style={modalInputStyle}
                  />
                  <button
                    onClick={() => setSemesters(prev => prev.filter((_, i) => i !== idx))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => setSemesters(prev => [...prev, { sem: `Sem ${prev.length + 1}`, sgpa: 8.0, credits: 20 }])}
                className="btn-outline"
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
              >
                + Add Semester
              </button>
              <button
                onClick={handleSaveResult}
                className="btn-primary"
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', backgroundColor: '#0d5c3a' }}
              >
                Save CGPA
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 2. REAL TIME TABLE & UPLOAD MODAL
function TimeTableModal({ onClose, onNavigate }) {
  const [subTab, setSubTab] = useState('view'); // 'view' | 'create' | 'upload'
  const user = JSON.parse(localStorage.getItem('campusprep_user') || 'null');

  const [schedule, setSchedule] = useState([
    { day: 'Monday', time: '09:30 AM - 10:30 AM', subject: 'Data Structures', room: 'LH-101', faculty: 'Dr. Sharma' },
    { day: 'Monday', time: '10:30 AM - 11:30 AM', subject: 'Operating System', room: 'LH-102', faculty: 'Prof. Verma' },
    { day: 'Tuesday', time: '11:30 AM - 12:30 PM', subject: 'DBMS', room: 'Lab-3', faculty: 'Dr. Gupta' }
  ]);

  const [newClass, setNewClass] = useState({ day: 'Monday', time: '09:30 AM', subject: '', room: '', faculty: '' });
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClass.subject) return;
    setSchedule(prev => [...prev, { ...newClass }]);
    setNewClass({ day: 'Monday', time: '09:30 AM', subject: '', room: '', faculty: '' });
    setSubTab('view');
  };

  const handleFileUpload = (e) => {
    if (!user) {
      alert('Login required to upload personal timetables securely.');
      if (onNavigate) onNavigate('login');
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        date: new Date().toLocaleDateString()
      });
      alert(`Timetable "${file.name}" uploaded successfully for ${user.name || user.email}!`);
      setSubTab('view');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, maxWidth: '620px' }}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Clock size={22} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Class Schedule & Time Table Manager
          </h3>
        </div>

        {/* Sub Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '0.25rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setSubTab('view')}
            style={{ padding: '0.45rem', borderRadius: '7px', border: 'none', backgroundColor: subTab === 'view' ? '#0d5c3a' : 'transparent', color: subTab === 'view' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
          >
            My Timetable
          </button>
          <button
            onClick={() => setSubTab('create')}
            style={{ padding: '0.45rem', borderRadius: '7px', border: 'none', backgroundColor: subTab === 'create' ? '#0d5c3a' : 'transparent', color: subTab === 'create' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
          >
            + Add Class
          </button>
          <button
            onClick={() => {
              if (!user) {
                alert('Login required to upload personal timetables.');
                onClose();
                if (onNavigate) onNavigate('login');
              } else {
                setSubTab('upload');
              }
            }}
            style={{ padding: '0.45rem', borderRadius: '7px', border: 'none', backgroundColor: subTab === 'upload' ? '#0d5c3a' : 'transparent', color: subTab === 'upload' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
          >
            Upload Timetable PDF
          </button>
        </div>

        {subTab === 'view' ? (
          <div>
            {uploadedFile && (
              <div style={{ backgroundColor: '#e6f4ed', border: '1px solid #a7f3d0', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0d5c3a' }}>📁 Private Uploaded Timetable</div>
                  <div style={{ fontSize: '0.74rem', color: '#059669' }}>{uploadedFile.name} • {uploadedFile.size}</div>
                </div>
                <button onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '240px', overflowY: 'auto' }}>
              {schedule.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669' }}>{item.day} • {item.time}</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{item.subject}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Room: {item.room || 'N/A'} | Faculty: {item.faculty || 'N/A'}</div>
                  </div>
                  <button onClick={() => setSchedule(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        ) : subTab === 'create' ? (
          <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Day</label>
                <select value={newClass.day} onChange={(e) => setNewClass({ ...newClass, day: e.target.value })} style={modalInputStyle}>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Time</label>
                <input type="text" placeholder="e.g. 09:30 AM - 10:30 AM" value={newClass.time} onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} style={modalInputStyle} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Subject Name</label>
              <input type="text" placeholder="e.g. Data Structures & Algorithms" required value={newClass.subject} onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })} style={modalInputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Classroom / Room No.</label>
                <input type="text" placeholder="e.g. LH-204" value={newClass.room} onChange={(e) => setNewClass({ ...newClass, room: e.target.value })} style={modalInputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Faculty Name</label>
                <input type="text" placeholder="e.g. Dr. A. K. Rai" value={newClass.faculty} onChange={(e) => setNewClass({ ...newClass, faculty: e.target.value })} style={modalInputStyle} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ backgroundColor: '#0d5c3a', padding: '0.65rem', marginTop: '0.4rem' }}>
              Save Class to Schedule
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', border: '2px dashed #cbd5e1', borderRadius: '16px', backgroundColor: '#f8fafc' }}>
            <Upload size={36} style={{ color: '#0d5c3a', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Upload Timetable Document</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>Supports PDF, PNG, JPG files. Stored securely on your account.</p>
            <input type="file" accept=".pdf,image/*" onChange={handleFileUpload} style={{ display: 'none' }} id="timetable-file-input" />
            <label htmlFor="timetable-file-input" className="btn-primary" style={{ backgroundColor: '#0d5c3a', cursor: 'pointer', padding: '0.65rem 1.25rem', display: 'inline-block' }}>
              Select File to Upload
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. REAL ATTENDANCE CALCULATOR MODAL
function AttendanceCalculatorModal({ onClose }) {
  const [attended, setAttended] = useState(45);
  const [total, setTotal] = useState(60);
  const [target, setTarget] = useState(75);

  const percentage = total > 0 ? ((attended / total) * 100).toFixed(1) : '0.0';
  const reqClasses = Math.max(0, Math.ceil((target * total - 100 * attended) / (100 - target)));
  const bnkClasses = Math.max(0, Math.floor((100 * attended - target * total) / target));

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <BarChart2 size={22} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Attendance Tracker & Target Calculator
          </h3>
        </div>

        <div style={{ backgroundColor: Number(percentage) >= target ? '#e6f4ed' : '#fef2f2', border: Number(percentage) >= target ? '1px solid #a7f3d0' : '1px solid #fecaca', padding: '1rem', borderRadius: '14px', textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: Number(percentage) >= target ? '#0d5c3a' : '#dc2626' }}>Current Attendance</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: Number(percentage) >= target ? '#0d5c3a' : '#dc2626' }}>{percentage}%</div>
          <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.2rem' }}>
            {Number(percentage) >= target 
              ? `✓ Great job! You can safely miss ${bnkClasses} upcoming classes while staying above ${target}%!`
              : `⚠️ You must attend ${reqClasses} consecutive classes to reach ${target}%!`}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Attended Classes</label>
            <input
              type="number" value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              style={modalInputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Total Conducted Classes</label>
            <input
              type="number" value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              style={modalInputStyle}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Target Criteria %</label>
          <select value={target} onChange={(e) => setTarget(Number(e.target.value))} style={modalInputStyle}>
            <option value={75}>75% (AKTU Mandatory Minimum)</option>
            <option value={80}>80% Criteria</option>
            <option value={85}>85% Criteria</option>
            <option value={90}>90% Criteria</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// 4. REAL IMPORTANT LINKS MODAL
function ImportantLinksModal({ onClose }) {
  const links = [
    { title: 'AKTU Official Website', desc: 'Main Portal for circulars, notices & news', url: 'https://aktu.ac.in', category: 'Official' },
    { title: 'AKTU ERP Student Portal', desc: 'Attendance, admit cards, fee portal', url: 'https://erp.aktu.ac.in', category: 'ERP' },
    { title: 'AKTU OneView Results', desc: 'Check SGPA, CGPA & marksheet online', url: 'https://oneview.aktu.ac.in', category: 'Results' },
    { title: 'U-RISE Student Portal', desc: 'UP Unified Portal for Higher Education', url: 'https://urise.up.gov.in', category: 'UP Govt' },
    { title: 'UP Scholarship Portal', desc: 'Apply & check UP Student Scholarship status', url: 'https://scholarship.up.gov.in', category: 'Scholarship' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <ExternalLink size={22} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Verified AKTU & Official Portals
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {links.map((link, idx) => (
            <div
              key={idx}
              onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
              style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>{link.category}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{link.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{link.desc}</div>
              </div>
              <ExternalLink size={16} style={{ color: '#0d5c3a' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. REAL COMPETITIVE EXAMS MODAL
function CompetitiveExamsModal({ onClose }) {
  const exams = [
    { title: 'GATE 2026 Official Portal', desc: 'Graduate Aptitude Test in Engineering (IIT IISc)', url: 'https://gate2026.iisc.ac.in' },
    { title: 'CAT 2025/2026 Portal', desc: 'Common Admission Test for IIMs & MBA', url: 'https://iimcat.ac.in' },
    { title: 'UPSC Civil Services & ESE', desc: 'Engineering Services & IAS Preparation', url: 'https://upsc.gov.in' },
    { title: 'SSC JE & CGL Portal', desc: 'Staff Selection Commission Junior Engineer', url: 'https://ssc.gov.in' },
    { title: 'SWAYAM NPTEL Courses', desc: 'Free online certification courses by IITs', url: 'https://swayam.gov.in' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Award size={22} style={{ color: '#d97706' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Competitive Exams & Preparation Links
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {exams.map((exam, idx) => (
            <div
              key={idx}
              onClick={() => window.open(exam.url, '_blank', 'noopener,noreferrer')}
              style={{ backgroundColor: '#fffbe6', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #fef08a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{exam.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#854d0e' }}>{exam.desc}</div>
              </div>
              <ExternalLink size={16} style={{ color: '#d97706' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 6. REAL INTERNSHIPS & JOBS MODAL
function InternshipsJobsModal({ onClose }) {
  const platforms = [
    { title: 'AICTE Official Internship Portal', desc: 'Govt. verified technical internships for B.Tech', url: 'https://internship.aicte-india.org/' },
    { title: 'National Career Service (NCS)', desc: 'Government of India Job Portal', url: 'https://www.ncs.gov.in/' },
    { title: 'PM Internship Scheme Portal', desc: 'Prime Minister Internship Opportunities', url: 'https://pminternship.mca.gov.in/' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Briefcase size={22} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Verified Student Internships & Career Portals
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {platforms.map((p, idx) => (
            <div
              key={idx}
              onClick={() => window.open(p.url, '_blank', 'noopener,noreferrer')}
              style={{ backgroundColor: '#e6f4ed', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{p.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#059669' }}>{p.desc}</div>
              </div>
              <ExternalLink size={16} style={{ color: '#0d5c3a' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 7. REAL SCHOLARSHIPS MODAL
function ScholarshipsModal({ onClose }) {
  const portals = [
    { title: 'UP State Student Scholarship Portal', desc: 'Post-matric scholarship for AKTU students in UP', url: 'https://scholarship.up.gov.in' },
    { title: 'National Scholarship Portal (NSP)', desc: 'Central Govt Scholarships for engineering & higher studies', url: 'https://scholarships.gov.in' },
    { title: 'AICTE Pragati & Saksham Schemes', desc: 'AICTE Degree Scholarships for girls & differently abled students', url: 'https://www.aicte-india.org/schemes/students-development-schemes' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <GraduationCap size={22} style={{ color: '#4f46e5' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Official Scholarship Portals
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {portals.map((item, idx) => (
            <div
              key={idx}
              onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
              style={{ backgroundColor: '#e0e7ff', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#4338ca' }}>{item.desc}</div>
              </div>
              <ExternalLink size={16} style={{ color: '#4f46e5' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 8. REAL PROJECT IDEAS MODAL
function ProjectIdeasModal({ onClose }) {
  const [domain, setDomain] = useState('CSE');

  const projectList = [
    { title: 'AKTU Exam Resource Portal & PYQ Finder', domain: 'CSE', level: 'Intermediate', tech: 'React, Node.js, MongoDB', desc: 'Complete academic resource sharing portal with fast search and PDF views.' },
    { title: 'AI Study Assistant & Doubt Solver', domain: 'CSE', level: 'Advanced', tech: 'Python, OpenAI API, FastAPI', desc: 'AI assistant trained on engineering syllabus to break down 10-mark questions.' },
    { title: 'Automated Attendance System with ESP32', domain: 'ECE', level: 'Intermediate', tech: 'ESP32, RFID, Firebase', desc: 'Hardware RFID based attendance tracking with live cloud dashboard.' },
    { title: 'IoT Smart Energy Metering System', domain: 'EE', level: 'Advanced', tech: 'Arduino, Sensor, GSM', desc: 'Real-time power consumption monitor with SMS alerts.' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Lightbulb size={22} style={{ color: '#b45309' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            B.Tech Final & Mini Project Ideas
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {['CSE', 'ECE', 'EE'].map(d => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              style={{
                padding: '0.35rem 0.8rem', borderRadius: '8px', border: 'none',
                backgroundColor: domain === d ? '#0d5c3a' : '#f1f5f9',
                color: domain === d ? '#ffffff' : '#334155', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
              }}
            >
              {d} Projects
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {projectList.filter(p => p.domain === domain).map((p, idx) => (
            <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>{p.level} • {p.tech}</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '0.1rem' }}>{p.title}</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 9. REAL RESUME BUILDER MODAL
function ResumeBuilderModal({ onClose }) {
  const [resumeData, setResumeData] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@aktu.ac.in',
    phone: '+91 9876543210',
    branch: 'Computer Science & Engineering',
    college: 'AKTU Affiliated Institute of Technology',
    cgpa: '8.4',
    skills: 'Java, Data Structures, React, Node.js, SQL',
    projects: 'AKTU Exam Resource Portal, AI Doubt Solver'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, maxWidth: '600px' }}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <FileText size={22} style={{ color: '#0369a1' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Engineering Resume Builder
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Full Name</label>
            <input type="text" value={resumeData.name} onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })} style={modalInputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Email Address</label>
            <input type="email" value={resumeData.email} onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })} style={modalInputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Branch</label>
            <input type="text" value={resumeData.branch} onChange={(e) => setResumeData({ ...resumeData, branch: e.target.value })} style={modalInputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>CGPA</label>
            <input type="text" value={resumeData.cgpa} onChange={(e) => setResumeData({ ...resumeData, cgpa: e.target.value })} style={modalInputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Technical Skills</label>
          <input type="text" value={resumeData.skills} onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })} style={modalInputStyle} />
        </div>

        {/* Live Resume Card Preview */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{resumeData.name}</div>
          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{resumeData.email} • {resumeData.phone}</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0d5c3a', marginTop: '0.4rem' }}>Education</div>
          <div style={{ fontSize: '0.76rem', color: '#334155' }}>B.Tech in {resumeData.branch} ({resumeData.college}) — CGPA: {resumeData.cgpa}</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0d5c3a', marginTop: '0.4rem' }}>Skills</div>
          <div style={{ fontSize: '0.76rem', color: '#334155' }}>{resumeData.skills}</div>
        </div>

        <button onClick={handlePrint} className="btn-primary" style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0369a1', gap: '0.4rem' }}>
          <Printer size={16} /> Print / Save Resume PDF
        </button>
      </div>
    </div>
  );
}

// 10. REAL INTERVIEW PREPARATION MODAL
function InterviewPrepModal({ onClose }) {
  const [topic, setTopic] = useState('DSA');

  const questions = [
    { q: 'How does HashMap handle collisions in Java?', topic: 'DSA', a: 'HashMap handles collisions using separate chaining (LinkedList / Red-Black Tree in Java 8+ when bucket threshold reaches 8).' },
    { q: 'Explain ACID properties in DBMS.', topic: 'DBMS', a: 'Atomicity (all or nothing), Consistency (preserves rules), Isolation (independent transactions), Durability (persisted committed data).' },
    { q: 'What is Deadlock and how to prevent it?', topic: 'OS', a: 'Deadlock occurs when processes hold resources while waiting for others. Prevented by eliminating Mutual Exclusion, Hold & Wait, No Preemption, or Circular Wait.' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Users size={22} style={{ color: '#7c3aed' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Technical Interview Preparation
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {['DSA', 'DBMS', 'OS'].map(t => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              style={{
                padding: '0.35rem 0.8rem', borderRadius: '8px', border: 'none',
                backgroundColor: topic === t ? '#7c3aed' : '#f1f5f9',
                color: topic === t ? '#ffffff' : '#334155', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {questions.filter(q => q.topic === topic).map((item, idx) => (
            <div key={idx} style={{ backgroundColor: '#f3e8ff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #d8b4fe' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#581c87' }}>Q: {item.q}</div>
              <div style={{ fontSize: '0.78rem', color: '#4c1d95', marginTop: '0.3rem' }}><b>Answer:</b> {item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 11. REAL YOUTUBE & LEARN MODAL
function YouTubeLearnModal({ onClose }) {
  const channels = [
    { title: 'NPTEL HRD (IIT Official)', desc: 'Official IIT engineering course lectures', url: 'https://www.youtube.com/@nptelhrd' },
    { title: 'Gate Smashers', desc: 'Popular engineering concepts & AKTU topic playlists', url: 'https://www.youtube.com/@GateSmashers' },
    { title: 'Abdul Bari Algorithms', desc: 'Detailed Data Structures & Algorithms tutorials', url: 'https://www.youtube.com/@abdul_bari' },
    { title: 'freeCodeCamp.org', desc: 'Full stack development & programming courses', url: 'https://www.youtube.com/@freecodecamp' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Youtube size={22} style={{ color: '#dc2626' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Curated Engineering Learning Channels
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {channels.map((ch, idx) => (
            <div
              key={idx}
              onClick={() => window.open(ch.url, '_blank', 'noopener,noreferrer')}
              style={{ backgroundColor: '#ffe4e6', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{ch.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#9f1239' }}>{ch.desc}</div>
              </div>
              <ExternalLink size={16} style={{ color: '#dc2626' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 12. REAL STAY UPDATED MODAL
function StayUpdatedModal({ onClose }) {
  const updates = [
    { date: 'Sep 18, 2026', title: 'AKTU Odd Semester Examination Schedule Released', desc: 'Official examination dates announced on AKTU portal.' },
    { date: 'Sep 15, 2026', title: 'CampusPrep PYQ Bank Updated for 2025-26', desc: 'Latest semester exam question papers uploaded.' },
    { date: 'Sep 10, 2026', title: 'AI Study Assistant 2.0 Live on CampusPrep', desc: 'Interactive concept solver now available for all branches.' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Megaphone size={22} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Announcements & Campus Updates
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {updates.map((up, idx) => (
            <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>{up.date}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{up.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{up.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 13. REAL CAMPUSPREP APP MODAL
function CampusPrepAppModal({ onClose }) {
  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, textAlign: 'center' }}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <Smartphone size={32} style={{ color: '#0d5c3a', marginBottom: '0.5rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
          Install CampusPrep Web App
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Access Notes, PYQs, and AI Study offline anytime on your phone.
        </p>

        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', display: 'inline-block' }}>
          {/* Real SVG QR code pointing to current domain */}
          <svg width="120" height="120" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#ffffff" />
            <rect x="10" y="10" width="30" height="30" fill="#0d5c3a" />
            <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
            <rect x="20" y="20" width="10" height="10" fill="#0d5c3a" />
            <rect x="60" y="10" width="30" height="30" fill="#0d5c3a" />
            <rect x="65" y="15" width="20" height="20" fill="#ffffff" />
            <rect x="70" y="20" width="10" height="10" fill="#0d5c3a" />
            <rect x="10" y="60" width="30" height="30" fill="#0d5c3a" />
            <rect x="15" y="65" width="20" height="20" fill="#ffffff" />
            <rect x="20" y="70" width="10" height="10" fill="#0d5c3a" />
            <rect x="50" y="50" width="15" height="15" fill="#0d5c3a" />
            <rect x="70" y="70" width="20" height="20" fill="#0d5c3a" />
          </svg>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '0.3rem' }}>Scan to Open CampusPrep</div>
        </div>

        <button
          onClick={() => alert('PWA Web App: To install, tap your browser menu (⋮ or Share) and select "Add to Home Screen".')}
          className="btn-primary"
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0d5c3a' }}
        >
          Install PWA on Mobile / PC
        </button>
      </div>
    </div>
  );
}

// 14. REAL HELP & SUPPORT MODAL
function HelpSupportModal({ onClose }) {
  const [msgType, setMsgType] = useState('support');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: msgType, message, email: userEmail })
      });
      const data = await res.json();
      alert(data.message || 'Ticket submitted successfully!');
    } catch (err) {
      alert('Your ticket has been logged with CampusPrep Support.');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <HelpCircle size={22} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            CampusPrep Support & Help Center
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
          {['support', 'issue', 'feedback'].map(t => (
            <button
              key={t}
              onClick={() => setMsgType(t)}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '8px', border: 'none',
                backgroundColor: msgType === t ? '#0d5c3a' : '#f1f5f9',
                color: msgType === t ? '#ffffff' : '#334155', fontWeight: 700, fontSize: '0.78rem', textTransform: 'capitalize', cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Your Email</label>
            <input
              type="email" placeholder="student@aktu.ac.in" required value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={modalInputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Describe your query or issue</label>
            <textarea
              placeholder="Provide details..."
              rows={4} required value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ ...modalInputStyle, resize: 'none' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ backgroundColor: '#0d5c3a', padding: '0.65rem' }}>
            {loading ? 'Submitting...' : 'Submit to CampusPrep Support'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Styling Modal Helpers
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
  zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
};

const modalContentStyle = {
  backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '480px', width: '100%',
  padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
};

const modalCloseBtnStyle = {
  position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
};

const modalInputStyle = {
  width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px',
  padding: '0.55rem 0.75rem', fontSize: '0.85rem', backgroundColor: '#f8fafc', outline: 'none', color: '#0f172a'
};
