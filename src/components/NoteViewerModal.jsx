import React, { useState } from 'react';
import { X, ExternalLink, Download, Bookmark, Flag, Check, FileText, Share2, BookOpen } from 'lucide-react';

export default function NoteViewerModal({ note, subject, unit, onClose }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!note) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = note.fileUrl;
    link.target = '_blank';
    link.download = `${note.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDirect = () => {
    window.open(note.fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(12, 40, 28, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        maxWidth: '820px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        border: '1.5px solid #a7f3d0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Bar */}
        <div style={{
          backgroundColor: '#0c3829',
          color: '#ffffff',
          padding: '1.5rem 1.75rem',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {subject ? `${subject.code} • ${subject.subject}` : 'AKTU Resource'} • Unit {unit ? unit.unitNo : '1'}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginTop: '0.2rem', color: '#ffffff', lineHeight: 1.25 }}>
              {note.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
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

        {/* Content Details Body */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Metadata Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1rem 1.25rem'
          }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Uploaded By</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{note.author || 'CampusPrep Verified Faculty'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Published Date</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{note.date || '18 Sep 2026'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Document Type</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>{note.type || 'Unit-wise Notes'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Source Status</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={14} /> Verified Direct PDF
              </div>
            </div>
          </div>

          {/* Topics Covered Box */}
          {unit && unit.topics && (
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Syllabus Topics Covered in this Unit
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {unit.topics.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#e6f4ed',
                      border: '1px solid #a7f3d0',
                      color: '#0d5c3a',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      padding: '0.3rem 0.75rem'
                    }}
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PDF Viewer Placeholder / Frame */}
          <div style={{
            height: '320px',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            border: '2px solid #334155'
          }}>
            <FileText size={56} style={{ color: '#34d399', marginBottom: '0.85rem' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{note.title}</div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>AKTU B.Tech Verified PDF Document</div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={handleOpenDirect}
                className="btn-primary"
                style={{ backgroundColor: '#059669', padding: '0.65rem 1.4rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ExternalLink size={16} /> Open PDF in New Tab
              </button>

              <button
                onClick={handleDownload}
                className="btn-outline"
                style={{ borderColor: '#64748b', color: '#ffffff', padding: '0.65rem 1.4rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={16} /> Download File
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.5rem 0.9rem', borderRadius: '10px',
                  border: isBookmarked ? '1.5px solid #059669' : '1px solid #cbd5e1',
                  backgroundColor: isBookmarked ? '#e6f4ed' : '#ffffff',
                  color: isBookmarked ? '#0d5c3a' : '#475569',
                  fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <Bookmark size={15} fill={isBookmarked ? '#059669' : 'none'} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark Note'}
              </button>

              <button
                onClick={() => setReportSubmitted(true)}
                disabled={reportSubmitted}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.5rem 0.9rem', borderRadius: '10px',
                  border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                  color: reportSubmitted ? '#059669' : '#64748b',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <Flag size={15} />
                {reportSubmitted ? 'Report Submitted' : 'Report Issue'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ padding: '0.55rem 1.5rem', backgroundColor: '#0c3829', fontSize: '0.85rem' }}
            >
              Close Viewer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
