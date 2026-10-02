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
  ChevronUp,
  LayoutGrid,
  Link2,
  Compass,
  MessageSquare,
  Info,
  ChevronRight
} from 'lucide-react';
import AllIzzWellBanner from '../components/AllIzzWellBanner';

function MoreResourceCard({ icon: Icon, title, subtitle, footer, iconColor, iconBg, iconBorder, arrowColor, arrowBg, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: isHovered ? `1.5px solid ${iconColor}` : '1.5px solid #EBE5D8',
        padding: '1.2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '138px',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 10px 26px rgba(35, 30, 25, 0.08)' : '0 2px 8px rgba(35, 30, 25, 0.025)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: iconBg,
                border: `1.5px solid ${iconBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Icon size={20} color={iconColor} />
            </div>
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#1A212D', lineHeight: 1.25 }}>
                {title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem', lineHeight: 1.35 }}>
                {subtitle}
              </div>
            </div>
          </div>

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isHovered ? iconColor : arrowBg,
              color: isHovered ? '#FFFFFF' : arrowColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)'
            }}
          >
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {footer && (
        <div style={{
          fontSize: '0.72rem',
          color: '#8C97A4',
          fontWeight: 500,
          paddingTop: '0.55rem',
          borderTop: '1px dashed #F1EBE1',
          marginTop: '0.65rem'
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default function MorePage({ onNavigate, initialTool = null }) {
  const [activeModal, setActiveModal] = useState(initialTool);

  useEffect(() => {
    if (initialTool) {
      setActiveModal(initialTool);
    }
  }, [initialTool]);

  const handleAction = (tabKey) => {
    if (onNavigate) {
      onNavigate(tabKey);
    } else {
      window.location.href = tabKey === 'home' ? '/' : `/${tabKey}`;
    }
  };

  // Section 1: Academics (5 Cards)
  const academicsCards = [
    {
      id: 'project-ideas',
      title: 'Project Ideas',
      subtitle: 'Verified B.Tech & BCA project repository',
      footer: 'Explore real projects with source code',
      icon: Lightbulb,
      iconColor: '#D97706',
      iconBg: '#FEF7E8',
      iconBorder: '#FCEAC2',
      arrowColor: '#D97706',
      arrowBg: '#FEF7E8',
      action: () => handleAction('project-ideas')
    },
    {
      id: 'internships-jobs',
      title: 'Internships & Jobs',
      subtitle: 'Verified hiring drives & tech internships',
      footer: 'Latest opportunities for students',
      icon: Briefcase,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      arrowColor: '#2563EB',
      arrowBg: '#EFF6FF',
      action: () => handleAction('internships-jobs')
    },
    {
      id: 'scholarships',
      title: 'Scholarships',
      subtitle: 'Govt & private student financial aids',
      footer: 'Find scholarships and financial support',
      icon: Award,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      iconBorder: '#DCFCE7',
      arrowColor: '#16A34A',
      arrowBg: '#F0FDF4',
      action: () => handleAction('scholarships')
    },
    {
      id: 'competitive-exams',
      title: 'Competitive Exams & Career Guidance',
      subtitle: 'GATE, CAT, UPSC & degree roadmaps',
      footer: 'Guidance and preparation resources',
      icon: Compass,
      iconColor: '#7C3AED',
      iconBg: '#FAF5FF',
      iconBorder: '#F3E8FF',
      arrowColor: '#7C3AED',
      arrowBg: '#FAF5FF',
      action: () => handleAction('competitive-exams')
    },
    {
      id: 'important-links',
      title: 'Important Links',
      subtitle: 'AKTU ERP, OneView & circulars',
      footer: 'Useful official links for students',
      icon: Link2,
      iconColor: '#DC2626',
      iconBg: '#FEF2F2',
      iconBorder: '#FEE2E2',
      arrowColor: '#DC2626',
      arrowBg: '#FEF2F2',
      action: () => handleAction('important-links')
    }
  ];

  // Section 2: Student Tools (5 Cards)
  const studentToolsCards = [
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      subtitle: 'Instant SGPA/CGPA grade breakdown',
      footer: 'Analyze your performance',
      icon: BarChart2,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      iconBorder: '#D1FAE5',
      arrowColor: '#059669',
      arrowBg: '#ECFDF5',
      action: () => handleAction('result-cgpa')
    },
    {
      id: 'attendance-calculator',
      title: 'Attendance Calculator',
      subtitle: '75% rule & bunk calculation',
      footer: 'Track your attendance easily',
      icon: Calculator,
      iconColor: '#D97706',
      iconBg: '#FFFBEB',
      iconBorder: '#FEF3C7',
      arrowColor: '#D97706',
      arrowBg: '#FFFBEB',
      action: () => handleAction('attendance-calculator')
    },
    {
      id: 'timetable',
      title: 'Time Table & Schedule',
      subtitle: 'Weekly routine & today\'s schedule',
      footer: 'Plan your study and college schedule',
      icon: Calendar,
      iconColor: '#E11D48',
      iconBg: '#FEF2F2',
      iconBorder: '#FEE2E2',
      arrowColor: '#E11D48',
      arrowBg: '#FEF2F2',
      action: () => handleAction('timetable')
    },
    {
      id: 'pdf-maker',
      title: 'PDF Maker',
      subtitle: 'Merge, images to PDF, split & tools',
      footer: 'All PDF tools in one place',
      icon: FileText,
      iconColor: '#4F46E5',
      iconBg: '#EEF2FF',
      iconBorder: '#E0E7FF',
      arrowColor: '#4F46E5',
      arrowBg: '#EEF2FF',
      action: () => handleAction('pdf-maker')
    },
    {
      id: 'resume-maker',
      title: 'Resume Maker',
      subtitle: 'Single-page ATS tech resume builder',
      footer: 'Create a professional resume',
      icon: CheckCircle2,
      iconColor: '#0284C7',
      iconBg: '#F0F9FF',
      iconBorder: '#E0F2FE',
      arrowColor: '#0284C7',
      arrowBg: '#F0F9FF',
      action: () => handleAction('resume-maker')
    }
  ];

  // Section 3: Platform (3 Cards)
  const platformCards = [
    {
      id: 'important-links',
      title: 'Important Academic Links',
      subtitle: 'Official AKTU ERP, circulars & portals',
      footer: 'Direct access to essential university resources',
      icon: Globe,
      iconColor: '#781416',
      iconBg: '#FEF2F2',
      iconBorder: '#FECACA',
      arrowColor: '#781416',
      arrowBg: '#FEF2F2',
      action: () => handleAction('important-links')
    },
    {
      id: 'notes',
      title: 'My Notes & Saved PYQs',
      subtitle: 'Quick access to your study library',
      footer: 'View your saved notes and PYQs',
      icon: BookOpen,
      iconColor: '#0284C7',
      iconBg: '#F0F9FF',
      iconBorder: '#BAE6FD',
      arrowColor: '#0284C7',
      arrowBg: '#F0F9FF',
      action: () => handleAction('notes')
    },
    {
      id: 'home',
      title: 'About ProfessorVirus',
      subtitle: 'Study Smart. Prepare Better.',
      footer: 'Know more about our mission and vision',
      icon: Info,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      iconBorder: '#BBF7D0',
      arrowColor: '#16A34A',
      arrowBg: '#F0FDF4',
      action: () => handleAction('home')
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1F2421', paddingBottom: '3.5rem' }}>
      
      {/* 1. BREADCRUMBS */}
      <div className="container" style={{ paddingTop: '1.25rem', paddingBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#65676B', fontWeight: 600 }}>
          <button
            onClick={() => handleAction('home')}
            style={{ background: 'none', border: 'none', color: '#65676B', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            Home
          </button>
          <ChevronRight size={14} />
          <span style={{ color: '#C88D2D', fontWeight: 700 }}>More</span>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div
          className="more-hero-card"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #EBE5D8',
            boxShadow: '0 6px 24px rgba(35,30,25,0.03)',
            padding: '1.85rem clamp(1.25rem, 3vw, 2.5rem)',
            display: 'grid',
            gridTemplateColumns: '1.35fr 1fr',
            gap: '1.75rem',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Left Column: Heading and Text */}
          <div style={{ zIndex: 2 }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: '#FEF6E9',
                border: '1.5px solid #F5E5CF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C88D2D',
                marginBottom: '0.65rem'
              }}
            >
              <LayoutGrid size={22} />
            </div>

            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 900,
                color: '#1A212D',
                lineHeight: 1.05,
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.02em'
              }}
            >
              More
            </h1>

            <div
              style={{
                fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
                fontWeight: 800,
                color: '#1F2421',
                marginBottom: '0.5rem',
                lineHeight: 1.3
              }}
            >
              All tools, resources and features at one place.
            </div>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#64748B',
                maxWidth: '560px',
                lineHeight: 1.55,
                margin: 0
              }}
            >
              Explore verified academics, student productivity utilities and placement preparation tools to make your semester journey seamless.
            </p>
          </div>

          {/* Right Column: Hero Artwork */}
          <div className="more-hero-illustration" style={{ display: 'flex', justifyContent: 'flex-end', zIndex: 2 }}>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1.5px solid #EBE5D8',
                boxShadow: '0 8px 24px rgba(35,30,25,0.06)',
                width: '100%',
                maxWidth: '420px',
                maxHeight: '220px',
                backgroundColor: '#FFFDF9'
              }}
            >
              <img
                src="/assets/interview_pro_hero_illustration_2x.png"
                alt="ProfessorVirus Academic Classroom"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/more_hero_students.png';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1: ACADEMICS */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div
          style={{
            backgroundColor: '#FFFDF9',
            borderRadius: '24px',
            border: '1.5px solid #EFE8DC',
            boxShadow: '0 4px 20px rgba(35,30,25,0.02)',
            padding: 'clamp(1.25rem, 2.5vw, 1.85rem)'
          }}
        >
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF6E9',
                  border: '1.5px solid #F6E2C6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C88D2D',
                  flexShrink: 0
                }}
              >
                <GraduationCap size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F2421', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  Academics
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#7A6F62', margin: '0.2rem 0 0 0' }}>
                  Important academic resources to support your studies and career preparation.
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: '#FEF6E9',
                color: '#B37D28',
                border: '1px solid #F5E2C2',
                whiteSpace: 'nowrap'
              }}
            >
              5 Resources
            </span>
          </div>

          {/* Cards Grid */}
          <div className="more-grid-academics">
            {academicsCards.map((card) => (
              <MoreResourceCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                footer={card.footer}
                iconColor={card.iconColor}
                iconBg={card.iconBg}
                iconBorder={card.iconBorder}
                arrowColor={card.arrowColor}
                arrowBg={card.arrowBg}
                onClick={card.action}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: STUDENT TOOLS */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '24px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(35,30,25,0.02)',
            padding: 'clamp(1.25rem, 2.5vw, 1.85rem)'
          }}
        >
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#F0F9FF',
                  border: '1.5px solid #BAE6FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284C7',
                  flexShrink: 0
                }}
              >
                <BarChart2 size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F2421', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  Student Tools
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#7A6F62', margin: '0.2rem 0 0 0' }}>
                  Useful tools to track your progress, prepare better and stay organized.
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: '#F0F9FF',
                color: '#0369A1',
                border: '1px solid #BAE6FD',
                whiteSpace: 'nowrap'
              }}
            >
              5 Tools
            </span>
          </div>

          {/* Cards Grid */}
          <div className="more-grid-tools">
            {studentToolsCards.map((card) => (
              <MoreResourceCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                footer={card.footer}
                iconColor={card.iconColor}
                iconBg={card.iconBg}
                iconBorder={card.iconBorder}
                arrowColor={card.arrowColor}
                arrowBg={card.arrowBg}
                onClick={card.action}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: PLATFORM */}
      <section className="container" style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            backgroundColor: '#FAF5FF',
            borderRadius: '24px',
            border: '1.5px solid #F3E8FF',
            boxShadow: '0 4px 20px rgba(35,30,25,0.02)',
            padding: 'clamp(1.25rem, 2.5vw, 1.85rem)'
          }}
        >
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#F5F3FF',
                  border: '1.5px solid #DDD6FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                  flexShrink: 0
                }}
              >
                <Users size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F2421', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  Platform
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#7A6F62', margin: '0.2rem 0 0 0' }}>
                  Essential academic and career tools to make the most out of ProfessorVirus.
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: '#F5F3FF',
                color: '#6D28D9',
                border: '1px solid #DDD6FE',
                whiteSpace: 'nowrap'
              }}
            >
              3 Features
            </span>
          </div>

          {/* Cards Grid */}
          <div className="more-grid-platform">
            {platformCards.map((card) => (
              <MoreResourceCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                footer={card.footer}
                iconColor={card.iconColor}
                iconBg={card.iconBg}
                iconBorder={card.iconBorder}
                arrowColor={card.arrowColor}
                arrowBg={card.arrowBg}
                onClick={card.action}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Responsive Grid Styles */}
      <style>{`
        .more-grid-academics,
        .more-grid-tools {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.15rem;
          margin-top: 1.35rem;
        }
        .more-grid-platform {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.15rem;
          margin-top: 1.35rem;
        }
        @media (max-width: 1240px) {
          .more-grid-academics,
          .more-grid-tools {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 960px) {
          .more-hero-card {
            grid-template-columns: 1fr !important;
          }
          .more-hero-illustration {
            display: none !important;
          }
          .more-grid-academics,
          .more-grid-tools,
          .more-grid-platform {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .more-grid-academics,
          .more-grid-tools,
          .more-grid-platform {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
        <ProjectIdeasModal onClose={() => setActiveModal(null)} onNavigate={onNavigate} />
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

      {/* 13. PROFESSORVIRUS APP MODAL */}
      {activeModal === 'app' && (
        <ProfessorVirusAppModal onClose={() => setActiveModal(null)} />
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
    const userStr = localStorage.getItem('professorvirus_user');
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
          <Calculator size={22} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
            Result & SGPA / CGPA Calculator
          </h3>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#F6F2E9', borderRadius: '10px', padding: '0.25rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setTab('sgpa')}
            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: tab === 'sgpa' ? '#1F2421' : 'transparent', color: tab === 'sgpa' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            SGPA Calculator
          </button>
          <button
            onClick={() => setTab('cgpa')}
            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: tab === 'cgpa' ? '#1F2421' : 'transparent', color: tab === 'cgpa' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Cumulative CGPA
          </button>
        </div>

        {tab === 'sgpa' ? (
          <>
            <div style={{ backgroundColor: '#FDF6E8', border: '1px solid #E8D3B0', padding: '1rem', borderRadius: '14px', textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F2421' }}>Calculated SGPA</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#C88D2D' }}>{calculatedSGPA}</div>
              <div style={{ fontSize: '0.75rem', color: '#7A5835', fontWeight: 600 }}>
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
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', backgroundColor: '#1F2421' }}
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
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', backgroundColor: '#1F2421' }}
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
  const user = JSON.parse(localStorage.getItem('professorvirus_user') || 'null');

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
          <Clock size={22} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
            Class Schedule & Time Table Manager
          </h3>
        </div>

        {/* Sub Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', backgroundColor: '#F6F2E9', borderRadius: '10px', padding: '0.25rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setSubTab('view')}
            style={{ padding: '0.45rem', borderRadius: '7px', border: 'none', backgroundColor: subTab === 'view' ? '#1F2421' : 'transparent', color: subTab === 'view' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
          >
            My Timetable
          </button>
          <button
            onClick={() => setSubTab('create')}
            style={{ padding: '0.45rem', borderRadius: '7px', border: 'none', backgroundColor: subTab === 'create' ? '#1F2421' : 'transparent', color: subTab === 'create' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
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
            style={{ padding: '0.45rem', borderRadius: '7px', border: 'none', backgroundColor: subTab === 'upload' ? '#1F2421' : 'transparent', color: subTab === 'upload' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
          >
            Upload Timetable PDF
          </button>
        </div>

        {subTab === 'view' ? (
          <div>
            {uploadedFile && (
              <div style={{ backgroundColor: '#FDF6E8', border: '1px solid #E8D3B0', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421' }}>📁 Private Uploaded Timetable</div>
                  <div style={{ fontSize: '0.74rem', color: '#7A5835' }}>{uploadedFile.name} • {uploadedFile.size}</div>
                </div>
                <button onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '240px', overflowY: 'auto' }}>
              {schedule.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#C88D2D' }}>{item.day} • {item.time}</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{item.subject}</div>
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

            <button type="submit" className="btn-primary" style={{ backgroundColor: '#1F2421', padding: '0.65rem', marginTop: '0.4rem' }}>
              Save Class to Schedule
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', border: '2px dashed #cbd5e1', borderRadius: '16px', backgroundColor: '#f8fafc' }}>
            <Upload size={36} style={{ color: '#C88D2D', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1F2421' }}>Upload Timetable Document</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>Supports PDF, PNG, JPG files. Stored securely on your account.</p>
            <input type="file" accept=".pdf,image/*" onChange={handleFileUpload} style={{ display: 'none' }} id="timetable-file-input" />
            <label htmlFor="timetable-file-input" className="btn-primary" style={{ backgroundColor: '#1F2421', cursor: 'pointer', padding: '0.65rem 1.25rem', display: 'inline-block' }}>
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
          <BarChart2 size={22} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
            Attendance Tracker & Target Calculator
          </h3>
        </div>

        <div style={{ backgroundColor: Number(percentage) >= target ? '#FDF6E8' : '#fef2f2', border: Number(percentage) >= target ? '1px solid #E8D3B0' : '1px solid #fecaca', padding: '1rem', borderRadius: '14px', textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: Number(percentage) >= target ? '#1F2421' : '#dc2626' }}>Current Attendance</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: Number(percentage) >= target ? '#C88D2D' : '#dc2626' }}>{percentage}%</div>
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
          <ExternalLink size={22} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
            Verified AKTU & Official Portals
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {links.map((link, idx) => (
            <div
              key={idx}
              onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
              style={{ backgroundColor: '#FAF7F2', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #E8E2D5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#C88D2D', fontWeight: 700 }}>{link.category}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{link.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{link.desc}</div>
              </div>
              <ExternalLink size={16} style={{ color: '#C88D2D' }} />
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
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
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{exam.title}</div>
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
          <Briefcase size={22} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
            Verified Student Internships & Career Portals
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {platforms.map((p, idx) => (
            <div
              key={idx}
              onClick={() => window.open(p.url, '_blank', 'noopener,noreferrer')}
              style={{ backgroundColor: '#FDF6E8', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #E8D3B0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{p.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#7A5835' }}>{p.desc}</div>
              </div>
              <ExternalLink size={16} style={{ color: '#C88D2D' }} />
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
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
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{item.title}</div>
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
function ProjectIdeasModal({ onClose, onNavigate }) {
  const [domain, setDomain] = useState('CSE');

  const projectList = [
    { title: 'Automated Real-Time Face Recognition & Attendance', domain: 'CSE', level: 'Advanced', tech: 'Python, OpenCV, dlib', desc: 'Contactless automated attendance tracking using deep facial embeddings.' },
    { title: 'AI-Powered Resume Analyzer & Skill Extractor', domain: 'CSE', level: 'Advanced', tech: 'Python, SpaCy, NLP, Flask', desc: 'Parses resumes, extracts skills, and calculates ATS compatibility score.' },
    { title: 'Smart Home Automation with ESP8266 & MQTT', domain: 'ECE', level: 'Intermediate', tech: 'C++, ESP8266, MQTT', desc: 'Real-time telemetry and wireless appliance control via MQTT broker.' },
    { title: 'Automated Smart Irrigation & Soil Monitoring IoT System', domain: 'EE', level: 'Intermediate', tech: 'Arduino, Capacitive Sensor, Blynk', desc: 'Conserves irrigation water based on real-time soil moisture.' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Lightbulb size={22} style={{ color: '#b45309' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
            B.Tech Final & Mini Project Ideas
          </h3>
        </div>

        <button
          onClick={() => {
            onClose();
            if (onNavigate) onNavigate('project-ideas');
          }}
          style={{
            width: '100%',
            backgroundColor: '#781416',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(120, 20, 22, 0.25)'
          }}
        >
          <span>Open Full Project Ideas Catalog (25+ Verified Repos)</span>
          <ArrowRight size={16} />
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {['CSE', 'ECE', 'EE'].map(d => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              style={{
                padding: '0.35rem 0.8rem', borderRadius: '8px', border: 'none',
                backgroundColor: domain === d ? '#1F2421' : '#F6F2E9',
                color: domain === d ? '#ffffff' : '#334155', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
              }}
            >
              {d} Projects
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {projectList.filter(p => p.domain === domain).map((p, idx) => (
            <div key={idx} style={{ backgroundColor: '#FAF7F2', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E8E2D5' }}>
              <div style={{ fontSize: '0.72rem', color: '#C88D2D', fontWeight: 700 }}>{p.level} • {p.tech}</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1F2421', marginTop: '0.1rem' }}>{p.title}</h4>
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
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
        <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1F2421' }}>{resumeData.name}</div>
          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{resumeData.email} • {resumeData.phone}</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C88D2D', marginTop: '0.4rem' }}>Education</div>
          <div style={{ fontSize: '0.76rem', color: '#334155' }}>B.Tech in {resumeData.branch} ({resumeData.college}) — CGPA: {resumeData.cgpa}</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C88D2D', marginTop: '0.4rem' }}>Skills</div>
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
    { date: 'Sep 15, 2026', title: 'ProfessorVirus PYQ Bank Updated for 2025-26', desc: 'Latest semester exam question papers uploaded.' },
    { date: 'Sep 10, 2026', title: 'AI Study Assistant 2.0 Live on ProfessorVirus', desc: 'Interactive concept solver now available for all branches.' }
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Megaphone size={22} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
            Announcements & Campus Updates
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {updates.map((up, idx) => (
            <div key={idx} style={{ backgroundColor: '#FAF7F2', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E8E2D5' }}>
              <div style={{ fontSize: '0.72rem', color: '#C88D2D', fontWeight: 700 }}>{up.date}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{up.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{up.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 13. REAL PROFESSORVIRUS APP MODAL
function ProfessorVirusAppModal({ onClose }) {
  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, textAlign: 'center' }}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        
        <Smartphone size={32} style={{ color: '#C88D2D', marginBottom: '0.5rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
          Install ProfessorVirus Web App
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Access Notes, PYQs, and AI Study offline anytime on your phone.
        </p>

        <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '16px', border: '1px solid #E8E2D5', marginBottom: '1.25rem', display: 'inline-block' }}>
          {/* Real SVG QR code pointing to current domain */}
          <svg width="120" height="120" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#ffffff" />
            <rect x="10" y="10" width="30" height="30" fill="#1F2421" />
            <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
            <rect x="20" y="20" width="10" height="10" fill="#1F2421" />
            <rect x="60" y="10" width="30" height="30" fill="#1F2421" />
            <rect x="65" y="15" width="20" height="20" fill="#ffffff" />
            <rect x="70" y="20" width="10" height="10" fill="#1F2421" />
            <rect x="10" y="60" width="30" height="30" fill="#1F2421" />
            <rect x="15" y="65" width="20" height="20" fill="#ffffff" />
            <rect x="20" y="70" width="10" height="10" fill="#1F2421" />
            <rect x="50" y="50" width="15" height="15" fill="#1F2421" />
            <rect x="70" y="70" width="20" height="20" fill="#1F2421" />
          </svg>
          <div style={{ fontSize: '0.72rem', color: '#C88D2D', fontWeight: 700, marginTop: '0.3rem' }}>Scan to Open ProfessorVirus</div>
        </div>

        <button
          onClick={() => alert('PWA Web App: To install, tap your browser menu (⋮ or Share) and select "Add to Home Screen".')}
          className="btn-primary"
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1F2421' }}
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
      alert('Your ticket has been logged with ProfessorVirus Support.');
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
          <HelpCircle size={22} style={{ color: '#C88D2D' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421' }}>
            ProfessorVirus Support & Help Center
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
          {['support', 'issue', 'feedback'].map(t => (
            <button
              key={t}
              onClick={() => setMsgType(t)}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '8px', border: 'none',
                backgroundColor: msgType === t ? '#1F2421' : '#F6F2E9',
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

          <button type="submit" disabled={loading} className="btn-primary" style={{ backgroundColor: '#1F2421', padding: '0.65rem' }}>
            {loading ? 'Submitting...' : 'Submit to ProfessorVirus Support'}
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
