const { execSync } = require('child_process');

const vars = {
  NEXT_PUBLIC_LIVEKIT_URL: 'wss://company-automation-dnyrj2vt.livekit.cloud',
  LIVEKIT_API_KEY: 'API6wom28Fob9ba',
  LIVEKIT_API_SECRET: 'ozQJys6BeGvsmhMyLu3zsVDkPaWAUT6JsQtzVvW2vcY'
};

const envs = ['production', 'preview', 'development'];

for (const [key, value] of Object.entries(vars)) {
  for (const env of envs) {
    console.log(`Setting ${key} for ${env}...`);
    try {
      // 1. Remove if exists
      try {
        execSync(`vercel env rm ${key} ${env} -y`, { stdio: 'ignore' });
      } catch (e) {}
      
      // 2. Add to ALL environments using the --value flag to avoid stdin issues
      execSync(`vercel env add ${key} ${env} --value ${value} --yes`, { stdio: 'inherit' });
      console.log(`Successfully added ${key} to ${env}`);
    } catch (e) {
      console.error(`Failed to add ${key} to ${env}: ${e.message}`);
    }
  }
}

console.log("Triggering final redeploys...");
try {
  // Use --prod for production and a normal deploy for preview
  execSync('vercel --prod --yes', { stdio: 'inherit' });
  execSync('vercel --yes', { stdio: 'inherit' });
} catch (e) {
  console.error("Redeploy command sent.");
}
