// src/components/ProjectSubmitModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Github, 
  Globe, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  Code2 
} from 'lucide-react';

export default function ProjectSubmitModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Web Development',
    level: 'Advanced',
    academicYear: 'Final Year (4th Year)',
    technologies: '',
    githubUrl: '',
    liveDemoUrl: '',
    description: '',
    problemStatement: '',
    submitterName: '',
    submitterEmail: '',
    submitterCollege: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const domainsList = [
    'Web Development',
    'AI / Machine Learning',
    'Computer Vision',
    'Android App Development',
    'IoT & Embedded Systems',
    'Cyber Security',
    'Cloud & DevOps',
    'Blockchain & Web3',
    'Data Science',
    'College & Academic',
    'Game Development'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.title.trim()) return setError('Please enter project title.');
    if (!formData.githubUrl.trim()) return setError('Please provide the authentic GitHub repository URL.');
    if (!formData.githubUrl.includes('github.com')) {
      return setError('Please enter a valid GitHub repository URL (e.g. https://github.com/username/repository).');
    }
    if (!formData.description.trim()) return setError('Please provide a short description or overview.');
    if (!formData.submitterName.trim()) return setError('Please enter your full name.');
    if (!formData.submitterEmail.trim() || !formData.submitterEmail.includes('@')) {
      return setError('Please enter a valid college or personal email address.');
    }

    try {
      setLoading(true);
      const res = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Submission failed. Please check your details.');
      }
      setSuccessData(data);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.message || 'Network error while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(23, 20, 18, 0.72)',
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
        borderRadius: '20px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        border: '1px solid #E8E2D5',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #E8E2D5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FAF7F2',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FDF6E8',
              border: '1px solid #E4CDA1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C88D2D'
            }}>
              <Code2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800, color: '#1F2421' }}>
                Submit Your Project Idea
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#7A6F62' }}>
                Real engineering projects only — zero fake repositories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#7A6F62',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div style={{ padding: '2.5rem 1.75rem', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem' }}>
              Project Submitted for Review!
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#57534E', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              Thank you! Our automated verifier has logged your repository. Our faculty review panel will verify the code quality and publish it to the student directory shortly.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#F3F4F6',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#4B5563',
              marginBottom: '1.75rem'
            }}>
              <ShieldCheck size={16} color="#059669" /> Status: Pending Faculty Verification
            </div>
            <div>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem 1.75rem',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem' }}>
            {error && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div style={{
              backgroundColor: '#FEF9EE',
              border: '1px solid #F5DEB3',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: '#8A5D00',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Zero Fake Links Policy:</strong> All submitted GitHub links are automatically verified for live reachability and code commits. Repositories with broken URLs or empty folders are automatically discarded.
              </div>
            </div>

            {/* Row 1: Title */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Project Title *</label>
              <input
                type="text"
                placeholder="e.g. Real-Time Autonomous Plant Disease Classifier using MobileNet"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            {/* Row 2: Domain, Level, Academic Year */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Domain *</label>
                <select
                  value={formData.domain}
                  onChange={e => setFormData({ ...formData, domain: e.target.value })}
                  style={inputStyle}
                >
                  {domainsList.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Difficulty Level *</label>
                <select
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Beginner">Beginner (1st/2nd Year)</option>
                  <option value="Intermediate">Intermediate (3rd Year Mini)</option>
                  <option value="Advanced">Advanced (Final Year Major)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Academic Year</label>
                <select
                  value={formData.academicYear}
                  onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Final Year (4th Year)">Final Year (4th Year)</option>
                  <option value="3rd Year (Mini Project)">3rd Year (Mini Project)</option>
                  <option value="2nd Year Project">2nd Year Project</option>
                </select>
              </div>
            </div>

            {/* Row 3: Technologies */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Technologies Used (comma separated) *</label>
              <input
                type="text"
                placeholder="e.g. Python, OpenCV, TensorFlow, Streamlit, SQLite"
                value={formData.technologies}
                onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            {/* Row 4: GitHub URL & Live Demo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>GitHub Repository URL *</label>
                <div style={{ position: 'relative' }}>
                  <Github size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7A6F62' }} />
                  <input
                    type="url"
                    placeholder="https://github.com/user/repo"
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    required
                    style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Live Demo URL (optional)</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7A6F62' }} />
                  <input
                    type="url"
                    placeholder="https://my-demo-app.vercel.app"
                    value={formData.liveDemoUrl}
                    onChange={e => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Description */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Project Overview & Key Features *</label>
              <textarea
                rows={3}
                placeholder="Explain the problem solved, real-world utility, and primary features..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Row 6: Submitter Info */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#FAF7F2',
              borderRadius: '12px',
              border: '1px solid #E8E2D5',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.65rem' }}>
                Submitter Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.65rem' }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Aryan Dixit"
                    value={formData.submitterName}
                    onChange={e => setFormData({ ...formData, submitterName: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="aryan.cse22@aktu.ac.in"
                    value={formData.submitterEmail}
                    onChange={e => setFormData({ ...formData, submitterEmail: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>College / University</label>
                  <input
                    type="text"
                    placeholder="e.g. AKGEC Ghaziabad"
                    value={formData.submitterCollege}
                    onChange={e => setFormData({ ...formData, submitterCollege: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  backgroundColor: '#F5F5F4',
                  border: '1px solid #D6D3D1',
                  color: '#44403C',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#781416',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.6rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.28)'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying Repository...
                  </>
                ) : (
                  <>
                    <Send size={15} /> Submit for Faculty Review
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#44403C',
  marginBottom: '0.3rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: '8px',
  border: '1.5px solid #E8E2D5',
  fontSize: '0.86rem',
  color: '#1F2421',
  backgroundColor: '#FFFFFF',
  outline: 'none',
  boxSizing: 'border-box'
};
