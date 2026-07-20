const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./lighthouse.json', 'utf8'));
const cats = data.categories;

console.log('--- SCORES ---');
Object.keys(cats).forEach(k => {
  if(cats[k].score !== null) console.log(`${cats[k].title}: ${Math.round(cats[k].score * 100)}`);
});

console.log('\n--- TOP PERFORMANCE ISSUES ---');
const audits = data.audits;
const perfAudits = cats.performance.auditRefs.filter(a => a.weight > 0);
perfAudits.forEach(a => {
  const audit = audits[a.id];
  if (audit && audit.score !== null && audit.score < 1) {
    console.log(`${audit.title}: ${audit.displayValue || Math.round(audit.score*100)} (Weight: ${a.weight})`);
    if(audit.details && audit.details.items) {
      console.log('   Items: ' + audit.details.items.length);
    }
  }
});
