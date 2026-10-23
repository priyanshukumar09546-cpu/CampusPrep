// ============================================================================
// CAMPUSPREP / PROFESSORVIRUS — PRODUCTION PYQ DEDUPLICATION & STRICT FILTERING UTILITIES
// Centralized, cross-course subject matching, Roman-numeral normalization, and deduplication
// ============================================================================

// 1. Subject code cleaning
export function cleanCode(c) {
  return String(c || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// 2. Canonical AKTU Code Map (K-series <-> B-series & NEP revisions)
export const CANONICAL_CODE_MAP = {
  'BAS103': 'KAS103', 'KAS103': 'KAS103',
  'BAS102': 'KAS102', 'KAS102': 'KAS102',
  'BAS101': 'KAS101', 'KAS101': 'KAS101',
  'BEE101': 'KEE101', 'KEE101': 'KEE101',
  'BCS101': 'KCS101', 'KCS101': 'KCS101',
  'BEC101': 'KEC101', 'KEC101': 'KEC101',
  'BME101': 'KME101', 'KME101': 'KME101',
  'BAS203': 'KAS203', 'KAS203': 'KAS203',
  'BNC102': 'KNC102', 'KNC102': 'KNC102',
  'BCS301': 'KCS301', 'KCS301': 'KCS301',
  'BCS302': 'KCS302', 'KCS302': 'KCS302',
  'BCS303': 'KCS303', 'KCS303': 'KCS303',
  'BCS401': 'KCS401', 'KCS401': 'KCS401',
  'BCS402': 'KCS402', 'KCS402': 'KCS402',
  'BCS403': 'KCS403', 'KCS403': 'KCS403'
};

export function getCanonicalCode(raw) {
  const cl = cleanCode(raw);
  return CANONICAL_CODE_MAP[cl] || cl;
}

// 3. Subject Title Normalization with word-boundary Roman numerals
export function normalizeSubjectTitle(str) {
  if (!str) return '';
  let s = String(str).toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/\s*\([^)]*\)/g, ' ');

  // Roman numeral and ordinal normalization using strict word boundaries
  s = s.replace(/\biv\b|\b4th\b/g, '4')
       .replace(/\biii\b|\b3rd\b/g, '3')
       .replace(/\bii\b|\b2nd\b/g, '2')
       .replace(/\bi\b|\b1st\b/g, '1');

  s = s.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  // Strip trailing 's' for simple singularization (e.g., systems -> system)
  return s.split(' ').map(w => w.replace(/s$/, '')).join(' ');
}

// 4. Strict Subject Matching
export function areSubjectsMatching(subjectOrCode, pyqPaper) {
  if (!subjectOrCode || !pyqPaper) return false;

  const sRawCode = typeof subjectOrCode === 'object' ? (subjectOrCode.code || subjectOrCode.subjectCode || '') : subjectOrCode;
  const sRawName = typeof subjectOrCode === 'object' ? (subjectOrCode.name || subjectOrCode.subjectName || subjectOrCode.subject || '') : subjectOrCode;

  const pRawCode = pyqPaper.subjectCode || pyqPaper.code || '';
  const pRawName = pyqPaper.subjectName || pyqPaper.subject || pyqPaper.title || '';

  const sCodeClean = cleanCode(sRawCode);
  const pCodeClean = cleanCode(pRawCode);
  const sCanon = getCanonicalCode(sRawCode);
  const pCanon = getCanonicalCode(pRawCode);

  // If both have subject codes -> STRICT CODE MATCHING
  if (sCodeClean && pCodeClean) {
    if (sCodeClean === pCodeClean) return true;
    if (sCanon && pCanon && sCanon === pCanon) return true;
    // Canonical K <-> B transition (e.g. KCS301 === BCS301)
    if (sCodeClean.length === 6 && pCodeClean.length === 6) {
      const sPre = sCodeClean[0];
      const pPre = pCodeClean[0];
      if ((sPre === 'K' || sPre === 'B') && (pPre === 'K' || pPre === 'B')) {
        if (sCodeClean.slice(1) === pCodeClean.slice(1)) return true;
      }
    }
    // Conflicting subject codes must NEVER match
    return false;
  }

  // Name Matching
  const sNorm = normalizeSubjectTitle(sRawName);
  const pNorm = normalizeSubjectTitle(pRawName);

  if (!sNorm || !pNorm) return false;
  if (sNorm === pNorm) return true;

  // Numeral conflict check (e.g. "mathematic 1" vs "mathematic 2")
  const sDigits = (sNorm.match(/\b[1-8]\b/g) || []).join('');
  const pDigits = (pNorm.match(/\b[1-8]\b/g) || []).join('');
  if (sDigits && pDigits && sDigits !== pDigits) {
    return false; // Conflicting sequence numbers must NEVER match
  }

  // Code embedded in title
  if (sCodeClean && pNorm.replace(/[^a-z0-9]/g, '').includes(sCodeClean.toLowerCase())) {
    return true;
  }

  // Token subset matching
  const sTokens = sNorm.split(' ').filter(w => w.length > 2);
  const pTokens = pNorm.split(' ').filter(w => w.length > 2);
  if (sTokens.length > 0 && pTokens.length > 0) {
    const allInP = sTokens.every(t => pTokens.includes(t));
    const allInS = pTokens.every(t => sTokens.includes(t));
    if ((allInP || allInS) && (sDigits === pDigits)) {
      return true;
    }
  }

  return false;
}

// 5. Universal Deduplication across all 24 AKTU Courses
export function deduplicatePyqs(list) {
  if (!Array.isArray(list)) return [];
  const result = [];
  const seenDriveIds = new Set();
  const seenUrls = new Set();
  const seenIdentities = new Set();

  const extractDriveId = (url) => {
    if (!url) return '';
    const m = String(url).match(/\/d\/([a-zA-Z0-9_-]+)/) || String(url).match(/id=([a-zA-Z0-9_-]+)/);
    return m ? m[1] : '';
  };

  const normalizeUrl = (url) => {
    if (!url) return '';
    return String(url)
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/[\?#].*$/, '')
      .replace(/\/+$/, '')
      .trim();
  };

  for (const p of list) {
    if (!p) continue;
    const url = p.pdfUrl || p.fileUrl || p.driveUrl || p.url || '';
    const driveId = extractDriveId(url);
    const normUrl = normalizeUrl(url);

    if (driveId) {
      if (seenDriveIds.has(driveId)) continue;
      seenDriveIds.add(driveId);
    }

    if (normUrl && normUrl.length > 5) {
      if (seenUrls.has(normUrl)) continue;
      seenUrls.add(normUrl);
    }

    const c = String(p.course || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const code = cleanCode(p.subjectCode || p.code || '');
    const yr = String(p.academicYear || p.examYear || p.year || '').replace(/[^0-9]/g, '');
    const sem = String(p.semester || '').replace(/[^0-9]/g, '');
    const type = String(p.examType || 'regular').toLowerCase().replace(/[^a-z0-9]/g, '');

    if (c && code && yr) {
      const identity = [c, code, yr, sem, type].join('|');
      if (seenIdentities.has(identity)) continue;
      seenIdentities.add(identity);
    }

    result.push(p);
  }

  return result;
}

// 6. Universal Filter Function for Subjects & Papers
export function filterPyqs(list, subject, params = {}) {
  if (!Array.isArray(list) || !subject) return [];
  const {
    normKey,
    isBTech,
    activeBranch,
    activeYear,
    activeSemester,
    selectedAcademicYear,
    selectedExamType,
    pyqSearchQuery
  } = params;

  const targetYearDigit = activeYear ? String(activeYear).replace(/[^0-9]/g, '') : '';
  const isY1 = targetYearDigit === '1';
  const targetBranch = activeBranch ? activeBranch.toUpperCase().trim() : '';

  const semFilterClean = (activeSemester && activeSemester !== 'All Semesters' && activeSemester !== 'All')
    ? String(activeSemester).replace(/[^0-9]/g, '')
    : '';

  const filtered = list.filter(p => {
    // 1. Course match
    const pCourse = String(p.course || 'B.Tech').toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetCourse = String(normKey || (isBTech ? 'B.Tech' : '')).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (targetCourse && pCourse !== targetCourse && (targetCourse !== 'btech' || pCourse !== 'btech')) {
      return false;
    }

    // 2. B.Tech Branch & Year match
    if (isBTech) {
      const pYear = String(p.year || p.btechYear || '').replace(/[^0-9]/g, '');
      if (pYear && targetYearDigit && pYear !== targetYearDigit) return false;

      const pBranch = String(p.branch || p.branchId || '').toUpperCase().trim();
      if (isY1) {
        if (pBranch && pBranch !== 'ALL' && pBranch !== 'COMMON' && pBranch !== targetBranch) return false;
      } else {
        if (pBranch && pBranch !== 'ALL' && pBranch !== targetBranch) return false;
      }
    }

    // 3. Semester match
    if (semFilterClean) {
      const pSemClean = String(p.semester || '').replace(/[^0-9]/g, '');
      if (pSemClean && pSemClean !== semFilterClean) return false;
    }

    // 4. Academic Year match
    if (selectedAcademicYear && selectedAcademicYear !== 'All') {
      const selNorm = String(selectedAcademicYear).replace(/[^0-9]/g, '');
      const pNorm = String(p.academicYear || p.examYear || '').replace(/[^0-9]/g, '');
      if (pNorm && selNorm && pNorm !== selNorm && !pNorm.includes(selNorm) && !selNorm.includes(pNorm)) {
        return false;
      }
    }

    // 5. Exam Type match
    if (selectedExamType && selectedExamType !== 'All') {
      const pType = String(p.examType || '').toLowerCase();
      const selType = String(selectedExamType).toLowerCase();
      if (!pType.includes(selType) && !selType.includes(pType)) return false;
    }

    // 6. Strict Subject match
    if (!areSubjectsMatching(subject, p)) return false;

    // 7. Search query match
    if (pyqSearchQuery && pyqSearchQuery.trim()) {
      const q = pyqSearchQuery.toLowerCase().trim();
      const pTitle = String(p.title || p.fileName || '').toLowerCase();
      const pSubName = String(p.subjectName || p.subject || '').toLowerCase();
      const pSubCode = String(p.subjectCode || '').toLowerCase();
      const pType = String(p.examType || '').toLowerCase();
      const pYr = String(p.academicYear || p.examYear || '').toLowerCase();
      if (!pTitle.includes(q) && !pSubName.includes(q) && !pSubCode.includes(q) && !pType.includes(q) && !pYr.includes(q)) {
        return false;
      }
    }

    return true;
  });

  return deduplicatePyqs(filtered);
}
