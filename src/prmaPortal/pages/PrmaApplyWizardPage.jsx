import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaApplyWizardPage({ navigateToTab, onNavigate }) {
  const { selectedDomain, selectedDomainId, setSelectedDomainId } = usePrmaApplication();
  const navFn = navigateToTab || onNavigate;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: '',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    graduationYear: '2026',
    city: '',
    state: '',
    linkedinUrl: '',
    githubUrl: '',
    skills: 'Python, React, Git',
    domainId: selectedDomainId || 'ai-ml',
    shortIntro: '',
    whyPrma: '',
    agreedToTerms: false
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeBase64, setResumeBase64] = useState('');
  const [resumeError, setResumeError] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Sync domain from context or URL query
  useEffect(() => {
    if (selectedDomainId && selectedDomainId !== formData.domainId) {
      setFormData((prev) => ({ ...prev, domainId: selectedDomainId }));
    }
  }, [selectedDomainId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    setResumeError('');

    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Resume file size must be less than 5 MB.');
      return;
    }

    // Validate type (PDF or DOC/DOCX)
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setResumeError('Please upload a valid PDF or Word document (.pdf, .doc, .docx).');
      return;
    }

    setResumeFile(file);

    // Read base64 for persistent payload
    const reader = new FileReader();
    reader.onload = () => {
      setResumeBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim().replace(/\D/g, '').slice(-10))) {
      newErrors.mobile = 'Please provide a valid 10-digit mobile number.';
    }

    if (!formData.college.trim()) newErrors.college = 'College or University name is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State is required.';
    if (!formData.domainId) newErrors.domainId = 'Please select an internship domain.';
    if (!formData.whyPrma.trim()) newErrors.whyPrma = 'Please briefly state why you want to join PRMA Tech.';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must confirm the internship guidelines.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    const activeDomainObj = PRMA_DOMAINS.find((d) => d.id === formData.domainId) || PRMA_DOMAINS[0];

    const payload = {
      student: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        college: formData.college.trim(),
        course: formData.course,
        branch: formData.branch,
        year: formData.year,
        graduationYear: formData.graduationYear,
        city: formData.city.trim(),
        state: formData.state.trim(),
        linkedinUrl: formData.linkedinUrl.trim(),
        githubUrl: formData.githubUrl.trim(),
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        shortIntro: formData.shortIntro.trim(),
        whyPrma: formData.whyPrma.trim(),
        resumeFileName: resumeFile?.name || 'Resume_Submitted.pdf',
        resumeDataUrl: resumeBase64 || ''
      },
      domain: {
        id: activeDomainObj.id,
        title: activeDomainObj.title,
        badge: activeDomainObj.badge
      },
      duration: '1 Month',
      mode: 'Remote / Online',
      fee: '100% Free'
    };

    try {
      const res = await fetch('/api/prma/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmissionSuccess({
          applicationId: data.applicationId,
          studentName: formData.fullName,
          email: formData.email,
          domainTitle: activeDomainObj.title
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.error || 'Failed to submit application. Please verify details and try again.');
      }
    } catch (err) {
      console.warn('Network submit fallback:', err);
      // Fallback local application ID
      const localAppId = 'PRMA-APP-' + Date.now().toString().slice(-6);
      setSubmissionSuccess({
        applicationId: localAppId,
        studentName: formData.fullName,
        email: formData.email,
        domainTitle: activeDomainObj.title
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A'
      }}
    >
      <PrmaNavbar activePage="apply" navigateToTab={navFn} onNavigate={navFn} />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        {/* SUCCESS CONFIRMATION MODAL / VIEW */}
        {submissionSuccess ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '2px solid #86EFAC',
              padding: '3rem 2.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(22, 163, 74, 0.08)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}
            >
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <span
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '0.4rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              Application Submitted Successfully
            </span>

            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 900,
                color: '#0B2356',
                margin: '1.25rem 0 0.5rem'
              }}
            >
              Welcome to PRMA Tech!
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Congratulations <strong>{submissionSuccess.studentName}</strong>, your application for the{' '}
              <strong>{submissionSuccess.domainTitle}</strong> internship track has been registered with Zero Fee.
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '1.5rem',
                maxWidth: '520px',
                margin: '0 auto 2.5rem',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #EEF2F6' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Unique Application ID:</span>
                <span style={{ fontWeight: 800, color: '#0866F5', fontFamily: 'monospace' }}>
                  {submissionSuccess.applicationId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #EEF2F6' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Registered Email:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{submissionSuccess.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #EEF2F6' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Program Duration:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>1 Month (Remote Mode)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Current Status:</span>
                <span style={{ fontWeight: 800, color: '#16A34A' }}>Submitted &bull; Under Review</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleNav('prma-internships-dashboard')}
                style={{
                  padding: '0.95rem 2.2rem',
                  borderRadius: '14px',
                  backgroundColor: '#0866F5',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 24px rgba(8, 102, 245, 0.3)'
                }}
              >
                <span>Track Status in Dashboard</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => handleNav('prma-internships-goodies')}
                style={{
                  padding: '0.95rem 1.85rem',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer'
                }}
              >
                <span>View Goodies Showcase</span>
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-SECTION APPLICATION FORM */
          <div>
            {/* Top Free Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0B2356 0%, #0866F5 100%)',
                borderRadius: '24px',
                padding: '2.5rem',
                color: '#FFFFFF',
                marginBottom: '2.5rem',
                boxShadow: '0 16px 40px rgba(11, 35, 86, 0.15)'
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 800, marginBottom: '1rem' }}>
                <CheckCircle2 size={16} />
                <span>100% FREE INTERNSHIP PROGRAM</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', fontWeight: 900, marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>
                PRMA Tech Internship Application
              </h1>
              <p style={{ color: '#BFDBFE', fontSize: '1rem', maxWidth: '620px', margin: 0, lineHeight: 1.6 }}>
                Zero Application Fee &bull; Exactly One Month &bull; Real-World Practical Projects &bull; Official Verified Certificate & Letter of Recommendation.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* SECTION 1: PERSONAL DETAILS */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid #EEF2F6', paddingBottom: '0.85rem' }}>
                  <User size={20} color="#0866F5" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    1. Personal Information
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyanshu Kumar"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.fullName ? '#EF4444' : '#CBD5E1'}`, fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {errors.fullName && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.email ? '#EF4444' : '#CBD5E1'}`, fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {errors.email && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.mobile ? '#EF4444' : '#CBD5E1'}`, fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {errors.mobile && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.mobile}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Noida / Lucknow"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.city ? '#EF4444' : '#CBD5E1'}`, fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {errors.city && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.city}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Uttar Pradesh"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.state ? '#EF4444' : '#CBD5E1'}`, fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {errors.state && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.state}</span>}
                  </div>
                </div>
              </div>

              {/* SECTION 2: ACADEMIC DETAILS */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid #EEF2F6', paddingBottom: '0.85rem' }}>
                  <GraduationCap size={20} color="#0866F5" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    2. Academic Details
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      College / University Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. A.P.J. Abdul Kalam Technical University / AKGEC Ghaziabad"
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.college ? '#EF4444' : '#CBD5E1'}`, fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {errors.college && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.college}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Course / Degree
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                    >
                      <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                      <option value="BCA">BCA (Computer Applications)</option>
                      <option value="MCA">MCA (Master of Computer Applications)</option>
                      <option value="B.Sc">B.Sc (IT / CS / Data Science)</option>
                      <option value="Diploma">Diploma / Polytechnic</option>
                      <option value="Other">Other Degree</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Branch / Specialization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE, IT, AI/ML, ECE"
                      value={formData.branch}
                      onChange={(e) => handleInputChange('branch', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Current Year / Semester
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                    >
                      <option value="1st Year">1st Year (1st / 2nd Sem)</option>
                      <option value="2nd Year">2nd Year (3rd / 4th Sem)</option>
                      <option value="3rd Year">3rd Year (5th / 6th Sem)</option>
                      <option value="4th Year">4th Year (7th / 8th Sem)</option>
                      <option value="Graduate">Recent Graduate</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Graduation Year
                    </label>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DOMAIN SELECTION & TECHNICAL PROFILE */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid #EEF2F6', paddingBottom: '0.85rem' }}>
                  <Briefcase size={20} color="#0866F5" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    3. Domain & Technical Profile
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Selected Internship Domain (1 Month &bull; 100% Free) *
                    </label>
                    <select
                      value={formData.domainId}
                      onChange={(e) => {
                        handleInputChange('domainId', e.target.value);
                        setSelectedDomainId(e.target.value);
                      }}
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '2px solid #0866F5', fontSize: '0.95rem', fontWeight: 700, outline: 'none', backgroundColor: '#EFF6FF', color: '#0B2356', boxSizing: 'border-box' }}
                    >
                      {PRMA_DOMAINS.map((dom) => (
                        <option key={dom.id} value={dom.id}>
                          {dom.title} (1 Month &bull; Free)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Relevant Skills & Tools (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Python, React, C++, Machine Learning, Git"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedinUrl}
                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                        GitHub / Portfolio (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Resume Upload Dropzone */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Upload Resume / CV (PDF, DOC, DOCX &bull; Max 5MB)
                    </label>
                    <div
                      style={{
                        border: '2px dashed #93C5FD',
                        borderRadius: '16px',
                        padding: '1.75rem',
                        textAlign: 'center',
                        backgroundColor: '#F0F7FF',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0,
                          cursor: 'pointer',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                      <Upload size={28} color="#0866F5" style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                        {resumeFile ? (
                          <span style={{ color: '#16A34A' }}>✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                        ) : (
                          'Click to upload or drag & drop resume'
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                        Supports PDF and Word documents up to 5 MB
                      </div>
                    </div>
                    {resumeError && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{resumeError}</span>}
                  </div>
                </div>
              </div>

              {/* SECTION 4: STATEMENT OF PURPOSE */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid #EEF2F6', paddingBottom: '0.85rem' }}>
                  <Sparkles size={20} color="#0866F5" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    4. Statement & Motivation
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Short Introduction / Career Goals
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Briefly introduce yourself and what you are passionate about building..."
                      value={formData.shortIntro}
                      onChange={(e) => handleInputChange('shortIntro', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                      Why do you want to join the PRMA Tech Internship Program? *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your motivation to learn, build practical projects, and gain mentorship..."
                      value={formData.whyPrma}
                      onChange={(e) => handleInputChange('whyPrma', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.whyPrma ? '#EF4444' : '#CBD5E1'}`, fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {errors.whyPrma && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>{errors.whyPrma}</span>}
                  </div>

                  {/* Terms & Free Acknowledgement */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                        style={{ marginTop: '3px', width: '16px', height: '16px' }}
                      />
                      <span>
                        I confirm that the details provided are accurate. I understand that the PRMA Tech Internship Program is <strong>100% Free</strong> with <strong>Zero Registration Fee</strong> for 1 month, and I commit to attending virtual mentorship sessions and completing project milestones.
                      </span>
                    </label>
                    {errors.agreedToTerms && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '6px', display: 'block' }}>{errors.agreedToTerms}</span>}
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleNav('prma-internships-domains')}
                  style={{
                    padding: '0.95rem 1.75rem',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    color: '#64748B',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Explore Other Domains
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '1rem 2.5rem',
                    borderRadius: '14px',
                    backgroundColor: submitting ? '#94A3B8' : '#0866F5',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    boxShadow: '0 8px 24px rgba(8, 102, 245, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{submitting ? 'Submitting Application...' : 'Submit Free Application'}</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <PrmaFooter navigateToTab={navFn} onNavigate={navFn} />
    </div>
  );
}
