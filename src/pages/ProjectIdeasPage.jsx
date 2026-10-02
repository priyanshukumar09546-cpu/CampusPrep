// src/pages/ProjectIdeasPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  Cpu, 
  Globe, 
  Brain, 
  Eye, 
  Smartphone, 
  Shield, 
  Cloud, 
  Boxes, 
  BarChart3, 
  Gamepad2, 
  Star, 
  Lightbulb, 
  ChevronRight, 
  Share2, 
  Clock, 
  Users, 
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';
import ProjectSubmitModal from '../components/ProjectSubmitModal';
import ProjectGuideModal from '../components/ProjectGuideModal';
import { PROJECT_GUIDES } from '../data/projectGuidesData';

export default function ProjectIdeasPage({ onNavigate, onOpenAuth }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedTech, setSelectedTech] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [domainCounts, setDomainCounts] = useState({ all: 0 });

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkingId, setBookmarkingId] = useState(null);

  // Modals
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);

  // Domains list with icons and matching colors
  const domainMetadata = [
    { name: 'All Domains', id: 'all', icon: LayoutGrid, color: '#C88D2D', bgColor: '#FEF9EE' },
    { name: 'Web Development', id: 'web-development', icon: Globe, color: '#0284c7', bgColor: '#F0F9FF' },
    { name: 'AI / Machine Learning', id: 'ai-machine-learning', icon: Brain, color: '#9333ea', bgColor: '#FAF5FF' },
    { name: 'Computer Vision', id: 'computer-vision', icon: Eye, color: '#059669', bgColor: '#ECFDF5' },
    { name: 'Android App Development', id: 'android-app-development', icon: Smartphone, color: '#16a34a', bgColor: '#F0FDF4' },
    { name: 'IoT & Embedded Systems', id: 'iot-embedded-systems', icon: Cpu, color: '#d97706', bgColor: '#FFFBEB' },
    { name: 'Cyber Security', id: 'cyber-security', icon: Shield, color: '#dc2626', bgColor: '#FEF2F2' },
    { name: 'Cloud & DevOps', id: 'cloud-devops', icon: Cloud, color: '#0ea5e9', bgColor: '#F0F9FF' },
    { name: 'Blockchain & Web3', id: 'blockchain-web3', icon: Boxes, color: '#ea580c', bgColor: '#FFF7ED' },
    { name: 'Data Science', id: 'data-science', icon: BarChart3, color: '#0d9488', bgColor: '#F0FDFA' },
    { name: 'College & Academic', id: 'college-academic', icon: GraduationCap, color: '#e11d48', bgColor: '#FFF1F2' },
    { name: 'Game Development', id: 'game-development', icon: Gamepad2, color: '#c026d3', bgColor: '#FDF4FF' }
  ];

  // Fetch bookmarked project IDs for current user
  useEffect(() => {
    async function loadBookmarks() {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('/api/projects/user/bookmarks', { headers });
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.bookmarkedIds)) {
          setBookmarkedIds(new Set(data.bookmarkedIds));
        }
      } catch (e) {}
    }
    loadBookmarks();
  }, []);

  // Fetch projects from backend CMS API
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (selectedDomain && selectedDomain !== 'all') params.append('domain', selectedDomain);
        if (selectedLevel && selectedLevel !== 'all') params.append('level', selectedLevel);
        if (selectedTech && selectedTech !== 'all') params.append('tech', selectedTech);
        if (sortBy) params.append('sort', sortBy);
        params.append('limit', '30');

        const res = await fetch(`/api/projects?${params.toString()}`);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text ? `Server error (${res.status}): ${text.slice(0, 200)}` : `Server returned ${res.status}. Make sure the backend is running.`);
        }
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Backend server is not responding with JSON. Make sure the backend is running (npm run server).');
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch projects');
        }

        setProjects(data.projects || []);
        if (data.domainCounts) {
          setDomainCounts(data.domainCounts);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching project ideas:', err);
        setError(err.message || 'Could not connect to the server. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProjects();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedDomain, selectedLevel, selectedTech, sortBy]);

  // Handle Bookmark Toggle
  const handleToggleBookmark = async (e, projectId) => {
    e.stopPropagation();
    try {
      setBookmarkingId(projectId);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/projects/${projectId}/bookmark`, {
        method: 'POST',
        headers
      });
      const data = await res.json();
      if (data.success) {
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          if (data.isBookmarked) {
            next.add(projectId);
          } else {
            next.delete(projectId);
          }
          return next;
        });
        // Update bookmarks count in current view
        setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
            return { ...p, bookmarksCount: data.bookmarksCount };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setBookmarkingId(null);
    }
  };

  const navigateToProject = (slug) => {
    if (onNavigate) {
      onNavigate(`project-detail:${slug}`);
    } else {
      window.location.href = `/project-ideas/${slug}`;
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1F2421', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* 1. BREADCRUMB */}
      <div style={{ borderBottom: '1px solid #E8E2D5', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ padding: '0.65rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#78716C' }}>
            <span 
              onClick={() => onNavigate && onNavigate('home')} 
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              className="hover:underline"
            >
              Home
            </span>
            <span>/</span>
            <span 
              onClick={() => onNavigate && onNavigate('more')} 
              style={{ cursor: 'pointer' }}
              className="hover:underline"
            >
              More
            </span>
            <span>/</span>
            <span style={{ color: '#781416', fontWeight: 700 }}>
              Project Ideas
            </span>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION (Follows exactly media_1790315573713.jpg) */}
      <section style={{
        position: 'relative',
        backgroundColor: '#FAF7F2',
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(200, 141, 45, 0.08), transparent 45%),
          radial-gradient(circle at 85% 80%, rgba(120, 20, 22, 0.05), transparent 50%),
          linear-gradient(180deg, #FDFBF8 0%, #FAF7F2 100%)
        `,
        padding: '2.5rem 1rem 2.25rem',
        borderBottom: '1px solid #E8E2D5'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            
            {/* Left Content */}
            <div style={{ flex: '1 1 560px', maxWidth: '720px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FDF6E8',
                border: '1px solid #E8CD97',
                padding: '0.28rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#8A5D00',
                marginBottom: '0.85rem',
                boxShadow: '0 2px 6px rgba(200,141,45,0.08)'
              }}>
                <Sparkles size={14} color="#C88D2D" />
                <span>Curated Engineering Projects & Source Code</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 900,
                color: '#1F2421',
                lineHeight: 1.15,
                margin: '0 0 0.75rem',
                letterSpacing: '-0.02em',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
              }}>
                Project <span style={{ color: '#781416' }}>Ideas</span>
              </h1>

              <p style={{
                fontSize: '1.02rem',
                color: '#57534E',
                lineHeight: 1.6,
                margin: '0 0 1.25rem',
                maxWidth: '620px'
              }}>
                B.Tech final year & mini project ideas by domains, with source code, guides and resources.
              </p>

              {/* 5 Feature Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  'Verified Source Code',
                  'AKTU Project Format',
                  'Synopsis & SRS Guides',
                  'Viva Questions Included',
                  'Zero Fake Links'
                ].map((pill, idx) => (
                  <div key={idx} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E8E2D5',
                    borderRadius: '9999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#44403C',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}>
                    <CheckCircle2 size={13} color="#059669" />
                    <span>{pill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Mascot & Bulb with Speech Bubble */}
            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {/* Speech Bubble */}
              <div style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                padding: '0.55rem 1rem',
                borderRadius: '14px',
                fontSize: '0.84rem',
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(120, 20, 22, 0.28)',
                marginBottom: '0.75rem',
                position: 'relative',
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em'
              }}>
                Build Real Projects Not Just Marks!
                {/* Speech arrow */}
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '7px solid #781416'
                }} />
              </div>

              {/* Glowing Mascot Bulb Card */}
              <div style={{
                width: '130px',
                height: '130px',
                borderRadius: '24px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #E4CDA1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 14px 32px rgba(200, 141, 45, 0.18)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle, rgba(254, 240, 138, 0.4) 0%, transparent 70%)'
                }} />
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF9C3',
                    border: '2px solid #FACC15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 0 24px rgba(250, 204, 21, 0.5)'
                  }}>
                    <Lightbulb size={34} color="#CA8A04" style={{ filter: 'drop-shadow(0 2px 4px rgba(202, 138, 4, 0.3))' }} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: '#781416',
                    display: 'block',
                    marginTop: '4px',
                    letterSpacing: '0.04em'
                  }}>
                    PROFESSORVIRUS
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SEARCH & MULTI-FILTER BAR */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E2D5', padding: '1rem' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#78716C' }} />
              <input
                type="text"
                placeholder="Search project ideas by keyword, title, technology..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.62rem 1rem 0.62rem 2.45rem',
                  borderRadius: '12px',
                  border: '1.5px solid #E8E2D5',
                  fontSize: '0.88rem',
                  backgroundColor: '#FAF7F2',
                  color: '#1F2421',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Filter Dropdowns */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              {/* Domain Filter */}
              <select
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                style={filterSelectStyle}
              >
                <option value="all">All Domains ({domainCounts.all || 0})</option>
                {domainMetadata.filter(d => d.id !== 'all').map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({domainCounts[d.name] || 0})
                  </option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                style={filterSelectStyle}
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner (1st/2nd Year)</option>
                <option value="Intermediate">Intermediate (3rd Year)</option>
                <option value="Advanced">Advanced (Final Year Major)</option>
              </select>

              {/* Tech Filter */}
              <select
                value={selectedTech}
                onChange={e => setSelectedTech(e.target.value)}
                style={filterSelectStyle}
              >
                <option value="all">All Technologies</option>
                <option value="Python">Python</option>
                <option value="React">React</option>
                <option value="Node">Node.js</option>
                <option value="OpenCV">OpenCV</option>
                <option value="TensorFlow">TensorFlow</option>
                <option value="Flutter">Flutter / Dart</option>
                <option value="Kotlin">Kotlin</option>
                <option value="Solidity">Solidity / Web3</option>
                <option value="FastAPI">FastAPI</option>
                <option value="ESP8266">ESP8266 / IoT</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={filterSelectStyle}
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="newest">Sort: Newest</option>
                <option value="difficulty-asc">Difficulty: Low to High</option>
                <option value="difficulty-desc">Difficulty: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.65rem', fontSize: '0.78rem', color: '#78716C' }}>
            <div>
              Showing <strong style={{ color: '#1F2421' }}>{projects.length}</strong> verified project{projects.length !== 1 ? 's' : ''}
              {selectedDomain !== 'all' && <span> in <strong>{domainMetadata.find(d => d.id === selectedDomain)?.name}</strong></span>}
            </div>
            {(selectedDomain !== 'all' || selectedLevel !== 'all' || selectedTech !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDomain('all');
                  setSelectedLevel('all');
                  setSelectedTech('all');
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#781416',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  textDecoration: 'underline'
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. MAIN 3-COLUMN LAYOUT */}
      <section style={{ padding: '2rem 1rem 4rem' }}>
        <div className="container">
          <div className="projects-grid-layout">
            
            {/* ======================================================== */}
            {/* COLUMN 1: LEFT DOMAIN SELECTOR WITH DYNAMIC DATABASE COUNTS */}
            {/* ======================================================== */}
            <aside style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E8E2D5',
              padding: '1.25rem 0.85rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#78716C',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '0 0.65rem 0.75rem',
                borderBottom: '1px solid #F5F5F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Project Domains</span>
                <span style={{ fontSize: '0.7rem', color: '#A8A29E' }}>100% Real</span>
              </div>

              <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {domainMetadata.map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedDomain === item.id;
                  const count = item.id === 'all' ? (domainCounts.all || 0) : (domainCounts[item.name] || 0);

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedDomain(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #C88D2D' : '1px solid transparent',
                        backgroundColor: isSelected ? '#FEF9EE' : 'transparent',
                        color: isSelected ? '#781416' : '#292524',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#FAF7F2';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: item.bgColor,
                          color: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={14} />
                        </div>
                        <span style={{ lineHeight: 1.2 }}>{item.name}</span>
                      </div>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.12rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? '#781416' : '#F5F5F4',
                        color: isSelected ? '#FFFFFF' : '#78716C',
                        minWidth: '22px',
                        textAlign: 'center'
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* ======================================================== */}
            {/* COLUMN 2: CENTER PROJECT CARDS (2 COLUMNS) */}
            {/* ======================================================== */}
            <main>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: '3px solid #E8E2D5',
                    borderTopColor: '#781416',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 1rem'
                  }} />
                  <p style={{ color: '#78716C', fontSize: '0.9rem', fontWeight: 600 }}>
                    Loading verified engineering projects...
                  </p>
                </div>
              ) : error ? (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '14px',
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#991B1B'
                }}>
                  <p style={{ fontWeight: 700, margin: '0 0 0.5rem' }}>Could not load projects</p>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{error}</p>
                </div>
              ) : projects.length === 0 ? (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #E8E2D5',
                  padding: '3rem 2rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#F5F5F4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: '#78716C'
                  }}>
                    <Search size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.4rem' }}>
                    No matching project ideas found
                  </h3>
                  <p style={{ color: '#78716C', fontSize: '0.88rem', margin: '0 0 1.25rem' }}>
                    Try broadening your search query or selecting "All Domains".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDomain('all');
                      setSelectedLevel('all');
                      setSelectedTech('all');
                    }}
                    style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    View All Projects
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {projects.map(proj => {
                    const isBookmarked = bookmarkedIds.has(proj.id);
                    const isSaving = bookmarkingId === proj.id;

                    return (
                      <div
                        key={proj.id}
                        onClick={() => navigateToProject(proj.slug)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '16px',
                          border: '1.5px solid #E8E2D5',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                          e.currentTarget.style.borderColor = '#C88D2D';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                          e.currentTarget.style.borderColor = '#E8E2D5';
                        }}
                      >
                        {/* Thumbnail / Header Banner */}
                        <div style={{
                          height: '140px',
                          backgroundColor: '#292524',
                          backgroundImage: proj.thumbnail ? `url(${proj.thumbnail})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)'
                          }} />

                          {/* Top Badges */}
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            zIndex: 2
                          }}>
                            {/* Domain Badge */}
                            <span style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              color: '#1F2421',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}>
                              {proj.domain}
                            </span>

                            {/* Bookmark Button */}
                            <button
                              onClick={(e) => handleToggleBookmark(e, proj.id)}
                              disabled={isSaving}
                              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this project'}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: isBookmarked ? '#781416' : 'rgba(255, 255, 255, 0.9)',
                                color: isBookmarked ? '#FFFFFF' : '#44403C',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                              }}
                            >
                              <Bookmark size={15} fill={isBookmarked ? '#FFFFFF' : 'none'} />
                            </button>
                          </div>

                          {/* Bottom Banner Info */}
                          <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            right: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            zIndex: 2
                          }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              backgroundColor: '#C88D2D',
                              color: '#FFFFFF',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              {proj.levelBadge || proj.level}
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#FACC15', fontSize: '0.7rem', fontWeight: 800 }}>
                              <Star size={12} fill="#FACC15" />
                              <span style={{ color: '#FFFFFF' }}>{proj.difficulty || 3}/5</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 800,
                            color: '#1F2421',
                            margin: '0 0 0.45rem',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {proj.title}
                          </h3>

                          <p style={{
                            fontSize: '0.8rem',
                            color: '#57534E',
                            lineHeight: 1.45,
                            margin: '0 0 0.85rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            flex: 1
                          }}>
                            {proj.tagline || proj.description}
                          </p>

                          {/* Tech Stack Badges */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                            {(proj.technologies || []).slice(0, 4).map((tech, tIdx) => (
                              <span key={tIdx} style={{
                                backgroundColor: '#F5F5F4',
                                color: '#44403C',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.18rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #E7E5E4'
                              }}>
                                {tech}
                              </span>
                            ))}
                            {(proj.technologies || []).length > 4 && (
                              <span style={{ fontSize: '0.68rem', color: '#A8A29E', alignSelf: 'center' }}>
                                +{proj.technologies.length - 4} more
                              </span>
                            )}
                          </div>

                          {/* Bottom Action Footer */}
                          <div style={{
                            paddingTop: '0.75rem',
                            borderTop: '1px solid #F5F5F4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                              <CheckCircle2 size={13} />
                              <span>Verified Code</span>
                            </div>

                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              color: '#781416'
                            }}>
                              View Project <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>

            {/* ======================================================== */}
            {/* COLUMN 3: RIGHT PANEL (WHY BUILD + GUIDES + SUBMIT CTA) */}
            {/* ======================================================== */}
            <aside className="projects-right-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* CARD 1: WHY BUILD PROJECTS? */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #E8E2D5',
                padding: '1.25rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <h4 style={{
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  color: '#1F2421',
                  margin: '0 0 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}>
                  <Sparkles size={16} color="#C88D2D" /> Why Build Projects?
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    'Stand Out in Campus Placements & Off-Campus Drives',
                    'Practical Mastery Beyond Textbook Theory',
                    'Crack Technical & System Design Interviews',
                    'Build an Impressive GitHub Profile & Portfolio',
                    'Qualify for National Hackathons & Tech Grants',
                    'Score Top Marks in External University Viva'
                  ].map((benefit, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#44403C', lineHeight: 1.4 }}>
                      <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2: PROJECT IDEAS GUIDES */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #E8E2D5',
                padding: '1.25rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <h4 style={{
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  color: '#1F2421',
                  margin: '0 0 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}>
                  <BookOpen size={16} color="#781416" /> Project Ideas Guide
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {PROJECT_GUIDES.map(guide => (
                    <div
                      key={guide.id}
                      onClick={() => setActiveGuide(guide)}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '10px',
                        border: '1px solid #F5F5F4',
                        backgroundColor: '#FAF7F2',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#FEF9EE';
                        e.currentTarget.style.borderColor = '#E4CDA1';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#FAF7F2';
                        e.currentTarget.style.borderColor = '#F5F5F4';
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1F2421', marginBottom: '0.2rem', lineHeight: 1.3 }}>
                        {guide.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#78716C' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {guide.readTime}
                        </span>
                        <span style={{ color: '#781416', fontWeight: 700 }}>Read Guide →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: SUBMIT YOUR PROJECT IDEA CTA */}
              <div style={{
                background: 'linear-gradient(135deg, #781416 0%, #520d0f 100%)',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.4rem',
                boxShadow: '0 8px 24px rgba(120, 20, 22, 0.25)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <Code2 size={24} color="#FFFFFF" />
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.35rem' }}>
                  Submit Your Project Idea
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  Built something cool or have an authentic open-source project? Share it with 50,000+ AKTU engineering students.
                </p>

                <button
                  onClick={() => setSubmitModalOpen(true)}
                  style={{
                    backgroundColor: '#C88D2D',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.6rem 1.4rem',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 4px 12px rgba(200, 141, 45, 0.35)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Submit Idea →
                </button>
              </div>

            </aside>

          </div>
        </div>
      </section>

      {/* Guide Reader Modal */}
      <ProjectGuideModal
        guide={activeGuide}
        isOpen={Boolean(activeGuide)}
        onClose={() => setActiveGuide(null)}
      />

      {/* Project Submission Modal */}
      <ProjectSubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSuccess={() => {
          // Success callback
        }}
      />

      {/* CSS for responsive 3-column collapse */}
      <style>{`
        @media (max-width: 1024px) {
          .projects-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const filterSelectStyle = {
  padding: '0.6rem 0.85rem',
  borderRadius: '10px',
  border: '1.5px solid #E8E2D5',
  fontSize: '0.82rem',
  fontWeight: 600,
  backgroundColor: '#FAF7F2',
  color: '#1F2421',
  outline: 'none',
  cursor: 'pointer'
};
