import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Briefcase, DollarSign, MessageSquare,
  Search, Filter, CheckCircle2, Clock, XCircle, Package,
  ExternalLink, Download, Eye, RefreshCw, ChevronRight, AlertCircle
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';

export default function PrmaAdminPanel({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [internships, setInternships] = useState([]);
  const [careers, setCareers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

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
      console.warn('Using local state for admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const filteredInternships = internships.filter(item => {
    const matchesSearch =
      (item.student?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.student?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.applicationId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.domain?.title || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PrmaNavbar activeTab="admin" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              PRMA Tech™ Operations Hub
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin & Operations Console</h1>
            <p className="text-sm text-slate-500 mt-1">
              Live management of student admissions, job candidate profiles, corporate inquiries, and welcome kit dispatch.
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
              onClick={() => onNavigate('prma-internships-home')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Portal
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Overview Analytics', icon: ShieldCheck },
            { id: 'internships', label: `Internships (${internships.length})`, icon: Users },
            { id: 'careers', label: `Careers & Talent (${careers.length})`, icon: Briefcase },
            { id: 'inquiries', label: `Corporate Inquiries (${inquiries.length})`, icon: MessageSquare }
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
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Intern Apps</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">
                  {stats?.totalInternshipApplications || internships.length || '1'}
                </div>
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 mt-2">
                  Live cohort registrations
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Interns</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">
                  {stats?.activeInternships || internships.filter(i => i.status === 'shortlisted' || i.status === 'active').length || '1'}
                </div>
                <span className="inline-flex items-center text-xs font-medium text-purple-600 mt-2">
                  Enrolled & in training
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
                  {stats?.careerApplications || careers.length || '1'}
                </div>
                <span className="inline-flex items-center text-xs font-medium text-amber-600 mt-2">
                  Direct job submissions
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiries Received</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">
                  {stats?.inquiriesReceived || inquiries.length || '0'}
                </div>
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 mt-2">
                  B2B & student consultations
                </span>
              </div>
            </div>

            {/* Quick Action Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">Recent Internship Applications</h3>
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
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                        {app.status || 'Received'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">Recent Career Inquiries</h3>
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
                  placeholder="Search by student name, email, ID..."
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
                  <option value="all">All Statuses</option>
                  <option value="received">Received</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="kit_dispatched">Kit Dispatched</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Application ID</th>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Domain & Batch</th>
                      <th className="px-6 py-4">Fee Paid</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInternships.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                          No internship applications found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInternships.map(app => (
                        <tr key={app.applicationId} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                            {app.applicationId}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{app.student?.fullName}</p>
                            <p className="text-xs text-slate-400">{app.student?.email} • {app.student?.mobile}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{app.student?.college || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800">{app.domain?.title || 'Full-Stack Web Dev'}</p>
                            <p className="text-xs text-slate-400">{app.duration?.label || '8 Weeks'} • {app.batch?.label || 'Upcoming'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900">₹{app.totalAmount || 0}</span>
                            <span className={`block text-xs font-semibold ${app.paymentStatus === 'success' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {app.paymentStatus === 'success' ? '✓ Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={app.status || 'received'}
                              onChange={e => handleUpdateStatus(app.applicationId, e.target.value)}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="received">Received</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="accepted">Accepted</option>
                              <option value="kit_dispatched">Kit Dispatched</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedRecord(app)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                            >
                              Details
                            </button>
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
                      <th className="px-6 py-4">Portfolio / Resume</th>
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
                      careers.map(car => (
                        <tr key={car.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{car.fullName}</p>
                            <p className="text-xs text-slate-400">{car.email} • {car.phone}</p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {car.roleTitle}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600">
                            {car.experience || 'Fresher'}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {car.portfolioUrl ? (
                              <a
                                href={car.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                              >
                                {car.portfolioUrl.replace('https://', '')}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400">File: {car.resumeFileName || 'Resume.pdf'}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(car.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 capitalize">
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

        {/* TAB 4: INQUIRIES LIST */}
        {activeTab === 'inquiries' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Client / Lead</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Budget</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                          No corporate inquiries received yet.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map(inq => (
                        <tr key={inq.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{inq.fullName}</p>
                            <p className="text-xs text-slate-400">{inq.email} • {inq.phone}</p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-700">
                            {inq.company || 'Individual / Startup'}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800 text-xs">
                            {inq.service}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600">
                            {inq.budget}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                            {inq.message}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(inq.createdAt).toLocaleDateString()}
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

        {/* MODAL: Record Details */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 relative">
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                <Package className="w-4 h-4" />
                Application Dossier
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {selectedRecord.student?.fullName}
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">{selectedRecord.applicationId}</p>

              <div className="mt-6 space-y-4 text-sm divide-y divide-slate-100">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.student?.email}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Mobile:</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.student?.mobile}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">College / University:</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.student?.college || 'N/A'}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Domain:</span>
                  <span className="font-semibold text-blue-600">{selectedRecord.domain?.title}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Batch & Duration:</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.batch?.label} ({selectedRecord.duration?.label})</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Selected Welcome Goodies:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {(selectedRecord.goodies || []).map(g => g.name).join(', ') || 'Standard Kit'}
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Total Enrollment Amount:</span>
                  <span className="font-bold text-emerald-600">₹{selectedRecord.totalAmount}</span>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <PrmaFooter onNavigate={onNavigate} />
    </div>
  );
}
