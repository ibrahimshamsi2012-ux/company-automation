export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Check if we are in a build environment or missing keys
    if (!process.env.LIVEKIT_API_KEY || process.env.LIVEKIT_API_KEY.includes('YOUR_')) {
      return new Response(JSON.stringify({ token: "build-mode-skip" }), { status: 200 });
    }

    // Move Clerk inside to prevent build-time crashes
    const { auth } = await import("@clerk/nextjs");
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room") || "meeting-room";

    // Dynamically import to prevent build-time crashes
    const { AccessToken } = await import("livekit-server-sdk");

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: userId,
        name: "User-" + userId.slice(-4),
      }
    );

    at.addGrant({ roomJoin: true, room: room, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log("[MEETING_TOKEN_ERROR]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
