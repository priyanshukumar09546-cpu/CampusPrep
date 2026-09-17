import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
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
  Filter
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Real Admin Session State
  const [adminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : { name: 'Admin', email: 'admin@campusprep.edu', role: 'admin' };
    } catch {
      return { name: 'Admin', email: 'admin@campusprep.edu', role: 'admin' };
    }
  });

  const getAdminToken = () => {
    return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') || '';
  };

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

  // REAL DATABASE STATES (ZERO FAKE DATA)
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalContent: 0,
    totalNotes: 0,
    totalPYQs: 0,
    totalQuizzes: 0,
    openTickets: 0,
    pendingUploads: 0
  });

  const [latestUsers, setLatestUsers] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // FETCH LIVE DASHBOARD DATA FROM BACKEND MONGODB / DATABASE
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
  };

  // FETCH ALL USERS FOR USER MANAGEMENT PAGE
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
  }, [activeTab]);

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

  // RESOLVE SUPPORT TICKET HANDLER
  const handleResolveTicket = async (ticketId) => {
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/resolve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('Support ticket marked as resolved!');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error resolving ticket.');
    }
  };

  const navMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'Users Management', icon: Users },
    { id: 'content', name: 'Content Management', icon: FolderOpen, hasDropdown: true },
    { id: 'pyqs', name: 'PYQs', icon: FileText, isSub: true },
    { id: 'notes', name: 'Notes', icon: BookOpen, isSub: true },
    { id: 'syllabus', name: 'Syllabus', icon: Layers, isSub: true },
    { id: 'quizzes', name: 'Quizzes', icon: HelpCircle, isSub: true },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'reports', name: 'Reports & Analytics', icon: BarChart2 },
    { id: 'support', name: 'Feedback & Support', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', display: 'flex', fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* 1. LEFT SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? '250px' : '0px', minWidth: sidebarOpen ? '250px' : '0px',
        backgroundColor: '#ffffff', borderRight: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', transition: 'all 0.25s ease', overflow: 'hidden', zIndex: 50
      }}>
        <div>
          {/* LOGO HEADER */}
          <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0e4d34', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #059669', flexShrink: 0
            }}>
              <img 
                src="/assets/navbar_logo.png" 
                alt="CampusPrep Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_virus.png';
                }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.35rem', color: '#0e4d34', lineHeight: 1 }}>
                Campus<span style={{ color: '#059669' }}>Prep</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>
                Real Admin CMS Control Panel
              </div>
            </div>
          </div>

          {/* NAVIGATION ITEMS */}
          <nav style={{ padding: '0.85rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {navMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                    padding: item.isSub ? '0.45rem 0.75rem 0.45rem 2.2rem' : '0.55rem 0.85rem',
                    borderRadius: '10px', border: 'none', backgroundColor: isActive ? '#e6f4ed' : 'transparent',
                    color: isActive ? '#0d5c3a' : '#475569', fontWeight: isActive ? 800 : 500,
                    fontSize: item.isSub ? '0.82rem' : '0.86rem', cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Icon size={item.isSub ? 15 : 18} style={{ color: isActive ? '#0d5c3a' : '#64748b' }} />
                    <span>{item.name}</span>
                  </div>
                  {item.hasDropdown && <ChevronDown size={14} style={{ color: '#94a3b8' }} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM VIRUS SIDEBAR CARD */}
        <div style={{ padding: '1rem 0.85rem' }}>
          <div style={{
            backgroundColor: '#e6f4ed', borderRadius: '18px', border: '1.5px solid #a7f3d0', padding: '0.85rem',
            boxShadow: '0 4px 12px rgba(13,92,58,0.08)'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: "'Kalam', cursive", color: '#0f172a', lineHeight: 1.3, marginBottom: '0.5rem' }}>
              “Real Data. Real Impact. <br />
              <span style={{ color: '#0d5c3a', fontSize: '0.82rem' }}>AKTU B.Tech CMS</span>” <br />
              <span style={{ color: '#059669', fontSize: '0.68rem' }}>— CampusPrep Backend :)</span>
            </div>

            <div style={{ width: '100%', height: '70px', position: 'relative' }}>
              <img
                src="/assets/admin_sidebar_virus.png"
                alt="Virus Teacher Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/hero_virus.png';
                }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* TOP HEADER */}
        <header style={{
          backgroundColor: '#ffffff', borderBottom: '1.5px solid #e2e8f0', height: '65px', padding: '0 1.5rem',
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
                placeholder="Search database users, notes, tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px',
                  padding: '0.45rem 0.85rem 0.45rem 2.2rem', fontSize: '0.84rem', color: '#0f172a', outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={fetchDashboardData} title="Refresh Database Data" style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.35rem 0.6rem', color: '#0d5c3a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700 }}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>

            {/* Admin Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0d5c3a', color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              {/* WELCOME ROW */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                      Welcome Admin! <span role="img" aria-label="wave">👋</span>
                    </h1>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>
                      {currentDateStr} <br />
                      <span style={{ color: '#059669' }}>Last updated: {lastUpdated || 'Just now'}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Real database metric counts from MongoDB. Zero fake or hardcoded numbers.
                  </p>
                </div>

                <div style={{ backgroundColor: '#e6f4ed', borderRadius: '16px', border: '1.5px solid #a7f3d0', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ffffff', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #a7f3d0' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#065f46' }}>Database Connected</div>
                    <div style={{ fontSize: '0.74rem', color: '#047857' }}>All stats fetched live from backend.</div>
                  </div>
                </div>
              </div>

              {/* 4 REAL KPI METRIC CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.15rem', marginBottom: '1.5rem' }}>
                
                {/* Total Users */}
                <div style={kpiCardStyle} onClick={() => setActiveTab('users')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ ...kpiIconWrapStyle, backgroundColor: '#dcfce7', color: '#16a34a' }}>
                      <Users size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Real DB Count</span>
                  </div>
                  <div style={kpiLabelStyle}>Total Users</div>
                  <div style={kpiValueStyle}>{loading ? '...' : stats.totalUsers}</div>
                  <div style={kpiSubStyle}>{stats.totalStudents} Registered Students</div>
                </div>

                {/* Total Content */}
                <div style={kpiCardStyle} onClick={() => setActiveTab('notes')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ ...kpiIconWrapStyle, backgroundColor: '#dbeafe', color: '#2563eb' }}>
                      <FileText size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Real DB Count</span>
                  </div>
                  <div style={kpiLabelStyle}>Total Content Items</div>
                  <div style={kpiValueStyle}>{loading ? '...' : stats.totalContent}</div>
                  <div style={kpiSubStyle}>{stats.totalNotes} Notes • {stats.totalPYQs} PYQs</div>
                </div>

                {/* Total Quizzes */}
                <div style={kpiCardStyle} onClick={() => setActiveTab('quizzes')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ ...kpiIconWrapStyle, backgroundColor: '#f3e8ff', color: '#9333ea' }}>
                      <HelpCircle size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9333ea', backgroundColor: '#faf5ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Real DB Count</span>
                  </div>
                  <div style={kpiLabelStyle}>Total Quizzes</div>
                  <div style={kpiValueStyle}>{loading ? '...' : stats.totalQuizzes}</div>
                  <div style={kpiSubStyle}>Interactive Practice Sets</div>
                </div>

                {/* Open Support Tickets */}
                <div style={kpiCardStyle} onClick={() => setActiveTab('support')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ ...kpiIconWrapStyle, backgroundColor: '#ffedd5', color: '#ea580c' }}>
                      <MessageSquare size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ea580c', backgroundColor: '#fff7ed', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Real DB Count</span>
                  </div>
                  <div style={kpiLabelStyle}>Open Support Tickets</div>
                  <div style={kpiValueStyle}>{loading ? '...' : stats.openTickets}</div>
                  <div style={kpiSubStyle}>Student Feedback Requests</div>
                </div>

              </div>

              {/* CHARTS & RECENT ACTIVITY ROW */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px 300px', gap: '1.25rem', marginBottom: '1.5rem' }}>
                
                {/* Real User Growth */}
                <div style={panelCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                      <TrendingUp size={18} style={{ color: '#0d5c3a' }} /> User Registration Metrics
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Live Database Activity</span>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0d5c3a' }}>{stats.totalUsers}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginTop: '0.2rem' }}>Total Accounts in Database</div>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      {stats.totalStudents} Students • {stats.totalAdmins} Administrators registered.
                    </p>
                  </div>
                </div>

                {/* Real Content Distribution */}
                <div style={panelCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '1rem' }}>
                    <FolderOpen size={18} style={{ color: '#0d5c3a' }} /> Content Distribution
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700 }}>
                      <span>Notes & Unit Papers</span>
                      <span style={{ color: '#059669' }}>{stats.totalNotes}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700 }}>
                      <span>PYQ Question Papers</span>
                      <span style={{ color: '#0284c7' }}>{stats.totalPYQs}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700 }}>
                      <span>Interactive Quizzes</span>
                      <span style={{ color: '#9333ea' }}>{stats.totalQuizzes}</span>
                    </div>
                  </div>
                </div>

                {/* Real Recent Activities Timeline */}
                <div style={panelCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.98rem', color: '#0f172a' }}>
                      <Zap size={17} style={{ color: '#0d5c3a' }} /> Real Activity Log
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                    {recentActivities.length === 0 ? (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
                        No recent activity recorded.
                      </div>
                    ) : (
                      recentActivities.map(act => (
                        <div key={act.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'start' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: act.color || '#059669', marginTop: '4px', flexShrink: 0 }} />
                          <div style={{ fontSize: '0.78rem', lineHeight: 1.25 }}>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{act.action}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{act.detail} • <span style={{ color: '#94a3b8' }}>{act.performer}</span></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* LATEST USERS TABLE */}
              <div style={panelCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.98rem', color: '#0f172a' }}>
                    <Users size={17} style={{ color: '#0d5c3a' }} /> Latest Registered Users
                  </div>
                  <button onClick={() => setActiveTab('users')} style={{ background: 'none', border: 'none', color: '#0d5c3a', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}>Manage Users →</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ color: '#64748b', borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Name</th>
                        <th style={{ padding: '0.5rem' }}>Enrollment No.</th>
                        <th style={{ padding: '0.5rem' }}>Branch</th>
                        <th style={{ padding: '0.5rem' }}>Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                            No student accounts registered yet.
                          </td>
                        </tr>
                      ) : (
                        latestUsers.map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '0.55rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{u.name}</td>
                            <td style={{ padding: '0.55rem 0.5rem', color: '#475569' }}>{u.enrollmentNo}</td>
                            <td style={{ padding: '0.55rem 0.5rem', fontWeight: 700, color: '#059669' }}>{u.branch}</td>
                            <td style={{ padding: '0.55rem 0.5rem', color: '#94a3b8' }}>{u.joinedOn}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>User Account Management</h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.1rem' }}>
                    Manage registered student and administrator accounts.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('addUser')}
                  className="btn-primary"
                  style={{ padding: '0.55rem 1.1rem', backgroundColor: '#0d5c3a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <PlusCircle size={16} /> Add User
                </button>
              </div>

              {/* User List Table */}
              <div style={panelCardStyle}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '0.65rem' }}>Name</th>
                        <th style={{ padding: '0.65rem' }}>Email</th>
                        <th style={{ padding: '0.65rem' }}>Enrollment</th>
                        <th style={{ padding: '0.65rem' }}>Branch</th>
                        <th style={{ padding: '0.65rem' }}>Role</th>
                        <th style={{ padding: '0.65rem' }}>Status</th>
                        <th style={{ padding: '0.65rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersList.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                            Loading user accounts...
                          </td>
                        </tr>
                      ) : (
                        allUsersList.map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.65rem', fontWeight: 800, color: '#0f172a' }}>{u.name}</td>
                            <td style={{ padding: '0.65rem', color: '#475569' }}>{u.email}</td>
                            <td style={{ padding: '0.65rem', color: '#475569' }}>{u.enrollmentNo}</td>
                            <td style={{ padding: '0.65rem', fontWeight: 700, color: '#059669' }}>{u.branch}</td>
                            <td style={{ padding: '0.65rem' }}>
                              <span style={{ backgroundColor: u.role === 'Administrator' ? '#e0f2fe' : '#e6f4ed', color: u.role === 'Administrator' ? '#0284c7' : '#0d5c3a', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem' }}>
                              <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                                {u.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                                title="Delete User"
                              >
                                <Trash2 size={16} />
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

          {/* TAB 3: CONTENT / NOTES / PYQS MANAGEMENT */}
          {(activeTab === 'content' || activeTab === 'notes' || activeTab === 'pyqs' || activeTab === 'quizzes') && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Content & Resource CMS</h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.1rem' }}>
                    Manage published notes, PYQs, and quizzes visible to AKTU students.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={() => setActiveModal('addNote')} className="btn-primary" style={{ padding: '0.5rem 1rem', backgroundColor: '#0d5c3a', fontSize: '0.82rem' }}>
                    + Add Note
                  </button>
                  <button onClick={() => setActiveModal('uploadPYQ')} className="btn-primary" style={{ padding: '0.5rem 1rem', backgroundColor: '#0284c7', fontSize: '0.82rem' }}>
                    + Upload PYQ
                  </button>
                  <button onClick={() => setActiveModal('createQuiz')} className="btn-primary" style={{ padding: '0.5rem 1rem', backgroundColor: '#9333ea', fontSize: '0.82rem' }}>
                    + Create Quiz
                  </button>
                </div>
              </div>

              <div style={panelCardStyle}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Current Published Resources ({recentContent.length})
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Title</th>
                      <th style={{ padding: '0.5rem' }}>Type</th>
                      <th style={{ padding: '0.5rem' }}>Added On</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContent.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                          No content published yet. Click above to add notes/PYQs.
                        </td>
                      </tr>
                    ) : (
                      recentContent.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '0.55rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{c.title}</td>
                          <td style={{ padding: '0.55rem 0.5rem' }}>
                            <span style={{ backgroundColor: c.color || '#e6f4ed', color: c.iconColor || '#059669', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                              {c.type}
                            </span>
                          </td>
                          <td style={{ padding: '0.55rem 0.5rem', color: '#94a3b8' }}>{c.addedOn}</td>
                          <td style={{ padding: '0.55rem 0.5rem', textAlign: 'right' }}>
                            <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete Content">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SUPPORT TICKETS */}
          {activeTab === 'support' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Student Support & Feedback</h2>
                <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.1rem' }}>
                  Real support tickets submitted by CampusPrep students.
                </p>
              </div>

              <div style={panelCardStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {supportTickets.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      No open support tickets.
                    </div>
                  ) : (
                    supportTickets.map(t => (
                      <div key={t.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{t.message}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.2rem' }}>From: {t.email} • Status: <b style={{ color: t.status === 'Resolved' ? '#059669' : '#ea580c' }}>{t.status || 'Open'}</b></div>
                        </div>
                        {t.status !== 'Resolved' && (
                          <button onClick={() => handleResolveTicket(t.id)} className="btn-primary" style={{ backgroundColor: '#059669', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODALS */}
      {activeModal === 'addNote' && (
        <AdminAddNoteModal onClose={() => setActiveModal(null)} onCreated={fetchDashboardData} />
      )}

      {activeModal === 'uploadPYQ' && (
        <AdminUploadPyqModal onClose={() => setActiveModal(null)} onCreated={fetchDashboardData} />
      )}

      {activeModal === 'createQuiz' && (
        <AdminCreateQuizModal onClose={() => setActiveModal(null)} onCreated={fetchDashboardData} />
      )}

      {activeModal === 'addUser' && (
        <AdminAddUserModal onClose={() => setActiveModal(null)} onCreated={fetchAllUsers} />
      )}

    </div>
  );
}

// MODAL COMPONENTS FOR REAL CMS CREATION

function AdminAddNoteModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, subject })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onCreated) onCreated();
        onClose();
      }
    } catch (err) {
      alert('Error publishing note.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Publish New Note</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={modalLabelStyle}>Note Title</label>
            <input type="text" required placeholder="e.g. DBMS Unit 1 Notes" value={title} onChange={e => setTitle(e.target.value)} style={modalInputStyle} />
          </div>
          <div>
            <label style={modalLabelStyle}>Subject</label>
            <input type="text" required placeholder="e.g. Database Management System" value={subject} onChange={e => setSubject(e.target.value)} style={modalInputStyle} />
          </div>
          <button type="submit" className="btn-primary" style={{ backgroundColor: '#0d5c3a', padding: '0.65rem' }}>Publish Note</button>
        </form>
      </div>
    </div>
  );
}

function AdminUploadPyqModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [examYear, setExamYear] = useState('2024');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/pyqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, examYear })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onCreated) onCreated();
        onClose();
      }
    } catch (err) {
      alert('Error uploading PYQ.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Upload AKTU PYQ</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={modalLabelStyle}>Subject Name</label>
            <input type="text" required placeholder="e.g. Data Structures" value={title} onChange={e => setTitle(e.target.value)} style={modalInputStyle} />
          </div>
          <div>
            <label style={modalLabelStyle}>Exam Year</label>
            <select value={examYear} onChange={e => setExamYear(e.target.value)} style={modalInputStyle}>
              <option>2025</option><option>2024</option><option>2023</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ backgroundColor: '#0284c7', padding: '0.65rem' }}>Upload PYQ</button>
        </form>
      </div>
    </div>
  );
}

function AdminCreateQuizModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onCreated) onCreated();
        onClose();
      }
    } catch (err) {
      alert('Error creating quiz.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={modalCloseBtnStyle}><X size={20} /></button>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Create Quiz</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={modalLabelStyle}>Quiz Subject</label>
            <input type="text" required placeholder="e.g. Operating Systems MCQs" value={title} onChange={e => setTitle(e.target.value)} style={modalInputStyle} />
          </div>
          <button type="submit" className="btn-primary" style={{ backgroundColor: '#9333ea', padding: '0.65rem' }}>Create Quiz</button>
        </form>
      </div>
    </div>
  );
}

function AdminAddUserModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
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
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Add New User Account</h3>
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
              <option>CSE</option><option>ECE</option><option>ME</option><option>CE</option><option>IT</option><option>EE</option>
            </select>
          </div>
          <div>
            <label style={modalLabelStyle}>Initial Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={modalInputStyle} />
          </div>
          <button type="submit" className="btn-primary" style={{ backgroundColor: '#0d5c3a', padding: '0.65rem' }}>Create User Account</button>
        </form>
      </div>
    </div>
  );
}

// STYLING CONSTANTS
const kpiCardStyle = {
  backgroundColor: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', padding: '1.15rem',
  boxShadow: '0 4px 14px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'all 0.2s ease'
};

const kpiIconWrapStyle = {
  width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
  backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '480px', width: '100%', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
};

const modalCloseBtnStyle = {
  position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
};

const modalLabelStyle = { fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem', display: 'block' };
const modalInputStyle = { width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.55rem 0.75rem', fontSize: '0.85rem', backgroundColor: '#f8fafc', outline: 'none', color: '#0f172a' };
