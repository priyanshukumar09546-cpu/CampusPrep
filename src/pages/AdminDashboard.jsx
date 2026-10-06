import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
  FileCheck,
  BookOpen, 
  Layers, 
  HelpCircle, 
  Wrench, 
  Megaphone, 
  BarChart2, 
  MessageSquare, 
  Settings, 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Trash2, 
  Edit, 
  Eye, 
  LogOut,
  ChevronDown,
  UserCheck,
  TrendingUp,
  FilePlus,
  Radio,
  ExternalLink,
  Zap,
  Rocket,
  RefreshCw,
  PlusCircle,
  Filter,
  Check,
  Building2,
  Calendar,
  BookMarked,
  HardDrive,
  Cloud,
  UploadCloud,
  FolderPlus,
  Copy,
  Lock,
  Code2,
  Briefcase,
  Github,
  GraduationCap,
  Landmark,
  Activity,
  Star
} from 'lucide-react';
import { QUANTUM_NOTES } from '../data/aktuQuantumNotes';
import { AKTU_PYQ_DATA } from '../data/aktuPyqData';
import { COURSES } from '../data/coursesCatalog';
import AdminQuizManager from '../components/AdminQuizManager';


export const getAdminToken = () => {
  return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') || '';
};

export default function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('pyqs');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Real Admin Session State
  const [adminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : { name: 'Admin', email: 'admin@professorvirus.edu', role: 'admin' };
    } catch {
      return { name: 'Admin', email: 'admin@professorvirus.edu', role: 'admin' };
    }
  });

  const handleLogout = async () => {
    const token = getAdminToken();
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_user');
      if (onNavigate) onNavigate('admin-login');
      else window.location.href = '/admin/login';
    }
  };

  // REAL DATABASE STATES
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalContent: 0,
    totalNotes: 0,
    totalPYQs: 0,
    publishedPYQs: 0,
    unpublishedPYQs: 0,
    totalBranches: 6,
    totalSubjects: 0,
    totalQuizzes: 0,
    openTickets: 0,
    pendingUploads: 0
  });

  const [latestUsers, setLatestUsers] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [adminNotes, setAdminNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  
  // PYQ MANAGEMENT STATES
  const [adminPyqs, setAdminPyqs] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [editingPyq, setEditingPyq] = useState(null);
  const [replacePdfPyq, setReplacePdfPyq] = useState(null);
  const [supportTickets, setSupportTickets] = useState([]);
  const [communityReports, setCommunityReports] = useState([]);
  const [communityReportFilter, setCommunityReportFilter] = useState('All');
  const [lastUpdated, setLastUpdated] = useState('');

  // PYQ FILTER & PAGINATION STATES FOR ADMIN DASHBOARD TABLE
  const [pyqCourseFilter, setPyqCourseFilter] = useState('B.Tech');
  const [pyqBranchFilter, setPyqBranchFilter] = useState('CSE');
  const [pyqYearFilter, setPyqYearFilter] = useState('Year 1');
  const [pyqSemesterFilter, setPyqSemesterFilter] = useState('Semester 1');
  const [pyqSpecFilter, setPyqSpecFilter] = useState('All');
  const [pyqSubjectFilter, setPyqSubjectFilter] = useState('All');
  const [pyqAcademicYearFilter, setPyqAcademicYearFilter] = useState('All');
  const [pyqExamTypeFilter, setPyqExamTypeFilter] = useState('All');
  const [pyqStatusFilter, setPyqStatusFilter] = useState('All');
  const [pyqSearchText, setPyqSearchText] = useState('');
  const [pyqPage, setPyqPage] = useState(1);
  const [pyqPageSize, setPyqPageSize] = useState(15);
  const [pyqViewMode, setPyqViewMode] = useState('matrix'); // 'matrix' | 'table'
  const [selectedCellPyqData, setSelectedCellPyqData] = useState(null);


  // NOTES FILTER STATES FOR ADMIN DASHBOARD TABLE
  const [noteCourseFilter, setNoteCourseFilter] = useState('All');
  const [noteBranchFilter, setNoteBranchFilter] = useState('All');
  const [noteYearFilter, setNoteYearFilter] = useState('All');
  const [noteSemesterFilter, setNoteSemesterFilter] = useState('All');
  const [noteSpecFilter, setNoteSpecFilter] = useState('All');
  const [noteSubjectFilter, setNoteSubjectFilter] = useState('All');
  const [noteUnitFilter, setNoteUnitFilter] = useState('All');
  const [noteSourceFilter, setNoteSourceFilter] = useState('All');
  const [noteStatusFilter, setNoteStatusFilter] = useState('All');
  const [noteSearchText, setNoteSearchText] = useState('');
  const [notePage, setNotePage] = useState(1);
  const [notePageSize, setNotePageSize] = useState(20);

  // GOOGLE DRIVE OAUTH MANAGEMENT STATES
  const [gdriveStatus, setGdriveStatus] = useState(null);
  const [gdriveLoading, setGdriveLoading] = useState(false);
  const [gdriveMessage, setGdriveMessage] = useState('');

  // SYSTEM HEALTH STATE
  const [systemHealth, setSystemHealth] = useState(null);
  const [gdriveTestResult, setGdriveTestResult] = useState(null);
  const [copiedUri, setCopiedUri] = useState(false);

  // RESUME MAKER ADMIN CMS STATES
  const [resumeAdminOverview, setResumeAdminOverview] = useState({
    totalResumes: 0,
    totalDownloads: 0,
    totalAiActions: 0,
    onePageComplianceRate: '100%',
    recentResumes: []
  });
  const [resumeAdminTemplates, setResumeAdminTemplates] = useState([]);
  const [resumeAdminSettings, setResumeAdminSettings] = useState(null);
  const [resumeAdminAnalytics, setResumeAdminAnalytics] = useState(null);
  const [resumeAdminSubTab, setResumeAdminSubTab] = useState('overview'); // 'overview' | 'templates' | 'settings' | 'analytics'
  const [loadingResumeAdmin, setLoadingResumeAdmin] = useState(false);

  const fetchResumeAdminData = async () => {
    setLoadingResumeAdmin(true);
    const token = getAdminToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    try {
      const [resOverview, resTemplates, resSettings, resAnalytics] = await Promise.all([
        fetch('/api/admin/resume-maker/overview', { headers }).then(r => r.json()).catch(() => ({})),
        fetch('/api/admin/resume-maker/templates', { headers }).then(r => r.json()).catch(() => ({})),
        fetch('/api/admin/resume-maker/settings', { headers }).then(r => r.json()).catch(() => ({})),
        fetch('/api/admin/resume-maker/analytics', { headers }).then(r => r.json()).catch(() => ({}))
      ]);

      if (resOverview && resOverview.success) setResumeAdminOverview(resOverview.overview);
      if (resTemplates && resTemplates.success) setResumeAdminTemplates(resTemplates.templates || []);
      if (resSettings && resSettings.success) setResumeAdminSettings(resSettings.settings || {});
      if (resAnalytics && resAnalytics.success) setResumeAdminAnalytics(resAnalytics.analytics || {});
    } catch (err) {
      console.error('Error fetching resume admin data:', err);
    } finally {
      setLoadingResumeAdmin(false);
    }
  };

  // PROJECT IDEAS ADMIN CMS STATES
  const [adminProjects, setAdminProjects] = useState([]);
  const [adminProjectStats, setAdminProjectStats] = useState({
    totalProjects: 0,
    published: 0,
    pendingReview: 0,
    verifiedLinks: 0,
    needsVerification: 0,
    brokenLinks: 0
  });
  const [adminProjectFilterStatus, setAdminProjectFilterStatus] = useState('all');
  const [adminProjectFilterDomain, setAdminProjectFilterDomain] = useState('all');
  const [adminProjectSearch, setAdminProjectSearch] = useState('');
  const [loadingAdminProjects, setLoadingAdminProjects] = useState(false);
  const [verifyingProjectId, setVerifyingProjectId] = useState(null);
  const [projectEditModalOpen, setProjectEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [savingProject, setSavingProject] = useState(false);

  const fetchAdminProjects = async () => {
    setLoadingAdminProjects(true);
    const token = getAdminToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    try {
      const res = await fetch('/api/admin/projects', { headers });
      const data = await res.json();
      if (data.success) {
        setAdminProjects(data.projects || []);
        if (data.stats) setAdminProjectStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin projects:', err);
    } finally {
      setLoadingAdminProjects(false);
    }
  };

  const handleVerifyProjectLink = async (id) => {
    try {
      setVerifyingProjectId(id);
      const token = getAdminToken();
      const res = await fetch(`/api/admin/projects/${id}/verify-link`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminProjects(prev => prev.map(p => {
          if (p.id === id) {
            return {
              ...p,
              linkStatus: data.linkStatus,
              httpStatusCode: data.statusCode,
              verificationNotes: data.notes,
              lastVerifiedAt: new Date()
            };
          }
          return p;
        }));
        fetchAdminProjects();
      }
    } catch (err) {
      console.error('Error verifying link:', err);
    } finally {
      setVerifyingProjectId(null);
    }
  };

  const handleApproveProject = async (id) => {
    if (!window.confirm('Approve and publish this project idea to the public catalog?')) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/projects/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminProjects();
      }
    } catch (err) {
      console.error('Error approving project:', err);
    }
  };

  const handleRejectProject = async (id) => {
    const reason = window.prompt('Enter reason for rejecting this submission:', 'Incomplete repository or broken source code');
    if (reason === null) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/projects/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminProjects();
      }
    } catch (err) {
      console.error('Error rejecting project:', err);
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete project "${title}"?`)) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminProjects();
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleSaveProjectForm = async (e) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      setSavingProject(true);
      const token = getAdminToken();
      const isNew = !editingProject.id || editingProject.id === 'new';
      const endpoint = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingProject)
      });
      const data = await res.json();
      if (data.success) {
        setProjectEditModalOpen(false);
        setEditingProject(null);
        fetchAdminProjects();
      } else {
        alert(data.message || 'Failed to save project');
      }
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setSavingProject(false);
    }
  };

  // INTERNSHIPS & JOBS ADMIN CMS STATES
  const [adminOpportunities, setAdminOpportunities] = useState([]);
  const [adminOpportunityStats, setAdminOpportunityStats] = useState({
    totalOpportunities: 0,
    published: 0,
    pendingVerification: 0,
    verifiedLinks: 0,
    needsReview: 0,
    expired: 0
  });
  const [adminOpportunityFilterStatus, setAdminOpportunityFilterStatus] = useState('all');
  const [adminOpportunityFilterDomain, setAdminOpportunityFilterDomain] = useState('all');
  const [adminOpportunitySearch, setAdminOpportunitySearch] = useState('');
  const [loadingAdminOpportunities, setLoadingAdminOpportunities] = useState(false);
  const [verifyingOpportunityId, setVerifyingOpportunityId] = useState(null);
  const [opportunityEditModalOpen, setOpportunityEditModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [savingOpportunity, setSavingOpportunity] = useState(false);

  const fetchAdminOpportunities = async () => {
    setLoadingAdminOpportunities(true);
    const token = getAdminToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    try {
      const res = await fetch('/api/admin/opportunities', { headers });
      const data = await res.json();
      if (data.success) {
        setAdminOpportunities(data.opportunities || []);
        if (data.stats) setAdminOpportunityStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin opportunities:', err);
    } finally {
      setLoadingAdminOpportunities(false);
    }
  };

  const handleVerifyOpportunityLink = async (id) => {
    try {
      setVerifyingOpportunityId(id);
      const token = getAdminToken();
      const res = await fetch(`/api/admin/opportunities/${id}/verify-link`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminOpportunities(prev => prev.map(o => {
          if (o.id === id) {
            return {
              ...o,
              verificationStatus: data.verificationStatus,
              httpStatusCode: data.statusCode,
              verificationNotes: data.notes,
              lastVerifiedAt: new Date()
            };
          }
          return o;
        }));
        fetchAdminOpportunities();
      }
    } catch (err) {
      console.error('Error verifying opportunity link:', err);
    } finally {
      setVerifyingOpportunityId(null);
    }
  };

  const handleApproveOpportunity = async (id) => {
    if (!window.confirm('Approve and publish this opportunity to the public portal?')) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/opportunities/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminOpportunities();
      }
    } catch (err) {
      console.error('Error approving opportunity:', err);
    }
  };

  const handleRejectOpportunity = async (id) => {
    const reason = window.prompt('Enter reason for rejecting this opportunity:', 'Does not meet career verification standards.');
    if (reason === null) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/opportunities/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminOpportunities();
      }
    } catch (err) {
      console.error('Error rejecting opportunity:', err);
    }
  };

  const handleToggleFeatureOpportunity = async (id) => {
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/opportunities/${id}/toggle-feature`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminOpportunities(prev => prev.map(o => o.id === id ? { ...o, featured: data.featured } : o));
      }
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  const handleDeleteOpportunity = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete opportunity "${title}"?`)) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminOpportunities();
      }
    } catch (err) {
      console.error('Error deleting opportunity:', err);
    }
  };

  const handleSaveOpportunityForm = async (e) => {
    e.preventDefault();
    if (!editingOpportunity) return;
    try {
      setSavingOpportunity(true);
      const token = getAdminToken();
      const isNew = !editingOpportunity.id || editingOpportunity.id === 'new';
      const endpoint = isNew ? '/api/admin/opportunities' : `/api/admin/opportunities/${editingOpportunity.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingOpportunity)
      });
      const data = await res.json();
      if (data.success) {
        setOpportunityEditModalOpen(false);
        setEditingOpportunity(null);
        fetchAdminOpportunities();
      } else {
        alert(data.message || 'Failed to save opportunity');
      }
    } catch (err) {
      console.error('Error saving opportunity:', err);
    } finally {
      setSavingOpportunity(false);
    }
  };

  // SCHOLARSHIPS ADMIN CMS STATES & HANDLERS
  const [adminScholarships, setAdminScholarships] = useState([]);
  const [adminScholarshipStats, setAdminScholarshipStats] = useState({
    totalScholarships: 0,
    published: 0,
    pendingVerification: 0,
    verifiedLinks: 0,
    needsReview: 0,
    expired: 0
  });
  const [adminScholarshipFilterStatus, setAdminScholarshipFilterStatus] = useState('all');
  const [adminScholarshipFilterCategory, setAdminScholarshipFilterCategory] = useState('all');
  const [adminScholarshipSearch, setAdminScholarshipSearch] = useState('');
  const [loadingAdminScholarships, setLoadingAdminScholarships] = useState(false);
  const [verifyingScholarshipId, setVerifyingScholarshipId] = useState(null);
  const [scholarshipEditModalOpen, setScholarshipEditModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [savingScholarship, setSavingScholarship] = useState(false);

  const fetchAdminScholarships = async () => {
    setLoadingAdminScholarships(true);
    const token = getAdminToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    try {
      const res = await fetch('/api/admin/scholarships', { headers });
      const data = await res.json();
      if (data.success) {
        setAdminScholarships(data.scholarships || []);
        if (data.stats) setAdminScholarshipStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin scholarships:', err);
    } finally {
      setLoadingAdminScholarships(false);
    }
  };

  const handleVerifyScholarshipLink = async (id) => {
    try {
      setVerifyingScholarshipId(id);
      const token = getAdminToken();
      const res = await fetch(`/api/admin/scholarships/${id}/verify-link`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminScholarships(prev => prev.map(s => {
          if (s.id === id) {
            return {
              ...s,
              verificationStatus: data.verificationStatus,
              httpStatusCode: data.statusCode,
              verificationNotes: data.notes,
              lastVerifiedAt: new Date()
            };
          }
          return s;
        }));
        fetchAdminScholarships();
      }
    } catch (err) {
      console.error('Error verifying scholarship link:', err);
    } finally {
      setVerifyingScholarshipId(null);
    }
  };

  const handleApproveScholarship = async (id) => {
    if (!window.confirm('Approve and publish this scholarship to the live public portal?')) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/scholarships/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminScholarships();
      }
    } catch (err) {
      console.error('Error approving scholarship:', err);
    }
  };

  const handleRejectScholarship = async (id) => {
    const reason = window.prompt('Enter reason for rejecting this scholarship submission:', 'Does not meet official verification standards.');
    if (reason === null) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/scholarships/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminScholarships();
      }
    } catch (err) {
      console.error('Error rejecting scholarship:', err);
    }
  };

  const handleToggleFeatureScholarship = async (id) => {
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/scholarships/${id}/toggle-feature`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminScholarships(prev => prev.map(s => s.id === id ? { ...s, featured: data.featured } : s));
      }
    } catch (err) {
      console.error('Error toggling featured scholarship:', err);
    }
  };

  const handleDeleteScholarship = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete scholarship "${title}"?`)) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminScholarships();
      }
    } catch (err) {
      console.error('Error deleting scholarship:', err);
    }
  };

  const handleSaveScholarshipForm = async (e) => {
    e.preventDefault();
    if (!editingScholarship) return;
    try {
      setSavingScholarship(true);
      const token = getAdminToken();
      const isNew = !editingScholarship.id || editingScholarship.id === 'new';
      const endpoint = isNew ? '/api/admin/scholarships' : `/api/admin/scholarships/${editingScholarship.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingScholarship)
      });
      const data = await res.json();
      if (data.success) {
        setScholarshipEditModalOpen(false);
        setEditingScholarship(null);
        fetchAdminScholarships();
      } else {
        alert(data.message || 'Failed to save scholarship');
      }
    } catch (err) {
      console.error('Error saving scholarship:', err);
    } finally {
      setSavingScholarship(false);
    }
  };

  const fetchGdriveStatus = () => {
    const token = getAdminToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    setGdriveLoading(true);
    fetch('/api/google-drive/status', { headers })
      .then(res => {
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) {
          throw new Error('Backend server not responding');
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setGdriveStatus(data);
        }
      })
      .catch(err => {
        console.error('Error fetching Google Drive status:', err);
        setGdriveStatus({ isConnected: false, hasClientId: false, hasClientSecret: false, message: 'Backend server not running. Start it with: npm run server' });
      })
      .finally(() => setGdriveLoading(false));
  };

  useEffect(() => {
    fetchGdriveStatus();

    // Fetch system health
    fetch('/api/health')
      .then(res => {
        if (!res.ok || !(res.headers.get('content-type') || '').includes('application/json')) return null;
        return res.json();
      })
      .then(data => { if (data) setSystemHealth(data); })
      .catch(() => setSystemHealth({ status: 'unreachable', error: 'Backend server not running' }));

    const params = new URLSearchParams(window.location.search);
    if (params.get('gdrive_success') === 'true') {
      const email = params.get('email') || 'Google Account';
      setGdriveMessage(`Successfully connected Google Account (${email})!`);
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchGdriveStatus();
    } else if (params.get('gdrive_error')) {
      setGdriveMessage(`OAuth Connection Failed: ${params.get('gdrive_error')}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnectGdrive = () => {
    const token = getAdminToken();
    if (!token) return;
    setGdriveLoading(true);
    fetch(`/api/google-drive/auth?admin_token=${encodeURIComponent(token)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setGdriveLoading(false);
        if (data.success && data.authUrl) {
          window.location.href = data.authUrl;
        } else {
          alert(data.message || 'Failed to initiate Google OAuth.');
        }
      })
      .catch(err => {
        setGdriveLoading(false);
        alert('Error starting OAuth: ' + err.message);
      });
  };

  const handleTestGdrive = () => {
    const token = getAdminToken();
    if (!token) return;
    setGdriveLoading(true);
    setGdriveTestResult(null);
    fetch('/api/google-drive/test', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setGdriveLoading(false);
        setGdriveTestResult(data);
        fetchGdriveStatus();
      })
      .catch(err => {
        setGdriveLoading(false);
        setGdriveTestResult({ success: false, message: err.message });
      });
  };

  const handleDisconnectGdrive = () => {
    if (!window.confirm('Are you sure you want to disconnect your Google Drive account?')) return;
    const token = getAdminToken();
    if (!token) return;
    setGdriveLoading(true);
    fetch('/api/google-drive/disconnect', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setGdriveLoading(false);
        setGdriveMessage(data.message || 'Disconnected successfully.');
        setGdriveTestResult(null);
        fetchGdriveStatus();
      })
      .catch(err => {
        setGdriveLoading(false);
        alert('Error disconnecting: ' + err.message);
      });
  };

  const handleInitGdriveFolder = () => {
    const token = getAdminToken();
    if (!token) return;
    setGdriveLoading(true);
    fetch('/api/google-drive/init-folder', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error(`Server returned non-JSON response (HTTP ${res.status}).`);
        }
        return res.json();
      })
      .then(data => {
        setGdriveLoading(false);
        if (data.success) {
          setGdriveMessage(data.message);
          setGdriveTestResult(data);
          fetchGdriveStatus();
        } else {
          alert(data.message || 'Failed to initialize folder.');
        }
      })
      .catch(err => {
        setGdriveLoading(false);
        alert('Error initializing folder: ' + err.message);
      });
  };

  const handleTestUploadGdrive = () => {
    const token = getAdminToken();
    if (!token) return;
    setGdriveLoading(true);
    setGdriveTestResult(null);
    fetch('/api/google-drive/test-upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error(`Server returned non-JSON response (HTTP ${res.status}).`);
        }
        return res.json();
      })
      .then(data => {
        setGdriveLoading(false);
        setGdriveTestResult(data);
        fetchGdriveStatus();
      })
      .catch(err => {
        setGdriveLoading(false);
        setGdriveTestResult({ success: false, message: err.message });
      });
  };

  const handleMirrorSingleResource = (type, id) => {
    const token = getAdminToken();
    if (!token) return;
    setGdriveLoading(true);
    const endpoint = type === 'note' ? `/api/admin/notes/${id}/mirror` : `/api/admin/pyqs/${id}/mirror`;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setGdriveLoading(false);
        if (data.success) {
          alert(`Successfully mirrored ${type.toUpperCase()} to Google Drive!\nDrive URL: ${data.result.driveUrl}`);
          if (type === 'note') fetchAdminNotes();
          else fetchAdminPyqs();
        } else {
          alert(`Mirroring failed: ${data.message || data.error || 'Unknown error'}`);
          if (type === 'note') fetchAdminNotes();
          else fetchAdminPyqs();
        }
      })
      .catch(err => {
        setGdriveLoading(false);
        alert(`Mirroring error: ${err.message}`);
      });
  };

  const handleBulkMirror = () => {
    const token = getAdminToken();
    if (!token) return;
    if (!window.confirm('Start bulk PDF mirroring for pending Notes and PYQs?')) return;
    setGdriveLoading(true);
    fetch('/api/admin/mirror/bulk', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ batchSize: 20 })
    })
      .then(res => res.json())
      .then(data => {
        setGdriveLoading(false);
        alert(data.message || 'Bulk mirroring initiated.');
      })
      .catch(err => {
        setGdriveLoading(false);
        alert('Bulk mirroring error: ' + err.message);
      });
  };

  // HIERARCHICAL QUICK EDITOR SELECTION STATES
  const [hierCourse, setHierCourse] = useState('B.Tech');
  const [hierSemester, setHierSemester] = useState('Semester 1');
  const [hierSpec, setHierSpec] = useState('Core Management');
  const [hierBranch, setHierBranch] = useState('CSE');
  const [hierYear, setHierYear] = useState('Year 1');
  const [hierSubject, setHierSubject] = useState('Engineering Mathematics-I');
  const [hierUnit, setHierUnit] = useState(1);
  const [noteModalData, setNoteModalData] = useState(null);

  // TOGGLE NOTE AVAILABILITY HANDLER
  const handleToggleNoteAvailability = async (note) => {
    const token = getAdminToken();
    const updatedAvailable = note.available === false ? true : false;
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...note,
          available: updatedAvailable
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminNotes();
      }
    } catch (err) {
      console.error('Error toggling note availability:', err);
    }
  };


  // ACADEMIC YEARS (9 Academic Sessions as per requirement)
  const ACADEMIC_YEARS = [
    '2017-2018',
    '2018-2019',
    '2019-2020',
    '2020-2021',
    '2021-2022',
    '2022-2023',
    '2023-2024',
    '2024-2025',
    '2025-2026'
  ];

  const BTECH_BRANCHES = ['CSE', 'ECE', 'ME', 'IT', 'EE', 'AI & ML', 'DS', 'CE'];
  const BTECH_YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];

  // FETCH LIVE DASHBOARD DATA FROM BACKEND API
  const fetchDashboardData = () => {
    const token = getAdminToken();
    if (!token) return;

    setLoading(true);
    fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
          setLatestUsers(data.latestUsers || []);
          setRecentContent(data.recentContent || []);
          setRecentActivities(data.recentActivities || []);
          setSupportTickets(data.supportTickets || []);
          setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString());
        }
      })
      .catch(err => console.error('Error fetching live stats:', err))
      .finally(() => setLoading(false));

    fetchAdminNotes();
    fetchAdminPyqs();
    fetchSubjects();
    fetchCommunityReports();
  };

  // FETCH COMMUNITY REPORTS
  const fetchCommunityReports = () => {
    const token = getAdminToken();
    if (!token) return;

    fetch('/api/admin/community/reports', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.reports)) {
          setCommunityReports(data.reports);
        }
      })
      .catch(err => console.error('Error fetching community reports:', err));
  };

  // UPDATE REPORT STATUS (RESOLVED / DISMISSED)
  const handleUpdateReportStatus = async (reportId, status) => {
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/admin/community/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchCommunityReports();
      } else {
        alert(data.message || 'Failed to update report status.');
      }
    } catch (err) {
      alert('Error updating report status.');
    }
  };

  // DELETE REPORTED DISCUSSION POST
  const handleDeleteReportedPost = async (postId, reportId) => {
    if (!window.confirm('Are you sure you want to delete this discussion post? This action cannot be undone.')) return;
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/admin/community/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (reportId) {
          handleUpdateReportStatus(reportId, 'resolved');
        } else {
          fetchCommunityReports();
        }
        alert('Discussion post removed successfully.');
      } else {
        alert(data.message || 'Failed to delete discussion post.');
      }
    } catch (err) {
      alert('Error deleting discussion post.');
    }
  };

  // FETCH ALL NOTES
  const fetchAdminNotes = () => {
    const token = getAdminToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    fetch('/api/admin/notes', { headers })
      .then(res => {
        if (!res.ok) {
          return fetch('/api/notes').then(r => r.json());
        }
        return res.json();
      })
      .then(data => {
        if (data.success && Array.isArray(data.notes)) {
          setAdminNotes(data.notes);
        }
      })
      .catch(err => {
        console.error('Error fetching admin notes, attempting fallback:', err);
        fetch('/api/notes')
          .then(r => r.json())
          .then(d => {
            if (d.success && Array.isArray(d.notes)) {
              setAdminNotes(d.notes);
            }
          })
          .catch(e => console.error('Fallback notes fetch error:', e));
      });
  };

  // FETCH ALL PYQS FOR ADMIN CMS
  const fetchAdminPyqs = () => {
    const token = getAdminToken();
    if (!token) return;

    fetch('/api/admin/pyqs', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.pyqs)) {
          setAdminPyqs(data.pyqs);
        }
      })
      .catch(err => console.error('Error fetching admin PYQs:', err));
  };

  // FETCH ALL SUBJECTS FOR ADMIN
  const fetchSubjects = () => {
    fetch('/api/subjects')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.subjects)) {
          setSubjectsList(data.subjects);
        }
      })
      .catch(err => console.error('Error fetching subjects:', err));
  };

  // FETCH ALL USERS
  const fetchAllUsers = () => {
    const token = getAdminToken();
    if (!token) return;

    fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.users) {
          setAllUsersList(data.users);
        }
      })
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchAllUsers();
    }
    if (activeTab === 'pyqs' || activeTab === 'content') {
      fetchAdminPyqs();
      fetchSubjects();
    }
    if (activeTab === 'notes') {
      fetchAdminNotes();
    }
    if (activeTab === 'gdrive') {
      fetchGdriveStatus();
    }
    if (activeTab === 'resume-maker') {
      fetchResumeAdminData();
    }
    if (activeTab === 'project-ideas') {
      fetchAdminProjects();
    }
    if (activeTab === 'internships-jobs') {
      fetchAdminOpportunities();
    }
    if (activeTab === 'scholarships') {
      fetchAdminScholarships();
    }
  }, [activeTab]);

  // DELETE PYQ HANDLER (CONFIRMATION -> API DELETE -> REMOVE FROM DB & PUBLIC SITE)
  const handleDeletePyq = async (pyq) => {
    const subName = pyq.subjectName || pyq.subject || 'this paper';
    const acYear = pyq.academicYear || pyq.examYear || '';
    if (!window.confirm(`Delete this question paper?\n\nSubject: ${subName}\nAcademic Session: ${acYear}\nBranch: ${pyq.branchId || pyq.branch}`)) return;
    
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/admin/pyqs/${pyq.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchAdminPyqs();
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error deleting PYQ paper resource.');
    }
  };

  // TOGGLE PUBLISH/UNPUBLISH FOR PYQ
  const handleTogglePublishPyq = async (pyq) => {
    const token = getAdminToken();
    const currentStatus = pyq.published !== false && pyq.status !== 'unpublished';
    const newPublishedState = !currentStatus;

    try {
      const res = await fetch(`/api/admin/pyqs/${pyq.id}/publish`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ published: newPublishedState })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminPyqs();
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error toggling publish status.');
    }
  };

  // DELETE NOTE HANDLER
  const handleDeleteNote = async (noteId, noteTitle) => {
    if (!window.confirm(`Are you sure you want to delete note "${noteTitle}"?`)) return;
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/admin/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchAdminNotes();
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error deleting note resource.');
    }
  };

  // DELETE USER HANDLER
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user ${userName}?`)) return;
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchAllUsers();
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error deleting user.');
    }
  };

  // FILTERED PYQS FOR TABLE
  const filteredPyqsList = adminPyqs.filter(p => {
    const pBranch = (p.branchId || p.branch || '').toUpperCase();
    if (pyqBranchFilter !== 'All' && pBranch !== pyqBranchFilter.toUpperCase()) return false;

    const pYear = String(p.year || '');
    if (pyqYearFilter !== 'All' && pYear !== pyqYearFilter) return false;

    const pSubName = (p.subjectName || p.subject || '').toLowerCase().trim();
    if (pyqSubjectFilter !== 'All' && pSubName !== pyqSubjectFilter.toLowerCase().trim()) return false;

    const pAcYear = String(p.academicYear || p.examYear || '');
    if (pyqAcademicYearFilter !== 'All' && pAcYear !== pyqAcademicYearFilter) return false;

    const pExamType = (p.examType || '').toLowerCase();
    if (pyqExamTypeFilter !== 'All' && !pExamType.includes(pyqExamTypeFilter.toLowerCase())) return false;

    const isPub = p.published !== false && p.status !== 'unpublished';
    if (pyqStatusFilter === 'Published' && !isPub) return false;
    if (pyqStatusFilter === 'Unpublished' && isPub) return false;

    if (pyqSearchText.trim()) {
      const q = pyqSearchText.toLowerCase().trim();
      const subName = (p.subjectName || p.subject || '').toLowerCase();
      const subCode = (p.subjectCode || '').toLowerCase();
      const exType = (p.examType || '').toLowerCase();
      const fileName = (p.fileName || p.pdfUrl || '').toLowerCase();
      return subName.includes(q) || subCode.includes(q) || exType.includes(q) || fileName.includes(q) || pAcYear.includes(q);
    }

    return true;
  });


  const navMenuItems = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'pyqs', name: 'Previous Year Papers (PYQs)', icon: FileText, highlight: true },
    { id: 'notes', name: 'Notes Management', icon: BookOpen },
    { id: 'resume-maker', name: 'Resume Maker Admin', icon: FileCheck, highlight: true },
    { id: 'project-ideas', name: 'Project Ideas & Verification', icon: Code2, highlight: true },
    { id: 'internships-jobs', name: 'Internships & Jobs Management', icon: Briefcase, highlight: true },
    { id: 'scholarships', name: 'Scholarships Management', icon: GraduationCap, highlight: true },
    { id: 'gdrive', name: 'Google Drive OAuth', icon: HardDrive },
    { id: 'users', name: 'Users Management', icon: Users },
    { id: 'quizzes', name: 'Quizzes', icon: HelpCircle },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'support', name: 'Feedback & Support', icon: MessageSquare }
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const getCourseStats = (cKey) => {
    const norm = (c) => (c || '').toLowerCase().trim();
    const isMatch = (item) => {
      const c = norm(item.course);
      if (cKey === 'B.Tech') return !c || c === 'b.tech' || c === 'btech';
      return c === norm(cKey) || c === norm(cKey).replace('.', '');
    };
    const notesCount = adminNotes.filter(isMatch).length;
    const pyqsCount = adminPyqs.filter(isMatch).length;
    return {
      notes: notesCount || (stats?.courseBreakdown?.[cKey]?.notes || 0),
      pyqs: pyqsCount || (stats?.courseBreakdown?.[cKey]?.pyqs || 0)
    };
  };

  const renderCourseKpiCards = (onSelectCourse) => {
    const btech = getCourseStats('B.Tech');
    const mca = getCourseStats('MCA');
    const mba = getCourseStats('MBA');
    const bpharm = getCourseStats('B.Pharm');

    const totalN = adminNotes.length || stats.totalNotes || (btech.notes + mca.notes + mba.notes + bpharm.notes);
    const totalP = adminPyqs.length || stats.totalPYQs || (btech.pyqs + mca.pyqs + mba.pyqs + bpharm.pyqs);

    const coursesList = [
      { name: 'B.Tech', fullName: 'Bachelor of Technology', color: '#0F766E', bg: '#F0FDFA', border: '#99F6E4', notes: btech.notes, pyqs: btech.pyqs },
      { name: 'MCA', fullName: 'Master of Computer Applications', color: '#1E40AF', bg: '#F0F5FF', border: '#BFDBFE', notes: mca.notes, pyqs: mca.pyqs },
      { name: 'MBA', fullName: 'Master of Business Administration', color: '#92400E', bg: '#FFFBEB', border: '#FDE68A', notes: mba.notes, pyqs: mba.pyqs },
      { name: 'B.Pharm', fullName: 'Bachelor of Pharmacy', color: '#9D174D', bg: '#FDF2F8', border: '#FBCFE8', notes: bpharm.notes, pyqs: bpharm.pyqs },
    ];

    return (
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #E8E2D5', padding: '1.15rem', marginBottom: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ backgroundColor: '#1F2421', color: '#ffffff', borderRadius: '8px', padding: '0.35rem', display: 'flex' }}>
              <Layers size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 900, color: '#1F2421', margin: 0 }}>
                Course Overview KPI & Resource Inventory
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0 }}>
                Live database breakdown across B.Tech, MCA, MBA, and B.Pharm
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.76rem', backgroundColor: '#FDF6E8', color: '#1F2421', border: '1px solid #E8D3B0', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 800 }}>
              Total Notes: <strong style={{ color: '#C88D2D' }}>{totalN}</strong>
            </span>
            <span style={{ fontSize: '0.76rem', backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 800 }}>
              Total PYQs: <strong style={{ color: '#0284c7' }}>{totalP}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
          {coursesList.map(c => (
            <div
              key={c.name}
              onClick={() => onSelectCourse && onSelectCourse(c.name)}
              style={{
                backgroundColor: c.bg,
                border: `1.5px solid ${c.border}`,
                borderRadius: '12px',
                padding: '0.85rem',
                cursor: onSelectCourse ? 'pointer' : 'default',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 900, color: c.color }}>{c.name}</span>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: c.color, backgroundColor: 'rgba(255,255,255,0.7)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                  {c.fullName.split(' ')[0]}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.6rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.fullName}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: '#ffffff', borderRadius: '8px', padding: '0.45rem 0.6rem', border: `1px solid ${c.border}` }}>
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Notes</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: c.color, lineHeight: 1.1 }}>{c.notes}</div>
                </div>
                <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '0.5rem' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>PYQs</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{c.pyqs}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#FAF7F2', color: '#1F2421', display: 'flex', fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="admin-sidebar" style={{
        width: sidebarOpen ? '260px' : '0px', minWidth: sidebarOpen ? '260px' : '0px',
        backgroundColor: '#ffffff', borderRight: '1.5px solid #E8E2D5', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', transition: 'all 0.25s ease', overflow: 'hidden', zIndex: 50
      }}>
        <div>
          {/* LOGO HEADER */}
          <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid #F6F2E9' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #C88D2D', flexShrink: 0
            }}>
              <img 
                src="/assets/navbar_logo.png" 
                alt="ProfessorVirus Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_board.png';
                }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.35rem', color: '#1F2421', lineHeight: 1 }}>
                Professor<span style={{ color: '#C88D2D' }}>Virus</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#7A5835', fontWeight: 600 }}>
                Official PYQ Admin Management
              </div>
            </div>
          </div>

          {/* NAVIGATION ITEMS */}
          <nav style={{ padding: '0.85rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                    padding: '0.6rem 0.85rem', borderRadius: '12px', border: 'none',
                    backgroundColor: isActive ? '#FDF6E8' : 'transparent',
                    color: isActive ? '#1F2421' : '#475569', fontWeight: isActive ? 800 : 600,
                    fontSize: '0.86rem', cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={18} style={{ color: isActive ? '#C88D2D' : '#64748b' }} />
                    <span>{item.name}</span>
                  </div>
                  {item.highlight && (
                    <span style={{ backgroundColor: '#C88D2D', color: '#ffffff', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '9999px', fontWeight: 800 }}>
                      CMS
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM ADMIN FOOTER CARD */}
        <div style={{ padding: '1rem 0.85rem' }}>
          <div style={{
            backgroundColor: '#FAF7F2', borderRadius: '18px', border: '1.5px solid #E8E2D5', padding: '0.85rem',
            boxShadow: '0 4px 12px rgba(31,36,33,0.04)'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#1F2421', lineHeight: 1.3, marginBottom: '0.5rem' }}>
              “Real AKTU Question Papers <br />
              <span style={{ color: '#C88D2D', fontSize: '0.82rem' }}>Direct Upload & Sync</span>” <br />
              <span style={{ color: '#7A5835', fontSize: '0.68rem' }}>— ProfessorVirus System :)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
              <button 
                onClick={() => onNavigate ? onNavigate('pyqs') : window.location.href = '/pyqs'}
                style={{
                  width: '100%', backgroundColor: '#1F2421', color: '#ffffff', border: 'none', borderRadius: '8px',
                  padding: '0.4rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                }}
              >
                <ExternalLink size={13} /> View Public PYQ Page
              </button>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="admin-sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 49,
            display: 'none'
          }}
        />
      )}

      {/* 2. MAIN WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* TOP HEADER */}
        <header style={{
          backgroundColor: '#ffffff', borderBottom: '1.5px solid #E8E2D5', height: '65px', padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '500px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer' }}>
              <Menu size={22} />
            </button>

            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search PYQ subjects, paper titles, codes..."
                value={pyqSearchText}
                onChange={(e) => {
                  setPyqSearchText(e.target.value);
                  if (activeTab !== 'pyqs') setActiveTab('pyqs');
                }}
                style={{
                  width: '100%', backgroundColor: '#F6F2E9', border: '1px solid #E8E2D5', borderRadius: '9999px',
                  padding: '0.45rem 0.85rem 0.45rem 2.2rem', fontSize: '0.84rem', color: '#1F2421', outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={fetchDashboardData} title="Refresh Live DB" style={{ background: 'none', border: '1px solid #E8E2D5', borderRadius: '8px', padding: '0.35rem 0.6rem', color: '#1F2421', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700 }}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Sync DB
            </button>

            {/* Admin Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid #E8E2D5', paddingLeft: '1rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1F2421', color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div style={{ fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{adminUser.name}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{adminUser.role || 'Admin'}</div>
                </div>
                <ChevronDown size={14} style={{ color: '#64748b' }} />
              </div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: '48px', right: 0, backgroundColor: '#ffffff', borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', padding: '8px 0', minWidth: '200px', zIndex: 100
                }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{adminUser.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{adminUser.email}</div>
                  </div>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 16px', border: 'none', background: 'none', fontSize: '13px', color: '#dc2626', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY WORKSPACE */}
        <main style={{ padding: '1.75rem', flex: 1, overflowY: 'auto' }}>
          {/* TAB 1: PREVIOUS YEAR PAPERS (PYQ) ADMIN MANAGEMENT SYSTEM - REDESIGNED SUBJECT MATRIX */}
          {activeTab === 'pyqs' && (() => {
            // 9 Academic Sessions (2017-18 to 2025-26)
            const academicSessions = [
              { label: '2017-18', full: '2017-2018', year: 2017 },
              { label: '2018-19', full: '2018-2019', year: 2018 },
              { label: '2019-20', full: '2019-2020', year: 2019 },
              { label: '2020-21', full: '2020-2021', year: 2020 },
              { label: '2021-22', full: '2021-2022', year: 2021 },
              { label: '2022-23', full: '2022-2023', year: 2022 },
              { label: '2023-24', full: '2023-2024', year: 2023 },
              { label: '2024-25', full: '2024-2025', year: 2024 },
              { label: '2025-26', full: '2025-2026', year: 2025 }
            ];

            const NORMALIZE_SUBJECT_MAP = {
              'physics': 'Engineering Physics',
              'engineering physics': 'Engineering Physics',
              'engineering physics 1': 'Engineering Physics',
              'engineering physics 2': 'Engineering Physics',
              'chemistry': 'Engineering Chemistry',
              'engineering chemistry': 'Engineering Chemistry',
              'mathematics 1': 'Engineering Mathematics-I',
              'engineering mathematics 1': 'Engineering Mathematics-I',
              'engineering mathematics-i': 'Engineering Mathematics-I',
              'mathematics 2': 'Engineering Mathematics-II',
              'engineering mathematics 2': 'Engineering Mathematics-II',
              'engineering mathematics-ii': 'Engineering Mathematics-II',
              'programming for problem solving': 'Programming for Problem Solving',
              'programming problem solving': 'Programming for Problem Solving',
              'computer system & programming in c': 'Programming for Problem Solving',
              'basic electrical engineering': 'Basic Electrical Engineering',
              'basic of electrical engineering': 'Basic Electrical Engineering',
              'electrical engineering': 'Basic Electrical Engineering',
              'fundamentals of electrical engineering': 'Basic Electrical Engineering',
              'basic electronics': 'Fundamentals of Electronics Engineering',
              'fundamentals of electronics engineering': 'Fundamentals of Electronics Engineering',
              'emerging domain in electronics engineering': 'Fundamentals of Electronics Engineering',
              'fundamentals of mechanical engineering': 'Fundamentals of Mechanical Engineering',
              'fundamentals of mechanical engineering & mechatronics': 'Fundamentals of Mechanical Engineering',
              'elements of mechanical engineering': 'Fundamentals of Mechanical Engineering',
              'environment and ecology': 'Environment & Ecology',
              'environment & ecology': 'Environment & Ecology',
              'soft skills': 'Soft Skills & Communication',
              'soft skills 1': 'Soft Skills & Communication',
              'soft skill 2': 'Soft Skills & Communication',
              'professional english': 'Soft Skills & Communication',
              'professional communication': 'Soft Skills & Communication',
              'human values professional ethics': 'Human Values & Professional Ethics',
              'human values and professional ethics': 'Human Values & Professional Ethics',
              'artificial intelligence for engineers': 'Emerging Technology & AI',
              'emerging technology for engineering': 'Emerging Technology & AI',
              'ai for engineering': 'Emerging Technology & AI',
              'data structure': 'Data Structures',
              'data structures': 'Data Structures',
              'data structure and algorithms': 'Data Structures',
              'operating system': 'Operating Systems',
              'operating systems': 'Operating Systems',
              'web technology': 'Web Technologies',
              'web technologies': 'Web Technologies',
              'web designing': 'Web Technologies',
              'distributed system': 'Distributed Systems',
              'distributed systems': 'Distributed Systems',
              'antenna and wave progration': 'Antenna and Wave Propagation',
              'antenna and wave propagation': 'Antenna and Wave Propagation',
              'ic engines fuels and lubrication': 'IC Engines, Fuels & Lubrication',
              'ic engine fuels and lubrication': 'IC Engines, Fuels & Lubrication',
              'refrigeration and conditioning': 'Refrigeration & Air Conditioning',
              'refrigeration and air conditioning': 'Refrigeration & Air Conditioning',
              'machine design': 'Machine Design',
              'machine design 1': 'Machine Design',
              'machine design 2': 'Machine Design',
              'theory of machine': 'Theory of Machines',
              'theory of machines': 'Theory of Machines',
              'manufacturing science and technology 1': 'Manufacturing Science & Technology',
              'manufacturing science technology 2': 'Manufacturing Science & Technology',
              'manufacturing science and technology 2': 'Manufacturing Science & Technology',
              'microprocessor microcontroller': 'Microprocessors & Microcontrollers',
              'microprocessors and microcontrollers': 'Microprocessors & Microcontrollers',
              'microprocessor and microcontroller': 'Microprocessors & Microcontrollers',
              'introduction to microprocessors': 'Microprocessors & Microcontrollers',
              'mechatronics and microprocessor': 'Mechatronics & Microprocessors',
              'electronic devices and circuits': 'Electronic Devices & Circuits',
              'electronic devices': 'Electronic Devices & Circuits',
              'power system 1': 'Power Systems',
              'power system 2': 'Power Systems',
              'power system': 'Power Systems'
            };

            const getCanonicalSubjectName = (name) => {
              if (!name) return '';
              const clean = String(name).trim().toLowerCase();
              return NORMALIZE_SUBJECT_MAP[clean] || String(name).trim();
            };

            // Helper to resolve real subjects for selected branch & year
            const getSubjectsForBranchAndYear = (branchVal, yearVal) => {
              const normBranch = (branchVal || 'CSE').toUpperCase();
              const normYearNum = (yearVal || 'Year 1').replace(/[^0-9]/g, '');
              const yearKey = `Year ${normYearNum}`;

              const subjectsMap = new Map();

              // 1. Static dataset AKTU_PYQ_DATA (~280 verified subjects)
              if (Array.isArray(AKTU_PYQ_DATA)) {
                AKTU_PYQ_DATA.forEach(s => {
                  const sBranch = (s.branch || '').toUpperCase();
                  const appBranches = Array.isArray(s.applicableBranches) ? s.applicableBranches.map(b => b.toUpperCase()) : [];
                  const sYearNum = (s.year || '').replace(/[^0-9]/g, '');

                  const branchMatch = sBranch === 'ALL' || sBranch === normBranch || appBranches.includes(normBranch) || appBranches.includes('ALL');
                  const yearMatch = !normYearNum || sYearNum === normYearNum;

                  if (branchMatch && yearMatch && s.subject) {
                    const cName = getCanonicalSubjectName(s.subject);
                    const cKey = cName.toLowerCase().trim();
                    if (!subjectsMap.has(cKey)) {
                      subjectsMap.set(cKey, {
                        id: s.code || cKey,
                        name: cName,
                        code: s.code || 'AKTU',
                        branchId: normBranch,
                        year: yearKey,
                        aliases: new Set([s.subject.toLowerCase().trim(), (s.code || '').toLowerCase().trim()])
                      });
                    } else {
                      const item = subjectsMap.get(cKey);
                      item.aliases.add(s.subject.toLowerCase().trim());
                      if (s.code) item.aliases.add(s.code.toLowerCase().trim());
                    }
                  }
                });
              }

              // 2. Dynamic database subjects list from backend API
              if (Array.isArray(subjectsList)) {
                subjectsList.forEach(s => {
                  const sBranch = (s.branchId || s.branch || '').toUpperCase();
                  const sYearNum = (s.year || '').replace(/[^0-9]/g, '');

                  const branchMatch = sBranch === 'ALL' || sBranch === normBranch;
                  const yearMatch = !normYearNum || sYearNum === normYearNum;

                  if (branchMatch && yearMatch && (s.name || s.subjectName)) {
                    const rawName = s.name || s.subjectName;
                    const code = s.code || s.subjectCode || '';
                    const cName = getCanonicalSubjectName(rawName);
                    const cKey = cName.toLowerCase().trim();
                    if (!subjectsMap.has(cKey)) {
                      subjectsMap.set(cKey, {
                        id: s.id || cKey,
                        name: cName,
                        code: code || 'SUB',
                        branchId: normBranch,
                        year: yearKey,
                        aliases: new Set([rawName.toLowerCase().trim(), code.toLowerCase().trim()])
                      });
                    } else {
                      const item = subjectsMap.get(cKey);
                      item.aliases.add(rawName.toLowerCase().trim());
                      if (code) item.aliases.add(code.toLowerCase().trim());
                    }
                  }
                });
              }

              // 3. Backend adminPyqs records
              if (Array.isArray(adminPyqs)) {
                adminPyqs.forEach(p => {
                  const pBranch = (p.branchId || p.branch || '').toUpperCase();
                  const pYearNum = (p.year || '').replace(/[^0-9]/g, '');

                  const branchMatch = pBranch === 'ALL' || pBranch === normBranch;
                  const yearMatch = !normYearNum || pYearNum === normYearNum;

                  if (branchMatch && yearMatch && (p.subjectName || p.subject)) {
                    const rawName = p.subjectName || p.subject;
                    const code = p.subjectCode || '';
                    const cName = getCanonicalSubjectName(rawName);
                    const cKey = cName.toLowerCase().trim();
                    if (!subjectsMap.has(cKey)) {
                      subjectsMap.set(cKey, {
                        id: p.subjectId || cKey,
                        name: cName,
                        code: code || 'PYQ',
                        branchId: normBranch,
                        year: yearKey,
                        aliases: new Set([rawName.toLowerCase().trim(), code.toLowerCase().trim()])
                      });
                    } else {
                      const item = subjectsMap.get(cKey);
                      item.aliases.add(rawName.toLowerCase().trim());
                      if (code) item.aliases.add(code.toLowerCase().trim());
                    }
                  }
                });
              }

              return Array.from(subjectsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
            };

            // Helper to determine status for a subject cell in an academic session column
            const getPyqStatusForCell = (subject, sessionObj, branchVal, yearVal) => {
              const normSubName = subject.name.toLowerCase().trim();
              const normSubCode = (subject.code || '').toLowerCase().trim();
              const aliases = subject.aliases || new Set();
              const normBranch = (branchVal || 'CSE').toUpperCase();
              const normYearNum = (yearVal || 'Year 1').replace(/[^0-9]/g, '');

              // Check adminPyqs DB
              if (Array.isArray(adminPyqs)) {
                const dbRecord = adminPyqs.find(p => {
                  const pCourseNorm = (p.course || 'B.Tech').toLowerCase();
                  const targetCourseNorm = (pyqCourseFilter || 'B.Tech').toLowerCase();
                  const courseMatch = pyqCourseFilter === 'All' ||
                    (targetCourseNorm === 'b.tech' && (!p.course || pCourseNorm === 'b.tech' || pCourseNorm === 'btech')) ||
                    pCourseNorm === targetCourseNorm ||
                    pCourseNorm === targetCourseNorm.replace('.', '');
                  if (!courseMatch) return false;

                  const pSub = (p.subjectName || p.subject || '').toLowerCase().trim();
                  const pCode = (p.subjectCode || '').toLowerCase().trim();
                  const nameMatch = pSub === normSubName || aliases.has(pSub) || (normSubCode && pCode && (pCode === normSubCode || aliases.has(pCode))) || getCanonicalSubjectName(pSub).toLowerCase() === normSubName;
                  if (!nameMatch) return false;

                  if (targetCourseNorm === 'b.tech') {
                    const pBranch = (p.branchId || p.branch || '').toUpperCase();
                    const pYearNum = (p.year || '').replace(/[^0-9]/g, '');
                    const branchMatch = pBranch === 'ALL' || pBranch === normBranch;
                    const yearMatch = !normYearNum || pYearNum === normYearNum;
                    if (!branchMatch || !yearMatch) return false;
                  } else if (pyqCourseFilter !== 'All') {
                    const matchSem = !pyqSemesterFilter || pyqSemesterFilter === 'All' || p.semester === pyqSemesterFilter || p.year === pyqSemesterFilter;
                    if (!matchSem) return false;
                    if (pyqCourseFilter === 'MBA' && pyqSpecFilter !== 'All') {
                      if (p.specialization && p.specialization !== pyqSpecFilter) return false;
                    }
                  }

                  const pSession = (p.academicYear || p.examYear || '').toString();
                  const sessionMatch = pSession.includes(sessionObj.label) || pSession.includes(sessionObj.full) || pSession === sessionObj.year.toString();
                  return sessionMatch;
                });

                if (dbRecord) {
                  const isPublished = dbRecord.published !== false && dbRecord.status !== 'unpublished';
                  const hasUrl = Boolean(dbRecord.pdfUrl || dbRecord.fileUrl || dbRecord.url);
                  return {
                    isPublished: isPublished && hasUrl,
                    hasRecord: true,
                    record: dbRecord
                  };
                }
              }

              // Check static AKTU_PYQ_DATA (only for B.Tech)
              if ((!pyqCourseFilter || pyqCourseFilter === 'B.Tech' || pyqCourseFilter === 'All') && Array.isArray(AKTU_PYQ_DATA)) {
                const matchingSubs = AKTU_PYQ_DATA.filter(s => {
                  const sSub = (s.subject || '').toLowerCase().trim();
                  const sCode = (s.code || '').toLowerCase().trim();
                  return sSub === normSubName || aliases.has(sSub) || (sCode && aliases.has(sCode)) || getCanonicalSubjectName(sSub).toLowerCase() === normSubName;
                });

                for (const staticSub of matchingSubs) {
                  if (Array.isArray(staticSub.papers)) {
                    const paper = staticSub.papers.find(p => {
                      const pYr = (p.examYear || p.year || '').toString();
                      return pYr.includes(sessionObj.label) || pYr.includes(sessionObj.full) || pYr === sessionObj.year.toString();
                    });

                    if (paper && paper.available !== false && Boolean(paper.pdfUrl)) {
                      return {
                        isPublished: true,
                        record: {
                          id: `${staticSub.code}_${paper.year}`,
                          course: 'B.Tech',
                          subjectName: subject.name,
                          subjectCode: staticSub.code,
                          branchId: normBranch,
                          year: yearVal,
                          academicYear: sessionObj.full,
                          pdfUrl: paper.pdfUrl,
                          published: true,
                          resourceType: 'url'
                        }
                      };
                    }
                  }
                }
              }

              return { isPublished: false, record: null };
            };

            const getSubjectsForPyq = () => {
              if (pyqCourseFilter === 'MCA') {
                const mcaCourse = COURSES.find(c => c.key === 'MCA');
                const subs = (mcaCourse && mcaCourse.subjectsBySemester && mcaCourse.subjectsBySemester[pyqSemesterFilter]) || [];
                const subjectsMap = new Map();
                subs.forEach(s => {
                  subjectsMap.set(s.name.toLowerCase(), { id: s.code, name: s.name, code: s.code, aliases: new Set([s.name.toLowerCase(), s.code.toLowerCase()]) });
                });
                adminPyqs.filter(p => p.course === 'MCA' && (!pyqSemesterFilter || pyqSemesterFilter === 'All' || p.semester === pyqSemesterFilter || p.year === pyqSemesterFilter)).forEach(p => {
                  const name = p.subjectName || p.subject;
                  if (name && !subjectsMap.has(name.toLowerCase())) {
                    subjectsMap.set(name.toLowerCase(), { id: p.subjectCode || name, name, code: p.subjectCode || 'MCA', aliases: new Set([name.toLowerCase(), (p.subjectCode || '').toLowerCase()]) });
                  }
                });
                return Array.from(subjectsMap.values());
              }

              if (pyqCourseFilter === 'MBA') {
                const mbaCourse = COURSES.find(c => c.key === 'MBA');
                const subs = (mbaCourse && mbaCourse.subjectsBySemester && mbaCourse.subjectsBySemester[pyqSemesterFilter]) || [];
                const subjectsMap = new Map();
                subs.forEach(s => {
                  if (pyqSpecFilter && pyqSpecFilter !== 'All' && s.spec && s.spec !== pyqSpecFilter) return;
                  subjectsMap.set(s.name.toLowerCase(), { id: s.code, name: s.name, code: s.code, aliases: new Set([s.name.toLowerCase(), s.code.toLowerCase()]) });
                });
                adminPyqs.filter(p => p.course === 'MBA' && (!pyqSemesterFilter || pyqSemesterFilter === 'All' || p.semester === pyqSemesterFilter || p.year === pyqSemesterFilter)).forEach(p => {
                  const name = p.subjectName || p.subject;
                  if (name && !subjectsMap.has(name.toLowerCase())) {
                    subjectsMap.set(name.toLowerCase(), { id: p.subjectCode || name, name, code: p.subjectCode || 'MBA', aliases: new Set([name.toLowerCase(), (p.subjectCode || '').toLowerCase()]) });
                  }
                });
                return Array.from(subjectsMap.values());
              }

              if (pyqCourseFilter === 'B.Pharm') {
                const bpharmCourse = COURSES.find(c => c.key === 'B.Pharm');
                const subs = (bpharmCourse && bpharmCourse.subjectsBySemester && bpharmCourse.subjectsBySemester[pyqSemesterFilter]) || [];
                const subjectsMap = new Map();
                subs.forEach(s => {
                  subjectsMap.set(s.name.toLowerCase(), { id: s.code, name: s.name, code: s.code, aliases: new Set([s.name.toLowerCase(), s.code.toLowerCase()]) });
                });
                adminPyqs.filter(p => (p.course === 'B.Pharm' || p.course === 'BPharm') && (!pyqSemesterFilter || pyqSemesterFilter === 'All' || p.semester === pyqSemesterFilter || p.year === pyqSemesterFilter)).forEach(p => {
                  const name = p.subjectName || p.subject;
                  if (name && !subjectsMap.has(name.toLowerCase())) {
                    subjectsMap.set(name.toLowerCase(), { id: p.subjectCode || name, name, code: p.subjectCode || 'B.Pharm', aliases: new Set([name.toLowerCase(), (p.subjectCode || '').toLowerCase()]) });
                  }
                });
                return Array.from(subjectsMap.values());
              }

              return getSubjectsForBranchAndYear(pyqBranchFilter, pyqYearFilter);
            };

            const activeSubjects = getSubjectsForPyq() || [];

            const filteredSubjects = activeSubjects.filter(sub => {
              if (!pyqSearchText || !pyqSearchText.trim()) return true;
              const q = pyqSearchText.toLowerCase();
              return sub.name.toLowerCase().includes(q) || (sub.code && sub.code.toLowerCase().includes(q));
            });

            let totalPublishedSlots = 0;
            let totalUnpublishedSlots = 0;

            const statusMatrix = filteredSubjects.map(sub => {
              const rowStatus = {};
              academicSessions.forEach(session => {
                const statusObj = getPyqStatusForCell(sub, session, pyqBranchFilter, pyqYearFilter);
                rowStatus[session.label] = statusObj;
                if (statusObj.isPublished) {
                  totalPublishedSlots++;
                } else {
                  totalUnpublishedSlots++;
                }
              });
              return { subject: sub, statusMap: rowStatus };
            });

            // Filter logic for Table Mode
            const filteredPyqRecords = adminPyqs.filter(p => {
              const pCourseNorm = (p.course || 'B.Tech').toLowerCase();
              const targetCourseNorm = (pyqCourseFilter || 'B.Tech').toLowerCase();
              const courseMatch = pyqCourseFilter === 'All' ||
                (targetCourseNorm === 'b.tech' && (!p.course || pCourseNorm === 'b.tech' || pCourseNorm === 'btech')) ||
                pCourseNorm === targetCourseNorm ||
                pCourseNorm === targetCourseNorm.replace('.', '');
              if (!courseMatch) return false;

              if (targetCourseNorm === 'b.tech') {
                const bNorm = (p.branchId || p.branch || '').toUpperCase();
                const matchBranch = pyqBranchFilter === 'All' || bNorm === 'ALL' || bNorm === pyqBranchFilter.toUpperCase();
                const pYearNum = (p.year || '').replace(/[^0-9]/g, '');
                const selYearNum = (pyqYearFilter || '').replace(/[^0-9]/g, '');
                const matchYear = pyqYearFilter === 'All' || (pYearNum && pYearNum === selYearNum) || (p.year || '').toLowerCase() === pyqYearFilter.toLowerCase();
                if (!matchBranch || !matchYear) return false;
              } else if (pyqCourseFilter !== 'All') {
                const matchSem = pyqSemesterFilter === 'All' || p.semester === pyqSemesterFilter || p.year === pyqSemesterFilter;
                if (!matchSem) return false;
                if (pyqCourseFilter === 'MBA' && pyqSpecFilter !== 'All') {
                  if (p.specialization && p.specialization !== pyqSpecFilter) return false;
                }
              }

              if (pyqSubjectFilter !== 'All') {
                const sName = (p.subjectName || p.subject || '').toLowerCase();
                const sCode = (p.subjectCode || '').toLowerCase();
                const target = pyqSubjectFilter.toLowerCase();
                if (!sName.includes(target) && !sCode.includes(target)) return false;
              }

              if (pyqAcademicYearFilter !== 'All') {
                const ay = (p.academicYear || p.examYear || '').toString();
                if (!ay.includes(pyqAcademicYearFilter)) return false;
              }

              if (pyqExamTypeFilter !== 'All') {
                if ((p.examType || 'End Semester') !== pyqExamTypeFilter) return false;
              }

              if (pyqStatusFilter !== 'All') {
                const isPub = p.published !== false && p.status !== 'unpublished';
                if (pyqStatusFilter === 'Published' && !isPub) return false;
                if (pyqStatusFilter === 'Unpublished' && isPub) return false;
              }

              if (pyqSearchText && pyqSearchText.trim()) {
                const q = pyqSearchText.toLowerCase();
                const sName = (p.subjectName || p.subject || '').toLowerCase();
                const sCode = (p.subjectCode || '').toLowerCase();
                const pBranch = (p.branchId || p.branch || '').toLowerCase();
                const pYear = (p.year || '').toLowerCase();
                const pAy = (p.academicYear || p.examYear || '').toLowerCase();
                if (!sName.includes(q) && !sCode.includes(q) && !pBranch.includes(q) && !pYear.includes(q) && !pAy.includes(q)) {
                  return false;
                }
              }
              return true;
            });

            const totalFilteredPyqCount = filteredPyqRecords.length;
            const totalPyqPages = Math.ceil(totalFilteredPyqCount / pyqPageSize) || 1;
            const paginatedPyqRecords = filteredPyqRecords.slice((pyqPage - 1) * pyqPageSize, pyqPage * pyqPageSize);

            return (
              <div>
                {/* BREADCRUMBS & TOP HEADER */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.4rem' }}>
                      <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <LayoutDashboard size={13} /> Admin
                      </span>
                      <span>&gt;</span>
                      <span style={{ color: '#0f172a', fontWeight: 800 }}>Previous Year Papers (PYQs)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ backgroundColor: '#1F2421', color: '#ffffff', borderRadius: '12px', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(31,36,33,0.15)' }}>
                        <FileText size={22} />
                      </div>
                      <div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#1F2421', margin: 0, letterSpacing: '-0.02em' }}>
                          Previous Year Papers (PYQs)
                        </h1>
                        <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.15rem', margin: 0 }}>
                          Manage PYQs subject-wise. Upload PDFs, add URLs, and control publish status.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open('/pyqs', '_blank', 'noopener,noreferrer')}
                    style={{
                      backgroundColor: '#ffffff', border: '1.5px solid #E8E2D5', borderRadius: '10px',
                      padding: '0.55rem 1rem', fontSize: '0.82rem', fontWeight: 800, color: '#1F2421',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.03)', transition: 'all 0.15s ease'
                    }}
                  >
                    <ExternalLink size={15} style={{ color: '#C88D2D' }} /> View Public PYQ Page
                  </button>
                </div>

                {/* COURSE OVERVIEW KPI CARDS SECTION */}
                {renderCourseKpiCards(c => { setPyqCourseFilter(c); setPyqPage(1); })}

                {/* TOP FILTER BAR & KPI STATISTICS CARDS ROW */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #E8E2D5', padding: '1.1rem', marginBottom: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.5fr) auto', gap: '1rem', alignItems: 'center' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {/* COURSE SELECTOR */}
                      <div style={{ minWidth: '160px', flex: 1 }}>
                        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                          Course *
                        </label>
                        <select
                          value={pyqCourseFilter}
                          onChange={(e) => {
                            const c = e.target.value;
                            setPyqCourseFilter(c);
                            setPyqPage(1);
                            if (c === 'MCA' || c === 'MBA' || c === 'B.Pharm') {
                              setPyqSemesterFilter('Semester 1');
                            }
                          }}
                          style={{
                            width: '100%', border: '1.5px solid #E8E2D5', borderRadius: '10px', padding: '0.55rem 0.85rem',
                            fontSize: '0.84rem', fontWeight: 800, color: '#1F2421', backgroundColor: '#FAF7F2', outline: 'none', cursor: 'pointer'
                          }}
                        >
                          <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                          <option value="MCA">MCA (Master of Computer Applications)</option>
                          <option value="MBA">MBA (Master of Business Administration)</option>
                          <option value="B.Pharm">B.Pharm (Bachelor of Pharmacy)</option>
                          <option value="All">All Courses</option>
                        </select>
                      </div>

                      {/* DYNAMIC SECONDARY FILTERS ACCORDING TO COURSE */}
                      {(pyqCourseFilter === 'B.Tech' || pyqCourseFilter === 'All') ? (
                        <>
                          <div style={{ minWidth: '150px', flex: 1 }}>
                            <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                              Branch *
                            </label>
                            <select
                              value={pyqBranchFilter}
                              onChange={(e) => { setPyqBranchFilter(e.target.value); setPyqPage(1); }}
                              style={{
                                width: '100%', border: '1.5px solid #E8E2D5', borderRadius: '10px', padding: '0.55rem 0.85rem',
                                fontSize: '0.84rem', fontWeight: 800, color: '#1F2421', backgroundColor: '#FAF7F2', outline: 'none', cursor: 'pointer'
                              }}
                            >
                              <option value="All">All Branches</option>
                              <option value="CSE">CSE (Computer Science & Engineering)</option>
                              <option value="ECE">ECE (Electronics & Communication)</option>
                              <option value="ME">ME (Mechanical Engineering)</option>
                              <option value="CE">CE (Civil Engineering)</option>
                              <option value="IT">IT (Information Technology)</option>
                              <option value="EE">EE (Electrical Engineering)</option>
                              <option value="AI & ML">AI & ML</option>
                              <option value="DS">DS</option>
                            </select>
                          </div>

                          <div style={{ minWidth: '130px', flex: 1 }}>
                            <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                              Year *
                            </label>
                            <select
                              value={pyqYearFilter}
                              onChange={(e) => { setPyqYearFilter(e.target.value); setPyqPage(1); }}
                              style={{
                                width: '100%', border: '1.5px solid #E8E2D5', borderRadius: '10px', padding: '0.55rem 0.85rem',
                                fontSize: '0.84rem', fontWeight: 800, color: '#1F2421', backgroundColor: '#FAF7F2', outline: 'none', cursor: 'pointer'
                              }}
                            >
                              <option value="All">All Years</option>
                              <option value="Year 1">Year 1 (1st Year)</option>
                              <option value="Year 2">Year 2 (2nd Year)</option>
                              <option value="Year 3">Year 3 (3rd Year)</option>
                              <option value="Year 4">Year 4 (4th Year)</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ minWidth: '150px', flex: 1 }}>
                            <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                              Semester *
                            </label>
                            <select
                              value={pyqSemesterFilter}
                              onChange={(e) => { setPyqSemesterFilter(e.target.value); setPyqPage(1); }}
                              style={{
                                width: '100%', border: '1.5px solid #E8E2D5', borderRadius: '10px', padding: '0.55rem 0.85rem',
                                fontSize: '0.84rem', fontWeight: 800, color: '#1F2421', backgroundColor: '#FAF7F2', outline: 'none', cursor: 'pointer'
                              }}
                            >
                              {pyqCourseFilter === 'B.Pharm'
                                ? [1,2,3,4,5,6,7,8].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)
                                : [1,2,3,4].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)
                              }
                            </select>
                          </div>

                          {pyqCourseFilter === 'MBA' && (
                            <div style={{ minWidth: '160px', flex: 1 }}>
                              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                                Specialization
                              </label>
                              <select
                                value={pyqSpecFilter}
                                onChange={(e) => { setPyqSpecFilter(e.target.value); setPyqPage(1); }}
                                style={{
                                  width: '100%', border: '1.5px solid #E8E2D5', borderRadius: '10px', padding: '0.55rem 0.85rem',
                                  fontSize: '0.84rem', fontWeight: 800, color: '#1F2421', backgroundColor: '#FAF7F2', outline: 'none', cursor: 'pointer'
                                }}
                              >
                                <option value="All">All Specializations</option>
                                <option value="Core Management">Core Management</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Finance">Finance</option>
                                <option value="Human Resources">Human Resources</option>
                                <option value="Operations & Supply Chain">Operations & Supply Chain</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="International Business">International Business</option>
                              </select>
                            </div>
                          )}
                        </>
                      )}

                      {/* VIEW MODE SWITCH */}
                      <div style={{ minWidth: '180px' }}>
                        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                          View Mode
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FAF7F2', border: '1.5px solid #E8E2D5', borderRadius: '10px', padding: '2px' }}>
                          <button
                            type="button"
                            onClick={() => setPyqViewMode('matrix')}
                            style={{
                              flex: 1, padding: '0.4rem 0.6rem', borderRadius: '8px', border: 'none',
                              backgroundColor: pyqViewMode === 'matrix' ? '#1F2421' : 'transparent',
                              color: pyqViewMode === 'matrix' ? '#ffffff' : '#64748b',
                              fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer', whiteSpace: 'nowrap'
                            }}
                          >
                            Matrix View
                          </button>
                          <button
                            type="button"
                            onClick={() => setPyqViewMode('table')}
                            style={{
                              flex: 1, padding: '0.4rem 0.6rem', borderRadius: '8px', border: 'none',
                              backgroundColor: pyqViewMode === 'table' ? '#1F2421' : 'transparent',
                              color: pyqViewMode === 'table' ? '#ffffff' : '#64748b',
                              fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer', whiteSpace: 'nowrap'
                            }}
                          >
                            Table View ({adminPyqs.length})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* KPI PILLS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '0.6rem 0.85rem', minWidth: '115px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ backgroundColor: '#0284c7', color: '#ffffff', borderRadius: '8px', padding: '0.35rem', display: 'flex' }}>
                          <BookOpen size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>Subjects</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0284c7', lineHeight: 1.1 }}>{filteredSubjects.length}</div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#FDF6E8', border: '1px solid #E8D3B0', borderRadius: '12px', padding: '0.6rem 0.85rem', minWidth: '115px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ backgroundColor: '#C88D2D', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #ffffff', boxShadow: '0 0 0 2px #C88D2D' }}></div>
                        <div>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#7A5835', textTransform: 'uppercase' }}>Published</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#C88D2D', lineHeight: 1.1 }}>{totalPublishedSlots}</div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '0.6rem 0.85rem', minWidth: '115px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ backgroundColor: '#ef4444', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #ffffff', boxShadow: '0 0 0 2px #ef4444' }}></div>
                        <div>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase' }}>Unpublished</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#dc2626', lineHeight: 1.1 }}>{totalUnpublishedSlots}</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* SECTION HEADER & SEARCH / SYNC TOOLBAR */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1.5px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.15rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1F2421', margin: 0 }}>
                        {pyqCourseFilter} {pyqCourseFilter === 'B.Tech' || pyqCourseFilter === 'All' ? `${pyqBranchFilter} – ${pyqYearFilter}` : (pyqCourseFilter === 'MBA' ? `${pyqSemesterFilter}${pyqSpecFilter !== 'All' ? ` • ${pyqSpecFilter}` : ''}` : pyqSemesterFilter)} ({pyqViewMode === 'table' ? filteredPyqRecords.length + ' Papers' : filteredSubjects.length + ' Subjects'})
                      </h2>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', margin: 0 }}>
                        {pyqViewMode === 'table' ? 'Search, filter, view and manage all individual uploaded PYQ papers.' : 'Manage PYQs for each subject from 2017-2018 to 2025-2026. Click on status to upload/edit or publish/unpublish.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative', width: '220px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                          type="text"
                          placeholder="Search subjects or papers..."
                          value={pyqSearchText}
                          onChange={(e) => { setPyqSearchText(e.target.value); setPyqPage(1); }}
                          style={{
                            width: '100%', paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.45rem', paddingBottom: '0.45rem',
                            fontSize: '0.82rem', borderRadius: '8px', border: '1px solid #E8E2D5', outline: 'none', fontWeight: 600, color: '#1F2421'
                          }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          fetchAdminPyqs();
                          fetchDashboardData();
                        }}
                        style={{
                          backgroundColor: '#FAF7F2', color: '#1F2421', border: '1.5px solid #E8E2D5', borderRadius: '8px',
                          padding: '0.5rem 0.85rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}
                      >
                        <RefreshCw size={14} /> Sync DB
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCellPyqData({
                            course: pyqCourseFilter === 'All' ? 'B.Tech' : pyqCourseFilter,
                            branch: pyqBranchFilter === 'All' ? 'CSE' : pyqBranchFilter,
                            year: pyqCourseFilter === 'B.Tech' ? pyqYearFilter : pyqSemesterFilter,
                            semester: pyqCourseFilter !== 'B.Tech' ? pyqSemesterFilter : '',
                            specialization: pyqCourseFilter === 'MBA' ? (pyqSpecFilter === 'All' ? 'Core Management' : pyqSpecFilter) : '',
                            academicYear: '2024-2025'
                          });
                          setActiveModal('addPyq');
                        }}
                        className="btn-primary"
                        style={{ padding: '0.5rem 0.95rem', backgroundColor: '#1F2421', fontSize: '0.82rem', fontWeight: 800, borderRadius: '8px' }}
                      >
                        + Add New PYQ
                      </button>
                    </div>
                  </div>

                  {/* CONDITIONAL: TABLE VIEW OR MATRIX VIEW */}
                  {pyqViewMode === 'table' ? (
                    <div>
                      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800, textAlign: 'center', width: '38px' }}>#</th>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800 }}>Course</th>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800 }}>Branch / Semester</th>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800 }}>Subject</th>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800 }}>Session</th>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800 }}>Type</th>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800 }}>Resource Link</th>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800 }}>Status</th>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedPyqRecords.length === 0 ? (
                              <tr>
                                <td colSpan={9} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                                  No PYQ records match the selected filters.
                                </td>
                              </tr>
                            ) : (
                              paginatedPyqRecords.map((p, idx) => {
                                const isPub = p.published !== false && p.status !== 'unpublished';
                                const pCourse = p.course || 'B.Tech';
                                const pUrl = p.pdfUrl || p.fileUrl || p.url || '';
                                const courseColor = pCourse === 'MCA' ? '#1E40AF' : pCourse === 'MBA' ? '#92400E' : pCourse === 'B.Pharm' ? '#9D174D' : '#0F766E';
                                const courseBg = pCourse === 'MCA' ? '#F0F5FF' : pCourse === 'MBA' ? '#FFFBEB' : pCourse === 'B.Pharm' ? '#FDF2F8' : '#F0FDFA';
                                const courseBorder = pCourse === 'MCA' ? '#BFDBFE' : pCourse === 'MBA' ? '#FDE68A' : pCourse === 'B.Pharm' ? '#FBCFE8' : '#99F6E4';

                                return (
                                  <tr key={p.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.65rem 0.6rem', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                                      {(pyqPage - 1) * pyqPageSize + idx + 1}.
                                    </td>
                                    <td style={{ padding: '0.65rem 0.6rem' }}>
                                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: courseColor, backgroundColor: courseBg, border: `1px solid ${courseBorder}`, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                        {pCourse}
                                      </span>
                                    </td>
                                    <td style={{ padding: '0.65rem 0.6rem', fontWeight: 700, color: '#1F2421' }}>
                                      {pCourse === 'B.Tech' ? `${p.branchId || p.branch || 'CSE'} • ${p.year || 'Year 1'}` : `${p.semester || p.year || 'Semester 1'}${p.specialization ? ` (${p.specialization})` : ''}`}
                                    </td>
                                    <td style={{ padding: '0.65rem 0.6rem' }}>
                                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{p.subjectName || p.subject || 'Subject'}</div>
                                      {p.subjectCode && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>({p.subjectCode})</div>}
                                    </td>
                                    <td style={{ padding: '0.65rem 0.6rem', fontWeight: 700, color: '#475569' }}>
                                      {p.academicYear || p.examYear || 'Session'}
                                    </td>
                                    <td style={{ padding: '0.65rem 0.6rem' }}>
                                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', backgroundColor: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                        {p.resourceType === 'url' ? 'External URL' : 'PDF'}
                                      </span>
                                    </td>
                                    <td style={{ padding: '0.65rem 0.6rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {pUrl ? (
                                        <a href={pUrl} target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                          View PDF <ExternalLink size={12} />
                                        </a>
                                      ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>No link</span>
                                      )}
                                    </td>
                                    <td style={{ padding: '0.65rem 0.6rem' }}>
                                      <button
                                        onClick={() => handleTogglePublishPyq(p)}
                                        style={{
                                          backgroundColor: isPub ? '#dcfce7' : '#fee2e2',
                                          color: isPub ? '#15803d' : '#b91c1c',
                                          border: isPub ? '1px solid #bbf7d0' : '1px solid #fecaca',
                                          borderRadius: '9999px',
                                          padding: '0.2rem 0.5rem',
                                          fontSize: '0.68rem',
                                          fontWeight: 800,
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {isPub ? 'Published' : 'Unpublished'}
                                      </button>
                                    </td>
                                    <td style={{ padding: '0.65rem 0.6rem', textAlign: 'right' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                        {pUrl && (
                                          <button onClick={() => window.open(pUrl, '_blank')} style={actionIconBtnStyle('#0284c7', '#f0f9ff')} title="Open Resource">
                                            <Eye size={13} />
                                          </button>
                                        )}
                                        <button onClick={() => { setEditingPyq(p); setActiveModal('editPyq'); }} style={actionIconBtnStyle('#1F2421', '#FDF6E8')} title="Edit PYQ">
                                          <Edit size={13} />
                                        </button>
                                        <button onClick={() => handleDeletePyq(p)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }} title="Delete PYQ">
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* PAGINATION CONTROLS */}
                      {totalPyqPages > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>
                          <div>
                            Showing {(pyqPage - 1) * pyqPageSize + 1} to {Math.min(pyqPage * pyqPageSize, totalFilteredPyqCount)} of {totalFilteredPyqCount} PYQ records
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              onClick={() => setPyqPage(p => Math.max(1, p - 1))}
                              disabled={pyqPage === 1}
                              style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: pyqPage === 1 ? '#f1f5f9' : '#ffffff', color: pyqPage === 1 ? '#94a3b8' : '#0f172a', fontWeight: 700, cursor: pyqPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                              Previous
                            </button>
                            <span style={{ fontWeight: 800, color: '#0f172a', padding: '0 0.4rem' }}>
                              Page {pyqPage} of {totalPyqPages}
                            </span>
                            <button
                              onClick={() => setPyqPage(p => Math.min(totalPyqPages, p + 1))}
                              disabled={pyqPage === totalPyqPages}
                              style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: pyqPage === totalPyqPages ? '#f1f5f9' : '#ffffff', color: pyqPage === totalPyqPages ? '#94a3b8' : '#0f172a', fontWeight: 700, cursor: pyqPage === totalPyqPages ? 'not-allowed' : 'pointer' }}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* SUBJECT MATRIX TABLE */}
                      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                              <th style={{ padding: '0.75rem 0.6rem', color: '#475569', fontWeight: 800, textAlign: 'center', width: '38px' }}>#</th>
                              <th style={{ padding: '0.75rem 0.85rem', color: '#475569', fontWeight: 800, minWidth: '200px' }}>Subject Name (Code)</th>
                              {academicSessions.map(sess => (
                                <th key={sess.label} style={{ padding: '0.75rem 0.4rem', color: '#475569', fontWeight: 800, textAlign: 'center', minWidth: '92px' }}>
                                  {sess.label}
                                </th>
                              ))}
                              <th style={{ padding: '0.75rem 0.85rem', color: '#475569', fontWeight: 800, textAlign: 'center', minWidth: '85px' }}>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {statusMatrix.length === 0 ? (
                              <tr>
                                <td colSpan={12} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                                  No subjects found for <b>{pyqCourseFilter}</b>.
                                </td>
                              </tr>
                            ) : (
                              statusMatrix.map(({ subject, statusMap }, idx) => (
                                <tr key={subject.id || idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}>
                                  
                                  <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                                    {idx + 1}.
                                  </td>

                                  <td style={{ padding: '0.75rem 0.85rem' }}>
                                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.84rem' }}>
                                      {subject.name}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                                      ({subject.code || 'GENERAL'})
                                    </div>
                                  </td>

                                  {academicSessions.map(sess => {
                                    const statusObj = statusMap[sess.label];
                                    const isPub = statusObj?.isPublished;
                                    const pyqRec = statusObj?.record;

                                    return (
                                      <td key={sess.label} style={{ padding: '0.6rem 0.35rem', textAlign: 'center' }}>
                                        <button
                                          onClick={() => {
                                            if (pyqRec) {
                                              setEditingPyq(pyqRec);
                                              setActiveModal('editPyq');
                                            } else {
                                              setSelectedCellPyqData({
                                                course: pyqCourseFilter === 'All' ? 'B.Tech' : pyqCourseFilter,
                                                branch: pyqBranchFilter === 'All' ? 'CSE' : pyqBranchFilter,
                                                year: pyqCourseFilter === 'B.Tech' ? pyqYearFilter : pyqSemesterFilter,
                                                semester: pyqCourseFilter !== 'B.Tech' ? pyqSemesterFilter : '',
                                                specialization: pyqCourseFilter === 'MBA' ? (pyqSpecFilter === 'All' ? 'Core Management' : pyqSpecFilter) : '',
                                                subjectName: subject.name,
                                                subjectCode: subject.code,
                                                academicYear: sess.full
                                              });
                                              setActiveModal('addPyq');
                                            }
                                          }}
                                          title={isPub ? 'Published - Click to edit paper' : (pyqRec ? 'Unpublished - Click to edit paper' : 'No paper - Click to add')}
                                          style={{
                                            backgroundColor: isPub ? '#dcfce7' : '#fee2e2',
                                            color: isPub ? '#15803d' : '#b91c1c',
                                            border: isPub ? '1px solid #bbf7d0' : '1px solid #fecaca',
                                            borderRadius: '9999px',
                                            padding: '0.25rem 0.55rem',
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            transition: 'transform 0.1s ease, boxShadow 0.1s ease',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isPub ? '#22c55e' : '#ef4444' }}></span>
                                          {isPub ? 'Published' : 'Unpublished'}
                                        </button>
                                      </td>
                                    );
                                  })}

                                  <td style={{ padding: '0.6rem 0.85rem', textAlign: 'center' }}>
                                    <button
                                      onClick={() => {
                                        const normSubName = subject.name.toLowerCase().trim();
                                        const normSubCode = (subject.code || '').toLowerCase().trim();
                                        const normBranch = (pyqBranchFilter || 'CSE').toUpperCase();
                                        const normYearNum = (pyqYearFilter || 'Year 1').replace(/[^0-9]/g, '');

                                        const existingRec = Array.isArray(adminPyqs) ? adminPyqs.find(p => {
                                          const pSub = (p.subjectName || p.subject || '').toLowerCase().trim();
                                          const pCode = (p.subjectCode || '').toLowerCase().trim();
                                          const pBranch = (p.branchId || p.branch || '').toUpperCase();
                                          const pYearNum = (p.year || '').replace(/[^0-9]/g, '');
                                          const nameMatch = pSub === normSubName || (normSubCode && pCode && pCode === normSubCode);
                                          const branchMatch = pBranch === 'ALL' || pBranch === normBranch;
                                          const yearMatch = !normYearNum || pYearNum === normYearNum;
                                          return nameMatch && branchMatch && yearMatch;
                                        }) : null;

                                        if (existingRec) {
                                          setEditingPyq(existingRec);
                                          setActiveModal('editPyq');
                                        } else {
                                          setSelectedCellPyqData({
                                            course: pyqCourseFilter === 'All' ? 'B.Tech' : pyqCourseFilter,
                                            branch: pyqBranchFilter === 'All' ? 'CSE' : pyqBranchFilter,
                                            year: pyqCourseFilter === 'B.Tech' ? pyqYearFilter : pyqSemesterFilter,
                                            semester: pyqCourseFilter !== 'B.Tech' ? pyqSemesterFilter : '',
                                            specialization: pyqCourseFilter === 'MBA' ? (pyqSpecFilter === 'All' ? 'Core Management' : pyqSpecFilter) : '',
                                            subjectName: subject.name,
                                            subjectCode: subject.code,
                                            academicYear: '2024-2025'
                                          });
                                          setActiveModal('addPyq');
                                        }
                                      }}
                                      style={{
                                        border: '1.5px solid #0284c7', color: '#0284c7', backgroundColor: '#f0f9ff',
                                        borderRadius: '8px', padding: '0.3rem 0.65rem', fontSize: '0.75rem', fontWeight: 800,
                                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px'
                                      }}
                                    >
                                      <Edit size={12} /> Edit
                                    </button>
                                  </td>

                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* BOTTOM LEGEND INFO BAR */}
                      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '0.75rem 1rem', marginTop: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem', color: '#1e40af' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                          <HelpCircle size={15} style={{ color: '#2563eb' }} />
                          <span>Click on any status (Published/Unpublished) to upload, edit or change publish status for that subject and year.</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontWeight: 800 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                            Published (Visible on website)
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                            Unpublished (Not visible)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })()}

          {/* TAB 2: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                    Welcome Admin! <span role="img" aria-label="wave">👋</span>
                  </h1>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.2rem' }}>
                    ProfessorVirus Real Previous Year Exam Admin Management Control Panel.
                  </p>
                </div>
                <div style={{ backgroundColor: '#FDF6E8', borderRadius: '16px', border: '1.5px solid #E8D3B0', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={24} style={{ color: '#C88D2D' }} />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1F2421' }}>Database Active</div>
                    <div style={{ fontSize: '0.74rem', color: '#7A5835' }}>All stats fetched live from backend.</div>
                  </div>
                </div>
              </div>

              {/* COURSE OVERVIEW KPI SECTION */}
              {renderCourseKpiCards(c => { setActiveTab('notes'); setNoteCourseFilter(c); })}

              {/* KPI CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.15rem', marginBottom: '1.5rem' }}>
                <div style={kpiCardStyle} onClick={() => setActiveTab('pyqs')}>
                  <div style={kpiLabelStyle}>Total PYQs</div>
                  <div style={kpiValueStyle}>{stats.totalPYQs}</div>
                  <div style={kpiSubStyle}>{stats.publishedPYQs} Published • {stats.unpublishedPYQs} Unpublished</div>
                </div>

                <div style={kpiCardStyle} onClick={() => setActiveTab('notes')}>
                  <div style={kpiLabelStyle}>Total Notes</div>
                  <div style={kpiValueStyle}>{stats.totalNotes}</div>
                  <div style={kpiSubStyle}>Published study notes</div>
                </div>

                <div style={kpiCardStyle} onClick={() => setActiveTab('users')}>
                  <div style={kpiLabelStyle}>Total Users</div>
                  <div style={kpiValueStyle}>{stats.totalUsers}</div>
                  <div style={kpiSubStyle}>{stats.totalStudents} Registered Students</div>
                </div>

                <div style={kpiCardStyle} onClick={() => setActiveTab('support')}>
                  <div style={kpiLabelStyle}>Open Tickets</div>
                  <div style={kpiValueStyle}>{stats.openTickets}</div>
                  <div style={kpiSubStyle}>Support & Feedback</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTES MANAGEMENT */}
          {activeTab === 'notes' && (() => {
            // Multi-course aware subject getter
            const getSubjectsForSelection = (courseVal, branchVal, yearVal, semesterVal, specVal) => {
              const normCourse = courseVal || 'B.Tech';
              const results = new Map();

              if (normCourse === 'MCA') {
                const mcaCourse = COURSES.find(c => c.key === 'MCA');
                const semKey = semesterVal && semesterVal !== 'All' ? semesterVal : null;
                if (mcaCourse && mcaCourse.subjectsBySemester) {
                  const sems = semKey ? [semKey] : Object.keys(mcaCourse.subjectsBySemester);
                  sems.forEach(s => {
                    (mcaCourse.subjectsBySemester[s] || []).forEach(sub => {
                      results.set(sub.name.toLowerCase(), { name: sub.name, code: sub.code || '' });
                    });
                  });
                }
                if (Array.isArray(adminNotes)) {
                  adminNotes.filter(n => n.course === 'MCA' && (!semKey || n.semester === semKey || n.year === semKey)).forEach(n => {
                    const name = n.subjectName || n.subject;
                    if (name && !results.has(name.toLowerCase())) {
                      results.set(name.toLowerCase(), { name, code: n.subjectCode || '' });
                    }
                  });
                }
                return Array.from(results.values());
              }

              if (normCourse === 'MBA') {
                const mbaCourse = COURSES.find(c => c.key === 'MBA');
                const semKey = semesterVal && semesterVal !== 'All' ? semesterVal : null;
                if (mbaCourse && mbaCourse.subjectsBySemester) {
                  const sems = semKey ? [semKey] : Object.keys(mbaCourse.subjectsBySemester);
                  sems.forEach(s => {
                    (mbaCourse.subjectsBySemester[s] || []).forEach(sub => {
                      if (specVal && specVal !== 'All' && sub.spec && sub.spec !== specVal) return;
                      results.set(sub.name.toLowerCase(), { name: sub.name, code: sub.code || '' });
                    });
                  });
                }
                if (Array.isArray(adminNotes)) {
                  adminNotes.filter(n => n.course === 'MBA' && (!semKey || n.semester === semKey || n.year === semKey)).forEach(n => {
                    if (specVal && specVal !== 'All' && n.specialization && n.specialization !== specVal) return;
                    const name = n.subjectName || n.subject;
                    if (name && !results.has(name.toLowerCase())) {
                      results.set(name.toLowerCase(), { name, code: n.subjectCode || '' });
                    }
                  });
                }
                return Array.from(results.values());
              }

              if (normCourse === 'B.Pharm') {
                const pharmCourse = COURSES.find(c => c.key === 'B.Pharm');
                const semKey = semesterVal && semesterVal !== 'All' ? semesterVal : null;
                if (pharmCourse && pharmCourse.subjectsBySemester) {
                  const sems = semKey ? [semKey] : Object.keys(pharmCourse.subjectsBySemester);
                  sems.forEach(s => {
                    (pharmCourse.subjectsBySemester[s] || []).forEach(sub => {
                      results.set(sub.name.toLowerCase(), { name: sub.name, code: sub.code || '' });
                    });
                  });
                }
                if (Array.isArray(adminNotes)) {
                  adminNotes.filter(n => n.course === 'B.Pharm' && (!semKey || n.semester === semKey || n.year === semKey)).forEach(n => {
                    const name = n.subjectName || n.subject;
                    if (name && !results.has(name.toLowerCase())) {
                      results.set(name.toLowerCase(), { name, code: n.subjectCode || '' });
                    }
                  });
                }
                return Array.from(results.values());
              }

              if (normCourse === 'All') {
                if (Array.isArray(adminNotes)) {
                  adminNotes.forEach(n => {
                    const name = n.subjectName || n.subject;
                    if (name && !results.has(name.toLowerCase())) {
                      results.set(name.toLowerCase(), { name, code: n.subjectCode || '' });
                    }
                  });
                }
                return Array.from(results.values());
              }

              // B.Tech
              const normBranch = (branchVal || 'CSE').toUpperCase();
              const selYearNum = String(yearVal || '').replace(/[^0-9]/g, '');
              let yearKey = '1st Year';
              if (yearVal === 'Year 2' || yearVal === '2nd Year' || selYearNum === '2') yearKey = '2nd Year';
              else if (yearVal === 'Year 3' || yearVal === '3rd Year' || selYearNum === '3') yearKey = '3rd Year';
              else if (yearVal === 'Year 4' || yearVal === '4th Year' || selYearNum === '4') yearKey = '4th Year';

              if (Array.isArray(subjectsList)) {
                subjectsList.forEach(s => {
                  const bMatch = !branchVal || branchVal === 'All' || s.branchId === 'ALL' || s.branchId === normBranch;
                  const sYearNum = String(s.year || '').replace(/[^0-9]/g, '');
                  const yMatch = !yearVal || yearVal === 'All' || s.year === yearVal || s.year === yearKey || (sYearNum && sYearNum === selYearNum);
                  if (bMatch && yMatch && (s.name || s.subjectName)) {
                    const name = s.name || s.subjectName;
                    results.set(name.toLowerCase(), { name, code: s.code || s.subjectCode || '' });
                  }
                });
              }

              const bData = QUANTUM_NOTES[normBranch] || QUANTUM_NOTES['CSE'];
              if (bData && bData[yearKey]) {
                Object.values(bData[yearKey]).forEach(semList => {
                  if (Array.isArray(semList)) {
                    semList.forEach(sub => {
                      if (sub && sub.name && !results.has(sub.name.toLowerCase())) {
                        results.set(sub.name.toLowerCase(), { name: sub.name, code: sub.code || '' });
                      }
                    });
                  }
                });
              }

              if (Array.isArray(adminNotes)) {
                adminNotes.forEach(n => {
                  const nCourse = n.course || 'B.Tech';
                  if (nCourse !== 'B.Tech') return;
                  const nBranchNorm = (n.branch || n.branchId || '').toUpperCase();
                  const bMatch = !branchVal || branchVal === 'All' || nBranchNorm === 'ALL' || nBranchNorm === normBranch;
                  const nYearNum = String(n.year || '').replace(/[^0-9]/g, '');
                  const yMatch = !yearVal || yearVal === 'All' || (nYearNum && nYearNum === selYearNum) || n.year === yearVal;
                  const sName = n.subjectName || n.subject;
                  if (bMatch && yMatch && sName && !results.has(sName.toLowerCase())) {
                    results.set(sName.toLowerCase(), { name: sName, code: n.subjectCode || '' });
                  }
                });
              }

              if (results.size === 0) {
                return [
                  { name: 'Engineering Mathematics-I', code: 'KAS-103T' },
                  { name: 'Engineering Physics', code: 'KAS-101T' },
                  { name: 'Basic Electrical Engineering', code: 'KEE-101T' },
                  { name: 'Programming for Problem Solving', code: 'KCS-101T' }
                ];
              }

              return Array.from(results.values());
            };

            const availableSubjectsForHier = getSubjectsForSelection(hierCourse, hierBranch, hierYear, hierSemester, hierSpec);
            const availableSubjectsForFilter = getSubjectsForSelection(noteCourseFilter, noteBranchFilter, noteYearFilter, noteSemesterFilter, noteSpecFilter);

            // Note Sources array definition (supports NotesGallery, Quantum, Gateway, etc.)
            const ADMIN_NOTE_SOURCES = [
              { id: 'notesgallery', name: 'NotesGallery', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
              { id: 'quantum', name: 'Quantum Notes', color: '#1F2421', bg: '#FDF6E8', border: '#E8D3B0' },
              { id: 'gateway_classes', name: 'Gateway Classes', color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd' },
              { id: 'faculty_notes', name: 'Faculty Lecture Notes', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
              { id: 'aktu_solved_papers', name: 'AKTU Solved Papers', color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff' },
              { id: 'handwritten', name: 'Handwritten Notes', color: '#C88D2D', bg: '#FDF6E8', border: '#E8D3B0' }
            ];

            const normSubAdmin = (str) => {
              return String(str || '')
                .toLowerCase()
                .replace(/\s*\([^)]*\)/g, '')
                .replace(/[-_\s]iv\b/g, '4')
                .replace(/[-_\s]iii\b/g, '3')
                .replace(/[-_\s]ii\b/g, '2')
                .replace(/[-_\s]i\b/g, '1')
                .replace(/[^a-z0-9]/g, '');
            };
            const normCodeAdmin = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

            const isSubjectMatchAdmin = (targetSub, note) => {
              if (!targetSub || targetSub === 'All') return true;
              const tName = normSubAdmin(targetSub);
              const nName = normSubAdmin(note.subjectName || note.subject || '');

              if (tName && nName && tName === nName) return true;

              const tCode = normCodeAdmin(targetSub);
              const nCode = normCodeAdmin(note.subjectCode);
              if (tCode && nCode && tCode.length >= 4 && nCode.length >= 4 && !['KOE', 'AKTU', 'NOTES'].includes(tCode) && !['KOE', 'AKTU', 'NOTES'].includes(nCode)) {
                if (tCode === nCode) {
                  if (!tName || !nName || tName === nName || tName.includes(nName) || nName.includes(tName)) return true;
                }
                const tEquiv = tCode.replace(/^[KB]/, '');
                const nEquiv = nCode.replace(/^[KB]/, '');
                if (tEquiv === nEquiv && tEquiv.length >= 4) {
                  if (!tName || !nName || tName === nName || tName.includes(nName) || nName.includes(tName)) return true;
                }
              }

              if (tName && nName && (tName.length > 8 && nName.length > 8 && (tName.includes(nName) || nName.includes(tName)))) {
                const numT = tName.match(/[0-9]/g)?.join('');
                const numN = nName.match(/[0-9]/g)?.join('');
                if (!numT && !numN) return true;
                if (numT && numN && numT === numN) return true;
              }

              return false;
            };

            // Helper to get matching DB note for Quick Editor
            const findMatchingNote = (sourceKey) => {
              return adminNotes.find(n => {
                const nCourse = n.course || 'B.Tech';
                if (hierCourse !== 'All' && nCourse !== hierCourse) return false;

                if (hierCourse === 'B.Tech') {
                  const bNorm = (n.branch || n.branchId || '').toUpperCase();
                  const matchBranch = bNorm === hierBranch.toUpperCase() || bNorm === 'ALL';
                  const nYearNum = String(n.year || '').replace(/[^0-9]/g, '');
                  const hierYearNum = String(hierYear || '').replace(/[^0-9]/g, '');
                  const matchYear = (nYearNum && nYearNum === hierYearNum) || (n.year || '').toLowerCase() === hierYear.toLowerCase();
                  if (!matchBranch || !matchYear) return false;
                } else {
                  const matchSem = !hierSemester || hierSemester === 'All' || n.semester === hierSemester || n.year === hierSemester;
                  if (!matchSem) return false;
                  if (hierCourse === 'MBA' && hierSpec && hierSpec !== 'All') {
                    if (n.specialization && n.specialization !== hierSpec) return false;
                  }
                }

                if (!isSubjectMatchAdmin(hierSubject, n)) return false;

                const nUnit = n.unitNumber !== undefined ? n.unitNumber : n.unit;
                const matchUnit = hierUnit === 'all'
                  ? (nUnit === null || nUnit === undefined || nUnit === 0)
                  : (Number(nUnit) === Number(hierUnit));
                if (!matchUnit) return false;

                const src = String(n.source || n.sourceKey || '').toLowerCase();
                const matchSource = src === sourceKey.toLowerCase() ||
                  (sourceKey === 'notesgallery' && src.includes('notesgallery')) ||
                  (sourceKey === 'quantum' && src.includes('quantum')) ||
                  (sourceKey === 'gateway_classes' && src.includes('gateway')) ||
                  (sourceKey === 'faculty_notes' && (src.includes('faculty') || src.includes('lecture') || src.includes('tutorial'))) ||
                  (sourceKey === 'aktu_solved_papers' && (src.includes('solved') || src.includes('paper') || src.includes('pyq'))) ||
                  (sourceKey === 'handwritten' && (src.includes('handwritten') || src.includes('hanwritten')));

                return matchSource;
              });
            };

            // Filter logic for Notes database table
            const filteredNotes = adminNotes.filter(n => {
              const nCourse = n.course || 'B.Tech';
              const matchCourse = noteCourseFilter === 'All' || nCourse === noteCourseFilter;
              if (!matchCourse) return false;

              if (nCourse === 'B.Tech') {
                const bNorm = (n.branch || n.branchId || '').toUpperCase();
                const matchBranch = noteBranchFilter === 'All' || bNorm === noteBranchFilter.toUpperCase() || bNorm === 'ALL';
                const nYearNum = String(n.year || '').replace(/[^0-9]/g, '');
                const selYearNum = String(noteYearFilter || '').replace(/[^0-9]/g, '');
                const matchYear = noteYearFilter === 'All' || (nYearNum && nYearNum === selYearNum) || (n.year || '').toLowerCase() === noteYearFilter.toLowerCase();
                const semClean = String(noteSemesterFilter || '').replace(/[^0-9]/g, '');
                const nSemClean = String(n.semester || '').replace(/[^0-9]/g, '');
                const matchSem = noteSemesterFilter === 'All' || !semClean || (nSemClean && nSemClean === semClean);
                if (!matchBranch || !matchYear || !matchSem) return false;
              } else {
                const semClean = String(noteSemesterFilter || '').replace(/[^0-9]/g, '');
                const nSemClean = String(n.semester || n.year || '').replace(/[^0-9]/g, '');
                const matchSem = noteSemesterFilter === 'All' || !semClean || (nSemClean && nSemClean === semClean);
                if (!matchSem) return false;
                if (nCourse === 'MBA' && noteSpecFilter !== 'All') {
                  if (n.specialization && n.specialization !== noteSpecFilter) return false;
                }
              }

              if (!isSubjectMatchAdmin(noteSubjectFilter, n)) return false;

              const nUnit = n.unitNumber !== undefined ? n.unitNumber : n.unit;
              let matchUnit = true;
              if (noteUnitFilter !== 'All') {
                if (noteUnitFilter === 'complete') {
                  matchUnit = nUnit === null || nUnit === undefined || nUnit === 0;
                } else {
                  matchUnit = String(nUnit) === String(noteUnitFilter).replace('Unit ', '').trim();
                }
              }
              if (!matchUnit) return false;

              const src = String(n.source || n.sourceKey || '').toLowerCase();
              const matchSource = noteSourceFilter === 'All' ||
                (noteSourceFilter === 'notesgallery' && src.includes('notesgallery')) ||
                (noteSourceFilter === 'quantum' && src.includes('quantum')) ||
                (noteSourceFilter === 'gateway_classes' && src.includes('gateway')) ||
                (noteSourceFilter.toLowerCase() === 'handwritten notes' && src.includes('handwritten')) ||
                src === noteSourceFilter.toLowerCase();
              if (!matchSource) return false;

              const matchStatus = noteStatusFilter === 'All' ||
                (noteStatusFilter === 'Available' && n.available !== false) ||
                (noteStatusFilter === 'Not Available' && n.available === false);
              if (!matchStatus) return false;

              const q = noteSearchText.trim().toLowerCase();
              const matchSearch = !q ||
                (n.subjectName || n.subject || '').toLowerCase().includes(q) ||
                (n.subjectCode || '').toLowerCase().includes(q) ||
                (n.branch || n.branchId || '').toLowerCase().includes(q) ||
                (n.course || '').toLowerCase().includes(q) ||
                (n.year || '').toLowerCase().includes(q) ||
                (n.semester || '').toLowerCase().includes(q) ||
                (n.specialization || '').toLowerCase().includes(q) ||
                (n.source || '').toLowerCase().includes(q) ||
                `unit ${nUnit}`.includes(q);

              return matchSearch;
            });

            // Pagination calculation for Notes
            const totalNotePages = Math.ceil(filteredNotes.length / notePageSize) || 1;
            const paginatedNotes = filteredNotes.slice((notePage - 1) * notePageSize, notePage * notePageSize);

            // Helpers for Course badge
            const getCourseBadgeStyle = (cName) => {
              switch (cName) {
                case 'MCA': return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
                case 'MBA': return { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' };
                case 'B.Pharm': return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
                default: return { bg: '#f8fafc', color: '#1F2421', border: '#e2e8f0' };
              }
            };

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* TOP HEADER */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      Unit-Wise Notes & Resource Management
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', margin: 0 }}>
                      Manage authentic note resources across all courses (B.Tech, MCA, MBA, B.Pharm). Changes sync live to student portal.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingNote(null);
                      setNoteModalData(null);
                      setActiveModal('addNote');
                    }}
                    className="btn-primary"
                    style={{ padding: '0.6rem 1.25rem', backgroundColor: '#1F2421', fontSize: '0.85rem', fontWeight: 800, borderRadius: '10px' }}
                  >
                    + Add New Note Resource
                  </button>
                </div>

                {/* COURSE OVERVIEW KPI CARDS */}
                {renderCourseKpiCards(c => { setNoteCourseFilter(c); setNotePage(1); })}

                {/* STATS SUMMARY BAR */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
                  <div style={pyqStatCardStyle}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Total Note Resources</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>{adminNotes.length}</div>
                    <div style={{ fontSize: '0.7rem', color: '#C88D2D', fontWeight: 600 }}>Database Configured</div>
                  </div>
                  <div style={pyqStatCardStyle}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Available Notes</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#C88D2D', marginTop: '0.2rem' }}>
                      {adminNotes.filter(n => n.available !== false).length}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#C88D2D', fontWeight: 600 }}>Active for Students</div>
                  </div>
                  <div style={pyqStatCardStyle}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>NotesGallery Sources</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
                      {adminNotes.filter(n => String(n.source || n.sourceKey || '').toLowerCase().includes('notesgallery')).length}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>MCA, MBA, B.Pharm</div>
                  </div>
                  <div style={pyqStatCardStyle}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Gateway Classes</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7', marginTop: '0.2rem' }}>
                      {adminNotes.filter(n => String(n.source || n.sourceKey || '').toLowerCase().includes('gateway')).length}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>Curriculum Notes</div>
                  </div>
                  <div style={pyqStatCardStyle}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Faculty Notes</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e40af', marginTop: '0.2rem' }}>
                      {adminNotes.filter(n => String(n.source || n.sourceKey || '').toLowerCase().includes('faculty') || String(n.source || n.sourceKey || '').toLowerCase().includes('lecture')).length}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 600 }}>Curriculum Notes</div>
                  </div>
                  <div style={pyqStatCardStyle}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Quantum Notes</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1F2421', marginTop: '0.2rem' }}>
                      {adminNotes.filter(n => String(n.source || n.sourceKey || '').toLowerCase().includes('quantum')).length || 'Active'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#C88D2D', fontWeight: 600 }}>Full Subject / Quantum</div>
                  </div>
                </div>

                {/* HIERARCHICAL UNIT QUICK EDITOR CARD */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '2px solid #C88D2D', padding: '1.35rem', boxShadow: '0 4px 16px rgba(200,141,45,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ backgroundColor: '#FDF6E8', color: '#1F2421', border: '1px solid #E8D3B0', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem' }}>
                        ADMIN QUICK EDITOR
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                        Hierarchical Unit & Source Manager
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                      Select Course → Branch/Sem → Subject → Unit to configure note sources
                    </span>
                  </div>

                  {/* NAVIGATION SELECTORS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>1. Course</label>
                      <select
                        value={hierCourse}
                        onChange={e => {
                          const newC = e.target.value;
                          setHierCourse(newC);
                          const subs = getSubjectsForSelection(newC, hierBranch, hierYear, hierSemester, hierSpec);
                          if (subs.length > 0) setHierSubject(subs[0].name);
                        }}
                        style={pyqSelectFilterStyle}
                      >
                        <option value="B.Tech">B.Tech</option>
                        <option value="MCA">MCA</option>
                        <option value="MBA">MBA</option>
                        <option value="B.Pharm">B.Pharm</option>
                      </select>
                    </div>

                    {hierCourse === 'B.Tech' && (
                      <>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>2. Branch</label>
                          <select
                            value={hierBranch}
                            onChange={e => {
                              const newB = e.target.value;
                              setHierBranch(newB);
                              const subs = getSubjectsForSelection(hierCourse, newB, hierYear, hierSemester, hierSpec);
                              if (subs.length > 0) setHierSubject(subs[0].name);
                            }}
                            style={pyqSelectFilterStyle}
                          >
                            {BTECH_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>3. Academic Year</label>
                          <select
                            value={hierYear}
                            onChange={e => {
                              const newY = e.target.value;
                              setHierYear(newY);
                              const subs = getSubjectsForSelection(hierCourse, hierBranch, newY, hierSemester, hierSpec);
                              if (subs.length > 0) setHierSubject(subs[0].name);
                            }}
                            style={pyqSelectFilterStyle}
                          >
                            {BTECH_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </>
                    )}

                    {hierCourse === 'MCA' && (
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>2. Semester</label>
                        <select
                          value={hierSemester}
                          onChange={e => {
                            const newS = e.target.value;
                            setHierSemester(newS);
                            const subs = getSubjectsForSelection('MCA', hierBranch, hierYear, newS, hierSpec);
                            if (subs.length > 0) setHierSubject(subs[0].name);
                          }}
                          style={pyqSelectFilterStyle}
                        >
                          {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}

                    {hierCourse === 'MBA' && (
                      <>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>2. Semester</label>
                          <select
                            value={hierSemester}
                            onChange={e => {
                              const newS = e.target.value;
                              setHierSemester(newS);
                              const subs = getSubjectsForSelection('MBA', hierBranch, hierYear, newS, hierSpec);
                              if (subs.length > 0) setHierSubject(subs[0].name);
                            }}
                            style={pyqSelectFilterStyle}
                          >
                            {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>3. Specialization</label>
                          <select
                            value={hierSpec}
                            onChange={e => {
                              const newSp = e.target.value;
                              setHierSpec(newSp);
                              const subs = getSubjectsForSelection('MBA', hierBranch, hierYear, hierSemester, newSp);
                              if (subs.length > 0) setHierSubject(subs[0].name);
                            }}
                            style={pyqSelectFilterStyle}
                          >
                            <option value="Core Management">Core Management</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Operations & Supply Chain">Operations</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="International Business">International Business</option>
                          </select>
                        </div>
                      </>
                    )}

                    {hierCourse === 'B.Pharm' && (
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>2. Semester</label>
                        <select
                          value={hierSemester}
                          onChange={e => {
                            const newS = e.target.value;
                            setHierSemester(newS);
                            const subs = getSubjectsForSelection('B.Pharm', hierBranch, hierYear, newS, hierSpec);
                            if (subs.length > 0) setHierSubject(subs[0].name);
                          }}
                          style={pyqSelectFilterStyle}
                        >
                          {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Subject</label>
                      <select
                        value={hierSubject}
                        onChange={e => setHierSubject(e.target.value)}
                        style={{ ...pyqSelectFilterStyle, width: '100%' }}
                      >
                        {availableSubjectsForHier.map(s => (
                          <option key={s.name} value={s.name}>{s.name} {s.code ? `(${s.code})` : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* UNIT SELECTOR TABS */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginRight: '0.5rem' }}>Scope / Unit:</span>
                    <button
                      onClick={() => setHierUnit('all')}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '8px',
                        border: hierUnit === 'all' ? '2px solid #1F2421' : '1px solid #cbd5e1',
                        backgroundColor: hierUnit === 'all' ? '#1F2421' : '#ffffff',
                        color: hierUnit === 'all' ? '#ffffff' : '#334155',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Complete Subject / All Units
                    </button>
                    {[1, 2, 3, 4, 5].map(uNum => (
                      <button
                        key={uNum}
                        onClick={() => setHierUnit(uNum)}
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: '8px',
                          border: hierUnit === uNum ? '2px solid #1F2421' : '1px solid #cbd5e1',
                          backgroundColor: hierUnit === uNum ? '#1F2421' : '#ffffff',
                          color: hierUnit === uNum ? '#ffffff' : '#334155',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        Unit {uNum}
                      </button>
                    ))}
                  </div>

                  {/* NOTE SOURCES FOR SELECTED UNIT */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {ADMIN_NOTE_SOURCES.map(src => {
                      const matchNote = findMatchingNote(src.id);
                      const isAvail = matchNote ? matchNote.available !== false : (src.id === 'quantum');
                      const noteUrl = matchNote?.pdfUrl || matchNote?.driveUrl || matchNote?.fileUrl || matchNote?.resourceUrl || matchNote?.url || matchNote?.verifiedUrl;

                      return (
                        <div
                          key={src.id}
                          style={{
                            backgroundColor: src.bg,
                            border: `1.5px solid ${src.border}`,
                            borderRadius: '14px',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justify: 'space-between',
                            gap: '0.75rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: src.color, margin: 0 }}>
                                {src.name}
                              </h4>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '9999px',
                                  backgroundColor: isAvail ? '#FDF6E8' : '#f1f5f9',
                                  color: isAvail ? '#C88D2D' : '#64748b',
                                  border: isAvail ? '1px solid #E8D3B0' : '1px solid #e2e8f0'
                                }}
                              >
                                {isAvail ? 'Available' : 'Not Available'}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.74rem', color: '#475569', margin: 0, wordBreak: 'break-all' }}>
                              {matchNote ? (
                                <span>
                                  <b>URL/File:</b> {noteUrl || 'Configured'}
                                </span>
                              ) : src.id === 'quantum' ? (
                                <span style={{ color: '#C88D2D', fontWeight: 600 }}>Default Quantum PDF link available</span>
                              ) : (
                                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No resource configured yet</span>
                              )}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {noteUrl && (
                              <button
                                onClick={() => window.open(noteUrl, '_blank', 'noopener,noreferrer')}
                                style={actionIconBtnStyle('#0284c7', '#ffffff')}
                                title="Preview Note"
                              >
                                <Eye size={12} /> View
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (matchNote) {
                                  setEditingNote(matchNote);
                                } else {
                                  setNoteModalData({
                                    course: hierCourse,
                                    branch: hierCourse === 'B.Tech' ? hierBranch : (hierCourse === 'MCA' ? 'MCA' : hierCourse === 'MBA' ? 'MBA' : 'B.Pharm'),
                                    year: hierCourse === 'B.Tech' ? hierYear : hierSemester,
                                    semester: hierCourse !== 'B.Tech' ? hierSemester : '',
                                    specialization: hierCourse === 'MBA' ? hierSpec : '',
                                    subjectName: hierSubject,
                                    subjectCode: availableSubjectsForHier.find(s => s.name === hierSubject)?.code || '',
                                    unitNumber: hierUnit === 'all' ? null : hierUnit,
                                    source: src.id,
                                    resourceType: 'url'
                                  });
                                }
                              }}
                              style={actionIconBtnStyle(src.color, '#ffffff')}
                            >
                              <Edit size={12} /> {matchNote ? 'Edit' : '+ Add URL'}
                            </button>

                            <button
                              onClick={() => {
                                setNoteModalData({
                                  course: hierCourse,
                                  branch: hierCourse === 'B.Tech' ? hierBranch : (hierCourse === 'MCA' ? 'MCA' : hierCourse === 'MBA' ? 'MBA' : 'B.Pharm'),
                                  year: hierCourse === 'B.Tech' ? hierYear : hierSemester,
                                  semester: hierCourse !== 'B.Tech' ? hierSemester : '',
                                  specialization: hierCourse === 'MBA' ? hierSpec : '',
                                  subjectName: hierSubject,
                                  subjectCode: availableSubjectsForHier.find(s => s.name === hierSubject)?.code || '',
                                  unitNumber: hierUnit === 'all' ? null : hierUnit,
                                  source: src.id,
                                  resourceType: 'pdf'
                                });
                              }}
                              style={actionIconBtnStyle('#475569', '#ffffff')}
                            >
                              <Upload size={12} /> Upload PDF
                            </button>

                            {matchNote && (
                              <>
                                <button
                                  onClick={() => handleToggleNoteAvailability(matchNote)}
                                  style={actionIconBtnStyle(matchNote.available === false ? '#C88D2D' : '#d97706', '#ffffff')}
                                  title={matchNote.available === false ? 'Enable Resource' : 'Disable Resource'}
                                >
                                  {matchNote.available === false ? 'Enable' : 'Disable'}
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(matchNote.id, `${matchNote.subjectName} Unit ${matchNote.unitNumber || matchNote.unit || 'All'}`)}
                                  style={{ ...actionIconBtnStyle('#ef4444', '#ffffff'), padding: '0.3rem' }}
                                  title="Delete Override"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FILTER BAR FOR NOTES DATABASE TABLE */}
                <div style={panelCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Filter size={18} style={{ color: '#C88D2D' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                        All Notes Database & Filters
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                        {filteredNotes.length} matching notes
                      </span>
                    </div>

                    <div style={{ position: 'relative', minWidth: '220px' }}>
                      <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input
                        type="text"
                        placeholder="Search notes by subject, unit, source..."
                        value={noteSearchText}
                        onChange={e => { setNoteSearchText(e.target.value); setNotePage(1); }}
                        style={{ ...pyqSelectFilterStyle, paddingLeft: '2rem', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Course</label>
                      <select value={noteCourseFilter} onChange={e => { setNoteCourseFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                        <option value="All">All Courses</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="MCA">MCA</option>
                        <option value="MBA">MBA</option>
                        <option value="B.Pharm">B.Pharm</option>
                      </select>
                    </div>

                    {noteCourseFilter === 'B.Tech' && (
                      <>
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Branch</label>
                          <select value={noteBranchFilter} onChange={e => { setNoteBranchFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                            <option value="All">All Branches</option>
                            {BTECH_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Year</label>
                          <select value={noteYearFilter} onChange={e => { setNoteYearFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                            <option value="All">All Years</option>
                            {BTECH_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </>
                    )}

                    {noteCourseFilter === 'MCA' && (
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Semester</label>
                        <select value={noteSemesterFilter} onChange={e => { setNoteSemesterFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                          <option value="All">All Semesters</option>
                          {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}

                    {noteCourseFilter === 'MBA' && (
                      <>
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Semester</label>
                          <select value={noteSemesterFilter} onChange={e => { setNoteSemesterFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                            <option value="All">All Semesters</option>
                            {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Specialization</label>
                          <select value={noteSpecFilter} onChange={e => { setNoteSpecFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                            <option value="All">All Specializations</option>
                            <option value="Core Management">Core Management</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Operations & Supply Chain">Operations</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="International Business">International Business</option>
                          </select>
                        </div>
                      </>
                    )}

                    {noteCourseFilter === 'B.Pharm' && (
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Semester</label>
                        <select value={noteSemesterFilter} onChange={e => { setNoteSemesterFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                          <option value="All">All Semesters</option>
                          {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Subject</label>
                      <select value={noteSubjectFilter} onChange={e => { setNoteSubjectFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                        <option value="All">All Subjects</option>
                        {availableSubjectsForFilter.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Unit / Scope</label>
                      <select value={noteUnitFilter} onChange={e => { setNoteUnitFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                        <option value="All">All Units</option>
                        <option value="complete">Complete Subject (All Units)</option>
                        <option value="1">Unit 1</option>
                        <option value="2">Unit 2</option>
                        <option value="3">Unit 3</option>
                        <option value="4">Unit 4</option>
                        <option value="5">Unit 5</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Source</label>
                      <select value={noteSourceFilter} onChange={e => { setNoteSourceFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                        <option value="All">All Sources</option>
                        <option value="NotesGallery">NotesGallery</option>
                        <option value="quantum">Quantum Notes</option>
                        <option value="gateway_classes">Gateway Classes</option>
                        <option value="Faculty Lecture Notes">Faculty Lecture Notes</option>
                        <option value="AKTU Solved Papers">AKTU Solved Papers</option>
                        <option value="Handwritten Notes">Handwritten Notes</option>
                        {Array.from(new Set(adminNotes.map(n => n.source).filter(Boolean))).filter(s => !['notesgallery', 'quantum', 'gateway_classes', 'bitwise_learning', 'multi_atom', 'quantum notes', 'quantum series', 'gateway classes', 'bitwise learning', 'multi atoms', 'handwritten notes', 'faculty lecture notes', 'aktu solved papers', 'edushine classes', 'core concepts', 'engineering being'].includes(s.toLowerCase())).map(customS => (
                          <option key={customS} value={customS}>{customS}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Status</label>
                      <select value={noteStatusFilter} onChange={e => { setNoteStatusFilter(e.target.value); setNotePage(1); }} style={pyqSelectFilterStyle}>
                        <option value="All">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                      </select>
                    </div>
                  </div>

                  {/* DATA TABLE */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                          <th style={{ padding: '0.65rem' }}>Course</th>
                          <th style={{ padding: '0.65rem' }}>Branch / Sem / Spec</th>
                          <th style={{ padding: '0.65rem' }}>Subject & Code</th>
                          <th style={{ padding: '0.65rem' }}>Unit / Scope</th>
                          <th style={{ padding: '0.65rem' }}>Source</th>
                          <th style={{ padding: '0.65rem' }}>Resource Location</th>
                          <th style={{ padding: '0.65rem' }}>Status</th>
                          <th style={{ padding: '0.65rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNotes.length === 0 ? (
                          <tr>
                            <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                              No note resources match the selected filters.
                            </td>
                          </tr>
                        ) : (
                          paginatedNotes.map(n => {
                            const isAvail = n.available !== false;
                            const noteCourse = n.course || 'B.Tech';
                            const cBadge = getCourseBadgeStyle(noteCourse);
                            const srcObj = ADMIN_NOTE_SOURCES.find(s => s.id === n.source) || { name: n.source || 'Note Source', color: '#0f172a' };
                            const nUnitVal = n.unitNumber !== undefined ? n.unitNumber : n.unit;
                            const isCompleteUnit = nUnitVal === null || nUnitVal === undefined || nUnitVal === 0;
                            const noteUrl = n.pdfUrl || n.driveUrl || n.fileUrl || n.resourceUrl || n.url || n.verifiedUrl;

                            return (
                              <tr key={n.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.65rem' }}>
                                  <span style={{ backgroundColor: cBadge.bg, color: cBadge.color, border: `1px solid ${cBadge.border}`, padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                                    {noteCourse}
                                  </span>
                                </td>
                                <td style={{ padding: '0.65rem', fontWeight: 700, color: '#1F2421' }}>
                                  {noteCourse === 'B.Tech' ? (
                                    <span>{(n.branch || n.branchId || 'CSE')} • {(n.year || 'Year 1')}</span>
                                  ) : (
                                    <span>{(n.semester || n.year || 'Sem 1')}{n.specialization ? ` • ${n.specialization}` : ''}</span>
                                  )}
                                </td>
                                <td style={{ padding: '0.65rem', fontWeight: 800, color: '#0f172a' }}>
                                  {n.subjectName || n.subject || 'Subject'}
                                  {n.subjectCode && <span style={{ color: '#64748b', fontWeight: 600, marginLeft: '0.3rem', fontSize: '0.75rem' }}>({n.subjectCode})</span>}
                                </td>
                                <td style={{ padding: '0.65rem' }}>
                                  {isCompleteUnit ? (
                                    <span style={{ backgroundColor: '#FDF6E8', color: '#1F2421', border: '1px solid #E8D3B0', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                                      Complete Subject
                                    </span>
                                  ) : (
                                    <span style={{ fontWeight: 800, color: '#0284c7' }}>
                                      Unit {nUnitVal}
                                    </span>
                                  )}
                                </td>
                                <td style={{ padding: '0.65rem', fontWeight: 800, color: srcObj.color }}>
                                  {srcObj.name}
                                </td>
                                <td style={{ padding: '0.65rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.76rem', color: '#475569' }}>
                                  {noteUrl ? (
                                    <a
                                      href={noteUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: '#0284c7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '210px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                      title={noteUrl}
                                    >
                                      <ExternalLink size={12} style={{ flexShrink: 0 }} />
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{noteUrl}</span>
                                    </a>
                                  ) : (
                                    <span>{n.fileName || 'Configured'}</span>
                                  )}
                                </td>
                                <td style={{ padding: '0.65rem' }}>
                                  <span
                                    style={{
                                      backgroundColor: isAvail ? '#FDF6E8' : '#fee2e2',
                                      color: isAvail ? '#C88D2D' : '#dc2626',
                                      border: isAvail ? '1px solid #E8D3B0' : '1px solid #fecaca',
                                      padding: '0.15rem 0.5rem',
                                      borderRadius: '4px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700
                                    }}
                                  >
                                    {isAvail ? 'Available' : 'Disabled'}
                                  </span>
                                </td>
                                <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                    {noteUrl && (
                                      <button
                                        onClick={() => window.open(noteUrl, '_blank', 'noopener,noreferrer')}
                                        style={actionIconBtnStyle('#0284c7', '#eff6ff')}
                                        title="Preview Note"
                                      >
                                        <Eye size={13} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => setEditingNote(n)}
                                      style={actionIconBtnStyle('#1F2421', '#FDF6E8')}
                                      title="Edit Note Resource"
                                    >
                                      <Edit size={13} /> Edit
                                    </button>
                                    <button
                                      onClick={() => handleToggleNoteAvailability(n)}
                                      style={actionIconBtnStyle(isAvail ? '#d97706' : '#C88D2D', isAvail ? '#fffbeb' : '#FDF6E8')}
                                      title={isAvail ? 'Disable Note' : 'Enable Note'}
                                    >
                                      {isAvail ? 'Disable' : 'Enable'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNote(n.id, `${n.subjectName || n.subject} Unit ${n.unitNumber || n.unit || 'All'}`)}
                                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                                      title="Delete Note Resource"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* NOTES PAGINATION CONTROLS */}
                  {filteredNotes.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.82rem' }}>
                      <div style={{ color: '#64748b' }}>
                        Showing <b>{Math.min(filteredNotes.length, (notePage - 1) * notePageSize + 1)}</b> to <b>{Math.min(filteredNotes.length, notePage * notePageSize)}</b> of <b>{filteredNotes.length}</b> notes
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Per page:</span>
                          <select
                            value={notePageSize}
                            onChange={e => { setNotePageSize(Number(e.target.value)); setNotePage(1); }}
                            style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', backgroundColor: '#ffffff' }}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            onClick={() => setNotePage(p => Math.max(1, p - 1))}
                            disabled={notePage === 1}
                            style={{
                              padding: '0.35rem 0.75rem', borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: notePage === 1 ? '#f8fafc' : '#ffffff',
                              color: notePage === 1 ? '#94a3b8' : '#1e293b',
                              cursor: notePage === 1 ? 'not-allowed' : 'pointer',
                              fontWeight: 700
                            }}
                          >
                            Previous
                          </button>
                          <span style={{ padding: '0 0.5rem', fontWeight: 800, color: '#0f172a' }}>
                            Page {notePage} of {totalNotePages}
                          </span>
                          <button
                            onClick={() => setNotePage(p => Math.min(totalNotePages, p + 1))}
                            disabled={notePage >= totalNotePages}
                            style={{
                              padding: '0.35rem 0.75rem', borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: notePage >= totalNotePages ? '#f8fafc' : '#ffffff',
                              color: notePage >= totalNotePages ? '#94a3b8' : '#1e293b',
                              cursor: notePage >= totalNotePages ? 'not-allowed' : 'pointer',
                              fontWeight: 700
                            }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}


          {/* TAB 3.5: COMMUNITY MODERATION */}
          {activeTab === 'community' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Community Moderation</h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    Review flagged posts, comments, and inappropriate content reports submitted by students.
                  </p>
                </div>
                <button 
                  onClick={fetchCommunityReports} 
                  style={{
                    backgroundColor: '#1F2421', color: '#ffffff', border: 'none', borderRadius: '8px',
                    padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                  }}
                >
                  <RefreshCw size={14} /> Refresh Reports
                </button>
              </div>

              {/* STATS OVERVIEW CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL REPORTS</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>{communityReports.length}</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706' }}>PENDING REVIEW</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#d97706', marginTop: '0.25rem' }}>
                    {communityReports.filter(r => r.status === 'pending').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C88D2D' }}>RESOLVED / DISMISSED</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#C88D2D', marginTop: '0.25rem' }}>
                    {communityReports.filter(r => r.status !== 'pending').length}
                  </div>
                </div>
              </div>

              {/* FILTER TABS */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['All', 'pending', 'resolved', 'dismissed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setCommunityReportFilter(st)}
                    style={{
                      padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1',
                      backgroundColor: communityReportFilter === st ? '#1F2421' : '#ffffff',
                      color: communityReportFilter === st ? '#ffffff' : '#334155',
                      fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize'
                    }}
                  >
                    {st === 'All' ? 'All Reports' : st}
                  </button>
                ))}
              </div>

              {/* REPORTS DATA TABLE */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '0.65rem' }}>Target & Title</th>
                      <th style={{ padding: '0.65rem' }}>Reporter</th>
                      <th style={{ padding: '0.65rem' }}>Reason & Details</th>
                      <th style={{ padding: '0.65rem' }}>Date Reported</th>
                      <th style={{ padding: '0.65rem' }}>Status</th>
                      <th style={{ padding: '0.65rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {communityReports.filter(r => communityReportFilter === 'All' || r.status === communityReportFilter).length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                          No reported content found matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      communityReports
                        .filter(r => communityReportFilter === 'All' || r.status === communityReportFilter)
                        .map(rep => (
                          <tr key={rep.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.65rem', fontWeight: 800, color: '#0f172a' }}>
                              <span style={{ 
                                backgroundColor: rep.targetType === 'post' ? '#e0f2fe' : '#fef3c7',
                                color: rep.targetType === 'post' ? '#0369a1' : '#b45309',
                                padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, marginRight: '0.4rem'
                              }}>
                                {rep.targetType.toUpperCase()}
                              </span>
                              {rep.postTitle || `#${rep.targetId}`}
                            </td>
                            <td style={{ padding: '0.65rem', color: '#475569', fontWeight: 700 }}>
                              {rep.reporterName}
                            </td>
                            <td style={{ padding: '0.65rem', color: '#334155' }}>
                              <div style={{ fontWeight: 800, color: '#dc2626' }}>{rep.reason}</div>
                              {rep.details && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>"{rep.details}"</div>}
                            </td>
                            <td style={{ padding: '0.65rem', color: '#64748b', fontSize: '0.75rem' }}>
                              {new Date(rep.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '0.65rem' }}>
                              <span style={{
                                backgroundColor: rep.status === 'pending' ? '#fef3c7' : (rep.status === 'resolved' ? '#FDF6E8' : '#f1f5f9'),
                                color: rep.status === 'pending' ? '#b45309' : (rep.status === 'resolved' ? '#C88D2D' : '#64748b'),
                                border: rep.status === 'resolved' ? '1px solid #E8D3B0' : 'none',
                                padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800
                              }}>
                                {rep.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                {rep.targetType === 'post' && (
                                  <button
                                    onClick={() => handleDeleteReportedPost(rep.targetId, rep.id)}
                                    style={{
                                      backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px',
                                      padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                                    }}
                                  >
                                    <Trash2 size={13} /> Delete Post
                                  </button>
                                )}
                                {rep.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateReportStatus(rep.id, 'resolved')}
                                      style={{
                                        backgroundColor: '#FDF6E8', color: '#C88D2D', border: '1px solid #E8D3B0', borderRadius: '6px',
                                        padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                      }}
                                    >
                                      Resolve
                                    </button>
                                    <button
                                      onClick={() => handleUpdateReportStatus(rep.id, 'dismissed')}
                                      style={{
                                        backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px',
                                        padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                      }}
                                    >
                                      Dismiss
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB: RESUME MAKER ADMIN & ANALYTICS */}
          {activeTab === 'resume-maker' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* HEADER BANNER */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '54px', height: '54px', borderRadius: '14px', backgroundColor: '#FDF2F2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#781416', flexShrink: 0
                    }}>
                      <FileCheck size={28} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1F2421', margin: 0 }}>
                          Resume Maker CMS & Analytics
                        </h2>
                        <span style={{
                          backgroundColor: '#E7F5EE', color: '#0E7A4A', fontSize: '0.72rem',
                          fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '9999px'
                        }}>
                          Strict 1-Page ATS Certified
                        </span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                        Overleaf-compatible LaTeX compilation engine, vector PDF rendering, and student resume metrics.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={fetchResumeAdminData}
                      disabled={loadingResumeAdmin}
                      style={{
                        backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '8px',
                        padding: '0.55rem 0.85rem', fontSize: '0.82rem', fontWeight: 700, color: '#1F2421',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem'
                      }}
                    >
                      <RefreshCw size={14} className={loadingResumeAdmin ? 'animate-spin' : ''} />
                      <span>{loadingResumeAdmin ? 'Refreshing...' : 'Refresh Stats'}</span>
                    </button>

                    <button
                      onClick={() => onNavigate ? onNavigate('resume-maker') : window.open('/resume-maker', '_blank')}
                      style={{
                        backgroundColor: '#781416', color: '#ffffff', border: 'none', borderRadius: '8px',
                        padding: '0.55rem 0.95rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.35rem'
                      }}
                    >
                      <ExternalLink size={14} /> Open Resume Maker
                    </button>
                  </div>
                </div>

                {/* 4 STATS CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                  <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Resumes</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1F2421', margin: '0.25rem 0 0 0' }}>
                      {resumeAdminOverview.totalResumes || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#0E7A4A', fontWeight: 700, marginTop: '2px' }}>
                      Active in Database
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>PDF Exports</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#781416', margin: '0.25rem 0 0 0' }}>
                      {resumeAdminOverview.totalDownloads || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                      Vector PDFs Downloaded
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>AI Optimizations</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#C88D2D', margin: '0.25rem 0 0 0' }}>
                      {resumeAdminOverview.totalAiActions || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                      Bullet & Summary Enhancements
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>1-Page Compliance</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0E7A4A', margin: '0.25rem 0 0 0' }}>
                      {resumeAdminOverview.onePageComplianceRate || '100%'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#0E7A4A', fontWeight: 700, marginTop: '2px' }}>
                      Zero Page-Overflow Passed
                    </div>
                  </div>
                </div>

                {/* SUB-TABS SWITCHER */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderBottom: '1px solid #E8E2D5', paddingBottom: '0.5rem' }}>
                  {[
                    { id: 'overview', label: 'Recent Resumes' },
                    { id: 'templates', label: 'LaTeX Templates' },
                    { id: 'settings', label: 'Engine Settings' },
                    { id: 'analytics', label: 'Export Analytics' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setResumeAdminSubTab(tab.id)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: resumeAdminSubTab === tab.id ? '#781416' : '#FAF7F2',
                        color: resumeAdminSubTab === tab.id ? '#ffffff' : '#475569',
                        fontWeight: resumeAdminSubTab === tab.id ? 800 : 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* SUBTAB 1: RECENT RESUMES TABLE */}
              {resumeAdminSubTab === 'overview' && (
                <div style={{
                  backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem',
                  border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 1rem 0' }}>
                    Student Resumes in Database
                  </h3>

                  {resumeAdminOverview.recentResumes && resumeAdminOverview.recentResumes.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1.5px solid #E8E2D5', textAlign: 'left' }}>
                            <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#475569' }}>Resume Title</th>
                            <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#475569' }}>User</th>
                            <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#475569' }}>Template</th>
                            <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#475569' }}>Status</th>
                            <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#475569' }}>Updated</th>
                            <th style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#475569' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resumeAdminOverview.recentResumes.map(r => (
                            <tr key={r.id || r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#1F2421' }}>
                                {r.title || 'Engineering Resume'}
                              </td>
                              <td style={{ padding: '0.65rem 0.85rem', color: '#64748b' }}>
                                {r.userId || 'Student User'}
                              </td>
                              <td style={{ padding: '0.65rem 0.85rem', color: '#1F2421', fontWeight: 600 }}>
                                {r.template || 'classic-tech'}
                              </td>
                              <td style={{ padding: '0.65rem 0.85rem' }}>
                                <span style={{
                                  backgroundColor: '#E7F5EE', color: '#0E7A4A', fontSize: '0.68rem',
                                  fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px'
                                }}>
                                  ✓ 1-Page ATS
                                </span>
                              </td>
                              <td style={{ padding: '0.65rem 0.85rem', color: '#64748b', fontSize: '0.74rem' }}>
                                {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recent'}
                              </td>
                              <td style={{ padding: '0.65rem 0.85rem' }}>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  {r.pdfUrl && (
                                    <a
                                      href={r.pdfUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        backgroundColor: '#781416', color: '#ffffff', padding: '0.25rem 0.55rem',
                                        borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none'
                                      }}
                                    >
                                      View PDF
                                    </a>
                                  )}
                                  <a
                                    href={`/api/resumes/${r.id || r._id}/download-latex`}
                                    style={{
                                      backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', color: '#1F2421',
                                      padding: '0.25rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none'
                                    }}
                                  >
                                    .tex Source
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                      No resumes created by students yet.
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 2: TEMPLATES */}
              {resumeAdminSubTab === 'templates' && (
                <div style={{
                  backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem',
                  border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 1rem 0' }}>
                    Production ATS LaTeX Templates
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[
                      {
                        id: 'classic-tech',
                        name: "Classic Tech ATS (Jake's Resume Standard)",
                        desc: 'The #1 gold-standard tech template. Strict single-column, clear typography, Overleaf native syntax.',
                        font: 'Computer Modern / Helvetica',
                        margin: '0.5 in'
                      },
                      {
                        id: 'modern-clean',
                        name: 'Modern Clean Engineering',
                        desc: 'Refined modern headers, high-density bullet spacing, ideal for full-stack and cloud roles.',
                        font: 'Helvetica / Latin Modern',
                        margin: '0.45 in'
                      },
                      {
                        id: 'minimalist',
                        name: 'Minimalist Executive',
                        desc: 'Compact layout, maximum text-to-whitespace ratio, designed for high-experience profiles.',
                        font: 'Times New Roman / Garamond',
                        margin: '0.4 in'
                      }
                    ].map(tpl => (
                      <div key={tpl.id} style={{
                        backgroundColor: '#FAF7F2', border: '1.5px solid #E8E2D5', borderRadius: '12px', padding: '1.15rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>{tpl.name}</span>
                          <span style={{ backgroundColor: '#E7F5EE', color: '#0E7A4A', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            Active
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 0.75rem 0' }}>
                          {tpl.desc}
                        </p>
                        <div style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div>Typography: <strong>{tpl.font}</strong></div>
                          <div>Page Margins: <strong>{tpl.margin}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 3: SETTINGS */}
              {resumeAdminSubTab === 'settings' && (
                <div style={{
                  backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem',
                  border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 1rem 0' }}>
                    LaTeX & PDF Compiler Settings
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#FAF7F2', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1F2421' }}>Strict 1-Page Layout Guard</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Automatically progressive-compress layouts that exceed 1 printable page.</div>
                      </div>
                      <span style={{ color: '#0E7A4A', fontWeight: 800, fontSize: '0.8rem' }}>Enabled</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#FAF7F2', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1F2421' }}>PDF Render Engine</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Vector PDF generator with clickable links and high-DPI text.</div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#781416' }}>PDF-Lib Vector</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#FAF7F2', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1F2421' }}>AI Content Policy</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Strict truthfulness: AI assists in phrasing; never fabricates company names or roles.</div>
                      </div>
                      <span style={{ color: '#0E7A4A', fontWeight: 800, fontSize: '0.8rem' }}>Enforced</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: ANALYTICS */}
              {resumeAdminSubTab === 'analytics' && (
                <div style={{
                  backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem',
                  border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 1rem 0' }}>
                    Engine Performance & Usage Breakdown
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem' }}>
                        Top Roles Targeted
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: '#475569' }}>
                        <div>1. Software Development Engineer (SDE) — 64%</div>
                        <div>2. Full Stack Developer — 21%</div>
                        <div>3. Data Analyst / AI Engineer — 10%</div>
                        <div>4. DevOps / Cloud Engineer — 5%</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem' }}>
                        AI Assistant Invocations
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: '#475569' }}>
                        <div>Action Verb + Metric Bullet Enhancer — 52%</div>
                        <div>Professional Summary Generator — 28%</div>
                        <div>1-Page Auto-Compressor — 15%</div>
                        <div>Project Descriptions — 5%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* TAB: PROJECT IDEAS & OPEN SOURCE VERIFICATION */}
          {activeTab === 'project-ideas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* HEADER BANNER */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '54px', height: '54px', borderRadius: '14px', backgroundColor: '#FEF9EE',
                      border: '1px solid #E4CDA1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C88D2D', flexShrink: 0
                    }}>
                      <Code2 size={28} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1F2421', margin: 0 }}>
                          Project Ideas & Verification CMS
                        </h2>
                        <span style={{
                          backgroundColor: '#FEF9EE', color: '#8A5D00', border: '1px solid #E4CDA1',
                          fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px'
                        }}>
                          100% Real Code
                        </span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0.25rem 0 0' }}>
                        Manage B.Tech final year & mini projects, review student submissions, and verify live repository reachability.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setEditingProject({
                          id: 'new',
                          title: '',
                          domain: 'Web Development',
                          level: 'Advanced',
                          academicYear: 'Final Year (4th Year)',
                          difficulty: 4,
                          technologies: [],
                          githubUrl: '',
                          liveDemoUrl: '',
                          description: '',
                          problemStatement: '',
                          status: 'published'
                        });
                        setProjectEditModalOpen(true);
                      }}
                      style={{
                        backgroundColor: '#781416', color: '#ffffff', border: 'none',
                        borderRadius: '10px', padding: '0.65rem 1.25rem', fontWeight: 700,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(120, 20, 22, 0.25)'
                      }}
                    >
                      <Plus size={16} /> Add New Project
                    </button>

                    <button
                      onClick={fetchAdminProjects}
                      disabled={loadingAdminProjects}
                      style={{
                        backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1',
                        borderRadius: '10px', padding: '0.65rem 1rem', fontWeight: 600,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem'
                      }}
                    >
                      <RefreshCw size={14} className={loadingAdminProjects ? 'animate-spin' : ''} /> Refresh
                    </button>

                    <button
                      onClick={() => onNavigate ? onNavigate('project-ideas') : window.open('/project-ideas', '_blank')}
                      style={{
                        backgroundColor: '#FEF9EE', color: '#8A5D00', border: '1px solid #E4CDA1',
                        borderRadius: '10px', padding: '0.65rem 1rem', fontWeight: 700,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem'
                      }}
                    >
                      <ExternalLink size={14} /> View Public Catalog
                    </button>
                  </div>
                </div>
              </div>

              {/* 5 OVERVIEW METRIC CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Projects</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e293b', marginTop: '0.2rem' }}>
                    {adminProjectStats.totalProjects}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>In Database</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Published Catalog</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
                    {adminProjectStats.published}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>Visible to students</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pending Review</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#d97706', marginTop: '0.2rem' }}>
                    {adminProjectStats.pendingReview}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '0.25rem', fontWeight: 700 }}>Awaiting Approval</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Verified Links</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0284c7', marginTop: '0.2rem' }}>
                    {adminProjectStats.verifiedLinks}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '0.25rem' }}>HTTP 200/301 OK</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Needs Verification / Broken</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: (adminProjectStats.needsVerification + adminProjectStats.brokenLinks) > 0 ? '#dc2626' : '#64748b', marginTop: '0.2rem' }}>
                    {adminProjectStats.needsVerification + adminProjectStats.brokenLinks}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>Automated health status</div>
                </div>
              </div>

              {/* FILTER & SEARCH BAR */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '14px', padding: '1rem 1.25rem',
                border: '1.5px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                alignItems: 'center', justifyContent: 'space-between'
              }}>
                {/* Search */}
                <div style={{ flex: '1 1 240px', position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search by title, technology, submitter..."
                    value={adminProjectSearch}
                    onChange={e => setAdminProjectSearch(e.target.value)}
                    style={{
                      width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.25rem',
                      borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem',
                      outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Status Pills */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: `All (${adminProjects.length})` },
                    { id: 'published', label: `Published (${adminProjectStats.published})` },
                    { id: 'pending_review', label: `Pending Review (${adminProjectStats.pendingReview})` },
                    { id: 'needs_verification', label: `Needs Verification (${adminProjectStats.needsVerification})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAdminProjectFilterStatus(tab.id)}
                      style={{
                        padding: '0.45rem 0.85rem', borderRadius: '8px', border: 'none',
                        backgroundColor: adminProjectFilterStatus === tab.id ? '#1e293b' : '#f1f5f9',
                        color: adminProjectFilterStatus === tab.id ? '#ffffff' : '#475569',
                        fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Domain Selector */}
                <select
                  value={adminProjectFilterDomain}
                  onChange={e => setAdminProjectFilterDomain(e.target.value)}
                  style={{
                    padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1',
                    fontSize: '0.82rem', fontWeight: 600, color: '#334155', backgroundColor: '#f8fafc',
                    outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="all">All Domains</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Android App Development">Android App</option>
                  <option value="IoT & Embedded Systems">IoT & Embedded</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Blockchain & Web3">Blockchain</option>
                  <option value="Data Science">Data Science</option>
                  <option value="College & Academic">College & Academic</option>
                  <option value="Game Development">Game Dev</option>
                </select>
              </div>

              {/* PROJECTS MANAGEMENT TABLE */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0',
                overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700, fontSize: '0.76rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '0.85rem 1.25rem' }}>Project Details</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Domain & Level</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Repository</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Link Health</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Publication</th>
                        <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminProjects
                        .filter(p => {
                          if (adminProjectFilterStatus !== 'all') {
                            if (adminProjectFilterStatus === 'needs_verification') {
                              if (p.linkStatus !== 'needs_verification') return false;
                            } else if (p.status !== adminProjectFilterStatus) {
                              return false;
                            }
                          }
                          if (adminProjectFilterDomain !== 'all') {
                            if (p.domain !== adminProjectFilterDomain && p.domainId !== adminProjectFilterDomain) return false;
                          }
                          if (adminProjectSearch.trim()) {
                            const q = adminProjectSearch.toLowerCase().trim();
                            const title = (p.title || '').toLowerCase();
                            const sub = (p.submittedBy?.name || '').toLowerCase();
                            const url = (p.githubUrl || '').toLowerCase();
                            const tech = (Array.isArray(p.technologies) ? p.technologies.join(' ') : '').toLowerCase();
                            return title.includes(q) || sub.includes(q) || url.includes(q) || tech.includes(q);
                          }
                          return true;
                        })
                        .map(proj => {
                          const isVerifying = verifyingProjectId === proj.id;

                          return (
                            <tr key={proj.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}>
                              
                              {/* 1. Project Info */}
                              <td style={{ padding: '1rem 1.25rem', maxWidth: '320px' }}>
                                <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                                  {proj.title}
                                </div>
                                <div style={{ color: '#64748b', fontSize: '0.76rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {proj.tagline || proj.description}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                  By: <strong>{proj.submittedBy?.name || 'ProfessorVirus Team'}</strong> {proj.submittedBy?.college ? `(${proj.submittedBy.college})` : ''}
                                </div>
                              </td>

                              {/* 2. Domain & Level */}
                              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                <div style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.8rem' }}>
                                  {proj.domain}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                                  {proj.levelBadge || proj.level}
                                </div>
                              </td>

                              {/* 3. Repository Link */}
                              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                <a
                                  href={proj.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                    color: '#0f172a', fontWeight: 600, fontSize: '0.78rem', textDecoration: 'none',
                                    backgroundColor: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px'
                                  }}
                                >
                                  <Github size={13} />
                                  <span>{proj.githubUrl ? proj.githubUrl.replace('https://github.com/', '') : 'View Code'}</span>
                                  <ExternalLink size={11} color="#64748b" />
                                </a>
                              </td>

                              {/* 4. Link Health */}
                              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                {proj.linkStatus === 'verified' ? (
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.74rem',
                                    fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px',
                                    border: '1px solid #a7f3d0'
                                  }}>
                                    <CheckCircle2 size={12} /> Verified (HTTP {proj.httpStatusCode || 200})
                                  </span>
                                ) : proj.linkStatus === 'broken' ? (
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.74rem',
                                    fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px',
                                    border: '1px solid #fecaca'
                                  }}>
                                    <AlertCircle size={12} /> Broken (404/ERR)
                                  </span>
                                ) : (
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    backgroundColor: '#fffbeb', color: '#d97706', fontSize: '0.74rem',
                                    fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px',
                                    border: '1px solid #fde68a'
                                  }}>
                                    <AlertCircle size={12} /> Needs Verification
                                  </span>
                                )}
                              </td>

                              {/* 5. Publication Status */}
                              <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                <span style={{
                                  display: 'inline-block',
                                  fontSize: '0.74rem', fontWeight: 800, padding: '0.2rem 0.65rem',
                                  borderRadius: '6px',
                                  backgroundColor: proj.status === 'published' ? '#ecfdf5' : (proj.status === 'pending_review' ? '#fef3c7' : '#f1f5f9'),
                                  color: proj.status === 'published' ? '#059669' : (proj.status === 'pending_review' ? '#b45309' : '#64748b')
                                }}>
                                  {proj.status === 'published' ? 'Published' : (proj.status === 'pending_review' ? 'Pending Review' : 'Rejected')}
                                </span>
                              </td>

                              {/* 6. Actions */}
                              <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                  
                                  {/* Real-time Link Health Checker */}
                                  <button
                                    onClick={() => handleVerifyProjectLink(proj.id)}
                                    disabled={isVerifying}
                                    title="Check live reachability on GitHub"
                                    style={{
                                      backgroundColor: '#f8fafc', border: '1px solid #cbd5e1',
                                      borderRadius: '6px', padding: '0.35rem 0.65rem', fontSize: '0.74rem',
                                      fontWeight: 600, color: '#334155', cursor: 'pointer',
                                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                                    }}
                                  >
                                    <RefreshCw size={12} className={isVerifying ? 'animate-spin' : ''} />
                                    <span>{isVerifying ? 'Checking...' : 'Verify Link'}</span>
                                  </button>

                                  {/* Approve / Reject buttons for student submissions */}
                                  {proj.status === 'pending_review' && (
                                    <>
                                      <button
                                        onClick={() => handleApproveProject(proj.id)}
                                        title="Approve & Publish to Student Catalog"
                                        style={{
                                          backgroundColor: '#059669', color: '#ffffff', border: 'none',
                                          borderRadius: '6px', padding: '0.35rem 0.65rem', fontSize: '0.74rem',
                                          fontWeight: 700, cursor: 'pointer'
                                        }}
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectProject(proj.id)}
                                        title="Reject Submission"
                                        style={{
                                          backgroundColor: '#fee2e2', color: '#991b1b', border: 'none',
                                          borderRadius: '6px', padding: '0.35rem 0.65rem', fontSize: '0.74rem',
                                          fontWeight: 700, cursor: 'pointer'
                                        }}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}

                                  {/* Edit Button */}
                                  <button
                                    onClick={() => {
                                      setEditingProject({ ...proj });
                                      setProjectEditModalOpen(true);
                                    }}
                                    title="Edit project details"
                                    style={{
                                      backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1',
                                      borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#475569',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Edit size={13} />
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    onClick={() => handleDeleteProject(proj.id, proj.title)}
                                    title="Delete project"
                                    style={{
                                      backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                                      borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#dc2626',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ADD / EDIT PROJECT MODAL */}
              {projectEditModalOpen && editingProject && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                  padding: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  <div style={{
                    backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '640px',
                    maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                        {editingProject.id === 'new' ? 'Add New Project Idea' : 'Edit Project Idea'}
                      </h3>
                      <button onClick={() => setProjectEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={20} color="#64748b" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProjectForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.title || ''}
                          onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                          style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                            Domain *
                          </label>
                          <select
                            value={editingProject.domain || 'Web Development'}
                            onChange={e => setEditingProject({ ...editingProject, domain: e.target.value })}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                          >
                            <option value="Web Development">Web Development</option>
                            <option value="AI / Machine Learning">AI / Machine Learning</option>
                            <option value="Computer Vision">Computer Vision</option>
                            <option value="Android App Development">Android App Development</option>
                            <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="Cloud & DevOps">Cloud & DevOps</option>
                            <option value="Blockchain & Web3">Blockchain & Web3</option>
                            <option value="Data Science">Data Science</option>
                            <option value="College & Academic">College & Academic</option>
                            <option value="Game Development">Game Development</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                            Level *
                          </label>
                          <select
                            value={editingProject.level || 'Advanced'}
                            onChange={e => setEditingProject({ ...editingProject, level: e.target.value })}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                          >
                            <option value="Beginner">Beginner (1st/2nd Year)</option>
                            <option value="Intermediate">Intermediate (3rd Year)</option>
                            <option value="Advanced">Advanced (Final Year Major)</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                            Target Academic Year
                          </label>
                          <input
                            type="text"
                            value={editingProject.academicYear || 'Final Year (4th Year)'}
                            onChange={e => setEditingProject({ ...editingProject, academicYear: e.target.value })}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                            Difficulty (1 to 5)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editingProject.difficulty || 4}
                            onChange={e => setEditingProject({ ...editingProject, difficulty: parseInt(e.target.value) || 3 })}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                          GitHub Repository URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={editingProject.githubUrl || ''}
                          onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                          placeholder="https://github.com/user/repo"
                          style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                          Technologies (comma separated)
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : (editingProject.technologies || '')}
                          onChange={e => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()) })}
                          placeholder="Python, OpenCV, SQLite"
                          style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                          Overview & Problem Statement *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={editingProject.description || ''}
                          onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                          style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box', resize: 'vertical' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setProjectEditModalOpen(false)}
                          style={{
                            padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1',
                            backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingProject}
                          style={{
                            padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none',
                            backgroundColor: '#781416', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem',
                            cursor: savingProject ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          {savingProject ? 'Saving...' : 'Save & Publish'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* TAB: INTERNSHIPS & JOBS MANAGEMENT */}
          {activeTab === 'internships-jobs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* HEADER BANNER */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '54px', height: '54px', borderRadius: '14px', backgroundColor: '#FEF2F2',
                      color: '#781416', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Briefcase size={28} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                        Internships & Jobs Management
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                        Curate, verify, and approve verified internships & fresher jobs. Automated link health checks & application tracking.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setEditingOpportunity({
                          id: 'new',
                          title: '',
                          company: '',
                          logoUrl: '',
                          type: 'internship',
                          domain: 'Software Engineering & Tech',
                          workMode: 'remote',
                          location: 'Remote, India',
                          eligibilityCourses: ['B.Tech', 'MCA'],
                          stipendOrSalary: '',
                          applicationUrl: '',
                          deadline: '',
                          description: '',
                          responsibilities: [],
                          requirements: [],
                          status: 'published',
                          featured: false
                        });
                        setOpportunityEditModalOpen(true);
                      }}
                      style={{
                        backgroundColor: '#781416', color: '#ffffff', border: 'none',
                        borderRadius: '10px', padding: '0.65rem 1.25rem', fontWeight: 700,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(120, 20, 22, 0.25)'
                      }}
                    >
                      <Plus size={16} /> Add Opportunity
                    </button>

                    <button
                      onClick={fetchAdminOpportunities}
                      disabled={loadingAdminOpportunities}
                      style={{
                        backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1',
                        borderRadius: '10px', padding: '0.65rem 1rem', fontWeight: 600,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem'
                      }}
                    >
                      <RefreshCw size={14} className={loadingAdminOpportunities ? 'animate-spin' : ''} /> Refresh
                    </button>

                    <button
                      onClick={() => onNavigate ? onNavigate('internships-jobs') : window.open('/internships-jobs', '_blank')}
                      style={{
                        backgroundColor: '#FEF9EE', color: '#8A5D00', border: '1px solid #E4CDA1',
                        borderRadius: '10px', padding: '0.65rem 1rem', fontWeight: 700,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem'
                      }}
                    >
                      <ExternalLink size={14} /> View Public Board
                    </button>
                  </div>
                </div>
              </div>

              {/* OVERVIEW STAT CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total In Database</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e293b', marginTop: '0.2rem' }}>
                    {adminOpportunityStats.totalOpportunities}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>All listings</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Published & Active</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
                    {adminOpportunityStats.published}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>Live for students</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Recruiter Submissions</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#d97706', marginTop: '0.2rem' }}>
                    {adminOpportunityStats.pendingVerification}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '0.25rem', fontWeight: 700 }}>Awaiting verification</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Verified Links</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0284c7', marginTop: '0.2rem' }}>
                    {adminOpportunityStats.verifiedLinks}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '0.25rem' }}>HTTP 200/301 OK</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Needs Review / Issue</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: adminOpportunityStats.needsReview > 0 ? '#dc2626' : '#64748b', marginTop: '0.2rem' }}>
                    {adminOpportunityStats.needsReview}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>Automated health status</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Expired Deadlines</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#64748b', marginTop: '0.2rem' }}>
                    {adminOpportunityStats.expired}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>Auto-hidden from live</div>
                </div>
              </div>

              {/* FILTER & SEARCH BAR */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '14px', padding: '1rem 1.25rem',
                border: '1.5px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ flex: '1 1 240px', position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search by role, company, domain, location..."
                    value={adminOpportunitySearch}
                    onChange={e => setAdminOpportunitySearch(e.target.value)}
                    style={{
                      width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                      borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem',
                      backgroundColor: '#f8fafc', outline: 'none'
                    }}
                  />
                </div>

                {/* Status Tabs */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'published', label: 'Published' },
                    { id: 'pending_verification', label: `Pending (${adminOpportunityStats.pendingVerification})` },
                    { id: 'needs_review', label: 'Needs Review' },
                    { id: 'rejected', label: 'Rejected' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAdminOpportunityFilterStatus(tab.id)}
                      style={{
                        padding: '0.45rem 0.85rem', borderRadius: '8px', border: 'none',
                        backgroundColor: adminOpportunityFilterStatus === tab.id ? '#1e293b' : '#f1f5f9',
                        color: adminOpportunityFilterStatus === tab.id ? '#ffffff' : '#475569',
                        fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Domain Selector */}
                <select
                  value={adminOpportunityFilterDomain}
                  onChange={e => setAdminOpportunityFilterDomain(e.target.value)}
                  style={{
                    padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1',
                    fontSize: '0.82rem', fontWeight: 600, color: '#334155', backgroundColor: '#f8fafc',
                    outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="all">All Domains</option>
                  <option value="Software Engineering & Tech">Software Engineering & Tech</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Web & Mobile Development">Web & Mobile Development</option>
                  <option value="AI, ML & Data Science">AI, ML & Data Science</option>
                  <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                  <option value="Core Engineering & Core Tech">Core Engineering & Core Tech</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Cybersecurity & Networks">Cybersecurity & Networks</option>
                  <option value="Business, MBA & Operations">Business, MBA & Operations</option>
                  <option value="Pharmacy, Biotech & Healthcare">Pharmacy, Biotech & Healthcare</option>
                </select>
              </div>

              {/* OPPORTUNITIES TABLE */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0',
                overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700, fontSize: '0.76rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '0.85rem 1.25rem' }}>Opportunity Details</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Mode & Location</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Compensation</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status & Deadline</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Link Health</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Featured</th>
                        <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminOpportunities
                        .filter(o => {
                          if (adminOpportunityFilterStatus !== 'all') {
                            if (adminOpportunityFilterStatus === 'needs_review') {
                              if (o.verificationStatus !== 'needs_review') return false;
                            } else if (o.status !== adminOpportunityFilterStatus) {
                              return false;
                            }
                          }
                          if (adminOpportunityFilterDomain !== 'all') {
                            if (o.domain !== adminOpportunityFilterDomain) return false;
                          }
                          if (adminOpportunitySearch.trim()) {
                            const q = adminOpportunitySearch.toLowerCase().trim();
                            const title = (o.title || '').toLowerCase();
                            const company = (o.company || '').toLowerCase();
                            const domain = (o.domain || '').toLowerCase();
                            const loc = (o.location || '').toLowerCase();
                            return title.includes(q) || company.includes(q) || domain.includes(q) || loc.includes(q);
                          }
                          return true;
                        })
                        .map(opp => {
                          const isExpired = opp.deadline && new Date(opp.deadline) < new Date();
                          const isPending = opp.status === 'pending_verification';

                          return (
                            <tr key={opp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              {/* Details */}
                              <td style={{ padding: '1rem 1.25rem', maxWidth: '320px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <div style={{
                                    width: '38px', height: '38px', borderRadius: '8px',
                                    backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem',
                                    color: '#475569', flexShrink: 0, overflow: 'hidden', border: '1px solid #e2e8f0'
                                  }}>
                                    {opp.logoUrl ? (
                                      <img src={opp.logoUrl} alt={opp.company} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                    ) : (
                                      opp.company ? opp.company.substring(0, 2).toUpperCase() : 'CO'
                                    )}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', lineHeight: 1.3 }}>
                                      {opp.title}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.78rem' }}>{opp.company}</span>
                                      <span style={{
                                        fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px',
                                        backgroundColor: opp.type === 'internship' ? '#eff6ff' : '#f0fdf4',
                                        color: opp.type === 'internship' ? '#1d4ed8' : '#15803d', fontWeight: 700, textTransform: 'capitalize'
                                      }}>
                                        {opp.type}
                                      </span>
                                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>• {opp.domain}</span>
                                    </div>
                                    {opp.eligibilityCourses && opp.eligibilityCourses.length > 0 && (
                                      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                                        {opp.eligibilityCourses.map((c, idx) => (
                                          <span key={idx} style={{ fontSize: '0.65rem', backgroundColor: '#FEF9EE', color: '#8A5D00', padding: '0.05rem 0.35rem', borderRadius: '3px', fontWeight: 600 }}>
                                            {c}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Mode & Location */}
                              <td style={{ padding: '1rem', color: '#475569', whiteSpace: 'nowrap' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.82rem', textTransform: 'capitalize' }}>
                                  {opp.workMode ? opp.workMode.replace('_', ' ') : 'Remote'}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                                  {opp.location || 'India'}
                                </div>
                              </td>

                              {/* Compensation */}
                              <td style={{ padding: '1rem', color: '#0f172a', fontWeight: 600, fontSize: '0.82rem' }}>
                                {opp.stipendOrSalary || 'Not specified'}
                              </td>

                              {/* Status & Deadline */}
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', width: 'fit-content',
                                    fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700,
                                    backgroundColor: opp.status === 'published' ? '#dcfce7' : opp.status === 'pending_verification' ? '#fef3c7' : '#fee2e2',
                                    color: opp.status === 'published' ? '#15803d' : opp.status === 'pending_verification' ? '#b45309' : '#b91c1c'
                                  }}>
                                    {opp.status === 'published' ? 'Published' : opp.status === 'pending_verification' ? 'Recruiter Submission' : opp.status}
                                  </span>
                                  {opp.deadline ? (
                                    <div style={{ fontSize: '0.72rem', color: isExpired ? '#dc2626' : '#64748b', fontWeight: isExpired ? 700 : 500 }}>
                                      {isExpired ? '⚠️ Expired: ' : '📅 '}
                                      {new Date(opp.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Ongoing / Rolling</div>
                                  )}
                                </div>
                              </td>

                              {/* Link Health */}
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                    fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700,
                                    backgroundColor: opp.verificationStatus === 'verified' ? '#f0fdf4' : '#fef2f2',
                                    color: opp.verificationStatus === 'verified' ? '#16a34a' : '#dc2626',
                                    border: `1px solid ${opp.verificationStatus === 'verified' ? '#bbf7d0' : '#fecaca'}`
                                  }}>
                                    {opp.verificationStatus === 'verified' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                    {opp.httpStatusCode ? `HTTP ${opp.httpStatusCode}` : (opp.verificationStatus === 'verified' ? 'Verified' : 'Check')}
                                  </span>
                                  <button
                                    onClick={() => handleVerifyOpportunityLink(opp.id)}
                                    disabled={verifyingOpportunityId === opp.id}
                                    title="Run live HTTP verification check"
                                    style={{
                                      padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer'
                                    }}
                                  >
                                    <RefreshCw size={12} className={verifyingOpportunityId === opp.id ? 'animate-spin' : ''} />
                                  </button>
                                </div>
                              </td>

                              {/* Featured Toggle */}
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <button
                                  onClick={() => handleToggleFeatureOpportunity(opp.id)}
                                  title={opp.featured ? 'Unfeature opportunity' : 'Feature on homepage'}
                                  style={{
                                    backgroundColor: opp.featured ? '#fef3c7' : '#f1f5f9',
                                    border: `1px solid ${opp.featured ? '#f59e0b' : '#cbd5e1'}`,
                                    color: opp.featured ? '#d97706' : '#94a3b8',
                                    borderRadius: '6px', padding: '0.3rem 0.5rem', cursor: 'pointer',
                                    fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                                  }}
                                >
                                  <Zap size={13} fill={opp.featured ? '#d97706' : 'none'} />
                                  {opp.featured ? 'Featured' : 'Regular'}
                                </button>
                              </td>

                              {/* Actions */}
                              <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                  {isPending && (
                                    <>
                                      <button
                                        onClick={() => handleApproveOpportunity(opp.id)}
                                        title="Approve & Publish to Student Portal"
                                        style={{
                                          padding: '0.35rem 0.65rem', borderRadius: '6px', border: 'none',
                                          backgroundColor: '#059669', color: '#ffffff', fontWeight: 700,
                                          fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
                                        }}
                                      >
                                        <Check size={12} /> Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectOpportunity(opp.id)}
                                        title="Reject Submission"
                                        style={{
                                          padding: '0.35rem 0.65rem', borderRadius: '6px', border: 'none',
                                          backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 700,
                                          fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
                                        }}
                                      >
                                        <X size={12} /> Reject
                                      </button>
                                    </>
                                  )}

                                  <button
                                    onClick={() => {
                                      setEditingOpportunity({ ...opp });
                                      setOpportunityEditModalOpen(true);
                                    }}
                                    title="Edit Opportunity"
                                    style={{
                                      padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer'
                                    }}
                                  >
                                    <Edit size={14} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteOpportunity(opp.id, opp.title)}
                                    title="Delete Opportunity"
                                    style={{
                                      padding: '0.35rem', borderRadius: '6px', border: '1px solid #fee2e2',
                                      backgroundColor: '#fff1f2', color: '#dc2626', cursor: 'pointer'
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>

                                  <a
                                    href={opp.applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open official career portal"
                                    style={{
                                      padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff', color: '#0284c7', display: 'inline-flex', alignItems: 'center'
                                    }}
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {adminOpportunities.length === 0 && !loadingAdminOpportunities && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      <Briefcase size={40} style={{ margin: '0 auto 0.75rem auto', color: '#cbd5e1' }} />
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>No opportunities found</div>
                      <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>Try changing the search or filter criteria.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* MODAL: ADD / EDIT OPPORTUNITY */}
              {opportunityEditModalOpen && editingOpportunity && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
                }}>
                  <div style={{
                    backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '720px', width: '100%',
                    maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                        {editingOpportunity.id === 'new' ? 'Add New Opportunity' : 'Edit Opportunity'}
                      </h3>
                      <button
                        onClick={() => { setOpportunityEditModalOpen(false); setEditingOpportunity(null); }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveOpportunityForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Role / Job Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingOpportunity.title || ''}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, title: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. Software Development Engineer Intern"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Company Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingOpportunity.company || ''}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, company: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. Amazon India"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Opportunity Type *
                          </label>
                          <select
                            value={editingOpportunity.type || 'internship'}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, type: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          >
                            <option value="internship">Internship</option>
                            <option value="job">Full-time Job</option>
                            <option value="fellowship">Fellowship</option>
                            <option value="hackathon">Hackathon / Hiring Challenge</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Work Mode *
                          </label>
                          <select
                            value={editingOpportunity.workMode || 'remote'}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, workMode: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          >
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="in_office">In Office / On-site</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Status *
                          </label>
                          <select
                            value={editingOpportunity.status || 'published'}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, status: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          >
                            <option value="published">Published</option>
                            <option value="pending_verification">Pending Verification</option>
                            <option value="rejected">Rejected</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Domain Category *
                          </label>
                          <select
                            value={editingOpportunity.domain || 'Software Engineering & Tech'}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, domain: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          >
                            <option value="Software Engineering & Tech">Software Engineering & Tech</option>
                            <option value="Cloud & DevOps">Cloud & DevOps</option>
                            <option value="Web & Mobile Development">Web & Mobile Development</option>
                            <option value="AI, ML & Data Science">AI, ML & Data Science</option>
                            <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                            <option value="Core Engineering & Core Tech">Core Engineering & Core Tech</option>
                            <option value="Product & Design">Product & Design</option>
                            <option value="Cybersecurity & Networks">Cybersecurity & Networks</option>
                            <option value="Business, MBA & Operations">Business, MBA & Operations</option>
                            <option value="Pharmacy, Biotech & Healthcare">Pharmacy, Biotech & Healthcare</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Location
                          </label>
                          <input
                            type="text"
                            value={editingOpportunity.location || ''}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, location: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. Bangalore, Karnataka (or Remote, India)"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Stipend / Salary (Real data only)
                          </label>
                          <input
                            type="text"
                            value={editingOpportunity.stipendOrSalary || ''}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, stipendOrSalary: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. ₹40,000 / month or ₹8 - ₹12 LPA or Not specified"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Application Deadline (Optional)
                          </label>
                          <input
                            type="date"
                            value={editingOpportunity.deadline ? editingOpportunity.deadline.substring(0, 10) : ''}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, deadline: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                          Official Application / Career URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={editingOpportunity.applicationUrl || ''}
                          onChange={e => setEditingOpportunity({ ...editingOpportunity, applicationUrl: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          placeholder="https://company.com/careers/..."
                        />
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                          Must be an authentic, publicly accessible career portal (returns HTTP 200/301).
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Eligible Courses (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(editingOpportunity.eligibilityCourses) ? editingOpportunity.eligibilityCourses.join(', ') : (editingOpportunity.eligibilityCourses || '')}
                            onChange={e => setEditingOpportunity({
                              ...editingOpportunity,
                              eligibilityCourses: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="B.Tech, MCA, MBA, B.Pharm"
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.25rem' }}>
                          <input
                            type="checkbox"
                            id="adminFeaturedOpp"
                            checked={!!editingOpportunity.featured}
                            onChange={e => setEditingOpportunity({ ...editingOpportunity, featured: e.target.checked })}
                            style={{ width: '18px', height: '18px', accentColor: '#781416' }}
                          />
                          <label htmlFor="adminFeaturedOpp" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                            Feature this opportunity on the top shelf
                          </label>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                          Role Description
                        </label>
                        <textarea
                          rows={3}
                          value={editingOpportunity.description || ''}
                          onChange={e => setEditingOpportunity({ ...editingOpportunity, description: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          placeholder="Brief overview of the role, team, and scope of work..."
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Key Responsibilities (One per line)
                          </label>
                          <textarea
                            rows={3}
                            value={Array.isArray(editingOpportunity.responsibilities) ? editingOpportunity.responsibilities.join('\n') : (editingOpportunity.responsibilities || '')}
                            onChange={e => setEditingOpportunity({
                              ...editingOpportunity,
                              responsibilities: e.target.value.split('\n').filter(s => s.trim().length > 0)
                            })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="Design and develop modules...&#10;Write unit tests...&#10;Collaborate with mentors..."
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Key Requirements (One per line)
                          </label>
                          <textarea
                            rows={3}
                            value={Array.isArray(editingOpportunity.requirements) ? editingOpportunity.requirements.join('\n') : (editingOpportunity.requirements || '')}
                            onChange={e => setEditingOpportunity({
                              ...editingOpportunity,
                              requirements: e.target.value.split('\n').filter(s => s.trim().length > 0)
                            })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="Proficiency in Data Structures & Algorithms&#10;Hands-on knowledge of Python/Java/JS&#10;Good problem-solving ability"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                        <button
                          type="button"
                          onClick={() => { setOpportunityEditModalOpen(false); setEditingOpportunity(null); }}
                          style={{
                            padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1',
                            backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingOpportunity}
                          style={{
                            padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none',
                            backgroundColor: '#781416', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem',
                            cursor: savingOpportunity ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          {savingOpportunity ? 'Saving...' : 'Save & Publish'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* TAB: SCHOLARSHIPS MANAGEMENT */}
          {activeTab === 'scholarships' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* HEADER BANNER */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '54px', height: '54px', borderRadius: '14px', backgroundColor: '#FEF9EE',
                      color: '#8A5D00', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid #F1E7D0'
                    }}>
                      <GraduationCap size={30} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>
                        Scholarships Management & Verification CMS
                      </h2>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                        Verify authentic official portal links, review student/trust submissions, and manage live published financial aid schemes.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setEditingScholarship({
                          id: 'new',
                          title: '',
                          providerName: '',
                          officialWebsite: '',
                          applicationUrl: '',
                          type: 'Government',
                          category: 'Government Scholarships',
                          amount: '',
                          deadline: '',
                          location: 'All India',
                          incomeCriteria: '',
                          academicCriteria: '',
                          eligibleCourses: ['B.Tech'],
                          eligibleYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
                          description: '',
                          documentsRequired: [],
                          applicationProcess: [],
                          selectionProcess: '',
                          status: 'published'
                        });
                        setScholarshipEditModalOpen(true);
                      }}
                      style={{
                        backgroundColor: '#781416', color: '#ffffff', border: 'none',
                        borderRadius: '10px', padding: '0.65rem 1.2rem', fontWeight: 700,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem',
                        boxShadow: '0 4px 12px rgba(120, 20, 22, 0.25)'
                      }}
                    >
                      <Plus size={16} /> Add Scholarship
                    </button>

                    <button
                      onClick={fetchAdminScholarships}
                      disabled={loadingAdminScholarships}
                      style={{
                        backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1',
                        borderRadius: '10px', padding: '0.65rem 1rem', fontWeight: 600,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem'
                      }}
                    >
                      <RefreshCw size={14} className={loadingAdminScholarships ? 'animate-spin' : ''} /> Refresh
                    </button>

                    <button
                      onClick={() => onNavigate ? onNavigate('scholarships') : window.open('/scholarships', '_blank')}
                      style={{
                        backgroundColor: '#FEF9EE', color: '#8A5D00', border: '1px solid #E4CDA1',
                        borderRadius: '10px', padding: '0.65rem 1rem', fontWeight: 700,
                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem'
                      }}
                    >
                      <ExternalLink size={14} /> View Public Board
                    </button>
                  </div>
                </div>
              </div>

              {/* OVERVIEW STAT CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total In Database</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e293b', marginTop: '0.2rem' }}>
                    {adminScholarshipStats.totalScholarships}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>All listings</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Published & Active</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
                    {adminScholarshipStats.published}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>Live for students</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Submissions Pending</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#d97706', marginTop: '0.2rem' }}>
                    {adminScholarshipStats.pendingVerification}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '0.25rem', fontWeight: 700 }}>Awaiting moderation</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Verified Links</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0284c7', marginTop: '0.2rem' }}>
                    {adminScholarshipStats.verifiedLinks}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '0.25rem', fontWeight: 600 }}>HTTP 200 verified</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Needs Review</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#dc2626', marginTop: '0.2rem' }}>
                    {adminScholarshipStats.needsReview}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '0.25rem', fontWeight: 600 }}>Portal warning</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Closed / Expired</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#64748b', marginTop: '0.2rem' }}>
                    {adminScholarshipStats.expired}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>Concluded</div>
                </div>
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.25rem',
                border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '280px' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                    <input
                      type="text"
                      placeholder="Search scholarships by title or provider..."
                      value={adminScholarshipSearch}
                      onChange={e => setAdminScholarshipSearch(e.target.value)}
                      style={{
                        width: '100%', padding: '0.6rem 0.85rem 0.6rem 2.25rem',
                        borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.85rem',
                        outline: 'none', backgroundColor: '#f8fafc'
                      }}
                    />
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  <select
                    value={adminScholarshipFilterStatus}
                    onChange={e => setAdminScholarshipFilterStatus(e.target.value)}
                    style={{
                      padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.85rem', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600, outline: 'none'
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="pending_verification">Pending Verification</option>
                    <option value="needs_review">Needs Review</option>
                    <option value="closed">Closed</option>
                  </select>

                  <select
                    value={adminScholarshipFilterCategory}
                    onChange={e => setAdminScholarshipFilterCategory(e.target.value)}
                    style={{
                      padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.85rem', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600, outline: 'none'
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="Government Scholarships">Government</option>
                    <option value="Private Scholarships">Private</option>
                    <option value="Merit Based">Merit Based</option>
                    <option value="Need Based">Need Based</option>
                    <option value="International Scholarships">International</option>
                    <option value="Women Scholarships">Women</option>
                    <option value="SC/ST/OBC Scholarships">SC/ST/OBC</option>
                  </select>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                  Showing {adminScholarships.filter(s => {
                    if (adminScholarshipFilterStatus !== 'all' && s.status !== adminScholarshipFilterStatus) return false;
                    if (adminScholarshipFilterCategory !== 'all' && s.category !== adminScholarshipFilterCategory) return false;
                    if (adminScholarshipSearch.trim()) {
                      const q = adminScholarshipSearch.toLowerCase();
                      const matchTitle = (s.title || '').toLowerCase().includes(q);
                      const matchProvider = (s.providerName || '').toLowerCase().includes(q);
                      if (!matchTitle && !matchProvider) return false;
                    }
                    return true;
                  }).length} listings
                </div>
              </div>

              {/* SCHOLARSHIPS TABLE */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0',
                overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.76rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Scholarship & Provider</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Type & Category</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Grant Amount</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Deadline</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Link Verification</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Featured</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingAdminScholarships && adminScholarships.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: '#8A5D00' }} />
                            <div>Loading scholarships...</div>
                          </td>
                        </tr>
                      ) : adminScholarships.filter(s => {
                        if (adminScholarshipFilterStatus !== 'all' && s.status !== adminScholarshipFilterStatus) return false;
                        if (adminScholarshipFilterCategory !== 'all' && s.category !== adminScholarshipFilterCategory) return false;
                        if (adminScholarshipSearch.trim()) {
                          const q = adminScholarshipSearch.toLowerCase();
                          const matchTitle = (s.title || '').toLowerCase().includes(q);
                          const matchProvider = (s.providerName || '').toLowerCase().includes(q);
                          if (!matchTitle && !matchProvider) return false;
                        }
                        return true;
                      }).length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                            No scholarships match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        adminScholarships.filter(s => {
                          if (adminScholarshipFilterStatus !== 'all' && s.status !== adminScholarshipFilterStatus) return false;
                          if (adminScholarshipFilterCategory !== 'all' && s.category !== adminScholarshipFilterCategory) return false;
                          if (adminScholarshipSearch.trim()) {
                            const q = adminScholarshipSearch.toLowerCase();
                            const matchTitle = (s.title || '').toLowerCase().includes(q);
                            const matchProvider = (s.providerName || '').toLowerCase().includes(q);
                            if (!matchTitle && !matchProvider) return false;
                          }
                          return true;
                        }).map(s => {
                          const isVerifying = verifyingScholarshipId === s.id;
                          return (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'backgroundColor 0.15s' }}>
                              {/* Scholarship & Provider */}
                              <td style={{ padding: '0.85rem 1rem', maxWidth: '300px' }}>
                                <div style={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.3 }}>
                                  {s.title}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <Building2 size={13} />
                                  <span>{s.providerName}</span>
                                </div>
                              </td>

                              {/* Type & Category */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                                  <span style={{
                                    fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px',
                                    backgroundColor: s.type === 'Government' ? '#EFF6FF' : s.type === 'International' ? '#FAF5FF' : '#FEF9EE',
                                    color: s.type === 'Government' ? '#1D4ED8' : s.type === 'International' ? '#7E22CE' : '#8A5D00'
                                  }}>
                                    {s.type}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                    {s.category}
                                  </span>
                                </div>
                              </td>

                              {/* Grant Amount */}
                              <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#8A5D00' }}>
                                {s.amount}
                              </td>

                              {/* Deadline */}
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                                {s.deadline}
                              </td>

                              {/* Status */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <span style={{
                                  fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px',
                                  backgroundColor: s.status === 'published' ? '#ecfdf5' : s.status === 'pending_verification' ? '#fef3c7' : '#fee2e2',
                                  color: s.status === 'published' ? '#059669' : s.status === 'pending_verification' ? '#d97706' : '#dc2626'
                                }}>
                                  {s.status === 'published' ? 'Live / Active' : s.status === 'pending_verification' ? 'Pending Review' : s.status}
                                </span>
                              </td>

                              {/* Link Verification */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                  <span style={{
                                    fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px',
                                    backgroundColor: s.verificationStatus === 'verified' ? '#ecfdf5' : '#fee2e2',
                                    color: s.verificationStatus === 'verified' ? '#059669' : '#dc2626',
                                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                                  }}>
                                    {s.verificationStatus === 'verified' ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
                                    <span>{s.httpStatusCode ? `HTTP ${s.httpStatusCode}` : s.verificationStatus}</span>
                                  </span>

                                  <button
                                    onClick={() => handleVerifyScholarshipLink(s.id)}
                                    disabled={isVerifying}
                                    title="Run Real-time HTTP Verification"
                                    style={{
                                      padding: '0.25rem 0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff', cursor: isVerifying ? 'not-allowed' : 'pointer',
                                      fontSize: '0.7rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.2rem'
                                    }}
                                  >
                                    <RefreshCw size={11} className={isVerifying ? 'animate-spin' : ''} />
                                    <span>{isVerifying ? 'Checking...' : 'Verify'}</span>
                                  </button>
                                </div>
                              </td>

                              {/* Featured Toggle */}
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                <button
                                  onClick={() => handleToggleFeatureScholarship(s.id)}
                                  title="Toggle Featured"
                                  style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: s.featured ? '#f59e0b' : '#cbd5e1'
                                  }}
                                >
                                  <Star size={18} fill={s.featured ? '#f59e0b' : 'none'} />
                                </button>
                              </td>

                              {/* Actions */}
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                  {s.status === 'pending_verification' && (
                                    <>
                                      <button
                                        onClick={() => handleApproveScholarship(s.id)}
                                        title="Approve & Publish"
                                        style={{
                                          padding: '0.3rem 0.6rem', borderRadius: '6px', border: 'none',
                                          backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700,
                                          fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
                                        }}
                                      >
                                        <Check size={13} /> Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectScholarship(s.id)}
                                        title="Reject"
                                        style={{
                                          padding: '0.3rem 0.6rem', borderRadius: '6px', border: 'none',
                                          backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: 700,
                                          fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
                                        }}
                                      >
                                        <X size={13} /> Reject
                                      </button>
                                    </>
                                  )}

                                  <a
                                    href={s.applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open Official Portal"
                                    style={{
                                      padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff', color: '#64748b', display: 'flex', alignItems: 'center'
                                    }}
                                  >
                                    <ExternalLink size={14} />
                                  </a>

                                  <button
                                    onClick={() => {
                                      setEditingScholarship({ ...s });
                                      setScholarshipEditModalOpen(true);
                                    }}
                                    title="Edit Scholarship"
                                    style={{
                                      padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center'
                                    }}
                                  >
                                    <Edit size={14} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteScholarship(s.id, s.title)}
                                    title="Delete Scholarship"
                                    style={{
                                      padding: '0.35rem', borderRadius: '6px', border: '1px solid #fecaca',
                                      backgroundColor: '#fff5f5', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center'
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* EDIT / CREATE SCHOLARSHIP MODAL */}
              {scholarshipEditModalOpen && editingScholarship && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
                }}>
                  <div style={{
                    backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '750px', width: '100%',
                    maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                        {editingScholarship.id === 'new' ? 'Add New Scholarship' : 'Edit Scholarship'}
                      </h3>
                      <button
                        onClick={() => { setScholarshipEditModalOpen(false); setEditingScholarship(null); }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveScholarshipForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Scholarship Scheme Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingScholarship.title || ''}
                            onChange={e => setEditingScholarship({ ...editingScholarship, title: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. Central Sector Scheme of Scholarship (CSSS)"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Awarding Provider / Ministry / Trust *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingScholarship.providerName || ''}
                            onChange={e => setEditingScholarship({ ...editingScholarship, providerName: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. Ministry of Education, Government of India"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Type
                          </label>
                          <select
                            value={editingScholarship.type || 'Government'}
                            onChange={e => setEditingScholarship({ ...editingScholarship, type: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff' }}
                          >
                            <option value="Government">Government</option>
                            <option value="Private">Private</option>
                            <option value="International">International</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Primary Category
                          </label>
                          <select
                            value={editingScholarship.category || 'Government Scholarships'}
                            onChange={e => setEditingScholarship({ ...editingScholarship, category: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff' }}
                          >
                            <option value="Government Scholarships">Government Scholarships</option>
                            <option value="Private Scholarships">Private Scholarships</option>
                            <option value="Merit Based">Merit Based</option>
                            <option value="Need Based">Need Based</option>
                            <option value="International Scholarships">International Scholarships</option>
                            <option value="State Scholarships">State Scholarships</option>
                            <option value="Minority Scholarships">Minority Scholarships</option>
                            <option value="SC/ST/OBC Scholarships">SC/ST/OBC Scholarships</option>
                            <option value="Women Scholarships">Women Scholarships</option>
                            <option value="PwD Scholarships">PwD Scholarships</option>
                            <option value="Research Scholarships">Research Scholarships</option>
                            <option value="Sports Scholarships">Sports Scholarships</option>
                            <option value="Other Scholarships">Other Scholarships</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Grant Amount *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingScholarship.amount || ''}
                            onChange={e => setEditingScholarship({ ...editingScholarship, amount: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. ₹50,000/year or Up to ₹2,00,000"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Application Deadline *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingScholarship.deadline || ''}
                            onChange={e => setEditingScholarship({ ...editingScholarship, deadline: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. Dec 31, 2026 or Rolling"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                          Official Application / Portal URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={editingScholarship.applicationUrl || ''}
                          onChange={e => setEditingScholarship({ ...editingScholarship, applicationUrl: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          placeholder="https://scholarships.gov.in/ or official foundation portal"
                        />
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                          Must be an authentic official government or registered trust portal.
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Income Limit Criteria
                          </label>
                          <input
                            type="text"
                            value={editingScholarship.incomeCriteria || ''}
                            onChange={e => setEditingScholarship({ ...editingScholarship, incomeCriteria: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. Gross family income must not exceed ₹4,50,000 per annum"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Academic Merit Criteria
                          </label>
                          <input
                            type="text"
                            value={editingScholarship.academicCriteria || ''}
                            onChange={e => setEditingScholarship({ ...editingScholarship, academicCriteria: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="e.g. Above 80th percentile in Class 12 board examination"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                          Detailed Description *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={editingScholarship.description || ''}
                          onChange={e => setEditingScholarship({ ...editingScholarship, description: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          placeholder="Comprehensive scheme details, guidelines, and objectives..."
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Documents Required (One per line)
                          </label>
                          <textarea
                            rows={3}
                            value={Array.isArray(editingScholarship.documentsRequired) ? editingScholarship.documentsRequired.join('\n') : (editingScholarship.documentsRequired || '')}
                            onChange={e => setEditingScholarship({
                              ...editingScholarship,
                              documentsRequired: e.target.value.split('\n').filter(s => s.trim().length > 0)
                            })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="Class 10/12 Marksheet&#10;Income Certificate&#10;Aadhaar Card linked to Bank Account"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Application Steps (One per line)
                          </label>
                          <textarea
                            rows={3}
                            value={Array.isArray(editingScholarship.applicationProcess) ? editingScholarship.applicationProcess.join('\n') : (editingScholarship.applicationProcess || '')}
                            onChange={e => setEditingScholarship({
                              ...editingScholarship,
                              applicationProcess: e.target.value.split('\n').filter(s => s.trim().length > 0)
                            })}
                            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            placeholder="Register on the official portal&#10;Fill academic and family income details&#10;Submit to college nodal desk for physical verification"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                        <button
                          type="button"
                          onClick={() => { setScholarshipEditModalOpen(false); setEditingScholarship(null); }}
                          style={{
                            padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1',
                            backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingScholarship}
                          style={{
                            padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none',
                            backgroundColor: '#781416', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem',
                            cursor: savingScholarship ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          {savingScholarship ? 'Saving...' : 'Save & Publish'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* TAB: GOOGLE DRIVE OAUTH INTEGRATION */}
          {activeTab === 'gdrive' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* HEADER BANNER */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '54px', height: '54px', borderRadius: '14px', backgroundColor: '#e0f2fe',
                      color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <HardDrive size={28} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Google Drive OAuth Integration
                      </h2>
                      <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                        Authorize ProfessorVirus to upload &amp; serve PDF notes directly from your Google Drive.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={fetchGdriveStatus}
                      disabled={gdriveLoading}
                      style={{
                        padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff', color: '#334155', fontWeight: 600, fontSize: '0.85rem',
                        display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
                      }}
                    >
                      <RefreshCw size={15} className={gdriveLoading ? 'spin' : ''} /> Refresh Status
                    </button>
                  </div>
                </div>
              </div>

              {/* SYSTEM HEALTH STATUS PANEL */}
              {systemHealth && (
                <div style={{
                  backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                  border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} /> System Health Status
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {[
                      { label: 'Backend API', ok: systemHealth.status === 'ok' },
                      { label: 'Environment (.env)', ok: systemHealth.environment?.hasGoogleClientId && systemHealth.environment?.hasJwtSecret },
                      { label: 'MongoDB', ok: systemHealth.database?.mongoConnected, fallback: 'Disk Mode' },
                      { label: 'Google OAuth Config', ok: systemHealth.environment?.hasGoogleClientId && systemHealth.environment?.hasGoogleClientSecret },
                      { label: 'Google Drive Auth', ok: systemHealth.googleDrive?.status === 'connected' },
                      { label: `Notes Database (${systemHealth.dataStores?.totalNotes || 0})`, ok: (systemHealth.dataStores?.totalNotes || 0) > 0 },
                      { label: `PYQ Database (${systemHealth.dataStores?.totalPyqs || 0})`, ok: (systemHealth.dataStores?.totalPyqs || 0) > 0 },
                      { label: `Projects Database (${systemHealth.dataStores?.totalProjects || 0})`, ok: (systemHealth.dataStores?.totalProjects || 0) > 0 },
                      { label: `Scholarships Database (${systemHealth.dataStores?.totalScholarships || 0})`, ok: (systemHealth.dataStores?.totalScholarships || 0) > 0 },
                      { label: 'Disk Storage', ok: systemHealth.database?.diskStorageActive },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 0.75rem', borderRadius: '8px',
                        backgroundColor: item.ok ? '#f0fdf4' : (item.fallback ? '#fffbeb' : '#fef2f2'),
                        border: `1px solid ${item.ok ? '#bbf7d0' : (item.fallback ? '#fde68a' : '#fecaca')}`
                      }}>
                        {item.ok ? (
                          <CheckCircle2 size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
                        ) : item.fallback ? (
                          <AlertCircle size={14} style={{ color: '#d97706', flexShrink: 0 }} />
                        ) : (
                          <AlertCircle size={14} style={{ color: '#dc2626', flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.ok ? '#166534' : (item.fallback ? '#92400e' : '#991b1b') }}>
                          {item.label}{!item.ok && item.fallback ? ` (${item.fallback})` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                  {systemHealth.googleDrive?.accountEmail && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                      Google Account: <strong>{systemHealth.googleDrive.accountEmail}</strong>
                      {systemHealth.googleDrive.tokenExpiresIn && ` • Token expires in ${systemHealth.googleDrive.tokenExpiresIn}`}
                    </div>
                  )}
                  {systemHealth.status === 'unreachable' && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>
                      ⚠️ Backend server is not running. Start it with: <code style={{ backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>npm run dev</code>
                    </div>
                  )}
                </div>
              )}

              {/* OAUTH CONNECTION STATUS CARD */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#C88D2D" /> Connection &amp; Account Status
                </h3>

                {gdriveMessage && (
                  <div style={{
                    padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.25rem',
                    backgroundColor: gdriveMessage.includes('Failed') || gdriveMessage.includes('Error') ? '#fef2f2' : '#f0fdf4',
                    color: gdriveMessage.includes('Failed') || gdriveMessage.includes('Error') ? '#991b1b' : '#166534',
                    border: `1px solid ${gdriveMessage.includes('Failed') || gdriveMessage.includes('Error') ? '#fecaca' : '#bbf7d0'}`,
                    fontSize: '0.88rem', fontWeight: 600
                  }}>
                    {gdriveMessage}
                  </div>
                )}

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem'
                }}>
                  {/* Connection State Panel */}
                  <div style={{
                    padding: '1.25rem', borderRadius: '12px',
                    backgroundColor: gdriveStatus?.isConnected ? '#f0fdf4' : '#f8fafc',
                    border: `1.5px solid ${gdriveStatus?.isConnected ? '#bbf7d0' : '#e2e8f0'}`
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Current Status
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                      {gdriveStatus?.isConnected ? (
                        <>
                          <CheckCircle2 size={24} color="#16a34a" />
                          <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#14532d' }}>Connected to Google Drive</div>
                            <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>{gdriveStatus.accountEmail}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={24} color="#f59e0b" />
                          <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#92400e' }}>Not Connected</div>
                            <div style={{ fontSize: '0.83rem', color: '#b45309' }}>OAuth token has not been authorized yet</div>
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {gdriveStatus?.isConnected ? (
                        <>
                          <button
                            onClick={handleTestGdrive}
                            disabled={gdriveLoading}
                            style={{
                              padding: '0.65rem 1.1rem', borderRadius: '8px', border: 'none',
                              backgroundColor: '#1F2421', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}
                          >
                            <Zap size={15} /> Test API Connection
                          </button>
                          <button
                            onClick={handleInitGdriveFolder}
                            disabled={gdriveLoading}
                            style={{
                              padding: '0.65rem 1.1rem', borderRadius: '8px', border: 'none',
                              backgroundColor: '#0284c7', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}
                          >
                            <FolderPlus size={15} /> Prepare Folder (ProfessorVirus Notes)
                          </button>
                          <button
                            onClick={handleTestUploadGdrive}
                            disabled={gdriveLoading}
                            style={{
                              padding: '0.65rem 1.1rem', borderRadius: '8px', border: 'none',
                              backgroundColor: '#7c3aed', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}
                          >
                            <UploadCloud size={15} /> Test Google Drive Upload
                          </button>
                          <button
                            onClick={handleDisconnectGdrive}
                            disabled={gdriveLoading}
                            style={{
                              padding: '0.65rem 1.1rem', borderRadius: '8px', border: '1px solid #fecaca',
                              backgroundColor: '#fef2f2', color: '#991b1b', fontWeight: 700, fontSize: '0.85rem',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}
                          >
                            <LogOut size={15} /> Disconnect Account
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleConnectGdrive}
                          disabled={gdriveLoading || !gdriveStatus?.hasClientId}
                          style={{
                            padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
                            backgroundColor: gdriveStatus?.hasClientId ? '#0284c7' : '#94a3b8',
                            color: '#ffffff', fontWeight: 800, fontSize: '0.9rem',
                            cursor: gdriveStatus?.hasClientId ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: gdriveStatus?.hasClientId ? '0 4px 12px rgba(2,132,199,0.3)' : 'none'
                          }}
                        >
                          <UploadCloud size={18} /> Connect Google Drive Account
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Configuration Checklist */}
                  <div style={{
                    padding: '1.25rem', borderRadius: '12px', backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      Environment Credentials Check
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#475569', fontWeight: 600 }}>GOOGLE_CLIENT_ID</span>
                        {gdriveLoading && !gdriveStatus ? (
                          <span style={{ color: '#64748b', fontWeight: 600 }}>Checking...</span>
                        ) : gdriveStatus?.hasClientId ? (
                          <span style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={14} /> Set in .env</span>
                        ) : (
                          <span style={{ color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={14} /> Missing in .env</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#475569', fontWeight: 600 }}>GOOGLE_CLIENT_SECRET</span>
                        {gdriveLoading && !gdriveStatus ? (
                          <span style={{ color: '#64748b', fontWeight: 600 }}>Checking...</span>
                        ) : (gdriveStatus?.hasClientSecret || gdriveStatus?.hasClientId) ? (
                          <span style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={14} /> Set in .env</span>
                        ) : (
                          <span style={{ color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={14} /> Missing in .env</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#475569', fontWeight: 600 }}>GOOGLE_DRIVE_FOLDER_ID</span>
                        {gdriveStatus?.folderId ? (
                          <span style={{ color: '#0284c7', fontWeight: 700 }}>{gdriveStatus.folderId.slice(0, 12)}...</span>
                        ) : (
                          <span style={{ color: '#64748b', fontWeight: 500 }}>Optional (Root Drive)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* EXACT GOOGLE OAUTH REDIRECT URI BOX */}
              <div style={{
                backgroundColor: '#0f172a', borderRadius: '16px', padding: '1.75rem', color: '#f8fafc',
                boxShadow: '0 8px 24px rgba(15,23,42,0.15)', border: '1px solid #1e293b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ExternalLink size={18} /> EXACT GOOGLE OAUTH REDIRECT URI
                  </h3>
                  {copiedUri && <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 700 }}>Copied to Clipboard!</span>}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  Add this <strong>exact URI</strong> to your Google Cloud Console project under:
                  <br />
                  <span style={{ color: '#cbd5e1' }}>Google Cloud Console &rarr; APIs &amp; Services &rarr; Credentials &rarr; OAuth 2.0 Client IDs &rarr; Authorized redirect URIs</span>
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '10px',
                  padding: '0.85rem 1.15rem', fontFamily: 'monospace', fontSize: '0.95rem', color: '#38bdf8'
                }}>
                  <span>{gdriveStatus?.redirectUri || (typeof window !== 'undefined' ? `${window.location.origin}/api/google-drive/callback` : '/api/google-drive/callback')}</span>
                  <button
                    onClick={() => {
                      const uri = gdriveStatus?.redirectUri || (typeof window !== 'undefined' ? `${window.location.origin}/api/google-drive/callback` : '/api/google-drive/callback');
                      navigator.clipboard.writeText(uri);
                      setCopiedUri(true);
                      setTimeout(() => setCopiedUri(false), 3000);
                    }}
                    style={{
                      padding: '0.4rem 0.85rem', borderRadius: '6px', border: 'none',
                      backgroundColor: '#0284c7', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem'
                    }}
                  >
                    <Copy size={14} /> Copy URI
                  </button>
                </div>
              </div>

              {/* TEST RESULT DETAILS CARD */}
              {gdriveTestResult && (
                <div style={{
                  backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem',
                  border: `1.5px solid ${gdriveTestResult.success ? '#bbf7d0' : '#fecaca'}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <h3 style={{
                    fontSize: '1.05rem', fontWeight: 800,
                    color: gdriveTestResult.success ? '#15803d' : '#b91c1c',
                    marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    {gdriveTestResult.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {gdriveTestResult.message}
                  </h3>

                  {gdriveTestResult.connection && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem',
                      backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '0.75rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Connected Account</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{gdriveTestResult.connection.accountEmail}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Used Storage</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{gdriveTestResult.connection.usedStorage}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Storage</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>{gdriveTestResult.connection.totalStorage}</div>
                      </div>
                      {gdriveTestResult.connection.folder && (
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Configured Folder</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0284c7', marginTop: '0.25rem' }}>
                            {gdriveTestResult.connection.folder.name || gdriveTestResult.connection.folder.id}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>User Account Management</h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748b' }}>Manage student and admin accounts.</p>
                </div>
                <button onClick={() => setActiveModal('addUser')} className="btn-primary" style={{ padding: '0.55rem 1.1rem', backgroundColor: '#1F2421', fontSize: '0.85rem' }}>
                  + Add User
                </button>
              </div>

              <div style={panelCardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '0.65rem' }}>Name</th>
                      <th style={{ padding: '0.65rem' }}>Email</th>
                      <th style={{ padding: '0.65rem' }}>Branch</th>
                      <th style={{ padding: '0.65rem' }}>Role</th>
                      <th style={{ padding: '0.65rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsersList.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.65rem', fontWeight: 800, color: '#0f172a' }}>{u.name}</td>
                        <td style={{ padding: '0.65rem', color: '#475569' }}>{u.email}</td>
                        <td style={{ padding: '0.65rem', fontWeight: 700, color: '#1F2421' }}>{u.branch}</td>
                        <td style={{ padding: '0.65rem' }}>{u.role}</td>
                        <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteUser(u.id, u.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: QUIZZES MANAGEMENT */}
          {activeTab === 'quizzes' && (
            <AdminQuizManager
              adminToken={getAdminToken()}
              onNavigate={onNavigate}
            />
          )}

        </main>
      </div>

      {/* MODALS */}
      {/* 1. ADD PYQ MODAL (REAL PDF UPLOAD + SESSIONS + SUBJECT SELECTION) */}
      {activeModal === 'addPyq' && (
        <AdminAddPyqModal
          subjects={subjectsList}
          initialData={selectedCellPyqData}
          onNavigate={onNavigate}
          onClose={() => {
            setActiveModal(null);
            setSelectedCellPyqData(null);
          }}
          onCreated={() => {
            fetchAdminPyqs();
            fetchDashboardData();
            setActiveModal(null);
            setSelectedCellPyqData(null);
          }}
        />
      )}

      {/* 2. EDIT PYQ MODAL */}
      {editingPyq && (
        <AdminEditPyqModal
          pyq={editingPyq}
          subjects={subjectsList}
          onClose={() => setEditingPyq(null)}
          onSaved={() => {
            fetchAdminPyqs();
            fetchDashboardData();
          }}
        />
      )}

      {/* 3. REPLACE PDF MODAL */}
      {replacePdfPyq && (
        <AdminReplacePdfModal
          pyq={replacePdfPyq}
          onClose={() => setReplacePdfPyq(null)}
          onSaved={() => {
            fetchAdminPyqs();
            fetchDashboardData();
          }}
        />
      )}

      {/* 4. ADD SUBJECT MODAL */}
      {activeModal === 'addSubject' && (
        <AdminAddSubjectModal
          onClose={() => setActiveModal(null)}
          onCreated={() => {
            fetchSubjects();
            fetchDashboardData();
          }}
        />
      )}

      {/* 5. ADD USER MODAL */}
      {activeModal === 'addUser' && (
        <AdminAddUserModal
          onClose={() => setActiveModal(null)}
          onCreated={() => {
            fetchAllUsers();
            fetchDashboardData();
          }}
        />
      )}

      {/* 6. MANAGE NOTE MODAL (ADD / EDIT / UPLOAD PDF FOR 4 NOTE SOURCES) */}
      {(activeModal === 'addNote' || editingNote || noteModalData) && (
        <AdminManageNoteModal
          note={editingNote}
          initialData={noteModalData}
          onClose={() => {
            setActiveModal(null);
            setEditingNote(null);
            setNoteModalData(null);
          }}
          onSaved={() => {
            fetchAdminNotes();
            fetchDashboardData();
          }}
        />
      )}

    </div>
  );
}

// =========================================================================
// MODAL COMPONENTS FOR PYQ CMS & SUBJECT MANAGEMENT
// =========================================================================

// ADD PYQ MODAL (REAL FILE UPLOAD & EXTERNAL URL SUPPORTED)
function AdminAddPyqModal({ subjects, initialData, onClose, onCreated, onNavigate }) {
  const [course, setCourse] = useState(initialData?.course || 'B.Tech');
  const [semester, setSemester] = useState(initialData?.semester || 'Semester 1');
  const [specialization, setSpecialization] = useState(initialData?.specialization || 'Core Management');
  const [branch, setBranch] = useState(initialData?.branch || 'CSE');
  const [year, setYear] = useState(initialData?.year || 'Year 1');
  const [subjectName, setSubjectName] = useState(initialData?.subjectName || initialData?.subject || '');
  const [subjectCode, setSubjectCode] = useState(initialData?.subjectCode || initialData?.code || '');
  const [academicYear, setAcademicYear] = useState(initialData?.academicYear || initialData?.examYear || '2024-2025');
  const [examType, setExamType] = useState('End Semester');
  const [resourceType, setResourceType] = useState('pdf'); // 'pdf' | 'url'
  const [externalUrl, setExternalUrl] = useState('');
  const [published, setPublished] = useState(true);

  // PDF Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfStoragePath, setPdfStoragePath] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const ACADEMIC_YEARS = [
    '2017-2018',
    '2018-2019',
    '2019-2020',
    '2020-2021',
    '2021-2022',
    '2022-2023',
    '2023-2024',
    '2024-2025',
    '2025-2026'
  ];

  const availableSubjects = subjects.filter(s => 
    s.branchId === branch || s.branchId === 'ALL'
  );

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please select a valid PDF (.pdf) file.');
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first.');
      return null;
    }

    const token = getAdminToken();
    if (!token) {
      alert('Session expired or missing authentication token. Please log in again.');
      if (onNavigate) onNavigate('admin-login');
      return null;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    setUploading(true);
    setUploadProgress('Uploading PDF file to server storage...');

    try {
      const res = await fetch('/api/admin/pyqs/upload-pdf', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      setUploading(false);

      if (res.ok && data.success) {
        setPdfUrl(data.pdfUrl);
        setPdfStoragePath(data.pdfStoragePath);
        setFileName(data.fileName);
        setUploadProgress('PDF uploaded successfully!');
        return data;
      } else {
        setUploadProgress('');
        if (res.status === 401 || (data.message && data.message.includes('Session expired'))) {
          localStorage.removeItem('admin_token');
          sessionStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          sessionStorage.removeItem('admin_user');
          alert('Session expired or invalid. Please log in again.');
          if (onNavigate) onNavigate('admin-login');
        } else {
          alert(data.message || 'File upload failed.');
        }
        return null;
      }
    } catch (err) {
      setUploading(false);
      setUploadProgress('');
      alert('Network error during file upload.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectName) {
      alert('Please enter or select a Subject.');
      return;
    }

    let finalPdfUrl = '';
    let finalStoragePath = '';
    let finalFileName = '';

    if (resourceType === 'pdf') {
      finalPdfUrl = pdfUrl;
      finalStoragePath = pdfStoragePath;
      finalFileName = fileName;

      if (selectedFile && !pdfUrl) {
        const uploadResult = await handleUploadFile();
        if (!uploadResult) return;
        finalPdfUrl = uploadResult.pdfUrl;
        finalStoragePath = uploadResult.pdfStoragePath;
        finalFileName = uploadResult.fileName;
      }

      if (!finalPdfUrl) {
        alert('Please select and upload a valid PDF file.');
        return;
      }
    } else {
      if (!externalUrl.trim()) {
        alert('Please paste a valid external PDF URL.');
        return;
      }
      finalPdfUrl = externalUrl.trim();
      finalFileName = 'External PDF URL';
    }

    const token = getAdminToken();
    if (!token) {
      alert('Session expired or missing authentication token. Please log in again.');
      if (onNavigate) onNavigate('admin-login');
      return;
    }

    try {
      const res = await fetch('/api/admin/pyqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          course,
          semester: course !== 'B.Tech' ? semester : '',
          specialization: course === 'MBA' ? specialization : '',
          branchId: branch,
          branch: branch,
          btechYear: year,
          year: course === 'B.Tech' ? year : semester,
          subjectName,
          subject: subjectName,
          subjectCode,
          academicYear,
          examType,
          resourceType,
          pdfUrl: finalPdfUrl,
          fileUrl: finalPdfUrl,
          externalUrl: resourceType === 'url' ? finalPdfUrl : '',
          pdfStoragePath: finalStoragePath,
          fileName: finalFileName,
          published,
          status: published ? 'published' : 'unpublished'
        })
      });
      const data = await res.json();
      if (res.status === 401 || (data.message && data.message.includes('Session expired'))) {
        localStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_user');
        alert('Session expired or invalid. Please log in again.');
        if (onNavigate) onNavigate('admin-login');
        return;
      }
      if (res.ok && data.success) {
        alert(data.message || 'PYQ saved successfully!');
        if (onCreated) onCreated();
        onClose();
      } else {
        alert(data.message || 'Failed to save PYQ.');
      }
    } catch (err) {
      alert('Error saving PYQ question paper.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          + Add Question Paper (PYQ)
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          
          {/* Course Selector */}
          <div>
            <label style={modalLabelStyle}>Course *</label>
            <select value={course} onChange={e => setCourse(e.target.value)} style={modalInputStyle}>
              <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
              <option value="MCA">MCA (Master of Computer Applications)</option>
              <option value="MBA">MBA (Master of Business Administration)</option>
              <option value="B.Pharm">B.Pharm (Bachelor of Pharmacy)</option>
            </select>
          </div>

          {/* Conditional: Branch & B.Tech Year vs Semester / Specialization */}
          {course === 'B.Tech' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={modalLabelStyle}>Branch *</label>
                <select value={branch} onChange={e => setBranch(e.target.value)} style={modalInputStyle}>
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="ECE">ECE (Electronics)</option>
                  <option value="ME">ME (Mechanical)</option>
                  <option value="CE">CE (Civil)</option>
                  <option value="IT">IT (Information Tech)</option>
                  <option value="EE">EE (Electrical)</option>
                  <option value="AI & ML">AI & ML (Artificial Intelligence)</option>
                  <option value="DS">DS (Data Science)</option>
                </select>
              </div>

              <div>
                <label style={modalLabelStyle}>B.Tech Year *</label>
                <select value={year} onChange={e => setYear(e.target.value)} style={modalInputStyle}>
                  <option value="Year 1">1st Year</option>
                  <option value="Year 2">2nd Year</option>
                  <option value="Year 3">3rd Year</option>
                  <option value="Year 4">4th Year</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: course === 'MBA' ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
              <div>
                <label style={modalLabelStyle}>Semester *</label>
                <select value={semester} onChange={e => setSemester(e.target.value)} style={modalInputStyle}>
                  {course === 'B.Pharm'
                    ? [1,2,3,4,5,6,7,8].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)
                    : [1,2,3,4].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)
                  }
                </select>
              </div>

              {course === 'MBA' && (
                <div>
                  <label style={modalLabelStyle}>Specialization *</label>
                  <select value={specialization} onChange={e => setSpecialization(e.target.value)} style={modalInputStyle}>
                    <option value="Core Management">Core Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations & Supply Chain">Operations &amp; Supply Chain</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="International Business">International Business</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Subject Selection */}
          <div>
            <label style={modalLabelStyle}>Select Subject *</label>
            <select
              value={subjectName}
              onChange={e => {
                const selectedSubName = e.target.value;
                setSubjectName(selectedSubName);
                const subObj = availableSubjects.find(s => s.name === selectedSubName);
                if (subObj) setSubjectCode(subObj.code || '');
              }}
              style={modalInputStyle}
            >
              <option value="">-- Choose Subject or Type Custom Below --</option>
              {availableSubjects.map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.code || 'General'})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Subject Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Engineering Mathematics-I"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                style={modalInputStyle}
              />
            </div>
            <div>
              <label style={modalLabelStyle}>Subject Code</label>
              <input
                type="text"
                placeholder="e.g. KAS-103"
                value={subjectCode}
                onChange={e => setSubjectCode(e.target.value)}
                style={modalInputStyle}
              />
            </div>
          </div>

          {/* Academic Session & Exam Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Exam Year (Academic Session) *</label>
              <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={modalInputStyle}>
                {ACADEMIC_YEARS.map(ay => <option key={ay} value={ay}>{ay}</option>)}
              </select>
            </div>

            <div>
              <label style={modalLabelStyle}>Exam Type *</label>
              <select value={examType} onChange={e => setExamType(e.target.value)} style={modalInputStyle}>
                <option value="End Semester">End Semester</option>
                <option value="Mid Semester">Mid Semester</option>
                <option value="Internal">Internal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* RESOURCE TYPE RADIO OPTIONS */}
          <div>
            <label style={modalLabelStyle}>PYQ Resource Type *</label>
            <div style={{ display: 'flex', gap: '1.25rem', backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem', color: resourceType === 'pdf' ? '#1F2421' : '#475569' }}>
                <input
                  type="radio"
                  name="resourceType"
                  value="pdf"
                  checked={resourceType === 'pdf'}
                  onChange={() => setResourceType('pdf')}
                  style={{ accentColor: '#1F2421' }}
                />
                Upload PDF File
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem', color: resourceType === 'url' ? '#0284c7' : '#475569' }}>
                <input
                  type="radio"
                  name="resourceType"
                  value="url"
                  checked={resourceType === 'url'}
                  onChange={() => setResourceType('url')}
                  style={{ accentColor: '#0284c7' }}
                />
                External PDF URL
              </label>
            </div>
          </div>

          {/* CONDITIONAL RESOURCE INPUT */}
          {resourceType === 'pdf' ? (
            <div style={{ backgroundColor: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', display: 'block' }}>
                Upload PYQ PDF File (.pdf) *
              </label>
              
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.5rem' }}
              />

              {selectedFile && !pdfUrl && (
                <button
                  type="button"
                  onClick={handleUploadFile}
                  disabled={uploading}
                  style={{
                    backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px',
                    padding: '0.4rem 0.8rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                  }}
                >
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload PDF File Now'}
                </button>
              )}

              {uploadProgress && (
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pdfUrl ? '#C88D2D' : '#0284c7', marginTop: '0.35rem' }}>
                  {uploadProgress}
                </div>
              )}

              {pdfUrl && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#C88D2D' }}>
                  ✓ File Saved: <a href={pdfUrl} target="_blank" rel="noreferrer" style={{ color: '#C88D2D', textDecoration: 'underline' }}>{fileName}</a>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label style={modalLabelStyle}>PYQ PDF URL *</label>
              <input
                type="url"
                required
                placeholder="Paste real PDF URL here (e.g. https://domain.com/paper.pdf)"
                value={externalUrl}
                onChange={e => setExternalUrl(e.target.value)}
                style={modalInputStyle}
              />
            </div>
          )}

          {/* PUBLISHED TOGGLE */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FDF6E8', border: '1px solid #E8D3B0', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1F2421' }}>Publish Status</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', color: published ? '#C88D2D' : '#ef4444' }}>
              <input
                type="checkbox"
                checked={published}
                onChange={e => setPublished(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#C88D2D' }}
              />
              {published ? 'Published (Visible publicly)' : 'Draft / Unpublished'}
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ backgroundColor: '#1F2421', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.92rem', fontWeight: 900, borderRadius: '10px' }}
          >
            Save & Publish PYQ Paper
          </button>
        </form>
      </div>
    </div>
  );
}

// EDIT PYQ MODAL (PRE-POPULATED WITH REPLACE PDF & URL EDIT SUPPORT)
function AdminEditPyqModal({ pyq, subjects, onClose, onSaved }) {
  const [course, setCourse] = useState(pyq.course || 'B.Tech');
  const [semester, setSemester] = useState(pyq.semester || 'Semester 1');
  const [specialization, setSpecialization] = useState(pyq.specialization || 'Core Management');
  const [branch, setBranch] = useState(pyq.branchId || pyq.branch || 'CSE');
  const [year, setYear] = useState(pyq.year || 'Year 1');
  const [subjectName, setSubjectName] = useState(pyq.subjectName || pyq.subject || '');
  const [subjectCode, setSubjectCode] = useState(pyq.subjectCode || '');
  const [academicYear, setAcademicYear] = useState(pyq.academicYear || pyq.examYear || '2024-2025');
  const [examType, setExamType] = useState(pyq.examType || 'End Semester');
  const [resourceType, setResourceType] = useState(pyq.resourceType || (pyq.pdfUrl?.startsWith('http') && !pyq.pdfUrl?.includes('/uploads/') ? 'url' : 'pdf'));
  const [pdfUrl, setPdfUrl] = useState(pyq.pdfUrl || pyq.fileUrl || '');
  const [fileName, setFileName] = useState(pyq.fileName || 'QuestionPaper.pdf');
  const [published, setPublished] = useState(pyq.published !== false && pyq.status !== 'unpublished');
  const publishedChangedRef = React.useRef(false);

  // Replacement File State
  const [replacementFile, setReplacementFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const ACADEMIC_YEARS = [
    '2017-2018',
    '2018-2019',
    '2019-2020',
    '2020-2021',
    '2021-2022',
    '2022-2023',
    '2023-2024',
    '2024-2025',
    '2025-2026'
  ];

  const handleReplacementFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please select a valid PDF (.pdf) file.');
        return;
      }
      setReplacementFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAdminToken();

    let currentPdfUrl = pdfUrl;
    let currentFileName = fileName;

    // If replacement file was selected for PDF upload
    if (resourceType === 'pdf' && replacementFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('pdf', replacementFile);
      try {
        const replaceRes = await fetch(`/api/admin/pyqs/${pyq.id}/replace-pdf`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const replaceData = await replaceRes.json();
        setUploading(false);
        if (replaceData.success && replaceData.pyq) {
          currentPdfUrl = replaceData.pyq.pdfUrl;
          currentFileName = replaceData.pyq.fileName;
        } else {
          alert(replaceData.message || 'PDF replacement failed.');
          return;
        }
      } catch (err) {
        setUploading(false);
        alert('Network error replacing PDF file.');
        return;
      }
    }

    try {
      const updateBody = {
          course,
          semester: course !== 'B.Tech' ? semester : '',
          specialization: course === 'MBA' ? specialization : '',
          branchId: branch,
          branch: branch,
          year: course === 'B.Tech' ? year : semester,
          subjectName,
          subjectCode,
          academicYear,
          examType,
          resourceType,
          pdfUrl: currentPdfUrl,
          fileName: resourceType === 'url' ? 'External PDF URL' : currentFileName,
          published: Boolean(published),
          status: published ? 'published' : 'unpublished'
        };
      const res = await fetch(`/api/admin/pyqs/${pyq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateBody)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onSaved) onSaved();
        onClose();
      } else {
        alert(data.message || 'Error updating PYQ paper.');
      }
    } catch (err) {
      alert('Error updating PYQ paper.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          Edit Question Paper
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          <div>
            <label style={modalLabelStyle}>Course *</label>
            <select value={course} onChange={e => setCourse(e.target.value)} style={modalInputStyle}>
              <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
              <option value="MCA">MCA (Master of Computer Applications)</option>
              <option value="MBA">MBA (Master of Business Administration)</option>
              <option value="B.Pharm">B.Pharm (Bachelor of Pharmacy)</option>
            </select>
          </div>

          {course === 'B.Tech' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={modalLabelStyle}>Branch *</label>
                <select value={branch} onChange={e => setBranch(e.target.value)} style={modalInputStyle}>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="IT">IT</option>
                  <option value="EE">EE</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="DS">DS</option>
                </select>
              </div>
              <div>
                <label style={modalLabelStyle}>B.Tech Year *</label>
                <select value={year} onChange={e => setYear(e.target.value)} style={modalInputStyle}>
                  <option value="Year 1">1st Year</option>
                  <option value="Year 2">2nd Year</option>
                  <option value="Year 3">3rd Year</option>
                  <option value="Year 4">4th Year</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: course === 'MBA' ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
              <div>
                <label style={modalLabelStyle}>Semester *</label>
                <select value={semester} onChange={e => setSemester(e.target.value)} style={modalInputStyle}>
                  {course === 'B.Pharm'
                    ? [1,2,3,4,5,6,7,8].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)
                    : [1,2,3,4].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)
                  }
                </select>
              </div>
              {course === 'MBA' && (
                <div>
                  <label style={modalLabelStyle}>Specialization *</label>
                  <select value={specialization} onChange={e => setSpecialization(e.target.value)} style={modalInputStyle}>
                    <option value="Core Management">Core Management</option>
                    <option value="Human Resources">Human Resources (HR)</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Operations">Operations</option>
                    <option value="International Business">International Business</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Subject Name *</label>
              <input type="text" required value={subjectName} onChange={e => setSubjectName(e.target.value)} style={modalInputStyle} />
            </div>
            <div>
              <label style={modalLabelStyle}>Subject Code</label>
              <input type="text" value={subjectCode} onChange={e => setSubjectCode(e.target.value)} style={modalInputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Academic Year *</label>
              <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={modalInputStyle}>
                {ACADEMIC_YEARS.map(ay => <option key={ay} value={ay}>{ay}</option>)}
              </select>
            </div>
            <div>
              <label style={modalLabelStyle}>Exam Type *</label>
              <select value={examType} onChange={e => setExamType(e.target.value)} style={modalInputStyle}>
                <option value="End Semester">End Semester</option>
                <option value="Mid Semester">Mid Semester</option>
                <option value="Internal">Internal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* RESOURCE TYPE RADIO SELECTION */}
          <div>
            <label style={modalLabelStyle}>Resource Type *</label>
            <div style={{ display: 'flex', gap: '1.25rem', backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem', color: resourceType === 'pdf' ? '#1F2421' : '#475569' }}>
                <input
                  type="radio"
                  name="editResourceType"
                  value="pdf"
                  checked={resourceType === 'pdf'}
                  onChange={() => setResourceType('pdf')}
                  style={{ accentColor: '#1F2421' }}
                />
                Upload PDF File
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem', color: resourceType === 'url' ? '#0284c7' : '#475569' }}>
                <input
                  type="radio"
                  name="editResourceType"
                  value="url"
                  checked={resourceType === 'url'}
                  onChange={() => setResourceType('url')}
                  style={{ accentColor: '#0284c7' }}
                />
                External PDF URL
              </label>
            </div>
          </div>

          {resourceType === 'pdf' ? (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Current File: <span style={{ color: '#0284c7' }}>{fileName || pdfUrl}</span>
              </div>
              {pdfUrl && (
                <button
                  type="button"
                  onClick={() => window.open(pdfUrl, '_blank', 'noopener,noreferrer')}
                  style={{ backgroundColor: '#FDF6E8', color: '#C88D2D', border: '1px solid #E8D3B0', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', marginBottom: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Eye size={13} /> Preview Stored File
                </button>
              )}
              
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.65rem', marginTop: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                  Replace PDF (Optional):
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleReplacementFileChange}
                  style={{ fontSize: '0.8rem', color: '#475569' }}
                />
              </div>
            </div>
          ) : (
            <div>
              <label style={modalLabelStyle}>Current PDF URL *</label>
              <input
                type="url"
                required
                value={pdfUrl}
                onChange={e => setPdfUrl(e.target.value)}
                style={modalInputStyle}
                placeholder="https://example.com/paper.pdf"
              />
            </div>
          )}

          {/* PUBLISHED SWITCH */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FDF6E8', border: '1px solid #E8D3B0', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1F2421' }}>Publish Status</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', color: published ? '#C88D2D' : '#ef4444' }}>
              <input
                type="checkbox"
                checked={published}
                onChange={e => { setPublished(e.target.checked); publishedChangedRef.current = true; }}
                style={{ width: '16px', height: '16px', accentColor: '#C88D2D' }}
              />
              {published ? 'Published (Visible publicly)' : 'Draft / Unpublished'}
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={uploading}
            style={{ backgroundColor: '#0284c7', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 900, borderRadius: '10px' }}
          >
            {uploading ? 'Replacing PDF...' : 'Update Question Paper Record'}
          </button>
        </form>
      </div>
    </div>
  );
}

// REPLACE PDF MODAL
function AdminReplacePdfModal({ pyq, onClose, onSaved }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleReplace = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a new PDF file to upload.');
      return;
    }

    const token = getAdminToken();
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    setUploading(true);

    try {
      const res = await fetch(`/api/admin/pyqs/${pyq.id}/replace-pdf`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      setUploading(false);

      if (data.success) {
        alert('PDF replaced successfully!');
        if (onSaved) onSaved();
        onClose();
      } else {
        alert(data.message || 'Error replacing PDF file.');
      }
    } catch (err) {
      setUploading(false);
      alert('Network error replacing PDF.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
          Replace Question Paper PDF
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
          Subject: <b>{pyq.subjectName || pyq.subject}</b> ({pyq.academicYear || pyq.examYear})
        </p>

        <form onSubmit={handleReplace} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <input
            type="file"
            accept=".pdf"
            required
            onChange={e => setSelectedFile(e.target.files[0])}
            style={{ fontSize: '0.84rem', color: '#0f172a' }}
          />

          <button
            type="submit"
            disabled={uploading}
            className="btn-primary"
            style={{ backgroundColor: '#ea580c', padding: '0.65rem', fontWeight: 800, marginTop: '0.5rem' }}
          >
            {uploading ? 'Uploading New PDF...' : 'Upload & Replace PDF'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ADD SUBJECT MODAL
function AdminAddSubjectModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [branchId, setBranchId] = useState('CSE');
  const [year, setYear] = useState('Year 1');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    const token = getAdminToken();

    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, code, branchId, year })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onCreated) onCreated();
        onClose();
      }
    } catch (err) {
      alert('Error adding subject.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>
          + Add New Subject
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={modalLabelStyle}>Subject Name *</label>
            <input type="text" required placeholder="e.g. Distributed Systems" value={name} onChange={e => setName(e.target.value)} style={modalInputStyle} />
          </div>

          <div>
            <label style={modalLabelStyle}>Subject Code</label>
            <input type="text" placeholder="e.g. KCS-701" value={code} onChange={e => setCode(e.target.value)} style={modalInputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Branch *</label>
              <select value={branchId} onChange={e => setBranchId(e.target.value)} style={modalInputStyle}>
                <option value="ALL">ALL Branches (Year 1 Common)</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="IT">IT</option>
                <option value="EE">EE</option>
                <option value="AI & ML">AI & ML</option>
                <option value="DS">DS</option>
              </select>
            </div>
            <div>
              <label style={modalLabelStyle}>B.Tech Year *</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={modalInputStyle}>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ backgroundColor: '#1F2421', padding: '0.65rem', fontWeight: 800, marginTop: '0.5rem' }}>
            Add Subject to Database
          </button>
        </form>
      </div>
    </div>
  );
}

// ADD USER MODAL
function AdminAddUserModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAdminToken();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, email, branch, password })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onCreated) onCreated();
        onClose();
      }
    } catch (err) {
      alert('Error creating user.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Add User Account</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={modalLabelStyle}>Full Name</label>
            <input type="text" required placeholder="Student Name" value={name} onChange={e => setName(e.target.value)} style={modalInputStyle} />
          </div>
          <div>
            <label style={modalLabelStyle}>Email Address</label>
            <input type="email" required placeholder="student@example.com" value={email} onChange={e => setEmail(e.target.value)} style={modalInputStyle} />
          </div>
          <div>
            <label style={modalLabelStyle}>Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)} style={modalInputStyle}>
              <option>CSE</option><option>ECE</option><option>ME</option><option>CE</option><option>IT</option><option>EE</option><option>AI & ML</option><option>DS</option>
            </select>
          </div>
          <div>
            <label style={modalLabelStyle}>Initial Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={modalInputStyle} />
          </div>
          <button type="submit" className="btn-primary" style={{ backgroundColor: '#1F2421', padding: '0.65rem' }}>Create User Account</button>
        </form>
      </div>
    </div>
  );
}

// STYLING CONSTANTS & HELPERS
const pyqStatCardStyle = {
  backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
};

const pyqSelectFilterStyle = {
  border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.45rem 0.65rem',
  fontSize: '0.82rem', backgroundColor: '#ffffff', color: '#0f172a', outline: 'none', fontWeight: 700
};

const actionIconBtnStyle = (color, bg) => ({
  backgroundColor: bg, color: color, border: 'none', borderRadius: '6px',
  padding: '0.3rem 0.6rem', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
});

const kpiCardStyle = {
  backgroundColor: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', padding: '1.15rem',
  boxShadow: '0 4px 14px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'all 0.2s ease'
};

const kpiLabelStyle = { fontSize: '0.78rem', fontWeight: 700, color: '#64748b' };
const kpiValueStyle = { fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginTop: '0.1rem' };
const kpiSubStyle = { fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' };
const panelCardStyle = { backgroundColor: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' };

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
  zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
};

const modalContentStyle = {
  backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '480px', width: '100%', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
};

const modalCloseBtnStyle = {
  position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
};

const modalLabelStyle = { fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.25rem', display: 'block' };
const modalInputStyle = { width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.55rem 0.75rem', fontSize: '0.85rem', backgroundColor: '#f8fafc', outline: 'none', color: '#0f172a', fontWeight: 500 };

// ADMIN MANAGE NOTE MODAL (URL INPUT / REAL PDF FILE UPLOAD FOR 4 NOTE SOURCES)
function AdminManageNoteModal({ note, initialData, onClose, onSaved }) {
  const [course, setCourse] = useState(note?.course || initialData?.course || 'B.Tech');
  const [semester, setSemester] = useState(note?.semester || initialData?.semester || 'Semester 1');
  const [specialization, setSpecialization] = useState(note?.specialization || initialData?.specialization || 'Core Management');
  const [branch, setBranch] = useState(note?.branch || note?.branchId || initialData?.branch || 'CSE');
  const [year, setYear] = useState(note?.year || initialData?.year || 'Year 1');
  const [subjectName, setSubjectName] = useState(note?.subjectName || note?.subject || initialData?.subjectName || 'Engineering Mathematics-I');
  const [subjectCode, setSubjectCode] = useState(note?.subjectCode || initialData?.subjectCode || '');
  const [unitNumber, setUnitNumber] = useState(note?.unitNumber || note?.unit || initialData?.unitNumber || 1);
  const standardKnownSources = ['gateway_classes', 'quantum', 'bitwise_learning', 'multi_atom', 'NotesGallery', 'Handwritten Notes'];
  const initSource = note?.source || initialData?.source || 'gateway_classes';
  const isInitiallyCustom = !standardKnownSources.some(s => s.toLowerCase() === initSource.toLowerCase());
  const [sourceSelect, setSourceSelect] = useState(isInitiallyCustom ? 'custom' : initSource);
  const [customSource, setCustomSource] = useState(isInitiallyCustom ? initSource : '');
  const [resourceType, setResourceType] = useState(initialData?.resourceType || (note?.fileUrl ? 'pdf' : 'url'));
  const [url, setUrl] = useState(note?.url || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [available, setAvailable] = useState(note?.available !== false);
  const [published, setPublished] = useState(note?.published !== false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = getAdminToken();

    if (!token) {
      alert('Session expired or missing authentication token. Please log in again.');
      setSaving(false);
      return;
    }

    let finalFileUrl = note?.fileUrl || note?.pdfUrl || null;
    let finalFileName = note?.fileName || null;

    if (resourceType === 'pdf' && selectedFile) {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('file', selectedFile);

      try {
        const uploadRes = await fetch('/api/admin/notes/upload-pdf', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.status === 401 || (uploadData.message && uploadData.message.includes('Session expired'))) {
          localStorage.removeItem('admin_token');
          sessionStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          sessionStorage.removeItem('admin_user');
          alert('Session expired or invalid. Please log in again.');
          setSaving(false);
          return;
        }

        if (uploadRes.ok && uploadData.success && (uploadData.pdfUrl || uploadData.fileUrl)) {
          finalFileUrl = uploadData.pdfUrl || uploadData.fileUrl;
          finalFileName = uploadData.fileName || selectedFile.name;
        } else {
          alert(uploadData.message || 'File upload failed. Please try again.');
          setSaving(false);
          return;
        }
      } catch (err) {
        console.error('Notes PDF upload error:', err);
        alert('Upload failed: Unable to connect to backend server. Please verify backend is running on port 5000.');
        setSaving(false);
        return;
      }
    }

    const finalSourceName = sourceSelect === 'custom' ? (customSource.trim() || 'Custom Notes') : sourceSelect;
    const finalSourceKey = finalSourceName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const payload = {
      id: note?.id,
      course,
      semester: course !== 'B.Tech' ? semester : '',
      specialization: course === 'MBA' ? specialization : '',
      branchId: branch,
      branch: branch,
      year: course === 'B.Tech' ? year : semester,
      subjectName: subjectName,
      subject: subjectName,
      subjectCode: subjectCode,
      unitNumber: (unitNumber === 'all' || unitNumber === 'All' || unitNumber === null || unitNumber === undefined || unitNumber === 0) ? null : Number(unitNumber),
      unit: (unitNumber === 'all' || unitNumber === 'All' || unitNumber === null || unitNumber === undefined || unitNumber === 0) ? null : Number(unitNumber),
      source: finalSourceName,
      sourceKey: finalSourceKey,
      resourceType: resourceType,
      url: resourceType === 'url' ? url : (finalFileUrl || url || ''),
      pdfUrl: finalFileUrl || (resourceType === 'url' ? url : ''),
      fileUrl: finalFileUrl || (resourceType === 'url' ? url : ''),
      fileName: finalFileName || (resourceType === 'url' ? 'External Note URL' : 'Notes.pdf'),
      available: available,
      published: published,
      status: published ? 'published' : 'unpublished'
    };

    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSaving(false);

      if (res.status === 401 || (data.message && data.message.includes('Session expired'))) {
        localStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_user');
        alert('Session expired or invalid. Please log in again.');
        return;
      }

      if (res.ok && data.success) {
        alert(data.message || 'Note resource saved successfully!');
        if (onSaved) onSaved();
        onClose();
      } else {
        alert(data.message || 'Failed to save note resource.');
      }
    } catch (err) {
      console.error('Error saving note resource:', err);
      setSaving(false);
      alert('Error saving note resource. Please check server logs.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, maxWidth: '540px' }}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>
          {note ? 'Edit Note Resource' : 'Add / Configure Note Resource'}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Changes will immediately sync to the public student website.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Course Selector */}
          <div>
            <label style={modalLabelStyle}>Course *</label>
            <select value={course} onChange={e => setCourse(e.target.value)} style={modalInputStyle}>
              <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
              <option value="BTechBiotechnology">B.Tech Biotechnology</option>
              <option value="BTechAgriculture">B.Tech Agriculture</option>
              <option value="BTechLateral">B.Tech Lateral Entry</option>
              <option value="MCA">MCA (Master of Computer Applications)</option>
              <option value="MBA">MBA (Master of Business Administration)</option>
              <option value="B.Pharm">B.Pharm (Bachelor of Pharmacy)</option>
            </select>
          </div>

          {/* Conditional: Branch & Year vs Semester / Specialization */}
          {(course === 'B.Tech' || course === 'BTechBiotechnology' || course === 'BTechAgriculture' || course === 'BTechLateral') ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={modalLabelStyle}>Branch / Stream *</label>
                <select value={branch} onChange={e => setBranch(e.target.value)} style={modalInputStyle}>
                  {course === 'BTechBiotechnology' && <option value="Biotechnology">Biotechnology</option>}
                  {course === 'BTechAgriculture' && <option value="Agriculture">Agriculture</option>}
                  {course === 'BTechLateral' && (
                    <>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                      <option value="IT">IT</option>
                      <option value="EE">EE</option>
                    </>
                  )}
                  {course === 'B.Tech' && (
                    <>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                      <option value="IT">IT</option>
                      <option value="EE">EE</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="DS">DS</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label style={modalLabelStyle}>Year *</label>
                <select value={year} onChange={e => setYear(e.target.value)} style={modalInputStyle}>
                  {course === 'BTechLateral' ? (
                    <>
                      <option value="Year 2">Year 2 (Sem 3-4)</option>
                      <option value="Year 3">Year 3 (Sem 5-6)</option>
                      <option value="Year 4">Year 4 (Sem 7-8)</option>
                    </>
                  ) : (
                    <>
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                      <option value="Year 3">Year 3</option>
                      <option value="Year 4">Year 4</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: course === 'MBA' ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
              <div>
                <label style={modalLabelStyle}>Semester *</label>
                <select value={semester} onChange={e => setSemester(e.target.value)} style={modalInputStyle}>
                  {course === 'B.Pharm'
                    ? [1,2,3,4,5,6,7,8].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)
                    : [1,2,3,4].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)
                  }
                </select>
              </div>

              {course === 'MBA' && (
                <div>
                  <label style={modalLabelStyle}>Specialization *</label>
                  <select value={specialization} onChange={e => setSpecialization(e.target.value)} style={modalInputStyle}>
                    <option value="Core Management">Core Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations & Supply Chain">Operations &amp; Supply Chain</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="International Business">International Business</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Subject Name *</label>
              <input type="text" required placeholder="e.g. Engineering Mathematics-I" value={subjectName} onChange={e => setSubjectName(e.target.value)} style={modalInputStyle} />
            </div>
            <div>
              <label style={modalLabelStyle}>Subject Code</label>
              <input type="text" placeholder="e.g. KAS-103T" value={subjectCode} onChange={e => setSubjectCode(e.target.value)} style={modalInputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={modalLabelStyle}>Unit / Scope *</label>
              <select 
                value={(unitNumber === null || unitNumber === undefined || unitNumber === 0 || unitNumber === 'all' || unitNumber === 'All') ? 'all' : unitNumber} 
                onChange={e => setUnitNumber(e.target.value === 'all' ? null : Number(e.target.value))} 
                style={modalInputStyle}
              >
                <option value="all">Complete Subject / All Units (Quantum)</option>
                <option value={1}>Unit 1</option>
                <option value={2}>Unit 2</option>
                <option value={3}>Unit 3</option>
                <option value={4}>Unit 4</option>
                <option value={5}>Unit 5</option>
              </select>
            </div>

            <div>
              <label style={modalLabelStyle}>Note Source *</label>
              <select
                value={sourceSelect}
                onChange={e => {
                  setSourceSelect(e.target.value);
                  if (e.target.value !== 'custom') setCustomSource('');
                }}
                style={modalInputStyle}
              >
                <option value="quantum">Quantum Notes</option>
                <option value="gateway_classes">Gateway Classes Notes</option>
                <option value="bitwise_learning">Bitwise Learning Notes</option>
                <option value="multi_atom">Multi Atom Notes</option>
                <option value="NotesGallery">NotesGallery</option>
                <option value="Handwritten Notes">Handwritten Notes</option>
                <option value="custom">+ Enter Custom Source...</option>
              </select>
              {sourceSelect === 'custom' && (
                <input
                  type="text"
                  required
                  placeholder="Enter source name (e.g. NotesGallery, KDC Notes)"
                  value={customSource}
                  onChange={e => setCustomSource(e.target.value)}
                  style={{ ...modalInputStyle, marginTop: '0.4rem' }}
                />
              )}
            </div>
          </div>

          <div>
            <label style={modalLabelStyle}>Resource Format</label>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.2rem' }}>
              <label style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                <input type="radio" name="resType" value="url" checked={resourceType === 'url'} onChange={() => setResourceType('url')} />
                External URL
              </label>
              <label style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                <input type="radio" name="resType" value="pdf" checked={resourceType === 'pdf'} onChange={() => setResourceType('pdf')} />
                Upload PDF File
              </label>
            </div>
          </div>

          {resourceType === 'url' ? (
            <div>
              <label style={modalLabelStyle}>Resource PDF / Web URL *</label>
              <input type="url" required placeholder="https://example.com/notes.pdf" value={url} onChange={e => setUrl(e.target.value)} style={modalInputStyle} />
            </div>
          ) : (
            <div>
              <label style={modalLabelStyle}>Upload PDF File {note?.fileUrl ? '(Leave blank to keep existing file)' : '*'}</label>
              <input type="file" accept=".pdf" required={!note?.fileUrl} onChange={e => setSelectedFile(e.target.files[0])} style={{ fontSize: '0.84rem' }} />
              {note?.fileUrl && (
                <div style={{ fontSize: '0.75rem', color: '#C88D2D', marginTop: '0.25rem' }}>
                  Current file: {note.fileName || note.fileUrl}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
              <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
              Available (Visible on public site)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
              <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
              Published
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ backgroundColor: '#1F2421', padding: '0.75rem', fontWeight: 800, marginTop: '0.75rem' }}
          >
            {saving ? 'Saving Note Resource...' : (note ? 'Update Note Resource' : 'Save Note Resource')}
          </button>
        </form>
      </div>
    </div>
  );
}

