export const FEATURE_FLAGS = {
  MEETING_AUTOMATION: true,
  AI_AGENT: true,
  EMAIL_INTELLIGENCE: true,
  TASK_ENGINE: true,
  BETA_ACCESS: process.env.NODE_ENV === 'development',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag] ?? false;
}

export const BETA_USERS = [
  // Add user IDs or emails here
  'admin@example.com',
];

export function hasBetaAccess(userEmail?: string): boolean {
  if (FEATURE_FLAGS.BETA_ACCESS) return true;
  return userEmail ? BETA_USERS.includes(userEmail) : false;
}
