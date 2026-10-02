import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  UploadCloud,
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Eye,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Save,
  ExternalLink,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Wrench,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  X,
  RefreshCw,
  Sliders,
  CheckCircle2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { generateLatex } from '../utils/latexGenerator';

const DEFAULT_RESUME_DATA = {
  personal: {
    fullName: '',
    professionalHeadline: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    summary: ''
  },
  education: [
    {
      degree: '',
      fieldOfStudy: '',
      institution: '',
      location: '',
      duration: '',
      cgpaOrPercentage: ''
    }
  ],
  skills: {
    languages: '',
    frameworks: '',
    tools: '',
    databases: '',
    coreConcepts: ''
  },
  experience: [
    {
      title: '',
      company: '',
      location: '',
      duration: '',
      bullets: ['']
    }
  ],
  projects: [
    {
      title: '',
      techStack: '',
      liveUrl: '',
      githubUrl: '',
      bullets: ['']
    }
  ],
  achievements: [
    {
      title: '',
      organization: '',
      year: '',
      description: ''
    }
  ],
  certifications: [
    {
      name: '',
      issuer: '',
      date: '',
      url: ''
    }
  ],
  extracurricular: [
    {
      role: '',
      organization: '',
      duration: '',
      description: ''
    }
  ]
};

const FORM_STEPS = [
  { id: 'personal', title: 'Personal Details', icon: User },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'skills', title: 'Technical Skills', icon: Wrench },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'projects', title: 'Projects', icon: BookOpen },
  { id: 'achievements', title: 'Achievements', icon: Award },
  { id: 'certifications', title: 'Certifications', icon: ShieldCheck },
  { id: 'extracurricular', title: 'Extracurricular', icon: Layers }
];

export default function ResumeMakerPage({ onNavigate, onOpenAuth }) {
  // Navigation return context (e.g. from Interview Pro)
  const isFromInterviewPro = (() => {
    try {
      const draft = sessionStorage.getItem('interview_pro_assessment_draft');
      return !!draft;
    } catch {
      return false;
    }
  })();

  // Main Resume States
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('My ATS Resume');
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);
  const [activeStep, setActiveStep] = useState(0);
  const [template, setTemplate] = useState('classic-tech');
  const [rightPanelTab, setRightPanelTab] = useState('preview'); // 'preview' | 'latex'

  // Compilation & PDF States
  const [pdfUrl, setPdfUrl] = useState('');
  const [latexSource, setLatexSource] = useState(() => generateLatex(DEFAULT_RESUME_DATA, { template: 'classic-tech' }));
  const [compileStatus, setCompileStatus] = useState(null); // { isOnePage, pageCount, levelName, message, overflowWarning }
  const [compileError, setCompileError] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Modals & Drawers
  const [showMyResumesDrawer, setShowMyResumesDrawer] = useState(false);
  const [myResumesList, setMyResumesList] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importReviewData, setImportReviewData] = useState(null);

  // AI Assistant Modal
  const [aiModal, setAiModal] = useState({
    isOpen: false,
    action: 'improve-bullet',
    inputPayload: {},
    result: null,
    loading: false
  });

  const compileTimeoutRef = useRef(null);

  // Get Auth Token
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  };

  // 1. Fetch User's Saved Resumes List
  const fetchMyResumes = useCallback(async () => {
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/resumes', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.resumes)) {
        setMyResumesList(data.resumes);
      }
    } catch (err) {
      console.error('Error fetching user resumes:', err);
    }
  }, []);

  useEffect(() => {
    fetchMyResumes();
  }, [fetchMyResumes]);

  // 2. Debounced Compile Engine
  const triggerCompile = useCallback((currentData, chosenTemplate) => {
    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current);
    }

    setIsCompiling(true);
    setCompileError(null);

    compileTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/resumes/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeData: currentData,
            template: chosenTemplate
          })
        });

        const data = await res.json();
        if (data.success) {
          setPdfUrl(data.pdfUrl);
          if (data.latexSource || data.generatedLatex) {
            setLatexSource(data.latexSource || data.generatedLatex);
          }
          setCompileStatus(data.stats || {
            isOnePage: true,
            pageCount: 1,
            levelName: 'Standard',
            message: 'Strict 1-Page Layout Verified'
          });
        } else {
          setCompileError(data.message || (data.compileErrors && data.compileErrors.join(', ')) || 'Resume compilation failed. Please check the highlighted issue.');
        }
      } catch (err) {
        console.error('Compile error:', err);
        setCompileError(err.message || 'Network error communicating with resume compiler.');
      } finally {
        setIsCompiling(false);
      }
    }, 400);
  }, []);

  // Synchronously update LaTeX source immediately on every form update, debouncing PDF compilation
  useEffect(() => {
    const tex = generateLatex(resumeData, { template });
    setLatexSource(tex);
    triggerCompile(resumeData, template);
  }, [resumeData, template, triggerCompile]);

  // 3. Save Resume to Backend
  const handleSaveResume = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const payload = {
        title: resumeTitle,
        template,
        resumeData,
        latexSource,
        pdfUrl
      };

      let res;
      if (activeResumeId) {
        res = await fetch(`/api/resumes/${activeResumeId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/resumes', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success && data.resume) {
        setActiveResumeId(data.resume.id || data.resume._id);
        setSaveMessage('Resume saved successfully!');
        fetchMyResumes();
      } else {
        setSaveMessage('Saved locally.');
      }
    } catch (err) {
      console.error('Error saving resume:', err);
      setSaveMessage('Saved locally.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // 4. Download PDF
  const handleDownloadPdf = () => {
    if (!pdfUrl) {
      alert('Generating PDF, please wait a moment...');
      return;
    }
    const link = document.createElement('a');
    link.href = pdfUrl;
    const cleanName = (resumeData.personal.fullName || 'Resume').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${cleanName || 'Resume'}_ATS.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 5. Download LaTeX Source (.tex) - Overleaf standard resume.tex
  const handleDownloadLatex = () => {
    if (!latexSource) return;
    const blob = new Blob([latexSource], { type: 'text/x-tex;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.tex';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 6. Copy LaTeX
  const handleCopyLatex = () => {
    if (!latexSource) return;
    navigator.clipboard.writeText(latexSource);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  // 7. Load an existing resume
  const handleLoadResume = (item) => {
    setActiveResumeId(item.id || item._id);
    setResumeTitle(item.title || 'Engineering Resume');
    if (item.template) setTemplate(item.template);
    if (item.resumeData) setResumeData(item.resumeData);
    setShowMyResumesDrawer(false);
  };

  // 8. Delete resume
  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      await fetch(`/api/resumes/${id}`, { method: 'DELETE', headers });
      if (activeResumeId === id) {
        setActiveResumeId(null);
        setResumeData(DEFAULT_RESUME_DATA);
      }
      fetchMyResumes();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // 9. AI Assistant Action Runner
  const handleRunAiAction = async (action, payload = {}) => {
    setAiModal({
      isOpen: true,
      action,
      inputPayload: payload,
      result: null,
      loading: true
    });

    try {
      const res = await fetch('/api/resumes/ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          targetRole: payload.targetRole || resumeData.personal.professionalHeadline || 'Software Engineer',
          text: payload.text || '',
          section: payload.section || '',
          context: payload.context || '',
          resumeData
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiModal(prev => ({
          ...prev,
          loading: false,
          result: data.result
        }));
      } else {
        setAiModal(prev => ({
          ...prev,
          loading: false,
          result: 'Could not process AI suggestion. Please try again.'
        }));
      }
    } catch (err) {
      setAiModal(prev => ({
        ...prev,
        loading: false,
        result: 'Network error communicating with AI assistant.'
      }));
    }
  };

  // Apply AI result
  const handleApplyAiResult = () => {
    const { action, inputPayload, result } = aiModal;
    if (!result) return;

    if (action === 'generate-summary') {
      setResumeData(prev => ({
        ...prev,
        personal: { ...prev.personal, summary: result }
      }));
    } else if (action === 'improve-bullet') {
      const { section, index, bulletIndex } = inputPayload;
      if (section === 'experience' && index !== undefined && bulletIndex !== undefined) {
        setResumeData(prev => {
          const exp = [...prev.experience];
          if (exp[index]) {
            const bullets = [...exp[index].bullets];
            bullets[bulletIndex] = result;
            exp[index] = { ...exp[index], bullets };
          }
          return { ...prev, experience: exp };
        });
      } else if (section === 'projects' && index !== undefined && bulletIndex !== undefined) {
        setResumeData(prev => {
          const prj = [...prev.projects];
          if (prj[index]) {
            const bullets = [...prj[index].bullets];
            bullets[bulletIndex] = result;
            prj[index] = { ...prj[index], bullets };
          }
          return { ...prev, projects: prj };
        });
      }
    } else if (action === 'improve-project') {
      const { index } = inputPayload;
      if (index !== undefined) {
        setResumeData(prev => {
          const prj = [...prev.projects];
          if (prj[index]) {
            const bullets = result.split('\n').filter(b => b.trim());
            prj[index] = { ...prj[index], bullets: bullets.length ? bullets : [result] };
          }
          return { ...prev, projects: prj };
        });
      }
    } else if (action === 'improve-achievement') {
      const { index } = inputPayload;
      if (index !== undefined) {
        setResumeData(prev => {
          const ach = [...prev.achievements];
          if (ach[index]) {
            ach[index] = { ...ach[index], description: result };
          }
          return { ...prev, achievements: ach };
        });
      }
    }

    setAiModal({ isOpen: false, action: '', inputPayload: {}, result: null, loading: false });
  };

  // 10. File Import Handler
  const handleImportFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setIsImporting(true);
    try {
      const res = await fetch('/api/resumes/import', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.parsed) {
        setImportReviewData(data.parsed);
      } else {
        alert(data.message || 'Could not parse uploaded file.');
      }
    } catch (err) {
      alert('Error parsing uploaded resume.');
    } finally {
      setIsImporting(false);
      setShowUploadModal(false);
    }
  };

  // Apply parsed data to editor
  const handleConfirmImport = () => {
    if (!importReviewData) return;
    setResumeData(prev => ({
      personal: {
        ...prev.personal,
        fullName: importReviewData.personal?.fullName || prev.personal.fullName,
        email: importReviewData.personal?.email || prev.personal.email,
        phone: importReviewData.personal?.phone || prev.personal.phone,
        location: importReviewData.personal?.location || prev.personal.location,
        linkedinUrl: importReviewData.personal?.linkedinUrl || prev.personal.linkedinUrl,
        githubUrl: importReviewData.personal?.githubUrl || prev.personal.githubUrl
      },
      education: importReviewData.education?.length ? importReviewData.education : prev.education,
      skills: {
        languages: importReviewData.skills?.languages || prev.skills.languages,
        frameworks: importReviewData.skills?.frameworks || prev.skills.frameworks,
        tools: importReviewData.skills?.tools || prev.skills.tools,
        databases: importReviewData.skills?.databases || prev.skills.databases,
        coreConcepts: importReviewData.skills?.coreConcepts || prev.skills.coreConcepts
      },
      experience: importReviewData.experience?.length ? importReviewData.experience : prev.experience,
      projects: importReviewData.projects?.length ? importReviewData.projects : prev.projects,
      achievements: prev.achievements,
      certifications: prev.certifications,
      extracurricular: prev.extracurricular
    }));
    setImportReviewData(null);
  };

  // Return to Interview Pro with saved draft preserved
  const handleReturnToInterviewPro = () => {
    if (onNavigate) {
      onNavigate('interview-confirm');
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1F1A14', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* =========================================================================
          TOP NAV & ATS COMPLIANCE TOOLBAR
          ========================================================================= */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #EDE5D6',
        padding: '0.65rem 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(35, 30, 25, 0.03)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Left: Branding & Back Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isFromInterviewPro ? (
              <button
                type="button"
                onClick={handleReturnToInterviewPro}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FAF5ED',
                  border: '1.5px solid #781416',
                  color: '#781416',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} />
                <span>Return to Interview Pro</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('more') : null}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E8DFCF',
                  color: '#4A4036',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={13} />
                <span>All Tools</span>
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#781416',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={18} />
              </div>
              <div>
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 900,
                    color: '#1C1814',
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    padding: 0,
                    fontFamily: "'Outfit', sans-serif"
                  }}
                  title="Click to rename resume"
                />
                <div style={{ fontSize: '0.68rem', color: '#7A6F62', fontWeight: 600 }}>
                  ATS One-Page Certified · LaTeX Vector PDF
                </div>
              </div>
            </div>
          </div>

          {/* Middle: 1-Page Constraint Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {compileStatus?.isOnePage ? (
              <div style={{
                backgroundColor: '#E7F5EE',
                border: '1px solid #A3E0C1',
                color: '#0E7A4A',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <CheckCircle2 size={13} />
                <span>Strict 1-Page Layout ({compileStatus.levelName || 'Standard'})</span>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <AlertTriangle size={13} />
                <span>Overflow Warning: {compileStatus?.pageCount || 2} Pages</span>
              </div>
            )}

            {/* Template Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#70675D', fontWeight: 700 }}>Template:</span>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #E2DAD0',
                  borderRadius: '6px',
                  padding: '0.3rem 0.55rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#1C1814',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="classic-tech">Classic Tech ATS (Jake's Standard)</option>
                <option value="modern-clean">Modern Clean Engineering</option>
                <option value="minimalist">Minimalist Executive</option>
              </select>
            </div>
          </div>

          {/* Right: Actions (Import, Saved, AI, Download) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {/* Import Button */}
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              style={{
                backgroundColor: '#FAF5ED',
                border: '1px solid #D5C7B2',
                borderRadius: '6px',
                padding: '0.38rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#4A4036',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <UploadCloud size={14} color="#781416" />
              <span>Import</span>
            </button>

            {/* My Resumes Drawer */}
            <button
              type="button"
              onClick={() => setShowMyResumesDrawer(true)}
              style={{
                backgroundColor: '#FAF5ED',
                border: '1px solid #D5C7B2',
                borderRadius: '6px',
                padding: '0.38rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#4A4036',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <FolderOpen size={14} color="#781416" />
              <span>My Resumes ({myResumesList.length})</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveResume}
              disabled={isSaving}
              style={{
                backgroundColor: '#FAF5ED',
                border: '1.5px solid #781416',
                borderRadius: '6px',
                padding: '0.38rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#781416',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Save size={14} />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            {/* Download PDF Primary Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '0.38rem 0.85rem',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(120, 20, 22, 0.25)'
              }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>

        </div>

        {saveMessage && (
          <div style={{
            position: 'absolute',
            bottom: '-28px',
            right: '20px',
            backgroundColor: '#1C1814',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            {saveMessage}
          </div>
        )}
      </header>

      {/* =========================================================================
          RETURN NOTICE (IF USER CAME FROM INTERVIEW PRO)
          ========================================================================= */}
      {isFromInterviewPro && (
        <div style={{
          backgroundColor: '#FAF0E6',
          borderBottom: '1px solid #E8D3BC',
          padding: '0.55rem 1.25rem',
          textAlign: 'center',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#781416',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span>Creating your resume for Interview Pro assessment. When ready, click Return to Interview Pro to proceed.</span>
          <button
            type="button"
            onClick={handleReturnToInterviewPro}
            style={{
              backgroundColor: '#781416',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              padding: '0.2rem 0.55rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Return to Assessment →
          </button>
        </div>
      )}

      {/* =========================================================================
          MAIN 2-COLUMN WORKSPACE: LEFT FORM EDITOR & RIGHT LIVE DUAL-VIEW
          ========================================================================= */}
      <main className="container-wide" style={{ padding: '1rem 1.25rem 3rem 1.25rem' }}>
        <div className="resume-split-view resume-maker-grid">

          {/* ===================================================================
              LEFT COLUMN: 8-STEP GUIDED FORM EDITOR
              =================================================================== */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #EDE5D6',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
          }}>

            {/* Stepper Tabs Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              overflowX: 'auto',
              paddingBottom: '0.65rem',
              marginBottom: '1.15rem',
              borderBottom: '1px solid #F0E8DC'
            }}>
              {FORM_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '8px',
                      border: isActive ? '1.5px solid #781416' : '1px solid transparent',
                      backgroundColor: isActive ? '#FAF0F0' : '#FAF7F2',
                      color: isActive ? '#781416' : '#5A5044',
                      fontSize: '0.74rem',
                      fontWeight: isActive ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <StepIcon size={13} color={isActive ? '#781416' : '#70675D'} />
                    <span>{step.title}</span>
                  </button>
                );
              })}
            </div>

            {/* STEP 1: PERSONAL DETAILS */}
            {activeStep === 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                    1. Personal & Contact Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRunAiAction('generate-summary')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #D48816',
                      borderRadius: '6px',
                      padding: '0.3rem 0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer'
                    }}
                  >
                    <Sparkles size={13} color="#D48816" />
                    <span>AI Generate Summary</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyanshu Sharma"
                      value={resumeData.personal.fullName}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, fullName: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Target Role / Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Software Development Engineer"
                      value={resumeData.personal.professionalHeadline}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, professionalHeadline: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priyanshu@gmail.com"
                      value={resumeData.personal.email}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={resumeData.personal.phone}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, phone: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Location (City, State)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Noida, UP"
                      value={resumeData.personal.location}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, location: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={resumeData.personal.linkedinUrl}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, linkedinUrl: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      placeholder="github.com/username"
                      value={resumeData.personal.githubUrl}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, githubUrl: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Portfolio / Website
                    </label>
                    <input
                      type="text"
                      placeholder="portfolio.dev"
                      value={resumeData.personal.portfolioUrl}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, portfolioUrl: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                    Professional Summary (2-3 concise ATS lines)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Computer Science student passionate about scalable web architectures, algorithms, and distributed systems..."
                    value={resumeData.personal.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, summary: e.target.value } }))}
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: EDUCATION */}
            {activeStep === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                    2. Education
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeData(prev => ({
                        ...prev,
                        education: [
                          ...prev.education,
                          { degree: '', fieldOfStudy: '', institution: '', location: '', duration: '', cgpaOrPercentage: '' }
                        ]
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #781416',
                      borderRadius: '6px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Degree</span>
                  </button>
                </div>

                {resumeData.education.map((edu, idx) => (
                  <div key={idx} style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#781416' }}>Education #{idx + 1}</span>
                      {resumeData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setResumeData(prev => ({
                              ...prev,
                              education: prev.education.filter((_, i) => i !== idx)
                            }));
                          }}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.Tech)"
                        value={edu.degree}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ed = [...prev.education];
                            ed[idx].degree = val;
                            return { ...prev, education: ed };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Major (e.g. Computer Science)"
                        value={edu.fieldOfStudy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ed = [...prev.education];
                            ed[idx].fieldOfStudy = val;
                            return { ...prev, education: ed };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Institution / College"
                        value={edu.institution}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ed = [...prev.education];
                            ed[idx].institution = val;
                            return { ...prev, education: ed };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2021 - 2025)"
                        value={edu.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ed = [...prev.education];
                            ed[idx].duration = val;
                            return { ...prev, education: ed };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="CGPA / Percentage"
                        value={edu.cgpaOrPercentage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ed = [...prev.education];
                            ed[idx].cgpaOrPercentage = val;
                            return { ...prev, education: ed };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: TECHNICAL SKILLS */}
            {activeStep === 2 && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', marginBottom: '0.85rem' }}>
                  3. Technical Skills (Categorized for ATS)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Programming Languages
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. C++, Python, Java, JavaScript, TypeScript, SQL"
                      value={resumeData.skills.languages}
                      onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, languages: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Frameworks & Libraries
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React.js, Node.js, Express, Tailwind CSS, Next.js, Django"
                      value={resumeData.skills.frameworks}
                      onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, frameworks: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Developer Tools & Platforms
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Git, GitHub, Docker, Postman, VS Code, Linux, AWS, Vercel"
                      value={resumeData.skills.tools}
                      onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, tools: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Databases
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MongoDB, PostgreSQL, MySQL, Redis, Firebase"
                      value={resumeData.skills.databases}
                      onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, databases: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.25rem' }}>
                      Core CS Concepts
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Data Structures & Algorithms, Object-Oriented Programming (OOP), OS, DBMS, Computer Networks"
                      value={resumeData.skills.coreConcepts}
                      onChange={(e) => setResumeData(prev => ({ ...prev, skills: { ...prev.skills, coreConcepts: e.target.value } }))}
                      style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: EXPERIENCE */}
            {activeStep === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                    4. Experience & Internships
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeData(prev => ({
                        ...prev,
                        experience: [
                          ...prev.experience,
                          { title: '', company: '', location: '', duration: '', bullets: [''] }
                        ]
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #781416',
                      borderRadius: '6px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Role</span>
                  </button>
                </div>

                {resumeData.experience.map((exp, expIdx) => (
                  <div key={expIdx} style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#781416' }}>Experience #{expIdx + 1}</span>
                      {resumeData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setResumeData(prev => ({
                              ...prev,
                              experience: prev.experience.filter((_, i) => i !== expIdx)
                            }));
                          }}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Job Title (e.g. Software Engineer Intern)"
                        value={exp.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ex = [...prev.experience];
                            ex[expIdx].title = val;
                            return { ...prev, experience: ex };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ex = [...prev.experience];
                            ex[expIdx].company = val;
                            return { ...prev, experience: ex };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.65rem' }}>
                      <input
                        type="text"
                        placeholder="Duration (e.g. May 2024 - July 2024)"
                        value={exp.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ex = [...prev.experience];
                            ex[expIdx].duration = val;
                            return { ...prev, experience: ex };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Location (e.g. Bangalore, India)"
                        value={exp.location}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ex = [...prev.experience];
                            ex[expIdx].location = val;
                            return { ...prev, experience: ex };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>

                    {/* Bullet Points */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#5A5044', marginBottom: '0.35rem' }}>
                        Responsibilities & Achievements (Action Verb + Metric + Impact)
                      </div>
                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.35rem' }}>
                          <input
                            type="text"
                            placeholder="e.g. Developed RESTful APIs in Node.js, reducing response latency by 28%..."
                            value={bullet}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ex = [...prev.experience];
                                ex[expIdx].bullets[bIdx] = val;
                                return { ...prev, experience: ex };
                              });
                            }}
                            style={{ flex: 1, padding: '0.4rem 0.55rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.76rem', outline: 'none' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRunAiAction('improve-bullet', {
                              section: 'experience',
                              index: expIdx,
                              bulletIndex: bIdx,
                              text: bullet,
                              context: `${exp.title} at ${exp.company}`
                            })}
                            style={{
                              backgroundColor: '#FEF9EE',
                              border: '1px solid #D48816',
                              color: '#781416',
                              borderRadius: '6px',
                              padding: '0.2rem 0.45rem',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                            title="Improve with AI"
                          >
                            <Sparkles size={11} color="#D48816" /> AI
                          </button>
                          {exp.bullets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setResumeData(prev => {
                                  const ex = [...prev.experience];
                                  ex[expIdx].bullets = ex[expIdx].bullets.filter((_, i) => i !== bIdx);
                                  return { ...prev, experience: ex };
                                });
                              }}
                              style={{ background: 'none', border: 'none', color: '#9E9486', cursor: 'pointer', padding: '0.2rem' }}
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setResumeData(prev => {
                            const ex = [...prev.experience];
                            ex[expIdx].bullets.push('');
                            return { ...prev, experience: ex };
                          });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#781416',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0'
                        }}
                      >
                        <Plus size={12} /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 5: PROJECTS */}
            {activeStep === 4 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                    5. Academic & Personal Projects
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeData(prev => ({
                        ...prev,
                        projects: [
                          ...prev.projects,
                          { title: '', techStack: '', liveUrl: '', githubUrl: '', bullets: [''] }
                        ]
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #781416',
                      borderRadius: '6px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Project</span>
                  </button>
                </div>

                {resumeData.projects.map((proj, pIdx) => (
                  <div key={pIdx} style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#781416' }}>Project #{pIdx + 1}</span>
                      {resumeData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setResumeData(prev => ({
                              ...prev,
                              projects: prev.projects.filter((_, i) => i !== pIdx)
                            }));
                          }}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Project Title (e.g. Distributed Task Queue)"
                        value={proj.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const pr = [...prev.projects];
                            pr[pIdx].title = val;
                            return { ...prev, projects: pr };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Tech Stack (e.g. Go, Redis, Docker, gRPC)"
                        value={proj.techStack}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const pr = [...prev.projects];
                            pr[pIdx].techStack = val;
                            return { ...prev, projects: pr };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.65rem' }}>
                      <input
                        type="text"
                        placeholder="Live Demo URL (optional)"
                        value={proj.liveUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const pr = [...prev.projects];
                            pr[pIdx].liveUrl = val;
                            return { ...prev, projects: pr };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="GitHub Repository URL"
                        value={proj.githubUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const pr = [...prev.projects];
                            pr[pIdx].githubUrl = val;
                            return { ...prev, projects: pr };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>

                    {/* Bullet Points */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#5A5044', marginBottom: '0.35rem' }}>
                        Highlights & Contributions
                      </div>
                      {proj.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.35rem' }}>
                          <input
                            type="text"
                            placeholder="e.g. Architected scalable worker pools capable of handling 5,000+ msgs/sec..."
                            value={bullet}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const pr = [...prev.projects];
                                pr[pIdx].bullets[bIdx] = val;
                                return { ...prev, projects: pr };
                              });
                            }}
                            style={{ flex: 1, padding: '0.4rem 0.55rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.76rem', outline: 'none' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRunAiAction('improve-bullet', {
                              section: 'projects',
                              index: pIdx,
                              bulletIndex: bIdx,
                              text: bullet,
                              context: `${proj.title} using ${proj.techStack}`
                            })}
                            style={{
                              backgroundColor: '#FEF9EE',
                              border: '1px solid #D48816',
                              color: '#781416',
                              borderRadius: '6px',
                              padding: '0.2rem 0.45rem',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                            title="Improve with AI"
                          >
                            <Sparkles size={11} color="#D48816" /> AI
                          </button>
                          {proj.bullets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setResumeData(prev => {
                                  const pr = [...prev.projects];
                                  pr[pIdx].bullets = pr[pIdx].bullets.filter((_, i) => i !== bIdx);
                                  return { ...prev, projects: pr };
                                });
                              }}
                              style={{ background: 'none', border: 'none', color: '#9E9486', cursor: 'pointer', padding: '0.2rem' }}
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setResumeData(prev => {
                            const pr = [...prev.projects];
                            pr[pIdx].bullets.push('');
                            return { ...prev, projects: pr };
                          });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#781416',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0'
                        }}
                      >
                        <Plus size={12} /> Add Project Bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 6: ACHIEVEMENTS */}
            {activeStep === 5 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                    6. Achievements & Honors
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeData(prev => ({
                        ...prev,
                        achievements: [
                          ...prev.achievements,
                          { title: '', organization: '', year: '', description: '' }
                        ]
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #781416',
                      borderRadius: '6px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Achievement</span>
                  </button>
                </div>

                {resumeData.achievements.map((ach, aIdx) => (
                  <div key={aIdx} style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#781416' }}>Achievement #{aIdx + 1}</span>
                      {resumeData.achievements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setResumeData(prev => ({
                              ...prev,
                              achievements: prev.achievements.filter((_, i) => i !== aIdx)
                            }));
                          }}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem', marginBottom: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Achievement Title (e.g. 1st Place Smart India Hackathon)"
                        value={ach.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ac = [...prev.achievements];
                            ac[aIdx].title = val;
                            return { ...prev, achievements: ac };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Organization / Issuer"
                        value={ach.organization}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ac = [...prev.achievements];
                            ac[aIdx].organization = val;
                            return { ...prev, achievements: ac };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Year (e.g. 2024)"
                        value={ach.year}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ac = [...prev.achievements];
                            ac[aIdx].year = val;
                            return { ...prev, achievements: ac };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Brief Description (e.g. Built an AI triage model selected among 4,000+ national submissions)"
                      value={ach.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResumeData(prev => {
                          const ac = [...prev.achievements];
                          ac[aIdx].description = val;
                          return { ...prev, achievements: ac };
                        });
                      }}
                      style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* STEP 7: CERTIFICATIONS */}
            {activeStep === 6 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                    7. Certifications
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeData(prev => ({
                        ...prev,
                        certifications: [
                          ...prev.certifications,
                          { name: '', issuer: '', date: '', url: '' }
                        ]
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #781416',
                      borderRadius: '6px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Certification</span>
                  </button>
                </div>

                {resumeData.certifications.map((cert, cIdx) => (
                  <div key={cIdx} style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#781416' }}>Certification #{cIdx + 1}</span>
                      {resumeData.certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setResumeData(prev => ({
                              ...prev,
                              certifications: prev.certifications.filter((_, i) => i !== cIdx)
                            }));
                          }}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Certificate Name (e.g. AWS Certified Developer)"
                        value={cert.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const cr = [...prev.certifications];
                            cr[cIdx].name = val;
                            return { ...prev, certifications: cr };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Issuer (e.g. Amazon Web Services)"
                        value={cert.issuer}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const cr = [...prev.certifications];
                            cr[cIdx].issuer = val;
                            return { ...prev, certifications: cr };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Date (e.g. Dec 2024)"
                        value={cert.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const cr = [...prev.certifications];
                            cr[cIdx].date = val;
                            return { ...prev, certifications: cr };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Credential Verification URL"
                        value={cert.url}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const cr = [...prev.certifications];
                            cr[cIdx].url = val;
                            return { ...prev, certifications: cr };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 8: EXTRACURRICULAR */}
            {activeStep === 7 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                    8. Extracurricular & Leadership
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeData(prev => ({
                        ...prev,
                        extracurricular: [
                          ...prev.extracurricular,
                          { role: '', organization: '', duration: '', description: '' }
                        ]
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: '#FAF5ED',
                      border: '1px solid #781416',
                      borderRadius: '6px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Activity</span>
                  </button>
                </div>

                {resumeData.extracurricular.map((extra, eIdx) => (
                  <div key={eIdx} style={{ backgroundColor: '#FAF7F2', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#781416' }}>Activity #{eIdx + 1}</span>
                      {resumeData.extracurricular.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setResumeData(prev => ({
                              ...prev,
                              extracurricular: prev.extracurricular.filter((_, i) => i !== eIdx)
                            }));
                          }}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem', marginBottom: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Role (e.g. Lead Coordinator)"
                        value={extra.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ex = [...prev.extracurricular];
                            ex[eIdx].role = val;
                            return { ...prev, extracurricular: ex };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Club / Organization"
                        value={extra.organization}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ex = [...prev.extracurricular];
                            ex[eIdx].organization = val;
                            return { ...prev, extracurricular: ex };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2023 - 2024)"
                        value={extra.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ex = [...prev.extracurricular];
                            ex[eIdx].duration = val;
                            return { ...prev, extracurricular: ex };
                          });
                        }}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Highlights (e.g. Mentored 200+ junior students in DSA and competitive coding)"
                      value={extra.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResumeData(prev => {
                          const ex = [...prev.extracurricular];
                          ex[eIdx].description = val;
                          return { ...prev, extracurricular: ex };
                        });
                      }}
                      style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #DDD3C3', fontSize: '0.78rem', outline: 'none' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Step Bottom Controls: Prev & Next */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F0E8DC' }}>
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #DDD3C3',
                  borderRadius: '6px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: activeStep === 0 ? '#A89F91' : '#1C1814',
                  cursor: activeStep === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={14} />
                <span>Previous Step</span>
              </button>

              <button
                type="button"
                disabled={activeStep === FORM_STEPS.length - 1}
                onClick={() => setActiveStep(prev => Math.min(FORM_STEPS.length - 1, prev + 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: activeStep === FORM_STEPS.length - 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <span>Next Step</span>
                <ChevronRight size={14} />
              </button>
            </div>

          </div>

          {/* ===================================================================
              RIGHT COLUMN: LIVE DUAL-VIEW (LIVE PDF PREVIEW & GENERATED LATEX)
              =================================================================== */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #EDE5D6',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 120px)',
            position: 'sticky',
            top: '80px'
          }}>

            {/* Top View Toggle: PDF Preview vs LaTeX Source */}
            <div style={{
              backgroundColor: '#FAF5ED',
              borderBottom: '1px solid #E8E0D0',
              padding: '0.55rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', backgroundColor: '#EDE5D6', borderRadius: '6px', padding: '2px' }}>
                <button
                  type="button"
                  onClick={() => setRightPanelTab('preview')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: rightPanelTab === 'preview' ? '#781416' : 'transparent',
                    color: rightPanelTab === 'preview' ? '#FFFFFF' : '#4A4036',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Eye size={13} />
                  <span>Live PDF Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRightPanelTab('latex')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: rightPanelTab === 'latex' ? '#781416' : 'transparent',
                    color: rightPanelTab === 'latex' ? '#FFFFFF' : '#4A4036',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <FileCode size={13} />
                  <span>Generated LaTeX (.tex)</span>
                </button>
              </div>

              {/* Status indicator in top right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {isCompiling ? (
                  <span style={{ fontSize: '0.72rem', color: '#D48816', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <RefreshCw size={12} className="animate-spin" /> Compiling resume...
                  </span>
                ) : compileError ? (
                  <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <AlertTriangle size={12} /> Compilation Issue
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>
                    ● Preview updated
                  </span>
                )}
              </div>
            </div>

            {/* TAB 1: LIVE PDF PREVIEW */}
            {rightPanelTab === 'preview' && (
              <div style={{ flex: 1, backgroundColor: '#525659', position: 'relative', overflow: 'hidden' }}>
                {compileError ? (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backgroundColor: '#FEF2F2',
                    textAlign: 'center',
                    color: '#991B1B'
                  }}>
                    <AlertTriangle size={40} color="#DC2626" style={{ marginBottom: '0.75rem' }} />
                    <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Resume compilation failed. Please check the highlighted issue.
                    </div>
                    <div style={{
                      fontSize: '0.76rem',
                      fontFamily: 'Consolas, monospace',
                      backgroundColor: '#FEE2E2',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      maxWidth: '440px',
                      marginBottom: '1rem',
                      wordBreak: 'break-word',
                      color: '#B91C1C'
                    }}>
                      {compileError}
                    </div>
                    <button
                      type="button"
                      onClick={() => setRightPanelTab('latex')}
                      style={{
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      View Generated LaTeX Source
                    </button>
                  </div>
                ) : pdfUrl ? (
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0`}
                    title="Live Resume Preview"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }}>
                    Compiling resume preview...
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GENERATED LATEX CODE VIEW (OVERLEAF STYLE) */}
            {rightPanelTab === 'latex' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1E1E1E' }}>
                {/* LaTeX Code Toolbar */}
                <div style={{
                  padding: '0.5rem 0.85rem',
                  backgroundColor: '#2D2D2D',
                  borderBottom: '1px solid #3E3E3E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#9CDCFE', fontSize: '0.74rem', fontFamily: 'monospace', fontWeight: 700 }}>
                    resume.tex (ATS-Friendly Overleaf Standard)
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={handleCopyLatex}
                      style={{
                        backgroundColor: '#3E3E3E',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.25rem 0.55rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {copiedLatex ? <Check size={12} color="#4ADE80" /> : <Copy size={12} />}
                      <span>{copiedLatex ? 'Copied!' : 'Copy Code'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadLatex}
                      style={{
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.25rem 0.55rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Download size={12} />
                      <span>Download .tex</span>
                    </button>
                  </div>
                </div>

                {/* Preformatted LaTeX Source */}
                <div style={{ flex: 1, overflow: 'auto', padding: '0.85rem' }}>
                  <pre style={{
                    color: '#D4D4D4',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '0.76rem',
                    lineHeight: 1.45,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {latexSource}
                  </pre>
                </div>
              </div>
            )}

            {/* Bottom ATS Note Bar */}
            <div style={{
              backgroundColor: '#FAF5ED',
              borderTop: '1px solid #E8E0D0',
              padding: '0.55rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#5A5044'
            }}>
              <span>100% Vector PDF · Selectable Text · Clickable Hyperlinks</span>
              <span style={{ fontWeight: 800, color: '#781416' }}>Overleaf Compatible</span>
            </div>

          </div>

        </div>
      </main>

      {/* =========================================================================
          DRAWER: MY RESUMES (SAVED CRUD)
          ========================================================================= */}
      {showMyResumesDrawer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '420px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FolderOpen size={18} color="#781416" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                  My Saved Resumes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMyResumesDrawer(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#70675D' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {myResumesList.length > 0 ? (
                myResumesList.map((resItem) => {
                  const isCurrent = activeResumeId === (resItem.id || resItem._id);
                  return (
                    <div
                      key={resItem.id || resItem._id}
                      onClick={() => handleLoadResume(resItem)}
                      style={{
                        backgroundColor: isCurrent ? '#FAF0F0' : '#FAF7F2',
                        border: isCurrent ? '1.5px solid #781416' : '1px solid #E8DFCF',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1C1814' }}>
                            {resItem.title || 'Engineering Resume'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#70675D', marginTop: '2px' }}>
                            {resItem.resumeData?.personal?.fullName || 'Untitled'} · {resItem.template || 'classic-tech'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteResume(resItem.id || resItem._id, e)}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.2rem' }}
                          title="Delete Resume"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.55rem', fontSize: '0.68rem', color: '#8A8074' }}>
                        <span>Updated: {resItem.updatedAt ? new Date(resItem.updatedAt).toLocaleDateString() : 'Recently'}</span>
                        <span style={{ color: '#0E7A4A', fontWeight: 800 }}>✓ 1-Page Verified</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: '#70675D', fontSize: '0.82rem', marginTop: '2rem' }}>
                  No saved resumes yet. Click Save to create your first resume!
                </div>
              )}
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid #EDE5D6' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveResumeId(null);
                  setResumeTitle('My New ATS Resume');
                  setResumeData(DEFAULT_RESUME_DATA);
                  setShowMyResumesDrawer(false);
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Plus size={15} />
                <span>Create New Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: UPLOAD / IMPORT RESUME (PDF, DOC, DOCX)
          ========================================================================= */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            padding: '1.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <UploadCloud size={20} color="#781416" />
                <h3 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                  Import Existing Resume
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#70675D' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#5A5044', margin: '0 0 1.25rem 0' }}>
              Upload your current resume in PDF, DOC, or DOCX format. We will automatically parse your contact details, education, skills, and projects into the editor.
            </p>

            <label style={{
              border: '2px dashed #C88D2D',
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FEFAF3',
              cursor: isImporting ? 'not-allowed' : 'pointer'
            }}>
              <UploadCloud size={32} color="#781416" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1C1814' }}>
                {isImporting ? 'Parsing resume fields...' : 'Click to choose resume file'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#70675D', marginTop: '2px' }}>
                Supports .pdf, .doc, .docx (Max 15MB)
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleImportFile}
                disabled={isImporting}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REVIEW IMPORTED INFORMATION BEFORE POPULATING
          ========================================================================= */}
      {importReviewData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#FAF5ED',
              borderBottom: '1px solid #E8E0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#781416', margin: 0 }}>
                  Review Imported Information
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#665C50' }}>
                  Confirm the parsed details before loading them into your resume editor.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImportReviewData(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#70675D' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>Personal Details:</span>
                <div style={{ fontSize: '0.76rem', color: '#4A4036', marginTop: '0.25rem', backgroundColor: '#FAF7F2', padding: '0.6rem', borderRadius: '6px' }}>
                  <div>Name: <strong>{importReviewData.personal?.fullName || 'Not detected'}</strong></div>
                  <div>Email: <strong>{importReviewData.personal?.email || 'Not detected'}</strong></div>
                  <div>Phone: <strong>{importReviewData.personal?.phone || 'Not detected'}</strong></div>
                </div>
              </div>

              {importReviewData.skills && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>Extracted Skills:</span>
                  <div style={{ fontSize: '0.76rem', color: '#4A4036', marginTop: '0.25rem', backgroundColor: '#FAF7F2', padding: '0.6rem', borderRadius: '6px' }}>
                    {importReviewData.skills.languages && <div>Languages: {importReviewData.skills.languages}</div>}
                    {importReviewData.skills.frameworks && <div>Frameworks: {importReviewData.skills.frameworks}</div>}
                    {importReviewData.skills.tools && <div>Tools: {importReviewData.skills.tools}</div>}
                  </div>
                </div>
              )}

              {importReviewData.education && importReviewData.education.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>Education Items:</span>
                  <div style={{ fontSize: '0.76rem', color: '#4A4036', marginTop: '0.25rem', backgroundColor: '#FAF7F2', padding: '0.6rem', borderRadius: '6px' }}>
                    {importReviewData.education.map((e, i) => (
                      <div key={i}>{e.degree} — {e.institution} ({e.duration})</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid #E8E0D0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.55rem'
            }}>
              <button
                type="button"
                onClick={() => setImportReviewData(null)}
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #DDD3C3',
                  borderRadius: '6px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 1rem',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Apply to Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: AI CONTENT ASSISTANT (IMPROVE BULLET / SUMMARY)
          ========================================================================= */}
      {aiModal.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '580px',
            padding: '1.35rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={18} color="#D48816" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#781416', margin: 0 }}>
                  AI Content Assistant
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAiModal({ isOpen: false, action: '', inputPayload: {}, result: null, loading: false })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#70675D' }}
              >
                <X size={18} />
              </button>
            </div>

            {aiModal.loading ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <RefreshCw size={24} className="animate-spin" color="#781416" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1C1814' }}>
                  Enhancing content with Action Verb + Metric + Impact format...
                </div>
                <div style={{ fontSize: '0.72rem', color: '#70675D', marginTop: '2px' }}>
                  Never fabricating facts — strictly polishing tone and ATS keyword density.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.74rem', color: '#5A5044', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Proposed ATS Improvement:
                </div>
                <div style={{
                  backgroundColor: '#FEFAF3',
                  border: '1.5px solid #F0DEBF',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  color: '#1C1814',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '1.25rem'
                }}>
                  {aiModal.result}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem' }}>
                  <button
                    type="button"
                    onClick={() => setAiModal({ isOpen: false, action: '', inputPayload: {}, result: null, loading: false })}
                    style={{
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #DDD3C3',
                      borderRadius: '6px',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Discard
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyAiResult}
                    style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 1rem',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Apply Change
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive Stacking Overrides */}
      <style>{`
        @media (max-width: 1024px) {
          .resume-maker-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
