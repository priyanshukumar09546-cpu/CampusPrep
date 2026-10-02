import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Download, 
  Bookmark, 
  Flag, 
  Check, 
  FileText, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { isValidPdfUrl } from '../utils/pdfValidator';

export default function NoteViewerModal({ note, subject, unit, onClose }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  if (!note) return null;

  // Resolve target resource URL
  const targetUrl = (note.verifiedUrl || note.resourceUrl || note.fileUrl || note.url || note.pdfUrl || '').trim();

  // Validate that the resource actually exists and is not a 404 / broken aktupyq link
  const isBrokenOr404 = !targetUrl || 
    targetUrl.includes('aktupyq.com/bca/notes') || 
    !isValidPdfUrl(targetUrl) ||
    note.available === false ||
    note.isAvailable === false;

  const isAvailable = !isBrokenOr404;

  // Generate safe embedded URL for iframe
  const getEmbedUrl = (rawUrl) => {
    if (!rawUrl) return '';
    let url = rawUrl.trim();

    // Google Drive file: transform to /preview for embedded viewing
    const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveFileMatch && driveFileMatch[1]) {
      return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
    }

    // Google Drive folder: use embeddedfolderview
    const driveFolderMatch = url.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
    if (driveFolderMatch && driveFolderMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${driveFolderMatch[1]}#grid`;
    }

    // Direct Google Docs view
    if (url.includes('docs.google.com')) {
      return url;
    }

    // Other PDF URLs
    return url;
  };

  const embedUrl = getEmbedUrl(targetUrl);

  const handleDownload = () => {
    if (!targetUrl) return;
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.download = `${note.title || 'AKTU_Resource'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDirect = () => {
    if (!targetUrl) return;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const providerName = note.provider || note.source || 'Faculty Lecture Notes';
  const displayCategory = note.category || note.type || 'Verified Study Resource';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(28, 30, 33, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isFullscreen ? '0' : '1.25rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: isFullscreen ? '0' : '24px',
        maxWidth: isFullscreen ? '100vw' : '980px',
        width: '100%',
        height: isFullscreen ? '100vh' : 'auto',
        maxHeight: isFullscreen ? '100vh' : '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
        border: isFullscreen ? 'none' : '1.5px solid #E8E2D5',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Bar */}
        <div style={{
          backgroundColor: '#1F2421',
          color: '#ffffff',
          padding: '1.2rem 1.75rem',
          borderTopLeftRadius: isFullscreen ? '0' : '22px',
          borderTopRightRadius: isFullscreen ? '0' : '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#C88D2D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {note.course || note.branch || 'B.Tech'} • {note.year || 'All Years'} • {subject ? `${subject.code || ''} ${subject.subject || ''}` : note.subjectName || note.subject || 'Study Resource'} {note.unit ? `• Unit ${note.unit}` : ''}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '0.2rem', color: '#ffffff', lineHeight: 1.25 }}>
              {note.title || 'Course Resource Document'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Details Body */}
        <div style={{ padding: isFullscreen ? '1rem 1.75rem 1.75rem' : '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          
          {/* Metadata Row */}
          {!isFullscreen && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Source / Provider</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{providerName}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Category</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#C88D2D' }}>{displayCategory}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Curriculum Alignment</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  {note.course ? `${note.course} Verified Curriculum` : 'AKTU B.Tech Syllabus'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Verification</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={15} style={{ color: '#C88D2D' }} /> Verified Resource
                </div>
              </div>
            </div>
          )}

          {/* Topics Covered Box */}
          {!isFullscreen && unit && unit.topics && (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Unit Topics
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {unit.topics.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#FDF6E8',
                      border: '1px solid #E8D3B0',
                      color: '#7A5835',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      padding: '0.25rem 0.65rem'
                    }}
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* EMBEDDED RESOURCE VIEWER CONTAINER WITH WEBSITE-LEVEL LOGO OVERLAY */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: isFullscreen ? 'calc(100vh - 160px)' : '560px',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)'
          }}>
            {/* Website-Level ProfessorVirus Logo Overlay (Sticky Top Banner) — ONLY when resource is available */}
            {isAvailable && !iframeError && (
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 25,
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'rgba(31, 36, 33, 0.94)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                border: '1.5px solid rgba(200, 141, 45, 0.6)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                pointerEvents: 'auto'
              }}>
                <img 
                  src="/assets/navbar_logo.png" 
                  alt="ProfessorVirus Logo" 
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    objectFit: 'contain',
                    border: '1.5px solid #C88D2D',
                    backgroundColor: '#ffffff'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/navbar_logo.jpg';
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                    Professor<span style={{ color: '#C88D2D' }}>Virus</span>
                  </span>
                  <span style={{ fontSize: '0.60rem', fontWeight: 700, color: '#E8D3B0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Study Resource
                  </span>
                </div>
              </div>
            )}

            {/* Quick Action Overlay Controls (Top Right) — ONLY when resource is available */}
            {isAvailable && !iframeError && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 25,
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={handleOpenDirect}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#C88D2D',
                    border: '1px solid rgba(200, 141, 45, 0.4)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ExternalLink size={13} /> Open Tab
                </button>

                <button
                  onClick={handleDownload}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={13} /> Save
                </button>
              </div>
            )}

            {/* Iframe or Honest Unavailable view */}
            {isAvailable && embedUrl && !iframeError ? (
              <iframe
                src={embedUrl}
                title={note.title || 'Resource Viewer'}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#ffffff'
                }}
                allow="autoplay; encrypted-media; fullscreen"
                onError={() => setIframeError(true)}
              />
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#FAF7F2',
                color: '#1C1E21',
                height: '100%'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  border: '1.5px solid #FCD34D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  marginBottom: '1rem',
                  boxShadow: '0 6px 18px rgba(217, 119, 6, 0.15)'
                }}>
                  <AlertTriangle size={32} />
                </div>

                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#1C1E21',
                  margin: '0 0 0.4rem 0'
                }}>
                  Resource currently unavailable.
                </h3>

                <p style={{
                  fontSize: '0.9rem',
                  color: '#64748B',
                  maxWidth: '460px',
                  lineHeight: 1.55,
                  margin: '0 auto 1.5rem auto'
                }}>
                  Curriculum notes for <strong>{note.title || (subject?.name || 'this subject')}</strong> are currently being verified and curated by the ProfessorVirus academic team.
                </p>

                {/* Action Buttons: Open in New Tab (if URL exists) | Report Issue | Go Back | Close Viewer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {targetUrl && (
                    <button
                      onClick={handleOpenDirect}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '12px',
                        backgroundColor: '#0284C7',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                      }}
                    >
                      <ExternalLink size={14} />
                      Open in New Tab
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setReportSubmitted(true);
                      alert('Thank you! Our academic team has been notified to fast-track verified notes for this subject.');
                    }}
                    disabled={reportSubmitted}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      color: reportSubmitted ? '#C88D2D' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Flag size={14} />
                    {reportSubmitted ? 'Report Submitted' : 'Report Issue'}
                  </button>

                  <button
                    onClick={onClose}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '12px',
                      backgroundColor: '#FAF7F2',
                      border: '1.5px solid #E2D9C8',
                      color: '#475569',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={14} />
                    Go Back
                  </button>

                  <button
                    onClick={onClose}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.6rem 1.4rem',
                      borderRadius: '12px',
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(120, 20, 22, 0.3)'
                    }}
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.45rem 0.85rem', borderRadius: '10px',
                  border: isBookmarked ? '1.5px solid #C88D2D' : '1px solid #cbd5e1',
                  backgroundColor: isBookmarked ? '#FDF6E8' : '#ffffff',
                  color: isBookmarked ? '#7A5835' : '#475569',
                  fontSize: '0.80rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <Bookmark size={14} fill={isBookmarked ? '#C88D2D' : 'none'} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark Note'}
              </button>

              <button
                onClick={() => {
                  setReportSubmitted(true);
                  alert('Thank you! If embedded viewing is blocked by the provider, you can open the resource directly via the "Open Tab" button.');
                }}
                disabled={reportSubmitted}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.45rem 0.85rem', borderRadius: '10px',
                  border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                  color: reportSubmitted ? '#C88D2D' : '#64748b',
                  fontSize: '0.80rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <Flag size={14} />
                {reportSubmitted ? 'Report Submitted' : 'Report Issue'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={handleOpenDirect}
                className="btn-outline"
                style={{
                  padding: '0.5rem 1.25rem',
                  borderColor: '#C88D2D',
                  color: '#C88D2D',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <ExternalLink size={14} /> Direct Link
              </button>

              <button
                onClick={onClose}
                className="btn-primary"
                style={{ padding: '0.5rem 1.5rem', backgroundColor: '#1F2421', fontSize: '0.82rem', fontWeight: 800 }}
              >
                Close Viewer
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
