const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const keysToRemove = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "STRIPE_API_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "OPENAI_API_KEY",
  "LIVEKIT_API_KEY",
  "LIVEKIT_API_SECRET",
  "NEXT_PUBLIC_LIVEKIT_URL",
  "DATABASE_URL"
];

console.log("--- Cleaning up existing Vercel variables ---");
for (const key of keysToRemove) {
  try {
    // Force remove from all environments to ensure no duplicates/corruption
    execSync(`vercel env rm ${key} production -y`, { stdio: 'ignore' });
    execSync(`vercel env rm ${key} preview -y`, { stdio: 'ignore' });
    execSync(`vercel env rm ${key} development -y`, { stdio: 'ignore' });
    console.log(`Cleaned ${key}`);
  } catch (e) {
    // Ignore if key doesn't exist
  }
}

console.log("\n--- Syncing keys from .env.local to Vercel ---");
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split(/\r?\n/);

for (const line of lines) {
  const match = line.match(/^([^#\s=]+)=(.+)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["'](.+)["']$/, '$1'); // Remove surrounding quotes

    if (key && value && !value.includes('YOUR_')) {
      console.log(`Adding ${key}...`);
      try {
        // Use temporary file to avoid shell character issues
        const tempFile = 'temp_val.txt';
        fs.writeFileSync(tempFile, value);
        
        // Add to all environments
        execSync(`vercel env add ${key} production < ${tempFile}`, { stdio: 'inherit' });
        execSync(`vercel env add ${key} preview < ${tempFile}`, { stdio: 'inherit' });
        execSync(`vercel env add ${key} development < ${tempFile}`, { stdio: 'inherit' });
        
        fs.unlinkSync(tempFile);
      } catch (e) {
        console.error(`Failed to add ${key}: ${e.message}`);
      }
    }
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
  execSync('vercel --prod', { stdio: 'inherit' });
} catch (e) {
  console.error("Deployment command sent. Check Vercel Dashboard for progress.");
}
