// src/pages/InternshipsJobsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase, Search, Filter, MapPin, Building2, Calendar, ArrowRight,
  Bookmark, CheckCircle2, ChevronRight, Sparkles, Star, FileText,
  Clock, ShieldCheck, ExternalLink, Share2, Layers, Award,
  Code2, BarChart3, Brain, Globe, Smartphone, Shield, Cloud, Server,
  Target, Palette, TrendingUp, Cog, Cpu, Building, Check, ArrowUpRight
} from 'lucide-react';
import CareerResourceModal from '../components/CareerResourceModal';
import EmployerSubmitModal from '../components/EmployerSubmitModal';
import ApplicationTrackModal from '../components/ApplicationTrackModal';
import { careerResourcesData } from '../data/careerResourcesData';

export default function InternshipsJobsPage({ onNavigate, onOpenAuth }) {
  const [opportunities, setOpportunities] = useState([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [domainCounts, setDomainCounts] = useState({ all: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // User bookmarks & tracking state
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [trackedApplications, setTrackedApplications] = useState([]);

  // Modals state
  const [activeResource, setActiveResource] = useState(null);
  const [employerModalOpen, setEmployerModalOpen] = useState(false);
  const [trackingModalOpp, setTrackingModalOpp] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch opportunities from Backend API
  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedDomain && selectedDomain !== 'all') params.append('domain', selectedDomain);
      if (selectedType && selectedType !== 'all') params.append('type', selectedType);
      if (selectedCourse && selectedCourse !== 'all') params.append('course', selectedCourse);
      if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation);
      if (selectedWorkMode && selectedWorkMode !== 'all') params.append('workMode', selectedWorkMode);
      if (sortBy) params.append('sort', sortBy);
      params.append('page', page);
      params.append('limit', '20');

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) return;
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.opportunities || []);
        if (data.featuredOpportunities && data.featuredOpportunities.length > 0) {
          setFeaturedOpportunities(data.featuredOpportunities);
        }
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.domainCounts) {
          setDomainCounts(data.domainCounts);
        }
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories Metadata with dynamic DB counts
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/opportunities/categories');
      if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch User Bookmarks & Tracked Applications
  const fetchUserEngagement = async () => {
    try {
      const safeJson = (r) => (r.ok && (r.headers.get('content-type') || '').includes('application/json')) ? r.json() : {};
      const [bmRes, trackRes] = await Promise.all([
        fetch('/api/opportunities/user/bookmarks').then(safeJson).catch(() => ({})),
        fetch('/api/opportunities/user/applications').then(safeJson).catch(() => ({}))
      ]);
      if (bmRes.success) setBookmarkedIds(bmRes.bookmarkedIds || []);
      if (trackRes.success) setTrackedApplications(trackRes.applications || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchOpportunities();
  }, [debouncedSearch, selectedDomain, selectedType, selectedCourse, selectedLocation, selectedWorkMode, sortBy, page]);

  useEffect(() => {
    fetchCategories();
    fetchUserEngagement();
  }, []);

  // Handle Bookmark Toggle
  const handleToggleBookmark = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/opportunities/${id}/bookmark`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBookmarkedIds(prev => 
          data.isBookmarked ? [...prev, id] : prev.filter(bId => bId !== id)
        );
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Handle Share / Copy Link
  const handleShare = (opp, e) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/internships-jobs/${opp.slug || opp.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(opp.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Category Icon Resolver
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code2': return <Code2 size={16} />;
      case 'BarChart3': return <BarChart3 size={16} />;
      case 'Brain': return <Brain size={16} />;
      case 'Globe': return <Globe size={16} />;
      case 'Smartphone': return <Smartphone size={16} />;
      case 'Shield': return <Shield size={16} />;
      case 'Cloud': return <Cloud size={16} />;
      case 'Server': return <Server size={16} />;
      case 'Target': return <Target size={16} />;
      case 'Palette': return <Palette size={16} />;
      case 'TrendingUp': return <TrendingUp size={16} />;
      case 'Cog': return <Cog size={16} />;
      case 'Cpu': return <Cpu size={16} />;
      case 'Briefcase': return <Briefcase size={16} />;
      default: return <Briefcase size={16} />;
    }
  };

  // Company Brand Color/Initial Avatar Helper
  const renderCompanyAvatar = (opp, size = 44) => {
    const name = opp.companyName || 'Company';
    const firstLetter = name.charAt(0).toUpperCase();
    
    // Check if real logo image URL exists
    if (opp.companyLogo && opp.companyLogo.startsWith('http')) {
      return (
        <img
          src={opp.companyLogo}
          alt={name}
          onError={(e) => { e.target.style.display = 'none'; }}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: 'contain',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            padding: '2px',
            border: '1px solid #E8E2D5'
          }}
        />
      );
    }

    // High quality branded fallback avatar
    const colors = ['#781416', '#0284C7', '#059669', '#7C3AED', '#D97706', '#DB2777', '#4F46E5'];
    const colorIndex = (name.charCodeAt(0) + name.length) % colors.length;
    const bg = colors[colorIndex];

    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '10px',
        backgroundColor: bg,
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size > 40 ? '1.1rem' : '0.9rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        flexShrink: 0
      }}>
        {firstLetter}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#FDFBF7',
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: '#1C1E21',
      paddingBottom: '4rem'
    }}>
      {/* 1. TOP BREADCRUMB */}
      <div className="container" style={{
        padding: '0.9rem 1.25rem 0.4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontSize: '0.82rem',
        color: '#65676B'
      }}>
        <button
          onClick={() => onNavigate && onNavigate('home')}
          style={{ background: 'none', border: 'none', color: '#65676B', cursor: 'pointer', padding: 0 }}
        >
          Home
        </button>
        <ChevronRight size={13} />
        <button
          onClick={() => onNavigate && onNavigate('more')}
          style={{ background: 'none', border: 'none', color: '#65676B', cursor: 'pointer', padding: 0 }}
        >
          More
        </button>
        <ChevronRight size={13} />
        <span style={{ color: '#781416', fontWeight: 700 }}>Internships & Jobs</span>
      </div>

      <div className="container">
        {/* 2. HERO BANNER WITH DOCTOR VIRUS MASCOT */}
        <div style={{
          backgroundColor: '#FFFDF9',
          backgroundImage: 'radial-gradient(ellipse at top right, #FDF3DB 0%, #FFFDF9 60%)',
          borderRadius: '24px',
          border: '1.5px solid #F3E6C8',
          boxShadow: '0 10px 30px rgba(200, 141, 45, 0.08)',
          padding: '2rem 2.25rem',
          margin: '0.8rem 0 1.8rem',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Top Row: Title + Mascot Speech */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(217, 119, 6, 0.3)',
                flexShrink: 0
              }}>
                <Briefcase size={32} />
              </div>
              <div>
                <h1 style={{
                  margin: 0,
                  fontSize: '2.1rem',
                  fontWeight: 900,
                  color: '#1C1E21',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15
                }}>
                  Internships & Jobs
                </h1>
                <p style={{
                  margin: '0.4rem 0 0',
                  fontSize: '0.96rem',
                  color: '#4B5563',
                  fontWeight: 500,
                  lineHeight: 1.45
                }}>
                  Find the best internships and job opportunities to kickstart your career.
                </p>
              </div>
            </div>

            {/* Mascot Career Illustration & Speech Bubble */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }} className="desktop-hero-mascot">
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '0.75rem 1.1rem',
                border: '1.5px solid #F6E2B3',
                boxShadow: '0 6px 18px rgba(35,30,25,0.06)',
                position: 'relative',
                textAlign: 'right'
              }}>
                <span style={{
                  display: 'block',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  color: '#781416',
                  lineHeight: 1.25
                }}>
                  Your Dream<br />Career Starts<br />Here! ✨
                </span>
              </div>
              <img
                src="/assets/navbar_logo.png"
                alt="ProfessorVirus Career Mascot"
                style={{
                  width: '74px',
                  height: '74px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))'
                }}
              />
            </div>
          </div>

          {/* Bottom Row: 4 Feature Highlight Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            paddingTop: '0.5rem'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '0.9rem 1.1rem',
              border: '1px solid #E8E2D5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Building2 size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#1C1E21', fontWeight: 800 }}>Top Companies</strong>
                <span style={{ fontSize: '0.74rem', color: '#65676B' }}>Google, Microsoft, Amazon & more</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '0.9rem 1.1rem',
              border: '1px solid #E8E2D5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#1C1E21', fontWeight: 800 }}>Verified Opportunities</strong>
                <span style={{ fontSize: '0.74rem', color: '#65676B' }}>Real & genuine listings</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '0.9rem 1.1rem',
              border: '1px solid #E8E2D5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#1C1E21', fontWeight: 800 }}>Internships & Full-time</strong>
                <span style={{ fontSize: '0.74rem', color: '#65676B' }}>For students and freshers</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '0.9rem 1.1rem',
              border: '1px solid #E8E2D5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#F3E8FF',
                color: '#7E22CE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Award size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#1C1E21', fontWeight: 800 }}>Career Resources</strong>
                <span style={{ fontSize: '0.74rem', color: '#65676B' }}>Resume, Interview & more</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SEARCH & FILTER TOOLBAR */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1.5px solid #E8E2D5',
          padding: '0.9rem 1.25rem',
          boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {/* Main Search Row with dropdown filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap'
          }}>
            {/* Search Input Field */}
            <div style={{
              flex: '1 1 280px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F7F5F0',
              borderRadius: '12px',
              padding: '0.65rem 1rem',
              border: '1px solid #E8E2D5'
            }}>
              <Search size={18} color="#65676B" style={{ marginRight: '0.65rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search internships, jobs, companies, or roles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.9rem',
                  color: '#1C1E21',
                  fontFamily: 'inherit'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown Filters matching screenshot */}
            <select
              value={selectedDomain}
              onChange={e => { setSelectedDomain(e.target.value); setPage(1); }}
              style={{
                padding: '0.65rem 0.95rem',
                borderRadius: '12px',
                border: '1.5px solid #E8E2D5',
                backgroundColor: '#FFFFFF',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#374151',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Domains</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={e => { setSelectedType(e.target.value); setPage(1); }}
              style={{
                padding: '0.65rem 0.95rem',
                borderRadius: '12px',
                border: '1.5px solid #E8E2D5',
                backgroundColor: '#FFFFFF',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#374151',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Apprenticeship">Apprenticeship</option>
            </select>

            <select
              value={selectedLocation}
              onChange={e => { setSelectedLocation(e.target.value); setPage(1); }}
              style={{
                padding: '0.65rem 0.95rem',
                borderRadius: '12px',
                border: '1.5px solid #E8E2D5',
                backgroundColor: '#FFFFFF',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#374151',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Noida">Noida / Delhi NCR</option>
              <option value="Pan India">Pan India</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '0.65rem 0.95rem',
                borderRadius: '12px',
                border: '1.5px solid #E8E2D5',
                backgroundColor: '#FFFFFF',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#374151',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="latest">Sort by: Latest</option>
              <option value="deadline">Sort by: Deadline</option>
              <option value="popular">Sort by: Popular</option>
            </select>
          </div>

          {/* Secondary Filter Row: Course pills matching requirement */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            paddingTop: '0.35rem',
            borderTop: '1px solid #F0ECE4',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#65676B' }}>
              Target Course:
            </span>
            {['all', 'B.Tech', 'MCA', 'MBA', 'B.Pharm'].map(c => {
              const isActive = selectedCourse === c;
              return (
                <button
                  key={c}
                  onClick={() => { setSelectedCourse(c); setPage(1); }}
                  style={{
                    padding: '0.28rem 0.8rem',
                    borderRadius: '9999px',
                    border: isActive ? '1.5px solid #781416' : '1px solid #E5E7EB',
                    backgroundColor: isActive ? '#781416' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#4B5563',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {c === 'all' ? 'All Degrees' : c}
                </button>
              );
            })}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#65676B' }}>
                Mode:
              </span>
              {['all', 'Remote', 'Hybrid', 'On-site'].map(m => {
                const isActive = selectedWorkMode === m;
                return (
                  <button
                    key={m}
                    onClick={() => { setSelectedWorkMode(m); setPage(1); }}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? '#FDF6E8' : 'transparent',
                      color: isActive ? '#C88D2D' : '#65676B',
                      fontSize: '0.76rem',
                      fontWeight: isActive ? 800 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {m === 'all' ? 'Any' : m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. MAIN 3-COLUMN LAYOUT MATCHING SCREENSHOT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 310px',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="job-portal-3col-grid">
          
          {/* ======================================================== */}
          {/* COLUMN 1: LEFT SIDEBAR (Job & Internship Categories)    */}
          {/* ======================================================== */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E8E2D5',
            padding: '1.25rem 0.85rem',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)',
            position: 'sticky',
            top: '80px'
          }}>
            <h3 style={{
              margin: '0 0.65rem 0.85rem',
              fontSize: '0.98rem',
              fontWeight: 800,
              color: '#1C1E21'
            }}>
              Job & Internship Categories
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {/* All Opportunities Category Button */}
              <button
                onClick={() => { setSelectedDomain('all'); setPage(1); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: selectedDomain === 'all' ? '#781416' : 'transparent',
                  color: selectedDomain === 'all' ? '#FFFFFF' : '#374151',
                  fontWeight: selectedDomain === 'all' ? 800 : 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Briefcase size={16} />
                  <span>All Opportunities</span>
                </div>
                <span style={{
                  backgroundColor: selectedDomain === 'all' ? 'rgba(255,255,255,0.22)' : '#F3EFE6',
                  color: selectedDomain === 'all' ? '#FFFFFF' : '#781416',
                  padding: '0.12rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {domainCounts.all || totalCount}
                </span>
              </button>

              {/* Dynamic Domain Categories */}
              {categories.filter(c => c.id !== 'all').map(cat => {
                const isSelected = selectedDomain === cat.id;
                const count = domainCounts[cat.name] || cat.count || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedDomain(cat.id); setPage(1); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isSelected ? '#781416' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#4B5563',
                      fontWeight: isSelected ? 800 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {getCategoryIcon(cat.icon)}
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '155px' }}>
                        {cat.name}
                      </span>
                    </div>
                    <span style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.22)' : '#F3F4F6',
                      color: isSelected ? '#FFFFFF' : '#6B7280',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 2: CENTER MAIN CONTENT (Featured + Latest)       */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 4A. FEATURED OPPORTUNITIES (3-Card Horizontal Grid) */}
            {selectedDomain === 'all' && !debouncedSearch && featuredOpportunities.length > 0 && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔥</span>
                    <h2 style={{ margin: 0, fontSize: '1.28rem', fontWeight: 800, color: '#1C1E21' }}>
                      Featured Opportunities
                    </h2>
                  </div>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#65676B' }}>
                    Handpicked internships and jobs from verified sources.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.15rem'
                }}>
                  {featuredOpportunities.map(opp => {
                    const isBookmarked = bookmarkedIds.includes(opp.id);
                    const isInternship = (opp.type || '').toLowerCase() === 'internship';
                    return (
                      <div
                        key={opp.id}
                        onClick={() => onNavigate && onNavigate(`internships-jobs:${opp.slug || opp.id}`)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '20px',
                          border: '1.5px solid #E8E2D5',
                          padding: '1.25rem',
                          boxShadow: '0 6px 18px rgba(35, 30, 25, 0.05)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 12px 28px rgba(35, 30, 25, 0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 6px 18px rgba(35, 30, 25, 0.05)';
                        }}
                      >
                        {/* Top: Logo & Type Badge */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                            {renderCompanyAvatar(opp, 44)}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{
                                backgroundColor: isInternship ? '#ECFDF5' : '#EFF6FF',
                                color: isInternship ? '#059669' : '#2563EB',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '0.2rem 0.65rem',
                                borderRadius: '9999px',
                                border: isInternship ? '1px solid #A7F3D0' : '1px solid #BFDBFE'
                              }}>
                                {opp.type}
                              </span>
                              <button
                                onClick={(e) => handleToggleBookmark(opp.id, e)}
                                title={isBookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
                                style={{
                                  background: '#F9FAFB',
                                  border: '1px solid #E5E7EB',
                                  borderRadius: '50%',
                                  width: '30px',
                                  height: '30px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: isBookmarked ? '#C88D2D' : '#9CA3AF'
                                }}
                              >
                                <Bookmark size={14} fill={isBookmarked ? '#C88D2D' : 'none'} />
                              </button>
                            </div>
                          </div>

                          {/* Title & Company */}
                          <h3 style={{
                            margin: '0 0 0.3rem',
                            fontSize: '1.02rem',
                            fontWeight: 800,
                            color: '#1C1E21',
                            lineHeight: 1.3
                          }}>
                            {opp.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem', color: '#65676B', marginBottom: '0.75rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                              <Building2 size={13} color="#781416" /> {opp.companyName}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={13} /> {opp.location}
                            </span>
                          </div>

                          {/* Skill Tags */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                            {(opp.skills || []).slice(0, 3).map((sk, sIdx) => (
                              <span key={sIdx} style={{
                                backgroundColor: '#F3EFE6',
                                color: '#5B4000',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '6px'
                              }}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom: Deadline & Red Circular Action Button */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid #F0ECE4'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', color: '#65676B' }}>
                            <Calendar size={13} />
                            <span>
                              {opp.deadline && opp.deadline !== 'Deadline not specified'
                                ? `Apply by: ${opp.deadline}`
                                : 'Open Applications'}
                            </span>
                          </div>

                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#781416',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(120, 20, 22, 0.3)'
                          }}>
                            <ArrowRight size={15} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4B. LATEST OPPORTUNITIES (List Layout Rows) */}
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>📄</span>
                  <h2 style={{ margin: 0, fontSize: '1.28rem', fontWeight: 800, color: '#1C1E21' }}>
                    Latest Opportunities
                  </h2>
                </div>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#65676B' }}>
                  Explore the latest internships and job openings from verified companies.
                </p>
              </div>

              {loading ? (
                <div style={{
                  padding: '3rem 1rem',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E8E2D5',
                  color: '#65676B'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    border: '3px solid #E8E2D5',
                    borderTopColor: '#781416',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 1rem'
                  }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Loading verified opportunities...</span>
                </div>
              ) : opportunities.length === 0 ? (
                /* Empty State */
                <div style={{
                  padding: '3.5rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #E8E2D5'
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF9EE',
                    color: '#C88D2D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <Search size={26} />
                  </div>
                  <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21' }}>
                    No opportunities found
                  </h3>
                  <p style={{ margin: '0 0 1.25rem', fontSize: '0.88rem', color: '#65676B' }}>
                    We could not find any active listings matching your current filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDomain('all');
                      setSelectedType('all');
                      setSelectedLocation('all');
                      setSelectedCourse('all');
                      setSelectedWorkMode('all');
                      setPage(1);
                    }}
                    style={{
                      padding: '0.6rem 1.4rem',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                /* List of Opportunities Rows */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {opportunities.map(opp => {
                    const isBookmarked = bookmarkedIds.includes(opp.id);
                    const isInternship = (opp.type || '').toLowerCase() === 'internship';
                    const trackingRecord = trackedApplications.find(t => t.opportunityId === opp.id);
                    return (
                      <div
                        key={opp.id}
                        onClick={() => onNavigate && onNavigate(`internships-jobs:${opp.slug || opp.id}`)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '18px',
                          border: '1.5px solid #E8E2D5',
                          padding: '1rem 1.25rem',
                          boxShadow: '0 2px 8px rgba(35, 30, 25, 0.03)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#C88D2D';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(35, 30, 25, 0.06)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#E8E2D5';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(35, 30, 25, 0.03)';
                        }}
                      >
                        {/* Left: Logo & Job Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 380px' }}>
                          {renderCompanyAvatar(opp, 44)}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#1C1E21' }}>
                                {opp.title}
                              </h4>
                              {trackingRecord && (
                                <span style={{
                                  backgroundColor: '#EFF6FF',
                                  color: '#2563EB',
                                  fontSize: '0.65rem',
                                  fontWeight: 800,
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '9999px',
                                  border: '1px solid #BFDBFE'
                                }}>
                                  {trackingRecord.status}
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: '#65676B' }}>
                              <span style={{ fontWeight: 600, color: '#374151' }}>{opp.companyName}</span>
                              <span>•</span>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                <MapPin size={12} /> {opp.location}
                              </span>
                              {opp.workMode && (
                                <>
                                  <span>•</span>
                                  <span>{opp.workMode}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Middle: Badges (Type + Domain/Skill pills) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }} className="desktop-job-badges">
                          <span style={{
                            backgroundColor: isInternship ? '#ECFDF5' : '#EFF6FF',
                            color: isInternship ? '#059669' : '#2563EB',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            border: isInternship ? '1px solid #A7F3D0' : '1px solid #BFDBFE'
                          }}>
                            {opp.type}
                          </span>

                          <span style={{
                            backgroundColor: '#F3EFE6',
                            color: '#5B4000',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '8px'
                          }}>
                            {opp.domain}
                          </span>

                          {(opp.skills || []).slice(0, 1).map((s, idx) => (
                            <span key={idx} style={{
                              backgroundColor: '#F3F4F6',
                              color: '#374151',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '8px'
                            }}>
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Right: Apply By & Arrow Action */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '0.72rem', color: '#6B7280' }}>
                              Apply by:
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1C1E21' }}>
                              {opp.deadline && opp.deadline !== 'Deadline not specified' ? opp.deadline : 'Rolling'}
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleToggleBookmark(opp.id, e)}
                            title={isBookmarked ? 'Saved' : 'Save'}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: isBookmarked ? '#C88D2D' : '#9CA3AF',
                              padding: '4px'
                            }}
                          >
                            <Bookmark size={16} fill={isBookmarked ? '#C88D2D' : 'none'} />
                          </button>

                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#781416',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 3px 8px rgba(120, 20, 22, 0.25)'
                          }}>
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem'
                }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      opacity: page <= 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: '0.84rem', color: '#65676B', padding: '0 0.5rem' }}>
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                      opacity: page >= totalPages ? 0.5 : 1
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 3: RIGHT SIDEBAR (Why Choose, Resources, Post CTA) */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            
            {/* Card 1: Why Choose Internships & Jobs? */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.35rem',
              boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF2F2',
                  color: '#781416',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Target size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#1C1E21' }}>
                  Why Choose Internships & Jobs?
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  'Gain real-world experience',
                  'Build your professional network',
                  'Enhance your resume',
                  'Learn from industry experts',
                  'Kickstart your dream career'
                ].map((pt, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#374151' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#FEF2F2',
                      color: '#781416',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Career Resources */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.35rem',
              boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF9EE',
                  color: '#C88D2D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#1C1E21' }}>
                  Career Resources
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {careerResourcesData.map(res => (
                  <button
                    key={res.id}
                    onClick={() => setActiveResource(res)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FDFBF7'; e.currentTarget.style.color = '#781416'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                  >
                    <span>{res.title}</span>
                    <ChevronRight size={14} color="#C88D2D" />
                  </button>
                ))}
              </div>
            </div>

            {/* Card 3: Post a Job / Internship CTA (Matching Screenshot Warm Card) */}
            <div style={{
              backgroundColor: '#FEF9EE',
              borderRadius: '20px',
              border: '1.5px solid #F6E2B3',
              padding: '1.5rem 1.35rem',
              boxShadow: '0 6px 18px rgba(200, 141, 45, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FDF3DB',
                  color: '#C88D2D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Briefcase size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1C1E21' }}>
                  Post a Job / Internship
                </h3>
              </div>

              <p style={{ margin: 0, fontSize: '0.82rem', color: '#5B4000', lineHeight: 1.5 }}>
                Are you a company or recruiter? Post your opportunity and reach thousands of talented students.
              </p>

              <button
                onClick={() => setEmployerModalOpen(true)}
                style={{
                  width: '100%',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.7rem 1.25rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.28)',
                  transition: 'opacity 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <span>Post Opportunity</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Career Resource Guide Modal */}
      {activeResource && (
        <CareerResourceModal
          resource={activeResource}
          onClose={() => setActiveResource(null)}
        />
      )}

      {/* 2. Employer Submission Modal */}
      <EmployerSubmitModal
        isOpen={employerModalOpen}
        onClose={() => setEmployerModalOpen(false)}
        onSubmitted={() => {
          fetchOpportunities();
          fetchCategories();
        }}
      />

      {/* 3. Application Tracker Modal */}
      {trackingModalOpp && (
        <ApplicationTrackModal
          opportunity={trackingModalOpp}
          currentTracking={trackedApplications.find(t => t.opportunityId === trackingModalOpp.id)}
          onClose={() => setTrackingModalOpp(null)}
          onTrackUpdated={() => fetchUserEngagement()}
        />
      )}
    </div>
  );
}
