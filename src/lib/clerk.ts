export function hasValidClerkPublishableKey(rawKey?: string | null): boolean {
  const key = (rawKey || "").trim();
  return (
    key.length > 20 &&
    !key.includes("YOUR_") &&
    (key.startsWith("pk_test_") || key.startsWith("pk_live_"))
  );
}
