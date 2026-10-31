// ============================================================================
// PROFESSORVIRUS — AUTHORITATIVE ACADEMIC URL ARCHITECTURE
// Provides bidirectional mapping between clean SEO slugs and internal keys.
// Hierarchy: /courses/:courseSlug/:yearSlug/:semSlug/:subjectSlug
// ============================================================================

import { normalizeCourseKey } from '../data/courseMapping.ts';

// 1. Stable Slugs for all 24 Courses
export const COURSE_SLUG_MAP = {
  'BTech': 'btech',
  'BTechBiotechnology': 'btech-biotechnology',
  'BTechAgriculture': 'btech-agriculture',
  'BTechLateral': 'btech-lateral',
  'BCA': 'bca',
  'BBA': 'bba',
  'BBA_BMS': 'bba-bms',
  'BPharma': 'bpharm',
  'BPharmLateral': 'bpharm-lateral',
  'PharmD': 'pharmd',
  'MTech': 'mtech',
  'MPharm': 'mpharm',
  'MCA': 'mca',
  'MCAIntegrated': 'mca-integrated',
  'MCALateral': 'mca-lateral',
  'MBA': 'mba',
  'MBAIntegrated': 'mba-integrated',
  'MBALateral': 'mba-lateral',
  'BArch': 'barch',
  'BDes': 'bdes',
  'BHMCT': 'bhmct',
  'BFAD': 'bfad',
  'BFA': 'bfa',
  'BVoc': 'bvoc'
};

// Inverted lookup map
export const SLUG_TO_COURSE_KEY = Object.entries(COURSE_SLUG_MAP).reduce((acc, [key, slug]) => {
  acc[slug.toLowerCase()] = key;
  // Also support slug without hyphens
  acc[slug.replace(/-/g, '').toLowerCase()] = key;
  return acc;
}, {});

// Aliases for common user searches / legacy URLs
SLUG_TO_COURSE_KEY['b-tech'] = 'BTech';
SLUG_TO_COURSE_KEY['b.tech'] = 'BTech';
SLUG_TO_COURSE_KEY['btech-cse'] = 'BTech';
SLUG_TO_COURSE_KEY['bpharma'] = 'BPharma';
SLUG_TO_COURSE_KEY['b.pharm'] = 'BPharma';
SLUG_TO_COURSE_KEY['m-tech'] = 'MTech';
SLUG_TO_COURSE_KEY['m.tech'] = 'MTech';
SLUG_TO_COURSE_KEY['mpharma'] = 'MPharm';
SLUG_TO_COURSE_KEY['m.pharm'] = 'MPharm';

export function courseKeyToSlug(courseKey) {
  if (!courseKey) return 'btech';
  const norm = normalizeCourseKey(courseKey) || courseKey;
  return COURSE_SLUG_MAP[norm] || String(norm).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function slugToCourseKey(slug) {
  if (!slug) return 'BTech';
  const clean = String(slug).trim().toLowerCase();
  if (SLUG_TO_COURSE_KEY[clean]) return SLUG_TO_COURSE_KEY[clean];
  const withoutHyphens = clean.replace(/-/g, '');
  if (SLUG_TO_COURSE_KEY[withoutHyphens]) return SLUG_TO_COURSE_KEY[withoutHyphens];
  return normalizeCourseKey(slug) || 'BTech';
}

// 2. Year Slugs (e.g. '1st Year' <-> 'year-1')
export function yearToSlug(yearStr) {
  if (!yearStr) return 'year-1';
  const digit = String(yearStr).replace(/[^0-9]/g, '');
  return digit ? `year-${digit}` : 'year-1';
}

export function slugToYear(slug) {
  if (!slug) return '1st Year';
  const digit = String(slug).replace(/[^0-9]/g, '');
  const num = parseInt(digit, 10);
  if (num === 1) return '1st Year';
  if (num === 2) return '2nd Year';
  if (num === 3) return '3rd Year';
  if (num === 4) return '4th Year';
  if (num === 5) return '5th Year';
  if (num === 6) return '6th Year';
  return `${num}th Year`;
}

// 3. Semester Slugs (e.g. 'Sem 3' or 'Semester 3' <-> 'semester-3')
export function semToSlug(semStr) {
  if (!semStr) return 'semester-1';
  const digit = String(semStr).replace(/[^0-9]/g, '');
  return digit ? `semester-${digit}` : 'semester-1';
}

export function slugToSem(slug) {
  if (!slug) return 'Sem 1';
  const digit = String(slug).replace(/[^0-9]/g, '');
  return digit ? `Sem ${digit}` : 'Sem 1';
}

// 4. Subject Slugs (e.g. 'Operating System' or 'KCS401' -> 'kcs401')
export function subjectToSlug(subject) {
  if (!subject) return 'subject';
  if (typeof subject === 'string') {
    return subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  if (subject.code) {
    return subject.code.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  const name = subject.name || subject.title || 'subject';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// 5. Clean URL Generators
export function getCourseUrl(courseKey) {
  return `/courses/${courseKeyToSlug(courseKey)}/`;
}

export function getYearUrl(courseKey, year) {
  return `/courses/${courseKeyToSlug(courseKey)}/${yearToSlug(year)}/`;
}

export function getSemesterUrl(courseKey, year, sem) {
  return `/courses/${courseKeyToSlug(courseKey)}/${yearToSlug(year)}/${semToSlug(sem)}/`;
}

export function getSubjectUrl(courseKey, year, sem, subject) {
  const cSlug = courseKeyToSlug(courseKey);
  const ySlug = yearToSlug(year);
  const sSlug = semToSlug(sem);
  const subSlug = subjectToSlug(subject);
  return `/courses/${cSlug}/${ySlug}/${sSlug}/${subSlug}/`;
}

// Direct subject lookup URL by code
export function getSubjectCodeUrl(subjectCode, courseKey = null) {
  const code = String(subjectCode || '').toLowerCase().trim();
  if (courseKey) {
    return `/courses/${courseKeyToSlug(courseKey)}/subject/${code}/`;
  }
  return `/subject/${code}`;
}

export default {
  COURSE_SLUG_MAP,
  SLUG_TO_COURSE_KEY,
  courseKeyToSlug,
  slugToCourseKey,
  yearToSlug,
  slugToYear,
  semToSlug,
  slugToSem,
  subjectToSlug,
  getCourseUrl,
  getYearUrl,
  getSemesterUrl,
  getSubjectUrl,
  getSubjectCodeUrl
};
