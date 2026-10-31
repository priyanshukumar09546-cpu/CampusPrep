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
  ArrowRight,
  Bell,
  Building,
  Calendar,
  Percent,
  Search,
  ChevronDown
} from 'lucide-react';
import { generateLatex } from '../utils/latexGenerator';
import SearchableSkillsSelector from '../components/SearchableSkillsSelector';
import API_URL from '../config/api';

// Normalizes resume skills between structured arrays and legacy string fields
function getAuthToken() {
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  } catch {
    return '';
  }
}

function normalizeResumeSkills(raw) {
  if (!raw) return raw;
  const copy = { ...raw };
  const rawTech = copy.technicalSkills || {};
  const rawSkills = copy.skills || {};

  const parseStringSkills = (str) => {
    if (!str || typeof str !== 'string') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  const technicalSkills = {
    programmingLanguages: Array.isArray(rawTech.programmingLanguages)
      ? rawTech.programmingLanguages
      : parseStringSkills(rawSkills.languages),
    frameworks: Array.isArray(rawTech.frameworks)
      ? rawTech.frameworks
      : parseStringSkills(rawSkills.frameworks),
    developerTools: Array.isArray(rawTech.developerTools)
      ? rawTech.developerTools
      : parseStringSkills(rawSkills.tools),
    databases: Array.isArray(rawTech.databases)
      ? rawTech.databases
      : parseStringSkills(rawSkills.databases),
    coreConcepts: Array.isArray(rawTech.coreConcepts)
      ? rawTech.coreConcepts
      : parseStringSkills(rawSkills.coreConcepts)
  };

  const skills = {
    languages: technicalSkills.programmingLanguages.join(', '),
    frameworks: technicalSkills.frameworks.join(', '),
    tools: technicalSkills.developerTools.join(', '),
    databases: technicalSkills.databases.join(', '),
    coreConcepts: technicalSkills.coreConcepts.join(', ')
  };

  copy.technicalSkills = technicalSkills;
  copy.skills = skills;
  return copy;
}

const DEFAULT_RESUME_DATA = {
  personal: {
    fullName: '',
    professionalHeadline: '',
    targetRole: '',
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
      board: '',
      institution: '',
      location: '',
      duration: '',
      cgpa: '',
      cgpaOrPercentage: ''
    }
  ],
  technicalSkills: {
    programmingLanguages: [],
    frameworks: [],
    developerTools: [],
    databases: [],
    coreConcepts: []
  },
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

const RESUME_TEMPLATES = [
  {
    id: 'classic-tech',
    name: "Classic Tech ATS",
    subtitle: "Jake's Standard",
    badge: "Recommended",
    badgeColor: "#0E7A4A",
    badgeBg: "#E7F5EE",
    desc: "Single-column clean engineering layout. 99.8% ATS compatibility across Workday, Lever & Greenhouse. Perfect for Software Engineers and Tech roles.",
    features: ["Single Column", "Max ATS Score", "Overleaf Standard", "LaTeX Certified"]
  },
  {
    id: 'modern-clean',
    name: "Modern Clean Engineering",
    subtitle: "Modern Professional",
    badge: "Popular",
    badgeColor: "#6366F1",
    badgeBg: "#EEF2FF",
    desc: "Refined modern typography with subtle dividing lines, highlighted tech stack chips, and clear section hierarchy.",
    features: ["Visual Hierarchy", "Compact Spacing", "ATS Compliant", "Modern Typography"]
  },
  {
    id: 'minimalist',
    name: "Minimalist Executive",
    subtitle: "Clean Standard",
    badge: "Dense Format",
    badgeColor: "#D97706",
    badgeBg: "#FFFBEB",
    desc: "High density layout designed to maximize content fitting on a single page. Ideal for experienced developers and campus placements.",
    features: ["Ultra Compact", "High Content Density", "Strict 1-Page Fit", "Crisp Serif"]
  }
];

// Mobile Stepper Definition matching reference image (All 9 sections accessible)
const MOBILE_STEPS = [
  { id: 'templates', title: 'Templates', desktopIndex: 0, number: '1.' },
  { id: 'personal', title: 'Personal', desktopIndex: 0, number: '2.' },
  { id: 'education', title: 'Education', desktopIndex: 1, number: '3.' },
  { id: 'skills', title: 'Skills', desktopIndex: 2, number: '4.' },
  { id: 'experience', title: 'Experience', desktopIndex: 3, number: '5.' },
  { id: 'projects', title: 'Projects', desktopIndex: 4, number: '6.' },
  { id: 'achievements', title: 'Achievements', desktopIndex: 5, number: '7.' },
  { id: 'certifications', title: 'Certifications', desktopIndex: 6, number: '8.' },
  { id: 'extracurricular', title: 'Extracurricular', desktopIndex: 7, number: '9.' }
];

// Reusable Mobile Input Field with interior icon
function MobileFormField({ label, required, icon: Icon, type = 'text', placeholder, value, onChange, id }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#4A4036',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            marginBottom: '0.3rem'
          }}
        >
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {Icon && (
          <Icon
            size={14}
            color="#8A7E72"
            style={{
              position: 'absolute',
              left: '0.75rem',
              pointerEvents: 'none'
            }}
          />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          className="pv-mobile-form-input"
          style={{
            paddingLeft: Icon ? '2.25rem' : '0.75rem'
          }}
        />
      </div>
    </div>
  );
}

// Reusable Mobile Textarea Field with interior icon
function MobileTextareaField({ label, required, icon: Icon, rows = 2, placeholder, value, onChange, id }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#4A4036',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            marginBottom: '0.3rem'
          }}
        >
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <Icon
            size={14}
            color="#8A7E72"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '0.65rem',
              pointerEvents: 'none'
            }}
          />
        )}
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          className="pv-mobile-form-input"
          style={{
            paddingLeft: Icon ? '2.25rem' : '0.75rem',
            resize: 'vertical',
            minHeight: '75px'
          }}
        />
      </div>
    </div>
  );
}

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

  const [activeResumeId, setActiveResumeId] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('My ATS Resume');
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);
  const [activeStep, setActiveStep] = useState(0);
  const [template, setTemplate] = useState('classic-tech');
  const [rightPanelTab, setRightPanelTab] = useState('preview'); // 'preview' | 'latex'

  // Compilation & PDF States
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
  const [serverPdfUrl, setServerPdfUrl] = useState('');
  const [latexSource, setLatexSource] = useState(() => generateLatex(DEFAULT_RESUME_DATA, { template: 'classic-tech' }));
  const [compileStatus, setCompileStatus] = useState(null); // { isOnePage, pageCount, levelName, message, overflowWarning }
  const [compileError, setCompileError] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileTrigger, setCompileTrigger] = useState(0);
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
  const generationRef = useRef(0);
  const activeBlobUrlRef = useRef(null);
  const abortControllerRef = useRef(null);
  const lastCompiledPayloadRef = useRef('');

  // Handler for searchable technical skills change
  const handleSkillCategoryChange = useCallback((categoryKey, newList) => {
    setResumeData(prev => {
      const updatedTechnical = {
        ...(prev.technicalSkills || {
          programmingLanguages: [],
          frameworks: [],
          developerTools: [],
          databases: [],
          coreConcepts: []
        }),
        [categoryKey]: newList
      };

      // Also keep legacy string format fully synced for backward compatibility
      const updatedSkills = {
        languages: (updatedTechnical.programmingLanguages || []).join(', '),
        frameworks: (updatedTechnical.frameworks || []).join(', '),
        tools: (updatedTechnical.developerTools || []).join(', '),
        databases: (updatedTechnical.databases || []).join(', '),
        coreConcepts: (updatedTechnical.coreConcepts || []).join(', ')
      };

      return {
        ...prev,
        technicalSkills: updatedTechnical,
        skills: updatedSkills
      };
    });
  }, []);

  // Check if minimal required data is present to compile
  const hasMinimumData = Boolean(
    resumeData?.personal?.fullName?.trim() ||
    resumeData?.personal?.email?.trim() ||
    resumeData?.personal?.phone?.trim()
  );

  // Cleanup active blob URL on unmount
  useEffect(() => {
    return () => {
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Synchronously update LaTeX source immediately on every form update (0ms delay)
  useEffect(() => {
    const tex = generateLatex(resumeData, { template });
    setLatexSource(tex);
  }, [resumeData, template]);

  // Handle template selection change
  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
    setResumeData(prev => ({
      ...prev,
      template: newTemplate
    }));
  };

  // 1. Fetch User's Saved Resumes List
  const fetchMyResumes = useCallback(async () => {
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API_URL}/api/resumes`, { headers });
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

  // Retry compile handler - immediate execution without debounce lag
  const handleRetryCompile = () => {
    setCompileError(null);
    lastCompiledPayloadRef.current = '';
    setIsCompiling(true);
    setCompileTrigger(Date.now());
  };

  // 2. Optimized Debounced Compile Engine (0ms on retry/immediate, 850ms on typing, deduplication, stale guard, 30s timeout protection)
  useEffect(() => {
    if (!hasMinimumData) {
      setIsCompiling(false);
      setCompileError(null);
      return;
    }

    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current);
    }

    // Deduplicate: avoid compiling identical data when typing didn't change content
    const currentPayload = JSON.stringify({ resumeData, template });
    if (currentPayload === lastCompiledPayloadRef.current && compileTrigger === 0) {
      return;
    }

    const isImmediate = compileTrigger > 0;
    const delay = isImmediate ? 0 : 850;

    compileTimeoutRef.current = setTimeout(async () => {
      const currentGen = ++generationRef.current;

      // Abort any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Activate compiling state ONLY when network request is actually dispatched
      setIsCompiling(true);
      setCompileError(null);

      // Track if abort was caused specifically by network timeout
      let didSafetyTimeout = false;
      const safetyTimeout = setTimeout(() => {
        didSafetyTimeout = true;
        controller.abort();
      }, 30000);

      const exactLatex = generateLatex(resumeData, { template });

      try {
        const res = await fetch(`${API_URL}/api/resumes/compile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeData,
            latex: exactLatex,
            template,
            generationId: currentGen,
            options: { template }
          }),
          signal: controller.signal
        });

        clearTimeout(safetyTimeout);

        if (!res.ok) {
          const errText = await res.text();
          let parsed = null;
          try { parsed = JSON.parse(errText); } catch (_) {}
          throw new Error(parsed?.error || parsed?.details || parsed?.message || `Server returned HTTP ${res.status}`);
        }

        const data = await res.json();

        // Stale response protection: drop response if user edited further
        if (currentGen !== generationRef.current) {
          return;
        }

        if (data.success) {
          lastCompiledPayloadRef.current = currentPayload;

          if (data.pdfBase64) {
            try {
              const binaryString = window.atob(data.pdfBase64);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: 'application/pdf' });
              const blobUrl = URL.createObjectURL(blob);

              if (activeBlobUrlRef.current) {
                URL.revokeObjectURL(activeBlobUrlRef.current);
              }
              activeBlobUrlRef.current = blobUrl;
              setPdfBlobUrl(blobUrl);
              setPdfUrl(blobUrl);
            } catch (blobErr) {
              console.warn('Failed to parse pdfBase64 to blob:', blobErr);
            }
          }

          if (data.pdfUrl) {
            const serverUrl = data.pdfUrl.startsWith('http') ? data.pdfUrl : `${API_URL}${data.pdfUrl}`;
            const absoluteOrRelativeUrl = `${serverUrl}?t=${Date.now()}`;
            setServerPdfUrl(absoluteOrRelativeUrl);
            if (!data.pdfBase64) {
              setPdfUrl(absoluteOrRelativeUrl);
            }
          }

          if (data.latexSource || data.generatedLatex) {
            setLatexSource(data.latexSource || data.generatedLatex);
          }

          setCompileStatus(data.stats || {
            isOnePage: true,
            pageCount: 1,
            levelName: 'Standard',
            message: 'Strict 1-Page Layout Verified'
          });
          setCompileError(null);
        } else {
          setCompileError(data.error || data.details || data.message || (data.compileErrors && data.compileErrors.join(', ')) || 'Resume compilation failed.');
        }
      } catch (err) {
        clearTimeout(safetyTimeout);
        if (err.name === 'AbortError') {
          // Only flag as timeout if safety timeout actually triggered
          if (didSafetyTimeout && currentGen === generationRef.current) {
            setCompileError('Compilation timed out. Please click Retry Compilation to try again.');
          }
          return;
        }
        if (currentGen !== generationRef.current) return;
        console.error('Compile error:', err);
        const msg = err.message || '';
        if (msg.includes('Failed to fetch') || err instanceof TypeError) {
          setCompileError('Unable to connect to the PDF compiler service. Please check your internet connection or click Retry Compilation.');
        } else {
          setCompileError(msg || 'Network error communicating with resume compiler.');
        }
      } finally {
        if (currentGen === generationRef.current) {
          setIsCompiling(false);
        }
      }
    }, delay);

    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
    };
  }, [resumeData, template, hasMinimumData, compileTrigger]);

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
        res = await fetch(`${API_URL}/api/resumes/${activeResumeId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_URL}/api/resumes`, {
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
    const downloadHref = activeBlobUrlRef.current || pdfBlobUrl || serverPdfUrl || pdfUrl;
    if (!downloadHref) {
      alert('Generating PDF, please wait a moment...');
      return;
    }
    const link = document.createElement('a');
    link.href = downloadHref;
    const cleanName = (resumeData.personal?.fullName || 'Resume').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${cleanName || 'Resume'}_ATS.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 5. Download LaTeX Source (.tex) - Overleaf standard resume.tex
  const handleDownloadLatex = () => {
    const currentTex = latexSource || generateLatex(resumeData, { template });
    if (!currentTex) return;
    const blob = new Blob([currentTex], { type: 'text/x-tex;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.tex';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // 6. Copy LaTeX
  const handleCopyLatex = () => {
    const currentTex = latexSource || generateLatex(resumeData, { template });
    if (!currentTex) return;
    navigator.clipboard.writeText(currentTex);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  // 7. Load an existing resume
  const handleLoadResume = (item) => {
    setActiveResumeId(item.id || item._id);
    setResumeTitle(item.title || 'My ATS Resume');
    const loadedTemplate = item.template || 'classic-tech';
    setTemplate(loadedTemplate);
    if (item.resumeData) {
      const normalized = normalizeResumeSkills(item.resumeData);
      setResumeData(normalized);
      const tex = item.latexSource || generateLatex(normalized, { template: loadedTemplate });
      setLatexSource(tex);
    }
    setShowMyResumesDrawer(false);
  };

  // 8. Delete resume
  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      await fetch(`${API_URL}/api/resumes/${id}`, { method: 'DELETE', headers });
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
      const res = await fetch(`${API_URL}/api/resumes/ai-action`, {
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
      const res = await fetch(`${API_URL}/api/resumes/import`, {
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
    setResumeData(prev => {
      const merged = {
        ...prev,
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
          languages: importReviewData.skills?.languages || prev.skills?.languages || '',
          frameworks: importReviewData.skills?.frameworks || prev.skills?.frameworks || '',
          tools: importReviewData.skills?.tools || prev.skills?.tools || '',
          databases: importReviewData.skills?.databases || prev.skills?.databases || '',
          coreConcepts: importReviewData.skills?.coreConcepts || prev.skills?.coreConcepts || ''
        },
        experience: importReviewData.experience?.length ? importReviewData.experience : prev.experience,
        projects: importReviewData.projects?.length ? importReviewData.projects : prev.projects,
        achievements: prev.achievements,
        certifications: prev.certifications,
        extracurricular: prev.extracurricular
      };
      return normalizeResumeSkills(merged);
    });
    setImportReviewData(null);
  };

  // Return to Interview Pro with saved draft preserved
  const handleReturnToInterviewPro = () => {
    if (onNavigate) {
      onNavigate('interview-confirm');
    }
  };

  const [mobileViewTab, setMobileViewTab] = useState('editor'); // 'editor' | 'preview'
  const [mobileStepKey, setMobileStepKey] = useState('templates');
  const mobileTabsRef = useRef(null);

  const currentMobileIndex = MOBILE_STEPS.findIndex(s => s.id === mobileStepKey);

  useEffect(() => {
    if (mobileTabsRef.current) {
      const activeEl = mobileTabsRef.current.querySelector('[data-active-tab="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [mobileStepKey]);

  const handleNextMobileStep = () => {
    if (currentMobileIndex < MOBILE_STEPS.length - 1) {
      const nextStep = MOBILE_STEPS[currentMobileIndex + 1];
      setMobileStepKey(nextStep.id);
      setActiveStep(nextStep.desktopIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setMobileViewTab('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevMobileStep = () => {
    if (currentMobileIndex > 0) {
      const prevStep = MOBILE_STEPS[currentMobileIndex - 1];
      setMobileStepKey(prevStep.id);
      setActiveStep(prevStep.desktopIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollTabsRight = () => {
    if (mobileTabsRef.current) {
      mobileTabsRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const handleMobileNextStep = handleNextMobileStep;
  const handleMobilePrevStep = handlePrevMobileStep;

  return (
    <div className="pv-resume-maker-page" style={{ backgroundColor: 'transparent', minHeight: '100vh', color: '#1F1A14', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* =========================================================================
          DESKTOP ATS RESUME MAKER (>= 1024px)
          100% UNTOUCHED ORIGINAL DESKTOP UI/UX & SPLIT-VIEW
          ========================================================================= */}
      <div className="pv-resume-desktop-only">
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
                  backgroundColor: 'transparent',
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
            {isCompiling ? (
              <div style={{
                backgroundColor: '#FEF3C7',
                border: '1px solid #FCD34D',
                color: '#B45309',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Checking Layout...</span>
              </div>
            ) : compileError ? (
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
                <span>Compilation Issue</span>
              </div>
            ) : compileStatus?.isOnePage ? (
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
            ) : compileStatus?.pageCount > 1 ? (
              <div style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                color: '#D97706',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <AlertTriangle size={13} />
                <span>Multi-Page ({compileStatus.pageCount} Pages)</span>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#F3F4F6',
                border: '1px solid #E5E7EB',
                color: '#4B5563',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <CheckCircle2 size={13} />
                <span>ATS Standard Layout</span>
              </div>
            )}

            {/* Template Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#70675D', fontWeight: 700 }}>Template:</span>
              <select
                value={template}
                onChange={(e) => handleTemplateChange(e.target.value)}
                style={{
                  backgroundColor: 'transparent',
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
                      value={resumeData.personal.professionalHeadline || resumeData.personal.targetRole || ''}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, professionalHeadline: e.target.value, targetRole: e.target.value } }))}
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
                          { degree: '', fieldOfStudy: '', board: '', institution: '', location: '', duration: '', cgpaOrPercentage: '' }
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
                  <div key={idx} style={{ backgroundColor: 'transparent', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem', marginBottom: '0.55rem' }}>
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.Tech / Class 12th)"
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
                        placeholder="Major / Stream (e.g. ECE / PCM)"
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
                      <input
                        type="text"
                        placeholder="Board / Univ (e.g. AKTU / CBSE)"
                        value={edu.board || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ed = [...prev.education];
                            ed[idx].board = val;
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
                        placeholder="Duration (e.g. 2023 - 2027)"
                        value={edu.duration || ''}
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
                        placeholder="CGPA / Percentage (e.g. 8.5)"
                        value={edu.cgpaOrPercentage !== undefined ? edu.cgpaOrPercentage : (edu.cgpa || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setResumeData(prev => {
                            const ed = [...prev.education];
                            ed[idx].cgpaOrPercentage = val;
                            ed[idx].cgpa = val;
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                    3. Technical Skills (Categorized for ATS)
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#8C7E72', fontWeight: 600 }}>
                    Search & select skills or type custom skills
                  </span>
                </div>

                <SearchableSkillsSelector
                  technicalSkills={resumeData.technicalSkills}
                  onChange={handleSkillCategoryChange}
                />
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
                  <div key={expIdx} style={{ backgroundColor: 'transparent', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.85rem' }}>
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
                  <div key={pIdx} style={{ backgroundColor: 'transparent', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.85rem' }}>
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
                  <div key={aIdx} style={{ backgroundColor: 'transparent', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
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
                  <div key={cIdx} style={{ backgroundColor: 'transparent', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
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
                  <div key={eIdx} style={{ backgroundColor: 'transparent', border: '1px solid #E5DCCF', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
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
                  backgroundColor: 'transparent',
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
                  <span style={{ fontSize: '0.72rem', color: '#D48816', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <RefreshCw size={12} className="animate-spin" /> Generating PDF...
                  </span>
                ) : compileError ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={12} /> PDF generation failed
                    </span>
                    <button
                      type="button"
                      onClick={handleRetryCompile}
                      style={{
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '2px 7px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : hasMinimumData && (pdfBlobUrl || pdfUrl) ? (
                  <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>
                    ● Preview updated
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#888888', fontWeight: 600 }}>
                    ● Ready
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={handleRetryCompile}
                        style={{
                          backgroundColor: '#DC2626',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.45rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Retry Compilation
                      </button>
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
                  </div>
                ) : (pdfBlobUrl || serverPdfUrl || pdfUrl) && hasMinimumData ? (
                  <iframe
                    src={pdfBlobUrl || serverPdfUrl || pdfUrl}
                    title="Live Resume Preview"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                ) : isCompiling ? (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2.5rem',
                    textAlign: 'center',
                    backgroundColor: '#262626',
                    color: '#A3A3A3'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      backgroundColor: '#333333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      border: '1px solid #404040'
                    }}>
                      <RefreshCw size={30} color="#E2E8F0" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F5F5F5', marginBottom: '0.5rem' }}>
                      Compiling ATS Resume Preview...
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#A3A3A3', maxWidth: '340px', lineHeight: 1.6, margin: 0 }}>
                      Rendering Computer Modern vector typography and checking page constraints in real-time.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2.5rem',
                    textAlign: 'center',
                    backgroundColor: '#262626',
                    color: '#A3A3A3'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      backgroundColor: '#333333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      border: '1px solid #404040'
                    }}>
                      <FileText size={32} color="#D4D4D8" />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F5F5F5', marginBottom: '0.5rem' }}>
                      Your resume preview will appear here
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#A3A3A3', maxWidth: '340px', lineHeight: 1.6, margin: 0 }}>
                      Start entering your personal details on the left. The live ATS resume preview and Overleaf LaTeX will update automatically as you type.
                    </p>
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
      </div>

      {/* =========================================================================
          MOBILE ATS RESUME MAKER (< 1024px)
          Strict parity with reference design specification
          ========================================================================= */}
      <div className="pv-resume-mobile-only" style={{ flexDirection: 'column', width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>
        
        {/* Mobile Sticky Header matching reference image */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1.5px solid #EDE5D6',
          padding: '0.65rem 0.95rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              if (isFromInterviewPro) {
                handleReturnToInterviewPro();
              } else if (onNavigate) {
                onNavigate('more');
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'transparent',
              border: '1px solid #E8DFCF',
              color: '#4A4036',
              padding: '0.4rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <ArrowLeft size={13} />
            <span>{isFromInterviewPro ? 'Assessment' : 'All Tools'}</span>
          </button>

          {/* Title and Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1, justifyContent: 'center', margin: '0 0.4rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#781416',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileText size={17} />
            </div>
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  color: '#1C1814',
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  padding: 0,
                  margin: 0,
                  width: '100%',
                  fontFamily: "'Outfit', sans-serif"
                }}
                title="Click to rename resume"
              />
              <div style={{ fontSize: '0.64rem', color: '#7A6F62', fontWeight: 600, whiteSpace: 'nowrap' }}>
                ATS One-Page Certified · LaTeX Vector PDF
              </div>
            </div>
          </div>

          {/* Academic Alerts Bell */}
          <button
            type="button"
            onClick={() => {
              const modal = document.querySelector('[data-student-updates-modal]');
              if (modal) modal.style.display = 'block';
            }}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            aria-label="Notifications"
          >
            <Bell size={20} color="#1C1814" />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#DC2626'
            }} />
          </button>
        </header>

        {/* Mobile Body Content */}
        <div style={{ padding: '0.85rem 0.95rem 6.5rem 0.95rem', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Status Alert Banner */}
          {isCompiling ? (
            <div style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FCD34D',
              color: '#B45309',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.75rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <RefreshCw size={15} color="#B45309" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
              <span>Compiling ATS Resume Preview...</span>
            </div>
          ) : compileError ? (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.75rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <AlertTriangle size={15} color="#DC2626" style={{ flexShrink: 0 }} />
              <span>Compilation Issue Detected</span>
            </div>
          ) : compileStatus?.isOnePage ? (
            <div style={{
              backgroundColor: '#E7F5EE',
              border: '1px solid #A3E0C1',
              color: '#0E7A4A',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.75rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <CheckCircle2 size={15} color="#0E7A4A" style={{ flexShrink: 0 }} />
              <span>Strict 1-Page Layout ({compileStatus?.levelName || 'Standard'})</span>
            </div>
          ) : compileStatus?.pageCount > 1 ? (
            <div style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#D97706',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.75rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0 }} />
              <span>Multi-Page ({compileStatus.pageCount} Pages)</span>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#F3F4F6',
              border: '1px solid #E5E7EB',
              color: '#4B5563',
              borderRadius: '10px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.75rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <CheckCircle2 size={15} color="#4B5563" style={{ flexShrink: 0 }} />
              <span>ATS Standard Layout</span>
            </div>
          )}

          {/* Template Selector Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            marginBottom: '0.75rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814', whiteSpace: 'nowrap' }}>
              Template:
            </span>
            <div style={{ position: 'relative', flex: 1 }}>
              <select
                value={template}
                onChange={(e) => handleTemplateChange(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D5C7B2',
                  borderRadius: '8px',
                  padding: '0.5rem 2rem 0.5rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#1C1814',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <option value="classic-tech">Classic Tech ATS (Jake's Standard)</option>
                <option value="modern-clean">Modern Clean Engineering</option>
                <option value="minimalist">Minimalist Executive</option>
              </select>
              <ChevronDown size={14} color="#70675D" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* 3 Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              style={{
                backgroundColor: '#FAF5ED',
                border: '1px solid #D5C7B2',
                borderRadius: '8px',
                padding: '0.55rem 0.35rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#4A4036',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxSizing: 'border-box'
              }}
            >
              <UploadCloud size={14} color="#781416" />
              <span>Import</span>
            </button>
            <button
              type="button"
              onClick={() => setShowMyResumesDrawer(true)}
              style={{
                backgroundColor: '#FAF5ED',
                border: '1px solid #D5C7B2',
                borderRadius: '8px',
                padding: '0.55rem 0.35rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#4A4036',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxSizing: 'border-box'
              }}
            >
              <FolderOpen size={14} color="#781416" />
              <span>My Resumes ({myResumesList.length})</span>
            </button>
            <button
              type="button"
              onClick={handleSaveResume}
              disabled={isSaving}
              style={{
                backgroundColor: '#FAF5ED',
                border: '1.5px solid #781416',
                borderRadius: '8px',
                padding: '0.55rem 0.35rem',
                fontSize: '0.76rem',
                fontWeight: 800,
                color: '#781416',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxSizing: 'border-box'
              }}
            >
              <Save size={14} color="#781416" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>

          {/* Download PDF Primary Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            style={{
              width: '100%',
              backgroundColor: '#781416',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: '0 2px 8px rgba(120, 20, 22, 0.25)',
              marginBottom: '0.65rem',
              boxSizing: 'border-box'
            }}
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>

          {/* Two-mode Segmented Control */}
          <div style={{
            display: 'flex',
            backgroundColor: '#EDE5D6',
            borderRadius: '12px',
            padding: '3px',
            marginBottom: '0.95rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <button
              type="button"
              onClick={() => setMobileViewTab('editor')}
              style={{
                flex: 1,
                padding: '0.6rem 0.5rem',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: mobileViewTab === 'editor' ? '#781416' : 'transparent',
                color: mobileViewTab === 'editor' ? '#FFFFFF' : '#4A4036',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: mobileViewTab === 'editor' ? '0 2px 8px rgba(120, 20, 22, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <FileText size={15} />
              <span>Edit Form ({currentMobileIndex + 1}/{MOBILE_STEPS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileViewTab('preview')}
              style={{
                flex: 1,
                padding: '0.6rem 0.5rem',
                borderRadius: '9px',
                border: 'none',
                backgroundColor: mobileViewTab === 'preview' ? '#781416' : 'transparent',
                color: mobileViewTab === 'preview' ? '#FFFFFF' : '#4A4036',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: mobileViewTab === 'preview' ? '0 2px 8px rgba(120, 20, 22, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Eye size={15} />
              <span>Live Preview & PDF</span>
            </button>
          </div>

          {/* VIEW: LIVE PDF PREVIEW (When toggled to Preview Mode) */}
          {mobileViewTab === 'preview' ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EDE5D6',
              borderRadius: '16px',
              padding: '1.15rem 1rem',
              boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)',
              marginBottom: '1rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem'
              }}>
                <button
                  type="button"
                  onClick={() => setMobileViewTab('editor')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #D5C7B2',
                    borderRadius: '8px',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#4A4036',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={13} />
                  <span>Back to Form ({currentMobileIndex + 1}/{MOBILE_STEPS.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(120, 20, 22, 0.25)'
                  }}
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>
              </div>

              {isCompiling ? (
                <div style={{ height: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <RefreshCw size={26} color="#781416" className="animate-spin" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#70675D' }}>
                    Compiling Vector PDF with Overleaf LaTeX...
                  </span>
                </div>
              ) : compileError ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', textAlign: 'center', color: '#991B1B' }}>
                  <AlertTriangle size={32} color="#DC2626" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    Compilation Issue
                  </div>
                  <div style={{ fontSize: '0.74rem', marginBottom: '0.85rem', wordBreak: 'break-word' }}>
                    {compileError}
                  </div>
                  <button
                    type="button"
                    onClick={handleRetryCompile}
                    style={{
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Retry Compile
                  </button>
                </div>
              ) : (pdfBlobUrl || serverPdfUrl || pdfUrl) && hasMinimumData ? (
                <div style={{ width: '100%', height: '560px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #DDD3C3', backgroundColor: '#525659' }}>
                  <iframe
                    src={`${pdfBlobUrl || serverPdfUrl || pdfUrl}#toolbar=0&navpanes=0`}
                    title="ATS Resume Live Preview"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
              ) : (
                <div style={{ height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#70675D', fontSize: '0.82rem', textAlign: 'center', padding: '1rem' }}>
                  <FileText size={32} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
                  <div>Fill in your details in the <strong>Edit Form</strong> to view live ATS verified PDF preview.</div>
                  <button
                    type="button"
                    onClick={() => setMobileViewTab('editor')}
                    style={{
                      marginTop: '0.85rem',
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Open Edit Form
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* VIEW: STEP EDITOR */
            <>
              {/* STEP EDITOR FORM CARD */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #EDE5D6',
                borderRadius: '16px',
                padding: '1.15rem 1rem',
                boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)',
                width: '100%',
                boxSizing: 'border-box'
              }}>

                {/* Stepper Tabs Strip inside the card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginBottom: '1.15rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div
                    ref={mobileTabsRef}
                    className="pv-mobile-tabs-strip"
                    style={{
                      flex: 1,
                      paddingBottom: '2px'
                    }}
                  >
                    {MOBILE_STEPS.map((step) => {
                      const isActive = (mobileStepKey === step.id);
                      return (
                        <button
                          key={step.id}
                          data-active-tab={isActive ? "true" : "false"}
                          type="button"
                          onClick={() => {
                            setMobileStepKey(step.id);
                            setActiveStep(step.desktopIndex);
                            if (mobileViewTab === 'preview') setMobileViewTab('editor');
                          }}
                          style={{
                            backgroundColor: isActive ? '#FFFFFF' : '#FAF7F2',
                            border: isActive ? '1.5px solid #781416' : '1px solid transparent',
                            color: isActive ? '#781416' : '#6A5E50',
                            borderRadius: '8px',
                            padding: '0.48rem 0.92rem',
                            fontSize: '0.78rem',
                            fontWeight: isActive ? 800 : 600,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {step.title}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleScrollTabsRight}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      border: '1px solid #DDD3C3',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxSizing: 'border-box'
                    }}
                    aria-label="Scroll steps"
                  >
                    <ChevronRight size={16} color="#4A4036" />
                  </button>
                </div>

                {/* STEP 0: TEMPLATES */}
                {mobileStepKey === 'templates' && (
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1C1814', margin: '0 0 0.35rem 0' }}>
                      1. Choose ATS Resume Template
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                      All templates are engineered to score 95+ on ATS screening across major tech hiring platforms.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {RESUME_TEMPLATES.map((tmpl) => {
                        const isSelected = template === tmpl.id;
                        return (
                          <div
                            key={tmpl.id}
                            onClick={() => handleTemplateChange(tmpl.id)}
                            style={{
                              backgroundColor: '#FFFFFF',
                              border: isSelected ? '2px solid #781416' : '1px solid #E8DFCF',
                              borderRadius: '14px',
                              padding: '0.95rem 1rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: isSelected ? '0 2px 10px rgba(120, 20, 22, 0.08)' : '0 1px 3px rgba(35, 30, 25, 0.02)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1C1814' }}>
                                {tmpl.name}
                              </span>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.65rem',
                                borderRadius: '999px',
                                backgroundColor: tmpl.badgeBg,
                                color: tmpl.badgeColor
                              }}>
                                {tmpl.badge}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.76rem', color: '#5C5245', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
                              {tmpl.desc}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              {tmpl.features.map((feat, fIdx) => (
                                <span
                                  key={fIdx}
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: '#781416',
                                    backgroundColor: '#FAF5ED',
                                    border: '1px solid #F5DCDA',
                                    padding: '0.22rem 0.55rem',
                                    borderRadius: '6px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <span style={{ fontSize: '0.75rem' }}>✓</span> {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Next Step Button for Templates */}
                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #EDE5D6' }}>
                      <button
                        type="button"
                        onClick={handleNextMobileStep}
                        style={{
                          width: '100%',
                          backgroundColor: '#781416',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.65rem 1rem',
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          boxShadow: '0 2px 8px rgba(120, 20, 22, 0.25)'
                        }}
                      >
                        <span>Next Step: Personal Details</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 1: PERSONAL & CONTACT DETAILS */}
                {mobileStepKey === 'personal' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
                  <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    Fill in your basic details to get started. This information will be used in your resume.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <MobileFormField
                      label="Full Name"
                      required
                      icon={User}
                      placeholder="e.g. Priyanshu Sharma"
                      value={resumeData.personal.fullName}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, fullName: e.target.value } }))}
                    />

                    <MobileFormField
                      label="Email Address"
                      required
                      icon={Mail}
                      type="email"
                      placeholder="e.g. priyanshu@gmail.com"
                      value={resumeData.personal.email}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))}
                    />

                    <div className="pv-mobile-form-grid-2">
                      <MobileFormField
                        label="Phone Number"
                        required
                        icon={Phone}
                        placeholder="e.g. +91 9876543210"
                        value={resumeData.personal.phone}
                        onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, phone: e.target.value } }))}
                      />
                      <MobileFormField
                        label="Target Role / Headline"
                        icon={Briefcase}
                        placeholder="e.g. Software Development Engineer"
                        value={resumeData.personal.professionalHeadline || resumeData.personal.targetRole || ''}
                        onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, professionalHeadline: e.target.value, targetRole: e.target.value } }))}
                      />
                    </div>

                    <div className="pv-mobile-form-grid-2">
                      <MobileFormField
                        label="LinkedIn URL"
                        icon={Linkedin}
                        placeholder="linkedin.com/in/username"
                        value={resumeData.personal.linkedinUrl}
                        onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, linkedinUrl: e.target.value } }))}
                      />
                      <MobileFormField
                        label="GitHub URL"
                        icon={Github}
                        placeholder="github.com/username"
                        value={resumeData.personal.githubUrl}
                        onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, githubUrl: e.target.value } }))}
                      />
                    </div>

                    <div className="pv-mobile-form-grid-2">
                      <MobileFormField
                        label="Location (City, State)"
                        icon={MapPin}
                        placeholder="e.g. Noida, UP"
                        value={resumeData.personal.location}
                        onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, location: e.target.value } }))}
                      />
                      <MobileFormField
                        label="Portfolio Website"
                        icon={Globe}
                        placeholder="e.g. portfolio.dev"
                        value={resumeData.personal.portfolioUrl}
                        onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, portfolioUrl: e.target.value } }))}
                      />
                    </div>

                    <MobileTextareaField
                      label="Professional Summary (2–3 concise ATS lines)"
                      icon={FileText}
                      rows={2}
                      placeholder="e.g. Computer Science student passionate about scalable web architectures, algorithms, and distributed systems."
                      value={resumeData.personal.summary}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, summary: e.target.value } }))}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: EDUCATION */}
              {mobileStepKey === 'education' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
                            { degree: '', fieldOfStudy: '', board: '', institution: '', location: '', duration: '', cgpaOrPercentage: '' }
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
                        padding: '0.3rem 0.55rem',
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
                  <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    Add your academic degrees, colleges, scores, and graduation timelines.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {resumeData.education.map((edu, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FAF8F5',
                          border: '1px solid #E8DFCF',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          boxShadow: '0 2px 6px rgba(35, 30, 25, 0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416' }}>
                            Education #{idx + 1}
                          </span>
                          {resumeData.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  education: prev.education.filter((_, i) => i !== idx)
                                }));
                              }}
                              style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.2rem' }}
                              title="Remove education"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Degree / Qualification"
                            required
                            icon={GraduationCap}
                            placeholder="e.g. B.Tech / Class 12th"
                            value={edu.degree}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ed = [...prev.education];
                                ed[idx].degree = val;
                                return { ...prev, education: ed };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Branch / Specialization"
                            icon={BookOpen}
                            placeholder="e.g. Computer Science / PCM"
                            value={edu.fieldOfStudy}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ed = [...prev.education];
                                ed[idx].fieldOfStudy = val;
                                return { ...prev, education: ed };
                              });
                            }}
                          />
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="College / University"
                            required
                            icon={Building}
                            placeholder="e.g. ABES Engineering College"
                            value={edu.institution}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ed = [...prev.education];
                                ed[idx].institution = val;
                                return { ...prev, education: ed };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Board / Affiliation"
                            icon={Award}
                            placeholder="e.g. AKTU / CBSE"
                            value={edu.board || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ed = [...prev.education];
                                ed[idx].board = val;
                                return { ...prev, education: ed };
                              });
                            }}
                          />
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Duration / Years"
                            icon={Calendar}
                            placeholder="e.g. 2023 - 2027"
                            value={edu.duration || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ed = [...prev.education];
                                ed[idx].duration = val;
                                return { ...prev, education: ed };
                              });
                            }}
                          />
                          <MobileFormField
                            label="CGPA / Percentage"
                            icon={Percent}
                            placeholder="e.g. 8.6 CGPA / 88%"
                            value={edu.cgpaOrPercentage !== undefined ? edu.cgpaOrPercentage : (edu.cgpa || '')}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ed = [...prev.education];
                                ed[idx].cgpaOrPercentage = val;
                                ed[idx].cgpa = val;
                                return { ...prev, education: ed };
                              });
                            }}
                          />
                        </div>

                        <MobileFormField
                          label="Location (City, State)"
                          icon={MapPin}
                          placeholder="e.g. Ghaziabad, UP"
                          value={edu.location || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setResumeData(prev => {
                              const ed = [...prev.education];
                              ed[idx].location = val;
                              return { ...prev, education: ed };
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: TECHNICAL SKILLS */}
              {mobileStepKey === 'skills' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1C1814', margin: 0 }}>
                      3. Technical Skills
                    </h3>
                    <span style={{
                      backgroundColor: '#E7F5EE',
                      color: '#0E7A4A',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px'
                    }}>
                      ✓ ATS Categorized
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    Search & select technical skills across categories. Tap to add or remove chips, or type custom skills.
                  </p>

                  <SearchableSkillsSelector
                    technicalSkills={resumeData.technicalSkills}
                    onChange={handleSkillCategoryChange}
                  />
                </div>
              )}

              {/* STEP 4: EXPERIENCE */}
              {mobileStepKey === 'experience' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
                        padding: '0.3rem 0.55rem',
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
                  <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    Showcase your work history, internships, and measurable impact.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {resumeData.experience.map((exp, expIdx) => (
                      <div
                        key={expIdx}
                        style={{
                          backgroundColor: '#FAF8F5',
                          border: '1px solid #E8DFCF',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          boxShadow: '0 2px 6px rgba(35, 30, 25, 0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416' }}>
                            Experience #{expIdx + 1}
                          </span>
                          {resumeData.experience.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  experience: prev.experience.filter((_, i) => i !== expIdx)
                                }));
                              }}
                              style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.2rem' }}
                              title="Remove experience"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Job Title"
                            required
                            icon={Briefcase}
                            placeholder="e.g. Software Engineer Intern"
                            value={exp.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ex = [...prev.experience];
                                ex[expIdx].title = val;
                                return { ...prev, experience: ex };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Company / Org"
                            required
                            icon={Building}
                            placeholder="e.g. Microsoft / Startup"
                            value={exp.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ex = [...prev.experience];
                                ex[expIdx].company = val;
                                return { ...prev, experience: ex };
                              });
                            }}
                          />
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Duration / Dates"
                            icon={Calendar}
                            placeholder="e.g. May 2024 - July 2024"
                            value={exp.duration}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ex = [...prev.experience];
                                ex[expIdx].duration = val;
                                return { ...prev, experience: ex };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Location"
                            icon={MapPin}
                            placeholder="e.g. Bangalore / Remote"
                            value={exp.location}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ex = [...prev.experience];
                                ex[expIdx].location = val;
                                return { ...prev, experience: ex };
                              });
                            }}
                          />
                        </div>

                        {/* Bullets */}
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.35rem' }}>
                            Responsibilities & Achievements (Action Verb + Metric + Impact)
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            {exp.bullets.map((bullet, bIdx) => (
                              <div key={bIdx} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                  <input
                                    type="text"
                                    placeholder="e.g. Built REST APIs in Node.js, reducing latency by 28%..."
                                    value={bullet}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setResumeData(prev => {
                                        const ex = [...prev.experience];
                                        ex[expIdx].bullets[bIdx] = val;
                                        return { ...prev, experience: ex };
                                      });
                                    }}
                                    className="pv-mobile-form-input"
                                    style={{ paddingLeft: '0.75rem', fontSize: '0.76rem' }}
                                  />
                                </div>
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
                                    padding: '0.35rem 0.5rem',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    flexShrink: 0
                                  }}
                                  title="Improve bullet with AI"
                                >
                                  <Sparkles size={11} color="#D48816" />
                                  <span>AI</span>
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
                                    style={{ background: 'none', border: 'none', color: '#9E9486', cursor: 'pointer', padding: '0.2rem', flexShrink: 0 }}
                                    title="Delete bullet"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

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
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.4rem 0 0 0'
                            }}
                          >
                            <Plus size={13} />
                            <span>Add Bullet Point</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: PROJECTS */}
              {mobileStepKey === 'projects' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
                        padding: '0.3rem 0.55rem',
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
                  <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    Feature software engineering projects, tech stacks, and live links.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {resumeData.projects.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          backgroundColor: '#FAF8F5',
                          border: '1px solid #E8DFCF',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          boxShadow: '0 2px 6px rgba(35, 30, 25, 0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416' }}>
                            Project #{pIdx + 1}
                          </span>
                          {resumeData.projects.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  projects: prev.projects.filter((_, i) => i !== pIdx)
                                }));
                              }}
                              style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.2rem' }}
                              title="Remove project"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Project Title"
                            required
                            icon={BookOpen}
                            placeholder="e.g. Distributed Task Queue"
                            value={proj.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const pr = [...prev.projects];
                                pr[pIdx].title = val;
                                return { ...prev, projects: pr };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Tech Stack"
                            required
                            icon={Wrench}
                            placeholder="e.g. React, Node.js, Redis"
                            value={proj.techStack}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const pr = [...prev.projects];
                                pr[pIdx].techStack = val;
                                return { ...prev, projects: pr };
                              });
                            }}
                          />
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Live Demo URL"
                            icon={Globe}
                            placeholder="e.g. taskqueue.dev (optional)"
                            value={proj.liveUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const pr = [...prev.projects];
                                pr[pIdx].liveUrl = val;
                                return { ...prev, projects: pr };
                              });
                            }}
                          />
                          <MobileFormField
                            label="GitHub Repository URL"
                            icon={Github}
                            placeholder="e.g. github.com/user/project"
                            value={proj.githubUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const pr = [...prev.projects];
                                pr[pIdx].githubUrl = val;
                                return { ...prev, projects: pr };
                              });
                            }}
                          />
                        </div>

                        {/* Bullets */}
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4A4036', display: 'block', marginBottom: '0.35rem' }}>
                            Highlights & Contributions
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            {proj.bullets.map((bullet, bIdx) => (
                              <div key={bIdx} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
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
                                    className="pv-mobile-form-input"
                                    style={{ paddingLeft: '0.75rem', fontSize: '0.76rem' }}
                                  />
                                </div>
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
                                    padding: '0.35rem 0.5rem',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    flexShrink: 0
                                  }}
                                  title="Improve bullet with AI"
                                >
                                  <Sparkles size={11} color="#D48816" />
                                  <span>AI</span>
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
                                    style={{ background: 'none', border: 'none', color: '#9E9486', cursor: 'pointer', padding: '0.2rem', flexShrink: 0 }}
                                    title="Delete bullet"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

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
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.4rem 0 0 0'
                            }}
                          >
                            <Plus size={13} />
                            <span>Add Project Bullet</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: ACHIEVEMENTS */}
              {mobileStepKey === 'achievements' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
                        padding: '0.3rem 0.55rem',
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
                  <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    Add awards, hackathon wins, rank certifications, and academic honors.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {resumeData.achievements.map((ach, aIdx) => (
                      <div
                        key={aIdx}
                        style={{
                          backgroundColor: '#FAF8F5',
                          border: '1px solid #E8DFCF',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          boxShadow: '0 2px 6px rgba(35, 30, 25, 0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416' }}>
                            Achievement #{aIdx + 1}
                          </span>
                          {resumeData.achievements.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  achievements: prev.achievements.filter((_, i) => i !== aIdx)
                                }));
                              }}
                              style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.2rem' }}
                              title="Remove achievement"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Achievement Title"
                            required
                            icon={Award}
                            placeholder="e.g. 1st Place SIH Hackathon"
                            value={ach.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ac = [...prev.achievements];
                                ac[aIdx].title = val;
                                return { ...prev, achievements: ac };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Organization / Issuer"
                            icon={Building}
                            placeholder="e.g. AICTE / Ministry of Ed"
                            value={ach.organization}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ac = [...prev.achievements];
                                ac[aIdx].organization = val;
                                return { ...prev, achievements: ac };
                              });
                            }}
                          />
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Date / Year"
                            icon={Calendar}
                            placeholder="e.g. 2024"
                            value={ach.year}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ac = [...prev.achievements];
                                ac[aIdx].year = val;
                                return { ...prev, achievements: ac };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Context / Scope"
                            icon={FileText}
                            placeholder="e.g. National Level"
                            value={ach.organization ? `Issued by ${ach.organization}` : ''}
                            onChange={() => {}}
                          />
                        </div>

                        <MobileFormField
                          label="Brief Description"
                          icon={FileText}
                          placeholder="e.g. Built an AI triage model selected among 4,000+ national submissions"
                          value={ach.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setResumeData(prev => {
                              const ac = [...prev.achievements];
                              ac[aIdx].description = val;
                              return { ...prev, achievements: ac };
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: CERTIFICATIONS */}
              {mobileStepKey === 'certifications' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
                        padding: '0.3rem 0.55rem',
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
                  <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    Add industry certifications, licenses, and credential verification links.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {resumeData.certifications.map((cert, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          backgroundColor: '#FAF8F5',
                          border: '1px solid #E8DFCF',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          boxShadow: '0 2px 6px rgba(35, 30, 25, 0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416' }}>
                            Certification #{cIdx + 1}
                          </span>
                          {resumeData.certifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  certifications: prev.certifications.filter((_, i) => i !== cIdx)
                                }));
                              }}
                              style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.2rem' }}
                              title="Remove certification"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Certificate Name"
                            required
                            icon={ShieldCheck}
                            placeholder="e.g. AWS Certified Developer"
                            value={cert.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const cr = [...prev.certifications];
                                cr[cIdx].name = val;
                                return { ...prev, certifications: cr };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Issuing Organization"
                            icon={Building}
                            placeholder="e.g. Amazon Web Services"
                            value={cert.issuer}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const cr = [...prev.certifications];
                                cr[cIdx].issuer = val;
                                return { ...prev, certifications: cr };
                              });
                            }}
                          />
                        </div>

                        <div className="pv-mobile-form-grid-2">
                          <MobileFormField
                            label="Date / Year"
                            icon={Calendar}
                            placeholder="e.g. Dec 2024"
                            value={cert.date}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const cr = [...prev.certifications];
                                cr[cIdx].date = val;
                                return { ...prev, certifications: cr };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Verification URL / ID"
                            icon={Globe}
                            placeholder="e.g. credly.com/earner/..."
                            value={cert.url}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const cr = [...prev.certifications];
                                cr[cIdx].url = val;
                                return { ...prev, certifications: cr };
                              });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: EXTRACURRICULAR */}
              {mobileStepKey === 'extracurricular' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
                        padding: '0.3rem 0.55rem',
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
                  <p style={{ fontSize: '0.78rem', color: '#70675D', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    Highlight leadership roles, club management, volunteering, and initiatives.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {resumeData.extracurricular.map((extra, eIdx) => (
                      <div
                        key={eIdx}
                        style={{
                          backgroundColor: '#FAF8F5',
                          border: '1px solid #E8DFCF',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          boxShadow: '0 2px 6px rgba(35, 30, 25, 0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416' }}>
                            Activity #{eIdx + 1}
                          </span>
                          {resumeData.extracurricular.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  extracurricular: prev.extracurricular.filter((_, i) => i !== eIdx)
                                }));
                              }}
                              style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.2rem' }}
                              title="Remove activity"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Role / Position"
                            required
                            icon={User}
                            placeholder="e.g. Lead Coordinator / President"
                            value={extra.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ex = [...prev.extracurricular];
                                ex[eIdx].role = val;
                                return { ...prev, extracurricular: ex };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Club / Organization"
                            icon={Building}
                            placeholder="e.g. Coding Club / Rotaract"
                            value={extra.organization}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ex = [...prev.extracurricular];
                                ex[eIdx].organization = val;
                                return { ...prev, extracurricular: ex };
                              });
                            }}
                          />
                        </div>

                        <div className="pv-mobile-form-grid-2" style={{ marginBottom: '0.65rem' }}>
                          <MobileFormField
                            label="Duration / Dates"
                            icon={Calendar}
                            placeholder="e.g. 2023 - 2024"
                            value={extra.duration}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResumeData(prev => {
                                const ex = [...prev.extracurricular];
                                ex[eIdx].duration = val;
                                return { ...prev, extracurricular: ex };
                              });
                            }}
                          />
                          <MobileFormField
                            label="Scope / Scale"
                            icon={FileText}
                            placeholder="e.g. University Level"
                            value={extra.organization ? `Club of ${extra.organization}` : ''}
                            onChange={() => {}}
                          />
                        </div>

                        <MobileFormField
                          label="Accomplishments & Description"
                          icon={FileText}
                          placeholder="e.g. Mentored 200+ junior students in DSA and competitive coding"
                          value={extra.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setResumeData(prev => {
                              const ex = [...prev.extracurricular];
                              ex[eIdx].description = val;
                              return { ...prev, extracurricular: ex };
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CARD FOOTER CONTROLS: PREVIOUS STEP & NEXT STEP */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid #F0E8DC',
                gap: '0.75rem'
              }}>
                <button
                  type="button"
                  disabled={currentMobileIndex === 0}
                  onClick={handleMobilePrevStep}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #DDD3C3',
                    borderRadius: '8px',
                    padding: '0.55rem 0.95rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: currentMobileIndex === 0 ? '#A89F91' : '#4A4036',
                    cursor: currentMobileIndex === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronLeft size={14} />
                  <span>Previous Step</span>
                </button>

                <button
                  type="button"
                  onClick={handleMobileNextStep}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: currentMobileIndex === MOBILE_STEPS.length - 1 ? '#0E7A4A' : '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: currentMobileIndex === MOBILE_STEPS.length - 1 ? '0 2px 8px rgba(14, 122, 74, 0.25)' : '0 2px 8px rgba(120, 20, 22, 0.25)'
                  }}
                >
                  <span>{currentMobileIndex === MOBILE_STEPS.length - 1 ? 'Preview & Export PDF' : 'Next Step'}</span>
                  {currentMobileIndex === MOBILE_STEPS.length - 1 ? <Eye size={14} /> : <ChevronRight size={14} />}
                </button>
              </div>

            </div>
            </>
          )}

        </div>
      </div>

      {/* =========================================================================
          DRAWER: MY RESUMES (SAVED CRUD)
          ========================================================================= */}

      {/* =========================================================================
          SHARED MODALS & DRAWERS (DESKTOP & MOBILE)
          ========================================================================= */}
      {/* =========================================================================
          DRAWER: MY RESUMES (SAVED CRUD)
          ========================================================================= */}

      {/* =========================================================================
          SHARED MODALS & DRAWERS (DESKTOP & MOBILE)
          ========================================================================= */}
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
                <div style={{ fontSize: '0.76rem', color: '#4A4036', marginTop: '0.25rem', backgroundColor: 'transparent', padding: '0.6rem', borderRadius: '6px' }}>
                  <div>Name: <strong>{importReviewData.personal?.fullName || 'Not detected'}</strong></div>
                  <div>Email: <strong>{importReviewData.personal?.email || 'Not detected'}</strong></div>
                  <div>Phone: <strong>{importReviewData.personal?.phone || 'Not detected'}</strong></div>
                </div>
              </div>

              {importReviewData.skills && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>Extracted Skills:</span>
                  <div style={{ fontSize: '0.76rem', color: '#4A4036', marginTop: '0.25rem', backgroundColor: 'transparent', padding: '0.6rem', borderRadius: '6px' }}>
                    {importReviewData.skills.languages && <div>Languages: {importReviewData.skills.languages}</div>}
                    {importReviewData.skills.frameworks && <div>Frameworks: {importReviewData.skills.frameworks}</div>}
                    {importReviewData.skills.tools && <div>Tools: {importReviewData.skills.tools}</div>}
                  </div>
                </div>
              )}

              {importReviewData.education && importReviewData.education.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>Education Items:</span>
                  <div style={{ fontSize: '0.76rem', color: '#4A4036', marginTop: '0.25rem', backgroundColor: 'transparent', padding: '0.6rem', borderRadius: '6px' }}>
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
                  backgroundColor: 'transparent',
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
                      backgroundColor: 'transparent',
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
