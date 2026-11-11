import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Award,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Download,
  MessageCircle,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Share2,
  Building2,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { usePrmaApplication } from '../context/PrmaApplicationContext';
import { PRMA_GOODIES } from '../data/prmaGoodies';

export default function PrmaDashboardPage({ navigateToTab, onNavigate }) {
  const {
    currentUser,
    selectedDomain,
    studentDetails,
    applicationId
  } = usePrmaApplication();

  const navFn = navigateToTab || onNavigate;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'goodies' | 'curriculum' | 'certificate' | 'support'
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [appData, setAppData] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [lightboxGoodie, setLightboxGoodie] = useState(null);

  // Initial load: search using context or local storage or seed
  useEffect(() => {
    const defaultSearch = applicationId || studentDetails.email || (currentUser && currentUser.email) || 'PRMA94821034';
    if (defaultSearch) {
      fetchStatus(defaultSearch);
    }
  }, [applicationId, studentDetails.email, currentUser]);

  const fetchStatus = async (identifier) => {
    if (!identifier) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/prma/applications/status/${encodeURIComponent(identifier.trim())}`);
      const data = await res.json();
      if (res.ok && data.success && data.application) {
        setAppData(data.application);
      } else {
        // Fallback default mock if offline
        setAppData({
          applicationId: identifier,
          offerId: 'PRMA/INT/A1/93084',
          student: {
            fullName: studentDetails.fullName || currentUser?.name || 'Priyanshu Kumar',
            email: studentDetails.email || currentUser?.email || 'priyanshu@gmail.com',
            college: studentDetails.college || 'AKGEC Ghaziabad',
            branch: studentDetails.branch || 'CSE (AI & ML)'
          },
          domain: {
            title: selectedDomain?.title || 'Machine Learning'
          },
          joiningDate: '17-Nov-2026',
          completionDate: '17-Dec-2026',
          duration: '1 Month',
          mode: 'Remote',
          fee: '100% Free',
          status: 'shortlisted'
        });
      }
    } catch (err) {
      console.warn('Dashboard fetch offline fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    fetchStatus(searchId.trim());
  };

  const candidateName = appData?.student?.fullName || studentDetails.fullName || currentUser?.name || 'Priyanshu Kumar';
  const domainTitle = appData?.domain?.title || selectedDomain?.title || 'Machine Learning';
  const isShortlisted = appData?.status === 'shortlisted';
  const offerId = appData?.offerId || 'PRMA/INT/A1/93084';
  const joiningDate = appData?.joiningDate || '17-Nov-2026';
  const displayAppId = appData?.applicationId || applicationId || 'PRMA94821034';

  const copyOfferId = () => {
    navigator.clipboard.writeText(offerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyShareText = () => {
    const text = `Excited to share that I have been shortlisted for the 1-Month Virtual Internship Program at PRMA Tech in the domain of ${domainTitle}! Looking forward to working on real-world industry projects, learning from expert mentors, and innovating with the PRMA Tech team. 🚀\n\n#PRMATech #VirtualInternship #Technology #Engineering #CareerGrowth`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PrmaNavbar activeTab="dashboard" onNavigate={navFn} navigateToTab={navFn} />

      {/* Top Banner / Hero */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-2xl font-black text-white shadow-lg flex-shrink-0">
              {candidateName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isShortlisted ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950'
                }`}>
                  {isShortlisted ? '✓ SHORTLISTED' : 'UNDER REVIEW'}
                </span>
                <span className="text-xs text-slate-400 font-mono">App ID: {displayAppId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {candidateName}!
              </h1>
              <p className="text-sm text-slate-300 mt-0.5">
                {domainTitle} &bull; 1 Month Program &bull; 100% Free Internship
              </p>
            </div>
          </div>

          {/* Quick Search Widget */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 ml-2.5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Track other App ID or Email..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 px-2 py-1.5 focus:outline-none w-full"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex-shrink-0"
            >
              Track
            </button>
          </form>
        </div>
      </section>

      {/* Tabs Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'My Internship Status', icon: Calendar },
            { id: 'curriculum', label: '1-Month Roadmap', icon: BookOpen },
            { id: 'goodies', label: 'Goodies Suite (Coming Soon)', icon: Package },
            { id: 'certificate', label: 'Certificate Verification', icon: Award },
            { id: 'support', label: 'Help & Documents', icon: FileText }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* TAB 1: OVERVIEW & STATUS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Shortlisted Announcement Card */}
            {isShortlisted ? (
              <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Official Selection Notice &bull; Offer Letter Issued
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Congratulations, {candidateName}!
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                      You have been successfully shortlisted for the <strong>{domainTitle}</strong> Virtual Internship at PRMA Tech. Your official vector PDF joining letter has been generated with dynamic verification credentials.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Offer ID</span>
                        <div className="flex items-center gap-1 font-mono font-bold text-white mt-0.5">
                          <span>{offerId}</span>
                          <button onClick={copyOfferId} className="text-slate-400 hover:text-white" title="Copy Offer ID">
                            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Program Duration</span>
                        <span className="font-bold text-white mt-0.5 block">1 Month</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Joining Date</span>
                        <span className="font-bold text-emerald-400 mt-0.5 block">{joiningDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Program Fee</span>
                        <span className="font-bold text-emerald-300 mt-0.5 block">100% Free</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
                    <a
                      href={`/api/prma/admin/applications/${encodeURIComponent(displayAppId)}/offer-letter`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/40 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download Official Offer Letter (PDF)
                    </a>

                    <a
                      href={`/prma-tech/verify-offer/${encodeURIComponent(offerId)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Verify Offer Authenticity
                    </a>

                    <button
                      type="button"
                      onClick={copyShareText}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
                    >
                      <Share2 className="w-4 h-4 text-blue-300" />
                      {copiedShare ? 'Copied LinkedIn Announcement!' : 'Share on LinkedIn'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Application Under Academic Review</h2>
                    <p className="text-xs text-slate-500">Unique Application ID: <span className="font-mono font-bold text-slate-900">{displayAppId}</span></p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                  Your application for the 1-Month <strong>{domainTitle}</strong> Virtual Internship has been received. Our review committee evaluates profiles on academic excellence, project portfolio, and motivation. You will receive an email notice as soon as your profile is shortlisted.
                </p>
              </div>
            )}

            {/* Program Milestones Progress */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Internship Lifecycle Stages</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {[
                  { step: '01', title: 'Application Submitted', desc: '100% Free registration', done: true },
                  { step: '02', title: 'Academic Screening', desc: 'Domain & skills audit', done: true },
                  { step: '03', title: 'Offer Letter Issued', desc: 'Vector A4 PDF with QR', done: isShortlisted, active: !isShortlisted },
                  { step: '04', title: '1-Month Practical Track', desc: 'Milestone projects', done: false },
                  { step: '05', title: 'Verified Certificate & Stipend', desc: 'Top 20% performance audit', done: false }
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition ${
                      s.done
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : s.active
                        ? 'bg-blue-50 border-blue-300 text-blue-950 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black">{s.step}</span>
                      {s.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : s.active ? (
                        <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <div className="font-bold text-sm">{s.title}</div>
                    <div className="text-xs mt-1 opacity-80">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Program Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Duration & Format</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">1 Month Fixed</div>
                <p className="text-xs text-slate-500 mt-1">100% Remote, Flexible weekly submissions</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Program Fee</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-2">100% Free</div>
                <p className="text-xs text-slate-500 mt-1">Zero enrollment or hidden certification fees</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Performance Stipend</span>
                <div className="text-2xl font-extrabold text-blue-600 mt-2">₹1,000 &ndash; ₹10,000</div>
                <p className="text-xs text-slate-500 mt-1">Awarded to top 20% meritorious interns</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 1-MONTH CURRICULUM ROADMAP */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-extrabold text-slate-900">4-Week Practical Project Curriculum</h3>
              <p className="text-slate-500 text-sm mt-1">
                Structured hands-on engineering syllabus designed for the <strong>{domainTitle}</strong> track.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {[
                  {
                    week: 'Week 1',
                    title: 'Architecture, Tooling & Environment Setup',
                    items: [
                      'Development workspace configuration and repository initialization',
                      'Design system, database schemas and architectural patterns',
                      'Git workflow, branch management and issue tracking',
                      'Milestone 1 artifact submission'
                    ]
                  },
                  {
                    week: 'Week 2',
                    title: 'Core Feature Engineering & APIs',
                    items: [
                      'Building primary application business logic and backend services',
                      'Authentication, authorization, and data validation layers',
                      'State management and third-party integrations',
                      'Milestone 2 progress check-in'
                    ]
                  },
                  {
                    week: 'Week 3',
                    title: 'Testing, Optimization & CI/CD Deployment',
                    items: [
                      'Unit testing, integration testing, and performance profiling',
                      'Security headers, CORS policies, and rate limiting audit',
                      'Automated cloud deployment (Vercel / AWS / Docker)',
                      'Pre-final demonstration video recording'
                    ]
                  },
                  {
                    week: 'Week 4',
                    title: 'Production Review & Evaluation Audit',
                    items: [
                      'Live project demonstration and source code submission',
                      'Industry mentor code review and architecture feedback',
                      'Final project presentation and documentation delivery',
                      'Issuance of Verified Certificate & Performance Stipend Audit'
                    ]
                  }
                ].map((w, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                      {w.week}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-lg mt-3">{w.title}</h4>
                    <ul className="mt-4 space-y-2 text-xs text-slate-600">
                      {w.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GOODIES SHOWCASE */}
        {activeTab === 'goodies' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold uppercase tracking-wider mb-2">
                    <Package className="w-3.5 h-3.5 text-purple-600" />
                    Intern Merchandise Suite &bull; Coming Soon
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Official PRMA Tech Goodies Collection</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    All products are part of our upcoming merchandise drop for enrolled interns. No payment or checkout is required.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navFn && navFn('prma-internships-goodies')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <Eye className="w-4 h-4" />
                  Open Fullscreen Showcase
                </button>
              </div>

              {/* 3x3 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {PRMA_GOODIES.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setLightboxGoodie(g)}
                    className="group bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-5 cursor-pointer transition shadow-xs hover:shadow-md flex flex-col"
                  >
                    <div className="relative h-48 bg-white rounded-xl mb-4 overflow-hidden flex items-center justify-center p-4 border border-slate-100">
                      <img src={g.image} alt={g.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white">
                        COMING SOON
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">{g.name}</h4>
                    <p className="text-xs text-purple-600 font-semibold mb-2">{g.subtitle}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{g.description}</p>
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-600">Free Kit Item</span>
                      <span className="text-blue-600 font-semibold group-hover:underline">Preview &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CERTIFICATE VERIFICATION */}
        {activeTab === 'certificate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-extrabold text-slate-900">Credential Verification & Trust Protocol</h3>
              <p className="text-slate-500 text-sm mt-1">
                Every PRMA Tech offer letter and completion certificate includes an anti-counterfeit QR code and cryptographic ID.
              </p>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mt-6 max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-base">Check Any Official Credential Online</h4>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Employers, universities, and students can authenticate any PRMA Tech credential instantly by entering the ID into our public verification registry.
                </p>
                <div className="flex gap-2">
                  <a
                    href={`/prma-tech/verify-offer/${encodeURIComponent(offerId)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Live Verification Screen
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HELP & DOCUMENTS */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-extrabold text-slate-900">Support & Corporate Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Corporate Headquarters</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    PRMA Tech<br />
                    Knowledge Park, Greater Noida,<br />
                    Uttar Pradesh – 201310, India
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Student & Academic Inquiries</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Email: <a href="mailto:support@prmatech.com" className="text-blue-600 font-semibold">support@prmatech.com</a><br />
                    Website: <a href="https://professorvirus.site/prma-tech" className="text-blue-600 font-semibold">professorvirus.site/prma-tech</a><br />
                    Response time: Within 24-48 business hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIGHTBOX MODAL */}
        {lightboxGoodie && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
              <button
                type="button"
                onClick={() => setLightboxGoodie(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center p-6 border border-slate-100 mb-6">
                <img src={lightboxGoodie.image} alt={lightboxGoodie.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-600 text-white mb-2">
                COMING SOON
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">{lightboxGoodie.name}</h3>
              <p className="text-xs text-purple-600 font-bold mb-3">{lightboxGoodie.subtitle}</p>
              <p className="text-xs text-slate-600 mb-4">{lightboxGoodie.description}</p>

              {lightboxGoodie.features && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Specifications</span>
                  <ul className="text-xs space-y-1.5 text-slate-700">
                    {lightboxGoodie.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={() => setLightboxGoodie(null)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </main>

      <PrmaFooter />
    </div>
  );
}
