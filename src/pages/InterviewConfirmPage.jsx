import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Code,
  Users,
  FileText,
  Bot,
  ArrowRight,
  ChevronRight,
  UploadCloud,
  X,
  Plus,
  Edit3,
  Check,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Target,
  Zap,
  HelpCircle,
  FileCode,
  GraduationCap,
  Building2,
  Cog,
  User,
  CheckSquare,
  FilePlus,
  Trash2,
  Trophy,
  ChevronDown,
  AlertCircle,
  Eye,
  FileCheck
} from 'lucide-react';

export const COURSE_PROFILES = {
  'B.Tech': {
    branches: [
      'CSE (Computer Science & Engineering)',
      'IT (Information Technology)',
      'ECE (Electronics & Communication)',
      'EE (Electrical Engineering)',
      'ME (Mechanical Engineering)',
      'CE (Civil Engineering)',
      'AI & ML (Artificial Intelligence & ML)',
      'DS (Data Science)'
    ],
    years: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  'BCA': {
    branches: [
      'General BCA (Computer Applications)',
      'BCA in Cloud Computing',
      'BCA in Data Analytics',
      'BCA in Web & Mobile App Development'
    ],
    years: ['1st Year', '2nd Year', '3rd Year']
  },
  'MCA': {
    branches: [
      'General MCA (Software Applications)',
      'MCA in Artificial Intelligence & DS',
      'MCA in Cloud & DevOps',
      'MCA in Software Engineering'
    ],
    years: ['1st Year', '2nd Year']
  },
  'MBA': {
    branches: [
      'Marketing Management',
      'Finance & Financial Services',
      'Human Resources (HR)',
      'Operations & Supply Chain',
      'Information Technology (IT & Systems)',
      'Business Analytics',
      'International Business'
    ],
    years: ['1st Year', '2nd Year']
  },
  'B.Pharm': {
    branches: [
      'General Pharmacy (B.Pharm)',
      'Pharmaceutics',
      'Pharmacology',
      'Pharmaceutical Chemistry'
    ],
    years: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  'M.Tech': {
    branches: [
      'Computer Science & Engineering',
      'VLSI Design & Embedded Systems',
      'Thermal Engineering',
      'Structural Engineering'
    ],
    years: ['1st Year', '2nd Year']
  }
};

const TARGET_ROLES = [
  'Software Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Cyber Security Analyst',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cloud / DevOps Engineer',
  'Product Manager',
  'Business Analyst',
  'QA / Automation Engineer',
  'Systems / Network Engineer'
];

export default function InterviewConfirmPage({ onNavigate, onOpenAuth }) {
  // Read any saved draft (e.g. returning from Resume Maker)
  const savedDraft = (() => {
    try {
      const raw = sessionStorage.getItem('interview_pro_assessment_draft');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // Profile Form States - Starts COMPLETELY BLANK for new assessments
  const [course, setCourse] = useState(savedDraft?.course || '');
  const [branch, setBranch] = useState(savedDraft?.branch || '');
  const [year, setYear] = useState(savedDraft?.year || '');
  const [targetRole, setTargetRole] = useState(savedDraft?.targetRole || '');
  const [skills, setSkills] = useState(Array.isArray(savedDraft?.skills) ? savedDraft.skills : []);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Resume State - Starts BLANK (no auto-selected resume)
  const [resumeMode, setResumeMode] = useState('upload'); // 'upload' | 'existing'
  const [uploadedResume, setUploadedResume] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [savedResumes, setSavedResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [previewResumeModal, setPreviewResumeModal] = useState(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsedResumeProfile, setParsedResumeProfile] = useState(() => {
    try {
      const active = sessionStorage.getItem('interview_pro_active_test');
      if (active) {
        const parsed = JSON.parse(active);
        return parsed.structuredProfile || null;
      }
    } catch {}
    return null;
  });

  // Field Validation Errors
  const [errors, setErrors] = useState({});
  const courseRef = useRef(null);
  const branchRef = useRef(null);
  const yearRef = useRef(null);
  const roleRef = useRef(null);
  const resumeRef = useRef(null);

  const availableCourses = Object.keys(COURSE_PROFILES);
  const availableBranches = course && COURSE_PROFILES[course] ? COURSE_PROFILES[course].branches : [];
  const availableYears = course && COURSE_PROFILES[course] ? COURSE_PROFILES[course].years : [];

  // When course changes, reset branch & year if they are not valid for new course
  const handleCourseChange = (newCourse) => {
    setCourse(newCourse);
    setBranch('');
    setYear('');
    if (errors.course) setErrors(prev => ({ ...prev, course: null }));
  };

  const handleBranchChange = (newBranch) => {
    setBranch(newBranch);
    if (errors.branch) setErrors(prev => ({ ...prev, branch: null }));
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
    if (errors.year) setErrors(prev => ({ ...prev, year: null }));
  };

  const handleRoleChange = (newRole) => {
    setTargetRole(newRole);
    if (errors.targetRole) setErrors(prev => ({ ...prev, targetRole: null }));
  };

  // Helper to convert saved Resume Maker resume to Structured Candidate Profile
  const convertResumeMakerToStructuredProfile = (r) => {
    if (!r) return null;
    const p = r.personalDetails || r.personal || {};
    const skillsList = [];
    if (Array.isArray(r.skills)) skillsList.push(...r.skills);
    if (r.technicalSkills && typeof r.technicalSkills === 'object') {
      Object.values(r.technicalSkills).forEach(val => {
        if (Array.isArray(val)) skillsList.push(...val);
        else if (typeof val === 'string') skillsList.push(...val.split(',').map(s => s.trim()));
      });
    }
    return {
      name: p.fullName || r.title || 'Candidate',
      email: p.email || '',
      phone: p.phone || '',
      education: Array.isArray(r.education) ? r.education : [],
      skills: Array.from(new Set(skillsList.filter(Boolean))),
      projects: Array.isArray(r.projects) ? r.projects : [],
      internships: Array.isArray(r.experience) ? r.experience : [],
      certifications: Array.isArray(r.certifications) ? r.certifications : [],
      achievements: Array.isArray(r.achievements) ? r.achievements : []
    };
  };

  // Resume File Upload with instant automatic AI parsing
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext)) {
        alert('Please upload a valid PDF, DOC, or DOCX resume.');
        return;
      }
      setUploadedResume({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: 'Uploaded successfully',
        file
      });
      setSelectedResumeId('');
      if (errors.resume) setErrors(prev => ({ ...prev, resume: null }));

      // Trigger automatic resume parsing to extract structured profile for AI interviewers
      setIsParsingResume(true);
      try {
        const formData = new FormData();
        formData.append('resume', file);
        const res = await fetch('/api/interview/resume/parse', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.structuredProfile) {
            setParsedResumeProfile(data.structuredProfile);
            if (Array.isArray(data.structuredProfile.skills) && data.structuredProfile.skills.length > 0) {
              setSkills(prev => Array.from(new Set([...prev, ...data.structuredProfile.skills])));
            }
          }
        }
      } catch (err) {
        console.warn('[RESUME PARSE ERROR]:', err);
      } finally {
        setIsParsingResume(false);
      }
    }
  };

  // Fetch Saved Resumes from Backend
  useEffect(() => {
    const fetchUserResumes = async () => {
      setLoadingResumes(true);
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('/api/resumes', { headers });
        const data = await res.json();
        if (data.success && Array.isArray(data.resumes)) {
          setSavedResumes(data.resumes);
        }
      } catch (err) {
        console.error('Error fetching user resumes:', err);
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchUserResumes();
  }, []);

  // Save draft to sessionStorage whenever profile state changes
  const saveDraftToStorage = () => {
    try {
      sessionStorage.setItem('interview_pro_assessment_draft', JSON.stringify({
        course,
        branch,
        year,
        targetRole,
        skills
      }));
    } catch (e) {
      console.warn('Could not save interview draft:', e);
    }
  };

  // Navigating to Resume Maker
  const handleNavigateToResumeMaker = () => {
    saveDraftToStorage();
    if (onNavigate) {
      onNavigate('resume-maker');
    }
  };

  // Skill Handlers
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkillInput('');
    }
  };

  // Active selected resume object
  const activeResumeInfo = resumeMode === 'upload'
    ? uploadedResume
    : savedResumes.find(r => r.id === selectedResumeId || r._id === selectedResumeId);

  // Dynamic Difficulty & Time
  const difficulty = year.includes('1st') || year.includes('2nd')
    ? 'Beginner to Intermediate'
    : year.includes('3rd')
      ? 'Intermediate (Campus Standard)'
      : 'Advanced (Full Placement Ready)';

  const primaryCodingLang = skills.find(s => ['C++', 'Python', 'Java', 'JavaScript'].includes(s)) || 'C++';

  // Test Structure Rows
  const testStructure = [
    {
      step: 1,
      name: 'Aptitude',
      duration: '35 Minutes',
      desc: 'Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation',
      icon: FileText,
      iconBg: '#FCE7D8',
      iconColor: '#9A3412',
      numberColor: '#781416'
    },
    {
      step: 2,
      name: 'Coding',
      duration: '60 Minutes',
      desc: `DSA & Problem Solving (${primaryCodingLang})`,
      icon: Code,
      iconBg: '#DBEAFE',
      iconColor: '#1D4ED8',
      numberColor: '#1E60D0'
    },
    {
      step: 3,
      name: 'AI Technical Interview',
      duration: '30 Minutes',
      desc: `${course || 'Course'} & ${targetRole || 'Role'} Core Concepts & Resume Project Deep-Dive`,
      icon: Bot,
      iconBg: '#EDE9FE',
      iconColor: '#6D28D9',
      numberColor: '#6C2EBD'
    },
    {
      step: 4,
      name: 'AI HR / Behavioral',
      duration: '15 Minutes',
      desc: 'Personal, Situational, Teamwork & Career-oriented Evaluation',
      icon: Users,
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      numberColor: '#E05625'
    }
  ];

  // FORM SUBMISSION & STRICT VALIDATION
  const handleContinue = () => {
    const newErrors = {};

    if (!course) {
      newErrors.course = 'Please select your course';
    }
    if (!branch) {
      newErrors.branch = 'Please select your branch';
    }
    if (!year) {
      newErrors.year = 'Please select your year';
    }
    if (!targetRole) {
      newErrors.targetRole = 'Please select your target role';
    }
    if (!activeResumeInfo) {
      newErrors.resume = 'Please upload or select a resume to continue';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Scroll smoothly to first missing field
      if (newErrors.course && courseRef.current) {
        courseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.branch && branchRef.current) {
        branchRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.year && yearRef.current) {
        yearRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.targetRole && roleRef.current) {
        roleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (newErrors.resume && resumeRef.current) {
        resumeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Construct Structured Candidate Profile grounded in uploaded/selected resume
    const structuredProfile = parsedResumeProfile || (activeResumeInfo ? convertResumeMakerToStructuredProfile(activeResumeInfo) : null) || {
      name: 'Candidate',
      education: [{ degree: course || 'B.Tech', branch: branch || 'CSE', college: 'Engineering College', year: year || '2025' }],
      skills: skills.length > 0 ? skills : ['React', 'Node.js', 'MongoDB', 'Python'],
      projects: [
        {
          title: `${targetRole || 'Full Stack'} Platform`,
          techStack: skills.slice(0, 3),
          description: `Comprehensive application built with ${skills.slice(0, 3).join(', ')}.`
        }
      ]
    };

    // Save complete assessment configuration
    const assessmentConfig = {
      course,
      branch,
      year,
      targetRole,
      skills,
      resume: {
        name: activeResumeInfo.name || activeResumeInfo.title || 'Selected_Resume.pdf',
        size: activeResumeInfo.size || '1.0 MB',
        id: activeResumeInfo.id || activeResumeInfo._id || null,
        type: resumeMode
      },
      structuredProfile,
      difficulty,
      preparationTime: '140 Minutes',
      configuredAt: new Date().toISOString()
    };

    try {
      sessionStorage.setItem('interview_pro_active_test', JSON.stringify(assessmentConfig));
      sessionStorage.removeItem('interview_pro_assessment_draft');
    } catch (e) {
      console.warn('Could not store active test config:', e);
    }

    if (onNavigate) {
      onNavigate('interview-instructions');
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1F1A14', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* =========================================================================
          1. INTERVIEW PRO HERO BANNER
          ========================================================================= */}
      <section style={{
        backgroundColor: '#FAF5ED',
        backgroundImage: `
          radial-gradient(rgba(180, 140, 80, 0.08) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #FBF8F2 0%, #F5EFE3 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '0.85rem 0',
        borderBottom: '1px solid #E8E0D0'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            {/* Left: Product & Supporting Headline */}
            <div style={{ zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#781416',
                  borderRadius: '10px',
                  padding: '0.45rem 0.55rem',
                  boxShadow: '0 2px 6px rgba(120, 20, 22, 0.2)'
                }}>
                  <Briefcase size={22} color="#FFFFFF" />
                </div>
                <h1 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '2.15rem',
                  fontWeight: 900,
                  color: '#1C1814',
                  margin: 0,
                  lineHeight: 1.1
                }}>
                  Interview Pro
                </h1>
              </div>

              <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#4A4036',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span>One Test. Real Experience.</span>
                <span style={{ color: '#D48816', fontWeight: 800 }}>Placement Ready.</span>
              </div>
            </div>

            {/* Right: ProfessorVirus Hero Illustration with Quote & Notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              maxHeight: '100px',
              overflow: 'hidden',
              borderRadius: '10px'
            }} className="confirm-hero-art-wrapper">
              <img
                src="/assets/interview_confirm_hero_art_2x.png"
                alt="Discipline today, Placement tomorrow! — Virus"
                style={{
                  height: '92px',
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_board.png';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PROGRESS STEPPER
          1: Select Profile (1) | 2: Confirm Details (ACTIVE 2) | 3: Test Instructions | 4: Start Test
          ========================================================================= */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #EDE5D6',
        padding: '0.75rem 0',
        boxShadow: '0 2px 8px rgba(35, 30, 25, 0.02)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Stepper Flow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }} className="progress-stepper-row">

              {/* Step 1: Completed / Select Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814' }}>
                  Select Profile
                </span>
              </div>

              {/* Connector Line */}
              <div style={{ width: '48px', height: '2px', backgroundColor: '#781416' }} className="stepper-line" />

              {/* Step 2: Current / Confirm Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#C88D2D',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  2
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814' }}>
                  Confirm Details
                </span>
              </div>

              {/* Inactive Connector Line */}
              <div style={{ width: '48px', height: '2px', backgroundColor: '#EDE5D6' }} className="stepper-line" />

              {/* Step 3: Inactive / Test Instructions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', opacity: 0.65 }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#EAE2D5',
                  color: '#70675D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  3
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#70675D' }}>
                  Test Instructions
                </span>
              </div>

              {/* Inactive Connector Line */}
              <div style={{ width: '48px', height: '2px', backgroundColor: '#EDE5D6' }} className="stepper-line" />

              {/* Step 4: Inactive / Start Test */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', opacity: 0.65 }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#EAE2D5',
                  color: '#70675D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  4
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#70675D' }}>
                  Start Test
                </span>
              </div>

            </div>

            {/* Stepper Status on Far Right */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1C1814' }}>
                Step 2 of 4
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#781416' }}>
                Almost there!
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. MAIN 3-COLUMN LAYOUT
          Left: Your Profile | Center: Your Assessment is Ready! | Right: Why This Test?
          ========================================================================= */}
      <main className="container" style={{ padding: '1.75rem 1.25rem 3rem 1.25rem' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr) minmax(0, 0.9fr)',
          gap: '1.25rem',
          alignItems: 'start'
        }} className="interview-confirm-3col">

          {/* =====================================================================
              LEFT COLUMN: YOUR PROFILE (BLANK INITIAL STATE + REAL CASCADING)
              ===================================================================== */}
          <div style={{
            backgroundColor: '#FCFAF6',
            border: '1.5px solid #EBE4D5',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
          }}>
            {/* Header with Briefcase */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginBottom: '1.15rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#781416',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Briefcase size={16} />
              </div>
              <div>
                <h2 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.22rem',
                  fontWeight: 900,
                  color: '#781416',
                  margin: 0,
                  lineHeight: 1.15
                }}>
                  Your Profile
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#6A6054', margin: '0.15rem 0 0 0', fontWeight: 500 }}>
                  Select your details to get a customized interview test
                </p>
              </div>
            </div>

            {/* Course Selector (Required *) */}
            <div ref={courseRef} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <GraduationCap size={15} color="#781416" />
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>
                  Course <span style={{ color: '#DC2626', fontWeight: 900 }}>*</span>
                </label>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.4rem',
                border: errors.course ? '1.5px solid #DC2626' : 'none',
                borderRadius: '8px',
                padding: errors.course ? '4px' : '0'
              }}>
                {availableCourses.map(c => {
                  const isSelected = course === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleCourseChange(c)}
                      style={{
                        padding: '0.52rem 0.35rem',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid #781416' : '1.5px solid #EDE5D6',
                        backgroundColor: isSelected ? '#781416' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#2D261E',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              {errors.course && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#DC2626', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.3rem' }}>
                  <AlertCircle size={12} />
                  <span>{errors.course}</span>
                </div>
              )}
            </div>

            {/* Branch Selector (Required * — Cascades from Course) */}
            <div ref={branchRef} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <Building2 size={15} color="#781416" />
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>
                  Branch <span style={{ color: '#DC2626', fontWeight: 900 }}>*</span>
                </label>
              </div>

              <div style={{ position: 'relative' }}>
                <select
                  value={branch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  disabled={!course}
                  style={{
                    width: '100%',
                    padding: '0.58rem 2rem 0.58rem 0.75rem',
                    borderRadius: '8px',
                    border: errors.branch ? '1.5px solid #DC2626' : '1.5px solid #EDE5D6',
                    backgroundColor: course ? '#FFFFFF' : '#F5EFE7',
                    color: course ? '#1C1814' : '#8A8074',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: course ? 'pointer' : 'not-allowed',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                >
                  <option value="">{course ? '-- Select your branch --' : 'Select Course first'}</option>
                  {availableBranches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown size={15} color="#7A6F62" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
              {errors.branch && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#DC2626', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.3rem' }}>
                  <AlertCircle size={12} />
                  <span>{errors.branch}</span>
                </div>
              )}
            </div>

            {/* Year Selector (Required * — Cascades from Course) */}
            <div ref={yearRef} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <Cog size={15} color="#781416" />
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>
                  Year <span style={{ color: '#DC2626', fontWeight: 900 }}>*</span>
                </label>
              </div>

              {availableYears.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${availableYears.length}, 1fr)`,
                  gap: '0.4rem',
                  border: errors.year ? '1.5px solid #DC2626' : 'none',
                  borderRadius: '8px',
                  padding: errors.year ? '4px' : '0'
                }}>
                  {availableYears.map(y => {
                    const isSelected = year === y;
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => handleYearChange(y)}
                        style={{
                          padding: '0.52rem 0.25rem',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid #781416' : '1.5px solid #EDE5D6',
                          backgroundColor: isSelected ? '#FAF0F0' : '#FFFFFF',
                          color: isSelected ? '#781416' : '#2D261E',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          border: isSelected ? '4px solid #781416' : '1.5px solid #A89F91',
                          backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                          display: 'inline-block'
                        }} />
                        <span>{y}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', color: '#8A8074', fontStyle: 'italic', padding: '0.5rem', backgroundColor: '#F5EFE7', borderRadius: '8px' }}>
                  Please select your Course first to choose academic year.
                </div>
              )}
              {errors.year && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#DC2626', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.3rem' }}>
                  <AlertCircle size={12} />
                  <span>{errors.year}</span>
                </div>
              )}
            </div>

            {/* Target Role Selector (Required *) */}
            <div ref={roleRef} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <User size={15} color="#781416" />
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>
                  Target Role <span style={{ color: '#DC2626', fontWeight: 900 }}>*</span>
                </label>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#781416' }}>
                  <Briefcase size={14} />
                </div>
                <select
                  value={targetRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.58rem 2rem 0.58rem 2rem',
                    borderRadius: '8px',
                    border: errors.targetRole ? '1.5px solid #DC2626' : '1.5px solid #EDE5D6',
                    backgroundColor: '#FFFFFF',
                    color: '#1C1814',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                >
                  <option value="">-- Choose your target role --</option>
                  {TARGET_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown size={15} color="#7A6F62" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
              {errors.targetRole && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#DC2626', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.3rem' }}>
                  <AlertCircle size={12} />
                  <span>{errors.targetRole}</span>
                </div>
              )}
            </div>

            {/* Key Skills (OPTIONAL - NO RED *) */}
            <div style={{ marginBottom: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <CheckSquare size={15} color="#781416" />
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>
                  Your Key Skills <span style={{ fontWeight: 500, color: '#7A6F62' }}>(Optional)</span>
                </label>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #EDE5D6',
                borderRadius: '8px',
                padding: '0.55rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem'
              }}>
                {/* Skill Chips */}
                {skills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {skills.map(s => (
                      <span
                        key={s}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          backgroundColor: '#FFF5F5',
                          border: '1px solid #FADCDD',
                          borderRadius: '6px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: '#781416'
                        }}
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: '#781416',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={`Remove ${s}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: '#9E9486', fontStyle: 'italic', padding: '0.1rem 0.2rem' }}>
                    No skills added yet (e.g. C++, Python, DSA, React). Press Add or Enter to include.
                  </div>
                )}

                {/* Add Skill Form Input */}
                <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <input
                    type="text"
                    placeholder="Type skill & press Enter..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    style={{
                      flex: 1,
                      border: '1px solid #EAE2D5',
                      borderRadius: '6px',
                      backgroundColor: '#FAFAF8',
                      fontSize: '0.78rem',
                      outline: 'none',
                      color: '#1C1814',
                      padding: '0.3rem 0.5rem'
                    }}
                  />
                  {newSkillInput.trim() && (
                    <button
                      type="submit"
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* ===================================================================
                RESUME REQUIREMENT (MANDATORY WITH RED *)
                Dual Mode: Upload Resume OR Use Existing Resume from Resume Maker
                =================================================================== */}
            <div ref={resumeRef} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FilePlus size={15} color="#781416" />
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>
                    Resume <span style={{ color: '#DC2626', fontWeight: 900 }}>*</span>
                  </label>
                </div>

                {/* Mode Selector Pill */}
                <div style={{ display: 'flex', backgroundColor: '#EDE5D6', borderRadius: '6px', padding: '2px' }}>
                  <button
                    type="button"
                    onClick={() => setResumeMode('upload')}
                    style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: resumeMode === 'upload' ? '#781416' : 'transparent',
                      color: resumeMode === 'upload' ? '#FFFFFF' : '#4A4036',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Upload Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeMode('existing')}
                    style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: resumeMode === 'existing' ? '#781416' : 'transparent',
                      color: resumeMode === 'existing' ? '#FFFFFF' : '#4A4036',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Use Existing Resume ({savedResumes.length})
                  </button>
                </div>
              </div>

              {/* Upload Resume Box */}
              {resumeMode === 'upload' && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: errors.resume ? '1.5px solid #DC2626' : '1.5px solid #EDE5D6',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#6A6054', fontWeight: 500 }}>
                      <UploadCloud size={16} color="#781416" />
                      <span>Upload resume (PDF, DOC, DOCX)</span>
                    </div>

                    <label style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #781416',
                      borderRadius: '6px',
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#781416',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(35,30,25,0.03)'
                    }}>
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Attached File Chip */}
                  {uploadedResume && (
                    <div style={{
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #E8E0D0',
                      borderRadius: '6px',
                      padding: '0.45rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '4px',
                          backgroundColor: '#DC2626',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 900
                        }}>
                          PDF
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1C1814' }}>
                              {uploadedResume.name}
                            </span>
                            <CheckCircle2 size={13} color="#16A34A" />
                          </div>
                          <div style={{ fontSize: '0.67rem', color: '#16A34A', fontWeight: 600 }}>
                            {uploadedResume.size} · Uploaded successfully
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setUploadedResume(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9E9486',
                          cursor: 'pointer',
                          padding: '0.2rem'
                        }}
                        title="Remove Resume"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Use Existing Resume Box */}
              {resumeMode === 'existing' && (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: errors.resume ? '1.5px solid #DC2626' : '1.5px solid #EDE5D6',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem'
                }}>
                  {savedResumes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#665C50', fontWeight: 600 }}>
                        Select one of your saved resumes created in Resume Maker:
                      </div>
                      {savedResumes.map(r => {
                        const isSelected = selectedResumeId === (r.id || r._id);
                        return (
                          <div
                            key={r.id || r._id}
                            onClick={() => {
                              const resumeId = r.id || r._id;
                              setSelectedResumeId(resumeId);
                              setUploadedResume(null);
                              if (errors.resume) setErrors(prev => ({ ...prev, resume: null }));
                              const prof = convertResumeMakerToStructuredProfile(r);
                              if (prof) {
                                setParsedResumeProfile(prof);
                                if (Array.isArray(prof.skills) && prof.skills.length > 0) {
                                  setSkills(prev => Array.from(new Set([...prev, ...prof.skills])));
                                }
                              }
                            }}
                            style={{
                              padding: '0.5rem 0.65rem',
                              borderRadius: '6px',
                              border: isSelected ? '1.5px solid #781416' : '1px solid #E8E0D0',
                              backgroundColor: isSelected ? '#FFF8F8' : '#FAF7F2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                style={{ accentColor: '#781416', cursor: 'pointer' }}
                              />
                              <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>
                                  {r.title || 'Engineering Resume'}
                                </div>
                                <div style={{ fontSize: '0.67rem', color: '#70675D' }}>
                                  Updated: {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recently'}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{
                                backgroundColor: '#E7F5EE',
                                color: '#0E7A4A',
                                fontSize: '0.65rem',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px'
                              }}>
                                <FileCheck size={11} /> 1-Page
                              </span>
                              {r.pdfUrl && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewResumeModal(r);
                                  }}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #D5C9B8',
                                    borderRadius: '4px',
                                    padding: '0.2rem 0.45rem',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    color: '#4A4036',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '2px'
                                  }}
                                  title="Preview Resume"
                                >
                                  <Eye size={11} /> Preview
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.76rem', color: '#70675D', textAlign: 'center', padding: '0.5rem 0' }}>
                      No saved resumes found in your account yet.
                    </div>
                  )}
                </div>
              )}

              {/* Live Resume Parsing Status & Verification Banner */}
              {isParsingResume && (
                <div style={{
                  marginTop: '0.5rem',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '6px',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.74rem',
                  color: '#1D4ED8',
                  fontWeight: 700
                }}>
                  <Sparkles size={16} className="animate-spin" color="#2563EB" />
                  <span>Analyzing uploaded resume & extracting structured candidate profile for AI Interviewers...</span>
                </div>
              )}

              {parsedResumeProfile && (
                <div style={{
                  marginTop: '0.5rem',
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '8px',
                  padding: '0.7rem 0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#15803D', fontWeight: 800, fontSize: '0.78rem' }}>
                      <CheckCircle2 size={16} color="#16A34A" />
                      <span>Resume Profile Extracted & Verified for AI Interviewers</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                      Grounded Source
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>
                    {parsedResumeProfile.name && (
                      <span><strong>Candidate:</strong> {parsedResumeProfile.name}</span>
                    )}
                    {parsedResumeProfile.projects && parsedResumeProfile.projects.length > 0 && (
                      <span>• <strong>Projects:</strong> {parsedResumeProfile.projects.map(p => p.title).slice(0, 2).join(', ')}</span>
                    )}
                    {parsedResumeProfile.skills && parsedResumeProfile.skills.length > 0 && (
                      <span>• <strong>Verified Skills:</strong> {parsedResumeProfile.skills.slice(0, 5).join(', ')}{parsedResumeProfile.skills.length > 5 ? ` +${parsedResumeProfile.skills.length - 5} more` : ''}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message for Resume */}
              {errors.resume && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#DC2626', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.3rem' }}>
                  <AlertCircle size={12} />
                  <span>{errors.resume}</span>
                </div>
              )}

              {/* CTA Card: Don't have a resume yet? Create in 2 minutes */}
              <div style={{
                marginTop: '0.75rem',
                backgroundColor: '#FAF5ED',
                border: '1.5px dashed #D48816',
                borderRadius: '10px',
                padding: '0.75rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1C1814' }}>
                    Don't have a resume yet?
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6A6054' }}>
                    Create an ATS-optimized, 1-page resume with LaTeX & PDF.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNavigateToResumeMaker}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.38rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 2px 6px rgba(120, 20, 22, 0.25)'
                  }}
                >
                  <span>Make Resume in 2 Min</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>

          </div>

          {/* =====================================================================
              CENTER COLUMN: YOUR ASSESSMENT IS READY! & DYNAMIC TEST PROFILE
              ===================================================================== */}
          <div style={{
            backgroundColor: '#FCFAF6',
            border: '1.5px solid #EBE4D5',
            borderRadius: '16px',
            padding: '1.35rem',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
          }}>

            {/* Top Ready Header Row with Checkmark */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#781416',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Check size={18} strokeWidth={3} />
              </div>
              <div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#781416',
                  margin: 0,
                  lineHeight: 1.15
                }}>
                  Your Assessment is Ready!
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#665C50', fontWeight: 500, marginTop: '2px' }}>
                  Customized evaluation aligned with your academic & career goals.
                </div>
              </div>
            </div>

            {/* DYNAMIC PROFILE SUMMARY CARD */}
            <div style={{
              backgroundColor: '#FEF9EE',
              border: '1.5px solid #F5E6C8',
              borderRadius: '12px',
              padding: '0.9rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#FDEECA',
                  color: '#781416',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <GraduationCap size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1C1814' }}>
                    {course && branch ? `${course} — ${branch.split(' ')[0]}` : <span style={{ color: '#9E9486', fontStyle: 'italic' }}>Profile not selected yet</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#7A6F62', fontWeight: 600 }}>
                    {year || 'Year not selected'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4A4036', fontWeight: 600, marginTop: '2px' }}>
                    Target Role:{' '}
                    {targetRole ? (
                      <strong style={{ color: '#781416' }}>{targetRole}</strong>
                    ) : (
                      <span style={{ color: '#9E9486', fontStyle: 'italic' }}>Not selected yet</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (courseRef.current) courseRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #781416',
                  color: '#781416',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Edit3 size={13} />
                <span>Edit Details</span>
              </button>
            </div>

            {/* Assessment Meta Badges Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ backgroundColor: '#FAF5ED', border: '1px solid #EADBCE', borderRadius: '8px', padding: '0.5rem 0.65rem' }}>
                <div style={{ fontSize: '0.67rem', color: '#70675D', fontWeight: 700, textTransform: 'uppercase' }}>Difficulty</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#781416' }}>{difficulty}</div>
              </div>
              <div style={{ backgroundColor: '#FAF5ED', border: '1px solid #EADBCE', borderRadius: '8px', padding: '0.5rem 0.65rem' }}>
                <div style={{ fontSize: '0.67rem', color: '#70675D', fontWeight: 700, textTransform: 'uppercase' }}>Resume Status</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: activeResumeInfo ? '#16A34A' : '#DC2626' }}>
                  {activeResumeInfo ? '✓ Attached' : 'Missing *'}
                </div>
              </div>
              <div style={{ backgroundColor: '#FAF5ED', border: '1px solid #EADBCE', borderRadius: '8px', padding: '0.5rem 0.65rem' }}>
                <div style={{ fontSize: '0.67rem', color: '#70675D', fontWeight: 700, textTransform: 'uppercase' }}>Skills Included</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1C1814' }}>
                  {skills.length > 0 ? `${skills.length} Skills` : 'None (Optional)'}
                </div>
              </div>
            </div>

            {/* Test Structure Heading */}
            <div style={{ marginBottom: '0.75rem' }}>
              <h4 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.05rem',
                fontWeight: 900,
                color: '#1C1814',
                margin: 0
              }}>
                Test Structure (Total 140 Minutes)
              </h4>
            </div>

            {/* 4 Assessment Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.15rem' }}>
              {testStructure.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.step}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #EDE5D6',
                      borderRadius: '10px',
                      padding: '0.75rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {/* Step Number Circle */}
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: item.numberColor,
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.step}
                      </div>

                      {/* Icon */}
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: item.iconBg,
                        color: item.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <ItemIcon size={15} />
                      </div>

                      {/* Title & Duration */}
                      <div style={{ minWidth: '135px' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1C1814', lineHeight: 1.15 }}>
                          {item.name}
                        </div>
                        <div style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#70675D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          marginTop: '2px'
                        }}>
                          <Clock size={11} />
                          <span>{item.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div style={{
                      fontSize: '0.74rem',
                      color: '#6A6054',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      flex: 1,
                      padding: '0 0.5rem'
                    }} className="test-structure-desc">
                      {item.desc}
                    </div>

                    {/* Chevron Right */}
                    <div style={{ color: '#A09485', flexShrink: 0 }}>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Duration Summary Card */}
            <div style={{
              backgroundColor: '#FAF4EB',
              border: '1.5px solid #EADBCE',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#FAF0DE',
                border: '1px solid #E5CE9F',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1C1814' }}>
                  Total Test Duration: 140 Minutes (2 Hours 20 Minutes)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#665C50', fontWeight: 500, marginTop: '2px' }}>
                  All sections will be conducted in a single session with a continuous timer.
                </div>
              </div>
            </div>

            {/* PRIMARY BUTTON: Continue to Instructions -> */}
            <div>
              <button
                type="button"
                onClick={handleContinue}
                style={{
                  width: '100%',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.88rem 1.25rem',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 6px 20px rgba(120, 20, 22, 0.35)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#631012';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#781416';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Continue to Instructions</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>

          {/* =====================================================================
              RIGHT COLUMN: WHY THIS TEST? & PROFESSORVIRUS BANNER & QUOTE
              ===================================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Why This Test? Card */}
            <div style={{
              backgroundColor: '#FCFAF6',
              border: '1.5px solid #EBE4D5',
              borderRadius: '16px',
              padding: '1.15rem',
              boxShadow: '0 4px 16px rgba(35, 30, 25, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Trophy size={15} />
                </div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.08rem',
                  fontWeight: 900,
                  color: '#781416',
                  margin: 0
                }}>
                  Why This Test?
                </h3>
              </div>

              {/* 5 Compact Bullet Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { icon: Briefcase, color: '#B45309', text: 'Real exam pattern like top companies' },
                  { icon: Cog, color: '#781416', text: 'Customized questions for your profile' },
                  { icon: Bot, color: '#2563EB', text: 'AI-powered interview experience' },
                  { icon: FileText, color: '#059669', text: 'Detailed performance report' },
                  { icon: GraduationCap, color: '#7C2D12', text: 'Helps you get placement ready' }
                ].map((pt, i) => {
                  const PtIcon = pt.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.78rem', fontWeight: 600, color: '#383129' }}>
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        backgroundColor: '#FAF5ED',
                        border: '1px solid #E8DFCF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: pt.color,
                        flexShrink: 0
                      }}>
                        <PtIcon size={12} />
                      </div>
                      <span>{pt.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle Card: ProfessorVirus Illustration Banner */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1.5px solid #E8DBC6',
              boxShadow: '0 4px 14px rgba(35, 30, 25, 0.05)',
              backgroundColor: '#FAF2DF'
            }}>
              <img
                src="/assets/interview_confirm_sidebar_virus_2x.png"
                alt="Give your best! You can do it! — Virus"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_students.png';
                }}
              />
            </div>

            {/* Bottom Card: Quote Card */}
            <div style={{
              backgroundColor: '#FAF5ED',
              borderRadius: '12px',
              border: '1.5px solid #E8DFCF',
              padding: '0.85rem 1rem',
              boxShadow: '0 2px 6px rgba(35, 30, 25, 0.03)'
            }}>
              <div style={{
                fontSize: '1.5rem',
                lineHeight: 1,
                color: '#C88D2D',
                fontFamily: 'serif',
                fontWeight: 900,
                marginBottom: '0.2rem'
              }}>
                “
              </div>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#4A4036',
                fontStyle: 'italic',
                lineHeight: 1.45
              }}>
                "The harder you practice, the luckier you get in real interviews."
              </div>
              <div style={{
                textAlign: 'right',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#8A5A1B',
                marginTop: '0.35rem'
              }}>
                — ProfessorVirus
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* MODAL: RESUME PREVIEW */}
      {previewResumeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
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
            maxWidth: '750px',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid #E8E0D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAF5ED'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1C1814' }}>
                Preview: {previewResumeModal.title || 'Resume'}
              </div>
              <button
                type="button"
                onClick={() => setPreviewResumeModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#70675D' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, backgroundColor: '#525659' }}>
              <iframe
                src={previewResumeModal.pdfUrl}
                title="Resume Preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Responsive Stacking Overrides */}
      <style>{`
        @media (max-width: 1024px) {
          .interview-confirm-3col {
            grid-template-columns: 1fr !important;
          }
          .confirm-hero-art-wrapper {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .test-structure-desc {
            display: none !important;
          }
          .stepper-line {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
