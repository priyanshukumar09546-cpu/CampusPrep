// AKTU & University Result PDF Parser
// Robust extraction of student details, semester tables, SGPA, CGPA, credits, and backlogs

const GRADE_POINTS_MAP = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0
};

// Convert Roman numerals to integers
function romanToInt(roman) {
  if (!roman) return 1;
  const map = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
  const upper = roman.toUpperCase().trim();
  return map[upper] || parseInt(roman, 10) || 1;
}

/**
 * Main Parser: Extracts structured academic data from raw PDF text
 * @param {string} rawText
 * @param {string} originalFileName
 * @returns {object} structured result
 */
export function parseResultText(rawText = '', originalFileName = 'result.pdf') {
  const cleanText = rawText.replace(/\r/g, '').trim();
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  if (!cleanText || cleanText.length < 20) {
    throw new Error("We couldn't detect readable university result text in this PDF. The document may be empty or encrypted.");
  }

  // 1. Extract Student Info
  let studentName = '';
  let rollNumber = '';
  let enrollmentNumber = '';
  let course = '';
  let branch = '';
  let institute = '';

  // Roll Number Match (10 to 14 digits)
  const rollMatch = cleanText.match(/(?:Roll\s*No\.?|Roll\s*Number|Roll\s*#)[:.\s]*([0-9]{10,14})/i);
  if (rollMatch) {
    rollNumber = rollMatch[1].trim();
  }

  // Enrollment Number Match
  const enrollMatch = cleanText.match(/(?:Enrollment\s*No\.?|Enroll\s*No\.?|Enrolment\s*No\.?)[:.\s]*([A-Za-z0-9]+)/i);
  if (enrollMatch) {
    enrollmentNumber = enrollMatch[1].trim();
  }

  // Student Name Match
  const nameMatch = cleanText.match(/(?:Student\s*Name|Candidate(?:'s)?\s*Name|Name\s*of\s*Candidate|Name)[:.\s]*([A-Z\s.]{3,45})(?:\n|Father|Roll|Enroll|Gender|Course|Branch|College|Institute|$)/i);
  if (nameMatch) {
    studentName = nameMatch[1].trim().replace(/\s+/g, ' ');
  } else {
    // Look for all-caps name line near header
    for (let i = 0; i < Math.min(15, lines.length); i++) {
      if (/^[A-Z\s]{4,30}$/.test(lines[i]) && !/UNIVERSITY|INSTITUTE|COLLEGE|AKTU|RESULT|TECHNICAL|BOARD|REPORT|EXAMINATION/i.test(lines[i])) {
        studentName = lines[i];
        break;
      }
    }
  }
  studentName = studentName.replace(/\s*(?:Gender|Branch|Course|Roll|Enroll|Father|Category).*$/i, '').trim();

  // Course Match
  const courseMatch = cleanText.match(/(?:Course|Programme|Program)[:.\s]*([^\n,]+)/i);
  if (courseMatch) {
    course = courseMatch[1].replace(/\s*(?:Gender|Branch|Roll|Enroll|Father|Category|Institute|College).*$/i, '').trim();
  } else {
    if (/B\.?\s*Tech|Bachelor of Technology/i.test(cleanText)) course = 'B.Tech';
    else if (/MCA|Master of Computer Applications/i.test(cleanText)) course = 'MCA';
    else if (/MBA|Master of Business Administration/i.test(cleanText)) course = 'MBA';
    else if (/B\.?\s*Pharm|Bachelor of Pharmacy/i.test(cleanText)) course = 'B.Pharm';
  }

  // Branch Match
  const branchMatch = cleanText.match(/(?:Branch|Discipline|Specialization)[:.\s]*([^\n,]+)/i);
  if (branchMatch) {
    branch = branchMatch[1].replace(/\s*(?:Gender|Course|Roll|Enroll|Father|Category|Institute|College).*$/i, '').trim();
  } else {
    if (/Computer Science|CSE/i.test(cleanText)) branch = 'Computer Science & Engineering (CSE)';
    else if (/Information Technology|\bIT\b/i.test(cleanText)) branch = 'Information Technology (IT)';
    else if (/Electronics & Communication|ECE/i.test(cleanText)) branch = 'Electronics & Communication (ECE)';
    else if (/Mechanical|ME/i.test(cleanText)) branch = 'Mechanical Engineering (ME)';
    else if (/Civil|CE/i.test(cleanText)) branch = 'Civil Engineering (CE)';
    else if (/Artificial Intelligence|AI/i.test(cleanText)) branch = 'Artificial Intelligence (AI/ML)';
  }

  // Institute Match
  const instMatch = cleanText.match(/(?:Institute(?:\s*Code)?(?:\s*&\s*Name)?|College(?:\s*Name)?)[:.\s]*([^\n]+)/i);
  if (instMatch) {
    institute = instMatch[1].trim();
  }

  // 2. Identify Semester Blocks
  // AKTU One View typically partitions results by Semester headings like:
  // "Session: 2021-22 (Semester 1)" or "Semester 1" or "Sem I" or "Semester - 3"
  const semesterRegex = /(?:Session\s*:\s*\d{4}-\d{2}\s*\(Semester\s*([0-9IVX]+)\)|Semester\s*[:.-]?\s*([0-9IVX]+)|Sem\s*[:.-]?\s*([0-9IVX]+))/gi;
  
  const semMatches = [];
  let m;
  while ((m = semesterRegex.exec(cleanText)) !== null) {
    const rawSem = m[1] || m[2] || m[3];
    const semNum = isNaN(rawSem) ? romanToInt(rawSem) : parseInt(rawSem, 10);
    semMatches.push({
      semNum,
      index: m.index
    });
  }

  // Split into semester chunks
  let semesterChunks = [];
  if (semMatches.length > 0) {
    // Deduplicate consecutive matches with same index
    const uniqueMatches = [];
    semMatches.forEach(item => {
      if (!uniqueMatches.find(u => u.semNum === item.semNum && Math.abs(u.index - item.index) < 50)) {
        uniqueMatches.push(item);
      }
    });

    for (let i = 0; i < uniqueMatches.length; i++) {
      const current = uniqueMatches[i];
      const startIdx = current.index;
      const endIdx = i + 1 < uniqueMatches.length ? uniqueMatches[i + 1].index : cleanText.length;
      semesterChunks.push({
        semNum: current.semNum,
        text: cleanText.substring(startIdx, endIdx)
      });
    }
  } else {
    // Check if the entire document is for a single semester
    const singleSemMatch = cleanText.match(/(?:Semester|Sem)\s*[:.-]?\s*([0-9IVX]+)/i);
    const semNum = singleSemMatch ? (isNaN(singleSemMatch[1]) ? romanToInt(singleSemMatch[1]) : parseInt(singleSemMatch[1], 10)) : 1;
    semesterChunks.push({
      semNum,
      text: cleanText
    });
  }

  // 3. Extract Subjects and Metrics for Each Semester
  const semestersData = [];
  const allBacklogs = [];
  let detectedOfficialOverallCgpa = null;

  // Check for global official CGPA label (e.g. "CGPA: 8.36" or "Overall CGPA: 8.36")
  const globalCgpaMatch = cleanText.match(/(?:Overall\s*CGPA|Cumulative\s*Grade\s*Point\s*Average|Final\s*CGPA|CGPA)[:.\s]*([0-9]+(?:\.[0-9]+)?)/i);
  if (globalCgpaMatch) {
    const parsed = parseFloat(globalCgpaMatch[1]);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 10) {
      detectedOfficialOverallCgpa = parsed;
    }
  }

  semesterChunks.forEach(chunk => {
    const semNum = chunk.semNum;
    const cText = chunk.text;

    // Extract SGPA if present
    let semSgpa = null;
    const sgpaMatch = cText.match(/SGPA[:.\s]*([0-9]+(?:\.[0-9]+)?)/i);
    if (sgpaMatch) {
      const parsedSgpa = parseFloat(sgpaMatch[1]);
      if (!isNaN(parsedSgpa) && parsedSgpa >= 0 && parsedSgpa <= 10) {
        semSgpa = parsedSgpa;
      }
    }

    // Extract Semester-specific CGPA if present
    let semCgpa = null;
    const semCgpaMatch = cText.match(/CGPA[:.\s]*([0-9]+(?:\.[0-9]+)?)/i);
    if (semCgpaMatch) {
      const parsedCgpa = parseFloat(semCgpaMatch[1]);
      if (!isNaN(parsedCgpa) && parsedCgpa >= 0 && parsedCgpa <= 10) {
        semCgpa = parsedCgpa;
      }
    }

    // Extract Total Credits if present
    let semCredits = null;
    const creditsMatch = cText.match(/(?:Total\s*Credits|Credits\s*Earned|Earned\s*Credits|Credits)[:.\s]*([0-9]+(?:\.[0-9]+)?)/i);
    if (creditsMatch) {
      semCredits = parseFloat(creditsMatch[1]);
    }

    // Extract Status
    let semStatus = 'Passed';
    if (/FAIL|BACKLOG|PCP|PWG|RE-APPEAR/i.test(cText)) {
      if (/FAIL|BACKLOG/i.test(cText)) semStatus = 'Backlog';
    }

    // Extract Subjects in this semester
    // Patterns for AKTU Subject Codes: 2 to 4 letters followed by optional hyphen and 3-4 digits
    // e.g. BAS103, KCS-301, BCS401, KEC201, KOE074, RCS501, BME101, BAS151, BCC301
    const subjectLines = cText.split('\n');
    const subjects = [];

    // Regex for subject row
    // E.g.: "BAS103 | Engineering Mathematics-I | 4 | A+ | 9 | PASS"
    // Or tab/space delimited: "KCS301 Data Structures 4 A+ 9 Pass"
    const subCodeRegex = /\b([A-Z]{2,4}[- ]?[0-9]{3,4}[A-Z]?)\b/i;

    subjectLines.forEach(line => {
      const codeMatch = line.match(subCodeRegex);
      if (codeMatch) {
        const code = codeMatch[1].trim().toUpperCase().replace(/\s+/, '-');
        
        // Skip common false positives
        if (/^(AKTU|UPTU|PAGE|DATE|FORM|TOTAL|MARKS|SGPA|CGPA|CREDIT|RESULT)$/i.test(code)) {
          return;
        }

        // Detect Grade (O, A+, A, B+, B, C, P, F)
        let grade = 'A';
        const gradeMatch = line.match(/(?:^|[\s|;,])([AB][+]|[OABCPF])(?=[\s|;,]|$)/);
        if (gradeMatch) {
          grade = gradeMatch[1];
        }

        // Detect Grade Point
        let gp = GRADE_POINTS_MAP[grade] !== undefined ? GRADE_POINTS_MAP[grade] : 8;
        const gpMatch = line.match(/\b(10|[0-9])\b/g);
        if (gpMatch && gpMatch.length > 1) {
          // If explicit grade point column exists
          const possibleGp = parseInt(gpMatch[gpMatch.length - 1], 10);
          if (possibleGp >= 0 && possibleGp <= 10) {
            gp = possibleGp;
          }
        }

        // Detect Credits (1 to 6)
        let credits = 4;
        const crMatches = line.match(/\b([1-6](?:\.0)?)\b/g);
        if (crMatches) {
          credits = parseFloat(crMatches[0]) || 4;
        }

        // Clean subject name
        let name = line
          .replace(codeMatch[0], '')
          .replace(/\|/g, ' ')
          .replace(/(?:^|[\s|;,])([AB][+]|[OABCPF])(?=[\s|;,]|$)/g, ' ')
          .replace(/\b(10|[0-9])\b/g, '')
          .replace(/\b(PASS|FAIL|PCP|PASSED|PROMOTED|CLEAR)\b/gi, '')
          .trim();
        name = name.replace(/\s{2,}/g, ' ');

        if (!name || name.length < 3) {
          name = `Subject (${code})`;
        }

        const isBacklog = grade === 'F' || /FAIL|BACKLOG/i.test(line);

        const subObj = {
          code,
          name,
          credits,
          grade,
          gp,
          status: isBacklog ? 'Backlog' : 'Passed'
        };

        // Avoid adding duplicate subjects in same semester
        if (!subjects.some(s => s.code === code)) {
          subjects.push(subObj);
          if (isBacklog) {
            allBacklogs.push({
              ...subObj,
              sem: semNum
            });
          }
        }
      }
    });

    // If semCredits not found, compute from subjects
    if (!semCredits || semCredits <= 0) {
      semCredits = subjects.reduce((sum, s) => sum + (s.credits || 0), 0) || 22;
    }

    // If semSgpa not found, compute weighted SGPA from subjects
    if (semSgpa === null) {
      if (subjects.length > 0) {
        const totalPoints = subjects.reduce((sum, s) => sum + (s.credits * s.gp), 0);
        const totalCr = subjects.reduce((sum, s) => sum + s.credits, 0);
        semSgpa = totalCr > 0 ? Number((totalPoints / totalCr).toFixed(2)) : 8.0;
      } else {
        semSgpa = 8.0;
      }
    }

    const backlogsCount = subjects.filter(s => s.status === 'Backlog').length;

    semestersData.push({
      sem: semNum,
      sgpa: semSgpa,
      cgpa: semCgpa,
      credits: semCredits,
      status: backlogsCount > 0 ? 'Backlog' : semStatus,
      backlogs: backlogsCount,
      subjects
    });
  });

  // Sort semesters in ascending order
  semestersData.sort((a, b) => a.sem - b.sem);

  // 4. Calculate Cumulative CGPA at each semester step
  let runningQualityPoints = 0;
  let runningCredits = 0;

  const normalizedSemesters = semestersData.map(sem => {
    runningQualityPoints += sem.credits * sem.sgpa;
    runningCredits += sem.credits;
    const calcCgpa = runningCredits > 0 ? Number((runningQualityPoints / runningCredits).toFixed(2)) : sem.sgpa;
    
    return {
      ...sem,
      // If official sem CGPA was provided in PDF, use it; otherwise use calculated cumulative
      officialCgpa: sem.cgpa,
      cgpa: sem.cgpa || calcCgpa,
      calculatedCgpa: calcCgpa
    };
  });

  const totalCreditsEarned = runningCredits;
  const latestSgpa = normalizedSemesters.length > 0 ? normalizedSemesters[normalizedSemesters.length - 1].sgpa : 0;
  const finalCalculatedCgpa = runningCredits > 0 ? Number((runningQualityPoints / runningCredits).toFixed(2)) : latestSgpa;
  const overallCgpa = detectedOfficialOverallCgpa || finalCalculatedCgpa;
  const isOfficialCgpa = detectedOfficialOverallCgpa !== null;

  // 5. Generate Mathematical Insights & Trends
  const sgpas = normalizedSemesters.map(s => s.sgpa);
  let trend = 'Stable';
  let trendDescription = 'Relatively stable academic trend';
  if (sgpas.length > 1) {
    const firstSgpa = sgpas[0];
    const lastSgpa = sgpas[sgpas.length - 1];
    const diff = Number((lastSgpa - firstSgpa).toFixed(2));
    if (diff >= 0.25) {
      trend = 'Improving';
      trendDescription = `Overall upward trend (+${diff} points from Sem ${normalizedSemesters[0].sem} to Sem ${normalizedSemesters[normalizedSemesters.length - 1].sem})`;
    } else if (diff <= -0.25) {
      trend = 'Declining';
      trendDescription = `Overall downward trend (${diff} points from Sem ${normalizedSemesters[0].sem} to Sem ${normalizedSemesters[normalizedSemesters.length - 1].sem})`;
    } else {
      trend = 'Stable';
      trendDescription = `Relatively stable trend (fluctuation within ±0.25 SGPA points)`;
    }
  } else {
    trend = 'Consistent';
    trendDescription = `Single semester recorded with SGPA of ${latestSgpa}`;
  }

  // Find Highest & Lowest SGPA Semesters
  let highestSem = normalizedSemesters[0];
  let lowestSem = normalizedSemesters[0];
  normalizedSemesters.forEach(s => {
    if (s.sgpa > highestSem.sgpa) highestSem = s;
    if (s.sgpa < lowestSem.sgpa) lowestSem = s;
  });

  // Extract all subjects across semesters for performance analysis
  const allSubjects = [];
  normalizedSemesters.forEach(s => {
    if (s.subjects) {
      s.subjects.forEach(sub => {
        allSubjects.push({ ...sub, sem: s.sem });
      });
    }
  });

  // Strongest (Grade Point >= 9) and Lower Grade Points (Grade Point <= 6)
  const sortedByGp = [...allSubjects].sort((a, b) => b.gp - a.gp);
  const strongestSubjects = sortedByGp.filter(s => s.gp >= 9).slice(0, 5);
  const lowerGradeSubjects = sortedByGp.filter(s => s.gp <= 6).reverse().slice(0, 5);

  // Grade Distribution Counts
  const gradeDistribution = { 'O': 0, 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'P': 0, 'F': 0 };
  allSubjects.forEach(s => {
    if (s.grade && gradeDistribution[s.grade] !== undefined) {
      gradeDistribution[s.grade]++;
    }
  });

  // Confidence Check
  let confidence = 'High';
  const validationNotes = [];
  if (normalizedSemesters.length === 0) {
    confidence = 'Needs Review';
    validationNotes.push('No distinct semester blocks could be automatically isolated.');
  } else if (allSubjects.length === 0) {
    confidence = 'Medium';
    validationNotes.push('Semesters were detected, but individual subject lines could not be fully parsed.');
  }
  if (!isOfficialCgpa) {
    validationNotes.push('Overall CGPA was calculated using standard credit-weighted semester average.');
  }

  const dataPayload = {
    student: {
      name: studentName || 'Student',
      rollNumber: rollNumber || 'Not Stated',
      enrollmentNumber: enrollmentNumber || 'Not Stated',
      course: course || 'B.Tech',
      branch: branch || 'Computer Science & Engineering',
      institute: institute || 'AKTU Affiliated Institute'
    },
    course: course || 'B.Tech',
    branch: branch || 'Computer Science & Engineering',
    semesters: normalizedSemesters,
    overallCGPA: Number(overallCgpa.toFixed(2)),
    currentSGPA: Number(latestSgpa.toFixed(2)),
    isOfficialCgpa,
    credits: {
      earned: totalCreditsEarned,
      total: 160,
      completionPct: Math.min(100, Math.round((totalCreditsEarned / 160) * 100))
    },
    backlogs: allBacklogs,
    subjects: allSubjects,
    analytics: {
      trend,
      trendDescription,
      highestSgpa: { sem: highestSem?.sem, val: highestSem?.sgpa },
      lowestSgpa: { sem: lowestSem?.sem, val: lowestSem?.sgpa },
      strongestSubjects,
      lowerGradeSubjects,
      backlogStatus: allBacklogs.length === 0 
        ? 'No active backlogs were detected in the uploaded result.'
        : `${allBacklogs.length} active backlog(s) were detected.`
    },
    summary: {
      overallCgpa: Number(overallCgpa.toFixed(2)),
      isOfficialCgpa,
      latestSgpa: Number(latestSgpa.toFixed(2)),
      totalCreditsEarned,
      semestersCount: normalizedSemesters.length,
      totalSubjectsDetected: allSubjects.length,
      activeBacklogsCount: allBacklogs.length,
      backlogs: allBacklogs
    },
    gradeDistribution,
    confidence,
    validationNotes,
    fileName: originalFileName
  };

  return {
    success: true,
    data: dataPayload,
    fileName: originalFileName,
    confidence,
    validationNotes,
    student: dataPayload.student,
    summary: {
      overallCgpa: Number(overallCgpa.toFixed(2)),
      isOfficialCgpa,
      latestSgpa: Number(latestSgpa.toFixed(2)),
      totalCreditsEarned,
      semestersCount: normalizedSemesters.length,
      totalSubjectsDetected: allSubjects.length,
      activeBacklogsCount: allBacklogs.length,
      backlogs: allBacklogs
    },
    semesters: normalizedSemesters,
    insights: dataPayload.analytics,
    gradeDistribution
  };
}
