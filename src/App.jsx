import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import YearBranchAISection from './components/YearBranchAISection';
import StatsSection from './components/StatsSection';
import TrendingLatestCommunitySection from './components/TrendingLatestCommunitySection';
import MotivationalCampusSection from './components/MotivationalCampusSection';
import Footer from './components/Footer';
import AIStudyModal from './components/AIStudyModal';
import AuthModal from './components/AuthModal';

// Pages
import PYQsPage from './pages/PYQsPage';
import NotesPage from './pages/NotesPage';
import SyllabusPage from './pages/SyllabusPage';
import QuizzesPage from './pages/QuizzesPage';
import AIStudyPage from './pages/AIStudyPage';
import CommunityPage from './pages/CommunityPage';
import MorePage from './pages/MorePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';

export default function App() {
  const isAdminAuthenticated = () => {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
    if (!token || !userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user && user.role === 'admin';
    } catch {
      return false;
    }
  };

  const getInitialTab = () => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
    if (path === 'admin/login') return 'admin-login';
    if (['login', 'signup', 'more', 'pyqs', 'notes', 'syllabus', 'quizzes', 'aistudy', 'community', 'home', 'admin', 'admin-login'].includes(path)) {
      return path;
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState(null);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    let targetPath = tab === 'home' ? '/' : `/${tab}`;
    if (tab === 'admin-login') targetPath = '/admin/login';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
      if (path === 'admin/login') {
        setActiveTabState('admin-login');
      } else if (['login', 'signup', 'more', 'pyqs', 'notes', 'syllabus', 'quizzes', 'aistudy', 'community', 'home', 'admin', 'admin-login'].includes(path)) {
        setActiveTabState(path);
      } else {
        setActiveTabState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSearch = (query, branch) => {
    alert(`Searching for "${query}" in branch ${branch || 'All Branches'}...`);
  };

  const handleOpenAuth = (mode) => {
    setActiveTab(mode === 'signup' ? 'signup' : 'login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleFeatureClick = (id) => {
    if (id === 'aistudy') {
      setActiveTab('aistudy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    setActiveTab('community');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    setActiveTab('community');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAuthOrAdminPage = activeTab === 'login' || activeTab === 'signup' || activeTab === 'admin' || activeTab === 'admin-login';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Responsive Navbar (Hidden on standalone Auth & Admin Pages) */}
      {!isAuthOrAdminPage && (
        <Navbar
          onSearch={(query) => handleSearch(query, selectedBranch)}
          onOpenAuth={handleOpenAuth}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {activeTab === 'admin' ? (
          isAdminAuthenticated() ? (
            <AdminDashboard
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )
        ) : activeTab === 'admin-login' ? (
          <AdminLoginPage
            onLoginSuccess={() => {
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'login' || activeTab === 'signup' ? (
          <LoginPage
            initialMode={activeTab}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'community' ? (
          <CommunityPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'aistudy' ? (
          <AIStudyPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'quizzes' ? (
          <QuizzesPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAI={() => setActiveTab('aistudy')}
          />
        ) : activeTab === 'syllabus' ? (
          <SyllabusPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAI={() => setActiveTab('aistudy')}
          />
        ) : activeTab === 'notes' ? (
          <NotesPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'more' ? (
          <MorePage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'pyqs' ? (
          <PYQsPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : (
          <>
            {/* 1. Chalkboard Home Hero Section */}
            <HeroSection
              onSearch={handleSearch}
              onSelectBranch={handleSelectBranch}
            />

            {/* 2. Horizontal Feature Cards Section */}
            <FeatureCards
              onCardClick={handleFeatureClick}
            />

            {/* 3. Year + Branch + Ask Virus AI Section */}
            <YearBranchAISection
              onSelectYear={handleSelectYear}
              onSelectBranch={handleSelectBranch}
              onOpenAI={() => setActiveTab('aistudy')}
            />

            {/* 4. Configurable Statistics Section */}
            <StatsSection
              isLiveDataAvailable={false}
            />

            {/* 5. Three-Column Trending + Latest Notes + Community Section */}
            <TrendingLatestCommunitySection
              onSubjectClick={(sub) => alert(`Selected Subject: ${sub.name}`)}
              onNoteClick={(note) => alert(`Opening Note: ${note.title}`)}
              onDiscussionClick={(disc) => alert(`Opening Discussion: ${disc.title}`)}
              onViewAll={(type) => setActiveTab(type)}
            />

            {/* 6. Motivational Campus Illustration Section */}
            <MotivationalCampusSection
              onJoinCommunity={() => setActiveTab('community')}
            />
          </>
        )}
      </main>

      {/* Footer */}
      {!isAuthOrAdminPage && (
        <Footer
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Modals */}
      <AIStudyModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={handleCloseAuth}
        onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
      />
    </div>
  );
}
