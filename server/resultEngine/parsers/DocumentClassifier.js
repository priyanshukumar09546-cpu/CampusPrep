// ============================================================================
// PROFESSORVIRUS — DOCUMENT CLASSIFIER
// Dynamically classifies academic result documents into specialized parser categories
// ============================================================================

export const DOCUMENT_TYPES = {
  AKTU_ONE_VIEW: 'aktu_one_view',                 // Session-level summary with COP & session marks
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
    isAktu: /AKTU|Abdul Kalam|UPTU|AKTU-One-View/i.test(clean),
    hasOneViewSignature: /One\s*View\s*Result|AKTU-One-View|Print\s*One\s*View/i.test(clean),
    hasSessionLines: /(?:Session\s*:\s*\d{4}-\d{2}|Semesters?\s*:\s*[\d,]+)/i.test(clean),
    hasCopMarker: /\bCOP\s*:/i.test(clean),
    hasSubjectTableHeaders: /(?:Subject\s*Code|Sub\s*Code|Course\s*Code).*(?:Grade|Marks|Credits|GP)/i.test(clean),
    hasDetailedColumns: /(?:Internal|External|End\s*Sem|Sessional|Max\s*Marks)/i.test(clean),
    hasConsolidatedHeader: /(?:Consolidated\s*(?:Grade|Marksheet|Transcript)|Academic\s*History)/i.test(clean),
    hasRollNumber: /(?:Roll\s*No\.?|RollNo|Roll\s*Number)[\s\t:]*[0-9]{6,15}/i.test(clean),
    hasEnrollmentNumber: /(?:Enrollment\s*No\.?|EnrollmentNo)[\s\t:]*[A-Za-z0-9]{6,20}/i.test(clean),
    hasStudentName: /(?:Student\s*Name|Candidate\s*Name|(?:^|\n)\s*Name\s*[\t:])\s*[A-Za-z\s.]{3,40}/i.test(clean),
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

  // 2. Reject obvious non-results
  if (!features.hasRollNumber && !features.hasEnrollmentNumber && !features.hasStudentName && !features.hasOneViewSignature && !features.hasSubjectTableHeaders) {
    return {
      documentType: DOCUMENT_TYPES.INVALID_DOCUMENT,
      confidence: 0.85,
      features,
      isScanned: false
    };
  }

  // 3. AKTU One View
  if (features.isAktu && (features.hasOneViewSignature || (features.hasSessionLines && features.hasCopMarker))) {
    return {
      documentType: DOCUMENT_TYPES.AKTU_ONE_VIEW,
      confidence: 0.98,
      features,
      isScanned: false
    };
  }

  // 4. Consolidated multi-semester transcript
  if (features.hasConsolidatedHeader || (features.hasSubjectTableHeaders && pageCount >= 2 && /(?:Semester\s*I|Sem\s*1).*(?:Semester\s*II|Sem\s*2)/is.test(clean))) {
    return {
      documentType: DOCUMENT_TYPES.AKTU_CONSOLIDATED,
      confidence: 0.92,
      features,
      isScanned: false
    };
  }

  // 5. Detailed Semester Marksheet
  if (features.hasSubjectTableHeaders || features.hasDetailedColumns || /STATEMENT\s*OF\s*MARKS|GRADE\s*CARD/i.test(clean)) {
    return {
      documentType: DOCUMENT_TYPES.AKTU_SEMESTER_MARKSHEET,
      confidence: 0.95,
      features,
      isScanned: false
    };
  }

  // 6. Generic marksheet fallback
  if (features.hasRollNumber && features.hasStudentName) {
    return {
      documentType: DOCUMENT_TYPES.GENERIC_MARKSHEET,
      confidence: 0.75,
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
