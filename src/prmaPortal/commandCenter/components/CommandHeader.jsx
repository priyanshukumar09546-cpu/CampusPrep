import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  Clock,
  Sparkles,
  Plus,
  ShieldCheck,
  LogOut,
  Settings,
  ChevronDown,
  User,
  Activity,
  CheckCircle2,
  ExternalLink,
  Layers,
  Briefcase,
  DollarSign,
  Radio
} from 'lucide-react';

export default function CommandHeader({
  onOpenMobile,
  activeTabTitle,
  searchQuery,
  onSearchChange,
  notifications = [],
  onLogout,
  onOpenSettings,
  onQuickAction
}) {
  // Live Clock state (Indian Standard Time)
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const quickRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      };
      setCurrentDateTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setShowQuickActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#780D29] tracking-wider uppercase">
              PRMA Tech
            </span>
            <span className="text-slate-300 font-bold">/</span>
            <h1 className="text-sm lg:text-base font-extrabold text-slate-800 tracking-tight">
              {activeTabTitle || 'Command Center'}
            </h1>
          </div>

          {/* Live Indian Standard Time */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#D4A63F]" />
            <span>{currentDateTime || 'Connecting IST...'}</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-2">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search applications, interns, employees, projects, clients..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs font-medium text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#780D29]/20 focus:border-[#780D29] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Quick Actions, Notifications & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Actions Dropdown */}
        <div className="relative" ref={quickRef}>
          <button
            type="button"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="inline-flex items-center gap-1.5 px-3 py-1.8 bg-gradient-to-r from-[#780D29] to-[#57091E] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md border border-[#D4A63F]/30 transition-all"
          >
            <Plus className="w-4 h-4 text-[#D4A63F]" strokeWidth={2.5} />
            <span className="hidden sm:inline">Quick Action</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 prma-modal-anim">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Create New Record
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActions(false);
                  onQuickAction('add-employee');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#780D29] text-left transition-colors"
              >
                <Briefcase className="w-4 h-4 text-[#780D29]" />
                <span>Add Employee</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActions(false);
                  onQuickAction('add-project');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#780D29] text-left transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#D4A63F]" />
                <span>Create Project</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActions(false);
                  onQuickAction('record-transaction');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#780D29] text-left transition-colors"
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Record Transaction</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActions(false);
                  onQuickAction('add-domain');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#780D29] text-left transition-colors"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Add Internship Domain</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActions(false);
                  onQuickAction('post-announcement');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#780D29] text-left transition-colors"
              >
                <Radio className="w-4 h-4 text-purple-600" />
                <span>Post Announcement</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#780D29] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 prma-modal-anim">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Notifications &amp; Alerts
                </span>
                <span className="text-[11px] font-semibold text-[#780D29] bg-[#780D29]/10 px-2 py-0.5 rounded-full">
                  {notifications.length} Total
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div
                      key={idx}
                      className="p-3 hover:bg-slate-50 transition-colors text-left flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#780D29]/10 text-[#780D29] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1 truncate">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {notif.title}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {notif.message || notif.subtitle}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString() : 'Just now'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 font-medium">
                    No active notifications at this time.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#780D29] to-[#D4A63F] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              P
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-800 leading-none">Priyanshu Kumar</span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wide mt-0.5">SUPER ADMIN</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 prma-modal-anim">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#780D29] to-[#D4A63F] text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                  P
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-extrabold text-slate-900 truncate">Priyanshu Kumar</span>
                  <span className="text-[11px] text-slate-500 truncate">Founder &amp; Authorized</span>
                  <span className="text-[10px] font-bold text-[#780D29] mt-0.5 uppercase tracking-wider">PRMA Tech Command Center</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#780D29] transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Account &amp; Security Settings</span>
                </button>

                <a
                  href="/prma-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#780D29] transition-colors text-left"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>Open Public PRMA Portal</span>
                </a>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Secure Admin Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
