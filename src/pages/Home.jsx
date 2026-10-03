import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
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
    <div className="w-full relative overflow-x-hidden" style={{ backgroundColor: '#FAF7F2' }}>
      
      {/* 1. Page 1: Hero Section with Branding, Pill Tag, Functional Search & Branch Filters */}
      <HeroSection
        onSearch={onSearch}
        onSelectBranch={onSelectBranch}
      />

      {/* 2. Page 1: 8 Primary Academic Tools Strip */}
      <FeatureCards
        onCardClick={onFeatureClick}
      />

      {/* 3. Page 1 & 2: Choose Your Course Section (BTech, BCA, BBA, BPharm, MBA, MCA, MTech, More) */}
      <CourseCardsSection
        onSelectCourse={onSelectCourse}
        onNavigate={onNavigate}
      />

      {/* 4. Page 2: Why Students Love ProfessorVirus? (4 Verified Feature Cards) */}
      <WhyStudentsLoveSection />

      {/* 5. Page 2: Real Verified Academic Statistics */}
      <RealStatsSection />

      {/* 6. Page 2: Popular Subjects with Direct Course/Branch/Semester Navigation */}
      <PopularSubjectsSection
        onOpenSubject={onOpenSubject}
        onNavigate={onNavigate}
      />

      {/* 7. Page 3: Promote Your Brand & App, Plans & Value Highlights */}
      <PromotionSection
        onNavigate={onNavigate}
      />

      {/* 8. Page 4: Final Academic Call To Action & 4 Core Values */}
      <FinalCtaSection
        onNavigate={onNavigate}
      />

    </div>
  );
}
