// src/pages/ScholarshipDetailPage.jsx
import React, { useState, useEffect } from 'react';
import {
  GraduationCap, MapPin, Building2, Calendar, ArrowLeft, ArrowUpRight,
  Bookmark, CheckCircle2, ShieldCheck, Share2, AlertCircle, Clock,
  Globe, DollarSign, Award, ChevronRight, UserCheck, Layers, ListChecks,
  ExternalLink, Check, Copy, HeartHandshake, Landmark, Sparkles, Star
} from 'lucide-react';
import ScholarshipTrackModal from '../components/ScholarshipTrackModal';
import ProviderLogo from '../components/ProviderLogo';

export default function ScholarshipDetailPage({ slug, onNavigate, onOpenAuth }) {
  const [scholarship, setScholarship] = useState(null);
  const [relatedScholarships, setRelatedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingRecord, setTrackingRecord] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedDocs, setCopiedDocs] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchDetail = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch(`/api/scholarships/${slug}`);
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) {
          setErrorMsg('Unable to connect to scholarship service. Please ensure the backend server is running.');
          return;
        }
        const data = await res.json();
        if (data.success && data.scholarship) {
          setScholarship(data.scholarship);
          setRelatedScholarships(data.relatedScholarships || []);
        } else {
          setErrorMsg(data.message || 'Scholarship not found or is no longer active.');
        }
      } catch (err) {
        setErrorMsg('Network error while retrieving scholarship details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  // Fetch bookmark status and user application tracking
  useEffect(() => {
    if (!scholarship) return;
    const fetchUserStatus = async () => {
      try {
        const [bmRes, trackRes] = await Promise.all([
          fetch('/api/scholarships/user/bookmarks').then(r => r.json()).catch(() => ({})),
          fetch('/api/scholarships/user/applications').then(r => r.json()).catch(() => ({}))
        ]);
        if (bmRes.success && Array.isArray(bmRes.bookmarkedIds)) {
          setIsBookmarked(bmRes.bookmarkedIds.includes(scholarship.id));
        }
        if (trackRes.success && Array.isArray(trackRes.applications)) {
          const rec = trackRes.applications.find(a => a.scholarshipId === scholarship.id);
          if (rec) setTrackingRecord(rec);
        }
      } catch (e) {}
    };
    fetchUserStatus();
  }, [scholarship]);

  const handleToggleBookmark = async () => {
    if (!scholarship) return;
    try {
      const res = await fetch(`/api/scholarships/${scholarship.id}/bookmark`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.isBookmarked);
      }
    } catch (e) {}
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyDocsList = () => {
    if (!scholarship || !scholarship.documentsRequired) return;
    const listText = scholarship.documentsRequired.map((d, i) => `${i + 1}. ${d}`).join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Documents Required for ${scholarship.title}:\n\n${listText}`);
      setCopiedDocs(true);
      setTimeout(() => setCopiedDocs(false), 2000);
    }
  };

  // Provider Logo / Emblem Helper
  const renderProviderLogo = (sch, size = 64) => {
    if (!sch) return null;
    return (
      <ProviderLogo
        logoUrl={sch.providerLogo}
        providerName={sch.providerName}
        size={size}
        borderRadius={16}
      />
    );
  };


  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '3px solid #EEDBBE',
            borderTopColor: '#8A5D00',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>
            Loading scholarship verification details...
          </div>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (errorMsg || !scholarship) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #E8E2D5' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#FEF2F2',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#DC2626',
          marginBottom: '1rem'
        }}>
          <AlertCircle size={28} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.5rem' }}>
          Scholarship Listing Unavailable
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#65676B', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
          {errorMsg || 'The scholarship could not be found or has concluded.'}
        </p>
        <button
          onClick={() => onNavigate ? onNavigate('scholarships') : window.location.href = '/scholarships'}
          style={{
            padding: '0.65rem 1.5rem',
            backgroundColor: '#781416',
            color: '#FFFFFF',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Return to Scholarships Board
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1C1E21', paddingBottom: '5rem' }}>
      
      {/* 1. BREADCRUMBS & BACK BUTTON */}
      <div className="container" style={{ padding: '1.25rem 1.5rem 0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
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
            <button
              onClick={() => onNavigate ? onNavigate('scholarships') : window.location.href = '/scholarships'}
              style={{ background: 'none', border: 'none', color: '#65676B', cursor: 'pointer', padding: 0, fontWeight: 600 }}
            >
              Scholarships
            </button>
            <ChevronRight size={14} />
            <span style={{ color: '#1C1E21', fontWeight: 800, maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scholarship.title}
            </span>
          </div>

          <button
            onClick={() => onNavigate ? onNavigate('scholarships') : window.location.href = '/scholarships'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '9999px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Back to All Scholarships
          </button>
        </div>
      </div>

      {/* 2. VERIFIED OFFICIAL NOTIFICATION BANNER */}
      <div className="container" style={{ margin: '0.25rem auto 1.25rem' }}>
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1.5px solid #A7F3D0',
          borderRadius: '16px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#065F46' }}>
                Verified Official Portal Listing
              </div>
              <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                This scheme was verified with the authentic official government / trust portal. Never pay any fee or registration charges.
              </div>
            </div>
          </div>

          <a
            href={scholarship.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            <span>Open Official Portal</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 3. MAIN 2-COLUMN LAYOUT */}
      <div className="container" style={{ margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '1.75rem',
          alignItems: 'start'
        }} className="scholarship-detail-grid">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Main Scholarship Breakdown */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* CARD 1: Header & Key Metrics */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              {/* Badges & Actions */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    backgroundColor: scholarship.type === 'Government' ? '#EFF6FF' : scholarship.type === 'International' ? '#FAF5FF' : '#FEF9EE',
                    color: scholarship.type === 'Government' ? '#1D4ED8' : scholarship.type === 'International' ? '#7E22CE' : '#8A5D00',
                    border: '1px solid currentColor'
                  }}>
                    {scholarship.type}
                  </span>

                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569'
                  }}>
                    {scholarship.category}
                  </span>

                  {scholarship.featured && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FEF9EE',
                      color: '#8A5D00',
                      border: '1px solid #F1E7D0'
                    }}>
                      <Star size={12} fill="#C88D2D" /> Featured Grant
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={handleShare}
                    title="Copy Share Link"
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: copied ? '#059669' : '#64748B'
                    }}
                  >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                  </button>

                  <button
                    onClick={handleToggleBookmark}
                    title="Bookmark Scholarship"
                    style={{
                      background: isBookmarked ? '#FEF2F2' : '#F8FAFC',
                      border: isBookmarked ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isBookmarked ? '#DC2626' : '#64748B'
                    }}
                  >
                    <Bookmark size={16} fill={isBookmarked ? '#DC2626' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Title & Organization */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
                {renderProviderLogo(scholarship, 64)}

                <div style={{ flex: 1 }}>
                  <h1 style={{
                    margin: '0 0 0.45rem',
                    fontSize: '1.65rem',
                    fontWeight: 900,
                    color: '#1C1E21',
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em'
                  }}>
                    {scholarship.title}
                  </h1>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.88rem',
                    color: '#65676B',
                    fontWeight: 600
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={15} color="#8A5D00" />
                      <strong style={{ color: '#1E293B' }}>{scholarship.providerName}</strong>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} color="#94A3B8" />
                      <span>{scholarship.location || 'All India'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 4-Item Key Attribute Ribbon */}
              <div style={{
                backgroundColor: '#FDFBF7',
                border: '1.5px solid #F1E7D0',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#8A5D00', fontWeight: 800, textTransform: 'uppercase' }}>
                    GRANT AMOUNT
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#8A5D00', marginTop: '0.15rem' }}>
                    {scholarship.amount}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
                    APPLICATION DEADLINE
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={16} color="#C88D2D" />
                    <span>{scholarship.deadline}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
                    ELIGIBLE COURSES
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginTop: '0.15rem' }}>
                    {scholarship.eligibleCourses ? scholarship.eligibleCourses.join(', ') : 'All Technical Courses'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
                    INCOME CEILING
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginTop: '0.15rem' }}>
                    {scholarship.incomeCriteria || 'No Specific Income Limit'}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: About This Scholarship */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
                <GraduationCap size={20} color="#8A5D00" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21' }}>
                  About This Scholarship
                </h2>
              </div>

              <p style={{
                fontSize: '0.95rem',
                color: '#374151',
                lineHeight: 1.7,
                margin: 0,
                whiteSpace: 'pre-line'
              }}>
                {scholarship.description}
              </p>

              {scholarship.tags && scholarship.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '1.25rem' }}>
                  {scholarship.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        color: '#475569'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CARD 3: Eligibility Matrix */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.25rem' }}>
                <Award size={20} color="#8A5D00" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21' }}>
                  Eligibility Matrix & Criteria
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {scholarship.academicCriteria && (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Academic Performance Requirement:
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                      {scholarship.academicCriteria}
                    </div>
                  </div>
                )}

                {scholarship.incomeCriteria && (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Family Income Limit:
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                      {scholarship.incomeCriteria}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Eligible Years:
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 600 }}>
                      {scholarship.eligibleYears ? scholarship.eligibleYears.join(', ') : 'All Academic Years'}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Gender / Category Scope:
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 600 }}>
                      Gender: {scholarship.genderEligibility || 'All'} • Category: {scholarship.categoryEligibility || 'All Categories'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: Documents Required Checklist */}
            {scholarship.documentsRequired && scholarship.documentsRequired.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E8E2D5',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <ListChecks size={20} color="#8A5D00" />
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21' }}>
                      Documents Required Checklist
                    </h2>
                  </div>

                  <button
                    onClick={handleCopyDocsList}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8FAFC',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: copiedDocs ? '#059669' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedDocs ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedDocs ? 'List Copied' : 'Copy Checklist'}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {scholarship.documentsRequired.map((doc, dIdx) => (
                    <div
                      key={dIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        backgroundColor: '#FDFBF7',
                        border: '1px solid #F1E7D0'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '0.1rem'
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: '0.88rem', color: '#2D3238', fontWeight: 600, lineHeight: 1.45 }}>
                        {doc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CARD 5: Step-by-Step Application Process */}
            {scholarship.applicationProcess && scholarship.applicationProcess.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E8E2D5',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.25rem' }}>
                  <Layers size={20} color="#8A5D00" />
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21' }}>
                    How to Apply (Step-by-Step)
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {scholarship.applicationProcess.map((step, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        backgroundColor: '#FEF9EE',
                        border: '1.5px solid #F1E7D0',
                        color: '#8A5D00',
                        fontWeight: 900,
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {sIdx + 1}
                      </div>
                      <div style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.6, paddingTop: '0.2rem' }}>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CARD 6: Selection & Disbursement Process */}
            {scholarship.selectionProcess && (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E8E2D5',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
                  <Sparkles size={20} color="#8A5D00" />
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21' }}>
                    Selection & Disbursement Process
                  </h2>
                </div>

                <p style={{
                  fontSize: '0.92rem',
                  color: '#374151',
                  lineHeight: 1.65,
                  margin: 0
                }}>
                  {scholarship.selectionProcess}
                </p>
              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* RIGHT SIDEBAR: Action Card + Advisory + Related */}
          {/* ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* CARD 1: Action Box */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #F1E7D0',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 8px 24px rgba(138, 93, 0, 0.06)'
            }}>
              <div style={{ fontSize: '0.74rem', color: '#8A5D00', fontWeight: 800, textTransform: 'uppercase' }}>
                DIRECT OFFICIAL PORTAL
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1C1E21', margin: '0.25rem 0 0.85rem' }}>
                {scholarship.amount}
              </div>

              <div style={{
                backgroundColor: '#FDFBF7',
                border: '1px solid #F1E7D0',
                borderRadius: '12px',
                padding: '0.75rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem',
                color: '#4B5563'
              }}>
                <Clock size={16} color="#8A5D00" />
                <span>Deadline: <strong style={{ color: '#1E293B' }}>{scholarship.deadline}</strong></span>
              </div>

              {/* Primary Apply Button */}
              <a
                href={scholarship.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.28)',
                  boxSizing: 'border-box',
                  marginBottom: '0.75rem'
                }}
              >
                <span>Apply on Official Portal</span>
                <ArrowUpRight size={16} />
              </a>

              {/* Track Status Button */}
              <button
                onClick={() => setTrackingModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <span>{trackingRecord ? `Status: ${trackingRecord.status}` : 'Track My Application'}</span>
              </button>

              {trackingRecord && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  fontSize: '0.75rem',
                  color: '#1E40AF'
                }}>
                  <strong>Your Tracker:</strong> {trackingRecord.status}
                  {trackingRecord.notes && (
                    <div style={{ marginTop: '0.25rem', color: '#1E3A8A' }}>
                      "{trackingRecord.notes}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CARD 2: Critical Advisory Checklist */}
            <div style={{
              backgroundColor: '#FEF9EE',
              border: '1.5px solid #F1E7D0',
              borderRadius: '20px',
              padding: '1.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, color: '#8A5D00', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={18} /> Important Student Advisory
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#57410D', lineHeight: 1.45 }}>
                  • <strong>Aadhaar-Seeded Bank Account</strong>: All government DBT disbursements require NPCI mapping to your active savings account.
                </div>
                <div style={{ fontSize: '0.8rem', color: '#57410D', lineHeight: 1.45 }}>
                  • <strong>Bonafide Certificate</strong>: Request your college registrar/dean for the stamped Bonafide certificate in advance.
                </div>
                <div style={{ fontSize: '0.8rem', color: '#57410D', lineHeight: 1.45 }}>
                  • <strong>Zero Fees</strong>: All official scholarship schemes are free. Never share bank passwords, OTPs, or pay any agent.
                </div>
              </div>
            </div>

            {/* CARD 3: Organization Info */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.35rem'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                Awarding Organization
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', marginBottom: '0.25rem' }}>
                {scholarship.providerName}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#65676B', marginBottom: '0.85rem' }}>
                Source: {scholarship.sourceType || 'Official Portal'}
              </div>

              <a
                href={scholarship.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#8A5D00',
                  textDecoration: 'none'
                }}
              >
                <span>Visit Official Web Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* CARD 4: Related Scholarships */}
            {relatedScholarships && relatedScholarships.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E8E2D5',
                borderRadius: '20px',
                padding: '1.35rem'
              }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1C1E21', marginBottom: '0.85rem' }}>
                  Related Scholarships
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {relatedScholarships.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => onNavigate ? onNavigate(`scholarships:${rel.slug || rel.id}`) : window.location.href = `/scholarships/${rel.slug || rel.id}`}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#C88D2D';
                        e.currentTarget.style.backgroundColor = '#FEF9EE';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                    >
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.2rem' }}>
                        {rel.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        {rel.providerName}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#8A5D00', marginTop: '0.35rem' }}>
                        {rel.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* TRACKING MODAL */}
      {trackingModalOpen && (
        <ScholarshipTrackModal
          scholarship={scholarship}
          currentTracking={trackingRecord}
          onClose={() => setTrackingModalOpen(false)}
          onTrackUpdated={(rec) => {
            setTrackingRecord(rec);
          }}
        />
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .scholarship-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
