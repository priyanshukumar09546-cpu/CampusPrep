import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  ShieldCheck,
  Award,
  FileText,
  Mail,
  Linkedin,
  Instagram,
  Sparkles,
  Send,
  Truck
} from 'lucide-react';

// ===========================================================================
// 1. APPLICATION DOSSIER MODAL
// ===========================================================================
export function ApplicationDossierModal({
  app,
  onClose,
  onShortlist,
  onReject,
  onSaveRemarks
}) {
  const [remarks, setRemarks] = useState(app.adminRemarks || app.reviewNotes || '');
  const [isSavingRemarks, setIsSavingRemarks] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  if (!app) return null;

  const handleSave = async () => {
    setIsSavingRemarks(true);
    try {
      await onSaveRemarks(app.applicationId, remarks);
    } finally {
      setIsSavingRemarks(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 prma-modal-anim flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-[#57091E] to-[#780D29] text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-200 uppercase tracking-widest font-mono">
                {app.applicationId}
              </span>
              <span className={`prma-badge prma-badge-${app.status || 'submitted'} text-[10px]`}>
                {app.status || 'submitted'}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-0.5">
              {app.student?.fullName || 'Applicant Dossier'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto prma-custom-scrollbar space-y-6 flex-1 text-xs">
          {/* Section 1: Candidate & Academic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                Personal &amp; Contact Details
              </h3>
              <div className="space-y-1.5 font-medium text-slate-600">
                <div><span className="font-bold text-slate-900">Email:</span> {app.student?.email}</div>
                <div><span className="font-bold text-slate-900">Mobile:</span> {app.student?.mobile || '—'}</div>
                <div><span className="font-bold text-slate-900">WhatsApp:</span> {app.student?.whatsapp || app.student?.mobile || '—'}</div>
                <div><span className="font-bold text-slate-900">DOB:</span> {app.student?.dob || '—'}</div>
                <div><span className="font-bold text-slate-900">Gender:</span> {app.student?.gender || 'Not Specified'}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                Academic Institution
              </h3>
              <div className="space-y-1.5 font-medium text-slate-600">
                <div><span className="font-bold text-slate-900">College:</span> {app.academic?.college || app.student?.college || '—'}</div>
                <div><span className="font-bold text-slate-900">University:</span> {app.academic?.university || '—'}</div>
                <div><span className="font-bold text-slate-900">Course / Branch:</span> {app.academic?.course || 'B.Tech'} ({app.academic?.branch || 'CSE'})</div>
                <div><span className="font-bold text-slate-900">Academic Year:</span> {app.academic?.year || '3rd Year'} (Graduation: {app.academic?.graduationYear || '2026'})</div>
                <div><span className="font-bold text-slate-900">Student ID / Roll No:</span> {app.academic?.rollNumber || app.academic?.studentId || app.student?.studentId || '—'}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Domain & Resume */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
              Technical Program &amp; Resume
            </h3>

            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Track</span>
                <div className="text-sm font-extrabold text-slate-900">
                  {app.technical?.domainTitle || app.domain?.title || 'General Technology'}
                </div>
              </div>

              {app.resume?.dataUrl ? (
                <a
                  href={`/api/prma/admin/applications/${app.applicationId}/resume`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#780D29] text-white shadow-xs hover:bg-[#8E1032]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Uploaded Resume</span>
                </a>
              ) : (
                <span className="text-xs text-slate-400 font-medium">No resume document attached</span>
              )}
            </div>
          </div>

          {/* Section 3: Social Verification Screenshots */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
              Follower Verification Proofs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* LinkedIn Screenshot */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-700">LinkedIn Follow Proof</span>
                </div>
                {app.socialFollow?.linkedinScreenshot || app.linkedinScreenshotUrl ? (
                  <button
                    type="button"
                    onClick={() => setPreviewImage(app.socialFollow?.linkedinScreenshot || app.linkedinScreenshotUrl)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View Screenshot →
                  </button>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </div>

              {/* Instagram Screenshot */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span className="font-bold text-slate-700">Instagram Follow Proof</span>
                </div>
                {app.socialFollow?.instagramScreenshot || app.instagramScreenshotUrl ? (
                  <button
                    type="button"
                    onClick={() => setPreviewImage(app.socialFollow?.instagramScreenshot || app.instagramScreenshotUrl)}
                    className="text-xs font-bold text-pink-600 hover:underline"
                  >
                    View Screenshot →
                  </button>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Admin Remarks */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 text-xs">
              Internal Mentorship / Review Remarks
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add internal evaluation remarks or notes on student background..."
              className="w-full p-2.5 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#780D29]"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={isSavingRemarks}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
            >
              {isSavingRemarks ? 'Saving...' : 'Save Remarks'}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-100"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {app.status !== 'rejected' && (
              <button
                type="button"
                onClick={() => onReject(app)}
                className="px-3.5 py-2 bg-red-50 text-red-700 font-bold text-xs rounded-xl border border-red-200 hover:bg-red-100"
              >
                Reject Application
              </button>
            )}

            {app.status !== 'shortlisted' && app.status !== 'approved' && (
              <button
                type="button"
                onClick={() => onShortlist(app)}
                className="px-4 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white font-bold text-xs rounded-xl shadow-md border border-[#D4A63F]/30 hover:shadow-lg"
              >
                Approve &amp; Issue Joining Letter &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Click to enlarge image modal */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              alt="Proof Preview"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// 2. SHORTLIST & APPROVAL MODAL (12-STEP PIPELINE)
// ===========================================================================
export function ShortlistModal({
  app,
  onClose,
  onConfirmApproval,
  isProcessing
}) {
  const [joiningDate, setJoiningDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [duration, setDuration] = useState('1 Month');
  const [workMode, setWorkMode] = useState('Fully Remote');

  if (!app) return null;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 prma-modal-anim space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#780D29]">
              Automated Internship Approval
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              Approve {app.student?.fullName}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Approving this application will execute the 12-step official pipeline: generating the unique Internship ID, official Joining Letter PDF, 10-page Problem Statement PDF with milestone links, and dispatching the confirmation email.
        </p>

        <div className="space-y-3 text-xs font-medium">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Joining Date</label>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Internship Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800"
              >
                <option value="1 Month">1 Month (Standard)</option>
                <option value="2 Months">2 Months</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
              <input
                type="text"
                readOnly
                value={workMode}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirmApproval(app.applicationId, joiningDate, duration)}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white font-bold text-xs rounded-xl shadow-md border border-[#D4A63F]/30 hover:shadow-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4A63F]" />
                <span>Executing Pipeline &amp; PDFs...</span>
              </>
            ) : (
              <span>Confirm &amp; Dispatch Documents &rarr;</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 3. SUBMISSION EVALUATION MODAL
// ===========================================================================
export function SubmissionReviewModal({
  submission,
  task,
  onClose,
  onSubmitReview,
  isSubmitting
}) {
  const [status, setStatus] = useState('approved');
  const [feedback, setFeedback] = useState('');

  if (!submission || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 prma-modal-anim space-y-4 text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#780D29]">
              Mentorship Board Evaluation
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              Week {task.weekNumber}: {submission.student?.fullName}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
          <div><span className="font-bold">Offer ID:</span> {submission.offerId}</div>
          {task.githubUrl && <div><span className="font-bold">GitHub:</span> {task.githubUrl}</div>}
          {task.liveUrl && <div><span className="font-bold">Live Demo:</span> {task.liveUrl}</div>}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Evaluation Verdict</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('approved')}
                className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                  status === 'approved' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Approve Milestone
              </button>
              <button
                type="button"
                onClick={() => setStatus('revision_required')}
                className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                  status === 'revision_required' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Request Revision
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mentor Feedback &amp; Suggestions</label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback for the candidate regarding architecture, tests, or documentation..."
              className="w-full p-2.5 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#780D29]"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSubmitReview(submission.submissionToken || submission.submissionId, task.weekNumber, status, feedback)}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white font-bold text-xs rounded-xl shadow-md border border-[#D4A63F]/30 hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Recording Verdict...' : 'Save & Dispatch Email →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 4. ADD EMPLOYEE MODAL
// ===========================================================================
export function AddEmployeeModal({
  onClose,
  onSubmit,
  departments = []
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [role, setRole] = useState('MEMBER');
  const [employmentType, setEmploymentType] = useState('Full-Time');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email) return alert('Full name and email are mandatory.');
    setIsSubmitting(true);
    try {
      await onSubmit({
        fullName,
        email,
        phone,
        department,
        designation,
        role,
        employmentType,
        salary: Number(salary) || 0
      });
      onClose();
    } catch (err) {
      alert('Error adding employee: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 prma-modal-anim space-y-4 text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#780D29]">
              Human Resources
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              Add Corporate Employee
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@prmatech.com"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-bold"
              >
                <option value="Engineering">Engineering</option>
                <option value="Operations">Operations</option>
                <option value="Product & Design">Product &amp; Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Backend Architect"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-bold"
              >
                <option value="MEMBER">Member</option>
                <option value="MENTOR">Mentor / Evaluator</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Employment</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-bold"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contractor">Contractor</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Stipend (₹)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="25000"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white font-bold text-xs rounded-xl shadow-md border border-[#D4A63F]/30 hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Employee...' : 'Save Employee Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===========================================================================
// 5. RECORD TRANSACTION MODAL (FINANCE)
// ===========================================================================
export function RecordTransactionModal({
  onClose,
  onSubmit
}) {
  const [type, setType] = useState('Income');
  const [category, setCategory] = useState('Client Project Contract');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [clientOrVendor, setClientOrVendor] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert('Please enter a valid amount.');
    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        category,
        amount: Number(amount),
        paymentMethod,
        referenceNumber,
        clientOrVendor,
        description
      });
      onClose();
    } catch (err) {
      alert('Error recording transaction: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 prma-modal-anim space-y-4 text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#780D29]">
              General Ledger
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              Record Financial Transaction
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('Income')}
              className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                type === 'Income' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              + Income
            </button>
            <button
              type="button"
              onClick={() => setType('Expense')}
              className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                type === 'Expense' ? 'bg-red-600 text-white border-red-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              - Expense
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full p-2.5 bg-slate-50 text-xs font-mono font-bold rounded-xl border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-bold"
              >
                {type === 'Income' ? (
                  <>
                    <option value="Client Project Contract">Client Project Contract</option>
                    <option value="Software Services">Software Services</option>
                    <option value="Merchandise Sales">Merchandise Sales</option>
                    <option value="Other Inbound Revenue">Other Inbound Revenue</option>
                  </>
                ) : (
                  <>
                    <option value="Salaries & Stipends">Salaries &amp; Stipends</option>
                    <option value="Cloud Server Infrastructure">Cloud Server Infrastructure</option>
                    <option value="Merchandise & Welcome Kits Production">Merchandise &amp; Kit Production</option>
                    <option value="Office & Legal">Office &amp; Legal</option>
                    <option value="Other Expense">Other Expense</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Party / Client / Vendor</label>
              <input
                type="text"
                value={clientOrVendor}
                onChange={(e) => setClientOrVendor(e.target.value)}
                placeholder="e.g. Delta Corp / AWS"
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reference / UTR Number</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. UPI-92810384910"
                className="w-full p-2.5 bg-slate-50 text-xs font-mono rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description / Memo</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Final deliverable milestone payment for corporate web application"
              className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white font-bold text-xs rounded-xl shadow-md border border-[#D4A63F]/30 hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Save to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===========================================================================
// 6. ISSUE CERTIFICATE MODAL
// ===========================================================================
export function IssueCertificateModal({
  onClose,
  onSubmit,
  applications = []
}) {
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approvedCandidates = applications.filter(a => a.status === 'shortlisted' || a.status === 'approved');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOfferId) return alert('Select an approved candidate.');
    setIsSubmitting(true);
    try {
      await onSubmit(selectedOfferId);
      onClose();
    } catch (err) {
      alert('Certificate Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 prma-modal-anim space-y-4 text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#780D29]">
              Credential Authority
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              Issue Official Completion Certificate
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Certificates can be issued to candidates who have completed their 1-month track and had all 4 mandatory milestone deliverables evaluated and approved by the board.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Approved Intern *</label>
            <select
              value={selectedOfferId}
              onChange={(e) => setSelectedOfferId(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-bold"
            >
              <option value="">-- Choose Candidate --</option>
              {approvedCandidates.map((c, idx) => (
                <option key={idx} value={c.offerId || c.applicationId}>
                  {c.student?.fullName} ({c.offerId || c.applicationId}) - {c.technical?.domainTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white font-bold text-xs rounded-xl shadow-md border border-[#D4A63F]/30 hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying & Generating...' : 'Issue & Verify QR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===========================================================================
// 7. TEST SMTP MODAL
// ===========================================================================
export function TestSmtpModal({
  onClose,
  onTestSmtp
}) {
  const [recipient, setRecipient] = useState('support@prmatech.com');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);

  const handleTest = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    setResult(null);
    try {
      const res = await onTestSmtp(recipient);
      setResult(res);
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 prma-modal-anim space-y-4 text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#780D29]">
              Mail Infrastructure
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              Live SMTP Provider Diagnostics
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Sends an authenticated ping message using the configured server environment credentials to verify real SMTP connectivity.
        </p>

        <form onSubmit={handleTest} className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Test Ping Recipient Email</label>
            <input
              type="email"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2.5 bg-slate-50 font-mono text-xs rounded-xl border border-slate-200"
            />
          </div>

          {result && (
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                result.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                {result.success ? 'SMTP Connection Succeeded' : 'Diagnostic Alert'}
              </div>
              <p>{result.message}</p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isRunning}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white font-bold text-xs rounded-xl shadow-md border border-[#D4A63F]/30 hover:shadow-lg disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4A63F]" />
                  <span>Connecting to Mail Server...</span>
                </>
              ) : (
                <span>Dispatch Diagnostic Ping</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
