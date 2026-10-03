import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_COURSES, YEARS_CONFIG } from '../data/subjectsData';

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [selectedCourse, setSelectedCourseState] = useState(() => {
    try {
      const saved = localStorage.getItem('campusprep_selected_course');
      return saved || 'B.Tech';
    } catch (e) {
      return 'B.Tech';
    }
  });

  const [selectedYear, setSelectedYearState] = useState(() => {
    try {
      const saved = localStorage.getItem('campusprep_selected_year');
      return saved || '2nd Year';
    } catch (e) {
      return '2nd Year';
    }
  });

  const [selectedBranch, setSelectedBranchState] = useState(() => {
    try {
      const saved = localStorage.getItem('campusprep_selected_branch');
      return saved || 'CSE';
    } catch (e) {
      return 'CSE';
    }
  });

  const setSelectedCourse = (course) => {
    setSelectedCourseState(course);
    try {
      localStorage.setItem('campusprep_selected_course', course);
    } catch (e) {}

    // Reset default year for course if needed
    const courseYears = YEARS_CONFIG[course] || YEARS_CONFIG['default'];
    if (courseYears && courseYears.length > 0) {
      const currentYearExists = courseYears.some(y => y.year === selectedYear);
      if (!currentYearExists) {
        setSelectedYear(courseYears[0].year);
      }
    }
  };

  const setSelectedYear = (year) => {
    setSelectedYearState(year);
    try {
      localStorage.setItem('campusprep_selected_year', year);
    } catch (e) {}
  };

  const setSelectedBranch = (branch) => {
    setSelectedBranchState(branch);
    try {
      localStorage.setItem('campusprep_selected_branch', branch);
    } catch (e) {}
  };

  // Check if first time setup is needed
  const isFirstTimeUser = () => {
    try {
      return !localStorage.getItem('campusprep_selected_course');
    } catch (e) {
      return false;
    }
  };

  return (
    <CourseContext.Provider value={{
      selectedCourse,
      setSelectedCourse,
      selectedYear,
      setSelectedYear,
      selectedBranch,
      setSelectedBranch,
      isFirstTimeUser,
      allCourses: ALL_COURSES
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}

export default CourseContext;
