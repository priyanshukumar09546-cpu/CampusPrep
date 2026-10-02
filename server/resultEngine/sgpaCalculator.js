// Deterministic SGPA & CGPA Calculator & Backlog Analytics Engine
// All calculations use strict credit-weighted formulas or exact mathematical logic
// NEVER delegates calculation to AI/Gemini
// Implements Section 18 & 19 Active vs Cleared Backlog Logic

import { getGradePoint, isFailGrade } from './gradeSchemes.js';

/**
 * Calculate SGPA for a single semester
 * Formula: SGPA = Σ(Credit_i × GradePoint_i) / Σ(Credit_i)
 * 
 * @param {Array} subjects - Array of { credits, gradePoint, grade }
 * @param {string} schemeName - Grade scheme to use
 * @returns {{ sgpa: number|null, totalCredits: number, totalWeightedPoints: number, subjectCount: number, errors: string[] }}
 */
export function calculateSGPA(subjects, schemeName = 'AKTU') {
  const errors = [];
  
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return { sgpa: null, totalCredits: 0, totalWeightedPoints: 0, subjectCount: 0, errors: ['No subjects provided'] };
  }

  let totalCredits = 0;
  let totalWeightedPoints = 0;
  let validSubjectCount = 0;

  for (const sub of subjects) {
    const credits = parseFloat(sub.credits);
    if (isNaN(credits) || credits <= 0) {
      errors.push(`Subject ${sub.subjectCode || '?'}: invalid credits (${sub.credits})`);
      continue;
    }

    let gp = null;
    if (sub.gradePoint !== null && sub.gradePoint !== undefined && !isNaN(parseFloat(sub.gradePoint))) {
      gp = parseFloat(sub.gradePoint);
    } else if (sub.grade) {
      gp = getGradePoint(sub.grade, schemeName);
    }

    if (gp === null) {
      errors.push(`Subject ${sub.subjectCode || '?'}: cannot determine grade point`);
      continue;
    }

    totalCredits += credits;
    totalWeightedPoints += credits * gp;
    validSubjectCount++;
  }

  if (totalCredits === 0 || validSubjectCount === 0) {
    return { sgpa: null, totalCredits: 0, totalWeightedPoints: 0, subjectCount: 0, errors };
  }

  const sgpa = Math.round((totalWeightedPoints / totalCredits) * 100) / 100;

  return {
    sgpa,
    totalCredits,
    totalWeightedPoints,
    subjectCount: validSubjectCount,
    errors: errors.length > 0 ? errors : []
  };
}

/**
 * Calculate CGPA across multiple semesters using credit-weighted cumulative method
 * Formula: CGPA = Σ(all semester credits × grade points) / Σ(all semester credits)
 * 
 * @param {Array} semesters - Array of { subjects: [...], sgpa, credits }
 * @param {string} schemeName
 * @returns {{ cgpa: number|null, totalCredits: number, totalWeightedPoints: number, semesterCount: number, perSemesterCGPA: Array }}
 */
export function calculateCGPA(semesters, schemeName = 'AKTU') {
  if (!Array.isArray(semesters) || semesters.length === 0) {
    return { cgpa: null, totalCredits: 0, totalWeightedPoints: 0, semesterCount: 0, perSemesterCGPA: [] };
  }

  let cumulativeCredits = 0;
  let cumulativeWeightedPoints = 0;
  const perSemesterCGPA = [];

  const sorted = [...semesters].sort((a, b) => (a.semesterNumber || 0) - (b.semesterNumber || 0));

  for (const sem of sorted) {
    if (Array.isArray(sem.subjects) && sem.subjects.length > 0) {
      const semResult = calculateSGPA(sem.subjects, schemeName);
      if (semResult.sgpa !== null) {
        cumulativeCredits += semResult.totalCredits;
        cumulativeWeightedPoints += semResult.totalWeightedPoints;
      }
    } else if (sem.sgpa !== null && sem.sgpa !== undefined && sem.creditsEarned) {
      const sgpa = parseFloat(sem.sgpa);
      const cr = parseFloat(sem.creditsEarned);
      if (!isNaN(sgpa) && !isNaN(cr) && cr > 0) {
        cumulativeCredits += cr;
        cumulativeWeightedPoints += cr * sgpa;
      }
    }

    const cgpaAtThisPoint = cumulativeCredits > 0
      ? Math.round((cumulativeWeightedPoints / cumulativeCredits) * 100) / 100
      : null;

    perSemesterCGPA.push({
      semesterNumber: sem.semesterNumber,
      cumulativeCGPA: cgpaAtThisPoint,
      cumulativeCredits,
      cumulativeWeightedPoints
    });
  }

  const cgpa = cumulativeCredits > 0
    ? Math.round((cumulativeWeightedPoints / cumulativeCredits) * 100) / 100
    : null;

  return {
    cgpa,
    totalCredits: cumulativeCredits,
    totalWeightedPoints: cumulativeWeightedPoints,
    semesterCount: sorted.length,
    perSemesterCGPA
  };
}

/**
 * Compare calculated values with official values
 */
export function compareCGPA(calculated, official, tolerance = 0.05) {
  if (calculated === null && official === null) {
    return { match: null, difference: null, note: 'Neither calculated nor official CGPA available' };
  }
  if (calculated === null) {
    return { match: null, difference: null, note: 'Calculated CGPA not available for comparison' };
  }
  if (official === null) {
    return { match: null, difference: null, note: 'Official CGPA not found in document' };
  }

  const diff = Math.abs(calculated - official);
  const match = diff <= tolerance;

  return {
    match,
    difference: Math.round(diff * 100) / 100,
    note: match
      ? `Calculated CGPA (${calculated}) matches official CGPA (${official})`
      : `CGPA verification note: calculated ${calculated} vs official ${official} (difference: ${diff.toFixed(2)})`
  };
}

/**
 * Critical Active Backlog Algorithm (Sections 18 & 19)
 * 
 * Rules:
 * 1. Do NOT count every historical F as an active backlog forever.
 * 2. A subject is ACTIVE only when the latest known valid attempt is unsuccessful.
 * 3. A subject becomes CLEARED when a later valid attempt is successfully completed.
 * 4. Tracks both detailed subject-level attempts AND One View session COP clearing.
 * 
 * @param {Array} semesters - Array of semester objects
 * @param {Array} rawSessions - Array of session objects from One View
 * @returns {object} Backlog analytics
 */
export function computeBacklogAnalytics(semesters = [], rawSessions = []) {
  const backlogsByCode = new Map();

  // 1. One View Session-Based Analysis (e.g. Priyanshu Kumar's result)
  if (Array.isArray(rawSessions) && rawSessions.length > 0) {
    for (const s of rawSessions) {
      const isBackSession = /BACK|SPL|SPECIAL|SUPPLEMENTARY/i.test(s.session);
      const isClearedSession = s.result === 'PWG' || s.result === 'PASS' || s.result === 'CLEAR';

      // If a back session successfully cleared papers
      if (isBackSession && isClearedSession) {
        for (const [code, info] of backlogsByCode.entries()) {
          const inThisSem = info.semesters.some(sem => s.semesters.includes(sem));
          if (inThisSem && (!s.cop || !s.cop.includes(code))) {
            info.history.push({
              session: s.session,
              status: 'CLEARED',
              result: s.result,
              note: `Cleared in ${s.session} (${s.result})`
            });
            info.currentStatus = 'CLEARED';
          }
        }
      }

      // Register COPs present in this session
      for (const code of (s.cop || [])) {
        if (!backlogsByCode.has(code)) {
          backlogsByCode.set(code, {
            subjectCode: code,
            subjectName: code,
            semesters: s.semesters,
            history: [{
              session: s.session,
              status: 'BACKLOG',
              result: s.result,
              note: `Carry-over paper in ${s.session}`
            }],
            currentStatus: 'ACTIVE'
          });
        } else {
          const info = backlogsByCode.get(code);
          info.history.push({
            session: s.session,
            status: 'BACKLOG',
            result: s.result,
            note: `Still active in ${s.session}`
          });
          info.currentStatus = 'ACTIVE';
        }
      }
    }
  }

  // 2. Detailed Subject-Level Analysis across semesters
  const allSubjects = [];
  for (const sem of semesters) {
    for (const sub of (sem.subjects || [])) {
      if (sub.subjectCode || sub.subjectName) {
        allSubjects.push({
          ...sub,
          semesterNumber: sem.semesterNumber,
          session: sem.session || `Semester ${sem.semesterNumber}`
        });
      }
    }
  }

  // Group by subject code / normalized name
  const subjectHistoryMap = new Map();
  for (const sub of allSubjects) {
    const key = (sub.subjectCode || sub.subjectName).trim().toUpperCase();
    if (!subjectHistoryMap.has(key)) {
      subjectHistoryMap.set(key, []);
    }
    subjectHistoryMap.get(key).push(sub);
  }

  for (const [code, attempts] of subjectHistoryMap.entries()) {
    // Sort attempts by semester number
    attempts.sort((a, b) => a.semesterNumber - b.semesterNumber);

    const hasAnyFail = attempts.some(a =>
      a.result === 'Fail' || a.result === 'Backlog' || isFailGrade(a.grade)
    );

    if (hasAnyFail) {
      const latestAttempt = attempts[attempts.length - 1];
      const isLatestPass = latestAttempt.result === 'Pass' ||
        (!isFailGrade(latestAttempt.grade) && latestAttempt.grade !== null);

      if (!backlogsByCode.has(code)) {
        backlogsByCode.set(code, {
          subjectCode: latestAttempt.subjectCode || code,
          subjectName: latestAttempt.subjectName || code,
          semesters: attempts.map(a => a.semesterNumber),
          history: attempts.map(a => ({
            session: a.session,
            semester: a.semesterNumber,
            grade: a.grade,
            marks: a.marks,
            status: (a.result === 'Fail' || isFailGrade(a.grade)) ? 'BACKLOG' : 'CLEARED'
          })),
          currentStatus: isLatestPass ? 'CLEARED' : 'ACTIVE'
        });
      }
    }
  }

  // Fallback: Check COP lists attached to semesters directly
  for (const sem of semesters) {
    for (const cop of (sem.carryOverPapers || [])) {
      const code = cop.trim().toUpperCase();
      if (!backlogsByCode.has(code)) {
        backlogsByCode.set(code, {
          subjectCode: code,
          subjectName: code,
          semesters: [sem.semesterNumber],
          history: [{
            session: sem.session || `Semester ${sem.semesterNumber}`,
            status: 'BACKLOG',
            result: sem.status || 'PCP'
          }],
          currentStatus: sem.status === 'PWG' || sem.status === 'PASS' ? 'CLEARED' : 'ACTIVE'
        });
      }
    }
  }

  const all = Array.from(backlogsByCode.values());
  const active = all.filter(b => b.currentStatus === 'ACTIVE');
  const cleared = all.filter(b => b.currentStatus === 'CLEARED');

  // Semester-wise active backlog counts for trend
  const sortedSemesters = [...semesters].sort((a, b) => a.semesterNumber - b.semesterNumber);
  const backlogTrend = sortedSemesters.map(sem => {
    // Count active backlogs at the time of this semester
    const sCops = sem.carryOverPapers || [];
    return {
      semester: sem.semesterNumber,
      label: sem.semesterName || `Sem ${sem.semesterNumber}`,
      activeCount: sCops.length,
      cops: sCops
    };
  });

  return {
    historicalBacklogs: all.length,
    activeBacklogs: active.length,
    clearedBacklogs: cleared.length,
    activeList: active.map(b => b.subjectCode),
    clearedList: cleared.map(b => b.subjectCode),
    details: all,
    trend: backlogTrend
  };
}

/**
 * Compute comprehensive academic statistics from validated result data
 */
export function computeAcademicStats(validatedResult) {
  const semesters = validatedResult?.semesters || [];
  const rawSessions = validatedResult?.rawSessions || [];
  const allSubjects = [];
  const gradeDistribution = {};
  let highestMarks = null;
  let lowestMarks = null;
  let marksSum = 0;
  let marksCount = 0;

  for (const sem of semesters) {
    for (const sub of (sem.subjects || [])) {
      allSubjects.push({ ...sub, semesterNumber: sem.semesterNumber });

      if (sub.grade) {
        gradeDistribution[sub.grade] = (gradeDistribution[sub.grade] || 0) + 1;
      }

      if (sub.marks !== null && sub.marks !== undefined) {
        const m = parseFloat(sub.marks);
        if (!isNaN(m)) {
          marksSum += m;
          marksCount++;
          if (highestMarks === null || m > highestMarks.value) {
            highestMarks = { value: m, subjectCode: sub.subjectCode, subjectName: sub.subjectName, semester: sem.semesterNumber };
          }
          if (lowestMarks === null || m < lowestMarks.value) {
            lowestMarks = { value: m, subjectCode: sub.subjectCode, subjectName: sub.subjectName, semester: sem.semesterNumber };
          }
        }
      }
    }
  }

  // Active vs Cleared Backlog Analysis
  const backlogAnalytics = computeBacklogAnalytics(semesters, rawSessions);

  // Strongest and weakest subjects
  const strongestSubjects = allSubjects
    .filter(s => s.gradePoint !== null && s.gradePoint >= 8)
    .sort((a, b) => b.gradePoint - a.gradePoint)
    .slice(0, 5);

  const weakestSubjects = allSubjects
    .filter(s => s.gradePoint !== null && s.gradePoint <= 5 && s.gradePoint > 0)
    .sort((a, b) => a.gradePoint - b.gradePoint)
    .slice(0, 5);

  // SGPA trend (or percentage trend if SGPA unavailable)
  const sgpas = semesters
    .filter(s => s.calculatedSGPA !== null || s.sgpa !== null)
    .sort((a, b) => a.semesterNumber - b.semesterNumber)
    .map(s => ({ sem: s.semesterNumber, sgpa: s.calculatedSGPA ?? s.sgpa }));

  let trend = 'Insufficient Data';
  let trendDescription = 'Not enough semester data to determine trend.';

  if (sgpas.length > 1) {
    const first = sgpas[0].sgpa;
    const last = sgpas[sgpas.length - 1].sgpa;
    const diff = Math.round((last - first) * 100) / 100;
    if (diff >= 0.25) {
      trend = 'Improving';
      trendDescription = `Upward trend: +${diff.toFixed(2)} from Sem ${sgpas[0].sem} to Sem ${sgpas[sgpas.length - 1].sem}`;
    } else if (diff <= -0.25) {
      trend = 'Declining';
      trendDescription = `Downward trend: ${diff.toFixed(2)} from Sem ${sgpas[0].sem} to Sem ${sgpas[sgpas.length - 1].sem}`;
    } else {
      trend = 'Stable';
      trendDescription = `Stable performance (±${Math.abs(diff).toFixed(2)} from Sem ${sgpas[0].sem} to Sem ${sgpas[sgpas.length - 1].sem})`;
    }
  } else if (rawSessions.length > 1) {
    // Determine trend from session percentage improvement
    const p1 = rawSessions[0].percentage;
    const pLast = rawSessions[rawSessions.length - 1].percentage;
    if (p1 && pLast) {
      const diff = Math.round((pLast - p1) * 100) / 100;
      if (diff >= 1.0) {
        trend = 'Improving';
        trendDescription = `Score improved by +${diff}% across academic sessions (${p1}% to ${pLast}%)`;
      } else if (diff <= -1.0) {
        trend = 'Declining';
        trendDescription = `Score dropped by ${diff}% across academic sessions (${p1}% to ${pLast}%)`;
      } else {
        trend = 'Stable';
        trendDescription = `Consistent academic performance across sessions (~${pLast}%)`;
      }
    }
  }

  // Marks total across sessions, semesters, or subjects
  let totalMarksObtained = 0;
  let totalMaxMarks = 0;
  for (const s of rawSessions) {
    if (s.marks && s.maxMarks) {
      totalMarksObtained += s.marks;
      totalMaxMarks += s.maxMarks;
    }
  }

  // Fallback to semester marks totals if rawSessions was empty
  if (totalMarksObtained === 0 && totalMaxMarks === 0) {
    for (const sem of semesters) {
      const obt = sem.totalMarks ?? sem.totalMarksObtained;
      const max = sem.maxMarks ?? sem.totalMaximumMarks;
      if (obt !== null && obt !== undefined && max !== null && max !== undefined && !isNaN(Number(obt)) && !isNaN(Number(max))) {
        totalMarksObtained += Number(obt);
        totalMaxMarks += Number(max);
      }
    }
  }

  // Fallback to subject marks sum if semester totals were not provided
  if (totalMarksObtained === 0 && marksCount > 0) {
    let subMaxSum = 0;
    for (const sub of allSubjects) {
      const mx = sub.maxMarks ?? sub.maximumMarks;
      if (mx !== null && mx !== undefined && !isNaN(Number(mx))) {
        subMaxSum += Number(mx);
      }
    }
    if (subMaxSum > 0) {
      totalMarksObtained = marksSum;
      totalMaxMarks = subMaxSum;
    }
  }

  return {
    totalSubjects: allSubjects.length,
    passedSubjects: allSubjects.filter(s => !isFailGrade(s.grade)).length,
    failedSubjects: backlogAnalytics.activeBacklogs,
    totalBacklogs: backlogAnalytics.activeBacklogs,
    historicalBacklogs: backlogAnalytics.historicalBacklogs,
    clearedBacklogs: backlogAnalytics.clearedBacklogs,
    backlogAnalytics,
    gradeDistribution,
    strongestSubjects,
    weakestSubjects,
    highestMarks,
    lowestMarks,
    averageMarks: marksCount > 0 ? Math.round((marksSum / marksCount) * 100) / 100 : null,
    totalMarksObtained: totalMarksObtained > 0 ? totalMarksObtained : null,
    totalMaxMarks: totalMaxMarks > 0 ? totalMaxMarks : null,
    overallPercentage: totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 10000) / 100 : null,
    marksAvailable: marksCount > 0 || totalMarksObtained > 0,
    trend,
    trendDescription,
    highestSGPA: sgpas.length > 0 ? sgpas.reduce((max, s) => s.sgpa > max.sgpa ? s : max, sgpas[0]) : null,
    lowestSGPA: sgpas.length > 0 ? sgpas.reduce((min, s) => s.sgpa < min.sgpa ? s : min, sgpas[0]) : null
  };
}
