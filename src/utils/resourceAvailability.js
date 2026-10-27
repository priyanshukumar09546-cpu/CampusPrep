import { notesData } from '../data/notesData';
import { pyqsData } from '../data/pyqsData';
import { BCA_NOTES_CATALOG } from '../data/bcaNotesData';
import { BBA_NOTES_CATALOG } from '../data/bbaNotesData';
import { BIOTECH_NOTES_CATALOG } from '../data/biotechNotesData';
import { AGRI_NOTES_CATALOG } from '../data/agriNotesData';

const cleanStr = (s) => (s ? String(s).toLowerCase().replace(/[^a-z0-9]/g, '') : '');

/**
 * Check if genuine notes exist for a subject code or name.
 */
export function hasNotesForSubject(subjectCode = '', subjectName = '') {
  if (!subjectCode && !subjectName) return false;

  const codeClean = cleanStr(subjectCode);
  const nameClean = cleanStr(subjectName);

  // 1. Direct key lookups in notesData
  if (subjectCode) {
    const candidates = [
      subjectCode,
      subjectCode.toUpperCase(),
      subjectCode.toLowerCase(),
      subjectCode.includes('-') ? subjectCode.replace(/-/g, '') : (subjectCode.slice(0, 3) + '-' + subjectCode.slice(3)),
      (subjectCode.includes('-') ? subjectCode.replace(/-/g, '') : (subjectCode.slice(0, 3) + '-' + subjectCode.slice(3))).toUpperCase()
    ];
    for (const c of candidates) {
      if (notesData[c] && notesData[c].length > 0) return true;
    }
  }

  // 2. Check catalog lists for other courses
  const matchInCatalog = (item) => {
    const iCode = cleanStr(item.subjectCode || item.code);
    const iName = cleanStr(item.subject || item.subjectName || item.name);
    return (codeClean && iCode === codeClean) || (nameClean && iName && (nameClean.includes(iName) || iName.includes(nameClean)));
  };

  if (Array.isArray(BCA_NOTES_CATALOG) && BCA_NOTES_CATALOG.some(matchInCatalog)) return true;
  if (Array.isArray(BBA_NOTES_CATALOG) && BBA_NOTES_CATALOG.some(matchInCatalog)) return true;
  if (Array.isArray(BIOTECH_NOTES_CATALOG) && BIOTECH_NOTES_CATALOG.some(matchInCatalog)) return true;
  if (Array.isArray(AGRI_NOTES_CATALOG) && AGRI_NOTES_CATALOG.some(matchInCatalog)) return true;

  // 3. Fallback scan across notesData values
  for (const key of Object.keys(notesData)) {
    if (codeClean && cleanStr(key) === codeClean) {
      if (notesData[key] && notesData[key].length > 0) return true;
    }
  }

  return false;
}

/**
 * Check if genuine PYQs exist for a subject code or name.
 */
export function hasPyqsForSubject(subjectCode = '', subjectName = '') {
  if (!subjectCode && !subjectName) return false;

  const codeClean = cleanStr(subjectCode);
  const nameClean = cleanStr(subjectName);

  if (subjectCode) {
    const candidates = [
      subjectCode,
      subjectCode.toUpperCase(),
      subjectCode.toLowerCase(),
      subjectCode.includes('-') ? subjectCode.replace(/-/g, '') : (subjectCode.slice(0, 3) + '-' + subjectCode.slice(3)),
      (subjectCode.includes('-') ? subjectCode.replace(/-/g, '') : (subjectCode.slice(0, 3) + '-' + subjectCode.slice(3))).toUpperCase()
    ];
    for (const c of candidates) {
      if (pyqsData[c] && pyqsData[c].length > 0) return true;
    }
  }

  // Scan across pyqsData keys
  for (const key of Object.keys(pyqsData)) {
    if (codeClean && cleanStr(key) === codeClean) {
      if (pyqsData[key] && pyqsData[key].length > 0) return true;
    }
  }

  return false;
}
