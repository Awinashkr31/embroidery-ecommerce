const fs = require('fs');

const homePath = 'src/pages/Home.jsx';
const blockPath = 'scratch/new_return_block.jsx';

const homeContent = fs.readFileSync(homePath, 'utf8');
const blockContent = fs.readFileSync(blockPath, 'utf8');

const returnIndex = homeContent.indexOf('  return (\n');
if (returnIndex === -1) {
    console.error("Could not find '  return (\\n'");
    process.exit(1);
}

const newHomeContent = homeContent.substring(0, returnIndex) + '  return (\n' + blockContent + '\n  );\n};\n\nexport default Home;\n';

fs.writeFileSync(homePath, newHomeContent);
console.log('Successfully updated Home.jsx');
