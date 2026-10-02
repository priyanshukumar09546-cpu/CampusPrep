// ============================================================================
// PROFESSORVIRUS — ATTENDANCE CALCULATION & PROJECTION ENGINE
// Deterministic mathematical formulas for attendance tracking & targets
// Strictly follows mathematical rules — NEVER invents or hardcodes numbers
// ============================================================================

/**
 * Calculate attendance metrics for a single subject or arbitrary lecture counts
 * 
 * @param {number} attended - Number of attended lectures
 * @param {number} total - Total number of conducted lectures
 * @param {number} targetPercentage - Target attendance percentage (e.g. 75)
 * @returns {object} Calculated attendance metrics
 */
export function calculateAttendanceMetrics(attended = 0, total = 0, targetPercentage = 75) {
  const att = Math.max(0, parseInt(attended, 10) || 0);
  const tot = Math.max(0, parseInt(total, 10) || 0);
  const target = Math.min(100, Math.max(1, parseFloat(targetPercentage) || 75));
  const T = target / 100;

  // Ensure attended cannot exceed total
  const safeAttended = Math.min(att, tot);
  const absent = Math.max(0, tot - safeAttended);

  // Exact percentage with full precision, rounded to 2 decimal places for display
  const percentage = tot > 0
    ? Math.round((safeAttended / tot) * 10000) / 100
    : 0;

  let canSkip = 0;
  let neededToReach = 0;
  let isTargetPossible = true;
  let status = 'On Track';
  let message = '';
  let statusTone = 'green'; // 'green' | 'yellow' | 'red' | 'neutral'

  if (tot === 0) {
    status = 'On Track';
    statusTone = 'neutral';
    message = 'No lectures conducted yet. Add lectures to begin tracking.';
  } else if (percentage >= target) {
    // Current attendance meets or exceeds target
    // Formula: floor((A - T * L) / T)
    const rawSkip = (safeAttended - T * tot) / T;
    canSkip = Math.max(0, Math.floor(rawSkip));
    neededToReach = 0;

    if (percentage >= target + 5) {
      status = 'Safe';
      statusTone = 'green';
    } else {
      status = 'On Track';
      statusTone = 'green';
    }

    if (canSkip === 0) {
      message = `You are on track at ${percentage.toFixed(2)}%. Attending upcoming lectures is recommended to build a safety buffer.`;
    } else {
      message = `You are safe! You can skip up to ${canSkip} more lecture${canSkip === 1 ? '' : 's'} and still maintain at least ${target}% attendance.`;
    }
  } else {
    // Current attendance is below target
    canSkip = 0;

    if (T >= 1.0) {
      // 100% target is mathematically impossible once 1 lecture is missed
      isTargetPossible = false;
      neededToReach = Infinity;
      status = 'Below Target';
      statusTone = 'red';
      message = `With ${absent} missed lecture${absent === 1 ? '' : 's'}, 100% attendance is mathematically unreachable. Every future lecture must be attended to maximize your score.`;
    } else {
      // Formula: ceil((T * L - A) / (1 - T))
      const rawNeeded = (T * tot - safeAttended) / (1 - T);
      neededToReach = Math.max(1, Math.ceil(rawNeeded));

      if (percentage >= target - 5) {
        status = 'Target Risk';
        statusTone = 'yellow';
        message = `You're close to your target. You need to attend the next ${neededToReach} consecutive lecture${neededToReach === 1 ? '' : 's'} to reach ${target}%.`;
      } else {
        status = 'Below Target';
        statusTone = 'red';
        message = `Your attendance is below target. You need to attend ${neededToReach} consecutive lecture${neededToReach === 1 ? '' : 's'} to reach ${target}%.`;
      }
    }
  }

  // Projection tables for planning
  const skipProjections = [1, 2, 3, 5, 6, 10, 15].map(sCount => {
    const newTot = tot + sCount;
    const newAtt = safeAttended;
    const projPct = newTot > 0 ? Math.round((newAtt / newTot) * 10000) / 100 : 0;
    return {
      count: sCount,
      projectedAttendance: projPct,
      meetsTarget: projPct >= target
    };
  });

  const attendProjections = [1, 2, 3, 5, 10, 15, 20].map(aCount => {
    const newTot = tot + aCount;
    const newAtt = safeAttended + aCount;
    const projPct = newTot > 0 ? Math.round((newAtt / newTot) * 10000) / 100 : 0;
    return {
      count: aCount,
      projectedAttendance: projPct,
      meetsTarget: projPct >= target
    };
  });

  return {
    totalLectures: tot,
    attendedLectures: safeAttended,
    absentLectures: absent,
    percentage,
    targetPercentage: target,
    lecturesCanSkip: canSkip,
    lecturesNeededToReachTarget: neededToReach,
    isTargetPossible,
    status,
    statusTone,
    message,
    skipProjections,
    attendProjections
  };
}

/**
 * Calculate overall cumulative attendance across multiple subjects
 * Formula: (Total Attended across all subjects / Total Conducted across all subjects) * 100
 * Strictly sums counts — NEVER averages subject percentages!
 * 
 * @param {Array} subjects - Array of subject objects with totalLectures & attendedLectures
 * @param {number} defaultTarget - Overall target percentage (default: 75)
 * @returns {object} Cumulative summary
 */
export function calculateOverallAttendance(subjects = [], defaultTarget = 75) {
  let overallTotal = 0;
  let overallAttended = 0;

  for (const sub of subjects) {
    const t = Math.max(0, parseInt(sub.totalLectures, 10) || 0);
    const a = Math.max(0, parseInt(sub.attendedLectures, 10) || 0);
    overallTotal += t;
    overallAttended += Math.min(a, t);
  }

  const baseMetrics = calculateAttendanceMetrics(overallAttended, overallTotal, defaultTarget);

  return {
    ...baseMetrics,
    subjectCount: subjects.length,
    overallTotalLectures: overallTotal,
    overallAttendedLectures: overallAttended,
    overallAbsentLectures: Math.max(0, overallTotal - overallAttended),
    overallPercentage: baseMetrics.percentage
  };
}

/**
 * Calculate weekly and monthly performance comparisons based on lecture date records
 * 
 * @param {Array} lectures - Array of lecture records with date ('YYYY-MM-DD') and status ('present' | 'absent')
 * @returns {object} { weekly: { attendance, change, label }, monthly: { attendance, change, label } }
 */
export function calculateTemporalAttendance(lectures = []) {
  if (!Array.isArray(lectures) || lectures.length === 0) {
    return {
      weekly: { attendance: null, change: null, label: 'Not enough history yet' },
      monthly: { attendance: null, change: null, label: 'Not enough history yet' }
    };
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const validLectures = lectures.map(l => {
    const timestamp = new Date(l.date).getTime();
    return {
      ...l,
      timestamp: isNaN(timestamp) ? now : timestamp,
      isPresent: String(l.status).toLowerCase() === 'present'
    };
  }).filter(l => !isNaN(l.timestamp));

  // Week 1 (last 7 days) vs Week 2 (previous 7-14 days)
  const last7Days = validLectures.filter(l => (now - l.timestamp) <= 7 * dayMs);
  const prev7Days = validLectures.filter(l => (now - l.timestamp) > 7 * dayMs && (now - l.timestamp) <= 14 * dayMs);

  const last7Att = last7Days.filter(l => l.isPresent).length;
  const last7Pct = last7Days.length > 0 ? Math.round((last7Att / last7Days.length) * 10000) / 100 : null;

  const prev7Att = prev7Days.filter(l => l.isPresent).length;
  const prev7Pct = prev7Days.length > 0 ? Math.round((prev7Att / prev7Days.length) * 10000) / 100 : null;

  let weeklyChange = null;
  if (last7Pct !== null && prev7Pct !== null) {
    weeklyChange = Math.round((last7Pct - prev7Pct) * 100) / 100;
  }

  // Month 1 (last 30 days) vs Month 2 (previous 30-60 days)
  const last30Days = validLectures.filter(l => (now - l.timestamp) <= 30 * dayMs);
  const prev30Days = validLectures.filter(l => (now - l.timestamp) > 30 * dayMs && (now - l.timestamp) <= 60 * dayMs);

  const last30Att = last30Days.filter(l => l.isPresent).length;
  const last30Pct = last30Days.length > 0 ? Math.round((last30Att / last30Days.length) * 10000) / 100 : null;

  const prev30Att = prev30Days.filter(l => l.isPresent).length;
  const prev30Pct = prev30Days.length > 0 ? Math.round((prev30Att / prev30Days.length) * 10000) / 100 : null;

  let monthlyChange = null;
  if (last30Pct !== null && prev30Pct !== null) {
    monthlyChange = Math.round((last30Pct - prev30Pct) * 100) / 100;
  }

  return {
    weekly: {
      attendance: last7Pct,
      change: weeklyChange,
      totalLectures: last7Days.length,
      label: last7Pct !== null ? `${last7Pct}%` : 'Not enough history'
    },
    monthly: {
      attendance: last30Pct,
      change: monthlyChange,
      totalLectures: last30Days.length,
      label: last30Pct !== null ? `${last30Pct}%` : 'Not enough history'
    }
  };
}
