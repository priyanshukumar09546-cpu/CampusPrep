import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Github,
  Globe,
  ExternalLink,
  Download,
  Eye,
  MessageSquare,
  FileCode,
  Sparkles,
  RefreshCw,
  Send,
  Copy,
  Check,
  ChevronRight,
  Settings
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function WeeklySubmissionsSection({
  submissions = [],
  loading = false,
  onRefresh,
  onOpenReviewModal,
  onOpenGformConfig
}) {
  const [search, setSearch] = useState('');
  const [weekFilter, setWeekFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedToken, setCopiedToken] = useState(null);

  const handleCopy = (token, id) => {
    const url = `https://professorvirus.site/prma-tech/submit/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const filteredSubmissions = submissions.filter(sub => {
    // Status filter
    if (statusFilter === 'pending') {
      const hasPending = (sub.tasks || []).some(t => t.status === 'submitted' && (t.reviewStatus === 'under_review' || t.reviewStatus === 'pending'));
      if (!hasPending) return false;
    } else if (statusFilter === 'completed') {
      const allApproved = (sub.tasks || []).filter(t => t.status === 'approved').length === 4;
      if (!allApproved) return false;
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const name = (sub.student?.fullName || '').toLowerCase();
      const email = (sub.student?.email || '').toLowerCase();
      const offId = (sub.offerId || '').toLowerCase();
      const track = (sub.technical?.domainTitle || '').toLowerCase();
      return name.includes(q) || email.includes(q) || offId.includes(q) || track.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Google Form Integration Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#780D29]" />
            Weekly Milestone Submissions &amp; Evaluation
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            4-Week Task Progression &bull; {submissions.length} Total Registered Interns
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenGformConfig}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
          >
            <Settings className="w-4 h-4 text-purple-600" />
            <span>Google Form Webhook</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, Offer ID, domain, email..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#780D29]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none"
        >
          <option value="all">All Submissions</option>
          <option value="pending">Awaiting Mentor Review</option>
          <option value="completed">All 4 Weeks Approved</option>
        </select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((sub, sIdx) => {
            const tasks = sub.tasks || [];
            const approvedCount = tasks.filter(t => t.status === 'approved').length;
            const submittedCount = tasks.filter(t => t.status === 'submitted' || t.status === 'approved').length;
            const progressPct = Math.round((submittedCount / 4) * 100);

            return (
              <div
                key={sub.submissionId || sIdx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#780D29]/40 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {sub.student?.fullName || 'Candidate'}
                      </h3>
                      <span className="text-xs font-mono font-bold text-[#780D29] bg-[#780D29]/10 px-2 py-0.5 rounded-full">
                        {sub.offerId || 'OFFER-PENDING'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      {sub.technical?.domainTitle || 'Internship Track'} &bull; {sub.student?.college || 'College'}
                    </div>
                  </div>

                  {/* Submission link copy & Progress */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopy(sub.submissionToken, sub.submissionId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                      title="Copy Student Submission Portal Link"
                    >
                      {copiedToken === sub.submissionId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Student Portal Link</span>
                        </>
                      )}
                    </button>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-slate-800">
                        {approvedCount} / 4 Approved
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Progress: {progressPct}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Weekly Task Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(wNum => {
                    const task = tasks.find(t => t.weekNumber === wNum) || {
                      weekNumber: wNum,
                      taskTitle: `Week ${wNum} Deliverables`,
                      status: 'not_submitted',
                      reviewStatus: 'pending'
                    };

                    const isSubmitted = task.status === 'submitted' || task.status === 'approved' || task.status === 'revision_required';
                    const isApproved = task.status === 'approved';
                    const isRevision = task.status === 'revision_required';
                    const isReviewPending = task.status === 'submitted' && (!task.reviewStatus || task.reviewStatus === 'under_review' || task.reviewStatus === 'pending');

                    return (
                      <div
                        key={wNum}
                        className={`rounded-xl p-3.5 border transition-all ${
                          isApproved
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : isRevision
                            ? 'bg-amber-50/60 border-amber-200'
                            : isSubmitted
                            ? 'bg-blue-50/60 border-blue-200'
                            : 'bg-slate-50/70 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                            Week {wNum}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-800'
                                : isRevision
                                ? 'bg-amber-100 text-amber-800'
                                : isSubmitted
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {task.status || 'Not Submitted'}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-800 line-clamp-1 mb-2">
                          {task.taskTitle || `Milestone ${wNum}`}
                        </div>

                        {/* Deliverables links */}
                        <div className="space-y-1 text-[11px] font-medium pt-1 border-t border-slate-200/50">
                          {task.githubUrl ? (
                            <a
                              href={task.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-slate-700 hover:text-black hover:underline"
                            >
                              <Github className="w-3 h-3" />
                              <span className="truncate max-w-[130px]">GitHub Repository</span>
                            </a>
                          ) : null}

                          {task.liveUrl ? (
                            <div className="pt-0.5">
                              <a
                                href={task.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <Globe className="w-3 h-3" />
                                <span className="truncate max-w-[130px]">Live Project</span>
                              </a>
                            </div>
                          ) : null}

                          {task.files && task.files.length > 0 ? (
                            <div className="pt-0.5">
                              <a
                                href={`/api/prma/submissions/download/${sub.submissionToken}/${wNum}/0`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-purple-600 hover:underline"
                              >
                                <Download className="w-3 h-3" />
                                <span className="truncate max-w-[130px]">{task.files[0].fileName || 'Download PDF/ZIP'}</span>
                              </a>
                            </div>
                          ) : null}
                        </div>

                        {/* Evaluation button */}
                        {isSubmitted && (
                          <div className="mt-3 pt-2 border-t border-slate-200/60">
                            <button
                              type="button"
                              onClick={() => onOpenReviewModal(sub, task)}
                              className="w-full py-1 text-center text-xs font-bold text-white bg-gradient-to-r from-[#780D29] to-[#57091E] rounded-lg shadow-xs hover:shadow transition-all"
                            >
                              Evaluate Week {wNum} →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={CheckSquare}
            title="No weekly task submissions recorded yet"
            description="When approved interns upload project code, GitHub links, and deliverables via their personalized submission portal, milestones will display here for mentor evaluation."
          />
        )}
      </div>
    </div>
  );
}
