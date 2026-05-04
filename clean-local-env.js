const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error(".env.local not found");
  process.exit(1);
}

let content = fs.readFileSync(envPath, 'utf8');
const lines = content.split(/\r?\n/);
const newLines = [];

let changed = false;

for (let line of lines) {
  const match = line.match(/^([^#\s=]+)=(.+)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    
    // Remove potential trailing comments
    if (value.includes(' #')) {
      value = value.split(' #')[0].trim();
    }
    
    // Aggressively clean value
    const cleanedValue = value.replace(/^["'](.+)["']$/, '$1').replace(/[^\x20-\x7E]/g, '').trim();
    
    if (value !== cleanedValue) {
      console.log(`Cleaning ${key}...`);
      changed = true;
    }
    
    newLines.push(`${key}=${cleanedValue}`);
  } else {
    newLines.push(line);
  }
}

if (changed) {
  fs.writeFileSync(envPath, newLines.join('\n'));
  console.log(".env.local cleaned successfully.");
} else {
  console.log(".env.local was already clean.");
}
