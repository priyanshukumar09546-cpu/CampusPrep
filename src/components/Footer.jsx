import React, { useState } from 'react';
import {
  Heart,
  ArrowRight,
  BookOpen,
  Briefcase,
  Headphones,
  Shield,
  FileText,
  HelpCircle,
  GraduationCap,
  TrendingUp,
  Mic,
  Lightbulb,
  Sparkles,
  FileCode,
  Landmark,
  LayoutGrid,
  Mail,
  Play,
  AlertTriangle,
  MessageSquare,
  RotateCcw,
  Cookie,
  Info,
  Users,
  ShieldCheck,
  Lock,
  BarChart2,
  X,
  Globe,
  Code,
  Cloud,
  Package,
  Award,
  Instagram,
  Linkedin,
  Monitor,
  ShoppingBag
} from 'lucide-react';
import './Footer.css';

export default function Footer({ onNavigate }) {
  // Active modal state for legal documents, FAQs, and security details
  const [activeModal, setActiveModal] = useState(null);

  const handleNav = (tab) => {
    if (onNavigate) {
      onNavigate(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openWhatsApp = (msg) => {
    const encoded = encodeURIComponent(msg || "Hi ProfessorVirus Team, I have an inquiry.");
    window.open(`https://wa.me/917668016628?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const openWhatsAppCommunity = () => {
    window.open("https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G", '_blank', 'noopener,noreferrer');
  };

  const openCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
    setActiveModal(null);
  };

  // 1. Column 2: Study Resources Links
  const studyResourcesLinks = [
    { label: 'AKTU Notes', icon: FileText, href: '/notes', action: () => handleNav('notes') },
    { label: 'Previous Year Question Papers', icon: FileText, href: '/pyqs', action: () => handleNav('pyqs') },
    { label: 'Syllabus', icon: BookOpen, href: '/syllabus', action: () => handleNav('syllabus') },
    { label: 'Quizzes', icon: HelpCircle, href: '/quizzes', action: () => handleNav('quizzes') },
    { label: 'Free Study Materials', icon: GraduationCap, href: '/notes', action: () => handleNav('notes') },
    { label: 'Quantum Series', icon: BarChart2, href: '/notes', action: () => handleNav('notes') },
    { label: 'Result & CGPA Analyzer', icon: TrendingUp, href: '/result-cgpa', action: () => handleNav('result-cgpa') }
  ];

  // 2. Column 3: Career & Tools Links
  const careerToolsLinks = [
    { label: 'Resume Maker', icon: FileText, href: '/resume-maker', action: () => handleNav('resume-maker') },
    { label: 'Interview Pro', icon: Mic, href: '/interview-pro', action: () => handleNav('interview-pro') },
    { label: 'Internships & Jobs', icon: Briefcase, href: '/internships-jobs', action: () => handleNav('internships-jobs') },
    { label: 'Project Ideas', icon: Lightbulb, href: '/project-ideas', action: () => handleNav('project-ideas') },
    { label: 'AI Study Tools', icon: Sparkles, href: '/interview-pro', action: () => handleNav('interview-pro') },
    { label: 'PDF Maker & Splitter', icon: FileCode, href: '/pdf-maker', action: () => handleNav('pdf-maker') },
    { label: 'Scholarships & Grants', icon: Landmark, href: '/scholarships', action: () => handleNav('scholarships') },
    { label: 'All Tools', icon: LayoutGrid, href: '/more', action: () => handleNav('more') }
  ];

  // 3. Column 4: PRMA Tech (Technology Partner) Links
  const prmaTechLinks = [
    { label: 'Remote Internships', icon: Monitor, href: '/internships-jobs', action: () => handleNav('internships-jobs') },
    { label: 'AI & ML Internship Track', icon: Globe, href: '/internships-jobs', action: () => handleNav('internships-jobs') },
    { label: 'Full-Stack Web Dev Track', icon: Code, href: '/internships-jobs', action: () => handleNav('internships-jobs') },
    { label: 'Cloud & DevOps Track', icon: Cloud, href: '/internships-jobs', action: () => handleNav('internships-jobs') },
    { label: 'PRMA Tech Services', icon: Sparkles, href: '#prma-services', action: () => openWhatsApp("Hi PRMA Tech Team, I am interested in software & technology solutions.") },
    { label: 'Physical Welcome Kit', icon: Package, href: '/internships-jobs', action: () => handleNav('internships-jobs') },
    { label: 'Verify Certificate', icon: Award, href: '/internships-jobs', action: () => handleNav('internships-jobs') }
  ];

  // 4. Column 5: Help & Support Links
  const helpSupportLinks = [
    { label: 'Contact Us', icon: Mail, action: () => openWhatsApp("Hi ProfessorVirus Support, I need assistance with the platform.") },
    { label: 'FAQs', icon: HelpCircle, action: () => setActiveModal('faqs') },
    { label: 'How It Works', icon: Play, action: () => setActiveModal('how-it-works') },
    { label: 'Report an Issue', icon: AlertTriangle, action: () => openWhatsApp("Hi ProfessorVirus Team, I would like to report an issue.") },
    { label: 'Help & Support', icon: MessageSquare, action: () => openWhatsApp("Hi ProfessorVirus Support, I have a query.") }
  ];

  // 5. Column 6: Legal Links
  const legalLinks = [
    { label: 'Privacy Policy', icon: FileText, action: () => setActiveModal('privacy') },
    { label: 'Terms & Conditions', icon: FileText, action: () => setActiveModal('terms') },
    { label: 'Refund Policy', icon: RotateCcw, action: () => setActiveModal('refund') },
    { label: 'Cookie Policy', icon: Cookie, action: () => setActiveModal('cookie') },
    { label: 'Disclaimer', icon: Info, action: () => setActiveModal('disclaimer') }
  ];

  // Trust Strip Cards Data
  const trustStripItems = [
    {
      icon: Users,
      title: 'Student First',
      desc: 'Built by students, for students.'
    },
    {
      icon: ShieldCheck,
      title: 'Privacy Focused',
      desc: 'Your data is safe and secure.'
    },
    {
      icon: Lock,
      title: 'Secure Experience',
      desc: 'Safe, trusted and reliable platform.'
    },
    {
      icon: BarChart2,
      title: 'Learning Resources',
      desc: 'Verified and regularly updated.'
    }
  ];

  return (
    <footer className="pv-footer-root">
      {/* BACKGROUND PALE ACADEMIC WATERMARK (Isometric Books & Mortarboard on Right) */}
      <div className="pv-footer-watermark" aria-hidden="true">
        <svg viewBox="0 0 360 260" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bottom Hardcover Book */}
          <path d="M 60 210 L 290 170 L 330 188 L 100 228 Z" fill="#E8D3B0" fillOpacity="0.15" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M 60 210 L 60 224 L 100 242 L 100 228 Z" fill="#D4AF37" fillOpacity="0.2" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M 100 242 L 330 202 L 330 188 L 100 228 Z" fill="#FAF7F2" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />

          {/* Middle Hardcover Book */}
          <path d="M 80 180 L 300 144 L 336 162 L 116 198 Z" fill="#E8D3B0" fillOpacity="0.2" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M 80 180 L 80 194 L 116 212 L 116 198 Z" fill="#D4AF37" fillOpacity="0.25" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M 116 212 L 336 176 L 336 162 L 116 198 Z" fill="#FAF7F2" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />

          {/* Top Hardcover Book */}
          <path d="M 100 150 L 310 118 L 342 136 L 132 168 Z" fill="#E8D3B0" fillOpacity="0.25" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M 100 150 L 100 164 L 132 182 L 132 168 Z" fill="#D4AF37" fillOpacity="0.3" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M 132 182 L 342 150 L 342 136 L 132 168 Z" fill="#FAF7F2" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" />

          {/* Graduation Mortarboard sitting on top */}
          <polygon points="210,60 315,95 210,122 105,88" fill="#FBF9F5" stroke="#B45309" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 150 110 Q 210 134 270 106 L 270 125 Q 210 152 150 125 Z" fill="#D4AF37" fillOpacity="0.2" stroke="#B45309" strokeWidth="1.2" />
          <circle cx="210" cy="91" r="3.5" fill="#B45309" />
          <path d="M 210 91 Q 165 98 140 125 L 136 160" fill="none" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
          <polygon points="132,158 140,158 142,172 130,172" fill="#B45309" />
        </svg>
      </div>

      <div className="pv-footer-container">
        {/* MAIN SIX-COLUMN FOOTER GRID */}
        <div className="pv-footer-grid">
          {/* COLUMN 1: ProfessorVirus Brand Info */}
          <div className="pv-footer-brand">
            {/* Logo Row */}
            <div className="pv-footer-logo-row">
              <div className="pv-footer-logo-circle" title="ProfessorVirus Academic Platform">
                <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="23" fill="#781416" stroke="#D4AF37" strokeWidth="1.8" />
                  {/* Graduation Cap */}
                  <polygon points="24,11 37,16 24,21 11,16" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M 16 18 Q 24 21.5 32 18 L 32 21 Q 24 24.5 16 21 Z" fill="#D4AF37" />
                  <circle cx="24" cy="16" r="1.5" fill="#D4AF37" />
                  <path d="M 24 16 Q 18 17 15 21 L 14.5 25" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" />
                  <polygon points="13.5,24.5 16,24.5 16,27 13.5,27" fill="#D4AF37" />
                  {/* Book Base */}
                  <path d="M 14 31 Q 20 29 24 32 Q 28 29 34 31 L 34 26 Q 28 24 24 27 Q 20 24 14 26 Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="1" />
                </svg>
              </div>

              <div>
                <div className="pv-footer-brand-title">
                  Professor<span className="pv-footer-brand-title-accent">Virus</span>
                </div>
                <div className="pv-footer-brand-tagline">
                  Study Smart. Prepare Better.
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="pv-footer-brand-desc">
              All-in-one academic platform for engineering, pharmacy, management and computer application students. Access notes, PYQs, syllabus, quizzes, interview prep, career tools and more — completely free.
            </p>

            {/* Social Icons Row */}
            <div className="pv-footer-social-row">
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="pv-footer-social-btn youtube"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/professorvirus.official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="pv-footer-social-btn instagram"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="pv-footer-social-btn linkedin"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.2a1.62 1.62 0 0 0-1.63 1.62c0 .89.73 1.62 1.63 1.62.9 0 1.63-.73 1.63-1.62 0-.89-.73-1.62-1.63-1.62z"/>
                </svg>
              </a>

              {/* X (formerly Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="pv-footer-social-btn x-twitter"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://whatsapp.com/channel/0029VbDAFGO77qVYFLIhGn1G"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Community"
                className="pv-footer-social-btn whatsapp"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </div>

            {/* Burgundy CTA Pill Button */}
            <button
              type="button"
              onClick={openWhatsAppCommunity}
              className="pv-footer-cta-btn"
            >
              <GraduationCap size={16} color="#D4AF37" strokeWidth={2.4} />
              <span>Join Students Across India</span>
              <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.4} />
            </button>

            {/* Official Tech Partner Box */}
            <div className="pv-footer-partner-box">
              <img
                src="/assets/prma_tech_logo.png"
                alt="PRMA Tech Official Logo"
                className="pv-footer-partner-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="pv-footer-partner-text">
                <div className="pv-footer-partner-badge">
                  OFFICIAL TECH PARTNER
                </div>
                <div className="pv-footer-partner-name">
                  PRMA Tech™ — Remote Internships & Solutions
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Study Resources */}
          <div className="pv-footer-col">
            <div className="pv-footer-col-header">
              <div className="pv-footer-col-icon-box">
                <BookOpen size={16} strokeWidth={2.4} />
              </div>
              <h3 className="pv-footer-col-title">Study Resources</h3>
            </div>

            <ul className="pv-footer-links-list">
              {studyResourcesLinks.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <li key={idx}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        item.action();
                      }}
                      className="pv-footer-link-item"
                    >
                      <span className="pv-footer-link-icon">
                        <ItemIcon size={15} strokeWidth={2.1} />
                      </span>
                      <span className="pv-footer-link-label">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 3: Career & Tools */}
          <div className="pv-footer-col">
            <div className="pv-footer-col-header">
              <div className="pv-footer-col-icon-box">
                <ShoppingBag size={16} strokeWidth={2.4} />
              </div>
              <h3 className="pv-footer-col-title">Career & Tools</h3>
            </div>

            <ul className="pv-footer-links-list">
              {careerToolsLinks.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <li key={idx}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        item.action();
                      }}
                      className="pv-footer-link-item"
                    >
                      <span className="pv-footer-link-icon">
                        <ItemIcon size={15} strokeWidth={2.1} />
                      </span>
                      <span className="pv-footer-link-label">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 4: PRMA Tech */}
          <div className="pv-footer-col">
            <div className="pv-footer-col-header">
              <div className="pv-footer-col-icon-box">
                <Sparkles size={16} strokeWidth={2.4} />
              </div>
              <h3 className="pv-footer-col-title">PRMA Tech</h3>
            </div>

            <ul className="pv-footer-links-list">
              {prmaTechLinks.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <li key={idx}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        item.action();
                      }}
                      className="pv-footer-link-item"
                    >
                      <span className="pv-footer-link-icon">
                        <ItemIcon size={15} strokeWidth={2.1} />
                      </span>
                      <span className="pv-footer-link-label">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 5: Help & Support */}
          <div className="pv-footer-col">
            <div className="pv-footer-col-header">
              <div className="pv-footer-col-icon-box">
                <Headphones size={16} strokeWidth={2.4} />
              </div>
              <h3 className="pv-footer-col-title">Help & Support</h3>
            </div>

            <ul className="pv-footer-links-list">
              {helpSupportLinks.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="pv-footer-link-item"
                    >
                      <span className="pv-footer-link-icon">
                        <ItemIcon size={15} strokeWidth={2.1} />
                      </span>
                      <span className="pv-footer-link-label">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 6: Legal */}
          <div className="pv-footer-col">
            <div className="pv-footer-col-header">
              <div className="pv-footer-col-icon-box">
                <Shield size={16} strokeWidth={2.4} />
              </div>
              <h3 className="pv-footer-col-title">Legal</h3>
            </div>

            <ul className="pv-footer-links-list">
              {legalLinks.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="pv-footer-link-item"
                    >
                      <span className="pv-footer-link-icon">
                        <ItemIcon size={15} strokeWidth={2.1} />
                      </span>
                      <span className="pv-footer-link-label">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* EDUCATIONAL TRUST STRIP (4 EQUALLY SPACED SECTIONS) */}
        <div className="pv-footer-trust-strip">
          {trustStripItems.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div key={idx} className="pv-footer-trust-item">
                <div className="pv-footer-trust-icon-box">
                  <ItemIcon size={20} strokeWidth={2.2} />
                </div>
                <div className="pv-footer-trust-content">
                  <div className="pv-footer-trust-title">{item.title}</div>
                  <div className="pv-footer-trust-desc">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM COPYRIGHT & MSME FOOTER WITH GOLDEN CURVED TOP WAVE */}
      <div className="pv-footer-bottom-wrapper">
        {/* Golden Wave Upper Ribbon */}
        <div className="pv-footer-wave-wrap" aria-hidden="true">
          <svg
            viewBox="0 0 1440 68"
            fill="none"
            preserveAspectRatio="none"
            className="pv-footer-wave-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pvGoldWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
            {/* Burgundy Fill below wave */}
            <path
              d="M 0,26 C 280,48 580,8 880,26 C 1140,42 1340,12 1440,20 L 1440,68 L 0,68 Z"
              fill="#5A091E"
            />
            {/* Golden Ribbon Stroke */}
            <path
              d="M 0,26 C 280,48 580,8 880,26 C 1140,42 1340,12 1440,20"
              stroke="url(#pvGoldWaveGradient)"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Deep Burgundy Bottom Bar */}
        <div className="pv-footer-bottom-bar">
          {/* Left Corner Golden Laurel Flourish */}
          <div className="pv-footer-laurel-flourish left" aria-hidden="true">
            <svg width="34" height="54" viewBox="0 0 34 54" fill="none">
              <path d="M4 50 C8 38 15 24 28 8" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M28 8 C25 4 19 3 16 6 C13 9 18 14 28 8 Z" fill="#F59E0B" />
              <path d="M22 17 C18 14 12 14 10 18 C8 22 15 24 22 17 Z" fill="#F59E0B" />
              <path d="M16 26 C12 24 7 25 6 30 C5 34 11 34 16 26 Z" fill="#F59E0B" />
              <path d="M11 36 C8 35 4 37 4 41 C4 45 9 44 11 36 Z" fill="#F59E0B" />
              <path d="M29 16 C31 12 34 9 33 6 C31 4 28 8 29 16 Z" fill="#F59E0B" />
              <path d="M25 25 C27 21 31 19 31 16 C29 14 25 18 25 25 Z" fill="#F59E0B" />
              <path d="M19 34 C22 30 25 29 25 26 C23 24 19 28 19 34 Z" fill="#F59E0B" />
            </svg>
          </div>

          {/* Right Corner Golden Laurel Flourish */}
          <div className="pv-footer-laurel-flourish right" aria-hidden="true">
            <svg width="34" height="54" viewBox="0 0 34 54" fill="none" style={{ transform: 'scaleX(-1)' }}>
              <path d="M4 50 C8 38 15 24 28 8" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M28 8 C25 4 19 3 16 6 C13 9 18 14 28 8 Z" fill="#F59E0B" />
              <path d="M22 17 C18 14 12 14 10 18 C8 22 15 24 22 17 Z" fill="#F59E0B" />
              <path d="M16 26 C12 24 7 25 6 30 C5 34 11 34 16 26 Z" fill="#F59E0B" />
              <path d="M11 36 C8 35 4 37 4 41 C4 45 9 44 11 36 Z" fill="#F59E0B" />
              <path d="M29 16 C31 12 34 9 33 6 C31 4 28 8 29 16 Z" fill="#F59E0B" />
              <path d="M25 25 C27 21 31 19 31 16 C29 14 25 18 25 25 Z" fill="#F59E0B" />
              <path d="M19 34 C22 30 25 29 25 26 C23 24 19 28 19 34 Z" fill="#F59E0B" />
            </svg>
          </div>

          <div className="pv-footer-bottom-inner">
            {/* Left: Official Government of India & MSME Block + Follow PRMA Tech */}
            <div className="pv-footer-bottom-left">
              <div className="pv-footer-msme-block">
                {/* Ashoka Lion Capital Emblem */}
                <img
                  src="/assets/msme_lion_crop.png"
                  alt="State Emblem of India"
                  className="pv-footer-ashoka-emblem"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/emblem_of_india.svg';
                  }}
                />

                {/* Official MSME Logo Banner */}
                <img
                  src="/assets/msme_official_banner.png"
                  alt="Ministry of MSME, Govt. of India"
                  className="pv-footer-msme-emblem"
                />
              </div>

              {/* Follow PRMA Tech */}
              <div className="pv-footer-follow-prma">
                <span className="pv-footer-follow-title">Follow PRMA Tech</span>
                <div className="pv-footer-follow-icons">
                  <a
                    href="https://www.instagram.com/prma_tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pv-footer-prma-icon-btn"
                    aria-label="Follow PRMA Tech on Instagram"
                    title="Follow PRMA Tech on Instagram"
                  >
                    <Instagram size={17} strokeWidth={2.2} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/prma-tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pv-footer-prma-icon-btn"
                    aria-label="Follow PRMA Tech on LinkedIn"
                    title="Follow PRMA Tech on LinkedIn"
                  >
                    <Linkedin size={17} strokeWidth={2.2} />
                  </a>
                </div>
              </div>
            </div>

            <div className="pv-footer-vdivider" aria-hidden="true" />

            {/* Center Copyright & Tagline */}
            <div className="pv-footer-bottom-center">
              <div className="pv-footer-copyright-text">
                © {new Date().getFullYear()} ProfessorVirus. All rights reserved.
              </div>
              <div className="pv-footer-tagline-text">
                Study Smart. Prepare Better. Made with <Heart size={13} fill="#EF4444" color="#EF4444" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> for students across India.
              </div>
            </div>

            <div className="pv-footer-vdivider" aria-hidden="true" />

            {/* Right: Legal Links + Golden Secure Badge */}
            <div className="pv-footer-bottom-right">
              <div className="pv-footer-links-stacked">
                <div className="pv-footer-links-row">
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="pv-footer-legal-link"
                  >
                    Privacy Policy
                  </button>
                  <span className="pv-footer-link-divider">|</span>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="pv-footer-legal-link"
                  >
                    Terms & Conditions
                  </button>
                </div>
                <div className="pv-footer-links-row">
                  <button
                    type="button"
                    onClick={() => setActiveModal('disclaimer')}
                    className="pv-footer-legal-link"
                  >
                    Disclaimer
                  </button>
                  <span className="pv-footer-link-divider">|</span>
                  <button
                    type="button"
                    onClick={() => openWhatsApp("Hi ProfessorVirus Team, I have an inquiry.")}
                    className="pv-footer-legal-link"
                  >
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Golden Outlined Secure & Safe Badge */}
              <div className="pv-footer-secure-badge-wrap">
                <button
                  type="button"
                  onClick={() => setActiveModal('security')}
                  className="pv-footer-golden-secure-badge"
                  title="Click to view Security & Safety Verification"
                >
                  <ShieldCheck size={16} className="pv-footer-golden-shield-icon" strokeWidth={2.4} />
                  <span>Secure & Safe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE MODALS (Privacy, Terms, Refund, Cookie, Disclaimer, FAQs, etc.)
          ========================================================================= */}
      {activeModal && (
        <div
          className="pv-footer-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="pv-footer-modal-card" role="dialog" aria-modal="true">
            {/* Modal Header */}
            <div className="pv-footer-modal-header">
              <div className="pv-footer-modal-header-left">
                <div className="pv-footer-modal-icon">
                  {activeModal === 'privacy' && <ShieldCheck size={20} />}
                  {activeModal === 'terms' && <FileText size={20} />}
                  {activeModal === 'refund' && <RotateCcw size={20} />}
                  {activeModal === 'cookie' && <Cookie size={20} />}
                  {activeModal === 'disclaimer' && <Info size={20} />}
                  {activeModal === 'faqs' && <HelpCircle size={20} />}
                  {activeModal === 'how-it-works' && <Play size={20} />}
                  {activeModal === 'security' && <Lock size={20} />}
                </div>
                <h3 className="pv-footer-modal-title">
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'terms' && 'Terms & Conditions'}
                  {activeModal === 'refund' && 'Refund & Cancellation Policy'}
                  {activeModal === 'cookie' && 'Cookie Policy'}
                  {activeModal === 'disclaimer' && 'Academic & Legal Disclaimer'}
                  {activeModal === 'faqs' && 'Frequently Asked Questions (FAQs)'}
                  {activeModal === 'how-it-works' && 'How ProfessorVirus Works'}
                  {activeModal === 'security' && 'Security & Trust Guarantee'}
                </h3>
              </div>

              <button
                type="button"
                className="pv-footer-modal-close"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="pv-footer-modal-body">
              {activeModal === 'privacy' && (
                <>
                  <h4>1. Introduction & Student Privacy</h4>
                  <p>
                    ProfessorVirus ("CampusPrep") is dedicated to protecting student data and privacy. We do not sell, rent, or distribute personal information, phone numbers, or academic records to third-party marketing agencies.
                  </p>
                  <h4>2. Data Collection & Usage</h4>
                  <p>
                    We collect essential operational data such as your university email, chosen course branch, semester, and voluntary study history to deliver tailored subject notes, exam schedules, and solved PYQs.
                  </p>
                  <h4>3. Data Security & Storage</h4>
                  <p>
                    All passwords and user authentications are encrypted using SHA-256 and salted hashing. Communication between your browser and our servers is secured via 256-bit TLS/SSL encryption.
                  </p>
                  <h4>4. Student Rights</h4>
                  <p>
                    You retain the right to download, modify, or permanently delete your account data at any time from your student profile settings.
                  </p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <h4>1. Platform Usage</h4>
                  <p>
                    ProfessorVirus is an independent academic and career preparation platform created to assist students in AKTU and across India with free study notes, question banks, and AI preparation tools.
                  </p>
                  <h4>2. Intellectual Property</h4>
                  <p>
                    Curated handwritten notes, syllabus mappings, and editorial question solutions are provided under fair-use educational guidance. Original university exam papers remain the intellectual property of their respective examining bodies.
                  </p>
                  <h4>3. Community Conduct</h4>
                  <p>
                    Users must not upload malicious files, abuse mock interview tools, or attempt unauthorized scraping of platform infrastructure. Violation of terms may result in immediate suspension.
                  </p>
                </>
              )}

              {activeModal === 'refund' && (
                <>
                  <h4>1. 100% Free Core Academic Access</h4>
                  <p>
                    All foundational resources — including AKTU syllabus documents, university handwritten notes, previous year question papers (PYQs), quantum reference lists, and marksheet analyzers — are completely free for all students.
                  </p>
                  <h4>2. Optional Sponsored Certifications & Promotion Plans</h4>
                  <p>
                    For institutional promotional banners or specialized verified employer listings, refunds are available within 48 hours of booking if the campaign has not yet gone live.
                  </p>
                </>
              )}

              {activeModal === 'cookie' && (
                <>
                  <h4>1. Use of Cookies</h4>
                  <p>
                    We use cookies and local storage tokens strictly to preserve your selected course (e.g., B.Tech, BCA, MBA), branch, dark/light theme, and logged-in session state without requiring repetitive authentication.
                  </p>
                  <h4>2. Third-Party Cookies</h4>
                  <p>
                    We do not use invasive behavioral ad trackers. Anonymous telemetry may be used to identify slow page load times and improve PDF download speeds.
                  </p>
                  <div style={{ marginTop: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={openCookiePreferences}
                      style={{
                        backgroundColor: '#FAF3EC',
                        color: '#781416',
                        border: '1.5px solid #E8D8C8',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      Manage Cookie Preferences
                    </button>
                  </div>
                </>
              )}

              {activeModal === 'disclaimer' && (
                <>
                  <h4>1. Independent Educational Platform</h4>
                  <p>
                    ProfessorVirus is an independent student academic resource platform and is not officially affiliated with, endorsed by, or sponsored by Dr. A.P.J. Abdul Kalam Technical University (AKTU) or any state education board.
                  </p>
                  <h4>2. Verification of Results & Timetables</h4>
                  <p>
                    While our academic team diligently verifies semester question papers and grade algorithms against official university marking schemes, students are always advised to verify final official exam schedules at <strong>aktu.ac.in</strong>.
                  </p>
                </>
              )}

              {activeModal === 'faqs' && (
                <>
                  <h4>Is ProfessorVirus completely free for college students?</h4>
                  <p>
                    Yes! All AKTU handwritten notes, unit-wise questions, solved PYQ papers, syllabus breakdowns, and AI Interview Pro tools are 100% free of charge.
                  </p>
                  <h4>Which branches and semesters are supported?</h4>
                  <p>
                    We provide comprehensive coverage for B.Tech (Computer Science, IT, Electronics, Mechanical, Civil), BCA, MCA, MBA, and B.Pharm across all 8 semesters.
                  </p>
                  <h4>How can I contribute study notes or report an issue?</h4>
                  <p>
                    You can contact our student editorial team anytime via WhatsApp or email to share high-quality handwritten notes or suggest corrections.
                  </p>
                </>
              )}

              {activeModal === 'how-it-works' && (
                <>
                  <h4>Step 1: Choose Your Course & Semester</h4>
                  <p>
                    Select your degree (B.Tech, BCA, MCA, MBA, B.Pharm) and semester to instantly access syllabus-aligned study material.
                  </p>
                  <h4>Step 2: Study Verified Notes & Solved PYQs</h4>
                  <p>
                    Download unit-wise notes prepared by college toppers and practice previous 10 years of solved university exam papers.
                  </p>
                  <h4>Step 3: Level Up with AI Interview Pro & Career Tools</h4>
                  <p>
                    Practice coding and HR technical interviews with real-time AI evaluation, build ATS-ready resumes, and discover verified internships.
                  </p>
                </>
              )}

              {activeModal === 'security' && (
                <>
                  <h4>256-Bit SSL Encryption</h4>
                  <p>
                    All network traffic is encrypted via end-to-end TLS 1.3/SSL protocols, ensuring your passwords, uploads, and search queries remain private.
                  </p>
                  <h4>Zero Malware & Verified Clean Downloads</h4>
                  <p>
                    Every PDF, question paper, and study material hosted on ProfessorVirus is automatically scanned for viruses and embedded scripts before publishing.
                  </p>
                  <h4>Strict Anti-Spam Policy</h4>
                  <p>
                    We never send unsolicited promotional SMS or telemarketing calls. We only communicate critical academic circulars and platform updates.
                  </p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pv-footer-modal-footer">
              <button
                type="button"
                className="pv-footer-modal-btn"
                onClick={() => setActiveModal(null)}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
