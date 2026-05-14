export function capture(event: string, properties?: Record<string, any>) {
  // Send event to the server endpoint which forwards to PostHog
  try {
    fetch("/api/integrations/posthog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties }),
    }).catch(() => {});
  } catch (e) {
    // noop
  }
}
