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
import PWAInstallPopup from './components/PWAInstallPopup';
import MobileBottomNav from './components/MobileBottomNav';
import MobileHeader from './components/MobileHeader';
import CookieConsent from './components/CookieConsent';
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import SeoHead from './components/SeoHead';
import StarfieldBackground from './components/StarfieldBackground';
import useScrollReveal from './utils/useScrollReveal';
import { useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import { normalizeCourseKey } from './data/courseMapping.ts';

import { Clock } from 'lucide-react';
// High-Traffic Primary Pages (Eagerly Loaded for Instant First Paint)
import PYQsPage from './pages/PYQsPage';
import NotesPage from './pages/NotesPage';
import SyllabusPage from './pages/SyllabusPage';
import QuizzesPage from './pages/QuizzesPage';
import AIStudyPage from './pages/AIStudyPage';
import InterviewProPage from './pages/InterviewProPage';
import MorePage from './pages/MorePage';
import { updateSEOForRoute } from './utils/seoManager';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SubjectPage from './pages/SubjectPage';
import HoollowPage from './pages/HoollowPage';

// Safe lazy-load wrapper that auto-reloads if a new deployment invalidated chunk hashes
const safeLazy = (factory) =>
  React.lazy(() =>
    factory().catch((err) => {
      console.warn('[ProfessorVirus] Dynamic chunk import failed:', err);
      if (typeof window !== 'undefined') {
        const key = 'pv_chunk_reload_' + window.location.pathname;
        const last = window.sessionStorage.getItem(key);
        const now = Date.now();
        if (!last || now - parseInt(last, 10) > 12000) {
          window.sessionStorage.setItem(key, String(now));
          window.location.reload();
          return new Promise(() => {});
        }
      }
      throw err;
    })
  );

// Heavy & Specialized Tools (Route-Based Lazy Loaded for 1,000 Concurrent Users Optimization)
const ResumeMakerPage = safeLazy(() => import('./pages/ResumeMakerPage'));
const PdfMakerPage = safeLazy(() => import('./pages/PdfMakerPage'));
const ResultCgpaPage = safeLazy(() => import('./pages/ResultCgpaPage'));
const AttendanceCalculatorPage = safeLazy(() => import('./pages/AttendanceCalculatorPage'));
const CompetitiveExamsPage = safeLazy(() => import('./pages/CompetitiveExamsPage'));
const ImportantLinksPage = safeLazy(() => import('./pages/ImportantLinksPage'));
const ProjectIdeasPage = safeLazy(() => import('./pages/ProjectIdeasPage'));
const ProjectDetailPage = safeLazy(() => import('./pages/ProjectDetailPage'));
const InternshipsJobsPage = safeLazy(() => import('./pages/InternshipsJobsPage'));
const OpportunityDetailPage = safeLazy(() => import('./pages/OpportunityDetailPage'));
const ScholarshipsPage = safeLazy(() => import('./pages/ScholarshipsPage'));
const ScholarshipDetailPage = safeLazy(() => import('./pages/ScholarshipDetailPage'));
const TimetablePage = safeLazy(() => import('./pages/TimetablePage'));
const AdminDashboard = safeLazy(() => import('./pages/AdminDashboard'));
const PlagiarismCheckerPage = safeLazy(() => import('./pages/PlagiarismCheckerPage'));
const ProgressPage = safeLazy(() => import('./pages/ProgressPage'));
const PromotionPage = safeLazy(() => import('./pages/PromotionPage'));

// Interview Pro Rounds (Lazy Loaded)
const InterviewConfirmPage = safeLazy(() => import('./pages/InterviewConfirmPage'));
const InterviewInstructionsPage = safeLazy(() => import('./pages/InterviewInstructionsPage'));
const InterviewAptitudePage = safeLazy(() => import('./pages/InterviewAptitudePage'));
const InterviewCodingPage = safeLazy(() => import('./pages/InterviewCodingPage'));
const InterviewTechnicalPage = safeLazy(() => import('./pages/InterviewTechnicalPage'));
const InterviewHrPage = safeLazy(() => import('./pages/InterviewHrPage'));
const InterviewReportPage = safeLazy(() => import('./pages/InterviewReportPage'));

// Dedicated PRMA Tech Internship Portal & Corporate Website (Lazy Loaded)
const PrmaCompanyHomePage = safeLazy(() => import('./prmaPortal/pages/PrmaCompanyHomePage'));
const PrmaServicesPage = safeLazy(() => import('./prmaPortal/pages/PrmaServicesPage'));
const PrmaAboutPage = safeLazy(() => import('./prmaPortal/pages/PrmaAboutPage'));
const PrmaCareersPage = safeLazy(() => import('./prmaPortal/pages/PrmaCareersPage'));
const PrmaProjectsPage = safeLazy(() => import('./prmaPortal/pages/PrmaProjectsPage'));
const PrmaContactPage = safeLazy(() => import('./prmaPortal/pages/PrmaContactPage'));
const PrmaAdminPanel = safeLazy(() => import('./prmaPortal/pages/PrmaAdminPanel'));
const PrmaLandingPage = safeLazy(() => import('./prmaPortal/pages/PrmaLandingPage'));
const PrmaDomainsPage = safeLazy(() => import('./prmaPortal/pages/PrmaDomainsPage'));
const PrmaApplyWizardPage = safeLazy(() => import('./prmaPortal/pages/PrmaApplyWizardPage'));
const PrmaGoodiesPage = safeLazy(() => import('./prmaPortal/pages/PrmaGoodiesPage'));
const PrmaReviewPage = safeLazy(() => import('./prmaPortal/pages/PrmaReviewPage'));
const PrmaPaymentPage = safeLazy(() => import('./prmaPortal/pages/PrmaPaymentPage'));
const PrmaAuthPage = safeLazy(() => import('./prmaPortal/pages/PrmaAuthPage'));
const PrmaDashboardPage = safeLazy(() => import('./prmaPortal/pages/PrmaDashboardPage'));
const PrmaVerifyOfferPage = safeLazy(() => import('./prmaPortal/pages/PrmaVerifyOfferPage'));
const PrmaSubmissionPortal = safeLazy(() => import('./prmaPortal/pages/PrmaSubmissionPortal'));
import { PrmaApplicationProvider } from './prmaPortal/context/PrmaApplicationContext';

function ViewLoadingFallback() {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.85rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        width: '38px',
        height: '38px',
        border: `3px solid ${isDark ? 'rgba(255, 184, 0, 0.15)' : 'rgba(139, 16, 29, 0.15)'}`,
        borderTopColor: isDark ? '#FFB800' : '#8B101D',
        borderRadius: '50%',
        animation: 'pv-spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isDark ? '#A1A1AA' : '#64748B' }}>
        Loading experience...
      </span>
      <style>{`@keyframes pv-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Exact Reference Image 1 & 2 Screens
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import SelectCoursePage from './pages/SelectCoursePage';
import CourseLandingPage from './pages/CourseLandingPage';
import { 
  courseKeyToSlug, 
  slugToCourseKey, 
  yearToSlug, 
  slugToYear, 
  semToSlug, 
  slugToSem 
} from './utils/academicUrls';
import SelectYearPage from './pages/SelectYearPage';
import SelectSubjectPage from './pages/SelectSubjectPage';
import SubjectDetailPage from './pages/SubjectDetailPage';

export default function App() {
  useScrollReveal();
  const { theme, isDark } = useTheme();

  const [adminAuthToken, setAdminAuthToken] = useState(() => {
    return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') || null;
  });

  const isAdminAuthenticated = () => {
    const token = adminAuthToken || localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
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

  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
      setAdminAuthToken(currentToken || null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAdminLoginSuccess = (token, user) => {
    if (token) setAdminAuthToken(token);
    navigateToTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setAdminAuthToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    navigateToTab('admin-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const parseCourseFromUrl = () => {
    try {
      const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
      if (path.startsWith('courses/')) {
        const parts = path.split('/').filter(Boolean);
        if (parts[1]) {
          return slugToCourseKey(parts[1]) || 'BTech';
        }
      }
      const params = new URLSearchParams(window.location.search);
      const c = params.get('course');
      if (c) {
        return normalizeCourseKey(c) || 'BTech';
      }
      const saved = localStorage.getItem('campusprep_selected_course');
      if (saved) return normalizeCourseKey(saved) || saved;
    } catch (e) {}
    return 'BTech';
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
    if (path === 'select-course' || path === 'courses') return 'courses';
    if (path.startsWith('courses/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length === 2 && parts[1]) {
        return 'course-detail';
      }
      if (parts.length === 3 && parts[1] && parts[2]) {
        return 'year-detail';
      }
      if (parts.length === 4 && parts[1] && parts[2] && parts[3]) {
        return 'semester-detail';
      }
      if (parts.length >= 5 || (parts[2] === 'subject' && parts[3])) {
        return 'subject';
      }
      return 'course-detail';
    }
    if (path === 'select-year' || path === 'years') return 'select-year';
    if (path === 'select-subject' || path === 'subjects') return 'select-subject';
    if (path.startsWith('subject/') || path === 'subject' || path === 'subject-detail') return 'subject-detail';
    if (path === 'quizzes') return 'quizzes';
    if (path === 'interview-pro') return 'interview-pro';
    if (path === 'more') return 'more';
    if (path === 'progress' || path === 'analytics' || path === 'student-progress' || path === 'profile') return 'progress';
    if (path === 'hoollow' || path === 'hoolow') return 'hoollow';
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
    if (path === 'prma-tech' || path === 'prma') return 'prma-home';
    if (path === 'prma-tech/internships' || path === 'prma/internships') return 'prma-internships-home';
    if (path === 'prma-tech/services' || path === 'prma/services') return 'prma-services';
    if (path === 'prma-tech/about' || path === 'prma/about') return 'prma-about';
    if (path === 'prma-tech/careers' || path === 'prma/careers') return 'prma-internships-home';
    if (path === 'prma-tech/projects' || path === 'prma/projects') return 'prma-projects';
    if (path === 'prma-tech/contact' || path === 'prma/contact') return 'prma-contact';
    if (path === 'prma-tech/admin' || path === 'prma/admin') return 'prma-admin';
    if (path === 'prma-tech/internships/domains' || path === 'prma/domains') return 'prma-internships-domains';
    if (path === 'prma-tech/internships/apply' || path === 'prma/apply') return 'prma-internships-apply';
    if (path === 'prma-tech/internships/goodies' || path === 'prma/goodies') return 'prma-internships-goodies';
    if (path === 'prma-tech/internships/review' || path === 'prma/review') return 'prma-internships-review';
    if (path === 'prma-tech/internships/payment' || path === 'prma/payment') return 'prma-internships-payment';
    if (path === 'prma-tech/internships/register' || path === 'prma/register' || path === 'prma-tech/register') return 'prma-internships-register';
    if (path === 'prma-tech/internships/login' || path === 'prma/login' || path === 'prma-tech/login') return 'prma-internships-login';
    if (path === 'prma-tech/internships/dashboard' || path === 'prma/dashboard' || path === 'prma-tech/dashboard') return 'prma-internships-dashboard';
    if (path.startsWith('prma-tech/verify-offer') || path.startsWith('prma/verify-offer') || path.startsWith('prma-verify-offer')) return 'prma-verify-offer';
    if (path.startsWith('prma-tech/submit') || path.startsWith('prma/submit') || path.startsWith('prma-submit')) return 'prma-submit';
    if (['signin', 'signup', 'select-course', 'select-year', 'select-subject', 'subject-detail', 'login', 'more', 'timetable', 'attendance-calculator', 'competitive-exams', 'important-links', 'resume-maker', 'pdf-maker', 'result-cgpa', 'project-ideas', 'internships-jobs', 'scholarships', 'pyqs', 'notes', 'syllabus', 'quizzes', 'interview-pro', 'interview-confirm', 'interview-instructions', 'interview-start', 'interview-aptitude', 'interview-coding', 'interview-technical', 'interview-hr', 'interview-report', 'aistudy', 'planner', 'progress', 'promotion', 'hoollow', 'hoolow', 'home', 'admin', 'admin-login', 'subject'].includes(path)) {
      if (path === 'aistudy') return 'interview-pro';
      if (path === 'hoolow') return 'hoollow';
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
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showSplash, setShowSplash] = useState(true);

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

    // Use stored course or fall back to BTech — never block navigation with a popup
    const courseToUse = (courseOverride !== undefined && courseOverride !== null)
      ? (normalizeCourseKey(courseOverride) || courseOverride)
      : (selectedCourse || 'BTech');

    if (!selectedCourse && courseToUse) {
      setSelectedCourse(courseToUse);
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
      } else if (tab === 'courses' || tab === 'select-course') {
        setActiveTabState('courses');
        targetPath = '/courses/';
      } else if (tab === 'course-detail') {
        setActiveTabState('course-detail');
        const cKey = (courseOverride && typeof courseOverride === 'object' && courseOverride.courseKey) ? courseOverride.courseKey : courseToUse;
        const cSlug = courseKeyToSlug(cKey);
        targetPath = `/courses/${cSlug}/`;
      } else if (tab === 'year-detail') {
        setActiveTabState('year-detail');
        const cKey = (courseOverride && typeof courseOverride === 'object' && courseOverride.courseKey) ? courseOverride.courseKey : courseToUse;
        const cSlug = courseKeyToSlug(cKey);
        const yVal = (courseOverride && typeof courseOverride === 'object' && courseOverride.year) ? courseOverride.year : (selectedYear || '1st Year');
        setSelectedYear(yVal);
        targetPath = `/courses/${cSlug}/${yearToSlug(yVal)}/`;
      } else if (tab === 'semester-detail') {
        setActiveTabState('semester-detail');
        const cKey = (courseOverride && typeof courseOverride === 'object' && courseOverride.courseKey) ? courseOverride.courseKey : courseToUse;
        const cSlug = courseKeyToSlug(cKey);
        const yVal = (courseOverride && typeof courseOverride === 'object' && courseOverride.year) ? courseOverride.year : (selectedYear || '1st Year');
        const sVal = (courseOverride && typeof courseOverride === 'object' && courseOverride.semester) ? courseOverride.semester : (selectedSemester || 'Sem 1');
        setSelectedYear(yVal);
        setSelectedSemester(sVal);
        targetPath = `/courses/${cSlug}/${yearToSlug(yVal)}/${semToSlug(sVal)}/`;
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
      } else if (tab === 'progress' || tab === 'profile') {
        setActiveTabState('progress');
        targetPath = '/profile';
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
      } else if (tab === 'hoollow' || tab === 'hoolow') {
        targetPath = '/hoollow';
      } else if (tab === 'prma-home') {
        targetPath = '/prma-tech';
      } else if (tab === 'prma-services') {
        targetPath = '/prma-tech/services';
      } else if (tab === 'prma-about') {
        targetPath = '/prma-tech/about';
      } else if (tab === 'prma-careers') {
        targetPath = '/prma-tech/careers';
      } else if (tab === 'prma-projects') {
        targetPath = '/prma-tech/projects';
      } else if (tab === 'prma-contact') {
        targetPath = '/prma-tech/contact';
      } else if (tab === 'prma-admin') {
        targetPath = '/prma-tech/admin';
      } else if (tab === 'prma-internships-home') {
        targetPath = '/prma-tech/internships';
      } else if (tab === 'prma-internships-domains') {
        targetPath = '/prma-tech/internships/domains';
      } else if (tab === 'prma-internships-apply') {
        targetPath = '/prma-tech/internships/apply';
      } else if (tab === 'prma-internships-goodies') {
        targetPath = '/prma-tech/internships/goodies';
      } else if (tab === 'prma-internships-review') {
        targetPath = '/prma-tech/internships/review';
      } else if (tab === 'prma-internships-payment') {
        targetPath = '/prma-tech/internships/payment';
      } else if (tab === 'prma-internships-register') {
        targetPath = '/prma-tech/internships/register';
      } else if (tab === 'prma-internships-login') {
        targetPath = '/prma-tech/internships/login';
      } else if (tab === 'prma-internships-dashboard') {
        targetPath = '/prma-tech/internships/dashboard';
      } else if (tab === 'prma-verify-offer') {
        targetPath = '/prma-tech/verify-offer';
      } else if (tab === 'prma-submit') {
        targetPath = window.location.pathname.startsWith('/prma-tech/submit') ? window.location.pathname : '/prma-tech/submit';
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
        setActiveTabState('courses');
      } else if (path.startsWith('courses/')) {
        const parts = path.split('/').filter(Boolean);
        if (parts[1]) {
          const c = slugToCourseKey(parts[1]);
          setSelectedCourse(c);
        }
        if (parts.length === 2) {
          setActiveTabState('course-detail');
        } else if (parts.length === 3 && parts[2]) {
          setSelectedYear(slugToYear(parts[2]));
          setActiveTabState('year-detail');
        } else if (parts.length === 4 && parts[2] && parts[3]) {
          setSelectedYear(slugToYear(parts[2]));
          setSelectedSemester(slugToSem(parts[3]));
          setActiveTabState('semester-detail');
        } else if (parts.length >= 5 || (parts[2] === 'subject' && parts[3])) {
          const subCode = parts[2] === 'subject' ? parts[3] : parts[4];
          setSelectedSubjectData(prev => ({ ...(prev || {}), code: subCode, course: selectedCourse }));
          setActiveTabState('subject');
        }
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
      } else if (path === 'hoollow' || path === 'hoolow') {
        setActiveTabState('hoollow');
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
      } else if (path === 'prma-tech' || path === 'prma') {
        setActiveTabState('prma-home');
      } else if (path === 'prma-tech/internships' || path === 'prma/internships') {
        setActiveTabState('prma-internships-home');
      } else if (path === 'prma-tech/services' || path === 'prma/services') {
        setActiveTabState('prma-services');
      } else if (path === 'prma-tech/about' || path === 'prma/about') {
        setActiveTabState('prma-about');
      } else if (path === 'prma-tech/careers' || path === 'prma/careers') {
        setActiveTabState('prma-internships-home');
        window.history.replaceState({ tab: 'prma-internships-home' }, '', '/prma-tech/internships');
      } else if (path === 'prma-tech/projects' || path === 'prma/projects') {
        setActiveTabState('prma-projects');
      } else if (path === 'prma-tech/contact' || path === 'prma/contact') {
        setActiveTabState('prma-contact');
      } else if (path === 'prma-tech/admin' || path === 'prma/admin') {
        setActiveTabState('prma-admin');
      } else if (path === 'prma-tech/internships/domains' || path === 'prma/domains') {
        setActiveTabState('prma-internships-domains');
      } else if (path === 'prma-tech/internships/apply' || path === 'prma/apply') {
        setActiveTabState('prma-internships-apply');
      } else if (path === 'prma-tech/internships/goodies' || path === 'prma/goodies') {
        setActiveTabState('prma-internships-goodies');
      } else if (path === 'prma-tech/internships/review' || path === 'prma/review') {
        setActiveTabState('prma-internships-review');
      } else if (path === 'prma-tech/internships/payment' || path === 'prma/payment') {
        setActiveTabState('prma-internships-payment');
      } else if (path === 'prma-tech/internships/register' || path === 'prma/register' || path === 'prma-tech/register') {
        setActiveTabState('prma-internships-register');
      } else if (path === 'prma-tech/internships/login' || path === 'prma/login' || path === 'prma-tech/login') {
        setActiveTabState('prma-internships-login');
      } else if (path === 'prma-tech/internships/dashboard' || path === 'prma/dashboard' || path === 'prma-tech/dashboard') {
        setActiveTabState('prma-internships-dashboard');
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
    updateSEOForRoute(activeTab, selectedCourse, selectedSubjectData);
  }, [activeTab, selectedCourse, selectedSubjectData]);

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

  const isPrmaPortal = typeof activeTab === 'string' && activeTab.startsWith('prma');
  const isStandaloneAuth = activeTab === 'signin' || activeTab === 'signup' || activeTab === 'login' || activeTab === 'admin' || activeTab === 'admin-login';
  const hideTopNav = isStandaloneAuth || isPrmaPortal;

  const pagesWithOwnMobileHeader = [
    'home', 'notes', 'pyqs', 'more', 'progress', 'profile',
    'signin', 'signup', 'login', 'admin', 'admin-login', 'resume-maker',
    'prma-home', 'prma-services', 'prma-about', 'prma-careers', 'prma-projects', 'prma-contact', 'prma-admin',
    'prma-internships-home', 'prma-internships-domains', 'prma-internships-apply',
    'prma-internships-goodies', 'prma-internships-review', 'prma-internships-payment',
    'prma-internships-register', 'prma-internships-login', 'prma-internships-dashboard', 'prma-verify-offer'
  ];
  const showStandaloneMobileHeader = !hideTopNav && !pagesWithOwnMobileHeader.includes(activeTab);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', overflowX: 'hidden', backgroundColor: 'transparent', color: isDark ? '#FFFFFF' : '#1F2421', position: 'relative', zIndex: 1 }}>
      {/* Animated Deep Space Starfield Background */}
      <StarfieldBackground />

      {/* Dynamic SEO Head Manager */}
      <SeoHead
        activeTab={activeTab}
        selectedCourse={selectedCourse}
        selectedSubjectData={selectedSubjectData}
        selectedProjectSlug={selectedProjectSlug}
        selectedOpportunitySlug={selectedOpportunitySlug}
        selectedScholarshipSlug={selectedScholarshipSlug}
        selectedYear={selectedYear}
        selectedSemester={selectedSemester}
      />

      {/* Full-Screen Splash Screen (Both Mobile & Desktop on Initial Load) */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Responsive Navbar: Fixed and sticky across all routes with floating rounded Liquid Glass container */}
      {!hideTopNav && (
        <div
          className="pv-desktop-navbar-wrap"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <Navbar
            isHome={activeTab === 'home'}
            onSearch={(query) => handleSearch(query, selectedBranch)}
            onOpenAuth={handleOpenAuth}
            activeTab={activeTab === 'profile' ? 'progress' : activeTab}
            setActiveTab={(tab) => {
              navigateToTab(tab);
            }}
          />
        </div>
      )}

      {/* Standalone Mobile Header: Dedicated single mobile header for sub-routes, shown only on mobile */}
      {showStandaloneMobileHeader && (
        <div className="pv-mobile-header-wrap">
          <MobileHeader
            activeTab={activeTab}
            onNavigate={(tab) => navigateToTab(tab)}
            selectedCourse={selectedCourse}
            onOpenUpdates={() => {
              const modal = document.querySelector('[data-student-updates-modal]');
              if (modal) modal.style.display = 'block';
            }}
            onOpenSearch={() => navigateToTab('notes')}
          />
        </div>
      )}

      {/* Main Content View Switcher: Top padding applied on non-home sub-routes so content starts cleanly below the sticky floating navbar */}
      <main style={{ flex: 1, paddingTop: (activeTab === 'home' || isPrmaPortal || isStandaloneAuth) ? 0 : '76px' }}>
        <ErrorBoundary 
          key={activeTab} 
          resetKey={activeTab} 
          title="This page encountered an issue"
          onNavigate={navigateToTab}
        >
          <React.Suspense fallback={<ViewLoadingFallback />}>
          {activeTab === 'signin' ? (
          <SignIn onNavigate={(tab) => navigateToTab(tab)} />
        ) : activeTab === 'signup' ? (
          <SignUp onNavigate={(tab) => navigateToTab(tab)} />
        ) : (activeTab === 'select-course' || activeTab === 'courses') ? (
          <SelectCoursePage onNavigate={(tab, data) => navigateToTab(tab, data)} />
        ) : (activeTab === 'course-detail' || activeTab === 'year-detail' || activeTab === 'semester-detail') ? (
          <CourseLandingPage 
            courseKey={selectedCourse}
            yearParam={selectedYear}
            semParam={selectedSemester}
            onNavigate={(tab, data) => navigateToTab(tab, data)}
            onSelectSubject={handleOpenSubject}
          />
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
            key={`notes-${selectedCourse || 'B.Tech'}`}
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
            key={`pyqs-${selectedCourse || 'B.Tech'}`}
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
              onLogout={handleAdminLogout}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={handleAdminLoginSuccess}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )
        ) : activeTab === 'admin-login' ? (
          isAdminAuthenticated() ? (
            <AdminDashboard
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={handleAdminLogout}
            />
          ) : (
            <AdminLoginPage
              onLoginSuccess={handleAdminLoginSuccess}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )
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
        ) : activeTab === 'prma-home' ? (
          <PrmaApplicationProvider>
            <PrmaCompanyHomePage navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-services' ? (
          <PrmaApplicationProvider>
            <PrmaServicesPage navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-about' ? (
          <PrmaApplicationProvider>
            <PrmaAboutPage navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-careers' ? (
          <PrmaApplicationProvider>
            <PrmaCareersPage navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-projects' ? (
          <PrmaApplicationProvider>
            <PrmaProjectsPage navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-contact' ? (
          <PrmaApplicationProvider>
            <PrmaContactPage navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-admin' ? (
          <PrmaApplicationProvider>
            <PrmaAdminPanel navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-home' ? (
          <PrmaApplicationProvider>
            <PrmaLandingPage navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-domains' ? (
          <PrmaApplicationProvider>
            <PrmaDomainsPage navigateToTab={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-apply' ? (
          <PrmaApplicationProvider>
            <PrmaApplyWizardPage navigateToTab={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-goodies' ? (
          <PrmaApplicationProvider>
            <PrmaGoodiesPage navigateToTab={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-review' ? (
          <PrmaApplicationProvider>
            <PrmaReviewPage navigateToTab={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-payment' ? (
          <PrmaApplicationProvider>
            <PrmaPaymentPage navigateToTab={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-register' ? (
          <PrmaApplicationProvider>
            <PrmaAuthPage initialMode="register" navigateToTab={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-login' ? (
          <PrmaApplicationProvider>
            <PrmaAuthPage initialMode="login" navigateToTab={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-internships-dashboard' ? (
          <PrmaApplicationProvider>
            <PrmaDashboardPage navigateToTab={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-verify-offer' ? (
          <PrmaApplicationProvider>
            <PrmaVerifyOfferPage navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
        ) : activeTab === 'prma-submit' ? (
          <PrmaApplicationProvider>
            <PrmaSubmissionPortal navigateToTab={navigateToTab} onNavigate={navigateToTab} />
          </PrmaApplicationProvider>
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
            onNavigate={(tab, courseKey) => {
              navigateToTab(tab, courseKey);
            }}
          />
        ) : (activeTab === 'progress' || activeTab === 'profile') ? (
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
        ) : (activeTab === 'hoollow' || activeTab === 'hoolow') ? (
          <HoollowPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
          />
        ) : (
          <Home
            onSearch={handleSearch}
            onSelectBranch={handleSelectBranch}
            onFeatureClick={handleFeatureClick}
            onSelectCourse={(courseId, courseKey) => {
              // CourseCardsSection passes (course.id, course.key)
              // Use centralized normalizeCourseKey for stable mapping
              const resolved = normalizeCourseKey(courseKey) || normalizeCourseKey(courseId) || 'BTech';
              handleCourseSelected(resolved, 'notes');
            }}
            onSelectYear={handleSelectYear}
            onOpenAI={() => setIsAIModalOpen(true)}
            onNavigate={navigateToTab}
            onOpenSubject={handleOpenSubject}
          />
        )}
          </React.Suspense>
        </ErrorBoundary>
      </main>

      {/* Universal Footer: Rendered on all pages across desktop and mobile */}
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
      {!isPrmaPortal && <StayConnectedPopup />}

      {/* Universal Android + iOS PWA Installation Popup */}
      {!isPrmaPortal && <PWAInstallPopup />}

      {/* Mobile Bottom Navigation */}
      {!isStandaloneAuth && !isPrmaPortal && (
        <MobileBottomNav
          activeTab={activeTab}
          onNavigate={(tab) => navigateToTab(tab)}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Universal Cookie Consent System (Desktop + Mobile) */}
      <CookieConsent />
    </div>
  );
}
