/**
 * PRMA Tech Internship Portal & Corporate Backend Routes
 * Full-stack implementation supporting:
 * - Dynamic domain management
 * - Strict multi-section application validation & storage
 * - Resume upload & secure access
 * - Vector PDF joining letter generation
 * - Automated transactional email dispatch & tracking
 * - Real database-driven admin analytics & review actions
 * - Task dispatch & email communication system
 * - Scannable QR credential verification
 */

import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { generatePrmaOfferLetterPdf } from '../services/prmaOfferLetterEngine.js';
import { generatePrmaProblemStatementPdf, DEFAULT_DOMAIN_TASKS } from '../services/prmaProblemStatementEngine.js';
import {
  sendPrmaApprovalEmail,
  sendPrmaShortlistEmail,
  sendPrmaSubmissionConfirmationEmail,
  sendPrmaAdminTaskNotificationEmail,
  sendPrmaReviewFeedbackEmail,
  sendPrmaTaskEmail,
  sendPrmaRejectionEmail
} from '../services/prmaEmailService.js';
import {
  generateStudentGoogleFormUrl,
  parseGoogleFormWebhookPayload,
  generateGoogleAppsScriptCode,
  GOOGLE_FORM_CONFIG
} from '../services/prmaGoogleFormService.js';
import { createPrmaEnterpriseRouter } from './prmaEnterpriseRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

const APPS_FILE = path.join(DATA_DIR, 'prma_applications.json');
const DOMAINS_FILE = path.join(DATA_DIR, 'prma_domains.json');
const TASKS_FILE = path.join(DATA_DIR, 'prma_tasks.json');
const EMAILS_FILE = path.join(DATA_DIR, 'prma_emails.json');
const JOBS_FILE = path.join(DATA_DIR, 'prma_jobs.json');
const JOB_APPS_FILE = path.join(DATA_DIR, 'prma_job_applications.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'prma_submissions.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'prma_templates.json');
const GFORM_CONFIG_FILE = path.join(DATA_DIR, 'prma_gform_config.json');

// Google Form runtime configuration store
let currentGformConfig = { ...GOOGLE_FORM_CONFIG };
try {
  if (fs.existsSync(GFORM_CONFIG_FILE)) {
    const raw = fs.readFileSync(GFORM_CONFIG_FILE, 'utf8');
    currentGformConfig = { ...GOOGLE_FORM_CONFIG, ...JSON.parse(raw) };
  }
} catch (e) {
  console.warn('[PRMA ROUTES] Notice reading gform config:', e.message);
}

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[PRMA ROUTES] Notice: Unable to create data dir:', e.message);
}

// Persistent MongoDB Schema & Model for PRMA Tech Applications
const PrmaApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true, index: true },
  student: {
    fullName: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true, index: true },
    mobile: { type: String, required: true },
    whatsapp: { type: String, default: '' },
    gender: { type: String, default: 'Not Specified' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pinCode: { type: String, default: '' }
  },
  academic: {
    college: { type: String, required: true },
    university: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, default: '' },
    year: { type: String, required: true },
    semester: { type: String, default: '' },
    graduationYear: { type: String, default: '' }
  },
  technical: {
    domainId: { type: String, default: 'ai-ml' },
    domainTitle: { type: String, required: true },
    skills: [String],
    languages: [String],
    experience: { type: String, default: '' },
    experienceLevel: { type: String, default: 'Beginner' }
  },
  profiles: {
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' }
  },
  resume: {
    fileName: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    dataUrl: { type: String, default: '' }
  },
  socialFollow: {
    followedLinkedIn: { type: Boolean, default: false },
    followedInstagram: { type: Boolean, default: false },
    linkedinScreenshot: { type: String, default: '' },
    instagramScreenshot: { type: String, default: '' },
    linkedinScreenshotName: { type: String, default: '' },
    instagramScreenshotName: { type: String, default: '' }
  },
  linkedinScreenshotUrl: { type: String, default: '' },
  instagramScreenshotUrl: { type: String, default: '' },
  duration: { type: String, default: '1 Month' },
  preferredStartDate: { type: String, default: 'Immediate' },
  mode: { type: String, default: 'Remote' },
  fee: { type: String, default: '₹0 (100% Free)' },
  status: { type: String, default: 'submitted', index: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  joiningLetterGenerated: { type: Boolean, default: false },
  joiningDate: { type: String, default: '' },
  completionDate: { type: String, default: '' },
  offerId: { type: String, default: '' },
  submissionToken: { type: String, default: '', index: true },
  submissionUrl: { type: String, default: '' },
  googleFormUrl: { type: String, default: '' },
  joiningLetterPdfRef: { type: String, default: '' },
  problemStatementPdfRef: { type: String, default: '' },
  emailDispatchStatus: { type: String, default: 'Pending' },
  emailMessageId: { type: String, default: '' },
  emailLastAttempt: { type: String, default: '' },
  emailFailureReason: { type: String, default: '' },
  approvalTimestamp: { type: String, default: '' },
  offerGeneratedAt: { type: String, default: '' },
  lastStatusUpdate: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
  reviewNotes: { type: String, default: '' },
  adminRemarks: { type: String, default: '' }
}, { timestamps: true });

export const PrmaApplicationModel = mongoose.models.PrmaApplication || mongoose.model('PrmaApplication', PrmaApplicationSchema);

// Persistent MongoDB Schema & Model for Student Submissions
const PrmaSubmissionSchema = new mongoose.Schema({
  submissionId: { type: String, required: true, unique: true, index: true },
  applicationId: { type: String, required: true, index: true },
  offerId: { type: String, required: true, index: true },
  submissionToken: { type: String, required: true, unique: true, index: true },
  student: {
    fullName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    mobile: { type: String, default: '' },
    college: { type: String, default: '' },
    branch: { type: String, default: '' },
    fatherName: { type: String, default: '' }
  },
  technical: {
    domainId: { type: String, default: 'ai-ml' },
    domainTitle: { type: String, required: true }
  },
  joiningDate: { type: String, default: '' },
  completionDate: { type: String, default: '' },
  duration: { type: String, default: '1 Month' },
  mode: { type: String, default: 'Fully Remote' },
  tasks: [{
    weekNumber: { type: Number, required: true },
    taskTitle: { type: String, required: true },
    taskProblemStatement: { type: String, default: '' },
    effort: { type: String, default: '' },
    prerequisites: { type: String, default: '' },
    status: { type: String, default: 'not_submitted' }, // 'not_submitted', 'submitted', 'under_review', 'approved', 'revision_required'
    source: { type: String, default: 'portal' }, // 'portal' or 'google_form'
    googleFormResponseId: { type: String, default: '' },
    submittedAt: { type: String, default: '' },
    updatedAt: { type: String, default: '' },
    files: [{
      fileId: { type: String },
      fileName: { type: String },
      fileSize: { type: Number },
      fileType: { type: String },
      dataUrl: { type: String }
    }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    followedInstagram: { type: Boolean, default: false },
    followedLinkedIn: { type: Boolean, default: false },
    projectZipUrl: { type: String, default: '' },
    documentationPdfUrl: { type: String, default: '' },
    studentRemarks: { type: String, default: '' },
    adminFeedback: { type: String, default: '' },
    reviewedAt: { type: String, default: '' },
    reviewedBy: { type: String, default: '' },
    reviewStatus: { type: String, default: 'pending' }, // 'pending', 'under_review', 'approved', 'revision_required'
    resubmissionCount: { type: Number, default: 0 }
  }],
  overallProgress: { type: Number, default: 0 },
  completedWeeksCount: { type: Number, default: 0 },
  lastSubmissionDate: { type: String, default: '' },
  status: { type: String, default: 'active' }
}, { timestamps: true });

export const PrmaSubmissionModel = mongoose.models.PrmaSubmission || mongoose.model('PrmaSubmission', PrmaSubmissionSchema);

// Resilient direct replica set URI to bypass Vercel serverless DNS SRV query failures
export const DIRECT_ATLAS_URI = 'mongodb://professorvirus_admin:ProfessorVirus2026@ac-ojbgnqm-shard-00-00.tftgeof.mongodb.net:27017,ac-ojbgnqm-shard-00-01.tftgeof.mongodb.net:27017,ac-ojbgnqm-shard-00-02.tftgeof.mongodb.net:27017/ProfessorVirus?ssl=true&replicaSet=atlas-cxvxsy-shard-0&authSource=admin';

let mongoConnectPromise = null;

export async function ensureMongoConnected() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return true;
  }
  if (mongoose.connection && mongoose.connection.readyState === 2) {
    if (mongoConnectPromise) {
      try {
        await mongoConnectPromise;
      } catch (e) {}
    } else {
      for (let i = 0; i < 25; i++) {
        if (mongoose.connection && mongoose.connection.readyState === 1) return true;
        if (mongoose.connection && (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3)) break;
        await new Promise(r => setTimeout(r, 200));
      }
    }
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  if (mongoConnectPromise) {
    try {
      await mongoConnectPromise;
    } catch (e) {}
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  const primaryUri = process.env.MONGODB_URI;
  mongoConnectPromise = (async () => {
    if (primaryUri) {
      try {
        await mongoose.connect(primaryUri, {
          serverSelectionTimeoutMS: 6000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 6000,
          family: 4
        });
        console.log('[PRMA ROUTER] Connected to MongoDB Atlas via primary URI.');
        return true;
      } catch (err) {
        console.warn('[PRMA ROUTER] Primary MongoDB URI error:', err.message, '- Falling back to direct replica set...');
      }
    }

    try {
      await mongoose.connect(DIRECT_ATLAS_URI, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 8000,
        family: 4
      });
      console.log('[PRMA ROUTER] Connected to MongoDB Atlas via direct replica set.');
      return true;
    } catch (fallbackErr) {
      console.error('[PRMA ROUTER] Direct replica set connection failed:', fallbackErr.message);
      return false;
    }
  })();

  try {
    return await mongoConnectPromise;
  } finally {
    mongoConnectPromise = null;
  }
}

// 9 Showcase Goodies (Zero Pricing • Coming Soon)
const SHOWCASE_GOODIES = [
  {
    id: 'tshirt',
    name: 'PRMA Tech T-Shirt',
    subtitle: 'Official Branded Apparel',
    description: 'Premium cotton T-shirt with official PRMA Tech branding.',
    image: '/assets/prma_goodies/prma_tshirt.png',
    status: 'COMING SOON',
    features: ['100% Combed Bio-Washed Cotton', 'Official Multi-Color Crest', 'Double-Stitched Seams']
  },
  {
    id: 'bottle',
    name: 'PRMA Tech Water Bottle',
    subtitle: 'Thermal Insulated Flask',
    description: 'Durable and stylish bottle to keep you hydrated.',
    image: '/assets/prma_goodies/prma_bottle.png',
    status: 'COMING SOON',
    features: ['750 ml Stainless Steel', 'Double-Wall Vacuum Insulation', 'Laser-Engraved Logo']
  },
  {
    id: 'notebook',
    name: 'Executive Notebook',
    subtitle: 'Premium Work Journal',
    description: 'Premium notebook for your ideas, notes and learning journey.',
    image: '/assets/prma_goodies/prma_notebook.png',
    status: 'COMING SOON',
    features: ['A5 Ruled 192 Acid-Free Pages', 'Satin Bookmark Ribbon', 'Gold Foil PRMA Tech Seal']
  },
  {
    id: 'id-card',
    name: 'Intern ID Card + Lanyard',
    subtitle: 'Smart Verified Access Card',
    description: 'Official PRMA Tech intern ID card with branded lanyard.',
    image: '/assets/prma_goodies/prma_id_card.png',
    status: 'COMING SOON',
    features: ['Personalized Name & Intern ID', 'Embedded Quick-Verify QR Code', 'Satin Lanyard']
  },
  {
    id: 'pen',
    name: 'PRMA Tech Pen',
    subtitle: 'Executive Metal Rollerball',
    description: 'Smooth and professional pen with PRMA Tech branding.',
    image: '/assets/prma_gen/prma_pen.jpg',
    status: 'COMING SOON',
    features: ['Matte Black Metallic Body', 'High-Precision 0.7mm Rollerball', 'Chrome Accents']
  },
  {
    id: 'mug',
    name: 'PRMA Tech Mug',
    subtitle: 'Classic Ceramic Mug',
    description: 'A classic ceramic mug for your daily inspiration.',
    image: '/assets/prma_goodies/prma_mug_real.jpg',
    status: 'COMING SOON',
    features: ['350 ml High-Grade Ceramic', 'Official PRMA Tech Logo & Slogan', 'Microwave Safe']
  },
  {
    id: 'stickers',
    name: 'Tech Sticker Pack',
    subtitle: 'Die-Cut Vinyl Workstation Decals',
    description: 'High-quality stickers to customize your laptop, notebook and more.',
    image: '/assets/prma_goodies/prma_stickers.png',
    status: 'COMING SOON',
    features: ['6-Piece High Gloss Vinyl', 'Waterproof & UV Resistant', 'Residue-Free Removal']
  },
  {
    id: 'cap',
    name: 'PRMA Tech Cap',
    subtitle: 'Embroidered Structured Cap',
    description: 'Stylish and comfortable cap with embroidered PRMA Tech logo.',
    image: '/assets/prma_goodies/prma_cap.png',
    status: 'COMING SOON',
    features: ['100% Breathable Cotton Twill', '3D Embroidered Crest', 'Adjustable Brass Buckle']
  },
  {
    id: 'welcome-box',
    name: 'Welcome Box',
    subtitle: 'Official Internship Kit Hamper',
    description: 'A special welcome kit for selected interns (includes premium PRMA Tech goodies).',
    image: '/assets/prma_goodies/prma_welcome_box.png',
    status: 'COMING SOON',
    features: ['Rigid Magnetic Gift Box', 'Complete Merchandise Suite', 'Customized Name Tag']
  }
];

export function createPrmaRouter({ isDbConnected } = {}) {
  const router = express.Router();

  // Allow robust 50MB body payloads for resumes and verification screenshots
  router.use(express.json({ limit: '50mb' }));
  router.use(express.urlencoded({ limit: '50mb', extended: true }));

  // In-memory data structures
  const applicationsStore = new Map();
  const domainsStore = new Map();
  const tasksStore = new Map();
  const emailLogsStore = [];
  const jobsStore = new Map();
  const jobApplicationsStore = [];
  const submissionsStore = new Map();
  const pdfCacheStore = new Map(); // offerId/appId -> Buffer

  // Helper: Resilient synchronous lookup by applicationId or offerId from in-memory cache
  const findApplication = (id) => {
    if (!id) return null;
    const direct = applicationsStore.get(id);
    if (direct) return direct;
    const lower = String(id).trim().toLowerCase();
    for (const a of applicationsStore.values()) {
      if ((a.applicationId && a.applicationId.toLowerCase() === lower) ||
          (a.offerId && a.offerId.toLowerCase() === lower)) {
        return a;
      }
    }
    return null;
  };

  // Helper: Authoritative async lookup ensuring direct MongoDB Atlas query
  const getApplication = async (id) => {
    if (!id) return null;
    const cleanId = String(id).trim();

    // 1. Check in-memory store
    const mem = findApplication(cleanId);
    if (mem && (mem.resume?.dataUrl || mem.socialFollow?.linkedinScreenshot)) {
      return mem;
    }

    // 2. Query MongoDB Atlas directly
    await ensureMongoConnected();
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const found = await PrmaApplicationModel.findOne({
          $or: [
            { applicationId: cleanId },
            { applicationId: new RegExp('^' + cleanId + '$', 'i') },
            { offerId: cleanId },
            { offerId: new RegExp('^' + cleanId + '$', 'i') },
            { 'student.email': new RegExp('^' + cleanId + '$', 'i') }
          ]
        }).lean();
        if (found) {
          applicationsStore.set(found.applicationId, found);
          return found;
        }
      } catch (err) {
        console.warn('[PRMA ROUTER] getApplication DB query error:', err.message);
      }
    }
    return mem || null;
  };

  // Helper: Persist applications to MongoDB Atlas (authoritative) and disk JSON fallback
  const persistApplications = async (specificRecord = null) => {
    let connected = await ensureMongoConnected();
    if (!connected && (!mongoose.connection || mongoose.connection.readyState !== 1)) {
      await new Promise(r => setTimeout(r, 600));
      connected = await ensureMongoConnected();
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        if (specificRecord && specificRecord.applicationId) {
          await PrmaApplicationModel.findOneAndUpdate(
            { applicationId: specificRecord.applicationId },
            specificRecord,
            { upsert: true, returnDocument: 'after' }
          );
          console.log(`[PRMA ROUTER] Successfully persisted application ${specificRecord.applicationId} to MongoDB Atlas.`);
        } else {
          for (const app of applicationsStore.values()) {
            if (app.applicationId) {
              await PrmaApplicationModel.findOneAndUpdate(
                { applicationId: app.applicationId },
                app,
                { upsert: true }
              );
            }
          }
        }
      } catch (err) {
        console.error('[PRMA ROUTER] Critical: MongoDB persistence error:', err.message);
        throw err;
      }
    } else {
      console.error('[PRMA ROUTER] Cannot persist application: MongoDB is not connected!');
      throw new Error('Database connection unavailable for persistent storage. Please check connection and try again.');
    }

    try {
      const arr = Array.from(applicationsStore.values());
      fs.writeFileSync(APPS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (e) {
      // In Vercel serverless fs write is read-only, which is expected
    }
  };

  // Helper: Load applications from MongoDB Atlas (authoritative) and disk JSON fallback
  const loadApplications = async () => {
    await ensureMongoConnected();

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const mongoApps = await PrmaApplicationModel.find({}).sort({ createdAt: -1 }).lean();
        if (Array.isArray(mongoApps) && mongoApps.length > 0) {
          mongoApps.forEach(app => {
            if (app.applicationId) {
              applicationsStore.set(app.applicationId, app);
            }
          });
          console.log(`[PRMA ROUTER] Synced ${mongoApps.length} applications from MongoDB Atlas.`);
          try {
            const arr = Array.from(applicationsStore.values());
            fs.writeFileSync(APPS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
          } catch (e) {}
          return;
        }
      } catch (err) {
        console.warn('[PRMA ROUTER] MongoDB load error:', err.message);
      }
    }

    try {
      if (fs.existsSync(APPS_FILE)) {
        const raw = fs.readFileSync(APPS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((app) => {
            if (app.applicationId) {
              applicationsStore.set(app.applicationId, app);
            }
          });
          console.log(`[PRMA ROUTER] Loaded ${applicationsStore.size} persistent applications from disk.`);
        }
      }
    } catch (e) {
      console.warn('[PRMA ROUTER] Could not load persisted applications from disk:', e.message);
    }
  };

  // Helper: Initialize 4 weekly tasks from domain library
  const initializeWeeklyTasks = (domainId) => {
    const tasksDef = DEFAULT_DOMAIN_TASKS[domainId] || DEFAULT_DOMAIN_TASKS['default'];
    return tasksDef.map(t => ({
      weekNumber: t.weekNumber,
      taskTitle: t.title,
      taskProblemStatement: t.problemStatement,
      effort: t.effort,
      prerequisites: t.prerequisites,
      status: 'not_submitted',
      submittedAt: '',
      updatedAt: '',
      files: [],
      githubUrl: '',
      liveUrl: '',
      studentRemarks: '',
      adminFeedback: '',
      reviewedAt: '',
      reviewedBy: '',
      reviewStatus: 'pending',
      resubmissionCount: 0
    }));
  };

  // Helper: Persist Submissions to MongoDB Atlas and disk
  const persistSubmissions = async (specificRecord = null) => {
    await ensureMongoConnected();
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        if (specificRecord && specificRecord.submissionId) {
          await PrmaSubmissionModel.findOneAndUpdate(
            { submissionId: specificRecord.submissionId },
            specificRecord,
            { upsert: true, returnDocument: 'after' }
          );
        } else {
          for (const sub of submissionsStore.values()) {
            if (sub.submissionId) {
              await PrmaSubmissionModel.findOneAndUpdate(
                { submissionId: sub.submissionId },
                sub,
                { upsert: true }
              );
            }
          }
        }
      } catch (err) {
        console.error('[PRMA ROUTER] Submissions MongoDB persistence error:', err.message);
      }
    }
    try {
      const uniqueSubs = Array.from(new Set(Array.from(submissionsStore.values())));
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(uniqueSubs, null, 2), 'utf-8');
    } catch (e) {}
  };

  // Helper: Load Submissions from MongoDB Atlas and disk
  const loadSubmissions = async () => {
    await ensureMongoConnected();
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const mongoSubs = await PrmaSubmissionModel.find({}).sort({ updatedAt: -1 }).lean();
        if (Array.isArray(mongoSubs) && mongoSubs.length > 0) {
          mongoSubs.forEach(sub => {
            if (sub.submissionId) {
              submissionsStore.set(sub.submissionId, sub);
              if (sub.submissionToken) {
                submissionsStore.set(sub.submissionToken, sub);
              }
            }
          });
          return;
        }
      } catch (err) {
        console.warn('[PRMA ROUTER] Mongo load submissions error:', err.message);
      }
    }

    try {
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((sub) => {
            if (sub.submissionId) {
              submissionsStore.set(sub.submissionId, sub);
              if (sub.submissionToken) {
                submissionsStore.set(sub.submissionToken, sub);
              }
            }
          });
        }
      }
    } catch (e) {}
  };

  // Helper: Get submission by token or ID
  const getSubmissionByToken = async (tokenOrId) => {
    if (!tokenOrId) return null;
    const clean = String(tokenOrId).trim();

    // 1. In memory
    const direct = submissionsStore.get(clean);
    if (direct) return direct;
    for (const s of submissionsStore.values()) {
      if (s.submissionToken === clean || s.submissionId === clean || s.offerId === clean || s.applicationId === clean) {
        return s;
      }
    }

    // 2. In MongoDB Atlas
    await ensureMongoConnected();
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const found = await PrmaSubmissionModel.findOne({
          $or: [
            { submissionToken: clean },
            { submissionId: clean },
            { offerId: clean },
            { applicationId: clean }
          ]
        }).lean();
        if (found) {
          submissionsStore.set(found.submissionId, found);
          if (found.submissionToken) submissionsStore.set(found.submissionToken, found);
          return found;
        }
      } catch (e) {}
    }
    return null;
  };

  // Helper: Load & Persist Domains
  const loadDomains = () => {
    try {
      if (fs.existsSync(DOMAINS_FILE)) {
        const raw = fs.readFileSync(DOMAINS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((d) => {
            if (d.id) domainsStore.set(d.id, d);
          });
          console.log(`[PRMA ROUTER] Loaded ${domainsStore.size} domains from storage.`);
        }
      }
    } catch (e) {
      console.warn('[PRMA ROUTER] Could not load domains from disk:', e.message);
    }

    // Seed defaults if empty
    if (domainsStore.size === 0) {
      const defaultDomains = [
        { id: 'ai-ml', title: 'Artificial Intelligence & Machine Learning', shortTitle: 'AI & Machine Learning', category: 'AI & Data Science', badge: '100% FREE • 1 MONTH', iconType: 'ai-ml', description: 'Design and train predictive AI models, deep neural networks, and explore practical computer vision and NLP with industry datasets.', technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'FastAPI', 'Pandas'], skills: ['Supervised & Unsupervised Learning', 'Neural Network Architectures', 'Model Evaluation & Optimization', 'Feature Engineering', 'REST Model Serving'], project: 'End-to-End Deep Learning Classifier & Intelligence System with REST API', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-AIML', color: '#3B82F6', active: true },
        { id: 'data-science-analytics', title: 'Data Science & Data Analytics', shortTitle: 'Data Science & Analytics', category: 'AI & Data Science', badge: '100% FREE • 1 MONTH', iconType: 'data-science', description: 'Transform complex raw data into compelling executive stories, statistical insights, interactive KPI dashboards, and trend projections.', technologies: ['Python', 'Pandas', 'NumPy', 'Power BI', 'SQL', 'Seaborn'], skills: ['Exploratory Data Analysis (EDA)', 'Statistical Inference', 'Data Cleansing & Pipeline Wrangling', 'Dashboard Visualization', 'Business Metric Modeling'], project: 'Enterprise Business Intelligence Engine with Interactive Executive Dashboard', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-DSDA', color: '#06B6D4', active: true },
        { id: 'python-programming', title: 'Python Programming', shortTitle: 'Python Programming', category: 'Software Engineering', badge: '100% FREE • 1 MONTH', iconType: 'python', description: 'Master core-to-advanced Python, object-oriented software design, automated web scraping, API development, and data manipulation.', technologies: ['Python 3.12', 'OOP', 'Requests & BeautifulSoup', 'Flask', 'SQLite', 'PyTest'], skills: ['Object-Oriented Programming (OOP)', 'Web Scraping & Automation', 'RESTful Microservices', 'File I/O & Exception Handling', 'Unit Testing'], project: 'Multi-threaded Automated Web Scraper & Task Automation Service with SQLite Database', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-PYTH', color: '#EAB308', active: true },
        { id: 'fullstack-web-dev', title: 'Full Stack Web Development', shortTitle: 'Full Stack Web Dev', category: 'Development', badge: '100% FREE • 1 MONTH', iconType: 'fullstack', description: 'Build complete production-grade web applications from dynamic, responsive client frontends to scalable backend REST APIs and databases.', technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'], skills: ['MERN Stack Architecture', 'RESTful API Engineering', 'Authentication & JWT Security', 'Database Schema Modeling', 'State Management'], project: 'Full-Featured SaaS Workspace Platform with User Auth, CRUD Engine, and Role-Based Access', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-FUSD', color: '#8B5CF6', active: true },
        { id: 'frontend-development', title: 'Frontend Development', shortTitle: 'Frontend Development', category: 'Development', badge: '100% FREE • 1 MONTH', iconType: 'frontend', description: 'Craft high-performance, accessible, and stunning user interfaces using React, component architectures, and modern CSS utilities.', technologies: ['React 18', 'JavaScript (ES6+)', 'Tailwind CSS', 'Vite', 'React Router'], skills: ['React Component Lifecycle & Hooks', 'Responsive & Mobile-First Design', 'Client-Side State Management', 'API Integration', 'UI/UX Polish'], project: 'High-Performance Interactive E-Commerce Dashboard with Filtering, Search & Cart', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-FRNT', color: '#EC4899', active: true },
        { id: 'backend-development', title: 'Backend Development', shortTitle: 'Backend Development', category: 'Development', badge: '100% FREE • 1 MONTH', iconType: 'backend', description: 'Engineer scalable, high-throughput backend services, asynchronous worker queues, resilient REST APIs, and relational/NoSQL databases.', technologies: ['Node.js', 'Express.js', 'PostgreSQL / MongoDB', 'Redis', 'JWT'], skills: ['RESTful API Design', 'Middleware Pipelines & Validation', 'Database Indexing & Queries', 'Authentication & Authorization', 'Error Handling'], project: 'Scalable Microservice Backend with Authentication, Caching Layer & Rate Limiting', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-BKND', color: '#10B981', active: true },
        { id: 'java-programming', title: 'Java Programming', shortTitle: 'Java Programming', category: 'Software Engineering', badge: '100% FREE • 1 MONTH', iconType: 'java', description: 'Deepen core Java, Object-Oriented Principles, Collections Framework, Exception Handling, Multi-threading, and Spring Boot foundations.', technologies: ['Java 17/21', 'Spring Boot', 'OOP Concepts', 'Java Collections', 'JDBC / Hibernate'], skills: ['Enterprise OOP Architecture', 'Collections & Generics', 'Multi-threading & Concurrency', 'Spring Boot REST APIs', 'Database Connectivity'], project: 'Enterprise Employee & Payroll Management System with Spring Boot & H2/MySQL', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-JAVA', color: '#EA580C', active: true },
        { id: 'cpp-programming', title: 'C++ Programming', shortTitle: 'C++ Programming', category: 'Software Engineering', badge: '100% FREE • 1 MONTH', iconType: 'cpp', description: 'Master systems programming, manual memory management, modern C++ (C++17/20), pointers, Standard Template Library (STL), and algorithms.', technologies: ['C++17/20', 'STL', 'Pointers', 'CMake', 'OOP in C++', 'Data Structures'], skills: ['Memory Management & RAII', 'Standard Template Library (STL)', 'Data Structures Implementation', 'Pointers & References', 'Algorithmic Problem Solving'], project: 'High-Performance In-Memory Key-Value Store & Cache with Custom Memory Pool in C++', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-CPPP', color: '#2563EB', active: true },
        { id: 'cloud-devops', title: 'Cloud Computing & DevOps', shortTitle: 'Cloud & DevOps', category: 'Cloud & Infrastructure', badge: '100% FREE • 1 MONTH', iconType: 'cloud', description: 'Deploy, automate, and orchestrate cloud infrastructure using AWS/Azure services, Docker containerization, and GitHub Actions CI/CD pipelines.', technologies: ['AWS / Cloud Services', 'Docker', 'Kubernetes Basics', 'GitHub Actions CI/CD', 'Linux'], skills: ['Containerization with Docker', 'CI/CD Pipeline Engineering', 'Cloud Storage & Hosting', 'Linux Command Line', 'Server Configuration'], project: 'Automated CI/CD Pipeline Deploying a Containerized Microservice to Cloud with SSL', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-CLDV', color: '#0284C7', active: true },
        { id: 'cybersecurity', title: 'Cybersecurity', shortTitle: 'Cybersecurity', category: 'Security & Systems', badge: '100% FREE • 1 MONTH', iconType: 'cybersecurity', description: 'Investigate system vulnerabilities, network security protocols, OWASP Top 10 vulnerabilities, ethical penetration testing, and digital defenses.', technologies: ['Wireshark', 'Nmap', 'Burp Suite', 'Linux Security', 'OWASP Top 10'], skills: ['Network Packet Analysis', 'Vulnerability Assessment', 'Web Application Security', 'Cryptographic Protocols', 'Incident Reporting'], project: 'Comprehensive Web Application Penetration Audit & Security Hardening Report', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-CYBR', color: '#DC2626', active: true },
        { id: 'android-app-dev', title: 'Android App Development', shortTitle: 'Android App Dev', category: 'Mobile Development', badge: '100% FREE • 1 MONTH', iconType: 'android', description: 'Develop native modern Android applications using Kotlin, Jetpack Compose, XML layouts, Room Database, and Material Design guidelines.', technologies: ['Kotlin', 'Android Studio', 'Jetpack Compose', 'Room DB', 'Retrofit'], skills: ['Activity & Fragment Lifecycle', 'Jetpack Compose UI', 'Local Data Persistence (Room)', 'REST API Network Calls', 'Android Architecture (MVVM)'], project: 'Smart Campus Productivity & Task Management Android App with Offline Sync', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-ANDR', color: '#22C55E', active: true },
        { id: 'flutter-app-dev', title: 'Flutter App Development', shortTitle: 'Flutter App Dev', category: 'Mobile Development', badge: '100% FREE • 1 MONTH', iconType: 'flutter', description: 'Create beautiful, natively compiled cross-platform applications for iOS and Android from a single codebase using Google Flutter & Dart.', technologies: ['Flutter SDK', 'Dart', 'Provider / Riverpod', 'Firebase', 'Material Widgets'], skills: ['Cross-Platform UI Engineering', 'State Management (Provider/Bloc)', 'REST API Integration', 'Local Storage', 'Responsive Screen Adaptations'], project: 'Cross-Platform Real-Time Social / Campus Discussion App with Firebase Backend', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-FLUT', color: '#0284C7', active: true },
        { id: 'ui-ux-design', title: 'UI/UX Design', shortTitle: 'UI/UX Design', category: 'Design & Experience', badge: '100% FREE • 1 MONTH', iconType: 'ui-ux', description: 'Conduct user research, design wireframes, high-fidelity prototypes, user journey flows, and component design systems using Figma.', technologies: ['Figma', 'FigJam', 'Design Systems', 'Wireframing', 'Prototyping'], skills: ['User Research & Personas', 'Wireframing & Information Architecture', 'Design Systems & Auto-Layout', 'Interactive Micro-Prototyping', 'Design Handoff'], project: 'Complete End-to-End Mobile App & Web Design Case Study with Interactive Prototype', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-UIUX', color: '#A855F7', active: true },
        { id: 'web-designing', title: 'Web Designing', shortTitle: 'Web Designing', category: 'Design & Experience', badge: '100% FREE • 1 MONTH', iconType: 'web-design', description: 'Design elegant, responsive, visual-first websites with CSS Grid, modern typography, SVG illustrations, CSS animations, and UI layouts.', technologies: ['HTML5', 'Modern CSS3', 'Tailwind CSS', 'Responsive Grid', 'SVG Graphics'], skills: ['Visual Hierarchy & Typography', 'Responsive CSS Grid & Flexbox', 'CSS Keyframe Animations', 'Color Theory & Brand Design', 'Web Accessibility (WCAG)'], project: 'Modern High-Converting Tech Startup Landing Page with Interactive Visual Sections', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-WDSG', color: '#F43F5E', active: true },
        { id: 'business-analytics', title: 'Business Analytics', shortTitle: 'Business Analytics', category: 'Business & Management', badge: '100% FREE • 1 MONTH', iconType: 'business-analytics', description: 'Bridge business strategy and quantitative data with financial modeling, customer metrics, cohort retention, and strategic business reporting.', technologies: ['Advanced Excel', 'Power BI / Tableau', 'SQL', 'Financial Modeling', 'KPI Metrics'], skills: ['Business Case Modeling', 'Cohort & Churn Analysis', 'Financial KPI Metrics', 'Executive Presentations', 'Market Research & Forecasting'], project: 'Strategic Business Growth & Revenue Optimization Model with Executive Dashboard', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-BSAN', color: '#14B8A6', active: true },
        { id: 'data-analysis-sql', title: 'Data Analysis with SQL', shortTitle: 'Data Analysis with SQL', category: 'AI & Data Science', badge: '100% FREE • 1 MONTH', iconType: 'sql-analysis', description: 'Master relational database querying, multi-table JOINs, subqueries, CTEs, window functions, and data aggregation for analytical reporting.', technologies: ['PostgreSQL / MySQL', 'Complex SQL Joins', 'Window Functions', 'CTEs', 'Data Aggregations'], skills: ['Relational Database Modeling', 'Complex Multi-Table Joins', 'Window Functions & Ranking', 'Common Table Expressions (CTEs)', 'Query Optimization'], project: 'Real-World E-Commerce & Customer Transaction Analytics Engine using Advanced SQL', duration: '1 Month', mode: 'Remote', isFree: true, code: 'PRMA-SQLA', color: '#6366F1', active: true }
      ];
      defaultDomains.forEach((d) => domainsStore.set(d.id, d));
      persistDomains();
      console.log(`[PRMA ROUTER] Initialized ${domainsStore.size} default domains.`);
    }
  };

  const persistDomains = () => {
    try {
      const arr = Array.from(domainsStore.values());
      fs.writeFileSync(DOMAINS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[PRMA ROUTER] Error persisting domains:', e.message);
    }
  };

  // Helper: Load & Persist Tasks
  const loadTasks = () => {
    try {
      if (fs.existsSync(TASKS_FILE)) {
        const raw = fs.readFileSync(TASKS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((t) => {
            if (t.id) tasksStore.set(t.id, t);
          });
        }
      }
    } catch (e) {
      console.warn('[PRMA ROUTER] Could not load tasks:', e.message);
    }
  };

  const persistTasks = () => {
    try {
      const arr = Array.from(tasksStore.values());
      fs.writeFileSync(TASKS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[PRMA ROUTER] Error persisting tasks:', e.message);
    }
  };

  // Helper: Load & Persist Careers Jobs
  const loadJobs = () => {
    try {
      if (fs.existsSync(JOBS_FILE)) {
        const raw = fs.readFileSync(JOBS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((j) => {
            if (j.id) jobsStore.set(j.id, j);
          });
          console.log(`[PRMA ROUTER] Loaded ${jobsStore.size} persistent job openings.`);
          return;
        }
      }
    } catch (e) {
      console.warn('[PRMA ROUTER] Could not load jobs:', e.message);
    }

    // Default real vacancies
    const DEFAULT_JOB_LIST = [
      {
        id: 'prma-job-swe-intern',
        title: 'Software Developer Intern',
        category: 'Engineering',
        type: 'Internship',
        location: 'Remote',
        experience: 'Fresher / Student (UG / PG)',
        stipend: 'Performance-based + Certificate',
        duration: '3 - 6 Months',
        shortDesc: 'Build and ship real-world features for consumer and enterprise SaaS products alongside senior engineers.',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Git'],
        responsibilities: [
          'Develop modern responsive frontend interfaces in React and Next.js',
          'Build performant REST and WebSocket APIs in Node.js / Express',
          'Write clean, maintainable, and modular code with unit tests',
          'Collaborate with UI/UX designers and participate in daily standups'
        ],
        requirements: [
          'Solid understanding of JavaScript / TypeScript fundamentals',
          'Familiarity with React components, state management, and hooks',
          'Basic knowledge of databases (MongoDB or PostgreSQL)',
          'Hunger to learn and solve real-world technical problems'
        ],
        active: true,
        postedAt: 'Active Opening',
        createdAt: new Date().toISOString()
      },
      {
        id: 'prma-job-uiux-intern',
        title: 'UI/UX Design Intern',
        category: 'Design',
        type: 'Internship',
        location: 'Remote',
        experience: 'Fresher / Student',
        stipend: 'Performance-based + Certificate',
        duration: '3 - 6 Months',
        shortDesc: 'Design intuitive, modern and user-friendly web and mobile experiences for PRMA platforms.',
        skills: ['Figma', 'UI Design', 'Prototyping', 'User Research', 'Design Systems'],
        responsibilities: [
          'Create high-fidelity wireframes, mockups, and clickable prototypes in Figma',
          'Conduct user research and translate feedback into UX enhancements',
          'Maintain and expand PRMA Tech brand design system tokens',
          'Coordinate closely with frontend developers during handoff'
        ],
        requirements: [
          'Proficiency in Figma (Auto-layout, Components, Variants)',
          'Eye for modern SaaS aesthetics, typography, and color harmony',
          'Portfolio showcasing at least 2 web or mobile UI/UX projects',
          'Understanding of responsive design principles'
        ],
        active: true,
        postedAt: 'Active Opening',
        createdAt: new Date().toISOString()
      },
      {
        id: 'prma-job-aiml-intern',
        title: 'AI/ML Intern',
        category: 'Engineering',
        type: 'Internship',
        location: 'Remote',
        experience: 'Fresher / Student',
        stipend: 'Performance-based + Certificate',
        duration: '3 - 6 Months',
        shortDesc: 'Work on machine learning models, natural language processing, vector retrieval, and real-world AI applications.',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'FastAPI', 'LLMs'],
        responsibilities: [
          'Cleanse, preprocess, and engineer features on tabular and image datasets',
          'Fine-tune open-source LLMs and implement RAG semantic search pipelines',
          'Evaluate model performance, loss metrics, and latency trade-offs',
          'Deploy inference microservices using FastAPI and Docker'
        ],
        requirements: [
          'Strong grasp of Python and scientific libraries (NumPy, Pandas, Scikit-Learn)',
          'Hands-on experience with PyTorch or TensorFlow',
          'Understanding of neural network architectures and transformer models',
          'Excitement for generative AI and LLM agents'
        ],
        active: true,
        postedAt: 'Active Opening',
        createdAt: new Date().toISOString()
      }
    ];

    DEFAULT_JOB_LIST.forEach(j => jobsStore.set(j.id, j));
    persistJobs();
  };

  const persistJobs = () => {
    try {
      const arr = Array.from(jobsStore.values());
      fs.writeFileSync(JOBS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[PRMA ROUTER] Error persisting jobs:', e.message);
    }
  };

  // Helper: Load & Persist Careers Applications
  const loadJobApplications = () => {
    try {
      if (fs.existsSync(JOB_APPS_FILE)) {
        const raw = fs.readFileSync(JOB_APPS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          jobApplicationsStore.length = 0;
          parsed.forEach(a => jobApplicationsStore.push(a));
        }
      }
    } catch (e) {
      console.warn('[PRMA ROUTER] Could not load job applications:', e.message);
    }
  };

  const persistJobApplications = () => {
    try {
      fs.writeFileSync(JOB_APPS_FILE, JSON.stringify(jobApplicationsStore, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[PRMA ROUTER] Error persisting job applications:', e.message);
    }
  };

  // Helper: Log Email
  const logEmail = (entry) => {
    emailLogsStore.unshift({
      id: 'EML_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      ...entry
    });
    try {
      fs.writeFileSync(EMAILS_FILE, JSON.stringify(emailLogsStore.slice(0, 500), null, 2), 'utf-8');
    } catch (e) {
      // ignore
    }
  };

  // Initialize data (Zero Fake Data Policy: strictly genuine store)
  loadApplications();
  loadDomains();
  loadTasks();
  loadJobs();
  loadJobApplications();
  loadSubmissions();

  // Populate sample task if empty
  if (tasksStore.size === 0) {
    const tId = 'TASK_101';
    tasksStore.set(tId, {
      id: tId,
      domainId: 'ai-ml',
      domainTitle: 'Artificial Intelligence & Machine Learning',
      title: 'Milestone 1: Exploratory Analysis & Dataset Architecture',
      description: 'Download the project dataset, perform exploratory data analysis (EDA), engineer missing features, and construct a baseline data processing pipeline.',
      deadline: '7 Days from Joining Date',
      resources: '1. Pandas & NumPy Documentation\n2. Scikit-learn Feature Engineering Guide\n3. Google Colab / Jupyter Environment',
      submissionInstructions: 'Push your Colab/Jupyter notebook to a public GitHub repository and email the repo link to support@prmatech.com.',
      createdAt: new Date().toISOString()
    });
    persistTasks();
  }

  /**
   * Health Check
   */
  router.get('/health', (req, res) => {
    res.json({
      status: 'active',
      service: 'PRMA Tech Official Internship Controller API',
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Public: List all active domains
   */
  router.get('/domains', (req, res) => {
    const list = Array.from(domainsStore.values());
    res.json({
      success: true,
      count: list.length,
      domains: list
    });
  });

  /**
   * Admin: Add new domain
   */
  router.post('/domains', (req, res) => {
    try {
      const { title, shortTitle, category, description, technologies, skills, project, iconType, color } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      const id = (title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4));
      const newDomain = {
        id,
        title,
        shortTitle: shortTitle || title,
        category: category || 'Technology',
        badge: '100% FREE • 1 MONTH',
        iconType: iconType || 'frontend',
        description,
        technologies: Array.isArray(technologies) ? technologies : (technologies || '').split(',').map(s => s.trim()).filter(Boolean),
        skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()).filter(Boolean),
        project: project || 'Capstone Real-World Project',
        duration: '1 Month',
        mode: 'Remote',
        isFree: true,
        code: 'PRMA-' + id.slice(0, 4).toUpperCase(),
        color: color || '#3B82F6',
        active: true,
        createdAt: new Date().toISOString()
      };

      domainsStore.set(id, newDomain);
      persistDomains();

      res.status(201).json({ success: true, domain: newDomain });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create domain', details: err.message });
    }
  });

  /**
   * Admin: Edit domain
   */
  router.put('/domains/:id', (req, res) => {
    const id = req.params.id;
    const existing = domainsStore.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const updated = { ...existing, ...req.body, id };
    domainsStore.set(id, updated);
    persistDomains();

    res.json({ success: true, domain: updated });
  });

  /**
   * Admin: Toggle Domain Active/Inactive
   */
  router.delete('/domains/:id', (req, res) => {
    const id = req.params.id;
    const existing = domainsStore.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    existing.active = !existing.active;
    domainsStore.set(id, existing);
    persistDomains();

    res.json({ success: true, active: existing.active, domain: existing });
  });

  /**
   * Public: List 9 Showcase Goodies
   */
  router.get('/goodies', (req, res) => {
    res.json({
      success: true,
      count: SHOWCASE_GOODIES.length,
      goodies: SHOWCASE_GOODIES
    });
  });

  /**
   * Helper: Resolve Domain ID and Title from parameters or store
   */
  const resolveDomainId = (id, title) => {
    if (id && typeof id === 'string' && id.trim()) {
      return id.trim().toLowerCase();
    }
    if (title && typeof title === 'string' && title.trim()) {
      const norm = title.trim().toLowerCase();
      for (const d of domainsStore.values()) {
        if ((d.title && d.title.toLowerCase() === norm) || (d.shortTitle && d.shortTitle.toLowerCase() === norm)) {
          return d.id;
        }
      }
    }
    return '';
  };

  const resolveDomainTitle = (id, title) => {
    if (title && typeof title === 'string' && title.trim()) {
      return title.trim();
    }
    if (id && typeof id === 'string' && id.trim()) {
      const d = domainsStore.get(id.trim().toLowerCase());
      if (d && d.title) return d.title;
    }
    return 'General Technology Track';
  };

  /**
   * Public: Query Application Duplicate Status Before Submission
   */
  router.get('/applications/check-duplicate', async (req, res) => {
    try {
      await ensureMongoConnected();
      const rawEmail = req.query.email;
      const rawDomainId = req.query.domainId;
      const rawDomainTitle = req.query.domainTitle;

      if (!rawEmail) {
        return res.status(400).json({ error: 'Email query parameter is required.' });
      }

      const normalizedEmail = String(rawEmail).trim().toLowerCase();
      const targetDomainId = resolveDomainId(rawDomainId, rawDomainTitle);
      const targetDomainTitle = resolveDomainTitle(rawDomainId, rawDomainTitle);
      const normTitle = targetDomainTitle.toLowerCase();

      let studentApps = [];
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        studentApps = await PrmaApplicationModel.find({
          'student.email': new RegExp('^' + normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
        }).lean();
      }

      const isMatch = (app) => {
        const appDomId = (app.technical?.domainId || app.domain?.id || '').trim().toLowerCase();
        const appDomTitle = (app.technical?.domainTitle || app.domain?.title || '').trim().toLowerCase();
        if (targetDomainId && appDomId && targetDomainId === appDomId) return true;
        if (normTitle && appDomTitle && normTitle === appDomTitle) return true;
        return false;
      };

      let existing = studentApps.find(isMatch);
      if (!existing) {
        for (const a of applicationsStore.values()) {
          const aEmail = (a.student?.email || '').trim().toLowerCase();
          if (aEmail === normalizedEmail && isMatch(a)) {
            existing = a;
            break;
          }
        }
      }

      if (existing) {
        return res.json({
          isDuplicate: true,
          message: `Application already exists for ${existing.technical?.domainTitle || targetDomainTitle}`,
          existingApplication: {
            applicationId: existing.applicationId,
            offerId: existing.offerId || null,
            status: existing.status || 'submitted',
            domainTitle: existing.technical?.domainTitle || targetDomainTitle,
            submittedAt: existing.createdAt || null
          }
        });
      }

      return res.json({
        isDuplicate: false,
        message: 'No existing application for this domain. Eligible to apply.'
      });
    } catch (err) {
      res.status(500).json({ error: 'Duplicate check failed', details: err.message });
    }
  });

  /**
   * Submit Internship Application (100% Free • Strict Validation)
   */
  router.post('/applications', async (req, res) => {
    try {
      await ensureMongoConnected();

      const {
        student,
        academic,
        technical,
        profiles,
        resume,
        socialFollow,
        declaration
      } = req.body;

      // 1. Validate Personal Information
      if (!student?.fullName || !student?.email || !student?.mobile || !student?.dob) {
        return res.status(400).json({ error: 'Personal information is incomplete (Full Name, DOB, Email, and Mobile are mandatory).' });
      }

      // 2. Validate Academic Information
      if (!academic?.college || !academic?.university || !academic?.course || !academic?.year) {
        return res.status(400).json({ error: 'Academic information is incomplete (College, University, Course, and Year are mandatory).' });
      }

      // 3. Validate Technical Domain
      if (!technical?.domainTitle && !technical?.domainId) {
        return res.status(400).json({ error: 'Internship domain selection is compulsory.' });
      }

      // 4. Validate Profiles (Mandatory GitHub & LinkedIn URLs)
      if (!profiles?.githubUrl || !profiles?.linkedinUrl) {
        return res.status(400).json({ error: 'Both GitHub Profile URL and LinkedIn Profile URL are mandatory.' });
      }

      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?.*$/i;
      const linkedinRegex = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_%-]+\/?.*$/i;

      if (!githubRegex.test(profiles.githubUrl.trim())) {
        return res.status(400).json({ error: 'Please enter a valid GitHub profile URL (e.g. https://github.com/username).' });
      }

      if (!linkedinRegex.test(profiles.linkedinUrl.trim())) {
        return res.status(400).json({ error: 'Please enter a valid LinkedIn profile URL (e.g. https://www.linkedin.com/in/username).' });
      }

      // 5. Validate Resume Upload (Compulsory PDF < 5MB)
      if (!resume || !resume.fileName) {
        return res.status(400).json({ error: 'Resume upload is compulsory. Please attach your resume in PDF format.' });
      }

      if (!resume.fileName.toLowerCase().endsWith('.pdf')) {
        return res.status(400).json({ error: 'Resume must be in PDF format only.' });
      }

      // 6. Validate Social Media Follow Confirmation & Mandatory Screenshots
      if (!socialFollow?.followedLinkedIn || !socialFollow?.followedInstagram) {
        return res.status(400).json({ error: 'Please confirm that you have followed both PRMA Tech on LinkedIn and Instagram before submitting.' });
      }

      const linkedinScreen = socialFollow?.linkedinScreenshot?.dataUrl || req.body.linkedinScreenshotUrl || socialFollow?.linkedinScreenshot;
      const instagramScreen = socialFollow?.instagramScreenshot?.dataUrl || req.body.instagramScreenshotUrl || socialFollow?.instagramScreenshot;

      if (!linkedinScreen) {
        return res.status(400).json({ error: 'LinkedIn follow screenshot is compulsory. Please upload a screenshot verifying that you followed PRMA Tech on LinkedIn.' });
      }
      if (!instagramScreen) {
        return res.status(400).json({ error: 'Instagram follow screenshot is compulsory. Please upload a screenshot verifying that you followed PRMA Tech on Instagram.' });
      }

      // 7. Validate Declaration
      if (!declaration?.confirmedAccuracy) {
        return res.status(400).json({ error: 'Please confirm the accuracy declaration before submitting.' });
      }

      // 8. Prevent duplicate application for the SAME domain (same student email & domain)
      const studentEmail = student.email.trim().toLowerCase();
      const targetDomainId = resolveDomainId(technical.domainId, technical.domainTitle);
      const targetDomainTitle = resolveDomainTitle(technical.domainId, technical.domainTitle);
      const normTitle = targetDomainTitle.toLowerCase();

      let existing = null;
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
          const studentApps = await PrmaApplicationModel.find({
            'student.email': new RegExp('^' + studentEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
          }).lean();

          if (Array.isArray(studentApps) && studentApps.length > 0) {
            existing = studentApps.find(app => {
              const appDomId = (app.technical?.domainId || app.domain?.id || '').trim().toLowerCase();
              const appDomTitle = (app.technical?.domainTitle || app.domain?.title || '').trim().toLowerCase();
              if (targetDomainId && appDomId && targetDomainId === appDomId) return true;
              if (normTitle && appDomTitle && normTitle === appDomTitle) return true;
              return false;
            });
          }
        } catch (e) {
          console.warn('[PRMA ROUTER] Duplicate check DB error:', e.message);
        }
      }

      if (!existing) {
        for (const a of applicationsStore.values()) {
          const existingEmail = (a.student?.email || '').trim().toLowerCase();
          if (existingEmail === studentEmail) {
            const appDomId = (a.technical?.domainId || a.domain?.id || '').trim().toLowerCase();
            const appDomTitle = (a.technical?.domainTitle || a.domain?.title || '').trim().toLowerCase();
            if ((targetDomainId && appDomId && targetDomainId === appDomId) ||
                (normTitle && appDomTitle && normTitle === appDomTitle)) {
              existing = a;
              break;
            }
          }
        }
      }

      if (existing) {
        return res.status(409).json({
          success: false,
          isDuplicate: true,
          error: `An application for "${existing.technical?.domainTitle || targetDomainTitle}" has already been submitted with this email address.`,
          message: `You have already applied for ${existing.technical?.domainTitle || targetDomainTitle}. Your application status is currently: ${existing.status || 'submitted'}.`,
          existingApplication: {
            applicationId: existing.applicationId,
            offerId: existing.offerId || null,
            status: existing.status || 'submitted',
            domainId: existing.technical?.domainId || targetDomainId,
            domainTitle: existing.technical?.domainTitle || targetDomainTitle,
            studentName: existing.student?.fullName || student.fullName,
            email: existing.student?.email || studentEmail,
            submittedAt: existing.createdAt || null
          }
        });
      }

      // Generate Unique Application ID: PRMA-YYYY-XXXXXX
      const year = new Date().getFullYear();
      const rand = Math.floor(100000 + Math.random() * 900000);
      const appId = `PRMA-${year}-${rand}`;

      const newApplication = {
        applicationId: appId,
        student: {
          fullName: student.fullName.trim(),
          dob: student.dob,
          email: student.email.trim().toLowerCase(),
          mobile: student.mobile.trim(),
          whatsapp: (student.whatsapp || student.mobile || '').trim(),
          gender: student.gender || 'Not Specified',
          address: (student.address || '').trim(),
          city: (student.city || '').trim(),
          state: (student.state || '').trim(),
          pinCode: (student.pinCode || '').trim()
        },
        academic: {
          college: academic.college.trim(),
          university: academic.university.trim(),
          course: academic.course.trim(),
          branch: (academic.branch || '').trim(),
          year: academic.year.trim(),
          semester: academic.semester || '',
          graduationYear: academic.graduationYear || ''
        },
        technical: {
          domainId: targetDomainId || 'general',
          domainTitle: targetDomainTitle,
          skills: Array.isArray(technical.skills) ? technical.skills : (technical.skills || '').split(',').map(s => s.trim()).filter(Boolean),
          languages: Array.isArray(technical.languages) ? technical.languages : (technical.languages || '').split(',').map(s => s.trim()).filter(Boolean),
          experience: (technical.experience || '').trim(),
          experienceLevel: technical.experienceLevel || 'Beginner'
        },
        profiles: {
          githubUrl: profiles.githubUrl.trim(),
          linkedinUrl: profiles.linkedinUrl.trim()
        },
        resume: {
          fileName: resume.fileName,
          fileSize: resume.fileSize || 0,
          dataUrl: resume.dataUrl || '' // secure base64 string
        },
        socialFollow: {
          followedLinkedIn: true,
          followedInstagram: true,
          linkedinScreenshot: linkedinScreen,
          instagramScreenshot: instagramScreen,
          linkedinScreenshotName: socialFollow?.linkedinScreenshot?.fileName || 'linkedin_follow_proof.png',
          instagramScreenshotName: socialFollow?.instagramScreenshot?.fileName || 'instagram_follow_proof.png'
        },
        linkedinScreenshotUrl: `/api/prma/admin/applications/${appId}/screenshot/linkedin`,
        instagramScreenshotUrl: `/api/prma/admin/applications/${appId}/screenshot/instagram`,
        duration: req.body.duration || req.body.internship?.duration || '1 Month',
        preferredStartDate: req.body.preferredStartDate || req.body.internship?.preferredStartDate || 'Immediate',
        mode: 'Remote',
        fee: '₹0 (100% Free)',
        status: 'submitted',
        createdAt: new Date().toISOString()
      };

      applicationsStore.set(appId, newApplication);
      await persistApplications(newApplication);

      // Return Confirmation Payload (Requirement 3)
      res.status(201).json({
        success: true,
        message: 'Application Submitted Successfully!',
        applicationId: appId,
        selectedDomain: newApplication.technical.domainTitle,
        registeredEmail: newApplication.student.email,
        studentName: newApplication.student.fullName,
        submissionDate: new Date().toLocaleDateString('en-GB'),
        status: 'Submitted — Under Review'
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Application submission error:', err);
      res.status(500).json({ error: 'Failed to process application', details: err.message });
    }
  });

  /**
   * Public: Student Application Status Tracking (By App ID, Offer ID, or Email)
   */
  router.get('/applications/status/:identifier', async (req, res) => {
    try {
      const rawParam = decodeURIComponent(req.params.identifier).trim();
      let found = await getApplication(rawParam);

      if (!found) {
        // Also check by mobile number if applicable
        const cleanPhone = rawParam.replace(/\D/g, '');
        if (cleanPhone.length >= 7) {
          await ensureMongoConnected();
          if (mongoose.connection && mongoose.connection.readyState === 1) {
            found = await PrmaApplicationModel.findOne({
              'student.mobile': { $regex: cleanPhone }
            }).lean();
          }
          if (!found) {
            for (const app of applicationsStore.values()) {
              if (app.student?.mobile && app.student.mobile.replace(/\D/g, '').includes(cleanPhone)) {
                found = app;
                break;
              }
            }
          }
        }
      }

      if (!found) {
        return res.status(404).json({
          success: false,
          error: `No application found for "${rawParam}". Please check your Application ID or registered email.`
        });
      }

      res.json({
        success: true,
        application: {
          applicationId: found.applicationId,
          offerId: found.offerId,
          status: found.status,
          student: {
            fullName: found.student?.fullName,
            email: found.student?.email,
            mobile: found.student?.mobile,
            college: found.academic?.college || found.student?.college,
            course: found.academic?.course || found.student?.course,
            branch: found.academic?.branch || found.student?.branch,
            year: found.academic?.year
          },
          technical: {
            domainId: found.technical?.domainId || found.domain?.id,
            domainTitle: found.technical?.domainTitle || found.domain?.title,
            skills: found.technical?.skills || []
          },
          domain: {
            id: found.technical?.domainId || found.domain?.id,
            title: found.technical?.domainTitle || found.domain?.title
          },
          duration: found.duration || '1 Month',
          mode: found.mode || 'Remote',
          fee: found.fee || '₹0 (100% Free)',
          createdAt: found.createdAt,
          joiningDate: found.joiningDate,
          completionDate: found.completionDate,
          shortlistedAt: found.shortlistedAt,
          rejectedAt: found.rejectedAt,
          adminRemarks: found.adminRemarks
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to look up application status', details: err.message });
    }
  });

  /**
   * Admin: List Applications with Search & Filters (Authoritative MongoDB Atlas)
   */
  router.get('/admin/applications', async (req, res) => {
    try {
      await ensureMongoConnected();

      let list = [];
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        list = await PrmaApplicationModel.find({}).sort({ createdAt: -1 }).lean();
        list.forEach(app => {
          if (app.applicationId) applicationsStore.set(app.applicationId, app);
        });
      } else {
        if (applicationsStore.size === 0) {
          await loadApplications();
        }
        list = Array.from(applicationsStore.values()).reverse();
      }

      const { status, domain, college, university, search } = req.query;

      if (status && status !== 'all') {
        const norm = status.toLowerCase();
        if (norm === 'submitted' || norm === 'pending') {
          list = list.filter(a => a.status === 'submitted' || a.status === 'pending');
        } else if (norm === 'shortlisted' || norm === 'approved') {
          list = list.filter(a => a.status === 'shortlisted' || a.status === 'approved');
        } else {
          list = list.filter(a => a.status === status);
        }
      }
      if (domain && domain !== 'all') {
        list = list.filter(a => a.technical?.domainTitle === domain || a.technical?.domainId === domain);
      }
      if (college && college !== 'all') {
        list = list.filter(a => (a.academic?.college || '').toLowerCase().includes(college.toLowerCase()));
      }
      if (university && university !== 'all') {
        list = list.filter(a => (a.academic?.university || '').toLowerCase().includes(university.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(a =>
          (a.student?.fullName || '').toLowerCase().includes(q) ||
          (a.student?.email || '').toLowerCase().includes(q) ||
          (a.student?.mobile || '').includes(q) ||
          (a.applicationId || '').toLowerCase().includes(q) ||
          (a.offerId || '').toLowerCase().includes(q) ||
          (a.academic?.college || '').toLowerCase().includes(q)
        );
      }

      res.json({
        success: true,
        count: list.length,
        applications: list
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve applications', details: err.message });
    }
  });

  /**
   * Admin: Application Details Dossier
   */
  router.get('/admin/applications/:id', async (req, res) => {
    try {
      const appId = req.params.id;
      const found = await getApplication(appId);

      if (!found) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json({ success: true, application: found });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching application', details: err.message });
    }
  });

  /**
   * Admin: Download Candidate Resume
   */
  router.get('/admin/applications/:id/resume', async (req, res) => {
    try {
      const appId = req.params.id;
      const record = await getApplication(appId);

      if (!record || !record.resume) {
        return res.status(404).send('Resume file not found');
      }

      if (record.resume.dataUrl && record.resume.dataUrl.startsWith('data:application/pdf;base64,')) {
        const base64Data = record.resume.dataUrl.replace(/^data:application\/pdf;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${record.resume.fileName || 'Resume.pdf'}"`);
        return res.end(buffer);
      }

      res.status(404).send('Resume content unavailable');
    } catch (err) {
      res.status(500).send('Error streaming resume: ' + err.message);
    }
  });

  /**
   * Admin: View / Download Social Follow Screenshot (LinkedIn / Instagram)
   */
  router.get('/admin/applications/:id/screenshot/:platform', async (req, res) => {
    try {
      const { id, platform } = req.params;
      const record = await getApplication(id);
      if (!record) return res.status(404).send('Application not found');

      const screenshotData = platform === 'linkedin'
        ? (record.socialFollow?.linkedinScreenshot || record.linkedinScreenshotUrl)
        : (record.socialFollow?.instagramScreenshot || record.instagramScreenshotUrl);

      if (!screenshotData) return res.status(404).send('Screenshot proof not found');

      if (typeof screenshotData === 'string' && screenshotData.startsWith('data:image/')) {
        const matches = screenshotData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Content-Disposition', `inline; filename="${platform}_follow_proof.png"`);
          return res.end(buffer);
        }
      }
      res.status(404).send('Invalid or corrupt screenshot format');
    } catch (err) {
      res.status(500).send('Error streaming screenshot: ' + err.message);
    }
  });

  /**
   * Admin: Shortlist / Approve Student (Generates Vector PDF & Sends Email)
   */
  router.post('/admin/applications/:id/shortlist', async (req, res) => {
    try {
      const appId = req.params.id;
      let record = await getApplication(appId);

      if (!record) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Check if already shortlisted to prevent duplicate emails (Idempotency)
      if ((record.status === 'shortlisted' || record.status === 'approved') && !req.body.forceResend && !req.body.forceRegenerate) {
        return res.json({
          success: true,
          alreadyShortlisted: true,
          message: 'Student is already approved and onboarded.',
          offerId: record.offerId,
          application: record
        });
      }

      // Generate or reuse Offer ID
      const offerId = record.offerId || `PRMA/INT/A1/${Math.floor(10000 + Math.random() * 90000)}`;

      // Calculate Dates
      const joiningDateInput = req.body.joiningDate;
      let joinDateStr;
      if (joiningDateInput) {
        joinDateStr = joiningDateInput;
      } else {
        const nextWeek = new Date(Date.now() + 7 * 86400000);
        const day = String(nextWeek.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        joinDateStr = `${day}-${months[nextWeek.getMonth()]}-${nextWeek.getFullYear()}`;
      }

      // Completion is 1 month later
      const compDate = new Date(Date.now() + 37 * 86400000);
      const cDay = String(compDate.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const completionDateStr = `${cDay}-${months[compDate.getMonth()]}-${compDate.getFullYear()}`;

      const todayStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      const studentName = record.student?.fullName || 'Candidate';
      const domainTitle = record.technical?.domainTitle || record.domain?.title || 'Technology Track';

      const verificationUrl = `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;

      // Generate or retrieve unique secure Submission Token & URLs
      const submissionToken = record.submissionToken || `prma_sub_${crypto.randomBytes(18).toString('hex')}`;
      const baseUrl = process.env.APP_BASE_URL || 'https://professorvirus.site';
      const submissionUrl = `${baseUrl}/prma-tech/submit/${submissionToken}`;

      // STEP 4: Generate student-specific Google Form submission URL
      const googleFormUrl = generateStudentGoogleFormUrl({
        applicationId: record.applicationId,
        offerId,
        student: record.student,
        academic: record.academic,
        technical: record.technical
      }, currentGformConfig);

      // 1. Generate DELIVERABLE 1 - Official Joining Letter PDF
      let joiningLetterPdfBuffer = null;
      try {
        joiningLetterPdfBuffer = await generatePrmaOfferLetterPdf({
          studentName,
          fatherName: record.student?.fatherName || '',
          domainTitle,
          offerId,
          issueDate: todayStr,
          joiningDate: joinDateStr,
          completionDate: completionDateStr,
          duration: '1 Month',
          mode: 'Fully Remote',
          verificationUrl
        });
        pdfCacheStore.set(offerId, joiningLetterPdfBuffer);
        pdfCacheStore.set(record.applicationId, joiningLetterPdfBuffer);
      } catch (pdfErr) {
        console.error('[PRMA ROUTER] Joining Letter PDF generation error:', pdfErr);
      }

      // 2. Generate DELIVERABLE 2 - Official Problem Statement 10-page PDF
      let problemStatementPdfBuffer = null;
      try {
        problemStatementPdfBuffer = await generatePrmaProblemStatementPdf({
          studentName,
          offerId,
          domainTitle,
          domainId: record.technical?.domainId || 'ai-ml',
          joiningDate: joinDateStr,
          completionDate: completionDateStr,
          submissionToken,
          submissionUrl: googleFormUrl || submissionUrl
        });
        pdfCacheStore.set(`ps_${offerId}`, problemStatementPdfBuffer);
        pdfCacheStore.set(`ps_${record.applicationId}`, problemStatementPdfBuffer);
      } catch (psErr) {
        console.error('[PRMA ROUTER] Problem Statement PDF generation error:', psErr);
      }

      // 3. Initialize or retrieve PrmaSubmission record
      let submissionRecord = await getSubmissionByToken(submissionToken);
      if (!submissionRecord) {
        submissionRecord = {
          submissionId: `SUB-${offerId.replace(/[^a-zA-Z0-9]/g, '')}`,
          applicationId: record.applicationId,
          offerId,
          submissionToken,
          student: {
            fullName: studentName,
            email: record.student?.email || '',
            mobile: record.student?.mobile || '',
            college: record.academic?.college || '',
            branch: record.academic?.branch || '',
            fatherName: record.student?.fatherName || ''
          },
          technical: {
            domainId: record.technical?.domainId || 'ai-ml',
            domainTitle
          },
          joiningDate: joinDateStr,
          completionDate: completionDateStr,
          duration: '1 Month',
          mode: 'Fully Remote',
          tasks: initializeWeeklyTasks(record.technical?.domainId || 'ai-ml'),
          overallProgress: 0,
          completedWeeksCount: 0,
          lastSubmissionDate: '',
          status: 'active'
        };
        submissionsStore.set(submissionRecord.submissionId, submissionRecord);
        submissionsStore.set(submissionToken, submissionRecord);
        await persistSubmissions(submissionRecord);
      }

      // 4. Dispatch Corporate Approval Email with both PDFs and Google Form URL
      let emailResult = { success: false, reason: 'PDF generation failed' };
      if (joiningLetterPdfBuffer && record.student?.email) {
        try {
          emailResult = await sendPrmaApprovalEmail({
            toEmail: record.student.email,
            studentName,
            domainTitle,
            offerId,
            applicationId: record.applicationId,
            joiningDate: joinDateStr,
            completionDate: completionDateStr,
            duration: '1 Month',
            mode: 'Fully Remote',
            submissionUrl,
            googleFormUrl,
            joiningLetterPdfBuffer,
            problemStatementPdfBuffer
          });

          logEmail({
            type: 'OFFICIAL_APPROVAL_ONBOARDING',
            recipient: record.student.email,
            studentName,
            domainTitle,
            offerId,
            status: emailResult.success ? 'Delivered' : 'Failed',
            details: emailResult
          });
        } catch (mailErr) {
          console.error('[PRMA ROUTER] Email send error:', mailErr);
          emailResult = { success: false, error: mailErr.message };
        }
      }

      // 5. Update application state
      record.status = 'shortlisted';
      record.offerId = offerId;
      record.submissionToken = submissionToken;
      record.submissionUrl = submissionUrl;
      record.googleFormUrl = googleFormUrl;
      record.joiningLetterPdfRef = `/api/prma/admin/applications/${record.applicationId}/joining-letter`;
      record.problemStatementPdfRef = `/api/prma/admin/applications/${record.applicationId}/problem-statement`;
      record.joiningDate = joinDateStr;
      record.completionDate = completionDateStr;
      record.shortlistedAt = new Date().toISOString();
      record.approvalTimestamp = new Date().toISOString();
      record.emailDispatchStatus = emailResult.success ? 'Sent' : 'Failed';
      record.emailMessageId = emailResult.messageId || `MSG-${offerId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
      record.emailLastAttempt = new Date().toISOString();
      record.emailFailureReason = emailResult.success ? '' : (emailResult.error || 'SMTP delivery failure');
      record.adminRemarks = req.body.adminRemarks || record.adminRemarks || 'Profile approved for 1-month virtual cohort.';

      applicationsStore.set(record.applicationId, record);
      await persistApplications(record);

      res.json({
        success: true,
        message: `Student approved successfully! Offer ID: ${offerId}`,
        offerId,
        submissionToken,
        submissionUrl,
        googleFormUrl,
        joiningDate: joinDateStr,
        emailSent: emailResult.success,
        emailDetails: emailResult,
        application: record
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Shortlist error:', err);
      res.status(500).json({ error: 'Shortlist processing failed', details: err.message });
    }
  });

  /**
   * Admin: Resend Joining Email (Section 7)
   */
  router.post('/admin/applications/:id/resend-email', async (req, res) => {
    try {
      const appId = req.params.id;
      const record = await getApplication(appId);
      if (!record) return res.status(404).json({ error: 'Application not found' });
      if (!record.offerId) return res.status(400).json({ error: 'Application has not been approved yet. Approve first.' });

      const studentName = record.student?.fullName || 'Candidate';
      const domainTitle = record.technical?.domainTitle || record.domain?.title || 'Technology Track';
      const offerId = record.offerId;
      const joinDateStr = record.joiningDate || new Date().toISOString().slice(0, 10);
      const completionDateStr = record.completionDate || '';

      const verificationUrl = `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;
      const submissionToken = record.submissionToken || `prma_sub_${crypto.randomBytes(18).toString('hex')}`;
      const baseUrl = process.env.APP_BASE_URL || 'https://professorvirus.site';
      const submissionUrl = record.submissionUrl || `${baseUrl}/prma-tech/submit/${submissionToken}`;
      const googleFormUrl = record.googleFormUrl || generateStudentGoogleFormUrl(record, currentGformConfig);

      // Retrieve cached or regenerate Joining Letter PDF
      let joiningLetterPdfBuffer = pdfCacheStore.get(offerId) || pdfCacheStore.get(record.applicationId);
      if (!joiningLetterPdfBuffer) {
        joiningLetterPdfBuffer = await generatePrmaOfferLetterPdf({
          studentName,
          fatherName: record.student?.fatherName || '',
          domainTitle,
          offerId,
          issueDate: record.shortlistedAt ? new Date(record.shortlistedAt).toLocaleDateString('en-GB').replace(/\//g, '-') : '',
          joiningDate: joinDateStr,
          completionDate: completionDateStr,
          duration: '1 Month',
          mode: 'Fully Remote',
          verificationUrl
        });
        pdfCacheStore.set(offerId, joiningLetterPdfBuffer);
      }

      // Retrieve cached or regenerate Problem Statement PDF
      let problemStatementPdfBuffer = pdfCacheStore.get(`ps_${offerId}`) || pdfCacheStore.get(`ps_${record.applicationId}`);
      if (!problemStatementPdfBuffer) {
        problemStatementPdfBuffer = await generatePrmaProblemStatementPdf({
          studentName,
          offerId,
          domainTitle,
          domainId: record.technical?.domainId || 'ai-ml',
          joiningDate: joinDateStr,
          completionDate: completionDateStr,
          submissionToken,
          submissionUrl: googleFormUrl || submissionUrl
        });
        pdfCacheStore.set(`ps_${offerId}`, problemStatementPdfBuffer);
      }

      let emailResult = { success: false };
      try {
        emailResult = await sendPrmaApprovalEmail({
          toEmail: record.student.email,
          studentName,
          domainTitle,
          offerId,
          applicationId: record.applicationId,
          joiningDate: joinDateStr,
          completionDate: completionDateStr,
          duration: '1 Month',
          mode: 'Fully Remote',
          submissionUrl,
          googleFormUrl,
          joiningLetterPdfBuffer,
          problemStatementPdfBuffer
        });

        logEmail({
          type: 'OFFICIAL_APPROVAL_RESEND',
          recipient: record.student.email,
          studentName,
          domainTitle,
          offerId,
          status: emailResult.success ? 'Delivered' : 'Failed',
          details: emailResult
        });
      } catch (err) {
        emailResult = { success: false, error: err.message };
      }

      record.emailDispatchStatus = emailResult.success ? 'Sent' : 'Failed';
      record.emailMessageId = emailResult.messageId || record.emailMessageId || `MSG-${offerId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
      record.emailLastAttempt = new Date().toISOString();
      record.emailFailureReason = emailResult.success ? '' : (emailResult.error || 'Resend delivery failure');

      applicationsStore.set(record.applicationId, record);
      await persistApplications(record);

      res.json({
        success: emailResult.success,
        message: emailResult.success ? 'Joining email resent successfully!' : `Failed to resend: ${emailResult.error || 'SMTP Error'}`,
        emailDetails: emailResult,
        application: record
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Resend email error:', err);
      res.status(500).json({ error: 'Resend email failed', details: err.message });
    }
  });

  /**
   * Admin: Regenerate Joining Letter PDF (Section 7)
   */
  router.post('/admin/applications/:id/regenerate-letter', async (req, res) => {
    try {
      const appId = req.params.id;
      const record = await getApplication(appId);
      if (!record) return res.status(404).json({ error: 'Application not found' });
      if (!record.offerId) return res.status(400).json({ error: 'Application must be approved first.' });

      const studentName = record.student?.fullName || 'Candidate';
      const domainTitle = record.technical?.domainTitle || record.domain?.title || 'Technology Track';
      const offerId = record.offerId;
      const joinDateStr = record.joiningDate || new Date().toISOString().slice(0, 10);
      const completionDateStr = record.completionDate || '';
      const verificationUrl = `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;

      const joiningLetterPdfBuffer = await generatePrmaOfferLetterPdf({
        studentName,
        fatherName: record.student?.fatherName || '',
        domainTitle,
        offerId,
        issueDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        joiningDate: joinDateStr,
        completionDate: completionDateStr,
        duration: '1 Month',
        mode: 'Fully Remote',
        verificationUrl
      });

      pdfCacheStore.set(offerId, joiningLetterPdfBuffer);
      pdfCacheStore.set(record.applicationId, joiningLetterPdfBuffer);

      record.joiningLetterPdfRef = `/api/prma/admin/applications/${record.applicationId}/joining-letter`;
      applicationsStore.set(record.applicationId, record);
      await persistApplications(record);

      res.json({
        success: true,
        message: 'Official Joining Letter regenerated successfully!',
        bytes: joiningLetterPdfBuffer.length,
        downloadUrl: record.joiningLetterPdfRef
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Regenerate letter error:', err);
      res.status(500).json({ error: 'Regeneration failed', details: err.message });
    }
  });

  /**
   * Admin: Regenerate Problem Statement PDF (Section 7)
   */
  router.post('/admin/applications/:id/regenerate-problem-statement', async (req, res) => {
    try {
      const appId = req.params.id;
      const record = await getApplication(appId);
      if (!record) return res.status(404).json({ error: 'Application not found' });
      if (!record.offerId) return res.status(400).json({ error: 'Application must be approved first.' });

      const studentName = record.student?.fullName || 'Candidate';
      const domainTitle = record.technical?.domainTitle || record.domain?.title || 'Technology Track';
      const offerId = record.offerId;
      const joinDateStr = record.joiningDate || new Date().toISOString().slice(0, 10);
      const completionDateStr = record.completionDate || '';
      const submissionToken = record.submissionToken || `prma_sub_${crypto.randomBytes(18).toString('hex')}`;
      const googleFormUrl = record.googleFormUrl || generateStudentGoogleFormUrl(record, currentGformConfig);

      const problemStatementPdfBuffer = await generatePrmaProblemStatementPdf({
        studentName,
        offerId,
        domainTitle,
        domainId: record.technical?.domainId || 'ai-ml',
        joiningDate: joinDateStr,
        completionDate: completionDateStr,
        submissionToken,
        submissionUrl: googleFormUrl || record.submissionUrl
      });

      pdfCacheStore.set(`ps_${offerId}`, problemStatementPdfBuffer);
      pdfCacheStore.set(`ps_${record.applicationId}`, problemStatementPdfBuffer);

      record.problemStatementPdfRef = `/api/prma/admin/applications/${record.applicationId}/problem-statement`;
      applicationsStore.set(record.applicationId, record);
      await persistApplications(record);

      res.json({
        success: true,
        message: '10-Page Problem Statement regenerated successfully!',
        bytes: problemStatementPdfBuffer.length,
        downloadUrl: record.problemStatementPdfRef
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Regenerate problem statement error:', err);
      res.status(500).json({ error: 'Regeneration failed', details: err.message });
    }
  });

  /**
   * Admin: Get Google Form Configuration & Apps Script Template (Section 4 & 7)
   */
  router.get('/admin/google-form-config', async (req, res) => {
    const baseUrl = process.env.APP_BASE_URL || 'https://professorvirus.site';
    const webhookUrl = `${baseUrl}/api/prma/submissions/google-form-webhook`;
    const appsScriptCode = generateGoogleAppsScriptCode(webhookUrl);
    res.json({
      success: true,
      config: currentGformConfig,
      webhookUrl,
      appsScriptCode
    });
  });

  /**
   * Admin: Save Custom Google Form Configuration
   */
  router.post('/admin/google-form-config', async (req, res) => {
    try {
      const { baseUrl, entryIds } = req.body;
      if (baseUrl) currentGformConfig.baseUrl = baseUrl.trim();
      if (entryIds && typeof entryIds === 'object') {
        currentGformConfig.entryIds = { ...currentGformConfig.entryIds, ...entryIds };
      }
      fs.writeFileSync(GFORM_CONFIG_FILE, JSON.stringify(currentGformConfig, null, 2), 'utf8');
      res.json({ success: true, message: 'Google Form settings saved successfully', config: currentGformConfig });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save Google Form settings', details: err.message });
    }
  });

  /**
   * Webhook: Google Form Response Ingestion (Section 4 & 8)
   */
  router.post('/submissions/google-form-webhook', async (req, res) => {
    try {
      const payload = parseGoogleFormWebhookPayload(req.body);
      if (!payload.rawId && !payload.email) {
        return res.status(400).json({ error: 'Missing candidate identification (Application ID, Offer ID, or Email)' });
      }

      await loadApplications();
      await loadSubmissions();

      // Find matching application
      let app = null;
      if (payload.rawId) {
        app = await getApplication(payload.rawId);
      }
      if (!app && payload.email) {
        for (const a of applicationsStore.values()) {
          if (a.student?.email && a.student.email.toLowerCase() === payload.email.toLowerCase()) {
            app = a;
            break;
          }
        }
      }

      if (!app) {
        return res.status(404).json({ error: `No active internship application found matching ${payload.rawId || payload.email}` });
      }

      // Find or create student's PrmaSubmission record
      let sub = await getSubmissionByToken(app.submissionToken || app.applicationId);
      if (!sub) {
        sub = {
          submissionId: `SUB-${(app.offerId || app.applicationId).replace(/[^a-zA-Z0-9]/g, '')}`,
          applicationId: app.applicationId,
          offerId: app.offerId || app.applicationId,
          submissionToken: app.submissionToken || `prma_sub_${crypto.randomBytes(18).toString('hex')}`,
          student: {
            fullName: app.student?.fullName || payload.fullName,
            email: app.student?.email || payload.email,
            mobile: app.student?.mobile || '',
            college: app.academic?.college || '',
            branch: app.academic?.branch || ''
          },
          technical: {
            domainId: app.technical?.domainId || 'ai-ml',
            domainTitle: app.technical?.domainTitle || app.domain?.title || 'Technology Track'
          },
          joiningDate: app.joiningDate || '',
          duration: app.duration || '1 Month',
          mode: app.mode || 'Fully Remote',
          tasks: initializeWeeklyTasks(app.technical?.domainId || 'ai-ml'),
          overallProgress: 0,
          completedWeeksCount: 0,
          lastSubmissionDate: '',
          status: 'active'
        };
      }

      const weekNum = payload.weekNumber || 1;
      let task = (sub.tasks || []).find(t => t.weekNumber === weekNum);
      if (!task) {
        task = {
          weekNumber: weekNum,
          taskTitle: payload.taskTitle || `Week ${weekNum} Deliverable`,
          status: 'submitted',
          files: [],
          reviewStatus: 'pending'
        };
        sub.tasks.push(task);
      }

      // Update task deliverables
      task.taskTitle = payload.taskTitle || task.taskTitle;
      task.status = 'submitted';
      task.reviewStatus = 'pending';
      task.submittedAt = payload.submissionTimestamp || new Date().toISOString();
      task.source = 'google_form';
      task.googleFormResponseId = payload.uniqueSubmissionId;
      task.githubUrl = payload.githubUrl || task.githubUrl || '';
      task.liveUrl = payload.liveUrl || task.liveUrl || '';
      task.studentRemarks = payload.workDescription || task.studentRemarks || '';
      task.instagramUrl = payload.instagramUrl || '';
      task.linkedinUrl = payload.linkedinUrl || '';
      task.followedInstagram = payload.followedInstagram;
      task.followedLinkedIn = payload.followedLinkedIn;

      if (Array.isArray(payload.files) && payload.files.length > 0) {
        task.files = [...(task.files || []), ...payload.files];
      }

      // Recalculate progress
      const approvedCount = sub.tasks.filter(t => t.status === 'approved' || t.reviewStatus === 'approved').length;
      const submittedCount = sub.tasks.filter(t => t.status === 'submitted' || t.status === 'approved' || t.reviewStatus === 'under_review').length;
      sub.completedWeeksCount = approvedCount;
      sub.overallProgress = Math.round((submittedCount / 4) * 100);
      sub.lastSubmissionDate = task.submittedAt;

      submissionsStore.set(sub.submissionId, sub);
      submissionsStore.set(sub.submissionToken, sub);
      await persistSubmissions(sub);

      // Dispatches confirmation emails
      try {
        await sendPrmaSubmissionConfirmationEmail({
          toEmail: sub.student.email,
          studentName: sub.student.fullName,
          weekNumber: weekNum,
          taskTitle: task.taskTitle,
          offerId: sub.offerId,
          domainTitle: sub.technical.domainTitle
        });
      } catch (err) {
        console.warn('[PRMA ROUTER] Confirmation email warning:', err.message);
      }

      try {
        await sendPrmaAdminTaskNotificationEmail({
          studentName: sub.student.fullName,
          studentEmail: sub.student.email,
          weekNumber: weekNum,
          taskTitle: task.taskTitle,
          offerId: sub.offerId,
          domainTitle: sub.technical.domainTitle,
          githubUrl: task.githubUrl,
          liveUrl: task.liveUrl
        });
      } catch (err) {
        console.warn('[PRMA ROUTER] Admin alert email warning:', err.message);
      }

      res.json({
        success: true,
        submissionId: payload.uniqueSubmissionId,
        message: `Week ${weekNum} task submitted via Google Form successfully!`,
        submission: sub
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Google Form webhook error:', err);
      res.status(500).json({ error: 'Webhook processing failed', details: err.message });
    }
  });

  /**
   * Admin: Reject Application
   */
  router.post('/admin/applications/:id/reject', async (req, res) => {
    try {
      const appId = req.params.id;
      const record = await getApplication(appId);
      if (!record) return res.status(404).json({ error: 'Application not found' });

      record.status = 'rejected';
      record.rejectedAt = new Date().toISOString();
      record.adminRemarks = req.body.remarks || 'Application not selected for this cohort.';

      if (req.body.sendEmail && record.student?.email) {
        await sendPrmaRejectionEmail({
          toEmail: record.student.email,
          studentName: record.student.fullName,
          domainTitle: record.technical?.domainTitle || 'Internship',
          remarks: record.adminRemarks
        });

        logEmail({
          type: 'APPLICATION_REJECTION',
          recipient: record.student.email,
          studentName: record.student.fullName,
          status: 'Delivered'
        });
      }

      applicationsStore.set(record.applicationId, record);
      await persistApplications(record);

      res.json({ success: true, message: 'Application status updated to Rejected', application: record });
    } catch (err) {
      res.status(500).json({ error: 'Rejection action failed', details: err.message });
    }
  });

  /**
   * Admin: Mark Under Review
   */
  router.post('/admin/applications/:id/review', async (req, res) => {
    try {
      const appId = req.params.id;
      const record = await getApplication(appId);
      if (!record) return res.status(404).json({ error: 'Application not found' });

      record.status = 'under_review';
      record.reviewedAt = new Date().toISOString();
      record.adminRemarks = req.body.remarks || 'Currently undergoing screening.';
      applicationsStore.set(record.applicationId, record);
      await persistApplications(record);

      res.json({ success: true, application: record });
    } catch (err) {
      res.status(500).json({ error: 'Review update failed', details: err.message });
    }
  });

  /**
   * Admin: General Application Status Management (Pending, Under Review, Approved, Rejected)
   */
  router.post('/admin/applications/:id/status', async (req, res) => {
    try {
      const appId = req.params.id;
      let record = await getApplication(appId);

      if (!record) return res.status(404).json({ error: 'Application not found' });

      const { status, remarks, joiningDate } = req.body;
      const normalizedStatus = (status === 'pending' || status === 'Submitted') ? 'submitted' : (status === 'approved' ? 'shortlisted' : status);

      if (!['submitted', 'under_review', 'shortlisted', 'rejected'].includes(normalizedStatus)) {
        return res.status(400).json({ error: 'Invalid status. Permitted values: submitted, under_review, shortlisted, rejected.' });
      }

      record.status = normalizedStatus;
      if (remarks) record.adminRemarks = remarks;

      if (normalizedStatus === 'shortlisted') {
        record.shortlistedAt = new Date().toISOString();
        if (joiningDate) record.joiningDate = joiningDate;
        if (!record.offerId) {
          record.offerId = `PRMA/INT/A1/${Math.floor(10000 + Math.random() * 90000)}`;
        }
      } else if (normalizedStatus === 'rejected') {
        record.rejectedAt = new Date().toISOString();
      } else if (normalizedStatus === 'under_review') {
        record.reviewedAt = new Date().toISOString();
      }

      applicationsStore.set(record.applicationId, record);
      await persistApplications(record);

      res.json({
        success: true,
        message: `Status successfully updated to ${normalizedStatus}`,
        application: record
      });
    } catch (err) {
      res.status(500).json({ error: 'Status update failed', details: err.message });
    }
  });

  /**
   * Download Generated Offer Letter PDF
   */
  const handleOfferLetterStream = async (req, res) => {
    try {
      const idParam = req.params.id || req.params.offerId;
      let record = await getApplication(idParam);

      let pdfBuffer = pdfCacheStore.get(idParam);
      if (!pdfBuffer && record?.offerId) {
        pdfBuffer = pdfCacheStore.get(record.offerId);
      }

      if (!pdfBuffer) {
        const studentName = record?.student?.fullName || 'Candidate';
        const domainTitle = record?.technical?.domainTitle || record?.domain?.title || 'Technology Track';
        const offerId = record?.offerId || (idParam.includes('/') ? idParam : 'PRMA/INT/A1/93084');
        const joiningDate = record?.joiningDate || '17-Nov-2026';
        const completionDate = record?.completionDate || '17-Dec-2026';
        const verificationUrl = `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;

        pdfBuffer = await generatePrmaOfferLetterPdf({
          studentName,
          domainTitle,
          offerId,
          issueDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          joiningDate,
          completionDate,
          duration: '1 Month',
          mode: 'Remote',
          verificationUrl
        });

        pdfCacheStore.set(offerId, pdfBuffer);
        if (record) pdfCacheStore.set(record.applicationId, pdfBuffer);
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="PRMA_Tech_Joining_Letter_${record?.offerId ? record.offerId.replace(/[\/\\]/g, '_') : 'Verified'}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (err) {
      console.error('[PRMA ROUTER] PDF Stream error:', err);
      res.status(500).send('Error rendering offer letter: ' + err.message);
    }
  };

  router.get('/admin/applications/:id/offer-letter', handleOfferLetterStream);
  router.get('/offer-letter/:offerId', handleOfferLetterStream);
  router.get('/admin/applications/:id/joining-letter', handleOfferLetterStream);

  /**
   * Admin / Student: Stream 10-Page Problem Statement & 4-Week Tasks PDF (DELIVERABLE 2)
   */
  router.get('/admin/applications/:id/problem-statement', async (req, res) => {
    try {
      const appId = req.params.id;
      const record = await getApplication(appId);
      if (!record) return res.status(404).send('Application not found');

      const offerId = record.offerId || 'PRMA/INT/2026/001';
      const submissionToken = record.submissionToken || `prma_sub_${record.applicationId}`;
      const baseUrl = process.env.APP_BASE_URL || 'https://professorvirus.site';
      const submissionUrl = `${baseUrl}/prma-tech/submit/${submissionToken}`;

      let pdfBuffer = pdfCacheStore.get(`ps_${offerId}`) || pdfCacheStore.get(`ps_${record.applicationId}`);
      if (!pdfBuffer) {
        pdfBuffer = await generatePrmaProblemStatementPdf({
          studentName: record.student?.fullName || 'Candidate',
          offerId,
          domainTitle: record.technical?.domainTitle || record.domain?.title || 'Technology Track',
          domainId: record.technical?.domainId || 'ai-ml',
          joiningDate: record.joiningDate || '',
          completionDate: record.completionDate || '',
          submissionToken,
          submissionUrl
        });
        pdfCacheStore.set(`ps_${offerId}`, pdfBuffer);
        pdfCacheStore.set(`ps_${record.applicationId}`, pdfBuffer);
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="PRMA_Tech_Problem_Statement_${offerId.replace(/[\/\\]/g, '_')}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (err) {
      console.error('[PRMA ROUTER] Problem statement stream error:', err);
      res.status(500).send('Error rendering problem statement: ' + err.message);
    }
  });

  router.get('/problem-statement/:offerId', async (req, res) => {
    try {
      const paramId = decodeURIComponent(req.params.offerId).trim();
      const record = await getApplication(paramId);
      if (!record) return res.status(404).send('Record not found');

      const offerId = record.offerId || paramId;
      const submissionToken = record.submissionToken || `prma_sub_${record.applicationId}`;
      const baseUrl = process.env.APP_BASE_URL || 'https://professorvirus.site';
      const submissionUrl = `${baseUrl}/prma-tech/submit/${submissionToken}`;

      const pdfBuffer = await generatePrmaProblemStatementPdf({
        studentName: record.student?.fullName || 'Candidate',
        offerId,
        domainTitle: record.technical?.domainTitle || record.domain?.title || 'Technology Track',
        domainId: record.technical?.domainId || 'ai-ml',
        joiningDate: record.joiningDate || '',
        completionDate: record.completionDate || '',
        submissionToken,
        submissionUrl
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="PRMA_Tech_Problem_Statement_${offerId.replace(/[\/\\]/g, '_')}.pdf"`);
      res.end(pdfBuffer);
    } catch (err) {
      res.status(500).send('Error rendering problem statement: ' + err.message);
    }
  });

  // =========================================================================
  // STUDENT SUBMISSION PORTAL APIS (DELIVERABLE 3)
  // =========================================================================

  /**
   * Student: Get submission profile & tasks by secure token
   */
  router.get('/submissions/token/:token', async (req, res) => {
    try {
      const token = req.params.token;
      let sub = await getSubmissionByToken(token);

      if (!sub) {
        // Try to find an application with this submissionToken or offerId
        await loadApplications();
        const appMatch = Array.from(applicationsStore.values()).find(
          a => a.submissionToken === token || a.offerId === token || a.applicationId === token
        );

        if (appMatch) {
          const subToken = appMatch.submissionToken || token;
          sub = {
            submissionId: `SUB-${appMatch.offerId ? appMatch.offerId.replace(/[^a-zA-Z0-9]/g, '') : 'PORTAL'}`,
            applicationId: appMatch.applicationId,
            offerId: appMatch.offerId || 'PRMA-INT-2026',
            submissionToken: subToken,
            student: {
              fullName: appMatch.student?.fullName || 'Candidate',
              email: appMatch.student?.email || '',
              mobile: appMatch.student?.mobile || '',
              college: appMatch.academic?.college || '',
              branch: appMatch.academic?.branch || '',
              fatherName: appMatch.student?.fatherName || ''
            },
            technical: {
              domainId: appMatch.technical?.domainId || 'ai-ml',
              domainTitle: appMatch.technical?.domainTitle || appMatch.domain?.title || 'Technology Track'
            },
            joiningDate: appMatch.joiningDate || '',
            completionDate: appMatch.completionDate || '',
            duration: appMatch.duration || '1 Month',
            mode: appMatch.mode || 'Fully Remote',
            tasks: initializeWeeklyTasks(appMatch.technical?.domainId || 'ai-ml'),
            overallProgress: 0,
            completedWeeksCount: 0,
            lastSubmissionDate: '',
            status: 'active'
          };
          submissionsStore.set(sub.submissionId, sub);
          submissionsStore.set(subToken, sub);
          await persistSubmissions(sub);
        }
      }

      if (!sub) {
        return res.status(404).json({
          error: 'Invalid or expired submission portal link.',
          notice: 'Please verify the link in your official PRMA Tech approval email.'
        });
      }

      res.json({
        success: true,
        submission: sub
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve submission details', details: err.message });
    }
  });

  /**
   * Student: Submit weekly task deliverables
   */
  router.post('/submissions/token/:token/submit/:week', async (req, res) => {
    try {
      const { token, week } = req.params;
      const weekNum = parseInt(week, 10);
      if (![1, 2, 3, 4].includes(weekNum)) {
        return res.status(400).json({ error: 'Invalid week number. Must be 1, 2, 3, or 4.' });
      }

      const sub = await getSubmissionByToken(token);
      if (!sub) {
        return res.status(404).json({ error: 'Invalid or expired submission link.' });
      }

      const { files = [], githubUrl = '', liveUrl = '', studentRemarks = '' } = req.body;

      // Validate at least one deliverable is provided
      if ((!files || files.length === 0) && !githubUrl && !liveUrl) {
        return res.status(400).json({
          error: 'Compulsory: Please upload at least one project deliverable (project file/PDF/ZIP, GitHub repository, or live project demo URL).'
        });
      }

      // Find or initialize task
      if (!Array.isArray(sub.tasks)) {
        sub.tasks = initializeWeeklyTasks(sub.technical?.domainId || 'ai-ml');
      }

      let task = sub.tasks.find(t => t.weekNumber === weekNum);
      if (!task) {
        task = {
          weekNumber: weekNum,
          taskTitle: `Week ${weekNum} Deliverable`,
          status: 'not_submitted',
          files: [],
          reviewStatus: 'pending'
        };
        sub.tasks.push(task);
      }

      const nowStr = new Date().toISOString();
      const isResubmission = task.status === 'revision_required' || (task.resubmissionCount || 0) > 0;

      task.status = 'submitted';
      task.submittedAt = task.submittedAt || nowStr;
      task.updatedAt = nowStr;
      task.reviewStatus = 'under_review';
      task.githubUrl = (githubUrl || task.githubUrl || '').trim();
      task.liveUrl = (liveUrl || task.liveUrl || '').trim();
      task.studentRemarks = (studentRemarks || task.studentRemarks || '').trim();

      if (isResubmission) {
        task.resubmissionCount = (task.resubmissionCount || 0) + 1;
      }

      if (Array.isArray(files) && files.length > 0) {
        task.files = files.map((f, idx) => ({
          fileId: `file_w${weekNum}_${idx}_${Date.now()}`,
          fileName: f.fileName || `Deliverable_Week_${weekNum}.pdf`,
          fileSize: f.fileSize || 0,
          fileType: f.fileType || 'application/octet-stream',
          dataUrl: f.dataUrl || ''
        }));
      }

      // Recalculate progress
      const submittedOrApprovedWeeks = sub.tasks.filter(t => t.status === 'submitted' || t.status === 'approved').length;
      const approvedWeeks = sub.tasks.filter(t => t.status === 'approved').length;
      sub.completedWeeksCount = approvedWeeks;
      sub.overallProgress = Math.round((submittedOrApprovedWeeks / 4) * 100);
      sub.lastSubmissionDate = nowStr;

      submissionsStore.set(sub.submissionId, sub);
      submissionsStore.set(sub.submissionToken, sub);
      await persistSubmissions(sub);

      const timestampFormatted = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Send confirmation email to student
      try {
        if (sub.student?.email) {
          await sendPrmaSubmissionConfirmationEmail({
            toEmail: sub.student.email,
            studentName: sub.student.fullName,
            domainTitle: sub.technical?.domainTitle || 'Internship Track',
            offerId: sub.offerId,
            weekNumber: weekNum,
            taskTitle: task.taskTitle,
            submissionTime: timestampFormatted
          });
        }
      } catch (mailErr) {
        console.warn('[PRMA ROUTER] Student confirmation email warning:', mailErr.message);
      }

      // Send alert to admin
      try {
        await sendPrmaAdminTaskNotificationEmail({
          studentName: sub.student?.fullName || 'Student',
          domainTitle: sub.technical?.domainTitle || 'Internship Track',
          offerId: sub.offerId,
          weekNumber: weekNum,
          taskTitle: task.taskTitle,
          submissionTime: timestampFormatted,
          githubUrl: task.githubUrl,
          liveUrl: task.liveUrl
        });
      } catch (adminMailErr) {
        console.warn('[PRMA ROUTER] Admin notification email warning:', adminMailErr.message);
      }

      res.json({
        success: true,
        message: `✓ Week ${weekNum} project deliverables submitted successfully! Your mentor will review your submission shortly.`,
        task,
        submission: sub
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Student submission error:', err);
      res.status(500).json({ error: 'Failed to submit deliverables', details: err.message });
    }
  });

  /**
   * Download / Stream Student Submitted File
   */
  router.get('/submissions/download/:submissionId/:weekNumber/:fileIndex', async (req, res) => {
    try {
      const { submissionId, weekNumber, fileIndex } = req.params;
      const sub = await getSubmissionByToken(submissionId);
      if (!sub) return res.status(404).send('Submission record not found');

      const weekNum = parseInt(weekNumber, 10);
      const fIdx = parseInt(fileIndex, 10);
      const task = (sub.tasks || []).find(t => t.weekNumber === weekNum);
      if (!task || !task.files || !task.files[fIdx]) {
        return res.status(404).send('File not found in task submission');
      }

      const fileObj = task.files[fIdx];
      if (fileObj.dataUrl && fileObj.dataUrl.includes('base64,')) {
        const parts = fileObj.dataUrl.split('base64,');
        const mimeMatch = fileObj.dataUrl.match(/^data:([^;]+);/);
        const mimeType = mimeMatch ? mimeMatch[1] : (fileObj.fileType || 'application/octet-stream');
        const buffer = Buffer.from(parts[1], 'base64');

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileObj.fileName || 'deliverable.pdf'}"`);
        res.setHeader('Content-Length', buffer.length);
        return res.end(buffer);
      }

      res.status(404).send('File data unavailable');
    } catch (err) {
      res.status(500).send('Error downloading file: ' + err.message);
    }
  });

  // =========================================================================
  // ADMIN SUBMISSIONS DASHBOARD & REVIEW APIS (REQUIREMENT 2)
  // =========================================================================

  /**
   * Admin: Real Database-Driven Submissions Dashboard & Table
   */
  router.get('/admin/submissions', async (req, res) => {
    try {
      await loadApplications();
      await loadSubmissions();

      const approvedApps = Array.from(applicationsStore.values()).filter(
        a => a.status === 'shortlisted' || a.status === 'approved'
      );

      // Auto-populate submissionsStore for any approved application that doesn't have a record yet
      for (const app of approvedApps) {
        if (!app.offerId) continue;
        const existing = await getSubmissionByToken(app.applicationId);
        if (!existing) {
          const subToken = app.submissionToken || `prma_sub_${crypto.randomBytes(18).toString('hex')}`;
          app.submissionToken = subToken;
          const newSub = {
            submissionId: `SUB-${app.offerId.replace(/[^a-zA-Z0-9]/g, '')}`,
            applicationId: app.applicationId,
            offerId: app.offerId,
            submissionToken: subToken,
            student: {
              fullName: app.student?.fullName || 'Candidate',
              email: app.student?.email || '',
              mobile: app.student?.mobile || '',
              college: app.academic?.college || '',
              branch: app.academic?.branch || '',
              fatherName: app.student?.fatherName || ''
            },
            technical: {
              domainId: app.technical?.domainId || 'ai-ml',
              domainTitle: app.technical?.domainTitle || app.domain?.title || 'Technology Track'
            },
            joiningDate: app.joiningDate || '',
            completionDate: app.completionDate || '',
            duration: app.duration || '1 Month',
            mode: app.mode || 'Fully Remote',
            tasks: initializeWeeklyTasks(app.technical?.domainId || 'ai-ml'),
            overallProgress: 0,
            completedWeeksCount: 0,
            lastSubmissionDate: '',
            status: 'active'
          };
          submissionsStore.set(newSub.submissionId, newSub);
          submissionsStore.set(subToken, newSub);
          await persistSubmissions(newSub);
        }
      }

      // Collect unique submission records
      const seenIds = new Set();
      let subs = [];
      for (const s of submissionsStore.values()) {
        if (s.submissionId && !seenIds.has(s.submissionId)) {
          seenIds.add(s.submissionId);
          subs.push(s);
        }
      }

      // Calculate Real Database-Driven Statistics (Requirement 2)
      const totalApprovedInterns = approvedApps.length;
      let totalSubmissions = 0;
      let pendingSubmissions = 0;
      let week1Completed = 0;
      let week2Completed = 0;
      let week3Completed = 0;
      let week4Completed = 0;
      let reviewedSubmissions = 0;

      subs.forEach(s => {
        (s.tasks || []).forEach(t => {
          if (t.status === 'submitted' || t.status === 'approved' || t.status === 'revision_required') {
            totalSubmissions++;
          }
          if (t.status === 'submitted' && (t.reviewStatus === 'under_review' || t.reviewStatus === 'pending')) {
            pendingSubmissions++;
          }
          if (t.reviewStatus === 'approved' || t.reviewStatus === 'revision_required') {
            reviewedSubmissions++;
          }
          if (t.weekNumber === 1 && (t.status === 'submitted' || t.status === 'approved')) week1Completed++;
          if (t.weekNumber === 2 && (t.status === 'submitted' || t.status === 'approved')) week2Completed++;
          if (t.weekNumber === 3 && (t.status === 'submitted' || t.status === 'approved')) week3Completed++;
          if (t.weekNumber === 4 && (t.status === 'submitted' || t.status === 'approved')) week4Completed++;
        });
      });

      // Filter by query parameters
      const { domain, weekStatus, search, reviewStatus } = req.query;

      if (domain && domain !== 'all') {
        subs = subs.filter(s =>
          (s.technical?.domainTitle || '').toLowerCase() === domain.toLowerCase() ||
          (s.technical?.domainId || '').toLowerCase() === domain.toLowerCase()
        );
      }

      if (weekStatus && weekStatus !== 'all') {
        const match = weekStatus.match(/^week(\d)_(.+)$/);
        if (match) {
          const wNum = parseInt(match[1], 10);
          const wStat = match[2];
          subs = subs.filter(s => {
            const t = (s.tasks || []).find(tk => tk.weekNumber === wNum);
            return t && (t.status === wStat || t.reviewStatus === wStat);
          });
        }
      }

      if (reviewStatus && reviewStatus !== 'all') {
        if (reviewStatus === 'pending') {
          subs = subs.filter(s => (s.tasks || []).some(t => t.status === 'submitted' && t.reviewStatus === 'under_review'));
        } else if (reviewStatus === 'completed') {
          subs = subs.filter(s => (s.tasks || []).filter(t => t.status === 'approved').length === 4);
        }
      }

      if (search) {
        const q = search.toLowerCase();
        subs = subs.filter(s =>
          (s.student?.fullName || '').toLowerCase().includes(q) ||
          (s.student?.email || '').toLowerCase().includes(q) ||
          (s.offerId || '').toLowerCase().includes(q) ||
          (s.applicationId || '').toLowerCase().includes(q) ||
          (s.technical?.domainTitle || '').toLowerCase().includes(q)
        );
      }

      res.json({
        success: true,
        stats: {
          totalApprovedInterns,
          totalSubmissions,
          pendingSubmissions,
          week1Completed,
          week2Completed,
          week3Completed,
          week4Completed,
          reviewedSubmissions
        },
        count: subs.length,
        submissions: subs
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Admin submissions error:', err);
      res.status(500).json({ error: 'Failed to retrieve submissions', details: err.message });
    }
  });

  /**
   * Admin: Get Single Student Submission Dossier
   */
  router.get('/admin/submissions/:id', async (req, res) => {
    try {
      const sub = await getSubmissionByToken(req.params.id);
      if (!sub) return res.status(404).json({ error: 'Submission not found' });
      res.json({ success: true, submission: sub });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching submission dossier', details: err.message });
    }
  });

  /**
   * Admin: Review Weekly Task (Approve / Request Corrections / Add Feedback)
   */
  router.post('/admin/submissions/:id/review/:week', async (req, res) => {
    try {
      const { id, week } = req.params;
      const weekNum = parseInt(week, 10);
      const { status, feedback = '', reviewer = 'PRMA Tech Mentorship Board' } = req.body;

      if (!['approved', 'revision_required', 'under_review'].includes(status)) {
        return res.status(400).json({ error: 'Status must be approved, revision_required, or under_review.' });
      }

      const sub = await getSubmissionByToken(id);
      if (!sub) return res.status(404).json({ error: 'Submission not found.' });

      if (!Array.isArray(sub.tasks)) {
        sub.tasks = initializeWeeklyTasks(sub.technical?.domainId || 'ai-ml');
      }

      let task = sub.tasks.find(t => t.weekNumber === weekNum);
      if (!task) {
        task = {
          weekNumber: weekNum,
          taskTitle: `Week ${weekNum} Deliverable`,
          status: 'submitted',
          files: [],
          reviewStatus: 'under_review'
        };
        sub.tasks.push(task);
      }

      const nowStr = new Date().toISOString();
      task.reviewStatus = status;
      task.adminFeedback = (feedback || '').trim();
      task.reviewedAt = nowStr;
      task.reviewedBy = reviewer;

      if (status === 'approved') {
        task.status = 'approved';
      } else if (status === 'revision_required') {
        task.status = 'revision_required';
        task.resubmissionCount = (task.resubmissionCount || 0) + 1;
      }

      // Recalculate progress
      const approvedCount = sub.tasks.filter(t => t.status === 'approved').length;
      const submittedCount = sub.tasks.filter(t => t.status === 'submitted' || t.status === 'approved').length;
      sub.completedWeeksCount = approvedCount;
      sub.overallProgress = Math.round((submittedCount / 4) * 100);

      submissionsStore.set(sub.submissionId, sub);
      submissionsStore.set(sub.submissionToken, sub);
      await persistSubmissions(sub);

      // Send Feedback Email to Student
      try {
        if (sub.student?.email) {
          const baseUrl = process.env.APP_BASE_URL || 'https://professorvirus.site';
          const subUrl = `${baseUrl}/prma-tech/submit/${sub.submissionToken}`;
          await sendPrmaReviewFeedbackEmail({
            toEmail: sub.student.email,
            studentName: sub.student.fullName,
            domainTitle: sub.technical?.domainTitle || 'Internship Track',
            offerId: sub.offerId,
            weekNumber: weekNum,
            taskTitle: task.taskTitle,
            reviewStatus: status,
            adminFeedback: feedback,
            submissionUrl: subUrl
          });
        }
      } catch (mailErr) {
        console.warn('[PRMA ROUTER] Review feedback email warning:', mailErr.message);
      }

      res.json({
        success: true,
        message: `✓ Week ${weekNum} review saved as ${status}. Notification sent to student.`,
        task,
        submission: sub
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Admin review error:', err);
      res.status(500).json({ error: 'Failed to record review: ' + err.message });
    }
  });

  /**
   * Admin: Template Configuration & Task Management (Requirement 5)
   */
  router.get('/admin/templates', (req, res) => {
    res.json({
      success: true,
      templates: {
        joiningLetter: {
          name: 'Official PRMA Tech Internship Joining Letter',
          format: 'A4 Single Page Vector / Template PDF',
          registration: 'UDYAM-UP-76-0055635',
          signatory: 'PRIYANSHU KUMAR (Founder / Authorized Representative)',
          templateImagePath: '/assets/prma_templates/prma_joining_letter_template.jpg'
        },
        problemStatement: {
          name: 'Official PRMA Tech Problem Statement & 4-Week Tasks',
          format: '10-Page Standardized Document PDF',
          structure: 'Page 1 Cover, Pages 2-9 Weekly Tasks & Portal Links, Page 10 Authorization',
          templatePdfPath: '/assets/prma_templates/prma_problem_statement_template.pdf'
        },
        domainTasks: DEFAULT_DOMAIN_TASKS
      }
    });
  });

  /**
   * Scannable QR Credential Verification Endpoint
   */
  router.get('/verify-offer/:offerId', async (req, res) => {
    try {
      const paramId = decodeURIComponent(req.params.offerId).trim();
      let match = await getApplication(paramId);

      // Default sample reference seed
      if (!match && (paramId.toLowerCase().includes('93084') || paramId.toLowerCase() === 'prma/int/a1/93084')) {
        match = {
          applicationId: 'PRMA2026849201',
          offerId: 'PRMA/INT/A1/93084',
          student: {
            fullName: 'Priyanshu Kumar',
            college: 'Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad'
          },
          academic: {
            college: 'Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad',
            branch: 'Computer Science and Engineering (AI & ML)'
          },
          technical: {
            domainTitle: 'Artificial Intelligence & Machine Learning'
          },
          joiningDate: '17-Nov-2026',
          completionDate: '17-Dec-2026',
          duration: '1 Month',
          mode: 'Remote',
          status: 'shortlisted'
        };
      }

      if (!match) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: `No active credential record exists for Offer ID "${paramId}".`
        });
      }

      res.json({
        success: true,
        verified: true,
        offer: {
          offerId: match.offerId || paramId,
          applicationId: match.applicationId,
          studentName: match.student?.fullName || 'Verified Intern',
          college: match.academic?.college || match.student?.college || 'Affiliated Institution',
          branch: match.academic?.branch || match.student?.branch || 'Engineering / Technology',
          domain: match.technical?.domainTitle || match.domain?.title || 'Technical Track',
          joiningDate: match.joiningDate || '17-Nov-2026',
          completionDate: match.completionDate || '17-Dec-2026',
          duration: match.duration || '1 Month',
          mode: match.mode || 'Remote',
          status: 'Official Verified Offer',
          issuedBy: 'Rahul Verma, Co-Founder & COO, PRMA Tech',
          corporateAddress: 'PRMA Tech, Knowledge Park, Greater Noida, Uttar Pradesh – 201310',
          verifiedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Verification failed', details: err.message });
    }
  });

  /**
   * Real Database-Driven Admin Statistics (Requirement 6.A)
   */
  router.get('/admin/stats', async (req, res) => {
    try {
      await ensureMongoConnected();

      let apps = [];
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        apps = await PrmaApplicationModel.find({}).lean();
        apps.forEach(app => {
          if (app.applicationId) applicationsStore.set(app.applicationId, app);
        });
      } else {
        if (applicationsStore.size === 0) {
          await loadApplications();
        }
        apps = Array.from(applicationsStore.values());
      }

      const totalApplications = apps.length;
      const newApplications = apps.filter(a => a.status === 'submitted' || a.status === 'pending').length;
      const underReview = apps.filter(a => a.status === 'under_review').length;
      const shortlisted = apps.filter(a => a.status === 'shortlisted' || a.status === 'approved').length;
      const rejected = apps.filter(a => a.status === 'rejected').length;

      // Group by domain
      const byDomain = {};
      apps.forEach(a => {
        const dom = a.technical?.domainTitle || a.domain?.title || 'General';
        byDomain[dom] = (byDomain[dom] || 0) + 1;
      });

      // Group by college
      const byCollege = {};
      apps.forEach(a => {
        const col = a.academic?.college || a.student?.college || 'Other';
        byCollege[col] = (byCollege[col] || 0) + 1;
      });

      // Group by university
      const byUniversity = {};
      apps.forEach(a => {
        const uni = a.academic?.university || 'Other';
        byUniversity[uni] = (byUniversity[uni] || 0) + 1;
      });

      res.json({
        success: true,
        stats: {
          totalApplications,
          newApplications,
          underReview,
          shortlisted,
          rejected,
          byDomain,
          byCollege,
          byUniversity,
          totalEmailsDispatched: emailLogsStore.length
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to compute admin statistics', details: err.message });
    }
  });

  /**
   * Admin: List Tasks
   */
  router.get('/admin/tasks', (req, res) => {
    const list = Array.from(tasksStore.values());
    res.json({ success: true, count: list.length, tasks: list });
  });

  /**
   * Admin: Create Task
   */
  router.post('/admin/tasks', (req, res) => {
    try {
      const { domainId, domainTitle, title, description, deadline, resources, submissionInstructions } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: 'Task title and description are required' });
      }

      const id = 'TASK_' + Date.now().toString().slice(-6);
      const newTask = {
        id,
        domainId: domainId || 'all',
        domainTitle: domainTitle || 'All Domains',
        title,
        description,
        deadline: deadline || '1 Week',
        resources: resources || '',
        submissionInstructions: submissionInstructions || '',
        dispatchedCount: 0,
        createdAt: new Date().toISOString()
      };

      tasksStore.set(id, newTask);
      persistTasks();

      res.status(201).json({ success: true, task: newTask });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create task', details: err.message });
    }
  });

  /**
   * Admin: Dispatch Task via Email to Shortlisted Students
   */
  router.post('/admin/tasks/:id/dispatch', async (req, res) => {
    try {
      const taskId = req.params.id;
      const task = tasksStore.get(taskId);
      if (!task) return res.status(404).json({ error: 'Task not found' });

      // Find all shortlisted students matching domain (or all if domainId === 'all')
      const targetApps = Array.from(applicationsStore.values()).filter(a => {
        if (a.status !== 'shortlisted') return false;
        if (task.domainId === 'all') return true;
        return a.technical?.domainId === task.domainId || a.technical?.domainTitle === task.domainTitle;
      });

      let dispatched = 0;
      for (const app of targetApps) {
        if (app.student?.email) {
          await sendPrmaTaskEmail({
            toEmail: app.student.email,
            studentName: app.student.fullName,
            domainTitle: app.technical?.domainTitle || task.domainTitle,
            taskTitle: task.title,
            taskDescription: task.description,
            deadline: task.deadline,
            resources: task.resources,
            submissionInstructions: task.submissionInstructions
          });

          logEmail({
            type: 'TASK_INSTRUCTION',
            recipient: app.student.email,
            studentName: app.student.fullName,
            taskTitle: task.title,
            status: 'Delivered'
          });

          dispatched++;
        }
      }

      task.dispatchedCount = (task.dispatchedCount || 0) + dispatched;
      task.lastDispatchedAt = new Date().toISOString();
      tasksStore.set(taskId, task);
      persistTasks();

      res.json({
        success: true,
        message: `Task successfully dispatched to ${dispatched} shortlisted students via registered email.`,
        dispatchedCount: dispatched
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to dispatch tasks', details: err.message });
    }
  });

  /**
   * Admin: Email Audit Log
   */
  router.get('/admin/emails', (req, res) => {
    res.json({
      success: true,
      count: emailLogsStore.length,
      emails: emailLogsStore
    });
  });

  /**
   * Careers Public: List Published Jobs
   */
  router.get('/careers/jobs', (req, res) => {
    try {
      const activeJobs = Array.from(jobsStore.values()).filter(j => j.active !== false);
      res.json({
        success: true,
        count: activeJobs.length,
        jobs: activeJobs
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve jobs', details: err.message });
    }
  });

  /**
   * Careers Admin: List All Jobs
   */
  router.get('/admin/jobs', (req, res) => {
    try {
      const allJobs = Array.from(jobsStore.values());
      res.json({
        success: true,
        count: allJobs.length,
        jobs: allJobs
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve admin jobs', details: err.message });
    }
  });

  /**
   * Careers Admin: Add Job Opening
   */
  router.post('/admin/jobs', (req, res) => {
    try {
      const { title, category, type, location, experience, stipend, duration, shortDesc, skills, responsibilities, requirements } = req.body;
      if (!title || !category) {
        return res.status(400).json({ error: 'Job title and category are required' });
      }

      const id = 'prma-job-' + (title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)) + '-' + Date.now().toString().slice(-4);
      const newJob = {
        id,
        title,
        category: category || 'Engineering',
        type: type || 'Internship',
        location: location || 'Remote',
        experience: experience || 'Fresher / Student',
        stipend: stipend || 'Performance-based + Certificate',
        duration: duration || '3 - 6 Months',
        shortDesc: shortDesc || 'Join PRMA Tech to work on cutting-edge engineering projects.',
        skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()).filter(Boolean),
        responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities || '').split('\n').map(s => s.trim()).filter(Boolean),
        requirements: Array.isArray(requirements) ? requirements : (requirements || '').split('\n').map(s => s.trim()).filter(Boolean),
        active: true,
        postedAt: 'Active Opening',
        createdAt: new Date().toISOString()
      };

      jobsStore.set(id, newJob);
      persistJobs();

      res.status(201).json({ success: true, job: newJob });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create job', details: err.message });
    }
  });

  /**
   * Careers Admin: Edit Job Opening
   */
  router.put('/admin/jobs/:id', (req, res) => {
    try {
      const id = req.params.id;
      const existing = jobsStore.get(id);
      if (!existing) return res.status(404).json({ error: 'Job opening not found' });

      const updated = { ...existing, ...req.body, id, updatedAt: new Date().toISOString() };
      jobsStore.set(id, updated);
      persistJobs();

      res.json({ success: true, job: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update job', details: err.message });
    }
  });

  /**
   * Careers Admin: Delete Job Opening
   */
  router.delete('/admin/jobs/:id', (req, res) => {
    try {
      const id = req.params.id;
      if (!jobsStore.has(id)) return res.status(404).json({ error: 'Job opening not found' });

      jobsStore.delete(id);
      persistJobs();

      res.json({ success: true, message: 'Job opening removed' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete job', details: err.message });
    }
  });

  /**
   * Careers Public: Submit Application
   */
  router.post('/careers/apply', (req, res) => {
    try {
      const { jobId, jobTitle, fullName, email, phone, college, graduationYear, portfolioUrl, linkedinUrl, githubUrl, coverNote, resumeFileName } = req.body;
      if (!fullName || !email) {
        return res.status(400).json({ error: 'Full name and email are mandatory.' });
      }

      const id = 'JOB_APP_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      const newApp = {
        id,
        jobId: jobId || 'general-application',
        jobTitle: jobTitle || 'General Talent Network',
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || '',
        college: college || '',
        graduationYear: graduationYear || '',
        portfolioUrl: portfolioUrl || '',
        linkedinUrl: linkedinUrl || '',
        githubUrl: githubUrl || '',
        coverNote: coverNote || '',
        resumeFileName: resumeFileName || '',
        submittedAt: new Date().toISOString()
      };

      jobApplicationsStore.unshift(newApp);
      persistJobApplications();

      res.status(201).json({
        success: true,
        message: 'Application received! Our recruitment team will review your profile.',
        applicationId: id
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to record application', details: err.message });
    }
  });

  /**
   * Careers Admin: List Job Applications
   */
  router.get('/admin/job-applications', (req, res) => {
    res.json({
      success: true,
      count: jobApplicationsStore.length,
      applications: jobApplicationsStore
    });
  });

  // Mount Enterprise Command Center Routes
  router.use(createPrmaEnterpriseRouter({
    applicationsStore,
    submissionsStore,
    getApplication,
    ensureMongoConnected,
    PrmaApplicationModel,
    PrmaSubmissionModel
  }));

  return router;
}
