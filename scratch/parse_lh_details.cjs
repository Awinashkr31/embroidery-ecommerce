const fs = require('fs');
const file = 'C:/Users/awina/.gemini/antigravity/brain/ed4f97b1-4429-4fec-8148-1050849eb9f0/.system_generated/steps/1647/output.txt';
const text = fs.readFileSync(file, 'utf8');
const firstBrace = text.indexOf('{\n');
const jsonStr = text.slice(firstBrace, text.lastIndexOf('}') + 1);
const data = JSON.parse(jsonStr);

const interestingAudits = [
  'render-blocking-resources',
  'uses-optimized-images',
  'modern-image-formats',
  'uses-responsive-images',
  'offscreen-images',
  'uses-long-cache-ttl',
  'total-byte-weight',
  'unused-javascript',
  'unused-css-rules',
  'efficient-animated-content',
  'duplicated-javascript',
  'legacy-javascript',
  'dom-size'
];

for (const k of interestingAudits) {
  const audit = data.audits[k];
  if (audit) {
    console.log(`\n=== ${audit.title} (${k}) | score: ${audit.score} | display: ${audit.displayValue} ===`);
    if (audit.details?.items?.length) {
      console.log('Items sample:');
      audit.details.items.slice(0, 8).forEach(item => {
        console.log(' -', item.url || item.label || item.node?.snippet || JSON.stringify(item).slice(0, 100));
      });
    }
  }
}
