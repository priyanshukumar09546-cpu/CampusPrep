import JSZip from 'jszip';

/**
 * Downloads a ZIP package of real notes for a specific AKTU subject & unit.
 * @param {Object} params
 * @param {string} params.subjectCode
 * @param {string} params.subjectName
 * @param {number} params.unitNo
 * @param {string} params.unitTitle
 * @param {Array} params.topics
 * @param {Array} params.notes
 */
export async function downloadUnitZip({ subjectCode, subjectName, unitNo, unitTitle, topics = [], notes = [] }) {
  if (!notes || notes.length === 0) {
    alert(`No downloadable note files exist for Unit ${unitNo} yet.`);
    return;
  }

  const zip = new JSZip();
  const folderName = `${subjectCode || 'AKTU'}_Unit_${unitNo}_Notes`;
  const folder = zip.folder(folderName);

  // Add README text file with official unit topics and metadata
  const readmeContent = `
===================================================================
CAMPUSPREP OFFICIAL AKTU UNIT NOTES PACKAGE
===================================================================
Subject Code : ${subjectCode || 'N/A'}
Subject Name : ${subjectName}
Unit Number  : Unit ${unitNo}
Unit Title   : ${unitTitle}
Date Package : ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
===================================================================

OFFICIAL AKTU SYLLABUS TOPICS COVERED:
-------------------------------------------------------------------
${topics.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

===================================================================
NOTES INCLUDED IN THIS ZIP:
===================================================================
${notes.map((n, idx) => `${idx + 1}. ${n.title} (By: ${n.author || 'CampusPrep Contributor'})`).join('\n')}

===================================================================
CampusPrep — Study Smart. Prepare Better.
Visit: https://campusprep.edu/notes
===================================================================
  `.trim();

  folder.file('README_SYLLABUS_OVERVIEW.txt', readmeContent);

  // Fetch or attach note files
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const safeTitle = (note.title || `Unit_${unitNo}_Note_${i + 1}`)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);

    const filename = `${safeTitle}.pdf`;

    if (note.fileUrl && !note.fileUrl.includes('dummy.pdf')) {
      try {
        const response = await fetch(note.fileUrl);
        if (response.ok) {
          const blob = await response.blob();
          folder.file(filename, blob);
          continue;
        }
      } catch (err) {
        console.warn(`Could not fetch external file for zip: ${note.fileUrl}, falling back to note summary.`);
      }
    }

    // Generate structured verified note summary text file inside ZIP if direct blob fetch is remote/CORS
    const noteTextContent = `
===================================================================
CAMPUSPREP VERIFIED AKTU NOTE RESOURCE
===================================================================
Title       : ${note.title}
Subject     : ${subjectName} (${subjectCode})
Unit        : Unit ${unitNo} - ${unitTitle}
Note Type   : ${note.type || 'Unit Notes'}
Author      : ${note.author || 'CampusPrep Contributor'}
Date Added  : ${note.date || 'Recent'}
Direct Link : ${note.fileUrl || 'https://campusprep.edu/notes'}
===================================================================

SYLLABUS COVERAGE:
${topics.map((t, idx) => `• ${t}`).join('\n')}

INSTRUCTIONS:
Open the direct PDF link in your browser to view the original full high-resolution handwritten scans.

— CampusPrep Academic Notes Team
    `.trim();

    folder.file(`${safeTitle}_Summary.txt`, noteTextContent);
  }

  // Generate ZIP blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${subjectCode || 'AKTU'}_Unit_${unitNo}_${subjectName.replace(/\s+/g, '_')}_Notes.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
