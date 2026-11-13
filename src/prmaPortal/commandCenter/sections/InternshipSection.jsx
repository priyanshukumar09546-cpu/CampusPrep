import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Download,
  ExternalLink,
  RefreshCw,
  Send,
  FileText,
  FileCode,
  Award,
  Layers,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Building2,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit,
  Linkedin,
  Instagram
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function InternshipSection({
  subTab = 'applications',
  applications = [],
  domains = [],
  certificates = [],
  loading = false,
  onRefresh,
  onSelectApplication,
  onShortlistModal,
  onRejectModal,
  onOpenAddDomain,
  onIssueCertificateModal
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [copiedToken, setCopiedToken] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Filter applications based on search & filters
  const filteredApplications = applications.filter(app => {
    // Sub-tab specific filtering
    if (subTab === 'approved-interns' && app.status !== 'shortlisted' && app.status !== 'approved') return false;
    if (subTab === 'rejected-applications' && app.status !== 'rejected') return false;

    // Status filter
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;

    // Domain filter
    if (domainFilter !== 'all') {
      const d = (app.technical?.domainTitle || app.domain?.title || '').toLowerCase();
      if (!d.includes(domainFilter.toLowerCase())) return false;
    }

    // Text search
    if (search) {
      const q = search.toLowerCase();
      const name = (app.student?.fullName || '').toLowerCase();
      const email = (app.student?.email || '').toLowerCase();
      const col = (app.academic?.college || app.student?.college || '').toLowerCase();
      const appId = (app.applicationId || '').toLowerCase();
      const offId = (app.offerId || '').toLowerCase();
      return name.includes(q) || email.includes(q) || col.includes(q) || appId.includes(q) || offId.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation / header strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
            {subTab === 'applications' && 'Internship Applications'}
            {subTab === 'approved-interns' && 'Approved & Active Interns'}
            {subTab === 'rejected-applications' && 'Rejected Applications'}
            {subTab === 'internship-domains' && 'Internship Tracks & Domains'}
            {subTab === 'joining-letters' && 'Institutional Joining Letters'}
            {subTab === 'problem-statements' && '10-Page Problem Statements'}
            {subTab === 'certificates' && 'Official Completion Certificates'}
            {subTab === 'evaluations' && 'Evaluation & Mentor Feedback Records'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {filteredApplications.length} record(s) matching criteria from database.
          </p>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {subTab === 'internship-domains' && (
            <button
              type="button"
              onClick={onOpenAddDomain}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Plus className="w-4 h-4 text-[#D4A63F]" />
              <span>Add New Domain</span>
            </button>
          )}

          {subTab === 'certificates' && (
            <button
              type="button"
              onClick={onIssueCertificateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Award className="w-4 h-4 text-[#D4A63F]" />
              <span>Issue Certificate</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* DOMAIN MANAGEMENT SUB-TAB */}
      {subTab === 'internship-domains' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((dom, idx) => (
            <div
              key={dom.id || idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#780D29]/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#780D29]/10 text-[#780D29] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="prma-badge prma-badge-approved">ACTIVE TRACK</span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{dom.title}</h3>
                <span className="text-[11px] font-bold text-[#D4A63F]">{dom.category || 'Development'}</span>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dom.description}</p>
              </div>

              {dom.technologies && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {(Array.isArray(dom.technologies) ? dom.technologies : dom.technologies.split(',')).map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : subTab === 'certificates' ? (
        /* CERTIFICATES SUB-TAB */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {certificates.length > 0 ? (
            <div className="overflow-x-auto prma-custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Certificate ID</th>
                    <th className="py-3 px-4">Intern Name</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Verification Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {certificates.map((cert, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#780D29]">
                        {cert.certificateId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{cert.studentName}</div>
                        <div className="text-[11px] text-slate-400">{cert.college}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {cert.domainTitle}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {cert.issuedDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`/prma-tech/verify-certificate/${cert.certificateId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                        >
                          <span>Scannable QR URL</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="prma-badge prma-badge-approved">Issued</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Award}
              title="No certificates issued yet"
              description="Official certificates are issued when an intern successfully completes all 4 mandatory weekly deliverable milestones and receives board approval."
              actionText="Issue Certificate"
              onAction={onIssueCertificateModal}
            />
          )}
        </div>
      ) : (
        /* APPLICATIONS & APPROVED INTERNS TABLE */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, college, email, application ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-[#780D29]"
              />
            </div>

            {/* Status Filter (only on 'applications' subTab) */}
            {subTab === 'applications' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">New / Submitted</option>
                <option value="shortlisted">Approved / Shortlisted</option>
                <option value="under_review">Under Review</option>
                <option value="rejected">Rejected</option>
              </select>
            )}

            {/* Domain Filter */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none"
            >
              <option value="all">All Domains</option>
              {domains.map((d, i) => (
                <option key={i} value={d.title}>{d.title}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredApplications.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Applicant &amp; ID</th>
                      <th className="py-3 px-4">College &amp; Branch</th>
                      <th className="py-3 px-4">Domain Track</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredApplications.map((app, idx) => (
                      <tr key={app.applicationId || idx} className="hover:bg-slate-50/70 transition-colors">
                        {/* Student Name & ID */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">
                            {app.student?.fullName || 'Candidate'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {app.applicationId}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {app.student?.email}
                          </div>
                        </td>

                        {/* College & Branch */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 line-clamp-1">
                            {app.academic?.college || app.student?.college || 'University'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {app.academic?.course || 'B.Tech'} - {app.academic?.branch || 'CSE'} ({app.academic?.year || '3rd Year'})
                          </div>
                        </td>

                        {/* Domain Track */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <div className="font-bold text-slate-900">
                            {app.technical?.domainTitle || app.domain?.title || 'Technical Track'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {app.duration || '1 Month'} • {app.mode || 'Remote'}
                          </div>
                        </td>

                        {/* Verification & Socials */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {app.socialFollow?.followedLinkedIn || app.socialFollow?.linkedinScreenshot ? (
                              <span className="p-1 rounded bg-blue-50 text-blue-600" title="LinkedIn Followed">
                                <Linkedin className="w-3.5 h-3.5" />
                              </span>
                            ) : null}
                            {app.socialFollow?.followedInstagram || app.socialFollow?.instagramScreenshot ? (
                              <span className="p-1 rounded bg-pink-50 text-pink-600" title="Instagram Followed">
                                <Instagram className="w-3.5 h-3.5" />
                              </span>
                            ) : null}
                            {app.resume?.dataUrl && (
                              <span className="p-1 rounded bg-emerald-50 text-emerald-600" title="Resume Uploaded">
                                <FileText className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`prma-badge prma-badge-${app.status || 'submitted'}`}>
                            {app.status || 'submitted'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onSelectApplication(app)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                              Dossier
                            </button>

                            {app.status !== 'shortlisted' && app.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => onShortlistModal(app)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#780D29] to-[#57091E] hover:from-[#8E1032] hover:to-[#680B24] border border-[#D4A63F]/30 shadow-xs transition-all"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No applications match filters"
                description="Adjust search keywords or select 'All Statuses' to view complete records."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
