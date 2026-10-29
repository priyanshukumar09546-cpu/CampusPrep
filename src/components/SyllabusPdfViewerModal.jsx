import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  Loader2,
  BookOpen
} from 'lucide-react';

export default function SyllabusPdfViewerModal({ syllabus, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

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

  if (!syllabus) return null;

  const rawPdfUrl = syllabus.officialPdfUrl;
  const officialSourceUrl = syllabus.officialSourceUrl || 'https://aktu.ac.in/syllabus.html';
  
  // Use backend proxy to ensure zero-CORS issues and fast server streaming, or direct URL fallback
  const proxyUrl = rawPdfUrl 
    ? `/api/syllabus/pdf-proxy?url=${encodeURIComponent(rawPdfUrl)}`
    : null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (!rawPdfUrl) return;
    const link = document.createElement('a');
    link.href = rawPdfUrl;
    link.target = '_blank';
    link.download = `${(syllabus.subjectName || 'AKTU_Syllabus').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isFullscreen ? '0' : '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={containerRef}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: isFullscreen ? '0' : '20px',
          width: isFullscreen ? '100vw' : '96%',
          maxWidth: isFullscreen ? '100vw' : '1100px',
          height: isFullscreen ? '100vh' : '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: isFullscreen ? 'none' : '1.5px solid #E8E2D5',
          overflow: 'hidden',
          transition: 'all 0.2s ease'
        }}
      >
        {/* HEADER BAR */}
        <div style={{
          backgroundColor: '#FAF7F2',
          borderBottom: '2px solid #E8D3B0',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          flexShrink: 0
        }}>
          {/* Document Title & Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '240px', flex: '1 1 auto' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FECACA',
              color: '#781416',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileText size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '9999px',
                  letterSpacing: '0.02em'
                }}>
                  {syllabus.course} • {syllabus.branch}
                </span>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#FEF9EE',
                  color: '#8A5D00',
                  border: '1px solid #E8D3B0',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <ShieldCheck size={12} color="#8A5D00" />
                  Official AKTU • {syllabus.academicSession}
                </span>

                {syllabus.subjectCode && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#64748B',
                    backgroundColor: '#F1F5F9',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    Code: {syllabus.subjectCode}
                  </span>
                )}
              </div>

              <h3 style={{
                margin: '0.2rem 0 0 0',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#1F2421',
                lineHeight: 1.3
              }}>
                {syllabus.subjectName}
              </h3>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {/* Zoom Controls */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E2D5',
              borderRadius: '8px',
              padding: '0.15rem'
            }}>
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.35rem 0.5rem',
                  cursor: 'pointer',
                  color: '#475569',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ZoomOut size={15} />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset Zoom"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.25rem 0.4rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#1F2421',
                  minWidth: '42px'
                }}
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.35rem 0.5rem',
                  cursor: 'pointer',
                  color: '#475569',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ZoomIn size={15} />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E2D5',
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span className="hidden-mobile">{isFullscreen ? 'Exit' : 'Full'}</span>
            </button>

            {/* Download PDF Button */}
            {rawPdfUrl && (
              <button
                onClick={handleDownload}
                title="Download Official Syllabus PDF"
                style={{
                  backgroundColor: '#FEF9EE',
                  border: '1.5px solid #E8D3B0',
                  color: '#8A5D00',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  transition: 'all 0.15s ease'
                }}
              >
                <Download size={15} />
                <span>Download PDF</span>
              </button>
            )}

            {/* Open Official Source */}
            <a
              href={rawPdfUrl || officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open direct university source in new tab"
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Official Source</span>
              <ExternalLink size={14} />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close Viewer (Esc)"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E2D5',
                color: '#64748B',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '0.2rem'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* VIEWER CONTENT AREA */}
        <div style={{
          flex: 1,
          backgroundColor: '#525659',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Loading Indicator */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              backgroundColor: '#FFFFFF',
              padding: '1.5rem 2.25rem',
              borderRadius: '16px',
              border: '1.5px solid #E8D3B0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.85rem'
            }}>
              <Loader2 size={36} color="#781416" className="animate-spin" />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1F2421' }}>
                  Loading Official AKTU Syllabus...
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Streaming verified document from university archive
                </div>
              </div>
            </div>
          )}

          {/* If No PDF Available */}
          {!rawPdfUrl ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '2.5rem',
              textAlign: 'center',
              maxWidth: '480px',
              border: '1.5px solid #E8E2D5',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              <AlertCircle size={44} color="#C88D2D" style={{ margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem' }}>
                Official syllabus PDF not available yet
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                The official standalone PDF for this specific syllabus entry has not yet been published by AKTU. 
                You can check the university syllabus portal directly or view available unit topics.
              </p>
              <a
                href={officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '9999px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>Visit AKTU Official Portal</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            /* Embedded PDF Frame with Zoom Support */
            <div 
              style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }}
            >
              <iframe
                src={`${proxyUrl || rawPdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1`}
                title={`${syllabus.subjectName} Official Syllabus`}
                width="100%"
                height="100%"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setLoadError(true);
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : 'none',
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease'
                }}
              />
            </div>
          )}

          {/* Fallback Banner for Embedded Browsers */}
          {rawPdfUrl && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #E8D3B0',
              borderRadius: '9999px',
              padding: '0.4rem 1.15rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.78rem',
              color: '#334155'
            }}>
              <span>Having trouble viewing the preview?</span>
              <a
                href={rawPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#781416',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>Open Direct AKTU Link</span>
                <ExternalLink size={12} />
              </a>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <button
                onClick={handleDownload}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8A5D00',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
