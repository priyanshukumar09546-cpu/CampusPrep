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
    e.preventDefault();
    setErrorMsg('');

    if (!formData.companyName.trim() || !formData.companyWebsite.trim() || !formData.title.trim() || !formData.applicationUrl.trim() || !formData.description.trim() || !formData.submitterName.trim() || !formData.submitterEmail.trim()) {
      setErrorMsg('Please fill in all required fields (marked with *).');
      return;
    }

    // Basic URL check
    if (!formData.applicationUrl.startsWith('http://') && !formData.applicationUrl.startsWith('https://')) {
      setErrorMsg('Application URL must start with http:// or https://');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/opportunities/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
                backgroundColor: '#F9FAFB',
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
                      backgroundColor: '#FFFFFF'
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
                      backgroundColor: '#FFFFFF'
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
                      backgroundColor: '#FFFFFF'
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
                backgroundColor: '#F9FAFB',
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
                        backgroundColor: '#FFFFFF'
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
                        backgroundColor: '#FFFFFF'
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
                    backgroundColor: '#FFFFFF',
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
  );
}
