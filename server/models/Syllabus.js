import mongoose from 'mongoose';

const SyllabusUnitSchema = new mongoose.Schema({
  unitNo: { type: Number },
  title: { type: String, required: true },
  topics: { type: String, default: '' }
}, { _id: false });

const SyllabusSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  course: { type: String, required: true, index: true },
  branch: { type: String, required: true, index: true },
  academicSession: { type: String, required: true, index: true },
  year: { type: String, required: true, index: true },
  semester: { type: String, required: true, index: true },
  applicableSemesters: { type: [String], default: [] },
  subjectName: { type: String, required: true, index: true },
  subjectCode: { type: String, default: '', index: true },
  officialPdfUrl: { type: String, default: null },
  officialSourceUrl: { type: String, default: 'https://aktu.ac.in/syllabus.html' },
  sourceTitle: { type: String, default: 'Official AKTU Syllabus' },
  verificationStatus: { 
    type: String, 
    enum: ['VERIFIED', 'PENDING', 'UNAVAILABLE'], 
    default: 'VERIFIED',
    index: true 
  },
  lastVerifiedAt: { type: String, default: () => new Date().toISOString() },
  credits: { type: Number, default: 4 },
  evalScheme: { type: String, default: '30-70 Marks' },
  isComprehensive: { type: Boolean, default: false },
  units: { type: [SyllabusUnitSchema], default: [] },
  isActive: { type: Boolean, default: true, index: true }
}, { 
  timestamps: true 
});

export const SyllabusModel = mongoose.models.Syllabus || mongoose.model('Syllabus', SyllabusSchema);
export default SyllabusModel;
