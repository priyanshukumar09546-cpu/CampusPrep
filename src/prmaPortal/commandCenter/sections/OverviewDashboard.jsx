import React from 'react';
import {
  Users,
  Clock,
  UserCheck,
  CheckSquare,
  Award,
  Briefcase,
  FolderGit2,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Activity,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import EmptyState from '../components/EmptyState';

export default function OverviewDashboard({
  stats,
  applications = [],
  submissions = [],
  onNavigateTab,
  onOpenModal
}) {
  const kpiStats = stats?.stats || stats || {};
  const fin = kpiStats.financialOverview || { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
  const domainBreakdown = kpiStats.domainBreakdown || {};
  const recentActivity = kpiStats.recentActivity || [];
  const pendingActions = kpiStats.pendingActions || [];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#57091E] via-[#780D29] to-[#3B0513] text-white p-6 lg:p-8 shadow-xl border border-[#D4A63F]/25 overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
          <Sparkles className="w-80 h-80 text-[#D4A63F]" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A63F]/20 text-[#F2D78B] text-xs font-bold border border-[#D4A63F]/30 uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A63F]" />
            PRMA Tech Enterprise OS
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            PRMA Tech Command Center
          </h2>

          <p className="text-sm text-amber-100/80 mt-2 leading-relaxed font-medium">
            Centralized corporate operating system. Monitor internship programs, employees, company projects, student deliverables, client relations, finances, and system health in real-time.
          </p>

          {/* Quick Shortcuts Bar */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={() => onNavigateTab('applications')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#D4A63F] text-slate-950 hover:bg-[#E2B752] transition-all shadow-md shadow-black/20"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Review Applications ({kpiStats.pendingApplications || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('weekly-submissions')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-xs"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#D4A63F]" />
              <span>Evaluate Deliverables</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenModal('add-employee')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Executive Database-Derived KPI Cards (Part 4) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 lg:gap-4">
        {/* 1. Total Internship Applications */}
        <KpiCard
          title="Total Applications"
          value={kpiStats.totalApplications || applications.length || 0}
          icon={Users}
          subtitle="All registered candidates"
          accent="burgundy"
          onClick={() => onNavigateTab('applications')}
        />

        {/* 2. Pending Applications */}
        <KpiCard
          title="Pending Review"
          value={kpiStats.pendingApplications || 0}
          icon={Clock}
          subtitle="Awaiting admin action"
          badge={kpiStats.pendingApplications > 0 ? 'Requires Action' : 'All Clear'}
          accent="amber"
          onClick={() => onNavigateTab('applications')}
        />

        {/* 3. Approved Interns */}
        <KpiCard
          title="Approved Interns"
          value={kpiStats.approvedInterns || 0}
          icon={UserCheck}
          subtitle="Offer letter issued"
          accent="emerald"
          onClick={() => onNavigateTab('approved-interns')}
        />

        {/* 4. Active Interns */}
        <KpiCard
          title="Active in Track"
          value={kpiStats.activeInterns || kpiStats.approvedInterns || 0}
          icon={Activity}
          subtitle="In 1-month program"
          accent="blue"
          onClick={() => onNavigateTab('approved-interns')}
        />

        {/* 5. Completed Internships */}
        <KpiCard
          title="Completed"
          value={kpiStats.completedInternships || 0}
          icon={Award}
          subtitle="4/4 weeks approved"
          accent="gold"
          onClick={() => onNavigateTab('certificates')}
        />

        {/* 6. Pending Weekly Submissions */}
        <KpiCard
          title="Pending Submissions"
          value={kpiStats.pendingSubmissionsToReview || 0}
          icon={CheckSquare}
          subtitle="Deliverables to evaluate"
          accent="purple"
          onClick={() => onNavigateTab('weekly-submissions')}
        />

        {/* 7. Total Employees */}
        <KpiCard
          title="Employees & Staff"
          value={kpiStats.totalEmployees || 0}
          icon={Briefcase}
          subtitle="Active team members"
          accent="blue"
          onClick={() => onNavigateTab('employees')}
        />

        {/* 8. Active Projects */}
        <KpiCard
          title="Active Projects"
          value={kpiStats.activeProjects || 0}
          icon={FolderGit2}
          subtitle="Enterprise contracts"
          accent="burgundy"
          onClick={() => onNavigateTab('projects')}
        />

        {/* 9. Pending Client Enquiries */}
        <KpiCard
          title="Client Enquiries"
          value={kpiStats.pendingEnquiries || 0}
          icon={MessageSquare}
          subtitle="New inbound leads"
          accent="amber"
          onClick={() => onNavigateTab('client-enquiries')}
        />

        {/* 10. Financial Overview */}
        <KpiCard
          title="Net Balance"
          value={`₹${(fin.netBalance || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          subtitle={`₹${(fin.totalIncome || 0).toLocaleString('en-IN')} In • ₹${(fin.totalExpenses || 0).toLocaleString('en-IN')} Out`}
          accent="emerald"
          onClick={() => onNavigateTab('financial-dashboard')}
        />
      </div>

      {/* Middle Grid: Pending Actions & Application Domain Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Actionable Pending Tasks & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actionable Pending Tasks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#780D29]" />
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                  Actionable Operational Items
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {pendingActions.length} Pending
              </span>
            </div>

            {pendingActions.length > 0 ? (
              <div className="space-y-2.5">
                {pendingActions.map((act, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigateTab(act.linkTab)}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-[#780D29]/5 border border-slate-200 hover:border-[#780D29]/30 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${act.urgency === 'high' ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`} />
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#780D29] transition-colors">
                        {act.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#780D29]">
                      <span>Open</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                ✓ All pending applications and weekly submissions are currently evaluated.
              </div>
            )}
          </div>

          {/* Real Recent Applications Stream */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#D4A63F]" />
                Recent Public Applications
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('applications')}
                className="text-xs font-bold text-[#780D29] hover:underline flex items-center gap-1"
              >
                <span>View All ({applications.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applications.length > 0 ? (
              <div className="overflow-x-auto prma-custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Applicant</th>
                      <th className="py-2.5 px-3">Domain</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {applications.slice(0, 5).map((app, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{app.student?.fullName || 'Candidate'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{app.student?.email || app.applicationId}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700">
                            {app.technical?.domainTitle || app.domain?.title || 'Tech Track'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`prma-badge prma-badge-${app.status || 'submitted'}`}>
                            {app.status || 'submitted'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onNavigateTab('applications')}
                            className="text-xs font-bold text-[#780D29] hover:underline"
                          >
                            Dossier →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No applications received yet"
                description="When candidates apply on the public PRMA Tech internship portal, their complete verification dossiers will appear here."
              />
            )}
          </div>
        </div>

        {/* Right 1 Col: Domain Breakdown & Company Quick Health */}
        <div className="space-y-6">
          {/* Domain Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#780D29]" />
              Domain Distribution
            </h3>

            {Object.keys(domainBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(domainBreakdown).map(([domainName, count]) => {
                  const total = applications.length || 1;
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={domainName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="truncate pr-2">{domainName}</span>
                        <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#780D29] to-[#D4A63F]"
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-6">
                No domain analytics data recorded yet.
              </div>
            )}
          </div>

          {/* Quick Company Actions Hub */}
          <div className="bg-gradient-to-br from-[#FAF8F5] to-white rounded-2xl p-6 border border-[#D4A63F]/30 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#780D29] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4A63F]" />
              Quick Command Actions
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onOpenModal('add-employee')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#780D29]/5 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#780D29] flex items-center justify-between transition-colors"
              >
                <span>+ Add New Employee</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('add-project')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#780D29]/5 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#780D29] flex items-center justify-between transition-colors"
              >
                <span>+ Create Company Project</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onOpenModal('record-transaction')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#780D29]/5 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#780D29] flex items-center justify-between transition-colors"
              >
                <span>+ Record Income / Expense</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('system-health')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#780D29]/5 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#780D29] flex items-center justify-between transition-colors"
              >
                <span>Check System &amp; DB Health</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
