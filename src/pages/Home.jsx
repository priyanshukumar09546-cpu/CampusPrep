import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import CourseCardsSection from '../components/CourseCardsSection';
import YearBranchAISection from '../components/YearBranchAISection';
import StatsSection from '../components/StatsSection';
import TrendingLatestCommunitySection from '../components/TrendingLatestCommunitySection';
import AcademicClosingSection from '../components/AcademicClosingSection';

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
    <div className="w-full relative overflow-x-hidden">
      {/* 1. Sunlit Warm Ivory Home Hero Section with Professor Virus & 3-Idiots Blackboard */}
      <HeroSection
        onSearch={onSearch}
        onSelectBranch={onSelectBranch}
      />

      {/* 2. 8 Tools Feature Cards Section */}
      <FeatureCards
        onCardClick={onFeatureClick}
      />

      {/* 3. 7 Courses Section (BTech, BCA, MTech, MCA, MBA, BPharm, BBA) */}
      <CourseCardsSection
        onSelectCourse={onSelectCourse}
        onNavigate={onNavigate}
      />

      {/* 4. Year + Branch + Ask Virus AI Section */}
      <YearBranchAISection
        onSelectYear={onSelectYear}
        onSelectBranch={onSelectBranch}
        onOpenAI={onOpenAI}
      />

      {/* 5. Configurable Statistics Section */}
      <StatsSection
        isLiveDataAvailable={false}
      />

      {/* 6. Three-Column Trending + Latest Notes + Community Section */}
      <TrendingLatestCommunitySection
        onSubjectClick={(sub) => onOpenSubject ? onOpenSubject(sub) : onNavigate('notes')}
        onNoteClick={(note) => {
          const rawUrl = note.pdfUrl || note.driveUrl || note.fileUrl || note.resourceUrl || note.url;
          if (rawUrl) {
            window.open(rawUrl, '_blank', 'noopener,noreferrer');
          } else {
            alert('Note document is currently unavailable.');
          }
        }}
        onDiscussionClick={(disc) => alert(`Opening Discussion: ${disc.title}`)}
        onViewAll={(type) => onNavigate(type)}
      />

      {/* 7. Academic Closing CTA Section */}
      <AcademicClosingSection
        onNavigate={onNavigate}
      />
    </div>
  );
}
