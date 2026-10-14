import React from 'react';
import HeroSection from '../components/HeroSection';
import QuickAccessStrip from '../components/QuickAccessStrip';
import ExploreToolsSection from '../components/ExploreToolsSection';
import CourseCardsSection from '../components/CourseCardsSection';
import WhyStudentsLoveSection from '../components/WhyStudentsLoveSection';
import RealStatsSection from '../components/RealStatsSection';
import PopularSubjectsSection from '../components/PopularSubjectsSection';
import PromotionSection from '../components/PromotionSection';
import FinalCtaSection from '../components/FinalCtaSection';

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
    <div className="w-full relative overflow-x-hidden" style={{ backgroundColor: '#FAF5ED' }}>
      
      {/* 1. Hero Section matching Reference Design (Brand, Tagline, CTAs, Real Stats, Search, Branch Chips & Student Showcase) */}
      <HeroSection
        onSearch={onSearch}
        onSelectBranch={onSelectBranch}
        onNavigate={onNavigate}
      />

      {/* 2. Quick Access Tool Strip (Exactly 7 Horizontal Tools matching Reference Image) */}
      <div id="quick-access-section">
        <QuickAccessStrip
          onNavigate={onNavigate}
        />
      </div>

      {/* 3. Explore Our Tools (Exactly 8 Tool Cards in 4-Col Grid matching Reference Image) */}
      <div id="explore-tools">
        <ExploreToolsSection
          onNavigate={onNavigate}
        />
      </div>

      {/* 4. Choose Your Course Section (BTech, BCA, BBA, BPharm, MBA, MCA, MTech, More) */}
      <CourseCardsSection
        onSelectCourse={onSelectCourse}
        onNavigate={onNavigate}
      />

      {/* 5. Why Students Love ProfessorVirus? (Verified Student Features) */}
      <WhyStudentsLoveSection />

      {/* 6. Real Verified Academic Statistics */}
      <RealStatsSection />

      {/* 7. Popular Subjects with Direct Course/Branch/Semester Navigation */}
      <PopularSubjectsSection
        onOpenSubject={onOpenSubject}
        onNavigate={onNavigate}
      />

      {/* 8. Promote Your Brand & App, Plans & Value Highlights */}
      <PromotionSection
        onNavigate={onNavigate}
      />

      {/* 9. Final Academic Call To Action & Core Educational Values */}
      <FinalCtaSection
        onNavigate={onNavigate}
      />

    </div>
  );
}
