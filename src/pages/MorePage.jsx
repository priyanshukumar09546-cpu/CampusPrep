import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Layers,
  Award,
  Sparkles,
  Calculator,
  BarChart2,
  Clock,
  Briefcase,
  Code2,
  Compass,
  GraduationCap,
  Link2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  X,
  ChevronRight,
  Sparkles as SparklesIcon,
  Laptop,
  Calendar,
  Building2,
  Zap,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { updateSEOForRoute } from '../utils/seoManager';

export default function MorePage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [courseStreamFilter, setCourseStreamFilter] = useState('All');

  useEffect(() => {
    updateSEOForRoute('more');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 1. POPULAR TOOLS (FEATURED)
  const popularTools = [
    {
      id: 'notes',
      title: 'Engineering Notes',
      desc: 'Verified unit notes, handwritten guides, Quantum series & faculty materials.',
      category: 'Academics',
      badge: '5,000+ Docs',
      badgeBg: '#FEF9EE',
      badgeColor: '#8A5D00',
      icon: BookOpen,
      iconBg: '#FEF3C7',
      iconColor: '#C88D2D',
      borderColor: '#E8D3B0',
      route: 'notes',
      tags: ['notes', 'quantum', 'handwritten', 'engineering', 'study material', 'faculty', 'units']
    },
    {
      id: 'pyqs',
      title: 'AKTU PYQs & Solutions',
      desc: 'Official semester question papers 2017–2026 with solutions & marking schemes.',
      category: 'Academics',
      badge: 'Exam Prep',
      badgeBg: '#FEF2F2',
      badgeColor: '#781416',
      icon: FileText,
      iconBg: '#FEE2E2',
      iconColor: '#781416',
      borderColor: '#FECACA',
      route: 'pyqs',
      tags: ['pyqs', 'question papers', 'past papers', 'aktu', 'previous years', 'exams', 'solutions']
    },
    {
      id: 'syllabus',
      title: 'Curriculum & Syllabus',
      desc: 'Official university curriculum, course credit schemes, units & prescribed books.',
      category: 'Academics',
      badge: 'Updated 2026',
      badgeBg: '#F0FDFA',
      badgeColor: '#0F766E',
      icon: Layers,
      iconBg: '#CCFBF1',
      iconColor: '#0D9488',
      borderColor: '#99F6E4',
      route: 'syllabus',
      tags: ['syllabus', 'curriculum', 'credits', 'units', 'aktu syllabus', 'subjects', 'scheme']
    },
    {
      id: 'quizzes',
      title: 'Practice Quizzes',
      desc: 'Interactive subject quizzes, timed mock tests, instant scoring & answer keys.',
      category: 'Academics',
      badge: 'Interactive',
      badgeBg: '#EFF6FF',
      badgeColor: '#1D4ED8',
      icon: Sparkles,
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      borderColor: '#BFDBFE',
      route: 'quizzes',
      tags: ['quizzes', 'mock test', 'practice', 'mcq', 'test series', 'questions', 'assessment']
    },
    {
      id: 'resume-maker',
      title: '1-Page Resume Maker',
      desc: 'Clean ATS-friendly single page college resume builder with LaTeX and PDF exports.',
      category: 'Career',
      badge: 'ATS Verified',
      badgeBg: '#F0FDF4',
      badgeColor: '#15803D',
      icon: FileText,
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      borderColor: '#BBF7D0',
      route: 'resume-maker',
      tags: ['resume', 'cv', 'ats', 'resume maker', 'builder', 'latex', 'pdf', 'placement']
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      desc: 'AI placement mock rounds: Aptitude assessment, live Coding IDE, Tech viva & HR.',
      category: 'Career',
      badge: 'Beta',
      badgeBg: '#FFF7ED',
      badgeColor: '#C2410C',
      icon: Briefcase,
      iconBg: '#FFEDD5',
      iconColor: '#EA580C',
      borderColor: '#FED7AA',
      route: 'interview-pro',
      tags: ['interview', 'mock interview', 'coding interview', 'aptitude', 'technical', 'hr', 'placement']
    },
    {
      id: 'result-cgpa',
      title: 'Result & CGPA Analyzer',
      desc: 'AKTU marksheet parser, SGPA engine, cumulative CGPA & active backlog status.',
      category: 'Productivity',
      badge: 'Smart Engine',
      badgeBg: '#FEF2F2',
      badgeColor: '#B91C1C',
      icon: Award,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      borderColor: '#FECACA',
      route: 'result-cgpa',
      tags: ['result', 'cgpa', 'sgpa', 'marksheet', 'aktu result', 'grade', 'percentage', 'backlog']
    },
    {
      id: 'pdf-maker',
      title: 'PDF Maker & Studio',
      desc: 'Merge 100+ pages, convert JPG/PNG, split, watermark and organize assignments.',
      category: 'Productivity',
      badge: '100+ Pgs',
      badgeBg: '#FFF7ED',
      badgeColor: '#C2410C',
      icon: FileText,
      iconBg: '#FFEDD5',
      iconColor: '#EA580C',
      borderColor: '#FED7AA',
      route: 'pdf-maker',
      tags: ['pdf', 'merge pdf', 'split pdf', 'convert jpg', 'pdf maker', 'watermark', 'documents']
    }
  ];

  // 2. CORE ACADEMICS
  const academicTools = [
    {
      id: 'pyqs-card',
      title: 'Question Papers (PYQs)',
      desc: 'AKTU, BCA, MCA past papers & solutions spanning all semesters.',
      category: 'Academics',
      badge: 'AKTU',
      badgeBg: '#FEF2F2',
      badgeColor: '#781416',
      icon: FileText,
      iconBg: '#FEE2E2',
      iconColor: '#781416',
      borderColor: '#FECACA',
      route: 'pyqs',
      tags: ['pyqs', 'question papers', 'past papers', 'aktu', 'previous years', 'exams', 'solutions']
    },
    {
      id: 'notes-card',
      title: 'Notes & Study Materials',
      desc: 'Verified handwritten, faculty notes, Quantum summaries & lecture slides.',
      category: 'Academics',
      badge: '5K+ Docs',
      badgeBg: '#FEF9EE',
      badgeColor: '#8A5D00',
      icon: BookOpen,
      iconBg: '#FEF3C7',
      iconColor: '#C88D2D',
      borderColor: '#E8D3B0',
      route: 'notes',
      tags: ['notes', 'quantum', 'handwritten', 'study materials', 'engineering', 'faculty']
    },
    {
      id: 'syllabus-card',
      title: 'Syllabus & Units',
      desc: 'Official curriculum, course units, credit scheme & reference recommendations.',
      category: 'Academics',
      badge: 'Curriculum',
      badgeBg: '#F0FDFA',
      badgeColor: '#0F766E',
      icon: Layers,
      iconBg: '#CCFBF1',
      iconColor: '#0D9488',
      borderColor: '#99F6E4',
      route: 'syllabus',
      tags: ['syllabus', 'curriculum', 'units', 'credit scheme', 'aktu syllabus']
    },
    {
      id: 'quizzes-card',
      title: 'Practice Quizzes',
      desc: 'Interactive subject quizzes, timed mock tests, and instant solution reviews.',
      category: 'Academics',
      badge: 'Assessment',
      badgeBg: '#EFF6FF',
      badgeColor: '#1D4ED8',
      icon: Sparkles,
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      borderColor: '#BFDBFE',
      route: 'quizzes',
      tags: ['quizzes', 'mock tests', 'mcq', 'practice', 'objective questions']
    },
    {
      id: 'choose-course-card',
      title: 'Choose Your Course Hub',
      desc: 'B.Tech, BCA, MCA, MBA & other curricula with tailored resources.',
      category: 'Academics',
      badge: '24 Degrees',
      badgeBg: '#F5F3FF',
      badgeColor: '#6D28D9',
      icon: GraduationCap,
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED',
      borderColor: '#DDD6FE',
      route: 'select-course',
      tags: ['course', 'curriculum', 'degree', 'btech', 'bca', 'mca', 'mba', 'bpharm', 'programs']
    }
  ];

  // 3. STUDENT PRODUCTIVITY & UTILITIES
  const productivityTools = [
    {
      id: 'result-cgpa-tool',
      title: 'Result & CGPA Analyzer',
      desc: 'AKTU marksheet parser, SGPA engine, target planner & backlog tracker.',
      category: 'Productivity',
      badge: 'Marksheet Parser',
      badgeBg: '#FEF2F2',
      badgeColor: '#B91C1C',
      icon: Award,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      borderColor: '#FECACA',
      route: 'result-cgpa',
      tags: ['cgpa', 'sgpa', 'result', 'calculator', 'aktu result', 'marksheet', 'analyzer']
    },
    {
      id: 'attendance-calculator-tool',
      title: 'Attendance Calculator',
      desc: '75% target requirement, safe bunk planner & semester attendance tracking.',
      category: 'Productivity',
      badge: 'Bunk Planner',
      badgeBg: '#FFFBEB',
      badgeColor: '#B45309',
      icon: Calendar,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      borderColor: '#FDE68A',
      route: 'attendance-calculator',
      tags: ['attendance', 'bunk calculator', '75 percent', 'attendance calculator', 'college']
    },
    {
      id: 'timetable-tool',
      title: 'Time Table & Schedule',
      desc: 'Weekly routine, schedule extraction, live next class & semester schedule.',
      category: 'Productivity',
      badge: 'Routine',
      badgeBg: '#F0F9FF',
      badgeColor: '#0369A1',
      icon: Clock,
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      borderColor: '#BAE6FD',
      route: 'timetable',
      tags: ['timetable', 'schedule', 'routine', 'classes', 'weekly planner']
    },
    {
      id: 'pdf-maker-tool',
      title: 'PDF Maker & Splitter',
      desc: 'Merge 100+ pages, convert JPG/PNG, split, watermark and clean assignment sheets.',
      category: 'Productivity',
      badge: 'Fast Studio',
      badgeBg: '#FFF7ED',
      badgeColor: '#C2410C',
      icon: FileText,
      iconBg: '#FFEDD5',
      iconColor: '#EA580C',
      borderColor: '#FED7AA',
      route: 'pdf-maker',
      tags: ['pdf', 'pdf tools', 'merge pdf', 'split pdf', 'watermark', 'image to pdf']
    },
    {
      id: 'progress-tool',
      title: 'Progress & Goal Tracker',
      desc: 'Track study streaks, subject completion, target CGPA & learning analytics.',
      category: 'Student Tools',
      badge: 'Analytics',
      badgeBg: '#EEF2FF',
      badgeColor: '#4338CA',
      icon: TrendingUp,
      iconBg: '#E0E7FF',
      iconColor: '#4F46E5',
      borderColor: '#C7D2FE',
      route: 'progress',
      tags: ['progress', 'goals', 'study streak', 'analytics', 'tracker', 'performance']
    },
    {
      id: 'plagiarism-tool',
      title: 'Plagiarism Checker',
      desc: 'Text originality inspection, similarity scoring & assignment citation integrity.',
      category: 'Student Tools',
      badge: 'Integrity',
      badgeBg: '#FEF2F2',
      badgeColor: '#B91C1C',
      icon: ShieldCheck,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      borderColor: '#FECACA',
      route: 'plagiarism',
      tags: ['plagiarism', 'similarity', 'citations', 'originality', 'checker']
    }
  ];

  // 4. CAREER & PLACEMENT
  const careerTools = [
    {
      id: 'resume-maker-career',
      title: 'ATS Resume Maker',
      desc: 'Single-page college tech resume builder with LaTeX format & instant PDF download.',
      category: 'Career',
      badge: 'High Impact',
      badgeBg: '#F0FDF4',
      badgeColor: '#15803D',
      icon: FileText,
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      borderColor: '#BBF7D0',
      route: 'resume-maker',
      tags: ['resume', 'cv', 'ats', 'placements', 'latex', 'resume builder']
    },
    {
      id: 'interview-pro-career',
      title: 'Interview Pro',
      desc: 'AI mock interviews, company technical coding, voice AI rounds & HR evaluation.',
      category: 'Career',
      badge: 'AI Placement',
      badgeBg: '#FFF7ED',
      badgeColor: '#C2410C',
      icon: Briefcase,
      iconBg: '#FFEDD5',
      iconColor: '#EA580C',
      borderColor: '#FED7AA',
      route: 'interview-pro',
      tags: ['interview', 'mock interview', 'ai interview', 'placement', 'tech viva', 'hr round']
    },
    {
      id: 'interview-coding-tool',
      title: 'Coding Interview IDE',
      desc: 'Algorithmic problem solving, test runner & competitive programming environment.',
      category: 'Career',
      badge: 'Code Engine',
      badgeBg: '#EFF6FF',
      badgeColor: '#1D4ED8',
      icon: Code2,
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      borderColor: '#BFDBFE',
      route: 'interview-coding',
      tags: ['coding', 'dsa', 'algorithms', 'code editor', 'interview coding', 'leetcode', 'ide']
    },
    {
      id: 'competitive-exams-tool',
      title: 'Competitive Exams & Careers',
      desc: 'Detailed roadmaps for GATE, CAT, UPSC, ESE & PSU engineering opportunities.',
      category: 'Career',
      badge: '14+ Degrees',
      badgeBg: '#FEF2F2',
      badgeColor: '#781416',
      icon: Compass,
      iconBg: '#FEE2E2',
      iconColor: '#781416',
      borderColor: '#FECACA',
      route: 'competitive-exams',
      tags: ['gate', 'cat', 'upsc', 'ese', 'psu', 'career guidance', 'competitive exams', 'government jobs']
    },
    {
      id: 'project-ideas-tool',
      title: 'Project Ideas & Repos',
      desc: 'Curated capstone & mini projects with real GitHub source code and architecture.',
      category: 'Career',
      badge: 'Real Repos',
      badgeBg: '#F0FDFA',
      badgeColor: '#0F766E',
      icon: Code2,
      iconBg: '#CCFBF1',
      iconColor: '#0D9488',
      borderColor: '#99F6E4',
      route: 'project-ideas',
      tags: ['projects', 'github', 'capstone', 'mini project', 'source code', 'web development', 'ai ml']
    }
  ];

  // 5. OPPORTUNITIES
  const opportunityTools = [
    {
      id: 'scholarships-tool',
      title: 'Scholarships & Grants',
      desc: 'Government & corporate grants with verified official portal links and eligibility.',
      category: 'Opportunities',
      badge: 'Verified Grants',
      badgeBg: '#FEF9EE',
      badgeColor: '#8A5D00',
      icon: GraduationCap,
      iconBg: '#FEF3C7',
      iconColor: '#C88D2D',
      borderColor: '#E8D3B0',
      route: 'scholarships',
      tags: ['scholarships', 'financial aid', 'grants', 'up scholarship', 'national scholarship', 'fees']
    },
    {
      id: 'internships-jobs-tool',
      title: 'Internships & Jobs',
      desc: 'Verified student internships, off-campus hiring drives & fresher technical roles.',
      category: 'Opportunities',
      badge: 'Hiring Drives',
      badgeBg: '#F0FDFA',
      badgeColor: '#0F766E',
      icon: Briefcase,
      iconBg: '#CCFBF1',
      iconColor: '#0D9488',
      borderColor: '#99F6E4',
      route: 'internships-jobs',
      tags: ['internships', 'jobs', 'fresher hiring', 'off campus', 'tech roles', 'placements']
    },
    {
      id: 'important-links-tool',
      title: 'Important University Links',
      desc: 'Official AKTU ERP, circulars, examination result servers & student portals.',
      category: 'Opportunities',
      badge: 'Official Portals',
      badgeBg: '#F1F5F9',
      badgeColor: '#334155',
      icon: Link2,
      iconBg: '#E2E8F0',
      iconColor: '#475569',
      borderColor: '#CBD5E1',
      route: 'important-links',
      tags: ['aktu erp', 'circulars', 'official links', 'university portals', 'admit card', 'results']
    }
  ];

  // 6. ALL 24 OFFICIAL UNIVERSITY PROGRAMMES
  const allCourses = [
    { key: 'BTech', name: 'B.Tech', fullName: 'Bachelor of Technology', stream: 'Engineering', duration: '4 Years', badgeColor: '#DC2626' },
    { key: 'BTechBiotechnology', name: 'B.Tech Biotechnology', fullName: 'Biotechnology & Life Sciences', stream: 'Engineering', duration: '4 Years', badgeColor: '#16A34A' },
    { key: 'BTechAgriculture', name: 'B.Tech Agriculture', fullName: 'Agricultural Engineering', stream: 'Engineering', duration: '4 Years', badgeColor: '#65A30D' },
    { key: 'BTechLateral', name: 'B.Tech Lateral Entry', fullName: 'Engineering — Lateral Entry', stream: 'Engineering', duration: '3 Years', badgeColor: '#EA580C' },
    { key: 'BCA', name: 'BCA', fullName: 'Bachelor of Computer Applications', stream: 'Computer Applications', duration: '3 Years', badgeColor: '#2563EB' },
    { key: 'BBA', name: 'BBA', fullName: 'Bachelor of Business Administration', stream: 'Management', duration: '3 Years', badgeColor: '#7C3AED' },
    { key: 'BBA_BMS', name: 'BBA / BMS', fullName: 'Bachelor of Management Studies', stream: 'Management', duration: '3 Years', badgeColor: '#8B5CF6' },
    { key: 'BPharma', name: 'B.Pharm', fullName: 'Bachelor of Pharmacy', stream: 'Pharmacy', duration: '4 Years', badgeColor: '#059669' },
    { key: 'BPharmLateral', name: 'B.Pharm Lateral Entry', fullName: 'Pharmacy — Lateral Entry', stream: 'Pharmacy', duration: '3 Years', badgeColor: '#15803D' },
    { key: 'PharmD', name: 'Pharm.D', fullName: 'Doctor of Pharmacy', stream: 'Pharmacy', duration: '6 Years', badgeColor: '#047857' },
    { key: 'MTech', name: 'M.Tech', fullName: 'Master of Technology', stream: 'Engineering', duration: '2 Years', badgeColor: '#4F46E5' },
    { key: 'MPharm', name: 'M.Pharm', fullName: 'Master of Pharmacy', stream: 'Pharmacy', duration: '2 Years', badgeColor: '#9D174D' },
    { key: 'MCA', name: 'MCA', fullName: 'Master of Computer Applications', stream: 'Computer Applications', duration: '2 Years', badgeColor: '#0284C7' },
    { key: 'MCAIntegrated', name: 'MCA Integrated', fullName: 'Integrated Computer Applications', stream: 'Computer Applications', duration: '5 Years', badgeColor: '#0D9488' },
    { key: 'MCALateral', name: 'MCA Lateral Entry', fullName: 'MCA — Lateral Entry', stream: 'Computer Applications', duration: '2 Years', badgeColor: '#0891B2' },
    { key: 'MBA', name: 'MBA', fullName: 'Master of Business Administration', stream: 'Management', duration: '2 Years', badgeColor: '#E11D48' },
    { key: 'MBAIntegrated', name: 'MBA Integrated', fullName: 'Integrated Business Administration', stream: 'Management', duration: '5 Years', badgeColor: '#DB2777' },
    { key: 'MBALateral', name: 'MBA Lateral Entry', fullName: 'MBA — Lateral Entry', stream: 'Management', duration: '2 Years', badgeColor: '#D97706' },
    { key: 'BArch', name: 'B.Arch', fullName: 'Bachelor of Architecture', stream: 'Design & Arts', duration: '5 Years', badgeColor: '#CA8A04' },
    { key: 'BDes', name: 'B.Des', fullName: 'Bachelor of Design', stream: 'Design & Arts', duration: '4 Years', badgeColor: '#9333EA' },
    { key: 'BHMCT', name: 'BHMCT', fullName: 'Hotel Management & Catering', stream: 'Design & Arts', duration: '4 Years', badgeColor: '#C2410C' },
    { key: 'BFAD', name: 'BFAD', fullName: 'Fashion & Apparel Design', stream: 'Design & Arts', duration: '4 Years', badgeColor: '#A21CAF' },
    { key: 'BFA', name: 'BFA', fullName: 'Bachelor of Fine Arts', stream: 'Design & Arts', duration: '4 Years', badgeColor: '#6B21A8' },
    { key: 'BVoc', name: 'B.Voc', fullName: 'Bachelor of Vocation', stream: 'Vocational', duration: '3 Years', badgeColor: '#475569' }
  ];

  // Combined master list of tools for global smart search
  const masterToolsList = useMemo(() => {
    const list = [
      ...popularTools,
      ...academicTools.filter(t => !popularTools.some(p => p.route === t.route && p.title === t.title)),
      ...productivityTools.filter(t => !popularTools.some(p => p.route === t.route && p.title === t.title)),
      ...careerTools.filter(t => !popularTools.some(p => p.route === t.route && p.title === t.title)),
      ...opportunityTools.filter(t => !popularTools.some(p => p.route === t.route && p.title === t.title))
    ];
    return list;
  }, []);

  // Filtered tools based on search query & active category chip
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return masterToolsList.filter((tool) => {
      // Category chip match
      const matchCategory =
        activeCategory === 'All' ||
        tool.category.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === 'Tools' && (tool.category === 'Productivity' || tool.category === 'Student Tools'));

      if (!matchCategory) return false;
      if (!q) return true;

      // Smart text search
      const titleMatch = tool.title.toLowerCase().includes(q);
      const descMatch = tool.desc.toLowerCase().includes(q);
      const categoryMatch = tool.category.toLowerCase().includes(q);
      const tagMatch = tool.tags && tool.tags.some((tag) => tag.toLowerCase().includes(q));
      return titleMatch || descMatch || categoryMatch || tagMatch;
    });
  }, [searchQuery, activeCategory, masterToolsList]);

  // Filtered courses based on stream filter and search query
  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allCourses.filter((course) => {
      const matchStream = courseStreamFilter === 'All' || course.stream === courseStreamFilter;
      if (!matchStream) return false;
      if (!q) return true;
      return (
        course.name.toLowerCase().includes(q) ||
        course.fullName.toLowerCase().includes(q) ||
        course.stream.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, courseStreamFilter]);

  const categories = ['All', 'Academics', 'Productivity', 'Career', 'Opportunities', 'Student Tools'];
  const courseStreams = ['All', 'Engineering', 'Computer Applications', 'Management', 'Pharmacy', 'Design & Arts', 'Vocational'];

  const handleToolClick = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const handleCourseClick = (courseKey) => {
    if (onNavigate) {
      onNavigate('notes', courseKey);
    }
  };

  const isSearching = searchQuery.trim().length > 0 || activeCategory !== 'All';

  return (
    <div
      style={{
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        color: '#1C1E21',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* ========================================================================= */}
      {/* 1. BREADCRUMB & HUB NAVIGATION HEADER                                     */}
      {/* ========================================================================= */}
      <div
        style={{
          borderBottom: '1px solid #E8E2D5',
          backgroundColor: '#FFFFFF',
          padding: '0.65rem 0'
        }}
      >
        <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#78716C', fontWeight: 600 }}>
            <button
              onClick={() => onNavigate && onNavigate('home')}
              style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer', padding: 0, fontWeight: 600 }}
              className="hover:underline"
            >
              Home
            </button>
            <ChevronRight size={14} color="#A8A29E" />
            <span style={{ color: '#781416', fontWeight: 800 }}>More Resources & Tools</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '3rem 0 2.5rem 0',
          position: 'relative'
        }}
      >
        <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #EBE4D5',
              padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.25rem, 3.5vw, 2.5rem)',
              boxShadow: '0 10px 40px rgba(35, 30, 25, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              backgroundImage: 'radial-gradient(#E8E2D5 1.1px, transparent 1.1px)',
              backgroundSize: '20px 20px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                backgroundColor: '#FEF9EE',
                border: '1px solid #F5E6CC',
                color: '#8A5D00',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                marginBottom: '1.25rem'
              }}
            >
              <Sparkles size={14} color="#C88D2D" />
              <span>Everything You Need For College & Careers</span>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
                fontWeight: 900,
                color: '#1C1917',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                margin: '0 auto 1rem auto',
                maxWidth: '850px'
              }}
            >
              Everything You Need, In{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #C88D2D 0%, #E68A00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                One Place
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.4vw, 1.12rem)',
                color: '#665E55',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto 2rem auto',
                fontWeight: 500
              }}
            >
              Explore all the academic, productivity, career and student resources available on ProfessorVirus.
            </p>

            {/* Smart Search Bar */}
            <div
              style={{
                maxWidth: '620px',
                margin: '0 auto 1.5rem auto',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FAF7F2',
                  border: '2px solid #E8E2D5',
                  borderRadius: '16px',
                  padding: '0.4rem 0.6rem 0.4rem 1.1rem',
                  boxShadow: '0 4px 18px rgba(35, 30, 25, 0.05)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                className="pv-search-container"
              >
                <Search size={19} color="#8A5D00" style={{ flexShrink: 0, marginRight: '0.65rem' }} />
                <input
                  type="text"
                  placeholder="Search tools, resources, subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    fontSize: '0.96rem',
                    fontWeight: 600,
                    color: '#1C1917',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                  aria-label="Search tools and resources"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: '#EAE5DB',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#44403C',
                      marginLeft: '0.5rem',
                      flexShrink: 0
                    }}
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0 auto'
              }}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '9999px',
                      border: isActive ? '1.5px solid #781416' : '1.5px solid #E8E2D5',
                      backgroundColor: isActive ? '#781416' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#44403C',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(120, 20, 22, 0.22)' : '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                    className="pv-cat-chip"
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC SEARCH / FILTERED RESULTS VIEW (IF ACTIVATED)                 */}
      {/* ========================================================================= */}
      {isSearching && (
        <section style={{ padding: '0 0 3.5rem 0' }}>
          <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1C1917' }}>
                  Search Results
                </h2>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem', color: '#78716C' }}>
                  Showing {filteredTools.length} resource{filteredTools.length !== 1 ? 's' : ''} matching your filter
                </p>
              </div>

              {(searchQuery || activeCategory !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  style={{
                    background: 'none',
                    border: '1.5px solid #E8E2D5',
                    borderRadius: '8px',
                    padding: '0.35rem 0.8rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#781416',
                    cursor: 'pointer',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {filteredTools.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #EBE4D5',
                  padding: '3.5rem 1.5rem',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF2F2',
                    color: '#781416',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}
                >
                  <Search size={26} />
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#1C1917' }}>
                  No tools found matching "{searchQuery}"
                </h3>
                <p style={{ color: '#78716C', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
                  Try searching for keywords like "notes", "pyqs", "cgpa", "resume", "pdf" or "interview".
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['notes', 'pyqs', 'resume', 'cgpa', 'interview', 'pdf'].map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setSearchQuery(kw)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: '#FAF7F2',
                        border: '1px solid #E8E2D5',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#781416',
                        cursor: 'pointer'
                      }}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.15rem'
                }}
              >
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.route)} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. DEFAULT COMPREHENSIVE HUB SECTIONS                                     */}
      {/* ========================================================================= */}
      {!isSearching && (
        <>
          {/* SECTION 1: POPULAR TOOLS (FEATURED) */}
          <section style={{ padding: '0 0 3.5rem 0' }}>
            <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <SectionHeader
                tag="Most Used"
                tagBg="#FEF9EE"
                tagColor="#8A5D00"
                title="Popular Tools"
                subtitle="High-impact academic and career engines used daily by engineering students."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
                  gap: '1.15rem'
                }}
                className="pv-popular-grid"
              >
                {popularTools.map((tool) => (
                  <HorizontalToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.route)} />
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 2: CORE ACADEMICS */}
          <section style={{ padding: '0 0 3.5rem 0' }}>
            <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <SectionHeader
                tag="Curriculum"
                tagBg="#FEF2F2"
                tagColor="#781416"
                title="Core Academics"
                subtitle="Everything you need for your engineering studies and semester exams."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.15rem'
                }}
              >
                {academicTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.route)} />
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: STUDENT PRODUCTIVITY & UTILITIES */}
          <section style={{ padding: '0 0 3.5rem 0' }}>
            <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <SectionHeader
                tag="Utilities"
                tagBg="#FFFBEB"
                tagColor="#B45309"
                title="Student Productivity & Utilities"
                subtitle="Useful tools for everyday academic routine, attendance & document management."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.15rem'
                }}
              >
                {productivityTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.route)} />
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: CAREER & PLACEMENT */}
          <section style={{ padding: '0 0 3.5rem 0' }}>
            <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <SectionHeader
                tag="Placement Prep"
                tagBg="#F0FDF4"
                tagColor="#15803D"
                title="Career & Placement"
                subtitle="Build your technical profile, ace real AI mock interviews & prepare for opportunities."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.15rem'
                }}
              >
                {careerTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.route)} />
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: OPPORTUNITIES */}
          <section style={{ padding: '0 0 3.5rem 0' }}>
            <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <SectionHeader
                tag="Growth"
                tagBg="#F0FDFA"
                tagColor="#0F766E"
                title="Opportunities"
                subtitle="Scholarships, hiring drives & official university resources."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.15rem'
                }}
              >
                {opportunityTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onClick={() => handleToolClick(tool.route)} />
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: COURSE / PROGRAM HUB */}
          <section style={{ padding: '0 0 4.5rem 0' }}>
            <div className="container pv-main-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1.5px solid #EBE4D5',
                  padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                  boxShadow: '0 10px 30px rgba(35, 30, 25, 0.04)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    marginBottom: '2rem'
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: '#F5F3FF',
                        border: '1px solid #DDD6FE',
                        color: '#6D28D9',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '0.65rem'
                      }}
                    >
                      <GraduationCap size={13} />
                      <span>24 Official University Programmes</span>
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
                        fontWeight: 900,
                        color: '#1C1917',
                        margin: '0 0 0.4rem 0',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      Explore Your Course
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#78716C', maxWidth: '640px' }}>
                      Access verified semester-wise notes, PYQs, and syllabi curated for your specific curriculum.
                    </p>
                  </div>

                  {/* Course Stream Filter Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {courseStreams.map((stream) => {
                      const isStreamActive = courseStreamFilter === stream;
                      return (
                        <button
                          key={stream}
                          type="button"
                          onClick={() => setCourseStreamFilter(stream)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '9999px',
                            border: isStreamActive ? '1.5px solid #7C3AED' : '1px solid #E8E2D5',
                            backgroundColor: isStreamActive ? '#F5F3FF' : '#FAF7F2',
                            color: isStreamActive ? '#6D28D9' : '#57534E',
                            fontSize: '0.76rem',
                            fontWeight: isStreamActive ? 800 : 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {stream}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Course Cards Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  {filteredCourses.map((course) => (
                    <button
                      key={course.key}
                      type="button"
                      onClick={() => handleCourseClick(course.key)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '1.15rem 1.1rem',
                        borderRadius: '16px',
                        border: '1.5px solid #EBE4D5',
                        backgroundColor: '#FAF7F2',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        outline: 'none'
                      }}
                      className="pv-course-card"
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <span
                            style={{
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: '1.05rem',
                              fontWeight: 900,
                              color: course.badgeColor,
                              letterSpacing: '-0.01em'
                            }}
                          >
                            {course.name}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: '#78716C',
                              backgroundColor: '#EAE5DB',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '9999px'
                            }}
                          >
                            {course.duration}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#1C1917',
                            marginBottom: '0.25rem',
                            lineHeight: 1.3
                          }}
                        >
                          {course.fullName}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 600 }}>
                          {course.stream}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginTop: '1rem',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          color: '#781416'
                        }}
                      >
                        <span>Open Notes & PYQs</span>
                        <ArrowRight size={13} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Hover & Micro-interaction CSS */}
      <style>{`
        .pv-search-container:focus-within {
          border-color: #C88D2D !important;
          box-shadow: 0 4px 20px rgba(200, 141, 45, 0.16) !important;
          background-color: #FFFFFF !important;
        }
        .pv-cat-chip:hover {
          border-color: #781416 !important;
          transform: translateY(-1px);
        }
        .pv-tool-card {
          box-shadow: 0 2px 10px rgba(35, 30, 25, 0.03);
        }
        .pv-tool-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(35, 30, 25, 0.08) !important;
          border-color: #C88D2D !important;
          background-color: #FCFAF6 !important;
        }
        .pv-tool-card:hover .pv-card-arrow {
          transform: translateX(4px);
          color: #781416 !important;
        }
        .pv-horizontal-tool-card {
          box-shadow: 0 2px 10px rgba(35, 30, 25, 0.03);
        }
        .pv-horizontal-tool-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(35, 30, 25, 0.08) !important;
          border-color: #C88D2D !important;
          background-color: #FCFAF6 !important;
        }
        .pv-horizontal-tool-card:hover .pv-hcard-btn {
          background-color: #781416 !important;
          color: #FFFFFF !important;
          border-color: #781416 !important;
        }
        .pv-horizontal-tool-card:hover .pv-hcard-btn svg {
          transform: translateX(3px);
        }
        @media (max-width: 680px) {
          .pv-popular-grid {
            grid-template-columns: 1fr !important;
          }
          .pv-horizontal-tool-card {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.85rem !important;
          }
          .pv-horizontal-tool-card .pv-hcard-btn {
            align-self: flex-end !important;
          }
        }
        .pv-course-card:hover {
          transform: translateY(-3px);
          border-color: #781416 !important;
          background-color: #FFFFFF !important;
          box-shadow: 0 10px 24px rgba(35, 30, 25, 0.06);
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function SectionHeader({ tag, tagBg, tagColor, title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.35rem' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.22rem 0.65rem',
          borderRadius: '9999px',
          backgroundColor: tagBg,
          color: tagColor,
          fontSize: '0.7rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.4rem'
        }}
      >
        <span>{tag}</span>
      </div>
      <h2
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(1.4rem, 2.2vw, 1.85rem)',
          fontWeight: 800,
          color: '#1C1917',
          margin: '0 0 0.35rem 0',
          letterSpacing: '-0.02em'
        }}
      >
        {title}
      </h2>
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#78716C', maxWidth: '640px', lineHeight: 1.45 }}>
        {subtitle}
      </p>
    </div>
  );
}

function HorizontalToolCard({ tool, onClick }) {
  const Icon = tool.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.35rem',
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #EBE4D5',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        outline: 'none',
        height: '100%',
        boxSizing: 'border-box',
        gap: '1.25rem'
      }}
      className="pv-horizontal-tool-card"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: tool.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tool.iconColor,
            border: `1px solid ${tool.borderColor || '#E8E2D5'}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            flexShrink: 0
          }}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: tool.badgeBg,
                color: tool.badgeColor,
                border: `1px solid ${tool.badgeColor}30`,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap'
              }}
            >
              {tool.badge}
            </span>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                color: '#8A8275',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {tool.category}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#1C1917',
              margin: '0 0 0.25rem 0',
              lineHeight: 1.25,
              letterSpacing: '-0.01em'
            }}
          >
            {tool.title}
          </h3>

          <p
            style={{
              fontSize: '0.8rem',
              color: '#665E55',
              lineHeight: 1.45,
              margin: 0,
              fontWeight: 500
            }}
          >
            {tool.desc}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.8rem',
          fontWeight: 800,
          color: '#781416',
          backgroundColor: '#FAF7F2',
          border: '1.5px solid #E8E2D5',
          padding: '0.45rem 0.9rem',
          borderRadius: '9999px',
          flexShrink: 0,
          transition: 'all 0.18s ease'
        }}
        className="pv-hcard-btn"
      >
        <span>Explore</span>
        <ArrowRight size={14} />
      </div>
    </button>
  );
}

function ToolCard({ tool, onClick, featured }) {
  const Icon = tool.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 1.2rem',
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #EBE4D5',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        outline: 'none',
        height: '100%',
        boxSizing: 'border-box'
      }}
      className="pv-tool-card"
    >
      <div>
        {/* Top Row: Icon + Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: tool.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tool.iconColor,
              border: `1px solid ${tool.borderColor || '#E8E2D5'}`,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              flexShrink: 0
            }}
          >
            <Icon size={20} strokeWidth={2.2} />
          </div>

          <span
            style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              padding: '0.18rem 0.55rem',
              borderRadius: '9999px',
              backgroundColor: tool.badgeBg,
              color: tool.badgeColor,
              border: `1px solid ${tool.badgeColor}30`,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap'
            }}
          >
            {tool.badge}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#1C1917',
            margin: '0 0 0.4rem 0',
            lineHeight: 1.25,
            letterSpacing: '-0.01em'
          }}
        >
          {tool.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.78rem',
            color: '#665E55',
            lineHeight: 1.45,
            margin: '0 0 1.15rem 0',
            fontWeight: 500
          }}
        >
          {tool.desc}
        </p>
      </div>

      {/* Card Action Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #F5F1E9',
          paddingTop: '0.75rem',
          marginTop: 'auto'
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#8A8275',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          {tool.category}
        </span>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#781416',
            transition: 'transform 0.18s ease'
          }}
          className="pv-card-arrow"
        >
          <span>Explore</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </button>
  );
}
