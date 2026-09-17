import { AKTU_SYLLABUS_DATA } from '../src/data/aktuSyllabusData.js';

console.log("Total subjects in AKTU_SYLLABUS_DATA:", AKTU_SYLLABUS_DATA.length);

const grouped = {};
AKTU_SYLLABUS_DATA.forEach(s => {
  const key = `${s.year} -> ${s.semester}`;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(`${s.code}: ${s.subject} (Branch: ${s.branch}, Applicable: ${s.applicableBranches ? s.applicableBranches.join(',') : 'N/A'})`);
});

console.log(JSON.stringify(grouped, null, 2));
