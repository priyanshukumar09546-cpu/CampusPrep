import React, { useState, useMemo } from 'react';
import {
  Link2,
  Search,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  LayoutGrid,
  X,
  Copy,
  Check,
  Globe,
  FileText,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { LINK_CATEGORIES, IMPORTANT_LINKS_DATA } from '../data/importantLinksData';

export default function ImportantLinksPage({ onNavigate, onOpenAuth }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleCopyLink = (e, url) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Filter links based on Category and Search Query
  const filteredLinks = useMemo(() => {
    let result = IMPORTANT_LINKS_DATA;

    // Filter by Category
    if (selectedCategoryId !== 'all') {
      result = result.filter((item) => item.category === selectedCategoryId);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.domain.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          item.tag?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategoryId, searchQuery]);

  // Group filtered links by Category to render category cards
  const groupedCategories = useMemo(() => {
    const map = new Map();

    filteredLinks.forEach((link) => {
      if (!map.has(link.category)) {
        map.set(link.category, {
          category: link.category,
          categoryName: link.categoryName,
          categoryDesc: link.categoryDesc,
          categoryIcon: link.categoryIcon,
          links: []
        });
      }
      map.get(link.category).links.push(link);
    });

    return Array.from(map.values());
  }, [filteredLinks]);

  // Dynamic Category Icon Resolver
  const renderCategoryIcon = (iconName, size = 18, color = '#781416') => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap size={size} color={color} />;
      case 'Building2':
        return <Building2 size={size} color={color} />;
      case 'Award':
        return <Award size={size} color={color} />;
      case 'BookOpen':
        return <BookOpen size={size} color={color} />;
      case 'Briefcase':
        return <Briefcase size={size} color={color} />;
      case 'IndianRupee':
        return <IndianRupee size={size} color={color} />;
      case 'ShieldCheck':
        return <ShieldCheck size={size} color={color} />;
      case 'LayoutGrid':
        return <LayoutGrid size={size} color={color} />;
      default:
        return <Layers size={size} color={color} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', paddingBottom: '5rem', color: '#1F2421' }}>
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E2D5', padding: '1.75rem 1.5rem 1.25rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          {/* Breadcrumb navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.75rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => (onNavigate ? onNavigate('home') : (window.location.href = '/'))}>
              Home
            </span>
            <span>/</span>
            <span style={{ cursor: 'pointer' }} onClick={() => (onNavigate ? onNavigate('more') : (window.location.href = '/more'))}>
              More
            </span>
            <span>/</span>
            <span style={{ color: '#781416', fontWeight: 600 }}>Important Links</span>
          </div>

          {/* Title Row & Inspirational Quote */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#781416',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(120,20,22,0.2)'
                }}
              >
                <Link2 size={26} color="#FFFFFF" />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#1F2421', margin: 0, lineHeight: 1.2 }}>
                  Important Links
                </h1>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.92rem', color: '#6B7280' }}>
                  All useful and official links at one place for your academic, competitive exams, career and college life.
                </p>
              </div>
            </div>

            {/* Inspirational Quote Card */}
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                maxWidth: '420px'
              }}
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#781416', lineHeight: 1, marginTop: '-4px' }}>
                “
              </span>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#781416', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.35 }}>
                The right link saves time and takes you one step ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <section style={{ maxWidth: '1360px', margin: '1.25rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1rem 1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
          {/* Search Input Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#F8F9FA',
              border: '1.5px solid #E5E7EB',
              borderRadius: '10px',
              padding: '0.6rem 0.85rem',
              marginBottom: '1rem',
              transition: 'border-color 0.2s ease'
            }}
          >
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search links, official portals, exams (e.g. UPSC, AKTU, DigiLocker, GATE, Scholarship, Aadhaar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '0.9rem',
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

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {LINK_CATEGORIES.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: isActive ? '1px solid #781416' : '1px solid #E5E7EB',
                    backgroundColor: isActive ? '#781416' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#4B5563',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  {renderCategoryIcon(cat.icon, 13, isActive ? '#FFFFFF' : '#6B7280')}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. COPIED TOAST NOTIFICATION */}
      {copiedUrl && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: '#1F2421',
            color: '#FFFFFF',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
            zIndex: 100
          }}
        >
          <Check size={16} color="#10B981" />
          <span>Official link copied to clipboard!</span>
        </div>
      )}

      {/* 4. MAIN CATEGORY CARDS GRID (MATCHING REFERENCE IMAGE 2) */}
      <section style={{ maxWidth: '1360px', margin: '1.5rem auto 0', padding: '0 1.5rem' }}>
        {groupedCategories.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px dashed #D1D5DB',
              padding: '3.5rem 1.5rem',
              textAlign: 'center'
            }}
          >
            <Globe size={40} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#1F2421', margin: '0 0 0.5rem' }}>
              No matching links found
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: '0 0 1.25rem' }}>
              No official portals matched your query "<strong>{searchQuery}</strong>". Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
              }}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {groupedCategories.map((group) => (
              <div
                key={group.category}
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
                {/* Category Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#FEF2F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {renderCategoryIcon(group.categoryIcon, 18, '#781416')}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1F2421' }}>
                      {group.categoryName}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                      {group.categoryDesc}
                    </span>
                  </div>
                </div>

                {/* List of Links in this Category */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  {group.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${link.title} (${link.domain})`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '10px',
                        border: '1px solid #F3F4F6',
                        backgroundColor: '#F9FAFB',
                        textDecoration: 'none',
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
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1F2421', lineHeight: 1.25 }}>
                            {link.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 600, marginTop: '2px', fontFamily: 'monospace' }}>
                          {link.domain}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={(e) => handleCopyLink(e, link.url)}
                          title="Copy Link URL"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#9CA3AF',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Copy size={13} />
                        </button>
                        <ChevronRight size={14} color="#9CA3AF" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. VERIFICATION & ACCREDITATION NOTE FOOTER */}
      <section style={{ maxWidth: '1360px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldCheck size={20} color="#059669" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                100% Verified Official &amp; Government Portals
              </div>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                All links redirect directly to official state, university, exam authority, and central government websites.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate ? onNavigate('competitive-exams') : (window.location.href = '/competitive-exams')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#781416',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Explore Career &amp; Competitive Exam Guidance</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
