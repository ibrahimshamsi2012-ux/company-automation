import { logger } from "@/lib/logger";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    if (!isFeatureEnabled('MEETING_AUTOMATION')) {
      return new Response(JSON.stringify({ error: "Meeting automation is disabled" }), { status: 403 });
    }

    // Move Clerk inside to prevent build-time crashes
    const { auth, currentUser } = await import("@clerk/nextjs");
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const roomName = body.roomName || `Meeting-${Math.random().toString(36).substring(7)}`;

    logger.info(`Starting meeting request for room: ${roomName}`);

    // Dynamic import to prevent build-time crashes
    const { MeetingOrchestrator } = await import("@/lib/meeting-orchestrator");
    const meetingData = await MeetingOrchestrator.createMeeting(
      roomName,
      userId,
      `${user.firstName} ${user.lastName}`.trim() || user.username || "Guest"
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
