// ============================================================================
// PROFESSORVIRUS — DOCUMENT CLASSIFIER
// Dynamically classifies academic result documents into specialized parser categories
// Highly resilient to varied AKTU result formats, scanned documents, and session summaries
// ============================================================================

export const DOCUMENT_TYPES = {
  AKTU_ONE_VIEW: 'aktu_one_view',                 // Session-level summary or tabular One View
  AKTU_SEMESTER_MARKSHEET: 'aktu_marksheet',      // Detailed semester tabular marksheet
  AKTU_CONSOLIDATED: 'aktu_consolidated',         // Multi-semester transcript / grade card
  SCANNED_IMAGE: 'scanned_image',                 // Image or scanned PDF requiring OCR
  GENERIC_MARKSHEET: 'generic_marksheet',         // Other university tabular format
  INVALID_DOCUMENT: 'invalid_document'            // Non-academic or corrupted document
};

/**
 * Classify academic result document
 * @param {string} rawText - Extracted text
 * @param {object} meta - { pageCount, fileSize, fileName }
 * @returns {{ documentType: string, confidence: number, features: object, isScanned: boolean }}
 */
export function classifyDocument(rawText = '', meta = {}) {
  const clean = (rawText || '').replace(/\r/g, '').trim();
  const pageCount = meta.pageCount || 1;

  const features = {
    isAktu: /AKTU|Abdul Kalam|UPTU|AKTU-One-View|Gautam Buddh|Mahamaya|Uttar Pradesh Technical/i.test(clean) ||
      /Institute Code\s*&?\s*Name/i.test(clean),
    hasOneViewSignature: /One\s*View|AKTU-One-View|Print\s*One\s*View|Student\s*Result/i.test(clean),
    hasSessionLines: /(?:Session\s*:\s*\d{4}-\d{2}|Semesters?\s*:\s*[\d,]+|Semester\s*:\s*\d+)/i.test(clean),
    hasCopMarker: /\bCOP\s*:/i.test(clean),
    hasSubjectTableHeaders: /(?:Subject\s*Code|Sub\s*Code|Course\s*Code|Code\s+Name\s+Type)[\s\S]{0,120}?(?:Grade|Marks|Credits|GP|Point|Internal|External)/i.test(clean),
    hasDetailedColumns: /(?:Internal|External|End\s*Sem|Sessional|Max\s*Marks|Back\s*Paper)/i.test(clean),
    hasSubjectRows: /\b[A-Z]{2,4}[- ]?[0-9]{3,4}[A-Z]?\b[\s\S]{0,120}?(?:PASS|FAIL|PCP|PWG|[A-D][+]?|O\b|F\b)/i.test(clean) ||
      /\b(?:BAS|BCS|BEC|BEE|BME|KCS|KIT|KOE|KAS|REC|RCS|RME)[0-9]{3}\b/i.test(clean),
    hasConsolidatedHeader: /(?:Consolidated\s*(?:Grade|Marksheet|Transcript)|Academic\s*History)/i.test(clean),
    hasRollNumber: /(?:Roll\s*No\.?|RollNo|Roll\s*Number)[\s\t:]*[0-9]{6,16}/i.test(clean) || /\b2[0-9]{9,13}\b/.test(clean),
    hasEnrollmentNumber: /(?:Enrollment\s*No\.?|EnrollmentNo|Enrolment\s*No\.?)[\s\t:]*[A-Za-z0-9]{6,20}/i.test(clean),
    hasStudentName: /(?:(?:Student|Candidate)\s*Name|(?:^|\n|\t)\s*Name)\s*[:\s-]\s*[A-Za-z\s.]{2,50}/i.test(clean) ||
      /Student\s*Name\s*[:\s]/i.test(clean) ||
      /Candidate(?:'s)?\s*Name\s*[:\s]/i.test(clean) ||
      /\bName\s*:\s*[A-Z][A-Z\s]{2,35}/i.test(clean),
    textLength: clean.length,
    pageCount
  };

  // 1. Detect if document appears to be scanned / empty text layer
  const isSparse = clean.length < 40;
  if (isSparse) {
    return {
      documentType: DOCUMENT_TYPES.SCANNED_IMAGE,
      confidence: 0.90,
      features,
      isScanned: true
    };
  }

  // 2. Reject obvious non-results (syllabi, random documents without student identity or academic marks)
  if (!features.hasRollNumber && !features.hasEnrollmentNumber && !features.hasStudentName && !features.hasOneViewSignature && !features.hasSubjectTableHeaders && !features.hasSubjectRows) {
    return {
      documentType: DOCUMENT_TYPES.INVALID_DOCUMENT,
      confidence: 0.85,
      features,
      isScanned: false
    };
  }

  // 3. Tabular Semester Marksheet (Standard AKTU detailed format)
  if (features.hasSubjectTableHeaders || (features.hasDetailedColumns && features.hasSubjectRows) || /STATEMENT\s*OF\s*MARKS|GRADE\s*CARD/i.test(clean)) {
    // If it has multiple pages and explicit consolidated header
    if (features.hasConsolidatedHeader || (pageCount >= 2 && /(?:Semester\s*I|Sem\s*1).*(?:Semester\s*II|Sem\s*2)/is.test(clean))) {
      return {
        documentType: DOCUMENT_TYPES.AKTU_CONSOLIDATED,
        confidence: 0.95,
        features,
        isScanned: false
      };
    }

    return {
      documentType: DOCUMENT_TYPES.AKTU_SEMESTER_MARKSHEET,
      confidence: 0.96,
      features,
      isScanned: false
    };
  }

  // 4. AKTU One View (tabular or session-level summary, with or without backlogs)
  if (features.isAktu && (features.hasOneViewSignature || features.hasSessionLines || features.hasCopMarker || /Result\s*:\s*(?:PASS|PCP|PWG|FAIL)/i.test(clean))) {
    return {
      documentType: DOCUMENT_TYPES.AKTU_ONE_VIEW,
      confidence: 0.98,
      features,
      isScanned: false
    };
  }

  // 5. Consolidated multi-semester transcript
  if (features.hasConsolidatedHeader || (pageCount >= 2 && /(?:Semester\s*I|Sem\s*1).*(?:Semester\s*II|Sem\s*2)/is.test(clean))) {
    return {
      documentType: DOCUMENT_TYPES.AKTU_CONSOLIDATED,
      confidence: 0.92,
      features,
      isScanned: false
    };
  }

  // 6. Generic marksheet fallback (if has student identifier and academic structure)
  if ((features.hasRollNumber || features.hasEnrollmentNumber || features.hasStudentName) && (features.hasSessionLines || features.hasSubjectRows || features.hasSubjectTableHeaders)) {
    return {
      documentType: DOCUMENT_TYPES.GENERIC_MARKSHEET,
      confidence: 0.88,
      features,
      isScanned: false
    };
  }

  return {
    documentType: DOCUMENT_TYPES.INVALID_DOCUMENT,
    confidence: 0.50,
    features,
    isScanned: false
  };
}
