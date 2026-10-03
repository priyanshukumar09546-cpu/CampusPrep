import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Award, 
  Briefcase, 
  FileCheck, 
  Sparkles,
  ChevronRight,
  Calculator,
  Calendar,
  Lightbulb,
  GraduationCap,
  Link2,
  Compass,
  Layers,
  Wrench,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function MobileHomeScreen({ 
  onNavigate, 
  onOpenAI, 
  onSearch, 
  onSelectCourse,
  onSelectSubject,
  selectedCourse = 'B.Tech'
}) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (onSearch) onSearch(searchInput.trim());
      onNavigate('notes');
    }
  };

  const handleTrendingClick = (topic) => {
    if (onSelectSubject) {
      onSelectSubject(topic);
    } else {
      if (onSearch) onSearch(topic);
      onNavigate('notes');
    }
  };

  // Primary 4 Academic Pillars (2 x 2 Grid)
  const coreAcademicCards = [
    {
      id: 'notes',
      title: `${selectedCourse || 'B.Tech'} Notes`,
      subtitle: 'Verified Unit Notes',
      badge: 'POPULAR',
      icon: BookOpen,
      iconColor: '#C88D2D',
      iconBg: '#FFF8EC',
      iconBorder: '#F9E6C4',
      action: () => onNavigate('notes')
    },
    {
      id: 'pyqs',
      title: `${selectedCourse || 'B.Tech'} PYQs`,
      subtitle: 'Previous Year Papers',
      badge: 'EXAM PREP',
      icon: FileText,
      iconColor: '#E11D48',
      iconBg: '#FFF1F2',
      iconBorder: '#FFE4E6',
      action: () => onNavigate('pyqs')
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      subtitle: 'Curriculum & Units',
      badge: 'AKTU',
      icon: CheckSquare,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      action: () => onNavigate('syllabus')
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      subtitle: 'Test Your Knowledge',
      badge: 'PRACTICE',
      icon: Award,
      iconColor: '#7C3AED',
      iconBg: '#F5F3FF',
      iconBorder: '#EDE9FE',
      action: () => onNavigate('quizzes')
    }
  ];

  // Career & Placement Spotlight Powerhouses
  const careerPowerhouses = [
    {
      id: 'resume-maker',
      title: 'Resume Builder',
      subtitle: 'Create ATS-friendly CV & LaTeX Vector PDF',
      badge: 'PRO ATS',
      badgeBg: '#EEF2FF',
      badgeColor: '#4F46E5',
      icon: FileCheck,
      iconColor: '#4F46E5',
      iconBg: '#EEF2FF',
      iconBorder: '#C7D2FE',
      action: () => onNavigate('resume-maker')
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      subtitle: 'AI Mock Rounds: Technical, Coding & HR',
      badge: 'AI MOCK',
      badgeBg: '#FEF3C7',
      badgeColor: '#B45309',
      icon: Briefcase,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A',
      action: () => onNavigate('interview-pro')
    }
  ];

  // Placement & Development Projects
  const placementTools = [
    {
      id: 'internships-jobs',
      title: 'Internships & Jobs',
      subtitle: 'Verified tech hiring & off-campus drives',
      tag: 'Hiring',
      icon: Award,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      action: () => onNavigate('internships-jobs')
    },
    {
      id: 'project-ideas',
      title: 'Project Ideas',
      subtitle: 'Real projects with code & viva prep',
      tag: 'Code',
      icon: Lightbulb,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      iconBorder: '#A7F3D0',
      action: () => onNavigate('project-ideas')
    }
  ];

  // Essential Student & Career Utilities
  const essentialTools = [
    {
      id: 'pdf-maker',
      title: 'AI PDF Maker',
      subtitle: 'Merge, split, img-to-PDF',
      tag: 'Tool',
      icon: Layers,
      iconColor: '#4F46E5',
      iconBg: '#EEF2FF',
      iconBorder: '#E0E7FF',
      action: () => onNavigate('pdf-maker')
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA',
      subtitle: 'Instant SGPA breakdown',
      tag: 'Grades',
      icon: Calculator,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      iconBorder: '#D1FAE5',
      action: () => onNavigate('result-cgpa')
    },
    {
      id: 'attendance-calculator',
      title: 'Attendance 75%',
      subtitle: 'Bunk & safe class planner',
      tag: '75% Tracker',
      icon: Calculator,
      iconColor: '#D97706',
      iconBg: '#FFFBEB',
      iconBorder: '#FEF3C7',
      action: () => onNavigate('attendance-calculator')
    },
    {
      id: 'timetable',
      title: 'Time Table',
      subtitle: 'Weekly routine & schedule',
      tag: 'Planner',
      icon: Calendar,
      iconColor: '#E11D48',
      iconBg: '#FEF2F2',
      iconBorder: '#FEE2E2',
      action: () => onNavigate('timetable')
    },
    {
      id: 'scholarships',
      title: 'Scholarships',
      subtitle: 'Govt & private student aid',
      tag: 'Financial Aid',
      icon: GraduationCap,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      iconBorder: '#DCFCE7',
      action: () => onNavigate('scholarships')
    },
    {
      id: 'competitive-exams',
      title: 'Competitive Exams',
      subtitle: 'GATE, CAT, UPSC roadmaps',
      tag: 'Roadmaps',
      icon: Compass,
      iconColor: '#7C3AED',
      iconBg: '#FAF5FF',
      iconBorder: '#F3E8FF',
      action: () => onNavigate('competitive-exams')
    },
    {
      id: 'important-links',
      title: 'Important Links',
      subtitle: 'AKTU ERP & OneView Portal',
      tag: 'Official',
      icon: Link2,
      iconColor: '#DC2626',
      iconBg: '#FEF2F2',
      iconBorder: '#FEE2E2',
      action: () => onNavigate('important-links')
    }
  ];

  const trendingTopics = [
    'Data Structures (DSA)',
    'Database (DBMS)',
    'Operating Systems',
    'Computer Networks',
    'Python Programming',
    'Web Development',
    'C Programming',
    'Discrete Mathematics'
  ];

  return (
    <div 
      className="pv-mobile-home"
      style={{
        padding: '1.15rem 1rem 5.5rem',
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. HERO HEADLINE */}
      <div style={{ marginBottom: '0.85rem' }}>
        <h1 style={{
          fontSize: '1.95rem',
          fontWeight: 900,
          color: '#1C1E21',
          lineHeight: 1.18,
          margin: 0,
          letterSpacing: '-0.03em'
        }}>
          Your <br />
          Complete <span style={{ color: '#7A1C28', fontStyle: 'italic', fontFamily: 'serif' }}>Learning</span> <br />
          Platform
        </h1>
        <p style={{
          margin: '0.45rem 0 0',
          fontSize: '0.84rem',
          color: '#555555',
          lineHeight: 1.4,
          fontWeight: 450
        }}>
          Notes, PYQs, Resume Builder, Interview Pro &amp; Student Tools.
        </p>
      </div>

      {/* 2. COURSE SELECTOR PILLS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        overflowX: 'auto',
        paddingBottom: '0.4rem',
        marginBottom: '1rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {['B.Tech', 'BCA', 'MCA', 'MBA', 'B.Pharm'].map((c) => {
          const isSelected = (selectedCourse || 'B.Tech') === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => {
                if (onSelectCourse) onSelectCourse(c);
              }}
              style={{
                backgroundColor: isSelected ? '#7A1C28' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#475569',
                border: isSelected ? '1.5px solid #7A1C28' : '1.5px solid #E2D9CC',
                padding: '0.42rem 0.95rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 3px 10px rgba(122, 28, 40, 0.22)' : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.18s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>{c}</span>
              {isSelected && <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FFD166' }} />}
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH BAR */}
      <form 
        onSubmit={handleSearchSubmit}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #EBE5DB',
          padding: '0.35rem 0.4rem 0.35rem 1rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          marginBottom: '1.15rem'
        }}
      >
        <Search size={18} color="#888888" style={{ marginRight: '0.6rem', flexShrink: 0 }} />
        <input 
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={`Search ${selectedCourse || 'B.Tech'} notes, PYQs, subjects...`}
          aria-label="Search notes, PYQs, subjects"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.86rem',
            color: '#1A1A1A',
            backgroundColor: 'transparent'
          }}
        />
        <button
          type="submit"
          aria-label="Submit search"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            backgroundColor: '#7A1C28',
            backgroundImage: 'linear-gradient(135deg, #85182A 0%, #63121F 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Search size={16} />
        </button>
      </form>

      {/* 4. FEATURED "ASK VIRUS" CARD */}
      <div
        onClick={onOpenAI}
        style={{
          background: 'linear-gradient(135deg, #1A090E 0%, #3B121C 55%, #561826 100%)',
          borderRadius: '22px',
          padding: '1.2rem',
          color: '#FFFFFF',
          marginBottom: '1.35rem',
          boxShadow: '0 10px 28px rgba(90, 15, 25, 0.28)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '1px solid rgba(246, 214, 220, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          <div style={{ flex: 1, paddingRight: '0.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#F9D8DE',
              letterSpacing: '0.02em',
              marginBottom: '0.45rem',
              backdropFilter: 'blur(4px)'
            }}>
              Ask Virus <Sparkles size={11} color="#FFD166" />
            </div>

            <h2 style={{
              margin: '0 0 0.25rem',
              fontSize: '1.12rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}>
              Your AI Study Assistant
            </h2>

            <p style={{
              margin: 0,
              fontSize: '0.76rem',
              color: 'rgba(255, 255, 255, 0.82)',
              lineHeight: 1.35,
              fontWeight: 450,
              maxWidth: '190px'
            }}>
              Instant, verified solutions for questions, syllabus &amp; exams.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <img 
                src="/assets/hero_virus.png" 
                alt="Ask Virus Mascot" 
                style={{ width: '56px', height: '56px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/navbar_logo.png';
                }}
              />
            </div>

            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. CORE ACADEMIC PILLARS (2 x 2 GRID) */}
      <div style={{ marginBottom: '1.35rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.65rem'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 900,
              color: '#1C1E21',
              letterSpacing: '-0.02em'
            }}>
              {selectedCourse || 'Academic'} Study Material
            </h2>
            <p style={{
              margin: '0.1rem 0 0',
              fontSize: '0.74rem',
              color: '#71717A',
              fontWeight: 500
            }}>
              Notes, PYQs, syllabus &amp; quizzes
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.65rem'
        }}>
          {coreAcademicCards.map((card) => {
            const IconComp = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.action}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') card.action(); }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #ECE7E0',
                  padding: '0.95rem 0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.025)',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '13px',
                  backgroundColor: card.iconBg,
                  border: `1.5px solid ${card.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.iconColor,
                  flexShrink: 0
                }}>
                  <IconComp size={20} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    color: '#1C1E21',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {card.title}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#71717A',
                    marginTop: '0.15rem',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {card.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. CAREER & PLACEMENT POWERHOUSES (RESUME BUILDER & INTERVIEW PRO) */}
      <div style={{ marginBottom: '1.35rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.65rem'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 900,
              color: '#1C1E21',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              Career &amp; Placement Tools <Sparkles size={14} color="#7A1C28" />
            </h2>
            <p style={{
              margin: '0.1rem 0 0',
              fontSize: '0.74rem',
              color: '#71717A',
              fontWeight: 500
            }}>
              ATS Resume Builder &amp; AI Mock Interview Pro
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.65rem'
        }}>
          {careerPowerhouses.map((tool) => {
            const IconComp = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={tool.action}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') tool.action(); }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: `1.5px solid ${tool.iconBorder}`,
                  padding: '1rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: tool.iconBg,
                    border: `1.5px solid ${tool.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tool.iconColor,
                    flexShrink: 0
                  }}>
                    <IconComp size={24} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                      <span style={{
                        fontSize: '0.94rem',
                        fontWeight: 900,
                        color: '#1C1E21',
                        letterSpacing: '-0.015em'
                      }}>
                        {tool.title}
                      </span>
                      <span style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        backgroundColor: tool.badgeBg,
                        color: tool.badgeColor,
                        padding: '0.12rem 0.45rem',
                        borderRadius: '999px',
                        letterSpacing: '0.03em'
                      }}>
                        {tool.badge}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.74rem',
                      color: '#64748B',
                      lineHeight: 1.3
                    }}>
                      {tool.subtitle}
                    </div>
                  </div>
                </div>

                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: tool.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tool.iconColor,
                  flexShrink: 0
                }}>
                  <ChevronRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. PLACEMENT DRIVES & PROJECTS */}
      <div style={{ marginBottom: '1.35rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.65rem'
        }}>
          {placementTools.map((tool) => {
            const IconComp = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={tool.action}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') tool.action(); }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: `1.5px solid ${tool.iconBorder}`,
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '11px',
                    backgroundColor: tool.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tool.iconColor
                  }}>
                    <IconComp size={19} strokeWidth={2.2} />
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    backgroundColor: tool.iconBg,
                    color: tool.iconColor,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px'
                  }}>
                    {tool.tag}
                  </span>
                </div>
                <div>
                  <div style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: '#1C1E21',
                    lineHeight: 1.2
                  }}>
                    {tool.title}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#71717A',
                    marginTop: '0.15rem',
                    lineHeight: 1.25
                  }}>
                    {tool.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. ESSENTIAL STUDENT TOOLS & UTILITIES */}
      <div style={{ marginBottom: '1.45rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 900,
              color: '#1C1E21',
              letterSpacing: '-0.02em'
            }}>
              Student Academic Utilities
            </h2>
            <p style={{
              margin: '0.1rem 0 0',
              fontSize: '0.74rem',
              color: '#71717A',
              fontWeight: 500
            }}>
              PDF maker, calculators &amp; circulars
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('more')}
            style={{
              background: 'none',
              border: 'none',
              color: '#7A1C28',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}
          >
            All Tools <ChevronRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.65rem'
        }}>
          {essentialTools.map((tool) => {
            const IconComp = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={tool.action}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') tool.action(); }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #ECE7E0',
                  padding: '0.85rem 0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  backgroundColor: tool.iconBg,
                  border: `1.5px solid ${tool.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tool.iconColor,
                  flexShrink: 0
                }}>
                  <IconComp size={18} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#1C1E21',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {tool.title}
                  </div>
                  <div style={{
                    fontSize: '0.68rem',
                    color: '#71717A',
                    marginTop: '0.15rem',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {tool.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. TRENDING TOPICS */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 800,
            color: '#1C1E21',
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <TrendingUp size={16} color="#7A1C28" /> Trending Topics
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('notes')}
            style={{
              background: 'none',
              border: 'none',
              color: '#7A1C28',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0
            }}
          >
            View Notes
          </button>
        </div>

        {/* TOPICS PILL WRAPPER */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {trendingTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleTrendingClick(topic)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #EAE4DA',
                borderRadius: '999px',
                padding: '0.42rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#2D3139',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
