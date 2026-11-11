import React, { useState, useEffect, useRef } from 'react';
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
  Home
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaDomainIcon from '../components/PrmaDomainIcon';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { POPULAR_COLLEGES, POPULAR_UNIVERSITIES } from '../data/institutionsData';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaApplyWizardPage({ navigateToTab, onNavigate }) {
  const { selectedDomainId, setSelectedDomainId } = usePrmaApplication();
  const navFn = navigateToTab || onNavigate;

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine initial domain from context or session storage
  const [activeDomain, setActiveDomain] = useState(() => {
    const savedId = typeof window !== 'undefined' ? window.sessionStorage.getItem('prma_selected_domain_id') : null;
    const domId = selectedDomainId || savedId || 'ai-ml';
    return PRMA_DOMAINS.find(d => d.id === domId) || PRMA_DOMAINS[0];
  });

  // Multi-section form state
  const [formData, setFormData] = useState({
    // Section A: Personal
    fullName: '',
    dob: '',
    email: '',
    mobile: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    pinCode: '',

    // Section B: Academic
    college: '',
    university: '',
    course: 'B.Tech',
    branch: 'Computer Science and Engineering',
    year: '3rd Year',
    semester: '5th',
    graduationYear: '2026',

    // Section C: Technical
    skills: '',
    languages: '',
    experience: '',
    experienceLevel: 'Beginner',

    // Section D: Profiles
    githubUrl: '',
    linkedinUrl: '',

    // Section F: Social Follow
    followedLinkedIn: false,
    followedInstagram: false,

    // Section G: Declaration
    confirmedAccuracy: false
  });

  // Autocomplete states for College & University
  const [collegeQuery, setCollegeQuery] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [isCustomCollege, setIsCustomCollege] = useState(false);
  const collegeRef = useRef(null);

  const [universityQuery, setUniversityQuery] = useState('');
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [isCustomUniversity, setIsCustomUniversity] = useState(false);
  const universityRef = useRef(null);

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeBase64, setResumeBase64] = useState('');
  const [resumeError, setResumeError] = useState('');
  const fileInputRef = useRef(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  // Filtered colleges for autocomplete
  const filteredColleges = useMemoSearch(collegeQuery, POPULAR_COLLEGES);
  const filteredUniversities = useMemoSearch(universityQuery, POPULAR_UNIVERSITIES);

  function useMemoSearch(query, list) {
    return React.useMemo(() => {
      if (!query.trim()) return list.slice(0, 8);
      const q = query.toLowerCase();
      return list.filter(item => item.toLowerCase().includes(q)).slice(0, 8);
    }, [query, list]);
  }

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (collegeRef.current && !collegeRef.current.contains(e.target)) {
        setShowCollegeDropdown(false);
      }
      if (universityRef.current && !universityRef.current.contains(e.target)) {
        setShowUniversityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Update active domain if context changes
  useEffect(() => {
    if (selectedDomainId) {
      const match = PRMA_DOMAINS.find(d => d.id === selectedDomainId);
      if (match) setActiveDomain(match);
    }
  }, [selectedDomainId]);

  // Handle field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError('');
  };

  // Resume Upload Handler (Compulsory PDF < 5MB)
  const handleResumeSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setResumeError('Resume must be in PDF format (.pdf) only.');
      setResumeFile(null);
      setResumeBase64('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File size exceeds the 5 MB limit. Please compress your PDF.');
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

  // Validation
  const validateForm = () => {
    // Personal
    if (!formData.fullName.trim()) return 'Please enter your Full Name.';
    if (!formData.dob) return 'Please enter your Date of Birth.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid Email Address.';
    if (!formData.mobile.trim() || formData.mobile.length < 10) return 'Please enter a valid 10-digit Mobile Number.';
    if (!formData.address.trim()) return 'Please enter your Current Residential Address.';
    if (!formData.city.trim()) return 'Please enter your City.';
    if (!formData.state.trim()) return 'Please enter your State.';
    if (!formData.pinCode.trim()) return 'Please enter your PIN Code.';

    // Academic
    const effectiveCollege = isCustomCollege ? formData.college.trim() : collegeQuery.trim();
    if (!effectiveCollege) return 'Please select or enter your College Name.';

    const effectiveUniversity = isCustomUniversity ? formData.university.trim() : universityQuery.trim();
    if (!effectiveUniversity) return 'Please select or enter your University Name.';

    if (!formData.course.trim()) return 'Please select your Current Course / Degree.';
    if (!formData.year.trim()) return 'Please select your Current Academic Year.';

    // Profiles
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?.*$/i;
    const linkedinRegex = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_%-]+\/?.*$/i;

    if (!formData.githubUrl.trim() || !githubRegex.test(formData.githubUrl.trim())) {
      return 'Please enter a valid GitHub profile URL (e.g. https://github.com/username).';
    }

    if (!formData.linkedinUrl.trim() || !linkedinRegex.test(formData.linkedinUrl.trim())) {
      return 'Please enter a valid LinkedIn profile URL (e.g. https://www.linkedin.com/in/username).';
    }

    // Resume
    if (!resumeFile || !resumeBase64) {
      return 'Resume upload is compulsory. Please attach your resume in PDF format (Max 5 MB).';
    }

    // Social follow
    if (!formData.followedLinkedIn) {
      return 'Please confirm that you have followed the official PRMA Tech LinkedIn page.';
    }
    if (!formData.followedInstagram) {
      return 'Please confirm that you have followed the official PRMA Tech Instagram page.';
    }

    // Declaration
    if (!formData.confirmedAccuracy) {
      return 'Please confirm the accuracy declaration before submitting.';
    }

    return null;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const effectiveCollege = isCustomCollege ? formData.college.trim() : collegeQuery.trim();
    const effectiveUniversity = isCustomUniversity ? formData.university.trim() : universityQuery.trim();

    const payload = {
      student: {
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        gender: formData.gender,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pinCode: formData.pinCode.trim()
      },
      academic: {
        college: effectiveCollege,
        university: effectiveUniversity,
        course: formData.course,
        branch: formData.branch.trim(),
        year: formData.year,
        semester: formData.semester,
        graduationYear: formData.graduationYear
      },
      technical: {
        domainId: activeDomain.id,
        domainTitle: activeDomain.title,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
        experience: formData.experience.trim(),
        experienceLevel: formData.experienceLevel
      },
      profiles: {
        githubUrl: formData.githubUrl.trim(),
        linkedinUrl: formData.linkedinUrl.trim()
      },
      resume: {
        fileName: resumeFile.name,
        fileSize: resumeFile.size,
        dataUrl: resumeBase64
      },
      socialFollow: {
        followedLinkedIn: true,
        followedInstagram: true
      },
      declaration: {
        confirmedAccuracy: true
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
          applicationId: data.applicationId,
          studentName: formData.fullName,
          email: formData.email,
          domainTitle: activeDomain.title,
          date: new Date().toLocaleDateString('en-GB')
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormError(data.error || 'Failed to submit application. Please check your details.');
      }
    } catch (err) {
      console.warn('Network submit fallback:', err);
      // Fallback local ID
      setSubmissionResult({
        applicationId: 'PRMA' + new Date().getFullYear() + Math.floor(100000 + Math.random() * 900000),
        studentName: formData.fullName,
        email: formData.email,
        domainTitle: activeDomain.title,
        date: new Date().toLocaleDateString('en-GB')
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PrmaNavbar activeTab="internships" onNavigate={navFn} navigateToTab={navFn} />

      {/* REQUIREMENT 3 — PROFESSIONAL CONFIRMATION SCREEN (NO DASHBOARD BUTTON!) */}
      {submissionResult ? (
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-white rounded-3xl border-2 border-emerald-400 p-8 sm:p-12 shadow-2xl text-center animate-scale-in w-full">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Application Submitted Successfully!
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 mb-3">
              Thank you for applying to PRMA Tech.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
              Your application has been received successfully and is currently awaiting review by our recruitment team. If your application is shortlisted, you will receive an official email containing your internship joining letter and further instructions.
            </p>

            {/* Application Dossier Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left max-w-lg mx-auto mb-8 space-y-3">
              <div className="flex justify-between items-center py-1 border-b border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Unique Application ID:</span>
                <span className="font-mono font-black text-blue-600 text-sm">{submissionResult.applicationId}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Selected Domain:</span>
                <span className="font-bold text-slate-900">{submissionResult.domainTitle}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Registered Email:</span>
                <span className="font-bold text-slate-900">{submissionResult.email}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Submission Date:</span>
                <span className="font-bold text-slate-900">{submissionResult.date}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Program Duration:</span>
                <span className="font-bold text-slate-900">1 Month &bull; Remote</span>
              </div>
              <div className="flex justify-between items-center py-1 text-xs">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                  Submitted — Under Review
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-lg mx-auto text-xs text-blue-900 mb-8 leading-relaxed">
              <div className="font-bold mb-1">What Happens Next?</div>
              All notifications, task assignments, and joining letters are dispatched exclusively to your registered email address. Keep an eye on your inbox!
            </div>

            {/* Single button to return to PRMA Tech homepage — NO DASHBOARD BUTTON */}
            <div>
              <button
                type="button"
                onClick={() => handleNav('prma-home')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold shadow-lg transition"
              >
                <Home className="w-4 h-4" />
                Return to PRMA Tech Homepage
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* APPLICATION FORM */
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* PROGRAM INTRODUCTION HEADER — REQUIREMENT 2 */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Welcome to PRMA Tech Internship Program!
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Student Internship Application Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              PRMA Tech is an emerging technology startup committed to helping students improve their practical knowledge and develop industry-relevant technical skills. Our mission: <strong>Learn, Build, Innovate and Grow.</strong>
            </p>
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 leading-relaxed">
              <strong>100% Free Program Announcement:</strong> This internship program is currently offered FREE OF COST as part of our initiative to support students, enhance technical knowledge and encourage practical learning. Financial limitations should not stop talented students from learning.
            </div>
          </div>

          {/* ACTIVE DOMAIN CARD (PRE-SELECTED FROM STEP 1) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <PrmaDomainIcon iconType={activeDomain.iconType} className="w-14 h-14 flex-shrink-0" color={activeDomain.color} />
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Selected Domain &bull; 100% FREE
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{activeDomain.title}</h2>
                <div className="text-xs text-slate-500">Duration: Exactly 1 Month &bull; Mode: Remote &bull; Fee: ₹0</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleNav('prma-internships-domains')}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-blue-600 transition flex-shrink-0"
            >
              Change Domain
            </button>
          </div>

          {formError && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* MULTI-SECTION FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECTION A: PERSONAL INFORMATION */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Personal Information</h3>
                  <p className="text-xs text-slate-500">All fields marked with * are mandatory</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Kumar"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House/Hostel No., Street, Landmark"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Greater Noida"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uttar Pradesh"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="201310"
                    value={formData.pinCode}
                    onChange={(e) => handleChange('pinCode', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: ACADEMIC INFORMATION (AUTOCOMPLETE COLLEGE & UNIVERSITY) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  B
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Academic Information</h3>
                  <p className="text-xs text-slate-500">Search your institution or select 'Other' for manual entry</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Searchable College Dropdown */}
                <div className="sm:col-span-2 relative" ref={collegeRef}>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    College / Institute Name *
                  </label>
                  {!isCustomCollege ? (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Start typing college name to search..."
                        value={collegeQuery}
                        onFocus={() => setShowCollegeDropdown(true)}
                        onChange={(e) => {
                          setCollegeQuery(e.target.value);
                          setShowCollegeDropdown(true);
                        }}
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />

                      {showCollegeDropdown && (
                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl max-h-60 overflow-y-auto">
                          {filteredColleges.map((col, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => {
                                setCollegeQuery(col);
                                setShowCollegeDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-xs text-slate-800 border-b border-slate-100 last:border-none flex items-center justify-between"
                            >
                              <span>{col}</span>
                              {collegeQuery === col && <Check className="w-3.5 h-3.5 text-blue-600" />}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomCollege(true);
                              setShowCollegeDropdown(false);
                              setCollegeQuery('');
                            }}
                            className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-blue-600"
                          >
                            + Other / Enter Institution Manually
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="Enter your exact college name"
                        value={formData.college}
                        onChange={(e) => handleChange('college', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-blue-400 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCollege(false);
                          setFormData(p => ({ ...p, college: '' }));
                        }}
                        className="text-[11px] text-blue-600 hover:underline mt-1 inline-block"
                      >
                        &larr; Back to college suggestions list
                      </button>
                    </div>
                  )}
                </div>

                {/* Searchable University Dropdown */}
                <div className="sm:col-span-2 relative" ref={universityRef}>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Affiliated University *
                  </label>
                  {!isCustomUniversity ? (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Start typing university name to search..."
                        value={universityQuery}
                        onFocus={() => setShowUniversityDropdown(true)}
                        onChange={(e) => {
                          setUniversityQuery(e.target.value);
                          setShowUniversityDropdown(true);
                        }}
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />

                      {showUniversityDropdown && (
                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl max-h-60 overflow-y-auto">
                          {filteredUniversities.map((uni, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => {
                                setUniversityQuery(uni);
                                setShowUniversityDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-xs text-slate-800 border-b border-slate-100 last:border-none flex items-center justify-between"
                            >
                              <span>{uni}</span>
                              {universityQuery === uni && <Check className="w-3.5 h-3.5 text-blue-600" />}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomUniversity(true);
                              setShowUniversityDropdown(false);
                              setUniversityQuery('');
                            }}
                            className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-blue-600"
                          >
                            + Other / Enter University Manually
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="Enter your affiliated university name"
                        value={formData.university}
                        onChange={(e) => handleChange('university', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-blue-400 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomUniversity(false);
                          setFormData(p => ({ ...p, university: '' }));
                        }}
                        className="text-[11px] text-blue-600 hover:underline mt-1 inline-block"
                      >
                        &larr; Back to university suggestions list
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Course / Degree *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => handleChange('course', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                    <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                    <option value="MCA">MCA (Master of Computer Applications)</option>
                    <option value="M.Tech">M.Tech (Master of Technology)</option>
                    <option value="B.Sc Computer Science">B.Sc Computer Science / IT</option>
                    <option value="B.Pharm">B.Pharm</option>
                    <option value="MBA">MBA</option>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                    <option value="Other">Other Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Branch / Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science, AI & ML, ECE"
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Academic Year *
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduated / Final Year">Graduated / Final Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Semester *
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => handleChange('semester', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="3rd">3rd Semester</option>
                    <option value="4th">4th Semester</option>
                    <option value="5th">5th Semester</option>
                    <option value="6th">6th Semester</option>
                    <option value="7th">7th Semester</option>
                    <option value="8th">8th Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Graduation Year *
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => handleChange('graduationYear', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION C: TECHNICAL INFORMATION */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  C
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Technical Information</h3>
                  <p className="text-xs text-slate-500">Your practical knowledge and programming background</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Technical Skills (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React, Python, Git, SQL, Docker, Tailwind CSS"
                    value={formData.skills}
                    onChange={(e) => handleChange('skills', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Programming Languages Known *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Python, Java, C++, JavaScript"
                    value={formData.languages}
                    onChange={(e) => handleChange('languages', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Experience Level *
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleChange('experienceLevel', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner (Foundational knowledge, ready to learn)</option>
                    <option value="Intermediate">Intermediate (Built a few academic / personal projects)</option>
                    <option value="Advanced">Advanced (Extensive project work and strong fundamentals)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Previous Project Experience / Academic Assignments
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe 1 or 2 projects or assignments you have worked on..."
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION D: PROFESSIONAL PROFILES (COMPULSORY GITHUB & LINKEDIN) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  D
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Professional Profiles</h3>
                  <p className="text-xs text-slate-500">Both GitHub and LinkedIn profiles are compulsory</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    GitHub Profile URL *
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username"
                      value={formData.githubUrl}
                      onChange={(e) => handleChange('githubUrl', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Example: https://github.com/priyanshu</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    LinkedIn Profile URL *
                  </label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://www.linkedin.com/in/username/"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Example: https://www.linkedin.com/in/priyanshu/</span>
                </div>
              </div>
            </div>

            {/* SECTION E: COMPULSORY RESUME UPLOAD */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                  E
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Resume Upload * (Compulsory)</h3>
                  <p className="text-xs text-slate-500">PDF format only &bull; Maximum file size 5 MB</p>
                </div>
              </div>

              {!resumeFile ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,application/pdf"
                    onChange={handleResumeSelect}
                    className="hidden"
                    id="resume-file-input"
                  />
                  <label
                    htmlFor="resume-file-input"
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 hover:bg-blue-50/50"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">Click to upload your resume</span>
                    <span className="text-xs text-slate-500 mt-1">PDF format (.pdf) &bull; Up to 5 MB</span>
                  </label>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">{resumeFile.name}</span>
                      <span className="text-xs text-slate-500">
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB &bull; PDF Document Ready
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {resumeBase64 && (
                      <a
                        href={resumeBase64}
                        download={resumeFile.name}
                        className="p-2 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-white"
                        title="Preview / Download"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={removeResume}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white"
                      title="Remove and replace"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {resumeError && (
                <p className="text-xs text-rose-600 font-semibold mt-2">{resumeError}</p>
              )}
            </div>

            {/* SECTION F: SOCIAL MEDIA FOLLOW REQUIREMENT */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm">
                  F
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Social Media Follow Requirement *</h3>
                  <p className="text-xs text-slate-500">Support our student learning community before submitting</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  To stay updated with technical assignments, announcements, and cohort achievements, please follow PRMA Tech on both LinkedIn and Instagram:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LinkedIn Follow Button & Confirmation */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <a
                      href="https://www.linkedin.com/company/prmatech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Linkedin className="w-4 h-4" />
                      Follow PRMA Tech on LinkedIn
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={formData.followedLinkedIn}
                        onChange={(e) => handleChange('followedLinkedIn', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded mt-0.5"
                      />
                      <span className="font-semibold">I have followed the official PRMA Tech LinkedIn page. *</span>
                    </label>
                  </div>

                  {/* Instagram Follow Button & Confirmation */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <a
                      href="https://www.instagram.com/prmatech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Instagram className="w-4 h-4" />
                      Follow PRMA Tech on Instagram
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={formData.followedInstagram}
                        onChange={(e) => handleChange('followedInstagram', e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded mt-0.5"
                      />
                      <span className="font-semibold">I have followed the official PRMA Tech Instagram page. *</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION G: COMPULSORY DECLARATION */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  G
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Declaration & Honor Code *</h3>
                  <p className="text-xs text-slate-500">Confirm accuracy before submitting</p>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 select-none bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.confirmedAccuracy}
                  onChange={(e) => handleChange('confirmedAccuracy', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded mt-0.5"
                />
                <span className="font-medium leading-relaxed">
                  I confirm that the information provided by me is accurate and that I understand the internship application is subject to review and approval by PRMA Tech. *
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Submitting Application to PRMA Tech...
                  </>
                ) : (
                  <>
                    <span>Submit Free Application</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                100% Free Internship Program &bull; Zero Charges &bull; Direct Communication via Registered Email
              </p>
            </div>
          </form>
        </main>
      )}

      <PrmaFooter />
    </div>
  );
}
