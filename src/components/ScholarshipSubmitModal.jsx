// src/components/ScholarshipSubmitModal.jsx
import React, { useState } from 'react';
import { X, GraduationCap, Building2, Globe, Link2, CheckCircle2, AlertCircle, Sparkles, DollarSign, Calendar } from 'lucide-react';

export default function ScholarshipSubmitModal({ isOpen, onClose, onSubmitted }) {
  const [formData, setFormData] = useState({
    title: '',
    providerName: '',
    applicationUrl: '',
    type: 'Government',
    category: 'Government Scholarships',
    amount: '',
    deadline: '',
    description: '',
    eligibleCourses: ['B.Tech'],
    eligibleYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    academicCriteria: '',
    incomeCriteria: '',
    submitterName: '',
    submitterEmail: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleCourseToggle = (course) => {
    setFormData(prev => {
      const exists = prev.eligibleCourses.includes(course);
      const updated = exists 
        ? prev.eligibleCourses.filter(c => c !== course)
        : [...prev.eligibleCourses, course];
      return { ...prev, eligibleCourses: updated.length ? updated : ['B.Tech'] };
    });
  };

  const handleYearToggle = (year) => {
    setFormData(prev => {
      const exists = prev.eligibleYears.includes(year);
      const updated = exists 
        ? prev.eligibleYears.filter(y => y !== year)
        : [...prev.eligibleYears, year];
      return { ...prev, eligibleYears: updated.length ? updated : ['1st Year'] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.providerName.trim() || !formData.applicationUrl.trim() || !formData.description.trim() || !formData.submitterName.trim() || !formData.submitterEmail.trim()) {
      setErrorMsg('Please fill in all required fields (marked with *).');
      return;
    }

    if (!formData.applicationUrl.startsWith('http://') && !formData.applicationUrl.startsWith('https://')) {
      setErrorMsg('Official Portal URL must start with http:// or https://');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/scholarships/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessData(data);
        if (onSubmitted) onSubmitted(data.scholarship);
      } else {
        setErrorMsg(data.message || 'Failed to submit scholarship. Please check your inputs.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoriesList = [
    'Government Scholarships',
    'Private Scholarships',
    'Merit Based',
    'Need Based',
    'International Scholarships',
    'State Scholarships',
    'Minority Scholarships',
    'SC/ST/OBC Scholarships',
    'Women Scholarships',
    'PwD Scholarships',
    'Research Scholarships',
    'Sports Scholarships',
    'Other Scholarships'
  ];

  const typesList = ['Government', 'Private', 'International'];
  const coursesList = ['B.Tech', 'MCA', 'MBA', 'B.Pharm', 'Other Courses'];
  const yearsList = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

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
        maxWidth: '720px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(35, 30, 25, 0.2)',
        border: '1.5px solid #E8E2D5',
        overflow: 'hidden',
        animation: 'modalSlideUp 0.25s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1.5px solid #E8E2D5',
          backgroundColor: '#FDFBF7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#FEF9EE',
              border: '1.5px solid #F1E7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8A5D00'
            }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1C1E21' }}>
                Suggest a Scholarship
              </h2>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#65676B' }}>
                Help fellow students discover verified financial aid opportunities
              </p>
            </div>
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
              color: '#65676B'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {successData ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.5rem' }}>
                Scholarship Submitted For Verification!
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#4B5563', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                Thank you! Our automated system checked the portal link and sent the scholarship to our moderation team. Once approved, it will appear on the live Scholarships board.
              </p>
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem',
                maxWidth: '460px',
                margin: '0 auto 1.5rem',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>SUBMITTED TITLE:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginTop: '0.2rem' }}>
                  {formData.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.5rem', fontWeight: 600 }}>PROVIDER:</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                  {formData.providerName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '0.5rem', fontWeight: 700 }}>
                  ✓ Automated link reachability check completed
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: '0.65rem 1.75rem',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#991B1B',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Scholarship Title <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Central Sector Scheme of Scholarship (CSSS)"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D1D5DB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Awarding Provider / Organization <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ministry of Education, Govt of India"
                    value={formData.providerName}
                    onChange={e => setFormData({ ...formData, providerName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D1D5DB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                  Official Portal / Application URL <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    required
                    placeholder="https://scholarships.gov.in/ or official foundation link"
                    value={formData.applicationUrl}
                    onChange={e => setFormData({ ...formData, applicationUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D1D5DB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Link2 size={16} color="#9CA3AF" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '0.2rem', display: 'block' }}>
                  Only genuine official government, trust, or university portals. No third-party spam.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D1D5DB',
                      fontSize: '0.88rem',
                      backgroundColor: '#FFFFFF',
                      outline: 'none'
                    }}
                  >
                    {typesList.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D1D5DB',
                      fontSize: '0.88rem',
                      backgroundColor: '#FFFFFF',
                      outline: 'none'
                    }}
                  >
                    {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Scholarship Amount
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50,000/year"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D1D5DB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Application Deadline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dec 31, 2026 or Rolling"
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D1D5DB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Income Limit Criteria
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Family income < ₹4.5 LPA"
                    value={formData.incomeCriteria}
                    onChange={e => setFormData({ ...formData, incomeCriteria: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D1D5DB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Eligible Courses Selection */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                  Eligible Courses (Select all that apply)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {coursesList.map(c => {
                    const sel = formData.eligibleCourses.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => handleCourseToggle(c)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          border: sel ? '1.5px solid #781416' : '1.5px solid #D1D5DB',
                          backgroundColor: sel ? '#FEF2F2' : '#FFFFFF',
                          color: sel ? '#781416' : '#4B5563',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {sel ? '✓ ' : '+ '}{c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                  Detailed Description & Eligibility Overview <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline the scheme objectives, eligibility requirements, and disbursement structure..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #D1D5DB',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submitter Info */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.6rem' }}>
                  Your Contact Information (For moderation verification only)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                      Your Name <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.submitterName}
                      onChange={e => setFormData({ ...formData, submitterName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                      Your Email <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.submitterEmail}
                      onChange={e => setFormData({ ...formData, submitterEmail: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '9999px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.6rem 1.6rem',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(120, 20, 22, 0.25)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Verifying & Submitting...' : 'Submit For Verification'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
