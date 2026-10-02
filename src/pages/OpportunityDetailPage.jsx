// src/pages/OpportunityDetailPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Briefcase, MapPin, Building2, Calendar, ArrowLeft, ArrowUpRight,
  Bookmark, CheckCircle2, ShieldCheck, Share2, AlertCircle, Clock,
  Globe, DollarSign, Award, ChevronRight, UserCheck, Layers, ListChecks
} from 'lucide-react';
import ApplicationTrackModal from '../components/ApplicationTrackModal';

export default function OpportunityDetailPage({ slug, onNavigate, onOpenAuth }) {
  const [opportunity, setOpportunity] = useState(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingRecord, setTrackingRecord] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchDetail = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch(`/api/opportunities/${slug}`);
        const data = await res.json();
        if (data.success && data.opportunity) {
          setOpportunity(data.opportunity);
          setRelatedOpportunities(data.relatedOpportunities || []);
        } else {
          setErrorMsg(data.message || 'Opportunity not found or is no longer active.');
        }
      } catch (err) {
        setErrorMsg('Network error while retrieving opportunity.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  // Fetch bookmark status and application status
  useEffect(() => {
    if (!opportunity) return;
    const fetchUserStatus = async () => {
      try {
        const [bmRes, trackRes] = await Promise.all([
          fetch('/api/opportunities/user/bookmarks').then(r => r.json()).catch(() => ({})),
          fetch('/api/opportunities/user/applications').then(r => r.json()).catch(() => ({}))
        ]);
        if (bmRes.success && Array.isArray(bmRes.bookmarkedIds)) {
          setIsBookmarked(bmRes.bookmarkedIds.includes(opportunity.id));
        }
        if (trackRes.success && Array.isArray(trackRes.applications)) {
          const rec = trackRes.applications.find(a => a.opportunityId === opportunity.id);
          if (rec) setTrackingRecord(rec);
        }
      } catch (e) {}
    };
    fetchUserStatus();
  }, [opportunity]);

  const handleToggleBookmark = async () => {
    if (!opportunity) return;
    try {
      const res = await fetch(`/api/opportunities/${opportunity.id}/bookmark`, { method: 'POST' });
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

  // Company Avatar Helper
  const renderAvatar = (opp, size = 56) => {
    if (!opp) return null;
    const name = opp.companyName || 'Company';
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
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            padding: '4px',
            border: '1.5px solid #E8E2D5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}
        />
      );
    }
    const colors = ['#781416', '#0284C7', '#059669', '#7C3AED', '#D97706'];
    const bg = colors[name.charCodeAt(0) % colors.length];
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '14px',
        backgroundColor: bg,
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '1.4rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        flexShrink: 0
      }}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#FDFBF7',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ textAlign: 'center', color: '#65676B' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #E8E2D5',
            borderTopColor: '#781416',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ fontWeight: 600 }}>Loading verified opportunity details...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !opportunity) {
    return (
      <div style={{
        backgroundColor: '#FDFBF7',
        minHeight: '80vh',
        padding: '3rem 1.25rem',
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E8E2D5',
          padding: '2.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
        }}>
          <AlertCircle size={48} color="#D97706" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C1E21', marginBottom: '0.5rem' }}>
            {errorMsg || 'Opportunity Not Found'}
          </h2>
          <p style={{ color: '#65676B', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            This opportunity might have reached its official application deadline or was removed from public listings.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('internships-jobs')}
            style={{
              backgroundColor: '#781416',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.65rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            ← Back to All Opportunities
          </button>
        </div>
      </div>
    );
  }

  const isInternship = (opportunity.type || '').toLowerCase() === 'internship';
  const isLinkBroken = opportunity.verificationStatus === 'broken_link';

  return (
    <div style={{
      backgroundColor: '#FDFBF7',
      minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: '#1C1E21',
      paddingBottom: '4rem'
    }}>
      {/* 1. BREADCRUMB */}
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '1rem 1.25rem 0.5rem',
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
        <button
          onClick={() => onNavigate && onNavigate('internships-jobs')}
          style={{ background: 'none', border: 'none', color: '#65676B', cursor: 'pointer', padding: 0 }}
        >
          Internships & Jobs
        </button>
        <ChevronRight size={13} />
        <span style={{ color: '#781416', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
          {opportunity.title}
        </span>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Back Button */}
        <button
          onClick={() => onNavigate && onNavigate('internships-jobs')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: '#781416',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            padding: '0.6rem 0',
            marginBottom: '0.6rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Opportunities</span>
        </button>

        {/* 2. TOP HERO CARD */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E8E2D5',
          padding: '1.75rem 2rem',
          boxShadow: '0 8px 24px rgba(35, 30, 25, 0.05)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Left: Avatar + Title + Badges */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: '1 1 500px' }}>
              {renderAvatar(opportunity, 64)}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <span style={{
                    backgroundColor: isInternship ? '#ECFDF5' : '#EFF6FF',
                    color: isInternship ? '#059669' : '#2563EB',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    border: isInternship ? '1px solid #A7F3D0' : '1px solid #BFDBFE'
                  }}>
                    {opportunity.type}
                  </span>

                  <span style={{
                    backgroundColor: '#F3EFE6',
                    color: '#5B4000',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '8px'
                  }}>
                    {opportunity.domain}
                  </span>

                  {opportunity.verified && (
                    <span style={{
                      backgroundColor: '#F0FDF4',
                      color: '#16A34A',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      border: '1px solid #BBF7D0',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <ShieldCheck size={13} /> Verified Opportunity
                    </span>
                  )}
                </div>

                <h1 style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  color: '#1C1E21',
                  lineHeight: 1.25
                }}>
                  {opportunity.title}
                </h1>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.1rem',
                  flexWrap: 'wrap',
                  fontSize: '0.86rem',
                  color: '#4B5563'
                }}>
                  <span style={{ fontWeight: 700, color: '#1C1E21', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={16} color="#781416" /> {opportunity.companyName}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={15} /> {opportunity.location}
                  </span>
                  {opportunity.workMode && (
                    <span style={{
                      backgroundColor: '#F3F4F6',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}>
                      {opportunity.workMode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Apply Button + Action Controls */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.85rem',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={handleShare}
                  title="Share link"
                  style={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '0.6rem 0.85rem',
                    color: '#4B5563',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Share2 size={15} />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>

                <button
                  onClick={handleToggleBookmark}
                  style={{
                    backgroundColor: isBookmarked ? '#FEF9EE' : '#F9FAFB',
                    border: isBookmarked ? '1px solid #E8CDA1' : '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '0.6rem 0.85rem',
                    color: isBookmarked ? '#C88D2D' : '#4B5563',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Bookmark size={15} fill={isBookmarked ? '#C88D2D' : 'none'} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => setTrackingModalOpen(true)}
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '12px',
                    padding: '0.6rem 0.85rem',
                    color: '#1D4ED8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Clock size={15} />
                  <span>{trackingRecord ? `Status: ${trackingRecord.status}` : 'Track Status'}</span>
                </button>
              </div>

              {/* Direct Official Apply Button */}
              {isLinkBroken ? (
                <div style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '12px',
                  backgroundColor: '#F3F4F6',
                  color: '#9CA3AF',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  border: '1px solid #E5E7EB'
                }}>
                  Application link unavailable
                </div>
              ) : (
                <a
                  href={opportunity.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    padding: '0.75rem 1.85rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(120, 20, 22, 0.3)',
                    transition: 'opacity 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <span>Apply Now</span>
                  <ArrowUpRight size={18} />
                </a>
              )}

              <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                Opens official application portal directly
              </span>
            </div>
          </div>
        </div>

        {/* 3. TWO-COLUMN DETAILS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="job-portal-detail-grid">
          
          {/* LEFT: Detailed Job Description, Responsibilities & Requirements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Overview & Description */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.75rem',
              boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)'
            }}>
              <h2 style={{
                margin: '0 0 1rem',
                fontSize: '1.18rem',
                fontWeight: 800,
                color: '#1C1E21'
              }}>
                Opportunity Overview
              </h2>
              <p style={{
                margin: 0,
                fontSize: '0.94rem',
                lineHeight: 1.7,
                color: '#374151',
                whiteSpace: 'pre-line'
              }}>
                {opportunity.description}
              </p>
            </div>

            {/* Core Responsibilities */}
            {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E8E2D5',
                padding: '1.75rem',
                boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)'
              }}>
                <h3 style={{
                  margin: '0 0 1rem',
                  fontSize: '1.12rem',
                  fontWeight: 800,
                  color: '#1C1E21',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <ListChecks size={20} color="#781416" />
                  Key Responsibilities
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {opportunity.responsibilities.map((resp, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#FEF2F2',
                        color: '#781416',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.55 }}>
                        {resp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements & Skills */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.75rem',
              boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)'
            }}>
              <h3 style={{
                margin: '0 0 1rem',
                fontSize: '1.12rem',
                fontWeight: 800,
                color: '#1C1E21'
              }}>
                Required Technical Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {(opportunity.skills || []).map((sk, idx) => (
                  <span key={idx} style={{
                    backgroundColor: '#FEF9EE',
                    color: '#8A5D00',
                    border: '1px solid #E8CDA1',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px'
                  }}>
                    {sk}
                  </span>
                ))}
              </div>

              {opportunity.requirements && opportunity.requirements.length > 0 && (
                <>
                  <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.98rem', fontWeight: 800, color: '#1C1E21' }}>
                    Eligibility & Candidate Profile
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {opportunity.requirements.map((req, rIdx) => (
                      <li key={rIdx} style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.5 }}>
                        {req}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Benefits & Perks */}
            {opportunity.benefits && opportunity.benefits.length > 0 && (
              <div style={{
                backgroundColor: '#F3FAF5',
                borderRadius: '20px',
                border: '1px solid #C4E7D0',
                padding: '1.5rem 1.75rem'
              }}>
                <h3 style={{
                  margin: '0 0 0.85rem',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Award size={18} color="#166534" />
                  What You Receive / Program Benefits
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {opportunity.benefits.map((ben, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', color: '#15803D' }}>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Quick Info Card, Source Verification, Related Roles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Card 1: Key Metadata Snapshot */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)'
            }}>
              <h3 style={{ margin: '0 0 1.1rem', fontSize: '0.98rem', fontWeight: 800, color: '#1C1E21' }}>
                Job Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.84rem' }}>
                <div>
                  <span style={{ color: '#65676B', display: 'block', fontSize: '0.74rem' }}>STIPEND / SALARY</span>
                  <strong style={{ color: '#1C1E21', fontSize: '0.92rem' }}>
                    {opportunity.salary && opportunity.salary !== 'Not specified' 
                      ? opportunity.salary 
                      : (opportunity.stipend && opportunity.stipend !== 'Not specified' ? opportunity.stipend : 'Not specified')}
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#65676B', display: 'block', fontSize: '0.74rem' }}>APPLICATION DEADLINE</span>
                  <strong style={{ color: '#781416', fontSize: '0.92rem' }}>
                    {opportunity.deadline && opportunity.deadline !== 'Deadline not specified' ? opportunity.deadline : 'Open / Rolling'}
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#65676B', display: 'block', fontSize: '0.74rem' }}>ELIGIBLE COURSES</span>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    {(opportunity.courseEligibility || ['B.Tech']).map(c => (
                      <span key={c} style={{
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#65676B', display: 'block', fontSize: '0.74rem' }}>EXPERIENCE LEVEL</span>
                  <strong style={{ color: '#1C1E21' }}>{opportunity.experienceLevel || 'Fresher / Student'}</strong>
                </div>

                <div>
                  <span style={{ color: '#65676B', display: 'block', fontSize: '0.74rem' }}>SOURCE PORTAL</span>
                  <strong style={{ color: '#1C1E21' }}>{opportunity.sourceType || 'Official Careers Portal'}</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Verification Audit Card */}
            <div style={{
              backgroundColor: '#FAFAF7',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={18} color="#16A34A" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#1C1E21' }}>
                  Verification Audit
                </h4>
              </div>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#4B5563', lineHeight: 1.45 }}>
                {opportunity.verificationNotes || 'Verified authentic listing on official company careers portal.'}
              </p>
              <div style={{ fontSize: '0.74rem', color: '#65676B' }}>
                Last Verified: {new Date(opportunity.lastVerifiedAt || opportunity.updatedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Card 3: Related Opportunities */}
            {relatedOpportunities.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E8E2D5',
                padding: '1.35rem',
                boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)'
              }}>
                <h3 style={{ margin: '0 0 0.85rem', fontSize: '0.94rem', fontWeight: 800, color: '#1C1E21' }}>
                  Similar Openings in {opportunity.domain}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {relatedOpportunities.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => onNavigate && onNavigate(`internships-jobs:${rel.slug || rel.id}`)}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '12px',
                        border: '1px solid #F0ECE4',
                        backgroundColor: '#FDFBF7',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.82rem', color: '#1C1E21', lineHeight: 1.25 }}>
                          {rel.title}
                        </strong>
                        <span style={{ fontSize: '0.74rem', color: '#65676B' }}>
                          {rel.companyName} • {rel.location}
                        </span>
                      </div>
                      <ChevronRight size={14} color="#781416" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Tracker Modal */}
      {trackingModalOpen && (
        <ApplicationTrackModal
          opportunity={opportunity}
          currentTracking={trackingRecord}
          onClose={() => setTrackingModalOpen(false)}
          onTrackUpdated={(updated) => setTrackingRecord(updated)}
        />
      )}
    </div>
  );
}
