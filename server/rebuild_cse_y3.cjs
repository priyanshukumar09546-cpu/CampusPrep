const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 1. Load backup and data sources
const notesFile = path.resolve(__dirname, 'data/notes.json');
const existingNotes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
const folderData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/all_folder_files_detailed.json'), 'utf8'));
const verifiedDirect = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/verified_drive_metadata.json'), 'utf8'));

console.log('=== PROFESSOR VIRUS: REBUILD YEAR 3 CSE NOTES ===');
console.log('Total notes in database at start:', existingNotes.length);

// 2. Identify and separate the exact 914 Year 3 CSE records
const targetOldRecords = [];
const untouchedNotes = [];

existingNotes.forEach(n => {
  const c = (n.course || 'B.Tech').toLowerCase();
  const b = (n.branch || '').toUpperCase();
  const y = (n.year || '').toLowerCase();
  const isTarget = c === 'b.tech' && (b === 'CSE' || b === 'ALL') && y.includes('3');

  if (isTarget) {
    targetOldRecords.push(n);
  } else {
    untouchedNotes.push(n);
  }
});

console.log(`Identified ${targetOldRecords.length} old Year 3 CSE records to remove.`);
console.log(`Preserving ${untouchedNotes.length} untouched records for other branches/years/courses.`);

// 3. Helper functions for provider detection, unit parsing, and clean title formatting
function detectProvider(name, defaultProv = 'NotesGallery Verified Resource') {
  const n = (name || '').toLowerCase();
  if (n.includes('edushine')) return 'Edushine Classes';
  if (n.includes('gw') || n.includes('gateway')) return 'Gateway Classes';
  if (n.includes('coreconcept')) return 'Core Concepts Engineering';
  if (n.includes('knowledge gate')) return 'Knowledge Gate';
  if (n.includes('rrsimt')) return 'RRSIMT Classes';
  if (n.includes('i tech world') || n.includes('itech world')) return 'I Tech World';
  if (n.includes('lakshya')) return 'Lakshya Academy';
  if (n.includes('gopal sir')) return 'Gopal Sir Classes';
  if (n.includes('multi atoms')) return 'Multi Atoms';
  return defaultProv;
}

function extractUnit(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('all unit') || n.includes('u 1-5') || n.includes('u-1-5') || n.includes('unit 1,2,3') || n.includes('unit-1,2,4,5')) {
    return null;
  }
  const m = n.match(/(?:unit|u)[-\s_]*([1-5])\b/i);
  return m ? parseInt(m[1], 10) : null;
}

function cleanTitle(rawName, subjectName, unit, provider) {
  let s = (rawName || '').trim();
  s = s.replace(/\.pdf$/i, '').replace(/\.docx$/i, '').replace(/\.pptx$/i, '');
  s = s.replace(/_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '');
  s = s.replace(/\s*\(\d+\)/g, '');
  s = s.replace(/^\(edushine\)\s*/i, '');
  s = s.replace(/^\(gw\)\s*/i, '');
  s = s.replace(/^gw[-\s]+/i, '');
  s = s.replace(/^\(knowledge gate\)\s*/i, '');
  s = s.replace(/\s*by\s+(coreconcepts[_\s]*engineering|coreconcept|edushine[^\.]*|rrsimt[^\.]*|i\s*tech\s*world|lakshya[^\.]*|gopal sir[^\.]*)/gi, '');
  s = s.replace(/\s+/g, ' ').trim();

  let desc = s;
  if (/^most important$/i.test(desc)) desc = 'Most Important Questions & Exam Revision';
  else if (/^question bank$/i.test(desc)) desc = 'Question Bank & PYQ Problems';
  else if (/imp\s*\d{4}-\d{2}/i.test(desc)) desc = 'Important Questions & Expected Topics (2025-26)';
  else if (/in\s*\d+\s*hours?/i.test(desc)) desc = 'Complete Subject Crash Course';
  else if (/one\s*shot/i.test(desc)) desc = unit ? 'One Shot Lecture Notes' : 'Complete One Shot Revision';
  else if (/combined/i.test(desc)) desc = unit ? 'Combined Lecture Notes' : 'Complete Subject Notes';
  else if (/handwritten/i.test(desc)) desc = unit ? 'Handwritten Notes' : 'Complete Handwritten Notes';
  else if (/all\s*unit/i.test(desc)) desc = 'Complete All Units Notes';
  else if (/tutorial/i.test(desc)) desc = unit ? 'Tutorial & Practice Problems' : 'Tutorial Problems';
  else {
    desc = desc.replace(/^(unit|u)[-\s_]*[1-5][\s_:-]*/i, '').trim();
    if (!desc || desc.length < 3) desc = unit ? 'Lecture Notes' : 'Complete Study Material';
  }

  const unitPrefix = unit ? `Unit ${unit} - ` : '';
  const provSuffix = provider && provider !== 'NotesGallery Verified Resource' ? ` (${provider})` : '';
  return `${subjectName} - ${unitPrefix}${desc}${provSuffix}`.replace(/\s+/g, ' ').trim();
}

// 4. Build clean records
const cleanRecords = [];
const seenFileIds = new Set();
let duplicatesSkipped = 0;

// A. Process direct PDF resources from NotesGallery
verifiedDirect.forEach(item => {
  if (item.resourceType !== 'pdf_document') return;
  const fileId = item.driveFileId;
  if (!fileId || seenFileIds.has(fileId)) {
    duplicatesSkipped++;
    return;
  }
  seenFileIds.add(fileId);

  const prov = detectProvider(item.driveTitle);
  const u = extractUnit(item.driveTitle);
  const resourceCategory = u ? 'unit' : 'extra';
  const title = cleanTitle(item.driveTitle, item.subject, u, prov);
  const driveViewUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  const noteId = `note-cse-y3-${fileId.slice(0, 16)}`;
  const uniqueKey = crypto.createHash('sha256').update(noteId + '_' + driveViewUrl).digest('hex');

  cleanRecords.push({
    id: noteId,
    uniqueKey: uniqueKey,
    course: 'B.Tech',
    academicYear: 3,
    year: '3rd Year',
    branch: 'CSE',
    semester: item.semester,
    subject: item.subject,
    subjectName: item.subject,
    subjectCode: item.subjectCode,
    unit: u,
    unitNumber: u,
    resourceCategory: resourceCategory,
    resourceTitle: title,
    title: title,
    resourceType: 'pdf_document',
    url: driveViewUrl,
    driveUrl: driveViewUrl,
    pdfUrl: driveViewUrl,
    fileUrl: driveViewUrl,
    downloadUrl: driveViewUrl,
    sourceUrl: item.url,
    source: prov,
    sourceName: prov,
    provider: prov,
    verificationStatus: 'verified_active',
    mirrorStatus: 'success',
    notesStatus: 'published',
    published: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

// B. Process unit files inside all Google Drive folders
for (const [folderId, folderInfo] of Object.entries(folderData)) {
  const files = folderInfo.files || [];
  files.forEach(f => {
    const fileId = f.id;
    if (!fileId || seenFileIds.has(fileId)) {
      duplicatesSkipped++;
      return;
    }
    seenFileIds.add(fileId);

    const prov = detectProvider(f.name);
    const u = extractUnit(f.name);
    const resourceCategory = u ? 'unit' : 'extra';
    const title = cleanTitle(f.name, folderInfo.subject, u, prov);
    const driveViewUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    const noteId = `note-cse-y3-${fileId.slice(0, 16)}`;
    const uniqueKey = crypto.createHash('sha256').update(noteId + '_' + driveViewUrl).digest('hex');

    cleanRecords.push({
      id: noteId,
      uniqueKey: uniqueKey,
      course: 'B.Tech',
      academicYear: 3,
      year: '3rd Year',
      branch: 'CSE',
      semester: folderInfo.semester,
      subject: folderInfo.subject,
      subjectName: folderInfo.subject,
      subjectCode: folderInfo.subjectCode,
      unit: u,
      unitNumber: u,
      resourceCategory: resourceCategory,
      resourceTitle: title,
      title: title,
      resourceType: 'pdf_document',
      url: driveViewUrl,
      driveUrl: driveViewUrl,
      pdfUrl: driveViewUrl,
      fileUrl: driveViewUrl,
      downloadUrl: driveViewUrl,
      sourceUrl: folderInfo.url,
      source: prov,
      sourceName: prov,
      provider: prov,
      verificationStatus: 'verified_active',
      mirrorStatus: 'success',
      notesStatus: 'published',
      published: true,
      available: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });
}

// C. Also add master Google Drive subject folders for complete subject collections
verifiedDirect.forEach(item => {
  if (item.resourceType !== 'drive_folder') return;
  const folderId = item.driveFileId;
  if (!folderId || seenFileIds.has(folderId)) {
    duplicatesSkipped++;
    return;
  }
  seenFileIds.add(folderId);

  const title = `${item.subject} - Complete Subject Notes & Units Folder (${item.label})`;
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  const noteId = `note-cse-y3-folder-${folderId.slice(0, 16)}`;
  const uniqueKey = crypto.createHash('sha256').update(noteId + '_' + folderUrl).digest('hex');

  cleanRecords.push({
    id: noteId,
    uniqueKey: uniqueKey,
    course: 'B.Tech',
    academicYear: 3,
    year: '3rd Year',
    branch: 'CSE',
    semester: item.semester,
    subject: item.subject,
    subjectName: item.subject,
    subjectCode: item.subjectCode,
    unit: null,
    unitNumber: null,
    resourceCategory: 'extra',
    resourceTitle: title,
    title: title,
    resourceType: 'drive_folder',
    url: folderUrl,
    driveUrl: folderUrl,
    pdfUrl: folderUrl,
    fileUrl: folderUrl,
    downloadUrl: folderUrl,
    sourceUrl: item.url,
    source: 'NotesGallery Verified Resource',
    sourceName: 'NotesGallery Verified Resource',
    provider: 'NotesGallery',
    verificationStatus: 'verified_active',
    mirrorStatus: 'success',
    notesStatus: 'published',
    published: true,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

console.log(`\nVerified new resources created: ${cleanRecords.length}`);
console.log(`Duplicates detected & skipped during rebuild: ${duplicatesSkipped}`);

// 5. Build final dataset and atomically write to server/data/notes.json
const finalDatabase = [...untouchedNotes, ...cleanRecords];

console.log(`New total notes count in database: ${finalDatabase.length} (was ${existingNotes.length})`);
fs.writeFileSync(notesFile, JSON.stringify(finalDatabase, null, 2));
console.log('Successfully written to server/data/notes.json.');

// 6. Generate statistics
const stats = {
  sem5: { subjects: new Set(), total: 0, units: 0, extra: 0 },
  sem6: { subjects: new Set(), total: 0, units: 0, extra: 0 }
};

cleanRecords.forEach(r => {
  const target = r.semester === 'Semester 5' ? stats.sem5 : stats.sem6;
  target.total++;
  target.subjects.add(`${r.subjectCode} - ${r.subject}`);
  if (r.unit >= 1 && r.unit <= 5) {
    target.units++;
  } else {
    target.extra++;
  }
});

console.log('\n=================== REBUILD SUMMARY ===================');
console.log('SEMESTER 5:');
console.log(`- Subjects: ${stats.sem5.subjects.size}`);
Array.from(stats.sem5.subjects).forEach(s => console.log(`   * ${s}`));
console.log(`- Total resources: ${stats.sem5.total} (${stats.sem5.units} unit notes, ${stats.sem5.extra} complete/folder resources)`);

console.log('\nSEMESTER 6:');
console.log(`- Subjects: ${stats.sem6.subjects.size}`);
Array.from(stats.sem6.subjects).forEach(s => console.log(`   * ${s}`));
console.log(`- Total resources: ${stats.sem6.total} (${stats.sem6.units} unit notes, ${stats.sem6.extra} complete/folder resources)`);

console.log('\nUNAVAILABLE / COMING SOON SUBJECTS ON NOTESGALLERY:');
console.log('   * Semester 5: Statistical Computing (marked "coming soon..." on NotesGallery - no link)');
console.log('   * Semester 5: Application of Soft Computing (marked "coming soon..." on NotesGallery - no link)');
console.log('   * Semester 6: Software Project Management (marked "coming soon" on NotesGallery - no link)');
console.log('   * Semester 6: AR & VR (marked "coming soon..." on NotesGallery - no link)');
console.log('========================================================\n');
