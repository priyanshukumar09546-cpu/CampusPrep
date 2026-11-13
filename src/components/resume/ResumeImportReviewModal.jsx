// src/components/resume/ResumeImportReviewModal.jsx
import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase,
  Code2,
  Award
} from 'lucide-react';

export default function ResumeImportReviewModal({
  isOpen,
  onClose,
  extractedData,
  fileName,
  onApplyImport
}) {
  const [data, setData] = useState(extractedData || {});

  React.useEffect(() => {
    if (extractedData) setData(extractedData);
  }, [extractedData]);

  if (!isOpen || !extractedData) return null;

  const personal = data.personal || data.personalDetails || {};
  const education = Array.isArray(data.education) ? data.education : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const tech = data.technicalSkills || {};

  const handleApply = (asNewResume = false) => {
    if (onApplyImport) {
      onApplyImport(data, asNewResume);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(12, 10, 11, 0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 10600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '840px',
        width: '100%',
        maxHeight: '92vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1.5px solid #EDE5D6',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: '#1C1618',
          color: '#ffffff',
          padding: '1.1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#FFD166', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Extracted Resume Data Review
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: '0.15rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Sparkles size={18} color="#FFD166" />
              <span>Review Extracted Content: {fileName || 'Uploaded Resume'}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
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

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            fontSize: '0.80rem',
            color: '#1E40AF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>Information extracted successfully. Review and correct any fields below before loading into the editor.</span>
          </div>

          {/* Personal Information */}
          <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.15rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} color="#781416" /> Personal Information
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#66615B' }}>Full Name</label>
                <input
                  type="text"
                  value={personal.fullName || ''}
                  onChange={e => setData(prev => ({ ...prev, personal: { ...personal, fullName: e.target.value } }))}
                  style={{ width: '100%', padding: '0.4rem 0.65rem', borderRadius: '8px', border: '1px solid #D6CBB8', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#66615B' }}>Email</label>
                <input
                  type="text"
                  value={personal.email || ''}
                  onChange={e => setData(prev => ({ ...prev, personal: { ...personal, email: e.target.value } }))}
                  style={{ width: '100%', padding: '0.4rem 0.65rem', borderRadius: '8px', border: '1px solid #D6CBB8', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#66615B' }}>Phone</label>
                <input
                  type="text"
                  value={personal.phone || ''}
                  onChange={e => setData(prev => ({ ...prev, personal: { ...personal, phone: e.target.value } }))}
                  style={{ width: '100%', padding: '0.4rem 0.65rem', borderRadius: '8px', border: '1px solid #D6CBB8', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#66615B' }}>LinkedIn URL</label>
                <input
                  type="text"
                  value={personal.linkedinUrl || ''}
                  onChange={e => setData(prev => ({ ...prev, personal: { ...personal, linkedinUrl: e.target.value } }))}
                  style={{ width: '100%', padding: '0.4rem 0.65rem', borderRadius: '8px', border: '1px solid #D6CBB8', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Extracted Skills */}
          <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.15rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Code2 size={15} color="#781416" /> Technical Skills Identified
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {[
                ...(tech.programmingLanguages || []),
                ...(tech.frameworks || []),
                ...(tech.developerTools || []),
                ...(tech.databases || [])
              ].map((s, idx) => (
                <span key={idx} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D6CBB8',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#292524'
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Education Entries */}
          {education.length > 0 && (
            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.15rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GraduationCap size={15} color="#781416" /> Education Records ({education.length})
              </div>
              {education.map((ed, idx) => (
                <div key={idx} style={{ fontSize: '0.78rem', color: '#44403C', marginBottom: '0.35rem' }}>
                  <strong>{ed.degree}</strong> — {ed.institution} ({ed.duration || ed.year || ''}) {ed.cgpa ? `[${ed.cgpa}]` : ''}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.15rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={15} color="#781416" /> Projects ({projects.length})
              </div>
              {projects.map((pr, idx) => (
                <div key={idx} style={{ fontSize: '0.78rem', color: '#44403C', marginBottom: '0.35rem' }}>
                  <strong>{pr.title}</strong>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{
          backgroundColor: '#FAF7F2',
          borderTop: '1px solid #EDE5D6',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          flexShrink: 0
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D6CBB8',
              borderRadius: '10px',
              padding: '0.55rem 1.15rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleApply(false)}
            style={{
              backgroundColor: '#FAF5ED',
              border: '1.5px solid #781416',
              color: '#781416',
              borderRadius: '10px',
              padding: '0.55rem 1.15rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Update Current Resume
          </button>

          <button
            type="button"
            onClick={() => handleApply(true)}
            style={{
              backgroundColor: '#781416',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '0.55rem 1.35rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Load as New Resume</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
