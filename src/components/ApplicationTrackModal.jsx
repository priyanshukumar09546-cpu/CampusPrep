// src/components/ApplicationTrackModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, Clock, Calendar, Bookmark, Award, AlertCircle, Ban } from 'lucide-react';

export default function ApplicationTrackModal({ opportunity, currentTracking, onClose, onTrackUpdated }) {
  const [status, setStatus] = useState(currentTracking?.status || 'Applied');
  const [notes, setNotes] = useState(currentTracking?.notes || '');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!opportunity) return null;

  const statusOptions = [
    { id: 'Saved', label: 'Bookmarked / To Apply', icon: Bookmark, color: '#C88D2D', bg: '#FEF9EE' },
    { id: 'Applied', label: 'Application Submitted', icon: Clock, color: '#2563EB', bg: '#EFF6FF' },
    { id: 'Interview', label: 'Interview Scheduled', icon: Calendar, color: '#7C3AED', bg: '#F5F3FF' },
    { id: 'Selected', label: 'Offer Received / Selected', icon: Award, color: '#16A34A', bg: '#F0FDF4' },
    { id: 'Rejected', label: 'Not Selected', icon: AlertCircle, color: '#DC2626', bg: '#FEF2F2' },
    { id: 'Withdrawn', label: 'Withdrawn Application', icon: Ban, color: '#6B7280', bg: '#F3F4F6' }
  ];

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/opportunities/${opportunity.id}/track`, {
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
              Track Application Progress
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#65676B' }}>
              {opportunity.title} — {opportunity.companyName}
            </p>
          </div>
          <button
            onClick={onClose}
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

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {errorMsg && (
            <div style={{ color: '#DC2626', fontSize: '0.85rem', backgroundColor: '#FEF2F2', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
              {errorMsg}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>
              Current Application Stage:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {statusOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = status === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${opt.color}` : '1.5px solid #E5E7EB',
                      backgroundColor: isSelected ? opt.bg : '#FFFFFF',
                      color: isSelected ? opt.color : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 800 : 600,
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={16} color={opt.color} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
              Personal Private Notes / Interview Dates:
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Applied via official portal on May 12. Assessment round scheduled for next Monday..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1.5px solid #E5E7EB',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            backgroundColor: '#F9FAFB',
            padding: '0.6rem 0.85rem',
            borderRadius: '8px'
          }}>
            ℹ️ Note: This tracking information is private to your student account for personal organization. ProfessorVirus does not submit applications on your behalf.
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
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '10px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '0.55rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#781416',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: saving ? 'wait' : 'pointer'
            }}
          >
            {saving ? 'Saving...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}
