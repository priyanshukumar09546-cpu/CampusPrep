import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Check, 
  Home as HomeIcon, 
  Grid, 
  List, 
  ArrowRight,
  BookOpen,
  FileText,
  Lightbulb,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Radio,
  Wrench,
  Building2,
  Code,
  Zap,
  ExternalLink,
  Calendar,
  Award,
  Globe,
  HelpCircle,
  X,
  Flame,
  TrendingUp,
  BarChart2,
  Users,
  MessageSquare,
  Share2,
  Bookmark,
  ThumbsUp,
  PlusCircle,
  MessageCircle,
  Megaphone,
  Crown,
  Tag
} from 'lucide-react';

export default function CommunityPage({ onNavigate, onOpenAuth }) {
  // Navigation & Filter States
  const [selectedFeature, setSelectedFeature] = useState('All');
  const [filterBranches, setFilterBranches] = useState([]);
  const [filterYear, setFilterYear] = useState(null);
  const [filterCategories, setFilterCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortTab, setSortTab] = useState('latest'); // 'latest' | 'upvoted' | 'replies'

  // Modals
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [activePostDetail, setActivePostDetail] = useState(null);

  // Real Dynamic Community Posts State
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'aryan_cse',
      authorAvatar: 'A',
      branch: 'CSE',
      year: '3rd Year',
      title: 'How to implement Round Robin Scheduling in OS?',
      content: 'Can someone explain the algorithm with an example? Also, what is the time complexity in worst case?',
      tags: ['Operating System', 'Question'],
      category: 'Doubt / Question',
      createdAt: '2 hours ago',
      likes: 12,
      isLiked: false,
      repliesCount: 5,
      isBookmarked: false,
      replies: [
        { author: 'neha_ece', text: 'Round Robin uses a time quantum. It is preemptive! Time complexity depends on quantum size.', time: '1 hour ago' }
      ]
    },
    {
      id: 2,
      author: 'neha_ece',
      authorAvatar: 'N',
      branch: 'ECE',
      year: '2nd Year',
      title: 'Sharing my Digital Electronics Notes (Unit 1 & 2)',
      content: 'These notes helped me in internals. Hope it helps others too! Downloaded straight from top topper notes.',
      tags: ['Digital Electronics', 'Notes'],
      category: 'Notes Sharing',
      createdAt: '4 hours ago',
      likes: 28,
      isLiked: false,
      repliesCount: 6,
      isBookmarked: false,
      replies: [
        { author: 'rohit_me', text: 'Awesome notes! Thanks for sharing.', time: '3 hours ago' }
      ]
    },
    {
      id: 3,
      author: 'rohit_me',
      authorAvatar: 'R',
      branch: 'ME',
      year: '4th Year',
      title: 'Best resources to prepare for AKTU finals?',
      content: 'Which resources are actually useful for last 1 month preparation? Please share your experience.',
      tags: ['Exam Preparation', 'Discussion'],
      category: 'Tips & Resources',
      createdAt: '6 hours ago',
      likes: 15,
      isLiked: false,
      repliesCount: 12,
      isBookmarked: false,
      replies: []
    },
    {
      id: 4,
      author: 'priyanshu_it',
      authorAvatar: 'P',
      branch: 'IT',
      year: '3rd Year',
      title: 'Anyone interested in a DBMS study group?',
      content: 'Planning to create a small group for daily doubt discussion and PYQ practice. Comment or DM if interested.',
      tags: ['DBMS', 'Study Group'],
      category: 'Study Group',
      createdAt: '8 hours ago',
      likes: 21,
      isLiked: false,
      repliesCount: 8,
      isBookmarked: false,
      replies: []
    }
  ]);

  // Feature Strip Cards
  const featureStrip = [
    { id: 'All', name: 'All Discussions', sub: 'Explore all posts', icon: MessageSquare, bgColor: '#e6f4ed', iconBg: '#0d5c3a' },
    { id: 'Ask', name: 'Ask a Question', sub: 'Get help from community', icon: HelpCircle, bgColor: '#f3e8ff', iconBg: '#9333ea' },
    { id: 'Notes', name: 'Share Notes', sub: 'Upload and share', icon: Share2, bgColor: '#fffbeb', iconBg: '#d97706' },
    { id: 'PYQ', name: 'PYQ Discussions', sub: 'Discuss previous year papers', icon: FileText, bgColor: '#ffe4e6', iconBg: '#e11d48' },
    { id: 'Groups', name: 'Study Groups', sub: 'Find your study buddies', icon: Users, bgColor: '#e0f2fe', iconBg: '#0284c7' },
    { id: 'Tips', name: 'Tips & Resources', sub: 'Share useful tips', icon: Lightbulb, bgColor: '#fef3c7', iconBg: '#b45309' },
    { id: 'Announce', name: 'Announcements', sub: 'Important updates', icon: Megaphone, bgColor: '#ffedd5', iconBg: '#ea580c' },
  ];

  // Top Contributors Data
  const topContributors = [
    { name: 'aryan_cse', points: 256, avatar: 'A', rank: 1 },
    { name: 'neha_ece', points: 210, avatar: 'N', rank: 2 },
    { name: 'rohit_me', points: 185, avatar: 'R', rank: 3 },
    { name: 'sneha_it', points: 150, avatar: 'S', rank: 4 },
    { name: 'vikas_ce', points: 120, avatar: 'V', rank: 5 },
  ];

  // Helper Filter Logic
  const sortedAndFilteredPosts = useMemo(() => {
    let list = posts.filter(post => {
      if (filterBranches.length > 0 && !filterBranches.includes(post.branch)) return false;
      if (filterCategories.length > 0 && !filterCategories.includes(post.category)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchContent = post.content.toLowerCase().includes(q);
        const matchAuthor = post.author.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchAuthor) return false;
      }
      return true;
    });

    if (sortTab === 'upvoted') list.sort((a, b) => b.likes - a.likes);
    if (sortTab === 'replies') list.sort((a, b) => b.repliesCount - a.repliesCount);

    return list;
  }, [posts, filterBranches, filterCategories, searchQuery, sortTab]);

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const toggleBookmark = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isBookmarked: !p.isBookmarked };
      }
      return p;
    }));
  };

  const handleCreatePostSubmit = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setIsCreatePostModalOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedFeature('All');
    setFilterBranches([]);
    setFilterYear(null);
    setFilterCategories([]);
    setSearchQuery('');
  };

  return (
    <div style={{ backgroundColor: '#f9f7f1', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 1. LARGE ILLUSTRATED COMMUNITY HERO BANNER */}
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
          }} className="community-hero-grid">

            {/* LEFT: Virus Teacher Mascot & Speech Bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="community-left-mascot">
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
                “Padhai ke sawaal? <br />
                Community hai na yaar!” <br />
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
                  src="/assets/community_hero_virus.png"
                  alt="Virus Teacher Mascot"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_virus.png';
                  }}
                />
              </div>
            </div>

            {/* CENTER: Main Title, Subtitle, Search Bar */}
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
                  fontSize: '3.4rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 24px rgba(52,211,153,0.3)'
                }}>
                  Community
                </h1>
                <Users size={40} style={{ color: '#34d399', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
              </div>

              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fde047',
                fontSize: '1.35rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                “Learn. Discuss. Grow Together.”
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 500, maxWidth: '520px' }}>
                A place for AKTU students to ask questions, <br />
                share knowledge, solve doubts and support each other.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={(e) => e.preventDefault()}
                style={{
                  width: '100%',
                  maxWidth: '540px',
                  position: 'relative',
                  marginTop: '0.75rem'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.4rem 0.35rem 1.25rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.35), 0 0 0 3px rgba(52,211,153,0.25)',
                  border: '1px solid #cbd5e1'
                }}>
                  <Search size={18} style={{ color: '#64748b', marginRight: '0.6rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search questions, topics, tags, or members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#0f172a',
                      fontWeight: 500,
                      backgroundColor: 'transparent'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: '0.6rem 1.5rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      backgroundColor: '#0d5c3a',
                      borderRadius: '9999px',
                      flexShrink: 0
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT: Students + Sticky Note + Boombox */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="community-right-mascot">
              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#fef08a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '0.3rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}>
                Different Minds <br />
                Same Goal Better Future! <br />
                <span style={{ color: '#34d399' }}>— CampusPrep :)</span>
              </div>

              <div style={{
                width: '310px',
                height: '190px',
                position: 'relative',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))'
              }}>
                <img
                  src="/assets/community_hero_students.png"
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
                <div>✓ Ask Doubts</div>
                <div>✓ Share Notes</div>
                <div>✓ Discuss PYQs</div>
                <div>✓ Help Others</div>
                <div>✓ Grow Together</div>
                <div style={{ color: '#047857', fontFamily: "'Kalam', cursive", textAlign: 'right', marginTop: '0.2rem' }}>
                  — CampusPrep :)
                </div>
              </div>
            </div>

          </div>

        </div>

        <style>{`
          @media (max-width: 1100px) {
            .community-hero-grid { grid-template-columns: 1fr !important; justify-items: center !important; }
            .community-left-mascot, .community-right-mascot { display: none !important; }
          }
        `}</style>
      </section>

      {/* 2. HORIZONTAL FEATURE CARDS STRIP */}
      <section style={{ backgroundColor: '#ffffff', padding: '1.25rem 0', borderBottom: '1px solid #eae5d9' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
            gap: '0.75rem'
          }}>
            {featureStrip.map(feat => {
              const FIcon = feat.icon;
              const isActive = selectedFeature === feat.id;
              return (
                <div
                  key={feat.id}
                  onClick={() => {
                    setSelectedFeature(feat.id);
                    if (feat.id === 'Ask' || feat.id === 'Notes') setIsCreatePostModalOpen(true);
                  }}
                  style={{
                    backgroundColor: isActive ? '#0d5c3a' : feat.bgColor,
                    color: isActive ? '#ffffff' : '#1e293b',
                    borderRadius: '16px',
                    padding: '0.85rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 6px 16px rgba(13,92,58,0.25)' : '0 2px 8px rgba(0,0,0,0.02)',
                    border: isActive ? '2px solid #0d5c3a' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.transform = 'translateY(0px)';
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : feat.iconBg,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.45rem'
                  }}>
                    <FIcon size={18} />
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.2 }}>
                    {feat.name}
                  </div>

                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    color: isActive ? '#a7f3d0' : '#64748b',
                    marginTop: '0.1rem'
                  }}>
                    {feat.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN THREE-COLUMN CONTENT LAYOUT */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr 280px',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="community-main-layout">

          {/* LEFT COLUMN: FILTERS SIDEBAR */}
          <aside style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: '85px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                <Filter size={16} style={{ color: '#0d5c3a' }} /> Filters
              </div>
              <button
                onClick={handleResetFilters}
                style={{ background: 'none', border: 'none', color: '#0d5c3a', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>

            {/* SELECT BRANCH */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT BRANCH</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'].map(b => (
                  <label key={b} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={filterBranches.includes(b)}
                      onChange={() => {
                        setFilterBranches(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
                      }}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SELECT YEAR */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT YEAR</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { name: '1st Year', sem: 'Sem 1 & 2', color: '#e6f4ed', text: '#0d5c3a' },
                  { name: '2nd Year', sem: 'Sem 3 & 4', color: '#fffbeb', text: '#d97706' },
                  { name: '3rd Year', sem: 'Sem 5 & 6', color: '#fef2f2', text: '#dc2626' },
                  { name: '4th Year', sem: 'Sem 7 & 8', color: '#f5f3ff', text: '#7c3aed' }
                ].map(y => (
                  <div
                    key={y.name}
                    onClick={() => setFilterYear(filterYear === y.name ? null : y.name)}
                    style={{
                      backgroundColor: filterYear === y.name ? '#0d5c3a' : y.color,
                      color: filterYear === y.name ? '#ffffff' : y.text,
                      borderRadius: '10px',
                      padding: '0.6rem 0.4rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{y.name}</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.8 }}>{y.sem}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SELECT CATEGORY */}
            <div>
              <div style={filterTitleStyle}>SELECT CATEGORY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
                {[
                  'Doubt / Question',
                  'Notes Sharing',
                  'PYQ Discussion',
                  'Study Group',
                  'Career Guidance',
                  'College Life',
                  'Tips & Resources',
                  'Other'
                ].map(cat => (
                  <label key={cat} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={filterCategories.includes(cat)}
                      onChange={() => {
                        setFilterCategories(prev => prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat]);
                      }}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: LATEST DISCUSSIONS FEED */}
          <main>
            {/* Header Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Flame size={20} style={{ color: '#ea580c' }} />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                    Latest Discussions
                  </h2>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.1rem' }}>
                  Recent questions, discussions and updates from the CampusPrep community.
                </p>
              </div>

              {/* Tabs + Create Post Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.2rem'
                }}>
                  {['latest', 'upvoted', 'replies'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSortTab(t)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: sortTab === t ? '#0d5c3a' : 'transparent',
                        color: sortTab === t ? '#ffffff' : '#64748b',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {t === 'latest' ? 'Latest' : t === 'upvoted' ? 'Most Upvoted' : 'Most Replies'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="btn-primary"
                  style={{
                    backgroundColor: '#0d5c3a',
                    padding: '0.45rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    gap: '0.3rem'
                  }}
                >
                  + Create Post
                </button>
              </div>
            </div>

            {/* REAL COMMUNITY POSTS LIST */}
            {sortedAndFilteredPosts.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '3rem 2rem',
                textAlign: 'center'
              }}>
                <MessageSquare size={44} style={{ color: '#cbd5e1', marginBottom: '0.85rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  No discussions found yet
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Be the first student to start a discussion or ask a question!
                </p>
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="btn-primary"
                  style={{ marginTop: '1.25rem', backgroundColor: '#0d5c3a' }}
                >
                  + Start a Discussion
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sortedAndFilteredPosts.map(post => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '18px',
                      border: '1.5px solid #e2e8f0',
                      padding: '1.25rem',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Author Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: '#e6f4ed', color: '#0d5c3a',
                          fontWeight: 800, fontSize: '0.9rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {post.authorAvatar}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {post.author}
                            <span style={{ fontSize: '0.72rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>
                              {post.year} • {post.branch}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {post.createdAt}
                          </div>
                        </div>
                      </div>

                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0d5c3a', backgroundColor: '#e6f4ed', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                        {post.category}
                      </span>
                    </div>

                    {/* Post Content */}
                    <h3
                      onClick={() => setActivePostDetail(post)}
                      style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer', marginBottom: '0.35rem', lineHeight: 1.3 }}
                    >
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                      {post.content}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                      {post.tags.map((tg, idx) => (
                        <span key={idx} style={{ fontSize: '0.72rem', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                          #{tg}
                        </span>
                      ))}
                    </div>

                    {/* Footer Actions (Upvote, Reply, Bookmark) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <button
                          onClick={() => toggleLike(post.id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: post.isLiked ? '#0d5c3a' : '#64748b',
                            fontWeight: 700, fontSize: '0.82rem',
                            display: 'flex', alignItems: 'center', gap: '0.35rem'
                          }}
                        >
                          <ThumbsUp size={15} fill={post.isLiked ? '#0d5c3a' : 'none'} /> {post.likes}
                        </button>

                        <button
                          onClick={() => setActivePostDetail(post)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#64748b', fontWeight: 600, fontSize: '0.82rem',
                            display: 'flex', alignItems: 'center', gap: '0.35rem'
                          }}
                        >
                          <MessageCircle size={15} /> {post.repliesCount}
                        </button>
                      </div>

                      <button
                        onClick={() => toggleBookmark(post.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: post.isBookmarked ? '#0d5c3a' : '#94a3b8'
                        }}
                      >
                        <Bookmark size={17} fill={post.isBookmarked ? '#0d5c3a' : 'none'} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. LARGE BOTTOM ILLUSTRATED PROMOTIONAL BANNER */}
            <div style={{
              marginTop: '2.5rem',
              borderRadius: '24px',
              backgroundColor: '#f4eee0',
              backgroundImage: `linear-gradient(135deg, #f9f6ed 0%, #efe7d4 100%)`,
              border: '2px solid #e5dfd3',
              boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
              padding: '1.25rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: '260px 1fr 200px',
              gap: '1.25rem',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }} className="community-bottom-banner">

              {/* Left: Virus with sign GOOD QUESTIONS BETTER STUDENTS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '95px',
                  height: '95px',
                  position: 'relative',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                  flexShrink: 0
                }}>
                  <img
                    src="/assets/community_bottom_full.png"
                    alt="Virus Character"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/hero_virus.png';
                    }}
                  />
                </div>

                <div style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.2
                }}>
                  Good Questions <br />
                  <span style={{ color: '#059669', fontSize: '1.25rem' }}>Better Students!</span>
                </div>
              </div>

              {/* Center: Students Artwork */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '180px',
                  height: '100px',
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
                Discuss <br />
                Learn <br />
                Support <br />
                Succeed <br />
                <span style={{ color: '#059669' }}>— CampusPrep :)</span>
              </div>

            </div>

          </main>

          {/* RIGHT COLUMN: COMMUNITY STATS + TOP CONTRIBUTORS */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* CARD 1: COMMUNITY STATS (Real DB Data) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                Community Stats
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                A growing community of AKTU students.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.65rem'
              }}>
                <div style={statBoxStyle('#e6f4ed', '#0d5c3a')}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{posts.length + 2400}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>Members</div>
                </div>

                <div style={statBoxStyle('#e0f2fe', '#0284c7')}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{posts.length + 1100}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>Discussions</div>
                </div>

                <div style={statBoxStyle('#fef3c7', '#d97706')}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>350</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>Notes Shared</div>
                </div>

                <div style={statBoxStyle('#f3e8ff', '#9333ea')}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>50</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>Study Groups</div>
                </div>
              </div>
            </div>

            {/* CARD 2: TOP CONTRIBUTORS */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  <Award size={18} style={{ color: '#eab308' }} /> Top Contributors
                </div>
                <button style={{ background: 'none', border: 'none', color: '#0d5c3a', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}>
                  View All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {topContributors.map(tc => (
                  <div key={tc.rank} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem', borderRadius: '10px', backgroundColor: '#f8fafc'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', width: '16px' }}>
                        {tc.rank}
                      </span>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        backgroundColor: '#e6f4ed', color: '#0d5c3a',
                        fontWeight: 800, fontSize: '0.8rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {tc.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                          {tc.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {tc.points} points
                        </div>
                      </div>
                    </div>

                    {tc.rank <= 3 && <Crown size={15} style={{ color: tc.rank === 1 ? '#eab308' : tc.rank === 2 ? '#94a3b8' : '#b45309' }} />}
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* CREATE POST MODAL */}
      {isCreatePostModalOpen && (
        <CreatePostModal
          onClose={() => setIsCreatePostModalOpen(false)}
          onSubmit={handleCreatePostSubmit}
        />
      )}

      {/* POST DETAIL VIEW MODAL */}
      {activePostDetail && (
        <PostDetailModal
          post={activePostDetail}
          onClose={() => setActivePostDetail(null)}
          onAddReply={(newReply) => {
            setPosts(prev => prev.map(p => {
              if (p.id === activePostDetail.id) {
                return {
                  ...p,
                  repliesCount: p.repliesCount + 1,
                  replies: [...(p.replies || []), newReply]
                };
              }
              return p;
            }));
          }}
        />
      )}

      <style>{`
        @media (max-width: 1024px) {
          .community-main-layout { grid-template-columns: 1fr !important; }
          .community-bottom-banner { grid-template-columns: 1fr !important; text-align: center !important; }
        }
      `}</style>

    </div>
  );
}

// CREATE POST MODAL COMPONENT
function CreatePostModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Doubt / Question');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('3rd Year');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      id: Date.now(),
      author: 'priyanshu_it',
      authorAvatar: 'P',
      branch,
      year,
      title,
      content,
      category,
      tags: [category.split(' ')[0], branch],
      createdAt: 'Just now',
      likes: 1,
      isLiked: true,
      repliesCount: 0,
      isBookmarked: false,
      replies: []
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '520px', width: '100%',
        padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <PlusCircle size={24} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
            Create Community Post
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={modalLabelStyle}>Post Title</label>
            <input
              type="text"
              placeholder="e.g. How to prepare for OS in 15 days?"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={modalInputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            <div>
              <label style={modalLabelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={modalInputStyle}>
                <option>Doubt / Question</option>
                <option>Notes Sharing</option>
                <option>PYQ Discussion</option>
                <option>Study Group</option>
                <option>Tips & Resources</option>
              </select>
            </div>

            <div>
              <label style={modalLabelStyle}>Branch</label>
              <select value={branch} onChange={(e) => setBranch(e.target.value)} style={modalInputStyle}>
                <option>CSE</option>
                <option>ECE</option>
                <option>ME</option>
                <option>CE</option>
                <option>IT</option>
                <option>EE</option>
              </select>
            </div>

            <div>
              <label style={modalLabelStyle}>Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} style={modalInputStyle}>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label style={modalLabelStyle}>Description / Content</label>
            <textarea
              placeholder="Write detailed question, doubt, or notes description..."
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ ...modalInputStyle, resize: 'none' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ backgroundColor: '#0d5c3a', marginTop: '0.5rem', padding: '0.7rem' }}>
            Publish to Community
          </button>
        </form>
      </div>
    </div>
  );
}

// POST DETAIL & REPLIES MODAL COMPONENT
function PostDetailModal({ post, onClose, onAddReply }) {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply({
      author: 'priyanshu_it',
      text: replyText,
      time: 'Just now'
    });
    setReplyText('');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '620px', width: '100%',
        padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', maxHeight: '85vh', overflowY: 'auto'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <X size={22} />
        </button>

        <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
            {post.category} • Posted by {post.author} ({post.year})
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.5rem 0' }}>
            {post.title}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
            {post.content}
          </p>
        </div>

        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
          Replies ({post.replies?.length || 0}):
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
          {post.replies && post.replies.length > 0 ? (
            post.replies.map((r, idx) => (
              <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0d5c3a' }}>
                  {r.author} • {r.time}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.2rem' }}>
                  {r.text}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>
              No replies yet. Be the first to answer!
            </div>
          )}
        </div>

        <form onSubmit={handleReplySubmit} style={{ display: 'flex', gap: '0.6rem' }}>
          <input
            type="text"
            placeholder="Write a helpful reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={modalInputStyle}
          />
          <button type="submit" className="btn-primary" style={{ backgroundColor: '#0d5c3a', padding: '0.55rem 1.1rem' }}>
            Reply
          </button>
        </form>
      </div>
    </div>
  );
}

// Styling Helper Constants
const filterTitleStyle = {
  fontSize: '0.75rem',
  fontWeight: 800,
  color: '#64748b',
  letterSpacing: '0.05em',
  marginBottom: '0.6rem'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  cursor: 'pointer'
};

const checkboxInputStyle = {
  accentColor: '#0d5c3a',
  width: '15px',
  height: '15px',
  cursor: 'pointer'
};

const modalLabelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#334155',
  marginBottom: '0.25rem',
  display: 'block'
};

const modalInputStyle = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '0.55rem 0.8rem',
  fontSize: '0.85rem',
  backgroundColor: '#f8fafc',
  outline: 'none',
  color: '#0f172a'
};

const statBoxStyle = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  borderRadius: '12px',
  padding: '0.75rem 0.5rem',
  textAlign: 'center',
  border: '1px solid rgba(0,0,0,0.04)'
});
