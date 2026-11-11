import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Filter,
  Check,
  X,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  Laptop
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import PrmaDomainIcon from '../components/PrmaDomainIcon';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaDomainsPage({ navigateToTab, onNavigate }) {
  const { setSelectedDomainId } = usePrmaApplication();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tracks');
  const [detailModalDomain, setDetailModalDomain] = useState(null);

  const navFn = navigateToTab || onNavigate;

  const handleNav = (route) => {
    if (navFn) {
      navFn(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplyForDomain = (domain) => {
    setSelectedDomainId(domain.id);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('prma_selected_domain_id', domain.id);
      window.sessionStorage.setItem('prma_selected_domain_title', domain.title);
    }
    handleNav('prma-internships-apply');
  };

  const categories = useMemo(() => {
    const cats = new Set(PRMA_DOMAINS.map(d => d.category));
    return ['All Tracks', ...Array.from(cats)];
  }, []);

  // Filtered domains
  const filteredDomains = useMemo(() => {
    return PRMA_DOMAINS.filter((domain) => {
      const matchesSearch =
        domain.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        domain.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All Tracks' || domain.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <PrmaNavbar activeTab="internships" onNavigate={navFn} navigateToTab={navFn} />

      {/* TOP ANNOUNCEMENT BANNER — REQUIREMENT 2 */}
      <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            PRMA Tech™ Official Internship Initiative
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Welcome to PRMA Tech Internship Program!
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            PRMA Tech is an emerging technology startup committed to helping students improve their practical knowledge and develop industry-relevant technical skills. Our internship initiative is designed to provide students with learning opportunities, practical assignments, project-based exposure and professional guidance.
          </p>

          <div className="mt-4 inline-flex items-center gap-3 text-sm font-bold text-blue-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <span>Our Mission:</span>
            <span className="text-white">Learn &bull; Build &bull; Innovate &bull; Grow</span>
          </div>

          {/* Important Zero-Cost Announcement Card */}
          <div className="mt-8 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-left shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30 font-bold text-xl">
                ₹0
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider font-extrabold text-emerald-400">
                  Important Public Announcement &bull; 100% Free Program
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Zero Application Fee &bull; Zero Enrollment Fee
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  This internship program is currently offered <strong>FREE OF COST</strong> as part of our initiative to support students, enhance technical knowledge and encourage practical learning. We believe that financial limitations should not stop talented students from learning and developing their skills.
                </p>
                <p className="text-sm text-emerald-300 font-medium pt-1">
                  Keep working hard, build real projects, improve your skills and encourage your friends to explore learning opportunities with PRMA Tech.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOMAIN SELECTION STEP 1 — HEADER & CONTROLS */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block mb-1">
              Step 1 of 2 &bull; Select Your Internship Track
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore 27 Industry Internship Domains
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Choose your specialized engineering track. Selecting a domain will open your 100% Free application form with that domain pre-selected.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search domain, skills, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 16 DOMAIN CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredDomains.map((domain) => (
            <div
              key={domain.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-blue-400 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition group relative"
            >
              <div>
                {/* Header: Distinctive Domain Illustration + Badges */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-2 rounded-2xl bg-slate-50 group-hover:scale-105 transition">
                    <PrmaDomainIcon iconType={domain.iconType} className="w-14 h-14" color={domain.color} />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      100% FREE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">
                      Remote Internship
                    </span>
                  </div>
                </div>

                {/* Domain Title */}
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                  {domain.title}
                </h3>
                <div className="text-xs text-slate-400 font-semibold mb-3">
                  Duration: Exactly 1 Month &bull; {domain.category}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {domain.description}
                </p>

                {/* Technologies Covered */}
                <div className="mb-4">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Technologies Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.technologies.slice(0, 5).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {domain.technologies.length > 5 && (
                      <span className="text-[10px] text-slate-400 font-semibold self-center">
                        +{domain.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills You Will Develop */}
                <div className="mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
                    Key Skills Developed:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {domain.skills.slice(0, 3).map((skill, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetailModalDomain(domain)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Syllabus
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyForDomain(domain)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm hover:shadow transition flex items-center justify-center gap-1.5"
                >
                  <span>Select Domain</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAIL SYLLABUS MODAL */}
      {detailModalDomain && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-scale-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalDomain(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <PrmaDomainIcon iconType={detailModalDomain.iconType} className="w-16 h-16" color={detailModalDomain.color} />
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  100% Free &bull; 1 Month Virtual Program
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{detailModalDomain.title}</h3>
                <span className="text-xs text-slate-400">{detailModalDomain.category}</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {detailModalDomain.description}
            </p>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold uppercase tracking-wider text-slate-500 block mb-2">Technologies Covered</span>
                <div className="flex flex-wrap gap-1.5">
                  {detailModalDomain.technologies.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <span className="font-extrabold uppercase tracking-wider text-blue-800 block mb-2">Capstone Practical Project</span>
                <p className="text-blue-950 font-medium leading-relaxed">{detailModalDomain.project}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold uppercase tracking-wider text-slate-500 block mb-2">Learning Outcomes</span>
                <ul className="space-y-1.5 text-slate-700">
                  {detailModalDomain.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDetailModalDomain(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const dom = detailModalDomain;
                  setDetailModalDomain(null);
                  handleApplyForDomain(dom);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition flex items-center gap-2"
              >
                <span>Select &amp; Fill Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <PrmaFooter />
    </div>
  );
}
