import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CourseCardsSection({ onSelectCourse, onNavigate }) {
  const courses = [
    {
      id: 'btech',
      order: 1,
      courseName: 'B.Tech',
      fullName: 'Bachelor of Technology',
      tagline: 'Build Innovate Create !',
      description: 'For future engineers, innovators and problem solvers.',
      badgeColor: '#1D5C42',
      bgGradient: 'linear-gradient(180deg, #F2FAF5 0%, #FFFFFF 100%)',
      borderColor: '#C8E3D7',
      btnColor: '#1D5C42',
      btnHover: '#144330',
      illustration: (
        <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '115px' }}>
          {/* Laptop Base & Screen */}
          <rect x="25" y="32" width="95" height="62" rx="6" fill="#2C3539" stroke="#1F2421" strokeWidth="2" />
          <rect x="30" y="37" width="85" height="52" rx="3" fill="#1A202C" />
          {/* Code on screen */}
          <text x="72" y="68" fill="#38BDF8" fontFamily="monospace" fontSize="20" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
          {/* Laptop Keyboard Base */}
          <path d="M12 94 L133 94 L124 103 L21 103 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          {/* Construction / Engineer Hard Hat */}
          <path d="M102 75 C102 52, 142 52, 142 75 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <ellipse cx="122" cy="75" rx="24" ry="4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          {/* Gear in background */}
          <circle cx="148" cy="38" r="14" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,3" />
          <circle cx="148" cy="38" r="6" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          {/* Engineering Books Stack */}
          <rect x="18" y="99" width="55" height="9" rx="2" fill="#2563EB" />
          <rect x="22" y="94" width="48" height="6" rx="1.5" fill="#F59E0B" />
          <rect x="25" y="89" width="42" height="6" rx="1.5" fill="#C88D2D" />
        </svg>
      )
    },
    {
      id: 'mtech',
      order: 2,
      courseName: 'M.Tech',
      fullName: 'Master of Technology',
      tagline: 'Research Innovate Lead !',
      description: 'For future researchers, innovators and tech leaders.',
      badgeColor: '#6D28D9',
      bgGradient: 'linear-gradient(180deg, #EDE9FE 0%, #FFFFFF 100%)',
      borderColor: '#DDD6FE',
      btnColor: '#6D28D9',
      btnHover: '#5B21B6',
      illustration: (
        <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '115px' }}>
          {/* Laptop Base & Screen */}
          <rect x="25" y="32" width="95" height="62" rx="6" fill="#1E1B4B" stroke="#4338CA" strokeWidth="2" />
          <rect x="30" y="37" width="85" height="52" rx="3" fill="#0F172A" />
          {/* Research / AI text and circuit on screen */}
          <text x="72" y="66" fill="#A78BFA" fontFamily="monospace" fontSize="15" fontWeight="bold" textAnchor="middle">&lt;R&amp;D / AI&gt;</text>
          {/* Laptop Keyboard Base */}
          <path d="M12 94 L133 94 L124 103 L21 103 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          {/* Gear & Research Circuit Node */}
          <circle cx="150" cy="40" r="14" fill="#DDD6FE" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,2" />
          <circle cx="150" cy="40" r="6" fill="#6D28D9" />
          {/* Circuit lines */}
          <path d="M150 54 V70 H136" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="134" cy="70" r="3" fill="#A78BFA" />
          {/* Advanced Engineering Thesis / Research Books Stack */}
          <rect x="18" y="99" width="55" height="9" rx="2" fill="#6D28D9" />
          <rect x="22" y="94" width="48" height="6" rx="1.5" fill="#8B5CF6" />
          <rect x="25" y="89" width="42" height="6" rx="1.5" fill="#C4B5FD" />
        </svg>
      )
    },
    {
      id: 'bca',
      order: 3,
      courseName: 'BCA',
      fullName: 'Bachelor of Computer Applications',
      tagline: 'Code Create Connect !',
      description: 'Foundation for modern software, web technologies and computer applications.',
      badgeColor: '#0284C7',
      bgGradient: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
      borderColor: '#BAE6FD',
      btnColor: '#0284C7',
      btnHover: '#0369A1',
      illustration: (
        <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '115px' }}>
          {/* Desktop Monitor Screen */}
          <rect x="35" y="24" width="84" height="58" rx="6" fill="#0C4A6E" stroke="#0369A1" strokeWidth="2" />
          <rect x="40" y="29" width="74" height="48" rx="3" fill="#082F49" />
          <text x="77" y="58" fill="#38BDF8" fontFamily="monospace" fontSize="18" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
          {/* Monitor Stand */}
          <path d="M72 82 L82 82 L82 92 L72 92 Z" fill="#64748B" />
          <rect x="62" y="92" width="30" height="5" rx="2" fill="#94A3B8" />
          {/* Mobile phone with app wireframe */}
          <rect x="130" y="38" width="36" height="66" rx="6" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          <rect x="134" y="44" width="28" height="50" rx="3" fill="#E0F2FE" />
          <circle cx="148" cy="98" r="2.5" fill="#FFFFFF" />
          <rect x="138" y="48" width="20" height="5" rx="1" fill="#0284C7" />
          <rect x="138" y="56" width="14" height="4" rx="1" fill="#38BDF8" />
          <rect x="138" y="63" width="20" height="12" rx="1.5" fill="#BAE6FD" />
          {/* Computing books stack */}
          <rect x="16" y="97" width="46" height="8" rx="1.5" fill="#0284C7" />
          <rect x="20" y="90" width="40" height="7" rx="1.5" fill="#38BDF8" />
        </svg>
      )
    },
    {
      id: 'mca',
      order: 4,
      courseName: 'MCA',
      fullName: 'Master of Computer Applications',
      tagline: 'Code Learn Lead !',
      description: 'Build your career in software, applications and beyond.',
      badgeColor: '#1E40AF',
      bgGradient: 'linear-gradient(180deg, #F0F5FF 0%, #FFFFFF 100%)',
      borderColor: '#BFDBFE',
      btnColor: '#2563EB',
      btnHover: '#1D4ED8',
      illustration: (
        <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '115px' }}>
          {/* Laptop */}
          <rect x="25" y="32" width="95" height="62" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="30" y="37" width="85" height="52" rx="3" fill="#0F172A" />
          <text x="72" y="68" fill="#60A5FA" fontFamily="monospace" fontSize="20" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
          <path d="M12 94 L133 94 L124 103 L21 103 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          {/* Cloud Database Symbol */}
          <path d="M125 58 C122 50, 134 42, 142 46 C147 40, 159 42, 161 48 C168 48, 172 55, 168 62 C168 67, 128 67, 125 58 Z" fill="#3B82F6" opacity="0.9" />
          {/* Database Disk Layers */}
          <ellipse cx="146" cy="74" rx="16" ry="4" fill="#60A5FA" stroke="#2563EB" strokeWidth="1.5" />
          <path d="M130 74 v6 c0 2.2 7.2 4 16 4 s16 -1.8 16 -4 v-6" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5" />
          {/* Books Stack */}
          <rect x="18" y="99" width="52" height="8" rx="2" fill="#3B82F6" />
          <rect x="20" y="92" width="46" height="8" rx="2" fill="#8B5CF6" />
          {/* Wireless Mouse */}
          <ellipse cx="148" cy="98" rx="8" ry="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="148" y1="88" x2="148" y2="94" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 'bba',
      order: 5,
      courseName: 'BBA',
      fullName: 'Bachelor of Business Administration',
      tagline: 'Learn Manage Grow !',
      description: 'Foundation for modern business, management and entrepreneurship.',
      badgeColor: '#D97706',
      bgGradient: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)',
      borderColor: '#FDE68A',
      btnColor: '#D97706',
      btnHover: '#B45309',
      illustration: (
        <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '115px' }}>
          {/* Ascending Growth Bars */}
          <rect x="28" y="72" width="11" height="24" rx="2" fill="#FDE68A" />
          <rect x="43" y="56" width="11" height="40" rx="2" fill="#FCD34D" />
          <rect x="58" y="40" width="11" height="56" rx="2" fill="#F59E0B" />
          <rect x="73" y="26" width="11" height="70" rx="2" fill="#D97706" />
          {/* Growth Arrow line */}
          <path d="M24 78 L78 22 L88 32" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Modern Business Folder / Portfolio */}
          <rect x="94" y="52" width="62" height="44" rx="6" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <path d="M94 62 H156" stroke="#D97706" strokeWidth="1.5" />
          <rect x="117" y="58" width="16" height="8" rx="2" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
          {/* Small Globe / Connection circle */}
          <circle cx="160" cy="38" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
          <ellipse cx="160" cy="38" rx="6" ry="12" stroke="#F59E0B" strokeWidth="1" />
          <line x1="148" y1="38" x2="172" y2="38" stroke="#F59E0B" strokeWidth="1" />
        </svg>
      )
    },
    {
      id: 'mba',
      order: 6,
      courseName: 'MBA',
      fullName: 'Master of Business Administration',
      tagline: 'Think Plan Lead !',
      description: 'Learn to lead, manage and create impact.',
      badgeColor: '#92400E',
      bgGradient: 'linear-gradient(180deg, #FEF3C7 0%, #FFFFFF 100%)',
      borderColor: '#FCD34D',
      btnColor: '#B45309',
      btnHover: '#92400E',
      illustration: (
        <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '115px' }}>
          {/* Ascending Growth Bar Chart in background */}
          <rect x="30" y="70" width="10" height="24" rx="2" fill="#FCD34D" opacity="0.9" />
          <rect x="44" y="54" width="10" height="40" rx="2" fill="#F59E0B" opacity="0.9" />
          <rect x="58" y="38" width="10" height="56" rx="2" fill="#D97706" opacity="0.9" />
          <rect x="72" y="24" width="10" height="70" rx="2" fill="#B45309" opacity="0.9" />
          {/* Growth Arrow */}
          <path d="M26 76 L76 22 L86 30" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Professional Leather Briefcase */}
          <rect x="80" y="52" width="68" height="48" rx="6" fill="#854D0E" stroke="#713F12" strokeWidth="2" />
          <rect x="80" y="66" width="68" height="6" fill="#713F12" />
          <rect x="108" y="63" width="12" height="12" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
          {/* Handle */}
          <path d="M102 52 V44 H126 V52" stroke="#713F12" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Decorative Success Plant */}
          <path d="M165 72 C165 60 178 52 178 52 C178 52 176 68 165 72 Z" fill="#D97706" />
          <path d="M164 74 C164 64 152 56 152 56 C152 56 154 70 164 74 Z" fill="#B45309" />
          <path d="M156 78 h16 l-2 16 h-12 Z" fill="#B45309" />
        </svg>
      )
    },
    {
      id: 'bpharm',
      order: 7,
      courseName: 'B.Pharm',
      fullName: 'Bachelor of Pharmacy',
      tagline: 'Research Heal Serve !',
      description: 'For a healthier tomorrow through knowledge and care.',
      badgeColor: '#9D174D',
      bgGradient: 'linear-gradient(180deg, #FDF2F8 0%, #FFFFFF 100%)',
      borderColor: '#FBCFE8',
      btnColor: '#BE185D',
      btnHover: '#9D174D',
      illustration: (
        <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '115px' }}>
          {/* Pharmaceutical Bottle with Medical Cross */}
          <rect x="68" y="42" width="40" height="54" rx="7" fill="#BE185D" stroke="#9D174D" strokeWidth="2" />
          <rect x="76" y="34" width="24" height="9" rx="2" fill="#FFFFFF" stroke="#9D174D" strokeWidth="1.5" />
          {/* White Medical Cross on Bottle */}
          <rect x="84" y="58" width="8" height="22" rx="1.5" fill="#FFFFFF" />
          <rect x="77" y="65" width="22" height="8" rx="1.5" fill="#FFFFFF" />
          {/* Mortar and Pestle */}
          <path d="M120 68 C120 86 152 86 152 68 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          <line x1="126" y1="50" x2="142" y2="76" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          {/* Herbal Leaves */}
          <path d="M142 56 C142 46 154 40 154 40 C154 40 152 52 142 56 Z" fill="#C88D2D" />
          {/* Two-tone Capsules / Pills */}
          <g transform="translate(38, 76) rotate(-35)">
            <rect x="0" y="0" width="10" height="12" rx="5" fill="#3B82F6" />
            <rect x="0" y="10" width="10" height="12" rx="5" fill="#F87171" />
          </g>
          <g transform="translate(108, 88) rotate(25)">
            <rect x="0" y="0" width="10" height="11" rx="5" fill="#F43F5E" />
            <rect x="0" y="9" width="10" height="11" rx="5" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="0.8" />
          </g>
          {/* Reference Medical Books Stack */}
          <rect x="146" y="88" width="36" height="7" rx="1.5" fill="#3B82F6" />
          <rect x="148" y="82" width="32" height="7" rx="1.5" fill="#BE185D" />
        </svg>
      )
    }
  ];

  // Sort by order before rendering
  const sortedCourses = [...courses].sort((a, b) => a.order - b.order);

  const handleCardClick = (course) => {
    const courseId = course?.id || course;
    if (onSelectCourse) {
      onSelectCourse(courseId);
    } else if (onNavigate) {
      onNavigate('notes', { course: course?.courseName || courseId });
    } else {
      window.location.href = `/notes?course=${encodeURIComponent(course?.courseName || courseId)}`;
    }
  };

  return (
    <section style={{
      backgroundColor: '#FAF7F2',
      padding: '3rem 0 3.5rem 0',
      borderBottom: '1.5px solid #E8E2D5',
      perspective: '1200px'
    }}>
      <div className="container">
        
        {/* SECTION HEADER: Choose Your Course */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '0.4rem'
          }}>
            <span style={{ color: '#C88D2D', fontSize: '1.3rem' }}>✨</span>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '2.35rem',
              fontWeight: 900,
              color: '#1C1E21',
              letterSpacing: '-0.02em',
              margin: 0
            }}>
              Choose <span style={{ textDecoration: 'underline', textDecorationColor: '#C88D2D', textUnderlineOffset: '6px' }}>Your Course</span>
            </h2>
            <span style={{ color: '#C88D2D', fontSize: '1.3rem' }}>✨</span>
          </div>

          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.02rem',
            color: '#646E78',
            fontWeight: 500,
            margin: 0
          }}>
            Different courses, same goal — <span style={{ color: '#C88D2D', fontWeight: 700 }}>A brighter future !</span>
          </p>
        </div>

        {/* 7 COURSE CARDS GRID */}
        <div 
          className="course-cards-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          style={{
            alignItems: 'stretch'
          }}
        >
          {sortedCourses.map(course => (
            <div
              key={course.id}
              onClick={() => handleCardClick(course)}
              style={{
                background: course.bgGradient,
                border: `1.5px solid ${course.borderColor}`,
                borderRadius: '24px',
                padding: '1.4rem 1.25rem 1.25rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(35, 30, 25, 0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
                cursor: 'pointer',
                transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.01) translateZ(10px)';
                e.currentTarget.style.boxShadow = `0 18px 36px rgba(35, 30, 25, 0.12), 0 0 0 2px ${course.borderColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(35, 30, 25, 0.05)';
              }}
            >
              {/* Illustration and Top Tagline */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '0.2rem'
                }}>
                  <span style={{
                    fontFamily: "'Kalam', cursive",
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: course.badgeColor,
                    letterSpacing: '0.01em'
                  }}>
                    {course.tagline}
                  </span>
                </div>

                {/* Vector / SVG Illustration */}
                <div style={{
                  width: '100%',
                  height: '110px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem'
                }}>
                  {course.illustration}
                </div>
              </div>

              {/* Card Footer: Details & Circle Arrow Button */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginTop: '0.5rem',
                paddingTop: '0.6rem',
                borderTop: '1px solid rgba(232, 226, 213, 0.6)'
              }}>
                <div>
                  <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#1C1E21',
                    lineHeight: 1.1,
                    margin: 0
                  }}>
                    {course.courseName}
                  </h3>
                  <div style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#4B5563',
                    marginTop: '0.15rem'
                  }}>
                    {course.fullName}
                  </div>
                  <p style={{
                    fontSize: '0.76rem',
                    color: '#6B7280',
                    lineHeight: 1.35,
                    marginTop: '0.35rem',
                    marginRight: '0.3rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {course.description}
                  </p>
                </div>

                {/* Circular Action Button */}
                <button
                  type="button"
                  aria-label={`Explore ${course.courseName}`}
                  style={{
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    borderRadius: '50%',
                    backgroundColor: course.btnColor,
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: `0 4px 12px ${course.badgeColor}40`,
                    transition: 'transform 0.2s ease, backgroundColor 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = course.btnHover;
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = course.btnColor;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM MOTTO: Education Today A Better Tomorrow */}
        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: '40px', height: '3px', backgroundColor: '#C88D2D', borderRadius: '9999px' }} />
          <span style={{
            fontFamily: "'Kalam', cursive",
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#2D261E',
            letterSpacing: '0.03em'
          }}>
            Education Today A Better Tomorrow
          </span>
          <div style={{ width: '40px', height: '3px', backgroundColor: '#C88D2D', borderRadius: '9999px' }} />
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .course-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .course-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
