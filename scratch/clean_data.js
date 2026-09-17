import fs from 'fs';

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove fake aktu-quantum.tech/pdfs/... URLs
  content = content.replace(/https:\/\/aktu-quantum\.tech\/pdfs\/[^\s"'`]+/g, 'https://aktu-quantum.tech/');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${filePath}`);
}

cleanFile('./src/data/aktuSyllabusData.js');
cleanFile('./src/data/aktuPyqData.js');
cleanFile('./src/data/aktuQuantumNotes.js');
cleanFile('./src/data/aktuQuantumNotes.ts');
