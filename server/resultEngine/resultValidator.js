// Result Validation Engine
// Ensures extracted data actually represents a student result document
// Requires multiple corroborating signals before accepting

import { normalizeGrade, getGradePoint, isFailGrade } from './gradeSchemes.js';

/**
 * Validate whether extracted data represents a genuine student result
 * Requires minimum evidence threshold before accepting
 * 
 * @param {object} extracted - Raw Gemini extraction result
 * @returns {{ isValid: boolean, validatedResult: object|null, validation: object, errors: string[] }}
 */
export function validateResultDocument(extracted) {
  const errors = [];
  const validation = {
    studentIdentityFound: false,
    rollNumberFound: false,
    courseOrInstitutionFound: false,
    semesterFound: false,
    subjectTableFound: false,
    creditsFound: false,
    gradesFound: false,
    resultStatusFound: false,
    sessionMarksFound: false,
    carryOverPapersFound: false,
    evidenceScore: 0,
    minimumRequired: 3
  };

  if (!extracted) {
    errors.push('No extraction data provided');
    return { isValid: false, validatedResult: null, validation, errors };
  }

  // Check document-level confidence
  if (extracted.document) {
    if (extracted.document.isStudentResult === false) {
      // Only hard-reject if confidence is very low AND no student identity found
      const hasAnyStudentInfo = extracted.student?.name || extracted.student?.rollNumber || extracted.student?.enrollmentNumber;
      if (!hasAnyStudentInfo) {
        errors.push('Document was not identified as a student result by the extractor');
        return { isValid: false, validatedResult: null, validation, errors };
      }
      // If student info exists but extractor said isStudentResult=false, continue with validation
    }
    if (extracted.document.confidence !== null && extracted.document.confidence < 0.15) {
      errors.push(`Document confidence too low: ${extracted.document.confidence}`);
      return { isValid: false, validatedResult: null, validation, errors };
    }
  }

  // 1. Student Identity
  const student = extracted.student || {};
  if (student.name && student.name.length >= 2 && !/^(test|sample|demo|example|null|undefined|n\/a)$/i.test(student.name)) {
    validation.studentIdentityFound = true;
    validation.evidenceScore++;
  } else {
    errors.push('Student name not found or invalid');
  }

  // 2. Roll/Enrollment Number
  if (student.rollNumber && student.rollNumber.length >= 4 && /\d/.test(student.rollNumber)) {
    validation.rollNumberFound = true;
    validation.evidenceScore++;
  } else if (student.enrollmentNumber && student.enrollmentNumber.length >= 4 && /\d/.test(student.enrollmentNumber)) {
    validation.rollNumberFound = true;
    validation.evidenceScore++;
  } else {
    errors.push('Roll number or enrollment number not found');
  }

  // 3. Course/Institution
  if ((student.course && student.course.length >= 3) || 
      (student.branch && student.branch.length >= 3) || 
      (student.college && student.college.length >= 5)) {
    validation.courseOrInstitutionFound = true;
    validation.evidenceScore++;
  }

  // 4. Semesters
  const semesters = extracted.semesters || [];
  if (semesters.length > 0) {
    validation.semesterFound = true;
    validation.evidenceScore++;
  } else {
    errors.push('No semesters detected');
  }

  // 5. Subject table validation
  let totalSubjectsWithData = 0;
  let totalCreditsFound = 0;
  let totalGradesFound = 0;
  let totalResultStatusFound = 0;
  let totalSessionMarks = 0;
  let totalCarryOverPapers = 0;

  for (const sem of semesters) {
    // Session-level marks (AKTU One View format)
    if (sem.totalMarks !== null && sem.totalMarks !== undefined && sem.totalMarks > 0) {
      totalSessionMarks++;
    }

    // Carry-over papers count
    if (Array.isArray(sem.carryOverPapers) && sem.carryOverPapers.length > 0) {
      totalCarryOverPapers += sem.carryOverPapers.length;
    }

    // Semester-level result status
    if (sem.status && /pass|fail|backlog|clear|promoted|pcp|pwg|re-appear/i.test(sem.status)) {
      totalResultStatusFound++;
    }

    const subjects = sem.subjects || [];
    for (const sub of subjects) {
      // A subject must have at least a code or name
      if (!sub.subjectCode && !sub.subjectName) continue;
      
      // Reject obvious OCR garbage
      if (sub.subjectName && /^[\W_]+$/.test(sub.subjectName)) continue;
      if (sub.subjectCode && sub.subjectCode.length > 12) continue;

      let hasAcademicData = false;

      // Credits
      if (sub.credits !== null && sub.credits !== undefined) {
        const cr = parseFloat(sub.credits);
        if (!isNaN(cr) && cr >= 0.5 && cr <= 20) {
          totalCreditsFound++;
          hasAcademicData = true;
        }
      }

      // Grade
      if (sub.grade) {
        const normalized = normalizeGrade(sub.grade);
        if (normalized) {
          totalGradesFound++;
          hasAcademicData = true;
        }
      }

      // Grade point
      if (sub.gradePoint !== null && sub.gradePoint !== undefined) {
        const gp = parseFloat(sub.gradePoint);
        if (!isNaN(gp) && gp >= 0 && gp <= 10) {
          hasAcademicData = true;
        }
      }

      // Marks
      if (sub.marks !== null && sub.marks !== undefined) {
        const m = parseFloat(sub.marks);
        if (!isNaN(m) && m >= 0 && m <= 500) {
          hasAcademicData = true;
        }
      }

      // Result status
      if (sub.result && /pass|fail|backlog|clear|promoted|pcp|pwg|re-appear/i.test(sub.result)) {
        totalResultStatusFound++;
        hasAcademicData = true;
      }

      if (hasAcademicData) {
        totalSubjectsWithData++;
      }
    }
  }

  if (totalSubjectsWithData >= 2) {
    validation.subjectTableFound = true;
    validation.evidenceScore++;
  }

  if (totalCreditsFound >= 2) {
    validation.creditsFound = true;
    validation.evidenceScore++;
  }

  if (totalGradesFound >= 2) {
    validation.gradesFound = true;
    validation.evidenceScore++;
  }

  if (totalResultStatusFound >= 1) {
    validation.resultStatusFound = true;
    validation.evidenceScore++;
  }

  // AKTU One View evidence: session marks and COP data count as strong signals
  if (totalSessionMarks >= 1) {
    validation.sessionMarksFound = true;
    validation.evidenceScore++;
  }

  if (totalCarryOverPapers >= 1) {
    validation.carryOverPapersFound = true;
    validation.evidenceScore++;
  }

  // Minimum evidence threshold
  const isValid = validation.evidenceScore >= validation.minimumRequired;

  if (!isValid) {
    errors.push(`Insufficient evidence: score ${validation.evidenceScore}/${validation.minimumRequired}. ` +
      'This PDF does not appear to contain a valid student result with enough identifiable data.');
    return { isValid: false, validatedResult: null, validation, errors };
  }

  // Build validated result with sanitized data
  const validatedResult = buildValidatedResult(extracted);

  return { isValid: true, validatedResult, validation, errors };
}

/**
 * Build sanitized, validated result object from raw extraction
 */
function buildValidatedResult(extracted) {
  const student = sanitizeStudent(extracted.student || {});
  const semesters = (extracted.semesters || []).map(sem => sanitizeSemester(sem));
  
  // Sort semesters by number
  semesters.sort((a, b) => a.semesterNumber - b.semesterNumber);

  const officialSummary = {
    officialSGPA: safeNumber(extracted.officialSummary?.officialSGPA, 0, 10),
    officialCGPA: safeNumber(extracted.officialSummary?.officialCGPA, 0, 10),
    totalCreditsEarned: safeNumber(extracted.officialSummary?.totalCreditsEarned, 0, 500),
    backlogCount: safeInt(extracted.officialSummary?.backlogCount, 0, 100)
  };

  return {
    document: {
      isStudentResult: true,
      documentType: extracted.document?.documentType || 'result',
      confidence: extracted.document?.confidence ?? null,
      university: extracted.document?.university || null
    },
    student,
    rawSessions: extracted.rawSessions || [],
    semesters,
    officialSummary
  };
}

/**
 * Sanitize student data
 */
function sanitizeStudent(raw) {
  return {
    name: sanitizeString(raw.name) || null,
    fatherName: sanitizeString(raw.fatherName) || null,
    gender: sanitizeString(raw.gender) || null,
    rollNumber: sanitizeString(raw.rollNumber) || null,
    enrollmentNumber: sanitizeString(raw.enrollmentNumber) || null,
    course: sanitizeString(raw.course) || null,
    branch: sanitizeString(raw.branch) || null,
    college: sanitizeString(raw.college) || null,
    year: sanitizeString(raw.year) || null
  };
}

/**
 * Sanitize a single semester
 */
function sanitizeSemester(raw) {
  const semNum = parseInt(raw.semesterNumber, 10);
  const subjects = (raw.subjects || [])
    .map(sub => sanitizeSubject(sub))
    .filter(sub => sub !== null);

  return {
    semesterNumber: isNaN(semNum) ? null : semNum,
    semesterName: raw.semesterName || (semNum ? `Semester ${semNum}` : null),
    session: sanitizeString(raw.session) || null,
    sgpa: safeNumber(raw.sgpa, 0, 10),
    cgpa: safeNumber(raw.cgpa, 0, 10),
    totalMarks: safeNumber(raw.totalMarks, 0, 10000),
    maxMarks: safeNumber(raw.maxMarks, 0, 10000),
    creditsAttempted: safeNumber(raw.creditsAttempted, 0, 100),
    creditsEarned: safeNumber(raw.creditsEarned, 0, 100),
    status: sanitizeResultStatus(raw.status),
    carryOverPapers: Array.isArray(raw.carryOverPapers) ? raw.carryOverPapers : [],
    subjects
  };
}

/**
 * Sanitize a single subject
 */
function sanitizeSubject(raw) {
  if (!raw) return null;

  const code = sanitizeString(raw.subjectCode);
  const name = sanitizeString(raw.subjectName);

  // Must have at least a code or name
  if (!code && !name) return null;

  // Reject obvious garbage
  if (name && name.length < 2) return null;
  if (code && code.length > 12) return null;

  const grade = normalizeGrade(raw.grade);
  const gradePoint = raw.gradePoint !== null && raw.gradePoint !== undefined
    ? safeNumber(raw.gradePoint, 0, 10)
    : (grade ? getGradePoint(grade) : null);

  const rawMarks = raw.marksObtained !== undefined ? raw.marksObtained : raw.marks;
  const rawMax = raw.maximumMarks !== undefined ? raw.maximumMarks : raw.maxMarks;
  const cleanMarks = safeNumber(rawMarks, 0, 500);
  const cleanMax = safeNumber(rawMax, 0, 500);
  const statusStr = sanitizeResultStatus(raw.status || raw.result);

  return {
    subjectCode: code,
    subjectName: name,
    marks: cleanMarks,
    marksObtained: cleanMarks,
    maxMarks: cleanMax,
    maximumMarks: cleanMax,
    credits: safeNumber(raw.credits, 0, 20),
    grade,
    gradePoint,
    status: statusStr,
    result: statusStr
  };
}

/**
 * Sanitize result status string
 */
function sanitizeResultStatus(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.trim().toLowerCase();
  if (/^pass/i.test(cleaned)) return 'Pass';
  if (/^fail/i.test(cleaned)) return 'Fail';
  if (/^backlog/i.test(cleaned)) return 'Backlog';
  if (/^clear/i.test(cleaned)) return 'Pass';
  if (/^promot/i.test(cleaned)) return 'Pass';
  if (/^pcp|^pwg/i.test(cleaned)) return 'Backlog';
  if (/^re-?appear/i.test(cleaned)) return 'Backlog';
  return raw.trim() || null;
}

// --- Utility Helpers ---

function sanitizeString(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object' && val.value !== undefined) {
    val = val.value;
  }
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (s === '' || s.toLowerCase() === 'null' || s.toLowerCase() === 'n/a' || s === '-') return null;
  return s;
}

function safeNumber(val, min, max) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object' && val.value !== undefined) {
    val = val.value;
  }
  if (val === null || val === undefined) return null;
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  if (n < min || n > max) return null;
  return Math.round(n * 100) / 100;
}

function safeInt(val, min, max) {
  if (val === null || val === undefined) return null;
  const n = parseInt(val, 10);
  if (isNaN(n)) return null;
  if (n < min || n > max) return null;
  return n;
}
