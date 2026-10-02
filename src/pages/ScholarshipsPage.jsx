// src/pages/ScholarshipsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap, Search, Filter, MapPin, Building2, Calendar, ArrowRight,
  Bookmark, CheckCircle2, ChevronRight, Sparkles, Star, FileText,
  Clock, ShieldCheck, ExternalLink, Share2, Layers, Award,
  Landmark, DollarSign, Users, BookOpen, RefreshCw, Check, ArrowUpRight,
  ChevronDown, HeartHandshake, HelpCircle, AlertCircle
} from 'lucide-react';
import ScholarshipResourceModal from '../components/ScholarshipResourceModal';
import ScholarshipSubmitModal from '../components/ScholarshipSubmitModal';
import ScholarshipTrackModal from '../components/ScholarshipTrackModal';
import ProviderLogo from '../components/ProviderLogo';
import { scholarshipResourcesData } from '../data/scholarshipResourcesData';

export default function ScholarshipsPage({ onNavigate, onOpenAuth }) {
  const [scholarships, setScholarships] = useState([]);
  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({ all: 0 });
  const [courseCounts, setCourseCounts] = useState({ 'B.Tech': 0, 'MCA': 0, 'MBA': 0, 'B.Pharm': 0, 'Other Courses': 0 });
  const [stats, setStats] = useState({ total: 0, government: 0, private: 0, international: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // User engagement
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [trackedApplications, setTrackedApplications] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Modals state
  const [activeResource, setActiveResource] = useState(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [trackingModalItem, setTrackingModalItem] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Scholarships from Backend API
  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedCourse && selectedCourse !== 'all') params.append('course', selectedCourse);
      if (selectedType && selectedType !== 'all') params.append('type', selectedType);
      if (selectedYear && selectedYear !== 'all') params.append('eligibleYear', selectedYear);
      if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation);
      if (sortBy) params.append('sort', sortBy);
      params.append('page', page);
      params.append('limit', '15');

      const res = await fetch(`/api/scholarships?${params.toString()}`);
      if (!res.ok) {
        console.error('Scholarship API error:', res.status);
        return;
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.error('Backend not responding with JSON — server may not be running');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setScholarships(data.scholarships || []);
        if (data.featuredScholarships && data.featuredScholarships.length > 0) {
          setFeaturedScholarships(data.featuredScholarships);
        }
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.categoryCounts) setCategoryCounts(data.categoryCounts);
        if (data.courseCounts) setCourseCounts(data.courseCounts);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories Metadata
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/scholarships/categories');
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
        fetch('/api/scholarships/user/bookmarks').then(safeJson).catch(() => ({})),
        fetch('/api/scholarships/user/applications').then(safeJson).catch(() => ({}))
      ]);
      if (bmRes.success) setBookmarkedIds(bmRes.bookmarkedIds || []);
      if (trackRes.success) setTrackedApplications(trackRes.applications || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchScholarships();
  }, [debouncedSearch, selectedCategory, selectedCourse, selectedType, selectedYear, selectedLocation, sortBy, page]);

  useEffect(() => {
    fetchCategories();
    fetchUserEngagement();
  }, []);

  // Handle Bookmark Toggle
  const handleToggleBookmark = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/scholarships/${id}/bookmark`, { method: 'POST' });
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
  const handleShare = (sch, e) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/scholarships/${sch.slug || sch.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(sch.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // 14 Categories List with fallback icons
  const defaultCategories = [
    { id: 'all', name: 'All Scholarships', icon: Layers },
    { id: 'government-scholarships', name: 'Government Scholarships', icon: Landmark },
    { id: 'private-scholarships', name: 'Private Scholarships', icon: Building2 },
    { id: 'merit-based', name: 'Merit Based', icon: Award },
    { id: 'need-based', name: 'Need Based', icon: HeartHandshake },
    { id: 'international-scholarships', name: 'International Scholarships', icon: Sparkles },
    { id: 'state-scholarships', name: 'State Scholarships', icon: MapPin },
    { id: 'minority-scholarships', name: 'Minority Scholarships', icon: Users },
    { id: 'sc-st-obc-scholarships', name: 'SC/ST/OBC Scholarships', icon: ShieldCheck },
    { id: 'women-scholarships', name: 'Women Scholarships', icon: Star },
    { id: 'pwd-scholarships', name: 'PwD Scholarships', icon: CheckCircle2 },
    { id: 'research-scholarships', name: 'Research Scholarships', icon: BookOpen },
    { id: 'sports-scholarships', name: 'Sports Scholarships', icon: Award },
    { id: 'other-scholarships', name: 'Other Scholarships', icon: GraduationCap }
  ];

  const coursesList = ['B.Tech', 'MCA', 'MBA', 'B.Pharm', 'Other Courses'];

  const getCategoryCount = (catId, catName) => {
    if (catId === 'all') return categoryCounts.all || totalCount || 0;
    return categoryCounts[catName] || categoryCounts[catId] || 0;
  };

  const getCourseCount = (courseName) => {
    return courseCounts[courseName] || 0;
  };

  const hasActiveFilters = debouncedSearch || selectedCategory !== 'all' || selectedCourse !== 'all' || selectedType !== 'all' || selectedYear !== 'all' || selectedLocation !== 'all' || sortBy !== 'latest';

  const resetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory('all');
    setSelectedCourse('all');
    setSelectedType('all');
    setSelectedYear('all');
    setSelectedLocation('all');
    setSortBy('latest');
    setPage(1);
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1C1E21', paddingBottom: '4rem' }}>
      
      {/* 1. BREADCRUMBS */}
      <div className="container" style={{ padding: '1.25rem 1.5rem 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#65676B', fontWeight: 600 }}>
          <button
            onClick={() => onNavigate ? onNavigate('home') : window.location.href = '/'}
            style={{ background: 'none', border: 'none', color: '#65676B', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            Home
          </button>
          <ChevronRight size={14} />
          <button
            onClick={() => onNavigate ? onNavigate('more') : window.location.href = '/more'}
            style={{ background: 'none', border: 'none', color: '#65676B', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            More
          </button>
          <ChevronRight size={14} />
          <span style={{ color: '#1C1E21', fontWeight: 800 }}>Scholarships</span>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <div className="container" style={{ margin: '0.75rem auto 1.5rem' }}>
        <div style={{
          backgroundColor: '#FFFDF9',
          border: '1.5px solid #F1E7D0',
          borderRadius: '24px',
          padding: '2.5rem 2.75rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(138, 93, 0, 0.05)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem'
        }}>
          {/* Left Hero Content */}
          <div style={{ flex: 1, maxWidth: '780px', zIndex: 2 }}>
            {/* Cap Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              backgroundColor: '#FEF9EE',
              border: '1px solid #EEDBBE',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              color: '#8A5D00',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>
              <GraduationCap size={16} />
              <span>Verified Financial Aid & Fellowships</span>
            </div>

            <h1 style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#1C1E21',
              margin: '0 0 0.65rem',
              lineHeight: 1.15,
              letterSpacing: '-0.02em'
            }}>
              Scholarships
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#555A60',
              margin: '0 0 1.75rem',
              lineHeight: 1.55,
              maxWidth: '650px'
            }}>
              Find and apply for government, private, and international scholarships to fund your education.
            </p>

            {/* 5 Feature Highlight Pills / Cards */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              {[
                { title: 'Verified Scholarships', icon: ShieldCheck },
                { title: 'For All Courses', icon: BookOpen },
                { title: 'Government & Private', icon: Landmark },
                { title: 'Merit & Need Based', icon: Award },
                { title: 'Regular Updates', icon: RefreshCw }
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E2D5',
                      borderRadius: '9999px',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#2D3238',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <Icon size={14} color="#8A5D00" />
                    <span>{feat.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Mascot Illustration with Speech Bubble */}
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '280px',
            zIndex: 2
          }} className="hero-mascot-container">
            {/* Speech Bubble */}
            <div style={{
              position: 'relative',
              backgroundColor: '#FFFFFF',
              border: '2px solid #8A5D00',
              borderRadius: '16px',
              padding: '0.65rem 1rem',
              color: '#1C1E21',
              fontWeight: 800,
              fontSize: '0.84rem',
              textAlign: 'center',
              boxShadow: '0 6px 18px rgba(138, 93, 0, 0.12)',
              marginBottom: '0.75rem',
              maxWidth: '220px',
              lineHeight: 1.35
            }}>
              <span>“Education Today Opportunities Tomorrow!”</span>
              {/* Bubble pointer */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '8px solid #8A5D00'
              }} />
            </div>

            {/* Mascot Image */}
            <div style={{
              width: '150px',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <img
                src="/assets/professor_virus_standing.png"
                alt="ProfessorVirus Mascot"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/navbar_logo.png';
                }}
              />
              {/* Trophy badge overlay */}
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '12px',
                backgroundColor: '#FEF9EE',
                border: '2px solid #C88D2D',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                <Award size={18} color="#C88D2D" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FILTER & SEARCH BAR */}
      <div className="container" style={{ margin: '0 auto 1.75rem' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E8E2D5',
          borderRadius: '18px',
          padding: '1.15rem 1.25rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {/* Top Row: Search input + Course + Type + Year + Location + Sort */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 2fr) repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.65rem',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search scholarships by name, provider, or category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem 0.65rem 2.4rem',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  boxSizing: 'border-box'
                }}
              />
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Course Filter Dropdown */}
            <select
              value={selectedCourse}
              onChange={e => { setSelectedCourse(e.target.value); setPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="B.Pharm">B.Pharm</option>
              <option value="Other Courses">Other Courses</option>
            </select>

            {/* Type Filter Dropdown */}
            <select
              value={selectedType}
              onChange={e => { setSelectedType(e.target.value); setPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Types</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="International">International</option>
            </select>

            {/* Year Filter Dropdown */}
            <select
              value={selectedYear}
              onChange={e => { setSelectedYear(e.target.value); setPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Eligible Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>

            {/* Location Filter Dropdown */}
            <select
              value={selectedLocation}
              onChange={e => { setSelectedLocation(e.target.value); setPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Locations</option>
              <option value="All India">All India</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="International">International</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="latest">Sort: Latest</option>
              <option value="deadline">Sort: Deadline</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="amount">Sort: High Amount</option>
            </select>
          </div>

          {/* Active Filter Chips & Reset */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Active Filters:</span>
                {debouncedSearch && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#FEF9EE', color: '#8A5D00', padding: '0.15rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                    Search: "{debouncedSearch}"
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#FEF2F2', color: '#781416', padding: '0.15rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedCourse !== 'all' && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.15rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                    Course: {selectedCourse}
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#F0FDF4', color: '#15803D', padding: '0.15rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                    Type: {selectedType}
                  </span>
                )}
                {selectedYear !== 'all' && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#FAF5FF', color: '#7E22CE', padding: '0.15rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                    Year: {selectedYear}
                  </span>
                )}
                {selectedLocation !== 'all' && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#FFFBEB', color: '#B45309', padding: '0.15rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                    Location: {selectedLocation}
                  </span>
                )}
              </div>
              <button
                onClick={resetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.2rem 0.5rem'
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. MASTER 3-COLUMN CONTENT LAYOUT */}
      <div className="container" style={{ margin: '0 auto' }}>
        <div className="scholarships-3col-layout">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Categories + Filter by Course */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Card 1: Scholarship Categories */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1C1E21',
                paddingBottom: '0.85rem',
                marginBottom: '0.85rem',
                borderBottom: '1.5px solid #F1E7D0'
              }}>
                <Layers size={18} color="#8A5D00" />
                <span>Scholarship Categories</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {defaultCategories.map(cat => {
                  const isSelected = selectedCategory === cat.id || selectedCategory === cat.name;
                  const Icon = cat.icon;
                  const count = getCategoryCount(cat.id, cat.name);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setPage(1);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: isSelected ? '#FEF9EE' : 'transparent',
                        color: isSelected ? '#8A5D00' : '#4B5563',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.color = '#1E293B';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#4B5563';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <Icon size={15} color={isSelected ? '#8A5D00' : '#94A3B8'} />
                        <span style={{ lineHeight: 1.25 }}>{cat.name}</span>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? '#8A5D00' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#64748B'
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Filter by Course */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1C1E21',
                paddingBottom: '0.85rem',
                marginBottom: '0.85rem',
                borderBottom: '1.5px solid #F1E7D0'
              }}>
                <GraduationCap size={18} color="#8A5D00" />
                <span>Filter by Course</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button
                  onClick={() => { setSelectedCourse('all'); setPage(1); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: selectedCourse === 'all' ? '#FEF9EE' : 'transparent',
                    color: selectedCourse === 'all' ? '#8A5D00' : '#4B5563',
                    fontWeight: selectedCourse === 'all' ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>All Courses</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    backgroundColor: selectedCourse === 'all' ? '#8A5D00' : '#F1F5F9',
                    color: selectedCourse === 'all' ? '#FFFFFF' : '#64748B'
                  }}>
                    {totalCount}
                  </span>
                </button>

                {coursesList.map(course => {
                  const isSelected = selectedCourse === course;
                  const count = getCourseCount(course);

                  return (
                    <button
                      key={course}
                      onClick={() => {
                        setSelectedCourse(isSelected ? 'all' : course);
                        setPage(1);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isSelected ? '#FEF9EE' : 'transparent',
                        color: isSelected ? '#8A5D00' : '#4B5563',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.color = '#1E293B';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#4B5563';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: isSelected ? '2px solid #8A5D00' : '1.5px solid #CBD5E1',
                          backgroundColor: isSelected ? '#8A5D00' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}>
                          {isSelected && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span>{course}</span>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? '#8A5D00' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#64748B'
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* CENTER COLUMN: Featured Grid + Latest List */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* FEATURED SCHOLARSHIPS SECTION */}
            {(!hasActiveFilters || selectedCategory === 'all') && featuredScholarships.length > 0 && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#FEF9EE',
                      border: '1px solid #F1E7D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C88D2D'
                    }}>
                      <Star size={16} fill="#C88D2D" />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21' }}>
                        Featured Scholarships
                      </h2>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#65676B' }}>
                        High-value verified national & corporate grants
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: '#8A5D00', fontWeight: 700 }}>
                    {featuredScholarships.length} Top Grants
                  </span>
                </div>

                {/* 3-Card Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: '1rem'
                }}>
                  {featuredScholarships.map(sch => {
                    const isBookmarked = bookmarkedIds.includes(sch.id);

                    return (
                      <div
                        key={sch.id}
                        onClick={() => onNavigate ? onNavigate(`scholarships:${sch.slug || sch.id}`) : window.location.href = `/scholarships/${sch.slug || sch.id}`}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid #F1E7D0',
                          borderRadius: '18px',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 4px 14px rgba(138, 93, 0, 0.04)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(138, 93, 0, 0.08)';
                          e.currentTarget.style.borderColor = '#C88D2D';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(138, 93, 0, 0.04)';
                          e.currentTarget.style.borderColor = '#F1E7D0';
                        }}
                      >
                        <div>
                          {/* Top Row: Provider Logo + Provider Name + Bookmark */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.65rem', marginBottom: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
                              <ProviderLogo logoUrl={sch.providerLogo} providerName={sch.providerName} size={40} borderRadius={10} />
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {sch.providerName}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: '9999px',
                                    backgroundColor: sch.type === 'Government' ? '#EFF6FF' : sch.type === 'International' ? '#FAF5FF' : '#FEF9EE',
                                    color: sch.type === 'Government' ? '#1D4ED8' : sch.type === 'International' ? '#7E22CE' : '#8A5D00'
                                  }}>
                                    {sch.type}
                                  </span>
                                  {sch.verified && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#059669', fontSize: '0.68rem', fontWeight: 800 }}>
                                      <ShieldCheck size={11} color="#059669" /> Verified
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleToggleBookmark(sch.id, e)}
                              aria-label="Bookmark"
                              style={{
                                background: isBookmarked ? '#FEF2F2' : '#F8FAFC',
                                border: isBookmarked ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: isBookmarked ? '#DC2626' : '#64748B',
                                flexShrink: 0
                              }}
                            >
                              <Bookmark size={14} fill={isBookmarked ? '#DC2626' : 'none'} />
                            </button>
                          </div>

                          {/* Title */}
                          <h3 style={{
                            margin: '0 0 0.4rem',
                            fontSize: '0.98rem',
                            fontWeight: 800,
                            color: '#1C1E21',
                            lineHeight: 1.35,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {sch.title}
                          </h3>

                          {/* Amount Highlight */}
                          <div style={{
                            backgroundColor: '#FEF9EE',
                            border: '1px solid #F6E2B3',
                            borderRadius: '10px',
                            padding: '0.55rem 0.75rem',
                            marginBottom: '0.75rem'
                          }}>
                            <div style={{ fontSize: '0.68rem', color: '#8A5D00', fontWeight: 800, textTransform: 'uppercase' }}>
                              SCHOLARSHIP GRANT
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#8A5D00', marginTop: '0.1rem' }}>
                              {sch.amount}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Deadline & CTA */}
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.75rem',
                            color: '#64748B',
                            fontWeight: 600,
                            marginBottom: '0.85rem'
                          }}>
                            <Clock size={13} color="#94A3B8" />
                            <span>Deadline: <strong style={{ color: '#1E293B' }}>{sch.deadline}</strong></span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onNavigate) onNavigate(`scholarships:${sch.slug || sch.id}`);
                              else window.location.href = `/scholarships/${sch.slug || sch.id}`;
                            }}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              borderRadius: '10px',
                              border: 'none',
                              backgroundColor: '#781416',
                              color: '#FFFFFF',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <span>View Details</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LATEST SCHOLARSHIPS SECTION */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#781416'
                  }}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21' }}>
                      Latest Scholarships
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#65676B' }}>
                      Showing {totalCount} verified scholarship opportunities
                    </p>
                  </div>
                </div>

                {loading && (
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <RefreshCw size={13} className="animate-spin" /> Updating...
                  </span>
                )}
              </div>

              {/* LIST VIEW */}
              {loading && scholarships.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1.5px solid #E8E2D5' }}>
                  <RefreshCw size={28} className="animate-spin" style={{ color: '#8A5D00', margin: '0 auto 1rem' }} />
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
                    Loading verified scholarships...
                  </div>
                </div>
              ) : scholarships.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E8E2D5'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF9EE',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8A5D00',
                    marginBottom: '1rem'
                  }}>
                    <GraduationCap size={28} />
                  </div>
                  <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21' }}>
                    No scholarships match your filters
                  </h3>
                  <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#64748B' }}>
                    Try broadening your search or resetting category and course selections.
                  </p>
                  <button
                    onClick={resetFilters}
                    style={{
                      padding: '0.55rem 1.25rem',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {scholarships.map(sch => {
                    const isBookmarked = bookmarkedIds.includes(sch.id);
                    const tracked = trackedApplications.find(a => a.scholarshipId === sch.id);

                    return (
                      <div
                        key={sch.id}
                        onClick={() => onNavigate ? onNavigate(`scholarships:${sch.slug || sch.id}`) : window.location.href = `/scholarships/${sch.slug || sch.id}`}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid #E8E2D5',
                          borderRadius: '18px',
                          padding: '1.35rem',
                          boxShadow: '0 3px 10px rgba(0,0,0,0.02)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#C88D2D';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(200, 141, 45, 0.08)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#E8E2D5';
                          e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.02)';
                        }}
                      >
                        {/* Row 1: Provider Logo + Provider Name & Badges + Actions */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                            <ProviderLogo logoUrl={sch.providerLogo} providerName={sch.providerName} size={48} borderRadius={12} />
                            
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                                <strong style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 800 }}>
                                  {sch.providerName}
                                </strong>
                                {sch.verified && (
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    backgroundColor: '#ECFDF5',
                                    border: '1px solid #A7F3D0',
                                    color: '#065F46',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    padding: '0.12rem 0.5rem',
                                    borderRadius: '9999px'
                                  }}>
                                    <ShieldCheck size={12} color="#059669" />
                                    <span>Verified Official</span>
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '9999px',
                                  backgroundColor: sch.type === 'Government' ? '#EFF6FF' : sch.type === 'International' ? '#FAF5FF' : '#FEF9EE',
                                  color: sch.type === 'Government' ? '#1D4ED8' : sch.type === 'International' ? '#7E22CE' : '#8A5D00'
                                }}>
                                  {sch.type}
                                </span>

                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 600,
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '9999px',
                                  backgroundColor: '#F1F5F9',
                                  color: '#475569'
                                }}>
                                  {sch.category}
                                </span>

                                {tracked && (
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: '9999px',
                                    backgroundColor: '#EFF6FF',
                                    color: '#1D4ED8',
                                    border: '1px solid #BFDBFE'
                                  }}>
                                    📌 Status: {tracked.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bookmark & Share Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                            <button
                              onClick={(e) => handleShare(sch, e)}
                              title="Share Scholarship"
                              style={{
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: copiedId === sch.id ? '#059669' : '#64748B'
                              }}
                            >
                              {copiedId === sch.id ? <Check size={14} /> : <Share2 size={14} />}
                            </button>

                            <button
                              onClick={(e) => handleToggleBookmark(sch.id, e)}
                              title="Bookmark Scholarship"
                              style={{
                                background: isBookmarked ? '#FEF2F2' : '#F8FAFC',
                                border: isBookmarked ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: isBookmarked ? '#DC2626' : '#64748B'
                              }}
                            >
                              <Bookmark size={14} fill={isBookmarked ? '#DC2626' : 'none'} />
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Scholarship Name */}
                        <div>
                          <h3 style={{
                            margin: '0 0 0.25rem',
                            fontSize: '1.18rem',
                            fontWeight: 800,
                            color: '#1C1E21',
                            lineHeight: 1.3
                          }}>
                            {sch.title}
                          </h3>
                        </div>

                        {/* Row 3: Short Description */}
                        <p style={{
                          margin: 0,
                          fontSize: '0.86rem',
                          color: '#4B5563',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {sch.description}
                        </p>

                        {/* Row 4: Eligibility & Amount Highlight */}
                        <div style={{
                          backgroundColor: '#FBF9F5',
                          border: '1px solid #EFEAE0',
                          borderRadius: '12px',
                          padding: '0.75rem 0.95rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem'
                        }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
                                Grant Amount:
                              </span>
                              <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#8A5D00' }}>
                                {sch.scholarshipAmount || sch.amount}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748B' }}>
                              <MapPin size={13} color="#94A3B8" />
                              <span>{sch.location || 'All India'}</span>
                            </div>
                          </div>

                          {/* Eligibility Summary */}
                          {(sch.eligibility || sch.academicCriteria) && (
                            <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                              <strong style={{ color: '#781416' }}>Eligibility: </strong>
                              <span>{sch.eligibility || sch.academicCriteria}</span>
                            </div>
                          )}

                          {/* Eligible Courses Chips */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>Courses:</span>
                            {sch.eligibleCourses && sch.eligibleCourses.slice(0, 4).map((c, cIdx) => (
                              <span
                                key={cIdx}
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #E2E8F0',
                                  color: '#334155'
                                }}
                              >
                                {c}
                              </span>
                            ))}
                            {sch.eligibleCourses && sch.eligibleCourses.length > 4 && (
                              <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>
                                +{sch.eligibleCourses.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Row 5: Deadline & Action Buttons */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          paddingTop: '0.3rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.78rem',
                            color: '#64748B',
                            fontWeight: 600
                          }}>
                            <Clock size={14} color="#94A3B8" />
                            <span>Deadline: <strong style={{ color: '#1E293B' }}>{sch.deadline}</strong></span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrackingModalItem(sch);
                              }}
                              style={{
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                backgroundColor: '#FFFFFF',
                                color: '#334155',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {tracked ? 'Edit Tracker' : 'Track Status'}
                            </button>

                            {/* Official Application Portal Link */}
                            {sch.applicationUrl && (
                              <a
                                href={sch.applicationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  padding: '0.45rem 0.95rem',
                                  borderRadius: '8px',
                                  border: '1.5px solid #F1E7D0',
                                  backgroundColor: '#FEF9EE',
                                  color: '#8A5D00',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  cursor: 'pointer'
                                }}
                              >
                                <span>Apply Officially</span>
                                <ExternalLink size={13} color="#8A5D00" />
                              </a>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onNavigate) onNavigate(`scholarships:${sch.slug || sch.id}`);
                                else window.location.href = `/scholarships/${sch.slug || sch.id}`;
                              }}
                              style={{
                                padding: '0.45rem 1.1rem',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#781416',
                                color: '#FFFFFF',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <span>View Details</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 350, behavior: 'smooth' }); }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      opacity: page <= 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>

                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569', margin: '0 0.5rem' }}>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 350, behavior: 'smooth' }); }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 700,
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
          {/* RIGHT COLUMN: Stats + Why Apply + Helpful Resources + Suggest */}
          {/* ======================================================== */}
          <div className="scholarships-right-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Card 1: Scholarship Stats 2x2 Grid */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1C1E21',
                paddingBottom: '0.75rem',
                marginBottom: '0.85rem',
                borderBottom: '1.5px solid #F1E7D0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <Award size={18} color="#8A5D00" />
                <span>Scholarship Stats</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.65rem'
              }}>
                <div style={{ backgroundColor: '#FEF9EE', borderRadius: '12px', padding: '0.85rem', border: '1px solid #F6E2B3' }}>
                  <div style={{ fontSize: '0.7rem', color: '#8A5D00', fontWeight: 800, textTransform: 'uppercase' }}>
                    Total Available
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#8A5D00', marginTop: '0.2rem' }}>
                    {stats.total || totalCount}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8A5D00' }}>Active Grants</div>
                </div>

                <div style={{ backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '0.85rem', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontSize: '0.7rem', color: '#1D4ED8', fontWeight: 800, textTransform: 'uppercase' }}>
                    Government
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1D4ED8', marginTop: '0.2rem' }}>
                    {stats.government || 12}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#1D4ED8' }}>Central & State</div>
                </div>

                <div style={{ backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '0.85rem', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase' }}>
                    Private & Trusts
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#15803D', marginTop: '0.2rem' }}>
                    {stats.private || 9}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#15803D' }}>Foundations</div>
                </div>

                <div style={{ backgroundColor: '#FAF5FF', borderRadius: '12px', padding: '0.85rem', border: '1px solid #E9D5FF' }}>
                  <div style={{ fontSize: '0.7rem', color: '#7E22CE', fontWeight: 800, textTransform: 'uppercase' }}>
                    International
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7E22CE', marginTop: '0.2rem' }}>
                    {stats.international || 3}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#7E22CE' }}>Global Grants</div>
                </div>
              </div>
            </div>

            {/* Card 2: Why Apply for Scholarships? */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1C1E21',
                paddingBottom: '0.75rem',
                marginBottom: '0.85rem',
                borderBottom: '1.5px solid #F1E7D0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <Sparkles size={18} color="#8A5D00" />
                <span>Why Apply for Scholarships?</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { title: 'Zero Loan Burden', desc: 'Graduate 100% debt-free without the pressure of educational loan EMIs.' },
                  { title: 'Direct Benefit Transfer', desc: 'Disbursements are sent straight into your Aadhaar-linked bank account.' },
                  { title: 'Academic Distinction', desc: 'Scholarship awards add high prestige to your resume and masters applications.' },
                  { title: 'Living & Laptop Allowances', desc: 'Many schemes cover laptops, hostel allowances, and study materials.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.15rem'
                    }}>
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>{item.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Helpful Resources (6 Clickable Guides) */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1C1E21',
                paddingBottom: '0.75rem',
                marginBottom: '0.85rem',
                borderBottom: '1.5px solid #F1E7D0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <BookOpen size={18} color="#8A5D00" />
                <span>Helpful Resources</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {scholarshipResourcesData.map(res => (
                  <button
                    key={res.id}
                    onClick={() => setActiveResource(res)}
                    style={{
                      textAlign: 'left',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '10px',
                      border: '1px solid #F1F5F9',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#C88D2D';
                      e.currentTarget.style.backgroundColor = '#FEF9EE';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#F1F5F9';
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.3 }}>
                        {res.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.15rem' }}>
                        {res.readTime} • {res.category}
                      </div>
                    </div>
                    <ChevronRight size={14} color="#94A3B8" />
                  </button>
                ))}
              </div>
            </div>

            {/* Card 4: Suggest a Scholarship */}
            <div style={{
              backgroundColor: '#FFFDF9',
              border: '1.5px solid #F1E7D0',
              borderRadius: '20px',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(138, 93, 0, 0.04)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#FEF9EE',
                border: '1.5px solid #EEDBBE',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8A5D00',
                marginBottom: '0.75rem'
              }}>
                <GraduationCap size={24} />
              </div>

              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 800, color: '#1C1E21' }}>
                Suggest a Scholarship
              </h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.78rem', color: '#65676B', lineHeight: 1.45 }}>
                Know an authentic scholarship scheme or trust grant? Share it to support student peers.
              </p>

              <button
                onClick={() => setSubmitModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.25)'
                }}
              >
                Suggest Scholarship
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* MODALS */}
      {/* 1. Helpful Resource Guide Modal */}
      {activeResource && (
        <ScholarshipResourceModal
          resource={activeResource}
          allResources={scholarshipResourcesData}
          onClose={() => setActiveResource(null)}
          onOpenOtherResource={(r) => setActiveResource(r)}
        />
      )}

      {/* 2. Suggest a Scholarship Modal */}
      <ScholarshipSubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSubmitted={() => {
          fetchScholarships();
        }}
      />

      {/* 3. Track Status Modal */}
      {trackingModalItem && (
        <ScholarshipTrackModal
          scholarship={trackingModalItem}
          currentTracking={trackedApplications.find(a => a.scholarshipId === trackingModalItem.id)}
          onClose={() => setTrackingModalItem(null)}
          onTrackUpdated={() => {
            fetchUserEngagement();
          }}
        />
      )}

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 1024px) {
          .scholarships-3col-layout {
            grid-template-columns: 1fr !important;
          }
          .hero-mascot-container {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
