// Gemini AI Structured Extractor for University Result PDFs
// Uses Google Gemini API for document understanding and structured extraction
// NEVER calculates SGPA/CGPA - only extracts what exists in the document
// Supports primary model with automatic fallback to secondary model

import 'dotenv/config';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Active Gemini models: primary with fallback
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

// Strict JSON schema for Gemini structured output
const RESULT_EXTRACTION_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    document: {
      type: SchemaType.OBJECT,
      properties: {
        isStudentResult: {
          type: SchemaType.BOOLEAN,
          description: 'Is this a genuine student academic result/marksheet? true if it contains any student name + roll number + session/semester result data, even if in summary/one-view format.'
        },
        documentType: {
          type: SchemaType.STRING,
          description: 'Type: official_result, one_view_result, marksheet, transcript, grade_card, or unknown'
        },
        confidence: {
          type: SchemaType.NUMBER,
          description: 'Confidence 0.0-1.0 that this is a personal student result'
        },
        university: {
          type: SchemaType.STRING,
          description: 'University name if identified',
          nullable: true
        }
      },
      required: ['isStudentResult', 'documentType', 'confidence']
    },
    student: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING, description: 'Student full name from labeled field (Name:, Student Name:, Candidate Name:)', nullable: true },
        fatherName: { type: SchemaType.STRING, description: 'Father name if present (Father\'s Name:)', nullable: true },
        rollNumber: { type: SchemaType.STRING, description: 'Roll number (RollNo:)', nullable: true },
        enrollmentNumber: { type: SchemaType.STRING, description: 'Enrollment number (EnrollmentNo:)', nullable: true },
        course: { type: SchemaType.STRING, description: 'Course/programme name (e.g. B.TECH)', nullable: true },
        branch: { type: SchemaType.STRING, description: 'Branch/specialization (e.g. Computer Science and Engineering)', nullable: true },
        college: { type: SchemaType.STRING, description: 'College/institute name', nullable: true },
        year: { type: SchemaType.STRING, description: 'Academic year/session', nullable: true }
      }
    },
    semesters: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          semesterNumber: { type: SchemaType.INTEGER, description: 'Semester number (1-8)' },
          semesterName: { type: SchemaType.STRING, description: 'Full semester label from document', nullable: true },
          session: { type: SchemaType.STRING, description: 'Session string like 2024-25(REGULAR) or 2025-26(BACK)', nullable: true },
          sgpa: { type: SchemaType.NUMBER, description: 'Official SGPA printed on document', nullable: true },
          cgpa: { type: SchemaType.NUMBER, description: 'Official CGPA printed for this semester', nullable: true },
          totalMarks: { type: SchemaType.NUMBER, description: 'Total marks obtained for this semester if shown', nullable: true },
          maxMarks: { type: SchemaType.NUMBER, description: 'Maximum marks possible for this semester', nullable: true },
          creditsAttempted: { type: SchemaType.NUMBER, description: 'Total credits attempted', nullable: true },
          creditsEarned: { type: SchemaType.NUMBER, description: 'Total credits earned', nullable: true },
          status: { type: SchemaType.STRING, description: 'Overall semester status: Pass/Fail/PCP/PWG/Backlog', nullable: true },
          carryOverPapers: {
            type: SchemaType.ARRAY,
            description: 'Subject codes listed as COP (Carry Over Papers) for this semester',
            items: { type: SchemaType.STRING },
            nullable: true
          },
          subjects: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                subjectCode: { type: SchemaType.STRING, description: 'Subject code exactly as printed', nullable: true },
                subjectName: { type: SchemaType.STRING, description: 'Full subject name exactly as printed', nullable: true },
                internalMarks: { type: SchemaType.NUMBER, description: 'Internal/sessional marks', nullable: true },
                externalMarks: { type: SchemaType.NUMBER, description: 'External/end-term marks', nullable: true },
                marks: { type: SchemaType.NUMBER, description: 'Total marks obtained', nullable: true },
                maxMarks: { type: SchemaType.NUMBER, description: 'Maximum marks possible', nullable: true },
                credits: { type: SchemaType.NUMBER, description: 'Credit value of this subject', nullable: true },
                grade: { type: SchemaType.STRING, description: 'Letter grade (O/A+/A/B+/B/C/P/F)', nullable: true },
                gradePoint: { type: SchemaType.NUMBER, description: 'Numeric grade point', nullable: true },
                result: { type: SchemaType.STRING, description: 'Subject result: Pass/Fail/Backlog', nullable: true }
              }
            }
          }
        },
        required: ['semesterNumber']
      }
    },
    officialSummary: {
      type: SchemaType.OBJECT,
      properties: {
        officialSGPA: { type: SchemaType.NUMBER, description: 'Final/latest official SGPA on document', nullable: true },
        officialCGPA: { type: SchemaType.NUMBER, description: 'Final official CGPA on document', nullable: true },
        totalCreditsEarned: { type: SchemaType.NUMBER, description: 'Total credits earned across all semesters', nullable: true },
        backlogCount: { type: SchemaType.INTEGER, description: 'Number of active carry-over papers', nullable: true },
        totalMarks: { type: SchemaType.NUMBER, description: 'Grand total marks obtained', nullable: true },
        totalMaxMarks: { type: SchemaType.NUMBER, description: 'Grand total maximum marks', nullable: true }
      }
    }
  },
  required: ['document', 'student', 'semesters']
};

const EXTRACTION_PROMPT = `You are an expert university result and marksheet document analyzer specializing in AKTU (Dr. A.P.J. Abdul Kalam Technical University) results.

CRITICAL RULES:
1. This is for extracting data from a student's academic result. The document may be a detailed marksheet OR a summary "One View" result page.
2. AKTU "One View" documents ARE real student results — they show student name, roll number, session-wise marks, result status (PCP/PWG/PASS), and carry-over papers. These MUST be classified as isStudentResult=true.
3. Set isStudentResult=true if the document contains:
   - A labeled student name (Name:, Student Name:, Candidate Name:)
   - A roll number or enrollment number
   - Any session/semester result data (marks, grades, result status like PCP/PWG/PASS)
4. The "Designed & Developed by AKTU-SDC Team" footer is a standard AKTU watermark on ALL official AKTU result pages. Its presence means the document IS from the official AKTU system — it does NOT mean it's just an informational brochure.
5. For AKTU One View summary results:
   - Each "Session" line represents one or more semesters (e.g., "Session : 2024-25(REGULAR) Semesters : 1,2")
   - "PCP" means Promoted with Carry-over Papers (backlog), "PWG" means Promoted Without Grace (cleared), "PASS" means all clear
   - "COP" lists subject codes that are carry-over papers (backlogs)
   - Marks like "1152/1800" represent total marks obtained / maximum marks for that session
   - Create separate semester entries for EACH semester number mentioned
6. For student identity: look for labels like "Name:", "RollNo:", "EnrollmentNo:", "Father's Name:", "Institute Code & Name:"
7. IMPORTANT: Father's Name is NOT the student's name. "Father's Name: ASHA RAM" means the father is Asha Ram, NOT the student.
8. For detailed marksheets with subject tables: preserve exact table structure with columns for Subject Code, Subject Name, Marks, Credits, Grade, Grade Point, Result.
9. CRITICAL RULES FOR MARKS & GRADES:
   - Extract the EXACT marks shown for every individual subject.
   - Do NOT infer marks from grade.
   - Do NOT infer marks from grade point.
   - Do NOT infer marks from percentage.
   - Do NOT replace missing marks with zero.
   - If marks are visible, return the exact numeric value.
   - If marks are not visible, return null.
10. Extract EVERY semester present in the document. Do NOT skip any.
11. Use null for any field that is genuinely not present.
12. Do NOT invent, calculate, or estimate any values. Only extract what is printed.

Set isStudentResult=false ONLY if:
- No student name or roll number is found anywhere in the document
- The document is purely informational with zero personal academic data (e.g., a syllabus or brochure)

Extract all data strictly as it appears in the document.`;

/**
 * Initialize Gemini AI client
 * @returns {{ model: object, available: boolean, error: string|null }}
 */
export function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.length < 10) {
    return { model: null, available: false, error: 'GEMINI_API_KEY not configured in .env file' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: PRIMARY_MODEL,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RESULT_EXTRACTION_SCHEMA,
        temperature: 0.1
      }
    });
    return { model, available: true, error: null };
  } catch (err) {
    return { model: null, available: false, error: `Gemini initialization failed: ${err.message}` };
  }
}

/**
 * Helper to call Gemini with automatic model fallback
 */
async function callGeminiWithFallback(fn) {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError = null;

  for (const modelName of models) {
    try {
      const result = await fn(modelName);
      return { success: true, data: result, error: null };
    } catch (err) {
      console.warn(`[GEMINI] Model ${modelName} call failed:`, err.message);
      lastError = err;
      // If error is invalid API key or content blocked, fallback won't help
      if (err.message?.includes('API key') || err.message?.includes('API_KEY_INVALID') || err.message?.includes('SAFETY')) {
        break;
      }
    }
  }

  return { success: false, data: null, error: lastError?.message || 'Gemini models unavailable' };
}

/**
 * Extract structured result data from PDF text using Gemini
 * @param {string} pdfText - Extracted text from PDF
 * @param {object} model - Gemini model instance
 * @param {object} options - { fileName, pageCount }
 * @returns {Promise<{ success: boolean, data: object|null, error: string|null }>}
 */
export async function extractWithGemini(pdfText, model, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, data: null, error: 'GEMINI_API_KEY not configured' };
  }

  if (!pdfText || pdfText.trim().length < 30) {
    return { success: false, data: null, error: 'Insufficient text for analysis' };
  }

  const MAX_CHARS = 30000;
  let textToSend = pdfText;
  let truncated = false;
  if (textToSend.length > MAX_CHARS) {
    textToSend = textToSend.substring(0, MAX_CHARS);
    truncated = true;
  }

  const contextNote = [
    `Document: ${options.fileName || 'result.pdf'}`,
    `Pages: ${options.pageCount || 'unknown'}`,
    truncated ? `Note: Text was truncated to ${MAX_CHARS} characters. Process what is available.` : ''
  ].filter(Boolean).join('\n');

  const prompt = `${EXTRACTION_PROMPT}\n\n--- DOCUMENT INFO ---\n${contextNote}\n\n--- DOCUMENT TEXT ---\n${textToSend}`;

  const genAI = new GoogleGenerativeAI(apiKey);

  const res = await callGeminiWithFallback(async (modelName) => {
    const m = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RESULT_EXTRACTION_SCHEMA,
        temperature: 0.1
      }
    });
    const result = await m.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  });

  return res;
}

/**
 * Extract structured result data by sending the PDF file directly to Gemini
 * Uses Gemini's native file/document understanding (handles images, tables, scanned pages)
 * @param {Buffer} pdfBuffer - Raw PDF file buffer
 * @param {object} model - Gemini model instance
 * @param {object} options
 * @returns {Promise<{ success: boolean, data: object|null, error: string|null }>}
 */
export async function extractWithGeminiFile(pdfBuffer, model, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, data: null, error: 'GEMINI_API_KEY not configured' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const base64Data = Buffer.from(pdfBuffer).toString('base64');
    const filePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'application/pdf'
      }
    };

    const contextNote = `Document: ${options.fileName || 'result.pdf'}\nPages: ${options.pageCount || 'unknown'}`;
    const textPart = `${EXTRACTION_PROMPT}\n\n--- DOCUMENT INFO ---\n${contextNote}\n\nAnalyze the attached PDF document and extract all student result data.`;

    const res = await callGeminiWithFallback(async (modelName) => {
      const m = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESULT_EXTRACTION_SCHEMA,
          temperature: 0.1
        }
      });
      const result = await m.generateContent([textPart, filePart]);
      const text = result.response.text();
      return JSON.parse(text);
    });

    return res;
  } catch (err) {
    console.error('[GEMINI FILE EXTRACTION ERROR]', err.message);
    return { success: false, data: null, error: `AI file extraction failed: ${err.message}` };
  }
}
