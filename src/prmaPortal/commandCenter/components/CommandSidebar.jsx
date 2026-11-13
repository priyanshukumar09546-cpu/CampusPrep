import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bell,
  Activity,
  Users,
  UserCheck,
  UserX,
  Layers,
  FileText,
  FileCode,
  CheckSquare,
  Award,
  BarChart2,
  Briefcase,
  Building2,
  CalendarCheck,
  Shield,
  FolderGit2,
  ListTodo,
  FileCheck,
  UserSquare2,
  MessageSquare,
  Sparkles,
  Scroll,
  Trophy,
  UserPlus,
  Package,
  Boxes,
  Truck,
  CreditCard,
  DollarSign,
  Receipt,
  PieChart,
  Mail,
  Send,
  Radio,
  FileSpreadsheet,
  QrCode,
  TrendingUp,
  UserCog,
  KeyRound,
  Server,
  Cpu,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink
} from 'lucide-react';

export default function CommandSidebar({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  badges = {}
}) {
  // Collapsible category accordions state (all open by default for fast desktop navigation)
  const [openCategories, setOpenCategories] = useState({
    overview: true,
    internships: true,
    hr: true,
    projects: true,
    clients: true,
    events: false,
    inventory: false,
    finance: true,
    communications: false,
    documents: false,
    analytics: false,
    system: false
  });

  const toggleCategory = (catKey) => {
    setOpenCategories(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  const navGroups = [
    {
      key: 'overview',
      label: 'A. OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: badges.notifications },
        { id: 'audit-logs', label: 'Activity Logs', icon: Activity }
      ]
    },
    {
      key: 'internships',
      label: 'B. INTERNSHIP MANAGEMENT',
      items: [
        { id: 'applications', label: 'Applications', icon: Users, badge: badges.pendingApps, badgeColor: 'bg-amber-500' },
        { id: 'approved-interns', label: 'Approved Interns', icon: UserCheck, badge: badges.approvedInterns },
        { id: 'rejected-applications', label: 'Rejected Applications', icon: UserX },
        { id: 'internship-domains', label: 'Internship Domains', icon: Layers },
        { id: 'joining-letters', label: 'Joining Letters', icon: FileText },
        { id: 'problem-statements', label: 'Problem Statements', icon: FileCode },
        { id: 'weekly-submissions', label: 'Weekly Submissions', icon: CheckSquare, badge: badges.pendingSubmissions, badgeColor: 'bg-purple-500' },
        { id: 'evaluations', label: 'Evaluation & Feedback', icon: FileCheck },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'internship-analytics', label: 'Internship Analytics', icon: BarChart2 }
      ]
    },
    {
      key: 'hr',
      label: 'C. HUMAN RESOURCE MANAGEMENT',
      items: [
        { id: 'employees', label: 'Employees & Staff', icon: Briefcase, badge: badges.totalEmployees },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'attendance', label: 'Attendance Records', icon: CalendarCheck },
        { id: 'roles-permissions', label: 'Roles & Permissions', icon: Shield },
        { id: 'hr-documents', label: 'HR Documents', icon: FileText }
      ]
    },
    {
      key: 'projects',
      label: 'D. PROJECT MANAGEMENT',
      items: [
        { id: 'projects', label: 'All Projects', icon: FolderGit2, badge: badges.activeProjects },
        { id: 'tasks-milestones', label: 'Tasks & Milestones', icon: ListTodo },
        { id: 'project-reports', label: 'Project Reports', icon: FileCheck }
      ]
    },
    {
      key: 'clients',
      label: 'E. CLIENT & BUSINESS MANAGEMENT',
      items: [
        { id: 'clients', label: 'Client Directory', icon: UserSquare2 },
        { id: 'client-enquiries', label: 'Client Enquiries', icon: MessageSquare, badge: badges.pendingEnquiries, badgeColor: 'bg-blue-500' },
        { id: 'services', label: 'Services Management', icon: Sparkles },
        { id: 'proposals', label: 'Proposals & Contracts', icon: Scroll }
      ]
    },
    {
      key: 'events',
      label: 'F. EVENTS & COMMUNITY',
      items: [
        { id: 'hackathons', label: 'Hackathons & Events', icon: Trophy },
        { id: 'participants', label: 'Registrations', icon: UserPlus },
        { id: 'community', label: 'Community Management', icon: MessageSquare }
      ]
    },
    {
      key: 'inventory',
      label: 'G. INVENTORY & GOODIES',
      items: [
        { id: 'welcome-kits', label: 'Welcome Kits', icon: Package },
        { id: 'merchandise', label: 'Company Merchandise', icon: Boxes },
        { id: 'dispatch-records', label: 'Dispatch Records', icon: Truck }
      ]
    },
    {
      key: 'finance',
      label: 'H. FINANCE & ACCOUNTS',
      items: [
        { id: 'financial-dashboard', label: 'Financial Dashboard', icon: PieChart },
        { id: 'transactions', label: 'Transactions', icon: DollarSign },
        { id: 'invoices', label: 'Invoices & Billing', icon: Receipt },
        { id: 'financial-reports', label: 'Financial Reports', icon: FileSpreadsheet }
      ]
    },
    {
      key: 'communications',
      label: 'I. COMMUNICATION CENTER',
      items: [
        { id: 'email-center', label: 'Email Management', icon: Mail },
        { id: 'email-templates', label: 'Email Templates', icon: FileText },
        { id: 'email-logs', label: 'Delivery Logs', icon: Send },
        { id: 'announcements', label: 'Announcements', icon: Radio },
        { id: 'whatsapp', label: 'WhatsApp Community', icon: MessageSquare }
      ]
    },
    {
      key: 'documents',
      label: 'J. DOCUMENT MANAGEMENT',
      items: [
        { id: 'doc-studio', label: 'Document Studio', icon: FileText },
        { id: 'verification-records', label: 'Verification Records', icon: QrCode }
      ]
    },
    {
      key: 'analytics',
      label: 'K. ANALYTICS & REPORTS',
      items: [
        { id: 'company-analytics', label: 'Company Analytics', icon: TrendingUp }
      ]
    },
    {
      key: 'system',
      label: 'L. SYSTEM MANAGEMENT',
      items: [
        { id: 'admin-profile', label: 'Admin Profile', icon: UserCog },
        { id: 'security', label: 'Security & Permissions', icon: KeyRound },
        { id: 'system-health', label: 'System Health', icon: Server },
        { id: 'integrations', label: 'Integrations Hub', icon: Cpu },
        { id: 'general-settings', label: 'General Settings', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col bg-gradient-to-b from-[#57091E] via-[#680B24] to-[#400514] text-white border-r border-[#D4A63F]/25 shadow-2xl transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#780D29] to-[#D4A63F] p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-[#57091E] rounded-[10px] flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/prma_tech_logo.png"
                  alt="PRMA Tech"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 font-sans">
                  PRMA Tech
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D4A63F]/20 text-[#F2D78B] border border-[#D4A63F]/30 uppercase tracking-widest">
                    OS
                  </span>
                </span>
                <span className="text-[11px] font-medium text-amber-200/80 tracking-wide uppercase">
                  Command Center
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle / Mobile Close */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tagline Strip (Desktop Expanded Only) */}
        {!collapsed && (
          <div className="px-4 py-2 bg-[#D4A63F]/10 border-b border-[#D4A63F]/15 text-[11px] text-amber-200/90 font-medium tracking-wide flex items-center justify-between">
            <span>Build • Learn • Innovate • Grow</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
          </div>
        )}

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto prma-cc-sidebar py-3 px-2 space-y-4">
          {navGroups.map((grp) => {
            const isOpen = openCategories[grp.key] !== false;

            return (
              <div key={grp.key} className="space-y-1">
                {/* Category Header */}
                {!collapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleCategory(grp.key)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-amber-200/60 hover:text-amber-200 rounded transition-colors"
                  >
                    <span>{grp.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? '' : '-rotate-90 text-white/40'}`} />
                  </button>
                ) : (
                  <div className="h-2 border-t border-white/10 mx-2 my-1" />
                )}

                {/* Items */}
                {(isOpen || collapsed) && (
                  <div className="space-y-0.5">
                    {grp.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onSelectTab(item.id);
                            if (window.innerWidth < 1024) onCloseMobile();
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative group ${
                            isActive
                              ? 'bg-gradient-to-r from-[#D4A63F] to-[#B88B2A] text-slate-950 font-bold shadow-md shadow-black/20'
                              : 'text-slate-200 hover:text-white hover:bg-white/10'
                          } ${collapsed ? 'justify-center px-0' : ''}`}
                          title={collapsed ? item.label : undefined}
                        >
                          {/* Active Indicator Bar on left */}
                          {isActive && !collapsed && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#57091E] rounded-r-full" />
                          )}

                          <Icon
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${
                              isActive ? 'text-slate-950 scale-110' : 'text-amber-200/80 group-hover:scale-105'
                            }`}
                            strokeWidth={isActive ? 2.5 : 2}
                          />

                          {!collapsed && (
                            <span className="truncate flex-1 text-left">{item.label}</span>
                          )}

                          {/* Optional Badge */}
                          {!collapsed && item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full text-white shadow-xs ${
                                item.badgeColor || 'bg-[#780D29]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Admin Chip */}
        <div className="p-3 border-t border-white/10 bg-black/30">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A63F] to-[#780D29] flex items-center justify-center font-extrabold text-white text-xs shadow-sm flex-shrink-0">
                P
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">Priyanshu Kumar</span>
                <span className="text-[10px] text-amber-200/80 uppercase tracking-wider font-semibold">
                  Founder &amp; Authorized
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-[#D4A63F] text-slate-950 font-extrabold text-xs flex items-center justify-center">
                P
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
