# PRMA Tech & ProfessorVirus Transactional Email & Onboarding Setup

Add these environment variables to your production environment on Vercel or `server/.env`:

```env
# SMTP Provider Settings (Gmail, SendGrid, Resend, Brevo, AWS SES)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=support@prmatech.com
SMTP_PASSWORD=your_secure_smtp_app_password_here

# Sender Identity
EMAIL_FROM=support@prmatech.com
EMAIL_FROM_NAME=PRMA Tech

# Application Base URL (Used for generating student submission portal links and verification QR codes)
APP_BASE_URL=https://professorvirus.site

# Admin Notification Receiver (Receives real-time alerts when students submit weekly tasks)
ADMIN_NOTIFICATION_EMAIL=support@prmatech.com
```

## System Workflow:
1. **Approval**: When admin approves an applicant in the Admin Panel (`/prma-tech/admin`), the backend:
   - Generates the Official Joining Letter PDF with vector overlays and scannable QR verification link.
   - Generates the personalized 10-Page Problem Statement PDF with 4 weekly task milestones and embedded student submission link.
   - Dispatches the redesigned corporate PRMA Tech Onboarding Email attaching both PDFs and linking to the candidate's unique submission portal.
2. **Student Milestone Submission**: Intern accesses `https://professorvirus.site/prma-tech/submit/:token` to upload weekly project files (PDF/ZIP up to 50MB), enter GitHub repo links, live demo URLs, and remarks.
3. **Admin Review & Feedback**: Mentors inspect deliverables, test GitHub code repositories, and assign approval verdicts or revision requests directly from the Submissions tab in the Admin Panel.
