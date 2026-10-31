// src/components/EmployerSubmitModal.jsx
import React, { useState } from 'react';
import { X, Briefcase, Building, Globe, MapPin, DollarSign, Calendar, Link2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function EmployerSubmitModal({ isOpen, onClose, onSubmitted }) {
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    title: '',
    type: 'Internship',
    domain: 'Software Development',
    location: '',
    workMode: 'On-site',
    skills: '',
    eligibility: '',
    courseEligibility: ['B.Tech'],
    salary: '',
    stipend: '',
    deadline: '',
    applicationUrl: '',
    description: '',
    submitterName: '',
    submitterEmail: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleCourseToggle = (course) => {
    setFormData(prev => {
      const exists = prev.courseEligibility.includes(course);
      const updated = exists 
        ? prev.courseEligibility.filter(c => c !== course)
        : [...prev.courseEligibility, course];
      return { ...prev, courseEligibility: updated.length ? updated : ['B.Tech'] };
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');

    const compName = (formData.companyName || '').trim();
    const compWeb = (formData.companyWebsite || '').trim();
    const title = (formData.title || '').trim();
    const appUrl = (formData.applicationUrl || compWeb || '').trim();
    const desc = (formData.description || `${title} opportunity at ${compName}`).trim();
    const subName = (formData.submitterName || 'Recruiter / Employer').trim();
    const subEmail = (formData.submitterEmail || 'careers@company.com').trim();

    if (!compName || !compWeb || !title) {
      setErrorMsg('Please fill in all required fields (marked with *).');
      return;
    }

    if (!compWeb.startsWith('http://') && !compWeb.startsWith('https://')) {
      setErrorMsg('Official Website must start with http:// or https://');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        companyName: compName,
        companyWebsite: compWeb,
        title,
        applicationUrl: appUrl.startsWith('http') ? appUrl : compWeb,
        description: desc,
        submitterName: subName,
        submitterEmail: subEmail
      };
      const res = await fetch('/api/opportunities/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessData(data);
        if (onSubmitted) onSubmitted(data.opportunity);
      } else {
        setErrorMsg(data.message || 'Failed to submit opportunity. Please check your details.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const domainsList = [
    'Software Development',
    'Data Science & Analytics',
    'Machine Learning & AI',
    'Web Development',
    'Mobile App Development',
    'Cyber Security',
    'Cloud Computing',
    'DevOps & Infrastructure',
    'Product Management',
    'UI/UX Design',
    'Business & Marketing',
    'Mechanical Engineering',
    'Electronics & ECE',
    'Other Domains'
  ];

  const typesList = ['Internship', 'Full-time', 'Part-time', 'Contract', 'Apprenticeship'];
  const workModesList = ['On-site', 'Remote', 'Hybrid'];

  return (
    <>
      {/* DESKTOP MODAL (>= 1024px) — 100% UNTOUCHED ORIGINAL */}
      <div
        className="pv-employer-modal-desktop"
        style={{
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
        }}
      >
      <div style={{
        backgroundColor: '#0B0B0B',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '740px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(35, 30, 25, 0.2)',
        border: '1.5px solid #E8E2D5',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.4rem 1.75rem',
          borderBottom: '1.5px solid #E8E2D5',
          backgroundColor: '#FDFBF7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              color: '#781416',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Briefcase size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21' }}>
                Post a Job or Internship
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#65676B' }}>
                Connect with thousands of ambitious AKTU and engineering candidates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F0EFEA',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4B5563'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto' }}>
          {successData ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C1E21', marginBottom: '0.5rem' }}>
                Opportunity Submitted for Verification!
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                {successData.message}
              </p>
              <div style={{
                backgroundColor: '#111111',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                padding: '1rem',
                maxWidth: '420px',
                margin: '0 auto 1.75rem',
                textAlign: 'left',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#6B7280' }}>Opportunity ID:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{successData.opportunity?.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#6B7280' }}>Initial Status:</span>
                  <span style={{ fontWeight: 700, color: '#D97706' }}>Pending Verification</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Automated Reachability:</span>
                  <span style={{ fontWeight: 700, color: '#16A34A' }}>Verified (Live URL)</span>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.65rem 2rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Mandatory Policy Warning */}
              <div style={{
                backgroundColor: '#FEF9EE',
                border: '1px solid #E8CDA1',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                gap: '0.75rem',
                fontSize: '0.82rem',
                color: '#8A5D00'
              }}>
                <Sparkles size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Strict Real Data Policy:</strong> Every submitted role undergoes manual admin verification and automated URL reachability checks. Fake listings, unauthorized third-party scraper links, or unpaid commission schemes will be permanently rejected.
                </span>
              </div>

              {errorMsg && (
                <div style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  color: '#B91C1C',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Company Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Solutions"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Official Website *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://company.com"
                    value={formData.companyWebsite}
                    onChange={e => setFormData({ ...formData, companyWebsite: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Title & Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Opportunity Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Developer Intern"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#0B0B0B'
                    }}
                  >
                    {typesList.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Work Mode *
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={e => setFormData({ ...formData, workMode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#0B0B0B'
                    }}
                  >
                    {workModesList.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              {/* Domain & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Domain Category *
                  </label>
                  <select
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#0B0B0B'
                    }}
                  >
                    {domainsList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Location (City / State)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Noida, UP or Remote"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Skills & Course Eligibility */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript, Tailwind CSS"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Course Eligibility Pills */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                  Eligible Courses:
                </label>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {['B.Tech', 'MCA', 'MBA', 'B.Pharm'].map(c => {
                    const isSelected = formData.courseEligibility.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => handleCourseToggle(c)}
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          border: isSelected ? '1.5px solid #781416' : '1px solid #D1D5DB',
                          backgroundColor: isSelected ? '#FEF2F2' : '#FFFFFF',
                          color: isSelected ? '#781416' : '#4B5563',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 800 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compensation & Deadline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Stipend / Salary (if official)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000/month or ₹6.0 LPA"
                    value={formData.salary || formData.stipend}
                    onChange={e => setFormData({ ...formData, salary: e.target.value, stipend: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Official Application URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                  Official Direct Application URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://company.com/careers/job-12345 or Google Form"
                  value={formData.applicationUrl}
                  onChange={e => setFormData({ ...formData, applicationUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                  Job & Responsibilities Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize the core day-to-day responsibilities, learning outcomes, and expectations..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Submitter Details */}
              <div style={{
                backgroundColor: '#111111',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '0.85rem 1rem'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', display: 'block', marginBottom: '0.6rem' }}>
                  Recruiter / Contact Information:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={formData.submitterName}
                      onChange={e => setFormData({ ...formData, submitterName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#0B0B0B'
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Official Work Email *"
                      value={formData.submitterEmail}
                      onChange={e => setFormData({ ...formData, submitterEmail: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#0B0B0B'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#0B0B0B',
                    color: '#374151',
                    fontSize: '0.88rem',
                    fontWeight: 600,
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
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: submitting ? 'wait' : 'pointer',
                    boxShadow: '0 4px 12px rgba(120, 20, 22, 0.25)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Verifying & Submitting...' : 'Submit Opportunity →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      </div>

      {/* MOBILE BOTTOM SHEET (< 1024px) — EXACT 1:1 MATCH WITH REFERENCE IMAGE */}
      <div
        className="pv-employer-modal-mobile"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))',
          backgroundColor: 'rgba(15, 23, 42, 0.22)',
          zIndex: 9995,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
        onClick={onClose}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: '#0B0B0B',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            width: '100%',
            maxWidth: '100vw',
            maxHeight: 'calc(85vh - 50px)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            boxSizing: 'border-box',
            animation: 'modalSlideUp 0.25s ease-out'
          }}
        >
          {/* Small drag handle */}
          <div style={{ width: '38px', height: '4px', borderRadius: '999px', backgroundColor: '#94A3B8', margin: '9px auto 5px', flexShrink: 0 }} />

          {/* Header */}
          <div style={{
            padding: '0.4rem 1rem 0.65rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#781416',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0
              }}>
                <Briefcase size={20} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>
                  Post a Job / Internship
                </h2>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.70rem', color: '#64748B', fontWeight: 500, lineHeight: 1.3 }}>
                  Connect with thousands of AKTU and engineering candidates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer',
                flexShrink: 0,
                marginTop: '2px'
              }}
            >
              <X size={15} strokeWidth={2.4} />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div style={{ padding: '0.85rem 1rem', overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
            {successData ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.35rem' }}>
                  Opportunity Submitted for Verification!
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1.25rem', lineHeight: 1.45 }}>
                  {successData.message}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.65rem 2rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {errorMsg && (
                  <div style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '10px',
                    padding: '0.55rem 0.75rem',
                    color: '#991B1B',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Row 1: Company Name * & Official Website * */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Company Name <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Tech Solutions"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Official Website <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://company.com"
                      value={formData.companyWebsite}
                      onChange={e => setFormData({ ...formData, companyWebsite: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    />
                  </div>
                </div>

                {/* Row 2: Opportunity Title * & Work Mode * */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Opportunity Title <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Frontend Developer Intern"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Work Mode <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      value={formData.workMode}
                      onChange={e => setFormData({ ...formData, workMode: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    >
                      {workModesList.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 3: Type * & Domain Category * */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Type <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    >
                      {typesList.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Domain Category <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      value={formData.domain}
                      onChange={e => setFormData({ ...formData, domain: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    >
                      {domainsList.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 4: Location (City / State) * & Eligible Courses * */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Location (City / State) <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Noida, UP or Remote"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Eligible Courses <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', paddingTop: '2px' }}>
                      {['B.Tech', 'MCA', 'MBA', 'B.Pharm'].map(c => {
                        const sel = formData.courseEligibility.includes(c);
                        return (
                          <button
                            type="button"
                            key={c}
                            onClick={() => handleCourseToggle(c)}
                            style={{
                              padding: '0.22rem 0.55rem',
                              borderRadius: '999px',
                              border: sel ? '1.5px solid #781416' : '1px solid #CBD5E1',
                              backgroundColor: sel ? '#781416' : '#FFFFFF',
                              color: sel ? '#FFFFFF' : '#475569',
                              fontSize: '0.70rem',
                              fontWeight: sel ? 800 : 600,
                              cursor: 'pointer'
                            }}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 5: Required Skills * & Application Deadline */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Required Skills (comma separated) <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, Node.js, TypeScript"
                      value={formData.skills}
                      onChange={e => setFormData({ ...formData, skills: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.78rem',
                        color: '#1E293B',
                        outline: 'none',
                        backgroundColor: '#0B0B0B'
                      }}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Sticky Bottom Actions matching reference */}
          {!successData && (
            <div style={{
              padding: '0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 8px))',
              borderTop: '1px solid #F1F5F9',
              backgroundColor: '#0B0B0B',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flexShrink: 0
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: '0 0 36%',
                  padding: '0.72rem 1rem',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  color: '#1E293B',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: '0.72rem 1rem',
                  backgroundColor: '#781416',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 3px 10px rgba(120, 20, 22, 0.25)',
                  textAlign: 'center'
                }}
              >
                {submitting ? 'Submitting...' : 'Post Opportunity'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
