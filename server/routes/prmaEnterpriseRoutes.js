/**
 * PRMA Tech Enterprise Command Center — Server Routes
 * Endpoints for:
 * - Executive Dashboard Analytics
 * - HR & Employee Operations (Employees, Departments, Attendance)
 * - Project & Task Operations
 * - Client Management & Enquiries
 * - Hackathons & Event Registrations
 * - Inventory & Goodies Dispatches
 * - Finance, Transactions & Invoices
 * - Certificates & Scannable QR Verification
 * - Email Center & SMTP Health Checking
 * - Announcements & Immutable Audit Logs
 * - System Settings & Infrastructure Diagnostics
 */

import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import {
  PrmaEmployeeModel,
  PrmaDepartmentModel,
  PrmaAttendanceModel,
  PrmaProjectModel,
  PrmaClientModel,
  PrmaEnquiryModel,
  PrmaEventModel,
  PrmaEventRegistrationModel,
  PrmaInventoryModel,
  PrmaDispatchModel,
  PrmaTransactionModel,
  PrmaInvoiceModel,
  PrmaCertificateModel,
  PrmaAnnouncementModel,
  PrmaAuditLogModel,
  PrmaSettingModel,
  getLocalJson,
  saveLocalJson
} from '../models/prmaEnterpriseModels.js';

export function createPrmaEnterpriseRouter({
  applicationsStore,
  submissionsStore,
  getApplication,
  ensureMongoConnected,
  PrmaApplicationModel,
  PrmaSubmissionModel
}) {
  const router = express.Router();

  // Helper to log audit actions securely
  const logAudit = async (action, module, targetId = '', details = '', adminName = 'Admin', adminEmail = 'admin@prmatech.com') => {
    try {
      const logItem = {
        logId: `AUDIT-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        adminName,
        adminEmail,
        action,
        module,
        targetId,
        details,
        createdAt: new Date().toISOString()
      };
      await ensureMongoConnected();
      await PrmaAuditLogModel.create(logItem);
    } catch (e) {
      // Local disk fallback
      const current = getLocalJson('prma_audit_logs.json', []);
      current.unshift({
        logId: `AUDIT-${Date.now()}`,
        adminName,
        adminEmail,
        action,
        module,
        targetId,
        details,
        createdAt: new Date().toISOString()
      });
      saveLocalJson('prma_audit_logs.json', current.slice(0, 500));
    }
  };

  // =========================================================================
  // 1. EXECUTIVE COMMAND CENTER STATISTICS & ANALYTICS
  // =========================================================================
  router.get('/admin/command-stats', async (req, res) => {
    try {
      await ensureMongoConnected();

      // Real Application & Submission Metrics
      let allApps = [];
      try {
        allApps = await PrmaApplicationModel.find({}).lean();
      } catch (err) {
        allApps = Array.from(applicationsStore ? applicationsStore.values() : []);
      }

      let allSubs = [];
      try {
        allSubs = await PrmaSubmissionModel.find({}).lean();
      } catch (err) {
        allSubs = Array.from(submissionsStore ? submissionsStore.values() : []);
      }

      const totalApplications = allApps.length;
      const pendingApplications = allApps.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
      const approvedInterns = allApps.filter(a => a.status === 'shortlisted' || a.status === 'approved').length;
      const rejectedApplications = allApps.filter(a => a.status === 'rejected').length;

      // Submission status counts
      let totalWeeklySubmissions = 0;
      let pendingSubmissionsToReview = 0;
      let completedInternships = 0;

      allSubs.forEach(s => {
        let approvedWeeks = 0;
        (s.tasks || []).forEach(t => {
          if (t.status === 'submitted' || t.status === 'approved') totalWeeklySubmissions++;
          if (t.status === 'submitted' && (t.reviewStatus === 'under_review' || t.reviewStatus === 'pending')) {
            pendingSubmissionsToReview++;
          }
          if (t.status === 'approved') approvedWeeks++;
        });
        if (approvedWeeks === 4) completedInternships++;
      });

      // Domain breakdown
      const domainMap = {};
      allApps.forEach(a => {
        const dom = a.technical?.domainTitle || a.domain?.title || 'General';
        domainMap[dom] = (domainMap[dom] || 0) + 1;
      });

      // Enterprise Counts
      let totalEmployees = 0;
      let activeProjects = 0;
      let pendingEnquiries = 0;
      let totalIncome = 0;
      let totalExpenses = 0;

      try {
        totalEmployees = await PrmaEmployeeModel.countDocuments({ status: 'Active' });
        activeProjects = await PrmaProjectModel.countDocuments({ status: { $in: ['ACTIVE', 'PLANNING'] } });
        pendingEnquiries = await PrmaEnquiryModel.countDocuments({ status: 'New' });

        const txs = await PrmaTransactionModel.find({ status: 'Completed' }).lean();
        txs.forEach(t => {
          if (t.type === 'Income') totalIncome += Number(t.amount || 0);
          if (t.type === 'Expense') totalExpenses += Number(t.amount || 0);
        });
      } catch (e) {
        console.warn('[COMMAND STATS] Enterprise count error:', e.message);
      }

      // Recent Activity Stream
      const recentActivity = [];
      allApps.slice(-5).reverse().forEach(a => {
        recentActivity.push({
          id: a.applicationId,
          type: 'APPLICATION',
          title: `New Application: ${a.student?.fullName || 'Candidate'}`,
          subtitle: a.technical?.domainTitle || 'Internship',
          timestamp: a.createdAt || new Date().toISOString(),
          status: a.status
        });
      });

      // Actionable pending items
      const pendingActions = [];
      if (pendingApplications > 0) {
        pendingActions.push({
          type: 'APPLICATIONS',
          title: `${pendingApplications} Internship Application(s) Awaiting Review`,
          linkTab: 'applications',
          urgency: 'high'
        });
      }
      if (pendingSubmissionsToReview > 0) {
        pendingActions.push({
          type: 'SUBMISSIONS',
          title: `${pendingSubmissionsToReview} Student Deliverable(s) Need Evaluation`,
          linkTab: 'weekly-submissions',
          urgency: 'high'
        });
      }
      if (pendingEnquiries > 0) {
        pendingActions.push({
          type: 'ENQUIRIES',
          title: `${pendingEnquiries} New Client Business Enquiry`,
          linkTab: 'client-enquiries',
          urgency: 'medium'
        });
      }

      res.json({
        success: true,
        stats: {
          totalApplications,
          pendingApplications,
          approvedInterns,
          rejectedApplications,
          activeInterns: approvedInterns,
          completedInternships,
          totalWeeklySubmissions,
          pendingSubmissionsToReview,
          totalEmployees,
          activeProjects,
          pendingEnquiries,
          financialOverview: {
            totalIncome,
            totalExpenses,
            netBalance: totalIncome - totalExpenses
          },
          domainBreakdown: domainMap,
          recentActivity,
          pendingActions
        }
      });
    } catch (err) {
      console.error('[COMMAND STATS] Error:', err);
      res.status(500).json({ error: 'Failed to compute command statistics', details: err.message });
    }
  });

  // =========================================================================
  // 2. HR & EMPLOYEE MANAGEMENT
  // =========================================================================
  router.get('/admin/employees', async (req, res) => {
    try {
      await ensureMongoConnected();
      const employees = await PrmaEmployeeModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: employees.length, employees });
    } catch (err) {
      const fallback = getLocalJson('prma_employees.json', []);
      res.json({ success: true, count: fallback.length, employees: fallback });
    }
  });

  router.post('/admin/employees', async (req, res) => {
    try {
      const { fullName, email, phone, department, designation, role, employmentType, salary, joiningDate, notes } = req.body;
      if (!fullName || !email) {
        return res.status(400).json({ error: 'Full name and email are mandatory.' });
      }

      await ensureMongoConnected();
      const employeeId = `PRMA-EMP-${Date.now().toString().slice(-4)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

      const newEmp = {
        employeeId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        department: department || 'Engineering',
        designation: designation || 'Software Engineer',
        role: role || 'MEMBER',
        employmentType: employmentType || 'Full-Time',
        salary: Number(salary) || 0,
        joiningDate: joiningDate || new Date().toISOString().split('T')[0],
        status: 'Active',
        notes: notes || ''
      };

      const created = await PrmaEmployeeModel.create(newEmp);
      await logAudit('EMPLOYEE_CREATED', 'HR', employeeId, `Added employee ${fullName} (${designation})`);

      // Update disk backup
      const current = getLocalJson('prma_employees.json', []);
      current.unshift(created.toObject ? created.toObject() : created);
      saveLocalJson('prma_employees.json', current);

      res.status(201).json({ success: true, employee: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create employee', details: err.message });
    }
  });

  router.put('/admin/employees/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      const updated = await PrmaEmployeeModel.findOneAndUpdate(
        { $or: [{ employeeId: id }, { _id: id }] },
        { ...req.body },
        { new: true }
      ).lean();

      if (!updated) return res.status(404).json({ error: 'Employee not found' });
      await logAudit('EMPLOYEE_UPDATED', 'HR', id, `Updated record for ${updated.fullName}`);

      res.json({ success: true, employee: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update employee', details: err.message });
    }
  });

  router.delete('/admin/employees/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      const removed = await PrmaEmployeeModel.findOneAndDelete({ $or: [{ employeeId: id }, { _id: id }] });
      if (!removed) return res.status(404).json({ error: 'Employee not found' });

      await logAudit('EMPLOYEE_DELETED', 'HR', id, `Deleted record ${id}`);
      res.json({ success: true, message: 'Employee record removed' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete employee', details: err.message });
    }
  });

  // Departments
  router.get('/admin/departments', async (req, res) => {
    try {
      await ensureMongoConnected();
      const depts = await PrmaDepartmentModel.find({}).lean();
      res.json({ success: true, count: depts.length, departments: depts });
    } catch (err) {
      const fallback = getLocalJson('prma_departments.json', []);
      res.json({ success: true, count: fallback.length, departments: fallback });
    }
  });

  router.post('/admin/departments', async (req, res) => {
    try {
      const { name, head, description, budget } = req.body;
      if (!name) return res.status(400).json({ error: 'Department name is required' });

      await ensureMongoConnected();
      const departmentId = `DEPT-${Date.now().toString().slice(-4)}`;
      const newDept = {
        departmentId,
        name: name.trim(),
        head: head || '',
        description: description || '',
        budget: Number(budget) || 0
      };

      const created = await PrmaDepartmentModel.create(newDept);
      await logAudit('DEPARTMENT_CREATED', 'HR', departmentId, `Created department ${name}`);
      res.status(201).json({ success: true, department: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create department', details: err.message });
    }
  });

  router.delete('/admin/departments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      await PrmaDepartmentModel.findOneAndDelete({ $or: [{ departmentId: id }, { _id: id }] });
      res.json({ success: true, message: 'Department deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete department', details: err.message });
    }
  });

  // Attendance
  router.get('/admin/attendance', async (req, res) => {
    try {
      const { date } = req.query;
      await ensureMongoConnected();
      const query = date ? { date } : {};
      const records = await PrmaAttendanceModel.find(query).sort({ date: -1 }).lean();
      res.json({ success: true, count: records.length, attendance: records });
    } catch (err) {
      const fallback = getLocalJson('prma_attendance.json', []);
      res.json({ success: true, count: fallback.length, attendance: fallback });
    }
  });

  router.post('/admin/attendance', async (req, res) => {
    try {
      const { date, employeeId, employeeName, department, status, checkInTime, checkOutTime, remarks } = req.body;
      if (!date || !employeeId) {
        return res.status(400).json({ error: 'Date and Employee ID are required' });
      }

      await ensureMongoConnected();
      const attendanceId = `ATT-${date}-${employeeId}`;
      const record = await PrmaAttendanceModel.findOneAndUpdate(
        { date, employeeId },
        {
          attendanceId,
          date,
          employeeId,
          employeeName: employeeName || 'Employee',
          department: department || '',
          status: status || 'Present',
          checkInTime: checkInTime || '',
          checkOutTime: checkOutTime || '',
          remarks: remarks || ''
        },
        { upsert: true, new: true }
      );

      res.json({ success: true, record });
    } catch (err) {
      res.status(500).json({ error: 'Failed to mark attendance', details: err.message });
    }
  });

  // =========================================================================
  // 3. PROJECT MANAGEMENT
  // =========================================================================
  router.get('/admin/projects', async (req, res) => {
    try {
      await ensureMongoConnected();
      const projects = await PrmaProjectModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: projects.length, projects });
    } catch (err) {
      const fallback = getLocalJson('prma_projects.json', []);
      res.json({ success: true, count: fallback.length, projects: fallback });
    }
  });

  router.post('/admin/projects', async (req, res) => {
    try {
      const { title, description, clientName, projectManager, teamMembers, startDate, endDate, status, budget, progress } = req.body;
      if (!title) return res.status(400).json({ error: 'Project title is required' });

      await ensureMongoConnected();
      const projectId = `PRJ-${Date.now().toString().slice(-4)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

      const newProj = {
        projectId,
        title: title.trim(),
        description: description || '',
        clientName: clientName || '',
        projectManager: projectManager || 'Unassigned',
        teamMembers: Array.isArray(teamMembers) ? teamMembers : (teamMembers ? teamMembers.split(',').map(t => t.trim()) : []),
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || '',
        status: status || 'PLANNING',
        budget: Number(budget) || 0,
        progress: Number(progress) || 0,
        milestones: [],
        tasks: []
      };

      const created = await PrmaProjectModel.create(newProj);
      await logAudit('PROJECT_CREATED', 'Projects', projectId, `Created project ${title}`);
      res.status(201).json({ success: true, project: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create project', details: err.message });
    }
  });

  router.put('/admin/projects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      const updated = await PrmaProjectModel.findOneAndUpdate(
        { $or: [{ projectId: id }, { _id: id }] },
        { ...req.body },
        { new: true }
      ).lean();

      if (!updated) return res.status(404).json({ error: 'Project not found' });
      await logAudit('PROJECT_UPDATED', 'Projects', id, `Updated project status to ${updated.status}`);
      res.json({ success: true, project: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update project', details: err.message });
    }
  });

  router.delete('/admin/projects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      await PrmaProjectModel.findOneAndDelete({ $or: [{ projectId: id }, { _id: id }] });
      await logAudit('PROJECT_DELETED', 'Projects', id, `Deleted project ${id}`);
      res.json({ success: true, message: 'Project deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete project', details: err.message });
    }
  });

  // Project Tasks
  router.post('/admin/projects/:id/tasks', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, assignee, priority, status, dueDate } = req.body;
      if (!title) return res.status(400).json({ error: 'Task title is required' });

      await ensureMongoConnected();
      const taskId = `TSK-${Date.now().toString().slice(-4)}`;
      const taskItem = {
        taskId,
        title: title.trim(),
        assignee: assignee || '',
        priority: priority || 'Medium',
        status: status || 'To Do',
        dueDate: dueDate || ''
      };

      const updated = await PrmaProjectModel.findOneAndUpdate(
        { $or: [{ projectId: id }, { _id: id }] },
        { $push: { tasks: taskItem } },
        { new: true }
      ).lean();

      res.status(201).json({ success: true, task: taskItem, project: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add project task', details: err.message });
    }
  });

  // =========================================================================
  // 4. CLIENT & BUSINESS MANAGEMENT
  // =========================================================================
  router.get('/admin/clients', async (req, res) => {
    try {
      await ensureMongoConnected();
      const clients = await PrmaClientModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: clients.length, clients });
    } catch (err) {
      const fallback = getLocalJson('prma_clients.json', []);
      res.json({ success: true, count: fallback.length, clients: fallback });
    }
  });

  router.post('/admin/clients', async (req, res) => {
    try {
      const { companyName, contactPerson, email, phone, website, industry, address, status, notes } = req.body;
      if (!companyName || !email) return res.status(400).json({ error: 'Company name and email are mandatory' });

      await ensureMongoConnected();
      const clientId = `CLI-${Date.now().toString().slice(-4)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      const newCli = {
        clientId,
        companyName: companyName.trim(),
        contactPerson: contactPerson || '',
        email: email.trim().toLowerCase(),
        phone: phone || '',
        website: website || '',
        industry: industry || 'Technology',
        address: address || '',
        status: status || 'Active',
        notes: notes || ''
      };

      const created = await PrmaClientModel.create(newCli);
      await logAudit('CLIENT_CREATED', 'Clients', clientId, `Added client ${companyName}`);
      res.status(201).json({ success: true, client: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create client', details: err.message });
    }
  });

  router.delete('/admin/clients/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      await PrmaClientModel.findOneAndDelete({ $or: [{ clientId: id }, { _id: id }] });
      res.json({ success: true, message: 'Client deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete client', details: err.message });
    }
  });

  // Enquiries (Connects with public contact and services forms!)
  router.get('/admin/enquiries', async (req, res) => {
    try {
      await ensureMongoConnected();
      const enquiries = await PrmaEnquiryModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: enquiries.length, enquiries });
    } catch (err) {
      const fallback = getLocalJson('prma_enquiries.json', []);
      res.json({ success: true, count: fallback.length, enquiries: fallback });
    }
  });

  // Public contact & enquiry submission handler
  const handlePublicEnquiry = async (req, res) => {
    try {
      const { name, fullName, email, phone, mobile, service, serviceType, message, budget } = req.body;
      const clientName = (name || fullName || '').trim();
      const clientEmail = (email || '').trim().toLowerCase();
      const clientMsg = (message || '').trim();

      if (!clientName || !clientEmail || !clientMsg) {
        return res.status(400).json({ error: 'Name, email and message are required.' });
      }

      await ensureMongoConnected();
      const enquiryId = `ENQ-${Date.now().toString().slice(-5)}`;
      const enquiryItem = {
        enquiryId,
        name: clientName,
        email: clientEmail,
        phone: phone || mobile || '',
        serviceType: service || serviceType || 'General Technology Solution',
        message: clientMsg,
        budget: budget || '',
        status: 'New',
        source: 'Public Web Portal'
      };

      const created = await PrmaEnquiryModel.create(enquiryItem);
      await logAudit('NEW_ENQUIRY_RECEIVED', 'Clients', enquiryId, `Enquiry from ${clientName} (${clientEmail})`);

      res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Our technology team will review your enquiry and respond shortly.',
        enquiryId
      });
    } catch (err) {
      console.error('[PUBLIC ENQUIRY] Error:', err);
      res.status(500).json({ error: 'Failed to record enquiry: ' + err.message });
    }
  };

  router.post('/contact', handlePublicEnquiry);
  router.post('/admin/enquiries', handlePublicEnquiry);

  router.put('/admin/enquiries/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      await ensureMongoConnected();
      const updated = await PrmaEnquiryModel.findOneAndUpdate(
        { $or: [{ enquiryId: id }, { _id: id }] },
        { status, adminNotes },
        { new: true }
      ).lean();

      res.json({ success: true, enquiry: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update enquiry status', details: err.message });
    }
  });

  router.delete('/admin/enquiries/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      await PrmaEnquiryModel.findOneAndDelete({ $or: [{ enquiryId: id }, { _id: id }] });
      res.json({ success: true, message: 'Enquiry removed' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete enquiry', details: err.message });
    }
  });

  // =========================================================================
  // 5. EVENTS & HACKATHONS
  // =========================================================================
  router.get('/admin/events', async (req, res) => {
    try {
      await ensureMongoConnected();
      const events = await PrmaEventModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: events.length, events });
    } catch (err) {
      const fallback = getLocalJson('prma_events.json', []);
      res.json({ success: true, count: fallback.length, events: fallback });
    }
  });

  router.post('/admin/events', async (req, res) => {
    try {
      const { title, description, eventDate, registrationDeadline, prizePool, mode, maxParticipants, status } = req.body;
      if (!title || !eventDate) return res.status(400).json({ error: 'Event title and date are required' });

      await ensureMongoConnected();
      const eventId = `EVT-${Date.now().toString().slice(-4)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      const newEvt = {
        eventId,
        title: title.trim(),
        description: description || '',
        eventDate,
        registrationDeadline: registrationDeadline || '',
        prizePool: prizePool || '',
        mode: mode || 'Virtual',
        status: status || 'Upcoming',
        maxParticipants: Number(maxParticipants) || 500,
        registrationsCount: 0,
        winners: []
      };

      const created = await PrmaEventModel.create(newEvt);
      await logAudit('EVENT_CREATED', 'Events', eventId, `Created event ${title}`);
      res.status(201).json({ success: true, event: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create event', details: err.message });
    }
  });

  router.delete('/admin/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      await PrmaEventModel.findOneAndDelete({ $or: [{ eventId: id }, { _id: id }] });
      res.json({ success: true, message: 'Event deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete event', details: err.message });
    }
  });

  router.get('/admin/event-registrations', async (req, res) => {
    try {
      await ensureMongoConnected();
      const regs = await PrmaEventRegistrationModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: regs.length, registrations: regs });
    } catch (err) {
      res.json({ success: true, count: 0, registrations: [] });
    }
  });

  // =========================================================================
  // 6. INVENTORY & GOODIES
  // =========================================================================
  router.get('/admin/inventory', async (req, res) => {
    try {
      await ensureMongoConnected();
      const items = await PrmaInventoryModel.find({}).sort({ name: 1 }).lean();
      res.json({ success: true, count: items.length, inventory: items });
    } catch (err) {
      const fallback = getLocalJson('prma_inventory.json', []);
      res.json({ success: true, count: fallback.length, inventory: fallback });
    }
  });

  router.post('/admin/inventory', async (req, res) => {
    try {
      const { name, sku, category, stockQuantity, minAlertStock, unitCost } = req.body;
      if (!name || !sku) return res.status(400).json({ error: 'Item name and SKU are required' });

      await ensureMongoConnected();
      const itemId = `INV-${Date.now().toString().slice(-4)}`;
      const qty = Number(stockQuantity) || 0;
      const minAlert = Number(minAlertStock) || 10;
      const status = qty === 0 ? 'Out of Stock' : (qty <= minAlert ? 'Low Stock' : 'In Stock');

      const newItem = {
        itemId,
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        category: category || 'Welcome Kit',
        stockQuantity: qty,
        minAlertStock: minAlert,
        unitCost: Number(unitCost) || 0,
        status,
        lastRestocked: new Date().toISOString().split('T')[0]
      };

      const created = await PrmaInventoryModel.create(newItem);
      await logAudit('INVENTORY_ITEM_ADDED', 'Inventory', itemId, `Added ${name} (Stock: ${qty})`);
      res.status(201).json({ success: true, item: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add inventory item', details: err.message });
    }
  });

  router.put('/admin/inventory/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { stockQuantity, minAlertStock, unitCost, name, category } = req.body;
      await ensureMongoConnected();

      const existing = await PrmaInventoryModel.findOne({ $or: [{ itemId: id }, { _id: id }] });
      if (!existing) return res.status(404).json({ error: 'Item not found' });

      if (stockQuantity !== undefined) existing.stockQuantity = Number(stockQuantity);
      if (minAlertStock !== undefined) existing.minAlertStock = Number(minAlertStock);
      if (unitCost !== undefined) existing.unitCost = Number(unitCost);
      if (name) existing.name = name;
      if (category) existing.category = category;

      existing.status = existing.stockQuantity === 0 ? 'Out of Stock' : (existing.stockQuantity <= existing.minAlertStock ? 'Low Stock' : 'In Stock');
      await existing.save();

      res.json({ success: true, item: existing });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update item', details: err.message });
    }
  });

  router.delete('/admin/inventory/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      await PrmaInventoryModel.findOneAndDelete({ $or: [{ itemId: id }, { _id: id }] });
      res.json({ success: true, message: 'Item deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete item', details: err.message });
    }
  });

  // Dispatches
  router.get('/admin/dispatches', async (req, res) => {
    try {
      await ensureMongoConnected();
      const dispatches = await PrmaDispatchModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: dispatches.length, dispatches });
    } catch (err) {
      const fallback = getLocalJson('prma_dispatches.json', []);
      res.json({ success: true, count: fallback.length, dispatches: fallback });
    }
  });

  router.post('/admin/dispatches', async (req, res) => {
    try {
      const { recipientName, recipientEmail, recipientPhone, recipientAddress, courierName, trackingNumber, notes, items } = req.body;
      if (!recipientName || !recipientAddress) {
        return res.status(400).json({ error: 'Recipient name and delivery address are mandatory.' });
      }

      await ensureMongoConnected();
      const dispatchId = `DSP-${Date.now().toString().slice(-4)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      const newDsp = {
        dispatchId,
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail || '',
        recipientPhone: recipientPhone || '',
        recipientAddress: recipientAddress.trim(),
        courierName: courierName || 'India Post / BlueDart',
        trackingNumber: trackingNumber || '',
        dispatchDate: new Date().toISOString().split('T')[0],
        deliveryStatus: 'Dispatched',
        notes: notes || '',
        items: Array.isArray(items) ? items : []
      };

      const created = await PrmaDispatchModel.create(newDsp);
      await logAudit('DISPATCH_RECORD_CREATED', 'Inventory', dispatchId, `Dispatched parcel to ${recipientName}`);
      res.status(201).json({ success: true, dispatch: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to record dispatch', details: err.message });
    }
  });

  router.put('/admin/dispatches/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { deliveryStatus, trackingNumber } = req.body;
      await ensureMongoConnected();
      const updated = await PrmaDispatchModel.findOneAndUpdate(
        { $or: [{ dispatchId: id }, { _id: id }] },
        {
          deliveryStatus,
          trackingNumber,
          ...(deliveryStatus === 'Delivered' ? { deliveredDate: new Date().toISOString().split('T')[0] } : {})
        },
        { new: true }
      ).lean();

      res.json({ success: true, dispatch: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update dispatch status', details: err.message });
    }
  });

  // =========================================================================
  // 7. FINANCE & ACCOUNTING
  // =========================================================================
  router.get('/admin/transactions', async (req, res) => {
    try {
      await ensureMongoConnected();
      const txs = await PrmaTransactionModel.find({}).sort({ date: -1, createdAt: -1 }).lean();

      let totalIncome = 0;
      let totalExpenses = 0;
      txs.forEach(t => {
        if (t.status === 'Completed') {
          if (t.type === 'Income') totalIncome += Number(t.amount || 0);
          if (t.type === 'Expense') totalExpenses += Number(t.amount || 0);
        }
      });

      res.json({
        success: true,
        summary: {
          totalIncome,
          totalExpenses,
          netBalance: totalIncome - totalExpenses
        },
        count: txs.length,
        transactions: txs
      });
    } catch (err) {
      const fallback = getLocalJson('prma_transactions.json', []);
      res.json({
        success: true,
        summary: { totalIncome: 0, totalExpenses: 0, netBalance: 0 },
        count: fallback.length,
        transactions: fallback
      });
    }
  });

  router.post('/admin/transactions', async (req, res) => {
    try {
      const { type, category, amount, date, paymentMethod, referenceNumber, clientOrVendor, description } = req.body;
      if (!type || !category || !amount) {
        return res.status(400).json({ error: 'Transaction type, category, and amount are required.' });
      }

      await ensureMongoConnected();
      const transactionId = `TXN-${Date.now().toString().slice(-5)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      const newTx = {
        transactionId,
        type: type === 'Income' ? 'Income' : 'Expense',
        category,
        amount: Number(amount) || 0,
        currency: 'INR',
        date: date || new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod || 'Bank Transfer',
        referenceNumber: referenceNumber || '',
        clientOrVendor: clientOrVendor || '',
        description: description || '',
        status: 'Completed'
      };

      const created = await PrmaTransactionModel.create(newTx);
      await logAudit('TRANSACTION_RECORDED', 'Finance', transactionId, `${type} of ₹${amount} (${category})`);

      res.status(201).json({ success: true, transaction: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to record transaction', details: err.message });
    }
  });

  router.delete('/admin/transactions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      await PrmaTransactionModel.findOneAndDelete({ $or: [{ transactionId: id }, { _id: id }] });
      await logAudit('TRANSACTION_DELETED', 'Finance', id, `Removed transaction ${id}`);
      res.json({ success: true, message: 'Transaction record deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete transaction', details: err.message });
    }
  });

  // Invoices
  router.get('/admin/invoices', async (req, res) => {
    try {
      await ensureMongoConnected();
      const invoices = await PrmaInvoiceModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: invoices.length, invoices });
    } catch (err) {
      const fallback = getLocalJson('prma_invoices.json', []);
      res.json({ success: true, count: fallback.length, invoices: fallback });
    }
  });

  router.post('/admin/invoices', async (req, res) => {
    try {
      const { clientName, clientEmail, dueDate, items, tax, notes } = req.body;
      if (!clientName || !clientEmail || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Client name, email, and at least one line item are required.' });
      }

      await ensureMongoConnected();
      const invoiceNumber = `PRMA-INV-2026-${Date.now().toString().slice(-4)}`;
      const invoiceId = `INV-${Date.now().toString().slice(-6)}`;

      let subtotal = 0;
      const formattedItems = items.map(it => {
        const qty = Number(it.quantity) || 1;
        const price = Number(it.unitPrice) || 0;
        const amount = qty * price;
        subtotal += amount;
        return {
          description: it.description || 'Professional Technology Service',
          quantity: qty,
          unitPrice: price,
          amount
        };
      });

      const taxAmount = Number(tax) || 0;
      const totalAmount = subtotal + taxAmount;

      const newInv = {
        invoiceId,
        invoiceNumber,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        items: formattedItems,
        subtotal,
        tax: taxAmount,
        totalAmount,
        status: 'Sent',
        notes: notes || 'Thank you for partnering with PRMA Tech.'
      };

      const created = await PrmaInvoiceModel.create(newInv);
      await logAudit('INVOICE_GENERATED', 'Finance', invoiceNumber, `Invoice for ${clientName} — ₹${totalAmount}`);
      res.status(201).json({ success: true, invoice: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create invoice', details: err.message });
    }
  });

  // =========================================================================
  // 8. CERTIFICATES & SCANNABLE QR VERIFICATION
  // =========================================================================
  router.get('/admin/certificates', async (req, res) => {
    try {
      await ensureMongoConnected();
      const certs = await PrmaCertificateModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: certs.length, certificates: certs });
    } catch (err) {
      const fallback = getLocalJson('prma_certificates.json', []);
      res.json({ success: true, count: fallback.length, certificates: fallback });
    }
  });

  router.post('/admin/certificates/issue', async (req, res) => {
    try {
      const { offerId, applicationId } = req.body;
      if (!offerId && !applicationId) {
        return res.status(400).json({ error: 'Offer ID or Application ID is required to issue certificate.' });
      }

      await ensureMongoConnected();
      const app = await getApplication(offerId || applicationId);
      if (!app) return res.status(404).json({ error: 'Candidate application not found.' });

      // Verify Eligibility: Check submission progress
      let sub = null;
      try {
        sub = await PrmaSubmissionModel.findOne({
          $or: [{ offerId: app.offerId }, { applicationId: app.applicationId }]
        }).lean();
      } catch (e) {}

      const approvedWeeks = sub ? (sub.tasks || []).filter(t => t.status === 'approved').length : 0;
      if (approvedWeeks < 4 && app.status !== 'approved') {
        return res.status(400).json({
          error: `Eligibility criteria not met: Candidate has completed ${approvedWeeks}/4 approved weekly deliverables. Certificates require all 4 milestones approved by the mentorship board.`
        });
      }

      const certNumber = `PRMA-CERT-2026-${Date.now().toString().slice(-5)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      const baseUrl = process.env.APP_BASE_URL || 'https://professorvirus.site';
      const verificationUrl = `${baseUrl}/prma-tech/verify-certificate/${certNumber}`;

      const newCert = {
        certificateId: certNumber,
        offerId: app.offerId || 'PRMA/INT/VERIFIED',
        applicationId: app.applicationId,
        studentName: app.student?.fullName || 'Verified Intern',
        email: app.student?.email || '',
        college: app.academic?.college || app.student?.college || 'Affiliated Institution',
        domainTitle: app.technical?.domainTitle || app.domain?.title || 'Technology Track',
        duration: app.duration || '1 Month',
        joiningDate: app.joiningDate || '17-Nov-2026',
        completionDate: app.completionDate || '17-Dec-2026',
        issuedDate: new Date().toISOString().split('T')[0],
        signatory: 'Priyanshu Kumar, Founder & Authorized Representative, PRMA Tech',
        verificationUrl,
        status: 'Issued'
      };

      const created = await PrmaCertificateModel.create(newCert);
      await logAudit('CERTIFICATE_ISSUED', 'Certificates', certNumber, `Issued completion certificate to ${app.student?.fullName}`);

      res.status(201).json({
        success: true,
        message: `✓ Official Completion Certificate ${certNumber} issued successfully!`,
        certificate: created
      });
    } catch (err) {
      console.error('[CERTIFICATE ISSUE] Error:', err);
      res.status(500).json({ error: 'Failed to issue certificate: ' + err.message });
    }
  });

  // Public Scannable Certificate Verification Endpoint
  router.get('/verify-certificate/:certificateId', async (req, res) => {
    try {
      const { certificateId } = req.params;
      await ensureMongoConnected();
      const cert = await PrmaCertificateModel.findOne({
        $or: [
          { certificateId },
          { certificateId: new RegExp('^' + certificateId + '$', 'i') }
        ]
      }).lean();

      if (!cert) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: `No authentic PRMA Tech Certificate record found for ID: "${certificateId}".`
        });
      }

      // Increment view counter
      try {
        await PrmaCertificateModel.updateOne({ certificateId: cert.certificateId }, { $inc: { viewCount: 1 } });
      } catch (e) {}

      res.json({
        success: true,
        verified: true,
        certificate: {
          certificateId: cert.certificateId,
          studentName: cert.studentName,
          college: cert.college,
          domain: cert.domainTitle,
          duration: cert.duration,
          joiningDate: cert.joiningDate,
          completionDate: cert.completionDate,
          issuedDate: cert.issuedDate,
          signatory: cert.signatory,
          status: 'Authentic & Verified',
          corporateAddress: 'PRMA Tech, Knowledge Park, Greater Noida, Uttar Pradesh – 201310',
          verifiedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Verification failed', details: err.message });
    }
  });

  // =========================================================================
  // 9. ANNOUNCEMENTS & AUDIT LOGS
  // =========================================================================
  router.get('/admin/announcements', async (req, res) => {
    try {
      await ensureMongoConnected();
      const announcements = await PrmaAnnouncementModel.find({}).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: announcements.length, announcements });
    } catch (err) {
      res.json({ success: true, count: 0, announcements: [] });
    }
  });

  router.post('/admin/announcements', async (req, res) => {
    try {
      const { title, message, targetAudience, priority, author } = req.body;
      if (!title || !message) return res.status(400).json({ error: 'Title and message are required' });

      await ensureMongoConnected();
      const announcementId = `ANN-${Date.now().toString().slice(-4)}`;
      const newAnn = {
        announcementId,
        title: title.trim(),
        message: message.trim(),
        targetAudience: targetAudience || 'All Interns',
        priority: priority || 'Normal',
        author: author || 'Admin'
      };

      const created = await PrmaAnnouncementModel.create(newAnn);
      await logAudit('ANNOUNCEMENT_POSTED', 'Communications', announcementId, `Broadcast: ${title}`);
      res.status(201).json({ success: true, announcement: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to post announcement', details: err.message });
    }
  });

  router.delete('/admin/announcements/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await ensureMongoConnected();
      await PrmaAnnouncementModel.findOneAndDelete({ $or: [{ announcementId: id }, { _id: id }] });
      res.json({ success: true, message: 'Announcement deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete announcement', details: err.message });
    }
  });

  // Immutable Audit Logs
  router.get('/admin/audit-logs', async (req, res) => {
    try {
      await ensureMongoConnected();
      const logs = await PrmaAuditLogModel.find({}).sort({ createdAt: -1 }).limit(100).lean();
      res.json({ success: true, count: logs.length, logs });
    } catch (err) {
      const fallback = getLocalJson('prma_audit_logs.json', []);
      res.json({ success: true, count: fallback.length, logs: fallback });
    }
  });

  // =========================================================================
  // 10. SYSTEM HEALTH & INTEGRATIONS DIAGNOSTICS
  // =========================================================================
  router.get('/admin/system-health', async (req, res) => {
    try {
      const startTime = Date.now();
      const dbConnected = await ensureMongoConnected();
      const pingLatency = Date.now() - startTime;

      const memoryUsage = process.memoryUsage();
      const uptimeSeconds = Math.floor(process.uptime());

      // Check configured SMTP
      const smtpHost = process.env.SMTP_HOST || 'Not Configured';
      const smtpUser = process.env.SMTP_USER || 'Not Configured';
      const hasSmtpPassword = Boolean(process.env.SMTP_PASSWORD);

      res.json({
        success: true,
        health: {
          status: dbConnected ? 'HEALTHY' : 'DEGRADED',
          timestamp: new Date().toISOString(),
          uptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`,
          database: {
            engine: 'MongoDB Atlas Replica Set',
            connected: dbConnected,
            latencyMs: pingLatency
          },
          system: {
            nodeVersion: process.version,
            heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            rssMb: Math.round(memoryUsage.rss / 1024 / 1024)
          },
          integrations: {
            smtpEmail: {
              configured: hasSmtpPassword,
              host: smtpHost,
              user: smtpUser,
              senderName: process.env.EMAIL_FROM_NAME || 'PRMA Tech'
            },
            googleFormWebhook: {
              configured: true,
              endpoint: '/api/prma/submissions/google-form-webhook'
            },
            storage: {
              type: 'MongoDB Atlas Vector Store + Disk Cache',
              maxPayloadMb: 50
            }
          }
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'System health check failed', details: err.message });
    }
  });

  // Genuine SMTP Email Connection Test (Never fabricated!)
  router.post('/admin/test-smtp', async (req, res) => {
    const { testRecipient } = req.body;
    const recipient = (testRecipient || process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || '').trim();

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (!host || !user || !pass) {
      return res.status(400).json({
        success: false,
        connected: false,
        message: 'SMTP credentials missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD in server/.env or environment variables.'
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 8000,
        greetingTimeout: 8000
      });

      // Verify connection
      await transporter.verify();

      // If test recipient provided, send a genuine ping email
      if (recipient) {
        await transporter.sendMail({
          from: `"${process.env.EMAIL_FROM_NAME || 'PRMA Tech'}" <${process.env.EMAIL_FROM || user}>`,
          to: recipient,
          subject: 'PRMA Tech Command Center — SMTP Diagnostic Verification',
          text: `This is an official automated test ping dispatched from PRMA Tech Command Center at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}. Your SMTP integration is working flawlessly.`,
          html: `<div style="font-family:sans-serif;padding:24px;border:1px solid #E5E7EB;border-radius:12px;max-width:500px;">
            <h3 style="color:#780D29;margin-top:0;">✓ PRMA Tech SMTP Diagnostic</h3>
            <p>Your mail server connection is confirmed active and operational.</p>
            <p style="font-size:12px;color:#6B7280;">Host: ${host}:${port}<br>User: ${user}<br>Dispatched At: ${new Date().toISOString()}</p>
          </div>`
        });
      }

      await logAudit('SMTP_TEST_SUCCESS', 'System', host, `Verified SMTP provider ${host}`);

      res.json({
        success: true,
        connected: true,
        message: `✓ SMTP connection verified successfully with host ${host}! Test message dispatched to ${recipient}.`
      });
    } catch (err) {
      console.error('[SMTP TEST] Error:', err.message);
      res.status(502).json({
        success: false,
        connected: false,
        message: `SMTP Connection Failed: ${err.message}`,
        details: err.code || err.command || 'Connection refused or credentials rejected.'
      });
    }
  });

  return router;
}
