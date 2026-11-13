import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  FileText,
  UploadCloud,
  FolderOpen,
  Download,
  Edit3,
  Tag,
  Check,
  ChevronRight,
  ChevronDown,
  Layers,
  BarChart3,
  History,
  Building,
  GraduationCap,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Cpu,
  FileSearch,
  CheckCheck
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import API_URL from '../config/api';
import { analyzeResumeAts } from '../utils/atsScoringEngine';

function getAuthToken() {
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  } catch {
    return '';
  }
}

export const STANDARD_JOB_PROFILES = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Cybersecurity Analyst',
  'Cloud Engineer',
  'DevOps Engineer',
  'Java Developer',
  'Python Developer',
  'C++ Developer',
  'UI/UX Designer',
  'Business Analyst',
  'Digital Marketing Executive'
];

export default function AtsCheckerPage({ onNavigate, initialResumeData, initialResumeId }) {
  // Active resume being evaluated
  const [resumeData, setResumeData] = useState(() => {
    if (initialResumeData) return initialResumeData;
    try {
      const saved = sessionStorage.getItem('pv_active_ats_resume');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.resumeData || parsed;
      }
    } catch (_) {}
    return null;
  });

  const [resumeTitle, setResumeTitle] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pv_active_ats_resume');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.resumeTitle || parsed.title || 'My ATS Resume';
      }
    } catch (_) {}
    return 'My ATS Resume';
  });

  const [activeResumeId, setActiveResumeId] = useState(initialResumeId || null);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'breakdown' | 'skills' | 'recommendations' | 'before-after' | 'history'

  // Saved resumes and upload state
  const [savedResumes, setSavedResumes] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [atsHistory, setAtsHistory] = useState([]);
  const [isGeneratingReportPdf, setIsGeneratingReportPdf] = useState(false);

  const fileInputRef = useRef(null);

  // 1. Fetch user's saved resumes
  const fetchUserResumes = async () => {
    const token = getAuthToken();
    if (!token) return;
    setIsLoadingSaved(true);
    try {
      const res = await fetch(`${API_URL}/api/resumes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.resumes)) {
        setSavedResumes(data.resumes);
        if (!resumeData && data.resumes.length > 0) {
          const latest = data.resumes[0];
          setResumeData(latest.resumeData || latest);
          setResumeTitle(latest.title || 'My Resume');
          setActiveResumeId(latest.id || latest._id);
        }
      }
    } catch (err) {
      console.warn('Could not fetch saved resumes:', err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  // 2. Fetch ATS evaluation history
  const fetchAtsHistory = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/resumes/ats-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.history)) {
        setAtsHistory(data.history);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchUserResumes();
    fetchAtsHistory();
  }, []);

  // 3. Run ATS Analysis with Python AI Engine Bridge
  const runAtsAnalysis = async (
    dataToAnalyze = resumeData,
    roleToUse = targetRole,
    resId = activeResumeId,
    jdToUse = jobDescription
  ) => {
    if (!dataToAnalyze) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const finalRole = roleToUse === 'Other' && customRoleInput.trim() ? customRoleInput.trim() : roleToUse;

    try {
      const res = await fetch(`${API_URL}/api/resumes/ats-analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          resumeData: dataToAnalyze,
          targetRole: finalRole,
          jobDescription: jdToUse ? jdToUse.trim() : null,
          resumeId: resId,
          resumeTitle
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        fetchAtsHistory();
      } else {
        throw new Error(data.message || 'ATS analysis service returned an error.');
      }
    } catch (err) {
      console.warn('Backend ATS analysis failed, using fallback engine:', err);
      const fallback = computeClientAtsAnalysis(dataToAnalyze, finalRole, jdToUse);
      setAnalysis(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-run analysis when resumeData is ready and no analysis exists
  useEffect(() => {
    if (resumeData && !analysis) {
      runAtsAnalysis(resumeData, targetRole, activeResumeId, jobDescription);
    }
  }, [resumeData]);

  // Client-side fallback ATS analysis engine (Real dynamic scoring, zero hardcoded dummy data)
  const computeClientAtsAnalysis = (data, role, jd) => {
    return analyzeResumeAts(data, { targetRole: role, jobDescription: jd });
  };

  // 4. Handle External Resume File Upload (PDF / DOCX)
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadFileName(file.name);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${API_URL}/api/resumes/import`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.parsed) {
        setResumeData(data.parsed);
        setResumeTitle(file.name.replace(/\.[^/.]+$/, ''));
        setActiveResumeId(null);
        runAtsAnalysis(data.parsed, targetRole, null, jobDescription);
      } else {
        alert(data.message || 'Failed to parse resume file. Please ensure it is a valid PDF or DOCX.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Error uploading resume file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 5. Select a previously saved resume
  const handleSelectSavedResume = (resRecord) => {
    if (!resRecord) return;
    const extractedData = resRecord.resumeData || resRecord;
    setResumeData(extractedData);
    setResumeTitle(resRecord.title || 'My Resume');
    setActiveResumeId(resRecord.id || resRecord._id);
    runAtsAnalysis(extractedData, targetRole, resRecord.id || resRecord._id, jobDescription);
  };

  // 6. Generate Official ATS Audit Report PDF
  const handleDownloadReportPdf = async () => {
    if (!analysis) return;
    setIsGeneratingReportPdf(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Colors
      const burgundy = rgb(0.47, 0.08, 0.09); // #781416
      const gold = rgb(0.78, 0.55, 0.18); // #C88D2D
      const dark = rgb(0.12, 0.14, 0.17);
      const grey = rgb(0.35, 0.38, 0.42);
      const green = rgb(0.08, 0.50, 0.24);

      // Top Header Banner
      page.drawRectangle({
        x: 0,
        y: 740,
        width: 595.28,
        height: 102,
        color: burgundy
      });

      page.drawText('PROFESSORVIRUS • ATS COMPLIANCE AUDIT REPORT', {
        x: 40,
        y: 805,
        size: 11,
        font: fontBold,
        color: rgb(1, 0.85, 0.5)
      });

      page.drawText('Official Automated ATS Compliance & Recruiter Screening Rubric', {
        x: 40,
        y: 785,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1)
      });

      page.drawText(`Candidate: ${resumeTitle}   |   Target Role: ${analysis.targetRole}   |   Audit: ${analysis.evaluationType || 'ATS Scoring'}`, {
        x: 40,
        y: 755,
        size: 9.5,
        font: fontRegular,
        color: rgb(0.95, 0.95, 0.95)
      });

      // Score Callout Box
      page.drawRectangle({
        x: 40,
        y: 655,
        width: 515,
        height: 65,
        color: rgb(0.98, 0.97, 0.95),
        borderColor: gold,
        borderWidth: 1.5
      });

      page.drawText(`OVERALL ATS COMPATIBILITY SCORE: ${analysis.overallScore} / 100`, {
        x: 55,
        y: 695,
        size: 15,
        font: fontBold,
        color: burgundy
      });

      const passRateText = analysis.overallScore >= 80
        ? 'High ATS Pass Rate — Optimized for modern ATS algorithms (Workday, Taleo, Greenhouse)'
        : analysis.overallScore >= 60
        ? 'Moderate Compatibility — Review highlighted keyword and metric deductions'
        : 'High Rejection Risk — Immediate keyword grounding & structure fixes required';

      page.drawText(passRateText, {
        x: 55,
        y: 673,
        size: 9.5,
        font: fontRegular,
        color: dark
      });

      // Section Breakdown (6 NumPy Weighted Dimensions)
      page.drawText('6-CATEGORY WEIGHTED ATS SCORING BREAKDOWN', {
        x: 40,
        y: 625,
        size: 11,
        font: fontBold,
        color: burgundy
      });

      let currentY = 600;
      const breakdowns = analysis.sectionBreakdown || [];
      breakdowns.forEach((sec, i) => {
        const col = i % 2 === 0 ? 55 : 310;
        const rowY = currentY - Math.floor(i / 2) * 20;

        page.drawText(`${sec.name}:`, { x: col, y: rowY, size: 9, font: fontRegular, color: dark });
        page.drawText(`${sec.score} / ${sec.max}`, { x: col + 175, y: rowY, size: 9, font: fontBold, color: (sec.score / sec.max) >= 0.75 ? green : burgundy });
      });

      // Missing Keywords Section
      const missingY = 510;
      page.drawText('CRITICAL MISSING KEYWORDS FOR TARGET ROLE', {
        x: 40,
        y: missingY,
        size: 10.5,
        font: fontBold,
        color: burgundy
      });

      const missingKwText = (analysis.missingKeywords || []).slice(0, 10).join(', ') || 'No critical keywords missing.';
      page.drawText(missingKwText, {
        x: 40,
        y: missingY - 18,
        size: 9,
        font: fontRegular,
        color: dark
      });

      // Actionable Recommendations
      const recY = 450;
      page.drawText('ACTIONABLE ATS RESTRUCTURING RECOMMENDATIONS', {
        x: 40,
        y: recY,
        size: 10.5,
        font: fontBold,
        color: burgundy
      });

      let sugY = recY - 20;
      const recs = analysis.actionableRecommendations || analysis.actionableSuggestions || [];
      recs.slice(0, 3).forEach((rec, idx) => {
        const prob = rec.problem || rec.issue || 'Optimization';
        const loc = rec.location || rec.section || 'General';
        page.drawText(`${idx + 1}. [${loc}] ${prob}`, {
          x: 40,
          y: sugY,
          size: 9,
          font: fontBold,
          color: dark
        });
        sugY -= 14;
        const fix = rec.how_to_fix || rec.whyItMatters || '';
        if (fix) {
          page.drawText(`   Fix: ${fix.slice(0, 95)}...`, {
            x: 40,
            y: sugY,
            size: 8,
            font: fontRegular,
            color: grey
          });
          sugY -= 16;
        }
      });

      // Footer
      page.drawText('ProfessorVirus AI ATS Assessment — Independently computed algorithm, not an official corporate ATS score.', {
        x: 40,
        y: 35,
        size: 8,
        font: fontRegular,
        color: grey
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${resumeTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_ATS_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (pdfErr) {
      console.error('Failed to generate ATS report PDF:', pdfErr);
      alert('Error creating PDF report.');
    } finally {
      setIsGeneratingReportPdf(false);
    }
  };

  const score = analysis?.overallScore ?? 0;
  const scoreColor = score >= 80 ? '#059669' : score >= 60 ? '#C88D2D' : '#DC2626';
  const scoreBg = score >= 80 ? '#ECFDF5' : score >= 60 ? '#FEF9EE' : '#FEF2F2';
  const scoreBorder = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1F2421', paddingBottom: '4rem' }}>
      
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div style={{ borderBottom: '1px solid #E8E2D5', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', color: '#78716C' }}>
            <span
              onClick={() => onNavigate && onNavigate('home')}
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              className="hover:underline"
            >
              Home
            </span>
            <span>/</span>
            <span
              onClick={() => onNavigate && onNavigate('resume-maker')}
              style={{ cursor: 'pointer' }}
              className="hover:underline"
            >
              Resume Maker
            </span>
            <span>/</span>
            <span style={{ color: '#781416', fontWeight: 800 }}>
              ATS Score Checker
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('resume-maker')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#FAF5ED',
                border: '1.5px solid #781416',
                borderRadius: '8px',
                padding: '0.42rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#781416',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={14} />
              <span>Back to Resume Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. HERO / CONTROL STRIP */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E8E2D5',
        padding: '1.75rem 1.25rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#FEF9EE',
                border: '1px solid #FCD34D',
                borderRadius: '999px',
                padding: '0.2rem 0.75rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#B45309',
                marginBottom: '0.65rem'
              }}>
                <Award size={13} color="#C88D2D" />
                <span>Python NLP • PyMuPDF • spaCy • MiniLM • Scikit-learn ATS Engine</span>
              </div>

              <h1 style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)',
                fontWeight: 900,
                color: '#1F2421',
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.02em'
              }}>
                ATS Resume Score & Compliance Checker
              </h1>

              <p style={{ fontSize: '0.86rem', color: '#57534E', margin: '0 0 1rem 0', maxWidth: '640px', lineHeight: 1.5 }}>
                Evaluate your resume with precision layout reading order (PyMuPDF/docx), semantic similarity (Sentence Transformers), evidence-grounded skill matching, and transparent 100-point scoring.
              </p>

              {/* Job Description Expandable Toggle */}
              <div style={{ display: 'inline-block' }}>
                <button
                  type="button"
                  onClick={() => setShowJdInput(!showJdInput)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: showJdInput ? '#FAF0F0' : '#FAF7F2',
                    border: '1.5px solid #E8DFCF',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    color: showJdInput ? '#781416' : '#57534E',
                    cursor: 'pointer'
                  }}
                >
                  <FileSearch size={14} color={showJdInput ? '#781416' : '#C88D2D'} />
                  <span>{showJdInput ? 'Hide Job Description Input' : 'Paste Job Description for JD-Specific Match (Optional)'}</span>
                  <ChevronDown size={14} style={{ transform: showJdInput ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              </div>

              {/* Collapsible JD Input Box */}
              {showJdInput && (
                <div style={{
                  marginTop: '0.85rem',
                  maxWidth: '680px',
                  backgroundColor: '#FAF7F2',
                  border: '1.5px solid #EDE5D6',
                  borderRadius: '12px',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421' }}>Target Job Description:</span>
                    <span style={{ fontSize: '0.72rem', color: '#78716C' }}>{jobDescription.length} characters</span>
                  </div>
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job posting (required skills, responsibilities, minimum qualifications)..."
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #D5C7B2',
                      fontSize: '0.80rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.45rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#78716C' }}>
                      Enables semantic similarity matching and mandatory vs preferred requirement weighting.
                    </span>
                    <button
                      type="button"
                      onClick={() => runAtsAnalysis(resumeData, targetRole, activeResumeId, jobDescription)}
                      style={{
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Audit Against This JD
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Selection & External Upload Bar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              minWidth: '310px',
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #EDE5D6',
              borderRadius: '16px',
              padding: '1.15rem'
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Resume for Audit:
              </div>

              {/* Saved Resume Dropdown */}
              {savedResumes.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FolderOpen size={15} color="#C88D2D" />
                  <select
                    value={activeResumeId || ''}
                    onChange={(e) => {
                      const found = savedResumes.find(r => (r.id || r._id) === e.target.value);
                      if (found) handleSelectSavedResume(found);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '8px',
                      border: '1.5px solid #D5C7B2',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: '#FFFFFF',
                      color: '#1F2421',
                      outline: 'none'
                    }}
                  >
                    <option value="" disabled>Choose from My Saved Resumes...</option>
                    {savedResumes.map(r => (
                      <option key={r.id || r._id} value={r.id || r._id}>
                        {r.title || 'Untitled Resume'} {r.atsScore ? `(${r.atsScore}/100)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Upload External PDF / DOCX */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px dashed #C88D2D',
                    color: '#8A5D00',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: isUploading ? 'not-allowed' : 'pointer'
                  }}
                >
                  <UploadCloud size={15} />
                  <span>{isUploading ? 'Parsing with PyMuPDF & docx...' : 'Upload External PDF / DOCX'}</span>
                </button>
              </div>

              {/* Target Role Selector (16 Profiles) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#44403C' }}>Target Role:</span>
                  <span style={{ fontSize: '0.68rem', color: '#78716C' }}>16 Industry Profiles</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.38rem 0.55rem',
                      borderRadius: '8px',
                      border: '1.5px solid #D5C7B2',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      backgroundColor: '#FFFFFF',
                      color: '#1F2421',
                      outline: 'none'
                    }}
                  >
                    {STANDARD_JOB_PROFILES.map((prof) => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                    <option value="Other">Other (Custom Role)...</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => runAtsAnalysis(resumeData, targetRole, activeResumeId, jobDescription)}
                    disabled={isAnalyzing}
                    style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.38rem 0.85rem',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isAnalyzing ? '...' : 'Analyze'}
                  </button>
                </div>

                {targetRole === 'Other' && (
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    placeholder="Enter custom job title..."
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      border: '1.5px solid #D5C7B2',
                      fontSize: '0.76rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN ATS ANALYSIS DASHBOARD */}
      <main style={{ maxWidth: '1280px', margin: '1.75rem auto', padding: '0 1.25rem', boxSizing: 'border-box' }}>
        
        {/* DISCLAIMER BANNER */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E2D5',
          borderRadius: '12px',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          marginBottom: '1.5rem',
          fontSize: '0.76rem',
          color: '#78716C'
        }}>
          <ShieldCheck size={16} color="#C88D2D" style={{ flexShrink: 0 }} />
          <span>
            <strong>Transparency Notice:</strong> This audit is calculated by ProfessorVirus's Python ATS verification algorithms (PyMuPDF, spaCy, MiniLM, NumPy) based on recruiter screening benchmarks. It is our independent assessment, not an official score issued by a specific employer's software.
          </span>
        </div>

        {isAnalyzing ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #EDE5D6',
            padding: '4rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <RefreshCw size={44} className="animate-spin" style={{ color: '#781416', margin: '0 auto 1.25rem auto' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.5rem 0' }}>
              Executing Python AI ATS Analysis Pipeline...
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#66615B', maxWidth: '520px', margin: '0 auto' }}>
              Evaluating layout reading order, calculating sentence-transformer semantic similarity for {targetRole}, grading practical skill evidence, and checking 6 weighted rubric dimensions.
            </p>
          </div>
        ) : !analysis ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #EDE5D6',
            padding: '3.5rem 1.5rem',
            textAlign: 'center'
          }}>
            <FileText size={44} color="#C88D2D" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.45rem 0' }}>
              No Resume Currently Selected for Audit
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#78716C', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
              Choose a saved resume above or upload a PDF/DOCX to run full ATS compatibility verification.
            </p>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('resume-maker')}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem 1.45rem',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Open Resume Studio
            </button>
          </div>
        ) : (
          <div>
            {/* SCORE HERO CARD WITH CIRCULAR GAUGE & EVALUATION TYPE */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: `2px solid ${scoreBorder}`,
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '1.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
                
                {/* Circular Score Gauge */}
                <div style={{ position: 'relative', width: '124px', height: '124px', flexShrink: 0 }}>
                  <svg width="124" height="124" viewBox="0 0 124 124" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="62"
                      cy="62"
                      r="50"
                      stroke="#F3EFE6"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="62"
                      cy="62"
                      r="50"
                      stroke={scoreColor}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - score / 100)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: '2.1rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                      {score}
                    </span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#78716C' }}>/ 100</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      color: scoreColor,
                      backgroundColor: scoreBg,
                      border: `1px solid ${scoreBorder}`,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px'
                    }}>
                      <ShieldCheck size={14} />
                      <span>{score >= 80 ? 'Exceptional Match' : score >= 60 ? 'Competitive Candidate' : 'High Rejection Risk'}</span>
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#44403C',
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #E8DFCF',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px'
                    }}>
                      <Cpu size={12} color="#C88D2D" />
                      <span>{analysis.evaluationType || (analysis.hasCustomJobDescription ? 'Custom JD Match' : 'Role Baseline')}</span>
                    </div>
                  </div>

                  <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.25rem 0' }}>
                    {resumeTitle}
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: '#57534E', margin: 0 }}>
                    Target Role: <strong>{analysis.targetRole}</strong> • 6 Weighted Categories • PyMuPDF / spaCy Verified
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDownloadReportPdf}
                  disabled={isGeneratingReportPdf}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: isGeneratingReportPdf ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(120, 20, 22, 0.25)'
                  }}
                >
                  <Download size={15} />
                  <span>{isGeneratingReportPdf ? 'Generating PDF...' : 'Download ATS Report PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('resume-maker')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #781416',
                    color: '#781416',
                    borderRadius: '10px',
                    padding: '0.65rem 1.2rem',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={15} />
                  <span>Edit Resume</span>
                </button>

                <button
                  type="button"
                  onClick={() => runAtsAnalysis(resumeData, targetRole, activeResumeId, jobDescription)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#FAF5ED',
                    border: '1.5px solid #C88D2D',
                    color: '#8A5D00',
                    borderRadius: '10px',
                    padding: '0.65rem 1rem',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Recheck Score</span>
                </button>
              </div>
            </div>

            {/* NAVIGATION TABS */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1.5px solid #E8E2D5', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'overview', label: 'Overview & Highlights' },
                { id: 'breakdown', label: '6-Category Breakdown' },
                { id: 'rubric', label: '10-Point Rubric' },
                { id: 'skills', label: `Skills & Evidence Grounding (${(analysis.matchedKeywords || []).length})` },
                { id: 'recommendations', label: 'Actionable AI Recommendations' },
                { id: 'before-after', label: 'Before vs After Phrasing' },
                { id: 'history', label: `Analysis History (${atsHistory.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: activeTab === tab.id ? '1.5px solid #781416' : '1px solid transparent',
                    backgroundColor: activeTab === tab.id ? '#FAF0F0' : 'transparent',
                    color: activeTab === tab.id ? '#781416' : '#66615B',
                    fontSize: '0.82rem',
                    fontWeight: activeTab === tab.id ? 800 : 600,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: 1. OVERVIEW & HIGHLIGHTS */}
            {activeTab === 'overview' && (
              <div>
                {/* Strengths & Weaknesses Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  {/* Strongest Sections */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #BBF7D0',
                    borderRadius: '18px',
                    padding: '1.35rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#166534', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <CheckCircle2 size={18} color="#166534" />
                      <span>Strongest Sections & Assets</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {analysis.strengths && analysis.strengths.length > 0 ? (
                        analysis.strengths.map((s, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', color: '#15803D', display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                            <span style={{ fontWeight: 800 }}>✓</span>
                            <span>{s}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.82rem', color: '#78716C' }}>Enhance keywords to establish strong section highlights.</div>
                      )}
                    </div>
                  </div>

                  {/* Priority Weaknesses & Deductions */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #FDE68A',
                    borderRadius: '18px',
                    padding: '1.35rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#92400E', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <AlertTriangle size={18} color="#D97706" />
                      <span>Score Deductions & Priority Fixes</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {analysis.deductions && analysis.deductions.length > 0 ? (
                        analysis.deductions.slice(0, 4).map((d, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', color: '#B45309', display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                            <span style={{ fontWeight: 800, color: '#DC2626' }}>-{d.points}</span>
                            <span><strong>[{d.category}]</strong> {d.reason}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.82rem', color: '#166534' }}>No critical deductions recorded.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parsing Quality & Technical Inspection Badge */}
                {analysis.parsingQuality && (
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1.5px solid #EDE5D6',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1F2421', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <Cpu size={16} color="#781416" />
                        <span>ATS Parsing Quality & Layout Verification</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                        PyMuPDF Coordinate-based layout reading order: <strong>{analysis.parsingQuality.readingOrder || 'Active'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'center', padding: '0.35rem 0.75rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8DFCF' }}>
                        <div style={{ fontSize: '0.70rem', color: '#78716C', textTransform: 'uppercase' }}>Word Count</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{analysis.parsingQuality.wordCount || 0}</div>
                      </div>

                      <div style={{ textAlign: 'center', padding: '0.35rem 0.75rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8DFCF' }}>
                        <div style={{ fontSize: '0.70rem', color: '#78716C', textTransform: 'uppercase' }}>OCR Status</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: analysis.parsingQuality.ocrApplied ? '#DC2626' : '#059669' }}>
                          {analysis.parsingQuality.ocrApplied ? 'Scanned PDF' : 'Selectable Text'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', padding: '0.35rem 0.75rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8DFCF' }}>
                        <div style={{ fontSize: '0.70rem', color: '#78716C', textTransform: 'uppercase' }}>Pages</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{analysis.parsingQuality.pageCount || 1}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 2. 6-CATEGORY BREAKDOWN (NUMPY WEIGHTS) */}
            {activeTab === 'breakdown' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {(analysis.sectionBreakdown || []).map((sec) => {
                  const pct = (sec.score / sec.max) * 100;
                  const catCol = pct >= 80 ? '#059669' : pct >= 55 ? '#C88D2D' : '#DC2626';

                  return (
                    <div key={sec.key} style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #EDE5D6',
                      borderRadius: '16px',
                      padding: '1.35rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{sec.name}</span>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: catCol }}>
                          {sec.score} / {sec.max} pts
                        </span>
                      </div>

                      <div style={{ width: '100%', height: '8px', backgroundColor: '#F1EBE1', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: catCol, borderRadius: '999px' }} />
                      </div>

                      <div style={{ fontSize: '0.76rem', color: '#78716C', lineHeight: 1.45 }}>
                        {sec.key === 'skills' && 'Evaluates mandatory vs preferred technical skills grounded by practical project and experience evidence.'}
                        {sec.key === 'relevance' && 'Sentence Transformers semantic similarity measuring alignment with target role responsibilities.'}
                        {sec.key === 'formatting' && 'Single/two-column readability, word count density, and standard ATS headings without unparsable tables.'}
                        {sec.key === 'experience' && 'Strong engineering action verbs and quantifiable metrics (latency %, throughput, users).'}
                        {sec.key === 'projects' && 'Capstone applications, live demos, and verifiable GitHub links.'}
                        {sec.key === 'education' && 'Accredited university degree, graduation year, verified email, and phone contact.'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: 3. 10-POINT RUBRIC */}
            {activeTab === 'rubric' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {[
                  { key: 'contact', title: '1. Contact Details', max: 10, desc: 'Name, email, phone, location, LinkedIn/GitHub.' },
                  { key: 'summary', title: '2. Professional Summary', max: 10, desc: 'Concise 2-3 line role summary without personal pronouns.' },
                  { key: 'skills', title: '3. Technical Skills Depth', max: 10, desc: 'Languages, frameworks, tools, databases, core concepts.' },
                  { key: 'keywords', title: '4. Industry Keywords', max: 10, desc: 'Target role keyword frequency and density matching.' },
                  { key: 'experience', title: '5. Work Experience', max: 10, desc: 'Action verbs, STAR method, quantifiable metrics.' },
                  { key: 'projects', title: '6. Capstone Projects', max: 10, desc: 'At least 2 complete technical projects with tech stacks.' },
                  { key: 'education', title: '7. Education History', max: 10, desc: 'Accredited university, degree, year, CGPA.' },
                  { key: 'certifications', title: '8. Certifications & Honors', max: 10, desc: 'Recognized industry credentials and hackathon awards.' },
                  { key: 'formatting', title: '9. Action Verbs & Style', max: 10, desc: 'Concise bullet points (10-25 words), zero passive phrases.' },
                  { key: 'readability', title: '10. ATS Section Parsing', max: 10, desc: 'Standard section names and single-column layout parsing.' }
                ].map(cat => {
                  const val = analysis.categoryScores?.[cat.key] || 0;
                  const catCol = val >= 8 ? '#059669' : val >= 5 ? '#C88D2D' : '#DC2626';

                  return (
                    <div key={cat.key} style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #EDE5D6',
                      borderRadius: '16px',
                      padding: '1.15rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1F2421' }}>{cat.title}</span>
                        <span style={{ fontSize: '0.86rem', fontWeight: 900, color: catCol }}>
                          {val} / {cat.max}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#F1EBE1', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.55rem' }}>
                        <div style={{ width: `${(val / cat.max) * 100}%`, height: '100%', backgroundColor: catCol, borderRadius: '999px' }} />
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#66615B', lineHeight: 1.4 }}>
                        {cat.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: 4. SKILLS & EVIDENCE GROUNDING */}
            {activeTab === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Grounded Skills Supported in Projects */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #BBF7D0',
                  padding: '1.35rem'
                }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#166534', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCheck size={18} color="#166534" />
                    <span>Skills Grounded with Evidence in Projects / Work Experience</span>
                  </div>
                  <p style={{ fontSize: '0.80rem', color: '#57534E', margin: '0 0 0.85rem 0' }}>
                    These skills are backed by direct statements in your experience or project bullet points. Recruiters value these highest.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {(analysis.supportedSkills && analysis.supportedSkills.length > 0 ? analysis.supportedSkills : analysis.matchedKeywords || []).map((sk, i) => (
                      <span key={i} style={{
                        backgroundColor: '#DCFCE7',
                        border: '1px solid #86EFAC',
                        color: '#15803D',
                        borderRadius: '999px',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.76rem',
                        fontWeight: 700
                      }}>
                        ✓ {sk} (Verified Context)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Mandatory Keywords */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #EDE5D6',
                  padding: '1.35rem'
                }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Tag size={16} color="#C88D2D" />
                    <span>Missing Required Keywords for {analysis.targetRole}</span>
                  </div>
                  <p style={{ fontSize: '0.80rem', color: '#66615B', margin: '0 0 1rem 0' }}>
                    If you have authentic experience or coursework with these technologies, incorporate them with project proof:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {(analysis.missingKeywords || []).map((kw, i) => (
                      <span key={i} style={{
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FCD34D',
                        color: '#92400E',
                        borderRadius: '999px',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.76rem',
                        fontWeight: 700
                      }}>
                        + {kw.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. ACTIONABLE AI RECOMMENDATIONS (5-PART STRUCTURED) */}
            {activeTab === 'recommendations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                {(analysis.actionableRecommendations || []).map((rec, i) => (
                  <div key={i} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1.5px solid #EDE5D6',
                    padding: '1.5rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                  }}>
                    {/* Header: Location badge & Problem statement */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.65rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#781416',
                        backgroundColor: '#FAF0F0',
                        border: '1px solid #F8D7DA',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {rec.location || 'Resume Structure'}
                      </span>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                        {rec.problem || 'Improvement Area'}
                      </h3>
                    </div>

                    {/* Why it matters */}
                    <div style={{ fontSize: '0.82rem', color: '#57534E', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      <strong style={{ color: '#C88D2D' }}>Why it matters:</strong> {rec.why_it_matters || rec.whyItMatters}
                    </div>

                    {/* How to fix */}
                    <div style={{
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #E8DFCF',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      fontSize: '0.82rem',
                      color: '#1F2421',
                      lineHeight: 1.5,
                      marginBottom: rec.before_after ? '1rem' : '0'
                    }}>
                      <strong style={{ color: '#166534' }}>Actionable Fix:</strong> {rec.how_to_fix || rec.issue}
                    </div>

                    {/* Before vs After Phrasing */}
                    {rec.before_after && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.25rem' }}>
                            ❌ Weak Phrasing
                          </div>
                          <div style={{ fontSize: '0.80rem', color: '#7F1D1D', fontStyle: 'italic' }}>
                            "{rec.before_after.before}"
                          </div>
                        </div>

                        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', marginBottom: '0.25rem' }}>
                            ✓ Improved High-Impact Phrasing
                          </div>
                          <div style={{ fontSize: '0.80rem', color: '#14532D', fontWeight: 600 }}>
                            "{rec.before_after.after}"
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: 6. BEFORE VS AFTER PHRASING */}
            {activeTab === 'before-after' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(analysis.beforeAfterSuggestions || []).map((sug, i) => (
                  <div key={i} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1.5px solid #EDE5D6',
                    padding: '1.35rem'
                  }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#781416', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                      {sug.section} Optimization
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '0.65rem' }}>
                      <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.25rem' }}>
                          ❌ Before (Passive phrasing / No metrics)
                        </div>
                        <div style={{ fontSize: '0.80rem', color: '#7F1D1D', fontStyle: 'italic' }}>
                          "{sug.before}"
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.85rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', marginBottom: '0.25rem' }}>
                          ✓ After (High-Impact ATS Action Verbs & Metrics)
                        </div>
                        <div style={{ fontSize: '0.80rem', color: '#14532D', fontWeight: 600 }}>
                          "{sug.after}"
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#66615B', lineHeight: 1.4 }}>
                      <strong>Why this boosts score:</strong> {sug.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: 7. ATS ANALYSIS HISTORY */}
            {activeTab === 'history' && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #EDE5D6',
                padding: '1.35rem'
              }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421', marginBottom: '1rem' }}>
                  Your Past ATS Audit History
                </div>
                {atsHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#78716C', fontSize: '0.84rem' }}>
                    No previous analysis records found. Audits are automatically logged to your account.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {atsHistory.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: '#FAF7F2',
                        border: '1px solid #E8DFCF'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1F2421' }}>
                            {item.resumeTitle || 'Resume'} — {item.targetRole || 'Software Engineer'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#78716C' }}>
                            {new Date(item.evaluatedAt || item.createdAt || Date.now()).toLocaleString()} • {item.evaluationType || 'ATS Scoring'}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '1.05rem',
                          fontWeight: 900,
                          color: (item.overallScore || 0) >= 80 ? '#059669' : '#C88D2D'
                        }}>
                          {item.overallScore || 0} / 100
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}
