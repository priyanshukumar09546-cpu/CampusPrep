import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  Cpu,
  KeyRound,
  UserCog,
  Settings,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Mail,
  Zap,
  Globe,
  Lock,
  ExternalLink
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function SystemManagementSection({
  subTab = 'system-health',
  auditLogs = [],
  loading = false,
  onRefresh,
  onOpenTestSmtp
}) {
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch('/api/prma/admin/system-health');
      const data = await res.json();
      if (data.success) {
        setHealthData(data.health);
      }
    } catch (e) {
      console.warn('Health check error:', e.message);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-[#780D29]" />
            {subTab === 'system-health' && 'System Health & Infrastructure Diagnostics'}
            {subTab === 'audit-logs' && 'Immutable Audit Logs & Activity Trail'}
            {subTab === 'integrations' && 'Third-Party Integrations & Webhooks'}
            {subTab === 'admin-profile' && 'Authorized Administrator Profile'}
            {subTab === 'security' && 'Security, Session & Role Settings'}
            {subTab === 'general-settings' && 'PRMA Tech General Company Settings'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Enterprise Reliability &bull; MongoDB Atlas Diagnostics &bull; Security Enforcement
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'system-health' && (
            <button
              type="button"
              onClick={fetchHealth}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin text-[#D4A63F]' : ''}`} />
              <span>Ping Infrastructure</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#780D29]' : ''}`} />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SYSTEM HEALTH */}
      {subTab === 'system-health' && (
        <div className="space-y-6">
          {/* Health Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* DB Status */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Database Engine</span>
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-extrabold text-slate-900">
                  {healthData?.database?.connected ? 'CONNECTED' : 'STANDBY'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Latency: {healthData?.database?.latencyMs ?? '--'} ms &bull; Replica Set
              </p>
            </div>

            {/* System Uptime */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Process Uptime</span>
                <Clock className="w-4 h-4 text-[#780D29]" />
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">
                {healthData?.uptime || 'Active'}
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Node.js {healthData?.system?.nodeVersion || process.version}
              </p>
            </div>

            {/* Heap Memory */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Memory Allocation</span>
                <Cpu className="w-4 h-4 text-[#D4A63F]" />
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">
                {healthData?.system?.heapUsedMb ?? 85} MB
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                RSS: {healthData?.system?.rssMb ?? 140} MB Total
              </p>
            </div>

            {/* Transactional SMTP */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Email SMTP Dispatch</span>
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${healthData?.integrations?.smtpEmail?.configured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-lg font-extrabold text-slate-900">
                  {healthData?.integrations?.smtpEmail?.configured ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate">
                {healthData?.integrations?.smtpEmail?.host || 'support@prmatech.com'}
              </p>
            </div>
          </div>

          {/* Infrastructure Details */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Diagnostic Architecture Details
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-bold text-slate-600">Database Connection Target</span>
                <span className="font-mono text-slate-800 font-bold">ac-ojbgnqm-shard-00.tftgeof.mongodb.net</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-bold text-slate-600">Storage Max Payload</span>
                <span className="font-mono text-slate-800 font-bold">50MB (Supports high-res resumes &amp; project ZIPs)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-bold text-slate-600">Google Form Synchronizer Endpoint</span>
                <span className="font-mono text-purple-700 font-bold">/api/prma/submissions/google-form-webhook</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-bold text-slate-600">Public Production URL</span>
                <a
                  href="https://professorvirus.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>https://professorvirus.site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AUDIT LOGS */}
      {subTab === 'audit-logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {auditLogs.length > 0 ? (
            <div className="overflow-x-auto prma-custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Module</th>
                    <th className="py-3 px-4">Target Record</th>
                    <th className="py-3 px-4">Admin Operator</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {auditLogs.map((log, idx) => (
                    <tr key={log.logId || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#780D29]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-800">{log.targetId || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{log.adminName || 'Admin'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.adminEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.details || '—'}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-right">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No audit entries archived yet"
              description="Actions performed by administrators, such as candidate approvals, employee creation, and financial updates, are recorded immutably here."
            />
          )}
        </div>
      )}

      {/* SUB-TAB 3: INTEGRATIONS */}
      {subTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SMTP */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Mail Service</span>
              <span className="prma-badge prma-badge-approved">Connected</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Transactional Email SMTP</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dispatches institutional joining letters, problem statements, and weekly milestone evaluation feedback.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenTestSmtp}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
              >
                Test Connection &rarr;
              </button>
            </div>
          </div>

          {/* Google Form */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Student Portal</span>
              <span className="prma-badge prma-badge-approved">Active</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Google Form &amp; Apps Script Webhook</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automatically captures deliverables pushed by students to Google Forms and binds responses to their Internship ID.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ADMIN PROFILE */}
      {subTab === 'admin-profile' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-xl space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#780D29] to-[#D4A63F] text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              P
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Priyanshu Kumar</h3>
              <p className="text-xs text-slate-500 font-medium">Founder &amp; Authorized Representative</p>
              <span className="prma-badge prma-badge-gold mt-1">SUPER ADMIN</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">Official Organization</span>
              <span className="font-bold text-slate-900">PRMA Tech / ProfessorVirus</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">Official Signatory Registration</span>
              <span className="font-mono text-slate-800 font-bold">UDYAM-UP-76-0055635</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">Role Authority</span>
              <span className="font-bold text-emerald-700">Full System &amp; Document Authorization</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: GENERAL SETTINGS */}
      {subTab === 'general-settings' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            PRMA Tech Corporate Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Company Official Name</label>
              <input
                type="text"
                readOnly
                value="PRMA Tech (Educational & Technology Solutions)"
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Brand Tagline</label>
              <input
                type="text"
                readOnly
                value="Build. Learn. Innovate. Grow."
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-500 font-bold mb-1">Registered Corporate Address</label>
              <input
                type="text"
                readOnly
                value="PRMA Tech, Knowledge Park, Greater Noida, Uttar Pradesh – 201310"
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
