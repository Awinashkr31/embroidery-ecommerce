const fs = require('fs');
const file = 'C:/Users/awina/.gemini/antigravity/brain/ed4f97b1-4429-4fec-8148-1050849eb9f0/.system_generated/steps/1647/output.txt';
const text = fs.readFileSync(file, 'utf8');

const firstBrace = text.indexOf('{\n');
console.log('First brace at:', firstBrace);
if (firstBrace !== -1) {
  const jsonStr = text.slice(firstBrace, text.lastIndexOf('}') + 1);
  try {
    const data = JSON.parse(jsonStr);
    console.log('Performance Score:', (data.categories.performance.score * 100).toFixed(0));
    console.log('LCP:', data.audits['largest-contentful-paint']?.displayValue);
    console.log('FCP:', data.audits['first-contentful-paint']?.displayValue);
    console.log('TBT:', data.audits['total-blocking-time']?.displayValue);
    console.log('CLS:', data.audits['cumulative-layout-shift']?.displayValue);
  } catch (e) {
    console.log('Parse error:', e.message);
  }
}
