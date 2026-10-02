// ============================================================================
// PROFESSORVIRUS — CODING QUESTION MONGOOSE SCHEMA & MODEL
// Stores authentic placement coding problems with starter codes,
// visible test cases, and protected server-side solutions/test cases.
// ============================================================================

import mongoose from 'mongoose';

const ExampleSchema = new mongoose.Schema({
  num: { type: Number, required: true },
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' }
}, { _id: false });

const TestCaseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  input: { type: String, required: true },
  expected: { type: String, required: true }
}, { _id: false });

const CodingQuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  subject: { type: String, default: 'DSA & Problem Solving' },
  topic: { type: String, default: 'Data Structures' },
  timeLimit: { type: String, default: '60 Minutes' },
  description: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  examples: [ExampleSchema],
  constraints: [{ type: String }],
  // Clean starter code templates (NO solutions)
  starterCodes: {
    type: Map,
    of: String,
    default: {}
  },
  supportedLanguages: [{ type: String }],
  // Public test cases sent to frontend
  visibleTestCases: [TestCaseSchema],
  // PROTECTED: Server-side only (never sent to client)
  hiddenTestCases: [TestCaseSchema],
  solution: { type: String, default: '' },
  explanation: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'codingquestions'
});

export const CodingQuestion = mongoose.models.CodingQuestion || mongoose.model('CodingQuestion', CodingQuestionSchema);
