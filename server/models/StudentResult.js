// Normalized Mongoose Models for Student Academic Results
// Stores validated, structured result data (Section 40)
// Prevents duplicate results by indexing rollNumber

import mongoose from 'mongoose';

const SubjectResultSchema = new mongoose.Schema({
  subjectCode: { type: String, trim: true },
  subjectName: { type: String, trim: true },
  credits: { type: Number, default: null },
  marks: { type: Number, default: null },
  maxMarks: { type: Number, default: null },
  grade: { type: String, default: null },
  gradePoint: { type: Number, default: null },
  status: { type: String, default: 'Pass' },
  attempt: { type: Number, default: 1 },
  sourcePage: { type: Number, default: 1 }
}, { _id: false });

const SemesterResultSchema = new mongoose.Schema({
  semesterNumber: { type: Number, required: true },
  semesterName: { type: String },
  session: { type: String },
  officialSgpa: { type: Number, default: null },
  calculatedSgpa: { type: Number, default: null },
  displaySgpa: { type: Number, default: null },
  officialCgpa: { type: Number, default: null },
  calculatedCgpa: { type: Number, default: null },
  displayCgpa: { type: Number, default: null },
  totalMarks: { type: Number, default: null },
  maxMarks: { type: Number, default: null },
  creditsEarned: { type: Number, default: null },
  creditsAttempted: { type: Number, default: null },
  status: { type: String, default: 'Pass' },
  carryOverPapers: [{ type: String }],
  subjects: [SubjectResultSchema],
  calculationErrors: [{ type: String }]
}, { _id: false });

const StudentResultSchema = new mongoose.Schema({
  student: {
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true, default: null },
    gender: { type: String, trim: true, default: null },
    rollNumber: { type: String, required: true, trim: true, index: true },
    enrollmentNumber: { type: String, trim: true, default: null },
    course: { type: String, trim: true, default: null },
    branch: { type: String, trim: true, default: null },
    college: { type: String, trim: true, default: null },
    year: { type: String, default: null }
  },
  document: {
    documentType: { type: String, default: 'official_result' },
    university: { type: String, default: 'AKTU' },
    confidence: { type: Number, default: null },
    sourceFileName: { type: String }
  },
  semesters: [SemesterResultSchema],
  summary: {
    officialCGPA: { type: Number, default: null },
    calculatedCGPA: { type: Number, default: null },
    displayCGPA: { type: Number, default: null },
    latestSGPA: { type: Number, default: null },
    totalCreditsEarned: { type: Number, default: null },
    activeBacklogs: { type: Number, default: 0 },
    historicalBacklogs: { type: Number, default: 0 },
    clearedBacklogs: { type: Number, default: 0 },
    totalMarks: { type: Number, default: null },
    totalMaxMarks: { type: Number, default: null },
    overallPercentage: { type: Number, default: null },
    semestersCount: { type: Number, default: 0 },
    totalSubjects: { type: Number, default: 0 },
    passedSubjects: { type: Number, default: 0 }
  },
  backlogDetails: [{
    subjectCode: String,
    subjectName: String,
    semesters: [Number],
    currentStatus: { type: String, enum: ['ACTIVE', 'CLEARED'] },
    history: [{
      session: String,
      status: String,
      result: String,
      note: String
    }]
  }],
  charts: { type: mongoose.Schema.Types.Mixed, default: {} },
  analysis: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

// Compound index to avoid duplicate student records
StudentResultSchema.index({ 'student.rollNumber': 1 }, { unique: true });

export const StudentResult = mongoose.models.StudentResult || mongoose.model('StudentResult', StudentResultSchema);
export default StudentResult;
