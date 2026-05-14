import { logger } from "@/lib/logger";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function sanitizeRoomName(input?: string): string {
  const raw = (input || "").trim();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "");
  return safe || `Meeting-${Math.random().toString(36).slice(2, 9)}`;
}

function createGuestId(): string {
  return `guest_${Math.random().toString(36).slice(2, 12)}`;
}

export async function POST(req: Request) {
  try {
    if (!isFeatureEnabled('MEETING_AUTOMATION')) {
      return new Response(JSON.stringify({ error: "Meeting automation is disabled" }), { status: 403 });
    }

    let userId: string | null = null;
    try {
      // Keep Clerk optional for launch reliability across devices/extensions.
      const { auth } = await import("@clerk/nextjs");
      userId = auth()?.userId || null;
    } catch (authError: any) {
      logger.warn(`[API_MEETING_START_AUTH_WARN] ${authError?.message || "Auth parse failed"}`);
    }

    const body = await req.json().catch(() => ({}));
    const roomName = sanitizeRoomName(body.roomName);
    const effectiveUserId = userId || createGuestId();

    logger.info(`Starting meeting request for room: ${roomName}`);

    // Dynamic import to prevent build-time crashes
    const { MeetingOrchestrator } = await import("@/lib/meeting-orchestrator");
    const meetingData = await MeetingOrchestrator.createMeeting(
      roomName,
      effectiveUserId,
      `Guest-${effectiveUserId.slice(-4)}`
    );

    return new Response(JSON.stringify(meetingData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    logger.error(`[API_MEETING_START_ERROR] ${error.message}`);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
