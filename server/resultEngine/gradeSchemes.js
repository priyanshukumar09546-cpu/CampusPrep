// Configurable Grade Schemes for University Result Analysis
// Each scheme maps letter grades to grade points
// Supports multiple universities and easy future extension

export const GRADE_SCHEMES = {
  // AKTU (Dr. A.P.J. Abdul Kalam Technical University) 10-point scale
  AKTU: {
    name: 'AKTU 10-Point Grading System',
    maxGradePoint: 10,
    grades: {
      'O':  { point: 10, performance: 'Outstanding',    minMarks: 90 },
      'A+': { point: 9,  performance: 'Excellent',       minMarks: 80 },
      'A':  { point: 8,  performance: 'Very Good',       minMarks: 70 },
      'B+': { point: 7,  performance: 'Good',            minMarks: 60 },
      'B':  { point: 6,  performance: 'Above Average',   minMarks: 50 },
      'C':  { point: 5,  performance: 'Average',         minMarks: 45 },
      'P':  { point: 4,  performance: 'Pass',            minMarks: 40 },
      'F':  { point: 0,  performance: 'Fail',            minMarks: 0  }
    },
    failGrades: ['F'],
    passGrades: ['O', 'A+', 'A', 'B+', 'B', 'C', 'P'],
    cgpaMethod: 'credit_weighted_cumulative' // Σ(credit×gp) / Σ(credit) across all semesters
  },

  // Generic 10-point scale (fallback)
  GENERIC_10: {
    name: 'Generic 10-Point Grading System',
    maxGradePoint: 10,
    grades: {
      'O':  { point: 10, performance: 'Outstanding' },
      'A+': { point: 9,  performance: 'Excellent' },
      'A':  { point: 8,  performance: 'Very Good' },
      'B+': { point: 7,  performance: 'Good' },
      'B':  { point: 6,  performance: 'Above Average' },
      'C':  { point: 5,  performance: 'Average' },
      'D':  { point: 4,  performance: 'Below Average' },
      'P':  { point: 4,  performance: 'Pass' },
      'F':  { point: 0,  performance: 'Fail' }
    },
    failGrades: ['F'],
    passGrades: ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'P'],
    cgpaMethod: 'credit_weighted_cumulative'
  }
};

/**
 * Get grade point for a letter grade under a specific scheme
 * @param {string} grade - Letter grade (e.g., 'A+', 'O', 'F')
 * @param {string} schemeName - Grade scheme key (default: 'AKTU')
 * @returns {number|null} Grade point or null if grade not found
 */
export function getGradePoint(grade, schemeName = 'AKTU') {
  const scheme = GRADE_SCHEMES[schemeName] || GRADE_SCHEMES.AKTU;
  const normalized = grade?.trim()?.toUpperCase();
  if (!normalized) return null;
  const entry = scheme.grades[normalized];
  return entry ? entry.point : null;
}

/**
 * Check if a grade represents a fail
 * @param {string} grade
 * @param {string} schemeName
 * @returns {boolean}
 */
export function isFailGrade(grade, schemeName = 'AKTU') {
  const scheme = GRADE_SCHEMES[schemeName] || GRADE_SCHEMES.AKTU;
  const normalized = grade?.trim()?.toUpperCase();
  return scheme.failGrades.includes(normalized);
}

/**
 * Normalize a grade string to its canonical form
 * Handles common OCR errors and variations
 * @param {string} raw
 * @returns {string|null}
 */
export function normalizeGrade(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '');
  
  // Direct matches
  const VALID_GRADES = ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'P', 'F'];
  if (VALID_GRADES.includes(cleaned)) return cleaned;
  
  // Common OCR misreads
  const OCR_FIXES = {
    '0': 'O',     // zero vs letter O
    'A +': 'A+',
    'B +': 'B+',
    'E': null,    // E is ambiguous - don't guess
  };
  if (OCR_FIXES[cleaned] !== undefined) return OCR_FIXES[cleaned];
  
  return null;
}

/**
 * Get all valid grade strings for a scheme
 * @param {string} schemeName
 * @returns {string[]}
 */
export function getValidGrades(schemeName = 'AKTU') {
  const scheme = GRADE_SCHEMES[schemeName] || GRADE_SCHEMES.AKTU;
  return Object.keys(scheme.grades);
}
