import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import CourseCardsSection from './components/CourseCardsSection';
import YearBranchAISection from './components/YearBranchAISection';
import StatsSection from './components/StatsSection';
import TrendingLatestCommunitySection from './components/TrendingLatestCommunitySection';
import AcademicClosingSection from './components/AcademicClosingSection';
import StudentUpdatesModal from './components/StudentUpdatesModal';
import Footer from './components/Footer';
import AIStudyModal from './components/AIStudyModal';
import AuthModal from './components/AuthModal';
import CourseSelectModal from './components/CourseSelectModal';
import StayConnectedPopup from './components/StayConnectedPopup';

import { Clock } from 'lucide-react';
// Pages
import PYQsPage from './pages/PYQsPage';
import NotesPage from './pages/NotesPage';
import SyllabusPage from './pages/SyllabusPage';
import QuizzesPage from './pages/QuizzesPage';
import AIStudyPage from './pages/AIStudyPage';
import InterviewProPage from './pages/InterviewProPage';
import InterviewConfirmPage from './pages/InterviewConfirmPage';
import InterviewInstructionsPage from './pages/InterviewInstructionsPage';
import InterviewAptitudePage from './pages/InterviewAptitudePage';
import InterviewCodingPage from './pages/InterviewCodingPage';
import InterviewTechnicalPage from './pages/InterviewTechnicalPage';
import InterviewHrPage from './pages/InterviewHrPage';
import InterviewReportPage from './pages/InterviewReportPage';
import MorePage from './pages/MorePage';
import { updateSEOForRoute } from './utils/seoManager';
import ResumeMakerPage from './pages/ResumeMakerPage';
import PdfMakerPage from './pages/PdfMakerPage';
import ResultCgpaPage from './pages/ResultCgpaPage';
import AttendanceCalculatorPage from './pages/AttendanceCalculatorPage';
import CompetitiveExamsPage from './pages/CompetitiveExamsPage';
import ImportantLinksPage from './pages/ImportantLinksPage';
import ProjectIdeasPage from './pages/ProjectIdeasPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import InternshipsJobsPage from './pages/InternshipsJobsPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage';
import TimetablePage from './pages/TimetablePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';

export default function App() {
  const isAdminAuthenticated = () => {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    if (!token) return false;
    const userStr = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
    if (!userStr) return true;
    try {
      const user = JSON.parse(userStr);
      return !user.role || user.role === 'admin' || user.role === 'Administrator';
    } catch {
      return true;
    }
  };

  const parseCourseFromUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('course');
      if (c) {
        const cLower = c.toLowerCase();
        if (cLower.includes('bca')) return 'BCA';
        if (cLower.includes('mca')) return 'MCA';
        if (cLower.includes('mba')) return 'MBA';
        if (cLower.includes('pharm')) return 'B.Pharm';
        return 'B.Tech';
      }
    } catch (e) {}
    return null;
  };

  const parseProjectSlug = () => {
    try {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      const parts = path.split('/');
      if ((parts[0]?.toLowerCase() === 'project-ideas' || parts[0]?.toLowerCase() === 'projects') && parts[1]) {
        return parts[1];
      }
    } catch (e) {}
    return null;
  };

  const parseOpportunitySlug = () => {
    try {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      const parts = path.split('/');
      if ((parts[0]?.toLowerCase() === 'internships-jobs' || parts[0]?.toLowerCase() === 'jobs') && parts[1]) {
        return parts[1];
      }
    } catch (e) {}
    return null;
  };

  const parseScholarshipSlug = () => {
    try {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      const parts = path.split('/');
      if (parts[0]?.toLowerCase() === 'scholarships' && parts[1]) {
        return parts[1];
      }
    } catch (e) {}
    return null;
  };

  const getInitialTab = () => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
    if (!path || path === 'home') return 'home';
    if (path === 'interview-pro') return 'interview-pro';
    if (path === 'admin/login') return 'admin-login';
    if (path === 'interview-pro/confirm' || path === 'interview-confirm') return 'interview-confirm';
    if (path === 'interview-pro/instructions' || path === 'interview-instructions') return 'interview-instructions';
    if (path === 'interview-pro/start' || path === 'interview-start' || path === 'interview-pro/aptitude' || path === 'interview-aptitude') return 'interview-start';
    if (path === 'interview-pro/coding' || path === 'interview-coding') return 'interview-coding';
    if (path === 'interview-pro/technical' || path === 'interview-technical') return 'interview-technical';
    if (path === 'interview-pro/hr' || path === 'interview-hr') return 'interview-hr';
    if (path === 'interview-pro/report' || path === 'interview-report') return 'interview-report';
    if (path === 'resume-maker') return 'resume-maker';
    if (path === 'pdf-maker' || path === 'pdfmaker' || path === 'pdf') return 'pdf-maker';
    if (path === 'result-cgpa' || path === 'result' || path === 'results' || path === 'cgpa') return 'result-cgpa';
    if (path === 'timetable' || path === 'time-table' || path === 'planner') return 'timetable';
    if (path === 'attendance-calculator' || path === 'attendance') return 'attendance-calculator';
    if (path === 'competitive-exams' || path === 'competitive-exam' || path === 'career-guidance' || path === 'exams') return 'competitive-exams';
    if (path === 'important-links' || path === 'links') return 'important-links';
    if (path === 'project-ideas' || path === 'projects') return 'project-ideas';
    if (path.startsWith('project-ideas/') || path.startsWith('projects/')) {
      const parts = path.split('/');
      if (parts[1]) return 'project-detail';
    }
    if (path === 'internships-jobs' || path === 'jobs') return 'internships-jobs';
    if (path.startsWith('internships-jobs/') || path.startsWith('jobs/')) {
      const parts = path.split('/');
      if (parts[1]) return 'opportunity-detail';
    }
    if (path === 'scholarships') return 'scholarships';
    if (path.startsWith('scholarships/')) {
      const parts = path.split('/');
      if (parts[1]) return 'scholarship-detail';
    }
    if (path === 'community') return 'home';
    if (['login', 'signup', 'more', 'timetable', 'attendance-calculator', 'competitive-exams', 'important-links', 'resume-maker', 'pdf-maker', 'result-cgpa', 'project-ideas', 'internships-jobs', 'scholarships', 'pyqs', 'notes', 'syllabus', 'quizzes', 'interview-pro', 'interview-confirm', 'interview-instructions', 'interview-start', 'interview-aptitude', 'interview-coding', 'interview-technical', 'interview-hr', 'interview-report', 'aistudy', 'planner', 'progress', 'home', 'admin', 'admin-login'].includes(path)) {
      if (path === 'aistudy') return 'interview-pro';
      return path;
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(parseProjectSlug);
  const [selectedOpportunitySlug, setSelectedOpportunitySlug] = useState(parseOpportunitySlug);
  const [selectedScholarshipSlug, setSelectedScholarshipSlug] = useState(parseScholarshipSlug);
  const [selectedCourse, setSelectedCourse] = useState(parseCourseFromUrl);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [pendingCourseTarget, setPendingCourseTarget] = useState('notes');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const navigateToTab = (tab, courseOverride = null) => {
    const courseToUse = courseOverride !== undefined ? courseOverride : selectedCourse;
    
    // If navigating to notes or pyqs without a course selected, prompt Choose Your Course
    if ((tab === 'notes' || tab === 'pyqs') && !courseToUse) {
      setPendingCourseTarget(tab);
      setIsCourseModalOpen(true);
      return;
    }

    let targetPath = '';
    if (tab.startsWith('project-detail:')) {
      const slug = tab.split(':')[1];
      setSelectedProjectSlug(slug);
      setActiveTabState('project-detail');
      targetPath = `/project-ideas/${slug}`;
    } else if (tab === 'project-ideas') {
      setActiveTabState('project-ideas');
      targetPath = '/project-ideas';
    } else if (tab.startsWith('internships-jobs:')) {
      const slug = tab.split(':')[1];
      setSelectedOpportunitySlug(slug);
      setActiveTabState('opportunity-detail');
      targetPath = `/internships-jobs/${slug}`;
    } else if (tab === 'internships-jobs' || tab === 'jobs') {
      setActiveTabState('internships-jobs');
      targetPath = '/internships-jobs';
    } else if (tab.startsWith('scholarships:') || tab.startsWith('scholarship-detail:')) {
      const slug = tab.split(':')[1];
      setSelectedScholarshipSlug(slug);
      setActiveTabState('scholarship-detail');
      targetPath = `/scholarships/${slug}`;
    } else if (tab === 'scholarships') {
      setActiveTabState('scholarships');
      targetPath = '/scholarships';
    } else {
      setActiveTabState(tab);
      if (tab === 'home') {
        targetPath = '/';
      } else if (tab === 'interview-pro') {
        targetPath = '/interview-pro';
      } else if (tab === 'interview-confirm') {
        targetPath = '/interview-confirm';
      } else if (tab === 'interview-instructions') {
        targetPath = '/interview-instructions';
      } else if (tab === 'interview-start' || tab === 'interview-aptitude') {
        targetPath = '/interview-start';
      } else if (tab === 'interview-coding') {
        targetPath = '/interview-coding';
      } else if (tab === 'interview-technical') {
        targetPath = '/interview-technical';
      } else if (tab === 'interview-hr') {
        targetPath = '/interview-hr';
      } else if (tab === 'interview-report') {
        targetPath = '/interview-report';
      } else if (tab === 'resume-maker') {
        targetPath = '/resume-maker';
      } else if (tab === 'pdf-maker') {
        targetPath = '/pdf-maker';
      } else if (tab === 'result-cgpa') {
        targetPath = '/result-cgpa';
      } else if (tab === 'attendance-calculator') {
        targetPath = '/attendance-calculator';
      } else if (tab === 'competitive-exams') {
        targetPath = '/competitive-exams';
      } else if (tab === 'important-links') {
        targetPath = '/important-links';
      } else if (tab === 'timetable') {
        targetPath = '/timetable';
      } else if (tab === 'admin-login') {
        targetPath = '/admin/login';
      } else {
        targetPath = `/${tab}`;
      }
      
      if (courseToUse && (tab === 'notes' || tab === 'pyqs')) {
        targetPath += `?course=${encodeURIComponent(courseToUse)}`;
      }
    }

    if (window.location.pathname + window.location.search !== targetPath) {
      window.history.pushState({ tab, course: courseToUse }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveTab = (tab) => {
    navigateToTab(tab);
  };

  const handleCourseSelected = (courseKey, targetTab = null) => {
    setSelectedCourse(courseKey);
    setIsCourseModalOpen(false);
    const dest = targetTab || pendingCourseTarget || 'notes';
    navigateToTab(dest, courseKey);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
      const course = parseCourseFromUrl();
      if (course) setSelectedCourse(course);

      if (!path || path === 'home') {
        setActiveTabState('home');
      } else if (path === 'interview-pro') {
        setActiveTabState('interview-pro');
      } else if (path === 'admin/login') {
        setActiveTabState('admin-login');
      } else if (path === 'interview-pro/confirm' || path === 'interview-confirm') {
        setActiveTabState('interview-confirm');
      } else if (path === 'interview-pro/instructions' || path === 'interview-instructions') {
        setActiveTabState('interview-instructions');
      } else if (path === 'interview-pro/start' || path === 'interview-start') {
        setActiveTabState('interview-start');
      } else if (path === 'resume-maker') {
        setActiveTabState('resume-maker');
      } else if (path === 'pdf-maker' || path === 'pdfmaker' || path === 'pdf') {
        setActiveTabState('pdf-maker');
      } else if (path === 'result-cgpa' || path === 'result' || path === 'results' || path === 'cgpa') {
        setActiveTabState('result-cgpa');
      } else if (path === 'timetable' || path === 'time-table' || path === 'planner') {
        setActiveTabState('timetable');
      } else if (path === 'attendance-calculator' || path === 'attendance') {
        setActiveTabState('attendance-calculator');
      } else if (path === 'competitive-exams' || path === 'competitive-exam' || path === 'career-guidance' || path === 'exams') {
        setActiveTabState('competitive-exams');
      } else if (path === 'important-links' || path === 'links') {
        setActiveTabState('important-links');
      } else if (path === 'project-ideas' || path === 'projects') {
        setActiveTabState('project-ideas');
      } else if (path.startsWith('project-ideas/') || path.startsWith('projects/')) {
        const parts = path.split('/');
        if (parts[1]) {
          setSelectedProjectSlug(parts[1]);
          setActiveTabState('project-detail');
        } else {
          setActiveTabState('project-ideas');
        }
      } else if (path === 'internships-jobs' || path === 'jobs') {
        setActiveTabState('internships-jobs');
      } else if (path.startsWith('internships-jobs/') || path.startsWith('jobs/')) {
        const parts = path.split('/');
        if (parts[1]) {
          setSelectedOpportunitySlug(parts[1]);
          setActiveTabState('opportunity-detail');
        } else {
          setActiveTabState('internships-jobs');
        }
      } else if (path === 'scholarships') {
        setActiveTabState('scholarships');
      } else if (path.startsWith('scholarships/')) {
        const parts = path.split('/');
        if (parts[1]) {
          setSelectedScholarshipSlug(parts[1]);
          setActiveTabState('scholarship-detail');
        } else {
          setActiveTabState('scholarships');
        }
      } else if (path === 'community') {
        setActiveTabState('home');
      } else if (['login', 'signup', 'more', 'timetable', 'attendance-calculator', 'competitive-exams', 'important-links', 'resume-maker', 'pdf-maker', 'result-cgpa', 'project-ideas', 'internships-jobs', 'scholarships', 'pyqs', 'notes', 'syllabus', 'quizzes', 'interview-pro', 'interview-confirm', 'interview-instructions', 'interview-start', 'aistudy', 'planner', 'progress', 'home', 'admin', 'admin-login'].includes(path)) {
        setActiveTabState(path === 'aistudy' ? 'interview-pro' : path);
      } else {
        setActiveTabState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync Technical SEO metadata on route change
  useEffect(() => {
    updateSEOForRoute(activeTab, selectedCourse);
  }, [activeTab, selectedCourse]);

  const handleSearch = (query, branch) => {
    if (branch && branch !== 'All' && branch !== 'All Branches') {
      setSelectedBranch(branch);
    }
    setGlobalSearchQuery(query || '');
    // Search defaults to B.Tech notes if no course selected
    const courseToUse = selectedCourse || 'B.Tech';
    setSelectedCourse(courseToUse);
    navigateToTab('notes', courseToUse);
  };

  const handleOpenAuth = (mode) => {
    setActiveTab(mode === 'signup' ? 'signup' : 'login');
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleFeatureClick = (id) => {
    if (id === 'aistudy') {
      setActiveTab('aistudy');
    } else {
      navigateToTab(id);
    }
  };

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    navigateToTab('notes');
  };

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    navigateToTab('notes');
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
            navigateToTab(tab);
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
        ) : activeTab === 'interview-confirm' ? (
          <InterviewConfirmPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'interview-instructions' ? (
          <InterviewInstructionsPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : (activeTab === 'interview-start' || activeTab === 'interview-aptitude') ? (
          <InterviewAptitudePage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'interview-coding' ? (
          <InterviewCodingPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'interview-technical' ? (
          <InterviewTechnicalPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'interview-hr' ? (
          <InterviewHrPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'interview-report' ? (
          <InterviewReportPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'interview-pro' || activeTab === 'aistudy' ? (
          <InterviewProPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'quizzes' ? (
          <QuizzesPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAI={() => setIsAIModalOpen(true)}
          />
        ) : activeTab === 'syllabus' ? (
          <SyllabusPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAI={() => setIsAIModalOpen(true)}
          />
        ) : activeTab === 'notes' ? (
          <NotesPage
            searchQuery={globalSearchQuery}
            onClearSearch={() => setGlobalSearchQuery('')}
            initialCourse={selectedCourse || 'B.Tech'}
            onSelectCourse={(courseKey) => {
              setSelectedCourse(courseKey);
              const targetPath = `/notes?course=${encodeURIComponent(courseKey)}`;
              window.history.replaceState({ tab: 'notes', course: courseKey }, '', targetPath);
            }}
            onNavigate={(tab) => {
              navigateToTab(tab);
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'resume-maker' ? (
          <ResumeMakerPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'pdf-maker' ? (
          <PdfMakerPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'result-cgpa' ? (
          <ResultCgpaPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'attendance-calculator' ? (
          <AttendanceCalculatorPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'competitive-exams' ? (
          <CompetitiveExamsPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'important-links' ? (
          <ImportantLinksPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'project-detail' ? (
          <ProjectDetailPage
            slug={selectedProjectSlug}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'project-ideas' ? (
          <ProjectIdeasPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'opportunity-detail' ? (
          <OpportunityDetailPage
            slug={selectedOpportunitySlug}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'internships-jobs' ? (
          <InternshipsJobsPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'scholarship-detail' ? (
          <ScholarshipDetailPage
            slug={selectedScholarshipSlug}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'scholarships' ? (
          <ScholarshipsPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'timetable' ? (
          <TimetablePage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'more' || activeTab === 'progress' ? (
          <MorePage
            initialTool={activeTab === 'progress' ? 'attendance' : null}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'pyqs' ? (
          <PYQsPage
            initialCourse={selectedCourse || 'B.Tech'}
            onSelectCourse={(courseKey) => {
              setSelectedCourse(courseKey);
              const targetPath = `/pyqs?course=${encodeURIComponent(courseKey)}`;
              window.history.replaceState({ tab: 'pyqs', course: courseKey }, '', targetPath);
            }}
            onNavigate={(tab) => {
              navigateToTab(tab);
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : (
          <>
            {/* 1. Sunlit Warm Ivory Home Hero Section */}
            <HeroSection
              onSearch={handleSearch}
              onSelectBranch={handleSelectBranch}
            />

            {/* 2. Horizontal Feature Cards Section */}
            <FeatureCards
              onCardClick={handleFeatureClick}
            />

            {/* 3. Choose Your Course Section (B.Tech, MCA, MBA, B.Pharm) */}
            <CourseCardsSection
              onSelectCourse={(courseId) => {
                let courseKey = 'B.Tech';
                if (courseId === 'bca') courseKey = 'BCA';
                else if (courseId === 'mca') courseKey = 'MCA';
                else if (courseId === 'mba') courseKey = 'MBA';
                else if (courseId === 'bpharm') courseKey = 'B.Pharm';
                handleCourseSelected(courseKey, 'notes');
              }}
              onNavigate={(tab) => {
                navigateToTab(tab);
              }}
            />

            {/* 4. Year + Branch + Ask Virus AI Section */}
            <YearBranchAISection
              onSelectYear={handleSelectYear}
              onSelectBranch={handleSelectBranch}
              onOpenAI={() => setIsAIModalOpen(true)}
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

            {/* 6. Academic Closing CTA Section */}
            <AcademicClosingSection
              onNavigate={(tab) => {
                navigateToTab(tab);
              }}
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
      <CourseSelectModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        targetTab={pendingCourseTarget}
        onSelectCourse={handleCourseSelected}
      />

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

      {/* Student Academic Updates & Exam Alerts Modal */}
      <StudentUpdatesModal
        onNavigate={(tab) => {
          navigateToTab(tab);
        }}
      />

      {/* WhatsApp & Telegram Stay Connected Popup */}
      <StayConnectedPopup />
    </div>
  );
}
