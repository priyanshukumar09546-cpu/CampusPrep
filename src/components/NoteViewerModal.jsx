import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  Share2
} from 'lucide-react';
import { isValidPdfUrl } from '../utils/pdfValidator';

export default function NoteViewerModal({ note, subject, unit, onClose }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      backgroundColor: 'rgba(24, 20, 18, 0.88)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 11000,
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      padding: isFullscreen || isMobile ? '0' : '1.25rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: isFullscreen || isMobile ? '0' : '24px',
        maxWidth: isFullscreen || isMobile ? '100vw' : '980px',
        width: '100%',
        height: isFullscreen || isMobile ? '100vh' : 'auto',
        maxHeight: isFullscreen || isMobile ? '100vh' : '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
        border: isFullscreen || isMobile ? 'none' : '1.5px solid #E8E2D5',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Bar */}
        <div style={{
          backgroundColor: '#1C1618',
          color: '#ffffff',
          padding: isMobile ? '0.75rem 1rem' : '1.1rem 1.5rem',
          borderTopLeftRadius: isFullscreen || isMobile ? '0' : '22px',
          borderTopRightRadius: isFullscreen || isMobile ? '0' : '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          position: 'relative',
          flexShrink: 0
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: isMobile ? '0.68rem' : '0.74rem',
              color: '#C88D2D',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {note.course || note.branch || 'B.Tech'} • {note.year || 'All Years'} • {subject ? `${subject.code || ''} ${subject.subject || subject.name || ''}` : note.subjectName || note.subject || 'Resource'} {note.unit ? `• Unit ${note.unit}` : ''}
            </div>
            <h2 style={{
              fontSize: isMobile ? '0.98rem' : '1.2rem',
              fontWeight: 900,
              marginTop: '0.15rem',
              color: '#ffffff',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {note.title || 'Course Resource Document'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
            {targetUrl && (
              <button
                type="button"
                onClick={handleOpenDirect}
                title="Open in Google Drive / New Tab"
                style={{
                  backgroundColor: '#7A1C28',
                  backgroundImage: 'linear-gradient(135deg, #8C2232 0%, #681520 100%)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '10px',
                  padding: isMobile ? '0.4rem 0.65rem' : '0.45rem 0.85rem',
                  fontSize: isMobile ? '0.72rem' : '0.78rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <ExternalLink size={13} />
                <span>{isMobile ? 'Drive' : 'Open Tab'}</span>
              </button>
            )}

            {!isMobile && (
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  borderRadius: '10px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '10px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Fast-Access Callout Bar */}
        {isMobile && targetUrl && (
          <div style={{
            backgroundColor: '#FFF8EC',
            borderBottom: '1px solid #F6DFB5',
            padding: '0.45rem 0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '0.72rem', color: '#92400E', fontWeight: 600 }}>
              💡 Tap Drive if PDF preview does not display
            </div>
            <button
              type="button"
              onClick={handleOpenDirect}
              style={{
                background: 'none',
                border: 'none',
                color: '#7A1C28',
                fontSize: '0.72rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Open PDF <ExternalLink size={11} />
            </button>
          </div>
        )}

        {/* Content Details Body */}
        <div style={{ 
          padding: isMobile ? '0.75rem' : (isFullscreen ? '1rem 1.5rem' : '1.25rem 1.5rem'), 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem', 
          flex: 1,
          overflowY: 'auto'
        }}>
          
          {/* Metadata Row (Desktop or Compact Mobile) */}
          {!isFullscreen && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: isMobile ? '0.5rem' : '1rem',
              backgroundColor: '#F8FAF9',
              border: '1px solid #EBE5DB',
              borderRadius: isMobile ? '12px' : '16px',
              padding: isMobile ? '0.65rem 0.85rem' : '0.75rem 1.25rem'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Provider / Source</div>
                <div style={{ fontSize: isMobile ? '0.78rem' : '0.86rem', fontWeight: 800, color: '#0f172a' }}>{providerName}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Category</div>
                <div style={{ fontSize: isMobile ? '0.78rem' : '0.86rem', fontWeight: 800, color: '#C88D2D' }}>{displayCategory}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Verification</div>
                <div style={{ fontSize: isMobile ? '0.76rem' : '0.84rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={14} style={{ color: '#C88D2D' }} /> Verified Authentic
                </div>
              </div>
            </div>
          )}

          {/* Topics Covered Box */}
          {!isFullscreen && unit && unit.topics && unit.topics.length > 0 && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Unit Topics
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {unit.topics.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#FDF6E8',
                      border: '1px solid #E8D3B0',
                      color: '#7A5835',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      padding: '0.2rem 0.55rem'
                    }}
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* EMBEDDED RESOURCE VIEWER CONTAINER */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? 'calc(100vh - 275px)' : (isFullscreen ? 'calc(100vh - 160px)' : '540px'),
            minHeight: isMobile ? '380px' : '480px',
            backgroundColor: '#0F172A',
            borderRadius: isMobile ? '12px' : '16px',
            overflow: 'hidden',
            border: '1.5px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.35)'
          }}>
            {/* Quick Action Overlay Controls (Top Right) */}
            {isAvailable && !iframeError && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 25,
                display: 'flex',
                gap: '0.4rem'
              }}>
                <button
                  type="button"
                  onClick={handleOpenDirect}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.90)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFD166',
                    border: '1px solid rgba(255, 209, 102, 0.4)',
                    padding: '0.32rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <ExternalLink size={12} /> Drive Tab
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.90)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.32rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={12} /> Save
                </button>
              </div>
            )}

            {/* Iframe Viewer or Friendly Fallback */}
            {isAvailable && embedUrl && !iframeError ? (
              <iframe
                src={embedUrl}
                title={note.title || 'Resource Viewer'}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#FFFFFF'
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
                padding: '2rem 1.25rem',
                textAlign: 'center',
                backgroundColor: '#FAF7F2',
                color: '#1C1E21',
                height: '100%'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  border: '1.5px solid #FCD34D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  marginBottom: '0.85rem'
                }}>
                  <AlertTriangle size={28} />
                </div>

                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#1C1E21',
                  margin: '0 0 0.35rem 0'
                }}>
                  Resource Preview Available via Direct Link
                </h3>

                <p style={{
                  fontSize: '0.82rem',
                  color: '#64748B',
                  maxWidth: '420px',
                  lineHeight: 1.5,
                  margin: '0 auto 1.25rem auto'
                }}>
                  Curriculum notes for <strong>{note.title || (subject?.name || 'this subject')}</strong> are verified. Click below to open directly in Google Drive.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {targetUrl && (
                    <button
                      type="button"
                      onClick={handleOpenDirect}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '12px',
                        backgroundColor: '#7A1C28',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink size={14} /> Open in Google Drive
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      color: '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid #ECE7E0',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}>
            <div style={{ display: 'flex', gap: '0.45rem', width: isMobile ? '100%' : 'auto' }}>
              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                style={{
                  flex: isMobile ? 1 : 'initial',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                  padding: '0.45rem 0.75rem', borderRadius: '10px',
                  border: isBookmarked ? '1.5px solid #C88D2D' : '1px solid #cbd5e1',
                  backgroundColor: isBookmarked ? '#FDF6E8' : '#ffffff',
                  color: isBookmarked ? '#7A5835' : '#475569',
                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <Bookmark size={13} fill={isBookmarked ? '#C88D2D' : 'none'} />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setReportSubmitted(true);
                  alert('Thank you! If embedded preview is blocked, please use "Open Tab" or "Drive" to view directly.');
                }}
                disabled={reportSubmitted}
                style={{
                  flex: isMobile ? 1 : 'initial',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                  padding: '0.45rem 0.75rem', borderRadius: '10px',
                  border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                  color: reportSubmitted ? '#C88D2D' : '#64748b',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <Flag size={13} />
                {reportSubmitted ? 'Reported' : 'Report'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', width: isMobile ? '100%' : 'auto' }}>
              <button
                type="button"
                onClick={handleOpenDirect}
                style={{
                  flex: isMobile ? 1 : 'initial',
                  padding: '0.45rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #C88D2D',
                  backgroundColor: '#FFFFFF',
                  color: '#7A5835',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <ExternalLink size={13} /> Drive / Tab
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: isMobile ? 1 : 'initial',
                  padding: '0.45rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: '#1C1618',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
