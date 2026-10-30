import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  BookOpen,
  RefreshCw,
  Layers,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import SYLLABUS_CACHE_MAP from '../data/syllabusCacheMap.json';

export default function SyllabusPdfViewerModal({ syllabus, onClose }) {
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'units'
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
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

  const rawPdfUrl = syllabus?.officialPdfUrl;
  const officialSourceUrl = syllabus?.officialSourceUrl || 'https://aktu.ac.in/syllabus.html';

  // Check if this syllabus URL is pre-cached statically
  const cachedEntry = useMemo(() => {
    if (!rawPdfUrl) return null;
    return SYLLABUS_CACHE_MAP[rawPdfUrl] || null;
  }, [rawPdfUrl]);

  // Determine if this is a subject-level entry or a comprehensive curriculum document
  const isSubjectEntry = Boolean(
    syllabus?.subjectCode && 
    !syllabus?.isComprehensive && 
    !syllabus?.subjectCode?.toLowerCase().includes('curriculum') &&
    !syllabus?.subjectName?.toLowerCase().includes('curriculum')
  );

  // Verify and resolve PDF URL with multi-tier fallback
  useEffect(() => {
    let isCancelled = false;

    async function resolvePdf() {
      if (!rawPdfUrl) {
        setIsLoading(false);
        setLoadError(false);
        setResolvedPdfUrl(null);
        return;
      }

      setIsLoading(true);
      setLoadError(false);
      setErrorMessage('');

      // Tier 1: Statically pre-cached asset on global CDN (Fastest, zero timeout risk)
      if (cachedEntry?.publicPath) {
        setResolvedPdfUrl(cachedEntry.publicPath);
        setIsLoading(false);
        return;
      }

      // Tier 2: Check proxy with Range header (Preflight check to prevent broken iframe)
      const proxyUrl = `/api/syllabus/pdf-proxy?url=${encodeURIComponent(rawPdfUrl)}`;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const resp = await fetch(proxyUrl, {
          method: 'GET',
          headers: { 'Range': 'bytes=0-1024' },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (isCancelled) return;

        const contentType = resp.headers.get('content-type') || '';
        const isProxyError = resp.headers.get('x-pdf-proxy-error') === 'true';

        if (resp.ok && contentType.includes('application/pdf') && !isProxyError) {
          // Valid verified PDF stream!
          setResolvedPdfUrl(proxyUrl);
          setIsLoading(false);
        } else {
          // Upstream error or non-PDF returned
          let errMsg = 'AKTU official portal (fms.aktu.ac.in) is slow or unreachable from server.';
          try {
            const data = await resp.json();
            if (data.error) errMsg = data.error;
          } catch (_) {}

          setLoadError(true);
          setErrorMessage(errMsg);
          setIsLoading(false);
        }
      } catch (err) {
        if (isCancelled) return;
        setLoadError(true);
        setErrorMessage('AKTU official server timed out or is temporarily unreachable.');
        setIsLoading(false);
      }
    }

    resolvePdf();

    return () => {
      isCancelled = true;
    };
  }, [rawPdfUrl, cachedEntry, retryCount]);

  if (!syllabus) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRetry = () => {
    setRetryCount(c => c + 1);
  };

  const handleDownload = () => {
    const downloadUrl = resolvedPdfUrl || rawPdfUrl;
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = `${(syllabus.subjectName || 'AKTU_Syllabus').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const units = Array.isArray(syllabus.units) ? syllabus.units : [];

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
          maxWidth: isFullscreen ? '100vw' : '1120px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
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

                {cachedEntry && (
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    backgroundColor: '#F0FDF4',
                    color: '#15803D',
                    border: '1px solid #BBF7D0',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    <CheckCircle2 size={11} /> Verified Local Fast-Load
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#1F2421',
                  lineHeight: 1.3
                }}>
                  {syllabus.subjectName}
                </h3>

                {isSubjectEntry && (
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#8A5D00',
                    fontWeight: 600,
                    backgroundColor: '#FEF9EE',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                    border: '1px dashed #E8D3B0'
                  }}>
                    Includes in Official {syllabus.branch} Curriculum Document
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar & Segmented Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* View Mode Segmented Switcher */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#EDE8DF',
              padding: '0.2rem',
              borderRadius: '9px',
              border: '1px solid #DFD7CA'
            }}>
              <button
                onClick={() => setActiveTab('pdf')}
                style={{
                  backgroundColor: activeTab === 'pdf' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'pdf' ? '#781416' : '#64748B',
                  fontWeight: activeTab === 'pdf' ? 800 : 600,
                  border: 'none',
                  borderRadius: '7px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: activeTab === 'pdf' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <FileText size={13} />
                <span>Official PDF</span>
              </button>

              <button
                onClick={() => setActiveTab('units')}
                style={{
                  backgroundColor: activeTab === 'units' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'units' ? '#781416' : '#64748B',
                  fontWeight: activeTab === 'units' ? 800 : 600,
                  border: 'none',
                  borderRadius: '7px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: activeTab === 'units' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Layers size={13} />
                <span>Unit Topics {units.length > 0 ? `(${units.length})` : ''}</span>
              </button>
            </div>

            {/* Zoom Controls (Active in PDF mode) */}
            {activeTab === 'pdf' && (
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
            )}

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
                <span>Download</span>
              </button>
            )}

            {/* Open Direct Official University Source */}
            <a
              href={rawPdfUrl || officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open direct official AKTU portal source in new tab"
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
              <span>AKTU Source</span>
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

        {/* CLARIFICATION BANNER FOR CURRICULUM DOCUMENTS */}
        {isSubjectEntry && (
          <div style={{
            backgroundColor: '#FFFBEB',
            borderBottom: '1px solid #FDE68A',
            padding: '0.45rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.78rem',
            color: '#92400E'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Info size={14} color="#B45309" />
              <span>
                <strong>Official AKTU Curriculum Document:</strong> This document contains the complete curriculum & evaluation scheme for {syllabus.branch} ({syllabus.year || syllabus.semester}), which includes <strong>{syllabus.subjectName} ({syllabus.subjectCode})</strong>.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('units')}
              style={{
                background: 'none',
                border: 'none',
                color: '#781416',
                fontWeight: 800,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: '0.78rem'
              }}
            >
              Jump to Unit Breakdown →
            </button>
          </div>
        )}

        {/* VIEWER CONTENT AREA */}
        <div style={{
          flex: 1,
          backgroundColor: activeTab === 'pdf' ? '#525659' : '#FAF7F2',
          position: 'relative',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: activeTab === 'pdf' ? 'center' : 'flex-start'
        }}>
          {/* TAB 1: PDF VIEWER */}
          {activeTab === 'pdf' && (
            <>
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
                      Streaming verified syllabus document from university archive
                    </div>
                  </div>
                </div>
              )}

              {/* State A: No PDF URL Configured */}
              {!rawPdfUrl && !isLoading && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '2.5rem',
                  textAlign: 'center',
                  maxWidth: '520px',
                  margin: '2rem auto',
                  border: '1.5px solid #E8E2D5',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}>
                  <AlertCircle size={44} color="#C88D2D" style={{ margin: '0 auto 1rem auto' }} />
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem' }}>
                    Official syllabus PDF not published yet
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    AKTU has not published a standalone PDF for this specific entry yet. You can inspect the unit topics below or check the university portal.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setActiveTab('units')}
                      style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '9999px',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      View Unit Topics
                    </button>
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
                        backgroundColor: '#FEF9EE',
                        border: '1.5px solid #E8D3B0',
                        color: '#8A5D00',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <span>Visit AKTU Portal</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              {/* State B: Load Error / Server Timeout Fallback (NEVER renders raw JSON in iframe) */}
              {loadError && !isLoading && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  maxWidth: '560px',
                  margin: '2rem auto',
                  border: '1.5px solid #FCA5A5',
                  boxShadow: '0 8px 25px rgba(120,20,22,0.12)'
                }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF2F2',
                    color: '#781416',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <AlertCircle size={28} />
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.4rem' }}>
                    AKTU University Portal Server Unreachable
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    The official AKTU server (<code>fms.aktu.ac.in</code>) is slow or blocking remote connections.
                    You can open the verified document directly in your browser or explore the full unit syllabus below.
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.25rem'
                  }}>
                    <a
                      href={rawPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '9999px',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <span>Open Direct AKTU Link</span>
                      <ExternalLink size={14} />
                    </a>

                    <button
                      onClick={handleDownload}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '9999px',
                        backgroundColor: '#FEF9EE',
                        border: '1.5px solid #E8D3B0',
                        color: '#8A5D00',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('units')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 1.15rem',
                        borderRadius: '9999px',
                        backgroundColor: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Layers size={14} />
                      <span>View Unit Topics</span>
                    </button>

                    <button
                      onClick={handleRetry}
                      title="Retry fetching from server"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '9999px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        color: '#64748B',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <RefreshCw size={13} />
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              )}

              {/* State C: Successfully Resolved PDF Preview */}
              {resolvedPdfUrl && !loadError && (
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
                    src={`${resolvedPdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1`}
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

              {/* Fallback Banner at Bottom */}
              {rawPdfUrl && !loadError && (
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
                  <span style={{ color: '#CBD5E1' }}>•</span>
                  <button
                    onClick={() => setActiveTab('units')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#781416',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Unit Topics
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: INTERACTIVE UNIT BREAKDOWN */}
          {activeTab === 'units' && (
            <div style={{
              width: '100%',
              maxWidth: '960px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              {/* Syllabus Info Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #E8D3B0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#781416', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Academic Syllabus Details
                  </div>
                  <h4 style={{ margin: '0.25rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#1F2421' }}>
                    {syllabus.subjectName}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    {syllabus.course} • {syllabus.branch} • {syllabus.semester} • Academic Session {syllabus.academicSession}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {syllabus.credits && (
                    <div style={{
                      backgroundColor: '#FEF9EE',
                      border: '1px solid #E8D3B0',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8A5D00', textTransform: 'uppercase' }}>Credits</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8A5D00' }}>{syllabus.credits}</div>
                    </div>
                  )}

                  {syllabus.evalScheme && (
                    <div style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Scheme</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>{syllabus.evalScheme}</div>
                    </div>
                  )}

                  {rawPdfUrl && (
                    <button
                      onClick={() => setActiveTab('pdf')}
                      style={{
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.6rem 1.1rem',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 6px rgba(120,20,22,0.2)'
                      }}
                    >
                      <FileText size={15} />
                      <span>View Official PDF</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Units List */}
              {units.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {units.map((unit, idx) => (
                    <div 
                      key={unit.unitNo || idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E8E2D5',
                        padding: '1.15rem 1.35rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          backgroundColor: '#781416',
                          color: '#FFFFFF',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          letterSpacing: '0.02em'
                        }}>
                          UNIT {unit.unitNo || idx + 1}
                        </span>
                        <h5 style={{
                          margin: 0,
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: '#1F2421'
                        }}>
                          {unit.title}
                        </h5>
                      </div>

                      <p style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: '#475569',
                        lineHeight: 1.6
                      }}>
                        {unit.topics}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E8E2D5',
                  padding: '2.5rem',
                  textAlign: 'center'
                }}>
                  <AlertCircle size={36} color="#8A5D00" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h5 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.35rem' }}>
                    Unit breakdown not available for this record
                  </h5>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1rem' }}>
                    Please view the complete official curriculum document via the PDF viewer tab.
                  </p>
                  <button
                    onClick={() => setActiveTab('pdf')}
                    style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Switch to Official PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
