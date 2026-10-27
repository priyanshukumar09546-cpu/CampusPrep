import React, { useState, useEffect } from 'react';
import MobileHeader from '../components/MobileHeader';
import PYQFilterPortal from '../components/PYQFilterPortal';
import { normalizeCourseKey } from '../data/courseMapping.ts';

// Normalize Course helper using centralized mapping for all 24 AKTU programmes
export const normalizeCourse = (param) => {
  if (!param) return 'BTech';
  const result = normalizeCourseKey(param);
  return result || 'BTech';
};

export default function PYQsPage({ onNavigate, onOpenAuth, initialCourse = 'BTech', onSelectCourse }) {
  const getCourseParam = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const c = params.get('course');
      if (c) return c;
      const saved = localStorage.getItem('campusprep_selected_course');
      if (saved) return saved;
    } catch (e) {}
    return initialCourse || 'BTech';
  };

  const courseParam = getCourseParam();
  const normalizedCourse = normalizeCourse(courseParam);
  const [selectedCourse, setSelectedCourse] = useState(normalizedCourse);

  useEffect(() => {
    if (initialCourse && normalizeCourse(initialCourse) !== normalizeCourse(selectedCourse)) {
      setSelectedCourse(normalizeCourse(initialCourse));
    }
  }, [initialCourse]);

  const handleSelectCourse = (courseKey) => {
    const norm = normalizeCourse(courseKey);
    setSelectedCourse(norm);
    try {
      localStorage.setItem('campusprep_selected_course', norm);
    } catch (e) {}
    if (onSelectCourse) onSelectCourse(norm);
  };

  return (
    <div className="pv-pyq-page-root">
      {/* Mobile-only Header */}
      <div className="pv-mobile-pyqs-header-wrapper">
        <MobileHeader
          activeTab="pyqs"
          onNavigate={onNavigate}
          onOpenUpdates={() => {
            const modal = document.querySelector('[data-student-updates-modal]');
            if (modal) modal.style.display = 'block';
          }}
        />
      </div>

      {/* Dynamic Filter Portal (Course -> Branch -> Year -> Semester -> Subject -> Exam Year -> Exam Type) */}
      <PYQFilterPortal
        initialCourse={selectedCourse}
        onSelectCourse={handleSelectCourse}
        onNavigate={onNavigate}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
}
