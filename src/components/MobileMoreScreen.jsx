import React, { useState } from 'react';
import { 
  Bookmark, 
  Download, 
  BarChart2, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Crown, 
  ChevronRight, 
  Calendar, 
  Calculator, 
  Award, 
  Briefcase, 
  ShieldCheck, 
  FileText,
  Sliders,
  User,
  FileCheck,
  Lightbulb,
  GraduationCap,
  Compass,
  Link2,
  Layers,
  Sparkles
} from 'lucide-react';

export default function MobileMoreScreen({ onNavigate, onOpenAuth }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('professorvirus_user') || sessionStorage.getItem('professorvirus_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const displayName = user?.name || 'Priyanshu Kumar';
  const displayCourse = user?.course || 'BCA / B.Tech Student';

  // Section 1: Career & Placement Tools
  const careerTools = [
    {
      id: 'resume-maker',
      title: 'Resume Builder',
      subtitle: 'Create ATS-friendly CV & Latex export',
      badge: 'PRO',
      icon: FileCheck,
      iconColor: '#4F46E5',
      iconBg: '#EEF2FF',
      iconBorder: '#E0E7FF',
      action: () => onNavigate('resume-maker')
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      subtitle: 'AI Mock Rounds, Technical & HR interviews',
      badge: 'AI',
      icon: Briefcase,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A',
      action: () => onNavigate('interview-pro')
    },
    {
      id: 'internships-jobs',
      title: 'Internships & Jobs',
      subtitle: 'Verified off-campus drives & tech hiring',
      badge: 'Hiring',
      icon: Award,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      action: () => onNavigate('internships-jobs')
    },
    {
      id: 'project-ideas',
      title: 'Project Ideas',
      subtitle: 'Real projects with source code & viva prep',
      badge: 'Code',
      icon: Lightbulb,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      iconBorder: '#D1FAE5',
      action: () => onNavigate('project-ideas')
    }
  ];

  // Section 2: Student Academic Utilities
  const utilityTools = [
    {
      id: 'pdf-maker',
      title: 'AI PDF Maker & Splitter',
      subtitle: 'Merge, split, images to PDF & page reorder',
      badge: 'Free',
      icon: Layers,
      iconColor: '#4F46E5',
      iconBg: '#EEF2FF',
      iconBorder: '#E0E7FF',
      action: () => onNavigate('pdf-maker')
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA Calculator',
      subtitle: 'Instant SGPA/CGPA grade breakdown',
      badge: 'Grades',
      icon: Calculator,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      iconBorder: '#D1FAE5',
      action: () => onNavigate('result-cgpa')
    },
    {
      id: 'attendance-calculator',
      title: 'Attendance 75% Calculator',
      subtitle: 'Track safe bunks & required classes',
      badge: '75%',
      icon: Calculator,
      iconColor: '#D97706',
      iconBg: '#FFFBEB',
      iconBorder: '#FEF3C7',
      action: () => onNavigate('attendance-calculator')
    },
    {
      id: 'timetable',
      title: 'Time Table & Routine',
      subtitle: 'Weekly class schedule & study planner',
      badge: 'Routine',
      icon: Calendar,
      iconColor: '#E11D48',
      iconBg: '#FEF2F2',
      iconBorder: '#FEE2E2',
      action: () => onNavigate('timetable')
    },
    {
      id: 'scholarships',
      title: 'Scholarships & Financial Aid',
      subtitle: 'State, central & corporate student grants',
      badge: 'Aid',
      icon: GraduationCap,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      iconBorder: '#DCFCE7',
      action: () => onNavigate('scholarships')
    },
    {
      id: 'competitive-exams',
      title: 'Competitive Exams',
      subtitle: 'GATE, CAT, UPSC roadmaps & syllabi',
      badge: 'Prep',
      icon: Compass,
      iconColor: '#7C3AED',
      iconBg: '#FAF5FF',
      iconBorder: '#F3E8FF',
      action: () => onNavigate('competitive-exams')
    },
    {
      id: 'important-links',
      title: 'Important AKTU Links',
      subtitle: 'AKTU ERP, OneView & official portals',
      badge: 'Official',
      icon: Link2,
      iconColor: '#DC2626',
      iconBg: '#FEF2F2',
      iconBorder: '#FEE2E2',
      action: () => onNavigate('important-links')
    }
  ];

  // Section 3: Account & Preferences
  const accountLinks = [
    {
      id: 'bookmarks',
      label: 'My Saved Notes',
      icon: Bookmark,
      action: () => onNavigate('notes')
    },
    {
      id: 'downloads',
      label: 'My Saved PYQs',
      icon: Download,
      action: () => onNavigate('pyqs')
    },
    {
      id: 'cookies',
      label: 'Cookie & Privacy Preferences',
      icon: Sliders,
      action: () => {
        if (window.openCookieSettings) window.openCookieSettings();
      }
    },
    {
      id: 'help',
      label: 'Help & Academic Support',
      icon: HelpCircle,
      action: () => onNavigate('important-links')
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('professorvirus_token');
    localStorage.removeItem('professorvirus_user');
    sessionStorage.removeItem('professorvirus_token');
    sessionStorage.removeItem('professorvirus_user');
    window.dispatchEvent(new Event('auth_state_changed'));
    onNavigate('home');
  };

  return (
    <div 
      className="pv-mobile-more"
      style={{
        padding: '1rem 1rem 5.5rem',
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. STUDENT PROFILE CARD */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '1.15rem 1.25rem',
        border: '1px solid #ECE7E0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#F5ECEE',
          border: '2px solid #7A1C28',
          flexShrink: 0
        }}>
          <img 
            src="/assets/user_avatar_priyanshu.png" 
            alt="Student Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#1C1E21',
            lineHeight: 1.2
          }}>
            {displayName}
          </h2>
          <div style={{
            fontSize: '0.78rem',
            color: '#71717A',
            marginTop: '0.15rem'
          }}>
            {displayCourse}
          </div>
          <button
            type="button"
            onClick={() => onNavigate('result-cgpa')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#7A1C28',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              marginTop: '0.35rem',
              cursor: 'pointer'
            }}
          >
            Academic Performance <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 2. STAT COUNTERS (3 TILES) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.55rem',
        marginBottom: '1.15rem'
      }}>
        <div 
          onClick={() => onNavigate('notes')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            border: '1px solid #ECE7E0',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7A1C28' }}>5,357+</div>
          <div style={{ fontSize: '0.68rem', color: '#71717A', marginTop: '0.1rem', fontWeight: 600 }}>Notes</div>
        </div>

        <div 
          onClick={() => onNavigate('pyqs')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            border: '1px solid #ECE7E0',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#C88D2D' }}>1,967+</div>
          <div style={{ fontSize: '0.68rem', color: '#71717A', marginTop: '0.1rem', fontWeight: 600 }}>PYQs</div>
        </div>

        <div 
          onClick={() => onNavigate('interview-pro')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            border: '1px solid #ECE7E0',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2563EB' }}>AI Pro</div>
          <div style={{ fontSize: '0.68rem', color: '#71717A', marginTop: '0.1rem', fontWeight: 600 }}>Mock Rounds</div>
        </div>
      </div>

      {/* 3. PRO BANNER */}
      <div 
        onClick={() => onNavigate('interview-pro')}
        style={{
          background: 'linear-gradient(135deg, #FFF8EC 0%, #FDF1DB 100%)',
          borderRadius: '18px',
          border: '1.5px solid #F6DFB5',
          padding: '1rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(200, 141, 45, 0.08)'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          backgroundColor: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D97706',
          flexShrink: 0
        }}>
          <Crown size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400E' }}>
            Interview Pro &amp; ATS Resume
          </div>
          <div style={{ fontSize: '0.72rem', color: '#B45309', marginTop: '0.15rem' }}>
            AI mock interview rounds &amp; ATS resume scoring
          </div>
        </div>
        <ChevronRight size={16} color="#D97706" />
      </div>

      {/* 4. CAREER & PLACEMENT TOOLS */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          color: '#7A1C28',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.55rem',
          paddingLeft: '0.2rem'
        }}>
          Career &amp; Placement Tools
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #ECE7E0',
          overflow: 'hidden'
        }}>
          {careerTools.map((tool, idx) => {
            const IconComp = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={tool.action}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') tool.action(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderBottom: idx < careerTools.length - 1 ? '1px solid #F4EFEB' : 'none',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1C1E21' }}>
                        {tool.title}
                      </span>
                      {tool.badge && (
                        <span style={{
                          backgroundColor: '#FFF1F2',
                          color: '#E11D48',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '0.1rem 0.4rem',
                          borderRadius: '999px',
                          letterSpacing: '0.02em'
                        }}>
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.70rem',
                      color: '#71717A',
                      marginTop: '0.1rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {tool.subtitle}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="#A1A1AA" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ACADEMIC & UTILITY TOOLS */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          color: '#7A1C28',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.55rem',
          paddingLeft: '0.2rem'
        }}>
          Student Tools &amp; Utilities
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #ECE7E0',
          overflow: 'hidden'
        }}>
          {utilityTools.map((tool, idx) => {
            const IconComp = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={tool.action}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') tool.action(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderBottom: idx < utilityTools.length - 1 ? '1px solid #F4EFEB' : 'none',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1C1E21' }}>
                        {tool.title}
                      </span>
                      {tool.badge && (
                        <span style={{
                          backgroundColor: '#F4F4F5',
                          color: '#52525B',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.4rem',
                          borderRadius: '999px'
                        }}>
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.70rem',
                      color: '#71717A',
                      marginTop: '0.1rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {tool.subtitle}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="#A1A1AA" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. ACCOUNT & PREFERENCES */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          color: '#71717A',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.55rem',
          paddingLeft: '0.2rem'
        }}>
          Account &amp; Preferences
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #ECE7E0',
          overflow: 'hidden'
        }}>
          {accountLinks.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.15rem',
                  border: 'none',
                  borderBottom: idx < accountLinks.length - 1 ? '1px solid #F4EFEB' : 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#1C1E21',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <IconComp size={18} color="#7A1C28" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 650, color: '#27272A' }}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={15} color="#A1A1AA" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. LOGOUT ACTION */}
      <button
        type="button"
        onClick={handleLogout}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.85rem',
          borderRadius: '16px',
          border: '1.5px solid #F6D6DC',
          backgroundColor: '#FFF8F9',
          color: '#E11D48',
          fontSize: '0.86rem',
          fontWeight: 800,
          cursor: 'pointer',
          transition: 'all 0.18s ease'
        }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
