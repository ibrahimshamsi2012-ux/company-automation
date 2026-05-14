function normalizeEnv(value?: string, fallback = ""): string {
  const raw = (value || fallback).trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function hasOnlySafeChars(value: string): boolean {
  return /^[A-Za-z0-9._:-]+$/.test(value);
}

function hasValidUrlShape(value: string): boolean {
  return value.startsWith("wss://") || value.startsWith("ws://");
}

export function getLivekitUrl(): string {
  const fallback = "wss://company-automation-dnyrj2vt.livekit.cloud";
  const value = normalizeEnv(
    process.env.NEXT_PUBLIC_LIVEKIT_URL,
    fallback
  );
  if (!value || !hasOnlySafeChars(value) || !hasValidUrlShape(value)) {
    return fallback;
  }
  return value;
}

export function getLivekitApiKey(): string {
  const fallback = "API6wom28Fob9ba";
  const value = normalizeEnv(process.env.LIVEKIT_API_KEY, fallback);
  if (!value || !hasOnlySafeChars(value)) {
    return fallback;
  }
  return value;
}

export function getLivekitApiSecret(): string {
  const fallback = "ozQJys6BeGvsmhMyLu3zsVDkPaWAUT6JsQtzVvW2vcY";
  const value = normalizeEnv(
    process.env.LIVEKIT_API_SECRET,
    fallback
  );
  if (!value || !hasOnlySafeChars(value)) {
    return fallback;
  }
  return value;
}
