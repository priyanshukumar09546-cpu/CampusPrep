import React from 'react';
import HeroSection from '../components/HeroSection';
import QuickAccessStrip from '../components/QuickAccessStrip';
import ExploreToolsSection from '../components/ExploreToolsSection';
import PrmaInternshipSection from '../components/PrmaInternshipSection';
import CourseCardsSection from '../components/CourseCardsSection';
import TwoBrandsJourneySection from '../components/TwoBrandsJourneySection';
import PrmaServicesSection from '../components/PrmaServicesSection';
import WhyStudentsLoveSection from '../components/WhyStudentsLoveSection';
import RealStatsSection from '../components/RealStatsSection';
import PopularSubjectsSection from '../components/PopularSubjectsSection';
import PromotionSection from '../components/PromotionSection';
import FinalCtaSection from '../components/FinalCtaSection';
import MobileHomepageView from '../components/MobileHomepageView';

export default function Home({
  onSearch,
  onSelectBranch,
  onFeatureClick,
  onSelectCourse,
  onSelectYear,
  onOpenAI,
  onNavigate,
  onOpenSubject
}) {
  return (
    <>
      {/* 1. MOBILE-ONLY HOMEPAGE VIEW (< 1024px) */}
      <div className="pv-mobile-home-view">
        <MobileHomepageView
          onSearch={onSearch}
          onSelectBranch={onSelectBranch}
          onFeatureClick={onFeatureClick}
          onSelectCourse={onSelectCourse}
          onSelectYear={onSelectYear}
          onOpenAI={onOpenAI}
          onNavigate={onNavigate}
          onOpenSubject={onOpenSubject}
        />
      </div>

      {/* 2. DESKTOP-ONLY HOMEPAGE VIEW (>= 1024px) */}
      <div className="pv-desktop-home-view pv-home-page-container w-full relative overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
        {/* 1. Hero Section (ProfessorVirus Brand + PRMA Tech Building & Cat Mascot + Centered Search & Quick Access) */}
      <HeroSection
        onSearch={onSearch}
        onSelectBranch={onSelectBranch}
        onNavigate={onNavigate}
      />

      {/* 2. Quick Access Tool Strip (7 Horizontal Academic & Career Tools) */}
      <div id="quick-access-section" className="pv-scroll-reveal">
        <QuickAccessStrip
          onNavigate={onNavigate}
        />
      </div>

      {/* 3. Explore Our Tools (Left Info Card + 4x2 Tools Grid + Watermark) */}
      <div id="explore-tools" className="pv-scroll-reveal">
        <ExploreToolsSection
          onNavigate={onNavigate}
        />
      </div>

      {/* 4. PRMA Tech Remote Internship Programs & 12 Domains Preview */}
      <div className="pv-scroll-reveal">
        <PrmaInternshipSection
          onNavigate={onNavigate}
        />
      </div>

      {/* 5. Choose Your Course Section (BTech, BCA, BBA, BPharm, MBA, MCA, MTech, More) */}
      <div className="pv-scroll-reveal">
        <CourseCardsSection
          onSelectCourse={onSelectCourse}
          onNavigate={onNavigate}
        />
      </div>

      {/* 6. The Two-Brand Journey (Learn → Practice → Build → Intern → Grow Roadmap + Dual Synergy Cards) */}
      <div className="pv-scroll-reveal">
        <TwoBrandsJourneySection
          onNavigate={onNavigate}
        />
      </div>

      {/* 7. PRMA Tech Technology Services Showcase (8 Enterprise Engineering Services) */}
      <div className="pv-scroll-reveal">
        <PrmaServicesSection
          onNavigate={onNavigate}
        />
      </div>

      {/* 8. Why Students Love ProfessorVirus? (Verified Student Features) */}
      <div className="pv-scroll-reveal">
        <WhyStudentsLoveSection />
      </div>

      {/* 9. Real Verified Academic Statistics */}
      <div className="pv-scroll-reveal">
        <RealStatsSection />
      </div>

      {/* 10. Popular Subjects with Direct Course/Branch/Semester Navigation */}
      <div className="pv-scroll-reveal">
        <PopularSubjectsSection
          onOpenSubject={onOpenSubject}
          onNavigate={onNavigate}
        />
      </div>

      {/* 11. Promote Your Brand & App, Plans & Value Highlights */}
      <div className="pv-scroll-reveal">
        <PromotionSection
          onNavigate={onNavigate}
        />
      </div>

      {/* 12. Dual Split Final CTA (ProfessorVirus Study Smarter × PRMA Tech Build Tech Career) */}
      <div className="pv-scroll-reveal">
        <FinalCtaSection
          onNavigate={onNavigate}
        />
      </div>
      </div>
    </>
  );
}
