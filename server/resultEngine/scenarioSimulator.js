// ============================================================================
// PROFESSORVIRUS — ACADEMIC PERFORMANCE WHAT-IF SCENARIO SIMULATOR
// Deterministic mathematical simulator for degree planning and target CGPA projection
// Strictly labeled as HYPOTHETICAL calculations (never claimed as official results)
// ============================================================================

import { getGradePoint } from './gradeSchemes.js';

/**
 * Calculate the exact SGPA required in remaining semesters to achieve a target graduation CGPA
 * 
 * Formula: Required SGPA = [TargetCGPA × (CurrentCredits + RemainingCredits) - CurrentCGPA × CurrentCredits] / RemainingCredits
 * 
 * @param {number} currentCGPA - Verified current cumulative CGPA
 * @param {number} currentCredits - Total credits earned so far
 * @param {number} targetCGPA - Student's desired target graduation CGPA
 * @param {number} remainingCredits - Estimated credits remaining in degree (default: 160 - currentCredits)
 * @returns {object} Feasibility report and target metrics
 */
export function calculateTargetSGPA(currentCGPA, currentCredits, targetCGPA, remainingCredits = null) {
  const curCGPA = parseFloat(currentCGPA) || 0;
  const curCreds = parseFloat(currentCredits) || 0;
  const tgtCGPA = parseFloat(targetCGPA) || 0;

  // Standard AKTU B.Tech degree requires 160 credits
  const totalDegreeCredits = 160;
  const remCreds = remainingCredits !== null
    ? (parseFloat(remainingCredits) || 20)
    : Math.max(20, totalDegreeCredits - curCreds);

  if (curCreds <= 0 || curCGPA <= 0) {
    return {
      success: false,
      error: 'Current CGPA and credits must be greater than zero.',
      isHypothetical: true
    };
  }

  const totalTargetPoints = tgtCGPA * (curCreds + remCreds);
  const currentEarnedPoints = curCGPA * curCreds;
  const requiredRemainingPoints = totalTargetPoints - currentEarnedPoints;
  const rawRequiredSGPA = requiredRemainingPoints / remCreds;
  const requiredSGPA = Math.round(rawRequiredSGPA * 100) / 100;

  // Maximum achievable CGPA if student scores a perfect 10.0 in all remaining credits
  const maxPossiblePoints = currentEarnedPoints + (10.0 * remCreds);
  const maxAchievableCGPA = Math.round((maxPossiblePoints / (curCreds + remCreds)) * 100) / 100;

  // Minimum possible CGPA if student scores passing 4.0 in all remaining credits
  const minPossiblePoints = currentEarnedPoints + (4.0 * remCreds);
  const minAchievableCGPA = Math.round((minPossiblePoints / (curCreds + remCreds)) * 100) / 100;

  let feasibility = 'ACHIEVABLE';
  let message = '';

  if (requiredSGPA > 10.0) {
    feasibility = 'MATHEMATICALLY_UNACHIEVABLE';
    message = `A target CGPA of ${tgtCGPA} is mathematically unachievable because it requires an average SGPA of ${requiredSGPA} across remaining credits (exceeding the 10.0 university maximum). The highest achievable graduation CGPA with a 10.0 SGPA in all remaining ${remCreds} credits is ${maxAchievableCGPA}.`;
  } else if (requiredSGPA <= 4.0) {
    feasibility = 'ALREADY_MET';
    message = `Your target CGPA of ${tgtCGPA} is comfortably achievable! Even with the minimum passing SGPA of 4.0 across remaining semesters, your graduation CGPA will be ${minAchievableCGPA}.`;
  } else if (requiredSGPA >= 9.0) {
    feasibility = 'HIGH_EFFORT';
    message = `To graduate with a ${tgtCGPA} CGPA, you must achieve an exceptional average SGPA of ${requiredSGPA} across your remaining ${remCreds} credits (Grade A+/O tier).`;
  } else {
    feasibility = 'REALISTIC';
    message = `To graduate with a ${tgtCGPA} CGPA, you need an average SGPA of ${requiredSGPA} across your remaining ${remCreds} credits.`;
  }

  return {
    success: true,
    isHypothetical: true,
    feasibility,
    requiredSGPA: Math.max(0, requiredSGPA),
    targetCGPA: tgtCGPA,
    currentCGPA: curCGPA,
    currentCredits: curCreds,
    remainingCredits: remCreds,
    maxAchievableCGPA,
    minAchievableCGPA,
    message,
    notice: 'Hypothetical simulation based on official AKTU credit-weighted formula. Official university results depend on verified evaluation.'
  };
}

/**
 * Simulate projected CGPA given a hypothetical SGPA in the upcoming semester
 * 
 * @param {number} currentCGPA - Verified current CGPA
 * @param {number} currentCredits - Current cumulative credits
 * @param {number} hypotheticalSGPA - Projected SGPA for next semester
 * @param {number} nextSemesterCredits - Projected credits for next semester (default: 20)
 * @returns {object} Simulation projection
 */
export function simulateSemesterPerformance(currentCGPA, currentCredits, hypotheticalSGPA, nextSemesterCredits = 20) {
  const curCGPA = parseFloat(currentCGPA) || 0;
  const curCreds = parseFloat(currentCredits) || 0;
  const hypSGPA = Math.min(10, Math.max(0, parseFloat(hypotheticalSGPA) || 0));
  const nextCreds = parseFloat(nextSemesterCredits) || 20;

  const currentPoints = curCGPA * curCreds;
  const nextPoints = hypSGPA * nextCreds;
  const totalCreds = curCreds + nextCreds;

  const projectedCGPA = totalCreds > 0
    ? Math.round(((currentPoints + nextPoints) / totalCreds) * 100) / 100
    : hypSGPA;

  const delta = Math.round((projectedCGPA - curCGPA) * 100) / 100;
  const direction = delta > 0 ? 'INCREASE' : delta < 0 ? 'DECREASE' : 'NO_CHANGE';

  return {
    success: true,
    isHypothetical: true,
    currentCGPA: curCGPA,
    currentCredits: curCreds,
    hypotheticalSGPA: hypSGPA,
    nextSemesterCredits: nextCreds,
    projectedCGPA,
    delta: Math.abs(delta),
    direction,
    summaryText: `If you score ${hypSGPA} SGPA next semester (${nextCreds} credits), your cumulative CGPA will ${direction === 'INCREASE' ? 'rise by +' : direction === 'DECREASE' ? 'drop by -' : 'remain at '}${Math.abs(delta)} to ${projectedCGPA}.`,
    notice: 'Hypothetical simulation based on official AKTU credit-weighted formula. Official university results depend on verified evaluation.'
  };
}

/**
 * Simulate clearing an active backlog subject with a specific grade
 * 
 * @param {number} currentCGPA - Verified current CGPA
 * @param {number} currentCredits - Current cumulative credits attempted
 * @param {number} subjectCredits - Credits of the backlogged subject
 * @param {string} projectedGrade - Projected grade (O, A+, A, B+, B, C, P)
 * @returns {object} Backlog clearance projection
 */
export function simulateBacklogClearance(currentCGPA, currentCredits, subjectCredits = 4, projectedGrade = 'A') {
  const curCGPA = parseFloat(currentCGPA) || 0;
  const curCreds = parseFloat(currentCredits) || 0;
  const creds = parseFloat(subjectCredits) || 4;
  const gp = getGradePoint(projectedGrade) || 8;

  const currentPoints = curCGPA * curCreds;
  // When backlog is cleared, the 0 grade point is replaced with the new grade point
  const additionalPoints = creds * gp;
  const projectedCGPA = curCreds > 0
    ? Math.round(((currentPoints + additionalPoints) / curCreds) * 100) / 100
    : 0;

  const delta = Math.round((projectedCGPA - curCGPA) * 100) / 100;

  return {
    success: true,
    isHypothetical: true,
    currentCGPA: curCGPA,
    subjectCredits: creds,
    projectedGrade,
    gradePoint: gp,
    projectedCGPA,
    delta: Math.abs(delta),
    summaryText: `Clearing your ${creds}-credit backlog with grade '${projectedGrade}' (${gp} GP) will boost your cumulative CGPA by +${delta} from ${curCGPA} to ${projectedCGPA}.`,
    notice: 'Hypothetical simulation based on official AKTU credit-weighted formula. Official university results depend on verified evaluation.'
  };
}
