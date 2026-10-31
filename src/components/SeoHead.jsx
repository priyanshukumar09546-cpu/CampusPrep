import React, { useEffect } from 'react';
import { AVAILABLE_COURSES, normalizeCourseKey } from '../data/courseMapping.ts';
import { courseKeyToSlug, yearToSlug, semToSlug } from '../utils/academicUrls';

/**
 * SeoHead: Dynamic Client-Side SEO & Structured Data Manager
 * Updates document title, meta tags, canonical URL, and JSON-LD schema
 * per route, course, subject, and student tool.
 */
export default function SeoHead({
  activeTab = 'home',
  selectedCourse = 'BTech',
  selectedSubjectData = null,
  selectedProjectSlug = null,
  selectedOpportunitySlug = null,
  selectedScholarshipSlug = null,
  selectedYear = null,
  selectedSemester = null
}) {
  useEffect(() => {
    const BASE_URL = 'https://professorvirus.site';
    const BRAND_NAME = 'ProfessorVirus';
    const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/navbar_logo.png`;

    let title = `${BRAND_NAME} - Study Smart. Prepare Better. | AKTU Notes, PYQs & Student Tools`;
    let description = 'An educational platform providing study resources, notes, previous-year question papers, syllabus, quizzes, academic tools and career preparation for students.';
    let canonical = `${BASE_URL}/`;
    let pageSchema = null;

    const normalizedCourse = (selectedCourse || 'B.Tech').replace('BTech', 'B.Tech');

    // Route-specific SEO configuration
    switch (activeTab) {
      case 'home':
        title = `${BRAND_NAME} - Study Smart. Prepare Better. | AKTU Notes, PYQs & Student Tools`;
        description = 'An educational platform providing study resources, notes, previous-year question papers, syllabus, quizzes, academic tools and career preparation for students.';
        canonical = `${BASE_URL}/`;
        break;

      case 'hoollow':
        title = `HOOLLOW by ${BRAND_NAME} | AI Study Companion & Academic Intelligence`;
        description = `Experience HOOLLOW, the AI study companion on ${BRAND_NAME}. Get real-time answers, concept explanations, and instant academic assistance.`;
        canonical = `${BASE_URL}/hoollow`;
        pageSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'HOOLLOW AI Study Companion',
          'url': canonical,
          'applicationCategory': 'EducationalApplication',
          'operatingSystem': 'All',
          'description': description,
          'provider': {
            '@type': 'Organization',
            'name': BRAND_NAME,
            'url': BASE_URL
          }
        };
        break;

      case 'notes':
        if (selectedCourse && selectedCourse !== 'All') {
          title = `${normalizedCourse} Notes & Study Materials | ${BRAND_NAME}`;
          description = `Free verified ${normalizedCourse} lecture notes, handwritten unit notes, quantum series, and revision guides for all semesters on ${BRAND_NAME}.`;
          canonical = `${BASE_URL}/notes?course=${encodeURIComponent(normalizedCourse)}`;
        } else {
          title = `AKTU Notes & Free Study Materials | ${BRAND_NAME}`;
          description = `Download verified unit-wise notes, handwritten revision PDFs, and quantum series for B.Tech, BCA, BBA, B.Pharm, MCA, MBA and other programmes.`;
          canonical = `${BASE_URL}/notes`;
        }
        pageSchema = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': title,
          'url': canonical,
          'description': description,
          'provider': { '@type': 'Organization', 'name': BRAND_NAME, 'url': BASE_URL }
        };
        break;

      case 'pyqs':
        title = `AKTU Previous Year Question Papers (PYQs) | ${BRAND_NAME}`;
        description = `Download official AKTU previous year question papers (PYQs) with solutions for all semesters, branches, and subjects on ${BRAND_NAME}.`;
        canonical = `${BASE_URL}/pyqs`;
        pageSchema = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': title,
          'url': canonical,
          'description': description
        };
        break;

      case 'syllabus':
        title = `AKTU Official Syllabus & Curriculum | ${BRAND_NAME}`;
        description = `Explore the latest official university syllabus and course structure for B.Tech, BCA, BBA, B.Pharm, MCA, MBA, and other programmes.`;
        canonical = `${BASE_URL}/syllabus`;
        break;

      case 'quizzes':
        title = `Practice Quizzes & Semester Mock Tests | ${BRAND_NAME}`;
        description = `Test your knowledge with subject-wise academic quizzes, MCQ mock tests, and timed practice assessments on ${BRAND_NAME}.`;
        canonical = `${BASE_URL}/quizzes`;
        pageSchema = {
          '@context': 'https://schema.org',
          '@type': 'Quiz',
          'name': title,
          'url': canonical,
          'description': description
        };
        break;

      case 'resume-maker':
        title = `ATS Resume Maker for Students & Tech Placements | ${BRAND_NAME}`;
        description = `Build professional, ATS-friendly resumes tailored for college placements, off-campus drives, and internships with ${BRAND_NAME} Resume Maker.`;
        canonical = `${BASE_URL}/resume-maker`;
        pageSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': `${BRAND_NAME} ATS Resume Maker`,
          'url': canonical,
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'All',
          'description': description
        };
        break;

      case 'interview-pro':
      case 'interview-confirm':
      case 'interview-instructions':
      case 'interview-start':
      case 'interview-coding':
      case 'interview-technical':
      case 'interview-hr':
      case 'interview-report':
        title = `Interview Pro - AI Mock Technical & HR Interviews | ${BRAND_NAME}`;
        description = `Prepare for campus placements with AI-driven mock interviews, aptitude tests, technical coding challenges, and HR rounds on ${BRAND_NAME}.`;
        canonical = `${BASE_URL}/interview-pro`;
        pageSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'Interview Pro AI Placement Simulator',
          'url': canonical,
          'applicationCategory': 'EducationalApplication',
          'operatingSystem': 'All',
          'description': description
        };
        break;

      case 'result-cgpa':
        title = `Result & CGPA Analyzer | Semester Grade Calculator - ${BRAND_NAME}`;
        description = `Calculate SGPA, CGPA, percentage, and track academic semester performance accurately with the ${BRAND_NAME} Result Analyzer.`;
        canonical = `${BASE_URL}/result-cgpa`;
        break;

      case 'pdf-maker':
        title = `PDF Maker & Studio | Merge, Split & Compress PDFs - ${BRAND_NAME}`;
        description = `Free student PDF utility to merge notes, extract pages, split files, and convert images into clean PDF documents directly in your browser.`;
        canonical = `${BASE_URL}/pdf-maker`;
        break;

      case 'attendance-calculator':
        title = `75% Attendance Calculator & Bunk Planner | ${BRAND_NAME}`;
        description = `Calculate how many lectures you can safely bunk or need to attend to maintain 75% college attendance with ${BRAND_NAME} Attendance Calculator.`;
        canonical = `${BASE_URL}/attendance-calculator`;
        break;

      case 'timetable':
        title = `Student Timetable & Daily Study Planner | ${BRAND_NAME}`;
        description = `Organize your college classes, lecture schedule, and exam preparation with the interactive timetable planner on ${BRAND_NAME}.`;
        canonical = `${BASE_URL}/timetable`;
        break;

      case 'progress':
        title = `Student Progress Tracker & Learning Analytics | ${BRAND_NAME}`;
        description = `Track syllabus completion, subject progress, mock test scores, and revision milestones with ${BRAND_NAME} Progress Tracker.`;
        canonical = `${BASE_URL}/progress`;
        break;

      case 'plagiarism':
        title = `Academic Plagiarism Checker & Originality Scanner | ${BRAND_NAME}`;
        description = `Check assignments, project reports, and essays for originality and citation accuracy with ${BRAND_NAME} Plagiarism Checker.`;
        canonical = `${BASE_URL}/plagiarism`;
        break;

      case 'project-ideas':
      case 'project-detail':
        title = `Student Project Ideas, Source Code & GitHub Repos | ${BRAND_NAME}`;
        description = `Discover end-to-end mini, major, and capstone project ideas with full documentation, architectures, and source code on ${BRAND_NAME}.`;
        canonical = selectedProjectSlug ? `${BASE_URL}/project-ideas/${selectedProjectSlug}` : `${BASE_URL}/project-ideas`;
        break;

      case 'internships-jobs':
      case 'opportunity-detail':
        title = `Internships & Entry-Level Job Opportunities | ${BRAND_NAME}`;
        description = `Find verified student internships, fresher software engineering roles, and campus hiring updates curated by ${BRAND_NAME}.`;
        canonical = selectedOpportunitySlug ? `${BASE_URL}/internships-jobs/${selectedOpportunitySlug}` : `${BASE_URL}/internships-jobs`;
        break;

      case 'scholarships':
      case 'scholarship-detail':
        title = `National & State Scholarships for College Students | ${BRAND_NAME}`;
        description = `Discover UP government, national scholarship portal (NSP), merit-based, and private education grants on ${BRAND_NAME}.`;
        canonical = selectedScholarshipSlug ? `${BASE_URL}/scholarships/${selectedScholarshipSlug}` : `${BASE_URL}/scholarships`;
        break;

      case 'competitive-exams':
        title = `GATE, CAT & Competitive Exams Prep | ${BRAND_NAME}`;
        description = `Comprehensive preparation guides, syllabus, and study roadmaps for GATE, CAT, and national competitive exams.`;
        canonical = `${BASE_URL}/competitive-exams`;
        break;

      case 'important-links':
        title = `Important University Portals & ERP Links | ${BRAND_NAME}`;
        description = `Quick access to official AKTU ERP, one-view results, circulars, exam schedules, and university student services.`;
        canonical = `${BASE_URL}/important-links`;
        break;

      case 'select-course':
      case 'courses':
        title = `All 24 University Programmes & Degrees | ${BRAND_NAME} Directory`;
        description = `Explore verified academic resources across all 24 university programmes including B.Tech, BCA, BBA, B.Pharm, MCA, MBA and more.`;
        canonical = `${BASE_URL}/courses/`;
        pageSchema = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': title,
          'url': canonical,
          'description': description
        };
        break;

      case 'course-detail': {
        const cNorm = normalizeCourseKey(selectedCourse) || 'BTech';
        const cMeta = AVAILABLE_COURSES.find(c => c.key === cNorm) || { name: cNorm, fullName: cNorm };
        const cSlug = courseKeyToSlug(cNorm);
        title = `AKTU ${cMeta.fullName} (${cMeta.name}) Syllabus, Notes & PYQs | ${BRAND_NAME}`;
        description = `Official AKTU ${cMeta.fullName} (${cMeta.name}) curriculum, semester subjects, unit-wise notes, and solved question papers across all years on ${BRAND_NAME}.`;
        canonical = `${BASE_URL}/courses/${cSlug}/`;
        pageSchema = {
          '@context': 'https://schema.org',
          '@type': 'Course',
          'name': `AKTU ${cMeta.fullName} (${cMeta.name})`,
          'description': description,
          'provider': { '@type': 'Organization', 'name': BRAND_NAME, 'url': BASE_URL }
        };
        break;
      }

      case 'year-detail': {
        const cNorm = normalizeCourseKey(selectedCourse) || 'BTech';
        const cMeta = AVAILABLE_COURSES.find(c => c.key === cNorm) || { name: cNorm, fullName: cNorm };
        const cSlug = courseKeyToSlug(cNorm);
        const ySlug = yearToSlug(selectedYear || '1st Year');
        const yr = selectedYear || '1st Year';
        title = `AKTU ${cMeta.name} ${yr} — Subjects, Notes & PYQs | ${BRAND_NAME}`;
        description = `Explore AKTU ${cMeta.name} ${yr} semester subjects, verified handwritten notes, quantum series, and previous year examination papers.`;
        canonical = `${BASE_URL}/courses/${cSlug}/${ySlug}/`;
        break;
      }

      case 'semester-detail': {
        const cNorm = normalizeCourseKey(selectedCourse) || 'BTech';
        const cMeta = AVAILABLE_COURSES.find(c => c.key === cNorm) || { name: cNorm, fullName: cNorm };
        const cSlug = courseKeyToSlug(cNorm);
        const ySlug = yearToSlug(selectedYear || '1st Year');
        const sSlug = semToSlug(selectedSemester || 'Sem 1');
        const yr = selectedYear || '1st Year';
        const sem = selectedSemester || 'Sem 1';
        title = `AKTU ${cMeta.name} ${yr} ${sem} Subjects & Study Material | ${BRAND_NAME}`;
        description = `Complete AKTU ${cMeta.name} ${sem} syllabus, subject lists, unit-wise PDF notes, and solved question papers.`;
        canonical = `${BASE_URL}/courses/${cSlug}/${ySlug}/${sSlug}/`;
        break;
      }

      case 'more':
        title = `All Student Tools & Academic Utilities | ${BRAND_NAME}`;
        description = `Explore the complete suite of student productivity tools, AI study assistants, calculators, and career resources on ${BRAND_NAME}.`;
        canonical = `${BASE_URL}/more`;
        break;

      case 'subject':
      case 'subject-detail':
        if (selectedSubjectData && selectedSubjectData.name) {
          const subName = selectedSubjectData.name;
          const subCode = selectedSubjectData.code ? ` (${selectedSubjectData.code})` : '';
          const subCourse = selectedSubjectData.course || normalizedCourse;
          title = `${subName}${subCode} Notes & PYQs | ${subCourse} - ${BRAND_NAME}`;
          description = `Free verified lecture notes, handwritten PDF summaries, previous year question papers, and syllabus for ${subName}${subCode} on ${BRAND_NAME}.`;
          canonical = `${BASE_URL}/subject?subject=${encodeURIComponent(subName)}${selectedSubjectData.code ? `&code=${encodeURIComponent(selectedSubjectData.code)}` : ''}&course=${encodeURIComponent(subCourse)}`;
          
          pageSchema = {
            '@context': 'https://schema.org',
            '@type': 'LearningResource',
            'name': `${subName}${subCode}`,
            'description': description,
            'url': canonical,
            'educationalLevel': subCourse,
            'learningResourceType': ['Lecture Notes', 'Question Papers', 'Syllabus'],
            'provider': {
              '@type': 'Organization',
              'name': BRAND_NAME,
              'url': BASE_URL
            }
          };
        }
        break;

      default:
        break;
    }

    // Apply document title
    document.title = title;

    // Helper: Update or create <meta> tag
    const setMeta = (attrName, attrValue, content) => {
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Update standard SEO meta tags
    setMeta('name', 'description', description);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Update Open Graph tags
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', DEFAULT_OG_IMAGE);

    // Update Twitter Cards
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', DEFAULT_OG_IMAGE);

    // Inject/Update dynamic page-level schema
    const schemaScriptId = 'pv-dynamic-page-schema';
    let schemaScript = document.getElementById(schemaScriptId);
    if (pageSchema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = schemaScriptId;
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(pageSchema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [
    activeTab,
    selectedCourse,
    selectedSubjectData,
    selectedProjectSlug,
    selectedOpportunitySlug,
    selectedScholarshipSlug
  ]);

  return null;
}
