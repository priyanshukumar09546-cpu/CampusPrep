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
import MobileBottomNav from './components/MobileBottomNav';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';

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
import SubjectPage from './pages/SubjectPage';
import PlagiarismCheckerPage from './pages/PlagiarismCheckerPage';
import ProgressPage from './pages/ProgressPage';
import PromotionPage from './pages/PromotionPage';

// Exact Reference Image 1 & 2 Screens
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import SelectCoursePage from './pages/SelectCoursePage';
import SelectYearPage from './pages/SelectYearPage';
import SelectSubjectPage from './pages/SelectSubjectPage';
import SubjectDetailPage from './pages/SubjectDetailPage';

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
        const cLower = c.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
        if (cLower === 'bca') return 'BCA';
        if (cLower === 'mca') return 'MCA';
        if (cLower === 'mba') return 'MBA';
        if (cLower === 'bba') return 'BBA';
        if (cLower === 'mtech') return 'MTech';
        if (cLower.includes('pharm')) return 'BPharm';
        return 'BTech';
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

  const parseSubjectFromUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sub = params.get('subject');
      if (sub) {
        return {
          name: sub,
          code: params.get('code') || '',
          branch: params.get('branch') || 'CSE',
          course: params.get('course') || 'B.Tech',
          year: params.get('year') || '2nd Year',
          sem: params.get('sem') || ''
        };
      }
    } catch (e) {}
    return null;
  };

  const getInitialTab = () => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
    if (!path || path === 'home') return 'home';
    if (path === 'signin' || path === 'sign-in' || path === 'login') return 'signin';
    if (path === 'signup' || path === 'sign-up') return 'signup';
    if (path === 'select-course' || path === 'courses') return 'select-course';
    if (path === 'select-year' || path === 'years') return 'select-year';
    if (path === 'select-subject' || path === 'subjects') return 'select-subject';
    if (path.startsWith('subject/') || path === 'subject' || path === 'subject-detail') return 'subject-detail';
    if (path === 'quizzes') return 'quizzes';
    if (path === 'interview-pro') return 'interview-pro';
    if (path === 'more') return 'more';
    if (path === 'progress' || path === 'analytics' || path === 'student-progress') return 'progress';
    if (path === 'promotion' || path === 'advertise' || path === 'promote') return 'promotion';
    if (path === 'admin/login') return 'admin-login';
    if (path === 'interview-pro/confirm' || path === 'interview-confirm') return 'interview-confirm';
    if (path === 'interview-pro/instructions' || path === 'interview-instructions') return 'interview-instructions';
    if (path === 'interview-pro/start' || path === 'interview-start' || path === 'interview-pro/aptitude' || path === 'interview-aptitude') return 'interview-start';
    if (path === 'interview-pro/coding' || path === 'interview-coding') return 'interview-coding';
    if (path === 'interview-pro/technical' || path === 'interview-technical') return 'interview-technical';
    if (path === 'interview-pro/hr' || path === 'interview-hr') return 'interview-hr';
    if (path === 'interview-pro/report' || path === 'interview-report') return 'interview-report';
    if (path === 'resume-maker') return 'resume-maker';
    if (path === 'plagiarism' || path === 'plagiarism-checker') return 'plagiarism';
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
    if (['signin', 'signup', 'select-course', 'select-year', 'select-subject', 'subject-detail', 'login', 'more', 'timetable', 'attendance-calculator', 'competitive-exams', 'important-links', 'resume-maker', 'pdf-maker', 'result-cgpa', 'project-ideas', 'internships-jobs', 'scholarships', 'pyqs', 'notes', 'syllabus', 'quizzes', 'interview-pro', 'interview-confirm', 'interview-instructions', 'interview-start', 'interview-aptitude', 'interview-coding', 'interview-technical', 'interview-hr', 'interview-report', 'aistudy', 'planner', 'progress', 'promotion', 'home', 'admin', 'admin-login', 'subject'].includes(path)) {
      if (path === 'aistudy') return 'interview-pro';
      return path;
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(parseProjectSlug);
  const [selectedOpportunitySlug, setSelectedOpportunitySlug] = useState(parseOpportunitySlug);
  const [selectedScholarshipSlug, setSelectedScholarshipSlug] = useState(parseScholarshipSlug);
  const [selectedSubjectData, setSelectedSubjectData] = useState(parseSubjectFromUrl);
  const [selectedCourse, setSelectedCourse] = useState(parseCourseFromUrl);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [pendingCourseTarget, setPendingCourseTarget] = useState('notes');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const handleOpenSubject = (subjectData) => {
    const subObj = typeof subjectData === 'string' ? { name: subjectData } : (subjectData || {});
    setSelectedSubjectData(subObj);
    setActiveTabState('subject');
    const query = new URLSearchParams();
    if (subObj.name) query.set('subject', subObj.name);
    if (subObj.code) query.set('code', subObj.code);
    if (subObj.branch) query.set('branch', subObj.branch);
    if (subObj.course || selectedCourse) query.set('course', subObj.course || selectedCourse || 'B.Tech');
    if (subObj.year) query.set('year', subObj.year);
    if (subObj.sem || subObj.semester) query.set('sem', subObj.sem || subObj.semester);
    const targetPath = `/subject?${query.toString()}`;
    if (window.location.pathname + window.location.search !== targetPath) {
      window.history.pushState({ tab: 'subject', subject: subObj }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTab = (tab, courseOverride = null) => {
    if (tab === 'subject' || (typeof tab === 'object' && tab?.type === 'subject')) {
      const subObj = typeof tab === 'object' ? (tab.data || tab) : courseOverride;
      handleOpenSubject(subObj);
      return;
    }

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
      } else if (tab === 'signin' || tab === 'login') {
        targetPath = '/signin';
      } else if (tab === 'signup') {
        targetPath = '/signup';
      } else if (tab === 'select-course') {
        targetPath = '/select-course';
      } else if (tab === 'select-year') {
        targetPath = '/select-year';
      } else if (tab === 'select-subject') {
        targetPath = '/select-subject';
      } else if (tab === 'subject-detail' || tab === 'subject') {
        const code = selectedSubjectData?.code || 'bcs202';
        targetPath = `/subject/${encodeURIComponent(code.toLowerCase())}`;
      } else if (tab === 'quizzes') {
        targetPath = '/quizzes';
      } else if (tab === 'more') {
        targetPath = '/more';
      } else if (tab === 'progress') {
        targetPath = '/progress';
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
      } else if (tab === 'plagiarism') {
        targetPath = '/plagiarism';
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
      } else if (tab === 'subject') {
        targetPath = '/subject';
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
      } else if (path === 'signin' || path === 'sign-in' || path === 'login') {
        setActiveTabState('signin');
      } else if (path === 'signup' || path === 'sign-up') {
        setActiveTabState('signup');
      } else if (path === 'select-course' || path === 'courses') {
        setActiveTabState('select-course');
      } else if (path === 'select-year' || path === 'years') {
        setActiveTabState('select-year');
      } else if (path === 'select-subject' || path === 'subjects') {
        setActiveTabState('select-subject');
      } else if (path.startsWith('subject/') || path === 'subject' || path === 'subject-detail') {
        setActiveTabState('subject-detail');
      } else if (path === 'quizzes') {
        setActiveTabState('quizzes');
      } else if (path === 'more') {
        setActiveTabState('more');
      } else if (path === 'progress' || path === 'analytics' || path === 'student-progress') {
        setActiveTabState('progress');
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
      } else if (path === 'plagiarism' || path === 'plagiarism-checker') {
        setActiveTabState('plagiarism');
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
      } else if (path === 'subject') {
        const sub = parseSubjectFromUrl();
        if (sub) setSelectedSubjectData(sub);
        setActiveTabState('subject');
      } else if (['login', 'signup', 'more', 'timetable', 'attendance-calculator', 'competitive-exams', 'important-links', 'resume-maker', 'pdf-maker', 'result-cgpa', 'project-ideas', 'internships-jobs', 'scholarships', 'pyqs', 'notes', 'syllabus', 'quizzes', 'interview-pro', 'interview-confirm', 'interview-instructions', 'interview-start', 'aistudy', 'planner', 'progress', 'home', 'admin', 'admin-login', 'subject'].includes(path)) {
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

  const isStandaloneAuth = activeTab === 'signin' || activeTab === 'signup' || activeTab === 'login' || activeTab === 'admin' || activeTab === 'admin-login';
  const hideTopNav = isStandaloneAuth;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Responsive Navbar (Hidden only on standalone Auth & Admin Pages) */}
      {!hideTopNav && (
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
        {activeTab === 'signin' ? (
          <SignIn onNavigate={(tab) => navigateToTab(tab)} />
        ) : activeTab === 'signup' ? (
          <SignUp onNavigate={(tab) => navigateToTab(tab)} />
        ) : activeTab === 'select-course' ? (
          <SelectCoursePage onNavigate={(tab) => navigateToTab(tab)} />
        ) : activeTab === 'select-year' ? (
          <SelectYearPage onNavigate={(tab) => navigateToTab(tab)} />
        ) : activeTab === 'select-subject' ? (
          <SelectSubjectPage 
            onNavigate={(tab, data) => {
              if (data?.subject) setSelectedSubjectData(data.subject);
              navigateToTab(tab);
            }} 
            onSelectSubject={(sub) => setSelectedSubjectData(sub)}
          />
        ) : (activeTab === 'subject-detail' || activeTab === 'subject') ? (
          <SubjectDetailPage 
            subjectData={selectedSubjectData}
            onBack={() => navigateToTab('select-subject')}
            onNavigate={(tab) => navigateToTab(tab)}
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
            onNavigate={(tab, data) => {
              if (tab === 'subject' && data) {
                handleOpenSubject(data);
              } else {
                navigateToTab(tab, data);
              }
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'pyqs' ? (
          <PYQsPage
            initialCourse={selectedCourse || 'B.Tech'}
            onSelectCourse={(courseKey) => {
              setSelectedCourse(courseKey);
              const targetPath = `/pyqs?course=${encodeURIComponent(courseKey)}`;
              window.history.replaceState({ tab: 'pyqs', course: courseKey }, '', targetPath);
            }}
            onNavigate={(tab, data) => {
              if (tab === 'subject' && data) {
                handleOpenSubject(data);
              } else {
                navigateToTab(tab, data);
              }
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'admin' ? (
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
        ) : activeTab === 'login' ? (
          <SignIn onNavigate={(tab) => navigateToTab(tab)} />
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
        ) : (activeTab === 'subject' || activeTab === 'subject-detail') ? (
          <SubjectDetailPage
            subjectData={selectedSubjectData}
            onBack={() => {
              navigateToTab('notes');
            }}
            onNavigate={(tab, data) => {
              if (tab === 'subject' && data) {
                handleOpenSubject(data);
              } else {
                navigateToTab(tab, data);
              }
            }}
          />
        ) : activeTab === 'resume-maker' ? (
          <ResumeMakerPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'plagiarism' ? (
          <PlagiarismCheckerPage
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
        ) : activeTab === 'more' ? (
          <MorePage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'progress' ? (
          <ProgressPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : activeTab === 'promotion' ? (
          <PromotionPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <Home
            onSearch={handleSearch}
            onSelectBranch={handleSelectBranch}
            onFeatureClick={handleFeatureClick}
            onSelectCourse={(courseId) => {
              let courseKey = 'B.Tech';
              if (courseId === 'bca') courseKey = 'BCA';
              else if (courseId === 'mca') courseKey = 'MCA';
              else if (courseId === 'mba') courseKey = 'MBA';
              else if (courseId === 'bpharm') courseKey = 'B.Pharm';
              else if (courseId === 'bba') courseKey = 'BBA';
              else if (courseId === 'mtech') courseKey = 'M.Tech';
              handleCourseSelected(courseKey, 'notes');
            }}
            onSelectYear={handleSelectYear}
            onOpenAI={() => setIsAIModalOpen(true)}
            onNavigate={navigateToTab}
            onOpenSubject={handleOpenSubject}
          />
        )}
      </main>

      {/* Footer */}
      {!hideTopNav && (
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

      {/* Mobile Bottom Navigation */}
      {!isStandaloneAuth && (
        <MobileBottomNav
          activeTab={activeTab}
          onNavigate={(tab) => navigateToTab(tab)}
        />
      )}

      {/* Universal Cookie Consent System (Desktop + Mobile) */}
      <CookieConsent />
    </div>
  );
}
