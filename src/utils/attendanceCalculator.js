// ============================================================================
// PROFESSORVIRUS — CLIENT-SIDE ATTENDANCE ENGINE (Shared with server)
// ============================================================================

export function calculateAttendanceMetrics(attended = 0, total = 0, targetPercentage = 75) {
  const att = Math.max(0, parseInt(attended, 10) || 0);
  const tot = Math.max(0, parseInt(total, 10) || 0);
  const target = Math.min(100, Math.max(1, parseFloat(targetPercentage) || 75));
  const T = target / 100;

  const safeAttended = Math.min(att, tot);
  const absent = Math.max(0, tot - safeAttended);

  const percentage = tot > 0
    ? Math.round((safeAttended / tot) * 10000) / 100
    : 0;

  let canSkip = 0;
  let neededToReach = 0;
  let isTargetPossible = true;
  let status = 'On Track';
  let message = '';
  let statusTone = 'green';

  if (tot === 0) {
    status = 'On Track';
    statusTone = 'neutral';
    message = 'No lectures conducted yet. Add lectures or bulk update to start tracking.';
  } else if (percentage >= target) {
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
    canSkip = 0;

    if (T >= 1.0) {
      isTargetPossible = false;
      neededToReach = Infinity;
      status = 'Below Target';
      statusTone = 'red';
      message = `With ${absent} missed lecture${absent === 1 ? '' : 's'}, 100% attendance is mathematically unreachable. Every future lecture must be attended to maximize your score.`;
    } else {
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
