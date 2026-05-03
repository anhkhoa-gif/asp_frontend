const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('e:/LibaryManagement/web11/src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('http://localhost:5246')) {
    content = content.replace(/http:\/\/localhost:5246/g, 'http://localhost:10000');
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
  }
});
