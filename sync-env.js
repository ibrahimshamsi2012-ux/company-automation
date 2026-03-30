const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("--- Syncing keys from .env.local to Vercel ---");
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);

const varsToSync = [];
for (const line of lines) {
  // Matches KEY=VALUE while ignoring comments
  const match = line.match(/^([^#\s=]+)=(.+)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    
    // Remove potential trailing comments like "KEY=VAL # some comment"
    if (value.includes(' #')) {
      value = value.split(' #')[0].trim();
    }
    
    // Aggressively remove surrounding quotes AND ALL non-printable characters/whitespace
    // This is the CRITICAL fix for the "Invalid character" atob build error
    value = value.replace(/^["'](.+)["']$/, '$1').replace(/[^\x20-\x7E]/g, '').trim();

    // Log which keys are being found for debugging
    if (key.includes('LIVEKIT')) {
      console.log(`  Found LiveKit Key: ${key}`);
    }

    if (key && value && !value.includes('YOUR_')) {
      varsToSync.push({ key, value });
    }
  }
}

console.log(`Found ${varsToSync.length} variables to sync.`);

for (const { key, value } of varsToSync) {
  console.log(`\nProcessing ${key}...`);
  try {
    // 1. Force remove from all environments first to ensure clean state
    console.log(`  Cleaning existing ${key}...`);
    try { execSync(`vercel env rm ${key} production -y`, { stdio: 'ignore' }); } catch(e){}
    try { execSync(`vercel env rm ${key} preview -y`, { stdio: 'ignore' }); } catch(e){}
    try { execSync(`vercel env rm ${key} development -y`, { stdio: 'ignore' }); } catch(e){}
    
    // 2. Add using a temporary file to avoid shell escaping issues (especially newlines from PowerShell)
    const tempFile = 'temp_val.txt';
    // Use fs.writeFileSync with just the raw value, NO extra characters
    fs.writeFileSync(tempFile, value);
    
    console.log(`  Adding ${key} to all environments...`);
    execSync(`vercel env add ${key} production < ${tempFile}`, { stdio: 'inherit' });
    execSync(`vercel env add ${key} preview < ${tempFile}`, { stdio: 'inherit' });
    execSync(`vercel env add ${key} development < ${tempFile}`, { stdio: 'inherit' });
    
    fs.unlinkSync(tempFile);
  } catch (e) {
    console.error(`  Failed to sync ${key}: ${e.message}`);
  }
}

console.log("\n--- Syncing Code to GitHub ---");
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Final build-safe production fixes"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
} catch (e) {
  console.log("Git push skipped or failed (might already be up to date).");
}

console.log("\n--- Triggering Final Production Deployment ---");
try {
  // Use --prod to force a production build
  execSync('vercel --prod --yes', { stdio: 'inherit' });
} catch (e) {
  console.error("Deployment command sent. Check Vercel Dashboard for progress.");
}
