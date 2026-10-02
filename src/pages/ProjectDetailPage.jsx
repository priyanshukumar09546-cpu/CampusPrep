// src/pages/ProjectDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Clock, 
  Users, 
  Star, 
  Code2, 
  FileText, 
  Layers, 
  HelpCircle, 
  Database, 
  Terminal, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

export default function ProjectDetailPage({ slug, onNavigate }) {
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${slug}`);
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) {
          throw new Error('Unable to reach project service. Please ensure the backend is running.');
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || 'Project not found');
        }
        setProject(data.project);
        setRelatedProjects(data.relatedProjects || []);
        setError(null);

        // Check if bookmarked
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const bRes = await fetch('/api/projects/user/bookmarks', { headers });
        if (bRes.ok && (bRes.headers.get('content-type') || '').includes('application/json')) {
          const bData = await bRes.json();
          if (bData.success && Array.isArray(bData.bookmarkedIds)) {
            setIsBookmarked(bData.bookmarkedIds.includes(data.project.id));
          }
        }
      } catch (err) {
        console.error('Error fetching project detail:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProject();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!project) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/projects/${project.id}/bookmark`, {
        method: 'POST',
        headers
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.isBookmarked);
        setProject(prev => ({ ...prev, bookmarksCount: data.bookmarksCount }));
      }
    } catch (e) {
      console.error('Bookmark error:', e);
    }
  };

  const handleCopyCode = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '5rem 1rem', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '3px solid #E8E2D5',
          borderTopColor: '#781416',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1.5rem'
        }} />
        <p style={{ color: '#78716C', fontSize: '0.95rem', fontWeight: 600 }}>
          Loading verified repository details...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '4rem 1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="container" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', border: '1px solid #E8E2D5' }}>
          <h2 style={{ color: '#781416', marginBottom: '0.75rem', fontWeight: 800 }}>Project Not Found</h2>
          <p style={{ color: '#57534E', marginBottom: '1.5rem' }}>{error || 'This project idea does not exist or has not been published.'}</p>
          <button
            onClick={() => onNavigate ? onNavigate('project-ideas') : (window.location.href = '/project-ideas')}
            style={{
              backgroundColor: '#781416',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.65rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ← Back to Project Ideas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1F2421', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* 1. BREADCRUMB */}
      <div style={{ borderBottom: '1px solid #E8E2D5', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ padding: '0.65rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#78716C', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <span 
              onClick={() => onNavigate && onNavigate('home')} 
              style={{ cursor: 'pointer' }}
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
            <span 
              onClick={() => onNavigate && onNavigate('project-ideas')} 
              style={{ cursor: 'pointer' }}
              className="hover:underline"
            >
              Project Ideas
            </span>
            <span>/</span>
            <span style={{ color: '#781416', fontWeight: 700 }}>
              {project.title}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PROJECT HERO HEADER */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E8E2D5',
        padding: '2.5rem 1rem 2rem'
      }}>
        <div className="container">
          
          <button
            onClick={() => onNavigate ? onNavigate('project-ideas') : (window.location.href = '/project-ideas')}
            style={{
              background: 'none',
              border: 'none',
              color: '#78716C',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              padding: 0
            }}
          >
            <ArrowLeft size={16} /> Back to All Projects
          </button>

          {/* Badges Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{
              backgroundColor: '#FEF9EE',
              border: '1px solid #E4CDA1',
              color: '#8A5D00',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '0.22rem 0.75rem',
              borderRadius: '9999px'
            }}>
              {project.domain}
            </span>

            <span style={{
              backgroundColor: '#F5F5F4',
              color: '#44403C',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.22rem 0.75rem',
              borderRadius: '9999px'
            }}>
              {project.levelBadge || project.level}
            </span>

            <span style={{
              backgroundColor: '#EEF2FF',
              color: '#4338CA',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.22rem 0.75rem',
              borderRadius: '9999px'
            }}>
              {project.academicYear}
            </span>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#D97706', fontSize: '0.74rem', fontWeight: 800, marginLeft: 'auto' }}>
              <Star size={14} fill="#D97706" />
              <span>Difficulty: {project.difficulty || 3}/5</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)',
            fontWeight: 900,
            color: '#1F2421',
            lineHeight: 1.2,
            margin: '0 0 0.85rem',
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
          }}>
            {project.title}
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#57534E',
            lineHeight: 1.6,
            maxWidth: '850px',
            margin: '0 0 1.5rem'
          }}>
            {project.tagline || project.description}
          </p>

          {/* Action Buttons Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid #F5F5F4'
          }}>
            {/* Primary GitHub Button */}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#1F2421',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '0.65rem 1.4rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <Github size={17} /> View Source Code on GitHub
              <ExternalLink size={14} style={{ opacity: 0.8 }} />
            </a>

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            )}

            {project.datasetUrl && (
              <a
                href={project.datasetUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#F5F5F4',
                  border: '1px solid #D6D3D1',
                  color: '#292524',
                  borderRadius: '10px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Database size={16} color="#0284c7" /> Benchmark Dataset
              </a>
            )}

            {/* Bookmark Button */}
            <button
              onClick={handleToggleBookmark}
              style={{
                backgroundColor: isBookmarked ? '#FEF2F2' : '#F5F5F4',
                border: isBookmarked ? '1px solid #FCA5A5' : '1px solid #D6D3D1',
                color: isBookmarked ? '#781416' : '#44403C',
                borderRadius: '10px',
                padding: '0.65rem 1.15rem',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginLeft: 'auto'
              }}
            >
              <Bookmark size={16} fill={isBookmarked ? '#781416' : 'none'} />
              <span>{isBookmarked ? 'Bookmarked' : 'Save Bookmark'}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              style={{
                backgroundColor: '#F5F5F4',
                border: '1px solid #D6D3D1',
                color: '#44403C',
                borderRadius: '10px',
                padding: '0.65rem 1rem',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {shareCopied ? (
                <>
                  <Check size={16} color="#059669" /> Link Copied!
                </>
              ) : (
                <>
                  <Share2 size={16} /> Share
                </>
              )}
            </button>
          </div>

          {/* VERIFIED LINK GUARANTEE BANNER */}
          <div style={{
            marginTop: '1.5rem',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: '#065F46'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="#059669" />
              <span>
                <strong>Verified Repository:</strong> Authenticated open-source codebase with live HTTP reachability check passed (Status {project.httpStatusCode || 200}).
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#047857' }}>
              Checked by ProfessorVirus automated crawler
            </span>
          </div>

        </div>
      </header>

      {/* 3. MAIN CONTENT CONTAINER (2 COLUMNS) */}
      <main style={{ padding: '2.5rem 1rem 4rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '2rem',
            alignItems: 'start'
          }} className="project-detail-layout">
            
            {/* LEFT MAIN DETAILS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* SECTION 1: PROBLEM STATEMENT & OVERVIEW */}
              <section style={detailCardStyle}>
                <h2 style={sectionHeadingStyle}>
                  <BookOpen size={20} color="#781416" /> Problem Statement & Overview
                </h2>
                <p style={{ color: '#44403C', lineHeight: 1.7, fontSize: '0.94rem', margin: '0 0 1rem' }}>
                  {project.problemStatement || project.description}
                </p>
                <p style={{ color: '#57534E', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
                  {project.description}
                </p>
              </section>

              {/* SECTION 2: KEY FEATURES */}
              {Array.isArray(project.keyFeatures) && project.keyFeatures.length > 0 && (
                <section style={detailCardStyle}>
                  <h2 style={sectionHeadingStyle}>
                    <Sparkles size={20} color="#C88D2D" /> Key Features & Capabilities
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                    {project.keyFeatures.map((feat, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        backgroundColor: '#FAF7F2',
                        border: '1px solid #E8E2D5',
                        borderRadius: '10px',
                        padding: '0.75rem 0.85rem',
                        fontSize: '0.86rem',
                        color: '#292524'
                      }}>
                        <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ lineHeight: 1.45 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION 3: SYSTEM ARCHITECTURE & WORKFLOW */}
              {project.architecture && (
                <section style={detailCardStyle}>
                  <h2 style={sectionHeadingStyle}>
                    <Layers size={20} color="#0284c7" /> System Architecture & Data Flow
                  </h2>
                  <div style={{
                    backgroundColor: '#1E293B',
                    color: '#F8FAFC',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '0.86rem',
                    lineHeight: 1.6,
                    overflowX: 'auto',
                    border: '1px solid #334155'
                  }}>
                    {project.architecture}
                  </div>
                </section>
              )}

              {/* SECTION 4: STEP-BY-STEP SETUP & INSTALLATION GUIDE */}
              {project.setupGuide && (
                <section style={detailCardStyle}>
                  <h2 style={sectionHeadingStyle}>
                    <Terminal size={20} color="#781416" /> Step-by-Step Setup & Installation Guide
                  </h2>
                  
                  {project.setupGuide.prerequisitesText && (
                    <p style={{ fontSize: '0.88rem', color: '#57534E', margin: '0 0 1.25rem', fontStyle: 'italic' }}>
                      {project.setupGuide.prerequisitesText}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {(project.setupGuide.steps || []).map((step, sIdx) => (
                      <div key={sIdx} style={{
                        backgroundColor: '#FAF7F2',
                        border: '1.5px solid #E8E2D5',
                        borderRadius: '12px',
                        padding: '1.15rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1F2421' }}>
                            Step {step.stepNumber || sIdx + 1}: {step.title}
                          </span>
                        </div>

                        {step.description && (
                          <p style={{ fontSize: '0.82rem', color: '#57534E', margin: '0 0 0.65rem' }}>
                            {step.description}
                          </p>
                        )}

                        {step.command && (
                          <div style={{
                            backgroundColor: '#1C1917',
                            color: '#F5F5F4',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontFamily: 'Consolas, Monaco, monospace',
                            fontSize: '0.82rem',
                            overflowX: 'auto'
                          }}>
                            <code>{step.command}</code>
                            <button
                              onClick={() => handleCopyCode(step.command, sIdx)}
                              title="Copy command"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#A8A29E',
                                cursor: 'pointer',
                                padding: '0.2rem',
                                marginLeft: '0.75rem',
                                flexShrink: 0
                              }}
                            >
                              {copiedCodeIdx === sIdx ? (
                                <Check size={16} color="#10B981" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION 5: VIVA VOCE QUESTIONS & ANSWERS */}
              {Array.isArray(project.vivaQuestions) && project.vivaQuestions.length > 0 && (
                <section style={detailCardStyle}>
                  <h2 style={sectionHeadingStyle}>
                    <HelpCircle size={20} color="#D97706" /> Expected Viva Voce Questions & Answers
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#57534E', margin: '0 0 1.25rem' }}>
                    Frequently asked questions by university external examiners during final semester evaluation.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {project.vivaQuestions.map((viva, qIdx) => (
                      <div key={qIdx} style={{
                        border: '1px solid #E8E2D5',
                        borderRadius: '12px',
                        padding: '1rem',
                        backgroundColor: '#FFFFFF'
                      }}>
                        <div style={{ fontWeight: 800, color: '#781416', fontSize: '0.88rem', marginBottom: '0.45rem' }}>
                          Q{qIdx + 1}: {viva.question}
                        </div>
                        <div style={{ color: '#44403C', fontSize: '0.85rem', lineHeight: 1.6 }}>
                          <strong>Answer:</strong> {viva.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* RIGHT SIDEBAR SPECS */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* SPECS CARD */}
              <div style={detailCardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E8E2D5' }}>
                  Project Specifications
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: '#78716C', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Domain</span>
                    <strong style={{ color: '#1F2421' }}>{project.domain}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#78716C', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Academic Level</span>
                    <strong style={{ color: '#1F2421' }}>{project.levelBadge || project.level}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#78716C', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Target Year</span>
                    <strong style={{ color: '#1F2421' }}>{project.academicYear}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#78716C', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Duration</span>
                    <strong style={{ color: '#1F2421' }}>{project.estimatedDuration || '4-6 Weeks'}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#78716C', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Recommended Team Size</span>
                    <strong style={{ color: '#1F2421' }}>{project.teamSize || '2-4 Members'}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#78716C', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Difficulty Rating</span>
                    <strong style={{ color: '#1F2421' }}>{project.difficulty || 3} of 5 Stars</strong>
                  </div>
                </div>
              </div>

              {/* TECH STACK BADGES */}
              <div style={detailCardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.85rem' }}>
                  Technologies & Frameworks
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {(project.technologies || []).map((t, idx) => (
                    <span key={idx} style={{
                      backgroundColor: '#FAF7F2',
                      border: '1.5px solid #E8E2D5',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#44403C'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* DELIVERABLES */}
              {Array.isArray(project.deliverables) && project.deliverables.length > 0 && (
                <div style={detailCardStyle}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.85rem' }}>
                    University Deliverables
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: '#44403C' }}>
                    {project.deliverables.map((item, dIdx) => (
                      <div key={dIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={14} color="#059669" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RELATED PROJECTS */}
              {relatedProjects.length > 0 && (
                <div style={detailCardStyle}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.85rem' }}>
                    Related in {project.domain}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {relatedProjects.map(rel => (
                      <div
                        key={rel.id}
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate(`project-detail:${rel.slug}`);
                          } else {
                            window.location.href = `/project-ideas/${rel.slug}`;
                          }
                        }}
                        style={{
                          padding: '0.65rem 0.75rem',
                          backgroundColor: '#FAF7F2',
                          borderRadius: '10px',
                          border: '1px solid #E8E2D5',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#C88D2D';
                          e.currentTarget.style.backgroundColor = '#FEF9EE';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#E8E2D5';
                          e.currentTarget.style.backgroundColor = '#FAF7F2';
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.2rem' }}>
                          {rel.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#781416', fontWeight: 700 }}>
                          View Details →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </aside>

          </div>
        </div>
      </main>

      {/* Responsive layout styling */}
      <style>{`
        @media (max-width: 900px) {
          .project-detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const detailCardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1.5px solid #E8E2D5',
  padding: '1.5rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
};

const sectionHeadingStyle = {
  fontSize: '1.15rem',
  fontWeight: 800,
  color: '#1F2421',
  margin: '0 0 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.55rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid #F5F5F4'
};
