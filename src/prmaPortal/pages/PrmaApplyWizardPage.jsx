import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  Trash2,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Code2,
  Github,
  Linkedin,
  Instagram,
  Eye,
  Check,
  RefreshCw,
  Home,
  Upload,
  Image as ImageIcon,
  MessageCircle,
  Clock,
  Award,
  Search,
  X
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaDomainIcon from '../components/PrmaDomainIcon';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { POPULAR_COLLEGES, POPULAR_UNIVERSITIES } from '../data/institutionsData';
import { usePrmaApplication } from '../context/PrmaApplicationContext';
import '../styles/prmaInternship.css';

export default function PrmaApplyWizardPage({ navigateToTab, onNavigate }) {
  const { selectedDomainId, setSelectedDomainId } = usePrmaApplication();
  const navFn = navigateToTab || onNavigate;

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const DRAFT_KEY = 'prma_internship_draft_v3';

  // Determine initial domain from context or session storage
  const [activeDomain, setActiveDomain] = useState(() => {
    const savedId = typeof window !== 'undefined' ? window.sessionStorage.getItem('prma_selected_domain_id') : null;
    const domId = selectedDomainId || savedId || 'ai-ml';
    return PRMA_DOMAINS.find(d => d.id === domId) || PRMA_DOMAINS[0];
  });

  // Domain selector modal
  const [isDomainPickerOpen, setIsDomainPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // Multi-section form state
  const [formData, setFormData] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem(DRAFT_KEY) : null;
      if (raw) {
        const draft = JSON.parse(raw);
        return {
          fullName: draft.fullName || '',
          dob: draft.dob || '',
          email: draft.email || '',
          mobile: draft.mobile || '',
          whatsapp: draft.whatsapp || '',
          gender: draft.gender || 'Male',
          address: draft.address || '',
          city: draft.city || '',
          state: draft.state || '',
          pinCode: draft.pinCode || '',
          college: draft.college || '',
          university: draft.university || '',
          rollNumber: draft.rollNumber || '',
          course: draft.course || 'B.Tech',
          branch: draft.branch || 'Computer Science and Engineering',
          year: draft.year || '3rd Year',
          semester: draft.semester || '5th',
          graduationYear: draft.graduationYear || '2026',
          skills: draft.skills || '',
          languages: draft.languages || '',
          experience: draft.experience || '',
          experienceLevel: draft.experienceLevel || 'Beginner',
          duration: draft.duration || '1 Month',
          preferredStartDate: draft.preferredStartDate || 'Immediate',
          githubUrl: draft.githubUrl || '',
          linkedinUrl: draft.linkedinUrl || '',
          followedLinkedIn: Boolean(draft.followedLinkedIn),
          followedInstagram: Boolean(draft.followedInstagram),
          confirmedAccuracy: Boolean(draft.confirmedAccuracy),
          confirmedCodeOfConduct: Boolean(draft.confirmedCodeOfConduct)
        };
      }
    } catch {}
    return {
      fullName: '',
      dob: '',
      email: '',
      mobile: '',
      whatsapp: '',
      gender: 'Male',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      college: '',
      university: '',
      rollNumber: '',
      course: 'B.Tech',
      branch: 'Computer Science and Engineering',
      year: '3rd Year',
      semester: '5th',
      graduationYear: '2026',
      skills: '',
      languages: '',
      experience: '',
      experienceLevel: 'Beginner',
      duration: '1 Month',
      preferredStartDate: 'Immediate',
      githubUrl: '',
      linkedinUrl: '',
      followedLinkedIn: false,
      followedInstagram: false,
      confirmedAccuracy: false,
      confirmedCodeOfConduct: false
    };
  });

  // College & University Autocomplete
  const [collegeQuery, setCollegeQuery] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem(DRAFT_KEY) : null;
      if (raw) return JSON.parse(raw).college || '';
    } catch {}
    return '';
  });
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [isCustomCollege, setIsCustomCollege] = useState(false);
  const collegeRef = useRef(null);

  const [universityQuery, setUniversityQuery] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem(DRAFT_KEY) : null;
      if (raw) return JSON.parse(raw).university || '';
    } catch {}
    return '';
  });
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [isCustomUniversity, setIsCustomUniversity] = useState(false);
  const universityRef = useRef(null);

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeBase64, setResumeBase64] = useState('');
  const [resumeError, setResumeError] = useState('');
  const fileInputRef = useRef(null);

  // Social Screenshots
  const [linkedinScreenshotFile, setLinkedinScreenshotFile] = useState(null);
  const [linkedinScreenshotBase64, setLinkedinScreenshotBase64] = useState('');
  const [linkedinScreenshotError, setLinkedinScreenshotError] = useState('');
  const linkedinInputRef = useRef(null);

  const [instagramScreenshotFile, setInstagramScreenshotFile] = useState(null);
  const [instagramScreenshotBase64, setInstagramScreenshotBase64] = useState('');
  const [instagramScreenshotError, setInstagramScreenshotError] = useState('');
  const instagramInputRef = useRef(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [duplicateNotice, setDuplicateNotice] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Persist form draft
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const toSave = {
          ...formData,
          college: isCustomCollege ? formData.college : collegeQuery,
          university: isCustomUniversity ? formData.university : universityQuery
        };
        window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      }
    } catch {}
  }, [formData, collegeQuery, universityQuery, isCustomCollege, isCustomUniversity]);

  // Click outside to close autocomplete
  useEffect(() => {
    function handleClickOutside(e) {
      if (collegeRef.current && !collegeRef.current.contains(e.target)) {
        setShowCollegeDropdown(false);
      }
      if (universityRef.current && !universityRef.current.contains(e.target)) {
        setShowUniversityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredColleges = useMemo(() => {
    const q = collegeQuery.trim().toLowerCase();
    if (!q) return (POPULAR_COLLEGES || []).slice(0, 10);
    return (POPULAR_COLLEGES || []).filter(c => c.toLowerCase().includes(q)).slice(0, 15);
  }, [collegeQuery]);

  const filteredUniversities = useMemo(() => {
    const q = universityQuery.trim().toLowerCase();
    if (!q) return (POPULAR_UNIVERSITIES || []).slice(0, 10);
    return (POPULAR_UNIVERSITIES || []).filter(u => u.toLowerCase().includes(q)).slice(0, 15);
  }, [universityQuery]);

  const filteredDomainsForPicker = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) return PRMA_DOMAINS;
    return PRMA_DOMAINS.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.technologies.some(t => t.toLowerCase().includes(q))
    );
  }, [pickerSearch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Resume File Upload Handler (Compulsory PDF <= 5MB)
  const handleResumeSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setResumeError('Only PDF files are accepted. Please attach your resume as a PDF document.');
      setResumeFile(null);
      setResumeBase64('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Resume file size exceeds the 5 MB limit. Please upload a smaller PDF.');
      setResumeFile(null);
      setResumeBase64('');
      return;
    }

    setResumeError('');
    setResumeFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setResumeBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeBase64('');
    setResumeError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Image compressor for social verification screenshots
  const compressScreenshot = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLinkedinScreenshot = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) && !/\.(jpg|jpeg|png)$/i.test(file.name)) {
      setLinkedinScreenshotError('Please upload an image in JPG or PNG format.');
      return;
    }
    setLinkedinScreenshotError('');
    setLinkedinScreenshotFile(file);
    compressScreenshot(file)
      .then(b64 => setLinkedinScreenshotBase64(b64))
      .catch(() => {
        const r = new FileReader();
        r.onload = () => setLinkedinScreenshotBase64(r.result);
        r.readAsDataURL(file);
      });
  };

  const handleInstagramScreenshot = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) && !/\.(jpg|jpeg|png)$/i.test(file.name)) {
      setInstagramScreenshotError('Please upload an image in JPG or PNG format.');
      return;
    }
    setInstagramScreenshotError('');
    setInstagramScreenshotFile(file);
    compressScreenshot(file)
      .then(b64 => setInstagramScreenshotBase64(b64))
      .catch(() => {
        const r = new FileReader();
        r.onload = () => setInstagramScreenshotBase64(r.result);
        r.readAsDataURL(file);
      });
  };

  // Form Validation
  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full Name is required.';
    if (!formData.dob) return 'Date of Birth is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!formData.mobile.trim() || formData.mobile.trim().length < 10) {
      return 'Please enter a valid 10-digit mobile number.';
    }

    const effectiveCollege = isCustomCollege ? formData.college.trim() : collegeQuery.trim();
    if (!effectiveCollege) return 'College / Institution name is required.';

    const effectiveUniversity = isCustomUniversity ? formData.university.trim() : universityQuery.trim();
    if (!effectiveUniversity) return 'University / Affiliation name is required.';

    if (!formData.rollNumber.trim()) return 'Roll Number / Student ID is required.';
    if (!formData.branch.trim()) return 'Branch / Specialization is required.';

    // GitHub & LinkedIn validation
    const gh = formData.githubUrl.trim();
    if (!gh) return 'GitHub Profile URL is required.';
    const ghNormalized = gh.startsWith('http') ? gh : 'https://' + gh;
    if (!/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?.*$/i.test(ghNormalized)) {
      return 'Please enter a valid GitHub profile URL (e.g., https://github.com/username).';
    }

    const li = formData.linkedinUrl.trim();
    if (!li) return 'LinkedIn Profile URL is required.';
    const liNormalized = li.startsWith('http') ? li : 'https://' + li;
    if (!/^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_%-]+\/?.*$/i.test(liNormalized)) {
      return 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username).';
    }

    // Resume validation
    if (!resumeBase64) {
      return 'Resume upload is compulsory. Please attach your resume in PDF format.';
    }

    // Social follow confirmation & screenshots
    if (!formData.followedLinkedIn || !formData.followedInstagram) {
      return 'Please confirm that you follow PRMA Tech on both LinkedIn and Instagram.';
    }

    if (!linkedinScreenshotBase64) {
      return 'LinkedIn follow verification screenshot is compulsory. Please upload a screenshot verifying that you follow PRMA Tech on LinkedIn.';
    }

    if (!instagramScreenshotBase64) {
      return 'Instagram follow verification screenshot is compulsory. Please upload a screenshot verifying that you follow PRMA Tech on Instagram.';
    }

    if (!formData.confirmedAccuracy) {
      return 'Please confirm the accuracy declaration before submitting.';
    }

    return null;
  };

  // Submit Handler -> Real POST to /api/prma/applications
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setDuplicateNotice(null);

    const effectiveCollege = isCustomCollege ? formData.college.trim() : collegeQuery.trim();
    const effectiveUniversity = isCustomUniversity ? formData.university.trim() : universityQuery.trim();

    let cleanGithub = formData.githubUrl.trim();
    if (!cleanGithub.startsWith('http://') && !cleanGithub.startsWith('https://')) {
      cleanGithub = 'https://' + cleanGithub;
    }
    let cleanLinkedin = formData.linkedinUrl.trim();
    if (!cleanLinkedin.startsWith('http://') && !cleanLinkedin.startsWith('https://')) {
      cleanLinkedin = 'https://' + cleanLinkedin;
    }

    const payload = {
      student: {
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        whatsapp: (formData.whatsapp || formData.mobile || '').trim(),
        gender: formData.gender,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pinCode: formData.pinCode.trim()
      },
      academic: {
        college: effectiveCollege,
        university: effectiveUniversity,
        rollNumber: (formData.rollNumber || '').trim(),
        studentId: (formData.rollNumber || '').trim(),
        course: formData.course,
        branch: formData.branch.trim(),
        year: formData.year,
        semester: formData.semester,
        graduationYear: formData.graduationYear
      },
      technical: {
        domainId: activeDomain.id,
        domainTitle: activeDomain.title,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : activeDomain.skills,
        languages: formData.languages ? formData.languages.split(',').map(s => s.trim()).filter(Boolean) : [],
        experience: formData.experience.trim(),
        experienceLevel: formData.experienceLevel
      },
      duration: formData.duration || '1 Month',
      preferredStartDate: formData.preferredStartDate || 'Immediate',
      profiles: {
        githubUrl: cleanGithub,
        linkedinUrl: cleanLinkedin
      },
      resume: {
        fileName: resumeFile?.name || 'Resume.pdf',
        fileSize: resumeFile?.size || 0,
        fileType: 'application/pdf',
        dataUrl: resumeBase64
      },
      socialFollow: {
        followedLinkedIn: true,
        followedInstagram: true,
        linkedinScreenshot: {
          fileName: linkedinScreenshotFile?.name || 'linkedin-screenshot.jpg',
          dataUrl: linkedinScreenshotBase64
        },
        instagramScreenshot: {
          fileName: instagramScreenshotFile?.name || 'instagram-screenshot.jpg',
          dataUrl: instagramScreenshotBase64
        }
      },
      declaration: {
        confirmedAccuracy: true,
        submittedAt: new Date().toISOString()
      }
    };

    try {
      const res = await fetch('/api/prma/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmissionResult({
          applicationId: data.applicationId || 'PRMA-' + Date.now().toString(36).toUpperCase(),
          domainTitle: activeDomain.title,
          email: formData.email.trim(),
          fullName: formData.fullName.trim(),
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        // Clear draft
        try {
          if (typeof window !== 'undefined') window.sessionStorage.removeItem(DRAFT_KEY);
        } catch {}
        window.scrollTo({ top: 80, behavior: 'smooth' });
      } else if (res.status === 409 || (data.error && data.error.includes('already submitted'))) {
        setDuplicateNotice(data);
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } else {
        setFormError(data.error || 'Failed to submit application. Please check your information.');
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setFormError('Connection issue: ' + (err.message || 'Please check your internet connection and try again.'));
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prma-portal-wrap">
      <PrmaNavbar activeTab="internships" onNavigate={navFn} navigateToTab={navFn} />

      {/* SUCCESS CONFIRMATION VIEW */}
      {submissionResult ? (
        <main className="prma-content-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="prma-success-card">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={38} strokeWidth={2.4} />
            </div>

            <div className="prma-success-badge">
              Application Submitted Successfully!
            </div>

            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem' }}>
              Welcome to PRMA Tech!
            </h1>

            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 1.5rem' }}>
              Thank you, <strong>{submissionResult.fullName}</strong>. Your internship application has been registered in our database. Our technical evaluation committee reviews submissions on a rolling basis.
            </p>

            {/* Dossier Box */}
            <div className="prma-success-id-box">
              <div className="prma-id-row">
                <span style={{ color: '#64748B', fontWeight: 600 }}>Application ID:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#881337', fontSize: '0.95rem' }}>{submissionResult.applicationId}</span>
              </div>
              <div className="prma-id-row">
                <span style={{ color: '#64748B', fontWeight: 600 }}>Track Domain:</span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>{submissionResult.domainTitle}</span>
              </div>
              <div className="prma-id-row">
                <span style={{ color: '#64748B', fontWeight: 600 }}>Registered Email:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{submissionResult.email}</span>
              </div>
              <div className="prma-id-row">
                <span style={{ color: '#64748B', fontWeight: 600 }}>Submission Date:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{submissionResult.date}</span>
              </div>
              <div className="prma-id-row">
                <span style={{ color: '#64748B', fontWeight: 600 }}>Status:</span>
                <span style={{ fontWeight: 800, color: '#047857', background: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                  Submitted — Under Review
                </span>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div style={{ textAlign: 'left', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem', margin: '1.25rem 0', fontSize: '0.82rem', color: '#334155', lineHeight: 1.55 }}>
              <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>What Happens Next?</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>&bull; Your resume and credentials will be assessed by senior engineers.</div>
                <div>&bull; Upon shortlisting, your official PRMA Tech Joining Letter (PDF) and problem statements will be emailed to <strong>{submissionResult.email}</strong>.</div>
                <div>&bull; Please monitor your Inbox and Spam folder for updates.</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a
                href="https://chat.whatsapp.com/GjN8v0eZ9lO0Ywz8v4z1"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  background: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
              >
                <MessageCircle size={18} />
                <span>Join Official WhatsApp Community</span>
              </a>

              <button
                type="button"
                onClick={() => handleNav('home')}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Return to ProfessorVirus Home
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* APPLICATION FORM VIEW */
        <>
          {/* TOP HERO BANNER */}
          <section className="prma-hero-banner">
            <div className="prma-hero-inner">
              <div className="prma-brand-pill">
                <Sparkles size={14} color="#FBBF24" />
                <span>PRMA Tech™ Official Internship Initiative</span>
              </div>

              <h1 className="prma-hero-title">
                Apply for Remote Internship (Batch 2026)
              </h1>

              <p className="prma-hero-subtitle">
                100% Free Virtual Internship initiative providing industry-level practical training, weekly code reviews, official joining letter, and verified credentials.
              </p>

              {/* 4 Feature Highlights */}
              <div className="prma-highlights-row">
                <div className="prma-highlight-chip featured">
                  <div className="prma-chip-icon">₹0</div>
                  <div>
                    <div className="prma-chip-title">Zero Application Fee</div>
                    <div className="prma-chip-sub">100% Free Program</div>
                  </div>
                </div>

                <div className="prma-highlight-chip">
                  <div className="prma-chip-icon">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="prma-chip-title">Official Joining Letter</div>
                    <div className="prma-chip-sub">Issued on Selection</div>
                  </div>
                </div>

                <div className="prma-highlight-chip">
                  <div className="prma-chip-icon">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="prma-chip-title">1 Month &bull; Remote</div>
                    <div className="prma-chip-sub">Self-Paced Flexible</div>
                  </div>
                </div>

                <div className="prma-highlight-chip">
                  <div className="prma-chip-icon">
                    <Award size={16} />
                  </div>
                  <div>
                    <div className="prma-chip-title">Verified Certificate</div>
                    <div className="prma-chip-sub">MSME Registered</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MAIN APPLICATION CONTAINER */}
          <main className="prma-content-container">
            {/* Active Selected Domain Showcase Card */}
            <div className="prma-domain-active-card">
              <div className="prma-domain-active-info">
                <div className="prma-domain-active-icon">
                  <PrmaDomainIcon iconType={activeDomain.iconType} className="w-7 h-7" color={activeDomain.color} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#881337', display: 'block' }}>
                    Applying For Track:
                  </span>
                  <div className="prma-domain-active-title">
                    {activeDomain.title}
                  </div>
                  <div className="prma-domain-active-meta">
                    <span>{activeDomain.category}</span>
                    <span>&bull;</span>
                    <span>1 Month Remote</span>
                    <span>&bull;</span>
                    <span style={{ color: '#047857', fontWeight: 700 }}>Zero Registration Fee</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDomainPickerOpen(true)}
                className="prma-btn-change-domain"
              >
                <span>Change Domain</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Error Message Banner */}
            {formError && (
              <div className="prma-error-banner" role="alert">
                <AlertCircle size={18} color="#E11D48" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Please check your submission:</strong>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            {/* Duplicate Notice Banner */}
            {duplicateNotice && (
              <div className="prma-duplicate-banner" role="alert">
                <ShieldCheck size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Application Already Received</strong>
                  <span>
                    You have already submitted an application for <strong>{activeDomain.title}</strong> with this email. Your Application ID is <strong>{duplicateNotice.applicationId}</strong>. Check your inbox for updates!
                  </span>
                </div>
              </div>
            )}

            {/* THE FORM */}
            <form onSubmit={handleSubmit} noValidate>
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="prma-form-section">
                <div className="prma-section-header">
                  <div className="prma-section-number">1</div>
                  <h3 className="prma-section-title">Personal Information</h3>
                </div>

                <div className="prma-grid-2">
                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Full Legal Name <span className="req">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyanshu Kumar"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="prma-input"
                      required
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Date of Birth <span className="req">*</span></span>
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className="prma-input"
                      required
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Email Address <span className="req">*</span></span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Joining letter sent here</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. student@college.edu or gmail.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="prma-input"
                      required
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Mobile Number <span className="req">*</span></span>
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="prma-input"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>WhatsApp Number (Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Leave blank to use mobile number"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="prma-input"
                      maxLength={10}
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Gender <span className="req">*</span></span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="prma-select"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>City <span className="req">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Noida / New Delhi"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="prma-input"
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>State <span className="req">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Uttar Pradesh"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="prma-input"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: ACADEMIC DETAILS */}
              <div className="prma-form-section">
                <div className="prma-section-header">
                  <div className="prma-section-number">2</div>
                  <h3 className="prma-section-title">Academic Details</h3>
                </div>

                <div className="prma-grid-2">
                  {/* College Autocomplete */}
                  <div className="prma-form-group" ref={collegeRef}>
                    <label className="prma-label">
                      <span>College / Institute Name <span className="req">*</span></span>
                      <button
                        type="button"
                        onClick={() => setIsCustomCollege(!isCustomCollege)}
                        style={{ background: 'none', border: 'none', color: '#881337', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        {isCustomCollege ? 'Search suggestions' : 'Not listed? Enter custom'}
                      </button>
                    </label>
                    {isCustomCollege ? (
                      <input
                        type="text"
                        placeholder="Type full college name"
                        value={formData.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                        className="prma-input"
                        required
                      />
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="Search your college name..."
                          value={collegeQuery}
                          onChange={(e) => {
                            setCollegeQuery(e.target.value);
                            setShowCollegeDropdown(true);
                          }}
                          onFocus={() => setShowCollegeDropdown(true)}
                          className="prma-input"
                          required
                        />
                        {showCollegeDropdown && filteredColleges.length > 0 && (
                          <div className="prma-autocomplete-list">
                            {filteredColleges.map((col, idx) => (
                              <div
                                key={idx}
                                className="prma-autocomplete-item"
                                onClick={() => {
                                  setCollegeQuery(col);
                                  handleInputChange('college', col);
                                  setShowCollegeDropdown(false);
                                }}
                              >
                                {col}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* University Autocomplete */}
                  <div className="prma-form-group" ref={universityRef}>
                    <label className="prma-label">
                      <span>University / Board Affiliation <span className="req">*</span></span>
                      <button
                        type="button"
                        onClick={() => setIsCustomUniversity(!isCustomUniversity)}
                        style={{ background: 'none', border: 'none', color: '#881337', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        {isCustomUniversity ? 'Search suggestions' : 'Not listed? Enter custom'}
                      </button>
                    </label>
                    {isCustomUniversity ? (
                      <input
                        type="text"
                        placeholder="Type full university name"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        className="prma-input"
                        required
                      />
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="Search your university affiliation..."
                          value={universityQuery}
                          onChange={(e) => {
                            setUniversityQuery(e.target.value);
                            setShowUniversityDropdown(true);
                          }}
                          onFocus={() => setShowUniversityDropdown(true)}
                          className="prma-input"
                          required
                        />
                        {showUniversityDropdown && filteredUniversities.length > 0 && (
                          <div className="prma-autocomplete-list">
                            {filteredUniversities.map((uni, idx) => (
                              <div
                                key={idx}
                                className="prma-autocomplete-item"
                                onClick={() => {
                                  setUniversityQuery(uni);
                                  handleInputChange('university', uni);
                                  setShowUniversityDropdown(false);
                                }}
                              >
                                {uni}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>University Roll Number / Student ID <span className="req">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2100970100012"
                      value={formData.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      className="prma-input"
                      required
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Course / Degree <span className="req">*</span></span>
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      className="prma-select"
                    >
                      <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                      <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                      <option value="MCA">MCA (Master of Computer Applications)</option>
                      <option value="M.Tech">M.Tech (Master of Technology)</option>
                      <option value="B.Sc CS/IT">B.Sc Computer Science / IT</option>
                      <option value="Diploma">Polytechnic Diploma</option>
                      <option value="Other">Other Degree</option>
                    </select>
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Branch / Specialization <span className="req">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science and Engineering"
                      value={formData.branch}
                      onChange={(e) => handleInputChange('branch', e.target.value)}
                      className="prma-input"
                      required
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Current Academic Year <span className="req">*</span></span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="prma-select"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Passout / Graduate">Passout / Graduate</option>
                    </select>
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Graduation Year <span className="req">*</span></span>
                    </label>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                      className="prma-select"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: TECHNICAL SKILLS */}
              <div className="prma-form-section">
                <div className="prma-section-header">
                  <div className="prma-section-number">3</div>
                  <h3 className="prma-section-title">Technical Background &amp; Skills</h3>
                </div>

                <div className="prma-grid-2">
                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Known Skills &amp; Frameworks</span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Comma separated</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Python, Machine Learning, TensorFlow, Pandas"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      className="prma-input"
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Programming Languages</span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Comma separated</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Python, C++, JavaScript, SQL"
                      value={formData.languages}
                      onChange={(e) => handleInputChange('languages', e.target.value)}
                      className="prma-input"
                    />
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Self-Assessed Experience Level</span>
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                      className="prma-select"
                    >
                      <option value="Beginner">Beginner (Curious, eager to learn)</option>
                      <option value="Intermediate">Intermediate (Built a few projects)</option>
                      <option value="Advanced">Advanced (Production familiar)</option>
                    </select>
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>Preferred Start Date</span>
                    </label>
                    <select
                      value={formData.preferredStartDate}
                      onChange={(e) => handleInputChange('preferredStartDate', e.target.value)}
                      className="prma-select"
                    >
                      <option value="Immediate">Immediate (Within 48 hours)</option>
                      <option value="Next Monday">Next Monday</option>
                      <option value="1st of Next Month">1st of Next Month</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PROFESSIONAL PROFILES */}
              <div className="prma-form-section">
                <div className="prma-section-header">
                  <div className="prma-section-number">4</div>
                  <h3 className="prma-section-title">Professional Profiles</h3>
                </div>

                <div className="prma-grid-2">
                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>GitHub Profile URL <span className="req">*</span></span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Github size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="url"
                        placeholder="https://github.com/your-username"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        className="prma-input"
                        style={{ paddingLeft: '36px' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="prma-form-group">
                    <label className="prma-label">
                      <span>LinkedIn Profile URL <span className="req">*</span></span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Linkedin size={16} color="#0A66C2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="url"
                        placeholder="https://www.linkedin.com/in/your-username"
                        value={formData.linkedinUrl}
                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                        className="prma-input"
                        style={{ paddingLeft: '36px' }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: RESUME UPLOAD */}
              <div className="prma-form-section">
                <div className="prma-section-header">
                  <div className="prma-section-number">5</div>
                  <h3 className="prma-section-title">Resume / CV Upload (Compulsory PDF) <span className="req">*</span></h3>
                </div>

                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleResumeSelect}
                  style={{ display: 'none' }}
                />

                {!resumeFile ? (
                  <div
                    className="prma-upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF1F2', color: '#881337', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#881337', display: 'block' }}>
                        Click to Upload Resume (PDF)
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        PDF documents only &bull; Maximum file size: 5 MB
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="prma-file-preview">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <FileText size={22} color="#059669" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#065F46', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {resumeFile.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#059669' }}>
                          {(resumeFile.size / 1024).toFixed(1)} KB &bull; Verified PDF
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeResume}
                      style={{ background: 'none', border: 'none', color: '#E11D48', cursor: 'pointer', padding: '6px' }}
                      aria-label="Remove resume"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {resumeError && (
                  <div style={{ marginTop: '0.5rem', color: '#E11D48', fontSize: '0.78rem', fontWeight: 600 }}>
                    {resumeError}
                  </div>
                )}
              </div>

              {/* SECTION 6: SOCIAL MEDIA VERIFICATION */}
              <div className="prma-form-section">
                <div className="prma-section-header">
                  <div className="prma-section-number">6</div>
                  <h3 className="prma-section-title">Official Channel Verification <span className="req">*</span></h3>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  To ensure smooth batch coordination, students are required to follow PRMA Tech official handles where joining letters, project problem statements, and batch schedules are announced.
                </p>

                {/* LinkedIn Follow Card */}
                <div className="prma-social-card">
                  <div className="prma-social-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Linkedin size={20} color="#0A66C2" />
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                        1. Follow PRMA Tech on LinkedIn <span className="req">*</span>
                      </span>
                    </div>

                    <a
                      href="https://www.linkedin.com/company/prmatech/about/?viewAsMember=true"
                      target="_blank"
                      rel="noreferrer"
                      className="prma-btn-social-follow linkedin"
                    >
                      <span>Follow Company</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <label className="prma-checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.followedLinkedIn}
                      onChange={(e) => handleInputChange('followedLinkedIn', e.target.checked)}
                      className="prma-checkbox"
                    />
                    <span style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                      I confirm that I have followed PRMA Tech on LinkedIn.
                    </span>
                  </label>

                  {/* Screenshot upload */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      ref={linkedinInputRef}
                      onChange={handleLinkedinScreenshot}
                      style={{ display: 'none' }}
                    />
                    {!linkedinScreenshotFile ? (
                      <button
                        type="button"
                        onClick={() => linkedinInputRef.current?.click()}
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '10px',
                          border: '1.5px dashed #CBD5E1',
                          background: '#FFFFFF',
                          color: '#475569',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <ImageIcon size={14} />
                        <span>Upload LinkedIn Following Screenshot (Compulsory JPG/PNG)</span>
                      </button>
                    ) : (
                      <div className="prma-file-preview">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={16} color="#059669" />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065F46' }}>
                            {linkedinScreenshotFile.name} (Uploaded)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setLinkedinScreenshotFile(null);
                            setLinkedinScreenshotBase64('');
                          }}
                          style={{ background: 'none', border: 'none', color: '#E11D48', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    {linkedinScreenshotError && (
                      <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '4px' }}>
                        {linkedinScreenshotError}
                      </div>
                    )}
                  </div>
                </div>

                {/* Instagram Follow Card */}
                <div className="prma-social-card">
                  <div className="prma-social-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Instagram size={20} color="#DD2A7B" />
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                        2. Follow PRMA Tech on Instagram <span className="req">*</span>
                      </span>
                    </div>

                    <a
                      href="https://www.instagram.com/prma.tech/"
                      target="_blank"
                      rel="noreferrer"
                      className="prma-btn-social-follow instagram"
                    >
                      <span>Follow Handle</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <label className="prma-checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.followedInstagram}
                      onChange={(e) => handleInputChange('followedInstagram', e.target.checked)}
                      className="prma-checkbox"
                    />
                    <span style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                      I confirm that I have followed PRMA Tech on Instagram.
                    </span>
                  </label>

                  {/* Screenshot upload */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      ref={instagramInputRef}
                      onChange={handleInstagramScreenshot}
                      style={{ display: 'none' }}
                    />
                    {!instagramScreenshotFile ? (
                      <button
                        type="button"
                        onClick={() => instagramInputRef.current?.click()}
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '10px',
                          border: '1.5px dashed #CBD5E1',
                          background: '#FFFFFF',
                          color: '#475569',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <ImageIcon size={14} />
                        <span>Upload Instagram Following Screenshot (Compulsory JPG/PNG)</span>
                      </button>
                    ) : (
                      <div className="prma-file-preview">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={16} color="#059669" />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065F46' }}>
                            {instagramScreenshotFile.name} (Uploaded)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setInstagramScreenshotFile(null);
                            setInstagramScreenshotBase64('');
                          }}
                          style={{ background: 'none', border: 'none', color: '#E11D48', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    {instagramScreenshotError && (
                      <div style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '4px' }}>
                        {instagramScreenshotError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 7: DECLARATION */}
              <div className="prma-form-section">
                <div className="prma-section-header">
                  <div className="prma-section-number">7</div>
                  <h3 className="prma-section-title">Declaration &amp; Honor Code <span className="req">*</span></h3>
                </div>

                <label className="prma-checkbox-row">
                  <input
                    type="checkbox"
                    checked={formData.confirmedAccuracy}
                    onChange={(e) => handleInputChange('confirmedAccuracy', e.target.checked)}
                    className="prma-checkbox"
                    required
                  />
                  <span style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                    I solemnly declare that all information submitted in this application is accurate and true to the best of my knowledge. I understand that selection is strictly merit-based and zero application fees are required.
                  </span>
                </label>

                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="prma-btn-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Submitting Application to PRMA Tech...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={19} />
                        <span>Submit Official Internship Application (100% Free)</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.5rem' }}>
                    Zero Registration Fee &bull; Verified MSME Certified Internship
                  </p>
                </div>
              </div>
            </form>
          </main>
        </>
      )}

      {/* DOMAIN PICKER MODAL */}
      {isDomainPickerOpen && (
        <div className="prma-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsDomainPickerOpen(false); }}>
          <div className="prma-modal-window">
            <div className="prma-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Select Internship Domain</h3>
                <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Choose from 27 specialized engineering tracks</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDomainPickerOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '6px' }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '0.85rem 1.35rem', borderBottom: '1.5px solid #F1F5F9' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search 27 domains, skills, tools..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="prma-input"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            <div className="prma-modal-body">
              <div className="prma-domain-grid-modal">
                {filteredDomainsForPicker.map((d) => (
                  <div
                    key={d.id}
                    className={`prma-domain-option-card ${activeDomain.id === d.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveDomain(d);
                      setSelectedDomainId(d.id);
                      if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem('prma_selected_domain_id', d.id);
                        window.sessionStorage.setItem('prma_selected_domain_title', d.title);
                      }
                      setIsDomainPickerOpen(false);
                    }}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${d.color || '#881337'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <PrmaDomainIcon iconType={d.iconType} className="w-5 h-5" color={d.color} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>{d.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#881337', fontWeight: 600, marginTop: '2px' }}>{d.category}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {d.technologies.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    {activeDomain.id === d.id && (
                      <CheckCircle2 size={16} color="#881337" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <PrmaFooter />
    </div>
  );
}
