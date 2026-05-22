const fs = require('fs');
const parser = require('./node_modules/@babel/parser');
const code = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf-8');
try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  console.log("No syntax error found by babel parser.");
} catch (e) {
  console.log("Error:", e.message);
  console.log("Location:", e.loc);
  
  const lines = code.split('\n');
  const errLine = e.loc.line;
  for(let i = Math.max(0, errLine - 5); i < Math.min(lines.length, errLine + 5); i++) {
    console.log(`${i+1}: ${lines[i]}`);
  }
}
