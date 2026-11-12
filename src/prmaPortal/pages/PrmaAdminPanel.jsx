import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  FileText,
  UserCheck,
  UserX,
  Code2,
  Mail,
  Award,
  ListTodo,
  Package,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Download,
  Eye,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  Send,
  Sparkles,
  Calendar,
  GraduationCap,
  Building2,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  X,
  Globe,
  MapPin,
  FileCheck,
  Linkedin,
  Instagram,
  Github,
  Image as ImageIcon,
  Maximize2,
  Briefcase
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaDomainIcon from '../components/PrmaDomainIcon';
import { PRMA_GOODIES } from '../data/prmaGoodies';

export default function PrmaAdminPanel({ onNavigate, navigateToTab }) {
  // 11 Sidebar Section Tabs
  const [activeSection, setActiveSection] = useState('overview');
  // 'overview' | 'new-applications' | 'all-applications' | 'shortlisted' | 'rejected' |
  // 'domains' | 'emails' | 'letters' | 'tasks' | 'goodies' | 'settings'

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [domains, setDomains] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');

  // Dossier Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminRemarksInput, setAdminRemarksInput] = useState('');
  const [previewScreenshot, setPreviewScreenshot] = useState(null);

  // Shortlist Modal
  const [shortlistModalApp, setShortlistModalApp] = useState(null);
  const [joiningDateInput, setJoiningDateInput] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Task Creation Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    domainId: 'all',
    domainTitle: 'All Domains',
    title: '',
    description: '',
    deadline: '7 Days from assignment',
    resources: '',
    submissionInstructions: 'Push code to a public GitHub repository and email the link to support@prmatech.com'
  });

  // Domain Management Modal
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [newDomainData, setNewDomainData] = useState({
    title: '',
    shortTitle: '',
    category: 'Development',
    description: '',
    technologies: '',
    skills: '',
    project: '',
    iconType: 'frontend',
    color: '#3B82F6'
  });

  // Job Opening Management Modal
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '',
    category: 'Engineering',
    type: 'Internship',
    location: 'Remote',
    experience: 'Fresher / Student',
    stipend: 'Performance-based + Certificate',
    duration: '3 - 6 Months',
    shortDesc: '',
    skills: '',
    responsibilities: '',
    requirements: ''
  });

  // Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const navFn = onNavigate || navigateToTab;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 6000);
  };

  // Fetch all live data from backend APIs
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch('/api/prma/admin/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      // 2. Applications
      const appsRes = await fetch('/api/prma/admin/applications');
      if (appsRes.ok) {
        const data = await appsRes.json();
        setApplications(data.applications || []);
      }

      // 3. Domains
      const domRes = await fetch('/api/prma/domains');
      if (domRes.ok) {
        const data = await domRes.json();
        setDomains(data.domains || []);
      }

      // 4. Tasks
      const tasksRes = await fetch('/api/prma/admin/tasks');
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.tasks || []);
      }

      // 5. Emails
      const emailRes = await fetch('/api/prma/admin/emails');
      if (emailRes.ok) {
        const data = await emailRes.json();
        setEmailLogs(data.emails || []);
      }

      // 6. Careers Jobs & Applications
      const jobsRes = await fetch('/api/prma/admin/jobs');
      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data.jobs || []);
      }

      const jobAppsRes = await fetch('/api/prma/admin/job-applications');
      if (jobAppsRes.ok) {
        const data = await jobAppsRes.json();
        setJobApplications(data.applications || []);
      }
    } catch (err) {
      console.warn('Failed to load live admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filter applications
  const getFilteredList = (baseList) => {
    return baseList.filter(app => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (app.student?.fullName || '').toLowerCase().includes(q) ||
        (app.student?.email || '').toLowerCase().includes(q) ||
        (app.student?.mobile || '').includes(q) ||
        (app.applicationId || '').toLowerCase().includes(q) ||
        (app.offerId || '').toLowerCase().includes(q) ||
        (app.academic?.college || '').toLowerCase().includes(q) ||
        (app.academic?.university || '').toLowerCase().includes(q) ||
        (app.technical?.domainTitle || '').toLowerCase().includes(q);

      const matchesDomain =
        domainFilter === 'all' ||
        app.technical?.domainId === domainFilter ||
        app.technical?.domainTitle === domainFilter;

      const matchesCollege =
        collegeFilter === 'all' ||
        (app.academic?.college || '').toLowerCase().includes(collegeFilter.toLowerCase());

      return matchesSearch && matchesDomain && matchesCollege;
    });
  };

  // Applications partitions
  const newApps = applications.filter(a => a.status === 'submitted' || a.status === 'pending');
  const shortlistedApps = applications.filter(a => a.status === 'shortlisted' || a.status === 'approved');
  const rejectedApps = applications.filter(a => a.status === 'rejected');

  // Trigger Shortlist Modal
  const openShortlistModal = (app) => {
    setShortlistModalApp(app);
    // Suggest joining date next week
    const nextWeek = new Date(Date.now() + 7 * 86400000);
    const day = String(nextWeek.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    setJoiningDateInput(`${day}-${months[nextWeek.getMonth()]}-${nextWeek.getFullYear()}`);
  };

  // Confirm Shortlisting
  const handleConfirmShortlist = async () => {
    if (!shortlistModalApp) return;
    setIsProcessingAction(true);
    try {
      const res = await fetch(`/api/prma/admin/applications/${shortlistModalApp.applicationId}/shortlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          joiningDate: joiningDateInput,
          adminRemarks: adminRemarksInput || 'Approved for 1-month virtual internship.'
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`✓ Candidate ${shortlistModalApp.student?.fullName} approved! Offer ID: ${data.offerId}. Vector PDF created and official email dispatched.`);
        setShortlistModalApp(null);
        setSelectedApp(null);
        loadAllData();
      } else {
        alert(data.error || 'Failed to approve application.');
      }
    } catch (err) {
      alert('Error approving application: ' + err.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Reject Application
  const handleRejectApp = async (app) => {
    const reason = prompt('Enter rejection remarks (optional):', 'Profile not selected for this cohort due to seat limits.');
    if (reason === null) return;

    try {
      const res = await fetch(`/api/prma/admin/applications/${app.applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks: reason, sendEmail: true })
      });
      if (res.ok) {
        showToast(`Application ${app.applicationId} marked as Rejected.`);
        setSelectedApp(null);
        loadAllData();
      }
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  // Mark Under Review
  const handleMarkReview = async (app) => {
    try {
      const res = await fetch(`/api/prma/admin/applications/${app.applicationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks: 'Candidate profile currently undergoing academic evaluation.' })
      });
      if (res.ok) {
        showToast(`Application ${app.applicationId} status updated to Under Review.`);
        setSelectedApp(null);
        loadAllData();
      }
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  // Resend Shortlist Email
  const handleResendEmail = async (app) => {
    if (!window.confirm(`Resend official joining letter email to ${app.student?.email}?`)) return;
    try {
      const res = await fetch(`/api/prma/admin/applications/${app.applicationId}/shortlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceResend: true, joiningDate: app.joiningDate })
      });
      if (res.ok) {
        showToast(`Joining letter email re-dispatched to ${app.student?.email}.`);
        loadAllData();
      }
    } catch (e) {
      alert('Error resending email: ' + e.message);
    }
  };

  // Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/prma/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData)
      });
      if (res.ok) {
        showToast('✓ Technical task created successfully!');
        setShowCreateTaskModal(false);
        setNewTaskData({
          domainId: 'all',
          domainTitle: 'All Domains',
          title: '',
          description: '',
          deadline: '7 Days from assignment',
          resources: '',
          submissionInstructions: ''
        });
        loadAllData();
      }
    } catch (e) {
      alert('Error creating task: ' + e.message);
    }
  };

  // Dispatch Task to Students via Email
  const handleDispatchTask = async (task) => {
    if (!window.confirm(`Dispatch "${task.title}" via email to all shortlisted students in ${task.domainTitle}?`)) return;
    try {
      const res = await fetch(`/api/prma/admin/tasks/${task.id}/dispatch`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✓ Task dispatched to ${data.dispatchedCount} students via email!`);
        loadAllData();
      } else {
        alert(data.error || 'Failed to dispatch task.');
      }
    } catch (e) {
      alert('Error dispatching task: ' + e.message);
    }
  };

  // Create New Domain
  const handleCreateDomain = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/prma/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDomainData)
      });
      if (res.ok) {
        showToast('✓ Domain added to catalog!');
        setShowAddDomainModal(false);
        setNewDomainData({
          title: '',
          shortTitle: '',
          category: 'Development',
          description: '',
          technologies: '',
          skills: '',
          project: '',
          iconType: 'frontend',
          color: '#3B82F6'
        });
        loadAllData();
      }
    } catch (e) {
      alert('Error creating domain: ' + e.message);
    }
  };

  // Toggle Domain Status
  const handleToggleDomain = async (dom) => {
    try {
      const res = await fetch(`/api/prma/domains/${dom.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Domain "${dom.title}" status toggled.`);
        loadAllData();
      }
    } catch (e) {
      alert('Error toggling domain: ' + e.message);
    }
  };

  // Change Application Status (Pending, Under Review, Approved, Rejected)
  const handleChangeStatus = async (app, newStatus) => {
    if (newStatus === 'shortlisted' || newStatus === 'approved') {
      openShortlistModal(app);
      return;
    }
    if (newStatus === 'rejected') {
      handleRejectApp(app);
      return;
    }
    try {
      const res = await fetch(`/api/prma/admin/applications/${app.applicationId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus === 'pending' ? 'submitted' : newStatus })
      });
      if (res.ok) {
        showToast(`Application ${app.applicationId} status updated to ${newStatus}.`);
        if (selectedApp) {
          setSelectedApp(prev => prev ? { ...prev, status: newStatus === 'pending' ? 'submitted' : newStatus } : null);
        }
        loadAllData();
      }
    } catch (e) {
      alert('Error changing status: ' + e.message);
    }
  };

  // Create Job Opening
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/prma/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJobData)
      });
      if (res.ok) {
        showToast('✓ Job opening published successfully!');
        setShowAddJobModal(false);
        setNewJobData({
          title: '',
          category: 'Engineering',
          type: 'Internship',
          location: 'Remote',
          experience: 'Fresher / Student',
          stipend: 'Performance-based + Certificate',
          duration: '3 - 6 Months',
          shortDesc: '',
          skills: '',
          responsibilities: '',
          requirements: ''
        });
        loadAllData();
      }
    } catch (e) {
      alert('Error creating job: ' + e.message);
    }
  };

  // Delete Job Opening
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job opening?')) return;
    try {
      const res = await fetch(`/api/prma/admin/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Job opening removed.');
        loadAllData();
      }
    } catch (e) {
      alert('Error deleting job: ' + e.message);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // Sidebar Menu Items
  const sidebarItems = [
    { id: 'overview', label: 'Internship Overview', icon: LayoutDashboard, count: null },
    { id: 'new-applications', label: 'New Applications', icon: Clock, count: newApps.length, badgeColor: 'bg-blue-600 text-white' },
    { id: 'all-applications', label: 'All Applications', icon: Users, count: applications.length },
    { id: 'shortlisted', label: 'Shortlisted Students', icon: UserCheck, count: shortlistedApps.length, badgeColor: 'bg-emerald-600 text-white' },
    { id: 'rejected', label: 'Rejected Applications', icon: UserX, count: rejectedApps.length },
    { id: 'domains', label: 'Domain Management', icon: Code2, count: domains.length },
    { id: 'careers', label: 'Careers & Jobs', icon: Briefcase, count: jobs.length },
    { id: 'tasks', label: 'Internship Tasks', icon: ListTodo, count: tasks.length },
    { id: 'letters', label: 'Joining Letters', icon: Award, count: shortlistedApps.length },
    { id: 'emails', label: 'Email Management', icon: Mail, count: emailLogs.length },
    { id: 'goodies', label: 'Goodies Management', icon: Package, count: 9 },
    { id: 'settings', label: 'Settings', icon: Settings, count: null }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <PrmaNavbar activeTab="admin" onNavigate={navFn} navigateToTab={navFn} />

      {/* Main Admin Controller Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* SIDEBAR NAVIGATION — REQUIREMENT 6 */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs sticky top-24">
            <div className="px-3 pb-4 mb-2 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                Controller Portal
              </span>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h2 className="font-black text-slate-900 text-base">PRMA TECH CONTROL</h2>
              </div>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={loadAllData}
                className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh DB
              </button>
              <button
                type="button"
                onClick={() => navFn && navFn('prma-home')}
                className="text-slate-400 hover:text-slate-700 font-semibold flex items-center gap-1"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {toastMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* SECTION 1: INTERNSHIP OVERVIEW (REAL DB STATS — REQUIREMENT 6.A) */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Internship Overview</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Real database metrics computed live from submitted student applications
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                    100% Free Internship Engine Active
                  </span>
                </div>

                {/* 5 Real DB Statistic Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Applications</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{applications.length}</div>
                    <span className="text-[10px] text-slate-500">All cohorts combined</span>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">New Applications</span>
                    <div className="text-2xl font-black text-blue-900 mt-1">{newApps.length}</div>
                    <span className="text-[10px] text-blue-600">Awaiting screening</span>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Under Review</span>
                    <div className="text-2xl font-black text-amber-900 mt-1">
                      {applications.filter(a => a.status === 'under_review').length}
                    </div>
                    <span className="text-[10px] text-amber-600">In evaluation</span>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Shortlisted</span>
                    <div className="text-2xl font-black text-emerald-900 mt-1">{shortlistedApps.length}</div>
                    <span className="text-[10px] text-emerald-600">Offer letter issued</span>
                  </div>

                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Rejected</span>
                    <div className="text-2xl font-black text-rose-900 mt-1">{rejectedApps.length}</div>
                    <span className="text-[10px] text-rose-600">Seat limits reached</span>
                  </div>
                </div>

                {/* Domain & College Distribution Breakdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {/* Applications by Domain */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 text-sm mb-3">Applications by Domain</h4>
                    {stats?.byDomain && Object.keys(stats.byDomain).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(stats.byDomain).slice(0, 6).map(([dom, count]) => (
                          <div key={dom} className="flex items-center justify-between text-xs">
                            <span className="text-slate-700 font-medium truncate max-w-[200px]">{dom}</span>
                            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No applications recorded yet.</p>
                    )}
                  </div>

                  {/* Applications by College */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 text-sm mb-3">Applications by College</h4>
                    {stats?.byCollege && Object.keys(stats.byCollege).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(stats.byCollege).slice(0, 6).map(([col, count]) => (
                          <div key={col} className="flex items-center justify-between text-xs">
                            <span className="text-slate-700 font-medium truncate max-w-[200px]">{col}</span>
                            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No college data available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: NEW APPLICATIONS (Awaiting Review — Requirement 6.B) */}
          {activeSection === 'new-applications' && (
            <ApplicationsTable
              title="New Applications (Awaiting Review)"
              subtitle="Recently submitted student applications ready for academic screening"
              applications={getFilteredList(newApps)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectApp={setSelectedApp}
              onApprove={openShortlistModal}
              onReject={handleRejectApp}
              onReview={handleMarkReview}
              onChangeStatus={handleChangeStatus}
              domains={domains}
              domainFilter={domainFilter}
              setDomainFilter={setDomainFilter}
            />
          )}

          {/* SECTION 3: ALL APPLICATIONS */}
          {activeSection === 'all-applications' && (
            <ApplicationsTable
              title="All Internship Applications"
              subtitle="Searchable complete registry of student applications across all statuses"
              applications={getFilteredList(applications)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectApp={setSelectedApp}
              onApprove={openShortlistModal}
              onReject={handleRejectApp}
              onReview={handleMarkReview}
              onChangeStatus={handleChangeStatus}
              domains={domains}
              domainFilter={domainFilter}
              setDomainFilter={setDomainFilter}
            />
          )}

          {/* SECTION 4: SHORTLISTED STUDENTS */}
          {activeSection === 'shortlisted' && (
            <ApplicationsTable
              title="Shortlisted Students"
              subtitle="Approved candidates with generated vector PDF offer letters and issued credentials"
              applications={getFilteredList(shortlistedApps)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectApp={setSelectedApp}
              onApprove={openShortlistModal}
              onReject={handleRejectApp}
              onReview={handleMarkReview}
              onChangeStatus={handleChangeStatus}
              onResendEmail={handleResendEmail}
              domains={domains}
              domainFilter={domainFilter}
              setDomainFilter={setDomainFilter}
              isShortlistedView
            />
          )}

          {/* SECTION 5: REJECTED APPLICATIONS */}
          {activeSection === 'rejected' && (
            <ApplicationsTable
              title="Rejected Applications"
              subtitle="Applications marked as rejected for current cohort"
              applications={getFilteredList(rejectedApps)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectApp={setSelectedApp}
              onApprove={openShortlistModal}
              onReject={handleRejectApp}
              onReview={handleMarkReview}
              onChangeStatus={handleChangeStatus}
              domains={domains}
              domainFilter={domainFilter}
              setDomainFilter={setDomainFilter}
            />
          )}

          {/* SECTION 6: DOMAIN MANAGEMENT (REQUIREMENT 10) */}
          {activeSection === 'domains' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Domain Management</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage active engineering tracks, skills, capstone projects, and technologies
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDomainModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add New Domain
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domains.map((dom) => (
                  <div key={dom.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          dom.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {dom.active !== false ? 'Active Track' : 'Disabled'}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{dom.code || dom.id}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base">{dom.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dom.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(dom.technologies || []).slice(0, 4).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-600 text-[10px] border border-slate-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">1 Month &bull; Remote</span>
                      <button
                        type="button"
                        onClick={() => handleToggleDomain(dom)}
                        className={`font-bold hover:underline ${dom.active !== false ? 'text-rose-600' : 'text-emerald-600'}`}
                      >
                        {dom.active !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: CAREERS & JOB OPENINGS MANAGEMENT */}
          {activeSection === 'careers' && (
            <div className="space-y-8">
              {/* Job Openings Manager */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">PRMA Tech Careers &amp; Openings</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage published job openings on /prma-tech/careers and review candidate submissions</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddJobModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Job Opening
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                      No published job openings found. Click "Add Job Opening" to post a new vacancy.
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div key={job.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                              {job.category}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {job.type}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-base">{job.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{job.location} &bull; {job.experience}</p>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2">{job.shortDesc}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {(job.skills || []).slice(0, 4).map((sk, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 text-[10px]">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-semibold text-slate-500">{job.duration}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job.id)}
                            className="font-bold text-rose-600 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submitted Job Applications */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h4 className="text-lg font-black text-slate-900">Career Applications Received ({jobApplications.length})</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Real candidate applications submitted through /prma-tech/careers</p>
                </div>

                {jobApplications.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No career applications received yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                          <th className="py-3 px-3">Applicant</th>
                          <th className="py-3 px-3">Role Applied</th>
                          <th className="py-3 px-3">College &amp; Year</th>
                          <th className="py-3 px-3">Profiles &amp; Resume</th>
                          <th className="py-3 px-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {jobApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3">
                              <p className="font-bold text-slate-900">{app.fullName}</p>
                              <p className="text-slate-500 text-[11px]">{app.email}</p>
                              {app.phone && <p className="text-slate-400 text-[10px]">{app.phone}</p>}
                            </td>
                            <td className="py-3 px-3 font-semibold text-blue-600">
                              {app.jobTitle}
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              <p>{app.college || 'Not specified'}</p>
                              <p className="text-slate-400 text-[10px]">{app.graduationYear}</p>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                {app.resumeFileName && (
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                                    {app.resumeFileName}
                                  </span>
                                )}
                                {app.linkedinUrl && (
                                  <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                    LinkedIn &rarr;
                                  </a>
                                )}
                                {app.githubUrl && (
                                  <a href={app.githubUrl} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                                    GitHub &rarr;
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-400 text-[11px]">
                              {new Date(app.submittedAt).toLocaleDateString('en-GB')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 7: EMAIL MANAGEMENT / AUDIT LOG */}
          {activeSection === 'emails' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-6 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900">Email Delivery &amp; Audit Log</h3>
                <p className="text-xs text-slate-500 mt-1">
                  History of all automated transactional transmissions (Joining letters, task instructions, notices)
                </p>
              </div>

              {emailLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No automated emails logged yet. Emails are dispatched when students are shortlisted or tasks sent.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Recipient</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {emailLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{log.studentName || log.recipient}</span>
                            <span className="text-slate-400 font-mono text-[11px]">{log.recipient}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                              {log.type}
                            </span>
                            {log.offerId && <span className="block font-mono text-slate-500 mt-0.5">{log.offerId}</span>}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {log.status || 'Sent'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {new Date(log.timestamp).toLocaleString('en-GB')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SECTION 8: JOINING LETTER MANAGEMENT (REQUIREMENT 7) */}
          {activeSection === 'letters' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-6 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900">Official Joining Letter Registry</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Generated A4 vector PDF offer letters matching approved layout with scannable QR verification
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shortlistedApps.map((app) => (
                  <div key={app.applicationId} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-600 text-xs">{app.offerId || 'PRMA/INT/A1/...'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                        OFFICIAL OFFER
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{app.student?.fullName}</h4>
                      <p className="text-xs text-slate-500">{app.technical?.domainTitle || 'Internship Track'}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Joining: {app.joiningDate || '17-Nov-2026'} &bull; Duration: 1 Month
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <a
                        href={`/prma-tech/verify-offer/${encodeURIComponent(app.offerId || app.applicationId)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verify Credential
                      </a>

                      <a
                        href={`/api/prma/admin/applications/${encodeURIComponent(app.applicationId)}/offer-letter`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 9: INTERNSHIP TASKS (REQUIREMENT 9) */}
          {activeSection === 'tasks' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Internship Task Dispatcher</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Send technical tasks, milestones, and learning resources to students via registered email
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create Technical Task
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                          {task.domainTitle}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {task.id}</span>
                      </div>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 self-start sm:self-auto">
                        Deadline: {task.deadline}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base">{task.title}</h4>
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{task.description}</p>

                    {task.resources && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                        <strong className="text-slate-700 block mb-1">Learning Resources:</strong>
                        <span className="text-slate-600 whitespace-pre-line">{task.resources}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Dispatched {task.dispatchedCount || 0} times
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDispatchTask(task)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Dispatch via Email to Students
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 10: GOODIES MANAGEMENT */}
          {activeSection === 'goodies' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-6 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900">Goodies Suite (Coming Soon Showcase)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Catalog of 9 merchandise items presented to students with Zero Pricing and Coming Soon badge
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PRMA_GOODIES.map((g) => (
                  <div key={g.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 bg-white rounded-xl mb-4 overflow-hidden flex items-center justify-center p-3 border border-slate-100">
                        <img src={g.image} alt={g.name} className="max-h-full max-w-full object-contain" />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-600 text-white">
                          COMING SOON
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base">{g.name}</h4>
                      <p className="text-xs text-purple-600 font-bold mb-1">{g.subtitle}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{g.description}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-200 mt-4 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-600">Free Kit Item</span>
                      <span className="text-slate-400 font-mono">₹0 Fee</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 11: SETTINGS */}
          {activeSection === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-6 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900">Portal Configuration &amp; Channels</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Official contact channels, social handles, and authorized signing officers
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Email</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">support@prmatech.com</span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Official Website</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">www.prmatech.com</span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">LinkedIn Page</span>
                  <span className="font-bold text-blue-600 text-sm">https://www.linkedin.com/company/prmatech</span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Instagram Page</span>
                  <span className="font-bold text-pink-600 text-sm">https://www.instagram.com/prmatech</span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 sm:col-span-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Authorized Signatory</span>
                  <span className="font-bold text-slate-900 text-sm block">Rahul Verma</span>
                  <span className="text-slate-500">Co-Founder &amp; Chief Operating Officer, PRMA Tech</span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 sm:col-span-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Corporate Address</span>
                  <span className="font-bold text-slate-900 text-sm block">
                    PRMA Tech, Knowledge Park, Greater Noida, Uttar Pradesh – 201310, India
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* COMPLETE APPLICATION DOSSIER SLIDE-OVER (REQUIREMENT 6.C) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-2xl p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between animate-slide-left">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="font-mono font-bold text-blue-600 text-xs">{selectedApp.applicationId}</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Candidate Application Dossier</h3>
                </div>
                <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="my-6 p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-bold block">Status</span>
                  <span className="font-black text-slate-900 text-sm capitalize">{selectedApp.status || 'Submitted'}</span>
                </div>
                {selectedApp.offerId && (
                  <div className="text-right">
                    <span className="text-slate-400 uppercase tracking-wider font-bold block">Offer ID</span>
                    <span className="font-mono font-black text-blue-600 text-sm">{selectedApp.offerId}</span>
                  </div>
                )}
              </div>

              {/* Section A: Personal Information */}
              <div className="space-y-4 mb-6">
                <h4 className="font-black text-xs uppercase tracking-wider text-blue-600">
                  A &bull; Personal &amp; Contact Details
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Full Name</span>
                    <span className="font-bold text-slate-900">{selectedApp.student?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Date of Birth</span>
                    <span className="font-bold text-slate-900">{selectedApp.student?.dob || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Email Address</span>
                    <span className="font-bold text-slate-900 break-all">{selectedApp.student?.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Mobile Number</span>
                    <span className="font-bold text-slate-900">{selectedApp.student?.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Gender</span>
                    <span className="font-bold text-slate-900">{selectedApp.student?.gender || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">City &amp; State</span>
                    <span className="font-bold text-slate-900">
                      {selectedApp.student?.city || ''}, {selectedApp.student?.state || ''} ({selectedApp.student?.pinCode || ''})
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block font-medium">Address</span>
                    <span className="font-bold text-slate-900">{selectedApp.student?.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Section B: Academic Information */}
              <div className="space-y-4 mb-6">
                <h4 className="font-black text-xs uppercase tracking-wider text-purple-600">
                  B &bull; Academic Background
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div>
                    <span className="text-slate-400 block font-medium">College Name</span>
                    <span className="font-bold text-slate-900">{selectedApp.academic?.college || selectedApp.student?.college}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Affiliated University</span>
                    <span className="font-bold text-slate-900">{selectedApp.academic?.university || 'AKTU Lucknow'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-medium">Course &amp; Branch</span>
                      <span className="font-bold text-slate-900">
                        {selectedApp.academic?.course} - {selectedApp.academic?.branch}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Year &amp; Semester</span>
                      <span className="font-bold text-slate-900">
                        {selectedApp.academic?.year} ({selectedApp.academic?.semester || '5th'})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section C & D: Technical, Profiles, Resume */}
              <div className="space-y-4 mb-6">
                <h4 className="font-black text-xs uppercase tracking-wider text-emerald-600">
                  C, D &amp; E &bull; Technical, Profiles &amp; Resume
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
                  <div>
                    <span className="text-slate-400 block font-medium">Selected Domain</span>
                    <span className="font-black text-slate-900 text-sm">
                      {selectedApp.technical?.domainTitle || selectedApp.domain?.title}
                    </span>
                  </div>

                  {selectedApp.technical?.skills && (
                    <div>
                      <span className="text-slate-400 block font-medium mb-1">Key Technical Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(selectedApp.technical.skills)
                          ? selectedApp.technical.skills
                          : String(selectedApp.technical.skills).split(',')
                        ).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
                    {selectedApp.profiles?.githubUrl && (
                      <a
                        href={selectedApp.profiles.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline"
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub Profile &rarr;
                      </a>
                    )}
                    {selectedApp.profiles?.linkedinUrl && (
                      <a
                        href={selectedApp.profiles.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn Profile &rarr;
                      </a>
                    )}
                  </div>

                  {selectedApp.resume && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-medium text-slate-600">
                        {selectedApp.resume.fileName || 'Candidate_Resume.pdf'}
                      </span>
                      <a
                        href={`/api/prma/admin/applications/${encodeURIComponent(selectedApp.applicationId)}/resume`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        Download Resume (PDF)
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Follow Verification Section - Mandatory Proofs */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Mandatory Social Media Proofs
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Review screenshots before decision
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* LinkedIn Follow Proof */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0077B5] flex items-center gap-1">
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn Follow
                      </span>
                      {selectedApp.socialFollow?.followedLinkedIn ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Checked
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Unchecked
                        </span>
                      )}
                    </div>

                    {(selectedApp.socialFollow?.linkedinScreenshot || selectedApp.linkedinScreenshotUrl) ? (
                      <div className="space-y-1.5">
                        <div
                          onClick={() => setPreviewScreenshot({
                            title: 'LinkedIn Follow Verification Screenshot',
                            platform: 'LinkedIn',
                            url: selectedApp.socialFollow?.linkedinScreenshot || selectedApp.linkedinScreenshotUrl,
                            studentName: selectedApp.student?.fullName,
                            appId: selectedApp.applicationId
                          })}
                          className="relative rounded-lg overflow-hidden border border-slate-200 cursor-pointer group bg-slate-900/5 h-28 flex items-center justify-center"
                        >
                          <img
                            src={selectedApp.socialFollow?.linkedinScreenshot || selectedApp.linkedinScreenshotUrl}
                            alt="LinkedIn Screenshot Proof"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-xs font-bold">
                            <Eye className="w-4 h-4" />
                            Click to View
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshot({
                            title: 'LinkedIn Follow Verification Screenshot',
                            platform: 'LinkedIn',
                            url: selectedApp.socialFollow?.linkedinScreenshot || selectedApp.linkedinScreenshotUrl,
                            studentName: selectedApp.student?.fullName,
                            appId: selectedApp.applicationId
                          })}
                          className="w-full py-1 text-center text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View LinkedIn Screenshot
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-center p-2 text-xs text-slate-400">
                        No LinkedIn screenshot uploaded
                      </div>
                    )}
                  </div>

                  {/* Instagram Follow Proof */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-pink-600 flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5" />
                        Instagram Follow
                      </span>
                      {selectedApp.socialFollow?.followedInstagram ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Checked
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Unchecked
                        </span>
                      )}
                    </div>

                    {(selectedApp.socialFollow?.instagramScreenshot || selectedApp.instagramScreenshotUrl) ? (
                      <div className="space-y-1.5">
                        <div
                          onClick={() => setPreviewScreenshot({
                            title: 'Instagram Follow Verification Screenshot',
                            platform: 'Instagram',
                            url: selectedApp.socialFollow?.instagramScreenshot || selectedApp.instagramScreenshotUrl,
                            studentName: selectedApp.student?.fullName,
                            appId: selectedApp.applicationId
                          })}
                          className="relative rounded-lg overflow-hidden border border-slate-200 cursor-pointer group bg-slate-900/5 h-28 flex items-center justify-center"
                        >
                          <img
                            src={selectedApp.socialFollow?.instagramScreenshot || selectedApp.instagramScreenshotUrl}
                            alt="Instagram Screenshot Proof"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-xs font-bold">
                            <Eye className="w-4 h-4" />
                            Click to View
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshot({
                            title: 'Instagram Follow Verification Screenshot',
                            platform: 'Instagram',
                            url: selectedApp.socialFollow?.instagramScreenshot || selectedApp.instagramScreenshotUrl,
                            studentName: selectedApp.student?.fullName,
                            appId: selectedApp.applicationId
                          })}
                          className="w-full py-1 text-center text-[11px] font-bold text-pink-600 hover:underline flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View Instagram Screenshot
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-center p-2 text-xs text-slate-400">
                        No Instagram screenshot uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Drawer */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                  selectedApp.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                  selectedApp.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                  selectedApp.status === 'under_review' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedApp.status === 'shortlisted' ? 'Approved / Shortlisted' :
                   selectedApp.status === 'rejected' ? 'Rejected' :
                   selectedApp.status === 'under_review' ? 'Under Review' : 'Pending / Submitted'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedApp.status === 'shortlisted' ? (
                  <>
                    <a
                      href={`/api/prma/admin/applications/${encodeURIComponent(selectedApp.applicationId)}/offer-letter`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Joining Letter (PDF)
                    </a>
                    <button
                      type="button"
                      onClick={() => handleResendEmail(selectedApp)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Resend Email
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeStatus(selectedApp, 'under_review')}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Revert to Review
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => openShortlistModal(selectedApp)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Approve &amp; Issue Offer
                    </button>
                    {selectedApp.status !== 'under_review' && (
                      <button
                        type="button"
                        onClick={() => handleChangeStatus(selectedApp, 'under_review')}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Keep Under Review
                      </button>
                    )}
                    {selectedApp.status !== 'submitted' && (
                      <button
                        type="button"
                        onClick={() => handleChangeStatus(selectedApp, 'submitted')}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Mark Pending
                      </button>
                    )}
                    {selectedApp.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => handleRejectApp(selectedApp)}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold"
                      >
                        Reject
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE / SHORTLIST MODAL (REQUIREMENT 6.D) */}
      {shortlistModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Approve &amp; Issue Joining Letter</h3>
                  <p className="text-xs text-slate-500">100% Free 1-Month Remote Internship</p>
                </div>
              </div>
              <button onClick={() => setShortlistModalApp(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Candidate:</span>
                  <span className="font-bold text-slate-900">{shortlistModalApp.student?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Domain:</span>
                  <span className="font-bold text-blue-600">
                    {shortlistModalApp.technical?.domainTitle || shortlistModalApp.domain?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="font-bold text-slate-800">{shortlistModalApp.student?.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assigned Joining Date (DD-MMM-YYYY):
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={joiningDateInput}
                    onChange={(e) => setJoiningDateInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Internal Remarks (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent Python fundamentals and project portfolio"
                  value={adminRemarksInput}
                  onChange={(e) => setAdminRemarksInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Automated Approval Pipeline:
                </div>
                <p>1. Generates unique Offer ID (PRMA/INT/A1/...).</p>
                <p>2. Populates vector PDF joining letter matching approved template.</p>
                <p>3. Generates and embeds dynamic scannable verification QR code.</p>
                <p>4. Automatically dispatches official approval email with PDF attached to student.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={() => setShortlistModalApp(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={handleConfirmShortlist}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessingAction ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating PDF &amp; Dispatching Email...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Approve &amp; Send Joining Letter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TECHNICAL TASK MODAL (REQUIREMENT 9) */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">Create Technical Task</h3>
              <button onClick={() => setShowCreateTaskModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Target Domain</label>
                <select
                  value={newTaskData.domainTitle}
                  onChange={(e) => {
                    const match = domains.find(d => d.title === e.target.value);
                    setNewTaskData(p => ({
                      ...p,
                      domainTitle: e.target.value,
                      domainId: match ? match.id : 'all'
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Domains">All Domains (Broad Assignment)</option>
                  {domains.map(d => (
                    <option key={d.id} value={d.title}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milestone 2: Build REST API & Data Schema"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Description &amp; Steps *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed instructions for the students..."
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Deadline</label>
                <input
                  type="text"
                  placeholder="e.g. 7 Days from assignment"
                  value={newTaskData.deadline}
                  onChange={(e) => setNewTaskData(p => ({ ...p, deadline: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Learning Resources</label>
                <textarea
                  rows={2}
                  placeholder="Documentation links, YouTube tutorials, reading references..."
                  value={newTaskData.resources}
                  onChange={(e) => setNewTaskData(p => ({ ...p, resources: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DOMAIN MODAL (REQUIREMENT 10) */}
      {showAddDomainModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">Add New Internship Domain</h3>
              <button onClick={() => setShowAddDomainModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDomain} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Domain Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blockchain & Web3 Technologies"
                  value={newDomainData.title}
                  onChange={(e) => setNewDomainData(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={newDomainData.category}
                  onChange={(e) => setNewDomainData(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AI & Data Science">AI &amp; Data Science</option>
                  <option value="Development">Development</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cloud & Infrastructure">Cloud &amp; Infrastructure</option>
                  <option value="Security & Systems">Security &amp; Systems</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Design & Experience">Design &amp; Experience</option>
                  <option value="Business & Management">Business &amp; Management</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Overview of the track..."
                  value={newDomainData.description}
                  onChange={(e) => setNewDomainData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Solidity, Web3.js, Ethereum, Hardhat"
                  value={newDomainData.technologies}
                  onChange={(e) => setNewDomainData(p => ({ ...p, technologies: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDomainModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD JOB OPENING MODAL */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">Add New Job Opening</h3>
              <button onClick={() => setShowAddJobModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Developer Intern"
                  value={newJobData.title}
                  onChange={(e) => setNewJobData(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newJobData.category}
                    onChange={(e) => setNewJobData(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Type</label>
                  <select
                    value={newJobData.type}
                    onChange={(e) => setNewJobData(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Remote / Hybrid"
                    value={newJobData.location}
                    onChange={(e) => setNewJobData(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="Fresher / Student"
                    value={newJobData.experience}
                    onChange={(e) => setNewJobData(p => ({ ...p, experience: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of responsibilities and mission..."
                  value={newJobData.shortDesc}
                  onChange={(e) => setNewJobData(p => ({ ...p, shortDesc: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, TypeScript, PostgreSQL"
                  value={newJobData.skills}
                  onChange={(e) => setNewJobData(p => ({ ...p, skills: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Full-Size Social Screenshot Lightbox Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-600">
                  {previewScreenshot.platform} Verification Proof
                </span>
                <h4 className="text-base font-bold text-slate-900">{previewScreenshot.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewScreenshot(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto py-4 flex items-center justify-center bg-slate-50 rounded-2xl my-3">
              <img
                src={previewScreenshot.url}
                alt={`${previewScreenshot.platform} follow proof for ${previewScreenshot.name}`}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-xs"
              />
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Official {previewScreenshot.platform} Follow Screenshot
              </span>
              <button
                type="button"
                onClick={() => setPreviewScreenshot(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <PrmaFooter />
    </div>
  );
}

// Reusable Sub-Component for Applications Tables
function ApplicationsTable({
  title,
  subtitle,
  applications,
  searchQuery,
  setSearchQuery,
  onSelectApp,
  onApprove,
  onReject,
  onReview,
  onResendEmail,
  onChangeStatus,
  domains,
  domainFilter,
  setDomainFilter,
  isShortlistedView
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-black text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Domains</option>
            {domains.map(d => (
              <option key={d.id} value={d.id}>{d.shortTitle || d.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <th className="py-3 px-4">Application ID</th>
              <th className="py-3 px-4">Student &amp; College</th>
              <th className="py-3 px-4">Domain</th>
              <th className="py-3 px-4">Profiles / Resume</th>
              <th className="py-3 px-4">Status Lifecycle</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {applications.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400">
                  No applications found matching the criteria.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.applicationId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{app.applicationId}</span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(app.createdAt || Date.now()).toLocaleDateString('en-GB')}
                    </span>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-50 text-emerald-700">
                      100% Free
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{app.student?.fullName}</p>
                    <p className="text-slate-500 text-[11px]">{app.student?.email}</p>
                    <p className="text-slate-400 text-[10px] truncate max-w-xs mt-0.5">
                      {app.academic?.college || app.student?.college || 'Institution'}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">
                      {app.technical?.domainTitle || app.domain?.title || 'Web Development'}
                    </p>
                    <p className="text-slate-400 text-[11px]">1 Month &bull; Remote</p>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {app.profiles?.githubUrl && (
                        <a href={app.profiles.githubUrl} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-black" title="GitHub">
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {app.profiles?.linkedinUrl && (
                        <a href={app.profiles.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800" title="LinkedIn">
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {app.resume && (
                        <a
                          href={`/api/prma/admin/applications/${encodeURIComponent(app.applicationId)}/resume`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                          title="View Uploaded Resume"
                        >
                          Resume PDF
                        </a>
                      )}
                      {(app.linkedinScreenshotUrl || app.instagramScreenshotUrl || app.socialFollow?.hasUploadedLinkedinProof || app.socialFollow?.hasUploadedInstagramProof) && (
                        <span
                          className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 inline-flex items-center gap-1"
                          title="Verified Social Media Follow Proofs Uploaded"
                        >
                          Proofs ✓
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={app.status || 'submitted'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'shortlisted') onApprove(app);
                        else if (val === 'rejected') onReject(app);
                        else if (val === 'under_review') onReview(app);
                        else if (onChangeStatus) onChangeStatus(app, val);
                      }}
                      className={`text-[11px] font-bold py-1 px-2 rounded-lg border outline-none cursor-pointer transition ${
                        app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        app.status === 'rejected' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                        app.status === 'under_review' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        'bg-blue-50 text-blue-800 border-blue-300'
                      }`}
                    >
                      <option value="submitted">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {app.offerId && (
                      <span className="block font-mono text-blue-600 text-[10px] mt-0.5">{app.offerId}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.status === 'shortlisted' ? (
                        <>
                          <a
                            href={`/api/prma/admin/applications/${encodeURIComponent(app.applicationId)}/offer-letter`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Download Official Joining Letter PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`/prma-tech/verify-offer/${encodeURIComponent(app.offerId || app.applicationId)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            title="Verify Scannable Credential"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </a>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onApprove(app)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Approve
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectApp(app)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px]"
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
  );
}
