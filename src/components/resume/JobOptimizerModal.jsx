// src/components/resume/JobOptimizerModal.jsx
import React, { useState } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  ArrowRight,
  Building,
  Briefcase,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import API_URL from '../../config/api';

export default function JobOptimizerModal({
  isOpen,
  onClose,
  resumeData,
  resumeTitle,
  onApplyTailoredSummary,
  onCreateOptimizedCopy
}) {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState(
    resumeData?.personal?.targetRole || resumeData?.personal?.professionalHeadline || 'Software Engineer'
  );
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [summaryApplied, setSummaryApplied] = useState(false);
  const [copySaving, setCopySaving] = useState(false);

  if (!isOpen) return null;

  const handleRunOptimizer = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      alert('Please paste the job description text.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/resumes/job-optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          jobDescription,
          targetRole: jobTitle,
          companyName
        })
      });
      const data = await res.json();
      if (data.success && data.optimization) {
        setOptimizationResult(data.optimization);
      } else {
        alert(data.message || 'Job optimization analysis failed.');
      }
    } catch (err) {
      alert('Error running job optimizer.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySummary = () => {
    if (optimizationResult?.tailoredSummary && onApplyTailoredSummary) {
      onApplyTailoredSummary(optimizationResult.tailoredSummary);
      setSummaryApplied(true);
    }
  };

  const handleCreateCopy = async () => {
    if (!onCreateOptimizedCopy) return;
    setCopySaving(true);
    try {
      const targetName = `${resumeTitle || 'Resume'} — ${companyName || jobTitle}`;
      const tailoredData = {
        ...resumeData,
        personal: {
          ...resumeData.personal,
          targetRole: jobTitle,
          summary: optimizationResult?.tailoredSummary || resumeData.personal?.summary
        }
      };
      await onCreateOptimizedCopy(targetName, jobTitle, tailoredData);
      onClose();
    } catch (err) {
      alert('Error creating optimized copy.');
    } finally {
      setCopySaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(12, 10, 11, 0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 10500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '900px',
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
              Target Opportunity Optimization
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0.15rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={20} color="#FFD166" />
              <span>AI Job-Specific Resume Optimizer</span>
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

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {!optimizationResult ? (
            <form onSubmit={handleRunOptimizer} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <p style={{ fontSize: '0.86rem', color: '#57534E', margin: 0, lineHeight: 1.55 }}>
                Paste the job description from LinkedIn, Internshala, or company careers page. Our engine compares your skills, analyzes missing requirements, and creates a tailored version for that specific company.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421', display: 'block', marginBottom: '0.35rem' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft, Infosys, StartUp Inc."
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E8E2D5',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421', display: 'block', marginBottom: '0.35rem' }}>
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer, Frontend Intern"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E8E2D5',
                      fontSize: '0.84rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421', display: 'block', marginBottom: '0.35rem' }}>
                  Job Description Text *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Paste the complete job description, requirements, and responsibilities here..."
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1.5px solid #E8E2D5',
                    fontSize: '0.84rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    lineHeight: 1.5,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(120,20,22,0.2)'
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Analyzing Job Fit & Missing Keywords...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Analyze & Optimize for This Job</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Match Score Card */}
              <div style={{
                backgroundColor: '#FAF5ED',
                border: '2px solid #C88D2D',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#8A5D00', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Role Fit Analysis
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F2421', margin: '0.2rem 0' }}>
                    {optimizationResult.jobTitle} {companyName ? `at ${companyName}` : ''}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#66615B', margin: 0 }}>
                    Matching candidate skills against core technical requirements in the job posting.
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '14px',
                  border: '1.5px solid #E8CD97'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#781416', lineHeight: 1 }}>
                    {optimizationResult.matchScore}%
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#78716C', fontWeight: 700, lineHeight: 1.2 }}>
                    Estimated<br />Job Match
                  </div>
                </div>
              </div>

              {/* Matching & Missing Skills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                
                {/* Matching Skills */}
                <div style={{
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #BBF7D0',
                  borderRadius: '16px',
                  padding: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={16} /> Matching Skills Found ({optimizationResult.matchingSkills.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {optimizationResult.matchingSkills.length > 0 ? (
                      optimizationResult.matchingSkills.map((s, idx) => (
                        <span key={idx} style={{
                          backgroundColor: '#DCFCE7',
                          color: '#15803D',
                          borderRadius: '9999px',
                          padding: '0.2rem 0.65rem',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}>
                          ✓ {s.toUpperCase()}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#66615B' }}>No exact keyword matches found.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div style={{
                  backgroundColor: '#FFFBEB',
                  border: '1.5px solid #FDE68A',
                  borderRadius: '16px',
                  padding: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400E', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertCircle size={16} /> Missing Key Job Requirements ({optimizationResult.missingSkills.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {optimizationResult.missingSkills.length > 0 ? (
                      optimizationResult.missingSkills.map((s, idx) => (
                        <span key={idx} style={{
                          backgroundColor: '#FEF3C7',
                          color: '#B45309',
                          borderRadius: '9999px',
                          padding: '0.2rem 0.65rem',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}>
                          + {s.toUpperCase()}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#15803D' }}>You have covered all primary skills!</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Tailored Professional Summary */}
              {optimizationResult.tailoredSummary && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E8E2D5',
                  borderRadius: '16px',
                  padding: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1F2421', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sparkles size={16} color="#781416" />
                      <span>AI Tailored Summary for {companyName || 'This Role'}:</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplySummary}
                      disabled={summaryApplied}
                      style={{
                        backgroundColor: summaryApplied ? '#059669' : '#FAF5ED',
                        color: summaryApplied ? '#FFFFFF' : '#781416',
                        border: '1px solid #781416',
                        borderRadius: '8px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: summaryApplied ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      {summaryApplied ? <><Check size={13} /> Applied</> : 'Apply to Current Resume'}
                    </button>
                  </div>

                  <p style={{
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #EDE5D6',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    fontSize: '0.84rem',
                    color: '#292524',
                    lineHeight: 1.55,
                    margin: 0
                  }}>
                    {optimizationResult.tailoredSummary}
                  </p>
                </div>
              )}

              {/* Bottom Action: Create Separate Copy */}
              <div style={{
                backgroundColor: '#FAF7F2',
                borderRadius: '16px',
                border: '1.5px solid #E8DFCF',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1F2421' }}>
                    Save as New Optimized Copy
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#66615B', marginTop: '0.15rem' }}>
                    Creates an independent resume e.g. "{resumeTitle} — {companyName || jobTitle}". Never overwrites original.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setOptimizationResult(null)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D6CBB8',
                      borderRadius: '10px',
                      padding: '0.55rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Back to Input
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateCopy}
                    disabled={copySaving}
                    style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: copySaving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Plus size={15} />
                    <span>{copySaving ? 'Saving Copy...' : 'Create Separate Resume Copy'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
