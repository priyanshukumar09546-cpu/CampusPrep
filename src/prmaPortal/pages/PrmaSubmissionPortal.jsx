import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  Github,
  Globe,
  ArrowRight,
  ExternalLink,
  Download,
  Calendar,
  Award,
  RefreshCw,
  FolderArchive,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';

export default function PrmaSubmissionPortal({ onNavigate, navigateToTab }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [activeWeekForm, setActiveWeekForm] = useState(null);

  // Form states per week
  const [formInputs, setFormInputs] = useState({});
  const [submittingWeek, setSubmittingWeek] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const navFn = onNavigate || navigateToTab;

  // Extract token from pathname e.g. /prma-tech/submit/:token
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/prma-tech\/submit\/([^/?#]+)/i) || path.match(/\/prma\/submit\/([^/?#]+)/i);
    const extractedToken = match ? match[1] : '';

    if (extractedToken) {
      setToken(extractedToken);
      fetchSubmissionDetails(extractedToken);
    } else {
      setLoading(false);
      setError('No submission token detected in the URL. Please use the unique link sent in your PRMA Tech approval email.');
    }
  }, []);

  const fetchSubmissionDetails = async (subToken) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/prma/submissions/token/${encodeURIComponent(subToken)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to retrieve submission details.');
      }
      setSubmission(data.submission);

      // Initialize form inputs with existing links if any
      const initial = {};
      (data.submission.tasks || []).forEach(t => {
        initial[t.weekNumber] = {
          githubUrl: t.githubUrl || '',
          liveUrl: t.liveUrl || '',
          studentRemarks: t.studentRemarks || '',
          files: []
        };
      });
      setFormInputs(initial);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (weekNumber, field, value) => {
    setFormInputs(prev => ({
      ...prev,
      [weekNumber]: {
        ...(prev[weekNumber] || {}),
        [field]: value
      }
    }));
  };

  const handleFileSelect = (weekNumber, e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    // Validate size (max 50MB total)
    const validFiles = [];
    for (const f of selectedFiles) {
      if (f.size > 52428800) {
        showToast(`File "${f.name}" exceeds the 50MB limit.`);
        return;
      }
      validFiles.push(f);
    }

    // Convert to Base64 dataUrl
    Promise.all(
      validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type || 'application/octet-stream',
              dataUrl: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      })
    ).then(processedFiles => {
      setFormInputs(prev => ({
        ...prev,
        [weekNumber]: {
          ...(prev[weekNumber] || {}),
          files: processedFiles
        }
      }));
    });
  };

  const handleSubmitTask = async (weekNumber) => {
    const input = formInputs[weekNumber] || {};
    const hasFiles = input.files && input.files.length > 0;
    const hasGithub = input.githubUrl && input.githubUrl.trim().length > 0;
    const hasLive = input.liveUrl && input.liveUrl.trim().length > 0;

    if (!hasFiles && !hasGithub && !hasLive) {
      showToast('Please provide at least one deliverable: project file, GitHub repo, or live demo URL.');
      return;
    }

    setSubmittingWeek(weekNumber);
    try {
      const res = await fetch(`/api/prma/submissions/token/${encodeURIComponent(token)}/submit/${weekNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: input.files || [],
          githubUrl: input.githubUrl || '',
          liveUrl: input.liveUrl || '',
          studentRemarks: input.studentRemarks || ''
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed.');
      }

      setSubmission(data.submission);
      setActiveWeekForm(null);
      showToast(`✓ Week ${weekNumber} submitted successfully! Your mentor has been notified.`);
    } catch (err) {
      showToast(`Submission Error: ${err.message}`);
    } finally {
      setSubmittingWeek(null);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Status Badge Component
  const renderStatusBadge = (task) => {
    if (task.status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 size={13} className="text-emerald-600" />
          Approved & Verified
        </span>
      );
    }
    if (task.status === 'revision_required') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle size={13} className="text-amber-600" />
          Revisions Requested
        </span>
      );
    }
    if (task.status === 'submitted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
          <Clock size={13} className="text-blue-600" />
          Under Mentor Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
        <Clock size={13} className="text-slate-400" />
        Not Submitted
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <PrmaNavbar activeTab="internships" onNavigate={navFn} />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Authenticating Submission Portal...</h2>
          <p className="text-sm text-slate-500 mt-1">Connecting to official PRMA Tech credential server</p>
        </div>
        <PrmaFooter onNavigate={navFn} />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <PrmaNavbar activeTab="internships" onNavigate={navFn} />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Access Link Error</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">{error}</p>
          <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 mb-8 text-left space-y-1">
            <div className="font-bold text-slate-700">Troubleshooting Steps:</div>
            <div>1. Make sure you clicked the full URL provided in your PRMA Tech selection email.</div>
            <div>2. Ensure the URL starts with <code className="text-blue-600">/prma-tech/submit/...</code></div>
            <div>3. If you still have trouble, contact <a href="mailto:support@prmatech.com" className="text-blue-600 underline">support@prmatech.com</a>.</div>
          </div>
          <button
            onClick={() => navFn && navFn('prma-home')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition"
          >
            Return to PRMA Tech Home
          </button>
        </div>
        <PrmaFooter onNavigate={navFn} />
      </div>
    );
  }

  const { student, technical, offerId, joiningDate, completionDate, duration, mode, overallProgress, completedWeeksCount, tasks } = submission;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PrmaNavbar activeTab="internships" onNavigate={navFn} />

      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <span className="text-sm font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* STUDENT PROFILE & INTERNSHIP HEADER */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-2">
                <ShieldCheck size={14} className="text-blue-600" />
                Verified Active Intern Profile
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {student.fullName}
              </h1>
              <div className="text-sm font-bold text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span className="text-blue-600 font-extrabold">{technical.domainTitle}</span>
                <span>•</span>
                <span>Offer ID: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono">{offerId}</code></span>
                <span>•</span>
                <span>{duration} ({mode})</span>
              </div>
            </div>

            {/* DOWNLOAD ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`/api/prma/admin/applications/${submission.applicationId}/joining-letter`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-300"
              >
                <Download size={14} />
                Joining Letter PDF
              </a>
              <a
                href={`/api/prma/admin/applications/${submission.applicationId}/problem-statement`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition border border-blue-200"
              >
                <FileText size={14} />
                10-Page Problem Statement PDF
              </a>
            </div>
          </div>

          {/* PROGRESS BAR & DATES ROW */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Joining Date</div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-500" />
                {joiningDate || '15 November 2026'}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Completion Target</div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Award size={14} className="text-slate-500" />
                {completionDate || '14 December 2026'}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Progress</span>
                <span className="font-extrabold text-blue-700">{overallProgress || 0}% ({completedWeeksCount || 0}/4 Weeks Approved)</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(overallProgress || 0, 5)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4 WEEKLY TASK CARDS — REQUIREMENT 3 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Weekly Project Deliverables (4 Tasks)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Submit your deliverables week-by-week as specified in your Problem Statement PDF.</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              4 Weeks • 1 Month Sprint
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {(tasks || []).map((task) => {
              const weekNum = task.weekNumber;
              const isFormOpen = activeWeekForm === weekNum;
              const inputState = formInputs[weekNum] || {};
              const isApproved = task.status === 'approved';
              const isUnderReview = task.status === 'submitted' && task.reviewStatus === 'under_review';
              const needsCorrection = task.status === 'revision_required' || task.reviewStatus === 'revision_required';

              return (
                <div
                  key={weekNum}
                  className={`bg-white rounded-3xl border transition-all ${
                    isApproved
                      ? 'border-emerald-300 shadow-xs'
                      : needsCorrection
                      ? 'border-amber-300 shadow-xs'
                      : isUnderReview
                      ? 'border-blue-300 shadow-xs'
                      : 'border-slate-200'
                  } p-6 sm:p-7 overflow-hidden`}
                >
                  {/* TASK HEADER ROW */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                        W{weekNum}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-blue-600">Week {weekNum} Assignment</span>
                          {renderStatusBadge(task)}
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mt-0.5">
                          {task.taskTitle}
                        </h3>
                      </div>
                    </div>

                    {/* ACTION TRIGGER BUTTON */}
                    <div>
                      {!isApproved && (
                        <button
                          type="button"
                          onClick={() => setActiveWeekForm(isFormOpen ? null : weekNum)}
                          className={`px-4 py-2 rounded-xl text-xs font-black inline-flex items-center gap-2 transition ${
                            isFormOpen
                              ? 'bg-slate-200 text-slate-700'
                              : needsCorrection
                              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                              : task.status === 'submitted'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          {isFormOpen ? (
                            <>Close Form <ChevronUp size={14} /></>
                          ) : needsCorrection ? (
                            <>Update &amp; Resubmit <RefreshCw size={14} /></>
                          ) : task.status === 'submitted' ? (
                            <>Edit Submission <ChevronDown size={14} /></>
                          ) : (
                            <>Upload Deliverables <Upload size={14} /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* TASK DESCRIPTION & REQUIREMENTS */}
                  {task.taskProblemStatement && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="font-bold text-slate-800">Task Objective &amp; Problem:</div>
                      <p className="leading-relaxed">{task.taskProblemStatement}</p>
                      {task.prerequisites && (
                        <div className="text-[11px] text-slate-500 pt-1">
                          <strong>Prerequisites &amp; Tools:</strong> {task.prerequisites} • <strong>Effort:</strong> {task.effort || '6-8 hours'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* MENTOR REVIEW & FEEDBACK (IF REVIEWED) */}
                  {task.adminFeedback && (
                    <div
                      className={`mt-4 p-4 rounded-2xl border ${
                        isApproved
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-black mb-1">
                        <span className="flex items-center gap-1.5">
                          <Sparkles size={14} className={isApproved ? 'text-emerald-600' : 'text-amber-600'} />
                          Mentor Feedback &amp; Evaluation
                        </span>
                        {task.reviewedAt && (
                          <span className="text-[11px] font-normal opacity-75">
                            Reviewed: {new Date(task.reviewedAt).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed whitespace-pre-line mt-1">
                        {task.adminFeedback}
                      </p>
                      {needsCorrection && (
                        <div className="mt-2 text-xs font-bold text-amber-800">
                          Please update your deliverables according to the mentor notes above and click "Update &amp; Resubmit".
                        </div>
                      )}
                    </div>
                  )}

                  {/* PREVIOUS SUBMISSION SUMMARY (IF ALREADY SUBMITTED) */}
                  {task.status !== 'not_submitted' && !isFormOpen && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-500 text-[11px]">
                        <span>Submitted: <strong>{task.submittedAt ? new Date(task.submittedAt).toLocaleString('en-IN') : 'Recent'}</strong></span>
                        {task.resubmissionCount > 0 && (
                          <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">
                            Resubmission #{task.resubmissionCount}
                          </span>
                        )}
                      </div>

                      {/* Submitted Links */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {task.githubUrl && (
                          <a
                            href={task.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-600 transition font-bold"
                          >
                            <Github size={13} />
                            GitHub Repository
                            <ExternalLink size={11} className="text-slate-400" />
                          </a>
                        )}
                        {task.liveUrl && (
                          <a
                            href={task.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-600 transition font-bold"
                          >
                            <Globe size={13} />
                            Live Project Demo
                            <ExternalLink size={11} className="text-slate-400" />
                          </a>
                        )}
                      </div>

                      {/* Submitted Files */}
                      {task.files && task.files.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <div className="text-[11px] font-bold text-slate-500">Uploaded Deliverable Files:</div>
                          {task.files.map((file, idx) => (
                            <a
                              key={idx}
                              href={`/api/prma/submissions/download/${submission.submissionToken}/${weekNum}/${idx}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:text-blue-600 text-xs font-medium mr-2 mb-1"
                            >
                              <FileText size={12} className="text-blue-500" />
                              <span>{file.fileName}</span>
                              <span className="text-[10px] text-slate-400">({Math.round((file.fileSize || 0) / 1024)} KB)</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Remarks */}
                      {task.studentRemarks && (
                        <div className="text-slate-600 pt-1 text-[11px]">
                          <strong>Your Notes:</strong> {task.studentRemarks}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUBMISSION FORM (COLLAPSIBLE) */}
                  {isFormOpen && (
                    <div className="mt-5 pt-5 border-t border-slate-200 space-y-4">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-700">
                        {needsCorrection ? 'Resubmit Corrected Deliverables' : `Upload Week ${weekNum} Deliverables`}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* GitHub Repository URL */}
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            GitHub Repository URL (Optional)
                          </label>
                          <div className="relative">
                            <Github size={15} className="absolute left-3 top-3 text-slate-400" />
                            <input
                              type="url"
                              value={inputState.githubUrl || ''}
                              onChange={(e) => handleInputChange(weekNum, 'githubUrl', e.target.value)}
                              placeholder="https://github.com/your-username/project-repo"
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            />
                          </div>
                        </div>

                        {/* Live Project URL */}
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Live Demo / Cloud URL (Optional)
                          </label>
                          <div className="relative">
                            <Globe size={15} className="absolute left-3 top-3 text-slate-400" />
                            <input
                              type="url"
                              value={inputState.liveUrl || ''}
                              onChange={(e) => handleInputChange(weekNum, 'liveUrl', e.target.value)}
                              placeholder="https://your-demo.vercel.app or similar"
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* File Upload Dropzone */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1 text-xs">
                          Project Files (PDF Documentation, ZIP Archive, Code or Screenshots — Max 50MB)
                        </label>
                        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center bg-slate-50 transition cursor-pointer relative">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.zip,.rar,.tar,.gz,.docx,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileSelect(weekNum, e)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload size={22} className="mx-auto text-slate-400 mb-1" />
                          <div className="text-xs font-bold text-slate-700">
                            Click or drag files here to upload
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Supported: PDF, ZIP, RAR, TAR, DOCX, PNG, JPG (up to 50MB)
                          </div>
                        </div>

                        {/* Staged files preview */}
                        {inputState.files && inputState.files.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {inputState.files.map((f, fIdx) => (
                              <div key={fIdx} className="bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1 text-xs text-blue-800 flex items-center gap-1.5">
                                <FileText size={12} />
                                <span>{f.fileName}</span>
                                <span className="text-[10px] text-blue-500">({Math.round(f.fileSize / 1024)} KB)</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Student Remarks */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1 text-xs">
                          Implementation Notes &amp; Remarks (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={inputState.studentRemarks || ''}
                          onChange={(e) => handleInputChange(weekNum, 'studentRemarks', e.target.value)}
                          placeholder="Briefly describe what you built, libraries used, or specific notes for your mentor..."
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveWeekForm(null)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={submittingWeek === weekNum}
                          onClick={() => handleSubmitTask(weekNum)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {submittingWeek === weekNum ? (
                            <>Uploading &amp; Verifying...</>
                          ) : (
                            <>Submit Week {weekNum} Deliverables <ArrowRight size={13} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GUIDELINES & SUPPORT CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-xs text-slate-600 space-y-2">
          <div className="font-extrabold text-slate-800 flex items-center gap-2">
            <HelpCircle size={15} className="text-blue-600" />
            Official Submission Guidelines:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>Ensure all GitHub repositories or Google Drive links are publicly accessible to our reviewer.</li>
            <li>Never include API secret keys, database passwords, or confidential credentials in your submitted code.</li>
            <li>If revisions are requested by your mentor, review the feedback in this portal and click <strong>Update &amp; Resubmit</strong>.</li>
            <li>For any technical assistance or portal questions, write to <a href="mailto:support@prmatech.com" className="text-blue-600 font-bold underline">support@prmatech.com</a>.</li>
          </ul>
        </div>
      </main>

      <PrmaFooter onNavigate={navFn} />
    </div>
  );
}
