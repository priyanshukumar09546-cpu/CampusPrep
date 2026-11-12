/**
 * PRMA Tech - Google Form Weekly Internship Submission & Webhook Service
 * Handles:
 * 1. Generating student-specific prefilled Google Form submission URLs.
 * 2. Processing and validating Google Form submissions dispatched via Google Apps Script webhooks.
 * 3. Connecting Google Form responses to the student's persistent database record.
 * 4. Providing ready-to-install Google Apps Script templates for the admin.
 */

import crypto from 'crypto';

/**
 * Standard configuration for PRMA Tech Weekly Internship Submission Google Form.
 * Can be overridden via environment variables or runtime admin settings.
 */
export const GOOGLE_FORM_CONFIG = {
  // Official PRMA Tech Google Form Base URL
  // Form title: PRMA Tech — Weekly Internship Task Submission Portal
  baseUrl: process.env.PRMA_GOOGLE_FORM_URL || 'https://docs.google.com/forms/d/e/1FAIpQLScX_prma_weekly_submission_official/viewform',
  entryIds: {
    applicationId: process.env.PRMA_GFORM_ENTRY_APP_ID || '10112233',
    offerId: process.env.PRMA_GFORM_ENTRY_OFFER_ID || '10112233',
    fullName: process.env.PRMA_GFORM_ENTRY_NAME || '20223344',
    email: process.env.PRMA_GFORM_ENTRY_EMAIL || '30334455',
    college: process.env.PRMA_GFORM_ENTRY_COLLEGE || '40445566',
    branch: process.env.PRMA_GFORM_ENTRY_BRANCH || '50556677',
    domainTitle: process.env.PRMA_GFORM_ENTRY_DOMAIN || '60667788'
  }
};

/**
 * Generates a student-specific prefilled Google Form URL using actual approved candidate data.
 *
 * @param {Object} candidate - Student application record
 * @param {Object} [customConfig] - Optional custom Google Form URL & entry ID mapping
 * @returns {string} Prefilled Google Form URL
 */
export function generateStudentGoogleFormUrl(candidate = {}, customConfig = null) {
  const config = customConfig || GOOGLE_FORM_CONFIG;
  const baseUrl = (config.baseUrl || GOOGLE_FORM_CONFIG.baseUrl).trim();

  // If baseUrl already has query params, clean it
  const cleanBase = baseUrl.split('?')[0];

  const studentName = candidate.student?.fullName || candidate.fullName || candidate.studentName || '';
  const email = candidate.student?.email || candidate.email || '';
  const college = candidate.academic?.college || candidate.college || '';
  const branch = candidate.academic?.branch || candidate.branch || candidate.course || '';
  const domainTitle = candidate.technical?.domainTitle || candidate.domainTitle || candidate.domain?.title || '';
  const offerOrAppId = candidate.offerId || candidate.applicationId || '';

  const entries = config.entryIds || GOOGLE_FORM_CONFIG.entryIds;

  const params = new URLSearchParams();
  params.append('usp', 'pp_url');

  if (entries.applicationId && offerOrAppId) {
    params.append(`entry.${entries.applicationId}`, offerOrAppId);
  }
  if (entries.fullName && studentName) {
    params.append(`entry.${entries.fullName}`, studentName);
  }
  if (entries.email && email) {
    params.append(`entry.${entries.email}`, email);
  }
  if (entries.college && college) {
    params.append(`entry.${entries.college}`, college);
  }
  if (entries.branch && branch) {
    params.append(`entry.${entries.branch}`, branch);
  }
  if (entries.domainTitle && domainTitle) {
    params.append(`entry.${entries.domainTitle}`, domainTitle);
  }

  return `${cleanBase}?${params.toString()}`;
}

/**
 * Normalizes keys to easily extract data from Google Apps Script payloads
 */
function normalizeKey(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Parses and validates incoming Google Apps Script webhook payloads
 * Supports both structured JSON objects and raw key-value form maps
 *
 * @param {Object} rawBody
 * @returns {Object} Normalized submission data
 */
export function parseGoogleFormWebhookPayload(rawBody = {}) {
  // If wrapped in payload string or data string
  let body = rawBody;
  if (typeof rawBody === 'string') {
    try {
      body = JSON.parse(rawBody);
    } catch {
      body = {};
    }
  }

  // Create lookup dictionary of normalized keys
  const lookup = {};
  for (const [k, v] of Object.entries(body)) {
    lookup[normalizeKey(k)] = v;
  }

  // Helper finder
  const findValue = (...patterns) => {
    for (const pat of patterns) {
      const norm = normalizeKey(pat);
      for (const [k, v] of Object.entries(lookup)) {
        if (k === norm || k.includes(norm)) {
          if (v !== undefined && v !== null && String(v).trim() !== '') {
            return v;
          }
        }
      }
    }
    return '';
  };

  // 1. Identify Candidate / Application Identifier
  const rawId = findValue('applicationid', 'offerid', 'candidateid', 'internshipid', 'appid', 'id');
  const email = String(findValue('email', 'emailaddress', 'respondentemail')).trim();
  const fullName = String(findValue('fullname', 'name', 'studentname', 'candidatename')).trim();
  const domainTitle = String(findValue('internshipdomain', 'domain', 'track', 'domaintitle')).trim();

  // 2. Identify Selected Week (1, 2, 3, or 4)
  const rawWeek = String(findValue('selectweek', 'weeknumber', 'week', 'milestone', 'taskweek')).trim();
  let weekNumber = 1;
  const weekMatch = rawWeek.match(/([1-4])/);
  if (weekMatch) {
    weekNumber = parseInt(weekMatch[1], 10);
  } else if (rawWeek.toLowerCase().includes('two') || rawWeek.toLowerCase().includes('second')) {
    weekNumber = 2;
  } else if (rawWeek.toLowerCase().includes('three') || rawWeek.toLowerCase().includes('third')) {
    weekNumber = 3;
  } else if (rawWeek.toLowerCase().includes('four') || rawWeek.toLowerCase().includes('fourth')) {
    weekNumber = 4;
  }

  // 3. Technical Deliverables
  const taskTitle = String(findValue('tasktitle', 'title', 'deliverabletitle', 'milestonetitle') || `Week ${weekNumber} Deliverable`).trim();
  const githubUrl = String(findValue('githubrepositoryurl', 'githuburl', 'githubrepo', 'github', 'repository')).trim();
  const liveUrl = String(findValue('livedemourl', 'liveurl', 'demourl', 'deployedurl', 'websiteurl')).trim();
  const workDescription = String(findValue('workdescription', 'description', 'remarks', 'notes', 'summary', 'studentremarks')).trim();

  // 4. Social Verification Links
  const instagramUrl = String(findValue('instagramprofileurl', 'instagramurl', 'instagramhandle', 'instagram')).trim();
  const linkedinUrl = String(findValue('linkedinprofileurl', 'linkedinurl', 'linkedinprofile', 'linkedin')).trim();
  const instaFollowRaw = String(findValue('instagramfollowconfirmation', 'followedinstagram', 'instagramfollow')).toLowerCase();
  const linkedinFollowRaw = String(findValue('linkedinfollowconfirmation', 'followedlinkedin', 'linkedinfollow')).toLowerCase();

  const followedInstagram = instaFollowRaw.includes('yes') || instaFollowRaw.includes('true') || instaFollowRaw.includes('checked') || instaFollowRaw.includes('followed');
  const followedLinkedIn = linkedinFollowRaw.includes('yes') || linkedinFollowRaw.includes('true') || linkedinFollowRaw.includes('checked') || linkedinFollowRaw.includes('followed');

  // 5. File References (Google Drive URLs or direct links)
  const projectZipUrl = String(findValue('projectzipsourcecode', 'projectzip', 'sourcecode', 'zipfile', 'codezip', 'zipurl', 'drivefile')).trim();
  const documentationPdfUrl = String(findValue('documentationpdf', 'docpdf', 'reportpdf', 'pdfurl', 'documentation')).trim();

  const files = [];
  if (projectZipUrl) {
    files.push({
      fileId: `gform-zip-${Date.now()}`,
      fileName: 'Project_Source_Code_Archive.zip',
      fileType: 'application/zip',
      fileSize: 0,
      dataUrl: projectZipUrl
    });
  }
  if (documentationPdfUrl && documentationPdfUrl !== projectZipUrl) {
    files.push({
      fileId: `gform-pdf-${Date.now()}`,
      fileName: 'Project_Documentation_Report.pdf',
      fileType: 'application/pdf',
      fileSize: 0,
      dataUrl: documentationPdfUrl
    });
  }

  // 6. Metadata
  const submissionTimestamp = String(findValue('timestamp', 'submittedat') || new Date().toISOString());
  const uniqueSubmissionId = `GF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    rawId,
    email,
    fullName,
    domainTitle,
    weekNumber,
    taskTitle,
    githubUrl,
    liveUrl,
    workDescription,
    instagramUrl,
    linkedinUrl,
    followedInstagram,
    followedLinkedIn,
    files,
    projectZipUrl,
    documentationPdfUrl,
    submissionTimestamp,
    uniqueSubmissionId,
    source: 'google_form'
  };
}

/**
 * Generates ready-to-paste Google Apps Script code for PRMA Tech administrators.
 * This script is installed into the Google Form container:
 * Extensions > Apps Script > Paste > Add 'On form submit' trigger.
 *
 * @param {string} webhookUrl - Backend endpoint
 * @param {string} [secret] - Optional webhook authorization secret
 * @returns {string} Google Apps Script code
 */
export function generateGoogleAppsScriptCode(webhookUrl = 'https://professorvirus.site/api/prma/submissions/google-form-webhook', secret = 'prma_webhook_secure_2026') {
  return `/**
 * PRMA Tech — Automated Google Form to Database Webhook Bridge
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your PRMA Tech Weekly Task Submission Google Form.
 * 2. Click the three dots (top-right) > Extensions > Apps Script.
 * 3. Replace all existing code with this script.
 * 4. Click Save (Disk icon).
 * 5. Click "Triggers" (Alarm clock icon on the left).
 * 6. Click "+ Add Trigger" (bottom right).
 * 7. Configure:
 *    - Choose function to run: onFormSubmit
 *    - Select event source: From form
 *    - Select event type: On form submit
 * 8. Click Save and authorize Google permissions.
 */

function onFormSubmit(e) {
  var WEBHOOK_URL = "${webhookUrl}";
  var WEBHOOK_SECRET = "${secret}";
  
  try {
    var response = e.response;
    var itemResponses = response.getItemResponses();
    
    var payload = {
      timestamp: response.getTimestamp().toISOString(),
      respondentEmail: response.getRespondentEmail() || ""
    };
    
    for (var i = 0; i < itemResponses.length; i++) {
      var itemResponse = itemResponses[i];
      var questionTitle = itemResponse.getItem().getTitle();
      var answer = itemResponse.getResponse();
      
      // If answer is an array (e.g. multiple checkboxes or file uploads)
      if (Array.isArray(answer)) {
        payload[questionTitle] = answer.join(", ");
      } else {
        payload[questionTitle] = answer;
      }
    }
    
    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-prma-webhook-secret": WEBHOOK_SECRET
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    var res = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("PRMA Webhook Response Code: " + res.getResponseCode());
    Logger.log("PRMA Webhook Response: " + res.getContentText());
  } catch (err) {
    Logger.log("PRMA Webhook Error: " + err.toString());
  }
}
`;
}
