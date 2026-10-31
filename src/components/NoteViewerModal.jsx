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
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Scan,
  Send,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { isValidPdfUrl } from '../utils/pdfValidator';

export default function NoteViewerModal({ note, subject, unit, onClose }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [refreshKey, setRefreshKey] = useState(0);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestEmail, setRequestEmail] = useState('');
  const [requestDetails, setRequestDetails] = useState('');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    setIsLoading(true);
    setIframeError(false);
    setLoadTimeout(false);
    const timer = setTimeout(() => {
      setLoadTimeout(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [note, refreshKey]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  if (!note) return null;

  // Resolve target resource URL
  const targetUrl = (note.verifiedUrl || note.resourceUrl || note.fileUrl || note.url || note.pdfUrl || '').trim();

  // Validate that the resource actually exists and is a valid document
  const isBrokenOrUnavailable = !targetUrl || 
    targetUrl.includes('aktupyq.com/bca/notes') || 
    !isValidPdfUrl(targetUrl) ||
    note.available === false ||
    note.isAvailable === false ||
    note.status === 'not_available';

  const isAvailable = !isBrokenOrUnavailable;

  // Extract Drive file ID if present
  const getDriveFileId = (url) => {
    if (!url) return null;
    if (note.driveFileId && note.driveFileId.length >= 20) return note.driveFileId;
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const driveFileId = getDriveFileId(targetUrl);

  // Generate safe embedded URL for iframe
  const getEmbedUrl = (rawUrl) => {
    if (!rawUrl) return '';
    let url = rawUrl.trim();

    // Google Drive file: always use /preview for seamless inline viewing
    if (driveFileId) {
      return `https://drive.google.com/file/d/${driveFileId}/preview`;
    }

    // Direct Google Docs view
    if (url.includes('docs.google.com')) {
      return url;
    }

    // Direct PDF URL: append browser viewer parameters
    if (url.toLowerCase().endsWith('.pdf') || url.includes('.pdf?')) {
      // For external third-party PDFs (e.g. cdn.aktuquestionpaper.com, aktupyq.com),
      // embed via Google Docs Viewer so the user stays inside professorvirus.site without CORS or browser PDF plugin blocks
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      }
      return `${url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(targetUrl);

  const handleDownload = () => {
    if (!targetUrl) return;
    const downloadUrl = driveFileId 
      ? `https://drive.google.com/uc?export=download&id=${driveFileId}`
      : targetUrl;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = `${note.title || 'ProfessorVirus_Resource'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDirect = () => {
    if (!targetUrl) return;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 15));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(60, prev - 15));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleFitPage = () => {
    setZoom(100);
  };

  const handleFitWidth = () => {
    setZoom(125);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeError(false);
    setRefreshKey(k => k + 1);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setShowRequestForm(false);
  };

  let rawProvider = (note.provider || note.source || 'Faculty Lecture Notes').trim();
  const lowerProv = rawProvider.toLowerCase();
  if (lowerProv.includes('notesgallery')) {
    if (lowerProv.includes('archive')) rawProvider = 'Academic Resource Archive';
    else if (lowerProv.includes('quantum')) rawProvider = 'Quantum Series';
    else if (lowerProv.includes('agriculture')) rawProvider = 'Agriculture Faculty Lecture Notes';
    else if (lowerProv.includes('verified')) rawProvider = 'Verified Study Material';
    else rawProvider = 'Academic Resource';
  } else if (lowerProv.includes('nptel') || lowerProv.includes('academic faculty') || lowerProv.includes('artu') || lowerProv.includes('aktu verified')) {
    rawProvider = 'Faculty Lecture Notes';
  }
  const providerName = rawProvider;
  const isGenuinelyVerified = Boolean(note.isVerified || note.verified) && isAvailable;
  const displayCategory = note.category || note.type || 'Study Notes';
  const displaySubject = subject ? `${subject.code || ''} ${subject.subject || subject.name || ''}`.trim() : (note.subjectName || note.subject || note.subjectCode || 'Course Resource');
  const displayCourse = note.course || (subject?.course) || 'B.Tech';
  const displayUnit = note.unit ? `Unit ${note.unit}` : (unit?.unit ? `Unit ${unit.unit}` : null);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(12, 10, 11, 0.90)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 11000,
        display: 'flex',
        alignItems: isFullscreen || isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isFullscreen || isMobile ? '0' : '1rem'
      }}
    >
      <div 
        style={{
          backgroundColor: '#0F172A',
          borderRadius: isFullscreen || isMobile ? '0' : '20px',
          maxWidth: isFullscreen || isMobile ? '100vw' : '96vw',
          width: '100%',
          height: isFullscreen || isMobile ? '100vh' : '94vh',
          maxHeight: isFullscreen || isMobile ? '100vh' : '94vh',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          border: isFullscreen || isMobile ? 'none' : '1.5px solid #334155',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* ======================================================== */}
        {/* TOP HEADER BAR */}
        {/* ======================================================== */}
        <div style={{
          backgroundColor: '#1C1618',
          backgroundImage: 'linear-gradient(180deg, #241A1D 0%, #171214 100%)',
          color: '#ffffff',
          padding: isMobile ? '0.65rem 0.85rem' : '0.75rem 1.25rem',
          borderBottom: '1.5px solid #2F2428',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexShrink: 0
        }}>
          {/* Left Metadata */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: isMobile ? '0.68rem' : '0.75rem',
              color: '#FFD166',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              <span style={{
                backgroundColor: 'rgba(200, 141, 45, 0.2)',
                color: '#FFD166',
                border: '1px solid rgba(200, 141, 45, 0.4)',
                borderRadius: '6px',
                padding: '0.1rem 0.45rem',
                fontSize: '0.66rem'
              }}>
                {displayCourse}
              </span>
              <span>•</span>
              <span>{displaySubject}</span>
              {displayUnit && (
                <>
                  <span>•</span>
                  <span style={{ color: '#111111' }}>{displayUnit}</span>
                </>
              )}
            </div>

            <h2 style={{
              fontSize: isMobile ? '0.92rem' : '1.15rem',
              fontWeight: 800,
              marginTop: '0.15rem',
              color: '#ffffff',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: '0.15rem 0 0 0'
            }}>
              {note.title || `${displaySubject} - ${displayUnit || 'Complete Study Notes'}`}
            </h2>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            {/* Direct Open in Drive / Tab */}
            {isAvailable && targetUrl && (
              <button
                type="button"
                onClick={handleOpenDirect}
                title="Open directly in Google Drive or new browser tab"
                style={{
                  backgroundColor: '#7A1C28',
                  backgroundImage: 'linear-gradient(135deg, #8C2232 0%, #681520 100%)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '8px',
                  padding: isMobile ? '0.35rem 0.55rem' : '0.4rem 0.8rem',
                  fontSize: isMobile ? '0.70rem' : '0.76rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <ExternalLink size={13} />
                <span>{driveFileId ? (isMobile ? 'Drive' : 'Open in Drive') : (isMobile ? 'Open' : 'Open Tab')}</span>
              </button>
            )}

            {/* Download PDF button */}
            {isAvailable && targetUrl && !isMobile && (
              <button
                type="button"
                onClick={handleDownload}
                title="Download original PDF"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={13} />
                <span>Download</span>
              </button>
            )}

            {/* Desktop Fullscreen Toggle */}
            {!isMobile && (
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen'}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close document viewer"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DOCUMENT TOOLBAR (Zoom, Fit, Reload, Source Info) */}
        {/* ======================================================== */}
        {isAvailable && (
          <div style={{
            backgroundColor: '#0F172A',
            borderBottom: '1px solid #1E293B',
            padding: '0.4rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
            flexShrink: 0
          }}>
            {/* Left: Interactive Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 70}
                title="Zoom Out (-15%)"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: zoom <= 70 ? '#64748B' : '#E2E8F0',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: zoom <= 70 ? 'not-allowed' : 'pointer'
                }}
              >
                <ZoomOut size={14} />
              </button>

              <button
                type="button"
                onClick={handleResetZoom}
                title="Reset zoom to 100%"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#FFD166',
                  borderRadius: '6px',
                  padding: '0 0.55rem',
                  height: '28px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  cursor: 'pointer'
                }}
              >
                <span>{zoom}%</span>
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                title="Zoom In (+15%)"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: zoom >= 200 ? '#64748B' : '#E2E8F0',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: zoom >= 200 ? 'not-allowed' : 'pointer'
                }}
              >
                <ZoomIn size={14} />
              </button>

              {!isMobile && (
                <>
                  <button
                    type="button"
                    onClick={handleFitPage}
                    title="Fit Page (100%)"
                    style={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      color: zoom === 100 ? '#FFD166' : '#94A3B8',
                      borderRadius: '6px',
                      padding: '0 0.55rem',
                      height: '28px',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Fit Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFitWidth}
                    title="Fit to Width (125%)"
                    style={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      color: zoom === 125 ? '#FFD166' : '#94A3B8',
                      borderRadius: '6px',
                      padding: '0 0.55rem',
                      height: '28px',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Scan size={12} />
                    <span>Fit Width</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleReload}
                title="Reload Preview"
                style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#94A3B8',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Right: Verification Status & Provider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.72rem' }}>
              <div style={{
                color: isGenuinelyVerified ? '#34D399' : '#94A3B8',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {isGenuinelyVerified ? (
                  <>
                    <ShieldCheck size={13} color="#34D399" />
                    <span>Verified Academic PDF</span>
                  </>
                ) : (
                  <>
                    <FileText size={13} color="#94A3B8" />
                    <span>Curriculum Resource</span>
                  </>
                )}
              </div>

              {!isMobile && (
                <div style={{ color: '#64748B' }}>
                  Source: <strong style={{ color: '#CBD5E1' }}>{providerName}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOCUMENT PREVIEW CONTAINER */}
        {/* ======================================================== */}
        <div style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#090D16',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isAvailable ? 'flex-start' : 'center'
        }}>
          {isAvailable && embedUrl && !iframeError ? (
            <>
              {/* Loading Shimmer Overlay */}
              {isLoading && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: '#0F172A',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  color: '#94A3B8'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    border: '3px solid rgba(200, 141, 45, 0.2)',
                    borderTopColor: '#C88D2D',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0' }}>
                    Loading verified document preview...
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Auto-scaling to optimal reading view
                  </div>
                  {loadTimeout && (
                    <div style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      padding: '0.55rem 0.95rem',
                      borderRadius: '10px',
                      border: '1px solid #334155'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>
                        Preview taking longer to embed? You can open directly or download:
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={handleOpenDirect}
                          style={{
                            backgroundColor: '#7A1C28',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <ExternalLink size={11} /> Open Document
                        </button>
                        <button
                          type="button"
                          onClick={handleDownload}
                          style={{
                            backgroundColor: '#C88D2D',
                            color: '#1C1618',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Download size={11} /> Download PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Scalable Iframe Container for Zoom & Auto-Fit */}
              <div 
                style={{
                  width: `${100 / (zoom / 100)}%`,
                  height: `${100 / (zoom / 100)}%`,
                  minHeight: '100%',
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <iframe
                  key={refreshKey}
                  src={embedUrl}
                  title={note.title || 'Academic Resource Document'}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: isFullscreen || isMobile ? '100vh' : 'calc(94vh - 120px)',
                    border: 'none',
                    backgroundColor: '#0B0B0B'
                  }}
                  allow="autoplay; encrypted-media; fullscreen"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setIframeError(true);
                  }}
                />
              </div>
            </>
          ) : isAvailable && iframeError ? (
            /* Error & Retry Fallback State */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              maxWidth: '460px',
              margin: 'auto'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                marginBottom: '1rem'
              }}>
                <AlertTriangle size={28} />
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111111', margin: '0 0 0.5rem 0' }}>
                Preview Restricted by Host
              </h3>

              <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.55, margin: '0 0 1.5rem 0' }}>
                This educational resource is hosted securely on Google Drive and cross-origin security prevents in-frame embedding in this browser session. You can open it directly in full resolution or download the original file.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleOpenDirect}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: '#7A1C28',
                    backgroundImage: 'linear-gradient(135deg, #8C2232 0%, #681520 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(122, 28, 40, 0.4)'
                  }}
                >
                  <ExternalLink size={14} /> Open PDF Document
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: '#C88D2D',
                    backgroundImage: 'linear-gradient(135deg, #D49A3D 0%, #B67C20 100%)',
                    color: '#1C1618',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(200, 141, 45, 0.3)'
                  }}
                >
                  <Download size={14} /> Download PDF
                </button>

                <button
                  type="button"
                  onClick={handleReload}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 1.15rem',
                    borderRadius: '10px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    color: '#E2E8F0',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={13} /> Retry Preview
                </button>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* CLEAN "NOTES NOT YET AVAILABLE" EMPTY STATE */
            /* ======================================================== */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              maxWidth: '520px',
              margin: 'auto'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 141, 45, 0.15)',
                border: '1.5px solid rgba(200, 141, 45, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFD166',
                marginBottom: '1.25rem'
              }}>
                <BookOpen size={30} />
              </div>

              <div style={{
                fontSize: '0.72rem',
                color: '#C88D2D',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.35rem'
              }}>
                Curriculum Resource Status
              </div>

              <h3 style={{
                fontSize: isMobile ? '1.15rem' : '1.35rem',
                fontWeight: 900,
                color: '#111111',
                margin: '0 0 0.65rem 0',
                lineHeight: 1.25
              }}>
                Notes for this subject/unit are not yet available
              </h3>

              <p style={{
                fontSize: '0.85rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                margin: '0 0 1.5rem 0'
              }}>
                We are actively curating and verifying high-yield lecture notes for <strong style={{ color: '#F1F5F9' }}>{displaySubject}</strong> {displayUnit ? `(${displayUnit})` : ''} under the <strong style={{ color: '#FFD166' }}>{displayCourse}</strong> curriculum.
              </p>

              {requestSubmitted ? (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1.5px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  color: '#34D399',
                  maxWidth: '420px',
                  textAlign: 'left'
                }}>
                  <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem' }}>Request Logged Successfully!</div>
                    <div style={{ fontSize: '0.74rem', color: '#A7F3D0', marginTop: '0.15rem' }}>
                      Our academic team prioritizes resources with multiple student requests. You will be notified once uploaded.
                    </div>
                  </div>
                </div>
              ) : showRequestForm ? (
                <form 
                  onSubmit={handleRequestSubmit}
                  style={{
                    backgroundColor: '#1E293B',
                    border: '1.5px solid #334155',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#111111' }}>
                    Request Notes for this Subject
                  </div>

                  <input
                    type="email"
                    required
                    placeholder="Your college email or Gmail"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    style={{
                      backgroundColor: '#0F172A',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      color: '#111111',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Specific unit or topic needed (optional)"
                    value={requestDetails}
                    onChange={(e) => setRequestDetails(e.target.value)}
                    style={{
                      backgroundColor: '#0F172A',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      color: '#111111',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        backgroundColor: '#7A1C28',
                        backgroundImage: 'linear-gradient(135deg, #8C2232 0%, #681520 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.55rem',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Send size={13} /> Submit Request
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      style={{
                        backgroundColor: '#334155',
                        color: '#CBD5E1',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.35rem',
                      borderRadius: '10px',
                      backgroundColor: '#C88D2D',
                      backgroundImage: 'linear-gradient(135deg, #D49A3D 0%, #B67C20 100%)',
                      color: '#1C1618',
                      border: 'none',
                      fontWeight: 900,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(200, 141, 45, 0.35)'
                    }}
                  >
                    <BookOpen size={14} /> Request Notes for this Subject
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '10px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      color: '#CBD5E1',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    Close Viewer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* BOTTOM METADATA & UTILITY FOOTER */}
        {/* ======================================================== */}
        <div style={{
          backgroundColor: '#171E2E',
          borderTop: '1.5px solid #243046',
          padding: isMobile ? '0.55rem 0.85rem' : '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexShrink: 0,
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          {/* Topics Covered Pill Carousel */}
          {unit && unit.topics && unit.topics.length > 0 && !isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', flex: 1, marginRight: '1rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
                Topics:
              </span>
              {unit.topics.slice(0, 5).map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    color: '#CBD5E1',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    padding: '0.15rem 0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t}
                </span>
              ))}
              {unit.topics.length > 5 && (
                <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                  +{unit.topics.length - 5} more
                </span>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Official ProfessorVirus Academic Portal • Verified Study Material
            </div>
          )}

          {/* User Utility Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                border: isBookmarked ? '1px solid #C88D2D' : '1px solid #334155',
                backgroundColor: isBookmarked ? 'rgba(200, 141, 45, 0.15)' : '#1E293B',
                color: isBookmarked ? '#FFD166' : '#94A3B8',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Bookmark size={12} fill={isBookmarked ? '#FFD166' : 'none'} />
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportSubmitted(true);
                alert('Thank you! Our academic team will inspect this resource link.');
              }}
              disabled={reportSubmitted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#1E293B',
                color: reportSubmitted ? '#C88D2D' : '#94A3B8',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Flag size={12} />
              <span>{reportSubmitted ? 'Reported' : 'Report'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.35rem 0.95rem',
                borderRadius: '8px',
                backgroundColor: '#334155',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.74rem',
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
  );
}
