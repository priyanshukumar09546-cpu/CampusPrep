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
      <div className="pv-desktop-home-view w-full relative overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
        {/* 1. Hero Section (ProfessorVirus Brand + PRMA Tech Partnership Showcase + Search & Branch Filter) */}
        <HeroSection
          onSearch={onSearch}
          onSelectBranch={onSelectBranch}
          onNavigate={onNavigate}
        />

        {/* 2. Quick Access Tool Strip (7 Horizontal Academic & Career Tools) */}
        <div id="quick-access-section">
          <QuickAccessStrip
            onNavigate={onNavigate}
          />
        </div>

        {/* 3. Explore Our Tools (Tool Cards + PRMA Tech Internships New Action) */}
        <div id="explore-tools">
          <ExploreToolsSection
            onNavigate={onNavigate}
          />
        </div>

        {/* 4. PRMA Tech Remote Internship Programs & 12 Domains Preview */}
        <PrmaInternshipSection
          onNavigate={onNavigate}
        />

        {/* 5. Choose Your Course Section (BTech, BCA, BBA, BPharm, MBA, MCA, MTech, More) */}
        <CourseCardsSection
          onSelectCourse={onSelectCourse}
          onNavigate={onNavigate}
        />

        {/* 6. The Two-Brand Journey (Learn → Practice → Build → Intern → Grow Roadmap + Dual Synergy Cards) */}
        <TwoBrandsJourneySection
          onNavigate={onNavigate}
        />

        {/* 7. PRMA Tech Technology Services Showcase (8 Enterprise Engineering Services) */}
        <PrmaServicesSection
          onNavigate={onNavigate}
        />

        {/* 8. Why Students Love ProfessorVirus? (Verified Student Features) */}
        <WhyStudentsLoveSection />

        {/* 9. Real Verified Academic Statistics */}
        <RealStatsSection />

        {/* 10. Popular Subjects with Direct Course/Branch/Semester Navigation */}
        <PopularSubjectsSection
          onOpenSubject={onOpenSubject}
          onNavigate={onNavigate}
        />

        {/* 11. Promote Your Brand & App, Plans & Value Highlights */}
        <PromotionSection
          onNavigate={onNavigate}
        />

        {/* 12. Dual Split Final CTA (ProfessorVirus Study Smarter × PRMA Tech Build Tech Career) */}
        <FinalCtaSection
          onNavigate={onNavigate}
        />
      </div>
    </>
  );
}