// src/components/resume/CollegeFormatModal.jsx
import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Download,
  FileCode,
  Building,
  RefreshCw,
  Eye,
  Sliders,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import API_URL from '../../config/api';

export default function CollegeFormatModal({
  isOpen,
  onClose,
  resumeData,
  onApplyCollegeFormat,
  onSaveAsCollegeResume
}) {
  const [step, setStep] = useState(1); // 1: Upload Template, 2: Format Detection, 3: Side-by-Side Review
  const [uploading, setUploading] = useState(false);
  const [templateFile, setTemplateFile] = useState(null);
  const [templateUrl, setTemplateUrl] = useState('');
  const [collegeName, setCollegeName] = useState('Dr. A.P.J. Abdul Kalam Technical University (AKTU)');
  const [detectedSections, setDetectedSections] = useState([]);
  const [formatRules, setFormatRules] = useState({
    collegeName: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
    tabularEducation: true,
    hasCollegeHeaderBox: true,
    headingFontSize: 11,
    marginPt: 36
  });

  // Replicated output states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState('');
  const [generatedLatex, setGeneratedLatex] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen) return null;

  const handleTemplateUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setTemplateFile(file);
    setUploading(true);

    const formData = new FormData();
    formData.append('template', file);

    try {
      const res = await fetch(`${API_URL}/api/resumes/college-format/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setCollegeName(data.collegeName || 'Official College Placement Format');
        setDetectedSections(data.detectedSections || []);
        const rules = data.formatRules || {
          collegeName: data.collegeName,
          tabularEducation: true,
          hasCollegeHeaderBox: true
        };
        setFormatRules(rules);
        setTemplateUrl(`${API_URL}${data.templateFileUrl}`);
        setStep(2);
      } else {
        alert(data.message || 'Could not analyze uploaded template format.');
      }
    } catch (err) {
      alert('Error uploading and detecting college template format.');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateReplicatedResume = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/api/resumes/college-format/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          formatRules: { ...formatRules, collegeName }
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPdfUrl(data.pdfUrl?.startsWith('http') ? data.pdfUrl : `${API_URL}${data.pdfUrl}`);
        setGeneratedLatex(data.latex || '');
        setStep(3);
      } else {
        alert(data.message || 'Could not generate replicated resume.');
      }
    } catch (err) {
      alert('Error communicating with LaTeX compilation service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsResume = () => {
    if (onSaveAsCollegeResume) {
      onSaveAsCollegeResume({
        title: `${resumeData?.personal?.fullName || 'Student'} — ${collegeName} Format`,
        template: 'college-official',
        collegeFormat: {
          collegeName,
          formatRules,
          templateUrl
        },
        generatedLatex
      });
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(12, 10, 11, 0.88)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 10500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: step === 3 ? '1240px' : '860px',
        width: '100%',
        maxHeight: '94vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1.5px solid #EDE5D6',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
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
              Campus Placement Template Replicator
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0.15rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={22} color="#FFD166" />
              <span>AI College Resume Format Replicator</span>
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {step === 3 && (
              <button
                type="button"
                onClick={handleSaveAsResume}
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <CheckCircle2 size={14} />
                <span>Save College Resume</span>
              </button>
            )}

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

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {/* STEP 1: UPLOAD COLLEGE TEMPLATE */}
          {step === 1 && (
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '1rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <UploadCloud size={32} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.5rem 0' }}>
                Upload Your Official College Resume Format
              </h3>

              <p style={{ fontSize: '0.86rem', color: '#66615B', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                Upload the template provided by your college placement cell (PDF, Word DOCX, or scanned image). We detect the layout structure, institution headers, and tabular qualifications.
              </p>

              <label style={{
                display: 'block',
                border: '2px dashed #C88D2D',
                borderRadius: '16px',
                backgroundColor: '#FAF5ED',
                padding: '2.5rem 1.5rem',
                cursor: uploading ? 'wait' : 'pointer',
                transition: 'all 0.15s ease'
              }}>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                  onChange={handleTemplateUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />

                {uploading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={28} className="animate-spin" color="#781416" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#781416' }}>
                      Analyzing Layout & Running OCR Detection...
                    </span>
                  </div>
                ) : (
                  <div>
                    <Building size={32} color="#8A5D00" style={{ margin: '0 auto 0.75rem auto' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>
                      Click to Browse or Drag College Template Here
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#78716C', marginTop: '0.35rem' }}>
                      Supports PDF, DOCX, JPG, and PNG templates (Up to 20 MB)
                    </div>
                  </div>
                )}
              </label>

              {/* Sample standard template quick pick */}
              <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #EDE5D6' }}>
                <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 700 }}>
                  Don't have a template file handy?
                </span>
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCollegeName('Dr. A.P.J. Abdul Kalam Technical University (AKTU)');
                      setDetectedSections([
                        'CAREER OBJECTIVE',
                        'ACADEMIC QUALIFICATIONS',
                        'TECHNICAL SKILLS',
                        'CAPSTONE & ACADEMIC PROJECTS',
                        'SUMMER TRAINING & INTERNSHIPS',
                        'CERTIFICATIONS & ACHIEVEMENTS',
                        'PERSONAL DETAILS'
                      ]);
                      setStep(2);
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E8CD97',
                      borderRadius: '10px',
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer'
                    }}
                  >
                    Use Standard AKTU Placement Format
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FORMAT DETECTION & PREFERENCES */}
          {step === 2 && (
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#065F46' }}>
                    College Format Successfully Detected!
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#047857' }}>
                    Identified institution placement header, tabular academic qualifications, and standard sequence.
                  </div>
                </div>
              </div>

              {/* Editable Institution Name */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.80rem', fontWeight: 800, color: '#1F2421', display: 'block', marginBottom: '0.35rem' }}>
                  Institution / University Name (Header)
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={e => setCollegeName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #E8E2D5',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Detected Sections Checklist */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.80rem', fontWeight: 800, color: '#1F2421', display: 'block', marginBottom: '0.4rem' }}>
                  Section Layout Sequence:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {detectedSections.map((sec, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.75rem',
                      backgroundColor: '#FAF7F2',
                      borderRadius: '8px',
                      border: '1px solid #EDE5D6',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      color: '#44403C'
                    }}>
                      <span style={{ color: '#C88D2D', fontWeight: 900 }}>{idx + 1}.</span>
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #D6CBB8',
                    borderRadius: '10px',
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Upload Different Template
                </button>

                <button
                  type="button"
                  onClick={handleGenerateReplicatedResume}
                  disabled={isGenerating}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: isGenerating ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(120,20,22,0.2)'
                  }}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Compiling Replicated Resume...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate & Compare Previews</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SIDE-BY-SIDE COMPARISON REVIEW */}
          {step === 3 && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.85rem',
                marginBottom: '1rem',
                borderBottom: '1px solid #EDE5D6'
              }}>
                <div style={{ fontSize: '0.84rem', color: '#57534E' }}>
                  Comparing <strong>Original Template</strong> (Left) vs <strong>Generated Placement Resume</strong> (Right).
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (generatedPdfUrl) window.open(generatedPdfUrl, '_blank');
                    }}
                    style={{
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #E8DFCF',
                      borderRadius: '8px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#781416',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} /> PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D6CBB8',
                      borderRadius: '8px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Adjust Format Rules
                  </button>
                </div>
              </div>

              {/* Side-by-Side Dual Viewport */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: templateUrl ? '1fr 1fr' : '1fr',
                gap: '1.25rem',
                height: '620px'
              }}>
                {/* Left Panel: Original Template */}
                {templateUrl && (
                  <div style={{
                    backgroundColor: '#FAF7F2',
                    borderRadius: '16px',
                    border: '1.5px solid #E8E2D5',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      backgroundColor: '#F5EFE6',
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#78716C',
                      borderBottom: '1px solid #E8E2D5'
                    }}>
                      ORIGINAL COLLEGE TEMPLATE
                    </div>
                    <iframe
                      src={templateUrl}
                      title="Original College Template"
                      style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                )}

                {/* Right Panel: Generated Replicated Resume */}
                <div style={{
                  backgroundColor: '#0F172A',
                  borderRadius: '16px',
                  border: '1.5px solid #334155',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    backgroundColor: '#1E293B',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#34D399',
                    borderBottom: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>GENERATED STUDENT PLACEMENT RESUME</span>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>LaTeX Replicated Layout</span>
                  </div>
                  {generatedPdfUrl ? (
                    <iframe
                      src={`${generatedPdfUrl}#toolbar=0&view=FitH`}
                      title="Generated College Format Resume"
                      style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#FFFFFF' }}
                    />
                  ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                      Preview not available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
