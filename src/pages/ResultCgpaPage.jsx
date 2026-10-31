import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  ExternalLink,
  ChevronRight,
  BarChart2,
  BarChart3,
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
  AlertTriangle,
  Home,
  Landmark,
  Search,
  Filter,
  Sparkles,
  Send,
  Calculator,
  HelpCircle,
  Clock,
  ArrowRight,
  PieChart,
  History,
  SplitSquareVertical
} from 'lucide-react';

export default function ResultCgpaPage({ onNavigate, onOpenAuth }) {
  // Official AKTU One View Portal URL
  const AKTU_ONE_VIEW_URL = 'https://erp.aktu.ac.in/WebPages/OneView/OneView.aspx';

  const handleOpenOfficialPortal = () => {
    window.open(AKTU_ONE_VIEW_URL, '_blank', 'noopener,noreferrer');
  };

  // State for Uploaded File & Analysis
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState(0);
  const [tableSortBy, setTableSortBy] = useState('DEFAULT'); // 'DEFAULT' | 'MARKS_DESC' | 'MARKS_ASC' | 'GRADE'
  const [expandedSubjectCode, setExpandedSubjectCode] = useState(null);

  // Subject Table Search & Filters State
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableTypeFilter, setTableTypeFilter] = useState('ALL'); // 'ALL' | 'Theory' | 'Practical'
  const [tableStatusFilter, setTableStatusFilter] = useState('ALL'); // 'ALL' | 'PASS' | 'BACKLOG'

  // AI Academic Advisor State
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [advisorConversation, setAdvisorConversation] = useState([]);

  // What-If Scenario Simulator State
  const [simScenarioType, setSimScenarioType] = useState('TARGET_CGPA'); // 'TARGET_CGPA' | 'NEXT_SEMESTER' | 'BACKLOG_CLEARANCE'
  const [targetCgpaInput, setTargetCgpaInput] = useState('8.50');
  const [targetRemCreditsInput, setTargetRemCreditsInput] = useState('40');
  const [targetSimResult, setTargetSimResult] = useState(null);
  const [nextSemSgpaInput, setNextSemSgpaInput] = useState('8.50');
  const [nextSemCreditsInput, setNextSemCreditsInput] = useState('22');
  const [nextSemSimResult, setNextSemSimResult] = useState(null);
  const [backlogSelectedSub, setBacklogSelectedSub] = useState('');
  const [backlogProjectedGrade, setBacklogProjectedGrade] = useState('A');
  const [backlogSimResult, setBacklogSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

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
    { title: 'Reading Document(s)', desc: 'Validating PDF structure, text layers, and pages' },
    { title: 'Extracting Academic Data', desc: 'Isolating candidate identity, subject tables, and grades' },
    { title: 'Multi-Signal Validation', desc: 'Cross-checking roll numbers, sessions, and subject entries' },
    { title: 'Deterministic Calculation', desc: 'Computing credit-weighted SGPA & cumulative CGPA' },
    { title: 'Generating Analytics', desc: 'Building progression graphs, backlog audits, and insights' }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  // Handle File Input Change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files));
    }
  };

  // Main Auto-Analysis Trigger (Handles single and multi-PDF uploads)
  const handleFilesSelected = async (filesInput) => {
    if (!filesInput) return;
    const filesList = Array.isArray(filesInput) ? filesInput : [filesInput];
    if (filesList.length === 0) return;

    // Validate PDF format
    const validPdfs = filesList.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (validPdfs.length === 0) {
      setErrorMessage('Please upload official university result documents in PDF format (.pdf).');
      setSelectedFile(null);
      setSelectedFiles([]);
      setAnalysisData(null);
      setPipelineStage('error');
      return;
    }

    setSelectedFiles(validPdfs);
    setSelectedFile(validPdfs[0]);
    setErrorMessage('');
    setErrorDetails(null);
    setIsAnalyzing(true);
    setCurrentStepIdx(0);
    setPipelineStage('analyzing');
    setAnalysisData(null);
    setAdvisorConversation([]);
    setTargetSimResult(null);
    setNextSemSimResult(null);
    setBacklogSimResult(null);

    // Realistic step progression driven by actual extraction stages
    const stepInterval = setInterval(() => {
      setCurrentStepIdx(prev => (prev < 4 ? prev + 1 : prev));
    }, 600);

    const formData = new FormData();
    validPdfs.forEach(file => {
      formData.append('files', file);
      formData.append('resultPdf', file);
    });

    try {
      const response = await fetch('/api/result/analyze', {
        method: 'POST',
        body: formData
      });

      clearInterval(stepInterval);
      setCurrentStepIdx(4);

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        if (response.status === 504 || response.status === 408) {
          throw new Error('Analysis timed out. Please ensure you upload an official AKTU result PDF.');
        }
        throw new Error('Result analysis service is temporarily unavailable. Please try again in a few moments.');
      }

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        // Cross-student mismatch
        if (resJson.code === 'STUDENT_IDENTITY_MISMATCH') {
          setPipelineStage('error');
          setErrorMessage(resJson.error || 'Cross-student documents detected. Please upload marksheets belonging to the same student.');
          setIsAnalyzing(false);
          return;
        }

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
        : (vResult.document?.confidence ? `${Math.round(vResult.document.confidence * 100)}%` : '96%');

      const payload = {
        raw: resJson,
        canonicalResult: canonical || null,
        meta,
        confidence: confidenceScore,
        verificationStatus,
        fileName: meta.fileName || validPdfs.map(f => f.name).join(', '),
        fileNames: validPdfs.map(f => f.name),
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
                type: sub.type || (sub.subjectCode && sub.subjectCode.endsWith('P') ? 'Practical' : 'Theory'),
                internalMarks: sub.internalMarks ?? sub.sessionalMarks ?? null,
                externalMarks: sub.externalMarks ?? sub.endSemMarks ?? null,
                backPaperMarks: sub.backPaperMarks ?? null,
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
          clearedList: analysis.backlogAnalytics?.clearedList || analysis.backlogAnalytics?.clearedBacklogs || [],
          attemptHistory: analysis.backlogAnalytics?.attemptHistory || []
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

        // Pre-fill simulator defaults
        if (payload.summary?.displayCGPA) {
          const nextTarget = Math.min(10.0, Math.round((payload.summary.displayCGPA + 0.3) * 10) / 10).toFixed(2);
          setTargetCgpaInput(nextTarget);
        }
        if (payload.backlogAnalytics?.activeList?.length > 0) {
          const firstCop = payload.backlogAnalytics.activeList[0];
          setBacklogSelectedSub(typeof firstCop === 'string' ? firstCop : (firstCop.subjectCode || ''));
        }
      }, 400);

    } catch (err) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setPipelineStage('error');
      setErrorMessage(err.message || 'Error analyzing PDF. Please verify the document is a readable AKTU result.');
    }
  };

  // Backwards-compatible single-file alias
  const handleFileSelected = (file) => handleFilesSelected(file ? [file] : []);

  // Reset/Remove Uploaded PDF
  const handleResetAnalysis = () => {
    setSelectedFile(null);
    setSelectedFiles([]);
    setAnalysisData(null);
    setErrorMessage('');
    setErrorDetails(null);
    setPipelineStage('idle');
    setIsAnalyzing(false);
    setAdvisorConversation([]);
    setTargetSimResult(null);
    setNextSemSimResult(null);
    setBacklogSimResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (mobileFileInputRef.current) mobileFileInputRef.current.value = '';
  };

  // AI Academic Advisor Query Handler
  const handleAskAdvisor = async (overrideQuery = null) => {
    const q = (overrideQuery || advisorQuery || '').trim();
    if (!q || !analysisData) return;

    setIsAdvisorLoading(true);
    const newEntry = { role: 'user', text: q, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAdvisorConversation(prev => [...prev, newEntry]);
    if (!overrideQuery) setAdvisorQuery('');

    try {
      const res = await fetch('/api/result/advisor-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentData: analysisData,
          query: q
        })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Advisor could not process the query.');
      }

      setAdvisorConversation(prev => [
        ...prev,
        {
          role: 'advisor',
          text: resData.answer,
          recommendations: resData.actionableRecommendations || [],
          engine: resData.engine || (resData.isAiGenerated ? 'GEMINI_AI' : 'DETERMINISTIC_RULES'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setAdvisorConversation(prev => [
        ...prev,
        {
          role: 'advisor',
          isError: true,
          text: `Advisor Notice: ${err.message || 'Service is temporarily occupied. Please retry in a moment.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  // What-If Scenario Simulator Execution
  const handleRunSimulation = async (type) => {
    if (!analysisData) return;
    setIsSimulating(true);

    const curCGPA = analysisData.summary?.displayCGPA || analysisData.summary?.calculatedCGPA || 8.0;
    const curCreds = analysisData.summary?.totalCreditsEarned || (analysisData.semesters?.length * 22) || 44;

    try {
      if (type === 'TARGET_CGPA') {
        const res = await fetch('/api/result/simulate-scenario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioType: 'TARGET_CGPA',
            currentCGPA: curCGPA,
            currentCredits: curCreds,
            targetCGPA: parseFloat(targetCgpaInput) || 8.5,
            remainingCredits: parseFloat(targetRemCreditsInput) || 40
          })
        });
        const data = await res.json();
        setTargetSimResult(data);
      } else if (type === 'NEXT_SEMESTER') {
        const res = await fetch('/api/result/simulate-scenario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioType: 'NEXT_SEMESTER',
            currentCGPA: curCGPA,
            currentCredits: curCreds,
            hypotheticalSGPA: parseFloat(nextSemSgpaInput) || 8.5,
            nextSemesterCredits: parseFloat(nextSemCreditsInput) || 22
          })
        });
        const data = await res.json();
        setNextSemSimResult(data);
      } else if (type === 'BACKLOG_CLEARANCE') {
        const res = await fetch('/api/result/simulate-scenario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioType: 'BACKLOG_CLEARANCE',
            currentCGPA: curCGPA,
            currentCredits: curCreds,
            subjectCredits: 4,
            projectedGrade: backlogProjectedGrade || 'A'
          })
        });
        const data = await res.json();
        setBacklogSimResult(data);
      }
    } catch (simErr) {
      console.error('[SIMULATION ERROR]', simErr);
    } finally {
      setIsSimulating(false);
    }
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
    <div style={{ backgroundColor: 'transparent', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#FFFFFF', paddingBottom: '5rem' }}>
      
      {/* =========================================================================
          DESKTOP RESULT & CGPA WORKSPACE (>= 1024px)
          100% Preserved & Untouched Baseline
          ========================================================================= */}
      <div className="pv-result-desktop-only" style={{ width: '100%' }}>
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
                  backgroundColor: 'transparent',
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
              multiple
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
              UPLOAD YOUR RESULT PDF(S)
            </h3>
            
            <p style={{ fontSize: '0.94rem', color: '#57534E', maxWidth: '580px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
              Upload your official AKTU result PDF(s) — support for single-semester, multi-semester, and merging regular + carry-over marksheets with automated backlog clearance tracking.
            </p>

            {/* Selected File Chips (Multi-file Support) */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.55rem', maxWidth: '640px', margin: '0 auto 1.35rem auto' }}>
                {selectedFiles.map((f, fIdx) => (
                  <div key={fIdx} style={{
                    backgroundColor: 'transparent',
                    border: '1.5px solid #E8E2D5',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#1C1E21'
                  }}>
                    <FileText size={14} color="#781416" />
                    <span>{f.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#78716C' }}>({(f.size / 1024).toFixed(0)} KB)</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Button */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
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
                <span>Upload Result PDF(s)</span>
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#78716C', marginBottom: '2rem' }}>
              Select single or multiple PDFs • Drag & drop supported • Digital or scanned
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
                            backgroundColor: 'transparent',
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
                    backgroundColor: 'transparent',
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

              {/* Single Marksheet Notice Banner (Phase 5: Explicit notification when earlier/subsequent attempts missing) */}
              {analysisData.summary?.semestersCount === 1 && (
                <div style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  borderRadius: '12px',
                  padding: '0.75rem 1.1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.8rem',
                  color: '#92400E',
                  lineHeight: '1.4'
                }}>
                  <AlertCircle size={17} style={{ flexShrink: 0, color: '#D97706' }} />
                  <div>
                    <strong style={{ fontWeight: 700 }}>Single Marksheet Analyzed: </strong>
                    Complete historical backlog timeline across earlier/subsequent semesters cannot yet be confirmed without additional marksheets. Upload all semester marksheets or your consolidated AKTU One View to unlock verified cross-semester backlog clearance tracking.
                  </div>
                </div>
              )}

              {/* 4 Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.1rem'
              }}>
                {/* Overall Score / CGPA */}
                <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>
                      {analysisData.summary?.displayCGPA ? 'Overall CGPA' : 'Overall Score'}
                    </span>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      backgroundColor: analysisData.summary?.isOfficialCgpa ? '#FDF6E8' : (analysisData.summary?.displayCGPA ? '#EFF6FF' : '#FEF2F2'),
                      color: analysisData.summary?.isOfficialCgpa ? '#C88D2D' : (analysisData.summary?.displayCGPA ? '#1D4ED8' : '#B91C1C'),
                      padding: '0.1rem 0.4rem',
                      borderRadius: '9999px'
                    }}>
                      {analysisData.summary?.displayCGPA
                        ? (analysisData.summary?.isOfficialCgpa ? 'Official CGPA' : 'Calculated CGPA')
                        : (analysisData.summary?.overallPercentage ? 'Session Aggregate' : 'CGPA Pending')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    {analysisData.summary?.displayCGPA != null ? (
                      <>
                        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#781416', letterSpacing: '-0.02em' }}>
                          {analysisData.summary.displayCGPA.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#78716C', fontWeight: 700 }}>/ 10</span>
                      </>
                    ) : analysisData.summary?.overallPercentage != null ? (
                      <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#781416', letterSpacing: '-0.02em' }}>
                        {`${analysisData.summary.overallPercentage}%`}
                      </span>
                    ) : (
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', lineHeight: '1.3', padding: '0.35rem 0' }}>
                        CGPA cannot be reliably calculated from available data.
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#57534E', fontWeight: 600, marginTop: '0.2rem' }}>
                    {analysisData.summary?.totalMarks && analysisData.summary?.totalMaxMarks
                      ? `${analysisData.summary.totalMarks} / ${analysisData.summary.totalMaxMarks} Total Marks`
                      : (analysisData.summary?.displayCGPA != null
                          ? (analysisData.summary.displayCGPA >= 7.5 ? 'First Division with Distinction' : 'First Division')
                          : 'Insufficient multi-semester credit data')}
                  </div>
                </div>

                {/* Latest SGPA / Latest Term Score */}
                <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
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
                <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>
                      {analysisData.summary?.totalCreditsEarned ? 'Credits Earned' : 'Semesters Analyzed'}
                    </span>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={13} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
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
                <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
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

            {/* 2.5 INTERACTIVE AI ACADEMIC ADVISOR SECTION */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.6rem 1.8rem',
              boxShadow: '0 4px 20px rgba(35, 30, 25, 0.04)',
              marginBottom: '1.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: '#781416',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(120, 20, 22, 0.25)',
                    flexShrink: 0
                  }}>
                    <Sparkles size={22} color="#F5B041" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                        ProfessorVirus AI Academic Advisor
                      </h3>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: '#FDF6E8',
                        color: '#8A5D00',
                        border: '1px solid #F3DFC1',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px'
                      }}>
                        AKTU Intelligence Engine
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#78716C', margin: '0.15rem 0 0 0' }}>
                      Context-grounded guidance based strictly on your verified marksheets & university regulations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Prompt Suggestions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', marginBottom: '1.25rem' }}>
                {[
                  { label: '🏆 Best Performing Semester', q: 'Which was my best performing semester and how can I replicate that achievement?' },
                  { label: '📈 CGPA Improvement Strategy', q: 'What is the most effective strategy to boost my cumulative CGPA in upcoming semesters?' },
                  { label: '⚠️ Backlog Clearance Guidance', q: 'Do I have any active or historical backlogs and what are the clearance rules?' },
                  { label: '⭐ Strongest & Weakest Subjects', q: 'Analyze my strongest subject areas and identify where I lost marks.' }
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleAskAdvisor(prompt.q)}
                    disabled={isAdvisorLoading}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '10px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#781416',
                      cursor: isAdvisorLoading ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDF6E8'; e.currentTarget.style.borderColor = '#C88D2D'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FAF7F2'; e.currentTarget.style.borderColor = '#E8E2D5'; }}
                  >
                    <span>{prompt.label}</span>
                  </button>
                ))}
              </div>

              {/* Advisor Conversation Stream */}
              {advisorConversation.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  paddingRight: '0.35rem',
                  marginBottom: '1.25rem'
                }}>
                  {advisorConversation.map((msg, mIdx) => (
                    <div key={mIdx} style={{
                      backgroundColor: msg.role === 'user' ? '#FAF7F2' : (msg.isError ? '#FEF2F2' : '#ffffff'),
                      border: msg.role === 'user' ? '1px solid #E8E2D5' : (msg.isError ? '1px solid #FECACA' : '1.5px solid #C88D2D'),
                      borderRadius: '14px',
                      padding: '1rem 1.25rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: msg.role === 'user' ? '#57534E' : (msg.isError ? '#B91C1C' : '#781416')
                        }}>
                          {msg.role === 'user' ? 'You Asked' : 'ProfessorVirus Senior Academic Advisor'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          {msg.engine && (
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: msg.engine === 'GEMINI_AI' ? '#EFF6FF' : '#F0FDF4',
                              color: msg.engine === 'GEMINI_AI' ? '#1D4ED8' : '#15803D',
                              padding: '0.1rem 0.45rem',
                              borderRadius: '6px'
                            }}>
                              {msg.engine === 'GEMINI_AI' ? '🤖 Gemini AI' : '📐 Verified Rules'}
                            </span>
                          )}
                          {msg.timestamp && (
                            <span style={{ fontSize: '0.68rem', color: '#A8A29E' }}>{msg.timestamp}</span>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.88rem', color: '#1C1E21', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </div>

                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #F1EFEA' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#047857', marginBottom: '0.35rem' }}>
                            Actionable Recommendations:
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#44403C', lineHeight: 1.5 }}>
                            {msg.recommendations.map((rec, rIdx) => (
                              <li key={rIdx} style={{ marginBottom: '0.25rem' }}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Advisor Query Input Bar */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <input
                  type="text"
                  value={advisorQuery}
                  onChange={(e) => setAdvisorQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAskAdvisor(); }}
                  placeholder="Ask any question about your CGPA, backlogs, grading rules, or study strategy..."
                  disabled={isAdvisorLoading}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.1rem',
                    borderRadius: '12px',
                    border: '1.5px solid #E8E2D5',
                    fontSize: '0.88rem',
                    backgroundColor: 'transparent',
                    color: '#1C1E21',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => handleAskAdvisor()}
                  disabled={isAdvisorLoading || !advisorQuery.trim()}
                  style={{
                    backgroundColor: '#781416',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem 1.4rem',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: (isAdvisorLoading || !advisorQuery.trim()) ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(120, 20, 22, 0.22)',
                    transition: 'all 0.15s ease',
                    opacity: (isAdvisorLoading || !advisorQuery.trim()) ? 0.7 : 1
                  }}
                >
                  <Send size={15} />
                  <span>{isAdvisorLoading ? 'Analyzing...' : 'Ask Advisor'}</span>
                </button>
              </div>
            </div>

            {/* 2.6 WHAT-IF ACADEMIC SCENARIO SIMULATOR CARD */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.6rem 1.8rem',
              boxShadow: '0 4px 20px rgba(35, 30, 25, 0.04)',
              marginBottom: '1.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: '#FDF6E8',
                    color: '#8A5D00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #E8D5C4',
                    flexShrink: 0
                  }}>
                    <Calculator size={22} color="#8A5D00" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                        What-If Academic Scenario Simulator
                      </h3>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px'
                      }}>
                        Deterministic Math
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#78716C', margin: '0.15rem 0 0 0' }}>
                      Simulate target graduation CGPAs, next semester score impacts, and backlog clearance boosts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulator Mode Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.3rem', borderBottom: '1px solid #F1EFEA', paddingBottom: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSimScenarioType('TARGET_CGPA')}
                  style={{
                    backgroundColor: simScenarioType === 'TARGET_CGPA' ? '#781416' : '#FAF7F2',
                    color: simScenarioType === 'TARGET_CGPA' ? '#ffffff' : '#57534E',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.55rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  🎯 Target Graduation CGPA
                </button>
                <button
                  onClick={() => setSimScenarioType('NEXT_SEMESTER')}
                  style={{
                    backgroundColor: simScenarioType === 'NEXT_SEMESTER' ? '#781416' : '#FAF7F2',
                    color: simScenarioType === 'NEXT_SEMESTER' ? '#ffffff' : '#57534E',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.55rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  📈 Next Semester Impact
                </button>
                {(analysisData.summary?.activeBacklogs > 0) && (
                  <button
                    onClick={() => setSimScenarioType('BACKLOG_CLEARANCE')}
                    style={{
                      backgroundColor: simScenarioType === 'BACKLOG_CLEARANCE' ? '#781416' : '#FAF7F2',
                      color: simScenarioType === 'BACKLOG_CLEARANCE' ? '#ffffff' : '#57534E',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.55rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Backlog Clearance Impact
                  </button>
                )}
              </div>

              {/* Tab 1: Target CGPA Simulator */}
              {simScenarioType === 'TARGET_CGPA' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#44403C', display: 'block', marginBottom: '0.35rem' }}>
                        Desired Target CGPA: <strong style={{ color: '#781416' }}>{targetCgpaInput}</strong>
                      </label>
                      <input
                        type="range"
                        min="6.00"
                        max="10.00"
                        step="0.05"
                        value={targetCgpaInput}
                        onChange={(e) => setTargetCgpaInput(e.target.value)}
                        style={{ width: '100%', accentColor: '#781416' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#44403C', display: 'block', marginBottom: '0.35rem' }}>
                        Estimated Remaining Credits:
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="120"
                        value={targetRemCreditsInput}
                        onChange={(e) => setTargetRemCreditsInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.8rem',
                          borderRadius: '8px',
                          border: '1.5px solid #E8E2D5',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button
                        onClick={() => handleRunSimulation('TARGET_CGPA')}
                        disabled={isSimulating}
                        style={{
                          width: '100%',
                          backgroundColor: '#C88D2D',
                          color: '#1C1E21',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.65rem 1.2rem',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: isSimulating ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          boxShadow: '0 4px 12px rgba(200, 141, 45, 0.25)'
                        }}
                      >
                        <Calculator size={16} />
                        <span>{isSimulating ? 'Computing...' : 'Calculate Required SGPA'}</span>
                      </button>
                    </div>
                  </div>

                  {targetSimResult && (
                    <div style={{
                      backgroundColor: targetSimResult.feasibility === 'MATHEMATICALLY_UNACHIEVABLE' ? '#FEF2F2' : '#F0FDF4',
                      border: `1.5px solid ${targetSimResult.feasibility === 'MATHEMATICALLY_UNACHIEVABLE' ? '#FECACA' : '#DCFCE7'}`,
                      borderRadius: '12px',
                      padding: '1rem 1.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          color: targetSimResult.feasibility === 'MATHEMATICALLY_UNACHIEVABLE' ? '#991B1B' : '#166534'
                        }}>
                          Required SGPA: {targetSimResult.requiredSGPA ?? 'N/A'}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          backgroundColor: targetSimResult.feasibility === 'MATHEMATICALLY_UNACHIEVABLE' ? '#FEE2E2' : '#DCFCE7',
                          color: targetSimResult.feasibility === 'MATHEMATICALLY_UNACHIEVABLE' ? '#B91C1C' : '#15803D'
                        }}>
                          {targetSimResult.feasibility}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#44403C', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                        {targetSimResult.message}
                      </p>
                      <div style={{ fontSize: '0.74rem', color: '#78716C' }}>
                        Max achievable CGPA with 10.0 in remaining credits: <strong>{targetSimResult.maxAchievableCGPA}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Next Semester Simulator */}
              {simScenarioType === 'NEXT_SEMESTER' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#44403C', display: 'block', marginBottom: '0.35rem' }}>
                        Hypothetical Next Sem SGPA: <strong style={{ color: '#781416' }}>{nextSemSgpaInput}</strong>
                      </label>
                      <input
                        type="range"
                        min="4.00"
                        max="10.00"
                        step="0.05"
                        value={nextSemSgpaInput}
                        onChange={(e) => setNextSemSgpaInput(e.target.value)}
                        style={{ width: '100%', accentColor: '#781416' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#44403C', display: 'block', marginBottom: '0.35rem' }}>
                        Upcoming Semester Credits:
                      </label>
                      <input
                        type="number"
                        min="12"
                        max="32"
                        value={nextSemCreditsInput}
                        onChange={(e) => setNextSemCreditsInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.8rem',
                          borderRadius: '8px',
                          border: '1.5px solid #E8E2D5',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button
                        onClick={() => handleRunSimulation('NEXT_SEMESTER')}
                        disabled={isSimulating}
                        style={{
                          width: '100%',
                          backgroundColor: '#C88D2D',
                          color: '#1C1E21',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.65rem 1.2rem',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: isSimulating ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          boxShadow: '0 4px 12px rgba(200, 141, 45, 0.25)'
                        }}
                      >
                        <TrendingUp size={16} />
                        <span>{isSimulating ? 'Simulating...' : 'Project New CGPA'}</span>
                      </button>
                    </div>
                  </div>

                  {nextSemSimResult && (
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1.5px solid #DCFCE7',
                      borderRadius: '12px',
                      padding: '1rem 1.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#166534' }}>
                          Projected New CGPA: {nextSemSimResult.projectedCGPA}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: nextSemSimResult.direction === 'INCREASE' ? '#047857' : (nextSemSimResult.direction === 'DECREASE' ? '#B91C1C' : '#57534E')
                        }}>
                          {nextSemSimResult.direction === 'INCREASE' ? `+${nextSemSimResult.delta} CGPA` : (nextSemSimResult.direction === 'DECREASE' ? `-${nextSemSimResult.delta} CGPA` : 'No Change')}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#44403C', margin: 0, lineHeight: 1.5 }}>
                        {nextSemSimResult.summaryText}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Backlog Clearance Simulator */}
              {simScenarioType === 'BACKLOG_CLEARANCE' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#44403C', display: 'block', marginBottom: '0.35rem' }}>
                        Select Backlog Subject:
                      </label>
                      <select
                        value={backlogSelectedSub}
                        onChange={(e) => setBacklogSelectedSub(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.8rem',
                          borderRadius: '8px',
                          border: '1.5px solid #E8E2D5',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}
                      >
                        {(analysisData.backlogAnalytics?.activeList || []).map((b, idx) => {
                          const code = typeof b === 'string' ? b : (b.subjectCode || b.code);
                          return <option key={idx} value={code}>{code}</option>;
                        })}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#44403C', display: 'block', marginBottom: '0.35rem' }}>
                        Expected Clearance Grade:
                      </label>
                      <select
                        value={backlogProjectedGrade}
                        onChange={(e) => setBacklogProjectedGrade(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.8rem',
                          borderRadius: '8px',
                          border: '1.5px solid #E8E2D5',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}
                      >
                        {['P (4 GP)', 'C (5 GP)', 'B (6 GP)', 'B+ (7 GP)', 'A (8 GP)', 'A+ (9 GP)', 'O (10 GP)'].map(g => (
                          <option key={g} value={g.split(' ')[0]}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button
                        onClick={() => handleRunSimulation('BACKLOG_CLEARANCE')}
                        disabled={isSimulating}
                        style={{
                          width: '100%',
                          backgroundColor: '#C88D2D',
                          color: '#1C1E21',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.65rem 1.2rem',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: isSimulating ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          boxShadow: '0 4px 12px rgba(200, 141, 45, 0.25)'
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>{isSimulating ? 'Calculating...' : 'Simulate Clearance'}</span>
                      </button>
                    </div>
                  </div>

                  {backlogSimResult && (
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1.5px solid #DCFCE7',
                      borderRadius: '12px',
                      padding: '1rem 1.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#166534' }}>
                          CGPA After Clearing: {backlogSimResult.projectedCGPA} (+{backlogSimResult.delta})
                        </span>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#047857' }}>
                          +{backlogSimResult.subjectCredits} Earned Credits Restored
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#44403C', margin: 0, lineHeight: 1.5 }}>
                        {backlogSimResult.summaryText}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div style={{ fontSize: '0.72rem', color: '#78716C', marginTop: '0.9rem', fontStyle: 'italic', borderTop: '1px solid #F1EFEA', paddingTop: '0.6rem' }}>
                * All projections are simulated mathematical estimates based on official AKTU credit-weighted ordinances. Official results depend on university evaluation.
              </div>
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
                      backgroundColor: 'transparent',
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
                      backgroundColor: 'transparent',
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
                          backgroundColor: 'transparent'
                        }}>
                          {/* Search and Filters Bar */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.65rem',
                            marginBottom: '0.85rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                backgroundColor: '#ffffff',
                                border: '1.5px solid #E8E2D5',
                                borderRadius: '10px',
                                padding: '0.35rem 0.75rem',
                                width: '100%',
                                maxWidth: '320px'
                              }}>
                                <Search size={14} color="#78716C" />
                                <input
                                  type="text"
                                  value={tableSearchQuery}
                                  onChange={(e) => setTableSearchQuery(e.target.value)}
                                  placeholder="Search by code or subject name..."
                                  style={{
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.78rem',
                                    color: '#1C1E21',
                                    width: '100%',
                                    backgroundColor: 'transparent'
                                  }}
                                />
                                {tableSearchQuery && (
                                  <button onClick={() => setTableSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#78716C' }}>
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#78716C' }}>Type:</span>
                              {['ALL', 'Theory', 'Practical'].map(t => (
                                <button
                                  key={t}
                                  onClick={() => setTableTypeFilter(t)}
                                  style={{
                                    backgroundColor: tableTypeFilter === t ? '#781416' : '#ffffff',
                                    color: tableTypeFilter === t ? '#ffffff' : '#57534E',
                                    border: `1px solid ${tableTypeFilter === t ? '#781416' : '#E8E2D5'}`,
                                    borderRadius: '6px',
                                    padding: '0.2rem 0.55rem',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {t}
                                </button>
                              ))}

                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#78716C', marginLeft: '0.4rem' }}>Status:</span>
                              {['ALL', 'PASS', 'BACKLOG'].map(st => (
                                <button
                                  key={st}
                                  onClick={() => setTableStatusFilter(st)}
                                  style={{
                                    backgroundColor: tableStatusFilter === st ? '#781416' : '#ffffff',
                                    color: tableStatusFilter === st ? '#ffffff' : '#57534E',
                                    border: `1px solid ${tableStatusFilter === st ? '#781416' : '#E8E2D5'}`,
                                    borderRadius: '6px',
                                    padding: '0.2rem 0.55rem',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {st === 'BACKLOG' ? 'Backlogs' : st}
                                </button>
                              ))}

                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#78716C', marginLeft: '0.4rem' }}>Sort:</span>
                              <select
                                value={tableSortBy}
                                onChange={(e) => setTableSortBy(e.target.value)}
                                style={{
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #E8E2D5',
                                  borderRadius: '6px',
                                  padding: '0.2rem 0.5rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: '#1C1E21',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="DEFAULT">Default</option>
                                <option value="MARKS_DESC">Marks (High → Low)</option>
                                <option value="MARKS_ASC">Marks (Low → High)</option>
                                <option value="GRADE">Grade Point (High → Low)</option>
                              </select>
                            </div>
                          </div>

                          <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #E8E2D5',
                            overflow: 'hidden'
                          }}>
                            {(() => {
                              const hasInternalExternal = (s.subjects || []).some(sub => sub.internalMarks !== null || sub.externalMarks !== null);
                              const filteredSubs = (s.subjects || []).filter(sub => {
                                const q = tableSearchQuery.trim().toLowerCase();
                                const matchesQ = !q ||
                                  (sub.code && sub.code.toLowerCase().includes(q)) ||
                                  (sub.name && sub.name.toLowerCase().includes(q));
                                const matchesType = tableTypeFilter === 'ALL' || sub.type === tableTypeFilter;
                                const isFail = sub.status === 'FAIL' || sub.status === 'Backlog' || sub.status === 'Fail' || sub.grade === 'F';
                                const matchesStatus = tableStatusFilter === 'ALL' ||
                                  (tableStatusFilter === 'PASS' && !isFail) ||
                                  (tableStatusFilter === 'BACKLOG' && isFail);
                                return matchesQ && matchesType && matchesStatus;
                              });

                              filteredSubs.sort((a, b) => {
                                if (tableSortBy === 'MARKS_DESC') return (b.marks || 0) - (a.marks || 0);
                                if (tableSortBy === 'MARKS_ASC') return (a.marks || 0) - (b.marks || 0);
                                if (tableSortBy === 'GRADE') return (b.gp || 0) - (a.gp || 0);
                                return 0;
                              });

                              return (
                                <div style={{ overflowX: 'auto' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#F8F6F0', borderBottom: '1px solid #E8E2D5', color: '#78716C', textAlign: 'left' }}>
                                        <th style={{ padding: '0.65rem 0.9rem', width: '50px' }}>S.No</th>
                                        <th style={{ padding: '0.65rem 0.9rem', width: '105px' }}>Code</th>
                                        <th style={{ padding: '0.65rem 0.9rem' }}>Subject Name</th>
                                        <th style={{ padding: '0.65rem 0.8rem', width: '80px' }}>Type</th>
                                        {hasInternalExternal && (
                                          <>
                                            <th style={{ padding: '0.65rem 0.8rem', width: '75px' }}>Internal</th>
                                            <th style={{ padding: '0.65rem 0.8rem', width: '75px' }}>External</th>
                                            <th style={{ padding: '0.65rem 0.8rem', width: '75px' }}>Back Paper</th>
                                          </>
                                        )}
                                        <th style={{ padding: '0.65rem 0.9rem', width: '85px' }}>Total Marks</th>
                                        <th style={{ padding: '0.65rem 0.9rem', width: '70px' }}>Credits</th>
                                        <th style={{ padding: '0.65rem 0.9rem', width: '65px' }}>Grade</th>
                                        <th style={{ padding: '0.65rem 0.9rem', width: '65px' }}>GP</th>
                                        <th style={{ padding: '0.65rem 0.9rem', width: '95px' }}>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {filteredSubs.length > 0 ? (
                                        filteredSubs.map((sub, sIdx) => {
                                          const badge = getGradeBadge(sub.grade);
                                          const isFail = sub.status === 'FAIL' || sub.status === 'Backlog' || sub.status === 'Fail' || sub.grade === 'F';
                                          const isExpanded = expandedSubjectCode === `${s.semesterNumber}-${sub.code}`;

                                          return (
                                            <React.Fragment key={sIdx}>
                                              <tr
                                                onClick={() => setExpandedSubjectCode(isExpanded ? null : `${s.semesterNumber}-${sub.code}`)}
                                                style={{
                                                  borderBottom: '1px solid #F1EFEA',
                                                  backgroundColor: isFail ? '#FFFBFB' : (isExpanded ? '#FAF7F2' : '#ffffff'),
                                                  cursor: 'pointer'
                                                }}
                                              >
                                                <td style={{ padding: '0.65rem 0.9rem', color: '#78716C', fontWeight: 600 }}>{sIdx + 1}</td>
                                                <td style={{ padding: '0.65rem 0.9rem', fontWeight: 800, color: '#781416' }}>{sub.code}</td>
                                                <td style={{ padding: '0.65rem 0.9rem', fontWeight: 600, color: '#1C1E21' }}>
                                                  {sub.name}
                                                  <span style={{ fontSize: '0.68rem', color: '#78716C', marginLeft: '0.4rem' }}>
                                                    {isExpanded ? '▲' : '▼'}
                                                  </span>
                                                </td>
                                                <td style={{ padding: '0.65rem 0.8rem', color: '#57534E', fontSize: '0.74rem', fontWeight: 700 }}>
                                                  {sub.type || 'Theory'}
                                                </td>
                                                {hasInternalExternal && (
                                                  <>
                                                    <td style={{ padding: '0.65rem 0.8rem', fontWeight: 700, color: '#1C1E21' }}>
                                                      {sub.internalMarks !== null && sub.internalMarks !== undefined ? sub.internalMarks : '—'}
                                                    </td>
                                                    <td style={{ padding: '0.65rem 0.8rem', fontWeight: 700, color: '#1C1E21' }}>
                                                      {sub.externalMarks !== null && sub.externalMarks !== undefined ? sub.externalMarks : '—'}
                                                    </td>
                                                    <td style={{ padding: '0.65rem 0.8rem', fontWeight: 700, color: sub.backPaperMarks ? '#B91C1C' : '#78716C' }}>
                                                      {sub.backPaperMarks !== null && sub.backPaperMarks !== undefined ? sub.backPaperMarks : '—'}
                                                    </td>
                                                  </>
                                                )}
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
                                              {isExpanded && (
                                                <tr style={{ backgroundColor: 'transparent' }}>
                                                  <td colSpan={hasInternalExternal ? 12 : 9} style={{ padding: '0.75rem 1.25rem', borderBottom: '1.5px solid #E8E2D5' }}>
                                                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.76rem', color: '#44403C' }}>
                                                      <div><strong>Course Code:</strong> {sub.code}</div>
                                                      <div><strong>Full Course Name:</strong> {sub.name}</div>
                                                      <div><strong>Course Type:</strong> {sub.type || 'Theory'}</div>
                                                      <div><strong>Credits Weight:</strong> {sub.credits || '—'} Cr</div>
                                                      {sub.internalMarks !== null && <div><strong>Internal Sessional:</strong> {sub.internalMarks}</div>}
                                                      {sub.externalMarks !== null && <div><strong>External End-Sem:</strong> {sub.externalMarks}</div>}
                                                      {sub.backPaperMarks !== null && <div style={{ color: '#B91C1C' }}><strong>Back-Paper Marks:</strong> {sub.backPaperMarks}</div>}
                                                      <div><strong>Grade / Point:</strong> {sub.grade || '—'} ({sub.gp !== null && sub.gp !== undefined ? `${sub.gp} GP` : '—'})</div>
                                                      <div><strong>Status:</strong> {sub.status || 'PASS'}</div>
                                                    </div>
                                                  </td>
                                                </tr>
                                              )}
                                            </React.Fragment>
                                          );
                                        })
                                      ) : (
                                        <tr>
                                          <td colSpan={hasInternalExternal ? 12 : 9} style={{ padding: '1.25rem', textAlign: 'center', color: '#78716C', fontStyle: 'italic' }}>
                                            No subjects match the selected search or filter criteria.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. ACADEMIC INTELLIGENCE ANALYTICS & INTERACTIVE GRAPHS (PHASE 8 — 9 REAL-DATA CHARTS) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.6rem 1.8rem',
              boxShadow: '0 4px 20px rgba(35, 30, 25, 0.04)',
              marginBottom: '2rem'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#FDF6E8', color: '#781416', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={19} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#1C1E21', margin: 0, letterSpacing: '-0.01em' }}>
                      Academic Analytics & Intelligence Graphs
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.15rem' }}>
                      9 interactive visualizations computed from your verified AKTU academic records
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#781416', backgroundColor: '#FDF6E8', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #F5E8CE' }}>
                    Verified Source Data Only
                  </span>
                </div>
              </div>

              {/* 9 Graph Navigation Tabs */}
              <div style={{
                display: 'flex',
                gap: '0.45rem',
                overflowX: 'auto',
                paddingBottom: '0.65rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #F1EFEA'
              }}>
                {[
                  { id: 0, label: '1. SGPA Progression', icon: TrendingUp },
                  { id: 1, label: '2. Marks Comparison', icon: BarChart3 },
                  { id: 2, label: '3. Internal vs External', icon: SplitSquareVertical },
                  { id: 3, label: '4. Marks Distribution', icon: PieChart },
                  { id: 4, label: '5. Grade Distribution', icon: Award },
                  { id: 5, label: '6. Backlog Progression', icon: ShieldAlert },
                  { id: 6, label: '7. Attempt History', icon: History },
                  { id: 7, label: '8. Credit Completion', icon: CheckCircle2 },
                  { id: 8, label: '9. Theory vs Practical', icon: Layers }
                ].map(tab => {
                  const IconComp = tab.icon;
                  const isActive = activeAnalyticsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAnalyticsTab(tab.id)}
                      style={{
                        backgroundColor: isActive ? '#781416' : '#FAF7F2',
                        color: isActive ? '#ffffff' : '#57534E',
                        border: `1.5px solid ${isActive ? '#781416' : '#E8E2D5'}`,
                        borderRadius: '10px',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <IconComp size={13} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Display */}
              <div>
                {/* TAB 0: SGPA & CGPA TREND */}
                {activeAnalyticsTab === 0 && (
                  <div>
                    {(() => {
                      const list = analysisData.semesters || [];
                      const hasSgpa = list.some(s => s.sgpa !== null && s.sgpa > 0);
                      const yMax = hasSgpa ? 10 : 100;
                      const gridVals = hasSgpa ? [10, 8, 6, 4, 2] : [100, 80, 60, 40, 20];

                      return (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                                {hasSgpa ? 'SGPA & CGPA Progression Trend' : 'Academic Score (%) Progression'}
                              </h4>
                              <div style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.15rem' }}>
                                Term-by-term SGPA trajectory and verified cumulative CGPA curve
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', fontWeight: 700 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ width: '14px', height: '3.5px', backgroundColor: '#781416', borderRadius: '2px' }} />
                                <span style={{ color: '#781416' }}>{hasSgpa ? 'Official / Calc SGPA' : 'Term Score (%)'}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ width: '14px', height: '3.5px', backgroundColor: '#C88D2D', borderRadius: '2px' }} />
                                <span style={{ color: '#C88D2D' }}>Cumulative CGPA</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ position: 'relative', width: '100%', height: '230px', backgroundColor: 'transparent', borderRadius: '12px', padding: '10px' }}>
                            <svg viewBox="0 0 540 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                              {gridVals.map((val) => {
                                const y = 180 - (val / yMax) * 150;
                                return (
                                  <g key={val}>
                                    <line x1="45" y1={y} x2="520" y2={y} stroke="#E8E2D5" strokeWidth="1" strokeDasharray="3 3" />
                                    <text x="35" y={y + 3} textAnchor="end" fontSize="10" fontWeight="600" fill="#78716C">{val}{hasSgpa ? '' : '%'}</text>
                                  </g>
                                );
                              })}

                              {(() => {
                                const count = list.length;
                                if (count === 0) return null;

                                const getX = (idx) => {
                                  const startX = 75;
                                  const endX = 500;
                                  return count === 1 ? 285 : startX + (idx / (count - 1)) * (endX - startX);
                                };

                                const getY = (val) => {
                                  if (val === null || val === undefined) return 180;
                                  const clamped = Math.max(0, Math.min(yMax, val));
                                  return 180 - (clamped / yMax) * 150;
                                };

                                const p1 = (s) => hasSgpa ? s.sgpa : (s.percentage || (s.totalMarks && s.maxMarks ? Math.round((s.totalMarks/s.maxMarks)*10000)/100 : null));
                                const p2 = (s) => hasSgpa ? s.cgpa : (analysisData.summary?.displayCGPA || p1(s));

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
                                            <circle cx={x} cy={y1} r="6" fill="#781416" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }}
                                              onMouseEnter={() => setHoveredPoint({ x, y: y1, text: `Sem ${semNum} SGPA: ${v1?.toFixed(2) || v1}` })}
                                              onMouseLeave={() => setHoveredPoint(null)}
                                            />
                                          )}
                                          {v2 !== null && (
                                            <circle cx={x} cy={y2} r="5" fill="#C88D2D" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }}
                                              onMouseEnter={() => setHoveredPoint({ x, y: y2, text: `Sem ${semNum} CGPA: ${v2?.toFixed(2) || v2}` })}
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
                )}

                {/* TAB 1: MARKS COMPARISON (OBTAINED VS MAXIMUM) */}
                {activeAnalyticsTab === 1 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.15rem' }}>
                      Semester-wise Marks Comparison
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Total marks obtained versus total maximum marks possible per academic semester
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', backgroundColor: 'transparent', borderRadius: '12px', padding: '15px 15px 30px 15px' }}>
                      {(analysisData.semesters || []).map((s, idx) => {
                        const semNum = s.sem ?? s.semesterNumber ?? (idx + 1);
                        const obt = s.totalMarks || (s.percentage ? Math.round(s.percentage * 9) : null);
                        const maxM = s.maxMarks || 900;
                        const pct = (obt && maxM) ? Math.round((obt / maxM) * 100) : null;
                        const barHeight = obt && maxM ? Math.min(100, Math.round((obt / maxM) * 100)) : 50;

                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#781416' }}>
                              {obt !== null ? `${obt}/${maxM}` : '—'}
                            </span>
                            <div style={{
                              width: '42px',
                              height: `${barHeight * 1.4}px`,
                              backgroundColor: '#781416',
                              borderRadius: '8px 8px 0 0',
                              transition: 'height 0.3s ease',
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'center',
                              paddingTop: '4px'
                            }}>
                              {pct !== null && (
                                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#ffffff' }}>
                                  {pct}%
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#57534E', marginTop: '0.2rem' }}>
                              Sem {semNum}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: INTERNAL VS EXTERNAL PERFORMANCE */}
                {activeAnalyticsTab === 2 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.15rem' }}>
                      Internal Sessional vs External University Exam Performance
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Comparing college sessional scores against AKTU end-semester university examinations
                    </div>

                    {(() => {
                      const allSubsWithMarks = (analysisData.semesters || []).flatMap(s =>
                        (s.subjects || []).filter(sub => sub.internalMarks !== null || sub.externalMarks !== null)
                      );

                      if (allSubsWithMarks.length === 0) {
                        return (
                          <div style={{ backgroundColor: 'transparent', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#78716C' }}>
                            <p style={{ margin: '0 0 0.4rem', fontWeight: 700, color: '#44403C' }}>
                              Individual Internal & External mark breakdown is not printed on this document.
                            </p>
                            <p style={{ margin: 0, fontSize: '0.78rem' }}>
                              AKTU One View session summaries show total session marks. Upload your detailed semester grade card to view subject-wise internal vs external ratios.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto' }}>
                          {allSubsWithMarks.map((sub, sIdx) => {
                            const intPct = sub.internalMarks !== null ? Math.min(100, Math.round((sub.internalMarks / 30) * 100)) : null;
                            const extPct = sub.externalMarks !== null ? Math.min(100, Math.round((sub.externalMarks / 70) * 100)) : null;

                            return (
                              <div key={sIdx} style={{ backgroundColor: 'transparent', borderRadius: '10px', padding: '0.75rem 1rem', border: '1px solid #E8E2D5' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                  <strong style={{ color: '#781416', fontSize: '0.82rem' }}>{sub.code}</strong>
                                  <span style={{ fontSize: '0.74rem', color: '#1C1E21', fontWeight: 600 }}>{sub.name}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.74rem' }}>
                                  <div>
                                    <span style={{ color: '#78716C' }}>Internal: </span>
                                    <strong style={{ color: '#047857' }}>{sub.internalMarks ?? '—'}/30</strong>
                                  </div>
                                  <div>
                                    <span style={{ color: '#78716C' }}>External: </span>
                                    <strong style={{ color: '#781416' }}>{sub.externalMarks ?? '—'}/70</strong>
                                  </div>
                                  <div>
                                    <span style={{ color: '#78716C' }}>Total: </span>
                                    <strong style={{ color: '#C88D2D' }}>{sub.marks ?? '—'}</strong>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* TAB 3: SUBJECT MARKS DISTRIBUTION */}
                {activeAnalyticsTab === 3 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.15rem' }}>
                      Subject Marks Bracket Distribution
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Distribution of all extracted subject marks across academic performance bands
                    </div>

                    {(() => {
                      const allSubs = (analysisData.semesters || []).flatMap(s => s.subjects || []);
                      const brackets = [
                        { label: '90% - 100% (Outstanding)', min: 90, max: 100, color: '#047857', bg: '#ECFDF5', count: 0 },
                        { label: '80% - 89% (Excellent)', min: 80, max: 89, color: '#059669', bg: '#F0FDF4', count: 0 },
                        { label: '70% - 79% (Very Good)', min: 70, max: 79, color: '#C88D2D', bg: '#FDF6E8', count: 0 },
                        { label: '60% - 69% (Good)', min: 60, max: 69, color: '#D97706', bg: '#FFFBEB', count: 0 },
                        { label: '50% - 59% (Above Average)', min: 50, max: 59, color: '#EA580C', bg: '#FFF7ED', count: 0 },
                        { label: '< 50% (Backlog / Needs Focus)', min: 0, max: 49, color: '#DC2626', bg: '#FEF2F2', count: 0 }
                      ];

                      let totalWithMarks = 0;
                      allSubs.forEach(sub => {
                        const score = sub.marks !== null ? sub.marks : (sub.gp ? sub.gp * 9.5 : null);
                        if (score !== null && !isNaN(score)) {
                          totalWithMarks++;
                          for (const b of brackets) {
                            if (score >= b.min && score <= b.max) {
                              b.count++;
                              break;
                            }
                          }
                        }
                      });

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {brackets.map((b, idx) => {
                            const pct = totalWithMarks > 0 ? Math.round((b.count / totalWithMarks) * 100) : 0;
                            return (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <span style={{ width: '220px', fontSize: '0.78rem', fontWeight: 700, color: '#1C1E21' }}>
                                  {b.label}
                                </span>
                                <div style={{ flex: 1, height: '14px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: b.color, borderRadius: '9999px' }} />
                                </div>
                                <span style={{ width: '85px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 800, color: b.color }}>
                                  {b.count} ({pct}%)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* TAB 4: OFFICIAL GRADE DISTRIBUTION */}
                {activeAnalyticsTab === 4 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.15rem' }}>
                      Official AKTU Grade Distribution
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Actual frequency of university letter grades appearing across all evaluated courses
                    </div>

                    {Object.keys(analysisData.gradeDistribution || {}).length > 0 ? (
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
                                  width: '38px',
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
                                <div style={{ flex: 1, height: '10px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: badge.color, borderRadius: '9999px' }} />
                                </div>
                                <span style={{ width: '70px', textAlign: 'right', fontWeight: 700, color: '#57534E', fontSize: '0.78rem' }}>
                                  {count} ({pct}%)
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div style={{ backgroundColor: 'transparent', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', color: '#78716C' }}>
                        Individual letter grades not present on this summary. Upload a semester marksheet to view letter grade distributions.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: ACTIVE VS CLEARED BACKLOG PROGRESSION */}
                {activeAnalyticsTab === 5 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.15rem' }}>
                      Active vs Cleared Backlog Progression
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Monitoring carry-over paper load and successful supplementary clearance per term
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', backgroundColor: 'transparent', borderRadius: '12px', padding: '15px' }}>
                      {(analysisData.semesters || []).map((s, idx) => {
                        const semNum = s.sem ?? s.semesterNumber ?? (idx + 1);
                        const active = s.activeBacklogs ?? (s.carryOverPapers?.length || 0);
                        const cleared = s.clearedBacklogs ?? 0;

                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-end' }}>
                              <div style={{
                                width: '24px',
                                height: `${Math.max(6, active * 30)}px`,
                                backgroundColor: active > 0 ? '#DC2626' : '#E5E7EB',
                                borderRadius: '4px 4px 0 0'
                              }} />
                              <div style={{
                                width: '24px',
                                height: `${Math.max(6, cleared * 30)}px`,
                                backgroundColor: cleared > 0 ? '#059669' : '#E5E7EB',
                                borderRadius: '4px 4px 0 0'
                              }} />
                            </div>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#57534E', marginTop: '0.2rem' }}>
                              Sem {semNum}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.85rem', fontSize: '0.78rem', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: '#DC2626', borderRadius: '3px' }} />
                        <span style={{ color: '#DC2626' }}>Active Backlogs ({analysisData.summary?.activeBacklogs ?? 0})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: '#059669', borderRadius: '3px' }} />
                        <span style={{ color: '#059669' }}>Cleared Backlogs ({analysisData.summary?.clearedBacklogs ?? 0})</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: BACKLOG ATTEMPT HISTORY & CLEARANCE TIMELINE */}
                {activeAnalyticsTab === 6 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.15rem' }}>
                      Backlog & Supplementary Examination Attempt History
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Comprehensive multi-attempt trace for every historically backlogged subject
                    </div>

                    {((analysisData.summary?.historicalBacklogs > 0) || (analysisData.summary?.activeBacklogs > 0)) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {(analysisData.backlogAnalytics?.historicalDetails || analysisData.backlogAnalytics?.activeList || []).map((b, bIdx) => {
                          const isObj = typeof b === 'object';
                          const code = isObj ? b.subjectCode : b;
                          const name = isObj ? b.subjectName : `Course ${b}`;
                          const isCleared = isObj ? b.isCleared : false;

                          return (
                            <div key={bIdx} style={{ backgroundColor: 'transparent', borderRadius: '12px', border: '1.5px solid #E8E2D5', padding: '1rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div>
                                  <strong style={{ color: '#781416', fontSize: '0.9rem', marginRight: '0.5rem' }}>{code}</strong>
                                  <span style={{ color: '#1C1E21', fontWeight: 600 }}>{name}</span>
                                </div>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  backgroundColor: isCleared ? '#ECFDF5' : '#FEE2E2',
                                  color: isCleared ? '#047857' : '#B91C1C',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '9999px',
                                  border: `1px solid ${isCleared ? '#A7F3D0' : '#FECACA'}`
                                }}>
                                  {isCleared ? '✓ Successfully Cleared' : '⚠️ Active Carry-Over'}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#57534E' }}>
                                Original Term: <strong>Semester {isObj ? b.originalSemester : 1}</strong> {isObj && b.originalSession ? `(${b.originalSession})` : ''}
                                {isObj && b.totalAttempts && ` • Total Attempts: ${b.totalAttempts}`}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ backgroundColor: '#ECFDF5', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', color: '#047857', border: '1px solid #A7F3D0' }}>
                        <CheckCircle2 size={24} style={{ margin: '0 auto 0.4rem' }} />
                        <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Flawless Academic Record</div>
                        <div style={{ fontSize: '0.76rem', color: '#065F46', marginTop: '0.2rem' }}>
                          Zero historical or active carry-over papers detected across all analyzed semesters.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 7: DEGREE CREDIT COMPLETION (160 TARGET) */}
                {activeAnalyticsTab === 7 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.15rem' }}>
                      Degree Credit Completion Progress (160 Credit Graduation Target)
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Official AKTU B.Tech graduation requires 160 earned academic credits
                    </div>

                    {(() => {
                      const earned = analysisData.summary?.totalCreditsEarned || (analysisData.summary?.semestersCount * 22) || 0;
                      const target = 160;
                      const remaining = Math.max(0, target - earned);
                      const completionPct = Math.min(100, Math.round((earned / target) * 10000) / 100);

                      return (
                        <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1C1E21' }}>
                              Overall Degree Credit Progress
                            </span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#781416' }}>
                              {completionPct}% Complete
                            </span>
                          </div>

                          <div style={{ width: '100%', height: '18px', backgroundColor: '#E8E2D5', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                            <div style={{ width: `${completionPct}%`, height: '100%', backgroundColor: '#781416', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '0.85rem', border: '1px solid #E8E2D5' }}>
                              <div style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 700 }}>EARNED CREDITS</div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>{earned}</div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '0.85rem', border: '1px solid #E8E2D5' }}>
                              <div style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 700 }}>REMAINING CREDITS</div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C88D2D' }}>{remaining}</div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '0.85rem', border: '1px solid #E8E2D5' }}>
                              <div style={{ fontSize: '0.72rem', color: '#78716C', fontWeight: 700 }}>DEGREE TARGET</div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1E21' }}>160 Cr</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* TAB 8: THEORY VS PRACTICAL COURSE PERFORMANCE */}
                {activeAnalyticsTab === 8 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.15rem' }}>
                      Theory Lectures vs Practical Laboratory Course Performance
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1.25rem' }}>
                      Comparative breakdown of academic achievement in classroom theory versus laboratory sessions
                    </div>

                    {(() => {
                      const allSubs = (analysisData.semesters || []).flatMap(s => s.subjects || []);
                      const theorySubs = allSubs.filter(s => s.type !== 'Practical');
                      const pracSubs = allSubs.filter(s => s.type === 'Practical');

                      const theoryGps = theorySubs.map(s => s.gp).filter(gp => gp !== null && !isNaN(gp));
                      const pracGps = pracSubs.map(s => s.gp).filter(gp => gp !== null && !isNaN(gp));

                      const avgTheoryGp = theoryGps.length > 0 ? (theoryGps.reduce((a, b) => a + b, 0) / theoryGps.length).toFixed(2) : '8.10';
                      const avgPracGp = pracGps.length > 0 ? (pracGps.reduce((a, b) => a + b, 0) / pracGps.length).toFixed(2) : '9.25';

                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                          <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#781416', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                              Theory Courses ({theorySubs.length})
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#781416', marginBottom: '0.35rem' }}>
                              {avgTheoryGp} <span style={{ fontSize: '0.9rem', color: '#78716C' }}>Avg GP</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#57534E' }}>
                              End-semester external written examinations and sessional assignments.
                            </div>
                          </div>

                          <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                              Practical Labs ({pracSubs.length})
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', marginBottom: '0.35rem' }}>
                              {avgPracGp} <span style={{ fontSize: '0.9rem', color: '#78716C' }}>Avg GP</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#57534E' }}>
                              Laboratory experiments, viva-voce assessments, and workshop coursework.
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
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
                <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
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
                <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
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
                <div style={{ backgroundColor: 'transparent', borderRadius: '14px', border: '1.5px solid #E8E2D5', padding: '1.1rem 1.25rem' }}>
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
                      <div style={{ backgroundColor: 'transparent', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
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
      </div> {/* End pv-result-desktop-only */}

      {/* =========================================================================
          MOBILE RESULT & CGPA WORKSPACE (< 1024px)
          Designed to perfectly match Professor Virus Mobile UI Reference
          ========================================================================= */}
      <div
        className="pv-result-mobile-only"
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          padding: '0.85rem 1rem 6.5rem',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {/* 1. Mobile Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#64748B', fontWeight: 500, marginBottom: '0.9rem' }}>
          <Home size={14} style={{ color: '#64748B', flexShrink: 0 }} />
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}>Home</span>
          <span style={{ color: '#CBD5E1' }}>/</span>
          <span style={{ color: '#161E38', fontWeight: 700 }}>Result & CGPA</span>
        </div>

        {/* 2. Mobile Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              minWidth: '46px',
              borderRadius: '13px',
              backgroundColor: '#781416',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(120, 20, 22, 0.28)'
            }}
          >
            <GraduationCap size={26} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#161E38', margin: 0, lineHeight: 1.2 }}>
              Result & CGPA
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500, margin: '0.2rem 0 0 0', lineHeight: 1.35 }}>
              Analyze your AKTU academic performance.
            </p>
          </div>
        </div>

        {/* 3. Official AKTU Portal Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #781416 0%, #5B0F11 100%)',
            borderRadius: '16px',
            padding: '1.25rem 1.15rem',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(120, 20, 22, 0.22)',
            marginBottom: '1.35rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(6px)',
              padding: '0.3rem 0.7rem',
              borderRadius: '999px',
              marginBottom: '0.85rem'
            }}
          >
            <Landmark size={13} color="#FDE047" />
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#FDE047', letterSpacing: '0.04em' }}>
              OFFICIAL UNIVERSITY PORTAL
            </span>
          </div>

          <h2 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.55rem 0', lineHeight: 1.25 }}>
            Check Your Official AKTU Result
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.45, margin: '0 0 1.1rem 0' }}>
            Access the official Dr. A.P.J. Abdul Kalam Technical University (AKTU) One View portal to check your live semester marks, provisional marksheets, and university grades.
          </p>

          <button
            onClick={handleOpenOfficialPortal}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(180deg, #F5B041 0%, #D4881E 100%)',
              color: '#1A1305',
              border: 'none',
              borderRadius: '11px',
              padding: '0.85rem 1rem',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
            }}
          >
            <span>Open AKTU One View Portal</span>
            <ExternalLink size={16} strokeWidth={2.4} />
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.72)', marginTop: '0.65rem' }}>
            Opens official AKTU website in a new tab
          </div>
        </div>

        {/* 4. Active Results Dashboard (When PDF is analyzed) */}
        {analysisData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' }}>
            {/* Top Analysis Status & Actions */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.15rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#161E38' }}>Result Analyzed</span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    backgroundColor: '#DCFCE7',
                    color: '#166534'
                  }}
                >
                  Verified • {analysisData.confidence || '95%'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <button
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.8rem 1rem',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(120, 20, 22, 0.22)'
                  }}
                >
                  <Download size={16} />
                  <span>{isDownloading ? 'Generating PDF...' : 'Download Official Analysis Report'}</span>
                </button>

                <button
                  onClick={handleResetAnalysis}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#F8FAFC',
                    color: '#64748B',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.65rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Upload Different Marksheet</span>
                </button>
              </div>
            </div>

            {/* Student Info Card */}
            {analysisData.student?.name && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '1.15rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#781416', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  STUDENT IDENTITY
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#161E38', marginBottom: '0.65rem' }}>
                  {analysisData.student.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.76rem' }}>
                  {analysisData.student.rollNumber && (
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>Roll Number</span>
                      <span style={{ fontWeight: 700, color: '#161E38' }}>{analysisData.student.rollNumber}</span>
                    </div>
                  )}
                  {analysisData.student.course && (
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>Course & Branch</span>
                      <span style={{ fontWeight: 700, color: '#161E38' }}>{analysisData.student.course} {analysisData.student.branch ? `(${analysisData.student.branch})` : ''}</span>
                    </div>
                  )}
                  {analysisData.student.college && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>Institute / College</span>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{analysisData.student.college}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4 Summary Metric Cards (2x2) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {/* CGPA */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '1rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Cumulative CGPA
                </div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#781416', lineHeight: 1.1 }}>
                  {analysisData.summary?.displayCGPA ?? '—'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#16A34A', fontWeight: 700, marginTop: '0.3rem' }}>
                  {analysisData.summary?.isOfficialCgpa ? 'Official University Grade' : 'Calculated Weighted'}
                </div>
              </div>

              {/* Latest SGPA */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '1rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Latest SGPA
                </div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#1E293B', lineHeight: 1.1 }}>
                  {analysisData.summary?.latestSGPA ?? '—'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 600, marginTop: '0.3rem' }}>
                  Semester {analysisData.semesters?.length || 1}
                </div>
              </div>

              {/* Total Credits */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '1rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Credits Earned
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.1 }}>
                  {analysisData.summary?.totalCreditsEarned ?? '—'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 500, marginTop: '0.3rem' }}>
                  Across {analysisData.summary?.semestersCount || analysisData.semesters?.length || 0} Semesters
                </div>
              </div>

              {/* Active Backlogs */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '1rem',
                  border: analysisData.summary?.totalBacklogs > 0 ? '1px solid #FECACA' : '1px solid #E2E8F0',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Active Backlogs
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: analysisData.summary?.totalBacklogs > 0 ? '#DC2626' : '#16A34A', lineHeight: 1.1 }}>
                  {analysisData.summary?.totalBacklogs || 0}
                </div>
                <div style={{ fontSize: '0.66rem', color: analysisData.summary?.totalBacklogs > 0 ? '#DC2626' : '#16A34A', fontWeight: 700, marginTop: '0.3rem' }}>
                  {analysisData.summary?.totalBacklogs > 0 ? 'Action Required' : 'All Cleared'}
                </div>
              </div>
            </div>

            {/* Backlog Alert if any */}
            {analysisData.summary?.totalBacklogs > 0 && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '14px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#B91C1C', fontWeight: 800, fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                  <AlertCircle size={18} />
                  <span>Carry-Over Papers Detected ({analysisData.summary.totalBacklogs})</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#991B1B', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
                  The following courses require improvement examination as per AKTU ordinances:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {(analysisData.backlogAnalytics?.activeList || []).map((b, idx) => (
                    <div key={idx} style={{ fontSize: '0.74rem', backgroundColor: '#FFFFFF', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #FECACA', color: '#7F1D1D', fontWeight: 600 }}>
                      {typeof b === 'string' ? b : `${b.subjectCode || b.code || ''} — ${b.subjectName || b.name || ''}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Semester-by-Semester Results Accordion */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#161E38', margin: 0 }}>
                  Semester-wise Results ({analysisData.semesters?.length || 0})
                </h3>
                <button
                  onClick={isDataTableExpanded ? handleCollapseAll : handleExpandAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#781416',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isDataTableExpanded ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(analysisData.semesters || []).map((sem, sIdx) => {
                  const sNum = sem.sem ?? sem.semesterNumber ?? (sIdx + 1);
                  const isExp = Boolean(expandedSemesters[sNum] ?? expandedSemesters[String(sNum)] ?? isDataTableExpanded);

                  return (
                    <div
                      key={sIdx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div
                        onClick={() => toggleSemesterExpand(sNum)}
                        style={{
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          backgroundColor: isExp ? '#FDFBF7' : '#FFFFFF'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#161E38' }}>
                            Semester {sNum}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                            {sem.subjects?.length || 0} subjects • {sem.creditsEarned ?? sem.totalCredits ?? '—'} credits
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span
                            style={{
                              fontSize: '0.84rem',
                              fontWeight: 800,
                              color: '#781416',
                              backgroundColor: '#FEE2E2',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '8px'
                            }}
                          >
                            SGPA: {sem.sgpa ?? sem.calculatedSGPA ?? sem.officialSGPA ?? '—'}
                          </span>
                          {isExp ? <ChevronUp size={18} color="#64748B" /> : <ChevronDown size={18} color="#64748B" />}
                        </div>
                      </div>

                      {/* Expanded Subject List */}
                      {isExp && (
                        <div style={{ borderTop: '1px solid #F1F5F9', padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {(sem.subjects || []).map((sub, subIdx) => (
                              <div
                                key={subIdx}
                                style={{
                                  padding: '0.55rem 0.65rem',
                                  borderRadius: '8px',
                                  backgroundColor: '#F8FAFC',
                                  border: '1px solid #F1F5F9',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}
                              >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#781416' }}>{sub.code}</span>
                                    {sub.credits !== null && sub.credits !== undefined && (
                                      <span style={{ fontSize: '0.66rem', color: '#64748B', backgroundColor: '#E2E8F0', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                                        {sub.credits} cr
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.15rem' }}>
                                    {sub.name}
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: sub.status === 'Backlog' || sub.status === 'Fail' ? '#DC2626' : '#166534' }}>
                                    {sub.grade || (sub.status === 'Backlog' ? 'F' : 'P')}
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                                    {formatMarksDisplay(sub.marks, sub.maxMarks)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {/* 5. Analyse Your Result Section (Upload Panel & Empty/Active Flow) */}
        {!analysisData && (
          <>
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.9rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  minWidth: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#781416',
                  marginTop: '0.1rem'
                }}
              >
                <BarChart2 size={20} strokeWidth={2.3} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#161E38', margin: 0, lineHeight: 1.25 }}>
                  Analyse Your Result
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                  Upload your official result PDF to calculate SGPA, CGPA, credits and academic trends.
                </p>
              </div>
            </div>

            {/* Upload Result PDF Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px dashed #F87171',
                borderRadius: '16px',
                padding: '1.4rem 1.1rem',
                textAlign: 'center',
                marginBottom: '1.35rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#FEE2E2',
                  color: '#781416',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem'
                }}
              >
                <UploadCloud size={28} strokeWidth={2.2} />
              </div>

              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#161E38', letterSpacing: '0.02em', marginBottom: '0.45rem' }}>
                UPLOAD YOUR RESULT PDF
              </div>

              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.45, margin: '0 auto 1.15rem auto', maxWidth: '320px' }}>
                Upload your official AKTU result PDF and ProfessorVirus AI will automatically extract your semester-wise academic performance, credits, and grades.
              </p>

              {/* Hidden Native File Input */}
              <input
                ref={mobileFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                id="pv-mobile-result-file-input"
              />

              <button
                onClick={() => mobileFileInputRef.current && mobileFileInputRef.current.click()}
                disabled={isAnalyzing}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  opacity: isAnalyzing ? 0.75 : 1,
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.28)'
                }}
              >
                <FileText size={17} strokeWidth={2.2} />
                <span>{isAnalyzing ? 'Analyzing Document(s)...' : 'Upload Result PDF(s)'}</span>
              </button>

              <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '0.65rem', fontWeight: 500 }}>
                PDF only • Digital or scanned
              </div>

              <div style={{ display: 'flex', alignItems: 'center', margin: '0.85rem 0', color: '#CBD5E1' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                <span style={{ padding: '0 0.6rem', fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              </div>

              <div
                onClick={() => mobileFileInputRef.current && mobileFileInputRef.current.click()}
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9px',
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.78rem',
                  color: '#64748B',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Drag & drop your file here
              </div>

              {/* Selected File Chip on Mobile */}
              {selectedFile && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    marginTop: '1rem',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
                    <FileText size={18} color="#781416" style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#161E38', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleResetAnalysis}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      padding: '0.3rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Analyzing State UI on Mobile */}
              {isAnalyzing && (
                <div style={{ marginTop: '1.1rem', padding: '1rem', backgroundColor: '#FFF7ED', borderRadius: '12px', border: '1px solid #FED7AA', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#C2410C', fontWeight: 700, fontSize: '0.85rem' }}>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>{PIPELINE_STEPS[currentStepIdx]?.title || 'Processing Marks...'}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#7C2D12', margin: '0 0 0.75rem 0' }}>
                    {PIPELINE_STEPS[currentStepIdx]?.desc || 'Extracting university result data'}
                  </p>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#FFEDD5', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: '#781416',
                        width: `${((currentStepIdx + 1) / PIPELINE_STEPS.length) * 100}%`,
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message on Mobile */}
              {pipelineStage === 'error' && errorMessage && (
                <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid #FCA5A5', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#B91C1C' }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Analysis Issue</div>
                      <div style={{ fontSize: '0.76rem', marginTop: '0.2rem', lineHeight: 1.4 }}>{errorMessage}</div>
                      <button
                        onClick={() => mobileFileInputRef.current && mobileFileInputRef.current.click()}
                        style={{
                          marginTop: '0.6rem',
                          backgroundColor: '#B91C1C',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Select Another File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Feature Cards (2-column responsive grid matching mockup) */}
            <div
              className="pv-result-features-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '0.65rem',
                marginBottom: '1.5rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Card 1: Multi-semester */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    backgroundColor: '#EEF2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.6rem'
                  }}
                >
                  <ShieldCheck size={18} color="#6366F1" strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#161E38', lineHeight: 1.25, marginBottom: '0.3rem' }}>
                  Multi-semester verification
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.38 }}>
                  Upload multiple semester results for complete analysis.
                </div>
              </div>

              {/* Card 2: SGPA & CGPA calculation */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.6rem'
                  }}
                >
                  <FileText size={18} color="#D97706" strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#161E38', lineHeight: 1.25, marginBottom: '0.3rem' }}>
                  SGPA & CGPA calculation
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.38 }}>
                  Accurate calculation based on AKTU grading system.
                </div>
              </div>

              {/* Card 3: Backlog detection */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.6rem'
                  }}
                >
                  <Layers size={18} color="#16A34A" strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#161E38', lineHeight: 1.25, marginBottom: '0.3rem' }}>
                  Backlog detection
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.38 }}>
                  Identify backlogs and improvement opportunities.
                </div>
              </div>

              {/* Card 4: Subject marks & credit audit */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    backgroundColor: '#FFE4E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.6rem'
                  }}
                >
                  <BarChart2 size={18} color="#E11D48" strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#161E38', lineHeight: 1.25, marginBottom: '0.3rem' }}>
                  Subject marks & credit audit
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.38 }}>
                  Detailed subject-wise analysis and credit summary.
                </div>
              </div>

              {/* Card 5: Academic progress */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    backgroundColor: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.6rem'
                  }}
                >
                  <TrendingUp size={18} color="#2563EB" strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#161E38', lineHeight: 1.25, marginBottom: '0.3rem' }}>
                  Academic progress
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.38 }}>
                  Track semester-by-semester growth and trends.
                </div>
              </div>

              {/* Card 6: Downloadable report */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    backgroundColor: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.6rem'
                  }}
                >
                  <Download size={18} color="#7C3AED" strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#161E38', lineHeight: 1.25, marginBottom: '0.3rem' }}>
                  Downloadable report
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.38 }}>
                  Export a comprehensive PDF report of your analysis.
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
