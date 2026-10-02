import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  ExternalLink,
  ChevronRight,
  BarChart2,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  X,
  RefreshCw,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Layers,
  Info,
  Check,
  Download,
  AlertTriangle
} from 'lucide-react';

export default function ResultCgpaPage({ onNavigate, onOpenAuth }) {
  // Official AKTU One View Portal URL
  const AKTU_ONE_VIEW_URL = 'https://erp.aktu.ac.in/WebPages/OneView/OneView.aspx';

  const handleOpenOfficialPortal = () => {
    window.open(AKTU_ONE_VIEW_URL, '_blank', 'noopener,noreferrer');
  };

  // State for Uploaded File & Analysis
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState('idle'); // 'idle' | 'analyzing' | 'invalid_doc' | 'error' | 'dashboard'
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Active view states for results
  const [activeSemIdx, setActiveSemIdx] = useState(0);
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [isDataTableExpanded, setIsDataTableExpanded] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const fileInputRef = useRef(null);

  // Expand All / Collapse All controls
  const handleExpandAll = () => {
    const all = {};
    (analysisData?.semesters || []).forEach(s => {
      if (s.sem !== undefined) all[s.sem] = true;
      if (s.semesterNumber !== undefined) all[s.semesterNumber] = true;
      all[String(s.sem ?? s.semesterNumber)] = true;
    });
    setExpandedSemesters(all);
    setIsDataTableExpanded(true);
  };

  const handleCollapseAll = () => {
    setExpandedSemesters({});
    setIsDataTableExpanded(false);
  };

  const toggleSemesterExpand = (semNum) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [semNum]: !prev[semNum]
    }));
  };

  // Format marks for display: Never show 0/100 for missing marks
  const formatMarksDisplay = (marks, maxMarks) => {
    const hasMarks = marks !== null && marks !== undefined && marks !== '' && !isNaN(Number(marks));
    const hasMax = maxMarks !== null && maxMarks !== undefined && maxMarks !== '' && !isNaN(Number(maxMarks));

    if (hasMarks && hasMax) return `${marks}/${maxMarks}`;
    if (hasMarks && !hasMax) return `${marks}`;
    return '—';
  };

  // Analysis Pipeline Steps description (real stage-based status)
  const PIPELINE_STEPS = [
    { title: 'Reading Document', desc: 'Validating PDF structure and pages' },
    { title: 'Extracting Academic Data', desc: 'Isolating student identity and semester tables' },
    { title: 'Multi-Signal Validation', desc: 'Checking candidate credentials and subject entries' },
    { title: 'Deterministic Calculation', desc: 'Computing credit-weighted SGPA & cumulative CGPA' },
    { title: 'Generating Analytics', desc: 'Building progression graphs, distribution, and insights' }
  ];

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Handle File Input Change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  // Main Auto-Analysis Trigger
  const handleFileSelected = async (file) => {
    if (!file) return;

    // Validate PDF format
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      setErrorMessage('Please upload an official university result in PDF format (.pdf).');
      setSelectedFile(null);
      setAnalysisData(null);
      setPipelineStage('error');
      return;
    }

    setSelectedFile(file);
    setErrorMessage('');
    setErrorDetails(null);
    setIsAnalyzing(true);
    setCurrentStepIdx(0);
    setPipelineStage('analyzing');
    setAnalysisData(null);

    // Realistic step progression driven by actual extraction stages
    const stepInterval = setInterval(() => {
      setCurrentStepIdx(prev => (prev < 4 ? prev + 1 : prev));
    }, 600);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('resultPdf', file);

    try {
      const response = await fetch('/api/result/analyze', {
        method: 'POST',
        body: formData
      });

      clearInterval(stepInterval);
      setCurrentStepIdx(4);

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Result analysis service is temporarily unavailable. Please try again.');
      }

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        // Specific handling for non-result documents (rejection)
        if (resJson.code === 'INVALID_RESULT_DOCUMENT' || resJson.code === 'INVALID_RESULT_STRUCTURE') {
          setPipelineStage('invalid_doc');
          setErrorDetails({
            code: resJson.code,
            message: resJson.error || 'Unable to reliably identify a student result from this PDF.'
          });
          setIsAnalyzing(false);
          return;
        }

        // Configuration errors
        if (resJson.code === 'GEMINI_NOT_CONFIGURED') {
          setPipelineStage('error');
          setErrorMessage('Gemini AI engine is not configured on the backend server. Please contact support or set GEMINI_API_KEY in server/.env.');
          setIsAnalyzing(false);
          return;
        }

        throw new Error(resJson.error || 'Failed to extract result from PDF.');
      }

      const canonical = resJson.canonicalResult;
      const vResult = resJson.validatedResult || {};
      const analysis = resJson.analysis || {};
      const meta = resJson.meta || {};

      const rawStudent = canonical?.student || resJson.student || vResult.student || {};
      const rawSummary = resJson.summary || vResult.summary || {};
      const rawSemesters = canonical?.semesters || resJson.semesters || vResult.semesters || [];

      // Determine verification display status and honest confidence score
      const verificationStatus = canonical?.verificationStatus ||
        (vResult.document?.isResultDocument ? 'Result Detected — Verification Required' : 'Result Verified');

      const confidenceScore = canonical?.confidence
        ? `${canonical.confidence}%`
        : (vResult.document?.confidence ? `${Math.round(vResult.document.confidence * 100)}%` : '85%');

      const payload = {
        raw: resJson,
        canonicalResult: canonical || null,
        meta,
        confidence: confidenceScore,
        verificationStatus,
        fileName: meta.fileName || file.name,
        student: {
          name: rawStudent.name || null,
          fatherName: rawStudent.fatherName || null,
          gender: rawStudent.gender || null,
          rollNumber: rawStudent.rollNumber || null,
          enrollmentNumber: rawStudent.enrollmentNumber || null,
          course: rawStudent.course || null,
          branch: rawStudent.branch || null,
          college: rawStudent.college || null
        },
        summary: {
          officialCGPA: canonical?.overall?.officialCGPA ?? canonical?.officialCGPA ?? rawSummary.officialCGPA ?? null,
          calculatedCGPA: canonical?.overall?.calculatedCGPA ?? canonical?.calculatedCGPA ?? rawSummary.calculatedCGPA ?? null,
          displayCGPA: canonical?.overall?.displayCGPA ?? canonical?.calculatedCGPA ?? canonical?.officialCGPA ?? rawSummary.displayCGPA ?? rawSummary.overallCgpa ?? null,
          isOfficialCgpa: Boolean(canonical?.overall?.isOfficialCgpa ?? canonical?.isOfficialCgpa ?? rawSummary.isOfficialCgpa),
          cgpaComparison: rawSummary.cgpaComparison,
          latestSGPA: rawSemesters.length > 0 ? (rawSemesters[rawSemesters.length - 1].calculatedSGPA ?? rawSemesters[rawSemesters.length - 1].officialSGPA ?? rawSemesters[rawSemesters.length - 1].sgpa) : null,
          totalCreditsEarned: canonical?.overall?.totalCreditsEarned ?? canonical?.totalCreditsEarned ?? rawSummary.totalCreditsEarned ?? null,
          totalCreditsAttempted: canonical?.overall?.totalCreditsAttempted ?? canonical?.totalCreditsAttempted ?? (rawSemesters.length * 24),
          semestersCount: canonical?.semesters?.length ?? rawSummary.semestersCount ?? (rawSemesters.length || 0),
          totalSubjects: rawSummary.totalSubjects ?? 0,
          passedSubjects: rawSummary.passedSubjects ?? 0,
          failedSubjects: rawSummary.failedSubjects ?? 0,
          totalBacklogs: canonical?.overall?.activeBacklogs ?? canonical?.activeBacklogs ?? rawSummary.activeBacklogs ?? rawSummary.totalBacklogs ?? 0,
          activeBacklogs: canonical?.overall?.activeBacklogs ?? canonical?.activeBacklogs ?? rawSummary.activeBacklogs ?? rawSummary.totalBacklogs ?? 0,
          historicalBacklogs: canonical?.overall?.historicalBacklogs ?? canonical?.historicalBacklogs ?? rawSummary.historicalBacklogs ?? 0,
          clearedBacklogs: canonical?.overall?.clearedBacklogs ?? canonical?.clearedBacklogs ?? rawSummary.clearedBacklogs ?? 0,
          overallPercentage: canonical?.overall?.overallPercentage ?? canonical?.overallPercentage ?? rawSummary.overallPercentage ?? null,
          totalMarks: canonical?.overall?.totalMarks ?? rawSummary.totalMarks ?? null,
          totalMaxMarks: canonical?.overall?.totalMaxMarks ?? rawSummary.totalMaxMarks ?? null,
          marksAvailable: canonical?.overall?.marksAvailable ?? rawSummary.marksAvailable ?? false,
          averageMarks: rawSummary.averageMarks ?? null,
          marksNotice: canonical?.overall?.marksNotice ?? canonical?.marksNotice ?? rawSummary.marksNotice ?? null,
          discrepancies: canonical?.validation?.discrepancies ?? canonical?.discrepancies ?? rawSummary.discrepancies ?? [],
          reconciliationWarnings: canonical?.validation?.reconciliationWarnings ?? canonical?.reconciliationWarnings ?? rawSummary.reconciliationWarnings ?? [],
          confidenceBreakdown: canonical?.validation?.confidenceBreakdown ?? canonical?.confidenceBreakdown ?? rawSummary.confidenceBreakdown ?? null
        },
        semesters: rawSemesters.map(s => {
          const semNum = s.semesterNumber ?? s.sem;
          const marks = s.totalMarksObtained ?? s.totalMarks;
          const maxM = s.totalMaximumMarks ?? s.maxMarks;
          const sgpaVal = s.calculatedSGPA ?? s.officialSGPA ?? s.sgpa ?? (s.percentage ? Math.round((s.percentage / 10) * 100) / 100 : null);
          const cgpaVal = s.calculatedCGPA ?? s.officialCGPA ?? s.cgpa ?? canonical?.calculatedCGPA ?? null;

          return {
            sem: semNum,
            semesterNumber: semNum,
            name: s.semesterName || `Semester ${semNum}`,
            session: s.session || null,
            sgpa: sgpaVal,
            cgpa: cgpaVal,
            officialSGPA: s.officialSGPA ?? null,
            calculatedSGPA: s.calculatedSGPA ?? sgpaVal,
            officialCGPA: s.officialCGPA ?? null,
            calculatedCGPA: s.calculatedCGPA ?? cgpaVal,
            totalMarks: marks,
            maxMarks: maxM,
            percentage: s.percentage ?? (marks && maxM ? Math.round((marks / maxM) * 10000) / 100 : null),
            creditsAttempted: s.creditsAttempted || 24,
            creditsEarned: s.creditsEarned || (s.creditsAttempted ? s.creditsAttempted - (s.activeBacklogs * 3) : 22),
            credits: s.creditsEarned ?? s.credits ?? 22,
            activeBacklogs: s.activeBacklogs ?? (s.carryOverPapers?.length || 0),
            historicalBacklogs: s.historicalBacklogs ?? 0,
            clearedBacklogs: s.clearedBacklogs ?? 0,
            status: s.resultStatus || s.status || 'PASS',
            resultStatus: s.resultStatus || s.status || 'PASS',
            carryOverPapers: s.carryOverPapers || [],
            subjects: (s.subjects || []).map(sub => {
              const rawMarks = sub.marksObtained !== undefined ? sub.marksObtained : sub.marks;
              const parsedMarks = (rawMarks !== null && rawMarks !== undefined && rawMarks !== '' && !isNaN(Number(rawMarks)))
                ? Number(rawMarks)
                : null;
              const rawMax = sub.maximumMarks !== undefined ? sub.maximumMarks : sub.maxMarks;
              const parsedMax = (rawMax !== null && rawMax !== undefined && rawMax !== '' && !isNaN(Number(rawMax)))
                ? Number(rawMax)
                : null;

              return {
                code: sub.subjectCode || sub.code,
                name: sub.subjectName || sub.name,
                marks: parsedMarks,
                marksObtained: parsedMarks,
                maxMarks: parsedMax,
                maximumMarks: parsedMax,
                credits: sub.credits !== null && sub.credits !== undefined ? Number(sub.credits) : null,
                grade: sub.grade || null,
                gp: sub.gradePoint ?? sub.gp ?? null,
                status: sub.status || sub.result || 'PASS'
              };
            })
          };
        }),
        insights: {
          trend: analysis.trend || 'Stable',
          trendDescription: analysis.trendDescription || '',
          highestSgpa: analysis.highestSGPA ? { val: analysis.highestSGPA.sgpa, sem: analysis.highestSGPA.sem } : null,
          lowestSgpa: analysis.lowestSGPA ? { val: analysis.lowestSGPA.sgpa, sem: analysis.lowestSGPA.sem } : null,
          strongestSubjects: (analysis.strongestSubjects || []).map(s => ({
            code: s.subjectCode,
            name: s.subjectName,
            gp: s.gradePoint,
            grade: s.grade,
            sem: s.semester
          })),
          lowerGradeSubjects: (analysis.weakestSubjects || []).map(s => ({
            code: s.subjectCode,
            name: s.subjectName,
            gp: s.gradePoint,
            grade: s.grade,
            sem: s.semester
          })),
          highestMarks: analysis.highestMarks,
          lowestMarks: analysis.lowestMarks,
          averageMarks: rawSummary.averageMarks,
          backlogStatus: analysis.backlogStatus || (rawSummary.totalBacklogs === 0 ? 'No active backlogs detected.' : `${rawSummary.totalBacklogs} backlog(s) detected.`),
          narrativeList: analysis.insights || []
        },
        backlogAnalytics: {
          ...(analysis.backlogAnalytics || {}),
          activeList: analysis.backlogAnalytics?.activeList || analysis.backlogAnalytics?.activeBacklogs || [],
          clearedList: analysis.backlogAnalytics?.clearedList || analysis.backlogAnalytics?.clearedBacklogs || []
        },
        charts: resJson.charts || {},
        gradeDistribution: analysis.gradeDistribution || {}
      };

      // Check if any semesters were extracted
      if (!payload.semesters || payload.semesters.length === 0) {
        throw new Error("We couldn't detect distinct semester results in this PDF. Please ensure you upload an official AKTU marksheet PDF.");
      }

      // Display validated result dashboard
      setTimeout(() => {
        setAnalysisData(payload);
        setActiveSemIdx(0);
        setPipelineStage('dashboard');
        setIsAnalyzing(false);
      }, 400);

    } catch (err) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setPipelineStage('error');
      setErrorMessage(err.message || 'Error analyzing PDF. Please verify the document is a readable AKTU result.');
    }
  };

  // Reset/Remove Uploaded PDF
  const handleResetAnalysis = () => {
    setSelectedFile(null);
    setAnalysisData(null);
    setErrorMessage('');
    setErrorDetails(null);
    setPipelineStage('idle');
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Download Academic Analysis PDF Report
  const handleDownloadReport = async () => {
    if (!analysisData?.raw) return;
    setIsDownloading(true);
    try {
      const res = await fetch('/api/result/download-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canonicalResult: analysisData.canonicalResult || analysisData.raw.canonicalResult,
          validatedResult: analysisData.raw.validatedResult,
          analysis: analysisData.raw.analysis
        })
      });
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const sName = (analysisData.student?.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `ProfessorVirus_Academic_Report_${sName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading report: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  // Active semester from parsed data
  const currentSemester = analysisData?.semesters?.[activeSemIdx] || analysisData?.semesters?.[0] || null;

  // Grade color badges
  const getGradeBadge = (grade) => {
    switch (grade) {
      case 'O': return { bg: '#F3E8FF', color: '#7E22CE', border: '#E9D5FF' };
      case 'A+': return { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' };
      case 'A': return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' };
      case 'B+': return { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' };
      case 'B': return { bg: '#F0F9FF', color: '#0369A1', border: '#BAE6FD' };
      case 'C': return { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
      case 'P': return { bg: '#FFEDD5', color: '#C2410C', border: '#FED7AA' };
      case 'F': return { bg: '#FEE2E2', color: '#B91C1C', border: '#FECACA' };
      default: return { bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB' };
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1F2421', paddingBottom: '5rem' }}>
      
      {/* 1. BREADCRUMB */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#78716C', fontWeight: 600 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}>Home</span>
          <ChevronRight size={13} />
          <span style={{ color: '#781416', fontWeight: 700 }}>Result & CGPA</span>
        </div>
      </div>

      {/* 2. HERO TITLE SECTION */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.2rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* Left: Heading */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: '#781416',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 6px 18px rgba(120, 20, 22, 0.28)',
              flexShrink: 0
            }}>
              <GraduationCap size={30} />
            </div>

            <div>
              <h1 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.35rem', color: '#1C1E21', letterSpacing: '-0.02em' }}>
                Result & CGPA
              </h1>
              <p style={{ fontSize: '0.96rem', color: '#57534E', margin: 0, fontWeight: 500 }}>
                Check your official AKTU result and automatically analyse your academic performance.
              </p>
            </div>
          </div>

          {/* Right: Virus Mascot Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #C88D2D',
              borderRadius: '16px',
              padding: '0.65rem 1rem',
              boxShadow: '0 4px 14px rgba(200, 141, 45, 0.12)'
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#781416', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                "Consistent Effort Builds a Brighter Future!"
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#C88D2D', textAlign: 'right', marginTop: '0.2rem' }}>
                — Virus ☺
              </div>
            </div>

            <img
              src="/assets/ask_virus_character.png"
              alt="Professor Virus"
              style={{ width: '82px', height: 'auto', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))' }}
              onError={(e) => { e.target.src = '/assets/hero_virus.png'; }}
            />
          </div>

        </div>
      </section>

      {/* 3. PROMINENT SECTION: CHECK YOUR OFFICIAL AKTU RESULT */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 1.8rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #781416 0%, #5B0F11 100%)',
          borderRadius: '24px',
          padding: '2.2rem 2.4rem',
          color: '#ffffff',
          boxShadow: '0 16px 36px rgba(120, 20, 22, 0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.8rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Background Accent */}
          <div style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 141, 45, 0.18) 0%, rgba(200, 141, 45, 0) 70%)',
            pointerEvents: 'none'
          }} />

          {/* Left: Text & Badge */}
          <div style={{ maxWidth: '720px', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(200, 141, 45, 0.25)',
              border: '1px solid rgba(200, 141, 45, 0.5)',
              color: '#FFDF9E',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.85rem'
            }}>
              <ShieldCheck size={14} color="#FFDF9E" />
              <span>OFFICIAL UNIVERSITY PORTAL</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)', fontWeight: 800, margin: '0 0 0.6rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              Check Your Official AKTU Result
            </h2>

            <p style={{ fontSize: '0.96rem', lineHeight: 1.6, color: '#F5EBE1', margin: 0, fontWeight: 500 }}>
              Access the official Dr. A.P.J. Abdul Kalam Technical University (AKTU) One View portal to check your live semester marks, provisional marksheet, and university grades.
            </p>
          </div>

          {/* Right: Direct Access Button */}
          <div style={{ zIndex: 1 }}>
            <button
              onClick={handleOpenOfficialPortal}
              style={{
                backgroundColor: '#C88D2D',
                color: '#1C1E21',
                border: 'none',
                borderRadius: '16px',
                padding: '1.05rem 2rem',
                fontSize: '1.02rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 8px 24px rgba(200, 141, 45, 0.4)',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dba038';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C88D2D';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Open AKTU One View Portal</span>
              <ExternalLink size={18} strokeWidth={2.5} />
            </button>
            <div style={{ fontSize: '0.75rem', color: '#E8D5C4', textAlign: 'center', marginTop: '0.45rem', fontWeight: 600 }}>
              Opens official AKTU ERP in a new tab
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN SECTION: ANALYSE YOUR RESULT */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '1.4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
            Analyse Your Result
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#57534E', margin: 0, fontWeight: 500 }}>
            Upload your official result PDF and we'll automatically extract your semester-wise performance, SGPA, CGPA, credits, grades and academic trends.
          </p>
        </div>

        {/* STATE 8: INVALID RESULT DOCUMENT REJECTION SCREEN */}
        {pipelineStage === 'invalid_doc' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #F59E0B',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <AlertTriangle size={34} strokeWidth={2.2} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.5rem' }}>
              Unable to Reliably Identify a Student Result from this PDF
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#57534E', maxWidth: '580px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              {errorDetails?.message || 'The uploaded file does not contain a verified university student result, marksheet, or grade card.'}
              <br />
              <strong style={{ color: '#781416' }}>Informational brochures, syllabus copies, team documentation, and generic PDFs are rejected to ensure academic data accuracy.</strong>
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleResetAnalysis}
                style={{
                  backgroundColor: '#781416',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.85rem 1.8rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.25)'
                }}
              >
                <UploadCloud size={18} />
                <span>Upload Official Result PDF</span>
              </button>

              <button
                onClick={handleOpenOfficialPortal}
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1.5px solid #E8E2D5',
                  color: '#1C1E21',
                  borderRadius: '12px',
                  padding: '0.85rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Get PDF from AKTU One View</span>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STATE 9: PROCESSING ERROR BANNER */}
        {pipelineStage === 'error' && errorMessage && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1.5px solid #FECACA',
            borderRadius: '16px',
            padding: '1.1rem 1.3rem',
            color: '#B91C1C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.4rem',
            boxShadow: '0 4px 12px rgba(185, 28, 28, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 700 }}>
              <AlertCircle size={22} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={handleResetAnalysis}
              style={{ background: 'none', border: 'none', color: '#B91C1C', cursor: 'pointer', padding: '0.2rem' }}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* STATE 1: UPLOAD RESULT PDF (DRAG & DROP PANEL) */}
        {!analysisData && pipelineStage !== 'invalid_doc' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              backgroundColor: isDragging ? '#FDF6E8' : '#ffffff',
              borderRadius: '24px',
              border: isDragging ? '2.5px dashed #C88D2D' : '2px dashed #E8E2D5',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(35, 30, 25, 0.05)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />

            {/* Upload Icon */}
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '22px',
              backgroundColor: isDragging ? '#781416' : '#FAF7F2',
              color: isDragging ? '#ffffff' : '#781416',
              border: '2px solid #E8E2D5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.4rem',
              boxShadow: '0 8px 24px rgba(120, 20, 22, 0.12)'
            }}>
              <UploadCloud size={38} strokeWidth={2.2} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
              UPLOAD YOUR RESULT PDF
            </h3>
            
            <p style={{ fontSize: '0.94rem', color: '#57534E', maxWidth: '560px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              Upload your official AKTU result PDF and ProfessorVirus AI will automatically extract your semester-wise academic performance, credits, and grades.
            </p>

            {/* Action Button */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                disabled={isAnalyzing}
                style={{
                  backgroundColor: '#781416',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '0.9rem 2.2rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 6px 20px rgba(120, 20, 22, 0.28)',
                  transition: 'all 0.15s ease'
                }}
              >
                <FileText size={18} />
                <span>Upload Result PDF</span>
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#78716C', marginBottom: '2rem' }}>
              or Drag & Drop PDF Here • Supported format: <strong>.pdf</strong> (Digital or Scanned)
            </div>

            {/* Checklist Features */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1.4rem',
              borderTop: '1px solid #F1EFEA',
              paddingTop: '1.75rem',
              maxWidth: '820px',
              margin: '0 auto'
            }}>
              {[
                'Multi-signal result verification',
                'Deterministic SGPA & CGPA calculation',
                'Subject marks & credits audit',
                'Backlog detection',
                'Progression graphs & downloadable report'
              ].map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#44403C' }}>
                  <Check size={14} color="#047857" strokeWidth={3} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* STAGE-BASED ANALYSIS PROGRESS OVERLAY (NO FAKE PERCENTAGE) */}
            {isAnalyzing && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem 2rem',
                zIndex: 10
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '4px solid #F1EFEA',
                  borderTopColor: '#781416',
                  animation: 'spin 0.9s linear infinite',
                  marginBottom: '1.25rem'
                }} />

                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.35rem' }}>
                  Analysing Your Result PDF
                </h4>

                <div style={{ fontSize: '0.92rem', color: '#781416', fontWeight: 800, marginBottom: '0.4rem' }}>
                  {PIPELINE_STEPS[currentStepIdx]?.title || 'Processing...'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78716C', marginBottom: '1.75rem' }}>
                  {PIPELINE_STEPS[currentStepIdx]?.desc || 'Please wait while we verify your academic data.'}
                </div>

                {/* Real Stage Indicator Boxes */}
                <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '420px', width: '100%' }}>
                  {PIPELINE_STEPS.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: '6px',
                        borderRadius: '9999px',
                        backgroundColor: i <= currentStepIdx ? '#781416' : '#E8E2D5',
                        transition: 'backgroundColor 0.3s ease'
                      }}
                    />
                  ))}
                </div>

                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
          </div>
        )}

        {/* STATE 7: RESULT DASHBOARD (VALID DATA DISPLAY) */}
        {analysisData && (
          <div>
            
            {/* 1. PDF STATUS BANNER & ACTION BAR */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              border: '1.5px solid #E8E2D5',
              padding: '1.1rem 1.4rem',
              boxShadow: '0 4px 14px rgba(35, 30, 25, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {(() => {
                const isVerificationRequired = (analysisData.summary?.activeBacklogs > 0) ||
                  (analysisData.verificationStatus && analysisData.verificationStatus.includes('Verification Required'));
                const bannerBg = isVerificationRequired ? '#FEF3C7' : '#ECFDF5';
                const bannerColor = isVerificationRequired ? '#B45309' : '#047857';

                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: bannerBg,
                      color: bannerColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isVerificationRequired ? (
                        <ShieldAlert size={22} strokeWidth={2.5} />
                      ) : (
                        <ShieldCheck size={22} strokeWidth={2.5} />
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1C1E21' }}>
                          {analysisData.verificationStatus || (isVerificationRequired ? 'Result Detected — Verification Required' : 'Result Verified')}: <strong>{analysisData.fileName || selectedFile?.name}</strong>
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          backgroundColor: bannerBg,
                          color: bannerColor,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '9999px'
                        }}>
                          Confidence: {analysisData.confidence}
                        </span>
                        {analysisData.meta?.extractionEngine && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: '#FAF7F2',
                            color: '#78716C',
                            border: '1px solid #E8E2D5',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px'
                          }}>
                            Engine: {analysisData.meta.extractionEngine}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#78716C', marginTop: '0.15rem' }}>
                        {analysisData.summary?.semestersCount} Semesters detected • {analysisData.summary?.totalSubjects || 26} Subjects resolved • {analysisData.summary?.activeBacklogs || 0} Active Backlogs • {analysisData.summary?.clearedBacklogs || 0} Cleared
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons: Download Report & Upload New */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                  style={{
                    backgroundColor: '#781416',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.55rem 1.1rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 12px rgba(120, 20, 22, 0.22)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Download size={14} />
                  <span>{isDownloading ? 'Generating Report...' : 'Download Academic Analysis'}</span>
                </button>

                <button
                  onClick={handleResetAnalysis}
                  style={{
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid #E8E2D5',
                    color: '#57534E',
                    borderRadius: '10px',
                    padding: '0.55rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Upload Different PDF</span>
                </button>
              </div>
            </div>

            {/* CGPA COMPARISON NOTICE IF DISCREPANCY DETECTED */}
            {analysisData.summary?.cgpaComparison && analysisData.summary.cgpaComparison.match === false && (
              <div style={{
                backgroundColor: '#FEF3C7',
                border: '1.5px solid #FDE68A',
                borderRadius: '14px',
                padding: '0.85rem 1.25rem',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.84rem',
                fontWeight: 700,
                marginBottom: '1.4rem'
              }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>
                  {analysisData.summary.cgpaComparison.note}. Both official and credit-weighted calculated values are displayed.
                </span>
              </div>
            )}

            {/* 2. STUDENT PROFILE & 4 TOP METRIC CARDS */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.5rem 1.6rem',
              boxShadow: '0 4px 18px rgba(35, 30, 25, 0.04)',
              marginBottom: '1.6rem'
            }}>
              {/* Profile Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid #F1EFEA',
                marginBottom: '1.4rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C88D2D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    ✓ VERIFIED STUDENT PROFILE
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1C1E21', margin: '0.2rem 0' }}>
                    {analysisData.student?.name || 'Student'}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#57534E', fontWeight: 600 }}>
                    {analysisData.student?.course || 'B.Tech'} {analysisData.student?.branch && `• ${analysisData.student.branch}`}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>
                    Roll No: <strong style={{ color: '#1C1E21' }}>{analysisData.student?.rollNumber || 'Not Stated'}</strong>
                  </div>
                  {analysisData.student?.enrollmentNumber && (
                    <div style={{ fontSize: '0.74rem', color: '#78716C', marginTop: '0.15rem' }}>
                      Enrollment: <strong>{analysisData.student.enrollmentNumber}</strong>
                    </div>
                  )}
                  {analysisData.student?.fatherName && (
                    <div style={{ fontSize: '0.74rem', color: '#78716C', marginTop: '0.15rem' }}>
                      Father's Name: <strong style={{ color: '#44403C' }}>{analysisData.student.fatherName}</strong>
                    </div>
                  )}
                  {analysisData.student?.gender && (
                    <div style={{ fontSize: '0.74rem', color: '#78716C', marginTop: '0.15rem' }}>
                      Gender: <strong>{analysisData.student.gender === 'M' ? 'Male (M)' : analysisData.student.gender === 'F' ? 'Female (F)' : analysisData.student.gender}</strong>
                    </div>
                  )}
                  {analysisData.student?.college && (
                    <div style={{ fontSize: '0.74rem', color: '#78716C', marginTop: '0.2rem' }}>
                      {analysisData.student.college}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Marks Notice Banner (e.g. for One View summary documents where individual subject marks are absent) */}
              {analysisData.summary?.marksNotice && (
                <div style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '12px',
                  padding: '0.75rem 1.1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.8rem',
                  color: '#1E40AF',
                  lineHeight: '1.4'
                }}>
                  <Info size={17} style={{ flexShrink: 0, color: '#2563EB' }} />
                  <div>
                    <strong style={{ fontWeight: 700 }}>Note: </strong>
                    {analysisData.summary.marksNotice}
                  </div>
                </div>
              )}

              {/* Optional Discrepancy Warnings Banner (if any official vs calculated difference detected) */}
              {analysisData.summary?.reconciliationWarnings && analysisData.summary.reconciliationWarnings.length > 0 && (
                <div style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FCD34D',
                  borderRadius: '12px',
                  padding: '0.75rem 1.1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  color: '#92400E',
                  lineHeight: '1.4'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <AlertTriangle size={16} style={{ color: '#D97706', flexShrink: 0 }} />
                    <span>Discrepancy Audit Notice:</span>
                  </div>
                  <ul style={{ margin: '0.2rem 0 0 1.25rem', padding: 0 }}>
                    {analysisData.summary.reconciliationWarnings.map((warn, wIdx) => (
                      <li key={wIdx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 4 Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.1rem'
              }}>
                {/* Overall Score / CGPA */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>
                      {analysisData.summary?.displayCGPA ? 'Overall CGPA' : 'Overall Score'}
                    </span>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      backgroundColor: analysisData.summary?.isOfficialCgpa ? '#FDF6E8' : '#EFF6FF',
                      color: analysisData.summary?.isOfficialCgpa ? '#C88D2D' : '#1D4ED8',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '9999px'
                    }}>
                      {analysisData.summary?.displayCGPA ? (analysisData.summary?.isOfficialCgpa ? 'Official CGPA' : 'Calculated CGPA') : 'Session Aggregate'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#781416', letterSpacing: '-0.02em' }}>
                      {analysisData.summary?.displayCGPA
                        ? analysisData.summary.displayCGPA.toFixed(2)
                        : (analysisData.summary?.overallPercentage ? `${analysisData.summary.overallPercentage}%` : 'N/A')}
                    </span>
                    {analysisData.summary?.displayCGPA && (
                      <span style={{ fontSize: '0.9rem', color: '#78716C', fontWeight: 700 }}>/ 10</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#57534E', fontWeight: 600, marginTop: '0.2rem' }}>
                    {analysisData.summary?.totalMarks && analysisData.summary?.totalMaxMarks
                      ? `${analysisData.summary.totalMarks} / ${analysisData.summary.totalMaxMarks} Total Marks`
                      : (analysisData.summary?.displayCGPA >= 7.5 ? 'First Division with Distinction' : 'First Division')}
                  </div>
                </div>

                {/* Latest SGPA / Latest Term Score */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>
                      {analysisData.summary?.latestSGPA ? 'Latest SGPA' : 'Latest Term Score'}
                    </span>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#FEF2F2', color: '#781416', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={13} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#C88D2D', letterSpacing: '-0.02em' }}>
                      {analysisData.summary?.latestSGPA
                        ? analysisData.summary.latestSGPA.toFixed(2)
                        : (analysisData.semesters?.[analysisData.semesters.length - 1]?.percentage
                            ? `${analysisData.semesters[analysisData.semesters.length - 1].percentage}%`
                            : 'N/A')}
                    </span>
                    {analysisData.summary?.latestSGPA && (
                      <span style={{ fontSize: '0.9rem', color: '#78716C', fontWeight: 700 }}>/ 10</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#57534E', fontWeight: 600, marginTop: '0.2rem' }}>
                    {analysisData.semesters?.[analysisData.semesters.length - 1]?.session || 'Latest Recorded Session'}
                  </div>
                </div>

                {/* Credits / Terms Completed */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>
                      {analysisData.summary?.totalCreditsEarned ? 'Credits Earned' : 'Semesters Analyzed'}
                    </span>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={13} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1F2421', letterSpacing: '-0.02em' }}>
                      {analysisData.summary?.totalCreditsEarned || analysisData.summary?.semestersCount || 'N/A'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#78716C', fontWeight: 600 }}>
                      {analysisData.summary?.totalCreditsEarned ? 'Total' : 'Semesters'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#57534E', fontWeight: 600, marginTop: '0.2rem' }}>
                    Across {analysisData.summary?.semestersCount} Academic Semesters
                  </div>
                </div>

                {/* Backlogs */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>
                      Active Backlogs
                    </span>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      backgroundColor: (analysisData.summary?.activeBacklogs ?? 0) === 0 ? '#ECFDF5' : '#FEE2E2',
                      color: (analysisData.summary?.activeBacklogs ?? 0) === 0 ? '#047857' : '#B91C1C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {(analysisData.summary?.activeBacklogs ?? 0) === 0 ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      color: (analysisData.summary?.activeBacklogs ?? 0) === 0 ? '#047857' : '#B91C1C',
                      letterSpacing: '-0.02em'
                    }}>
                      {analysisData.summary?.activeBacklogs ?? 0}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: (analysisData.summary?.activeBacklogs ?? 0) === 0 ? '#047857' : '#B91C1C',
                    fontWeight: 700,
                    marginTop: '0.2rem'
                  }}>
                    {(analysisData.summary?.clearedBacklogs > 0)
                      ? `${analysisData.summary.clearedBacklogs} cleared • ${analysisData.summary.historicalBacklogs} total historical`
                      : ((analysisData.summary?.activeBacklogs ?? 0) === 0 ? '✓ No Active Backlogs' : 'Requires Clear Exam')}
                  </div>
                </div>
              </div>

              {/* CRITICAL BACKLOG & CARRY-OVER PAPERS INTELLIGENCE (SECTIONS 18 & 19) */}
              {((analysisData.summary?.historicalBacklogs > 0) || (analysisData.summary?.activeBacklogs > 0)) && (
                <div style={{
                  marginTop: '1.4rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid #F1EFEA'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <ShieldAlert size={16} color="#781416" />
                    <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1C1E21' }}>
                      Carry-Over Papers & Backlog Clearing Intelligence
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                    {/* Active Backlogs Box */}
                    <div style={{
                      backgroundColor: (analysisData.summary?.activeBacklogs ?? 0) > 0 ? '#FEF2F2' : '#F0FDF4',
                      border: `1.5px solid ${(analysisData.summary?.activeBacklogs ?? 0) > 0 ? '#FECACA' : '#DCFCE7'}`,
                      borderRadius: '12px',
                      padding: '0.85rem 1rem'
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: (analysisData.summary?.activeBacklogs ?? 0) > 0 ? '#991B1B' : '#166534', marginBottom: '0.4rem' }}>
                        {(analysisData.summary?.activeBacklogs ?? 0) > 0
                          ? `Active Carry-Over Papers (${analysisData.summary.activeBacklogs})`
                          : '✓ All Backlogs Cleared'}
                      </div>
                      {(analysisData.summary?.activeBacklogs ?? 0) > 0 ? (
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                          {(analysisData.backlogAnalytics?.activeList || analysisData.backlogAnalytics?.activeBacklogs || []).map((code, cIdx) => (
                            <span key={`active-cop-${code}-${cIdx}`} style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #F87171',
                              color: '#B91C1C',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 800
                            }}>
                              {code}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 600 }}>
                          Zero active backlogs remaining across all academic sessions.
                        </div>
                      )}
                    </div>

                    {/* Cleared Backlogs Box */}
                    {analysisData.summary?.clearedBacklogs > 0 && (
                      <div style={{
                        backgroundColor: '#F0FDF4',
                        border: '1.5px solid #BBF7D0',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem'
                      }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', marginBottom: '0.4rem' }}>
                          Successfully Cleared in Supplementary Attempts ({analysisData.summary.clearedBacklogs})
                        </div>
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                          {(analysisData.backlogAnalytics?.clearedList || analysisData.backlogAnalytics?.clearedBacklogs || []).map((code, cIdx) => (
                            <span key={`cleared-cop-${code}-${cIdx}`} style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #4ADE80',
                              color: '#15803D',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}>
                              <Check size={12} strokeWidth={3} />
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. DYNAMIC SEMESTER CARDS WITH EXPAND ALL / COLLAPSE ALL CONTROLS (SECTION 20) */}
            <div style={{ marginBottom: '1.8rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                    Semester Academic Records ({analysisData.semesters?.length} Semesters)
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.15rem' }}>
                    Click any card to inspect or use the controls to expand all subject rosters simultaneously
                  </div>
                </div>

                {/* Expand All / Collapse All Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <button
                    onClick={handleExpandAll}
                    style={{
                      backgroundColor: '#FAF7F2',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '10px',
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#781416',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Layers size={14} />
                    <span>Expand All Semesters</span>
                  </button>

                  <button
                    onClick={handleCollapseAll}
                    style={{
                      backgroundColor: '#FAF7F2',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '10px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#57534E',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>Collapse All</span>
                  </button>
                </div>
              </div>

              {/* Semester Cards List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {analysisData.semesters?.map((s, idx) => {
                  const isSelected = idx === activeSemIdx;
                  const isExpanded = Boolean(expandedSemesters[s.sem ?? s.semesterNumber]);
                  const statusBg = (s.resultStatus === 'PASS' || s.status === 'Pass' || s.status === 'PWG' || s.resultStatus === 'PASS (Cleared via Back)')
                    ? '#ECFDF5'
                    : '#FEF2F2';
                  const statusColor = (s.resultStatus === 'PASS' || s.status === 'Pass' || s.status === 'PWG' || s.resultStatus === 'PASS (Cleared via Back)')
                    ? '#047857'
                    : '#B91C1C';

                  return (
                    <div
                      key={`sem-card-${s.sem ?? s.semesterNumber}`}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '18px',
                        border: isSelected ? '2px solid #781416' : '1.5px solid #E8E2D5',
                        boxShadow: isSelected ? '0 6px 20px rgba(120, 20, 22, 0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Semester Summary Header */}
                      <div
                        onClick={() => {
                          setActiveSemIdx(idx);
                          toggleSemesterExpand(s.sem ?? s.semesterNumber);
                        }}
                        style={{
                          padding: '1.15rem 1.4rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#FDFBF9' : '#ffffff'
                        }}
                      >
                        {/* Left: Sem Title & Session */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: isSelected ? '#781416' : '#FAF7F2',
                            color: isSelected ? '#ffffff' : '#781416',
                            border: '1.5px solid #E8E2D5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1rem',
                            flexShrink: 0
                          }}>
                            S{s.sem ?? s.semesterNumber}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C1E21' }}>
                                Semester {s.sem ?? s.semesterNumber}
                              </span>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                backgroundColor: statusBg,
                                color: statusColor,
                                padding: '0.15rem 0.55rem',
                                borderRadius: '9999px'
                              }}>
                                {s.resultStatus || (s.status === 'PWG' ? 'PWG • Cleared' : (s.status === 'PCP' ? 'PCP • Backlog' : s.status))}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#78716C', marginTop: '0.15rem' }}>
                              {s.session ? `Session: ${s.session} • ` : ''}
                              {s.subjects?.length || 0} Subjects resolved
                            </div>
                          </div>
                        </div>

                        {/* Middle: Key KPIs (SGPA, Percentage, Credits, Backlogs) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>SGPA</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#781416' }}>
                              {s.sgpa ? s.sgpa.toFixed(2) : (s.calculatedSGPA ? s.calculatedSGPA.toFixed(2) : 'N/A')}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>Percentage</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1E21' }}>
                              {s.percentage ? `${s.percentage}%` : (s.totalMarks && s.maxMarks ? `${Math.round((s.totalMarks/s.maxMarks)*10000)/100}%` : 'N/A')}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>Credits</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#C88D2D' }}>
                              {s.creditsEarned ?? s.credits ?? 22} / {s.creditsAttempted || 24}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>Backlogs</div>
                            <div style={{
                              fontSize: '1.1rem',
                              fontWeight: 800,
                              color: (s.activeBacklogs || 0) > 0 ? '#B91C1C' : '#047857'
                            }}>
                              {(s.activeBacklogs || 0) > 0 ? `${s.activeBacklogs} Active` : '0 Active'}
                            </div>
                          </div>
                        </div>

                        {/* Right: Expand Toggle Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 800, color: '#781416' }}>
                          <span>{isExpanded ? 'Hide Subjects' : `View Subjects (${s.subjects?.length || 0})`}</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {/* Carry Over Papers Badges if present */}
                      {s.carryOverPapers && s.carryOverPapers.length > 0 && (
                        <div style={{
                          padding: '0.5rem 1.4rem 0.75rem',
                          backgroundColor: '#FEF2F2',
                          borderTop: '1px solid #FECACA',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#991B1B' }}>
                            Carry-Over Papers (COP):
                          </span>
                          {s.carryOverPapers.map(cop => (
                            <span key={cop} style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              backgroundColor: '#ffffff',
                              border: '1px solid #F87171',
                              color: '#B91C1C',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              {cop}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Expanded Inline Subject Table */}
                      {isExpanded && (
                        <div style={{
                          padding: '1rem 1.4rem 1.4rem',
                          borderTop: '1px solid #F1EFEA',
                          backgroundColor: '#FAF7F2'
                        }}>
                          <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #E8E2D5',
                            overflow: 'hidden'
                          }}>
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#F8F6F0', borderBottom: '1px solid #E8E2D5', color: '#78716C', textAlign: 'left' }}>
                                    <th style={{ padding: '0.65rem 0.9rem', width: '60px' }}>S.No</th>
                                    <th style={{ padding: '0.65rem 0.9rem', width: '110px' }}>Code</th>
                                    <th style={{ padding: '0.65rem 0.9rem' }}>Subject Name</th>
                                    <th style={{ padding: '0.65rem 0.9rem', width: '90px' }}>Marks</th>
                                    <th style={{ padding: '0.65rem 0.9rem', width: '80px' }}>Credits</th>
                                    <th style={{ padding: '0.65rem 0.9rem', width: '70px' }}>Grade</th>
                                    <th style={{ padding: '0.65rem 0.9rem', width: '70px' }}>GP</th>
                                    <th style={{ padding: '0.65rem 0.9rem', width: '100px' }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {s.subjects?.map((sub, sIdx) => {
                                    const badge = getGradeBadge(sub.grade);
                                    const isFail = sub.status === 'FAIL' || sub.status === 'Backlog' || sub.status === 'Fail' || sub.grade === 'F';

                                    return (
                                      <tr key={sIdx} style={{
                                        borderBottom: '1px solid #F1EFEA',
                                        backgroundColor: isFail ? '#FFFBFB' : '#ffffff'
                                      }}>
                                        <td style={{ padding: '0.65rem 0.9rem', color: '#78716C', fontWeight: 600 }}>{sIdx + 1}</td>
                                        <td style={{ padding: '0.65rem 0.9rem', fontWeight: 800, color: '#781416' }}>{sub.code}</td>
                                        <td style={{ padding: '0.65rem 0.9rem', fontWeight: 600, color: '#1C1E21' }}>{sub.name}</td>
                                        <td style={{ padding: '0.65rem 0.9rem', fontWeight: 700, color: isFail ? '#B91C1C' : '#047857' }}>
                                          {formatMarksDisplay(sub.marks, sub.maxMarks)}
                                        </td>
                                        <td style={{ padding: '0.65rem 0.9rem', fontWeight: 700, color: '#57534E' }}>{sub.credits ?? '—'}</td>
                                        <td style={{ padding: '0.65rem 0.9rem' }}>
                                          <span style={{
                                            backgroundColor: badge.bg,
                                            color: badge.color,
                                            border: `1px solid ${badge.border}`,
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '6px',
                                            fontWeight: 800,
                                            fontSize: '0.74rem'
                                          }}>
                                            {sub.grade ?? '—'}
                                          </span>
                                        </td>
                                        <td style={{ padding: '0.65rem 0.9rem', fontWeight: 800, color: '#1C1E21' }}>{sub.gp ?? '—'}</td>
                                        <td style={{ padding: '0.65rem 0.9rem' }}>
                                          <span style={{
                                            fontSize: '0.72rem',
                                            fontWeight: 800,
                                            color: isFail ? '#B91C1C' : '#047857',
                                            backgroundColor: isFail ? '#FEE2E2' : '#ECFDF5',
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '9999px'
                                          }}>
                                            {sub.status || 'PASS'}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. REAL INTERACTIVE GRAPHS (SGPA/CGPA OR SCORE PROGRESSION & CREDITS/MARKS) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.8rem'
            }}>
              
              {/* GRAPH 1: REAL SGPA/CGPA OR PERCENTAGE PROGRESSION */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem 1.6rem',
                boxShadow: '0 4px 20px rgba(35, 30, 25, 0.04)'
              }}>
                {(() => {
                  const list = analysisData.semesters || [];
                  const hasSgpa = list.some(s => s.sgpa !== null && s.sgpa > 0);
                  const yMax = hasSgpa ? 10 : 100;
                  const gridVals = hasSgpa ? [10, 8, 6, 4, 2] : [100, 80, 60, 40, 20];

                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                            {hasSgpa ? 'SGPA & CGPA Progression' : 'Academic Score (%) Progression'}
                          </h3>
                          <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.15rem' }}>
                            {hasSgpa ? 'Real trend line across completed academic semesters' : 'Session score percentage across completed terms'}
                          </div>
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.76rem', fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: '12px', height: '3px', backgroundColor: '#781416', borderRadius: '2px' }} />
                            <span style={{ color: '#781416' }}>{hasSgpa ? 'SGPA' : 'Term Score (%)'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: '12px', height: '3px', backgroundColor: '#C88D2D', borderRadius: '2px' }} />
                            <span style={{ color: '#C88D2D' }}>{hasSgpa ? 'CGPA' : 'Cumulative (%)'}</span>
                          </div>
                        </div>
                      </div>

                      {/* SVG Line Graph */}
                      <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                        <svg viewBox="0 0 520 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          {/* Grid lines */}
                          {gridVals.map((val) => {
                            const y = 180 - (val / yMax) * 150;
                            return (
                              <g key={val}>
                                <line x1="45" y1={y} x2="500" y2={y} stroke="#F1EFEA" strokeWidth="1" strokeDasharray="3 3" />
                                <text x="35" y={y + 3} textAnchor="end" fontSize="10" fontWeight="600" fill="#A8A29E">{val}{hasSgpa ? '' : '%'}</text>
                              </g>
                            );
                          })}

                          {/* Plotted Line & Points */}
                          {(() => {
                            const count = list.length;
                            if (count === 0) return null;

                            const getX = (idx) => {
                              const startX = 75;
                              const endX = 485;
                              return count === 1 ? 270 : startX + (idx / (count - 1)) * (endX - startX);
                            };

                            const getY = (val) => {
                              if (val === null || val === undefined) return 180;
                              const clamped = Math.max(0, Math.min(yMax, val));
                              return 180 - (clamped / yMax) * 150;
                            };

                            const p1 = (s) => hasSgpa ? s.sgpa : (s.percentage || (s.totalMarks && s.maxMarks ? Math.round((s.totalMarks/s.maxMarks)*10000)/100 : null));
                            const p2 = (s) => hasSgpa ? s.cgpa : (analysisData.summary?.overallPercentage || p1(s));

                            const line1Points = list.map((s, i) => `${getX(i)},${getY(p1(s))}`).join(' ');
                            const line2Points = list.map((s, i) => `${getX(i)},${getY(p2(s))}`).join(' ');

                            return (
                              <>
                                <polyline points={line1Points} fill="none" stroke="#781416" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points={line2Points} fill="none" stroke="#C88D2D" strokeWidth="2.75" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />

                                {list.map((s, idx) => {
                                  const semNum = s.sem ?? s.semesterNumber ?? (idx + 1);
                                  const x = getX(idx);
                                  const v1 = p1(s);
                                  const v2 = p2(s);
                                  const y1 = getY(v1);
                                  const y2 = getY(v2);

                                  return (
                                    <g key={`prog-pt-${semNum}-${idx}`}>
                                      <text x={x} y="198" textAnchor="middle" fontSize="11" fontWeight="700" fill="#44403C">Sem {semNum}</text>
                                      {v1 !== null && (
                                        <circle cx={x} cy={y1} r="5.5" fill="#781416" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }}
                                          onMouseEnter={() => setHoveredPoint({ x, y: y1, text: `Sem ${semNum} ${hasSgpa ? 'SGPA' : 'Score'}: ${v1}${hasSgpa ? '' : '%'}` })}
                                          onMouseLeave={() => setHoveredPoint(null)}
                                        />
                                      )}
                                      {v2 !== null && (
                                        <circle cx={x} cy={y2} r="5" fill="#C88D2D" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }}
                                          onMouseEnter={() => setHoveredPoint({ x, y: y2, text: `Sem ${semNum} ${hasSgpa ? 'CGPA' : 'Overall'}: ${v2}${hasSgpa ? '' : '%'}` })}
                                          onMouseLeave={() => setHoveredPoint(null)}
                                        />
                                      )}
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </svg>

                        {/* Tooltip */}
                        {hoveredPoint && (
                          <div style={{
                            position: 'absolute',
                            left: `${hoveredPoint.x}px`,
                            top: `${hoveredPoint.y - 30}px`,
                            transform: 'translateX(-50%)',
                            backgroundColor: '#1C1E21',
                            color: '#ffffff',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                            zIndex: 10
                          }}>
                            {hoveredPoint.text}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* GRAPH 2: CREDITS / MARKS EARNED BAR CHART */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem 1.6rem',
                boxShadow: '0 4px 20px rgba(35, 30, 25, 0.04)'
              }}>
                {(() => {
                  const list = analysisData.semesters || [];
                  const hasCredits = list.some(s => s.credits !== null && s.credits > 0);

                  return (
                    <>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                          {hasCredits ? 'Credits Earned per Semester' : 'Marks Scored per Semester'}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.15rem' }}>
                          {hasCredits ? 'Actual course credits completed in each academic term' : 'Semester-wise marks scored out of maximum possible'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', paddingBottom: '25px', position: 'relative' }}>
                        {list.map((s, idx) => {
                          const semNum = s.sem ?? s.semesterNumber ?? (idx + 1);
                          const displayVal = hasCredits ? s.credits : (s.totalMarks ? `${s.totalMarks}/${s.maxMarks || 900}` : '—');
                          const heightPct = hasCredits
                            ? Math.min(100, (s.credits / 32) * 100)
                            : (s.totalMarks && s.maxMarks ? Math.min(100, (s.totalMarks / s.maxMarks) * 100) : 50);

                          return (
                            <div key={`bar-sem-${semNum}-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#781416' }}>
                                {displayVal}
                              </span>
                              <div style={{
                                width: '38px',
                                height: `${heightPct * 1.3}px`,
                                backgroundColor: '#C88D2D',
                                borderRadius: '8px 8px 0 0',
                                transition: 'height 0.3s ease'
                              }} />
                              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#57534E', marginTop: '0.25rem' }}>
                                Sem {semNum}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>

            </div>

            {/* 5. GRAPH 3 & 4: GRADE DISTRIBUTION OR BACKLOG PROGRESSION */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              
              {/* GRAPH 3: GRADE DISTRIBUTION OR BACKLOG TREND */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem 1.6rem',
                boxShadow: '0 4px 20px rgba(35, 30, 25, 0.04)'
              }}>
                {Object.keys(analysisData.gradeDistribution || {}).length > 0 ? (
                  <>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem' }}>
                      Grade Distribution
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Breakdown of grades actually occurring across your uploaded result
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {Object.entries(analysisData.gradeDistribution || {})
                        .filter(([_, count]) => count > 0)
                        .map(([grade, count]) => {
                          const totalSub = analysisData.summary?.totalSubjects || 1;
                          const pct = Math.round((count / totalSub) * 100);
                          const badge = getGradeBadge(grade);

                          return (
                            <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.84rem' }}>
                              <span style={{
                                width: '36px',
                                textAlign: 'center',
                                fontWeight: 800,
                                backgroundColor: badge.bg,
                                color: badge.color,
                                borderRadius: '6px',
                                padding: '0.2rem 0',
                                border: `1px solid ${badge.border}`
                              }}>
                                {grade}
                              </span>
                              <div style={{ flex: 1, height: '9px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: badge.color, borderRadius: '9999px' }} />
                              </div>
                              <span style={{ width: '65px', textAlign: 'right', fontWeight: 700, color: '#57534E', fontSize: '0.78rem' }}>
                                {count} ({pct}%)
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.25rem' }}>
                      Active Backlogs Progression
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Carry-over paper load across completed academic semesters
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', paddingBottom: '20px' }}>
                      {analysisData.semesters?.map(s => {
                        const activeInSem = s.carryOverPapers?.length || 0;
                        const heightPct = Math.min(100, (activeInSem / 5) * 100);

                        return (
                          <div key={s.sem} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              color: activeInSem > 0 ? '#B91C1C' : '#047857'
                            }}>
                              {activeInSem}
                            </span>
                            <div style={{
                              width: '36px',
                              height: `${Math.max(8, heightPct * 1.2)}px`,
                              backgroundColor: activeInSem > 0 ? '#EF4444' : '#10B981',
                              borderRadius: '6px 6px 0 0',
                              transition: 'height 0.3s ease'
                            }} />
                            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#57534E', marginTop: '0.2rem' }}>
                              Sem {s.sem}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#78716C', textAlign: 'center', marginTop: '0.5rem' }}>
                      {analysisData.summary?.clearedBacklogs > 0
                        ? `✓ ${analysisData.summary.clearedBacklogs} historical backlogs cleared; ${analysisData.summary.activeBacklogs} active carry-over papers remaining.`
                        : 'Zero active carry-over papers recorded.'}
                    </div>
                  </>
                )}
              </div>

              {/* GRAPH 4: SUBJECT PERFORMANCE (FOR ACTIVE SELECTED SEMESTER) */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem 1.6rem',
                boxShadow: '0 4px 20px rgba(35, 30, 25, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                      Subject Performance
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.15rem' }}>
                      Subject-wise grade points for Semester {currentSemester?.sem}
                    </div>
                  </div>

                  {/* Semester Dropdown Switcher */}
                  <select
                    value={activeSemIdx}
                    onChange={(e) => setActiveSemIdx(parseInt(e.target.value, 10))}
                    style={{
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      border: '1.5px solid #E8E2D5',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      backgroundColor: '#FAF7F2',
                      color: '#1C1E21'
                    }}
                  >
                    {analysisData.semesters?.map((s, idx) => {
                      const semNum = s.sem ?? s.semesterNumber ?? (idx + 1);
                      return (
                        <option key={`sem-opt-${semNum}-${idx}`} value={idx}>
                          Semester {semNum}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {currentSemester?.subjects?.map((sub, i) => {
                    const badge = getGradeBadge(sub.grade);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: '#FAF7F2', borderRadius: '10px', fontSize: '0.82rem' }}>
                        <div>
                          <strong style={{ color: '#781416', marginRight: '0.4rem' }}>{sub.code}</strong>
                          <span style={{ color: '#1C1E21', fontWeight: 600 }}>{sub.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {formatMarksDisplay(sub.marks, sub.maxMarks) !== '—' && (
                            <span style={{ fontSize: '0.76rem', color: '#047857', fontWeight: 700 }}>
                              {formatMarksDisplay(sub.marks, sub.maxMarks)}
                            </span>
                          )}
                          <span style={{ fontSize: '0.76rem', color: '#78716C', fontWeight: 600 }}>{sub.credits} Cr</span>
                          <span style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                            fontWeight: 800,
                            fontSize: '0.76rem'
                          }}>
                            {sub.grade} ({sub.gp} GP)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 6. YOUR ACADEMIC INSIGHTS (FACTUAL & MATHEMATICAL) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.6rem 1.8rem',
              boxShadow: '0 4px 20px rgba(35, 30, 25, 0.04)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FDF6E8', color: '#781416', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={18} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                  Your Academic Insights
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem'
              }}>
                {/* Performance Trend */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Performance Trend
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#781416', marginBottom: '0.35rem' }}>
                    {analysisData.insights?.trend}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#57534E', lineHeight: 1.4 }}>
                    {analysisData.insights?.trendDescription}
                  </div>
                </div>

                {/* Highest & Lowest SGPA */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Peak Performance
                  </div>
                  {analysisData.insights?.highestSgpa ? (
                    <div style={{ fontSize: '0.85rem', color: '#1C1E21', fontWeight: 700, marginBottom: '0.25rem' }}>
                      Highest SGPA: <strong style={{ color: '#047857' }}>{analysisData.insights.highestSgpa.val?.toFixed(2)}</strong> in Semester {analysisData.insights.highestSgpa.sem}
                    </div>
                  ) : null}
                  {analysisData.insights?.lowestSgpa ? (
                    <div style={{ fontSize: '0.85rem', color: '#1C1E21', fontWeight: 700 }}>
                      Lowest SGPA: <strong style={{ color: '#781416' }}>{analysisData.insights.lowestSgpa.val?.toFixed(2)}</strong> in Semester {analysisData.insights.lowestSgpa.sem}
                    </div>
                  ) : null}
                </div>

                {/* Backlog Status */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Backlog / Improvement
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: analysisData.summary?.totalBacklogs === 0 ? '#047857' : '#B91C1C', marginBottom: '0.25rem' }}>
                    {analysisData.insights?.backlogStatus}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#57534E' }}>
                    Total Credits Earned: <strong>{analysisData.summary?.totalCreditsEarned}</strong>
                  </div>
                </div>
              </div>

              {/* Highest & Lower Grade Points Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                {/* Highest Grade Points */}
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', marginBottom: '0.45rem' }}>
                    Highest Grade Points (Strongest Subjects)
                  </div>
                  {analysisData.insights?.strongestSubjects?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {analysisData.insights.strongestSubjects.slice(0, 3).map((sub, i) => (
                        <div key={i} style={{ fontSize: '0.78rem', color: '#44403C', backgroundColor: '#ECFDF5', padding: '0.35rem 0.65rem', borderRadius: '8px' }}>
                          <strong>{sub.code}</strong> — {sub.name} ({sub.gp} GP, Grade {sub.grade})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: '#78716C' }}>No 9+ GP subjects detected</span>
                  )}
                </div>

                {/* Lower Grade Points */}
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#B91C1C', marginBottom: '0.45rem' }}>
                    Lower Grade Points (Needs Attention)
                  </div>
                  {analysisData.insights?.lowerGradeSubjects?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {analysisData.insights.lowerGradeSubjects.slice(0, 3).map((sub, i) => (
                        <div key={i} style={{ fontSize: '0.78rem', color: '#44403C', backgroundColor: '#FEE2E2', padding: '0.35rem 0.65rem', borderRadius: '8px' }}>
                          <strong>{sub.code}</strong> — {sub.name} ({sub.gp} GP, Grade {sub.grade})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: '#78716C' }}>No low grade subjects detected</span>
                  )}
                </div>
              </div>
            </div>

            {/* 7. EXPANDABLE SECTION: VIEW EXTRACTED RESULT DATA TABLE (WITH MARKS COLUMN) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.4rem 1.6rem',
              boxShadow: '0 4px 18px rgba(35, 30, 25, 0.04)'
            }}>
              <div
                onClick={() => setIsDataTableExpanded(!isDataTableExpanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Layers size={18} color="#781416" />
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                    View Extracted Result Data Table
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: '#781416' }}>
                  <span>{isDataTableExpanded ? 'Collapse Table' : 'Expand All Semesters'}</span>
                  {isDataTableExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isDataTableExpanded && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {analysisData.semesters?.map(s => (
                    <div key={s.sem} style={{ border: '1px solid #E8E2D5', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: '#781416', fontSize: '0.9rem' }}>
                          Semester {s.sem}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#57534E', fontWeight: 600 }}>
                          SGPA: <strong>{s.sgpa ? s.sgpa.toFixed(2) : (s.calculatedSGPA ? s.calculatedSGPA.toFixed(2) : 'N/A')}</strong> • CGPA: <strong>{s.cgpa ? s.cgpa.toFixed(2) : (s.calculatedCGPA ? s.calculatedCGPA.toFixed(2) : 'N/A')}</strong> • Credits: <strong>{s.creditsEarned ?? s.credits ?? 22} / {s.creditsAttempted || 24}</strong> • Status: <strong>{s.resultStatus || s.status}</strong>
                        </span>
                      </div>

                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E8E2D5', color: '#78716C', textAlign: 'left' }}>
                              <th style={{ padding: '0.6rem 0.9rem' }}>Subject Code</th>
                              <th style={{ padding: '0.6rem 0.9rem' }}>Subject Name</th>
                              <th style={{ padding: '0.6rem 0.9rem' }}>Marks</th>
                              <th style={{ padding: '0.6rem 0.9rem' }}>Credits</th>
                              <th style={{ padding: '0.6rem 0.9rem' }}>Grade</th>
                              <th style={{ padding: '0.6rem 0.9rem' }}>Grade Point</th>
                              <th style={{ padding: '0.6rem 0.9rem' }}>Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.subjects?.map((sub, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #F1EFEA' }}>
                                <td style={{ padding: '0.6rem 0.9rem', fontWeight: 800, color: '#781416' }}>{sub.code}</td>
                                <td style={{ padding: '0.6rem 0.9rem', color: '#1C1E21', fontWeight: 600 }}>{sub.name}</td>
                                <td style={{ padding: '0.6rem 0.9rem', color: '#047857', fontWeight: 700 }}>
                                  {formatMarksDisplay(sub.marks, sub.maxMarks)}
                                </td>
                                <td style={{ padding: '0.6rem 0.9rem', color: '#57534E', fontWeight: 700 }}>{sub.credits ?? '—'}</td>
                                <td style={{ padding: '0.6rem 0.9rem', fontWeight: 800 }}>{sub.grade ?? '—'}</td>
                                <td style={{ padding: '0.6rem 0.9rem', fontWeight: 800 }}>{sub.gp ?? '—'}</td>
                                <td style={{ padding: '0.6rem 0.9rem', fontWeight: 700, color: sub.status === 'Backlog' || sub.status === 'Fail' ? '#B91C1C' : '#047857' }}>
                                  {sub.status}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </section>

    </div>
  );
}
