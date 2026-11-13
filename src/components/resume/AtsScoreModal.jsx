// src/components/resume/AtsScoreModal.jsx
import React, { useState } from 'react';
import {
  X,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Check,
  Tag,
  TrendingUp,
  FileText
} from 'lucide-react';
import API_URL from '../../config/api';

export default function AtsScoreModal({
  isOpen,
  onClose,
  resumeData,
  resumeId,
  onApplySuggestion,
  onUpdateScore,
  onNavigate
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState(
    resumeData?.personal?.targetRole || resumeData?.personal?.professionalHeadline || 'Software Engineer'
  );
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'categories' | 'suggestions'

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/resumes/ats-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          targetRole,
          resumeId
        })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        if (onUpdateScore) {
          onUpdateScore(data.analysis.overallScore, data.analysis);
        }
      } else {
        alert(data.message || 'ATS analysis failed.');
      }
    } catch (err) {
      alert('Error connecting to ATS analysis engine.');
    } finally {
      setLoading(false);
    }
  };

  // Run analysis automatically on first open if not already analyzed (guaranteed stable hook order)
  React.useEffect(() => {
    if (isOpen && !analysis && resumeData) {
      handleRunAnalysis();
    }
  }, [isOpen, analysis, resumeData]);

  const handleApply = (sug) => {
    if (onApplySuggestion && sug.applyData) {
      onApplySuggestion(sug, sug.applyData);
      setAppliedIds(prev => new Set(prev).add(sug.id));
    }
  };

  if (!isOpen) return null;

  const score = analysis?.overallScore ?? 0;
  const scoreColor = score >= 80 ? '#059669' : score >= 60 ? '#C88D2D' : '#DC2626';
  const scoreBg = score >= 80 ? '#ECFDF5' : score >= 60 ? '#FEF9EE' : '#FEF2F2';
  const scoreBadgeText = score >= 80 ? 'Excellent ATS Pass Rate' : score >= 60 ? 'Moderate - Key Improvements Recommended' : 'High Rejection Risk - Needs Re-alignment';

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
        maxWidth: '920px',
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
              Explainable Evaluation Rubric (0-100)
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0.15rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="#FFD166" />
              <span>AI ATS Resume Compatibility Analyzer</span>
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.setItem('pv_active_ats_resume', JSON.stringify({
                      resumeData,
                      resumeId
                    }));
                  } catch (_) {}
                  onClose();
                  onNavigate('ats-checker');
                }}
                style={{
                  backgroundColor: '#781416',
                  backgroundImage: 'linear-gradient(135deg, #8C1C24 0%, #781416 100%)',
                  border: '1px solid rgba(255, 209, 102, 0.45)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={13} color="#FFD166" />
                <span>Full ATS Studio</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={loading}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Analyzing...' : 'Re-Analyze'}</span>
            </button>

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
        </div>

        {/* Target Role Input Strip */}
        <div style={{
          backgroundColor: '#FAF7F2',
          borderBottom: '1px solid #EDE5D6',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#78716C', whiteSpace: 'nowrap' }}>
              Target Role:
            </span>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Engineer, Data Analyst, Java Developer"
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                border: '1.5px solid #E8E2D5',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1F2421',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { id: 'overview', label: 'Score Overview' },
              { id: 'categories', label: '10-Point Rubric' },
              { id: 'suggestions', label: `Actionable Fixes (${analysis?.actionableSuggestions?.length || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: activeTab === tab.id ? '1.5px solid #781416' : '1px solid transparent',
                  backgroundColor: activeTab === tab.id ? '#FAF0F0' : 'transparent',
                  color: activeTab === tab.id ? '#781416' : '#66615B',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#78716C' }}>
              <RefreshCw size={36} className="animate-spin" style={{ color: '#C88D2D', margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421' }}>
                Analyzing Resume Across 10 ATS Rubric Dimensions...
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#78716C', maxWidth: '400px', margin: '0.4rem auto 0 auto' }}>
                Cross-checking keyword density, action verbs, contact validity, and section structure against industry standards.
              </p>
            </div>
          ) : !analysis ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p>Click "Re-Analyze" above to evaluate your resume.</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  {/* Top Score Banner */}
                  <div style={{
                    backgroundColor: scoreBg,
                    border: `2px solid ${scoreColor}`,
                    borderRadius: '20px',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: `4px solid ${scoreColor}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
                      }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                          {score}
                        </span>
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#78716C' }}>/ 100</span>
                      </div>

                      <div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          color: scoreColor,
                          backgroundColor: '#FFFFFF',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          marginBottom: '0.35rem'
                        }}>
                          <ShieldCheck size={13} /> {scoreBadgeText}
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.25rem 0' }}>
                          Compatibility for: {analysis.targetRole}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#57534E', margin: 0, maxWidth: '480px' }}>
                          Evaluated using standardized algorithmic rubric across keyword depth, formatting, and impact metrics.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('suggestions')}
                      style={{
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.65rem 1.25rem',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span>View Suggestions</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Strengths & Weaknesses Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    
                    {/* Strengths */}
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1.5px solid #BBF7D0',
                      borderRadius: '16px',
                      padding: '1.25rem'
                    }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={16} /> Key Strengths Detected
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {analysis.strengths && analysis.strengths.length > 0 ? (
                          analysis.strengths.map((str, idx) => (
                            <div key={idx} style={{ fontSize: '0.82rem', color: '#15803D', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                              <span style={{ fontWeight: 800 }}>•</span>
                              <span>{str}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: '0.82rem', color: '#66615B' }}>Run improvements to build strong ATS highlights.</div>
                        )}
                      </div>
                    </div>

                    {/* Weaknesses */}
                    <div style={{
                      backgroundColor: '#FFFBEB',
                      border: '1.5px solid #FDE68A',
                      borderRadius: '16px',
                      padding: '1.25rem'
                    }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400E', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <AlertTriangle size={16} /> Priority Optimization Areas
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                          analysis.weaknesses.map((w, idx) => (
                            <div key={idx} style={{ fontSize: '0.82rem', color: '#B45309', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                              <span style={{ fontWeight: 800 }}>•</span>
                              <span>{w}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: '0.82rem', color: '#15803D' }}>No major critical weaknesses detected!</div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Missing Keywords Cloud */}
                  {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Tag size={15} color="#C88D2D" />
                        <span>Recommended Keywords for {analysis.targetRole}:</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#66615B', margin: '0 0 0.75rem 0' }}>
                        ATS algorithms look for these standard industry skills. If you have experience in any of these, consider adding them to your skills or projects:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {analysis.missingKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: '#FEF3C7',
                              border: '1px solid #FCD34D',
                              color: '#92400E',
                              borderRadius: '9999px',
                              padding: '0.2rem 0.65rem',
                              fontSize: '0.74rem',
                              fontWeight: 700
                            }}
                          >
                            + {kw.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div style={{ fontSize: '0.72rem', color: '#8C827A', lineHeight: 1.5, textAlign: 'center', marginTop: '1.5rem' }}>
                    Note: ATS scoring provides an estimated compatibility benchmark based on standard recruitment rubrics. Actual hiring systems (Workday, Greenhouse, Taleo) vary by employer.
                  </div>
                </div>
              )}

              {/* TAB 2: 10-POINT RUBRIC CATEGORIES */}
              {activeTab === 'categories' && analysis.categoryScores && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {[
                    { key: 'contact', title: '1. Contact Information', max: 10, desc: 'Name, phone, valid email, location, LinkedIn/GitHub.' },
                    { key: 'summary', title: '2. Professional Summary', max: 10, desc: 'Target role, length, keyword focus without first-person pronouns.' },
                    { key: 'skills', title: '3. Technical Skills Depth', max: 10, desc: 'Languages, frameworks, tools, databases, core concepts.' },
                    { key: 'keywords', title: '4. Industry Keywords', max: 10, desc: 'Domain alignment with target engineering roles.' },
                    { key: 'experience', title: '5. Work Experience', max: 10, desc: 'Internships, action verbs, quantifiable metrics (%, numbers).' },
                    { key: 'projects', title: '6. Capstone Projects', max: 10, desc: 'At least 2 detailed technical projects with tech stacks.' },
                    { key: 'education', title: '7. Education Details', max: 10, desc: 'Degree, college/university, graduation year, CGPA.' },
                    { key: 'certifications', title: '8. Certifications & Honors', max: 10, desc: 'Accredited technical credentials, hackathons, academic awards.' },
                    { key: 'formatting', title: '9. Action Verbs & Style', max: 10, desc: 'Concise bullet points (10-25 words), zero passive phrasing.' },
                    { key: 'readability', title: '10. ATS Section Parsing', max: 10, desc: 'Standard section names and single-page layout balance.' }
                  ].map(cat => {
                    const catScore = analysis.categoryScores[cat.key] || 0;
                    const catColor = catScore >= 8 ? '#059669' : catScore >= 5 ? '#C88D2D' : '#DC2626';

                    return (
                      <div key={cat.key} style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #E8E2D5',
                        borderRadius: '16px',
                        padding: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1F2421' }}>{cat.title}</span>
                          <span style={{ fontSize: '0.84rem', fontWeight: 900, color: catColor }}>
                            {catScore} / {cat.max}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#F0EBE1', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                          <div style={{ width: `${(catScore / cat.max) * 100}%`, height: '100%', backgroundColor: catColor, borderRadius: '9999px' }} />
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#66615B', lineHeight: 1.4 }}>
                          {cat.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: ACTIONABLE SUGGESTIONS */}
              {activeTab === 'suggestions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analysis.actionableSuggestions && analysis.actionableSuggestions.length > 0 ? (
                    analysis.actionableSuggestions.map(sug => {
                      const isApplied = appliedIds.has(sug.id);

                      return (
                        <div key={sug.id} style={{
                          backgroundColor: isApplied ? '#F0FDF4' : '#FFFFFF',
                          border: isApplied ? '1.5px solid #86EFAC' : '1.5px solid #E8E2D5',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div>
                              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#781416', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {sug.section} Optimization
                              </div>
                              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1F2421', margin: '0.2rem 0' }}>
                                {sug.issue}
                              </h4>
                            </div>

                            {sug.applyData && (
                              <button
                                type="button"
                                onClick={() => handleApply(sug)}
                                disabled={isApplied}
                                style={{
                                  backgroundColor: isApplied ? '#059669' : '#781416',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '0.4rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  cursor: isApplied ? 'default' : 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {isApplied ? <><Check size={13} /> Applied</> : <>Apply to Resume</>}
                              </button>
                            )}
                          </div>

                          <div style={{ fontSize: '0.80rem', color: '#66615B', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                            <strong>Why it matters:</strong> {sug.whyItMatters}
                          </div>

                          {sug.suggestedText && (
                            <div style={{
                              backgroundColor: '#FAF7F2',
                              border: '1px solid #E8DFCF',
                              borderRadius: '10px',
                              padding: '0.75rem',
                              fontSize: '0.82rem',
                              color: '#292524',
                              fontFamily: 'monospace',
                              lineHeight: 1.5
                            }}>
                              {sug.suggestedText}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#15803D' }}>
                      <CheckCircle2 size={40} style={{ margin: '0 auto 0.75rem auto' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>No Actionable Issues Found!</h3>
                      <p style={{ fontSize: '0.84rem', color: '#57534E' }}>Your resume complies with primary ATS rubric standards.</p>
                    </div>
                  )}
                </div>
              )}

            </>
          )}
        </div>

      </div>
    </div>
  );
}
