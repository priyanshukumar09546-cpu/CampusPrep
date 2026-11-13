/**
 * PRMA TECH COMMAND CENTER — ENTERPRISE OPERATING SYSTEM
 * Complete production-ready company management dashboard for:
 * - Executive Overview & Real KPI Telemetry
 * - Internship Management & 12-Step Automated Approval Engine
 * - Weekly Task Milestone Evaluation & Mentor Review
 * - Human Resources, Employee Directory, Departments & Attendance
 * - Project Management (Kanban & Table Views)
 * - Corporate Clients & Inbound Business Enquiries
 * - Events & Hackathons
 * - Goodies, Welcome Kits & Courier Dispatches
 * - Finance, Ledger Transactions & Client Invoices
 * - Transactional Email Dispatch, Delivery Logs & Announcements
 * - Document Studio, Certificates & Scannable QR Verification
 * - System Health Diagnostics, Database Ping & Integrations Hub
 */

import React, { useState, useEffect, useCallback } from 'react';
import '../commandCenter/styles/PrmaCommandCenter.css';

// Master Command Center Components
import CommandSidebar from '../commandCenter/components/CommandSidebar';
import CommandHeader from '../commandCenter/components/CommandHeader';

// Section Views
import OverviewDashboard from '../commandCenter/sections/OverviewDashboard';
import InternshipSection from '../commandCenter/sections/InternshipSection';
import WeeklySubmissionsSection from '../commandCenter/sections/WeeklySubmissionsSection';
import HumanResourcesSection from '../commandCenter/sections/HumanResourcesSection';
import ProjectsSection from '../commandCenter/sections/ProjectsSection';
import ClientsSection from '../commandCenter/sections/ClientsSection';
import EventsSection from '../commandCenter/sections/EventsSection';
import InventorySection from '../commandCenter/sections/InventorySection';
import FinanceSection from '../commandCenter/sections/FinanceSection';
import CommunicationsSection from '../commandCenter/sections/CommunicationsSection';
import SystemManagementSection from '../commandCenter/sections/SystemManagementSection';

// Interactive Modals
import {
  ApplicationDossierModal,
  ShortlistModal,
  SubmissionReviewModal,
  AddEmployeeModal,
  RecordTransactionModal,
  IssueCertificateModal,
  TestSmtpModal
} from '../commandCenter/modals/CommandCenterModals';

export default function PrmaAdminPanel({ onNavigate, navigateToTab }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Primary Data Stores
  const [commandStats, setCommandStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [domains, setDomains] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [events, setEvents] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Active Modals State
  const [dossierModalApp, setDossierModalApp] = useState(null);
  const [shortlistModalApp, setShortlistModalApp] = useState(null);
  const [reviewModalData, setReviewModalData] = useState({ submission: null, task: null });
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showRecordTxModal, setShowRecordTxModal] = useState(false);
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [showTestSmtpModal, setShowTestSmtpModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);

  // -------------------------------------------------------------------------
  // 1. DATA SYNCHRONIZATION FROM REAL BACKEND ENDPOINTS
  // -------------------------------------------------------------------------
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Command Stats
      const statsRes = await fetch('/api/prma/admin/command-stats').catch(() => null);
      if (statsRes?.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setCommandStats(statsData);
      }

      // 2. Applications
      const appsRes = await fetch('/api/prma/admin/applications').catch(() => null);
      if (appsRes?.ok) {
        const appsData = await appsRes.json();
        if (appsData.success && Array.isArray(appsData.applications)) {
          setApplications(appsData.applications);
        }
      }

      // 3. Submissions
      const subsRes = await fetch('/api/prma/admin/submissions').catch(() => null);
      if (subsRes?.ok) {
        const subsData = await subsRes.json();
        if (subsData.success && Array.isArray(subsData.submissions)) {
          setSubmissions(subsData.submissions);
        }
      }

      // 4. Domains
      const domsRes = await fetch('/api/prma/domains').catch(() => null);
      if (domsRes?.ok) {
        const domsData = await domsRes.json();
        if (domsData.success && Array.isArray(domsData.domains)) {
          setDomains(domsData.domains);
        }
      }

      // 5. Employees & Departments
      const empRes = await fetch('/api/prma/admin/employees').catch(() => null);
      if (empRes?.ok) {
        const empData = await empRes.json();
        if (empData.success && Array.isArray(empData.employees)) {
          setEmployees(empData.employees);
        }
      }

      const deptRes = await fetch('/api/prma/admin/departments').catch(() => null);
      if (deptRes?.ok) {
        const deptData = await deptRes.json();
        if (deptData.success && Array.isArray(deptData.departments)) {
          setDepartments(deptData.departments);
        }
      }

      // 6. Attendance
      const attRes = await fetch('/api/prma/admin/attendance').catch(() => null);
      if (attRes?.ok) {
        const attData = await attRes.json();
        if (attData.success && Array.isArray(attData.attendance)) {
          setAttendance(attData.attendance);
        }
      }

      // 7. Projects
      const prjRes = await fetch('/api/prma/admin/projects').catch(() => null);
      if (prjRes?.ok) {
        const prjData = await prjRes.json();
        if (prjData.success && Array.isArray(prjData.projects)) {
          setProjects(prjData.projects);
        }
      }

      // 8. Clients & Enquiries
      const cliRes = await fetch('/api/prma/admin/clients').catch(() => null);
      if (cliRes?.ok) {
        const cliData = await cliRes.json();
        if (cliData.success && Array.isArray(cliData.clients)) {
          setClients(cliData.clients);
        }
      }

      const enqRes = await fetch('/api/prma/admin/enquiries').catch(() => null);
      if (enqRes?.ok) {
        const enqData = await enqRes.json();
        if (enqData.success && Array.isArray(enqData.enquiries)) {
          setEnquiries(enqData.enquiries);
        }
      }

      // 9. Events
      const evtRes = await fetch('/api/prma/admin/events').catch(() => null);
      if (evtRes?.ok) {
        const evtData = await evtRes.json();
        if (evtData.success && Array.isArray(evtData.events)) {
          setEvents(evtData.events);
        }
      }

      // 10. Inventory & Dispatches
      const invRes = await fetch('/api/prma/admin/inventory').catch(() => null);
      if (invRes?.ok) {
        const invData = await invRes.json();
        if (invData.success && Array.isArray(invData.inventory)) {
          setInventory(invData.inventory);
        }
      }

      const dspRes = await fetch('/api/prma/admin/dispatches').catch(() => null);
      if (dspRes?.ok) {
        const dspData = await dspRes.json();
        if (dspData.success && Array.isArray(dspData.dispatches)) {
          setDispatches(dspData.dispatches);
        }
      }

      // 11. Transactions & Invoices
      const txRes = await fetch('/api/prma/admin/transactions').catch(() => null);
      if (txRes?.ok) {
        const txData = await txRes.json();
        if (txData.success && Array.isArray(txData.transactions)) {
          setTransactions(txData.transactions);
        }
      }

      const invcRes = await fetch('/api/prma/admin/invoices').catch(() => null);
      if (invcRes?.ok) {
        const invcData = await invcRes.json();
        if (invcData.success && Array.isArray(invcData.invoices)) {
          setInvoices(invcData.invoices);
        }
      }

      // 12. Certificates & Emails
      const certRes = await fetch('/api/prma/admin/certificates').catch(() => null);
      if (certRes?.ok) {
        const certData = await certRes.json();
        if (certData.success && Array.isArray(certData.certificates)) {
          setCertificates(certData.certificates);
        }
      }

      const mailRes = await fetch('/api/prma/admin/emails').catch(() => null);
      if (mailRes?.ok) {
        const mailData = await mailRes.json();
        if (mailData.success && Array.isArray(mailData.emails)) {
          setEmailLogs(mailData.emails);
        }
      }

      // 13. Announcements & Audit Logs
      const annRes = await fetch('/api/prma/admin/announcements').catch(() => null);
      if (annRes?.ok) {
        const annData = await annRes.json();
        if (annData.success && Array.isArray(annData.announcements)) {
          setAnnouncements(annData.announcements);
        }
      }

      const auditRes = await fetch('/api/prma/admin/audit-logs').catch(() => null);
      if (auditRes?.ok) {
        const auditData = await auditRes.json();
        if (auditData.success && Array.isArray(auditData.logs)) {
          setAuditLogs(auditData.logs);
        }
      }
    } catch (err) {
      console.warn('[COMMAND CENTER] Initialization notice:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Compute Notifications from actual events
  useEffect(() => {
    const list = [];
    const pendingApps = applications.filter(a => a.status === 'submitted' || a.status === 'under_review');
    if (pendingApps.length > 0) {
      list.push({
        id: 'notif-apps',
        title: `${pendingApps.length} Internship Applications Pending Review`,
        subtitle: 'Review candidate dossiers and verify social proof',
        timestamp: new Date().toISOString(),
        read: false
      });
    }

    const pendingDeliverables = [];
    submissions.forEach(s => {
      (s.tasks || []).forEach(t => {
        if (t.status === 'submitted' && (t.reviewStatus === 'under_review' || t.reviewStatus === 'pending')) {
          pendingDeliverables.push(t);
        }
      });
    });

    if (pendingDeliverables.length > 0) {
      list.push({
        id: 'notif-subs',
        title: `${pendingDeliverables.length} Student Deliverables Awaiting Evaluation`,
        subtitle: 'Inspect GitHub repositories and assign marks',
        timestamp: new Date().toISOString(),
        read: false
      });
    }

    const newEnqs = enquiries.filter(e => e.status === 'New');
    if (newEnqs.length > 0) {
      list.push({
        id: 'notif-enq',
        title: `${newEnqs.length} New Inbound Client Business Enquiries`,
        subtitle: 'Follow up on software service proposals',
        timestamp: new Date().toISOString(),
        read: false
      });
    }

    setNotifications(list);
  }, [applications, submissions, enquiries]);

  // -------------------------------------------------------------------------
  // 2. ACTION HANDLERS (ALL EXECUTING REAL BACKEND ENDPOINTS)
  // -------------------------------------------------------------------------

  // 12-Step Automated Approval
  const handleConfirmApproval = async (applicationId, joiningDate, duration) => {
    setIsProcessingApproval(true);
    try {
      const res = await fetch(`/api/prma/admin/applications/${applicationId}/shortlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joiningDate, duration })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to approve application');
      }

      alert(`✓ Application approved! Official Joining Letter & 10-page Problem Statement generated and email dispatched.`);
      setShortlistModalApp(null);
      setDossierModalApp(null);
      fetchAllData();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setIsProcessingApproval(false);
    }
  };

  // Reject Application
  const handleRejectApplication = async (app) => {
    const reason = prompt(`Enter rejection reason for ${app.student?.fullName || 'Candidate'}:`, 'Qualifications or domain criteria not matching current batch requirements.');
    if (!reason) return;

    try {
      const res = await fetch(`/api/prma/admin/applications/${app.applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Rejection failed');

      alert(`Application marked as Rejected.`);
      setDossierModalApp(null);
      fetchAllData();
    } catch (err) {
      alert(`Error rejecting application: ${err.message}`);
    }
  };

  // Save Remarks
  const handleSaveRemarks = async (applicationId, notes) => {
    const res = await fetch(`/api/prma/admin/applications/${applicationId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save remarks');
    fetchAllData();
  };

  // Submit Milestone Review
  const handleSubmitTaskReview = async (submissionToken, weekNumber, status, feedback) => {
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/prma/admin/submissions/${submissionToken}/review/${weekNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Review submission failed');

      alert(`✓ Week ${weekNumber} evaluation recorded as "${status}". Feedback email dispatched to student.`);
      setReviewModalData({ submission: null, task: null });
      fetchAllData();
    } catch (err) {
      alert(`Review Error: ${err.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Add Employee
  const handleAddEmployee = async (empData) => {
    const res = await fetch('/api/prma/admin/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create employee');
    fetchAllData();
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to remove this employee record?')) return;
    try {
      await fetch(`/api/prma/admin/employees/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  // Add Project
  const handleAddProject = async (prjData) => {
    const res = await fetch('/api/prma/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prjData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create project');
    fetchAllData();
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await fetch(`/api/prma/admin/projects/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  // Add Client
  const handleAddClient = async (cliData) => {
    const res = await fetch('/api/prma/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add client');
    fetchAllData();
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Remove this client?')) return;
    try {
      await fetch(`/api/prma/admin/clients/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      await fetch(`/api/prma/admin/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchAllData();
    } catch (e) {
      alert('Update failed: ' + e.message);
    }
  };

  // Record Transaction
  const handleRecordTransaction = async (txData) => {
    const res = await fetch('/api/prma/admin/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to record transaction');
    fetchAllData();
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Remove transaction record?')) return;
    try {
      await fetch(`/api/prma/admin/transactions/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  // Issue Certificate
  const handleIssueCertificate = async (offerId) => {
    const res = await fetch('/api/prma/admin/certificates/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Certificate issuance rejected');
    alert(data.message || 'Certificate issued successfully!');
    fetchAllData();
  };

  // Test SMTP
  const handleTestSmtp = async (recipient) => {
    const res = await fetch('/api/prma/admin/test-smtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testRecipient: recipient })
    });
    return await res.json();
  };

  // Quick Action Dispatcher
  const handleQuickAction = (actionKey) => {
    if (actionKey === 'add-employee') setShowAddEmployeeModal(true);
    if (actionKey === 'add-project') {
      const title = prompt('Enter Project Title:');
      if (title) handleAddProject({ title, status: 'PLANNING' });
    }
    if (actionKey === 'record-transaction') setShowRecordTxModal(true);
    if (actionKey === 'add-domain') setActiveTab('internship-domains');
    if (actionKey === 'post-announcement') {
      const title = prompt('Announcement Title:');
      const message = title ? prompt('Announcement Body Message:') : null;
      if (title && message) {
        fetch('/api/prma/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, message, targetAudience: 'All Interns' })
        }).then(() => fetchAllData());
      }
    }
  };

  // Map activeTab to human-readable breadcrumb
  const getTabTitle = () => {
    const map = {
      dashboard: 'Executive Command Center',
      notifications: 'Notifications & Alerts',
      'audit-logs': 'Immutable Activity Trail',
      applications: 'Internship Applications',
      'approved-interns': 'Approved & Active Interns',
      'rejected-applications': 'Rejected Applications',
      'internship-domains': 'Internship Program Tracks',
      'joining-letters': 'Institutional Joining Letters',
      'problem-statements': '10-Page Problem Statements',
      'weekly-submissions': 'Weekly Submissions & Evaluation',
      evaluations: 'Evaluation Records',
      certificates: 'Completion Certificates',
      'internship-analytics': 'Internship Analytics',
      employees: 'Employees & Staff',
      departments: 'Department Management',
      attendance: 'Attendance Timesheet',
      'roles-permissions': 'Role-Based Access Control',
      'hr-documents': 'HR Documents',
      projects: 'Company Projects',
      'tasks-milestones': 'Tasks & Milestones',
      'project-reports': 'Project Reports',
      clients: 'Client Directory',
      'client-enquiries': 'Client Enquiries',
      services: 'Technology Services',
      proposals: 'Proposals & Agreements',
      hackathons: 'Hackathons & Technical Challenges',
      participants: 'Event Registrations',
      community: 'Community Management',
      'welcome-kits': 'Welcome Kits Hamper',
      merchandise: 'Company Merchandise',
      'dispatch-records': 'Shipment Tracking',
      'financial-dashboard': 'Financial Dashboard',
      transactions: 'General Ledger Transactions',
      invoices: 'Client Invoices',
      'financial-reports': 'Financial Statements',
      'email-center': 'Transactional Email Center',
      'email-templates': 'Institutional Email Templates',
      'email-logs': 'Delivery Logs',
      announcements: 'Broadcast Announcements',
      whatsapp: 'WhatsApp Community',
      'doc-studio': 'Document Studio',
      'verification-records': 'Verification Records',
      'company-analytics': 'Company Analytics & Export',
      'admin-profile': 'Admin Profile',
      security: 'Security & Session',
      'system-health': 'System & Database Health',
      integrations: 'Integrations Hub',
      'general-settings': 'General Platform Settings'
    };
    return map[activeTab] || 'Command Center';
  };

  // Badge counters for sidebar
  const pendingAppsCount = applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
  const approvedCount = applications.filter(a => a.status === 'shortlisted' || a.status === 'approved').length;
  let pendingSubsCount = 0;
  submissions.forEach(s => {
    (s.tasks || []).forEach(t => {
      if (t.status === 'submitted' && (t.reviewStatus === 'under_review' || t.reviewStatus === 'pending')) {
        pendingSubsCount++;
      }
    });
  });
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'New').length;

  return (
    <div className="prma-cc-root">
      {/* 1. Collapsible Burgundy Left Sidebar */}
      <CommandSidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        badges={{
          notifications: notifications.length,
          pendingApps: pendingAppsCount,
          approvedInterns: approvedCount,
          pendingSubmissions: pendingSubsCount,
          pendingEnquiries: pendingEnquiriesCount,
          totalEmployees: employees.length,
          activeProjects: projects.filter(p => p.status === 'ACTIVE').length
        }}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F7F5]">
        {/* Top Header */}
        <CommandHeader
          onOpenMobile={() => setMobileSidebarOpen(true)}
          activeTabTitle={getTabTitle()}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          notifications={notifications}
          onLogout={() => {
            if (window.confirm('Securely log out of PRMA Tech Command Center?')) {
              if (onNavigate) onNavigate('admin-login');
              else window.location.href = '/admin/login';
            }
          }}
          onOpenSettings={() => setActiveTab('general-settings')}
          onQuickAction={handleQuickAction}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {/* OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <OverviewDashboard
              stats={commandStats}
              applications={applications}
              submissions={submissions}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenModal={handleQuickAction}
            />
          )}

          {/* INTERNSHIP MANAGEMENT SECTIONS */}
          {(activeTab === 'applications' ||
            activeTab === 'approved-interns' ||
            activeTab === 'rejected-applications' ||
            activeTab === 'internship-domains' ||
            activeTab === 'joining-letters' ||
            activeTab === 'problem-statements' ||
            activeTab === 'certificates' ||
            activeTab === 'evaluations' ||
            activeTab === 'internship-analytics') && (
            <InternshipSection
              subTab={activeTab}
              applications={applications}
              domains={domains}
              certificates={certificates}
              loading={loading}
              onRefresh={fetchAllData}
              onSelectApplication={(app) => setDossierModalApp(app)}
              onShortlistModal={(app) => setShortlistModalApp(app)}
              onRejectModal={handleRejectApplication}
              onOpenAddDomain={() => handleQuickAction('add-domain')}
              onIssueCertificateModal={() => setShowIssueCertModal(true)}
            />
          )}

          {/* WEEKLY SUBMISSIONS MANAGEMENT */}
          {activeTab === 'weekly-submissions' && (
            <WeeklySubmissionsSection
              submissions={submissions}
              loading={loading}
              onRefresh={fetchAllData}
              onOpenReviewModal={(sub, task) => setReviewModalData({ submission: sub, task })}
              onOpenGformConfig={() => setActiveTab('integrations')}
            />
          )}

          {/* HUMAN RESOURCES MANAGEMENT */}
          {(activeTab === 'employees' ||
            activeTab === 'departments' ||
            activeTab === 'attendance' ||
            activeTab === 'roles-permissions' ||
            activeTab === 'hr-documents') && (
            <HumanResourcesSection
              subTab={activeTab}
              employees={employees}
              departments={departments}
              attendance={attendance}
              loading={loading}
              onRefresh={fetchAllData}
              onAddEmployeeModal={() => setShowAddEmployeeModal(true)}
              onEditEmployeeModal={(emp) => alert(`Editing for ${emp.fullName}`)}
              onDeleteEmployee={handleDeleteEmployee}
              onAddDepartmentModal={() => {
                const name = prompt('Department Name:');
                if (name) {
                  fetch('/api/prma/admin/departments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                  }).then(() => fetchAllData());
                }
              }}
              onMarkAttendanceModal={() => {
                const emp = employees[0];
                if (!emp) return alert('Add an employee first to record attendance.');
                fetch('/api/prma/admin/attendance', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    date: new Date().toISOString().split('T')[0],
                    employeeId: emp.employeeId,
                    employeeName: emp.fullName,
                    department: emp.department,
                    status: 'Present',
                    checkInTime: '09:30 AM',
                    checkOutTime: '06:30 PM'
                  })
                }).then(() => fetchAllData());
              }}
            />
          )}

          {/* PROJECT MANAGEMENT */}
          {(activeTab === 'projects' ||
            activeTab === 'tasks-milestones' ||
            activeTab === 'project-reports') && (
            <ProjectsSection
              subTab={activeTab}
              projects={projects}
              loading={loading}
              onRefresh={fetchAllData}
              onAddProjectModal={() => handleQuickAction('add-project')}
              onEditProjectModal={(p) => alert(`Edit ${p.title}`)}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {/* CLIENT & BUSINESS MANAGEMENT */}
          {(activeTab === 'clients' ||
            activeTab === 'client-enquiries' ||
            activeTab === 'services' ||
            activeTab === 'proposals') && (
            <ClientsSection
              subTab={activeTab}
              clients={clients}
              enquiries={enquiries}
              loading={loading}
              onRefresh={fetchAllData}
              onAddClientModal={() => {
                const companyName = prompt('Company Name:');
                const email = companyName ? prompt('Official Contact Email:') : null;
                if (companyName && email) handleAddClient({ companyName, email });
              }}
              onDeleteClient={handleDeleteClient}
              onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
              onDeleteEnquiry={async (id) => {
                await fetch(`/api/prma/admin/enquiries/${id}`, { method: 'DELETE' });
                fetchAllData();
              }}
            />
          )}

          {/* EVENTS & HACKATHONS */}
          {(activeTab === 'hackathons' ||
            activeTab === 'participants' ||
            activeTab === 'community') && (
            <EventsSection
              subTab={activeTab}
              events={events}
              registrations={[]}
              loading={loading}
              onRefresh={fetchAllData}
              onAddEventModal={() => {
                const title = prompt('Hackathon / Event Title:');
                const eventDate = title ? prompt('Event Date (YYYY-MM-DD):', '2026-12-15') : null;
                if (title && eventDate) {
                  fetch('/api/prma/admin/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, eventDate, prizePool: '₹25,000' })
                  }).then(() => fetchAllData());
                }
              }}
              onDeleteEvent={async (id) => {
                await fetch(`/api/prma/admin/events/${id}`, { method: 'DELETE' });
                fetchAllData();
              }}
            />
          )}

          {/* INVENTORY & GOODIES */}
          {(activeTab === 'welcome-kits' ||
            activeTab === 'merchandise' ||
            activeTab === 'dispatch-records') && (
            <InventorySection
              subTab={activeTab}
              inventory={inventory}
              dispatches={dispatches}
              loading={loading}
              onRefresh={fetchAllData}
              onAddInventoryModal={() => {
                const name = prompt('Product Name (e.g. PRMA Tech Hoodie):');
                const sku = name ? prompt('SKU (e.g. PRMA-HD-01):', `SKU-${Date.now().toString().slice(-4)}`) : null;
                if (name && sku) {
                  fetch('/api/prma/admin/inventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, sku, stockQuantity: 50, unitCost: 450 })
                  }).then(() => fetchAllData());
                }
              }}
              onDispatchModal={() => {
                const recipientName = prompt('Recipient Intern Name:');
                const recipientAddress = recipientName ? prompt('Complete Postal Delivery Address:') : null;
                if (recipientName && recipientAddress) {
                  fetch('/api/prma/admin/dispatches', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      recipientName,
                      recipientAddress,
                      courierName: 'BlueDart Air',
                      trackingNumber: `BD-${Date.now().toString().slice(-6)}`
                    })
                  }).then(() => fetchAllData());
                }
              }}
              onUpdateDispatchStatus={async (id, deliveryStatus) => {
                await fetch(`/api/prma/admin/dispatches/${id}/status`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ deliveryStatus })
                });
                fetchAllData();
              }}
              onDeleteInventoryItem={async (id) => {
                await fetch(`/api/prma/admin/inventory/${id}`, { method: 'DELETE' });
                fetchAllData();
              }}
            />
          )}

          {/* FINANCE & ACCOUNTS */}
          {(activeTab === 'financial-dashboard' ||
            activeTab === 'transactions' ||
            activeTab === 'invoices' ||
            activeTab === 'financial-reports') && (
            <FinanceSection
              subTab={activeTab}
              transactions={transactions}
              invoices={invoices}
              financeSummary={commandStats?.stats?.financialOverview || { totalIncome: 0, totalExpenses: 0, netBalance: 0 }}
              loading={loading}
              onRefresh={fetchAllData}
              onAddTransactionModal={() => setShowRecordTxModal(true)}
              onAddInvoiceModal={() => {
                const clientName = prompt('Client Name:');
                const clientEmail = clientName ? prompt('Client Email:') : null;
                if (clientName && clientEmail) {
                  fetch('/api/prma/admin/invoices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      clientName,
                      clientEmail,
                      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
                      items: [{ description: 'Corporate Software Engineering', quantity: 1, unitPrice: 35000, amount: 35000 }],
                      tax: 6300
                    })
                  }).then(() => fetchAllData());
                }
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {/* COMMUNICATIONS CENTER */}
          {(activeTab === 'email-center' ||
            activeTab === 'email-templates' ||
            activeTab === 'email-logs' ||
            activeTab === 'announcements' ||
            activeTab === 'whatsapp') && (
            <CommunicationsSection
              subTab={activeTab}
              emailLogs={emailLogs}
              announcements={announcements}
              loading={loading}
              onRefresh={fetchAllData}
              onOpenTestSmtpModal={() => setShowTestSmtpModal(true)}
              onAddAnnouncementModal={() => handleQuickAction('post-announcement')}
              onDeleteAnnouncement={async (id) => {
                await fetch(`/api/prma/admin/announcements/${id}`, { method: 'DELETE' });
                fetchAllData();
              }}
            />
          )}

          {/* SYSTEM MANAGEMENT & SETTINGS */}
          {(activeTab === 'notifications' ||
            activeTab === 'audit-logs' ||
            activeTab === 'system-health' ||
            activeTab === 'integrations' ||
            activeTab === 'admin-profile' ||
            activeTab === 'security' ||
            activeTab === 'general-settings' ||
            activeTab === 'doc-studio' ||
            activeTab === 'verification-records' ||
            activeTab === 'company-analytics') && (
            <SystemManagementSection
              subTab={activeTab}
              auditLogs={auditLogs}
              loading={loading}
              onRefresh={fetchAllData}
              onOpenTestSmtp={() => setShowTestSmtpModal(true)}
            />
          )}
        </main>
      </div>

      {/* =========================================================================
          INTERACTIVE MODALS
          ========================================================================= */}

      {/* 1. Candidate Application Dossier Modal */}
      {dossierModalApp && (
        <ApplicationDossierModal
          app={dossierModalApp}
          onClose={() => setDossierModalApp(null)}
          onShortlist={(app) => {
            setDossierModalApp(null);
            setShortlistModalApp(app);
          }}
          onReject={handleRejectApplication}
          onSaveRemarks={handleSaveRemarks}
        />
      )}

      {/* 2. Automated 12-Step Approval Modal */}
      {shortlistModalApp && (
        <ShortlistModal
          app={shortlistModalApp}
          onClose={() => setShortlistModalApp(null)}
          onConfirmApproval={handleConfirmApproval}
          isProcessing={isProcessingApproval}
        />
      )}

      {/* 3. Milestone Deliverables Evaluation Modal */}
      {reviewModalData.submission && reviewModalData.task && (
        <SubmissionReviewModal
          submission={reviewModalData.submission}
          task={reviewModalData.task}
          onClose={() => setReviewModalData({ submission: null, task: null })}
          onSubmitReview={handleSubmitTaskReview}
          isSubmitting={isSubmittingReview}
        />
      )}

      {/* 4. Add Employee Modal */}
      {showAddEmployeeModal && (
        <AddEmployeeModal
          onClose={() => setShowAddEmployeeModal(false)}
          onSubmit={handleAddEmployee}
          departments={departments}
        />
      )}

      {/* 5. Record Transaction Modal */}
      {showRecordTxModal && (
        <RecordTransactionModal
          onClose={() => setShowRecordTxModal(false)}
          onSubmit={handleRecordTransaction}
        />
      )}

      {/* 6. Issue Certificate Modal */}
      {showIssueCertModal && (
        <IssueCertificateModal
          onClose={() => setShowIssueCertModal(false)}
          onSubmit={handleIssueCertificate}
          applications={applications}
        />
      )}

      {/* 7. Live SMTP Connection Diagnostic Test */}
      {showTestSmtpModal && (
        <TestSmtpModal
          onClose={() => setShowTestSmtpModal(false)}
          onTestSmtp={handleTestSmtp}
        />
      )}
    </div>
  );
}
