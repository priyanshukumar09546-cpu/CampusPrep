/**
 * PRMA Tech Enterprise Command Center — Data Models & Storage Service
 * MongoDB Atlas schemas with resilient local file fallback for:
 * - Employees & Departments
 * - Employee Attendance
 * - Projects, Tasks & Milestones
 * - Clients & Enquiries
 * - Events & Registrations
 * - Inventory & Dispatches
 * - Financial Transactions & Invoices
 * - Certificates & QR Verifications
 * - Announcements & Audit Logs
 * - System Settings
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[PRMA ENTERPRISE] Notice creating data dir:', e.message);
}

// Helper for local disk backup
export function getLocalJson(filename, defaultValue = []) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn(`[PRMA ENTERPRISE] Read error for ${filename}:`, err.message);
  }
  return defaultValue;
}

export function saveLocalJson(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn(`[PRMA ENTERPRISE] Write error for ${filename}:`, err.message);
  }
}

// ---------------------------------------------------------------------------
// 1. Employees & Departments
// ---------------------------------------------------------------------------
const PrmaEmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, default: '' },
  department: { type: String, default: 'Engineering' },
  designation: { type: String, default: 'Software Engineer' },
  role: { type: String, default: 'MEMBER' }, // SUPER_ADMIN, ADMIN, HR_MANAGER, PROJECT_MANAGER, MENTOR, FINANCE_MANAGER, MEMBER
  employmentType: { type: String, default: 'Full-Time' }, // Full-Time, Part-Time, Intern, Contractor
  status: { type: String, default: 'Active', index: true }, // Active, On Leave, Resigned, Terminated
  joiningDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  salary: { type: Number, default: 0 },
  avatarUrl: { type: String, default: '' },
  documents: [{
    title: String,
    fileUrl: String,
    uploadedAt: String
  }],
  notes: { type: String, default: '' }
}, { timestamps: true });

export const PrmaEmployeeModel = mongoose.models.PrmaEmployee || mongoose.model('PrmaEmployee', PrmaEmployeeSchema);

const PrmaDepartmentSchema = new mongoose.Schema({
  departmentId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  head: { type: String, default: '' },
  description: { type: String, default: '' },
  budget: { type: Number, default: 0 }
}, { timestamps: true });

export const PrmaDepartmentModel = mongoose.models.PrmaDepartment || mongoose.model('PrmaDepartment', PrmaDepartmentSchema);

// ---------------------------------------------------------------------------
// 2. Employee Attendance
// ---------------------------------------------------------------------------
const PrmaAttendanceSchema = new mongoose.Schema({
  attendanceId: { type: String, required: true, unique: true, index: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  employeeId: { type: String, required: true, index: true },
  employeeName: { type: String, required: true },
  department: { type: String, default: '' },
  status: { type: String, required: true, default: 'Present' }, // Present, Absent, Half-Day, Leave
  checkInTime: { type: String, default: '' },
  checkOutTime: { type: String, default: '' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

export const PrmaAttendanceModel = mongoose.models.PrmaAttendance || mongoose.model('PrmaAttendance', PrmaAttendanceSchema);

// ---------------------------------------------------------------------------
// 3. Projects & Milestones
// ---------------------------------------------------------------------------
const PrmaProjectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  clientName: { type: String, default: '' },
  projectManager: { type: String, default: '' },
  teamMembers: [{ type: String }], // Array of employee names or IDs
  startDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  endDate: { type: String, default: '' },
  status: { type: String, default: 'PLANNING', index: true }, // PLANNING, ACTIVE, ON HOLD, COMPLETED, CANCELLED
  budget: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, // 0 to 100
  milestones: [{
    milestoneId: { type: String },
    title: { type: String, required: true },
    dueDate: { type: String },
    status: { type: String, default: 'Pending' }, // Pending, In Progress, Completed
    deliverables: { type: String, default: '' }
  }],
  tasks: [{
    taskId: { type: String },
    title: { type: String, required: true },
    assignee: { type: String, default: '' },
    priority: { type: String, default: 'Medium' }, // Low, Medium, High, Urgent
    status: { type: String, default: 'To Do' }, // To Do, In Progress, Review, Done
    dueDate: { type: String, default: '' }
  }]
}, { timestamps: true });

export const PrmaProjectModel = mongoose.models.PrmaProject || mongoose.model('PrmaProject', PrmaProjectSchema);

// ---------------------------------------------------------------------------
// 4. Clients & Business Enquiries
// ---------------------------------------------------------------------------
const PrmaClientSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true, index: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  industry: { type: String, default: 'Technology' },
  address: { type: String, default: '' },
  status: { type: String, default: 'Active', index: true }, // Active, Prospect, Inactive
  notes: { type: String, default: '' }
}, { timestamps: true });

export const PrmaClientModel = mongoose.models.PrmaClient || mongoose.model('PrmaClient', PrmaClientSchema);

const PrmaEnquirySchema = new mongoose.Schema({
  enquiryId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  serviceType: { type: String, default: 'General Enquiry' },
  message: { type: String, required: true },
  budget: { type: String, default: '' },
  status: { type: String, default: 'New', index: true }, // New, Contacted, Proposal Sent, Converted, Closed
  source: { type: String, default: 'Website Contact Form' },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

export const PrmaEnquiryModel = mongoose.models.PrmaEnquiry || mongoose.model('PrmaEnquiry', PrmaEnquirySchema);

// ---------------------------------------------------------------------------
// 5. Events & Hackathons
// ---------------------------------------------------------------------------
const PrmaEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  eventDate: { type: String, required: true },
  registrationDeadline: { type: String, default: '' },
  prizePool: { type: String, default: '' },
  mode: { type: String, default: 'Virtual' }, // Virtual, In-Person, Hybrid
  status: { type: String, default: 'Upcoming', index: true }, // Upcoming, Ongoing, Completed, Cancelled
  maxParticipants: { type: Number, default: 500 },
  registrationsCount: { type: Number, default: 0 },
  winners: [{
    position: { type: String }, // 1st Place, 2nd Place, 3rd Place, Special Mention
    teamName: { type: String },
    members: { type: String },
    prize: { type: String }
  }]
}, { timestamps: true });

export const PrmaEventModel = mongoose.models.PrmaEvent || mongoose.model('PrmaEvent', PrmaEventSchema);

const PrmaEventRegistrationSchema = new mongoose.Schema({
  registrationId: { type: String, required: true, unique: true, index: true },
  eventId: { type: String, required: true, index: true },
  eventTitle: { type: String, required: true },
  participantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  college: { type: String, default: '' },
  teamName: { type: String, default: '' },
  teamSize: { type: Number, default: 1 }
}, { timestamps: true });

export const PrmaEventRegistrationModel = mongoose.models.PrmaEventRegistration || mongoose.model('PrmaEventRegistration', PrmaEventRegistrationSchema);

// ---------------------------------------------------------------------------
// 6. Inventory & Goodies
// ---------------------------------------------------------------------------
const PrmaInventorySchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, default: 'Welcome Kit' }, // Welcome Kit, T-Shirt, Bottle, Notebook, ID Card & Lanyard, Pen, Mug, Tech Stickers, Cap, Certificate Case
  stockQuantity: { type: Number, default: 0 },
  minAlertStock: { type: Number, default: 10 },
  unitCost: { type: Number, default: 0 },
  status: { type: String, default: 'In Stock' }, // In Stock, Low Stock, Out of Stock
  lastRestocked: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export const PrmaInventoryModel = mongoose.models.PrmaInventory || mongoose.model('PrmaInventory', PrmaInventorySchema);

const PrmaDispatchSchema = new mongoose.Schema({
  dispatchId: { type: String, required: true, unique: true, index: true },
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, default: '' },
  recipientPhone: { type: String, default: '' },
  recipientAddress: { type: String, required: true },
  items: [{
    itemId: { type: String },
    itemName: { type: String },
    quantity: { type: Number, default: 1 }
  }],
  courierName: { type: String, default: 'India Post / BlueDart' },
  trackingNumber: { type: String, default: '' },
  dispatchDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  deliveryStatus: { type: String, default: 'Dispatched', index: true }, // Dispatched, In Transit, Out for Delivery, Delivered
  deliveredDate: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

export const PrmaDispatchModel = mongoose.models.PrmaDispatch || mongoose.model('PrmaDispatch', PrmaDispatchSchema);

// ---------------------------------------------------------------------------
// 7. Finance, Accounting & Invoices
// ---------------------------------------------------------------------------
const PrmaTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true, index: true }, // Income, Expense
  category: { type: String, required: true }, // Client Project, Software Services, Goodies Sale, Salaries/Stipends, Infrastructure/Server, Merchandise Production, Marketing, Legal/Office, Other
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  paymentMethod: { type: String, default: 'Bank Transfer' }, // Bank Transfer, UPI, Gateway, Cash, Credit Card
  referenceNumber: { type: String, default: '' },
  clientOrVendor: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, default: 'Completed' } // Completed, Pending, Failed
}, { timestamps: true });

export const PrmaTransactionModel = mongoose.models.PrmaTransaction || mongoose.model('PrmaTransaction', PrmaTransactionSchema);

const PrmaInvoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true, index: true },
  invoiceNumber: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  issueDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  dueDate: { type: String, required: true },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Draft', index: true }, // Draft, Sent, Paid, Overdue, Cancelled
  notes: { type: String, default: '' }
}, { timestamps: true });

export const PrmaInvoiceModel = mongoose.models.PrmaInvoice || mongoose.model('PrmaInvoice', PrmaInvoiceSchema);

// ---------------------------------------------------------------------------
// 8. Certificates & Scannable QR Verification
// ---------------------------------------------------------------------------
const PrmaCertificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true, index: true },
  offerId: { type: String, required: true, index: true },
  applicationId: { type: String, default: '' },
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, default: '' },
  domainTitle: { type: String, required: true },
  duration: { type: String, default: '1 Month' },
  joiningDate: { type: String, default: '' },
  completionDate: { type: String, default: '' },
  issuedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  signatory: { type: String, default: 'Priyanshu Kumar, Founder & Authorized Representative' },
  verificationUrl: { type: String, default: '' },
  status: { type: String, default: 'Issued', index: true }, // Issued, Revoked
  pdfUrl: { type: String, default: '' },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

export const PrmaCertificateModel = mongoose.models.PrmaCertificate || mongoose.model('PrmaCertificate', PrmaCertificateSchema);

// ---------------------------------------------------------------------------
// 9. Announcements, Audit Logs & Settings
// ---------------------------------------------------------------------------
const PrmaAnnouncementSchema = new mongoose.Schema({
  announcementId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetAudience: { type: String, default: 'All Interns' }, // All Interns, Approved Interns, Employees, Public
  priority: { type: String, default: 'Normal' }, // Low, Normal, High, Urgent
  author: { type: String, default: 'Admin' }
}, { timestamps: true });

export const PrmaAnnouncementModel = mongoose.models.PrmaAnnouncement || mongoose.model('PrmaAnnouncement', PrmaAnnouncementSchema);

const PrmaAuditLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true, index: true },
  adminName: { type: String, default: 'Admin' },
  adminEmail: { type: String, default: 'admin@prmatech.com' },
  action: { type: String, required: true }, // E.g., 'APPLICATION_APPROVED', 'EMPLOYEE_CREATED', 'TASK_REVIEWED', 'INVOICE_GENERATED'
  module: { type: String, required: true }, // E.g., 'Internships', 'HR', 'Projects', 'Finance', 'Security'
  targetId: { type: String, default: '' },
  details: { type: String, default: '' },
  ipAddress: { type: String, default: '' }
}, { timestamps: true });

export const PrmaAuditLogModel = mongoose.models.PrmaAuditLog || mongoose.model('PrmaAuditLog', PrmaAuditLogSchema);

const PrmaSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

export const PrmaSettingModel = mongoose.models.PrmaSetting || mongoose.model('PrmaSetting', PrmaSettingSchema);
