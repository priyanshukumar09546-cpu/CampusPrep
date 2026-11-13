import React, { useState } from 'react';
import {
  Mail,
  Send,
  Radio,
  MessageSquare,
  FileText,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function CommunicationsSection({
  subTab = 'email-center',
  emailLogs = [],
  announcements = [],
  loading = false,
  onRefresh,
  onOpenTestSmtpModal,
  onAddAnnouncementModal,
  onDeleteAnnouncement
}) {
  const emailTemplates = [
    {
      id: 'approval',
      title: 'Official Internship Confirmation & Joining Documents',
      recipient: 'Approved Applicants',
      subject: 'PRMA Tech | Official Internship Confirmation & Joining Documents',
      attachments: 'Joining Letter PDF + 10-Page Problem Statement PDF',
      purpose: 'Dispatched immediately when admin shortlists an applicant, embedding their personal submission URL.'
    },
    {
      id: 'submission-ack',
      title: 'Weekly Deliverable Submission Acknowledgment',
      recipient: 'Students on Task Submission',
      subject: 'PRMA Tech | Milestone Submission Received (Week {N})',
      attachments: 'None (Receipt)',
      purpose: 'Automated receipt confirming GitHub link, live project URL, and files arrived safely in database.'
    },
    {
      id: 'mentor-feedback',
      title: 'Mentor Review & Milestone Revision Request',
      recipient: 'Interns after Board Evaluation',
      subject: 'PRMA Tech | Mentorship Board Feedback & Milestone Status',
      attachments: 'Evaluation Notes',
      purpose: 'Informs intern of approval or provides feedback instructions with resubmission link.'
    },
    {
      id: 'certificate',
      title: 'Official Completion Certificate Dispatch',
      recipient: 'Graduating Interns (4/4 Milestones Approved)',
      subject: 'PRMA Tech | Official Internship Completion Certificate & Credentials',
      attachments: 'Verified Certificate PDF',
      purpose: 'Includes scannable QR verification link and formal graduation credential.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#780D29]" />
            {subTab === 'email-center' && 'Corporate Communications Hub'}
            {subTab === 'email-templates' && 'Institutional Email Templates'}
            {subTab === 'email-logs' && 'Transactional Email Delivery Logs'}
            {subTab === 'announcements' && 'Broadcast Announcements & Team Bulletins'}
            {subTab === 'whatsapp' && 'Official WhatsApp Channel & Community'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Branded Email Delivery &bull; Real SMTP Verification &bull; Community Engagement
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'email-center' && (
            <button
              type="button"
              onClick={onOpenTestSmtpModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Play className="w-3.5 h-3.5 text-[#D4A63F]" />
              <span>Test SMTP Provider</span>
            </button>
          )}

          {subTab === 'announcements' && (
            <button
              type="button"
              onClick={onAddAnnouncementModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <Plus className="w-4 h-4 text-[#D4A63F]" />
              <span>New Announcement</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: EMAIL CENTER */}
      {subTab === 'email-center' && (
        <div className="space-y-6">
          {/* SMTP Integration Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#780D29]/10 text-[#780D29] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Configured Transactional Email Dispatch</h3>
                  <p className="text-xs text-slate-500">Official mail server integration for joining letters and deliverable feedback.</p>
                </div>
              </div>
              <span className="prma-badge prma-badge-approved">Active Provider</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Provider Type</span>
                <div className="text-xs font-bold text-slate-800 mt-0.5">SMTP (Gmail / SendGrid / SES)</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sender Address</span>
                <div className="text-xs font-mono font-bold text-[#780D29] mt-0.5">support@prmatech.com</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sender Name</span>
                <div className="text-xs font-bold text-slate-800 mt-0.5">PRMA Tech</div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenTestSmtpModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                Send Diagnostic Test Email →
              </button>
            </div>
          </div>

          {/* Quick templates summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTemplates.map(tpl => (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {tpl.recipient}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">HTML Template</span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-900">{tpl.title}</h4>
                <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 truncate">
                  Subject: {tpl.subject}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{tpl.purpose}</p>
                {tpl.attachments && (
                  <div className="text-[11px] text-[#780D29] font-bold pt-1">
                    Attachments: {tpl.attachments}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EMAIL TEMPLATES */}
      {subTab === 'email-templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emailTemplates.map(tpl => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#780D29]/10 text-[#780D29]">
                  {tpl.recipient}
                </span>
                <span className="text-xs font-bold text-emerald-600">Active Template</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">{tpl.title}</h4>
              <p className="text-xs text-slate-500">{tpl.purpose}</p>
              <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {tpl.subject}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: EMAIL LOGS */}
      {subTab === 'email-logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {emailLogs.length > 0 ? (
            <div className="overflow-x-auto prma-custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Template Type</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Dispatched At</th>
                    <th className="py-3 px-4">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {emailLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{log.studentName || log.recipient}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{log.recipient}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {log.type || 'ONBOARDING'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                        {log.subject || log.taskTitle || 'Official Confirmation'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`prma-badge ${log.status === 'Delivered' || log.status === 'SENT' ? 'prma-badge-approved' : 'prma-badge-rejected'}`}>
                          {log.status || 'Delivered'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Send}
              title="No transactional email logs archived yet"
              description="When applications are approved or milestone feedback is dispatched, transmission records are logged here."
            />
          )}
        </div>
      )}

      {/* SUB-TAB 4: ANNOUNCEMENTS */}
      {subTab === 'announcements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann, idx) => (
              <div
                key={ann.announcementId || idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#780D29]" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      {ann.targetAudience || 'All Interns'}
                    </span>
                  </div>
                  <span className={`prma-badge ${ann.priority === 'Urgent' ? 'prma-badge-rejected' : 'prma-badge-gold'}`}>
                    {ann.priority || 'Normal'}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.message}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                  <span>By {ann.author || 'Admin'} &bull; {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : 'Active'}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteAnnouncement(ann.announcementId || ann._id)}
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {announcements.length === 0 && (
            <EmptyState
              icon={Radio}
              title="No active announcements"
              description="Post broadcast messages, milestone reminders, or policy updates to interns and employees."
              actionText="New Announcement"
              onAction={onAddAnnouncementModal}
            />
          )}
        </div>
      )}

      {/* SUB-TAB 5: WHATSAPP */}
      {subTab === 'whatsapp' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Official PRMA Tech WhatsApp Channel</h3>
              <p className="text-xs text-slate-500">Official student notification and announcement channel.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 break-all">
            https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G
          </div>

          <a
            href="https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <span>Open WhatsApp Community</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
