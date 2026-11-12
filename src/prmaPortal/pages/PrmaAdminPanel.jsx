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
  Briefcase,
  FolderCheck,
  CheckSquare,
  FileCode,
  UploadCloud,
  MessageSquare,
  Layers,
  Activity
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

  // Submissions Management States (Requirement 2 & 3)
  const [submissionsData, setSubmissionsData] = useState({ stats: null, submissions: [] });
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [subDomainFilter, setSubDomainFilter] = useState('all');
  const [subWeekFilter, setSubWeekFilter] = useState('all');
  const [subReviewStatusFilter, setSubReviewStatusFilter] = useState('all');
  const [activeTaskWeekTab, setActiveTaskWeekTab] = useState(1);
  const [reviewFormStatus, setReviewFormStatus] = useState('approved');
  const [reviewFormFeedback, setReviewFormFeedback] = useState('');
  const [reviewFormScore, setReviewFormScore] = useState(85);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Submissions Quick Filter Tab (Requirement 8)
  const [submissionTabFilter, setSubmissionTabFilter] = useState('all');

  // Document & Email Management States (Requirement 7)
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isRegeneratingLetter, setIsRegeneratingLetter] = useState(false);
  const [isRegeneratingProblemStatement, setIsRegeneratingProblemStatement] = useState(false);

  // Google Form Webhook & Apps Script Integration Modal (Requirement 4 & 7)
  const [showGformConfigModal, setShowGformConfigModal] = useState(false);
  const [gformConfig, setGformConfig] = useState(null);
  const [gformWebhookUrl, setGformWebhookUrl] = useState('');
  const [gformScriptCode, setGformScriptCode] = useState('');
  const [gformBaseUrlInput, setGformBaseUrlInput] = useState('');
  const [gformSaving, setGformSaving] = useState(false);

  // Template Management States
  const [templatesData, setTemplatesData] = useState(null);
  const [templatesLoading, setTemplatesLoading] = useState(false);

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

      // 7. Submissions & Evaluation Data
      loadSubmissionsData();

      // 8. Institutional Document Templates Metadata
      loadTemplatesData();
    } catch (err) {
      console.warn('Failed to load live admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissionsData = async () => {
    setSubmissionsLoading(true);
    try {
      const res = await fetch('/api/prma/admin/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissionsData(data);
      }
    } catch (err) {
      console.warn('Failed to load submissions data:', err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const loadTemplatesData = async () => {
    setTemplatesLoading(true);
    try {
      const res = await fetch('/api/prma/admin/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplatesData(data.templates);
      }
    } catch (err) {
      console.warn('Failed to load templates metadata:', err);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const openSubmissionDossier = (sub) => {
    setSelectedSubmission(sub);
    const firstActiveWeek = (sub.tasks || []).find(t => t.status === 'submitted' || t.status === 'approved' || t.status === 'revision_required')?.weekNumber || 1;
    setActiveTaskWeekTab(firstActiveWeek);
    const currentTask = (sub.tasks || []).find(t => t.weekNumber === firstActiveWeek);
    setReviewFormStatus(currentTask?.reviewStatus === 'pending' || !currentTask?.reviewStatus ? 'approved' : currentTask.reviewStatus);
    setReviewFormFeedback(currentTask?.adminFeedback || currentTask?.mentorFeedback || '');
    setReviewFormScore(currentTask?.score || 85);
  };

  const handleSelectWeekTab = (weekNum) => {
    setActiveTaskWeekTab(weekNum);
    const task = (selectedSubmission?.tasks || []).find(t => t.weekNumber === weekNum);
    setReviewFormStatus(task?.reviewStatus === 'pending' || !task?.reviewStatus ? 'approved' : task?.reviewStatus);
    setReviewFormFeedback(task?.adminFeedback || task?.mentorFeedback || '');
    setReviewFormScore(task?.score || 85);
  };

  const handleSaveReview = async (submissionId, weekNumber) => {
    if (!reviewFormStatus) {
      alert('Please select a review status.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/prma/admin/submissions/${encodeURIComponent(submissionId)}/review/${weekNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewFormStatus,
          reviewStatus: reviewFormStatus,
          feedback: reviewFormFeedback,
          mentorFeedback: reviewFormFeedback,
          score: reviewFormScore ? Number(reviewFormScore) : 85,
          reviewer: 'PRMA Tech Mentorship Board'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✓ Week ${weekNumber} task evaluated successfully! Status updated to "${reviewFormStatus}". Candidate notified.`);
        if (data.submission) {
          setSelectedSubmission(data.submission);
        }
        await loadSubmissionsData();
      } else {
        alert(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      alert('Error updating task review: ' + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSubmissionTabChange = (tab) => {
    setSubmissionTabFilter(tab);
    if (tab === 'all') {
      setSubWeekFilter('all');
      setSubReviewStatusFilter('all');
    } else if (tab === 'week-1') {
      setSubWeekFilter('1');
      setSubReviewStatusFilter('all');
    } else if (tab === 'week-2') {
      setSubWeekFilter('2');
      setSubReviewStatusFilter('all');
    } else if (tab === 'week-3') {
      setSubWeekFilter('3');
      setSubReviewStatusFilter('all');
    } else if (tab === 'week-4') {
      setSubWeekFilter('4');
      setSubReviewStatusFilter('all');
    } else if (tab === 'pending') {
      setSubWeekFilter('all');
      setSubReviewStatusFilter('pending');
    } else if (tab === 'approved') {
      setSubWeekFilter('all');
      setSubReviewStatusFilter('approved');
    } else if (tab === 'revision') {
      setSubWeekFilter('all');
      setSubReviewStatusFilter('revision_required');
    }
  };

  const getFilteredSubmissions = () => {
    const list = submissionsData?.submissions || [];
    return list.filter(sub => {
      const q = subSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (sub.student?.fullName || sub.studentName || '').toLowerCase().includes(q) ||
        (sub.student?.email || sub.studentEmail || '').toLowerCase().includes(q) ||
        (sub.student?.mobile || '').includes(q) ||
        (sub.applicationId || '').toLowerCase().includes(q) ||
        (sub.offerId || '').toLowerCase().includes(q) ||
        (sub.student?.college || '').toLowerCase().includes(q) ||
        (sub.technical?.domainTitle || sub.domainTitle || '').toLowerCase().includes(q);

      const domainTitle = sub.technical?.domainTitle || sub.domainTitle || '';
      const domainId = sub.technical?.domainId || sub.domainId || '';
      const matchesDomain =
        subDomainFilter === 'all' ||
        domainTitle.toLowerCase() === subDomainFilter.toLowerCase() ||
        domainId.toLowerCase() === subDomainFilter.toLowerCase();

      let matchesWeek = true;
      if (subWeekFilter !== 'all') {
        const wNum = parseInt(subWeekFilter, 10);
        const task = (sub.tasks || []).find(t => t.weekNumber === wNum);
        matchesWeek = task && (task.status === 'submitted' || task.status === 'approved' || task.status === 'revision_required');
      }

      let matchesReview = true;
      if (subReviewStatusFilter !== 'all') {
        matchesReview = (sub.tasks || []).some(t => {
          if (subReviewStatusFilter === 'pending') {
            return t.status === 'submitted' && (!t.reviewStatus || t.reviewStatus === 'pending');
          }
          return t.reviewStatus === subReviewStatusFilter || t.status === subReviewStatusFilter;
        });
      }

      return matchesSearch && matchesDomain && matchesWeek && matchesReview;
    });
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

  // Resend Shortlist / Approval Email (Requirement 7)
  const handleResendJoiningEmail = async (app) => {
    const targetApp = app || selectedApp;
    if (!targetApp) return;
    setIsResendingEmail(true);
    try {
      const res = await fetch(`/api/prma/admin/applications/${encodeURIComponent(targetApp.applicationId)}/resend-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✓ Corporate onboarding email re-dispatched to ${targetApp.student?.email || 'student'} with joining PDFs!`);
        if (data.application) {
          setSelectedApp(data.application);
        }
        await loadAllData();
      } else {
        alert(data.error || data.message || 'Failed to resend approval email.');
      }
    } catch (e) {
      alert('Error resending email: ' + e.message);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleResendEmail = handleResendJoiningEmail;

  // Regenerate Official Joining Letter PDF (Requirement 7)
  const handleRegenerateLetter = async (app) => {
    const targetApp = app || selectedApp;
    if (!targetApp) return;
    setIsRegeneratingLetter(true);
    try {
      const res = await fetch(`/api/prma/admin/applications/${encodeURIComponent(targetApp.applicationId)}/regenerate-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✓ Official Joining Letter regenerated with scannable QR verification (${Math.round((data.bytes || 0) / 1024)} KB)!`);
        if (selectedApp && selectedApp.applicationId === targetApp.applicationId) {
          setSelectedApp(prev => prev ? { ...prev, joiningLetterPdfRef: data.downloadUrl } : null);
        }
        await loadAllData();
      } else {
        alert(data.error || 'Failed to regenerate letter.');
      }
    } catch (err) {
      alert('Error regenerating letter: ' + err.message);
    } finally {
      setIsRegeneratingLetter(false);
    }
  };

  // Regenerate 10-Page Problem Statement PDF (Requirement 7)
  const handleRegenerateProblemStatement = async (app) => {
    const targetApp = app || selectedApp;
    if (!targetApp) return;
    setIsRegeneratingProblemStatement(true);
    try {
      const res = await fetch(`/api/prma/admin/applications/${encodeURIComponent(targetApp.applicationId)}/regenerate-problem-statement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✓ 10-Page Problem Statement PDF regenerated with 4-week task milestones (${Math.round((data.bytes || 0) / 1024)} KB)!`);
        if (selectedApp && selectedApp.applicationId === targetApp.applicationId) {
          setSelectedApp(prev => prev ? { ...prev, problemStatementPdfRef: data.downloadUrl } : null);
        }
        await loadAllData();
      } else {
        alert(data.error || 'Failed to regenerate problem statement.');
      }
    } catch (err) {
      alert('Error regenerating problem statement: ' + err.message);
    } finally {
      setIsRegeneratingProblemStatement(false);
    }
  };

  // Google Form & Apps Script Modal Controls (Requirement 4 & 7)
  const openGoogleFormModal = async () => {
    setShowGformConfigModal(true);
    try {
      const res = await fetch('/api/prma/admin/google-form-config');
      if (res.ok) {
        const data = await res.json();
        setGformConfig(data.config);
        setGformWebhookUrl(data.webhookUrl);
        setGformScriptCode(data.appsScriptCode);
        if (data.config?.baseUrl) {
          setGformBaseUrlInput(data.config.baseUrl);
        }
      }
    } catch (err) {
      console.warn('Failed to load Google Form configuration:', err);
    }
  };

  const handleSaveGformConfig = async () => {
    if (!gformBaseUrlInput.trim()) {
      alert('Please enter a valid Google Form Base URL.');
      return;
    }
    setGformSaving(true);
    try {
      const res = await fetch('/api/prma/admin/google-form-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl: gformBaseUrlInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('✓ Google Form Base URL updated successfully!');
        setGformConfig(data.config);
      } else {
        alert(data.error || 'Failed to update Google Form settings.');
      }
    } catch (err) {
      alert('Error saving Google Form configuration: ' + err.message);
    } finally {
      setGformSaving(false);
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
    { id: 'submissions', label: 'Submissions (NEW)', icon: FolderCheck, count: submissionsData?.submissions?.length || 0, badgeColor: 'bg-purple-600 text-white' },
    { id: 'new-applications', label: 'New Applications', icon: Clock, count: newApps.length, badgeColor: 'bg-blue-600 text-white' },
    { id: 'all-applications', label: 'All Applications', icon: Users, count: applications.length },
    { id: 'shortlisted', label: 'Shortlisted Students', icon: UserCheck, count: shortlistedApps.length, badgeColor: 'bg-emerald-600 text-white' },
    { id: 'rejected', label: 'Rejected Applications', icon: UserX, count: rejectedApps.length },
    { id: 'domains', label: 'Domain Management', icon: Code2, count: domains.length },
    { id: 'careers', label: 'Careers & Jobs', icon: Briefcase, count: jobs.length },
    { id: 'tasks', label: 'Internship Tasks', icon: ListTodo, count: tasks.length },
    { id: 'letters', label: 'Joining Letters & Docs', icon: Award, count: shortlistedApps.length },
    { id: 'emails', label: 'Email Management', icon: Mail, count: emailLogs.length },
    { id: 'goodies', label: 'Goodies Management', icon: Package, count: 9 },
    { id: 'settings', label: 'Settings & Templates', icon: Settings, count: null }
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

          {/* SECTION: SUBMISSIONS & TASK EVALUATION (REQUIREMENT 2 & 3) */}
          {activeSection === 'submissions' && (
            <div className="space-y-6">
              {/* Top Card: Title, Description, and Live Stats */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                      <FolderCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Internship Task Submissions &amp; Evaluation</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Real database-driven submission tracking across all 4 weekly milestones with code repository inspection, asset downloads, and mentor feedback
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={openGoogleFormModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Google Form &amp; Apps Script Setup
                    </button>
                    <button
                      type="button"
                      onClick={loadSubmissionsData}
                      disabled={submissionsLoading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${submissionsLoading ? 'animate-spin text-purple-600' : ''}`} />
                      Refresh Submissions
                    </button>
                  </div>
                </div>

                {/* 8 Real Database-Driven Statistic Cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Submission Analytics &amp; Milestone Progression
                    </span>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Dual-Persistence Live DB
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {/* Stat 1: Total Approved Interns */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Approved Interns</span>
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-2xl font-black text-slate-900 block">
                        {submissionsData?.stats?.totalApprovedInterns ?? shortlistedApps.length ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Active candidate cohorts</span>
                    </div>

                    {/* Stat 2: Total Deliverables */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Submissions</span>
                        <UploadCloud className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-2xl font-black text-indigo-900 block">
                        {submissionsData?.stats?.totalSubmissions ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Delivered task sprints</span>
                    </div>

                    {/* Stat 3: Pending Review */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending Review</span>
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-2xl font-black text-amber-700 block">
                        {submissionsData?.stats?.pendingSubmissions ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Awaiting evaluation</span>
                    </div>

                    {/* Stat 4: Reviewed Submissions */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reviewed Tasks</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-2xl font-black text-emerald-700 block">
                        {submissionsData?.stats?.reviewedSubmissions ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Feedback dispatched</span>
                    </div>

                    {/* Stat 5: Week 1 Completed */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Week 1 Done</span>
                        <Layers className="w-4 h-4 text-sky-600" />
                      </div>
                      <span className="text-2xl font-black text-slate-900 block">
                        {submissionsData?.stats?.week1Completed ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Foundation milestone</span>
                    </div>

                    {/* Stat 6: Week 2 Completed */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Week 2 Done</span>
                        <FileCode className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-2xl font-black text-slate-900 block">
                        {submissionsData?.stats?.week2Completed ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Architecture milestone</span>
                    </div>

                    {/* Stat 7: Week 3 Completed */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-violet-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Week 3 Done</span>
                        <Activity className="w-4 h-4 text-violet-600" />
                      </div>
                      <span className="text-2xl font-black text-slate-900 block">
                        {submissionsData?.stats?.week3Completed ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Integration milestone</span>
                    </div>

                    {/* Stat 8: Week 4 Completed */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-fuchsia-300 transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Week 4 Done</span>
                        <Award className="w-4 h-4 text-fuchsia-600" />
                      </div>
                      <span className="text-2xl font-black text-slate-900 block">
                        {submissionsData?.stats?.week4Completed ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Final Capstone Ready</span>
                    </div>
                  </div>
                </div>

                {/* 8 Filter Tabs for Submissions (Requirement 8) */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Filter Submissions by Milestone &amp; Status
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Showing {getFilteredSubmissions().length} Records
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'All Submissions' },
                      { id: 'week-1', label: 'Week 1 Submissions' },
                      { id: 'week-2', label: 'Week 2 Submissions' },
                      { id: 'week-3', label: 'Week 3 Submissions' },
                      { id: 'week-4', label: 'Week 4 Submissions' },
                      { id: 'pending', label: 'Pending Review' },
                      { id: 'approved', label: 'Approved' },
                      { id: 'revision', label: 'Revision Required' }
                    ].map((tab) => {
                      const isActive = submissionTabFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => handleSubmissionTabChange(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search student, email, offer ID, domain..."
                      value={subSearchQuery}
                      onChange={(e) => setSubSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {subSearchQuery && (
                      <button
                        onClick={() => setSubSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Domain Filter */}
                    <select
                      value={subDomainFilter}
                      onChange={(e) => setSubDomainFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Domains</option>
                      {domains.map((d) => (
                        <option key={d.id} value={d.title}>{d.title}</option>
                      ))}
                    </select>

                    {/* Week Status Filter */}
                    <select
                      value={subWeekFilter}
                      onChange={(e) => setSubWeekFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Weeks</option>
                      <option value="1">Week 1 Submitted</option>
                      <option value="2">Week 2 Submitted</option>
                      <option value="3">Week 3 Submitted</option>
                      <option value="4">Week 4 Submitted</option>
                    </select>

                    {/* Review Status Filter */}
                    <select
                      value={subReviewStatusFilter}
                      onChange={(e) => setSubReviewStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Review Statuses</option>
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="revision_required">Revision Required</option>
                      <option value="under_review">Under Review</option>
                    </select>

                    {(subSearchQuery || subDomainFilter !== 'all' || subWeekFilter !== 'all' || subReviewStatusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSubSearchQuery('');
                          setSubDomainFilter('all');
                          setSubWeekFilter('all');
                          setSubReviewStatusFilter('all');
                        }}
                        className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Intern / Candidate</th>
                        <th className="py-3 px-4">Domain Track</th>
                        <th className="py-3 px-3 text-center">Week 1</th>
                        <th className="py-3 px-3 text-center">Week 2</th>
                        <th className="py-3 px-3 text-center">Week 3</th>
                        <th className="py-3 px-3 text-center">Week 4</th>
                        <th className="py-3 px-4 text-center">Overall Progress</th>
                        <th className="py-3 px-4">Submission Portal</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {getFilteredSubmissions().length > 0 ? (
                        getFilteredSubmissions().map((sub) => {
                          const w1 = (sub.tasks || []).find((t) => t.weekNumber === 1);
                          const w2 = (sub.tasks || []).find((t) => t.weekNumber === 2);
                          const w3 = (sub.tasks || []).find((t) => t.weekNumber === 3);
                          const w4 = (sub.tasks || []).find((t) => t.weekNumber === 4);

                          const portalUrl = `https://professorvirus.site/prma-tech/submit/${sub.submissionToken || ''}`;

                          const renderWeekBadge = (task) => {
                            if (!task) return <span className="text-[10px] text-slate-400 font-medium">N/A</span>;
                            if (task.status === 'approved' || task.reviewStatus === 'approved') {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  Approved
                                </span>
                              );
                            }
                            if (task.status === 'revision_required' || task.reviewStatus === 'revision_required') {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                  <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                                  Revision
                                </span>
                              );
                            }
                            if (task.status === 'submitted') {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
                                  <UploadCloud className="w-2.5 h-2.5 text-blue-600" />
                                  Submitted
                                </span>
                              );
                            }
                            if (task.reviewStatus === 'under_review') {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 border border-purple-200">
                                  <Clock className="w-2.5 h-2.5 text-purple-600" />
                                  Reviewing
                                </span>
                              );
                            }
                            return <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">Pending</span>;
                          };

                          return (
                            <tr key={sub.submissionId || sub.offerId} className="hover:bg-purple-50/30 transition">
                              {/* Intern info */}
                              <td className="py-3 px-4">
                                <div className="font-extrabold text-slate-900 text-sm">
                                  {sub.student?.fullName || sub.studentName || 'Candidate'}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                    {sub.offerId || sub.applicationId}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(sub.offerId, sub.offerId)}
                                    title="Copy Offer ID"
                                    className="text-slate-400 hover:text-slate-700"
                                  >
                                    {copiedId === sub.offerId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {sub.student?.email || sub.studentEmail}
                                </div>
                              </td>

                              {/* Domain Track */}
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                                  {sub.technical?.domainTitle || sub.domainTitle || 'Engineering Track'}
                                </span>
                                <span className="block text-[10px] text-slate-400 mt-1">
                                  Joined: {sub.joiningDate || 'Cohort'}
                                </span>
                              </td>

                              {/* Week 1 Status */}
                              <td className="py-3 px-3 text-center">{renderWeekBadge(w1)}</td>

                              {/* Week 2 Status */}
                              <td className="py-3 px-3 text-center">{renderWeekBadge(w2)}</td>

                              {/* Week 3 Status */}
                              <td className="py-3 px-3 text-center">{renderWeekBadge(w3)}</td>

                              {/* Week 4 Status */}
                              <td className="py-3 px-3 text-center">{renderWeekBadge(w4)}</td>

                              {/* Overall Progress */}
                              <td className="py-3 px-4 text-center">
                                <div className="w-28 mx-auto">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                                    <span>{sub.overallProgress || 0}%</span>
                                    <span>{sub.completedWeeksCount || 0}/4 Tasks</span>
                                  </div>
                                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 transition-all duration-300"
                                      style={{ width: `${sub.overallProgress || 0}%` }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* Submission Portal Link */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={portalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] border border-purple-200 transition"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Open Portal
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(portalUrl, `portal-${sub.submissionId}`)}
                                    title="Copy Unique Student Submission URL"
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
                                  >
                                    {copiedId === `portal-${sub.submissionId}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => openSubmissionDossier(sub)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs transition"
                                >
                                  <FolderCheck className="w-3.5 h-3.5" />
                                  Review Tasks
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-slate-400">
                            <FolderCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                            <p className="font-bold text-sm text-slate-600">No student submissions found</p>
                            <p className="text-xs text-slate-400 mt-1">
                              When students are approved and submit weekly tasks via their portal, records populate here automatically.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
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

          {/* SECTION 8: JOINING LETTER & DOCUMENT MANAGEMENT (REQUIREMENT 7 & DELIVERABLES 1-3) */}
          {activeSection === 'letters' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Official Joining Letters &amp; Document Registry</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Institutional PDF generators: Official Joining Letter PDF and 10-Page Problem Statement PDF with personalized student tokens
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 self-start sm:self-auto">
                  MSME UDYAM: UDYAM-UP-76-0055635
                </span>
              </div>

              {/* Master Institutional Templates Showcase (Requirement 4) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50/70 via-blue-50/50 to-indigo-50/70 border border-purple-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-700" />
                    <h4 className="font-black text-slate-900 text-sm">Official Institutional Deliverable Templates</h4>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    Production Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Template 1: Official Joining Letter */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="flex gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                        <img
                          src="/assets/prma_templates/prma_joining_letter_template.jpg"
                          alt="Joining Letter Template Canvas"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">Deliverable 01</span>
                        <h5 className="font-black text-slate-900 text-sm">Official Joining Letter Template</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Institutional vector canvas with MSME registration seal, scannable QR verification link, and authorized signatory.
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-slate-400">Priyanshu Kumar, Founder</span>
                      <a
                        href="/assets/prma_templates/prma_joining_letter_template.jpg"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Canvas
                      </a>
                    </div>
                  </div>

                  {/* Template 2: 10-Page Problem Statement */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="flex gap-3">
                      <div className="w-16 h-20 rounded-lg border border-slate-200 bg-gradient-to-b from-purple-50 to-indigo-100 flex flex-col items-center justify-center text-purple-700 flex-shrink-0">
                        <FileText className="w-6 h-6 mb-1" />
                        <span className="text-[9px] font-black uppercase">10 Pages</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">Deliverable 02</span>
                        <h5 className="font-black text-slate-900 text-sm">10-Page Problem Statement Template</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Comprehensive 10-page master specification: 4 weekly milestones, technical rubrics, and personalized submission portal URL injection.
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-slate-400">4 Sprints &bull; Personalized PDF</span>
                      <a
                        href="/assets/prma_templates/prma_problem_statement_template.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Open Master PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Letters Registry */}
              <div>
                <h4 className="font-black text-slate-900 text-base mb-3">
                  Approved Intern Documents ({shortlistedApps.length})
                </h4>
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
                        {app.submissionToken && (
                          <div className="mt-2 text-[11px] flex items-center gap-1.5 text-purple-700">
                            <span className="font-bold">Portal Token:</span>
                            <span className="font-mono truncate max-w-[180px] bg-white px-1 rounded border border-purple-200">
                              {app.submissionToken}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        <a
                          href={`/prma-tech/verify-offer/${encodeURIComponent(app.offerId || app.applicationId)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verify
                        </a>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={`/api/prma/admin/applications/${encodeURIComponent(app.applicationId)}/joining-letter`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                          >
                            <Download className="w-3 h-3" />
                            Letter PDF
                          </a>

                          <a
                            href={`/api/prma/admin/applications/${encodeURIComponent(app.applicationId)}/problem-statement`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition"
                          >
                            <Download className="w-3 h-3" />
                            10-Page PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Authorized Signatory &amp; Institutional Seal</span>
                  <span className="font-bold text-slate-900 text-sm block">Priyanshu Kumar</span>
                  <span className="text-slate-500">Founder &amp; Authorized Representative, PRMA Tech</span>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-blue-700 font-bold">MSME UDYAM: UDYAM-UP-76-0055635</span>
                    <span className="text-emerald-700 font-bold">Verified Digital Signatory Active</span>
                  </div>
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

      {/* COMPLETE SUBMISSION DOSSIER & TASK REVIEW SLIDE-OVER (REQUIREMENT 2 & 3) */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-3xl p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between animate-slide-left">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-xs border border-purple-200">
                      {selectedSubmission.offerId || selectedSubmission.submissionId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">App: {selectedSubmission.applicationId}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {selectedSubmission.student?.fullName || selectedSubmission.studentName} — Task Dossier
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedSubmission.technical?.domainTitle || selectedSubmission.domainTitle} &bull; {selectedSubmission.duration || '1 Month'} Virtual Internship
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Student Quick Summary & Documents Strip */}
              <div className="my-5 p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Candidate Email</span>
                    <span className="font-semibold text-slate-800 break-all">{selectedSubmission.student?.email || selectedSubmission.studentEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile Phone</span>
                    <span className="font-semibold text-slate-800">{selectedSubmission.student?.mobile || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">College / Institute</span>
                    <span className="font-semibold text-slate-800 truncate block">{selectedSubmission.student?.college || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Joining Date</span>
                    <span className="font-semibold text-slate-800">{selectedSubmission.joiningDate || 'Cohort'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://professorvirus.site/prma-tech/submit/${selectedSubmission.submissionToken || ''}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Student Portal
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`https://professorvirus.site/prma-tech/submit/${selectedSubmission.submissionToken || ''}`, 'sub-modal-url')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-bold"
                    >
                      {copiedId === 'sub-modal-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Link
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/prma/admin/applications/${encodeURIComponent(selectedSubmission.applicationId)}/joining-letter`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Joining Letter PDF
                    </a>
                    <a
                      href={`/api/prma/admin/applications/${encodeURIComponent(selectedSubmission.applicationId)}/problem-statement`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      10-Page Problem PDF
                    </a>
                  </div>
                </div>
              </div>

              {/* 4 Weekly Milestone Selection Tabs */}
              <div className="mb-6">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Select Milestone Sprint to Evaluate
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((wNum) => {
                    const task = (selectedSubmission.tasks || []).find((t) => t.weekNumber === wNum);
                    const isSelected = activeTaskWeekTab === wNum;
                    const isDone = task && (task.status === 'approved' || task.reviewStatus === 'approved');
                    const isSubmitted = task && task.status === 'submitted';
                    const isRevision = task && (task.status === 'revision_required' || task.reviewStatus === 'revision_required');

                    return (
                      <button
                        key={wNum}
                        type="button"
                        onClick={() => handleSelectWeekTab(wNum)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                            Week 0{wNum}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
                          ) : isRevision ? (
                            <AlertCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-amber-600'}`} />
                          ) : isSubmitted ? (
                            <UploadCloud className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-200' : 'text-blue-600'}`} />
                          ) : (
                            <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-300' : 'text-slate-300'}`} />
                          )}
                        </div>
                        <div className={`font-extrabold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {task?.title || task?.taskTitle || `Milestone ${wNum}`}
                        </div>
                        <span className={`text-[10px] font-medium block mt-0.5 capitalize ${
                          isSelected
                            ? 'text-purple-100'
                            : isDone
                            ? 'text-emerald-700 font-bold'
                            : isRevision
                            ? 'text-amber-700 font-bold'
                            : isSubmitted
                            ? 'text-blue-700 font-bold'
                            : 'text-slate-400'
                        }`}>
                          {isDone ? 'Approved' : isRevision ? 'Revision Req.' : isSubmitted ? 'Submitted' : 'Pending'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Milestone Sprint Detail */}
              {(() => {
                const currentTask = (selectedSubmission.tasks || []).find((t) => t.weekNumber === activeTaskWeekTab) || {
                  weekNumber: activeTaskWeekTab,
                  title: `Week ${activeTaskWeekTab} Deliverable`,
                  description: 'Technical task specification',
                  deadline: '7 Days',
                  status: 'pending'
                };
                const hasStudentSubmitted = currentTask.status === 'submitted' || currentTask.status === 'approved' || currentTask.status === 'revision_required';

                return (
                  <div className="space-y-5">
                    {/* Task Specification Banner */}
                    <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
                            Milestone Sprint {currentTask.weekNumber}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            {currentTask.title || currentTask.taskTitle}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 self-start sm:self-auto">
                          Deadline: {currentTask.deadline || '7 Days'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {currentTask.description}
                      </p>
                    </div>

                    {/* Student Deliverables Card */}
                    <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                            <UploadCloud className="w-4 h-4 text-purple-600" />
                            Student Submitted Deliverables
                          </h4>
                          {currentTask.source === 'google_form' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Google Form Ingested
                            </span>
                          ) : hasStudentSubmitted ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              PRMA Portal
                            </span>
                          ) : null}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          currentTask.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          currentTask.status === 'revision_required' ? 'bg-amber-100 text-amber-800' :
                          currentTask.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {currentTask.status === 'approved' ? 'Approved' :
                           currentTask.status === 'revision_required' ? 'Revision Required' :
                           currentTask.status === 'submitted' ? 'Submitted & Awaiting Review' : 'Pending Submission'}
                        </span>
                      </div>

                      {hasStudentSubmitted ? (
                        <div className="space-y-4 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                            {currentTask.submittedAt && (
                              <div>
                                <span className="font-bold text-slate-700">Submitted at:</span>{' '}
                                {new Date(currentTask.submittedAt).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                              </div>
                            )}
                            {currentTask.googleFormResponseId && (
                              <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                Form Response ID: {currentTask.googleFormResponseId}
                              </span>
                            )}
                          </div>

                          {/* GitHub and Live Project Links */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentTask.githubUrl ? (
                              <a
                                href={currentTask.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold transition group"
                              >
                                <Github className="w-4 h-4 text-slate-700 group-hover:text-black" />
                                <span className="truncate flex-1">GitHub Repository</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                              </a>
                            ) : (
                              <div className="p-3 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[11px]">
                                No GitHub repository provided
                              </div>
                            )}

                            {currentTask.liveUrl ? (
                              <a
                                href={currentTask.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-blue-700 font-bold transition group"
                              >
                                <Globe className="w-4 h-4 text-blue-600" />
                                <span className="truncate flex-1">Live Project Demo</span>
                                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                              </a>
                            ) : (
                              <div className="p-3 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[11px]">
                                No live demo URL provided
                              </div>
                            )}
                          </div>

                          {/* External Drive / ZIP and Documentation Links */}
                          {(currentTask.projectZipUrl || currentTask.documentationPdfUrl) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {currentTask.projectZipUrl && (
                                <a
                                  href={currentTask.projectZipUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 text-purple-900 font-bold transition"
                                >
                                  <Package className="w-4 h-4 text-purple-600" />
                                  <span className="truncate flex-1">Project ZIP / Drive Archive</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                                </a>
                              )}
                              {currentTask.documentationPdfUrl && (
                                <a
                                  href={currentTask.documentationPdfUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-900 font-bold transition"
                                >
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="truncate flex-1">Documentation PDF / Doc</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Submitted Social Proof Links */}
                          {(currentTask.linkedinUrl || currentTask.instagramUrl) && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                Candidate Social Profiles:
                              </span>
                              {currentTask.linkedinUrl && (
                                <a
                                  href={currentTask.linkedinUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-bold text-[#0077B5] hover:underline"
                                >
                                  <Linkedin className="w-3.5 h-3.5" />
                                  LinkedIn Profile
                                </a>
                              )}
                              {currentTask.instagramUrl && (
                                <a
                                  href={currentTask.instagramUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-bold text-pink-600 hover:underline"
                                >
                                  <Instagram className="w-3.5 h-3.5" />
                                  Instagram Profile
                                </a>
                              )}
                            </div>
                          )}

                          {/* Student Remarks */}
                          {currentTask.remarks && (
                            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                              <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider block mb-1">
                                Intern Remarks / Notes
                              </span>
                              <p className="text-slate-700 italic leading-relaxed">{currentTask.remarks}</p>
                            </div>
                          )}

                          {/* Uploaded Files */}
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                              Uploaded Project Assets &amp; Code Archives ({currentTask.files?.length || 0})
                            </span>
                            {currentTask.files && currentTask.files.length > 0 ? (
                              <div className="space-y-2">
                                {currentTask.files.map((file, idx) => {
                                  const downloadUrl = `/api/prma/submissions/download/${encodeURIComponent(selectedSubmission.submissionId)}/${currentTask.weekNumber}/${idx}`;
                                  const sizeKb = file.size ? Math.round(file.size / 1024) : 0;
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FileCode className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                        <div className="truncate">
                                          <span className="font-bold text-slate-900 block truncate">
                                            {file.originalName || file.filename || `Deliverable-File-${idx + 1}`}
                                          </span>
                                          <span className="text-[10px] text-slate-400">
                                            {sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`}
                                          </span>
                                        </div>
                                      </div>
                                      <a
                                        href={downloadUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-xs"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-slate-400 italic">No files attached to this deliverable.</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-slate-700 text-xs">Intern has not submitted this milestone yet</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Submissions will automatically show here once uploaded via the student portal.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Official Mentor Review & Evaluation Form */}
                    <div className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-purple-50/20 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-purple-700" />
                          <h4 className="font-black text-slate-900 text-sm">Official Mentor Evaluation &amp; Feedback</h4>
                        </div>
                        {currentTask.reviewedAt && (
                          <span className="text-[10px] font-bold text-slate-500">
                            Last reviewed: {new Date(currentTask.reviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Status Selector */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                          Set Evaluation Verdict
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setReviewFormStatus('approved')}
                            className={`py-2 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-1.5 ${
                              reviewFormStatus === 'approved'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => setReviewFormStatus('revision_required')}
                            className={`py-2 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-1.5 ${
                              reviewFormStatus === 'revision_required'
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                            }`}
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            Need Revision
                          </button>

                          <button
                            type="button"
                            onClick={() => setReviewFormStatus('under_review')}
                            className={`py-2 px-3 rounded-xl text-xs font-black transition border flex items-center justify-center gap-1.5 ${
                              reviewFormStatus === 'under_review'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            In Review
                          </button>
                        </div>
                      </div>

                      {/* Mentor Feedback Textarea */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                          Mentor Feedback &amp; Technical Critique (Dispatched to Intern)
                        </label>
                        <textarea
                          rows={3}
                          value={reviewFormFeedback}
                          onChange={(e) => setReviewFormFeedback(e.target.value)}
                          placeholder="e.g. Excellent work on the data preprocessing pipeline. Clean modular code. Please add unit tests for edge cases..."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
                        />
                      </div>

                      {/* Performance Score */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                          Performance Score (out of 100)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={reviewFormScore}
                          onChange={(e) => setReviewFormScore(e.target.value)}
                          className="w-32 p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Save & Dispatch Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleSaveReview(selectedSubmission.submissionId, activeTaskWeekTab)}
                          disabled={isSubmittingReview}
                          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                        >
                          {isSubmittingReview ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Saving Evaluation &amp; Sending Notification...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Save Milestone Evaluation &amp; Dispatch Feedback to Intern
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Footer Close */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                PRMA Tech Evaluation Board &bull; Dual-Persistence
              </span>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* SECTION 7: ADMIN PANEL DOCUMENT & EMAIL MANAGEMENT (MANDATORY) */}
              {(selectedApp.status === 'shortlisted' || selectedApp.status === 'approved' || selectedApp.offerId) && (
                <div className="space-y-4 mb-6">
                  {/* A. DOCUMENTS */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        A &bull; Official Deliverable Documents
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Vector PDFs + QR Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Document 1: Official Joining Letter */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                            Official Joining Letter PDF
                          </span>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded-full">
                            MSME UDYAM
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Features authorized signature, company seal, and scannable QR verification link.
                        </p>
                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          <a
                            href={`/api/prma/admin/applications/${encodeURIComponent(selectedApp.applicationId)}/offer-letter`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200"
                          >
                            <Eye className="w-3 h-3" />
                            Preview
                          </a>
                          <a
                            href={`/api/prma/admin/applications/${encodeURIComponent(selectedApp.applicationId)}/offer-letter`}
                            download={`PRMA_Tech_Joining_Letter_${selectedApp.offerId || selectedApp.applicationId}.pdf`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px]"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRegenerateLetter(selectedApp)}
                            disabled={isRegeneratingLetter}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 ${isRegeneratingLetter ? 'animate-spin text-blue-600' : ''}`} />
                            Regenerate
                          </button>
                        </div>
                      </div>

                      {/* Document 2: 10-Page Problem Statement */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <FileCode className="w-3.5 h-3.5 text-purple-600" />
                            10-Page Problem Statement PDF
                          </span>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.2 rounded-full">
                            4-Week Sprints
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Domain-specific milestones, industry requirements, and embedded student submission link.
                        </p>
                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          <a
                            href={`/api/prma/admin/applications/${encodeURIComponent(selectedApp.applicationId)}/problem-statement`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] border border-purple-200"
                          >
                            <Eye className="w-3 h-3" />
                            Preview
                          </a>
                          <a
                            href={`/api/prma/admin/applications/${encodeURIComponent(selectedApp.applicationId)}/problem-statement`}
                            download={`PRMA_Tech_Problem_Statement_${selectedApp.offerId || selectedApp.applicationId}.pdf`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px]"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRegenerateProblemStatement(selectedApp)}
                            disabled={isRegeneratingProblemStatement}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 ${isRegeneratingProblemStatement ? 'animate-spin text-purple-600' : ''}`} />
                            Regenerate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B. EMAIL STATUS & DISPATCH AUDIT */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        B &bull; Onboarding Email Status
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        (selectedApp.emailDispatchStatus || 'Sent').toLowerCase() === 'sent'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : (selectedApp.emailDispatchStatus || '').toLowerCase() === 'failed'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {(selectedApp.emailDispatchStatus || 'Sent').toLowerCase() === 'sent' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            DISPATCHED / SENT
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            {selectedApp.emailDispatchStatus || 'PENDING'}
                          </>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Recipient Email:</span>
                        <span className="font-bold text-slate-900 break-all">{selectedApp.student?.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Email Subject:</span>
                        <span className="font-bold text-slate-800 truncate block">
                          Congratulations! Your Internship Application Has Been Approved – PRMA Tech
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Provider Message ID:</span>
                        <span className="font-mono text-[11px] font-semibold text-slate-700 truncate block">
                          {selectedApp.emailMessageId || `MSG-${(selectedApp.offerId || selectedApp.applicationId).replace(/[^a-zA-Z0-9]/g, '')}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Last Dispatch Attempt:</span>
                        <span className="font-semibold text-slate-700">
                          {selectedApp.emailLastAttempt
                            ? new Date(selectedApp.emailLastAttempt).toLocaleString('en-IN')
                            : selectedApp.shortlistedAt
                            ? new Date(selectedApp.shortlistedAt).toLocaleString('en-IN')
                            : 'Logged on selection'}
                        </span>
                      </div>
                      {selectedApp.emailFailureReason && (
                        <div className="col-span-1 sm:col-span-2 p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px]">
                          <span className="font-bold">Failure Reason:</span> {selectedApp.emailFailureReason}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <span className="text-[11px] text-slate-500">
                        Includes both Joining Letter PDF &amp; 10-Page Problem Statement attachments
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResendJoiningEmail(selectedApp)}
                        disabled={isResendingEmail}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                      >
                        {isResendingEmail ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Dispatching Email...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Resend Joining Email
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* C. SUBMISSION DETAILS */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-purple-600" />
                        C &bull; Student Task Submission Link
                      </span>
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Google Form + Live Portal
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">
                          Prefilled Student Google Form Submission URL:
                        </span>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <input
                            type="text"
                            readOnly
                            value={selectedApp.googleFormUrl || `https://docs.google.com/forms/d/e/1FAIpQLScXQ4z4FhS93FzR38q848fP9ZfG4gL61678129/viewform?entry.18472910=${encodeURIComponent(selectedApp.offerId || selectedApp.applicationId)}`}
                            className="flex-1 bg-transparent text-[11px] font-mono text-slate-700 focus:outline-none truncate"
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard(
                              selectedApp.googleFormUrl || `https://docs.google.com/forms/d/e/1FAIpQLScXQ4z4FhS93FzR38q848fP9ZfG4gL61678129/viewform?entry.18472910=${encodeURIComponent(selectedApp.offerId || selectedApp.applicationId)}`,
                              'app-gform-url'
                            )}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px]"
                          >
                            {copiedId === 'app-gform-url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedId === 'app-gform-url' ? 'Copied' : 'Copy Form Link'}
                          </button>
                          <a
                            href={selectedApp.googleFormUrl || `https://docs.google.com/forms/d/e/1FAIpQLScXQ4z4FhS93FzR38q848fP9ZfG4gL61678129/viewform?entry.18472910=${encodeURIComponent(selectedApp.offerId || selectedApp.applicationId)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open Form
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                        <span className="text-slate-500">
                          Direct Portal Alternative: <span className="font-mono font-bold text-slate-700">/prma-tech/submit/{selectedApp.submissionToken || 'token'}</span>
                        </span>
                        <a
                          href={`https://professorvirus.site/prma-tech/submit/${selectedApp.submissionToken || ''}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-purple-700 hover:underline inline-flex items-center gap-1"
                        >
                          Open Portal &rarr;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Drawer (Section 7.D) */}
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
                      className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 border border-blue-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview Letter
                    </a>
                    <a
                      href={`/api/prma/admin/applications/${encodeURIComponent(selectedApp.applicationId)}/offer-letter`}
                      download={`PRMA_Tech_Joining_Letter_${selectedApp.offerId || selectedApp.applicationId}.pdf`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Joining Letter
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRegenerateLetter(selectedApp)}
                      disabled={isRegeneratingLetter}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingLetter ? 'animate-spin text-blue-600' : ''}`} />
                      Regenerate Letter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRegenerateProblemStatement(selectedApp)}
                      disabled={isRegeneratingProblemStatement}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingProblemStatement ? 'animate-spin text-purple-600' : ''}`} />
                      Regenerate Problem PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResendJoiningEmail(selectedApp)}
                      disabled={isResendingEmail}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Send className={`w-3.5 h-3.5 ${isResendingEmail ? 'animate-pulse' : ''}`} />
                      Resend Joining Email
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(
                        selectedApp.googleFormUrl || `https://docs.google.com/forms/d/e/1FAIpQLScXQ4z4FhS93FzR38q848fP9ZfG4gL61678129/viewform?entry.18472910=${encodeURIComponent(selectedApp.offerId || selectedApp.applicationId)}`,
                        'bottom-gform-url'
                      )}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                    >
                      {copiedId === 'bottom-gform-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Submission Link
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
                      Approve &amp; Send Joining Letter
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

      {/* 5. Google Form & Apps Script Ingestion Modal (Requirements 4 & 7) */}
      {showGformConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh] animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Google Form &amp; Apps Script Webhook Integration</h3>
                  <p className="text-xs text-slate-500">Live task ingestion directly from student Google Form responses</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGformConfigModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-5 text-xs text-slate-700 pr-1">
              {/* Setting: Base Google Form URL */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Google Form Base URL (For Student Deliverables)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={gformBaseUrlInput}
                    onChange={(e) => setGformBaseUrlInput(e.target.value)}
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveGformConfig}
                    disabled={gformSaving}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {gformSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save URL
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  When approving candidates, PRMA Tech automatically appends prefilled query parameters (Candidate Name, Offer ID, Email, Domain, College) so the form opens personalized.
                </p>
              </div>

              {/* Webhook Endpoint Info */}
              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200 space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-purple-900">
                  PRMA Tech Ingestion Webhook Endpoint
                </label>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-purple-200">
                  <input
                    type="text"
                    readOnly
                    value={gformWebhookUrl || 'https://professorvirus.site/api/prma/submissions/google-form-webhook'}
                    className="flex-1 bg-transparent font-mono text-[11px] text-purple-950 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(gformWebhookUrl || 'https://professorvirus.site/api/prma/submissions/google-form-webhook', 'webhook-url-copy')}
                    className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[11px] rounded-lg flex items-center gap-1"
                  >
                    {copiedId === 'webhook-url-copy' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedId === 'webhook-url-copy' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-purple-800">
                  Receives incoming POST webhooks on form submission and synchronizes answers directly into the candidate's MongoDB Atlas record.
                </p>
              </div>

              {/* Ready-to-use Google Apps Script Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-purple-600" />
                    Google Apps Script Code (Ready to Paste)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(gformScriptCode, 'apps-script-copy');
                      showToast('✓ Google Apps Script code copied to clipboard!');
                    }}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg flex items-center gap-1.5"
                  >
                    {copiedId === 'apps-script-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedId === 'apps-script-copy' ? 'Copied to Clipboard' : 'Copy Full Script'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                  {gformScriptCode || `// PRMA Tech - Google Form Submission Webhook Forwarder
function onFormSubmit(e) {
  var WEBHOOK_URL = "${gformWebhookUrl || 'https://professorvirus.site/api/prma/submissions/google-form-webhook'}";
  // Click 'Copy Full Script' above to get the complete script
}`}
                </pre>
              </div>

              {/* 4-Step Instructions */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <span className="font-extrabold text-slate-900 block mb-1">
                  How to install in your Google Form:
                </span>
                <p>1. Open your Google Form in Google Drive.</p>
                <p>2. Click the <strong>⋮ (three vertical dots)</strong> in the top right &rarr; <strong>Script editor</strong>.</p>
                <p>3. Delete existing template code, paste the script above, and click <strong>Save (💾)</strong>.</p>
                <p>4. In the left menu, click <strong>Triggers (alarm clock icon)</strong> &rarr; <strong>+ Add Trigger</strong> &rarr; Select function: <code>onFormSubmit</code> &rarr; Event type: <strong>On form submit</strong> &rarr; Save.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Dual-Persistence MongoDB Atlas + Local Disk Sync
              </span>
              <button
                type="button"
                onClick={() => setShowGformConfigModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Done
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
                            href={`/api/prma/admin/applications/${encodeURIComponent(app.applicationId)}/problem-statement`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100"
                            title="Download Official 10-Page Problem Statement PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
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
