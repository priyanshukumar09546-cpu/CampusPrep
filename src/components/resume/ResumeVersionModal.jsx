// src/components/resume/ResumeVersionModal.jsx
import React, { useState } from 'react';
import {
  X,
  History,
  RotateCcw,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import API_URL from '../../config/api';

export default function ResumeVersionModal({
  isOpen,
  onClose,
  resume,
  onRestoreVersion
}) {
  const [restoringVer, setRestoringVer] = useState(null);

  if (!isOpen || !resume) return null;

  const versions = Array.isArray(resume.versions) ? resume.versions : [];

  const handleRestore = async (versionNumber) => {
    if (!window.confirm(`Are you sure you want to restore Version ${versionNumber}? Your current editor state will be updated to this snapshot.`)) return;

    setRestoringVer(versionNumber);
    try {
      const resumeId = resume.id || resume._id;
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(`${API_URL}/api/resumes/${resumeId}/restore-version/${versionNumber}`, {
        method: 'POST',
        headers
      });
      const data = await res.json();
      if (data.success && data.resume) {
        if (onRestoreVersion) {
          onRestoreVersion(data.resume);
        }
        onClose();
      } else {
        alert(data.message || 'Could not restore version.');
      }
    } catch (err) {
      alert('Error communicating with server.');
    } finally {
      setRestoringVer(null);
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
        maxWidth: '680px',
        width: '100%',
        maxHeight: '85vh',
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
              Historical Snapshots & Backups
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: '0.15rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <History size={18} color="#FFD166" />
              <span>Version History: {resume.title || 'My Resume'}</span>
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

        {/* Versions List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {versions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#78716C' }}>
              <Clock size={36} style={{ color: '#D6CBB8', margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F2421' }}>No Version Snapshots Yet</h4>
              <p style={{ fontSize: '0.82rem', maxWidth: '340px', margin: '0.35rem auto 0 auto' }}>
                Meaningful revisions are saved automatically whenever you make key updates to your resume.
              </p>
            </div>
          ) : (
            versions.map((ver, idx) => {
              const isCurrent = idx === 0;
              const dateStr = ver.createdAt ? new Date(ver.createdAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Recently';

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isCurrent ? '#FAF5ED' : '#FFFFFF',
                    border: isCurrent ? '2px solid #781416' : '1.5px solid #E8E2D5',
                    borderRadius: '16px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                      <span style={{
                        backgroundColor: isCurrent ? '#781416' : '#292524',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        padding: '0.15rem 0.45rem',
                        fontSize: '0.72rem',
                        fontWeight: 900
                      }}>
                        v{ver.versionNumber || (versions.length - idx)}
                      </span>

                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>
                        {ver.title || resume.title || 'Resume'}
                      </span>

                      {isCurrent && (
                        <span style={{
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          borderRadius: '9999px',
                          padding: '0.1rem 0.5rem',
                          fontSize: '0.68rem',
                          fontWeight: 800
                        }}>
                          Current
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.74rem', color: '#78716C', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Calendar size={12} /> {dateStr}
                      </span>
                      {ver.targetRole && (
                        <>
                          <span>•</span>
                          <span>{ver.targetRole}</span>
                        </>
                      )}
                      {ver.atsScore > 0 && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#059669', fontWeight: 800 }}>ATS: {ver.atsScore}/100</span>
                        </>
                      )}
                      {ver.note && (
                        <>
                          <span>•</span>
                          <span style={{ fontStyle: 'italic' }}>"{ver.note}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRestore(ver.versionNumber || (versions.length - idx))}
                      disabled={restoringVer === (ver.versionNumber || (versions.length - idx))}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #781416',
                        borderRadius: '10px',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#781416',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>{restoringVer === (ver.versionNumber || (versions.length - idx)) ? 'Restoring...' : 'Restore'}</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
