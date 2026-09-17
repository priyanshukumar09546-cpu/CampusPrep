import fs from 'fs';
import path from 'path';

const dataDir = './src/data';
const files = fs.readdirSync(dataDir);

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('/pdfs/pyq') || line.includes('%20Quantam') || line.includes('Open.pdf')) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
});
