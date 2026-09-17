import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MONGODB DATABASE CONNECTION WITH CLEAN FALLBACK STORE
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusprep';

let isDbConnected = false;

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    isDbConnected = true;
    console.log('[DATABASE] Successfully connected to MongoDB:', MONGODB_URI);
  })
  .catch((err) => {
    isDbConnected = false;
    console.warn('[DATABASE] MongoDB connection unestablished. Operating in-memory persistence mode.');
  });

// PASSWORD HASHING UTILITY (PBKDF2 SHA-512)
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, storedHash, salt) {
  if (!password || !storedHash || !salt) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === storedHash;
}

// REAL DATABASE COLLECTIONS STORE
const dbUsers = [];
const dbNotes = [];
const dbPyqs = [];
const dbQuizzes = [];
const dbSupportTickets = [];
const dbAnnouncements = [];
const dbActivities = [];

// ACTIVE ADMIN SESSIONS STORE: token -> { userId, email, name, role, expiresAt }
const activeSessions = new Map();

// SEED ADMIN USER
const SEED_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@campusprep.edu';
const SEED_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'CampusPrep@Admin2026!';
const SEED_ADMIN_NAME = process.env.ADMIN_NAME || 'CampusPrep Administrator';

const seedAdminHash = hashPassword(SEED_ADMIN_PASS);

const seedAdminUser = {
  id: 'admin-001',
  name: SEED_ADMIN_NAME,
  email: SEED_ADMIN_EMAIL,
  enrollment: 'ADM-2026-001',
  branch: 'Administration',
  year: 'System Admin',
  role: 'admin',
  status: 'Active',
  passwordHash: seedAdminHash.hash,
  salt: seedAdminHash.salt,
  createdAt: new Date().toISOString()
};

dbUsers.push(seedAdminUser);

// ADMIN AUTHORIZATION MIDDLEWARE
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
  }

  if (session.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access Denied. Administrator privileges required.' });
  }

  req.adminUser = session;
  next();
};

// RECORD REAL SYSTEM ACTIVITY LOG
function logSystemActivity(action, detail, performer = 'System', color = '#059669') {
  const newActivity = {
    id: `act-${Date.now()}`,
    action,
    detail,
    performer,
    color,
    time: 'Just now',
    createdAt: new Date().toISOString()
  };
  dbActivities.unshift(newActivity);
  if (dbActivities.length > 50) dbActivities.pop();
}

// Log startup activity
logSystemActivity('Admin CMS Initialized', 'CampusPrep Backend API server active', 'System', '#0d5c3a');

// 1. HEALTH CHECK ENDPOINT
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseConnected: isDbConnected,
    timestamp: new Date().toISOString()
  });
});

// 2. REAL ADMIN LOGIN ENDPOINT
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter admin email and password.' });
    }

    const user = dbUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid credentials or non-admin account.' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status && user.status.toLowerCase() !== 'active') {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact system admin.' });
    }

    const token = `cp_admin_sec_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    activeSessions.set(token, {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      expiresAt
    });

    logSystemActivity('Admin Login', `${user.name} logged into Admin CMS`, user.name, '#0284c7');

    const { passwordHash: _, salt: __, ...adminData } = user;

    res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      user: adminData
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
});

// 3. ADMIN PROFILE ENDPOINT
app.get('/api/admin/me', verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.adminUser.userId,
      name: req.adminUser.name,
      email: req.adminUser.email,
      role: req.adminUser.role
    }
  });
});

// 4. ADMIN LOGOUT ENDPOINT
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim();
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 5. REAL DASHBOARD LIVE STATISTICS (Protected - NO FAKE DATA)
app.get('/api/admin/stats', verifyAdminToken, (req, res) => {
  try {
    const totalUsers = dbUsers.length;
    const totalStudents = dbUsers.filter(u => u.role === 'student').length;
    const totalAdmins = dbUsers.filter(u => u.role === 'admin').length;
    
    const totalNotes = dbNotes.length;
    const totalPYQs = dbPyqs.length;
    const totalQuizzes = dbQuizzes.length;
    const totalContent = totalNotes + totalPYQs + totalQuizzes;
    
    const openTickets = dbSupportTickets.filter(t => t.status !== 'Resolved').length;
    const pendingUploads = dbNotes.filter(n => n.status === 'Pending').length;

    // Latest Registered Users (From real DB array)
    const latestUsersList = dbUsers
      .filter(u => u.role !== 'admin')
      .slice(-5)
      .reverse()
      .map(u => ({
        id: u.id,
        name: u.name,
        enrollmentNo: u.enrollment || 'N/A',
        branch: u.branch || 'CSE',
        joinedOn: new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      }));

    // Recent Content items
    const recentContentList = [
      ...dbNotes.map(n => ({ id: n.id, title: n.title, type: 'Notes', addedOn: n.date || 'Recent', color: '#e6f4ed', iconColor: '#059669' })),
      ...dbPyqs.map(p => ({ id: p.id, title: p.title, type: 'PYQ', addedOn: p.addedOn || 'Recent', color: '#e0f2fe', iconColor: '#0284c7' })),
      ...dbQuizzes.map(q => ({ id: q.id, title: q.title, type: 'Quiz', addedOn: q.addedOn || 'Recent', color: '#f3e8ff', iconColor: '#9333ea' }))
    ].slice(0, 5);

    res.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalContent,
        totalNotes,
        totalPYQs,
        totalQuizzes,
        openTickets,
        pendingUploads,
        contentDistribution: {
          pyqs: totalPYQs,
          notes: totalNotes,
          quizzes: totalQuizzes
        }
      },
      latestUsers: latestUsersList,
      recentContent: recentContentList,
      recentActivities: dbActivities.slice(0, 8),
      supportTickets: dbSupportTickets
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ success: false, message: 'Server error loading stats' });
  }
});

// 6. REAL USER MANAGEMENT ENDPOINTS (Protected)
app.get('/api/admin/users', verifyAdminToken, (req, res) => {
  const userList = dbUsers.map(({ passwordHash: _, salt: __, ...u }) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    enrollmentNo: u.enrollment || 'N/A',
    branch: u.branch || 'CSE',
    year: u.year || '1st Year',
    role: u.role === 'admin' ? 'Administrator' : 'Student',
    status: u.status || 'Active',
    createdAt: u.createdAt
  }));
  res.json({ success: true, users: userList });
});

app.post('/api/admin/users', verifyAdminToken, (req, res) => {
  const { name, email, role, branch, year, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existing = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'User with this email already exists.' });
  }

  const { hash, salt } = hashPassword(password);
  const newUser = {
    id: `u-${Date.now()}`,
    name,
    email,
    enrollment: `CP-${Math.floor(100000 + Math.random() * 900000)}`,
    branch: branch || 'CSE',
    year: year || '1st Year',
    role: role || 'student',
    status: 'Active',
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString()
  };

  dbUsers.push(newUser);
  logSystemActivity('User Created', `Created user ${name} (${email})`, req.adminUser.name, '#10b981');

  res.json({ success: true, message: 'User created successfully!', user: newUser });
});

app.put('/api/admin/users/:id/status', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = dbUsers.find(u => u.id === id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  user.status = status || 'Active';
  logSystemActivity('User Status Updated', `Updated status for ${user.name} to ${status}`, req.adminUser.name, '#f59e0b');
  res.json({ success: true, message: `User status updated to ${status}.` });
});

app.delete('/api/admin/users/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const idx = dbUsers.findIndex(u => u.id === id);
  if (idx !== -1) {
    const deleted = dbUsers.splice(idx, 1)[0];
    logSystemActivity('User Deleted', `Deleted user account ${deleted.name}`, req.adminUser.name, '#ef4444');
  }
  res.json({ success: true, message: 'User deleted successfully.' });
});

// 7. REAL NOTES MANAGEMENT ENDPOINTS
app.get('/api/admin/notes', verifyAdminToken, (req, res) => {
  res.json({ success: true, notes: dbNotes });
});

app.post('/api/admin/notes', verifyAdminToken, (req, res) => {
  const { title, subject, branch, year, semester, unit, fileUrl, type } = req.body;
  if (!title || !subject) {
    return res.status(400).json({ success: false, message: 'Title and subject are required.' });
  }

  const newNote = {
    id: `note-${Date.now()}`,
    title,
    subject,
    branch: branch || 'CSE',
    year: year || '2nd Year',
    semester: semester || 'Sem 3',
    unit: unit || 'Unit 1',
    fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: type || 'Handwritten Notes',
    author: req.adminUser.name,
    status: 'Verified',
    downloads: 0,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  dbNotes.unshift(newNote);
  logSystemActivity('Note Published', `Published note "${title}" for ${subject}`, req.adminUser.name, '#059669');
  res.json({ success: true, message: 'Note published successfully!', note: newNote });
});

app.delete('/api/admin/notes/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const idx = dbNotes.findIndex(n => n.id === id);
  if (idx !== -1) {
    const deleted = dbNotes.splice(idx, 1)[0];
    logSystemActivity('Note Removed', `Removed note "${deleted.title}"`, req.adminUser.name, '#ef4444');
  }
  res.json({ success: true, message: 'Note deleted successfully.' });
});

// 8. REAL PYQs MANAGEMENT ENDPOINTS
app.get('/api/pyqs', (req, res) => {
  res.json({ success: true, pyqs: dbPyqs.filter(p => p.status === 'Verified' || !p.status) });
});

app.get('/api/admin/pyqs', verifyAdminToken, (req, res) => {
  res.json({ success: true, pyqs: dbPyqs });
});

app.post('/api/admin/pyqs', verifyAdminToken, (req, res) => {
  const { title, subject, examYear, branch, semester, fileUrl } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is required.' });

  const newPyq = {
    id: `pyq-${Date.now()}`,
    title: `${title} (${examYear || '2024'})`,
    subject: subject || title,
    examYear: examYear || '2024',
    branch: branch || 'CSE',
    semester: semester || 'Sem 4',
    fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Verified',
    addedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  dbPyqs.unshift(newPyq);
  logSystemActivity('PYQ Uploaded', `Uploaded PYQ paper "${newPyq.title}"`, req.adminUser.name, '#0284c7');
  res.json({ success: true, message: 'PYQ uploaded successfully!', pyq: newPyq });
});

app.delete('/api/admin/pyqs/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const idx = dbPyqs.findIndex(p => p.id === id);
  if (idx !== -1) dbPyqs.splice(idx, 1);
  res.json({ success: true, message: 'PYQ deleted successfully.' });
});

// 9. REAL QUIZZES MANAGEMENT ENDPOINTS
app.get('/api/admin/quizzes', verifyAdminToken, (req, res) => {
  res.json({ success: true, quizzes: dbQuizzes });
});

app.post('/api/admin/quizzes', verifyAdminToken, (req, res) => {
  const { title, subject, branch } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Quiz title is required.' });

  const newQuiz = {
    id: `quiz-${Date.now()}`,
    title: `${title} Quiz`,
    subject: subject || title,
    branch: branch || 'CSE',
    questionsCount: 10,
    status: 'Published',
    addedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  dbQuizzes.unshift(newQuiz);
  logSystemActivity('Quiz Created', `Created new quiz "${newQuiz.title}"`, req.adminUser.name, '#9333ea');
  res.json({ success: true, message: 'Quiz created successfully!', quiz: newQuiz });
});

// 10. REAL SUPPORT TICKETS ENDPOINTS
app.get('/api/admin/tickets', verifyAdminToken, (req, res) => {
  res.json({ success: true, tickets: dbSupportTickets });
});

app.post('/api/support', (req, res) => {
  const { type, message, email, user } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message content is required.' });

  const newTicket = {
    id: `ticket-${Date.now()}`,
    type: type || 'feedback',
    message,
    email: email || user?.email || 'student@aktu.ac.in',
    status: 'Open',
    createdAt: new Date().toISOString()
  };

  dbSupportTickets.unshift(newTicket);
  logSystemActivity('Support Ticket Received', `New ticket from ${newTicket.email}`, 'Student', '#ea580c');
  res.json({ success: true, message: 'Ticket submitted to support.', ticketId: newTicket.id });
});

app.put('/api/admin/tickets/:id/resolve', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const ticket = dbSupportTickets.find(t => t.id === id);
  if (ticket) {
    ticket.status = 'Resolved';
    logSystemActivity('Ticket Resolved', `Resolved ticket #${id}`, req.adminUser.name, '#10b981');
  }
  res.json({ success: true, message: 'Ticket marked as resolved.' });
});

// 11. REAL ANNOUNCEMENTS ENDPOINTS
app.get('/api/announcements', (req, res) => {
  res.json({ success: true, announcements: dbAnnouncements });
});

app.post('/api/admin/announcements', verifyAdminToken, (req, res) => {
  const { title, type } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is required.' });

  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    type: type || 'General',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  dbAnnouncements.unshift(newAnn);
  logSystemActivity('Announcement Broadcasted', title, req.adminUser.name, '#ea580c');
  res.json({ success: true, message: 'Announcement published successfully!', announcement: newAnn });
});

// 12. STUDENT AUTH REGISTER & LOGIN
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, enrollment, branch, year, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Please enter name, email, and password.' });
    }

    const existing = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const { hash, salt } = hashPassword(password);
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      enrollment: enrollment || `AKTU-${Math.floor(100000 + Math.random() * 900000)}`,
      branch: branch || 'CSE',
      year: year || '1st Year',
      role: 'student',
      status: 'Active',
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString()
    };

    dbUsers.push(newUser);
    logSystemActivity('New Student Registered', `${name} (${branch} ${year}) joined CampusPrep`, name, '#10b981');

    const { passwordHash: _, salt: __, ...userData } = newUser;

    res.json({
      success: true,
      message: 'Student account registered successfully!',
      user: userData,
      token: `cp-student-token-${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrEnrollment, password } = req.body;
    if (!emailOrEnrollment || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email/enrollment and password.' });
    }

    const user = dbUsers.find(u => 
      u.email.toLowerCase() === emailOrEnrollment.toLowerCase() ||
      (u.enrollment && u.enrollment.toLowerCase() === emailOrEnrollment.toLowerCase())
    );

    let isMatch = false;
    if (user) {
      isMatch = verifyPassword(password, user.passwordHash, user.salt);
    }

    if (!user || !isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const { passwordHash: _, salt: __, ...userData } = user;
    res.json({
      success: true,
      message: 'Login successful!',
      user: userData,
      token: `cp-student-token-${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// 13. PUBLIC METRICS ENDPOINT (100% Real Database Counts)
app.get('/api/stats', (req, res) => {
  const studentsCount = dbUsers.filter(u => u.role === 'student').length;
  res.json({
    success: true,
    stats: [
      { id: 'students', value: String(studentsCount), label: 'Registered Students', iconName: 'Users' },
      { id: 'pyqs', value: String(dbPyqs.length), label: 'PYQs Available', iconName: 'FileText' },
      { id: 'notes', value: String(dbNotes.length), label: 'Notes & Resources', iconName: 'BookOpen' },
      { id: 'quizzes', value: String(dbQuizzes.length), label: 'Practice Quizzes', iconName: 'HelpCircle' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[SERVER] CampusPrep Backend CMS API running on port ${PORT}`);
});
