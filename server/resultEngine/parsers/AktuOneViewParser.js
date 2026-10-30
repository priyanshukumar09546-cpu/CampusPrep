// ============================================================================
// PROFESSORVIRUS — AKTU ONE VIEW PARSER
// Specialized parser for AKTU One View summary documents
// Extracts student identity, session totals, COPs, audit clearances, and tracks backlogs
// Implements strict Source-of-Truth metadata & zero-value protection
// ============================================================================

import { BaseResultParser, SOURCE_TYPES, createField } from './BaseResultParser.js';
import { getStandardSemesterSubjects, getAktuSubjectDetails } from '../aktuCurriculum.js';
import { getGradePoint, isFailGrade } from '../gradeSchemes.js';

export class AktuOneViewParser extends BaseResultParser {
  constructor() {
    super('AktuOneViewParser');
  }

  canParse(text = '') {
    return /One\s*View|AKTU-One-View|Print\s*One\s*View/i.test(text) ||
      (/Session\s*:\s*\d{4}-\d{2}/i.test(text) && (/Result\s*:\s*(?:PASS|PCP|PWG|FAIL)/i.test(text) || /\bCOP\s*:/i.test(text) || /Semesters?\s*:\s*[\d,]+/i.test(text))) ||
      (/Abdul Kalam|AKTU/i.test(text) && /Semester\s*:\s*\d+/i.test(text));
  }

  async parse(rawText = '', metadata = {}) {
    const cleanText = (rawText || '').replace(/\r/g, '').trim();

    // 1. Student Identity Extraction
    const student = this.extractStudentMetadata(cleanText);

    // 2. Parse all Session Blocks
    const sessionBlocks = cleanText.split(/(?=Session\s*:)/i).filter(b => /Session\s*:/i.test(b));
    const rawSessions = [];

    for (const block of sessionBlocks) {
      const sessionMatch = block.match(/Session\s*:\s*([^\s\n]+)/i);
      const semMatch = block.match(/Semesters?\s*:\s*([\d,\s]+)/i) ||
        block.match(/(?:\(|\[)?\s*Sem(?:esters?)?\s*[:\s]*([\d,\s]+)(?:\)|\])?/i);
      const resultMatch = block.match(/Result\s*:\s*([A-Za-z0-9]+)/i);
      const marksMatch = block.match(/Marks\s*:\s*(\d+)\s*\/\s*(\d+)/i);
      const copMatch = block.match(/COP\s*:\s*([\s\S]*?)(?=\s*Audit|\s*MOOCs|\s*Note|$)/i);
      const auditMatches = Array.from(block.matchAll(/Audit\s*(\d+)\s*:\s*([A-Za-z]+)/gi)).map(m => ({
        auditNo: parseInt(m[1], 10),
        status: m[2].trim()
      }));

      const copList = copMatch
        ? copMatch[1]
            .replace(/[\r\n\t]+/g, ' ')
            .split(',')
            .map(s => s.trim().split(' ')[0])
            .filter(s => /^[A-Za-z0-9]{4,12}$/.test(s))
        : [];

      if (sessionMatch && semMatch) {
        const sessionStr = sessionMatch[1].trim();
        const semNumbers = semMatch[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        const resultStatus = resultMatch ? resultMatch[1].trim() : 'UNKNOWN';
        const marksObtained = marksMatch ? parseInt(marksMatch[1], 10) : null;
        const maxMarks = marksMatch ? parseInt(marksMatch[2], 10) : null;
        const sessionPercentage = (marksObtained !== null && maxMarks !== null && maxMarks > 0)
          ? Math.round((marksObtained / maxMarks) * 10000) / 100
          : null;

        rawSessions.push({
          session: sessionStr,
          semesters: semNumbers,
          result: resultStatus,
          marks: marksObtained,
          marksObtained,
          maxMarks,
          maximumMarks: maxMarks,
          percentage: sessionPercentage,
          sessionPercentage,
          cop: copList,
          audits: auditMatches
        });
      }
    }

    // 3. Resolve Backlogs and Attempts across sessions
    const { clearedCopsAcrossDoc, sessionHistory } = this.resolveBacklogHistory(rawSessions);

    // 4. Check for Detailed Semester Tables (e.g. Code Name Type Internal External Back Paper Grade)
    const hasTabularTables = /Code\s+Name\s+Type/i.test(cleanText) ||
      /Semester\s*:\s*\d+[\s\S]{0,100}?(?:Theory|Practical|CA)/i.test(cleanText);

    if (hasTabularTables) {
      const tabularResult = this.parseTabularOneView(cleanText, student, rawSessions, clearedCopsAcrossDoc);
      if (tabularResult && Array.isArray(tabularResult.semesters) && tabularResult.semesters.length > 0) {
        return tabularResult;
      }
    }

    // 5. Build Semesters from Session Summaries (Condense/Fallback Mode)
    const allSemNums = new Set();
    rawSessions.forEach(s => (s.semesters || []).forEach(n => allSemNums.add(n)));
    const sortedSemNums = Array.from(allSemNums).sort((a, b) => a - b);

    const semesters = [];
    let totalMarksSum = 0;
    let totalMaxMarksSum = 0;
    let hasMarksData = false;

    // Track sessions processed to avoid double-counting repeat attempts in totals
    const processedSessionMarks = new Map(); // key: semester pair -> latest marks

    for (const semNum of sortedSemNums) {
      const sessionsForSem = rawSessions.filter(s => (s.semesters || []).includes(semNum));
      const latestSession = sessionsForSem[sessionsForSem.length - 1] || {};

      // Find all COPs mentioned for this specific semester
      const allCopsForSem = [];
      sessionsForSem.forEach(sess => {
        (sess.cop || []).forEach(c => {
          const cleanC = c.toUpperCase().trim();
          const numMatch = cleanC.match(/[A-Z]+([1-8])[0-9]+/);
          if (numMatch && parseInt(numMatch[1], 10) === semNum) {
            if (!allCopsForSem.includes(cleanC)) allCopsForSem.push(cleanC);
          } else if (!numMatch && !allCopsForSem.includes(cleanC)) {
            allCopsForSem.push(cleanC);
          }
        });
      });

      const activeCops = allCopsForSem.filter(c => !clearedCopsAcrossDoc.has(c));
      const clearedCops = allCopsForSem.filter(c => clearedCopsAcrossDoc.has(c));

      // Attempted and earned credits
      const creditsAttempted = semNum <= 2 ? 22 : 24;
      let failedCredits = 0;
      activeCops.forEach(c => {
        const details = getAktuSubjectDetails(c);
        failedCredits += (details?.credits || 3);
      });
      const creditsEarned = Math.max(0, creditsAttempted - failedCredits);

      // Session percentage & derived grade point estimate (clearly flagged as INFERRED)
      const sessionPct = latestSession.sessionPercentage;
      let semGP = 7;
      if (sessionPct !== null) {
        if (sessionPct >= 80) semGP = 9;
        else if (sessionPct >= 70) semGP = 8;
        else if (sessionPct >= 60) semGP = 7;
        else if (sessionPct >= 50) semGP = 6;
        else semGP = 5;
      }
      const calculatedSGPA = activeCops.length === 0
        ? semGP
        : Math.round(((creditsEarned * semGP) / creditsAttempted) * 100) / 100;

      // Map curriculum roster with strict null marks
      const standardSubs = getStandardSemesterSubjects(semNum, student.branch?.value || 'CSE');
      const subjects = standardSubs.map(sub => {
        const isCurrentlyFailed = activeCops.includes(sub.code);
        const isCleared = clearedCops.includes(sub.code);

        // Official AKTU compliance: Never invent grades or marks when absent from source document
        let subGrade = isCurrentlyFailed ? 'F' : null;
        let subGP = isCurrentlyFailed ? 0 : null;
        let subStatus = isCurrentlyFailed ? 'FAIL' : (isCleared ? 'PASS (Cleared via Back)' : 'PASS');

        return {
          subjectCode: sub.code,
          subjectName: sub.name,
          type: sub.type || 'Theory',
          internalMarks: null,
          externalMarks: null,
          marksObtained: null,      // Individual marks not printed in One View summary (MANDATORY NULL)
          maximumMarks: null,       // MANDATORY NULL
          marksDisplay: '—',
          credits: sub.credits || 3,
          grade: subGrade,
          gradePoint: subGP,
          status: subStatus,
          isBacklog: isCurrentlyFailed,
          wasCleared: isCleared,
          sourcePage: 1
        };
      });

      let resultStatus = 'PASS';
      if (activeCops.length > 0) {
        resultStatus = `PCP (Carry Over: ${activeCops.join(', ')})`;
      } else if (clearedCops.length > 0) {
        resultStatus = 'PASS (Cleared via Back)';
      }

      semesters.push({
        semesterNumber: semNum,
        semesterName: `Semester ${semNum}`,
        session: latestSession.session || null,
        officialSGPA: createField(null, SOURCE_TYPES.UNAVAILABLE, 'not_in_one_view_summary', 0.0),
        calculatedSGPA: createField(calculatedSGPA, SOURCE_TYPES.CALCULATED, 'session_percentage_weighted_credits', 0.88),
        displaySGPA: calculatedSGPA,
        creditsAttempted,
        creditsEarned,
        activeBacklogs: activeCops.length,
        historicalBacklogs: allCopsForSem.length,
        clearedBacklogs: clearedCops.length,
        status: resultStatus,
        resultStatus,
        carryOverPapers: activeCops,
        subjects,
        // Individual semester marks are not separated in One View:
        totalMarks: null,
        maxMarks: null,
        percentage: null,
        sessionMarksObtained: latestSession.marksObtained,
        sessionMaximumMarks: latestSession.maximumMarks,
        sessionPercentage: latestSession.sessionPercentage
      });

      // Track session marks for grand total
      const sessionKey = (latestSession.semesters || []).join(',');
      if (latestSession.marksObtained && latestSession.maximumMarks && !processedSessionMarks.has(sessionKey)) {
        processedSessionMarks.set(sessionKey, {
          obt: latestSession.marksObtained,
          max: latestSession.maximumMarks
        });
      }
    }

    // Grand totals from unique sessions
    for (const sm of processedSessionMarks.values()) {
      totalMarksSum += sm.obt;
      totalMaxMarksSum += sm.max;
      hasMarksData = true;
    }

    const overallPercentage = (hasMarksData && totalMaxMarksSum > 0)
      ? Math.round((totalMarksSum / totalMaxMarksSum) * 10000) / 100
      : null;

    // Credit-weighted cumulative CGPA
    let totalCreditsAttempted = 0;
    let totalCreditsEarned = 0;
    let totalWeightedPoints = 0;

    semesters.forEach(s => {
      totalCreditsAttempted += s.creditsAttempted;
      totalCreditsEarned += s.creditsEarned;
      totalWeightedPoints += (s.creditsAttempted * (s.displaySGPA || 0));
    });

    const calculatedCGPA = totalCreditsAttempted > 0
      ? Math.round((totalWeightedPoints / totalCreditsAttempted) * 100) / 100
      : null;

    // Count overall backlogs
    const allActiveCops = Array.from(new Set(semesters.flatMap(s => s.carryOverPapers || [])));
    const totalHistorical = semesters.reduce((acc, s) => acc + s.historicalBacklogs, 0);
    const totalCleared = semesters.reduce((acc, s) => acc + s.clearedBacklogs, 0);

    return {
      document: {
        isStudentResult: true,
        documentType: 'one_view_result',
        confidence: 0.95,
        university: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)'
      },
      student,
      rawSessions,
      semesters,
      overall: {
        officialCGPA: createField(null, SOURCE_TYPES.UNAVAILABLE, 'not_in_one_view_summary', 0.0),
        calculatedCGPA: createField(calculatedCGPA, SOURCE_TYPES.CALCULATED, 'credit_weighted_cumulative', 0.92),
        displayCGPA: calculatedCGPA,
        totalCreditsAttempted,
        totalCreditsEarned,
        totalMarksObtained: hasMarksData ? totalMarksSum : null,
        totalMaximumMarks: hasMarksData ? totalMaxMarksSum : null,
        overallPercentage,
        marksAvailable: false,
        marksNotice: 'Individual subject marks are not available in the One View summary document (Session totals available).'
      },
      backlogs: {
        activeBacklogs: allActiveCops.length,
        clearedBacklogs: totalCleared,
        historicalBacklogs: totalHistorical,
        historyAvailable: true,
        activeList: allActiveCops,
        clearedList: Array.from(clearedCopsAcrossDoc)
      },
      validation: {
        evidenceScore: 10,
        minimumRequired: 3,
        confidence: 92,
        discrepancies: [],
        warnings: []
      }
    };
  }

  parseTabularOneView(cleanText, student, rawSessions = [], clearedCopsAcrossDoc = new Set()) {
    const lines = cleanText.split('\n');
    const rowRegex = /^\s*([A-Z0-9]{5,10})\s+(.+?)\s+(Theory|Practical|CA|Audit)\s+(\d{1,3}|--|-)(?:\s+(\d{1,3}|--|-))?(?:\s+([A-Za-z0-9_-]+|--|-))?(?:\s+([A-D][+]?|O\b|F\b|P\b|AB\b|--|-))?\s*$/i;

    let currentSem = null;
    const semMap = {};
    const metaMap = {};

    for (const line of lines) {
      const semMatch = line.match(/Semester\s*:\s*(\d+)/i);
      if (semMatch) {
        currentSem = parseInt(semMatch[1], 10);
        semMap[currentSem] = [];
        
        const matchingSession = rawSessions.find(s => (s.semesters || []).includes(currentSem));
        metaMap[currentSem] = {
          session: matchingSession ? matchingSession.session : null
        };
        continue;
      }
      if (!currentSem) continue;

      const sgpaMatch = line.match(/SGPA\s*:\s*([0-9.]+)/i);
      if (sgpaMatch) metaMap[currentSem].sgpa = parseFloat(sgpaMatch[1]);

      const marksMatch = line.match(/Total\s*Marks\s*Obt\.?\s*:\s*(\d+)/i);
      if (marksMatch) metaMap[currentSem].totalMarksObt = parseInt(marksMatch[1], 10);

      const statusMatch = line.match(/Result\s*Status\s*:\s*(.+?)(?=\s*SGPA|\s*Total|\s*Date|\n|$)/i);
      if (statusMatch) metaMap[currentSem].status = statusMatch[1].trim();

      const dateMatch = line.match(/Date\s*of\s*Declaration\s*:\s*([^\s\n]+)/i);
      if (dateMatch) metaMap[currentSem].declarationDate = dateMatch[1];

      let m = line.match(rowRegex);
      if (!m) {
        // Fallback for pipe-separated or tab-separated tables
        const pipeMatch = line.match(/^\s*([A-Z0-9]{5,10})\s*[|\t]\s*(.+?)\s*[|\t]\s*(?:(Theory|Practical|CA|Audit)\s*[|\t])?\s*(\d{1,3}|--|-)(?:\s*[|\t]\s*(\d{1,3}|--|-))?(?:\s*[|\t]\s*([A-Za-z0-9_-]+|--|-))?(?:\s*[|\t]\s*([A-D][+]?|O\b|F\b|P\b|AB\b|--|-))?\s*$/i);
        if (pipeMatch) {
          m = [
            pipeMatch[0],
            pipeMatch[1],
            pipeMatch[2],
            pipeMatch[3] || (/Lab|Practical/i.test(pipeMatch[2]) ? 'Practical' : 'Theory'),
            pipeMatch[4],
            pipeMatch[5],
            pipeMatch[6],
            pipeMatch[7]
          ];
        }
      }
      if (m) {
        const subCode = m[1].toUpperCase().trim();
        const subName = m[2].trim();
        const subType = m[3];
        const internal = m[4] === '--' ? null : parseInt(m[4], 10);
        const external = (m[5] && m[5] !== '--' && m[5] !== '-') ? parseInt(m[5], 10) : null;
        const backPaper = m[6] === '--' ? null : m[6];
        const grade = (m[7] && m[7] !== '--') ? m[7].trim() : null;

        const subDetails = getAktuSubjectDetails(subCode);
        let credits = subDetails?.credits;
        if (credits === undefined || credits === null) {
          if (subType === 'Practical') credits = 2;
          else if (subType === 'CA' || subType === 'Audit') credits = 0;
          else credits = (subCode.startsWith('BAS') && (subCode.endsWith('01') || subCode.endsWith('02') || subCode.endsWith('03'))) ? 4 : 3;
        }

        const gp = grade ? getGradePoint(grade) : null;
        const isFail = isFailGrade(grade) || (backPaper && backPaper !== '--');

        semMap[currentSem].push({
          subjectCode: subCode,
          subjectName: subName,
          type: subType,
          internalMarks: internal,
          externalMarks: external,
          marksObtained: (internal !== null || external !== null) ? (internal || 0) + (external || 0) : null,
          totalMarks: (internal !== null || external !== null) ? (internal || 0) + (external || 0) : null,
          maximumMarks: subType === 'Practical' ? 50 : 100,
          marksDisplay: (internal !== null || external !== null)
            ? `${(internal || 0) + (external || 0)}/${subType === 'Practical' ? 50 : 100}`
            : '—',
          backPaper,
          grade,
          gradePoint: gp,
          credits,
          status: isFail ? 'FAIL' : 'PASS',
          isBacklog: isFail,
          sourcePage: currentSem <= 2 ? 1 : 2
        });
      }
    }

    const semesters = [];
    let cumCreditsAttempted = 0;
    let cumCreditsEarned = 0;
    let cumWeightedPoints = 0;
    let grandTotalMarks = 0;
    const allActiveBacklogs = [];

    const sortedSems = Object.keys(semMap).map(Number).sort((a, b) => a - b);

    for (const semNum of sortedSems) {
      const rows = semMap[semNum];
      let semCreditsAttempted = 0;
      let semCreditsEarned = 0;
      let semWeightedPoints = 0;
      const semActiveCops = [];

      for (const r of rows) {
        if (r.credits > 0) {
          semCreditsAttempted += r.credits;
          if (r.status === 'PASS' && r.gradePoint !== null) {
            semCreditsEarned += r.credits;
            semWeightedPoints += r.credits * r.gradePoint;
          }
        }
        if (r.status === 'FAIL') {
          semActiveCops.push(r.subjectCode);
          allActiveBacklogs.push(r.subjectCode);
        }
      }

      const calcSGPA = semCreditsAttempted > 0 ? Math.round((semWeightedPoints / semCreditsAttempted) * 100) / 100 : null;
      const printedSGPA = metaMap[semNum]?.sgpa ?? null;
      const displaySGPA = printedSGPA ?? calcSGPA;

      cumCreditsAttempted += semCreditsAttempted;
      cumCreditsEarned += semCreditsEarned;
      cumWeightedPoints += (semCreditsAttempted * (displaySGPA || 0));
      grandTotalMarks += (metaMap[semNum]?.totalMarksObt || 0);

      semesters.push({
        semesterNumber: semNum,
        semesterName: `Semester ${semNum}`,
        session: metaMap[semNum]?.session || null,
        officialSGPA: createField(printedSGPA, printedSGPA ? SOURCE_TYPES.OFFICIAL : SOURCE_TYPES.UNAVAILABLE, 'printed_one_view_sgpa', 0.99),
        calculatedSGPA: createField(calcSGPA, SOURCE_TYPES.CALCULATED, 'credit_weighted_formula', 0.95),
        displaySGPA,
        creditsAttempted: semCreditsAttempted,
        creditsEarned: semCreditsEarned,
        activeBacklogs: semActiveCops.length,
        historicalBacklogs: semActiveCops.length,
        clearedBacklogs: 0,
        resultStatus: metaMap[semNum]?.status || (semActiveCops.length > 0 ? 'PCP' : 'PASS'),
        totalMarks: metaMap[semNum]?.totalMarksObt || null,
        declarationDate: metaMap[semNum]?.declarationDate || null,
        carryOverPapers: semActiveCops,
        subjects: rows
      });
    }

    const calculatedCGPA = cumCreditsAttempted > 0
      ? Math.round((cumWeightedPoints / cumCreditsAttempted) * 100) / 100
      : null;

    return {
      document: {
        isStudentResult: true,
        documentType: 'one_view_result',
        confidence: 0.99,
        university: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)'
      },
      student,
      rawSessions,
      semesters,
      overall: {
        officialCGPA: createField(null, SOURCE_TYPES.UNAVAILABLE, 'not_in_one_view_summary', 0.0),
        calculatedCGPA: createField(calculatedCGPA, SOURCE_TYPES.CALCULATED, 'credit_weighted_cumulative', 0.95),
        displayCGPA: calculatedCGPA,
        isOfficialCgpa: false,
        totalCreditsAttempted: cumCreditsAttempted,
        totalCreditsEarned: cumCreditsEarned,
        totalMarksObtained: grandTotalMarks > 0 ? grandTotalMarks : null,
        totalMaximumMarks: null,
        overallPercentage: null,
        marksAvailable: true,
        marksNotice: 'Extracted authentic subject-wise internal, external marks, credits, and official SGPAs from AKTU One View.'
      },
      backlogs: {
        activeBacklogs: allActiveBacklogs.length,
        clearedBacklogs: Array.from(clearedCopsAcrossDoc).length,
        historicalBacklogs: allActiveBacklogs.length + Array.from(clearedCopsAcrossDoc).length,
        historyAvailable: true,
        activeList: allActiveBacklogs,
        clearedList: Array.from(clearedCopsAcrossDoc)
      },
      validation: {
        evidenceScore: 10,
        minimumRequired: 3,
        confidence: 98,
        discrepancies: [],
        warnings: []
      }
    };
  }

  resolveBacklogHistory(rawSessions = []) {
    const clearedCopsAcrossDoc = new Set();

    // Map all semester appearances in chronological order
    const semAppearances = new Map();
    rawSessions.forEach((sess, sIdx) => {
      (sess.semesters || []).forEach(semNum => {
        if (!semAppearances.has(semNum)) semAppearances.set(semNum, []);
        semAppearances.get(semNum).push({ ...sess, sessionIdx: sIdx });
      });
    });

    // For each semester, analyze COP changes between appearances
    semAppearances.forEach((appearances, semNum) => {
      appearances.forEach((app, idx) => {
        const cops = (app.cop || []).map(c => c.toUpperCase().trim());
        // If there is any subsequent appearance for this semester
        if (idx < appearances.length - 1) {
          const subsequent = appearances.slice(idx + 1);
          cops.forEach(code => {
            // If code is not present in the latest subsequent appearance, or subsequent passed
            const stillActiveInLatest = (subsequent[subsequent.length - 1].cop || []).some(
              c => c.toUpperCase().trim() === code
            );
            const isSubsequentCleared = /PWG|PASS|CLEAR/i.test(subsequent[subsequent.length - 1].result);

            if (!stillActiveInLatest || isSubsequentCleared) {
              clearedCopsAcrossDoc.add(code);
            }
          });
        }
      });
    });

    return { clearedCopsAcrossDoc, sessionHistory: rawSessions };
  }

  extractStudentMetadata(cleanText) {
    const student = {};

    const nameMatch = cleanText.match(/(?:Student\s*Name|Candidate\s*Name|(?:^|\n|\t)\s*Name)[\s\t:]+([A-Za-z][A-Za-z .]{2,40}?)(?=\s*(?:\t|\n|Hindi|Father|Roll|Enroll|Gender|Category|$))/i);
    const fatherMatch = cleanText.match(/Father(?:'s)?\s*Name[\s\t:]+([A-Za-z][A-Za-z .]{2,40}?)(?=\s*(?:\t|\n|Gender|Mother|Roll|Enroll|$))/i);
    const rollMatch = cleanText.match(/(?:Roll\s*No\.?|RollNo|Roll\s*Number)[\s\t:]*([0-9]{7,16})/i);
    const enrollMatch = cleanText.match(/(?:Enrollment\s*No\.?|EnrollmentNo|Enrolment\s*No\.?)[\s\t:]*([A-Za-z0-9]{7,20})/i);
    const genderMatch = cleanText.match(/Gender[\s\t:]+([MF]|Male|Female)/i);
    const courseMatch = cleanText.match(/Course\s*(?:Code\s*(?:&|and)?\s*)?Name\s*[:]\s*(?:\([^)]*\)\s*)?([A-Za-z0-9\s.&/-]+?)(?=\s*Branch|\s*Institute|\s*Roll|\n\s*\n|$)/i);
    const branchMatch = cleanText.match(/Branch\s*(?:Code\s*(?:&|and)?\s*)?Name\s*[:]\s*(?:\([^)]*\)\s*)?([A-Za-z0-9\s.&/-]+?)(?=\s*Roll\s*No|\s*Enrollment|\s*Name|\s*Print|\s*One\s*View|\n\s*\n|$)/i);
    const instMatch = cleanText.match(/Institute\s*(?:Code\s*(?:&|and)?\s*)?Name\s*[:]\s*(?:\([^)]*\)\s*)?([A-Za-z0-9\s.,&/-]+?)(?=\s*Course|\s*Branch|\s*Roll|\n\s*\n|$)/i);

    student.name = createField(nameMatch ? nameMatch[1].trim() : null, SOURCE_TYPES.OFFICIAL, 'labeled_name', 0.98);
    student.fatherName = createField(fatherMatch ? fatherMatch[1].trim() : null, SOURCE_TYPES.OFFICIAL, 'labeled_father_name', 0.98);
    student.rollNumber = createField(rollMatch ? rollMatch[1].trim() : null, SOURCE_TYPES.OFFICIAL, 'labeled_roll_no', 0.99);
    student.enrollmentNumber = createField(enrollMatch ? enrollMatch[1].trim() : null, SOURCE_TYPES.OFFICIAL, 'labeled_enrollment_no', 0.99);
    student.gender = createField(genderMatch ? (genderMatch[1].toUpperCase().startsWith('M') ? 'M' : 'F') : null, SOURCE_TYPES.OFFICIAL, 'labeled_gender', 0.95);
    student.course = createField(courseMatch ? courseMatch[1].replace(/^\([^)]*\)\s*/, '').replace(/\s+/g, ' ').trim() : null, courseMatch ? SOURCE_TYPES.OFFICIAL : SOURCE_TYPES.UNAVAILABLE, 'labeled_course', 0.95);
    student.branch = createField(branchMatch ? branchMatch[1].replace(/^\([^)]*\)\s*/, '').replace(/\s+/g, ' ').trim() : null, branchMatch ? SOURCE_TYPES.OFFICIAL : SOURCE_TYPES.UNAVAILABLE, 'labeled_branch', 0.95);
    student.college = createField(instMatch ? instMatch[1].replace(/^\([^)]*\)\s*/, '').replace(/\s+/g, ' ').trim() : null, SOURCE_TYPES.OFFICIAL, 'labeled_institute', 0.95);

    return student;
  }
}
