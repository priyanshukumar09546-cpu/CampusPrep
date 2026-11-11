import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  ExternalLink,
  Download,
  Eye,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  FileText,
  Mail,
  Send,
  Sparkles,
  Calendar,
  GraduationCap,
  Building2,
  Copy,
  Check
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { PRMA_GOODIES } from '../data/prmaGoodies';

export default function PrmaAdminPanel({ onNavigate, navigateToTab }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'internships' | 'careers' | 'inquiries' | 'goodies'
  const [stats, setStats] = useState(null);
  const [internships, setInternships] = useState([]);
  const [careers, setCareers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [shortlistModalApp, setShortlistModalApp] = useState(null);
  const [joiningDateInput, setJoiningDateInput] = useState('');
  const [isProcessingShortlist, setIsProcessingShortlist] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  const navFn = onNavigate || navigateToTab;

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/prma/admin/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      // 2. Fetch Internships
      const internRes = await fetch('/api/prma/admin/applications');
      if (internRes.ok) {
        const data = await internRes.json();
        setInternships(data.applications || []);
      }

      // 3. Fetch Careers
      const carRes = await fetch('/api/prma/admin/careers');
      if (carRes.ok) {
        const data = await carRes.json();
        setCareers(data.applications || []);
      }

      // 4. Fetch Inquiries
      const inqRes = await fetch('/api/prma/admin/inquiries');
      if (inqRes.ok) {
        const data = await inqRes.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.warn('Network sync notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openShortlistModal = (app) => {
    setShortlistModalApp(app);
    // Suggest joining date 7 days from now
    const nextWeek = new Date(Date.now() + 7 * 86400000);
    const day = String(nextWeek.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    setJoiningDateInput(`${day}-${months[nextWeek.getMonth()]}-${nextWeek.getFullYear()}`);
  };

  const handleConfirmShortlist = async () => {
    if (!shortlistModalApp) return;
    setIsProcessingShortlist(true);
    try {
      const res = await fetch(`/api/prma/admin/applications/${shortlistModalApp.applicationId}/shortlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joiningDate: joiningDateInput })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess(`✓ Successfully shortlisted ${shortlistModalApp.student?.fullName || 'student'}! Offer ID: ${data.offerId}. Offer Letter PDF generated and email notification dispatched.`);
        // Refresh list
        loadData();
        setShortlistModalApp(null);
        setTimeout(() => setActionSuccess(''), 7000);
      } else {
        alert(data.error || 'Failed to shortlist applicant');
      }
    } catch (err) {
      console.error(err);
      alert('Error during shortlisting process: ' + err.message);
    } finally {
      setIsProcessingShortlist(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/prma/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setActionSuccess(`Application ${appId} status updated to ${newStatus}`);
        setInternships(prev => prev.map(a => a.applicationId === appId ? { ...a, status: newStatus } : a));
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const filteredInternships = internships.filter(item => {
    const matchesSearch =
      (item.student?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.student?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.student?.college || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.applicationId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.offerId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.domain?.title || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PrmaNavbar activeTab="admin" onNavigate={navFn} navigateToTab={navFn} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              PRMA Tech™ Operations Hub • 100% Free Program
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin & Operations Console</h1>
            <p className="text-sm text-slate-500 mt-1">
              Live management of 100% Free student internship cohorts, vector PDF offer letter generation, automated email notifications, and candidate review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <button
              onClick={() => navFn && navFn('prma-internships-home')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition"
            >
              <ExternalLink className="w-4 h-4" />
              View Student Portal
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Overview Analytics', icon: ShieldCheck },
            { id: 'internships', label: `Internships (${internships.length})`, icon: Users },
            { id: 'careers', label: `Careers & Talent (${careers.length})`, icon: Briefcase },
            { id: 'inquiries', label: `Corporate Inquiries (${inquiries.length})`, icon: MessageSquare },
            { id: 'goodies', label: `Goodies Showcase (9)`, icon: Package }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">
                  {stats?.totalInternshipApplications || internships.length || 0}
                </div>
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 mt-2">
                  100% Free Program Registrations
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted Interns</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">
                  {internships.filter(i => i.status === 'shortlisted').length}
                </div>
                <span className="inline-flex items-center text-xs font-medium text-blue-600 mt-2">
                  Official Offer Letters Issued
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Candidates</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">
                  {stats?.careerApplications || careers.length || 0}
                </div>
                <span className="inline-flex items-center text-xs font-medium text-amber-600 mt-2">
                  Direct job submissions
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Inquiries</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">
                  {stats?.inquiriesReceived || inquiries.length || 0}
                </div>
                <span className="inline-flex items-center text-xs font-medium text-purple-600 mt-2">
                  B2B project inquiries
                </span>
              </div>
            </div>

            {/* Quick Action Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">Recent Internship Submissions</h3>
                  <button onClick={() => setActiveTab('internships')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    View All &rarr;
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {internships.slice(0, 5).map((app, i) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{app.student?.fullName || 'Student'}</p>
                        <p className="text-xs text-slate-500">{app.domain?.title || 'Web Development'} • {app.applicationId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {app.status || 'Submitted'}
                        </span>
                        {app.status === 'shortlisted' ? (
                          <a
                            href={`/api/prma/admin/applications/${encodeURIComponent(app.applicationId)}/offer-letter`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Download Offer Letter PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : (
                          <button
                            onClick={() => openShortlistModal(app)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                          >
                            Shortlist
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">Recent Career Submissions</h3>
                  <button onClick={() => setActiveTab('careers')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    View All &rarr;
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {careers.slice(0, 5).map((car, i) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{car.fullName}</p>
                        <p className="text-xs text-slate-500">{car.roleTitle} • {car.email}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 capitalize">
                        {car.status?.replace('_', ' ') || 'Under Review'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERNSHIPS LIST */}
        {activeTab === 'internships' && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, college, email, ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses ({internships.length})</option>
                  <option value="submitted">Submitted / Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Application Details</th>
                      <th className="px-6 py-4">Student & Academic Profile</th>
                      <th className="px-6 py-4">Selected Domain</th>
                      <th className="px-6 py-4">Offer ID / Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInternships.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                          No internship applications found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInternships.map(app => (
                        <tr key={app.applicationId} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-slate-900 block">{app.applicationId}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              {new Date(app.createdAt || Date.now()).toLocaleDateString('en-GB')}
                            </span>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                              100% Free Program
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{app.student?.fullName}</p>
                            <p className="text-xs text-slate-500">{app.student?.email} • {app.student?.mobile}</p>
                            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>{app.student?.college || 'AKGEC'}</span>
                              <span className="text-slate-400">•</span>
                              <span>{app.student?.branch || 'CSE'} ({app.student?.year || '3rd Year'})</span>
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">{app.domain?.title || 'Web Development'}</p>
                            <p className="text-xs text-slate-500">Duration: 1 Month • Remote Mode</p>
                            {app.technical?.skills && Array.isArray(app.technical.skills) && app.technical.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5 max-w-xs">
                                {app.technical.skills.slice(0, 3).map((s, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                                    {s}
                                  </span>
                                ))}
                                {app.technical.skills.length > 3 && (
                                  <span className="text-[10px] text-slate-400">+{app.technical.skills.length - 3}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {app.status === 'shortlisted' ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Shortlisted
                                </span>
                                {app.offerId && (
                                  <div className="flex items-center gap-1.5 mt-1 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    <span>{app.offerId}</span>
                                    <button
                                      onClick={() => copyToClipboard(app.offerId, app.applicationId)}
                                      className="text-slate-400 hover:text-slate-700"
                                      title="Copy Offer ID"
                                    >
                                      {copiedId === app.applicationId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                )}
                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                  Joining: {app.joiningDate || '17-Nov-2026'}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  Under Review
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {app.status === 'shortlisted' ? (
                                <>
                                  <a
                                    href={`/api/prma/admin/applications/${encodeURIComponent(app.applicationId)}/offer-letter`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    PDF Offer Letter
                                  </a>
                                  <a
                                    href={`/prma-tech/verify-offer/${encodeURIComponent(app.offerId || app.applicationId)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                                    title="Verify Scannable Offer Credential"
                                  >
                                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                                  </a>
                                </>
                              ) : (
                                <button
                                  onClick={() => openShortlistModal(app)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                                  Approve & Shortlist
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedRecord(app)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                              >
                                Dossier
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAREERS LIST */}
        {activeTab === 'careers' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4">Portfolio / Notes</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {careers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                          No career applications recorded yet.
                        </td>
                      </tr>
                    ) : (
                      careers.map((car, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{car.fullName}</p>
                            <p className="text-xs text-slate-400">{car.email} • {car.phone}</p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{car.roleTitle}</td>
                          <td className="px-6 py-4">{car.experience || 'Fresher'}</td>
                          <td className="px-6 py-4 text-xs">
                            {car.portfolioUrl && (
                              <a href={car.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline block font-medium">
                                View Portfolio &rarr;
                              </a>
                            )}
                            <p className="text-slate-500 line-clamp-1">{car.notes || 'Submitted via portal'}</p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {new Date(car.appliedAt || Date.now()).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                              {car.status?.replace('_', ' ') || 'Received'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CORPORATE INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Client / Inquirer</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Budget</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                          No corporate inquiries recorded yet.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inq, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{inq.fullName}</p>
                            <p className="text-xs text-slate-400">{inq.email} • {inq.phone || 'N/A'}</p>
                            <p className="text-xs text-slate-500">{inq.company || 'Direct Contact'}</p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{inq.service}</td>
                          <td className="px-6 py-4 font-medium text-slate-700">{inq.budget}</td>
                          <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">{inq.message}</td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {new Date(inq.createdAt || Date.now()).toLocaleDateString('en-GB')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GOODIES SHOWCASE (9 PRODUCTS, ZERO PRICES, COMING SOON) */}
        {activeTab === 'goodies' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">PRMA Tech™ Official Internship Goodies Suite</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Catalog of 9 official merchandise products shown to interns in Showcase Mode (Zero Prices • Coming Soon).
                </p>
              </div>
              <button
                onClick={() => navFn && navFn('prma-internships-goodies')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
              >
                <Eye className="w-4 h-4" />
                View Intern Showcase Screen
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRMA_GOODIES.map((g) => (
                <div key={g.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 flex flex-col">
                  <div className="relative h-48 bg-slate-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-3">
                    <img src={g.image} alt={g.name} className="max-h-full max-w-full object-contain" />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-600 text-white tracking-wider">
                      COMING SOON
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{g.name}</h4>
                  <p className="text-xs text-purple-600 font-semibold mb-2">{g.subtitle}</p>
                  <p className="text-xs text-slate-500 mb-3 flex-1">{g.description}</p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600">Free Intern Kit Item</span>
                    <span className="text-xs font-mono text-slate-400">ID: {g.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHORTLIST MODAL */}
        {shortlistModalApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Approve & Issue Offer Letter</h3>
                    <p className="text-xs text-slate-500">100% Free 1-Month Internship Program</p>
                  </div>
                </div>
                <button onClick={() => setShortlistModalApp(null)} className="text-slate-400 hover:text-slate-700">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="py-5 space-y-4 text-sm text-slate-700">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Candidate:</span>
                    <span className="font-bold text-slate-900">{shortlistModalApp.student?.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Domain:</span>
                    <span className="font-bold text-blue-600">{shortlistModalApp.domain?.title}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Student Email:</span>
                    <span className="font-bold text-slate-800">{shortlistModalApp.student?.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Duration:</span>
                    <span className="font-bold text-slate-800">1 Month (Remote Mode)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned Joining Date:
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={joiningDateInput}
                      onChange={(e) => setJoiningDateInput(e.target.value)}
                      placeholder="e.g. 17-Nov-2026"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Format: DD-MMM-YYYY. Default is 7 days from today.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-200 text-xs text-blue-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Automated Actions upon Approval:
                  </div>
                  <p>1. Unique Offer ID generation (PRMA/INT/A1/...).</p>
                  <p>2. High-resolution vector A4 PDF Joining Letter created.</p>
                  <p>3. Dynamic verification QR code embedded into document.</p>
                  <p>4. Official shortlist confirmation email with PDF attached sent to student.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessingShortlist}
                  onClick={() => setShortlistModalApp(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessingShortlist}
                  onClick={handleConfirmShortlist}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition disabled:opacity-50"
                >
                  {isProcessingShortlist ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating PDF & Dispatching Email...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Approve & Dispatch Offer Letter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CANDIDATE DOSSIER DRAWER */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end">
            <div className="bg-white h-full w-full max-w-xl p-8 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 block">
                      {selectedRecord.applicationId}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">Candidate Application Dossier</h3>
                  </div>
                  <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-700">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-6 space-y-6 text-sm">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    selectedRecord.status === 'shortlisted' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block">Status</span>
                      <span className="text-base font-extrabold capitalize text-slate-900">
                        {selectedRecord.status || 'Submitted'}
                      </span>
                    </div>
                    {selectedRecord.offerId && (
                      <div className="text-right">
                        <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block">Offer ID</span>
                        <span className="text-sm font-mono font-bold text-blue-700">{selectedRecord.offerId}</span>
                      </div>
                    )}
                  </div>

                  {/* Personal & Academic */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 text-blue-600">
                      Personal & Academic Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-xs text-slate-400 block">Full Name</span>
                        <span className="font-bold text-slate-900">{selectedRecord.student?.fullName}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Email Address</span>
                        <span className="font-bold text-slate-900 break-all">{selectedRecord.student?.email}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Mobile Phone</span>
                        <span className="font-bold text-slate-900">{selectedRecord.student?.mobile || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">College / University</span>
                        <span className="font-bold text-slate-900">{selectedRecord.student?.college || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Course & Branch</span>
                        <span className="font-bold text-slate-900">
                          {selectedRecord.student?.course || 'B.Tech'} - {selectedRecord.student?.branch || 'CSE'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Year & Semester</span>
                        <span className="font-bold text-slate-900">
                          {selectedRecord.student?.year || '3rd Year'} ({selectedRecord.student?.semester || '5th'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Track */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 text-blue-600">
                      Internship Track & Terms
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Selected Domain:</span>
                        <span className="font-bold text-slate-900">{selectedRecord.domain?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration:</span>
                        <span className="font-bold text-slate-900">1 Month (Fixed Cohort)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mode:</span>
                        <span className="font-bold text-slate-900">Remote / Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Program Fee:</span>
                        <span className="font-bold text-emerald-700">100% Free (Zero Fee)</span>
                      </div>
                    </div>
                  </div>

                  {/* Technical & Resume */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 text-blue-600">
                      Technical Profile & Links
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      {selectedRecord.technical?.skills && (
                        <div>
                          <span className="text-xs text-slate-400 block mb-1">Key Technical Skills:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(selectedRecord.technical.skills)
                              ? selectedRecord.technical.skills.map((s, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                                    {s}
                                  </span>
                                ))
                              : String(selectedRecord.technical.skills).split(',').map((s, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                                    {s.trim()}
                                  </span>
                                ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 text-xs font-semibold">
                        {selectedRecord.technical?.githubUrl && (
                          <a href={selectedRecord.technical.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            GitHub Profile &rarr;
                          </a>
                        )}
                        {selectedRecord.technical?.linkedinUrl && (
                          <a href={selectedRecord.technical.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            LinkedIn Profile &rarr;
                          </a>
                        )}
                        {selectedRecord.technical?.portfolioUrl && (
                          <a href={selectedRecord.technical.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            Portfolio Website &rarr;
                          </a>
                        )}
                      </div>

                      {selectedRecord.technical?.resumeFileName && (
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Submitted Resume:</span>
                          <span className="font-mono text-slate-900 font-semibold">{selectedRecord.technical.resumeFileName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Motivation / SOP */}
                  {selectedRecord.statementOfPurpose && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-blue-600">
                        Statement of Purpose
                      </h4>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-700">
                        {selectedRecord.statementOfPurpose}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-6 border-t border-slate-200 flex items-center gap-3">
                {selectedRecord.status === 'shortlisted' ? (
                  <>
                    <a
                      href={`/api/prma/admin/applications/${encodeURIComponent(selectedRecord.applicationId)}/offer-letter`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm text-center shadow-md flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Official Offer Letter (PDF)
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      const rec = selectedRecord;
                      setSelectedRecord(null);
                      openShortlistModal(rec);
                    }}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Approve & Issue Offer Letter
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <PrmaFooter />
    </div>
  );
}
