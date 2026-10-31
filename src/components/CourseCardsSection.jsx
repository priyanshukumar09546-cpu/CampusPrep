import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Dna,
  Sprout,
  FastForward,
  Laptop, 
  Monitor, 
  Binary, 
  Sparkles, 
  BarChart3, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Pill, 
  HeartPulse, 
  Stethoscope, 
  Cpu, 
  FlaskConical,
  Landmark, 
  Palette, 
  Utensils, 
  Scissors, 
  Brush, 
  Wrench,
  Search,
  ArrowRight,
  BookOpen,
  X
} from 'lucide-react';

export default function CourseCardsSection({ onSelectCourse, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 24 Official AKTU Programmes in strict visual sequence
  const courses = [
    // --- 1 to 4: B.Tech Stream ---
    {
      id: 'btech',
      key: 'B.Tech',
      title: 'B.Tech',
      subtitle: 'Engineering',
      category: 'Engineering',
      duration: '4 Years',
      icon: GraduationCap,
      bgColor: '#FEF2F2',
      iconBg: '#DC2626',
      borderColor: '#FECACA',
      arrowBg: '#FEE2E2',
      arrowColor: '#DC2626'
    },
    {
      id: 'btech-biotech',
      key: 'B.Tech Biotechnology',
      title: 'B.Tech Biotechnology',
      subtitle: 'Biotechnology & Life Sciences',
      category: 'Engineering',
      duration: '4 Years',
      icon: Dna,
      bgColor: '#F0FDF4',
      iconBg: '#16A34A',
      borderColor: '#BBF7D0',
      arrowBg: '#DCFCE7',
      arrowColor: '#16A34A'
    },
    {
      id: 'btech-agri',
      key: 'B.Tech Agriculture',
      title: 'B.Tech Agriculture',
      subtitle: 'Agricultural Engineering',
      category: 'Engineering',
      duration: '4 Years',
      icon: Sprout,
      bgColor: '#F7FEE7',
      iconBg: '#65A30D',
      borderColor: '#D9F99D',
      arrowBg: '#ECFCCB',
      arrowColor: '#65A30D'
    },
    {
      id: 'btech-lateral',
      key: 'B.Tech Lateral Entry',
      title: 'B.Tech Lateral Entry',
      subtitle: 'Engineering — Lateral Entry',
      category: 'Engineering',
      duration: '3 Years',
      icon: FastForward,
      bgColor: '#FFF7ED',
      iconBg: '#EA580C',
      borderColor: '#FED7AA',
      arrowBg: '#FFEDD5',
      arrowColor: '#EA580C'
    },

    // --- 5 to 7: BCA & BBA Stream ---
    {
      id: 'bca',
      key: 'BCA',
      title: 'BCA',
      subtitle: 'Computer Applications',
      category: 'Computer Applications',
      duration: '3 Years',
      icon: Laptop,
      bgColor: '#EFF6FF',
      iconBg: '#2563EB',
      borderColor: '#BFDBFE',
      arrowBg: '#DBEAFE',
      arrowColor: '#2563EB'
    },
    {
      id: 'bba',
      key: 'BBA',
      title: 'BBA',
      subtitle: 'Business Administration',
      category: 'Management',
      duration: '3 Years',
      icon: BarChart3,
      bgColor: '#F5F3FF',
      iconBg: '#7C3AED',
      borderColor: '#DDD6FE',
      arrowBg: '#EDE9FE',
      arrowColor: '#7C3AED'
    },
    {
      id: 'bba-bms',
      key: 'BBA / BMS',
      title: 'BBA/BMS',
      subtitle: 'Business Management',
      category: 'Management',
      duration: '3 Years',
      icon: Briefcase,
      bgColor: '#FAF5FF',
      iconBg: '#8B5CF6',
      borderColor: '#E9D5FF',
      arrowBg: '#F3E8FF',
      arrowColor: '#8B5CF6'
    },

    // --- 8 to 10: Pharmacy Stream ---
    {
      id: 'bpharm',
      key: 'B.Pharm',
      title: 'B.Pharm',
      subtitle: 'Pharmacy',
      category: 'Pharmacy & Medical',
      duration: '4 Years',
      icon: Pill,
      bgColor: '#ECFDF5',
      iconBg: '#059669',
      borderColor: '#A7F3D0',
      arrowBg: '#D1FAE5',
      arrowColor: '#059669'
    },
    {
      id: 'bpharm-lateral',
      key: 'B.Pharm Lateral Entry',
      title: 'B.Pharm Lateral Entry',
      subtitle: 'Pharmacy — Lateral Entry',
      category: 'Pharmacy & Medical',
      duration: '3 Years',
      icon: HeartPulse,
      bgColor: '#F0FDF4',
      iconBg: '#15803D',
      borderColor: '#BBF7D0',
      arrowBg: '#DCFCE7',
      arrowColor: '#15803D'
    },
    {
      id: 'pharmd',
      key: 'Pharm.D',
      title: 'Pharm.D',
      subtitle: 'Doctor of Pharmacy',
      category: 'Pharmacy & Medical',
      duration: '6 Years',
      icon: Stethoscope,
      bgColor: '#F0FDF4',
      iconBg: '#047857',
      borderColor: '#A7F3D0',
      arrowBg: '#D1FAE5',
      arrowColor: '#047857'
    },

    // --- 11 to 12: M.Tech & M.Pharm Stream ---
    {
      id: 'mtech',
      key: 'M.Tech',
      title: 'M.Tech',
      subtitle: 'Advanced Engineering',
      category: 'Engineering',
      duration: '2 Years',
      icon: Cpu,
      bgColor: '#EEF2FF',
      iconBg: '#4F46E5',
      borderColor: '#C7D2FE',
      arrowBg: '#E0E7FF',
      arrowColor: '#4F46E5'
    },
    {
      id: 'mpharm',
      key: 'M.Pharm',
      title: 'M.Pharm',
      subtitle: 'Advanced Pharmaceutical Studies',
      category: 'Pharmacy & Medical',
      duration: '2 Years',
      icon: FlaskConical,
      bgColor: '#FDF2F8',
      iconBg: '#9D174D',
      borderColor: '#FBCFE8',
      arrowBg: '#FCE7F3',
      arrowColor: '#9D174D'
    },

    // --- 13 to 15: MCA Stream ---
    {
      id: 'mca',
      key: 'MCA',
      title: 'MCA',
      subtitle: 'Computer Applications',
      category: 'Computer Applications',
      duration: '2 Years',
      icon: Monitor,
      bgColor: '#F0F9FF',
      iconBg: '#0284C7',
      borderColor: '#BAE6FD',
      arrowBg: '#E0F2FE',
      arrowColor: '#0284C7'
    },
    {
      id: 'mca-integrated',
      key: 'MCA Integrated',
      title: 'MCA Integrated',
      subtitle: 'Integrated Computer Applications',
      category: 'Computer Applications',
      duration: '5 Years',
      icon: Binary,
      bgColor: '#F0FDFA',
      iconBg: '#0D9488',
      borderColor: '#99F6E4',
      arrowBg: '#CCFBF1',
      arrowColor: '#0D9488'
    },
    {
      id: 'mca-lateral',
      key: 'MCA Lateral Entry',
      title: 'MCA Lateral Entry',
      subtitle: 'Computer Applications — Lateral Entry',
      category: 'Computer Applications',
      duration: '2 Years',
      icon: Sparkles,
      bgColor: '#ECFEFF',
      iconBg: '#0891B2',
      borderColor: '#A5F3FC',
      arrowBg: '#CFFAFE',
      arrowColor: '#0891B2'
    },

    // --- 16 to 18: MBA Stream ---
    {
      id: 'mba',
      key: 'MBA',
      title: 'MBA',
      subtitle: 'Management',
      category: 'Management',
      duration: '2 Years',
      icon: TrendingUp,
      bgColor: '#FFF1F2',
      iconBg: '#E11D48',
      borderColor: '#FECDD3',
      arrowBg: '#FFE4E6',
      arrowColor: '#E11D48'
    },
    {
      id: 'mba-integrated',
      key: 'MBA Integrated',
      title: 'MBA Integrated',
      subtitle: 'Integrated Management',
      category: 'Management',
      duration: '5 Years',
      icon: Award,
      bgColor: '#FDF2F8',
      iconBg: '#DB2777',
      borderColor: '#FBCFE8',
      arrowBg: '#FCE7F3',
      arrowColor: '#DB2777'
    },
    {
      id: 'mba-lateral',
      key: 'MBA Lateral Entry',
      title: 'MBA Lateral Entry',
      subtitle: 'Management — Lateral Entry',
      category: 'Management',
      duration: '1 Year',
      icon: Briefcase,
      bgColor: '#FFFBEB',
      iconBg: '#D97706',
      borderColor: '#FDE68A',
      arrowBg: '#FEF3C7',
      arrowColor: '#D97706'
    },

    // --- 19 to 24: Design, Arts, Hotel, Fashion & Vocation ---
    {
      id: 'barch',
      key: 'B.Arch',
      title: 'B.Arch',
      subtitle: 'Architecture',
      category: 'Design & Arts',
      duration: '5 Years',
      icon: Landmark,
      bgColor: '#FEFCE8',
      iconBg: '#CA8A04',
      borderColor: '#FEF08A',
      arrowBg: '#FEF9C3',
      arrowColor: '#CA8A04'
    },
    {
      id: 'bdes',
      key: 'B.Des',
      title: 'B.Des',
      subtitle: 'Design',
      category: 'Design & Arts',
      duration: '4 Years',
      icon: Palette,
      bgColor: '#FAF5FF',
      iconBg: '#9333EA',
      borderColor: '#E9D5FF',
      arrowBg: '#F3E8FF',
      arrowColor: '#9333EA'
    },
    {
      id: 'bhmct',
      key: 'BHMCT',
      title: 'BHMCT',
      subtitle: 'Hotel Management & Catering',
      category: 'Design & Arts',
      duration: '4 Years',
      icon: Utensils,
      bgColor: '#FFF7ED',
      iconBg: '#C2410C',
      borderColor: '#FFEDD5',
      arrowBg: '#FFEDD5',
      arrowColor: '#C2410C'
    },
    {
      id: 'bfad',
      key: 'BFAD',
      title: 'BFAD',
      subtitle: 'Fashion & Apparel Design',
      category: 'Design & Arts',
      duration: '4 Years',
      icon: Scissors,
      bgColor: '#FDF4FF',
      iconBg: '#A21CAF',
      borderColor: '#F5D0FE',
      arrowBg: '#FAE8FF',
      arrowColor: '#A21CAF'
    },
    {
      id: 'bfa',
      key: 'BFA',
      title: 'BFA',
      subtitle: 'Fine Arts',
      category: 'Design & Arts',
      duration: '4 Years',
      icon: Brush,
      bgColor: '#FAF5FF',
      iconBg: '#6B21A8',
      borderColor: '#E9D5FF',
      arrowBg: '#F3E8FF',
      arrowColor: '#6B21A8'
    },
    {
      id: 'bvoc',
      key: 'B.Voc',
      title: 'B.Voc',
      subtitle: 'Vocational Studies',
      category: 'Vocational',
      duration: '3 Years',
      icon: Wrench,
      bgColor: '#F1F5F9',
      iconBg: '#475569',
      borderColor: '#CBD5E1',
      arrowBg: '#E2E8F0',
      arrowColor: '#475569'
    }
  ];

  const categories = [
    { label: 'All', count: courses.length },
    { label: 'Engineering', count: courses.filter(c => c.category === 'Engineering').length },
    { label: 'Computer Applications', count: courses.filter(c => c.category === 'Computer Applications').length },
    { label: 'Management', count: courses.filter(c => c.category === 'Management').length },
    { label: 'Pharmacy & Medical', count: courses.filter(c => c.category === 'Pharmacy & Medical').length },
    { label: 'Design & Arts', count: courses.filter(c => c.category === 'Design & Arts').length },
    { label: 'Vocational', count: courses.filter(c => c.category === 'Vocational').length }
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        course.title.toLowerCase().includes(q) ||
        course.key.toLowerCase().includes(q) ||
        course.subtitle.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, courses]);

  const handleCardClick = (course) => {
    if (onSelectCourse) {
      // onSelectCourse already handles navigation to the Notes page
      onSelectCourse(course.id, course.key);
    } else if (onNavigate) {
      // Fallback: navigate to notes if no onSelectCourse handler
      onNavigate('notes');
    }
  };

  return (
    <section 
      id="choose-your-course"
      style={{
        backgroundColor: 'transparent',
        padding: '3.5rem 0 3rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      className="pv-scroll-reveal"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 mb-2.5">
            <BookOpen size={13} className="text-[#FFB800]" />
            <span>AKTU Academic Directory</span>
          </div>
          
          <h2 style={{
            fontSize: 'clamp(1.75rem, 2.5vw, 2.4rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em',
            margin: '0 0 0.5rem 0'
          }}>
            Choose Your Course
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: '#A1A1AA',
            fontWeight: 500,
            margin: 0
          }}>
            Select your degree programme to explore branch-specific notes, syllabus &amp; PYQs
          </p>
        </div>

        {/* Filter Bar: Category Tabs & Search */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Category Tabs (Scrollable on small screens) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveCategory(cat.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-[#FFB800] text-black shadow-[0_0_12px_rgba(255,184,0,0.4)]' 
                      : 'bg-[#0B0B0B] text-zinc-300 border border-white/10 hover:border-[#FFB800]/40 hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/30 text-black font-extrabold' : 'bg-white/10 text-zinc-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[220px] max-w-xs w-full self-end md:self-auto">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-[#0B0B0B] rounded-full border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/30 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 24 Course Cards Responsive Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-[#0B0B0B] rounded-2xl p-10 text-center border border-dashed border-white/20 text-zinc-400 my-4 max-w-md mx-auto">
            <BookOpen size={36} className="mx-auto text-zinc-500 mb-2" />
            <div className="font-bold text-base text-white">No courses match "{searchQuery}"</div>
            <div className="text-xs text-zinc-400 mt-1">Try another keyword or select "All" categories</div>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-3.5 px-4 py-1.5 rounded-full text-xs font-bold text-black bg-[#FFB800] hover:bg-[#FFA000] transition-colors cursor-pointer shadow-[0_0_12px_rgba(255,184,0,0.35)]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
            style={{ alignItems: 'stretch' }}
          >
            {filteredCourses.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.id}
                  href={`/notes?course=${encodeURIComponent(c.key)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardClick(c);
                  }}
                  aria-label={`${c.title} - ${c.subtitle}`}
                  className="group"
                  style={{
                    backgroundColor: '#0B0B0B',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '1.25rem 1rem 1.1rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)',
                    position: 'relative',
                    overflow: 'hidden',
                    outline: 'none',
                    userSelect: 'none',
                    minHeight: '185px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.9), 0 0 16px rgba(255, 184, 0, 0.2)';
                    e.currentTarget.style.borderColor = '#FFB800';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {/* Top Row: Icon Badge & Duration Tag */}
                  <div className="w-full flex items-center justify-between mb-3">
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '13px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#FFB800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 184, 0, 0.25)',
                      flexShrink: 0
                    }}>
                      <Icon size={22} strokeWidth={2.2} aria-hidden="true" focusable="false" />
                    </div>

                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md tracking-tight uppercase"
                      style={{ 
                        backgroundColor: 'rgba(255, 184, 0, 0.12)', 
                        color: '#FFB800',
                        border: '1px solid rgba(255, 184, 0, 0.3)' 
                      }}
                    >
                      {c.duration}
                    </span>
                  </div>

                  {/* Middle Row: Title & Subtitle */}
                  <div className="w-full mb-3 flex-1 flex flex-col justify-start">
                    <div 
                      className="group-hover:text-[#FFB800] transition-colors"
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        lineHeight: 1.25,
                        marginBottom: '0.25rem',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      {c.title}
                    </div>

                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      color: '#A1A1AA',
                      lineHeight: 1.3
                    }}>
                      {c.subtitle}
                    </div>
                  </div>

                  {/* Bottom Row: Academic Tag & Action Arrow Indicator */}
                  <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-semibold text-zinc-400">
                      View Syllabus &amp; Notes
                    </span>

                    <div 
                      className="transition-transform group-hover:translate-x-0.5"
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 184, 0, 0.12)',
                        color: '#FFB800',
                        border: '1px solid rgba(255, 184, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Bottom Helper Note */}
        <div className="mt-6 text-center text-xs text-zinc-400 font-medium">
          Need another course? All 24 official AKTU undergraduate, postgraduate &amp; lateral entry programmes supported.
        </div>
      </div>
    </section>
  );
}
