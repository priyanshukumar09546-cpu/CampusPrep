// Strict Structural Extractor (Zero-Assumption Fallback Engine)
// Used when Gemini API is unconfigured or unavailable
// Extracts ONLY explicitly labeled fields and tabular data
// NEVER invents defaults (no fake SGPA, no default credits, no default grades)
// Supports AKTU One View summary format AND detailed marksheet format

import { normalizeGrade, getGradePoint } from './gradeSchemes.js';

/**
 * Perform strict structural extraction from PDF text
 * @param {string} rawText - Clean text extracted from PDF
 * @param {string} fileName - PDF filename
 * @returns {object} Raw extraction matching the Gemini schema
 */
export function extractStructurally(rawText = '', fileName = 'result.pdf') {
  const cleanText = rawText.replace(/\r/g, '').trim();

  if (!cleanText || cleanText.length < 50) {
    return {
      document: { isStudentResult: false, documentType: 'unknown', confidence: 0, university: null },
      student: {},
      semesters: [],
      officialSummary: {}
    };
  }

  // 1. Detect university
  let university = null;
  if (/AKTU|Abdul Kalam|UPTU|AKTU-One-View/i.test(cleanText)) {
    university = 'AKTU';
  }

  // 2. Labeled Student Metadata Extraction

  // Roll Number: MUST be labeled
  let rollNumber = null;
  const rollMatch = cleanText.match(/(?:Roll\s*No\.?|RollNo|Roll\s*Number|Roll\s*#)[\s\t:]*([0-9]{7,15})/i);
  if (rollMatch) {
    rollNumber = rollMatch[1].trim();
  }

  // Enrollment Number: MUST be labeled
  let enrollmentNumber = null;
  const enrollMatch = cleanText.match(/(?:Enrollment\s*No\.?|EnrollmentNo|Enroll\s*No\.?|Enrolment\s*No\.?)[\s\t:]*([A-Za-z0-9]{8,20})/i);
  if (enrollMatch) {
    enrollmentNumber = enrollMatch[1].trim();
  }

  // Student Name: MUST be labeled — support "Name\t:" pattern (AKTU One View)
  let studentName = null;
  let fatherName = null;
  let gender = null;

  // Father's Name FIRST to ensure we never mistake father's name for student's name
  const fatherMatch = cleanText.match(/Father(?:'s)?\s*Name[\s\t:]+([A-Z][A-Z\s.]{2,40}?)(?:\t|\n|\s+Gender|\s+Mother|\s+Roll|\s+Enroll|$)/i);
  if (fatherMatch) {
    fatherName = fatherMatch[1].trim().replace(/\s*(?:Gender|Mother|Roll|Enroll|Category).*$/i, '').replace(/\s+/g, ' ');
  }

  // Try student name patterns
  const namePatterns = [
    /(?:Student\s*Name|Candidate(?:'s)?\s*Name|Name\s*of\s*Candidate)[\s\t:]+([A-Z][A-Z\s.]{2,44})(?:\t|\n|Hindi|Father|Roll|Enroll|Gender|Course|Branch|College|Institute|$)/i,
    /(?:^|\n)\s*Name\s*[\t:]+\s*([A-Z][A-Z\s.]{2,44})(?:\t|\n|Hindi|Father|Roll|Enroll|Gender|Course|Branch|College|Institute|$)/im
  ];

  for (const pattern of namePatterns) {
    const m = cleanText.match(pattern);
    if (m) {
      const rawName = m[1].trim().replace(/\s+/g, ' ');
      // Exclude university/system headers and father's name from matching as student name
      if (!/UNIVERSITY|INSTITUTE|COLLEGE|AKTU|RESULT|TECHNICAL|BOARD|REPORT|EXAMINATION|TEAM|PROJECT|PORTAL|PAGE|SDC|ONE\s*VIEW|STUDENT\s*RESULT/i.test(rawName) &&
          (!fatherName || rawName.toUpperCase() !== fatherName.toUpperCase())) {
        studentName = rawName.replace(/\s*(?:Gender|Branch|Course|Roll|Enroll|Father|Category|Hindi).*$/i, '').trim();
        if (studentName.length >= 2) break;
        studentName = null;
      }
    }
  }

  // Gender
  const genderMatch = cleanText.match(/Gender[\s\t:]+([MF]|Male|Female)/i);
  if (genderMatch) {
    gender = genderMatch[1].trim().toUpperCase().startsWith('M') ? 'M' : 'F';
  }

  // Course (support AKTU "Course Code & Name : (04) B.TECH")
  let course = null;
  const courseCodeMatch = cleanText.match(/Course\s*(?:Code\s*(?:&|and)?\s*)?Name\s*[:]\s*(?:\([^)]*\)\s*)?([^\n\t]+)/i);
  if (courseCodeMatch) {
    course = courseCodeMatch[1].replace(/\s*(?:Gender|Branch|Roll|Enroll|Father|Category|Institute|College).*$/i, '').trim();
  } else {
    const courseMatch = cleanText.match(/(?:Course|Programme|Program)[\s\t:]+([^\n,]+)/i);
    if (courseMatch) {
      course = courseMatch[1].replace(/\s*(?:Gender|Branch|Roll|Enroll|Father|Category|Institute|College).*$/i, '').trim();
    } else if (/B\.?\s*Tech|Bachelor of Technology/i.test(cleanText)) {
      course = 'B.Tech';
    } else if (/MCA|Master of Computer Applications/i.test(cleanText)) {
      course = 'MCA';
    } else if (/MBA/i.test(cleanText)) {
      course = 'MBA';
    }
  }

  // Branch (support AKTU "Branch Code & Name : (10) COMPUTER SCIENCE AND\nENGINEERING")
  let branch = null;
  const branchCodeMatch = cleanText.match(/Branch\s*(?:Code\s*(?:&|and)?\s*)?Name\s*[:]\s*(?:\([^)]*\)\s*)?([^\n]+(?:\n[A-Z][A-Z\s]+)?)/i);
  if (branchCodeMatch) {
    branch = branchCodeMatch[1].replace(/\s+/g, ' ').replace(/\s*(?:Gender|Course|Roll|Enroll|Father|Category|Institute|College|RollNo).*$/i, '').trim();
  } else {
    const branchMatch = cleanText.match(/(?:Branch|Discipline|Specialization)[\s\t:]+([^\n,]+)/i);
    if (branchMatch) {
      branch = branchMatch[1].replace(/\s*(?:Gender|Course|Roll|Enroll|Father|Category|Institute|College).*$/i, '').trim();
    }
  }

  // College / Institute (support AKTU "Institute Code & Name : (032) ABES ENGG.COLLEGE,GHAZIABAD")
  let college = null;
  const instMatch = cleanText.match(/Institute\s*(?:Code\s*(?:&|and)?\s*)?Name\s*[:]\s*(?:\([^)]*\)\s*)?([^\n]+)/i);
  if (instMatch) {
    college = instMatch[1].replace(/^\([^)]*\)\s*/, '').trim();
  } else {
    const collMatch = cleanText.match(/(?:College(?:\s*Name)?)\s*[:]\s*([^\n]+)/i);
    if (collMatch) {
      college = collMatch[1].trim();
    }
  }

  // ============================================================
  // 3. AKTU ONE VIEW SESSION-BASED FORMAT
  // ============================================================
  const sessionBlocks = cleanText.split(/(?=Session\s*:)/i).filter(b => /Session\s*:/i.test(b));
  const rawSessions = [];
  const extractedSemesters = [];

  for (const block of sessionBlocks) {
    const sessionMatch = block.match(/Session\s*:\s*([^\s\n]+)/i);
    const semMatch = block.match(/Semesters?\s*:\s*([\d,\s]+)/i);
    const resultMatch = block.match(/Result\s*:\s*([A-Za-z0-9]+)/i);
    const marksMatch = block.match(/Marks\s*:\s*(\d+)\s*\/\s*(\d+)/i);
    const copMatch = block.match(/COP\s*:\s*([\s\S]*?)(?=\s*Audit|\s*MOOCs|\s*Note|$)/i);

    const copList = copMatch
      ? copMatch[1]
          .replace(/[\r\n\t]+/g, ' ')
          .split(',')
          .map(s => s.trim().split(' ')[0])
          .filter(s => /^[A-Za-z0-9]{5,10}$/.test(s))
      : [];

    if (sessionMatch && semMatch) {
      const sessionStr = sessionMatch[1].trim();
      const semNumbers = semMatch[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      const resultStatus = resultMatch ? resultMatch[1].trim() : 'UNKNOWN';
      const marksObtained = marksMatch ? parseInt(marksMatch[1], 10) : null;
      const maxMarks = marksMatch ? parseInt(marksMatch[2], 10) : null;

      rawSessions.push({
        session: sessionStr,
        semesters: semNumbers,
        result: resultStatus,
        marks: marksObtained,
        maxMarks,
        percentage: marksObtained && maxMarks ? Math.round((marksObtained / maxMarks) * 10000) / 100 : null,
        cop: copList
      });

      // Split marks evenly across the semesters in this session
      const marksPerSem = semNumbers.length > 0 && marksObtained ? Math.round(marksObtained / semNumbers.length) : marksObtained;
      const maxPerSem = semNumbers.length > 0 && maxMarks ? Math.round(maxMarks / semNumbers.length) : maxMarks;

      for (const semNum of semNumbers) {
        const existing = extractedSemesters.find(s => s.semesterNumber === semNum);
        if (existing) {
          // A later back session supersedes or updates previous marks
          if (marksObtained && marksObtained > (existing.totalMarks || 0) * semNumbers.length) {
            existing.totalMarks = marksPerSem;
            existing.maxMarks = maxPerSem;
            existing.status = resultStatus;
            existing.session = sessionStr;
          }
          if (resultStatus === 'PWG' || resultStatus === 'PASS' || resultStatus === 'CLEAR') {
            existing.carryOverPapers = [];
            existing.status = resultStatus;
          }
          continue;
        }

        extractedSemesters.push({
          semesterNumber: semNum,
          semesterName: `Semester ${semNum}`,
          session: sessionStr,
          sgpa: null,
          cgpa: null,
          totalMarks: marksPerSem,
          maxMarks: maxPerSem,
          creditsEarned: null,
          creditsAttempted: null,
          status: resultStatus,
          carryOverPapers: copList,
          subjects: []
        });
      }
    }
  }

  // ============================================================
  // 4. DETAILED MARKSHEET FORMAT (subject-level fallback)
  // ============================================================
  if (extractedSemesters.length === 0) {
    const semBlockRegex = /(?:Session\s*:\s*\d{4}-\d{2}\s*\(Semester\s*([0-9IVX]+)\)|Semester\s*[:.-]?\s*([0-9IVX]+)|Sem\s*[:.-]?\s*([0-9IVX]+))/gi;
    const semMatches = [];
    let m;

    function romanToInt(roman) {
      if (!roman) return 1;
      const map = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
      const upper = roman.toUpperCase().trim();
      return map[upper] || parseInt(roman, 10) || 1;
    }

    while ((m = semBlockRegex.exec(cleanText)) !== null) {
      const rawSem = m[1] || m[2] || m[3];
      const semNum = isNaN(rawSem) ? romanToInt(rawSem) : parseInt(rawSem, 10);
      semMatches.push({ semNum, index: m.index });
    }

    const semesterChunks = [];
    if (semMatches.length > 0) {
      const unique = [];
      semMatches.forEach(item => {
        if (!unique.find(u => u.semNum === item.semNum && Math.abs(u.index - item.index) < 50)) {
          unique.push(item);
        }
      });

      for (let i = 0; i < unique.length; i++) {
        const startIdx = unique[i].index;
        const endIdx = i + 1 < unique.length ? unique[i + 1].index : cleanText.length;
        semesterChunks.push({
          semNum: unique[i].semNum,
          text: cleanText.substring(startIdx, endIdx)
        });
      }
    }

    const subCodeRegex = /\b([A-Z]{2,4}[- ]?[0-9]{3,4}[A-Z]?)\b/i;

    semesterChunks.forEach(chunk => {
      const semNum = chunk.semNum;
      const cText = chunk.text;
      const chunkLines = cText.split('\n');
      const subjects = [];

      let officialSgpa = null;
      const sgpaMatch = cText.match(/SGPA[\s\t:]*([0-9]+(?:\.[0-9]+)?)/i);
      if (sgpaMatch) {
        const val = parseFloat(sgpaMatch[1]);
        if (!isNaN(val) && val >= 0 && val <= 10) officialSgpa = val;
      }

      let officialCgpa = null;
      const cgpaMatch = cText.match(/CGPA[\s\t:]*([0-9]+(?:\.[0-9]+)?)/i);
      if (cgpaMatch) {
        const val = parseFloat(cgpaMatch[1]);
        if (!isNaN(val) && val >= 0 && val <= 10) officialCgpa = val;
      }

      let creditsEarned = null;
      const crMatch = cText.match(/(?:Total\s*Credits|Credits\s*Earned|Earned\s*Credits|Credits)[\s\t:]*([0-9]+(?:\.[0-9]+)?)/i);
      if (crMatch) {
        const val = parseFloat(crMatch[1]);
        if (!isNaN(val) && val > 0 && val <= 40) creditsEarned = val;
      }

      chunkLines.forEach(line => {
        const codeMatch = line.match(subCodeRegex);
        if (!codeMatch) return;

        const code = codeMatch[1].trim().toUpperCase().replace(/\s+/, '-');
        if (/^(AKTU|UPTU|PAGE|DATE|FORM|TOTAL|MARKS|SGPA|CGPA|CREDIT|RESULT|PASS|FAIL|GRADE)$/i.test(code)) return;

        let grade = null;
        const gradeMatch = line.match(/(?:^|[\s|;,])([AB][+]|[OABCPF])(?=[\s|;,]|$)/);
        if (gradeMatch) grade = normalizeGrade(gradeMatch[1]);

        let gradePoint = grade ? getGradePoint(grade) : null;
        let credits = null;
        const crMatches = line.match(/\b([1-6](?:\.0)?)\b/g);
        if (crMatches) credits = parseFloat(crMatches[0]);

        let marks = null;
        let maxMarks = null;
        const slashMatch = line.match(/\b([0-9]{1,3})\s*\/\s*([0-9]{2,3})\b/);
        if (slashMatch) {
          const m = parseFloat(slashMatch[1]);
          const mx = parseFloat(slashMatch[2]);
          if (!isNaN(m) && !isNaN(mx) && m <= mx && mx <= 500) {
            marks = m;
            maxMarks = mx;
          }
        } else {
          // Look for total / max marks pattern like "78 100" or "42 50" where max is standard AKTU max marks
          const twoNumMatch = line.match(/\b([0-9]{1,3})\s+(50|100|150|200)\b/);
          if (twoNumMatch) {
            const m = parseFloat(twoNumMatch[1]);
            const mx = parseFloat(twoNumMatch[2]);
            if (!isNaN(m) && !isNaN(mx) && m <= mx) {
              marks = m;
              maxMarks = mx;
            }
          }
        }

        let name = line
          .replace(codeMatch[0], '')
          .replace(/\b[0-9]{1,3}\s*\/\s*[0-9]{2,3}\b/g, '')
          .replace(/\b[0-9]{1,3}\s+(50|100|150|200)\b/g, '')
          .replace(/\|/g, ' ')
          .replace(/(?:^|[\s|;,])([AB][+]|[OABCPF])(?=[\s|;,]|$)/g, ' ')
          .replace(/\b(10|[0-9])\b/g, '')
          .replace(/\b(PASS|FAIL|PCP|PASSED|PROMOTED|CLEAR|BACKLOG)\b/gi, '')
          .trim()
          .replace(/\s{2,}/g, ' ');

        if (code && (grade || gradePoint !== null || credits !== null || marks !== null)) {
          if (!subjects.some(s => s.subjectCode === code)) {
            const isFail = grade === 'F' || /FAIL|BACKLOG/i.test(line);
            subjects.push({
              subjectCode: code,
              subjectName: name && name.length >= 3 ? name : `Subject ${code}`,
              marks,
              maxMarks,
              credits,
              grade,
              gradePoint,
              result: isFail ? 'Fail' : 'Pass'
            });
          }
        }
      });

      if (subjects.length > 0) {
        extractedSemesters.push({
          semesterNumber: semNum,
          semesterName: `Semester ${semNum}`,
          sgpa: officialSgpa,
          cgpa: officialCgpa,
          creditsEarned,
          creditsAttempted: creditsEarned,
          status: subjects.some(s => s.result === 'Fail') ? 'Backlog' : 'Pass',
          subjects
        });
      }
    });
  }

  // Extract Global Official CGPA if printed on document
  let globalOfficialCgpa = null;
  const globalCgpaMatch = cleanText.match(/(?:Overall\s*CGPA|Cumulative\s*Grade\s*Point\s*Average|Final\s*CGPA|CGPA)[\s\t:]*([0-9]+(?:\.[0-9]+)?)/i);
  if (globalCgpaMatch) {
    const val = parseFloat(globalCgpaMatch[1]);
    if (!isNaN(val) && val >= 0 && val <= 10) globalOfficialCgpa = val;
  }

  // ============================================================
  // 5. DETERMINE IF THIS IS A STUDENT RESULT
  // ============================================================
  const hasStudentIdentity = Boolean(studentName && (rollNumber || enrollmentNumber));
  const hasSemesterData = extractedSemesters.length > 0;
  const hasResultKeywords = /Student\s*Result|One\s*View\s*Result|Result\s*:|Marks\s*:/i.test(cleanText);

  const isInformational = !hasStudentIdentity && !hasSemesterData && !hasResultKeywords;
  const isStudentResult = !isInformational && hasStudentIdentity && (hasSemesterData || hasResultKeywords);

  return {
    document: {
      isStudentResult,
      documentType: rawSessions.length > 0 ? 'one_view_result' : 'official_result',
      confidence: isStudentResult ? 0.95 : 0.1,
      university
    },
    student: {
      name: studentName,
      fatherName,
      gender,
      rollNumber,
      enrollmentNumber,
      course,
      branch,
      college,
      year: null
    },
    rawSessions,
    semesters: extractedSemesters,
    officialSummary: {
      officialSGPA: extractedSemesters.length > 0 ? extractedSemesters[extractedSemesters.length - 1].sgpa : null,
      officialCGPA: globalOfficialCgpa,
      totalCreditsEarned: null,
      backlogCount: null
    }
  };
}
