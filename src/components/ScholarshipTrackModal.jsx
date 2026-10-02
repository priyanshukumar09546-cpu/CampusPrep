// src/components/ScholarshipTrackModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, Clock, Calendar, Bookmark, Award, AlertCircle, Ban, GraduationCap } from 'lucide-react';

export default function ScholarshipTrackModal({ scholarship, currentTracking, onClose, onTrackUpdated }) {
  const [status, setStatus] = useState(currentTracking?.status || 'Applied');
  const [notes, setNotes] = useState(currentTracking?.notes || '');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!scholarship) return null;

  const statusOptions = [
    { id: 'Saved', label: 'Saved / Reviewing Eligibility', icon: Bookmark, color: '#C88D2D', bg: '#FEF9EE' },
    { id: 'Applied', label: 'Application Submitted Online', icon: Clock, color: '#2563EB', bg: '#EFF6FF' },
    { id: 'Under Review', label: 'Institute / Nodal Desk Review', icon: Calendar, color: '#7C3AED', bg: '#F5F3FF' },
    { id: 'Selected', label: 'Scholarship Awarded / Approved', icon: Award, color: '#16A34A', bg: '#F0FDF4' },
    { id: 'Rejected', label: 'Not Selected / Ineligible', icon: AlertCircle, color: '#DC2626', bg: '#FEF2F2' },
    { id: 'Withdrawn', label: 'Application Withdrawn', icon: Ban, color: '#6B7280', bg: '#F3F4F6' }
  ];

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/scholarships/${scholarship.id}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      const data = await res.json();
      if (data.success) {
        if (onTrackUpdated) onTrackUpdated(data.application);
        onClose();
      } else {
        setErrorMsg('Failed to update tracking');
      }
    } catch (e) {
      setErrorMsg('Network error. Could not save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(28, 30, 33, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 24px 60px rgba(35, 30, 25, 0.2)',
        border: '1.5px solid #E8E2D5',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1.5px solid #E8E2D5',
          backgroundColor: '#FDFBF7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21' }}>
              Track Scholarship Application
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#65676B' }}>
              {scholarship.title} — {scholarship.providerName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#F0EFEA',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4B5563'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {errorMsg && (
            <div style={{
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '1rem'
            }}>
              {errorMsg}
            </div>
          )}

          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.6rem' }}>
            Current Application Status
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {statusOptions.map(opt => {
              const isSelected = status === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setStatus(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${opt.color}` : '1.5px solid #E5E7EB',
                    backgroundColor: isSelected ? opt.bg : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <Icon size={16} color={opt.color} />
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 800 : 600,
                    color: isSelected ? opt.color : '#374151',
                    lineHeight: 1.2
                  }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>
            Personal Notes & Verification Application ID
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Applied on NSP on Oct 12; Application ID: UP202627009812; College nodal officer verified on Nov 4."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              border: '1.5px solid #D1D5DB',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />

          <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '0.4rem' }}>
            🔒 Private tracker: only visible to you in your browser and account.
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1.5px solid #E8E2D5',
          backgroundColor: '#FDFBF7',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '9999px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '0.55rem 1.5rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#781416',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save Tracking'}
          </button>
        </div>
      </div>
    </div>
  );
}
