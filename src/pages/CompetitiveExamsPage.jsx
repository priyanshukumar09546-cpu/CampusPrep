import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Monitor,
  FlaskConical,
  TrendingUp,
  BookOpen,
  Briefcase,
  Compass,
  Wrench,
  Settings,
  GraduationCap,
  Code,
  Atom,
  Scale,
  Stethoscope,
  MoreHorizontal,
  Shield,
  Cloud,
  Bot,
  Layers,
  Users,
  Lightbulb,
  Rocket,
  BarChart2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Info,
  Building2,
  Landmark,
  Radio,
  Wind,
  Factory,
  Dna,
  Flame,
  Building,
  Zap,
  Check,
  X,
  FileText,
  Award,
  Terminal,
  Database,
  Globe,
  Truck,
  Heart,
  Search
} from 'lucide-react';
import { COURSES_LIST, BTECH_BRANCHES, getGuidanceData } from '../data/competitiveExamsData';

// Dynamic Icon Resolver
function renderIcon(name, size = 16, color = '#781416') {
  const iconMap = {
    Cpu: <Cpu size={size} color={color} />,
    Monitor: <Monitor size={size} color={color} />,
    FlaskConical: <FlaskConical size={size} color={color} />,
    TrendingUp: <TrendingUp size={size} color={color} />,
    BookOpen: <BookOpen size={size} color={color} />,
    Briefcase: <Briefcase size={size} color={color} />,
    Compass: <Compass size={size} color={color} />,
    Wrench: <Wrench size={size} color={color} />,
    Settings: <Settings size={size} color={color} />,
    GraduationCap: <GraduationCap size={size} color={color} />,
    Code: <Code size={size} color={color} />,
    Atom: <Atom size={size} color={color} />,
    Scale: <Scale size={size} color={color} />,
    Stethoscope: <Stethoscope size={size} color={color} />,
    MoreHorizontal: <MoreHorizontal size={size} color={color} />,
    Shield: <Shield size={size} color={color} />,
    Cloud: <Cloud size={size} color={color} />,
    Bot: <Bot size={size} color={color} />,
    Layers: <Layers size={size} color={color} />,
    Users: <Users size={size} color={color} />,
    Lightbulb: <Lightbulb size={size} color={color} />,
    Rocket: <Rocket size={size} color={color} />,
    BarChart2: <BarChart2 size={size} color={color} />,
    Terminal: <Terminal size={size} color={color} />,
    Database: <Database size={size} color={color} />,
    Globe: <Globe size={size} color={color} />,
    Building2: <Building2 size={size} color={color} />,
    Landmark: <Landmark size={size} color={color} />,
    Radio: <Radio size={size} color={color} />,
    Wind: <Wind size={size} color={color} />,
    Factory: <Factory size={size} color={color} />,
    Dna: <Dna size={size} color={color} />,
    Flame: <Flame size={size} color={color} />,
    Building: <Building size={size} color={color} />,
    Zap: <Zap size={size} color={color} />,
    Truck: <Truck size={size} color={color} />,
    Heart: <Heart size={size} color={color} />,
    Award: <Award size={size} color={color} />,
    FileText: <FileText size={size} color={color} />
  };
  return iconMap[name] || <Award size={size} color={color} />;
}

export default function CompetitiveExamsPage({ onNavigate, onOpenAuth }) {
  const [selectedCourseId, setSelectedCourseId] = useState('btech');
  const [selectedBranchId, setSelectedBranchId] = useState('cse');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalItem, setDetailModalItem] = useState(null); // { type, title, desc, url, authority }

  // Current selected guidance dataset
  const guidance = useMemo(() => {
    return getGuidanceData(selectedCourseId, selectedBranchId);
  }, [selectedCourseId, selectedBranchId]);

  const selectedCourse = COURSES_LIST.find((c) => c.id === selectedCourseId) || COURSES_LIST[0];
  const selectedBranch = BTECH_BRANCHES.find((b) => b.id === selectedBranchId) || BTECH_BRANCHES[0];

  // Filter career opportunities by search
  const filteredCareers = useMemo(() => {
    if (!searchQuery.trim()) return guidance.careerOpportunities;
    const q = searchQuery.toLowerCase();
    return guidance.careerOpportunities.filter(
      (c) => c.role.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [guidance, searchQuery]);

  // Filter competitive exams by search
  const filteredExams = useMemo(() => {
    if (!searchQuery.trim()) return guidance.competitiveExams;
    const q = searchQuery.toLowerCase();
    return guidance.competitiveExams.filter(
      (e) => e.name.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q) || e.authority?.toLowerCase().includes(q)
    );
  }, [guidance, searchQuery]);

  // Filter higher studies by search
  const filteredStudies = useMemo(() => {
    if (!searchQuery.trim()) return guidance.higherStudies;
    const q = searchQuery.toLowerCase();
    return guidance.higherStudies.filter(
      (h) => h.title.toLowerCase().includes(q) || h.desc.toLowerCase().includes(q)
    );
  }, [guidance, searchQuery]);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', paddingBottom: '5rem', color: '#1F2421' }}>
      {/* SCOPED RESPONSIVE CSS STYLES */}
      <style>{`
        .course-horizontal-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.75rem;
        }
        @media (max-width: 1100px) {
          .course-horizontal-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (max-width: 840px) {
          .course-horizontal-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 580px) {
          .course-horizontal-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
        }
        .course-card-compact {
          transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .course-card-compact:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(200, 141, 45, 0.12) !important;
          border-color: #C88D2D !important;
        }
        .course-card-compact.selected:hover {
          border-color: #781416 !important;
          box-shadow: 0 6px 16px rgba(120, 20, 22, 0.18) !important;
        }
      `}</style>

      {/* 1. TOP HEADER & BREADCRUMBS */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E2D5', padding: '1.5rem 1.5rem 1.25rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          {/* Breadcrumb navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.65rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => (onNavigate ? onNavigate('home') : (window.location.href = '/'))}>
              Home
            </span>
            <span>/</span>
            <span style={{ cursor: 'pointer' }} onClick={() => (onNavigate ? onNavigate('more') : (window.location.href = '/more'))}>
              More
            </span>
            <span>/</span>
            <span style={{ color: '#781416', fontWeight: 600 }}>Competitive Exam &amp; Career Guidance</span>
          </div>

          {/* Header Title & Quote Card */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#781416',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(120,20,22,0.2)',
                  flexShrink: 0
                }}
              >
                <Compass size={24} color="#FFFFFF" />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1F2421', margin: 0, lineHeight: 1.2 }}>
                  Competitive Exam &amp; Career Guidance
                </h1>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#6B7280' }}>
                  Find out what you can do after your course, major competitive exams, career paths and higher study options.
                </p>
              </div>
            </div>

            {/* Inspirational Quote Card */}
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '0.6rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                maxWidth: '420px'
              }}
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#781416', lineHeight: 1, marginTop: '-4px' }}>
                “
              </span>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#781416', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.35 }}>
                Right guidance today can open hundreds of opportunities tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPACT HORIZONTAL COURSE SELECTOR (MODERN RESPONSIVE GRID) */}
      <section style={{ maxWidth: '1360px', margin: '1.25rem auto 0', padding: '0 1.5rem' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E2D5',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(35,30,25,0.03)'
          }}
        >
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} color="#781416" />
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#1F2421' }}>
                Select Your Course
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#6B7280', display: 'none', '@media (minWidth: 768px)': { display: 'inline' } }}>
                • Choose a degree to view tailored career paths, exams and higher studies
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
              <span style={{ color: '#6B7280' }}>Viewing:</span>
              <span style={{ fontWeight: 800, color: '#781416', backgroundColor: '#FEF2F2', padding: '0.15rem 0.6rem', borderRadius: '9999px', border: '1px solid #FECACA' }}>
                {selectedCourse.name}
              </span>
            </div>
          </div>

          {/* Horizontal Multi-Column Cards Grid (5 Desktop / 4 Laptop / 3 Tablet / 2 Mobile) */}
          <div className="course-horizontal-grid">
            {COURSES_LIST.map((c) => {
              const isActive = selectedCourseId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourseId(c.id);
                    setSearchQuery('');
                  }}
                  className={`course-card-compact ${isActive ? 'selected' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '11px',
                    border: isActive ? '2px solid #781416' : '1.5px solid #E8E2D5',
                    backgroundColor: isActive ? '#FEF2F2' : '#FFFFFF',
                    color: isActive ? '#781416' : '#1F2421',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isActive ? '0 4px 12px rgba(120,20,22,0.12)' : '0 1px 3px rgba(35,30,25,0.02)',
                    position: 'relative',
                    minHeight: '48px',
                    width: '100%'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#781416' : '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {renderIcon(c.icon, 16, isActive ? '#FFFFFF' : '#4B5563')}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: isActive ? 800 : 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2
                      }}
                    >
                      {c.id === 'btech' ? 'B.Tech' : c.id === 'llb' ? 'Law (LLB)' : c.name}
                    </div>
                    {c.id === 'btech' && (
                      <div style={{ fontSize: '0.68rem', color: isActive ? '#991B1B' : '#6B7280', fontWeight: 600, lineHeight: 1 }}>
                        All Branches
                      </div>
                    )}
                  </div>

                  {isActive && (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#781416',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Check size={10} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC GUIDANCE CONTENT SECTION (FULL WIDTH) */}
      <section style={{ maxWidth: '1360px', margin: '1.25rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* 3A. HERO BANNER FOR SELECTED COURSE */}
          <div
            style={{
              background: 'linear-gradient(135deg, #E0F2FE 0%, #EFF6FF 50%, #FAF5FF 100%)',
              borderRadius: '16px',
              border: '1px solid #BFDBFE',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(35,30,25,0.02)'
            }}
          >
            {/* Left Banner Info & Branch Selector */}
            <div style={{ zIndex: 1, maxWidth: '680px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FFFFFF',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0369A1',
                  marginBottom: '0.65rem',
                  border: '1px solid #BAE6FD'
                }}
              >
                <GraduationCap size={13} />
                <span>Degree Guidance Path</span>
              </div>

              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.65rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                {guidance.courseTitle}
              </h2>
              <p style={{ margin: '0.4rem 0 1rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.45 }}>
                {guidance.subtitle}
              </p>

              {/* Branch selector if applicable (e.g. B.Tech) */}
              {selectedCourse.hasBranches && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                    Select Branch:
                  </span>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: '1.5px solid #0284C7',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}
                  >
                    {BTECH_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Right Banner Direction Badges / Signpost Graphic */}
            <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '180px' }}>
              {[
                { label: 'Jobs', bg: '#0284C7', color: '#FFFFFF' },
                { label: 'Higher Studies', bg: '#059669', color: '#FFFFFF' },
                { label: 'Government Exams', bg: '#D97706', color: '#FFFFFF' },
                { label: 'Research & Labs', bg: '#7C3AED', color: '#FFFFFF' },
                { label: 'Entrepreneurship', bg: '#DC2626', color: '#FFFFFF' }
              ].map((pill, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: pill.bg,
                    color: pill.color,
                    padding: '0.3rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                  }}
                >
                  {pill.label}
                </div>
              ))}
            </div>
          </div>

          {/* 3B. SEARCH / FILTER BAR FOR ROLES & EXAMS */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E8E2D5',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 1px 3px rgba(35,30,25,0.02)'
            }}
          >
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              placeholder={`Search career roles, competitive exams, or master degrees for ${selectedCourse.shortName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.88rem',
                color: '#1F2421',
                backgroundColor: 'transparent'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* 3C. THREE CORE GUIDANCE CARDS (3 COLUMNS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>

            {/* ------------------------------------------------------------ */}
            {/* CARD 1: CAREER OPPORTUNITIES */}
            {/* ------------------------------------------------------------ */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E8E2D5',
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(35,30,25,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={18} color="#0284C7" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1F2421' }}>
                    Career Opportunities
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    What jobs you can do after {selectedCourse.shortName} {selectedCourse.hasBranches ? `(${selectedBranch.name.split('(')[1]?.replace(')', '') || 'CSE'})` : ''}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.75rem' }}>
                {filteredCareers.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setDetailModalItem({
                        type: 'Career Role',
                        title: c.role,
                        desc: c.desc,
                        authority: selectedCourse.name
                      })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #F3F4F6',
                      backgroundColor: '#F9FAFB',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#1F2421',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EFF6FF';
                      e.currentTarget.style.borderColor = '#BFDBFE';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                      e.currentTarget.style.borderColor = '#F3F4F6';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {renderIcon(c.icon, 14, '#0284C7')}
                      <span>{c.role}</span>
                    </div>
                    <ChevronRight size={13} color="#9CA3AF" />
                  </div>
                ))}
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 2: COMPETITIVE EXAMS */}
            {/* ------------------------------------------------------------ */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E8E2D5',
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(35,30,25,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={18} color="#059669" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1F2421' }}>
                    Competitive Exams
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    Government and public sector opportunities
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.75rem' }}>
                {filteredExams.map((e, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setDetailModalItem({
                        type: 'Competitive Examination',
                        title: e.name,
                        desc: e.desc,
                        authority: e.authority,
                        url: e.url
                      })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #F3F4F6',
                      backgroundColor: '#F9FAFB',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#1F2421',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(elm) => {
                      elm.currentTarget.style.backgroundColor = '#ECFDF5';
                      elm.currentTarget.style.borderColor = '#A7F3D0';
                    }}
                    onMouseLeave={(elm) => {
                      elm.currentTarget.style.backgroundColor = '#F9FAFB';
                      elm.currentTarget.style.borderColor = '#F3F4F6';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={14} color="#059669" />
                      <span>{e.name}</span>
                    </div>
                    <ChevronRight size={13} color="#9CA3AF" />
                  </div>
                ))}
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 3: HIGHER STUDIES */}
            {/* ------------------------------------------------------------ */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E8E2D5',
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(35,30,25,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={18} color="#7C3AED" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1F2421' }}>
                    Higher Studies
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    What you can study after {selectedCourse.shortName}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.75rem' }}>
                {filteredStudies.map((h, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setDetailModalItem({
                        type: 'Higher Study Option',
                        title: h.title,
                        desc: h.desc,
                        authority: selectedCourse.name
                      })
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #F3F4F6',
                      backgroundColor: '#F9FAFB',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#1F2421',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(elm) => {
                      elm.currentTarget.style.backgroundColor = '#F5F3FF';
                      elm.currentTarget.style.borderColor = '#DDD6FE';
                    }}
                    onMouseLeave={(elm) => {
                      elm.currentTarget.style.backgroundColor = '#F9FAFB';
                      elm.currentTarget.style.borderColor = '#F3F4F6';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {renderIcon(h.icon, 14, '#7C3AED')}
                      <span>{h.title}</span>
                    </div>
                    <ChevronRight size={13} color="#9CA3AF" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3D. BOTTOM ROW (SKILLS, EXPECTED SALARIES, USEFUL TIPS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>

            {/* SKILLS TO FOCUS ON */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF9EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart2 size={16} color="#B45309" />
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 800, margin: 0, color: '#1F2421' }}>
                    Skills to Focus On
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    Important skills for better career opportunities
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.75rem' }}>
                {guidance.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#FEF9EE',
                      border: '1px solid #FDE68A',
                      color: '#92400E',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '0.3rem 0.65rem',
                      borderRadius: '8px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPECTED SALARY RANGE (INDIA) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} color="#DC2626" />
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 800, margin: 0, color: '#1F2421' }}>
                    Expected Salary Range (India)
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    Average package based on roles ({selectedCourse.shortName})
                  </span>
                </div>
              </div>

              <div style={{ border: '1px solid #F3F4F6', borderRadius: '8px', overflow: 'hidden', marginTop: '0.75rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <tbody>
                    {guidance.salaryRanges.map((sal, idx) => (
                      <tr key={idx} style={{ borderBottom: idx !== guidance.salaryRanges.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <td style={{ padding: '0.5rem 0.65rem', fontWeight: 600, color: '#374151' }}>
                          {sal.role}
                        </td>
                        <td style={{ padding: '0.5rem 0.65rem', textAlign: 'right', fontWeight: 700, color: '#781416', fontFamily: "'Outfit', sans-serif" }}>
                          {sal.range}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* USEFUL TIPS */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb size={16} color="#0284C7" />
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 800, margin: 0, color: '#1F2421' }}>
                    Useful Tips
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                    How to plan after {selectedCourse.shortName}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.75rem' }}>
                {guidance.usefulTips.map((tip, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: '#374151', lineHeight: 1.35 }}>
                    <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3E. OFFICIAL ELIGIBILITY & TIME-SENSITIVE DISCLAIMER */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} color="#64748B" />
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                <strong>Official Notice:</strong> Eligibility and notifications may change. Verify the latest official notification on respective government and university portals.
              </span>
            </div>
            <button
              onClick={() => onNavigate ? onNavigate('important-links') : (window.location.href = '/important-links')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#781416',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ExternalLink size={13} /> View Official Links Directory
            </button>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* DETAIL MODAL FOR ANY CLICKED EXAM OR CAREER ROLE */}
      {/* ==================================================================== */}
      {detailModalItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    backgroundColor: '#FEF2F2',
                    color: '#781416'
                  }}
                >
                  {detailModalItem.type}
                </span>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X size={20} />
              </button>
            </div>

            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.5rem' }}>
              {detailModalItem.title}
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
              {detailModalItem.desc}
            </p>

            <div style={{ backgroundColor: '#F8F9FA', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.25rem', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '0.2rem' }}>
                Conducting Authority / Scope:
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1F2421' }}>
                {detailModalItem.authority || 'Academic / Corporate Sector'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setDetailModalItem(null)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#4B5563',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>

              {detailModalItem.url ? (
                <a
                  href={detailModalItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>Verify Official Eligibility</span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <button
                  onClick={() => {
                    setDetailModalItem(null);
                    if (onNavigate) onNavigate('important-links');
                  }}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>View Official Portals</span>
                  <ExternalLink size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
