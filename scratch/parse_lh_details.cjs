const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./lighthouse.json', 'utf8'));

console.log('--- LCP Element ---');
const lcpAudit = data.audits['largest-contentful-paint-element'];
if(lcpAudit && lcpAudit.details && lcpAudit.details.items) {
  console.log(lcpAudit.details.items[0]);
}

console.log('\n--- CLS Elements ---');
const clsAudit = data.audits['layout-shift-elements'];
if(clsAudit && clsAudit.details && clsAudit.details.items) {
  clsAudit.details.items.forEach(item => {
    console.log(item);
  });
}

console.log('\n--- Render Blocking Resources ---');
const rbAudit = data.audits['render-blocking-resources'];
if(rbAudit && rbAudit.details && rbAudit.details.items) {
  rbAudit.details.items.forEach(item => console.log(item.url, item.totalBytes));
}

console.log('\n--- Unused CSS ---');
const uCss = data.audits['unused-css-rules'];
if(uCss && uCss.details && uCss.details.items) {
  uCss.details.items.forEach(item => console.log(item.url, item.totalBytes, item.wastedBytes));
}
